/**
 * Trusted User Pilot Gate types (Phase 8.2F-7).
 *
 * Governance readiness model only.
 *
 * Safety guarantees:
 * - no pilot execution
 * - no Smart Talk runtime wiring
 * - no OCR access
 * - no LLM calls
 * - no UI rendering
 * - no payment logic
 * - no deadline calculation
 * - no legal conclusions
 * - no user-visible explanation generation
 */

export type TrustedUserPilotGateVersion =
  "8.2f-7-trusted-user-pilot-gate-v1";

export type TrustedUserPilotReadinessLevel =
  | "ready"
  | "limited_ready"
  | "not_ready";

export type TrustedUserPilotReadinessArea =
  | "internal_governance_dry_run_testing"
  | "synthetic_corpus_regression"
  | "structural_cognition_testing"
  | "narrow_trusted_user_pilot"
  | "supervised_manual_review"
  | "non_authoritative_framing_only"
  | "public_launch"
  | "autonomous_execution"
  | "dna_integration"
  | "production_ocr_cognition"
  | "b2b_deployment"
  | "legal_authority_positioning";

export type TrustedUserPilotConstraintCategory =
  | "access_control"
  | "human_supervision"
  | "non_authoritative_positioning"
  | "uncertainty_preservation"
  | "scope_limitation"
  | "forbidden_action"
  | "trust_signal"
  | "incident_response";

export type TrustedUserPilotBlockingIssueCode =
  | "public_release_not_allowed"
  | "autonomous_execution_not_allowed"
  | "production_ocr_cognition_not_allowed"
  | "legal_authority_positioning_not_allowed"
  | "b2b_deployment_not_allowed"
  | "dna_integration_not_allowed"
  | "high_risk_domain_scope_not_allowed"
  | "incident_response_required_before_pilot";

export type TrustedUserPilotWarningCode =
  | "manual_review_required"
  | "wording_safety_not_yet_human_reviewed"
  | "ocr_uncertainty_runtime_not_validated"
  | "real_world_redacted_corpus_not_ready"
  | "trusted_user_onboarding_not_implemented"
  | "pilot_incident_audit_layer_not_ready";

export type TrustedUserPilotAllowedDocumentFamily =
  | "synthetic_internal_scenario"
  | "controlled_corpus_scenario"
  | "rechnung_payment_notice_low_to_medium_ambiguity"
  | "mahnung_low_to_medium_ambiguity"
  | "steuerbescheid_low_ambiguity"
  | "generic_bureaucracy_notice_low_risk";

export type TrustedUserPilotForbiddenScenario =
  | "high_risk_immigration_case"
  | "urgent_enforcement_escalation"
  | "court_or_legal_proceeding"
  | "irreversible_financial_action"
  | "medical_or_legal_emergency_guidance"
  | "autonomous_submission_or_authority_contact"
  | "deadline_authority_request"
  | "legal_verdict_request"
  | "public_user_access"
  | "b2b_or_institutional_deployment";

export type TrustedUserPilotStopConditionCode =
  | "hallucinated_enforcement"
  | "hallucinated_deadline"
  | "false_reassurance"
  | "panic_amplification"
  | "contradiction_collapse"
  | "lane_contamination"
  | "raw_data_leakage"
  | "governance_suppression_failure"
  | "paid_free_leakage"
  | "unsafe_wording_drift";

export type TrustedUserPilotEscalationAction =
  | "pause_pilot_immediately"
  | "remove_case_from_pilot_scope"
  | "route_to_human_review"
  | "record_internal_incident"
  | "run_regression_reproduction"
  | "update_gate_before_resuming";

export interface TrustedUserPilotConstraint {
  readonly constraintId: string;
  readonly category: TrustedUserPilotConstraintCategory;
  readonly requirement: string;
  readonly mandatory: true;
  readonly neverUserVisible: true;
}

export interface TrustedUserPilotBlockingIssue {
  readonly code: TrustedUserPilotBlockingIssueCode;
  readonly affectedReadinessArea: TrustedUserPilotReadinessArea;
  readonly reason: string;
  readonly blocksPublicRelease: boolean;
  readonly blocksTrustedPilot: boolean;
  readonly neverUserVisible: true;
}

export interface TrustedUserPilotWarning {
  readonly code: TrustedUserPilotWarningCode;
  readonly affectedReadinessArea: TrustedUserPilotReadinessArea;
  readonly reason: string;
  readonly requiresOwnerReview: boolean;
  readonly neverUserVisible: true;
}

export interface TrustedUserPilotScope {
  readonly allowedDocumentFamilies: readonly TrustedUserPilotAllowedDocumentFamily[];
  readonly forbiddenScenarios: readonly TrustedUserPilotForbiddenScenario[];
  readonly allowedActivities: readonly string[];
  readonly disallowedActivities: readonly string[];
  readonly inviteOnly: true;
  readonly manualSupervisionRequired: true;
  readonly publicAccessAllowed: false;
  readonly neverUserVisible: true;
}

export interface TrustedUserPilotStopCondition {
  readonly code: TrustedUserPilotStopConditionCode;
  readonly trigger: string;
  readonly requiredAction: TrustedUserPilotEscalationAction;
  readonly immediatePauseRequired: boolean;
  readonly humanReviewRequired: true;
  readonly neverUserVisible: true;
}

export interface TrustedUserPilotEscalationRule {
  readonly ruleId: string;
  readonly stopConditionCodes: readonly TrustedUserPilotStopConditionCode[];
  readonly actions: readonly TrustedUserPilotEscalationAction[];
  readonly owner: "product_safety" | "engineering" | "legal_review" | "founder_review";
  readonly resumeRequiresDocumentedReview: true;
  readonly neverUserVisible: true;
}

export interface TrustedUserPilotSafetyClassification {
  readonly readinessLevel: TrustedUserPilotReadinessLevel;
  readonly areas: readonly TrustedUserPilotReadinessArea[];
  readonly rationale: string;
  readonly neverUserVisible: true;
}

export interface TrustedUserPilotReadiness {
  readonly gateVersion: TrustedUserPilotGateVersion;
  readonly readinessLevel: "limited_ready";
  readonly safetyClassifications: readonly TrustedUserPilotSafetyClassification[];
  readonly blockingIssues: readonly TrustedUserPilotBlockingIssue[];
  readonly warnings: readonly TrustedUserPilotWarning[];
  readonly operationalConstraints: readonly TrustedUserPilotConstraint[];
  readonly allowedScope: TrustedUserPilotScope;
  readonly stopConditions: readonly TrustedUserPilotStopCondition[];
  readonly escalationRules: readonly TrustedUserPilotEscalationRule[];
  readonly notes: readonly string[];
  readonly neverUserVisible: true;
}
