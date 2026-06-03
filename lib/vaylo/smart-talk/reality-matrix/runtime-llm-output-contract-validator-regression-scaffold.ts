/**
 * Regression scaffold for the Runtime LLM Output Contract Validator (Phase 8.2G-2).
 *
 * Runs 14 cases covering all validator rules:
 *  - visibility invariants (liveLLMCalled, userVisibleOutputAllowed, neverUserVisible)
 *  - unsafe safety flag rejection
 *  - forbidden adapter mode rejection
 *  - allowed section type membership
 *  - forbidden move and required constraint coverage
 *  - mock prefix discipline
 *  - empty draft text
 *  - user-visible diagnostic safety flag
 *  - correct acceptance path
 *
 * Uses `runRuntimeLLMDraftMockAdapter` (Phase 8.2G-1) for normal fixtures
 * where possible. Tampered results are constructed via object spread for
 * cases that test defensive runtime invariant checks.
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
  RuntimeLLMDraftAdapterInput,
  RuntimeLLMDraftAdapterResult,
  RuntimeLLMDraftSectionCandidate,
} from "./runtime-llm-draft-adapter-types";
import {
  RUNTIME_LLM_OUTPUT_CONTRACT_VALIDATOR_VERSION,
  validateRuntimeLLMOutputContract,
} from "./validate-runtime-llm-output-contract";
import type {
  RuntimeLLMOutputContractValidationResult,
  RuntimeLLMOutputContractVerdict,
  RuntimeLLMOutputContractViolationCode,
} from "./runtime-llm-output-contract-validator-types";

export const REGRESSION_SCAFFOLD_VERSION =
  "8.2g-2-runtime-llm-output-contract-validator-regression-v1";

// ── Result types ──────────────────────────────────────────────────────────────

export interface ValidatorRegressionCaseResult {
  readonly caseNumber: number;
  readonly caseName: string;
  readonly passed: boolean;
  readonly failures: readonly string[];
  readonly validationResult: RuntimeLLMOutputContractValidationResult | null;
  readonly notes?: readonly string[];
}

export interface ValidatorRegressionScaffoldResult {
  readonly scaffoldVersion: string;
  readonly allPassed: boolean;
  readonly passCount: number;
  readonly failCount: number;
  readonly caseResults: readonly ValidatorRegressionCaseResult[];
  readonly notes: readonly string[];
}

// ── Assertion helpers ─────────────────────────────────────────────────────────

function assert(
  condition: boolean,
  message: string,
  failures: string[],
): void {
  if (!condition) failures.push(message);
}

function assertVerdict(
  vr: RuntimeLLMOutputContractValidationResult,
  expected: RuntimeLLMOutputContractVerdict,
  failures: string[],
): void {
  assert(
    vr.verdict === expected,
    `Expected verdict '${expected}' but got '${vr.verdict}'.`,
    failures,
  );
}

function assertViolationPresent(
  vr: RuntimeLLMOutputContractValidationResult,
  code: RuntimeLLMOutputContractViolationCode,
  failures: string[],
): void {
  const inResult = vr.violations.includes(code);
  const inSections = vr.sectionResults.some((sr) => sr.violations.includes(code));
  assert(
    inResult || inSections,
    `Expected violation '${code}' in result or section violations but was absent.`,
    failures,
  );
}

function assertViolationAbsent(
  vr: RuntimeLLMOutputContractValidationResult,
  code: RuntimeLLMOutputContractViolationCode,
  failures: string[],
): void {
  const inResult = vr.violations.includes(code);
  const inSections = vr.sectionResults.some((sr) => sr.violations.includes(code));
  assert(
    !inResult && !inSections,
    `Unexpected violation '${code}' found in result or section violations.`,
    failures,
  );
}

function assertBaseInvariants(
  vr: RuntimeLLMOutputContractValidationResult,
  failures: string[],
): void {
  assert(vr.liveLLMCalled === false, "liveLLMCalled must be false.", failures);
  assert(vr.userVisibleOutputAllowed === false, "userVisibleOutputAllowed must be false.", failures);
  assert(vr.neverUserVisible === true, "neverUserVisible must be true.", failures);
  assert(
    vr.acceptedForUserVisibleAssembly === false,
    "acceptedForUserVisibleAssembly must always be false.",
    failures,
  );
}

// ── Input/result factories ────────────────────────────────────────────────────

function makeBaseInput(
  overrides: Partial<RuntimeLLMDraftAdapterInput> = {},
): RuntimeLLMDraftAdapterInput {
  return {
    adapterMode: "mock",
    accessTier: "free_preview",
    contractRef: "test-contract-8.2g-2",
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

function runAdapter(
  input: RuntimeLLMDraftAdapterInput,
): RuntimeLLMDraftAdapterResult {
  return runRuntimeLLMDraftMockAdapter(input);
}

// ── Cases ─────────────────────────────────────────────────────────────────────

function case1_validMockFreePreview(): ValidatorRegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput({
    allowedSectionTypes: ["document_type_signal", "uncertainty_notice"],
  });
  const result = runAdapter(input);
  const vr = validateRuntimeLLMOutputContract({ input, result });

  assertVerdict(vr, "accepted_for_next_gate", failures);
  assert(vr.acceptedForWordingGate === true, "acceptedForWordingGate must be true.", failures);
  assert(
    vr.acceptedForUserVisibleAssembly === false,
    "acceptedForUserVisibleAssembly must be false.",
    failures,
  );
  assertBaseInvariants(vr, failures);
  assert(
    vr.sectionResults.every((sr) => sr.accepted),
    "All section results must be accepted.",
    failures,
  );

  return {
    caseNumber: 1,
    caseName: "valid mock free_preview — accepted_for_next_gate",
    passed: failures.length === 0,
    failures,
    validationResult: vr,
    notes: ["Happy path: mock adapter output passes all contract rules."],
  };
}

function case2_validMockPaid(): ValidatorRegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput({
    accessTier: "paid_explanation",
    contractRef: "test-paid-contract-8.2g-2",
    allowedSectionTypes: [
      "what_this_means",
      "attention_points",
      "next_steps_safe",
      "review_recommendation",
    ],
  });
  const result = runAdapter(input);
  const vr = validateRuntimeLLMOutputContract({ input, result });

  assertVerdict(vr, "accepted_for_next_gate", failures);
  assert(vr.acceptedForWordingGate === true, "acceptedForWordingGate must be true.", failures);
  assert(vr.sectionResults.length === 4, "Expected 4 section results.", failures);
  assertBaseInvariants(vr, failures);

  return {
    caseNumber: 2,
    caseName: "valid mock paid_explanation — accepted_for_next_gate",
    passed: failures.length === 0,
    failures,
    validationResult: vr,
    notes: ["4 allowed paid sections all pass contract validation."],
  };
}

function case3_unsafeFixtureFlags(): ValidatorRegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput({
    contractRef: MOCK_UNSAFE_FIXTURE_CONTRACT_REF,
    allowedSectionTypes: ["document_type_signal", "what_this_means"],
  });
  const result = runAdapter(input);
  const vr = validateRuntimeLLMOutputContract({ input, result });

  assertVerdict(vr, "rejected_unsafe_draft", failures);
  assert(vr.acceptedForWordingGate === false, "acceptedForWordingGate must be false.", failures);
  assertViolationPresent(vr, "llm_output_unsafe_safety_flag", failures);
  assertBaseInvariants(vr, failures);

  return {
    caseNumber: 3,
    caseName: "unsafe fixture flags — rejected_unsafe_draft",
    passed: failures.length === 0,
    failures,
    validationResult: vr,
    notes: [
      "The unsafe fixture path from 8.2G-1 triggers llm_output_unsafe_safety_flag.",
      "Verdict is rejected_unsafe_draft.",
    ],
  };
}

function case4_futureLiveLLMModeRejected(): ValidatorRegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput({ adapterMode: "future_live_llm" });
  const result = runAdapter(input);
  const vr = validateRuntimeLLMOutputContract({ input, result });

  assertVerdict(vr, "rejected_contract_violation", failures);
  assert(vr.acceptedForWordingGate === false, "acceptedForWordingGate must be false.", failures);
  assertViolationPresent(vr, "llm_output_forbidden_adapter_mode", failures);
  assertBaseInvariants(vr, failures);

  return {
    caseNumber: 4,
    caseName: "future_live_llm mode — rejected_contract_violation",
    passed: failures.length === 0,
    failures,
    validationResult: vr,
    notes: [
      "input.adapterMode === 'future_live_llm' is rejected by the contract validator.",
      "Violation: llm_output_forbidden_adapter_mode.",
    ],
  };
}

function case5_liveLLMCalledForcedTrue(): ValidatorRegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput();
  const result = runAdapter(input);

  // Tamper: force liveLLMCalled to true via cast
  const tamperedResult = {
    ...result,
    liveLLMCalled: true as unknown as false,
  } satisfies RuntimeLLMDraftAdapterResult;

  const vr = validateRuntimeLLMOutputContract({ input, result: tamperedResult });

  assertVerdict(vr, "rejected_visibility_violation", failures);
  assertViolationPresent(vr, "llm_output_live_llm_called", failures);
  assert(vr.acceptedForWordingGate === false, "acceptedForWordingGate must be false.", failures);
  assertBaseInvariants(vr, failures);

  return {
    caseNumber: 5,
    caseName: "liveLLMCalled forced true — rejected_visibility_violation",
    passed: failures.length === 0,
    failures,
    validationResult: vr,
    notes: [
      "Defensive runtime check catches liveLLMCalled !== false even though the type is literal false.",
    ],
  };
}

function case6_userVisibleOutputForcedTrue(): ValidatorRegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput();
  const result = runAdapter(input);

  const tamperedResult = {
    ...result,
    userVisibleOutputAllowed: true as unknown as false,
  } satisfies RuntimeLLMDraftAdapterResult;

  const vr = validateRuntimeLLMOutputContract({ input, result: tamperedResult });

  assertVerdict(vr, "rejected_visibility_violation", failures);
  assertViolationPresent(vr, "llm_output_user_visible_enabled", failures);
  assertBaseInvariants(vr, failures);

  return {
    caseNumber: 6,
    caseName: "userVisibleOutputAllowed forced true — rejected_visibility_violation",
    passed: failures.length === 0,
    failures,
    validationResult: vr,
    notes: ["Defensive check for userVisibleOutputAllowed !== false."],
  };
}

function case7_resultNeverUserVisibleForcedFalse(): ValidatorRegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput();
  const result = runAdapter(input);

  const tamperedResult = {
    ...result,
    neverUserVisible: false as unknown as true,
  } satisfies RuntimeLLMDraftAdapterResult;

  const vr = validateRuntimeLLMOutputContract({ input, result: tamperedResult });

  assertVerdict(vr, "rejected_visibility_violation", failures);
  assertViolationPresent(vr, "llm_output_result_not_never_user_visible", failures);
  assertBaseInvariants(vr, failures);

  return {
    caseNumber: 7,
    caseName: "result.neverUserVisible forced false — rejected_visibility_violation",
    passed: failures.length === 0,
    failures,
    validationResult: vr,
    notes: ["Defensive check for result.neverUserVisible !== true."],
  };
}

function case8_sectionNeverUserVisibleForcedFalse(): ValidatorRegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput({
    allowedSectionTypes: ["document_type_signal"],
  });
  const result = runAdapter(input);

  // Tamper: override neverUserVisible on the first section
  const tamperedSection: RuntimeLLMDraftSectionCandidate = {
    ...result.sectionCandidates[0]!,
    neverUserVisible: false as unknown as true,
  };
  const tamperedResult: RuntimeLLMDraftAdapterResult = {
    ...result,
    sectionCandidates: [tamperedSection],
  };

  const vr = validateRuntimeLLMOutputContract({ input, result: tamperedResult });

  assertVerdict(vr, "rejected_visibility_violation", failures);
  assertViolationPresent(vr, "llm_output_section_not_never_user_visible", failures);
  assertBaseInvariants(vr, failures);

  return {
    caseNumber: 8,
    caseName: "section.neverUserVisible forced false — rejected_visibility_violation",
    passed: failures.length === 0,
    failures,
    validationResult: vr,
    notes: ["Defensive check for section.neverUserVisible !== true."],
  };
}

function case9_sectionTypeNotAllowed(): ValidatorRegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput({
    allowedSectionTypes: ["document_type_signal", "uncertainty_notice"],
  });
  const result = runAdapter(input);

  // Inject an extra section with a type not in allowedSectionTypes
  const extraSection: RuntimeLLMDraftSectionCandidate = {
    sectionType: "next_steps_safe",
    draftText: "[MOCK_DRAFT_NEVER_USER_VISIBLE] Injected not-allowed section.",
    safetyFlags: [],
    sourceBound: false,
    neverUserVisible: true,
    notes: ["Injected for regression testing."],
  };
  const tamperedResult: RuntimeLLMDraftAdapterResult = {
    ...result,
    sectionCandidates: [...result.sectionCandidates, extraSection],
  };

  const vr = validateRuntimeLLMOutputContract({ input, result: tamperedResult });

  assertVerdict(vr, "rejected_contract_violation", failures);
  assertViolationPresent(vr, "llm_output_section_type_not_allowed", failures);
  assertBaseInvariants(vr, failures);

  return {
    caseNumber: 9,
    caseName: "section type not in allowedSectionTypes — rejected_contract_violation",
    passed: failures.length === 0,
    failures,
    validationResult: vr,
    notes: ["next_steps_safe is not in allowedSectionTypes; its presence is a contract violation."],
  };
}

function case10_missingForbiddenMoveCoverage(): ValidatorRegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput({
    activeForbiddenMoves: ["no_false_reassurance_framing", "no_calculated_amount_extraction"],
  });
  const result = runAdapter(input);

  // Tamper: remove one forbidden move from appliedForbiddenMoves
  const tamperedResult: RuntimeLLMDraftAdapterResult = {
    ...result,
    appliedForbiddenMoves: ["no_false_reassurance_framing"],
  };

  const vr = validateRuntimeLLMOutputContract({ input, result: tamperedResult });

  assertVerdict(vr, "rejected_contract_violation", failures);
  assertViolationPresent(vr, "llm_output_missing_forbidden_move_coverage", failures);
  assert(
    !vr.validatedForbiddenMoves.includes("no_calculated_amount_extraction"),
    "no_calculated_amount_extraction must not be in validatedForbiddenMoves.",
    failures,
  );
  assert(
    vr.validatedForbiddenMoves.includes("no_false_reassurance_framing"),
    "no_false_reassurance_framing must be in validatedForbiddenMoves.",
    failures,
  );
  assertBaseInvariants(vr, failures);

  return {
    caseNumber: 10,
    caseName: "missing forbidden move coverage — rejected_contract_violation",
    passed: failures.length === 0,
    failures,
    validationResult: vr,
    notes: ["no_calculated_amount_extraction is missing from appliedForbiddenMoves."],
  };
}

function case11_missingRequiredConstraintCoverage(): ValidatorRegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput({
    activeRequiredConstraints: ["required_uncertainty_wording"],
  });
  const result = runAdapter(input);

  // Tamper: empty out appliedRequiredConstraints
  const tamperedResult: RuntimeLLMDraftAdapterResult = {
    ...result,
    appliedRequiredConstraints: [],
  };

  const vr = validateRuntimeLLMOutputContract({ input, result: tamperedResult });

  assertVerdict(vr, "rejected_contract_violation", failures);
  assertViolationPresent(vr, "llm_output_missing_required_constraint_coverage", failures);
  assert(
    vr.validatedRequiredConstraints.length === 0,
    "validatedRequiredConstraints must be empty when coverage is missing.",
    failures,
  );
  assertBaseInvariants(vr, failures);

  return {
    caseNumber: 11,
    caseName: "missing required constraint coverage — rejected_contract_violation",
    passed: failures.length === 0,
    failures,
    validationResult: vr,
    notes: ["required_uncertainty_wording is missing from appliedRequiredConstraints."],
  };
}

function case12_missingMockPrefix(): ValidatorRegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput({
    allowedSectionTypes: ["document_type_signal"],
  });
  const result = runAdapter(input);

  // Tamper: strip the mock prefix from draftText
  const tamperedSection: RuntimeLLMDraftSectionCandidate = {
    ...result.sectionCandidates[0]!,
    draftText: "This text has no prefix — as if it were final user text.",
  };
  const tamperedResult: RuntimeLLMDraftAdapterResult = {
    ...result,
    sectionCandidates: [tamperedSection],
  };

  const vr = validateRuntimeLLMOutputContract({ input, result: tamperedResult });

  assertVerdict(vr, "rejected_visibility_violation", failures);
  assertViolationPresent(vr, "llm_output_missing_mock_prefix", failures);
  assertBaseInvariants(vr, failures);

  return {
    caseNumber: 12,
    caseName: "missing mock prefix — rejected_visibility_violation",
    passed: failures.length === 0,
    failures,
    validationResult: vr,
    notes: [
      "draftText without [MOCK_DRAFT_NEVER_USER_VISIBLE] prefix triggers a visibility violation.",
    ],
  };
}

function case13_emptyDraftText(): ValidatorRegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput({
    allowedSectionTypes: ["document_type_signal"],
  });
  const result = runAdapter(input);

  // Tamper: use the prefix only — no actual content follows the prefix.
  // This passes the prefix check (Rule 9) but fails the blank-content
  // check (Rule 10), isolating rejected_contract_violation.
  const tamperedSection: RuntimeLLMDraftSectionCandidate = {
    ...result.sectionCandidates[0]!,
    draftText: "[MOCK_DRAFT_NEVER_USER_VISIBLE]",
  };
  const tamperedResult: RuntimeLLMDraftAdapterResult = {
    ...result,
    sectionCandidates: [tamperedSection],
  };

  const vr = validateRuntimeLLMOutputContract({ input, result: tamperedResult });

  assertVerdict(vr, "rejected_contract_violation", failures);
  assertViolationPresent(vr, "llm_output_empty_draft_text", failures);
  assertViolationAbsent(vr, "llm_output_missing_mock_prefix", failures);
  assertBaseInvariants(vr, failures);

  return {
    caseNumber: 13,
    caseName: "empty draft content (prefix only, no body) — rejected_contract_violation",
    passed: failures.length === 0,
    failures,
    validationResult: vr,
    notes: [
      "draftText = '[MOCK_DRAFT_NEVER_USER_VISIBLE]' passes the prefix check (Rule 9) " +
        "but fails the blank-content check (Rule 10), producing rejected_contract_violation.",
      "This isolates the two rules independently.",
    ],
  };
}

function case14_userVisibleDiagnosticFlag(): ValidatorRegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput({
    allowedSectionTypes: ["what_this_means"],
  });
  const result = runAdapter(input);

  // Inject a section with contains_user_visible_diagnostic safety flag
  const sectionWithDiagnosticFlag: RuntimeLLMDraftSectionCandidate = {
    sectionType: "what_this_means",
    draftText: "[MOCK_DRAFT_NEVER_USER_VISIBLE] Section exposing diagnostic code.",
    safetyFlags: ["contains_user_visible_diagnostic"],
    sourceBound: false,
    neverUserVisible: true,
    notes: ["Injected for regression case 14."],
  };
  const tamperedResult: RuntimeLLMDraftAdapterResult = {
    ...result,
    sectionCandidates: [sectionWithDiagnosticFlag],
  };

  const vr = validateRuntimeLLMOutputContract({ input, result: tamperedResult });

  assertVerdict(vr, "rejected_unsafe_draft", failures);
  assertViolationPresent(vr, "llm_output_unsafe_safety_flag", failures);
  assertViolationPresent(vr, "llm_output_user_visible_diagnostic_detected", failures);
  assertBaseInvariants(vr, failures);

  return {
    caseNumber: 14,
    caseName:
      "contains_user_visible_diagnostic safety flag — rejected_unsafe_draft + user_visible_diagnostic_detected",
    passed: failures.length === 0,
    failures,
    validationResult: vr,
    notes: [
      "contains_user_visible_diagnostic triggers both llm_output_unsafe_safety_flag " +
        "and llm_output_user_visible_diagnostic_detected.",
    ],
  };
}

// ── Main scaffold function ─────────────────────────────────────────────────────

/**
 * Runs all 14 regression cases for the Runtime LLM Output Contract Validator.
 *
 * Returns summary with `allPassed`, per-case results, and scaffoldVersion.
 * No Jest/Vitest. No CI hook. Safe for governance-kernel dry-run context.
 *
 * Pure function — no side effects, no persistence.
 */
