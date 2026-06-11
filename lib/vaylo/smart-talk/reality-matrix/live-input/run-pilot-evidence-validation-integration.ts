/**
 * Pilot Evidence Validation Integration (Phase 8.2K-4).
 *
 * A pure TypeScript integration layer proving that a guarded pilot runtime
 * response can be transformed into a safe PilotEvidenceRecord validation
 * input and validated by the existing 8.2J-4 evidence validator.
 *
 * SAFETY CONTRACT:
 * - Does NOT import or call app/api/smart-talk/route.ts
 * - Does NOT make HTTP requests
 * - Does NOT call live LLM
 * - Does NOT persist anything
 * - Does NOT read process.env
 * - Does NOT store evidence
 * - Does NOT emit user-visible output
 * - Uses only synthetic IDs, scenario IDs, reviewer IDs, and notes
 * - Never includes raw input text, redacted text, PII, or secrets in evidence
 *
 * Chain proven:
 *   PilotRuntimeResponse-shaped result
 *   → safe evidence record mapping
 *   → validatePilotEvidenceRecord()
 *   → internal-only validation result
 *   → no raw text / secret / PII / persistence leak
 *
 * runPilotEvidenceValidationIntegration() is exported but NOT auto-executed.
 * Requires 8.2K-3 harness (runPilotRuntimeE2EHarness) to pass before the
 * integration summary reports allPassed: true.
 */

import { validatePilotEvidenceRecord } from "./validate-pilot-evidence-record";
import type { PilotEvidenceValidationInput } from "./pilot-evidence-record-model-types";
import { runPilotRuntimeE2EHarness } from "./run-pilot-runtime-e2e-harness";
import type {
  PilotEvidenceValidationIntegrationCaseKind,
  PilotEvidenceValidationIntegrationCaseResult,
  PilotEvidenceValidationIntegrationSummary,
  PilotEvidenceValidationIntegrationVerdict,
} from "./pilot-evidence-validation-integration-types";

// ── Synthetic constants (never real values) ───────────────────────────────────

const INTEGRATION_SYNTHETIC_SECRET = "synthetic-secret-never-real" as const;
const INJECTED_RAW_TEXT = "injected-raw-text-must-be-rejected" as const;
const INJECTED_REDACTED_TEXT = "injected-redacted-text-must-be-rejected" as const;

// ── Ordered case catalogue ────────────────────────────────────────────────────

const ALL_INTEGRATION_CASES: readonly PilotEvidenceValidationIntegrationCaseKind[] = [
  "authorised_runtime_response_to_valid_evidence",
  "blocked_runtime_response_to_valid_evidence",
  "human_review_runtime_response_to_valid_evidence",
  "invalid_request_runtime_response_to_valid_evidence",
  "raw_text_tamper_rejected",
  "redacted_text_tamper_rejected",
  "secret_tamper_rejected",
  "user_pii_tamper_rejected",
  "persistence_flag_tamper_rejected",
  "public_runtime_flag_tamper_rejected",
  "emitted_to_user_tamper_rejected",
  "missing_signoff_tamper_rejected",
  "missing_escalation_reason_tamper_rejected",
];

// ── Local synthetic runtime response model ────────────────────────────────────

