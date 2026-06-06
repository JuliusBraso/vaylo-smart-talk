/**
 * Guarded Live Text Runtime Pipeline (Phase 8.2H-5, updated 8.2I-3).
 *
 * Implements `runGuardedLiveTextRuntimePipeline` — a pure internal pipeline that
 * connects the 8.2H controlled live input chain to the existing 8.2G governance
 * gates without opening public runtime.
 *
 * Phase 8.2I-3 update:
 *   The temporary mock-shaped bridge introduced in 8.2H-5 has been removed.
 *   The pipeline now:
 *     1. Runs the 8.2H chain directly (input contract → redaction → adapter).
 *     2. Builds a `ControlledLiveTextRedactionProof` from the redaction result.
 *     3. Builds a `ControlledLiveTextDraftResult` via `buildControlledLiveTextDraftResult()`.
 *     4. Passes the `ControlledLiveTextDraftResult` directly to `validateRuntimeLLMOutputContract()`
 *        (now formally accepted since Phase 8.2I-2).
 *   The mock prefix `[MOCK_DRAFT_NEVER_USER_VISIBLE]` is no longer used on this path.
 *   `temporaryMockBridgeUsed: false` is now a literal type on the result.
 *   `realRedactedTextForwardedToOutputContract: true` on all success paths.
 *
 * Pipeline stages:
 *   1. runRealTextInputContractValidation()  — 8.2H-1
 *   2. runRealTextRedactionBoundary()        — 8.2H-2
 *   3. runControlledLiveTextAdapter()        — 8.2H-3
 *   4. buildControlledLiveTextRedactionProof()  — 8.2I-1
 *   5. buildControlledLiveTextDraftResult()     — 8.2I-1
 *   6. validateRuntimeLLMOutputContract()    — 8.2G-2 (now accepts controlled_live_text)
 *   7. runRuntimeWordingGovernanceGate()     — 8.2G-3
 *   8. runRuntimeResponseAssemblerBridge()   — 8.2G-6
 *   9. runRuntimeUserVisibleAuthorisationGate()— 8.2G-7
 *
 * Fixture mode → input text / harness variant:
 *   safe_real_text          → "Bitte erklären Sie diesen Brief."
 *   safe_real_question      → "Was bedeutet das für mich?"
 *   pii_redaction_applied   → text with embedded PII markers
 *   input_contract_blocked  → "" (too short; blocked at input contract)
 *   redaction_blocked       → text triggering high-risk redaction rejection
 *   adapter_blocked         → bypassed redaction (null accepted input)
 *   wording_hard_fail       → safe_real_text + hard-fail score report
 *   human_review            → safe_real_question + human-review score report
 *
 * Safety invariants (literal types on the result):
 * - emittedToUserNow: false
 * - liveLLMCalled: false
 * - apiRouteTouched: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - temporaryMockBridgeUsed: false
 * - neverUserVisible: true
 *
 * Pure function — no external calls, no logging, no persistence.
 */

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
import { runRealTextInputContractValidation } from "./run-real-text-input-contract-validation";
import { runRealTextRedactionBoundary } from "./run-real-text-redaction-boundary";
import { runControlledLiveTextAdapter } from "./run-controlled-live-text-adapter";
import {
  buildControlledLiveTextDraftResult,
  buildControlledLiveTextRedactionProof,
} from "./controlled-live-text-draft-result-types";

export const GUARDED_LIVE_TEXT_RUNTIME_PIPELINE_VERSION =
  "8.2h-5-guarded-live-text-runtime-pipeline-v2-8.2i-3";

// ── Fixture input texts ───────────────────────────────────────────────────────

const SAFE_REAL_TEXT_FIXTURE = "Bitte erklären Sie diesen Brief.";
const SAFE_REAL_QUESTION_FIXTURE = "Was bedeutet das für mich?";
const PII_REDACTION_FIXTURE =
  "Bitte prüfen Sie: muster@beispiel.de oder +49 170 1234567.";
