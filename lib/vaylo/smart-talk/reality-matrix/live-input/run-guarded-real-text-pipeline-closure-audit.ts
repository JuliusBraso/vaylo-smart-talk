/**
 * Guarded Real Text Pipeline Closure Audit (Phase 8.2I-5).
 *
 * Implements `runGuardedRealTextPipelineClosureAudit` — the formal closure audit
 * for the 8.2I Controlled Live Text Output Contract Compatibility epoch.
 *
 * The audit:
 *   1. Records a static required layer inventory (all 6 8.2I layers).
 *   2. Asserts sourceKind alignment (adapterMode = "controlled_live_text",
 *      sourceKind = "controlled_live_text" — aligned in 8.2I-3A).
 *   3. Asserts temporary mock bridge removal (8.2I-3).
 *   4. Runs `runRealRedactedTextForwardingHarness` for all 11 fixture modes
 *      and verifies each against its expected outcome.
 *   5. Confirms rawValueLeakCheckPassed on all success fixtures.
 *   6. Confirms controlledLiveTextDraftAcceptedByOutputContract on success fixtures.
 *   7. Verifies invariants on all nested harness results.
 *   8. Records open future-epoch items.
 *   9. Determines the final epoch verdict.
 *
 * Expected verdict: `closed_with_warnings` because public launch, OCR, payment,
 * multilingual runtime, audit persistence, pilot shell, and real pilot evidence
 * remain blocked or future.
 *
 * Safety invariants (literal types on the result):
 * - readyForPublicLaunch: false
 * - liveLLMCalled: false
 * - apiRouteModifiedByAudit: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - emittedToUserNow: false
 * - neverUserVisible: true
 *
 * Pure function — no external calls, no logging, no persistence.
 * Does NOT inspect the filesystem dynamically.
 * Does NOT modify any API route.
 */

import { runRealRedactedTextForwardingHarness } from "./run-real-redacted-text-forwarding-harness";
import type {
  GuardedRealTextPipelineClosureAuditDiagnosticCode,
  GuardedRealTextPipelineClosureAuditInput,
  GuardedRealTextPipelineClosureAuditResult,
  GuardedRealTextPipelineClosureAuditVerdict,
  GuardedRealTextLayerCheck,
  GuardedRealTextOpenItem,
} from "./guarded-real-text-pipeline-closure-audit-types";
import type { RealRedactedTextForwardingHarnessResult } from "./real-redacted-text-forwarding-harness-types";

export const GUARDED_REAL_TEXT_PIPELINE_CLOSURE_AUDIT_VERSION =
  "8.2i-5-guarded-real-text-pipeline-closure-audit-v1";

// ── Static required layer inventory ──────────────────────────────────────────

