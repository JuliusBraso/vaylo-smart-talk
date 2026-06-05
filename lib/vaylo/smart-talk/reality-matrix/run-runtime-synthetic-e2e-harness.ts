/**
 * Runtime Synthetic End-to-End Harness (Phase 8.2G-8).
 *
 * Implements `runRuntimeSyntheticE2EHarness` — a pure orchestration function
 * that exercises the complete 8.2G governance pipeline using synthetic fixtures.
 *
 * This is a proof-of-readiness harness. It proves the internal pipeline can
 * produce an authorised `UserVisibleResponsePacket` candidate without touching
 * API routes, UI, live LLMs, persistence, or real user input.
 *
 * Fixture modes:
 *   mock_safe                   → completed_authorised_packet
 *   mock_unsafe_output_contract → blocked_output_contract
 *   mock_wording_hard_fail      → blocked_wording_gate
 *   mock_human_review           → blocked_user_visible_authorisation
 *   mock_metadata_leak          → blocked_response_assembler
 *   mock_empty_sections         → blocked_response_assembler
 *
 * Safety guarantees:
 * - emittedToUserNow always false
 * - liveLLMCalled always false
 * - apiRouteTouched always false
 * - uiTouched always false
 * - persistenceUsed always false
 * - dnaSavePerformed always false
 * - offlineSavePerformed always false
 * - neverUserVisible always true
 * - pure function, no external calls
 */

import { MOCK_UNSAFE_FIXTURE_CONTRACT_REF, runRuntimeLLMDraftMockAdapter } from "./run-runtime-llm-draft-mock-adapter";
import { validateRuntimeLLMOutputContract } from "./validate-runtime-llm-output-contract";
import { runRuntimeWordingGovernanceGate } from "./run-runtime-wording-governance-gate";
import { runRuntimeResponseAssemblerBridge } from "./run-runtime-response-assembler-bridge";
import { runRuntimeUserVisibleAuthorisationGate } from "./run-runtime-user-visible-authorisation-gate";
import {
  BASE_SAFE_SCORE_REPORT,
  BASE_HARD_FAIL_LEGAL_ADVICE_SCORE_REPORT,
  BASE_HUMAN_REVIEW_SCORE_REPORT,
} from "./runtime-wording-governance-gate-regression-scaffold";
import type { RuntimeLLMDraftAdapterInput } from "./runtime-llm-draft-adapter-types";
import type { RuntimeLLMOutputContractDraftResult } from "./runtime-llm-output-contract-validator-types";
import type {
  RuntimeSyntheticE2EHarnessDiagnosticCode,
  RuntimeSyntheticE2EHarnessFixtureMode,
  RuntimeSyntheticE2EHarnessInput,
  RuntimeSyntheticE2EHarnessResult,
  RuntimeSyntheticE2EHarnessVerdict,
} from "./runtime-synthetic-e2e-harness-types";

export const RUNTIME_SYNTHETIC_E2E_HARNESS_VERSION =
  "8.2g-8-runtime-synthetic-e2e-harness-v1";

// ── Fixture builder ───────────────────────────────────────────────────────────

type FixtureOutput = {
  readonly adapterInput: RuntimeLLMDraftAdapterInput;
  readonly draftResult: RuntimeLLMOutputContractDraftResult;
  readonly scoreReport: Parameters<typeof runRuntimeWordingGovernanceGate>[0]["scoreReport"];
};

