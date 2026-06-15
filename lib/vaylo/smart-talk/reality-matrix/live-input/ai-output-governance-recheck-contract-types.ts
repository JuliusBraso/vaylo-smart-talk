/**
 * AI Output Governance Recheck Contract Types (Phase 8.3D).
 *
 * Defines the typed governance recheck contract that specifies how future AI
 * output must be treated as untrusted and rechecked before any user-visible
 * output can be authorized. This contract builds on Phase 8.3C (Redacted Input
 * Forwarding Contract) and establishes the authority boundary for AI output.
 *
 * Key governance invariants:
 *   - AI output is untrusted by default and must be rechecked before display
 *   - Legal certainty and deadline claims require evidence
 *   - Uncertainty and partial-input limitations must be preserved
 *   - Manual review is required before any user-visible output
 *   - Model output must never be stored directly
 *
 * ISOLATION NOTE:
 *   Phase 8.3B isolated `app/api/smart-talk/route.ts` Branch C,
 *   `lib/vaylo/smart-talk/run-smart-talk.ts`, and
 *   `lib/vaylo/smart-talk/extract-text-from-image.ts` from the governance chain.
 *   That isolation is fully preserved here. `runSmartTalkCalledOrImported`,
 *   `publicBranchCCalled`, and `extractTextFromImageCalledOrImported` are all
 *   literal `false` on both input and result.
 *
 * This module does NOT:
 * - read process.env
 * - call any live LLM
 * - generate AI output
 * - store model output
 * - import, call, or wrap run-smart-talk.ts
 * - import, call, or wrap extract-text-from-image.ts
 * - call fetch() or make HTTP requests
 * - forward any actual input (raw or redacted) to a live model
 * - authorize live LLM runtime
 * - authorize user-visible output
 * - persist any records
 * - store user content, env values, or secrets
 * - modify DB/storage schema or API routes
 * - authorize pilotRunNow, public launch, or persistence
 * - modify UI
 *
 * Safety invariants on AiOutputGovernanceRecheckContractInput (all literal):
 * - governanceRecheckRequired: true
 * - manualReviewRequiredBeforeUserVisibleOutput: true
 * - uncertaintyPreservationRequired: true
 * - partialInputLimitationRequired: true
 * - legalCertaintyWithoutEvidenceAllowed: false
 * - deadlineClaimWithoutEvidenceAllowed: false
 * - aiOutputGenerationPerformed: false
 * - aiOutputGenerated: false
 * - modelOutputStored: false
 * - userVisibleOutputAllowed: false
 * - persistenceUsed: false
 * - liveLLMCallPerformed: false
 * - realInputProcessedByContract: false
 * - rawInputForwarded: false
 * - redactedInputForwardingExecuted: false
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
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - publicRuntimeEnabled: false
 * - emittedToUserNow: false
 * - neverUserVisible: true
 *
 * Safety invariants on AiOutputGovernanceRecheckContractResult (all literal):
 * - readyForLiveLLMRuntime: false
 * - readyForConnectedAiRuntimeExecution: false
 * - readyForRealOperatorPilotRun: false
 * - readyForPilotRunNow: false
 * - readyForPublicLaunch: false
 * - readyForPersistence: false
 * - aiOutputGenerationPerformed: false
 * - aiOutputGenerated: false
 * - modelOutputStored: false
 * - userVisibleOutputAllowed: false
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
 * - emittedToUserNow: false
 * - httpCallMade: false
 * - apiRouteCalled: false
 * - apiRouteModifiedByRecheckContract: false
 * - existingRuntimeModifiedByRecheckContract: false
 * - uiTouched: false
 * - databaseOrStorageModifiedByRecheckContract: false
 * - neverUserVisible: true
 */

// ── Contract status ───────────────────────────────────────────────────────────

export type AiOutputGovernanceRecheckContractStatus = "valid" | "rejected";

// ── AI output trust boundary ──────────────────────────────────────────────────

export type AiOutputTrustBoundary =
  | "ai_output_untrusted_by_default"
  | "ai_output_not_authoritative"
  | "ai_output_not_user_visible_directly"
  | "ai_output_not_persistable_directly"
  | "ai_output_requires_governance_recheck"
  | "ai_output_requires_manual_review_before_display";

// ── Governance recheck requirements ──────────────────────────────────────────

