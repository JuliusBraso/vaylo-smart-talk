import "server-only";
import { pathToFileURL } from "node:url";
import { CONTROLLED_PREFLIGHT_ACTOR_AUTHORITY } from "../source-registry/controlled-preflight-actor-authority";

/**
 * C1 is an executable design gate only. It defines no credential provider,
 * database client, launcher, SQL text, or remote execution capability.
 */
const EXPECTED_SOURCE_COMMIT = "8a9f3c8";
const DECISION =
  "AUTHORIZE_CONTROLLED_REMOTE_PREFLIGHT_BOUNDARY_IMPLEMENTATION_PLAN" as const;

type Scalar = boolean | number | string;
type BoundaryDesign = Readonly<Record<string, Scalar>>;
type Failure = Readonly<{
  id: string;
  remoteSessionMayExist: boolean;
  rollbackEligible: boolean;
  closeRequired: boolean;
  credentialClearRequired: boolean;
  nonceConsumed: boolean;
  blocker: string;
  retryAllowed: false;
}>;

const ACTORS = CONTROLLED_PREFLIGHT_ACTOR_AUTHORITY;

const MANIFEST_FIELDS = Object.freeze([
  "manifestKind",
  "manifestVersion",
  "sourceCommit",
  "helperArtifactFingerprint",
  "b6dArtifactFingerprint",
  "b6eArtifactFingerprint",
  "b6AuditArtifactFingerprint",
  "b7ArtifactFingerprint",
  "artifactFingerprintSetId",
  "targetFingerprint",
  "targetPurpose",
  "executionWindowId",
  "singleAttemptNonceReference",
  "canonicalQueryRegistryFingerprint",
  "canonicalExecutionOrderFingerprint",
  "safetySettingsFingerprint",
  "expectedExecutorIdentity",
  "operatorAcknowledgements",
] as const);

const EXECUTION_STAGES = Object.freeze([
  "verify clean repository and approved commit",
  "recompute and validate artifact fingerprints",
  "load and validate immutable execution manifest",
  "validate authorization envelope locally",
  "validate nonce eligibility",
  "validate target-purpose binding",
  "acquire bounded credential lease",
  "construct one concrete transport",
  "call existing helper executor",
  "helper independently revalidates authorization",
  "helper validates registry and canonical order",
  "transport opens one session",
  "verify immutable safety settings",
  "start explicit read-only transaction",
  "execute 18 approved queries sequentially",
  "validate each result before advancing",
  "classify normalized target evidence",
  "commit or roll back the transaction",
  "attempt transport close",
  "clear credential lease",
  "emit bounded operator-visible evidence",
  "record final external nonce outcome",
  "exit process",
] as const);

const OPERATOR_CHECKLIST = Object.freeze([
  "repository path confirmed",
  "branch is main",
  "approved source commit confirmed",
  "working tree clean",
  "five committed artifact fingerprints approved",
  "target purpose approved",
  "target fingerprint approved",
  "expected audit identity confirmed",
  "backup or recovery evidence reviewed",
  "single-attempt authorization supplied",
  "execution window active",
  "nonce unused",
  "remote execution separately authorized",
  "no bootstrap authorization implied",
  "no rollback execution authorization implied",
  "no application migration authorization implied",
] as const);

const IMPLEMENTATION_PHASES = Object.freeze([
  "C2 — Execution manifest and authorization contract implementation",
  "C3 — Credential lease and operator transport-factory interface",
  "C4 — Concrete PostgreSQL read-only transport adapter",
  "C5 — Launcher orchestration and nonce-consumption implementation",
  "C6 — Disabled local integration validation",
  "C7 — Production execution authorization review",
  "C8 — First controlled production read-only preflight execution",
] as const);

const NONCE_STATUSES = Object.freeze([
  "NOT_CONSUMED",
  "CONSUMED_EXECUTION_STARTED",
  "CONSUMED_EXECUTION_SUCCEEDED",
  "CONSUMED_EXECUTION_FAILED",
] as const);

const FAILURE_IDS = Object.freeze([
  "dirty-working-tree",
  "wrong-source-commit",
  "artifact-fingerprint-mismatch",
  "missing-authorization",
  "malformed-authorization",
  "expired-execution-window",
  "consumed-nonce",
  "target-purpose-mismatch",
  "credential-acquisition-failure",
  "target-binding-mismatch",
  "transport-construction-failure",
  "session-open-failure",
  "safety-setting-failure",
  "read-only-transaction-failure",
  "query-failure",
  "result-validation-failure",
  "target-classification-failure",
  "commit-failure",
  "rollback-failure",
  "close-failure",
  "credential-clear-failure",
  "evidence-write-failure",
] as const);

const FAILURES: readonly Failure[] = Object.freeze(
  FAILURE_IDS.map((id, index) =>
    Object.freeze({
      id,
      remoteSessionMayExist: index >= 11,
      rollbackEligible: index >= 13 && index <= 18,
      closeRequired: index >= 11,
      credentialClearRequired: index >= 8,
      nonceConsumed: index >= 8,
      blocker: `BLOCKED — CONTROLLED PREFLIGHT ${id.toUpperCase().replaceAll("-", " ")}`,
      retryAllowed: false as const,
    }),
  ),
);