function buildFixture(
  mode: RuntimeSyntheticE2EHarnessFixtureMode,
  harnessRunId: string,
): FixtureOutput {
  const baseAdapterInput: RuntimeLLMDraftAdapterInput = {
    adapterMode: "mock",
    accessTier: "free_preview",
    contractRef: `${harnessRunId}-contract`,
    allowedSectionTypes: ["document_type_signal", "uncertainty_notice"],
    activeForbiddenMoves: [],
    activeRequiredConstraints: [],
    uncertaintyRequired: false,
    humanReviewRequired: false,
    auditTraceParentIds: [],
    neverUserVisible: true,
  };

  switch (mode) {
    case "mock_safe": {
      const draftResult = runRuntimeLLMDraftMockAdapter(baseAdapterInput);
      return { adapterInput: baseAdapterInput, draftResult, scoreReport: BASE_SAFE_SCORE_REPORT };
    }

    case "mock_unsafe_output_contract": {
      const unsafeInput: RuntimeLLMDraftAdapterInput = {
        ...baseAdapterInput,
        contractRef: MOCK_UNSAFE_FIXTURE_CONTRACT_REF,
      };
      const draftResult = runRuntimeLLMDraftMockAdapter(unsafeInput);
      return { adapterInput: unsafeInput, draftResult, scoreReport: BASE_SAFE_SCORE_REPORT };
    }

    case "mock_wording_hard_fail": {
      const draftResult = runRuntimeLLMDraftMockAdapter(baseAdapterInput);
      return { adapterInput: baseAdapterInput, draftResult, scoreReport: BASE_HARD_FAIL_LEGAL_ADVICE_SCORE_REPORT };
    }

    case "mock_human_review": {
      const draftResult = runRuntimeLLMDraftMockAdapter(baseAdapterInput);
      return { adapterInput: baseAdapterInput, draftResult, scoreReport: BASE_HUMAN_REVIEW_SCORE_REPORT };
    }

    case "mock_metadata_leak": {
      // Construct a draft result whose single section, after prefix stripping,
      // contains an internal metadata marker. The contract validator accepts it
      // (no safety flags, has mock prefix); the assembler bridge rejects it.
      const draftResult: RuntimeLLMOutputContractDraftResult = {
        adapterMode: "mock",
        accessTier: "free_preview",
        sectionCandidates: [
          {
            sectionType: "document_type_signal",
            draftText: "[MOCK_DRAFT_NEVER_USER_VISIBLE] Contains llm_output_ internal metadata marker.",
            safetyFlags: [],
            sourceBound: false,
            neverUserVisible: true,
          },
        ],
        appliedForbiddenMoves: [],
        appliedRequiredConstraints: [],
        liveLLMCalled: false,
        userVisibleOutputAllowed: false,
        neverUserVisible: true,
      };
      return { adapterInput: baseAdapterInput, draftResult, scoreReport: BASE_SAFE_SCORE_REPORT };
    }

    case "mock_empty_sections": {
      // Construct a draft result with no sections. Contract validator and wording
      // gate accept it (no violations, no sections to check); the assembler bridge
      // rejects it as rejected_missing_sections.
      const draftResult: RuntimeLLMOutputContractDraftResult = {
        adapterMode: "mock",
        accessTier: "free_preview",
        sectionCandidates: [],
        appliedForbiddenMoves: [],
        appliedRequiredConstraints: [],
        liveLLMCalled: false,
        userVisibleOutputAllowed: false,
        neverUserVisible: true,
      };
      return { adapterInput: baseAdapterInput, draftResult, scoreReport: BASE_SAFE_SCORE_REPORT };
    }
  }
}

// ── Early-return helper ───────────────────────────────────────────────────────

function makeBlockedResult(params: {
  harnessRunId: string;
  verdict: RuntimeSyntheticE2EHarnessVerdict;
  diagnostics: RuntimeSyntheticE2EHarnessDiagnosticCode[];
  outputContractVerdict: string;
  wordingGateVerdict: string;
  assemblerVerdict: string;
  authorisationVerdict: string;
  notes: string[];
}): RuntimeSyntheticE2EHarnessResult {
  return {
    harnessRunId: params.harnessRunId,
    verdict: params.verdict,
    diagnostics: params.diagnostics,
    outputContractVerdict: params.outputContractVerdict,
    wordingGateVerdict: params.wordingGateVerdict,
    assemblerVerdict: params.assemblerVerdict,
    authorisationVerdict: params.authorisationVerdict,
    packetCreated: false,
    acceptedForUserVisibleAssembly: false,
    emittedToUserNow: false,
    userVisibleOutputAllowedForFuture: false,
    liveLLMCalled: false,
    apiRouteTouched: false,
    uiTouched: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    neverUserVisible: true,
    notes: params.notes,
  };
}

// ── Main harness function ─────────────────────────────────────────────────────

