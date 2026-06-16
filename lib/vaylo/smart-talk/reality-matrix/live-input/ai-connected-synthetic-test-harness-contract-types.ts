/**
 * AI-Connected Synthetic Test Harness Contract Types (Phase 8.3G).
 *
 * Defines the typed contract for the conditions under which a future
 * synthetic-only test harness may exercise the governance-controlled AI adapter
 * path. Builds on Phase 8.3F (User-Visible Output Authorization Contract).
 *
 * Key governance invariants:
 *   - Only synthetic input is permitted for any future harness execution
 *   - Real user input, OCR/photo/file input, raw text, real redacted text, and
 *     public requests are ALL explicitly blocked as literal `false` invariants
 *   - A dedicated synthetic adapter and a future execution plan are REQUIRED
 *   - Harness execution does NOT happen in this contract phase
 *   - `adapterExecutionPerformedNow` is always literal `false`
 *   - Live LLM runtime, public runtime, persistence, Branch C, run-smart-talk.ts,
 *     and OCR runtime are ALL NOT authorized (all literal `false`)
 *   - The only positive readiness gate is
 *     `readyForAiConnectedSyntheticTestHarnessExecutionPlan`
 *
 * ISOLATION NOTE:
 *   Phase 8.3B isolated `app/api/smart-talk/route.ts` Branch C,
 *   `lib/vaylo/smart-talk/run-smart-talk.ts`, and
 *   `lib/vaylo/smart-talk/extract-text-from-image.ts` from the governance chain.
 *   That isolation is fully preserved here.
 *   `branchCAuthorized`, `runSmartTalkAuthorized`, `ocrRuntimeAuthorized`,
 *   `branchCCalled`, `runSmartTalkCalledOrImported`, and
 *   `extractTextFromImageCalledOrImported` are all literal `false`.
 *
 * This module does NOT:
 * - read process.env
 * - call any live LLM or make HTTP requests
 * - generate AI output or store model output
 * - emit user-visible output
 * - execute the synthetic test harness
 * - authorize public runtime, live LLM runtime, persistence, global output,
 *   Branch C, run-smart-talk.ts, or OCR runtime
 * - process real user input, OCR, photo, files, or public requests
 * - forward raw or real redacted input to a live model
 * - persist any records or store user content
 * - modify DB/storage schema or API routes
 * - modify UI
 *
 * Safety invariants on AiConnectedSyntheticTestHarnessContractInput (all literal):
 * - syntheticInputOnly: true
 * - realUserInputAllowed: false
 * - rawInputAllowed: false
 * - realRedactedInputAllowed: false
 * - photoOrOcrInputAllowed: false
 * - fileUploadInputAllowed: false
 * - publicAnonymousInputAllowed: false
 * - dedicatedSyntheticAdapterRequired: true
 * - futureExecutionPlanRequired: true
 * - adapterExecutionPerformedNow: false
 * - branchCAuthorized: false
 * - runSmartTalkAuthorized: false
 * - ocrRuntimeAuthorized: false
 * - branchCCalled: false
 * - runSmartTalkCalledOrImported: false
 * - extractTextFromImageCalledOrImported: false
 * - liveLLMCallPerformed: false
 * - aiOutputGenerationPerformed: false
 * - aiOutputGenerated: false
 * - modelOutputStored: false
 * - userVisibleOutputEmitted: false
 * - userVisibleOutputAuthorizedByContract: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - publicRuntimeEnabled: false
 * - realOperatorPilotExecuted: false
 * - all contains* flags: false
 * - neverUserVisible: true
 *
 * Safety invariants on AiConnectedSyntheticTestHarnessContractResult (all literal):
 * - readyForLiveLLMRuntime: false
 * - readyForConnectedAiRuntimeExecution: false
 * - readyForRealOperatorPilotRun: false
 * - readyForPilotRunNow: false
 * - readyForPublicLaunch: false
 * - readyForPersistence: false
 * - syntheticInputOnly: true
 * - all real/raw/ocr/file/public input allowed: false
 * - adapterExecutionPerformedNow: false
 * - branchCAuthorized: false, runSmartTalkAuthorized: false, ocrRuntimeAuthorized: false
 * - branchCCalled: false, runSmartTalkCalledOrImported: false,
 *   extractTextFromImageCalledOrImported: false
 * - liveLLMCalled: false, aiOutputGenerationPerformed: false,
 *   aiOutputGenerated: false, modelOutputStored: false
 * - userVisibleOutputEmitted: false, userVisibleOutputAuthorizedByContract: false
 * - persistenceUsed: false, dnaSavePerformed: false, offlineSavePerformed: false
 * - publicRuntimeEnabled: false, realOperatorPilotExecuted: false
 * - httpCallMade: false, apiRouteCalled: false
 * - apiRouteModifiedBySyntheticHarnessContract: false
 * - existingRuntimeModifiedBySyntheticHarnessContract: false
 * - uiTouched: false, databaseOrStorageModifiedBySyntheticHarnessContract: false
 * - neverUserVisible: true
 */

