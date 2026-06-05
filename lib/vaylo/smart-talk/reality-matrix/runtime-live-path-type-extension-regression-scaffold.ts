/**
 * Runtime Live Path Type Extension regression scaffold (Phase 8.2G-5A).
 *
 * Validates the Phase 8.2G-5A live sandbox path through the output contract
 * validator across 14 cases. Also verifies the guard proof validator.
 * The existing 8.2G-2 mock path is confirmed unchanged.
 *
 * Cases:
 *  1.  Existing mock valid path still accepted (mock path regression)
 *  2.  Existing mock unsafe path still rejected (mock path regression)
 *  3.  future_live_llm with liveLLMCalled true but missing proof
 *  4.  future_live_llm with invalid proof (syntheticOnly forced false)
 *  5.  future_live_llm with valid proof and valid live prefix → accepted
 *  6.  Live sandbox result missing [LIVE_SANDBOX_DRAFT_NEVER_USER_VISIBLE] prefix
 *  7.  Live sandbox result with safety flag
 *  8.  Live sandbox result missing forbidden move coverage
 *  9.  Live sandbox result missing required constraint coverage
 * 10.  Guard proof validator: missing proof → status missing
 * 11.  Guard proof validator: syntheticOnly forced false → live_path_proof_non_synthetic_fixture
 * 12.  Guard proof validator: all valid → status proven, live_path_proof_present
 * 13.  acceptedForUserVisibleAssembly remains false in mock and live paths
 * 14.  userVisibleOutputAllowed remains false in mock and live paths
 *
 * No Jest. No Vitest. No CI hook. No live LLM call. No API key required.
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
  validateRuntimeLLMOutputContract,
} from "./validate-runtime-llm-output-contract";
import type {
  RuntimeLLMOutputContractDraftResult,
  RuntimeLLMOutputContractValidationResult,
  RuntimeLLMOutputContractVerdict,
  RuntimeLLMOutputContractViolationCode,
} from "./runtime-llm-output-contract-validator-types";
import {
  validateRuntimeLiveSandboxGuardProof,
  LIVE_SANDBOX_DRAFT_TEXT_PREFIX,
} from "./runtime-live-path-type-extension-types";
import type {
  RuntimeLiveSandboxGuardProof,
  RuntimeLiveSandboxGuardProofDiagnosticCode,
  RuntimeLiveSandboxGuardProofValidationResult,
} from "./runtime-live-path-type-extension-types";
import type { RuntimeLiveLLMSandboxDraftCandidateResult } from "./runtime-live-llm-sandbox-types";

export const LIVE_PATH_EXTENSION_REGRESSION_SCAFFOLD_VERSION =
  "8.2g-5a-live-path-type-extension-regression-scaffold-v1";

// ── Result types ──────────────────────────────────────────────────────────────

export interface LivePathExtensionRegressionCaseResult {
  readonly caseNumber: number;
  readonly caseName: string;
  readonly passed: boolean;
  readonly failures: readonly string[];
  readonly validationResult?: RuntimeLLMOutputContractValidationResult;
  readonly proofValidationResult?: RuntimeLiveSandboxGuardProofValidationResult;
  readonly notes?: readonly string[];
}

export interface LivePathExtensionRegressionScaffoldResult {
  readonly scaffoldVersion: string;
  readonly allPassed: boolean;
  readonly passCount: number;
  readonly failCount: number;
  readonly caseResults: readonly LivePathExtensionRegressionCaseResult[];
  readonly notes: readonly string[];
}

// ── Assertion helpers ─────────────────────────────────────────────────────────

function fail(message: string, failures: string[]): void {
  failures.push(message);
}

function assertEq<T>(
  actual: T,
  expected: T,
  label: string,
  failures: string[],
): void {
  if (actual !== expected) {
    fail(`${label}: expected ${String(expected)}, got ${String(actual)}`, failures);
  }
}

function assertVerdict(
  vr: RuntimeLLMOutputContractValidationResult,
  expected: RuntimeLLMOutputContractVerdict,
  failures: string[],
): void {
  assertEq(vr.verdict, expected, "verdict", failures);
}

function assertViolationPresent(
  vr: RuntimeLLMOutputContractValidationResult,
  code: RuntimeLLMOutputContractViolationCode,
  failures: string[],
): void {
  const inResult = vr.violations.includes(code);
  const inSections = vr.sectionResults.some((sr) => sr.violations.includes(code));
  if (!inResult && !inSections) {
    fail(`Expected violation '${code}' but was absent.`, failures);
  }
}

function assertProofDiag(
  pvr: RuntimeLiveSandboxGuardProofValidationResult,
  code: RuntimeLiveSandboxGuardProofDiagnosticCode,
  failures: string[],
): void {
  if (!pvr.diagnostics.includes(code)) {
    fail(`Expected proof diagnostic '${code}' but was absent.`, failures);
  }
}

// ── Shared fixtures and factories ─────────────────────────────────────────────

function makeBaseInput(
  overrides: Partial<RuntimeLLMDraftAdapterInput> = {},
): RuntimeLLMDraftAdapterInput {
  return {
    adapterMode: "mock",
    accessTier: "free_preview",
    contractRef: "8.2g-5a-scaffold-contract",
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

/** A minimal valid guard proof for testing. */
const VALID_GUARD_PROOF: RuntimeLiveSandboxGuardProof = {
  proofKind: "live_llm_sandbox_guard_proof",
  status: "proven",
  sandboxRunId: "8.2g-5a-scaffold-run-001",
  fixtureId: "8.2g-5a-scaffold-fixture-001",
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
  notes: ["Minimal valid proof for regression scaffold."],
};

