/**
 * Manual Review Before User-Visible Output Contract Types (Phase 8.3E).
 *
 * Defines the typed contract for the mandatory human-in-the-loop manual review
 * gate that must be passed before any future user-visible output authorization
 * contract can proceed. This contract builds on Phase 8.3D (AI Output
 * Governance Recheck Contract).
 *
 * Key governance invariants:
 *   - Manual review does not authorize user-visible output by itself
 *   - A separate User-Visible Output Authorization Contract is required next
 *   - Automatic system approval and anonymous review are explicitly blocked
 *   - Operator and reviewer identities are required
 *   - Reviewer responsibility must be explicitly acknowledged
 *   - Legal certainty and deadline claims without evidence remain blocked
 *   - Unsupported claims, unsafe certainty, and missing context remain blocked
 *   - Content storage is blocked; only safe metadata is permitted
 *
 * ISOLATION NOTE:
 *   Phase 8.3B isolated `app/api/smart-talk/route.ts` Branch C,
 *   `lib/vaylo/smart-talk/run-smart-talk.ts`, and
 *   `lib/vaylo/smart-talk/extract-text-from-image.ts` from the governance chain.
 *   That isolation is fully preserved here.
 *
 * This module does NOT:
 * - read process.env
 * - call any live LLM or make HTTP requests
 * - generate AI output
 * - store model output
 * - authorize user-visible output
 * - emit user-visible output
 * - import, call, or wrap run-smart-talk.ts
 * - import, call, or wrap extract-text-from-image.ts
 * - forward any actual input to a live model
 * - persist any records or store user content
 * - modify DB/storage schema or API routes
 * - execute manual review
 * - authorize pilotRunNow, public launch, or persistence
 * - modify UI
 *
 * Safety invariants on ManualReviewBeforeUserVisibleOutputContractInput (all literal):
 * - operatorIdentityPresent: true
 * - reviewerIdentityPresent: true
 * - reviewerRolePresent: true
 * - reviewerResponsibilityAcknowledged: true
 * - automaticSystemApprovalAllowed: false
 * - anonymousReviewAllowed: false
 * - selectedDispositionAllowsUserVisibleOutputNow: false
 * - userVisibleOutputAuthorizationRequiredNext: true
 * - governanceRecheckResultPresent: true
 * - evidenceMetadataOnly: true
 * - contentStorageAllowed: false
 * - legalCertaintyWithoutEvidenceAllowed: false
 * - deadlineClaimWithoutEvidenceAllowed: false
 * - unsupportedClaimAllowed: false
 * - unsafeCertaintyAllowed: false
 * - missingContextAllowed: false
 * - partialInputLimitationRequired: true
 * - userVisibleOutputAuthorized: false
 * - emittedToUserNow: false
 * - aiOutputGenerationPerformed: false
 * - aiOutputGenerated: false
 * - modelOutputStored: false
 * - persistenceUsed: false
 * - liveLLMCallPerformed: false
 * - realInputProcessedByContract: false
 * - rawInputForwarded: false
 * - redactedInputForwardingExecuted: false
 * - runSmartTalkCalledOrImported: false
 * - publicBranchCCalled: false
 * - extractTextFromImageCalledOrImported: false
 * - all contains* flags: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - publicRuntimeEnabled: false
 * - neverUserVisible: true
 *
 * Safety invariants on ManualReviewBeforeUserVisibleOutputContractResult (all literal):
 * - readyForLiveLLMRuntime: false
 * - readyForConnectedAiRuntimeExecution: false
 * - readyForRealOperatorPilotRun: false
 * - readyForPilotRunNow: false
 * - readyForPublicLaunch: false
 * - readyForPersistence: false
 * - userVisibleOutputAuthorized: false
 * - emittedToUserNow: false
 * - aiOutputGenerationPerformed: false
 * - aiOutputGenerated: false
 * - modelOutputStored: false
 * - persistenceUsed: false
 * - liveLLMCalled: false
 * - realInputProcessed: false
 * - rawInputForwarded: false
 * - redactedInputForwardingExecuted: false
 * - runSmartTalkCalledOrImported: false
 * - publicBranchCCalled: false
 * - extractTextFromImageCalledOrImported: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - publicRuntimeEnabled: false
 * - httpCallMade: false
 * - apiRouteCalled: false
 * - apiRouteModifiedByManualReviewContract: false
 * - existingRuntimeModifiedByManualReviewContract: false
 * - uiTouched: false
 * - databaseOrStorageModifiedByManualReviewContract: false
 * - neverUserVisible: true
 */

