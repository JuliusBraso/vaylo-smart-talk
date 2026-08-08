import "server-only";

import { createHash } from "node:crypto";

import {
  CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
  CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS,
  parseClosedCapabilityCandidate,
} from "./controlled-preflight-launcher-capability-contract";
import {
  createControlledSyntheticPreflightLauncher,
  type ControlledPreflightLaunchResult,
} from "./controlled-preflight-launcher";
import {
  CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE,
  CONTROLLED_VALIDATED_SYNTHETIC_C5_LAUNCH_HANDOFF,
  evaluateControlledOperatorAuthorizationEnvelope,
} from "./controlled-operator-authorization-envelope";
import {
  getControlledProductionPermissionAuthorityFingerprint,
} from "./controlled-production-permission-authority";

export const CONTROLLED_SYNTHETIC_C5_LAUNCH_EXECUTION_BOUNDARY = Object.freeze({
  boundaryId: "VAYLO_CONTROLLED_SYNTHETIC_C5_LAUNCH_EXECUTION_BOUNDARY",
  version: 1,
  authorizationClass: "C7_C6_AUTHORIZED_SYNTHETIC_EXECUTION_ONLY",
  executionScope: "SYNTHETIC_LOCAL_ONLY",
  allowedAction: "EXECUTE_ONE_C6_AUTHORIZED_C5_SYNTHETIC_LAUNCH",
  c7SourceCheckpointCommit: "09b489feb85cf3253a46c81dc5bdb450eb66767c",
  c6BoundCheckpointCommit: "09b489feb85cf3253a46c81dc5bdb450eb66767c",
  c5BoundCheckpointCommit: "9993d2ad6ed5f8de5546edc95c4e702abac38414",
  c7SyntheticExecutionCapabilityCount: 1,
  c7ProductionCapabilityCount: 0,
} as const);

export type ControlledSyntheticC5LaunchExecutionFailureCode =
  | "C7_INPUT_REJECTED"
  | "C6_AUTHORIZATION_REJECTED"
  | "C6_HANDOFF_REJECTED"
  | "C4_CANDIDATE_REJECTED"
  | "FIXED_CLOCK_HANDOFF_BINDING_MISMATCH"
  | "RAW_NONCE_DIGEST_BINDING_MISMATCH"
  | "C5_FACTORY_REJECTED"
  | "C5_LAUNCH_REJECTED";

export type ControlledSyntheticC5LaunchExecutionInput = Readonly<{
  c6AuthorizationEnvelope: unknown;
  c6CurrentEvidence: unknown;
  c4CapabilityCandidate: unknown;
  rawLaunchNonce: unknown;
}>;

type ReceiptBase = Readonly<{
  executionScope: "SYNTHETIC_LOCAL_ONLY";
  c6AuthorizationAccepted: boolean;
  handoffObtained: boolean;
  c4CandidateAccepted: boolean;
  fixedClockBindingPassed: boolean;
  rawNonceDigestBindingPassed: boolean;
  c5FactoryAttempted: boolean;
  c5FactoryInitialized: boolean;
  c5LauncherInvocationCount: number;
  syntheticLaunchAttemptCount: number;
  productionPermissionsRemainAllFalse: true;
  remoteExecutionAuthorized: false;
  productionConnectionPerformed: false;
  productionReadOnlyPreflightExecutedNow: false;
  productionWritePerformed: false;
  productionRuntimeAuthorized: false;
  publicLaunchAuthorized: false;
}>;

export type ControlledSyntheticC5LaunchExecutionReceipt =
  | (ReceiptBase &
      Readonly<{
        ok: true;
        launchResult: ControlledPreflightLaunchResult;
      }>)
  | (ReceiptBase &
      Readonly<{
        ok: false;
        failureCode: ControlledSyntheticC5LaunchExecutionFailureCode;
      }>);

const receipt = <T extends ControlledSyntheticC5LaunchExecutionReceipt>(value: T): T =>
  Object.freeze(value);

const failed = (
  failureCode: ControlledSyntheticC5LaunchExecutionFailureCode,
  partial: Partial<ReceiptBase> = {},
): ControlledSyntheticC5LaunchExecutionReceipt =>
  receipt({
    ok: false as const,
    failureCode,
    executionScope: "SYNTHETIC_LOCAL_ONLY" as const,
    c6AuthorizationAccepted: false,
    handoffObtained: false,
    c4CandidateAccepted: false,
    fixedClockBindingPassed: false,
    rawNonceDigestBindingPassed: false,
    c5FactoryAttempted: false,
    c5FactoryInitialized: false,
    c5LauncherInvocationCount: 0,
    syntheticLaunchAttemptCount: 0,
    productionPermissionsRemainAllFalse: true as const,
    remoteExecutionAuthorized: false as const,
    productionConnectionPerformed: false as const,
    productionReadOnlyPreflightExecutedNow: false as const,
    productionWritePerformed: false as const,
    productionRuntimeAuthorized: false as const,
    publicLaunchAuthorized: false as const,
    ...partial,
  });

const canonicalNonceDigest = (nonce: unknown): string | null =>
  typeof nonce === "string"
    ? createHash("sha256").update(nonce, "utf8").digest("hex")
    : null;

