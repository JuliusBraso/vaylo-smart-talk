/**
 * Runtime Response Assembler Bridge regression scaffold (Phase 8.2G-6).
 *
 * Validates the response assembler bridge across 14 cases covering all gating
 * rules, both mock and live sandbox paths, prefix stripping, metadata leak
 * detection, and invariant preservation.
 *
 * Cases:
 *  1.  Safe mock path assembles internal candidate
 *  2.  Output contract rejected blocks assembly
 *  3.  Wording hard fail blocks assembly
 *  4.  Human review required produces restricted packet
 *  5.  auditTraceValid false blocks assembly
 *  6.  diagnosticEnvelopeValid false blocks assembly
 *  7.  Known mock prefix stripped from textCandidate
 *  8.  Known live sandbox prefix stripped from textCandidate
 *  9.  Internal metadata leak rejects assembly
 * 10.  Missing sections rejects assembly
 * 11.  No persistence / no saves invariants hold
 * 12.  No user-visible emission invariants hold
 * 13.  Live path with valid proof assembles internal candidate
 * 14.  Assembler does not expose diagnostic/audit/proof objects in section candidates
 *
 * No Jest. No Vitest. No CI hook. No live LLM call. No API key required.
 */

import { runRuntimeLLMDraftMockAdapter } from "./run-runtime-llm-draft-mock-adapter";
import { validateRuntimeLLMOutputContract } from "./validate-runtime-llm-output-contract";
import { runRuntimeWordingGovernanceGate } from "./run-runtime-wording-governance-gate";
import {
  BASE_SAFE_SCORE_REPORT,
  BASE_HUMAN_REVIEW_SCORE_REPORT,
  BASE_HARD_FAIL_LEGAL_ADVICE_SCORE_REPORT,
} from "./runtime-wording-governance-gate-regression-scaffold";
import {
  runRuntimeResponseAssemblerBridge,
  RUNTIME_RESPONSE_ASSEMBLER_BRIDGE_VERSION,
} from "./run-runtime-response-assembler-bridge";
import type {
  RuntimeResponseAssemblerBridgeInput,
  RuntimeResponseAssemblerBridgeResult,
  RuntimeResponseAssemblerBridgeVerdict,
  RuntimeResponseAssemblerBridgeDiagnosticCode,
} from "./runtime-response-assembler-bridge-types";
import type {
  RuntimeLLMDraftAdapterInput,
  RuntimeLLMDraftAdapterResult,
} from "./runtime-llm-draft-adapter-types";
import type { RuntimeLLMOutputContractValidationResult } from "./runtime-llm-output-contract-validator-types";
import type { RuntimeWordingGateResult } from "./runtime-wording-governance-gate-types";
import type { RuntimeLiveLLMSandboxDraftCandidateResult } from "./runtime-live-llm-sandbox-types";
import type { RuntimeLiveSandboxGuardProof } from "./runtime-live-path-type-extension-types";
import { LIVE_SANDBOX_DRAFT_TEXT_PREFIX } from "./runtime-live-path-type-extension-types";

export const RESPONSE_ASSEMBLER_REGRESSION_SCAFFOLD_VERSION =
  "8.2g-6a-runtime-response-assembler-bridge-regression-v2";

// ── Result types ──────────────────────────────────────────────────────────────

export interface AssemblerRegressionCaseResult {
  readonly caseNumber: number;
  readonly caseName: string;
  readonly passed: boolean;
  readonly failures: readonly string[];
  readonly bridgeResult?: RuntimeResponseAssemblerBridgeResult;
  readonly notes?: readonly string[];
}

export interface AssemblerRegressionScaffoldResult {
  readonly scaffoldVersion: string;
  readonly allPassed: boolean;
  readonly passCount: number;
  readonly failCount: number;
  readonly caseResults: readonly AssemblerRegressionCaseResult[];
  readonly notes: readonly string[];
}

// ── Assertion helpers ─────────────────────────────────────────────────────────

function fail(message: string, failures: string[]): void {
  failures.push(message);
}

function assertEq<T>(actual: T, expected: T, label: string, failures: string[]): void {
  if (actual !== expected) {
    fail(`${label}: expected ${String(expected)}, got ${String(actual)}`, failures);
  }
}

function assertVerdict(
  r: RuntimeResponseAssemblerBridgeResult,
  expected: RuntimeResponseAssemblerBridgeVerdict,
  failures: string[],
): void {
  assertEq(r.verdict, expected, "verdict", failures);
}

function assertDiagPresent(
  r: RuntimeResponseAssemblerBridgeResult,
  code: RuntimeResponseAssemblerBridgeDiagnosticCode,
  failures: string[],
): void {
  if (!r.diagnostics.includes(code)) {
    fail(`Expected diagnostic '${code}' but was absent.`, failures);
  }
}

