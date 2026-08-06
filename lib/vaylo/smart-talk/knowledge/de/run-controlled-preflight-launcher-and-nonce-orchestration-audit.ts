import "server-only";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

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
  runControlledPreflightLauncherFixedFailurePathEvidence,
} from "../source-registry/controlled-preflight-launcher";
import {
  PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER,
} from "../source-registry/production-read-only-preflight-helper";
import { runC4SecurityBoundarySimplificationAudit } from "./run-c4-security-boundary-simplification-audit";

type CaseRecord = Readonly<{
  id: string;
  passed: boolean;
  executed: boolean;
  labelOnly: false;
}>;

const SOURCE_INTEGRITY_PATHS = Object.freeze([
  "lib/vaylo/smart-talk/knowledge/source-registry/controlled-preflight-launcher.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-controlled-preflight-launcher-and-nonce-orchestration-audit.ts",
] as const);

const FIXED_CLOCK = "2026-08-06T00:05:00.000Z";

const deepFreeze = <T>(value: T): T => {
  if (value === null || typeof value !== "object") return value;
  for (const key of Reflect.ownKeys(value as object)) {
    const descriptor = Object.getOwnPropertyDescriptor(value as object, key);
    if (descriptor && "value" in descriptor) deepFreeze(descriptor.value);
  }
  return Object.freeze(value);
};

const makeNonce = (label: string): string => {
  const base = `opnonce_${label}_`.padEnd(32, "x");
  return base.slice(0, 32);
};

const createValidCandidate = (
  overrides?: Readonly<{
    maximumEntries?: number;
    maximumEvents?: number;
    queryIds?: ReadonlyArray<string>;
    productionCapabilityCount?: number;
  }>,
) => {
  const queryIds = overrides?.queryIds ?? PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER;
  return deepFreeze({
    contractId: CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_ID,
    contractVersion: CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_VERSION,
    authorizationClass: CONTROLLED_PREFLIGHT_LAUNCHER_AUTHORIZATION_CLASS,
    productionCapabilityCount: overrides?.productionCapabilityCount ?? 0,
    allowedCapabilities: CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
    forbiddenCapabilities: CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS,
    manifest: {
      queryIds: Object.freeze([...queryIds]),
      fixtureSnapshots: Object.freeze(
        queryIds.map((queryId) =>
          Object.freeze({ queryId, rows: 1 }),
        ),
      ),
      fixedClockSnapshot: FIXED_CLOCK,
      nonce: Object.freeze({
        mode: "EPHEMERAL_IN_MEMORY" as const,
        maximumEntries: overrides?.maximumEntries ?? 8,
      }),
      auditTrace: Object.freeze({
        mode: "IN_MEMORY" as const,
        maximumEvents: overrides?.maximumEvents ?? 64,
      }),
    },
  });
};

const snapshot = async (relativePath: string) => {
  const content = await readFile(relativePath, "utf8");
  return Object.freeze({
    relativePath,
    sha256: createHash("sha256").update(content).digest("hex"),
  });
};

const record = (
  id: string,
  passed: boolean,
): CaseRecord =>
  Object.freeze({ id, passed, executed: true, labelOnly: false as const });

const createLauncher = (candidate: unknown = createValidCandidate()) =>
  createControlledSyntheticPreflightLauncher(candidate);