interface SyntheticPilotRuntimeResponse {
  pilotRunId: string;
  pilotScenarioId: string;
  reviewerId: string;
  responseKind:
    | "authorised_internal_packet"
    | "blocked"
    | "human_review_required"
    | "invalid_request";
  emittedToUserNow: false;
  userVisibleOutputAllowed: false;
  publicRuntimeEnabled: false;
  liveLLMCalled: false;
  persistenceUsed: false;
  dnaSavePerformed: false;
  offlineSavePerformed: false;
  neverUserVisible: true;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

type IntegrationResponseKind =
  | "authorised_internal_packet"
  | "blocked"
  | "human_review_required"
  | "invalid_request";

function caseToResponseKind(
  kind: PilotEvidenceValidationIntegrationCaseKind,
): IntegrationResponseKind {
  switch (kind) {
    case "blocked_runtime_response_to_valid_evidence":
    case "missing_escalation_reason_tamper_rejected":
      return "blocked";
    case "human_review_runtime_response_to_valid_evidence":
      return "human_review_required";
    case "invalid_request_runtime_response_to_valid_evidence":
      return "invalid_request";
    default:
      return "authorised_internal_packet";
  }
}

function caseToExpectedVerdict(
  kind: PilotEvidenceValidationIntegrationCaseKind,
): PilotEvidenceValidationIntegrationVerdict {
  switch (kind) {
    case "authorised_runtime_response_to_valid_evidence":
    case "blocked_runtime_response_to_valid_evidence":
    case "human_review_runtime_response_to_valid_evidence":
    case "invalid_request_runtime_response_to_valid_evidence":
      return "valid";
    default:
      return "rejected";
  }
}

function mapResponseKindToReviewVerdict(
  responseKind: IntegrationResponseKind,
): "pass" | "blocked" | "human_review_required" | "invalid_test_run" {
  switch (responseKind) {
    case "authorised_internal_packet":
      return "pass";
    case "blocked":
      return "blocked";
    case "human_review_required":
      return "human_review_required";
    case "invalid_request":
      return "invalid_test_run";
  }
}

// ── Synthetic runtime response factory ───────────────────────────────────────

/**
 * Produces a synthetic pilot runtime response for a given integration case.
 * No real user data, no secrets, no PII.
 */
function makeSyntheticPilotRuntimeResponse(
  kind: PilotEvidenceValidationIntegrationCaseKind,
): SyntheticPilotRuntimeResponse {
  return {
    pilotRunId: "pilot-run-8-2k-4",
    pilotScenarioId: "pilot_invoice_basic",
    reviewerId: "internal-reviewer-1",
    responseKind: caseToResponseKind(kind),
    emittedToUserNow: false,
    userVisibleOutputAllowed: false,
    publicRuntimeEnabled: false,
    liveLLMCalled: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    neverUserVisible: true,
  };
}

// ── Evidence record mapper ────────────────────────────────────────────────────

/**
 * Maps a synthetic runtime response to the raw record object that will be
 * passed to validatePilotEvidenceRecord().
 *
 * Mapping rules:
 * - authorised_internal_packet → reviewVerdict "pass"
 * - blocked                   → reviewVerdict "blocked" + escalation reason
 * - human_review_required     → reviewVerdict "human_review_required" + escalation reason
 * - invalid_request           → reviewVerdict "invalid_test_run" + escalation reason
 *
 * Fields NOT included: rawInputText, redactedText, fullDraftText, modelOutput,
 * secret, user PII, screenshots, document images, API keys.
 */
function mapRuntimeResponseToPilotEvidenceValidationInput(
  response: SyntheticPilotRuntimeResponse,
): Record<string, unknown> {
  const reviewVerdict = mapResponseKindToReviewVerdict(response.responseKind);
  const isHardVerdict =
    reviewVerdict === "blocked" ||
    reviewVerdict === "human_review_required" ||
    reviewVerdict === "invalid_test_run";

  const escalationReasons: string[] = isHardVerdict
    ? ["internal_metadata_leak_detected"]
    : [];
  const checklistFailedCount = isHardVerdict ? 1 : 0;
  const signedOffAtPhase =
    reviewVerdict === "invalid_test_run" ? "escalation_review" : "final_signoff";

  return {
    pilotRunId: response.pilotRunId,
    scenarioId: response.pilotScenarioId,
    reviewerRole: "primary_reviewer",
    reviewVerdict,
    checklistPassedCount: 1,
    checklistFailedCount,
    escalationReasons,
    nonSensitiveReviewerNotes: [
      "synthetic internal validation note without personal data",
    ],
    signedOffBy: response.reviewerId,
    signedOffAtPhase,
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
    readyForClosureAudit: false,
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

// ── Tamper injection ──────────────────────────────────────────────────────────

/**
 * Applies exactly one tamper to the base record object.
 * Valid cases return the base unmodified.
 * Each tamper targets a specific validator check path.
 */
function applyTampers(
  caseKind: PilotEvidenceValidationIntegrationCaseKind,
  base: Record<string, unknown>,
): Record<string, unknown> {
  switch (caseKind) {
    case "raw_text_tamper_rejected":
      // Prohibited field: rawInputText → validator step 2 rejects
      return { ...base, rawInputText: INJECTED_RAW_TEXT };

    case "redacted_text_tamper_rejected":
      // Prohibited field: redactedText → validator step 2 rejects
      return { ...base, redactedText: INJECTED_REDACTED_TEXT };

    case "secret_tamper_rejected":
      // Prohibited field: internalSecret → validator step 2 rejects
      // Value is INTEGRATION_SYNTHETIC_SECRET; validator never echoes the value
      return { ...base, internalSecret: INTEGRATION_SYNTHETIC_SECRET };

    case "user_pii_tamper_rejected":
      // PII email in reviewer notes → validator step 9 raw-text-like pattern rejects
      return { ...base, nonSensitiveReviewerNotes: ["john@example.com"] };

    case "persistence_flag_tamper_rejected":
      // persistenceUsed: true → validator step 8 persistence check rejects
      return { ...base, persistenceUsed: true };

    case "public_runtime_flag_tamper_rejected":
      // readyForPublicLaunch: true → validator step 8 public launch check rejects
      return { ...base, readyForPublicLaunch: true };

    case "emitted_to_user_tamper_rejected":
      // emittedToUserNow: true → validator step 8 runtime claim check rejects
      return { ...base, emittedToUserNow: true };

    case "missing_signoff_tamper_rejected":
      // Base reviewVerdict is "pass"; "pre_run" ≠ "final_signoff" → step 7 rejects
      return { ...base, signedOffAtPhase: "pre_run" };

    case "missing_escalation_reason_tamper_rejected":
      // Base reviewVerdict is "blocked"; empty escalationReasons → step 6 rejects
      return { ...base, escalationReasons: [] };

    default:
      return base;
  }
}

// ── Per-case runner ───────────────────────────────────────────────────────────

/**
 * Runs a single integration case end-to-end:
 * synthetic runtime response → mapped record → tamper → validate → check.
 */
function runPilotEvidenceValidationIntegrationCase(
  caseKind: PilotEvidenceValidationIntegrationCaseKind,
): PilotEvidenceValidationIntegrationCaseResult {
  // 1. Build synthetic runtime response
  const syntheticResponse = makeSyntheticPilotRuntimeResponse(caseKind);

  // 2. Map to base evidence record object
  let recordObj = mapRuntimeResponseToPilotEvidenceValidationInput(syntheticResponse);

  // 3. Apply tamper (no-op for valid cases)
  recordObj = applyTampers(caseKind, recordObj);

  // 4. Build validation input
  const validationInput: PilotEvidenceValidationInput = {
    record: recordObj,
    validationRunId: `val-run-8-2k-4-${caseKind}`,
    neverUserVisible: true,
  };

  // 5. Call validator — pure function, no side effects
  const validationResult = validatePilotEvidenceRecord(validationInput);

  // 6. Determine expected vs actual verdict
  const expectedVerdict = caseToExpectedVerdict(caseKind);
  const actualVerdict: PilotEvidenceValidationIntegrationVerdict =
    validationResult.valid ? "valid" : "rejected";

  // 7. Leak checks on validation result only (never on the input record)
  //    The validator never echoes prohibited field values — only key names.
  const resultStr = JSON.stringify(validationResult);
  const rawTextLeakCheckPassed = !resultStr.includes(INJECTED_RAW_TEXT);
  const redactedTextLeakCheckPassed = !resultStr.includes(INJECTED_REDACTED_TEXT);
  const secretLeakCheckPassed = !resultStr.includes(INTEGRATION_SYNTHETIC_SECRET);
  const userPiiLeakCheckPassed =
    !resultStr.includes("john@example.com") &&
    !resultStr.includes("+49 170 1234567");

  // 8. Safety invariant checks — use index access to avoid TS2367 on literal types
  const vrRec = validationResult as unknown as Record<string, unknown>;
  const persistenceCheckPassed =
    vrRec["persistenceUsed"] !== true &&
    vrRec["dnaSavePerformed"] !== true &&
    vrRec["offlineSavePerformed"] !== true;
  const publicRuntimeCheckPassed =
    vrRec["publicRuntimeEnabled"] !== true &&
    vrRec["readyForPublicLaunch"] !== true;
  const emittedToUserCheckPassed = vrRec["emittedToUserNow"] !== true;
  const liveLLMCheckPassed = vrRec["liveLLMCalled"] !== true;

  const passed =
    expectedVerdict === actualVerdict &&
    rawTextLeakCheckPassed &&
    redactedTextLeakCheckPassed &&
    secretLeakCheckPassed &&
    userPiiLeakCheckPassed &&
    persistenceCheckPassed &&
    publicRuntimeCheckPassed &&
    emittedToUserCheckPassed &&
    liveLLMCheckPassed;

  const notes: string[] = [];
  if (expectedVerdict !== actualVerdict) {
    notes.push(
      `verdict mismatch: expected ${expectedVerdict}, got ${actualVerdict}`,
    );
    notes.push(`validator verdict: ${validationResult.verdict}`);
  }
  if (!rawTextLeakCheckPassed) notes.push("RAW TEXT LEAK in validation result");
  if (!redactedTextLeakCheckPassed)
    notes.push("REDACTED TEXT LEAK in validation result");
  if (!secretLeakCheckPassed) notes.push("SECRET LEAK in validation result");
  if (!userPiiLeakCheckPassed) notes.push("PII LEAK in validation result");
  if (!persistenceCheckPassed) notes.push("Persistence flag not false");
  if (!publicRuntimeCheckPassed) notes.push("Public runtime flag not false");
  if (!emittedToUserCheckPassed) notes.push("emittedToUserNow not false");
  if (!liveLLMCheckPassed) notes.push("liveLLMCalled not false");
  if (passed) {
    notes.push(
      `${actualVerdict} as expected — validator verdict: ${validationResult.verdict}`,
    );
  }

  return {
    caseKind,
    passed,
    expectedVerdict,
    actualVerdict,
    pilotRuntimeResponseKind: syntheticResponse.responseKind,
    evidenceValidationAttempted: true,
    evidenceValidationAccepted: validationResult.valid,
    rawTextLeakCheckPassed,
    redactedTextLeakCheckPassed,
    secretLeakCheckPassed,
    userPiiLeakCheckPassed,
    persistenceCheckPassed,
    publicRuntimeCheckPassed,
    emittedToUserCheckPassed,
    liveLLMCheckPassed,
    notes,
  };
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Runs the full pilot evidence validation integration.
 *
 * Covers:
 * - 4 valid response-kind paths (authorised, blocked, human-review, invalid-request)
 * - 9 tamper rejection paths (raw text, redacted text, secret, PII, persistence,
 *   public runtime, emitted-to-user, missing signoff, missing escalation reason)
 *
 * Also runs runPilotRuntimeE2EHarness() from 8.2K-3 — allPassed requires
 * both the 13 integration cases AND the 8.2K-3 harness to pass.
 *
 * Returns PilotEvidenceValidationIntegrationSummary.
 * Does NOT auto-execute on module load.
 * Does NOT call the API route.
 * Does NOT make HTTP requests.
 * Does NOT call live LLM.
 * Does NOT persist anything.
 */
export function runPilotEvidenceValidationIntegration(): PilotEvidenceValidationIntegrationSummary {
  // Verify 8.2K-3 E2E harness passes before reporting allPassed
  const e2eHarness = runPilotRuntimeE2EHarness();
  const e2eHarnessPassed = e2eHarness.allPassed;

  const caseResults = ALL_INTEGRATION_CASES.map((kind) =>
    runPilotEvidenceValidationIntegrationCase(kind),
  );

  const passedCases = caseResults.filter((c) => c.passed).length;
  const failedCases = caseResults.length - passedCases;
  const allPassed = failedCases === 0 && e2eHarnessPassed;

  const authorisedRuntimeResponseCovered = caseResults.some(
    (c) =>
      c.caseKind === "authorised_runtime_response_to_valid_evidence" && c.passed,
  );
  const blockedRuntimeResponseCovered = caseResults.some(
    (c) =>
      c.caseKind === "blocked_runtime_response_to_valid_evidence" && c.passed,
  );
  const humanReviewRuntimeResponseCovered = caseResults.some(
    (c) =>
      c.caseKind === "human_review_runtime_response_to_valid_evidence" &&
      c.passed,
  );
  const invalidRequestRuntimeResponseCovered = caseResults.some(
    (c) =>
      c.caseKind === "invalid_request_runtime_response_to_valid_evidence" &&
      c.passed,
  );
  const tamperRejectionCovered = caseResults
    .filter((c) => c.caseKind.endsWith("_tamper_rejected"))
    .every((c) => c.passed);

  return {
    integrationId: "8.2K-4",
    integrationVersion: "pilot-evidence-validation-integration-v1",
    totalCases: caseResults.length,
    passedCases,
    failedCases,
    allPassed,
    authorisedRuntimeResponseCovered,
    blockedRuntimeResponseCovered,
    humanReviewRuntimeResponseCovered,
    invalidRequestRuntimeResponseCovered,
    tamperRejectionCovered,
    rawTextLeakCheckPassed: caseResults.every((c) => c.rawTextLeakCheckPassed),
    redactedTextLeakCheckPassed: caseResults.every(
      (c) => c.redactedTextLeakCheckPassed,
    ),
    secretLeakCheckPassed: caseResults.every((c) => c.secretLeakCheckPassed),
    userPiiLeakCheckPassed: caseResults.every((c) => c.userPiiLeakCheckPassed),
    persistenceCheckPassed: caseResults.every((c) => c.persistenceCheckPassed),
    publicRuntimeCheckPassed: caseResults.every(
      (c) => c.publicRuntimeCheckPassed,
    ),
    emittedToUserCheckPassed: caseResults.every(
      (c) => c.emittedToUserCheckPassed,
    ),
    liveLLMCheckPassed: caseResults.every((c) => c.liveLLMCheckPassed),
    liveLLMCalled: false,
    apiRouteModifiedByIntegration: false,
    uiTouched: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    emittedToUserNow: false,
    neverUserVisible: true,
    caseResults,
  };
}
