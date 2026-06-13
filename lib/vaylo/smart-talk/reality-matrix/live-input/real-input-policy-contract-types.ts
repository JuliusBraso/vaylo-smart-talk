/**
 * Real Input Policy Contract Types (Phase 8.2M-4).
 *
 * Defines the typed real input policy contract that specifies what input
 * categories may be allowed, what must remain disallowed, what redaction
 * requirements apply, and what clearance gates must be present before any
 * real operator pilot run can consider processing real input.
 *
 * This module does NOT:
 * - read process.env
 * - process actual user input
 * - forward raw user input
 * - implement redaction logic
 * - authorize a real pilot run
 * - persist policy records
 * - store content (raw text, redacted text, secrets, PII, model output, etc.)
 * - call any live LLM
 * - make HTTP requests
 * - modify API routes, UI, or runtime redaction/routing behavior
 *
 * This contract only defines the policy that must exist before future real
 * input can be considered. It is not redaction implementation, not OCR/photo
 * support, not document upload implementation, and not runtime routing.
 *
 * Safety invariants on RealInputPolicyContractInput (all literal):
 * - rawInputForwardingAllowed: false
 * - realInputProcessedByContract: false
 * - manualReviewClearanceRequired: true
 * - completenessWarningRequired: true
 * - legalDisclaimerRequired: true
 * - highRiskInputsBlocked: true
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
 * - publicRuntimeEnabled: false
 * - liveLLMCalled: false
 * - emittedToUserNow: false
 * - userVisibleOutputAllowed: false
 * - neverUserVisible: true
 *
 * Safety invariants on RealInputPolicyContractResult (all literal):
 * - readyForRealOperatorPilotRun: false
 * - readyForPilotRunNow: false
 * - readyForPublicLaunch: false
 * - readyForLiveLLMRuntime: false
 * - readyForPersistence: false
 * - realPilotRunExecuted: false
 * - realUserInputProcessed: false
 * - rawInputForwarded: false
 * - rawTextStored: false
 * - redactedTextStored: false
 * - fullDraftTextStored: false
 * - modelOutputStored: false
 * - envValueStored: false
 * - secretStored: false
 * - apiKeyStored: false
 * - userPiiStored: false
 * - documentContentStored: false
 * - httpCallMade: false
 * - apiRouteCalled: false
 * - liveLLMCalled: false
 * - apiRouteModifiedByRealInputPolicy: false
 * - redactionRuntimeModifiedByPolicy: false
 * - inputRouterModifiedByPolicy: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - emittedToUserNow: false
 * - neverUserVisible: true
 */

// ── Status ──────────────────────────────────────────────────────────────────

export type RealInputPolicyContractStatus = "valid" | "rejected";

// ── Allowed input categories ────────────────────────────────────────────────

export type RealInputCategory =
  | "typed_bureaucratic_text"
  | "pasted_bureaucratic_letter_excerpt"
  | "synthetic_control_text"
  | "operator_test_question"
  | "redacted_real_text_excerpt";

// ── Disallowed input categories ─────────────────────────────────────────────

export type DisallowedRealInputCategory =
  | "photo_ocr_input"
  | "file_upload_input"
  | "full_document_upload"
  | "multi_document_bundle"
  | "payment_triggered_input"
  | "public_anonymous_user_input"
  | "unattended_user_input"
  | "third_party_sensitive_data"
  | "medical_emergency_input"
  | "deportation_deadline_uncertain_input"
  | "legal_appeal_deadline_uncertain_input"
  | "raw_secret_or_api_key_input"
  | "raw_bank_or_tax_identifier_input"
  | "raw_children_data_input";

// ── Redaction requirements ──────────────────────────────────────────────────

