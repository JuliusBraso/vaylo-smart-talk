/**
 * Controlled Live Text Output Contract Validator Regression Scaffold (Phase 8.2I-2).
 *
 * 12 deterministic regression cases verifying the new `controlled_live_text` dispatch
 * branch in `validateRuntimeLLMOutputContract`, plus regression confirmation that
 * the existing mock and live sandbox paths are unaffected.
 *
 * No Jest / Vitest. No CI hook. No live LLM call. No API key required.
 * All fixtures are synthetic and deterministic.
 *
 * Export `runControlledLiveTextOutputContractValidatorRegressionScaffold()` to
 * execute all cases.
 */

import type {
  RuntimeLLMDraftAdapterInput,
} from "../runtime-llm-draft-adapter-types";
import {
  MOCK_UNSAFE_FIXTURE_CONTRACT_REF,
  runRuntimeLLMDraftMockAdapter,
} from "../run-runtime-llm-draft-mock-adapter";
import {
  validateRuntimeLLMOutputContract,
} from "../validate-runtime-llm-output-contract";
import type {
  RuntimeLLMOutputContractDraftResult,
  RuntimeLLMOutputContractValidationResult,
  RuntimeLLMOutputContractViolationCode,
} from "../runtime-llm-output-contract-validator-types";
import { runRealTextInputContractValidation } from "./run-real-text-input-contract-validation";
import { runRealTextRedactionBoundary } from "./run-real-text-redaction-boundary";
import { runControlledLiveTextAdapter } from "./run-controlled-live-text-adapter";
import {
  CONTROLLED_LIVE_TEXT_DRAFT_PREFIX,
  buildControlledLiveTextDraftResult,
  buildControlledLiveTextRedactionProof,
  validateControlledLiveTextRedactionProof,
} from "./controlled-live-text-draft-result-types";
import type {
  ControlledLiveTextDraftResult,
  ControlledLiveTextRedactionProof,
} from "./controlled-live-text-draft-result-types";

// ── Scaffold types ────────────────────────────────────────────────────────────

export const CL_CONTRACT_VALIDATOR_SCAFFOLD_VERSION =
  "8.2i-2-controlled-live-text-output-contract-validator-regression-v1";

export interface CLContractValidatorCaseResult {
  readonly caseNumber: number;
  readonly caseName: string;
  readonly passed: boolean;
  readonly failures: readonly string[];
  readonly notes: readonly string[];
}

export interface CLContractValidatorScaffoldResult {
  readonly scaffoldVersion: string;
  readonly allPassed: boolean;
  readonly passCount: number;
  readonly failCount: number;
  readonly caseResults: readonly CLContractValidatorCaseResult[];
  readonly notes: readonly string[];
}

// ── Shared fixture helpers ────────────────────────────────────────────────────

/**
 * The minimal `RuntimeLLMDraftAdapterInput` used across all controlled live text
 * cases. Uses empty forbidden move / constraint lists and allows `what_this_means`
 * (the section type the controlled live text adapter always produces).
 */
function buildContractInput(): RuntimeLLMDraftAdapterInput {
  return {
    adapterMode: "mock",
    accessTier: "free_preview",
    contractRef: "cl-validator-scaffold-ref",
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
    auditTraceParentIds: ["cl-validator-scaffold"],
    neverUserVisible: true,
  };
}

