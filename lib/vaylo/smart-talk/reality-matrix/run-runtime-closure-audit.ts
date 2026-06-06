/**
 * Runtime Closure Audit (Phase 8.2G-12).
 *
 * Implements `runRuntimeClosureAudit` — a pure audit function that formally
 * closes the Vaylo Smart Talk 8.2G Runtime Integration epoch.
 *
 * The audit:
 *  1. Builds a static required-layer inventory for all 13 8.2G phases.
 *  2. Runs runRuntimeSyntheticE2EHarness (mock_safe) as live E2E evidence.
 *  3. Runs runRuntimeCorpusGuidedScenarioCoverage as live corpus evidence.
 *  4. Confirms guarded delivery and internal auth via layer inventory.
 *  5. Records open future items (non-blocking for epoch closure).
 *  6. Returns a verdict and readyForControlledLiveInputWiring flag.
 *
 * This function adds no new runtime capabilities. It only consumes evidence
 * from existing pure functions and represents other layers via static inventory.
 *
 * Safety guarantees:
 * - readyForPublicLaunch always false
 * - liveLLMCalled always false
 * - apiRouteModifiedByAudit always false
 * - uiTouched always false
 * - persistenceUsed always false
 * - dnaSavePerformed always false
 * - offlineSavePerformed always false
 * - neverUserVisible always true
 * - no external calls, no persistence, no side effects
 */

import { runRuntimeSyntheticE2EHarness } from "./run-runtime-synthetic-e2e-harness";
import { runRuntimeCorpusGuidedScenarioCoverage } from "./run-runtime-corpus-guided-scenario-coverage";
import type {
  RuntimeClosureAuditDiagnosticCode,
  RuntimeClosureAuditInput,
  RuntimeClosureAuditLayerCheck,
  RuntimeClosureAuditOpenItem,
  RuntimeClosureAuditResult,
  RuntimeClosureAuditVerdict,
} from "./runtime-closure-audit-types";

export const RUNTIME_CLOSURE_AUDIT_VERSION =
  "8.2g-12-runtime-closure-audit-v1";

// ── Static layer inventory ────────────────────────────────────────────────────

/**
 * Compile-time static inventory of all 13 required 8.2G layers.
 * Status is determined by architectural knowledge at authoring time.
 * The audit does not dynamically inspect the filesystem.
 */
