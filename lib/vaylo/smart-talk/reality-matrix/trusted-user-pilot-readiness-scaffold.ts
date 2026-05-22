/**
 * Trusted User Pilot Readiness Scaffold (Phase 8.2F-7).
 *
 * Pure static readiness scaffold only. This does not execute a pilot, inspect
 * live data, call Smart Talk, call OCR, call LLMs, render UI, or connect to any
 * production runtime.
 */

import type {
  TrustedUserPilotBlockingIssue,
  TrustedUserPilotConstraint,
  TrustedUserPilotEscalationRule,
  TrustedUserPilotReadiness,
  TrustedUserPilotSafetyClassification,
  TrustedUserPilotScope,
  TrustedUserPilotStopCondition,
  TrustedUserPilotWarning,
} from "./trusted-user-pilot-gate-types";

export const TRUSTED_USER_PILOT_GATE_VERSION =
  "8.2f-7-trusted-user-pilot-gate-v1";

const SAFETY_CLASSIFICATIONS: readonly TrustedUserPilotSafetyClassification[] = [
  {
    readinessLevel: "ready",
    areas: [
      "internal_governance_dry_run_testing",
      "synthetic_corpus_regression",
      "structural_cognition_testing",
    ],
    rationale:
      "Current stack supports structural governance testing, synthetic corpus regression, and dry-run cognition inspection only.",
    neverUserVisible: true,
  },
  {
    readinessLevel: "limited_ready",
    areas: [
      "narrow_trusted_user_pilot",
      "supervised_manual_review",
      "non_authoritative_framing_only",
    ],
    rationale:
      "A future trusted-user pilot may be considered only if invite-only access, manual supervision, non-authoritative framing, and stop conditions are enforced outside production runtime.",
    neverUserVisible: true,
  },
  {
    readinessLevel: "not_ready",
    areas: [
      "public_launch",
      "autonomous_execution",
      "dna_integration",
      "production_ocr_cognition",
      "b2b_deployment",
      "legal_authority_positioning",
    ],
    rationale:
      "Public, autonomous, high-authority, production OCR, DNA, B2B, and legal-positioning uses remain blocked before additional review, redacted real-world corpus testing, and incident audit layers exist.",
    neverUserVisible: true,
  },
];

const BLOCKING_ISSUES: readonly TrustedUserPilotBlockingIssue[] = [
  {
    code: "public_release_not_allowed",
    affectedReadinessArea: "public_launch",
    reason:
      "The current bridge is dry-run only and has no public-release safety gate, incident audit layer, or real-world redacted corpus baseline.",
    blocksPublicRelease: true,
    blocksTrustedPilot: false,
    neverUserVisible: true,
  },
  {
    code: "autonomous_execution_not_allowed",
    affectedReadinessArea: "autonomous_execution",
    reason:
      "The system must not submit forms, contact authorities, or execute irreversible actions on behalf of users.",
    blocksPublicRelease: true,
    blocksTrustedPilot: true,
    neverUserVisible: true,
  },
  {
    code: "production_ocr_cognition_not_allowed",
    affectedReadinessArea: "production_ocr_cognition",
    reason:
      "OCR uncertainty has not been validated through a runtime uncertainty harness or real-world redacted corpus.",
    blocksPublicRelease: true,
    blocksTrustedPilot: true,
    neverUserVisible: true,
  },
  {
    code: "legal_authority_positioning_not_allowed",
    affectedReadinessArea: "legal_authority_positioning",
    reason:
      "Trusted pilot use must remain non-authoritative and must not position Vaylo as legal advice, official translation, or deadline authority.",
    blocksPublicRelease: true,
    blocksTrustedPilot: true,
    neverUserVisible: true,
  },
  {
    code: "high_risk_domain_scope_not_allowed",
    affectedReadinessArea: "narrow_trusted_user_pilot",
    reason:
      "High-risk immigration, urgent enforcement, legal proceedings, emergencies, and irreversible actions are outside the permitted trusted-user pilot scope.",
    blocksPublicRelease: true,
    blocksTrustedPilot: true,
    neverUserVisible: true,
  },
];

