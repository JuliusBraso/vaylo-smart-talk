/**
 * Internal Human Wording Review regression scaffold (Phase 8.2F-8).
 *
 * Eight structural cases exercising verifyHumanReviewCompliance:
 *
 *  Case 1 — clean draft + complete approved review                  → compliant
 *  Case 2 — restricted draft + reviewer acknowledges + needs_revision → compliant
 *  Case 3 — restricted draft + force-approved without acknowledgement → governance compromised
 *  Case 4 — missing section assessment                              → non-compliant
 *  Case 5 — unreviewed forbidden move + approved verdict            → governance compromised
 *  Case 6 — reviewer detects unsafe certainty                       → governance compromised
 *  Case 7 — empty draft + approved review                           → compliant
 *  Case 8 — reviewer detects panic tone + approved verdict          → governance compromised
 *
 * No Jest/Vitest. No CI hook. No runtime integration.
 * No prose generated. No LLM. No OCR. No Smart Talk wiring.
 */

import type {
  RuntimeExplanationDraft,
  RuntimeExplanationSectionDraft,
} from "./explanation-mapper-types";
import type {
  WordingReviewComplianceResult,
  WordingReviewDiagnosticCode,
  WordingReviewSnapshot,
} from "./wording-review-types";
import {
  WORDING_REVIEW_SCAFFOLD_VERSION,
  verifyHumanReviewCompliance,
} from "./run-wording-review-scaffold";

export const WORDING_REVIEW_REGRESSION_VERSION =
  "8.2f-8-wording-review-regression-scaffold-v1";

// ── Result types ──────────────────────────────────────────────────────────────

export interface WordingReviewRegressionCaseResult {
  readonly caseName: string;
  readonly passed: boolean;
  readonly complianceResult: WordingReviewComplianceResult;
  readonly failures: readonly string[];
  readonly notes: readonly string[];
}

export interface WordingReviewRegressionScaffoldResult {
  readonly scaffoldVersion: string;
  readonly wordingReviewVersion: string;
  readonly allPassed: boolean;
  readonly caseResults: readonly WordingReviewRegressionCaseResult[];
  readonly notes: readonly string[];
}

// ── Shared fixture helpers ────────────────────────────────────────────────────

function makeSectionDraft(
  sectionType: RuntimeExplanationSectionDraft["sectionType"],
  blockedReasonCodes?: readonly string[],
): RuntimeExplanationSectionDraft {
  return {
    sectionType,
    accessTier: "free_preview",
    sourceBound: true,
    uncertaintyPreserved: false,
    allowedContractFields: [],
    ...(blockedReasonCodes && blockedReasonCodes.length > 0
      ? { blockedReasonCodes }
      : {}),
    neverContainsUserVisibleCopy: true,
  };
}

function makeDraft(
  overrides: Partial<RuntimeExplanationDraft>,
): RuntimeExplanationDraft {
  return {
    draftVersion: "8.2f-2-runtime-explanation-draft-v1",
    accessTier: "free_preview",
    sectionDrafts: [],
    appliedBoundaries: [],
    appliedForbiddenMoves: [],
    appliedRequiredConstraints: [],
    uncertaintyPosture: "unknown",
    reviewPosture: "none",
    auditRefs: [],
    neverUserVisibleDiagnostics: [],
    ...overrides,
  };
}

function makeSnapshot(
  overrides: Partial<Omit<WordingReviewSnapshot, "neverUserVisible">>,
): WordingReviewSnapshot {
  return {
    reviewId: "regression-review-placeholder",
    timestamp: "2026-05-22T00:00:00Z",
    reviewerId: "internal-reviewer-placeholder",
    verdict: "approved",
    sectionAssessments: [],
    reviewedForbiddenMoves: [],
    reviewedRequiredConstraints: [],
    neverUserVisible: true,
    ...overrides,
  };
}

// ── Assertion helper ──────────────────────────────────────────────────────────