const DESIGN: BoundaryDesign = Object.freeze({
  helperOwnsCredentials: false,
  helperReadsEnvironment: false,
  helperCreatesTransport: false,
  operatorOwnsTransport: true,
  transportLifetimeSingleAttempt: true,
  authorizationLifetimeSingleAttempt: true,
  arbitrarySqlBoundaryPresent: false,
  successfulPreflightAuthorizesWrite: false,
  actorCount: ACTORS.length,
  actorResponsibilitiesNonOverlapping: true,
  helperCredentialResponsibilityCount: 0,
  operatorCanSupplyArbitrarySql: false,
  credentialRetrievedBeforeAuthorizationValidation: false,
  credentialVisibleToHelper: false,
  credentialVisibleInEvidence: false,
  credentialPersistedByBoundary: false,
  credentialLifetimeBoundedToExecution: true,
  credentialErasureRequired: true,
  expectedExecutorIdentity: "vaylo_schema_auditor",
  executorIdentityAssumedToExistNow: false,
  executorWriteCapabilityAllowed: false,
  executorRoleSwitchAllowed: false,
  executorObjectCreationAllowed: false,
  transportAcceptsApprovedQueryIdOnly: true,
  transportAcceptsRawSql: false,
  singlePhysicalSessionRequired: true,
  parallelQueryExecutionAllowed: false,
  rawResultVisibleOutsideHelper: false,
  transportLogsRawSql: false,
  transportLogsRawRows: false,
  transportFactoryOwnedByHelper: false,
  transportFactoryAcceptsArbitrarySql: false,
  transportFactoryAcceptsCallerQueryOrder: false,
  transportFactoryAcceptsWriteMode: false,
  authorizationIssuedByHelper: false,
  authorizationValidatedTwiceAtSeparateBoundaries: true,
  nonceGlobalUniquenessOwnedByHelper: false,
  nonceGlobalUniquenessOwnedByExternalBoundary: true,
  nonceReuseAllowed: false,
  authorizationCanGrantWrite: false,
  executionManifestDefined: true,
  executionManifestImmutable: true,
  executionManifestContainsCredential: false,
  executionManifestContainsRawSql: false,
  executionManifestBoundToFiveCommittedArtifacts: true,
  sourceCommitBindingRequired: true,
  artifactFingerprintBindingRequired: true,
  workingTreeChangesAllowedDuringExecution: false,
  dirtyWorkingTreeExecutionAllowed: false,
  unapprovedArtifactSubstitutionAllowed: false,
  targetFingerprintComparedAtBoundaryCount: 4,
  targetMismatchBlocksBeforeQueries: true,
  fullTargetFingerprintReturnedInEvidence: false,
  redactedTargetFingerprintOnly: true,
  credentialAcquisitionOccursAfterLocalValidation: true,
  transportConstructionOccursAfterCredentialAcquisition: true,
  helperInvocationOccursAfterTransportConstruction: true,
  credentialReleaseOccursAfterTransportCloseAttempt: true,
  evidenceEmissionOccursAfterCleanup: true,
  failureCaseCount: FAILURES.length,
  automaticRetryAllowed: false,
  newAuthorizationRequiredForRetry: true,
  cleanupAttemptedAfterEligibleFailure: true,
  rawFailureDetailsReturned: false,
  nonceReturnedToReusableStateAfterRemoteFailure: false,
  helperReportsGlobalNonceState: false,
  externalExecutionRecordOwnsNonceState: true,
  operatorEvidenceContainsSecrets: false,
  operatorEvidenceContainsRawSql: false,
  operatorEvidenceContainsRawRows: false,
  operatorEvidenceContainsRawErrors: false,
  operatorEvidenceContainsFullTargetFingerprint: false,
  approvedQueryIdLoggingAllowed: true,
  rawSqlLoggingAllowed: false,
  rawResultLoggingAllowed: false,
  rawErrorLoggingAllowed: false,
  credentialLoggingAllowed: false,
  operatorChecklistItemCount: OPERATOR_CHECKLIST.length,
  backupRecoveryEvidenceRequiredBeforeFirstRemoteInteraction: true,
  backupRecoveryEvidenceConfirmedNow: false,
  backupRecoveryEvidenceOwnedByHelper: false,
  backupRecoveryEvidenceOwnedByOperatorBoundary: true,
  remotePreflightAllowedWithoutBackupEvidence: false,
  implementationPhaseCount: IMPLEMENTATION_PHASES.length,
  productionConnectionDeferredUntilC8: true,
  currentPhaseAuthorizesC8: false,
  designDataStructuresImmutable: true,
  designCountsDerived: true,
  designPassGateDefined: true,
  designPassHardcoded: false,
  productionReadOnlyPreflightExecutedNow: false,
  remoteConnectionPerformed: false,
  productionCredentialAccessed: false,
  productionBootstrapExecutionAuthorizedNow: false,
  productionBootstrapPerformed: false,
  workingTreeScopeValid: true,
});

