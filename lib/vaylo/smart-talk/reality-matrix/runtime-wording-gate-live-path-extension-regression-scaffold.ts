/**
 * Wording Gate Live Path Extension regression scaffold (Phase 8.2G-6A).
 *
 * Validates that `runRuntimeWordingGovernanceGate` now accepts live sandbox
 * draft results natively — i.e. `RuntimeLLMOutputContractDraftResult` sourced
 * from `RuntimeLiveLLMSandboxDraftCandidateResult` (Phase 8.2G-5/8.2G-5A) can
 * flow through the wording gate after passing the output contract validator.
 *
 * Cases:
 *  1.  Live sandbox + valid proof + accepted contract + safe score → accepted_for_audit_dry_run
 *  2.  Live sandbox + valid proof + human review score → human_review_required
 *  3.  Live sandbox + valid proof + hard fail score → hard_fail_wording_violation
 *  4.  Live sandbox + output contract rejected → rejected_previous_gate_failed
 *  5.  Live sandbox + missing score report → rejected_missing_score_report
 *  6.  Live sandbox + invalid score report → rejected_invalid_score_report
 *  7.  Live sandbox section results preserve neverUserVisible: true
 *  8.  Live sandbox gate does not semantically inspect draftText (realTextSemanticallyEvaluated false)
 *  9.  Live sandbox gate does not call judge (liveLLMJudgeCalled false)
 * 10.  Live sandbox gate never authorises user-visible assembly (acceptedForUserVisibleAssembly false)
 *
 * No Jest/Vitest. No CI hook. No live LLM call. No API key required.
 *
 * Safety guarantees:
 * - no LLM called
 * - no LLM judge called
 * - no NLP
 * - no API keys or env vars
 * - no user-visible output
 * - no persistence
 */

import { validateRuntimeLLMOutputContract } from "./validate-runtime-llm-output-contract";
import { runRuntimeWordingGovernanceGate } from "./run-runtime-wording-governance-gate";
import {
  BASE_SAFE_SCORE_REPORT,
  BASE_HUMAN_REVIEW_SCORE_REPORT,
  BASE_HARD_FAIL_LEGAL_ADVICE_SCORE_REPORT,
  INVALID_SCORE_REPORT,
} from "./runtime-wording-governance-gate-regression-scaffold";
import type { RuntimeWordingGateResult, RuntimeWordingGateVerdict } from "./runtime-wording-governance-gate-types";
import type { RuntimeLLMDraftAdapterInput } from "./runtime-llm-draft-adapter-types";
import type { RuntimeLiveLLMSandboxDraftCandidateResult } from "./runtime-live-llm-sandbox-types";
import type { RuntimeLiveSandboxGuardProof } from "./runtime-live-path-type-extension-types";
import { LIVE_SANDBOX_DRAFT_TEXT_PREFIX } from "./runtime-live-path-type-extension-types";

export const WORDING_GATE_LIVE_PATH_SCAFFOLD_VERSION =
  "8.2g-6a-wording-gate-live-path-extension-regression-v1";

// ── Result types ──────────────────────────────────────────────────────────────

export interface WordingGateLivePathCaseResult {
  readonly caseNumber: number;
  readonly caseName: string;
  readonly passed: boolean;
  readonly failures: readonly string[];
  readonly gateResult?: RuntimeWordingGateResult;
  readonly notes?: readonly string[];
}

export interface WordingGateLivePathScaffoldResult {
  readonly scaffoldVersion: string;
  readonly allPassed: boolean;
  readonly passCount: number;
  readonly failCount: number;
  readonly caseResults: readonly WordingGateLivePathCaseResult[];
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
  gr: RuntimeWordingGateResult,
  expected: RuntimeWordingGateVerdict,
  failures: string[],
): void {
  assertEq(gr.verdict, expected, "verdict", failures);
}

