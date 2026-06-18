/**
 * Post-Call Audit Types (Phase 8.3Q).
 *
 * Defines the typed layer for a metadata-only full-chain post-call audit
 * after Phase 8.3P (Post-Call Governance Recheck).
 *
 * This phase audits the full execution chain from 8.3A through 8.3P and
 * verifies that all governance invariants were honoured end-to-end.
 *
 * This phase is METADATA ONLY:
 *   - Does NOT inspect model output text (discarded in 8.3O)
 *   - Does NOT reconstruct prompt text (unavailable since 8.3O)
 *   - Does NOT call a live LLM
 *   - Does NOT read process.env
 *   - Does NOT call fetch()
 *   - Does NOT persist audit records (`auditPersistenceUsed: false` — literal)
 *
 * New fields vs Phase 8.3P:
 *   - `fullChainAudit: true` — covers 8.3A through 8.3P (literal)
 *   - `auditPersistenceUsed: false` — audit is non-persistent (literal)
 *   - `promptTextAvailableForAudit: false` — (replaces "ForReview"; literal)
 *   - `modelOutputAvailableForAudit: false` — (replaces "ForReview"; literal)
 *   - `readyForSyntheticLiveLlmPilotExpansionPlanning: true` — new positive gate
 *   - `readyForSyntheticLiveLlmAdditionalCasePlanning: true` — new positive gate
 *
 * Key invariants (literal types):
 *   - `metadataOnlyAudit: true`
 *   - `fullChainAudit: true`
 *   - `liveLLMCalledAgain: false`
 *   - `liveLLMCalledExactlyOnce: true`
 *   - `callCount: 1`
 *   - `auditPersistenceUsed: false`
 *   - All logging/storage/return flags for prompt/output: `false`
 *   - All real/raw/OCR/file/public/dependency flags: `false`
 *   - All dangerous readiness flags: `false`
 *   - `readyForSyntheticLiveLlmPilotExpansionPlanning: true` (literal in Input)
 *   - `readyForSyntheticLiveLlmAdditionalCasePlanning: true` (literal in Input)
 *   - `neverUserVisible: true`
 *
 * Positive gates produced:
 *   - `postCallAuditPassed: true`
 *   - `readyForSyntheticLiveLlmPilotExpansionPlanning: true`
 *   - `readyForSyntheticLiveLlmAdditionalCasePlanning: true`
 *   (all three only when `accepted`)
 *
 * Builds on Phase 8.3P (Post-Call Governance Recheck).
 *
 * ISOLATION NOTE:
 *   All flags for Branch C / run-smart-talk.ts / extract-text-from-image.ts
 *   remain literal `false`. These components are NOT called.
 *
 * Status:
 *   - "passed"   — metadata-only audit accepted; full chain verified safe
 *   - "blocked"  — governance recheck prerequisite not satisfied or key invariant missing
 *   - "rejected" — at least one unsafe audit violation detected
 */

// ── Status ────────────────────────────────────────────────────────────────────

export type PostCallAuditStatus = "passed" | "blocked" | "rejected";

// ── Scopes ────────────────────────────────────────────────────────────────────

export type PostCallAuditScope =
  | "metadata_only_audit"
  | "full_8_3_chain_audit"
  | "post_call_governance_recheck_verified"
  | "one_synthetic_call_verified"
  | "no_second_call_verified"
  | "provider_model_case_verified"
  | "prompt_unavailability_verified"
  | "model_output_unavailability_verified"
  | "model_output_untrusted_marker_verified"
  | "metadata_capture_verified"
  | "runtime_isolation_verified"
  | "real_input_absence_verified"
  | "user_visible_output_blocked_verified"
  | "persistence_blocked_verified"
  | "public_runtime_blocked_verified"
  | "audit_non_persistence_verified"
  | "expansion_planning_boundary_verified";

// ── Findings ──────────────────────────────────────────────────────────────────

export type PostCallAuditFinding =
  | "post_call_governance_recheck_passed"
  | "exactly_one_synthetic_live_call_verified"
  | "no_additional_live_llm_call_in_audit"
  | "provider_openai_verified"
  | "model_gpt_4o_mini_verified"
  | "selected_case_relative_deadline_verified"
  | "prompt_text_unavailable_by_design"
  | "prompt_text_not_logged_stored_returned"
  | "model_output_unavailable_by_design"
  | "model_output_marked_untrusted"
  | "model_output_not_logged_stored_returned"
  | "metadata_only_capture_verified"
  | "branch_c_not_used"
  | "run_smart_talk_not_used"
  | "ocr_runtime_not_used"
  | "real_input_not_used"
  | "raw_input_not_used"
  | "redacted_real_input_not_used"
  | "photo_ocr_file_not_used"
  | "public_request_not_used"
  | "user_visible_output_not_emitted"
  | "persistence_not_used"
  | "public_runtime_not_enabled"
  | "real_operator_pilot_not_executed"
  | "audit_not_persisted"
  | "synthetic_expansion_planning_only";

