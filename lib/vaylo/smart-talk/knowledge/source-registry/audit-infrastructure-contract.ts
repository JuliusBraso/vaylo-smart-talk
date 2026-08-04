import "server-only";

export const AUDIT_BOOTSTRAP_ID = "9X-B1" as const;
export const AUDIT_BOOTSTRAP_ARTIFACT_VERSION = "v1" as const;
export const AUDIT_BOOTSTRAP_ARTIFACT_CLASS =
  "PERMANENT_CONTROLLED_INFRASTRUCTURE_BOOTSTRAP" as const;
export const AUDIT_BOOTSTRAP_EXPECTED_SOURCE_COMMIT = "4cc9eff" as const;

export const AUDIT_BOOTSTRAP_ARTIFACT_PATHS = Object.freeze({
  bootstrapSql: "supabase/bootstrap/001_create_vaylo_audit_infrastructure.sql",
  rollbackSql: "supabase/bootstrap/001_create_vaylo_audit_infrastructure.rollback.sql",
});

export const AUDIT_ROLE_NAMES = Object.freeze({
  owner: "vaylo_audit_owner",
  privileges: "vaylo_schema_audit_privileges",
  login: "vaylo_schema_auditor",
  schema: "vaylo_audit",
});

export const AUDIT_BOOTSTRAP_METADATA = Object.freeze({
  bootstrapId: AUDIT_BOOTSTRAP_ID,
  bootstrapArtifactVersion: AUDIT_BOOTSTRAP_ARTIFACT_VERSION,
  bootstrapArtifactClass: AUDIT_BOOTSTRAP_ARTIFACT_CLASS,
  automaticDeploymentAllowed: false,
  explicitProductionAuthorizationRequired: true,
  rollbackValidationRequired: true,
  applicationSchemaObjectsAllowed: false,
  applicationRowReadsAllowed: false,
  runtimeActivationAllowed: false,
});

export const AUDIT_INTERFACE_OBJECTS = Object.freeze([
  "platform_schemas",
  "extensions",
  "tables",
  "columns",
  "constraints",
  "indexes",
  "enums",
  "triggers",
  "rls_state",
  "policies",
  "server_state",
  "transaction_state",
  "migration_ledger",
  "functions",
  "function_fingerprints",
  "table_grants",
  "function_grants",
  "internal_engine_privileges",
  "source_registry_collisions",
] as const);

export const AUDIT_APPROVED_QUERY_MAPPING = Object.freeze({
  SERVER_VERSION: "server_state",
  TRANSACTION_READ_ONLY_STATE: "transaction_state",
  STATEMENT_TIMEOUT_STATE: "transaction_state",
  LOCK_TIMEOUT_STATE: "transaction_state",
  PLATFORM_SCHEMA_PRESENCE: "platform_schemas",
  REQUIRED_EXTENSION_INVENTORY: "extensions",
  MIGRATION_LEDGER_METADATA: "migration_ledger",
  PUBLIC_TABLE_CATALOG: "tables",
  PUBLIC_COLUMN_CATALOG: "columns",
  PUBLIC_CONSTRAINT_CATALOG: "constraints",
  PUBLIC_INDEX_CATALOG: "indexes",
  PUBLIC_ENUM_CATALOG: "enums",
  PUBLIC_FUNCTION_IDENTITY_CATALOG: "functions",
  PUBLIC_FUNCTION_DEFINITION_FINGERPRINTS: "function_fingerprints",
  PUBLIC_TRIGGER_CATALOG: "triggers",
  RLS_ENABLEMENT_CATALOG: "rls_state",
  POLICY_DEFINITION_CATALOG: "policies",
  TABLE_GRANT_CATALOG: "table_grants",
  FUNCTION_GRANT_CATALOG: "function_grants",
  INTERNAL_ENGINE_PRIVILEGE_CATALOG: "internal_engine_privileges",
  SOURCE_REGISTRY_COLLISION_CATALOG: "source_registry_collisions",
} as const);

export const AUDIT_SESSION_REQUIREMENTS = Object.freeze({
  defaultTransactionReadOnly: "on",
  statementTimeout: "5s",
  lockTimeout: "1s",
  idleInTransactionSessionTimeout: "10s",
  searchPath: "pg_catalog, vaylo_audit",
  auditLoginRoleName: AUDIT_ROLE_NAMES.login,
  loginRoleSessionDefaults: true,
  privilegeRoleSessionDefaults: true,
  effectiveSessionDefaultSource: "LOGIN_ROLE",
  memberRoleDefaultsReliedUponAtLogin: false,
  setRoleAppliesMemberDefaultsAssumed: false,
  databaseRoleDefaultReadOnlyRequired: true,
  helperMustVerifyEverySession: true,
  helperMustVerifySessionDefaults: true,
  helperMustBeginExplicitReadOnlyTransaction: true,
  explicitReadOnlyTransactionRequired: true,
  sessionSettingMismatchBlocksExecution: true,
  sessionSettingMismatchDisposition: "BLOCK_EXECUTION",
  sessionSettingsAreMutableByRole: true,
  roleDefaultsAreDefenseInDepth: true,
  roleDefaultsAloneAreNotAuthorizationBoundary: true,
  temporaryObjectPrivilegeMayBeInheritedFromPublic: true,
});

