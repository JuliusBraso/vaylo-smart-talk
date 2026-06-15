/**
 * Post-Run Audit Planning Contract Types (Phase 8.2M-6).
 *
 * Defines the typed post-run audit planning contract that specifies the audit
 * scope, verdict model, linkage requirements, signoff requirements, and
 * metadata-only audit rule for any future real operator pilot run.
 *
 * This module does NOT:
 * - read process.env
 * - execute a post-run audit
 * - persist audit records or evidence records
 * - store actual user content
 * - implement database or storage behavior
 * - modify DB/storage schema
 * - process actual user input or forward raw input
 * - authorize a real pilot run
 * - call any live LLM
 * - make HTTP requests
 * - modify API routes or UI
 *
 * This contract only defines the post-run audit planning policy that must
 * exist before future real operator pilot authorization. It is not audit
 * execution, not evidence persistence, not database implementation, and not
 * real pilot execution.
 *
 * Safety invariants on PostRunAuditPlanningContractInput (all literal):
 * - auditRecordMetadataOnly: true
 * - auditRecordUserContentAllowed: false
 * - auditRecordRawTextAllowed: false
 * - auditRecordRedactedTextAllowed: false
 * - auditRecordModelOutputAllowed: false
 * - auditRecordDocumentContentAllowed: false
 * - auditRecordPiiAllowed: false
 * - auditRecordSecretOrEnvAllowed: false
 * - auditExecutionPerformed: false
 * - auditPersistencePerformed: false
 * - evidencePersistencePerformed: false
 * - realInputProcessedByContract: false
 * - persistenceRequiresSeparateAuthorization: true
 * - postRunAuditRequiredBeforeCompletion: true
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
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - publicRuntimeEnabled: false
 * - liveLLMCalled: false
 * - emittedToUserNow: false
 * - userVisibleOutputAllowed: false
 * - neverUserVisible: true
 *
 * Safety invariants on PostRunAuditPlanningContractResult (all literal):
 * - readyForRealOperatorPilotRun: false
 * - readyForPilotRunNow: false
 * - readyForPublicLaunch: false
 * - readyForLiveLLMRuntime: false
 * - readyForPersistence: false
 * - realPilotRunExecuted: false
 * - realUserInputProcessed: false
 * - auditExecutionPerformed: false
 * - auditPersistencePerformed: false
 * - evidencePersistencePerformed: false
 * - userContentAuditStored: false
 * - rawTextStored: false
 * - redactedTextStored: false
 * - fullDraftTextStored: false
 * - modelOutputStored: false
 * - documentContentStored: false
 * - envValueStored: false
 * - secretStored: false
 * - apiKeyStored: false
 * - userPiiStored: false
 * - httpCallMade: false
 * - apiRouteCalled: false
 * - liveLLMCalled: false
 * - apiRouteModifiedByPostRunAuditPlanning: false
 * - auditRuntimeModifiedByPlanning: false
 * - databaseOrStorageModifiedByPlanning: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - emittedToUserNow: false
 * - neverUserVisible: true
 */

// ── Status ──────────────────────────────────────────────────────────────────

export type PostRunAuditPlanningContractStatus = "valid" | "rejected";

// ── Audit scope items ───────────────────────────────────────────────────────

export type PostRunAuditScopeItem =
  | "verify_operator_identity_attestation"
  | "verify_reviewer_identity_attestation"
  | "verify_environment_attestation"
  | "verify_abort_protocol_availability"
  | "verify_real_input_policy_clearance"
  | "verify_evidence_policy_compliance"
  | "verify_no_raw_input_forwarding"
  | "verify_no_user_content_evidence"
  | "verify_no_public_output"
  | "verify_no_persistence_without_authorization"
  | "verify_no_dna_save"
  | "verify_no_offline_save"
  | "verify_no_live_llm_without_authorization"
  | "verify_manual_review_completion"
  | "verify_abort_if_triggered"
  | "verify_blockers_and_open_items"
  | "verify_safety_invariant_snapshot"
  | "verify_incident_notes_without_content";

// ── Audit verdict model ─────────────────────────────────────────────────────

export type PostRunAuditVerdictModel =
  | "pass_with_warnings"
  | "blocked"
  | "invalid_run"
  | "requires_manual_followup";

// ── Audit linkage requirements ──────────────────────────────────────────────

export type PostRunAuditLinkageRequirement =
  | "link_to_pilot_session_id"
  | "link_to_operator_identity_contract"
  | "link_to_reviewer_identity_contract"
  | "link_to_environment_attestation"
  | "link_to_abort_protocol_contract"
  | "link_to_real_input_policy_contract"
  | "link_to_evidence_policy_contract"
  | "link_to_manual_review_result"
  | "link_to_safety_invariant_snapshot"
  | "link_to_blocker_codes_without_content"
  | "link_to_open_item_codes_without_content"
  | "link_to_incident_notes_without_content";

