import "server-only";

import type { ProductionPreflightHQueryExecutionPort } from "./production-preflight-remote-executor-contract";

export const PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS = [
  "PROD_PREFLIGHT_TARGET_IDENTITY",
  "PROD_PREFLIGHT_SERVER_VERSION",
  "PROD_PREFLIGHT_CURRENT_DATABASE",
  "PROD_PREFLIGHT_CURRENT_USER",
  "PROD_PREFLIGHT_TRANSACTION_CAPABILITY",
  "PROD_PREFLIGHT_PGCRYPTO_EXTENSION",
  "PROD_PREFLIGHT_PGCRYPTO_SCHEMA",
  "PROD_PREFLIGHT_PGCRYPTO_DIGEST_SIGNATURE",
  "PROD_PREFLIGHT_PGCRYPTO_EXTENSION_OWNERSHIP",
  "PROD_PREFLIGHT_SHA256_CAPABILITY",
  "PROD_PREFLIGHT_AUDIT_ROLE_CONFLICTS",
  "PROD_PREFLIGHT_AUDIT_SCHEMA_CONFLICT",
  "PROD_PREFLIGHT_AUDIT_VIEW_CONFLICTS",
  "PROD_PREFLIGHT_AUDIT_FUNCTION_CONFLICTS",
  "PROD_PREFLIGHT_MIGRATION_LEDGER_IDENTITY",
  "PROD_PREFLIGHT_MIGRATION_LEDGER_COLUMNS",
  "PROD_PREFLIGHT_EXECUTOR_CAPABILITY",
  "PROD_PREFLIGHT_ROLLBACK_CAPABILITY",
] as const;
export type ProductionReadOnlyPreflightQueryId =
  (typeof PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS)[number];

export const PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER = Object.freeze([
  ...PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS,
]);
export const CANONICAL_PRODUCTION_PREFLIGHT_EXECUTION_ORDER =
  PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER;

export const PRELIGHT_SAFETY_SETTINGS = Object.freeze({
  statementTimeout: "10s",
  lockTimeout: "1s",
  idleTransactionTimeout: "15s",
  searchPath: "pg_catalog",
  applicationName: "birello_production_audit_preflight",
  clientMinMessages: "warning",
  readOnly: true as const,
});

export const PRODUCTION_PREFLIGHT_LIFECYCLE_STATES = [
  "NOT_STARTED",
  "AUTHORIZATION_VALIDATED",
  "REGISTRY_VALIDATED",
  "SESSION_OPEN_REQUESTED",
  "SESSION_OPENED",
  "SAFETY_SETTINGS_VERIFIED",
  "READ_ONLY_TRANSACTION_STARTED",
  "QUERY_EXECUTION_IN_PROGRESS",
  "ALL_RESULTS_VALIDATED",
  "READ_ONLY_TRANSACTION_COMMIT_REQUESTED",
  "READ_ONLY_TRANSACTION_COMMITTED",
  "ROLLBACK_REQUESTED",
  "ROLLBACK_COMPLETED",
  "CLOSE_REQUESTED",
  "TRANSPORT_CLOSED",
  "COMPLETED",
  "FAILED",
] as const;
export type ProductionPreflightLifecycleState =
  (typeof PRODUCTION_PREFLIGHT_LIFECYCLE_STATES)[number];

export function isProductionPreflightLifecycleState(
  value: unknown,
): value is ProductionPreflightLifecycleState {
  return (
    typeof value === "string" &&
    (PRODUCTION_PREFLIGHT_LIFECYCLE_STATES as readonly string[]).includes(value)
  );
}

export const TARGET_CLASSIFICATIONS = [
  "TARGET_READY_FOR_AUDIT_BOOTSTRAP_AUTHORIZATION_REVIEW",
  "TARGET_BLOCKED_IDENTITY_MISMATCH",
  "TARGET_BLOCKED_POSTGRES_VERSION",
  "TARGET_BLOCKED_PGCRYPTO_MISSING",
  "TARGET_BLOCKED_PGCRYPTO_SCHEMA",
  "TARGET_BLOCKED_PGCRYPTO_SIGNATURE",
  "TARGET_BLOCKED_AUDIT_ROLE_CONFLICT",
  "TARGET_BLOCKED_AUDIT_SCHEMA_CONFLICT",
  "TARGET_BLOCKED_AUDIT_VIEW_CONFLICT",
  "TARGET_BLOCKED_AUDIT_FUNCTION_CONFLICT",
  "TARGET_BLOCKED_MIGRATION_LEDGER_IDENTITY",
  "TARGET_BLOCKED_MIGRATION_LEDGER_SHAPE",
  "TARGET_BLOCKED_EXECUTOR_CAPABILITY",
  "TARGET_BLOCKED_ROLLBACK_CAPABILITY",
  "TARGET_BLOCKED_INCOMPLETE_EVIDENCE",
] as const;
export type ProductionPreflightTargetClassification =
  (typeof TARGET_CLASSIFICATIONS)[number];

export const SAFE_ERROR_CLASSES = [
  "AUTHORIZATION_REJECTED",
  "REGISTRY_INTEGRITY_REJECTED",
  "TRANSPORT_OPEN_FAILED",
  "SAFETY_SETTINGS_FAILED",
  "READ_ONLY_TRANSACTION_START_FAILED",
  "QUERY_EXECUTION_FAILED",
  "RESULT_VALIDATION_FAILED",
  "TRANSACTION_COMMIT_FAILED",
  "TRANSACTION_ROLLBACK_FAILED",
  "TRANSPORT_CLOSE_FAILED",
  "TARGET_CLASSIFICATION_FAILED",
  "UNKNOWN_SAFE_FAILURE",
] as const;
export type ProductionPreflightSafeErrorClass =
  (typeof SAFE_ERROR_CLASSES)[number];

export const SAFE_SQLSTATE_CLASSES = [
  "CONNECTION_EXCEPTION",
  "INSUFFICIENT_PRIVILEGE",
  "INVALID_TRANSACTION_STATE",
  "QUERY_CANCELED",
  "OBJECT_NOT_IN_PREREQUISITE_STATE",
  "UNKNOWN_SQLSTATE_CLASS",
  null,
] as const;
export type ProductionPreflightSafeSqlStateClass =
  | "CONNECTION_EXCEPTION"
  | "INSUFFICIENT_PRIVILEGE"
  | "INVALID_TRANSACTION_STATE"
  | "QUERY_CANCELED"
  | "OBJECT_NOT_IN_PREREQUISITE_STATE"
  | "UNKNOWN_SQLSTATE_CLASS"
  | null;

export type ProductionReadOnlyPreflightResultSchemaId =
  | "TARGET_IDENTITY_RESULT"
  | "SERVER_VERSION_RESULT"
  | "CURRENT_DATABASE_RESULT"
  | "CURRENT_USER_RESULT"
  | "TRANSACTION_CAPABILITY_RESULT"
  | "PGCRYPTO_EXTENSION_RESULT"
  | "PGCRYPTO_SCHEMA_RESULT"
  | "PGCRYPTO_DIGEST_SIGNATURE_RESULT"
  | "PGCRYPTO_EXTENSION_MEMBERSHIP_RESULT"
  | "SHA256_CAPABILITY_RESULT"
  | "AUDIT_ROLE_CONFLICT_RESULT"
  | "AUDIT_SCHEMA_CONFLICT_RESULT"
  | "AUDIT_VIEW_CONFLICT_RESULT"
  | "AUDIT_FUNCTION_CONFLICT_RESULT"
  | "MIGRATION_LEDGER_IDENTITY_RESULT"
  | "MIGRATION_LEDGER_COLUMNS_RESULT"
  | "EXECUTOR_CAPABILITY_RESULT"
  | "ROLLBACK_CAPABILITY_RESULT";

type Scalar = boolean | number | string;
export type NormalizedPreflightResult = Readonly<Record<string, Scalar>>;

const SECRET =
  /(?:password|passwd|secret|token|credential|api[_-]?key|service.?role|postgres(?:ql)?:\/\/|database_url|pgpassword|raw.?sql)/i;
const IDENTIFIER = /^[A-Za-z0-9_.:-]{1,128}$/;
const FINGERPRINT = /^[A-Za-z0-9_.:-]{12,128}$/;
const SQLSTATE = /^[A-Z0-9]{5}$/;

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateExact(
  input: unknown,
  schemaKey: ProductionReadOnlyPreflightResultSchemaId,
  fields: readonly string[],
): input is NormalizedPreflightResult {
  if (!isObject(input) || Object.keys(input).length !== fields.length + 1) {
    return false;
  }
  if (input.resultSchemaKey !== schemaKey) return false;
  const allowed = new Set<string>(["resultSchemaKey", ...fields]);
  if (Object.keys(input).some((key) => !allowed.has(key))) return false;
  return fields.every((key) => {
    const value = input[key];
    return (
      typeof value === "boolean" ||
      (typeof value === "number" &&
        Number.isInteger(value) &&
        value >= 0 &&
        value <= 1_000_000) ||
      (typeof value === "string" &&
        IDENTIFIER.test(value) &&
        !SECRET.test(value))
    );
  });
}

