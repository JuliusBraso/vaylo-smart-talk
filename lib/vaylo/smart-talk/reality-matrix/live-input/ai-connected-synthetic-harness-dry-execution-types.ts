/**
 * AI-Connected Synthetic Harness Dry Execution Types (Phase 8.3I).
 *
 * Defines the typed dry execution layer for the synthetic test harness.
 * The dry run uses a deterministic synthetic adapter, synthetic case IDs,
 * and produces metadata-only observations — no live LLM, no real input,
 * no model output, no persistence, no user-visible output.
 *
 * Builds on Phase 8.3H (AI-Connected Synthetic Test Harness Execution Plan).
 *
 * Key governance invariants:
 *   - `dryExecutionPerformed: true` — this phase DOES perform the dry run
 *   - `deterministicSyntheticAdapterUsed: true` — only mock adapter allowed
 *   - `metadataOnlyResults: true` — no real model output produced
 *   - `liveLLMCallPerformed: false` — live LLM is still blocked
 *   - `aiOutputGenerated: false`, `modelOutputStored: false` — literal
 *   - All real/raw/OCR/file/public input channels: literal `false`
 *   - All existing runtime dependency flags: literal `false`
 *   - All persistence/public/user-visible flags: literal `false`
 *   - The only positive readiness gate: `readyForSyntheticHarnessPostRunAudit`
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
 * - produce real AI output or store model output
 * - emit user-visible output
 * - authorize public runtime, live LLM runtime, persistence, or global output
 * - process real user input, OCR, photo, files, or public requests
 * - forward raw or real redacted input to a live model
 * - persist any records or store user content
 * - modify DB/storage schema or API routes
 * - import, call, or wrap run-smart-talk.ts or extract-text-from-image.ts
 * - modify UI
 *
 * Safety invariants on AiConnectedSyntheticHarnessDryExecutionInput (literal):
 * - dryExecutionPerformed: true
 * - deterministicSyntheticAdapterUsed: true
 * - metadataOnlyResults: true
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
 * - userVisibleOutputAuthorizedByDryExecution: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - publicRuntimeEnabled: false
 * - realOperatorPilotExecuted: false
 * - all contains* flags: false
 * - neverUserVisible: true
 *
 * Safety invariants on AiConnectedSyntheticHarnessDryExecutionResult (literal):
 * - readyForLiveLLMRuntime: false
 * - readyForConnectedAiRuntimeExecution: false
 * - readyForRealOperatorPilotRun: false
 * - readyForPilotRunNow: false
 * - readyForPublicLaunch: false
 * - readyForPersistence: false
 * - dryExecutionPerformed: true
 * - deterministicSyntheticAdapterUsed: true
 * - metadataOnlyResults: true
 * - syntheticInputOnly: true
 * - all real/raw/OCR/file/public input allowed: false
 * - all dependency/call flags: false
 * - liveLLMCalled: false
 * - aiOutputGenerationPerformed: false
 * - aiOutputGenerated: false
 * - modelOutputStored: false
 * - userVisibleOutputEmitted: false
 * - userVisibleOutputAuthorizedByDryExecution: false
 * - persistenceUsed: false, dnaSavePerformed: false, offlineSavePerformed: false
 * - publicRuntimeEnabled: false, realOperatorPilotExecuted: false
 * - httpCallMade: false, apiRouteCalled: false
 * - apiRouteModifiedByDryExecution: false
 * - existingRuntimeModifiedByDryExecution: false
 * - uiTouched: false
 * - databaseOrStorageModifiedByDryExecution: false
 * - neverUserVisible: true
 */

// ── Status ────────────────────────────────────────────────────────────────────

export type AiConnectedSyntheticHarnessDryExecutionStatus =
  | "passed"
  | "failed"
  | "rejected";

// ── Adapter and mode ──────────────────────────────────────────────────────────

export type SyntheticDryExecutionAdapterKind =
  "deterministic_synthetic_adapter";

export type SyntheticDryExecutionMode = "metadata_only_dry_run";

// ── Case results ──────────────────────────────────────────────────────────────

