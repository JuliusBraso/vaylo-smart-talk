/**
 * Explanation Output Regression Corpus (Phase 8.2F-5).
 *
 * 15 structural regression cases covering free preview, paid explanation,
 * forbidden move suppression, uncertainty/review postures, section isolation,
 * and invalid-tier behavior.
 *
 * Data only — no runtime execution, no prose generation, no LLM, no OCR,
 * no Smart Talk wiring, no deadline calculation.
 */

import type { RealitySimulationResult } from "../reality-simulation-types";
import type {
  ExplanationAccessTier,
  ForbiddenExplanationMove,
  FreePreviewSimulationExplanationContract,
  PaidSimulationExplanationContract,
  RequiredExplanationConstraint,
  SimulationExplanationContract,
} from "./explanation-contract-types";
import type {
  ExplanationReviewPosture,
  ExplanationUncertaintyPosture,
  RuntimeExplanationSectionType,
} from "./explanation-mapper-types";

export const EXPLANATION_OUTPUT_REGRESSION_CORPUS_VERSION =
  "8.2f-15d-explanation-output-regression-corpus-v4";

// ── Failure taxonomy ──────────────────────────────────────────────────────────

/**
 * Typed failure categories for explanation output regression validation.
 * Used in ExplanationOutputRegressionFailure to classify governance violations.
 */
export type ExplanationOutputRegressionFailureCategory =
  | "missing_required_section"
  | "forbidden_section_present"
  | "diagnostic_mismatch"
  | "uncertainty_posture_drift"
  | "review_posture_drift"
  | "blocked_reason_missing"
  | "free_preview_leakage"
  | "forbidden_move_suppression_failure"
  | "access_tier_violation";

// ── Corpus case type ──────────────────────────────────────────────────────────

export interface BlockedReasonExpectation {
  readonly sectionType: RuntimeExplanationSectionType;
  readonly codeFragment: string;
}

export interface ExplanationOutputRegressionCase {
  readonly id: string;
  readonly title: string;
  readonly mapperKind: "free_preview" | "paid_explanation";
  readonly simulationResultFixture: RealitySimulationResult;
  readonly contractFixture: SimulationExplanationContract;
  /**
   * When provided, overrides input.accessTier (not which mapper is called).
   * Used for invalid-tier test cases to verify diagnostic-only draft behavior.
   */
  readonly accessTierOverride?: ExplanationAccessTier;
  readonly expectedSectionsPresent: readonly RuntimeExplanationSectionType[];
  readonly expectedSectionsAbsent: readonly RuntimeExplanationSectionType[];
  readonly expectedDiagnosticCodes: readonly string[];
  readonly expectedUncertaintyPosture: ExplanationUncertaintyPosture;
  readonly expectedReviewPosture: ExplanationReviewPosture;
  readonly expectedBlockedReasonCodes: readonly BlockedReasonExpectation[];
  /** When true, the validator asserts sectionDrafts.length === 0. */
  readonly expectsZeroSections?: boolean;
  readonly notes: string;
}

// ── Private fixture helpers ───────────────────────────────────────────────────

const C_VERSION = "8.2d-6-simulation-explanation-contract-v1" as const;

function freeContract(options?: {
  readonly moves?: readonly ForbiddenExplanationMove[];
  readonly constraints?: readonly RequiredExplanationConstraint[];
  readonly humanReviewSuggested?: boolean;
  readonly attentionLevelPreview?: "low" | "needs_review" | "unknown";
}): FreePreviewSimulationExplanationContract {
  return {
    contractVersion: C_VERSION,
    accessTier: "free_preview",
    freePreviewFields: {
      hasFinancialSignal: false,
      hasDeadlineSignal: false,
      attentionLevelPreview: options?.attentionLevelPreview ?? "low",
      humanReviewSuggested: options?.humanReviewSuggested ?? false,
      confidencePosture: "unknown",
    },
    forbiddenExplanationMoves: options?.moves ?? [],
    requiredExplanationConstraints: options?.constraints ?? [],
    uncertaintyRequirements: [],
  };
}

