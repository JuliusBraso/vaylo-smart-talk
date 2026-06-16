/**
 * Synthetic Harness Post-Run Audit Types (Phase 8.3J).
 *
 * Defines the typed post-run audit layer that inspects the Phase 8.3I
 * deterministic synthetic dry execution result using metadata only.
 *
 * The audit reviews:
 * - pass/fail counts, case count, expected path count, observation and
 *   invariant counts, readiness flags, and runtime-safety flags from 8.3I.
 *
 * The audit does NOT:
 * - execute the harness again
 * - call a live LLM
 * - process real user input, OCR, photo, file, or public requests
 * - produce or store model output
 * - emit user-visible output
 * - persist any records
 * - authorize live LLM runtime or public runtime
 *
 * Builds on Phase 8.3I (AI-Connected Synthetic Harness Dry Execution).
 *
 * Key governance invariants:
 *   - `postRunAuditPerformed: true` — this phase DOES perform the audit
 *   - `auditMetadataOnly: true` — only safe metadata is reviewed
 *   - `auditExecutedHarnessAgain: false` — literal; no re-execution
 *   - `dryExecutionPerformed: true` — carried from 8.3I confirmation
 *   - `deterministicSyntheticAdapterUsed: true` — carried from 8.3I
 *   - `metadataOnlyResults: true` — carried from 8.3I
 *   - `liveLLMCallPerformed: false` — literal; live LLM is still blocked
 *   - All real/raw/OCR/file/public input channels: literal `false`
 *   - All existing runtime dependency flags: literal `false`
 *   - All persistence/public/user-visible flags: literal `false`
 *   - The only positive readiness gate: `readyForLiveLlmSyntheticAuthorizationPlanning`
 *     (set to `true` only when the audit passes cleanly)
 *
 * ISOLATION NOTE:
 *   Phase 8.3B isolated `app/api/smart-talk/route.ts` Branch C,
 *   `lib/vaylo/smart-talk/run-smart-talk.ts`, and
 *   `lib/vaylo/smart-talk/extract-text-from-image.ts` from the governance
 *   chain. All related flags remain literal `false` in every interface.
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
 * Safety invariants on SyntheticHarnessPostRunAuditInput (literal):
 * - postRunAuditPerformed: true
 * - auditMetadataOnly: true
 * - auditExecutedHarnessAgain: false
 * - dryExecutionPerformed: true
 * - deterministicSyntheticAdapterUsed: true
 * - metadataOnlyResults: true
 * - syntheticInputOnly: true
 * - expectedCaseCount: 8
 * - observedCaseCount: 8
 * - failedCaseCount: 0
 * - expectedPathCount: 8
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
 * - userVisibleOutputAuthorizedByPostRunAudit: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - publicRuntimeEnabled: false
 * - realOperatorPilotExecuted: false
 * - readyForLiveLLMRuntime: false
 * - readyForConnectedAiRuntimeExecution: false
 * - readyForRealOperatorPilotRun: false
 * - readyForPilotRunNow: false
 * - readyForPublicLaunch: false
 * - readyForPersistence: false
 * - all contains* flags: false
 * - neverUserVisible: true
 */

// ── Status ────────────────────────────────────────────────────────────────────

export type SyntheticHarnessPostRunAuditStatus = "passed" | "failed" | "rejected";

// ── Audit scopes ──────────────────────────────────────────────────────────────

export type SyntheticHarnessPostRunAuditScope =
  | "audit_metadata_only"
  | "audit_no_raw_input"
  | "audit_no_redacted_input"
  | "audit_no_model_output"
  | "audit_no_user_visible_output"
  | "audit_no_persistence"
  | "audit_no_public_runtime"
  | "audit_no_live_llm_runtime"
  | "audit_existing_runtime_isolation";

// ── Audit findings ────────────────────────────────────────────────────────────

export type SyntheticHarnessPostRunAuditFinding =
  | "dry_execution_passed"
  | "eight_cases_verified"
  | "expected_paths_verified"
  | "metadata_only_results_verified"
  | "deterministic_adapter_verified"
  | "all_case_results_passed"
  | "no_live_llm_call_verified"
  | "no_ai_output_generation_verified"
  | "no_model_output_storage_verified"
  | "no_real_input_verified"
  | "no_ocr_photo_file_input_verified"
  | "no_branch_c_dependency_verified"
  | "no_run_smart_talk_dependency_verified"
  | "no_ocr_runtime_dependency_verified"
  | "no_user_visible_output_verified"
  | "no_persistence_verified"
  | "no_public_runtime_verified"
  | "post_run_audit_clean";

// ── Audit failure categories ──────────────────────────────────────────────────

