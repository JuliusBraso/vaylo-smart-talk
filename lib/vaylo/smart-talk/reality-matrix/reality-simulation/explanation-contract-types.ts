/**
 * Simulation -> Explanation Contract types (Phase 8.2D-6).
 *
 * Type specification only:
 * - no explanation generation
 * - no Smart Talk wiring
 * - no payment validation
 * - no deadline calculation
 * - no user-visible text construction
 */

import type {
  ExplanationBoundary,
  SimulationClaimCandidate,
  SimulationRealityCandidate,
  SimulationReviewFlag,
  SimulationUncertaintyReason,
  TrapWarning,
} from "../reality-simulation-types";

export type SimulationExplanationContractVersion = "8.2d-6-simulation-explanation-contract-v1";

export type ExplanationAccessTier = "free_preview" | "paid_explanation";

export type AttentionLevelPreview = "low" | "needs_review" | "unknown";

export type ConfidencePosture = "unknown" | "limited" | "moderate";

/**
 * Safe metadata only. This type intentionally excludes exact amounts, exact dates,
 * deadlines, legal conclusions, action steps, risk-trigger names, personal data,
 * and raw document text.
 */
export interface FreePreviewFields {
  readonly documentTypeCandidate?: string;
  readonly documentTypeLabel?: string;
  readonly senderCategory?: string;
  readonly hasFinancialSignal: boolean;
  readonly hasDeadlineSignal: boolean;
  readonly attentionLevelPreview: AttentionLevelPreview;
  readonly humanReviewSuggested: boolean;
  readonly confidencePosture: ConfidencePosture;
}

export type ExplicitFinancialSignalKind =
  | "amount_mentioned"
  | "payment_requested"
  | "refund_mentioned"
  | "fee_mentioned"
  | "installment_or_direct_debit_mentioned";

/**
 * Explicit amount signal only. This contract does not permit computed totals,
 * inferred balances, or normalized payable amounts.
 */
export interface ExplicitFinancialSignal {
  readonly signalKind: ExplicitFinancialSignalKind;
  readonly explicitAmountSignalsOnly: true;
  readonly computedAmountForbidden: true;
  readonly sourceBound: true;
}

export type ExplicitDeadlineSignalKind =
  | "deadline_mentioned"
  | "relative_deadline_phrase_present"
  | "payment_due_date_mentioned"
  | "appeal_or_objection_deadline_mentioned";

/**
 * Explicit deadline mention only. This contract does not permit calculated
 * deadline dates or inferred legal timing.
 */
export interface ExplicitDeadlineSignal {
  readonly signalKind: ExplicitDeadlineSignalKind;
  readonly deadlineMentioned: boolean;
  readonly explicitDeadlineTextPresent: boolean;
  readonly relativeDeadlinePhrasePresent: boolean;
  readonly deadlineCalculationForbidden: boolean;
  readonly calculatedDeadline?: never;
}

export type InstitutionSignal =
  | "tax_authority"
  | "benefits_authority"
  | "insurance_provider"
  | "housing_or_rent_context"
  | "court_or_enforcement_context"
  | "private_invoice_sender"
  | "unknown_institution";

/**
 * Deeper structured data that may be made available to a future paid explanation layer.
 * Still bounded: no calculated deadlines, no generated prose, no legal verdicts, and no
 * unrestricted extraction.
 */
export interface PaidExplanationFields {
  readonly explicitFinancialSignalsOnly: readonly ExplicitFinancialSignal[];
  readonly explicitDeadlineMentionsOnly: readonly ExplicitDeadlineSignal[];
  readonly institutionSignals: readonly InstitutionSignal[];
  readonly authorizedClaimCandidates: readonly SimulationClaimCandidate[];
  readonly supportedRealityCandidates: readonly SimulationRealityCandidate[];
  readonly uncertaintyReasons: readonly SimulationUncertaintyReason[];
  readonly boundaryIds: readonly ExplanationBoundary[];
  readonly reviewFlags: readonly SimulationReviewFlag[];
  readonly trapWarningIds: readonly TrapWarning["trapId"][];
}

