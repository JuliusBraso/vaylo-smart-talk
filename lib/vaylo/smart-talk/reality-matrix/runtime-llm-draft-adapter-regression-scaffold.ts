/**
 * Regression scaffold for the Runtime LLM Draft Mock Adapter (Phase 8.2G-1).
 *
 * Validates that `runRuntimeLLMDraftMockAdapter` correctly enforces all
 * governance invariants:
 *  - liveLLMCalled is always false
 *  - userVisibleOutputAllowed is always false
 *  - future_live_llm mode is blocked with the right diagnostic
 *  - section candidates are filtered to allowedSectionTypes only
 *  - governance metadata (forbidden moves, constraints, trace IDs) propagates
 *  - contractRef absence emits the correct diagnostic
 *  - neverUserVisible is enforced throughout
 *  - unsafe fixture path emits the correct diagnostic
 *
 * No Jest/Vitest. No CI hook. Pure in-memory validation.
 *
 * Safety guarantees:
 * - no LLM call
 * - no API keys or env vars
 * - no user-visible output
 * - no external dependencies
 */

import {
  MOCK_UNSAFE_FIXTURE_CONTRACT_REF,
  runRuntimeLLMDraftMockAdapter,
} from "./run-runtime-llm-draft-mock-adapter";
import type {
  RuntimeLLMDraftAdapterDiagnosticCode,
  RuntimeLLMDraftAdapterInput,
  RuntimeLLMDraftAdapterResult,
  RuntimeLLMDraftSectionType,
} from "./runtime-llm-draft-adapter-types";

export const REGRESSION_SCAFFOLD_VERSION =
  "8.2g-1-runtime-llm-draft-adapter-regression-v1";

// ── Result types ──────────────────────────────────────────────────────────────

export interface RegressionCaseResult {
  readonly caseNumber: number;
  readonly caseName: string;
  readonly passed: boolean;
  readonly failures: readonly string[];
  readonly result: RuntimeLLMDraftAdapterResult | null;
  readonly notes?: readonly string[];
}

export interface RegressionScaffoldResult {
  readonly scaffoldVersion: string;
  readonly allPassed: boolean;
  readonly passCount: number;
  readonly failCount: number;
  readonly caseResults: readonly RegressionCaseResult[];
  readonly notes: readonly string[];
}

// ── Assertion helper ──────────────────────────────────────────────────────────

function assert(
  condition: boolean,
  message: string,
  failures: string[],
): void {
  if (!condition) {
    failures.push(message);
  }
}

function assertDiagnosticPresent(
  result: RuntimeLLMDraftAdapterResult,
  code: RuntimeLLMDraftAdapterDiagnosticCode,
  failures: string[],
): void {
  assert(
    result.diagnostics.includes(code),
    `Expected diagnostic '${code}' to be present but was not.`,
    failures,
  );
}

function assertDiagnosticAbsent(
  result: RuntimeLLMDraftAdapterResult,
  code: RuntimeLLMDraftAdapterDiagnosticCode,
  failures: string[],
): void {
  assert(
    !result.diagnostics.includes(code),
    `Unexpected diagnostic '${code}' found in result.`,
    failures,
  );
}

function assertSectionPresent(
  result: RuntimeLLMDraftAdapterResult,
  sectionType: RuntimeLLMDraftSectionType,
  failures: string[],
): void {
  assert(
    result.sectionCandidates.some((c) => c.sectionType === sectionType),
    `Expected section '${sectionType}' to be present but was not.`,
    failures,
  );
}

function assertSectionAbsent(
  result: RuntimeLLMDraftAdapterResult,
  sectionType: RuntimeLLMDraftSectionType,
  failures: string[],
): void {
  assert(
    !result.sectionCandidates.some((c) => c.sectionType === sectionType),
    `Unexpected section '${sectionType}' found in result.`,
    failures,
  );
}

function assertNeverUserVisibleInvariants(
  result: RuntimeLLMDraftAdapterResult,
  failures: string[],
): void {
  assert(result.neverUserVisible === true, "result.neverUserVisible must be true.", failures);
  assert(result.liveLLMCalled === false, "result.liveLLMCalled must be false.", failures);
  assert(
    result.userVisibleOutputAllowed === false,
    "result.userVisibleOutputAllowed must be false.",
    failures,
  );
  for (const candidate of result.sectionCandidates) {
    assert(
      candidate.neverUserVisible === true,
      `Section '${candidate.sectionType}' neverUserVisible must be true.`,
      failures,
    );
    assert(
      candidate.draftText.startsWith("[MOCK_DRAFT_NEVER_USER_VISIBLE]"),
      `Section '${candidate.sectionType}' draftText must start with [MOCK_DRAFT_NEVER_USER_VISIBLE].`,
      failures,
    );
  }
}

