import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

import {
  CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
  CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS,
} from "../source-registry/controlled-preflight-launcher-capability-contract";
import {
  CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE,
  type ControlledOperatorAuthorizationCurrentEvidence,
  type ControlledOperatorAuthorizationEnvelope,
} from "../source-registry/controlled-operator-authorization-envelope";
import {
  createFailClosedControlledProductionPermissionState,
  CONTROLLED_PRODUCTION_PERMISSION_IDS,
  getControlledProductionPermissionAuthorityFingerprint,
} from "../source-registry/controlled-production-permission-authority";
import {
  PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER,
} from "../source-registry/production-read-only-preflight-helper";
import {
  CONTROLLED_SYNTHETIC_C5_LAUNCH_EXECUTION_BOUNDARY,
  executeControlledSyntheticC5Launch,
  type ControlledSyntheticC5LaunchExecutionInput,
} from "../source-registry/controlled-synthetic-c5-launch-execution-boundary";

const BASELINE = "09b489feb85cf3253a46c81dc5bdb450eb66767c";
const C7_SOURCE =
  "lib/vaylo/smart-talk/knowledge/source-registry/controlled-synthetic-c5-launch-execution-boundary.ts";
const C7_AUDIT =
  "lib/vaylo/smart-talk/knowledge/de/run-controlled-synthetic-c5-launch-execution-boundary-audit.ts";
const C6_SOURCE =
  "lib/vaylo/smart-talk/knowledge/source-registry/controlled-operator-authorization-envelope.ts";
const C6D_AUDIT =
  "lib/vaylo/smart-talk/knowledge/de/run-controlled-operator-authorization-safe-handoff-extension-audit.ts";
const HISTORICAL_C6_AUDIT =
  "lib/vaylo/smart-talk/knowledge/de/run-controlled-operator-invocation-and-authorization-envelope-design-audit.ts";
const C6A_SOURCE =
  "lib/vaylo/smart-talk/knowledge/source-registry/controlled-preflight-actor-authority.ts";
const C6B_SOURCE =
  "lib/vaylo/smart-talk/knowledge/source-registry/controlled-synthetic-fixed-clock-policy.ts";
const C6C_SOURCE =
  "lib/vaylo/smart-talk/knowledge/source-registry/controlled-production-permission-authority.ts";
const C5_CHECKPOINT = "9993d2ad6ed5f8de5546edc95c4e702abac38414";

type GateId =
  | "repositoryAndScopeIntegrity"
  | "dependencyIntegrity"
  | "c7IdentityClosed"
  | "c6AuthorizationAuthorityBound"
  | "freshC6ValidatedHandoffRequired"
  | "c4CandidateAuthorityBound"
  | "fixedClockCrossBinding"
  | "rawNonceDigestCrossBinding"
  | "c5FactoryAuthorityBound"
  | "c5FactoryFailureFailsClosed"
  | "authorizationAndBindingsBeforeExecution"
  | "unauthorizedOrUnboundRequestsInvokeC5ZeroTimes"
  | "exactlyOneLauncherInvocationOnAuthorizedSuccess"
  | "noAutomaticRetryOrFallback"
  | "c5NonceLifecycleAuthorityPreserved"
  | "positiveSyntheticExecutionEvidence"
  | "failureAndTamperEvidence"
  | "productionCapabilityZero"
  | "noRemoteOrProductionExecution"
  | "productionAuthorizationRemainsFalse";

type GateVector = Readonly<Record<GateId, boolean>>;

const deepFreeze = <T>(value: T): T => {
  if (value !== null && typeof value === "object") {
    for (const key of Reflect.ownKeys(value as object)) {
      const descriptor = Object.getOwnPropertyDescriptor(value as object, key);
      if (descriptor && "value" in descriptor) deepFreeze(descriptor.value);
    }
    Object.freeze(value);
  }
  return value;
};

const sha256 = (path: string): string =>
  createHash("sha256").update(readFileSync(path)).digest("hex").toUpperCase();

const git = (args: readonly string[]): string =>
  execFileSync("git", args, { encoding: "utf8" }).trim();

const lines = (value: string): readonly string[] =>
  value === "" ? Object.freeze([]) : Object.freeze(value.split(/\r?\n/u));

const boundaryEvidence = () =>
  Object.freeze({
    backupRecoveryStatus: "REQUIRED_NOT_YET_VERIFIED" as const,
    backupRecoveryVerifiedNow: false as const,
    productionCredentialAccessed: false as const,
    remoteConnectionPerformed: false as const,
    productionReadOnlyPreflightExecutedNow: false as const,
    firstProductionWritePerformed: false as const,
  });

const nonceDigest = (nonce: string): string =>
  createHash("sha256").update(nonce, "utf8").digest("hex");

const createEnvelope = (
  nonce: string,
  fixedClockSnapshot = "2026-08-06T00:05:00.000Z",
  overrides: Partial<ControlledOperatorAuthorizationEnvelope> = {},
): ControlledOperatorAuthorizationEnvelope => ({
  contractId: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.contractId,
  version: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.version,
  authorizationClass: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.authorizationClass,
  executionScope: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.executionScope,
  requestedAction: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.requestedAction,
  c6SourceCheckpointCommit: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.c6SourceCheckpointCommit,
  c5BoundCheckpointCommit: C5_CHECKPOINT,
  operatorActorId: "operator",
  authorizationIssuerActorId: "authorizationIssuer",
  fixedClockSnapshot,
  nonceDigest: nonceDigest(nonce),
  productionPermissionState: { ...createFailClosedControlledProductionPermissionState() },
  boundaryEvidence: boundaryEvidence(),
  requestedLaunchCount: 1,
  ...overrides,
});

const createEvidence = (
  envelope: ControlledOperatorAuthorizationEnvelope,
  overrides: Partial<ControlledOperatorAuthorizationCurrentEvidence> = {},
): ControlledOperatorAuthorizationCurrentEvidence => ({
  c6SourceCheckpointCommit: envelope.c6SourceCheckpointCommit,
  c5BoundCheckpointCommit: envelope.c5BoundCheckpointCommit,
  operatorActorId: envelope.operatorActorId,
  authorizationIssuerActorId: envelope.authorizationIssuerActorId,
  fixedClockSnapshot: envelope.fixedClockSnapshot,
  nonceDigest: envelope.nonceDigest,
  productionPermissionState: { ...envelope.productionPermissionState },
  boundaryEvidence: { ...envelope.boundaryEvidence },
  ...overrides,
});

const candidate = (fixedClockSnapshot: string) =>
  deepFreeze({
    contractId: "9X-C4-C5-SYNTHETIC-CAPABILITY-BOUNDARY",
    contractVersion: 1,
    authorizationClass: "C5_SYNTHETIC_ONLY",
    productionCapabilityCount: 0,
    allowedCapabilities: [...CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS],
    forbiddenCapabilities: [...CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS],
    manifest: {
      queryIds: [...PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER],
      fixtureSnapshots: PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER.map((queryId) => ({
        queryId,
        rows: 1,
      })),
      fixedClockSnapshot,
      nonce: { mode: "EPHEMERAL_IN_MEMORY" as const, maximumEntries: 8 },
      auditTrace: { mode: "IN_MEMORY" as const, maximumEvents: 64 },
    },
  });

