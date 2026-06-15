/**
 * Evidence Policy Contract Types (Phase 8.2M-5).
 *
 * Defines the typed evidence policy contract that specifies what evidence
 * metadata categories may be collected, what content must remain blocked,
 * what retention constraints apply, and what audit trail requirements must
 * exist before any real operator pilot run can be considered complete.
 *
 * This module does NOT:
 * - read process.env
 * - persist evidence records
 * - store actual user content
 * - implement database or storage behavior
 * - modify DB/storage schema
 * - process actual user input
 * - forward raw user input
 * - authorize a real pilot run
 * - call any live LLM
 * - make HTTP requests
 * - modify API routes or UI
 *
 * This contract only defines the metadata-only evidence policy that must exist
 * before future real operator pilot authorization. It is not evidence
 * persistence, not a database implementation, not telemetry implementation,
 * and not real pilot execution.
 *
 * Safety invariants on EvidencePolicyContractInput (all literal):
 * - metadataOnlyEvidence: true
 * - userContentEvidenceAllowed: false
 * - rawTextEvidenceAllowed: false
 * - redactedTextEvidenceAllowed: false
 * - modelOutputEvidenceAllowed: false
 * - documentImageOrOcrEvidenceAllowed: false
 * - piiEvidenceAllowed: false
 * - secretOrEnvEvidenceAllowed: false
 * - publicLogExposureAllowed: false
 * - persistenceRequiresSeparateAuthorization: true
 * - postRunAuditRequired: true
 * - evidencePersistencePerformed: false
 * - realInputProcessedByContract: false
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
 * Safety invariants on EvidencePolicyContractResult (all literal):
 * - readyForRealOperatorPilotRun: false
 * - readyForPilotRunNow: false
 * - readyForPublicLaunch: false
 * - readyForLiveLLMRuntime: false
 * - readyForPersistence: false
 * - realPilotRunExecuted: false
 * - realUserInputProcessed: false
 * - evidencePersistencePerformed: false
 * - userContentEvidenceStored: false
 * - rawTextStored: false
 * - redactedTextStored: false
 * - fullDraftTextStored: false
 * - modelOutputStored: false
 * - documentImageStored: false
 * - ocrOutputStored: false
 * - envValueStored: false
 * - secretStored: false
 * - apiKeyStored: false
 * - userPiiStored: false
 * - documentContentStored: false
 * - httpCallMade: false
 * - apiRouteCalled: false
 * - liveLLMCalled: false
 * - apiRouteModifiedByEvidencePolicy: false
 * - evidencePersistenceRuntimeModifiedByPolicy: false
 * - databaseOrStorageModifiedByPolicy: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - emittedToUserNow: false
 * - neverUserVisible: true
 */

// ── Status ──────────────────────────────────────────────────────────────────

export type EvidencePolicyContractStatus = "valid" | "rejected";

// ── Allowed evidence metadata categories ────────────────────────────────────

export type AllowedEvidenceMetadataCategory =
  | "pilot_session_id"
  | "operator_human_id"
  | "reviewer_human_id"
  | "scenario_id"
  | "run_timestamp"
  | "phase_id"
  | "contract_check_status"
  | "guard_result_status"
  | "manual_review_verdict"
  | "abort_protocol_status"
  | "input_policy_clearance_level"
  | "evidence_policy_status"
  | "post_run_audit_status"
  | "safety_invariant_snapshot"
  | "blocker_code"
  | "open_item_code";

// ── Blocked evidence content categories ────────────────────────────────────

export type BlockedEvidenceContentCategory =
  | "raw_user_input_text"
  | "redacted_user_input_text"
  | "full_document_text"
  | "document_image"
  | "ocr_output_text"
  | "model_raw_output"
  | "full_draft_response"
  | "user_name"
  | "user_address"
  | "user_email"
  | "user_phone"
  | "iban"
  | "steuer_id"
  | "aktenzeichen"
  | "bg_nr"
  | "insurance_number"
  | "child_personal_data"
  | "medical_data"
  | "immigration_sensitive_story"
  | "secrets_or_api_keys"
  | "env_values";

// ── Retention constraints ───────────────────────────────────────────────────

export type EvidenceRetentionConstraint =
  | "metadata_only_evidence"
  | "no_user_content_storage"
  | "no_raw_text_storage"
  | "no_redacted_text_storage"
  | "no_model_output_storage"
  | "no_secret_storage"
  | "no_env_value_storage"
  | "no_pii_storage"
  | "no_document_image_storage"
  | "no_ocr_output_storage"
  | "no_dna_save"
  | "no_offline_save"
  | "no_public_log_exposure"
  | "manual_reviewer_access_only"
  | "post_run_audit_required"
  | "deletion_policy_required_before_persistence"
  | "persistence_requires_separate_authorization";

