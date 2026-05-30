/**
 * OCR Uncertainty pure evaluator (Phase 8.2F-9 / 8.2F-15E provenance contract).
 *
 * Implements `evaluateOcrUncertainty` — a pure function that classifies OCR
 * degradation risk and determines whether the cognition pipeline may proceed.
 *
 * Safety guarantees:
 * - no OCR SDK imported
 * - no image processing
 * - no LLM calls
 * - no Smart Talk wiring
 * - no database writes
 * - no deadline calculation
 * - no legal conclusions
 * - no user-visible output
 * - all results carry neverUserVisible: true
 */

import type { ExplanationBoundary } from "../reality-simulation-types";
import type {
  OcrConfidenceLevel,
  OcrDegradationVector,
  OcrDiagnosticCode,
  OcrEvaluationResult,
  OcrPipelineDisposition,
  OcrQualityReport,
  OcrQualityReportValidationResult,
} from "./ocr-uncertainty-types";

export const OCR_UNCERTAINTY_EVALUATOR_VERSION =
  "8.2f-15e-ocr-uncertainty-evaluator-v2";

// ── Internal helpers ──────────────────────────────────────────────────────────

function pushDiag(arr: OcrDiagnosticCode[], code: OcrDiagnosticCode): void {
  if (!arr.includes(code)) arr.push(code);
}

function pushBoundary(
  arr: ExplanationBoundary[],
  boundary: ExplanationBoundary,
): void {
  if (!arr.includes(boundary)) arr.push(boundary);
}

// ── Main function ─────────────────────────────────────────────────────────────

/**
 * Evaluates OCR degradation risk from structural metadata and a caller-supplied
 * confidence score.
 *
 * Evaluation rules (applied in severity order):
 *  1. `baseConfidenceScore` clamped to [0, 100].
 *  2. Score < 40 → `hard_fail`, `unreadable`, proceedAllowed=false.
 *  3. `obscuredSender` → `hard_fail`, `critical_ambiguity`, proceedAllowed=false.
 *  4. `missingDates` | `unreadableAmounts` | `partialDocumentOnly` →
 *       `human_review_required`, `critical_ambiguity`, triggersHumanReview=true.
 *       Boundaries: `do_not_calculate_deadline` (missingDates), `require_uncertainty_wording`.
 *  5. `mixedLanesDetected` → at least `proceed_with_uncertainty`.
 *       Boundaries: `do_not_merge_lanes`, `require_uncertainty_wording`.
 *  6. `possiblePromptInjectionText` → at least `proceed_with_uncertainty`.
 *       Boundaries: `do_not_present_dry_run_as_fact`, `require_uncertainty_wording`.
 *  7. `lowResolution` | `truncatedText` → `ocr_graceful_degradation`, boundary
 *       `mention_uncertainty_if_ocr_noisy`; demotes `optimal` to `degraded_but_readable`.
 *  8. No issues, score >= 80 → `proceed`, `optimal`, `ocr_optimal`.
 *
 * Rules 4–7 do not hard-fail independently; they accumulate and the worst
 * disposition wins. Rules 2–3 short-circuit with an early return.
 *
 * Pure function — no side effects, no DB, no LLM, no OCR.
 */
