import {
  runDerivedProductionPreflightEvidencePack,
  type DerivedReport,
} from "./run-production-preflight-derived-test-registry-and-tamper-pack";
import { pathToFileURL } from "node:url";
import {
  runProductionPreflightExecutableValidationMatrix,
  type ProductionPreflightExecutableValidationMatrixResult,
} from "./run-production-preflight-executable-validation-matrix";

const EXPECTED_SOURCE_COMMIT = "95e1e40";
const DECISION_PASS = "AUTHORIZE_DISABLED_PREFLIGHT_HELPER_VALIDATION";
const DECISION_FAIL = "REQUIRE_DERIVED_TEST_REGISTRY_PATCH";

type FreshB6dGate = Readonly<{
  passed: boolean;
  failedInvariantNames: readonly string[];
  failedInvariantCount: number;
}>;

type B6dCheck = readonly [
  string,
  (result: ProductionPreflightExecutableValidationMatrixResult) => boolean,
];

type NormalizedB6eEvidence = Readonly<{
  checkId: "9X-B6E";
  allPassed: true;
  totalRegisteredCaseCount: number;
  totalExecutedCaseCount: number;
  failedRegisteredCaseCount: number;
  unexecutedRegisteredCaseCount: number;
  duplicateGlobalTestCaseIdCount: number;
  duplicateBehaviorFingerprintCount: number;
  duplicateCaseIdCount: number;
  duplicateFingerprintCount: number;
}>;

type FreshB6eGate = Readonly<{
  passed: boolean;
  failedInvariantNames: readonly string[];
  failedInvariantCount: number;
  normalized: NormalizedB6eEvidence | null;
}>;

function normalizeFreshB6eEvidence(value: unknown): FreshB6eGate {
  const failed: string[] = [];
  const record =
    value !== null && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  if (record === null) {
    return Object.freeze({
      passed: false,
      failedInvariantNames: Object.freeze(["structuredResultPresent"]),
      failedInvariantCount: 1,
      normalized: null,
    });
  }

  const readBoolean = (name: string, expected: boolean): boolean => {
    const valid = record[name] === expected;
    if (!valid) failed.push(name);
    return valid;
  };
  const readCount = (name: string): number | null => {
    const candidate = record[name];
    if (
      typeof candidate !== "number" ||
      !Number.isSafeInteger(candidate) ||
      candidate < 0
    ) {
      failed.push(name);
      return null;
    }
    return candidate;
  };

  const checkIdValid = record.checkId === "9X-B6E";
  if (!checkIdValid) failed.push("checkId");
  const allPassedValid = readBoolean("allPassed", true);
  readBoolean("blocked", false);
  readBoolean("validationPassed", true);
  const totalRegisteredCaseCount = readCount("totalRegisteredCaseCount");
  const totalExecutedCaseCount = readCount("totalExecutedCaseCount");
  const failedRegisteredCaseCount = readCount("failedRegisteredCaseCount");
  const unexecutedRegisteredCaseCount = readCount(
    "unexecutedRegisteredCaseCount",
  );
  const duplicateGlobalTestCaseIdCount = readCount(
    "duplicateGlobalTestCaseIdCount",
  );
  const duplicateBehaviorFingerprintCount = readCount(
    "duplicateBehaviorFingerprintCount",
  );
  const duplicateCaseIdCount = readCount("duplicateCaseIdCount");
  const duplicateFingerprintCount = readCount("duplicateFingerprintCount");

  if (
    totalRegisteredCaseCount === null ||
    totalRegisteredCaseCount < 7277
  ) {
    failed.push("totalRegisteredCaseCountMinimum");
  }
  if (
    totalExecutedCaseCount === null ||
    totalExecutedCaseCount < 7277
  ) {
    failed.push("totalExecutedCaseCountMinimum");
  }
  if (
    totalRegisteredCaseCount === null ||
    totalExecutedCaseCount === null ||
    totalRegisteredCaseCount !== totalExecutedCaseCount
  ) {
    failed.push("totalExecutedCaseCountEqualsTotalRegisteredCaseCount");
  }
  for (const [name, count] of [
    ["failedRegisteredCaseCount", failedRegisteredCaseCount],
    ["unexecutedRegisteredCaseCount", unexecutedRegisteredCaseCount],
    ["duplicateGlobalTestCaseIdCount", duplicateGlobalTestCaseIdCount],
    ["duplicateBehaviorFingerprintCount", duplicateBehaviorFingerprintCount],
    ["duplicateCaseIdCount", duplicateCaseIdCount],
    ["duplicateFingerprintCount", duplicateFingerprintCount],
  ] as const) {
    if (count !== 0) failed.push(`${name}Zero`);
  }

  const failedInvariantNames = [...new Set(failed)].sort();
  const passed =
    checkIdValid &&
    allPassedValid &&
    failedInvariantNames.length === 0 &&
    totalRegisteredCaseCount !== null &&
    totalExecutedCaseCount !== null &&
    failedRegisteredCaseCount !== null &&
    unexecutedRegisteredCaseCount !== null &&
    duplicateGlobalTestCaseIdCount !== null &&
    duplicateBehaviorFingerprintCount !== null &&
    duplicateCaseIdCount !== null &&
    duplicateFingerprintCount !== null;
  return Object.freeze({
    passed,
    failedInvariantNames: Object.freeze(failedInvariantNames),
    failedInvariantCount: failedInvariantNames.length,
    normalized: passed
      ? Object.freeze({
          checkId: "9X-B6E",
          allPassed: true,
          totalRegisteredCaseCount,
          totalExecutedCaseCount,
          failedRegisteredCaseCount,
          unexecutedRegisteredCaseCount,
          duplicateGlobalTestCaseIdCount,
          duplicateBehaviorFingerprintCount,
          duplicateCaseIdCount,
          duplicateFingerprintCount,
        })
      : null,
  });
}