export const AUDIT_PROHIBITED_PRIVILEGES = Object.freeze([
  "SUPERUSER",
  "CREATEDB",
  "CREATEROLE",
  "REPLICATION",
  "BYPASSRLS",
  "pg_read_all_data",
  "CREATE_ON_PUBLIC_SCHEMA",
  "APPLICATION_TABLE_SELECT",
  "AUTH_USERS_SELECT",
  "STORAGE_OBJECTS_SELECT",
  "MUTATION_RPC_EXECUTE",
] as const);

export const AUDIT_PROHIBITED_TABLES = Object.freeze([
  "public.profiles",
  "public.documents",
  "public.user_documents",
  "public.tasks",
  "public.jobs",
  "public.knowledge_sources",
  "public.knowledge_source_versions",
  "public.knowledge_publishers",
  "public.knowledge_authorities",
  "public.knowledge_review_records",
  "public.knowledge_retrieval_metadata",
  "auth.users",
  "storage.objects",
] as const);

export const AUDIT_CREDENTIAL_BOUNDARY = Object.freeze({
  repositoryCredentialReadAllowed: false,
  repositoryCredentialStorageAllowed: false,
  repositoryCredentialOutputAllowed: false,
  bootstrapContainsCredentialMaterial: false,
  credentialProvisioningRequiresSeparateOperatorStep: true,
});

export const AUDIT_AUTHORIZATION_PREREQUISITES = Object.freeze({
  rollbackOwnerConfirmed: false,
  rollbackArtifactHash: null,
  bootstrapArtifactHash: null,
  targetFingerprintConfirmed: false,
  namedOperatorConfirmed: false,
  executionWindowConfirmed: false,
  recoveryEvidenceAvailable: false,
});

export const AUDIT_FUNCTION_FINGERPRINT_CONTRACT = Object.freeze({
  algorithm: "SHA-256",
  sha256Available: true,
  pgcryptoInstallationAuthorized: false,
  pgcryptoPreinstalledRequired: true,
  pgcryptoRequiredSchema: "extensions",
  pgcryptoRequiredDigestSignature: "extensions.digest(text,text)",
  pgcryptoDigestMustBeExtensionOwned: true,
  pgcryptoDigestUsageGrantedToAuditPrivilegeRole: true,
  pgcryptoDigestExecuteGrantedToAuditPrivilegeRole: true,
  bootstrapMustBlockAbsentOrUnexpectedPgcrypto: true,
  helperMustBlockSha256EquivalenceClaims: false,
  rawFunctionDefinitionExposed: false,
});

export const AUDIT_MIGRATION_LEDGER_CONTRACT = Object.freeze({
  migrationLedgerSchemaName: "supabase_migrations",
  migrationLedgerTableName: "schema_migrations",
  migrationLedgerFunctionName: "migration_ledger",
  migrationLedgerOwnerRoleName: AUDIT_ROLE_NAMES.owner,
  migrationLedgerOwnerPrivileges: ["USAGE_ON_EXACT_SCHEMA", "SELECT_ON_EXACT_TABLE"],
  migrationLedgerOwnerPrivilegeScope: "EXACT_SCHEMA_USAGE_AND_EXACT_TABLE_SELECT",
  migrationLedgerDirectAccessPolicy: "SECURITY_DEFINER_FUNCTION_ONLY",
  migrationLedgerOutputPolicy: "VERSION_IDENTIFIER_AND_DERIVED_METADATA_ONLY",
  migrationLedgerAbsentStatePolicy: "REQUIRE_EXACT_LEDGER_OBJECT",
  migrationLedgerUnexpectedShapeDisposition: "BLOCK_EXECUTION",
  migrationLedgerRepairAllowed: false,
  migrationLedgerPrivilegeRoleDirectSelectAllowed: false,
  migrationLedgerLoginRoleDirectSelectAllowed: false,
  migrationLedgerRollbackPolicy: "REVOKE_EXACT_TABLE_SELECT_AND_SCHEMA_USAGE",
});

export type AuditInterfaceObject = (typeof AUDIT_INTERFACE_OBJECTS)[number];
export type ApprovedAuditQueryId = keyof typeof AUDIT_APPROVED_QUERY_MAPPING;