// ── Requirements ──────────────────────────────────────────────────────────────

export type PostCallAuditRequirement =
  | "require_post_call_governance_recheck_passed"
  | "require_metadata_only_audit"
  | "require_no_new_live_llm_call"
  | "require_one_call_metadata"
  | "require_provider_model_case_match"
  | "require_prompt_unavailable"
  | "require_model_output_unavailable"
  | "require_model_output_untrusted"
  | "require_metadata_only_capture"
  | "require_runtime_isolation"
  | "require_no_real_input"
  | "require_no_user_visible_output"
  | "require_no_persistence"
  | "require_no_public_runtime"
  | "require_no_audit_persistence"
  | "require_expansion_planning_boundary";

// ── Blockers ──────────────────────────────────────────────────────────────────

export type PostCallAuditBlocker =
  | "post_call_governance_recheck_not_ready"
  | "post_call_governance_recheck_failed"
  | "second_live_llm_call_detected"
  | "more_than_one_call_detected"
  | "provider_model_case_mismatch"
  | "prompt_text_available"
  | "prompt_logged_or_stored"
  | "model_output_available"
  | "model_output_not_marked_untrusted"
  | "model_output_logged_or_stored"
  | "metadata_only_capture_missing"
  | "branch_c_dependency_detected"
  | "run_smart_talk_dependency_detected"
  | "ocr_runtime_dependency_detected"
  | "real_input_detected"
  | "raw_input_detected"
  | "redacted_input_detected"
  | "ocr_photo_file_input_detected"
  | "public_request_detected"
  | "user_visible_output_detected"
  | "persistence_detected"
  | "public_runtime_detected"
  | "audit_persistence_detected"
  | "real_operator_pilot_detected"
  | "public_launch_authorization_detected"
  | "general_live_llm_runtime_authorization_detected";

// ── Checklist ─────────────────────────────────────────────────────────────────

export type PostCallAuditChecklistItem =
  | "post_call_governance_recheck_reviewed"
  | "metadata_only_audit_reviewed"
  | "no_new_live_llm_call_reviewed"
  | "one_call_metadata_reviewed"
  | "provider_model_case_reviewed"
  | "prompt_unavailability_reviewed"
  | "model_output_unavailability_reviewed"
  | "model_output_untrusted_reviewed"
  | "metadata_only_capture_reviewed"
  | "runtime_isolation_reviewed"
  | "no_real_input_reviewed"
  | "no_user_visible_output_reviewed"
  | "no_persistence_reviewed"
  | "no_public_runtime_reviewed"
  | "audit_non_persistence_reviewed"
  | "expansion_planning_boundary_reviewed"
  | "next_phase_synthetic_expansion_planning_required";

// ── Rejection reasons ─────────────────────────────────────────────────────────

export type PostCallAuditRejectionReason =
  | "post_call_governance_recheck_not_ready"
  | "post_call_governance_recheck_failed"
  | "missing_audit_scope"
  | "missing_audit_finding"
  | "missing_audit_requirement"
  | "missing_audit_blocker"
  | "missing_checklist_item"
  | "live_llm_called_again"
  | "more_than_one_call_detected"
  | "provider_mismatch"
  | "model_mismatch"
  | "selected_case_mismatch"
  | "prompt_text_available_for_audit"
  | "prompt_text_logged_or_stored"
  | "model_output_available_for_audit"
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
  | "audit_persistence_detected"
  | "real_operator_pilot_detected"
  | "public_launch_authorization_detected"
  | "general_live_llm_runtime_authorization_detected"
  | "forbidden_secret_detected"
  | "forbidden_env_value_detected"
  | "forbidden_api_key_detected"
  | "forbidden_pii_detected"
  | "forbidden_raw_text_detected"
  | "forbidden_redacted_text_detected"
  | "forbidden_document_content_detected"
  | "forbidden_model_output_detected"
  | "unsafe_audit_note_detected";

// ── Audit input ───────────────────────────────────────────────────────────────

