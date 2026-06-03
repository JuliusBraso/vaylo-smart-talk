/**
 * Runtime LLM Output Contract Validator (Phase 8.2G-2).
 *
 * Implements `validateRuntimeLLMOutputContract` — a pure safety gate that
 * checks a `RuntimeLLMDraftAdapterResult` (from Phase 8.2G-1) against the
 * originating `RuntimeLLMDraftAdapterInput` before the draft can proceed to
 * the wording governance gate (Phase 8.2G-3).
 *
 * This is the first safety gate after the LLM draft adapter. Its job is to
 * refuse any draft that:
 *  - violates visibility invariants (neverUserVisible, liveLLMCalled, userVisibleOutputAllowed)
 *  - carries unsafe safety flags on any section candidate
 *  - contains sections not in the allowed section type list
 *  - has gaps in forbidden move or required constraint coverage
 *  - lacks the required mock prefix on draftText
 *  - uses the forbidden `future_live_llm` adapter mode
 *
 * Position in pipeline:
 *   llm_draft_adapter → [THIS GATE] → wording_evaluation_gate (8.2G-3)
 *
 * Verdict precedence (highest → lowest):
 *   1. rejected_visibility_violation  — neverUserVisible/liveLLMCalled/userVisibleOutputAllowed
 *   2. rejected_unsafe_draft          — safety flags on any section
 *   3. rejected_contract_violation    — adapter mode, section membership, coverage gaps,
 *                                       prefix, empty text
 *   4. accepted_for_next_gate         — all rules pass
 *
 * Key invariants (all enforced at compile time via literal types):
 *   - acceptedForUserVisibleAssembly: false  — never true in Phase 8.2G-2
 *   - liveLLMCalled: false                   — never relaxed in this phase
 *   - userVisibleOutputAllowed: false        — never relaxed in this phase
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
  RuntimeLLMDraftAdapterResult,
  RuntimeLLMDraftSectionCandidate,
  RuntimeLLMDraftSectionType,
} from "./runtime-llm-draft-adapter-types";
import type {
  RuntimeLLMOutputContractValidationResult,
  RuntimeLLMOutputContractVerdict,
  RuntimeLLMOutputContractViolationCode,
  RuntimeLLMOutputSectionValidationResult,
} from "./runtime-llm-output-contract-validator-types";

export const RUNTIME_LLM_OUTPUT_CONTRACT_VALIDATOR_VERSION =
  "8.2g-2-runtime-llm-output-contract-validator-v1";

// ── Helpers ───────────────────────────────────────────────────────────────────

const MOCK_DRAFT_PREFIX = "[MOCK_DRAFT_NEVER_USER_VISIBLE]";

/**
 * Returns true if `value` has any non-whitespace characters when trimmed.
 */
