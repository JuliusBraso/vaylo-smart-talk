/**
 * Runtime Governance Dry-Run regression scaffold (Phase 8.2G-4).
 *
 * Validates `runRuntimeGovernanceDryRun` across 10 governance scenarios.
 *
 * Cases covered:
 *  1. Successful safe dry run
 *  2. Human review dry run
 *  3. Wording hard fail dry run
 *  4. Output contract blocked
 *  5. Missing score report
 *  6. Audit trace chain shape
 *  7. Diagnostic envelopes include output contract violations when blocked
 *  8. Diagnostic envelopes include wording gate diagnostic when human review
 *  9. Never-user-visible invariant
 * 10. No live LLM / no persistence
 *
 * No Jest. No Vitest. No CI hook. Pure in-memory scaffold.
 *
 * Safety guarantees:
 * - no live LLM called
 * - no persistence
 * - no Smart Talk wiring
 * - no user-visible output
 */

import { runRuntimeGovernanceDryRun } from "./run-runtime-governance-dry-run";
import {
  BASE_SAFE_SCORE_REPORT,
  BASE_HUMAN_REVIEW_SCORE_REPORT,
  BASE_HARD_FAIL_LEGAL_ADVICE_SCORE_REPORT,
} from "./runtime-wording-governance-gate-regression-scaffold";
import { MOCK_UNSAFE_FIXTURE_CONTRACT_REF } from "./run-runtime-llm-draft-mock-adapter";
import type { RuntimeLLMDraftAdapterInput } from "./runtime-llm-draft-adapter-types";
import type {
  RuntimeGovernanceDryRunInput,
  RuntimeGovernanceDryRunResult,
} from "./runtime-governance-dry-run-types";

export const DRY_RUN_REGRESSION_SCAFFOLD_VERSION =
  "8.2g-4-dry-run-regression-scaffold-v1";

// ── Base fixtures ──────────────────────────────────────────────────────────────