// Fixture text known to trigger high-risk rejection (IBAN pattern)
const HIGH_RISK_FIXTURE = "Meine IBAN lautet DE89370400440532013000.";

// ── Fixture mode helpers ──────────────────────────────────────────────────────

type ScoreReport = Parameters<typeof runRuntimeWordingGovernanceGate>[0]["scoreReport"];

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
  controlledLiveTextDraftUsed: boolean,
  realRedactedTextForwardedToOutputContract: boolean,
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
    temporaryMockBridgeUsed: false,
    controlledLiveTextDraftUsed,
    realRedactedTextForwardedToOutputContract,
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
 * Phase 8.2I-3: no mock bridge. ControlledLiveTextDraftResult is built from
 * the real 8.2H chain output and passed directly to validateRuntimeLLMOutputContract().
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

  // ── Stage 1 — Input contract validation (8.2H-1) ──────────────────────────

  // Modes that block at the input contract stage
  if (fixtureMode === "input_contract_blocked") {
    const contractResult = runRealTextInputContractValidation({
      inputMode: "real_text_guarded",
      text: "",          // empty → rejected by input contract
      sourceKind: "typed_text",
      validationRunId: `${pipelineRunId}:input-contract`,
      neverUserVisible: true,
    });
    diagnostics.push("guarded_live_text_pipeline_live_text_harness_completed");
    diagnostics.push("guarded_live_text_pipeline_blocked_live_text_harness");
    return makeBlocked(
      pipelineRunId,
      "blocked_live_text_harness",
      diagnostics,
      contractResult.verdict,
      "", "", "", "",
      false, false,
      [`Input contract blocked: ${contractResult.verdict}.`],
    );
  }

  // Modes that block at the redaction stage (high-risk patterns)
  if (fixtureMode === "redaction_blocked") {
    const contractResult = runRealTextInputContractValidation({
      inputMode: "real_text_guarded",
      text: HIGH_RISK_FIXTURE,
      sourceKind: "typed_text",
      validationRunId: `${pipelineRunId}:input-contract`,
      neverUserVisible: true,
    });
    if (
      contractResult.verdict !== "accepted_for_redaction_boundary" ||
      !contractResult.accepted
    ) {
      diagnostics.push("guarded_live_text_pipeline_live_text_harness_completed");
      diagnostics.push("guarded_live_text_pipeline_blocked_live_text_harness");
      return makeBlocked(
        pipelineRunId,
        "blocked_live_text_harness",
        diagnostics,
        contractResult.verdict,
        "", "", "", "",
        false, false,
        [`Input contract blocked for high-risk fixture: ${contractResult.verdict}.`],
      );
    }
    const redactionResult = runRealTextRedactionBoundary({
      acceptedInput: contractResult.accepted,
      redactionRunId: `${pipelineRunId}:redaction`,
      rejectHighRiskPatterns: true,
      neverUserVisible: true,
    });
    diagnostics.push("guarded_live_text_pipeline_live_text_harness_completed");
    diagnostics.push("guarded_live_text_pipeline_blocked_live_text_harness");
    return makeBlocked(
      pipelineRunId,
      "blocked_live_text_harness",
      diagnostics,
      redactionResult.verdict,
      "", "", "", "",
      false, false,
      [`Redaction blocked: ${redactionResult.verdict}.`],
    );
  }

  // Mode that blocks at the adapter stage
  if (fixtureMode === "adapter_blocked") {
    // Simulate adapter receiving null/invalid redaction accepted by calling adapter directly
    // with a null-equivalent: use a failed input contract scenario and bypass redaction
    const adapterResult = runControlledLiveTextAdapter({
      // Pass a null redactionAccepted to trigger adapter rejection
      redactionAccepted: null as never,
      sourceInputMode: "real_text_guarded",
      adapterRunId: `${pipelineRunId}:adapter`,
      neverUserVisible: true,
    });
    diagnostics.push("guarded_live_text_pipeline_live_text_harness_completed");
    diagnostics.push("guarded_live_text_pipeline_blocked_live_text_harness");
    return makeBlocked(
      pipelineRunId,
      "blocked_live_text_harness",
      diagnostics,
      adapterResult.verdict,
      "", "", "", "",
      false, false,
      [`Adapter blocked: ${adapterResult.verdict}.`],
    );
  }

  // ── Stages 1–3 — Full 8.2H chain for all reaching-8.2G modes ─────────────

  // Select fixture text and source mode based on pipeline mode
  const isQuestion =
    fixtureMode === "safe_real_question" || fixtureMode === "human_review";
  const isPII = fixtureMode === "pii_redaction_applied";

  const fixtureText = isQuestion
    ? SAFE_REAL_QUESTION_FIXTURE
    : isPII
    ? PII_REDACTION_FIXTURE
    : SAFE_REAL_TEXT_FIXTURE;

  const sourceMode = isQuestion ? "real_question_guarded" : "real_text_guarded";

  // Stage 1 — Input contract
  const inputContractResult = runRealTextInputContractValidation({
    inputMode: sourceMode,
    text: fixtureText,
    sourceKind: "typed_text",
    validationRunId: `${pipelineRunId}:input-contract`,
    neverUserVisible: true,
  });

  if (
    inputContractResult.verdict !== "accepted_for_redaction_boundary" ||
    !inputContractResult.accepted
  ) {
    diagnostics.push("guarded_live_text_pipeline_live_text_harness_completed");
    diagnostics.push("guarded_live_text_pipeline_blocked_live_text_harness");
    return makeBlocked(
      pipelineRunId,
      "blocked_live_text_harness",
      diagnostics,
      inputContractResult.verdict,
      "", "", "", "",
      false, false,
      [`Input contract rejected for fixture "${fixtureMode}": ${inputContractResult.verdict}.`],
    );
  }

  // Stage 2 — Redaction boundary
  const redactionResult = runRealTextRedactionBoundary({
    acceptedInput: inputContractResult.accepted,
    redactionRunId: `${pipelineRunId}:redaction`,
    neverUserVisible: true,
  });

  if (
    redactionResult.verdict !== "accepted_for_controlled_live_adapter" ||
    !redactionResult.accepted
  ) {
    diagnostics.push("guarded_live_text_pipeline_live_text_harness_completed");
    diagnostics.push("guarded_live_text_pipeline_blocked_live_text_harness");
    return makeBlocked(
      pipelineRunId,
      "blocked_live_text_harness",
      diagnostics,
      redactionResult.verdict,
      "", "", "", "",
      false, false,
      [`Redaction blocked for fixture "${fixtureMode}": ${redactionResult.verdict}.`],
    );
  }

  // Stage 3 — Controlled live text adapter
  const adapterResult = runControlledLiveTextAdapter({
    redactionAccepted: redactionResult.accepted,
    sourceInputMode: sourceMode,
    adapterRunId: `${pipelineRunId}:adapter`,
    neverUserVisible: true,
  });

  // Invariant checks on harness sub-layers
  if (
    adapterResult.liveLLMCalled !== false ||
    adapterResult.persistenceUsed !== false ||
    adapterResult.dnaSavePerformed !== false ||
    adapterResult.offlineSavePerformed !== false ||
    adapterResult.uiTouched !== false
  ) {
    diagnostics.push("guarded_live_text_pipeline_failed_invariant_violation");
    return makeBlocked(
      pipelineRunId,
      "failed_invariant_violation",
      diagnostics,
      adapterResult.verdict,
      "", "", "", "",
      false, false,
      ["Adapter result violated safety invariants."],
    );
  }

  if (adapterResult.verdict !== "adapted_for_output_contract_validation") {
    diagnostics.push("guarded_live_text_pipeline_live_text_harness_completed");
    diagnostics.push("guarded_live_text_pipeline_blocked_live_text_harness");
    return makeBlocked(
      pipelineRunId,
      "blocked_live_text_harness",
      diagnostics,
      adapterResult.verdict,
      "", "", "", "",
      false, false,
      [`Adapter rejected for fixture "${fixtureMode}": ${adapterResult.verdict}.`],
    );
  }

  diagnostics.push("guarded_live_text_pipeline_live_text_harness_completed");
  diagnostics.push("guarded_live_text_pipeline_adapter_candidate_confirmed");

  // ── Stage 4 — Build ControlledLiveTextRedactionProof (8.2I-1) ────────────

  const redactionProof = buildControlledLiveTextRedactionProof({
    redactionAccepted: redactionResult.accepted,
    adapterResult,
    redactionRunId: `${pipelineRunId}:redaction`,
    adapterRunId: `${pipelineRunId}:adapter`,
    notes: [
      `Pipeline fixture mode: ${fixtureMode}.`,
      "Bridge removed in 8.2I-3. Real redacted text forwarded.",
    ],
  });

  // ── Stage 5 — Build ControlledLiveTextDraftResult (8.2I-1) ───────────────

  const controlledLiveTextDraftResult = buildControlledLiveTextDraftResult({
    draftId: `${pipelineRunId}:controlled-live-text-draft`,
    adapterResult,
    redactionProof,
    appliedForbiddenMoves: [],
    appliedRequiredConstraints: [],
    diagnostics: ["controlled_live_text_draft_built"],
    auditTraceParentIds: [`${pipelineRunId}:adapter`],
    notes: [
      `Built from 8.2H chain: input contract → redaction → adapter.`,
      `Fixture mode: ${fixtureMode}.`,
      "temporaryMockBridgeUsed: false — bridge removed in Phase 8.2I-3.",
    ],
  });

  if (!controlledLiveTextDraftResult) {
    diagnostics.push("guarded_live_text_pipeline_rejected_missing_adapter_candidate");
    return makeBlocked(
      pipelineRunId,
      "rejected_missing_adapter_candidate",
      diagnostics,
      adapterResult.verdict,
      "", "", "", "",
      false, false,
      ["buildControlledLiveTextDraftResult returned null — proof or prefix invariant failed."],
    );
  }

  // ── Stage 6 — Output contract validator (8.2G-2) ──────────────────────────

  // The adapter input for the validator context (describes allowed sections / moves)
  const contractAdapterInput: RuntimeLLMDraftAdapterInput = {
    adapterMode: "mock",
    accessTier: "free_preview",
    contractRef: `${pipelineRunId}-controlled-live-text-contract`,
    allowedSectionTypes: [
      "what_this_means",
      "document_type_signal",
      "attention_points",
      "next_steps_safe",
      "uncertainty_notice",
      "review_recommendation",
      "blocked_content_notice",
    ],
    activeForbiddenMoves: [],
    activeRequiredConstraints: [],
    uncertaintyRequired: false,
    humanReviewRequired: false,
    auditTraceParentIds: [`${pipelineRunId}:adapter`],
    neverUserVisible: true,
    notes: [
      "Adapter input context for output contract validator on controlled live text path.",
    ],
  };

  const contractResult = validateRuntimeLLMOutputContract({
    input: contractAdapterInput,
    result: controlledLiveTextDraftResult as unknown as RuntimeLLMOutputContractDraftResult,
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
      adapterResult.verdict,
      contractResult.verdict,
      "", "", "",
      true, true,
      ["Output contract result violated safety invariants."],
    );
  }

  if (contractResult.verdict !== "accepted_for_next_gate") {
    diagnostics.push("guarded_live_text_pipeline_blocked_output_contract");
    return makeBlocked(
      pipelineRunId,
      "blocked_output_contract",
      diagnostics,
      adapterResult.verdict,
      contractResult.verdict,
      "", "", "",
      true, true,
      [`Output contract rejected: ${contractResult.verdict}.`],
    );
  }

  // ── Stage 7 — Wording governance gate (8.2G-3) ────────────────────────────

  const scoreReport = mapToScoreReport(fixtureMode);

  const wordingResult = runRuntimeWordingGovernanceGate({
    draftResult: controlledLiveTextDraftResult as unknown as RuntimeLLMOutputContractDraftResult,
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
      adapterResult.verdict,
      contractResult.verdict,
      wordingResult.verdict,
      "", "",
      true, true,
      ["Wording gate result violated safety invariants."],
    );
  }

  if (wordingResult.verdict === "hard_fail_wording_violation") {
    diagnostics.push("guarded_live_text_pipeline_blocked_wording_gate");
    return makeBlocked(
      pipelineRunId,
      "blocked_wording_gate",
      diagnostics,
      adapterResult.verdict,
      contractResult.verdict,
      wordingResult.verdict,
      "", "",
      true, true,
      ["Wording gate hard fail — pipeline stopped."],
    );
  }

  if (
    wordingResult.verdict !== "accepted_for_audit_dry_run" &&
    wordingResult.verdict !== "human_review_required"
  ) {
    diagnostics.push("guarded_live_text_pipeline_blocked_wording_gate");
    return makeBlocked(
      pipelineRunId,
      "blocked_wording_gate",
      diagnostics,
      adapterResult.verdict,
      contractResult.verdict,
      wordingResult.verdict,
      "", "",
      true, true,
      [`Wording gate rejected: ${wordingResult.verdict}.`],
    );
  }

  // ── Stage 8 — Response assembler bridge (8.2G-6) ─────────────────────────

  const assemblerResult = runRuntimeResponseAssemblerBridge({
    draftResult: controlledLiveTextDraftResult as unknown as RuntimeLLMOutputContractDraftResult,
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
      adapterResult.verdict,
      contractResult.verdict,
      wordingResult.verdict,
      assemblerResult.verdict,
      "",
      true, true,
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
      adapterResult.verdict,
      contractResult.verdict,
      wordingResult.verdict,
      assemblerResult.verdict,
      "",
      true, true,
      [`Assembler rejected: ${assemblerResult.verdict}.`],
    );
  }

  // ── Stage 9 — User-visible authorisation gate (8.2G-7) ───────────────────

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
      adapterResult.verdict,
      contractResult.verdict,
      wordingResult.verdict,
      assemblerResult.verdict,
      authorisationResult.verdict,
      true, true,
      ["Authorisation result violated safety invariants."],
    );
  }

  if (authorisationResult.verdict !== "authorised_internal_packet") {
    diagnostics.push("guarded_live_text_pipeline_blocked_user_visible_authorisation");
    return makeBlocked(
      pipelineRunId,
      "blocked_user_visible_authorisation",
      diagnostics,
      adapterResult.verdict,
      contractResult.verdict,
      wordingResult.verdict,
      assemblerResult.verdict,
      authorisationResult.verdict,
      true, true,
      [`Authorisation rejected: ${authorisationResult.verdict}.`],
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────

  diagnostics.push("guarded_live_text_pipeline_completed_authorised_packet");

  return {
    pipelineRunId,
    verdict: "completed_authorised_internal_packet",
    diagnostics,
    liveTextHarnessVerdict: adapterResult.verdict,
    outputContractVerdict: contractResult.verdict,
    wordingGateVerdict: wordingResult.verdict,
    responseAssemblerVerdict: assemblerResult.verdict,
    authorisationVerdict: authorisationResult.verdict,
    packetCreated: true,
    acceptedForUserVisibleAssembly: authorisationResult.acceptedForUserVisibleAssembly,
    userVisibleOutputAllowedForFuture: authorisationResult.userVisibleOutputAllowedForFuture,
    emittedToUserNow: false,
    temporaryMockBridgeUsed: false,
    controlledLiveTextDraftUsed: true,
    realRedactedTextForwardedToOutputContract: true,
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
      "temporaryMockBridgeUsed: false — mock bridge removed in Phase 8.2I-3.",
      "controlledLiveTextDraftUsed: true — ControlledLiveTextDraftResult built and validated.",
      "realRedactedTextForwardedToOutputContract: true — 8.2H chain output reached 8.2G validator.",
      "emittedToUserNow: false — packet is for internal governance use only.",
    ],
  };
}