export function runRuntimeLLMOutputContractValidatorRegressionScaffold(): ValidatorRegressionScaffoldResult {
  const caseResults: ValidatorRegressionCaseResult[] = [
    case1_validMockFreePreview(),
    case2_validMockPaid(),
    case3_unsafeFixtureFlags(),
    case4_futureLiveLLMModeRejected(),
    case5_liveLLMCalledForcedTrue(),
    case6_userVisibleOutputForcedTrue(),
    case7_resultNeverUserVisibleForcedFalse(),
    case8_sectionNeverUserVisibleForcedFalse(),
    case9_sectionTypeNotAllowed(),
    case10_missingForbiddenMoveCoverage(),
    case11_missingRequiredConstraintCoverage(),
    case12_missingMockPrefix(),
    case13_emptyDraftText(),
    case14_userVisibleDiagnosticFlag(),
  ];

  const passCount = caseResults.filter((c) => c.passed).length;
  const failCount = caseResults.length - passCount;
  const allPassed = failCount === 0;

  const notes: string[] = [
    `Scaffold version: ${REGRESSION_SCAFFOLD_VERSION}`,
    `Validator version: ${RUNTIME_LLM_OUTPUT_CONTRACT_VALIDATOR_VERSION}`,
    `Cases run: ${caseResults.length}`,
    `Passed: ${passCount}`,
    `Failed: ${failCount}`,
    "No live LLM called. No API keys. No env vars. No user-visible output.",
    "acceptedForUserVisibleAssembly is false in all cases.",
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