// ── Contract status ───────────────────────────────────────────────────────────

export type ManualReviewBeforeUserVisibleOutputContractStatus =
  | "valid"
  | "rejected";

// ── Reviewer roles ────────────────────────────────────────────────────────────

export type ManualReviewRole = "operator" | "reviewer" | "safety_reviewer";

// ── Identity requirements ─────────────────────────────────────────────────────

export type ManualReviewIdentityRequirement =
  | "operator_identity_required"
  | "reviewer_identity_required"
  | "reviewer_role_required"
  | "operator_and_reviewer_must_be_distinct_for_high_risk"
  | "reviewer_must_acknowledge_responsibility"
  | "automatic_system_approval_blocked"
  | "anonymous_review_blocked"
  | "missing_reviewer_identity_blocks_progress";

// ── Review dispositions ───────────────────────────────────────────────────────

export type ManualReviewDisposition =
  | "candidate_safe_for_user_visible_authorization_contract"
  | "blocked_due_to_unsupported_claims"
  | "blocked_due_to_unsafe_certainty"
  | "blocked_due_to_deadline_uncertainty"
  | "blocked_due_to_missing_context"
  | "blocked_due_to_policy_violation"
  | "blocked_due_to_high_risk_domain"
  | "requires_rework"
  | "requires_expert_referral";

// ── Required evidence metadata ────────────────────────────────────────────────

export type ManualReviewRequiredEvidenceMetadata =
  | "governance_recheck_result_present"
  | "trust_boundary_result_present"
  | "blocked_claim_category_result_present"
  | "uncertainty_preservation_result_present"
  | "partial_input_limitation_result_present"
  | "legal_certainty_check_result_present"
  | "deadline_evidence_check_result_present"
  | "next_step_safety_check_result_present"
  | "wording_governance_check_result_present"
  | "manual_reviewer_identity_present"
  | "manual_reviewer_disposition_present"
  | "manual_reviewer_acknowledgment_present"
  | "no_content_storage_confirmed"
  | "user_visible_output_still_blocked";

// ── Block conditions ──────────────────────────────────────────────────────────

export type ManualReviewBlockCondition =
  | "unsupported_legal_certainty_claim"
  | "unsupported_deadline_claim"
  | "unsupported_authority_instruction_claim"
  | "unsafe_must_language"
  | "guaranteed_outcome_claim"
  | "missing_context_not_preserved"
  | "partial_input_limitation_missing"
  | "high_risk_immigration_consequence"
  | "high_risk_financial_sanction"
  | "high_risk_appeal_or_objection_window"
  | "autonomous_action_instruction"
  | "direct_user_visible_output_attempt"
  | "persistence_or_storage_attempt"
  | "public_runtime_attempt";

// ── Checklist items ───────────────────────────────────────────────────────────

export type ManualReviewChecklistItem =
  | "identity_requirements_reviewed"
  | "reviewer_responsibility_acknowledged"
  | "governance_recheck_result_reviewed"
  | "evidence_metadata_reviewed"
  | "disposition_reviewed"
  | "block_conditions_reviewed"
  | "legal_certainty_block_reviewed"
  | "deadline_uncertainty_block_reviewed"
  | "missing_context_preservation_reviewed"
  | "partial_input_limitation_reviewed"
  | "next_step_safety_reviewed"
  | "direct_user_visible_output_blocked"
  | "persistence_blocked"
  | "public_runtime_blocked"
  | "live_llm_runtime_still_blocked_by_this_contract"
  | "existing_runtime_isolation_preserved"
  | "no_ai_output_generated_by_this_contract"
  | "no_model_output_stored_by_this_contract";

// ── Rejection reasons ─────────────────────────────────────────────────────────

export type ManualReviewBeforeUserVisibleOutputRejectionReason =
  | "ai_output_governance_recheck_not_ready"
  | "missing_identity_requirement"
  | "anonymous_review_detected"
  | "automatic_system_approval_detected"
  | "missing_required_evidence_metadata"
  | "missing_disposition"
  | "unsafe_disposition_detected"
  | "missing_block_condition"
  | "missing_required_checklist_item"
  | "reviewer_acknowledgment_missing"
  | "reviewer_responsibility_missing"
  | "user_visible_output_authorized_too_early"
  | "emitted_to_user_claim_detected"
  | "ai_output_generation_claim_detected"
  | "model_output_storage_claim_detected"
  | "persistence_claim_detected"
  | "live_llm_call_claim_detected"
  | "real_input_processed_claim_detected"
  | "raw_input_forwarding_claim_detected"
  | "redacted_input_forwarding_claim_detected"
  | "run_smart_talk_call_claim_detected"
  | "public_branch_c_call_claim_detected"
  | "ocr_runtime_call_claim_detected"
  | "legal_certainty_allowed_without_evidence"
  | "deadline_claim_allowed_without_evidence"
  | "unsupported_claim_allowed"
  | "unsafe_certainty_allowed"
  | "missing_context_allowed"
  | "partial_input_limitation_missing"
  | "forbidden_secret_detected"
  | "forbidden_env_value_detected"
  | "forbidden_api_key_detected"
  | "forbidden_pii_detected"
  | "forbidden_raw_text_detected"
  | "forbidden_redacted_text_detected"
  | "forbidden_document_content_detected"
  | "forbidden_model_output_detected"
  | "unsafe_manual_review_note_detected";

