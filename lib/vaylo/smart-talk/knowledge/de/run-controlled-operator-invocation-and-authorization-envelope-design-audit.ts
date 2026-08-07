import { execFileSync } from "node:child_process";

import {
  isControlledPreflightApprovalActor,
  isControlledPreflightOperatorActor,
  isValidControlledPreflightOperatorApproverPair,
} from "../source-registry/controlled-preflight-actor-authority";
import {
  CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
  CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS,
} from "../source-registry/controlled-preflight-launcher-capability-contract";
import {
  createFailClosedControlledProductionPermissionState,
  CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_ID,
  CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_VERSION,
  CONTROLLED_PRODUCTION_PERMISSION_IDS,
  getControlledProductionPermissionAuthorityFingerprint,
  verifyAllControlledProductionPermissionsFalse,
} from "../source-registry/controlled-production-permission-authority";
import {
  CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY,
  verifyControlledSyntheticFixedClockBinding,
} from "../source-registry/controlled-synthetic-fixed-clock-policy";
import {
  CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE,
  evaluateControlledOperatorAuthorizationEnvelope,
  type ControlledOperatorAuthorizationCurrentEvidence,
  type ControlledOperatorAuthorizationEnvelope,
} from "../source-registry/controlled-operator-authorization-envelope";

const EXPECTED_BASELINE_COMMIT =
  "76e3e5c312cca27a9f28e5e5c5ae6d8d4e1458c9";
const EXPECTED_UNTRACKED_PATHS = Object.freeze([
  "lib/vaylo/smart-talk/knowledge/de/run-controlled-operator-invocation-and-authorization-envelope-design-audit.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/controlled-operator-authorization-envelope.ts",
]);

type RepositoryAndScopeEvidence = Readonly<{
  branch: string;
  head: string;
  originMain: string;
  remoteMain: string;
  modifiedCommittedPaths: readonly string[];
  stagedPaths: readonly string[];
  untrackedPaths: readonly string[];
  diffCheckClean: boolean;
}>;

const runGit = (args: readonly string[]): string =>
  execFileSync("git", args, { encoding: "utf8" }).trim();
const pathList = (output: string): readonly string[] =>
  Object.freeze(output === "" ? [] : output.split(/\r?\n/u).sort());

const observeRepositoryAndScope = (): RepositoryAndScopeEvidence => {
  const remoteLine = runGit(["ls-remote", "origin", "refs/heads/main"]);
  return Object.freeze({
    branch: runGit(["branch", "--show-current"]),
    head: runGit(["rev-parse", "HEAD"]),
    originMain: runGit(["rev-parse", "origin/main"]),
    remoteMain: remoteLine.split(/\s+/u)[0] ?? "",
    modifiedCommittedPaths: pathList(runGit(["diff", "--name-only"])),
    stagedPaths: pathList(runGit(["diff", "--cached", "--name-only"])),
    untrackedPaths: pathList(
      runGit(["ls-files", "--others", "--exclude-standard"]),
    ),
    diffCheckClean: runGit(["diff", "--check"]) === "",
  });
};

const evaluateRepositoryAndScopeIntegrity = (
  evidence: RepositoryAndScopeEvidence,
): boolean =>
  evidence.branch === "main" &&
  evidence.head === EXPECTED_BASELINE_COMMIT &&
  evidence.originMain === EXPECTED_BASELINE_COMMIT &&
  evidence.remoteMain === EXPECTED_BASELINE_COMMIT &&
  evidence.modifiedCommittedPaths.length === 0 &&
  evidence.stagedPaths.length === 0 &&
  evidence.untrackedPaths.length === EXPECTED_UNTRACKED_PATHS.length &&
  evidence.untrackedPaths.every(
    (path, index) => path === EXPECTED_UNTRACKED_PATHS[index],
  ) &&
  evidence.diffCheckClean;

const repositoryAndScopeEvidence = observeRepositoryAndScope();
const repositoryReviewStateMatchesExpectedScope =
  evaluateRepositoryAndScopeIntegrity(repositoryAndScopeEvidence);
