/**
 * Real Text Input Contract types (Phase 8.2H-1).
 *
 * Defines the first real-text input contract for the 8.2H Controlled Live
 * Input Wiring epoch. This contract gates raw user text before it can ever
 * reach the redaction boundary, LLM adapter, 8.2G governance pipeline, or
 * Smart Talk API delivery.
 *
 * Phase 8.2H-1 is type + validator only. It does NOT:
 * - wire text into the runtime pipeline
 * - call any LLM
 * - touch API routes or UI
 * - persist anything
 * - make Smart Talk public live runtime
 *
 * Accepted text is marked `acceptedForRedactionBoundary: true` only.
 * It is NOT yet accepted for LLM, runtime pipeline, or user-visible output.
 *
 * Safety invariants encoded as literal types:
 * - acceptedForLLM: false
 * - acceptedForRuntimePipeline: false
 * - acceptedForUserVisibleOutput: false
 * - persistenceAllowed: false
 * - dnaSaveAllowed: false
 * - offlineSaveAllowed: false
 * - deadlineCalculationAllowed: false
 * - legalConclusionAllowed: false
 * - liveLLMCalled: false
 * - apiRouteTouched: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - neverUserVisible: true
 */

// ── Constants ─────────────────────────────────────────────────────────────────

/** Minimum accepted text length (characters, after normalisation). */
export const REAL_TEXT_INPUT_MIN_LENGTH = 8 as const;

/** Maximum accepted text length (characters, after normalisation). */
export const REAL_TEXT_INPUT_MAX_LENGTH = 12_000 as const;

// ── Input mode ────────────────────────────────────────────────────────────────

/**
 * The two controlled input modes accepted by the real text input contract.
 * Both are guarded — they may not flow to LLM or runtime without all 12
 * 8.2H guards in place.
 */
export type RealTextInputMode =
  | "real_text_guarded"
  | "real_question_guarded";

// ── Contract verdict ──────────────────────────────────────────────────────────

/**
 * The verdict of `runRealTextInputContractValidation`.
 *
 * `accepted_for_redaction_boundary` — input passed all guards; may proceed to
 *   the redaction boundary (8.2H-2) but NOT to LLM or runtime pipeline yet.
 *
 * All `rejected_*` variants block the input before the redaction boundary.
 */
export type RealTextInputContractVerdict =
  | "accepted_for_redaction_boundary"
  | "rejected_empty_input"
  | "rejected_too_short"
  | "rejected_too_long"
  | "rejected_unsupported_mode"
  | "rejected_ocr_or_file_input"
  | "rejected_public_runtime_not_allowed"
  | "rejected_persistence_requested"
  | "rejected_dna_save_requested"
  | "rejected_offline_save_requested"
  | "rejected_deadline_calculation_requested"
  | "rejected_legal_conclusion_requested";

// ── Diagnostic codes ──────────────────────────────────────────────────────────

export type RealTextInputContractDiagnosticCode =
  | "real_text_input_validation_started"
  | "real_text_input_mode_accepted"
  | "real_text_input_text_length_accepted"
  | "real_text_input_accepted_for_redaction_boundary"
  | "real_text_input_rejected_empty_input"
  | "real_text_input_rejected_too_short"
  | "real_text_input_rejected_too_long"
  | "real_text_input_rejected_unsupported_mode"
  | "real_text_input_rejected_ocr_or_file_input"
  | "real_text_input_rejected_public_runtime_not_allowed"
  | "real_text_input_rejected_persistence_requested"
  | "real_text_input_rejected_dna_save_requested"
  | "real_text_input_rejected_offline_save_requested"
  | "real_text_input_rejected_deadline_calculation_requested"
  | "real_text_input_rejected_legal_conclusion_requested"
  | "real_text_input_no_live_llm_confirmed"
  | "real_text_input_no_persistence_confirmed"
  | "real_text_input_no_dna_save_confirmed"
  | "real_text_input_no_offline_save_confirmed";

// ── Input ─────────────────────────────────────────────────────────────────────

/**
 * Input to `runRealTextInputContractValidation`.
 *
 * All fields except `validationRunId` and `neverUserVisible` are `unknown` to
 * force defensive runtime validation — the caller provides raw request fields.
 *
 * `inputMode`                        — must equal "real_text_guarded" or "real_question_guarded".
 * `text`                             — the raw user-provided text string.
 * `sourceKind`                       — if "ocr_photo" / "file_upload" / "document_upload" /
 *                                      "image_upload", the request is rejected.
 * `requestedPersistence`             — if true, rejected.
 * `requestedDnaSave`                 — if true, rejected.
 * `requestedOfflineSave`             — if true, rejected.
 * `requestedDeadlineCalculation`     — if true, rejected.
 * `requestedLegalConclusion`         — if true, rejected.
 * `publicRuntimeRequested`           — if true, rejected.
 * `validationRunId`                  — opaque run ID for this validation.
 * `neverUserVisible`                 — compile-time invariant; must be true.
 * `notes`                            — optional governance notes.
 */
export interface RealTextInputContractInput {
  readonly inputMode: unknown;
  readonly text: unknown;
  readonly sourceKind?: unknown;
  readonly requestedPersistence?: unknown;
  readonly requestedDnaSave?: unknown;
  readonly requestedOfflineSave?: unknown;
  readonly requestedDeadlineCalculation?: unknown;
  readonly requestedLegalConclusion?: unknown;
  readonly publicRuntimeRequested?: unknown;
  readonly validationRunId: string;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Accepted contract ─────────────────────────────────────────────────────────

/**
 * The accepted real text input contract — produced only when all guards pass.
 *
 * `acceptedForRedactionBoundary: true` — text may proceed to the 8.2H-2
 *   redaction boundary only.
 *
 * All further pipeline gates (`acceptedForLLM`, `acceptedForRuntimePipeline`,
 * `acceptedForUserVisibleOutput`) are literal `false` in Phase 8.2H-1.
 * They are only unlocked by downstream phases that implement those stages.
 *
 * All persistence, save, deadline, and legal conclusion flags are literal `false`.
 */
export interface RealTextInputContractAccepted {
  readonly inputMode: RealTextInputMode;
  readonly normalizedText: string;
  readonly originalLength: number;
  readonly normalizedLength: number;
  readonly minLength: typeof REAL_TEXT_INPUT_MIN_LENGTH;
  readonly maxLength: typeof REAL_TEXT_INPUT_MAX_LENGTH;
  readonly acceptedForRedactionBoundary: true;
  readonly acceptedForLLM: false;
  readonly acceptedForRuntimePipeline: false;
  readonly acceptedForUserVisibleOutput: false;
  readonly persistenceAllowed: false;
  readonly dnaSaveAllowed: false;
  readonly offlineSaveAllowed: false;
  readonly deadlineCalculationAllowed: false;
  readonly legalConclusionAllowed: false;
  readonly neverUserVisible: true;
}

// ── Validation result ─────────────────────────────────────────────────────────

/**
 * The result of `runRealTextInputContractValidation`.
 *
 * `accepted` is non-null only when `verdict === "accepted_for_redaction_boundary"`.
 * All safety invariant fields are literal types enforced at compile time.
 */
export interface RealTextInputContractValidationResult {
  readonly validationRunId: string;
  readonly verdict: RealTextInputContractVerdict;
  readonly diagnostics: readonly RealTextInputContractDiagnosticCode[];
  readonly accepted: RealTextInputContractAccepted | null;
  readonly liveLLMCalled: false;
  readonly apiRouteTouched: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}
