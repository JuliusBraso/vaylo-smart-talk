/**
 * Controlled Live Text Draft Result Regression Scaffold (Phase 8.2I-1).
 *
 * 12 deterministic regression cases covering:
 *   - ControlledLiveTextRedactionProof validation (cases 1–5)
 *   - ControlledLiveTextDraftResult building (cases 6–10)
 *   - Proof metadata hygiene (case 11)
 *   - Safety invariants (case 12)
 *
 * No Jest / Vitest. No CI hook. No live LLM call. No API key required.
 * All fixtures are synthetic and deterministic.
 *
 * Export `runControlledLiveTextDraftResultRegressionScaffold()` to execute all cases.
 */

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
  ControlledLiveTextRedactionProof,
} from "./controlled-live-text-draft-result-types";

// ── Scaffold types ────────────────────────────────────────────────────────────

export const CONTROLLED_LIVE_TEXT_DRAFT_RESULT_SCAFFOLD_VERSION =
  "8.2i-1-controlled-live-text-draft-result-regression-scaffold-v1";

export interface DraftResultRegressionCaseResult {
  readonly caseId: string;
  readonly passed: boolean;
  readonly failures: readonly string[];
  readonly notes: readonly string[];
}

export interface DraftResultRegressionScaffoldResult {
  readonly scaffoldVersion: string;
  readonly allPassed: boolean;
  readonly caseResults: readonly DraftResultRegressionCaseResult[];
  readonly notes: readonly string[];
}

// ── Fixture helpers ───────────────────────────────────────────────────────────

function buildValidProofAndAdapter() {
  const contractResult = runRealTextInputContractValidation({
    inputMode: "real_text_guarded",
    text: "Bitte erklären Sie diesen Brief.",
    sourceKind: "typed_text",
    validationRunId: "scaffold-contract",
    neverUserVisible: true,
  });
  if (contractResult.verdict !== "accepted_for_redaction_boundary" || !contractResult.accepted) {
    return null;
  }

  const redactionResult = runRealTextRedactionBoundary({
    acceptedInput: contractResult.accepted,
    redactionRunId: "scaffold-redaction",
    neverUserVisible: true,
  });
  if (redactionResult.verdict !== "accepted_for_controlled_live_adapter" || !redactionResult.accepted) {
    return null;
  }

  const adapterResult = runControlledLiveTextAdapter({
    redactionAccepted: redactionResult.accepted,
    sourceInputMode: "real_text_guarded",
    adapterRunId: "scaffold-adapter",
    neverUserVisible: true,
  });
  if (adapterResult.verdict !== "adapted_for_output_contract_validation") {
    return null;
  }

  const proof = buildControlledLiveTextRedactionProof({
    redactionAccepted: redactionResult.accepted,
    adapterResult,
    redactionRunId: "scaffold-redaction",
    adapterRunId: "scaffold-adapter",
  });

  return { redactionAccepted: redactionResult.accepted, adapterResult, proof };
}

function pass(caseId: string, notes: string[]): DraftResultRegressionCaseResult {
  return { caseId, passed: true, failures: [], notes };
}

function fail(caseId: string, failures: string[], notes: string[]): DraftResultRegressionCaseResult {
  return { caseId, passed: false, failures, notes };
}

// ── Case 1: valid proof validates true ────────────────────────────────────────

function case1_validProofValidatesTrue(): DraftResultRegressionCaseResult {
  const fixtures = buildValidProofAndAdapter();
  if (!fixtures) return fail("case1_validProofValidatesTrue", ["Failed to build fixture."], []);
  const result = validateControlledLiveTextRedactionProof(fixtures.proof);
  const failures: string[] = [];
  if (!result.valid) failures.push(`valid should be true; got ${String(result.valid)}.`);
  if (result.status !== "proven") failures.push(`status should be "proven"; got "${result.status}".`);
  if (!result.diagnostics.includes("controlled_live_text_proof_present")) {
    failures.push("Missing controlled_live_text_proof_present diagnostic.");
  }
  return failures.length === 0
    ? pass("case1_validProofValidatesTrue", ["Valid proof accepted."])
    : fail("case1_validProofValidatesTrue", failures, []);
}