// ── Contract status ───────────────────────────────────────────────────────────

export type AiConnectedSyntheticTestHarnessContractStatus =
  | "valid"
  | "rejected";

// ── Harness scope ─────────────────────────────────────────────────────────────

export type SyntheticHarnessScope =
  | "synthetic_input_only"
  | "no_real_user_input"
  | "no_raw_input"
  | "no_real_redacted_input"
  | "no_photo_or_ocr_input"
  | "no_file_upload_input"
  | "no_public_anonymous_input"
  | "no_user_visible_output"
  | "no_persistence"
  | "no_public_runtime"
  | "no_branch_c_runtime"
  | "no_existing_run_smart_talk_runtime"
  | "no_ocr_runtime";

// ── Synthetic input classes ───────────────────────────────────────────────────

export type SyntheticHarnessInputClass =
  | "synthetic_bureaucratic_notice"
  | "synthetic_payment_notice"
  | "synthetic_deadline_question"
  | "synthetic_uncertainty_case"
  | "synthetic_high_risk_block_case"
  | "synthetic_safe_low_risk_case";

// ── Blocked input classes ─────────────────────────────────────────────────────

export type SyntheticHarnessBlockedInputClass =
  | "real_user_document"
  | "real_user_photo"
  | "real_ocr_text"
  | "real_raw_text"
  | "real_redacted_text"
  | "uploaded_file_content"
  | "public_request_content"
  | "private_user_pii"
  | "secrets_or_api_keys"
  | "real_immigration_case"
  | "real_financial_sanction_case"
  | "real_appeal_deadline_case"
  | "real_medical_or_child_data_case";

// ── Preconditions ─────────────────────────────────────────────────────────────

export type SyntheticHarnessPrecondition =
  | "user_visible_authorization_contract_ready"
  | "synthetic_input_catalog_required"
  | "synthetic_input_must_be_marked_synthetic"
  | "no_real_input_allowed"
  | "no_content_storage_allowed"
  | "existing_runtime_isolation_preserved"
  | "branch_c_not_called"
  | "run_smart_talk_not_called"
  | "ocr_runtime_not_called"
  | "live_llm_call_still_blocked_by_this_contract"
  | "future_execution_plan_required"
  | "governance_recheck_chain_required"
  | "manual_review_chain_required"
  | "user_visible_authorization_chain_required"
  | "post_run_audit_required_later";

// ── Adapter policy ────────────────────────────────────────────────────────────

export type SyntheticHarnessAdapterPolicy =
  | "dedicated_synthetic_adapter_required"
  | "existing_public_route_not_authorized"
  | "existing_run_smart_talk_not_authorized"
  | "ocr_adapter_not_authorized"
  | "adapter_must_accept_synthetic_input_only"
  | "adapter_must_return_metadata_only_until_execution_phase"
  | "adapter_execution_requires_future_plan";