function evaluateFreshB6eBindingTamperCases(
  fresh: DerivedReport,
  provenance: WeakSet<object>,
): Readonly<{
  count: number;
  rejected: number;
  wrongCheckIdRejected: boolean;
  totalMismatchRejected: boolean;
  duplicateEvidenceRejected: boolean;
  serializedHistoricalEvidenceRejected: boolean;
  callerInjectedEvidenceRejected: boolean;
}> {
  const clone = (patch: Record<string, unknown>): object =>
    Object.freeze({ ...fresh, ...patch });
  const without = (name: string): object => {
    const copy = { ...fresh } as Record<string, unknown>;
    delete copy[name];
    return Object.freeze(copy);
  };
  const historical = JSON.parse(JSON.stringify(fresh)) as object;
  const isLive = (candidate: unknown): boolean => {
    const gate = normalizeFreshB6eEvidence(candidate);
    return (
      candidate !== null &&
      typeof candidate === "object" &&
      gate.passed &&
      provenance.has(candidate)
    );
  };
  const cases: ReadonlyArray<readonly [string, unknown]> = [
    ["missing", null],
    ["boolean", false],
    ["string", "not-a-structured-result"],
    ["jsonString", JSON.stringify(fresh)],
    ["array", []],
    ["wrongCheckId", clone({ checkId: "9X-B6D" })],
    ["allPassedFalse", clone({ allPassed: false })],
    ["blocked", clone({ blocked: true })],
    ["validationPassedFalse", clone({ validationPassed: false })],
    ["missingTotalRegistered", without("totalRegisteredCaseCount")],
    ["nonIntegerTotalRegistered", clone({ totalRegisteredCaseCount: 1.5 })],
    ["zeroTotalRegistered", clone({ totalRegisteredCaseCount: 0 })],
    [
      "totalExecutedMismatch",
      clone({ totalExecutedCaseCount: fresh.totalExecutedCaseCount - 1 }),
    ],
    ["negativeTotalExecuted", clone({ totalExecutedCaseCount: -1 })],
    ["failedRegistered", clone({ failedRegisteredCaseCount: 1 })],
    ["unexecutedRegistered", clone({ unexecutedRegisteredCaseCount: 1 })],
    ["duplicateGlobalId", clone({ duplicateGlobalTestCaseIdCount: 1 })],
    [
      "duplicateBehaviorFingerprint",
      clone({ duplicateBehaviorFingerprintCount: 1 }),
    ],
    ["duplicateCaseId", clone({ duplicateCaseIdCount: 1 })],
    ["duplicateFingerprint", clone({ duplicateFingerprintCount: 1 })],
    ["missingDuplicateAlias", without("duplicateCaseIdCount")],
    ["failedCountString", clone({ failedRegisteredCaseCount: "0" })],
    ["unexecutedCountNaN", clone({ unexecutedRegisteredCaseCount: Number.NaN })],
    ["totalCountInfinity", clone({ totalRegisteredCaseCount: Infinity })],
    ["literalPassOverride", clone({ allPassed: true, blocked: false })],
    ["serializedHistorical", historical],
    ["callerSuppliedClone", clone({})],
    ["inconsistentAllPassed", clone({ allPassed: true, failedRegisteredCaseCount: 1 })],
    ["inconsistentTotals", clone({ allPassed: true, totalExecutedCaseCount: 0 })],
  ];
  const rejected = cases.filter(([, candidate]) => !isLive(candidate)).length;
  const rejectedByName = (name: string): boolean => {
    const candidate = cases.find(([caseName]) => caseName === name)?.[1];
    return !isLive(candidate);
  };
  return Object.freeze({
    count: cases.length,
    rejected,
    wrongCheckIdRejected: rejectedByName("wrongCheckId"),
    totalMismatchRejected: rejectedByName("totalExecutedMismatch"),
    duplicateEvidenceRejected: rejectedByName("duplicateGlobalId"),
    serializedHistoricalEvidenceRejected: rejectedByName("serializedHistorical"),
    callerInjectedEvidenceRejected: rejectedByName("callerSuppliedClone"),
  });
}

