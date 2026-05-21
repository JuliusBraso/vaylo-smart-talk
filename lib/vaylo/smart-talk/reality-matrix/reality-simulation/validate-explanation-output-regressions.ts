/**
 * Explanation Output Regression Validator (Phase 8.2F-5).
 *
 * Pure validator: checks that a RuntimeExplanationDraft produced by a mapper
 * satisfies all structural governance expectations defined in a corpus case.
 *
 * No prose inspection. No NLP. No OCR. No LLM. No Smart Talk wiring.
 * No deadline calculation. No legal inference.
 */

import type { RuntimeExplanationDraft, RuntimeExplanationSectionType } from "./explanation-mapper-types";
import type {
  BlockedReasonExpectation,
  ExplanationOutputRegressionCase,
  ExplanationOutputRegressionFailureCategory,
} from "./explanation-output-regression-corpus";

// ── Result types ──────────────────────────────────────────────────────────────

export interface ExplanationOutputRegressionFailure {
  readonly category: ExplanationOutputRegressionFailureCategory;
  readonly detail: string;
}

export interface ExplanationOutputRegressionValidationResult {
  readonly caseId: string;
  readonly caseTitle: string;
  readonly passed: boolean;
  readonly failures: readonly ExplanationOutputRegressionFailure[];
}

// ── Structural constants ──────────────────────────────────────────────────────

/** Sections that must never appear in a free_preview draft under any condition. */
const FREE_PREVIEW_STRUCTURALLY_BANNED: readonly RuntimeExplanationSectionType[] = [
  "what_this_means",
  "attention_points",
  "next_steps_safe",
  "paid_deep_explanation",
];

/** The section that must never appear in a paid_explanation draft. */
const PAID_STRUCTURALLY_BANNED: readonly RuntimeExplanationSectionType[] = [
  "payment_preview_limited",
];

// ── Internal helpers ──────────────────────────────────────────────────────────

function hasSectionType(
  draft: RuntimeExplanationDraft,
  sectionType: RuntimeExplanationSectionType,
): boolean {
  return draft.sectionDrafts.some((s) => s.sectionType === sectionType);
}

function hasDiagnosticCode(draft: RuntimeExplanationDraft, code: string): boolean {
  return draft.neverUserVisibleDiagnostics.some((d) => d.code === code);
}

function sectionHasBlockedCodeFragment(
  draft: RuntimeExplanationDraft,
  expectation: BlockedReasonExpectation,
): boolean {
  const section = draft.sectionDrafts.find(
    (s) => s.sectionType === expectation.sectionType,
  );
  return (
    section?.blockedReasonCodes?.some((c) => c.includes(expectation.codeFragment)) ?? false
  );
}

function fail(
  failures: ExplanationOutputRegressionFailure[],
  category: ExplanationOutputRegressionFailureCategory,
  detail: string,
): void {
  failures.push({ category, detail });
}

// ── Main validator ────────────────────────────────────────────────────────────

/**
 * Validates a RuntimeExplanationDraft against an ExplanationOutputRegressionCase.
 *
 * Checks structural governance properties only. Does not inspect prose, call LLMs,
 * parse OCR, calculate deadlines, or infer legal conclusions.
 *
 * Returns an ExplanationOutputRegressionValidationResult with all failures found.
 */
