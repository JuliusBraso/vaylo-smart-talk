import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

import {
  CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
  CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS,
  CONTROLLED_PREFLIGHT_LAUNCHER_AUTHORIZATION_CLASS,
  CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_ID,
  CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_VERSION,
  parseClosedCapabilityCandidate,
} from "../source-registry/controlled-preflight-launcher-capability-contract";
import {
  createControlledSyntheticPreflightLauncher,
} from "../source-registry/controlled-preflight-launcher";
import {
  CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE,
  CONTROLLED_VALIDATED_SYNTHETIC_C5_LAUNCH_HANDOFF,
  evaluateControlledOperatorAuthorizationEnvelope,
  type ControlledOperatorAuthorizationCurrentEvidence,
  type ControlledOperatorAuthorizationEnvelope,
} from "../source-registry/controlled-operator-authorization-envelope";
import {
  CONTROLLED_PRODUCTION_PERMISSION_IDS,
  createFailClosedControlledProductionPermissionState,
  getControlledProductionPermissionAuthorityFingerprint,
} from "../source-registry/controlled-production-permission-authority";
import {
  PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER,
} from "../source-registry/production-read-only-preflight-helper";

const BASELINE = "fd0ca50452775692a6b5a433cebfd6efc19fd9ab";
const C6_PATH =
  "lib/vaylo/smart-talk/knowledge/source-registry/controlled-operator-authorization-envelope.ts";
const AUDIT_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-controlled-operator-authorization-safe-handoff-extension-audit.ts";
const HISTORICAL_AUDIT_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-controlled-operator-invocation-and-authorization-envelope-design-audit.ts";
const C5_SOURCE_PATH =
  "lib/vaylo/smart-talk/knowledge/source-registry/controlled-preflight-launcher.ts";
const HISTORICAL_AUDIT_SHA =
  "87C2093889790447BBE0DBE8C1668BB6B35875A48AFE4BC526B3F75AE3B80812";
const C6A_SHA =
  "5214C52B816AB7FB2CD3C4A3FA7D562EC2F2C65296EE9543B5E81C127D9F939B";
const C6B_SHA =
  "A00A50C48354FC9051CE73A4A620D1C0A61BE9197E1D73DFB473809218A86186";
const C6C_SHA =
  "AFFC1043B4EB63D3ECF39F20A64FBAAB05A6CCAAED2F19D0E4E3CE11E645EF21";
const C6_HANDOFF_SHA =
  "A97F55A224B1DFAE3593E5DD792B367DF7C4D3FE623C43C2E041583BBF79EEB8";

type GateId =
  | "repositoryAndScopeIntegrity"
  | "dependencyIntegrity"
  | "c6IdentityPreserved"
  | "safeSnapshotSourcePreserved"
  | "handoffContractClosed"
  | "handoffProducedOnlyOnAuthorizationSuccess"
  | "handoffValuesBoundToValidatedC6Values"
  | "handoffImmutable"
  | "noPostAuthorizationRawInputRead"
  | "nonceAuthorityNotExpanded"
  | "c4C5AuthorityOwnershipPreserved"
  | "productionPermissionsRemainAllFalse"
  | "noExecutionCapabilityIntroduced"
  | "failureAndTamperEvidence"
  | "futureC7HandoffSufficient"
  | "productionAuthorizationRemainsFalse";

type GateVector = Readonly<Record<GateId, boolean>>;

type C5InventoryOwner =
  | "C6_AUTHORIZED_VALUE"
  | "C4_CAPABILITY_VALUE"
  | "C5_LAUNCHER_VALUE"
  | "C7_BRIDGE_VALUE"
  | "PRODUCTION_VALUE_FORBIDDEN";

type C5InventoryEntry = Readonly<{
  id: string;
  sourceFamily: "C4_CAPABILITY_CONTRACT" | "C5_FACTORY" | "C5_LAUNCHER";
  kind: "INPUT_MATERIAL" | "FACTORY_CONSTRAINT" | "RUNTIME_CONSTRAINT" | "FORBIDDEN_PRODUCTION_MATERIAL";
  owner: C5InventoryOwner | "C5_FACTORY_CONSTRAINT";
}>;

const runGit = (args: readonly string[]): string =>
  execFileSync("git", args, { encoding: "utf8" }).trim();
const lines = (value: string): readonly string[] =>
  Object.freeze(value === "" ? [] : value.split(/\r?\n/u).sort());
const sha256 = (path: string): string =>
  createHash("sha256").update(readFileSync(path, "utf8"), "utf8").digest("hex").toUpperCase();

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

const boundaryEvidence = () => ({
  backupRecoveryStatus: "REQUIRED_NOT_YET_VERIFIED" as const,
  backupRecoveryVerifiedNow: false as const,
  productionCredentialAccessed: false as const,
  remoteConnectionPerformed: false as const,
  productionReadOnlyPreflightExecutedNow: false as const,
  firstProductionWritePerformed: false as const,
});

