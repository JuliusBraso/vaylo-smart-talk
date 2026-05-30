/**
 * Runtime Explanation Wording Evaluation scaffold
 * (Phase 8.2F-12 / 8.2F-15G wording score provenance contract).
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
  WordingToneScoreReport,
  WordingToneScoreReportValidationResult,
  WordingViolationCode,
} from "./wording-evaluation-types";

export const WORDING_EVALUATION_SCAFFOLD_VERSION =
  "8.2f-15g-wording-evaluation-scaffold-v2";

// ── Score report validation (Phase 8.2F-15G) ─────────────────────────────────

/** The tone matrix keys, kept stable for validation iteration. */
const TONE_MATRIX_KEYS: readonly (keyof WordingToneMatrix)[] = [
  "authoritativeLegalAdvice",
  "falseReassurance",
  "panicInducing",
  "manipulative",
  "confusingAmbiguity",
  "empatheticClarity",
];

/**
 * A zero `WordingToneMatrix` used as the `clampedToneMatrix` fallback when
 * score report validation fails and no meaningful clamping is possible.
 */
const ZERO_TONE_MATRIX: WordingToneMatrix = {
  authoritativeLegalAdvice: 0,
  falseReassurance: 0,
  panicInducing: 0,
  manipulative: 0,
  confusingAmbiguity: 0,
  empatheticClarity: 0,
};

/**
 * Validates a structured `WordingToneScoreReport` at the governance ingress.
 *
 * Checks only structural integrity — no LLM calls, no NLP, no text evaluation.
 * Returns `valid: false` when required IDs are blank or matrix values are
 * non-finite. Out-of-range (but finite) values are noted as `wording_score_clamped`
 * and do not fail validation. Unattested reports are structurally valid but
 * emit `wording_score_report_unattested`.
 *
 * Pure function — no side effects, no DB, no LLM, no NLP.
 */
export function validateWordingToneScoreReport(
  report: WordingToneScoreReport,
): WordingToneScoreReportValidationResult {
  const diagnostics: string[] = [];

  if (!report.reportId || report.reportId.trim() === "") {
    diagnostics.push("wording_score_report_invalid: reportId is empty or blank.");
  }
  if (!report.evaluatorId || report.evaluatorId.trim() === "") {
    diagnostics.push("wording_score_report_invalid: evaluatorId is empty or blank.");
  }
  if (!report.evaluatorVersion || report.evaluatorVersion.trim() === "") {
    diagnostics.push("wording_score_report_invalid: evaluatorVersion is empty or blank.");
  }
  if (!report.generatedBy || report.generatedBy.trim() === "") {
    diagnostics.push("wording_score_report_invalid: generatedBy is empty or blank.");
  }

  let hasNonFinite = false;
  let hasOutOfRange = false;

  for (const key of TONE_MATRIX_KEYS) {
    const val = report.toneMatrix[key];
    if (!Number.isFinite(val)) {
      hasNonFinite = true;
      diagnostics.push(
        `wording_score_report_invalid: toneMatrix.${key}=${String(val)} is not finite.`,
      );
    } else if (val < 0 || val > 100) {
      hasOutOfRange = true;
    }
  }

  if (hasOutOfRange && !hasNonFinite) {
    diagnostics.push(
      "wording_score_clamped: one or more toneMatrix values are outside [0, 100] " +
        "and will be clamped by the evaluator before scoring.",
    );
  }

  if (report.attestationStatus === "unattested") {
    diagnostics.push(
      "wording_score_report_unattested: attestationStatus is 'unattested'; " +
        "score provenance is unverified. Downstream consumers should treat " +
        "this report as caller-supplied metadata.",
    );
  }

  const structuralErrors = diagnostics.filter((d) =>
    d.startsWith("wording_score_report_invalid"),
  );

  return {
    valid: structuralErrors.length === 0 && !hasNonFinite,
    scoreUsable: !hasNonFinite,
    diagnostics,
    neverUserVisible: true,
  };
}

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

// ── Provenance-backed entry point (Phase 8.2F-15G) ────────────────────────────

/**
 * Evaluates wording risk scores from a structured `WordingToneScoreReport`.
 *
 * Preferred over `evaluateExplanationWordingScaffold` for new callers: binds
 * score evaluation to a typed provenance contract (source kind, attestation
 * status, evaluator identity) rather than trusting bare caller-supplied numbers.
 *
 * Behavior:
 * - Validates the report structurally (`validateWordingToneScoreReport`).
 * - If `!scoreUsable` (non-finite matrix values): returns `human_review_required`
 *   with notes; does not call the core evaluator.
 * - If `scoreUsable`: delegates to `evaluateExplanationWordingScaffold` with the
 *   report's `toneMatrix`. All evaluation rules and dispositions are unchanged.
 * - If `attestationStatus === "unattested"`: appends an informational governance
 *   note to the result; does NOT alter the disposition.
 *
 * Pure function — no side effects, no DB, no LLM, no NLP, no Smart Talk.
 */
export function evaluateExplanationWordingFromScoreReport({
  draftId,
  scoreReport,
}: {
  readonly draftId: string;
  readonly scoreReport: WordingToneScoreReport;
}): WordingEvaluationResult {
  const validation = validateWordingToneScoreReport(scoreReport);

  if (!validation.scoreUsable) {
    return {
      disposition: "human_review_required",
      violations: [],
      isSafeForUser: false,
      clampedToneMatrix: ZERO_TONE_MATRIX,
      neverUserVisible: true,
      notes: [
        `WordingToneScoreReport "${scoreReport.reportId}" failed structural validation ` +
          `(evaluatorId="${scoreReport.evaluatorId}"): ` +
          validation.diagnostics.join("; "),
        "Score matrix is unusable. Human review required before any wording proceeds.",
      ],
    };
  }

  const baseResult = evaluateExplanationWordingScaffold({
    draftId,
    toneMatrix: scoreReport.toneMatrix,
    // sourceKind not forwarded — the scoreReport carries all provenance information.
  });

  if (scoreReport.attestationStatus === "unattested") {
    return {
      ...baseResult,
      notes: [
        ...(baseResult.notes ?? []),
        `wording_score_report_unattested: attestationStatus for report ` +
          `"${scoreReport.reportId}" is 'unattested'. Score provenance is unverified; ` +
          "evaluation proceeds under provenance gap recorded for governance audit.",
      ],
    };
  }

  return baseResult;
}
