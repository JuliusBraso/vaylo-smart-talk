/**
 * Synthetic Live LLM Pilot Expansion Planning Types (Phase 8.3R).
 *
 * Defines the typed layer for a metadata-only planning phase that expands
 * the synthetic live LLM pilot from one synthetic case (8.3O) to a small
 * controlled synthetic case catalog.
 *
 * This phase is PLANNING ONLY:
 *   - Does NOT call a live LLM
 *   - Does NOT read process.env
 *   - Does NOT call fetch()
 *   - Does NOT import any LLM SDK
 *   - Does NOT process real input
 *   - Does NOT persist anything
 *   - Does NOT emit user-visible output
 *   - Does NOT authorize real document input (`readyForRealDocumentInput: false` — literal)
 *   - Does NOT authorize public runtime (`readyForPublicLaunch: false` — literal)
 *   - Each additional synthetic case requires a separate contract before execution
 *
 * New fields vs Phase 8.3Q:
 *   - `readyForRealDocumentInput: false` (literal) — new dangerous-readiness gate
 *   - `readyForUserVisibleOutput: false` (literal) — new dangerous-readiness gate
 *   - `additionalLiveLLMCallsExecuted: false` (literal)
 *   - `additionalCaseContractRequired: true` (literal)
 *   - `promptTextAvailableForPlanning: false` (literal)
 *   - `modelOutputAvailableForPlanning: false` (literal)
 *
 * Key invariants (literal types):
 *   - `metadataOnlyPlanning: true`
 *   - `syntheticOnlyExpansion: true`
 *   - `additionalCaseContractRequired: true`
 *   - `liveLLMCalledAgain: false`
 *   - `additionalLiveLLMCallsExecuted: false`
 *   - All dangerous readiness flags: `false`
 *   - All real/raw/OCR/file/public/dependency flags: `false`
 *   - `neverUserVisible: true`
 *
 * Positive gates produced (only when `accepted`):
 *   - `readyForAdditionalSyntheticLiveLlmCaseContract: true`
 *   - `readyForSyntheticPilotCaseSetDesign: true`
 *
 * Status:
 *   - "planned"  — all invariants pass
 *   - "blocked"  — post-call audit prerequisite not satisfied
 *   - "rejected" — at least one unsafe planning violation
 *
 * Builds on Phase 8.3Q (Post-Call Audit).
 *
 * ISOLATION NOTE:
 *   Branch C / run-smart-talk.ts / extract-text-from-image.ts flags remain
 *   literal `false`. These components are NOT called.
 */

// ── Status ────────────────────────────────────────────────────────────────────

export type SyntheticLiveLlmPilotExpansionPlanningStatus = "planned" | "blocked" | "rejected";

// ── Scopes ────────────────────────────────────────────────────────────────────

export type SyntheticLiveLlmPilotExpansionScope =
  | "metadata_only_planning"
  | "post_call_audit_verified"
  | "synthetic_only_expansion"
  | "additional_case_contract_required"
  | "no_live_call_in_planning"
  | "no_real_input"
  | "no_raw_input"
  | "no_redacted_real_input"
  | "no_photo_ocr_file_input"
  | "no_public_request"
  | "no_branch_c"
  | "no_run_smart_talk"
  | "no_ocr_runtime"
  | "no_persistence"
  | "no_user_visible_output"
  | "no_public_runtime"
  | "no_general_live_llm_runtime"
  | "no_real_document_input";

// ── Case catalog ──────────────────────────────────────────────────────────────

export type SyntheticLiveLlmPilotExpansionCaseId =
  | "synthetic_deadline_relative_missing_delivery_date"
  | "synthetic_explicit_payment_deadline"
  | "synthetic_high_risk_widerspruch_deadline"
  | "synthetic_immigration_uncertainty"
  | "synthetic_missing_pages_incomplete_document"
  | "synthetic_legal_certainty_trap"
  | "synthetic_unsafe_next_step_trap"
  | "synthetic_noisy_ocr_letter"
  | "synthetic_multi_authority_letter"
  | "synthetic_overpayment_notice";

// ── Risk classes ──────────────────────────────────────────────────────────────

