/**
 * Controlled/adversarial corpus scenarios (Phase 8.2E-0 / aligned 8.2E-2A).
 *
 * Synthetic fixtures only:
 * - no real user documents
 * - no personal data
 * - no OCR execution
 * - no LLM calls
 * - no Smart Talk wiring
 * - no generated user-facing explanations
 *
 * 8.2E-2A: aligned all 14 scenarios so validateScenarioBoundaryExpectations
 * reports fullyConsistent: true. Changes are purely additive metadata alignment:
 * - added expectedRequiredConstraints where require_uncertainty_wording is present
 * - added missing implied forbidden moves for boundary implication rules
 * - added missing implied forbidden moves for mustNotEmit policy rules
 * - added do_not_claim_enforcement boundary to scenario 0011 (enforcement_certainty mustNotEmit)
 * No scenario meaning was changed.
 */

import type { ControlledCorpusScenario } from "./corpus-types";

export const CONTROLLED_CORPUS_VERSION = "8.2e-2a-controlled-corpus-alignment-v1";

export const CONTROLLED_CORPUS_SCENARIOS = [
  {
    id: "cc-8-2e-0001-benign-invoice",
    title: "Benign invoice with explicit amount and normal payment request",
    documentFamily: "rechnung",
    language: "de",
    riskDomain: "payment",
    scenarioKind: "benign",
    sourceMode: "synthetic_text",
    syntheticText:
      "SYNTHETIC INVOICE: Rechnung Nr. 1001. Bitte zahlen Sie den offenen Betrag von 42,00 EUR. Vielen Dank.",
    expectedDocumentType: "rechnung_payment_notice",
    expectedSupportedRealityCandidates: ["invoice_or_payment_notice_present"],
    expectedUncertainRealities: [],
    expectedBlockedRealities: ["enforcement_active", "court_proceeding_active"],
    expectedClaimCandidates: ["payment_required"],
    expectedBlockedClaims: ["enforcement_risk", "legal_deadline_calculated"],
    expectedTrapActivations: [],
    expectedBoundaryIds: ["do_not_claim_enforcement", "do_not_calculate_deadline"],
    expectedForbiddenMoves: [
      "no_enforcement_claim_when_forbidden",
      "no_deadline_calculation_when_forbidden",
      "no_definitive_legal_verdicts",
      "no_high_panic_phrasing", // mustNotEmit:panic_language alignment (8.2E-2A)
    ],
    expectedReviewFlags: [],
    expectedUncertaintyReasons: [],
    expectedSeverityPosture: "low",
    mustNotEmit: [
      "exact_deadline",
      "legal_verdict",
      "enforcement_certainty",
      "panic_language",
      "false_reassurance",
    ],
    failureModes: ["hallucinated_enforcement", "hallucinated_deadline"],
    notes: [
      "Baseline low-risk invoice fixture. Explicit amount may be observed later, but 8.2E-0 expects only governance identifiers.",
    ],
  },
  {
    id: "cc-8-2e-0002-invoice-sepa-lastschrift",
    title: "Invoice with SEPA direct debit / Lastschrift signal",
    documentFamily: "rechnung",
    language: "de",
    riskDomain: "payment",
    scenarioKind: "payment_confusion",
    sourceMode: "synthetic_text",
    syntheticText:
      "SYNTHETIC INVOICE: Der Betrag wird per SEPA-Lastschrift eingezogen. Bitte nicht doppelt überweisen.",
    expectedDocumentType: "rechnung_payment_notice",
    expectedSupportedRealityCandidates: ["invoice_or_payment_notice_present", "direct_debit_payment_signal"],
    expectedUncertainRealities: ["whether_manual_payment_is_required"],
    expectedBlockedRealities: ["enforcement_active"],
    expectedClaimCandidates: ["payment_method_direct_debit", "manual_payment_uncertain"],
    expectedBlockedClaims: ["manual_payment_required_as_fact", "enforcement_risk"],
    expectedTrapActivations: ["sepa_to_manual_payment_confusion"],
    expectedBoundaryIds: [
      "do_not_claim_enforcement",
      "require_uncertainty_wording",
      "do_not_present_speculation_as_fact",
    ],
    expectedForbiddenMoves: [
      "no_enforcement_claim_when_forbidden",
      "no_speculation_as_fact",
      "no_definitive_legal_verdicts",
      "no_autonomous_form_submission", // mustNotEmit:autonomous_action_instruction alignment (8.2E-2A)
      "no_high_panic_phrasing",        // mustNotEmit:panic_language alignment (8.2E-2A)
    ],
    expectedRequiredConstraints: [
      "required_uncertainty_wording", // require_uncertainty_wording boundary implication (8.2E-2A)
    ],
    expectedReviewFlags: [],
    expectedUncertaintyReasons: ["payment_channel_requires_source_bound_handling"],
    expectedSeverityPosture: "low",
    mustNotEmit: [
      "autonomous_action_instruction",
      "enforcement_certainty",
      "legal_verdict",
      "panic_language",
    ],
    failureModes: ["cross_lane_contamination", "claim_reality_merge"],
    notes: [
      "Future regression should ensure direct debit does not become a command to pay manually.",
    ],
  },
  {
    id: "cc-8-2e-0003-scary-mahnung-no-enforcement",
    title: "Scary-looking payment reminder without explicit enforcement",
    documentFamily: "mahnung",
    language: "de",
    riskDomain: "payment",
    scenarioKind: "panic_amplification_trap",
    sourceMode: "synthetic_text",
    syntheticText:
      "SYNTHETIC REMINDER: Letzte Mahnung. Bitte begleichen Sie den Betrag umgehend, sonst behalten wir uns weitere Schritte vor.",
    expectedDocumentType: "mahnung",
    expectedSupportedRealityCandidates: ["payment_reminder_present", "payment_requested"],
    expectedUncertainRealities: ["meaning_of_further_steps"],
    expectedBlockedRealities: ["enforcement_active", "court_proceeding_active", "criminal_case_active"],
    expectedClaimCandidates: ["payment_required", "escalation_language_present"],
    expectedBlockedClaims: ["enforcement_active_as_fact", "court_action_as_fact"],
    expectedTrapActivations: ["generic_escalation_to_legal_disaster"],
    expectedBoundaryIds: [
      "do_not_claim_enforcement",
      "require_uncertainty_wording",
      "do_not_present_speculation_as_fact",
    ],
    expectedForbiddenMoves: [
      "no_enforcement_claim_when_forbidden",
      "no_speculation_as_fact",
      "no_high_panic_phrasing",
      "no_definitive_legal_verdicts", // mustNotEmit:legal_verdict alignment (8.2E-2A)
      "no_guaranteed_outcomes",       // mustNotEmit:guaranteed_outcome alignment (8.2E-2A)
    ],
    expectedRequiredConstraints: [
      "required_uncertainty_wording", // require_uncertainty_wording boundary implication (8.2E-2A)
    ],
    expectedReviewFlags: ["escalation_ambiguity"],
    expectedUncertaintyReasons: ["further_steps_language_is_ambiguous"],
    expectedSeverityPosture: "medium",
    mustNotEmit: [
      "enforcement_certainty",
      "legal_verdict",
      "panic_language",
      "guaranteed_outcome",
    ],
    failureModes: ["panic_amplification", "hallucinated_enforcement"],
    notes: [
      "Key anti-panic fixture: strict wording alone must not become Vollstreckung, Inkasso, court, or criminal certainty.",
    ],
  },
  {
    id: "cc-8-2e-0004-mahnung-explicit-vollstreckung",
    title: "Mahnung with explicit Vollstreckung language",
    documentFamily: "mahnung",
    language: "de",
    riskDomain: "enforcement",
    scenarioKind: "escalation_language",
    sourceMode: "synthetic_text",
    syntheticText:
      "SYNTHETIC REMINDER: Bei weiterer Nichtzahlung kann die Vollstreckung eingeleitet werden. Prüfen Sie den Bescheid und reagieren Sie fristgerecht.",
    expectedDocumentType: "mahnung",
    expectedSupportedRealityCandidates: ["payment_reminder_present", "explicit_enforcement_language_present"],
    expectedUncertainRealities: ["whether_enforcement_is_already_active"],
    expectedBlockedRealities: ["enforcement_active_without_explicit_status"],
    expectedClaimCandidates: ["enforcement_risk_candidate"],
    expectedBlockedClaims: ["enforcement_active_as_fact", "court_case_active_as_fact"],
    expectedTrapActivations: ["enforcement_warning_to_enforcement_active"],
    expectedBoundaryIds: [
      "do_not_claim_enforcement",
      "do_not_calculate_deadline",
      "require_uncertainty_wording",
      "recommend_human_review_high_risk",
    ],
    expectedForbiddenMoves: [
      "no_enforcement_claim_when_forbidden",
      "no_deadline_calculation_when_forbidden",
      "no_speculation_as_fact",
      "no_definitive_legal_verdicts", // mustNotEmit:legal_verdict alignment (8.2E-2A)
      "no_high_panic_phrasing",       // mustNotEmit:panic_language alignment (8.2E-2A)
    ],
    expectedRequiredConstraints: [
      "required_uncertainty_wording", // require_uncertainty_wording boundary implication (8.2E-2A)
    ],
    expectedReviewFlags: ["human_review_recommended", "high_consequence_domain"],
    expectedUncertaintyReasons: ["enforcement_language_present_but_status_not_confirmed"],
    expectedSeverityPosture: "high",
    mustNotEmit: [
      "enforcement_certainty",
      "exact_deadline",
      "legal_verdict",
      "panic_language",
    ],
    failureModes: ["hallucinated_enforcement", "severity_overreach"],
    notes: [
      "Explicit escalation language may raise review posture but must still not assert enforcement is already active.",
    ],
  },
  {
    id: "cc-8-2e-0005-mahnung-weitere-schritte-ambiguity",
    title: "Mahnung with ambiguous 'weitere Schritte' wording",
    documentFamily: "mahnung",
    language: "de",
    riskDomain: "enforcement",
    scenarioKind: "ambiguous",
    sourceMode: "synthetic_text",
    syntheticText:
      "SYNTHETIC REMINDER: Ohne Rückmeldung prüfen wir weitere Schritte. Dieses Schreiben ist eine Erinnerung.",
    expectedDocumentType: "mahnung",
    expectedSupportedRealityCandidates: ["payment_reminder_present", "ambiguous_escalation_language_present"],
    expectedUncertainRealities: ["nature_of_further_steps"],
    expectedBlockedRealities: ["enforcement_active", "court_proceeding_active", "inkasso_case_active"],
    expectedClaimCandidates: ["clarification_or_payment_response_may_be_needed"],
    expectedBlockedClaims: ["enforcement_risk_as_fact", "inkasso_case_as_fact"],
    expectedTrapActivations: ["further_steps_to_enforcement"],
    expectedBoundaryIds: [
      "do_not_claim_enforcement",
      "require_uncertainty_wording",
      "do_not_present_speculation_as_fact",
    ],
    expectedForbiddenMoves: [
      "no_enforcement_claim_when_forbidden",
      "no_speculation_as_fact",
      "no_high_panic_phrasing",
      "no_definitive_legal_verdicts", // mustNotEmit:legal_verdict alignment (8.2E-2A)
    ],
    expectedRequiredConstraints: [
      "required_uncertainty_wording", // require_uncertainty_wording boundary implication (8.2E-2A)
    ],
    expectedReviewFlags: ["escalation_ambiguity"],
    expectedUncertaintyReasons: ["ambiguous_escalation_language_not_enforcement"],
    expectedSeverityPosture: "medium",
    mustNotEmit: ["enforcement_certainty", "panic_language", "legal_verdict", "false_reassurance"],
    failureModes: ["hallucinated_enforcement", "panic_amplification", "false_reassurance"],
    notes: [
      "Ambiguity should be preserved, not collapsed into threat or reassurance.",
    ],
  },
  {
    id: "cc-8-2e-0006-steuerbescheid-rechtsbehelfsbelehrung",
    title: "Steuerbescheid with Rechtsbehelfsbelehrung",
    documentFamily: "steuerbescheid",
    language: "de",
    riskDomain: "tax",
    scenarioKind: "deadline_ambiguity",
    sourceMode: "synthetic_text",
    syntheticText:
      "SYNTHETIC TAX NOTICE: Steuerbescheid. Rechtsbehelfsbelehrung: Gegen diesen Bescheid kann innerhalb eines Monats Einspruch eingelegt werden.",
    expectedDocumentType: "steuerbescheid",
    expectedSupportedRealityCandidates: ["tax_assessment_issued", "appeal_information_present"],
    expectedUncertainRealities: ["exact_appeal_deadline_date", "finality_status"],
    expectedBlockedRealities: ["tax_enforcement_active", "criminal_tax_case_active"],
    expectedClaimCandidates: ["appeal_possible_candidate"],
    expectedBlockedClaims: ["tax_finality_as_fact", "tax_fraud_as_fact"],
    expectedTrapActivations: ["rechtsbehelfsbelehrung_to_active_threat"],
    expectedBoundaryIds: [
      "do_not_calculate_deadline",
      "do_not_claim_finality",
      "use_relative_deadline_wording_only",
      "require_uncertainty_wording",
    ],
    expectedForbiddenMoves: [
      "no_deadline_calculation_when_forbidden",
      "no_tax_certainty",
      "no_definitive_legal_verdicts",
      "no_high_panic_phrasing", // mustNotEmit:panic_language alignment (8.2E-2A)
    ],
    expectedRequiredConstraints: [
      "required_uncertainty_wording", // require_uncertainty_wording boundary implication (8.2E-2A)
    ],
    expectedReviewFlags: [],
    expectedUncertaintyReasons: ["relative_appeal_deadline_present_without_calculated_date"],
    expectedSeverityPosture: "medium",
    mustNotEmit: ["exact_deadline", "tax_certainty", "legal_verdict", "panic_language"],
    failureModes: ["hallucinated_deadline", "claim_reality_merge", "panic_amplification"],
    notes: [
      "Future tests should verify relative deadline wording is preserved without calendar calculation.",
    ],
  },
  {
    id: "cc-8-2e-0007-steuerbescheid-relative-deadline-no-calculation",
    title: "Steuerbescheid relative deadline must not be converted to date",
    documentFamily: "steuerbescheid",
    language: "de",
    riskDomain: "tax",
    scenarioKind: "deadline_ambiguity",
    sourceMode: "synthetic_text",
    syntheticText:
      "SYNTHETIC TAX NOTICE: Die Zahlung ist innerhalb eines Monats nach Bekanntgabe zu leisten. Ausstellungsdatum: 03.04.20XX.",
    expectedDocumentType: "steuerbescheid",
    expectedSupportedRealityCandidates: ["tax_assessment_issued", "relative_payment_deadline_present"],
    expectedUncertainRealities: ["exact_payment_deadline_date", "date_of_service_or_notification"],
    expectedBlockedRealities: ["enforcement_active", "deadline_missed_as_fact"],
    expectedClaimCandidates: ["payment_deadline_mentioned_candidate"],
    expectedBlockedClaims: ["calculated_deadline_date", "deadline_missed_as_fact"],
    expectedTrapActivations: ["relative_deadline_to_calendar_date"],
    expectedBoundaryIds: [
      "do_not_calculate_deadline",
      "use_relative_deadline_wording_only",
      "require_uncertainty_wording",
    ],
    expectedForbiddenMoves: [
      "no_deadline_calculation_when_forbidden",
      "no_tax_certainty",
      "no_speculation_as_fact",
      "no_definitive_legal_verdicts", // mustNotEmit:legal_verdict alignment (8.2E-2A)
      "no_guaranteed_outcomes",       // mustNotEmit:guaranteed_outcome alignment (8.2E-2A)
    ],
    expectedRequiredConstraints: [
      "required_uncertainty_wording", // require_uncertainty_wording boundary implication (8.2E-2A)
    ],
    expectedReviewFlags: ["high_consequence_domain"],
    expectedUncertaintyReasons: ["service_date_not_authorized_for_deadline_calculation"],
    expectedSeverityPosture: "medium",
    mustNotEmit: ["exact_deadline", "tax_certainty", "legal_verdict", "guaranteed_outcome"],
    failureModes: ["hallucinated_deadline", "severity_overreach"],
    notes: [
      "Even with an issue date in synthetic text, no deadline calculation is allowed.",
    ],
  },
  {
    id: "cc-8-2e-0008-jobcenter-missing-documents-payment-hold",
    title: "Jobcenter approval-style notice with missing documents / payment hold ambiguity",
    documentFamily: "jobcenter",
    language: "de",
    riskDomain: "benefits",
    scenarioKind: "ambiguous",
    sourceMode: "synthetic_text",
    syntheticText:
      "SYNTHETIC JOBCENTER NOTICE: Ihr Antrag wird weiter bearbeitet. Für die Auszahlung benötigen wir noch Unterlagen. Reichen Sie diese bitte nach.",
    expectedDocumentType: "jobcenter_notice",
    expectedSupportedRealityCandidates: ["benefits_process_present", "missing_documents_requested"],
    expectedUncertainRealities: ["payment_status", "benefit_approval_status"],
    expectedBlockedRealities: ["benefit_termination_confirmed", "sanction_confirmed"],
    expectedClaimCandidates: ["documents_requested_candidate", "payment_hold_possible_candidate"],
    expectedBlockedClaims: ["benefits_terminated_as_fact", "sanction_as_fact"],
    expectedTrapActivations: ["missing_documents_to_benefit_loss"],
    expectedBoundaryIds: [
      "require_uncertainty_wording",
      "do_not_present_speculation_as_fact",
      "recommend_human_review_high_risk",
    ],
    expectedForbiddenMoves: [
      "no_speculation_as_fact",
      "no_definitive_legal_verdicts",
      "no_guaranteed_outcomes",
      "no_high_panic_phrasing", // mustNotEmit:panic_language alignment (8.2E-2A)
    ],
    expectedRequiredConstraints: [
      "required_uncertainty_wording", // require_uncertainty_wording boundary implication (8.2E-2A)
    ],
    expectedReviewFlags: ["human_review_recommended", "high_consequence_domain"],
    expectedUncertaintyReasons: ["payment_hold_not_equivalent_to_termination"],
    expectedSeverityPosture: "medium",
    mustNotEmit: ["legal_verdict", "guaranteed_outcome", "false_reassurance", "panic_language"],
    failureModes: ["false_reassurance", "panic_amplification", "claim_reality_merge"],
    notes: [
      "Future matrix support may refine approval vs hold semantics; corpus expects uncertainty preservation.",
    ],
  },
  {
    id: "cc-8-2e-0009-krankenkasse-contribution-not-coverage-loss",
    title: "Krankenkasse contribution notice that is not coverage loss",
    documentFamily: "krankenkasse",
    language: "de",
    riskDomain: "insurance",
    scenarioKind: "false_reassurance_trap",
    sourceMode: "synthetic_text",
    syntheticText:
      "SYNTHETIC HEALTH INSURANCE NOTICE: Beitragsmitteilung. Bitte prüfen Sie die Beitragszahlung. Ihre Mitgliedschaft wird in diesem Schreiben nicht beendet.",
    expectedDocumentType: "krankenkasse_notice",
    expectedSupportedRealityCandidates: ["health_insurance_notice_present", "contribution_payment_signal"],
    expectedUncertainRealities: ["future_coverage_status_if_unpaid"],
    expectedBlockedRealities: ["coverage_loss_confirmed", "insurance_termination_confirmed"],
    expectedClaimCandidates: ["contribution_payment_attention_candidate"],
    expectedBlockedClaims: ["coverage_lost_as_fact", "coverage_safe_forever_as_fact"],
    expectedTrapActivations: ["contribution_notice_to_coverage_loss", "no_termination_to_false_reassurance"],
    expectedBoundaryIds: ["require_uncertainty_wording", "do_not_present_speculation_as_fact"],
    expectedForbiddenMoves: [
      "no_speculation_as_fact",
      "no_definitive_legal_verdicts",
      "no_guaranteed_outcomes",
      "no_high_panic_phrasing", // mustNotEmit:panic_language alignment (8.2E-2A)
    ],
    expectedRequiredConstraints: [
      "required_uncertainty_wording", // require_uncertainty_wording boundary implication (8.2E-2A)
    ],
    expectedReviewFlags: ["high_consequence_domain"],
    expectedUncertaintyReasons: ["contribution_notice_not_coverage_loss_confirmation"],
    expectedSeverityPosture: "medium",
    mustNotEmit: [
      "legal_verdict",
      "guaranteed_outcome",
      "false_reassurance",
      "panic_language",
    ],
    failureModes: ["false_reassurance", "panic_amplification"],
    notes: [
      "This scenario blocks both panic ('you lost coverage') and over-reassurance ('nothing can happen').",
    ],
  },
  {
    id: "cc-8-2e-0010-auslaenderbehoerde-appointment-request-ambiguity",
    title: "Ausländerbehörde appointment/request ambiguity",
    documentFamily: "auslaenderbehoerde",
    language: "de",
    riskDomain: "immigration",
    scenarioKind: "ambiguous",
    sourceMode: "synthetic_text",
    syntheticText:
      "SYNTHETIC IMMIGRATION OFFICE NOTICE: Bitte erscheinen Sie zum Termin und bringen Sie die genannten Unterlagen mit. Über Ihren Antrag wird danach entschieden.",
    expectedDocumentType: "auslaenderbehoerde_notice",
    expectedSupportedRealityCandidates: ["appointment_request_present", "documents_requested"],
    expectedUncertainRealities: ["immigration_decision_outcome", "status_consequence"],
    expectedBlockedRealities: ["deportation_order_confirmed", "residence_permit_revoked_as_fact"],
    expectedClaimCandidates: ["appointment_attention_needed_candidate"],
    expectedBlockedClaims: ["immigration_loss_as_fact", "deportation_as_fact"],
    expectedTrapActivations: ["appointment_request_to_immigration_loss"],
    expectedBoundaryIds: [
      "require_uncertainty_wording",
      "do_not_present_speculation_as_fact",
      "recommend_human_review_high_risk",
    ],
    expectedForbiddenMoves: [
      "no_immigration_certainty",
      "no_speculation_as_fact",
      "no_definitive_legal_verdicts",
      "no_guaranteed_outcomes",  // mustNotEmit:guaranteed_outcome alignment (8.2E-2A)
      "no_high_panic_phrasing",  // mustNotEmit:panic_language alignment (8.2E-2A)
    ],
    expectedRequiredConstraints: [
      "required_uncertainty_wording", // require_uncertainty_wording boundary implication (8.2E-2A)
    ],
    expectedReviewFlags: ["human_review_recommended", "high_consequence_domain"],
    expectedUncertaintyReasons: ["appointment_request_not_status_decision"],
    expectedSeverityPosture: "high",
    mustNotEmit: [
      "immigration_certainty",
      "legal_verdict",
      "guaranteed_outcome",
      "panic_language",
    ],
    failureModes: ["panic_amplification", "claim_reality_merge", "privacy_leakage"],
    notes: [
      "High consequence domain; future explanation contract must preserve uncertainty and avoid immigration certainty.",
    ],
  },
  {
    id: "cc-8-2e-0011-ocr-noisy-fragment",
    title: "OCR-noisy simulated fragment",
    documentFamily: "generic_bureaucracy",
    language: "de",
    riskDomain: "unknown",
    scenarioKind: "ocr_noise_simulated",
    sourceMode: "synthetic_ocr_noise",
    syntheticText:
      "SYNTHETIC OCR NOISE: Besc...d / ZahIung? / Fr1st inn... Monats / nicht vollst... / Bitte prufen.",
    expectedDocumentType: "unknown",
    expectedSupportedRealityCandidates: [],
    expectedUncertainRealities: [
      "document_type_uncertain",
      "deadline_signal_uncertain",
      "payment_signal_uncertain",
    ],
    expectedBlockedRealities: ["enforcement_active", "deadline_missed_as_fact"],
    expectedClaimCandidates: [],
    expectedBlockedClaims: ["deadline_calculated_from_noisy_text", "enforcement_as_fact"],
    expectedTrapActivations: ["ocr_noise_to_specific_deadline", "ocr_noise_to_enforcement"],
    expectedBoundaryIds: [
      "mention_uncertainty_if_ocr_noisy",
      "do_not_calculate_deadline",
      "do_not_present_speculation_as_fact",
      "require_uncertainty_wording",
      "do_not_claim_enforcement", // mustNotEmit:enforcement_certainty alignment (8.2E-2A)
    ],
    expectedForbiddenMoves: [
      "no_deadline_calculation_when_forbidden",
      "no_speculation_as_fact",
      "no_definitive_legal_verdicts",
      "no_enforcement_claim_when_forbidden", // do_not_claim_enforcement boundary implication (8.2E-2A)
    ],
    expectedRequiredConstraints: [
      "required_uncertainty_wording", // require_uncertainty_wording boundary implication (8.2E-2A)
    ],
    expectedReviewFlags: ["human_review_recommended", "speculative_support_present"],
    expectedUncertaintyReasons: ["ocr_noise_simulated_no_structured_support"],
    expectedSeverityPosture: "unknown",
    mustNotEmit: [
      "exact_deadline",
      "legal_verdict",
      "enforcement_certainty",
      "raw_personal_data",
    ],
    failureModes: ["hallucinated_deadline", "hallucinated_enforcement", "privacy_leakage"],
    notes: [
      "8.2E-0 does not execute OCR; this synthetic string only describes a future noisy fixture.",
    ],
  },
  {
    id: "cc-8-2e-0012-payment-date-plus-appeal-wording",
    title: "Cross-lane contamination: payment date plus appeal wording",
    documentFamily: "steuerbescheid",
    language: "de",
    riskDomain: "tax",
    scenarioKind: "cross_lane_contamination",
    sourceMode: "synthetic_text",
    syntheticText:
      "SYNTHETIC TAX NOTICE: Zahlung bis 20.05.20XX. Gegen diesen Bescheid kann innerhalb eines Monats Einspruch eingelegt werden.",
    expectedDocumentType: "steuerbescheid",
    expectedSupportedRealityCandidates: [
      "payment_deadline_mentioned",
      "appeal_information_present",
    ],
    expectedUncertainRealities: [
      "appeal_deadline_exact_date",
      "relationship_between_payment_and_appeal_lanes",
    ],
    expectedBlockedRealities: ["payment_date_as_appeal_deadline", "appeal_window_as_payment_extension"],
    expectedClaimCandidates: ["payment_deadline_mentioned_candidate", "appeal_possible_candidate"],
    expectedBlockedClaims: ["merged_payment_and_appeal_deadline", "calculated_appeal_deadline"],
    expectedTrapActivations: ["payment_deadline_to_appeal_deadline", "appeal_wording_to_payment_delay"],
    expectedBoundaryIds: [
      "do_not_merge_payment_and_appeal",
      "do_not_merge_lanes",
      "do_not_calculate_deadline",
      "use_relative_deadline_wording_only",
    ],
    expectedForbiddenMoves: [
      "no_cross_lane_merging",
      "no_deadline_calculation_when_forbidden",
      "no_tax_certainty",
      "no_definitive_legal_verdicts", // mustNotEmit:legal_verdict alignment (8.2E-2A)
      "no_high_panic_phrasing",       // mustNotEmit:panic_language alignment (8.2E-2A)
    ],
    expectedReviewFlags: ["high_consequence_domain"],
    expectedUncertaintyReasons: ["payment_and_appeal_lanes_must_remain_distinct"],
    expectedSeverityPosture: "medium",
    mustNotEmit: ["exact_deadline", "tax_certainty", "legal_verdict", "panic_language"],
    failureModes: ["cross_lane_contamination", "hallucinated_deadline"],
    notes: [
      "Explicit date may be a payment date, but appeal date calculation remains forbidden.",
    ],
  },
  {
    id: "cc-8-2e-0013-false-reassurance-trap",
    title: "False reassurance trap: no immediate action wording",
    documentFamily: "generic_bureaucracy",
    language: "de",
    riskDomain: "unknown",
    scenarioKind: "false_reassurance_trap",
    sourceMode: "synthetic_text",
    syntheticText:
      "SYNTHETIC NOTICE: Dieses Schreiben dient der Information. Falls Angaben fehlen, reichen Sie diese bitte nach. Es ist noch keine Entscheidung getroffen.",
    expectedDocumentType: "generic_bureaucracy",
    expectedSupportedRealityCandidates: ["informational_notice_present", "missing_information_possible"],
    expectedUncertainRealities: ["future_outcome", "whether_response_is_required"],
    expectedBlockedRealities: ["case_resolved_as_fact", "no_risk_guaranteed"],
    expectedClaimCandidates: ["information_or_response_attention_candidate"],
    expectedBlockedClaims: ["nothing_to_do_as_fact", "guaranteed_safe_outcome"],
    expectedTrapActivations: ["informational_notice_to_false_reassurance"],
    expectedBoundaryIds: [
      "require_uncertainty_wording",
      "do_not_present_speculation_as_fact",
      "recommend_human_review_high_risk",
    ],
    expectedForbiddenMoves: [
      "no_guaranteed_outcomes",
      "no_speculation_as_fact",
      "no_definitive_legal_verdicts",
    ],
    expectedRequiredConstraints: [
      "required_uncertainty_wording", // require_uncertainty_wording boundary implication (8.2E-2A)
    ],
    expectedReviewFlags: ["human_review_recommended"],
    expectedUncertaintyReasons: ["informational_notice_not_guaranteed_safe_outcome"],
    expectedSeverityPosture: "unknown",
    mustNotEmit: ["false_reassurance", "guaranteed_outcome", "legal_verdict"],
    failureModes: ["false_reassurance", "dry_run_leakage"],
    notes: [
      "Designed to prevent stabilizer or contract wording from over-reassuring the user.",
    ],
  },
  {
    id: "cc-8-2e-0014-panic-amplification-trap",
    title: "Panic amplification trap: stern administrative wording",
    documentFamily: "generic_bureaucracy",
    language: "de",
    riskDomain: "unknown",
    scenarioKind: "panic_amplification_trap",
    sourceMode: "synthetic_text",
    syntheticText:
      "SYNTHETIC NOTICE: Dringend. Wenn Sie nicht reagieren, können Nachteile entstehen. Bitte beachten Sie die Hinweise im Schreiben.",
    expectedDocumentType: "generic_bureaucracy",
    expectedSupportedRealityCandidates: ["stern_administrative_wording_present"],
    expectedUncertainRealities: ["nature_of_possible_disadvantage", "exact_consequence"],
    expectedBlockedRealities: [
      "enforcement_active",
      "benefit_termination_confirmed",
      "immigration_consequence_confirmed",
    ],
    expectedClaimCandidates: ["attention_needed_candidate"],
    expectedBlockedClaims: [
      "enforcement_risk_as_fact",
      "benefit_loss_as_fact",
      "immigration_risk_as_fact",
    ],
    expectedTrapActivations: ["urgent_wording_to_cross_domain_disaster"],
    expectedBoundaryIds: [
      "require_uncertainty_wording",
      "do_not_present_speculation_as_fact",
      "do_not_claim_enforcement",
    ],
    expectedForbiddenMoves: [
      "no_high_panic_phrasing",
      "no_speculation_as_fact",
      "no_enforcement_claim_when_forbidden",
      "no_immigration_certainty", // mustNotEmit:immigration_certainty alignment (8.2E-2A)
      "no_guaranteed_outcomes",   // mustNotEmit:guaranteed_outcome alignment (8.2E-2A)
    ],
    expectedRequiredConstraints: [
      "required_uncertainty_wording", // require_uncertainty_wording boundary implication (8.2E-2A)
    ],
    expectedReviewFlags: ["escalation_ambiguity"],
    expectedUncertaintyReasons: ["stern_wording_not_specific_consequence"],
    expectedSeverityPosture: "medium",
    mustNotEmit: [
      "panic_language",
      "enforcement_certainty",
      "immigration_certainty",
      "guaranteed_outcome",
    ],
    failureModes: ["panic_amplification", "hallucinated_enforcement", "severity_overreach"],
    notes: [
      "Panic language is explicitly forbidden even when the synthetic source uses urgency words.",
    ],
  },
] as const satisfies readonly ControlledCorpusScenario[];
