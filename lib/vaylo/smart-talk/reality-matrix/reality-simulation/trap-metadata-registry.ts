/**
 * Structured trap metadata registry — TRAP_METADATA_REGISTRY_V1 (Phase 8.2D-5 / 8.2D-5A).
 *
 * The primary export is `TRAP_METADATA_BY_KIND`: a Record keyed by every
 * `HallucinationTrapKind` and typed with `satisfies Record<HallucinationTrapKind, TrapMetadataDefinition>`.
 * This ensures compile-time completeness — adding a new `HallucinationTrapKind` without a
 * corresponding registry entry becomes a TypeScript error.
 *
 * `TRAP_METADATA_REGISTRY_V1` is derived from the record for backward-compatible iteration.
 *
 * Phase 8.2D-5A: this registry is now wired into `run-reality-simulation.ts` via
 * `buildTrapGovernanceFlags`, which replaced the skeleton-only `enforcementTrapHeuristic`.
 *
 * Consumer obligations — see TRAP_METADATA_FOUNDATION.md §5.
 * No explanation generation. No runtime suppression. No Smart Talk wiring.
 */

import type { HallucinationTrapKind } from "../types";
import type { TrapMetadataDefinition } from "./trap-metadata-types";

export const TRAP_METADATA_REGISTRY_VERSION = "8.2d-5a-trap-metadata-registry-v2";

// ---------------------------------------------------------------------------
// Compile-time-complete record — every HallucinationTrapKind must have an entry.
// The `satisfies` operator enforces exhaustiveness without widening the inferred type.
// ---------------------------------------------------------------------------

