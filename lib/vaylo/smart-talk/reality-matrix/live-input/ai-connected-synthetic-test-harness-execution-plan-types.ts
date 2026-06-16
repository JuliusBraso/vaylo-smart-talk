/**
 * AI-Connected Synthetic Test Harness Execution Plan Types (Phase 8.3H).
 *
 * Defines the typed execution plan for a future synthetic-only test harness.
 * Specifies which synthetic test cases must exist, which adapter interface
 * will be exercised, which governance chain steps apply, which metadata-only
 * observations may be captured, which failure conditions block execution, and
 * which next phase may execute a dry run.
 *
 * Builds on Phase 8.3G (AI-Connected Synthetic Test Harness Contract).
 *
 * Key governance invariants:
 *   - `harnessExecutionPerformedNow: false` — this plan does NOT execute
 *   - `dryExecutionDeferredToNextPhase: true` — dry run requires next phase
 *   - `syntheticInputOnly: true` — only synthetic case IDs and markers allowed
 *   - All real/raw/OCR/file/public input channels: literal `false`
 *   - All existing runtime dependency flags: literal `false`
 *   - All LLM/AI-output/persistence/public/user-visible flags: literal `false`
 *   - The only positive readiness gate:
 *     `readyForAiConnectedSyntheticHarnessDryExecution`
 *
 * ISOLATION NOTE:
 *   Phase 8.3B isolated `app/api/smart-talk/route.ts` Branch C,
 *   `lib/vaylo/smart-talk/run-smart-talk.ts`, and
 *   `lib/vaylo/smart-talk/extract-text-from-image.ts` from the governance chain.
 *   `branchCDependencyAllowed`, `runSmartTalkDependencyAllowed`,
 *   `ocrRuntimeDependencyAllowed`, `branchCCalled`,
 *   `runSmartTalkCalledOrImported`, and
 *   `extractTextFromImageCalledOrImported` are all literal `false`.
 *
 * This module does NOT:
 * - read process.env
 * - call any live LLM or make HTTP requests
 * - execute the synthetic test harness
 * - generate AI output or store model output
 * - emit user-visible output
 * - authorize public runtime, live LLM runtime, persistence, or global output
 * - process real user input, OCR, photo, files, or public requests
 * - forward raw or real redacted input to a live model
 * - persist any records or store user content
 * - modify DB/storage schema or API routes
 * - import, call, or wrap run-smart-talk.ts or extract-text-from-image.ts
 * - modify UI
 *
 * Safety invariants on AiConnectedSyntheticHarnessExecutionPlanInput (literal):
 * - harnessExecutionPerformedNow: false
 * - dryExecutionDeferredToNextPhase: true
 * - syntheticInputOnly: true
 * - realUserInputAllowed: false
 * - rawInputAllowed: false
 * - realRedactedInputAllowed: false
 * - photoOrOcrInputAllowed: false
 * - fileUploadInputAllowed: false
 * - publicAnonymousInputAllowed: false
 * - branchCDependencyAllowed: false
 * - runSmartTalkDependencyAllowed: false
 * - ocrRuntimeDependencyAllowed: false
 * - branchCCalled: false
 * - runSmartTalkCalledOrImported: false
 * - extractTextFromImageCalledOrImported: false
 * - liveLLMCallPerformed: false
 * - aiOutputGenerationPerformed: false
 * - aiOutputGenerated: false
 * - modelOutputStored: false
 * - userVisibleOutputEmitted: false
 * - userVisibleOutputAuthorizedByPlan: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - publicRuntimeEnabled: false
 * - realOperatorPilotExecuted: false
 * - all contains* flags: false
 * - neverUserVisible: true
 *
 * Safety invariants on AiConnectedSyntheticHarnessExecutionPlanResult (literal):
 * - readyForLiveLLMRuntime: false
 * - readyForConnectedAiRuntimeExecution: false
 * - readyForRealOperatorPilotRun: false
 * - readyForPilotRunNow: false
 * - readyForPublicLaunch: false
 * - readyForPersistence: false
 * - harnessExecutionPerformedNow: false
 * - dryExecutionDeferredToNextPhase: true
 * - syntheticInputOnly: true
 * - all real/raw/OCR/file/public input allowed: false
 * - all dependency/call flags: false
 * - all LLM/AI/model/user-visible/persistence/public/pilot flags: false
 * - httpCallMade: false, apiRouteCalled: false
 * - apiRouteModifiedByExecutionPlan: false
 * - existingRuntimeModifiedByExecutionPlan: false
 * - uiTouched: false
 * - databaseOrStorageModifiedByExecutionPlan: false
 * - neverUserVisible: true
 */

