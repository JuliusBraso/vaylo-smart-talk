/**
 * Remove Temporary Mock Bridge Regression Scaffold (Phase 8.2I-3).
 *
 * 12 deterministic regression cases verifying:
 *   - The temporary mock-shaped bridge is gone from the pipeline.
 *   - ControlledLiveTextDraftResult flows directly through the 8.2G chain.
 *   - Blocked fixture modes still block at the correct stage.
 *   - Wording hard-fail and human-review modes still block at the right gates.
 *   - The closure audit now returns readyForControlledRealTextForwardingTo8_2G: true.
 *
 * No Jest / Vitest. No CI hook. No live LLM call. No API key required.
 * All fixtures are synthetic and deterministic.
 */

import { runGuardedLiveTextRuntimePipeline } from "./run-guarded-live-text-runtime-pipeline";
import { runControlledLiveInputClosureAudit } from "./run-controlled-live-input-closure-audit";

// ── Scaffold types ────────────────────────────────────────────────────────────

export const BRIDGE_REMOVAL_SCAFFOLD_VERSION =
  "8.2i-3-remove-temporary-mock-bridge-regression-v1";

export interface BridgeRemovalCaseResult {
  readonly caseId: string;
  readonly passed: boolean;
  readonly failures: readonly string[];
  readonly notes: readonly string[];
}