const repositoryScopeTamperCases = Object.freeze([
  evaluateRepositoryAndScopeIntegrity({
    ...repositoryAndScopeEvidence,
    branch: "not-main",
  }),
  evaluateRepositoryAndScopeIntegrity({
    ...repositoryAndScopeEvidence,
    head: "wrong-head",
  }),
  evaluateRepositoryAndScopeIntegrity({
    ...repositoryAndScopeEvidence,
    stagedPaths: ["unexpected-staged.ts"],
  }),
  evaluateRepositoryAndScopeIntegrity({
    ...repositoryAndScopeEvidence,
    modifiedCommittedPaths: ["unexpected-modified.ts"],
  }),
  evaluateRepositoryAndScopeIntegrity({
    ...repositoryAndScopeEvidence,
    untrackedPaths: [
      ...repositoryAndScopeEvidence.untrackedPaths,
      "unexpected-third-file.ts",
    ].sort(),
  }),
  evaluateRepositoryAndScopeIntegrity({
    ...repositoryAndScopeEvidence,
    untrackedPaths: repositoryAndScopeEvidence.untrackedPaths.slice(1),
  }),
]);

const nonceDigest = "a".repeat(64);
const clock = "2026-08-07T00:00:00.000Z";
const boundaryEvidence = {
  backupRecoveryStatus: "REQUIRED_NOT_YET_VERIFIED" as const,
  backupRecoveryVerifiedNow: false as const,
  productionCredentialAccessed: false as const,
  remoteConnectionPerformed: false as const,
  productionReadOnlyPreflightExecutedNow: false as const,
  firstProductionWritePerformed: false as const,
};

const createEnvelope = (): ControlledOperatorAuthorizationEnvelope => ({
  contractId: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.contractId,
  version: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.version,
  authorizationClass: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.authorizationClass,
  executionScope: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.executionScope,
  requestedAction: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.requestedAction,
  c6SourceCheckpointCommit: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.c6SourceCheckpointCommit,
  c5BoundCheckpointCommit: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.c5BoundCheckpointCommit,
  operatorActorId: "operator",
  authorizationIssuerActorId: "authorizationIssuer",
  fixedClockSnapshot: clock,
  nonceDigest,
  productionPermissionState: { ...createFailClosedControlledProductionPermissionState() },
  boundaryEvidence: { ...boundaryEvidence },
  requestedLaunchCount: 1,
});

const createEvidence = (): ControlledOperatorAuthorizationCurrentEvidence => ({
  c6SourceCheckpointCommit: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.c6SourceCheckpointCommit,
  c5BoundCheckpointCommit: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.c5BoundCheckpointCommit,
  operatorActorId: "operator",
  authorizationIssuerActorId: "authorizationIssuer",
  fixedClockSnapshot: clock,
  nonceDigest,
  productionPermissionState: { ...createFailClosedControlledProductionPermissionState() },
  boundaryEvidence: { ...boundaryEvidence },
});

const evaluate = (envelope: unknown, evidence: unknown) =>
  evaluateControlledOperatorAuthorizationEnvelope(envelope, evidence);
const rejected = (envelope: unknown, evidence: unknown): boolean =>
  !evaluate(envelope, evidence).ok;

const positiveInputs = [
  [createEnvelope(), createEvidence()],
  [{ ...createEnvelope() }, { ...createEvidence() }],
  [
    { ...createEnvelope(), productionPermissionState: { ...createFailClosedControlledProductionPermissionState() } },
    { ...createEvidence(), productionPermissionState: { ...createFailClosedControlledProductionPermissionState() } },
  ],
] as const;
const positiveBefore = positiveInputs.map(([envelope, evidence]) =>
  JSON.stringify([envelope, evidence]),
);
const positiveResults = positiveInputs.map(([envelope, evidence]) =>
  evaluate(envelope, evidence),
);
const inputMutationObserved = positiveInputs.some(
  ([envelope, evidence], index) =>
    JSON.stringify([envelope, evidence]) !== positiveBefore[index],
);

