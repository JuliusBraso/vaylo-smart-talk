/**
 * Runtime LLM Output Contract Validator types (Phase 8.2G-2, extended 8.2G-5A).
 *
 * Defines the type model for the safety gate that sits immediately after
 * `runRuntimeLLMDraftMockAdapter` (Phase 8.2G-1) / `runRuntimeLiveLLMSandboxAdapter`
 * (Phase 8.2G-5) and before the wording governance gate (Phase 8.2G-3).
 *
 * Phase 8.2G-5A extension:
 *   The validator now accepts a union input type `RuntimeLLMOutputContractDraftResult`
 *   that covers both the mock adapter path and the live sandbox path. The live path
 *   is only accepted when a valid `RuntimeLiveSandboxGuardProof` is present.
 *
 *   `liveLLMCalled` on the validation result changes from literal `false` to `boolean`
 *   to reflect whether a live LLM was involved. It is `true` only when the live
 *   sandbox path is accepted with a valid proof.
 *
 * This validator does NOT produce user-visible output.
 * This validator does NOT call any LLM.
 * This validator does NOT weaken Phase 8.2G-1 mock safety invariants.
 *
 * Position in the 15-layer runtime pipeline (Phase 8.2G-0):
 *   llm_draft_adapter (8.2G-1/8.2G-5) → llm_output_contract_validator (8.2G-2) → wording_evaluation_gate (8.2G-3)
 *
 * Safety guarantees:
 * - no LLM SDK imported
 * - no API keys or environment variables
 * - no user-visible output
 * - acceptedForUserVisibleAssembly is always literal false
 * - userVisibleOutputAllowed is always literal false
 * - liveLLMCalled is true only when a valid guard proof attests a live sandbox call
 */

import type {
  RuntimeLLMDraftSectionType,
  RuntimeLLMAdapterMode,
  RuntimeLLMAdapterAccessTier,
  RuntimeLLMDraftSectionCandidate,
} from "./runtime-llm-draft-adapter-types";
import type { RuntimeLiveSandboxGuardProof } from "./runtime-live-path-type-extension-types";

export type { RuntimeLiveSandboxGuardProof };

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

// ── Draft source kind (Phase 8.2G-5A) ────────────────────────────────────────

/**
 * The source kind of the draft result being validated.
 * Determined by `validateRuntimeLLMOutputContract` before applying path-specific rules.
 *
 * - `mock_adapter_result`   — `adapterMode === "mock"` and `liveLLMCalled === false`.
 * - `live_sandbox_result`   — `adapterMode === "future_live_llm"` and `liveLLMCalled === true`.
 */
export type RuntimeLLMOutputContractDraftSourceKind =
  | "mock_adapter_result"
  | "live_sandbox_result";

// ── Draft result union (Phase 8.2G-5A) ───────────────────────────────────────

/**
 * The union of draft result types accepted by `validateRuntimeLLMOutputContract`.
 *
 * Both `RuntimeLLMDraftAdapterResult` (Phase 8.2G-1) and
 * `RuntimeLiveLLMSandboxDraftCandidateResult` (Phase 8.2G-5) satisfy this interface
 * structurally. The `sandboxGuardProof` field is optional so the mock path does
 * not need to provide it; it is required for the live sandbox path to be accepted.
 *
 * Fields used by the validator:
 * - `adapterMode`              — determines the source path.
 * - `accessTier`               — for access tier compliance.
 * - `sectionCandidates`        — array of candidates to validate.
 * - `appliedForbiddenMoves`    — coverage against input's active forbidden moves.
 * - `appliedRequiredConstraints`— coverage against input's active required constraints.
 * - `liveLLMCalled`            — `false` for mock path, `true` for live sandbox path.
 * - `userVisibleOutputAllowed` — must always be `false`.
 * - `neverUserVisible`         — must always be `true`.
 * - `sandboxGuardProof`        — optional on mock path; required for live sandbox acceptance.
 */