function assertCompliance(
  caseName: string,
  result: WordingReviewComplianceResult,
  opts: {
    expectCompliant: boolean;
    expectGovernanceCompromised: boolean;
    expectEffectiveVerdict: WordingReviewComplianceResult["effectiveVerdict"];
    expectDiagnosticCodes?: readonly WordingReviewDiagnosticCode[];
    expectNoDiagnosticCodes?: readonly WordingReviewDiagnosticCode[];
    expectMissingSections?: readonly string[];
  },
): WordingReviewRegressionCaseResult {
  const failures: string[] = [];

  if (result.compliant !== opts.expectCompliant) {
    failures.push(
      `compliant: expected=${String(opts.expectCompliant)}, got=${String(result.compliant)}`,
    );
  }
  if (result.governanceCompromised !== opts.expectGovernanceCompromised) {
    failures.push(
      `governanceCompromised: expected=${String(opts.expectGovernanceCompromised)}, got=${String(result.governanceCompromised)}`,
    );
  }
  if (result.effectiveVerdict !== opts.expectEffectiveVerdict) {
    failures.push(
      `effectiveVerdict: expected="${opts.expectEffectiveVerdict}", got="${result.effectiveVerdict}"`,
    );
  }
  const emittedCodes = result.diagnostics.map((d) => d.code);
  for (const code of opts.expectDiagnosticCodes ?? []) {
    if (!emittedCodes.includes(code)) {
      failures.push(`Expected diagnostic "${code}" not emitted`);
    }
  }
  for (const code of opts.expectNoDiagnosticCodes ?? []) {
    if (emittedCodes.includes(code)) {
      failures.push(`Diagnostic "${code}" must NOT be emitted`);
    }
  }
  for (const section of opts.expectMissingSections ?? []) {
    if (!result.missingSectionAssessments.includes(section as never)) {
      failures.push(`Section "${section}" expected in missingSectionAssessments`);
    }
  }
  // neverUserVisible invariant.
  if (!result.neverUserVisible) {
    failures.push("neverUserVisible must be true on compliance result");
  }
  for (const diag of result.diagnostics) {
    if (!diag.neverUserVisible) {
      failures.push(`Diagnostic code="${diag.code}" violates neverUserVisible invariant`);
    }
  }

  const passed = failures.length === 0;
  return {
    caseName,
    passed,
    complianceResult: result,
    failures,
    notes: [
      passed
        ? `Case "${caseName}" passed.`
        : `Case "${caseName}" failed with ${String(failures.length)} failure(s).`,
    ],
  };
}

// ── Case 1 — clean draft + complete approved review ───────────────────────────

function runCase1(): WordingReviewRegressionCaseResult {
  const draft = makeDraft({
    sectionDrafts: [
      makeSectionDraft("document_overview"),
      makeSectionDraft("payment_preview_limited"),
      makeSectionDraft("uncertainty_and_limits"),
    ],
    appliedForbiddenMoves: [],
    appliedRequiredConstraints: [],
  });

  const review = makeSnapshot({
    reviewId: "regression-case-1",
    verdict: "approved",
    sectionAssessments: [
      { sectionType: "document_overview", humanReviewed: true, humanApproved: true },
      { sectionType: "payment_preview_limited", humanReviewed: true, humanApproved: true },
      { sectionType: "uncertainty_and_limits", humanReviewed: true, humanApproved: true },
    ],
    reviewedForbiddenMoves: [],
    reviewedRequiredConstraints: [],
  });

  return assertCompliance("clean_draft_complete_approved_review", verifyHumanReviewCompliance({ draft, review }), {
    expectCompliant: true,
    expectGovernanceCompromised: false,
    expectEffectiveVerdict: "approved",
    expectNoDiagnosticCodes: ["review_integrity_failure"],
  });
}

// ── Case 2 — restricted draft + acknowledged + needs_revision ─────────────────

function runCase2(): WordingReviewRegressionCaseResult {
  const blockedCode = "forbidden_move:no_deadline_calculation_when_forbidden";
  const draft = makeDraft({
    sectionDrafts: [
      makeSectionDraft("document_overview"),
      makeSectionDraft("uncertainty_and_limits", [blockedCode]),
    ],
    appliedForbiddenMoves: ["no_deadline_calculation_when_forbidden"],
    appliedRequiredConstraints: ["required_uncertainty_wording"],
  });

  const review = makeSnapshot({
    reviewId: "regression-case-2",
    verdict: "needs_revision",
    sectionAssessments: [
      { sectionType: "document_overview", humanReviewed: true, humanApproved: true },
      {
        sectionType: "uncertainty_and_limits",
        humanReviewed: true,
        humanApproved: false,
        acknowledgedBlockedReasonCodes: [blockedCode],
        notes: ["Deadline suppression confirmed. Wording needs adjustment."],
      },
    ],
    reviewedForbiddenMoves: ["no_deadline_calculation_when_forbidden"],
    reviewedRequiredConstraints: ["required_uncertainty_wording"],
  });

  return assertCompliance("restricted_draft_acknowledged_needs_revision", verifyHumanReviewCompliance({ draft, review }), {
    expectCompliant: true,
    expectGovernanceCompromised: false,
    expectEffectiveVerdict: "needs_revision",
    expectNoDiagnosticCodes: [
      "review_integrity_failure",
      "review_unacknowledged_blocked_reason",
      "review_unreviewed_forbidden_move",
    ],
  });
}

