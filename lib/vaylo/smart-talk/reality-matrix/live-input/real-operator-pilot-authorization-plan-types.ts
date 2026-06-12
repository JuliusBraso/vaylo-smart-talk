/**
 * Real Operator Pilot Authorization Plan Types (Phase 8.2M-0).
 *
 * Defines the typed contract for the formal authorization plan that must be
 * completed before the first real operator pilot run can be authorized.
 *
 * This module does NOT:
 * - authorize a real pilot run
 * - persist records
 * - store content (raw text, secrets, PII, model output, etc.)
 * - call any live LLM
 * - make HTTP requests
 * - read process.env
 * - modify API routes or UI
 *
 * A real operator pilot run is blocked until all required prerequisites,
 * policies, identity contracts, and abort protocols are defined in 8.2M-1+.
 *
 * Safety invariants on RealOperatorPilotAuthorizationPlanCheckResult (all literal):
 * - readyForRealOperatorPilotRun: false
 * - readyForPilotRunNow: false
 * - readyForPublicLaunch: false
 * - readyForLiveLLMRuntime: false
 * - readyForPersistence: false
 * - readyForPhotoOcrRuntime: false
 * - readyForFileUploadRuntime: false
 * - readyForPaymentRuntime: false
 * - realPilotRunExecuted: false
 * - realUserInputProcessed: false
 * - rawTextStored: false
 * - redactedTextStored: false
 * - fullDraftTextStored: false
 * - modelOutputStored: false
 * - secretStored: false
 * - userPiiStored: false
 * - documentContentStored: false
 * - httpCallMade: false
 * - apiRouteCalled: false
 * - liveLLMCalled: false
 * - apiRouteModifiedByPlan: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - emittedToUserNow: false
 * - neverUserVisible: true
 */

// ── Status ─────────────────────────────────────────────────────────────────────

export type RealOperatorPilotAuthorizationPlanStatus =
  | "ready_for_phase_8_2m_1"
  | "blocked";

// ── Prerequisites ──────────────────────────────────────────────────────────────

export type RealOperatorPilotAuthorizationPrerequisite =
  | "phase_8_2l_closed_with_warnings"
  | "named_human_operator_required"
  | "named_human_reviewer_required"
  | "real_environment_attestation_required"
  | "internal_runtime_secret_attestation_required"
  | "allowlist_attestation_required"
  | "scenario_allowlist_attestation_required"
  | "kill_switch_attestation_required"
  | "abort_monitoring_required"
  | "real_input_policy_required"
  | "legal_disclaimer_policy_required"
  | "completeness_warning_policy_required"
  | "evidence_policy_required"
  | "no_persistence_variant_or_persistence_policy_required"
  | "pii_handling_policy_required"
  | "manual_review_policy_required"
  | "incident_response_policy_required"
  | "production_monitoring_policy_required"
  | "abuse_control_policy_required"
  | "post_run_audit_required";

// ── Blocked capabilities ───────────────────────────────────────────────────────

export type RealOperatorPilotAuthorizationBlockedCapability =
  | "public_runtime"
  | "anonymous_public_access"
  | "production_user_visible_output"
  | "live_llm_without_operator_authorization"
  | "persistence_without_policy"
  | "dna_save"
  | "offline_save"
  | "photo_ocr_runtime"
  | "file_upload_runtime"
  | "payment_runtime"
  | "multilingual_public_runtime"
  | "automatic_deadline_claims"
  | "legal_certainty_claims"
  | "unattended_execution"
  | "unrestricted_real_user_input";

// ── Open items ─────────────────────────────────────────────────────────────────

export type RealOperatorPilotAuthorizationOpenItem =
  | "operator_identity_contract_not_yet_defined"
  | "reviewer_identity_contract_not_yet_defined"
  | "real_environment_attestation_contract_not_yet_defined"
  | "abort_protocol_not_yet_defined"
  | "real_input_handling_policy_not_yet_defined"
  | "legal_disclaimer_runtime_not_yet_finalized"
  | "completeness_warning_runtime_not_yet_finalized"
  | "evidence_persistence_decision_not_yet_finalized"
  | "pii_handling_policy_not_yet_finalized"
  | "manual_review_policy_not_yet_finalized"
  | "incident_response_policy_not_yet_finalized"
  | "monitoring_policy_not_yet_finalized"
  | "abuse_controls_not_yet_finalized"
  | "post_run_audit_not_yet_defined";

// ── Plan check result ──────────────────────────────────────────────────────────