function assertInvariants(r: RuntimeResponseAssemblerBridgeResult, failures: string[]): void {
  assertEq(r.userVisibleOutputEmitted, false, "userVisibleOutputEmitted", failures);
  assertEq(r.userVisibleOutputAllowed, false, "userVisibleOutputAllowed", failures);
  assertEq(r.persistenceUsed, false, "persistenceUsed", failures);
  assertEq(r.dnaSavePerformed, false, "dnaSavePerformed", failures);
  assertEq(r.offlineSavePerformed, false, "offlineSavePerformed", failures);
  assertEq(r.neverUserVisible, true, "neverUserVisible", failures);
  r.sectionCandidates.forEach((sc, i) => {
    assertEq(sc.neverUserVisible, true, `sectionCandidates[${String(i)}].neverUserVisible`, failures);
  });
}

// ── Pipeline helpers ──────────────────────────────────────────────────────────

function makeDraftInput(
  overrides: Partial<RuntimeLLMDraftAdapterInput> = {},
): RuntimeLLMDraftAdapterInput {
  return {
    adapterMode: "mock",
    accessTier: "free_preview",
    contractRef: "8.2g-6-scaffold-contract",
    allowedSectionTypes: ["document_type_signal", "uncertainty_notice"],
    activeForbiddenMoves: [],
    activeRequiredConstraints: [],
    uncertaintyRequired: false,
    humanReviewRequired: false,
    auditTraceParentIds: [],
    neverUserVisible: true,
    ...overrides,
  };
}

type PipelineOutput = {
  draftResult: RuntimeLLMDraftAdapterResult;
  contractValidation: RuntimeLLMOutputContractValidationResult;
  wordingGateResult: RuntimeWordingGateResult;
};

function runMockPipeline(
  draftInput: RuntimeLLMDraftAdapterInput,
  scoreReportOverride?: Parameters<typeof BASE_SAFE_SCORE_REPORT extends infer T ? (x: T) => void : never>[0],
): PipelineOutput {
  void scoreReportOverride;
  const draftResult = runRuntimeLLMDraftMockAdapter(draftInput);
  const contractValidation = validateRuntimeLLMOutputContract({
    input: draftInput,
    result: draftResult,
  });
  const wordingGateResult = runRuntimeWordingGovernanceGate({
    draftResult,
    outputContractValidation: contractValidation,
    scoreReport: BASE_SAFE_SCORE_REPORT,
    neverUserVisible: true,
  });
  return { draftResult, contractValidation, wordingGateResult };
}

function runMockPipelineWithScore(
  draftInput: RuntimeLLMDraftAdapterInput,
  scoreReport: Parameters<typeof runRuntimeWordingGovernanceGate>[0]["scoreReport"],
): PipelineOutput {
  const draftResult = runRuntimeLLMDraftMockAdapter(draftInput);
  const contractValidation = validateRuntimeLLMOutputContract({
    input: draftInput,
    result: draftResult,
  });
  const wordingGateResult = runRuntimeWordingGovernanceGate({
    draftResult,
    outputContractValidation: contractValidation,
    scoreReport,
    neverUserVisible: true,
  });
  return { draftResult, contractValidation, wordingGateResult };
}

function makeBridgeInput(
  pipeline: PipelineOutput,
  overrides: Partial<RuntimeResponseAssemblerBridgeInput> = {},
): RuntimeResponseAssemblerBridgeInput {
  return {
    draftResult: pipeline.draftResult,
    outputContractValidation: pipeline.contractValidation,
    wordingGateResult: pipeline.wordingGateResult,
    auditTraceValid: true,
    diagnosticEnvelopeValid: true,
    assemblyRunId: "8.2g-6-scaffold-run-001",
    neverUserVisible: true,
    ...overrides,
  };
}

/** A minimal valid guard proof for the live sandbox test case. */
const LIVE_PROOF: RuntimeLiveSandboxGuardProof = {
  proofKind: "live_llm_sandbox_guard_proof",
  status: "proven",
  sandboxRunId: "8.2g-6-scaffold-sandbox-run-001",
  fixtureId: "8.2g-6-scaffold-fixture-001",
  provider: "openai",
  disposition: "completed_live_sandbox_call",
  allowLiveCall: true,
  syntheticOnly: true,
  neverContainsRealPii: true,
  outputShapeValidated: true,
  promptContractBuilt: true,
  userVisibleOutputAllowed: false,
  persistenceUsed: false,
  realUserInputUsed: false,
  neverUserVisible: true,
  notes: ["Scaffold live proof fixture."],
};

/**
 * Synthetic accepted wording gate result — retained for cases where a wording
 * gate result is needed without constructing a full live sandbox fixture (e.g.
 * case 2, which injects a pre-built rejected contract validation). Cases 8 and
 * 13 were updated in Phase 8.2G-6A to use the native wording gate path instead.
 *
 * @deprecated for live path testing — use runRuntimeWordingGovernanceGate() natively.
 */
