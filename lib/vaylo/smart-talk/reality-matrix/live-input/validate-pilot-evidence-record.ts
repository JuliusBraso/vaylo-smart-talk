/**
 * Pure pilot evidence record validator (Phase 8.2J-4).
 *
 * Validates a candidate evidence record against the safety contract defined in
 * pilot-evidence-record-model-types.ts:
 * - Rejects any prohibited field (rawInputText, redactedText, fullDraftText,
 *   userPii, screenshotWithPii, documentImage, apiKey, internalSecret,
 *   rawModelOutput) and any unknown field.
 * - Rejects reviewer notes that contain raw-text-like patterns.
 * - Rejects records missing required fields or with invalid checklist counts.
 * - Requires escalation reasons for hard verdicts (blocked, human_review_required,
 *   invalid_test_run) and rejects them for pass.
 * - Requires final_signoff phase for terminal verdicts.
 * - Validates all literal-false safety invariants.
 *
 * This function:
 * - Does NOT persist anything.
 * - Does NOT call any LLM.
 * - Does NOT modify API routes or UI.
 * - Does NOT log record content.
 * - Always returns liveLLMCalled: false, persistenceUsed: false, etc.
 */

import {
  PILOT_EVIDENCE_ALLOWED_FIELDS,
  PILOT_EVIDENCE_PROHIBITED_FIELDS,
  PILOT_EVIDENCE_RAW_TEXT_LIKE_NOTE_PATTERNS,
  type PilotEvidenceEscalationReason,
  type PilotEvidenceRecord,
  type PilotEvidenceReviewerRole,
  type PilotEvidenceReviewVerdict,
  type PilotEvidenceSignedOffAtPhase,
  type PilotEvidenceValidationDiagnosticCode,
  type PilotEvidenceValidationInput,
  type PilotEvidenceValidationResult,
  type PilotEvidenceValidationVerdict,
} from "./pilot-evidence-record-model-types";

// ── Valid enum sets ───────────────────────────────────────────────────────────

const VALID_REVIEW_VERDICTS: ReadonlySet<string> = new Set<string>([
  "pass",
  "pass_with_warning",
  "human_review_required",
  "blocked",
  "invalid_test_run",
]);

const VALID_REVIEWER_ROLES: ReadonlySet<string> = new Set<string>([
  "primary_reviewer",
  "secondary_reviewer",
  "safety_observer",
  "technical_observer",
]);

const VALID_SIGNED_OFF_PHASES: ReadonlySet<string> = new Set<string>([
  "pre_run",
  "scenario_execution",
  "output_review",
  "escalation_review",
  "final_signoff",
]);

const VALID_ESCALATION_REASONS: ReadonlySet<string> = new Set<string>([
  "raw_value_leak_detected",
  "unredacted_pii_detected",
  "internal_metadata_leak_detected",
  "legal_conclusion_detected",
  "deadline_certainty_detected",
  "hallucinated_authority_or_amount",
  "false_reassurance_detected",
  "panic_language_detected",
  "missing_uncertainty_language",
  "persistence_or_save_attempt_detected",
  "public_runtime_exposure_detected",
  "unexpected_llm_call_detected",
  "expected_block_did_not_happen",
  "expected_human_review_did_not_happen",
]);

// ── Invariant base for all results ────────────────────────────────────────────

const RESULT_INVARIANTS = {
  liveLLMCalled: false,
  apiRouteTouched: false,
  uiTouched: false,
  persistenceUsed: false,
  dnaSavePerformed: false,
  offlineSavePerformed: false,
  emittedToUserNow: false,
  neverUserVisible: true,
} as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

function unsafeRead(obj: Record<string, unknown>, key: string): unknown {
  return (obj as Record<string, unknown>)[key];
}

function makeInvalid(
  validationRunId: string,
  verdict: PilotEvidenceValidationVerdict,
  diagnostics: PilotEvidenceValidationDiagnosticCode[],
  prohibitedFieldsDetected: string[],
  suspiciousNoteSignals: string[],
  notes?: readonly string[],
): PilotEvidenceValidationResult {
  return {
    validationRunId,
    verdict,
    diagnostics,
    valid: false,
    readyForClosureAudit: false,
    safeEvidenceRecord: null,
    prohibitedFieldsDetected,
    suspiciousNoteSignals,
    ...RESULT_INVARIANTS,
    notes,
  };
}

// ── Main validator ────────────────────────────────────────────────────────────

/**
 * Validates a candidate pilot evidence record.
 *
 * Pure function — no side effects, no persistence, no LLM calls.
 * Always returns safety invariants as literal false/true.
 */
