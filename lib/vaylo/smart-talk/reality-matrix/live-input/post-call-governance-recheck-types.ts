/**
 * Post-Call Governance Recheck Types (Phase 8.3P).
 *
 * Defines the typed layer for a metadata-only post-call governance recheck
 * after Phase 8.3O (Live LLM Synthetic Single-Call Execution).
 *
 * This phase is METADATA ONLY:
 *   - Does NOT inspect model output text (it was discarded in 8.3O)
 *   - Does NOT call a live LLM
 *   - Does NOT read process.env
 *   - Does NOT call fetch()
 *   - Does NOT reconstruct prompt text
 *
 * Key invariants (literal types in this file):
 *   - `metadataOnlyRecheck: true` — always metadata-only
 *   - `liveLLMCalledAgain: false` — no second LLM call
 *   - `liveLLMCalledExactlyOnce: true` — one call is verified from 8.3O metadata
 *   - `callCount: 1` — literal one call
 *   - `promptTextAvailableForReview: false` — prompt was never logged/stored
 *   - `modelOutputAvailableForReview: false` — output was discarded in 8.3O
 *   - `modelOutputLogged/Stored/Returned: false` — literal
 *   - `promptTextLogged/Stored/Returned: false` — literal
 *   - `metadataOnlyCaptured: true` — literal
 *   - All real/raw/OCR/file/public/dependency flags: `false` — literal
 *   - All dangerous readiness flags: `false` — literal
 *   - `neverUserVisible: true` — literal
 *
 * Positive gates produced:
 *   - `postCallGovernanceRecheckPassed: true`
 *   - `readyForPostCallAudit: true`
 *   - `readyForSyntheticLiveLlmPilotExpansionPlanning: true`
 *   (all three only when `accepted`)
 *
 * Builds on Phase 8.3O (Live LLM Synthetic Single-Call Execution).
 *
 * ISOLATION NOTE:
 *   All flags for Branch C / run-smart-talk.ts / extract-text-from-image.ts
 *   remain literal `false`. These components are NOT called.
 *
 * Status:
 *   - "passed"   — metadata-only recheck accepted; execution verified safe
 *   - "blocked"  — execution prerequisite not satisfied; no unsafe violation
 *   - "rejected" — at least one unsafe contract violation detected
 */

// ── Status ────────────────────────────────────────────────────────────────────

export type PostCallGovernanceRecheckStatus = "passed" | "blocked" | "rejected";

// ── Scopes ────────────────────────────────────────────────────────────────────

export type PostCallGovernanceRecheckScope =
  | "metadata_only_recheck"
  | "execution_result_verified"
  | "one_call_only_verified"
  | "synthetic_case_verified"
  | "provider_model_verified"
  | "prompt_non_logging_verified"
  | "model_output_untrusted_verified"
  | "model_output_non_logging_verified"
  | "metadata_only_capture_verified"
  | "real_input_absence_verified"
  | "branch_c_isolation_verified"
  | "run_smart_talk_isolation_verified"
  | "ocr_runtime_isolation_verified"
  | "user_visible_output_blocked_verified"
  | "persistence_blocked_verified"
  | "public_runtime_blocked_verified"
  | "post_call_audit_ready_verified";

// ── Findings ──────────────────────────────────────────────────────────────────

export type PostCallGovernanceRecheckFinding =
  | "execution_completed_or_blocked_safely"
  | "no_second_live_llm_call_performed"
  | "provider_openai_verified"
  | "model_gpt_4o_mini_verified"
  | "selected_case_relative_deadline_verified"
  | "live_call_exactly_once_verified"
  | "api_key_value_not_exposed"
  | "prompt_constructed_in_memory_only_verified"
  | "prompt_text_not_available_for_review"
  | "prompt_text_not_logged_stored_returned"
  | "model_output_received_untrusted"
  | "model_output_not_available_for_review"
  | "model_output_not_logged_stored_returned"
  | "metadata_only_capture_verified"
  | "no_real_input_path_opened"
  | "no_branch_c_dependency"
  | "no_run_smart_talk_dependency"
  | "no_ocr_runtime_dependency"
  | "no_user_visible_output"
  | "no_persistence"
  | "no_public_runtime"
  | "no_real_operator_pilot"
  | "post_call_audit_ready";