// ── Audit trail requirements ────────────────────────────────────────────────

export type EvidenceAuditTrailRequirement =
  | "record_phase_ids"
  | "record_contract_statuses"
  | "record_safe_metadata_only"
  | "record_blockers_without_content"
  | "record_open_items_without_content"
  | "record_manual_review_verdict_without_content"
  | "record_abort_status_without_content"
  | "record_safety_invariant_snapshot_without_content"
  | "record_operator_reviewer_ids_without_pii_expansion"
  | "require_post_run_audit_linkage"
  | "require_no_user_content_evidence_assertion"
  | "require_no_secret_or_env_value_assertion";

// ── Checklist items ─────────────────────────────────────────────────────────

export type EvidencePolicyChecklistItem =
  | "allowed_metadata_categories_reviewed"
  | "blocked_content_categories_reviewed"
  | "retention_constraints_reviewed"
  | "audit_trail_requirements_reviewed"
  | "metadata_only_evidence_attested"
  | "user_content_evidence_blocked"
  | "pii_evidence_blocked"
  | "secret_env_evidence_blocked"
  | "model_output_evidence_blocked"
  | "document_image_ocr_evidence_blocked"
  | "dna_offline_save_blocked"
  | "public_log_exposure_blocked"
  | "post_run_audit_required"
  | "persistence_requires_separate_authorization"
  | "no_evidence_persistence_performed"
  | "no_real_input_processed_by_this_contract"
  | "no_user_visible_output_allowed";

// ── Clearance level ─────────────────────────────────────────────────────────

export type EvidencePolicyClearanceLevel =
  | "policy_defined_only"
  | "metadata_schema_ready_for_future_operator_review";

// ── Rejection reasons ───────────────────────────────────────────────────────

export type EvidencePolicyRejectionReason =
  | "real_input_policy_not_ready"
  | "missing_pilot_session_id"
  | "missing_operator_identity_reference"
  | "missing_reviewer_identity_reference"
  | "missing_allowed_metadata_category"
  | "missing_blocked_content_category"
  | "missing_retention_constraint"
  | "missing_audit_trail_requirement"
  | "missing_required_checklist_item"
  | "invalid_clearance_level"
  | "user_content_evidence_claim_detected"
  | "raw_text_evidence_claim_detected"
  | "redacted_text_evidence_claim_detected"
  | "model_output_evidence_claim_detected"
  | "document_image_or_ocr_evidence_claim_detected"
  | "pii_evidence_claim_detected"
  | "secret_or_env_evidence_claim_detected"
  | "persistence_claim_detected"
  | "dna_save_claim_detected"
  | "offline_save_claim_detected"
  | "public_log_exposure_claim_detected"
  | "real_input_processed_claim_detected"
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
  | "unsafe_evidence_note_detected";

// ── Contract input ──────────────────────────────────────────────────────────

/**
 * Input for the evidence policy contract.
 *
 * Carries only policy metadata: pilot session ID, operator/reviewer human IDs,
 * allowed metadata categories, blocked content categories, retention
 * constraints, audit trail requirements, checklist confirmations, clearance
 * level, and acknowledgment statements.
 *
 * All evidence-content, env-value, secret, and runtime-safety flags are
 * literal `false` (or `true` for mandatory safety gates). No evidence is
 * persisted. No user content is stored. No DB/storage is modified.
 */
export interface EvidencePolicyContractInput {
  readonly contractId: string;
  readonly pilotSessionId: string;

  readonly realInputPolicyReady: boolean;
  readonly operatorHumanId: string;
  readonly reviewerHumanId: string;

  readonly allowedEvidenceMetadataCategories: readonly AllowedEvidenceMetadataCategory[];
  readonly blockedEvidenceContentCategories: readonly BlockedEvidenceContentCategory[];
  readonly retentionConstraints: readonly EvidenceRetentionConstraint[];
  readonly auditTrailRequirements: readonly EvidenceAuditTrailRequirement[];
  readonly checklistConfirmed: readonly EvidencePolicyChecklistItem[];
  readonly clearanceLevel: EvidencePolicyClearanceLevel;