const ACCEPTED_WORDING_GATE: RuntimeWordingGateResult = {
  verdict: "accepted_for_audit_dry_run",
  acceptedForAuditDryRun: true,
  acceptedForUserVisibleAssembly: false,
  sectionResults: [],
  diagnostics: [
    "wording_gate_accepted_for_audit_dry_run",
    "wording_gate_user_visible_output_still_forbidden",
    "wording_gate_never_user_visible_preserved",
    "wording_gate_draft_text_not_evaluated_semantically",
  ],
  liveLLMJudgeCalled: false,
  realTextSemanticallyEvaluated: false,
  userVisibleOutputAllowed: false,
  neverUserVisible: true,
  notes: [
    "Synthetic accepted wording gate — retained for cases needing a pre-built gate result.",
    "Phase 8.2G-6A: cases 8 and 13 now use runRuntimeWordingGovernanceGate() natively.",
  ],
};

// ── Cases ─────────────────────────────────────────────────────────────────────

// Case 1: safe mock path assembles internal candidate
function case1_safeMockPathAssembles(): AssemblerRegressionCaseResult {
  const failures: string[] = [];
  const pipeline = runMockPipeline(makeDraftInput());
  const bridgeInput = makeBridgeInput(pipeline);
  const result = runRuntimeResponseAssemblerBridge(bridgeInput);

  assertVerdict(result, "assembled_internal_candidate", failures);
  assertEq(result.eligibleForFutureUserVisibleAssembly, true, "eligibleForFutureUserVisibleAssembly", failures);
  assertDiagPresent(result, "response_assembler_internal_candidate_created", failures);
  assertEq(result.sectionCandidates.length > 0, true, "sectionCandidates not empty", failures);
  assertEq(result.liveLLMCalled, false, "liveLLMCalled (mock path)", failures);
  assertInvariants(result, failures);

  return {
    caseNumber: 1,
    caseName: "safe mock path → assembled_internal_candidate",
    passed: failures.length === 0,
    failures,
    bridgeResult: result,
    notes: ["Happy path: all gates pass, internal candidate assembled."],
  };
}

// Case 2: output contract rejected blocks assembly
function case2_outputContractRejected(): AssemblerRegressionCaseResult {
  const failures: string[] = [];
  const draftInput = makeDraftInput();
  const draftResult = runRuntimeLLMDraftMockAdapter(draftInput);
  // Tamper: produce a rejected contract validation
  const rejectedContractValidation: RuntimeLLMOutputContractValidationResult = {
    verdict: "rejected_contract_violation",
    acceptedForWordingGate: false,
    acceptedForUserVisibleAssembly: false,
    sectionResults: [],
    violations: ["llm_output_forbidden_adapter_mode"],
    validatedForbiddenMoves: [],
    validatedRequiredConstraints: [],
    liveLLMCalled: false,
    userVisibleOutputAllowed: false,
    neverUserVisible: true,
  };
  const result = runRuntimeResponseAssemblerBridge({
    draftResult,
    outputContractValidation: rejectedContractValidation,
    wordingGateResult: ACCEPTED_WORDING_GATE,
    auditTraceValid: true,
    diagnosticEnvelopeValid: true,
    assemblyRunId: "case2-run",
    neverUserVisible: true,
  });

  assertVerdict(result, "rejected_output_contract_not_accepted", failures);
  assertEq(result.eligibleForFutureUserVisibleAssembly, false, "eligibleForFutureUserVisibleAssembly", failures);
  assertDiagPresent(result, "response_assembler_output_contract_rejected", failures);
  assertEq(result.sectionCandidates.length, 0, "no sectionCandidates", failures);
  assertInvariants(result, failures);

  return {
    caseNumber: 2,
    caseName: "output contract rejected → rejected_output_contract_not_accepted",
    passed: failures.length === 0,
    failures,
    bridgeResult: result,
    notes: ["Output contract must be accepted_for_next_gate."],
  };
}

// Case 3: wording hard fail blocks assembly
function case3_wordingHardFail(): AssemblerRegressionCaseResult {
  const failures: string[] = [];
  const pipeline = runMockPipelineWithScore(makeDraftInput(), BASE_HARD_FAIL_LEGAL_ADVICE_SCORE_REPORT);
  const bridgeInput = makeBridgeInput(pipeline);
  const result = runRuntimeResponseAssemblerBridge(bridgeInput);

  assertVerdict(result, "rejected_wording_gate_not_accepted", failures);
  assertEq(result.eligibleForFutureUserVisibleAssembly, false, "eligibleForFutureUserVisibleAssembly", failures);
  assertDiagPresent(result, "response_assembler_wording_gate_rejected", failures);
  assertInvariants(result, failures);

  return {
    caseNumber: 3,
    caseName: "wording hard fail → rejected_wording_gate_not_accepted",
    passed: failures.length === 0,
    failures,
    bridgeResult: result,
    notes: ["hard_fail_tone_violation verdict from wording gate blocks assembly."],
  };
}