export interface RuntimeLLMOutputContractDraftResult {
  readonly adapterMode: RuntimeLLMAdapterMode;
  readonly accessTier: RuntimeLLMAdapterAccessTier;
  readonly sectionCandidates: readonly RuntimeLLMDraftSectionCandidate[];
  readonly appliedForbiddenMoves: readonly string[];
  readonly appliedRequiredConstraints: readonly string[];
  readonly liveLLMCalled: boolean;
  readonly userVisibleOutputAllowed: false;
  readonly neverUserVisible: true;
  readonly sandboxGuardProof?: RuntimeLiveSandboxGuardProof;
}

// ── Violation codes ───────────────────────────────────────────────────────────

/**
 * Never-user-visible violation codes emitted by the output contract validator.
 *
 * Existing codes (Phase 8.2G-2):
 * - `llm_output_live_llm_called`                  — mock path: liveLLMCalled is not false.
 * - `llm_output_user_visible_enabled`             — result.userVisibleOutputAllowed is not false.
 * - `llm_output_result_not_never_user_visible`    — result.neverUserVisible is not true.
 * - `llm_output_section_not_never_user_visible`   — a section.neverUserVisible is not true.
 * - `llm_output_section_type_not_allowed`         — a section.sectionType not in
 *                                                   input.allowedSectionTypes.
 * - `llm_output_section_not_source_bound_policy`  — reserved; not raised in 8.2G-2.
 * - `llm_output_unsafe_safety_flag`               — a section has non-empty safetyFlags.
 * - `llm_output_missing_forbidden_move_coverage`  — an active forbidden move absent from
 *                                                   result.appliedForbiddenMoves.
 * - `llm_output_missing_required_constraint_coverage`— an active required constraint absent
 *                                                   from result.appliedRequiredConstraints.
 * - `llm_output_missing_mock_prefix`              — mock path: draftText lacks
 *                                                   `[MOCK_DRAFT_NEVER_USER_VISIBLE]` prefix.
 * - `llm_output_empty_draft_text`                 — draftText is blank after prefix.
 * - `llm_output_user_visible_diagnostic_detected` — section has `contains_user_visible_diagnostic`.
 * - `llm_output_forbidden_adapter_mode`           — result.adapterMode is `future_live_llm`
 *                                                   but conditions for live sandbox path
 *                                                   are not met (e.g. liveLLMCalled is false).
 * - `llm_output_unknown_contract_gap`             — a generic gap with no specific code.
 *
 * New codes (Phase 8.2G-5A):
 * - `llm_output_live_sandbox_proof_missing`       — live path: no sandboxGuardProof present.
 * - `llm_output_live_sandbox_proof_invalid`       — live path: proof failed validation rules.
 * - `llm_output_live_sandbox_prefix_missing`      — live path: draftText lacks
 *                                                   `[LIVE_SANDBOX_DRAFT_NEVER_USER_VISIBLE]` prefix.
 * - `llm_output_live_sandbox_shape_not_attested`  — live path: proof.outputShapeValidated not true.
 * - `llm_output_unrecognized_draft_source`        — adapterMode/liveLLMCalled combination
 *                                                   does not match any known source kind.
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
  | "llm_output_unknown_contract_gap"
  // Phase 8.2G-5A: live sandbox path violations
  | "llm_output_live_sandbox_proof_missing"
  | "llm_output_live_sandbox_proof_invalid"
  | "llm_output_live_sandbox_prefix_missing"
  | "llm_output_live_sandbox_shape_not_attested"
  | "llm_output_unrecognized_draft_source";

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
 * `liveLLMCalled`                 — `false` for the mock path; `true` only when the
 *                                   live sandbox path is accepted with a valid guard proof.
 *                                   Changed from literal `false` in Phase 8.2G-5A.
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
  readonly liveLLMCalled: boolean;
  readonly userVisibleOutputAllowed: false;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}