  readonly metadataOnlyEvidence: true;
  readonly userContentEvidenceAllowed: false;
  readonly rawTextEvidenceAllowed: false;
  readonly redactedTextEvidenceAllowed: false;
  readonly modelOutputEvidenceAllowed: false;
  readonly documentImageOrOcrEvidenceAllowed: false;
  readonly piiEvidenceAllowed: false;
  readonly secretOrEnvEvidenceAllowed: false;
  readonly publicLogExposureAllowed: false;
  readonly persistenceRequiresSeparateAuthorization: true;
  readonly postRunAuditRequired: true;

  readonly operatorEvidenceAcknowledgment: string;
  readonly reviewerEvidenceAcknowledgment: string;
  readonly notes: readonly string[];

  readonly evidencePersistencePerformed: false;
  readonly realInputProcessedByContract: false;

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
 * Result of validating an `EvidencePolicyContractInput`.
 *
 * `safeEvidencePolicyMetadata` stores only safe, non-sensitive metadata.
 * No env values, secrets, API keys, PII, user content, or document content
 * are stored.
 *
 * `readyForPostRunAuditPlanning` may be `true` only when `accepted === true`.
 * `readyForRealOperatorPilotRun` is always `false`.
 */
export interface EvidencePolicyContractResult {
  readonly contractId: string;
  readonly status: EvidencePolicyContractStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly EvidencePolicyRejectionReason[];

  readonly safeEvidencePolicyMetadata: {
    readonly pilotSessionId: string;
    readonly operatorHumanId: string;
    readonly reviewerHumanId: string;
    readonly allowedMetadataCategoryCount: number;
    readonly blockedContentCategoryCount: number;
    readonly retentionConstraintCount: number;
    readonly auditTrailRequirementCount: number;
    readonly checklistPassedCount: number;
    readonly clearanceLevel: EvidencePolicyClearanceLevel;
  };

  readonly readyForPostRunAuditPlanning: boolean;

  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForLiveLLMRuntime: false;
  readonly readyForPersistence: false;

  readonly realPilotRunExecuted: false;
  readonly realUserInputProcessed: false;
  readonly evidencePersistencePerformed: false;
  readonly userContentEvidenceStored: false;
  readonly rawTextStored: false;
  readonly redactedTextStored: false;
  readonly fullDraftTextStored: false;
  readonly modelOutputStored: false;
  readonly documentImageStored: false;
  readonly ocrOutputStored: false;
  readonly envValueStored: false;
  readonly secretStored: false;
  readonly apiKeyStored: false;
  readonly userPiiStored: false;
  readonly documentContentStored: false;

  readonly httpCallMade: false;
  readonly apiRouteCalled: false;
  readonly liveLLMCalled: false;
  readonly apiRouteModifiedByEvidencePolicy: false;
  readonly evidencePersistenceRuntimeModifiedByPolicy: false;
  readonly databaseOrStorageModifiedByPolicy: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;
}

// ── Check result ────────────────────────────────────────────────────────────

/**
 * Result of `runEvidencePolicyContractCheck()` (Phase 8.2M-5).
 *
 * `allPassed` is true when all three sub-checks succeed:
 * 1. The 8.2M-4 real input policy is ready.
 * 2. The synthetic evidence policy input is accepted.
 * 3. All tamper cases are rejected.
 *
 * All evidence-persistence, content-storage, and runtime literal flags are
 * always `false`. No evidence is persisted. No DB/storage is modified.
 */
export interface EvidencePolicyContractCheckResult {
  readonly checkId: "8.2M-5";
  readonly allPassed: boolean;
  readonly realInputPolicyReady: boolean;
  readonly syntheticEvidencePolicyAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForPostRunAuditPlanning: boolean;

  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForLiveLLMRuntime: false;
  readonly readyForPersistence: false;

  readonly realPilotRunExecuted: false;
  readonly realUserInputProcessed: false;
  readonly evidencePersistencePerformed: false;
  readonly userContentEvidenceStored: false;
  readonly evidencePersistenceRuntimeModifiedByPolicy: false;
  readonly databaseOrStorageModifiedByPolicy: false;
  readonly liveLLMCalled: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;