// ── Contract input ────────────────────────────────────────────────────────────

/**
 * Input for the Manual Review Before User-Visible Output Contract validation.
 *
 * `selectedDispositionAllowsUserVisibleOutputNow: false` is a critical safety
 * invariant: the review disposition selected in this planning contract can never
 * directly authorize output. A separate User-Visible Output Authorization
 * Contract is always required next.
 *
 * `automaticSystemApprovalAllowed: false` and `anonymousReviewAllowed: false`
 * enforce the human-in-the-loop requirement absolutely.
 *
 * `evidenceMetadataOnly: true` and `contentStorageAllowed: false` ensure that
 * no user content, model output, or sensitive data is retained by this contract.
 */
export interface ManualReviewBeforeUserVisibleOutputContractInput {
  readonly contractId: string;
  readonly epochId: "8.3E";
  readonly previousPhaseId: "8.3D";

  readonly aiOutputGovernanceRecheckReady: boolean;

  readonly identityRequirements: readonly ManualReviewIdentityRequirement[];
  readonly allowedReviewerRoles: readonly ManualReviewRole[];
  readonly dispositionOptions: readonly ManualReviewDisposition[];
  readonly requiredEvidenceMetadata: readonly ManualReviewRequiredEvidenceMetadata[];
  readonly blockConditions: readonly ManualReviewBlockCondition[];
  readonly checklistConfirmed: readonly ManualReviewChecklistItem[];

  readonly operatorIdentityPresent: true;
  readonly reviewerIdentityPresent: true;
  readonly reviewerRolePresent: true;
  readonly reviewerResponsibilityAcknowledged: true;
  readonly automaticSystemApprovalAllowed: false;
  readonly anonymousReviewAllowed: false;

  readonly selectedDisposition: ManualReviewDisposition;
  readonly selectedDispositionAllowsUserVisibleOutputNow: false;
  readonly userVisibleOutputAuthorizationRequiredNext: true;

  readonly governanceRecheckResultPresent: true;
  readonly evidenceMetadataOnly: true;
  readonly contentStorageAllowed: false;

  readonly legalCertaintyWithoutEvidenceAllowed: false;
  readonly deadlineClaimWithoutEvidenceAllowed: false;
  readonly unsupportedClaimAllowed: false;
  readonly unsafeCertaintyAllowed: false;
  readonly missingContextAllowed: false;
  readonly partialInputLimitationRequired: true;

  readonly userVisibleOutputAuthorized: false;
  readonly emittedToUserNow: false;
  readonly aiOutputGenerationPerformed: false;
  readonly aiOutputGenerated: false;
  readonly modelOutputStored: false;
  readonly persistenceUsed: false;
  readonly liveLLMCallPerformed: false;
  readonly realInputProcessedByContract: false;
  readonly rawInputForwarded: false;
  readonly redactedInputForwardingExecuted: false;

  readonly runSmartTalkCalledOrImported: false;
  readonly publicBranchCCalled: false;
  readonly extractTextFromImageCalledOrImported: false;

  readonly operatorManualReviewAcknowledgment: string;
  readonly reviewerManualReviewAcknowledgment: string;
  readonly notes: readonly string[];

  readonly containsRealUserInput: false;
  readonly containsRawInputText: false;
  readonly containsRedactedText: false;
  readonly containsFullDraftText: false;
  readonly containsModelOutput: false;
  readonly containsSecret: false;
  readonly containsEnvValue: false;
  readonly containsApiKey: false;
  readonly containsUserPii: false;
  readonly containsDocumentContent: false;

  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;

  readonly neverUserVisible: true;
}

// ── Contract result ───────────────────────────────────────────────────────────