// Case 4: human review required produces restricted packet
function case4_humanReviewRequired(): AssemblerRegressionCaseResult {
  const failures: string[] = [];
  const pipeline = runMockPipelineWithScore(makeDraftInput(), BASE_HUMAN_REVIEW_SCORE_REPORT);
  const bridgeInput = makeBridgeInput(pipeline);
  const result = runRuntimeResponseAssemblerBridge(bridgeInput);

  assertVerdict(result, "assembled_human_review_packet", failures);
  assertEq(result.eligibleForFutureUserVisibleAssembly, false, "eligibleForFutureUserVisibleAssembly", failures);
  assertDiagPresent(result, "response_assembler_human_review_packet_created", failures);
  assertInvariants(result, failures);

  return {
    caseNumber: 4,
    caseName: "human review required → assembled_human_review_packet",
    passed: failures.length === 0,
    failures,
    bridgeResult: result,
    notes: [
      "human_review_required wording gate verdict creates a restricted packet.",
      "eligibleForFutureUserVisibleAssembly: false.",
    ],
  };
}

// Case 5: auditTraceValid false blocks assembly
function case5_auditTraceInvalid(): AssemblerRegressionCaseResult {
  const failures: string[] = [];
  const pipeline = runMockPipeline(makeDraftInput());
  const bridgeInput = makeBridgeInput(pipeline, { auditTraceValid: false });
  const result = runRuntimeResponseAssemblerBridge(bridgeInput);

  assertVerdict(result, "rejected_audit_trace_invalid", failures);
  assertDiagPresent(result, "response_assembler_audit_trace_invalid", failures);
  assertEq(result.eligibleForFutureUserVisibleAssembly, false, "eligibleForFutureUserVisibleAssembly", failures);
  assertInvariants(result, failures);

  return {
    caseNumber: 5,
    caseName: "auditTraceValid:false → rejected_audit_trace_invalid",
    passed: failures.length === 0,
    failures,
    bridgeResult: result,
    notes: ["Audit trace validity is required."],
  };
}

// Case 6: diagnosticEnvelopeValid false blocks assembly
function case6_diagnosticEnvelopeInvalid(): AssemblerRegressionCaseResult {
  const failures: string[] = [];
  const pipeline = runMockPipeline(makeDraftInput());
  const bridgeInput = makeBridgeInput(pipeline, { diagnosticEnvelopeValid: false });
  const result = runRuntimeResponseAssemblerBridge(bridgeInput);

  assertVerdict(result, "rejected_diagnostic_envelope_invalid", failures);
  assertDiagPresent(result, "response_assembler_diagnostic_envelope_invalid", failures);
  assertEq(result.eligibleForFutureUserVisibleAssembly, false, "eligibleForFutureUserVisibleAssembly", failures);
  assertInvariants(result, failures);

  return {
    caseNumber: 6,
    caseName: "diagnosticEnvelopeValid:false → rejected_diagnostic_envelope_invalid",
    passed: failures.length === 0,
    failures,
    bridgeResult: result,
    notes: ["Diagnostic envelope validity is required."],
  };
}

// Case 7: known mock prefix stripped
function case7_mockPrefixStripped(): AssemblerRegressionCaseResult {
  const failures: string[] = [];
  const pipeline = runMockPipeline(makeDraftInput());
  const bridgeInput = makeBridgeInput(pipeline);
  const result = runRuntimeResponseAssemblerBridge(bridgeInput);

  if (result.verdict !== "assembled_internal_candidate") {
    return {
      caseNumber: 7,
      caseName: "mock prefix stripped in assembled candidate",
      passed: false,
      failures: [`Prerequisite failed: expected assembled_internal_candidate, got ${result.verdict}`],
      bridgeResult: result,
    };
  }

  const prefixStripped = result.sectionCandidates.some((sc) => sc.internalDraftPrefixRemoved);
  const noPrefixInText = result.sectionCandidates.every(
    (sc) => !sc.textCandidate.startsWith("[MOCK_DRAFT_NEVER_USER_VISIBLE]"),
  );

  if (!prefixStripped) fail("Expected at least one section with internalDraftPrefixRemoved:true", failures);
  if (!noPrefixInText) fail("textCandidate should not start with [MOCK_DRAFT_NEVER_USER_VISIBLE]", failures);
  assertDiagPresent(result, "response_assembler_internal_prefix_stripped", failures);
  assertInvariants(result, failures);

  return {
    caseNumber: 7,
    caseName: "mock prefix [MOCK_DRAFT_NEVER_USER_VISIBLE] stripped from textCandidate",
    passed: failures.length === 0,
    failures,
    bridgeResult: result,
    notes: ["textCandidate has prefix removed; still neverUserVisible."],
  };
}