export type AiOutputGovernanceRecheckRequirement =
  | "reality_matrix_recheck_required"
  | "evidence_gate_recheck_required"
  | "hallucination_trap_recheck_required"
  | "wording_governance_recheck_required"
  | "urgency_recheck_required"
  | "next_step_safety_recheck_required"
  | "legal_certainty_claims_blocked"
  | "deadline_claims_require_evidence"
  | "authority_claims_require_evidence"
  | "amount_claims_require_evidence"
  | "document_type_claims_require_evidence"
  | "missing_context_must_be_preserved"
  | "uncertainty_must_be_preserved"
  | "partial_input_limit_must_be_preserved"
  | "manual_review_required_before_user_visible_output"
  | "audit_metadata_required_without_content_storage";

// ── Blocked claim categories without evidence ─────────────────────────────────

export type AiOutputClaimCategoryBlockedWithoutEvidence =
  | "legal_certainty_claim"
  | "deadline_or_frist_claim"
  | "appeal_or_objection_window_claim"
  | "immigration_consequence_claim"
  | "payment_obligation_claim"
  | "refund_or_benefit_entitlement_claim"
  | "authority_instruction_claim"
  | "document_type_classification_claim"
  | "amount_due_claim"
  | "penalty_or_sanction_claim"
  | "guaranteed_outcome_claim"
  | "autonomous_action_instruction_claim";

// ── Allowed post-recheck dispositions ────────────────────────────────────────

export type AiOutputAllowedPostRecheckDisposition =
  | "candidate_safe_for_manual_review"
  | "blocked_needs_human_review"
  | "blocked_due_to_unsupported_claims"
  | "blocked_due_to_unsafe_certainty"
  | "blocked_due_to_deadline_uncertainty"
  | "blocked_due_to_missing_context"
  | "blocked_due_to_policy_violation";

// ── Governance checklist items ────────────────────────────────────────────────

export type AiOutputGovernanceChecklistItem =
  | "ai_output_trust_boundary_reviewed"
  | "governance_recheck_requirements_reviewed"
  | "unsupported_claim_blocks_reviewed"
  | "manual_review_requirement_confirmed"
  | "user_visible_output_blocked"
  | "persistence_blocked"
  | "live_llm_runtime_still_blocked_by_this_contract"
  | "ai_output_generation_not_performed"
  | "model_output_not_stored"
  | "legal_certainty_block_confirmed"
  | "deadline_evidence_requirement_confirmed"
  | "uncertainty_preservation_confirmed"
  | "partial_input_limitation_confirmed"
  | "audit_metadata_only_confirmed"
  | "public_runtime_blocked"
  | "existing_runtime_isolation_preserved";

// ── Rejection reasons ─────────────────────────────────────────────────────────

export type AiOutputGovernanceRecheckRejectionReason =
  | "redacted_input_forwarding_not_ready"
  | "missing_trust_boundary"
  | "missing_recheck_requirement"
  | "missing_blocked_claim_category"
  | "missing_allowed_disposition"
  | "missing_required_checklist_item"
  | "ai_output_generation_claim_detected"
  | "model_output_storage_claim_detected"
  | "user_visible_output_claim_detected"
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
  | "manual_review_missing"
  | "governance_recheck_missing"
  | "uncertainty_preservation_missing"
  | "partial_input_limitation_missing"
  | "forbidden_secret_detected"
  | "forbidden_env_value_detected"
  | "forbidden_api_key_detected"
  | "forbidden_pii_detected"
  | "forbidden_raw_text_detected"
  | "forbidden_redacted_text_detected"
  | "forbidden_document_content_detected"
  | "forbidden_model_output_detected"
  | "unsafe_recheck_note_detected";

// ── Contract input ────────────────────────────────────────────────────────────

/**
 * Input for the AI Output Governance Recheck Contract validation.
 *
 * `governanceRecheckRequired: true` and
 * `manualReviewRequiredBeforeUserVisibleOutput: true` establish the core
 * mandatory gates for this contract: all AI output must pass governance
 * recheck and then manual review before it can be presented to a user.
 *
 * `legalCertaintyWithoutEvidenceAllowed: false` and
 * `deadlineClaimWithoutEvidenceAllowed: false` explicitly block the two
 * highest-risk claim categories that AI models commonly hallucinate.
 *
 * `uncertaintyPreservationRequired: true` and
 * `partialInputLimitationRequired: true` ensure the AI system cannot silently
 * suppress its own uncertainty or ignore context limitations.
 *
 * `aiOutputGenerationPerformed: false` and `aiOutputGenerated: false` are
 * distinct: the first blocks the act of calling a generation endpoint; the
 * second blocks any claim that a generation result already exists.
 */
export interface AiOutputGovernanceRecheckContractInput {
  readonly contractId: string;
  readonly epochId: "8.3D";
  readonly previousPhaseId: "8.3C";

  readonly redactedInputForwardingReady: boolean;

