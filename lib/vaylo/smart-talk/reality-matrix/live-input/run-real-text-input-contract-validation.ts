/**
 * Real Text Input Contract Validation (Phase 8.2H-1).
 *
 * Implements `runRealTextInputContractValidation` — a pure, deterministic
 * guard function that validates raw user text before it can proceed to the
 * 8.2H-2 redaction boundary.
 *
 * Validation order:
 *  1. Mode guard          — must be real_text_guarded or real_question_guarded
 *  2. OCR/file guard      — source kind must not be photo/file/document/image
 *  3. Public runtime guard— publicRuntimeRequested must not be true
 *  4. Persistence guard   — requestedPersistence must not be true
 *  5. DNA save guard      — requestedDnaSave must not be true
 *  6. Offline save guard  — requestedOfflineSave must not be true
 *  7. Deadline guard      — requestedDeadlineCalculation must not be true
 *  8. Legal guard         — requestedLegalConclusion must not be true
 *  9. Text type guard     — text must be a non-empty string
 * 10. Length guards       — normalised text [8, 12 000] characters
 *
 * On success, returns `accepted.acceptedForRedactionBoundary: true`.
 * The text is NOT yet accepted for LLM, runtime pipeline, or user-visible output.
 *
 * Safety guarantees:
 * - Raw text is normalised only (trim + CRLF→LF); never semantically inspected
 * - No LLM call, no API/UI touch, no persistence
 * - Pure synchronous function
 */

import type {
  RealTextInputContractAccepted,
  RealTextInputContractDiagnosticCode,
  RealTextInputContractInput,
  RealTextInputContractValidationResult,
  RealTextInputContractVerdict,
  RealTextInputMode,
} from "./real-text-input-contract-types";
import {
  REAL_TEXT_INPUT_MAX_LENGTH,
  REAL_TEXT_INPUT_MIN_LENGTH,
} from "./real-text-input-contract-types";

export const REAL_TEXT_INPUT_CONTRACT_VALIDATION_VERSION =
  "8.2h-1-real-text-input-contract-validation-v1";

/** Source kind values that indicate OCR or file-based input (always rejected). */
const BLOCKED_SOURCE_KINDS = new Set([
  "ocr_photo",
  "file_upload",
  "document_upload",
  "image_upload",
]);

/** Accepted input mode values. */
const ACCEPTED_MODES: ReadonlySet<string> = new Set<RealTextInputMode>([
  "real_text_guarded",
  "real_question_guarded",
]);

// ── Rejected result builder ───────────────────────────────────────────────────

function makeRejected(
  validationRunId: string,
  verdict: RealTextInputContractVerdict,
  diagnostics: RealTextInputContractDiagnosticCode[],
  notes?: string[],
): RealTextInputContractValidationResult {
  return {
    validationRunId,
    verdict,
    diagnostics,
    accepted: null,
    liveLLMCalled: false,
    apiRouteTouched: false,
    uiTouched: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    neverUserVisible: true,
    notes,
  };
}

// ── Main validator ────────────────────────────────────────────────────────────

/**
 * Validates raw real text input against the 8.2H-1 input contract.
 *
 * Returns `accepted_for_redaction_boundary` with a populated `accepted` object
 * when all guards pass. All other paths return a `rejected_*` verdict with
 * `accepted: null`.
 *
 * The accepted text carries `acceptedForLLM: false` and
 * `acceptedForRuntimePipeline: false` — downstream phases are responsible for
 * unlocking those gates when their own guards are in place.
 *
 * Pure function — no side effects, no logging, no external calls.
 */