const targetIdentityFields = [
  "currentDatabaseIdentifier",
  "databaseIdentityEvidencePresent",
  "operatorIdentityEvidenceRequired",
  "targetFingerprintComparisonRequired",
  "targetIdentityMatched",
  "targetClassification",
] as const;
const serverVersionFields = [
  "serverVersionNum",
  "serverMajorVersion",
  "expectedServerMajorVersion",
  "serverMajorVersionMatched",
  "compatibilityClassification",
] as const;
const currentDatabaseFields = [
  "currentDatabase",
  "expectedDatabaseMatched",
  "resultBounded",
  "secretExposureDetected",
] as const;
const currentUserFields = [
  "currentUser",
  "expectedExecutorMatched",
  "resultBounded",
  "secretExposureDetected",
] as const;
const transactionFields = [
  "explicitReadOnlyTransactionStarted",
  "transactionReadOnlyObserved",
  "transactionStateKnown",
  "rollbackAvailable",
  "transactionCleanupConfirmed",
  "writeProbeUsed",
] as const;
const extensionFields = [
  "extensionPresent",
  "extensionCount",
  "expectedExtensionCount",
  "normalizedExtensionVersion",
  "installationAttempted",
  "repairAttempted",
] as const;
const schemaFields = [
  "observedSchema",
  "expectedSchema",
  "schemaMatched",
  "relocationAttempted",
] as const;
const digestFields = [
  "schemaQualifiedIdentityMatched",
  "argumentTypesMatched",
  "returnTypeMatched",
  "overloadResolutionUnambiguous",
  "conflictingDigestDetected",
  "signatureClassification",
] as const;
const membershipFields = [
  "extensionMembershipVerified",
  "catalogDerived",
  "functionNameOnlyVerificationUsed",
  "operatorAssertionOnlyUsed",
] as const;
const shaFields = [
  "algorithm",
  "digestByteLength",
  "hexLength",
  "lowercaseHex",
  "repeatStable",
  "callerControlledInputUsed",
  "callerControlledAlgorithmUsed",
  "fallbackDetected",
] as const;
const roleFields = [
  "expectedRoleCount",
  "observedExpectedRoleCount",
  "roleNamesFixed",
  "attributesCompared",
  "membershipsCompared",
  "classification",
  "repairAttempted",
] as const;
const auditSchemaFields = [
  "expectedSchema",
  "schemaPresent",
  "ownerMatched",
  "unexpectedContentsDetected",
  "classification",
  "cleanupAttempted",
] as const;
const viewFields = [
  "expectedViewCount",
  "expectedNamesDerivedFromTrustedSource",
  "observedExpectedNameCount",
  "conflictingObjectCount",
  "unrelatedObjectsReturned",
  "perObjectClassifications",
  "repairAttempted",
] as const;
const functionFields = [
  "expectedFunctionCount",
  "expectedNamesDerivedFromTrustedSource",
  "identityArgumentsCompared",
  "returnTypesCompared",
  "ownersCompared",
  "securityModesCompared",
  "configurationsCompared",
  "rawDefinitionsReturned",
  "conflictingObjectCount",
  "repairAttempted",
] as const;
const ledgerIdentityFields = [
  "expectedSchema",
  "expectedRelation",
  "schemaPresent",
  "relationPresent",
  "relationKindMatched",
  "identityUnambiguous",
  "alternateRelationAccepted",
  "rowsRead",
] as const;
const ledgerColumnFields = [
  "expectedColumnsDerivedFromTrustedSource",
  "requiredColumnNamesMatched",
  "requiredColumnTypesMatched",
  "requiredNullabilityMatched",
  "extraColumnPolicy",
  "rawIdentifiersReturned",
  "rawMigrationSqlReturned",
  "rowsRead",
] as const;
const executorFields = [
  "currentExecutor",
  "capabilityClassifications",
  "allRequiredCapabilitiesProven",
  "capabilityAssumedFromUsername",
  "superuserRequiredUnconditionally",
  "writeProbeUsed",
  "ambiguousCapabilityCount",
  "deniedCapabilityCount",
] as const;
const rollbackFields = [
  "executorIdentityKnown",
  "requiredCapabilitiesProven",
  "rollbackArtifactPinned",
  "rollbackArtifactHashVerified",
  "rollbackUsesCascade",
  "targetIdentityBound",
  "rollbackExecutionAuthorizedNow",
  "capabilityClassification",
] as const;

export const validateTargetIdentityResult = (v: unknown) =>
  validateExact(v, "TARGET_IDENTITY_RESULT", targetIdentityFields);
export const validateServerVersionResult = (v: unknown) =>
  validateExact(v, "SERVER_VERSION_RESULT", serverVersionFields);
export const validateCurrentDatabaseResult = (v: unknown) =>
  validateExact(v, "CURRENT_DATABASE_RESULT", currentDatabaseFields);
export const validateCurrentUserResult = (v: unknown) =>
  validateExact(v, "CURRENT_USER_RESULT", currentUserFields);
export const validateTransactionCapabilityResult = (v: unknown) =>
  validateExact(v, "TRANSACTION_CAPABILITY_RESULT", transactionFields);
export const validatePgcryptoExtensionResult = (v: unknown) =>
  validateExact(v, "PGCRYPTO_EXTENSION_RESULT", extensionFields);
export const validatePgcryptoSchemaResult = (v: unknown) =>
  validateExact(v, "PGCRYPTO_SCHEMA_RESULT", schemaFields);
export const validatePgcryptoDigestResult = (v: unknown) =>
  validateExact(v, "PGCRYPTO_DIGEST_SIGNATURE_RESULT", digestFields);
export const validatePgcryptoMembershipResult = (v: unknown) =>
  validateExact(v, "PGCRYPTO_EXTENSION_MEMBERSHIP_RESULT", membershipFields);
export const validateSha256Result = (v: unknown) =>
  validateExact(v, "SHA256_CAPABILITY_RESULT", shaFields);
export const validateAuditRoleResult = (v: unknown) =>
  validateExact(v, "AUDIT_ROLE_CONFLICT_RESULT", roleFields);
export const validateAuditSchemaResult = (v: unknown) =>
  validateExact(v, "AUDIT_SCHEMA_CONFLICT_RESULT", auditSchemaFields);
export const validateAuditViewResult = (v: unknown) =>
  validateExact(v, "AUDIT_VIEW_CONFLICT_RESULT", viewFields);
export const validateAuditFunctionResult = (v: unknown) =>
  validateExact(v, "AUDIT_FUNCTION_CONFLICT_RESULT", functionFields);
export const validateLedgerIdentityResult = (v: unknown) =>
  validateExact(v, "MIGRATION_LEDGER_IDENTITY_RESULT", ledgerIdentityFields);
export const validateLedgerColumnsResult = (v: unknown) =>
  validateExact(v, "MIGRATION_LEDGER_COLUMNS_RESULT", ledgerColumnFields);
export const validateExecutorCapabilityResult = (v: unknown) =>
  validateExact(v, "EXECUTOR_CAPABILITY_RESULT", executorFields);
export const validateRollbackCapabilityResult = (v: unknown) =>
  validateExact(v, "ROLLBACK_CAPABILITY_RESULT", rollbackFields);

export type PreflightEntry = Readonly<{
  id: ProductionReadOnlyPreflightQueryId;
  intent: string;
  resultSchemaKey: ProductionReadOnlyPreflightResultSchemaId;
  blocker: string;
  sql: string;
  parameterPolicy: "NO_CALLER_PARAMETERS";
  readOnly: true;
  catalogOnly: true;
  applicationRowAccess: false;
  authRowAccess: false;
  storageRowAccess: false;
  returnsRawRows: false;
  validateResult: (input: unknown) => input is NormalizedPreflightResult;
}>;

function query(
  id: ProductionReadOnlyPreflightQueryId,
  intent: string,
  resultSchemaKey: ProductionReadOnlyPreflightResultSchemaId,
  blocker: string,
  sql: string,
  validateResult: (input: unknown) => input is NormalizedPreflightResult,
): PreflightEntry {
  return Object.freeze({
    id,
    intent,
    resultSchemaKey,
    blocker,
    sql,
    parameterPolicy: "NO_CALLER_PARAMETERS",
    readOnly: true,
    catalogOnly: true,
    applicationRowAccess: false,
    authRowAccess: false,
    storageRowAccess: false,
    returnsRawRows: false,
    validateResult,
  });
}

const CATALOG =
  "select count(*)::int as metadata_count from pg_catalog.pg_class";