const REQUIRED_LAYER_INVENTORY: readonly RuntimeClosureAuditLayerCheck[] = [
  {
    layerId: "mock_draft_adapter",
    status: "present",
    phase: "8.2G-1",
    notes: [
      "runRuntimeLLMDraftMockAdapter() in run-runtime-llm-draft-mock-adapter.ts",
      "RuntimeLLMDraftAdapterInput / RuntimeLLMDraftAdapterResult in runtime-llm-draft-adapter-types.ts",
    ],
    neverUserVisible: true,
  },
  {
    layerId: "output_contract_validator",
    status: "present",
    phase: "8.2G-2 / 8.2G-5A",
    notes: [
      "validateRuntimeLLMOutputContract() in validate-runtime-llm-output-contract.ts",
      "RuntimeLLMOutputContractDraftResult and RuntimeLiveSandboxGuardProof in output contract validator types",
      "RuntimeLLMOutputContractValidationResult.liveLLMCalled widened to boolean in 8.2G-5A",
    ],
    neverUserVisible: true,
  },
  {
    layerId: "wording_governance_gate",
    status: "present",
    phase: "8.2G-3 / 8.2G-6A",
    notes: [
      "runRuntimeWordingGovernanceGate() in run-runtime-wording-governance-gate.ts",
      "RuntimeWordingGateInput.draftResult widened to RuntimeLLMOutputContractDraftResult in 8.2G-6A",
      "deriveDraftId() handles both mock and live sandbox draft IDs",
    ],
    neverUserVisible: true,
  },
  {
    layerId: "audit_trace_diagnostic_dry_run",
    status: "present",
    phase: "8.2G-4",
    notes: [
      "runRuntimeGovernanceDryRun() in run-runtime-governance-dry-run.ts",
      "AuditTraceChain / DiagnosticNormalizedEnvelope types established",
    ],
    neverUserVisible: true,
  },
  {
    layerId: "live_llm_sandbox_adapter",
    status: "present",
    phase: "8.2G-5",
    notes: [
      "runRuntimeLiveLLMSandboxAdapter() in run-runtime-live-llm-sandbox-adapter.ts",
      "6-guard chain implemented; live path disabled by default without OPENAI_API_KEY",
      "RuntimeLiveLLMSandboxDraftCandidateResult requires sandboxGuardProof",
    ],
    neverUserVisible: true,
  },
  {
    layerId: "live_path_type_extension",
    status: "present",
    phase: "8.2G-5A",
    notes: [
      "RuntimeLiveSandboxGuardProof and validateRuntimeLiveSandboxGuardProof in runtime-live-path-type-extension-types.ts",
      "LIVE_SANDBOX_DRAFT_TEXT_PREFIX constant established",
      "Output contract validator updated to accept both mock and live sandbox paths",
    ],
    neverUserVisible: true,
  },
  {
    layerId: "response_assembler_bridge",
    status: "present",
    phase: "8.2G-6",
    notes: [
      "runRuntimeResponseAssemblerBridge() in run-runtime-response-assembler-bridge.ts",
      "stripKnownInternalDraftPrefix() and detectInternalMetadataLeak() helpers",
      "RuntimeResponseAssemblerBridgeResult types in runtime-response-assembler-bridge-types.ts",
    ],
    neverUserVisible: true,
  },
  {
    layerId: "wording_gate_live_path_extension",
    status: "present",
    phase: "8.2G-6A",
    notes: [
      "RuntimeWordingGateInput.draftResult widened in 8.2G-6A to accept RuntimeLLMOutputContractDraftResult",
      "unsafeDraftField() and deriveDraftId() helpers in run-runtime-wording-governance-gate.ts",
    ],
    neverUserVisible: true,
  },
  {
    layerId: "user_visible_authorisation_gate",
    status: "present",
    phase: "8.2G-7",
    notes: [
      "runRuntimeUserVisibleAuthorisationGate() in run-runtime-user-visible-authorisation-gate.ts",
      "UserVisibleResponsePacket with authorisedForFutureDelivery:true, emittedToUserNow:false",
      "RuntimeUserVisibleAuthorisationResult types established",
    ],
    neverUserVisible: true,
  },
  {
    layerId: "synthetic_e2e_harness",
    status: "present",
    phase: "8.2G-8",
    notes: [
      "runRuntimeSyntheticE2EHarness() in run-runtime-synthetic-e2e-harness.ts",
      "6 fixture modes; 12 regression cases in runtime-synthetic-e2e-harness-regression-scaffold.ts",
      "Proves full 8.2G-1→8.2G-7 pipeline without API/UI/live LLM/persistence",
    ],
    neverUserVisible: true,
  },
  {
    layerId: "guarded_delivery",
    status: "present",
    phase: "8.2G-9",
    notes: [
      "runRuntimeGuardedDelivery() in run-runtime-guarded-delivery.ts",
      "Guarded branch in app/api/smart-talk/route.ts activated by internalRuntimeMode + internalRuntimeGuard",
      "Requires VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME=true",
      "RuntimeGuardedDeliveryResponsePayload with syntheticOnly:true",
    ],
    neverUserVisible: true,
  },
  {
    layerId: "authenticated_internal_mode",
    status: "present",
    phase: "8.2G-10",
    notes: [
      "runRuntimeInternalAuthGuard() in runtime-internal-auth-guard.ts",
      "Requires x-vaylo-internal-runtime-secret header matching VAYLO_INTERNAL_RUNTIME_SECRET",
      "Secret env missing disables guarded runtime entirely",
    ],
    neverUserVisible: true,
  },
  {
    layerId: "corpus_guided_coverage",
    status: "present",
    phase: "8.2G-11",
    notes: [
      "runRuntimeCorpusGuidedScenarioCoverage() in run-runtime-corpus-guided-scenario-coverage.ts",
      "6 base scenarios + 6 optional; all 5 governance outcome paths covered",
      "Traces to controlled corpus IDs cc-8-2e-0001, 0004, 0008, 0011, 0015, 0017",
    ],
    neverUserVisible: true,
  },
];