// Case 8: live sandbox prefix stripped (Phase 8.2G-6A: now uses native wording gate)
function case8_liveSandboxPrefixStripped(): AssemblerRegressionCaseResult {
  const failures: string[] = [];

  const liveSandboxResult: RuntimeLiveLLMSandboxDraftCandidateResult = {
    sandboxRunId: "8.2g-6-case8-run",
    adapterMode: "future_live_llm",
    accessTier: "free_preview",
    fixtureId: "8.2g-6-case8-fixture",
    sectionCandidates: [
      {
        sectionType: "document_type_signal",
        draftText: `${LIVE_SANDBOX_DRAFT_TEXT_PREFIX} Live sandbox type signal candidate.`,
        safetyFlags: [],
        sourceBound: true,
        neverUserVisible: true,
      },
    ],
    appliedForbiddenMoves: [],
    appliedRequiredConstraints: [],
    liveLLMCalled: true,
    userVisibleOutputAllowed: false,
    neverUserVisible: true,
    sandboxGuardProof: LIVE_PROOF,
    modelingGapNote: "Phase 8.2G-5A resolved.",
    notes: ["Case 8 scaffold live sandbox draft."],
  };

  const liveContractInput = {
    adapterMode: "future_live_llm" as const,
    accessTier: "free_preview" as const,
    contractRef: "8.2g-6-case8-contract",
    allowedSectionTypes: ["document_type_signal", "uncertainty_notice"] as const,
    activeForbiddenMoves: [] as const,
    activeRequiredConstraints: [] as const,
    uncertaintyRequired: false,
    humanReviewRequired: false,
    auditTraceParentIds: [] as const,
    neverUserVisible: true as const,
  };

  const liveContractValidation = validateRuntimeLLMOutputContract({
    input: liveContractInput,
    result: liveSandboxResult,
  });

  // Phase 8.2G-6A: now flows through wording gate natively (no synthetic gate result needed)
  const wordingGateResult = runRuntimeWordingGovernanceGate({
    draftResult: liveSandboxResult,
    outputContractValidation: liveContractValidation,
    scoreReport: BASE_SAFE_SCORE_REPORT,
    neverUserVisible: true,
  });

  const result = runRuntimeResponseAssemblerBridge({
    draftResult: liveSandboxResult,
    outputContractValidation: liveContractValidation,
    wordingGateResult,
    auditTraceValid: true,
    diagnosticEnvelopeValid: true,
    assemblyRunId: "8.2g-6-case8-assembly",
    neverUserVisible: true,
  });

  if (result.verdict !== "assembled_internal_candidate") {
    return {
      caseNumber: 8,
      caseName: "live sandbox prefix stripped in assembled candidate",
      passed: false,
      failures: [
        `Prerequisite failed: expected assembled_internal_candidate, got ${result.verdict}`,
        ...(result.notes ?? []),
      ],
      bridgeResult: result,
    };
  }

  const prefixStripped = result.sectionCandidates.some((sc) => sc.internalDraftPrefixRemoved);
  const noPrefixInText = result.sectionCandidates.every(
    (sc) => !sc.textCandidate.startsWith(LIVE_SANDBOX_DRAFT_TEXT_PREFIX),
  );

  if (!prefixStripped) fail("Expected at least one section with internalDraftPrefixRemoved:true", failures);
  if (!noPrefixInText) fail("textCandidate should not start with live sandbox prefix", failures);
  assertEq(result.liveLLMCalled, true, "liveLLMCalled should be true (live path)", failures);
  assertInvariants(result, failures);

  return {
    caseNumber: 8,
    caseName: "live sandbox prefix [LIVE_SANDBOX_DRAFT_NEVER_USER_VISIBLE] stripped (native wording gate via Phase 8.2G-6A)",
    passed: failures.length === 0,
    failures,
    bridgeResult: result,
    notes: [
      "Live sandbox prefix removed from textCandidate.",
      "liveLLMCalled:true preserved in bridge result.",
      "Phase 8.2G-6A: now uses runRuntimeWordingGovernanceGate() natively — no synthetic gate result.",
      "Still neverUserVisible.",
    ],
  };
}

// Case 9: internal metadata leak rejected
function case9_internalMetadataLeakRejected(): AssemblerRegressionCaseResult {
  const failures: string[] = [];
  const draftInput = makeDraftInput({
    allowedSectionTypes: ["document_type_signal", "uncertainty_notice"],
  });
  const draftResult = runRuntimeLLMDraftMockAdapter(draftInput);
  validateRuntimeLLMOutputContract({
    input: draftInput,
    result: draftResult,
  });

  // Inject a section with internal metadata into the contract validation's draft result
  // by using the draftResult but wrapping it with a section that contains a leak marker
  const draftResultWithLeak = {
    ...draftResult,
    sectionCandidates: [
      {
        sectionType: "document_type_signal" as const,
        draftText: "[MOCK_DRAFT_NEVER_USER_VISIBLE] Contains llm_output_ internal marker.",
        safetyFlags: [] as never[],
        sourceBound: false,
        neverUserVisible: true as const,
      },
    ],
  };

  const contractValidationWithLeak = validateRuntimeLLMOutputContract({
    input: draftInput,
    result: draftResultWithLeak,
  });

  const wordingGate = runRuntimeWordingGovernanceGate({
    draftResult: draftResultWithLeak,
    outputContractValidation: contractValidationWithLeak,
    scoreReport: BASE_SAFE_SCORE_REPORT,
    neverUserVisible: true,
  });

  const result = runRuntimeResponseAssemblerBridge({
    draftResult: draftResultWithLeak,
    outputContractValidation: contractValidationWithLeak,
    wordingGateResult: wordingGate,
    auditTraceValid: true,
    diagnosticEnvelopeValid: true,
    assemblyRunId: "case9-run",
    neverUserVisible: true,
  });

  assertVerdict(result, "rejected_internal_metadata_leak", failures);
  assertDiagPresent(result, "response_assembler_internal_metadata_leak_detected", failures);
  assertEq(result.eligibleForFutureUserVisibleAssembly, false, "eligibleForFutureUserVisibleAssembly", failures);
  assertInvariants(result, failures);

  return {
    caseNumber: 9,
    caseName: "internal metadata leak → rejected_internal_metadata_leak",
    passed: failures.length === 0,
    failures,
    bridgeResult: result,
    notes: ["Section with 'llm_output_' marker detected and rejected."],
  };
}

