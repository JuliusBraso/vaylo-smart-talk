/**
 * Runtime Synthetic E2E Harness regression scaffold (Phase 8.2G-8).
 *
 * Validates `runRuntimeSyntheticE2EHarness` across 12 cases covering all fixture
 * modes, invariant preservation, diagnostic chain completeness, and the
 * `userVisibleOutputAllowedForFuture` gating behavior.
 *
 * Cases:
 *  1.  mock_safe → completed_authorised_packet
 *  2.  mock_unsafe_output_contract → blocked_output_contract
 *  3.  mock_wording_hard_fail → blocked_wording_gate
 *  4.  mock_human_review → blocked_user_visible_authorisation
 *  5.  mock_metadata_leak → blocked_response_assembler
 *  6.  mock_empty_sections → blocked_response_assembler
 *  7.  No API/UI/live/persistence invariants on success
 *  8.  No DNA/offline save invariants
 *  9.  emittedToUserNow always false across all fixture modes
 * 10.  userVisibleOutputAllowedForFuture true only on completed_authorised_packet
 * 11.  Diagnostic chain contains expected progress markers
 * 12.  neverUserVisible true across all fixture modes
 *
 * No Jest/Vitest. No CI hook. No live LLM call. No API key required.
 */

import {
  runRuntimeSyntheticE2EHarness,
  RUNTIME_SYNTHETIC_E2E_HARNESS_VERSION,
} from "./run-runtime-synthetic-e2e-harness";
import { runRuntimeCorpusGuidedScenarioCoverage } from "./run-runtime-corpus-guided-scenario-coverage";
import type {
  RuntimeSyntheticE2EHarnessResult,
  RuntimeSyntheticE2EHarnessVerdict,
  RuntimeSyntheticE2EHarnessDiagnosticCode,
  RuntimeSyntheticE2EHarnessFixtureMode,
} from "./runtime-synthetic-e2e-harness-types";

export const SYNTHETIC_E2E_SCAFFOLD_VERSION =
  "8.2g-8-runtime-synthetic-e2e-harness-regression-v1";

// ── Result types ──────────────────────────────────────────────────────────────

export interface E2ECaseResult {
  readonly caseNumber: number;
  readonly caseName: string;
  readonly passed: boolean;
  readonly failures: readonly string[];
  readonly harnessResult?: RuntimeSyntheticE2EHarnessResult;
  readonly notes?: readonly string[];
}

export interface E2EScaffoldResult {
  readonly scaffoldVersion: string;
  readonly allPassed: boolean;
  readonly passCount: number;
  readonly failCount: number;
  readonly caseResults: readonly E2ECaseResult[];
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
  r: RuntimeSyntheticE2EHarnessResult,
  expected: RuntimeSyntheticE2EHarnessVerdict,
  failures: string[],
): void {
  assertEq(r.verdict, expected, "verdict", failures);
}

function assertDiag(
  r: RuntimeSyntheticE2EHarnessResult,
  code: RuntimeSyntheticE2EHarnessDiagnosticCode,
  failures: string[],
): void {
  if (!r.diagnostics.includes(code)) {
    fail(`Expected diagnostic '${code}' but was absent.`, failures);
  }
}

function assertInvariants(r: RuntimeSyntheticE2EHarnessResult, failures: string[]): void {
  assertEq(r.emittedToUserNow, false, "emittedToUserNow", failures);
  assertEq(r.liveLLMCalled, false, "liveLLMCalled", failures);
  assertEq(r.apiRouteTouched, false, "apiRouteTouched", failures);
  assertEq(r.uiTouched, false, "uiTouched", failures);
  assertEq(r.persistenceUsed, false, "persistenceUsed", failures);
  assertEq(r.dnaSavePerformed, false, "dnaSavePerformed", failures);
  assertEq(r.offlineSavePerformed, false, "offlineSavePerformed", failures);
  assertEq(r.neverUserVisible, true, "neverUserVisible", failures);
}

function runFixture(mode: RuntimeSyntheticE2EHarnessFixtureMode, caseLabel: string): RuntimeSyntheticE2EHarnessResult {
  return runRuntimeSyntheticE2EHarness({
    harnessRunId: `8.2g-8-scaffold-${caseLabel}`,
    fixtureMode: mode,
    neverUserVisible: true,
  });
}

// ── Cases ─────────────────────────────────────────────────────────────────────

