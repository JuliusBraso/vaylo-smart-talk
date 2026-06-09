/**
 * Pilot Evidence Record Model types (Phase 8.2J-4).
 *
 * Defines the safe evidence record structure and validation types for the
 * controlled internal text pilot. All fields are constrained to non-sensitive,
 * structural metadata only. Raw input, redacted text, full draft text, PII,
 * screenshots, API keys, internal secrets, and raw model output are
 * explicitly prohibited.
 *
 * This module does NOT:
 * - implement persistence
 * - modify API routes
 * - touch UI
 * - call any LLM
 * - store or log any record content
 *
 * Safety invariants on PilotEvidenceRecord (literal false types):
 * - containsRawInputText: false
 * - containsRedactedText: false
 * - containsFullDraftText: false
 * - containsUserPii: false
 * - containsScreenshotWithPii: false
 * - containsDocumentImage: false
 * - containsApiKey: false
 * - containsInternalSecret: false
 * - containsRawModelOutput: false
 * - readyForPersistence: false
 * - readyForPublicLaunch: false
 * - liveLLMCalled: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - emittedToUserNow: false
 * - neverUserVisible: true
 */

// ── Status ────────────────────────────────────────────────────────────────────

export type PilotEvidenceRecordStatus =
  | "draft"
  | "reviewer_signed"
  | "rejected_invalid_record"
  | "ready_for_closure_audit";

// ── Verdicts ──────────────────────────────────────────────────────────────────

export type PilotEvidenceReviewVerdict =
  | "pass"
  | "pass_with_warning"
  | "human_review_required"
  | "blocked"
  | "invalid_test_run";

export type PilotEvidenceValidationVerdict =
  | "valid_evidence_record"
  | "invalid_missing_required_field"
  | "invalid_prohibited_field_present"
  | "invalid_raw_text_like_note"
  | "invalid_escalation_reason_required"
  | "invalid_checklist_counts"
  | "invalid_signoff_missing"
  | "invalid_public_launch_claim"
  | "invalid_persistence_claim"
  | "invalid_runtime_claim";

// ── Roles and phases ──────────────────────────────────────────────────────────

export type PilotEvidenceReviewerRole =
  | "primary_reviewer"
  | "secondary_reviewer"
  | "safety_observer"
  | "technical_observer";

export type PilotEvidenceSignedOffAtPhase =
  | "pre_run"
  | "scenario_execution"
  | "output_review"
  | "escalation_review"
  | "final_signoff";

// ── Escalation reasons ────────────────────────────────────────────────────────

export type PilotEvidenceEscalationReason =
  | "raw_value_leak_detected"
  | "unredacted_pii_detected"
  | "internal_metadata_leak_detected"
  | "legal_conclusion_detected"
  | "deadline_certainty_detected"
  | "hallucinated_authority_or_amount"
  | "false_reassurance_detected"
  | "panic_language_detected"
  | "missing_uncertainty_language"
  | "persistence_or_save_attempt_detected"
  | "public_runtime_exposure_detected"
  | "unexpected_llm_call_detected"
  | "expected_block_did_not_happen"
  | "expected_human_review_did_not_happen";

// ── Diagnostic codes ──────────────────────────────────────────────────────────

export type PilotEvidenceValidationDiagnosticCode =
  | "pilot_evidence_validation_started"
  | "pilot_evidence_required_fields_present"
  | "pilot_evidence_allowed_fields_only"
  | "pilot_evidence_no_prohibited_fields"
  | "pilot_evidence_notes_safe"
  | "pilot_evidence_escalation_reason_present_when_required"
  | "pilot_evidence_checklist_counts_valid"
  | "pilot_evidence_signoff_valid"
  | "pilot_evidence_ready_for_closure_audit"
  | "pilot_evidence_invalid_missing_required_field"
  | "pilot_evidence_invalid_prohibited_field_present"
  | "pilot_evidence_invalid_raw_text_like_note"
  | "pilot_evidence_invalid_escalation_reason_required"
  | "pilot_evidence_invalid_checklist_counts"
  | "pilot_evidence_invalid_signoff_missing"
  | "pilot_evidence_invalid_public_launch_claim"
  | "pilot_evidence_invalid_persistence_claim"
  | "pilot_evidence_invalid_runtime_claim"
  | "pilot_evidence_no_live_llm_confirmed"
  | "pilot_evidence_no_api_ui_confirmed"
  | "pilot_evidence_no_persistence_confirmed"
  | "pilot_evidence_no_dna_save_confirmed"
  | "pilot_evidence_no_offline_save_confirmed";

// ── Evidence record ───────────────────────────────────────────────────────────

/**
 * A safe pilot run evidence record.
 *
 * Contains only non-sensitive structural metadata:
 * - run IDs, scenario IDs, reviewer roles
 * - checklist counts, escalation reason codes
 * - non-sensitive structural notes (no raw content)
 * - signoff metadata
 *
 * All `contains*` flags are literal `false` — they cannot be set to true.
 * `readyForPersistence: false` — records are not persisted in this epoch.
 * `readyForPublicLaunch: false` — always false.
 */
