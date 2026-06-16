/**
 * Live LLM Synthetic Authorization Planning Types (Phase 8.3K).
 *
 * Defines the typed authorization planning layer for a future, separate phase
 * that may perform ONE controlled live LLM call with synthetic input only.
 *
 * This phase is PLANNING ONLY. It does NOT:
 * - call a live LLM
 * - read process.env
 * - import any LLM SDK
 * - make HTTP requests
 * - process real user input
 * - generate AI output
 * - persist data
 * - emit user-visible output
 * - authorize general live LLM runtime
 * - authorize more than one future synthetic live LLM call
 *
 * The future live LLM synthetic call (to be defined in Phase 8.3L) must be:
 *   - synthetic-only (no real user input)
 *   - one-call scoped (one call maximum)
 *   - metadata-audited (post-call audit required)
 *   - non-public (no public runtime)
 *   - non-persistent (no model output storage)
 *   - never user-visible
 *   - isolated from Branch C / run-smart-talk.ts / OCR runtime
 *   - protected by kill-switch and explicit provider/model policy
 *   - followed by post-call governance recheck
 *
 * Builds on Phase 8.3J (Synthetic Harness Post-Run Audit).
 *
 * Key governance invariants (all literal on input and result interfaces):
 *   - `planningOnly: true` — this phase is planning, not execution
 *   - `futureSingleSyntheticCallOnly: true` — exactly one future call scoped
 *   - `generalLiveLlmRuntimeAuthorizationAllowed: false` — literal; blocked
 *   - `multipleLiveLlmCallsAllowed: false` — literal; blocked
 *   - `providerAllowlistRequired: true` — literal; required
 *   - `modelAllowlistRequired: true` — literal; required
 *   - `killSwitchRequired: true` — literal; required
 *   - `postCallGovernanceRecheckRequired: true` — literal; required
 *   - `postCallAuditRequired: true` — literal; required
 *   - `liveLLMCallPerformed: false` — literal; planning does not call LLM
 *   - `envReadPerformed: false` — literal
 *   - `sdkImported: false` — literal
 *   - `httpCallMade: false` — literal
 *   - All real/raw/OCR/file/public input channels: literal `false`
 *   - All existing runtime dependency flags: literal `false`
 *   - All AI-output/model/persistence/public/user-visible flags: literal `false`
 *   - The only positive readiness gate: `readyForLiveLlmSyntheticSingleCallContract`
 *
 * ISOLATION NOTE:
 *   Phase 8.3B isolated `app/api/smart-talk/route.ts` Branch C,
 *   `lib/vaylo/smart-talk/run-smart-talk.ts`, and
 *   `lib/vaylo/smart-talk/extract-text-from-image.ts` from the governance
 *   chain. All related flags remain literal `false` in every interface.
 */

// ── Status ────────────────────────────────────────────────────────────────────

export type LiveLlmSyntheticAuthorizationPlanningStatus = "valid" | "rejected";

// ── Authorization scopes ──────────────────────────────────────────────────────

export type LiveLlmSyntheticAuthorizationScope =
  | "one_synthetic_call_only"
  | "synthetic_input_only"
  | "no_real_user_input"
  | "no_raw_input"
  | "no_real_redacted_input"
  | "no_photo_or_ocr_input"
  | "no_file_upload_input"
  | "no_public_request_input"
  | "no_branch_c_runtime"
  | "no_run_smart_talk_runtime"
  | "no_ocr_runtime"
  | "no_persistence"
  | "no_user_visible_output"
  | "no_public_runtime"
  | "post_call_governance_recheck_required";

// ── Provider policies ─────────────────────────────────────────────────────────

export type LiveLlmSyntheticProviderPolicy =
  | "provider_allowlist_required"
  | "openai_provider_allowed_for_future_synthetic_only"
  | "model_allowlist_required"
  | "model_must_be_env_configured_later"
  | "api_key_presence_check_deferred_to_execution_phase"
  | "api_key_value_must_never_be_logged"
  | "no_env_read_in_planning_phase"
  | "no_sdk_import_in_planning_phase"
  | "no_http_call_in_planning_phase";

// ── Model policies ────────────────────────────────────────────────────────────

export type LiveLlmSyntheticModelPolicy =
  | "gpt_4o_mini_allowed_for_future_synthetic_single_call_only"
  | "no_model_hardcoding_in_runtime_adapter_without_contract"
  | "model_metadata_only_in_planning_phase"
  | "model_output_must_be_untrusted"
  | "model_output_must_not_be_user_visible"
  | "model_output_must_not_be_persisted"
  | "model_output_must_be_governance_rechecked";

