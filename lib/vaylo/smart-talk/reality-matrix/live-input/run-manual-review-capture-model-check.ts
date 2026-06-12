/**
 * Manual Review Capture Model Check (Phase 8.2L-3).
 *
 * Pure TypeScript implementation of the manual review capture model.
 * Provides:
 *
 * - `buildSyntheticManualReviewCaptureInput()` — safe synthetic input for
 *   contract testing; all safety flags are in their required state.
 * - `validateManualReviewCaptureInput()` — validates a capture input against
 *   all 12 validation rules; returns a safe metadata-only result.
 * - `runManualReviewCaptureModelCheck()` — chains the 8.2L-2 single-run
 *   harness, validates the synthetic input, and runs 15 tamper cases.
 *
 * This module does NOT:
 * - persist review records
 * - store raw text, redacted text, model output, secrets, PII, or document content
 * - call live LLM
 * - make HTTP requests
 * - read process.env
 * - modify API routes or UI
 * - auto-execute at module load time
 *
 * Invoke `runManualReviewCaptureModelCheck()` explicitly.
 */

import {
  FORBIDDEN_MANUAL_REVIEW_STRINGS,
  REQUIRED_MANUAL_REVIEW_CHECKLIST,
} from "./manual-review-capture-model-types";
import type {
  ManualReviewCaptureInput,
  ManualReviewCaptureModelCheckResult,
  ManualReviewCaptureRejectionReason,
  ManualReviewCaptureResult,
  ManualReviewCaptureSignoffPhase,
} from "./manual-review-capture-model-types";
import { runSingleRunExecutionHarness } from "./run-single-run-execution-harness";

// ── Helpers ────────────────────────────────────────────────────────────────────

function asRec(value: unknown): Record<string, unknown> {
  return value as Record<string, unknown>;
}

function addRejection(
  list: ManualReviewCaptureRejectionReason[],
  reason: ManualReviewCaptureRejectionReason,
): void {
  if (!list.includes(reason)) {
    list.push(reason);
  }
}

const VALID_SIGNOFF_PHASES: ManualReviewCaptureSignoffPhase[] = [
  "manual_review",
  "escalation_review",
  "final_review",
];

const ESCALATION_REQUIRED_VERDICTS = [
  "blocked",
  "human_review_required",
  "invalid_test_run",
  "pass_with_warnings",
] as const;

const AUTHORITY_DOC_MARKERS = [
  "Sehr geehrter",
  "Aktenzeichen",
  "IBAN",
  "Steuer-ID",
  "BG-Nr",
] as const;

const PII_PATTERNS = [
  "@",          // email-like
  "+49",        // German phone prefix
] as const;

// ── Synthetic input builder ─────────────────────────────────────────────────────

/**
 * Builds a safe synthetic manual review capture input.
 *
 * All safety flags are in their required false/true state.
 * No raw text, secrets, or PII in reviewer notes.
 */
export function buildSyntheticManualReviewCaptureInput(): ManualReviewCaptureInput {
  return {
    reviewId: "manual-review-8-2l-3",
    pilotRunId: "pilot-run-8-2l-2-single-run",
    pilotScenarioId: "pilot_invoice_basic",
    reviewerId: "internal-reviewer-1",

    singleRunHarnessReady: true,
    reviewVerdict: "pass",
    checklistConfirmed: [...REQUIRED_MANUAL_REVIEW_CHECKLIST],
    checklistPassedCount: REQUIRED_MANUAL_REVIEW_CHECKLIST.length,
    checklistFailedCount: 0,
    escalationReasons: [],
    reviewerNotes: ["synthetic safe manual review note without personal data"],
    signedOffAtPhase: "manual_review",

    containsRawInputText: false,
    containsRedactedText: false,
    containsFullDraftText: false,
    containsModelOutput: false,
    containsSecret: false,
    containsUserPii: false,
    containsDocumentContent: false,

    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    liveLLMCalled: false,
    emittedToUserNow: false,
    userVisibleOutputAllowed: false,

    neverUserVisible: true,
  };
}

// ── Text safety check ───────────────────────────────────────────────────────────

function findForbiddenReviewString(texts: readonly string[]): string | null {
  for (const text of texts) {
    for (const forbidden of FORBIDDEN_MANUAL_REVIEW_STRINGS) {
      if (text.includes(forbidden)) {
        return forbidden;
      }
    }
    for (const marker of AUTHORITY_DOC_MARKERS) {
      if (text.includes(marker)) {
        return marker;
      }
    }
  }
  return null;
}

function hasPiiPattern(texts: readonly string[]): boolean {
  for (const text of texts) {
    for (const pattern of PII_PATTERNS) {
      if (text.includes(pattern)) {
        return true;
      }
    }
  }
  return false;
}

