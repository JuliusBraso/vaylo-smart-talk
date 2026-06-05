/**
 * Regression scaffold for the Runtime Wording Governance Gate (Phase 8.2G-3).
 * Updated in Phase 8.2G-6A: RuntimeWordingGateInput.draftResult now accepts
 * RuntimeLLMOutputContractDraftResult (the wider union interface). Existing mock
 * cases remain unchanged because RuntimeLLMDraftAdapterResult is structurally
 * compatible with RuntimeLLMOutputContractDraftResult. Live sandbox path cases
 * are covered by runtime-wording-gate-live-path-extension-regression-scaffold.ts.
 *
 * Runs 12 cases covering:
 *  - happy path: safe score report → accepted_for_audit_dry_run
 *  - previous gate failure blocking wording evaluation
 *  - missing and invalid score reports
 *  - unattested attestation handling
 *  - human_review_required paths (confusingAmbiguity, low clarity)
 *  - hard_fail paths (legal advice, false reassurance, panic)
 *  - neverUserVisible invariant preservation
 *  - user-visible assembly always false
 *  - no live judge called
 *
 * Uses the full pipeline: runRuntimeLLMDraftMockAdapter → validateRuntimeLLMOutputContract
 * → runRuntimeWordingGovernanceGate, with pre-built score report fixtures.
 *
 * No Jest/Vitest. No CI hook. Pure in-memory validation.
 *
 * Safety guarantees:
 * - no LLM called
 * - no LLM judge called
 * - no NLP
 * - no API keys or env vars
 * - no user-visible output
 * - no external dependencies
 */

import { MOCK_UNSAFE_FIXTURE_CONTRACT_REF, runRuntimeLLMDraftMockAdapter } from "./run-runtime-llm-draft-mock-adapter";
import { validateRuntimeLLMOutputContract } from "./validate-runtime-llm-output-contract";
import {
  RUNTIME_WORDING_GOVERNANCE_GATE_VERSION,
  runRuntimeWordingGovernanceGate,
} from "./run-runtime-wording-governance-gate";
import type {
  RuntimeWordingGateDiagnosticCode,
  RuntimeWordingGateInput,
  RuntimeWordingGateResult,
  RuntimeWordingGateVerdict,
} from "./runtime-wording-governance-gate-types";
import type {
  RuntimeLLMDraftAdapterInput,
  RuntimeLLMDraftAdapterResult,
} from "./runtime-llm-draft-adapter-types";
import type { RuntimeLLMOutputContractValidationResult } from "./runtime-llm-output-contract-validator-types";
import type { WordingToneScoreReport } from "./reality-simulation/wording-evaluation-types";

export const REGRESSION_SCAFFOLD_VERSION =
  "8.2g-3-runtime-wording-governance-gate-regression-v1";

// ── Score report fixtures ─────────────────────────────────────────────────────

/** Safe score report — empatheticClarity 80, all risk scores 0. Produces `approved`. */
export const BASE_SAFE_SCORE_REPORT: WordingToneScoreReport = {
  reportId: "8.2g-3-safe-score-001",
  sourceKind: "synthetic_metadata",
  attestationStatus: "test_fixture_attested",
  toneMatrix: {
    authoritativeLegalAdvice: 0,
    falseReassurance: 0,
    panicInducing: 0,
    manipulative: 0,
    confusingAmbiguity: 0,
    empatheticClarity: 80,
  },
  evaluatorId: "8.2g-3-fixture-evaluator",
  evaluatorVersion: "v1",
  generatedBy: "runtime-wording-governance-gate-regression-scaffold",
  neverUserVisible: true,
  notes: ["Safe fixture — all risk scores zero, high clarity. Expected: approved."],
};