// ── Expected outcomes ─────────────────────────────────────────────────────────

export type SyntheticHarnessExpectedOutcome =
  | "ready_for_future_synthetic_execution_plan"
  | "blocked_if_real_input_detected"
  | "blocked_if_branch_c_called"
  | "blocked_if_run_smart_talk_called"
  | "blocked_if_ocr_called"
  | "blocked_if_live_llm_called_in_contract"
  | "blocked_if_user_visible_output_attempted"
  | "blocked_if_persistence_attempted"
  | "blocked_if_public_runtime_attempted";

// ── Checklist items ───────────────────────────────────────────────────────────

export type SyntheticHarnessChecklistItem =
  | "scope_reviewed"
  | "synthetic_input_classes_reviewed"
  | "blocked_input_classes_reviewed"
  | "preconditions_reviewed"
  | "adapter_policy_reviewed"
  | "expected_outcomes_reviewed"
  | "existing_runtime_isolation_reviewed"
  | "no_real_input_confirmed"
  | "no_raw_input_confirmed"
  | "no_real_redacted_input_confirmed"
  | "no_photo_ocr_file_input_confirmed"
  | "no_live_llm_call_confirmed"
  | "no_ai_output_generation_confirmed"
  | "no_model_output_storage_confirmed"
  | "no_user_visible_output_confirmed"
  | "no_persistence_confirmed"
  | "no_public_runtime_confirmed"
  | "future_execution_plan_required_confirmed";

// ── Rejection reasons ─────────────────────────────────────────────────────────

export type AiConnectedSyntheticTestHarnessRejectionReason =
  | "user_visible_authorization_contract_not_ready"
  | "missing_scope"
  | "missing_synthetic_input_class"
  | "missing_blocked_input_class"
  | "missing_precondition"
  | "missing_adapter_policy"
  | "missing_expected_outcome"
  | "missing_required_checklist_item"
  | "unsafe_adapter_authorization_detected"
  | "real_input_allowed_detected"
  | "raw_input_allowed_detected"
  | "real_redacted_input_allowed_detected"
  | "photo_or_ocr_input_allowed_detected"
  | "file_upload_input_allowed_detected"
  | "public_input_allowed_detected"
  | "branch_c_call_claim_detected"
  | "run_smart_talk_call_claim_detected"
  | "ocr_runtime_call_claim_detected"
  | "live_llm_call_claim_detected"
  | "ai_output_generation_claim_detected"
  | "model_output_storage_claim_detected"
  | "user_visible_output_claim_detected"
  | "persistence_claim_detected"
  | "public_runtime_claim_detected"
  | "real_operator_pilot_claim_detected"
  | "missing_future_execution_plan_requirement"
  | "forbidden_secret_detected"
  | "forbidden_env_value_detected"
  | "forbidden_api_key_detected"
  | "forbidden_pii_detected"
  | "forbidden_raw_text_detected"
  | "forbidden_redacted_text_detected"
  | "forbidden_document_content_detected"
  | "forbidden_model_output_detected"
  | "unsafe_synthetic_harness_note_detected";

// ── Contract input ────────────────────────────────────────────────────────────

/**
 * Input for the AI-Connected Synthetic Test Harness Contract validation.
 *
 * `syntheticInputOnly: true` is the positive scope assertion — all real input
 * channels are blocked as literal `false`.
 *
 * `adapterExecutionPerformedNow: false` is the critical gate: this contract
 * defines conditions for future harness execution, not the execution itself.
 *
 * `branchCAuthorized: false`, `runSmartTalkAuthorized: false`, and
 * `ocrRuntimeAuthorized: false` maintain the full isolation of existing live
 * runtime paths established in Phase 8.3B.
 *
 * `futureExecutionPlanRequired: true` ensures execution cannot happen without
 * a separate planning contract.
 */