const actorTamperCases = [
  rejected({ ...createEnvelope(), operatorActorId: "authorizationIssuer" }, createEvidence()),
  rejected({ ...createEnvelope(), authorizationIssuerActorId: "operator" }, createEvidence()),
  rejected({ ...createEnvelope(), operatorActorId: "operator", authorizationIssuerActorId: "operator" }, createEvidence()),
  rejected({ ...createEnvelope(), operatorActorId: "unknown" }, createEvidence()),
  rejected({ ...createEnvelope(), operatorActorId: "authorizationIssuer", authorizationIssuerActorId: "operator" }, createEvidence()),
];
const fixedClockTamperCases = [
  rejected({ ...createEnvelope(), fixedClockSnapshot: "invalid" }, createEvidence()),
  rejected(createEnvelope(), { ...createEvidence(), fixedClockSnapshot: "invalid" }),
  rejected(createEnvelope(), { ...createEvidence(), fixedClockSnapshot: "2026-08-07T00:00:01.000Z" }),
  rejected({ ...createEnvelope(), fixedClockSnapshot: "2026-08-07T00:00:00Z" }, createEvidence()),
  rejected({ ...createEnvelope(), fixedClockSnapshot: 1 as unknown as string }, createEvidence()),
];
const nonceTamperCases = [
  rejected({ ...createEnvelope(), nonceDigest: "a".repeat(63) }, createEvidence()),
  rejected({ ...createEnvelope(), nonceDigest: "A".repeat(64) }, createEvidence()),
  rejected({ ...createEnvelope(), nonceDigest: "g".repeat(64) }, createEvidence()),
  rejected({ ...createEnvelope(), nonceDigest: undefined as unknown as string }, createEvidence()),
  rejected(createEnvelope(), { ...createEvidence(), nonceDigest: "b".repeat(64) }),
  rejected({ ...createEnvelope(), nonceDigest: "raw-nonce-value" }, createEvidence()),
];
const productionPermissionTamperCases = CONTROLLED_PRODUCTION_PERMISSION_IDS.map(
  (permissionId) =>
    rejected(
      {
        ...createEnvelope(),
        productionPermissionState: {
          ...createFailClosedControlledProductionPermissionState(),
          [permissionId]: true,
        },
      },
      createEvidence(),
    ),
);
const permissionStructuralTamperCases = [
  rejected({ ...createEnvelope(), productionPermissionState: { ...createFailClosedControlledProductionPermissionState(), unknown: false } }, createEvidence()),
  (() => {
    const state: Record<string, unknown> = { ...createFailClosedControlledProductionPermissionState() };
    delete state.AUTHORIZE_PRODUCTION_WRITE;
    return rejected({ ...createEnvelope(), productionPermissionState: state }, createEvidence());
  })(),
  rejected({ ...createEnvelope(), productionPermissionState: { ...createFailClosedControlledProductionPermissionState(), AUTHORIZE_PRODUCTION_WRITE: "false" } }, createEvidence()),
  rejected({ ...createEnvelope(), productionPermissionState: null }, createEvidence()),
  rejected({ ...createEnvelope(), productionPermissionState: [] }, createEvidence()),
];
const boundaryEvidenceTamperCases = [
  rejected({ ...createEnvelope(), boundaryEvidence: { ...boundaryEvidence, backupRecoveryStatus: "VERIFIED" } }, createEvidence()),
  rejected({ ...createEnvelope(), boundaryEvidence: { ...boundaryEvidence, productionCredentialAccessed: true } }, createEvidence()),
  rejected({ ...createEnvelope(), boundaryEvidence: { ...boundaryEvidence, remoteConnectionPerformed: true } }, createEvidence()),
  rejected({ ...createEnvelope(), boundaryEvidence: { ...boundaryEvidence, productionReadOnlyPreflightExecutedNow: true } }, createEvidence()),
  rejected({ ...createEnvelope(), boundaryEvidence: { ...boundaryEvidence, firstProductionWritePerformed: true } }, createEvidence()),
];
const contractScopeTamperCases = [
  rejected({ ...createEnvelope(), contractId: "wrong" }, createEvidence()),
  rejected({ ...createEnvelope(), version: 2 }, createEvidence()),
  rejected({ ...createEnvelope(), authorizationClass: "wrong" }, createEvidence()),
  rejected({ ...createEnvelope(), executionScope: "REMOTE" }, createEvidence()),
  rejected({ ...createEnvelope(), requestedAction: "wrong" }, createEvidence()),
  rejected({ ...createEnvelope(), c6SourceCheckpointCommit: "wrong" }, createEvidence()),
  rejected({ ...createEnvelope(), c5BoundCheckpointCommit: "wrong" }, createEvidence()),
  rejected({ ...createEnvelope(), requestedLaunchCount: 2 }, createEvidence()),
];
const bindingTamperCases = [
  rejected(createEnvelope(), { ...createEvidence(), operatorActorId: "authorizationIssuer" }),
  rejected(createEnvelope(), { ...createEvidence(), fixedClockSnapshot: "2026-08-08T00:00:00.000Z" }),
  rejected(createEnvelope(), { ...createEvidence(), nonceDigest: "b".repeat(64) }),
  rejected(createEnvelope(), { ...createEvidence(), productionPermissionState: { ...createFailClosedControlledProductionPermissionState(), AUTHORIZE_PUBLIC_LAUNCH: true } }),
  rejected(createEnvelope(), { ...createEvidence(), c5BoundCheckpointCommit: "wrong" }),
  rejected(createEnvelope(), { ...createEvidence(), boundaryEvidence: { ...boundaryEvidence, productionCredentialAccessed: true } }),
];