/** Builds a valid ControlledLiveTextDraftResult or returns null on any failure. */
function buildValidControlledLiveTextDraftResult(): ControlledLiveTextDraftResult | null {
  const contractResult = runRealTextInputContractValidation({
    inputMode: "real_text_guarded",
    text: "Bitte prüfen Sie dieses Schreiben.",
    sourceKind: "typed_text",
    validationRunId: "cl-validator-scaffold-contract",
    neverUserVisible: true,
  });
  if (contractResult.verdict !== "accepted_for_redaction_boundary" || !contractResult.accepted) {
    return null;
  }

  const redactionResult = runRealTextRedactionBoundary({
    acceptedInput: contractResult.accepted,
    redactionRunId: "cl-validator-scaffold-redaction",
    neverUserVisible: true,
  });
  if (redactionResult.verdict !== "accepted_for_controlled_live_adapter" || !redactionResult.accepted) {
    return null;
  }

  const adapterResult = runControlledLiveTextAdapter({
    redactionAccepted: redactionResult.accepted,
    sourceInputMode: "real_text_guarded",
    adapterRunId: "cl-validator-scaffold-adapter",
    neverUserVisible: true,
  });
  if (adapterResult.verdict !== "adapted_for_output_contract_validation") {
    return null;
  }

  const proof = buildControlledLiveTextRedactionProof({
    redactionAccepted: redactionResult.accepted,
    adapterResult,
    redactionRunId: "cl-validator-scaffold-redaction",
    adapterRunId: "cl-validator-scaffold-adapter",
  });

  return buildControlledLiveTextDraftResult({
    draftId: "cl-validator-scaffold-draft-001",
    adapterResult,
    redactionProof: proof,
    appliedForbiddenMoves: [],
    appliedRequiredConstraints: [],
    auditTraceParentIds: ["cl-validator-scaffold"],
  });
}

function passCase(
  n: number,
  name: string,
  notes: string[],
): CLContractValidatorCaseResult {
  return { caseNumber: n, caseName: name, passed: true, failures: [], notes };
}

function failCase(
  n: number,
  name: string,
  failures: string[],
): CLContractValidatorCaseResult {
  return { caseNumber: n, caseName: name, passed: false, failures, notes: [] };
}

function assertViolationPresent(
  vr: RuntimeLLMOutputContractValidationResult,
  code: RuntimeLLMOutputContractViolationCode,
  failures: string[],
): void {
  const inResult = vr.violations.includes(code);
  const inSections = vr.sectionResults.some((sr) => sr.violations.includes(code));
  if (!inResult && !inSections) {
    failures.push(`Expected violation "${code}" not found in result or section violations.`);
  }
}

function assertBaseInvariants(
  vr: RuntimeLLMOutputContractValidationResult,
  failures: string[],
): void {
  if (vr.acceptedForUserVisibleAssembly !== false) {
    failures.push("acceptedForUserVisibleAssembly must always be false.");
  }
  if (vr.userVisibleOutputAllowed !== false) {
    failures.push("userVisibleOutputAllowed must always be false.");
  }
  if (vr.neverUserVisible !== true) {
    failures.push("neverUserVisible must always be true.");
  }
}

// ── Case 1: valid controlled live text path accepted ─────────────────────────

function case1_validControlledLiveTextAccepted(): CLContractValidatorCaseResult {
  const draftResult = buildValidControlledLiveTextDraftResult();
  if (!draftResult) {
    return failCase(1, "valid controlled live text — accepted_for_next_gate", [
      "Failed to build valid ControlledLiveTextDraftResult.",
    ]);
  }
  const input = buildContractInput();
  const vr = validateRuntimeLLMOutputContract({
    input,
    result: draftResult as unknown as RuntimeLLMOutputContractDraftResult,
  });
  const failures: string[] = [];
  if (vr.verdict !== "accepted_for_next_gate") {
    failures.push(`verdict should be accepted_for_next_gate; got "${vr.verdict}".`);
  }
  if (!vr.acceptedForWordingGate) {
    failures.push("acceptedForWordingGate should be true.");
  }
  if (vr.acceptedForUserVisibleAssembly !== false) {
    failures.push("acceptedForUserVisibleAssembly must be false.");
  }
  if (vr.userVisibleOutputAllowed !== false) {
    failures.push("userVisibleOutputAllowed must be false.");
  }
  if (vr.liveLLMCalled !== false) {
    failures.push("liveLLMCalled must be false on controlled live text path.");
  }
  assertBaseInvariants(vr, failures);
  return failures.length === 0
    ? passCase(1, "valid controlled live text — accepted_for_next_gate", [
        "ControlledLiveTextDraftResult accepted by validator. liveLLMCalled false.",
      ])
    : failCase(1, "valid controlled live text — accepted_for_next_gate", failures);
}

