/**
 * OCR Uncertainty Metadata types (Phase 8.2F-9).
 *
 * Metadata-only governance types for evaluating OCR degradation risk.
 * No OCR SDK imported. No image processing. No LLM calls. No Smart Talk runtime.
 *
 * Safety guarantees:
 * - no OCR SDK or library imported here
 * - no image processing
 * - no LLM calls
 * - no Smart Talk wiring
 * - no deadline calculation
 * - no legal conclusions
 * - no user-visible output
 * - all result types carry neverUserVisible: true
 */

import type { ExplanationBoundary } from "../reality-simulation-types";

// ── Core enums ────────────────────────────────────────────────────────────────

/**
 * Structural confidence classification for OCR-derived input.
 *
 * - `optimal`: OCR output is clean and high-confidence; cognition pipeline may proceed.
 * - `degraded_but_readable`: OCR output has minor quality issues but core content is intact.
 * - `critical_ambiguity`: Key fields (dates, amounts, sender) are absent or unreadable;
 *   human review is required before cognition proceeds.
 * - `unreadable`: OCR output is too degraded for any pipeline trust; hard fail required.
 */
export type OcrConfidenceLevel =
  | "optimal"
  | "degraded_but_readable"
  | "critical_ambiguity"
  | "unreadable";

/**
 * The structural routing decision for this OCR input in the cognition pipeline.
 *
 * - `proceed`: Input is trusted; pipeline may continue without restriction.
 * - `proceed_with_uncertainty`: Input proceeds but uncertainty boundaries must apply.
 * - `human_review_required`: Pipeline may not produce output until a human reviews.
 * - `hard_fail`: Pipeline must not proceed at all; input is structurally untrustworthy.
 */
export type OcrPipelineDisposition =
  | "proceed"
  | "proceed_with_uncertainty"
  | "human_review_required"
  | "hard_fail";

// ── Degradation vector ────────────────────────────────────────────────────────

/**
 * Structural description of OCR degradation conditions observed by the upstream
 * quality-check layer. Each flag is set by metadata inspection, never by live
 * OCR or image processing in this harness.
 *
 * - `missingDates`: Date fields absent or illegible.
 * - `obscuredSender`: Sender / Absender identity unreadable or missing.
 * - `unreadableAmounts`: Monetary amounts absent or ambiguous.
 * - `lowResolution`: Image resolution flagged as below threshold.
 * - `truncatedText`: Document text visibly cut off.
 * - `mixedLanesDetected`: Multiple document types may be present in one scan.
 * - `possiblePromptInjectionText`: Text patterns resembling prompt injection observed.
 * - `partialDocumentOnly`: Only a fragment of the full document is present.
 */
export interface OcrDegradationVector {
  readonly missingDates: boolean;
  readonly obscuredSender: boolean;
  readonly unreadableAmounts: boolean;
  readonly lowResolution: boolean;
  readonly truncatedText: boolean;
  readonly mixedLanesDetected: boolean;
  readonly possiblePromptInjectionText: boolean;
  readonly partialDocumentOnly: boolean;
}

// ── Diagnostic codes ──────────────────────────────────────────────────────────

/**
 * Never-user-visible governance diagnostic codes emitted by `evaluateOcrUncertainty`.
 *
 * - `ocr_optimal`: Input is clean; pipeline may proceed.
 * - `ocr_graceful_degradation`: Minor quality issues detected; proceed cautiously.
 * - `ocr_critical_ambiguity`: Critical fields are ambiguous; human review required.
 * - `ocr_human_review_required`: Human inspection needed before cognition proceeds.
 * - `ocr_hard_fail_unreadable`: Confidence score below threshold; hard fail.
 * - `ocr_sender_obscured`: Sender identity unreadable; hard fail.
 * - `ocr_missing_dates`: Date fields absent or illegible.
 * - `ocr_unreadable_amounts`: Amount fields absent or ambiguous.
 * - `ocr_partial_document`: Document appears incomplete.
 * - `ocr_mixed_lanes`: Multiple document types detected in single scan.
 * - `ocr_prompt_injection_like_text`: Possible prompt injection pattern observed.
 */
export type OcrDiagnosticCode =
  | "ocr_optimal"
  | "ocr_graceful_degradation"
  | "ocr_critical_ambiguity"
  | "ocr_human_review_required"
  | "ocr_hard_fail_unreadable"
  | "ocr_sender_obscured"
  | "ocr_missing_dates"
  | "ocr_unreadable_amounts"
  | "ocr_partial_document"
  | "ocr_mixed_lanes"
  | "ocr_prompt_injection_like_text";

// ── Evaluation result ─────────────────────────────────────────────────────────

/**
 * The never-user-visible output of `evaluateOcrUncertainty`.
 *
 * `proceedAllowed`: whether the cognition pipeline may proceed at all.
 * `disposition`: structural routing decision for this input.
 * `confidence`: structural quality classification of the OCR output.
 * `diagnostics`: ordered list of governance diagnostic codes emitted.
 * `triggersHumanReview`: whether a human reviewer must inspect before output.
 * `recommendedBoundaries`: `ExplanationBoundary` tokens the cognition pipeline
 *   should apply when proceeding (never user-visible governance signals only).
 * `recommendedReviewFlags`: opaque governance audit strings for review tooling.
 * `neverUserVisible`: compile-time invariant — this result must never reach UI.
 * `notes`: internal governance notes; never user-visible.
 */
export interface OcrEvaluationResult {
  readonly proceedAllowed: boolean;
  readonly disposition: OcrPipelineDisposition;
  readonly confidence: OcrConfidenceLevel;
  readonly diagnostics: readonly OcrDiagnosticCode[];
  readonly triggersHumanReview: boolean;
  readonly recommendedBoundaries?: readonly ExplanationBoundary[];
  readonly recommendedReviewFlags?: readonly string[];
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}