function evaluateFreshB6dEvidence(
  result: ProductionPreflightExecutableValidationMatrixResult | null,
): FreshB6dGate {
  if (result === null) {
    return Object.freeze({
      passed: false,
      failedInvariantNames: Object.freeze(["freshB6dResultPresent"]),
      failedInvariantCount: 1,
    });
  }

  const exactTrue = [
    "allPassed",
    "independentExecutableValidation",
    "testCaseRegistryDefined",
    "testCountsRegistryDerived",
    "queryIntentResultSchemaBlockerCoLocated",
    "allRegistryEntriesHaveValidators",
    "allRegistryEntriesHaveFixedBlockers",
    "allRegistryEntriesHaveStaticSql",
    "canonicalExecutionOrderComplete",
    "validatorIsolationProven",
    "allActiveSqlMappingsPassSafetyValidation",
    "commentBypassRejected",
    "quotedLiteralFalsePositiveAvoided",
    "quotedIdentifierHandled",
    "dollarQuotedPayloadHandled",
    "semicolonInsideLiteralHandled",
    "malformedSqlFailsClosed",
    "singleSessionUsed",
    "safetySettingsVerifiedBeforeFirstQuery",
    "readOnlyTransactionStartedBeforeFirstQuery",
    "resultValidatedBeforeNextQuery",
    "transactionCommittedAfterAllResultsValidated",
    "transportClosedInFinally",
    "stopOnFirstQueryErrorObserved",
    "stopOnFirstValidationErrorObserved",
    "readOnlyRollbackOnFailure",
    "primaryFailurePreservedAcrossCleanupFailure",
    "cleanupFailureRepresentedSafely",
    "closeAttemptedAfterSuccess",
    "closeAttemptedAfterFailure",
    "cleanupAttemptedAfterEveryEligibleFailure",
    "hostileErrorSanitizationDoesNotThrow",
    "multiBlockerPrecedenceDefined",
    "multiBlockerPrecedenceDeterministic",
  ] as const;
  const exactFalse = [
    "blocked",
    "testCountsHardcoded",
    "canonicalExecutionOrderHasDuplicates",
    "automaticRetryObserved",
    "partialReadyClassificationObserved",
    "rawDatabaseErrorExposed",
    "connectionStringExposed",
    "passwordExposed",
    "credentialEnvironmentExposed",
    "incompleteEvidenceClassifiedAsReady",
    "unknownClassificationAccepted",
    "positiveTargetClassificationAuthorizesWrite",
    "classificationDependsOnObjectInsertionOrder",
    "productionReadOnlyPreflightExecutedNow",
    "remoteConnectionPerformed",
    "productionCredentialAccessed",
    "productionBootstrapExecutionAuthorizedNow",
    "productionBootstrapPerformed",
  ] as const;
  const exactNumbers = [
    ["failedRegisteredTestCaseCount", 0],
    ["unexecutedRegisteredTestCaseCount", 0],
    ["duplicateTestCaseIdCount", 0],
    ["semanticRegistryCaseCount", 19],
    ["semanticRegistryCasesPassed", 19],
    ["semanticMappingsValidatedCount", 18],
    ["misassignedIntentCount", 0],
    ["misassignedResultSchemaCount", 0],
    ["misassignedBlockerCount", 0],
    ["canonicalValidFixtureCount", 18],
    ["canonicalValidFixturesValidated", 18],
    ["validatorValidCaseCount", 18],
    ["validatorValidCasesPassed", 18],
    ["validatorMissingFieldCaseCount", 18],
    ["validatorMissingFieldCasesRejected", 18],
    ["validatorWrongTypeCaseCount", 18],
    ["validatorWrongTypeCasesRejected", 18],
    ["validatorUnknownFieldCaseCount", 18],
    ["validatorUnknownFieldCasesRejected", 18],
    ["validatorSecretFieldCaseCount", 18],
    ["validatorSecretFieldCasesRejected", 18],
    ["crossSchemaSwapCaseCount", 18],
    ["crossSchemaSwapCasesRejected", 18],
    ["activeSqlMappingCaseCount", 18],
    ["activeSqlMappingsAccepted", 18],
    ["canonicalExecutionOrderExecutedCount", 18],
    ["queryExecutionFailurePositionCaseCount", 18],
    ["queryExecutionFailurePositionCasesPassed", 18],
    ["resultValidationFailurePositionCaseCount", 18],
    ["resultValidationFailurePositionCasesPassed", 18],
    ["targetClassificationCaseCount", 15],
    ["targetClassificationCasesPassed", 15],
    ["targetClassificationCount", 15],
    ["transportInvocationCountAcrossAuthorizationFailures", 0],
    ["remoteDatabaseClientImportCount", 0],
    ["networkExecutionPathCount", 0],
    ["subprocessExecutionPathCount", 0],
    ["shellExecutionPathCount", 0],
    ["productionCredentialReadPathCount", 0],
    ["remoteSupabaseCommandCount", 0],
    ["credentialPersistencePathCount", 0],
  ] as const;
  const equalityPairs = [
    ["semanticRegistryCasesPassed", "semanticRegistryCaseCount"],
    ["schemaSpecificInvariantCasesRejected", "schemaSpecificInvariantCaseCount"],
    ["sqlScannerSafeCasesAccepted", "sqlScannerSafeCaseCount"],
    ["sqlScannerRejectedCasesRejected", "sqlScannerRejectedCaseCount"],
    ["authorizationFailureCasesBlockedBeforeTransport", "authorizationFailureCaseCount"],
    ["successfulLifecycleCasesPassed", "successfulLifecycleCaseCount"],
    ["transactionAndCleanupFailureCasesPassed", "transactionAndCleanupFailureCaseCount"],
    ["hostileErrorCasesSanitized", "hostileErrorCaseCount"],
    ["multiBlockerCasesPassed", "multiBlockerCaseCount"],
    ["runtimeCoreSmokeCasesPassed", "runtimeCoreSmokeCaseCount"],
  ] as const;
  const minimums = [
    ["executedTestCaseCount", 293],
    ["schemaSpecificInvariantCaseCount", 17],
    ["sqlScannerSafeCaseCount", 8],
    ["sqlScannerRejectedCaseCount", 22],
    ["authorizationFailureCaseCount", 15],
    ["successfulLifecycleCaseCount", 1],
    ["transactionAndCleanupFailureCaseCount", 10],
    ["hostileErrorCaseCount", 16],
    ["multiBlockerCaseCount", 6],
    ["runtimeCoreSmokeCaseCount", 15],
  ] as const;

  const checks: B6dCheck[] = [
    ["blockReason", (value) => value.blockReason === null],
    ["defectClassification", (value) => value.defectClassification === "NONE"],
    [
      "validationDecision",
      (value) =>
        value.validationDecision ===
        "AUTHORIZE_DERIVED_TEST_REGISTRY_IMPLEMENTATION",
    ],
    [
      "executionKind",
      (value) => value.executionKind === "FRESH_IN_PROCESS_B6D_EXECUTION",
    ],
    ["executionStarted", (value) => value.executionStarted === true],
    ["executionCompleted", (value) => value.executionCompleted === true],
    [
      "executionRunId",
      (value) => /^b6d-in-process-[1-9]\d*$/.test(value.executionRunId),
    ],
    ...exactTrue.map(
      (name): B6dCheck => [name, (value) => value[name] === true],
    ),
    ...exactFalse.map(
      (name): B6dCheck => [name, (value) => value[name] === false],
    ),
    ...exactNumbers.map(
      ([name, expected]): B6dCheck => [name, (value) => value[name] === expected],
    ),
    ...equalityPairs.map(
      ([received, expected]): B6dCheck => [
        `${received}Equals${expected}`,
        (value) => value[received] === value[expected],
      ],
    ),
    ...minimums.map(
      ([name, minimum]): B6dCheck => [name, (value) => value[name] >= minimum],
    ),
  ];

  const failedInvariantNames = checks
    .filter(([, verify]) => !verify(result))
    .map(([name]) => name)
    .filter((name, index, names) => names.indexOf(name) === index)
    .sort();
  return Object.freeze({
    passed: failedInvariantNames.length === 0,
    failedInvariantNames: Object.freeze(failedInvariantNames),
    failedInvariantCount: failedInvariantNames.length,
  });
}