export type SyntheticHarnessPostRunAuditFailure =
  | "dry_execution_not_ready"
  | "dry_execution_not_performed"
  | "deterministic_adapter_not_used"
  | "metadata_only_results_missing"
  | "synthetic_input_only_missing"
  | "case_count_mismatch"
  | "failed_case_detected"
  | "missing_expected_path_metadata"
  | "missing_observation_metadata"
  | "missing_invariant_metadata"
  | "real_input_signal_detected"
  | "raw_input_signal_detected"
  | "redacted_input_signal_detected"
  | "ocr_photo_file_signal_detected"
  | "branch_c_signal_detected"
  | "run_smart_talk_signal_detected"
  | "ocr_runtime_signal_detected"
  | "live_llm_signal_detected"
  | "ai_output_signal_detected"
  | "model_output_storage_signal_detected"
  | "user_visible_output_signal_detected"
  | "persistence_signal_detected"
  | "public_runtime_signal_detected"
  | "real_operator_pilot_signal_detected"
  | "forbidden_content_signal_detected";

// ── Next phase options ────────────────────────────────────────────────────────

export type SyntheticHarnessPostRunAuditNextPhase =
  | "live_llm_synthetic_authorization_planning"
  | "additional_synthetic_case_expansion_planning"
  | "governance_contract_closure_planning";

// ── Checklist items ───────────────────────────────────────────────────────────

export type SyntheticHarnessPostRunAuditChecklistItem =
  | "dry_execution_result_reviewed"
  | "case_count_reviewed"
  | "expected_paths_reviewed"
  | "metadata_only_observations_reviewed"
  | "invariants_reviewed"
  | "deterministic_adapter_reviewed"
  | "failed_cases_reviewed"
  | "live_llm_absence_reviewed"
  | "real_input_absence_reviewed"
  | "ocr_photo_file_absence_reviewed"
  | "branch_c_absence_reviewed"
  | "run_smart_talk_absence_reviewed"
  | "ocr_runtime_absence_reviewed"
  | "ai_output_absence_reviewed"
  | "model_output_storage_absence_reviewed"
  | "user_visible_output_absence_reviewed"
  | "persistence_absence_reviewed"
  | "public_runtime_absence_reviewed"
  | "next_phase_scope_reviewed";

// ── Rejection reasons ─────────────────────────────────────────────────────────

export type SyntheticHarnessPostRunAuditRejectionReason =
  | "dry_execution_result_not_ready"
  | "missing_audit_scope"
  | "missing_audit_finding"
  | "missing_audit_failure_category"
  | "missing_next_phase_option"
  | "missing_checklist_item"
  | "audit_attempted_to_execute_harness"
  | "audit_attempted_live_llm_runtime"
  | "audit_attempted_connected_ai_runtime_execution"
  | "audit_attempted_real_input_processing"
  | "audit_attempted_raw_input_forwarding"
  | "audit_attempted_redacted_input_forwarding"
  | "audit_attempted_photo_ocr_file_processing"
  | "audit_attempted_branch_c_dependency"
  | "audit_attempted_run_smart_talk_dependency"
  | "audit_attempted_ocr_runtime_dependency"
  | "audit_attempted_ai_output_generation"
  | "audit_attempted_model_output_storage"
  | "audit_attempted_user_visible_output"
  | "audit_attempted_persistence"
  | "audit_attempted_public_runtime"
  | "audit_attempted_real_operator_pilot"
  | "unsafe_audit_note_detected"
  | "forbidden_secret_detected"
  | "forbidden_env_value_detected"
  | "forbidden_api_key_detected"
  | "forbidden_pii_detected"
  | "forbidden_raw_text_detected"
  | "forbidden_redacted_text_detected"
  | "forbidden_document_content_detected"
  | "forbidden_model_output_detected";

// ── Audit input ───────────────────────────────────────────────────────────────

/**
 * Input for the Synthetic Harness Post-Run Audit validation.
 *
 * `postRunAuditPerformed: true` marks that the audit layer executed.
 * `auditMetadataOnly: true` confirms that only safe metadata was reviewed.
 * `auditExecutedHarnessAgain: false` is a literal invariant that the harness
 * was NOT re-executed during the audit.
 *
 * `dryExecutionPerformed: true`, `deterministicSyntheticAdapterUsed: true`,
 * and `metadataOnlyResults: true` are carried forward from 8.3I to confirm
 * that the dry run being audited was safe.
 *
 * `expectedCaseCount: 8`, `observedCaseCount: 8`, `failedCaseCount: 0`,
 * and `expectedPathCount: 8` are literal invariants confirming the 8.3I
 * dry run produced the correct case set with no failures.
 *
 * `readyForLiveLlmSyntheticAuthorizationPlanning` is the only positive gate
 * produced by this audit, and only when the audit passes cleanly.
 */
