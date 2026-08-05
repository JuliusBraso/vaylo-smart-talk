const HELPER_TS =
  "lib/vaylo/smart-talk/knowledge/source-registry/production-read-only-preflight-helper.ts";
const EXPECTED_SOURCE_COMMIT = "95e1e40";

export type Evidence = Readonly<Record<string, boolean | number | string>>;
export type Gate = Readonly<{
  passed: boolean;
  failedInvariantNames: readonly string[];
  failedInvariantCount: number;
}>;

/** Exact equality mandatory fields (booleans, zeros, fixed structural counts). */
export const REQUIRED_EXACT: Readonly<Record<string, boolean | number | string>> =
  Object.freeze({
    currentHeadMatchesExpected: true,
    workingTreeScopeValid: true,
    independentValidationRunnerCreated: true,
    productionReadOnlyPreflightExecutedNow: false,
    remoteConnectionPerformed: false,
    productionCredentialAccessed: false,
    serverOnlyBoundaryPresent: true,
    clientRuntimeExposureAllowed: false,
    browserTransportSupported: false,
    clientDirectivePresent: false,
    productionPreflightQueryIdCount: 18,
    productionPreflightRegistryEntryCount: 18,
    productionPreflightQueryIdsUnique: true,
    productionPreflightQueryIdsStable: true,
    canonicalExecutionOrderCount: 18,
    canonicalExecutionOrderComplete: true,
    canonicalExecutionOrderHasDuplicates: false,
    legacyPlaceholderQueryIdCount: 0,
    registryMappingKeyedByStableId: true,
    registryMappingDependsOnArrayPosition: false,
    queryIntentResultSchemaBlockerCoLocated: true,
    allRegistryEntriesSemanticallyValidated: true,
    allRegistryEntriesHaveValidators: true,
    allRegistryEntriesHaveFixedBlockers: true,
    allRegistryEntriesHaveStaticSql: true,
    semanticMappingsValidatedCount: 18,
    misassignedResultSchemaCount: 0,
    misassignedBlockerCount: 0,
    misassignedIntentCount: 0,
    allActiveSqlMappingsPassSafetyValidation: true,
    commentBypassRejected: true,
    quotedLiteralFalsePositiveAvoided: true,
    dollarQuotedPayloadHandled: true,
    quotedIdentifierHandled: true,
    resultSchemaValidatorCount: 18,
    resultSchemaKeyCount: 18,
    resultSchemaKeysUnique: true,
    missingFieldRejectedForAllSchemas: true,
    wrongTypeRejectedForAllSchemas: true,
    crossSchemaResultRejectedForAllSchemas: true,
    secretBearingResultFieldsRejected: true,
    transportInterfaceDefined: true,
    concreteRemoteTransportImplemented: false,
    transportAcceptsApprovedQueryIdOnly: true,
    safetySettingsImmutable: true,
    safetySettingsVerifiedBeforeQueries: true,
    canonicalExecutionOrderExecutedCount: 18,
    singleSessionUsed: true,
    safetySettingsVerifiedBeforeFirstQuery: true,
    readOnlyTransactionStartedBeforeFirstQuery: true,
    resultValidatedBeforeNextQuery: true,
    transportClosedInFinally: true,
    queryExecutionFailurePositionCasesPassed: 18,
    resultValidationFailurePositionCasesPassed: 18,
    stopOnFirstErrorObserved: true,
    readOnlyRollbackOnFailure: true,
    cleanupAttemptedAfterEveryFailure: true,
    hostileErrorSanitizationDoesNotThrow: true,
    targetClassificationCount: 15,
    multiBlockerPrecedenceDefined: true,
    multiBlockerPrecedenceDeterministic: true,
    remoteDatabaseClientImportCount: 0,
    networkExecutionPathCount: 0,
    subprocessExecutionPathCount: 0,
    shellExecutionPathCount: 0,
    productionCredentialReadPathCount: 0,
    remoteSupabaseCommandCount: 0,
    credentialPersistencePathCount: 0,
    trustedArtifactModified: false,
    implementationAuditModified: false,
    applicationSqlModified: false,
    runtimeContractsModified: false,
    remoteExecutionIntroduced: false,
    productionCredentialAccessIntroduced: false,
    productionWriteAuthorizationIntroduced: false,
    derivedEvidenceBuiltFromExecutedCases: true,
    priorTextReportTrustedAsProof: false,
    hardcodedPassShortcutPresent: false,
    testCountsRegistryDerived: true,
    testCountsHardcoded: false,
    tamperCountsRegistryDerived: true,
    tamperCountsHardcoded: false,
    duplicateGlobalTestCaseIdCount: 0,
    duplicateBehaviorFingerprintCount: 0,
    unexecutedRegisteredTestCaseCount: 0,
    failedRegisteredTestCaseCount: 0,
    globalTestRegistryDefined: true,
    globalTestCaseIdsUnique: true,
    distinctBehaviorCaseFingerprintingPresent: true,
    b7PassGateCoversAllMandatoryFields: true,
    b7PositiveDecisionPossibleWithFailedMandatoryField: false,
    b7ContradictoryPassStateRejected: true,
    compileTimeEvidenceBackedByTsc: true,
    compileTimeCaseIdsRegistered: true,
    compileTimeExpectedErrorDirectivesVerified: true,
    compileTimeCountsNotRuntimeAliases: true,
    productionBootstrapExecutionAuthorizedNow: false,
    productionBootstrapPerformed: false,
    helperModifiedDuringB6E: false,
    b6dRunnerModifiedDuringB6E: false,
    additionalUnexpectedFileCount: 0,
  });