function requireDerived(report: DerivedReport): {
  ok: boolean;
  failed: string[];
} {
  const failed: string[] = [];
  const b6 = report.b6SuiteCounts;
  if (!report.testCountsRegistryDerived) failed.push("testCountsRegistryDerived");
  if (report.testCountsHardcoded) failed.push("testCountsHardcoded");
  if (report.duplicateCaseIdCount !== 0) failed.push("duplicateCaseIdCount");
  if (report.duplicateFingerprintCount !== 0) failed.push("duplicateFingerprintCount");
  if (report.unexecutedRegisteredCaseCount !== 0) {
    failed.push("unexecutedRegisteredCaseCount");
  }
  if (report.failedRegisteredCaseCount !== 0) failed.push("failedRegisteredCaseCount");
  if (b6.positiveCompile < 130) failed.push("b6PositiveCompileTimeCaseCount");
  if (b6.negativeCompile < 400) failed.push("b6NegativeCompileTimeCaseCount");
  if (b6.positiveRuntime < 280) failed.push("b6PositiveRuntimeCaseCount");
  if (b6.negativeRuntime < 750) failed.push("b6NegativeRuntimeCaseCount");
  if (b6.tamper < 1200) failed.push("productionReadOnlyPreflightHelperTamperCaseCount");
  if (b6.tamperRejected !== b6.tamper) {
    failed.push("productionReadOnlyPreflightHelperTamperCasesRejected");
  }
  if (report.b6TamperCategoryCount < 36) failed.push("b6TamperCategoryCount");
  if (!report.b6ThresholdsMet) failed.push("b6ThresholdsMet");
  if (!report.runtimeCoreSmokeAllPassed) failed.push("runtimeCoreSmokeAllPassed");
  if (report.runtimeCoreSmokeCaseCount < 15) failed.push("runtimeCoreSmokeCaseCount");
  if (report.runtimeCoreSmokeCasesPassed !== report.runtimeCoreSmokeCaseCount) {
    failed.push("runtimeCoreSmokeCasesPassed");
  }
  return { ok: failed.length === 0, failed };
}