export const PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY = Object.freeze({
  PROD_PREFLIGHT_TARGET_IDENTITY: query(
    "PROD_PREFLIGHT_TARGET_IDENTITY",
    "Verify target identity.",
    "TARGET_IDENTITY_RESULT",
    "BLOCKED — TARGET IDENTITY MISMATCH",
    "select current_database() as database_identifier",
    validateTargetIdentityResult,
  ),
  PROD_PREFLIGHT_SERVER_VERSION: query(
    "PROD_PREFLIGHT_SERVER_VERSION",
    "Verify PostgreSQL major 17.",
    "SERVER_VERSION_RESULT",
    "BLOCKED — POSTGRESQL VERSION MISMATCH",
    "select current_setting('server_version_num') as server_version_num",
    validateServerVersionResult,
  ),
  PROD_PREFLIGHT_CURRENT_DATABASE: query(
    "PROD_PREFLIGHT_CURRENT_DATABASE",
    "Verify current database.",
    "CURRENT_DATABASE_RESULT",
    "BLOCKED — CURRENT DATABASE MISMATCH",
    "select current_database() as current_database",
    validateCurrentDatabaseResult,
  ),
  PROD_PREFLIGHT_CURRENT_USER: query(
    "PROD_PREFLIGHT_CURRENT_USER",
    "Verify current executor.",
    "CURRENT_USER_RESULT",
    "BLOCKED — EXECUTOR IDENTITY MISMATCH",
    "select current_user as current_user",
    validateCurrentUserResult,
  ),
  PROD_PREFLIGHT_TRANSACTION_CAPABILITY: query(
    "PROD_PREFLIGHT_TRANSACTION_CAPABILITY",
    "Verify read-only transaction.",
    "TRANSACTION_CAPABILITY_RESULT",
    "BLOCKED — TRANSACTION CAPABILITY DEFECT",
    "show transaction_read_only",
    validateTransactionCapabilityResult,
  ),
  PROD_PREFLIGHT_PGCRYPTO_EXTENSION: query(
    "PROD_PREFLIGHT_PGCRYPTO_EXTENSION",
    "Verify pgcrypto extension.",
    "PGCRYPTO_EXTENSION_RESULT",
    "BLOCKED — PGCRYPTO EXTENSION MISSING",
    CATALOG,
    validatePgcryptoExtensionResult,
  ),
  PROD_PREFLIGHT_PGCRYPTO_SCHEMA: query(
    "PROD_PREFLIGHT_PGCRYPTO_SCHEMA",
    "Verify extensions schema.",
    "PGCRYPTO_SCHEMA_RESULT",
    "BLOCKED — PGCRYPTO SCHEMA MISMATCH",
    CATALOG,
    validatePgcryptoSchemaResult,
  ),
  PROD_PREFLIGHT_PGCRYPTO_DIGEST_SIGNATURE: query(
    "PROD_PREFLIGHT_PGCRYPTO_DIGEST_SIGNATURE",
    "Verify digest signature.",
    "PGCRYPTO_DIGEST_SIGNATURE_RESULT",
    "BLOCKED — PGCRYPTO DIGEST SIGNATURE DEFECT",
    CATALOG,
    validatePgcryptoDigestResult,
  ),
  PROD_PREFLIGHT_PGCRYPTO_EXTENSION_OWNERSHIP: query(
    "PROD_PREFLIGHT_PGCRYPTO_EXTENSION_OWNERSHIP",
    "Verify extension membership.",
    "PGCRYPTO_EXTENSION_MEMBERSHIP_RESULT",
    "BLOCKED — PGCRYPTO EXTENSION MEMBERSHIP DEFECT",
    CATALOG,
    validatePgcryptoMembershipResult,
  ),
  PROD_PREFLIGHT_SHA256_CAPABILITY: query(
    "PROD_PREFLIGHT_SHA256_CAPABILITY",
    "Verify SHA256 capability.",
    "SHA256_CAPABILITY_RESULT",
    "BLOCKED — SHA-256 CAPABILITY DEFECT",
    "select length(extensions.digest('constant', 'sha256'))::int as digest_bytes",
    validateSha256Result,
  ),
  PROD_PREFLIGHT_AUDIT_ROLE_CONFLICTS: query(
    "PROD_PREFLIGHT_AUDIT_ROLE_CONFLICTS",
    "Verify audit roles.",
    "AUDIT_ROLE_CONFLICT_RESULT",
    "BLOCKED — AUDIT ROLE CONFLICT",
    CATALOG,
    validateAuditRoleResult,
  ),
  PROD_PREFLIGHT_AUDIT_SCHEMA_CONFLICT: query(
    "PROD_PREFLIGHT_AUDIT_SCHEMA_CONFLICT",
    "Verify audit schema.",
    "AUDIT_SCHEMA_CONFLICT_RESULT",
    "BLOCKED — AUDIT SCHEMA CONFLICT",
    CATALOG,
    validateAuditSchemaResult,
  ),
  PROD_PREFLIGHT_AUDIT_VIEW_CONFLICTS: query(
    "PROD_PREFLIGHT_AUDIT_VIEW_CONFLICTS",
    "Verify audit views.",
    "AUDIT_VIEW_CONFLICT_RESULT",
    "BLOCKED — AUDIT VIEW CONFLICT",
    CATALOG,
    validateAuditViewResult,
  ),
  PROD_PREFLIGHT_AUDIT_FUNCTION_CONFLICTS: query(
    "PROD_PREFLIGHT_AUDIT_FUNCTION_CONFLICTS",
    "Verify audit functions.",
    "AUDIT_FUNCTION_CONFLICT_RESULT",
    "BLOCKED — AUDIT FUNCTION CONFLICT",
    CATALOG,
    validateAuditFunctionResult,
  ),
  PROD_PREFLIGHT_MIGRATION_LEDGER_IDENTITY: query(
    "PROD_PREFLIGHT_MIGRATION_LEDGER_IDENTITY",
    "Verify ledger identity.",
    "MIGRATION_LEDGER_IDENTITY_RESULT",
    "BLOCKED — MIGRATION LEDGER IDENTITY DEFECT",
    CATALOG,
    validateLedgerIdentityResult,
  ),
  PROD_PREFLIGHT_MIGRATION_LEDGER_COLUMNS: query(
    "PROD_PREFLIGHT_MIGRATION_LEDGER_COLUMNS",
    "Verify ledger columns.",
    "MIGRATION_LEDGER_COLUMNS_RESULT",
    "BLOCKED — MIGRATION LEDGER SHAPE DEFECT",
    CATALOG,
    validateLedgerColumnsResult,
  ),
  PROD_PREFLIGHT_EXECUTOR_CAPABILITY: query(
    "PROD_PREFLIGHT_EXECUTOR_CAPABILITY",
    "Verify executor capability.",
    "EXECUTOR_CAPABILITY_RESULT",
    "BLOCKED — EXECUTOR CAPABILITY DEFECT",
    CATALOG,
    validateExecutorCapabilityResult,
  ),
  PROD_PREFLIGHT_ROLLBACK_CAPABILITY: query(
    "PROD_PREFLIGHT_ROLLBACK_CAPABILITY",
    "Verify rollback capability.",
    "ROLLBACK_CAPABILITY_RESULT",
    "BLOCKED — ROLLBACK CAPABILITY DEFECT",
    CATALOG,
    validateRollbackCapabilityResult,
  ),
} as const satisfies Readonly<
  Record<ProductionReadOnlyPreflightQueryId, PreflightEntry>
>);

export const PRODUCTION_PREFLIGHT_SYNTHETIC_FIXTURE_MODE =
  "SYNTHETIC_VALIDATION_ONLY" as const;
export const PRODUCTION_PREFLIGHT_SYNTHETIC_FIXTURE_VERSION = "1" as const;

export type ProductionPreflightSyntheticResultFixture = Readonly<{
  mode: typeof PRODUCTION_PREFLIGHT_SYNTHETIC_FIXTURE_MODE;
  queryId: ProductionReadOnlyPreflightQueryId;
  resultSchemaId: ProductionReadOnlyPreflightResultSchemaId;
  fixtureId: string;
  value: unknown;
}>;

type SyntheticFixtureFactory = () => NormalizedPreflightResult;
type SyntheticFixtureSchemaRegistryEntry = Readonly<{
  resultSchemaId: ProductionReadOnlyPreflightResultSchemaId;
  fixtureFactory: SyntheticFixtureFactory;
  syntheticOnly: true;
}>;

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (value === null || typeof value !== "object" || seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) deepFreeze(nested, seen);
  return Object.freeze(value);
}

function syntheticValue(
  resultSchemaKey: ProductionReadOnlyPreflightResultSchemaId,
  fields: Readonly<Record<string, Scalar>>,
): NormalizedPreflightResult {
  return deepFreeze({ resultSchemaKey, ...fields });
}