function makeBaseInput(
  overrides: Partial<RuntimeLLMDraftAdapterInput>,
): RuntimeLLMDraftAdapterInput {
  return {
    adapterMode: "mock",
    accessTier: "free_preview",
    contractRef: "test-contract-ref-base",
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

// ── Cases ─────────────────────────────────────────────────────────────────────

function case1_mockFreePreviewBasic(): RegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput({
    adapterMode: "mock",
    accessTier: "free_preview",
    contractRef: "test-free-contract",
    allowedSectionTypes: ["document_type_signal", "uncertainty_notice"],
  });
  const result = runRuntimeLLMDraftMockAdapter(input);

  assert(result.liveLLMCalled === false, "liveLLMCalled must be false.", failures);
  assert(result.userVisibleOutputAllowed === false, "userVisibleOutputAllowed must be false.", failures);
  assertDiagnosticPresent(result, "llm_adapter_mock_used", failures);
  assertDiagnosticPresent(result, "llm_adapter_output_never_user_visible", failures);
  assertDiagnosticAbsent(result, "llm_adapter_live_llm_forbidden", failures);
  assertSectionPresent(result, "document_type_signal", failures);
  assertSectionPresent(result, "uncertainty_notice", failures);
  assert(result.sectionCandidates.length === 2, "Expected exactly 2 section candidates.", failures);
  assertNeverUserVisibleInvariants(result, failures);
  assert(result.adapterMode === "mock", "adapterMode must be 'mock'.", failures);
  assert(result.accessTier === "free_preview", "accessTier must be 'free_preview'.", failures);

  return {
    caseNumber: 1,
    caseName: "mock free_preview basic",
    passed: failures.length === 0,
    failures,
    result,
    notes: ["Validates base mock adapter with free_preview tier and 2 allowed sections."],
  };
}

function case2_mockPaidExplanationBasic(): RegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput({
    adapterMode: "mock",
    accessTier: "paid_explanation",
    contractRef: "test-paid-contract",
    allowedSectionTypes: ["what_this_means", "attention_points", "next_steps_safe"],
  });
  const result = runRuntimeLLMDraftMockAdapter(input);

  assert(result.accessTier === "paid_explanation", "accessTier must be 'paid_explanation'.", failures);
  assert(result.sectionCandidates.length === 3, "Expected exactly 3 section candidates.", failures);
  assertSectionPresent(result, "what_this_means", failures);
  assertSectionPresent(result, "attention_points", failures);
  assertSectionPresent(result, "next_steps_safe", failures);
  assertSectionAbsent(result, "document_type_signal", failures);
  assertSectionAbsent(result, "uncertainty_notice", failures);
  assertSectionAbsent(result, "review_recommendation", failures);
  assertSectionAbsent(result, "blocked_content_notice", failures);
  assertNeverUserVisibleInvariants(result, failures);

  return {
    caseNumber: 2,
    caseName: "mock paid_explanation basic — three allowed sections",
    passed: failures.length === 0,
    failures,
    result,
    notes: ["Only candidates for allowedSectionTypes are returned."],
  };
}

function case3_forbiddenMovesPropagated(): RegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput({
    activeForbiddenMoves: [
      "no_false_reassurance_framing",
      "no_calculated_amount_extraction",
    ],
  });
  const result = runRuntimeLLMDraftMockAdapter(input);

  assertDiagnosticPresent(result, "llm_adapter_forbidden_move_referenced", failures);
  assert(
    result.appliedForbiddenMoves.includes("no_false_reassurance_framing"),
    "appliedForbiddenMoves must include no_false_reassurance_framing.",
    failures,
  );
  assert(
    result.appliedForbiddenMoves.includes("no_calculated_amount_extraction"),
    "appliedForbiddenMoves must include no_calculated_amount_extraction.",
    failures,
  );
  assertNeverUserVisibleInvariants(result, failures);

  return {
    caseNumber: 3,
    caseName: "forbidden moves propagated",
    passed: failures.length === 0,
    failures,
    result,
    notes: [
      "activeForbiddenMoves are copied to appliedForbiddenMoves.",
      "llm_adapter_forbidden_move_referenced diagnostic is emitted.",
    ],
  };
}

function case4_requiredConstraintsPropagated(): RegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput({
    activeRequiredConstraints: ["required_uncertainty_wording"],
  });
  const result = runRuntimeLLMDraftMockAdapter(input);

  assertDiagnosticPresent(result, "llm_adapter_required_constraint_referenced", failures);
  assert(
    result.appliedRequiredConstraints.includes("required_uncertainty_wording"),
    "appliedRequiredConstraints must include required_uncertainty_wording.",
    failures,
  );
  assertDiagnosticAbsent(result, "llm_adapter_forbidden_move_referenced", failures);
  assertNeverUserVisibleInvariants(result, failures);

  return {
    caseNumber: 4,
    caseName: "required constraints propagated",
    passed: failures.length === 0,
    failures,
    result,
    notes: [
      "activeRequiredConstraints are copied to appliedRequiredConstraints.",
      "llm_adapter_required_constraint_referenced diagnostic is emitted.",
    ],
  };
}

