/**
 * Runtime LLM Output Contract Validator (Phase 8.2G-2, extended 8.2G-5A, 8.2I-2).
 *
 * Implements `validateRuntimeLLMOutputContract` — a pure safety gate that
 * checks a draft result (from Phase 8.2G-1 mock adapter OR Phase 8.2G-5 live
 * sandbox adapter OR Phase 8.2I-1 controlled live text) against the originating
 * `RuntimeLLMDraftAdapterInput` before the draft can proceed to the wording
 * governance gate (Phase 8.2G-3).
 *
 * Phase 8.2G-5A extension:
 *   The `result` parameter now accepts `RuntimeLLMOutputContractDraftResult`, a
 *   union interface satisfied by both `RuntimeLLMDraftAdapterResult` (mock) and
 *   `RuntimeLiveLLMSandboxDraftCandidateResult` (live sandbox). Path selection:
 *
 *     Mock path    — result.adapterMode === "mock"
 *     Live path    — result.adapterMode === "future_live_llm" AND
 *                    result.liveLLMCalled === true (runtime check)
 *     Forbidden    — result.adapterMode === "future_live_llm" AND
 *                    result.liveLLMCalled !== true (mock adapter blocked live mode)
 *     Unrecognized — any other combination
 *
 * Phase 8.2I-2 extension:
 *   Controlled live text path — result.adapterMode === "controlled_live_text".
 *   Acceptance requires:
 *     - result.redactionProof present and valid per validateControlledLiveTextRedactionProof.
 *     - result.sourceKind === "controlled_live_text".
 *     - result.liveLLMCalled === false.
 *     - persistenceUsed/dnaSavePerformed/offlineSavePerformed all false (if present).
 *     - every draftText starts with [CONTROLLED_LIVE_TEXT_DRAFT_NEVER_USER_VISIBLE].
 *   On this path liveLLMCalled remains false in the validation result.
 *   Mock and live sandbox paths are unchanged.
 *
 * Mock path behaviour (unchanged from Phase 8.2G-2):
 *   - liveLLMCalled must be false.
 *   - draftText must start with [MOCK_DRAFT_NEVER_USER_VISIBLE].
 *
 * Live sandbox path acceptance requires (Phase 8.2G-5A):
 *   - result.sandboxGuardProof present and valid per validateRuntimeLiveSandboxGuardProof.
 *   - proof.outputShapeValidated === true.
 *   - every draftText starts with [LIVE_SANDBOX_DRAFT_NEVER_USER_VISIBLE].
 *
 * Verdict precedence (highest → lowest):
 *   1. rejected_visibility_violation
 *   2. rejected_unsafe_draft
 *   3. rejected_contract_violation
 *   4. accepted_for_next_gate
 *
 * Key invariants (enforced at compile time via literal types):
 *   - acceptedForUserVisibleAssembly: false  — never true in any phase
 *   - userVisibleOutputAllowed: false        — never relaxed
 *
 * Safety guarantees:
 * - no LLM SDK imported
 * - no API keys or environment variables
 * - no external calls
 * - no side effects
 * - no persistence
 * - no logging
 * - pure function
 */

import type {
  RuntimeLLMDraftAdapterInput,
  RuntimeLLMDraftSectionType,
} from "./runtime-llm-draft-adapter-types";
import type {
  RuntimeLLMOutputContractDraftResult,
  RuntimeLLMOutputContractValidationResult,
  RuntimeLLMOutputContractVerdict,
  RuntimeLLMOutputContractViolationCode,
  RuntimeLLMOutputSectionValidationResult,
} from "./runtime-llm-output-contract-validator-types";
import {
  validateRuntimeLiveSandboxGuardProof,
} from "./runtime-live-path-type-extension-types";
import type { RuntimeLiveSandboxGuardProof } from "./runtime-live-path-type-extension-types";
import {
  CONTROLLED_LIVE_TEXT_DRAFT_PREFIX,
  validateControlledLiveTextRedactionProof,
} from "./live-input/controlled-live-text-draft-result-types";
import type { ControlledLiveTextRedactionProof } from "./live-input/controlled-live-text-draft-result-types";