export interface BridgeRemovalScaffoldResult {
  readonly scaffoldVersion: string;
  readonly allPassed: boolean;
  readonly caseResults: readonly BridgeRemovalCaseResult[];
  readonly notes: readonly string[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function pass(id: string, notes: string[]): BridgeRemovalCaseResult {
  return { caseId: id, passed: true, failures: [], notes };
}

function fail(id: string, failures: string[]): BridgeRemovalCaseResult {
  return { caseId: id, passed: false, failures, notes: [] };
}

// ── Case 1: safe_real_text — full success with bridge removed ─────────────────

function case1_safeRealTextSuccess(): BridgeRemovalCaseResult {
  const result = runGuardedLiveTextRuntimePipeline({
    pipelineRunId: "scaffold-8.2i-3-case1",
    fixtureMode: "safe_real_text",
    neverUserVisible: true,
  });
  const failures: string[] = [];
  if (result.verdict !== "completed_authorised_internal_packet") {
    failures.push(`verdict should be completed_authorised_internal_packet; got "${result.verdict}".`);
  }
  if (result.temporaryMockBridgeUsed !== false) failures.push("temporaryMockBridgeUsed must be false.");
  if (result.controlledLiveTextDraftUsed !== true) failures.push("controlledLiveTextDraftUsed must be true.");
  if (result.realRedactedTextForwardedToOutputContract !== true) {
    failures.push("realRedactedTextForwardedToOutputContract must be true.");
  }
  if (result.emittedToUserNow !== false) failures.push("emittedToUserNow must be false.");
  if (result.liveLLMCalled !== false) failures.push("liveLLMCalled must be false.");
  return failures.length === 0
    ? pass("case1_safeRealTextSuccess", ["safe_real_text: completed_authorised_internal_packet. Bridge removed."])
    : fail("case1_safeRealTextSuccess", failures);
}

// ── Case 2: safe_real_question — full success ─────────────────────────────────

function case2_safeRealQuestionSuccess(): BridgeRemovalCaseResult {
  const result = runGuardedLiveTextRuntimePipeline({
    pipelineRunId: "scaffold-8.2i-3-case2",
    fixtureMode: "safe_real_question",
    neverUserVisible: true,
  });
  const failures: string[] = [];
  if (result.verdict !== "completed_authorised_internal_packet") {
    failures.push(`verdict should be completed_authorised_internal_packet; got "${result.verdict}".`);
  }
  if (result.temporaryMockBridgeUsed !== false) failures.push("temporaryMockBridgeUsed must be false.");
  if (result.controlledLiveTextDraftUsed !== true) failures.push("controlledLiveTextDraftUsed must be true.");
  if (result.realRedactedTextForwardedToOutputContract !== true) {
    failures.push("realRedactedTextForwardedToOutputContract must be true.");
  }
  return failures.length === 0
    ? pass("case2_safeRealQuestionSuccess", ["safe_real_question: completed. Bridge removed."])
    : fail("case2_safeRealQuestionSuccess", failures);
}

// ── Case 3: pii_redaction_applied — redacted text passes output contract ──────

function case3_piiRedactionApplied(): BridgeRemovalCaseResult {
  const result = runGuardedLiveTextRuntimePipeline({
    pipelineRunId: "scaffold-8.2i-3-case3",
    fixtureMode: "pii_redaction_applied",
    neverUserVisible: true,
  });
  const failures: string[] = [];
  if (result.verdict !== "completed_authorised_internal_packet") {
    failures.push(`verdict should be completed_authorised_internal_packet; got "${result.verdict}".`);
  }
  if (result.temporaryMockBridgeUsed !== false) failures.push("temporaryMockBridgeUsed must be false.");
  if (result.controlledLiveTextDraftUsed !== true) failures.push("controlledLiveTextDraftUsed must be true.");
  if (result.realRedactedTextForwardedToOutputContract !== true) {
    failures.push("realRedactedTextForwardedToOutputContract must be true — PII redacted text reached output contract.");
  }
  return failures.length === 0
    ? pass("case3_piiRedactionApplied", [
        "pii_redaction_applied: redacted text passed output contract with controlled prefix and proof.",
      ])
    : fail("case3_piiRedactionApplied", failures);
}

// ── Case 4: input_contract_blocked — stops before output contract ─────────────

function case4_inputContractBlocked(): BridgeRemovalCaseResult {
  const result = runGuardedLiveTextRuntimePipeline({
    pipelineRunId: "scaffold-8.2i-3-case4",
    fixtureMode: "input_contract_blocked",
    neverUserVisible: true,
  });
  const failures: string[] = [];
  if (result.verdict !== "blocked_live_text_harness") {
    failures.push(`verdict should be blocked_live_text_harness; got "${result.verdict}".`);
  }
  if (result.temporaryMockBridgeUsed !== false) failures.push("temporaryMockBridgeUsed must be false.");
  if (result.controlledLiveTextDraftUsed !== false) {
    failures.push("controlledLiveTextDraftUsed should be false — blocked before adapter.");
  }
  if (result.realRedactedTextForwardedToOutputContract !== false) {
    failures.push("realRedactedTextForwardedToOutputContract should be false — blocked before output contract.");
  }
  return failures.length === 0
    ? pass("case4_inputContractBlocked", ["Blocked at input contract. No mock bridge. Draft not built."])
    : fail("case4_inputContractBlocked", failures);
}

// ── Case 5: redaction_blocked — stops before output contract ──────────────────

function case5_redactionBlocked(): BridgeRemovalCaseResult {
  const result = runGuardedLiveTextRuntimePipeline({
    pipelineRunId: "scaffold-8.2i-3-case5",
    fixtureMode: "redaction_blocked",
    neverUserVisible: true,
  });
  const failures: string[] = [];
  if (result.verdict !== "blocked_live_text_harness") {
    failures.push(`verdict should be blocked_live_text_harness; got "${result.verdict}".`);
  }
  if (result.temporaryMockBridgeUsed !== false) failures.push("temporaryMockBridgeUsed must be false.");
  if (result.realRedactedTextForwardedToOutputContract !== false) {
    failures.push("realRedactedTextForwardedToOutputContract should be false.");
  }
  return failures.length === 0
    ? pass("case5_redactionBlocked", ["Blocked at redaction boundary. No output contract reached."])
    : fail("case5_redactionBlocked", failures);
}

// ── Case 6: adapter_blocked — stops before output contract ────────────────────

function case6_adapterBlocked(): BridgeRemovalCaseResult {
  const result = runGuardedLiveTextRuntimePipeline({
    pipelineRunId: "scaffold-8.2i-3-case6",
    fixtureMode: "adapter_blocked",
    neverUserVisible: true,
  });
  const failures: string[] = [];
  if (result.verdict !== "blocked_live_text_harness") {
    failures.push(`verdict should be blocked_live_text_harness; got "${result.verdict}".`);
  }
  if (result.temporaryMockBridgeUsed !== false) failures.push("temporaryMockBridgeUsed must be false.");
  if (result.realRedactedTextForwardedToOutputContract !== false) {
    failures.push("realRedactedTextForwardedToOutputContract should be false.");
  }
  return failures.length === 0
    ? pass("case6_adapterBlocked", ["Blocked at adapter. No output contract reached."])
    : fail("case6_adapterBlocked", failures);
}

// ── Case 7: wording_hard_fail — blocks at wording gate ───────────────────────

function case7_wordingHardFail(): BridgeRemovalCaseResult {
  const result = runGuardedLiveTextRuntimePipeline({
    pipelineRunId: "scaffold-8.2i-3-case7",
    fixtureMode: "wording_hard_fail",
    neverUserVisible: true,
  });
  const failures: string[] = [];
  if (result.verdict !== "blocked_wording_gate") {
    failures.push(`verdict should be blocked_wording_gate; got "${result.verdict}".`);
  }
  if (result.temporaryMockBridgeUsed !== false) failures.push("temporaryMockBridgeUsed must be false.");
  if (result.controlledLiveTextDraftUsed !== true) {
    failures.push("controlledLiveTextDraftUsed should be true — draft built and reached wording gate.");
  }
  if (result.realRedactedTextForwardedToOutputContract !== true) {
    failures.push("realRedactedTextForwardedToOutputContract should be true — output contract was reached.");
  }
  return failures.length === 0
    ? pass("case7_wordingHardFail", [
        "Controlled draft reached output contract and was accepted; blocked at wording gate.",
      ])
    : fail("case7_wordingHardFail", failures);
}

// ── Case 8: human_review — blocks at authorisation gate ──────────────────────

function case8_humanReview(): BridgeRemovalCaseResult {
  const result = runGuardedLiveTextRuntimePipeline({
    pipelineRunId: "scaffold-8.2i-3-case8",
    fixtureMode: "human_review",
    neverUserVisible: true,
  });
  const failures: string[] = [];
  if (result.verdict !== "blocked_user_visible_authorisation") {
    failures.push(`verdict should be blocked_user_visible_authorisation; got "${result.verdict}".`);
  }
  if (result.temporaryMockBridgeUsed !== false) failures.push("temporaryMockBridgeUsed must be false.");
  if (result.controlledLiveTextDraftUsed !== true) {
    failures.push("controlledLiveTextDraftUsed should be true — draft built and reached authorisation gate.");
  }
  if (result.realRedactedTextForwardedToOutputContract !== true) {
    failures.push("realRedactedTextForwardedToOutputContract should be true.");
  }
  return failures.length === 0
    ? pass("case8_humanReview", [
        "Controlled draft reached authorisation gate; human review packet blocked correctly.",
      ])
    : fail("case8_humanReview", failures);
}

// ── Case 9: closure audit — readyForControlledRealTextForwardingTo8_2G true ──

function case9_closureAudit(): BridgeRemovalCaseResult {
  const auditResult = runControlledLiveInputClosureAudit({
    auditRunId: "scaffold-8.2i-3-case9",
    neverUserVisible: true,
  });
  const failures: string[] = [];
  if (!auditResult.readyForControlledRealTextForwardingTo8_2G) {
    failures.push(
      "readyForControlledRealTextForwardingTo8_2G should be true after bridge removal.",
    );
  }
  if (auditResult.readyForPublicLaunch !== false) {
    failures.push("readyForPublicLaunch must remain false.");
  }
  if (auditResult.runtimePipelinePassed !== true) {
    failures.push("runtimePipelinePassed should be true.");
  }
  if (auditResult.liveLLMCalled !== false) failures.push("liveLLMCalled must be false.");
  if (auditResult.persistenceUsed !== false) failures.push("persistenceUsed must be false.");
  return failures.length === 0
    ? pass("case9_closureAudit", [
        "Closure audit: readyForControlledRealTextForwardingTo8_2G: true. readyForPublicLaunch: false.",
      ])
    : fail("case9_closureAudit", failures);
}

// ── Case 10: no mock prefix in result notes ───────────────────────────────────

function case10_noMockPrefixInNotes(): BridgeRemovalCaseResult {
  const result = runGuardedLiveTextRuntimePipeline({
    pipelineRunId: "scaffold-8.2i-3-case10",
    fixtureMode: "safe_real_text",
    neverUserVisible: true,
  });
  const failures: string[] = [];
  if (result.temporaryMockBridgeUsed !== false) failures.push("temporaryMockBridgeUsed must be false.");
  // Verify no notes contain mock bridge language
  const notesStr = (result.notes ?? []).join(" ");
  if (notesStr.includes("[MOCK_DRAFT_NEVER_USER_VISIBLE]")) {
    failures.push("Result notes must not reference [MOCK_DRAFT_NEVER_USER_VISIBLE] — bridge removed.");
  }
  if (notesStr.includes("TEMPORARY BRIDGE")) {
    failures.push("Result notes must not reference TEMPORARY BRIDGE — bridge removed.");
  }
  if (!notesStr.includes("temporaryMockBridgeUsed: false")) {
    failures.push("Result notes should confirm temporaryMockBridgeUsed: false.");
  }
  return failures.length === 0
    ? pass("case10_noMockPrefixInNotes", ["No mock bridge references in result notes. Bridge removed confirmed."])
    : fail("case10_noMockPrefixInNotes", failures);
}

// ── Case 11: safety invariants on success ────────────────────────────────────

function case11_safetyInvariants(): BridgeRemovalCaseResult {
  const result = runGuardedLiveTextRuntimePipeline({
    pipelineRunId: "scaffold-8.2i-3-case11",
    fixtureMode: "safe_real_text",
    neverUserVisible: true,
  });
  const failures: string[] = [];
  if (result.liveLLMCalled !== false) failures.push("liveLLMCalled must be false.");
  if (result.persistenceUsed !== false) failures.push("persistenceUsed must be false.");
  if (result.dnaSavePerformed !== false) failures.push("dnaSavePerformed must be false.");
  if (result.offlineSavePerformed !== false) failures.push("offlineSavePerformed must be false.");
  if (result.emittedToUserNow !== false) failures.push("emittedToUserNow must be false.");
  if (result.apiRouteTouched !== false) failures.push("apiRouteTouched must be false.");
  if (result.uiTouched !== false) failures.push("uiTouched must be false.");
  if (result.temporaryMockBridgeUsed !== false) failures.push("temporaryMockBridgeUsed must be false.");
  if (result.neverUserVisible !== true) failures.push("neverUserVisible must be true.");
  return failures.length === 0
    ? pass("case11_safetyInvariants", ["All safety invariants confirmed on successful pipeline run."])
    : fail("case11_safetyInvariants", failures);
}

// ── Case 12: output contract accepted controlled_live_text path ───────────────

function case12_outputContractAcceptedControlledPath(): BridgeRemovalCaseResult {
  const result = runGuardedLiveTextRuntimePipeline({
    pipelineRunId: "scaffold-8.2i-3-case12",
    fixtureMode: "safe_real_text",
    neverUserVisible: true,
  });
  const failures: string[] = [];
  // Success implies output contract accepted controlled_live_text path
  if (result.verdict !== "completed_authorised_internal_packet") {
    failures.push(`Pipeline must complete to confirm output contract accepted; got "${result.verdict}".`);
  }
  if (result.outputContractVerdict !== "accepted_for_next_gate") {
    failures.push(
      `outputContractVerdict should be accepted_for_next_gate; got "${result.outputContractVerdict}".`,
    );
  }
  if (result.controlledLiveTextDraftUsed !== true) {
    failures.push("controlledLiveTextDraftUsed must be true — confirms controlled path used.");
  }
  return failures.length === 0
    ? pass("case12_outputContractAcceptedControlledPath", [
        "Output contract accepted controlled_live_text path. No mock bridge needed.",
      ])
    : fail("case12_outputContractAcceptedControlledPath", failures);
}

// ── Runner ────────────────────────────────────────────────────────────────────

/**
 * Runs all 12 regression cases verifying mock bridge removal.
 *
 * Pure function — no external calls, no logging, no persistence.
 */
export function runRemoveTemporaryMockBridgeRegressionScaffold(): BridgeRemovalScaffoldResult {
  const cases: BridgeRemovalCaseResult[] = [
    case1_safeRealTextSuccess(),
    case2_safeRealQuestionSuccess(),
    case3_piiRedactionApplied(),
    case4_inputContractBlocked(),
    case5_redactionBlocked(),
    case6_adapterBlocked(),
    case7_wordingHardFail(),
    case8_humanReview(),
    case9_closureAudit(),
    case10_noMockPrefixInNotes(),
    case11_safetyInvariants(),
    case12_outputContractAcceptedControlledPath(),
  ];

  const allPassed = cases.every((c) => c.passed);
  const failedCases = cases.filter((c) => !c.passed).map((c) => c.caseId);

  return {
    scaffoldVersion: BRIDGE_REMOVAL_SCAFFOLD_VERSION,
    allPassed,
    caseResults: cases,
    notes: [
      `Scaffold version: ${BRIDGE_REMOVAL_SCAFFOLD_VERSION}.`,
      `Cases: ${String(cases.length)} total. Passed: ${String(cases.filter((c) => c.passed).length)}.`,
      allPassed
        ? "All cases passed. Temporary mock bridge confirmed removed."
        : `Failed: ${failedCases.join(", ")}.`,
      "No live LLM call. No persistence. No API route touched.",
      "temporaryMockBridgeUsed: false on all paths.",
      "readyForPublicLaunch: false — public launch still blocked.",
    ],
  };
}