// ── Call constraints ──────────────────────────────────────────────────────────

export type LiveLlmSyntheticCallConstraint =
  | "one_call_maximum"
  | "synthetic_case_id_required"
  | "synthetic_prompt_marker_required"
  | "no_raw_document_text_allowed"
  | "no_real_redacted_text_allowed"
  | "no_file_or_ocr_payload_allowed"
  | "no_public_request_payload_allowed"
  | "no_direct_user_visible_return"
  | "no_storage"
  | "no_branch_c"
  | "no_run_smart_talk"
  | "no_ocr_runtime"
  | "kill_switch_required"
  | "operator_ack_required"
  | "reviewer_ack_required"
  | "post_call_audit_required";

// ── Allowed synthetic cases ───────────────────────────────────────────────────

export type LiveLlmSyntheticAllowedSyntheticCase =
  | "synthetic_safe_low_risk_payment_notice"
  | "synthetic_deadline_explicit_date"
  | "synthetic_deadline_relative_missing_delivery_date"
  | "synthetic_high_risk_widerspruch_deadline"
  | "synthetic_high_risk_immigration_uncertainty"
  | "synthetic_missing_context_partial_document"
  | "synthetic_unsupported_legal_certainty_trap"
  | "synthetic_unsafe_next_step_trap";

// ── Blocked payload classes ───────────────────────────────────────────────────

export type LiveLlmSyntheticBlockedPayloadClass =
  | "real_user_document"
  | "real_user_photo"
  | "real_ocr_text"
  | "real_raw_text"
  | "real_redacted_text"
  | "uploaded_file_content"
  | "public_request_content"
  | "private_user_pii"
  | "secrets_or_api_keys"
  | "full_document_text"
  | "model_output_from_previous_run"
  | "production_runtime_payload";

// ── Post-call requirements ────────────────────────────────────────────────────

export type LiveLlmSyntheticPostCallRequirement =
  | "capture_metadata_only"
  | "no_raw_prompt_logging"
  | "no_model_output_persistence"
  | "mark_model_output_untrusted"
  | "run_ai_output_governance_recheck"
  | "run_manual_review_gate"
  | "keep_user_visible_output_blocked"
  | "keep_public_runtime_blocked"
  | "keep_persistence_blocked"
  | "run_post_call_audit";

// ── Checklist items ───────────────────────────────────────────────────────────

export type LiveLlmSyntheticAuthorizationChecklistItem =
  | "post_run_audit_reviewed"
  | "scope_reviewed"
  | "provider_policy_reviewed"
  | "model_policy_reviewed"
  | "call_constraints_reviewed"
  | "allowed_synthetic_cases_reviewed"
  | "blocked_payload_classes_reviewed"
  | "post_call_requirements_reviewed"
  | "one_call_limit_reviewed"
  | "kill_switch_requirement_reviewed"
  | "no_env_read_in_planning_confirmed"
  | "no_http_call_in_planning_confirmed"
  | "no_sdk_import_in_planning_confirmed"
  | "existing_runtime_isolation_reviewed"
  | "no_real_input_confirmed"
  | "no_persistence_confirmed"
  | "no_user_visible_output_confirmed"
  | "no_public_runtime_confirmed"
  | "next_phase_single_call_contract_required";

// ── Rejection reasons ─────────────────────────────────────────────────────────

export type LiveLlmSyntheticAuthorizationRejectionReason =
  | "post_run_audit_not_ready"
  | "missing_authorization_scope"
  | "missing_provider_policy"
  | "missing_model_policy"
  | "missing_call_constraint"
  | "missing_allowed_synthetic_case"
  | "missing_blocked_payload_class"
  | "missing_post_call_requirement"
  | "missing_checklist_item"
  | "planning_attempted_live_llm_call"
  | "planning_attempted_env_read"
  | "planning_attempted_sdk_import"
  | "planning_attempted_http_call"
  | "planning_attempted_general_runtime_authorization"
  | "planning_attempted_multiple_call_authorization"
  | "planning_attempted_real_input_processing"
  | "planning_attempted_raw_input_forwarding"
  | "planning_attempted_redacted_input_forwarding"
  | "planning_attempted_photo_ocr_file_processing"
  | "planning_attempted_branch_c_dependency"
  | "planning_attempted_run_smart_talk_dependency"
  | "planning_attempted_ocr_runtime_dependency"
  | "planning_attempted_ai_output_generation"
  | "planning_attempted_model_output_storage"
  | "planning_attempted_user_visible_output"
  | "planning_attempted_persistence"
  | "planning_attempted_public_runtime"
  | "planning_attempted_real_operator_pilot"
  | "missing_kill_switch_requirement"
  | "missing_post_call_governance_recheck"
  | "unsafe_authorization_note_detected"
  | "forbidden_secret_detected"
  | "forbidden_env_value_detected"
  | "forbidden_api_key_detected"
  | "forbidden_pii_detected"
  | "forbidden_raw_text_detected"
  | "forbidden_redacted_text_detected"
  | "forbidden_document_content_detected"
  | "forbidden_model_output_detected";