/** A minimal live sandbox draft candidate with valid proof and valid prefix. */
function makeLiveSandboxDraftResult(
  overrides: Partial<{
    sectionType: RuntimeLLMDraftAdapterResult["sectionCandidates"][number]["sectionType"];
    draftText: string;
    safetyFlags: readonly RuntimeLLMDraftSectionCandidate["safetyFlags"][number][];
    appliedForbiddenMoves: readonly string[];
    appliedRequiredConstraints: readonly string[];
    sandboxGuardProof: RuntimeLiveSandboxGuardProof | undefined;
    liveLLMCalled: boolean;
  }> = {},
): RuntimeLiveLLMSandboxDraftCandidateResult {
  const sectionType = overrides.sectionType ?? "document_type_signal";
  const draftText =
    overrides.draftText ??
    `${LIVE_SANDBOX_DRAFT_TEXT_PREFIX} Synthetic fixture section candidate.`;
  return {
    sandboxRunId: "8.2g-5a-scaffold-run-001",
    adapterMode: "future_live_llm",
    accessTier: "free_preview",
    fixtureId: "8.2g-5a-scaffold-fixture-001",
    sectionCandidates: [
      {
        sectionType,
        draftText,
        safetyFlags: overrides.safetyFlags ?? [],
        sourceBound: true,
        neverUserVisible: true,
      },
    ],
    appliedForbiddenMoves: overrides.appliedForbiddenMoves ?? [],
    appliedRequiredConstraints: overrides.appliedRequiredConstraints ?? [],
    liveLLMCalled: true,
    userVisibleOutputAllowed: false,
    neverUserVisible: true,
    sandboxGuardProof: overrides.sandboxGuardProof ?? VALID_GUARD_PROOF,
    modelingGapNote:
      "Phase 8.2G-5A: guard proof present; compatible with output contract validator live path.",
    notes: ["Scaffold-constructed live sandbox draft result."],
  };
}

// ── Cases ─────────────────────────────────────────────────────────────────────

// Case 1: existing mock valid path still accepted
function case1_mockValidPathAccepted(): LivePathExtensionRegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput();
  const result = runRuntimeLLMDraftMockAdapter(input);
  const vr = validateRuntimeLLMOutputContract({ input, result });

  assertVerdict(vr, "accepted_for_next_gate", failures);
  assertEq(vr.acceptedForWordingGate, true, "acceptedForWordingGate", failures);
  assertEq(vr.acceptedForUserVisibleAssembly, false, "acceptedForUserVisibleAssembly", failures);
  assertEq(vr.userVisibleOutputAllowed, false, "userVisibleOutputAllowed", failures);
  assertEq(vr.liveLLMCalled, false, "liveLLMCalled (mock path)", failures);
  assertEq(vr.neverUserVisible, true, "neverUserVisible", failures);

  return {
    caseNumber: 1,
    caseName: "mock valid path — still accepted_for_next_gate (Phase 8.2G-5A regression)",
    passed: failures.length === 0,
    failures,
    validationResult: vr,
    notes: ["Confirms mock path is unchanged by Phase 8.2G-5A extension."],
  };
}