export function validatePilotEvidenceRecord(
  input: PilotEvidenceValidationInput,
): PilotEvidenceValidationResult {
  const { validationRunId } = input;

  const diagnostics: PilotEvidenceValidationDiagnosticCode[] = [
    "pilot_evidence_validation_started",
    "pilot_evidence_no_live_llm_confirmed",
    "pilot_evidence_no_api_ui_confirmed",
    "pilot_evidence_no_persistence_confirmed",
    "pilot_evidence_no_dna_save_confirmed",
    "pilot_evidence_no_offline_save_confirmed",
  ];

  const prohibitedFieldsDetected: string[] = [];
  const suspiciousNoteSignals: string[] = [];

  // ── 1. Input must be a non-null object ────────────────────────────────────

  if (
    input.record === null ||
    typeof input.record !== "object" ||
    Array.isArray(input.record)
  ) {
    diagnostics.push("pilot_evidence_invalid_missing_required_field");
    return makeInvalid(
      validationRunId,
      "invalid_missing_required_field",
      diagnostics,
      prohibitedFieldsDetected,
      suspiciousNoteSignals,
      ["Record must be a non-null, non-array object."],
    );
  }

  const rec = input.record as Record<string, unknown>;
  const keys = Object.keys(rec);

  // ── 2. Prohibited field check ─────────────────────────────────────────────

  for (const key of keys) {
    if (PILOT_EVIDENCE_PROHIBITED_FIELDS.includes(key)) {
      prohibitedFieldsDetected.push(key);
    }
  }

  if (prohibitedFieldsDetected.length > 0) {
    diagnostics.push("pilot_evidence_invalid_prohibited_field_present");
    return makeInvalid(
      validationRunId,
      "invalid_prohibited_field_present",
      diagnostics,
      prohibitedFieldsDetected,
      suspiciousNoteSignals,
      ["Prohibited fields present in record."],
    );
  }

  // ── 3. Unknown field check (any key not in allowed set) ───────────────────

  const unknownFields: string[] = [];
  for (const key of keys) {
    if (!PILOT_EVIDENCE_ALLOWED_FIELDS.has(key)) {
      unknownFields.push(key);
      prohibitedFieldsDetected.push(key);
    }
  }

  if (unknownFields.length > 0) {
    diagnostics.push("pilot_evidence_invalid_prohibited_field_present");
    return makeInvalid(
      validationRunId,
      "invalid_prohibited_field_present",
      diagnostics,
      prohibitedFieldsDetected,
      suspiciousNoteSignals,
      ["Unknown fields present in record; treat as unsafe."],
    );
  }

  diagnostics.push("pilot_evidence_no_prohibited_fields");
  diagnostics.push("pilot_evidence_allowed_fields_only");

  // ── 4. Required fields ────────────────────────────────────────────────────

  const pilotRunId = unsafeRead(rec, "pilotRunId");
  const scenarioId = unsafeRead(rec, "scenarioId");
  const reviewerRole = unsafeRead(rec, "reviewerRole");
  const reviewVerdict = unsafeRead(rec, "reviewVerdict");
  const checklistPassedCount = unsafeRead(rec, "checklistPassedCount");
  const checklistFailedCount = unsafeRead(rec, "checklistFailedCount");
  const escalationReasons = unsafeRead(rec, "escalationReasons");
  const nonSensitiveReviewerNotes = unsafeRead(rec, "nonSensitiveReviewerNotes");
  const signedOffBy = unsafeRead(rec, "signedOffBy");
  const signedOffAtPhase = unsafeRead(rec, "signedOffAtPhase");

  if (
    typeof pilotRunId !== "string" || pilotRunId.trim() === "" ||
    typeof scenarioId !== "string" || scenarioId.trim() === "" ||
    typeof reviewerRole !== "string" || !VALID_REVIEWER_ROLES.has(reviewerRole) ||
    typeof reviewVerdict !== "string" || !VALID_REVIEW_VERDICTS.has(reviewVerdict) ||
    !Array.isArray(escalationReasons) ||
    !Array.isArray(nonSensitiveReviewerNotes) ||
    typeof signedOffBy !== "string" || signedOffBy.trim() === "" ||
    typeof signedOffAtPhase !== "string" || !VALID_SIGNED_OFF_PHASES.has(signedOffAtPhase)
  ) {
    diagnostics.push("pilot_evidence_invalid_missing_required_field");
    return makeInvalid(
      validationRunId,
      "invalid_missing_required_field",
      diagnostics,
      prohibitedFieldsDetected,
      suspiciousNoteSignals,
      ["One or more required fields are missing or invalid."],
    );
  }

  diagnostics.push("pilot_evidence_required_fields_present");

  // ── 5. Checklist counts ───────────────────────────────────────────────────

  const passed = checklistPassedCount;
  const failed = checklistFailedCount;

  if (
    typeof passed !== "number" ||
    typeof failed !== "number" ||
    !Number.isFinite(passed) ||
    !Number.isFinite(failed) ||
    passed < 0 ||
    failed < 0 ||
    passed + failed === 0
  ) {
    diagnostics.push("pilot_evidence_invalid_checklist_counts");
    return makeInvalid(
      validationRunId,
      "invalid_checklist_counts",
      diagnostics,
      prohibitedFieldsDetected,
      suspiciousNoteSignals,
      ["checklistPassedCount + checklistFailedCount must be > 0 and both >= 0."],
    );
  }

  // "pass" verdict requires zero failed items
  if (reviewVerdict === "pass" && failed !== 0) {
    diagnostics.push("pilot_evidence_invalid_checklist_counts");
    return makeInvalid(
      validationRunId,
      "invalid_checklist_counts",
      diagnostics,
      prohibitedFieldsDetected,
      suspiciousNoteSignals,
      ["Verdict 'pass' requires checklistFailedCount === 0."],
    );
  }

  diagnostics.push("pilot_evidence_checklist_counts_valid");

  // ── 6. Escalation reasons ─────────────────────────────────────────────────

  const escalationArray = escalationReasons as unknown[];

  // All escalation reason values must be from the known set
  for (const reason of escalationArray) {
    if (typeof reason !== "string" || !VALID_ESCALATION_REASONS.has(reason)) {
      diagnostics.push("pilot_evidence_invalid_escalation_reason_required");
      return makeInvalid(
        validationRunId,
        "invalid_escalation_reason_required",
        diagnostics,
        prohibitedFieldsDetected,
        suspiciousNoteSignals,
        [`Unknown escalation reason value: ${String(reason)}`],
      );
    }
  }

  // Hard verdicts require at least one escalation reason
  const hardVerdicts: Set<string> = new Set([
    "human_review_required",
    "blocked",
    "invalid_test_run",
  ]);

  if (hardVerdicts.has(reviewVerdict) && escalationArray.length === 0) {
    diagnostics.push("pilot_evidence_invalid_escalation_reason_required");
    return makeInvalid(
      validationRunId,
      "invalid_escalation_reason_required",
      diagnostics,
      prohibitedFieldsDetected,
      suspiciousNoteSignals,
      [`Verdict '${reviewVerdict}' requires at least one escalation reason.`],
    );
  }

  // "pass" verdict must have empty escalation reasons
  if (reviewVerdict === "pass" && escalationArray.length > 0) {
    diagnostics.push("pilot_evidence_invalid_escalation_reason_required");
    return makeInvalid(
      validationRunId,
      "invalid_escalation_reason_required",
      diagnostics,
      prohibitedFieldsDetected,
      suspiciousNoteSignals,
      ["Verdict 'pass' must have no escalation reasons."],
    );
  }

  diagnostics.push("pilot_evidence_escalation_reason_present_when_required");

  // ── 7. Sign-off phase ─────────────────────────────────────────────────────

  const terminalVerdicts: Set<string> = new Set([
    "pass",
    "pass_with_warning",
    "human_review_required",
    "blocked",
  ]);

  if (terminalVerdicts.has(reviewVerdict) && signedOffAtPhase !== "final_signoff") {
    diagnostics.push("pilot_evidence_invalid_signoff_missing");
    return makeInvalid(
      validationRunId,
      "invalid_signoff_missing",
      diagnostics,
      prohibitedFieldsDetected,
      suspiciousNoteSignals,
      [`Verdict '${reviewVerdict}' requires signedOffAtPhase === 'final_signoff'.`],
    );
  }

  if (
    reviewVerdict === "invalid_test_run" &&
    signedOffAtPhase !== "escalation_review" &&
    signedOffAtPhase !== "final_signoff"
  ) {
    diagnostics.push("pilot_evidence_invalid_signoff_missing");
    return makeInvalid(
      validationRunId,
      "invalid_signoff_missing",
      diagnostics,
      prohibitedFieldsDetected,
      suspiciousNoteSignals,
      ["Verdict 'invalid_test_run' must be signed at escalation_review or final_signoff."],
    );
  }

  diagnostics.push("pilot_evidence_signoff_valid");

  // ── 8. Safety invariant flags ─────────────────────────────────────────────

  const sensitiveContainsFlags = [
    "containsRawInputText",
    "containsRedactedText",
    "containsFullDraftText",
    "containsUserPii",
    "containsScreenshotWithPii",
    "containsDocumentImage",
    "containsApiKey",
    "containsInternalSecret",
    "containsRawModelOutput",
  ] as const;

  for (const flag of sensitiveContainsFlags) {
    if (unsafeRead(rec, flag) !== false) {
      diagnostics.push("pilot_evidence_invalid_prohibited_field_present");
      return makeInvalid(
        validationRunId,
        "invalid_prohibited_field_present",
        diagnostics,
        prohibitedFieldsDetected,
        suspiciousNoteSignals,
        [`Safety flag '${flag}' must be false.`],
      );
    }
  }

  if (unsafeRead(rec, "readyForPublicLaunch") !== false) {
    diagnostics.push("pilot_evidence_invalid_public_launch_claim");
    return makeInvalid(
      validationRunId,
      "invalid_public_launch_claim",
      diagnostics,
      prohibitedFieldsDetected,
      suspiciousNoteSignals,
      ["readyForPublicLaunch must be false."],
    );
  }

  if (
    unsafeRead(rec, "readyForPersistence") !== false ||
    unsafeRead(rec, "persistenceUsed") !== false ||
    unsafeRead(rec, "dnaSavePerformed") !== false ||
    unsafeRead(rec, "offlineSavePerformed") !== false
  ) {
    diagnostics.push("pilot_evidence_invalid_persistence_claim");
    return makeInvalid(
      validationRunId,
      "invalid_persistence_claim",
      diagnostics,
      prohibitedFieldsDetected,
      suspiciousNoteSignals,
      ["Persistence flags must all be false."],
    );
  }

  if (
    unsafeRead(rec, "liveLLMCalled") !== false ||
    unsafeRead(rec, "emittedToUserNow") !== false
  ) {
    diagnostics.push("pilot_evidence_invalid_runtime_claim");
    return makeInvalid(
      validationRunId,
      "invalid_runtime_claim",
      diagnostics,
      prohibitedFieldsDetected,
      suspiciousNoteSignals,
      ["liveLLMCalled and emittedToUserNow must be false."],
    );
  }

  // ── 9. Reviewer notes safety ──────────────────────────────────────────────

  const notesArray = nonSensitiveReviewerNotes as unknown[];

  for (const note of notesArray) {
    if (typeof note !== "string") {
      diagnostics.push("pilot_evidence_invalid_raw_text_like_note");
      return makeInvalid(
        validationRunId,
        "invalid_raw_text_like_note",
        diagnostics,
        prohibitedFieldsDetected,
        suspiciousNoteSignals,
        ["All nonSensitiveReviewerNotes items must be strings."],
      );
    }
    for (const { label, pattern } of PILOT_EVIDENCE_RAW_TEXT_LIKE_NOTE_PATTERNS) {
      if (pattern.test(note)) {
        suspiciousNoteSignals.push(label);
      }
    }
  }

  if (suspiciousNoteSignals.length > 0) {
    diagnostics.push("pilot_evidence_invalid_raw_text_like_note");
    return makeInvalid(
      validationRunId,
      "invalid_raw_text_like_note",
      diagnostics,
      prohibitedFieldsDetected,
      suspiciousNoteSignals,
      ["Reviewer notes contain raw-text-like content. Remove and resubmit."],
    );
  }

  diagnostics.push("pilot_evidence_notes_safe");

  // ── 10. Build safe evidence record ───────────────────────────────────────

  const readyForClosureAudit =
    reviewVerdict === "pass" ||
    reviewVerdict === "pass_with_warning" ||
    reviewVerdict === "human_review_required" ||
    reviewVerdict === "blocked";

  const safeEvidenceRecord: PilotEvidenceRecord = {
    pilotRunId: pilotRunId as string,
    scenarioId: scenarioId as string,
    reviewerRole: reviewerRole as PilotEvidenceReviewerRole,
    reviewVerdict: reviewVerdict as PilotEvidenceReviewVerdict,
    checklistPassedCount: passed as number,
    checklistFailedCount: failed as number,
    escalationReasons: (escalationArray as string[]) as readonly PilotEvidenceEscalationReason[],
    nonSensitiveReviewerNotes: notesArray as readonly string[],
    signedOffBy: signedOffBy as string,
    signedOffAtPhase: signedOffAtPhase as PilotEvidenceSignedOffAtPhase,

    containsRawInputText: false,
    containsRedactedText: false,
    containsFullDraftText: false,
    containsUserPii: false,
    containsScreenshotWithPii: false,
    containsDocumentImage: false,
    containsApiKey: false,
    containsInternalSecret: false,
    containsRawModelOutput: false,

    readyForPersistence: false,
    readyForClosureAudit,
    readyForPublicLaunch: false,

    liveLLMCalled: false,
    apiRouteModified: false,
    uiTouched: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    emittedToUserNow: false,
    neverUserVisible: true,
  };

  diagnostics.push("pilot_evidence_ready_for_closure_audit");

  return {
    validationRunId,
    verdict: "valid_evidence_record",
    diagnostics,
    valid: true,
    readyForClosureAudit,
    safeEvidenceRecord,
    prohibitedFieldsDetected: [],
    suspiciousNoteSignals: [],
    ...RESULT_INVARIANTS,
  };
}
