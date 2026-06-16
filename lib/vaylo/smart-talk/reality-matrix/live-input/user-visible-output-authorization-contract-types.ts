/**
 * User-Visible Output Authorization Contract Types (Phase 8.3F).
 *
 * Defines the typed authorization policy for when one specific
 * governance-rechecked and manually-reviewed output may be authorized for
 * future user-visible display. Builds on Phase 8.3E (Manual Review Before
 * User-Visible Output Contract).
 *
 * Key governance invariants:
 *   - Authorization is scoped to ONE reviewed output and ONE controlled session
 *   - This contract does NOT emit actual user-visible output
 *   - Global authorization, public runtime, live LLM runtime, persistence, and
 *     Branch C authorization are ALL blocked
 *   - `selectedDispositionAllowsActualEmissionNow` is always literal `false`
 *   - `userVisibleOutputAuthorizedByContract` is always literal `false`
 *   - Legal certainty, deadline, unsafe next-step, autonomous action, input
 *     echo, model output dump, and audit dump are all blocked
 *   - The only positive readiness gate is `readyForAiConnectedSyntheticTestHarnessContract`
 *
 * ISOLATION NOTE:
 *   Phase 8.3B isolated `app/api/smart-talk/route.ts` Branch C,
 *   `lib/vaylo/smart-talk/run-smart-talk.ts`, and
 *   `lib/vaylo/smart-talk/extract-text-from-image.ts` from the governance chain.
 *   That isolation is fully preserved here. `runSmartTalkCalledOrImported`,
 *   `publicBranchCCalled`, and `extractTextFromImageCalledOrImported` are all
 *   literal `false`. `branchCAuthorizationAllowed` is also literal `false`.
 *
 * This module does NOT:
 * - read process.env
 * - call any live LLM or make HTTP requests
 * - generate AI output or store model output
 * - emit user-visible output
 * - authorize public runtime, live LLM runtime, persistence, or global output
 * - import, call, or wrap run-smart-talk.ts or extract-text-from-image.ts
 * - forward any actual input to a live model
 * - persist any records or store user content
 * - modify DB/storage schema or API routes
 * - authorize pilotRunNow, public launch, or persistence
 * - modify UI
 *
 * Safety invariants on UserVisibleOutputAuthorizationContractInput (all literal):
 * - selectedDispositionAllowsActualEmissionNow: false
 * - oneReviewedOutputOnly: true
 * - oneControlledSessionOnly: true
 * - globalAuthorizationAllowed: false
 * - publicRuntimeAuthorizationAllowed: false
 * - liveLlmRuntimeAuthorizationAllowed: false
 * - persistenceAuthorizationAllowed: false
 * - branchCAuthorizationAllowed: false
 * - governanceRecheckCompleted: true
 * - manualReviewCompleted: true
 * - evidenceMetadataPresent: true
 * - scopeLimitsPresent: true
 * - safetyLanguageRequired: true
 * - uncertaintyPreserved: true
 * - partialInputLimitationPreserved: true
 * - legalCertaintyWithoutEvidenceAllowed: false
 * - deadlineClaimWithoutEvidenceAllowed: false
 * - unsafeNextStepAllowed: false
 * - autonomousActionAllowed: false
 * - rawOrRedactedInputEchoAllowed: false
 * - modelOutputDumpAllowed: false
 * - internalAuditDumpAllowed: false
 * - unsupportedClaimAllowed: false
 * - unsafeCertaintyAllowed: false
 * - missingContextAllowed: false
 * - userVisibleOutputAuthorizedByContract: false
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
 * Safety invariants on UserVisibleOutputAuthorizationContractResult (all literal):
 * - readyForLiveLLMRuntime: false
 * - readyForConnectedAiRuntimeExecution: false
 * - readyForRealOperatorPilotRun: false
 * - readyForPilotRunNow: false
 * - readyForPublicLaunch: false
 * - readyForPersistence: false
 * - userVisibleOutputAuthorizedByContract: false
 * - emittedToUserNow: false
 * - aiOutputGenerationPerformed: false
 * - aiOutputGenerated: false
 * - modelOutputStored: false
 * - persistenceUsed: false
 * - liveLLMCalled: false
 * - realInputProcessed: false
 * - rawInputForwarded: false
 * - redactedInputForwardingExecuted: false
 * - globalAuthorizationAllowed: false
 * - publicRuntimeAuthorizationAllowed: false
 * - liveLlmRuntimeAuthorizationAllowed: false
 * - persistenceAuthorizationAllowed: false
 * - branchCAuthorizationAllowed: false
 * - runSmartTalkCalledOrImported: false
 * - publicBranchCCalled: false
 * - extractTextFromImageCalledOrImported: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - publicRuntimeEnabled: false
 * - httpCallMade: false
 * - apiRouteCalled: false
 * - apiRouteModifiedByAuthorizationContract: false
 * - existingRuntimeModifiedByAuthorizationContract: false
 * - uiTouched: false
 * - databaseOrStorageModifiedByAuthorizationContract: false
 * - neverUserVisible: true
 */