// Case 2: existing mock unsafe path still rejected
function case2_mockUnsafePathRejected(): LivePathExtensionRegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput({
    contractRef: MOCK_UNSAFE_FIXTURE_CONTRACT_REF,
    allowedSectionTypes: ["document_type_signal", "what_this_means"],
  });
  const result = runRuntimeLLMDraftMockAdapter(input);
  const vr = validateRuntimeLLMOutputContract({ input, result });

  assertVerdict(vr, "rejected_unsafe_draft", failures);
  assertViolationPresent(vr, "llm_output_unsafe_safety_flag", failures);
  assertEq(vr.liveLLMCalled, false, "liveLLMCalled (mock path)", failures);
  assertEq(vr.acceptedForUserVisibleAssembly, false, "acceptedForUserVisibleAssembly", failures);

  return {
    caseNumber: 2,
    caseName: "mock unsafe path — still rejected_unsafe_draft (Phase 8.2G-5A regression)",
    passed: failures.length === 0,
    failures,
    validationResult: vr,
    notes: ["Confirms mock unsafe path is unchanged by Phase 8.2G-5A extension."],
  };
}

// Case 3: future_live_llm with liveLLMCalled true but missing proof
function case3_liveSandboxMissingProof(): LivePathExtensionRegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput({ adapterMode: "future_live_llm" });

  // Construct a result with adapterMode: future_live_llm, liveLLMCalled: true, NO proof
  const resultNoProof: RuntimeLLMOutputContractDraftResult = {
    adapterMode: "future_live_llm",
    accessTier: "free_preview",
    sectionCandidates: [
      {
        sectionType: "document_type_signal",
        draftText: `${LIVE_SANDBOX_DRAFT_TEXT_PREFIX} No-proof candidate.`,
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
    // sandboxGuardProof intentionally absent
  };

  const vr = validateRuntimeLLMOutputContract({ input, result: resultNoProof });

  assertVerdict(vr, "rejected_contract_violation", failures);
  assertViolationPresent(vr, "llm_output_live_sandbox_proof_missing", failures);
  assertEq(vr.liveLLMCalled, false, "liveLLMCalled should be false (no accepted proof)", failures);
  assertEq(vr.acceptedForUserVisibleAssembly, false, "acceptedForUserVisibleAssembly", failures);

  return {
    caseNumber: 3,
    caseName: "live path with liveLLMCalled true but missing proof → rejected_contract_violation",
    passed: failures.length === 0,
    failures,
    validationResult: vr,
    notes: ["Confirms that live sandbox path requires a valid guard proof."],
  };
}

// Case 4: future_live_llm with invalid proof (syntheticOnly forced false)
function case4_liveSandboxInvalidProof(): LivePathExtensionRegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput({ adapterMode: "future_live_llm" });

  const invalidProof: RuntimeLiveSandboxGuardProof = {
    ...VALID_GUARD_PROOF,
    syntheticOnly: false as unknown as true, // force invalid
  };

  const resultInvalidProof = makeLiveSandboxDraftResult({ sandboxGuardProof: invalidProof });

  const vr = validateRuntimeLLMOutputContract({ input, result: resultInvalidProof });

  assertVerdict(vr, "rejected_contract_violation", failures);
  assertViolationPresent(vr, "llm_output_live_sandbox_proof_invalid", failures);
  assertEq(vr.liveLLMCalled, false, "liveLLMCalled should be false (invalid proof)", failures);

  return {
    caseNumber: 4,
    caseName: "live path with invalid proof (syntheticOnly false) → rejected_contract_violation",
    passed: failures.length === 0,
    failures,
    validationResult: vr,
    notes: ["Confirms that an invalid guard proof is rejected."],
  };
}

