/**
 * Pilot Evidence Validation Integration Types (Phase 8.2K-4).
 *
 * Defines the typed contracts for the integration layer that proves a guarded
 * pilot runtime response can be safely transformed into a PilotEvidenceRecord
 * validation input and validated by the existing 8.2J-4 evidence model.
 *
 * - PilotEvidenceValidationIntegrationCaseKind — 13-member catalogue
 * - PilotEvidenceValidationIntegrationVerdict — valid / rejected
 * - PilotEvidenceValidationIntegrationCaseResult — per-case result
 * - PilotEvidenceValidationIntegrationSummary — aggregate summary
 *
 * Integration safety invariants (all literal false/true):
 * - liveLLMCalled: false
 * - apiRouteModifiedByIntegration: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - emittedToUserNow: false
 * - neverUserVisible: true
 *
 * This integration does NOT persist evidence.
 * This integration does NOT call the API route.
 * This integration does NOT call live LLM.
 * This integration does NOT store raw text.
 * This integration does NOT emit user-visible output.
 */

// ── Case kinds ────────────────────────────────────────────────────────────────

/**
 * Enumerates every integration case exercised by the harness.
 *
 * - *_to_valid_evidence: runtime response → valid PilotEvidenceRecord
 * - *_tamper_rejected: tampered input must be rejected by validator or pre-check
 */
export type PilotEvidenceValidationIntegrationCaseKind =
  | "authorised_runtime_response_to_valid_evidence"
  | "blocked_runtime_response_to_valid_evidence"
  | "human_review_runtime_response_to_valid_evidence"
  | "invalid_request_runtime_response_to_valid_evidence"
  | "raw_text_tamper_rejected"
  | "redacted_text_tamper_rejected"
  | "secret_tamper_rejected"
  | "user_pii_tamper_rejected"
  | "persistence_flag_tamper_rejected"
  | "public_runtime_flag_tamper_rejected"
  | "emitted_to_user_tamper_rejected"
  | "missing_signoff_tamper_rejected"
  | "missing_escalation_reason_tamper_rejected";

// ── Verdict ───────────────────────────────────────────────────────────────────

/** Whether the evidence validation produced a valid or rejected outcome. */
export type PilotEvidenceValidationIntegrationVerdict = "valid" | "rejected";

// ── Per-case result ───────────────────────────────────────────────────────────

/**
 * Detailed result for a single integration case.
 *
 * Fields:
 * - caseKind: which scenario was exercised
 * - passed: expected verdict matched actual and all checks passed
 * - expectedVerdict / actualVerdict: validation outcome comparison
 * - pilotRuntimeResponseKind: runtime response kind that drove the mapping
 * - evidenceValidationAttempted: validatePilotEvidenceRecord was called
 * - evidenceValidationAccepted: validation returned valid: true
 * - rawTextLeakCheckPassed: result JSON does not echo injected raw text
 * - redactedTextLeakCheckPassed: result JSON does not echo injected redacted text
 * - secretLeakCheckPassed: result JSON does not contain synthetic secret
 * - userPiiLeakCheckPassed: result JSON does not contain PII test values
 * - persistenceCheckPassed: all persistence flags false in validation result
 * - publicRuntimeCheckPassed: public runtime claim false in validation result
 * - emittedToUserCheckPassed: emittedToUserNow false in validation result
 * - liveLLMCheckPassed: liveLLMCalled false in validation result
 * - notes: diagnostic messages on mismatch or pass reason
 */
export interface PilotEvidenceValidationIntegrationCaseResult {
  readonly caseKind: PilotEvidenceValidationIntegrationCaseKind;
  readonly passed: boolean;

  readonly expectedVerdict: PilotEvidenceValidationIntegrationVerdict;
  readonly actualVerdict: PilotEvidenceValidationIntegrationVerdict;

  readonly pilotRuntimeResponseKind:
    | "authorised_internal_packet"
    | "blocked"
    | "human_review_required"
    | "invalid_request";

  readonly evidenceValidationAttempted: boolean;
  readonly evidenceValidationAccepted: boolean;

  readonly rawTextLeakCheckPassed: boolean;
  readonly redactedTextLeakCheckPassed: boolean;
  readonly secretLeakCheckPassed: boolean;
  readonly userPiiLeakCheckPassed: boolean;

  readonly persistenceCheckPassed: boolean;
  readonly publicRuntimeCheckPassed: boolean;
  readonly emittedToUserCheckPassed: boolean;
  readonly liveLLMCheckPassed: boolean;

  readonly notes: readonly string[];
}

// ── Integration summary ───────────────────────────────────────────────────────

/**
 * Aggregate result for the full evidence validation integration run.
 *
 * Coverage flags:
 * - authorisedRuntimeResponseCovered: authorised_internal_packet path passed
 * - blockedRuntimeResponseCovered: blocked path passed
 * - humanReviewRuntimeResponseCovered: human_review_required path passed
 * - invalidRequestRuntimeResponseCovered: invalid_request path passed
 * - tamperRejectionCovered: all 9 tamper rejection cases passed
 *
 * Safety invariants are literal types — the integration never touches live
 * infrastructure regardless of case outcome.
 */
export interface PilotEvidenceValidationIntegrationSummary {
  readonly integrationId: "8.2K-4";
  readonly integrationVersion: "pilot-evidence-validation-integration-v1";

  readonly totalCases: number;
  readonly passedCases: number;
  readonly failedCases: number;
  readonly allPassed: boolean;

  readonly authorisedRuntimeResponseCovered: boolean;
  readonly blockedRuntimeResponseCovered: boolean;
  readonly humanReviewRuntimeResponseCovered: boolean;
  readonly invalidRequestRuntimeResponseCovered: boolean;
  readonly tamperRejectionCovered: boolean;

  readonly rawTextLeakCheckPassed: boolean;
  readonly redactedTextLeakCheckPassed: boolean;
  readonly secretLeakCheckPassed: boolean;
  readonly userPiiLeakCheckPassed: boolean;

  readonly persistenceCheckPassed: boolean;
  readonly publicRuntimeCheckPassed: boolean;
  readonly emittedToUserCheckPassed: boolean;
  readonly liveLLMCheckPassed: boolean;

  readonly liveLLMCalled: false;
  readonly apiRouteModifiedByIntegration: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;

  readonly caseResults: readonly PilotEvidenceValidationIntegrationCaseResult[];
}