// Case 1: mock_safe → completed_authorised_packet
function case1_safePath(): E2ECaseResult {
  const failures: string[] = [];
  const r = runFixture("mock_safe", "case1");

  assertVerdict(r, "completed_authorised_packet", failures);
  assertEq(r.packetCreated, true, "packetCreated", failures);
  assertEq(r.acceptedForUserVisibleAssembly, true, "acceptedForUserVisibleAssembly", failures);
  assertEq(r.userVisibleOutputAllowedForFuture, true, "userVisibleOutputAllowedForFuture", failures);
  assertEq(r.emittedToUserNow, false, "emittedToUserNow", failures);
  assertDiag(r, "synthetic_e2e_packet_authorised", failures);
  assertInvariants(r, failures);

  return {
    caseNumber: 1,
    caseName: "mock_safe → completed_authorised_packet",
    passed: failures.length === 0,
    failures,
    harnessResult: r,
    notes: ["Full internal pipeline succeeds. Packet created but not emitted."],
  };
}

// Case 2: mock_unsafe_output_contract → blocked_output_contract
function case2_unsafeContract(): E2ECaseResult {
  const failures: string[] = [];
  const r = runFixture("mock_unsafe_output_contract", "case2");

  assertVerdict(r, "blocked_output_contract", failures);
  assertEq(r.packetCreated, false, "packetCreated", failures);
  assertDiag(r, "synthetic_e2e_blocked_output_contract", failures);
  assertDiag(r, "synthetic_e2e_output_contract_completed", failures);
  assertInvariants(r, failures);

  return {
    caseNumber: 2,
    caseName: "mock_unsafe_output_contract → blocked_output_contract",
    passed: failures.length === 0,
    failures,
    harnessResult: r,
  };
}

// Case 3: mock_wording_hard_fail → blocked_wording_gate
function case3_wordingHardFail(): E2ECaseResult {
  const failures: string[] = [];
  const r = runFixture("mock_wording_hard_fail", "case3");

  assertVerdict(r, "blocked_wording_gate", failures);
  assertEq(r.packetCreated, false, "packetCreated", failures);
  assertDiag(r, "synthetic_e2e_blocked_wording_gate", failures);
  assertDiag(r, "synthetic_e2e_wording_gate_completed", failures);
  assertInvariants(r, failures);

  return {
    caseNumber: 3,
    caseName: "mock_wording_hard_fail → blocked_wording_gate",
    passed: failures.length === 0,
    failures,
    harnessResult: r,
  };
}

// Case 4: mock_human_review → blocked_user_visible_authorisation
function case4_humanReview(): E2ECaseResult {
  const failures: string[] = [];
  const r = runFixture("mock_human_review", "case4");

  assertVerdict(r, "blocked_user_visible_authorisation", failures);
  assertEq(r.packetCreated, false, "packetCreated", failures);
  assertEq(r.acceptedForUserVisibleAssembly, false, "acceptedForUserVisibleAssembly", failures);
  assertDiag(r, "synthetic_e2e_blocked_user_visible_authorisation", failures);
  assertInvariants(r, failures);

  return {
    caseNumber: 4,
    caseName: "mock_human_review → blocked_user_visible_authorisation",
    passed: failures.length === 0,
    failures,
    harnessResult: r,
    notes: ["Human review packet cannot be authorised for user-visible delivery."],
  };
}

// Case 5: mock_metadata_leak → blocked_response_assembler
function case5_metadataLeak(): E2ECaseResult {
  const failures: string[] = [];
  const r = runFixture("mock_metadata_leak", "case5");

  assertVerdict(r, "blocked_response_assembler", failures);
  assertEq(r.packetCreated, false, "packetCreated", failures);
  assertDiag(r, "synthetic_e2e_blocked_response_assembler", failures);
  assertInvariants(r, failures);

  return {
    caseNumber: 5,
    caseName: "mock_metadata_leak → blocked_response_assembler",
    passed: failures.length === 0,
    failures,
    harnessResult: r,
  };
}

// Case 6: mock_empty_sections → blocked_response_assembler
function case6_emptySections(): E2ECaseResult {
  const failures: string[] = [];
  const r = runFixture("mock_empty_sections", "case6");

  assertVerdict(r, "blocked_response_assembler", failures);
  assertDiag(r, "synthetic_e2e_blocked_response_assembler", failures);
  assertInvariants(r, failures);

  return {
    caseNumber: 6,
    caseName: "mock_empty_sections → blocked_response_assembler",
    passed: failures.length === 0,
    failures,
    harnessResult: r,
  };
}

// Case 7: no API/UI/live/persistence invariants on success
function case7_successInvariants(): E2ECaseResult {
  const failures: string[] = [];
  const r = runFixture("mock_safe", "case7");

  assertEq(r.liveLLMCalled, false, "liveLLMCalled", failures);
  assertEq(r.apiRouteTouched, false, "apiRouteTouched", failures);
  assertEq(r.uiTouched, false, "uiTouched", failures);
  assertEq(r.persistenceUsed, false, "persistenceUsed", failures);
  assertDiag(r, "synthetic_e2e_no_api_route_confirmed", failures);
  assertDiag(r, "synthetic_e2e_no_ui_confirmed", failures);
  assertDiag(r, "synthetic_e2e_no_live_llm_confirmed", failures);
  assertDiag(r, "synthetic_e2e_no_persistence_confirmed", failures);

  return {
    caseNumber: 7,
    caseName: "no API/UI/live LLM/persistence invariants hold on success",
    passed: failures.length === 0,
    failures,
    harnessResult: r,
  };
}