// ── Audit checklist items ───────────────────────────────────────────────────

export type PostRunAuditChecklistItem =
  | "audit_scope_reviewed"
  | "audit_verdict_model_reviewed"
  | "audit_linkage_requirements_reviewed"
  | "manual_review_result_required"
  | "blocker_coverage_required"
  | "open_item_coverage_required"
  | "safety_invariant_snapshot_required"
  | "incident_notes_must_not_include_user_content"
  | "audit_record_must_be_metadata_only"
  | "audit_record_must_not_include_raw_text"
  | "audit_record_must_not_include_redacted_text"
  | "audit_record_must_not_include_model_output"
  | "audit_record_must_not_include_pii"
  | "audit_record_must_not_include_document_content"
  | "persistence_requires_separate_authorization"
  | "post_run_audit_required_before_future_completion"
  | "no_post_run_audit_execution_performed"
  | "no_real_input_processed_by_this_contract"
  | "no_user_visible_output_allowed";

// ── Signoff requirements ────────────────────────────────────────────────────

export type PostRunAuditSignoffRequirement =
  | "operator_signoff_required"
  | "reviewer_signoff_required"
  | "manual_review_signoff_required"
  | "abort_status_signoff_required"
  | "evidence_policy_signoff_required"
  | "final_audit_verdict_signoff_required";

// ── Clearance level ─────────────────────────────────────────────────────────

export type PostRunAuditPlanningClearanceLevel =
  | "policy_defined_only"
  | "audit_schema_ready_for_future_operator_review";

// ── Rejection reasons ───────────────────────────────────────────────────────

export type PostRunAuditPlanningRejectionReason =
  | "evidence_policy_not_ready"
  | "missing_pilot_session_id"
  | "missing_operator_identity_reference"
  | "missing_reviewer_identity_reference"
  | "missing_audit_scope_item"
  | "missing_verdict_model"
  | "missing_linkage_requirement"
  | "missing_required_checklist_item"
  | "missing_signoff_requirement"
  | "invalid_clearance_level"
  | "audit_execution_claim_detected"
  | "audit_persistence_claim_detected"
  | "user_content_audit_claim_detected"
  | "raw_text_audit_claim_detected"
  | "redacted_text_audit_claim_detected"
  | "model_output_audit_claim_detected"
  | "document_content_audit_claim_detected"
  | "pii_audit_claim_detected"
  | "secret_or_env_audit_claim_detected"
  | "evidence_persistence_claim_detected"
  | "real_input_processed_claim_detected"
  | "persistence_claim_detected"
  | "dna_save_claim_detected"
  | "offline_save_claim_detected"
  | "live_llm_claim_detected"
  | "public_runtime_claim_detected"
  | "user_visible_output_claim_detected"
  | "forbidden_secret_detected"
  | "forbidden_env_value_detected"
  | "forbidden_api_key_detected"
  | "forbidden_pii_detected"
  | "forbidden_raw_text_detected"
  | "forbidden_redacted_text_detected"
  | "forbidden_document_content_detected"
  | "forbidden_model_output_detected"
  | "unsafe_audit_note_detected";

// ── Contract input ──────────────────────────────────────────────────────────

/**
 * Input for the post-run audit planning contract.
 *
 * Carries only planning metadata: pilot session ID, operator/reviewer human
 * IDs, audit scope items, verdict models, linkage requirements, checklist
 * confirmations, signoff requirements, clearance level, and acknowledgment
 * statements.
 *
 * All audit-content, evidence-content, env-value, secret, and runtime-safety
 * flags are literal `false` (or `true` for mandatory safety gates). No audit
 * is executed. No audit record is persisted. No DB/storage is modified.
 */
export interface PostRunAuditPlanningContractInput {
  readonly contractId: string;
  readonly pilotSessionId: string;

  readonly evidencePolicyReady: boolean;
  readonly operatorHumanId: string;
  readonly reviewerHumanId: string;

  readonly auditScopeItems: readonly PostRunAuditScopeItem[];
  readonly verdictModels: readonly PostRunAuditVerdictModel[];
  readonly linkageRequirements: readonly PostRunAuditLinkageRequirement[];
  readonly checklistConfirmed: readonly PostRunAuditChecklistItem[];
  readonly signoffRequirements: readonly PostRunAuditSignoffRequirement[];
  readonly clearanceLevel: PostRunAuditPlanningClearanceLevel;

  readonly auditRecordMetadataOnly: true;
  readonly auditRecordUserContentAllowed: false;
  readonly auditRecordRawTextAllowed: false;
  readonly auditRecordRedactedTextAllowed: false;
  readonly auditRecordModelOutputAllowed: false;
  readonly auditRecordDocumentContentAllowed: false;
  readonly auditRecordPiiAllowed: false;
  readonly auditRecordSecretOrEnvAllowed: false;