function paidContract(options?: {
  readonly moves?: readonly ForbiddenExplanationMove[];
  readonly constraints?: readonly RequiredExplanationConstraint[];
  readonly humanReviewSuggested?: boolean;
  readonly attentionLevelPreview?: "low" | "needs_review" | "unknown";
}): PaidSimulationExplanationContract {
  return {
    contractVersion: C_VERSION,
    accessTier: "paid_explanation",
    freePreviewFields: {
      hasFinancialSignal: false,
      hasDeadlineSignal: false,
      attentionLevelPreview: options?.attentionLevelPreview ?? "low",
      humanReviewSuggested: options?.humanReviewSuggested ?? false,
      confidencePosture: "unknown",
    },
    paidExplanationFields: {
      explicitFinancialSignalsOnly: [],
      explicitDeadlineMentionsOnly: [],
      institutionSignals: [],
      authorizedClaimCandidates: [],
      supportedRealityCandidates: [],
      uncertaintyReasons: [],
      boundaryIds: [],
      reviewFlags: [],
      trapWarningIds: [],
    },
    forbiddenExplanationMoves: options?.moves ?? [],
    requiredExplanationConstraints: options?.constraints ?? [],
    uncertaintyRequirements: [],
  };
}

const EMPTY_SIM: RealitySimulationResult = {};

const UNCERTAINTY_SIM: RealitySimulationResult = {
  uncertaintyReasons: [
    { code: "corpus_scaffold_uncertainty", detail: "corpus regression artificial uncertainty" },
  ],
};

const HUMAN_REVIEW_SIM: RealitySimulationResult = {
  reviewFlags: [{ flagId: "human_review_recommended", reasonCode: "corpus_regression" }],
};

// ── Corpus ────────────────────────────────────────────────────────────────────