// Case 8: no DNA/offline save invariants
function case8_saveInvariants(): E2ECaseResult {
  const failures: string[] = [];
  const r = runFixture("mock_safe", "case8");

  assertEq(r.dnaSavePerformed, false, "dnaSavePerformed", failures);
  assertEq(r.offlineSavePerformed, false, "offlineSavePerformed", failures);

  return {
    caseNumber: 8,
    caseName: "dnaSavePerformed:false and offlineSavePerformed:false on success",
    passed: failures.length === 0,
    failures,
    harnessResult: r,
  };
}

// Case 9: emittedToUserNow always false across all fixture modes
function case9_emittedNeverTrue(): E2ECaseResult {
  const failures: string[] = [];
  const modes: RuntimeSyntheticE2EHarnessFixtureMode[] = [
    "mock_safe",
    "mock_unsafe_output_contract",
    "mock_wording_hard_fail",
    "mock_human_review",
    "mock_metadata_leak",
    "mock_empty_sections",
  ];
  for (const mode of modes) {
    const r = runRuntimeSyntheticE2EHarness({
      harnessRunId: `8.2g-8-case9-${mode}`,
      fixtureMode: mode,
      neverUserVisible: true,
    });
    if (r.emittedToUserNow !== false) {
      fail(`${mode}: emittedToUserNow should be false, got ${String(r.emittedToUserNow)}`, failures);
    }
  }

  return {
    caseNumber: 9,
    caseName: "emittedToUserNow:false on every fixture mode",
    passed: failures.length === 0,
    failures,
    notes: ["Checks all 6 fixture modes."],
  };
}

// Case 10: userVisibleOutputAllowedForFuture true only on completed_authorised_packet
function case10_allowedFutureOnlyOnSuccess(): E2ECaseResult {
  const failures: string[] = [];

  const safeR = runFixture("mock_safe", "case10-safe");
  assertEq(safeR.userVisibleOutputAllowedForFuture, true, "mock_safe: userVisibleOutputAllowedForFuture", failures);

  const blockedModes: RuntimeSyntheticE2EHarnessFixtureMode[] = [
    "mock_unsafe_output_contract",
    "mock_wording_hard_fail",
    "mock_human_review",
    "mock_metadata_leak",
    "mock_empty_sections",
  ];
  for (const mode of blockedModes) {
    const r = runRuntimeSyntheticE2EHarness({
      harnessRunId: `8.2g-8-case10-${mode}`,
      fixtureMode: mode,
      neverUserVisible: true,
    });
    if (r.userVisibleOutputAllowedForFuture !== false) {
      fail(`${mode}: userVisibleOutputAllowedForFuture should be false`, failures);
    }
  }

  return {
    caseNumber: 10,
    caseName: "userVisibleOutputAllowedForFuture true only on completed_authorised_packet",
    passed: failures.length === 0,
    failures,
    notes: ["Checks all modes: only mock_safe returns true."],
  };
}

// Case 11: diagnostic chain contains expected progress markers
function case11_diagnosticChain(): E2ECaseResult {
  const failures: string[] = [];

  // Success path has all markers
  const safeR = runFixture("mock_safe", "case11-safe");
  assertDiag(safeR, "synthetic_e2e_started", failures);
  assertDiag(safeR, "synthetic_e2e_draft_created", failures);
  assertDiag(safeR, "synthetic_e2e_output_contract_completed", failures);
  assertDiag(safeR, "synthetic_e2e_wording_gate_completed", failures);
  assertDiag(safeR, "synthetic_e2e_response_assembler_completed", failures);
  assertDiag(safeR, "synthetic_e2e_user_visible_authorisation_completed", failures);
  assertDiag(safeR, "synthetic_e2e_packet_authorised", failures);

  // Output-contract-blocked path stops at output contract
  const contractR = runFixture("mock_unsafe_output_contract", "case11-contract");
  assertDiag(contractR, "synthetic_e2e_output_contract_completed", failures);
  if (contractR.diagnostics.includes("synthetic_e2e_wording_gate_completed")) {
    fail("Output-contract-blocked should not reach wording gate", failures);
  }

  // Wording-blocked path stops at wording gate
  const wordingR = runFixture("mock_wording_hard_fail", "case11-wording");
  assertDiag(wordingR, "synthetic_e2e_wording_gate_completed", failures);
  if (wordingR.diagnostics.includes("synthetic_e2e_response_assembler_completed")) {
    fail("Wording-blocked should not reach assembler", failures);
  }

  return {
    caseNumber: 11,
    caseName: "diagnostic chain contains expected progress markers at each stage",
    passed: failures.length === 0,
    failures,
    notes: ["Checks diagnostic presence/absence at correct pipeline stages."],
  };
}