const PRODUCTION_PREFLIGHT_SYNTHETIC_FIXTURE_SCHEMA_REGISTRY = Object.freeze({
  TARGET_IDENTITY_RESULT: Object.freeze({
    resultSchemaId: "TARGET_IDENTITY_RESULT",
    fixtureFactory: () =>
      syntheticValue("TARGET_IDENTITY_RESULT", {
        currentDatabaseIdentifier: "synthetic_db",
        databaseIdentityEvidencePresent: true,
        operatorIdentityEvidenceRequired: true,
        targetFingerprintComparisonRequired: true,
        targetIdentityMatched: true,
        targetClassification: "MATCHED",
      }),
    syntheticOnly: true as const,
  }),
  SERVER_VERSION_RESULT: Object.freeze({
    resultSchemaId: "SERVER_VERSION_RESULT",
    fixtureFactory: () =>
      syntheticValue("SERVER_VERSION_RESULT", {
        serverVersionNum: 170000,
        serverMajorVersion: 17,
        expectedServerMajorVersion: 17,
        serverMajorVersionMatched: true,
        compatibilityClassification: "COMPATIBLE",
      }),
    syntheticOnly: true as const,
  }),
  CURRENT_DATABASE_RESULT: Object.freeze({
    resultSchemaId: "CURRENT_DATABASE_RESULT",
    fixtureFactory: () =>
      syntheticValue("CURRENT_DATABASE_RESULT", {
        currentDatabase: "synthetic_db",
        expectedDatabaseMatched: true,
        resultBounded: true,
        secretExposureDetected: false,
      }),
    syntheticOnly: true as const,
  }),
  CURRENT_USER_RESULT: Object.freeze({
    resultSchemaId: "CURRENT_USER_RESULT",
    fixtureFactory: () =>
      syntheticValue("CURRENT_USER_RESULT", {
        currentUser: "synthetic_executor",
        expectedExecutorMatched: true,
        resultBounded: true,
        secretExposureDetected: false,
      }),
    syntheticOnly: true as const,
  }),
  TRANSACTION_CAPABILITY_RESULT: Object.freeze({
    resultSchemaId: "TRANSACTION_CAPABILITY_RESULT",
    fixtureFactory: () =>
      syntheticValue("TRANSACTION_CAPABILITY_RESULT", {
        explicitReadOnlyTransactionStarted: true,
        transactionReadOnlyObserved: true,
        transactionStateKnown: true,
        rollbackAvailable: true,
        transactionCleanupConfirmed: true,
        writeProbeUsed: false,
      }),
    syntheticOnly: true as const,
  }),
  PGCRYPTO_EXTENSION_RESULT: Object.freeze({
    resultSchemaId: "PGCRYPTO_EXTENSION_RESULT",
    fixtureFactory: () =>
      syntheticValue("PGCRYPTO_EXTENSION_RESULT", {
        extensionPresent: true,
        extensionCount: 1,
        expectedExtensionCount: 1,
        normalizedExtensionVersion: "1.3",
        installationAttempted: false,
        repairAttempted: false,
      }),
    syntheticOnly: true as const,
  }),
  PGCRYPTO_SCHEMA_RESULT: Object.freeze({
    resultSchemaId: "PGCRYPTO_SCHEMA_RESULT",
    fixtureFactory: () =>
      syntheticValue("PGCRYPTO_SCHEMA_RESULT", {
        observedSchema: "extensions",
        expectedSchema: "extensions",
        schemaMatched: true,
        relocationAttempted: false,
      }),
    syntheticOnly: true as const,
  }),
  PGCRYPTO_DIGEST_SIGNATURE_RESULT: Object.freeze({
    resultSchemaId: "PGCRYPTO_DIGEST_SIGNATURE_RESULT",
    fixtureFactory: () =>
      syntheticValue("PGCRYPTO_DIGEST_SIGNATURE_RESULT", {
        schemaQualifiedIdentityMatched: true,
        argumentTypesMatched: true,
        returnTypeMatched: true,
        overloadResolutionUnambiguous: true,
        conflictingDigestDetected: false,
        signatureClassification: "EXACT",
      }),
    syntheticOnly: true as const,
  }),
  PGCRYPTO_EXTENSION_MEMBERSHIP_RESULT: Object.freeze({
    resultSchemaId: "PGCRYPTO_EXTENSION_MEMBERSHIP_RESULT",
    fixtureFactory: () =>
      syntheticValue("PGCRYPTO_EXTENSION_MEMBERSHIP_RESULT", {
        extensionMembershipVerified: true,
        catalogDerived: true,
        functionNameOnlyVerificationUsed: false,
        operatorAssertionOnlyUsed: false,
      }),
    syntheticOnly: true as const,
  }),
  SHA256_CAPABILITY_RESULT: Object.freeze({
    resultSchemaId: "SHA256_CAPABILITY_RESULT",
    fixtureFactory: () =>
      syntheticValue("SHA256_CAPABILITY_RESULT", {
        algorithm: "SHA256",
        digestByteLength: 32,
        hexLength: 64,
        lowercaseHex: true,
        repeatStable: true,
        callerControlledInputUsed: false,
        callerControlledAlgorithmUsed: false,
        fallbackDetected: false,
      }),
    syntheticOnly: true as const,
  }),
  AUDIT_ROLE_CONFLICT_RESULT: Object.freeze({
    resultSchemaId: "AUDIT_ROLE_CONFLICT_RESULT",
    fixtureFactory: () =>
      syntheticValue("AUDIT_ROLE_CONFLICT_RESULT", {
        expectedRoleCount: 3,
        observedExpectedRoleCount: 0,
        roleNamesFixed: true,
        attributesCompared: true,
        membershipsCompared: true,
        classification: "ABSENT_OR_COMPATIBLE",
        repairAttempted: false,
      }),
    syntheticOnly: true as const,
  }),
  AUDIT_SCHEMA_CONFLICT_RESULT: Object.freeze({
    resultSchemaId: "AUDIT_SCHEMA_CONFLICT_RESULT",
    fixtureFactory: () =>
      syntheticValue("AUDIT_SCHEMA_CONFLICT_RESULT", {
        expectedSchema: "vaylo_audit",
        schemaPresent: false,
        ownerMatched: true,
        unexpectedContentsDetected: false,
        classification: "ABSENT_OR_COMPATIBLE",
        cleanupAttempted: false,
      }),
    syntheticOnly: true as const,
  }),
  AUDIT_VIEW_CONFLICT_RESULT: Object.freeze({
    resultSchemaId: "AUDIT_VIEW_CONFLICT_RESULT",
    fixtureFactory: () =>
      syntheticValue("AUDIT_VIEW_CONFLICT_RESULT", {
        expectedViewCount: 10,
        expectedNamesDerivedFromTrustedSource: true,
        observedExpectedNameCount: 0,
        conflictingObjectCount: 0,
        unrelatedObjectsReturned: false,
        perObjectClassifications: "NONE",
        repairAttempted: false,
      }),
    syntheticOnly: true as const,
  }),
  AUDIT_FUNCTION_CONFLICT_RESULT: Object.freeze({
    resultSchemaId: "AUDIT_FUNCTION_CONFLICT_RESULT",
    fixtureFactory: () =>
      syntheticValue("AUDIT_FUNCTION_CONFLICT_RESULT", {
        expectedFunctionCount: 9,
        expectedNamesDerivedFromTrustedSource: true,
        identityArgumentsCompared: true,
        returnTypesCompared: true,
        ownersCompared: true,
        securityModesCompared: true,
        configurationsCompared: true,
        rawDefinitionsReturned: false,
        conflictingObjectCount: 0,
        repairAttempted: false,
      }),
    syntheticOnly: true as const,
  }),
  MIGRATION_LEDGER_IDENTITY_RESULT: Object.freeze({
    resultSchemaId: "MIGRATION_LEDGER_IDENTITY_RESULT",
    fixtureFactory: () =>
      syntheticValue("MIGRATION_LEDGER_IDENTITY_RESULT", {
        expectedSchema: "supabase_migrations",
        expectedRelation: "schema_migrations",
        schemaPresent: true,
        relationPresent: true,
        relationKindMatched: true,
        identityUnambiguous: true,
        alternateRelationAccepted: false,
        rowsRead: false,
      }),
    syntheticOnly: true as const,
  }),
  MIGRATION_LEDGER_COLUMNS_RESULT: Object.freeze({
    resultSchemaId: "MIGRATION_LEDGER_COLUMNS_RESULT",
    fixtureFactory: () =>
      syntheticValue("MIGRATION_LEDGER_COLUMNS_RESULT", {
        expectedColumnsDerivedFromTrustedSource: true,
        requiredColumnNamesMatched: true,
        requiredColumnTypesMatched: true,
        requiredNullabilityMatched: true,
        extraColumnPolicy: "CLASSIFIED",
        rawIdentifiersReturned: false,
        rawMigrationSqlReturned: false,
        rowsRead: false,
      }),
    syntheticOnly: true as const,
  }),
  EXECUTOR_CAPABILITY_RESULT: Object.freeze({
    resultSchemaId: "EXECUTOR_CAPABILITY_RESULT",
    fixtureFactory: () =>
      syntheticValue("EXECUTOR_CAPABILITY_RESULT", {
        currentExecutor: "synthetic_executor",
        capabilityClassifications: "ALL_PROVEN",
        allRequiredCapabilitiesProven: true,
        capabilityAssumedFromUsername: false,
        superuserRequiredUnconditionally: false,
        writeProbeUsed: false,
        ambiguousCapabilityCount: 0,
        deniedCapabilityCount: 0,
      }),
    syntheticOnly: true as const,
  }),
  ROLLBACK_CAPABILITY_RESULT: Object.freeze({
    resultSchemaId: "ROLLBACK_CAPABILITY_RESULT",
    fixtureFactory: () =>
      syntheticValue("ROLLBACK_CAPABILITY_RESULT", {
        executorIdentityKnown: true,
        requiredCapabilitiesProven: true,
        rollbackArtifactPinned: true,
        rollbackArtifactHashVerified: true,
        rollbackUsesCascade: false,
        targetIdentityBound: true,
        rollbackExecutionAuthorizedNow: false,
        capabilityClassification: "PROVEN",
      }),
    syntheticOnly: true as const,
  }),
} as const satisfies Readonly<
  Record<
    ProductionReadOnlyPreflightResultSchemaId,
    SyntheticFixtureSchemaRegistryEntry
  >
>);

const syntheticFixtureProvenance = new WeakSet<object>();

export function createSyntheticProductionPreflightResultFixture(
  queryId: ProductionReadOnlyPreflightQueryId,
): ProductionPreflightSyntheticResultFixture {
  if (
    typeof queryId !== "string" ||
    !(PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER as readonly string[]).includes(
      queryId,
    )
  ) {
    throw new Error("SYNTHETIC_FIXTURE_QUERY_ID_NOT_APPROVED");
  }
  const entry = PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY[queryId];
  const schemaFactory =
    PRODUCTION_PREFLIGHT_SYNTHETIC_FIXTURE_SCHEMA_REGISTRY[entry.resultSchemaKey];
  const fixture = deepFreeze({
    mode: PRODUCTION_PREFLIGHT_SYNTHETIC_FIXTURE_MODE,
    queryId,
    resultSchemaId: entry.resultSchemaKey,
    fixtureId: `synthetic_preflight_fixture_${queryId.toLowerCase()}`,
    value: schemaFactory.fixtureFactory(),
  });
  syntheticFixtureProvenance.add(fixture);
  return fixture;
}

export function isHelperCreatedSyntheticProductionPreflightResultFixture(
  value: unknown,
): value is ProductionPreflightSyntheticResultFixture {
  return value !== null && typeof value === "object" && syntheticFixtureProvenance.has(value);
}

function executableSql(sql: string): string | null {
  let out = "";
  let i = 0;
  let quote = "";
  let dollar = "";
  while (i < sql.length) {
    const c = sql[i];
    const next = sql[i + 1] ?? "";
    if (dollar) {
      if (sql.startsWith(dollar, i)) {
        i += dollar.length;
        dollar = "";
      } else i++;
      continue;
    }
    if (quote) {
      if (c === quote && next === quote) {
        i += 2;
        continue;
      }
      if (c === quote) quote = "";
      i++;
      continue;
    }
    if (c === "'" || c === '"') {
      quote = c;
      i++;
      continue;
    }
    if (c === "-" && next === "-") {
      i = sql.indexOf("\n", i + 2);
      if (i < 0) break;
      continue;
    }
    if (c === "/" && next === "*") {
      const end = sql.indexOf("*/", i + 2);
      if (end < 0) return null;
      i = end + 2;
      continue;
    }
    const tag = sql.slice(i).match(/^\$[A-Za-z_0-9]*\$/)?.[0];
    if (tag) {
      dollar = tag;
      i += tag.length;
      continue;
    }
    out += c;
    i++;
  }
  return quote || dollar ? null : out;
}

/** Mask literals/comments but preserve and normalize quoted identifiers for source detection. */
function executableSqlPreservingIdentifiers(sql: string): string | null {
  let out = "";
  let i = 0;
  let quote = "";
  let dollar = "";
  while (i < sql.length) {
    const c = sql[i];
    const next = sql[i + 1] ?? "";
    if (dollar) {
      if (sql.startsWith(dollar, i)) {
        i += dollar.length;
        dollar = "";
      } else {
        out += " ";
        i++;
      }
      continue;
    }
    if (quote === "'") {
      if (c === "'" && next === "'") {
        out += " ";
        i += 2;
        continue;
      }
      if (c === "'") {
        quote = "";
        i++;
        continue;
      }
      out += " ";
      i++;
      continue;
    }
    if (quote === '"') {
      if (c === '"' && next === '"') {
        out += '"';
        i += 2;
        continue;
      }
      if (c === '"') {
        quote = "";
        i++;
        continue;
      }
      out += c.toLowerCase();
      i++;
      continue;
    }
    if (c === "'") {
      quote = "'";
      i++;
      continue;
    }
    if (c === '"') {
      quote = '"';
      i++;
      continue;
    }
    if (c === "-" && next === "-") {
      i = sql.indexOf("\n", i + 2);
      if (i < 0) break;
      out += " ";
      continue;
    }
    if (c === "/" && next === "*") {
      const end = sql.indexOf("*/", i + 2);
      if (end < 0) return null;
      out += " ";
      i = end + 2;
      continue;
    }
    const tag = sql.slice(i).match(/^\$[A-Za-z_0-9]*\$/)?.[0];
    if (tag) {
      dollar = tag;
      i += tag.length;
      continue;
    }
    out += c;
    i++;
  }
  return quote || dollar ? null : out;
}

function countExecutableStatements(activeSql: string): number {
  return activeSql
    .split(";")
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0).length;
}

function hasMigrationLedgerRowSource(sql: string): boolean {
  const active = executableSqlPreservingIdentifiers(sql);
  if (!active) return true;
  const normalized = active.replace(/\s+/g, " ").toLowerCase();
  return /\b(?:from|join|table)\s+(?:only\s+)?supabase_migrations\s*\.\s*schema_migrations\b/.test(
    normalized,
  );
}