export const RUNTIME_LLM_OUTPUT_CONTRACT_VALIDATOR_VERSION =
  "8.2g-2-runtime-llm-output-contract-validator-v2-8.2g-5a-8.2i-2";

// ── Prefix constants ───────────────────────────────────────────────────────────

const MOCK_DRAFT_PREFIX = "[MOCK_DRAFT_NEVER_USER_VISIBLE]";
const LIVE_SANDBOX_DRAFT_PREFIX = "[LIVE_SANDBOX_DRAFT_NEVER_USER_VISIBLE]";

// ── Helpers ───────────────────────────────────────────────────────────────────

function isNonBlank(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Returns true if the content portion of a draft text (after stripping the
 * required prefix) is blank or empty.
 */
function hasDraftPrefixButBlankContent(draftText: string, prefix: string): boolean {
  if (!draftText.startsWith(prefix)) return false;
  const content = draftText.slice(prefix.length);
  return !isNonBlank(content);
}

/**
 * Reads a field from an object bypassing TypeScript's literal-type narrowing,
 * allowing defensive runtime checks against values that the type system says
 * are always `false` or `true` but may not be at runtime (e.g., from a cast).
 */
function unsafeReadField<T>(obj: unknown, field: string): T {
  return (obj as Record<string, unknown>)[field] as T;
}

// ── Section validator ─────────────────────────────────────────────────────────

function validateSection(
  section: RuntimeLLMOutputContractDraftResult["sectionCandidates"][number],
  allowedSectionTypes: readonly RuntimeLLMDraftSectionType[],
  draftPrefix: string,
  prefixViolationCode: RuntimeLLMOutputContractViolationCode,
): RuntimeLLMOutputSectionValidationResult {
  const violations: RuntimeLLMOutputContractViolationCode[] = [];
  const notes: string[] = [];

  // Rule — section neverUserVisible invariant (defensive runtime check)
  const sectionNeverUserVisible = unsafeReadField<unknown>(section, "neverUserVisible");
  if (sectionNeverUserVisible !== true) {
    violations.push("llm_output_section_not_never_user_visible");
  }

  // Rule — allowed section membership
  if (!allowedSectionTypes.includes(section.sectionType)) {
    violations.push("llm_output_section_type_not_allowed");
  }

  // Rule — safety flags
  if (section.safetyFlags.length > 0) {
    violations.push("llm_output_unsafe_safety_flag");
    if (section.safetyFlags.includes("contains_user_visible_diagnostic")) {
      violations.push("llm_output_user_visible_diagnostic_detected");
    }
  }

  // Rule — required prefix on draftText
  if (!section.draftText.startsWith(draftPrefix)) {
    violations.push(prefixViolationCode);
  }

  // Rule — empty content after prefix
  if (hasDraftPrefixButBlankContent(section.draftText, draftPrefix)) {
    violations.push("llm_output_empty_draft_text");
  }

  // Rule — sourceBound advisory (no failure, just note)
  if (!section.sourceBound) {
    notes.push(
      "sourceBound is false; source binding verification is future work.",
    );
  }

  return {
    sectionType: section.sectionType,
    accepted: violations.length === 0,
    violations,
    neverUserVisible: true,
    notes: notes.length > 0 ? notes : undefined,
  };
}

// ── Verdict resolver ──────────────────────────────────────────────────────────

function resolveVerdict(
  resultViolations: readonly RuntimeLLMOutputContractViolationCode[],
  sectionResults: readonly RuntimeLLMOutputSectionValidationResult[],
): RuntimeLLMOutputContractVerdict {
  const VISIBILITY_VIOLATIONS: readonly RuntimeLLMOutputContractViolationCode[] = [
    "llm_output_live_llm_called",
    "llm_output_user_visible_enabled",
    "llm_output_result_not_never_user_visible",
    "llm_output_missing_mock_prefix",
    "llm_output_live_sandbox_prefix_missing",
    // Phase 8.2I-2: controlled live text visibility violations (result-level)
    "llm_output_controlled_live_text_visibility_violation",
  ];

  const SECTION_VISIBILITY_VIOLATIONS: readonly RuntimeLLMOutputContractViolationCode[] = [
    "llm_output_section_not_never_user_visible",
    "llm_output_missing_mock_prefix",
    "llm_output_live_sandbox_prefix_missing",
    // Phase 8.2I-2: controlled live text prefix violation (section-level)
    "llm_output_controlled_live_text_prefix_missing",
  ];

  const UNSAFE_VIOLATIONS: readonly RuntimeLLMOutputContractViolationCode[] = [
    "llm_output_unsafe_safety_flag",
    "llm_output_user_visible_diagnostic_detected",
  ];

  const hasResultVisibilityViolation = resultViolations.some((v) =>
    VISIBILITY_VIOLATIONS.includes(v),
  );
  const hasSectionVisibilityViolation = sectionResults.some((sr) =>
    sr.violations.some((v) => SECTION_VISIBILITY_VIOLATIONS.includes(v)),
  );

  if (hasResultVisibilityViolation || hasSectionVisibilityViolation) {
    return "rejected_visibility_violation";
  }

  const hasSectionUnsafeViolation = sectionResults.some((sr) =>
    sr.violations.some((v) => UNSAFE_VIOLATIONS.includes(v)),
  );

  if (hasSectionUnsafeViolation) {
    return "rejected_unsafe_draft";
  }

  const allSectionViolations = sectionResults.flatMap((sr) => sr.violations);
  const hasContractViolation =
    resultViolations.length > 0 || allSectionViolations.length > 0;

  if (hasContractViolation) {
    return "rejected_contract_violation";
  }

  return "accepted_for_next_gate";
}

// ── Main validator ────────────────────────────────────────────────────────────

/**
 * Validates a `RuntimeLLMOutputContractDraftResult` against its originating
 * `RuntimeLLMDraftAdapterInput`.
 *
 * Accepts both the mock adapter result (Phase 8.2G-1) and the live sandbox
 * draft candidate result (Phase 8.2G-5 / 8.2G-5A). Path is determined from
 * `result.adapterMode` and `result.liveLLMCalled`.
 *
 * Returns a `RuntimeLLMOutputContractValidationResult` with:
 * - a top-level `verdict`
 * - per-section validation results
 * - result-level violations
 * - confirmed forbidden move and required constraint coverage
 * - `acceptedForWordingGate: true` only when verdict is `accepted_for_next_gate`
 * - `acceptedForUserVisibleAssembly: false` — always
 * - `liveLLMCalled: boolean` — true only on accepted live sandbox path
 * - `userVisibleOutputAllowed: false` — always
 *
 * Pure function — no side effects, no external calls, no persistence.
 */
export function validateRuntimeLLMOutputContract({
  input,
  result,
}: {
  input: RuntimeLLMDraftAdapterInput;
  result: RuntimeLLMOutputContractDraftResult;
}): RuntimeLLMOutputContractValidationResult {
  const resultViolations: RuntimeLLMOutputContractViolationCode[] = [];
  const resultNotes: string[] = [];

  // ── A. Determine draft source path ────────────────────────────────────────

  const adapterModeValue = result.adapterMode;
  const liveLLMCalledValue = unsafeReadField<unknown>(result, "liveLLMCalled");

  const isMockPath = adapterModeValue === "mock";
  const isLiveSandboxAttempt =
    adapterModeValue === "future_live_llm" && liveLLMCalledValue === true;
  const isForbiddenFutureLLM =
    adapterModeValue === "future_live_llm" && liveLLMCalledValue !== true;
  // Phase 8.2I-2: controlled live text path
  const isControlledLiveTextPath = adapterModeValue === "controlled_live_text";
  const isUnrecognized =
    !isMockPath && !isLiveSandboxAttempt && !isForbiddenFutureLLM && !isControlledLiveTextPath;

  // Track whether each guarded path accepted with a valid proof
  let liveSandboxProofAccepted = false;
  let controlledLiveTextProofAccepted = false;

  // ── B. Mock path checks ───────────────────────────────────────────────────

  if (isMockPath) {
    // Rule 1 — liveLLMCalled must be false on mock path (defensive runtime check)
    if (liveLLMCalledValue !== false) {
      resultViolations.push("llm_output_live_llm_called");
      resultNotes.push(
        "result.liveLLMCalled is not false on the mock path. Critical visibility invariant violation.",
      );
    }
  }

  // ── C. Live sandbox path checks ───────────────────────────────────────────

  if (isLiveSandboxAttempt) {
    const sandboxGuardProof = unsafeReadField<RuntimeLiveSandboxGuardProof | undefined>(
      result,
      "sandboxGuardProof",
    );
    const proofValidation = validateRuntimeLiveSandboxGuardProof(
      sandboxGuardProof ?? null,
    );

    if (!proofValidation.valid) {
      if (proofValidation.status === "missing") {
        resultViolations.push("llm_output_live_sandbox_proof_missing");
        resultNotes.push(
          "Live sandbox path attempted but no sandboxGuardProof present.",
        );
      } else {
        resultViolations.push("llm_output_live_sandbox_proof_invalid");
        resultNotes.push(
          "Live sandbox guard proof failed validation. Diagnostics: " +
            proofValidation.diagnostics.join(", "),
        );
      }
    } else {
      // Proof valid — additional check: outputShapeValidated
      if (
        unsafeReadField<unknown>(sandboxGuardProof!, "outputShapeValidated") !== true
      ) {
        resultViolations.push("llm_output_live_sandbox_shape_not_attested");
        resultNotes.push(
          "Live sandbox proof present but outputShapeValidated is not true.",
        );
      } else {
        liveSandboxProofAccepted = true;
      }
    }
  }

  // ── D-new. Controlled live text path checks (Phase 8.2I-2) ──────────────

  if (isControlledLiveTextPath) {
    // Rule — sourceKind must be "controlled_live_text"
    const sourceKindValue = unsafeReadField<unknown>(result, "sourceKind");
    if (sourceKindValue !== "controlled_live_text") {
      resultViolations.push("llm_output_controlled_live_text_source_invalid");
      resultNotes.push(
        `result.sourceKind must be "controlled_live_text" on controlled live text path; got "${String(sourceKindValue)}".`,
      );
    }

    // Rule — liveLLMCalled must be false on this path
    if (liveLLMCalledValue !== false) {
      resultViolations.push("llm_output_controlled_live_text_visibility_violation");
      resultNotes.push(
        "result.liveLLMCalled must be false on controlled live text path. Visibility invariant violation.",
      );
    }

    // Rule — persistenceUsed must be false if present
    const persistenceUsedValue = unsafeReadField<unknown>(result, "persistenceUsed");
    if (persistenceUsedValue !== undefined && persistenceUsedValue !== false) {
      resultViolations.push("llm_output_controlled_live_text_persistence_violation");
      resultNotes.push("result.persistenceUsed is not false on controlled live text path.");
    }

    // Rule — dnaSavePerformed must be false if present
    const dnaSavePerformedValue = unsafeReadField<unknown>(result, "dnaSavePerformed");
    if (dnaSavePerformedValue !== undefined && dnaSavePerformedValue !== false) {
      resultViolations.push("llm_output_controlled_live_text_persistence_violation");
      resultNotes.push("result.dnaSavePerformed is not false on controlled live text path.");
    }

    // Rule — offlineSavePerformed must be false if present
    const offlineSavePerformedValue = unsafeReadField<unknown>(result, "offlineSavePerformed");
    if (offlineSavePerformedValue !== undefined && offlineSavePerformedValue !== false) {
      resultViolations.push("llm_output_controlled_live_text_persistence_violation");
      resultNotes.push("result.offlineSavePerformed is not false on controlled live text path.");
    }

    // Rule — redactionProof must be present
    const redactionProofValue = unsafeReadField<ControlledLiveTextRedactionProof | undefined>(
      result,
      "redactionProof",
    );
    if (redactionProofValue === null || redactionProofValue === undefined) {
      resultViolations.push("llm_output_controlled_live_text_proof_missing");
      resultNotes.push(
        "Controlled live text path requires redactionProof, but none present.",
      );
    } else {
      // Rule — redactionProof must pass validateControlledLiveTextRedactionProof
      const proofValidation = validateControlledLiveTextRedactionProof(redactionProofValue);
      if (!proofValidation.valid) {
        resultViolations.push("llm_output_controlled_live_text_proof_invalid");
        resultNotes.push(
          "Controlled live text redaction proof failed validation. Diagnostics: " +
            proofValidation.diagnostics.join(", "),
        );
      } else {
        controlledLiveTextProofAccepted = true;
      }
    }
  }

  // ── D. Forbidden future_live_llm (mock adapter blocked live mode) ─────────

  if (isForbiddenFutureLLM) {
    resultViolations.push("llm_output_forbidden_adapter_mode");
    resultNotes.push(
      "result.adapterMode is 'future_live_llm' but result.liveLLMCalled is not true. " +
        "This is the mock-blocked live mode. No valid live sandbox proof context present.",
    );
  }

  // ── E. Unrecognized source ────────────────────────────────────────────────

  if (isUnrecognized) {
    resultViolations.push("llm_output_unrecognized_draft_source");
    resultNotes.push(
      `Unrecognized adapterMode/liveLLMCalled combination: ` +
        `adapterMode=${String(adapterModeValue)}, liveLLMCalled=${String(liveLLMCalledValue)}.`,
    );
  }

  // ── F. Shared visibility invariants (both paths) ──────────────────────────

  // Rule — userVisibleOutputAllowed (defensive runtime check)
  const userVisibleOutputAllowedValue = unsafeReadField<unknown>(
    result,
    "userVisibleOutputAllowed",
  );
  if (userVisibleOutputAllowedValue !== false) {
    resultViolations.push("llm_output_user_visible_enabled");
    resultNotes.push(
      "result.userVisibleOutputAllowed is not false. Critical visibility invariant violation.",
    );
  }

  // Rule — result neverUserVisible (defensive runtime check)
  const resultNeverUserVisible = unsafeReadField<unknown>(result, "neverUserVisible");
  if (resultNeverUserVisible !== true) {
    resultViolations.push("llm_output_result_not_never_user_visible");
    resultNotes.push(
      "result.neverUserVisible is not true. Critical visibility invariant violation.",
    );
  }

  // ── G. Per-section validation ─────────────────────────────────────────────

  // Determine which prefix to enforce based on resolved path.
  // Controlled live text uses its own prefix regardless of proof outcome
  // (so prefix violations are still captured even when proof fails).
  const draftPrefix = liveSandboxProofAccepted
    ? LIVE_SANDBOX_DRAFT_PREFIX
    : isControlledLiveTextPath
    ? CONTROLLED_LIVE_TEXT_DRAFT_PREFIX
    : MOCK_DRAFT_PREFIX;
  const prefixViolationCode: RuntimeLLMOutputContractViolationCode =
    liveSandboxProofAccepted
      ? "llm_output_live_sandbox_prefix_missing"
      : isControlledLiveTextPath
      ? "llm_output_controlled_live_text_prefix_missing"
      : "llm_output_missing_mock_prefix";

  const sectionResults: RuntimeLLMOutputSectionValidationResult[] =
    result.sectionCandidates.map((section) =>
      validateSection(section, input.allowedSectionTypes, draftPrefix, prefixViolationCode),
    );

  // ── H. Forbidden move coverage ────────────────────────────────────────────

  const missingForbiddenMoves: string[] = [];
  for (const move of input.activeForbiddenMoves) {
    if (!result.appliedForbiddenMoves.includes(move)) {
      missingForbiddenMoves.push(move);
    }
  }
  if (missingForbiddenMoves.length > 0) {
    resultViolations.push("llm_output_missing_forbidden_move_coverage");
    resultNotes.push(
      `Forbidden moves missing from appliedForbiddenMoves: [${missingForbiddenMoves.join(", ")}].`,
    );
  }

  // ── I. Required constraint coverage ──────────────────────────────────────

  const missingRequiredConstraints: string[] = [];
  for (const constraint of input.activeRequiredConstraints) {
    if (!result.appliedRequiredConstraints.includes(constraint)) {
      missingRequiredConstraints.push(constraint);
    }
  }
  if (missingRequiredConstraints.length > 0) {
    resultViolations.push("llm_output_missing_required_constraint_coverage");
    resultNotes.push(
      `Required constraints missing from appliedRequiredConstraints: [${missingRequiredConstraints.join(", ")}].`,
    );
  }

  // ── J. Coverage sets ──────────────────────────────────────────────────────

  const validatedForbiddenMoves = input.activeForbiddenMoves.filter((move) =>
    result.appliedForbiddenMoves.includes(move),
  );
  const validatedRequiredConstraints = input.activeRequiredConstraints.filter(
    (constraint) => result.appliedRequiredConstraints.includes(constraint),
  );

  // ── K. Verdict ────────────────────────────────────────────────────────────

  const verdict = resolveVerdict(resultViolations, sectionResults);
  const acceptedForWordingGate = verdict === "accepted_for_next_gate";

  // liveLLMCalled in the result: true only when the live sandbox path accepted with proof.
  // Controlled live text path always yields false (no LLM involved).
  const liveLLMCalledResult: boolean = liveSandboxProofAccepted && acceptedForWordingGate;

  const pathLabel = isMockPath
    ? "mock"
    : isLiveSandboxAttempt
    ? `live_sandbox(proofAccepted=${String(liveSandboxProofAccepted)})`
    : isControlledLiveTextPath
    ? `controlled_live_text(proofAccepted=${String(controlledLiveTextProofAccepted)})`
    : isForbiddenFutureLLM
    ? "forbidden_future_llm"
    : "unrecognized";

  resultNotes.push(
    `Validator version: ${RUNTIME_LLM_OUTPUT_CONTRACT_VALIDATOR_VERSION}. ` +
      `Verdict: ${verdict}. ` +
      `Path: ${pathLabel}. ` +
      `Sections: ${sectionResults.length}. ` +
      `Result violations: ${resultViolations.length}. ` +
      `Section violations: ${sectionResults.reduce((n, sr) => n + sr.violations.length, 0)}.`,
  );
  resultNotes.push(
    "acceptedForUserVisibleAssembly: false — this validator never authorises user-visible output. " +
      `liveLLMCalled: ${String(liveLLMCalledResult)}. userVisibleOutputAllowed: false.`,
  );

  return {
    verdict,
    acceptedForWordingGate,
    acceptedForUserVisibleAssembly: false,
    sectionResults,
    violations: resultViolations,
    validatedForbiddenMoves,
    validatedRequiredConstraints,
    liveLLMCalled: liveLLMCalledResult,
    userVisibleOutputAllowed: false,
    neverUserVisible: true,
    notes: resultNotes,
  };
}
