/**
 * Runtime Explanation Wording Evaluation types
 * (Phase 8.2F-12 / 8.2F-15G wording score provenance contract).
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

// ── Wording score provenance contract (Phase 8.2F-15G) ───────────────────────

/**
 * The origin kind of a structured wording tone score report.
 *
 * - `synthetic_metadata`: manually authored metadata fixture (no real evaluator).
 * - `manual_review_metadata`: scores supplied by a human reviewer during content audit.
 * - `future_llm_judge_metadata`: reserved for a real LLM judge integration (not yet wired).
 * - `imported_score_report`: imported from an external score-reporting system.
 */
export type WordingToneScoreReportSourceKind =
  | "synthetic_metadata"
  | "manual_review_metadata"
  | "future_llm_judge_metadata"
  | "imported_score_report";

/**
 * The attestation posture of a structured wording tone score report.
 *
 * - `unattested`: scores were supplied by the caller without any verified
 *   evaluator source; downstream consumers should note this provenance gap.
 * - `test_fixture_attested`: scores were authored and reviewed as an explicit
 *   regression/audit fixture; safe to use in governance scaffolds.
 * - `manual_review_attested`: scores were supplied and signed off by a qualified
 *   human reviewer; accepted for governance audit.
 * - `future_judge_attested`: reserved for scores produced by a verified LLM judge
 *   in a future production phase.
 */
export type WordingToneScoreAttestationStatus =
  | "unattested"
  | "test_fixture_attested"
  | "manual_review_attested"
  | "future_judge_attested";

/**
 * A structured provenance-backed wording tone score report.
 *
 * This type replaces bare `WordingToneMatrix` as the preferred way to carry
 * wording risk scores through the evaluation pipeline. It binds the scores to
 * a provenance source, evaluator identity, and attestation status, making
 * caller-supplied manipulation detectable at the governance layer.
 *
 * `reportId`: opaque identifier for audit tracing; not a real session token.
 * `sourceKind`: how this report was produced.
 * `attestationStatus`: the trust posture of this report.
 * `toneMatrix`: the risk scores being evaluated.
 * `evaluatorId`: opaque identifier for the system or reviewer that produced scores.
 * `evaluatorVersion`: version string of the evaluator; tracks score model drift.
 * `generatedBy`: opaque string identifying the calling context or scaffold.
 * `neverUserVisible`: compile-time invariant — this report must never reach UI.
 * `notes`: internal governance notes — never user-visible.
 */
export interface WordingToneScoreReport {
  readonly reportId: string;
  readonly sourceKind: WordingToneScoreReportSourceKind;
  readonly attestationStatus: WordingToneScoreAttestationStatus;
  readonly toneMatrix: WordingToneMatrix;
  readonly evaluatorId: string;
  readonly evaluatorVersion: string;
  readonly generatedBy: string;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

/**
 * Structural validation result for a `WordingToneScoreReport` at governance ingress.
 *
 * `valid`: basic structural integrity passed (non-empty IDs, finite score values).
 * `scoreUsable`: all `toneMatrix` values are finite (non-finite values block evaluation).
 * `diagnostics`: human-internal notes about detected issues; never user-visible.
 *   May include `wording_score_report_unattested`, `wording_score_report_invalid`,
 *   or `wording_score_clamped` diagnostic strings.
 * `neverUserVisible`: compile-time invariant.
 */
export interface WordingToneScoreReportValidationResult {
  readonly valid: boolean;
  readonly scoreUsable: boolean;
  readonly diagnostics: readonly string[];
  readonly neverUserVisible: true;
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
 *
 * **Note (8.2F-15G):** The preferred provenance-backed path is
 * `evaluateExplanationWordingFromScoreReport({ draftId, scoreReport })` which
 * accepts a `WordingToneScoreReport`. The raw `toneMatrix` path here is
 * retained for backward compatibility but is unauthenticated — any caller
 * can supply arbitrary scores without provenance tracing.
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