// ── Requirements ──────────────────────────────────────────────────────────────

export type PostCallGovernanceRecheckRequirement =
  | "require_execution_all_passed"
  | "require_ready_for_post_call_governance_recheck"
  | "require_exactly_one_call"
  | "require_no_second_call"
  | "require_provider_model_case_match"
  | "require_prompt_text_unavailable"
  | "require_model_output_unavailable"
  | "require_model_output_untrusted_marker"
  | "require_metadata_only_capture"
  | "require_no_real_input"
  | "require_runtime_isolation"
  | "require_no_user_visible_output"
  | "require_no_persistence"
  | "require_no_public_runtime"
  | "require_post_call_audit_readiness";

// ── Blockers ──────────────────────────────────────────────────────────────────

export type PostCallGovernanceRecheckBlocker =
  | "execution_not_ready_for_recheck"
  | "execution_blocked_api_key_missing"
  | "execution_failed"
  | "second_live_llm_call_detected"
  | "more_than_one_call_detected"
  | "provider_model_case_mismatch"
  | "prompt_text_available"
  | "prompt_logged_or_stored"
  | "model_output_available_for_review"
  | "model_output_not_marked_untrusted"
  | "model_output_logged_or_stored"
  | "metadata_only_capture_missing"
  | "real_input_detected"
  | "raw_input_detected"
  | "redacted_input_detected"
  | "ocr_photo_file_input_detected"
  | "branch_c_dependency_detected"
  | "run_smart_talk_dependency_detected"
  | "ocr_runtime_dependency_detected"
  | "user_visible_output_detected"
  | "persistence_detected"
  | "public_runtime_detected"
  | "post_call_audit_not_ready";

// ── Checklist ─────────────────────────────────────────────────────────────────

export type PostCallGovernanceRecheckChecklistItem =
  | "execution_result_reviewed"
  | "one_call_limit_reviewed"
  | "no_second_call_reviewed"
  | "provider_model_case_reviewed"
  | "prompt_non_logging_reviewed"
  | "prompt_unavailable_for_review_reviewed"
  | "model_output_untrusted_reviewed"
  | "model_output_non_logging_reviewed"
  | "model_output_unavailable_for_review_reviewed"
  | "metadata_only_capture_reviewed"
  | "no_real_input_reviewed"
  | "runtime_isolation_reviewed"
  | "no_user_visible_output_reviewed"
  | "no_persistence_reviewed"
  | "no_public_runtime_reviewed"
  | "post_call_audit_ready_reviewed"
  | "next_phase_post_call_audit_required";

// ── Rejection reasons ─────────────────────────────────────────────────────────

export type PostCallGovernanceRecheckRejectionReason =
  | "execution_not_ready"
  | "execution_blocked"
  | "execution_failed"
  | "missing_recheck_scope"
  | "missing_recheck_finding"
  | "missing_recheck_requirement"
  | "missing_recheck_blocker"
  | "missing_checklist_item"
  | "live_llm_called_again"
  | "more_than_one_call_detected"
  | "provider_mismatch"
  | "model_mismatch"
  | "selected_case_mismatch"
  | "prompt_text_available_for_review"
  | "prompt_text_logged_or_stored"
  | "model_output_available_for_review"
  | "model_output_not_untrusted"
  | "model_output_logged_or_stored"
  | "metadata_only_capture_missing"
  | "real_input_detected"
  | "raw_input_detected"
  | "redacted_input_detected"
  | "ocr_photo_file_input_detected"
  | "branch_c_dependency_detected"
  | "run_smart_talk_dependency_detected"
  | "ocr_runtime_dependency_detected"
  | "user_visible_output_detected"
  | "persistence_detected"
  | "public_runtime_detected"
  | "real_operator_pilot_detected"
  | "post_call_audit_not_ready"
  | "forbidden_secret_detected"
  | "forbidden_env_value_detected"
  | "forbidden_api_key_detected"
  | "forbidden_pii_detected"
  | "forbidden_raw_text_detected"
  | "forbidden_redacted_text_detected"
  | "forbidden_document_content_detected"
  | "forbidden_model_output_detected"
  | "unsafe_recheck_note_detected";

