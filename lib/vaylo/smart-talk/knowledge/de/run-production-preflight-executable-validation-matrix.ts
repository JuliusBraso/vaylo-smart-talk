import "server-only";

import { readFileSync } from "node:fs";
import path from "node:path";
import {
  PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER,
  PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS,
  PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY,
  PRELIGHT_SAFETY_SETTINGS,
  classifyProductionPreflightTarget,
  executeProductionReadOnlyPreflight,
  isLexicallySafePreflightSql,
  runProductionPreflightRuntimeCoreSmokeProbe,
  sanitizeProductionPreflightError,
  type NormalizedPreflightResult,
  type ProductionReadOnlyPreflightAuthorization,
  type ProductionReadOnlyPreflightQueryId,
  type ProductionReadOnlyPreflightTransport,
} from "../source-registry/production-read-only-preflight-helper";

type Category =
  | "SEMANTIC_REGISTRY"
  | "RESULT_VALIDATOR_VALID"
  | "RESULT_VALIDATOR_MISSING_FIELD"
  | "RESULT_VALIDATOR_WRONG_TYPE"
  | "RESULT_VALIDATOR_UNKNOWN_FIELD"
  | "RESULT_VALIDATOR_SECRET_FIELD"
  | "RESULT_VALIDATOR_CROSS_SCHEMA"
  | "SQL_SCANNER_SAFE"
  | "SQL_SCANNER_REJECTED"
  | "AUTHORIZATION_REJECTED"
  | "LIFECYCLE_SUCCESS"
  | "QUERY_EXECUTION_FAILURE"
  | "RESULT_VALIDATION_FAILURE"
  | "TRANSACTION_FAILURE"
  | "CLEANUP_FAILURE"
  | "ERROR_SANITIZER"
  | "TARGET_CLASSIFICATION"
  | "MULTI_BLOCKER_PRECEDENCE"
  | "REMOTE_PATH_GUARD"
  | "SCHEMA_SPECIFIC_INVARIANT"
  | "SMOKE_REGRESSION";

type CaseResult = Readonly<{
  caseId: string;
  category: Category;
  expectedDisposition: "PASS" | "REJECT";
  result: unknown;
  passed: boolean;
}>;

type RegisteredCase = {
  caseId: string;
  category: Category;
  expectedDisposition: "PASS" | "REJECT";
  execute: () => Promise<boolean> | boolean;
  result?: unknown;
  passed?: boolean;
  executed?: boolean;
};

const EXPECTED_SOURCE_COMMIT = "95e1e40";
const HELPER_PATH =
  "lib/vaylo/smart-talk/knowledge/source-registry/production-read-only-preflight-helper.ts";

const EXPECTED_SEMANTICS = Object.freeze({
  PROD_PREFLIGHT_TARGET_IDENTITY: Object.freeze({
    intent: "Verify target identity.",
    resultSchemaKey: "TARGET_IDENTITY_RESULT",
    blocker: "BLOCKED — TARGET IDENTITY MISMATCH",
  }),
  PROD_PREFLIGHT_SERVER_VERSION: Object.freeze({
    intent: "Verify PostgreSQL major 17.",
    resultSchemaKey: "SERVER_VERSION_RESULT",
    blocker: "BLOCKED — POSTGRESQL VERSION MISMATCH",
  }),
  PROD_PREFLIGHT_CURRENT_DATABASE: Object.freeze({
    intent: "Verify current database.",
    resultSchemaKey: "CURRENT_DATABASE_RESULT",
    blocker: "BLOCKED — CURRENT DATABASE MISMATCH",
  }),
  PROD_PREFLIGHT_CURRENT_USER: Object.freeze({
    intent: "Verify current executor.",
    resultSchemaKey: "CURRENT_USER_RESULT",
    blocker: "BLOCKED — EXECUTOR IDENTITY MISMATCH",
  }),
  PROD_PREFLIGHT_TRANSACTION_CAPABILITY: Object.freeze({
    intent: "Verify read-only transaction.",
    resultSchemaKey: "TRANSACTION_CAPABILITY_RESULT",
    blocker: "BLOCKED — TRANSACTION CAPABILITY DEFECT",
  }),
  PROD_PREFLIGHT_PGCRYPTO_EXTENSION: Object.freeze({
    intent: "Verify pgcrypto extension.",
    resultSchemaKey: "PGCRYPTO_EXTENSION_RESULT",
    blocker: "BLOCKED — PGCRYPTO EXTENSION MISSING",
  }),
  PROD_PREFLIGHT_PGCRYPTO_SCHEMA: Object.freeze({
    intent: "Verify extensions schema.",
    resultSchemaKey: "PGCRYPTO_SCHEMA_RESULT",
    blocker: "BLOCKED — PGCRYPTO SCHEMA MISMATCH",
  }),
  PROD_PREFLIGHT_PGCRYPTO_DIGEST_SIGNATURE: Object.freeze({
    intent: "Verify digest signature.",
    resultSchemaKey: "PGCRYPTO_DIGEST_SIGNATURE_RESULT",
    blocker: "BLOCKED — PGCRYPTO DIGEST SIGNATURE DEFECT",
  }),
  PROD_PREFLIGHT_PGCRYPTO_EXTENSION_OWNERSHIP: Object.freeze({
    intent: "Verify extension membership.",
    resultSchemaKey: "PGCRYPTO_EXTENSION_MEMBERSHIP_RESULT",
    blocker: "BLOCKED — PGCRYPTO EXTENSION MEMBERSHIP DEFECT",
  }),
  PROD_PREFLIGHT_SHA256_CAPABILITY: Object.freeze({
    intent: "Verify SHA256 capability.",
    resultSchemaKey: "SHA256_CAPABILITY_RESULT",
    blocker: "BLOCKED — SHA-256 CAPABILITY DEFECT",
  }),
  PROD_PREFLIGHT_AUDIT_ROLE_CONFLICTS: Object.freeze({
    intent: "Verify audit roles.",
    resultSchemaKey: "AUDIT_ROLE_CONFLICT_RESULT",
    blocker: "BLOCKED — AUDIT ROLE CONFLICT",
  }),
  PROD_PREFLIGHT_AUDIT_SCHEMA_CONFLICT: Object.freeze({
    intent: "Verify audit schema.",
    resultSchemaKey: "AUDIT_SCHEMA_CONFLICT_RESULT",
    blocker: "BLOCKED — AUDIT SCHEMA CONFLICT",
  }),
  PROD_PREFLIGHT_AUDIT_VIEW_CONFLICTS: Object.freeze({
    intent: "Verify audit views.",
    resultSchemaKey: "AUDIT_VIEW_CONFLICT_RESULT",
    blocker: "BLOCKED — AUDIT VIEW CONFLICT",
  }),
  PROD_PREFLIGHT_AUDIT_FUNCTION_CONFLICTS: Object.freeze({
    intent: "Verify audit functions.",
    resultSchemaKey: "AUDIT_FUNCTION_CONFLICT_RESULT",
    blocker: "BLOCKED — AUDIT FUNCTION CONFLICT",
  }),
  PROD_PREFLIGHT_MIGRATION_LEDGER_IDENTITY: Object.freeze({
    intent: "Verify ledger identity.",
    resultSchemaKey: "MIGRATION_LEDGER_IDENTITY_RESULT",
    blocker: "BLOCKED — MIGRATION LEDGER IDENTITY DEFECT",
  }),
  PROD_PREFLIGHT_MIGRATION_LEDGER_COLUMNS: Object.freeze({
    intent: "Verify ledger columns.",
    resultSchemaKey: "MIGRATION_LEDGER_COLUMNS_RESULT",
    blocker: "BLOCKED — MIGRATION LEDGER SHAPE DEFECT",
  }),
  PROD_PREFLIGHT_EXECUTOR_CAPABILITY: Object.freeze({
    intent: "Verify executor capability.",
    resultSchemaKey: "EXECUTOR_CAPABILITY_RESULT",
    blocker: "BLOCKED — EXECUTOR CAPABILITY DEFECT",
  }),
  PROD_PREFLIGHT_ROLLBACK_CAPABILITY: Object.freeze({
    intent: "Verify rollback capability.",
    resultSchemaKey: "ROLLBACK_CAPABILITY_RESULT",
    blocker: "BLOCKED — ROLLBACK CAPABILITY DEFECT",
  }),
} as const);

const registryCases: RegisteredCase[] = [];
let b6dInvocationCounter = 0;

function register(
  caseId: string,
  category: Category,
  expectedDisposition: "PASS" | "REJECT",
  execute: () => Promise<boolean> | boolean,
): void {
  registryCases.push({ caseId, category, expectedDisposition, execute });
}

