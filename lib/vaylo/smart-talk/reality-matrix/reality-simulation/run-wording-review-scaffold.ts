/**
 * Internal Human Wording Review scaffold (Phase 8.2F-8).
 *
 * Implements `verifyHumanReviewCompliance` — a pure function that checks
 * whether a `WordingReviewSnapshot` properly covers the governance requirements
 * surfaced by a `RuntimeExplanationDraft`.
 *
 * Safety guarantees:
 * - no prose generation
 * - no real wording reviewed or generated
 * - no Smart Talk wiring
 * - no OCR access
 * - no LLM calls
 * - no database writes
 * - no reviewer identity logic
 * - no deadline calculation
 * - no legal conclusions
 * - no user-visible output
 * - neverUserVisible: true on all results and diagnostics
 */

import type {
  RuntimeExplanationDraft,
  RuntimeExplanationSectionType,
} from "./explanation-mapper-types";
import type {
  SectionWordingAssessment,
  WordingReviewComplianceResult,
  WordingReviewDiagnostic,
  WordingReviewDiagnosticCode,
  WordingReviewSnapshot,
  WordingReviewVerdict,
} from "./wording-review-types";

export const WORDING_REVIEW_SCAFFOLD_VERSION =
  "8.2f-8-wording-review-scaffold-v1";

// ── Diagnostic factory ────────────────────────────────────────────────────────

function makeDiag(
  code: WordingReviewDiagnosticCode,
  detail: string,
): WordingReviewDiagnostic {
  return { code, detail, neverUserVisible: true };
}

// ── Main function ─────────────────────────────────────────────────────────────

/**
 * Verifies that a human wording review snapshot properly covers all governance
 * requirements derived from a structured explanation draft.
 *
 * Compliance rules enforced:
 *  1. Every section draft has a corresponding SectionWordingAssessment.
 *  2. Every applied forbidden move is listed in reviewedForbiddenMoves.
 *     (Forbidden moves are normal governance constraints — failure is unreviewed
 *     or ignored moves, not the presence of the move itself.)
 *  3. Every applied required constraint is listed in reviewedRequiredConstraints.
 *  4. Every blockedReasonCode on a section is acknowledged by the reviewer.
 *  5. Reviewer-detected move leakage is flagged as a compliance gap.
 *  6. Reviewer-detected unsafe certainty triggers a governance compromise.
 *  7. Reviewer-detected panic tone triggers a governance compromise.
 *  8. Reviewer verdict "approved" with any compliance gap is a governance
 *     override attempt — governanceCompromised is set true and effectiveVerdict
 *     is overridden to "hard_fail_governance_breach".
 *
 * Does not throw. All violations are returned as typed diagnostics.
 * Pure function — no side effects, no DB, no LLM, no OCR.
 */