function makeDraftInput(
  overrides: Partial<RuntimeLLMDraftAdapterInput> = {},
): RuntimeLLMDraftAdapterInput {
  return {
    adapterMode: "mock",
    accessTier: "free_preview",
    contractRef: "test-contract-8.2g-4",
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

function makeDryRunInput(
  overrides: Partial<RuntimeGovernanceDryRunInput>,
): RuntimeGovernanceDryRunInput {
  return {
    draftInput: makeDraftInput(),
    scoreReport: BASE_SAFE_SCORE_REPORT,
    dryRunId: "dry-run-8.2g-4-default",
    neverUserVisible: true,
    ...overrides,
  };
}

// ── Assertion helpers ──────────────────────────────────────────────────────────

function assert(
  condition: boolean,
  message: string,
): { passed: boolean; message: string } {
  return { passed: condition, message };
}

// ── Case result types ─────────────────────────────────────────────────────────

export interface DryRunRegressionCaseResult {
  readonly caseNumber: number;
  readonly caseName: string;
  readonly passed: boolean;
  readonly assertions: readonly { passed: boolean; message: string }[];
  readonly result: RuntimeGovernanceDryRunResult;
}

export interface DryRunRegressionScaffoldResult {
  readonly scaffoldVersion: string;
  readonly allPassed: boolean;
  readonly caseResults: readonly DryRunRegressionCaseResult[];
  readonly notes: readonly string[];
}

// ── Case runner ───────────────────────────────────────────────────────────────

function runCase(
  caseNumber: number,
  caseName: string,
  input: RuntimeGovernanceDryRunInput,
  assertions: (result: RuntimeGovernanceDryRunResult) => { passed: boolean; message: string }[],
): DryRunRegressionCaseResult {
  const result = runRuntimeGovernanceDryRun(input);
  const assertionResults = assertions(result);
  const passed = assertionResults.every((a) => a.passed);
  return { caseNumber, caseName, passed, assertions: assertionResults, result };
}

// ── Scaffold ──────────────────────────────────────────────────────────────────

/**
 * Runs all 10 regression cases for `runRuntimeGovernanceDryRun`.
 *
 * Returns a never-user-visible scaffold result containing per-case outcomes.
 * No persistence, no logging, no telemetry, no live LLM calls.
 */
export function runRuntimeGovernanceDryRunRegressionScaffold(): DryRunRegressionScaffoldResult {
  const cases: DryRunRegressionCaseResult[] = [];

  // ── Case 1: Successful safe dry run ─────────────────────────────────────────

  cases.push(
    runCase(1, "successful safe dry run", makeDryRunInput({
      dryRunId: "dry-run-c1-safe",
      scoreReport: BASE_SAFE_SCORE_REPORT,
    }), (r) => [
      assert(r.verdict === "completed_successfully",
        `verdict should be completed_successfully; got ${r.verdict}`),
      assert(r.auditTraceValid === true,
        `auditTraceValid should be true; got ${String(r.auditTraceValid)}`),
      assert(r.diagnosticEnvelopeValid === true,
        `diagnosticEnvelopeValid should be true; got ${String(r.diagnosticEnvelopeValid)}`),
      assert(r.liveLLMCalled === false,
        `liveLLMCalled must be false`),
      assert(r.persistenceUsed === false,
        `persistenceUsed must be false`),
      assert(r.userVisibleOutputAllowed === false,
        `userVisibleOutputAllowed must be false`),
      assert(r.neverUserVisible === true,
        `neverUserVisible must be true`),
    ]),
  );

  // ── Case 2: Human review dry run ────────────────────────────────────────────

  cases.push(
    runCase(2, "human review dry run", makeDryRunInput({
      dryRunId: "dry-run-c2-human-review",
      scoreReport: BASE_HUMAN_REVIEW_SCORE_REPORT,
    }), (r) => [
      assert(r.verdict === "completed_with_human_review_required",
        `verdict should be completed_with_human_review_required; got ${r.verdict}`),
      assert(r.auditTraceValid === true,
        `auditTraceValid should be true; got ${String(r.auditTraceValid)}`),
      assert(r.diagnosticEnvelopeValid === true,
        `diagnosticEnvelopeValid should be true; got ${String(r.diagnosticEnvelopeValid)}`),
      assert(r.diagnostics.includes("runtime_dry_run_human_review_required"),
        `diagnostics should include runtime_dry_run_human_review_required`),
    ]),
  );

  // ── Case 3: Wording hard fail dry run ───────────────────────────────────────

  cases.push(
    runCase(3, "wording hard fail dry run", makeDryRunInput({
      dryRunId: "dry-run-c3-hard-fail",
      scoreReport: BASE_HARD_FAIL_LEGAL_ADVICE_SCORE_REPORT,
    }), (r) => [
      assert(r.verdict === "blocked_by_wording_gate",
        `verdict should be blocked_by_wording_gate; got ${r.verdict}`),
      assert(r.auditTraceValid === true,
        `auditTraceValid should be true; got ${String(r.auditTraceValid)}`),
      assert(r.diagnosticEnvelopeValid === true,
        `diagnosticEnvelopeValid should be true; got ${String(r.diagnosticEnvelopeValid)}`),
      assert(r.diagnostics.includes("runtime_dry_run_blocked_by_wording_gate"),
        `diagnostics should include runtime_dry_run_blocked_by_wording_gate`),
      assert(r.wordingGateResult.verdict === "hard_fail_wording_violation",
        `wordingGateResult.verdict should be hard_fail_wording_violation; got ${r.wordingGateResult.verdict}`),
    ]),
  );

  // ── Case 4: Output contract blocked (unsafe fixture path) ───────────────────

  cases.push(
    runCase(4, "output contract blocked (unsafe fixture)", makeDryRunInput({
      dryRunId: "dry-run-c4-output-contract-blocked",
      draftInput: makeDraftInput({ contractRef: MOCK_UNSAFE_FIXTURE_CONTRACT_REF }),
      scoreReport: BASE_SAFE_SCORE_REPORT,
    }), (r) => [
      assert(r.verdict === "blocked_by_output_contract",
        `verdict should be blocked_by_output_contract; got ${r.verdict}`),
      assert(r.auditTraceValid === true,
        `auditTraceValid should be true; got ${String(r.auditTraceValid)}`),
      assert(r.diagnosticEnvelopeValid === true,
        `diagnosticEnvelopeValid should be true; got ${String(r.diagnosticEnvelopeValid)}`),
      assert(r.diagnostics.includes("runtime_dry_run_blocked_by_output_contract"),
        `diagnostics should include runtime_dry_run_blocked_by_output_contract`),
      assert(r.outputContractValidation.verdict !== "accepted_for_next_gate",
        `outputContractValidation should not be accepted_for_next_gate; got ${r.outputContractValidation.verdict}`),
    ]),
  );

  // ── Case 5: Missing score report ────────────────────────────────────────────

  cases.push(
    runCase(5, "missing score report", makeDryRunInput({
      dryRunId: "dry-run-c5-missing-score",
      scoreReport: null,
    }), (r) => [
      assert(r.verdict === "blocked_by_wording_gate",
        `verdict should be blocked_by_wording_gate (missing score report); got ${r.verdict}`),
      assert(r.auditTraceValid === true,
        `auditTraceValid should be true even when wording gate blocked`),
      assert(r.wordingGateResult.verdict === "rejected_missing_score_report",
        `wordingGateResult.verdict should be rejected_missing_score_report; got ${r.wordingGateResult.verdict}`),
    ]),
  );

  // ── Case 6: Audit trace chain shape ─────────────────────────────────────────

  cases.push(
    runCase(6, "audit trace chain shape (successful)", makeDryRunInput({
      dryRunId: "dry-run-c6-chain-shape",
      scoreReport: BASE_SAFE_SCORE_REPORT,
    }), (r) => {
      const rootNode = r.auditTraceChain.nodes.find(
        (n) => n.traceId === r.auditTraceChain.rootTraceId,
      );
      const rootHasNoParent =
        rootNode !== undefined && rootNode.parentTraceIds.length === 0;
      return [
        assert(r.auditTraceChain.nodes.length >= 3,
          `chain should have at least 3 nodes; got ${String(r.auditTraceChain.nodes.length)}`),
        assert(rootNode !== undefined,
          `rootTraceId must match a node in the chain`),
        assert(rootHasNoParent,
          `root node must have no parent trace IDs`),
        assert(r.auditTraceValid === true,
          `auditTraceValid must be true`),
        assert(r.auditTraceChain.neverUserVisible === true,
          `auditTraceChain.neverUserVisible must be true`),
      ];
    }),
  );

  // ── Case 7: Diagnostic envelopes include output contract violations when blocked ─

  cases.push(
    runCase(7, "diagnostic envelopes include output contract violations when blocked",
      makeDryRunInput({
        dryRunId: "dry-run-c7-envelope-contract-violation",
        draftInput: makeDraftInput({ contractRef: MOCK_UNSAFE_FIXTURE_CONTRACT_REF }),
        scoreReport: BASE_SAFE_SCORE_REPORT,
      }), (r) => {
        const contractViolationEnvelopes = r.diagnosticEnvelopes.filter(
          (e) => e.layer === "contract_validation",
        );
        return [
          assert(r.verdict === "blocked_by_output_contract",
            `verdict should be blocked_by_output_contract`),
          assert(contractViolationEnvelopes.length > 0,
            `diagnosticEnvelopes should contain at least one contract_validation envelope; ` +
            `got ${String(contractViolationEnvelopes.length)}`),
          assert(r.outputContractValidation.violations.length > 0,
            `outputContractValidation.violations must be non-empty for this to be meaningful`),
        ];
      }),
  );

  // ── Case 8: Diagnostic envelopes include wording gate diagnostic when human review ─

  cases.push(
    runCase(8, "diagnostic envelopes include wording gate diagnostic when human review",
      makeDryRunInput({
        dryRunId: "dry-run-c8-envelope-human-review",
        scoreReport: BASE_HUMAN_REVIEW_SCORE_REPORT,
      }), (r) => {
        const wordingEnvelopes = r.diagnosticEnvelopes.filter(
          (e) => e.layer === "wording_evaluation",
        );
        return [
          assert(r.verdict === "completed_with_human_review_required",
            `verdict should be completed_with_human_review_required`),
          assert(wordingEnvelopes.length > 0,
            `diagnosticEnvelopes should contain at least one wording_evaluation envelope; ` +
            `got ${String(wordingEnvelopes.length)}`),
          assert(wordingEnvelopes.some((e) => e.code === "wording_gate_human_review_required"),
            `should have an envelope for wording_gate_human_review_required`),
        ];
      }),
  );

  // ── Case 9: Never-user-visible invariant ─────────────────────────────────────

  cases.push(
    runCase(9, "never-user-visible invariant across all structures", makeDryRunInput({
      dryRunId: "dry-run-c9-neveruservisible",
      scoreReport: BASE_SAFE_SCORE_REPORT,
    }), (r) => [
      assert(r.neverUserVisible === true,
        `result.neverUserVisible must be true`),
      assert(r.userVisibleOutputAllowed === false,
        `result.userVisibleOutputAllowed must be false`),
      assert(r.auditTraceChain.neverUserVisible === true,
        `auditTraceChain.neverUserVisible must be true`),
      assert(r.auditTraceEmissions.every((e) => e.neverUserVisible === true),
        `all auditTraceEmissions must have neverUserVisible === true`),
      assert(r.auditTraceChain.nodes.every((n) => n.neverUserVisible === true),
        `all auditTraceChain.nodes must have neverUserVisible === true`),
      assert(r.diagnosticEnvelopes.every((e) => e.neverUserVisible === true),
        `all diagnosticEnvelopes must have neverUserVisible === true`),
      assert(r.draftResult.neverUserVisible === true,
        `draftResult.neverUserVisible must be true`),
      assert(r.wordingGateResult.neverUserVisible === true,
        `wordingGateResult.neverUserVisible must be true`),
    ]),
  );

  // ── Case 10: No live LLM / no persistence ────────────────────────────────────

  cases.push(
    runCase(10, "no live LLM and no persistence confirmed", makeDryRunInput({
      dryRunId: "dry-run-c10-invariants",
      scoreReport: BASE_SAFE_SCORE_REPORT,
    }), (r) => [
      assert(r.liveLLMCalled === false,
        `liveLLMCalled must be false`),
      assert(r.persistenceUsed === false,
        `persistenceUsed must be false`),
      assert(r.draftResult.liveLLMCalled === false,
        `draftResult.liveLLMCalled must be false`),
      assert(r.outputContractValidation.liveLLMCalled === false,
        `outputContractValidation.liveLLMCalled must be false`),
      assert(r.wordingGateResult.liveLLMJudgeCalled === false,
        `wordingGateResult.liveLLMJudgeCalled must be false`),
      assert(r.wordingGateResult.realTextSemanticallyEvaluated === false,
        `wordingGateResult.realTextSemanticallyEvaluated must be false`),
      assert(r.diagnostics.includes("runtime_dry_run_no_live_llm_confirmed"),
        `diagnostics must include runtime_dry_run_no_live_llm_confirmed`),
      assert(r.diagnostics.includes("runtime_dry_run_no_persistence_confirmed"),
        `diagnostics must include runtime_dry_run_no_persistence_confirmed`),
    ]),
  );

  // ── Aggregate result ─────────────────────────────────────────────────────────

  const allPassed = cases.every((c) => c.passed);

  return {
    scaffoldVersion: DRY_RUN_REGRESSION_SCAFFOLD_VERSION,
    allPassed,
    caseResults: cases,
    notes: [
      "Phase 8.2G-4 — Runtime Governance Dry-Run regression scaffold.",
      "10 cases covering success, human review, hard fail, output contract block, " +
        "missing score report, chain shape, envelope content, invariants.",
      "No Jest, no Vitest, no CI hook. Pure in-memory scaffold.",
      "No live LLM called. No persistence. No Smart Talk wiring. No user-visible output.",
      `All cases passed: ${String(allPassed)}.`,
    ],
  };
}