// ── Input ─────────────────────────────────────────────────────────────────────

/**
 * Input for the Post-Call Governance Recheck validation.
 *
 * Critical properties that differ from Phase 8.3O:
 * - `promptTextAvailableForReview: false` — prompt was never logged/stored (literal)
 * - `modelOutputAvailableForReview: false` — output discarded in 8.3O (literal)
 * - `metadataOnlyRecheck: true` — always metadata-only (literal)
 * - `liveLLMCalledAgain: false` — no second call (literal)
 * - `liveLLMCalledExactlyOnce: true` — one call verified (literal)
 * - `callCount: 1` — exactly one call (literal)
 * - `readyForLiveLLMRuntime: false` — general runtime still locked (literal)
 * - All logging/storage/return flags for prompt/output: `false` (literal)
 */
export interface PostCallGovernanceRecheckInput {
  readonly recheckId: string;
  readonly epochId: "8.3P";
  readonly previousPhaseId: "8.3O";

  readonly executionReadyForPostCallGovernanceRecheck: boolean;

  readonly scopes: readonly PostCallGovernanceRecheckScope[];
  readonly findings: readonly PostCallGovernanceRecheckFinding[];
  readonly requirements: readonly PostCallGovernanceRecheckRequirement[];
  readonly blockers: readonly PostCallGovernanceRecheckBlocker[];
  readonly checklistConfirmed: readonly PostCallGovernanceRecheckChecklistItem[];

  readonly provider: "openai";
  readonly model: "gpt_4o_mini";
  readonly selectedSyntheticCase: "synthetic_deadline_relative_missing_delivery_date";

  readonly metadataOnlyRecheck: true;
  readonly liveLLMCalledAgain: false;
  readonly liveLLMCalledExactlyOnce: true;
  readonly callCount: 1;

  readonly promptTextAvailableForReview: false;
  readonly promptTextLogged: false;
  readonly promptTextStored: false;
  readonly promptTextReturned: false;

  readonly modelOutputAvailableForReview: false;
  readonly modelOutputReceived: true;
  readonly modelOutputMarkedUntrusted: true;
  readonly modelOutputLogged: false;
  readonly modelOutputStored: false;
  readonly modelOutputReturned: false;

  readonly metadataOnlyCaptured: true;
  readonly postCallAuditReady: true;

  readonly syntheticInputOnly: true;
  readonly realUserInputAllowed: false;
  readonly rawInputAllowed: false;
  readonly realRedactedInputAllowed: false;
  readonly photoOrOcrInputAllowed: false;
  readonly fileUploadInputAllowed: false;
  readonly publicAnonymousInputAllowed: false;

  readonly branchCDependencyAllowed: false;
  readonly runSmartTalkDependencyAllowed: false;
  readonly ocrRuntimeDependencyAllowed: false;

  readonly branchCCalled: false;
  readonly runSmartTalkCalledOrImported: false;
  readonly extractTextFromImageCalledOrImported: false;

  readonly userVisibleOutputEmitted: false;
  readonly userVisibleOutputAuthorizedByRecheck: false;

  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly operatorPostCallGovernanceRecheckAcknowledgment: string;
  readonly reviewerPostCallGovernanceRecheckAcknowledgment: string;
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

  readonly neverUserVisible: true;
}

// ── Result ────────────────────────────────────────────────────────────────────