// Case 10: missing sections rejected
function case10_missingSectionsRejected(): AssemblerRegressionCaseResult {
  const failures: string[] = [];

  // Build a valid contract validation with empty sections
  const draftInput = makeDraftInput();
  const draftResult = runRuntimeLLMDraftMockAdapter(draftInput);
  const contractValidation = validateRuntimeLLMOutputContract({
    input: draftInput,
    result: draftResult,
  });

  const emptyDraftResult = {
    ...draftResult,
    sectionCandidates: [] as typeof draftResult.sectionCandidates,
  };

  // The contract validation would normally fail on empty sections with the real validator.
  // Here we use a synthetic accepted contract validation to test the bridge's own gate.
  const acceptedValidation: RuntimeLLMOutputContractValidationResult = {
    ...contractValidation,
    verdict: "accepted_for_next_gate" as const,
    acceptedForWordingGate: true,
    sectionResults: [],
    violations: [],
  };

  const wordingGate = runRuntimeWordingGovernanceGate({
    draftResult,
    outputContractValidation: acceptedValidation,
    scoreReport: BASE_SAFE_SCORE_REPORT,
    neverUserVisible: true,
  });

  const result = runRuntimeResponseAssemblerBridge({
    draftResult: emptyDraftResult,
    outputContractValidation: acceptedValidation,
    wordingGateResult: wordingGate,
    auditTraceValid: true,
    diagnosticEnvelopeValid: true,
    assemblyRunId: "case10-run",
    neverUserVisible: true,
  });

  assertVerdict(result, "rejected_missing_sections", failures);
  assertDiagPresent(result, "response_assembler_missing_sections", failures);
  assertEq(result.eligibleForFutureUserVisibleAssembly, false, "eligibleForFutureUserVisibleAssembly", failures);
  assertInvariants(result, failures);

  return {
    caseNumber: 10,
    caseName: "no section candidates → rejected_missing_sections",
    passed: failures.length === 0,
    failures,
    bridgeResult: result,
    notes: ["Empty sectionCandidates on the draft result blocks assembly."],
  };
}

// Case 11: no persistence / no saves invariants
function case11_noPersistenceNoSaves(): AssemblerRegressionCaseResult {
  const failures: string[] = [];
  const pipeline = runMockPipeline(makeDraftInput());
  const result = runRuntimeResponseAssemblerBridge(makeBridgeInput(pipeline));

  assertEq(result.persistenceUsed, false, "persistenceUsed", failures);
  assertEq(result.dnaSavePerformed, false, "dnaSavePerformed", failures);
  assertEq(result.offlineSavePerformed, false, "offlineSavePerformed", failures);
  assertDiagPresent(result, "response_assembler_no_persistence_confirmed", failures);
  assertDiagPresent(result, "response_assembler_no_dna_save_confirmed", failures);
  assertDiagPresent(result, "response_assembler_no_offline_save_confirmed", failures);

  return {
    caseNumber: 11,
    caseName: "no persistence, no DNA save, no offline save — invariants hold",
    passed: failures.length === 0,
    failures,
    bridgeResult: result,
    notes: ["persistenceUsed, dnaSavePerformed, offlineSavePerformed all literal false."],
  };
}