function case5_liveLLMModeBlocked(): RegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput({
    adapterMode: "future_live_llm",
    contractRef: "test-live-contract",
  });
  const result = runRuntimeLLMDraftMockAdapter(input);

  assert(result.liveLLMCalled === false, "liveLLMCalled must be false even in future_live_llm mode.", failures);
  assert(result.sectionCandidates.length === 0, "sectionCandidates must be empty when live LLM is blocked.", failures);
  assertDiagnosticPresent(result, "llm_adapter_live_llm_forbidden", failures);
  assertDiagnosticAbsent(result, "llm_adapter_mock_used", failures);
  assert(result.neverUserVisible === true, "result.neverUserVisible must be true.", failures);
  assert(result.userVisibleOutputAllowed === false, "userVisibleOutputAllowed must be false.", failures);

  return {
    caseNumber: 5,
    caseName: "future_live_llm mode is explicitly blocked",
    passed: failures.length === 0,
    failures,
    result,
    notes: [
      "future_live_llm mode triggers llm_adapter_live_llm_forbidden and returns empty candidates.",
      "No LLM call is made.",
    ],
  };
}

function case6_blankContractRef(): RegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput({ contractRef: "" });
  const result = runRuntimeLLMDraftMockAdapter(input);

  assertDiagnosticPresent(result, "llm_adapter_missing_contract", failures);
  assertNeverUserVisibleInvariants(result, failures);

  return {
    caseNumber: 6,
    caseName: "blank contractRef emits missing_contract diagnostic",
    passed: failures.length === 0,
    failures,
    result,
    notes: ["A blank contractRef means no governance boundary is associated."],
  };
}

function case7_neverUserVisibleInvariant(): RegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput({
    allowedSectionTypes: [
      "document_type_signal",
      "what_this_means",
      "attention_points",
      "next_steps_safe",
      "uncertainty_notice",
      "review_recommendation",
      "blocked_content_notice",
    ],
  });
  const result = runRuntimeLLMDraftMockAdapter(input);

  assert(result.neverUserVisible === true, "result.neverUserVisible must be true.", failures);
  assert(result.userVisibleOutputAllowed === false, "userVisibleOutputAllowed must be false.", failures);
  assert(result.liveLLMCalled === false, "liveLLMCalled must be false.", failures);
  for (const candidate of result.sectionCandidates) {
    assert(
      candidate.neverUserVisible === true,
      `Section '${candidate.sectionType}': neverUserVisible must be true.`,
      failures,
    );
    assert(
      candidate.draftText.startsWith("[MOCK_DRAFT_NEVER_USER_VISIBLE]"),
      `Section '${candidate.sectionType}': draftText must start with [MOCK_DRAFT_NEVER_USER_VISIBLE].`,
      failures,
    );
  }
  assert(result.sectionCandidates.length === 7, "Expected 7 section candidates for all section types.", failures);

  return {
    caseNumber: 7,
    caseName: "neverUserVisible invariant — all sections and result",
    passed: failures.length === 0,
    failures,
    result,
    notes: [
      "Validates the neverUserVisible invariant across result and all section candidates.",
      "All draftText values must carry the [MOCK_DRAFT_NEVER_USER_VISIBLE] prefix.",
    ],
  };
}

function case8_allowedSectionFiltering(): RegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput({
    allowedSectionTypes: [
      "document_type_signal",
      "what_this_means",
      "uncertainty_notice",
      // next_steps_safe is intentionally excluded
    ],
  });
  const result = runRuntimeLLMDraftMockAdapter(input);

  assertSectionAbsent(result, "next_steps_safe", failures);
  assertSectionAbsent(result, "attention_points", failures);
  assertSectionAbsent(result, "review_recommendation", failures);
  assertSectionAbsent(result, "blocked_content_notice", failures);
  assertSectionPresent(result, "document_type_signal", failures);
  assertSectionPresent(result, "what_this_means", failures);
  assertSectionPresent(result, "uncertainty_notice", failures);
  assert(result.sectionCandidates.length === 3, "Expected exactly 3 candidates matching allowedSectionTypes.", failures);
  assertNeverUserVisibleInvariants(result, failures);

  return {
    caseNumber: 8,
    caseName: "allowed section filtering — excluded sections absent",
    passed: failures.length === 0,
    failures,
    result,
    notes: ["next_steps_safe is excluded from allowedSectionTypes and must not appear in output."],
  };
}