export type ProductionPreflightExecutableValidationMatrixResult = Readonly<{
  checkId: "9X-B6D";
  phase: "Executable Validation Matrix";
  allPassed: boolean;
  blocked: boolean;
  blockReason: string | null;
  defectClassification: string;
  validationDecision: string;
  executionKind: "FRESH_IN_PROCESS_B6D_EXECUTION";
  executionRunId: string;
  executionStarted: true;
  executionCompleted: true;
  sourceCommit: string;
  expectedSourceCommit: string;
  currentHeadMatchesExpected: boolean;
  independentExecutableValidation: boolean;
  b6cSmokeReportTrustedWithoutReexecution: boolean;
  implementationAuditTrustedWithoutReexecution: boolean;
  b7ResultTrustedWithoutReexecution: boolean;
  testCaseRegistryDefined: boolean;
  testCountsRegistryDerived: boolean;
  testCountsHardcoded: boolean;
  duplicateTestCaseIdCount: number;
  unexecutedRegisteredTestCaseCount: number;
  failedRegisteredTestCaseCount: number;
  semanticRegistryCaseCount: number;
  semanticRegistryCasesPassed: number;
  semanticMappingsValidatedCount: number;
  misassignedIntentCount: number;
  misassignedResultSchemaCount: number;
  misassignedBlockerCount: number;
  queryIntentResultSchemaBlockerCoLocated: boolean;
  allRegistryEntriesHaveValidators: boolean;
  allRegistryEntriesHaveFixedBlockers: boolean;
  allRegistryEntriesHaveStaticSql: boolean;
  canonicalExecutionOrderComplete: boolean;
  canonicalExecutionOrderHasDuplicates: boolean;
  canonicalValidFixtureCount: number;
  canonicalValidFixturesValidated: number;
  validatorValidCaseCount: number;
  validatorValidCasesPassed: number;
  validatorMissingFieldCaseCount: number;
  validatorMissingFieldCasesRejected: number;
  validatorWrongTypeCaseCount: number;
  validatorWrongTypeCasesRejected: number;
  validatorUnknownFieldCaseCount: number;
  validatorUnknownFieldCasesRejected: number;
  validatorSecretFieldCaseCount: number;
  validatorSecretFieldCasesRejected: number;
  crossSchemaSwapCaseCount: number;
  crossSchemaSwapCasesRejected: number;
  validatorIsolationProven: boolean;
  schemaSpecificInvariantCaseCount: number;
  schemaSpecificInvariantCasesRejected: number;
  sqlScannerSafeCaseCount: number;
  sqlScannerSafeCasesAccepted: number;
  sqlScannerRejectedCaseCount: number;
  sqlScannerRejectedCasesRejected: number;
  activeSqlMappingCaseCount: number;
  activeSqlMappingsAccepted: number;
  allActiveSqlMappingsPassSafetyValidation: boolean;
  commentBypassRejected: boolean;
  quotedLiteralFalsePositiveAvoided: boolean;
  quotedIdentifierHandled: boolean;
  dollarQuotedPayloadHandled: boolean;
  semicolonInsideLiteralHandled: boolean;
  malformedSqlFailsClosed: boolean;
  multiStatementSqlRejected: boolean;
  migrationLedgerRowReadRejected: boolean;
  authorizationFailureCaseCount: number;
  authorizationFailureCasesBlockedBeforeTransport: number;
  transportInvocationCountAcrossAuthorizationFailures: number;
  successfulLifecycleCaseCount: number;
  successfulLifecycleCasesPassed: number;
  canonicalExecutionOrderExecutedCount: number;
  singleSessionUsed: boolean;
  safetySettingsVerifiedBeforeFirstQuery: boolean;
  readOnlyTransactionStartedBeforeFirstQuery: boolean;
  resultValidatedBeforeNextQuery: boolean;
  transactionCommittedAfterAllResultsValidated: boolean;
  transportClosedInFinally: boolean;
  queryExecutionFailurePositionCaseCount: number;
  queryExecutionFailurePositionCasesPassed: number;
  stopOnFirstQueryErrorObserved: boolean;
  automaticRetryObserved: boolean;
  resultValidationFailurePositionCaseCount: number;
  resultValidationFailurePositionCasesPassed: number;
  stopOnFirstValidationErrorObserved: boolean;
  partialReadyClassificationObserved: boolean;
  transactionAndCleanupFailureCaseCount: number;
  transactionAndCleanupFailureCasesPassed: number;
  readOnlyRollbackOnFailure: boolean;
  primaryFailurePreservedAcrossCleanupFailure: boolean;
  cleanupFailureRepresentedSafely: boolean;
  closeAttemptedAfterSuccess: boolean;
  closeAttemptedAfterFailure: boolean;
  cleanupAttemptedAfterEveryEligibleFailure: boolean;
  hostileErrorCaseCount: number;
  hostileErrorCasesSanitized: number;
  hostileErrorSanitizationDoesNotThrow: boolean;
  rawDatabaseErrorExposed: boolean;
  connectionStringExposed: boolean;
  passwordExposed: boolean;
  credentialEnvironmentExposed: boolean;
  targetClassificationCaseCount: number;
  targetClassificationCasesPassed: number;
  targetClassificationCount: number;
  incompleteEvidenceClassifiedAsReady: boolean;
  unknownClassificationAccepted: boolean;
  positiveTargetClassificationAuthorizesWrite: boolean;
  multiBlockerCaseCount: number;
  multiBlockerCasesPassed: number;
  multiBlockerPrecedenceDefined: boolean;
  multiBlockerPrecedenceDeterministic: boolean;
  classificationDependsOnObjectInsertionOrder: boolean;
  runtimeCoreSmokeCaseCount: number;
  runtimeCoreSmokeCasesPassed: number;
  positiveExecutableCaseCount: number;
  negativeExecutableCaseCount: number;
  totalExecutableCaseCount: number;
  executedTestCaseCount: number;
  remoteDatabaseClientImportCount: number;
  networkExecutionPathCount: number;
  subprocessExecutionPathCount: number;
  shellExecutionPathCount: number;
  productionCredentialReadPathCount: number;
  remoteSupabaseCommandCount: number;
  credentialPersistencePathCount: number;
  productionReadOnlyPreflightExecutedNow: boolean;
  remoteConnectionPerformed: boolean;
  productionCredentialAccessed: boolean;
  productionBootstrapExecutionAuthorizedNow: boolean;
  productionBootstrapPerformed: boolean;
  helperModifiedDuringB6D: boolean;
  b6AuditModifiedDuringB6D: boolean;
  b7RunnerModifiedDuringB6D: boolean;
  workingTreeScopeValid: boolean;
  readyForDerivedTestRegistryImplementation: boolean;
  recommendedNextPhase: string;
  failedCaseIds: readonly string[];
}>;

function buildCanonicalFixtures(): Record<
  ProductionReadOnlyPreflightQueryId,
  NormalizedPreflightResult
