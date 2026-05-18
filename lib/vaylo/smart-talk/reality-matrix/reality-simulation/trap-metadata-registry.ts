/**
 * Structured trap metadata registry — TRAP_METADATA_REGISTRY_V1 (Phase 8.2D-5).
 *
 * Central, readonly, versioned metadata table for every registered `HallucinationTrapKind`.
 * This registry provides the structured governance annotations that will replace the coarse
 * `enforcementTrapHeuristic` substring checks once Phase 8.2D-5A is implemented.
 *
 * IMPORTANT:
 * - This registry is METADATA ONLY. It does not execute, suppress, rewrite, or govern any
 *   runtime explanation output in this phase.
 * - Do NOT wire this into runRealitySimulation until Phase 8.2D-5A.
 * - All entries are conservatively marked `metadata_foundation` or `dry_run_only`.
 * - See TRAP_METADATA_FOUNDATION.md for the replacement strategy.
 */

import type { TrapMetadataDefinition } from "./trap-metadata-types";

export const TRAP_METADATA_REGISTRY_VERSION = "8.2d-5-trap-metadata-registry-v1";

// ---------------------------------------------------------------------------
// Enforcement cluster
// Traps that the current enforcementTrapHeuristic catches via substring matching.
// Marked isEnforcementRelated: true — these will drive the structured replacement.
// ---------------------------------------------------------------------------