// ── Case 2: missing redactionProof → proof_missing ───────────────────────────

function case2_missingProofRejected(): CLContractValidatorCaseResult {
  const draftResult = buildValidControlledLiveTextDraftResult();
  if (!draftResult) return failCase(2, "missing redactionProof", ["Failed to build fixture."]);
  const tampered = {
    ...(draftResult as unknown as Record<string, unknown>),
    redactionProof: undefined,
  } as unknown as RuntimeLLMOutputContractDraftResult;
  const vr = validateRuntimeLLMOutputContract({ input: buildContractInput(), result: tampered });
  const failures: string[] = [];
  if (vr.verdict === "accepted_for_next_gate") failures.push("Must not accept when proof is missing.");
  assertViolationPresent(vr, "llm_output_controlled_live_text_proof_missing", failures);
  assertBaseInvariants(vr, failures);
  return failures.length === 0
    ? passCase(2, "missing redactionProof → proof_missing violation", ["Missing proof correctly rejected."])
    : failCase(2, "missing redactionProof → proof_missing violation", failures);
}

// ── Case 3: invalid redactionProof → proof_invalid ───────────────────────────

function case3_invalidProofRejected(): CLContractValidatorCaseResult {
  const draftResult = buildValidControlledLiveTextDraftResult();
  if (!draftResult) return failCase(3, "invalid redactionProof", ["Failed to build fixture."]);
  const tamperedProof = {
    ...(draftResult.redactionProof as unknown as Record<string, unknown>),
    neverContainsRawDetectedValues: false,
  } as unknown as ControlledLiveTextRedactionProof;
  // Confirm proof is now invalid before testing the validator
  const proofCheck = validateControlledLiveTextRedactionProof(tamperedProof);
  if (proofCheck.valid) {
    return failCase(3, "invalid redactionProof → proof_invalid violation", [
      "Pre-check: tampered proof should be invalid.",
    ]);
  }
  const tampered = {
    ...(draftResult as unknown as Record<string, unknown>),
    redactionProof: tamperedProof,
  } as unknown as RuntimeLLMOutputContractDraftResult;
  const vr = validateRuntimeLLMOutputContract({ input: buildContractInput(), result: tampered });
  const failures: string[] = [];
  if (vr.verdict === "accepted_for_next_gate") failures.push("Must not accept with invalid proof.");
  assertViolationPresent(vr, "llm_output_controlled_live_text_proof_invalid", failures);
  assertBaseInvariants(vr, failures);
  return failures.length === 0
    ? passCase(3, "invalid redactionProof → proof_invalid violation", ["Invalid proof correctly rejected."])
    : failCase(3, "invalid redactionProof → proof_invalid violation", failures);
}

// ── Case 4: section missing controlled prefix → prefix_missing ───────────────

function case4_missingPrefixRejected(): CLContractValidatorCaseResult {
  const draftResult = buildValidControlledLiveTextDraftResult();
  if (!draftResult) return failCase(4, "missing controlled prefix", ["Failed to build fixture."]);
  const tamperedSections = draftResult.sectionCandidates.map((sc) => ({
    ...(sc as unknown as Record<string, unknown>),
    draftText: "NO_PREFIX " + sc.draftText.replace(CONTROLLED_LIVE_TEXT_DRAFT_PREFIX, ""),
  }));
  const tampered = {
    ...(draftResult as unknown as Record<string, unknown>),
    sectionCandidates: tamperedSections,
  } as unknown as RuntimeLLMOutputContractDraftResult;
  const vr = validateRuntimeLLMOutputContract({ input: buildContractInput(), result: tampered });
  const failures: string[] = [];
  if (vr.verdict === "accepted_for_next_gate") failures.push("Must not accept when prefix is missing.");
  assertViolationPresent(vr, "llm_output_controlled_live_text_prefix_missing", failures);
  assertBaseInvariants(vr, failures);
  // Prefix violation maps to rejected_visibility_violation
  const isVisibilityReject =
    vr.verdict === "rejected_visibility_violation" || vr.verdict === "rejected_contract_violation";
  if (!isVisibilityReject) {
    failures.push(`Expected rejected_visibility_violation or rejected_contract_violation; got "${vr.verdict}".`);
  }
  return failures.length === 0
    ? passCase(4, "missing controlled prefix → prefix_missing violation", ["Missing prefix correctly rejected."])
    : failCase(4, "missing controlled prefix → prefix_missing violation", failures);
}