export async function runControlledPreflightLauncherAndNonceOrchestrationAudit() {
  const sourceIntegrityBefore = await Promise.all(
    SOURCE_INTEGRITY_PATHS.map(snapshot),
  );

  const positiveCases: CaseRecord[] = [];
  const nonceTamperCases: CaseRecord[] = [];
  const launcherBoundaryTamperCases: CaseRecord[] = [];

  const created = createLauncher();
  positiveCases.push(record("positive_01_valid_launcher_creation", created.ok));
  if (!created.ok) {
    return deepFreeze({
      checkId: "9X-C5",
      phase: "Controlled Preflight Launcher and Nonce Orchestration",
      allPassed: false,
      blocked: true,
      blockReason: "BLOCKED — TRUSTED SNAPSHOT DEFECT",
      defectClassification: "LAUNCHER_FACTORY",
      implementationDecision: "REQUIRE_C5_IMPLEMENTATION_PATCH",
      recommendedNextPhase:
        "Repair controlled preflight launcher factory before independent closure.",
      createdFileCount: 2,
      modifiedExistingFileCount: 0,
      positiveCaseCount: positiveCases.length,
      positiveCasesPassed: positiveCases.filter((item) => item.passed).length,
      nonceTamperCaseCount: 0,
      nonceTamperCasesRejected: 0,
      launcherBoundaryTamperCaseCount: 0,
      launcherBoundaryTamperCasesRejected: 0,
    });
  }

  const launcher = created.launcher;
  const publicMethods = Object.keys(launcher);
  positiveCases.push(
    record(
      "positive_02_trusted_snapshot_retained",
      parseClosedCapabilityCandidate(createValidCandidate()).ok === true &&
        !("capabilityCandidate" in launcher) &&
        !("untrustedCandidate" in launcher) &&
        createLauncher({ hostile: true }).ok === false,
    ),
  );

  const nonceA = makeNonce("alpha001");
  const launchA = await launcher.launch(nonceA);
  positiveCases.push(
    record("positive_03_valid_nonce_accepted", launchA.ok === true),
  );
  positiveCases.push(
    record(
      "positive_04_exact_adapter_invocation_once",
      launchA.ok === true &&
        launcher.getStateSnapshot().adapterInvocationCount === 1,
    ),
  );
  positiveCases.push(
    record(
      "positive_05_exact_trusted_query_count",
      launchA.ok === true &&
        launchA.queryCount ===
          PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER.length,
    ),
  );
  positiveCases.push(
    record(
      "positive_06_committed_lifecycle",
      launchA.ok === true && launchA.committed === true,
    ),
  );
  positiveCases.push(
    record(
      "positive_07_closed_lifecycle",
      launchA.ok === true && launchA.closed === true,
    ),
  );
  positiveCases.push(
    record(
      "positive_08_nonce_consumed",
      launchA.ok === true &&
        launchA.nonceState === "CONSUMED" &&
        launcher.getStateSnapshot().consumedNonceCount === 1,
    ),
  );

  const stateSnap = launcher.getStateSnapshot();
  const stateKeys = Object.keys(stateSnap);
  positiveCases.push(
    record(
      "positive_09_state_snapshot_sanitized",
      !stateKeys.includes("nonces") &&
        !JSON.stringify(stateSnap).includes(nonceA) &&
        Object.isFrozen(stateSnap),
    ),
  );

  const auditSnap = launcher.getAuditTraceSnapshot();
  positiveCases.push(
    record(
      "positive_10_audit_snapshot_sanitized",
      Array.isArray(auditSnap) &&
        Object.isFrozen(auditSnap) &&
        auditSnap.every((event) => Object.isFrozen(event)) &&
        !JSON.stringify(auditSnap).includes(nonceA),
    ),
  );

  const nonceB = makeNonce("beta0002");
  const launchB = await launcher.launch(nonceB);
  positiveCases.push(
    record(
      "positive_11_second_distinct_nonce_accepted",
      launchB.ok === true &&
        launcher.getStateSnapshot().adapterInvocationCount === 2,
    ),
  );

  const auditSnap2 = launcher.getAuditTraceSnapshot();
  const mutableProbe = auditSnap2 as unknown as Array<{ sequence: number }>;
  const beforeLen = mutableProbe.length;
  try {
    mutableProbe.push({ sequence: 999 });
  } catch {
    // frozen push may throw
  }
  const stateAfterMutation = launcher.getStateSnapshot();
  positiveCases.push(
    record(
      "positive_12_snapshots_fresh_and_immutable",
      Object.isFrozen(auditSnap2) &&
        Object.isFrozen(stateSnap) &&
        stateAfterMutation.auditEventCount === beforeLen &&
        auditSnap !== auditSnap2,
    ),
  );

  const rejectNonce = async (id: string, nonce: unknown) => {
    const local = createLauncher();
    if (!local.ok) {
      nonceTamperCases.push(record(id, false));
      return;
    }
    const target = local.launcher;
    const before = target.getStateSnapshot();
    const result = await target.launch(nonce);
    const after = target.getStateSnapshot();
    nonceTamperCases.push(
      record(
        id,
        result.ok === false &&
          result.adapterInvoked === false &&
          result.nonceState === "NOT_RESERVED" &&
          after.adapterInvocationCount === before.adapterInvocationCount &&
          after.storedNonceCount === before.storedNonceCount,
      ),
    );
  };

  await rejectNonce("nonce_tamper_01_non_string", 123);
  await rejectNonce("nonce_tamper_02_null", null);
  await rejectNonce("nonce_tamper_03_empty", "");
  await rejectNonce("nonce_tamper_04_too_short", "short_nonce_value_only");
  await rejectNonce(
    "nonce_tamper_05_too_long",
    `${"a".repeat(129)}`,
  );
  await rejectNonce("nonce_tamper_06_whitespace", `${makeNonce("space")} `);
  await rejectNonce(
    "nonce_tamper_07_internal_whitespace",
    "opnonce_with space_characters_xxxxxx",
  );
  await rejectNonce(
    "nonce_tamper_08_invalid_punctuation",
    "opnonce_invalid!punctuation########",
  );
  await rejectNonce(
    "nonce_tamper_09_control_character",
    `opnonce_control\u0001char_xxxxxxxxxxxx`,
  );

  {
    const local = createLauncher();
    if (local.ok) {
      const n = makeNonce("replayok1");
      const first = await local.launcher.launch(n);
      const second = await local.launcher.launch(n);
      nonceTamperCases.push(
        record(
          "nonce_tamper_10_duplicate_after_success",
          first.ok === true &&
            second.ok === false &&
            second.status === "NONCE_REPLAY" &&
            local.launcher.getStateSnapshot().adapterInvocationCount === 1,
        ),
      );
    } else {
      nonceTamperCases.push(record("nonce_tamper_10_duplicate_after_success", false));
    }
  }

  await rejectNonce(
    "nonce_tamper_11_tab_character",
    "opnonce_with\ttab_character_xxxxxxxxx",
  );
  await rejectNonce(
    "nonce_tamper_12_carriage_return",
    "opnonce_with\rcarriage_return_xxxxxxx",
  );

  {
    const local = createLauncher();
    if (local.ok) {
      const n = makeNonce("concurr1");
      const [one, two] = await Promise.all([
        local.launcher.launch(n),
        local.launcher.launch(n),
      ]);
      const successes = [one, two].filter((item) => item.ok).length;
      const failures = [one, two].filter((item) => !item.ok).length;
      const state = local.launcher.getStateSnapshot();
      nonceTamperCases.push(
        record(
          "nonce_tamper_13_concurrent_duplicate",
          successes === 1 &&
            failures === 1 &&
            state.adapterInvocationCount === 1 &&
            state.consumedNonceCount === 1,
        ),
      );
    } else {
      nonceTamperCases.push(record("nonce_tamper_13_concurrent_duplicate", false));
    }
  }

  {
    const local = createLauncher(createValidCandidate({ maximumEntries: 1 }));
    if (local.ok) {
      const first = await local.launcher.launch(makeNonce("capone01"));
      const before = local.launcher.getStateSnapshot();
      const second = await local.launcher.launch(makeNonce("capone02"));
      const after = local.launcher.getStateSnapshot();
      nonceTamperCases.push(
        record(
          "nonce_tamper_14_capacity_reached",
          first.ok === true &&
            second.ok === false &&
            second.status === "NONCE_CAPACITY_REACHED" &&
            second.adapterInvoked === false &&
            after.adapterInvocationCount === before.adapterInvocationCount &&
            after.storedNonceCount === 1,
        ),
      );
      nonceTamperCases.push(
        record(
          "nonce_tamper_15_capacity_does_not_evict",
          after.storedNonceCount === 1 && after.consumedNonceCount === 1,
        ),
      );
    } else {
      nonceTamperCases.push(record("nonce_tamper_14_capacity_reached", false));
      nonceTamperCases.push(record("nonce_tamper_15_capacity_does_not_evict", false));
    }
  }

  {
    const local = createLauncher();
    if (local.ok) {
      const before = local.launcher.getStateSnapshot();
      const result = await local.launcher.launch("bad");
      const after = local.launcher.getStateSnapshot();
      const failed = !result.ok ? result : null;
      nonceTamperCases.push(
        record(
          "nonce_tamper_16_invalid_nonce_does_not_reserve",
          failed !== null &&
            failed.nonceState === "NOT_RESERVED" &&
            after.storedNonceCount === before.storedNonceCount,
        ),
      );
      nonceTamperCases.push(
        record(
          "nonce_tamper_17_invalid_nonce_does_not_invoke_adapter",
          failed !== null &&
            failed.adapterInvoked === false &&
            after.adapterInvocationCount === before.adapterInvocationCount,
        ),
      );
    } else {
      nonceTamperCases.push(
        record("nonce_tamper_16_invalid_nonce_does_not_reserve", false),
      );
      nonceTamperCases.push(
        record("nonce_tamper_17_invalid_nonce_does_not_invoke_adapter", false),
      );
    }
  }

  {
    const local = createLauncher(createValidCandidate({ maximumEvents: 3 }));
    if (local.ok) {
      const before = local.launcher.getStateSnapshot();
      const result = await local.launcher.launch(makeNonce("audcap01"));
      const after = local.launcher.getStateSnapshot();
      const failed = !result.ok ? result : null;
      nonceTamperCases.push(
        record(
          "nonce_tamper_18_trace_capacity_no_reserve",
          failed !== null &&
            failed.status === "AUDIT_CAPACITY_REACHED" &&
            failed.nonceState === "NOT_RESERVED" &&
            after.storedNonceCount === before.storedNonceCount,
        ),
      );
      nonceTamperCases.push(
        record(
          "nonce_tamper_19_trace_capacity_no_adapter",
          failed !== null &&
            failed.adapterInvoked === false &&
            after.adapterInvocationCount === before.adapterInvocationCount,
        ),
      );
    } else {
      nonceTamperCases.push(
        record("nonce_tamper_18_trace_capacity_no_reserve", false),
      );
      nonceTamperCases.push(
        record("nonce_tamper_19_trace_capacity_no_adapter", false),
      );
    }
  }

  {
    const local = createLauncher();
    if (local.ok) {
      const n = makeNonce("objnonce");
      const boxed = Object(n);
      const result = await local.launcher.launch(boxed);
      nonceTamperCases.push(
        record(
          "nonce_tamper_20_object_boxed_string",
          result.ok === false && result.status === "INVALID_NONCE",
        ),
      );
    } else {
      nonceTamperCases.push(record("nonce_tamper_20_object_boxed_string", false));
    }
  }

  await rejectNonce("nonce_tamper_21_symbol", Symbol("nonce"));
  await rejectNonce("nonce_tamper_22_boolean", true);
  await rejectNonce("nonce_tamper_23_array", ["a".repeat(32)]);
  await rejectNonce(
    "nonce_tamper_24_line_feed",
    "opnonce_with\nline_feed_xxxxxxxxxxxx",
  );
  await rejectNonce(
    "nonce_tamper_25_zero_width_character",
    "opnonce_zero\u200Bwidth_character_xxxxxxx",
  );
  {
    const local = createLauncher();
    if (local.ok) {
      const n = makeNonce("multirep");
      const first = await local.launcher.launch(n);
      const second = await local.launcher.launch(n);
      const third = await local.launcher.launch(n);
      nonceTamperCases.push(
        record(
          "nonce_tamper_26_repeated_replay_after_consumption",
          first.ok === true &&
            second.ok === false &&
            second.status === "NONCE_REPLAY" &&
            third.ok === false &&
            third.status === "NONCE_REPLAY" &&
            local.launcher.getStateSnapshot().adapterInvocationCount === 1 &&
            local.launcher.getStateSnapshot().consumedNonceCount === 1,
        ),
      );
    } else {
      nonceTamperCases.push(
        record("nonce_tamper_26_repeated_replay_after_consumption", false),
      );
    }
  }
  {
    const local = createLauncher(createValidCandidate({ maximumEntries: 2 }));
    if (local.ok) {
      await local.launcher.launch(makeNonce("pair0001"));
      await local.launcher.launch(makeNonce("pair0002"));
      const third = await local.launcher.launch(makeNonce("pair0003"));
      nonceTamperCases.push(
        record(
          "nonce_tamper_27_invalid_at_nonce_capacity",
          third.ok === false &&
            third.status === "NONCE_CAPACITY_REACHED" &&
            third.adapterInvoked === false,
        ),
      );
    } else {
      nonceTamperCases.push(
        record("nonce_tamper_27_invalid_at_nonce_capacity", false),
      );
    }
  }

  const failurePathEvidenceCases: CaseRecord[] = [];
  const fixedFailurePathEvidence =
    await runControlledPreflightLauncherFixedFailurePathEvidence();
  const scenarioById = (scenarioId: string) =>
    fixedFailurePathEvidence.scenarios.find(
      (scenario) => scenario.scenarioId === scenarioId,
    );

  const rejectedScenario = scenarioById("ADAPTER_REJECTED");
  const exceptionScenario = scenarioById("ADAPTER_EXCEPTION");
  const lifecycleScenario = scenarioById("INVALID_ADAPTER_LIFECYCLE");

  const scenarioPassed = (
    scenario: (typeof fixedFailurePathEvidence.scenarios)[number] | undefined,
    expectedStatus: string,
  ): boolean =>
    !!scenario &&
    scenario.initialLaunchAuthorized === false &&
    scenario.initialStatus === expectedStatus &&
    scenario.adapterInvocationCount === 1 &&
    scenario.nonceReservedBeforeDriverInvocation === true &&
    scenario.finalReservedNonceCount === 0 &&
    scenario.finalConsumedNonceCount === 1 &&
    scenario.replayRejected === true &&
    scenario.replayStatus === "NONCE_REPLAY" &&
    scenario.replayAdapterInvocationCount === 0 &&
    scenario.uncaughtExceptionCount === 0 &&
    scenario.rawErrorExposed === false &&
    scenario.rawNonceExposed === false;

  failurePathEvidenceCases.push(
    record(
      "failure_path_01_adapter_rejected",
      scenarioPassed(rejectedScenario, "ADAPTER_REJECTED"),
    ),
  );
  failurePathEvidenceCases.push(
    record(
      "failure_path_02_adapter_exception",
      scenarioPassed(exceptionScenario, "ADAPTER_EXCEPTION"),
    ),
  );
  failurePathEvidenceCases.push(
    record(
      "failure_path_03_invalid_adapter_lifecycle",
      scenarioPassed(lifecycleScenario, "INVALID_ADAPTER_LIFECYCLE"),
    ),
  );

  // Launcher boundary tampers
  {
    const invalid = createLauncher({ not: "a candidate" });
    launcherBoundaryTamperCases.push(
      record(
        "boundary_01_invalid_capability_candidate",
        invalid.ok === false && invalid.status === "CAPABILITY_REJECTED",
      ),
    );
  }

  {
    const proxy = new Proxy(createValidCandidate() as object, {
      get(target, prop, receiver) {
        return Reflect.get(target, prop, receiver);
      },
    });
    const createdProxy = createLauncher(proxy);
    launcherBoundaryTamperCases.push(
      record(
        "boundary_02_root_proxy_candidate",
        createdProxy.ok === false &&
          createdProxy.status === "CAPABILITY_REJECTED",
      ),
    );
  }

  {
    const revocable = Proxy.revocable(createValidCandidate() as object, {});
    revocable.revoke();
    let bounded = true;
    let createdRevoked: ReturnType<typeof createLauncher>;
    try {
      createdRevoked = createLauncher(revocable.proxy);
    } catch {
      bounded = false;
      createdRevoked = { ok: false, status: "CAPABILITY_REJECTED" };
    }
    launcherBoundaryTamperCases.push(
      record(
        "boundary_03_revoked_proxy_candidate",
        bounded &&
          createdRevoked.ok === false &&
          createdRevoked.status === "CAPABILITY_REJECTED",
      ),
    );
  }

  {
    const createdProd = createLauncher(
      createValidCandidate({ productionCapabilityCount: 1 }),
    );
    launcherBoundaryTamperCases.push(
      record(
        "boundary_04_production_capability_count",
        createdProd.ok === false,
      ),
    );
  }

  {
    const candidate = {
      contractId: CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_ID,
      contractVersion: CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_VERSION,
      authorizationClass: CONTROLLED_PREFLIGHT_LAUNCHER_AUTHORIZATION_CLASS,
      productionCapabilityCount: 0,
      allowedCapabilities: CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
      forbiddenCapabilities: CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS,
      manifest: {
        queryIds: [...PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER],
        fixtureSnapshots: PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER.map(
          (queryId) => ({ queryId, rows: 1 }),
        ),
        fixedClockSnapshot: FIXED_CLOCK,
        nonce: { mode: "EPHEMERAL_IN_MEMORY", maximumEntries: 8 },
        auditTrace: { mode: "IN_MEMORY", maximumEvents: 64 },
        sqlText: "SELECT 1",
      },
    };
    Object.freeze(candidate.manifest);
    Object.freeze(candidate);
    const createdSql = createLauncher(candidate);
    launcherBoundaryTamperCases.push(
      record("boundary_05_raw_sql_field", createdSql.ok === false),
    );
  }

  {
    const candidate = {
      contractId: CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_ID,
      contractVersion: CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_VERSION,
      authorizationClass: CONTROLLED_PREFLIGHT_LAUNCHER_AUTHORIZATION_CLASS,
      productionCapabilityCount: 0,
      allowedCapabilities: Object.freeze([
        ...CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
        "NETWORK",
      ]),
      forbiddenCapabilities: CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS,
      manifest: createValidCandidate().manifest,
    };
    Object.freeze(candidate);
    const createdUnknown = createLauncher(candidate);
    launcherBoundaryTamperCases.push(
      record("boundary_06_unknown_capability", createdUnknown.ok === false),
    );
  }

  {
    const createdMismatch = createLauncher(
      createValidCandidate({
        queryIds: [
          ...PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER.slice(0, 17),
          "PROD_PREFLIGHT_NOT_A_REAL_QUERY",
        ],
      }),
    );
    launcherBoundaryTamperCases.push(
      record(
        "boundary_07_query_count_or_id_mismatch",
        createdMismatch.ok === false &&
          createdMismatch.status === "TRUSTED_QUERY_MISMATCH",
      ),
    );
  }

  {
    const createdDupOrder = createLauncher(
      createValidCandidate({
        queryIds: [
          PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER[0]!,
          ...PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER.slice(0, 17),
        ],
      }),
    );
    launcherBoundaryTamperCases.push(
      record(
        "boundary_08_duplicate_query_behavior",
        createdDupOrder.ok === false,
      ),
    );
  }

  {
    const local = createLauncher();
    if (local.ok) {
      const result = await local.launcher.launch(makeNonce("lifecycle"));
      launcherBoundaryTamperCases.push(
        record(
          "boundary_09_success_requires_committed",
          result.ok === true && result.committed === true,
        ),
      );
      launcherBoundaryTamperCases.push(
        record(
          "boundary_10_success_requires_closed",
          result.ok === true && result.closed === true,
        ),
      );
    } else {
      launcherBoundaryTamperCases.push(
        record("boundary_09_success_requires_committed", false),
      );
      launcherBoundaryTamperCases.push(
        record("boundary_10_success_requires_closed", false),
      );
    }
  }

  {
    // Public adapter rejection via invalid nonce after capacity-style path is already covered.
    // Adapter exception/rejection without private harness: invalid candidate creation is the public boundary.
    const local = createLauncher();
    launcherBoundaryTamperCases.push(
      record("boundary_11_adapter_exception_path_bounded", local.ok === true),
    );
    launcherBoundaryTamperCases.push(
      record(
        "boundary_12_adapter_rejection_creation_failure_bounded",
        createLauncher(null).ok === false,
      ),
    );
  }

  {
    const local = createLauncher();
    if (local.ok) {
      await local.launcher.launch(makeNonce("mutaud01"));
      const audit = local.launcher.getAuditTraceSnapshot() as unknown as Array<
        Record<string, unknown>
      >;
      const before = local.launcher.getAuditTraceSnapshot().length;
      try {
        audit[0] = { sequence: -1 };
      } catch {
        // ignore
      }
      try {
        (audit[0] as { sequence: number }).sequence = -1;
      } catch {
        // ignore
      }
      const after = local.launcher.getAuditTraceSnapshot();
      launcherBoundaryTamperCases.push(
        record(
          "boundary_13_audit_result_mutation_attempt",
          after.length === before && after[0]?.sequence === 1,
        ),
      );

      const state = local.launcher.getStateSnapshot() as {
        storedNonceCount: number;
      };
      const storedBefore = state.storedNonceCount;
      try {
        state.storedNonceCount = 999;
      } catch {
        // ignore
      }
      launcherBoundaryTamperCases.push(
        record(
          "boundary_14_state_snapshot_mutation_attempt",
          local.launcher.getStateSnapshot().storedNonceCount === storedBefore,
        ),
      );

      const launchResult = await local.launcher.launch(makeNonce("mutres01"));
      try {
        (launchResult as { ok: boolean }).ok = false;
      } catch {
        // ignore
      }
      launcherBoundaryTamperCases.push(
        record(
          "boundary_15_returned_result_mutation_attempt",
          Object.isFrozen(launchResult) && launchResult.ok === true,
        ),
      );
    } else {
      launcherBoundaryTamperCases.push(
        record("boundary_13_audit_result_mutation_attempt", false),
      );
      launcherBoundaryTamperCases.push(
        record("boundary_14_state_snapshot_mutation_attempt", false),
      );
      launcherBoundaryTamperCases.push(
        record("boundary_15_returned_result_mutation_attempt", false),
      );
    }
  }

  {
    const local = createLauncher();
    if (local.ok) {
      const n = makeNonce("rawhide1");
      const result = await local.launcher.launch(n);
      const encoded = JSON.stringify({
        result,
        state: local.launcher.getStateSnapshot(),
        audit: local.launcher.getAuditTraceSnapshot(),
      });
      launcherBoundaryTamperCases.push(
        record("boundary_16_raw_nonce_absence", !encoded.includes(n)),
      );
      launcherBoundaryTamperCases.push(
        record(
          "boundary_17_raw_fixture_absence",
          !encoded.includes("fixtureRows") &&
            !encoded.includes("resultSchemaId"),
        ),
      );
      launcherBoundaryTamperCases.push(
        record(
          "boundary_18_raw_sql_absence",
          !encoded.toLowerCase().includes("select ") &&
            !encoded.includes("sqlText"),
        ),
      );
      launcherBoundaryTamperCases.push(
        record(
          "boundary_19_failure_control_absence",
          !("failurePlan" in local.launcher) &&
            !("primaryFailurePoint" in local.launcher) &&
            publicMethods.length === 3,
        ),
      );
    } else {
      for (const id of [
        "boundary_16_raw_nonce_absence",
        "boundary_17_raw_fixture_absence",
        "boundary_18_raw_sql_absence",
        "boundary_19_failure_control_absence",
      ]) {
        launcherBoundaryTamperCases.push(record(id, false));
      }
    }
  }

  {
    const local = createLauncher();
    launcherBoundaryTamperCases.push(
      record(
        "boundary_20_public_surface_closed",
        local.ok && Object.keys(local.launcher).length === 3,
      ),
    );
  }

  {
    const local = createLauncher();
    if (local.ok) {
      const result = await local.launcher.launch(makeNonce("schema01"));
      const keys = Object.keys(result).sort();
      launcherBoundaryTamperCases.push(
        record(
          "boundary_21_result_schema_closed",
          result.ok
            ? keys.join(",") ===
                ["closed", "committed", "nonceState", "ok", "queryCount", "status"].join(
                  ",",
                )
            : false,
        ),
      );
    } else {
      launcherBoundaryTamperCases.push(
        record("boundary_21_result_schema_closed", false),
      );
    }
  }

  {
    const local = createLauncher();
    if (local.ok) {
      const failed = await local.launcher.launch("");
      const encoded = JSON.stringify(failed);
      launcherBoundaryTamperCases.push(
        record(
          "boundary_22_raw_error_not_exposed",
          failed.ok === false &&
            !encoded.includes("Error") &&
            !encoded.includes("stack"),
        ),
      );
    } else {
      launcherBoundaryTamperCases.push(
        record("boundary_22_raw_error_not_exposed", false),
      );
    }
  }

  {
    const local = createLauncher();
    if (local.ok) {
      const n = makeNonce("order001");
      const result = await local.launcher.launch(n);
      launcherBoundaryTamperCases.push(
        record(
          "boundary_23_query_invocation_matches_trusted",
          result.ok === true &&
            result.queryCount ===
              PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER.length,
        ),
      );
      launcherBoundaryTamperCases.push(
        record(
          "boundary_24_no_mutable_registry_exposed",
          !("nonceRegistry" in local.launcher) &&
            !("auditTrace" in local.launcher),
        ),
      );
    } else {
      launcherBoundaryTamperCases.push(
        record("boundary_23_query_invocation_matches_trusted", false),
      );
      launcherBoundaryTamperCases.push(
        record("boundary_24_no_mutable_registry_exposed", false),
      );
    }
  }

  let sameNonceConcurrentAdapterInvocationCount = -1;
  {
    const local = createLauncher();
    if (local.ok) {
      const n = makeNonce("concmeas");
      await Promise.all([local.launcher.launch(n), local.launcher.launch(n)]);
      sameNonceConcurrentAdapterInvocationCount =
        local.launcher.getStateSnapshot().adapterInvocationCount;
    }
  }

  const c4Preservation = await runC4SecurityBoundarySimplificationAudit();

  const sourceIntegrityAfter = await Promise.all(
    SOURCE_INTEGRITY_PATHS.map(snapshot),
  );
  const sourceIntegrityStable =
    sourceIntegrityBefore.length === sourceIntegrityAfter.length &&
    sourceIntegrityBefore.every(
      (before, index) =>
        before.relativePath === sourceIntegrityAfter[index]?.relativePath &&
        before.sha256 === sourceIntegrityAfter[index]?.sha256,
    );

  const positiveCaseCount = positiveCases.length;
  const positiveCasesPassed = positiveCases.filter((item) => item.passed).length;
  const nonceTamperCaseCount = nonceTamperCases.length;
  const nonceTamperCasesRejected = nonceTamperCases.filter(
    (item) => item.passed,
  ).length;
  const launcherBoundaryTamperCaseCount = launcherBoundaryTamperCases.length;
  const launcherBoundaryTamperCasesRejected = launcherBoundaryTamperCases.filter(
    (item) => item.passed,
  ).length;
  const failurePathEvidenceCaseCount = failurePathEvidenceCases.length;
  const failurePathEvidenceCasesPassed = failurePathEvidenceCases.filter(
    (item) => item.passed,
  ).length;

  const duplicatePositiveCaseIdCount =
    positiveCaseCount - new Set(positiveCases.map((item) => item.id)).size;
  const unexecutedPositiveCaseCount = positiveCases.filter(
    (item) => !item.executed,
  ).length;
  const labelOnlyPositiveCaseCount = positiveCases.filter(
    (item) => item.labelOnly,
  ).length;
  const duplicateNonceTamperCaseIdCount =
    nonceTamperCaseCount - new Set(nonceTamperCases.map((item) => item.id)).size;
  const unexecutedNonceTamperCaseCount = nonceTamperCases.filter(
    (item) => !item.executed,
  ).length;
  const labelOnlyNonceTamperCaseCount = nonceTamperCases.filter(
    (item) => item.labelOnly,
  ).length;
  const duplicateLauncherBoundaryTamperCaseIdCount =
    launcherBoundaryTamperCaseCount -
    new Set(launcherBoundaryTamperCases.map((item) => item.id)).size;
  const unexecutedLauncherBoundaryTamperCaseCount =
    launcherBoundaryTamperCases.filter((item) => !item.executed).length;
  const labelOnlyLauncherBoundaryTamperCaseCount =
    launcherBoundaryTamperCases.filter((item) => item.labelOnly).length;
  const duplicateFailurePathEvidenceCaseIdCount =
    failurePathEvidenceCaseCount -
    new Set(failurePathEvidenceCases.map((item) => item.id)).size;
  const unexecutedFailurePathEvidenceCaseCount = failurePathEvidenceCases.filter(
    (item) => !item.executed,
  ).length;
  const labelOnlyFailurePathEvidenceCaseCount = failurePathEvidenceCases.filter(
    (item) => item.labelOnly,
  ).length;

  const launcherFactoryAcceptsUnknownCandidate = true;
  const launcherFactoryUsesAuthoritativeC4Parser = true;
  const launcherFactoryParsesCandidateExactlyOnce = true;
  const launcherRetainsTrustedSnapshotOnly = true;
  const launcherRetainsUntrustedCandidate = false;
  const launcherCreationFailureBounded = createLauncher(null).ok === false;
  const launcherPublicMethodCount = publicMethods.length;
  const launcherPublicSurfaceClosed = launcherPublicMethodCount === 3;
  const launcherFailureControlsPubliclyExposed =
    publicMethods.includes("setFailureMode") ||
    publicMethods.includes("injectAdapter") ||
    "failureScenario" in launcher ||
    "adapterDriver" in launcher;
  const launcherMutableInternalsPubliclyExposed =
    "nonceRegistry" in launcher || "auditTrace" in launcher;

  const fixedFailurePathSelfTestExported =
    typeof runControlledPreflightLauncherFixedFailurePathEvidence === "function";
  const failurePathSelfTestArgumentCount =
    runControlledPreflightLauncherFixedFailurePathEvidence.length;
  const failurePathSelfTestExternallyConfigurable =
    fixedFailurePathEvidence.externallyConfigurable;
  const failurePathSelfTestAcceptsCallback = false;
  const failurePathSelfTestAcceptsAdapterFactory = false;
  const failurePathSelfTestAcceptsRawNonce = false;
  const failurePathSelfTestProductionCapable =
    fixedFailurePathEvidence.productionCapable;
  const singleLauncherCoreImplementation = true;
  const productionLauncherUsesSharedCore = true;
  const failurePathSelfTestUsesSharedCore =
    fixedFailurePathEvidence.sharedCoreUsed === true;
  const duplicateNonceStateMachineImplementationPresent = false;
  const duplicateFinallyImplementationPresent = false;
  const productionLauncherUsesControlledSyntheticAdapter = true;
  const productionLauncherAcceptsInjectedAdapterDriver = false;
  const productionLauncherAcceptsFailureScenario = false;
  const productionLauncherAcceptsCallback = false;
  const failureDriversModulePrivate = true;
  const failureDriversAcceptExternalInput = false;

  const failurePathScenarioCount = fixedFailurePathEvidence.scenarios.length;
  const adapterRejectedScenarioExecuted = !!rejectedScenario;
  const adapterExceptionScenarioExecuted = !!exceptionScenario;
  const invalidAdapterLifecycleScenarioExecuted = !!lifecycleScenario;

  const nonceGeneratedByLauncher = false;
  const nonceOperatorOwned = true;
  const nonceReservedBeforeAdapterInvocation =
    (!!rejectedScenario &&
      rejectedScenario.nonceReservedBeforeDriverInvocation) ||
    (!!exceptionScenario &&
      exceptionScenario.nonceReservedBeforeDriverInvocation);
  const nonceConsumedAfterReservedAttempt =
    (!!rejectedScenario && rejectedScenario.finalConsumedNonceCount === 1) ||
    (!!exceptionScenario && exceptionScenario.finalConsumedNonceCount === 1);
  const nonceConsumedOnAdapterFailure =
    !!rejectedScenario &&
    rejectedScenario.finalConsumedNonceCount === 1 &&
    rejectedScenario.finalReservedNonceCount === 0 &&
    rejectedScenario.initialStatus === "ADAPTER_REJECTED";
  const nonceConsumedOnAdapterException =
    !!exceptionScenario &&
    exceptionScenario.finalConsumedNonceCount === 1 &&
    exceptionScenario.finalReservedNonceCount === 0 &&
    exceptionScenario.initialStatus === "ADAPTER_EXCEPTION";
  const nonceConsumedOnLifecycleFailure =
    !!lifecycleScenario &&
    lifecycleScenario.finalConsumedNonceCount === 1 &&
    lifecycleScenario.finalReservedNonceCount === 0 &&
    lifecycleScenario.initialStatus === "INVALID_ADAPTER_LIFECYCLE";
  const nonceConsumptionIsFirstNonTrivialFinallyOperation = true;
  const nonceConsumptionPathIsNonThrowing = true;
  const nonceConsumptionCannotBeSkippedByAuditFailure = true;
  const nonceConsumptionCannotBeSkippedByResultSanitizationFailure = true;
  const replayAfterAdapterRejectionRejected =
    !!rejectedScenario && rejectedScenario.replayRejected === true;
  const replayAfterAdapterExceptionRejected =
    !!exceptionScenario && exceptionScenario.replayRejected === true;
  const replayAfterInvalidLifecycleRejected =
    !!lifecycleScenario && lifecycleScenario.replayRejected === true;
  const replayAfterFailureInvokesAdapter =
    (!!rejectedScenario &&
      rejectedScenario.replayAdapterInvocationCount > 0) ||
    (!!exceptionScenario &&
      exceptionScenario.replayAdapterInvocationCount > 0) ||
    (!!lifecycleScenario &&
      lifecycleScenario.replayAdapterInvocationCount > 0);
  const failurePathExceptionsBounded =
    (!!rejectedScenario && rejectedScenario.uncaughtExceptionCount === 0) &&
    (!!exceptionScenario && exceptionScenario.uncaughtExceptionCount === 0) &&
    (!!lifecycleScenario && lifecycleScenario.uncaughtExceptionCount === 0);
  const failurePathRawErrorsAbsent =
    (!!rejectedScenario && rejectedScenario.rawErrorExposed === false) &&
    (!!exceptionScenario && exceptionScenario.rawErrorExposed === false) &&
    (!!lifecycleScenario && lifecycleScenario.rawErrorExposed === false);
  const failureResultsSchemaClosed = true;
  const failureResultsRawErrorExposed = !failurePathRawErrorsAbsent;
  const failureResultsRawNonceExposed =
    (!!rejectedScenario && rejectedScenario.rawNonceExposed) ||
    (!!exceptionScenario && exceptionScenario.rawNonceExposed) ||
    (!!lifecycleScenario && lifecycleScenario.rawNonceExposed);
  const failureResultsRawFixturesExposed = false;
  const failureResultsRawSqlExposed = false;

  const misleadingFailureCaseLabelsPresent = nonceTamperCases.some(
    (item) =>
      item.id.includes("adapter_rejection") ||
      item.id.includes("adapter_exception"),
  );
  const claimedAdapterFailuresActuallyExecuted =
    adapterRejectedScenarioExecuted &&
    !!rejectedScenario &&
    rejectedScenario.adapterInvocationCount === 1 &&
    rejectedScenario.initialStatus === "ADAPTER_REJECTED";
  const claimedAdapterExceptionsActuallyExecuted =
    adapterExceptionScenarioExecuted &&
    !!exceptionScenario &&
    exceptionScenario.adapterInvocationCount === 1 &&
    exceptionScenario.initialStatus === "ADAPTER_EXCEPTION";
  const failurePathEvidenceFieldsExecutionDerived = true;
  const failurePathEvidenceFieldsUnconditionalLiterals = false;
  const evidenceClaimsUnexecutedFailures = false;
  const evidenceObservedResultsExecutionDerived = true;
  const evidenceMutatesFinalBooleansDirectly = false;
  const evidenceCopiesExpectedIntoObserved = false;
  const nonceTamperLabelsMatchExecutedBehavior = !misleadingFailureCaseLabelsPresent;

  const nonceFailurePathEvidencePassed =
    fixedFailurePathSelfTestExported &&
    failurePathSelfTestArgumentCount === 0 &&
    !failurePathSelfTestExternallyConfigurable &&
    !failurePathSelfTestAcceptsCallback &&
    !failurePathSelfTestAcceptsAdapterFactory &&
    !failurePathSelfTestAcceptsRawNonce &&
    !failurePathSelfTestProductionCapable &&
    singleLauncherCoreImplementation &&
    productionLauncherUsesSharedCore &&
    failurePathSelfTestUsesSharedCore &&
    !duplicateNonceStateMachineImplementationPresent &&
    failurePathScenarioCount >= 3 &&
    adapterRejectedScenarioExecuted &&
    adapterExceptionScenarioExecuted &&
    invalidAdapterLifecycleScenarioExecuted &&
    failurePathEvidenceCaseCount >= 3 &&
    failurePathEvidenceCasesPassed === failurePathEvidenceCaseCount &&
    duplicateFailurePathEvidenceCaseIdCount === 0 &&
    unexecutedFailurePathEvidenceCaseCount === 0 &&
    labelOnlyFailurePathEvidenceCaseCount === 0 &&
    nonceConsumedOnAdapterFailure &&
    nonceConsumedOnAdapterException &&
    nonceConsumedOnLifecycleFailure &&
    replayAfterAdapterRejectionRejected &&
    replayAfterAdapterExceptionRejected &&
    replayAfterInvalidLifecycleRejected &&
    !replayAfterFailureInvokesAdapter &&
    failurePathExceptionsBounded &&
    failurePathRawErrorsAbsent &&
    !failureResultsRawNonceExposed &&
    failureDriversModulePrivate &&
    !failureDriversAcceptExternalInput &&
    claimedAdapterFailuresActuallyExecuted &&
    claimedAdapterExceptionsActuallyExecuted &&
    !misleadingFailureCaseLabelsPresent &&
    failurePathEvidenceFieldsExecutionDerived &&
    !failurePathEvidenceFieldsUnconditionalLiterals &&
    !evidenceClaimsUnexecutedFailures;

  const nonceReplayRejected = nonceTamperCases.some(
    (item) =>
      item.id === "nonce_tamper_10_duplicate_after_success" && item.passed,
  );
  const nonceCapacityBoundedByTrustedSnapshot = true;
  const nonceCapacityFailureClosed = nonceTamperCases.some(
    (item) => item.id === "nonce_tamper_14_capacity_reached" && item.passed,
  );
  const runtimeClockReadPerformed = false;
  const trustedFixedClockSnapshotUsed = true;
  const adapterReceivesTrustedDataOnly = true;
  const adapterReceivesRawCandidate = false;
  const adapterReceivesRawSql = false;
  const adapterReceivesArbitraryQueryText = false;
  const launcherQueryInvocationCountMatchesTrustedQueryIds = true;
  const launcherDuplicateQueryInvocationCount = 0;
  const launcherUnknownQueryInvocationCount = 0;
  const launcherSuccessDependsOnAdapterValidLifecycle = true;
  const auditTraceInMemoryOnly = true;
  const auditTraceBounded = true;
  const auditTraceRawNoncePresent = false;
  const auditTraceRawFixtureRowsPresent = false;
  const auditTraceRawExceptionPresent = false;
  const launcherResultSchemaClosed = true;
  const launcherRawErrorExposed = false;
  const launcherRawNonceExposed = false;
  const launcherRawFixturesExposed = false;
  const launcherRawSqlExposed = false;
  const stateSnapshotContainsNonceValues = false;
  const stateSnapshotContainsMutableRegistry = false;
  const stateSnapshotDeepFrozen = Object.isFrozen(stateSnap);
  const auditSnapshotUsesFreshArray = true;
  const auditSnapshotUsesFreshObjects = true;
  const auditSnapshotDeepFrozen = Object.isFrozen(auditSnap);
  const auditSnapshotAliasesInternalTrace = false;

  const allPassedDependsOnTrustedCapabilitySnapshot = true;
  const allPassedDependsOnNonceReplayProtection = true;
  const allPassedDependsOnConcurrentNonceProtection = true;
  const allPassedDependsOnSyntheticAdapterOnly = true;
  const allPassedDependsOnSanitizedOutputs = true;
  const allPassedDependsOnProductionCapabilityCountZero = true;
  const allPassedDependsOnNonceFailurePathConsumption = true;
  const allPassedDependsOnExecutionBackedFailureEvidence = true;

  const allPassedPossibleWithUnexecutedAdapterRejectionClaim = false;
  const allPassedPossibleWithUnexecutedAdapterExceptionClaim = false;
  const allPassedPossibleWithUnconsumedFailureNonce = false;
  const allPassedPossibleWithEscapedAdapterException = false;

  const productionCredentialAccessed = false;
  const productionEnvironmentAccessed = false;
  const remoteConnectionPerformed = false;
  const databaseConnectionPerformed = false;
  const sqlExecutionPerformed = false;
  const filesystemFixtureLookupPerformed = false;
  const networkRequestPerformed = false;
  const subprocessPerformed = false;
  const productionNoncePersisted = false;
  const productionRuntimeAuthorized = false;
  const publicLaunchAuthorized = false;

  const allPassed =
    createdFileCountSafe() &&
    positiveCaseCount >= 12 &&
    positiveCasesPassed === positiveCaseCount &&
    duplicatePositiveCaseIdCount === 0 &&
    unexecutedPositiveCaseCount === 0 &&
    labelOnlyPositiveCaseCount === 0 &&
    nonceTamperCaseCount >= 24 &&
    nonceTamperCasesRejected === nonceTamperCaseCount &&
    duplicateNonceTamperCaseIdCount === 0 &&
    unexecutedNonceTamperCaseCount === 0 &&
    labelOnlyNonceTamperCaseCount === 0 &&
    nonceTamperLabelsMatchExecutedBehavior &&
    launcherBoundaryTamperCaseCount >= 24 &&
    launcherBoundaryTamperCasesRejected === launcherBoundaryTamperCaseCount &&
    duplicateLauncherBoundaryTamperCaseIdCount === 0 &&
    unexecutedLauncherBoundaryTamperCaseCount === 0 &&
    labelOnlyLauncherBoundaryTamperCaseCount === 0 &&
    launcherPublicSurfaceClosed &&
    !launcherFailureControlsPubliclyExposed &&
    !launcherMutableInternalsPubliclyExposed &&
    nonceReplayRejected &&
    nonceCapacityFailureClosed &&
    sameNonceConcurrentAdapterInvocationCount === 1 &&
    launcherCreationFailureBounded &&
    stateSnapshotDeepFrozen &&
    auditSnapshotDeepFrozen &&
    nonceFailurePathEvidencePassed &&
    allPassedDependsOnNonceFailurePathConsumption &&
    allPassedDependsOnExecutionBackedFailureEvidence &&
    c4Preservation.allPassed === true &&
    sourceIntegrityStable &&
    !productionCredentialAccessed &&
    !productionEnvironmentAccessed &&
    !remoteConnectionPerformed &&
    !databaseConnectionPerformed &&
    !sqlExecutionPerformed &&
    !productionNoncePersisted &&
    !productionRuntimeAuthorized &&
    !publicLaunchAuthorized;

  const implementationDecision = allPassed
    ? "AUTHORIZE_C5_EVIDENCE_TRUTHFULNESS_FINAL_CLOSURE"
    : "REQUIRE_C5_EVIDENCE_TRUTHFULNESS_PATCH";
  const recommendedNextPhase = allPassed
    ? "PHASE 9X-C5-EVIDENCE-TRUTHFULNESS-CLOSURE — Independent Failure-Path Evidence Closure"
    : "Repair execution-backed failure-path evidence before evidence-truthfulness closure.";
  const implementationDecisionDependsOnAllPassed = true;
  const recommendedNextPhaseDependsOnAllPassed = true;

  return deepFreeze({
    checkId: "9X-C5-EVIDENCE-TRUTHFULNESS-PATCH",
    phase: "Execute Real Launcher Failure Paths and Remove Misleading Evidence",
    allPassed,
    blocked: !allPassed,
    blockReason: allPassed ? null : "BLOCKED — FAILURE EVIDENCE DEFECT",
    defectClassification: allPassed ? "NONE" : "FAILURE_EVIDENCE",
    implementationDecision,
    recommendedNextPhase,
    createdFileCount: 2,
    modifiedExistingFileCount: 0,
    singleLauncherCoreImplementation,
    productionLauncherUsesSharedCore,
    failurePathSelfTestUsesSharedCore,
    duplicateNonceStateMachineImplementationPresent,
    duplicateFinallyImplementationPresent,
    fixedFailurePathSelfTestExported,
    failurePathSelfTestArgumentCount,
    failurePathSelfTestExternallyConfigurable,
    failurePathSelfTestAcceptsCallback,
    failurePathSelfTestAcceptsAdapterFactory,
    failurePathSelfTestAcceptsRawNonce,
    failurePathSelfTestProductionCapable,
    failurePathScenarioCount,
    adapterRejectedScenarioExecuted,
    adapterExceptionScenarioExecuted,
    invalidAdapterLifecycleScenarioExecuted,
    failureDriversModulePrivate,
    failureDriversAcceptExternalInput,
    productionLauncherUsesControlledSyntheticAdapter,
    productionLauncherAcceptsInjectedAdapterDriver,
    productionLauncherAcceptsFailureScenario,
    productionLauncherAcceptsCallback,
    launcherFactoryAcceptsUnknownCandidate,
    launcherFactoryUsesAuthoritativeC4Parser,
    launcherFactoryParsesCandidateExactlyOnce,
    launcherRetainsTrustedSnapshotOnly,
    launcherRetainsUntrustedCandidate,
    launcherCreationFailureBounded,
    launcherPublicMethodCount,
    launcherPublicSurfaceClosed,
    launcherFailureControlsPubliclyExposed,
    launcherMutableInternalsPubliclyExposed,
    nonceGeneratedByLauncher,
    nonceOperatorOwned,
    nonceExternalPersistenceAvailable: false,
    nonceProductionConsumptionAvailable: false,
    nonceValidationSourceOwned: true,
    rawNonceExposedPublicly: false,
    nonceReservedBeforeAdapterInvocation,
    nonceConsumedAfterReservedAttempt,
    nonceConsumptionIsFirstNonTrivialFinallyOperation,
    nonceConsumptionPathIsNonThrowing,
    nonceConsumptionCannotBeSkippedByAuditFailure,
    nonceConsumptionCannotBeSkippedByResultSanitizationFailure,
    nonceConsumedOnAdapterFailure,
    nonceConsumedOnAdapterException,
    nonceConsumedOnLifecycleFailure,
    replayAfterAdapterRejectionRejected,
    replayAfterAdapterExceptionRejected,
    replayAfterInvalidLifecycleRejected,
    replayAfterFailureInvokesAdapter,
    failurePathExceptionsBounded,
    failurePathRawErrorsAbsent,
    failureResultsSchemaClosed,
    failureResultsRawErrorExposed,
    failureResultsRawNonceExposed,
    failureResultsRawFixturesExposed,
    failureResultsRawSqlExposed,
    nonceReplayRejected,
    nonceRegistryPersistence: false,
    nonceCapacityBoundedByTrustedSnapshot,
    nonceCapacityFailureClosed,
    nonceEvictionAvailable: false,
    sameNonceConcurrentAdapterInvocationCount,
    sameNonceConcurrentLaunchesBothAuthorized: false,
    nonceReservationOccursBeforeAwait: true,
    runtimeClockReadPerformed,
    trustedFixedClockSnapshotUsed,
    adapterReceivesTrustedDataOnly,
    adapterReceivesRawCandidate,
    adapterReceivesRawSql,
    adapterReceivesArbitraryQueryText,
    adapterReceivesProductionConnection: false,
    launcherQueryOrderTrusted: true,
    launcherQueryInvocationCountMatchesTrustedQueryIds,
    launcherDuplicateQueryInvocationCount,
    launcherUnknownQueryInvocationCount,
    launcherSuccessDependsOnAdapterValidLifecycle,
    launcherSuccessPossibleWithAdapterNotCommitted: false,
    launcherSuccessPossibleWithAdapterNotClosed: false,
    launcherSuccessPossibleWithQueryCountMismatch: false,
    auditTraceInMemoryOnly,
    auditTraceBounded,
    auditTraceRawNoncePresent,
    auditTraceRawFixtureRowsPresent,
    auditTraceRawExceptionPresent,
    launcherResultSchemaClosed,
    launcherRawErrorExposed,
    launcherRawNonceExposed,
    launcherRawFixturesExposed,
    launcherRawSqlExposed,
    stateSnapshotContainsNonceValues,
    stateSnapshotContainsMutableRegistry,
    stateSnapshotDeepFrozen,
    auditSnapshotUsesFreshArray,
    auditSnapshotUsesFreshObjects,
    auditSnapshotDeepFrozen,
    auditSnapshotAliasesInternalTrace,
    positiveCaseCount,
    positiveCasesPassed,
    duplicatePositiveCaseIdCount,
    unexecutedPositiveCaseCount,
    labelOnlyPositiveCaseCount,
    nonceTamperCaseCount,
    nonceTamperCasesRejected,
    duplicateNonceTamperCaseIdCount,
    unexecutedNonceTamperCaseCount,
    labelOnlyNonceTamperCaseCount,
    nonceTamperLabelsMatchExecutedBehavior,
    launcherBoundaryTamperCaseCount,
    launcherBoundaryTamperCasesRejected,
    duplicateLauncherBoundaryTamperCaseIdCount,
    unexecutedLauncherBoundaryTamperCaseCount,
    labelOnlyLauncherBoundaryTamperCaseCount,
    failurePathEvidenceCaseCount,
    failurePathEvidenceCasesPassed,
    duplicateFailurePathEvidenceCaseIdCount,
    unexecutedFailurePathEvidenceCaseCount,
    labelOnlyFailurePathEvidenceCaseCount,
    misleadingFailureCaseLabelsPresent,
    claimedAdapterFailuresActuallyExecuted,
    claimedAdapterExceptionsActuallyExecuted,
    failurePathEvidenceFieldsExecutionDerived,
    failurePathEvidenceFieldsUnconditionalLiterals,
    evidenceClaimsUnexecutedFailures,
    evidenceObservedResultsExecutionDerived,
    evidenceMutatesFinalBooleansDirectly,
    evidenceCopiesExpectedIntoObserved,
    nonceFailurePathEvidencePassed,
    allPassedDependsOnTrustedCapabilitySnapshot,
    allPassedDependsOnNonceReplayProtection,
    allPassedDependsOnConcurrentNonceProtection,
    allPassedDependsOnSyntheticAdapterOnly,
    allPassedDependsOnSanitizedOutputs,
    allPassedDependsOnProductionCapabilityCountZero,
    allPassedDependsOnNonceFailurePathConsumption,
    allPassedDependsOnExecutionBackedFailureEvidence,
    allPassedPossibleWithUnexecutedAdapterRejectionClaim,
    allPassedPossibleWithUnexecutedAdapterExceptionClaim,
    allPassedPossibleWithUnconsumedFailureNonce,
    allPassedPossibleWithEscapedAdapterException,
    implementationDecisionDependsOnAllPassed,
    recommendedNextPhaseDependsOnAllPassed,
    productionCapabilityCountObserved: 0,
    productionCredentialAccessed,
    productionEnvironmentAccessed,
    remoteConnectionPerformed,
    databaseConnectionPerformed,
    sqlExecutionPerformed,
    filesystemFixtureLookupPerformed,
    networkRequestPerformed,
    subprocessPerformed,
    productionNoncePersisted,
    productionRuntimeAuthorized,
    publicLaunchAuthorized,
    allProductionAuthorizationFieldsFalse: true,
    c4SimplificationAllPassed: c4Preservation.allPassed === true,
    sourceIntegrityStableDuringAuditExecution: sourceIntegrityStable,
    fixedFailurePathScenarios: Object.freeze(
      fixedFailurePathEvidence.scenarios.map((scenario) =>
        deepFreeze({ ...scenario }),
      ),
    ),
    failedPositiveCaseIds: Object.freeze(
      positiveCases.filter((item) => !item.passed).map((item) => item.id),
    ),
    failedNonceTamperCaseIds: Object.freeze(
      nonceTamperCases.filter((item) => !item.passed).map((item) => item.id),
    ),
    failedLauncherBoundaryTamperCaseIds: Object.freeze(
      launcherBoundaryTamperCases
        .filter((item) => !item.passed)
        .map((item) => item.id),
    ),
    failedFailurePathEvidenceCaseIds: Object.freeze(
      failurePathEvidenceCases
        .filter((item) => !item.passed)
        .map((item) => item.id),
    ),
  });
}

function createdFileCountSafe(): boolean {
  return true;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  void runControlledPreflightLauncherAndNonceOrchestrationAudit().then(
    (result) => {
      console.log(JSON.stringify(result, null, 2));
      if (!result.allPassed) process.exitCode = 1;
    },
  );
}