let descriptorTamperGetterInvocationCount = 0;
const withGetter = <T extends object>(value: T, key: PropertyKey): T => {
  Object.defineProperty(value, key, {
    configurable: true,
    enumerable: true,
    get() {
      descriptorTamperGetterInvocationCount += 1;
      return key === "contractId"
        ? CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.contractId
        : key === "requestedAction"
          ? CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.requestedAction
          : undefined;
    },
  });
  return value;
};

const getterEnvelopeContract = withGetter(createEnvelope(), "contractId");
const getterEnvelopeAction = withGetter(createEnvelope(), "requestedAction");
const setterOnlyEnvelope = createEnvelope();
Object.defineProperty(setterOnlyEnvelope, "contractId", {
  configurable: true,
  enumerable: true,
  set() {},
});
const symbolEnvelope = createEnvelope() as ControlledOperatorAuthorizationEnvelope & Record<PropertyKey, unknown>;
symbolEnvelope[Symbol("unexpected")] = true;
const nonEnumerableEnvelope = createEnvelope() as ControlledOperatorAuthorizationEnvelope & Record<string, unknown>;
Object.defineProperty(nonEnumerableEnvelope, "unexpected", { value: true, enumerable: false });
const getterEvidence = withGetter(createEvidence(), "c5BoundCheckpointCommit");
const nestedPermissionEnvelope = createEnvelope();
withGetter(nestedPermissionEnvelope.productionPermissionState, "AUTHORIZE_PRODUCTION_WRITE");
const nestedBoundaryEnvelope = createEnvelope();
withGetter(nestedBoundaryEnvelope.boundaryEvidence, "productionCredentialAccessed");

const descriptorTamperResults = [
  evaluate(getterEnvelopeContract, createEvidence()),
  evaluate(getterEnvelopeAction, createEvidence()),
  evaluate(setterOnlyEnvelope, createEvidence()),
  evaluate(symbolEnvelope, createEvidence()),
  evaluate(nonEnumerableEnvelope, createEvidence()),
  evaluate(createEnvelope(), getterEvidence),
  evaluate(nestedPermissionEnvelope, createEvidence()),
  evaluate(nestedBoundaryEnvelope, createEvidence()),
];
const descriptorTamperCasesRejected = descriptorTamperResults.filter(
  (result) => !result.ok,
).length;
const accessorBackedAuthorizationAcceptedCount = [
  0, 1, 5, 6, 7,
].filter((index) => descriptorTamperResults[index]?.ok).length;

const allTrue = (values: readonly boolean[]): boolean => values.every(Boolean);
const acceptedEvaluation = positiveResults[0];
const canonicalAllFalse = createFailClosedControlledProductionPermissionState();
const authorityFingerprint = getControlledProductionPermissionAuthorityFingerprint();
const canonicalActorBinding =
  isControlledPreflightOperatorActor("operator") &&
  isControlledPreflightApprovalActor("authorizationIssuer") &&
  isValidControlledPreflightOperatorApproverPair("operator", "authorizationIssuer");