export type SyntheticDryExecutionCaseResult =
  | "passed_expected_safe_path"
  | "passed_expected_block_path"
  | "passed_expected_uncertainty_path"
  | "failed_unexpected_safe_path"
  | "failed_unexpected_block_path"
  | "failed_missing_expected_governance_step"
  | "rejected_due_to_forbidden_runtime_signal";

// ── Expected paths ────────────────────────────────────────────────────────────

export type SyntheticDryExecutionExpectedPath =
  | "safe_low_risk_explanation_path"
  | "explicit_deadline_caution_path"
  | "relative_deadline_uncertainty_path"
  | "high_risk_block_path"
  | "immigration_uncertainty_block_path"
  | "missing_context_block_path"
  | "legal_certainty_trap_block_path"
  | "unsafe_next_step_trap_block_path";

// ── Observations ──────────────────────────────────────────────────────────────

export type SyntheticDryExecutionObservation =
  | "case_id_observed"
  | "risk_class_observed"
  | "adapter_kind_observed"
  | "expected_path_observed"
  | "governance_steps_observed"
  | "trap_expectation_observed"
  | "deadline_handling_observed"
  | "uncertainty_handling_observed"
  | "user_visible_block_observed"
  | "persistence_block_observed"
  | "runtime_block_observed";

// ── Invariants ────────────────────────────────────────────────────────────────

export type SyntheticDryExecutionInvariant =
  | "execution_uses_synthetic_case_ids_only"
  | "execution_uses_deterministic_synthetic_adapter"
  | "execution_uses_metadata_only_results"
  | "no_real_input_processed"
  | "no_raw_input_forwarded"
  | "no_real_redacted_input_forwarded"
  | "no_photo_ocr_file_input_processed"
  | "no_branch_c_dependency"
  | "no_run_smart_talk_dependency"
  | "no_ocr_runtime_dependency"
  | "no_live_llm_call"
  | "no_real_ai_output_generation"
  | "no_model_output_storage"
  | "no_user_visible_output_emission"
  | "no_persistence"
  | "no_public_runtime"
  | "post_run_audit_required_next";

// ── Rejection reasons ─────────────────────────────────────────────────────────

export type SyntheticDryExecutionRejectionReason =
  | "execution_plan_not_ready"
  | "invalid_adapter_kind"
  | "invalid_execution_mode"
  | "missing_required_case_result"
  | "missing_expected_path"
  | "missing_observation"
  | "missing_invariant"
  | "real_input_detected"
  | "raw_input_detected"
  | "real_redacted_input_detected"
  | "photo_ocr_file_input_detected"
  | "branch_c_dependency_detected"
  | "run_smart_talk_dependency_detected"
  | "ocr_runtime_dependency_detected"
  | "live_llm_call_detected"
  | "ai_output_generation_detected"
  | "model_output_storage_detected"
  | "user_visible_output_detected"
  | "persistence_detected"
  | "public_runtime_detected"
  | "real_operator_pilot_detected"
  | "forbidden_secret_detected"
  | "forbidden_env_value_detected"
  | "forbidden_api_key_detected"
  | "forbidden_pii_detected"
  | "forbidden_raw_text_detected"
  | "forbidden_redacted_text_detected"
  | "forbidden_document_content_detected"
  | "forbidden_model_output_detected"
  | "unsafe_dry_execution_note_detected";

// ── Case metadata ─────────────────────────────────────────────────────────────

/**
 * Safe metadata record for one synthetic dry execution case.
 * Contains only identifiers and enum values — no raw text, no model output,
 * no user content, no secrets, no PII.
 */
export interface SyntheticDryExecutionCaseMetadata {
  readonly caseId: string;
  readonly expectedPath: SyntheticDryExecutionExpectedPath;
  readonly result: SyntheticDryExecutionCaseResult;
  readonly observations: readonly SyntheticDryExecutionObservation[];
}

// ── Dry execution input ───────────────────────────────────────────────────────