export interface PilotEvidenceRecord {
  readonly pilotRunId: string;
  readonly scenarioId: string;
  readonly reviewerRole: PilotEvidenceReviewerRole;
  readonly reviewVerdict: PilotEvidenceReviewVerdict;
  readonly checklistPassedCount: number;
  readonly checklistFailedCount: number;
  readonly escalationReasons: readonly PilotEvidenceEscalationReason[];
  readonly nonSensitiveReviewerNotes: readonly string[];
  readonly signedOffBy: string;
  readonly signedOffAtPhase: PilotEvidenceSignedOffAtPhase;

  readonly containsRawInputText: false;
  readonly containsRedactedText: false;
  readonly containsFullDraftText: false;
  readonly containsUserPii: false;
  readonly containsScreenshotWithPii: false;
  readonly containsDocumentImage: false;
  readonly containsApiKey: false;
  readonly containsInternalSecret: false;
  readonly containsRawModelOutput: false;

  readonly readyForPersistence: false;
  readonly readyForClosureAudit: boolean;
  readonly readyForPublicLaunch: false;

  readonly liveLLMCalled: false;
  readonly apiRouteModified: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;
}

// ── Validation input / result ─────────────────────────────────────────────────

export interface PilotEvidenceValidationInput {
  readonly record: unknown;
  readonly validationRunId: string;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

export interface PilotEvidenceValidationResult {
  readonly validationRunId: string;
  readonly verdict: PilotEvidenceValidationVerdict;
  readonly diagnostics: readonly PilotEvidenceValidationDiagnosticCode[];
  readonly valid: boolean;
  readonly readyForClosureAudit: boolean;
  readonly safeEvidenceRecord: PilotEvidenceRecord | null;

  readonly prohibitedFieldsDetected: readonly string[];
  readonly suspiciousNoteSignals: readonly string[];

  readonly liveLLMCalled: false;
  readonly apiRouteTouched: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;

  readonly notes?: readonly string[];
}

// ── Field registry ────────────────────────────────────────────────────────────

/**
 * Exhaustive set of keys permitted in a PilotEvidenceRecord.
 * Any key not in this set is treated as unsafe and triggers rejection.
 */
export const PILOT_EVIDENCE_ALLOWED_FIELDS: ReadonlySet<string> = new Set<string>([
  "pilotRunId",
  "scenarioId",
  "reviewerRole",
  "reviewVerdict",
  "checklistPassedCount",
  "checklistFailedCount",
  "escalationReasons",
  "nonSensitiveReviewerNotes",
  "signedOffBy",
  "signedOffAtPhase",
  "containsRawInputText",
  "containsRedactedText",
  "containsFullDraftText",
  "containsUserPii",
  "containsScreenshotWithPii",
  "containsDocumentImage",
  "containsApiKey",
  "containsInternalSecret",
  "containsRawModelOutput",
  "readyForPersistence",
  "readyForClosureAudit",
  "readyForPublicLaunch",
  "liveLLMCalled",
  "apiRouteModified",
  "uiTouched",
  "persistenceUsed",
  "dnaSavePerformed",
  "offlineSavePerformed",
  "emittedToUserNow",
  "neverUserVisible",
]);

/**
 * Keys that are absolutely prohibited in a record.
 * Presence of any of these triggers immediate rejection.
 */
export const PILOT_EVIDENCE_PROHIBITED_FIELDS: ReadonlyArray<string> = [
  "rawInputText",
  "redactedText",
  "fullDraftText",
  "userPii",
  "screenshotWithPii",
  "documentImage",
  "apiKey",
  "internalSecret",
  "rawModelOutput",
];

/**
 * Conservative patterns used to detect raw-text-like content in reviewer notes.
 * A note matching any of these patterns triggers `invalid_raw_text_like_note`.
 */
export const PILOT_EVIDENCE_RAW_TEXT_LIKE_NOTE_PATTERNS: ReadonlyArray<{
  readonly label: string;
  readonly pattern: RegExp;
}> = [
  { label: "email-like", pattern: /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/ },
  { label: "IBAN-like", pattern: /\b[A-Z]{2}\d{2}[\s]?[\dA-Z]{4}[\s]?[\dA-Z]{4}[\s]?[\dA-Z]{0,4}[\s]?[\dA-Z]{0,4}[\s]?[\dA-Z]{0,4}\b/ },
  { label: "phone-like", pattern: /(\+\d{1,3}[\s\-]?)?\(?\d{3,5}\)?[\s\-]?\d{3,5}[\s\-]?\d{3,5}/ },
  { label: "Sehr geehrter", pattern: /Sehr geehrter/i },
  { label: "Aktenzeichen:", pattern: /Aktenzeichen:/i },
  { label: "BG-Nr", pattern: /BG[-\s]?Nr/i },
  { label: "Steuer-ID", pattern: /Steuer[-\s]?ID/i },
  { label: "IBAN", pattern: /\bIBAN\b/ },
  { label: "API_KEY", pattern: /API[_\s]?KEY/i },
  { label: "sk-", pattern: /\bsk-[a-zA-Z0-9]/ },
];