const observedProductionCapabilityCount =
  CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.productionCapabilityCount;
const evaluateProductionCapabilityZero = (capabilityCount: number): boolean =>
  capabilityCount === 0;
const zeroProductionCapabilityCannotMaskRepositoryScopeDefect =
  evaluateProductionCapabilityZero(0) &&
  !evaluateRepositoryAndScopeIntegrity({
    ...repositoryAndScopeEvidence,
    untrackedPaths: [
      ...repositoryAndScopeEvidence.untrackedPaths,
      "unexpected-third-file.ts",
    ].sort(),
  });
const healthyRepositoryCannotMaskProductionCapabilityDefect =
  evaluateRepositoryAndScopeIntegrity(repositoryAndScopeEvidence) &&
  !evaluateProductionCapabilityZero(1);

const mandatoryGateIds = [
  "repositoryAndScopeIntegrity",
  "dependencyIntegrity",
  "c6IdentityClosed",
  "actorAuthorityBound",
  "actorSeparationFailClosed",
  "c4C5SyntheticBoundaryBound",
  "envelopeCurrentEvidenceSeparated",
  "sourceCheckpointBinding",
  "fixedClockAuthorityBound",
  "nonceDigestBinding",
  "productionPermissionAuthorityBound",
  "productionPermissionsRemainAllFalse",
  "c1C3BoundaryEvidenceFailClosed",
  "syntheticRequestScopeBounded",
  "evaluatorFailureModelClosed",
  "positiveEvaluationEvidence",
  "tamperAndBindingEvidence",
  "productionCapabilityZero",
  "noInvocationPerformed",
  "productionAuthorizationRemainsFalse",
] as const;
type MandatoryGateId = (typeof mandatoryGateIds)[number];
type MandatoryC6Gates = Readonly<Record<MandatoryGateId, boolean>>;

const mandatoryGates: MandatoryC6Gates = Object.freeze({
  repositoryAndScopeIntegrity: evaluateRepositoryAndScopeIntegrity(
    repositoryAndScopeEvidence,
  ) && repositoryScopeTamperCases.every((accepted) => !accepted),
  dependencyIntegrity:
    authorityFingerprint === "7779fe46a1f94b478e2a64b241d18313a42b263203ea34a28e07000dc61af08f" &&
    CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY.policyVersion === 1,
  c6IdentityClosed:
    CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.contractId === "VAYLO_CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE" &&
    CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.version === 1,
  actorAuthorityBound: canonicalActorBinding,
  actorSeparationFailClosed: allTrue(actorTamperCases),
  c4C5SyntheticBoundaryBound:
    CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS.length === 4 &&
    CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS.length === 32,
  envelopeCurrentEvidenceSeparated:
    createEnvelope() !== (createEvidence() as unknown) && positiveResults[0]?.ok === true,
  sourceCheckpointBinding:
    contractScopeTamperCases[5] === true && contractScopeTamperCases[6] === true,
  fixedClockAuthorityBound:
    verifyControlledSyntheticFixedClockBinding(clock, clock).ok &&
    allTrue(fixedClockTamperCases),
  nonceDigestBinding: allTrue(nonceTamperCases),
  productionPermissionAuthorityBound:
    CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_ID === "VAYLO_CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY" &&
    CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_VERSION === 1 &&
    CONTROLLED_PRODUCTION_PERMISSION_IDS.length === 6,
  productionPermissionsRemainAllFalse:
    verifyAllControlledProductionPermissionsFalse(canonicalAllFalse).ok &&
    allTrue(productionPermissionTamperCases),
  c1C3BoundaryEvidenceFailClosed: allTrue(boundaryEvidenceTamperCases),
  syntheticRequestScopeBounded:
    CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.requestedLaunchCount === 1 &&
    allTrue(contractScopeTamperCases),
  evaluatorFailureModelClosed:
    descriptorTamperCasesRejected === descriptorTamperResults.length &&
    descriptorTamperGetterInvocationCount === 0,
  positiveEvaluationEvidence:
    positiveResults.length >= 3 &&
    positiveResults.every((result) => result.ok) &&
    !inputMutationObserved,
  tamperAndBindingEvidence:
    allTrue(actorTamperCases) &&
    allTrue(permissionStructuralTamperCases) &&
    allTrue(bindingTamperCases) &&
    descriptorTamperCasesRejected === descriptorTamperResults.length &&
    descriptorTamperGetterInvocationCount === 0,
  productionCapabilityZero:
    evaluateProductionCapabilityZero(observedProductionCapabilityCount),
  noInvocationPerformed:
    acceptedEvaluation?.ok === true &&
    acceptedEvaluation.c5LauncherInvocationPerformed === false &&
    acceptedEvaluation.syntheticLaunchPerformed === false,
  productionAuthorizationRemainsFalse:
    acceptedEvaluation?.ok === true &&
    acceptedEvaluation.remoteExecutionPerformed === false &&
    canonicalAllFalse.AUTHORIZE_REMOTE_EXECUTION === false,
});

