/**
 * Redacted Input Forwarding Contract Types (Phase 8.3C).
 *
 * Defines the typed forwarding contract that specifies the conditions under
 * which redacted input may be forwarded to a future governance-controlled AI
 * adapter. This contract:
 *   - explicitly preserves the existing runtime isolation established in 8.3B
 *   - defines which input categories are allowed or blocked for forwarding
 *   - requires complete redaction proof and mandatory manual review clearance
 *   - blocks forwarding under redaction uncertainty or high-risk legal uncertainty
 *   - sets the only positive readiness gate: `readyForAiOutputGovernanceRecheckContract`
 *
 * ISOLATION NOTE:
 *   Phase 8.3B isolated `app/api/smart-talk/route.ts` Branch C,
 *   `lib/vaylo/smart-talk/run-smart-talk.ts`, and
 *   `lib/vaylo/smart-talk/extract-text-from-image.ts` from the governance chain.
 *   That isolation is preserved here. `runSmartTalkCalledOrImported`,
 *   `publicBranchCCalled`, and `extractTextFromImageCalledOrImported` are all
 *   literal `false` on both input and result.
 *
 * This module does NOT:
 * - read process.env
 * - call any live LLM
 * - import, call, or wrap run-smart-talk.ts
 * - import, call, or wrap extract-text-from-image.ts
 * - call fetch() or make HTTP requests
 * - forward any actual input (raw or redacted) to a live model
 * - authorize live LLM runtime
 * - generate AI output
 * - process actual user input
 * - authorize user-visible output
 * - persist any records
 * - store user content, env values, or secrets
 * - modify DB/storage schema or API routes
 * - authorize pilotRunNow, public launch, or persistence
 * - modify UI
 *
 * Safety invariants on RedactedInputForwardingContractInput (all literal):
 * - manualReviewClearanceRequired: true
 * - manualReviewClearanceGrantedByContract: false
 * - redactionUncertaintyBlocksForwarding: true
 * - highRiskUncertaintyBlocksForwarding: true
 * - rawInputForwardingAllowed: false
 * - redactedInputForwardingExecuted: false
 * - realInputProcessedByContract: false
 * - liveLLMCallPerformed: false
 * - aiOutputGenerated: false
 * - modelOutputStored: false
 * - userVisibleOutputAllowed: false
 * - runSmartTalkCalledOrImported: false
 * - publicBranchCCalled: false
 * - extractTextFromImageCalledOrImported: false
 * - containsRealUserInput: false
 * - containsRawInputText: false
 * - containsRedactedText: false
 * - containsFullDraftText: false
 * - containsModelOutput: false
 * - containsSecret: false
 * - containsEnvValue: false
 * - containsApiKey: false
 * - containsUserPii: false
 * - containsDocumentContent: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - publicRuntimeEnabled: false
 * - emittedToUserNow: false
 * - neverUserVisible: true
 *
 * Safety invariants on RedactedInputForwardingContractResult (all literal):
 * - readyForLiveLLMRuntime: false
 * - readyForConnectedAiRuntimeExecution: false
 * - readyForRealOperatorPilotRun: false
 * - readyForPilotRunNow: false
 * - readyForPublicLaunch: false
 * - readyForPersistence: false
 * - rawInputForwardingAllowed: false
 * - redactedInputForwardingExecuted: false
 * - realInputProcessed: false
 * - liveLLMCalled: false
 * - aiOutputGenerated: false
 * - modelOutputStored: false
 * - userVisibleOutputAllowed: false
 * - runSmartTalkCalledOrImported: false
 * - publicBranchCCalled: false
 * - extractTextFromImageCalledOrImported: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - publicRuntimeEnabled: false
 * - emittedToUserNow: false
 * - httpCallMade: false
 * - apiRouteCalled: false
 * - apiRouteModifiedByForwardingContract: false
 * - existingRuntimeModifiedByForwardingContract: false
 * - uiTouched: false
 * - databaseOrStorageModifiedByForwardingContract: false
 * - neverUserVisible: true
 */

// ── Contract status ───────────────────────────────────────────────────────────

export type RedactedInputForwardingContractStatus = "valid" | "rejected";

// ── Forwarding target policy ──────────────────────────────────────────────────