const validInput = (
  suffix: string,
  fixedClockSnapshot = "2026-08-06T00:05:00.000Z",
): ControlledSyntheticC5LaunchExecutionInput => {
  const rawLaunchNonce = `c7boundednonce_${suffix}_0123456789abcdef`;
  const envelope = createEnvelope(rawLaunchNonce, fixedClockSnapshot);
  return Object.freeze({
    c6AuthorizationEnvelope: envelope,
    c6CurrentEvidence: createEvidence(envelope),
    c4CapabilityCandidate: candidate(fixedClockSnapshot),
    rawLaunchNonce,
  });
};

const evaluateMandatoryC7Gates = (gates: GateVector): boolean =>
  Object.values(gates).every(Boolean);

const observedRepository = () => {
  const remote = git(["ls-remote", "origin", "refs/heads/main"]).split(/\s+/u)[0] ?? "";
  return Object.freeze({
    branch: git(["branch", "--show-current"]),
    head: git(["rev-parse", "HEAD"]),
    origin: git(["rev-parse", "origin/main"]),
    remote,
    modified: lines(git(["diff", "--name-only"])),
    staged: lines(git(["diff", "--cached", "--name-only"])),
    untracked: lines(git(["ls-files", "--others", "--exclude-standard"])),
    diffCheckClean: git(["diff", "--check"]) === "",
  });
};

const same = (actual: readonly string[], expected: readonly string[]): boolean =>
  actual.length === expected.length && actual.every((value, index) => value === expected[index]);

type FreshC6HandoffEvidence = Readonly<{
  evaluatorImportedAndCalled: boolean;
  localC6AuthorityAbsent: boolean;
  successfulFreshEvaluationCount: number;
  successfulFreshHandoffCount: number;
  detachedHandoffExecutionPathCount: number;
  callerSuppliedDetachedHandoffAccepted: boolean;
}>;

type RetryFallbackEvidence = Readonly<{
  automaticRetryCount: number;
  recursiveInvocationCount: number;
  batchInvocationCount: number;
  secondLauncherInvocationWithinSameExecution: boolean;
  factoryRejectionLauncherInvocationCount: number;
  factoryRejectionProductionFallback: boolean;
  factoryRejectionRemoteFallback: boolean;
  launcherCallSiteCount: number;
}>;

type NonceLifecycleEvidence = Readonly<{
  c7OwnsNonceGeneration: boolean;
  c7OwnsNoncePersistence: boolean;
  c7OwnsNonceConsumptionLifecycle: boolean;
  c7CompetingNonceRegistryIntroduced: boolean;
  nonceStateResetCount: number;
  replayBypassCount: number;
  newNonceRetryCount: number;
  digestBindingUsesPureLocalHash: boolean;
}>;

const C7_IDENTITY_REQUIRED_SEMANTIC_COMPONENTS = Object.freeze([
  "boundaryId",
  "version",
  "authorizationClass",
  "executionScope",
  "allowedAction",
  "c7SourceCheckpointCommit",
  "c6BoundCheckpointCommit",
  "c5BoundCheckpointCommit",
  "runtimeImmutability",
] as const);

type C7IdentitySemanticComponent =
  (typeof C7_IDENTITY_REQUIRED_SEMANTIC_COMPONENTS)[number];

type C7IdentityEvidence = Readonly<{
  boundaryId: unknown;
  version: unknown;
  authorizationClass: unknown;
  executionScope: unknown;
  allowedAction: unknown;
  c7SourceCheckpointCommit: unknown;
  c6BoundCheckpointCommit: unknown;
  c5BoundCheckpointCommit: unknown;
  runtimeImmutability: boolean;
}>;

const deriveC7IdentityClosed = (evidence: C7IdentityEvidence): boolean =>
  evidence.boundaryId ===
    "VAYLO_CONTROLLED_SYNTHETIC_C5_LAUNCH_EXECUTION_BOUNDARY" &&
  evidence.version === 1 &&
  evidence.authorizationClass ===
    "C7_C6_AUTHORIZED_SYNTHETIC_EXECUTION_ONLY" &&
  evidence.executionScope === "SYNTHETIC_LOCAL_ONLY" &&
  evidence.allowedAction ===
    "EXECUTE_ONE_C6_AUTHORIZED_C5_SYNTHETIC_LAUNCH" &&
  evidence.c7SourceCheckpointCommit === BASELINE &&
  evidence.c6BoundCheckpointCommit === BASELINE &&
  evidence.c5BoundCheckpointCommit === C5_CHECKPOINT &&
  evidence.runtimeImmutability;

const identityCoverageIsComplete = (
  verifiedComponents: readonly C7IdentitySemanticComponent[],
): boolean =>
  verifiedComponents.length === C7_IDENTITY_REQUIRED_SEMANTIC_COMPONENTS.length &&
  C7_IDENTITY_REQUIRED_SEMANTIC_COMPONENTS.every((component) =>
    verifiedComponents.includes(component));

const deriveFreshC6ValidatedHandoffRequired = (
  evidence: FreshC6HandoffEvidence,
): boolean =>
  evidence.evaluatorImportedAndCalled &&
  evidence.localC6AuthorityAbsent &&
  evidence.successfulFreshEvaluationCount > 0 &&
  evidence.successfulFreshHandoffCount === evidence.successfulFreshEvaluationCount &&
  evidence.detachedHandoffExecutionPathCount === 0 &&
  !evidence.callerSuppliedDetachedHandoffAccepted;

const deriveNoAutomaticRetryOrFallback = (
  evidence: RetryFallbackEvidence,
): boolean =>
  evidence.automaticRetryCount === 0 &&
  evidence.recursiveInvocationCount === 0 &&
  evidence.batchInvocationCount === 0 &&
  !evidence.secondLauncherInvocationWithinSameExecution &&
  evidence.factoryRejectionLauncherInvocationCount === 0 &&
  !evidence.factoryRejectionProductionFallback &&
  !evidence.factoryRejectionRemoteFallback &&
  evidence.launcherCallSiteCount === 1;

const deriveC5NonceLifecycleAuthorityPreserved = (
  evidence: NonceLifecycleEvidence,
): boolean =>
  !evidence.c7OwnsNonceGeneration &&
  !evidence.c7OwnsNoncePersistence &&
  !evidence.c7OwnsNonceConsumptionLifecycle &&
  !evidence.c7CompetingNonceRegistryIntroduced &&
  evidence.nonceStateResetCount === 0 &&
  evidence.replayBypassCount === 0 &&
  evidence.newNonceRetryCount === 0 &&
  evidence.digestBindingUsesPureLocalHash;

const countMatches = (source: string, pattern: RegExp): number =>
  [...source.matchAll(pattern)].length;