  readonly notes: readonly string[];
}

// ── Exported constants ──────────────────────────────────────────────────────

/** All evidence metadata categories that may be collected in a future pilot. */
export const ALLOWED_EVIDENCE_METADATA_CATEGORIES: readonly AllowedEvidenceMetadataCategory[] =
  [
    "pilot_session_id",
    "operator_human_id",
    "reviewer_human_id",
    "scenario_id",
    "run_timestamp",
    "phase_id",
    "contract_check_status",
    "guard_result_status",
    "manual_review_verdict",
    "abort_protocol_status",
    "input_policy_clearance_level",
    "evidence_policy_status",
    "post_run_audit_status",
    "safety_invariant_snapshot",
    "blocker_code",
    "open_item_code",
  ] as const;

/** All content categories that must remain blocked from evidence storage. */
export const BLOCKED_EVIDENCE_CONTENT_CATEGORIES: readonly BlockedEvidenceContentCategory[] =
  [
    "raw_user_input_text",
    "redacted_user_input_text",
    "full_document_text",
    "document_image",
    "ocr_output_text",
    "model_raw_output",
    "full_draft_response",
    "user_name",
    "user_address",
    "user_email",
    "user_phone",
    "iban",
    "steuer_id",
    "aktenzeichen",
    "bg_nr",
    "insurance_number",
    "child_personal_data",
    "medical_data",
    "immigration_sensitive_story",
    "secrets_or_api_keys",
    "env_values",
  ] as const;

/** All retention constraints that must be confirmed in a valid policy contract. */
export const REQUIRED_EVIDENCE_RETENTION_CONSTRAINTS: readonly EvidenceRetentionConstraint[] =
  [
    "metadata_only_evidence",
    "no_user_content_storage",
    "no_raw_text_storage",
    "no_redacted_text_storage",
    "no_model_output_storage",
    "no_secret_storage",
    "no_env_value_storage",
    "no_pii_storage",
    "no_document_image_storage",
    "no_ocr_output_storage",
    "no_dna_save",
    "no_offline_save",
    "no_public_log_exposure",
    "manual_reviewer_access_only",
    "post_run_audit_required",
    "deletion_policy_required_before_persistence",
    "persistence_requires_separate_authorization",
  ] as const;

/** All audit trail requirements that must be confirmed in a valid policy contract. */
export const REQUIRED_EVIDENCE_AUDIT_TRAIL_REQUIREMENTS: readonly EvidenceAuditTrailRequirement[] =
  [
    "record_phase_ids",
    "record_contract_statuses",
    "record_safe_metadata_only",
    "record_blockers_without_content",
    "record_open_items_without_content",
    "record_manual_review_verdict_without_content",
    "record_abort_status_without_content",
    "record_safety_invariant_snapshot_without_content",
    "record_operator_reviewer_ids_without_pii_expansion",
    "require_post_run_audit_linkage",
    "require_no_user_content_evidence_assertion",
    "require_no_secret_or_env_value_assertion",
  ] as const;

/** All checklist items that must be confirmed in a valid policy contract. */
export const REQUIRED_EVIDENCE_POLICY_CHECKLIST: readonly EvidencePolicyChecklistItem[] =
  [
    "allowed_metadata_categories_reviewed",
    "blocked_content_categories_reviewed",
    "retention_constraints_reviewed",
    "audit_trail_requirements_reviewed",
    "metadata_only_evidence_attested",
    "user_content_evidence_blocked",
    "pii_evidence_blocked",
    "secret_env_evidence_blocked",
    "model_output_evidence_blocked",
    "document_image_ocr_evidence_blocked",
    "dna_offline_save_blocked",
    "public_log_exposure_blocked",
    "post_run_audit_required",
    "persistence_requires_separate_authorization",
    "no_evidence_persistence_performed",
    "no_real_input_processed_by_this_contract",
    "no_user_visible_output_allowed",
  ] as const;

/**
 * Required statements that must appear in both operator and reviewer
 * evidence policy acknowledgments.
 */
export const REQUIRED_EVIDENCE_POLICY_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that evidence is metadata-only in this policy.",
    "I acknowledge that actual user content must not be stored as evidence.",
    "I acknowledge that persistence requires separate authorization.",
    "I acknowledge that post-run audit is required before any future pilot can be considered complete.",
    "I acknowledge that public launch, live LLM runtime, and persistence remain blocked.",
  ] as const;

/**
 * Strings that must never appear in any evidence policy field, acknowledgment,
 * or notes. Includes env assignments, secret markers, raw/draft text markers,
 * PII, document content markers, sensitive personal markers, high-risk legal
 * markers, and evidence-specific content markers.
 */
export const FORBIDDEN_EVIDENCE_POLICY_STRINGS: readonly string[] = [
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
  "OCR output",
  "document image",
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

/** Evidence-specific user-content phrases that must never appear in any field or notes. */
export const FORBIDDEN_EVIDENCE_CONTENT_PHRASES: readonly string[] = [
  "stored user input",
  "stored redacted text",
  "stored model output",
  "stored document image",
  "stored OCR output",
  "stored PII",
  "stored secret",
] as const;