  readonly trustBoundaries: readonly AiOutputTrustBoundary[];
  readonly recheckRequirements: readonly AiOutputGovernanceRecheckRequirement[];
  readonly blockedClaimCategories: readonly AiOutputClaimCategoryBlockedWithoutEvidence[];
  readonly allowedPostRecheckDispositions: readonly AiOutputAllowedPostRecheckDisposition[];
  readonly checklistConfirmed: readonly AiOutputGovernanceChecklistItem[];

  readonly governanceRecheckRequired: true;
  readonly manualReviewRequiredBeforeUserVisibleOutput: true;
  readonly uncertaintyPreservationRequired: true;
  readonly partialInputLimitationRequired: true;
  readonly legalCertaintyWithoutEvidenceAllowed: false;
  readonly deadlineClaimWithoutEvidenceAllowed: false;

  readonly aiOutputGenerationPerformed: false;
  readonly aiOutputGenerated: false;
  readonly modelOutputStored: false;
  readonly userVisibleOutputAllowed: false;
  readonly persistenceUsed: false;
  readonly liveLLMCallPerformed: false;
  readonly realInputProcessedByContract: false;
  readonly rawInputForwarded: false;
  readonly redactedInputForwardingExecuted: false;

  readonly runSmartTalkCalledOrImported: false;
  readonly publicBranchCCalled: false;
  readonly extractTextFromImageCalledOrImported: false;

  readonly operatorRecheckAcknowledgment: string;
  readonly reviewerRecheckAcknowledgment: string;
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
  readonly emittedToUserNow: false;

  readonly neverUserVisible: true;
}

// ── Contract result ───────────────────────────────────────────────────────────

/**
 * Result of validating an `AiOutputGovernanceRecheckContractInput`.
 *
 * `readyForManualReviewBeforeUserVisibleOutputContract` is `true` only when
 * `accepted === true`. All execution, launch, persistence, AI-output, and
 * existing-runtime authorization flags are always literal `false`.
 *
 * `safeRecheckMetadata` stores only counts — no env values, secrets, API keys,
 * user content, or model output.
 */
export interface AiOutputGovernanceRecheckContractResult {
  readonly contractId: string;
  readonly epochId: "8.3D";
  readonly status: AiOutputGovernanceRecheckContractStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly AiOutputGovernanceRecheckRejectionReason[];

  readonly safeRecheckMetadata: {
    readonly trustBoundaryCount: number;
    readonly recheckRequirementCount: number;
    readonly blockedClaimCategoryCount: number;
    readonly allowedDispositionCount: number;
    readonly checklistPassedCount: number;
  };

  readonly readyForManualReviewBeforeUserVisibleOutputContract: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly aiOutputGenerationPerformed: false;
  readonly aiOutputGenerated: false;
  readonly modelOutputStored: false;
  readonly userVisibleOutputAllowed: false;
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
  readonly emittedToUserNow: false;

  readonly httpCallMade: false;
  readonly apiRouteCalled: false;
  readonly apiRouteModifiedByRecheckContract: false;
  readonly existingRuntimeModifiedByRecheckContract: false;
  readonly uiTouched: false;
  readonly databaseOrStorageModifiedByRecheckContract: false;
  readonly neverUserVisible: true;
}

// ── Check result ──────────────────────────────────────────────────────────────

/**
 * Result of `runAiOutputGovernanceRecheckContractCheck()` (Phase 8.3D).
 *
 * `allPassed` is true when all three sub-checks pass:
 * 1. The 8.3C redacted input forwarding dependency is verified.
 * 2. The synthetic governance recheck input is accepted.
 * 3. All tamper cases are rejected.
 *
 * `readyForManualReviewBeforeUserVisibleOutputContract` is the only positive
 * gate set by this contract. No AI output is generated, no LLM is called, and
 * no existing runtime path is touched.
 */
export interface AiOutputGovernanceRecheckContractCheckResult {
  readonly checkId: "8.3D";
  readonly allPassed: boolean;
  readonly redactedInputForwardingReady: boolean;
  readonly syntheticAiOutputGovernanceRecheckAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForManualReviewBeforeUserVisibleOutputContract: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly aiOutputGenerationPerformed: false;
  readonly aiOutputGenerated: false;
  readonly modelOutputStored: false;
  readonly userVisibleOutputAllowed: false;
  readonly persistenceUsed: false;
  readonly liveLLMCalled: false;
  readonly realInputProcessed: false;
  readonly rawInputForwarded: false;
  readonly redactedInputForwardingExecuted: false;