// ── Case 2: missing proof → status missing ────────────────────────────────────

function case2_missingProofRejected(): DraftResultRegressionCaseResult {
  const result = validateControlledLiveTextRedactionProof(null);
  const failures: string[] = [];
  if (result.valid) failures.push("valid should be false for null proof.");
  if (result.status !== "missing") failures.push(`status should be "missing"; got "${result.status}".`);
  if (!result.diagnostics.includes("controlled_live_text_proof_missing")) {
    failures.push("Missing controlled_live_text_proof_missing diagnostic.");
  }
  return failures.length === 0
    ? pass("case2_missingProofRejected", ["Null proof rejected as missing."])
    : fail("case2_missingProofRejected", failures, []);
}

// ── Case 3: acceptedForControlledLiveAdapter false → rejected ─────────────────

function case3_proofRejectsIfNotAcceptedForAdapter(): DraftResultRegressionCaseResult {
  const fixtures = buildValidProofAndAdapter();
  if (!fixtures) return fail("case3_proofRejectsIfNotAcceptedForAdapter", ["Failed to build fixture."], []);
  const tamperedProof = {
    ...(fixtures.proof as unknown as Record<string, unknown>),
    acceptedForControlledLiveAdapter: false,
  } as unknown as ControlledLiveTextRedactionProof;
  const result = validateControlledLiveTextRedactionProof(tamperedProof);
  const failures: string[] = [];
  if (result.valid) failures.push("valid should be false when acceptedForControlledLiveAdapter is false.");
  if (!result.diagnostics.includes("controlled_live_text_proof_redaction_not_accepted")) {
    failures.push("Missing controlled_live_text_proof_redaction_not_accepted diagnostic.");
  }
  return failures.length === 0
    ? pass("case3_proofRejectsIfNotAcceptedForAdapter", ["Tampered acceptedForControlledLiveAdapter rejected."])
    : fail("case3_proofRejectsIfNotAcceptedForAdapter", failures, []);
}

// ── Case 4: neverContainsRawDetectedValues false → rejected ───────────────────

function case4_proofRejectsIfRawValueRisk(): DraftResultRegressionCaseResult {
  const fixtures = buildValidProofAndAdapter();
  if (!fixtures) return fail("case4_proofRejectsIfRawValueRisk", ["Failed to build fixture."], []);
  const tamperedProof = {
    ...(fixtures.proof as unknown as Record<string, unknown>),
    neverContainsRawDetectedValues: false,
  } as unknown as ControlledLiveTextRedactionProof;
  const result = validateControlledLiveTextRedactionProof(tamperedProof);
  const failures: string[] = [];
  if (result.valid) failures.push("valid should be false when neverContainsRawDetectedValues is false.");
  if (!result.diagnostics.includes("controlled_live_text_proof_raw_value_risk")) {
    failures.push("Missing controlled_live_text_proof_raw_value_risk diagnostic.");
  }
  return failures.length === 0
    ? pass("case4_proofRejectsIfRawValueRisk", ["Tampered neverContainsRawDetectedValues rejected."])
    : fail("case4_proofRejectsIfRawValueRisk", failures, []);
}

// ── Case 5: acceptedForLLM true → rejected ────────────────────────────────────

function case5_proofRejectsIfLLMEnabled(): DraftResultRegressionCaseResult {
  const fixtures = buildValidProofAndAdapter();
  if (!fixtures) return fail("case5_proofRejectsIfLLMEnabled", ["Failed to build fixture."], []);
  const tamperedProof = {
    ...(fixtures.proof as unknown as Record<string, unknown>),
    acceptedForLLM: true,
  } as unknown as ControlledLiveTextRedactionProof;
  const result = validateControlledLiveTextRedactionProof(tamperedProof);
  const failures: string[] = [];
  if (result.valid) failures.push("valid should be false when acceptedForLLM is true.");
  if (!result.diagnostics.includes("controlled_live_text_proof_llm_call_violation")) {
    failures.push("Missing controlled_live_text_proof_llm_call_violation diagnostic.");
  }
  return failures.length === 0
    ? pass("case5_proofRejectsIfLLMEnabled", ["Tampered acceptedForLLM rejected."])
    : fail("case5_proofRejectsIfLLMEnabled", failures, []);
}