export type RedactedInputForwardingTargetPolicy =
  | "dedicated_governance_ai_adapter_required"
  | "existing_run_smart_talk_not_authorized_yet"
  | "public_branch_c_not_authorized"
  | "ocr_runtime_not_authorized_for_text_forwarding"
  | "adapter_selection_requires_future_contract";

// ── Clearance levels ──────────────────────────────────────────────────────────

export type RedactedInputForwardingClearanceLevel =
  | "no_forwarding"
  | "policy_defined_only"
  | "redacted_input_ready_for_future_synthetic_adapter_test";

// ── Allowed input categories ──────────────────────────────────────────────────

export type RedactedInputCategoryAllowedForForwarding =
  | "synthetic_control_text"
  | "redacted_bureaucratic_excerpt"
  | "redacted_operator_test_question";

// ── Blocked input categories ──────────────────────────────────────────────────

export type RedactedInputCategoryBlockedForForwarding =
  | "raw_user_input"
  | "unredacted_bureaucratic_letter"
  | "photo_ocr_input"
  | "file_upload_input"
  | "full_document_text"
  | "multi_document_bundle"
  | "public_anonymous_input"
  | "unattended_input"
  | "third_party_sensitive_data"
  | "raw_pii_input"
  | "raw_bank_or_tax_identifier_input"
  | "raw_children_data_input"
  | "medical_emergency_input"
  | "deportation_deadline_uncertain_input"
  | "legal_appeal_deadline_uncertain_input"
  | "secrets_or_api_keys_input";

// ── Redaction proof requirements ──────────────────────────────────────────────

export type RedactionProofRequirement =
  | "names_redacted"
  | "addresses_redacted"
  | "phone_numbers_redacted"
  | "emails_redacted"
  | "iban_redacted"
  | "steuer_id_redacted"
  | "aktenzeichen_redacted"
  | "bg_nr_redacted"
  | "insurance_numbers_redacted"
  | "children_data_redacted"
  | "secret_or_api_key_redacted"
  | "raw_identifiers_removed"
  | "partial_input_marked"
  | "authority_name_preserved_only_when_relevant"
  | "document_type_preserved_only_when_relevant"
  | "deadline_preserved_only_with_uncertainty_label"
  | "amount_preserved_only_when_needed_for_explanation"
  | "manual_reviewer_clearance_required"
  | "redaction_uncertainty_blocks_forwarding"
  | "high_risk_legal_uncertainty_blocks_forwarding";

// ── Forwarding preconditions ──────────────────────────────────────────────────

export type ForwardingPrecondition =
  | "live_llm_boundary_contract_ready"
  | "existing_runtime_isolation_preserved"
  | "target_adapter_not_selected_yet"
  | "raw_input_forwarding_blocked"
  | "redacted_input_requires_proof"
  | "redacted_input_requires_manual_review_clearance"
  | "redacted_input_requires_partial_input_marker_if_excerpt"
  | "ai_output_governance_recheck_required_next"
  | "ai_output_user_visible_blocked"
  | "persistence_blocked"
  | "public_runtime_blocked"
  | "live_llm_runtime_still_blocked_by_this_contract";

// ── Checklist items ───────────────────────────────────────────────────────────

export type ForwardingChecklistItem =
  | "forwarding_target_policy_reviewed"
  | "allowed_categories_reviewed"
  | "blocked_categories_reviewed"
  | "redaction_proof_requirements_reviewed"
  | "forwarding_preconditions_reviewed"
  | "raw_input_forwarding_blocked"
  | "redacted_input_forwarding_not_executed"
  | "existing_run_smart_talk_not_called"
  | "public_branch_c_not_called"
  | "ocr_runtime_not_called"
  | "live_llm_not_called"
  | "ai_output_not_generated"
  | "user_visible_output_blocked"
  | "persistence_blocked"
  | "public_runtime_blocked"
  | "manual_review_required"
  | "governance_recheck_required_next"
  | "no_real_input_processed_by_this_contract";

// ── Rejection reasons ─────────────────────────────────────────────────────────