export type SyntheticLiveLlmPilotExpansionCaseRiskClass =
  | "low_risk_explanation"
  | "medium_risk_deadline"
  | "high_risk_legal_or_immigration"
  | "hallucination_trap"
  | "incomplete_input_trap"
  | "ocr_noise_trap"
  | "multi_authority_confusion";

// ── Expected behaviors ────────────────────────────────────────────────────────

export type SyntheticLiveLlmPilotExpansionCaseExpectedBehavior =
  | "preserve_uncertainty"
  | "do_not_invent_deadline"
  | "require_delivery_date_when_relative"
  | "cite_document_limitation"
  | "avoid_legal_certainty"
  | "block_unsafe_next_step"
  | "mark_output_untrusted"
  | "require_governance_recheck"
  | "require_post_call_audit"
  | "keep_user_visible_output_blocked"
  | "keep_persistence_blocked"
  | "keep_public_runtime_blocked";

// ── Requirements ──────────────────────────────────────────────────────────────

export type SyntheticLiveLlmPilotExpansionPlanningRequirement =
  | "require_post_call_audit_passed"
  | "require_metadata_only_planning"
  | "require_synthetic_case_catalog"
  | "require_case_risk_classes"
  | "require_expected_behaviors"
  | "require_one_call_per_case_future_limit"
  | "require_kill_switch_per_case"
  | "require_single_call_counter_per_case"
  | "require_prompt_non_logging"
  | "require_model_output_non_logging"
  | "require_metadata_only_capture_per_case"
  | "require_post_call_governance_recheck_per_case"
  | "require_post_call_audit_per_case"
  | "require_no_real_input"
  | "require_runtime_isolation"
  | "require_no_user_visible_output"
  | "require_no_persistence"
  | "require_no_public_runtime"
  | "require_no_general_live_llm_runtime";

// ── Blockers ──────────────────────────────────────────────────────────────────

export type SyntheticLiveLlmPilotExpansionPlanningBlocker =
  | "post_call_audit_not_ready"
  | "synthetic_case_catalog_missing"
  | "case_risk_class_missing"
  | "expected_behavior_missing"
  | "live_call_attempted_in_planning"
  | "real_input_detected"
  | "raw_input_detected"
  | "redacted_real_input_detected"
  | "ocr_photo_file_input_detected"
  | "public_request_detected"
  | "branch_c_dependency_detected"
  | "run_smart_talk_dependency_detected"
  | "ocr_runtime_dependency_detected"
  | "prompt_or_model_output_available"
  | "prompt_or_model_output_logged"
  | "persistence_detected"
  | "user_visible_output_detected"
  | "public_runtime_detected"
  | "general_live_llm_runtime_authorized"
  | "real_document_input_authorized";

// ── Checklist ─────────────────────────────────────────────────────────────────

export type SyntheticLiveLlmPilotExpansionPlanningChecklistItem =
  | "post_call_audit_reviewed"
  | "metadata_only_planning_reviewed"
  | "synthetic_case_catalog_reviewed"
  | "case_risk_classes_reviewed"
  | "expected_behaviors_reviewed"
  | "future_one_call_per_case_reviewed"
  | "future_kill_switch_per_case_reviewed"
  | "future_counter_per_case_reviewed"
  | "prompt_non_logging_reviewed"
  | "model_output_non_logging_reviewed"
  | "metadata_capture_reviewed"
  | "governance_recheck_per_case_reviewed"
  | "post_call_audit_per_case_reviewed"
  | "runtime_isolation_reviewed"
  | "no_real_input_reviewed"
  | "no_user_visible_output_reviewed"
  | "no_persistence_reviewed"
  | "no_public_runtime_reviewed"
  | "next_phase_additional_case_contract_required";

// ── Rejection reasons ─────────────────────────────────────────────────────────