// ── Plan status ───────────────────────────────────────────────────────────────

export type AiConnectedSyntheticHarnessExecutionPlanStatus =
  | "valid"
  | "rejected";

// ── Execution mode ────────────────────────────────────────────────────────────

export type SyntheticHarnessExecutionMode =
  | "planned_only"
  | "dry_execution_allowed_next_phase";

// ── Synthetic case catalog ────────────────────────────────────────────────────

export type SyntheticHarnessCaseId =
  | "synthetic_safe_low_risk_payment_notice"
  | "synthetic_deadline_explicit_date"
  | "synthetic_deadline_relative_missing_delivery_date"
  | "synthetic_high_risk_widerspruch_deadline"
  | "synthetic_high_risk_immigration_uncertainty"
  | "synthetic_missing_context_partial_document"
  | "synthetic_unsupported_legal_certainty_trap"
  | "synthetic_unsafe_next_step_trap";

// ── Risk classes ──────────────────────────────────────────────────────────────

export type SyntheticHarnessCaseRiskClass =
  | "low_risk"
  | "medium_risk"
  | "high_risk"
  | "trap_case";

// ── Adapter interface policy ──────────────────────────────────────────────────

export type SyntheticHarnessAdapterInterfacePolicy =
  | "dedicated_synthetic_adapter_interface_required"
  | "adapter_accepts_synthetic_case_id_only"
  | "adapter_accepts_synthetic_payload_marker_only"
  | "adapter_must_not_accept_real_text"
  | "adapter_must_not_accept_raw_text"
  | "adapter_must_not_accept_redacted_real_text"
  | "adapter_must_not_call_branch_c"
  | "adapter_must_not_call_run_smart_talk"
  | "adapter_must_not_call_ocr_runtime"
  | "adapter_dry_execution_requires_next_phase";

// ── Governance steps ──────────────────────────────────────────────────────────

export type SyntheticHarnessGovernanceStep =
  | "live_llm_boundary_check"
  | "redacted_input_forwarding_policy_check"
  | "ai_output_governance_recheck_policy_check"
  | "manual_review_policy_check"
  | "user_visible_authorization_policy_check"
  | "hallucination_trap_expectation_check"
  | "deadline_claim_expectation_check"
  | "uncertainty_preservation_expectation_check"
  | "user_visible_output_block_check"
  | "persistence_block_check"
  | "public_runtime_block_check";

// ── Metadata-only observations ────────────────────────────────────────────────

export type SyntheticHarnessMetadataOnlyObservation =
  | "case_id"
  | "risk_class"
  | "expected_block_or_allow_path"
  | "expected_governance_steps"
  | "expected_trap_labels"
  | "expected_deadline_handling"
  | "expected_uncertainty_handling"
  | "expected_user_visible_block_status"
  | "expected_persistence_block_status"
  | "expected_runtime_block_status";

// ── Execution blockers ────────────────────────────────────────────────────────

export type SyntheticHarnessExecutionBlocker =
  | "real_input_detected"
  | "raw_input_detected"
  | "real_redacted_input_detected"
  | "ocr_or_photo_input_detected"
  | "file_input_detected"
  | "public_request_detected"
  | "branch_c_dependency_detected"
  | "run_smart_talk_dependency_detected"
  | "ocr_runtime_dependency_detected"
  | "live_llm_call_detected"
  | "ai_output_generation_detected"
  | "model_output_storage_detected"
  | "user_visible_output_detected"
  | "persistence_detected"
  | "public_runtime_detected"
  | "missing_synthetic_case_catalog"
  | "missing_adapter_interface_policy"
  | "missing_governance_step_plan"
  | "missing_metadata_only_observation_plan";

// ── Checklist items ───────────────────────────────────────────────────────────