// Case 12: no user-visible emission invariants
function case12_noUserVisibleEmission(): AssemblerRegressionCaseResult {
  const failures: string[] = [];

  // Check on success path
  const pipeline = runMockPipeline(makeDraftInput());
  const successResult = runRuntimeResponseAssemblerBridge(makeBridgeInput(pipeline));
  assertEq(successResult.userVisibleOutputEmitted, false, "success: userVisibleOutputEmitted", failures);
  assertEq(successResult.userVisibleOutputAllowed, false, "success: userVisibleOutputAllowed", failures);
  assertDiagPresent(successResult, "response_assembler_user_visible_emission_forbidden", failures);

  // Also check on rejected path
  const draftInput = makeDraftInput();
  const draftResult = runRuntimeLLMDraftMockAdapter(draftInput);
  const rejectedValidation: RuntimeLLMOutputContractValidationResult = {
    verdict: "rejected_unsafe_draft",
    acceptedForWordingGate: false,
    acceptedForUserVisibleAssembly: false,
    sectionResults: [],
    violations: ["llm_output_unsafe_safety_flag"],
    validatedForbiddenMoves: [],
    validatedRequiredConstraints: [],
    liveLLMCalled: false,
    userVisibleOutputAllowed: false,
    neverUserVisible: true,
  };
  const rejectedResult = runRuntimeResponseAssemblerBridge({
    draftResult,
    outputContractValidation: rejectedValidation,
    wordingGateResult: ACCEPTED_WORDING_GATE,
    auditTraceValid: true,
    diagnosticEnvelopeValid: true,
    assemblyRunId: "case12-rejected-run",
    neverUserVisible: true,
  });
  assertEq(rejectedResult.userVisibleOutputEmitted, false, "rejected: userVisibleOutputEmitted", failures);
  assertEq(rejectedResult.userVisibleOutputAllowed, false, "rejected: userVisibleOutputAllowed", failures);
  assertEq(rejectedResult.neverUserVisible, true, "rejected: neverUserVisible", failures);

  return {
    caseNumber: 12,
    caseName: "userVisibleOutputEmitted/Allowed always false — both success and rejected paths",
    passed: failures.length === 0,
    failures,
    notes: [
      "userVisibleOutputEmitted: false on all paths.",
      "userVisibleOutputAllowed: false on all paths.",
    ],
  };
}

// Case 13: live path with valid proof assembles internal candidate
function case13_liveSandboxPathAssembles(): AssemblerRegressionCaseResult {
  const failures: string[] = [];

  const liveSandboxResult: RuntimeLiveLLMSandboxDraftCandidateResult = {
    sandboxRunId: "8.2g-6-case13-run",
    adapterMode: "future_live_llm",
    accessTier: "free_preview",
    fixtureId: "8.2g-6-case13-fixture",
    sectionCandidates: [
      {
        sectionType: "document_type_signal",
        draftText: `${LIVE_SANDBOX_DRAFT_TEXT_PREFIX} Invoice type signal — synthetic.`,
        safetyFlags: [],
        sourceBound: true,
        neverUserVisible: true,
      },
      {
        sectionType: "uncertainty_notice",
        draftText: `${LIVE_SANDBOX_DRAFT_TEXT_PREFIX} Uncertainty notice — synthetic.`,
        safetyFlags: [],
        sourceBound: true,
        neverUserVisible: true,
      },
    ],
    appliedForbiddenMoves: [],
    appliedRequiredConstraints: [],
    liveLLMCalled: true,
    userVisibleOutputAllowed: false,
    neverUserVisible: true,
    sandboxGuardProof: LIVE_PROOF,
    modelingGapNote: "Phase 8.2G-5A resolved.",
  };

  const case13ContractInput = {
    adapterMode: "future_live_llm" as const,
    accessTier: "free_preview" as const,
    contractRef: "8.2g-6-case13-contract",
    allowedSectionTypes: ["document_type_signal", "uncertainty_notice"] as const,
    activeForbiddenMoves: [] as const,
    activeRequiredConstraints: [] as const,
    uncertaintyRequired: false,
    humanReviewRequired: false,
    auditTraceParentIds: [] as const,
    neverUserVisible: true as const,
  };

  const liveContractValidation = validateRuntimeLLMOutputContract({
    input: case13ContractInput,
    result: liveSandboxResult,
  });

  // Phase 8.2G-6A: live path now flows through wording gate natively
  const case13WordingGate = runRuntimeWordingGovernanceGate({
    draftResult: liveSandboxResult,
    outputContractValidation: liveContractValidation,
    scoreReport: BASE_SAFE_SCORE_REPORT,
    neverUserVisible: true,
  });

  const result = runRuntimeResponseAssemblerBridge({
    draftResult: liveSandboxResult,
    outputContractValidation: liveContractValidation,
    wordingGateResult: case13WordingGate,
    auditTraceValid: true,
    diagnosticEnvelopeValid: true,
    assemblyRunId: "8.2g-6-case13-assembly",
    neverUserVisible: true,
  });

  assertVerdict(result, "assembled_internal_candidate", failures);
  assertEq(result.eligibleForFutureUserVisibleAssembly, true, "eligibleForFutureUserVisibleAssembly", failures);
  assertEq(result.liveLLMCalled, true, "liveLLMCalled should be true (live path)", failures);
  assertEq(result.userVisibleOutputEmitted, false, "userVisibleOutputEmitted", failures);
  assertEq(result.sectionCandidates.length, 2, "2 section candidates", failures);
  assertInvariants(result, failures);

  return {
    caseNumber: 13,
    caseName: "live sandbox path with valid proof → assembled_internal_candidate (native wording gate via Phase 8.2G-6A)",
    passed: failures.length === 0,
    failures,
    bridgeResult: result,
    notes: [
      "First confirmed live sandbox full native pipeline: contract validator → wording gate → assembler bridge.",
      "Phase 8.2G-6A: runRuntimeWordingGovernanceGate() used natively — no synthesized gate result.",
      "liveLLMCalled:true; userVisibleOutputEmitted:false; eligibleForFutureUserVisibleAssembly:true.",
    ],
  };
}