// ── Contract status ───────────────────────────────────────────────────────────

export type UserVisibleOutputAuthorizationContractStatus =
  | "valid"
  | "rejected";

// ── Authorization scope ───────────────────────────────────────────────────────

export type UserVisibleAuthorizationScope =
  | "one_reviewed_output_only"
  | "one_controlled_session_only"
  | "no_global_authorization"
  | "no_public_runtime_authorization"
  | "no_persistence_authorization"
  | "no_branch_c_authorization"
  | "no_live_llm_runtime_authorization";

// ── Authorization conditions ──────────────────────────────────────────────────

export type UserVisibleAuthorizationCondition =
  | "manual_review_contract_ready"
  | "governance_recheck_completed"
  | "manual_review_completed"
  | "selected_manual_review_disposition_candidate_safe"
  | "evidence_metadata_present"
  | "scope_limits_present"
  | "user_visible_copy_has_safety_language"
  | "uncertainty_preserved"
  | "partial_input_limitation_preserved"
  | "legal_certainty_claims_blocked_without_evidence"
  | "deadline_claims_blocked_without_evidence"
  | "unsafe_next_steps_blocked"
  | "autonomous_actions_blocked"
  | "no_content_storage_confirmed"
  | "no_persistence_confirmed"
  | "no_public_runtime_confirmed";

// ── Allowed output classes ────────────────────────────────────────────────────

export type UserVisibleAuthorizedOutputClass =
  | "explanation_only"
  | "summary_only"
  | "cautionary_next_steps_only"
  | "uncertainty_preserving_guidance_only";

// ── Blocked output classes ────────────────────────────────────────────────────

export type UserVisibleBlockedOutputClass =
  | "legal_advice_certainty"
  | "deadline_certainty_without_evidence"
  | "authority_instruction_without_evidence"
  | "autonomous_action_instruction"
  | "guaranteed_outcome"
  | "immigration_consequence_certainty"
  | "payment_obligation_certainty_without_evidence"
  | "appeal_window_certainty_without_evidence"
  | "unsafe_must_language"
  | "raw_or_redacted_input_echo"
  | "model_output_dump"
  | "internal_audit_dump"
  | "secret_or_env_value_echo";

// ── Authorization dispositions ────────────────────────────────────────────────

export type UserVisibleAuthorizationDisposition =
  | "authorized_for_future_controlled_user_visible_contract_path"
  | "blocked_due_to_scope_violation"
  | "blocked_due_to_missing_manual_review"
  | "blocked_due_to_missing_governance_recheck"
  | "blocked_due_to_unsafe_claims"
  | "blocked_due_to_missing_evidence_metadata"
  | "blocked_due_to_output_class_violation"
  | "blocked_due_to_persistence_or_public_runtime_attempt"
  | "blocked_due_to_existing_runtime_overlap";

// ── Checklist items ───────────────────────────────────────────────────────────

export type UserVisibleAuthorizationChecklistItem =
  | "manual_review_readiness_reviewed"
  | "governance_recheck_readiness_reviewed"
  | "scope_limits_reviewed"
  | "allowed_output_classes_reviewed"
  | "blocked_output_classes_reviewed"
  | "legal_certainty_block_reviewed"
  | "deadline_evidence_block_reviewed"
  | "uncertainty_preservation_reviewed"
  | "partial_input_limitation_reviewed"
  | "no_raw_or_redacted_input_echo_reviewed"
  | "no_model_output_dump_reviewed"
  | "no_internal_audit_dump_reviewed"
  | "no_user_visible_output_emitted_by_this_contract"
  | "no_persistence_confirmed"
  | "no_public_runtime_confirmed"
  | "no_live_llm_runtime_confirmed"
  | "existing_runtime_isolation_preserved"
  | "next_phase_synthetic_test_harness_only";

// ── Rejection reasons ─────────────────────────────────────────────────────────