export type SyntheticHarnessExecutionChecklistItem =
  | "execution_mode_reviewed"
  | "synthetic_case_catalog_reviewed"
  | "risk_classes_reviewed"
  | "adapter_interface_policy_reviewed"
  | "governance_step_plan_reviewed"
  | "metadata_only_observation_plan_reviewed"
  | "blockers_reviewed"
  | "no_real_input_confirmed"
  | "no_raw_input_confirmed"
  | "no_real_redacted_input_confirmed"
  | "no_ocr_photo_file_input_confirmed"
  | "no_branch_c_dependency_confirmed"
  | "no_run_smart_talk_dependency_confirmed"
  | "no_ocr_runtime_dependency_confirmed"
  | "no_live_llm_call_confirmed"
  | "no_ai_output_generation_confirmed"
  | "no_model_output_storage_confirmed"
  | "no_user_visible_output_confirmed"
  | "no_persistence_confirmed"
  | "no_public_runtime_confirmed"
  | "dry_execution_requires_next_phase_confirmed";

// ── Rejection reasons ─────────────────────────────────────────────────────────

export type AiConnectedSyntheticHarnessExecutionPlanRejectionReason =
  | "synthetic_harness_contract_not_ready"
  | "invalid_execution_mode"
  | "missing_synthetic_case"
  | "missing_risk_class"
  | "missing_adapter_interface_policy"
  | "missing_governance_step"
  | "missing_metadata_only_observation"
  | "missing_execution_blocker"
  | "missing_required_checklist_item"
  | "harness_execution_claim_detected"
  | "real_input_allowed_or_detected"
  | "raw_input_allowed_or_detected"
  | "real_redacted_input_allowed_or_detected"
  | "ocr_photo_file_input_allowed_or_detected"
  | "public_request_allowed_or_detected"
  | "branch_c_dependency_claim_detected"
  | "run_smart_talk_dependency_claim_detected"
  | "ocr_runtime_dependency_claim_detected"
  | "live_llm_call_claim_detected"
  | "ai_output_generation_claim_detected"
  | "model_output_storage_claim_detected"
  | "user_visible_output_claim_detected"
  | "persistence_claim_detected"
  | "public_runtime_claim_detected"
  | "real_operator_pilot_claim_detected"
  | "dry_execution_not_deferred"
  | "forbidden_secret_detected"
  | "forbidden_env_value_detected"
  | "forbidden_api_key_detected"
  | "forbidden_pii_detected"
  | "forbidden_raw_text_detected"
  | "forbidden_redacted_text_detected"
  | "forbidden_document_content_detected"
  | "forbidden_model_output_detected"
  | "unsafe_execution_plan_note_detected";

// ── Plan input ────────────────────────────────────────────────────────────────

/**
 * Input for the AI-Connected Synthetic Test Harness Execution Plan validation.
 *
 * `harnessExecutionPerformedNow: false` is the critical gate — this plan
 * defines future execution conditions, it does not act.
 *
 * `dryExecutionDeferredToNextPhase: true` enforces that any actual dry run
 * requires a separate future phase contract.
 *
 * `syntheticInputOnly: true` is the positive scope assertion. All real/raw/OCR
 * input allowed flags are literal `false`. All three existing runtime
 * dependency flags are literal `false`.
 *
 * `executionMode: "planned_only"` is the only safe value for this phase;
 * `"dry_execution_allowed_next_phase"` is a permitted value only when the
 * next phase has been reached and validated.
 */
export interface AiConnectedSyntheticHarnessExecutionPlanInput {
  readonly planId: string;
  readonly epochId: "8.3H";
  readonly previousPhaseId: "8.3G";

  readonly syntheticHarnessContractReady: boolean;

  readonly executionMode: SyntheticHarnessExecutionMode;
  readonly syntheticCaseCatalog: readonly SyntheticHarnessCaseId[];
  readonly riskClasses: readonly SyntheticHarnessCaseRiskClass[];
  readonly adapterInterfacePolicies: readonly SyntheticHarnessAdapterInterfacePolicy[];
  readonly governanceSteps: readonly SyntheticHarnessGovernanceStep[];
  readonly metadataOnlyObservations: readonly SyntheticHarnessMetadataOnlyObservation[];
  readonly executionBlockers: readonly SyntheticHarnessExecutionBlocker[];
  readonly checklistConfirmed: readonly SyntheticHarnessExecutionChecklistItem[];

  readonly harnessExecutionPerformedNow: false;
  readonly dryExecutionDeferredToNextPhase: true;

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

  readonly liveLLMCallPerformed: false;
  readonly aiOutputGenerationPerformed: false;
  readonly aiOutputGenerated: false;
  readonly modelOutputStored: false;
  readonly userVisibleOutputEmitted: false;
  readonly userVisibleOutputAuthorizedByPlan: false;

  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;

