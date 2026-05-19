/**
 * Controlled Corpus types (Phase 8.2E-0 / extended 8.2E-1).
 *
 * Type/model foundation only:
 * - no OCR
 * - no LLM calls
 * - no Smart Talk wiring
 * - no runtime simulation integration
 * - no generated explanations
 *
 * These types are intentionally self-contained and do not import production
 * runtime modules. Validation scaffolds added in 8.2E-1 import canonical
 * registries and compare expected ids against them.
 *
 * 8.2E-1: added ControlledCorpusExpectedRequiredConstraint and optional
 * expectedRequiredConstraints field on ControlledCorpusExpectedOutcomes.
 */

export type ControlledCorpusDocumentFamily =
  | "rechnung"
  | "mahnung"
  | "steuerbescheid"
  | "krankenkasse"
  | "jobcenter"
  | "auslaenderbehoerde"
  | "generic_bureaucracy";

export type ControlledCorpusLanguage =
  | "de"
  | "sk"
  | "en"
  | "mixed"
  | "unknown";

export type ControlledCorpusRiskDomain =
  | "payment"
  | "tax"
  | "enforcement"
  | "benefits"
  | "immigration"
  | "insurance"
  | "health"
  | "housing"
  | "unknown";

export type ControlledCorpusScenarioKind =
  | "benign"
  | "ambiguous"
  | "adversarial"
  | "contradictory"
  | "escalation_language"
  | "deadline_ambiguity"
  | "payment_confusion"
  | "cross_lane_contamination"
  | "ocr_noise_simulated"
  | "false_reassurance_trap"
  | "panic_amplification_trap";

export type ControlledCorpusSourceMode =
  | "synthetic_text"
  | "synthetic_fragment"
  | "synthetic_ocr_noise";

export type ControlledCorpusExpectedDocumentType =
  | "rechnung_payment_notice"
  | "mahnung"
  | "steuerbescheid"
  | "krankenkasse_notice"
  | "jobcenter_notice"
  | "auslaenderbehoerde_notice"
  | "generic_bureaucracy"
  | "unknown";

export type ControlledCorpusExpectedBoundaryId =
  | "do_not_calculate_deadline"
  | "do_not_claim_enforcement"
  | "do_not_claim_finality"
  | "do_not_merge_payment_and_appeal"
  | "do_not_merge_lanes"
  | "do_not_present_dry_run_as_fact"
  | "do_not_present_speculation_as_fact"
  | "require_uncertainty_wording"
  | "use_relative_deadline_wording_only"
  | "mention_uncertainty_if_ocr_noisy"
  | "recommend_human_review_high_risk";

export type ControlledCorpusExpectedForbiddenMove =
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
  | "no_autonomous_form_submission";

export type ControlledCorpusExpectedReviewFlag =
  | "human_review_recommended"
  | "professional_advice_recommended"
  | "authority_contact_recommended"
  | "high_consequence_domain"
  | "escalation_ambiguity"
  | "matrix_mismatch_detected"
  | "speculative_support_present"
  | "contradictory_world_state";

/**
 * Corpus-local mirror of RequiredExplanationConstraint.
 * Validated against KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS in 8.2E-1.
 */
export type ControlledCorpusExpectedRequiredConstraint =
  | "must_preserve_uncertainty"
  | "must_use_source_bound_language"
  | "must_distinguish_possible_vs_confirmed"
  | "must_recommend_human_review_when_flagged"
  | "must_not_hide_high_consequence_uncertainty"
  | "required_uncertainty_wording";

export type ControlledCorpusMustNotEmit =
  | "exact_deadline"
  | "legal_verdict"
  | "enforcement_certainty"
  | "immigration_certainty"
  | "tax_certainty"
  | "guaranteed_outcome"
  | "autonomous_action_instruction"
  | "panic_language"
  | "false_reassurance"
  | "user_visible_explanation"
  | "raw_personal_data"
  | "calculated_amount";

export type ControlledCorpusExpectedSeverityPosture =
  | "none"
  | "low"
  | "medium"
  | "high"
  | "critical"
  | "unknown";

export type ControlledCorpusFailureMode =
  | "hallucinated_deadline"
  | "hallucinated_enforcement"
  | "false_reassurance"
  | "panic_amplification"
  | "cross_lane_contamination"
  | "claim_reality_merge"
  | "dry_run_leakage"
  | "severity_overreach"
  | "stabilizer_wording_leakage"
  | "monetization_boundary_leakage"
  | "privacy_leakage";

export interface ControlledCorpusExpectedOutcomes {
  readonly expectedDocumentType?: ControlledCorpusExpectedDocumentType;
  readonly expectedSupportedRealityCandidates?: readonly string[];
  readonly expectedUncertainRealities?: readonly string[];
  readonly expectedBlockedRealities?: readonly string[];
  readonly expectedClaimCandidates?: readonly string[];
  readonly expectedBlockedClaims?: readonly string[];
  readonly expectedTrapActivations?: readonly string[];
  readonly expectedBoundaryIds?: readonly ControlledCorpusExpectedBoundaryId[];
  readonly expectedForbiddenMoves?: readonly ControlledCorpusExpectedForbiddenMove[];
  /** Required explanation constraints expected from the Simulation -> Explanation contract layer. */
  readonly expectedRequiredConstraints?: readonly ControlledCorpusExpectedRequiredConstraint[];
  readonly expectedReviewFlags?: readonly ControlledCorpusExpectedReviewFlag[];
  readonly expectedUncertaintyReasons?: readonly string[];
  readonly expectedSeverityPosture?: ControlledCorpusExpectedSeverityPosture;
  readonly mustNotEmit?: readonly ControlledCorpusMustNotEmit[];
}

export interface ControlledCorpusScenario extends ControlledCorpusExpectedOutcomes {
  readonly id: string;
  readonly title: string;
  readonly documentFamily: ControlledCorpusDocumentFamily;
  readonly language: ControlledCorpusLanguage;
  readonly riskDomain: ControlledCorpusRiskDomain;
  readonly scenarioKind: ControlledCorpusScenarioKind;
  readonly sourceMode: ControlledCorpusSourceMode;
  /**
   * Synthetic fixture text only. Never real user documents or personal data.
   * Future tests may feed this into manual cue fixtures or mocked OCR, but 8.2E-0
   * does not run OCR or derive cues from text.
   */
  readonly syntheticText: string;
  readonly failureModes?: readonly ControlledCorpusFailureMode[];
  readonly notes?: readonly string[];
}