const ENFORCEMENT_CLUSTER: readonly TrapMetadataDefinition[] = [
  {
    trapKind: "invoice_to_enforcement",
    domains: ["enforcement", "payment"],
    riskClasses: ["over_escalation", "legal_conclusion"],
    isEnforcementRelated: true,
    isEscalationRelated: true,
    isDeadlineRelated: false,
    isLaneContaminationRelated: false,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
    ],
    notes: [
      "Caught by enforcementTrapHeuristic substring 'enforcement'. Will be the primary driver of the structured replacement in 8.2D-5A.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse:
      "Use isEnforcementRelated=true to set do_not_claim_enforcement boundary; replace trapKind.includes('enforcement') check.",
  },
  {
    trapKind: "mahnung_to_vollstreckung",
    domains: ["enforcement", "payment"],
    riskClasses: ["over_escalation", "legal_conclusion"],
    isEnforcementRelated: true,
    isEscalationRelated: true,
    isDeadlineRelated: false,
    isLaneContaminationRelated: false,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
    ],
    notes: [
      "Caught by enforcementTrapHeuristic substrings 'mahnung' and 'vollstreckung'.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isEnforcementRelated=true to replace trapKind.includes('vollstreckung' | 'mahnung') check.",
  },
  {
    trapKind: "mahnung_to_gerichtsvollzieher",
    domains: ["enforcement", "payment"],
    riskClasses: ["over_escalation", "legal_conclusion"],
    isEnforcementRelated: true,
    isEscalationRelated: true,
    isDeadlineRelated: false,
    isLaneContaminationRelated: false,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
    ],
    notes: [
      "Caught by enforcementTrapHeuristic substring 'mahnung'. Gerichtsvollzieher = judicial enforcement officer.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isEnforcementRelated=true to replace trapKind.includes('mahnung') check.",
  },
  {
    trapKind: "letzte_mahnung_to_active_enforcement",
    domains: ["enforcement", "payment"],
    riskClasses: ["over_escalation", "legal_conclusion"],
    isEnforcementRelated: true,
    isEscalationRelated: true,
    isDeadlineRelated: false,
    isLaneContaminationRelated: false,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
    ],
    notes: [
      "Caught by enforcementTrapHeuristic substrings 'mahnung' and 'enforcement'.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isEnforcementRelated=true to replace both substring matches.",
  },
  {
    trapKind: "steuerbescheid_to_enforcement",
    domains: ["enforcement", "tax"],
    riskClasses: ["over_escalation", "legal_conclusion"],
    isEnforcementRelated: true,
    isEscalationRelated: true,
    isDeadlineRelated: false,
    isLaneContaminationRelated: false,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
    ],
    notes: [
      "Caught by enforcementTrapHeuristic substring 'enforcement'.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isEnforcementRelated=true and domains includes 'tax' to scope tax-specific enforcement boundary.",
  },
  {
    trapKind: "payment_reminder_to_account_seizure",
    domains: ["enforcement", "payment"],
    riskClasses: ["over_escalation", "legal_conclusion"],
    isEnforcementRelated: true,
    isEscalationRelated: true,
    isDeadlineRelated: false,
    isLaneContaminationRelated: false,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
    ],
    notes: [
      "NOT caught by current enforcementTrapHeuristic — no matching substring. This is a gap in the skeleton heuristic.",
      "Account seizure (Kontopfändung) is an enforcement action; must be treated as enforcement-related.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isEnforcementRelated=true to close the gap the substring heuristic misses.",
  },
  {
    trapKind: "weitere_schritte_to_forced_collection",
    domains: ["enforcement", "payment"],
    riskClasses: ["over_escalation", "legal_conclusion"],
    isEnforcementRelated: true,
    isEscalationRelated: true,
    isDeadlineRelated: false,
    isLaneContaminationRelated: false,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
    ],
    notes: [
      "NOT caught by current enforcementTrapHeuristic — no matching substring. Forced collection (Zwangsvollstreckung) is enforcement.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isEnforcementRelated=true to close the heuristic gap.",
  },
  {
    trapKind: "overdue_payment_to_salary_garnishment",
    domains: ["enforcement", "payment"],
    riskClasses: ["over_escalation", "legal_conclusion"],
    isEnforcementRelated: true,
    isEscalationRelated: true,
    isDeadlineRelated: false,
    isLaneContaminationRelated: false,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
    ],
    notes: [
      "NOT caught by current enforcementTrapHeuristic — no matching substring. Salary garnishment is enforcement.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isEnforcementRelated=true to close the heuristic gap.",
  },
  {
    trapKind: "overdue_payment_to_eviction",
    domains: ["enforcement", "housing", "payment"],
    riskClasses: ["over_escalation", "legal_conclusion"],
    isEnforcementRelated: true,
    isEscalationRelated: true,
    isDeadlineRelated: false,
    isLaneContaminationRelated: false,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
      "requires_human_review_context",
    ],
    notes: [
      "NOT caught by current enforcementTrapHeuristic. Eviction (Räumungsklage) is a high-consequence enforcement action.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isEnforcementRelated=true; domains includes 'housing' to scope housing-enforcement boundary.",
  },
];

// ---------------------------------------------------------------------------
// Escalation cluster
// Traps that do not involve legal enforcement but amplify perceived threat level.
// ---------------------------------------------------------------------------

const ESCALATION_CLUSTER: readonly TrapMetadataDefinition[] = [
  {
    trapKind: "generic_escalation_to_legal_disaster",
    domains: ["generic_escalation"],
    riskClasses: ["over_escalation", "panic_amplification", "legal_conclusion"],
    isEnforcementRelated: false,
    isEscalationRelated: true,
    isDeadlineRelated: false,
    isLaneContaminationRelated: false,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
    ],
    notes: [
      "Caught by enforcementTrapHeuristic substring 'escalation'. However, this trap is ESCALATION, not enforcement.",
      "Including it in an enforcement boundary is semantically incorrect — a gap to fix in 8.2D-5A.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse:
      "Use isEscalationRelated=true rather than isEnforcementRelated. Drives require_uncertainty_wording, not do_not_claim_enforcement.",
  },
  {
    trapKind: "rechtsbehelfsbelehrung_to_active_threat",
    domains: ["appeal", "tax"],
    riskClasses: ["over_escalation", "legal_conclusion", "panic_amplification"],
    isEnforcementRelated: false,
    isEscalationRelated: true,
    isDeadlineRelated: false,
    isLaneContaminationRelated: false,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
      "requires_human_review_context",
    ],
    notes: [
      "Rechtsbehelfsbelehrung (legal remedy instruction) is not active enforcement. Escalation risk only.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isEscalationRelated=true; drives uncertainty boundary, not enforcement boundary.",
  },
  {
    trapKind: "informational_notice_to_threat",
    domains: ["generic_escalation"],
    riskClasses: ["over_escalation", "panic_amplification"],
    isEnforcementRelated: false,
    isEscalationRelated: true,
    isDeadlineRelated: false,
    isLaneContaminationRelated: false,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isEscalationRelated=true to drive require_uncertainty_wording.",
  },
];