/**
 * Result of validating a `PostCallGovernanceRecheckInput`.
 *
 * Positive gates:
 *   - `postCallGovernanceRecheckPassed` — true only when accepted
 *   - `readyForPostCallAudit` — true only when accepted
 *   - `readyForSyntheticLiveLlmPilotExpansionPlanning` — true only when accepted
 *
 * Literal invariants that cannot change:
 *   - `metadataOnlyRecheck: true`
 *   - `liveLLMCalledAgain: false`
 *   - `liveLLMCalledExactlyOnce: true`
 *   - `promptTextAvailableForReview: false`, `modelOutputAvailableForReview: false`
 *   - All logging/storage/return flags: `false`
 *   - All dangerous readiness flags: `false`
 *   - `neverUserVisible: true`
 */
export interface PostCallGovernanceRecheckResult {
  readonly recheckId: string;
  readonly epochId: "8.3P";
  readonly status: PostCallGovernanceRecheckStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly PostCallGovernanceRecheckRejectionReason[];

  readonly safeRecheckMetadata: {
    readonly scopeCount: number;
    readonly findingCount: number;
    readonly requirementCount: number;
    readonly blockerCount: number;
    readonly checklistPassedCount: number;
    readonly provider: "openai";
    readonly model: "gpt_4o_mini";
    readonly selectedSyntheticCase: "synthetic_deadline_relative_missing_delivery_date";
    readonly callCount: 1;
    readonly metadataOnlyRecheck: true;
    readonly modelOutputReceived: boolean;
    readonly modelOutputMarkedUntrusted: boolean;
    readonly metadataOnlyCaptured: boolean;
  };

  readonly postCallGovernanceRecheckPassed: boolean;
  readonly readyForPostCallAudit: boolean;
  readonly readyForSyntheticLiveLlmPilotExpansionPlanning: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly metadataOnlyRecheck: true;
  readonly liveLLMCalledAgain: false;
  readonly liveLLMCalledExactlyOnce: true;

  readonly promptTextAvailableForReview: false;
  readonly promptTextLogged: false;
  readonly promptTextStored: false;
  readonly promptTextReturned: false;

  readonly modelOutputAvailableForReview: false;
  readonly modelOutputReceived: boolean;
  readonly modelOutputMarkedUntrusted: boolean;
  readonly modelOutputLogged: false;
  readonly modelOutputStored: false;
  readonly modelOutputReturned: false;

  readonly metadataOnlyCaptured: true;
  readonly postCallAuditReady: boolean;

  readonly syntheticInputOnly: true;
  readonly realUserInputAllowed: false;
  readonly rawInputAllowed: false;
  readonly realRedactedInputAllowed: false;
  readonly photoOrOcrInputAllowed: false;
  readonly fileUploadInputAllowed: false;
  readonly publicAnonymousInputAllowed: false;

  readonly branchCDependencyAllowed: false;
  readonly runSmartTalkDependencyAllowed: false;
  readonly ocrRuntimeDependencyAllowed: false;

  readonly branchCCalled: false;
  readonly runSmartTalkCalledOrImported: false;
  readonly extractTextFromImageCalledOrImported: false;

  readonly userVisibleOutputEmitted: false;
  readonly userVisibleOutputAuthorizedByRecheck: false;

  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;

  readonly apiRouteModifiedByRecheck: false;
  readonly existingRuntimeModifiedByRecheck: false;
  readonly uiTouched: false;
  readonly databaseOrStorageModifiedByRecheck: false;
  readonly neverUserVisible: true;
}

// ── Check result ──────────────────────────────────────────────────────────────

/**
 * Result of `runPostCallGovernanceRecheck()` (Phase 8.3P).
 *
 * `allPassed` is true when:
 * 1. The 8.3O execution prerequisite is verified.
 * 2. The recheck input is accepted.
 * 3. All tamper cases are rejected.
 *
 * `readyForPostCallAudit` and `readyForSyntheticLiveLlmPilotExpansionPlanning`
 * are the positive gates. All other dangerous flags remain false (literal).
 */