// ── Planning input ────────────────────────────────────────────────────────────

/**
 * Input for the Live LLM Synthetic Authorization Planning validation.
 *
 * `planningOnly: true` and `futureSingleSyntheticCallOnly: true` are literal
 * invariants confirming this phase is planning, not execution, and scopes
 * exactly one future synthetic call.
 *
 * `generalLiveLlmRuntimeAuthorizationAllowed: false` and
 * `multipleLiveLlmCallsAllowed: false` are literal `false` invariants
 * blocking any broader runtime authorization.
 *
 * `liveLLMCallPerformed: false`, `envReadPerformed: false`,
 * `sdkImported: false`, and `httpCallMade: false` are literal `false`
 * invariants confirming the planning phase itself performs none of these.
 *
 * `readyForLiveLlmSyntheticSingleCallContract` is the only positive gate
 * produced by this phase (set to `true` only when planning is accepted).
 */
export interface LiveLlmSyntheticAuthorizationPlanningInput {
  readonly planningId: string;
  readonly epochId: "8.3K";
  readonly previousPhaseId: "8.3J";

  readonly postRunAuditReadyForLiveLlmSyntheticAuthorizationPlanning: boolean;

  readonly authorizationScopes: readonly LiveLlmSyntheticAuthorizationScope[];
  readonly providerPolicies: readonly LiveLlmSyntheticProviderPolicy[];
  readonly modelPolicies: readonly LiveLlmSyntheticModelPolicy[];
  readonly callConstraints: readonly LiveLlmSyntheticCallConstraint[];
  readonly allowedSyntheticCases: readonly LiveLlmSyntheticAllowedSyntheticCase[];
  readonly blockedPayloadClasses: readonly LiveLlmSyntheticBlockedPayloadClass[];
  readonly postCallRequirements: readonly LiveLlmSyntheticPostCallRequirement[];
  readonly checklistConfirmed: readonly LiveLlmSyntheticAuthorizationChecklistItem[];

  readonly planningOnly: true;
  readonly futureSingleSyntheticCallOnly: true;
  readonly generalLiveLlmRuntimeAuthorizationAllowed: false;
  readonly multipleLiveLlmCallsAllowed: false;

  readonly providerAllowlistRequired: true;
  readonly modelAllowlistRequired: true;
  readonly killSwitchRequired: true;
  readonly postCallGovernanceRecheckRequired: true;
  readonly postCallAuditRequired: true;

  readonly liveLLMCallPerformed: false;
  readonly envReadPerformed: false;
  readonly sdkImported: false;
  readonly httpCallMade: false;

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

  readonly aiOutputGenerationPerformed: false;
  readonly aiOutputGenerated: false;
  readonly modelOutputStored: false;
  readonly userVisibleOutputEmitted: false;
  readonly userVisibleOutputAuthorizedByPlanning: false;

  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;

  readonly operatorAuthorizationPlanningAcknowledgment: string;
  readonly reviewerAuthorizationPlanningAcknowledgment: string;
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
 * Result of validating a `LiveLlmSyntheticAuthorizationPlanningInput`.
 *
 * `readyForLiveLlmSyntheticSingleCallContract` is `true` only when `accepted`.
 * This is the only new positive gate produced by Phase 8.3K.
 *
 * `status` is `"valid"` when accepted, `"rejected"` otherwise.
 *
 * `safePlanningMetadata` contains only counts — no user content, no secrets,
 * no env values, no model output.
 */
export interface LiveLlmSyntheticAuthorizationPlanningResult {
  readonly planningId: string;
  readonly epochId: "8.3K";
  readonly status: LiveLlmSyntheticAuthorizationPlanningStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly LiveLlmSyntheticAuthorizationRejectionReason[];