/**
 * Input for the Post-Call Audit validation.
 *
 * New fields vs Phase 8.3P:
 * - `fullChainAudit: true` — audits full 8.3A–8.3P chain (literal)
 * - `auditPersistenceUsed: false` — audit is non-persistent (literal)
 * - `promptTextAvailableForAudit: false` — prompt unavailable (literal)
 * - `modelOutputAvailableForAudit: false` — output unavailable (literal)
 * - `readyForSyntheticLiveLlmPilotExpansionPlanning: true` — positive gate (literal)
 * - `readyForSyntheticLiveLlmAdditionalCasePlanning: true` — positive gate (literal)
 *
 * Dangerous readiness flags (`readyForLiveLLMRuntime` through `readyForPersistence`)
 * remain literal `false` and are validated.
 */
export interface PostCallAuditInput {
  readonly auditId: string;
  readonly epochId: "8.3Q";
  readonly previousPhaseId: "8.3P";

  readonly postCallGovernanceRecheckReadyForAudit: boolean;

  readonly scopes: readonly PostCallAuditScope[];
  readonly findings: readonly PostCallAuditFinding[];
  readonly requirements: readonly PostCallAuditRequirement[];
  readonly blockers: readonly PostCallAuditBlocker[];
  readonly checklistConfirmed: readonly PostCallAuditChecklistItem[];

  readonly provider: "openai";
  readonly model: "gpt_4o_mini";
  readonly selectedSyntheticCase: "synthetic_deadline_relative_missing_delivery_date";

  readonly metadataOnlyAudit: true;
  readonly fullChainAudit: true;
  readonly liveLLMCalledAgain: false;
  readonly liveLLMCalledExactlyOnce: true;
  readonly callCount: 1;

  readonly promptTextAvailableForAudit: false;
  readonly promptTextLogged: false;
  readonly promptTextStored: false;
  readonly promptTextReturned: false;

  readonly modelOutputAvailableForAudit: false;
  readonly modelOutputReceived: true;
  readonly modelOutputMarkedUntrusted: true;
  readonly modelOutputLogged: false;
  readonly modelOutputStored: false;
  readonly modelOutputReturned: false;

  readonly metadataOnlyCaptured: true;
  readonly auditPersistenceUsed: false;

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
  readonly userVisibleOutputAuthorizedByAudit: false;

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

  readonly readyForSyntheticLiveLlmPilotExpansionPlanning: true;
  readonly readyForSyntheticLiveLlmAdditionalCasePlanning: true;

  readonly operatorPostCallAuditAcknowledgment: string;
  readonly reviewerPostCallAuditAcknowledgment: string;
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

// ── Audit result ──────────────────────────────────────────────────────────────

/**
 * Result of validating a `PostCallAuditInput`.
 *
 * Positive gates (true only when accepted):
 *   - `postCallAuditPassed`
 *   - `readyForSyntheticLiveLlmPilotExpansionPlanning`
 *   - `readyForSyntheticLiveLlmAdditionalCasePlanning`
 *
 * Literal invariants:
 *   - `metadataOnlyAudit: true`, `fullChainAudit: true`
 *   - `liveLLMCalledAgain: false`, `liveLLMCalledExactlyOnce: true`
 *   - `promptTextAvailableForAudit: false`, `modelOutputAvailableForAudit: false`
 *   - All logging/storage/return flags: `false`
 *   - `auditPersistenceUsed: false`
 *   - All dangerous readiness flags: `false`
 *   - `neverUserVisible: true`
 */
export interface PostCallAuditResult {
  readonly auditId: string;
  readonly epochId: "8.3Q";
  readonly status: PostCallAuditStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly PostCallAuditRejectionReason[];

  readonly safeAuditMetadata: {
    readonly scopeCount: number;
    readonly findingCount: number;
    readonly requirementCount: number;
    readonly blockerCount: number;
    readonly checklistPassedCount: number;
    readonly provider: "openai";
    readonly model: "gpt_4o_mini";
    readonly selectedSyntheticCase: "synthetic_deadline_relative_missing_delivery_date";
    readonly callCount: 1;
    readonly metadataOnlyAudit: true;
    readonly fullChainAudit: true;
    readonly modelOutputReceived: boolean;
    readonly modelOutputMarkedUntrusted: boolean;
    readonly metadataOnlyCaptured: boolean;
    readonly auditPersistenceUsed: false;
  };

  readonly postCallAuditPassed: boolean;
  readonly readyForSyntheticLiveLlmPilotExpansionPlanning: boolean;
  readonly readyForSyntheticLiveLlmAdditionalCasePlanning: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly metadataOnlyAudit: true;
  readonly fullChainAudit: true;
  readonly liveLLMCalledAgain: false;
  readonly liveLLMCalledExactlyOnce: true;

