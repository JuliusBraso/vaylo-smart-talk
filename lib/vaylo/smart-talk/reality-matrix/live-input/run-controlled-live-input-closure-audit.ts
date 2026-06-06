/**
 * Controlled Live Input Closure Audit (Phase 8.2H-6, updated 8.2I-3).
 *
 * Implements `runControlledLiveInputClosureAudit` — a pure audit function that
 * formally closes the 8.2H Controlled Live Input epoch.
 *
 * The audit:
 *   1. Records a static required layer inventory (all 8 required layers).
 *   2. Runs a live E2E harness check (8.2H-4) to confirm `completed_adapter_candidate`.
 *   3. Runs a live guarded runtime pipeline check (8.2H-5/8.2I-3) to confirm
 *      `completed_authorised_internal_packet`.
 *   4. Verifies invariants on nested results.
 *   5. Records open technical debt items.
 *   6. Determines the final epoch verdict.
 *
 * Phase 8.2I-3 update:
 *   The temporary mock-bridge debt items (8.2H-DEBT-001 and 8.2H-DEBT-002)
 *   have been resolved by removing the bridge and enabling direct
 *   `ControlledLiveTextDraftResult` forwarding in 8.2I-3.
 *   `readyForControlledRealTextForwardingTo8_2G` can now be `true` when the
 *   pipeline confirms `temporaryMockBridgeUsed: false`,
 *   `controlledLiveTextDraftUsed: true`, and
 *   `realRedactedTextForwardedToOutputContract: true`.
 *   `readyForPublicLaunch` remains `false`.
 *
 * Safety invariants (literal types on the result):
 * - readyForPublicLaunch: false
 * - liveLLMCalled: false
 * - apiRouteModifiedByAudit: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - neverUserVisible: true
 *
 * Pure function — no external calls, no logging, no persistence.
 * Does NOT inspect the filesystem dynamically.
 * Does NOT modify any API route.
 */

import { runControlledLiveTextE2EHarness } from "./run-controlled-live-text-e2e-harness";
import { runGuardedLiveTextRuntimePipeline } from "./run-guarded-live-text-runtime-pipeline";
import type {
  ControlledLiveInputClosureAuditDiagnosticCode,
  ControlledLiveInputClosureAuditInput,
  ControlledLiveInputClosureAuditResult,
  ControlledLiveInputClosureAuditVerdict,
  ControlledLiveInputLayerCheck,
  ControlledLiveInputOpenItem,
} from "./controlled-live-input-closure-audit-types";

export const CONTROLLED_LIVE_INPUT_CLOSURE_AUDIT_VERSION =
  "8.2h-6-controlled-live-input-closure-audit-v2-8.2i-3";

// ── Static required layer inventory ──────────────────────────────────────────