// ── Case 6: build draft result success ────────────────────────────────────────

function case6_buildDraftResultSuccess(): DraftResultRegressionCaseResult {
  const fixtures = buildValidProofAndAdapter();
  if (!fixtures) return fail("case6_buildDraftResultSuccess", ["Failed to build fixture."], []);
  const draftResult = buildControlledLiveTextDraftResult({
    draftId: "scaffold-draft-001",
    adapterResult: fixtures.adapterResult,
    redactionProof: fixtures.proof,
    auditTraceParentIds: ["scaffold-harness"],
  });
  const failures: string[] = [];
  if (!draftResult) { failures.push("buildControlledLiveTextDraftResult returned null."); return fail("case6_buildDraftResultSuccess", failures, []); }
  if (draftResult.adapterMode !== "controlled_live_text") failures.push(`adapterMode should be "controlled_live_text".`);
  if (draftResult.sourceKind !== "controlled_live_text") failures.push(`sourceKind should be "controlled_live_text".`);
  if (!draftResult.redactionProof) failures.push("redactionProof is missing.");
  if (draftResult.liveLLMCalled !== false) failures.push("liveLLMCalled should be false.");
  if (draftResult.userVisibleOutputAllowed !== false) failures.push("userVisibleOutputAllowed should be false.");
  if (draftResult.neverUserVisible !== true) failures.push("neverUserVisible should be true.");
  if (draftResult.sectionCandidates.length === 0) failures.push("sectionCandidates is empty.");
  return failures.length === 0
    ? pass("case6_buildDraftResultSuccess", ["Draft result built successfully."])
    : fail("case6_buildDraftResultSuccess", failures, []);
}

// ── Case 7: builder rejects failed adapter ────────────────────────────────────

function case7_builderRejectsFailedAdapter(): DraftResultRegressionCaseResult {
  const fixtures = buildValidProofAndAdapter();
  if (!fixtures) return fail("case7_builderRejectsFailedAdapter", ["Failed to build fixture."], []);
  // Tamper the adapter result verdict to simulate failure
  const failedAdapter = {
    ...(fixtures.adapterResult as unknown as Record<string, unknown>),
    verdict: "rejected_redaction_not_accepted",
    adaptedForOutputContractValidation: false,
  } as unknown as typeof fixtures.adapterResult;
  const result = buildControlledLiveTextDraftResult({
    draftId: "scaffold-draft-fail",
    adapterResult: failedAdapter,
    redactionProof: fixtures.proof,
  });
  const failures: string[] = [];
  if (result !== null) failures.push("Builder should return null for a failed adapter.");
  return failures.length === 0
    ? pass("case7_builderRejectsFailedAdapter", ["Failed adapter correctly rejected."])
    : fail("case7_builderRejectsFailedAdapter", failures, []);
}

// ── Case 8: builder rejects invalid proof ─────────────────────────────────────

function case8_builderRejectsInvalidProof(): DraftResultRegressionCaseResult {
  const fixtures = buildValidProofAndAdapter();
  if (!fixtures) return fail("case8_builderRejectsInvalidProof", ["Failed to build fixture."], []);
  const invalidProof = {
    ...(fixtures.proof as unknown as Record<string, unknown>),
    neverContainsRawDetectedValues: false,
  } as unknown as ControlledLiveTextRedactionProof;
  const result = buildControlledLiveTextDraftResult({
    draftId: "scaffold-draft-invalid-proof",
    adapterResult: fixtures.adapterResult,
    redactionProof: invalidProof,
  });
  const failures: string[] = [];
  if (result !== null) failures.push("Builder should return null for an invalid proof.");
  return failures.length === 0
    ? pass("case8_builderRejectsInvalidProof", ["Invalid proof correctly rejected."])
    : fail("case8_builderRejectsInvalidProof", failures, []);
}

// ── Case 9: section missing prefix → null ─────────────────────────────────────