/**
 * Input for the AI-Connected Synthetic Harness Dry Execution validation.
 *
 * `dryExecutionPerformed: true` distinguishes this phase from all prior
 * planning phases — the dry run actually runs (using deterministic mock
 * adapter only), but produces only metadata.
 *
 * `deterministicSyntheticAdapterUsed: true` and `metadataOnlyResults: true`
 * are literal invariants that confirm the execution is safe.
 *
 * `liveLLMCallPerformed: false` is still a literal invariant — the dry run
 * does NOT touch any live LLM.
 *
 * `branchCDependencyAllowed: false`, `runSmartTalkDependencyAllowed: false`,
 * and `ocrRuntimeDependencyAllowed: false` maintain full isolation from all
 * existing live runtime paths.
 */
export interface AiConnectedSyntheticHarnessDryExecutionInput {
  readonly executionId: string;
  readonly epochId: "8.3I";
  readonly previousPhaseId: "8.3H";

  readonly executionPlanReady: boolean;

  readonly adapterKind: SyntheticDryExecutionAdapterKind;
  readonly executionMode: SyntheticDryExecutionMode;
  readonly caseMetadata: readonly SyntheticDryExecutionCaseMetadata[];
  readonly expectedPaths: readonly SyntheticDryExecutionExpectedPath[];
  readonly observations: readonly SyntheticDryExecutionObservation[];
  readonly invariants: readonly SyntheticDryExecutionInvariant[];

  readonly dryExecutionPerformed: true;
  readonly deterministicSyntheticAdapterUsed: true;
  readonly metadataOnlyResults: true;

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
  readonly userVisibleOutputAuthorizedByDryExecution: false;

  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;

  readonly operatorDryExecutionAcknowledgment: string;
  readonly reviewerDryExecutionAcknowledgment: string;
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

// ── Dry execution result ──────────────────────────────────────────────────────

/**
 * Result of validating an `AiConnectedSyntheticHarnessDryExecutionInput`.
 *
 * `readyForSyntheticHarnessPostRunAudit` is `true` only when `accepted`.
 *
 * `status` is `"passed"` when accepted and all cases passed,
 * `"failed"` when accepted but some cases failed (rare; included for
 * completeness), and `"rejected"` when validation fails.
 *
 * `safeDryExecutionMetadata` stores only counts and enum labels — no user
 * content, env values, secrets, or model output.
 *
 * `dryExecutionPerformed`, `deterministicSyntheticAdapterUsed`, and
 * `metadataOnlyResults` are literal `true` on the result as well, confirming
 * the dry run completed safely.
 */
export interface AiConnectedSyntheticHarnessDryExecutionResult {
  readonly executionId: string;
  readonly epochId: "8.3I";
  readonly status: AiConnectedSyntheticHarnessDryExecutionStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly SyntheticDryExecutionRejectionReason[];

  readonly safeDryExecutionMetadata: {
    readonly adapterKind: SyntheticDryExecutionAdapterKind;
    readonly executionMode: SyntheticDryExecutionMode;
    readonly caseCount: number;
    readonly expectedPathCount: number;
    readonly observationCount: number;
    readonly invariantCount: number;
    readonly passedCaseCount: number;
    readonly failedCaseCount: number;
  };

  readonly readyForSyntheticHarnessPostRunAudit: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly dryExecutionPerformed: true;
  readonly deterministicSyntheticAdapterUsed: true;
  readonly metadataOnlyResults: true;

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
  readonly userVisibleOutputAuthorizedByDryExecution: false;

  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;