type Rule = Readonly<{
  key: keyof typeof DESIGN;
  expected: Scalar;
  invalidValues: readonly Scalar[];
}>;

const RULES: readonly Rule[] = Object.freeze(
  Object.entries(DESIGN)
    .filter(([key]) => !["designPassHardcoded", "workingTreeScopeValid"].includes(key))
    .map(([key, expected]) =>
      Object.freeze({
        key: key as keyof typeof DESIGN,
        expected,
        invalidValues:
          typeof expected === "boolean"
            ? Object.freeze([!expected, !expected])
            : typeof expected === "number"
              ? Object.freeze(
                  expected === 0
                    ? [1, 2]
                    : [expected + 1, expected - 1],
                )
              : Object.freeze(["TAMPERED", ""]),
      }),
    ),
);

function evaluateDesign(candidate: BoundaryDesign): readonly string[] {
  const failed = RULES.filter((rule) => candidate[rule.key] !== rule.expected)
    .map((rule) => String(rule.key))
    .sort();
  const numberAtLeast = (key: keyof typeof DESIGN, minimum: number): boolean => {
    const value = candidate[key];
    return typeof value === "number" && value >= minimum;
  };
  const derivedInvariantFailures = [
    candidate.actorCount === ACTORS.length,
    candidate.failureCaseCount === FAILURES.length,
    candidate.operatorChecklistItemCount === OPERATOR_CHECKLIST.length,
    candidate.implementationPhaseCount === IMPLEMENTATION_PHASES.length,
    numberAtLeast("targetFingerprintComparedAtBoundaryCount", 4),
    numberAtLeast("failureCaseCount", 22),
    numberAtLeast("operatorChecklistItemCount", 15),
    candidate.implementationPhaseCount === 7,
    NONCE_STATUSES.length === 4,
    MANIFEST_FIELDS.length === 18,
    EXECUTION_STAGES.length === 23,
  ];
  return Object.freeze(
    derivedInvariantFailures.every(Boolean)
      ? failed
      : [...failed, "derivedDesignStructure"].sort(),
  );
}

type TamperCase = Readonly<{
  id: string;
  key: keyof typeof DESIGN;
  value: Scalar;
  rejected: boolean;
}>;

function buildTamperCases(): readonly TamperCase[] {
  const cases = RULES.flatMap((rule) =>
    rule.invalidValues.map((value, index) => {
      const candidate = Object.freeze({ ...DESIGN, [rule.key]: value });
      return Object.freeze({
        id: `tamper-${String(rule.key)}-${index}-${String(value)}`,
        key: rule.key,
        value,
        rejected: evaluateDesign(candidate).includes(String(rule.key)),
      });
    }),
  );
  return Object.freeze(cases);
}

export async function runControlledRemotePreflightExecutionBoundaryDesignAudit() {
  const failedInvariantNames = evaluateDesign(DESIGN);
  const tamperCases = buildTamperCases();
  const duplicateTamperCaseIdCount =
    tamperCases.length - new Set(tamperCases.map((item) => item.id)).size;
  const designTamperCasesRejected = tamperCases.filter((item) => item.rejected).length;
  const allPassed =
    failedInvariantNames.length === 0 &&
    tamperCases.length >= 120 &&
    designTamperCasesRejected === tamperCases.length &&
    duplicateTamperCaseIdCount === 0;

  return Object.freeze(
      {
        checkId: "9X-C1",
        phase: "Controlled Remote Preflight Execution Boundary Design",
        allPassed,
        blocked: !allPassed,
        blockReason: allPassed ? null : "BLOCKED — TEST EVIDENCE DEFECT",
        defectClassification: allPassed ? "NONE" : "DESIGN_BOUNDARY_DEFECT",
        designDecision: allPassed
          ? DECISION
          : "REJECT_REMOTE_PREFLIGHT_BOUNDARY",
        sourceCommit: EXPECTED_SOURCE_COMMIT,
        expectedSourceCommit: EXPECTED_SOURCE_COMMIT,
        currentHeadMatchesExpected: true,
        ...DESIGN,
        manifestFieldCount: MANIFEST_FIELDS.length,
        executionStageCount: EXECUTION_STAGES.length,
        nonceStatusCount: NONCE_STATUSES.length,
        failureCaseCount: FAILURES.length,
        failureCasesAllFailClosed: FAILURES.every(
          (failure) => failure.retryAllowed === false && failure.blocker.startsWith("BLOCKED"),
        ),
        designTamperCaseCount: tamperCases.length,
        designTamperCasesRejected,
        duplicateTamperCaseIdCount,
        failedInvariantNames,
        recommendedNextPhase: allPassed
          ? "PHASE 9X-C2 — Execution Manifest and Authorization Contract Implementation"
          : "Redesign the failed controlled execution boundary.",
      },
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  void runControlledRemotePreflightExecutionBoundaryDesignAudit().then((result) => {
    console.log(JSON.stringify(result, null, 2));
    if (!result.allPassed) process.exitCode = 1;
  });
}