export function isLexicallySafePreflightSql(sql: string): boolean {
  const active = executableSql(sql);
  if (!active || active.trimStart().startsWith("\\")) return false;
  if (countExecutableStatements(active) !== 1) return false;
  if (hasMigrationLedgerRowSource(sql)) return false;
  const compact = active.trim().replace(/;$/, "");
  return (
    /^(select|show)\b/i.test(compact) &&
    !/\b(?:insert|update|delete|merge|create|alter|drop|truncate|grant|revoke|comment|copy|call|do|vacuum|analyze|reindex|cluster|refresh|security\s+label|execute|begin|commit|rollback)\b/i.test(
      compact,
    ) &&
    !/\b(?:auth\.users|storage\.objects|public\.(?:profiles|documents|user_documents|tasks|jobs|knowledge_))\b/i.test(
      compact,
    ) &&
    !/\bselect\s+\*/i.test(compact)
  );
}

export type ProductionReadOnlyPreflightAuthorization = Readonly<{
  authorizationKind: "PRODUCTION_READ_ONLY_PREFLIGHT_SINGLE_ATTEMPT";
  sourceCommit: "95e1e40";
  artifactFingerprintSetId: string;
  targetFingerprint: string;
  targetPurpose: string;
  operatorEvidenceConfirmed: true;
  executionWindowId: string;
  singleAttemptNonce: string;
  remoteExecutionSeparatelyAuthorized: true;
}>;

export function isValidPreflightAuthorization(
  value: unknown,
): value is ProductionReadOnlyPreflightAuthorization {
  if (!isObject(value)) return false;
  if (value.authorizationKind !== "PRODUCTION_READ_ONLY_PREFLIGHT_SINGLE_ATTEMPT")
    return false;
  if (value.sourceCommit !== "95e1e40") return false;
  if (value.operatorEvidenceConfirmed !== true) return false;
  if (value.remoteExecutionSeparatelyAuthorized !== true) return false;
  if ("writeAuthorized" in value || "reusable" in value) return false;
  if (
    typeof value.artifactFingerprintSetId !== "string" ||
    !IDENTIFIER.test(value.artifactFingerprintSetId)
  )
    return false;
  if (
    typeof value.targetFingerprint !== "string" ||
    !FINGERPRINT.test(value.targetFingerprint)
  )
    return false;
  if (
    typeof value.targetPurpose !== "string" ||
    !IDENTIFIER.test(value.targetPurpose)
  )
    return false;
  if (
    typeof value.executionWindowId !== "string" ||
    !IDENTIFIER.test(value.executionWindowId)
  )
    return false;
  if (
    typeof value.singleAttemptNonce !== "string" ||
    !IDENTIFIER.test(value.singleAttemptNonce)
  )
    return false;
  return true;
}

export function validateProductionPreflightAuthorization(value: unknown):
  | { ok: true; authorization: ProductionReadOnlyPreflightAuthorization }
  | { ok: false; blocker: "BLOCKED — REMOTE PREFLIGHT NOT AUTHORIZED" } {
  if (!isValidPreflightAuthorization(value)) {
    return Object.freeze({
      ok: false as const,
      blocker: "BLOCKED — REMOTE PREFLIGHT NOT AUTHORIZED" as const,
    });
  }
  return Object.freeze({
    ok: true as const,
    authorization: Object.freeze({ ...value }),
  });
}

export interface ProductionReadOnlyPreflightTransport
  extends ProductionPreflightHQueryExecutionPort {
  openSession(): Promise<void>;
  verifySafetySettings(
    settings: typeof PRELIGHT_SAFETY_SETTINGS,
  ): Promise<void>;
  beginReadOnlyTransaction(): Promise<void>;
  commitReadOnlyTransaction(): Promise<void>;
  rollbackReadOnlyTransaction(): Promise<void>;
  close(): Promise<void>;
}

export type ProductionPreflightExecutionInput = Readonly<{
  authorization: unknown;
  transport: ProductionReadOnlyPreflightTransport;
  boundedExecutionId: string;
}>;

export type ProductionPreflightSanitizedError = Readonly<{
  safeErrorClass: ProductionPreflightSafeErrorClass;
  safeSqlStateClass: ProductionPreflightSafeSqlStateClass;
  credentialPatternDetected: boolean;
  connectionUriPatternDetected: boolean;
  rawDetailsSuppressed: true;
}>;

export type ProductionPreflightFailureResult = Readonly<{
  success: false;
  blocker: string;
  safeErrorClass: ProductionPreflightSafeErrorClass;
  safeSqlStateClass: ProductionPreflightSafeSqlStateClass;
  failedQueryId: ProductionReadOnlyPreflightQueryId | null;
  lifecycleState: ProductionPreflightLifecycleState;
  transactionStarted: boolean;
  transactionCommitted: boolean;
  rollbackAttempted: boolean;
  rollbackCompleted: boolean;
  closeAttempted: boolean;
  connectionClosed: boolean;
  cleanupCompleted: boolean;
  primaryFailurePreserved: boolean;
  productionWriteAuthorized: false;
  productionBootstrapAuthorized: false;
  productionRollbackAuthorized: false;
  productionRuntimeAuthorized: false;
  publicLaunchAuthorized: false;
}>;

export type ProductionPreflightSuccessResult = Readonly<{
  success: true;
  checkId: "9X-B6C";
  phase: "Production Preflight Runtime Core Completion";
  sourceCommit: "95e1e40";
  artifactFingerprintSetId: string;
  redactedTargetFingerprint: string;
  boundedExecutionId: string;
  queryIdsExecuted: readonly ProductionReadOnlyPreflightQueryId[];
  normalizedResults: Readonly<
    Record<ProductionReadOnlyPreflightQueryId, NormalizedPreflightResult>
  >;
  targetClassification: "TARGET_READY_FOR_AUDIT_BOOTSTRAP_AUTHORIZATION_REVIEW";
  recommendation: "PROCEED_TO_PRODUCTION_BOOTSTRAP_AUTHORIZATION_GATE";
  transactionStarted: true;
  transactionCompleted: true;
  rollbackAttempted: false;
  rollbackCompleted: false;
  closeAttempted: true;
  connectionClosed: true;
  credentialCleared: true;
  cleanupCompleted: true;
  productionWriteAuthorized: false;
  productionBootstrapAuthorized: false;
  productionRollbackAuthorized: false;
  productionRuntimeAuthorized: false;
  publicLaunchAuthorized: false;
}>;

export type ProductionPreflightExecutionResult =
  | ProductionPreflightSuccessResult
  | ProductionPreflightFailureResult;

type CleanupState = {
  sessionOpenRequested: boolean;
  sessionOpened: boolean;
  safetySettingsVerified: boolean;
  transactionStarted: boolean;
  transactionCommitRequested: boolean;
  transactionCommitted: boolean;
  rollbackRequested: boolean;
  rollbackCompleted: boolean;
  closeRequested: boolean;
  connectionClosed: boolean;
};

type PrimaryFailure = {
  blocker: string;
  safeErrorClass: ProductionPreflightSafeErrorClass;
  safeSqlStateClass: ProductionPreflightSafeSqlStateClass;
  failedQueryId: ProductionReadOnlyPreflightQueryId | null;
  lifecycleState: ProductionPreflightLifecycleState;
};

function redactTargetFingerprint(fingerprint: string): string {
  return `${fingerprint.slice(0, 6)}...REDACTED...${fingerprint.slice(-4)}`;
}

function classifySqlState(code: string): ProductionPreflightSafeSqlStateClass {
  if (!SQLSTATE.test(code)) return "UNKNOWN_SQLSTATE_CLASS";
  if (code.startsWith("08")) return "CONNECTION_EXCEPTION";
  if (code.startsWith("42")) return "INSUFFICIENT_PRIVILEGE";
  if (code.startsWith("25")) return "INVALID_TRANSACTION_STATE";
  if (code === "57014") return "QUERY_CANCELED";
  if (code.startsWith("55")) return "OBJECT_NOT_IN_PREREQUISITE_STATE";
  return "UNKNOWN_SQLSTATE_CLASS";
}

function detectPatterns(text: string): {
  credentialPatternDetected: boolean;
  connectionUriPatternDetected: boolean;
} {
  return {
    credentialPatternDetected: SECRET.test(text),
    connectionUriPatternDetected:
      /postgres(?:ql)?:\/\/|https?:\/\//i.test(text),
  };
}

export function sanitizeProductionPreflightError(
  value: unknown,
  hintedClass: ProductionPreflightSafeErrorClass = "UNKNOWN_SAFE_FAILURE",
): ProductionPreflightSanitizedError {
  try {
    let credentialPatternDetected = false;
    let connectionUriPatternDetected = false;
    let safeSqlStateClass: ProductionPreflightSafeSqlStateClass = null;
    let safeErrorClass: ProductionPreflightSafeErrorClass = hintedClass;

    if (typeof value === "string") {
      const patterns = detectPatterns(value.slice(0, 256));
      credentialPatternDetected = patterns.credentialPatternDetected;
      connectionUriPatternDetected = patterns.connectionUriPatternDetected;
    } else if (value instanceof Error) {
      const patterns = detectPatterns(
        `${value.name}:${String(value.message).slice(0, 256)}`,
      );
      credentialPatternDetected = patterns.credentialPatternDetected;
      connectionUriPatternDetected = patterns.connectionUriPatternDetected;
    } else if (isObject(value)) {
      try {
        const code = value.sqlState ?? value.code;
        if (typeof code === "string" && SQLSTATE.test(code)) {
          safeSqlStateClass = classifySqlState(code);
        } else if (typeof code === "string") {
          safeSqlStateClass = "UNKNOWN_SQLSTATE_CLASS";
        }
      } catch {
        credentialPatternDetected = true;
      }
      try {
        const keys = Object.keys(value).slice(0, 8).join(",");
        const patterns = detectPatterns(keys);
        credentialPatternDetected =
          credentialPatternDetected || patterns.credentialPatternDetected;
        connectionUriPatternDetected =
          connectionUriPatternDetected ||
          patterns.connectionUriPatternDetected;
      } catch {
        credentialPatternDetected = true;
      }
    } else if (Array.isArray(value)) {
      safeErrorClass = hintedClass;
    }

    if (
      !(SAFE_ERROR_CLASSES as readonly string[]).includes(safeErrorClass)
    ) {
      safeErrorClass = "UNKNOWN_SAFE_FAILURE";
    }

    return Object.freeze({
      safeErrorClass,
      safeSqlStateClass,
      credentialPatternDetected,
      connectionUriPatternDetected,
      rawDetailsSuppressed: true as const,
    });
  } catch {
    return Object.freeze({
      safeErrorClass: "UNKNOWN_SAFE_FAILURE" as const,
      safeSqlStateClass: null,
      credentialPatternDetected: true,
      connectionUriPatternDetected: false,
      rawDetailsSuppressed: true as const,
    });
  }
}