const WARNINGS: readonly TrustedUserPilotWarning[] = [
  {
    code: "manual_review_required",
    affectedReadinessArea: "supervised_manual_review",
    reason:
      "Every trusted-user pilot case must be reviewed by a human operator before being treated as acceptable pilot behavior.",
    requiresOwnerReview: true,
    neverUserVisible: true,
  },
  {
    code: "wording_safety_not_yet_human_reviewed",
    affectedReadinessArea: "non_authoritative_framing_only",
    reason:
      "Human wording review has not yet been completed for real user-facing explanation copy.",
    requiresOwnerReview: true,
    neverUserVisible: true,
  },
  {
    code: "ocr_uncertainty_runtime_not_validated",
    affectedReadinessArea: "production_ocr_cognition",
    reason:
      "OCR uncertainty runtime behavior remains future work and cannot be relied on for pilot cognition.",
    requiresOwnerReview: true,
    neverUserVisible: true,
  },
  {
    code: "real_world_redacted_corpus_not_ready",
    affectedReadinessArea: "narrow_trusted_user_pilot",
    reason:
      "A privacy-safe redacted real-world corpus is required before expanding beyond narrow trusted-user review.",
    requiresOwnerReview: true,
    neverUserVisible: true,
  },
  {
    code: "pilot_incident_audit_layer_not_ready",
    affectedReadinessArea: "narrow_trusted_user_pilot",
    reason:
      "A dedicated pilot incident audit layer is not yet implemented and must precede broader rollout.",
    requiresOwnerReview: true,
    neverUserVisible: true,
  },
];

const OPERATIONAL_CONSTRAINTS: readonly TrustedUserPilotConstraint[] = [
  {
    constraintId: "pilot-invite-only",
    category: "access_control",
    requirement: "Pilot access must remain invite-only and never public.",
    mandatory: true,
    neverUserVisible: true,
  },
  {
    constraintId: "pilot-manual-supervision",
    category: "human_supervision",
    requirement: "Every pilot case must remain manually supervised.",
    mandatory: true,
    neverUserVisible: true,
  },
  {
    constraintId: "pilot-non-authoritative",
    category: "non_authoritative_positioning",
    requirement:
      "Pilot output must be framed as non-authoritative and must not claim legal truth.",
    mandatory: true,
    neverUserVisible: true,
  },
  {
    constraintId: "pilot-uncertainty-preserved",
    category: "uncertainty_preservation",
    requirement:
      "Uncertainty must be preserved and never silently suppressed.",
    mandatory: true,
    neverUserVisible: true,
  },
  {
    constraintId: "pilot-no-deadline-certainty",
    category: "forbidden_action",
    requirement:
      "Pilot behavior must not calculate deadlines or assert deadline certainty.",
    mandatory: true,
    neverUserVisible: true,
  },
  {
    constraintId: "pilot-no-autonomous-actions",
    category: "forbidden_action",
    requirement:
      "Pilot behavior must not auto-submit forms, auto-contact authorities, or execute actions.",
    mandatory: true,
    neverUserVisible: true,
  },
  {
    constraintId: "pilot-safe-useful-trust",
    category: "trust_signal",
    requirement:
      "Safe behavior must remain useful: calm tone, transparent limits, and review recommendations when appropriate.",
    mandatory: true,
    neverUserVisible: true,
  },
];

const ALLOWED_SCOPE: TrustedUserPilotScope = {
  allowedDocumentFamilies: [
    "synthetic_internal_scenario",
    "controlled_corpus_scenario",
    "rechnung_payment_notice_low_to_medium_ambiguity",
    "mahnung_low_to_medium_ambiguity",
    "steuerbescheid_low_ambiguity",
    "generic_bureaucracy_notice_low_risk",
  ],
  forbiddenScenarios: [
    "high_risk_immigration_case",
    "urgent_enforcement_escalation",
    "court_or_legal_proceeding",
    "irreversible_financial_action",
    "medical_or_legal_emergency_guidance",
    "autonomous_submission_or_authority_contact",
    "deadline_authority_request",
    "legal_verdict_request",
    "public_user_access",
    "b2b_or_institutional_deployment",
  ],
  allowedActivities: [
    "synthetic/internal scenario review",
    "low-to-medium ambiguity document review",
    "explanation UX testing",
    "governance validation",
    "user trust feedback",
    "wording safety review",
    "uncertainty posture review",
  ],
  disallowedActivities: [
    "public launch",
    "autonomous workflow execution",
    "urgent enforcement guidance",
    "legal verdict generation",
    "deadline calculation",
    "authority contact automation",
    "production OCR cognition",
  ],
  inviteOnly: true,
  manualSupervisionRequired: true,
  publicAccessAllowed: false,
  neverUserVisible: true,
};