export type UserVisibleOutputAuthorizationRejectionReason =
  | "manual_review_contract_not_ready"
  | "missing_authorization_scope"
  | "missing_authorization_condition"
  | "missing_allowed_output_class"
  | "missing_blocked_output_class"
  | "missing_authorization_disposition"
  | "missing_required_checklist_item"
  | "invalid_selected_disposition"
  | "global_authorization_attempt_detected"
  | "public_runtime_authorization_attempt_detected"
  | "live_llm_runtime_authorization_attempt_detected"
  | "persistence_authorization_attempt_detected"
  | "branch_c_authorization_attempt_detected"
  | "existing_runtime_overlap_detected"
  | "user_visible_output_emission_claim_detected"
  | "user_visible_output_authorized_too_broadly"
  | "ai_output_generation_claim_detected"
  | "model_output_storage_claim_detected"
  | "live_llm_call_claim_detected"
  | "real_input_processed_claim_detected"
  | "raw_input_forwarding_claim_detected"
  | "redacted_input_forwarding_claim_detected"
  | "run_smart_talk_call_claim_detected"
  | "public_branch_c_call_claim_detected"
  | "ocr_runtime_call_claim_detected"
  | "legal_certainty_allowed_without_evidence"
  | "deadline_claim_allowed_without_evidence"
  | "unsafe_next_step_allowed"
  | "autonomous_action_allowed"
  | "raw_or_redacted_input_echo_allowed"
  | "model_output_dump_allowed"
  | "internal_audit_dump_allowed"
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
  | "unsafe_user_visible_authorization_note_detected";

// ── Contract input ────────────────────────────────────────────────────────────

/**
 * Input for the User-Visible Output Authorization Contract validation.
 *
 * `selectedDispositionAllowsActualEmissionNow: false` is the critical safety
 * gate: even the "authorized" disposition merely permits the next contract path
 * — it never directly triggers output emission here.
 *
 * `oneReviewedOutputOnly: true` and `oneControlledSessionOnly: true` enforce
 * strict scope. `globalAuthorizationAllowed: false` and
 * `branchCAuthorizationAllowed: false` explicitly block the two broadest
 * authorization risks.
 *
 * `userVisibleOutputAuthorizedByContract: false` is a literal invariant that
 * can never be overridden in this contract — actual authorization happens only
 * in a future runtime execution contract after all remaining planning contracts
 * complete.
 */
export interface UserVisibleOutputAuthorizationContractInput {
  readonly contractId: string;
  readonly epochId: "8.3F";
  readonly previousPhaseId: "8.3E";

  readonly manualReviewBeforeUserVisibleOutputReady: boolean;

  readonly authorizationScopes: readonly UserVisibleAuthorizationScope[];
  readonly authorizationConditions: readonly UserVisibleAuthorizationCondition[];
  readonly allowedOutputClasses: readonly UserVisibleAuthorizedOutputClass[];
  readonly blockedOutputClasses: readonly UserVisibleBlockedOutputClass[];
  readonly dispositionOptions: readonly UserVisibleAuthorizationDisposition[];
  readonly checklistConfirmed: readonly UserVisibleAuthorizationChecklistItem[];

  readonly selectedDisposition: UserVisibleAuthorizationDisposition;
  readonly selectedDispositionAllowsActualEmissionNow: false;

  readonly oneReviewedOutputOnly: true;
  readonly oneControlledSessionOnly: true;
  readonly globalAuthorizationAllowed: false;
  readonly publicRuntimeAuthorizationAllowed: false;
  readonly liveLlmRuntimeAuthorizationAllowed: false;
  readonly persistenceAuthorizationAllowed: false;
  readonly branchCAuthorizationAllowed: false;

  readonly governanceRecheckCompleted: true;
  readonly manualReviewCompleted: true;
  readonly evidenceMetadataPresent: true;
  readonly scopeLimitsPresent: true;
  readonly safetyLanguageRequired: true;
  readonly uncertaintyPreserved: true;
  readonly partialInputLimitationPreserved: true;

  readonly legalCertaintyWithoutEvidenceAllowed: false;
  readonly deadlineClaimWithoutEvidenceAllowed: false;
  readonly unsafeNextStepAllowed: false;
  readonly autonomousActionAllowed: false;
  readonly rawOrRedactedInputEchoAllowed: false;
  readonly modelOutputDumpAllowed: false;
  readonly internalAuditDumpAllowed: false;
  readonly unsupportedClaimAllowed: false;
  readonly unsafeCertaintyAllowed: false;
  readonly missingContextAllowed: false;

  readonly userVisibleOutputAuthorizedByContract: false;
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