// ── Validator ────────────────────────────────────────────────────────────────

/**
 * Validates a `ManualReviewCaptureInput` against all 12 validation rules.
 *
 * Returns a `ManualReviewCaptureResult` with safe metadata only.
 * No raw text, secrets, or PII are stored in the result.
 */
export function validateManualReviewCaptureInput(
  input: ManualReviewCaptureInput,
): ManualReviewCaptureResult {
  const rejections: ManualReviewCaptureRejectionReason[] = [];
  const rec = asRec(input);

  // Rule 1: singleRunHarnessReady
  if (!input.singleRunHarnessReady) {
    addRejection(rejections, "single_run_harness_not_ready");
  }

  // Rule 2: non-empty ID fields
  if (!input.reviewerId || input.reviewerId.trim().length === 0) {
    addRejection(rejections, "missing_reviewer_id");
  }
  if (!input.pilotRunId || input.pilotRunId.trim().length === 0) {
    addRejection(rejections, "missing_pilot_run_id");
  }
  if (!input.pilotScenarioId || input.pilotScenarioId.trim().length === 0) {
    addRejection(rejections, "missing_pilot_scenario_id");
  }

  // Rule 3: verdict present
  if (!input.reviewVerdict) {
    addRejection(rejections, "missing_review_verdict");
  }

  // Rule 4: all required checklist items present
  const allChecklistPresent = REQUIRED_MANUAL_REVIEW_CHECKLIST.every(
    (item) => input.checklistConfirmed.includes(item),
  );
  if (!allChecklistPresent) {
    addRejection(rejections, "missing_required_checklist_item");
  }

  // Rule 5: checklist count consistency
  const totalExpected = REQUIRED_MANUAL_REVIEW_CHECKLIST.length;
  const countsConsistent =
    input.checklistPassedCount + input.checklistFailedCount === totalExpected;
  if (!countsConsistent) {
    addRejection(rejections, "missing_required_checklist_item");
  }

  // Rule 6: escalation reason required for non-pass verdicts
  const needsEscalation = (
    ESCALATION_REQUIRED_VERDICTS as ReadonlyArray<string>
  ).includes(input.reviewVerdict);
  if (needsEscalation && input.escalationReasons.length === 0) {
    addRejection(rejections, "missing_escalation_reason");
  }

  // Rule 7: valid signoff phase
  if (!(VALID_SIGNOFF_PHASES as ReadonlyArray<string>).includes(input.signedOffAtPhase)) {
    addRejection(rejections, "invalid_signoff_phase");
  }

  // Rule 8: contains* flags must all be false (defensive via asRec)
  if (rec["containsRawInputText"] === true) {
    addRejection(rejections, "forbidden_raw_text_detected");
  }
  if (rec["containsRedactedText"] === true) {
    addRejection(rejections, "forbidden_redacted_text_detected");
  }
  if (rec["containsSecret"] === true) {
    addRejection(rejections, "forbidden_secret_detected");
  }
  if (rec["containsUserPii"] === true) {
    addRejection(rejections, "forbidden_pii_detected");
  }
  if (rec["containsModelOutput"] === true) {
    addRejection(rejections, "forbidden_model_output_detected");
  }
  if (rec["containsDocumentContent"] === true) {
    addRejection(rejections, "forbidden_document_content_detected");
  }

  // Rule 9: persistence/public/live-LLM/user-visible flags must all be false
  if (rec["persistenceUsed"] === true) {
    addRejection(rejections, "persistence_claim_detected");
  }
  if (rec["dnaSavePerformed"] === true) {
    addRejection(rejections, "dna_save_claim_detected");
  }
  if (rec["offlineSavePerformed"] === true) {
    addRejection(rejections, "offline_save_claim_detected");
  }
  if (rec["publicRuntimeEnabled"] === true) {
    addRejection(rejections, "public_runtime_claim_detected");
  }
  if (rec["liveLLMCalled"] === true) {
    addRejection(rejections, "live_llm_claim_detected");
  }
  if (rec["emittedToUserNow"] === true || rec["userVisibleOutputAllowed"] === true) {
    addRejection(rejections, "user_visible_output_claim_detected");
  }

  // Rules 10–12: text safety on notes and escalation reasons
  const allTextFields = [...input.reviewerNotes, ...input.escalationReasons];

  const forbiddenFound = findForbiddenReviewString(allTextFields);
  if (forbiddenFound !== null) {
    // Classify the matched string
    const isSecret =
      forbiddenFound === "synthetic-secret-never-real" ||
      forbiddenFound === "apiKey" ||
      forbiddenFound === "internalSecret";
    const isModelOutput =
      forbiddenFound === "modelOutput" ||
      forbiddenFound === "fullDraftText";
    const isRedacted = forbiddenFound === "redactedText";
    const isRawText = forbiddenFound === "rawInputText" ||
      forbiddenFound === "SYNTHETIC_TEXT_NEVER_REAL_USER_DATA";
    const isAuthorityDoc =
      AUTHORITY_DOC_MARKERS.some((m) => m === forbiddenFound) ||
      forbiddenFound === "IBAN" ||
      forbiddenFound === "Aktenzeichen" ||
      forbiddenFound === "Steuer-ID";
    const isPii =
      forbiddenFound === "john@example.com" ||
      forbiddenFound === "+49 170 1234567";

    if (isSecret) addRejection(rejections, "forbidden_secret_detected");
    else if (isModelOutput) addRejection(rejections, "forbidden_model_output_detected");
    else if (isRedacted) addRejection(rejections, "forbidden_redacted_text_detected");
    else if (isRawText) addRejection(rejections, "forbidden_raw_text_detected");
    else if (isAuthorityDoc) addRejection(rejections, "forbidden_document_content_detected");
    else if (isPii) addRejection(rejections, "forbidden_pii_detected");
    else addRejection(rejections, "reviewer_note_unsafe");
  }

  if (hasPiiPattern(allTextFields)) {
    addRejection(rejections, "forbidden_pii_detected");
  }

  // ── Verdict ──────────────────────────────────────────────────────────────

  const accepted = rejections.length === 0;

  return {
    reviewId: input.reviewId,
    status: accepted ? "valid" : "rejected",
    accepted,
    rejectionReasons: rejections,

    readyForPostExecutionAudit: accepted,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForLiveLLMRuntime: false,
    readyForPersistence: false,

    safeReviewMetadata: {
      pilotRunId: input.pilotRunId,
      pilotScenarioId: input.pilotScenarioId,
      reviewerId: input.reviewerId,
      reviewVerdict: input.reviewVerdict,
      checklistPassedCount: input.checklistPassedCount,
      checklistFailedCount: input.checklistFailedCount,
      signedOffAtPhase: input.signedOffAtPhase,
    },

    rawTextStored: false,
    redactedTextStored: false,
    fullDraftTextStored: false,
    modelOutputStored: false,
    secretStored: false,
    userPiiStored: false,
    documentContentStored: false,

    liveLLMCalled: false,
    apiRouteModifiedByReviewCapture: false,
    uiTouched: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    emittedToUserNow: false,
    neverUserVisible: true,
  };
}

