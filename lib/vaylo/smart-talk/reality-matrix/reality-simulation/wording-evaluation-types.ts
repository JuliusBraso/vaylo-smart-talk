/**
 * Runtime Explanation Wording Evaluation types (Phase 8.2F-12).
 *
 * Metadata-only type model for deterministic wording risk evaluation.
 * No real text is analysed here. No NLP. No LLM. No prose generated.
 * All scores are caller-supplied metadata — never derived from live text.
 *
 * Safety guarantees:
 * - no real explanation text processed
 * - no NLP or LLM calls
 * - no prose generation
 * - no Smart Talk wiring
 * - no database writes
 * - no user-visible output
 * - neverUserVisible: true enforced on all results
 */

// ── Tone matrix ───────────────────────────────────────────────────────────────

/**
 * Caller-supplied wording-risk metadata scores for a future explanation draft.
 * All values must be in [0, 100]; values outside this range are clamped by
 * `evaluateExplanationWordingScaffold` before evaluation.
 *
 * - `authoritativeLegalAdvice`: degree to which the text reads as definitive
 *   legal advice. Zero tolerance — any value > 0 is a hard fail.
 * - `falseReassurance`: degree to which the text downplays genuine risk or
 *   implies a favourable outcome not supported by the source. Zero tolerance.
 * - `panicInducing`: degree to which the text amplifies urgency beyond source
 *   evidence. Hard fail if > 30.
 * - `manipulative`: degree to which the text uses persuasion techniques that
 *   exploit user vulnerability. Zero tolerance.
 * - `confusingAmbiguity`: degree to which the text leaves critical fields
 *   unresolved or contradictory. Human review required if > 40.
 * - `empatheticClarity`: degree to which the text communicates uncertainty and
 *   next-steps in a calm, accessible way. Must be ≥ 50 for approval.
 */
export interface WordingToneMatrix {
  readonly authoritativeLegalAdvice: number;
  readonly falseReassurance: number;
  readonly panicInducing: number;
  readonly manipulative: number;
  readonly confusingAmbiguity: number;
  readonly empatheticClarity: number;
}

// ── Disposition ───────────────────────────────────────────────────────────────

/**
 * The structural routing decision for this wording evaluation.
 *
 * - `approved`: no violations detected and empathetic clarity is sufficient;
 *   wording metadata is safe to proceed.
 * - `human_review_required`: no hard-fail violations but ambiguity or
 *   insufficient clarity requires a human reviewer before output proceeds.
 * - `hard_fail_tone_violation`: one or more zero-tolerance or panic signals
 *   detected; wording must not proceed under any circumstances.
 */
export type WordingEvaluationDisposition =
  | "approved"
  | "human_review_required"
  | "hard_fail_tone_violation";

// ── Violation codes ───────────────────────────────────────────────────────────

/**
 * Never-user-visible violation codes emitted by `evaluateExplanationWordingScaffold`.
 */
export type WordingViolationCode =
  | "tone_authoritative_advice_detected"
  | "tone_false_reassurance_detected"
  | "tone_panic_inducing_detected"
  | "tone_manipulative_detected"
  | "tone_highly_ambiguous"
  | "tone_insufficient_clarity";

// ── Input ─────────────────────────────────────────────────────────────────────

/**
 * Input to `evaluateExplanationWordingScaffold`.
 *
 * `draftId`: opaque stable reference for audit tracing; not a real draft token.
 * `toneMatrix`: caller-supplied metadata scores (see `WordingToneMatrix`).
 * `sourceKind`: provenance of the scores. In Phase 8.2F-12, only
 *   `"synthetic_metadata"` is used. Future phases may introduce
 *   `"future_llm_judge_metadata"` or `"manual_review_metadata"`.
 */
export interface WordingEvaluationInput {
  readonly draftId: string;
  readonly toneMatrix: WordingToneMatrix;
  readonly sourceKind?:
    | "synthetic_metadata"
    | "future_llm_judge_metadata"
    | "manual_review_metadata";
}

// ── Result ────────────────────────────────────────────────────────────────────

/**
 * The never-user-visible output of `evaluateExplanationWordingScaffold`.
 *
 * `disposition`: routing decision for this wording evaluation.
 * `violations`: ordered list of violation codes detected; empty on `approved`.
 * `isSafeForUser`: `true` only when `disposition === "approved"`.
 * `clampedToneMatrix`: the input tone matrix after clamping to [0, 100]; useful
 *   for audit and regression scaffolds to verify clamp behaviour.
 * `neverUserVisible`: compile-time invariant.
 * `notes`: internal governance notes — never user-visible.
 */
export interface WordingEvaluationResult {
  readonly disposition: WordingEvaluationDisposition;
  readonly violations: readonly WordingViolationCode[];
  readonly isSafeForUser: boolean;
  readonly clampedToneMatrix: WordingToneMatrix;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}