// ── Case 3 — restricted draft + force-approved without acknowledgement ─────────

function runCase3(): WordingReviewRegressionCaseResult {
  const blockedCode = "forbidden_move:no_enforcement_claim_when_forbidden";
  const draft = makeDraft({
    sectionDrafts: [
      makeSectionDraft("document_overview", [blockedCode]),
    ],
  });

  const review = makeSnapshot({
    reviewId: "regression-case-3",
    verdict: "approved",
    sectionAssessments: [
      {
        sectionType: "document_overview",
        humanReviewed: true,
        humanApproved: true,
        // deliberate: no acknowledgedBlockedReasonCodes
      },
    ],
  });

  return assertCompliance("restricted_draft_force_approved_no_acknowledgement", verifyHumanReviewCompliance({ draft, review }), {
    expectCompliant: false,
    expectGovernanceCompromised: true,
    expectEffectiveVerdict: "hard_fail_governance_breach",
    expectDiagnosticCodes: [
      "review_unacknowledged_blocked_reason",
      "review_integrity_failure",
    ],
  });
}

// ── Case 4 — missing section assessment ──────────────────────────────────────

function runCase4(): WordingReviewRegressionCaseResult {
  const draft = makeDraft({
    sectionDrafts: [
      makeSectionDraft("document_overview"),
      makeSectionDraft("payment_preview_limited"),
    ],
  });

  const review = makeSnapshot({
    reviewId: "regression-case-4",
    verdict: "approved",
    sectionAssessments: [
      // payment_preview_limited assessment deliberately omitted
      { sectionType: "document_overview", humanReviewed: true, humanApproved: true },
    ],
  });

  return assertCompliance("missing_section_assessment", verifyHumanReviewCompliance({ draft, review }), {
    expectCompliant: false,
    expectGovernanceCompromised: true,
    expectEffectiveVerdict: "hard_fail_governance_breach",
    expectDiagnosticCodes: [
      "review_missing_section_assessment",
      "review_integrity_failure",
    ],
    expectMissingSections: ["payment_preview_limited"],
  });
}

// ── Case 5 — unreviewed forbidden move + approved verdict ─────────────────────

function runCase5(): WordingReviewRegressionCaseResult {
  const draft = makeDraft({
    sectionDrafts: [makeSectionDraft("document_overview")],
    appliedForbiddenMoves: ["no_definitive_legal_verdicts", "no_speculation_as_fact"],
  });

  const review = makeSnapshot({
    reviewId: "regression-case-5",
    verdict: "approved",
    sectionAssessments: [
      { sectionType: "document_overview", humanReviewed: true, humanApproved: true },
    ],
    // reviewedForbiddenMoves deliberately incomplete
    reviewedForbiddenMoves: ["no_definitive_legal_verdicts"],
  });

  return assertCompliance("unreviewed_forbidden_move_approved", verifyHumanReviewCompliance({ draft, review }), {
    expectCompliant: false,
    expectGovernanceCompromised: true,
    expectEffectiveVerdict: "hard_fail_governance_breach",
    expectDiagnosticCodes: [
      "review_unreviewed_forbidden_move",
      "review_integrity_failure",
    ],
  });
}

// ── Case 6 — reviewer detects unsafe certainty ───────────────────────────────