// Case 5: valid proof and valid live prefix → accepted_for_next_gate
function case5_liveSandboxValidProofAndPrefix(): LivePathExtensionRegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput({ adapterMode: "future_live_llm" });

  const result = makeLiveSandboxDraftResult();

  const vr = validateRuntimeLLMOutputContract({ input, result });

  assertVerdict(vr, "accepted_for_next_gate", failures);
  assertEq(vr.acceptedForWordingGate, true, "acceptedForWordingGate", failures);
  assertEq(vr.liveLLMCalled, true, "liveLLMCalled should be true (live path accepted)", failures);
  assertEq(vr.acceptedForUserVisibleAssembly, false, "acceptedForUserVisibleAssembly", failures);
  assertEq(vr.userVisibleOutputAllowed, false, "userVisibleOutputAllowed", failures);
  assertEq(vr.neverUserVisible, true, "neverUserVisible", failures);

  return {
    caseNumber: 5,
    caseName: "live sandbox valid proof + valid prefix → accepted_for_next_gate, liveLLMCalled:true",
    passed: failures.length === 0,
    failures,
    validationResult: vr,
    notes: [
      "First confirmed acceptance of a live sandbox draft by the output contract validator.",
      "liveLLMCalled:true reflects that a live LLM was used; acceptedForUserVisibleAssembly:false.",
    ],
  };
}

// Case 6: live sandbox result missing [LIVE_SANDBOX_DRAFT_NEVER_USER_VISIBLE] prefix
function case6_liveSandboxMissingPrefix(): LivePathExtensionRegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput({ adapterMode: "future_live_llm" });

  const result = makeLiveSandboxDraftResult({
    draftText: "Missing prefix — this should be rejected.",
  });

  const vr = validateRuntimeLLMOutputContract({ input, result });

  assertVerdict(vr, "rejected_visibility_violation", failures);
  assertViolationPresent(vr, "llm_output_live_sandbox_prefix_missing", failures);
  assertEq(vr.acceptedForUserVisibleAssembly, false, "acceptedForUserVisibleAssembly", failures);

  return {
    caseNumber: 6,
    caseName: "live sandbox result missing live sandbox prefix → rejected_visibility_violation",
    passed: failures.length === 0,
    failures,
    validationResult: vr,
    notes: ["Prefix is mandatory for visibility governance on the live path."],
  };
}

// Case 7: live sandbox result with safety flag
function case7_liveSandboxUnsafeSafetyFlag(): LivePathExtensionRegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput({ adapterMode: "future_live_llm" });

  const result = makeLiveSandboxDraftResult({
    safetyFlags: ["contains_enforcement_claim"],
  });

  const vr = validateRuntimeLLMOutputContract({ input, result });

  assertVerdict(vr, "rejected_unsafe_draft", failures);
  assertViolationPresent(vr, "llm_output_unsafe_safety_flag", failures);

  return {
    caseNumber: 7,
    caseName: "live sandbox result with safety flag → rejected_unsafe_draft",
    passed: failures.length === 0,
    failures,
    validationResult: vr,
    notes: ["Safety flag check applies equally on the live sandbox path."],
  };
}

// Case 8: live sandbox result missing forbidden move coverage
function case8_liveSandboxMissingForbiddenMoveCoverage(): LivePathExtensionRegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput({
    adapterMode: "future_live_llm",
    activeForbiddenMoves: ["no_enforcement_claim_when_forbidden"],
  });

  // appliedForbiddenMoves deliberately empty
  const result = makeLiveSandboxDraftResult({ appliedForbiddenMoves: [] });

  const vr = validateRuntimeLLMOutputContract({ input, result });

  assertVerdict(vr, "rejected_contract_violation", failures);
  assertViolationPresent(vr, "llm_output_missing_forbidden_move_coverage", failures);

  return {
    caseNumber: 8,
    caseName: "live sandbox missing forbidden move coverage → rejected_contract_violation",
    passed: failures.length === 0,
    failures,
    validationResult: vr,
    notes: ["Forbidden move coverage check applies equally on the live sandbox path."],
  };
}

