/**
 * Runtime LLM Output Contract Validator types (Phase 8.2G-2).
 *
 * Defines the type model for the safety gate that sits immediately after
 * `runRuntimeLLMDraftMockAdapter` (Phase 8.2G-1) and before the wording
 * governance gate (Phase 8.2G-3).
 *
 * Purpose:
 *   Validate that a `RuntimeLLMDraftAdapterResult` respects all governance
 *   boundaries before it can proceed further into the pipeline. This validator
 *   checks visibility invariants, contract coverage, section membership,
 *   safety flags, and mock prefix discipline.
 *
 * This validator does NOT produce user-visible output.
 * This validator does NOT call any LLM.
 * This validator does NOT relax any invariant from Phase 8.2G-1.
 *
 * Position in the 15-layer runtime pipeline (Phase 8.2G-0):
 *   llm_draft_adapter (8.2G-1) → llm_output_contract_validator (8.2G-2) → wording_evaluation_gate (8.2G-3)
 *
 * Safety guarantees:
 * - no LLM SDK imported
 * - no API keys or environment variables
 * - no user-visible output
 * - acceptedForUserVisibleAssembly is always literal false
 * - liveLLMCalled is always literal false
 * - userVisibleOutputAllowed is always literal false
 */

import type { RuntimeLLMDraftSectionType } from "./runtime-llm-draft-adapter-types";

// ── Verdict ───────────────────────────────────────────────────────────────────

/**
 * The top-level verdict produced by `validateRuntimeLLMOutputContract`.
 *
 * - `accepted_for_next_gate`       — draft passes all contract checks; may proceed
 *                                    to Phase 8.2G-3 (wording governance gate).
 * - `rejected_contract_violation`  — draft fails a structural contract rule:
 *                                    missing forbidden move coverage, disallowed
 *                                    section type, forbidden adapter mode, etc.
 * - `rejected_unsafe_draft`        — one or more sections carry safety flags.
 * - `rejected_visibility_violation`— the draft's visibility invariants are broken:
 *                                    `neverUserVisible` is not `true`, or `liveLLMCalled`
 *                                    / `userVisibleOutputAllowed` are not `false`.
 */
export type RuntimeLLMOutputContractVerdict =
  | "accepted_for_next_gate"
  | "rejected_contract_violation"
  | "rejected_unsafe_draft"
  | "rejected_visibility_violation";

// ── Violation codes ───────────────────────────────────────────────────────────

/**
 * Never-user-visible violation codes emitted by the output contract validator.
 *
 * - `llm_output_live_llm_called`                  — result.liveLLMCalled is not false.
 * - `llm_output_user_visible_enabled`             — result.userVisibleOutputAllowed is not false.
 * - `llm_output_result_not_never_user_visible`    — result.neverUserVisible is not true.
 * - `llm_output_section_not_never_user_visible`   — a section.neverUserVisible is not true.
 * - `llm_output_section_type_not_allowed`         — a section.sectionType is not in
 *                                                   input.allowedSectionTypes.
 * - `llm_output_section_not_source_bound_policy`  — reserved for future source-binding policy
 *                                                   violations; not raised in Phase 8.2G-2.
 * - `llm_output_unsafe_safety_flag`               — a section has non-empty safetyFlags.
 * - `llm_output_missing_forbidden_move_coverage`  — an active forbidden move from input is
 *                                                   absent from result.appliedForbiddenMoves.
 * - `llm_output_missing_required_constraint_coverage`— an active required constraint from
 *                                                   input is absent from
 *                                                   result.appliedRequiredConstraints.
 * - `llm_output_missing_mock_prefix`              — a section.draftText does not start with
 *                                                   `[MOCK_DRAFT_NEVER_USER_VISIBLE]`.
 * - `llm_output_empty_draft_text`                 — a section.draftText is blank.
 * - `llm_output_user_visible_diagnostic_detected` — a section has the
 *                                                   `contains_user_visible_diagnostic` safety flag.
 * - `llm_output_forbidden_adapter_mode`           — input.adapterMode is `future_live_llm`,
 *                                                   which is a forbidden mode in Phase 8.2G-2.
 * - `llm_output_unknown_contract_gap`             — a generic gap detected with no specific code.
 */
export type RuntimeLLMOutputContractViolationCode =
  | "llm_output_live_llm_called"
  | "llm_output_user_visible_enabled"
  | "llm_output_result_not_never_user_visible"
  | "llm_output_section_not_never_user_visible"
  | "llm_output_section_type_not_allowed"
  | "llm_output_section_not_source_bound_policy"
  | "llm_output_unsafe_safety_flag"
  | "llm_output_missing_forbidden_move_coverage"
  | "llm_output_missing_required_constraint_coverage"
  | "llm_output_missing_mock_prefix"
  | "llm_output_empty_draft_text"
  | "llm_output_user_visible_diagnostic_detected"
  | "llm_output_forbidden_adapter_mode"
  | "llm_output_unknown_contract_gap";

// ── Per-section result ────────────────────────────────────────────────────────

/**
 * The validation result for a single `RuntimeLLMDraftSectionCandidate`.
 *
 * `sectionType`    — the type of the validated section.
 * `accepted`       — `true` if no violations were found on this section.
 * `violations`     — violation codes specific to this section.
 * `neverUserVisible` — compile-time invariant.
 * `notes`          — optional governance notes (e.g., sourceBound advisory).
 */
export interface RuntimeLLMOutputSectionValidationResult {
  readonly sectionType: RuntimeLLMDraftSectionType;
  readonly accepted: boolean;
  readonly violations: readonly RuntimeLLMOutputContractViolationCode[];
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Top-level validation result ───────────────────────────────────────────────

/**
 * The result of `validateRuntimeLLMOutputContract`.
 *
 * `verdict`                       — top-level decision (see `RuntimeLLMOutputContractVerdict`).
 * `acceptedForWordingGate`        — `true` only when `verdict === "accepted_for_next_gate"`.
 * `acceptedForUserVisibleAssembly`— always literal `false` in Phase 8.2G-2. This validator
 *                                   never authorises user-visible output.
 * `sectionResults`                — per-section validation outcomes.
 * `violations`                    — result-level violation codes.
 * `validatedForbiddenMoves`       — forbidden moves confirmed as covered.
 * `validatedRequiredConstraints`  — required constraints confirmed as covered.
 * `liveLLMCalled`                 — always literal `false`.
 * `userVisibleOutputAllowed`      — always literal `false`.
 * `neverUserVisible`              — always literal `true`.
 * `notes`                         — optional governance notes.
 */
export interface RuntimeLLMOutputContractValidationResult {
  readonly verdict: RuntimeLLMOutputContractVerdict;
  readonly acceptedForWordingGate: boolean;
  readonly acceptedForUserVisibleAssembly: false;
  readonly sectionResults: readonly RuntimeLLMOutputSectionValidationResult[];
  readonly violations: readonly RuntimeLLMOutputContractViolationCode[];
  readonly validatedForbiddenMoves: readonly string[];
  readonly validatedRequiredConstraints: readonly string[];
  readonly liveLLMCalled: false;
  readonly userVisibleOutputAllowed: false;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}