  readonly auditExecutionPerformed: false;
  readonly auditPersistencePerformed: false;
  readonly evidencePersistencePerformed: false;
  readonly realInputProcessedByContract: false;
  readonly persistenceRequiresSeparateAuthorization: true;
  readonly postRunAuditRequiredBeforeCompletion: true;

  readonly operatorAuditPlanningAcknowledgment: string;
  readonly reviewerAuditPlanningAcknowledgment: string;
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

  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly liveLLMCalled: false;
  readonly emittedToUserNow: false;
  readonly userVisibleOutputAllowed: false;

  readonly neverUserVisible: true;
}

// ── Contract result ─────────────────────────────────────────────────────────

/**
 * Result of validating a `PostRunAuditPlanningContractInput`.
 *
 * `safePostRunAuditPlanningMetadata` stores only safe, non-sensitive metadata.
 * No env values, secrets, API keys, PII, user content, or document content
 * are stored.
 *
 * `readyForRealOperatorPilotAuthorizationClosure` may be `true` only when
 * `accepted === true`. `readyForRealOperatorPilotRun` is always `false`.
 */
export interface PostRunAuditPlanningContractResult {
  readonly contractId: string;
  readonly status: PostRunAuditPlanningContractStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly PostRunAuditPlanningRejectionReason[];

  readonly safePostRunAuditPlanningMetadata: {
    readonly pilotSessionId: string;
    readonly operatorHumanId: string;
    readonly reviewerHumanId: string;
    readonly auditScopeItemCount: number;
    readonly verdictModelCount: number;
    readonly linkageRequirementCount: number;
    readonly checklistPassedCount: number;
    readonly signoffRequirementCount: number;
    readonly clearanceLevel: PostRunAuditPlanningClearanceLevel;
  };

  readonly readyForRealOperatorPilotAuthorizationClosure: boolean;

  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForLiveLLMRuntime: false;
  readonly readyForPersistence: false;

  readonly realPilotRunExecuted: false;
  readonly realUserInputProcessed: false;
  readonly auditExecutionPerformed: false;
  readonly auditPersistencePerformed: false;
  readonly evidencePersistencePerformed: false;
  readonly userContentAuditStored: false;
  readonly rawTextStored: false;
  readonly redactedTextStored: false;
  readonly fullDraftTextStored: false;
  readonly modelOutputStored: false;
  readonly documentContentStored: false;
  readonly envValueStored: false;
  readonly secretStored: false;
  readonly apiKeyStored: false;
  readonly userPiiStored: false;

  readonly httpCallMade: false;
  readonly apiRouteCalled: false;
  readonly liveLLMCalled: false;
  readonly apiRouteModifiedByPostRunAuditPlanning: false;
  readonly auditRuntimeModifiedByPlanning: false;
  readonly databaseOrStorageModifiedByPlanning: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;
}

// ── Check result ────────────────────────────────────────────────────────────

/**
 * Result of `runPostRunAuditPlanningContractCheck()` (Phase 8.2M-6).
 *
 * `allPassed` is true when all three sub-checks succeed:
 * 1. The 8.2M-5 evidence policy is ready.
 * 2. The synthetic post-run audit planning input is accepted.
 * 3. All tamper cases are rejected.
 *
 * All audit-execution, audit-persistence, content-storage, and runtime
 * literal flags are always `false`. No audit is executed. No DB/storage
 * is modified.
 */
export interface PostRunAuditPlanningContractCheckResult {
  readonly checkId: "8.2M-6";
  readonly allPassed: boolean;
  readonly evidencePolicyReady: boolean;
  readonly syntheticPostRunAuditPlanningAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForRealOperatorPilotAuthorizationClosure: boolean;

  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForLiveLLMRuntime: false;
  readonly readyForPersistence: false;

  readonly realPilotRunExecuted: false;
  readonly realUserInputProcessed: false;
  readonly auditExecutionPerformed: false;
  readonly auditPersistencePerformed: false;
  readonly evidencePersistencePerformed: false;
  readonly userContentAuditStored: false;
  readonly auditRuntimeModifiedByPlanning: false;
  readonly databaseOrStorageModifiedByPlanning: false;
  readonly liveLLMCalled: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;

  readonly notes: readonly string[];
}

// ── Exported constants ──────────────────────────────────────────────────────