const REQUIRED_LAYER_INVENTORY: readonly ControlledLiveInputLayerCheck[] = [
  {
    layerId: "wiring_plan",
    status: "present",
    phase: "8.2H-0",
    notes: [
      "CONTROLLED_LIVE_INPUT_WIRING_PLAN_V1 defined in live-input/controlled-live-input-wiring-plan-types.ts.",
      "Plan markdown in live-input/CONTROLLED_LIVE_INPUT_WIRING_PLAN.md.",
    ],
    neverUserVisible: true,
  },
  {
    layerId: "real_text_input_contract",
    status: "present",
    phase: "8.2H-1",
    notes: [
      "runRealTextInputContractValidation() in live-input/run-real-text-input-contract-validation.ts.",
      "Validates input mode, source kind, forbidden feature flags, and text length.",
      "acceptedForRedactionBoundary: true on success; all further pipeline gates literal false.",
    ],
    neverUserVisible: true,
  },
  {
    layerId: "redaction_boundary",
    status: "present",
    phase: "8.2H-2",
    notes: [
      "runRealTextRedactionBoundary() in live-input/run-real-text-redaction-boundary.ts.",
      "Applies 9 conservative PII redaction patterns. Match audit stores kind/risk/placeholder only.",
      "Post-redaction invariant check verifies email/IBAN patterns absent from output.",
      "acceptedForControlledLiveAdapter: true on success; acceptedForLLM: false (literal).",
    ],
    neverUserVisible: true,
  },
  {
    layerId: "controlled_live_text_adapter",
    status: "present",
    phase: "8.2H-3",
    notes: [
      "runControlledLiveTextAdapter() in live-input/run-controlled-live-text-adapter.ts.",
      "Wraps redacted text only with [CONTROLLED_LIVE_TEXT_DRAFT_NEVER_USER_VISIBLE] prefix.",
      "No answer, summary, translation, or prose generation.",
      "adaptedForOutputContractValidation: true on success; acceptedForLLM: false (literal).",
    ],
    neverUserVisible: true,
  },
  {
    layerId: "controlled_live_text_e2e_harness",
    status: "present",
    phase: "8.2H-4",
    notes: [
      "runControlledLiveTextE2EHarness() in live-input/run-controlled-live-text-e2e-harness.ts.",
      "Exercises 12 fixture modes: 3 success paths, 9 blocking paths.",
      "Does NOT connect to 8.2G output contract validator.",
      "Nested layer invariants verified inside harness.",
    ],
    neverUserVisible: true,
  },
  {
    layerId: "guarded_live_text_runtime_pipeline",
    status: "present",
    phase: "8.2H-5",
    notes: [
      "runGuardedLiveTextRuntimePipeline() in live-input/run-guarded-live-text-runtime-pipeline.ts.",
      "Connects 8.2H chain to 8.2G governance gates: output contract → wording → assembler → authorisation.",
      "Uses temporary mock-bridge for output contract compatibility (recorded as open item 001/002).",
      "emittedToUserNow: false always; all invariants verified at each stage.",
    ],
    neverUserVisible: true,
  },
  {
    layerId: "guarded_internal_api_branch",
    status: "present",
    phase: "8.2H-5",
    notes: [
      "Added to app/api/smart-talk/route.ts inside the existing guarded delivery block.",
      "Activates only when internalRuntimeMode === 'controlled_live_text_guarded' AND",
      "internalRuntimeGuard === 'I_UNDERSTAND_THIS_IS_CONTROLLED_LIVE_TEXT_INTERNAL_ONLY'.",
      "Uses safe_real_text fixture only; no real user text forwarded.",
    ],
    neverUserVisible: true,
  },
  {
    layerId: "authenticated_internal_access",
    status: "present",
    phase: "8.2G-10 (reused by 8.2H-5)",
    notes: [
      "runRuntimeInternalAuthGuard() from runtime-internal-auth-guard.ts.",
      "Requires VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME=true, VAYLO_INTERNAL_RUNTIME_SECRET,",
      "and x-vaylo-internal-runtime-secret header. 8.2H-5 branch inherits this guard.",
    ],
    neverUserVisible: true,
  },
];

// ── Open technical debt items ─────────────────────────────────────────────────