export interface PostCallGovernanceRecheckCheckResult {
  readonly checkId: "8.3P";
  readonly allPassed: boolean;
  readonly executionReadyForPostCallGovernanceRecheck: boolean;
  readonly postCallGovernanceRecheckAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly postCallGovernanceRecheckPassed: boolean;
  readonly readyForPostCallAudit: boolean;
  readonly readyForSyntheticLiveLlmPilotExpansionPlanning: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly metadataOnlyRecheck: true;
  readonly liveLLMCalledAgain: false;
  readonly liveLLMCalledExactlyOnce: true;

  readonly promptTextAvailableForReview: false;
  readonly promptTextLogged: false;
  readonly promptTextStored: false;
  readonly promptTextReturned: false;

  readonly modelOutputAvailableForReview: false;
  readonly modelOutputReceived: boolean;
  readonly modelOutputMarkedUntrusted: boolean;
  readonly modelOutputLogged: false;
  readonly modelOutputStored: false;
  readonly modelOutputReturned: false;

  readonly metadataOnlyCaptured: true;
  readonly postCallAuditReady: boolean;

  readonly syntheticInputOnly: true;
  readonly realUserInputAllowed: false;
  readonly rawInputAllowed: false;
  readonly realRedactedInputAllowed: false;
  readonly photoOrOcrInputAllowed: false;
  readonly fileUploadInputAllowed: false;
  readonly publicAnonymousInputAllowed: false;

  readonly branchCDependencyAllowed: false;
  readonly runSmartTalkDependencyAllowed: false;
  readonly ocrRuntimeDependencyAllowed: false;

  readonly branchCCalled: false;
  readonly runSmartTalkCalledOrImported: false;
  readonly extractTextFromImageCalledOrImported: false;

  readonly userVisibleOutputEmitted: false;
  readonly persistenceUsed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;
  readonly neverUserVisible: true;

  readonly notes: readonly string[];
}

// ── Exported constants ────────────────────────────────────────────────────────

export const REQUIRED_POST_CALL_GOVERNANCE_RECHECK_SCOPES: readonly PostCallGovernanceRecheckScope[] =
  [
    "metadata_only_recheck",
    "execution_result_verified",
    "one_call_only_verified",
    "synthetic_case_verified",
    "provider_model_verified",
    "prompt_non_logging_verified",
    "model_output_untrusted_verified",
    "model_output_non_logging_verified",
    "metadata_only_capture_verified",
    "real_input_absence_verified",
    "branch_c_isolation_verified",
    "run_smart_talk_isolation_verified",
    "ocr_runtime_isolation_verified",
    "user_visible_output_blocked_verified",
    "persistence_blocked_verified",
    "public_runtime_blocked_verified",
    "post_call_audit_ready_verified",
  ] as const;

export const REQUIRED_POST_CALL_GOVERNANCE_RECHECK_FINDINGS: readonly PostCallGovernanceRecheckFinding[] =
  [
    "execution_completed_or_blocked_safely",
    "no_second_live_llm_call_performed",
    "provider_openai_verified",
    "model_gpt_4o_mini_verified",
    "selected_case_relative_deadline_verified",
    "live_call_exactly_once_verified",
    "api_key_value_not_exposed",
    "prompt_constructed_in_memory_only_verified",
    "prompt_text_not_available_for_review",
    "prompt_text_not_logged_stored_returned",
    "model_output_received_untrusted",
    "model_output_not_available_for_review",
    "model_output_not_logged_stored_returned",
    "metadata_only_capture_verified",
    "no_real_input_path_opened",
    "no_branch_c_dependency",
    "no_run_smart_talk_dependency",
    "no_ocr_runtime_dependency",
    "no_user_visible_output",
    "no_persistence",
    "no_public_runtime",
    "no_real_operator_pilot",
    "post_call_audit_ready",
  ] as const;