// ---------------------------------------------------------------------------
// Deadline fabrication cluster
// Traps that synthesize or confuse deadline information.
// ---------------------------------------------------------------------------

const DEADLINE_CLUSTER: readonly TrapMetadataDefinition[] = [
  {
    trapKind: "appeal_deadline_synthesis",
    domains: ["appeal", "deadline"],
    riskClasses: ["deadline_fabrication"],
    isEnforcementRelated: false,
    isEscalationRelated: false,
    isDeadlineRelated: true,
    isLaneContaminationRelated: false,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isDeadlineRelated=true to drive do_not_calculate_deadline boundary.",
  },
  {
    trapKind: "bescheid_date_to_appeal_deadline",
    domains: ["appeal", "tax", "deadline"],
    riskClasses: ["deadline_fabrication"],
    isEnforcementRelated: false,
    isEscalationRelated: false,
    isDeadlineRelated: true,
    isLaneContaminationRelated: false,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isDeadlineRelated=true; domains includes 'tax' + 'appeal' to scope steuerbescheid deadline boundary.",
  },
  {
    trapKind: "payment_deadline_to_appeal_deadline",
    domains: ["appeal", "payment", "deadline"],
    riskClasses: ["deadline_fabrication"],
    isEnforcementRelated: false,
    isEscalationRelated: false,
    isDeadlineRelated: true,
    isLaneContaminationRelated: false,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isDeadlineRelated=true to prevent appeal-deadline inference from payment dates.",
  },
  {
    trapKind: "appeal_deadline_to_payment_deadline",
    domains: ["appeal", "payment", "deadline"],
    riskClasses: ["deadline_fabrication"],
    isEnforcementRelated: false,
    isEscalationRelated: false,
    isDeadlineRelated: true,
    isLaneContaminationRelated: false,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isDeadlineRelated=true to prevent payment-deadline inference from appeal dates.",
  },
  {
    trapKind: "bekanntgabe_date_invention",
    domains: ["deadline", "tax"],
    riskClasses: ["deadline_fabrication"],
    isEnforcementRelated: false,
    isEscalationRelated: false,
    isDeadlineRelated: true,
    isLaneContaminationRelated: false,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
    ],
    notes: [
      "Bekanntgabedatum (date of official notification) must not be synthesized from the document date.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isDeadlineRelated=true to block Bekanntgabe date fabrication in explanation layer.",
  },
  {
    trapKind: "amount_deadline_swap",
    domains: ["payment", "deadline"],
    riskClasses: ["deadline_fabrication", "speculative_inference"],
    isEnforcementRelated: false,
    isEscalationRelated: false,
    isDeadlineRelated: true,
    isLaneContaminationRelated: false,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
    ],
    notes: [
      "Risk of confusing monetary amounts with deadline date values in numeric OCR contexts.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isDeadlineRelated=true to guard against amount/deadline confusion in explanation.",
  },
  {
    trapKind: "generic_due_date_to_penalty",
    domains: ["payment", "deadline"],
    riskClasses: ["over_escalation", "deadline_fabrication"],
    isEnforcementRelated: false,
    isEscalationRelated: true,
    isDeadlineRelated: true,
    isLaneContaminationRelated: false,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isDeadlineRelated=true + isEscalationRelated=true to scope deadline + escalation boundaries.",
  },
];