export type RealInputRedactionRequirement =
  | "redact_names_before_forwarding"
  | "redact_addresses_before_forwarding"
  | "redact_phone_numbers_before_forwarding"
  | "redact_emails_before_forwarding"
  | "redact_iban_before_forwarding"
  | "redact_steuer_id_before_forwarding"
  | "redact_aktenzeichen_before_forwarding"
  | "redact_bg_nr_before_forwarding"
  | "redact_insurance_numbers_before_forwarding"
  | "redact_dates_only_when_not_decision_relevant"
  | "preserve_authority_name_when_relevant"
  | "preserve_document_type_when_relevant"
  | "preserve_deadline_only_with_uncertainty_label"
  | "preserve_amounts_only_when_needed_for_explanation"
  | "mark_partial_input_if_excerpt"
  | "require_manual_reviewer_clearance_before_forwarding"
  | "block_if_redaction_uncertain"
  | "block_if_deadline_or_legal_consequence_uncertain";

// ── Checklist items ─────────────────────────────────────────────────────────

export type RealInputPolicyChecklistItem =
  | "allowed_input_categories_reviewed"
  | "disallowed_input_categories_reviewed"
  | "redaction_requirements_reviewed"
  | "raw_input_forwarding_blocked"
  | "real_user_input_requires_operator_control"
  | "real_user_input_requires_manual_review_clearance"
  | "partial_input_must_be_marked"
  | "completeness_warning_required_before_future_user_flow"
  | "legal_disclaimer_required_before_future_user_flow"
  | "high_risk_deadline_uncertainty_blocks_forwarding"
  | "pii_uncertainty_blocks_forwarding"
  | "secret_or_env_value_input_blocks_forwarding"
  | "public_runtime_blocked"
  | "live_llm_runtime_still_blocked"
  | "persistence_still_blocked"
  | "no_real_input_processed_by_this_contract"
  | "no_raw_text_stored"
  | "no_user_visible_output_allowed";

// ── Clearance level ─────────────────────────────────────────────────────────

export type RealInputClearanceLevel =
  | "no_clearance"
  | "policy_defined_only"
  | "redacted_excerpt_ready_for_future_operator_review";

// ── Rejection reasons ───────────────────────────────────────────────────────

export type RealInputPolicyRejectionReason =
  | "abort_protocol_not_ready"
  | "missing_pilot_session_id"
  | "missing_operator_identity_reference"
  | "missing_reviewer_identity_reference"
  | "missing_allowed_input_category"
  | "missing_disallowed_input_category"
  | "missing_redaction_requirement"
  | "missing_required_checklist_item"
  | "invalid_clearance_level"
  | "raw_input_forwarding_claim_detected"
  | "real_input_processed_claim_detected"
  | "redaction_policy_uncertain"
  | "manual_review_clearance_missing"
  | "completeness_warning_missing"
  | "legal_disclaimer_missing"
  | "high_risk_input_allowed_without_block"
  | "forbidden_secret_detected"
  | "forbidden_env_value_detected"
  | "forbidden_api_key_detected"
  | "forbidden_pii_detected"
  | "forbidden_raw_text_detected"
  | "forbidden_redacted_text_detected"
  | "forbidden_document_content_detected"
  | "forbidden_model_output_detected"
  | "persistence_claim_detected"
  | "live_llm_claim_detected"
  | "public_runtime_claim_detected"
  | "user_visible_output_claim_detected"
  | "unsafe_policy_note_detected";

// ── Contract input ──────────────────────────────────────────────────────────

/**
 * Input for the real input policy contract.
 *
 * Carries only policy metadata: pilot session ID, operator/reviewer human IDs,
 * allowed/disallowed categories, redaction requirements, checklist
 * confirmations, clearance level, and acknowledgment statements.
 *
 * All content, env-value, secret, and runtime-safety flags are literal `false`
 * (or `true` for mandatory safety gates). No real input is processed.
 * No raw input is forwarded. No redaction is implemented.
 */
export interface RealInputPolicyContractInput {
  readonly contractId: string;
  readonly pilotSessionId: string;

  readonly abortProtocolReady: boolean;
  readonly operatorHumanId: string;
  readonly reviewerHumanId: string;

  readonly allowedInputCategories: readonly RealInputCategory[];
  readonly disallowedInputCategories: readonly DisallowedRealInputCategory[];
  readonly redactionRequirements: readonly RealInputRedactionRequirement[];
  readonly checklistConfirmed: readonly RealInputPolicyChecklistItem[];
  readonly clearanceLevel: RealInputClearanceLevel;