  readonly operatorExecutionPlanAcknowledgment: string;
  readonly reviewerExecutionPlanAcknowledgment: string;
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

// ── Plan result ───────────────────────────────────────────────────────────────

/**
 * Result of validating an `AiConnectedSyntheticHarnessExecutionPlanInput`.
 *
 * `readyForAiConnectedSyntheticHarnessDryExecution` is `true` only when
 * `accepted === true`. Even then, no harness executes, no LLM is called.
 *
 * `safeExecutionPlanMetadata` stores only counts and the execution mode label
 * — no user content, env values, secrets, API keys, or model output.
 *
 * `dryExecutionDeferredToNextPhase: true` is a literal invariant on the result
 * as well, confirming the plan does not self-execute.
 */
export interface AiConnectedSyntheticHarnessExecutionPlanResult {
  readonly planId: string;
  readonly epochId: "8.3H";
  readonly status: AiConnectedSyntheticHarnessExecutionPlanStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly AiConnectedSyntheticHarnessExecutionPlanRejectionReason[];

  readonly safeExecutionPlanMetadata: {
    readonly syntheticCaseCount: number;
    readonly riskClassCount: number;
    readonly adapterPolicyCount: number;
    readonly governanceStepCount: number;
    readonly metadataObservationCount: number;
    readonly executionBlockerCount: number;
    readonly checklistPassedCount: number;
    readonly executionMode: SyntheticHarnessExecutionMode;
  };

  readonly readyForAiConnectedSyntheticHarnessDryExecution: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly harnessExecutionPerformedNow: false;
  readonly dryExecutionDeferredToNextPhase: true;

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

  readonly liveLLMCalled: false;
  readonly aiOutputGenerationPerformed: false;
  readonly aiOutputGenerated: false;
  readonly modelOutputStored: false;
  readonly userVisibleOutputEmitted: false;
  readonly userVisibleOutputAuthorizedByPlan: false;

  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;