// ── Open future items ─────────────────────────────────────────────────────────

const OPEN_FUTURE_ITEMS: readonly RuntimeClosureAuditOpenItem[] = [
  {
    itemId: "8.2g-12-future-001",
    severity: "future_epoch",
    title: "Controlled live-input wiring (8.2H)",
    recommendation:
      "Phase 8.2H-0 should plan controlled wiring of real user input through the governance pipeline — after corpus pilot evidence is collected.",
    blocksRuntimeClosure: false,
    neverUserVisible: true,
  },
  {
    itemId: "8.2g-12-future-002",
    severity: "future_epoch",
    title: "Real OCR/photo pipeline integration",
    recommendation:
      "OCR processing and photo document analysis remain entirely outside the 8.2G scope. A dedicated OCR governance phase is required before photo-based Smart Talk.",
    blocksRuntimeClosure: false,
    neverUserVisible: true,
  },
  {
    itemId: "8.2g-12-future-003",
    severity: "future_epoch",
    title: "Multilingual runtime wording and localization",
    recommendation:
      "The wording governance gate and response assembler operate on German-language corpus fixtures. Slovak and English runtime localization paths require separate wording gate configuration.",
    blocksRuntimeClosure: false,
    neverUserVisible: true,
  },
  {
    itemId: "8.2g-12-future-004",
    severity: "warning",
    title: "Payment, pricing, and output completeness governance",
    recommendation:
      "The 8.2G runtime does not include payment-gated response completeness or tiered access governance. This must be addressed before any public launch.",
    blocksRuntimeClosure: false,
    neverUserVisible: true,
  },
  {
    itemId: "8.2g-12-future-005",
    severity: "future_epoch",
    title: "Standalone PWA / mobile shell integration",
    recommendation:
      "Smart Talk runtime delivery is currently proven only through the internal guarded API branch. A standalone PWA or mobile shell requires dedicated UI wiring — out of 8.2G scope.",
    blocksRuntimeClosure: false,
    neverUserVisible: true,
  },
  {
    itemId: "8.2g-12-future-006",
    severity: "future_epoch",
    title: "Audit record persistence",
    recommendation:
      "The 8.2G audit runs in-memory only. A future phase should add a lightweight, immutable audit persistence layer (append-only log) for regulatory traceability.",
    blocksRuntimeClosure: false,
    neverUserVisible: true,
  },
  {
    itemId: "8.2g-12-future-007",
    severity: "future_epoch",
    title: "Real corpus and pilot user evidence",
    recommendation:
      "The 8.2G pipeline has been proven with synthetic corpus fixtures only. Pilot user evidence (anonymised, governed) is required to validate the wording gate and output contract under real conditions.",
    blocksRuntimeClosure: false,
    neverUserVisible: true,
  },
  {
    itemId: "8.2g-12-future-008",
    severity: "blocker",
    title: "Public production launch remains blocked",
    recommendation:
      "Public launch requires: live-input wiring, OCR governance, multilingual wording, payment gating, real corpus evidence, and security review. None of these are in scope for 8.2G.",
    blocksRuntimeClosure: false,
    neverUserVisible: true,
  },
];

// ── Main audit function ───────────────────────────────────────────────────────

/**
 * Runs the formal closure audit for the 8.2G Runtime Integration epoch.
 *
 * Combines static layer inventory with live harness and corpus coverage runs.
 * Returns a verdict, open items, and readiness flags.
 *
 * Pure function — no side effects, no external calls, no persistence.
 */