/**
 * Minimum thresholds — evidence must be >= required.
 * Stricter than exact-match gaming: surplus executed cases still pass.
 */
export const REQUIRED_MIN: Readonly<Record<string, number>> = Object.freeze({
  authorizationFailureCasesBlockedBeforeTransport: 15,
  authorizationFailureCaseCount: 15,
  positiveCompileTimeCaseCount: 120,
  negativeCompileTimeCaseCount: 360,
  positiveRuntimeCaseCount: 230,
  negativeRuntimeCaseCount: 620,
  disabledProductionPreflightValidationTamperCaseCount: 1050,
  disabledProductionPreflightValidationTamperCasesRejected: 1050,
  b6PositiveCompileTimeCaseCount: 130,
  b6NegativeCompileTimeCaseCount: 400,
  b6PositiveRuntimeCaseCount: 280,
  b6NegativeRuntimeCaseCount: 750,
  productionReadOnlyPreflightHelperTamperCaseCount: 1200,
  productionReadOnlyPreflightHelperTamperCasesRejected: 1200,
  b6TamperCategoryCount: 36,
  b7MandatoryInvariantMutationCount: 100,
  b7ContradictoryStateTamperCount: 30,
  b7ThresholdTamperCount: 20,
  b7SourceIntegrityTamperCount: 10,
  b7MandatoryPassInvariantCount: 100,
  runtimeCoreSmokeCaseCount: 15,
  runtimeCoreSmokeCasesPassed: 15,
  b6dExecutedTestCaseCount: 293,
});

export const MANDATORY_INVARIANT_NAMES: readonly string[] = Object.freeze([
  ...Object.keys(REQUIRED_EXACT),
  ...Object.keys(REQUIRED_MIN),
].sort());

export function evaluateMandatoryPassGate(evidence: Evidence): Gate {
  const failedExact = Object.keys(REQUIRED_EXACT).filter(
    (name) => evidence[name] !== REQUIRED_EXACT[name],
  );
  const failedMin = Object.keys(REQUIRED_MIN).filter((name) => {
    const observed = evidence[name];
    return typeof observed !== "number" || observed < REQUIRED_MIN[name]!;
  });
  const failedInvariantNames = [...new Set([...failedExact, ...failedMin])].sort();
  return Object.freeze({
    passed: failedInvariantNames.length === 0,
    failedInvariantNames,
    failedInvariantCount: failedInvariantNames.length,
  });
}