  readonly httpCallMade: false;
  readonly apiRouteCalled: false;
  readonly apiRouteModifiedByExecutionPlan: false;
  readonly existingRuntimeModifiedByExecutionPlan: false;
  readonly uiTouched: false;
  readonly databaseOrStorageModifiedByExecutionPlan: false;
  readonly neverUserVisible: true;
}

// ── Check result ──────────────────────────────────────────────────────────────

/**
 * Result of `runAiConnectedSyntheticHarnessExecutionPlanCheck()` (Phase 8.3H).
 *
 * `allPassed` is true when all three sub-checks pass:
 * 1. The 8.3G synthetic harness contract dependency is verified.
 * 2. The synthetic execution plan input is accepted.
 * 3. All tamper cases are rejected.
 *
 * `readyForAiConnectedSyntheticHarnessDryExecution` is the only positive gate.
 * `dryExecutionDeferredToNextPhase: true` is a literal invariant on the result.
 */
export interface AiConnectedSyntheticHarnessExecutionPlanCheckResult {
  readonly checkId: "8.3H";
  readonly allPassed: boolean;
  readonly syntheticHarnessContractReady: boolean;
  readonly syntheticHarnessExecutionPlanAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForAiConnectedSyntheticHarnessDryExecution: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly harnessExecutionPerformedNow: false;
  readonly dryExecutionDeferredToNextPhase: true;

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

/** All synthetic case IDs that must be present in a valid input. */
export const REQUIRED_SYNTHETIC_HARNESS_EXECUTION_CASES: readonly SyntheticHarnessCaseId[] =
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

/** All risk classes that must be present in a valid input. */
export const REQUIRED_SYNTHETIC_HARNESS_RISK_CLASSES: readonly SyntheticHarnessCaseRiskClass[] =
  ["low_risk", "medium_risk", "high_risk", "trap_case"] as const;

/** All adapter interface policies that must be present in a valid input. */
export const REQUIRED_SYNTHETIC_HARNESS_ADAPTER_INTERFACE_POLICIES: readonly SyntheticHarnessAdapterInterfacePolicy[] =
  [
    "dedicated_synthetic_adapter_interface_required",
    "adapter_accepts_synthetic_case_id_only",
    "adapter_accepts_synthetic_payload_marker_only",
    "adapter_must_not_accept_real_text",
    "adapter_must_not_accept_raw_text",
    "adapter_must_not_accept_redacted_real_text",
    "adapter_must_not_call_branch_c",
    "adapter_must_not_call_run_smart_talk",
    "adapter_must_not_call_ocr_runtime",
    "adapter_dry_execution_requires_next_phase",
  ] as const;

/** All governance steps that must be present in a valid input. */
export const REQUIRED_SYNTHETIC_HARNESS_GOVERNANCE_STEPS: readonly SyntheticHarnessGovernanceStep[] =
  [
    "live_llm_boundary_check",
    "redacted_input_forwarding_policy_check",
    "ai_output_governance_recheck_policy_check",
    "manual_review_policy_check",
    "user_visible_authorization_policy_check",
    "hallucination_trap_expectation_check",
    "deadline_claim_expectation_check",
    "uncertainty_preservation_expectation_check",
    "user_visible_output_block_check",
    "persistence_block_check",
    "public_runtime_block_check",
  ] as const;

/** All metadata-only observations that must be present in a valid input. */
export const REQUIRED_SYNTHETIC_HARNESS_METADATA_ONLY_OBSERVATIONS: readonly SyntheticHarnessMetadataOnlyObservation[] =
  [
    "case_id",
    "risk_class",
    "expected_block_or_allow_path",
    "expected_governance_steps",
    "expected_trap_labels",
    "expected_deadline_handling",
    "expected_uncertainty_handling",
    "expected_user_visible_block_status",
    "expected_persistence_block_status",
    "expected_runtime_block_status",
  ] as const;

/** All execution blockers that must be present in a valid input. */
export const REQUIRED_SYNTHETIC_HARNESS_EXECUTION_BLOCKERS: readonly SyntheticHarnessExecutionBlocker[] =
  [
    "real_input_detected",
    "raw_input_detected",
    "real_redacted_input_detected",
    "ocr_or_photo_input_detected",
    "file_input_detected",
    "public_request_detected",
    "branch_c_dependency_detected",
    "run_smart_talk_dependency_detected",
    "ocr_runtime_dependency_detected",
    "live_llm_call_detected",
    "ai_output_generation_detected",
    "model_output_storage_detected",
    "user_visible_output_detected",
    "persistence_detected",
    "public_runtime_detected",
    "missing_synthetic_case_catalog",
    "missing_adapter_interface_policy",
    "missing_governance_step_plan",
    "missing_metadata_only_observation_plan",
  ] as const;

/** All checklist items that must be confirmed in a valid input. */
export const REQUIRED_SYNTHETIC_HARNESS_EXECUTION_CHECKLIST: readonly SyntheticHarnessExecutionChecklistItem[] =
  [
    "execution_mode_reviewed",
    "synthetic_case_catalog_reviewed",
    "risk_classes_reviewed",
    "adapter_interface_policy_reviewed",
    "governance_step_plan_reviewed",
    "metadata_only_observation_plan_reviewed",
    "blockers_reviewed",
    "no_real_input_confirmed",
    "no_raw_input_confirmed",
    "no_real_redacted_input_confirmed",
    "no_ocr_photo_file_input_confirmed",
    "no_branch_c_dependency_confirmed",
    "no_run_smart_talk_dependency_confirmed",
    "no_ocr_runtime_dependency_confirmed",
    "no_live_llm_call_confirmed",
    "no_ai_output_generation_confirmed",
    "no_model_output_storage_confirmed",
    "no_user_visible_output_confirmed",
    "no_persistence_confirmed",
    "no_public_runtime_confirmed",
    "dry_execution_requires_next_phase_confirmed",
  ] as const;

/**
 * Required statements that must appear in both operator and reviewer
 * execution plan acknowledgments.
 */
export const REQUIRED_SYNTHETIC_HARNESS_EXECUTION_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that this phase defines a plan only and does not execute the harness.",
    "I acknowledge that dry execution is deferred to the next phase.",
    "I acknowledge that only synthetic case identifiers and synthetic markers are allowed.",
    "I acknowledge that real input, OCR, files, public requests, Branch C, run-smart-talk.ts, and persistence remain blocked.",
    "I acknowledge that live LLM runtime remains blocked by this plan.",
  ] as const;

/**
 * Strings that must never appear in any execution plan field or notes.
 */
export const FORBIDDEN_SYNTHETIC_HARNESS_EXECUTION_PLAN_STRINGS: readonly string[] =
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
    "harness executed",
    "live llm executed",
    "real operator pilot executed",
  ] as const;