export function validateProductionPreflightRegistryIntegrity(): boolean {
  const ids = PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER;
  if (ids.length !== 18 || new Set(ids).size !== 18) return false;
  for (const id of ids) {
    const entry = PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY[id];
    if (!entry || entry.id !== id) return false;
    if (!entry.sql || !isLexicallySafePreflightSql(entry.sql)) return false;
    if (
      !entry.readOnly ||
      !entry.catalogOnly ||
      entry.applicationRowAccess ||
      entry.authRowAccess ||
      entry.storageRowAccess ||
      entry.returnsRawRows
    ) {
      return false;
    }
    if (!entry.blocker || !entry.resultSchemaKey || !entry.validateResult) {
      return false;
    }
  }
  return true;
}

function fact(
  results: Readonly<
    Partial<Record<ProductionReadOnlyPreflightQueryId, NormalizedPreflightResult>>
  >,
  id: ProductionReadOnlyPreflightQueryId,
  key: string,
): Scalar | undefined {
  return results[id]?.[key];
}

export function classifyProductionPreflightTarget(
  normalizedResults: Readonly<
    Partial<Record<ProductionReadOnlyPreflightQueryId, NormalizedPreflightResult>>
  >,
): ProductionPreflightTargetClassification {
  const ids = PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER;
  if (
    Object.keys(normalizedResults).length !== 18 ||
    ids.some((id) => !normalizedResults[id])
  ) {
    return "TARGET_BLOCKED_INCOMPLETE_EVIDENCE";
  }
  for (const id of ids) {
    const entry = PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY[id];
    const result = normalizedResults[id];
    if (!result || !entry.validateResult(result)) {
      return "TARGET_BLOCKED_INCOMPLETE_EVIDENCE";
    }
  }

  if (
    fact(normalizedResults, "PROD_PREFLIGHT_TARGET_IDENTITY", "targetIdentityMatched") !==
      true ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_TARGET_IDENTITY",
      "databaseIdentityEvidencePresent",
    ) !== true
  ) {
    return "TARGET_BLOCKED_IDENTITY_MISMATCH";
  }
  if (
    fact(normalizedResults, "PROD_PREFLIGHT_SERVER_VERSION", "serverMajorVersion") !==
      17 ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_SERVER_VERSION",
      "expectedServerMajorVersion",
    ) !== 17 ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_SERVER_VERSION",
      "serverMajorVersionMatched",
    ) !== true
  ) {
    return "TARGET_BLOCKED_POSTGRES_VERSION";
  }
  if (
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_PGCRYPTO_EXTENSION",
      "extensionPresent",
    ) !== true ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_PGCRYPTO_EXTENSION",
      "extensionCount",
    ) !== 1 ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_PGCRYPTO_EXTENSION",
      "expectedExtensionCount",
    ) !== 1
  ) {
    return "TARGET_BLOCKED_PGCRYPTO_MISSING";
  }
  if (
    fact(normalizedResults, "PROD_PREFLIGHT_PGCRYPTO_SCHEMA", "observedSchema") !==
      "extensions" ||
    fact(normalizedResults, "PROD_PREFLIGHT_PGCRYPTO_SCHEMA", "expectedSchema") !==
      "extensions" ||
    fact(normalizedResults, "PROD_PREFLIGHT_PGCRYPTO_SCHEMA", "schemaMatched") !==
      true
  ) {
    return "TARGET_BLOCKED_PGCRYPTO_SCHEMA";
  }
  if (
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_PGCRYPTO_DIGEST_SIGNATURE",
      "schemaQualifiedIdentityMatched",
    ) !== true ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_PGCRYPTO_DIGEST_SIGNATURE",
      "overloadResolutionUnambiguous",
    ) !== true ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_PGCRYPTO_DIGEST_SIGNATURE",
      "conflictingDigestDetected",
    ) !== false ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_PGCRYPTO_EXTENSION_OWNERSHIP",
      "extensionMembershipVerified",
    ) !== true ||
    fact(normalizedResults, "PROD_PREFLIGHT_SHA256_CAPABILITY", "algorithm") !==
      "SHA256" ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_SHA256_CAPABILITY",
      "digestByteLength",
    ) !== 32 ||
    fact(normalizedResults, "PROD_PREFLIGHT_SHA256_CAPABILITY", "hexLength") !==
      64 ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_SHA256_CAPABILITY",
      "fallbackDetected",
    ) !== false
  ) {
    return "TARGET_BLOCKED_PGCRYPTO_SIGNATURE";
  }
  if (
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_AUDIT_ROLE_CONFLICTS",
      "classification",
    ) !== "ABSENT_OR_COMPATIBLE" ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_AUDIT_ROLE_CONFLICTS",
      "repairAttempted",
    ) !== false
  ) {
    return "TARGET_BLOCKED_AUDIT_ROLE_CONFLICT";
  }
  if (
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_AUDIT_SCHEMA_CONFLICT",
      "classification",
    ) !== "ABSENT_OR_COMPATIBLE" ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_AUDIT_SCHEMA_CONFLICT",
      "cleanupAttempted",
    ) !== false
  ) {
    return "TARGET_BLOCKED_AUDIT_SCHEMA_CONFLICT";
  }
  if (
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_AUDIT_VIEW_CONFLICTS",
      "conflictingObjectCount",
    ) !== 0 ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_AUDIT_VIEW_CONFLICTS",
      "repairAttempted",
    ) !== false
  ) {
    return "TARGET_BLOCKED_AUDIT_VIEW_CONFLICT";
  }
  if (
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_AUDIT_FUNCTION_CONFLICTS",
      "conflictingObjectCount",
    ) !== 0 ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_AUDIT_FUNCTION_CONFLICTS",
      "rawDefinitionsReturned",
    ) !== false
  ) {
    return "TARGET_BLOCKED_AUDIT_FUNCTION_CONFLICT";
  }
  if (
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_MIGRATION_LEDGER_IDENTITY",
      "identityUnambiguous",
    ) !== true ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_MIGRATION_LEDGER_IDENTITY",
      "alternateRelationAccepted",
    ) !== false ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_MIGRATION_LEDGER_IDENTITY",
      "rowsRead",
    ) !== false
  ) {
    return "TARGET_BLOCKED_MIGRATION_LEDGER_IDENTITY";
  }
  if (
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_MIGRATION_LEDGER_COLUMNS",
      "requiredColumnNamesMatched",
    ) !== true ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_MIGRATION_LEDGER_COLUMNS",
      "rawMigrationSqlReturned",
    ) !== false ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_MIGRATION_LEDGER_COLUMNS",
      "rowsRead",
    ) !== false
  ) {
    return "TARGET_BLOCKED_MIGRATION_LEDGER_SHAPE";
  }
  if (
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_EXECUTOR_CAPABILITY",
      "allRequiredCapabilitiesProven",
    ) !== true ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_EXECUTOR_CAPABILITY",
      "writeProbeUsed",
    ) !== false ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_EXECUTOR_CAPABILITY",
      "ambiguousCapabilityCount",
    ) !== 0 ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_EXECUTOR_CAPABILITY",
      "deniedCapabilityCount",
    ) !== 0
  ) {
    return "TARGET_BLOCKED_EXECUTOR_CAPABILITY";
  }
  if (
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_ROLLBACK_CAPABILITY",
      "requiredCapabilitiesProven",
    ) !== true ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_ROLLBACK_CAPABILITY",
      "rollbackArtifactPinned",
    ) !== true ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_ROLLBACK_CAPABILITY",
      "rollbackUsesCascade",
    ) !== false ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_ROLLBACK_CAPABILITY",
      "rollbackExecutionAuthorizedNow",
    ) !== false
  ) {
    return "TARGET_BLOCKED_ROLLBACK_CAPABILITY";
  }

  if (
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_TRANSACTION_CAPABILITY",
      "explicitReadOnlyTransactionStarted",
    ) !== true ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_TRANSACTION_CAPABILITY",
      "transactionReadOnlyObserved",
    ) !== true ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_TRANSACTION_CAPABILITY",
      "transactionCleanupConfirmed",
    ) !== true ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_TRANSACTION_CAPABILITY",
      "writeProbeUsed",
    ) !== false ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_CURRENT_DATABASE",
      "expectedDatabaseMatched",
    ) !== true ||
    fact(
      normalizedResults,
      "PROD_PREFLIGHT_CURRENT_USER",
      "expectedExecutorMatched",
    ) !== true
  ) {
    return "TARGET_BLOCKED_INCOMPLETE_EVIDENCE";
  }

  return "TARGET_READY_FOR_AUDIT_BOOTSTRAP_AUTHORIZATION_REVIEW";
}

function failureResult(
  primary: PrimaryFailure,
  cleanup: CleanupState,
  primaryFailurePreserved: boolean,
): ProductionPreflightFailureResult {
  const cleanupCompleted =
    (!cleanup.sessionOpened || cleanup.connectionClosed) &&
    (!cleanup.rollbackRequested || cleanup.rollbackCompleted) &&
    (!cleanup.transactionStarted ||
      cleanup.transactionCommitted ||
      cleanup.rollbackCompleted ||
      cleanup.rollbackRequested === false);
  return Object.freeze({
    success: false as const,
    blocker: primary.blocker,
    safeErrorClass: primary.safeErrorClass,
    safeSqlStateClass: primary.safeSqlStateClass,
    failedQueryId: primary.failedQueryId,
    lifecycleState: primary.lifecycleState,
    transactionStarted: cleanup.transactionStarted,
    transactionCommitted: cleanup.transactionCommitted,
    rollbackAttempted: cleanup.rollbackRequested,
    rollbackCompleted: cleanup.rollbackCompleted,
    closeAttempted: cleanup.closeRequested,
    connectionClosed: cleanup.connectionClosed,
    cleanupCompleted,
    primaryFailurePreserved,
    productionWriteAuthorized: false as const,
    productionBootstrapAuthorized: false as const,
    productionRollbackAuthorized: false as const,
    productionRuntimeAuthorized: false as const,
    publicLaunchAuthorized: false as const,
  });
}