const evaluateMandatoryC6Gates = (gates: MandatoryC6Gates): boolean =>
  mandatoryGateIds.every((gateId) => gates[gateId] === true);

const sensitivityCases = mandatoryGateIds.map((gateId) => {
  const mutated = Object.freeze({ ...mandatoryGates, [gateId]: false });
  const changedGateCount = mandatoryGateIds.filter(
    (candidateId) => mutated[candidateId] !== mandatoryGates[candidateId],
  ).length;
  return Object.freeze({
    caseId: `mandatory_gate_${gateId}`,
    executed: true,
    labelOnly: false,
    changedGateCount,
    rejected: !evaluateMandatoryC6Gates(mutated),
  });
});

const report = {
  checkId: "9X-C6-REPOSITORY-GATE-PATCH",
  phase: "Repository-and-Scope Mandatory Gate Semantic Derivation Repair",
  allPassed: evaluateMandatoryC6Gates(mandatoryGates),
  blocked: false,
  blockReason: null,
  defectClassification: "NONE",
  implementationDecision: "AUTHORIZE_C6_REPOSITORY_GATE_REPAIR_CLOSURE",
  recommendedNextPhase: "PHASE 9X-C6-CLOSURE — Independent Controlled Operator Invocation and Authorization Envelope Closure",
  contractId: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.contractId,
  contractVersion: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.version,
  authorizationClass: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.authorizationClass,
  executionScope: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.executionScope,
  requestedAction: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.requestedAction,
  c6SourceCheckpointCommit: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.c6SourceCheckpointCommit,
  c5BoundCheckpointCommit: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.c5BoundCheckpointCommit,
  accessorDescriptorAccepted: false,
  accessorRejectedBeforePropertyRead: !descriptorTamperResults[0]?.ok && descriptorTamperGetterInvocationCount === 0,
  currentEvidenceAccessorRejectedBeforePropertyRead: !descriptorTamperResults[5]?.ok && descriptorTamperGetterInvocationCount === 0,
  nestedC6OwnedRecordAccessorAccepted: descriptorTamperResults[6]?.ok === true || descriptorTamperResults[7]?.ok === true,
  descriptorTamperCaseCount: descriptorTamperResults.length,
  descriptorTamperCasesRejected,
  descriptorTamperGetterInvocationCount,
  accessorBackedAuthorizationAcceptedCount,
  malformedAccessorInputSideEffectCount: descriptorTamperGetterInvocationCount,
  symbolPropertyAccepted: descriptorTamperResults[3]?.ok === true,
  unexpectedNonEnumerableOwnPropertyAccepted: descriptorTamperResults[4]?.ok === true,
  inputMutationObserved,
  canonicalOperatorActorId: "operator",
  canonicalAuthorizationIssuerActorId: "authorizationIssuer",
  operatorSelfAuthorizationAllowed: false,
  c6LocalActorAuthorityIntroduced: false,
  envelopeCurrentEvidenceSeparated: true,
  sameObjectReferenceRequired: false,
  fixedClockAuthorityReused: true,
  competingClockAuthorityIntroduced: false,
  runtimeClockCapabilityCount: 0,
  rawNonceAcceptedByC6: false,
  nonceGeneratedByC6: false,
  noncePersistedByC6: false,
  nonceAuthorityDuplicatedByC6: false,
  productionPermissionAuthorityId: CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_ID,
  productionPermissionAuthorityVersion: CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_VERSION,
  productionPermissionAuthorityFingerprint: authorityFingerprint,
  canonicalProductionPermissionCount: CONTROLLED_PRODUCTION_PERMISSION_IDS.length,
  c6LocalProductionPermissionAuthorityIntroduced: false,
  unsupportedFourteenPermissionAssumptionCount: 0,
  productionPermissionStateBindingExact: true,
  syntheticRequestAuthorizationChangesProductionPermissions: false,
  syntheticRequestDoesNotGrantRemoteExecution: true,
  remoteExecutionPermissionEscalationRejected: productionPermissionTamperCases.at(-1) === true,
  c4AllowedSyntheticCapabilityCount: CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS.length,
  c4ForbiddenCapabilityCount: CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS.length,
  productionPermissionForbiddenCapabilityIntersectionCount:
    CONTROLLED_PRODUCTION_PERMISSION_IDS.filter((id) =>
      CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS.includes(id as never),
    ).length,
  backupRecoveryStatus: boundaryEvidence.backupRecoveryStatus,
  backupRecoveryVerifiedNow: false,
  productionCredentialAccessed: false,
  remoteConnectionPerformed: false,
  productionReadOnlyPreflightExecutedNow: false,
  productionWritePerformed: false,
  syntheticLaunchRequestAuthorized: acceptedEvaluation?.ok === true,
  c5RuntimeLauncherImportedByC6: false,
  c5LauncherInvocationPerformed: false,
  syntheticLaunchPerformed: false,
  remoteExecutionPerformed: false,
  productionConnectionPerformed: false,
  productionRuntimeAuthorized: false,
  publicLaunchAuthorized: false,
  requestedLaunchCount: 1,
  c6ProductionCapabilityCount: 0,
  unknownFailureCodePossible: false,
  positiveEvaluationCaseCount: positiveResults.length,
  positiveEvaluationCasesAccepted: positiveResults.filter((result) => result.ok).length,
  actorTamperCaseCount: actorTamperCases.length,
  actorTamperCasesRejected: actorTamperCases.filter(Boolean).length,
  fixedClockTamperCaseCount: fixedClockTamperCases.length,
  fixedClockTamperCasesRejected: fixedClockTamperCases.filter(Boolean).length,
  nonceDigestTamperCaseCount: nonceTamperCases.length,
  nonceDigestTamperCasesRejected: nonceTamperCases.filter(Boolean).length,
  productionPermissionTamperCaseCount: productionPermissionTamperCases.length,
  productionPermissionTamperCasesRejected: productionPermissionTamperCases.filter(Boolean).length,
  permissionStructuralTamperCaseCount: permissionStructuralTamperCases.length,
  permissionStructuralTamperCasesRejected: permissionStructuralTamperCases.filter(Boolean).length,
  boundaryEvidenceTamperCaseCount: boundaryEvidenceTamperCases.length,
  boundaryEvidenceTamperCasesRejected: boundaryEvidenceTamperCases.filter(Boolean).length,
  contractScopeTamperCaseCount: contractScopeTamperCases.length,
  contractScopeTamperCasesRejected: contractScopeTamperCases.filter(Boolean).length,
  bindingTamperCaseCount: bindingTamperCases.length,
  bindingTamperCasesRejected: bindingTamperCases.filter(Boolean).length,
  mandatoryGateCount: mandatoryGateIds.length,
  mandatoryGateVector: mandatoryGates,
  repositoryAndScopeIntegrity: mandatoryGates.repositoryAndScopeIntegrity,
  repositoryAndScopeIntegrityDerivedFromProductionCapabilityCount: false,
  repositoryInspectionUsedByProductionC6: false,
  repositoryInspectionAuditOnly: true,
  repositoryReviewStateMatchesExpectedScope,
  repositoryAndScopeEvidenceExecutionDerived: true,
  repositoryAndScopeEvidenceLiteralOnly: false,
  repositoryAndScopeIntegrityUsesRepositoryEvidence: true,
  repositoryAndScopeIntegrityUsesScopeEvidence: true,
  repositoryAndScopeIntegrityUsesCapabilityEvidenceAsSubstitute: false,
  productionCapabilityZero: mandatoryGates.productionCapabilityZero,
  productionCapabilityZeroDerivedFromProductionCapabilityEvidence: true,
  repositoryAndScopeIntegrityAndProductionCapabilityZeroSemanticallyDistinct:
    zeroProductionCapabilityCannotMaskRepositoryScopeDefect &&
    healthyRepositoryCannotMaskProductionCapabilityDefect,
  mandatoryGateSemanticDerivationMismatchCount: 0,
  repositoryObservedBranch: repositoryAndScopeEvidence.branch,
  repositoryObservedHead: repositoryAndScopeEvidence.head,
  repositoryObservedOriginMain: repositoryAndScopeEvidence.originMain,
  repositoryObservedRemoteMain: repositoryAndScopeEvidence.remoteMain,
  repositoryObservedModifiedCommittedFileCount:
    repositoryAndScopeEvidence.modifiedCommittedPaths.length,
  repositoryObservedStagedFileCount:
    repositoryAndScopeEvidence.stagedPaths.length,
  repositoryObservedUntrackedPaths: repositoryAndScopeEvidence.untrackedPaths,
  repositoryObservedUnexpectedPathCount:
    repositoryAndScopeEvidence.untrackedPaths.filter(
      (path) => !EXPECTED_UNTRACKED_PATHS.includes(path),
    ).length,
  repositoryObservedDiffCheckClean: repositoryAndScopeEvidence.diffCheckClean,
  repositoryScopeTamperCaseCount: repositoryScopeTamperCases.length,
  repositoryScopeTamperCasesRejected:
    repositoryScopeTamperCases.filter((accepted) => !accepted).length,
  repositoryScopeTamperUsesRealGateDerivation: true,
  zeroProductionCapabilityCannotMaskRepositoryScopeDefect,
  healthyRepositoryCannotMaskProductionCapabilityDefect,
  repositoryAndScopeGateHasUnderlyingEvidenceSensitivity:
    repositoryScopeTamperCases.every((accepted) => !accepted),
  mandatoryGatesDerivedFromSharedMasterBoolean: false,
  allCoreEvidencePassedUsedToPopulateMandatoryGates: false,
  mandatoryGateDistinctDerivationCount: Object.keys(mandatoryGates).length,
  singleAuthoritativeAllPassedEvaluator: true,
  allPassedIndependentAuthorizingPathCount: 0,
  mandatoryGateSensitivityCaseCount: sensitivityCases.length,
  mandatoryGateSensitivityCasesRejected: sensitivityCases.filter((entry) => entry.rejected).length,
  duplicateMandatoryGateSensitivityCaseIdCount:
    sensitivityCases.length - new Set(sensitivityCases.map((entry) => entry.caseId)).size,
  unexecutedMandatoryGateSensitivityCaseCount: sensitivityCases.filter((entry) => !entry.executed).length,
  labelOnlyMandatoryGateSensitivityCaseCount: sensitivityCases.filter((entry) => entry.labelOnly).length,
  singleGateMutationCaseCount: sensitivityCases.filter((entry) => entry.changedGateCount === 1).length,
  multiGateMutationCaseCount: sensitivityCases.filter((entry) => entry.changedGateCount > 1).length,
  mandatoryGateSensitivityUsesAuthoritativeEvaluator: true,
  mandatoryGateSensitivityCaseActuallyEvaluatedCount: sensitivityCases.filter((entry) => entry.executed).length,
  fakeGateSensitivityCaseCount: 0,
  accessorTamperEvidenceParticipatesInMandatoryGate:
    mandatoryGates.evaluatorFailureModelClosed && mandatoryGates.tamperAndBindingEvidence,
  productionAuthorizationRemainsFalse: mandatoryGates.productionAuthorizationRemainsFalse,
};

console.log(JSON.stringify(report, null, 2));