export type SyntheticLiveLlmPilotExpansionPlanningRejectionReason =
  | "post_call_audit_not_ready"
  | "missing_expansion_scope"
  | "missing_case"
  | "missing_case_risk_class"
  | "missing_expected_behavior"
  | "missing_requirement"
  | "missing_blocker"
  | "missing_checklist_item"
  | "live_call_attempted_in_planning"
  | "process_env_read_attempted"
  | "sdk_import_attempted"
  | "http_call_attempted"
  | "prompt_text_available"
  | "model_output_available"
  | "prompt_or_model_output_logged"
  | "real_input_detected"
  | "raw_input_detected"
  | "redacted_real_input_detected"
  | "ocr_photo_file_input_detected"
  | "public_request_detected"
  | "branch_c_dependency_detected"
  | "run_smart_talk_dependency_detected"
  | "ocr_runtime_dependency_detected"
  | "persistence_detected"
  | "user_visible_output_detected"
  | "public_runtime_detected"
  | "general_live_llm_runtime_authorized"
  | "real_document_input_authorized"
  | "real_operator_pilot_authorized"
  | "forbidden_secret_detected"
  | "forbidden_env_value_detected"
  | "forbidden_api_key_detected"
  | "forbidden_pii_detected"
  | "forbidden_raw_text_detected"
  | "forbidden_redacted_text_detected"
  | "forbidden_document_content_detected"
  | "forbidden_model_output_detected"
  | "unsafe_planning_note_detected";

// ── Planning input ────────────────────────────────────────────────────────────

/**
 * Input for the Synthetic Live LLM Pilot Expansion Planning validation.
 *
 * New fields vs Phase 8.3Q:
 * - `readyForRealDocumentInput: false` — new dangerous-readiness gate (literal)
 * - `readyForUserVisibleOutput: false` — new dangerous-readiness gate (literal)
 * - `additionalLiveLLMCallsExecuted: false` (literal)
 * - `additionalCaseContractRequired: true` (literal)
 * - `promptTextAvailableForPlanning: false` (literal)
 * - `modelOutputAvailableForPlanning: false` (literal)
 * - `readyForAdditionalSyntheticLiveLlmCaseContract` (positive gate; literal `true` in Input)
 * - `readyForSyntheticPilotCaseSetDesign` (positive gate; literal `true` in Input)
 *
 * All dangerous readiness flags remain literal `false`.
 */
export interface SyntheticLiveLlmPilotExpansionPlanningInput {
  readonly planningId: string;
  readonly epochId: "8.3R";
  readonly previousPhaseId: "8.3Q";

  readonly postCallAuditReadyForExpansionPlanning: boolean;

  readonly scopes: readonly SyntheticLiveLlmPilotExpansionScope[];
  readonly cases: readonly SyntheticLiveLlmPilotExpansionCaseId[];
  readonly caseRiskClasses: readonly SyntheticLiveLlmPilotExpansionCaseRiskClass[];
  readonly expectedBehaviors: readonly SyntheticLiveLlmPilotExpansionCaseExpectedBehavior[];
  readonly requirements: readonly SyntheticLiveLlmPilotExpansionPlanningRequirement[];
  readonly blockers: readonly SyntheticLiveLlmPilotExpansionPlanningBlocker[];
  readonly checklistConfirmed: readonly SyntheticLiveLlmPilotExpansionPlanningChecklistItem[];

  readonly metadataOnlyPlanning: true;
  readonly syntheticOnlyExpansion: true;
  readonly additionalCaseContractRequired: true;
  readonly liveLLMCalledAgain: false;
  readonly additionalLiveLLMCallsExecuted: false;

  readonly readyForAdditionalSyntheticLiveLlmCaseContract: true;
  readonly readyForSyntheticPilotCaseSetDesign: true;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;

  readonly promptTextAvailableForPlanning: false;
  readonly modelOutputAvailableForPlanning: false;
  readonly promptTextLogged: false;
  readonly modelOutputLogged: false;

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
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;

  readonly operatorExpansionPlanningAcknowledgment: string;
  readonly reviewerExpansionPlanningAcknowledgment: string;
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

// ── Planning result ───────────────────────────────────────────────────────────

/**
 * Result of validating a `SyntheticLiveLlmPilotExpansionPlanningInput`.
 *
 * Positive gates (true only when accepted):
 *   - `readyForAdditionalSyntheticLiveLlmCaseContract`
 *   - `readyForSyntheticPilotCaseSetDesign`
 *
 * All dangerous readiness flags remain literal `false`.
 */
export interface SyntheticLiveLlmPilotExpansionPlanningResult {
  readonly planningId: string;
  readonly epochId: "8.3R";
  readonly status: SyntheticLiveLlmPilotExpansionPlanningStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly SyntheticLiveLlmPilotExpansionPlanningRejectionReason[];