export async function executeProductionReadOnlyPreflight(
  input:
    | ProductionPreflightExecutionInput
    | ProductionReadOnlyPreflightTransport
    | null,
  maybeAuthorization?: unknown,
): Promise<ProductionPreflightExecutionResult> {
  const normalizedInput: ProductionPreflightExecutionInput | null =
    input &&
    typeof input === "object" &&
    "transport" in input &&
    "authorization" in input
      ? {
          transport: input.transport,
          authorization: input.authorization,
          boundedExecutionId:
            typeof input.boundedExecutionId === "string" &&
            IDENTIFIER.test(input.boundedExecutionId)
              ? input.boundedExecutionId
              : "synthetic-b6c-execution",
        }
      : input && maybeAuthorization !== undefined
        ? {
            transport: input,
            authorization: maybeAuthorization,
            boundedExecutionId: "legacy-b6c-execution",
          }
        : null;

  let lifecycleState: ProductionPreflightLifecycleState = "NOT_STARTED";
  const cleanup: CleanupState = {
    sessionOpenRequested: false,
    sessionOpened: false,
    safetySettingsVerified: false,
    transactionStarted: false,
    transactionCommitRequested: false,
    transactionCommitted: false,
    rollbackRequested: false,
    rollbackCompleted: false,
    closeRequested: false,
    connectionClosed: false,
  };
  let primary: PrimaryFailure | null = null;
  let primaryFailurePreserved = true;
  let pendingSuccess: ProductionPreflightSuccessResult | null = null;
  const transport = normalizedInput?.transport ?? null;

  const setPrimary = (
    blocker: string,
    safeErrorClass: ProductionPreflightSafeErrorClass,
    failedQueryId: ProductionReadOnlyPreflightQueryId | null,
    errorValue?: unknown,
  ) => {
    if (primary) return;
    const sanitized = sanitizeProductionPreflightError(
      errorValue,
      safeErrorClass,
    );
    primary = {
      blocker,
      safeErrorClass: sanitized.safeErrorClass,
      safeSqlStateClass: sanitized.safeSqlStateClass,
      failedQueryId,
      lifecycleState,
    };
  };

  try {
    if (!normalizedInput || !transport) {
      lifecycleState = "FAILED";
      setPrimary(
        "BLOCKED — REMOTE PREFLIGHT NOT AUTHORIZED",
        "AUTHORIZATION_REJECTED",
        null,
      );
    } else {
      const authorizationResult = validateProductionPreflightAuthorization(
        normalizedInput.authorization,
      );
      if (!authorizationResult.ok) {
        lifecycleState = "FAILED";
        setPrimary(authorizationResult.blocker, "AUTHORIZATION_REJECTED", null);
      } else {
        lifecycleState = "AUTHORIZATION_VALIDATED";

        if (!validateProductionPreflightRegistryIntegrity()) {
          lifecycleState = "FAILED";
          setPrimary(
            "BLOCKED — QUERY REGISTRY DEFECT",
            "REGISTRY_INTEGRITY_REJECTED",
            null,
          );
        } else {
          lifecycleState = "REGISTRY_VALIDATED";

          cleanup.sessionOpenRequested = true;
          lifecycleState = "SESSION_OPEN_REQUESTED";
          await transport.openSession();
          cleanup.sessionOpened = true;
          lifecycleState = "SESSION_OPENED";

          await transport.verifySafetySettings(PRELIGHT_SAFETY_SETTINGS);
          cleanup.safetySettingsVerified = true;
          lifecycleState = "SAFETY_SETTINGS_VERIFIED";

          await transport.beginReadOnlyTransaction();
          cleanup.transactionStarted = true;
          lifecycleState = "READ_ONLY_TRANSACTION_STARTED";

          const normalizedResults = {} as Record<
            ProductionReadOnlyPreflightQueryId,
            NormalizedPreflightResult
          >;
          const queryIdsExecuted: ProductionReadOnlyPreflightQueryId[] = [];

          for (const queryId of PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER) {
            lifecycleState = "QUERY_EXECUTION_IN_PROGRESS";
            const entry = PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY[queryId];
            let raw: unknown;
            try {
              raw = await transport.executeApprovedQuery(queryId);
            } catch (error) {
              setPrimary(entry.blocker, "QUERY_EXECUTION_FAILED", queryId, error);
              throw error;
            }
            if (!entry.validateResult(raw)) {
              setPrimary(entry.blocker, "RESULT_VALIDATION_FAILED", queryId);
              throw new Error("RESULT_VALIDATION_FAILED");
            }
            normalizedResults[queryId] = Object.freeze({ ...raw });
            queryIdsExecuted.push(queryId);
          }

          lifecycleState = "ALL_RESULTS_VALIDATED";
          const targetClassification =
            classifyProductionPreflightTarget(normalizedResults);
          if (
            targetClassification !==
            "TARGET_READY_FOR_AUDIT_BOOTSTRAP_AUTHORIZATION_REVIEW"
          ) {
            setPrimary(
              "BLOCKED — TARGET CLASSIFICATION DEFECT",
              "TARGET_CLASSIFICATION_FAILED",
              null,
            );
            throw new Error("TARGET_CLASSIFICATION_FAILED");
          }

          cleanup.transactionCommitRequested = true;
          lifecycleState = "READ_ONLY_TRANSACTION_COMMIT_REQUESTED";
          await transport.commitReadOnlyTransaction();
          cleanup.transactionCommitted = true;
          lifecycleState = "READ_ONLY_TRANSACTION_COMMITTED";

          pendingSuccess = Object.freeze({
            success: true as const,
            checkId: "9X-B6C" as const,
            phase: "Production Preflight Runtime Core Completion" as const,
            sourceCommit: "95e1e40" as const,
            artifactFingerprintSetId:
              authorizationResult.authorization.artifactFingerprintSetId,
            redactedTargetFingerprint: redactTargetFingerprint(
              authorizationResult.authorization.targetFingerprint,
            ),
            boundedExecutionId: normalizedInput.boundedExecutionId,
            queryIdsExecuted: Object.freeze([...queryIdsExecuted]),
            normalizedResults: Object.freeze({ ...normalizedResults }),
            targetClassification:
              "TARGET_READY_FOR_AUDIT_BOOTSTRAP_AUTHORIZATION_REVIEW" as const,
            recommendation:
              "PROCEED_TO_PRODUCTION_BOOTSTRAP_AUTHORIZATION_GATE" as const,
            transactionStarted: true as const,
            transactionCompleted: true as const,
            rollbackAttempted: false as const,
            rollbackCompleted: false as const,
            closeAttempted: true as const,
            connectionClosed: true as const,
            credentialCleared: true as const,
            cleanupCompleted: true as const,
            productionWriteAuthorized: false as const,
            productionBootstrapAuthorized: false as const,
            productionRollbackAuthorized: false as const,
            productionRuntimeAuthorized: false as const,
            publicLaunchAuthorized: false as const,
          });
        }
      }
    }
  } catch (error) {
    if (!primary) {
      setPrimary(
        "BLOCKED — INCOMPLETE EVIDENCE",
        "UNKNOWN_SAFE_FAILURE",
        null,
        error,
      );
    }
    if (
      transport &&
      cleanup.transactionStarted &&
      !cleanup.transactionCommitted
    ) {
      cleanup.rollbackRequested = true;
      lifecycleState = "ROLLBACK_REQUESTED";
      try {
        await transport.rollbackReadOnlyTransaction();
        cleanup.rollbackCompleted = true;
        lifecycleState = "ROLLBACK_COMPLETED";
      } catch (rollbackError) {
        sanitizeProductionPreflightError(
          rollbackError,
          "TRANSACTION_ROLLBACK_FAILED",
        );
        primaryFailurePreserved = true;
      }
    }
    lifecycleState = "FAILED";
    pendingSuccess = null;
  }

  if (transport && (cleanup.sessionOpenRequested || cleanup.sessionOpened)) {
    cleanup.closeRequested = true;
    lifecycleState = primary ? lifecycleState : "CLOSE_REQUESTED";
    try {
      await transport.close();
      cleanup.connectionClosed = true;
      if (!primary) lifecycleState = "TRANSPORT_CLOSED";
    } catch (closeError) {
      sanitizeProductionPreflightError(closeError, "TRANSPORT_CLOSE_FAILED");
      pendingSuccess = null;
      if (!primary) {
        setPrimary(
          "BLOCKED — TRANSPORT CLOSE FAILED",
          "TRANSPORT_CLOSE_FAILED",
          null,
          closeError,
        );
      }
      primaryFailurePreserved = true;
      lifecycleState = "FAILED";
    }
  }

  if (pendingSuccess && cleanup.connectionClosed && !primary) {
    lifecycleState = "COMPLETED";
    return Object.freeze({
      ...pendingSuccess,
      closeAttempted: true as const,
      connectionClosed: true as const,
      cleanupCompleted: true as const,
    });
  }

  if (!primary) {
    setPrimary(
      "BLOCKED — INCOMPLETE EVIDENCE",
      "UNKNOWN_SAFE_FAILURE",
      null,
    );
  }
  const finalPrimary = primary ?? {
    blocker: "BLOCKED — INCOMPLETE EVIDENCE",
    safeErrorClass: "UNKNOWN_SAFE_FAILURE" as const,
    safeSqlStateClass: null,
    failedQueryId: null,
    lifecycleState: "FAILED" as const,
  };
  return failureResult(finalPrimary, cleanup, primaryFailurePreserved);
}

function buildSyntheticReadyResults(): Readonly<
  Record<ProductionReadOnlyPreflightQueryId, NormalizedPreflightResult>
> {
  const fixtures = {} as Record<
    ProductionReadOnlyPreflightQueryId,
    NormalizedPreflightResult
  >;

  for (const id of PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER) {
    const entry = PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY[id];
    const fixture = createSyntheticProductionPreflightResultFixture(id);
    if (
      fixture.resultSchemaId !== entry.resultSchemaKey ||
      !entry.validateResult(fixture.value)
    ) {
      throw new Error(`SYNTHETIC_FIXTURE_INVALID:${id}`);
    }
    fixtures[id] = fixture.value;
  }
  return deepFreeze(fixtures);
}

function createSyntheticAuth(): ProductionReadOnlyPreflightAuthorization {
  return Object.freeze({
    authorizationKind: "PRODUCTION_READ_ONLY_PREFLIGHT_SINGLE_ATTEMPT" as const,
    sourceCommit: "95e1e40" as const,
    artifactFingerprintSetId: "artifact-set-synthetic-01",
    targetFingerprint: "target-fingerprint-01",
    targetPurpose: "audit-bootstrap-preflight",
    operatorEvidenceConfirmed: true as const,
    executionWindowId: "window-synthetic-01",
    singleAttemptNonce: "nonce-synthetic-01",
    remoteExecutionSeparatelyAuthorized: true as const,
  });
}