export const EXPLANATION_OUTPUT_REGRESSION_CORPUS: readonly ExplanationOutputRegressionCase[] =
  [
    // ── FREE PREVIEW cases ──────────────────────────────────────────────────────

    {
      id: "eo-8-2f-5-0001-free-basic-safe-preview",
      title: "Free preview: basic safe output with no forbidden moves",
      mapperKind: "free_preview",
      simulationResultFixture: EMPTY_SIM,
      contractFixture: freeContract(),
      expectedSectionsPresent: [
        "document_overview",
        "payment_preview_limited",
        "uncertainty_and_limits",
      ],
      expectedSectionsAbsent: [
        "what_this_means",
        "attention_points",
        "next_steps_safe",
        "paid_deep_explanation",
        "review_recommendation",
      ],
      expectedDiagnosticCodes: ["free_preview_paid_field_blocked"],
      expectedUncertaintyPosture: "unknown",
      expectedReviewPosture: "none",
      expectedBlockedReasonCodes: [],
      notes:
        "Baseline: free preview emits only the 3 base sections. Paid-only sections are structurally absent. Invariant paid-block diagnostic is always emitted.",
    },

    {
      id: "eo-8-2f-5-0002-free-uncertainty-preserved",
      title: "Free preview: uncertainty_preserved posture from required constraints",
      mapperKind: "free_preview",
      simulationResultFixture: UNCERTAINTY_SIM,
      contractFixture: freeContract({
        constraints: ["required_uncertainty_wording", "must_preserve_uncertainty"],
      }),
      expectedSectionsPresent: [
        "document_overview",
        "payment_preview_limited",
        "uncertainty_and_limits",
      ],
      expectedSectionsAbsent: [
        "what_this_means",
        "attention_points",
        "next_steps_safe",
        "paid_deep_explanation",
      ],
      expectedDiagnosticCodes: ["free_preview_paid_field_blocked"],
      expectedUncertaintyPosture: "uncertainty_preserved",
      expectedReviewPosture: "none",
      expectedBlockedReasonCodes: [],
      notes:
        "Uncertainty constraint and simulation uncertainty reasons both present. All sections must have uncertaintyPreserved: true.",
    },

    {
      id: "eo-8-2f-5-0003-free-deadline-suppression",
      title: "Free preview: deadline suppression via no_deadline_calculation_when_forbidden",
      mapperKind: "free_preview",
      simulationResultFixture: EMPTY_SIM,
      contractFixture: freeContract({
        moves: ["no_deadline_calculation_when_forbidden"],
      }),
      expectedSectionsPresent: [
        "document_overview",
        "payment_preview_limited",
        "uncertainty_and_limits",
      ],
      expectedSectionsAbsent: [
        "what_this_means",
        "attention_points",
        "next_steps_safe",
        "paid_deep_explanation",
      ],
      expectedDiagnosticCodes: [
        "free_preview_deadline_detail_blocked",
        "free_preview_paid_field_blocked",
      ],
      expectedUncertaintyPosture: "unknown",
      expectedReviewPosture: "none",
      expectedBlockedReasonCodes: [
        {
          sectionType: "payment_preview_limited",
          codeFragment: "no_deadline_calculation_when_forbidden",
        },
      ],
      notes:
        "Deadline forbidden move must emit free_preview_deadline_detail_blocked and add blockedReasonCode to payment_preview_limited.",
    },

    {
      id: "eo-8-2f-5-0004-free-enforcement-suppression",
      title: "Free preview: enforcement suppression via no_enforcement_claim_when_forbidden",
      mapperKind: "free_preview",
      simulationResultFixture: EMPTY_SIM,
      contractFixture: freeContract({
        moves: ["no_enforcement_claim_when_forbidden"],
      }),
      expectedSectionsPresent: [
        "document_overview",
        "payment_preview_limited",
        "uncertainty_and_limits",
      ],
      expectedSectionsAbsent: [
        "attention_points",
        "what_this_means",
        "next_steps_safe",
        "paid_deep_explanation",
      ],
      expectedDiagnosticCodes: [
        "free_preview_enforcement_claim_blocked",
        "free_preview_paid_field_blocked",
      ],
      expectedUncertaintyPosture: "unknown",
      expectedReviewPosture: "none",
      expectedBlockedReasonCodes: [],
      notes:
        "Enforcement forbidden move emits free_preview_enforcement_claim_blocked. attention_points is already absent in free preview — the test confirms it remains absent.",
    },

    {
      id: "eo-8-2f-5-0005-free-human-review",
      title: "Free preview: review_recommendation section when human review flag active",
      mapperKind: "free_preview",
      simulationResultFixture: HUMAN_REVIEW_SIM,
      contractFixture: freeContract({
        humanReviewSuggested: true,
        attentionLevelPreview: "needs_review",
      }),
      expectedSectionsPresent: [
        "document_overview",
        "payment_preview_limited",
        "uncertainty_and_limits",
        "review_recommendation",
      ],
      expectedSectionsAbsent: [
        "what_this_means",
        "attention_points",
        "next_steps_safe",
        "paid_deep_explanation",
      ],
      expectedDiagnosticCodes: ["free_preview_paid_field_blocked"],
      expectedUncertaintyPosture: "unknown",
      expectedReviewPosture: "human_review_recommended",
      expectedBlockedReasonCodes: [],
      notes:
        "human_review_recommended flag + contract humanReviewSuggested: true must produce review_recommendation section and human_review_recommended review posture.",
    },

    {
      id: "eo-8-2f-5-0006-free-invalid-tier",
      title: "Free preview: invalid tier — paid_explanation passed into free preview mapper",
      mapperKind: "free_preview",
      simulationResultFixture: EMPTY_SIM,
      contractFixture: freeContract(),
      accessTierOverride: "paid_explanation",
      expectedSectionsPresent: [],
      expectedSectionsAbsent: [
        "document_overview",
        "payment_preview_limited",
        "what_this_means",
        "attention_points",
        "next_steps_safe",
        "paid_deep_explanation",
      ],
      expectedDiagnosticCodes: ["invalid_access_tier_for_free_preview_mapper"],
      expectedUncertaintyPosture: "unknown",
      expectedReviewPosture: "none",
      expectedBlockedReasonCodes: [],
      expectsZeroSections: true,
      notes:
        "When accessTier !== free_preview, free preview mapper must return zero sections and the invalid-tier diagnostic. No throw.",
    },

    // ── PAID EXPLANATION cases ──────────────────────────────────────────────────

    {
      id: "eo-8-2f-5-0007-paid-basic-explanation",
      title: "Paid explanation: basic safe output with no forbidden moves",
      mapperKind: "paid_explanation",
      simulationResultFixture: EMPTY_SIM,
      contractFixture: paidContract(),
      expectedSectionsPresent: [
        "document_overview",
        "what_this_means",
        "attention_points",
        "next_steps_safe",
        "uncertainty_and_limits",
        "paid_deep_explanation",
      ],
      expectedSectionsAbsent: ["payment_preview_limited", "review_recommendation"],
      expectedDiagnosticCodes: [],
      expectedUncertaintyPosture: "unknown",
      expectedReviewPosture: "none",
      expectedBlockedReasonCodes: [],
      notes:
        "Baseline: paid mapper emits all 6 base sections with no restrictions. payment_preview_limited is structurally absent.",
    },

    {
      id: "eo-8-2f-5-0008-paid-uncertainty-preserved",
      title: "Paid explanation: uncertainty_preserved posture under required constraints",
      mapperKind: "paid_explanation",
      simulationResultFixture: UNCERTAINTY_SIM,
      contractFixture: paidContract({
        constraints: ["required_uncertainty_wording", "must_preserve_uncertainty"],
      }),
      expectedSectionsPresent: [
        "document_overview",
        "what_this_means",
        "attention_points",
        "next_steps_safe",
        "uncertainty_and_limits",
        "paid_deep_explanation",
      ],
      expectedSectionsAbsent: ["payment_preview_limited"],
      expectedDiagnosticCodes: [],
      expectedUncertaintyPosture: "uncertainty_preserved",
      expectedReviewPosture: "none",
      expectedBlockedReasonCodes: [],
      notes:
        "Uncertainty constraints propagate to paid tier. All sections must have uncertaintyPreserved: true.",
    },

    {
      id: "eo-8-2f-5-0009-paid-deadline-suppression",
      title: "Paid explanation: deadline output blocked via no_deadline_calculation_when_forbidden",
      mapperKind: "paid_explanation",
      simulationResultFixture: EMPTY_SIM,
      contractFixture: paidContract({
        moves: ["no_deadline_calculation_when_forbidden"],
      }),
      expectedSectionsPresent: [
        "document_overview",
        "what_this_means",
        "attention_points",
        "next_steps_safe",
        "uncertainty_and_limits",
        "paid_deep_explanation",
      ],
      expectedSectionsAbsent: ["payment_preview_limited"],
      expectedDiagnosticCodes: ["paid_deadline_output_blocked"],
      expectedUncertaintyPosture: "unknown",
      expectedReviewPosture: "none",
      expectedBlockedReasonCodes: [
        {
          sectionType: "paid_deep_explanation",
          codeFragment: "no_deadline_calculation_when_forbidden",
        },
        {
          sectionType: "next_steps_safe",
          codeFragment: "no_deadline_calculation_when_forbidden",
        },
      ],
      notes:
        "paid_deep_explanation and next_steps_safe must both receive blockedReasonCode for the deadline forbidden move.",
    },

    {
      id: "eo-8-2f-5-0010-paid-enforcement-suppression",
      title: "Paid explanation: enforcement claim blocked via no_enforcement_claim_when_forbidden",
      mapperKind: "paid_explanation",
      simulationResultFixture: EMPTY_SIM,
      contractFixture: paidContract({
        moves: ["no_enforcement_claim_when_forbidden"],
      }),
      expectedSectionsPresent: [
        "document_overview",
        "what_this_means",
        "attention_points",
        "next_steps_safe",
        "uncertainty_and_limits",
        "paid_deep_explanation",
      ],
      expectedSectionsAbsent: ["payment_preview_limited"],
      expectedDiagnosticCodes: ["paid_enforcement_claim_blocked"],
      expectedUncertaintyPosture: "unknown",
      expectedReviewPosture: "none",
      expectedBlockedReasonCodes: [
        {
          sectionType: "paid_deep_explanation",
          codeFragment: "no_enforcement_claim_when_forbidden",
        },
        {
          sectionType: "attention_points",
          codeFragment: "no_enforcement_claim_when_forbidden",
        },
      ],
      notes:
        "paid_deep_explanation and attention_points must both receive blockedReasonCode for the enforcement forbidden move.",
    },

    {
      id: "eo-8-2f-5-0011-paid-legal-verdict-suppression",
      title: "Paid explanation: legal verdict blocked via no_definitive_legal_verdicts",
      mapperKind: "paid_explanation",
      simulationResultFixture: EMPTY_SIM,
      contractFixture: paidContract({
        moves: ["no_definitive_legal_verdicts"],
      }),
      expectedSectionsPresent: [
        "document_overview",
        "what_this_means",
        "attention_points",
        "next_steps_safe",
        "uncertainty_and_limits",
        "paid_deep_explanation",
      ],
      expectedSectionsAbsent: ["payment_preview_limited"],
      expectedDiagnosticCodes: ["paid_legal_verdict_blocked"],
      expectedUncertaintyPosture: "unknown",
      expectedReviewPosture: "none",
      expectedBlockedReasonCodes: [
        {
          sectionType: "what_this_means",
          codeFragment: "no_definitive_legal_verdicts",
        },
        {
          sectionType: "paid_deep_explanation",
          codeFragment: "no_definitive_legal_verdicts",
        },
      ],
      notes:
        "what_this_means and paid_deep_explanation must both receive blockedReasonCode for the legal-verdict forbidden move.",
    },

    {
      id: "eo-8-2f-5-0012-paid-autonomous-action-suppression",
      title: "Paid explanation: next_steps_safe fully excluded via no_autonomous_form_submission",
      mapperKind: "paid_explanation",
      simulationResultFixture: EMPTY_SIM,
      contractFixture: paidContract({
        moves: ["no_autonomous_form_submission"],
      }),
      expectedSectionsPresent: [
        "document_overview",
        "what_this_means",
        "attention_points",
        "uncertainty_and_limits",
        "paid_deep_explanation",
      ],
      expectedSectionsAbsent: ["next_steps_safe", "payment_preview_limited"],
      expectedDiagnosticCodes: ["paid_autonomous_action_blocked"],
      expectedUncertaintyPosture: "unknown",
      expectedReviewPosture: "none",
      expectedBlockedReasonCodes: [],
      notes:
        "no_autonomous_form_submission must fully exclude next_steps_safe from the draft (not just restrict it). Diagnostic must be emitted.",
    },

    {
      id: "eo-8-2f-5-0013-paid-cross-lane-suppression",
      title: "Paid explanation: cross-lane intent suppressed via no_cross_lane_merging",
      mapperKind: "paid_explanation",
      simulationResultFixture: EMPTY_SIM,
      contractFixture: paidContract({
        moves: ["no_cross_lane_merging"],
      }),
      expectedSectionsPresent: [
        "document_overview",
        "what_this_means",
        "attention_points",
        "next_steps_safe",
        "uncertainty_and_limits",
        "paid_deep_explanation",
      ],
      expectedSectionsAbsent: ["payment_preview_limited"],
      expectedDiagnosticCodes: ["paid_cross_lane_merge_blocked"],
      expectedUncertaintyPosture: "unknown",
      expectedReviewPosture: "none",
      expectedBlockedReasonCodes: [
        {
          sectionType: "what_this_means",
          codeFragment: "no_cross_lane_merging",
        },
        {
          sectionType: "paid_deep_explanation",
          codeFragment: "no_cross_lane_merging",
        },
      ],
      notes:
        "what_this_means and paid_deep_explanation receive blockedReasonCode for cross-lane merge. attention_points and next_steps_safe are not affected.",
    },

    {
      id: "eo-8-2f-5-0014-paid-all-major-forbidden-moves",
      title: "Paid explanation: all major forbidden moves active simultaneously (8.2F-15C: specific codes verified)",
      mapperKind: "paid_explanation",
      simulationResultFixture: EMPTY_SIM,
      contractFixture: paidContract({
        moves: [
          "no_autonomous_form_submission",
          "no_deadline_calculation_when_forbidden",
          "no_enforcement_claim_when_forbidden",
          "no_definitive_legal_verdicts",
          "no_cross_lane_merging",
          "no_high_panic_phrasing",
          "no_dry_run_as_fact",
          "no_speculation_as_fact",
          "no_guaranteed_outcomes",
          "no_tax_certainty",
          "no_immigration_certainty",
        ],
      }),
      expectedSectionsPresent: [
        "document_overview",
        "what_this_means",
        "attention_points",
        "uncertainty_and_limits",
        "paid_deep_explanation",
      ],
      expectedSectionsAbsent: ["next_steps_safe", "payment_preview_limited"],
      // 8.2F-4 codes (narrowed semantics in 8.2F-15C) + 8.2F-15C new specific codes.
      expectedDiagnosticCodes: [
        // Retained 8.2F-4 codes (narrowed):
        "paid_autonomous_action_blocked",        // no_autonomous_form_submission only
        "paid_deadline_output_blocked",          // no_deadline_calculation_when_forbidden
        "paid_enforcement_claim_blocked",        // no_enforcement_claim_when_forbidden
        "paid_legal_verdict_blocked",            // no_definitive_legal_verdicts only (narrowed)
        "paid_cross_lane_merge_blocked",         // no_cross_lane_merging
        // New 8.2F-15C specific codes:
        "paid_panic_phrasing_blocked",          // no_high_panic_phrasing
        "paid_truthfulness_blocked",             // no_dry_run_as_fact / no_speculation_as_fact
        "paid_guaranteed_outcome_blocked",       // no_guaranteed_outcomes
        "paid_tax_certainty_blocked",            // no_tax_certainty
        "paid_immigration_certainty_blocked",    // no_immigration_certainty
        "paid_section_excluded_by_forbidden_move", // generic section-exclusion notification
      ],
      // no_dry_run_as_fact triggers uncertainty_preserved in posture derivation.
      expectedUncertaintyPosture: "uncertainty_preserved",
      expectedReviewPosture: "none",
      expectedBlockedReasonCodes: [
        {
          sectionType: "paid_deep_explanation",
          codeFragment: "no_deadline_calculation_when_forbidden",
        },
        {
          sectionType: "paid_deep_explanation",
          codeFragment: "no_enforcement_claim_when_forbidden",
        },
        {
          sectionType: "what_this_means",
          codeFragment: "no_definitive_legal_verdicts",
        },
        {
          sectionType: "attention_points",
          codeFragment: "no_enforcement_claim_when_forbidden",
        },
      ],
      notes:
        "8.2F-15C: All 11 original paid diagnostic codes verified (5 retained with narrowed semantics, 6 new specific codes). " +
        "next_steps_safe excluded. no_dry_run_as_fact triggers uncertainty_preserved posture. " +
        "document_overview must remain present. paid_legal_verdict_blocked is now no_definitive_legal_verdicts ONLY.",
    },

    // ── 8.2F-15A: New forbidden move preservation cases ─────────────────────────

    {
      id: "eo-8-2f-15a-0016-free-false-reassurance-framing-preserved",
      title:
        "Free preview: no_false_reassurance_framing — specific diagnostic emitted, sections intact",
      mapperKind: "free_preview",
      simulationResultFixture: EMPTY_SIM,
      contractFixture: freeContract({
        moves: ["no_false_reassurance_framing"],
      }),
      expectedSectionsPresent: [
        "document_overview",
        "payment_preview_limited",
        "uncertainty_and_limits",
      ],
      expectedSectionsAbsent: [
        "what_this_means",
        "attention_points",
        "next_steps_safe",
        "paid_deep_explanation",
      ],
      // 8.2F-15C: free_preview_false_reassurance_blocked is the dedicated code.
      // free_preview_paid_field_blocked remains the structural invariant.
      expectedDiagnosticCodes: [
        "free_preview_paid_field_blocked",
        "free_preview_false_reassurance_blocked",
      ],
      expectedUncertaintyPosture: "unknown",
      expectedReviewPosture: "none",
      expectedBlockedReasonCodes: [],
      notes:
        "8.2F-15C: no_false_reassurance_framing now emits free_preview_false_reassurance_blocked (dedicated code). " +
        "free_preview_paid_field_blocked is still emitted as the structural invariant (paid sections absent). " +
        "Standard free preview sections remain intact. No section-level restrictions.",
    },

    {
      id: "eo-8-2f-15a-0017-free-calculated-amount-extraction-preserved",
      title:
        "Free preview: no_calculated_amount_extraction — specific diagnostic emitted, sections intact",
      mapperKind: "free_preview",
      simulationResultFixture: EMPTY_SIM,
      contractFixture: freeContract({
        moves: ["no_calculated_amount_extraction"],
      }),
      expectedSectionsPresent: [
        "document_overview",
        "payment_preview_limited",
        "uncertainty_and_limits",
      ],
      expectedSectionsAbsent: [
        "what_this_means",
        "attention_points",
        "next_steps_safe",
        "paid_deep_explanation",
      ],
      // 8.2F-15C: free_preview_calculated_amount_blocked is the dedicated code.
      // free_preview_paid_field_blocked remains the structural invariant.
      expectedDiagnosticCodes: [
        "free_preview_paid_field_blocked",
        "free_preview_calculated_amount_blocked",
      ],
      expectedUncertaintyPosture: "unknown",
      expectedReviewPosture: "none",
      expectedBlockedReasonCodes: [],
      notes:
        "8.2F-15C: no_calculated_amount_extraction now emits free_preview_calculated_amount_blocked (dedicated code). " +
        "free_preview_paid_field_blocked is still emitted as the structural invariant (paid sections absent). " +
        "Standard free preview sections remain intact. No section-level restrictions.",
    },

    // ── 8.2F-15C: Paid tier coverage for the new 8.2F-15A forbidden moves ──────

    {
      id: "eo-8-2f-15c-0018-paid-false-reassurance-framing-blocked",
      title:
        "Paid explanation: no_false_reassurance_framing — dedicated diagnostic + section restrictions",
      mapperKind: "paid_explanation",
      simulationResultFixture: EMPTY_SIM,
      contractFixture: paidContract({
        moves: ["no_false_reassurance_framing"],
      }),
      expectedSectionsPresent: [
        "document_overview",
        "what_this_means",
        "attention_points",
        "next_steps_safe",
        "uncertainty_and_limits",
        "paid_deep_explanation",
      ],
      expectedSectionsAbsent: ["payment_preview_limited"],
      expectedDiagnosticCodes: ["paid_false_reassurance_blocked"],
      expectedUncertaintyPosture: "unknown",
      expectedReviewPosture: "none",
      expectedBlockedReasonCodes: [
        { sectionType: "what_this_means", codeFragment: "no_false_reassurance_framing" },
        { sectionType: "paid_deep_explanation", codeFragment: "no_false_reassurance_framing" },
      ],
      notes:
        "8.2F-15C: no_false_reassurance_framing emits paid_false_reassurance_blocked in paid tier. " +
        "what_this_means and paid_deep_explanation receive blocked reason codes. " +
        "No section is fully excluded — content restricted only.",
    },

    {
      id: "eo-8-2f-15c-0019-paid-calculated-amount-extraction-blocked",
      title:
        "Paid explanation: no_calculated_amount_extraction — dedicated diagnostic + section restrictions",
      mapperKind: "paid_explanation",
      simulationResultFixture: EMPTY_SIM,
      contractFixture: paidContract({
        moves: ["no_calculated_amount_extraction"],
      }),
      expectedSectionsPresent: [
        "document_overview",
        "what_this_means",
        "attention_points",
        "next_steps_safe",
        "uncertainty_and_limits",
        "paid_deep_explanation",
      ],
      expectedSectionsAbsent: ["payment_preview_limited"],
      expectedDiagnosticCodes: ["paid_calculated_amount_blocked"],
      expectedUncertaintyPosture: "unknown",
      expectedReviewPosture: "none",
      expectedBlockedReasonCodes: [
        { sectionType: "what_this_means", codeFragment: "no_calculated_amount_extraction" },
        { sectionType: "paid_deep_explanation", codeFragment: "no_calculated_amount_extraction" },
      ],
      notes:
        "8.2F-15C: no_calculated_amount_extraction emits paid_calculated_amount_blocked in paid tier. " +
        "what_this_means and paid_deep_explanation receive blocked reason codes. " +
        "No section is fully excluded — content restricted only.",
    },

    {
      id: "eo-8-2f-5-0015-paid-invalid-free-tier",
      title: "Paid explanation: invalid tier — free_preview passed into paid mapper",
      mapperKind: "paid_explanation",
      simulationResultFixture: EMPTY_SIM,
      contractFixture: paidContract(),
      accessTierOverride: "free_preview",
      expectedSectionsPresent: [],
      expectedSectionsAbsent: [
        "document_overview",
        "payment_preview_limited",
        "what_this_means",
        "attention_points",
        "next_steps_safe",
        "paid_deep_explanation",
      ],
      expectedDiagnosticCodes: ["invalid_access_tier_for_paid_explanation_mapper"],
      expectedUncertaintyPosture: "unknown",
      expectedReviewPosture: "none",
      expectedBlockedReasonCodes: [],
      expectsZeroSections: true,
      notes:
        "When accessTier !== paid_explanation, paid mapper must return zero sections and the invalid-tier diagnostic. No throw.",
    },
  ];