// ── Aggregate check ──────────────────────────────────────────────────────────

/**
 * Runs the full 8.2L-3 manual review capture model check.
 *
 * 1. Calls `runSingleRunExecutionHarness()` and verifies it is ready.
 * 2. Builds and validates the synthetic safe review input.
 * 3. Runs 15 tamper cases and verifies each is rejected.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 */
export function runManualReviewCaptureModelCheck(): ManualReviewCaptureModelCheckResult {
  const notes: string[] = [];

  // ── Step 1: single-run harness readiness ─────────────────────────────────

  const harness = runSingleRunExecutionHarness();
  const harnessRec = asRec(harness);

  const singleRunHarnessReady =
    harness.readyForManualReviewCaptureModel &&
    harnessRec["readyForPilotRunNow"] !== true &&
    harnessRec["readyForPublicLaunch"] !== true &&
    harnessRec["liveLLMCalled"] !== true &&
    harnessRec["persistenceUsed"] !== true &&
    harnessRec["emittedToUserNow"] !== true;

  notes.push(
    `8.2L-2 harness status: ${harness.status}`,
    `readyForManualReviewCaptureModel: ${String(harness.readyForManualReviewCaptureModel)}`,
    `singleRunHarnessReady: ${String(singleRunHarnessReady)}`,
  );

  if (!singleRunHarnessReady) {
    notes.push("FAIL: single-run harness not ready");
    return {
      checkId: "8.2L-3",
      allPassed: false,
      singleRunHarnessReady: false,
      syntheticReviewAccepted: false,
      tamperCasesRejected: false,
      readyForPostExecutionAudit: false,
      readyForPilotRunNow: false,
      readyForPublicLaunch: false,
      readyForLiveLLMRuntime: false,
      readyForPersistence: false,
      liveLLMCalled: false,
      persistenceUsed: false,
      dnaSavePerformed: false,
      offlineSavePerformed: false,
      emittedToUserNow: false,
      neverUserVisible: true,
      notes,
    };
  }

  // ── Step 2: synthetic valid review ────────────────────────────────────────

  const syntheticInput = buildSyntheticManualReviewCaptureInput();
  const syntheticResult = validateManualReviewCaptureInput(syntheticInput);
  const syntheticReviewAccepted = syntheticResult.accepted;

  notes.push(
    `synthetic review status: ${syntheticResult.status}`,
    `syntheticReviewAccepted: ${String(syntheticReviewAccepted)}`,
    syntheticReviewAccepted
      ? "PASS: synthetic review accepted"
      : `FAIL: rejections=${syntheticResult.rejectionReasons.join(",")}`,
  );

  // ── Step 3: tamper cases — each must be rejected ──────────────────────────

  type TamperCase = { label: string; build: () => ManualReviewCaptureInput };

  const base = buildSyntheticManualReviewCaptureInput();

  const tamperCases: TamperCase[] = [
    {
      label: "containsRawInputText true",
      build: () =>
        ({ ...base, containsRawInputText: true }) as unknown as ManualReviewCaptureInput,
    },
    {
      label: "reviewerNotes includes rawInputText",
      build: () => ({ ...base, reviewerNotes: ["rawInputText"] }),
    },
    {
      label: "reviewerNotes includes redactedText",
      build: () => ({ ...base, reviewerNotes: ["redactedText"] }),
    },
    {
      label: "reviewerNotes includes synthetic-secret-never-real",
      build: () => ({ ...base, reviewerNotes: ["synthetic-secret-never-real"] }),
    },
    {
      label: "reviewerNotes includes john@example.com",
      build: () => ({ ...base, reviewerNotes: ["john@example.com"] }),
    },
    {
      label: "reviewerNotes includes +49 170 1234567",
      build: () => ({ ...base, reviewerNotes: ["+49 170 1234567"] }),
    },
    {
      label: "reviewerNotes includes IBAN",
      build: () => ({ ...base, reviewerNotes: ["IBAN"] }),
    },
    {
      label: "persistenceUsed true",
      build: () =>
        ({ ...base, persistenceUsed: true }) as unknown as ManualReviewCaptureInput,
    },
    {
      label: "dnaSavePerformed true",
      build: () =>
        ({ ...base, dnaSavePerformed: true }) as unknown as ManualReviewCaptureInput,
    },
    {
      label: "offlineSavePerformed true",
      build: () =>
        ({ ...base, offlineSavePerformed: true }) as unknown as ManualReviewCaptureInput,
    },
    {
      label: "publicRuntimeEnabled true",
      build: () =>
        ({ ...base, publicRuntimeEnabled: true }) as unknown as ManualReviewCaptureInput,
    },
    {
      label: "liveLLMCalled true",
      build: () =>
        ({ ...base, liveLLMCalled: true }) as unknown as ManualReviewCaptureInput,
    },
    {
      label: "emittedToUserNow true",
      build: () =>
        ({ ...base, emittedToUserNow: true }) as unknown as ManualReviewCaptureInput,
    },
    {
      label: "checklistConfirmed missing one item",
      build: () => ({
        ...base,
        checklistConfirmed: REQUIRED_MANUAL_REVIEW_CHECKLIST.slice(1),
        checklistPassedCount: REQUIRED_MANUAL_REVIEW_CHECKLIST.length - 1,
        checklistFailedCount: 1,
      }),
    },
    {
      label: "reviewVerdict blocked with empty escalationReasons",
      build: () => ({
        ...base,
        reviewVerdict: "blocked" as const,
        escalationReasons: [],
      }),
    },
  ];

  let tamperCasesRejected = true;
  let tamperPassed = 0;
  let tamperFailed = 0;

  for (const tc of tamperCases) {
    const tamperInput = tc.build();
    const tamperResult = validateManualReviewCaptureInput(tamperInput);
    if (tamperResult.accepted) {
      tamperCasesRejected = false;
      tamperFailed += 1;
      notes.push(`TAMPER FAIL (not rejected): ${tc.label}`);
    } else {
      tamperPassed += 1;
    }
  }

  notes.push(
    `tamper cases: ${String(tamperPassed)}/${String(tamperCases.length)} correctly rejected`,
    `tamperCasesRejected: ${String(tamperCasesRejected)}`,
  );

  // ── Aggregate result ─────────────────────────────────────────────────────

  const allPassed =
    singleRunHarnessReady && syntheticReviewAccepted && tamperCasesRejected;

  notes.push(`allPassed: ${String(allPassed)}`);

  return {
    checkId: "8.2L-3",
    allPassed,
    singleRunHarnessReady,
    syntheticReviewAccepted,
    tamperCasesRejected,
    readyForPostExecutionAudit: allPassed,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForLiveLLMRuntime: false,
    readyForPersistence: false,
    liveLLMCalled: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    emittedToUserNow: false,
    neverUserVisible: true,
    notes,
  };
}