function assertInvariants(gr: RuntimeWordingGateResult, failures: string[]): void {
  assertEq(gr.acceptedForUserVisibleAssembly, false, "acceptedForUserVisibleAssembly", failures);
  assertEq(gr.liveLLMJudgeCalled, false, "liveLLMJudgeCalled", failures);
  assertEq(gr.realTextSemanticallyEvaluated, false, "realTextSemanticallyEvaluated", failures);
  assertEq(gr.userVisibleOutputAllowed, false, "userVisibleOutputAllowed", failures);
  assertEq(gr.neverUserVisible, true, "neverUserVisible", failures);
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

const LIVE_PROOF: RuntimeLiveSandboxGuardProof = {
  proofKind: "live_llm_sandbox_guard_proof",
  status: "proven",
  sandboxRunId: "8.2g-6a-scaffold-sandbox-001",
  fixtureId: "8.2g-6a-scaffold-fixture-001",
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
  notes: ["Phase 8.2G-6A scaffold live proof fixture."],
};

function makeLiveSandboxDraftCandidate(
  overrides: Partial<RuntimeLiveLLMSandboxDraftCandidateResult> = {},
): RuntimeLiveLLMSandboxDraftCandidateResult {
  return {
    sandboxRunId: "8.2g-6a-scaffold-sandbox-001",
    adapterMode: "future_live_llm",
    accessTier: "free_preview",
    fixtureId: "8.2g-6a-scaffold-fixture-001",
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
    ...overrides,
  };
}

const LIVE_CONTRACT_INPUT: RuntimeLLMDraftAdapterInput = {
  adapterMode: "future_live_llm",
  accessTier: "free_preview",
  contractRef: "8.2g-6a-scaffold-contract",
  allowedSectionTypes: ["document_type_signal", "uncertainty_notice"],
  activeForbiddenMoves: [],
  activeRequiredConstraints: [],
  uncertaintyRequired: false,
  humanReviewRequired: false,
  auditTraceParentIds: [],
  neverUserVisible: true,
};

// ── Cases ─────────────────────────────────────────────────────────────────────

// Case 1: live sandbox + valid proof + accepted contract + safe score → accepted
function case1_livePathSafeApproved(): WordingGateLivePathCaseResult {
  const failures: string[] = [];
  const draft = makeLiveSandboxDraftCandidate();
  const contractValidation = validateRuntimeLLMOutputContract({
    input: LIVE_CONTRACT_INPUT,
    result: draft,
  });
  const gateResult = runRuntimeWordingGovernanceGate({
    draftResult: draft,
    outputContractValidation: contractValidation,
    scoreReport: BASE_SAFE_SCORE_REPORT,
    neverUserVisible: true,
  });

  assertVerdict(gateResult, "accepted_for_audit_dry_run", failures);
  assertEq(gateResult.acceptedForAuditDryRun, true, "acceptedForAuditDryRun", failures);
  assertInvariants(gateResult, failures);

  return {
    caseNumber: 1,
    caseName: "live sandbox + valid proof + accepted contract + safe score → accepted_for_audit_dry_run",
    passed: failures.length === 0,
    failures,
    gateResult,
    notes: ["First native live sandbox path through wording gate."],
  };
}

// Case 2: live sandbox + human review score → human_review_required
function case2_livePathHumanReview(): WordingGateLivePathCaseResult {
  const failures: string[] = [];
  const draft = makeLiveSandboxDraftCandidate();
  const contractValidation = validateRuntimeLLMOutputContract({
    input: LIVE_CONTRACT_INPUT,
    result: draft,
  });
  const gateResult = runRuntimeWordingGovernanceGate({
    draftResult: draft,
    outputContractValidation: contractValidation,
    scoreReport: BASE_HUMAN_REVIEW_SCORE_REPORT,
    neverUserVisible: true,
  });

  assertVerdict(gateResult, "human_review_required", failures);
  assertEq(gateResult.acceptedForAuditDryRun, false, "acceptedForAuditDryRun", failures);
  assertEq(gateResult.acceptedForUserVisibleAssembly, false, "acceptedForUserVisibleAssembly", failures);
  assertInvariants(gateResult, failures);

  return {
    caseNumber: 2,
    caseName: "live sandbox + human review score → human_review_required",
    passed: failures.length === 0,
    failures,
    gateResult,
    notes: ["confusingAmbiguity 50 > 40 triggers human review on live path."],
  };
}

// Case 3: live sandbox + hard fail score → hard_fail_wording_violation
function case3_livePathHardFail(): WordingGateLivePathCaseResult {
  const failures: string[] = [];
  const draft = makeLiveSandboxDraftCandidate();
  const contractValidation = validateRuntimeLLMOutputContract({
    input: LIVE_CONTRACT_INPUT,
    result: draft,
  });
  const gateResult = runRuntimeWordingGovernanceGate({
    draftResult: draft,
    outputContractValidation: contractValidation,
    scoreReport: BASE_HARD_FAIL_LEGAL_ADVICE_SCORE_REPORT,
    neverUserVisible: true,
  });

  assertVerdict(gateResult, "hard_fail_wording_violation", failures);
  assertEq(gateResult.acceptedForAuditDryRun, false, "acceptedForAuditDryRun", failures);
  assertInvariants(gateResult, failures);

  return {
    caseNumber: 3,
    caseName: "live sandbox + hard fail score (authoritativeLegalAdvice > 0) → hard_fail_wording_violation",
    passed: failures.length === 0,
    failures,
    gateResult,
    notes: ["authoritativeLegalAdvice 10 > 0 triggers hard fail on live path."],
  };
}

// Case 4: live sandbox + output contract rejected → rejected_previous_gate_failed
function case4_livePathContractRejected(): WordingGateLivePathCaseResult {
  const failures: string[] = [];
  const draft = makeLiveSandboxDraftCandidate({
    // Missing proof → output contract validator will reject
    sandboxGuardProof: undefined as unknown as RuntimeLiveSandboxGuardProof,
  });
  const contractValidation = validateRuntimeLLMOutputContract({
    input: LIVE_CONTRACT_INPUT,
    result: draft,
  });
  // contractValidation.verdict should NOT be accepted_for_next_gate (no proof)
  const gateResult = runRuntimeWordingGovernanceGate({
    draftResult: draft,
    outputContractValidation: contractValidation,
    scoreReport: BASE_SAFE_SCORE_REPORT,
    neverUserVisible: true,
  });

  assertVerdict(gateResult, "rejected_previous_gate_failed", failures);
  assertEq(gateResult.acceptedForAuditDryRun, false, "acceptedForAuditDryRun", failures);
  assertInvariants(gateResult, failures);

  return {
    caseNumber: 4,
    caseName: "live sandbox without valid proof → contract rejected → rejected_previous_gate_failed",
    passed: failures.length === 0,
    failures,
    gateResult,
    notes: [
      "No sandboxGuardProof → output contract validator rejects.",
      "Wording gate correctly blocks at rejected_previous_gate_failed.",
    ],
  };
}

// Case 5: live sandbox + missing score report → rejected_missing_score_report
function case5_livePathMissingScore(): WordingGateLivePathCaseResult {
  const failures: string[] = [];
  const draft = makeLiveSandboxDraftCandidate();
  const contractValidation = validateRuntimeLLMOutputContract({
    input: LIVE_CONTRACT_INPUT,
    result: draft,
  });
  const gateResult = runRuntimeWordingGovernanceGate({
    draftResult: draft,
    outputContractValidation: contractValidation,
    scoreReport: null,
    neverUserVisible: true,
  });

  assertVerdict(gateResult, "rejected_missing_score_report", failures);
  assertEq(gateResult.acceptedForAuditDryRun, false, "acceptedForAuditDryRun", failures);
  assertInvariants(gateResult, failures);

  return {
    caseNumber: 5,
    caseName: "live sandbox + null score report → rejected_missing_score_report",
    passed: failures.length === 0,
    failures,
    gateResult,
  };
}

// Case 6: live sandbox + invalid score report → rejected_invalid_score_report
function case6_livePathInvalidScore(): WordingGateLivePathCaseResult {
  const failures: string[] = [];
  const draft = makeLiveSandboxDraftCandidate();
  const contractValidation = validateRuntimeLLMOutputContract({
    input: LIVE_CONTRACT_INPUT,
    result: draft,
  });
  const gateResult = runRuntimeWordingGovernanceGate({
    draftResult: draft,
    outputContractValidation: contractValidation,
    scoreReport: INVALID_SCORE_REPORT,
    neverUserVisible: true,
  });

  assertVerdict(gateResult, "rejected_invalid_score_report", failures);
  assertEq(gateResult.acceptedForAuditDryRun, false, "acceptedForAuditDryRun", failures);
  assertInvariants(gateResult, failures);

  return {
    caseNumber: 6,
    caseName: "live sandbox + structurally invalid score report → rejected_invalid_score_report",
    passed: failures.length === 0,
    failures,
    gateResult,
  };
}

// Case 7: live sandbox section results all have neverUserVisible true
function case7_liveSectionResultsNeverUserVisible(): WordingGateLivePathCaseResult {
  const failures: string[] = [];
  const draft = makeLiveSandboxDraftCandidate();
  const contractValidation = validateRuntimeLLMOutputContract({
    input: LIVE_CONTRACT_INPUT,
    result: draft,
  });
  const gateResult = runRuntimeWordingGovernanceGate({
    draftResult: draft,
    outputContractValidation: contractValidation,
    scoreReport: BASE_SAFE_SCORE_REPORT,
    neverUserVisible: true,
  });

  for (const sr of gateResult.sectionResults) {
    if (sr.neverUserVisible !== true) {
      fail(`Section ${sr.sectionType} has neverUserVisible !== true`, failures);
    }
  }
  if (gateResult.sectionResults.length !== 2) {
    fail(`Expected 2 section results, got ${String(gateResult.sectionResults.length)}`, failures);
  }
  assertInvariants(gateResult, failures);

  return {
    caseNumber: 7,
    caseName: "live sandbox section results all neverUserVisible: true",
    passed: failures.length === 0,
    failures,
    gateResult,
    notes: ["neverUserVisible: true preserved on every per-section result."],
  };
}

// Case 8: gate does not semantically evaluate draftText (realTextSemanticallyEvaluated false)
function case8_noSemanticEvaluation(): WordingGateLivePathCaseResult {
  const failures: string[] = [];
  const draft = makeLiveSandboxDraftCandidate();
  const contractValidation = validateRuntimeLLMOutputContract({
    input: LIVE_CONTRACT_INPUT,
    result: draft,
  });
  const gateResult = runRuntimeWordingGovernanceGate({
    draftResult: draft,
    outputContractValidation: contractValidation,
    scoreReport: BASE_SAFE_SCORE_REPORT,
    neverUserVisible: true,
  });

  assertEq(gateResult.realTextSemanticallyEvaluated, false, "realTextSemanticallyEvaluated", failures);
  const diag = gateResult.diagnostics.includes("wording_gate_draft_text_not_evaluated_semantically");
  if (!diag) {
    fail("Expected 'wording_gate_draft_text_not_evaluated_semantically' diagnostic", failures);
  }

  return {
    caseNumber: 8,
    caseName: "live sandbox gate does not semantically evaluate draftText",
    passed: failures.length === 0,
    failures,
    gateResult,
    notes: ["realTextSemanticallyEvaluated: false — gate operates on score report metadata only."],
  };
}

// Case 9: gate does not call a judge (liveLLMJudgeCalled false)
function case9_noLiveJudge(): WordingGateLivePathCaseResult {
  const failures: string[] = [];
  const draft = makeLiveSandboxDraftCandidate();
  const contractValidation = validateRuntimeLLMOutputContract({
    input: LIVE_CONTRACT_INPUT,
    result: draft,
  });
  const gateResult = runRuntimeWordingGovernanceGate({
    draftResult: draft,
    outputContractValidation: contractValidation,
    scoreReport: BASE_SAFE_SCORE_REPORT,
    neverUserVisible: true,
  });

  assertEq(gateResult.liveLLMJudgeCalled, false, "liveLLMJudgeCalled", failures);

  return {
    caseNumber: 9,
    caseName: "live sandbox gate does not call a live LLM judge (liveLLMJudgeCalled: false)",
    passed: failures.length === 0,
    failures,
    gateResult,
    notes: ["No LLM judge. No NLP. Evaluation is entirely metadata-based."],
  };
}

// Case 10: gate never authorises user-visible assembly (acceptedForUserVisibleAssembly false)
function case10_neverUserVisibleAssembly(): WordingGateLivePathCaseResult {
  const failures: string[] = [];
  const draft = makeLiveSandboxDraftCandidate();
  const contractValidation = validateRuntimeLLMOutputContract({
    input: LIVE_CONTRACT_INPUT,
    result: draft,
  });

  // Test on accepted path
  const acceptedResult = runRuntimeWordingGovernanceGate({
    draftResult: draft,
    outputContractValidation: contractValidation,
    scoreReport: BASE_SAFE_SCORE_REPORT,
    neverUserVisible: true,
  });
  assertEq(acceptedResult.acceptedForUserVisibleAssembly, false, "accepted: acceptedForUserVisibleAssembly", failures);
  assertEq(acceptedResult.userVisibleOutputAllowed, false, "accepted: userVisibleOutputAllowed", failures);

  // Also test on rejected path
  const rejectedResult = runRuntimeWordingGovernanceGate({
    draftResult: draft,
    outputContractValidation: contractValidation,
    scoreReport: BASE_HARD_FAIL_LEGAL_ADVICE_SCORE_REPORT,
    neverUserVisible: true,
  });
  assertEq(rejectedResult.acceptedForUserVisibleAssembly, false, "rejected: acceptedForUserVisibleAssembly", failures);
  assertEq(rejectedResult.userVisibleOutputAllowed, false, "rejected: userVisibleOutputAllowed", failures);

  return {
    caseNumber: 10,
    caseName: "live sandbox gate never authorises user-visible assembly on any verdict",
    passed: failures.length === 0,
    failures,
    notes: [
      "acceptedForUserVisibleAssembly: false on accepted and rejected paths.",
      "userVisibleOutputAllowed: false on all paths.",
      "Phase 8.2G-7+ required to authorise actual display.",
    ],
  };
}

// ── Scaffold ──────────────────────────────────────────────────────────────────

/**
 * Runs all 10 regression cases for Phase 8.2G-6A live path extension.
 *
 * No persistence. No logging. No real user input. No live LLM call. No API key.
 */
export function runWordingGateLivePathExtensionRegressionScaffold(): WordingGateLivePathScaffoldResult {
  const caseResults: WordingGateLivePathCaseResult[] = [
    case1_livePathSafeApproved(),
    case2_livePathHumanReview(),
    case3_livePathHardFail(),
    case4_livePathContractRejected(),
    case5_livePathMissingScore(),
    case6_livePathInvalidScore(),
    case7_liveSectionResultsNeverUserVisible(),
    case8_noSemanticEvaluation(),
    case9_noLiveJudge(),
    case10_neverUserVisibleAssembly(),
  ];

  const passCount = caseResults.filter((c) => c.passed).length;
  const failCount = caseResults.length - passCount;
  const allPassed = failCount === 0;

  return {
    scaffoldVersion: WORDING_GATE_LIVE_PATH_SCAFFOLD_VERSION,
    allPassed,
    passCount,
    failCount,
    caseResults,
    notes: [
      "Phase 8.2G-6A — Wording Gate Live Path Extension regression scaffold.",
      "10 cases covering all live sandbox wording gate paths.",
      "No Jest, no Vitest, no CI hook. No live LLM call. No API key required.",
      "RuntimeWordingGateInput.draftResult now accepts RuntimeLLMOutputContractDraftResult.",
      "Mock path behavior unchanged — see runtime-wording-governance-gate-regression-scaffold.ts.",
      `All cases passed: ${String(allPassed)} (${String(passCount)}/${String(caseResults.length)}).`,
    ],
  };
}