export interface SyntheticHarnessPostRunAuditInput {
  readonly auditId: string;
  readonly epochId: "8.3J";
  readonly previousPhaseId: "8.3I";

  readonly dryExecutionReadyForPostRunAudit: boolean;

  readonly auditScopes: readonly SyntheticHarnessPostRunAuditScope[];
  readonly auditFindings: readonly SyntheticHarnessPostRunAuditFinding[];
  readonly auditFailureCategories: readonly SyntheticHarnessPostRunAuditFailure[];
  readonly nextPhaseOptions: readonly SyntheticHarnessPostRunAuditNextPhase[];
  readonly checklistConfirmed: readonly SyntheticHarnessPostRunAuditChecklistItem[];

  readonly expectedCaseCount: 8;
  readonly observedCaseCount: 8;
  readonly failedCaseCount: 0;
  readonly expectedPathCount: 8;
  readonly observationCountAtLeast: 11;
  readonly invariantCountAtLeast: 17;

  readonly dryExecutionPerformed: true;
  readonly deterministicSyntheticAdapterUsed: true;
  readonly metadataOnlyResults: true;
  readonly syntheticInputOnly: true;

  readonly postRunAuditPerformed: true;
  readonly auditMetadataOnly: true;
  readonly auditExecutedHarnessAgain: false;

  readonly readyForLiveLlmSyntheticAuthorizationPlanning: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

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
  readonly userVisibleOutputAuthorizedByPostRunAudit: false;

  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;

  readonly operatorPostRunAuditAcknowledgment: string;
  readonly reviewerPostRunAuditAcknowledgment: string;
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
 * Result of validating a `SyntheticHarnessPostRunAuditInput`.
 *
 * `readyForLiveLlmSyntheticAuthorizationPlanning` is `true` only when
 * `accepted` — this is the only new positive gate produced by Phase 8.3J.
 *
 * `status` is `"passed"` when accepted, `"failed"` when validation fails but
 * the dry execution result was ready, and `"rejected"` when a forbidden
 * runtime signal or missing prerequisite is detected.
 *
 * `safePostRunAuditMetadata` contains only counts and enum labels — no user
 * content, env values, secrets, or model output.
 */
export interface SyntheticHarnessPostRunAuditResult {
  readonly auditId: string;
  readonly epochId: "8.3J";
  readonly status: SyntheticHarnessPostRunAuditStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly SyntheticHarnessPostRunAuditRejectionReason[];

  readonly safePostRunAuditMetadata: {
    readonly auditScopeCount: number;
    readonly auditFindingCount: number;
    readonly auditFailureCategoryCount: number;
    readonly nextPhaseOptionCount: number;
    readonly checklistPassedCount: number;
    readonly expectedCaseCount: 8;
    readonly observedCaseCount: 8;
    readonly failedCaseCount: 0;
    readonly expectedPathCount: 8;
    readonly observationCountAtLeast: 11;
    readonly invariantCountAtLeast: 17;
  };

  readonly readyForLiveLlmSyntheticAuthorizationPlanning: boolean;

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

  readonly postRunAuditPerformed: true;
  readonly auditMetadataOnly: true;
  readonly auditExecutedHarnessAgain: false;

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
  readonly userVisibleOutputAuthorizedByPostRunAudit: false;

  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;

  readonly httpCallMade: false;
  readonly apiRouteCalled: false;
  readonly apiRouteModifiedByPostRunAudit: false;
  readonly existingRuntimeModifiedByPostRunAudit: false;
  readonly uiTouched: false;
  readonly databaseOrStorageModifiedByPostRunAudit: false;
  readonly neverUserVisible: true;
}

// ── Check result ──────────────────────────────────────────────────────────────

/**
 * Result of `runSyntheticHarnessPostRunAudit()` (Phase 8.3J).
 *
 * `allPassed` is true when all three sub-checks pass:
 * 1. The 8.3I dry execution dependency is verified.
 * 2. The post-run audit input is accepted.
 * 3. All tamper cases are rejected.
 *
 * `readyForLiveLlmSyntheticAuthorizationPlanning` is the only positive gate.
 * `postRunAuditPerformed: true` and `auditMetadataOnly: true` are literals.
 * `auditExecutedHarnessAgain: false` is a literal invariant on the check result.
 */
export interface SyntheticHarnessPostRunAuditCheckResult {
  readonly checkId: "8.3J";
  readonly allPassed: boolean;
  readonly dryExecutionReadyForPostRunAudit: boolean;
  readonly postRunAuditAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForLiveLlmSyntheticAuthorizationPlanning: boolean;

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