  readonly safeExpansionPlanningMetadata: {
    readonly scopeCount: number;
    readonly caseCount: number;
    readonly caseRiskClassCount: number;
    readonly expectedBehaviorCount: number;
    readonly requirementCount: number;
    readonly blockerCount: number;
    readonly checklistPassedCount: number;
    readonly metadataOnlyPlanning: true;
    readonly syntheticOnlyExpansion: true;
  };

  readonly readyForAdditionalSyntheticLiveLlmCaseContract: boolean;
  readonly readyForSyntheticPilotCaseSetDesign: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;

  readonly metadataOnlyPlanning: true;
  readonly syntheticOnlyExpansion: true;
  readonly additionalCaseContractRequired: true;
  readonly liveLLMCalledAgain: false;
  readonly additionalLiveLLMCallsExecuted: false;

  readonly promptTextAvailableForPlanning: false;
  readonly modelOutputAvailableForPlanning: false;
  readonly promptTextLogged: false;
  readonly modelOutputLogged: false;

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
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;

  readonly apiRouteModifiedByPlanning: false;
  readonly existingRuntimeModifiedByPlanning: false;
  readonly uiTouched: false;
  readonly databaseOrStorageModifiedByPlanning: false;
  readonly neverUserVisible: true;
}

// ── Check result ──────────────────────────────────────────────────────────────

/**
 * Result of `runSyntheticLiveLlmPilotExpansionPlanning()` (Phase 8.3R).
 *
 * `allPassed` is true when:
 * 1. The 8.3Q post-call audit prerequisite is verified.
 * 2. The planning input is accepted.
 * 3. All tamper cases are rejected.
 *
 * Positive gates: `readyForAdditionalSyntheticLiveLlmCaseContract` and
 * `readyForSyntheticPilotCaseSetDesign`.
 */
export interface SyntheticLiveLlmPilotExpansionPlanningCheckResult {
  readonly checkId: "8.3R";
  readonly allPassed: boolean;
  readonly postCallAuditReadyForExpansionPlanning: boolean;
  readonly syntheticLiveLlmPilotExpansionPlanningAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForAdditionalSyntheticLiveLlmCaseContract: boolean;
  readonly readyForSyntheticPilotCaseSetDesign: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;

  readonly metadataOnlyPlanning: true;
  readonly syntheticOnlyExpansion: true;
  readonly additionalCaseContractRequired: true;
  readonly liveLLMCalledAgain: false;
  readonly additionalLiveLLMCallsExecuted: false;