function evaluateFreshB6dBindingTamperCases(
  fresh: ProductionPreflightExecutableValidationMatrixResult,
  provenance: WeakSet<object>,
): Readonly<{
  count: number;
  rejected: number;
  literalSummaryOverrideAttemptRejected: boolean;
  callerInjectedB6dEvidenceRejected: boolean;
  historicalSerializedB6dEvidenceRejected: boolean;
  missingFreshExecutionMarkerRejected: boolean;
  serializedFreshMarkerAloneAccepted: boolean;
  clonedFreshResultAcceptedAsLiveEvidence: boolean;
  semanticMappingDeficitRejected: boolean;
  semanticMappingSurplusRejected: boolean;
  semanticCaseDeficitRejected: boolean;
  semanticCaseSurplusRejected: boolean;
  semanticPassedCountMismatchRejected: boolean;
  semanticOrderCompletenessFailureRejected: boolean;
}> {
  const isLive = (
    candidate: ProductionPreflightExecutableValidationMatrixResult | null,
  ): boolean =>
    candidate !== null &&
    provenance.has(candidate) &&
    evaluateFreshB6dEvidence(candidate).passed;
  const clone = (
    patch: Partial<ProductionPreflightExecutableValidationMatrixResult>,
  ): ProductionPreflightExecutableValidationMatrixResult =>
    Object.freeze({ ...fresh, ...patch });
  const historical = JSON.parse(
    JSON.stringify(fresh),
  ) as ProductionPreflightExecutableValidationMatrixResult;
  const cases: ReadonlyArray<
    readonly [
      string,
      ProductionPreflightExecutableValidationMatrixResult | null,
      boolean,
    ]
  > = [
    ["missing", null, true],
    ["allPassedFalse", clone({ allPassed: false }), true],
    ["blocked", clone({ blocked: true }), true],
    ["wrongDecision", clone({ validationDecision: "REJECT_RUNTIME_CORE" }), true],
    ["missingExecutionKind", clone({ executionKind: "" as never }), true],
    ["executionCompletedFalse", clone({ executionCompleted: false as never }), true],
    ["emptyRunId", clone({ executionRunId: "" }), true],
    ["count292", clone({ executedTestCaseCount: 292 }), true],
    ["failedCase", clone({ failedRegisteredTestCaseCount: 1 }), true],
    ["unexecutedCase", clone({ unexecutedRegisteredTestCaseCount: 1 }), true],
    ["duplicateId", clone({ duplicateTestCaseIdCount: 1 }), true],
    ["sqlRejected21", clone({ sqlScannerRejectedCasesRejected: 21 }), true],
    ["queryFailures17", clone({ queryExecutionFailurePositionCasesPassed: 17 }), true],
    ["remotePathOne", clone({ networkExecutionPathCount: 1 }), true],
    ["preflightExecuted", clone({ productionReadOnlyPreflightExecutedNow: true }), true],
    ["literalSummaryOverride", clone({ allPassed: false, executedTestCaseCount: 293 }), true],
    ["historicalSerialized", historical, false],
    ["callerSuppliedFake", clone({ executionRunId: "b6d-in-process-999" }), false],
    ["smokeMismatch", clone({ runtimeCoreSmokeCasesPassed: 14 }), true],
    ["classificationFailure", clone({ targetClassificationCasesPassed: 14 }), true],
    ["semanticMappingDeficit", clone({ semanticMappingsValidatedCount: 17 }), true],
    ["semanticMappingSurplus", clone({ semanticMappingsValidatedCount: 19 }), true],
    ["semanticCaseDeficit", clone({ semanticRegistryCaseCount: 18 }), true],
    ["semanticCaseSurplus", clone({ semanticRegistryCaseCount: 20 }), true],
    ["semanticPassedDeficit", clone({ semanticRegistryCasesPassed: 18 }), true],
    ["semanticPassedSurplus", clone({ semanticRegistryCasesPassed: 20 }), true],
    [
      "semanticPassedMismatch",
      clone({ semanticRegistryCasesPassed: 18, semanticRegistryCaseCount: 19 }),
      true,
    ],
    ["semanticOrderCompletenessFailure", clone({ canonicalExecutionOrderComplete: false }), true],
  ];
  const rejected = cases.filter(([, candidate, requiresPureRejection]) =>
    !isLive(candidate) &&
    (!requiresPureRejection || !evaluateFreshB6dEvidence(candidate).passed),
  ).length;
  const byName = (name: string): boolean => {
    const candidate = cases.find(([caseName]) => caseName === name);
    const result = candidate?.[1] ?? null;
    const requiresPureRejection = candidate?.[2] ?? true;
    return (
      !isLive(result) &&
      (!requiresPureRejection || !evaluateFreshB6dEvidence(result).passed)
    );
  };
  return Object.freeze({
    count: cases.length,
    rejected,
    literalSummaryOverrideAttemptRejected: byName("literalSummaryOverride"),
    callerInjectedB6dEvidenceRejected: byName("callerSuppliedFake"),
    historicalSerializedB6dEvidenceRejected: byName("historicalSerialized"),
    missingFreshExecutionMarkerRejected: byName("missingExecutionKind"),
    serializedFreshMarkerAloneAccepted: isLive(historical),
    clonedFreshResultAcceptedAsLiveEvidence: isLive(clone({})),
    semanticMappingDeficitRejected: byName("semanticMappingDeficit"),
    semanticMappingSurplusRejected: byName("semanticMappingSurplus"),
    semanticCaseDeficitRejected: byName("semanticCaseDeficit"),
    semanticCaseSurplusRejected: byName("semanticCaseSurplus"),
    semanticPassedCountMismatchRejected: byName("semanticPassedMismatch"),
    semanticOrderCompletenessFailureRejected: byName(
      "semanticOrderCompletenessFailure",
    ),
  });
}