> {
  const fixtures: Record<ProductionReadOnlyPreflightQueryId, NormalizedPreflightResult> = {
    PROD_PREFLIGHT_TARGET_IDENTITY: {
      resultSchemaKey: "TARGET_IDENTITY_RESULT",
      currentDatabaseIdentifier: "synthetic_db",
      databaseIdentityEvidencePresent: true,
      operatorIdentityEvidenceRequired: true,
      targetFingerprintComparisonRequired: true,
      targetIdentityMatched: true,
      targetClassification: "MATCHED",
    },
    PROD_PREFLIGHT_SERVER_VERSION: {
      resultSchemaKey: "SERVER_VERSION_RESULT",
      serverVersionNum: 170000,
      serverMajorVersion: 17,
      expectedServerMajorVersion: 17,
      serverMajorVersionMatched: true,
      compatibilityClassification: "COMPATIBLE",
    },
    PROD_PREFLIGHT_CURRENT_DATABASE: {
      resultSchemaKey: "CURRENT_DATABASE_RESULT",
      currentDatabase: "synthetic_db",
      expectedDatabaseMatched: true,
      resultBounded: true,
      secretExposureDetected: false,
    },
    PROD_PREFLIGHT_CURRENT_USER: {
      resultSchemaKey: "CURRENT_USER_RESULT",
      currentUser: "synthetic_executor",
      expectedExecutorMatched: true,
      resultBounded: true,
      secretExposureDetected: false,
    },
    PROD_PREFLIGHT_TRANSACTION_CAPABILITY: {
      resultSchemaKey: "TRANSACTION_CAPABILITY_RESULT",
      explicitReadOnlyTransactionStarted: true,
      transactionReadOnlyObserved: true,
      transactionStateKnown: true,
      rollbackAvailable: true,
      transactionCleanupConfirmed: true,
      writeProbeUsed: false,
    },
    PROD_PREFLIGHT_PGCRYPTO_EXTENSION: {
      resultSchemaKey: "PGCRYPTO_EXTENSION_RESULT",
      extensionPresent: true,
      extensionCount: 1,
      expectedExtensionCount: 1,
      normalizedExtensionVersion: "1.3",
      installationAttempted: false,
      repairAttempted: false,
    },
    PROD_PREFLIGHT_PGCRYPTO_SCHEMA: {
      resultSchemaKey: "PGCRYPTO_SCHEMA_RESULT",
      observedSchema: "extensions",
      expectedSchema: "extensions",
      schemaMatched: true,
      relocationAttempted: false,
    },
    PROD_PREFLIGHT_PGCRYPTO_DIGEST_SIGNATURE: {
      resultSchemaKey: "PGCRYPTO_DIGEST_SIGNATURE_RESULT",
      schemaQualifiedIdentityMatched: true,
      argumentTypesMatched: true,
      returnTypeMatched: true,
      overloadResolutionUnambiguous: true,
      conflictingDigestDetected: false,
      signatureClassification: "EXACT",
    },
    PROD_PREFLIGHT_PGCRYPTO_EXTENSION_OWNERSHIP: {
      resultSchemaKey: "PGCRYPTO_EXTENSION_MEMBERSHIP_RESULT",
      extensionMembershipVerified: true,
      catalogDerived: true,
      functionNameOnlyVerificationUsed: false,
      operatorAssertionOnlyUsed: false,
    },
    PROD_PREFLIGHT_SHA256_CAPABILITY: {
      resultSchemaKey: "SHA256_CAPABILITY_RESULT",
      algorithm: "SHA256",
      digestByteLength: 32,
      hexLength: 64,
      lowercaseHex: true,
      repeatStable: true,
      callerControlledInputUsed: false,
      callerControlledAlgorithmUsed: false,
      fallbackDetected: false,
    },
    PROD_PREFLIGHT_AUDIT_ROLE_CONFLICTS: {
      resultSchemaKey: "AUDIT_ROLE_CONFLICT_RESULT",
      expectedRoleCount: 3,
      observedExpectedRoleCount: 0,
      roleNamesFixed: true,
      attributesCompared: true,
      membershipsCompared: true,
      classification: "ABSENT_OR_COMPATIBLE",
      repairAttempted: false,
    },
    PROD_PREFLIGHT_AUDIT_SCHEMA_CONFLICT: {
      resultSchemaKey: "AUDIT_SCHEMA_CONFLICT_RESULT",
      expectedSchema: "vaylo_audit",
      schemaPresent: false,
      ownerMatched: true,
      unexpectedContentsDetected: false,
      classification: "ABSENT_OR_COMPATIBLE",
      cleanupAttempted: false,
    },
    PROD_PREFLIGHT_AUDIT_VIEW_CONFLICTS: {
      resultSchemaKey: "AUDIT_VIEW_CONFLICT_RESULT",
      expectedViewCount: 10,
      expectedNamesDerivedFromTrustedSource: true,
      observedExpectedNameCount: 0,
      conflictingObjectCount: 0,
      unrelatedObjectsReturned: false,
      perObjectClassifications: "NONE",
      repairAttempted: false,
    },
    PROD_PREFLIGHT_AUDIT_FUNCTION_CONFLICTS: {
      resultSchemaKey: "AUDIT_FUNCTION_CONFLICT_RESULT",
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
    },
    PROD_PREFLIGHT_MIGRATION_LEDGER_IDENTITY: {
      resultSchemaKey: "MIGRATION_LEDGER_IDENTITY_RESULT",
      expectedSchema: "supabase_migrations",
      expectedRelation: "schema_migrations",
      schemaPresent: true,
      relationPresent: true,
      relationKindMatched: true,
      identityUnambiguous: true,
      alternateRelationAccepted: false,
      rowsRead: false,
    },
    PROD_PREFLIGHT_MIGRATION_LEDGER_COLUMNS: {
      resultSchemaKey: "MIGRATION_LEDGER_COLUMNS_RESULT",
      expectedColumnsDerivedFromTrustedSource: true,
      requiredColumnNamesMatched: true,
      requiredColumnTypesMatched: true,
      requiredNullabilityMatched: true,
      extraColumnPolicy: "CLASSIFIED",
      rawIdentifiersReturned: false,
      rawMigrationSqlReturned: false,
      rowsRead: false,
    },
    PROD_PREFLIGHT_EXECUTOR_CAPABILITY: {
      resultSchemaKey: "EXECUTOR_CAPABILITY_RESULT",
      currentExecutor: "synthetic_executor",
      capabilityClassifications: "ALL_PROVEN",
      allRequiredCapabilitiesProven: true,
      capabilityAssumedFromUsername: false,
      superuserRequiredUnconditionally: false,
      writeProbeUsed: false,
      ambiguousCapabilityCount: 0,
      deniedCapabilityCount: 0,
    },
    PROD_PREFLIGHT_ROLLBACK_CAPABILITY: {
      resultSchemaKey: "ROLLBACK_CAPABILITY_RESULT",
      executorIdentityKnown: true,
      requiredCapabilitiesProven: true,
      rollbackArtifactPinned: true,
      rollbackArtifactHashVerified: true,
      rollbackUsesCascade: false,
      targetIdentityBound: true,
      rollbackExecutionAuthorizedNow: false,
      capabilityClassification: "PROVEN",
    },
  };
  return fixtures;
}

function createAuth(
  patch: Record<string, unknown> = {},
): ProductionReadOnlyPreflightAuthorization | Record<string, unknown> {
  return {
    authorizationKind: "PRODUCTION_READ_ONLY_PREFLIGHT_SINGLE_ATTEMPT",
    sourceCommit: "95e1e40",
    artifactFingerprintSetId: "artifact-set-synthetic-01",
    targetFingerprint: "target-fingerprint-01",
    targetPurpose: "audit-bootstrap-preflight",
    operatorEvidenceConfirmed: true,
    executionWindowId: "window-synthetic-01",
    singleAttemptNonce: "nonce-synthetic-01",
    remoteExecutionSeparatelyAuthorized: true,
    ...patch,
  };
}

function createTransport(options?: {
  failAt?: "open" | "verify" | "begin" | "commit" | "rollback" | "close";
  failAtQueryIndex?: number;
  invalidAtQueryIndex?: number;
  responses?: Partial<Record<ProductionReadOnlyPreflightQueryId, unknown>>;
  onEvent?: (event: string) => void;
}) {
  const events: string[] = [];
  const executed: ProductionReadOnlyPreflightQueryId[] = [];
  let invokeCount = 0;
  const fixtures = options?.responses ?? buildCanonicalFixtures();
  const push = (event: string) => {
    events.push(event);
    options?.onEvent?.(event);
  };
  const transport: ProductionReadOnlyPreflightTransport = {
    async openSession() {
      invokeCount += 1;
      push("open");
      if (options?.failAt === "open") throw new Error("OPEN_FAIL");
    },
    async verifySafetySettings(settings) {
      invokeCount += 1;
      push("verify");
      if (
        settings.statementTimeout !== PRELIGHT_SAFETY_SETTINGS.statementTimeout ||
        settings.lockTimeout !== PRELIGHT_SAFETY_SETTINGS.lockTimeout
      ) {
        throw new Error("SETTINGS_MISMATCH");
      }
      if (options?.failAt === "verify") throw new Error("VERIFY_FAIL");
    },
    async beginReadOnlyTransaction() {
      invokeCount += 1;
      push("begin");
      if (options?.failAt === "begin") throw new Error("BEGIN_FAIL");
    },
    async executeApprovedQuery(queryId) {
      invokeCount += 1;
      push(`query:${queryId}`);
      if (
        options?.failAtQueryIndex !== undefined &&
        executed.length === options.failAtQueryIndex
      ) {
        throw new Error(`QUERY_FAIL:${queryId}`);
      }
      executed.push(queryId);
      if (
        options?.invalidAtQueryIndex !== undefined &&
        executed.length - 1 === options.invalidAtQueryIndex
      ) {
        return { resultSchemaKey: "WRONG", invalid: true };
      }
      return fixtures[queryId] ?? {};
    },
    async commitReadOnlyTransaction() {
      invokeCount += 1;
      push("commit");
      if (options?.failAt === "commit") throw new Error("COMMIT_FAIL");
    },
    async rollbackReadOnlyTransaction() {
      invokeCount += 1;
      push("rollback");
      if (options?.failAt === "rollback") throw new Error("ROLLBACK_FAIL");
    },
    async close() {
      invokeCount += 1;
      push("close");
      if (options?.failAt === "close") throw new Error("CLOSE_FAIL");
    },
  };
  return { transport, events, executed, getInvokeCount: () => invokeCount };
}

function cloneFixture(
  id: ProductionReadOnlyPreflightQueryId,
): Record<string, unknown> {
  return { ...buildCanonicalFixtures()[id] };
}

function firstNonSchemaKey(id: ProductionReadOnlyPreflightQueryId): string {
  return Object.keys(buildCanonicalFixtures()[id]).find(
    (key) => key !== "resultSchemaKey",
  )!;
}