/** All audit scope items that must be covered in a valid planning contract. */
export const REQUIRED_POST_RUN_AUDIT_SCOPE_ITEMS: readonly PostRunAuditScopeItem[] =
  [
    "verify_operator_identity_attestation",
    "verify_reviewer_identity_attestation",
    "verify_environment_attestation",
    "verify_abort_protocol_availability",
    "verify_real_input_policy_clearance",
    "verify_evidence_policy_compliance",
    "verify_no_raw_input_forwarding",
    "verify_no_user_content_evidence",
    "verify_no_public_output",
    "verify_no_persistence_without_authorization",
    "verify_no_dna_save",
    "verify_no_offline_save",
    "verify_no_live_llm_without_authorization",
    "verify_manual_review_completion",
    "verify_abort_if_triggered",
    "verify_blockers_and_open_items",
    "verify_safety_invariant_snapshot",
    "verify_incident_notes_without_content",
  ] as const;

/** All verdict models that must be acknowledged in a valid planning contract. */
export const REQUIRED_POST_RUN_AUDIT_VERDICT_MODELS: readonly PostRunAuditVerdictModel[] =
  [
    "pass_with_warnings",
    "blocked",
    "invalid_run",
    "requires_manual_followup",
  ] as const;

/** All linkage requirements that must be confirmed in a valid planning contract. */
export const REQUIRED_POST_RUN_AUDIT_LINKAGE_REQUIREMENTS: readonly PostRunAuditLinkageRequirement[] =
  [
    "link_to_pilot_session_id",
    "link_to_operator_identity_contract",
    "link_to_reviewer_identity_contract",
    "link_to_environment_attestation",
    "link_to_abort_protocol_contract",
    "link_to_real_input_policy_contract",
    "link_to_evidence_policy_contract",
    "link_to_manual_review_result",
    "link_to_safety_invariant_snapshot",
    "link_to_blocker_codes_without_content",
    "link_to_open_item_codes_without_content",
    "link_to_incident_notes_without_content",
  ] as const;

/** All checklist items that must be confirmed in a valid planning contract. */
export const REQUIRED_POST_RUN_AUDIT_CHECKLIST: readonly PostRunAuditChecklistItem[] =
  [
    "audit_scope_reviewed",
    "audit_verdict_model_reviewed",
    "audit_linkage_requirements_reviewed",
    "manual_review_result_required",
    "blocker_coverage_required",
    "open_item_coverage_required",
    "safety_invariant_snapshot_required",
    "incident_notes_must_not_include_user_content",
    "audit_record_must_be_metadata_only",
    "audit_record_must_not_include_raw_text",
    "audit_record_must_not_include_redacted_text",
    "audit_record_must_not_include_model_output",
    "audit_record_must_not_include_pii",
    "audit_record_must_not_include_document_content",
    "persistence_requires_separate_authorization",
    "post_run_audit_required_before_future_completion",
    "no_post_run_audit_execution_performed",
    "no_real_input_processed_by_this_contract",
    "no_user_visible_output_allowed",
  ] as const;

/** All signoff requirements that must be confirmed in a valid planning contract. */
export const REQUIRED_POST_RUN_AUDIT_SIGNOFF_REQUIREMENTS: readonly PostRunAuditSignoffRequirement[] =
  [
    "operator_signoff_required",
    "reviewer_signoff_required",
    "manual_review_signoff_required",
    "abort_status_signoff_required",
    "evidence_policy_signoff_required",
    "final_audit_verdict_signoff_required",
  ] as const;

/**
 * Required statements that must appear in both operator and reviewer
 * post-run audit planning acknowledgments.
 */
export const REQUIRED_POST_RUN_AUDIT_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that the future post-run audit record must be metadata-only.",
    "I acknowledge that actual user content must not enter the audit record.",
    "I acknowledge that post-run audit execution is not performed by this planning contract.",
    "I acknowledge that persistence requires separate authorization.",
    "I acknowledge that public launch, live LLM runtime, and persistence remain blocked.",
  ] as const;

/**
 * Strings that must never appear in any post-run audit planning field,
 * acknowledgment, or notes. Includes env assignments, secret markers,
 * raw/draft text markers, audit-content phrases, PII, document content
 * markers, sensitive personal markers, and high-risk legal markers.
 */
export const FORBIDDEN_POST_RUN_AUDIT_PLANNING_STRINGS: readonly string[] = [
  "sk-",
  "OPENAI_API_KEY=",
  "VAYLO_INTERNAL_RUNTIME_SECRET=",
  "process.env",
  "apiKey",
  "internalSecret",
  "SYNTHETIC_TEXT_NEVER_REAL_USER_DATA",
  "rawInputText",
  "redactedText",
  "fullDraftText",
  "modelOutput",
  "stored user input",
  "stored redacted text",
  "stored model output",
  "stored audit record",
  "stored document content",
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
] as const;

/** Audit-specific content phrases that must never appear in any field or notes. */
export const FORBIDDEN_AUDIT_CONTENT_PHRASES: readonly string[] = [
  "stored user input",
  "stored redacted text",
  "stored model output",
  "stored audit record",
  "stored document content",
  "stored PII",
  "stored secret",
] as const;
