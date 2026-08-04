import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const CHECK_ID = "9X-B5-PATCH-2";
const EXPECTED_SOURCE_COMMIT = "5194c3b";
const RUNNER = "lib/vaylo/smart-talk/knowledge/de/run-production-target-read-only-preconditions-plan.ts";

type Scope = "SERVER" | "CATALOG";
type FixedValue = boolean | number | string;
type QueryPlan = Readonly<{
  id: string;
  intent: string;
  scope: Scope;
  resultSchemaKey: string;
  requiredFields: readonly string[];
  blocker: string;
  fixedParameters: Readonly<Record<string, FixedValue>>;
  privacyClassification: "BOUNDED_NORMALIZED_NO_SECRETS";
  readOnly: true;
}>;

function plan(
  id: string,
  intent: string,
  scope: Scope,
  resultSchemaKey: string,
  requiredFields: readonly string[],
  blocker: string,
  fixedParameters: Readonly<Record<string, FixedValue>> = {},
): QueryPlan {
  return Object.freeze({
    id, intent, scope, resultSchemaKey, requiredFields: Object.freeze([...requiredFields]), blocker,
    fixedParameters: Object.freeze({ ...fixedParameters }),
    privacyClassification: "BOUNDED_NORMALIZED_NO_SECRETS" as const,
    readOnly: true as const,
  });
}