/**
 * Result of validating a `ManualReviewBeforeUserVisibleOutputContractInput`.
 *
 * `readyForUserVisibleOutputAuthorizationContract` is `true` only when
 * `accepted === true`. Even then, no output is authorized — only the next
 * contract may begin.
 *
 * `safeManualReviewMetadata` records only counts and the disposition label —
 * no env values, secrets, API keys, user content, or model output.
 */
export interface ManualReviewBeforeUserVisibleOutputContractResult {
  readonly contractId: string;
  readonly epochId: "8.3E";
  readonly status: ManualReviewBeforeUserVisibleOutputContractStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly ManualReviewBeforeUserVisibleOutputRejectionReason[];

  readonly safeManualReviewMetadata: {
    readonly identityRequirementCount: number;
    readonly allowedReviewerRoleCount: number;
    readonly dispositionOptionCount: number;
    readonly evidenceMetadataRequirementCount: number;
    readonly blockConditionCount: number;
    readonly checklistPassedCount: number;
    readonly selectedDisposition: ManualReviewDisposition;
  };

  readonly readyForUserVisibleOutputAuthorizationContract: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly userVisibleOutputAuthorized: false;
  readonly emittedToUserNow: false;
  readonly aiOutputGenerationPerformed: false;
  readonly aiOutputGenerated: false;
  readonly modelOutputStored: false;
  readonly persistenceUsed: false;
  readonly liveLLMCalled: false;
  readonly realInputProcessed: false;
  readonly rawInputForwarded: false;
  readonly redactedInputForwardingExecuted: false;

  readonly runSmartTalkCalledOrImported: false;
  readonly publicBranchCCalled: false;
  readonly extractTextFromImageCalledOrImported: false;

  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;

  readonly httpCallMade: false;
  readonly apiRouteCalled: false;
  readonly apiRouteModifiedByManualReviewContract: false;
  readonly existingRuntimeModifiedByManualReviewContract: false;
  readonly uiTouched: false;
  readonly databaseOrStorageModifiedByManualReviewContract: false;
  readonly neverUserVisible: true;
}

// ── Check result ──────────────────────────────────────────────────────────────

/**
 * Result of `runManualReviewBeforeUserVisibleOutputContractCheck()` (Phase 8.3E).
 *
 * `allPassed` is true when all three sub-checks pass:
 * 1. The 8.3D AI Output Governance Recheck dependency is verified.
 * 2. The synthetic manual review input is accepted.
 * 3. All tamper cases are rejected.
 *
 * `readyForUserVisibleOutputAuthorizationContract` is the only positive gate.
 * No AI output is generated, no LLM is called, no output is authorized, and
 * no existing runtime path is touched.
 */
export interface ManualReviewBeforeUserVisibleOutputContractCheckResult {
  readonly checkId: "8.3E";
  readonly allPassed: boolean;
  readonly aiOutputGovernanceRecheckReady: boolean;
  readonly syntheticManualReviewBeforeUserVisibleOutputAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForUserVisibleOutputAuthorizationContract: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly userVisibleOutputAuthorized: false;
  readonly emittedToUserNow: false;
  readonly aiOutputGenerated: false;
  readonly modelOutputStored: false;
  readonly persistenceUsed: false;
  readonly liveLLMCalled: false;
  readonly realInputProcessed: false;
  readonly rawInputForwarded: false;
  readonly redactedInputForwardingExecuted: false;

  readonly runSmartTalkCalledOrImported: false;
  readonly publicBranchCCalled: false;
  readonly extractTextFromImageCalledOrImported: false;

  readonly publicRuntimeEnabled: false;
  readonly neverUserVisible: true;

  readonly notes: readonly string[];
}

// ── Exported constants ────────────────────────────────────────────────────────

/** All identity requirements that must be present in a valid input. */
export const REQUIRED_MANUAL_REVIEW_IDENTITY_REQUIREMENTS: readonly ManualReviewIdentityRequirement[] =
  [
    "operator_identity_required",
    "reviewer_identity_required",
    "reviewer_role_required",
    "operator_and_reviewer_must_be_distinct_for_high_risk",
    "reviewer_must_acknowledge_responsibility",
    "automatic_system_approval_blocked",
    "anonymous_review_blocked",
    "missing_reviewer_identity_blocks_progress",
  ] as const;

/** All reviewer roles that must be present in a valid input. */
export const ALLOWED_MANUAL_REVIEWER_ROLES: readonly ManualReviewRole[] = [
  "operator",
  "reviewer",
  "safety_reviewer",
] as const;