export interface AiConnectedSyntheticTestHarnessContractInput {
  readonly contractId: string;
  readonly epochId: "8.3G";
  readonly previousPhaseId: "8.3F";

  readonly userVisibleOutputAuthorizationReady: boolean;

  readonly scopes: readonly SyntheticHarnessScope[];
  readonly syntheticInputClasses: readonly SyntheticHarnessInputClass[];
  readonly blockedInputClasses: readonly SyntheticHarnessBlockedInputClass[];
  readonly preconditions: readonly SyntheticHarnessPrecondition[];
  readonly adapterPolicies: readonly SyntheticHarnessAdapterPolicy[];
  readonly expectedOutcomes: readonly SyntheticHarnessExpectedOutcome[];
  readonly checklistConfirmed: readonly SyntheticHarnessChecklistItem[];

  readonly syntheticInputOnly: true;
  readonly realUserInputAllowed: false;
  readonly rawInputAllowed: false;
  readonly realRedactedInputAllowed: false;
  readonly photoOrOcrInputAllowed: false;
  readonly fileUploadInputAllowed: false;
  readonly publicAnonymousInputAllowed: false;

  readonly dedicatedSyntheticAdapterRequired: true;
  readonly futureExecutionPlanRequired: true;
  readonly adapterExecutionPerformedNow: false;

  readonly branchCAuthorized: false;
  readonly runSmartTalkAuthorized: false;
  readonly ocrRuntimeAuthorized: false;

  readonly branchCCalled: false;
  readonly runSmartTalkCalledOrImported: false;
  readonly extractTextFromImageCalledOrImported: false;

  readonly liveLLMCallPerformed: false;
  readonly aiOutputGenerationPerformed: false;
  readonly aiOutputGenerated: false;
  readonly modelOutputStored: false;
  readonly userVisibleOutputEmitted: false;
  readonly userVisibleOutputAuthorizedByContract: false;

  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;

  readonly operatorSyntheticHarnessAcknowledgment: string;
  readonly reviewerSyntheticHarnessAcknowledgment: string;
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

// ── Contract result ───────────────────────────────────────────────────────────

/**
 * Result of validating an `AiConnectedSyntheticTestHarnessContractInput`.
 *
 * `readyForAiConnectedSyntheticTestHarnessExecutionPlan` is `true` only when
 * `accepted === true`. Even then, no harness is executed, no LLM is called,
 * no output is emitted.
 *
 * `safeSyntheticHarnessMetadata` stores only counts — no user content, env
 * values, secrets, API keys, or model output.
 */
export interface AiConnectedSyntheticTestHarnessContractResult {
  readonly contractId: string;
  readonly epochId: "8.3G";
  readonly status: AiConnectedSyntheticTestHarnessContractStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly AiConnectedSyntheticTestHarnessRejectionReason[];

  readonly safeSyntheticHarnessMetadata: {
    readonly scopeCount: number;
    readonly syntheticInputClassCount: number;
    readonly blockedInputClassCount: number;
    readonly preconditionCount: number;
    readonly adapterPolicyCount: number;
    readonly expectedOutcomeCount: number;
    readonly checklistPassedCount: number;
  };

  readonly readyForAiConnectedSyntheticTestHarnessExecutionPlan: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly syntheticInputOnly: true;
  readonly realUserInputAllowed: false;
  readonly rawInputAllowed: false;
  readonly realRedactedInputAllowed: false;
  readonly photoOrOcrInputAllowed: false;
  readonly fileUploadInputAllowed: false;
  readonly publicAnonymousInputAllowed: false;

  readonly adapterExecutionPerformedNow: false;
  readonly branchCAuthorized: false;
  readonly runSmartTalkAuthorized: false;
  readonly ocrRuntimeAuthorized: false;