  readonly postRunAuditPerformed: true;
  readonly auditMetadataOnly: true;
  readonly auditExecutedHarnessAgain: false;

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

/** All audit scopes that must be present in a valid input. */
export const REQUIRED_SYNTHETIC_POST_RUN_AUDIT_SCOPES: readonly SyntheticHarnessPostRunAuditScope[] =
  [
    "audit_metadata_only",
    "audit_no_raw_input",
    "audit_no_redacted_input",
    "audit_no_model_output",
    "audit_no_user_visible_output",
    "audit_no_persistence",
    "audit_no_public_runtime",
    "audit_no_live_llm_runtime",
    "audit_existing_runtime_isolation",
  ] as const;

/** All findings that must be present in a valid input. */
export const REQUIRED_SYNTHETIC_POST_RUN_AUDIT_FINDINGS: readonly SyntheticHarnessPostRunAuditFinding[] =
  [
    "dry_execution_passed",
    "eight_cases_verified",
    "expected_paths_verified",
    "metadata_only_results_verified",
    "deterministic_adapter_verified",
    "all_case_results_passed",
    "no_live_llm_call_verified",
    "no_ai_output_generation_verified",
    "no_model_output_storage_verified",
    "no_real_input_verified",
    "no_ocr_photo_file_input_verified",
    "no_branch_c_dependency_verified",
    "no_run_smart_talk_dependency_verified",
    "no_ocr_runtime_dependency_verified",
    "no_user_visible_output_verified",
    "no_persistence_verified",
    "no_public_runtime_verified",
    "post_run_audit_clean",
  ] as const;

/** All failure categories that must be present in a valid input. */
export const REQUIRED_SYNTHETIC_POST_RUN_AUDIT_FAILURE_CATEGORIES: readonly SyntheticHarnessPostRunAuditFailure[] =
  [
    "dry_execution_not_ready",
    "dry_execution_not_performed",
    "deterministic_adapter_not_used",
    "metadata_only_results_missing",
    "synthetic_input_only_missing",
    "case_count_mismatch",
    "failed_case_detected",
    "missing_expected_path_metadata",
    "missing_observation_metadata",
    "missing_invariant_metadata",
    "real_input_signal_detected",
    "raw_input_signal_detected",
    "redacted_input_signal_detected",
    "ocr_photo_file_signal_detected",
    "branch_c_signal_detected",
    "run_smart_talk_signal_detected",
    "ocr_runtime_signal_detected",
    "live_llm_signal_detected",
    "ai_output_signal_detected",
    "model_output_storage_signal_detected",
    "user_visible_output_signal_detected",
    "persistence_signal_detected",
    "public_runtime_signal_detected",
    "real_operator_pilot_signal_detected",
    "forbidden_content_signal_detected",
  ] as const;

/** All next-phase options that must be present in a valid input. */
export const REQUIRED_SYNTHETIC_POST_RUN_AUDIT_NEXT_PHASE_OPTIONS: readonly SyntheticHarnessPostRunAuditNextPhase[] =
  [
    "live_llm_synthetic_authorization_planning",
    "additional_synthetic_case_expansion_planning",
    "governance_contract_closure_planning",
  ] as const;

/** All checklist items that must be present in a valid input. */
export const REQUIRED_SYNTHETIC_POST_RUN_AUDIT_CHECKLIST: readonly SyntheticHarnessPostRunAuditChecklistItem[] =
  [
    "dry_execution_result_reviewed",
    "case_count_reviewed",
    "expected_paths_reviewed",
    "metadata_only_observations_reviewed",
    "invariants_reviewed",
    "deterministic_adapter_reviewed",
    "failed_cases_reviewed",
    "live_llm_absence_reviewed",
    "real_input_absence_reviewed",
    "ocr_photo_file_absence_reviewed",
    "branch_c_absence_reviewed",
    "run_smart_talk_absence_reviewed",
    "ocr_runtime_absence_reviewed",
    "ai_output_absence_reviewed",
    "model_output_storage_absence_reviewed",
    "user_visible_output_absence_reviewed",
    "persistence_absence_reviewed",
    "public_runtime_absence_reviewed",
    "next_phase_scope_reviewed",
  ] as const;

/**
 * Required statements that must appear in both operator and reviewer
 * post-run audit acknowledgments.
 */
export const REQUIRED_SYNTHETIC_POST_RUN_AUDIT_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that this post-run audit reviews metadata only.",
    "I acknowledge that this post-run audit does not execute the harness again.",
    "I acknowledge that this post-run audit does not call a live LLM.",
    "I acknowledge that this post-run audit does not process real input, OCR, files, or public requests.",
    "I acknowledge that live LLM synthetic authorization requires a separate planning phase.",
  ] as const;

/**
 * Strings that must never appear in any audit field or notes.
 */
export const FORBIDDEN_SYNTHETIC_POST_RUN_AUDIT_STRINGS: readonly string[] = [
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
] as const;