// Case 12: neverUserVisible true across all fixture modes
function case12_neverUserVisible(): E2ECaseResult {
  const failures: string[] = [];
  const modes: RuntimeSyntheticE2EHarnessFixtureMode[] = [
    "mock_safe",
    "mock_unsafe_output_contract",
    "mock_wording_hard_fail",
    "mock_human_review",
    "mock_metadata_leak",
    "mock_empty_sections",
  ];
  for (const mode of modes) {
    const r = runRuntimeSyntheticE2EHarness({
      harnessRunId: `8.2g-8-case12-${mode}`,
      fixtureMode: mode,
      neverUserVisible: true,
    });
    if (r.neverUserVisible !== true) {
      fail(`${mode}: neverUserVisible should be true`, failures);
    }
  }

  return {
    caseNumber: 12,
    caseName: "neverUserVisible:true on every fixture mode",
    passed: failures.length === 0,
    failures,
    notes: ["Checks all 6 fixture modes."],
  };
}

// Case 13: corpus-guided coverage runs and all 6 base scenarios pass (Phase 8.2G-11)
function case13_corpusGuidedCoverage(): E2ECaseResult {
  const failures: string[] = [];

  const coverage = runRuntimeCorpusGuidedScenarioCoverage({
    coverageRunId: "8.2g-8-scaffold-case13",
    neverUserVisible: true,
  });

  if (coverage.verdict !== "completed_all_passed") {
    fail(`corpus coverage verdict: expected completed_all_passed, got ${coverage.verdict}`, failures);
  }
  if (coverage.totalScenarios < 6) {
    fail(`totalScenarios: expected >= 6, got ${String(coverage.totalScenarios)}`, failures);
  }
  if (coverage.passedScenarios !== coverage.totalScenarios) {
    fail(`passedScenarios: expected ${String(coverage.totalScenarios)}, got ${String(coverage.passedScenarios)}`, failures);
  }
  if (coverage.liveLLMCalled !== false) {
    fail("liveLLMCalled should be false", failures);
  }
  if (coverage.persistenceUsed !== false) {
    fail("persistenceUsed should be false", failures);
  }
  if (coverage.neverUserVisible !== true) {
    fail("neverUserVisible should be true", failures);
  }

  return {
    caseNumber: 13,
    caseName: "corpus-guided scenario coverage: completed_all_passed on 6 base scenarios",
    passed: failures.length === 0,
    failures,
    notes: ["Phase 8.2G-11 coverage runner exercising all 6 governance outcome paths."],
  };
}

// ── Scaffold ──────────────────────────────────────────────────────────────────

/**
 * Runs all 13 regression cases for Phases 8.2G-8 and 8.2G-11.
 *
 * No persistence. No logging. No live LLM call. No API key.
 */
export function runSyntheticE2EHarnessRegressionScaffold(): E2EScaffoldResult {
  const caseResults: E2ECaseResult[] = [
    case1_safePath(),
    case2_unsafeContract(),
    case3_wordingHardFail(),
    case4_humanReview(),
    case5_metadataLeak(),
    case6_emptySections(),
    case7_successInvariants(),
    case8_saveInvariants(),
    case9_emittedNeverTrue(),
    case10_allowedFutureOnlyOnSuccess(),
    case11_diagnosticChain(),
    case12_neverUserVisible(),
    case13_corpusGuidedCoverage(),
  ];

  const passCount = caseResults.filter((c) => c.passed).length;
  const failCount = caseResults.length - passCount;
  const allPassed = failCount === 0;

  return {
    scaffoldVersion: SYNTHETIC_E2E_SCAFFOLD_VERSION,
    allPassed,
    passCount,
    failCount,
    caseResults,
    notes: [
      `Phase 8.2G-8/8.2G-11 — Synthetic E2E Harness + Corpus Coverage regression scaffold.`,
      `Harness version: ${RUNTIME_SYNTHETIC_E2E_HARNESS_VERSION}.`,
      "13 cases: all fixture modes, all invariants, diagnostic chain, gating behavior, corpus coverage.",
      "No Jest, no Vitest, no CI hook. No live LLM call. No API key required.",
      "Proves full 8.2G-1 → 8.2G-11 pipeline produces authorised internal packet and corpus all-pass.",
      `All cases passed: ${String(allPassed)} (${String(passCount)}/${String(caseResults.length)}).`,
    ],
  };
}