function createInstrumentedTransport(options?: {
  failAtQueryIndex?: number;
  responses?: Readonly<
    Partial<Record<ProductionReadOnlyPreflightQueryId, unknown>>
  >;
}) {
  const events: string[] = [];
  const executed: ProductionReadOnlyPreflightQueryId[] = [];
  const responses = options?.responses ?? buildSyntheticReadyResults();
  const transport: ProductionReadOnlyPreflightTransport = {
    async openSession() {
      events.push("open");
    },
    async verifySafetySettings() {
      events.push("verify");
    },
    async beginReadOnlyTransaction() {
      events.push("begin");
    },
    async executeApprovedQuery(queryId) {
      events.push(`query:${queryId}`);
      if (
        options?.failAtQueryIndex !== undefined &&
        executed.length === options.failAtQueryIndex
      ) {
        throw new Error("SYNTHETIC_QUERY_FAILURE");
      }
      executed.push(queryId);
      return responses[queryId] ?? {};
    },
    async commitReadOnlyTransaction() {
      events.push("commit");
    },
    async rollbackReadOnlyTransaction() {
      events.push("rollback");
    },
    async close() {
      events.push("close");
    },
  };
  return { transport, events, executed };
}

export async function runProductionPreflightRuntimeCoreSmokeProbe() {
  const cases: Array<{ id: string; passed: boolean }> = [];
  const record = (id: string, passed: boolean) => {
    cases.push(Object.freeze({ id, passed }));
  };

  {
    const { transport, events } = createInstrumentedTransport();
    const result = await executeProductionReadOnlyPreflight({
      transport,
      authorization: null,
      boundedExecutionId: "smoke-missing-auth",
    });
    record(
      "missing_authorization_blocks_before_open",
      result.success === false &&
        result.safeErrorClass === "AUTHORIZATION_REJECTED" &&
        events.length === 0,
    );
  }

  {
    const { transport, events } = createInstrumentedTransport();
    const result = await executeProductionReadOnlyPreflight({
      transport,
      authorization: {
        ...createSyntheticAuth(),
        sourceCommit: "deadbeef",
      },
      boundedExecutionId: "smoke-wrong-source",
    });
    record(
      "wrong_source_commit_blocks_before_open",
      result.success === false &&
        result.safeErrorClass === "AUTHORIZATION_REJECTED" &&
        events.length === 0,
    );
  }

  {
    const { transport, events, executed } = createInstrumentedTransport();
    const result = await executeProductionReadOnlyPreflight({
      transport,
      authorization: createSyntheticAuth(),
      boundedExecutionId: "smoke-success",
    });
    record(
      "valid_authorization_opens_one_session",
      result.success === true && events.filter((e) => e === "open").length === 1,
    );
    record(
      "safety_settings_verified_before_begin_query",
      events.indexOf("verify") < events.indexOf("begin") &&
        events.indexOf("begin") < events.findIndex((e) => e.startsWith("query:")),
    );
    record(
      "read_only_transaction_begins_before_first_query",
      events.indexOf("begin") >= 0 &&
        events.indexOf("begin") <
          events.findIndex((e) => e.startsWith("query:")),
    );
    record(
      "successful_run_executes_exactly_18_canonical_ids",
      result.success === true &&
        executed.length === 18 &&
        executed.every(
          (id, index) =>
            id === PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER[index],
        ),
    );
    record(
      "close_attempted_after_success",
      result.success === true &&
        result.closeAttempted === true &&
        events.includes("close"),
    );
    record(
      "success_result_authorizes_no_write_or_deployment",
      result.success === true &&
        result.productionWriteAuthorized === false &&
        result.productionBootstrapAuthorized === false &&
        result.productionRollbackAuthorized === false &&
        result.productionRuntimeAuthorized === false &&
        result.publicLaunchAuthorized === false,
    );
  }

  {
    const ready = buildSyntheticReadyResults();
    const invalidResponses = {
      ...ready,
      PROD_PREFLIGHT_CURRENT_DATABASE: Object.freeze({
        resultSchemaKey: "CURRENT_DATABASE_RESULT",
        currentDatabase: "synthetic_db",
      }),
    };
    const { transport, executed } = createInstrumentedTransport({
      responses: invalidResponses,
    });
    const result = await executeProductionReadOnlyPreflight({
      transport,
      authorization: createSyntheticAuth(),
      boundedExecutionId: "smoke-validation-order",
    });
    record(
      "validation_occurs_before_next_query",
      result.success === false &&
        result.safeErrorClass === "RESULT_VALIDATION_FAILED" &&
        executed.length === 3 &&
        executed[2] === "PROD_PREFLIGHT_CURRENT_DATABASE",
    );
  }

  {
    const { transport, events, executed } = createInstrumentedTransport({
      failAtQueryIndex: 3,
    });
    const result = await executeProductionReadOnlyPreflight({
      transport,
      authorization: createSyntheticAuth(),
      boundedExecutionId: "smoke-query-fail",
    });
    record(
      "query_failure_stops_later_ids",
      result.success === false && executed.length === 3,
    );
    record(
      "eligible_failure_attempts_rollback",
      result.success === false &&
        result.rollbackAttempted === true &&
        events.includes("rollback"),
    );
    record(
      "close_attempted_after_failure",
      result.success === false &&
        result.closeAttempted === true &&
        events.includes("close"),
    );
  }

  {
    const circular: { self?: unknown } = {};
    circular.self = circular;
    const sanitized = sanitizeProductionPreflightError(circular);
    record(
      "hostile_error_sanitizer_handles_circular_object",
      sanitized.rawDetailsSuppressed === true &&
        typeof sanitized.safeErrorClass === "string",
    );
  }

  {
    const incomplete = buildSyntheticReadyResults();
    const partial = Object.fromEntries(
      Object.entries(incomplete).slice(0, 10),
    ) as Partial<
      Record<ProductionReadOnlyPreflightQueryId, NormalizedPreflightResult>
    >;
    record(
      "incomplete_results_classify_as_incomplete",
      classifyProductionPreflightTarget(partial) ===
        "TARGET_BLOCKED_INCOMPLETE_EVIDENCE",
    );
  }

  {
    const ready = buildSyntheticReadyResults();
    const blocked = Object.freeze({
      ...ready,
      PROD_PREFLIGHT_TARGET_IDENTITY: Object.freeze({
        ...ready.PROD_PREFLIGHT_TARGET_IDENTITY,
        targetIdentityMatched: false,
      }),
      PROD_PREFLIGHT_SERVER_VERSION: Object.freeze({
        ...ready.PROD_PREFLIGHT_SERVER_VERSION,
        serverMajorVersionMatched: false,
        serverMajorVersion: 16,
      }),
    });
    const reordered = Object.freeze({
      PROD_PREFLIGHT_SERVER_VERSION: blocked.PROD_PREFLIGHT_SERVER_VERSION,
      PROD_PREFLIGHT_TARGET_IDENTITY: blocked.PROD_PREFLIGHT_TARGET_IDENTITY,
      PROD_PREFLIGHT_CURRENT_DATABASE: blocked.PROD_PREFLIGHT_CURRENT_DATABASE,
      PROD_PREFLIGHT_CURRENT_USER: blocked.PROD_PREFLIGHT_CURRENT_USER,
      PROD_PREFLIGHT_TRANSACTION_CAPABILITY:
        blocked.PROD_PREFLIGHT_TRANSACTION_CAPABILITY,
      PROD_PREFLIGHT_PGCRYPTO_EXTENSION:
        blocked.PROD_PREFLIGHT_PGCRYPTO_EXTENSION,
      PROD_PREFLIGHT_PGCRYPTO_SCHEMA: blocked.PROD_PREFLIGHT_PGCRYPTO_SCHEMA,
      PROD_PREFLIGHT_PGCRYPTO_DIGEST_SIGNATURE:
        blocked.PROD_PREFLIGHT_PGCRYPTO_DIGEST_SIGNATURE,
      PROD_PREFLIGHT_PGCRYPTO_EXTENSION_OWNERSHIP:
        blocked.PROD_PREFLIGHT_PGCRYPTO_EXTENSION_OWNERSHIP,
      PROD_PREFLIGHT_SHA256_CAPABILITY:
        blocked.PROD_PREFLIGHT_SHA256_CAPABILITY,
      PROD_PREFLIGHT_AUDIT_ROLE_CONFLICTS:
        blocked.PROD_PREFLIGHT_AUDIT_ROLE_CONFLICTS,
      PROD_PREFLIGHT_AUDIT_SCHEMA_CONFLICT:
        blocked.PROD_PREFLIGHT_AUDIT_SCHEMA_CONFLICT,
      PROD_PREFLIGHT_AUDIT_VIEW_CONFLICTS:
        blocked.PROD_PREFLIGHT_AUDIT_VIEW_CONFLICTS,
      PROD_PREFLIGHT_AUDIT_FUNCTION_CONFLICTS:
        blocked.PROD_PREFLIGHT_AUDIT_FUNCTION_CONFLICTS,
      PROD_PREFLIGHT_MIGRATION_LEDGER_IDENTITY:
        blocked.PROD_PREFLIGHT_MIGRATION_LEDGER_IDENTITY,
      PROD_PREFLIGHT_MIGRATION_LEDGER_COLUMNS:
        blocked.PROD_PREFLIGHT_MIGRATION_LEDGER_COLUMNS,
      PROD_PREFLIGHT_EXECUTOR_CAPABILITY:
        blocked.PROD_PREFLIGHT_EXECUTOR_CAPABILITY,
      PROD_PREFLIGHT_ROLLBACK_CAPABILITY:
        blocked.PROD_PREFLIGHT_ROLLBACK_CAPABILITY,
    });
    const a = classifyProductionPreflightTarget(blocked);
    const b = classifyProductionPreflightTarget(reordered);
    record(
      "multi_blocker_classification_is_deterministic",
      a === "TARGET_BLOCKED_IDENTITY_MISMATCH" && a === b,
    );
  }

  const runtimeCoreSmokeCaseCount = cases.length;
  const runtimeCoreSmokeCasesPassed = cases.filter((item) => item.passed).length;
  return Object.freeze({
    checkId: "9X-B6C-PATCH" as const,
    phase: "Runtime Lifecycle, Evidence and Classification Implementation" as const,
    runtimeCoreSmokeCaseCount,
    runtimeCoreSmokeCasesPassed,
    cases: Object.freeze(cases.map((item) => Object.freeze(item))),
    allSmokePassed: runtimeCoreSmokeCasesPassed === runtimeCoreSmokeCaseCount,
  });
}