export function evaluateOcrUncertainty({
  degradation,
  baseConfidenceScore,
}: {
  readonly degradation: OcrDegradationVector;
  readonly baseConfidenceScore: number;
}): OcrEvaluationResult {
  // ── Rule 1: Clamp score ───────────────────────────────────────────────────
  const score = Math.max(0, Math.min(100, baseConfidenceScore));

  // ── Rule 2: Hard fail — low score ─────────────────────────────────────────
  if (score < 40) {
    return {
      proceedAllowed: false,
      disposition: "hard_fail",
      confidence: "unreadable",
      diagnostics: ["ocr_hard_fail_unreadable"],
      triggersHumanReview: true,
      neverUserVisible: true,
      notes: [
        `baseConfidenceScore clamped to ${String(score)}; below hard-fail threshold (40). OCR output structurally untrustworthy.`,
        "No cognition pipeline step may proceed. Metadata review only: no OCR SDK, no LLM, no Smart Talk.",
      ],
    };
  }

  // ── Rule 3: Hard fail — obscured sender ───────────────────────────────────
  if (degradation.obscuredSender) {
    return {
      proceedAllowed: false,
      disposition: "hard_fail",
      confidence: "critical_ambiguity",
      diagnostics: ["ocr_sender_obscured"],
      triggersHumanReview: true,
      neverUserVisible: true,
      notes: [
        "Sender identity is obscured. Document authority cannot be established.",
        "No cognition pipeline step may proceed. Metadata review only: no OCR SDK, no LLM, no Smart Talk.",
      ],
    };
  }

  // ── Accumulate non-fatal issues ───────────────────────────────────────────

  const diagnostics: OcrDiagnosticCode[] = [];
  const boundaries: ExplanationBoundary[] = [];
  const reviewFlags: string[] = [];
  const notes: string[] = [];

  let disposition: OcrPipelineDisposition = "proceed";
  let confidence: OcrConfidenceLevel = score >= 80 ? "optimal" : "degraded_but_readable";
  let humanReviewRequired = false;

  // ── Rule 4a: Missing dates ────────────────────────────────────────────────
  if (degradation.missingDates) {
    pushDiag(diagnostics, "ocr_missing_dates");
    pushDiag(diagnostics, "ocr_critical_ambiguity");
    pushBoundary(boundaries, "do_not_calculate_deadline");
    pushBoundary(boundaries, "require_uncertainty_wording");
    humanReviewRequired = true;
    confidence = "critical_ambiguity";
    notes.push("Missing dates: deadline calculation must not proceed.");
  }

  // ── Rule 4b: Unreadable amounts ───────────────────────────────────────────
  if (degradation.unreadableAmounts) {
    pushDiag(diagnostics, "ocr_unreadable_amounts");
    pushDiag(diagnostics, "ocr_critical_ambiguity");
    pushBoundary(boundaries, "require_uncertainty_wording");
    humanReviewRequired = true;
    confidence = "critical_ambiguity";
    notes.push("Unreadable amounts: monetary fields cannot be trusted.");
  }

  // ── Rule 4c: Partial document only ────────────────────────────────────────
  if (degradation.partialDocumentOnly) {
    pushDiag(diagnostics, "ocr_partial_document");
    pushDiag(diagnostics, "ocr_critical_ambiguity");
    pushBoundary(boundaries, "require_uncertainty_wording");
    humanReviewRequired = true;
    confidence = "critical_ambiguity";
    notes.push("Partial document only: complete document context unavailable.");
  }

  if (humanReviewRequired) {
    pushDiag(diagnostics, "ocr_human_review_required");
    pushBoundary(boundaries, "recommend_human_review_high_risk");
    disposition = "human_review_required";
  }

  // ── Rule 5: Mixed lanes ───────────────────────────────────────────────────
  if (degradation.mixedLanesDetected) {
    pushDiag(diagnostics, "ocr_mixed_lanes");
    pushBoundary(boundaries, "do_not_merge_lanes");
    pushBoundary(boundaries, "require_uncertainty_wording");
    // Upgrade proceed → proceed_with_uncertainty; do not downgrade human_review_required.
    if (disposition === "proceed") {
      disposition = "proceed_with_uncertainty";
      if (confidence === "optimal") confidence = "degraded_but_readable";
    }
    notes.push("Mixed lanes detected: document types must not be merged.");
  }

  // ── Rule 6: Possible prompt injection text ────────────────────────────────
  if (degradation.possiblePromptInjectionText) {
    pushDiag(diagnostics, "ocr_prompt_injection_like_text");
    pushBoundary(boundaries, "do_not_present_dry_run_as_fact");
    pushBoundary(boundaries, "require_uncertainty_wording");
    reviewFlags.push("possible_prompt_injection_text_detected");
    // Upgrade proceed → proceed_with_uncertainty; do not downgrade higher dispositions.
    if (disposition === "proceed") {
      disposition = "proceed_with_uncertainty";
      if (confidence === "optimal") confidence = "degraded_but_readable";
    }
    notes.push(
      "Possible prompt injection pattern detected. dry-run output must not be presented as fact.",
    );
  }

  // ── Rule 7: Low resolution / truncated text ───────────────────────────────
  if (degradation.lowResolution || degradation.truncatedText) {
    pushDiag(diagnostics, "ocr_graceful_degradation");
    pushBoundary(boundaries, "mention_uncertainty_if_ocr_noisy");
    if (confidence === "optimal") confidence = "degraded_but_readable";
    if (degradation.lowResolution) {
      notes.push("Low resolution flagged: OCR field coverage may be incomplete.");
    }
    if (degradation.truncatedText) {
      notes.push("Truncated text detected: document may be missing trailing content.");
    }
  }

  // ── Rule 8: Clean optimal ─────────────────────────────────────────────────
  if (disposition === "proceed" && confidence === "optimal") {
    pushDiag(diagnostics, "ocr_optimal");
    notes.push(
      `Score ${String(score)}: OCR input is structurally clean. Pipeline may proceed.`,
    );
  }

  return {
    proceedAllowed: true,
    disposition,
    confidence,
    diagnostics,
    triggersHumanReview: humanReviewRequired,
    ...(boundaries.length > 0 ? { recommendedBoundaries: boundaries } : {}),
    ...(reviewFlags.length > 0 ? { recommendedReviewFlags: reviewFlags } : {}),
    neverUserVisible: true,
    ...(notes.length > 0 ? { notes } : {}),
  };
}

