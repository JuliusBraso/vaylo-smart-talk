/**
 * Pilot Evidence Record Model regression scaffold (Phase 8.2J-4).
 *
 * Deterministic, in-memory validation cases for validatePilotEvidenceRecord.
 *
 * No Jest / Vitest / CI hooks.
 * No live LLM calls.
 * No API key required.
 * No persistence.
 * No side effects.
 *
 * Run: import and call runPilotEvidenceRecordModelRegressionScaffold().
 * Returns a typed result with allPassed, scaffoldVersion, caseResults, notes.
 */

import { validatePilotEvidenceRecord } from "./validate-pilot-evidence-record";
import type {
  PilotEvidenceValidationResult,
} from "./pilot-evidence-record-model-types";

// ── Scaffold types ────────────────────────────────────────────────────────────

interface ScaffoldCaseResult {
  readonly caseId: number;
  readonly label: string;
  readonly passed: boolean;
  readonly verdict: string;
  readonly valid: boolean;
  readonly notes: string[];
}

interface ScaffoldResult {
  readonly scaffoldVersion: "8.2J-4-v1";
  readonly allPassed: boolean;
  readonly caseResults: readonly ScaffoldCaseResult[];
  readonly notes: readonly string[];
  readonly liveLLMCalled: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;
}

// ── Fixture helpers ───────────────────────────────────────────────────────────