  readonly branchCCalled: false;
  readonly runSmartTalkCalledOrImported: false;
  readonly extractTextFromImageCalledOrImported: false;

  readonly liveLLMCalled: false;
  readonly aiOutputGenerationPerformed: false;
  readonly aiOutputGenerated: false;
  readonly modelOutputStored: false;
  readonly userVisibleOutputEmitted: false;
  readonly userVisibleOutputAuthorizedByContract: false;

  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;

  readonly httpCallMade: false;
  readonly apiRouteCalled: false;
  readonly apiRouteModifiedBySyntheticHarnessContract: false;
  readonly existingRuntimeModifiedBySyntheticHarnessContract: false;
  readonly uiTouched: false;
  readonly databaseOrStorageModifiedBySyntheticHarnessContract: false;
  readonly neverUserVisible: true;
}

// ── Check result ──────────────────────────────────────────────────────────────

/**
 * Result of `runAiConnectedSyntheticTestHarnessContractCheck()` (Phase 8.3G).
 *
 * `allPassed` is true when all three sub-checks pass:
 * 1. The 8.3F user-visible output authorization dependency is verified.
 * 2. The synthetic harness contract input is accepted.
 * 3. All tamper cases are rejected.
 *
 * `readyForAiConnectedSyntheticTestHarnessExecutionPlan` is the only positive
 * gate. No harness is executed, no LLM is called, no runtime is authorized.
 */
export interface AiConnectedSyntheticTestHarnessContractCheckResult {
  readonly checkId: "8.3G";
  readonly allPassed: boolean;
  readonly userVisibleOutputAuthorizationReady: boolean;
  readonly syntheticAiConnectedHarnessContractAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForAiConnectedSyntheticTestHarnessExecutionPlan: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly syntheticInputOnly: true;
  readonly realUserInputAllowed: false;
  readonly rawInputAllowed: false;
  readonly realRedactedInputAllowed: false;
  readonly photoOrOcrInputAllowed: false;
  readonly fileUploadInputAllowed: false;
  readonly publicAnonymousInputAllowed: false;

  readonly adapterExecutionPerformedNow: false;
  readonly branchCAuthorized: false;
  readonly runSmartTalkAuthorized: false;
  readonly ocrRuntimeAuthorized: false;

  readonly branchCCalled: false;
  readonly runSmartTalkCalledOrImported: false;
  readonly extractTextFromImageCalledOrImported: false;