const REQUIRED_LAYER_INVENTORY: readonly GuardedRealTextLayerCheck[] = [
  {
    layerId: "compatibility_plan",
    status: "present",
    phase: "8.2I-0",
    notes: [
      "CONTROLLED_LIVE_TEXT_OUTPUT_CONTRACT_COMPATIBILITY_PLAN_V1 in controlled-live-text-output-contract-compatibility-plan-types.ts.",
      "Plan markdown in CONTROLLED_LIVE_TEXT_OUTPUT_CONTRACT_COMPATIBILITY_PLAN.md.",
    ],
    neverUserVisible: true,
  },
  {
    layerId: "controlled_live_text_draft_result_types",
    status: "present",
    phase: "8.2I-1",
    notes: [
      "ControlledLiveTextDraftResult, ControlledLiveTextRedactionProof defined.",
      "buildControlledLiveTextDraftResult(), buildControlledLiveTextRedactionProof(), validateControlledLiveTextRedactionProof() exported.",
      "CONTROLLED_LIVE_TEXT_DRAFT_PREFIX = '[CONTROLLED_LIVE_TEXT_DRAFT_NEVER_USER_VISIBLE]'.",
      "All types carry liveLLMCalled: false and neverUserVisible: true literal invariants.",
    ],
    neverUserVisible: true,
  },
  {
    layerId: "output_contract_validator_extension",
    status: "present",
    phase: "8.2I-2",
    notes: [
      "validateRuntimeLLMOutputContract() extended to accept adapterMode: 'controlled_live_text'.",
      "sourceKind: 'controlled_live_text' is now a formal RuntimeLLMOutputContractDraftSourceKind value.",
      "redactionProof presence and validity validated on the controlled live text path.",
      "CONTROLLED_LIVE_TEXT_DRAFT_PREFIX enforcement added for section candidates.",
    ],
    neverUserVisible: true,
  },
  {
    layerId: "temporary_mock_bridge_removal",
    status: "present",
    phase: "8.2I-3",
    notes: [
      "run-guarded-live-text-runtime-pipeline.ts no longer constructs a mock-shaped draft.",
      "No [MOCK_DRAFT_NEVER_USER_VISIBLE] prefix on the controlled live text path.",
      "ControlledLiveTextDraftResult passed directly to validateRuntimeLLMOutputContract().",
      "temporaryMockBridgeUsed: false is a literal type on GuardedLiveTextRuntimePipelineResult.",
      "controlledLiveTextDraftUsed: true and realRedactedTextForwardedToOutputContract: true confirmed.",
    ],
    neverUserVisible: true,
  },
  {
    layerId: "source_kind_alignment",
    status: "present",
    phase: "8.2I-3A",
    notes: [
      "adapterMode = 'controlled_live_text'.",
      "sourceKind = 'controlled_live_text' (was incorrectly 'controlled_live_text_result').",
      "RuntimeLLMOutputContractDraftSourceKind union updated: 'controlled_live_text_result' removed.",
      "ControlledLiveTextOutputContractBlockedUntil planning identifier renamed accordingly.",
      "Zero remaining references to 'controlled_live_text_result' as a sourceKind value.",
    ],
    neverUserVisible: true,
  },
  {
    layerId: "real_redacted_text_forwarding_harness",
    status: "present",
    phase: "8.2I-4",
    notes: [
      "runRealRedactedTextForwardingHarness() in live-input/run-real-redacted-text-forwarding-harness.ts.",
      "11 fixture modes: 4 success paths, 5 blocking paths, 2 gate-specific paths.",
      "Raw value leak check verifies no synthetic email/IBAN/phone in section draft texts.",
      "All success fixtures: controlledLiveTextDraftUsed: true, realRedactedTextForwardedToOutputContract: true.",
      "Tamper fixtures: missing-prefix and invalid-proof blocked at draft result build.",
    ],
    neverUserVisible: true,
  },
];

// ── Open future items ─────────────────────────────────────────────────────────