function basePass(): Record<string, unknown> {
  return {
    pilotRunId: "run-001",
    scenarioId: "SC-01-invoice-guarded",
    reviewerRole: "primary_reviewer",
    reviewVerdict: "pass",
    checklistPassedCount: 24,
    checklistFailedCount: 0,
    escalationReasons: [],
    nonSensitiveReviewerNotes: ["Pipeline produced pass as expected."],
    signedOffBy: "reviewer-001",
    signedOffAtPhase: "final_signoff",
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
    readyForClosureAudit: true,
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
}

function check(
  caseId: number,
  label: string,
  result: PilotEvidenceValidationResult,
  expectValid: boolean,
  expectVerdict: string,
  extraChecks: (r: PilotEvidenceValidationResult) => string[],
): ScaffoldCaseResult {
  const notes: string[] = [];
  let passed = true;

  if (result.valid !== expectValid) {
    notes.push(`Expected valid=${expectValid}, got ${result.valid}`);
    passed = false;
  }
  if (result.verdict !== expectVerdict) {
    notes.push(`Expected verdict '${expectVerdict}', got '${result.verdict}'`);
    passed = false;
  }
  // Safety invariants must always hold
  if (result.liveLLMCalled !== false) { notes.push("liveLLMCalled not false"); passed = false; }
  if (result.persistenceUsed !== false) { notes.push("persistenceUsed not false"); passed = false; }
  if (result.dnaSavePerformed !== false) { notes.push("dnaSavePerformed not false"); passed = false; }
  if (result.offlineSavePerformed !== false) { notes.push("offlineSavePerformed not false"); passed = false; }
  if (result.emittedToUserNow !== false) { notes.push("emittedToUserNow not false"); passed = false; }
  if (result.neverUserVisible !== true) { notes.push("neverUserVisible not true"); passed = false; }

  const extraNotes = extraChecks(result);
  if (extraNotes.length > 0) {
    notes.push(...extraNotes);
    passed = false;
  }

  return { caseId, label, passed, verdict: result.verdict, valid: result.valid, notes };
}

// ── Scaffold runner ───────────────────────────────────────────────────────────

export function runPilotEvidenceRecordModelRegressionScaffold(): ScaffoldResult {
  const cases: ScaffoldCaseResult[] = [];

  // Case 1 — valid pass record
  cases.push(check(1, "valid pass record",
    validatePilotEvidenceRecord({ record: basePass(), validationRunId: "v-001", neverUserVisible: true }),
    true, "valid_evidence_record",
    (r) => {
      const notes: string[] = [];
      if (!r.readyForClosureAudit) notes.push("Expected readyForClosureAudit=true");
      if (r.safeEvidenceRecord === null) notes.push("Expected safeEvidenceRecord to be populated");
      if (r.safeEvidenceRecord?.readyForPersistence !== false) notes.push("Expected readyForPersistence=false");
      if (r.safeEvidenceRecord?.readyForPublicLaunch !== false) notes.push("Expected readyForPublicLaunch=false");
      return notes;
    },
  ));

  // Case 2 — valid pass_with_warning record
  const warningRec = {
    ...basePass(),
    reviewVerdict: "pass_with_warning",
    checklistFailedCount: 1,
    escalationReasons: ["missing_uncertainty_language"],
  };
  cases.push(check(2, "valid pass_with_warning record",
    validatePilotEvidenceRecord({ record: warningRec, validationRunId: "v-002", neverUserVisible: true }),
    true, "valid_evidence_record",
    (r) => {
      const notes: string[] = [];
      if (!r.readyForClosureAudit) notes.push("Expected readyForClosureAudit=true");
      return notes;
    },
  ));

  // Case 3 — valid human_review_required record
  const humanReviewRec = {
    ...basePass(),
    reviewVerdict: "human_review_required",
    checklistFailedCount: 2,
    escalationReasons: ["legal_conclusion_detected"],
  };
  cases.push(check(3, "valid human_review_required record",
    validatePilotEvidenceRecord({ record: humanReviewRec, validationRunId: "v-003", neverUserVisible: true }),
    true, "valid_evidence_record",
    (r) => {
      const notes: string[] = [];
      if (r.safeEvidenceRecord?.escalationReasons.length !== 1) notes.push("Expected 1 escalation reason");
      return notes;
    },
  ));

  // Case 4 — valid blocked record
  const blockedRec = {
    ...basePass(),
    reviewVerdict: "blocked",
    checklistFailedCount: 3,
    escalationReasons: ["raw_value_leak_detected", "expected_block_did_not_happen"],
  };
  cases.push(check(4, "valid blocked record",
    validatePilotEvidenceRecord({ record: blockedRec, validationRunId: "v-004", neverUserVisible: true }),
    true, "valid_evidence_record",
    (r) => {
      const notes: string[] = [];
      if (r.safeEvidenceRecord?.escalationReasons.length !== 2) notes.push("Expected 2 escalation reasons");
      return notes;
    },
  ));

  // Case 5 — invalid missing required field (no scenarioId)
  const missingField = { ...basePass() };
  delete (missingField as Record<string, unknown>)["scenarioId"];
  cases.push(check(5, "invalid missing required field (scenarioId)",
    validatePilotEvidenceRecord({ record: missingField, validationRunId: "v-005", neverUserVisible: true }),
    false, "invalid_missing_required_field",
    () => [],
  ));

  // Case 6 — invalid prohibited field rawInputText
  const withRawInput = { ...basePass(), rawInputText: "some raw text" };
  cases.push(check(6, "invalid prohibited field rawInputText",
    validatePilotEvidenceRecord({ record: withRawInput, validationRunId: "v-006", neverUserVisible: true }),
    false, "invalid_prohibited_field_present",
    (r) => {
      const notes: string[] = [];
      if (!r.prohibitedFieldsDetected.includes("rawInputText")) notes.push("Expected rawInputText in prohibitedFieldsDetected");
      return notes;
    },
  ));

  // Case 7 — invalid unknown field
  const withUnknown = { ...basePass(), myCustomField: "something" };
  cases.push(check(7, "invalid unknown field",
    validatePilotEvidenceRecord({ record: withUnknown, validationRunId: "v-007", neverUserVisible: true }),
    false, "invalid_prohibited_field_present",
    (r) => {
      const notes: string[] = [];
      if (!r.prohibitedFieldsDetected.includes("myCustomField")) notes.push("Expected myCustomField in prohibitedFieldsDetected");
      return notes;
    },
  ));

  // Case 8 — invalid note containing email
  const emailNote = { ...basePass(), nonSensitiveReviewerNotes: ["reviewer.name@example.com was present"] };
  cases.push(check(8, "invalid note containing email",
    validatePilotEvidenceRecord({ record: emailNote, validationRunId: "v-008", neverUserVisible: true }),
    false, "invalid_raw_text_like_note",
    (r) => {
      const notes: string[] = [];
      if (!r.suspiciousNoteSignals.includes("email-like")) notes.push("Expected email-like in suspiciousNoteSignals");
      return notes;
    },
  ));

  // Case 9 — invalid note containing IBAN-like string
  const ibanNote = { ...basePass(), nonSensitiveReviewerNotes: ["Account IBAN DE89370400440532013000 was mentioned"] };
  cases.push(check(9, "invalid note containing IBAN-like string",
    validatePilotEvidenceRecord({ record: ibanNote, validationRunId: "v-009", neverUserVisible: true }),
    false, "invalid_raw_text_like_note",
    (r) => {
      const notes: string[] = [];
      if (r.suspiciousNoteSignals.length === 0) notes.push("Expected at least one suspicious note signal");
      return notes;
    },
  ));

  // Case 10 — invalid note containing API key-like string
  const apiKeyNote = { ...basePass(), nonSensitiveReviewerNotes: ["Used sk-abc123 during test"] };
  cases.push(check(10, "invalid note containing API key-like string",
    validatePilotEvidenceRecord({ record: apiKeyNote, validationRunId: "v-010", neverUserVisible: true }),
    false, "invalid_raw_text_like_note",
    (r) => {
      const notes: string[] = [];
      if (!r.suspiciousNoteSignals.includes("sk-")) notes.push("Expected sk- in suspiciousNoteSignals");
      return notes;
    },
  ));

  // Case 11 — invalid: escalation reason missing for blocked
  const blockedNoReason = { ...basePass(), reviewVerdict: "blocked", checklistFailedCount: 1, escalationReasons: [] };
  cases.push(check(11, "invalid: escalation reason missing for blocked verdict",
    validatePilotEvidenceRecord({ record: blockedNoReason, validationRunId: "v-011", neverUserVisible: true }),
    false, "invalid_escalation_reason_required",
    () => [],
  ));

  // Case 12 — invalid: pass with escalation reasons
  const passWithReasons = { ...basePass(), escalationReasons: ["raw_value_leak_detected"] };
  cases.push(check(12, "invalid: pass verdict with escalation reasons",
    validatePilotEvidenceRecord({ record: passWithReasons, validationRunId: "v-012", neverUserVisible: true }),
    false, "invalid_escalation_reason_required",
    () => [],
  ));

  // Case 13 — invalid checklist counts (total = 0)
  const zeroCounts = { ...basePass(), checklistPassedCount: 0, checklistFailedCount: 0 };
  cases.push(check(13, "invalid checklist counts (passed+failed = 0)",
    validatePilotEvidenceRecord({ record: zeroCounts, validationRunId: "v-013", neverUserVisible: true }),
    false, "invalid_checklist_counts",
    () => [],
  ));

  // Case 14 — invalid public launch claim
  const pubLaunch = { ...basePass(), readyForPublicLaunch: true as unknown as false };
  cases.push(check(14, "invalid public launch claim",
    validatePilotEvidenceRecord({ record: pubLaunch, validationRunId: "v-014", neverUserVisible: true }),
    false, "invalid_public_launch_claim",
    () => [],
  ));

  // Case 15 — invalid persistence claim
  const persisted = { ...basePass(), readyForPersistence: true as unknown as false };
  cases.push(check(15, "invalid persistence claim (readyForPersistence=true)",
    validatePilotEvidenceRecord({ record: persisted, validationRunId: "v-015", neverUserVisible: true }),
    false, "invalid_persistence_claim",
    () => [],
  ));

  // Case 16 — invalid runtime claim (liveLLMCalled=true)
  const llmCalled = { ...basePass(), liveLLMCalled: true as unknown as false };
  cases.push(check(16, "invalid runtime claim (liveLLMCalled=true)",
    validatePilotEvidenceRecord({ record: llmCalled, validationRunId: "v-016", neverUserVisible: true }),
    false, "invalid_runtime_claim",
    () => [],
  ));

  // Case 17 — valid record: safeEvidenceRecord contains no prohibited field keys
  const validResult = validatePilotEvidenceRecord({
    record: basePass(), validationRunId: "v-017", neverUserVisible: true,
  });
  cases.push({
    caseId: 17,
    label: "valid record: safeEvidenceRecord contains no prohibited field keys",
    passed: (() => {
      if (!validResult.valid || !validResult.safeEvidenceRecord) return false;
      const recKeys = Object.keys(
        validResult.safeEvidenceRecord as unknown as Record<string, unknown>,
      );
      const prohibited = ["rawInputText", "redactedText", "fullDraftText", "userPii",
        "screenshotWithPii", "documentImage", "apiKey", "internalSecret", "rawModelOutput"];
      return prohibited.every(k => !recKeys.includes(k));
    })(),
    verdict: validResult.verdict,
    valid: validResult.valid,
    notes: [],
  });

  // Case 18 — all safety invariants on validation result for a successful run
  const invariantResult = validatePilotEvidenceRecord({
    record: basePass(), validationRunId: "v-018", neverUserVisible: true,
  });
  cases.push({
    caseId: 18,
    label: "all safety invariants on validation result",
    passed: (
      invariantResult.liveLLMCalled === false &&
      invariantResult.persistenceUsed === false &&
      invariantResult.dnaSavePerformed === false &&
      invariantResult.offlineSavePerformed === false &&
      invariantResult.emittedToUserNow === false &&
      invariantResult.neverUserVisible === true &&
      invariantResult.apiRouteTouched === false &&
      invariantResult.uiTouched === false
    ),
    verdict: invariantResult.verdict,
    valid: invariantResult.valid,
    notes: [],
  });

  const allPassed = cases.every(c => c.passed);

  return {
    scaffoldVersion: "8.2J-4-v1",
    allPassed,
    caseResults: cases,
    notes: allPassed
      ? ["All 18 regression cases passed. Evidence record model validated."]
      : [`${cases.filter(c => !c.passed).length} case(s) failed.`],
    liveLLMCalled: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    emittedToUserNow: false,
    neverUserVisible: true,
  };
}