function case9_auditTraceParentsPreserved(): RegressionCaseResult {
  const failures: string[] = [];
  const traceIds = [
    "trace-parent-001",
    "trace-parent-002",
    "trace-parent-003",
  ] as const;
  const input = makeBaseInput({
    auditTraceParentIds: [...traceIds],
    contractRef: "test-trace-contract",
  });
  const result = runRuntimeLLMDraftMockAdapter(input);

  assert(
    result.auditTraceParentIds.length === traceIds.length,
    `Expected ${traceIds.length} auditTraceParentIds, got ${result.auditTraceParentIds.length}.`,
    failures,
  );
  for (const id of traceIds) {
    assert(
      result.auditTraceParentIds.includes(id),
      `Expected auditTraceParentIds to include '${id}'.`,
      failures,
    );
  }
  assertNeverUserVisibleInvariants(result, failures);

  return {
    caseNumber: 9,
    caseName: "audit trace parent IDs preserved exactly",
    passed: failures.length === 0,
    failures,
    result,
    notes: ["auditTraceParentIds from input must be copied verbatim to the result."],
  };
}

function case10_unsafeFixtureFlagBehavior(): RegressionCaseResult {
  const failures: string[] = [];
  const notes: string[] = [];

  notes.push(
    "Unsafe fixture path is implemented. Triggered by " +
      `contractRef === '${MOCK_UNSAFE_FIXTURE_CONTRACT_REF}'.`,
  );

  const input = makeBaseInput({
    contractRef: MOCK_UNSAFE_FIXTURE_CONTRACT_REF,
    allowedSectionTypes: ["document_type_signal"],
  });
  const result = runRuntimeLLMDraftMockAdapter(input);

  assertDiagnosticPresent(result, "llm_adapter_unsafe_fixture_flagged", failures);

  const unsafeSection = result.sectionCandidates.find(
    (c) => c.safetyFlags.length > 0,
  );
  assert(
    unsafeSection !== undefined,
    "Expected at least one section candidate with non-empty safetyFlags.",
    failures,
  );
  if (unsafeSection !== undefined) {
    assert(
      unsafeSection.safetyFlags.includes("contains_deadline_claim"),
      "Unsafe fixture section must include 'contains_deadline_claim' safety flag.",
      failures,
    );
    assert(
      unsafeSection.safetyFlags.includes("contains_legal_verdict"),
      "Unsafe fixture section must include 'contains_legal_verdict' safety flag.",
      failures,
    );
    assert(
      unsafeSection.neverUserVisible === true,
      "Unsafe fixture section must still carry neverUserVisible: true.",
      failures,
    );
  }

  assert(result.neverUserVisible === true, "result.neverUserVisible must be true.", failures);
  assert(result.liveLLMCalled === false, "liveLLMCalled must be false.", failures);
  assert(result.userVisibleOutputAllowed === false, "userVisibleOutputAllowed must be false.", failures);

  notes.push(
    "The unsafe fixture section carries safety flags that must cause the " +
      "LLM output contract validator (Phase 8.2G-2) to block that section.",
  );
  notes.push(
    "The section is still marked neverUserVisible: true — the governance " +
      "invariant is preserved regardless of unsafe flag state.",
  );

  return {
    caseNumber: 10,
    caseName: "unsafe fixture flag behavior — controlled path",
    passed: failures.length === 0,
    failures,
    result,
    notes,
  };
}

// ── Main scaffold function ────────────────────────────────────────────────────

/**
 * Runs all 10 regression cases for the Runtime LLM Draft Mock Adapter.
 *
 * Returns a summary with `allPassed`, per-case results, and scaffoldVersion.
 * No Jest/Vitest. No CI hook. Safe to call in governance-kernel dry-run context.
 *
 * Pure function — no side effects, no persistence, no logging.
 */
export function runRuntimeLLMDraftAdapterRegressionScaffold(): RegressionScaffoldResult {
  const caseResults: RegressionCaseResult[] = [
    case1_mockFreePreviewBasic(),
    case2_mockPaidExplanationBasic(),
    case3_forbiddenMovesPropagated(),
    case4_requiredConstraintsPropagated(),
    case5_liveLLMModeBlocked(),
    case6_blankContractRef(),
    case7_neverUserVisibleInvariant(),
    case8_allowedSectionFiltering(),
    case9_auditTraceParentsPreserved(),
    case10_unsafeFixtureFlagBehavior(),
  ];

  const passCount = caseResults.filter((c) => c.passed).length;
  const failCount = caseResults.length - passCount;
  const allPassed = failCount === 0;

  const notes: string[] = [
    `Scaffold version: ${REGRESSION_SCAFFOLD_VERSION}`,
    `Cases run: ${caseResults.length}`,
    `Passed: ${passCount}`,
    `Failed: ${failCount}`,
    "No live LLM called. No API keys. No env vars. No user-visible output.",
    "liveLLMCalled: false and userVisibleOutputAllowed: false in all cases.",
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