function isNonBlank(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Returns true if the content portion of a draft text (after stripping the
 * required mock prefix) is blank or empty.
 *
 * This allows the blank-content check (Rule 10) and the missing-prefix check
 * (Rule 9) to be independent:
 *  - Rule 9 fires if the prefix is absent from the full text.
 *  - Rule 10 fires if the prefix is present but no actual content follows it.
 */
function hasMockPrefixButBlankContent(draftText: string, prefix: string): boolean {
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
  section: RuntimeLLMDraftSectionCandidate,
  allowedSectionTypes: readonly RuntimeLLMDraftSectionType[],
): RuntimeLLMOutputSectionValidationResult {
  const violations: RuntimeLLMOutputContractViolationCode[] = [];
  const notes: string[] = [];

  // Rule 4 — section neverUserVisible invariant (defensive runtime check)
  const sectionNeverUserVisible = unsafeReadField<unknown>(section, "neverUserVisible");
  if (sectionNeverUserVisible !== true) {
    violations.push("llm_output_section_not_never_user_visible");
  }

  // Rule 5 — allowed section membership
  if (!allowedSectionTypes.includes(section.sectionType)) {
    violations.push("llm_output_section_type_not_allowed");
  }

  // Rule 6 — safety flags
  if (section.safetyFlags.length > 0) {
    violations.push("llm_output_unsafe_safety_flag");
    if (section.safetyFlags.includes("contains_user_visible_diagnostic")) {
      violations.push("llm_output_user_visible_diagnostic_detected");
    }
  }

  // Rule 9 — mock prefix
  if (!section.draftText.startsWith(MOCK_DRAFT_PREFIX)) {
    violations.push("llm_output_missing_mock_prefix");
  }

  // Rule 10 — empty content after mock prefix
  // Checked separately from Rule 9: fires when the prefix is present but the
  // content portion following it is blank (e.g., draftText === "[MOCK_DRAFT_NEVER_USER_VISIBLE]").
  // When the full draftText is blank, Rule 9 (missing prefix) fires instead.
  if (hasMockPrefixButBlankContent(section.draftText, MOCK_DRAFT_PREFIX)) {
    violations.push("llm_output_empty_draft_text");
  }

  // Rule 11 — sourceBound advisory (no failure, just note)
  if (!section.sourceBound) {
    notes.push(
      "sourceBound remains false in mock phase; production source binding is future work.",
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

/**
 * Applies verdict precedence rules:
 *   visibility > unsafe > contract > accepted
 */
function resolveVerdict(
  resultViolations: readonly RuntimeLLMOutputContractViolationCode[],
  sectionResults: readonly RuntimeLLMOutputSectionValidationResult[],
): RuntimeLLMOutputContractVerdict {
  const VISIBILITY_VIOLATIONS: readonly RuntimeLLMOutputContractViolationCode[] = [
    "llm_output_live_llm_called",
    "llm_output_user_visible_enabled",
    "llm_output_result_not_never_user_visible",
    "llm_output_missing_mock_prefix",
  ];

  const SECTION_VISIBILITY_VIOLATIONS: readonly RuntimeLLMOutputContractViolationCode[] = [
    "llm_output_section_not_never_user_visible",
    "llm_output_missing_mock_prefix",
  ];

  const UNSAFE_VIOLATIONS: readonly RuntimeLLMOutputContractViolationCode[] = [
    "llm_output_unsafe_safety_flag",
    "llm_output_user_visible_diagnostic_detected",
  ];

  // Check result-level visibility violations
  const hasResultVisibilityViolation = resultViolations.some((v) =>
    VISIBILITY_VIOLATIONS.includes(v),
  );

  // Check section-level visibility violations
  const hasSectionVisibilityViolation = sectionResults.some((sr) =>
    sr.violations.some((v) => SECTION_VISIBILITY_VIOLATIONS.includes(v)),
  );

  if (hasResultVisibilityViolation || hasSectionVisibilityViolation) {
    return "rejected_visibility_violation";
  }

  // Check section-level unsafe violations
  const hasSectionUnsafeViolation = sectionResults.some((sr) =>
    sr.violations.some((v) => UNSAFE_VIOLATIONS.includes(v)),
  );

  if (hasSectionUnsafeViolation) {
    return "rejected_unsafe_draft";
  }

  // Check result-level and section-level contract violations
  const allSectionViolations = sectionResults.flatMap((sr) => sr.violations);
  const hasContractViolation =
    resultViolations.length > 0 ||
    allSectionViolations.length > 0;

  if (hasContractViolation) {
    return "rejected_contract_violation";
  }

  return "accepted_for_next_gate";
}

// ── Main validator ────────────────────────────────────────────────────────────

/**
 * Validates a `RuntimeLLMDraftAdapterResult` against its originating
 * `RuntimeLLMDraftAdapterInput`.
 *
 * Returns a `RuntimeLLMOutputContractValidationResult` with:
 * - a top-level `verdict`
 * - per-section validation results
 * - result-level violations
 * - confirmed forbidden move and required constraint coverage
 * - `acceptedForWordingGate: true` only when verdict is `accepted_for_next_gate`
 * - `acceptedForUserVisibleAssembly: false` — always
 * - `liveLLMCalled: false` — always
 * - `userVisibleOutputAllowed: false` — always
 *
 * Pure function — no side effects, no external calls, no persistence.
 */
export function validateRuntimeLLMOutputContract({
  input,
  result,
}: {
  input: RuntimeLLMDraftAdapterInput;
  result: RuntimeLLMDraftAdapterResult;
}): RuntimeLLMOutputContractValidationResult {
  const resultViolations: RuntimeLLMOutputContractViolationCode[] = [];
  const resultNotes: string[] = [];

  // Rule: forbidden adapter mode (Case 4 — future_live_llm is forbidden in this gate)
  if (input.adapterMode === "future_live_llm") {
    resultViolations.push("llm_output_forbidden_adapter_mode");
    resultNotes.push(
      "input.adapterMode is 'future_live_llm'. This mode is forbidden in Phase 8.2G-2. " +
        "Live LLM integration is not permitted until Phase 8.2G-5.",
    );
  }

  // Rule 1 — liveLLMCalled invariant (defensive runtime check)
  const liveLLMCalledValue = unsafeReadField<unknown>(result, "liveLLMCalled");
  if (liveLLMCalledValue !== false) {
    resultViolations.push("llm_output_live_llm_called");
    resultNotes.push(
      "result.liveLLMCalled is not false. This is a critical visibility invariant violation.",
    );
  }

  // Rule 2 — userVisibleOutputAllowed invariant (defensive runtime check)
  const userVisibleOutputAllowedValue = unsafeReadField<unknown>(
    result,
    "userVisibleOutputAllowed",
  );
  if (userVisibleOutputAllowedValue !== false) {
    resultViolations.push("llm_output_user_visible_enabled");
    resultNotes.push(
      "result.userVisibleOutputAllowed is not false. This is a critical visibility invariant violation.",
    );
  }

  // Rule 3 — result neverUserVisible invariant (defensive runtime check)
  const resultNeverUserVisible = unsafeReadField<unknown>(result, "neverUserVisible");
  if (resultNeverUserVisible !== true) {
    resultViolations.push("llm_output_result_not_never_user_visible");
    resultNotes.push(
      "result.neverUserVisible is not true. This is a critical visibility invariant violation.",
    );
  }

  // Rules 4–10 — per-section validation
  const sectionResults: RuntimeLLMOutputSectionValidationResult[] =
    result.sectionCandidates.map((section) =>
      validateSection(section, input.allowedSectionTypes),
    );

  // Rule 7 — forbidden move coverage
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

  // Rule 8 — required constraint coverage
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

  // Compute validated coverage sets
  const validatedForbiddenMoves = input.activeForbiddenMoves.filter((move) =>
    result.appliedForbiddenMoves.includes(move),
  );
  const validatedRequiredConstraints = input.activeRequiredConstraints.filter(
    (constraint) => result.appliedRequiredConstraints.includes(constraint),
  );

  // Resolve verdict
  const verdict = resolveVerdict(resultViolations, sectionResults);
  const acceptedForWordingGate = verdict === "accepted_for_next_gate";

  resultNotes.push(
    `Validator version: ${RUNTIME_LLM_OUTPUT_CONTRACT_VALIDATOR_VERSION}. ` +
      `Verdict: ${verdict}. Sections validated: ${sectionResults.length}. ` +
      `Result violations: ${resultViolations.length}. ` +
      `Total section violations: ${sectionResults.reduce((n, sr) => n + sr.violations.length, 0)}.`,
  );
  resultNotes.push(
    "acceptedForUserVisibleAssembly: false — this validator never authorises " +
      "user-visible output. liveLLMCalled: false. userVisibleOutputAllowed: false.",
  );

  return {
    verdict,
    acceptedForWordingGate,
    acceptedForUserVisibleAssembly: false,
    sectionResults,
    violations: resultViolations,
    validatedForbiddenMoves,
    validatedRequiredConstraints,
    liveLLMCalled: false,
    userVisibleOutputAllowed: false,
    neverUserVisible: true,
    notes: resultNotes,
  };
}