  readonly promptTextAvailableForPlanning: false;
  readonly modelOutputAvailableForPlanning: false;
  readonly promptTextLogged: false;
  readonly modelOutputLogged: false;

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

export const REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_SCOPES: readonly SyntheticLiveLlmPilotExpansionScope[] =
  [
    "metadata_only_planning",
    "post_call_audit_verified",
    "synthetic_only_expansion",
    "additional_case_contract_required",
    "no_live_call_in_planning",
    "no_real_input",
    "no_raw_input",
    "no_redacted_real_input",
    "no_photo_ocr_file_input",
    "no_public_request",
    "no_branch_c",
    "no_run_smart_talk",
    "no_ocr_runtime",
    "no_persistence",
    "no_user_visible_output",
    "no_public_runtime",
    "no_general_live_llm_runtime",
    "no_real_document_input",
  ] as const;

export const REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_CASES: readonly SyntheticLiveLlmPilotExpansionCaseId[] =
  [
    "synthetic_deadline_relative_missing_delivery_date",
    "synthetic_explicit_payment_deadline",
    "synthetic_high_risk_widerspruch_deadline",
    "synthetic_immigration_uncertainty",
    "synthetic_missing_pages_incomplete_document",
    "synthetic_legal_certainty_trap",
    "synthetic_unsafe_next_step_trap",
    "synthetic_noisy_ocr_letter",
    "synthetic_multi_authority_letter",
    "synthetic_overpayment_notice",
  ] as const;

export const REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_CASE_RISK_CLASSES: readonly SyntheticLiveLlmPilotExpansionCaseRiskClass[] =
  [
    "low_risk_explanation",
    "medium_risk_deadline",
    "high_risk_legal_or_immigration",
    "hallucination_trap",
    "incomplete_input_trap",
    "ocr_noise_trap",
    "multi_authority_confusion",
  ] as const;

export const REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_EXPECTED_BEHAVIORS: readonly SyntheticLiveLlmPilotExpansionCaseExpectedBehavior[] =
  [
    "preserve_uncertainty",
    "do_not_invent_deadline",
    "require_delivery_date_when_relative",
    "cite_document_limitation",
    "avoid_legal_certainty",
    "block_unsafe_next_step",
    "mark_output_untrusted",
    "require_governance_recheck",
    "require_post_call_audit",
    "keep_user_visible_output_blocked",
    "keep_persistence_blocked",
    "keep_public_runtime_blocked",
  ] as const;

export const REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_REQUIREMENTS: readonly SyntheticLiveLlmPilotExpansionPlanningRequirement[] =
  [
    "require_post_call_audit_passed",
    "require_metadata_only_planning",
    "require_synthetic_case_catalog",
    "require_case_risk_classes",
    "require_expected_behaviors",
    "require_one_call_per_case_future_limit",
    "require_kill_switch_per_case",
    "require_single_call_counter_per_case",
    "require_prompt_non_logging",
    "require_model_output_non_logging",
    "require_metadata_only_capture_per_case",
    "require_post_call_governance_recheck_per_case",
    "require_post_call_audit_per_case",
    "require_no_real_input",
    "require_runtime_isolation",
    "require_no_user_visible_output",
    "require_no_persistence",
    "require_no_public_runtime",
    "require_no_general_live_llm_runtime",
  ] as const;

export const REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_BLOCKERS: readonly SyntheticLiveLlmPilotExpansionPlanningBlocker[] =
  [
    "post_call_audit_not_ready",
    "synthetic_case_catalog_missing",
    "case_risk_class_missing",
    "expected_behavior_missing",
    "live_call_attempted_in_planning",
    "real_input_detected",
    "raw_input_detected",
    "redacted_real_input_detected",
    "ocr_photo_file_input_detected",
    "public_request_detected",
    "branch_c_dependency_detected",
    "run_smart_talk_dependency_detected",
    "ocr_runtime_dependency_detected",
    "prompt_or_model_output_available",
    "prompt_or_model_output_logged",
    "persistence_detected",
    "user_visible_output_detected",
    "public_runtime_detected",
    "general_live_llm_runtime_authorized",
    "real_document_input_authorized",
  ] as const;

export const REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_CHECKLIST: readonly SyntheticLiveLlmPilotExpansionPlanningChecklistItem[] =
  [
    "post_call_audit_reviewed",
    "metadata_only_planning_reviewed",
    "synthetic_case_catalog_reviewed",
    "case_risk_classes_reviewed",
    "expected_behaviors_reviewed",
    "future_one_call_per_case_reviewed",
    "future_kill_switch_per_case_reviewed",
    "future_counter_per_case_reviewed",
    "prompt_non_logging_reviewed",
    "model_output_non_logging_reviewed",
    "metadata_capture_reviewed",
    "governance_recheck_per_case_reviewed",
    "post_call_audit_per_case_reviewed",
    "runtime_isolation_reviewed",
    "no_real_input_reviewed",
    "no_user_visible_output_reviewed",
    "no_persistence_reviewed",
    "no_public_runtime_reviewed",
    "next_phase_additional_case_contract_required",
  ] as const;

export const REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that this phase is synthetic expansion planning only and does not call a live LLM.",
    "I acknowledge that real documents, OCR, files, public requests, Branch C, run-smart-talk.ts, persistence, and user-visible output remain blocked.",
    "I acknowledge that additional synthetic cases require a separate contract before execution.",
    "I acknowledge that this phase does not authorize public runtime or real document input.",
    "I acknowledge that only synthetic pilot expansion planning may follow this phase.",
  ] as const;

export const FORBIDDEN_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_STRINGS: readonly string[] = [
  // Inherited from 8.3Q (63)
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
  // New in 8.3R (7)
  "real document input ready",
  "additional live calls executed",
  "synthetic outputs approved for users",
  "production live runtime ready",
] as const;