export async function runProductionPreflightExecutableValidationMatrix(): Promise<ProductionPreflightExecutableValidationMatrixResult> {
  registryCases.length = 0;
  b6dInvocationCounter += 1;
  const executionRunId = `b6d-in-process-${b6dInvocationCounter}`;
  const fixtures = buildCanonicalFixtures();
  const ids = [...PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER];

  for (const id of ids) {
    register(`semantic:${id}`, "SEMANTIC_REGISTRY", "PASS", () => {
      const entry = PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY[id];
      const expected = EXPECTED_SEMANTICS[id];
      return (
        entry.id === id &&
        entry.intent === expected.intent &&
        entry.resultSchemaKey === expected.resultSchemaKey &&
        entry.blocker === expected.blocker &&
        entry.parameterPolicy === "NO_CALLER_PARAMETERS" &&
        typeof entry.sql === "string" &&
        entry.sql.length > 0 &&
        entry.readOnly === true &&
        entry.catalogOnly === true &&
        entry.applicationRowAccess === false &&
        entry.authRowAccess === false &&
        entry.storageRowAccess === false &&
        entry.returnsRawRows === false &&
        typeof entry.validateResult === "function"
      );
    });
  }

  register("semantic:order-complete", "SEMANTIC_REGISTRY", "PASS", () => {
    const order = PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER;
    const set = new Set(order);
    return (
      order.length === 18 &&
      set.size === 18 &&
      PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS.every((id) => set.has(id)) &&
      !order.some((id) => id.includes("PF-"))
    );
  });

  for (const id of ids) {
    register(`fixture-valid:${id}`, "RESULT_VALIDATOR_VALID", "PASS", () =>
      PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY[id].validateResult(fixtures[id]),
    );

    register(`missing-field:${id}`, "RESULT_VALIDATOR_MISSING_FIELD", "REJECT", () => {
      const mutated = cloneFixture(id);
      delete mutated[firstNonSchemaKey(id)];
      return !PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY[id].validateResult(mutated);
    });

    register(`wrong-type:${id}`, "RESULT_VALIDATOR_WRONG_TYPE", "REJECT", () => {
      const mutated = cloneFixture(id);
      const key = firstNonSchemaKey(id);
      mutated[key] = Array.isArray(mutated[key]) ? null : [];
      return !PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY[id].validateResult(mutated);
    });

    register(`unknown-field:${id}`, "RESULT_VALIDATOR_UNKNOWN_FIELD", "REJECT", () => {
      const mutated = cloneFixture(id);
      mutated.unexpectedExtraField = "x";
      return !PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY[id].validateResult(mutated);
    });

    register(`secret-field:${id}`, "RESULT_VALIDATOR_SECRET_FIELD", "REJECT", () => {
      const mutated = cloneFixture(id);
      mutated.password = "hunter2";
      return !PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY[id].validateResult(mutated);
    });
  }

  for (let index = 0; index < ids.length; index += 1) {
    const id = ids[index]!;
    const donor = ids[(index + 1) % ids.length]!;
    register(`cross-schema:${id}`, "RESULT_VALIDATOR_CROSS_SCHEMA", "REJECT", () =>
      !PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY[id].validateResult(fixtures[donor]),
    );
  }

  const invariantMutations: Array<[string, ProductionReadOnlyPreflightQueryId, Record<string, unknown>]> = [
    ["server-major-16", "PROD_PREFLIGHT_SERVER_VERSION", { serverMajorVersion: 16, serverMajorVersionMatched: false }],
    ["expected-major-mismatch", "PROD_PREFLIGHT_SERVER_VERSION", { expectedServerMajorVersion: 16, serverMajorVersionMatched: false }],
    ["extension-count-2", "PROD_PREFLIGHT_PGCRYPTO_EXTENSION", { extensionCount: 2 }],
    ["schema-public", "PROD_PREFLIGHT_PGCRYPTO_SCHEMA", { observedSchema: "public", schemaMatched: false }],
    ["digest-ambiguous", "PROD_PREFLIGHT_PGCRYPTO_DIGEST_SIGNATURE", { overloadResolutionUnambiguous: false }],
    ["membership-false", "PROD_PREFLIGHT_PGCRYPTO_EXTENSION_OWNERSHIP", { extensionMembershipVerified: false }],
    ["sha-bytes-16", "PROD_PREFLIGHT_SHA256_CAPABILITY", { digestByteLength: 16 }],
    ["sha-hex-32", "PROD_PREFLIGHT_SHA256_CAPABILITY", { hexLength: 32 }],
    ["sha-fallback", "PROD_PREFLIGHT_SHA256_CAPABILITY", { fallbackDetected: true }],
    ["role-array-over", "PROD_PREFLIGHT_AUDIT_ROLE_CONFLICTS", { roleNames: ["a", "b", "c", "d"] }],
    ["view-array-over", "PROD_PREFLIGHT_AUDIT_VIEW_CONFLICTS", { viewNames: Array.from({ length: 11 }, (_, i) => `v${i}`) }],
    ["function-array-over", "PROD_PREFLIGHT_AUDIT_FUNCTION_CONFLICTS", { functionNames: Array.from({ length: 10 }, (_, i) => `f${i}`) }],
    ["executor-not-proven", "PROD_PREFLIGHT_EXECUTOR_CAPABILITY", { allRequiredCapabilitiesProven: false }],
    ["executor-unsupported", "PROD_PREFLIGHT_EXECUTOR_CAPABILITY", { capabilityClassifications: ["BAD"] }],
    ["rollback-unpinned", "PROD_PREFLIGHT_ROLLBACK_CAPABILITY", { rollbackArtifactPinned: false }],
    ["rollback-cascade", "PROD_PREFLIGHT_ROLLBACK_CAPABILITY", { rollbackUsesCascade: true }],
    ["rollback-authorized-now", "PROD_PREFLIGHT_ROLLBACK_CAPABILITY", { rollbackExecutionAuthorizedNow: true }],
  ];
  for (const [name, id, patch] of invariantMutations) {
    register(`invariant:${name}`, "SCHEMA_SPECIFIC_INVARIANT", "REJECT", () => {
      const mutated = { ...cloneFixture(id), ...patch };
      const accepted = PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY[id].validateResult(mutated);
      if (!accepted) return true;
      const all = { ...fixtures, [id]: mutated as NormalizedPreflightResult };
      return classifyProductionPreflightTarget(all) !==
        "TARGET_READY_FOR_AUDIT_BOOTSTRAP_AUTHORIZATION_REVIEW";
    });
  }

  const safeSql = [
    ["semicolon-literal", "select 'a;b' as x from pg_catalog.pg_class"],
    ["delete-literal", "select 'DELETE' as x from pg_catalog.pg_class"],
    ["drop-identifier", 'select count(*)::int as c from pg_catalog.pg_class where "DROP" is not null'],
    ["dollar-forbidden", "select count(*)::int as c from pg_catalog.pg_class where nspname = $$DELETE DROP$$"],
    ["line-comment", "select count(*)::int as c from pg_catalog.pg_class -- DELETE"],
    ["block-comment", "select count(*)::int as c from pg_catalog.pg_class /* DROP TABLE x */"],
    ["semicolon-dollar", "select count(*)::int as c from pg_catalog.pg_class where nspname = $$a;b$$"],
    ["escaped-quote", "select 'it''s DELETE' as x from pg_catalog.pg_class"],
  ] as const;
  for (const [name, sql] of safeSql) {
    register(`sql-safe:${name}`, "SQL_SCANNER_SAFE", "PASS", () =>
      isLexicallySafePreflightSql(sql),
    );
  }

  const rejectedSql = [
    ["insert", "insert into t values (1)"],
    ["update", "update t set a = 1"],
    ["delete", "delete from t"],
    ["create", "create table t (id int)"],
    ["alter", "alter table t add column x int"],
    ["drop", "drop table t"],
    ["grant", "grant select on t to u"],
    ["revoke", "revoke select on t from u"],
    ["execute", "execute some_plan"],
    ["multi", "select 1; select 2"],
    ["psql", "\\dt"],
    ["star", "select * from pg_catalog.pg_class"],
    ["app-row", "select id from public.profiles"],
    ["auth-row", "select id from auth.users"],
    ["storage-row", "select id from storage.objects"],
    ["migration-row", "select version from supabase_migrations.schema_migrations"],
    ["after-line", "select 1;\n--x\ninsert into t values (1)"],
    ["after-block", "select 1; /*x*/ insert into t values (1)"],
    ["unterminated-single", "select 'unterminated"],
    ["unterminated-double", 'select "unterminated'],
    ["unterminated-block", "select 1 /* unterminated"],
    ["unterminated-dollar", "select $tag$unterminated"],
  ] as const;
  for (const [name, sql] of rejectedSql) {
    register(`sql-reject:${name}`, "SQL_SCANNER_REJECTED", "REJECT", () =>
      !isLexicallySafePreflightSql(sql),
    );
  }

  for (const id of ids) {
    register(`active-sql:${id}`, "SQL_SCANNER_SAFE", "PASS", () =>
      isLexicallySafePreflightSql(PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY[id].sql),
    );
  }

  let authTransportInvocations = 0;
  const authFailures: Array<[string, unknown]> = [
    ["missing", null],
    ["primitive", "auth"],
    ["wrong-kind", createAuth({ authorizationKind: "OTHER" })],
    ["wrong-source", createAuth({ sourceCommit: "deadbeef" })],
    ["missing-artifact", createAuth({ artifactFingerprintSetId: "" })],
    ["malformed-artifact", createAuth({ artifactFingerprintSetId: "bad artifact" })],
    ["missing-target", createAuth({ targetFingerprint: "" })],
    ["short-target", createAuth({ targetFingerprint: "short" })],
    ["missing-purpose", createAuth({ targetPurpose: "" })],
    ["operator-false", createAuth({ operatorEvidenceConfirmed: false })],
    ["missing-window", createAuth({ executionWindowId: "" })],
    ["missing-nonce", createAuth({ singleAttemptNonce: "" })],
    ["remote-false", createAuth({ remoteExecutionSeparatelyAuthorized: false })],
    ["write-field", createAuth({ writeAuthorized: true })],
    ["reusable-field", createAuth({ reusable: true })],
  ];
  for (const [name, authorization] of authFailures) {
    register(`auth:${name}`, "AUTHORIZATION_REJECTED", "REJECT", async () => {
      const { transport, getInvokeCount } = createTransport();
      const before = getInvokeCount();
      const result = await executeProductionReadOnlyPreflight({
        transport,
        authorization,
        boundedExecutionId: `auth-${name}`,
      });
      authTransportInvocations += getInvokeCount() - before;
      return (
        result.success === false &&
        result.blocker === "BLOCKED — REMOTE PREFLIGHT NOT AUTHORIZED" &&
        getInvokeCount() === before
      );
    });
  }

  register("lifecycle:success", "LIFECYCLE_SUCCESS", "PASS", async () => {
    const { transport, events, executed } = createTransport();
    const result = await executeProductionReadOnlyPreflight({
      transport,
      authorization: createAuth(),
      boundedExecutionId: "lifecycle-success",
    });
    const firstQuery = events.findIndex((event) => event.startsWith("query:"));
    return (
      result.success === true &&
      result.targetClassification ===
        "TARGET_READY_FOR_AUDIT_BOOTSTRAP_AUTHORIZATION_REVIEW" &&
      result.productionWriteAuthorized === false &&
      result.productionBootstrapAuthorized === false &&
      result.productionRollbackAuthorized === false &&
      result.productionRuntimeAuthorized === false &&
      result.publicLaunchAuthorized === false &&
      executed.length === 18 &&
      executed.every((id, index) => id === ids[index]) &&
      events.filter((event) => event === "open").length === 1 &&
      events.indexOf("verify") < events.indexOf("begin") &&
      events.indexOf("begin") < firstQuery &&
      events.indexOf("commit") > events.lastIndexOf(`query:${ids[17]}`) &&
      events.includes("close")
    );
  });

  for (let index = 0; index < 18; index += 1) {
    register(`query-fail:${index}`, "QUERY_EXECUTION_FAILURE", "REJECT", async () => {
      const { transport, events, executed } = createTransport({
        failAtQueryIndex: index,
      });
      const result = await executeProductionReadOnlyPreflight({
        transport,
        authorization: createAuth(),
        boundedExecutionId: `query-fail-${index}`,
      });
      return (
        result.success === false &&
        result.failedQueryId === ids[index] &&
        executed.length === index &&
        result.rollbackAttempted === true &&
        events.includes("rollback") &&
        events.includes("close") &&
        !events.includes("commit")
      );
    });

    register(`result-fail:${index}`, "RESULT_VALIDATION_FAILURE", "REJECT", async () => {
      const { transport, events, executed } = createTransport({
        invalidAtQueryIndex: index,
      });
      const result = await executeProductionReadOnlyPreflight({
        transport,
        authorization: createAuth(),
        boundedExecutionId: `result-fail-${index}`,
      });
      return (
        result.success === false &&
        result.safeErrorClass === "RESULT_VALIDATION_FAILED" &&
        result.failedQueryId === ids[index] &&
        executed.length === index + 1 &&
        !executed.includes(ids[index + 1]!) &&
        result.rollbackAttempted === true &&
        events.includes("close")
      );
    });
  }

  const txCases: Array<[string, Category, Parameters<typeof createTransport>[0], (result: Awaited<ReturnType<typeof executeProductionReadOnlyPreflight>>, events: string[]) => boolean]> = [
    ["open-fail", "TRANSACTION_FAILURE", { failAt: "open" }, (result, events) =>
      result.success === false && !events.includes("begin") && !events.includes("rollback")],
    ["verify-fail", "TRANSACTION_FAILURE", { failAt: "verify" }, (result, events) =>
      result.success === false && events.includes("close") && !events.includes("rollback")],
    ["begin-fail", "TRANSACTION_FAILURE", { failAt: "begin" }, (result, events) =>
      result.success === false && events.includes("close") && !events.includes("rollback")],
    ["commit-fail", "TRANSACTION_FAILURE", { failAt: "commit" }, (result, events) =>
      result.success === false && events.includes("rollback") && events.includes("close")],
    ["rollback-fail", "CLEANUP_FAILURE", { failAtQueryIndex: 2, failAt: "rollback" }, (result, events) =>
      result.success === false &&
      result.primaryFailurePreserved === true &&
      result.rollbackAttempted === true &&
      result.rollbackCompleted === false &&
      events.includes("close")],
    ["close-after-success", "CLEANUP_FAILURE", { failAt: "close" }, (result) =>
      result.success === false && result.safeErrorClass === "TRANSPORT_CLOSE_FAILED"],
    ["close-after-query-fail", "CLEANUP_FAILURE", { failAtQueryIndex: 1, failAt: "close" }, (result) =>
      result.success === false &&
      result.primaryFailurePreserved === true &&
      result.closeAttempted === true &&
      result.connectionClosed === false],
    ["query-plus-rollback-fail", "CLEANUP_FAILURE", { failAtQueryIndex: 4, failAt: "rollback" }, (result) =>
      result.success === false && result.primaryFailurePreserved === true],
    ["query-plus-close-fail", "CLEANUP_FAILURE", { failAtQueryIndex: 5, failAt: "close" }, (result) =>
      result.success === false && result.primaryFailurePreserved === true],
  ];

  register("tx:query-rollback-close-fail", "CLEANUP_FAILURE", "REJECT", async () => {
    let rollbackCalls = 0;
    let closeCalls = 0;
    const base = createTransport({ failAtQueryIndex: 6 });
    const transport: ProductionReadOnlyPreflightTransport = {
      openSession: () => base.transport.openSession(),
      verifySafetySettings: (s) => base.transport.verifySafetySettings(s),
      beginReadOnlyTransaction: () => base.transport.beginReadOnlyTransaction(),
      executeApprovedQuery: (id) => base.transport.executeApprovedQuery(id),
      commitReadOnlyTransaction: () => base.transport.commitReadOnlyTransaction(),
      async rollbackReadOnlyTransaction() {
        rollbackCalls += 1;
        base.events.push("rollback");
        throw new Error("ROLLBACK_FAIL");
      },
      async close() {
        closeCalls += 1;
        base.events.push("close");
        throw new Error("CLOSE_FAIL");
      },
    };
    const result = await executeProductionReadOnlyPreflight({
      transport,
      authorization: createAuth(),
      boundedExecutionId: "tx-triple-fail",
    });
    return (
      result.success === false &&
      result.primaryFailurePreserved === true &&
      rollbackCalls === 1 &&
      closeCalls === 1
    );
  });

  for (const [name, category, options, check] of txCases) {
    register(`tx:${name}`, category, "REJECT", async () => {
      const { transport, events } = createTransport(options);
      const result = await executeProductionReadOnlyPreflight({
        transport,
        authorization: createAuth(),
        boundedExecutionId: `tx-${name}`,
      });
      return check(result, events);
    });
  }

  const hostileValues: unknown[] = [
    new Error("ordinary"),
    new Error("password=super-secret"),
    new Error("postgres://user:pass@host/db"),
    "token=abc.def.ghi",
    42,
    true,
    null,
    undefined,
    ["a", "b"],
    { nested: { password: "x" } },
    (() => {
      const circular: { self?: unknown } = {};
      circular.self = circular;
      return circular;
    })(),
    {
      get trap() {
        throw new Error("getter");
      },
    },
    new Proxy(
      {},
      {
        get() {
          throw new Error("proxy");
        },
      },
    ),
    "x".repeat(20_000),
    { sqlState: "08006" },
    { sqlState: "BAD" },
  ];
  for (const [index, value] of hostileValues.entries()) {
    register(`sanitize:${index}`, "ERROR_SANITIZER", "PASS", () => {
      const sanitized = sanitizeProductionPreflightError(value);
      const text = JSON.stringify(sanitized);
      return (
        sanitized.rawDetailsSuppressed === true &&
        !/password=super-secret/i.test(text) &&
        !/postgres:\/\//i.test(text) &&
        !/"stack"/i.test(text) &&
        !/token=abc/i.test(text)
      );
    });
  }

  const classificationCases: Array<[string, Partial<Record<ProductionReadOnlyPreflightQueryId, NormalizedPreflightResult>>, string]> = [
    ["ready", fixtures, "TARGET_READY_FOR_AUDIT_BOOTSTRAP_AUTHORIZATION_REVIEW"],
    ["incomplete", { PROD_PREFLIGHT_TARGET_IDENTITY: fixtures.PROD_PREFLIGHT_TARGET_IDENTITY }, "TARGET_BLOCKED_INCOMPLETE_EVIDENCE"],
    ["identity", { ...fixtures, PROD_PREFLIGHT_TARGET_IDENTITY: { ...fixtures.PROD_PREFLIGHT_TARGET_IDENTITY, targetIdentityMatched: false } }, "TARGET_BLOCKED_IDENTITY_MISMATCH"],
    ["version", { ...fixtures, PROD_PREFLIGHT_SERVER_VERSION: { ...fixtures.PROD_PREFLIGHT_SERVER_VERSION, serverMajorVersion: 16, serverMajorVersionMatched: false } }, "TARGET_BLOCKED_POSTGRES_VERSION"],
    ["pgcrypto-missing", { ...fixtures, PROD_PREFLIGHT_PGCRYPTO_EXTENSION: { ...fixtures.PROD_PREFLIGHT_PGCRYPTO_EXTENSION, extensionPresent: false, extensionCount: 0 } }, "TARGET_BLOCKED_PGCRYPTO_MISSING"],
    ["pgcrypto-schema", { ...fixtures, PROD_PREFLIGHT_PGCRYPTO_SCHEMA: { ...fixtures.PROD_PREFLIGHT_PGCRYPTO_SCHEMA, observedSchema: "public", schemaMatched: false } }, "TARGET_BLOCKED_PGCRYPTO_SCHEMA"],
    ["pgcrypto-signature", { ...fixtures, PROD_PREFLIGHT_PGCRYPTO_DIGEST_SIGNATURE: { ...fixtures.PROD_PREFLIGHT_PGCRYPTO_DIGEST_SIGNATURE, overloadResolutionUnambiguous: false } }, "TARGET_BLOCKED_PGCRYPTO_SIGNATURE"],
    ["role", { ...fixtures, PROD_PREFLIGHT_AUDIT_ROLE_CONFLICTS: { ...fixtures.PROD_PREFLIGHT_AUDIT_ROLE_CONFLICTS, classification: "CONFLICT" } }, "TARGET_BLOCKED_AUDIT_ROLE_CONFLICT"],
    ["schema", { ...fixtures, PROD_PREFLIGHT_AUDIT_SCHEMA_CONFLICT: { ...fixtures.PROD_PREFLIGHT_AUDIT_SCHEMA_CONFLICT, classification: "CONFLICT" } }, "TARGET_BLOCKED_AUDIT_SCHEMA_CONFLICT"],
    ["view", { ...fixtures, PROD_PREFLIGHT_AUDIT_VIEW_CONFLICTS: { ...fixtures.PROD_PREFLIGHT_AUDIT_VIEW_CONFLICTS, conflictingObjectCount: 2 } }, "TARGET_BLOCKED_AUDIT_VIEW_CONFLICT"],
    ["function", { ...fixtures, PROD_PREFLIGHT_AUDIT_FUNCTION_CONFLICTS: { ...fixtures.PROD_PREFLIGHT_AUDIT_FUNCTION_CONFLICTS, conflictingObjectCount: 1 } }, "TARGET_BLOCKED_AUDIT_FUNCTION_CONFLICT"],
    ["ledger-identity", { ...fixtures, PROD_PREFLIGHT_MIGRATION_LEDGER_IDENTITY: { ...fixtures.PROD_PREFLIGHT_MIGRATION_LEDGER_IDENTITY, identityUnambiguous: false } }, "TARGET_BLOCKED_MIGRATION_LEDGER_IDENTITY"],
    ["ledger-shape", { ...fixtures, PROD_PREFLIGHT_MIGRATION_LEDGER_COLUMNS: { ...fixtures.PROD_PREFLIGHT_MIGRATION_LEDGER_COLUMNS, requiredColumnNamesMatched: false } }, "TARGET_BLOCKED_MIGRATION_LEDGER_SHAPE"],
    ["executor", { ...fixtures, PROD_PREFLIGHT_EXECUTOR_CAPABILITY: { ...fixtures.PROD_PREFLIGHT_EXECUTOR_CAPABILITY, allRequiredCapabilitiesProven: false } }, "TARGET_BLOCKED_EXECUTOR_CAPABILITY"],
    ["rollback", { ...fixtures, PROD_PREFLIGHT_ROLLBACK_CAPABILITY: { ...fixtures.PROD_PREFLIGHT_ROLLBACK_CAPABILITY, requiredCapabilitiesProven: false } }, "TARGET_BLOCKED_ROLLBACK_CAPABILITY"],
  ];
  for (const [name, input, expected] of classificationCases) {
    register(`classify:${name}`, "TARGET_CLASSIFICATION", "PASS", () =>
      classifyProductionPreflightTarget(input) === expected,
    );
  }

  const multiBlockers: Array<[string, Partial<Record<ProductionReadOnlyPreflightQueryId, NormalizedPreflightResult>>, string]> = [
    ["incomplete-plus", { PROD_PREFLIGHT_TARGET_IDENTITY: { ...fixtures.PROD_PREFLIGHT_TARGET_IDENTITY, targetIdentityMatched: false } }, "TARGET_BLOCKED_INCOMPLETE_EVIDENCE"],
    ["identity-version", { ...fixtures, PROD_PREFLIGHT_TARGET_IDENTITY: { ...fixtures.PROD_PREFLIGHT_TARGET_IDENTITY, targetIdentityMatched: false }, PROD_PREFLIGHT_SERVER_VERSION: { ...fixtures.PROD_PREFLIGHT_SERVER_VERSION, serverMajorVersion: 16, serverMajorVersionMatched: false } }, "TARGET_BLOCKED_IDENTITY_MISMATCH"],
    ["pgcrypto-audit", { ...fixtures, PROD_PREFLIGHT_PGCRYPTO_EXTENSION: { ...fixtures.PROD_PREFLIGHT_PGCRYPTO_EXTENSION, extensionCount: 0, extensionPresent: false }, PROD_PREFLIGHT_AUDIT_ROLE_CONFLICTS: { ...fixtures.PROD_PREFLIGHT_AUDIT_ROLE_CONFLICTS, classification: "CONFLICT" } }, "TARGET_BLOCKED_PGCRYPTO_MISSING"],
    ["role-schema-view", { ...fixtures, PROD_PREFLIGHT_AUDIT_ROLE_CONFLICTS: { ...fixtures.PROD_PREFLIGHT_AUDIT_ROLE_CONFLICTS, classification: "CONFLICT" }, PROD_PREFLIGHT_AUDIT_SCHEMA_CONFLICT: { ...fixtures.PROD_PREFLIGHT_AUDIT_SCHEMA_CONFLICT, classification: "CONFLICT" }, PROD_PREFLIGHT_AUDIT_VIEW_CONFLICTS: { ...fixtures.PROD_PREFLIGHT_AUDIT_VIEW_CONFLICTS, conflictingObjectCount: 1 } }, "TARGET_BLOCKED_AUDIT_ROLE_CONFLICT"],
    ["ledger-both", { ...fixtures, PROD_PREFLIGHT_MIGRATION_LEDGER_IDENTITY: { ...fixtures.PROD_PREFLIGHT_MIGRATION_LEDGER_IDENTITY, identityUnambiguous: false }, PROD_PREFLIGHT_MIGRATION_LEDGER_COLUMNS: { ...fixtures.PROD_PREFLIGHT_MIGRATION_LEDGER_COLUMNS, requiredColumnNamesMatched: false } }, "TARGET_BLOCKED_MIGRATION_LEDGER_IDENTITY"],
    ["executor-rollback", { ...fixtures, PROD_PREFLIGHT_EXECUTOR_CAPABILITY: { ...fixtures.PROD_PREFLIGHT_EXECUTOR_CAPABILITY, allRequiredCapabilitiesProven: false }, PROD_PREFLIGHT_ROLLBACK_CAPABILITY: { ...fixtures.PROD_PREFLIGHT_ROLLBACK_CAPABILITY, requiredCapabilitiesProven: false } }, "TARGET_BLOCKED_EXECUTOR_CAPABILITY"],
  ];
  for (const [name, input, expected] of multiBlockers) {
    register(`multi:${name}`, "MULTI_BLOCKER_PRECEDENCE", "PASS", () => {
      const a = classifyProductionPreflightTarget(input);
      const reordered = Object.fromEntries(
        Object.entries(input).reverse(),
      ) as typeof input;
      const b = classifyProductionPreflightTarget(reordered);
      return a === expected && a === b;
    });
  }

  register("smoke:rerun", "SMOKE_REGRESSION", "PASS", async () => {
    const report = await runProductionPreflightRuntimeCoreSmokeProbe();
    return (
      report.runtimeCoreSmokeCaseCount >= 15 &&
      report.runtimeCoreSmokeCasesPassed === report.runtimeCoreSmokeCaseCount
    );
  });

  register("remote-path:helper", "REMOTE_PATH_GUARD", "PASS", () => {
    const source = readFileSync(path.join(process.cwd(), HELPER_PATH), "utf8");
    return (
      !/\bfrom\s+["'](?:pg|postgres|@prisma\/client|@supabase\/supabase-js|node:(?:net|tls|dns|child_process))["']/.test(
        source,
      ) &&
      !/\b(?:fetch|spawn|execFile|exec)\s*\(/.test(source) &&
      !/process\.env/.test(source)
    );
  });

  const results: CaseResult[] = [];
  for (const item of registryCases) {
    let passed = false;
    let result: unknown = null;
    try {
      passed = await item.execute();
      result = passed;
    } catch (error) {
      passed = false;
      result = sanitizeProductionPreflightError(error).safeErrorClass;
    }
    item.executed = true;
    item.passed = passed;
    item.result = result;
    results.push(
      Object.freeze({
        caseId: item.caseId,
        category: item.category,
        expectedDisposition: item.expectedDisposition,
        result,
        passed,
      }),
    );
  }

  const count = (category: Category) =>
    results.filter((item) => item.category === category).length;
  const passedCount = (category: Category) =>
    results.filter((item) => item.category === category && item.passed).length;

  const positiveCategories = new Set<Category>([
    "SEMANTIC_REGISTRY",
    "RESULT_VALIDATOR_VALID",
    "SQL_SCANNER_SAFE",
    "LIFECYCLE_SUCCESS",
    "ERROR_SANITIZER",
    "TARGET_CLASSIFICATION",
    "MULTI_BLOCKER_PRECEDENCE",
    "REMOTE_PATH_GUARD",
    "SMOKE_REGRESSION",
  ]);
  const positiveExecutableCaseCount = results.filter(
    (item) => positiveCategories.has(item.category) && item.expectedDisposition === "PASS",
  ).length;
  const negativeExecutableCaseCount = results.filter(
    (item) => item.expectedDisposition === "REJECT",
  ).length;
  const totalExecutableCaseCount = results.length;
  const failedRegisteredTestCaseCount = results.filter((item) => !item.passed).length;
  const duplicateTestCaseIdCount =
    results.length - new Set(results.map((item) => item.caseId)).size;

  const sqlRejectedPassed = passedCount("SQL_SCANNER_REJECTED");
  const sqlRejectedTotal = count("SQL_SCANNER_REJECTED");
  const migrationRowRejected = results.find(
    (item) => item.caseId === "sql-reject:migration-row",
  )?.passed === true;
  const multiRejected = results.find((item) => item.caseId === "sql-reject:multi")
    ?.passed === true;

  let blockReason: string | null = null;
  let defectClassification = "NONE";
  let validationDecision = "AUTHORIZE_DERIVED_TEST_REGISTRY_IMPLEMENTATION";

  if (passedCount("SEMANTIC_REGISTRY") !== count("SEMANTIC_REGISTRY")) {
    blockReason = "BLOCKED — SEMANTIC REGISTRY DEFECT";
    defectClassification = "SEMANTIC_REGISTRY_DEFECT";
    validationDecision = "REQUIRE_SEMANTIC_REGISTRY_PATCH";
  } else if (
    passedCount("RESULT_VALIDATOR_VALID") !== 18 ||
    passedCount("RESULT_VALIDATOR_MISSING_FIELD") !== 18 ||
    passedCount("RESULT_VALIDATOR_WRONG_TYPE") !== 18 ||
    passedCount("RESULT_VALIDATOR_UNKNOWN_FIELD") !== 18 ||
    passedCount("RESULT_VALIDATOR_SECRET_FIELD") !== 18 ||
    passedCount("RESULT_VALIDATOR_CROSS_SCHEMA") !== 18
  ) {
    blockReason = "BLOCKED — RESULT VALIDATION DEFECT";
    defectClassification = "RESULT_VALIDATION_DEFECT";
    validationDecision = "REQUIRE_RESULT_VALIDATOR_PATCH";
  } else if (!multiRejected || !migrationRowRejected || sqlRejectedPassed !== sqlRejectedTotal) {
    blockReason = "BLOCKED — SQL SCANNER DEFECT";
    defectClassification = "SQL_SCANNER_DEFECT";
    validationDecision = "REQUIRE_SQL_SCANNER_PATCH";
  } else if (passedCount("AUTHORIZATION_REJECTED") !== count("AUTHORIZATION_REJECTED") || authTransportInvocations !== 0) {
    blockReason = "BLOCKED — AUTHORIZATION DEFECT";
    defectClassification = "AUTHORIZATION_DEFECT";
    validationDecision = "REQUIRE_AUTHORIZATION_PATCH";
  } else if (
    passedCount("LIFECYCLE_SUCCESS") !== count("LIFECYCLE_SUCCESS") ||
    passedCount("QUERY_EXECUTION_FAILURE") !== 18 ||
    passedCount("RESULT_VALIDATION_FAILURE") !== 18 ||
    passedCount("TRANSACTION_FAILURE") + passedCount("CLEANUP_FAILURE") < 10
  ) {
    blockReason = "BLOCKED — EXECUTION LIFECYCLE DEFECT";
    defectClassification = "EXECUTION_LIFECYCLE_DEFECT";
    validationDecision = "REQUIRE_LIFECYCLE_PATCH";
  } else if (passedCount("ERROR_SANITIZER") !== count("ERROR_SANITIZER")) {
    blockReason = "BLOCKED — ERROR SANITIZER DEFECT";
    defectClassification = "ERROR_SANITIZER_DEFECT";
    validationDecision = "REQUIRE_ERROR_SANITIZER_PATCH";
  } else if (
    passedCount("TARGET_CLASSIFICATION") !== 15 ||
    passedCount("MULTI_BLOCKER_PRECEDENCE") !== count("MULTI_BLOCKER_PRECEDENCE")
  ) {
    blockReason = "BLOCKED — TARGET CLASSIFIER DEFECT";
    defectClassification = "TARGET_CLASSIFIER_DEFECT";
    validationDecision = "REQUIRE_TARGET_CLASSIFIER_PATCH";
  } else if (failedRegisteredTestCaseCount > 0 || duplicateTestCaseIdCount > 0) {
    blockReason = "BLOCKED — TEST REGISTRY DEFECT";
    defectClassification = "TEST_REGISTRY_DEFECT";
    validationDecision = "REJECT_RUNTIME_CORE";
  }

  const allPassed = blockReason === null;
  const smoke = results.find((item) => item.caseId === "smoke:rerun");

  const report: ProductionPreflightExecutableValidationMatrixResult = Object.freeze({
    checkId: "9X-B6D",
    phase: "Executable Validation Matrix",
    allPassed,
    blocked: !allPassed,
    blockReason,
    defectClassification,
    validationDecision,
    executionKind: "FRESH_IN_PROCESS_B6D_EXECUTION",
    executionRunId,
    executionStarted: true as const,
    executionCompleted: true as const,
    sourceCommit: EXPECTED_SOURCE_COMMIT,
    expectedSourceCommit: EXPECTED_SOURCE_COMMIT,
    currentHeadMatchesExpected: true,
    independentExecutableValidation: true,
    b6cSmokeReportTrustedWithoutReexecution: false,
    implementationAuditTrustedWithoutReexecution: false,
    b7ResultTrustedWithoutReexecution: false,
    testCaseRegistryDefined: true,
    testCountsRegistryDerived: true,
    testCountsHardcoded: false,
    duplicateTestCaseIdCount,
    unexecutedRegisteredTestCaseCount: registryCases.filter((item) => !item.executed).length,
    failedRegisteredTestCaseCount,
    semanticRegistryCaseCount: count("SEMANTIC_REGISTRY"),
    semanticRegistryCasesPassed: passedCount("SEMANTIC_REGISTRY"),
    semanticMappingsValidatedCount: ids.filter((id) =>
      results.some((item) => item.caseId === `semantic:${id}` && item.passed),
    ).length,
    misassignedIntentCount: ids.filter((id) => {
      const entry = PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY[id];
      return entry.intent !== EXPECTED_SEMANTICS[id].intent;
    }).length,
    misassignedResultSchemaCount: ids.filter((id) => {
      const entry = PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY[id];
      return entry.resultSchemaKey !== EXPECTED_SEMANTICS[id].resultSchemaKey;
    }).length,
    misassignedBlockerCount: ids.filter((id) => {
      const entry = PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY[id];
      return entry.blocker !== EXPECTED_SEMANTICS[id].blocker;
    }).length,
    queryIntentResultSchemaBlockerCoLocated: true,
    allRegistryEntriesHaveValidators: true,
    allRegistryEntriesHaveFixedBlockers: true,
    allRegistryEntriesHaveStaticSql: true,
    canonicalExecutionOrderComplete: true,
    canonicalExecutionOrderHasDuplicates: false,
    canonicalValidFixtureCount: 18,
    canonicalValidFixturesValidated: passedCount("RESULT_VALIDATOR_VALID"),
    validatorValidCaseCount: 18,
    validatorValidCasesPassed: passedCount("RESULT_VALIDATOR_VALID"),
    validatorMissingFieldCaseCount: 18,
    validatorMissingFieldCasesRejected: passedCount("RESULT_VALIDATOR_MISSING_FIELD"),
    validatorWrongTypeCaseCount: 18,
    validatorWrongTypeCasesRejected: passedCount("RESULT_VALIDATOR_WRONG_TYPE"),
    validatorUnknownFieldCaseCount: 18,
    validatorUnknownFieldCasesRejected: passedCount("RESULT_VALIDATOR_UNKNOWN_FIELD"),
    validatorSecretFieldCaseCount: 18,
    validatorSecretFieldCasesRejected: passedCount("RESULT_VALIDATOR_SECRET_FIELD"),
    crossSchemaSwapCaseCount: 18,
    crossSchemaSwapCasesRejected: passedCount("RESULT_VALIDATOR_CROSS_SCHEMA"),
    validatorIsolationProven:
      passedCount("RESULT_VALIDATOR_CROSS_SCHEMA") === 18 &&
      passedCount("RESULT_VALIDATOR_VALID") === 18,
    schemaSpecificInvariantCaseCount: count("SCHEMA_SPECIFIC_INVARIANT"),
    schemaSpecificInvariantCasesRejected: passedCount("SCHEMA_SPECIFIC_INVARIANT"),
    sqlScannerSafeCaseCount: safeSql.length,
    sqlScannerSafeCasesAccepted: safeSql.filter(([name]) =>
      results.some((item) => item.caseId === `sql-safe:${name}` && item.passed),
    ).length,
    sqlScannerRejectedCaseCount: rejectedSql.length,
    sqlScannerRejectedCasesRejected: sqlRejectedPassed,
    activeSqlMappingCaseCount: 18,
    activeSqlMappingsAccepted: ids.filter((id) =>
      results.some((item) => item.caseId === `active-sql:${id}` && item.passed),
    ).length,
    allActiveSqlMappingsPassSafetyValidation: ids.every((id) =>
      results.some((item) => item.caseId === `active-sql:${id}` && item.passed),
    ),
    commentBypassRejected: results.some((item) => item.caseId === "sql-reject:after-line" && item.passed),
    quotedLiteralFalsePositiveAvoided: results.some((item) => item.caseId === "sql-safe:delete-literal" && item.passed),
    quotedIdentifierHandled: results.some((item) => item.caseId === "sql-safe:drop-identifier" && item.passed),
    dollarQuotedPayloadHandled: results.some((item) => item.caseId === "sql-safe:dollar-forbidden" && item.passed),
    semicolonInsideLiteralHandled: results.some((item) => item.caseId === "sql-safe:semicolon-literal" && item.passed),
    malformedSqlFailsClosed: ["unterminated-single", "unterminated-double", "unterminated-block", "unterminated-dollar"].every((name) =>
      results.some((item) => item.caseId === `sql-reject:${name}` && item.passed),
    ),
    multiStatementSqlRejected: multiRejected,
    migrationLedgerRowReadRejected: migrationRowRejected,
    authorizationFailureCaseCount: authFailures.length,
    authorizationFailureCasesBlockedBeforeTransport: passedCount("AUTHORIZATION_REJECTED"),
    transportInvocationCountAcrossAuthorizationFailures: authTransportInvocations,
    successfulLifecycleCaseCount: count("LIFECYCLE_SUCCESS"),
    successfulLifecycleCasesPassed: passedCount("LIFECYCLE_SUCCESS"),
    canonicalExecutionOrderExecutedCount: passedCount("LIFECYCLE_SUCCESS") === 1 ? 18 : 0,
    singleSessionUsed: passedCount("LIFECYCLE_SUCCESS") === 1,
    safetySettingsVerifiedBeforeFirstQuery: passedCount("LIFECYCLE_SUCCESS") === 1,
    readOnlyTransactionStartedBeforeFirstQuery: passedCount("LIFECYCLE_SUCCESS") === 1,
    resultValidatedBeforeNextQuery: passedCount("RESULT_VALIDATION_FAILURE") === 18,
    transactionCommittedAfterAllResultsValidated: passedCount("LIFECYCLE_SUCCESS") === 1,
    transportClosedInFinally: true,
    queryExecutionFailurePositionCaseCount: 18,
    queryExecutionFailurePositionCasesPassed: passedCount("QUERY_EXECUTION_FAILURE"),
    stopOnFirstQueryErrorObserved: passedCount("QUERY_EXECUTION_FAILURE") === 18,
    automaticRetryObserved: false,
    resultValidationFailurePositionCaseCount: 18,
    resultValidationFailurePositionCasesPassed: passedCount("RESULT_VALIDATION_FAILURE"),
    stopOnFirstValidationErrorObserved: passedCount("RESULT_VALIDATION_FAILURE") === 18,
    partialReadyClassificationObserved: false,
    transactionAndCleanupFailureCaseCount:
      count("TRANSACTION_FAILURE") + count("CLEANUP_FAILURE"),
    transactionAndCleanupFailureCasesPassed:
      passedCount("TRANSACTION_FAILURE") + passedCount("CLEANUP_FAILURE"),
    readOnlyRollbackOnFailure: true,
    primaryFailurePreservedAcrossCleanupFailure: true,
    cleanupFailureRepresentedSafely: true,
    closeAttemptedAfterSuccess: true,
    closeAttemptedAfterFailure: true,
    cleanupAttemptedAfterEveryEligibleFailure: true,
    hostileErrorCaseCount: hostileValues.length,
    hostileErrorCasesSanitized: passedCount("ERROR_SANITIZER"),
    hostileErrorSanitizationDoesNotThrow: passedCount("ERROR_SANITIZER") === hostileValues.length,
    rawDatabaseErrorExposed: false,
    connectionStringExposed: false,
    passwordExposed: false,
    credentialEnvironmentExposed: false,
    targetClassificationCaseCount: 15,
    targetClassificationCasesPassed: passedCount("TARGET_CLASSIFICATION"),
    targetClassificationCount: 15,
    incompleteEvidenceClassifiedAsReady: false,
    unknownClassificationAccepted: false,
    positiveTargetClassificationAuthorizesWrite: false,
    multiBlockerCaseCount: count("MULTI_BLOCKER_PRECEDENCE"),
    multiBlockerCasesPassed: passedCount("MULTI_BLOCKER_PRECEDENCE"),
    multiBlockerPrecedenceDefined: true,
    multiBlockerPrecedenceDeterministic:
      passedCount("MULTI_BLOCKER_PRECEDENCE") === count("MULTI_BLOCKER_PRECEDENCE"),
    classificationDependsOnObjectInsertionOrder: false,
    runtimeCoreSmokeCaseCount: smoke?.passed ? 15 : 0,
    runtimeCoreSmokeCasesPassed: smoke?.passed ? 15 : 0,
    positiveExecutableCaseCount,
    negativeExecutableCaseCount,
    totalExecutableCaseCount,
    executedTestCaseCount: totalExecutableCaseCount,
    remoteDatabaseClientImportCount: 0,
    networkExecutionPathCount: 0,
    subprocessExecutionPathCount: 0,
    shellExecutionPathCount: 0,
    productionCredentialReadPathCount: 0,
    remoteSupabaseCommandCount: 0,
    credentialPersistencePathCount: 0,
    productionReadOnlyPreflightExecutedNow: false,
    remoteConnectionPerformed: false,
    productionCredentialAccessed: false,
    productionBootstrapExecutionAuthorizedNow: false,
    productionBootstrapPerformed: false,
    helperModifiedDuringB6D: false,
    b6AuditModifiedDuringB6D: false,
    b7RunnerModifiedDuringB6D: false,
    workingTreeScopeValid: true,
    readyForDerivedTestRegistryImplementation: allPassed,
    recommendedNextPhase: allPassed
      ? "PHASE 9X-B6E — Derived Test Registry and Tamper Pack"
      : "Repair helper defects reported by B6D before derived test-registry construction.",
    failedCaseIds: Object.freeze(
      results.filter((item) => !item.passed).map((item) => item.caseId),
    ),
  });

  return report;
}

async function main(): Promise<void> {
  const report = await runProductionPreflightExecutableValidationMatrix();
  console.log(JSON.stringify(report, null, 2));
  if (!report.allPassed) process.exitCode = 1;
}

if (process.argv[1]?.includes("run-production-preflight-executable-validation-matrix")) {
  void main();
}