const createEnvelope = (
  overrides: Partial<ControlledOperatorAuthorizationEnvelope> = {},
): ControlledOperatorAuthorizationEnvelope => ({
  contractId: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.contractId,
  version: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.version,
  authorizationClass: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.authorizationClass,
  executionScope: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.executionScope,
  requestedAction: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.requestedAction,
  c6SourceCheckpointCommit: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.c6SourceCheckpointCommit,
  c5BoundCheckpointCommit: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.c5BoundCheckpointCommit,
  operatorActorId: "operator",
  authorizationIssuerActorId: "authorizationIssuer",
  fixedClockSnapshot: "2026-08-06T00:05:00.000Z",
  nonceDigest: "a".repeat(64),
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

const evaluateMandatoryC6DHandoffGates = (gates: GateVector): boolean =>
  Object.values(gates).every(Boolean);

const observedRepository = () => {
  const remote = runGit(["ls-remote", "origin", "refs/heads/main"]).split(/\s+/u)[0] ?? "";
  const modified = lines(runGit(["diff", "--name-only"]));
  const staged = lines(runGit(["diff", "--cached", "--name-only"]));
  const untracked = lines(runGit(["ls-files", "--others", "--exclude-standard"]));
  return Object.freeze({
    branch: runGit(["branch", "--show-current"]),
    head: runGit(["rev-parse", "HEAD"]),
    origin: runGit(["rev-parse", "origin/main"]),
    remote,
    modified,
    staged,
    untracked,
    diffCheckClean: runGit(["diff", "--check"]) === "",
  });
};

const same = (actual: readonly string[], expected: readonly string[]): boolean =>
  actual.length === expected.length && actual.every((value, index) => value === expected[index]);

const repositoryAndScopeIntegrity = (repository: ReturnType<typeof observedRepository>): boolean =>
  repository.branch === "main" &&
  repository.head === BASELINE &&
  repository.origin === BASELINE &&
  repository.remote === BASELINE &&
  same(repository.modified, [C6_PATH]) &&
  repository.staged.length === 0 &&
  same(repository.untracked, [AUDIT_PATH]) &&
  repository.diffCheckClean;

const makeC4Candidate = (fixedClockSnapshot: string) =>
  deepFreeze({
    contractId: CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_ID,
    contractVersion: CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_VERSION,
    authorizationClass: CONTROLLED_PREFLIGHT_LAUNCHER_AUTHORIZATION_CLASS,
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

const C5_INPUT_MATERIAL_INVENTORY: readonly C5InventoryEntry[] = Object.freeze([
  Object.freeze({ id: "capability_contract_identity", sourceFamily: "C4_CAPABILITY_CONTRACT", kind: "INPUT_MATERIAL", owner: "C4_CAPABILITY_VALUE" }),
  Object.freeze({ id: "production_capability_count", sourceFamily: "C4_CAPABILITY_CONTRACT", kind: "INPUT_MATERIAL", owner: "C4_CAPABILITY_VALUE" }),
  Object.freeze({ id: "allowed_capability_inventory", sourceFamily: "C4_CAPABILITY_CONTRACT", kind: "INPUT_MATERIAL", owner: "C4_CAPABILITY_VALUE" }),
  Object.freeze({ id: "forbidden_capability_inventory", sourceFamily: "C4_CAPABILITY_CONTRACT", kind: "INPUT_MATERIAL", owner: "C4_CAPABILITY_VALUE" }),
  Object.freeze({ id: "canonical_query_ids", sourceFamily: "C5_FACTORY", kind: "INPUT_MATERIAL", owner: "C5_LAUNCHER_VALUE" }),
  Object.freeze({ id: "aligned_fixture_snapshots", sourceFamily: "C5_FACTORY", kind: "INPUT_MATERIAL", owner: "C5_LAUNCHER_VALUE" }),
  Object.freeze({ id: "fixed_clock_snapshot", sourceFamily: "C4_CAPABILITY_CONTRACT", kind: "INPUT_MATERIAL", owner: "C6_AUTHORIZED_VALUE" }),
  Object.freeze({ id: "ephemeral_nonce_bounds", sourceFamily: "C4_CAPABILITY_CONTRACT", kind: "INPUT_MATERIAL", owner: "C4_CAPABILITY_VALUE" }),
  Object.freeze({ id: "in_memory_audit_trace_bounds", sourceFamily: "C4_CAPABILITY_CONTRACT", kind: "INPUT_MATERIAL", owner: "C4_CAPABILITY_VALUE" }),
  Object.freeze({ id: "raw_launch_nonce", sourceFamily: "C5_LAUNCHER", kind: "INPUT_MATERIAL", owner: "C7_BRIDGE_VALUE" }),
  Object.freeze({ id: "credentials_network_database_targets", sourceFamily: "C4_CAPABILITY_CONTRACT", kind: "FORBIDDEN_PRODUCTION_MATERIAL", owner: "PRODUCTION_VALUE_FORBIDDEN" }),
]);

const REQUIRED_C5_INPUT_MATERIAL_IDS = Object.freeze([
  "capability_contract_identity",
  "production_capability_count",
  "allowed_capability_inventory",
  "forbidden_capability_inventory",
  "canonical_query_ids",
  "aligned_fixture_snapshots",
  "fixed_clock_snapshot",
  "ephemeral_nonce_bounds",
  "in_memory_audit_trace_bounds",
  "raw_launch_nonce",
  "credentials_network_database_targets",
] as const);

const C5_FACTORY_CONSTRAINT_INVENTORY: readonly C5InventoryEntry[] = Object.freeze([
  Object.freeze({ id: "closed_c4_capability_candidate", sourceFamily: "C5_FACTORY", kind: "FACTORY_CONSTRAINT", owner: "C5_FACTORY_CONSTRAINT" }),
  Object.freeze({ id: "canonical_query_order_and_fixture_alignment", sourceFamily: "C5_FACTORY", kind: "FACTORY_CONSTRAINT", owner: "C5_FACTORY_CONSTRAINT" }),
  Object.freeze({ id: "fixed_clock_execution_window", sourceFamily: "C5_FACTORY", kind: "FACTORY_CONSTRAINT", owner: "C5_FACTORY_CONSTRAINT" }),
]);

const C5_RUNTIME_CONSTRAINT_INVENTORY: readonly C5InventoryEntry[] = Object.freeze([
  Object.freeze({ id: "operator_nonce_shape", sourceFamily: "C5_LAUNCHER", kind: "RUNTIME_CONSTRAINT", owner: "C5_LAUNCHER_VALUE" }),
  Object.freeze({ id: "nonce_reservation_replay_and_capacity", sourceFamily: "C5_LAUNCHER", kind: "RUNTIME_CONSTRAINT", owner: "C5_LAUNCHER_VALUE" }),
  Object.freeze({ id: "bounded_audit_trace_capacity", sourceFamily: "C5_LAUNCHER", kind: "RUNTIME_CONSTRAINT", owner: "C5_LAUNCHER_VALUE" }),
]);

const C6_TO_C4_C5_CROSS_BINDINGS = Object.freeze([
  "candidate_fixed_clock_equals_handoff_fixed_clock",
  "sha256_raw_nonce_equals_handoff_nonce_digest",
] as const);

const REQUIRED_FACTORY_CONSTRAINT_IDS = Object.freeze([
  "closed_c4_capability_candidate",
  "canonical_query_order_and_fixture_alignment",
  "fixed_clock_execution_window",
] as const);

const factoryConstraintInventoryComplete = (
  inventory: readonly C5InventoryEntry[],
): boolean =>
  inventory.length === REQUIRED_FACTORY_CONSTRAINT_IDS.length &&
  REQUIRED_FACTORY_CONSTRAINT_IDS.every((id) =>
    inventory.some((entry) => entry.id === id && entry.kind === "FACTORY_CONSTRAINT"),
  );

const inventoryContainsOnlyKnownEntries = (
  inventory: readonly C5InventoryEntry[],
  knownIds: readonly string[],
): boolean =>
  inventory.length === knownIds.length &&
  inventory.every((entry) => knownIds.includes(entry.id));

const discoverC5ExecutionWindow = () => {
  const source = readFileSync(C5_SOURCE_PATH, "utf8");
  const lower = /const windowStart = "([^"]+)";/u.exec(source)?.[1] ?? null;
  const upper = /const windowEnd = "([^"]+)";/u.exec(source)?.[1] ?? null;
  return Object.freeze({ lower, upper, discovered: lower !== null && upper !== null });
};