/**
 * Runs the complete 8.2G governance pipeline against a synthetic fixture.
 *
 * Exercises all gates in sequence: output contract validator → wording gate →
 * response assembler bridge → user-visible authorisation gate. Stops at the
 * first failure and returns a `blocked_*` verdict.
 *
 * On success (`mock_safe`): returns `completed_authorised_packet` with an
 * authorised internal packet that is NOT emitted or persisted.
 *
 * Pure function — no side effects, no external calls, no persistence.
 */
export function runRuntimeSyntheticE2EHarness(
  input: RuntimeSyntheticE2EHarnessInput,
): RuntimeSyntheticE2EHarnessResult {
  const { harnessRunId, fixtureMode } = input;

  const diagnostics: RuntimeSyntheticE2EHarnessDiagnosticCode[] = [
    "synthetic_e2e_started",
    "synthetic_e2e_no_api_route_confirmed",
    "synthetic_e2e_no_ui_confirmed",
    "synthetic_e2e_no_live_llm_confirmed",
    "synthetic_e2e_no_persistence_confirmed",
  ];

  const baseNotes = [
    `Harness version: ${RUNTIME_SYNTHETIC_E2E_HARNESS_VERSION}.`,
    `Harness run ID: ${harnessRunId}.`,
    `Fixture mode: ${fixtureMode}.`,
    "liveLLMCalled: false. apiRouteTouched: false. uiTouched: false.",
    "persistenceUsed: false. dnaSavePerformed: false. offlineSavePerformed: false.",
  ];

  // ── Build fixture ─────────────────────────────────────────────────────────

  const fixture = buildFixture(fixtureMode, harnessRunId);
  diagnostics.push("synthetic_e2e_draft_created");

  // ── Gate 1: Output contract validator (8.2G-2/8.2G-5A) ───────────────────

  const contractValidation = validateRuntimeLLMOutputContract({
    input: fixture.adapterInput,
    result: fixture.draftResult,
  });
  diagnostics.push("synthetic_e2e_output_contract_completed");

  if (contractValidation.verdict !== "accepted_for_next_gate") {
    diagnostics.push("synthetic_e2e_blocked_output_contract");
    return makeBlockedResult({
      harnessRunId,
      verdict: "blocked_output_contract",
      diagnostics,
      outputContractVerdict: contractValidation.verdict,
      wordingGateVerdict: "not_reached",
      assemblerVerdict: "not_reached",
      authorisationVerdict: "not_reached",
      notes: [
        ...baseNotes,
        `Output contract verdict: ${contractValidation.verdict}. Pipeline stopped.`,
      ],
    });
  }

  // ── Gate 2: Wording governance gate (8.2G-3/8.2G-6A) ────────────────────

  const wordingGateResult = runRuntimeWordingGovernanceGate({
    draftResult: fixture.draftResult,
    outputContractValidation: contractValidation,
    scoreReport: fixture.scoreReport,
    neverUserVisible: true,
  });
  diagnostics.push("synthetic_e2e_wording_gate_completed");

  // Hard fail — no further processing
  if (wordingGateResult.verdict === "hard_fail_wording_violation") {
    diagnostics.push("synthetic_e2e_blocked_wording_gate");
    return makeBlockedResult({
      harnessRunId,
      verdict: "blocked_wording_gate",
      diagnostics,
      outputContractVerdict: contractValidation.verdict,
      wordingGateVerdict: wordingGateResult.verdict,
      assemblerVerdict: "not_reached",
      authorisationVerdict: "not_reached",
      notes: [
        ...baseNotes,
        `Wording gate verdict: ${wordingGateResult.verdict}. Pipeline stopped.`,
      ],
    });
  }

  // Rejections other than human_review_required also block here
  if (
    wordingGateResult.verdict !== "accepted_for_audit_dry_run" &&
    wordingGateResult.verdict !== "human_review_required"
  ) {
    diagnostics.push("synthetic_e2e_blocked_wording_gate");
    return makeBlockedResult({
      harnessRunId,
      verdict: "blocked_wording_gate",
      diagnostics,
      outputContractVerdict: contractValidation.verdict,
      wordingGateVerdict: wordingGateResult.verdict,
      assemblerVerdict: "not_reached",
      authorisationVerdict: "not_reached",
      notes: [
        ...baseNotes,
        `Wording gate verdict: ${wordingGateResult.verdict}. Pipeline stopped.`,
      ],
    });
  }

  // ── Gate 3: Response assembler bridge (8.2G-6) ───────────────────────────

  const assemblerResult = runRuntimeResponseAssemblerBridge({
    draftResult: fixture.draftResult,
    outputContractValidation: contractValidation,
    wordingGateResult,
    auditTraceValid: true,
    diagnosticEnvelopeValid: true,
    assemblyRunId: `${harnessRunId}-assembly`,
    neverUserVisible: true,
  });
  diagnostics.push("synthetic_e2e_response_assembler_completed");

  // Only `assembled_internal_candidate` and `assembled_human_review_packet` proceed
  if (
    assemblerResult.verdict !== "assembled_internal_candidate" &&
    assemblerResult.verdict !== "assembled_human_review_packet"
  ) {
    diagnostics.push("synthetic_e2e_blocked_response_assembler");
    return makeBlockedResult({
      harnessRunId,
      verdict: "blocked_response_assembler",
      diagnostics,
      outputContractVerdict: contractValidation.verdict,
      wordingGateVerdict: wordingGateResult.verdict,
      assemblerVerdict: assemblerResult.verdict,
      authorisationVerdict: "not_reached",
      notes: [
        ...baseNotes,
        `Assembler verdict: ${assemblerResult.verdict}. Pipeline stopped.`,
      ],
    });
  }

  // ── Gate 4: User-visible authorisation gate (8.2G-7) ────────────────────

  const authResult = runRuntimeUserVisibleAuthorisationGate({
    assemblerResult,
    authorisationRunId: `${harnessRunId}-auth`,
    neverUserVisible: true,
  });
  diagnostics.push("synthetic_e2e_user_visible_authorisation_completed");

  if (authResult.verdict !== "authorised_internal_packet") {
    diagnostics.push("synthetic_e2e_blocked_user_visible_authorisation");
    return makeBlockedResult({
      harnessRunId,
      verdict: "blocked_user_visible_authorisation",
      diagnostics,
      outputContractVerdict: contractValidation.verdict,
      wordingGateVerdict: wordingGateResult.verdict,
      assemblerVerdict: assemblerResult.verdict,
      authorisationVerdict: authResult.verdict,
      notes: [
        ...baseNotes,
        `Authorisation verdict: ${authResult.verdict}. Pipeline stopped.`,
      ],
    });
  }

  // ── Missing packet guard ───────────────────────────────────────────────────

  if (authResult.packet === null) {
    diagnostics.push("synthetic_e2e_missing_packet");
    return makeBlockedResult({
      harnessRunId,
      verdict: "failed_missing_packet",
      diagnostics,
      outputContractVerdict: contractValidation.verdict,
      wordingGateVerdict: wordingGateResult.verdict,
      assemblerVerdict: assemblerResult.verdict,
      authorisationVerdict: authResult.verdict,
      notes: [
        ...baseNotes,
        "Authorisation verdict was authorised_internal_packet but packet === null. Invariant failure.",
      ],
    });
  }

  // ── Success ────────────────────────────────────────────────────────────────

  diagnostics.push("synthetic_e2e_packet_authorised");

  return {
    harnessRunId,
    verdict: "completed_authorised_packet",
    diagnostics,
    outputContractVerdict: contractValidation.verdict,
    wordingGateVerdict: wordingGateResult.verdict,
    assemblerVerdict: assemblerResult.verdict,
    authorisationVerdict: authResult.verdict,
    packetCreated: true,
    acceptedForUserVisibleAssembly: true,
    emittedToUserNow: false,
    userVisibleOutputAllowedForFuture: true,
    liveLLMCalled: false,
    apiRouteTouched: false,
    uiTouched: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    neverUserVisible: true,
    notes: [
      ...baseNotes,
      `Full internal pipeline completed. Packet ID: ${harnessRunId}-auth-packet.`,
      `Sections authorised: ${String(authResult.packet.sections.length)}.`,
      "authorisedForFutureDelivery: true. emittedToUserNow: false.",
      "Phase 8.2G-8+ required for Smart Talk runtime delivery wiring.",
    ],
  };
}
