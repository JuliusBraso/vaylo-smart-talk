/**
 * Manual Review Capture Model Types (Phase 8.2L-3).
 *
 * Defines the typed contract for capturing manual reviewer verdicts after a
 * synthetic single-run execution harness result.
 *
 * This module does NOT:
 * - persist review records
 * - store raw text, redacted text, full draft text, model output, secrets,
 *   PII, or document content
 * - call any live LLM
 * - make HTTP requests
 * - read process.env
 * - modify API routes
 * - touch UI
 *
 * All result fields storing content-sensitive data are literal false.
 * Only safe metadata (IDs, verdict, counts, phase) is carried in the result.
 *
 * Safety invariants on ManualReviewCaptureResult (all literal types):
 * - readyForPilotRunNow: false
 * - readyForPublicLaunch: false
 * - readyForLiveLLMRuntime: false
 * - readyForPersistence: false
 * - rawTextStored: false
 * - redactedTextStored: false
 * - fullDraftTextStored: false
 * - modelOutputStored: false
 * - secretStored: false
 * - userPiiStored: false
 * - documentContentStored: false
 * - liveLLMCalled: false
 * - apiRouteModifiedByReviewCapture: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - emittedToUserNow: false
 * - neverUserVisible: true
 */

// ── Capture status ─────────────────────────────────────────────────────────────

export type ManualReviewCaptureStatus = "valid" | "rejected";

// ── Review verdict ─────────────────────────────────────────────────────────────

export type ManualReviewCaptureVerdict =
  | "pass"
  | "pass_with_warnings"
  | "human_review_required"
  | "blocked"
  | "invalid_test_run";

// ── Checklist items ────────────────────────────────────────────────────────────

export type ManualReviewCaptureChecklistItem =
  | "reviewed_single_run_result_status"
  | "reviewed_no_raw_text_echo"
  | "reviewed_no_secret_echo"
  | "reviewed_no_pii_echo"
  | "reviewed_no_user_visible_output"
  | "reviewed_no_live_llm"
  | "reviewed_no_persistence"
  | "reviewed_no_dna_save"
  | "reviewed_no_offline_save"
  | "reviewed_no_public_runtime"
  | "reviewed_no_api_route_call"
  | "reviewed_no_http_call"
  | "reviewed_abort_criteria"
  | "reviewed_ready_for_post_execution_audit";

// ── Rejection reasons ──────────────────────────────────────────────────────────

export type ManualReviewCaptureRejectionReason =
  | "single_run_harness_not_ready"
  | "missing_reviewer_id"
  | "missing_pilot_run_id"
  | "missing_pilot_scenario_id"
  | "missing_review_verdict"
  | "missing_required_checklist_item"
  | "missing_escalation_reason"
  | "forbidden_raw_text_detected"
  | "forbidden_redacted_text_detected"
  | "forbidden_secret_detected"
  | "forbidden_pii_detected"
  | "forbidden_model_output_detected"
  | "forbidden_document_content_detected"
  | "persistence_claim_detected"
  | "dna_save_claim_detected"
  | "offline_save_claim_detected"
  | "public_runtime_claim_detected"
  | "live_llm_claim_detected"
  | "user_visible_output_claim_detected"
  | "invalid_signoff_phase"
  | "reviewer_note_unsafe";

// ── Signoff phase ──────────────────────────────────────────────────────────────

export type ManualReviewCaptureSignoffPhase =
  | "manual_review"
  | "escalation_review"
  | "final_review";

// ── Capture input ──────────────────────────────────────────────────────────────

/**
 * Operator-provided manual review capture input.
 *
 * Contains only safe metadata: IDs, verdict, checklist confirmations,
 * counts, and non-sensitive reviewer notes.
 *
 * All content-sensitive fields (`contains*`, persistence, live-LLM, etc.)
 * are literal `false` — TypeScript prevents setting them to any other value.
 */
export interface ManualReviewCaptureInput {
  readonly reviewId: string;
  readonly pilotRunId: string;
  readonly pilotScenarioId: string;
  readonly reviewerId: string;