  readonly rawInputForwardingAllowed: false;
  readonly realInputProcessedByContract: false;
  readonly redactionPolicyDefined: boolean;
  readonly manualReviewClearanceRequired: true;
  readonly completenessWarningRequired: true;
  readonly legalDisclaimerRequired: true;
  readonly highRiskInputsBlocked: true;

  readonly operatorPolicyAcknowledgment: string;
  readonly reviewerPolicyAcknowledgment: string;
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
  readonly publicRuntimeEnabled: false;
  readonly liveLLMCalled: false;
  readonly emittedToUserNow: false;
  readonly userVisibleOutputAllowed: false;

  readonly neverUserVisible: true;
}

// ── Contract result ─────────────────────────────────────────────────────────

/**
 * Result of validating a `RealInputPolicyContractInput`.
 *
 * `safeInputPolicyMetadata` stores only safe, non-sensitive metadata.
 * No env values, secrets, API keys, PII, raw text, or document content
 * are stored.
 *
 * Planning readiness flags may be `true` only when `accepted === true`.
 * `readyForRealOperatorPilotRun` is always `false`.
 */
export interface RealInputPolicyContractResult {
  readonly contractId: string;
  readonly status: RealInputPolicyContractStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly RealInputPolicyRejectionReason[];

  readonly safeInputPolicyMetadata: {
    readonly pilotSessionId: string;
    readonly operatorHumanId: string;
    readonly reviewerHumanId: string;
    readonly allowedInputCategoryCount: number;
    readonly disallowedInputCategoryCount: number;
    readonly redactionRequirementCount: number;
    readonly checklistPassedCount: number;
    readonly clearanceLevel: RealInputClearanceLevel;
  };

  readonly readyForEvidencePolicy: boolean;
  readonly readyForPostRunAuditPlanning: boolean;

  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForLiveLLMRuntime: false;
  readonly readyForPersistence: false;

  readonly realPilotRunExecuted: false;
  readonly realUserInputProcessed: false;
  readonly rawInputForwarded: false;
  readonly rawTextStored: false;
  readonly redactedTextStored: false;
  readonly fullDraftTextStored: false;
  readonly modelOutputStored: false;
  readonly envValueStored: false;
  readonly secretStored: false;
  readonly apiKeyStored: false;
  readonly userPiiStored: false;
  readonly documentContentStored: false;

  readonly httpCallMade: false;
  readonly apiRouteCalled: false;
  readonly liveLLMCalled: false;
  readonly apiRouteModifiedByRealInputPolicy: false;
  readonly redactionRuntimeModifiedByPolicy: false;
  readonly inputRouterModifiedByPolicy: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;
}

// ── Check result ────────────────────────────────────────────────────────────

/**
 * Result of `runRealInputPolicyContractCheck()` (Phase 8.2M-4).
 *
 * `allPassed` is true when all three sub-checks succeed:
 * 1. The 8.2M-3 abort protocol is ready.
 * 2. The synthetic input policy input is accepted.
 * 3. All tamper cases are rejected.
 *
 * All raw-input, redaction-runtime, and content literal flags are always
 * `false`. No real input is processed. No raw input is forwarded.
 */
export interface RealInputPolicyContractCheckResult {
  readonly checkId: "8.2M-4";
  readonly allPassed: boolean;
  readonly abortProtocolReady: boolean;
  readonly syntheticInputPolicyAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForEvidencePolicy: boolean;
  readonly readyForPostRunAuditPlanning: boolean;

  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForLiveLLMRuntime: false;
  readonly readyForPersistence: false;

  readonly realPilotRunExecuted: false;
  readonly realUserInputProcessed: false;
  readonly rawInputForwarded: false;
  readonly redactionRuntimeModifiedByPolicy: false;
  readonly inputRouterModifiedByPolicy: false;
  readonly liveLLMCalled: false;
  readonly persistenceUsed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;

  readonly notes: readonly string[];
}