function case9_builderRejectsSectionMissingPrefix(): DraftResultRegressionCaseResult {
  const fixtures = buildValidProofAndAdapter();
  if (!fixtures) return fail("case9_builderRejectsSectionMissingPrefix", ["Failed to build fixture."], []);
  // Tamper one section to remove the required prefix
  const tamperedSections = fixtures.adapterResult.sectionCandidates.map((sc) => ({
    ...(sc as unknown as Record<string, unknown>),
    draftText: "NO_PREFIX " + sc.draftText.replace(CONTROLLED_LIVE_TEXT_DRAFT_PREFIX, ""),
  }));
  const tamperedAdapter = {
    ...(fixtures.adapterResult as unknown as Record<string, unknown>),
    sectionCandidates: tamperedSections,
  } as unknown as typeof fixtures.adapterResult;
  const result = buildControlledLiveTextDraftResult({
    draftId: "scaffold-draft-no-prefix",
    adapterResult: tamperedAdapter,
    redactionProof: fixtures.proof,
  });
  const failures: string[] = [];
  if (result !== null) failures.push("Builder should return null when section draftText lacks required prefix.");
  return failures.length === 0
    ? pass("case9_builderRejectsSectionMissingPrefix", ["Section without prefix correctly rejected."])
    : fail("case9_builderRejectsSectionMissingPrefix", failures, []);
}

// ── Case 10: no prose generation — draftText is verbatim from adapter ─────────

function case10_noProseGeneration(): DraftResultRegressionCaseResult {
  const fixtures = buildValidProofAndAdapter();
  if (!fixtures) return fail("case10_noProseGeneration", ["Failed to build fixture."], []);
  const draftResult = buildControlledLiveTextDraftResult({
    draftId: "scaffold-draft-verbatim",
    adapterResult: fixtures.adapterResult,
    redactionProof: fixtures.proof,
  });
  const failures: string[] = [];
  if (!draftResult) { failures.push("buildControlledLiveTextDraftResult returned null."); return fail("case10_noProseGeneration", failures, []); }
  for (let i = 0; i < draftResult.sectionCandidates.length; i++) {
    const built = draftResult.sectionCandidates[i];
    const source = fixtures.adapterResult.sectionCandidates[i];
    if (!built || !source) { failures.push(`Section ${String(i)} missing.`); continue; }
    if (built.draftText !== source.draftText) {
      failures.push(`Section ${String(i)} draftText was rewritten. Expected verbatim copy.`);
    }
  }
  return failures.length === 0
    ? pass("case10_noProseGeneration", ["draftText copied verbatim; no prose generation confirmed."])
    : fail("case10_noProseGeneration", failures, []);
}

// ── Case 11: proof contains no raw values or redacted text ────────────────────

function case11_proofHasNoRawValues(): DraftResultRegressionCaseResult {
  const fixtures = buildValidProofAndAdapter();
  if (!fixtures) return fail("case11_proofHasNoRawValues", ["Failed to build fixture."], []);
  const proof = fixtures.proof;
  const failures: string[] = [];
  const proofKeys = Object.keys(proof as unknown as Record<string, unknown>);
  if (proofKeys.includes("redactedText")) failures.push("Proof must not contain 'redactedText' key.");
  if (proofKeys.includes("rawValue")) failures.push("Proof must not contain 'rawValue' key.");
  if (proofKeys.includes("normalizedText")) failures.push("Proof must not contain 'normalizedText' key.");
  if (proofKeys.includes("originalText")) failures.push("Proof must not contain 'originalText' key.");
  if (proofKeys.includes("matches")) failures.push("Proof must not contain raw 'matches' array (only matchCount).");
  // matchCount should be a number
  if (typeof proof.matchCount !== "number") failures.push("matchCount should be a number.");
  return failures.length === 0
    ? pass("case11_proofHasNoRawValues", ["Proof contains only metadata; no raw/redacted text keys found."])
    : fail("case11_proofHasNoRawValues", failures, []);
}

// ── Case 12: safety invariants on successful draft result ─────────────────────