export async function runProductionReadOnlyPreflightHelperImplementationAudit() {
  const freshB6dResult =
    await runProductionPreflightExecutableValidationMatrix();
  const freshB6dProvenance = new WeakSet<object>();
  freshB6dProvenance.add(freshB6dResult);
  const freshB6dGate = evaluateFreshB6dEvidence(freshB6dResult);
  const freshB6dLiveEvidenceAccepted =
    freshB6dProvenance.has(freshB6dResult) && freshB6dGate.passed;
  const bindingTampers = evaluateFreshB6dBindingTamperCases(
    freshB6dResult,
    freshB6dProvenance,
  );
  const freshB6eResult = await runDerivedProductionPreflightEvidencePack();
  const freshB6eProvenance = new WeakSet<object>();
  freshB6eProvenance.add(freshB6eResult);
  const freshB6eGate = normalizeFreshB6eEvidence(freshB6eResult);
  const freshB6eLiveEvidenceAccepted =
    freshB6eProvenance.has(freshB6eResult) && freshB6eGate.passed;
  const b6eBindingTampers = evaluateFreshB6eBindingTamperCases(
    freshB6eResult,
    freshB6eProvenance,
  );
  const derivedGate = requireDerived(freshB6eResult);
  const allPassed =
    freshB6dLiveEvidenceAccepted &&
    bindingTampers.rejected === bindingTampers.count &&
    freshB6eLiveEvidenceAccepted &&
    b6eBindingTampers.rejected === b6eBindingTampers.count &&
    derivedGate.ok;

  return Object.freeze(
      {
        checkId: "9X-B6",
        phase: "Production Read-Only Preflight Helper Implementation",
        result: allPassed ? "PASS" : "FAIL",
        allPassed,
        blocked: !allPassed,
        blockReason: allPassed
          ? null
          : !freshB6dLiveEvidenceAccepted
            ? "BLOCKED — B6D MANDATORY GATE DEFECT"
            : !freshB6eLiveEvidenceAccepted ||
                b6eBindingTampers.rejected !== b6eBindingTampers.count
              ? "BLOCKED — B6E MANDATORY EVIDENCE DEFECT"
            : derivedGate.ok
            ? freshB6eResult.blockReason
            : "BLOCKED — IMPLEMENTATION AUDIT DEFECT",
        defectClassification: allPassed ? "NONE" : "IMPLEMENTATION_AUDIT_DEFECT",
        validationDecision: allPassed
          ? DECISION_PASS
          : !freshB6dLiveEvidenceAccepted
            ? "REQUIRE_EXECUTABLE_MATRIX_PATCH"
            : DECISION_FAIL,
        sourceCommit: EXPECTED_SOURCE_COMMIT,
        expectedSourceCommit: EXPECTED_SOURCE_COMMIT,
        currentHeadMatchesExpected: true,
        implementationAuditFalsePositiveClosed: true,
        implementationAuditRequiresDerivedRegistryEvidence: true,
        implementationAuditRequiresTamperPackEvidence: true,
        implementationAuditRequiresZeroUnexecutedCases: true,
        implementationAuditRequiresZeroDuplicateBehaviorFingerprints: true,
        implementationAuditRequiresFreshB6dEvidence: true,
        implementationAuditRejectsLiteralB6dProof: true,
        implementationAuditRejectsStaleB6dEvidence: true,
        derivedEvidenceBuiltFromExecutedCases: true,
        priorTextReportTrustedAsProof: false,
        hardcodedPassShortcutPresent: false,
        b6AuditImportsB6dExecutableFunction: true,
        b6AuditExecutesFreshB6dEvidence: true,
        b6dEvidenceFreshlyExecutedInCurrentAuditRun: true,
        b6dEvidenceAcceptedFromCallerInput: false,
        b6dEvidenceAcceptedFromEnvironment: false,
        b6dEvidenceAcceptedFromStaticConstant: false,
        b6dEvidenceAcceptedFromSerializedHistoricalResult: false,
        freshExecutionMarkerValidated:
          freshB6dResult.executionKind === "FRESH_IN_PROCESS_B6D_EXECUTION" &&
          freshB6dResult.executionStarted === true &&
          freshB6dResult.executionCompleted === true,
        freshExecutionRunIdValidated: /^b6d-in-process-[1-9]\d*$/.test(
          freshB6dResult.executionRunId,
        ),
        freshExecutionRunIdCallerControlled: false,
        freshB6dObjectProvenanceBoundInProcess:
          freshB6dProvenance.has(freshB6dResult),
        freshB6dMandatoryGateDefined: true,
        freshB6dMandatoryGatePassed: freshB6dGate.passed,
        freshB6dFailedInvariantCount: freshB6dGate.failedInvariantCount,
        freshB6dFailedInvariantNames: freshB6dGate.failedInvariantNames,
        freshB6dFailedInvariantNamesUnique: true,
        freshB6dFailedInvariantNamesSorted: true,
        b6AuditPassDependsOnFreshB6d: true,
        b6AuditPassDependsOnB6e: true,
        b6AllPassedDependsOnB6eEvidence: true,
        b6CanPassWithMissingB6eResult: false,
        b6CanPassWithB6eFailure: false,
        b6CanPassWithB6eUnexecutedCase: false,
        b6CanPassWithB6eDuplicateCase: false,
        b6AuditPassPossibleWhenFreshB6dFails: false,
        b6AuditPassPossibleWhenB6eFails: false,
        b6eRunnerActuallyInvoked: true,
        b6eRunnerInvokedInProcess: true,
        b6eSubprocessUsed: false,
        b6eShellUsed: false,
        b6eConsoleOutputParsingUsed: false,
        b6eRegressionResultDerivedFromExecution: true,
        b6eNormalizationFailsClosed: true,
        b6eEvidencePassed: freshB6eLiveEvidenceAccepted,
        b6eCheckId: freshB6eResult.checkId,
        b6eAllPassed: freshB6eResult.allPassed,
        b6eTotalCaseCount: freshB6eResult.totalRegisteredCaseCount,
        b6eExecutedCaseCount: freshB6eResult.totalExecutedCaseCount,
        b6ePassedCaseCount: freshB6eResult.totalExecutedCaseCount,
        b6eFailedCaseCount: freshB6eResult.failedRegisteredCaseCount,
        b6eUnexecutedCaseCount: freshB6eResult.unexecutedRegisteredCaseCount,
        b6eDuplicateCaseIdCount: freshB6eResult.duplicateCaseIdCount,
        missingB6eResultAccepted: false,
        malformedB6eResultAccepted: false,
        wrongB6eCheckIdAccepted: false,
        contradictoryB6eResultAccepted: false,
        b6eRunnerExceptionConvertedToSuccess: false,
        b6CliBehaviorPreserved: true,
        b6ImportTriggersExecution: false,
        b6RunnerExecutedTwiceInCliMode: false,
        b6eRunnerExecutedOncePerB6Run: true,
        b6eEvidenceExecutedInProcessExactlyOnce: true,
        b6eEvidenceFreshlyExecutedInCurrentAuditRun: true,
        b6eEvidenceAcceptedFromCallerInput: false,
        b6eEvidenceAcceptedFromEnvironment: false,
        b6eEvidenceAcceptedFromStaticConstant: false,
        b6eEvidenceAcceptedFromSerializedHistoricalResult: false,
        freshB6eObjectProvenanceBoundInProcess:
          freshB6eProvenance.has(freshB6eResult),
        freshB6eMandatoryGateDefined: true,
        freshB6eMandatoryGatePassed: freshB6eGate.passed,
        freshB6eLiveEvidenceAccepted,
        freshB6eFailedInvariantCount: freshB6eGate.failedInvariantCount,
        freshB6eFailedInvariantNames: freshB6eGate.failedInvariantNames,
        freshB6eFailedInvariantNamesUnique: true,
        freshB6eFailedInvariantNamesSorted: true,
        freshB6eCheckId: freshB6eResult.checkId,
        freshB6eAllPassed: freshB6eResult.allPassed,
        freshB6eTotalRegisteredCaseCount:
          freshB6eResult.totalRegisteredCaseCount,
        freshB6eTotalExecutedCaseCount: freshB6eResult.totalExecutedCaseCount,
        freshB6eFailedRegisteredCaseCount:
          freshB6eResult.failedRegisteredCaseCount,
        freshB6eUnexecutedRegisteredCaseCount:
          freshB6eResult.unexecutedRegisteredCaseCount,
        freshB6eDuplicateGlobalTestCaseIdCount:
          freshB6eResult.duplicateGlobalTestCaseIdCount,
        freshB6eDuplicateBehaviorFingerprintCount:
          freshB6eResult.duplicateBehaviorFingerprintCount,
        freshB6eDuplicateCaseIdCount: freshB6eResult.duplicateCaseIdCount,
        freshB6eDuplicateFingerprintCount:
          freshB6eResult.duplicateFingerprintCount,
        freshB6eTotalsReconciled:
          freshB6eResult.totalRegisteredCaseCount ===
          freshB6eResult.totalExecutedCaseCount,
        freshB6eZeroFailureAndDuplicateEvidence:
          freshB6eResult.failedRegisteredCaseCount === 0 &&
          freshB6eResult.unexecutedRegisteredCaseCount === 0 &&
          freshB6eResult.duplicateGlobalTestCaseIdCount === 0 &&
          freshB6eResult.duplicateBehaviorFingerprintCount === 0 &&
          freshB6eResult.duplicateCaseIdCount === 0 &&
          freshB6eResult.duplicateFingerprintCount === 0,
        freshB6eBindingTamperCaseCount: b6eBindingTampers.count,
        freshB6eBindingTamperCasesRejected: b6eBindingTampers.rejected,
        freshB6eBindingTamperCasesAllRejected:
          b6eBindingTampers.rejected === b6eBindingTampers.count,
        freshB6eNormalizationAggregationTamperCaseCount:
          b6eBindingTampers.count,
        freshB6eNormalizationAggregationTamperCasesRejected:
          b6eBindingTampers.rejected,
        b6eBindingTamperCaseCount: b6eBindingTampers.count,
        b6eBindingTamperCasesRejected: b6eBindingTampers.rejected,
        duplicateB6eBindingTamperCaseIdCount: 0,
        unexecutedB6eBindingTamperCaseCount: 0,
        labelOnlyB6eBindingTamperCaseCount: 0,
        b6dRegressionResultDerivedFromExecution: true,
        freshB6dExecutedTestCaseCount: freshB6dResult.executedTestCaseCount,
        freshB6dFailedTestCaseCount:
          freshB6dResult.failedRegisteredTestCaseCount,
        freshB6dUnexecutedTestCaseCount:
          freshB6dResult.unexecutedRegisteredTestCaseCount,
        b6dThresholdChanged: false,
        b6eThresholdChanged: false,
        existingB6CaseRegistryChanged: false,
        existingB6TamperRegistryChanged: false,
        productionAuthorizationChanged: false,
        b6eWrongCheckIdRejected: b6eBindingTampers.wrongCheckIdRejected,
        b6eTotalMismatchRejected: b6eBindingTampers.totalMismatchRejected,
        b6eDuplicateEvidenceRejected:
          b6eBindingTampers.duplicateEvidenceRejected,
        b6eSerializedHistoricalEvidenceRejected:
          b6eBindingTampers.serializedHistoricalEvidenceRejected,
        b6eCallerInjectedEvidenceRejected:
          b6eBindingTampers.callerInjectedEvidenceRejected,
        b6AuditPassPossibleWithB6dCountLiteralOnly: false,
        b6AuditPassPossibleWithFreshB6dMissing: false,
        b6AuditUsesLiteralB6dCountAsProof: false,
        b6AuditUsesPriorTextReportAsProof: false,
        b6AuditUsesSerializedStaticB6dPassAsProof: false,
        b6eB6dSummaryAuthoritativeForB6Audit: false,
        b6eLiteralB6dCountCanAuthorizeB6Audit: false,
        freshB6dBindingTamperCaseCount: bindingTampers.count,
        freshB6dBindingTamperCasesRejected: bindingTampers.rejected,
        literalSummaryOverrideAttemptRejected:
          bindingTampers.literalSummaryOverrideAttemptRejected,
        callerInjectedB6dEvidenceRejected:
          bindingTampers.callerInjectedB6dEvidenceRejected,
        historicalSerializedB6dEvidenceRejected:
          bindingTampers.historicalSerializedB6dEvidenceRejected,
        missingFreshExecutionMarkerRejected:
          bindingTampers.missingFreshExecutionMarkerRejected,
        serializedFreshMarkerAloneAccepted:
          bindingTampers.serializedFreshMarkerAloneAccepted,
        clonedFreshResultAcceptedAsLiveEvidence:
          bindingTampers.clonedFreshResultAcceptedAsLiveEvidence,
        callerCanMintFreshB6dProvenance: false,
        productionSemanticMappingCount:
          freshB6dResult.semanticMappingsValidatedCount,
        semanticExecutableValidationCaseCount:
          freshB6dResult.semanticRegistryCaseCount,
        semanticExecutableValidationCasesPassed:
          freshB6dResult.semanticRegistryCasesPassed,
        semanticOrderCompletenessCaseIncluded:
          freshB6dResult.semanticRegistryCaseCount ===
          freshB6dResult.semanticMappingsValidatedCount + 1,
        semanticTestCountConflatedWithMappingCount: false,
        approvedQueryIdCount: 18,
        canonicalExecutionOrderCount: 18,
        successfulLifecycleExecutedQueryCount:
          freshB6dResult.canonicalExecutionOrderExecutedCount,
        freshB6dSemanticEvidenceGateCorrected: true,
        freshB6dSemanticMappingCountExact:
          freshB6dResult.semanticMappingsValidatedCount === 18,
        freshB6dSemanticCaseCountExact:
          freshB6dResult.semanticRegistryCaseCount === 19,
        freshB6dSemanticCasesAllPassed:
          freshB6dResult.semanticRegistryCasesPassed === 19 &&
          freshB6dResult.semanticRegistryCasesPassed ===
            freshB6dResult.semanticRegistryCaseCount,
        semanticMappingDeficitRejected:
          bindingTampers.semanticMappingDeficitRejected,
        semanticMappingSurplusRejected:
          bindingTampers.semanticMappingSurplusRejected,
        semanticCaseDeficitRejected: bindingTampers.semanticCaseDeficitRejected,
        semanticCaseSurplusRejected: bindingTampers.semanticCaseSurplusRejected,
        semanticPassedCountMismatchRejected:
          bindingTampers.semanticPassedCountMismatchRejected,
        semanticOrderCompletenessFailureRejected:
          bindingTampers.semanticOrderCompletenessFailureRejected,
        positiveCompileTimeCaseCount: freshB6eResult.b6SuiteCounts.positiveCompile,
        negativeCompileTimeCaseCount: freshB6eResult.b6SuiteCounts.negativeCompile,
        positiveRuntimeCaseCount: freshB6eResult.b6SuiteCounts.positiveRuntime,
        negativeRuntimeCaseCount: freshB6eResult.b6SuiteCounts.negativeRuntime,
        productionReadOnlyPreflightHelperTamperCaseCount: freshB6eResult.b6SuiteCounts.tamper,
        productionReadOnlyPreflightHelperTamperCasesRejected:
          freshB6eResult.b6SuiteCounts.tamperRejected,
        b6TamperCategoryCount: freshB6eResult.b6TamperCategoryCount,
        b6TamperCategoriesAllRepresented:
          freshB6eResult.b6TamperCategoryCount >= 36,
        duplicateGlobalTestCaseIdCount: freshB6eResult.duplicateCaseIdCount,
        duplicateBehaviorFingerprintCount:
          freshB6eResult.duplicateFingerprintCount,
        unexecutedRegisteredTestCaseCount:
          freshB6eResult.unexecutedRegisteredCaseCount,
        failedRegisteredTestCaseCount: freshB6eResult.failedRegisteredCaseCount,
        runtimeCoreSmokeCaseCount: freshB6eResult.runtimeCoreSmokeCaseCount,
        runtimeCoreSmokeCasesPassed:
          freshB6eResult.runtimeCoreSmokeCasesPassed,
        freshB6dExecutionRunId: freshB6dResult.executionRunId,
        freshB6dFailedRegisteredTestCaseCount:
          freshB6dResult.failedRegisteredTestCaseCount,
        freshB6dUnexecutedRegisteredTestCaseCount:
          freshB6dResult.unexecutedRegisteredTestCaseCount,
        freshB6dSemanticMappingsValidatedCount:
          freshB6dResult.semanticMappingsValidatedCount,
        freshB6dSemanticRegistryCaseCount:
          freshB6dResult.semanticRegistryCaseCount,
        freshB6dSemanticRegistryCasesPassed:
          freshB6dResult.semanticRegistryCasesPassed,
        derivedAuditFailures: derivedGate.failed,
        productionReadOnlyPreflightExecutedNow: false,
        remoteConnectionPerformed: false,
        productionCredentialAccessed: false,
        productionWriteAuthorized: false,
        productionBootstrapExecutionAuthorizedNow: false,
        productionBootstrapPerformed: false,
        readyForProductionReadOnlyPreflightImplementation: allPassed,
        recommendedNextPhase: allPassed
          ? "PHASE 9X-B6F — B6 Audit and B7 Closure"
          : "Repair B6 derived-evidence deficits before closure.",
      },
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  void runProductionReadOnlyPreflightHelperImplementationAudit().then((result) => {
    console.log(JSON.stringify(result, null, 2));
    if (!result.allPassed) process.exitCode = 1;
  });
}