  readonly singleRunHarnessReady: boolean;
  readonly reviewVerdict: ManualReviewCaptureVerdict;
  readonly checklistConfirmed: readonly ManualReviewCaptureChecklistItem[];
  readonly checklistPassedCount: number;
  readonly checklistFailedCount: number;
  readonly escalationReasons: readonly string[];
  readonly reviewerNotes: readonly string[];
  readonly signedOffAtPhase: ManualReviewCaptureSignoffPhase;

  readonly containsRawInputText: false;
  readonly containsRedactedText: false;
  readonly containsFullDraftText: false;
  readonly containsModelOutput: false;
  readonly containsSecret: false;
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

// ── Capture result ─────────────────────────────────────────────────────────────

/**
 * Result of validating a `ManualReviewCaptureInput`.
 *
 * Stores only safe metadata in `safeReviewMetadata`.
 * All content-sensitive storage flags are literal `false`.
 *
 * `readyForPostExecutionAudit` is the only readiness flag that may be true.
 * It signals that 8.2L-4 post-execution audit may begin.
 * `readyForPilotRunNow` remains `false`.
 */
export interface ManualReviewCaptureResult {
  readonly reviewId: string;
  readonly status: ManualReviewCaptureStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly ManualReviewCaptureRejectionReason[];

  readonly readyForPostExecutionAudit: boolean;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForLiveLLMRuntime: false;
  readonly readyForPersistence: false;

  readonly safeReviewMetadata: {
    readonly pilotRunId: string;
    readonly pilotScenarioId: string;
    readonly reviewerId: string;
    readonly reviewVerdict: ManualReviewCaptureVerdict;
    readonly checklistPassedCount: number;
    readonly checklistFailedCount: number;
    readonly signedOffAtPhase: ManualReviewCaptureSignoffPhase;
  };

  readonly rawTextStored: false;
  readonly redactedTextStored: false;
  readonly fullDraftTextStored: false;
  readonly modelOutputStored: false;
  readonly secretStored: false;
  readonly userPiiStored: false;
  readonly documentContentStored: false;

  readonly liveLLMCalled: false;
  readonly apiRouteModifiedByReviewCapture: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;
}

// ── Check result ───────────────────────────────────────────────────────────────

export interface ManualReviewCaptureModelCheckResult {
  readonly checkId: "8.2L-3";
  readonly allPassed: boolean;
  readonly singleRunHarnessReady: boolean;
  readonly syntheticReviewAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForPostExecutionAudit: boolean;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForLiveLLMRuntime: false;
  readonly readyForPersistence: false;

  readonly liveLLMCalled: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;

  readonly notes: readonly string[];
}

// ── Required constants ─────────────────────────────────────────────────────────

/**
 * All required checklist items for a valid manual review capture.
 */
export const REQUIRED_MANUAL_REVIEW_CHECKLIST: ReadonlyArray<ManualReviewCaptureChecklistItem> =
  [
    "reviewed_single_run_result_status",
    "reviewed_no_raw_text_echo",
    "reviewed_no_secret_echo",
    "reviewed_no_pii_echo",
    "reviewed_no_user_visible_output",
    "reviewed_no_live_llm",
    "reviewed_no_persistence",
    "reviewed_no_dna_save",
    "reviewed_no_offline_save",
    "reviewed_no_public_runtime",
    "reviewed_no_api_route_call",
    "reviewed_no_http_call",
    "reviewed_abort_criteria",
    "reviewed_ready_for_post_execution_audit",
  ];

/**
 * Strings that must never appear in reviewer notes or escalation reasons.
 * Presence of any of these strings in a review capture input causes rejection.
 */
export const FORBIDDEN_MANUAL_REVIEW_STRINGS: readonly string[] = [
  "SYNTHETIC_TEXT_NEVER_REAL_USER_DATA",
  "synthetic-secret-never-real",
  "rawInputText",
  "redactedText",
  "fullDraftText",
  "modelOutput",
  "apiKey",
  "internalSecret",
  "IBAN",
  "Steuer-ID",
  "Aktenzeichen",
  "john@example.com",
  "+49 170 1234567",
];