export type RedactedInputForwardingRejectionReason =
  | "live_llm_boundary_not_ready"
  | "forwarding_target_policy_missing"
  | "unsafe_forwarding_target_authorized"
  | "missing_allowed_input_category"
  | "missing_blocked_input_category"
  | "missing_redaction_proof_requirement"
  | "missing_forwarding_precondition"
  | "missing_required_checklist_item"
  | "invalid_clearance_level"
  | "raw_input_forwarding_claim_detected"
  | "redacted_input_forwarding_execution_claim_detected"
  | "real_input_processed_claim_detected"
  | "live_llm_call_claim_detected"
  | "ai_output_generation_claim_detected"
  | "model_output_storage_claim_detected"
  | "user_visible_output_claim_detected"
  | "persistence_claim_detected"
  | "public_runtime_claim_detected"
  | "run_smart_talk_call_claim_detected"
  | "public_branch_c_call_claim_detected"
  | "ocr_runtime_call_claim_detected"
  | "missing_manual_review_clearance"
  | "redaction_proof_incomplete"
  | "redaction_uncertainty_not_blocked"
  | "high_risk_uncertainty_not_blocked"
  | "forbidden_secret_detected"
  | "forbidden_env_value_detected"
  | "forbidden_api_key_detected"
  | "forbidden_pii_detected"
  | "forbidden_raw_text_detected"
  | "forbidden_redacted_text_detected"
  | "forbidden_document_content_detected"
  | "forbidden_model_output_detected"
  | "unsafe_forwarding_note_detected";

// ── Contract input ────────────────────────────────────────────────────────────

/**
 * Input for the Redacted Input Forwarding Contract validation.
 *
 * `manualReviewClearanceRequired: true` and
 * `manualReviewClearanceGrantedByContract: false` are paired mandatory safety
 * gates: manual review is always required, but this planning contract never
 * grants that clearance itself — it must be granted at runtime by a human.
 *
 * `redactionUncertaintyBlocksForwarding: true` and
 * `highRiskUncertaintyBlocksForwarding: true` ensure that any incomplete or
 * uncertain redaction, or any high-risk legal context, blocks forwarding.
 *
 * `runSmartTalkCalledOrImported`, `publicBranchCCalled`, and
 * `extractTextFromImageCalledOrImported` are literal `false`, preserving the
 * isolation established in Phase 8.3B.
 */
export interface RedactedInputForwardingContractInput {
  readonly contractId: string;
  readonly epochId: "8.3C";
  readonly previousPhaseId: "8.3B";

  readonly liveLlmBoundaryReady: boolean;

  readonly forwardingTargetPolicies: readonly RedactedInputForwardingTargetPolicy[];
  readonly clearanceLevel: RedactedInputForwardingClearanceLevel;
  readonly allowedInputCategories: readonly RedactedInputCategoryAllowedForForwarding[];
  readonly blockedInputCategories: readonly RedactedInputCategoryBlockedForForwarding[];
  readonly redactionProofRequirements: readonly RedactionProofRequirement[];
  readonly forwardingPreconditions: readonly ForwardingPrecondition[];
  readonly checklistConfirmed: readonly ForwardingChecklistItem[];

  readonly redactionProofComplete: boolean;
  readonly manualReviewClearanceRequired: true;
  readonly manualReviewClearanceGrantedByContract: false;
  readonly redactionUncertaintyBlocksForwarding: true;
  readonly highRiskUncertaintyBlocksForwarding: true;

  readonly rawInputForwardingAllowed: false;
  readonly redactedInputForwardingExecuted: false;
  readonly realInputProcessedByContract: false;
  readonly liveLLMCallPerformed: false;
  readonly aiOutputGenerated: false;
  readonly modelOutputStored: false;
  readonly userVisibleOutputAllowed: false;

  readonly runSmartTalkCalledOrImported: false;
  readonly publicBranchCCalled: false;
  readonly extractTextFromImageCalledOrImported: false;

  readonly operatorForwardingAcknowledgment: string;
  readonly reviewerForwardingAcknowledgment: string;
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

  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly emittedToUserNow: false;

  readonly neverUserVisible: true;
}

// ── Contract result ───────────────────────────────────────────────────────────