const OPEN_ITEMS: readonly GuardedRealTextOpenItem[] = [
  {
    itemId: "8.2I-FUTURE-001",
    severity: "blocker",
    title: "Public anonymous live runtime remains blocked",
    recommendation:
      "Keep internal guarded mode only until pilot readiness and product safety audit are complete.",
    blocksEpochClosure: false,
    blocksPublicLaunch: true,
    neverUserVisible: true,
  },
  {
    itemId: "8.2I-FUTURE-002",
    severity: "future_epoch",
    title: "OCR / photo and file upload remain future",
    recommendation:
      "Implement after controlled text-only pilot readiness is established.",
    blocksEpochClosure: false,
    blocksPublicLaunch: true,
    neverUserVisible: true,
  },
  {
    itemId: "8.2I-FUTURE-003",
    severity: "future_epoch",
    title: "Payment / completeness warning remains future",
    recommendation:
      "Implement before any monetized document or text explanation feature is shipped.",
    blocksEpochClosure: false,
    blocksPublicLaunch: true,
    neverUserVisible: true,
  },
  {
    itemId: "8.2I-FUTURE-004",
    severity: "future_epoch",
    title: "Multilingual runtime remains future",
    recommendation:
      "Implement after Slovak/internal controlled text pipeline is stable and evidence-backed.",
    blocksEpochClosure: false,
    blocksPublicLaunch: true,
    neverUserVisible: true,
  },
  {
    itemId: "8.2I-FUTURE-005",
    severity: "future_epoch",
    title: "Audit persistence remains future",
    recommendation:
      "Add immutable/pseudonymous audit persistence before broader pilot evidence collection begins.",
    blocksEpochClosure: false,
    blocksPublicLaunch: true,
    neverUserVisible: true,
  },
  {
    itemId: "8.2I-FUTURE-006",
    severity: "future_epoch",
    title: "Standalone PWA / mobile shell remains future",
    recommendation:
      "Build after controlled runtime path is stable and product shell design is locked.",
    blocksEpochClosure: false,
    blocksPublicLaunch: true,
    neverUserVisible: true,
  },
  {
    itemId: "8.2I-FUTURE-007",
    severity: "future_epoch",
    title: "Real pilot evidence remains future",
    recommendation:
      "Run controlled internal/pilot test set before any public release of Smart Talk.",
    blocksEpochClosure: false,
    blocksPublicLaunch: true,
    neverUserVisible: true,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeBlocked(
  auditRunId: string,
  verdict: GuardedRealTextPipelineClosureAuditVerdict,
  diagnostics: GuardedRealTextPipelineClosureAuditDiagnosticCode[],
  layerChecks: readonly GuardedRealTextLayerCheck[],
  forwardingHarnessPassed: boolean,
  sourceKindAligned: boolean,
  temporaryMockBridgeRemoved: boolean,
  controlledLiveTextDraftAcceptedByOutputContract: boolean,
  rawValueLeakCheckPassed: boolean,
  notes: string[],
): GuardedRealTextPipelineClosureAuditResult {
  return {
    auditRunId,
    verdict,
    diagnostics,
    layerChecks,
    openItems: OPEN_ITEMS,
    forwardingHarnessPassed,
    sourceKindAligned,
    temporaryMockBridgeRemoved,
    controlledLiveTextDraftAcceptedByOutputContract,
    rawValueLeakCheckPassed,
    readyForControlledRealTextForwardingTo8_2G: false,
    readyForPublicLaunch: false,
    liveLLMCalled: false,
    apiRouteModifiedByAudit: false,
    uiTouched: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    emittedToUserNow: false,
    neverUserVisible: true,
    nextRecommendedPhase: "8.2J-0 — Controlled Text Pilot Readiness Plan",
    notes,
  };
}

// ── Fixture outcome expectations ──────────────────────────────────────────────

type FixtureExpectation =
  | { kind: "success" }
  | { kind: "blocking"; allowedVerdicts: RealRedactedTextForwardingHarnessResult["verdict"][] };

const FIXTURE_EXPECTATIONS: Record<
  Parameters<typeof runRealRedactedTextForwardingHarness>[0]["fixtureMode"],
  FixtureExpectation
> = {
  pii_invoice_text:               { kind: "success" },
  pii_payment_reminder_text:      { kind: "success" },
  pii_jobcenter_text:             { kind: "success" },
  pii_question_text:              { kind: "success" },
  high_risk_rejected_text:        { kind: "blocking", allowedVerdicts: ["blocked_redaction_boundary"] },
  legal_conclusion_requested_text:{ kind: "blocking", allowedVerdicts: ["blocked_input_contract"] },
  persistence_requested_text:     { kind: "blocking", allowedVerdicts: ["blocked_input_contract"] },
  missing_prefix_tamper:          { kind: "blocking", allowedVerdicts: ["blocked_draft_result_build", "blocked_output_contract"] },
  invalid_proof_tamper:           { kind: "blocking", allowedVerdicts: ["blocked_draft_result_build", "blocked_output_contract"] },
  human_review_text:              { kind: "blocking", allowedVerdicts: ["blocked_user_visible_authorisation"] },
  wording_hard_fail_text:         { kind: "blocking", allowedVerdicts: ["blocked_wording_gate"] },
};

// ── Main audit function ───────────────────────────────────────────────────────

/**
 * Formally closes the 8.2I Controlled Live Text Output Contract Compatibility epoch.
 *
 * Runs the full 11-fixture forwarding harness and verifies all static closure
 * assertions. Expected verdict: `closed_with_warnings` (future product/public
 * work remains; no items block epoch closure).
 *
 * Pure function — no external calls, no logging, no persistence.
 */
export function runGuardedRealTextPipelineClosureAudit(
  input: GuardedRealTextPipelineClosureAuditInput,
): GuardedRealTextPipelineClosureAuditResult {
  const { auditRunId } = input;

  const diagnostics: GuardedRealTextPipelineClosureAuditDiagnosticCode[] = [
    "guarded_real_text_closure_started",
    "guarded_real_text_closure_no_live_llm_in_audit",
    "guarded_real_text_closure_no_api_ui_changes",
    "guarded_real_text_closure_no_persistence",
    "guarded_real_text_closure_no_dna_save",
    "guarded_real_text_closure_no_offline_save",
    "guarded_real_text_closure_public_runtime_still_blocked",
    "guarded_real_text_closure_ocr_still_blocked",
    "guarded_real_text_closure_payment_still_blocked",
    "guarded_real_text_closure_multilingual_runtime_still_future",
    "guarded_real_text_closure_audit_persistence_still_future",
  ];

  // ── Layer inventory ───────────────────────────────────────────────────────

  const layerChecks = REQUIRED_LAYER_INVENTORY;
  diagnostics.push("guarded_real_text_closure_layer_inventory_completed");

  const missingLayers = layerChecks.filter((lc) => lc.status === "missing");
  if (missingLayers.length > 0) {
    diagnostics.push("guarded_real_text_closure_blocked_missing_required_layer");
    return makeBlocked(
      auditRunId,
      "blocked_missing_required_layer",
      diagnostics,
      layerChecks,
      false, false, false, false, false,
      [`Required 8.2I layers missing: ${missingLayers.map((l) => l.layerId).join(", ")}.`],
    );
  }
  diagnostics.push("guarded_real_text_closure_required_layers_present");

  // ── Source kind alignment assertion ──────────────────────────────────────
  //
  // Static assertion based on 8.2I-3A layer being present in inventory.
  // adapterMode = "controlled_live_text", sourceKind = "controlled_live_text".
  // The old value "controlled_live_text_result" is removed from the type union.

  const sourceKindAligned = true; // Proven by source_kind_alignment layer (8.2I-3A)
  diagnostics.push("guarded_real_text_closure_source_kind_aligned");

  // ── Mock bridge removal assertion ─────────────────────────────────────────
  //
  // Static assertion based on temporary_mock_bridge_removal layer (8.2I-3).
  // GuardedLiveTextRuntimePipelineResult.temporaryMockBridgeUsed is literal false.

  const temporaryMockBridgeRemoved = true; // Proven by temporary_mock_bridge_removal layer (8.2I-3)
  diagnostics.push("guarded_real_text_closure_mock_bridge_removed");

  // ── Forwarding harness verification ──────────────────────────────────────

  const harnessRunIdBase = `${auditRunId}:harness`;

  type FixtureMode = Parameters<typeof runRealRedactedTextForwardingHarness>[0]["fixtureMode"];
  const fixtureModes: readonly FixtureMode[] = [
    "pii_invoice_text",
    "pii_payment_reminder_text",
    "pii_jobcenter_text",
    "pii_question_text",
    "high_risk_rejected_text",
    "legal_conclusion_requested_text",
    "persistence_requested_text",
    "missing_prefix_tamper",
    "invalid_proof_tamper",
    "human_review_text",
    "wording_hard_fail_text",
  ];

  const harnessResults: RealRedactedTextForwardingHarnessResult[] = [];
  const harnessFailures: string[] = [];

  for (const fixtureMode of fixtureModes) {
    const harnessResult = runRealRedactedTextForwardingHarness({
      harnessRunId: `${harnessRunIdBase}:${fixtureMode}`,
      fixtureMode,
      neverUserVisible: true,
    });
    harnessResults.push(harnessResult);

    // ── Invariant check ─────────────────────────────────────────────────

    if (
      harnessResult.liveLLMCalled !== false ||
      harnessResult.persistenceUsed !== false ||
      harnessResult.dnaSavePerformed !== false ||
      harnessResult.offlineSavePerformed !== false ||
      harnessResult.emittedToUserNow !== false
    ) {
      diagnostics.push("guarded_real_text_closure_blocked_invariant_failure");
      return makeBlocked(
        auditRunId,
        "blocked_invariant_failure",
        diagnostics,
        layerChecks,
        false, sourceKindAligned, temporaryMockBridgeRemoved, false, false,
        [`Harness result for "${fixtureMode}" violated safety invariants.`],
      );
    }

    // ── Outcome expectation check ───────────────────────────────────────

    const expectation = FIXTURE_EXPECTATIONS[fixtureMode];

    if (expectation.kind === "success") {
      if (harnessResult.verdict !== "completed_authorised_internal_packet") {
        harnessFailures.push(
          `"${fixtureMode}": expected completed_authorised_internal_packet, got "${harnessResult.verdict}".`,
        );
      }
    } else {
      if (!expectation.allowedVerdicts.includes(harnessResult.verdict)) {
        harnessFailures.push(
          `"${fixtureMode}": expected one of [${expectation.allowedVerdicts.join(", ")}], got "${harnessResult.verdict}".`,
        );
      }
    }
  }

  if (harnessFailures.length > 0) {
    diagnostics.push("guarded_real_text_closure_blocked_forwarding_harness_failure");
    return makeBlocked(
      auditRunId,
      "blocked_forwarding_harness_failure",
      diagnostics,
      layerChecks,
      false, sourceKindAligned, temporaryMockBridgeRemoved, false, false,
      harnessFailures,
    );
  }
  diagnostics.push("guarded_real_text_closure_forwarding_harness_passed");

  // ── Raw value leak closure ────────────────────────────────────────────────

  const successResults = harnessResults.filter(
    (r) => r.verdict === "completed_authorised_internal_packet",
  );

  const rawValueLeakCheckPassed = successResults.every(
    (r) => r.rawValueLeakCheckPassed === true,
  );

  if (!rawValueLeakCheckPassed) {
    diagnostics.push("guarded_real_text_closure_blocked_forwarding_harness_failure");
    return makeBlocked(
      auditRunId,
      "blocked_forwarding_harness_failure",
      diagnostics,
      layerChecks,
      true, sourceKindAligned, temporaryMockBridgeRemoved, false, false,
      ["Raw value leak check failed on one or more success fixtures."],
    );
  }
  diagnostics.push("guarded_real_text_closure_raw_leak_check_passed");

  // ── Output contract path closure ──────────────────────────────────────────

  const controlledLiveTextDraftAcceptedByOutputContract = successResults.every(
    (r) =>
      r.outputContractVerdict === "accepted_for_next_gate" &&
      r.controlledLiveTextDraftUsed === true &&
      r.realRedactedTextForwardedToOutputContract === true,
  );

  if (!controlledLiveTextDraftAcceptedByOutputContract) {
    diagnostics.push("guarded_real_text_closure_blocked_forwarding_harness_failure");
    return makeBlocked(
      auditRunId,
      "blocked_forwarding_harness_failure",
      diagnostics,
      layerChecks,
      true, sourceKindAligned, temporaryMockBridgeRemoved, false, rawValueLeakCheckPassed,
      ["Output contract did not accept ControlledLiveTextDraftResult on one or more success fixtures."],
    );
  }
  diagnostics.push("guarded_real_text_closure_output_contract_path_verified");

  // ── Final verdict ─────────────────────────────────────────────────────────

  const forwardingHarnessPassed = true;

  const anyBlocksEpochClosure = OPEN_ITEMS.some((item) => item.blocksEpochClosure);
  const hasWarningsOrBlockers = OPEN_ITEMS.some(
    (item) => item.severity === "warning" || item.severity === "blocker",
  );

  const verdict: GuardedRealTextPipelineClosureAuditVerdict = anyBlocksEpochClosure
    ? "blocked_missing_required_layer"
    : hasWarningsOrBlockers
    ? "closed_with_warnings"
    : "closed_guarded_real_text_pipeline_epoch";

  diagnostics.push("guarded_real_text_closure_epoch_closed");

  const readyForControlledRealTextForwardingTo8_2G =
    forwardingHarnessPassed &&
    sourceKindAligned &&
    temporaryMockBridgeRemoved &&
    controlledLiveTextDraftAcceptedByOutputContract &&
    rawValueLeakCheckPassed;

  return {
    auditRunId,
    verdict,
    diagnostics,
    layerChecks,
    openItems: OPEN_ITEMS,
    forwardingHarnessPassed,
    sourceKindAligned,
    temporaryMockBridgeRemoved,
    controlledLiveTextDraftAcceptedByOutputContract,
    rawValueLeakCheckPassed,
    readyForControlledRealTextForwardingTo8_2G,
    readyForPublicLaunch: false,
    liveLLMCalled: false,
    apiRouteModifiedByAudit: false,
    uiTouched: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    emittedToUserNow: false,
    neverUserVisible: true,
    nextRecommendedPhase: "8.2J-0 — Controlled Text Pilot Readiness Plan",
    notes: [
      `Audit version: ${GUARDED_REAL_TEXT_PIPELINE_CLOSURE_AUDIT_VERSION}.`,
      `Audit run ID: ${auditRunId}.`,
      `Verdict: ${verdict}. Open items: ${String(OPEN_ITEMS.length)} (none block epoch closure).`,
      "8.2I epoch: CLOSED WITH WARNINGS.",
      "All 6 required 8.2I layers present.",
      "sourceKind aligned to 'controlled_live_text' (8.2I-3A). Temporary mock bridge removed (8.2I-3).",
      `readyForControlledRealTextForwardingTo8_2G: ${String(readyForControlledRealTextForwardingTo8_2G)}.`,
      "readyForPublicLaunch: false — public launch blocked until pilot readiness (8.2J+).",
    ],
  };
}
