/**
 * Runtime Guarded Delivery (Phase 8.2G-9).
 *
 * Implements `runRuntimeGuardedDelivery` — the first guarded internal delivery
 * bridge between the 8.2G governance pipeline and the Smart Talk API layer.
 *
 * Activates ONLY when all three guards are satisfied:
 *  1. featureFlagEnabled === true (caller checked VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME)
 *  2. internalRuntimeMode === "synthetic_e2e_guarded"
 *  3. internalRuntimeGuard === "I_UNDERSTAND_THIS_IS_SYNTHETIC_INTERNAL_ONLY"
 *
 * When any guard fails: returns a rejected result with emittedToUserNow: false.
 * Normal Smart Talk behavior is entirely unchanged by this module.
 *
 * Safety guarantees:
 * - No live LLM call
 * - No persistence
 * - No DNA save
 * - No offline save
 * - No external service call
 * - Pure function (except calling the pure harness)
 */

import { runRuntimeSyntheticE2EHarness } from "./run-runtime-synthetic-e2e-harness";
import type {
  RuntimeGuardedDeliveryDiagnosticCode,
  RuntimeGuardedDeliveryInput,
  RuntimeGuardedDeliveryResponsePayload,
  RuntimeGuardedDeliveryResult,
  RuntimeGuardedDeliveryVerdict,
} from "./runtime-guarded-delivery-types";
import type { RuntimeSyntheticE2EHarnessResult } from "./runtime-synthetic-e2e-harness-types";

export const RUNTIME_GUARDED_DELIVERY_VERSION =
  "8.2g-9-runtime-guarded-delivery-v1";

const INTERNAL_MODE_VALUE = "synthetic_e2e_guarded" as const;
const INTERNAL_GUARD_VALUE = "I_UNDERSTAND_THIS_IS_SYNTHETIC_INTERNAL_ONLY" as const;

// ── Rejected result builder ───────────────────────────────────────────────────

function makeRejectedResult(
  verdict: RuntimeGuardedDeliveryVerdict,
  diagnostics: RuntimeGuardedDeliveryDiagnosticCode[],
  harnessResult?: RuntimeSyntheticE2EHarnessResult,
): RuntimeGuardedDeliveryResult {
  return {
    verdict,
    responsePayload: null,
    harnessResult: harnessResult ?? null,
    diagnostics,
    emittedToUserNow: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    liveLLMCalled: false,
    syntheticOnly: true,
    neverUserVisible: true,
  };
}

// ── Main function ─────────────────────────────────────────────────────────────

/**
 * Runs the guarded internal delivery path for the 8.2G governance pipeline.
 *
 * Validates all three guards, runs the synthetic E2E harness on `mock_safe`,
 * verifies the harness result invariants, and constructs a minimal synthetic
 * governed response payload.
 *
 * Returns a rejected result (emittedToUserNow: false) on any guard failure.
 * Returns a delivered result (emittedToUserNow: true) on success.
 *
 * Pure function — no side effects, no external calls, no persistence.
 */
export function runRuntimeGuardedDelivery(
  input: RuntimeGuardedDeliveryInput,
): RuntimeGuardedDeliveryResult {
  const diagnostics: RuntimeGuardedDeliveryDiagnosticCode[] = [
    "guarded_delivery_started",
    "guarded_delivery_no_persistence_confirmed",
    "guarded_delivery_no_dna_save_confirmed",
    "guarded_delivery_no_offline_save_confirmed",
    "guarded_delivery_no_live_llm_confirmed",
  ];

  // Guard 1 — Feature flag
  if (input.featureFlagEnabled !== true) {
    diagnostics.push("guarded_delivery_rejected_feature_flag_disabled");
    return makeRejectedResult("rejected_feature_flag_disabled", diagnostics);
  }
  diagnostics.push("guarded_delivery_feature_flag_confirmed");

  // Guard 2 — Internal mode
  if (input.internalRuntimeMode !== INTERNAL_MODE_VALUE) {
    diagnostics.push("guarded_delivery_rejected_missing_internal_mode");
    return makeRejectedResult("rejected_missing_internal_mode", diagnostics);
  }
  diagnostics.push("guarded_delivery_internal_mode_confirmed");

  // Guard 3 — Internal guard phrase
  if (input.internalRuntimeGuard !== INTERNAL_GUARD_VALUE) {
    diagnostics.push("guarded_delivery_rejected_missing_internal_guard");
    return makeRejectedResult("rejected_missing_internal_guard", diagnostics);
  }
  diagnostics.push("guarded_delivery_internal_guard_confirmed");

  // Run harness — only mock_safe is accepted in this phase
  const harnessResult = runRuntimeSyntheticE2EHarness({
    harnessRunId: `${input.deliveryRunId}:harness`,
    fixtureMode: "mock_safe",
    neverUserVisible: true,
    notes: ["Called from runRuntimeGuardedDelivery via guarded API branch."],
  });
  diagnostics.push("guarded_delivery_harness_completed");

  // Harness must be authorised
  if (harnessResult.verdict !== "completed_authorised_packet") {
    diagnostics.push("guarded_delivery_rejected_harness_not_authorised");
    return makeRejectedResult("rejected_harness_not_authorised", diagnostics, harnessResult);
  }

  // Packet must be present
  if (
    harnessResult.packetCreated !== true ||
    harnessResult.acceptedForUserVisibleAssembly !== true
  ) {
    diagnostics.push("guarded_delivery_rejected_packet_missing");
    return makeRejectedResult("rejected_packet_missing", diagnostics, harnessResult);
  }

  // Harness invariant verification
  if (
    harnessResult.emittedToUserNow !== false ||
    harnessResult.liveLLMCalled !== false ||
    harnessResult.persistenceUsed !== false ||
    harnessResult.dnaSavePerformed !== false ||
    harnessResult.offlineSavePerformed !== false
  ) {
    diagnostics.push("guarded_delivery_rejected_invariant_violation");
    return makeRejectedResult("rejected_invariant_violation", diagnostics, harnessResult);
  }

  // Build minimal synthetic governed response payload.
  // The harness does not expose packet sections directly; we use a fixed
  // synthetic status section appropriate for the guarded internal mode.
  const responsePayload: RuntimeGuardedDeliveryResponsePayload = {
    mode: "synthetic_e2e_guarded",
    summary:
      "Synthetic governed Smart Talk response authorised by internal runtime harness.",
    sections: [
      {
        sectionKind: "synthetic_status",
        text: "Internal synthetic runtime delivery succeeded. No real user input, no persistence, no live LLM, and no DNA/offline save were used.",
      },
    ],
    governance: {
      verdict: "delivered_guarded_synthetic_response",
      harnessVerdict: harnessResult.verdict,
      packetAuthorised: true,
      emittedToUserNow: true,
      syntheticOnly: true,
      noPersistence: true,
      noDNA: true,
      noOfflineSave: true,
      noLiveLLM: true,
    },
  };

  diagnostics.push("guarded_delivery_packet_delivered_in_guarded_mode");

  return {
    verdict: "delivered_guarded_synthetic_response",
    responsePayload,
    harnessResult,
    diagnostics,
    emittedToUserNow: true,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    liveLLMCalled: false,
    syntheticOnly: true,
    neverUserVisible: true,
  };
}