const STOP_CONDITIONS: readonly TrustedUserPilotStopCondition[] = [
  {
    code: "hallucinated_enforcement",
    trigger: "System implies enforcement exists or is imminent without source-bound support.",
    requiredAction: "pause_pilot_immediately",
    immediatePauseRequired: true,
    humanReviewRequired: true,
    neverUserVisible: true,
  },
  {
    code: "hallucinated_deadline",
    trigger: "System creates, calculates, or asserts a deadline not explicitly source-bound.",
    requiredAction: "pause_pilot_immediately",
    immediatePauseRequired: true,
    humanReviewRequired: true,
    neverUserVisible: true,
  },
  {
    code: "false_reassurance",
    trigger: "System guarantees safety, outcome, non-risk, or official acceptance.",
    requiredAction: "route_to_human_review",
    immediatePauseRequired: true,
    humanReviewRequired: true,
    neverUserVisible: true,
  },
  {
    code: "panic_amplification",
    trigger: "System increases urgency, threat, or panic beyond source-bound evidence.",
    requiredAction: "route_to_human_review",
    immediatePauseRequired: true,
    humanReviewRequired: true,
    neverUserVisible: true,
  },
  {
    code: "contradiction_collapse",
    trigger: "System resolves contradictory signals as certainty without source authority.",
    requiredAction: "run_regression_reproduction",
    immediatePauseRequired: true,
    humanReviewRequired: true,
    neverUserVisible: true,
  },
  {
    code: "lane_contamination",
    trigger: "System merges payment, appeal, enforcement, immigration, tax, or court lanes.",
    requiredAction: "run_regression_reproduction",
    immediatePauseRequired: true,
    humanReviewRequired: true,
    neverUserVisible: true,
  },
  {
    code: "raw_data_leakage",
    trigger: "System exposes raw OCR, private data, prompt data, or implementation details.",
    requiredAction: "pause_pilot_immediately",
    immediatePauseRequired: true,
    humanReviewRequired: true,
    neverUserVisible: true,
  },
  {
    code: "governance_suppression_failure",
    trigger: "Forbidden moves, required constraints, or boundary suppressions fail.",
    requiredAction: "pause_pilot_immediately",
    immediatePauseRequired: true,
    humanReviewRequired: true,
    neverUserVisible: true,
  },
  {
    code: "paid_free_leakage",
    trigger: "Free/paid access-tier boundaries are violated.",
    requiredAction: "pause_pilot_immediately",
    immediatePauseRequired: true,
    humanReviewRequired: true,
    neverUserVisible: true,
  },
  {
    code: "unsafe_wording_drift",
    trigger: "User-facing wording drifts toward authority, certainty, pressure, or advice.",
    requiredAction: "update_gate_before_resuming",
    immediatePauseRequired: true,
    humanReviewRequired: true,
    neverUserVisible: true,
  },
];

const ESCALATION_RULES: readonly TrustedUserPilotEscalationRule[] = [
  {
    ruleId: "critical-safety-pause",
    stopConditionCodes: [
      "hallucinated_enforcement",
      "hallucinated_deadline",
      "raw_data_leakage",
      "governance_suppression_failure",
      "paid_free_leakage",
    ],
    actions: [
      "pause_pilot_immediately",
      "record_internal_incident",
      "route_to_human_review",
      "run_regression_reproduction",
    ],
    owner: "product_safety",
    resumeRequiresDocumentedReview: true,
    neverUserVisible: true,
  },
  {
    ruleId: "wording-and-trust-review",
    stopConditionCodes: [
      "false_reassurance",
      "panic_amplification",
      "unsafe_wording_drift",
    ],
    actions: [
      "route_to_human_review",
      "record_internal_incident",
      "update_gate_before_resuming",
    ],
    owner: "founder_review",
    resumeRequiresDocumentedReview: true,
    neverUserVisible: true,
  },
  {
    ruleId: "governance-model-review",
    stopConditionCodes: ["contradiction_collapse", "lane_contamination"],
    actions: [
      "remove_case_from_pilot_scope",
      "run_regression_reproduction",
      "update_gate_before_resuming",
    ],
    owner: "engineering",
    resumeRequiresDocumentedReview: true,
    neverUserVisible: true,
  },
];

/**
 * Returns the Phase 8.2F-7 trusted-user pilot readiness gate snapshot.
 *
 * This is a pure static scaffold. It performs no live checks and does not
 * inspect runtime state. It is intended as a typed readiness artifact for
 * governance review before any future trusted-user pilot.
 */
export function evaluateTrustedUserPilotReadiness(): TrustedUserPilotReadiness {
  return {
    gateVersion: TRUSTED_USER_PILOT_GATE_VERSION,
    readinessLevel: "limited_ready",
    safetyClassifications: SAFETY_CLASSIFICATIONS,
    blockingIssues: BLOCKING_ISSUES,
    warnings: WARNINGS,
    operationalConstraints: OPERATIONAL_CONSTRAINTS,
    allowedScope: ALLOWED_SCOPE,
    stopConditions: STOP_CONDITIONS,
    escalationRules: ESCALATION_RULES,
    notes: [
      "Trusted-user pilot gate is governance-only and does not launch Smart Talk.",
      "Limited readiness applies only to narrow, invite-only, manually supervised, non-authoritative pilot review.",
      "Public launch, autonomous execution, production OCR cognition, DNA integration, B2B deployment, and legal authority positioning remain not ready.",
      "Safe must remain useful: uncertainty, calm tone, transparent limits, and review recommendations are required trust signals.",
    ],
    neverUserVisible: true,
  };
}