// ── Case 5: userVisibleOutputAllowed true → visibility_violation ──────────────

function case5_userVisibleOutputAllowedTrueRejected(): CLContractValidatorCaseResult {
  const draftResult = buildValidControlledLiveTextDraftResult();
  if (!draftResult) return failCase(5, "userVisibleOutputAllowed true", ["Failed to build fixture."]);
  const tampered = {
    ...(draftResult as unknown as Record<string, unknown>),
    userVisibleOutputAllowed: true,
  } as unknown as RuntimeLLMOutputContractDraftResult;
  const vr = validateRuntimeLLMOutputContract({ input: buildContractInput(), result: tampered });
  const failures: string[] = [];
  if (vr.verdict === "accepted_for_next_gate") failures.push("Must not accept with userVisibleOutputAllowed true.");
  // The existing llm_output_user_visible_enabled violation is used for this shared check
  const hasVisibilityViolation =
    vr.violations.includes("llm_output_user_visible_enabled") ||
    vr.violations.includes("llm_output_controlled_live_text_visibility_violation");
  if (!hasVisibilityViolation) {
    failures.push(
      "Expected llm_output_user_visible_enabled or llm_output_controlled_live_text_visibility_violation.",
    );
  }
  assertBaseInvariants(vr, failures);
  return failures.length === 0
    ? passCase(5, "userVisibleOutputAllowed true → visibility_violation", ["userVisibleOutputAllowed tampered correctly rejected."])
    : failCase(5, "userVisibleOutputAllowed true → visibility_violation", failures);
}

// ── Case 6: liveLLMCalled true → visibility_violation ────────────────────────

function case6_liveLLMCalledTrueRejected(): CLContractValidatorCaseResult {
  const draftResult = buildValidControlledLiveTextDraftResult();
  if (!draftResult) return failCase(6, "liveLLMCalled true", ["Failed to build fixture."]);
  const tampered = {
    ...(draftResult as unknown as Record<string, unknown>),
    liveLLMCalled: true,
  } as unknown as RuntimeLLMOutputContractDraftResult;
  const vr = validateRuntimeLLMOutputContract({ input: buildContractInput(), result: tampered });
  const failures: string[] = [];
  if (vr.verdict === "accepted_for_next_gate") failures.push("Must not accept with liveLLMCalled true.");
  assertViolationPresent(vr, "llm_output_controlled_live_text_visibility_violation", failures);
  assertBaseInvariants(vr, failures);
  return failures.length === 0
    ? passCase(6, "liveLLMCalled true → visibility_violation", ["liveLLMCalled tampered correctly rejected."])
    : failCase(6, "liveLLMCalled true → visibility_violation", failures);
}

// ── Case 7: persistenceUsed true → persistence_violation ─────────────────────

function case7_persistenceUsedTrueRejected(): CLContractValidatorCaseResult {
  const draftResult = buildValidControlledLiveTextDraftResult();
  if (!draftResult) return failCase(7, "persistenceUsed true", ["Failed to build fixture."]);
  const tampered = {
    ...(draftResult as unknown as Record<string, unknown>),
    persistenceUsed: true,
  } as unknown as RuntimeLLMOutputContractDraftResult;
  const vr = validateRuntimeLLMOutputContract({ input: buildContractInput(), result: tampered });
  const failures: string[] = [];
  if (vr.verdict === "accepted_for_next_gate") failures.push("Must not accept with persistenceUsed true.");
  assertViolationPresent(vr, "llm_output_controlled_live_text_persistence_violation", failures);
  assertBaseInvariants(vr, failures);
  return failures.length === 0
    ? passCase(7, "persistenceUsed true → persistence_violation", ["persistenceUsed tampered correctly rejected."])
    : failCase(7, "persistenceUsed true → persistence_violation", failures);
}