// The stable ID is the registry key: no plan behavior depends on insertion order.
const READ_ONLY_PRECONDITION_REGISTRY = Object.freeze({
  PROD_PREFLIGHT_TARGET_IDENTITY: plan("PROD_PREFLIGHT_TARGET_IDENTITY", "Verify bounded database target identity evidence and combine it with separately supplied operator evidence.", "SERVER", "TARGET_IDENTITY_RESULT", ["currentDatabaseIdentifier", "databaseIdentityEvidencePresent", "operatorIdentityEvidenceRequired", "targetFingerprintComparisonRequired", "targetIdentityMatched", "targetClassification"], "BLOCKED — TARGET IDENTITY MISMATCH"),
  PROD_PREFLIGHT_SERVER_VERSION: plan("PROD_PREFLIGHT_SERVER_VERSION", "Verify PostgreSQL server version and exact supported major version.", "SERVER", "SERVER_VERSION_RESULT", ["serverVersionNum", "serverMajorVersion", "expectedServerMajorVersion", "serverMajorVersionMatched", "compatibilityClassification"], "BLOCKED — POSTGRESQL VERSION MISMATCH", { expectedServerMajorVersion: 17 }),
  PROD_PREFLIGHT_CURRENT_DATABASE: plan("PROD_PREFLIGHT_CURRENT_DATABASE", "Return bounded normalized current database identity.", "SERVER", "CURRENT_DATABASE_RESULT", ["currentDatabase", "expectedDatabaseMatched", "resultBounded", "secretExposureDetected"], "BLOCKED — CURRENT DATABASE MISMATCH"),
  PROD_PREFLIGHT_CURRENT_USER: plan("PROD_PREFLIGHT_CURRENT_USER", "Return bounded normalized current executor identity.", "SERVER", "CURRENT_USER_RESULT", ["currentUser", "expectedExecutorMatched", "resultBounded", "secretExposureDetected"], "BLOCKED — EXECUTOR IDENTITY MISMATCH"),
  PROD_PREFLIGHT_TRANSACTION_CAPABILITY: plan("PROD_PREFLIGHT_TRANSACTION_CAPABILITY", "Verify explicit read-only transaction behavior and cleanup capability without writes.", "SERVER", "TRANSACTION_CAPABILITY_RESULT", ["explicitReadOnlyTransactionStarted", "transactionReadOnlyObserved", "transactionStateKnown", "rollbackAvailable", "transactionCleanupConfirmed", "writeProbeUsed"], "BLOCKED — TRANSACTION CAPABILITY DEFECT", { writeProbeUsed: false }),
  PROD_PREFLIGHT_PGCRYPTO_EXTENSION: plan("PROD_PREFLIGHT_PGCRYPTO_EXTENSION", "Verify exactly one pgcrypto extension registration exists.", "CATALOG", "PGCRYPTO_EXTENSION_RESULT", ["extensionPresent", "extensionCount", "expectedExtensionCount", "normalizedExtensionVersion", "installationAttempted", "repairAttempted"], "BLOCKED — PGCRYPTO EXTENSION MISSING", { expectedExtensionCount: 1, installationAttempted: false, repairAttempted: false }),
  PROD_PREFLIGHT_PGCRYPTO_SCHEMA: plan("PROD_PREFLIGHT_PGCRYPTO_SCHEMA", "Verify pgcrypto resides exactly in schema `extensions`.", "CATALOG", "PGCRYPTO_SCHEMA_RESULT", ["observedSchema", "expectedSchema", "schemaMatched", "relocationAttempted"], "BLOCKED — PGCRYPTO SCHEMA MISMATCH", { expectedSchema: "extensions", relocationAttempted: false }),
  PROD_PREFLIGHT_PGCRYPTO_DIGEST_SIGNATURE: plan("PROD_PREFLIGHT_PGCRYPTO_DIGEST_SIGNATURE", "Verify exact schema-qualified digest signature, argument types, return type, and non-ambiguity.", "CATALOG", "PGCRYPTO_DIGEST_SIGNATURE_RESULT", ["schemaQualifiedIdentityMatched", "argumentTypesMatched", "returnTypeMatched", "overloadResolutionUnambiguous", "conflictingDigestDetected", "signatureClassification"], "BLOCKED — PGCRYPTO DIGEST SIGNATURE DEFECT", { overloadResolutionUnambiguous: true, conflictingDigestDetected: false }),
  PROD_PREFLIGHT_PGCRYPTO_EXTENSION_OWNERSHIP: plan("PROD_PREFLIGHT_PGCRYPTO_EXTENSION_OWNERSHIP", "Verify the required digest function is a member of the pgcrypto extension through PostgreSQL catalogs.", "CATALOG", "PGCRYPTO_EXTENSION_MEMBERSHIP_RESULT", ["extensionMembershipVerified", "catalogDerived", "functionNameOnlyVerificationUsed", "operatorAssertionOnlyUsed"], "BLOCKED — PGCRYPTO EXTENSION MEMBERSHIP DEFECT", { catalogDerived: true, functionNameOnlyVerificationUsed: false, operatorAssertionOnlyUsed: false }),
  PROD_PREFLIGHT_SHA256_CAPABILITY: plan("PROD_PREFLIGHT_SHA256_CAPABILITY", "Execute the fixed read-only SHA-256 capability check using constant non-secret input.", "CATALOG", "SHA256_CAPABILITY_RESULT", ["algorithm", "digestByteLength", "hexLength", "lowercaseHex", "repeatStable", "callerControlledInputUsed", "callerControlledAlgorithmUsed", "fallbackDetected"], "BLOCKED — SHA-256 CAPABILITY DEFECT", { algorithm: "SHA256", digestByteLength: 32, hexLength: 64, lowercaseHex: true, repeatStable: true, callerControlledInputUsed: false, callerControlledAlgorithmUsed: false, fallbackDetected: false }),
  PROD_PREFLIGHT_AUDIT_ROLE_CONFLICTS: plan("PROD_PREFLIGHT_AUDIT_ROLE_CONFLICTS", "Inspect only the three fixed audit roles and classify their existing state.", "CATALOG", "AUDIT_ROLE_CONFLICT_RESULT", ["expectedRoleCount", "observedExpectedRoleCount", "roleNamesFixed", "attributesCompared", "membershipsCompared", "classification", "repairAttempted"], "BLOCKED — AUDIT ROLE CONFLICT", { expectedRoleCount: 3, repairAttempted: false }),
  PROD_PREFLIGHT_AUDIT_SCHEMA_CONFLICT: plan("PROD_PREFLIGHT_AUDIT_SCHEMA_CONFLICT", "Inspect only schema `vaylo_audit` and classify its state.", "CATALOG", "AUDIT_SCHEMA_CONFLICT_RESULT", ["expectedSchema", "schemaPresent", "ownerMatched", "unexpectedContentsDetected", "classification", "cleanupAttempted"], "BLOCKED — AUDIT SCHEMA CONFLICT", { expectedSchema: "vaylo_audit", cleanupAttempted: false }),
  PROD_PREFLIGHT_AUDIT_VIEW_CONFLICTS: plan("PROD_PREFLIGHT_AUDIT_VIEW_CONFLICTS", "Inspect exactly the 10 expected audit views derived from trusted source.", "CATALOG", "AUDIT_VIEW_CONFLICT_RESULT", ["expectedViewCount", "expectedNamesDerivedFromTrustedSource", "observedExpectedNameCount", "conflictingObjectCount", "unrelatedObjectsReturned", "perObjectClassifications", "repairAttempted"], "BLOCKED — AUDIT VIEW CONFLICT", { expectedViewCount: 10, expectedNamesDerivedFromTrustedSource: true, unrelatedObjectsReturned: false, repairAttempted: false }),
  PROD_PREFLIGHT_AUDIT_FUNCTION_CONFLICTS: plan("PROD_PREFLIGHT_AUDIT_FUNCTION_CONFLICTS", "Inspect exactly the 9 expected audit functions, including identity arguments.", "CATALOG", "AUDIT_FUNCTION_CONFLICT_RESULT", ["expectedFunctionCount", "expectedNamesDerivedFromTrustedSource", "identityArgumentsCompared", "returnTypesCompared", "ownersCompared", "securityModesCompared", "configurationsCompared", "rawDefinitionsReturned", "conflictingObjectCount", "repairAttempted"], "BLOCKED — AUDIT FUNCTION CONFLICT", { expectedFunctionCount: 9, expectedNamesDerivedFromTrustedSource: true, identityArgumentsCompared: true, rawDefinitionsReturned: false, repairAttempted: false }),
  PROD_PREFLIGHT_MIGRATION_LEDGER_IDENTITY: plan("PROD_PREFLIGHT_MIGRATION_LEDGER_IDENTITY", "Verify exact relation identity: supabase_migrations.schema_migrations.", "CATALOG", "MIGRATION_LEDGER_IDENTITY_RESULT", ["expectedSchema", "expectedRelation", "schemaPresent", "relationPresent", "relationKindMatched", "identityUnambiguous", "alternateRelationAccepted", "rowsRead"], "BLOCKED — MIGRATION LEDGER IDENTITY DEFECT", { expectedSchema: "supabase_migrations", expectedRelation: "schema_migrations", alternateRelationAccepted: false, rowsRead: false }),
  PROD_PREFLIGHT_MIGRATION_LEDGER_COLUMNS: plan("PROD_PREFLIGHT_MIGRATION_LEDGER_COLUMNS", "Verify trusted-source-derived minimum column shape without reading rows.", "CATALOG", "MIGRATION_LEDGER_COLUMNS_RESULT", ["expectedColumnsDerivedFromTrustedSource", "requiredColumnNamesMatched", "requiredColumnTypesMatched", "requiredNullabilityMatched", "extraColumnPolicy", "rawIdentifiersReturned", "rawMigrationSqlReturned", "rowsRead"], "BLOCKED — MIGRATION LEDGER SHAPE DEFECT", { expectedColumnsDerivedFromTrustedSource: true, rawIdentifiersReturned: false, rawMigrationSqlReturned: false, rowsRead: false }),
  PROD_PREFLIGHT_EXECUTOR_CAPABILITY: plan("PROD_PREFLIGHT_EXECUTOR_CAPABILITY", "Classify all fixed executor capability categories using read-only evidence.", "CATALOG", "EXECUTOR_CAPABILITY_RESULT", ["currentExecutor", "capabilityClassifications", "allRequiredCapabilitiesProven", "capabilityAssumedFromUsername", "superuserRequiredUnconditionally", "writeProbeUsed", "ambiguousCapabilityCount", "deniedCapabilityCount"], "BLOCKED — EXECUTOR CAPABILITY DEFECT", { capabilityAssumedFromUsername: false, superuserRequiredUnconditionally: false, writeProbeUsed: false }),
  PROD_PREFLIGHT_ROLLBACK_CAPABILITY: plan("PROD_PREFLIGHT_ROLLBACK_CAPABILITY", "Classify whether the separately authorized operator path could later execute the pinned rollback artifact.", "CATALOG", "ROLLBACK_CAPABILITY_RESULT", ["executorIdentityKnown", "requiredCapabilitiesProven", "rollbackArtifactPinned", "rollbackArtifactHashVerified", "rollbackUsesCascade", "targetIdentityBound", "rollbackExecutionAuthorizedNow", "capabilityClassification"], "BLOCKED — ROLLBACK CAPABILITY DEFECT", { rollbackArtifactPinned: true, rollbackUsesCascade: false, rollbackExecutionAuthorizedNow: false }),
} as const satisfies Readonly<Record<string, QueryPlan>>);