/** Human review report — confusingAmbiguity > 40. Produces `human_review_required`. */
export const BASE_HUMAN_REVIEW_SCORE_REPORT: WordingToneScoreReport = {
  reportId: "8.2g-3-human-review-score-001",
  sourceKind: "synthetic_metadata",
  attestationStatus: "test_fixture_attested",
  toneMatrix: {
    authoritativeLegalAdvice: 0,
    falseReassurance: 0,
    panicInducing: 0,
    manipulative: 0,
    confusingAmbiguity: 50,
    empatheticClarity: 80,
  },
  evaluatorId: "8.2g-3-fixture-evaluator",
  evaluatorVersion: "v1",
  generatedBy: "runtime-wording-governance-gate-regression-scaffold",
  neverUserVisible: true,
  notes: ["confusingAmbiguity 50 > 40. Expected: human_review_required."],
};

/** Hard fail — authoritativeLegalAdvice > 0. Produces `hard_fail_tone_violation`. */
export const BASE_HARD_FAIL_LEGAL_ADVICE_SCORE_REPORT: WordingToneScoreReport = {
  reportId: "8.2g-3-hard-fail-legal-score-001",
  sourceKind: "synthetic_metadata",
  attestationStatus: "test_fixture_attested",
  toneMatrix: {
    authoritativeLegalAdvice: 10,
    falseReassurance: 0,
    panicInducing: 0,
    manipulative: 0,
    confusingAmbiguity: 0,
    empatheticClarity: 80,
  },
  evaluatorId: "8.2g-3-fixture-evaluator",
  evaluatorVersion: "v1",
  generatedBy: "runtime-wording-governance-gate-regression-scaffold",
  neverUserVisible: true,
  notes: ["authoritativeLegalAdvice 10 > 0. Expected: hard_fail_tone_violation."],
};

/** Hard fail — falseReassurance > 0. Produces `hard_fail_tone_violation`. */
export const BASE_HARD_FAIL_REASSURANCE_SCORE_REPORT: WordingToneScoreReport = {
  reportId: "8.2g-3-hard-fail-reassurance-score-001",
  sourceKind: "synthetic_metadata",
  attestationStatus: "test_fixture_attested",
  toneMatrix: {
    authoritativeLegalAdvice: 0,
    falseReassurance: 5,
    panicInducing: 0,
    manipulative: 0,
    confusingAmbiguity: 0,
    empatheticClarity: 80,
  },
  evaluatorId: "8.2g-3-fixture-evaluator",
  evaluatorVersion: "v1",
  generatedBy: "runtime-wording-governance-gate-regression-scaffold",
  neverUserVisible: true,
  notes: ["falseReassurance 5 > 0. Expected: hard_fail_tone_violation."],
};

/** Hard fail — panicInducing > 30. Produces `hard_fail_tone_violation`. */
export const BASE_HARD_FAIL_PANIC_SCORE_REPORT: WordingToneScoreReport = {
  reportId: "8.2g-3-hard-fail-panic-score-001",
  sourceKind: "synthetic_metadata",
  attestationStatus: "test_fixture_attested",
  toneMatrix: {
    authoritativeLegalAdvice: 0,
    falseReassurance: 0,
    panicInducing: 50,
    manipulative: 0,
    confusingAmbiguity: 0,
    empatheticClarity: 80,
  },
  evaluatorId: "8.2g-3-fixture-evaluator",
  evaluatorVersion: "v1",
  generatedBy: "runtime-wording-governance-gate-regression-scaffold",
  neverUserVisible: true,
  notes: ["panicInducing 50 > 30. Expected: hard_fail_tone_violation."],
};

/** Unattested safe report — same scores as safe, attestationStatus 'unattested'. */
export const BASE_UNATTESTED_SAFE_SCORE_REPORT: WordingToneScoreReport = {
  ...BASE_SAFE_SCORE_REPORT,
  reportId: "8.2g-3-unattested-safe-score-001",
  attestationStatus: "unattested",
  notes: [
    "Unattested fixture — same safe scores, but attestationStatus is unattested.",
    "Expected: approved with wording_gate_score_report_unattested diagnostic.",
  ],
};

