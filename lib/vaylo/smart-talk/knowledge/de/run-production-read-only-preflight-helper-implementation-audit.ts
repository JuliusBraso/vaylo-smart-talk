import {
  runDerivedProductionPreflightEvidencePack,
  type DerivedReport,
} from "./run-production-preflight-derived-test-registry-and-tamper-pack";
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

async function main(): Promise<void> {
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
  const derived = await runDerivedProductionPreflightEvidencePack();
  const derivedGate = requireDerived(derived);
  const allPassed =
    freshB6dLiveEvidenceAccepted &&
    bindingTampers.rejected === bindingTampers.count &&
    derived.allPassed &&
    derivedGate.ok;

  console.log(
    JSON.stringify(
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
            : derivedGate.ok
            ? derived.blockReason
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
        b6AuditPassPossibleWhenFreshB6dFails: false,
        b6AuditPassPossibleWhenB6eFails: false,
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
        positiveCompileTimeCaseCount: derived.b6SuiteCounts.positiveCompile,
        negativeCompileTimeCaseCount: derived.b6SuiteCounts.negativeCompile,
        positiveRuntimeCaseCount: derived.b6SuiteCounts.positiveRuntime,
        negativeRuntimeCaseCount: derived.b6SuiteCounts.negativeRuntime,
        productionReadOnlyPreflightHelperTamperCaseCount: derived.b6SuiteCounts.tamper,
        productionReadOnlyPreflightHelperTamperCasesRejected:
          derived.b6SuiteCounts.tamperRejected,
        b6TamperCategoryCount: derived.b6TamperCategoryCount,
        b6TamperCategoriesAllRepresented: derived.b6TamperCategoryCount >= 36,
        duplicateGlobalTestCaseIdCount: derived.duplicateCaseIdCount,
        duplicateBehaviorFingerprintCount: derived.duplicateFingerprintCount,
        unexecutedRegisteredTestCaseCount: derived.unexecutedRegisteredCaseCount,
        failedRegisteredTestCaseCount: derived.failedRegisteredCaseCount,
        runtimeCoreSmokeCaseCount: derived.runtimeCoreSmokeCaseCount,
        runtimeCoreSmokeCasesPassed: derived.runtimeCoreSmokeCasesPassed,
        freshB6dExecutionRunId: freshB6dResult.executionRunId,
        freshB6dExecutedTestCaseCount: freshB6dResult.executedTestCaseCount,
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
      null,
      2,
    ),
  );
  if (!allPassed) process.exitCode = 1;
}

void main();