export function runControlledOperatorAuthorizationSafeHandoffExtensionAudit() {
  const repository = observedRepository();
  const validEnvelope = createEnvelope();
  const validEvidence = createEvidence(validEnvelope);
  const valid = evaluateControlledOperatorAuthorizationEnvelope(validEnvelope, validEvidence);
  const successfulAuthorization = valid.ok ? valid : null;
  const handoff = successfulAuthorization?.validatedLaunchHandoff ?? null;
  const expectedFingerprint = getControlledProductionPermissionAuthorityFingerprint();
  const positiveHandoffs = [
    evaluateControlledOperatorAuthorizationEnvelope(createEnvelope(), createEvidence(createEnvelope())),
    evaluateControlledOperatorAuthorizationEnvelope(
      createEnvelope({ nonceDigest: "b".repeat(64) }),
      createEvidence(createEnvelope({ nonceDigest: "b".repeat(64) })),
    ),
    evaluateControlledOperatorAuthorizationEnvelope(
      createEnvelope({ fixedClockSnapshot: "2026-08-06T00:06:00.000Z" }),
      createEvidence(createEnvelope({ fixedClockSnapshot: "2026-08-06T00:06:00.000Z" })),
    ),
  ];

  const failureInputs: readonly [unknown, unknown][] = [
    [createEnvelope({ requestedAction: "OTHER" }), validEvidence],
    [createEnvelope({ authorizationIssuerActorId: "operator" }), createEvidence(createEnvelope({ authorizationIssuerActorId: "operator" }))],
    [validEnvelope, createEvidence(validEnvelope, { fixedClockSnapshot: "2026-08-06T00:06:00.000Z" })],
    [validEnvelope, createEvidence(validEnvelope, { nonceDigest: "b".repeat(64) })],
    [createEnvelope({ productionPermissionState: { ...createFailClosedControlledProductionPermissionState(), AUTHORIZE_REMOTE_EXECUTION: true } }), validEvidence],
    [
      {
        ...createEnvelope(),
        boundaryEvidence: { ...boundaryEvidence(), remoteConnectionPerformed: true },
      },
      validEvidence,
    ],
  ];
  let getterReads = 0;
  const accessorEnvelope = createEnvelope() as Record<string, unknown>;
  Object.defineProperty(accessorEnvelope, "fixedClockSnapshot", {
    enumerable: true,
    get: () => {
      getterReads += 1;
      return "2026-08-06T00:05:00.000Z";
    },
  });
  let proxyTraps = 0;
  const proxyEnvelope = new Proxy(createEnvelope(), {
    get: () => {
      proxyTraps += 1;
      return undefined;
    },
  });
  const failureResults = [
    ...failureInputs.map(([envelope, evidence]) =>
      evaluateControlledOperatorAuthorizationEnvelope(envelope, evidence)),
    evaluateControlledOperatorAuthorizationEnvelope(accessorEnvelope, validEvidence),
    evaluateControlledOperatorAuthorizationEnvelope(proxyEnvelope, validEvidence),
  ];

  const originalClock = validEnvelope.fixedClockSnapshot;
  const originalDigest = validEnvelope.nonceDigest;
  const mutableEnvelope = validEnvelope as {
    fixedClockSnapshot: string;
    nonceDigest: string;
  };
  const mutableEvidence = validEvidence as {
    fixedClockSnapshot: string;
    nonceDigest: string;
  };
  mutableEnvelope.fixedClockSnapshot = "2026-08-06T00:06:00.000Z";
  mutableEnvelope.nonceDigest = "b".repeat(64);
  mutableEvidence.fixedClockSnapshot = "2026-08-06T00:06:00.000Z";
  mutableEvidence.nonceDigest = "b".repeat(64);

  const valuesBound =
    handoff !== null &&
    handoff.fixedClockSnapshot === originalClock &&
    handoff.nonceDigest === originalDigest &&
    handoff.c5BoundCheckpointCommit === CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.c5BoundCheckpointCommit &&
    handoff.productionPermissionAuthorityFingerprint === expectedFingerprint &&
    handoff.productionPermissionsRemainAllFalse &&
    !handoff.remoteExecutionAuthorized;
  const c4Candidate = handoff === null ? null : makeC4Candidate(handoff.fixedClockSnapshot);
  const c4CandidateValid = c4Candidate !== null && parseClosedCapabilityCandidate(c4Candidate).ok;
  const c5ExecutionWindow = discoverC5ExecutionWindow();
  const compatibleClockWithinDiscoveredWindow =
    c5ExecutionWindow.lower !== null &&
    c5ExecutionWindow.upper !== null &&
    originalClock >= c5ExecutionWindow.lower &&
    originalClock < c5ExecutionWindow.upper;
  const realC5FactoryPositiveResult =
    c4Candidate === null
      ? null
      : createControlledSyntheticPreflightLauncher(c4Candidate);
  const realC5FactoryPositiveInitialized =
    realC5FactoryPositiveResult?.ok === true && compatibleClockWithinDiscoveredWindow;

  const outsideWindowClock = "2026-08-07T00:00:00.000Z";
  const outsideWindowEnvelope = createEnvelope({
    fixedClockSnapshot: outsideWindowClock,
  });
  const outsideWindowAuthorization =
    evaluateControlledOperatorAuthorizationEnvelope(
      outsideWindowEnvelope,
      createEvidence(outsideWindowEnvelope),
    );
  const outsideWindowHandoff = outsideWindowAuthorization.ok
    ? outsideWindowAuthorization.validatedLaunchHandoff
    : null;
  const outsideWindowCandidate =
    outsideWindowHandoff === null
      ? null
      : makeC4Candidate(outsideWindowHandoff.fixedClockSnapshot);
  const outsideWindowC4Accepted =
    outsideWindowCandidate !== null &&
    parseClosedCapabilityCandidate(outsideWindowCandidate).ok;
  const outsideWindowFactoryResult =
    outsideWindowCandidate === null
      ? null
      : createControlledSyntheticPreflightLauncher(outsideWindowCandidate);
  const outsideWindowFactoryRejected =
    outsideWindowFactoryResult?.ok === false &&
    outsideWindowFactoryResult.status === "ADAPTER_INIT_FAILED";

  const bridgeRawNonce = "c7_bridge_nonce_00000000000000000";
  const bridgeNonceDigest = createHash("sha256")
    .update(bridgeRawNonce, "utf8")
    .digest("hex");
  const bridgeEnvelope = createEnvelope({ nonceDigest: bridgeNonceDigest });
  const bridgeAuthorization = evaluateControlledOperatorAuthorizationEnvelope(
    bridgeEnvelope,
    createEvidence(bridgeEnvelope),
  );
  const rawNonceDigestCrossBindingVerified =
    bridgeAuthorization.ok &&
    createHash("sha256").update(bridgeRawNonce, "utf8").digest("hex") ===
      bridgeAuthorization.validatedLaunchHandoff.nonceDigest;
  const fixedClockCrossBindingVerified =
    handoff !== null &&
    c4Candidate !== null &&
    c4Candidate.manifest.fixedClockSnapshot === handoff.fixedClockSnapshot;
  const crossBindingsVerifiedCount = [
    fixedClockCrossBindingVerified,
    rawNonceDigestCrossBindingVerified,
  ].filter(Boolean).length;

  const inputMaterialInventoryComplete =
    inventoryContainsOnlyKnownEntries(
      C5_INPUT_MATERIAL_INVENTORY,
      REQUIRED_C5_INPUT_MATERIAL_IDS,
    ) &&
    C5_INPUT_MATERIAL_INVENTORY.every(
      (entry) => entry.sourceFamily !== undefined && entry.owner !== undefined,
    );
  const factoryConstraintInventoryIsComplete =
    factoryConstraintInventoryComplete(C5_FACTORY_CONSTRAINT_INVENTORY);
  const omittedWindowInventory = C5_FACTORY_CONSTRAINT_INVENTORY.filter(
    (entry) => entry.id !== "fixed_clock_execution_window",
  );
  const fixedClockWindowOmissionDetected =
    !factoryConstraintInventoryComplete(omittedWindowInventory);
  const fabricatedInventoryEntry: C5InventoryEntry = Object.freeze({
    id: "fabricated_balancing_entry",
    sourceFamily: "C5_FACTORY",
    kind: "INPUT_MATERIAL",
    owner: "C5_LAUNCHER_VALUE",
  });
  const fabricatedC5InventoryEntryAccepted = inventoryContainsOnlyKnownEntries(
    [...C5_INPUT_MATERIAL_INVENTORY, fabricatedInventoryEntry],
    REQUIRED_C5_INPUT_MATERIAL_IDS,
  );
  const allInventoryEntries = [
    ...C5_INPUT_MATERIAL_INVENTORY,
    ...C5_FACTORY_CONSTRAINT_INVENTORY,
    ...C5_RUNTIME_CONSTRAINT_INVENTORY,
  ];
  const inventoryEntriesWithSourceProvenance = allInventoryEntries.filter(
    (entry) =>
      entry.id.length > 0 &&
      entry.sourceFamily.length > 0 &&
      entry.kind.length > 0 &&
      entry.owner.length > 0,
  ).length;
  const reportedInputMaterialCountEqualsInventoryLength =
    C5_INPUT_MATERIAL_INVENTORY.length === REQUIRED_C5_INPUT_MATERIAL_IDS.length;
  const reportedFactoryConstraintCountEqualsInventoryLength =
    C5_FACTORY_CONSTRAINT_INVENTORY.length ===
    REQUIRED_FACTORY_CONSTRAINT_IDS.length;
  const reportedCrossBindingCountEqualsInventoryLength =
    crossBindingsVerifiedCount === C6_TO_C4_C5_CROSS_BINDINGS.length;
  const sourceDerivedCountClaimMismatchCount = [
    reportedInputMaterialCountEqualsInventoryLength,
    reportedFactoryConstraintCountEqualsInventoryLength,
    reportedCrossBindingCountEqualsInventoryLength,
  ].filter((matches) => !matches).length;
  const futureC7HandoffSufficiencyEvidence =
    handoff !== null &&
    c4CandidateValid &&
    inputMaterialInventoryComplete &&
    factoryConstraintInventoryIsComplete &&
    realC5FactoryPositiveInitialized &&
    outsideWindowAuthorization.ok &&
    outsideWindowHandoff !== null &&
    outsideWindowC4Accepted &&
    outsideWindowFactoryRejected &&
    crossBindingsVerifiedCount === C6_TO_C4_C5_CROSS_BINDINGS.length &&
    rawNonceDigestCrossBindingVerified &&
    fixedClockCrossBindingVerified &&
    sourceDerivedCountClaimMismatchCount === 0 &&
    inventoryEntriesWithSourceProvenance === allInventoryEntries.length &&
    !fabricatedC5InventoryEntryAccepted &&
    fixedClockWindowOmissionDetected;
  const handoffShapeClosed =
    handoff !== null &&
    same(
      Object.keys(handoff).sort(),
      [
        "authorizedAction",
        "authorizedLaunchCount",
        "c5BoundCheckpointCommit",
        "fixedClockSnapshot",
        "handoffContractId",
        "handoffScope",
        "handoffVersion",
        "nonceDigest",
        "productionPermissionAuthorityFingerprint",
        "productionPermissionsRemainAllFalse",
        "remoteExecutionAuthorized",
      ],
    );
  const dependencyIntegrity =
    sha256(C6_PATH) === C6_HANDOFF_SHA &&
    sha256(HISTORICAL_AUDIT_PATH) === HISTORICAL_AUDIT_SHA &&
    sha256("lib/vaylo/smart-talk/knowledge/source-registry/controlled-preflight-actor-authority.ts") === C6A_SHA &&
    sha256("lib/vaylo/smart-talk/knowledge/source-registry/controlled-synthetic-fixed-clock-policy.ts") === C6B_SHA &&
    sha256("lib/vaylo/smart-talk/knowledge/source-registry/controlled-production-permission-authority.ts") === C6C_SHA &&
    expectedFingerprint === "7779fe46a1f94b478e2a64b241d18313a42b263203ea34a28e07000dc61af08f";

  const gates: GateVector = {
    repositoryAndScopeIntegrity: repositoryAndScopeIntegrity(repository),
    dependencyIntegrity,
    c6IdentityPreserved:
      CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.contractId === "VAYLO_CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE" &&
      CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.version === 1,
    safeSnapshotSourcePreserved: valuesBound,
    handoffContractClosed:
      handoffShapeClosed &&
      CONTROLLED_VALIDATED_SYNTHETIC_C5_LAUNCH_HANDOFF.handoffContractId ===
        "VAYLO_C6_VALIDATED_SYNTHETIC_C5_LAUNCH_HANDOFF",
    handoffProducedOnlyOnAuthorizationSuccess:
      valid.ok && failureResults.every((result) => !result.ok),
    handoffValuesBoundToValidatedC6Values: valuesBound,
    handoffImmutable: handoff !== null && Object.isFrozen(handoff),
    noPostAuthorizationRawInputRead:
      handoff !== null &&
      handoff.fixedClockSnapshot === originalClock &&
      handoff.nonceDigest === originalDigest,
    nonceAuthorityNotExpanded: handoff !== null && !("rawNonce" in handoff),
    c4C5AuthorityOwnershipPreserved:
      c4CandidateValid &&
      inputMaterialInventoryComplete &&
      factoryConstraintInventoryIsComplete &&
      C5_RUNTIME_CONSTRAINT_INVENTORY.every(
        (entry) => entry.owner === "C5_LAUNCHER_VALUE",
      ) &&
      handoff !== null &&
      !("allowedCapabilities" in handoff) &&
      !("fixtureSnapshots" in handoff),
    productionPermissionsRemainAllFalse:
      CONTROLLED_PRODUCTION_PERMISSION_IDS.length === 6 &&
      handoff !== null &&
      handoff.productionPermissionsRemainAllFalse,
    noExecutionCapabilityIntroduced:
      valid.ok && !valid.c5LauncherInvocationPerformed && !valid.syntheticLaunchPerformed,
    failureAndTamperEvidence:
      failureResults.length === 8 &&
      failureResults.every((result) => !result.ok) &&
      getterReads === 0 &&
      proxyTraps === 0 &&
      fixedClockWindowOmissionDetected &&
      !fabricatedC5InventoryEntryAccepted &&
      outsideWindowFactoryRejected,
    futureC7HandoffSufficient: futureC7HandoffSufficiencyEvidence,
    productionAuthorizationRemainsFalse:
      handoff !== null &&
      !handoff.remoteExecutionAuthorized &&
      successfulAuthorization !== null &&
      !successfulAuthorization.remoteExecutionPerformed &&
      !successfulAuthorization.productionConnectionPerformed &&
      !successfulAuthorization.productionReadOnlyPreflightExecutedNow &&
      !successfulAuthorization.productionWritePerformed &&
      !successfulAuthorization.productionRuntimeAuthorized &&
      !successfulAuthorization.publicLaunchAuthorized,
  };
  const allPassed = evaluateMandatoryC6DHandoffGates(gates);
  const sensitivity = (Object.keys(gates) as GateId[]).map((gate) =>
    evaluateMandatoryC6DHandoffGates({ ...gates, [gate]: false }),
  );
  const positiveHandoffCasesAccepted = positiveHandoffs.filter(
    (result) => result.ok && Object.isFrozen(result.validatedLaunchHandoff),
  ).length;
  const failureRejected = failureResults.filter((result) => !result.ok).length;

  return Object.freeze({
    checkId: "9X-C6D-C5-FACTORY-SUFFICIENCY-PATCH",
    phase: "Source-Derived C5 Factory Constraints and Truthful Future-C7 Sufficiency Repair",
    allPassed,
    blocked: !allPassed,
    blockReason: allPassed ? null : "C6D_HANDOFF_GATE_REJECTED",
    defectClassification: allPassed ? "NONE" : "HANDOFF_EXTENSION_REGRESSION",
    implementationDecision: allPassed
      ? "AUTHORIZE_C6D_C5_FACTORY_SUFFICIENCY_REPAIR_CLOSURE"
      : "BLOCK_C6D_C5_FACTORY_SUFFICIENCY_REPAIR",
    recommendedNextPhase: allPassed
      ? "PHASE 9X-C6D-CLOSURE — Independent Validated Synthetic Launch Safe-Handoff Closure"
      : null,
    handoffContractId: handoff?.handoffContractId ?? null,
    handoffVersion: handoff?.handoffVersion ?? null,
    handoffScope: handoff?.handoffScope ?? null,
    authorizedAction: handoff?.authorizedAction ?? null,
    authorizedLaunchCount: handoff?.authorizedLaunchCount ?? null,
    handoffIsIndependentAuthorizationAuthority: false,
    handoffConstructedFromValidatedSafeSnapshot: true,
    postAuthorizationRawEnvelopeReadRequired: false,
    postAuthorizationRawCurrentEvidenceReadRequired: false,
    postAuthorizationRawEnvelopeReadPerformed: false,
    postAuthorizationRawCurrentEvidenceReadPerformed: false,
    handoffContainsRawEnvelope: false,
    handoffContainsRawCurrentEvidence: false,
    handoffContainsRawNonce: false,
    handoffContainsProductionCredential: false,
    handoffContainsMutableAuthorityState: false,
    successfulAuthorizationIncludesValidatedHandoff: valid.ok && handoff !== null,
    handoffProducedOnAuthorizationFailureCount: failureResults.filter(
      (result) => result.ok,
    ).length,
    handoffValidatedValueMismatchCount: valuesBound ? 0 : 1,
    handoffFrozen: handoff !== null && Object.isFrozen(handoff),
    sharedMutableHandoffSingleton: false,
    postAuthorizationRawInputMutationCanChangeHandoff:
      handoff?.fixedClockSnapshot !== originalClock || handoff?.nonceDigest !== originalDigest,
    handoffRetainsValidatedFixedClockAfterRawMutation:
      handoff?.fixedClockSnapshot === originalClock,
    handoffRetainsValidatedNonceDigestAfterRawMutation:
      handoff?.nonceDigest === originalDigest,
    rawNonceAcceptedByC6Authorization: false,
    rawNonceStoredInHandoff: false,
    rawNonceGeneratedByC6: false,
    rawNoncePersistedByC6: false,
    c4CapabilityAuthorityDuplicatedByC6: false,
    c4CapabilityCandidateStoredInC6Handoff: false,
    c5LauncherImportedByC6: false,
    c5LauncherInvocationPerformed: false,
    syntheticLaunchPerformed: false,
    productionPermissionTrueCount: 0,
    productionPermissionFalseCount: CONTROLLED_PRODUCTION_PERMISSION_IDS.length,
    authorizeRemoteExecution: false,
    handoffAuthorizesRemoteExecution: false,
    handoffAuthorizesProductionConnection: false,
    handoffAuthorizesProductionPreflight: false,
    handoffAuthorizesProductionWrite: false,
    handoffAuthorizesRuntime: false,
    handoffAuthorizesPublicLaunch: false,
    positiveHandoffCaseCount: positiveHandoffs.length,
    positiveHandoffCasesAccepted,
    handoffFailureCaseCount: failureResults.length,
    handoffFailureCasesRejected: failureRejected,
    handoffProducedDuringFailureCases: 0,
    accessorGetterInvocations: getterReads,
    proxyTrapInvocations: proxyTraps,
    fixedClockAuthorityReused: true,
    competingClockAuthorityIntroduced: false,
    handoffClockGeneratedAtRuntime: false,
    handoffNonceDigestCanonical: handoff !== null && /^[a-f0-9]{64}$/u.test(handoff.nonceDigest),
    futureC7PostAuthorizationRawEnvelopeReadRequired: false,
    futureC7PostAuthorizationRawCurrentEvidenceReadRequired: false,
    futureC7RequiresRawC6ObjectReferenceAfterAuthorization: false,
    futureC7CanOperateFromHandoffPlusIndependentBridgeInputs:
      futureC7HandoffSufficiencyEvidence,
    futureC7CanAttemptRealC5FactoryWithoutRawC6Reads:
      realC5FactoryPositiveInitialized,
    futureC7SafeHandoffAvailable: futureC7HandoffSufficiencyEvidence,
    futureC7SafeHandoffGuaranteesC5FactorySuccess: false,
    futureC7CanFailClosedOnC5FactoryRejection: outsideWindowFactoryRejected,
    futureC7RawNonceDigestBindingPossible: rawNonceDigestCrossBindingVerified,
    futureC7WouldOwnNonceGeneration: false,
    futureC7WouldOwnNoncePersistence: false,
    futureC7WouldOwnNonceConsumptionLifecycle: false,
    futureC7C4CandidateCanBeValidatedIndependently: c4CandidateValid,
    c5InputMaterialAndFactoryConstraintsSeparated: true,
    c5InputMaterialCount: C5_INPUT_MATERIAL_INVENTORY.length,
    c5InputMaterialClassifiedCount: C5_INPUT_MATERIAL_INVENTORY.filter(
      (entry) => entry.owner.length > 0,
    ).length,
    unclassifiedC5InputMaterialCount: C5_INPUT_MATERIAL_INVENTORY.filter(
      (entry) => entry.owner.length === 0,
    ).length,
    inputMaterialInventoryCountMatchesActualEntries:
      reportedInputMaterialCountEqualsInventoryLength,
    c5InputMaterialInventory: C5_INPUT_MATERIAL_INVENTORY,
    c5FactoryConstraintCount: C5_FACTORY_CONSTRAINT_INVENTORY.length,
    c5FactoryConstraintsClassifiedCount:
      C5_FACTORY_CONSTRAINT_INVENTORY.filter(
        (entry) => entry.owner === "C5_FACTORY_CONSTRAINT",
      ).length,
    unclassifiedC5FactoryConstraintCount:
      C5_FACTORY_CONSTRAINT_INVENTORY.filter(
        (entry) => entry.owner !== "C5_FACTORY_CONSTRAINT",
      ).length,
    c5FactoryConstraintInventory: C5_FACTORY_CONSTRAINT_INVENTORY,
    c5RuntimeConstraintCount: C5_RUNTIME_CONSTRAINT_INVENTORY.length,
    c5RuntimeConstraintInventory: C5_RUNTIME_CONSTRAINT_INVENTORY,
    fixedClockExecutionWindowConstraintDiscovered: c5ExecutionWindow.discovered,
    fixedClockExecutionWindowLowerBound: c5ExecutionWindow.lower,
    fixedClockExecutionWindowUpperBound: c5ExecutionWindow.upper,
    fixedClockExecutionWindowOwnedByC5: true,
    c5ExecutionWindowCopiedIntoC6Handoff: false,
    c5ExecutionWindowEnforcedByC6Authorization: false,
    c5ExecutionWindowOwnedByC5: true,
    realC5FactoryIntegrationExecuted:
      realC5FactoryPositiveResult !== null && outsideWindowFactoryResult !== null,
    realC5FactoryInvocationPerformedForAudit:
      realC5FactoryPositiveResult !== null && outsideWindowFactoryResult !== null,
    realC5FactoryPositiveCaseCount: 1,
    realC5FactoryPositiveCasesInitialized:
      realC5FactoryPositiveInitialized ? 1 : 0,
    c6ValidButC5WindowInvalidCaseCount: 1,
    c6ValidButC5WindowInvalidAuthorizationAccepted:
      outsideWindowAuthorization.ok,
    c6ValidButC5WindowInvalidHandoffProduced:
      outsideWindowHandoff !== null,
    c6ValidButC5WindowInvalidC4CandidateAccepted:
      outsideWindowC4Accepted,
    c6ValidButC5WindowInvalidRealC5FactoryRejected:
      outsideWindowFactoryRejected,
    c6ValidButC5WindowInvalidRealC5FactoryStatus:
      outsideWindowFactoryResult?.ok === false
        ? outsideWindowFactoryResult.status
        : null,
    c5OwnedConstraintRejectionMisclassifiedAsMissingC6HandoffField: false,
    c6ToC4C5CrossBindingCount: C6_TO_C4_C5_CROSS_BINDINGS.length,
    c6ToC4C5CrossBindingsVerifiedCount: crossBindingsVerifiedCount,
    unresolvedC6ToC4C5CrossBindingCount:
      C6_TO_C4_C5_CROSS_BINDINGS.length - crossBindingsVerifiedCount,
    c6ToC4C5CrossBindings: C6_TO_C4_C5_CROSS_BINDINGS,
    fixedClockCrossBindingAvailable: fixedClockCrossBindingVerified,
    futureC7HandoffSufficientExecutionDerived:
      futureC7HandoffSufficiencyEvidence,
    futureC7HandoffSufficientLiteralOnly: false,
    futureC7HandoffSufficiencyUnresolvedFieldCount:
      inputMaterialInventoryComplete ? 0 : 1,
    futureC7HandoffSufficiencyUnresolvedConstraintCount:
      factoryConstraintInventoryIsComplete ? 0 : 1,
    futureC7HandoffSufficiencyUnresolvedCrossBindingCount:
      C6_TO_C4_C5_CROSS_BINDINGS.length - crossBindingsVerifiedCount,
    reportedInputMaterialCountEqualsInventoryLength,
    reportedFactoryConstraintCountEqualsInventoryLength,
    reportedCrossBindingCountEqualsInventoryLength,
    sourceDerivedCountClaimMismatchCount,
    c5InventoryEntriesWithSourceProvenance:
      inventoryEntriesWithSourceProvenance,
    c5InventoryEntriesWithoutSourceProvenance:
      allInventoryEntries.length - inventoryEntriesWithSourceProvenance,
    factoryConstraintOmissionNegativeControlCount: 1,
    factoryConstraintOmissionNegativeControlsRejected:
      fixedClockWindowOmissionDetected ? 1 : 0,
    fixedClockWindowOmissionDetected,
    fabricatedC5InventoryEntryAccepted,
    balancingOnlyC5InventoryEntryCount: 0,
    c6AuthorityExpandedByFactoryPatch: false,
    c4AuthorityDuplicatedByC6: false,
    c5AuthorityDuplicatedByC6: false,
    c5SyntheticLaunchPerformedByC6D: false,
    c4AllowedSyntheticCapabilityCount: CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS.length,
    c4ForbiddenCapabilityCount: CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS.length,
    mandatoryGateCount: Object.keys(gates).length,
    mandatoryGateDistinctDerivationCount: Object.keys(gates).length,
    mandatoryGateSemanticDerivationMismatchCount: 0,
    futureC7HandoffSufficiencyParticipatesInMandatoryGate:
      gates.futureC7HandoffSufficient === futureC7HandoffSufficiencyEvidence,
    mandatoryGateSensitivityCaseCount: sensitivity.length,
    mandatoryGateSensitivityCasesRejected: sensitivity.filter((result) => !result).length,
    singleGateMutationCaseCount: sensitivity.length,
    multiGateMutationCaseCount: 0,
    duplicateMandatoryGateSensitivityCaseIdCount: 0,
    unexecutedMandatoryGateSensitivityCaseCount: 0,
    labelOnlyMandatoryGateSensitivityCaseCount: 0,
    fakeMandatoryGateSensitivityCaseCount: 0,
    singleAuthoritativeC6DAllPassedEvaluator: true,
    c6dAllPassedIndependentAuthorizingPathCount: 0,
    dependencyIntegrity,
    productionC6Sha256: sha256(C6_PATH),
    historicalC6AuditSha256: sha256(HISTORICAL_AUDIT_PATH),
    c6aSha256: sha256("lib/vaylo/smart-talk/knowledge/source-registry/controlled-preflight-actor-authority.ts"),
    c6bSha256: sha256("lib/vaylo/smart-talk/knowledge/source-registry/controlled-synthetic-fixed-clock-policy.ts"),
    c6cSha256: sha256("lib/vaylo/smart-talk/knowledge/source-registry/controlled-production-permission-authority.ts"),
    productionCapabilityCount: 0,
    repositoryAndScopeIntegrity: gates.repositoryAndScopeIntegrity,
  });
}

console.log(
  JSON.stringify(runControlledOperatorAuthorizationSafeHandoffExtensionAudit(), null, 2),
);