export function verifyHumanReviewCompliance({
  draft,
  review,
}: {
  readonly draft: RuntimeExplanationDraft;
  readonly review: WordingReviewSnapshot;
}): WordingReviewComplianceResult {
  const diagnostics: WordingReviewDiagnostic[] = [];

  // ── Check 1: Every section draft has a corresponding assessment ───────────

  const assessmentBySectionType = new Map<
    RuntimeExplanationSectionType,
    SectionWordingAssessment
  >();
  for (const a of review.sectionAssessments) {
    assessmentBySectionType.set(a.sectionType, a);
  }

  const missingSectionAssessments: RuntimeExplanationSectionType[] = [];
  for (const section of draft.sectionDrafts) {
    if (!assessmentBySectionType.has(section.sectionType)) {
      missingSectionAssessments.push(section.sectionType);
      diagnostics.push(
        makeDiag(
          "review_missing_section_assessment",
          `Section "${section.sectionType}" has no corresponding SectionWordingAssessment in the review snapshot.`,
        ),
      );
    }
  }

  // ── Check 2: Every applied forbidden move is reviewed ────────────────────
  // Forbidden moves are normal governance constraints. Failure is when they
  // are unreviewed — not their presence.

  const reviewedMoveSet = new Set(review.reviewedForbiddenMoves);
  const unreviewedForbiddenMoves: string[] = [];
  for (const move of draft.appliedForbiddenMoves) {
    if (!reviewedMoveSet.has(move)) {
      unreviewedForbiddenMoves.push(move);
      diagnostics.push(
        makeDiag(
          "review_unreviewed_forbidden_move",
          `Applied forbidden move "${move}" was not listed in review.reviewedForbiddenMoves. Forbidden moves must be reviewed, not treated as automatic failures.`,
        ),
      );
    }
  }

  // ── Check 3: Every applied required constraint is reviewed ───────────────

  const reviewedConstraintSet = new Set(review.reviewedRequiredConstraints);
  const unreviewedRequiredConstraints: string[] = [];
  for (const constraint of draft.appliedRequiredConstraints) {
    if (!reviewedConstraintSet.has(constraint)) {
      unreviewedRequiredConstraints.push(constraint);
      diagnostics.push(
        makeDiag(
          "review_unreviewed_required_constraint",
          `Applied required constraint "${constraint}" was not listed in review.reviewedRequiredConstraints.`,
        ),
      );
    }
  }

  // ── Check 4: Blocked reason codes acknowledged ───────────────────────────

  const unacknowledgedBlockedSections: RuntimeExplanationSectionType[] = [];
  for (const section of draft.sectionDrafts) {
    if (!section.blockedReasonCodes || section.blockedReasonCodes.length === 0) {
      continue;
    }
    const assessment = assessmentBySectionType.get(section.sectionType);
    if (!assessment) {
      // Already flagged as missing — skip.
      continue;
    }
    const acknowledged = new Set(assessment.acknowledgedBlockedReasonCodes ?? []);
    const unacknowledged = section.blockedReasonCodes.filter(
      (code) => !acknowledged.has(code),
    );
    if (unacknowledged.length > 0) {
      unacknowledgedBlockedSections.push(section.sectionType);
      diagnostics.push(
        makeDiag(
          "review_unacknowledged_blocked_reason",
          `Section "${section.sectionType}" has blocked reason codes [${unacknowledged.join(", ")}] not acknowledged in acknowledgedBlockedReasonCodes.`,
        ),
      );
    }
  }

  // ── Check 5: Detected move leakage ───────────────────────────────────────

  let hasLeakage = false;
  for (const assessment of review.sectionAssessments) {
    if ((assessment.detectedMoveLeakage?.length ?? 0) > 0) {
      hasLeakage = true;
      diagnostics.push(
        makeDiag(
          "review_detected_move_leakage",
          `Reviewer detected move leakage in section "${assessment.sectionType}": [${assessment.detectedMoveLeakage?.join(", ") ?? ""}].`,
        ),
      );
    }
  }

  // ── Check 6: Detected unsafe certainty ───────────────────────────────────

  let hasUnsafeCertainty = false;
  for (const assessment of review.sectionAssessments) {
    if (assessment.detectedUnsafeCertainty === true) {
      hasUnsafeCertainty = true;
      diagnostics.push(
        makeDiag(
          "review_detected_unsafe_certainty",
          `Reviewer detected unsafe certainty in section "${assessment.sectionType}". This triggers a governance compromise regardless of reviewer verdict.`,
        ),
      );
    }
  }

  // ── Check 7: Detected panic tone ─────────────────────────────────────────

  let hasPanicTone = false;
  for (const assessment of review.sectionAssessments) {
    if (assessment.detectedPanicTone === true) {
      hasPanicTone = true;
      diagnostics.push(
        makeDiag(
          "review_detected_panic_tone",
          `Reviewer detected panic tone in section "${assessment.sectionType}". This triggers a governance compromise regardless of reviewer verdict.`,
        ),
      );
    }
  }

  // ── Compliance flag ───────────────────────────────────────────────────────

  const compliant =
    missingSectionAssessments.length === 0 &&
    unreviewedForbiddenMoves.length === 0 &&
    unreviewedRequiredConstraints.length === 0 &&
    unacknowledgedBlockedSections.length === 0 &&
    !hasLeakage &&
    !hasUnsafeCertainty &&
    !hasPanicTone;

  // ── Governance compromise check ───────────────────────────────────────────
  // A reviewer may not force-approve a draft that has compliance gaps.
  // Unsafe certainty and panic tone compromise governance regardless of verdict.

  const forceApproveWithGaps = review.verdict === "approved" && !compliant;
  const governanceCompromised =
    forceApproveWithGaps || hasUnsafeCertainty || hasPanicTone;

  if (forceApproveWithGaps) {
    // Emit integrity failure only for force-approve scenarios. Honest verdicts
    // (needs_revision, rejected_with_escalation) that detect safety issues are
    // not integrity failures — they are honest reviewer signals.
    diagnostics.push(
      makeDiag(
        "review_integrity_failure",
        `Review verdict is "approved" but compliance gaps exist. Humans may not silently override governance. Effective verdict overridden to "hard_fail_governance_breach".`,
      ),
    );
  }

  // ── Effective verdict ─────────────────────────────────────────────────────

  const effectiveVerdict: WordingReviewVerdict = governanceCompromised
    ? "hard_fail_governance_breach"
    : review.verdict;

  // ── Notes ─────────────────────────────────────────────────────────────────

  const notes: string[] = [];
  if (compliant && !governanceCompromised) {
    notes.push(
      `Human wording review compliance verified. effectiveVerdict="${effectiveVerdict}". ${String(draft.sectionDrafts.length)} section(s) reviewed.`,
    );
  } else {
    notes.push(
      `Human wording review compliance has gaps. effectiveVerdict="${effectiveVerdict}". diagnostics=${String(diagnostics.length)}.`,
    );
  }
  notes.push(
    "Metadata review only: no prose generated, no LLM called, no OCR accessed, no Smart Talk production wiring.",
  );

  return {
    compliant,
    governanceCompromised,
    effectiveVerdict,
    diagnostics,
    missingSectionAssessments,
    unacknowledgedBlockedSections,
    unreviewedForbiddenMoves,
    unreviewedRequiredConstraints,
    notes,
    neverUserVisible: true,
  };
}