  readonly promptTextAvailableForAudit: false;
  readonly promptTextLogged: false;
  readonly promptTextStored: false;
  readonly promptTextReturned: false;

  readonly modelOutputAvailableForAudit: false;
  readonly modelOutputReceived: boolean;
  readonly modelOutputMarkedUntrusted: boolean;
  readonly modelOutputLogged: false;
  readonly modelOutputStored: false;
  readonly modelOutputReturned: false;

  readonly metadataOnlyCaptured: true;
  readonly auditPersistenceUsed: false;

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
  readonly userVisibleOutputAuthorizedByAudit: false;

  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;

  readonly apiRouteModifiedByAudit: false;
  readonly existingRuntimeModifiedByAudit: false;
  readonly uiTouched: false;
  readonly databaseOrStorageModifiedByAudit: false;
  readonly neverUserVisible: true;
}

// ── Check result ──────────────────────────────────────────────────────────────

/**
 * Result of `runPostCallAudit()` (Phase 8.3Q).
 *
 * `allPassed` is true when:
 * 1. The 8.3P governance recheck prerequisite is verified.
 * 2. The audit input is accepted.
 * 3. All tamper cases are rejected.
 *
 * `readyForSyntheticLiveLlmPilotExpansionPlanning` and
 * `readyForSyntheticLiveLlmAdditionalCasePlanning` are the positive gates.
 * All dangerous runtime/public/persistence flags remain `false` (literal).
 */
export interface PostCallAuditCheckResult {
  readonly checkId: "8.3Q";
  readonly allPassed: boolean;
  readonly postCallGovernanceRecheckReadyForAudit: boolean;
  readonly postCallAuditAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly postCallAuditPassed: boolean;
  readonly readyForSyntheticLiveLlmPilotExpansionPlanning: boolean;
  readonly readyForSyntheticLiveLlmAdditionalCasePlanning: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly metadataOnlyAudit: true;
  readonly fullChainAudit: true;
  readonly liveLLMCalledAgain: false;
  readonly liveLLMCalledExactlyOnce: true;

  readonly promptTextAvailableForAudit: false;
  readonly promptTextLogged: false;
  readonly promptTextStored: false;
  readonly promptTextReturned: false;

  readonly modelOutputAvailableForAudit: false;
  readonly modelOutputReceived: boolean;
  readonly modelOutputMarkedUntrusted: boolean;
  readonly modelOutputLogged: false;
  readonly modelOutputStored: false;
  readonly modelOutputReturned: false;