/** Invalid report — NaN in toneMatrix. Fails structural validation. */
export const INVALID_SCORE_REPORT: WordingToneScoreReport = {
  reportId: "8.2g-3-invalid-score-001",
  sourceKind: "synthetic_metadata",
  attestationStatus: "test_fixture_attested",
  toneMatrix: {
    authoritativeLegalAdvice: NaN,
    falseReassurance: 0,
    panicInducing: 0,
    manipulative: 0,
    confusingAmbiguity: 0,
    empatheticClarity: 80,
  },
  evaluatorId: "8.2g-3-fixture-evaluator",
  evaluatorVersion: "v1",
  generatedBy: "runtime-wording-governance-gate-regression-scaffold",
  neverUserVisible: true,
  notes: ["authoritativeLegalAdvice is NaN. Expected: rejected_invalid_score_report."],
};

// ── Pipeline helpers ──────────────────────────────────────────────────────────

function makeDraftInput(
  overrides: Partial<RuntimeLLMDraftAdapterInput> = {},
): RuntimeLLMDraftAdapterInput {
  return {
    adapterMode: "mock",
    accessTier: "free_preview",
    contractRef: "test-contract-8.2g-3",
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

function runPipeline(
  draftInput: RuntimeLLMDraftAdapterInput,
): { draftResult: RuntimeLLMDraftAdapterResult; contractValidation: RuntimeLLMOutputContractValidationResult } {
  const draftResult = runRuntimeLLMDraftMockAdapter(draftInput);
  const contractValidation = validateRuntimeLLMOutputContract({
    input: draftInput,
    result: draftResult,
  });
  return { draftResult, contractValidation };
}

function makeGateInput(
  draftResult: RuntimeLLMDraftAdapterResult,
  contractValidation: RuntimeLLMOutputContractValidationResult,
  scoreReport: WordingToneScoreReport | null,
  notes?: readonly string[],
): RuntimeWordingGateInput {
  return {
    draftResult,
    outputContractValidation: contractValidation,
    scoreReport,
    neverUserVisible: true,
    notes,
  };
}

// ── Result types ──────────────────────────────────────────────────────────────

export interface GateRegressionCaseResult {
  readonly caseNumber: number;
  readonly caseName: string;
  readonly passed: boolean;
  readonly failures: readonly string[];
  readonly gateResult: RuntimeWordingGateResult | null;
  readonly notes?: readonly string[];
}

export interface GateRegressionScaffoldResult {
  readonly scaffoldVersion: string;
  readonly allPassed: boolean;
  readonly passCount: number;
  readonly failCount: number;
  readonly caseResults: readonly GateRegressionCaseResult[];
  readonly notes: readonly string[];
}

// ── Assertion helpers ─────────────────────────────────────────────────────────

function assert(condition: boolean, message: string, failures: string[]): void {
  if (!condition) failures.push(message);
}

function assertVerdict(
  gr: RuntimeWordingGateResult,
  expected: RuntimeWordingGateVerdict,
  failures: string[],
): void {
  assert(
    gr.verdict === expected,
    `Expected verdict '${expected}' but got '${gr.verdict}'.`,
    failures,
  );
}

function assertDiagnosticPresent(
  gr: RuntimeWordingGateResult,
  code: RuntimeWordingGateDiagnosticCode,
  failures: string[],
): void {
  assert(
    gr.diagnostics.includes(code),
    `Expected diagnostic '${code}' to be present.`,
    failures,
  );
}


function assertBaseInvariants(gr: RuntimeWordingGateResult, failures: string[]): void {
  assert(
    gr.acceptedForUserVisibleAssembly === false,
    "acceptedForUserVisibleAssembly must be false.",
    failures,
  );
  assert(gr.liveLLMJudgeCalled === false, "liveLLMJudgeCalled must be false.", failures);
  assert(
    gr.realTextSemanticallyEvaluated === false,
    "realTextSemanticallyEvaluated must be false.",
    failures,
  );
  assert(
    gr.userVisibleOutputAllowed === false,
    "userVisibleOutputAllowed must be false.",
    failures,
  );
  assert(gr.neverUserVisible === true, "neverUserVisible must be true.", failures);
  assertDiagnosticPresent(gr, "wording_gate_user_visible_output_still_forbidden", failures);
  assertDiagnosticPresent(gr, "wording_gate_draft_text_not_evaluated_semantically", failures);
  assertDiagnosticPresent(gr, "wording_gate_never_user_visible_preserved", failures);
}

// ── Cases ─────────────────────────────────────────────────────────────────────

function case1_safeApprovedFlow(): GateRegressionCaseResult {
  const failures: string[] = [];
  const draftInput = makeDraftInput();
  const { draftResult, contractValidation } = runPipeline(draftInput);
  const gateInput = makeGateInput(draftResult, contractValidation, BASE_SAFE_SCORE_REPORT);
  const gr = runRuntimeWordingGovernanceGate(gateInput);

  assertVerdict(gr, "accepted_for_audit_dry_run", failures);
  assert(gr.acceptedForAuditDryRun === true, "acceptedForAuditDryRun must be true.", failures);
  assert(
    gr.acceptedForUserVisibleAssembly === false,
    "acceptedForUserVisibleAssembly must be false even when approved.",
    failures,
  );
  assertDiagnosticPresent(gr, "wording_gate_accepted_for_audit_dry_run", failures);
  assert(
    gr.wordingEvaluationResult?.disposition === "approved",
    "wordingEvaluationResult.disposition must be 'approved'.",
    failures,
  );
  assert(
    gr.sectionResults.length === draftResult.sectionCandidates.length,
    "sectionResults must match sectionCandidates count.",
    failures,
  );
  assert(
    gr.sectionResults.every((sr) => sr.accepted),
    "All section results must be accepted on approved path.",
    failures,
  );
  assertBaseInvariants(gr, failures);

  return {
    caseNumber: 1,
    caseName: "safe approved flow — accepted_for_audit_dry_run",
    passed: failures.length === 0,
    failures,
    gateResult: gr,
    notes: ["Full pipeline: mock adapter → contract validator (pass) → wording gate (approved)."],
  };
}

function case2_previousOutputContractFailed(): GateRegressionCaseResult {
  const failures: string[] = [];

  // Use unsafe fixture from 8.2G-1 — produces rejected_unsafe_draft from contract validator
  const draftInput = makeDraftInput({
    contractRef: MOCK_UNSAFE_FIXTURE_CONTRACT_REF,
    allowedSectionTypes: ["document_type_signal", "what_this_means"],
  });
  const { draftResult, contractValidation } = runPipeline(draftInput);

  assert(
    contractValidation.verdict !== "accepted_for_next_gate",
    "Pre-condition: contractValidation must not be accepted_for_next_gate for this case.",
    failures,
  );

  const gateInput = makeGateInput(draftResult, contractValidation, BASE_SAFE_SCORE_REPORT);
  const gr = runRuntimeWordingGovernanceGate(gateInput);

  assertVerdict(gr, "rejected_previous_gate_failed", failures);
  assert(gr.acceptedForAuditDryRun === false, "acceptedForAuditDryRun must be false.", failures);
  assertDiagnosticPresent(gr, "wording_gate_previous_contract_not_accepted", failures);
  assert(
    gr.wordingEvaluationResult === undefined,
    "wordingEvaluationResult must be absent when previous gate failed.",
    failures,
  );
  assert(
    gr.sectionResults.length === 0,
    "sectionResults must be empty when previous gate failed.",
    failures,
  );
  assertBaseInvariants(gr, failures);

  return {
    caseNumber: 2,
    caseName: "previous output contract failed — rejected_previous_gate_failed",
    passed: failures.length === 0,
    failures,
    gateResult: gr,
    notes: [
      "Unsafe fixture from 8.2G-1 → contract validator returns rejected_unsafe_draft.",
      "Wording evaluation is skipped.",
    ],
  };
}

function case3_missingScoreReport(): GateRegressionCaseResult {
  const failures: string[] = [];
  const draftInput = makeDraftInput();
  const { draftResult, contractValidation } = runPipeline(draftInput);
  const gateInput = makeGateInput(draftResult, contractValidation, null);
  const gr = runRuntimeWordingGovernanceGate(gateInput);

  assertVerdict(gr, "rejected_missing_score_report", failures);
  assert(gr.acceptedForAuditDryRun === false, "acceptedForAuditDryRun must be false.", failures);
  assertDiagnosticPresent(gr, "wording_gate_missing_score_report", failures);
  assert(
    gr.wordingEvaluationResult === undefined,
    "wordingEvaluationResult must be absent when score report is null.",
    failures,
  );
  assertBaseInvariants(gr, failures);

  return {
    caseNumber: 3,
    caseName: "missing score report — rejected_missing_score_report",
    passed: failures.length === 0,
    failures,
    gateResult: gr,
    notes: ["scoreReport: null → rejected_missing_score_report."],
  };
}

function case4_invalidScoreReport(): GateRegressionCaseResult {
  const failures: string[] = [];
  const draftInput = makeDraftInput();
  const { draftResult, contractValidation } = runPipeline(draftInput);
  const gateInput = makeGateInput(draftResult, contractValidation, INVALID_SCORE_REPORT);
  const gr = runRuntimeWordingGovernanceGate(gateInput);

  assertVerdict(gr, "rejected_invalid_score_report", failures);
  assert(gr.acceptedForAuditDryRun === false, "acceptedForAuditDryRun must be false.", failures);
  assertDiagnosticPresent(gr, "wording_gate_invalid_score_report", failures);
  assert(
    gr.wordingEvaluationResult === undefined,
    "wordingEvaluationResult must be absent when score report is invalid.",
    failures,
  );
  assertBaseInvariants(gr, failures);

  return {
    caseNumber: 4,
    caseName: "invalid score report (NaN) — rejected_invalid_score_report",
    passed: failures.length === 0,
    failures,
    gateResult: gr,
    notes: ["NaN in toneMatrix fails validateWordingToneScoreReport → rejected_invalid_score_report."],
  };
}

function case5_unattestedSafeScoreReport(): GateRegressionCaseResult {
  const failures: string[] = [];
  const draftInput = makeDraftInput();
  const { draftResult, contractValidation } = runPipeline(draftInput);
  const gateInput = makeGateInput(
    draftResult,
    contractValidation,
    BASE_UNATTESTED_SAFE_SCORE_REPORT,
  );
  const gr = runRuntimeWordingGovernanceGate(gateInput);

  assertVerdict(gr, "accepted_for_audit_dry_run", failures);
  assert(gr.acceptedForAuditDryRun === true, "acceptedForAuditDryRun must be true.", failures);
  assertDiagnosticPresent(gr, "wording_gate_score_report_unattested", failures);
  assertDiagnosticPresent(gr, "wording_gate_accepted_for_audit_dry_run", failures);
  assert(
    gr.wordingEvaluationResult?.disposition === "approved",
    "wordingEvaluationResult.disposition must be 'approved'.",
    failures,
  );
  assertBaseInvariants(gr, failures);

  return {
    caseNumber: 5,
    caseName: "unattested safe score report — approved with unattested diagnostic",
    passed: failures.length === 0,
    failures,
    gateResult: gr,
    notes: [
      "Unattested attestation adds wording_gate_score_report_unattested but does not hard-fail.",
      "Wording evaluation still runs and returns approved.",
    ],
  };
}

function case6_humanReviewScoreReport(): GateRegressionCaseResult {
  const failures: string[] = [];
  const draftInput = makeDraftInput();
  const { draftResult, contractValidation } = runPipeline(draftInput);
  const gateInput = makeGateInput(draftResult, contractValidation, BASE_HUMAN_REVIEW_SCORE_REPORT);
  const gr = runRuntimeWordingGovernanceGate(gateInput);

  assertVerdict(gr, "human_review_required", failures);
  assert(gr.acceptedForAuditDryRun === false, "acceptedForAuditDryRun must be false.", failures);
  assertDiagnosticPresent(gr, "wording_gate_human_review_required", failures);
  assert(
    gr.wordingEvaluationResult?.disposition === "human_review_required",
    "wordingEvaluationResult.disposition must be 'human_review_required'.",
    failures,
  );
  assert(
    gr.sectionResults.every((sr) => !sr.accepted),
    "No section results accepted on human_review path.",
    failures,
  );
  assertBaseInvariants(gr, failures);

  return {
    caseNumber: 6,
    caseName: "human review score report — human_review_required",
    passed: failures.length === 0,
    failures,
    gateResult: gr,
    notes: ["confusingAmbiguity 50 > 40 → human_review_required."],
  };
}

function case7_hardFailLegalAdvice(): GateRegressionCaseResult {
  const failures: string[] = [];
  const draftInput = makeDraftInput();
  const { draftResult, contractValidation } = runPipeline(draftInput);
  const gateInput = makeGateInput(
    draftResult,
    contractValidation,
    BASE_HARD_FAIL_LEGAL_ADVICE_SCORE_REPORT,
  );
  const gr = runRuntimeWordingGovernanceGate(gateInput);

  assertVerdict(gr, "hard_fail_wording_violation", failures);
  assert(gr.acceptedForAuditDryRun === false, "acceptedForAuditDryRun must be false.", failures);
  assertDiagnosticPresent(gr, "wording_gate_hard_fail_tone_violation", failures);
  assert(
    gr.wordingEvaluationResult?.disposition === "hard_fail_tone_violation",
    "wordingEvaluationResult.disposition must be 'hard_fail_tone_violation'.",
    failures,
  );
  assert(
    gr.wordingEvaluationResult?.violations.includes("tone_authoritative_advice_detected") === true,
    "violations must include tone_authoritative_advice_detected.",
    failures,
  );
  assertBaseInvariants(gr, failures);

  return {
    caseNumber: 7,
    caseName: "hard fail — authoritativeLegalAdvice > 0",
    passed: failures.length === 0,
    failures,
    gateResult: gr,
    notes: ["authoritativeLegalAdvice 10 → zero-tolerance hard fail."],
  };
}

function case8_hardFailFalseReassurance(): GateRegressionCaseResult {
  const failures: string[] = [];
  const draftInput = makeDraftInput();
  const { draftResult, contractValidation } = runPipeline(draftInput);
  const gateInput = makeGateInput(
    draftResult,
    contractValidation,
    BASE_HARD_FAIL_REASSURANCE_SCORE_REPORT,
  );
  const gr = runRuntimeWordingGovernanceGate(gateInput);

  assertVerdict(gr, "hard_fail_wording_violation", failures);
  assertDiagnosticPresent(gr, "wording_gate_hard_fail_tone_violation", failures);
  assert(
    gr.wordingEvaluationResult?.violations.includes("tone_false_reassurance_detected") === true,
    "violations must include tone_false_reassurance_detected.",
    failures,
  );
  assertBaseInvariants(gr, failures);

  return {
    caseNumber: 8,
    caseName: "hard fail — falseReassurance > 0",
    passed: failures.length === 0,
    failures,
    gateResult: gr,
    notes: ["falseReassurance 5 → zero-tolerance hard fail."],
  };
}

function case9_hardFailPanic(): GateRegressionCaseResult {
  const failures: string[] = [];
  const draftInput = makeDraftInput();
  const { draftResult, contractValidation } = runPipeline(draftInput);
  const gateInput = makeGateInput(
    draftResult,
    contractValidation,
    BASE_HARD_FAIL_PANIC_SCORE_REPORT,
  );
  const gr = runRuntimeWordingGovernanceGate(gateInput);

  assertVerdict(gr, "hard_fail_wording_violation", failures);
  assertDiagnosticPresent(gr, "wording_gate_hard_fail_tone_violation", failures);
  assert(
    gr.wordingEvaluationResult?.violations.includes("tone_panic_inducing_detected") === true,
    "violations must include tone_panic_inducing_detected.",
    failures,
  );
  assertBaseInvariants(gr, failures);

  return {
    caseNumber: 9,
    caseName: "hard fail — panicInducing > 30",
    passed: failures.length === 0,
    failures,
    gateResult: gr,
    notes: ["panicInducing 50 > 30 → panic guard hard fail."],
  };
}

function case10_sectionResultsPreserveNeverUserVisible(): GateRegressionCaseResult {
  const failures: string[] = [];
  const draftInput = makeDraftInput({
    allowedSectionTypes: [
      "document_type_signal",
      "what_this_means",
      "uncertainty_notice",
      "review_recommendation",
    ],
  });
  const { draftResult, contractValidation } = runPipeline(draftInput);
  const gateInput = makeGateInput(draftResult, contractValidation, BASE_SAFE_SCORE_REPORT);
  const gr = runRuntimeWordingGovernanceGate(gateInput);

  assert(gr.sectionResults.length === 4, "Expected 4 section results.", failures);
  for (const sr of gr.sectionResults) {
    assert(
      sr.neverUserVisible === true,
      `Section '${sr.sectionType}' neverUserVisible must be true.`,
      failures,
    );
    assert(
      sr.diagnostics.includes("wording_gate_never_user_visible_preserved"),
      `Section '${sr.sectionType}' must include wording_gate_never_user_visible_preserved.`,
      failures,
    );
    assert(
      sr.diagnostics.includes("wording_gate_draft_text_not_evaluated_semantically"),
      `Section '${sr.sectionType}' must include wording_gate_draft_text_not_evaluated_semantically.`,
      failures,
    );
  }
  assertBaseInvariants(gr, failures);

  return {
    caseNumber: 10,
    caseName: "section results — all preserve neverUserVisible and invariant diagnostics",
    passed: failures.length === 0,
    failures,
    gateResult: gr,
    notes: [
      "4 sections all carry neverUserVisible: true and invariant diagnostics.",
      "draftText is not semantically evaluated in any section.",
    ],
  };
}

function case11_userVisibleAssemblyAlwaysForbidden(): GateRegressionCaseResult {
  const failures: string[] = [];

  // Run all verdict paths and confirm acceptedForUserVisibleAssembly is always false.
  const pipelines = [
    { input: makeDraftInput(), score: BASE_SAFE_SCORE_REPORT, label: "approved" },
    { input: makeDraftInput(), score: BASE_HUMAN_REVIEW_SCORE_REPORT, label: "human_review" },
    { input: makeDraftInput(), score: BASE_HARD_FAIL_LEGAL_ADVICE_SCORE_REPORT, label: "hard_fail" },
    { input: makeDraftInput(), score: null, label: "missing_score" },
  ];

  for (const { input, score, label } of pipelines) {
    const { draftResult, contractValidation } = runPipeline(input);
    const gateInput = makeGateInput(draftResult, contractValidation, score);
    const gr = runRuntimeWordingGovernanceGate(gateInput);
    assert(
      gr.acceptedForUserVisibleAssembly === false,
      `acceptedForUserVisibleAssembly must be false for path '${label}'.`,
      failures,
    );
    assert(
      gr.userVisibleOutputAllowed === false,
      `userVisibleOutputAllowed must be false for path '${label}'.`,
      failures,
    );
  }

  return {
    caseNumber: 11,
    caseName: "user-visible assembly always forbidden — all verdict paths",
    passed: failures.length === 0,
    failures,
    gateResult: null,
    notes: [
      "Checks approved, human_review, hard_fail, and missing_score paths.",
      "All must have acceptedForUserVisibleAssembly: false.",
    ],
  };
}

function case12_noLiveJudge(): GateRegressionCaseResult {
  const failures: string[] = [];

  const pipelines = [
    { input: makeDraftInput(), score: BASE_SAFE_SCORE_REPORT, label: "approved" },
    { input: makeDraftInput(), score: BASE_HUMAN_REVIEW_SCORE_REPORT, label: "human_review" },
    { input: makeDraftInput(), score: BASE_HARD_FAIL_PANIC_SCORE_REPORT, label: "hard_fail" },
  ];

  for (const { input, score, label } of pipelines) {
    const { draftResult, contractValidation } = runPipeline(input);
    const gateInput = makeGateInput(draftResult, contractValidation, score);
    const gr = runRuntimeWordingGovernanceGate(gateInput);
    assert(
      gr.liveLLMJudgeCalled === false,
      `liveLLMJudgeCalled must be false for path '${label}'.`,
      failures,
    );
    assert(
      gr.realTextSemanticallyEvaluated === false,
      `realTextSemanticallyEvaluated must be false for path '${label}'.`,
      failures,
    );
  }

  return {
    caseNumber: 12,
    caseName: "no live judge — liveLLMJudgeCalled and realTextSemanticallyEvaluated always false",
    passed: failures.length === 0,
    failures,
    gateResult: null,
    notes: [
      "Confirms no LLM judge is called and no real prose is semantically evaluated.",
      "Checked across approved, human_review, and hard_fail paths.",
    ],
  };
}

// ── Main scaffold function ─────────────────────────────────────────────────────

/**
 * Runs all 12 regression cases for the Runtime Wording Governance Gate.
 *
 * Returns a summary with `allPassed`, per-case results, and scaffoldVersion.
 * No Jest/Vitest. No CI hook. Safe for governance-kernel dry-run context.
 *
 * Pure function — no side effects, no persistence.
 */
export function runRuntimeWordingGovernanceGateRegressionScaffold(): GateRegressionScaffoldResult {
  const caseResults: GateRegressionCaseResult[] = [
    case1_safeApprovedFlow(),
    case2_previousOutputContractFailed(),
    case3_missingScoreReport(),
    case4_invalidScoreReport(),
    case5_unattestedSafeScoreReport(),
    case6_humanReviewScoreReport(),
    case7_hardFailLegalAdvice(),
    case8_hardFailFalseReassurance(),
    case9_hardFailPanic(),
    case10_sectionResultsPreserveNeverUserVisible(),
    case11_userVisibleAssemblyAlwaysForbidden(),
    case12_noLiveJudge(),
  ];

  const passCount = caseResults.filter((c) => c.passed).length;
  const failCount = caseResults.length - passCount;
  const allPassed = failCount === 0;

  const notes: string[] = [
    `Scaffold version: ${REGRESSION_SCAFFOLD_VERSION}`,
    `Gate version: ${RUNTIME_WORDING_GOVERNANCE_GATE_VERSION}`,
    `Cases run: ${caseResults.length}`,
    `Passed: ${passCount}`,
    `Failed: ${failCount}`,
    "No live LLM called. No LLM judge called. No NLP. No user-visible output.",
    "acceptedForUserVisibleAssembly is false in all cases.",
    "liveLLMJudgeCalled is false in all cases.",
    "realTextSemanticallyEvaluated is false in all cases.",
  ];

  if (!allPassed) {
    const failedNames = caseResults
      .filter((c) => !c.passed)
      .map((c) => `Case ${c.caseNumber}: ${c.caseName}`)
      .join("; ");
    notes.push(`FAILED CASES: ${failedNames}`);
  }

  return {
    scaffoldVersion: REGRESSION_SCAFFOLD_VERSION,
    allPassed,
    passCount,
    failCount,
    caseResults,
    notes,
  };
}