  readonly operatorAuthorizationAcknowledgment: string;
  readonly reviewerAuthorizationAcknowledgment: string;
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
 * Result of validating a `UserVisibleOutputAuthorizationContractInput`.
 *
 * `readyForAiConnectedSyntheticTestHarnessContract` is `true` only when
 * `accepted === true`. Even then, no output is emitted or authorized globally.
 *
 * `safeAuthorizationMetadata` stores only counts and the disposition label —
 * no user content, env values, secrets, API keys, or model output.
 */
export interface UserVisibleOutputAuthorizationContractResult {
  readonly contractId: string;
  readonly epochId: "8.3F";
  readonly status: UserVisibleOutputAuthorizationContractStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly UserVisibleOutputAuthorizationRejectionReason[];

  readonly safeAuthorizationMetadata: {
    readonly authorizationScopeCount: number;
    readonly authorizationConditionCount: number;
    readonly allowedOutputClassCount: number;
    readonly blockedOutputClassCount: number;
    readonly dispositionOptionCount: number;
    readonly checklistPassedCount: number;
    readonly selectedDisposition: UserVisibleAuthorizationDisposition;
  };

  readonly readyForAiConnectedSyntheticTestHarnessContract: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly userVisibleOutputAuthorizedByContract: false;
  readonly emittedToUserNow: false;
  readonly aiOutputGenerationPerformed: false;
  readonly aiOutputGenerated: false;
  readonly modelOutputStored: false;
  readonly persistenceUsed: false;
  readonly liveLLMCalled: false;
  readonly realInputProcessed: false;
  readonly rawInputForwarded: false;
  readonly redactedInputForwardingExecuted: false;

  readonly globalAuthorizationAllowed: false;
  readonly publicRuntimeAuthorizationAllowed: false;
  readonly liveLlmRuntimeAuthorizationAllowed: false;
  readonly persistenceAuthorizationAllowed: false;
  readonly branchCAuthorizationAllowed: false;

  readonly runSmartTalkCalledOrImported: false;
  readonly publicBranchCCalled: false;
  readonly extractTextFromImageCalledOrImported: false;

  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;

  readonly httpCallMade: false;
  readonly apiRouteCalled: false;
  readonly apiRouteModifiedByAuthorizationContract: false;
  readonly existingRuntimeModifiedByAuthorizationContract: false;
  readonly uiTouched: false;
  readonly databaseOrStorageModifiedByAuthorizationContract: false;
  readonly neverUserVisible: true;
}

// ── Check result ──────────────────────────────────────────────────────────────

/**
 * Result of `runUserVisibleOutputAuthorizationContractCheck()` (Phase 8.3F).
 *
 * `allPassed` is true when all three sub-checks pass:
 * 1. The 8.3E manual review dependency is verified.
 * 2. The synthetic authorization input is accepted.
 * 3. All tamper cases are rejected.
 *
 * `readyForAiConnectedSyntheticTestHarnessContract` is the only positive gate.
 * No output is emitted, no LLM is called, no runtime is authorized.
 */
export interface UserVisibleOutputAuthorizationContractCheckResult {
  readonly checkId: "8.3F";
  readonly allPassed: boolean;
  readonly manualReviewBeforeUserVisibleOutputReady: boolean;
  readonly syntheticUserVisibleOutputAuthorizationAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForAiConnectedSyntheticTestHarnessContract: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly userVisibleOutputAuthorizedByContract: false;
  readonly emittedToUserNow: false;
  readonly aiOutputGenerated: false;
  readonly modelOutputStored: false;
  readonly persistenceUsed: false;
  readonly liveLLMCalled: false;
  readonly realInputProcessed: false;
  readonly rawInputForwarded: false;
  readonly redactedInputForwardingExecuted: false;

  readonly globalAuthorizationAllowed: false;
  readonly publicRuntimeAuthorizationAllowed: false;
  readonly liveLlmRuntimeAuthorizationAllowed: false;
  readonly persistenceAuthorizationAllowed: false;
  readonly branchCAuthorizationAllowed: false;

  readonly runSmartTalkCalledOrImported: false;
  readonly publicBranchCCalled: false;
  readonly extractTextFromImageCalledOrImported: false;

  readonly publicRuntimeEnabled: false;
  readonly neverUserVisible: true;