  readonly metadataOnlyCaptured: true;
  readonly auditPersistenceUsed: false;

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

export const REQUIRED_POST_CALL_AUDIT_SCOPES: readonly PostCallAuditScope[] = [
  "metadata_only_audit",
  "full_8_3_chain_audit",
  "post_call_governance_recheck_verified",
  "one_synthetic_call_verified",
  "no_second_call_verified",
  "provider_model_case_verified",
  "prompt_unavailability_verified",
  "model_output_unavailability_verified",
  "model_output_untrusted_marker_verified",
  "metadata_capture_verified",
  "runtime_isolation_verified",
  "real_input_absence_verified",
  "user_visible_output_blocked_verified",
  "persistence_blocked_verified",
  "public_runtime_blocked_verified",
  "audit_non_persistence_verified",
  "expansion_planning_boundary_verified",
] as const;

export const REQUIRED_POST_CALL_AUDIT_FINDINGS: readonly PostCallAuditFinding[] = [
  "post_call_governance_recheck_passed",
  "exactly_one_synthetic_live_call_verified",
  "no_additional_live_llm_call_in_audit",
  "provider_openai_verified",
  "model_gpt_4o_mini_verified",
  "selected_case_relative_deadline_verified",
  "prompt_text_unavailable_by_design",
  "prompt_text_not_logged_stored_returned",
  "model_output_unavailable_by_design",
  "model_output_marked_untrusted",
  "model_output_not_logged_stored_returned",
  "metadata_only_capture_verified",
  "branch_c_not_used",
  "run_smart_talk_not_used",
  "ocr_runtime_not_used",
  "real_input_not_used",
  "raw_input_not_used",
  "redacted_real_input_not_used",
  "photo_ocr_file_not_used",
  "public_request_not_used",
  "user_visible_output_not_emitted",
  "persistence_not_used",
  "public_runtime_not_enabled",
  "real_operator_pilot_not_executed",
  "audit_not_persisted",
  "synthetic_expansion_planning_only",
] as const;

export const REQUIRED_POST_CALL_AUDIT_REQUIREMENTS: readonly PostCallAuditRequirement[] = [
  "require_post_call_governance_recheck_passed",
  "require_metadata_only_audit",
  "require_no_new_live_llm_call",
  "require_one_call_metadata",
  "require_provider_model_case_match",
  "require_prompt_unavailable",
  "require_model_output_unavailable",
  "require_model_output_untrusted",
  "require_metadata_only_capture",
  "require_runtime_isolation",
  "require_no_real_input",
  "require_no_user_visible_output",
  "require_no_persistence",
  "require_no_public_runtime",
  "require_no_audit_persistence",
  "require_expansion_planning_boundary",
] as const;

export const REQUIRED_POST_CALL_AUDIT_BLOCKERS: readonly PostCallAuditBlocker[] = [
  "post_call_governance_recheck_not_ready",
  "post_call_governance_recheck_failed",
  "second_live_llm_call_detected",
  "more_than_one_call_detected",
  "provider_model_case_mismatch",
  "prompt_text_available",
  "prompt_logged_or_stored",
  "model_output_available",
  "model_output_not_marked_untrusted",
  "model_output_logged_or_stored",
  "metadata_only_capture_missing",
  "branch_c_dependency_detected",
  "run_smart_talk_dependency_detected",
  "ocr_runtime_dependency_detected",
  "real_input_detected",
  "raw_input_detected",
  "redacted_input_detected",
  "ocr_photo_file_input_detected",
  "public_request_detected",
  "user_visible_output_detected",
  "persistence_detected",
  "public_runtime_detected",
  "audit_persistence_detected",
  "real_operator_pilot_detected",
  "public_launch_authorization_detected",
  "general_live_llm_runtime_authorization_detected",
] as const;

export const REQUIRED_POST_CALL_AUDIT_CHECKLIST: readonly PostCallAuditChecklistItem[] = [
  "post_call_governance_recheck_reviewed",
  "metadata_only_audit_reviewed",
  "no_new_live_llm_call_reviewed",
  "one_call_metadata_reviewed",
  "provider_model_case_reviewed",
  "prompt_unavailability_reviewed",
  "model_output_unavailability_reviewed",
  "model_output_untrusted_reviewed",
  "metadata_only_capture_reviewed",
  "runtime_isolation_reviewed",
  "no_real_input_reviewed",
  "no_user_visible_output_reviewed",
  "no_persistence_reviewed",
  "no_public_runtime_reviewed",
  "audit_non_persistence_reviewed",
  "expansion_planning_boundary_reviewed",
  "next_phase_synthetic_expansion_planning_required",
] as const;

export const REQUIRED_POST_CALL_AUDIT_ACKNOWLEDGMENT_STATEMENTS: readonly string[] = [
  "I acknowledge that this audit is metadata-only and does not inspect model output text.",
  "I acknowledge that this audit does not call a live LLM.",
  "I acknowledge that prompt text and model output are unavailable for audit by design.",
  "I acknowledge that public runtime and user-visible output remain unauthorized.",
  "I acknowledge that only synthetic pilot expansion planning may follow this audit.",
] as const;

export const FORBIDDEN_POST_CALL_AUDIT_STRINGS: readonly string[] = [
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
  "audit persisted",
  "public runtime ready",
  "real input pilot ready",
  "user visible output ready",
] as const;

/**
 * Rejection reasons that are treated as "blocking" (unsafe but not trivially
 * recoverable). If ALL rejection reasons are in this set, status = "blocked".
 * Otherwise "rejected". If none, "passed".
 */
export const BLOCKING_POST_CALL_AUDIT_REJECTION_REASONS =
  new Set<PostCallAuditRejectionReason>([
    "post_call_governance_recheck_not_ready",
    "post_call_governance_recheck_failed",
    "live_llm_called_again",
    "more_than_one_call_detected",
    "prompt_text_available_for_audit",
    "model_output_available_for_audit",
    "model_output_logged_or_stored",
    "real_input_detected",
    "branch_c_dependency_detected",
    "run_smart_talk_dependency_detected",
    "ocr_runtime_dependency_detected",
    "user_visible_output_detected",
    "persistence_detected",
    "public_runtime_detected",
    "audit_persistence_detected",
    "real_operator_pilot_detected",
    "public_launch_authorization_detected",
    "general_live_llm_runtime_authorization_detected",
  ]);