// Case 9: live sandbox result missing required constraint coverage
function case9_liveSandboxMissingRequiredConstraint(): LivePathExtensionRegressionCaseResult {
  const failures: string[] = [];
  const input = makeBaseInput({
    adapterMode: "future_live_llm",
    activeRequiredConstraints: ["must_preserve_uncertainty"],
  });

  // appliedRequiredConstraints deliberately empty
  const result = makeLiveSandboxDraftResult({ appliedRequiredConstraints: [] });

  const vr = validateRuntimeLLMOutputContract({ input, result });

  assertVerdict(vr, "rejected_contract_violation", failures);
  assertViolationPresent(vr, "llm_output_missing_required_constraint_coverage", failures);

  return {
    caseNumber: 9,
    caseName: "live sandbox missing required constraint coverage → rejected_contract_violation",
    passed: failures.length === 0,
    failures,
    validationResult: vr,
    notes: ["Required constraint coverage check applies equally on the live sandbox path."],
  };
}

// Case 10: proof validator — missing proof
function case10_proofValidatorMissingProof(): LivePathExtensionRegressionCaseResult {
  const failures: string[] = [];

  const pvr = validateRuntimeLiveSandboxGuardProof(null);

  if (pvr.valid !== false) fail("valid must be false for missing proof", failures);
  if (pvr.status !== "missing") fail(`status must be 'missing'; got '${pvr.status}'`, failures);
  assertProofDiag(pvr, "live_path_proof_missing", failures);
  if (pvr.neverUserVisible !== true) fail("neverUserVisible must be true", failures);

  return {
    caseNumber: 10,
    caseName: "proof validator: missing proof → status:missing, live_path_proof_missing",
    passed: failures.length === 0,
    failures,
    proofValidationResult: pvr,
    notes: ["Confirms null proof produces missing status."],
  };
}

// Case 11: proof validator — syntheticOnly forced false
function case11_proofValidatorNonSyntheticFixture(): LivePathExtensionRegressionCaseResult {
  const failures: string[] = [];

  const invalidProof: RuntimeLiveSandboxGuardProof = {
    ...VALID_GUARD_PROOF,
    syntheticOnly: false as unknown as true,
  };

  const pvr = validateRuntimeLiveSandboxGuardProof(invalidProof);

  if (pvr.valid !== false) fail("valid must be false for non-synthetic fixture", failures);
  if (pvr.status !== "invalid") fail(`status must be 'invalid'; got '${pvr.status}'`, failures);
  assertProofDiag(pvr, "live_path_proof_invalid", failures);
  assertProofDiag(pvr, "live_path_proof_non_synthetic_fixture", failures);

  return {
    caseNumber: 11,
    caseName: "proof validator: syntheticOnly forced false → live_path_proof_non_synthetic_fixture",
    passed: failures.length === 0,
    failures,
    proofValidationResult: pvr,
    notes: ["Defensive runtime check catches cast-bypassed syntheticOnly."],
  };
}

// Case 12: proof validator — all valid
function case12_proofValidatorAllValid(): LivePathExtensionRegressionCaseResult {
  const failures: string[] = [];

  const pvr = validateRuntimeLiveSandboxGuardProof(VALID_GUARD_PROOF);

  if (pvr.valid !== true) fail("valid must be true for all-valid proof", failures);
  if (pvr.status !== "proven") fail(`status must be 'proven'; got '${pvr.status}'`, failures);
  assertProofDiag(pvr, "live_path_proof_present", failures);
  if (pvr.neverUserVisible !== true) fail("neverUserVisible must be true", failures);

  return {
    caseNumber: 12,
    caseName: "proof validator: all valid → status:proven, live_path_proof_present",
    passed: failures.length === 0,
    failures,
    proofValidationResult: pvr,
    notes: ["All 12 proof rules pass for the canonical valid proof fixture."],
  };
}

// Case 13: acceptedForUserVisibleAssembly remains false in both paths
function case13_acceptedForUserVisibleAssemblyAlwaysFalse(): LivePathExtensionRegressionCaseResult {
  const failures: string[] = [];

  // Mock path
  const mockInput = makeBaseInput();
  const mockResult = runRuntimeLLMDraftMockAdapter(mockInput);
  const mockVr = validateRuntimeLLMOutputContract({ input: mockInput, result: mockResult });

  if (mockVr.acceptedForUserVisibleAssembly !== false) {
    fail("Mock path: acceptedForUserVisibleAssembly must be false", failures);
  }

  // Live sandbox path (valid)
  const liveInput = makeBaseInput({ adapterMode: "future_live_llm" });
  const liveResult = makeLiveSandboxDraftResult();
  const liveVr = validateRuntimeLLMOutputContract({ input: liveInput, result: liveResult });

  if (liveVr.acceptedForUserVisibleAssembly !== false) {
    fail("Live path: acceptedForUserVisibleAssembly must always be false", failures);
  }

  return {
    caseNumber: 13,
    caseName: "acceptedForUserVisibleAssembly is always false in both mock and live paths",
    passed: failures.length === 0,
    failures,
    notes: [
      "acceptedForUserVisibleAssembly:false is a permanent invariant.",
      "Only the response assembler (Phase 8.2G-6) may authorise user-visible output.",
    ],
  };
}