// ── Phase 8.2F-15E: provenance-backed entrypoint ──────────────────────────────

/**
 * Validates a structured `OcrQualityReport` at the governance ingress.
 *
 * Checks only structural integrity — no OCR processing, no image analysis.
 * Returns `valid: false` if the report is missing required fields or the
 * confidence score cannot be clamped to [0, 100].
 *
 * Pure function — no side effects, no DB, no LLM, no OCR.
 */
export function validateOcrQualityReport(
  report: OcrQualityReport,
): OcrQualityReportValidationResult {
  const diagnostics: string[] = [];

  if (!report.reportId || report.reportId.trim() === "") {
    diagnostics.push("reportId is empty or blank.");
  }
  if (!report.generatedBy || report.generatedBy.trim() === "") {
    diagnostics.push("generatedBy is empty or blank.");
  }

  const clamped = Math.max(0, Math.min(100, report.confidenceScore));
  const scoreInRange = report.confidenceScore >= 0 && report.confidenceScore <= 100;
  if (!scoreInRange) {
    diagnostics.push(
      `confidenceScore ${String(report.confidenceScore)} is outside [0, 100]; will be clamped to ${String(clamped)}.`,
    );
  }

  if (report.attestationStatus === "unattested") {
    diagnostics.push(
      "attestationStatus is 'unattested': confidence score provenance is unverified. " +
        "Downstream consumers should treat this report as caller-supplied metadata.",
    );
  }

  const valid = diagnostics.filter((d) => !d.includes("clamped") && !d.includes("unattested")).length === 0;

  return {
    valid,
    confidenceScoreUsable: true,
    diagnostics,
    neverUserVisible: true,
  };
}

/**
 * Evaluates OCR degradation risk from a structured `OcrQualityReport` and a
 * degradation vector, using the same rules as `evaluateOcrUncertainty`.
 *
 * The quality report provides a typed, provenance-backed confidence score
 * instead of a raw `baseConfidenceScore: number`. This is the preferred
 * entrypoint once callers can produce a structured report.
 *
 * If `qualityReport.attestationStatus === "unattested"`, the evaluation
 * proceeds normally but a governance note is appended to the result to
 * record that the confidence provenance is unverified. This does NOT change
 * the disposition — unattested confidence does not by itself hard-fail.
 *
 * Confidence score is clamped to [0, 100] as in `evaluateOcrUncertainty`.
 *
 * Pure function — no side effects, no DB, no LLM, no OCR SDK.
 */
export function evaluateOcrUncertaintyFromQualityReport({
  degradation,
  qualityReport,
}: {
  readonly degradation: OcrDegradationVector;
  readonly qualityReport: OcrQualityReport;
}): OcrEvaluationResult {
  const baseResult = evaluateOcrUncertainty({
    degradation,
    baseConfidenceScore: qualityReport.confidenceScore,
  });

  if (qualityReport.attestationStatus === "unattested") {
    const attestationNote =
      `OcrQualityReport "${qualityReport.reportId}" has attestationStatus="unattested": ` +
      "confidence score provenance is unverified (caller-supplied metadata). " +
      "Governance result preserved; no disposition change from attestation status alone.";

    return {
      ...baseResult,
      notes: [...(baseResult.notes ?? []), attestationNote],
    };
  }

  return baseResult;
}