/**
 * The typed result of the 8.2M-0 Real Operator Pilot Authorization Plan check.
 *
 * `readyForRealOperatorPilotRun` is literal `false` — no real pilot run is
 * authorized by this plan. The planning flags (`readyForOperatorIdentityContract`,
 * etc.) may be `true` when the prior 8.2L closure is verified, signalling
 * that 8.2M-1 and later phases may begin.
 *
 * All content-storage flags and safety invariants are literal types
 * that cannot be changed without a TypeScript compile error.
 */
export interface RealOperatorPilotAuthorizationPlanCheckResult {
  readonly planId: "8.2M-0";
  readonly planVersion: "real-operator-pilot-authorization-plan-v1";
  readonly status: RealOperatorPilotAuthorizationPlanStatus;

  readonly prerequisites: readonly RealOperatorPilotAuthorizationPrerequisite[];
  readonly blockedCapabilities: readonly RealOperatorPilotAuthorizationBlockedCapability[];
  readonly openItems: readonly RealOperatorPilotAuthorizationOpenItem[];

  readonly previousEpochClosureVerified: boolean;
  readonly previousEpochVerdictAccepted: boolean;
  readonly previousEpochReadyForNextPlanning: boolean;

  readonly readyForOperatorIdentityContract: boolean;
  readonly readyForRealEnvironmentAttestationContract: boolean;
  readonly readyForAbortProtocol: boolean;
  readonly readyForRealInputPolicy: boolean;
  readonly readyForEvidencePolicy: boolean;
  readonly readyForPostRunAuditPlanning: boolean;

  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForLiveLLMRuntime: false;
  readonly readyForPersistence: false;
  readonly readyForPhotoOcrRuntime: false;
  readonly readyForFileUploadRuntime: false;
  readonly readyForPaymentRuntime: false;

  readonly realPilotRunExecuted: false;
  readonly realUserInputProcessed: false;
  readonly rawTextStored: false;
  readonly redactedTextStored: false;
  readonly fullDraftTextStored: false;
  readonly modelOutputStored: false;
  readonly secretStored: false;
  readonly userPiiStored: false;
  readonly documentContentStored: false;

  readonly httpCallMade: false;
  readonly apiRouteCalled: false;
  readonly liveLLMCalled: false;
  readonly apiRouteModifiedByPlan: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;

  readonly notes: readonly string[];
}

// ── Exported constants ─────────────────────────────────────────────────────────

export const REQUIRED_REAL_OPERATOR_PILOT_AUTHORIZATION_PREREQUISITES: readonly RealOperatorPilotAuthorizationPrerequisite[] =
  [
    "phase_8_2l_closed_with_warnings",
    "named_human_operator_required",
    "named_human_reviewer_required",
    "real_environment_attestation_required",
    "internal_runtime_secret_attestation_required",
    "allowlist_attestation_required",
    "scenario_allowlist_attestation_required",
    "kill_switch_attestation_required",
    "abort_monitoring_required",
    "real_input_policy_required",
    "legal_disclaimer_policy_required",
    "completeness_warning_policy_required",
    "evidence_policy_required",
    "no_persistence_variant_or_persistence_policy_required",
    "pii_handling_policy_required",
    "manual_review_policy_required",
    "incident_response_policy_required",
    "production_monitoring_policy_required",
    "abuse_control_policy_required",
    "post_run_audit_required",
  ] as const;

export const BLOCKED_REAL_OPERATOR_PILOT_CAPABILITIES: readonly RealOperatorPilotAuthorizationBlockedCapability[] =
  [
    "public_runtime",
    "anonymous_public_access",
    "production_user_visible_output",
    "live_llm_without_operator_authorization",
    "persistence_without_policy",
    "dna_save",
    "offline_save",
    "photo_ocr_runtime",
    "file_upload_runtime",
    "payment_runtime",
    "multilingual_public_runtime",
    "automatic_deadline_claims",
    "legal_certainty_claims",
    "unattended_execution",
    "unrestricted_real_user_input",
  ] as const;

export const REAL_OPERATOR_PILOT_AUTHORIZATION_OPEN_ITEMS: readonly RealOperatorPilotAuthorizationOpenItem[] =
  [
    "operator_identity_contract_not_yet_defined",
    "reviewer_identity_contract_not_yet_defined",
    "real_environment_attestation_contract_not_yet_defined",
    "abort_protocol_not_yet_defined",
    "real_input_handling_policy_not_yet_defined",
    "legal_disclaimer_runtime_not_yet_finalized",
    "completeness_warning_runtime_not_yet_finalized",
    "evidence_persistence_decision_not_yet_finalized",
    "pii_handling_policy_not_yet_finalized",
    "manual_review_policy_not_yet_finalized",
    "incident_response_policy_not_yet_finalized",
    "monitoring_policy_not_yet_finalized",
    "abuse_controls_not_yet_finalized",
    "post_run_audit_not_yet_defined",
  ] as const;