const OPEN_ITEMS: readonly ControlledLiveInputOpenItem[] = [
  // 8.2H-DEBT-001 (temporary mock bridge) — RESOLVED in Phase 8.2I-3.
  // 8.2H-DEBT-002 (real redacted text forwarding blocked) — RESOLVED in Phase 8.2I-3.
  {
    itemId: "8.2H-DEBT-003",
    severity: "blocker",
    title: "Public anonymous live runtime remains blocked",
    recommendation:
      "Keep guarded internal mode only until Phase 8.2I and pilot readiness have been formally certified.",
    blocksEpochClosure: false,
    blocksPublicLaunch: true,
    neverUserVisible: true,
  },
  {
    itemId: "8.2H-DEBT-004",
    severity: "future_epoch",
    title: "OCR / photo and file upload remain future",
    recommendation:
      "Implement only after the text-only guarded live pipeline has been proven end-to-end in production.",
    blocksEpochClosure: false,
    blocksPublicLaunch: true,
    neverUserVisible: true,
  },
  {
    itemId: "8.2H-DEBT-005",
    severity: "future_epoch",
    title: "Payment / completeness warning remains future",
    recommendation:
      "Implement before any monetized document or text explanation feature is shipped.",
    blocksEpochClosure: false,
    blocksPublicLaunch: true,
    neverUserVisible: true,
  },
  {
    itemId: "8.2H-DEBT-006",
    severity: "future_epoch",
    title: "Multilingual runtime remains future",
    recommendation:
      "Implement after text-only controlled pipeline closure and pilot evidence is collected.",
    blocksEpochClosure: false,
    blocksPublicLaunch: true,
    neverUserVisible: true,
  },
  {
    itemId: "8.2H-DEBT-007",
    severity: "future_epoch",
    title: "Audit persistence remains future",
    recommendation:
      "Add immutable governance audit storage before broader pilot evidence collection begins.",
    blocksEpochClosure: false,
    blocksPublicLaunch: true,
    neverUserVisible: true,
  },
];

// ── Main audit function ───────────────────────────────────────────────────────

/**
 * Formally closes the 8.2H Controlled Live Input epoch.
 *
 * Runs live checks against the E2E harness and guarded runtime pipeline to
 * confirm correctness, then records open technical debt items.
 *
 * Expected verdict: `closed_with_warnings` (temporary mock-bridge debt is a
 * non-blocking open item that still prevents real text forwarding).
 *
 * Pure function — no external calls, no logging, no persistence.
 */