  readonly notes: readonly string[];
}

// ── Exported constants ────────────────────────────────────────────────────────

/** All authorization scopes that must be present in a valid input. */
export const REQUIRED_USER_VISIBLE_AUTHORIZATION_SCOPES: readonly UserVisibleAuthorizationScope[] =
  [
    "one_reviewed_output_only",
    "one_controlled_session_only",
    "no_global_authorization",
    "no_public_runtime_authorization",
    "no_persistence_authorization",
    "no_branch_c_authorization",
    "no_live_llm_runtime_authorization",
  ] as const;

/** All authorization conditions that must be present in a valid input. */
export const REQUIRED_USER_VISIBLE_AUTHORIZATION_CONDITIONS: readonly UserVisibleAuthorizationCondition[] =
  [
    "manual_review_contract_ready",
    "governance_recheck_completed",
    "manual_review_completed",
    "selected_manual_review_disposition_candidate_safe",
    "evidence_metadata_present",
    "scope_limits_present",
    "user_visible_copy_has_safety_language",
    "uncertainty_preserved",
    "partial_input_limitation_preserved",
    "legal_certainty_claims_blocked_without_evidence",
    "deadline_claims_blocked_without_evidence",
    "unsafe_next_steps_blocked",
    "autonomous_actions_blocked",
    "no_content_storage_confirmed",
    "no_persistence_confirmed",
    "no_public_runtime_confirmed",
  ] as const;

/** All allowed output classes that must be present in a valid input. */
export const ALLOWED_USER_VISIBLE_OUTPUT_CLASSES: readonly UserVisibleAuthorizedOutputClass[] =
  [
    "explanation_only",
    "summary_only",
    "cautionary_next_steps_only",
    "uncertainty_preserving_guidance_only",
  ] as const;

/** All blocked output classes that must be present in a valid input. */
export const BLOCKED_USER_VISIBLE_OUTPUT_CLASSES: readonly UserVisibleBlockedOutputClass[] =
  [
    "legal_advice_certainty",
    "deadline_certainty_without_evidence",
    "authority_instruction_without_evidence",
    "autonomous_action_instruction",
    "guaranteed_outcome",
    "immigration_consequence_certainty",
    "payment_obligation_certainty_without_evidence",
    "appeal_window_certainty_without_evidence",
    "unsafe_must_language",
    "raw_or_redacted_input_echo",
    "model_output_dump",
    "internal_audit_dump",
    "secret_or_env_value_echo",
  ] as const;

/** All authorization dispositions that must be present in a valid input. */
export const REQUIRED_USER_VISIBLE_AUTHORIZATION_DISPOSITIONS: readonly UserVisibleAuthorizationDisposition[] =
  [
    "authorized_for_future_controlled_user_visible_contract_path",
    "blocked_due_to_scope_violation",
    "blocked_due_to_missing_manual_review",
    "blocked_due_to_missing_governance_recheck",
    "blocked_due_to_unsafe_claims",
    "blocked_due_to_missing_evidence_metadata",
    "blocked_due_to_output_class_violation",
    "blocked_due_to_persistence_or_public_runtime_attempt",
    "blocked_due_to_existing_runtime_overlap",
  ] as const;

/** All checklist items that must be confirmed in a valid input. */
export const REQUIRED_USER_VISIBLE_AUTHORIZATION_CHECKLIST: readonly UserVisibleAuthorizationChecklistItem[] =
  [
    "manual_review_readiness_reviewed",
    "governance_recheck_readiness_reviewed",
    "scope_limits_reviewed",
    "allowed_output_classes_reviewed",
    "blocked_output_classes_reviewed",
    "legal_certainty_block_reviewed",
    "deadline_evidence_block_reviewed",
    "uncertainty_preservation_reviewed",
    "partial_input_limitation_reviewed",
    "no_raw_or_redacted_input_echo_reviewed",
    "no_model_output_dump_reviewed",
    "no_internal_audit_dump_reviewed",
    "no_user_visible_output_emitted_by_this_contract",
    "no_persistence_confirmed",
    "no_public_runtime_confirmed",
    "no_live_llm_runtime_confirmed",
    "existing_runtime_isolation_preserved",
    "next_phase_synthetic_test_harness_only",
  ] as const;

/**
 * Required statements that must appear in both operator and reviewer
 * user-visible output authorization acknowledgments.
 */
export const REQUIRED_USER_VISIBLE_AUTHORIZATION_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that this contract does not emit user-visible output.",
    "I acknowledge that authorization is scoped to one reviewed output and one controlled session only.",
    "I acknowledge that this contract does not authorize live LLM runtime, public runtime, or persistence.",
    "I acknowledge that existing Branch C and run-smart-talk.ts remain isolated.",
    "I acknowledge that the next phase is a synthetic test harness contract, not public launch.",
  ] as const;

/**
 * Strings that must never appear in any authorization field or notes.
 */
export const FORBIDDEN_USER_VISIBLE_OUTPUT_AUTHORIZATION_STRINGS: readonly string[] =
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
    "public launch enabled",
    "all outputs authorized",
    "global approval",
    "branch c authorized",
  ] as const;