export function runRealTextInputContractValidation(
  input: RealTextInputContractInput,
): RealTextInputContractValidationResult {
  const { validationRunId } = input;

  const diagnostics: RealTextInputContractDiagnosticCode[] = [
    "real_text_input_validation_started",
    "real_text_input_no_live_llm_confirmed",
    "real_text_input_no_persistence_confirmed",
    "real_text_input_no_dna_save_confirmed",
    "real_text_input_no_offline_save_confirmed",
  ];

  // Guard 1 — Input mode
  if (
    typeof input.inputMode !== "string" ||
    !ACCEPTED_MODES.has(input.inputMode)
  ) {
    diagnostics.push("real_text_input_rejected_unsupported_mode");
    return makeRejected(
      validationRunId,
      "rejected_unsupported_mode",
      diagnostics,
      [`inputMode must be real_text_guarded or real_question_guarded; got: ${String(input.inputMode)}.`],
    );
  }
  const inputMode = input.inputMode as RealTextInputMode;

  // Guard 2 — OCR / file source kind
  if (
    typeof input.sourceKind === "string" &&
    BLOCKED_SOURCE_KINDS.has(input.sourceKind)
  ) {
    diagnostics.push("real_text_input_rejected_ocr_or_file_input");
    return makeRejected(
      validationRunId,
      "rejected_ocr_or_file_input",
      diagnostics,
      [`OCR and file-based source kinds are blocked in 8.2H. sourceKind: ${input.sourceKind}.`],
    );
  }

  // Guard 3 — Public runtime
  if (input.publicRuntimeRequested === true) {
    diagnostics.push("real_text_input_rejected_public_runtime_not_allowed");
    return makeRejected(
      validationRunId,
      "rejected_public_runtime_not_allowed",
      diagnostics,
      ["publicRuntimeRequested must not be true in controlled live input mode."],
    );
  }

  // Guard 4 — Persistence
  if (input.requestedPersistence === true) {
    diagnostics.push("real_text_input_rejected_persistence_requested");
    return makeRejected(
      validationRunId,
      "rejected_persistence_requested",
      diagnostics,
      ["No persistence is allowed in the 8.2H controlled live input pipeline."],
    );
  }

  // Guard 5 — DNA save
  if (input.requestedDnaSave === true) {
    diagnostics.push("real_text_input_rejected_dna_save_requested");
    return makeRejected(
      validationRunId,
      "rejected_dna_save_requested",
      diagnostics,
      ["DNA save is blocked in the 8.2H controlled live input pipeline."],
    );
  }

  // Guard 6 — Offline save
  if (input.requestedOfflineSave === true) {
    diagnostics.push("real_text_input_rejected_offline_save_requested");
    return makeRejected(
      validationRunId,
      "rejected_offline_save_requested",
      diagnostics,
      ["Offline save is blocked in the 8.2H controlled live input pipeline."],
    );
  }

  // Guard 7 — Deadline calculation
  if (input.requestedDeadlineCalculation === true) {
    diagnostics.push("real_text_input_rejected_deadline_calculation_requested");
    return makeRejected(
      validationRunId,
      "rejected_deadline_calculation_requested",
      diagnostics,
      ["Deadline calculation is forbidden by the governance constitution."],
    );
  }

  // Guard 8 — Legal conclusion
  if (input.requestedLegalConclusion === true) {
    diagnostics.push("real_text_input_rejected_legal_conclusion_requested");
    return makeRejected(
      validationRunId,
      "rejected_legal_conclusion_requested",
      diagnostics,
      ["Legal conclusion generation is forbidden by the governance constitution."],
    );
  }

  // Guard 9 — Text type check
  if (typeof input.text !== "string") {
    diagnostics.push("real_text_input_rejected_empty_input");
    return makeRejected(
      validationRunId,
      "rejected_empty_input",
      diagnostics,
      ["input.text must be a string."],
    );
  }

  // Minimal normalisation only — no content rewrite, no redaction, no translation
  const originalLength = input.text.length;
  const normalizedText = input.text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  const normalizedLength = normalizedText.length;

  // Guard 10a — Empty
  if (normalizedLength === 0) {
    diagnostics.push("real_text_input_rejected_empty_input");
    return makeRejected(
      validationRunId,
      "rejected_empty_input",
      diagnostics,
      ["Normalised text is empty after trimming."],
    );
  }

  // Guard 10b — Too short
  if (normalizedLength < REAL_TEXT_INPUT_MIN_LENGTH) {
    diagnostics.push("real_text_input_rejected_too_short");
    return makeRejected(
      validationRunId,
      "rejected_too_short",
      diagnostics,
      [`Text too short: ${String(normalizedLength)} chars (min ${String(REAL_TEXT_INPUT_MIN_LENGTH)}).`],
    );
  }

  // Guard 10c — Too long
  if (normalizedLength > REAL_TEXT_INPUT_MAX_LENGTH) {
    diagnostics.push("real_text_input_rejected_too_long");
    return makeRejected(
      validationRunId,
      "rejected_too_long",
      diagnostics,
      [`Text too long: ${String(normalizedLength)} chars (max ${String(REAL_TEXT_INPUT_MAX_LENGTH)}).`],
    );
  }

  // All guards passed
  diagnostics.push("real_text_input_mode_accepted");
  diagnostics.push("real_text_input_text_length_accepted");
  diagnostics.push("real_text_input_accepted_for_redaction_boundary");

  const accepted: RealTextInputContractAccepted = {
    inputMode,
    normalizedText,
    originalLength,
    normalizedLength,
    minLength: REAL_TEXT_INPUT_MIN_LENGTH,
    maxLength: REAL_TEXT_INPUT_MAX_LENGTH,
    acceptedForRedactionBoundary: true,
    acceptedForLLM: false,
    acceptedForRuntimePipeline: false,
    acceptedForUserVisibleOutput: false,
    persistenceAllowed: false,
    dnaSaveAllowed: false,
    offlineSaveAllowed: false,
    deadlineCalculationAllowed: false,
    legalConclusionAllowed: false,
    neverUserVisible: true,
  };

  return {
    validationRunId,
    verdict: "accepted_for_redaction_boundary",
    diagnostics,
    accepted,
    liveLLMCalled: false,
    apiRouteTouched: false,
    uiTouched: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    neverUserVisible: true,
    notes: [
      `Validation version: ${REAL_TEXT_INPUT_CONTRACT_VALIDATION_VERSION}.`,
      `Mode: ${inputMode}. Normalised length: ${String(normalizedLength)} chars.`,
      "Accepted for redaction boundary only. Not yet accepted for LLM or runtime pipeline.",
    ],
  };
}