export function runControlledLiveInputClosureAudit(
  input: ControlledLiveInputClosureAuditInput,
): ControlledLiveInputClosureAuditResult {
  const { auditRunId } = input;

  const diagnostics: ControlledLiveInputClosureAuditDiagnosticCode[] = [
    "controlled_live_input_closure_started",
    "controlled_live_input_closure_no_live_llm_in_audit",
    "controlled_live_input_closure_no_api_ui_changes",
    "controlled_live_input_closure_no_persistence",
    "controlled_live_input_closure_no_dna_save",
    "controlled_live_input_closure_no_offline_save",
    "controlled_live_input_closure_public_runtime_still_blocked",
    "controlled_live_input_closure_ocr_still_blocked",
    "controlled_live_input_closure_persistence_still_blocked",
    "controlled_live_input_closure_dna_save_still_blocked",
    "controlled_live_input_closure_offline_save_still_blocked",
    // Phase 8.2I-3: real text forwarding is now enabled via ControlledLiveTextDraftResult
  ];

  // ── Layer inventory ───────────────────────────────────────────────────────

  const layerChecks = REQUIRED_LAYER_INVENTORY;
  diagnostics.push("controlled_live_input_closure_layer_inventory_completed");

  const missingLayers = layerChecks.filter((lc) => lc.status === "missing");
  if (missingLayers.length > 0) {
    diagnostics.push("controlled_live_input_closure_blocked_missing_required_layer");
    return buildResult(
      auditRunId,
      "blocked_missing_required_layer",
      diagnostics,
      layerChecks,
      false,
      false,
      [`Required layers missing: ${missingLayers.map((l) => l.layerId).join(", ")}.`],
    );
  }
  diagnostics.push("controlled_live_input_closure_required_layers_present");
  diagnostics.push("controlled_live_input_closure_guarded_api_branch_recorded");
  diagnostics.push("controlled_live_input_closure_internal_auth_required");

  // ── E2E harness verification ──────────────────────────────────────────────

  const harnessResult = runControlledLiveTextE2EHarness({
    harnessRunId: `${auditRunId}:e2e`,
    fixtureMode: "safe_real_text",
    neverUserVisible: true,
  });

  // Invariant check
  if (
    harnessResult.liveLLMCalled !== false ||
    harnessResult.persistenceUsed !== false ||
    harnessResult.dnaSavePerformed !== false ||
    harnessResult.offlineSavePerformed !== false
  ) {
    diagnostics.push("controlled_live_input_closure_blocked_invariant_failure");
    return buildResult(
      auditRunId,
      "blocked_invariant_failure",
      diagnostics,
      layerChecks,
      false,
      false,
      ["E2E harness result violated safety invariants."],
    );
  }

  const e2eHarnessPassed =
    harnessResult.verdict === "completed_adapter_candidate" &&
    harnessResult.adapterCandidateCreated === true &&
    harnessResult.adaptedForOutputContractValidation === true &&
    harnessResult.acceptedForLLM === false &&
    harnessResult.acceptedForRuntimePipeline === false &&
    harnessResult.acceptedForUserVisibleOutput === false &&
    harnessResult.liveLLMCalled === false &&
    harnessResult.persistenceUsed === false &&
    harnessResult.dnaSavePerformed === false &&
    harnessResult.offlineSavePerformed === false &&
    harnessResult.userVisibleOutputEmitted === false;

  if (!e2eHarnessPassed) {
    diagnostics.push("controlled_live_input_closure_blocked_e2e_harness_failure");
    return buildResult(
      auditRunId,
      "blocked_e2e_harness_failure",
      diagnostics,
      layerChecks,
      false,
      false,
      [`E2E harness check failed. Verdict: ${harnessResult.verdict}.`],
    );
  }
  diagnostics.push("controlled_live_input_closure_e2e_harness_passed");

  // ── Guarded runtime pipeline verification ────────────────────────────────

  const pipelineResult = runGuardedLiveTextRuntimePipeline({
    pipelineRunId: `${auditRunId}:runtime-pipeline`,
    fixtureMode: "safe_real_text",
    neverUserVisible: true,
  });

  // Invariant check
  if (
    pipelineResult.liveLLMCalled !== false ||
    pipelineResult.persistenceUsed !== false ||
    pipelineResult.dnaSavePerformed !== false ||
    pipelineResult.offlineSavePerformed !== false
  ) {
    diagnostics.push("controlled_live_input_closure_blocked_invariant_failure");
    return buildResult(
      auditRunId,
      "blocked_invariant_failure",
      diagnostics,
      layerChecks,
      true,
      false,
      ["Guarded runtime pipeline result violated safety invariants."],
    );
  }

  const runtimePipelinePassed =
    pipelineResult.verdict === "completed_authorised_internal_packet" &&
    pipelineResult.packetCreated === true &&
    pipelineResult.acceptedForUserVisibleAssembly === true &&
    pipelineResult.userVisibleOutputAllowedForFuture === true &&
    pipelineResult.emittedToUserNow === false &&
    pipelineResult.liveLLMCalled === false &&
    pipelineResult.persistenceUsed === false &&
    pipelineResult.dnaSavePerformed === false &&
    pipelineResult.offlineSavePerformed === false;

  // Phase 8.2I-3: verify bridge-removal proof fields
  const mockBridgeRemoved = pipelineResult.temporaryMockBridgeUsed === false;
  const controlledDraftUsed = pipelineResult.controlledLiveTextDraftUsed === true;
  const realTextForwarded = pipelineResult.realRedactedTextForwardedToOutputContract === true;

  if (!runtimePipelinePassed) {
    diagnostics.push("controlled_live_input_closure_blocked_runtime_pipeline_failure");
    return buildResult(
      auditRunId,
      "blocked_runtime_pipeline_failure",
      diagnostics,
      layerChecks,
      true,
      false,
      [`Guarded runtime pipeline check failed. Verdict: ${pipelineResult.verdict}.`],
    );
  }
  diagnostics.push("controlled_live_input_closure_runtime_pipeline_passed");

  // ── Open items — determine if epoch closure is blocked ───────────────────

  // 8.2H-DEBT-001 and 8.2H-DEBT-002 are now resolved (Phase 8.2I-3).
  // Remaining open items (003–007) are future-epoch work; none block epoch closure.

  const anyBlocksEpochClosure = OPEN_ITEMS.some((item) => item.blocksEpochClosure);

  const verdict: ControlledLiveInputClosureAuditVerdict = anyBlocksEpochClosure
    ? "blocked_missing_required_layer"  // escalate if something blocks closure
    : OPEN_ITEMS.some((item) => item.severity === "warning" || item.severity === "blocker")
    ? "closed_with_warnings"
    : "closed_controlled_live_input_epoch";

  diagnostics.push("controlled_live_input_closure_epoch_closed");

  // readyForControlledRealTextForwardingTo8_2G: true only when all proof flags confirmed
  const readyForRealTextForwarding =
    runtimePipelinePassed &&
    mockBridgeRemoved &&
    controlledDraftUsed &&
    realTextForwarded &&
    pipelineResult.emittedToUserNow === false &&
    pipelineResult.liveLLMCalled === false &&
    pipelineResult.persistenceUsed === false &&
    pipelineResult.dnaSavePerformed === false &&
    pipelineResult.offlineSavePerformed === false;

  return {
    auditRunId,
    verdict,
    diagnostics,
    layerChecks,
    openItems: OPEN_ITEMS,
    e2eHarnessPassed: true,
    runtimePipelinePassed: true,
    guardedApiBranchPresent: true,
    authenticatedInternalAccessPresent: true,
    readyForControlledRealTextForwardingTo8_2G: readyForRealTextForwarding,
    readyForPublicLaunch: false,
    liveLLMCalled: false,
    apiRouteModifiedByAudit: false,
    uiTouched: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    neverUserVisible: true,
    nextRecommendedPhase:
      readyForRealTextForwarding
        ? "8.2I-4 — Real Redacted Text Forwarding Harness"
        : "Investigate: readyForControlledRealTextForwardingTo8_2G proof flags failed.",
    notes: [
      `Audit version: ${CONTROLLED_LIVE_INPUT_CLOSURE_AUDIT_VERSION}.`,
      `Audit run ID: ${auditRunId}.`,
      `Verdict: ${verdict}. Open items: ${String(OPEN_ITEMS.length)} (none block epoch closure).`,
      "8.2H-DEBT-001 (temporary mock bridge): RESOLVED in Phase 8.2I-3.",
      "8.2H-DEBT-002 (real redacted text forwarding): RESOLVED in Phase 8.2I-3.",
      `readyForControlledRealTextForwardingTo8_2G: ${String(readyForRealTextForwarding)}.`,
      "readyForPublicLaunch: false — public launch remains blocked.",
    ],
  };
}

// ── Blocked result builder ────────────────────────────────────────────────────

function buildResult(
  auditRunId: string,
  verdict: ControlledLiveInputClosureAuditVerdict,
  diagnostics: ControlledLiveInputClosureAuditDiagnosticCode[],
  layerChecks: readonly ControlledLiveInputLayerCheck[],
  e2eHarnessPassed: boolean,
  runtimePipelinePassed: boolean,
  notes: string[],
): ControlledLiveInputClosureAuditResult {
  return {
    auditRunId,
    verdict,
    diagnostics,
    layerChecks,
    openItems: OPEN_ITEMS,
    e2eHarnessPassed,
    runtimePipelinePassed,
    guardedApiBranchPresent: true,
    authenticatedInternalAccessPresent: true,
    readyForControlledRealTextForwardingTo8_2G: false,
    readyForPublicLaunch: false,
    liveLLMCalled: false,
    apiRouteModifiedByAudit: false,
    uiTouched: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    neverUserVisible: true,
    nextRecommendedPhase: "8.2I-4 — Real Redacted Text Forwarding Harness",
    notes,
  };
}
