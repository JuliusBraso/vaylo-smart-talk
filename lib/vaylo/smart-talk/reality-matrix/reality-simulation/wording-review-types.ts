/**
 * Internal Human Wording Review types (Phase 8.2F-8).
 *
 * Metadata-only human review layer. No prose generation, no live user content,
 * no Smart Talk wiring, no LLM calls, no OCR, no database writes, no reviewer
 * account logic, no approval of production output.
 *
 * Safety guarantees:
 * - no mapper function in this file
 * - no explanation text generated
 * - no Smart Talk wiring
 * - no OCR access
 * - no LLM calls
 * - no deadline calculation
 * - no legal conclusions
 * - no user-visible output
 */

import type { RuntimeExplanationSectionType } from "./explanation-mapper-types";

// ── Verdict and diagnostic codes ──────────────────────────────────────────────

/**
 * The outcome of a human wording reviewer's assessment of a structured draft.
 *
 * - `approved`: reviewer attests all sections, forbidden moves, required
 *   constraints, and blocked reason codes have been inspected and pass.
 * - `needs_revision`: reviewer identified issues requiring structural or
 *   wording changes before the draft may proceed.
 * - `rejected_with_escalation`: reviewer identified issues requiring escalation
 *   before the pilot path may continue.
 * - `hard_fail_governance_breach`: either the reviewer attempted to force-approve
 *   a draft with compliance gaps, or unsafe certainty / panic tone was detected.
 *   This verdict is applied by `verifyHumanReviewCompliance` and supersedes any
 *   reviewer-supplied verdict.
 */
export type WordingReviewVerdict =
  | "approved"
  | "needs_revision"
  | "rejected_with_escalation"
  | "hard_fail_governance_breach";

/**
 * Typed diagnostic codes emitted by `verifyHumanReviewCompliance`.
 * All diagnostics are never-user-visible governance signals.
 */
export type WordingReviewDiagnosticCode =
  | "review_integrity_failure"
  | "review_missing_section_assessment"
  | "review_unacknowledged_blocked_reason"
  | "review_unreviewed_forbidden_move"
  | "review_unreviewed_required_constraint"
  | "review_detected_move_leakage"
  | "review_detected_unsafe_certainty"
  | "review_detected_panic_tone";

// ── Section-level assessment ──────────────────────────────────────────────────

/**
 * A human reviewer's per-section assessment of a structured explanation draft.
 *
 * `humanReviewed` indicates the reviewer inspected this section.
 * `humanApproved` indicates the reviewer judged the section safe to proceed.
 * `acknowledgedBlockedReasonCodes` records which blockedReasonCodes the
 * reviewer explicitly inspected and accepted as correct governance suppressions.
 * `detectedMoveLeakage` records forbidden-move tokens the reviewer observed
 * leaking despite suppression.
 * `detectedUnsafeCertainty` flags reviewer-observed false certainty.
 * `detectedPanicTone` flags reviewer-observed panic amplification.
 */
export interface SectionWordingAssessment {
  readonly sectionType: RuntimeExplanationSectionType;
  readonly humanReviewed: boolean;
  readonly humanApproved: boolean;
  readonly acknowledgedBlockedReasonCodes?: readonly string[];
  readonly detectedMoveLeakage?: readonly string[];
  readonly detectedUnsafeCertainty?: boolean;
  readonly detectedPanicTone?: boolean;
  readonly notes?: readonly string[];
}

// ── Snapshot and diagnostic ───────────────────────────────────────────────────

/**
 * A never-user-visible governance diagnostic emitted during wording review
 * compliance verification.
 */
export interface WordingReviewDiagnostic {
  readonly code: WordingReviewDiagnosticCode;
  readonly detail: string;
  readonly neverUserVisible: true;
}

/**
 * A complete snapshot of one human reviewer's inspection of a
 * `RuntimeExplanationDraft`. This is metadata only — it describes what
 * the reviewer examined, not the actual wording.
 *
 * `reviewId` is a caller-supplied identifier for audit tracing.
 * `timestamp` is an ISO 8601 string. No Date objects.
 * `reviewerId` is an opaque string placeholder — no real identity logic.
 * `reviewedForbiddenMoves` lists which applied forbidden moves the reviewer
 *   confirmed were inspected (as normal governance constraints, not failures).
 * `reviewedRequiredConstraints` lists which applied required constraints the
 *   reviewer confirmed were inspected.
 */
export interface WordingReviewSnapshot {
  readonly reviewId: string;
  readonly timestamp: string;
  readonly reviewerId: string;
  readonly verdict: WordingReviewVerdict;
  readonly sectionAssessments: readonly SectionWordingAssessment[];
  readonly reviewedForbiddenMoves: readonly string[];
  readonly reviewedRequiredConstraints: readonly string[];
  readonly neverUserVisible: true;
}

// ── Compliance result ─────────────────────────────────────────────────────────

/**
 * The output of `verifyHumanReviewCompliance`. Describes whether the review
 * snapshot covers all governance requirements surfaced by the draft.
 *
 * `compliant`: true only if all sections are assessed, all forbidden moves and
 *   required constraints reviewed, all blocked reason codes acknowledged, and
 *   no safety issues detected.
 * `governanceCompromised`: true if the reviewer attempted to force-approve
 *   a draft with compliance gaps, or if unsafe certainty or panic tone was
 *   detected regardless of reviewer verdict.
 * `effectiveVerdict`: the reviewer's verdict, except when `governanceCompromised`
 *   is true, in which case this is always `"hard_fail_governance_breach"`.
 */
export interface WordingReviewComplianceResult {
  readonly compliant: boolean;
  readonly governanceCompromised: boolean;
  readonly effectiveVerdict: WordingReviewVerdict;
  readonly diagnostics: readonly WordingReviewDiagnostic[];
  readonly missingSectionAssessments: readonly RuntimeExplanationSectionType[];
  readonly unacknowledgedBlockedSections: readonly RuntimeExplanationSectionType[];
  readonly unreviewedForbiddenMoves: readonly string[];
  readonly unreviewedRequiredConstraints: readonly string[];
  readonly notes: readonly string[];
  readonly neverUserVisible: true;
}