// Case 14: assembler section candidates only contain allowed fields
function case14_sectionCandidatesNoInternalObjects(): AssemblerRegressionCaseResult {
  const failures: string[] = [];
  const pipeline = runMockPipeline(makeDraftInput());
  const result = runRuntimeResponseAssemblerBridge(makeBridgeInput(pipeline));

  if (result.verdict !== "assembled_internal_candidate") {
    return {
      caseNumber: 14,
      caseName: "section candidates contain only allowed fields",
      passed: false,
      failures: [`Prerequisite failed: expected assembled_internal_candidate, got ${result.verdict}`],
    };
  }

  for (const sc of result.sectionCandidates) {
    const keys = Object.keys(sc);
    const allowedKeys = [
      "sectionKind",
      "textCandidate",
      "sourceSectionType",
      "derivedFromDraftId",
      "internalDraftPrefixRemoved",
      "containsInternalMetadata",
      "neverUserVisible",
      "notes",
    ];
    const disallowed = keys.filter((k) => !allowedKeys.includes(k));
    if (disallowed.length > 0) {
      fail(`Section candidate has unexpected keys: ${disallowed.join(", ")}`, failures);
    }
    const scRaw = sc as unknown as Record<string, unknown>;
    // Check no raw diagnostic or audit objects are present
    if (typeof scRaw["diagnostics"] !== "undefined") {
      fail("Section candidate must not contain 'diagnostics'", failures);
    }
    if (typeof scRaw["safetyFlags"] !== "undefined") {
      fail("Section candidate must not contain 'safetyFlags'", failures);
    }
    if (typeof scRaw["sandboxGuardProof"] !== "undefined") {
      fail("Section candidate must not contain 'sandboxGuardProof'", failures);
    }
    if (typeof scRaw["auditTrace"] !== "undefined") {
      fail("Section candidate must not contain 'auditTrace'", failures);
    }
  }

  assertInvariants(result, failures);

  return {
    caseNumber: 14,
    caseName: "section candidates contain only allowed governance fields — no raw audit/proof/diagnostic objects",
    passed: failures.length === 0,
    failures,
    bridgeResult: result,
    notes: [
      "Section candidates are clean: sectionKind, textCandidate, sourceSectionType, derivedFromDraftId, internalDraftPrefixRemoved, containsInternalMetadata, neverUserVisible, notes only.",
    ],
  };
}

// ── Scaffold ──────────────────────────────────────────────────────────────────

/**
 * Runs all 14 regression cases for Phase 8.2G-6.
 *
 * No persistence. No logging. No real user input. No live LLM call. No API key.
 */
export function runResponseAssemblerBridgeRegressionScaffold(): AssemblerRegressionScaffoldResult {
  const caseResults: AssemblerRegressionCaseResult[] = [
    case1_safeMockPathAssembles(),
    case2_outputContractRejected(),
    case3_wordingHardFail(),
    case4_humanReviewRequired(),
    case5_auditTraceInvalid(),
    case6_diagnosticEnvelopeInvalid(),
    case7_mockPrefixStripped(),
    case8_liveSandboxPrefixStripped(),
    case9_internalMetadataLeakRejected(),
    case10_missingSectionsRejected(),
    case11_noPersistenceNoSaves(),
    case12_noUserVisibleEmission(),
    case13_liveSandboxPathAssembles(),
    case14_sectionCandidatesNoInternalObjects(),
  ];

  const passCount = caseResults.filter((c) => c.passed).length;
  const failCount = caseResults.length - passCount;
  const allPassed = failCount === 0;

  return {
    scaffoldVersion: RESPONSE_ASSEMBLER_REGRESSION_SCAFFOLD_VERSION,
    allPassed,
    passCount,
    failCount,
    caseResults,
    notes: [
      `Phase 8.2G-6 — Response Assembler Bridge regression scaffold.`,
      `Assembler version: ${RUNTIME_RESPONSE_ASSEMBLER_BRIDGE_VERSION}.`,
      "14 cases: mock path, live sandbox path, gating rules, prefix stripping, metadata leak, invariants.",
      "No Jest, no Vitest, no CI hook. No live LLM call. No API key required.",
      "No Smart Talk wiring. No user-visible output. No persistence.",
      `All cases passed: ${String(allPassed)} (${String(passCount)}/${String(caseResults.length)}).`,
    ],
  };
}