// ── Exported constants ──────────────────────────────────────────────────────

/** All allowed real input categories for a future operator-controlled pilot. */
export const ALLOWED_REAL_INPUT_CATEGORIES: readonly RealInputCategory[] = [
  "typed_bureaucratic_text",
  "pasted_bureaucratic_letter_excerpt",
  "synthetic_control_text",
  "operator_test_question",
  "redacted_real_text_excerpt",
] as const;

/** All input categories that must remain disallowed in a future real pilot. */
export const DISALLOWED_REAL_INPUT_CATEGORIES: readonly DisallowedRealInputCategory[] =
  [
    "photo_ocr_input",
    "file_upload_input",
    "full_document_upload",
    "multi_document_bundle",
    "payment_triggered_input",
    "public_anonymous_user_input",
    "unattended_user_input",
    "third_party_sensitive_data",
    "medical_emergency_input",
    "deportation_deadline_uncertain_input",
    "legal_appeal_deadline_uncertain_input",
    "raw_secret_or_api_key_input",
    "raw_bank_or_tax_identifier_input",
    "raw_children_data_input",
  ] as const;

/** All redaction requirements that must be confirmed in a valid policy contract. */
export const REQUIRED_REAL_INPUT_REDACTION_REQUIREMENTS: readonly RealInputRedactionRequirement[] =
  [
    "redact_names_before_forwarding",
    "redact_addresses_before_forwarding",
    "redact_phone_numbers_before_forwarding",
    "redact_emails_before_forwarding",
    "redact_iban_before_forwarding",
    "redact_steuer_id_before_forwarding",
    "redact_aktenzeichen_before_forwarding",
    "redact_bg_nr_before_forwarding",
    "redact_insurance_numbers_before_forwarding",
    "redact_dates_only_when_not_decision_relevant",
    "preserve_authority_name_when_relevant",
    "preserve_document_type_when_relevant",
    "preserve_deadline_only_with_uncertainty_label",
    "preserve_amounts_only_when_needed_for_explanation",
    "mark_partial_input_if_excerpt",
    "require_manual_reviewer_clearance_before_forwarding",
    "block_if_redaction_uncertain",
    "block_if_deadline_or_legal_consequence_uncertain",
  ] as const;

/** All checklist items that must be confirmed in a valid policy contract. */
export const REQUIRED_REAL_INPUT_POLICY_CHECKLIST: readonly RealInputPolicyChecklistItem[] =
  [
    "allowed_input_categories_reviewed",
    "disallowed_input_categories_reviewed",
    "redaction_requirements_reviewed",
    "raw_input_forwarding_blocked",
    "real_user_input_requires_operator_control",
    "real_user_input_requires_manual_review_clearance",
    "partial_input_must_be_marked",
    "completeness_warning_required_before_future_user_flow",
    "legal_disclaimer_required_before_future_user_flow",
    "high_risk_deadline_uncertainty_blocks_forwarding",
    "pii_uncertainty_blocks_forwarding",
    "secret_or_env_value_input_blocks_forwarding",
    "public_runtime_blocked",
    "live_llm_runtime_still_blocked",
    "persistence_still_blocked",
    "no_real_input_processed_by_this_contract",
    "no_raw_text_stored",
    "no_user_visible_output_allowed",
  ] as const;

/**
 * Required statements that must appear in both operator and reviewer
 * policy acknowledgments.
 */
export const REQUIRED_REAL_INPUT_POLICY_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that raw input forwarding remains blocked.",
    "I acknowledge that future real input requires operator control and manual review clearance.",
    "I acknowledge that completeness warning and legal disclaimer are required before any future user-facing flow.",
    "I acknowledge that public launch, live LLM runtime, and persistence remain blocked.",
  ] as const;

/**
 * Strings that must never appear in any policy field, acknowledgment,
 * or notes. Includes env assignments, secret markers, raw/draft text
 * markers, PII, document content markers, sensitive personal markers,
 * and high-risk legal/document markers.
 */
export const FORBIDDEN_REAL_INPUT_POLICY_STRINGS: readonly string[] = [
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