  readonly safePlanningMetadata: {
    readonly authorizationScopeCount: number;
    readonly providerPolicyCount: number;
    readonly modelPolicyCount: number;
    readonly callConstraintCount: number;
    readonly allowedSyntheticCaseCount: number;
    readonly blockedPayloadClassCount: number;
    readonly postCallRequirementCount: number;
    readonly checklistPassedCount: number;
  };

  readonly readyForLiveLlmSyntheticSingleCallContract: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly planningOnly: true;
  readonly futureSingleSyntheticCallOnly: true;
  readonly generalLiveLlmRuntimeAuthorizationAllowed: false;
  readonly multipleLiveLlmCallsAllowed: false;

  readonly providerAllowlistRequired: true;
  readonly modelAllowlistRequired: true;
  readonly killSwitchRequired: true;
  readonly postCallGovernanceRecheckRequired: true;
  readonly postCallAuditRequired: true;

  readonly liveLLMCalled: false;
  readonly envReadPerformed: false;
  readonly sdkImported: false;
  readonly httpCallMade: false;
  readonly apiRouteCalled: false;

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

  readonly aiOutputGenerationPerformed: false;
  readonly aiOutputGenerated: false;
  readonly modelOutputStored: false;
  readonly userVisibleOutputEmitted: false;
  readonly userVisibleOutputAuthorizedByPlanning: false;

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
 * Result of `runLiveLlmSyntheticAuthorizationPlanning()` (Phase 8.3K).
 *
 * `allPassed` is true when all three sub-checks pass:
 * 1. The 8.3J post-run audit dependency is verified.
 * 2. The planning input is accepted.
 * 3. All tamper cases are rejected.
 *
 * `readyForLiveLlmSyntheticSingleCallContract` is the only positive gate.
 * `planningOnly: true` and `futureSingleSyntheticCallOnly: true` are literals.
 * `generalLiveLlmRuntimeAuthorizationAllowed: false` and
 * `multipleLiveLlmCallsAllowed: false` are literal `false` on the check result.
 */
export interface LiveLlmSyntheticAuthorizationPlanningCheckResult {
  readonly checkId: "8.3K";
  readonly allPassed: boolean;
  readonly postRunAuditReadyForLiveLlmSyntheticAuthorizationPlanning: boolean;
  readonly liveLlmSyntheticAuthorizationPlanningAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForLiveLlmSyntheticSingleCallContract: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly planningOnly: true;
  readonly futureSingleSyntheticCallOnly: true;
  readonly generalLiveLlmRuntimeAuthorizationAllowed: false;
  readonly multipleLiveLlmCallsAllowed: false;

  readonly providerAllowlistRequired: true;
  readonly modelAllowlistRequired: true;
  readonly killSwitchRequired: true;
  readonly postCallGovernanceRecheckRequired: true;
  readonly postCallAuditRequired: true;

  readonly liveLLMCalled: false;
  readonly envReadPerformed: false;
  readonly sdkImported: false;
  readonly httpCallMade: false;

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

  readonly aiOutputGenerated: false;
  readonly modelOutputStored: false;
  readonly userVisibleOutputEmitted: false;
  readonly persistenceUsed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;
  readonly neverUserVisible: true;