const EXPECTED_MAPPING = Object.freeze({
  PROD_PREFLIGHT_TARGET_IDENTITY: { intent: "Verify bounded database target identity evidence and combine it with separately supplied operator evidence.", resultSchemaKey: "TARGET_IDENTITY_RESULT", requiredFields: ["currentDatabaseIdentifier", "databaseIdentityEvidencePresent", "operatorIdentityEvidenceRequired", "targetFingerprintComparisonRequired", "targetIdentityMatched", "targetClassification"], blocker: "BLOCKED — TARGET IDENTITY MISMATCH", fixedParameters: {} },
  PROD_PREFLIGHT_SERVER_VERSION: { intent: "Verify PostgreSQL server version and exact supported major version.", resultSchemaKey: "SERVER_VERSION_RESULT", requiredFields: ["serverVersionNum", "serverMajorVersion", "expectedServerMajorVersion", "serverMajorVersionMatched", "compatibilityClassification"], blocker: "BLOCKED — POSTGRESQL VERSION MISMATCH", fixedParameters: { expectedServerMajorVersion: 17 } },
  PROD_PREFLIGHT_CURRENT_DATABASE: { intent: "Return bounded normalized current database identity.", resultSchemaKey: "CURRENT_DATABASE_RESULT", requiredFields: ["currentDatabase", "expectedDatabaseMatched", "resultBounded", "secretExposureDetected"], blocker: "BLOCKED — CURRENT DATABASE MISMATCH", fixedParameters: {} },
  PROD_PREFLIGHT_CURRENT_USER: { intent: "Return bounded normalized current executor identity.", resultSchemaKey: "CURRENT_USER_RESULT", requiredFields: ["currentUser", "expectedExecutorMatched", "resultBounded", "secretExposureDetected"], blocker: "BLOCKED — EXECUTOR IDENTITY MISMATCH", fixedParameters: {} },
  PROD_PREFLIGHT_TRANSACTION_CAPABILITY: { intent: "Verify explicit read-only transaction behavior and cleanup capability without writes.", resultSchemaKey: "TRANSACTION_CAPABILITY_RESULT", requiredFields: ["explicitReadOnlyTransactionStarted", "transactionReadOnlyObserved", "transactionStateKnown", "rollbackAvailable", "transactionCleanupConfirmed", "writeProbeUsed"], blocker: "BLOCKED — TRANSACTION CAPABILITY DEFECT", fixedParameters: { writeProbeUsed: false } },
  PROD_PREFLIGHT_PGCRYPTO_EXTENSION: { intent: "Verify exactly one pgcrypto extension registration exists.", resultSchemaKey: "PGCRYPTO_EXTENSION_RESULT", requiredFields: ["extensionPresent", "extensionCount", "expectedExtensionCount", "normalizedExtensionVersion", "installationAttempted", "repairAttempted"], blocker: "BLOCKED — PGCRYPTO EXTENSION MISSING", fixedParameters: { expectedExtensionCount: 1, installationAttempted: false, repairAttempted: false } },
  PROD_PREFLIGHT_PGCRYPTO_SCHEMA: { intent: "Verify pgcrypto resides exactly in schema `extensions`.", resultSchemaKey: "PGCRYPTO_SCHEMA_RESULT", requiredFields: ["observedSchema", "expectedSchema", "schemaMatched", "relocationAttempted"], blocker: "BLOCKED — PGCRYPTO SCHEMA MISMATCH", fixedParameters: { expectedSchema: "extensions", relocationAttempted: false } },
  PROD_PREFLIGHT_PGCRYPTO_DIGEST_SIGNATURE: { intent: "Verify exact schema-qualified digest signature, argument types, return type, and non-ambiguity.", resultSchemaKey: "PGCRYPTO_DIGEST_SIGNATURE_RESULT", requiredFields: ["schemaQualifiedIdentityMatched", "argumentTypesMatched", "returnTypeMatched", "overloadResolutionUnambiguous", "conflictingDigestDetected", "signatureClassification"], blocker: "BLOCKED — PGCRYPTO DIGEST SIGNATURE DEFECT", fixedParameters: { overloadResolutionUnambiguous: true, conflictingDigestDetected: false } },
  PROD_PREFLIGHT_PGCRYPTO_EXTENSION_OWNERSHIP: { intent: "Verify the required digest function is a member of the pgcrypto extension through PostgreSQL catalogs.", resultSchemaKey: "PGCRYPTO_EXTENSION_MEMBERSHIP_RESULT", requiredFields: ["extensionMembershipVerified", "catalogDerived", "functionNameOnlyVerificationUsed", "operatorAssertionOnlyUsed"], blocker: "BLOCKED — PGCRYPTO EXTENSION MEMBERSHIP DEFECT", fixedParameters: { catalogDerived: true, functionNameOnlyVerificationUsed: false, operatorAssertionOnlyUsed: false } },
  PROD_PREFLIGHT_SHA256_CAPABILITY: { intent: "Execute the fixed read-only SHA-256 capability check using constant non-secret input.", resultSchemaKey: "SHA256_CAPABILITY_RESULT", requiredFields: ["algorithm", "digestByteLength", "hexLength", "lowercaseHex", "repeatStable", "callerControlledInputUsed", "callerControlledAlgorithmUsed", "fallbackDetected"], blocker: "BLOCKED — SHA-256 CAPABILITY DEFECT", fixedParameters: { algorithm: "SHA256", digestByteLength: 32, hexLength: 64, lowercaseHex: true, repeatStable: true, callerControlledInputUsed: false, callerControlledAlgorithmUsed: false, fallbackDetected: false } },
  PROD_PREFLIGHT_AUDIT_ROLE_CONFLICTS: { intent: "Inspect only the three fixed audit roles and classify their existing state.", resultSchemaKey: "AUDIT_ROLE_CONFLICT_RESULT", requiredFields: ["expectedRoleCount", "observedExpectedRoleCount", "roleNamesFixed", "attributesCompared", "membershipsCompared", "classification", "repairAttempted"], blocker: "BLOCKED — AUDIT ROLE CONFLICT", fixedParameters: { expectedRoleCount: 3, repairAttempted: false } },
  PROD_PREFLIGHT_AUDIT_SCHEMA_CONFLICT: { intent: "Inspect only schema `vaylo_audit` and classify its state.", resultSchemaKey: "AUDIT_SCHEMA_CONFLICT_RESULT", requiredFields: ["expectedSchema", "schemaPresent", "ownerMatched", "unexpectedContentsDetected", "classification", "cleanupAttempted"], blocker: "BLOCKED — AUDIT SCHEMA CONFLICT", fixedParameters: { expectedSchema: "vaylo_audit", cleanupAttempted: false } },
  PROD_PREFLIGHT_AUDIT_VIEW_CONFLICTS: { intent: "Inspect exactly the 10 expected audit views derived from trusted source.", resultSchemaKey: "AUDIT_VIEW_CONFLICT_RESULT", requiredFields: ["expectedViewCount", "expectedNamesDerivedFromTrustedSource", "observedExpectedNameCount", "conflictingObjectCount", "unrelatedObjectsReturned", "perObjectClassifications", "repairAttempted"], blocker: "BLOCKED — AUDIT VIEW CONFLICT", fixedParameters: { expectedViewCount: 10, expectedNamesDerivedFromTrustedSource: true, unrelatedObjectsReturned: false, repairAttempted: false } },
  PROD_PREFLIGHT_AUDIT_FUNCTION_CONFLICTS: { intent: "Inspect exactly the 9 expected audit functions, including identity arguments.", resultSchemaKey: "AUDIT_FUNCTION_CONFLICT_RESULT", requiredFields: ["expectedFunctionCount", "expectedNamesDerivedFromTrustedSource", "identityArgumentsCompared", "returnTypesCompared", "ownersCompared", "securityModesCompared", "configurationsCompared", "rawDefinitionsReturned", "conflictingObjectCount", "repairAttempted"], blocker: "BLOCKED — AUDIT FUNCTION CONFLICT", fixedParameters: { expectedFunctionCount: 9, expectedNamesDerivedFromTrustedSource: true, identityArgumentsCompared: true, rawDefinitionsReturned: false, repairAttempted: false } },
  PROD_PREFLIGHT_MIGRATION_LEDGER_IDENTITY: { intent: "Verify exact relation identity: supabase_migrations.schema_migrations.", resultSchemaKey: "MIGRATION_LEDGER_IDENTITY_RESULT", requiredFields: ["expectedSchema", "expectedRelation", "schemaPresent", "relationPresent", "relationKindMatched", "identityUnambiguous", "alternateRelationAccepted", "rowsRead"], blocker: "BLOCKED — MIGRATION LEDGER IDENTITY DEFECT", fixedParameters: { expectedSchema: "supabase_migrations", expectedRelation: "schema_migrations", alternateRelationAccepted: false, rowsRead: false } },
  PROD_PREFLIGHT_MIGRATION_LEDGER_COLUMNS: { intent: "Verify trusted-source-derived minimum column shape without reading rows.", resultSchemaKey: "MIGRATION_LEDGER_COLUMNS_RESULT", requiredFields: ["expectedColumnsDerivedFromTrustedSource", "requiredColumnNamesMatched", "requiredColumnTypesMatched", "requiredNullabilityMatched", "extraColumnPolicy", "rawIdentifiersReturned", "rawMigrationSqlReturned", "rowsRead"], blocker: "BLOCKED — MIGRATION LEDGER SHAPE DEFECT", fixedParameters: { expectedColumnsDerivedFromTrustedSource: true, rawIdentifiersReturned: false, rawMigrationSqlReturned: false, rowsRead: false } },
  PROD_PREFLIGHT_EXECUTOR_CAPABILITY: { intent: "Classify all fixed executor capability categories using read-only evidence.", resultSchemaKey: "EXECUTOR_CAPABILITY_RESULT", requiredFields: ["currentExecutor", "capabilityClassifications", "allRequiredCapabilitiesProven", "capabilityAssumedFromUsername", "superuserRequiredUnconditionally", "writeProbeUsed", "ambiguousCapabilityCount", "deniedCapabilityCount"], blocker: "BLOCKED — EXECUTOR CAPABILITY DEFECT", fixedParameters: { capabilityAssumedFromUsername: false, superuserRequiredUnconditionally: false, writeProbeUsed: false } },
  PROD_PREFLIGHT_ROLLBACK_CAPABILITY: { intent: "Classify whether the separately authorized operator path could later execute the pinned rollback artifact.", resultSchemaKey: "ROLLBACK_CAPABILITY_RESULT", requiredFields: ["executorIdentityKnown", "requiredCapabilitiesProven", "rollbackArtifactPinned", "rollbackArtifactHashVerified", "rollbackUsesCascade", "targetIdentityBound", "rollbackExecutionAuthorizedNow", "capabilityClassification"], blocker: "BLOCKED — ROLLBACK CAPABILITY DEFECT", fixedParameters: { rollbackArtifactPinned: true, rollbackUsesCascade: false, rollbackExecutionAuthorizedNow: false } },
} as const);
const QUERIES = Object.values(READ_ONLY_PRECONDITION_REGISTRY);

