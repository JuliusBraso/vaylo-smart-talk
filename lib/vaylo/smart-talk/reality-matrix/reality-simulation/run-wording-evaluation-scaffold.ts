/**
 * Runtime Explanation Wording Evaluation scaffold (Phase 8.2F-12).
 *
 * Implements `evaluateExplanationWordingScaffold` — a pure deterministic
 * function that evaluates wording-risk metadata scores against governance
 * thresholds without any live text analysis, NLP, or LLM calls.
 *
 * Evaluation rules (applied in order of severity):
 *  1. All `WordingToneMatrix` values are clamped to [0, 100].
 *  2. Zero-tolerance hard fails (any value > 0):
 *       - authoritativeLegalAdvice  → tone_authoritative_advice_detected
 *       - falseReassurance          → tone_false_reassurance_detected
 *       - manipulative              → tone_manipulative_detected
 *  3. Panic guard: panicInducing > 30 → tone_panic_inducing_detected (hard fail).
 *  4. Ambiguity guard: confusingAmbiguity > 40 → tone_highly_ambiguous
 *       (human_review_required if no hard fail).
 *  5. Clarity check: if no violations AND empatheticClarity >= 50 → approved.
 *  6. Fallback: no hard violations but empatheticClarity < 50
 *       → human_review_required + tone_insufficient_clarity.
 *
 * Hard-fail violations override all other dispositions.
 * `isSafeForUser` is `true` only when `disposition === "approved"`.
 *
 * Safety guarantees:
 * - no real text evaluated
 * - no NLP or LLM calls
 * - no prose generated
 * - no Smart Talk wiring
 * - no database writes
 * - no user-visible output
 * - all results carry neverUserVisible: true
 */

import type {
  WordingEvaluationDisposition,
  WordingEvaluationInput,
  WordingEvaluationResult,
  WordingToneMatrix,
  WordingViolationCode,
} from "./wording-evaluation-types";

export const WORDING_EVALUATION_SCAFFOLD_VERSION =
  "8.2f-12-wording-evaluation-scaffold-v1";

// ── Score clamping ────────────────────────────────────────────────────────────

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function clampMatrix(matrix: WordingToneMatrix): WordingToneMatrix {
  return {
    authoritativeLegalAdvice: clampScore(matrix.authoritativeLegalAdvice),
    falseReassurance: clampScore(matrix.falseReassurance),
    panicInducing: clampScore(matrix.panicInducing),
    manipulative: clampScore(matrix.manipulative),
    confusingAmbiguity: clampScore(matrix.confusingAmbiguity),
    empatheticClarity: clampScore(matrix.empatheticClarity),
  };
}

// ── Main evaluator ────────────────────────────────────────────────────────────

/**
 * Evaluates caller-supplied wording-risk metadata scores against governance
 * thresholds. Returns a never-user-visible `WordingEvaluationResult`.
 *
 * Pure function — no side effects, no DB, no NLP, no LLM, no Smart Talk.
 */
export function evaluateExplanationWordingScaffold(
  input: WordingEvaluationInput,
): WordingEvaluationResult {
  // ── Rule 1: Clamp all scores to [0, 100] ──────────────────────────────────
  const clamped = clampMatrix(input.toneMatrix);
  const violations: WordingViolationCode[] = [];
  const notes: string[] = [];

  // ── Rule 2: Zero-tolerance hard fails ────────────────────────────────────
  // Any non-zero value in these dimensions is a structural governance failure.
  if (clamped.authoritativeLegalAdvice > 0) {
    violations.push("tone_authoritative_advice_detected");
    notes.push(
      `authoritativeLegalAdvice=${String(clamped.authoritativeLegalAdvice)}: ` +
        "zero-tolerance — any authoritative legal-advice tone is a hard fail.",
    );
  }
  if (clamped.falseReassurance > 0) {
    violations.push("tone_false_reassurance_detected");
    notes.push(
      `falseReassurance=${String(clamped.falseReassurance)}: ` +
        "zero-tolerance — false reassurance is a hard fail.",
    );
  }
  if (clamped.manipulative > 0) {
    violations.push("tone_manipulative_detected");
    notes.push(
      `manipulative=${String(clamped.manipulative)}: ` +
        "zero-tolerance — manipulative framing is a hard fail.",
    );
  }

  // ── Rule 3: Panic guard ───────────────────────────────────────────────────
  if (clamped.panicInducing > 30) {
    violations.push("tone_panic_inducing_detected");
    notes.push(
      `panicInducing=${String(clamped.panicInducing)} exceeds threshold (30): hard fail.`,
    );
  }

  // ── Determine if any hard-fail violations exist ───────────────────────────
  const hardFailViolations: readonly WordingViolationCode[] = [
    "tone_authoritative_advice_detected",
    "tone_false_reassurance_detected",
    "tone_manipulative_detected",
    "tone_panic_inducing_detected",
  ];
  const hasHardFail = violations.some((v) => hardFailViolations.includes(v));

  if (hasHardFail) {
    notes.push(
      "Hard-fail disposition. Wording metadata must not proceed to user output.",
    );
    return {
      disposition: "hard_fail_tone_violation",
      violations,
      isSafeForUser: false,
      clampedToneMatrix: clamped,
      neverUserVisible: true,
      notes,
    };
  }

  // ── Rule 4: Ambiguity guard ───────────────────────────────────────────────
  if (clamped.confusingAmbiguity > 40) {
    violations.push("tone_highly_ambiguous");
    notes.push(
      `confusingAmbiguity=${String(clamped.confusingAmbiguity)} exceeds threshold (40): ` +
        "human review required.",
    );
  }

  // ── Rule 5: Success path ──────────────────────────────────────────────────
  if (violations.length === 0 && clamped.empatheticClarity >= 50) {
    notes.push(
      `empatheticClarity=${String(clamped.empatheticClarity)}: sufficient. ` +
        "No violations detected. Approved.",
    );
    return {
      disposition: "approved",
      violations: [],
      isSafeForUser: true,
      clampedToneMatrix: clamped,
      neverUserVisible: true,
      notes,
    };
  }

  // ── Rule 6: Fallback — insufficient clarity or residual ambiguity ──────────
  if (violations.length === 0 && clamped.empatheticClarity < 50) {
    violations.push("tone_insufficient_clarity");
    notes.push(
      `empatheticClarity=${String(clamped.empatheticClarity)} below threshold (50): ` +
        "human review required for clarity.",
    );
  }

  const disposition: WordingEvaluationDisposition = "human_review_required";
  notes.push("Human review required before any wording proceeds to user output.");

  return {
    disposition,
    violations,
    isSafeForUser: false,
    clampedToneMatrix: clamped,
    neverUserVisible: true,
    notes,
  };
}
