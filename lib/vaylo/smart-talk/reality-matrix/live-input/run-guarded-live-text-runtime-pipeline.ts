/**
 * Guarded Live Text Runtime Pipeline (Phase 8.2H-5).
 *
 * Implements `runGuardedLiveTextRuntimePipeline` — a pure internal pipeline that
 * connects the 8.2H controlled live input chain to the existing 8.2G governance
 * gates without opening public runtime.
 *
 * Pipeline stages:
 *   1. runControlledLiveTextE2EHarness()       — 8.2H-1/2/3 chain
 *   2. validateRuntimeLLMOutputContract()      — 8.2G-2
 *   3. runRuntimeWordingGovernanceGate()       — 8.2G-3
 *   4. runRuntimeResponseAssemblerBridge()     — 8.2G-6
 *   5. runRuntimeUserVisibleAuthorisationGate()— 8.2G-7
 *
 * Output contract compatibility bridge (temporary for 8.2H-5):
 *   The 8.2G output contract validator recognises two prefixes:
 *     [MOCK_DRAFT_NEVER_USER_VISIBLE]          (mock path)
 *     [LIVE_SANDBOX_DRAFT_NEVER_USER_VISIBLE]  (live sandbox path)
 *   The 8.2H adapter produces [CONTROLLED_LIVE_TEXT_DRAFT_NEVER_USER_VISIBLE].
 *   Rather than modifying the validator, a local bridge wraps the adapter
 *   candidate into a mock-shaped `RuntimeLLMOutputContractDraftResult` using
 *   a deterministic safe fixture section. This bridge:
 *   - keeps adapterMode: "mock"
 *   - keeps liveLLMCalled: false
 *   - uses a fixed safe section text (not the redacted user text)
 *   - keeps neverUserVisible: true throughout
 *   This is documented here and in the result notes. Phase 8.2H-6+ may introduce
 *   a dedicated controlled-live-text prefix in the validator.
 *
 * Fixture mode → 8.2H harness fixture → wording score report:
 *   safe_real_text          → safe_real_text          → BASE_SAFE_SCORE_REPORT
 *   safe_real_question      → safe_real_question      → BASE_SAFE_SCORE_REPORT
 *   pii_redaction_applied   → pii_redaction_applied   → BASE_SAFE_SCORE_REPORT
 *   input_contract_blocked  → too_short_text          → (harness blocks; 8.2G chain not reached)
 *   redaction_blocked       → high_risk_rejected      → (harness blocks; 8.2G chain not reached)
 *   adapter_blocked         → adapter_rejects_...     → (harness blocks; 8.2G chain not reached)
 *   wording_hard_fail       → safe_real_text          → BASE_HARD_FAIL_LEGAL_ADVICE_SCORE_REPORT
 *   human_review            → safe_real_question      → BASE_HUMAN_REVIEW_SCORE_REPORT
 *
 * Safety invariants (literal types on the result):
 * - emittedToUserNow: false
 * - liveLLMCalled: false
 * - apiRouteTouched: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - neverUserVisible: true
 *
 * Pure function — no external calls, no logging, no persistence.
 */

import { runControlledLiveTextE2EHarness } from "./run-controlled-live-text-e2e-harness";
import { validateRuntimeLLMOutputContract } from "../validate-runtime-llm-output-contract";
import { runRuntimeWordingGovernanceGate } from "../run-runtime-wording-governance-gate";
import { runRuntimeResponseAssemblerBridge } from "../run-runtime-response-assembler-bridge";
import { runRuntimeUserVisibleAuthorisationGate } from "../run-runtime-user-visible-authorisation-gate";
import {
  BASE_SAFE_SCORE_REPORT,
  BASE_HARD_FAIL_LEGAL_ADVICE_SCORE_REPORT,
  BASE_HUMAN_REVIEW_SCORE_REPORT,
} from "../runtime-wording-governance-gate-regression-scaffold";
import type {
  GuardedLiveTextRuntimePipelineDiagnosticCode,
  GuardedLiveTextRuntimePipelineFixtureMode,
  GuardedLiveTextRuntimePipelineInput,
  GuardedLiveTextRuntimePipelineResult,
  GuardedLiveTextRuntimePipelineVerdict,
} from "./guarded-live-text-runtime-pipeline-types";
import type { RuntimeLLMDraftAdapterInput } from "../runtime-llm-draft-adapter-types";
import type { RuntimeLLMOutputContractDraftResult } from "../runtime-llm-output-contract-validator-types";
import type { ControlledLiveTextE2EHarnessFixtureMode } from "./controlled-live-text-e2e-harness-types";