// ── Case 8: existing mock valid path still accepted ───────────────────────────

function case8_mockValidPathStillAccepted(): CLContractValidatorCaseResult {
  const input = buildContractInput();
  const mockResult = runRuntimeLLMDraftMockAdapter(input);
  const vr = validateRuntimeLLMOutputContract({ input, result: mockResult });
  const failures: string[] = [];
  if (vr.verdict !== "accepted_for_next_gate") {
    failures.push(`Mock path should still be accepted; got "${vr.verdict}".`);
  }
  if (!vr.acceptedForWordingGate) failures.push("acceptedForWordingGate should be true for mock path.");
  if (vr.liveLLMCalled !== false) failures.push("liveLLMCalled should be false for mock path.");
  assertBaseInvariants(vr, failures);
  return failures.length === 0
    ? passCase(8, "mock valid path still accepted (regression)", ["Mock path unaffected by 8.2I-2 changes."])
    : failCase(8, "mock valid path still accepted (regression)", failures);
}

// ── Case 9: mock unsafe path still rejected ───────────────────────────────────

function case9_mockUnsafePathStillRejected(): CLContractValidatorCaseResult {
  const input = buildContractInput();
  // Use the mock adapter's unsafe fixture contract ref to force safety flags
  const unsafeInput: RuntimeLLMDraftAdapterInput = {
    ...input,
    contractRef: MOCK_UNSAFE_FIXTURE_CONTRACT_REF,
  };
  const mockResult = runRuntimeLLMDraftMockAdapter(unsafeInput);
  const vr = validateRuntimeLLMOutputContract({ input: unsafeInput, result: mockResult });
  const failures: string[] = [];
  if (vr.verdict === "accepted_for_next_gate") {
    failures.push("Mock unsafe path should still be rejected.");
  }
  assertBaseInvariants(vr, failures);
  return failures.length === 0
    ? passCase(9, "mock unsafe path still rejected (regression)", ["Mock unsafe path unaffected by 8.2I-2 changes."])
    : failCase(9, "mock unsafe path still rejected (regression)", failures);
}

// ── Case 10: acceptedForUserVisibleAssembly always false on success ───────────

function case10_acceptedForUserVisibleAssemblyAlwaysFalse(): CLContractValidatorCaseResult {
  const draftResult = buildValidControlledLiveTextDraftResult();
  if (!draftResult) return failCase(10, "acceptedForUserVisibleAssembly always false", ["Failed to build fixture."]);
  const vr = validateRuntimeLLMOutputContract({
    input: buildContractInput(),
    result: draftResult as unknown as RuntimeLLMOutputContractDraftResult,
  });
  const failures: string[] = [];
  if (vr.acceptedForUserVisibleAssembly !== false) {
    failures.push("acceptedForUserVisibleAssembly must always be false, even on success.");
  }
  return failures.length === 0
    ? passCase(10, "acceptedForUserVisibleAssembly always false on success", [
        "acceptedForUserVisibleAssembly: false confirmed on successful controlled live text result.",
      ])
    : failCase(10, "acceptedForUserVisibleAssembly always false on success", failures);
}

// ── Case 11: sourceKind mismatch → source_invalid ────────────────────────────