  readonly notes: readonly string[];
}

// ── Exported constants ────────────────────────────────────────────────────────

export const REQUIRED_LIVE_LLM_SYNTHETIC_AUTHORIZATION_SCOPES: readonly LiveLlmSyntheticAuthorizationScope[] =
  [
    "one_synthetic_call_only",
    "synthetic_input_only",
    "no_real_user_input",
    "no_raw_input",
    "no_real_redacted_input",
    "no_photo_or_ocr_input",
    "no_file_upload_input",
    "no_public_request_input",
    "no_branch_c_runtime",
    "no_run_smart_talk_runtime",
    "no_ocr_runtime",
    "no_persistence",
    "no_user_visible_output",
    "no_public_runtime",
    "post_call_governance_recheck_required",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_PROVIDER_POLICIES: readonly LiveLlmSyntheticProviderPolicy[] =
  [
    "provider_allowlist_required",
    "openai_provider_allowed_for_future_synthetic_only",
    "model_allowlist_required",
    "model_must_be_env_configured_later",
    "api_key_presence_check_deferred_to_execution_phase",
    "api_key_value_must_never_be_logged",
    "no_env_read_in_planning_phase",
    "no_sdk_import_in_planning_phase",
    "no_http_call_in_planning_phase",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_MODEL_POLICIES: readonly LiveLlmSyntheticModelPolicy[] =
  [
    "gpt_4o_mini_allowed_for_future_synthetic_single_call_only",
    "no_model_hardcoding_in_runtime_adapter_without_contract",
    "model_metadata_only_in_planning_phase",
    "model_output_must_be_untrusted",
    "model_output_must_not_be_user_visible",
    "model_output_must_not_be_persisted",
    "model_output_must_be_governance_rechecked",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_CALL_CONSTRAINTS: readonly LiveLlmSyntheticCallConstraint[] =
  [
    "one_call_maximum",
    "synthetic_case_id_required",
    "synthetic_prompt_marker_required",
    "no_raw_document_text_allowed",
    "no_real_redacted_text_allowed",
    "no_file_or_ocr_payload_allowed",
    "no_public_request_payload_allowed",
    "no_direct_user_visible_return",
    "no_storage",
    "no_branch_c",
    "no_run_smart_talk",
    "no_ocr_runtime",
    "kill_switch_required",
    "operator_ack_required",
    "reviewer_ack_required",
    "post_call_audit_required",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_ALLOWED_CASES: readonly LiveLlmSyntheticAllowedSyntheticCase[] =
  [
    "synthetic_safe_low_risk_payment_notice",
    "synthetic_deadline_explicit_date",
    "synthetic_deadline_relative_missing_delivery_date",
    "synthetic_high_risk_widerspruch_deadline",
    "synthetic_high_risk_immigration_uncertainty",
    "synthetic_missing_context_partial_document",
    "synthetic_unsupported_legal_certainty_trap",
    "synthetic_unsafe_next_step_trap",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_BLOCKED_PAYLOAD_CLASSES: readonly LiveLlmSyntheticBlockedPayloadClass[] =
  [
    "real_user_document",
    "real_user_photo",
    "real_ocr_text",
    "real_raw_text",
    "real_redacted_text",
    "uploaded_file_content",
    "public_request_content",
    "private_user_pii",
    "secrets_or_api_keys",
    "full_document_text",
    "model_output_from_previous_run",
    "production_runtime_payload",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_POST_CALL_REQUIREMENTS: readonly LiveLlmSyntheticPostCallRequirement[] =
  [
    "capture_metadata_only",
    "no_raw_prompt_logging",
    "no_model_output_persistence",
    "mark_model_output_untrusted",
    "run_ai_output_governance_recheck",
    "run_manual_review_gate",
    "keep_user_visible_output_blocked",
    "keep_public_runtime_blocked",
    "keep_persistence_blocked",
    "run_post_call_audit",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_AUTHORIZATION_CHECKLIST: readonly LiveLlmSyntheticAuthorizationChecklistItem[] =
  [
    "post_run_audit_reviewed",
    "scope_reviewed",
    "provider_policy_reviewed",
    "model_policy_reviewed",
    "call_constraints_reviewed",
    "allowed_synthetic_cases_reviewed",
    "blocked_payload_classes_reviewed",
    "post_call_requirements_reviewed",
    "one_call_limit_reviewed",
    "kill_switch_requirement_reviewed",
    "no_env_read_in_planning_confirmed",
    "no_http_call_in_planning_confirmed",
    "no_sdk_import_in_planning_confirmed",
    "existing_runtime_isolation_reviewed",
    "no_real_input_confirmed",
    "no_persistence_confirmed",
    "no_user_visible_output_confirmed",
    "no_public_runtime_confirmed",
    "next_phase_single_call_contract_required",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_AUTHORIZATION_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that this phase is authorization planning only and does not call a live LLM.",
    "I acknowledge that any future live LLM call must be one synthetic call only.",
    "I acknowledge that real input, OCR, files, public requests, Branch C, run-smart-talk.ts, and persistence remain blocked.",
    "I acknowledge that model output from a future call must be treated as untrusted and rechecked by governance.",
    "I acknowledge that live LLM runtime and public launch are not authorized by this planning phase.",
  ] as const;

export const FORBIDDEN_LIVE_LLM_SYNTHETIC_AUTHORIZATION_STRINGS: readonly string[] =
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
    "real user document",
    "real OCR text",
    "production runtime enabled",
    "harness executed with live llm",
    "live llm executed",
    "real operator pilot executed",
    "real model output",
    "post-run audit stored output",
    "live llm now authorized",
    "live llm call performed",
    "multiple live llm calls authorized",
    "general live llm runtime authorized",
  ] as const;