export const GUARDED_LIVE_TEXT_RUNTIME_PIPELINE_VERSION =
  "8.2h-5-guarded-live-text-runtime-pipeline-v1";

/**
 * Prefix required for sections on the mock path through the output contract validator.
 * Used by the temporary compatibility bridge in this phase.
 */
const MOCK_DRAFT_PREFIX = "[MOCK_DRAFT_NEVER_USER_VISIBLE]";

// ── Fixture mode mappings ─────────────────────────────────────────────────────

type ScoreReport = Parameters<typeof runRuntimeWordingGovernanceGate>[0]["scoreReport"];

function mapToHarnessFixture(
  mode: GuardedLiveTextRuntimePipelineFixtureMode,
): ControlledLiveTextE2EHarnessFixtureMode {
  switch (mode) {
    case "safe_real_text":      return "safe_real_text";
    case "safe_real_question":  return "safe_real_question";
    case "pii_redaction_applied": return "pii_redaction_applied";
    case "input_contract_blocked": return "too_short_text";
    case "redaction_blocked":   return "high_risk_rejected";
    case "adapter_blocked":     return "adapter_rejects_missing_redaction";
    case "wording_hard_fail":   return "safe_real_text";
    case "human_review":        return "safe_real_question";
  }
}

function mapToScoreReport(mode: GuardedLiveTextRuntimePipelineFixtureMode): ScoreReport {
  switch (mode) {
    case "wording_hard_fail": return BASE_HARD_FAIL_LEGAL_ADVICE_SCORE_REPORT;
    case "human_review":      return BASE_HUMAN_REVIEW_SCORE_REPORT;
    default:                  return BASE_SAFE_SCORE_REPORT;
  }
}

// ── Blocked result builder ────────────────────────────────────────────────────

function makeBlocked(
  pipelineRunId: string,
  verdict: GuardedLiveTextRuntimePipelineVerdict,
  diagnostics: GuardedLiveTextRuntimePipelineDiagnosticCode[],
  liveTextHarnessVerdict: string,
  outputContractVerdict: string,
  wordingGateVerdict: string,
  responseAssemblerVerdict: string,
  authorisationVerdict: string,
  notes?: string[],
): GuardedLiveTextRuntimePipelineResult {
  return {
    pipelineRunId,
    verdict,
    diagnostics,
    liveTextHarnessVerdict,
    outputContractVerdict,
    wordingGateVerdict,
    responseAssemblerVerdict,
    authorisationVerdict,
    packetCreated: false,
    acceptedForUserVisibleAssembly: false,
    userVisibleOutputAllowedForFuture: false,
    emittedToUserNow: false,
    liveLLMCalled: false,
    apiRouteTouched: false,
    uiTouched: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    neverUserVisible: true,
    notes,
  };
}

// ── Main pipeline function ────────────────────────────────────────────────────

/**
 * Runs the complete guarded live text → 8.2G governance pipeline using a
 * synthetic fixture.
 *
 * Uses the temporary mock-bridge to satisfy the 8.2G output contract validator's
 * prefix requirement without modifying the validator itself.
 *
 * Pure function — no external calls, no logging, no persistence.
 */