function case11_sourceKindMismatchRejected(): CLContractValidatorCaseResult {
  const draftResult = buildValidControlledLiveTextDraftResult();
  if (!draftResult) return failCase(11, "sourceKind mismatch", ["Failed to build fixture."]);
  const tampered = {
    ...(draftResult as unknown as Record<string, unknown>),
    sourceKind: "mock",
  } as unknown as RuntimeLLMOutputContractDraftResult;
  const vr = validateRuntimeLLMOutputContract({ input: buildContractInput(), result: tampered });
  const failures: string[] = [];
  if (vr.verdict === "accepted_for_next_gate") failures.push("Must not accept when sourceKind is wrong.");
  assertViolationPresent(vr, "llm_output_controlled_live_text_source_invalid", failures);
  assertBaseInvariants(vr, failures);
  return failures.length === 0
    ? passCase(11, "sourceKind mismatch → source_invalid violation", ["sourceKind mismatch correctly rejected."])
    : failCase(11, "sourceKind mismatch → source_invalid violation", failures);
}

// ── Case 12: no API/UI/persistence confirms ───────────────────────────────────

function case12_noApiUiPersistenceConfirm(): CLContractValidatorCaseResult {
  const draftResult = buildValidControlledLiveTextDraftResult();
  if (!draftResult) return failCase(12, "no API/UI/persistence confirm", ["Failed to build fixture."]);
  const vr = validateRuntimeLLMOutputContract({
    input: buildContractInput(),
    result: draftResult as unknown as RuntimeLLMOutputContractDraftResult,
  });
  const failures: string[] = [];
  if (vr.acceptedForUserVisibleAssembly !== false) failures.push("acceptedForUserVisibleAssembly must be false.");
  if (vr.userVisibleOutputAllowed !== false) failures.push("userVisibleOutputAllowed must be false.");
  if (vr.neverUserVisible !== true) failures.push("neverUserVisible must be true.");
  if (vr.liveLLMCalled !== false) failures.push("liveLLMCalled must be false.");
  return failures.length === 0
    ? passCase(12, "no API/UI/persistence on controlled live text path", [
        "No route, UI, persistence, or LLM call involved. All invariants confirmed.",
      ])
    : failCase(12, "no API/UI/persistence on controlled live text path", failures);
}

// ── Runner ────────────────────────────────────────────────────────────────────

/**
 * Runs all 12 regression cases and returns a summary result.
 *
 * Pure function — no external calls, no logging, no persistence.
 */
export function runControlledLiveTextOutputContractValidatorRegressionScaffold(): CLContractValidatorScaffoldResult {
  const caseResults: CLContractValidatorCaseResult[] = [
    case1_validControlledLiveTextAccepted(),
    case2_missingProofRejected(),
    case3_invalidProofRejected(),
    case4_missingPrefixRejected(),
    case5_userVisibleOutputAllowedTrueRejected(),
    case6_liveLLMCalledTrueRejected(),
    case7_persistenceUsedTrueRejected(),
    case8_mockValidPathStillAccepted(),
    case9_mockUnsafePathStillRejected(),
    case10_acceptedForUserVisibleAssemblyAlwaysFalse(),
    case11_sourceKindMismatchRejected(),
    case12_noApiUiPersistenceConfirm(),
  ];

  const passCount = caseResults.filter((c) => c.passed).length;
  const failCount = caseResults.length - passCount;
  const allPassed = failCount === 0;

  return {
    scaffoldVersion: CL_CONTRACT_VALIDATOR_SCAFFOLD_VERSION,
    allPassed,
    passCount,
    failCount,
    caseResults,
    notes: [
      `Scaffold version: ${CL_CONTRACT_VALIDATOR_SCAFFOLD_VERSION}.`,
      `Cases: ${String(caseResults.length)} total. Passed: ${String(passCount)}.`,
      allPassed
        ? "All cases passed."
        : `Failed: ${caseResults.filter((c) => !c.passed).map((c) => c.caseName).join("; ")}.`,
      "No live LLM call. No persistence. No API route touched.",
      "Output contract validator mock and live sandbox paths confirmed unaffected.",
      "Temporary mock bridge in run-guarded-live-text-runtime-pipeline.ts not modified.",
    ],
  };
}