function runCase6(): WordingReviewRegressionCaseResult {
  const draft = makeDraft({
    sectionDrafts: [
      makeSectionDraft("document_overview"),
      makeSectionDraft("what_this_means"),
    ],
    accessTier: "paid_explanation",
  });

  const review = makeSnapshot({
    reviewId: "regression-case-6",
    verdict: "rejected_with_escalation",
    sectionAssessments: [
      { sectionType: "document_overview", humanReviewed: true, humanApproved: false },
      {
        sectionType: "what_this_means",
        humanReviewed: true,
        humanApproved: false,
        detectedUnsafeCertainty: true,
        notes: ["Section implies outcome certainty without source-bound evidence."],
      },
    ],
  });

  return assertCompliance("reviewer_detects_unsafe_certainty", verifyHumanReviewCompliance({ draft, review }), {
    expectCompliant: false,
    expectGovernanceCompromised: true,
    expectEffectiveVerdict: "hard_fail_governance_breach",
    expectDiagnosticCodes: ["review_detected_unsafe_certainty"],
    // Honest verdict (rejected_with_escalation) must NOT emit integrity failure.
    expectNoDiagnosticCodes: ["review_integrity_failure"],
  });
}

// ── Case 7 — empty draft + approved review ────────────────────────────────────

function runCase7(): WordingReviewRegressionCaseResult {
  // Vacuously compliant: no sections to assess, no moves to review.
  const draft = makeDraft({});

  const review = makeSnapshot({
    reviewId: "regression-case-7",
    verdict: "approved",
    sectionAssessments: [],
    reviewedForbiddenMoves: [],
    reviewedRequiredConstraints: [],
  });

  return assertCompliance("empty_draft_approved_review", verifyHumanReviewCompliance({ draft, review }), {
    expectCompliant: true,
    expectGovernanceCompromised: false,
    expectEffectiveVerdict: "approved",
    expectNoDiagnosticCodes: [
      "review_integrity_failure",
      "review_missing_section_assessment",
      "review_unreviewed_forbidden_move",
    ],
  });
}

// ── Case 8 — reviewer detects panic tone + approved verdict ───────────────────

function runCase8(): WordingReviewRegressionCaseResult {
  const draft = makeDraft({
    sectionDrafts: [
      makeSectionDraft("document_overview"),
      makeSectionDraft("uncertainty_and_limits"),
    ],
  });

  const review = makeSnapshot({
    reviewId: "regression-case-8",
    verdict: "approved",
    sectionAssessments: [
      { sectionType: "document_overview", humanReviewed: true, humanApproved: true },
      {
        sectionType: "uncertainty_and_limits",
        humanReviewed: true,
        humanApproved: true,
        detectedPanicTone: true,
        notes: ["Section amplifies urgency beyond source-bound evidence."],
      },
    ],
  });

  return assertCompliance("reviewer_detects_panic_tone_approved_verdict", verifyHumanReviewCompliance({ draft, review }), {
    expectCompliant: false,
    expectGovernanceCompromised: true,
    expectEffectiveVerdict: "hard_fail_governance_breach",
    expectDiagnosticCodes: [
      "review_detected_panic_tone",
      "review_integrity_failure",
    ],
  });
}

// ── Scaffold runner ───────────────────────────────────────────────────────────

/**
 * Runs all 8 wording review regression cases and aggregates results.
 *
 * Does not throw. All assertions collected as failure strings.
 * No prose generated. No LLM. No OCR. No Smart Talk runtime.
 */
export function runWordingReviewRegressionScaffold(): WordingReviewRegressionScaffoldResult {
  const caseResults: WordingReviewRegressionCaseResult[] = [
    runCase1(),
    runCase2(),
    runCase3(),
    runCase4(),
    runCase5(),
    runCase6(),
    runCase7(),
    runCase8(),
  ];

  const allPassed = caseResults.every((r) => r.passed);
  const passCount = caseResults.filter((r) => r.passed).length;
  const failCount = caseResults.length - passCount;

  const notes: string[] = [
    `Wording review regression scaffold complete. ${String(passCount)}/${String(caseResults.length)} cases passed.`,
  ];

  if (allPassed) {
    notes.push(
      "All compliance rules, governance override protection, forbidden-move review, and neverUserVisible invariants validated.",
    );
  } else {
    notes.push(
      `${String(failCount)} case(s) failed — review complianceResult diagnostics for details.`,
    );
  }

  notes.push(
    "Scaffold is metadata-only: no prose generated, no LLM called, no OCR accessed, no Smart Talk production wiring.",
  );

  return {
    scaffoldVersion: WORDING_REVIEW_REGRESSION_VERSION,
    wordingReviewVersion: WORDING_REVIEW_SCAFFOLD_VERSION,
    allPassed,
    caseResults,
    notes,
  };
}