export const REQUIRED_POST_CALL_GOVERNANCE_RECHECK_REQUIREMENTS: readonly PostCallGovernanceRecheckRequirement[] =
  [
    "require_execution_all_passed",
    "require_ready_for_post_call_governance_recheck",
    "require_exactly_one_call",
    "require_no_second_call",
    "require_provider_model_case_match",
    "require_prompt_text_unavailable",
    "require_model_output_unavailable",
    "require_model_output_untrusted_marker",
    "require_metadata_only_capture",
    "require_no_real_input",
    "require_runtime_isolation",
    "require_no_user_visible_output",
    "require_no_persistence",
    "require_no_public_runtime",
    "require_post_call_audit_readiness",
  ] as const;

export const REQUIRED_POST_CALL_GOVERNANCE_RECHECK_BLOCKERS: readonly PostCallGovernanceRecheckBlocker[] =
  [
    "execution_not_ready_for_recheck",
    "execution_blocked_api_key_missing",
    "execution_failed",
    "second_live_llm_call_detected",
    "more_than_one_call_detected",
    "provider_model_case_mismatch",
    "prompt_text_available",
    "prompt_logged_or_stored",
    "model_output_available_for_review",
    "model_output_not_marked_untrusted",
    "model_output_logged_or_stored",
    "metadata_only_capture_missing",
    "real_input_detected",
    "raw_input_detected",
    "redacted_input_detected",
    "ocr_photo_file_input_detected",
    "branch_c_dependency_detected",
    "run_smart_talk_dependency_detected",
    "ocr_runtime_dependency_detected",
    "user_visible_output_detected",
    "persistence_detected",
    "public_runtime_detected",
    "post_call_audit_not_ready",
  ] as const;

export const REQUIRED_POST_CALL_GOVERNANCE_RECHECK_CHECKLIST: readonly PostCallGovernanceRecheckChecklistItem[] =
  [
    "execution_result_reviewed",
    "one_call_limit_reviewed",
    "no_second_call_reviewed",
    "provider_model_case_reviewed",
    "prompt_non_logging_reviewed",
    "prompt_unavailable_for_review_reviewed",
    "model_output_untrusted_reviewed",
    "model_output_non_logging_reviewed",
    "model_output_unavailable_for_review_reviewed",
    "metadata_only_capture_reviewed",
    "no_real_input_reviewed",
    "runtime_isolation_reviewed",
    "no_user_visible_output_reviewed",
    "no_persistence_reviewed",
    "no_public_runtime_reviewed",
    "post_call_audit_ready_reviewed",
    "next_phase_post_call_audit_required",
  ] as const;

export const REQUIRED_POST_CALL_GOVERNANCE_RECHECK_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that this recheck is metadata-only and does not inspect model output text.",
    "I acknowledge that this recheck does not call a live LLM.",
    "I acknowledge that prompt text and model output are unavailable for review by design.",
    "I acknowledge that public runtime and user-visible output remain unauthorized.",
    "I acknowledge that post-call audit is required before any expansion.",
  ] as const;

export const FORBIDDEN_POST_CALL_GOVERNANCE_RECHECK_STRINGS: readonly string[] = [
  "sk-",
  "OPENAI_API_KEY=",
  "VAYLO_INTERNAL_RUNTIME_SECRET=",
  "process.env.OPENAI_API_KEY",
  "apiKey:",
  "Authorization: Bearer",
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
  "real user document",
  "real OCR text",
  "production runtime enabled",
  "harness executed with live llm",
  "live llm executed",
  "real operator pilot executed",
  "real model output",
  "post-run audit stored output",
  "live llm now authorized",
  "multiple live llm calls authorized",
  "general live llm runtime authorized",
  "model output returned to user",
  "stored prompt",
  "stored completion",
  "prompt text logged",
  "model output logged",
  "authorized public runtime",
  "model output reviewed",
  "prompt reviewed",
  "second live llm call",
  "real user output approved",
] as const;

/** Rejection reasons that indicate a blocked (not unsafe) recheck. */
export const BLOCKING_RECHECK_REJECTION_REASONS = new Set<PostCallGovernanceRecheckRejectionReason>(
  ["execution_not_ready", "execution_blocked", "execution_failed"],
);