export type ForbiddenExplanationMove =
  | "no_definitive_legal_verdicts"
  | "no_deadline_calculation_when_forbidden"
  | "no_enforcement_claim_when_forbidden"
  | "no_high_panic_phrasing"
  | "no_dry_run_as_fact"
  | "no_speculation_as_fact"
  | "no_cross_lane_merging"
  | "no_tax_certainty"
  | "no_immigration_certainty"
  | "no_guaranteed_outcomes"
  | "no_autonomous_form_submission"
  /**
   * 8.2F-15A: The explanation layer must not reassure the user that a risk is
   * absent, harmless, resolved, forgiven, stopped, unenforceable, or safe unless
   * explicitly supported by validated evidence and permitted by future policy.
   */
  | "no_false_reassurance_framing"
  /**
   * 8.2F-15A: The explanation layer must not calculate, derive, infer, total,
   * split, convert, estimate, or reconstruct monetary amounts from uncertain text,
   * OCR fragments, partial documents, or unsupported cues.
   */
  | "no_calculated_amount_extraction";

/**
 * Runtime-enumerable registry of every live `ForbiddenExplanationMove` token (8.2D-6B).
 *
 * TypeScript unions cannot be iterated at runtime; this constant fills that gap for
 * validator cross-checks, regression scaffolds, and future drift detection.
 *
 * INVARIANT: must contain exactly the members of `ForbiddenExplanationMove`.
 * The `satisfies readonly ForbiddenExplanationMove[]` constraint enforces this at
 * compile time, making any missing or extra entry a TypeScript error.
 */
export const KNOWN_FORBIDDEN_EXPLANATION_MOVES = [
  "no_definitive_legal_verdicts",
  "no_deadline_calculation_when_forbidden",
  "no_enforcement_claim_when_forbidden",
  "no_high_panic_phrasing",
  "no_dry_run_as_fact",
  "no_speculation_as_fact",
  "no_cross_lane_merging",
  "no_tax_certainty",
  "no_immigration_certainty",
  "no_guaranteed_outcomes",
  "no_autonomous_form_submission",
  // 8.2F-15A: dedicated moves replacing proxy coverage for false_reassurance and calculated_amount
  "no_false_reassurance_framing",
  "no_calculated_amount_extraction",
] as const satisfies readonly ForbiddenExplanationMove[];

export type RequiredExplanationConstraint =
  | "must_preserve_uncertainty"
  | "must_use_source_bound_language"
  | "must_distinguish_possible_vs_confirmed"
  | "must_recommend_human_review_when_flagged"
  | "must_not_hide_high_consequence_uncertainty"
  | "required_uncertainty_wording";

/**
 * Runtime-enumerable registry of every live `RequiredExplanationConstraint` token (8.2D-6B).
 *
 * Same pattern as `KNOWN_FORBIDDEN_EXPLANATION_MOVES`: closes the union-enumerability gap and
 * keeps the canonical token list in a single authoritative location.
 *
 * INVARIANT: must contain exactly the members of `RequiredExplanationConstraint`.
 */
export const KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS = [
  "must_preserve_uncertainty",
  "must_use_source_bound_language",
  "must_distinguish_possible_vs_confirmed",
  "must_recommend_human_review_when_flagged",
  "must_not_hide_high_consequence_uncertainty",
  "required_uncertainty_wording",
] as const satisfies readonly RequiredExplanationConstraint[];

export type UncertaintyRequirement =
  | "preserve_simulation_uncertainty_reasons"
  | "surface_unknown_or_limited_confidence"
  | "do_not_convert_review_flags_to_certainty"
  | "do_not_resolve_conflicts_without_source_authority"
  | "do_not_treat_trap_warnings_as_confirmed_events";

export interface SimulationExplanationContractBase {
  readonly contractVersion: SimulationExplanationContractVersion;
  readonly sourceSimulationVersion?: string;
  readonly accessTier: ExplanationAccessTier;
  readonly freePreviewFields: FreePreviewFields;
  readonly forbiddenExplanationMoves: readonly ForbiddenExplanationMove[];
  readonly requiredExplanationConstraints: readonly RequiredExplanationConstraint[];
  readonly uncertaintyRequirements: readonly UncertaintyRequirement[];
  readonly auditTraceRef?: string;
}

export interface FreePreviewSimulationExplanationContract extends SimulationExplanationContractBase {
  readonly accessTier: "free_preview";
  readonly paidExplanationFields?: never;
}

export interface PaidSimulationExplanationContract extends SimulationExplanationContractBase {
  readonly accessTier: "paid_explanation";
  readonly paidExplanationFields: PaidExplanationFields;
}

/**
 * Strict boundary between Reality Simulation and a future explanation layer.
 *
 * This is a data contract, not a builder or runtime pipeline. The discriminated
 * union ensures a free preview cannot carry paid fields.
 */
export type SimulationExplanationContract =
  | FreePreviewSimulationExplanationContract
  | PaidSimulationExplanationContract;