  readonly liveLLMCalled: false;
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

/** All harness scopes that must be present in a valid input. */
export const REQUIRED_AI_CONNECTED_SYNTHETIC_HARNESS_SCOPES: readonly SyntheticHarnessScope[] =
  [
    "synthetic_input_only",
    "no_real_user_input",
    "no_raw_input",
    "no_real_redacted_input",
    "no_photo_or_ocr_input",
    "no_file_upload_input",
    "no_public_anonymous_input",
    "no_user_visible_output",
    "no_persistence",
    "no_public_runtime",
    "no_branch_c_runtime",
    "no_existing_run_smart_talk_runtime",
    "no_ocr_runtime",
  ] as const;

/** All synthetic input classes that must be present in a valid input. */
export const REQUIRED_AI_CONNECTED_SYNTHETIC_INPUT_CLASSES: readonly SyntheticHarnessInputClass[] =
  [
    "synthetic_bureaucratic_notice",
    "synthetic_payment_notice",
    "synthetic_deadline_question",
    "synthetic_uncertainty_case",
    "synthetic_high_risk_block_case",
    "synthetic_safe_low_risk_case",
  ] as const;

/** All blocked input classes that must be present in a valid input. */
export const BLOCKED_AI_CONNECTED_SYNTHETIC_INPUT_CLASSES: readonly SyntheticHarnessBlockedInputClass[] =
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
    "real_immigration_case",
    "real_financial_sanction_case",
    "real_appeal_deadline_case",
    "real_medical_or_child_data_case",
  ] as const;

/** All preconditions that must be present in a valid input. */
export const REQUIRED_AI_CONNECTED_SYNTHETIC_HARNESS_PRECONDITIONS: readonly SyntheticHarnessPrecondition[] =
  [
    "user_visible_authorization_contract_ready",
    "synthetic_input_catalog_required",
    "synthetic_input_must_be_marked_synthetic",
    "no_real_input_allowed",
    "no_content_storage_allowed",
    "existing_runtime_isolation_preserved",
    "branch_c_not_called",
    "run_smart_talk_not_called",
    "ocr_runtime_not_called",
    "live_llm_call_still_blocked_by_this_contract",
    "future_execution_plan_required",
    "governance_recheck_chain_required",
    "manual_review_chain_required",
    "user_visible_authorization_chain_required",
    "post_run_audit_required_later",
  ] as const;

/** All adapter policies that must be present in a valid input. */
export const REQUIRED_AI_CONNECTED_SYNTHETIC_ADAPTER_POLICIES: readonly SyntheticHarnessAdapterPolicy[] =
  [
    "dedicated_synthetic_adapter_required",
    "existing_public_route_not_authorized",
    "existing_run_smart_talk_not_authorized",
    "ocr_adapter_not_authorized",
    "adapter_must_accept_synthetic_input_only",
    "adapter_must_return_metadata_only_until_execution_phase",
    "adapter_execution_requires_future_plan",
  ] as const;

/** All expected outcomes that must be present in a valid input. */
export const REQUIRED_AI_CONNECTED_SYNTHETIC_EXPECTED_OUTCOMES: readonly SyntheticHarnessExpectedOutcome[] =
  [
    "ready_for_future_synthetic_execution_plan",
    "blocked_if_real_input_detected",
    "blocked_if_branch_c_called",
    "blocked_if_run_smart_talk_called",
    "blocked_if_ocr_called",
    "blocked_if_live_llm_called_in_contract",
    "blocked_if_user_visible_output_attempted",
    "blocked_if_persistence_attempted",
    "blocked_if_public_runtime_attempted",
  ] as const;

/** All checklist items that must be confirmed in a valid input. */
export const REQUIRED_AI_CONNECTED_SYNTHETIC_HARNESS_CHECKLIST: readonly SyntheticHarnessChecklistItem[] =
  [
    "scope_reviewed",
    "synthetic_input_classes_reviewed",
    "blocked_input_classes_reviewed",
    "preconditions_reviewed",
    "adapter_policy_reviewed",
    "expected_outcomes_reviewed",
    "existing_runtime_isolation_reviewed",
    "no_real_input_confirmed",
    "no_raw_input_confirmed",
    "no_real_redacted_input_confirmed",
    "no_photo_ocr_file_input_confirmed",
    "no_live_llm_call_confirmed",
    "no_ai_output_generation_confirmed",
    "no_model_output_storage_confirmed",
    "no_user_visible_output_confirmed",
    "no_persistence_confirmed",
    "no_public_runtime_confirmed",
    "future_execution_plan_required_confirmed",
  ] as const;

/**
 * Required statements that must appear in both operator and reviewer
 * synthetic harness acknowledgments.
 */
export const REQUIRED_AI_CONNECTED_SYNTHETIC_HARNESS_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that this contract does not execute the AI-connected harness.",
    "I acknowledge that only synthetic input is allowed for the future harness.",
    "I acknowledge that real user input, OCR, files, and public requests remain blocked.",
    "I acknowledge that existing Branch C and run-smart-talk.ts remain isolated.",
    "I acknowledge that live LLM runtime, public runtime, and persistence remain blocked.",
  ] as const;

/**
 * Strings that must never appear in any harness contract field or notes.
 */
export const FORBIDDEN_AI_CONNECTED_SYNTHETIC_HARNESS_STRINGS: readonly string[] =
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
  ] as const;