// ---------------------------------------------------------------------------
// Legal conclusion cluster
// Traps that risk drawing structural legal conclusions without sufficient evidence.
// ---------------------------------------------------------------------------

const LEGAL_CONCLUSION_CLUSTER: readonly TrapMetadataDefinition[] = [
  {
    trapKind: "tax_assessment_to_criminal_case",
    domains: ["tax"],
    riskClasses: ["legal_conclusion", "over_escalation", "panic_amplification"],
    isEnforcementRelated: false,
    isEscalationRelated: true,
    isDeadlineRelated: false,
    isLaneContaminationRelated: false,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
      "requires_human_review_context",
    ],
    notes: [
      "Tax assessment (Steuerbescheid) must never imply criminal proceedings without explicit prosecutorial evidence.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use riskClasses includes 'legal_conclusion' + 'panic_amplification' to trigger high-consequence human review flag.",
  },
  {
    trapKind: "late_fee_to_criminal_case",
    domains: ["payment"],
    riskClasses: ["legal_conclusion", "over_escalation"],
    isEnforcementRelated: false,
    isEscalationRelated: true,
    isDeadlineRelated: false,
    isLaneContaminationRelated: false,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
      "requires_human_review_context",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use riskClasses includes 'legal_conclusion' to enforce do_not_claim_finality-style boundary.",
  },
];

// ---------------------------------------------------------------------------
// Lane contamination cluster
// Traps that mix governance domains or introduce cross-authority confusion.
// ---------------------------------------------------------------------------

const LANE_CONTAMINATION_CLUSTER: readonly TrapMetadataDefinition[] = [
  {
    trapKind: "lane_contamination",
    domains: ["cross_lane"],
    riskClasses: ["lane_contamination"],
    isEnforcementRelated: false,
    isEscalationRelated: false,
    isDeadlineRelated: false,
    isLaneContaminationRelated: true,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isLaneContaminationRelated=true to drive do_not_merge_lanes boundary.",
  },
  {
    trapKind: "finanzamt_to_jobcenter_confusion",
    domains: ["tax", "benefits", "cross_lane"],
    riskClasses: ["lane_contamination", "authority_confusion"],
    isEnforcementRelated: false,
    isEscalationRelated: false,
    isDeadlineRelated: false,
    isLaneContaminationRelated: true,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
    ],
    notes: [
      "Finanzamt (tax authority) and Jobcenter (benefits authority) are distinct German institutions with different legal frameworks.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isLaneContaminationRelated=true + domains to drive do_not_merge_lanes and do_not_merge_payment_and_appeal.",
  },
];

// ---------------------------------------------------------------------------
// Insurance cluster
// ---------------------------------------------------------------------------

const INSURANCE_CLUSTER: readonly TrapMetadataDefinition[] = [
  {
    trapKind: "insurance_notice_to_claim_event",
    domains: ["insurance"],
    riskClasses: ["over_escalation", "speculative_inference"],
    isEnforcementRelated: false,
    isEscalationRelated: true,
    isDeadlineRelated: false,
    isLaneContaminationRelated: false,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isEscalationRelated=true; domains includes 'insurance' to scope insurance-domain uncertainty boundary.",
  },
  {
    trapKind: "insurance_reminder_to_loss_of_coverage",
    domains: ["insurance", "benefits"],
    riskClasses: ["over_escalation", "legal_conclusion"],
    isEnforcementRelated: false,
    isEscalationRelated: true,
    isDeadlineRelated: false,
    isLaneContaminationRelated: false,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
      "requires_human_review_context",
    ],
    notes: [
      "Insurance coverage loss is a high-consequence domain — always requires human review context.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isEscalationRelated=true + requires_human_review_context to drive high_consequence_domain flag.",
  },
];

// ---------------------------------------------------------------------------
// Speculative inference cluster
// Traps that risk drawing inferences from ambiguous or insufficient signals.
// ---------------------------------------------------------------------------