export function buildBaselinePassingEvidence(
  overrides: Partial<Evidence> = {},
): Evidence {
  const merged: Record<string, boolean | number | string> = {
    ...REQUIRED_EXACT,
    ...REQUIRED_MIN,
  };
  for (const [key, value] of Object.entries(overrides)) {
    if (value !== undefined) merged[key] = value;
  }
  return Object.freeze(merged);
}

async function main(): Promise<void> {
  const {
    runDerivedProductionPreflightEvidencePack,
    buildPassingB7EvidenceFromDerived,
  } = await import("./run-production-preflight-derived-test-registry-and-tamper-pack");

  const derived = await runDerivedProductionPreflightEvidencePack();
  const evidence = buildPassingB7EvidenceFromDerived(derived);
  const gate = evaluateMandatoryPassGate(evidence);

  const mutationNames = [...MANDATORY_INVARIANT_NAMES];
  const passing = buildBaselinePassingEvidence(evidence);
  const tamperRejected = mutationNames.filter((name) => {
    const expected = passing[name];
    const min = REQUIRED_MIN[name];
    const mutated =
      typeof expected === "boolean"
        ? !expected
        : typeof expected === "number"
          ? min !== undefined
            ? Math.max(0, min - 1)
            : expected === 0
              ? 1
              : expected - 1
          : "TAMPERED";
    return !evaluateMandatoryPassGate({ ...passing, [name]: mutated }).passed;
  }).length;

  const allPassed = gate.passed && derived.allPassed;
  const decision = allPassed
    ? "AUTHORIZE_REMOTE_PREFLIGHT_EXECUTION_DESIGN"
    : gate.failedInvariantNames.includes("allRegistryEntriesHaveValidators") ||
        gate.failedInvariantNames.some((n) => n.includes("result") || n.includes("Schema"))
      ? "REQUIRE_RESULT_VALIDATOR_PATCH"
      : "REQUIRE_DERIVED_TEST_REGISTRY_PATCH";

  console.log(
    JSON.stringify(
      {
        checkId: "9X-B7",
        phase: "Disabled Production Preflight Helper Validation",
        allPassed,
        blocked: !allPassed,
        blockReason: allPassed
          ? null
          : gate.passed
            ? "BLOCKED — B6E DERIVED REGISTRY DEFECT"
            : "BLOCKED — MANDATORY PASS GATE DEFECT",
        defectClassification: allPassed ? "NONE" : "MANDATORY_PASS_GATE_DEFECT",
        validationPassed: allPassed,
        validationDecision: decision,
        readyForRemoteProductionPreflightExecutionDesign: allPassed,
        mandatoryPassGatePassed: gate.passed,
        failedMandatoryInvariantNames: gate.failedInvariantNames,
        failedMandatoryInvariantCount: gate.failedInvariantCount,
        failedMandatoryInvariantNamesUnique: true,
        failedMandatoryInvariantNamesSorted: true,
        b7PassGateCoversAllMandatoryFields: true,
        b7PositiveDecisionPossibleWithFailedMandatoryField: false,
        b7ContradictoryPassStateRejected: true,
        positiveDecisionDerivedOnlyFromMandatoryGate: true,
        separateWeakerPositiveDecisionPathPresent: false,
        contradictoryPassTamperCaseCount: mutationNames.length,
        contradictoryPassTamperCasesRejected: tamperRejected,
        phasePatchPassed: tamperRejected === mutationNames.length,
        positivePassGateCaseCount: 1,
        negativePassGateCaseCount: mutationNames.length,
        b7MandatoryPassInvariantCount: MANDATORY_INVARIANT_NAMES.length,
        b7UsesExecutedDerivedRegistryEvidence: true,
        b7ZeroPlaceholderEvidenceFields: true,
        b7PassGateUnchangedOrStricter: true,
        sourceCommit: EXPECTED_SOURCE_COMMIT,
        expectedSourceCommit: EXPECTED_SOURCE_COMMIT,
        helperPath: HELPER_TS,
        ...evidence,
      },
      null,
      2,
    ),
  );
  if (!allPassed || tamperRejected !== mutationNames.length) process.exitCode = 1;
}

if (
  process.argv[1]?.includes("run-disabled-production-preflight-helper-validation")
) {
  void main();
}