export function validateExplanationOutputRegression(
  draft: RuntimeExplanationDraft,
  corpusCase: ExplanationOutputRegressionCase,
): ExplanationOutputRegressionValidationResult {
  const failures: ExplanationOutputRegressionFailure[] = [];

  // ── 1. Zero-sections expectation (invalid-tier cases) ─────────────────────
  if (corpusCase.expectsZeroSections === true && draft.sectionDrafts.length !== 0) {
    fail(
      failures,
      "access_tier_violation",
      `Expected zero sections (invalid-tier path) but got ${draft.sectionDrafts.length} section(s).`,
    );
  }

  // ── 2. Required sections present ─────────────────────────────────────────
  for (const sectionType of corpusCase.expectedSectionsPresent) {
    if (!hasSectionType(draft, sectionType)) {
      fail(
        failures,
        "missing_required_section",
        `Required section "${sectionType}" is absent from the draft.`,
      );
    }
  }

  // ── 3. Forbidden sections absent ─────────────────────────────────────────
  for (const sectionType of corpusCase.expectedSectionsAbsent) {
    if (hasSectionType(draft, sectionType)) {
      const isFreeLeakage =
        corpusCase.mapperKind === "free_preview" &&
        (FREE_PREVIEW_STRUCTURALLY_BANNED as readonly string[]).includes(sectionType);
      fail(
        failures,
        isFreeLeakage ? "free_preview_leakage" : "forbidden_section_present",
        `Section "${sectionType}" must be absent but is present in the draft.`,
      );
    }
  }

  // ── 4. Expected diagnostic codes present ──────────────────────────────────
  for (const code of corpusCase.expectedDiagnosticCodes) {
    if (!hasDiagnosticCode(draft, code)) {
      fail(
        failures,
        "diagnostic_mismatch",
        `Expected diagnostic code "${code}" not found in neverUserVisibleDiagnostics.`,
      );
    }
  }

  // ── 5. Uncertainty posture ────────────────────────────────────────────────
  if (draft.uncertaintyPosture !== corpusCase.expectedUncertaintyPosture) {
    fail(
      failures,
      "uncertainty_posture_drift",
      `Expected uncertaintyPosture "${corpusCase.expectedUncertaintyPosture}", got "${draft.uncertaintyPosture}".`,
    );
  }

  // ── 6. Review posture ─────────────────────────────────────────────────────
  if (draft.reviewPosture !== corpusCase.expectedReviewPosture) {
    fail(
      failures,
      "review_posture_drift",
      `Expected reviewPosture "${corpusCase.expectedReviewPosture}", got "${draft.reviewPosture}".`,
    );
  }

  // ── 7. Blocked reason code expectations ───────────────────────────────────
  for (const expectation of corpusCase.expectedBlockedReasonCodes) {
    const sectionPresent = hasSectionType(draft, expectation.sectionType);
    if (!sectionPresent) {
      // Only report if the section was expected to be present (already caught in step 2
      // for missing sections; here we just skip the blocked-reason check).
      if (corpusCase.expectedSectionsPresent.includes(expectation.sectionType)) {
        fail(
          failures,
          "blocked_reason_missing",
          `Section "${expectation.sectionType}" is absent; cannot verify blockedReasonCode "${expectation.codeFragment}".`,
        );
      }
    } else if (!sectionHasBlockedCodeFragment(draft, expectation)) {
      fail(
        failures,
        "blocked_reason_missing",
        `Section "${expectation.sectionType}" is missing a blockedReasonCode containing "${expectation.codeFragment}".`,
      );
    }
  }

  // ── 8. Structural safety: free preview leakage (always enforced) ──────────
  if (corpusCase.mapperKind === "free_preview") {
    for (const bannedSection of FREE_PREVIEW_STRUCTURALLY_BANNED) {
      // Skip sections already caught in step 3 to avoid duplicate failures.
      if (
        hasSectionType(draft, bannedSection) &&
        !corpusCase.expectedSectionsAbsent.includes(bannedSection)
      ) {
        fail(
          failures,
          "free_preview_leakage",
          `Free preview draft unexpectedly contains paid-only section "${bannedSection}".`,
        );
      }
    }
  }

  // ── 9. Structural safety: paid mapper free-section isolation ──────────────
  if (corpusCase.mapperKind === "paid_explanation") {
    for (const bannedSection of PAID_STRUCTURALLY_BANNED) {
      if (
        hasSectionType(draft, bannedSection) &&
        !corpusCase.expectedSectionsAbsent.includes(bannedSection)
      ) {
        fail(
          failures,
          "access_tier_violation",
          `Paid mapper unexpectedly emitted free-only section "${bannedSection}".`,
        );
      }
    }
  }

  // ── 10. Section governance invariants ─────────────────────────────────────
  for (const section of draft.sectionDrafts) {
    if (!section.sourceBound) {
      fail(
        failures,
        "forbidden_move_suppression_failure",
        `Section "${section.sectionType}" has sourceBound !== true (governance invariant violated).`,
      );
    }
    if (!section.neverContainsUserVisibleCopy) {
      fail(
        failures,
        "forbidden_move_suppression_failure",
        `Section "${section.sectionType}" has neverContainsUserVisibleCopy !== true (governance invariant violated).`,
      );
    }
  }

  // ── 11. Diagnostic governance invariant ───────────────────────────────────
  for (const diag of draft.neverUserVisibleDiagnostics) {
    if (!diag.neverUserVisible) {
      fail(
        failures,
        "access_tier_violation",
        `Diagnostic "${diag.code}" has neverUserVisible !== true (must always be true).`,
      );
    }
  }

  return {
    caseId: corpusCase.id,
    caseTitle: corpusCase.title,
    passed: failures.length === 0,
    failures,
  };
}