const SPECULATIVE_CLUSTER: readonly TrapMetadataDefinition[] = [
  {
    trapKind: "semantic_drift",
    domains: ["generic_escalation"],
    riskClasses: ["speculative_inference"],
    isEnforcementRelated: false,
    isEscalationRelated: false,
    isDeadlineRelated: false,
    isLaneContaminationRelated: false,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use riskClasses includes 'speculative_inference' to drive require_uncertainty_wording.",
  },
  {
    trapKind: "provisional_to_final_decision",
    domains: ["tax"],
    riskClasses: ["speculative_inference"],
    isEnforcementRelated: false,
    isEscalationRelated: false,
    isDeadlineRelated: false,
    isLaneContaminationRelated: false,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
    ],
    notes: [
      "Vorläufiger Bescheid (provisional assessment) must not be treated as final (bestandskräftig).",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use riskClasses includes 'speculative_inference' to drive do_not_claim_finality boundary.",
  },
  {
    trapKind: "refund_payment_confusion",
    domains: ["payment", "tax"],
    riskClasses: ["speculative_inference"],
    isEnforcementRelated: false,
    isEscalationRelated: false,
    isDeadlineRelated: false,
    isLaneContaminationRelated: false,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
    ],
    notes: [
      "Steuererstattung (tax refund) and Nachzahlung (tax payment due) are directionally opposite — confusing them is a high-impact speculative error.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use riskClasses includes 'speculative_inference' to trigger uncertainty boundary in payment/tax lane.",
  },
  {
    trapKind: "lastschrift_to_manual_payment",
    domains: ["payment"],
    riskClasses: ["speculative_inference", "false_reassurance"],
    isEnforcementRelated: false,
    isEscalationRelated: false,
    isDeadlineRelated: false,
    isLaneContaminationRelated: false,
    productionReadiness: "metadata_foundation",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
    ],
    notes: [
      "SEPA Lastschrift (direct debit) is automatic; telling the user to pay manually creates false urgency.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use riskClasses includes 'false_reassurance' to avoid incorrect payment instruction inferences.",
  },
];

// ---------------------------------------------------------------------------
// Style / tone cluster
// Traps driven by emotional language patterns rather than structural document signals.
// ---------------------------------------------------------------------------

const STYLE_CLUSTER: readonly TrapMetadataDefinition[] = [
  {
    trapKind: "emotional_language_amplification",
    domains: ["style_or_tone"],
    riskClasses: ["panic_amplification"],
    isEnforcementRelated: false,
    isEscalationRelated: false,
    isDeadlineRelated: false,
    isLaneContaminationRelated: false,
    productionReadiness: "dry_run_only",
    consumerConstraints: [
      "never_render_directly",
      "not_legal_advice",
      "not_runtime_suppression",
      "dry_run_not_truth",
      "requires_structured_policy_before_runtime",
    ],
    notes: [
      "Emotional tone is NOT a machine-checkable signal in the current stack — no NLP/sentiment analysis is implemented.",
      "Marked dry_run_only: must not be used for policy boundaries until a structured tone-detection layer exists.",
      "CONSOLIDATION_AUDIT.md (8.2B-4) flagged this as 'manual review / post-filter only'.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse:
      "Requires dedicated NLP/tone policy phase before any boundary use. Do NOT use riskClasses for boundary decisions until then.",
  },
];

// ---------------------------------------------------------------------------
// Full registry — all 31 registered HallucinationTrapKind entries
// ---------------------------------------------------------------------------

export const TRAP_METADATA_REGISTRY_V1: readonly TrapMetadataDefinition[] = [
  ...ENFORCEMENT_CLUSTER,
  ...ESCALATION_CLUSTER,
  ...DEADLINE_CLUSTER,
  ...LEGAL_CONCLUSION_CLUSTER,
  ...LANE_CONTAMINATION_CLUSTER,
  ...INSURANCE_CLUSTER,
  ...SPECULATIVE_CLUSTER,
  ...STYLE_CLUSTER,
] as const;