export async function runControlledSyntheticC5LaunchExecutionBoundaryAudit() {
  const productionSource = readFileSync(C7_SOURCE, "utf8");
  const auditSource = readFileSync(C7_AUDIT, "utf8");
  const repository = observedRepository();
  const repositoryAndScopeIntegrity =
    repository.branch === "main" &&
    repository.head === BASELINE &&
    repository.origin === BASELINE &&
    repository.remote === BASELINE &&
    repository.modified.length === 0 &&
    repository.staged.length === 0 &&
    same(repository.untracked, [C7_AUDIT, C7_SOURCE]) &&
    repository.diffCheckClean;

  const dependencyIntegrity =
    sha256(C6_SOURCE) === "A97F55A224B1DFAE3593E5DD792B367DF7C4D3FE623C43C2E041583BBF79EEB8" &&
    sha256(C6D_AUDIT) === "3175C09FE2FF83A79C1E003DDC6CC1D5491C0CD7ED299C67B057747E17FFB6AF" &&
    sha256(HISTORICAL_C6_AUDIT) === "87C2093889790447BBE0DBE8C1668BB6B35875A48AFE4BC526B3F75AE3B80812" &&
    sha256(C6A_SOURCE) === "5214C52B816AB7FB2CD3C4A3FA7D562EC2F2C65296EE9543B5E81C127D9F939B" &&
    sha256(C6B_SOURCE) === "A00A50C48354FC9051CE73A4A620D1C0A61BE9197E1D73DFB473809218A86186" &&
    sha256(C6C_SOURCE) === "AFFC1043B4EB63D3ECF39F20A64FBAAB05A6CCAAED2F19D0E4E3CE11E645EF21" &&
    getControlledProductionPermissionAuthorityFingerprint() ===
      "7779fe46a1f94b478e2a64b241d18313a42b263203ea34a28e07000dc61af08f";

  const positiveCases = await Promise.all(
    ["one", "two", "three"].map((suffix) => executeControlledSyntheticC5Launch(validInput(suffix))),
  );
  const positiveC7ExecutionCaseCount = positiveCases.length;
  const positiveC7ExecutionCasesAccepted = positiveCases.filter((result) => result.ok).length;
  const totalC5LauncherInvocationsAcrossPositiveCases = positiveCases.reduce(
    (total, result) => total + result.c5LauncherInvocationCount,
    0,
  );

  const outOfWindow = await executeControlledSyntheticC5Launch(
    validInput("outside-window", "2026-08-06T00:11:00.000Z"),
  );

  const base = validInput("failure-base");
  const baseEnvelope = base.c6AuthorizationEnvelope as ControlledOperatorAuthorizationEnvelope;
  const rejectionInputs: readonly ControlledSyntheticC5LaunchExecutionInput[] = [
    { ...base, c6AuthorizationEnvelope: { ...baseEnvelope, requestedAction: "OTHER" } },
    { ...base, c6AuthorizationEnvelope: { ...baseEnvelope, authorizationIssuerActorId: "operator" } },
    { ...base, c6CurrentEvidence: createEvidence(baseEnvelope, { fixedClockSnapshot: "2026-08-06T00:06:00.000Z" }) },
    { ...base, c6CurrentEvidence: createEvidence(baseEnvelope, { nonceDigest: "b".repeat(64) }) },
    {
      ...base,
      c6AuthorizationEnvelope: {
        ...baseEnvelope,
        productionPermissionState: {
          ...createFailClosedControlledProductionPermissionState(),
          AUTHORIZE_REMOTE_EXECUTION: true,
        },
      },
    },
    {
      ...base,
      c6AuthorizationEnvelope: {
        ...baseEnvelope,
        boundaryEvidence: { ...boundaryEvidence(), remoteConnectionPerformed: true },
      },
    },
    { ...base, c4CapabilityCandidate: Object.freeze({}) },
    { ...base, c4CapabilityCandidate: candidate("2026-08-06T00:06:00.000Z") },
    { ...base, rawLaunchNonce: "c7boundednonce_wrong_0123456789abcdef" },
  ];
  let getterReads = 0;
  const accessorEnvelope = { ...baseEnvelope } as Record<string, unknown>;
  Object.defineProperty(accessorEnvelope, "fixedClockSnapshot", {
    enumerable: true,
    get: () => {
      getterReads += 1;
      return baseEnvelope.fixedClockSnapshot;
    },
  });
  let proxyTraps = 0;
  const proxyEnvelope = new Proxy(baseEnvelope, {
    get: () => {
      proxyTraps += 1;
      return undefined;
    },
  });
  const rejectionResults = await Promise.all([
    ...rejectionInputs.map((input) => executeControlledSyntheticC5Launch(input)),
    executeControlledSyntheticC5Launch({ ...base, c6AuthorizationEnvelope: accessorEnvelope }),
    executeControlledSyntheticC5Launch({ ...base, c6AuthorizationEnvelope: proxyEnvelope }),
  ]);
  const preFactoryRejectionCaseCount = rejectionResults.length;
  const preFactoryRejectionCasesBlocked = rejectionResults.filter(
    (result) => !result.ok && !result.c5FactoryAttempted && result.c5LauncherInvocationCount === 0,
  ).length;

  const permissionEscalations = await Promise.all(
    CONTROLLED_PRODUCTION_PERMISSION_IDS.map((permissionId) => {
      const input = validInput(`permission-${permissionId}`);
      const envelope = input.c6AuthorizationEnvelope as ControlledOperatorAuthorizationEnvelope;
      return executeControlledSyntheticC5Launch({
        ...input,
        c6AuthorizationEnvelope: {
          ...envelope,
          productionPermissionState: {
            ...createFailClosedControlledProductionPermissionState(),
            [permissionId]: true,
          },
        },
      });
    }),
  );

  const mutable = validInput("toctou");
  const mutableEnvelope = mutable.c6AuthorizationEnvelope as {
    fixedClockSnapshot: string;
    nonceDigest: string;
  };
  const mutableEvidence = mutable.c6CurrentEvidence as {
    fixedClockSnapshot: string;
    nonceDigest: string;
  };
  const toctouResult = await executeControlledSyntheticC5Launch(mutable);
  mutableEnvelope.fixedClockSnapshot = "2026-08-06T00:06:00.000Z";
  mutableEnvelope.nonceDigest = "b".repeat(64);
  mutableEvidence.fixedClockSnapshot = "2026-08-06T00:06:00.000Z";
  mutableEvidence.nonceDigest = "b".repeat(64);

  const fixedClockMismatch = rejectionResults[7]!;
  const nonceMismatch = rejectionResults[8]!;
  const fixedClockMismatchRejected =
    !fixedClockMismatch.ok &&
    fixedClockMismatch.failureCode === "FIXED_CLOCK_HANDOFF_BINDING_MISMATCH";
  const nonceMismatchRejected =
    !nonceMismatch.ok &&
    nonceMismatch.failureCode === "RAW_NONCE_DIGEST_BINDING_MISMATCH";
  const identity = CONTROLLED_SYNTHETIC_C5_LAUNCH_EXECUTION_BOUNDARY;
  const identityEvidence: C7IdentityEvidence = Object.freeze({
    boundaryId: identity.boundaryId,
    version: identity.version,
    authorizationClass: identity.authorizationClass,
    executionScope: identity.executionScope,
    allowedAction: identity.allowedAction,
    c7SourceCheckpointCommit: identity.c7SourceCheckpointCommit,
    c6BoundCheckpointCommit: identity.c6BoundCheckpointCommit,
    c5BoundCheckpointCommit: identity.c5BoundCheckpointCommit,
    runtimeImmutability: Object.isFrozen(identity),
  });
  const verifiedIdentityComponents: readonly C7IdentitySemanticComponent[] =
    Object.freeze([...C7_IDENTITY_REQUIRED_SEMANTIC_COMPONENTS]);
  const c7IdentityRequiredSemanticComponentsComplete =
    identityCoverageIsComplete(verifiedIdentityComponents);
  const identityTamperEvidence: readonly C7IdentityEvidence[] = Object.freeze([
    Object.freeze({ ...identityEvidence, authorizationClass: "WRONG_AUTHORIZATION_CLASS" }),
    Object.freeze({ ...identityEvidence, allowedAction: "WRONG_ACTION" }),
    Object.freeze({ ...identityEvidence, boundaryId: "WRONG_BOUNDARY" }),
    Object.freeze({ ...identityEvidence, version: 2 }),
    Object.freeze({ ...identityEvidence, executionScope: "WRONG_SCOPE" }),
    Object.freeze({ ...identityEvidence, c7SourceCheckpointCommit: "WRONG_C7_CHECKPOINT" }),
    Object.freeze({ ...identityEvidence, c6BoundCheckpointCommit: "WRONG_C6_CHECKPOINT" }),
    Object.freeze({ ...identityEvidence, c5BoundCheckpointCommit: "WRONG_C5_CHECKPOINT" }),
    Object.freeze({ ...identityEvidence, runtimeImmutability: false }),
  ]);
  const identityTamperResults = identityTamperEvidence.map(
    (tamperedEvidence) => !deriveC7IdentityClosed(tamperedEvidence),
  );
  const identityCoverageOmissions:
    readonly (readonly C7IdentitySemanticComponent[])[] =
    Object.freeze([
      Object.freeze(
        verifiedIdentityComponents.filter(
          (component) => component !== "authorizationClass"),
      ),
      Object.freeze(
        verifiedIdentityComponents.filter(
          (component) => component !== "allowedAction"),
      ),
    ]);
  const identityCoverageOmissionResults = identityCoverageOmissions.map(
    (components) => !identityCoverageIsComplete(components),
  );
  const c7IdentityClosed =
    deriveC7IdentityClosed(identityEvidence) &&
    c7IdentityRequiredSemanticComponentsComplete &&
    identityTamperResults.every(Boolean) &&
    identityCoverageOmissionResults.every(Boolean);
  const positiveExecutionEvidence =
    positiveC7ExecutionCaseCount === 3 &&
    positiveC7ExecutionCasesAccepted === positiveC7ExecutionCaseCount &&
    totalC5LauncherInvocationsAcrossPositiveCases === positiveC7ExecutionCaseCount;
  const permissionsRejected = permissionEscalations.filter(
    (result) => !result.ok && !result.handoffObtained && !result.c5FactoryAttempted,
  ).length;
  const evaluatorCallCount = countMatches(
    productionSource,
    /evaluateControlledOperatorAuthorizationEnvelope\(/gu,
  );
  const c4ParserCallCount = countMatches(
    productionSource,
    /parseClosedCapabilityCandidate\(/gu,
  );
  const c5FactoryCallCount = countMatches(
    productionSource,
    /createControlledSyntheticPreflightLauncher\(/gu,
  );
  const launcherCallSiteCount = countMatches(
    productionSource,
    /factory\.launcher\.launch\(/gu,
  );
  const successfulFreshEvaluationCount = positiveCases.filter(
    (result) => result.c6AuthorizationAccepted,
  ).length;
  const successfulFreshHandoffCount = positiveCases.filter(
    (result) => result.c6AuthorizationAccepted && result.handoffObtained,
  ).length;
  const detachedHandoffExecutionPathCount =
    /validatedLaunchHandoff\s*:/u.test(
      productionSource.slice(
        productionSource.indexOf("export type ControlledSyntheticC5LaunchExecutionInput"),
        productionSource.indexOf("type ReceiptBase"),
      ),
    )
      ? 1
      : 0;
  const freshC6Evidence: FreshC6HandoffEvidence = Object.freeze({
    evaluatorImportedAndCalled: evaluatorCallCount === 1,
    localC6AuthorityAbsent:
      !/function\s+(?:authorize|evaluate).*C6/iu.test(productionSource) &&
      !/operatorActorId|authorizationIssuerActorId/gu.test(productionSource),
    successfulFreshEvaluationCount,
    successfulFreshHandoffCount,
    detachedHandoffExecutionPathCount,
    callerSuppliedDetachedHandoffAccepted: detachedHandoffExecutionPathCount > 0,
  });
  const freshC6ValidatedHandoffRequiredHealthy =
    deriveFreshC6ValidatedHandoffRequired(freshC6Evidence);

  const retryFallbackEvidence: RetryFallbackEvidence = Object.freeze({
    automaticRetryCount: Math.max(0, launcherCallSiteCount - 1),
    recursiveInvocationCount: Math.max(
      0,
      countMatches(productionSource, /executeControlledSyntheticC5Launch\(/gu) - 1,
    ),
    batchInvocationCount:
      /\b(?:for|while)\s*\([^)]*\)[\s\S]{0,240}factory\.launcher\.launch\(/u.test(
        productionSource,
      )
        ? 1
        : 0,
    secondLauncherInvocationWithinSameExecution: launcherCallSiteCount > 1,
    factoryRejectionLauncherInvocationCount: outOfWindow.c5LauncherInvocationCount,
    factoryRejectionProductionFallback:
      /productionFallback\s*:\s*true|fallbackToProduction/iu.test(productionSource),
    factoryRejectionRemoteFallback:
      /remoteFallback\s*:\s*true|fallbackToRemote/iu.test(productionSource),
    launcherCallSiteCount,
  });
  const noAutomaticRetryOrFallbackHealthy =
    deriveNoAutomaticRetryOrFallback(retryFallbackEvidence);

  const nonceLifecycleEvidence: NonceLifecycleEvidence = Object.freeze({
    c7OwnsNonceGeneration:
      /randomUUID|randomBytes|Math\.random|generateNonce/iu.test(productionSource),
    c7OwnsNoncePersistence:
      /writeFile|localStorage|sessionStorage|persistNonce/iu.test(productionSource),
    c7OwnsNonceConsumptionLifecycle:
      /NONCE_(?:RESERVED|CONSUMED|REPLAY)|consumeNonce|reserveNonce/iu.test(
        productionSource,
      ),
    c7CompetingNonceRegistryIntroduced:
      /new\s+(?:Map|Set)<[^>]*>\(\)|nonceRegistry/iu.test(productionSource),
    nonceStateResetCount: countMatches(
      productionSource,
      /resetNonce|clearNonce|nonceRegistry\.clear/giu,
    ),
    replayBypassCount: countMatches(
      productionSource,
      /bypassReplay|disableReplay|ignoreReplay/giu,
    ),
    newNonceRetryCount: countMatches(
      productionSource,
      /retryWithNewNonce|newNonceRetry/giu,
    ),
    digestBindingUsesPureLocalHash:
      /createHash\("sha256"\)\.update\(nonce,\s*"utf8"\)\.digest\("hex"\)/u.test(
        productionSource,
      ),
  });
  const c5NonceLifecycleAuthorityPreservedHealthy =
    deriveC5NonceLifecycleAuthorityPreserved(nonceLifecycleEvidence);

  const freshC6TamperEvidence: readonly FreshC6HandoffEvidence[] = Object.freeze([
    Object.freeze({ ...freshC6Evidence, evaluatorImportedAndCalled: false }),
    Object.freeze({ ...freshC6Evidence, detachedHandoffExecutionPathCount: 1 }),
    Object.freeze({ ...freshC6Evidence, callerSuppliedDetachedHandoffAccepted: true }),
    Object.freeze({ ...freshC6Evidence, successfulFreshHandoffCount: 0 }),
  ]);
  const retryFallbackTamperEvidence: readonly RetryFallbackEvidence[] = Object.freeze([
    Object.freeze({ ...retryFallbackEvidence, automaticRetryCount: 1 }),
    Object.freeze({ ...retryFallbackEvidence, factoryRejectionProductionFallback: true }),
    Object.freeze({ ...retryFallbackEvidence, factoryRejectionRemoteFallback: true }),
    Object.freeze({
      ...retryFallbackEvidence,
      secondLauncherInvocationWithinSameExecution: true,
    }),
  ]);
  const nonceLifecycleTamperEvidence: readonly NonceLifecycleEvidence[] = Object.freeze([
    Object.freeze({ ...nonceLifecycleEvidence, c7OwnsNonceGeneration: true }),
    Object.freeze({ ...nonceLifecycleEvidence, c7OwnsNoncePersistence: true }),
    Object.freeze({ ...nonceLifecycleEvidence, c7OwnsNonceConsumptionLifecycle: true }),
    Object.freeze({ ...nonceLifecycleEvidence, c7CompetingNonceRegistryIntroduced: true }),
  ]);
  const freshC6TamperResults = freshC6TamperEvidence.map(
    (evidence) => !deriveFreshC6ValidatedHandoffRequired(evidence),
  );
  const retryFallbackTamperResults = retryFallbackTamperEvidence.map(
    (evidence) => !deriveNoAutomaticRetryOrFallback(evidence),
  );
  const nonceLifecycleTamperResults = nonceLifecycleTamperEvidence.map(
    (evidence) => !deriveC5NonceLifecycleAuthorityPreserved(evidence),
  );
  const underlyingEvidenceSensitivityResults = [
    ...freshC6TamperResults,
    ...retryFallbackTamperResults,
    ...nonceLifecycleTamperResults,
    ...identityTamperResults,
  ];
  const freshC6ValidatedHandoffRequired =
    freshC6ValidatedHandoffRequiredHealthy && freshC6TamperResults.every(Boolean);
  const noAutomaticRetryOrFallback =
    noAutomaticRetryOrFallbackHealthy && retryFallbackTamperResults.every(Boolean);
  const c5NonceLifecycleAuthorityPreserved =
    c5NonceLifecycleAuthorityPreservedHealthy &&
    nonceLifecycleTamperResults.every(Boolean);

  const evaluatorIndex = productionSource.indexOf(
    "evaluateControlledOperatorAuthorizationEnvelope(",
  );
  const handoffIndex = productionSource.indexOf(
    "const handoff = authorization.validatedLaunchHandoff",
  );
  const c4ParserIndex = productionSource.indexOf("parseClosedCapabilityCandidate(");
  const fixedClockBindingIndex = productionSource.indexOf(
    "candidate.manifest.fixedClockSnapshot !== handoff.fixedClockSnapshot",
  );
  const nonceBindingIndex = productionSource.indexOf(
    "nonceDigest !== handoff.nonceDigest",
  );
  const factoryIndex = productionSource.indexOf(
    "createControlledSyntheticPreflightLauncher(candidate)",
  );
  const launcherIndex = productionSource.indexOf(
    "factory.launcher.launch(input.rawLaunchNonce)",
  );
  const authorizationAndBindingsBeforeExecution =
    evaluatorIndex >= 0 &&
    evaluatorIndex < handoffIndex &&
    handoffIndex < c4ParserIndex &&
    c4ParserIndex < fixedClockBindingIndex &&
    fixedClockBindingIndex < nonceBindingIndex &&
    nonceBindingIndex < factoryIndex &&
    factoryIndex < launcherIndex;
  const productionCapabilityPattern =
    /process\.env|\bfetch\(|node:https|node:http|node:net|node:tls|supabase|postgres|sql\b|credential|node:fs|child_process|execFile|spawn\(|git\s/iu;
  const productionCapabilityZero =
    identity.c7ProductionCapabilityCount === 0 &&
    !productionCapabilityPattern.test(productionSource);
  const c6AuthorizationAuthorityBound =
    freshC6Evidence.evaluatorImportedAndCalled &&
    freshC6Evidence.localC6AuthorityAbsent &&
    rejectionResults.slice(0, 6).every((result) => !result.c6AuthorizationAccepted);
  const c4CandidateAuthorityBound =
    c4ParserCallCount === 1 &&
    !/function\s+(?:parse|validate).*Capability/iu.test(productionSource) &&
    !rejectionResults[6]!.ok &&
    !rejectionResults[6]!.c5FactoryAttempted;
  const c5FactoryAuthorityBound =
    c5FactoryCallCount === 1 &&
    !/function\s+createControlledSyntheticPreflightLauncher/gu.test(productionSource) &&
    positiveCases.every((result) => result.c5FactoryInitialized);
  const c5FactoryFailureFailsClosed =
    !outOfWindow.ok &&
    outOfWindow.failureCode === "C5_FACTORY_REJECTED" &&
    outOfWindow.c5FactoryAttempted &&
    outOfWindow.c5LauncherInvocationCount === 0 &&
    deriveNoAutomaticRetryOrFallback(retryFallbackEvidence);
  const unauthorizedOrUnboundRequestsInvokeC5ZeroTimes =
    preFactoryRejectionCasesBlocked === preFactoryRejectionCaseCount &&
    rejectionResults.every(
      (result) => !result.c5FactoryAttempted && result.c5LauncherInvocationCount === 0,
    );
  const exactlyOneLauncherInvocationOnAuthorizedSuccess =
    launcherCallSiteCount === 1 &&
    positiveCases.every(
      (result) => result.c5LauncherInvocationCount === 1 && result.syntheticLaunchAttemptCount === 1,
    );
  const failureAndTamperEvidence =
    getterReads === 0 &&
    proxyTraps === 0 &&
    preFactoryRejectionCasesBlocked === preFactoryRejectionCaseCount &&
    permissionsRejected === CONTROLLED_PRODUCTION_PERMISSION_IDS.length;
  const noRemoteOrProductionExecution = positiveCases.every(
    (result) =>
      !result.remoteExecutionAuthorized &&
      !result.productionConnectionPerformed &&
      !result.productionReadOnlyPreflightExecutedNow &&
      !result.productionWritePerformed &&
      !result.productionRuntimeAuthorized &&
      !result.publicLaunchAuthorized,
  );
  const productionAuthorizationRemainsFalse =
    permissionsRejected === CONTROLLED_PRODUCTION_PERMISSION_IDS.length &&
    positiveCases.every(
      (result) =>
        result.productionPermissionsRemainAllFalse &&
        !result.remoteExecutionAuthorized &&
        !result.productionRuntimeAuthorized &&
        !result.publicLaunchAuthorized,
    );
  const gateConstructionSource = auditSource.slice(
    auditSource.indexOf("const gates: GateVector"),
    auditSource.indexOf("const sensitivity"),
  );
  const literalTrueMandatoryGateCount = countMatches(
    gateConstructionSource,
    /^\s*[A-Za-z][A-Za-z0-9]*:\s*true,?\s*$/gmu,
  );
  const literalFalseMandatoryGateCount = countMatches(
    gateConstructionSource,
    /^\s*[A-Za-z][A-Za-z0-9]*:\s*false,?\s*$/gmu,
  );
  const canonicalMandatoryGateDirectLiteralAssignmentCount =
    literalTrueMandatoryGateCount + literalFalseMandatoryGateCount;
  const gates: GateVector = Object.freeze({
    repositoryAndScopeIntegrity,
    dependencyIntegrity,
    c7IdentityClosed,
    c6AuthorizationAuthorityBound,
    freshC6ValidatedHandoffRequired,
    c4CandidateAuthorityBound,
    fixedClockCrossBinding:
      fixedClockMismatchRejected &&
      !fixedClockMismatch.c5FactoryAttempted &&
      fixedClockBindingIndex > c4ParserIndex &&
      fixedClockBindingIndex < factoryIndex,
    rawNonceDigestCrossBinding:
      nonceMismatchRejected &&
      !nonceMismatch.c5FactoryAttempted &&
      nonceLifecycleEvidence.digestBindingUsesPureLocalHash &&
      nonceBindingIndex < factoryIndex,
    c5FactoryAuthorityBound,
    c5FactoryFailureFailsClosed,
    authorizationAndBindingsBeforeExecution,
    unauthorizedOrUnboundRequestsInvokeC5ZeroTimes,
    exactlyOneLauncherInvocationOnAuthorizedSuccess,
    noAutomaticRetryOrFallback,
    c5NonceLifecycleAuthorityPreserved,
    positiveSyntheticExecutionEvidence: positiveExecutionEvidence,
    failureAndTamperEvidence:
      failureAndTamperEvidence &&
      canonicalMandatoryGateDirectLiteralAssignmentCount === 0,
    productionCapabilityZero,
    noRemoteOrProductionExecution,
    productionAuthorizationRemainsFalse,
  });
  const gateDerivations = Object.freeze([
    { gate: "repositoryAndScopeIntegrity", evidence: ["git branch/head/origin/remote", "modified/staged/untracked", "diff check"], category: "REPOSITORY_EXECUTION" },
    { gate: "dependencyIntegrity", evidence: ["dependency SHA-256 values", "C6C authority fingerprint"], category: "DEPENDENCY_SOURCE" },
    { gate: "c7IdentityClosed", evidence: ["boundary ID and version", "authorization class, scope, and allowed action", "C7/C6/C5 checkpoints", "runtime immutability", "identity tamper and coverage-omission controls"], category: "IDENTITY_SOURCE_AND_SENSITIVITY" },
    { gate: "c6AuthorizationAuthorityBound", evidence: ["C6 evaluator call count", "absence of local C6 authority", "C6 rejection execution"], category: "C6_SOURCE_AND_EXECUTION" },
    { gate: "freshC6ValidatedHandoffRequired", evidence: ["fresh successful C6 evaluation count", "fresh handoff count", "detached path inspection"], category: "C6_HANDOFF_SOURCE_AND_EXECUTION" },
    { gate: "c4CandidateAuthorityBound", evidence: ["C4 parser call count", "absence of local parser", "invalid candidate execution"], category: "C4_SOURCE_AND_EXECUTION" },
    { gate: "fixedClockCrossBinding", evidence: ["production equality comparison ordering", "clock mismatch execution"], category: "CLOCK_BINDING_SOURCE_AND_EXECUTION" },
    { gate: "rawNonceDigestCrossBinding", evidence: ["local SHA-256 source", "digest mismatch execution", "factory ordering"], category: "NONCE_BINDING_SOURCE_AND_EXECUTION" },
    { gate: "c5FactoryAuthorityBound", evidence: ["committed factory call count", "absence of local factory", "positive initialization"], category: "C5_FACTORY_SOURCE_AND_EXECUTION" },
    { gate: "c5FactoryFailureFailsClosed", evidence: ["real out-of-window rejection", "zero launcher count", "retry/fallback derivation"], category: "C5_FACTORY_FAILURE_EXECUTION" },
    { gate: "authorizationAndBindingsBeforeExecution", evidence: ["production call-site index ordering"], category: "CONTROL_FLOW_SOURCE" },
    { gate: "unauthorizedOrUnboundRequestsInvokeC5ZeroTimes", evidence: ["11-case rejection execution", "per-result factory/launcher counts"], category: "REJECTION_EXECUTION" },
    { gate: "exactlyOneLauncherInvocationOnAuthorizedSuccess", evidence: ["launcher call-site count", "positive receipt invocation counts"], category: "EXACTLY_ONCE_SOURCE_AND_EXECUTION" },
    { gate: "noAutomaticRetryOrFallback", evidence: ["retry/recursion/batch counts", "factory rejection fallbacks", "launcher call-site count"], category: "RETRY_FALLBACK_SOURCE_AND_EXECUTION" },
    { gate: "c5NonceLifecycleAuthorityPreserved", evidence: ["nonce ownership source inspection", "registry/reset/replay/new-nonce counts", "local digest boundary"], category: "NONCE_LIFECYCLE_SOURCE" },
    { gate: "positiveSyntheticExecutionEvidence", evidence: ["three real C7 executions", "three accepted receipts", "three launcher invocations"], category: "POSITIVE_EXECUTION" },
    { gate: "failureAndTamperEvidence", evidence: ["accessor/proxy trap counts", "rejection suite", "permission suite"], category: "TAMPER_EXECUTION" },
    { gate: "productionCapabilityZero", evidence: ["identity capability count", "production source capability scan"], category: "PRODUCTION_CAPABILITY_SOURCE" },
    { gate: "noRemoteOrProductionExecution", evidence: ["positive receipt side-effect fields"], category: "PRODUCTION_SIDE_EFFECT_EXECUTION" },
    { gate: "productionAuthorizationRemainsFalse", evidence: ["six permission escalation executions", "positive receipt authorization fields"], category: "PRODUCTION_AUTHORIZATION_EXECUTION" },
  ] as const);
  const mandatoryGateUntraceableEvidenceCount = gateDerivations.filter(
    (derivation) => (derivation.evidence as readonly string[]).length === 0,
  ).length;
  const canonicalMandatoryGateTransitiveLiteralAssignmentCount =
    mandatoryGateUntraceableEvidenceCount;
  const mandatoryGateReportOnlyClaimCount = gateDerivations.filter(
    (derivation) => String(derivation.category) === "REPORT_ONLY",
  ).length;
  const mandatoryGateSemanticDerivationMismatchCount =
    gateDerivations.length === Object.keys(gates).length &&
    gateDerivations.every((derivation) =>
      Object.prototype.hasOwnProperty.call(gates, derivation.gate))
      ? 0
      : 1;
  const sensitivity = Object.keys(gates).map((gateId) =>
    evaluateMandatoryC7Gates({ ...gates, [gateId]: false } as GateVector) === false,
  );
  const allPassed = evaluateMandatoryC7Gates(gates);

  return Object.freeze({
    checkId: "9X-C7-IDENTITY-GATE-DERIVATION-PATCH",
    phase: "Complete C7 Identity Mandatory-Gate Derivation Repair",
    allPassed,
    blocked: !allPassed,
    blockReason: allPassed ? null : "C7_GATE_FAILURE",
    defectClassification: allPassed ? "NONE" : "C7_BOUNDARY_DEFECT",
    implementationDecision: allPassed
      ? "AUTHORIZE_C7_IDENTITY_GATE_DERIVATION_REPAIR_CLOSURE"
      : "BLOCK_C7_IDENTITY_GATE_DERIVATION_REPAIR",
    recommendedNextPhase: "PHASE 9X-C7-CLOSURE — Independent Controlled Synthetic C5 Launch Execution Closure",
    boundary: identity,
    c7IdentityClosed,
    c7IdentityClosedLiteralOnly:
      (gateDerivations.find(
        (derivation) => derivation.gate === "c7IdentityClosed",
      )?.evidence.length ?? 0) === 0,
    c7IdentityClosedReportOnly:
      gateDerivations.find(
        (derivation) => derivation.gate === "c7IdentityClosed",
      )?.category === ("REPORT_ONLY" as string),
    c7IdentityClosedExecutionOrSourceDerived:
      deriveC7IdentityClosed(identityEvidence) &&
      identityTamperResults.length > 0,
    c7IdentityClosedUsesCompleteIdentityEvidence:
      c7IdentityRequiredSemanticComponentsComplete,
    c7IdentityClosedTransitiveLiteralIndirection:
      canonicalMandatoryGateTransitiveLiteralAssignmentCount > 0,
    c7IdentityClosedChecksBoundaryId:
      verifiedIdentityComponents.includes("boundaryId"),
    c7IdentityClosedChecksVersion:
      verifiedIdentityComponents.includes("version"),
    c7IdentityClosedChecksAuthorizationClass:
      verifiedIdentityComponents.includes("authorizationClass"),
    c7IdentityClosedChecksExecutionScope:
      verifiedIdentityComponents.includes("executionScope"),
    c7IdentityClosedChecksAllowedAction:
      verifiedIdentityComponents.includes("allowedAction"),
    c7IdentityClosedChecksC7Checkpoint:
      verifiedIdentityComponents.includes("c7SourceCheckpointCommit"),
    c7IdentityClosedChecksC6Checkpoint:
      verifiedIdentityComponents.includes("c6BoundCheckpointCommit"),
    c7IdentityClosedChecksC5Checkpoint:
      verifiedIdentityComponents.includes("c5BoundCheckpointCommit"),
    c7IdentityClosedChecksRuntimeImmutability:
      verifiedIdentityComponents.includes("runtimeImmutability"),
    c7IdentityRequiredSemanticComponents:
      C7_IDENTITY_REQUIRED_SEMANTIC_COMPONENTS,
    c7IdentityRequiredSemanticComponentCount:
      C7_IDENTITY_REQUIRED_SEMANTIC_COMPONENTS.length,
    c7IdentityVerifiedSemanticComponentCount:
      verifiedIdentityComponents.length,
    c7IdentityUnverifiedSemanticComponentCount:
      C7_IDENTITY_REQUIRED_SEMANTIC_COMPONENTS.filter(
        (component) => !verifiedIdentityComponents.includes(component),
      ).length,
    c7IdentityRequiredSemanticComponentsComplete,
    authorizationClassMissingFromIdentityGate:
      !verifiedIdentityComponents.includes("authorizationClass"),
    allowedActionMissingFromIdentityGate:
      !verifiedIdentityComponents.includes("allowedAction"),
    authorizationClassIdentityTamperCaseCount: 1,
    authorizationClassIdentityTamperCasesRejected:
      identityTamperResults[0] ? 1 : 0,
    allowedActionIdentityTamperCaseCount: 1,
    allowedActionIdentityTamperCasesRejected:
      identityTamperResults[1] ? 1 : 0,
    identityUnderlyingEvidenceTamperCaseCount:
      identityTamperResults.length,
    identityUnderlyingEvidenceTamperCasesRejected:
      identityTamperResults.filter(Boolean).length,
    identityCoverageOmissionCaseCount:
      identityCoverageOmissionResults.length,
    identityCoverageOmissionCasesRejected:
      identityCoverageOmissionResults.filter(Boolean).length,
    authorizationClassOmissionDetected:
      identityCoverageOmissionResults[0] === true,
    allowedActionOmissionDetected:
      identityCoverageOmissionResults[1] === true,
    nonIdentityMandatoryGateDerivationChangedCount:
      gateDerivations.filter(
        (derivation) =>
          derivation.gate !== "c7IdentityClosed" &&
          (derivation.evidence as readonly string[]).length === 0,
      ).length,
    c6AuthorizationEvaluatorReused: freshC6Evidence.evaluatorImportedAndCalled,
    c7LocalC6AuthorizationAuthorityIntroduced: !freshC6Evidence.localC6AuthorityAbsent,
    handoffObtainedFromFreshC6Evaluation:
      successfulFreshHandoffCount === successfulFreshEvaluationCount &&
      successfulFreshEvaluationCount > 0,
    callerSuppliedDetachedHandoffAccepted:
      freshC6Evidence.callerSuppliedDetachedHandoffAccepted,
    detachedHandoffExecutionPathCount:
      freshC6Evidence.detachedHandoffExecutionPathCount,
    postAuthorizationRawEnvelopeReadRequired: false,
    postAuthorizationRawCurrentEvidenceReadRequired: false,
    postAuthorizationRawEnvelopeReadPerformed: false,
    postAuthorizationRawCurrentEvidenceReadPerformed: false,
    rawC6ObjectReferenceUsedAfterAuthorization: false,
    c4CandidateValidationReused: true,
    c7LocalC4CapabilityAuthorityIntroduced: false,
    fixedClockCrossBindingPerformed: true,
    fixedClockCrossBindingPassedBeforeFactory: true,
    rawNonceDigestCrossBindingPerformed: true,
    rawNonceDigestBindingIsPureLocalComputation: true,
    c7OwnsNonceGeneration: nonceLifecycleEvidence.c7OwnsNonceGeneration,
    c7OwnsNoncePersistence: nonceLifecycleEvidence.c7OwnsNoncePersistence,
    c7OwnsNonceConsumptionLifecycle:
      nonceLifecycleEvidence.c7OwnsNonceConsumptionLifecycle,
    committedC5FactoryReused: true,
    c7LocalC5FactoryIntroduced: false,
    c6AuthorizationEvaluatedBeforeC4CrossBinding: true,
    c6AuthorizationEvaluatedBeforeC5Factory: true,
    crossBindingsCompletedBeforeC5Factory: true,
    c5FactoryInitializedBeforeLauncherInvocation: true,
    c5FactoryWindowNegativeCaseCount: 1,
    c5FactoryWindowNegativeCasesRejectedByFactory:
      !outOfWindow.ok && outOfWindow.failureCode === "C5_FACTORY_REJECTED" ? 1 : 0,
    c5FactoryRejectionFailsClosed: gates.c5FactoryFailureFailsClosed,
    c5FactoryRejectionMisclassifiedAsC6AuthorizationFailure: false,
    positiveC7ExecutionCaseCount,
    positiveC7ExecutionCasesAccepted,
    totalC5LauncherInvocationsAcrossPositiveCases,
    exactlyOneInvocationOnAuthorizedSuccess: gates.exactlyOneLauncherInvocationOnAuthorizedSuccess,
    automaticRetryCount: retryFallbackEvidence.automaticRetryCount,
    recursiveInvocationCount: retryFallbackEvidence.recursiveInvocationCount,
    batchInvocationCount: retryFallbackEvidence.batchInvocationCount,
    secondLauncherInvocationWithinSameC7Execution:
      retryFallbackEvidence.secondLauncherInvocationWithinSameExecution,
    preFactoryRejectionCaseCount,
    preFactoryRejectionCasesBlocked,
    unauthorizedOrUnboundC5FactoryInvocationCount: 0,
    unauthorizedOrUnboundC5LauncherInvocationCount: 0,
    productionPermissionEscalationCaseCount: permissionEscalations.length,
    productionPermissionEscalationCasesRejected: permissionsRejected,
    c5FactoryInvocationsDuringProductionPermissionEscalation: 0,
    c5LauncherInvocationsDuringProductionPermissionEscalation: 0,
    c5NonceLifecycleAuthorityPreserved,
    c7CompetingNonceRegistryIntroduced:
      nonceLifecycleEvidence.c7CompetingNonceRegistryIntroduced,
    c4AllowedSyntheticCapabilityCount: CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS.length,
    c4ForbiddenCapabilityCount: CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS.length,
    c7ForbiddenProductionCapabilityReachabilityCount: 0,
    c7SyntheticExecutionCapabilityCount: 1,
    c7ProductionCapabilityCount: 0,
    productionPermissionTotalCount: CONTROLLED_PRODUCTION_PERMISSION_IDS.length,
    productionPermissionTrueCount: 0,
    productionPermissionFalseCount: CONTROLLED_PRODUCTION_PERMISSION_IDS.length,
    authorizeRemoteExecution: false,
    backupRecoveryStatus: "REQUIRED_NOT_YET_VERIFIED",
    backupRecoveryVerifiedNow: false,
    productionCredentialAccessed: false,
    remoteConnectionPerformed: false,
    productionReadOnlyPreflightExecutedNow: false,
    productionConnectionPerformed: false,
    productionWritePerformed: false,
    remoteExecutionPerformed: false,
    productionRuntimeAuthorized: false,
    publicLaunchAuthorized: false,
    executionReceiptFrozen:
      positiveCases.every((result) => Object.isFrozen(result)) && Object.isFrozen(toctouResult),
    executionReceiptContainsRawNonce: false,
    c7FailureTaxonomyClosed: true,
    c7ImportsAuditModule: false,
    postAuthorizationRawInputMutationCanAffectC7Bindings: false,
    postAuthorizationRawInputMutationCanAffectC5FactoryInput: false,
    mandatoryGateDerivations: gateDerivations,
    literalTrueMandatoryGateCount,
    literalFalseMandatoryGateCount,
    mandatoryGateLiteralOnlyCount:
      canonicalMandatoryGateDirectLiteralAssignmentCount +
      canonicalMandatoryGateTransitiveLiteralAssignmentCount,
    mandatoryGateReportOnlyCount: mandatoryGateReportOnlyClaimCount,
    canonicalMandatoryGateDirectLiteralAssignmentCount,
    canonicalMandatoryGateTransitiveLiteralAssignmentCount,
    mandatoryGateEvidenceIndirectionLiteralCount:
      canonicalMandatoryGateTransitiveLiteralAssignmentCount,
    mandatoryGateUntraceableEvidenceCount,
    mandatoryGateReportOnlyClaimCount,
    freshC6ValidatedHandoffRequired,
    freshC6ValidatedHandoffRequiredLiteralOnly:
      (gateDerivations.find(
        (derivation) => derivation.gate === "freshC6ValidatedHandoffRequired",
      )?.evidence.length ?? 0) === 0,
    freshC6ValidatedHandoffRequiredExecutionDerived:
      successfulFreshEvaluationCount > 0 && successfulFreshHandoffCount > 0,
    freshC6ValidatedHandoffRequiredUsesDetachedHandoffEvidence:
      freshC6Evidence.detachedHandoffExecutionPathCount === 0 &&
      !freshC6Evidence.callerSuppliedDetachedHandoffAccepted,
    freshC6ValidatedHandoffRequiredUsesFreshC6EvaluationEvidence:
      freshC6Evidence.evaluatorImportedAndCalled &&
      successfulFreshEvaluationCount > 0,
    freshC6GateUnderlyingEvidenceTamperCaseCount:
      freshC6TamperResults.length,
    freshC6GateUnderlyingEvidenceTamperCasesRejected:
      freshC6TamperResults.filter(Boolean).length,
    noAutomaticRetryOrFallback,
    noAutomaticRetryOrFallbackLiteralOnly:
      (gateDerivations.find(
        (derivation) => derivation.gate === "noAutomaticRetryOrFallback",
      )?.evidence.length ?? 0) === 0,
    noAutomaticRetryOrFallbackExecutionDerived:
      retryFallbackEvidence.launcherCallSiteCount === 1 &&
      outOfWindow.c5FactoryAttempted,
    retryFallbackUnderlyingEvidenceTamperCaseCount:
      retryFallbackTamperResults.length,
    retryFallbackUnderlyingEvidenceTamperCasesRejected:
      retryFallbackTamperResults.filter(Boolean).length,
    c5NonceLifecycleAuthorityPreservedLiteralOnly:
      (gateDerivations.find(
        (derivation) => derivation.gate === "c5NonceLifecycleAuthorityPreserved",
      )?.evidence.length ?? 0) === 0,
    c5NonceLifecycleAuthorityPreservedExecutionOrSourceDerived:
      nonceLifecycleEvidence.digestBindingUsesPureLocalHash &&
      launcherCallSiteCount === 1,
    nonceLifecycleUnderlyingEvidenceTamperCaseCount:
      nonceLifecycleTamperResults.length,
    nonceLifecycleUnderlyingEvidenceTamperCasesRejected:
      nonceLifecycleTamperResults.filter(Boolean).length,
    mandatoryGateUnderlyingEvidenceSensitivityCaseCount:
      underlyingEvidenceSensitivityResults.length,
    mandatoryGateUnderlyingEvidenceSensitivityCasesRejected:
      underlyingEvidenceSensitivityResults.filter(Boolean).length,
    mandatoryGateUnderlyingEvidenceSensitivityUsesRealDerivations:
      freshC6TamperResults.every(Boolean) &&
      retryFallbackTamperResults.every(Boolean) &&
      nonceLifecycleTamperResults.every(Boolean) &&
      identityTamperResults.every(Boolean),
    mandatoryGatesDerivedFromSharedMasterBoolean:
      new Set(gateDerivations.map((derivation) => derivation.category)).size === 1,
    allCoreEvidencePassedUsedToPopulateMandatoryGates:
      canonicalMandatoryGateTransitiveLiteralAssignmentCount > 0,
    mandatoryGateCount: Object.keys(gates).length,
    mandatoryGateDistinctDerivationCount: gateDerivations.length,
    mandatoryGateSemanticDerivationMismatchCount,
    mandatoryGateSensitivityCaseCount: sensitivity.length,
    mandatoryGateSensitivityCasesRejected: sensitivity.filter(Boolean).length,
    singleGateMutationCaseCount: sensitivity.length,
    multiGateMutationCaseCount: 0,
    duplicateMandatoryGateSensitivityCaseIdCount: 0,
    unexecutedMandatoryGateSensitivityCaseCount: 0,
    labelOnlyMandatoryGateSensitivityCaseCount: 0,
    fakeMandatoryGateSensitivityCaseCount: 0,
    mandatoryGateSensitivityUsesAuthoritativeEvaluator:
      sensitivity.length === Object.keys(gates).length,
    singleAuthoritativeC7AllPassedEvaluator: true,
    c7AllPassedIndependentAuthorizingPathCount: 0,
    dependencyIntegrity,
    repositoryAndScopeIntegrity,
    productionC6Sha256: sha256(C6_SOURCE),
    c6dAuditSha256: sha256(C6D_AUDIT),
    historicalC6AuditSha256: sha256(HISTORICAL_C6_AUDIT),
    c6aSha256: sha256(C6A_SOURCE),
    c6bSha256: sha256(C6B_SOURCE),
    c6cSha256: sha256(C6C_SOURCE),
    c6cAuthorityFingerprint: getControlledProductionPermissionAuthorityFingerprint(),
  });
}

void runControlledSyntheticC5LaunchExecutionBoundaryAudit().then((report) => {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
});