export function runRuntimeClosureAudit(
  input: RuntimeClosureAuditInput,
): RuntimeClosureAuditResult {
  const diagnostics: RuntimeClosureAuditDiagnosticCode[] = [
    "runtime_closure_started",
    "runtime_closure_no_live_llm_in_audit",
    "runtime_closure_no_api_ui_changes",
    "runtime_closure_no_persistence",
    "runtime_closure_no_dna_save",
    "runtime_closure_no_offline_save",
    "runtime_closure_public_runtime_still_blocked",
    "runtime_closure_live_user_input_still_blocked",
    "runtime_closure_ocr_still_blocked",
    "runtime_closure_payment_still_blocked",
    "runtime_closure_multilingual_runtime_still_future",
  ];

  const baseResult = {
    readyForPublicLaunch: false as const,
    liveLLMCalled: false as const,
    apiRouteModifiedByAudit: false as const,
    uiTouched: false as const,
    persistenceUsed: false as const,
    dnaSavePerformed: false as const,
    offlineSavePerformed: false as const,
    neverUserVisible: true as const,
    nextRecommendedPhase: "8.2H-0 — Controlled Live Input Wiring Plan",
  };

  // ── Layer inventory check ─────────────────────────────────────────────────

  const layerChecks = REQUIRED_LAYER_INVENTORY;
  const missingLayer = layerChecks.find((c) => c.status === "missing");
  diagnostics.push("runtime_closure_phase_inventory_completed");

  if (missingLayer) {
    diagnostics.push("runtime_closure_blocked_missing_required_layer");
    return {
      auditRunId: input.auditRunId,
      verdict: "blocked_missing_required_layer",
      diagnostics,
      layerChecks,
      openItems: OPEN_FUTURE_ITEMS,
      syntheticE2EPassed: false,
      corpusCoveragePassed: false,
      guardedDeliveryPresent: false,
      internalAuthPresent: false,
      readyForControlledLiveInputWiring: false,
      ...baseResult,
      notes: [
        `Missing required layer: ${missingLayer.layerId} (phase ${missingLayer.phase}).`,
        "Epoch closure blocked until all required 8.2G layers are present.",
      ],
    };
  }
  diagnostics.push("runtime_closure_required_layers_present");

  // ── Synthetic E2E harness check ───────────────────────────────────────────

  const e2eResult = runRuntimeSyntheticE2EHarness({
    harnessRunId: `${input.auditRunId}:synthetic-e2e`,
    fixtureMode: "mock_safe",
    neverUserVisible: true,
  });

  const syntheticE2EPassed =
    e2eResult.verdict === "completed_authorised_packet" &&
    e2eResult.packetCreated === true &&
    e2eResult.acceptedForUserVisibleAssembly === true &&
    e2eResult.emittedToUserNow === false &&
    e2eResult.liveLLMCalled === false &&
    e2eResult.persistenceUsed === false &&
    e2eResult.dnaSavePerformed === false &&
    e2eResult.offlineSavePerformed === false;

  if (!syntheticE2EPassed) {
    diagnostics.push("runtime_closure_blocked_invariant_failure");
    return {
      auditRunId: input.auditRunId,
      verdict: "blocked_invariant_failure",
      diagnostics,
      layerChecks,
      openItems: OPEN_FUTURE_ITEMS,
      syntheticE2EPassed: false,
      corpusCoveragePassed: false,
      guardedDeliveryPresent: true,
      internalAuthPresent: true,
      readyForControlledLiveInputWiring: false,
      ...baseResult,
      notes: [
        `Synthetic E2E harness returned verdict: ${e2eResult.verdict}.`,
        "Expected completed_authorised_packet with all safety invariants false.",
      ],
    };
  }
  diagnostics.push("runtime_closure_synthetic_e2e_passed");

  // ── Corpus coverage check ─────────────────────────────────────────────────

  const corpusResult = runRuntimeCorpusGuidedScenarioCoverage({
    coverageRunId: `${input.auditRunId}:corpus-coverage`,
    includeOptionalScenarios: input.includeOptionalCorpusScenarios === true,
    neverUserVisible: true,
  });

  const corpusCoveragePassed =
    corpusResult.verdict === "completed_all_passed" &&
    corpusResult.totalScenarios >= 6 &&
    corpusResult.failedScenarios === 0 &&
    corpusResult.liveLLMCalled === false &&
    corpusResult.apiRouteTouched === false &&
    corpusResult.uiTouched === false &&
    corpusResult.persistenceUsed === false &&
    corpusResult.dnaSavePerformed === false &&
    corpusResult.offlineSavePerformed === false;

  if (!corpusCoveragePassed) {
    diagnostics.push("runtime_closure_blocked_coverage_failure");
    return {
      auditRunId: input.auditRunId,
      verdict: "blocked_coverage_failure",
      diagnostics,
      layerChecks,
      openItems: OPEN_FUTURE_ITEMS,
      syntheticE2EPassed,
      corpusCoveragePassed: false,
      guardedDeliveryPresent: true,
      internalAuthPresent: true,
      readyForControlledLiveInputWiring: false,
      ...baseResult,
      notes: [
        `Corpus coverage verdict: ${corpusResult.verdict}. Total: ${String(corpusResult.totalScenarios)}, failed: ${String(corpusResult.failedScenarios)}.`,
        "All 6 base scenarios must pass for epoch closure.",
      ],
    };
  }
  diagnostics.push("runtime_closure_corpus_coverage_passed");

  // ── Guarded delivery and internal auth ────────────────────────────────────

  const guardedDeliveryPresent =
    layerChecks.find((c) => c.layerId === "guarded_delivery")?.status === "present";
  const internalAuthPresent =
    layerChecks.find((c) => c.layerId === "authenticated_internal_mode")?.status === "present";

  if (!guardedDeliveryPresent || !internalAuthPresent) {
    diagnostics.push("runtime_closure_blocked_guard_failure");
    return {
      auditRunId: input.auditRunId,
      verdict: "blocked_guard_failure",
      diagnostics,
      layerChecks,
      openItems: OPEN_FUTURE_ITEMS,
      syntheticE2EPassed,
      corpusCoveragePassed,
      guardedDeliveryPresent: guardedDeliveryPresent ?? false,
      internalAuthPresent: internalAuthPresent ?? false,
      readyForControlledLiveInputWiring: false,
      ...baseResult,
      notes: [
        `guardedDeliveryPresent: ${String(guardedDeliveryPresent)}. internalAuthPresent: ${String(internalAuthPresent)}.`,
        "Both guarded delivery (8.2G-9) and authenticated internal mode (8.2G-10) must be present for closure.",
      ],
    };
  }
  diagnostics.push("runtime_closure_guarded_delivery_present");
  diagnostics.push("runtime_closure_internal_auth_present");

  // ── Open items — none block runtime closure in 8.2G ──────────────────────

  const hasWarnings = OPEN_FUTURE_ITEMS.some((i) => i.severity === "warning");
  if (hasWarnings) {
    diagnostics.push("runtime_closure_warning_open_future_work");
  }

  // All required gates passed — epoch is closed
  const verdict: RuntimeClosureAuditVerdict = hasWarnings
    ? "closed_with_warnings"
    : "closed_runtime_epoch";

  diagnostics.push("runtime_closure_epoch_closed");

  const readyForControlledLiveInputWiring =
    verdict === "closed_runtime_epoch" || verdict === "closed_with_warnings";

  return {
    auditRunId: input.auditRunId,
    verdict,
    diagnostics,
    layerChecks,
    openItems: OPEN_FUTURE_ITEMS,
    syntheticE2EPassed,
    corpusCoveragePassed,
    guardedDeliveryPresent: true,
    internalAuthPresent: true,
    readyForControlledLiveInputWiring,
    ...baseResult,
    notes: [
      `Audit version: ${RUNTIME_CLOSURE_AUDIT_VERSION}.`,
      `Audit run ID: ${input.auditRunId}.`,
      "8.2G epoch closure status: " + verdict + ".",
      `Layers checked: ${String(layerChecks.length)}. All present.`,
      `Synthetic E2E: passed. Corpus scenarios: ${String(corpusResult.totalScenarios)} base. All passed.`,
      "Guarded delivery: present (8.2G-9). Internal auth: present (8.2G-10).",
      `Open items: ${String(OPEN_FUTURE_ITEMS.length)} recorded. None block runtime epoch closure.`,
      "readyForPublicLaunch: false. readyForControlledLiveInputWiring: " + String(readyForControlledLiveInputWiring) + ".",
      "Next recommended phase: " + baseResult.nextRecommendedPhase + ".",
    ],
  };
}