/** All review dispositions that must be present in a valid input. */
export const REQUIRED_MANUAL_REVIEW_DISPOSITIONS: readonly ManualReviewDisposition[] =
  [
    "candidate_safe_for_user_visible_authorization_contract",
    "blocked_due_to_unsupported_claims",
    "blocked_due_to_unsafe_certainty",
    "blocked_due_to_deadline_uncertainty",
    "blocked_due_to_missing_context",
    "blocked_due_to_policy_violation",
    "blocked_due_to_high_risk_domain",
    "requires_rework",
    "requires_expert_referral",
  ] as const;

/** All evidence metadata requirements that must be present in a valid input. */
export const REQUIRED_MANUAL_REVIEW_EVIDENCE_METADATA: readonly ManualReviewRequiredEvidenceMetadata[] =
  [
    "governance_recheck_result_present",
    "trust_boundary_result_present",
    "blocked_claim_category_result_present",
    "uncertainty_preservation_result_present",
    "partial_input_limitation_result_present",
    "legal_certainty_check_result_present",
    "deadline_evidence_check_result_present",
    "next_step_safety_check_result_present",
    "wording_governance_check_result_present",
    "manual_reviewer_identity_present",
    "manual_reviewer_disposition_present",
    "manual_reviewer_acknowledgment_present",
    "no_content_storage_confirmed",
    "user_visible_output_still_blocked",
  ] as const;

/** All block conditions that must be present in a valid input. */
export const REQUIRED_MANUAL_REVIEW_BLOCK_CONDITIONS: readonly ManualReviewBlockCondition[] =
  [
    "unsupported_legal_certainty_claim",
    "unsupported_deadline_claim",
    "unsupported_authority_instruction_claim",
    "unsafe_must_language",
    "guaranteed_outcome_claim",
    "missing_context_not_preserved",
    "partial_input_limitation_missing",
    "high_risk_immigration_consequence",
    "high_risk_financial_sanction",
    "high_risk_appeal_or_objection_window",
    "autonomous_action_instruction",
    "direct_user_visible_output_attempt",
    "persistence_or_storage_attempt",
    "public_runtime_attempt",
  ] as const;

/** All checklist items that must be confirmed in a valid input. */
export const REQUIRED_MANUAL_REVIEW_CHECKLIST: readonly ManualReviewChecklistItem[] =
  [
    "identity_requirements_reviewed",
    "reviewer_responsibility_acknowledged",
    "governance_recheck_result_reviewed",
    "evidence_metadata_reviewed",
    "disposition_reviewed",
    "block_conditions_reviewed",
    "legal_certainty_block_reviewed",
    "deadline_uncertainty_block_reviewed",
    "missing_context_preservation_reviewed",
    "partial_input_limitation_reviewed",
    "next_step_safety_reviewed",
    "direct_user_visible_output_blocked",
    "persistence_blocked",
    "public_runtime_blocked",
    "live_llm_runtime_still_blocked_by_this_contract",
    "existing_runtime_isolation_preserved",
    "no_ai_output_generated_by_this_contract",
    "no_model_output_stored_by_this_contract",
  ] as const;

/**
 * Required statements that must appear in both operator and reviewer
 * manual review acknowledgments.
 */
export const REQUIRED_MANUAL_REVIEW_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that manual review does not authorize user-visible output by itself.",
    "I acknowledge that AI output remains blocked from direct display.",
    "I acknowledge that unsupported legal certainty and deadline claims must remain blocked.",
    "I acknowledge that user-visible output requires a separate authorization contract.",
    "I acknowledge that live LLM runtime, persistence, and public launch remain blocked.",
  ] as const;

/**
 * Strings that must never appear in any manual review field or notes.
 */
export const FORBIDDEN_MANUAL_REVIEW_BEFORE_USER_VISIBLE_OUTPUT_STRINGS: readonly string[] =
  [
    "sk-",
    "OPENAI_API_KEY=",
    "VAYLO_INTERNAL_RUNTIME_SECRET=",
    "process.env",
    "apiKey",
    "internalSecret",
    "rawInputText",
    "redactedText",
    "fullDraftText",
    "modelOutput",
    "stored user input",
    "stored redacted text",
    "stored model output",
    "IBAN",
    "Steuer-ID",
    "Aktenzeichen",
    "Sehr geehrter",
    "BG-Nr",
    "john@example.com",
    "+49 170 1234567",
    "Name:",
    "Adresse:",
    "Geburtsdatum:",
    "Kind:",
    "Mietvertrag",
    "Kündigung",
    "Abschiebung",
    "Sie müssen",
    "garantiert",
    "fristlos sicher",
    "rechtlich sicher",
    "approved for user display",
    "auto-approved",
    "show to user now",
  ] as const;