/**
 * Result of validating a `RedactedInputForwardingContractInput`.
 *
 * `readyForAiOutputGovernanceRecheckContract` is `true` only when
 * `accepted === true`. All execution, launch, persistence, input-forwarding,
 * and existing-runtime authorization flags are always literal `false`.
 *
 * `safeForwardingMetadata` stores only counts and the clearance level string —
 * no env values, secrets, API keys, user content, or model output.
 */
export interface RedactedInputForwardingContractResult {
  readonly contractId: string;
  readonly epochId: "8.3C";
  readonly status: RedactedInputForwardingContractStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly RedactedInputForwardingRejectionReason[];

  readonly safeForwardingMetadata: {
    readonly forwardingTargetPolicyCount: number;
    readonly allowedInputCategoryCount: number;
    readonly blockedInputCategoryCount: number;
    readonly redactionProofRequirementCount: number;
    readonly forwardingPreconditionCount: number;
    readonly checklistPassedCount: number;
    readonly clearanceLevel: RedactedInputForwardingClearanceLevel;
  };

  readonly readyForAiOutputGovernanceRecheckContract: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly rawInputForwardingAllowed: false;
  readonly redactedInputForwardingExecuted: false;
  readonly realInputProcessed: false;
  readonly liveLLMCalled: false;
  readonly aiOutputGenerated: false;
  readonly modelOutputStored: false;
  readonly userVisibleOutputAllowed: false;

  readonly runSmartTalkCalledOrImported: false;
  readonly publicBranchCCalled: false;
  readonly extractTextFromImageCalledOrImported: false;

  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly emittedToUserNow: false;

  readonly httpCallMade: false;
  readonly apiRouteCalled: false;
  readonly apiRouteModifiedByForwardingContract: false;
  readonly existingRuntimeModifiedByForwardingContract: false;
  readonly uiTouched: false;
  readonly databaseOrStorageModifiedByForwardingContract: false;
  readonly neverUserVisible: true;
}

// ── Check result ──────────────────────────────────────────────────────────────

/**
 * Result of `runRedactedInputForwardingContractCheck()` (Phase 8.3C).
 *
 * `allPassed` is true when all three sub-checks pass:
 * 1. The 8.3B live LLM boundary dependency is verified.
 * 2. The synthetic redacted input forwarding input is accepted.
 * 3. All tamper cases are rejected.
 *
 * `readyForAiOutputGovernanceRecheckContract` is the only positive gate set
 * by this contract. No input is forwarded, no LLM is called, and no existing
 * runtime path is touched.
 */
export interface RedactedInputForwardingContractCheckResult {
  readonly checkId: "8.3C";
  readonly allPassed: boolean;
  readonly liveLlmBoundaryReady: boolean;
  readonly syntheticRedactedInputForwardingAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForAiOutputGovernanceRecheckContract: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly rawInputForwardingAllowed: false;
  readonly redactedInputForwardingExecuted: false;
  readonly realInputProcessed: false;
  readonly liveLLMCalled: false;
  readonly aiOutputGenerated: false;
  readonly modelOutputStored: false;
  readonly persistenceUsed: false;
  readonly publicRuntimeEnabled: false;
  readonly emittedToUserNow: false;

  readonly runSmartTalkCalledOrImported: false;
  readonly publicBranchCCalled: false;
  readonly extractTextFromImageCalledOrImported: false;

  readonly neverUserVisible: true;
  readonly notes: readonly string[];
}

// ── Exported constants ────────────────────────────────────────────────────────

/** All forwarding target policies that must be present in a valid input. */
export const REQUIRED_REDACTED_INPUT_FORWARDING_TARGET_POLICIES: readonly RedactedInputForwardingTargetPolicy[] =
  [
    "dedicated_governance_ai_adapter_required",
    "existing_run_smart_talk_not_authorized_yet",
    "public_branch_c_not_authorized",
    "ocr_runtime_not_authorized_for_text_forwarding",
    "adapter_selection_requires_future_contract",
  ] as const;

/** Allowed input categories for forwarding in a valid contract input. */
export const ALLOWED_REDACTED_INPUT_FORWARDING_CATEGORIES: readonly RedactedInputCategoryAllowedForForwarding[] =
  [
    "synthetic_control_text",
    "redacted_bureaucratic_excerpt",
    "redacted_operator_test_question",
  ] as const;