  readonly httpCallMade: false;
  readonly apiRouteCalled: false;
  readonly apiRouteModifiedByDryExecution: false;
  readonly existingRuntimeModifiedByDryExecution: false;
  readonly uiTouched: false;
  readonly databaseOrStorageModifiedByDryExecution: false;
  readonly neverUserVisible: true;
}

// ── Check result ──────────────────────────────────────────────────────────────

/**
 * Result of `runAiConnectedSyntheticHarnessDryExecution()` (Phase 8.3I).
 *
 * `allPassed` is true when all three sub-checks pass:
 * 1. The 8.3H execution plan dependency is verified.
 * 2. The dry execution input is accepted.
 * 3. All tamper cases are rejected.
 *
 * `readyForSyntheticHarnessPostRunAudit` is the only positive gate.
 * `dryExecutionPerformed: true` and `deterministicSyntheticAdapterUsed: true`
 * are literal invariants on the check result.
 */
export interface AiConnectedSyntheticHarnessDryExecutionCheckResult {
  readonly checkId: "8.3I";
  readonly allPassed: boolean;
  readonly executionPlanReady: boolean;
  readonly dryExecutionAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForSyntheticHarnessPostRunAudit: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly dryExecutionPerformed: true;
  readonly deterministicSyntheticAdapterUsed: true;
  readonly metadataOnlyResults: true;

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

/** All expected paths that must be present in a valid input. */
export const REQUIRED_SYNTHETIC_DRY_EXECUTION_EXPECTED_PATHS: readonly SyntheticDryExecutionExpectedPath[] =
  [
    "safe_low_risk_explanation_path",
    "explicit_deadline_caution_path",
    "relative_deadline_uncertainty_path",
    "high_risk_block_path",
    "immigration_uncertainty_block_path",
    "missing_context_block_path",
    "legal_certainty_trap_block_path",
    "unsafe_next_step_trap_block_path",
  ] as const;

/** All observation types that must be present in a valid input and each case. */
export const REQUIRED_SYNTHETIC_DRY_EXECUTION_OBSERVATIONS: readonly SyntheticDryExecutionObservation[] =
  [
    "case_id_observed",
    "risk_class_observed",
    "adapter_kind_observed",
    "expected_path_observed",
    "governance_steps_observed",
    "trap_expectation_observed",
    "deadline_handling_observed",
    "uncertainty_handling_observed",
    "user_visible_block_observed",
    "persistence_block_observed",
    "runtime_block_observed",
  ] as const;

/** All invariants that must be present in a valid input. */
export const REQUIRED_SYNTHETIC_DRY_EXECUTION_INVARIANTS: readonly SyntheticDryExecutionInvariant[] =
  [
    "execution_uses_synthetic_case_ids_only",
    "execution_uses_deterministic_synthetic_adapter",
    "execution_uses_metadata_only_results",
    "no_real_input_processed",
    "no_raw_input_forwarded",
    "no_real_redacted_input_forwarded",
    "no_photo_ocr_file_input_processed",
    "no_branch_c_dependency",
    "no_run_smart_talk_dependency",
    "no_ocr_runtime_dependency",
    "no_live_llm_call",
    "no_real_ai_output_generation",
    "no_model_output_storage",
    "no_user_visible_output_emission",
    "no_persistence",
    "no_public_runtime",
    "post_run_audit_required_next",
  ] as const;

/** The 8 required synthetic case IDs from Phase 8.3H. */
export const REQUIRED_SYNTHETIC_DRY_EXECUTION_CASE_IDS: readonly string[] = [
  "synthetic_safe_low_risk_payment_notice",
  "synthetic_deadline_explicit_date",
  "synthetic_deadline_relative_missing_delivery_date",
  "synthetic_high_risk_widerspruch_deadline",
  "synthetic_high_risk_immigration_uncertainty",
  "synthetic_missing_context_partial_document",
  "synthetic_unsupported_legal_certainty_trap",
  "synthetic_unsafe_next_step_trap",
] as const;

/**
 * Required statements that must appear in both operator and reviewer
 * dry execution acknowledgments.
 */
export const REQUIRED_SYNTHETIC_DRY_EXECUTION_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that this dry execution uses a deterministic synthetic adapter only.",
    "I acknowledge that this dry execution does not call a live LLM.",
    "I acknowledge that this dry execution does not process real user input, OCR, files, or public requests.",
    "I acknowledge that this dry execution records metadata-only results.",
    "I acknowledge that post-run audit is required next.",
  ] as const;

/**
 * Strings that must never appear in any dry execution field or notes.
 */
export const FORBIDDEN_SYNTHETIC_DRY_EXECUTION_STRINGS: readonly string[] = [
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
] as const;