// Case 14: userVisibleOutputAllowed remains false in both paths
function case14_userVisibleOutputAllowedAlwaysFalse(): LivePathExtensionRegressionCaseResult {
  const failures: string[] = [];

  // Mock path (rejected due to unsafe)
  const mockInput = makeBaseInput({
    contractRef: MOCK_UNSAFE_FIXTURE_CONTRACT_REF,
    allowedSectionTypes: ["document_type_signal", "what_this_means"],
  });
  const mockResult = runRuntimeLLMDraftMockAdapter(mockInput);
  const mockVr = validateRuntimeLLMOutputContract({ input: mockInput, result: mockResult });

  if (mockVr.userVisibleOutputAllowed !== false) {
    fail("Mock path: userVisibleOutputAllowed must be false", failures);
  }

  // Live sandbox path (accepted)
  const liveInput = makeBaseInput({ adapterMode: "future_live_llm" });
  const liveResult = makeLiveSandboxDraftResult();
  const liveVr = validateRuntimeLLMOutputContract({ input: liveInput, result: liveResult });

  if (liveVr.userVisibleOutputAllowed !== false) {
    fail("Live path: userVisibleOutputAllowed must always be false", failures);
  }

  return {
    caseNumber: 14,
    caseName: "userVisibleOutputAllowed is always false in both mock and live paths",
    passed: failures.length === 0,
    failures,
    notes: [
      "userVisibleOutputAllowed:false is a permanent literal type invariant.",
      "No path through the output contract validator produces user-visible output.",
    ],
  };
}

// ── Scaffold ──────────────────────────────────────────────────────────────────

/**
 * Runs all 14 regression cases for Phase 8.2G-5A.
 *
 * No persistence. No logging. No real user input. No live LLM call. No API key.
 */
export function runLivePathExtensionRegressionScaffold(): LivePathExtensionRegressionScaffoldResult {
  const caseResults: LivePathExtensionRegressionCaseResult[] = [
    case1_mockValidPathAccepted(),
    case2_mockUnsafePathRejected(),
    case3_liveSandboxMissingProof(),
    case4_liveSandboxInvalidProof(),
    case5_liveSandboxValidProofAndPrefix(),
    case6_liveSandboxMissingPrefix(),
    case7_liveSandboxUnsafeSafetyFlag(),
    case8_liveSandboxMissingForbiddenMoveCoverage(),
    case9_liveSandboxMissingRequiredConstraint(),
    case10_proofValidatorMissingProof(),
    case11_proofValidatorNonSyntheticFixture(),
    case12_proofValidatorAllValid(),
    case13_acceptedForUserVisibleAssemblyAlwaysFalse(),
    case14_userVisibleOutputAllowedAlwaysFalse(),
  ];

  const passCount = caseResults.filter((c) => c.passed).length;
  const failCount = caseResults.length - passCount;
  const allPassed = failCount === 0;

  return {
    scaffoldVersion: LIVE_PATH_EXTENSION_REGRESSION_SCAFFOLD_VERSION,
    allPassed,
    passCount,
    failCount,
    caseResults,
    notes: [
      "Phase 8.2G-5A — Runtime Live Path Type Extension regression scaffold.",
      "14 cases: mock path regression, live sandbox proof validation, output contract validator live path.",
      "No Jest, no Vitest, no CI hook. No live LLM call. No API key required.",
      "No Smart Talk wiring. No user-visible output. No persistence.",
      `All cases passed: ${String(allPassed)} (${String(passCount)}/${String(caseResults.length)}).`,
    ],
  };
}