/** Blocked input categories that must all appear in `blockedInputCategories`. */
export const BLOCKED_REDACTED_INPUT_FORWARDING_CATEGORIES: readonly RedactedInputCategoryBlockedForForwarding[] =
  [
    "raw_user_input",
    "unredacted_bureaucratic_letter",
    "photo_ocr_input",
    "file_upload_input",
    "full_document_text",
    "multi_document_bundle",
    "public_anonymous_input",
    "unattended_input",
    "third_party_sensitive_data",
    "raw_pii_input",
    "raw_bank_or_tax_identifier_input",
    "raw_children_data_input",
    "medical_emergency_input",
    "deportation_deadline_uncertain_input",
    "legal_appeal_deadline_uncertain_input",
    "secrets_or_api_keys_input",
  ] as const;

/** All redaction proof requirements that must be present in a valid input. */
export const REQUIRED_REDACTION_PROOF_REQUIREMENTS: readonly RedactionProofRequirement[] =
  [
    "names_redacted",
    "addresses_redacted",
    "phone_numbers_redacted",
    "emails_redacted",
    "iban_redacted",
    "steuer_id_redacted",
    "aktenzeichen_redacted",
    "bg_nr_redacted",
    "insurance_numbers_redacted",
    "children_data_redacted",
    "secret_or_api_key_redacted",
    "raw_identifiers_removed",
    "partial_input_marked",
    "authority_name_preserved_only_when_relevant",
    "document_type_preserved_only_when_relevant",
    "deadline_preserved_only_with_uncertainty_label",
    "amount_preserved_only_when_needed_for_explanation",
    "manual_reviewer_clearance_required",
    "redaction_uncertainty_blocks_forwarding",
    "high_risk_legal_uncertainty_blocks_forwarding",
  ] as const;

/** All forwarding preconditions that must be present in a valid input. */
export const REQUIRED_FORWARDING_PRECONDITIONS: readonly ForwardingPrecondition[] =
  [
    "live_llm_boundary_contract_ready",
    "existing_runtime_isolation_preserved",
    "target_adapter_not_selected_yet",
    "raw_input_forwarding_blocked",
    "redacted_input_requires_proof",
    "redacted_input_requires_manual_review_clearance",
    "redacted_input_requires_partial_input_marker_if_excerpt",
    "ai_output_governance_recheck_required_next",
    "ai_output_user_visible_blocked",
    "persistence_blocked",
    "public_runtime_blocked",
    "live_llm_runtime_still_blocked_by_this_contract",
  ] as const;

/** All checklist items that must be confirmed in a valid input. */
export const REQUIRED_FORWARDING_CHECKLIST: readonly ForwardingChecklistItem[] =
  [
    "forwarding_target_policy_reviewed",
    "allowed_categories_reviewed",
    "blocked_categories_reviewed",
    "redaction_proof_requirements_reviewed",
    "forwarding_preconditions_reviewed",
    "raw_input_forwarding_blocked",
    "redacted_input_forwarding_not_executed",
    "existing_run_smart_talk_not_called",
    "public_branch_c_not_called",
    "ocr_runtime_not_called",
    "live_llm_not_called",
    "ai_output_not_generated",
    "user_visible_output_blocked",
    "persistence_blocked",
    "public_runtime_blocked",
    "manual_review_required",
    "governance_recheck_required_next",
    "no_real_input_processed_by_this_contract",
  ] as const;

/**
 * Required statements that must appear in both operator and reviewer
 * redacted input forwarding acknowledgments.
 */
export const REQUIRED_FORWARDING_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that raw input forwarding remains blocked.",
    "I acknowledge that redacted input forwarding is not executed by this contract.",
    "I acknowledge that existing run-smart-talk.ts is not called by this contract.",
    "I acknowledge that public Branch C is not called by this contract.",
    "I acknowledge that AI output must be rechecked by governance before any user-visible output.",
    "I acknowledge that live LLM runtime, persistence, and public launch remain blocked.",
  ] as const;

/**
 * Strings that must never appear in any forwarding field or notes.
 */
export const FORBIDDEN_REDACTED_INPUT_FORWARDING_STRINGS: readonly string[] = [
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
] as const;