export const TRAP_METADATA_BY_KIND = {
  // ── Enforcement cluster ──────────────────────────────────────────────────
  // Traps that represent or lead to legal enforcement actions (Vollstreckung,
  // garnishment, account seizure, eviction, forced collection).
  // isEnforcementRelated: true drives the do_not_claim_enforcement boundary.

  invoice_to_enforcement: {
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
      "Previously caught by enforcementTrapHeuristic substring 'enforcement' (8.2D-5A: now via isEnforcementRelated).",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse:
      "Use isEnforcementRelated=true to set do_not_claim_enforcement boundary.",
  },

  mahnung_to_vollstreckung: {
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
      "Previously caught by enforcementTrapHeuristic substrings 'mahnung' and 'vollstreckung'.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isEnforcementRelated=true.",
  },

  mahnung_to_gerichtsvollzieher: {
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
      "Previously caught by enforcementTrapHeuristic substring 'mahnung'. Gerichtsvollzieher = judicial enforcement officer.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isEnforcementRelated=true.",
  },

  letzte_mahnung_to_active_enforcement: {
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
      "Previously caught by enforcementTrapHeuristic substrings 'mahnung' and 'enforcement'.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isEnforcementRelated=true.",
  },

  steuerbescheid_to_enforcement: {
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
      "Previously caught by enforcementTrapHeuristic substring 'enforcement'.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isEnforcementRelated=true; domains includes 'tax' to scope tax-specific enforcement boundary.",
  },

  payment_reminder_to_account_seizure: {
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
      "NOT caught by old enforcementTrapHeuristic — no matching substring (8.2D-5A gap closure).",
      "Account seizure (Kontopfändung) is a legal enforcement action.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isEnforcementRelated=true — this entry closes a gap the old heuristic missed.",
  },

  weitere_schritte_to_forced_collection: {
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
      "NOT caught by old enforcementTrapHeuristic — no matching substring (8.2D-5A gap closure).",
      "Forced collection (Zwangsvollstreckung) is a legal enforcement action.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isEnforcementRelated=true — gap closure.",
  },

  overdue_payment_to_salary_garnishment: {
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
      "NOT caught by old enforcementTrapHeuristic — no matching substring (8.2D-5A gap closure).",
      "Salary garnishment (Lohnpfändung) is a legal enforcement action.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isEnforcementRelated=true — gap closure.",
  },

  overdue_payment_to_eviction: {
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
      "NOT caught by old enforcementTrapHeuristic — no matching substring (8.2D-5A gap closure).",
      "Eviction (Räumungsklage) is a high-consequence enforcement action.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isEnforcementRelated=true; domains includes 'housing' to scope housing-enforcement boundary.",
  },

  // ── Escalation cluster ───────────────────────────────────────────────────
  // Traps that amplify perceived threat level without constituting legal enforcement.
  // isEscalationRelated: true drives require_uncertainty_wording.
  // IMPORTANT: generic_escalation_to_legal_disaster was previously (incorrectly) caught by
  // enforcementTrapHeuristic via substring "escalation". It is NOT enforcement.

  generic_escalation_to_legal_disaster: {
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
      "Previously (incorrectly) caught by enforcementTrapHeuristic substring 'escalation'.",
      "8.2D-5A fix: isEnforcementRelated=false; isEscalationRelated=true — drives require_uncertainty_wording, NOT do_not_claim_enforcement.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse:
      "Use isEscalationRelated=true to drive require_uncertainty_wording only. This trap does not warrant the enforcement boundary.",
  },

  rechtsbehelfsbelehrung_to_active_threat: {
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

  informational_notice_to_threat: {
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

  // ── Deadline fabrication cluster ─────────────────────────────────────────
  // Traps that synthesize, confuse, or fabricate deadline information.
  // isDeadlineRelated: true — do_not_calculate_deadline is already unconditional;
  // this flag allows future scoped deadline governance.

  appeal_deadline_synthesis: {
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
    futurePolicyUse: "Use isDeadlineRelated=true for scoped deadline boundary.",
  },

  bescheid_date_to_appeal_deadline: {
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
    futurePolicyUse: "Use isDeadlineRelated=true; domains includes 'tax' + 'appeal'.",
  },

  payment_deadline_to_appeal_deadline: {
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
    futurePolicyUse: "Use isDeadlineRelated=true.",
  },

  appeal_deadline_to_payment_deadline: {
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
    futurePolicyUse: "Use isDeadlineRelated=true.",
  },

  bekanntgabe_date_invention: {
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
      "Bekanntgabedatum (official notification date) must not be synthesized from document date.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isDeadlineRelated=true.",
  },

  amount_deadline_swap: {
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
    notes: ["Risk of confusing monetary amounts with deadline date values in numeric OCR contexts."],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isDeadlineRelated=true.",
  },

  generic_due_date_to_penalty: {
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
    futurePolicyUse: "Use isDeadlineRelated=true + isEscalationRelated=true.",
  },

  // ── Legal conclusion cluster ─────────────────────────────────────────────
  // Traps where incorrect inference leads to a structural legal conclusion.

  tax_assessment_to_criminal_case: {
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
      "Tax assessment must never imply criminal proceedings without explicit prosecutorial evidence.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use riskClasses includes 'legal_conclusion' + 'panic_amplification' to trigger high-consequence human review flag.",
  },

  late_fee_to_criminal_case: {
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

  // ── Lane contamination cluster ───────────────────────────────────────────
  // Traps that mix governance lanes or introduce cross-authority confusion.
  // isLaneContaminationRelated: true drives do_not_merge_lanes.

  lane_contamination: {
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

  finanzamt_to_jobcenter_confusion: {
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
      "Finanzamt (tax authority) and Jobcenter (benefits authority) are distinct German institutions.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isLaneContaminationRelated=true + domains to drive do_not_merge_lanes and do_not_merge_payment_and_appeal.",
  },

  // ── Insurance cluster ────────────────────────────────────────────────────

  insurance_notice_to_claim_event: {
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
    futurePolicyUse: "Use isEscalationRelated=true; domains includes 'insurance'.",
  },

  insurance_reminder_to_loss_of_coverage: {
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
    notes: ["Insurance coverage loss is a high-consequence domain — always requires human review context."],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use isEscalationRelated=true + requires_human_review_context.",
  },

  // ── Speculative inference cluster ────────────────────────────────────────
  // Traps that risk inferring facts from ambiguous or insufficient signals.

  semantic_drift: {
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

  provisional_to_final_decision: {
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

  refund_payment_confusion: {
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
      "Steuererstattung (refund) and Nachzahlung (payment due) are directionally opposite — confusing them is high-impact.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use riskClasses includes 'speculative_inference' to trigger uncertainty boundary.",
  },

  lastschrift_to_manual_payment: {
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
    notes: ["SEPA Lastschrift (direct debit) is automatic; telling the user to pay manually creates false urgency."],
    introducedInPhase: "8.2D-5",
    futurePolicyUse: "Use riskClasses includes 'false_reassurance'.",
  },

  // ── Style / tone cluster ─────────────────────────────────────────────────
  // Tone-driven trap — dry_run_only until a structured NLP/tone policy exists.

  emotional_language_amplification: {
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
      "Emotional tone is NOT machine-checkable in the current stack — no NLP/sentiment analysis implemented.",
      "dry_run_only: must not be used for policy boundaries until a structured tone-detection layer exists.",
      "CONSOLIDATION_AUDIT.md flagged this as 'manual review / post-filter only'.",
    ],
    introducedInPhase: "8.2D-5",
    futurePolicyUse:
      "Requires dedicated NLP/tone policy phase. Do NOT use flags for boundary decisions until then.",
  },
} satisfies Record<HallucinationTrapKind, TrapMetadataDefinition>;

// ---------------------------------------------------------------------------
// Backward-compatible flat array — derived from the record for iteration.
// ---------------------------------------------------------------------------

export const TRAP_METADATA_REGISTRY_V1: readonly TrapMetadataDefinition[] =
  Object.values(TRAP_METADATA_BY_KIND);