const handoffIsAuthorizedForThisBoundary = (
  handoff: ReturnType<typeof evaluateControlledOperatorAuthorizationEnvelope> extends infer Evaluation
    ? Evaluation extends Readonly<{ ok: true; validatedLaunchHandoff: infer Handoff }>
      ? Handoff
      : never
    : never,
): boolean =>
  handoff.handoffContractId ===
    CONTROLLED_VALIDATED_SYNTHETIC_C5_LAUNCH_HANDOFF.handoffContractId &&
  handoff.handoffVersion === CONTROLLED_VALIDATED_SYNTHETIC_C5_LAUNCH_HANDOFF.handoffVersion &&
  handoff.handoffScope === CONTROLLED_VALIDATED_SYNTHETIC_C5_LAUNCH_HANDOFF.handoffScope &&
  handoff.authorizedAction === CONTROLLED_VALIDATED_SYNTHETIC_C5_LAUNCH_HANDOFF.authorizedAction &&
  handoff.authorizedLaunchCount ===
    CONTROLLED_VALIDATED_SYNTHETIC_C5_LAUNCH_HANDOFF.authorizedLaunchCount &&
  handoff.c5BoundCheckpointCommit ===
    CONTROLLED_SYNTHETIC_C5_LAUNCH_EXECUTION_BOUNDARY.c5BoundCheckpointCommit &&
  handoff.productionPermissionAuthorityFingerprint ===
    getControlledProductionPermissionAuthorityFingerprint() &&
  handoff.productionPermissionsRemainAllFalse === true &&
  handoff.remoteExecutionAuthorized === false;

/**
 * The only C7 execution entrypoint. It always obtains its handoff from a new
 * C6 evaluation and intentionally does not accept a detached handoff.
 */
export async function executeControlledSyntheticC5Launch(
  input: ControlledSyntheticC5LaunchExecutionInput,
): Promise<ControlledSyntheticC5LaunchExecutionReceipt> {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return failed("C7_INPUT_REJECTED");
  }

  const authorization = evaluateControlledOperatorAuthorizationEnvelope(
    input.c6AuthorizationEnvelope,
    input.c6CurrentEvidence,
  );
  if (!authorization.ok) return failed("C6_AUTHORIZATION_REJECTED");

  // No raw C6 envelope or current-evidence value is read below this line.
  const handoff = authorization.validatedLaunchHandoff;
  if (!handoffIsAuthorizedForThisBoundary(handoff)) {
    return failed("C6_HANDOFF_REJECTED", {
      c6AuthorizationAccepted: true,
      handoffObtained: true,
    });
  }

  const parsedCandidate = parseClosedCapabilityCandidate(input.c4CapabilityCandidate);
  if (!parsedCandidate.ok) {
    return failed("C4_CANDIDATE_REJECTED", {
      c6AuthorizationAccepted: true,
      handoffObtained: true,
    });
  }
  const candidate = parsedCandidate.value;
  if (candidate.manifest.fixedClockSnapshot !== handoff.fixedClockSnapshot) {
    return failed("FIXED_CLOCK_HANDOFF_BINDING_MISMATCH", {
      c6AuthorizationAccepted: true,
      handoffObtained: true,
      c4CandidateAccepted: true,
    });
  }

  const nonceDigest = canonicalNonceDigest(input.rawLaunchNonce);
  if (nonceDigest === null || nonceDigest !== handoff.nonceDigest) {
    return failed("RAW_NONCE_DIGEST_BINDING_MISMATCH", {
      c6AuthorizationAccepted: true,
      handoffObtained: true,
      c4CandidateAccepted: true,
      fixedClockBindingPassed: true,
    });
  }

  const factory = createControlledSyntheticPreflightLauncher(candidate);
  if (!factory.ok) {
    return failed("C5_FACTORY_REJECTED", {
      c6AuthorizationAccepted: true,
      handoffObtained: true,
      c4CandidateAccepted: true,
      fixedClockBindingPassed: true,
      rawNonceDigestBindingPassed: true,
      c5FactoryAttempted: true,
    });
  }

  const launchResult = await factory.launcher.launch(input.rawLaunchNonce);
  const launchReceipt: ReceiptBase = {
    executionScope: "SYNTHETIC_LOCAL_ONLY",
    c6AuthorizationAccepted: true,
    handoffObtained: true,
    c4CandidateAccepted: true,
    fixedClockBindingPassed: true,
    rawNonceDigestBindingPassed: true,
    c5FactoryAttempted: true,
    c5FactoryInitialized: true,
    c5LauncherInvocationCount: 1,
    syntheticLaunchAttemptCount: 1,
    productionPermissionsRemainAllFalse: true,
    remoteExecutionAuthorized: false,
    productionConnectionPerformed: false,
    productionReadOnlyPreflightExecutedNow: false,
    productionWritePerformed: false,
    productionRuntimeAuthorized: false,
    publicLaunchAuthorized: false,
  };
  return launchResult.ok
    ? receipt({ ok: true as const, ...launchReceipt, launchResult })
    : receipt({
        ok: false as const,
        failureCode: "C5_LAUNCH_REJECTED" as const,
        ...launchReceipt,
      });
}

export const CONTROLLED_SYNTHETIC_C5_LAUNCH_EXECUTION_CAPABILITY_BOUNDARY =
  Object.freeze({
    allowedCapability: "INVOKE_COMMITTED_C5_SYNTHETIC_LAUNCH_ONCE",
    syntheticExecutionCapabilityCount: 1,
    productionCapabilityCount: 0,
    c4AllowedSyntheticCapabilityCount: CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS.length,
    c4ForbiddenCapabilityCount: CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS.length,
    c6RequestedAction: CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.requestedAction,
  });