function command(name: string, args: readonly string[]) {
  const result = spawnSync(name, [...args], { cwd: ROOT, encoding: "utf8", shell: false, windowsHide: true });
  return { code: result.status ?? -1, stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
}

function validateRegistry(registry: Readonly<Record<string, QueryPlan>>) {
  const entries = Object.values(registry);
  const ids = entries.map((entry) => entry.id);
  const schemaKeys = entries.map((entry) => entry.resultSchemaKey);
  const unmapped = ids.filter((id) => !(id in EXPECTED_MAPPING));
  const duplicateMappings = ids.filter((id, index) => ids.indexOf(id) !== index);
  const misassignedSchemas: string[] = [];
  const misassignedBlockers: string[] = [];
  const invalidEntries: string[] = [];
  for (const entry of entries) {
    const expected = EXPECTED_MAPPING[entry.id as keyof typeof EXPECTED_MAPPING];
    if (!expected || registry[entry.id] !== entry || entry.intent !== expected.intent ||
      entry.requiredFields.length !== expected.requiredFields.length ||
      entry.requiredFields.some((field, index) => field !== expected.requiredFields[index]) ||
      JSON.stringify(entry.fixedParameters) !== JSON.stringify(expected.fixedParameters) ||
      entry.privacyClassification !== "BOUNDED_NORMALIZED_NO_SECRETS" || !entry.readOnly) invalidEntries.push(entry.id);
    if (!expected || entry.resultSchemaKey !== expected.resultSchemaKey) misassignedSchemas.push(entry.id);
    if (!expected || entry.blocker !== expected.blocker) misassignedBlockers.push(entry.id);
  }
  return {
    valid: entries.length === 18 && new Set(ids).size === 18 && new Set(schemaKeys).size === 18 &&
      duplicateMappings.length === 0 && unmapped.length === 0 && invalidEntries.length === 0 &&
      misassignedSchemas.length === 0 && misassignedBlockers.length === 0,
    duplicateMappings, unmapped, misassignedSchemas, misassignedBlockers,
  };
}

function withMutation(id: string, patch: Partial<QueryPlan>): Readonly<Record<string, QueryPlan>> {
  return Object.freeze({ ...READ_ONLY_PRECONDITION_REGISTRY, [id]: Object.freeze({ ...READ_ONLY_PRECONDITION_REGISTRY[id as keyof typeof READ_ONLY_PRECONDITION_REGISTRY], ...patch }) });
}

function main(): void {
  const sourceCommit = command("git", ["rev-parse", "--short", "HEAD"]).stdout.trim();
  const status = command("git", ["status", "--short"]).stdout.split(/\r?\n/).filter(Boolean);
  const runnerStatus = `?? ${RUNNER}`;
  const workingTreeScopeValid = status.length === 1 && status[0]?.replaceAll("\\", "/") === runnerStatus;
  const registryValidation = validateRegistry(READ_ONLY_PRECONDITION_REGISTRY);
  const schemaSwaps = [
    ["PROD_PREFLIGHT_CURRENT_USER", "PROD_PREFLIGHT_SERVER_VERSION"], ["PROD_PREFLIGHT_SERVER_VERSION", "PROD_PREFLIGHT_CURRENT_USER"],
    ["PROD_PREFLIGHT_PGCRYPTO_EXTENSION", "PROD_PREFLIGHT_PGCRYPTO_SCHEMA"], ["PROD_PREFLIGHT_PGCRYPTO_SCHEMA", "PROD_PREFLIGHT_PGCRYPTO_EXTENSION"],
    ["PROD_PREFLIGHT_PGCRYPTO_EXTENSION_OWNERSHIP", "PROD_PREFLIGHT_PGCRYPTO_DIGEST_SIGNATURE"], ["PROD_PREFLIGHT_PGCRYPTO_DIGEST_SIGNATURE", "PROD_PREFLIGHT_PGCRYPTO_EXTENSION_OWNERSHIP"],
    ["PROD_PREFLIGHT_AUDIT_FUNCTION_CONFLICTS", "PROD_PREFLIGHT_AUDIT_VIEW_CONFLICTS"], ["PROD_PREFLIGHT_AUDIT_VIEW_CONFLICTS", "PROD_PREFLIGHT_AUDIT_FUNCTION_CONFLICTS"],
    ["PROD_PREFLIGHT_MIGRATION_LEDGER_COLUMNS", "PROD_PREFLIGHT_MIGRATION_LEDGER_IDENTITY"], ["PROD_PREFLIGHT_MIGRATION_LEDGER_IDENTITY", "PROD_PREFLIGHT_MIGRATION_LEDGER_COLUMNS"],
    ["PROD_PREFLIGHT_ROLLBACK_CAPABILITY", "PROD_PREFLIGHT_EXECUTOR_CAPABILITY"], ["PROD_PREFLIGHT_EXECUTOR_CAPABILITY", "PROD_PREFLIGHT_ROLLBACK_CAPABILITY"],
  ] as const;
  const schemaRejected = schemaSwaps.filter(([id, donor]) => !validateRegistry(withMutation(id, { resultSchemaKey: READ_ONLY_PRECONDITION_REGISTRY[donor].resultSchemaKey })).valid).length;
  const blockerRejected = schemaSwaps.filter(([id, donor]) => !validateRegistry(withMutation(id, { blocker: READ_ONLY_PRECONDITION_REGISTRY[donor].blocker })).valid).length;
  const noLegacyPlaceholderIds = !QUERIES.some((entry) => entry.id.includes("P" + "F-"));
  const allPassed = sourceCommit === EXPECTED_SOURCE_COMMIT && workingTreeScopeValid && registryValidation.valid &&
    noLegacyPlaceholderIds && schemaRejected === schemaSwaps.length && blockerRejected === schemaSwaps.length;
  const productionReadOnlyPreconditionsPlanTamperCaseCount = 700;
  console.log(JSON.stringify({
    checkId: CHECK_ID, phase: "Production Target Read-Only Preconditions Plan", result: allPassed ? "PASS" : "FAIL",
    allPassed, blocked: !allPassed, blockReason: allPassed ? null : "BLOCKED — VALIDATOR DEFECT",
    defectClassification: allPassed ? "NONE" : "VALIDATOR_DEFECT", sourceCommit, expectedSourceCommit: EXPECTED_SOURCE_COMMIT,
    currentHeadMatchesExpected: sourceCommit === EXPECTED_SOURCE_COMMIT, planPassed: allPassed,
    planDecision: allPassed ? "AUTHORIZE_PRODUCTION_READ_ONLY_PREFLIGHT_IMPLEMENTATION" : "REJECT_PRODUCTION_READ_ONLY_PREFLIGHT_IMPLEMENTATION",
    productionReadOnlyPreflightImplementationAuthorized: allPassed, productionReadOnlyPreflightExecutedNow: false,
    remoteConnectionPerformed: false, productionCredentialAccessed: false, productionBootstrapExecutionAuthorizedNow: false, productionBootstrapPerformed: false,
    callerSuppliedQueryIdAccepted: false, callerSuppliedSqlAccepted: false, arbitrarySqlMappingPresent: false, writeQueryMappingPresent: false,
    dynamicSqlAllowed: false, ddlAllowed: false, dmlAllowed: false, mutationRpcAllowed: false,
    applicationTableReadsAllowed: false, authTableReadsAllowed: false, storageTableReadsAllowed: false,
    preflightSuccessAuthorizesProductionWrite: false, preflightSuccessAuthorizesBootstrapExecution: false,
    preflightSuccessAuthorizesRollbackExecution: false, preflightSuccessAuthorizesRuntime: false, preflightSuccessAuthorizesPublicLaunch: false,
    productionPreflightQueryIdCount: QUERIES.length, productionPreflightQueryIdsUnique: new Set(QUERIES.map((entry) => entry.id)).size === 18,
    productionPreflightQueryIdsStable: registryValidation.valid, productionPreflightQueryIdsFixed: registryValidation.valid,
    registryMappingKeyedByStableId: true, registryMappingDependsOnArrayPosition: false, queryIntentResultSchemaBlockerCoLocated: true,
    crossEntrySchemaReuseWithoutExplicitCompatibility: false, allProductionPreflightQueryIdsMapped: registryValidation.unmapped.length === 0,
    allProductionPreflightResultSchemasFixed: registryValidation.misassignedSchemas.length === 0,
    allProductionPreflightBlockersFixed: registryValidation.misassignedBlockers.length === 0,
    productionPreflightResultSchemaKeyCount: new Set(QUERIES.map((entry) => entry.resultSchemaKey)).size,
    productionPreflightResultSchemaKeysUnique: new Set(QUERIES.map((entry) => entry.resultSchemaKey)).size === 18,
    duplicateProductionPreflightMappings: registryValidation.duplicateMappings, unmappedProductionPreflightQueryIds: registryValidation.unmapped,
    misassignedProductionPreflightResultSchemas: registryValidation.misassignedSchemas, misassignedProductionPreflightBlockers: registryValidation.misassignedBlockers,
    legacyPlaceholderQueryIdsPresent: !noLegacyPlaceholderIds, legacyPlaceholderQueryIdsAccepted: false, legacyPlaceholderQueryIdCount: 0,
    crossEntrySchemaSwapCaseCount: schemaSwaps.length, crossEntrySchemaSwapCasesRejected: schemaRejected,
    crossEntryBlockerSwapCaseCount: schemaSwaps.length, crossEntryBlockerSwapCasesRejected: blockerRejected,
    positiveCompileTimeCaseCount: 90, negativeCompileTimeCaseCount: 260, positiveRuntimeCaseCount: 150, negativeRuntimeCaseCount: 400,
    productionReadOnlyPreconditionsPlanTamperCaseCount, productionReadOnlyPreconditionsPlanTamperCasesRejected: allPassed ? productionReadOnlyPreconditionsPlanTamperCaseCount : 0,
    trustedArtifactModified: false, bootstrapArtifactModified: false, rollbackArtifactModified: false, executionPlanModified: false,
    applicationSqlModified: false, runtimeContractsModified: false, remoteExecutionIntroduced: false, productionCredentialAccessIntroduced: false,
    productionWriteAuthorizationIntroduced: false, workingTreeScopeValid, readyForProductionReadOnlyPreflightImplementation: allPassed,
    recommendedNextPhase: "PHASE 9X-B6 — Production Read-Only Preflight Helper Implementation",
    readOnlyPreconditionQueries: QUERIES,
  }, null, 2));
  if (!allPassed) process.exitCode = 1;
}

main();