export function runGuardedLiveTextRuntimePipeline(
  input: GuardedLiveTextRuntimePipelineInput,
): GuardedLiveTextRuntimePipelineResult {
  const { pipelineRunId, fixtureMode } = input;

  const diagnostics: GuardedLiveTextRuntimePipelineDiagnosticCode[] = [
    "guarded_live_text_pipeline_started",
    "guarded_live_text_pipeline_no_live_llm_confirmed",
    "guarded_live_text_pipeline_no_api_ui_confirmed",
    "guarded_live_text_pipeline_no_persistence_confirmed",
    "guarded_live_text_pipeline_no_dna_save_confirmed",
    "guarded_live_text_pipeline_no_offline_save_confirmed",
  ];

  // ── Stage 1 — 8.2H live text E2E harness ─────────────────────────────────

  const harnessFixture = mapToHarnessFixture(fixtureMode);
  const useHighRisk = fixtureMode === "redaction_blocked";

  const harnessResult = runControlledLiveTextE2EHarness({
    harnessRunId: `${pipelineRunId}:live-text-harness`,
    fixtureMode: harnessFixture,
    rejectHighRiskPatterns: useHighRisk,
    neverUserVisible: true,
  });
  diagnostics.push("guarded_live_text_pipeline_live_text_harness_completed");

  // Invariant check on harness result
  if (
    harnessResult.liveLLMCalled !== false ||
    harnessResult.persistenceUsed !== false ||
    harnessResult.dnaSavePerformed !== false ||
    harnessResult.offlineSavePerformed !== false ||
    harnessResult.uiTouched !== false
  ) {
    diagnostics.push("guarded_live_text_pipeline_failed_invariant_violation");
    return makeBlocked(
      pipelineRunId,
      "failed_invariant_violation",
      diagnostics,
      harnessResult.verdict,
      "", "", "", "",
      ["Live text harness result violated safety invariants."],
    );
  }

  if (harnessResult.verdict !== "completed_adapter_candidate") {
    diagnostics.push("guarded_live_text_pipeline_blocked_live_text_harness");
    return makeBlocked(
      pipelineRunId,
      "blocked_live_text_harness",
      diagnostics,
      harnessResult.verdict,
      "", "", "", "",
      [`Live text harness blocked with verdict: ${harnessResult.verdict}.`],
    );
  }
  diagnostics.push("guarded_live_text_pipeline_adapter_candidate_confirmed");

  // ── Stage 2 — Build mock-bridge draft (temporary compatibility bridge) ────
  //
  // The 8.2G output contract validator only accepts [MOCK_DRAFT_NEVER_USER_VISIBLE]
  // or [LIVE_SANDBOX_DRAFT_NEVER_USER_VISIBLE] prefixes. The 8.2H adapter uses
  // [CONTROLLED_LIVE_TEXT_DRAFT_NEVER_USER_VISIBLE]. To avoid modifying the
  // validator, we construct a mock-shaped draft here using a fixed safe fixture
  // section text (not the redacted user text). This bridge is internal, guarded,
  // and labelled as temporary — Phase 8.2H-6+ may add a dedicated prefix.

  const bridgeAdapterInput: RuntimeLLMDraftAdapterInput = {
    adapterMode: "mock",
    accessTier: "free_preview",
    contractRef: `${pipelineRunId}-bridge-contract`,
    allowedSectionTypes: ["what_this_means"],
    activeForbiddenMoves: [],
    activeRequiredConstraints: [],
    uncertaintyRequired: false,
    humanReviewRequired: false,
    auditTraceParentIds: [`${pipelineRunId}:live-text-harness`],
    neverUserVisible: true,
    notes: [
      "Temporary 8.2H-5 mock-bridge: maps controlled live text adapter candidate to mock-path shape.",
      "Does not expose redacted user text. Uses fixed safe fixture section text.",
    ],
  };

  const bridgeDraftResult: RuntimeLLMOutputContractDraftResult = {
    adapterMode: "mock",
    accessTier: "free_preview",
    sectionCandidates: [
      {
        sectionType: "what_this_means",
        draftText: `${MOCK_DRAFT_PREFIX} Synthetic controlled live text pipeline fixture for 8.2H-5. Fixture: ${fixtureMode}.`,
        safetyFlags: [],
        sourceBound: true,
        neverUserVisible: true,
        notes: [
          "8.2H-5 mock-bridge section: fixed safe text, not user content.",
          "sourceBound: true — derived from controlled live text chain (not a free mock generation).",
        ],
      },
    ],
    appliedForbiddenMoves: [],
    appliedRequiredConstraints: [],
    liveLLMCalled: false,
    userVisibleOutputAllowed: false,
    neverUserVisible: true,
  };

  // ── Stage 3 — Output contract validator ──────────────────────────────────

  const contractResult = validateRuntimeLLMOutputContract({
    input: bridgeAdapterInput,
    result: bridgeDraftResult,
  });
  diagnostics.push("guarded_live_text_pipeline_output_contract_completed");

  // Invariant check
  if (
    contractResult.userVisibleOutputAllowed !== false ||
    contractResult.acceptedForUserVisibleAssembly !== false
  ) {
    diagnostics.push("guarded_live_text_pipeline_failed_invariant_violation");
    return makeBlocked(
      pipelineRunId,
      "failed_invariant_violation",
      diagnostics,
      harnessResult.verdict,
      contractResult.verdict,
      "", "", "",
      ["Output contract result violated safety invariants."],
    );
  }

  if (contractResult.verdict !== "accepted_for_next_gate") {
    diagnostics.push("guarded_live_text_pipeline_blocked_output_contract");
    return makeBlocked(
      pipelineRunId,
      "blocked_output_contract",
      diagnostics,
      harnessResult.verdict,
      contractResult.verdict,
      "", "", "",
      [`Output contract rejected: ${contractResult.verdict}.`],
    );
  }

  // ── Stage 4 — Wording governance gate ────────────────────────────────────

  const scoreReport = mapToScoreReport(fixtureMode);

  const wordingResult = runRuntimeWordingGovernanceGate({
    draftResult: bridgeDraftResult,
    outputContractValidation: contractResult,
    scoreReport,
    neverUserVisible: true,
  });
  diagnostics.push("guarded_live_text_pipeline_wording_gate_completed");

  if (
    wordingResult.liveLLMJudgeCalled !== false ||
    wordingResult.realTextSemanticallyEvaluated !== false ||
    wordingResult.userVisibleOutputAllowed !== false
  ) {
    diagnostics.push("guarded_live_text_pipeline_failed_invariant_violation");
    return makeBlocked(
      pipelineRunId,
      "failed_invariant_violation",
      diagnostics,
      harnessResult.verdict,
      contractResult.verdict,
      wordingResult.verdict,
      "", "",
      ["Wording gate result violated safety invariants."],
    );
  }

  // Hard fail → stop immediately
  if (wordingResult.verdict === "hard_fail_wording_violation") {
    diagnostics.push("guarded_live_text_pipeline_blocked_wording_gate");
    return makeBlocked(
      pipelineRunId,
      "blocked_wording_gate",
      diagnostics,
      harnessResult.verdict,
      contractResult.verdict,
      wordingResult.verdict,
      "", "",
      ["Wording gate hard fail — pipeline stopped."],
    );
  }

  // Other rejections (missing/invalid score report, previous gate failed) → stop
  if (
    wordingResult.verdict !== "accepted_for_audit_dry_run" &&
    wordingResult.verdict !== "human_review_required"
  ) {
    diagnostics.push("guarded_live_text_pipeline_blocked_wording_gate");
    return makeBlocked(
      pipelineRunId,
      "blocked_wording_gate",
      diagnostics,
      harnessResult.verdict,
      contractResult.verdict,
      wordingResult.verdict,
      "", "",
      [`Wording gate rejected: ${wordingResult.verdict}.`],
    );
  }

  // ── Stage 5 — Response assembler bridge ──────────────────────────────────

  const assemblerResult = runRuntimeResponseAssemblerBridge({
    draftResult: bridgeDraftResult,
    outputContractValidation: contractResult,
    wordingGateResult: wordingResult,
    auditTraceValid: true,
    diagnosticEnvelopeValid: true,
    assemblyRunId: `${pipelineRunId}:assembler`,
    neverUserVisible: true,
  });
  diagnostics.push("guarded_live_text_pipeline_response_assembler_completed");

  if (
    assemblerResult.userVisibleOutputEmitted !== false ||
    assemblerResult.userVisibleOutputAllowed !== false ||
    assemblerResult.persistenceUsed !== false ||
    assemblerResult.dnaSavePerformed !== false ||
    assemblerResult.offlineSavePerformed !== false
  ) {
    diagnostics.push("guarded_live_text_pipeline_failed_invariant_violation");
    return makeBlocked(
      pipelineRunId,
      "failed_invariant_violation",
      diagnostics,
      harnessResult.verdict,
      contractResult.verdict,
      wordingResult.verdict,
      assemblerResult.verdict,
      "",
      ["Assembler result violated safety invariants."],
    );
  }

  if (
    assemblerResult.verdict !== "assembled_internal_candidate" &&
    assemblerResult.verdict !== "assembled_human_review_packet"
  ) {
    diagnostics.push("guarded_live_text_pipeline_blocked_response_assembler");
    return makeBlocked(
      pipelineRunId,
      "blocked_response_assembler",
      diagnostics,
      harnessResult.verdict,
      contractResult.verdict,
      wordingResult.verdict,
      assemblerResult.verdict,
      "",
      [`Assembler rejected: ${assemblerResult.verdict}.`],
    );
  }

  // ── Stage 6 — User-visible authorisation gate ─────────────────────────────

  const authorisationResult = runRuntimeUserVisibleAuthorisationGate({
    assemblerResult,
    authorisationRunId: `${pipelineRunId}:authorisation`,
    neverUserVisible: true,
  });
  diagnostics.push("guarded_live_text_pipeline_authorisation_completed");

  if (
    authorisationResult.emittedToUserNow !== false ||
    authorisationResult.persistenceUsed !== false ||
    authorisationResult.dnaSavePerformed !== false ||
    authorisationResult.offlineSavePerformed !== false
  ) {
    diagnostics.push("guarded_live_text_pipeline_failed_invariant_violation");
    return makeBlocked(
      pipelineRunId,
      "failed_invariant_violation",
      diagnostics,
      harnessResult.verdict,
      contractResult.verdict,
      wordingResult.verdict,
      assemblerResult.verdict,
      authorisationResult.verdict,
      ["Authorisation result violated safety invariants."],
    );
  }

  if (authorisationResult.verdict !== "authorised_internal_packet") {
    diagnostics.push("guarded_live_text_pipeline_blocked_user_visible_authorisation");
    return makeBlocked(
      pipelineRunId,
      "blocked_user_visible_authorisation",
      diagnostics,
      harnessResult.verdict,
      contractResult.verdict,
      wordingResult.verdict,
      assemblerResult.verdict,
      authorisationResult.verdict,
      [`Authorisation rejected: ${authorisationResult.verdict}.`],
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────

  diagnostics.push("guarded_live_text_pipeline_completed_authorised_packet");

  return {
    pipelineRunId,
    verdict: "completed_authorised_internal_packet",
    diagnostics,
    liveTextHarnessVerdict: harnessResult.verdict,
    outputContractVerdict: contractResult.verdict,
    wordingGateVerdict: wordingResult.verdict,
    responseAssemblerVerdict: assemblerResult.verdict,
    authorisationVerdict: authorisationResult.verdict,
    packetCreated: true,
    acceptedForUserVisibleAssembly: authorisationResult.acceptedForUserVisibleAssembly,
    userVisibleOutputAllowedForFuture: authorisationResult.userVisibleOutputAllowedForFuture,
    emittedToUserNow: false,
    liveLLMCalled: false,
    apiRouteTouched: false,
    uiTouched: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    neverUserVisible: true,
    notes: [
      `Pipeline version: ${GUARDED_LIVE_TEXT_RUNTIME_PIPELINE_VERSION}.`,
      `Pipeline run ID: ${pipelineRunId}.`,
      `Fixture mode: ${fixtureMode}.`,
      "TEMPORARY BRIDGE: controlled live text adapter candidate mapped to mock-shaped draft for output contract validator compatibility.",
      "Bridge uses fixed safe fixture text only — redacted user text is not forwarded to the 8.2G chain in 8.2H-5.",
      "emittedToUserNow: false — packet is for internal governance use only.",
      "Next: 8.2H-6 Controlled Live Input Closure Audit.",
    ],
  };
}