function case12_safetyInvariants(): DraftResultRegressionCaseResult {
  const fixtures = buildValidProofAndAdapter();
  if (!fixtures) return fail("case12_safetyInvariants", ["Failed to build fixture."], []);
  const draftResult = buildControlledLiveTextDraftResult({
    draftId: "scaffold-draft-invariants",
    adapterResult: fixtures.adapterResult,
    redactionProof: fixtures.proof,
  });
  const failures: string[] = [];
  if (!draftResult) { failures.push("buildControlledLiveTextDraftResult returned null."); return fail("case12_safetyInvariants", failures, []); }
  if (draftResult.liveLLMCalled !== false) failures.push("liveLLMCalled must be false.");
  if (draftResult.userVisibleOutputAllowed !== false) failures.push("userVisibleOutputAllowed must be false.");
  if (draftResult.persistenceUsed !== false) failures.push("persistenceUsed must be false.");
  if (draftResult.dnaSavePerformed !== false) failures.push("dnaSavePerformed must be false.");
  if (draftResult.offlineSavePerformed !== false) failures.push("offlineSavePerformed must be false.");
  if (draftResult.neverUserVisible !== true) failures.push("neverUserVisible must be true.");
  if (draftResult.adapterMode !== "controlled_live_text") failures.push("adapterMode must be 'controlled_live_text'.");
  if (draftResult.sourceKind !== "controlled_live_text") failures.push("sourceKind must be 'controlled_live_text'.");
  for (const sc of draftResult.sectionCandidates) {
    if (!sc.draftText.startsWith(CONTROLLED_LIVE_TEXT_DRAFT_PREFIX)) {
      failures.push(`Section draftText missing required prefix.`);
    }
    if (sc.neverUserVisible !== true) failures.push("Section neverUserVisible must be true.");
    if (sc.sourceBound !== true) failures.push("Section sourceBound must be true.");
  }
  const proofValidation = validateControlledLiveTextRedactionProof(draftResult.redactionProof);
  if (!proofValidation.valid) failures.push("Proof embedded in draft result failed re-validation.");
  return failures.length === 0
    ? pass("case12_safetyInvariants", ["All safety invariants confirmed."])
    : fail("case12_safetyInvariants", failures, []);
}

// ── Runner ────────────────────────────────────────────────────────────────────

/**
 * Runs all 12 regression cases and returns a summary result.
 *
 * Pure function — no external calls, no logging, no persistence.
 */
export function runControlledLiveTextDraftResultRegressionScaffold(): DraftResultRegressionScaffoldResult {
  const cases: DraftResultRegressionCaseResult[] = [
    case1_validProofValidatesTrue(),
    case2_missingProofRejected(),
    case3_proofRejectsIfNotAcceptedForAdapter(),
    case4_proofRejectsIfRawValueRisk(),
    case5_proofRejectsIfLLMEnabled(),
    case6_buildDraftResultSuccess(),
    case7_builderRejectsFailedAdapter(),
    case8_builderRejectsInvalidProof(),
    case9_builderRejectsSectionMissingPrefix(),
    case10_noProseGeneration(),
    case11_proofHasNoRawValues(),
    case12_safetyInvariants(),
  ];

  const allPassed = cases.every((c) => c.passed);
  const failedCases = cases.filter((c) => !c.passed).map((c) => c.caseId);

  return {
    scaffoldVersion: CONTROLLED_LIVE_TEXT_DRAFT_RESULT_SCAFFOLD_VERSION,
    allPassed,
    caseResults: cases,
    notes: [
      `Scaffold version: ${CONTROLLED_LIVE_TEXT_DRAFT_RESULT_SCAFFOLD_VERSION}.`,
      `Cases: ${String(cases.length)} total. Passed: ${String(cases.filter((c) => c.passed).length)}.`,
      allPassed
        ? "All cases passed."
        : `Failed: ${failedCases.join(", ")}.`,
      "No live LLM call. No persistence. No API route touched.",
      "Output contract validator not modified in Phase 8.2I-1.",
      "Temporary mock bridge remains in run-guarded-live-text-runtime-pipeline.ts.",
    ],
  };
}