  readonly runSmartTalkCalledOrImported: false;
  readonly publicBranchCCalled: false;
  readonly extractTextFromImageCalledOrImported: false;

  readonly publicRuntimeEnabled: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;

  readonly notes: readonly string[];
}

// ── Exported constants ────────────────────────────────────────────────────────

/** All AI output trust boundaries that must be present in a valid input. */
export const REQUIRED_AI_OUTPUT_TRUST_BOUNDARIES: readonly AiOutputTrustBoundary[] =
  [
    "ai_output_untrusted_by_default",
    "ai_output_not_authoritative",
    "ai_output_not_user_visible_directly",
    "ai_output_not_persistable_directly",
    "ai_output_requires_governance_recheck",
    "ai_output_requires_manual_review_before_display",
  ] as const;

/** All governance recheck requirements that must be present in a valid input. */
export const REQUIRED_AI_OUTPUT_GOVERNANCE_RECHECK_REQUIREMENTS: readonly AiOutputGovernanceRecheckRequirement[] =
  [
    "reality_matrix_recheck_required",
    "evidence_gate_recheck_required",
    "hallucination_trap_recheck_required",
    "wording_governance_recheck_required",
    "urgency_recheck_required",
    "next_step_safety_recheck_required",
    "legal_certainty_claims_blocked",
    "deadline_claims_require_evidence",
    "authority_claims_require_evidence",
    "amount_claims_require_evidence",
    "document_type_claims_require_evidence",
    "missing_context_must_be_preserved",
    "uncertainty_must_be_preserved",
    "partial_input_limit_must_be_preserved",
    "manual_review_required_before_user_visible_output",
    "audit_metadata_required_without_content_storage",
  ] as const;

/** All blocked claim categories that must be present in a valid input. */
export const BLOCKED_AI_OUTPUT_CLAIM_CATEGORIES_WITHOUT_EVIDENCE: readonly AiOutputClaimCategoryBlockedWithoutEvidence[] =
  [
    "legal_certainty_claim",
    "deadline_or_frist_claim",
    "appeal_or_objection_window_claim",
    "immigration_consequence_claim",
    "payment_obligation_claim",
    "refund_or_benefit_entitlement_claim",
    "authority_instruction_claim",
    "document_type_classification_claim",
    "amount_due_claim",
    "penalty_or_sanction_claim",
    "guaranteed_outcome_claim",
    "autonomous_action_instruction_claim",
  ] as const;

/** All allowed post-recheck dispositions that must be present in a valid input. */
export const ALLOWED_AI_OUTPUT_POST_RECHECK_DISPOSITIONS: readonly AiOutputAllowedPostRecheckDisposition[] =
  [
    "candidate_safe_for_manual_review",
    "blocked_needs_human_review",
    "blocked_due_to_unsupported_claims",
    "blocked_due_to_unsafe_certainty",
    "blocked_due_to_deadline_uncertainty",
    "blocked_due_to_missing_context",
    "blocked_due_to_policy_violation",
  ] as const;

/** All checklist items that must be confirmed in a valid input. */
export const REQUIRED_AI_OUTPUT_GOVERNANCE_CHECKLIST: readonly AiOutputGovernanceChecklistItem[] =
  [
    "ai_output_trust_boundary_reviewed",
    "governance_recheck_requirements_reviewed",
    "unsupported_claim_blocks_reviewed",
    "manual_review_requirement_confirmed",
    "user_visible_output_blocked",
    "persistence_blocked",
    "live_llm_runtime_still_blocked_by_this_contract",
    "ai_output_generation_not_performed",
    "model_output_not_stored",
    "legal_certainty_block_confirmed",
    "deadline_evidence_requirement_confirmed",
    "uncertainty_preservation_confirmed",
    "partial_input_limitation_confirmed",
    "audit_metadata_only_confirmed",
    "public_runtime_blocked",
    "existing_runtime_isolation_preserved",
  ] as const;

/**
 * Required statements that must appear in both operator and reviewer
 * AI output governance recheck acknowledgments.
 */
export const REQUIRED_AI_OUTPUT_RECHECK_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that AI output is untrusted by default.",
    "I acknowledge that AI output must be rechecked by governance before manual review.",
    "I acknowledge that AI output must not become user-visible directly.",
    "I acknowledge that legal certainty and deadline claims require evidence.",
    "I acknowledge that live LLM runtime, persistence, and public launch remain blocked.",
  ] as const;

/**
 * Strings that must never appear in any recheck field or notes.
 */
export const FORBIDDEN_AI_OUTPUT_GOVERNANCE_RECHECK_STRINGS: readonly string[] =
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
  ] as const;
