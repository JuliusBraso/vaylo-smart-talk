/**
 * Limited Trusted Pilot Gate scaffold (Phase 8.2F-11 / 8.2F-15E OCR provenance /
 * 8.2F-15F pilot telemetry provenance contract).
 *
 * Implements `runLimitedPilotGateScaffold` — a pure function that models
 * whether a hypothetical trusted-pilot transaction would be allowed, blocked,
 * or routed to human review based on structural metadata only.
 *
 * Gate checks (evaluated in order):
 *  1. Subject invite status
 *  2. Subject consent status
 *  3. Session transaction limit
 *  4. Scope constraints (containsRealUserDocument, sourceMode)
 *  5. OCR hard-fail (proceedAllowed === false)
 *  6. OCR human-review trigger (triggersHumanReview === true)
 *  7. All clear → allowed
 *
 * OCR uncertainty evaluation (`evaluateOcrUncertainty`) is always executed
 * so the result is always present for audit purposes, regardless of which
 * earlier gate check may have triggered a blocked/out_of_scope disposition.
 *
 * Safety guarantees:
 * - no real user data accessed
 * - no database reads or writes
 * - no authentication implementation
 * - no consent capture logic
 * - no OCR SDK imported
 * - no LLM calls
 * - no Smart Talk wiring
 * - no pilot activation
 * - no user-visible output generated
 * - all results carry neverUserVisible: true
 */

import type {
  LimitedPilotGateInput,
  LimitedPilotGateResult,
  PilotAccessDisposition,
  PilotGateDiagnosticCode,
  PilotScopeRequest,
  PilotSessionReport,
  PilotSessionReportValidationResult,
} from "./limited-pilot-gate-types";
import type { OcrEvaluationResult } from "./ocr-uncertainty-types";
import {
  evaluateOcrUncertainty,
  evaluateOcrUncertaintyFromQualityReport,
} from "./evaluate-ocr-uncertainty";

export const LIMITED_PILOT_GATE_SCAFFOLD_VERSION =
  "8.2f-15f-limited-pilot-gate-scaffold-v3";

// ── Scope constants ───────────────────────────────────────────────────────────

/**
 * Source modes permitted in the Phase 8.2F-11 pilot scaffold.
 * `"real_document_upload"` is explicitly out of scope.
 */
const ALLOWED_SOURCE_MODES: readonly PilotScopeRequest["sourceMode"][] = [
  "synthetic_only",
  "manual_input",
];

const SAFETY_NOTE =
  "Metadata-only gate scaffold: no pilot activated, no real user accessed, " +
  "no DB read, no OCR SDK, no LLM, no Smart Talk wiring.";

// ── Result builder ────────────────────────────────────────────────────────────

function buildResult(
  transactionAllowed: boolean,
  disposition: PilotAccessDisposition,
  diagnostics: readonly PilotGateDiagnosticCode[],
  ocrEvaluation: OcrEvaluationResult,
  governanceCompromised: boolean,
  notes: readonly string[],
): LimitedPilotGateResult {
  return {
    transactionAllowed,
    disposition,
    diagnostics,
    ocrEvaluation,
    governanceCompromised,
    neverUserVisible: true,
    notes: [...notes, SAFETY_NOTE],
  };
}

// ── Session report validation (Phase 8.2F-15F) ───────────────────────────────

/**
 * Maximum reasonable transaction count for a pilot session scaffold.
 * Values above this cap are treated as structurally invalid.
 * Documented explicitly so future reviewers understand the intent.
 */
const MAX_REASONABLE_TRANSACTION_COUNT = 10_000;

/**
 * Validates a structured `PilotSessionReport` at the governance ingress.
 *
 * Checks only structural integrity — no DB reads, no auth, no session store.
 * Returns `valid: false` when required IDs are blank or numeric fields are
 * outside accepted bounds. Unattested reports are structurally valid but
 * emit an attestation diagnostic.
 *
 * Pure function — no side effects, no DB, no auth, no LLM.
 */
export function validatePilotSessionReport(
  report: PilotSessionReport,
): PilotSessionReportValidationResult {
  const diagnostics: string[] = [];

  if (!report.reportId || report.reportId.trim() === "") {
    diagnostics.push("reportId is empty or blank.");
  }
  if (!report.sequenceId || report.sequenceId.trim() === "") {
    diagnostics.push("sequenceId is empty or blank.");
  }
  if (!report.generatedBy || report.generatedBy.trim() === "") {
    diagnostics.push("generatedBy is empty or blank.");
  }

  const countValid =
    Number.isFinite(report.totalTransactionsThisSession) &&
    report.totalTransactionsThisSession >= 0 &&
    report.totalTransactionsThisSession <= MAX_REASONABLE_TRANSACTION_COUNT;

  if (!countValid) {
    diagnostics.push(
      `totalTransactionsThisSession=${String(report.totalTransactionsThisSession)} is invalid ` +
        `(must be finite, >= 0, and <= ${String(MAX_REASONABLE_TRANSACTION_COUNT)}).`,
    );
  }

  const limitValid =
    Number.isFinite(report.maxSessionLimit) && report.maxSessionLimit > 0;

  if (!limitValid) {
    diagnostics.push(
      `maxSessionLimit=${String(report.maxSessionLimit)} is invalid (must be finite and > 0).`,
    );
  }

  if (report.attestationStatus === "unattested") {
    diagnostics.push(
      "attestationStatus is 'unattested': session telemetry provenance is unverified. " +
        "Downstream consumers should treat this report as caller-supplied metadata.",
    );
  }

  const structuralErrors = diagnostics.filter((d) => !d.includes("unattested"));

  return {
    valid: structuralErrors.length === 0,
    telemetryUsable: countValid && limitValid,
    diagnostics,
    neverUserVisible: true,
  };
}

// ── Effective session telemetry resolution (Phase 8.2F-15F) ──────────────────

/** Internal type representing the resolved session counts used by the gate. */
interface EffectiveSessionTelemetry {
  readonly totalTransactionsThisSession: number;
  readonly maxSessionLimit: number;
  readonly sequenceId: string;
}

/**
 * Resolves effective session telemetry from `sessionReport` (preferred) or
 * raw `telemetry` (backward-compat fallback).
 *
 * Mutates `diagnostics` and `notes` arrays for provenance-gap and error signals.
 *
 * Returns:
 * - `EffectiveSessionTelemetry` if counts are available and usable.
 * - `"invalid"` if a `sessionReport` was present but failed structural validation.
 * - `"missing"` if neither `sessionReport` nor `telemetry` was provided.
 */
function resolveSessionTelemetry(
  input: LimitedPilotGateInput,
  diagnostics: PilotGateDiagnosticCode[],
  notes: string[],
): EffectiveSessionTelemetry | "invalid" | "missing" {
  if (input.sessionReport !== undefined) {
    const validation = validatePilotSessionReport(input.sessionReport);

    // Unattested reports are structurally usable but emit the provenance-gap diagnostic.
    if (input.sessionReport.attestationStatus === "unattested") {
      diagnostics.push("pilot_session_telemetry_unattested");
    }

    if (!validation.telemetryUsable) {
      diagnostics.push("pilot_session_report_invalid");
      notes.push(
        `Pilot session report "${input.sessionReport.reportId}" failed structural validation: ` +
          validation.diagnostics.join("; "),
      );
      return "invalid";
    }

    return {
      totalTransactionsThisSession: input.sessionReport.totalTransactionsThisSession,
      maxSessionLimit: input.sessionReport.maxSessionLimit,
      sequenceId: input.sessionReport.sequenceId,
    };
  }

  if (input.telemetry !== undefined) {
    // Backward-compat path: raw PilotSessionTelemetry without provenance.
    // Emit informational provenance-gap diagnostic; does not block the gate.
    diagnostics.push("pilot_session_telemetry_unattested");
    return {
      totalTransactionsThisSession: input.telemetry.totalTransactionsThisSession,
      maxSessionLimit: input.telemetry.maxSessionLimit,
      sequenceId: input.telemetry.sequenceId,
    };
  }

  // Neither sessionReport nor telemetry provided.
  diagnostics.push("pilot_metadata_incomplete");
  notes.push("No session report or raw telemetry provided. Session limit gate cannot be evaluated.");
  return "missing";
}

// ── Scope violation check ─────────────────────────────────────────────────────

/**
 * Returns a human-internal scope violation reason string if the scope request
 * falls outside the Phase 8.2F-11 pilot scaffold boundaries, or `null` if the
 * scope is acceptable.
 *
 * Scope rules (Phase 8.2F-11):
 * - `containsRealUserDocument === true` is always out of scope (governance breach).
 * - `sourceMode === "real_document_upload"` is out of scope; only `"synthetic_only"`
 *   and `"manual_input"` are permitted.
 */
function detectScopeViolation(scope: PilotScopeRequest): string | null {
  if (scope.containsRealUserDocument === true) {
    return "containsRealUserDocument=true: real user documents are not permitted in the pilot scaffold.";
  }
  if (
    scope.sourceMode !== undefined &&
    !ALLOWED_SOURCE_MODES.includes(scope.sourceMode)
  ) {
    return `sourceMode="${scope.sourceMode}" is not permitted in Phase 8.2F-11; allowed: ${ALLOWED_SOURCE_MODES.filter(Boolean).join(", ")}.`;
  }
  return null;
}

// ── Main gate function ────────────────────────────────────────────────────────

/**
 * Models whether a hypothetical trusted-pilot transaction would be structurally
 * allowed, blocked, routed to human review, or out of scope.
 *
 * OCR uncertainty is always evaluated (via `evaluateOcrUncertainty`) and the
 * result is always included in the output for audit purposes.
 *
 * Pure function — no side effects, no DB, no auth, no OCR SDK, no LLM.
 */
export function runLimitedPilotGateScaffold(
  input: LimitedPilotGateInput,
): LimitedPilotGateResult {
  const diagnostics: PilotGateDiagnosticCode[] = [];
  const earlyNotes: string[] = [];

  // ── OCR confidence resolution (8.2F-15E) ──────────────────────────────────
  // Prefer structured OcrQualityReport over raw baseOcrConfidenceScore.
  // Always evaluated up-front for audit completeness.
  let ocrEvaluation: OcrEvaluationResult;

  if (input.ocrQualityReport !== undefined) {
    ocrEvaluation = evaluateOcrUncertaintyFromQualityReport({
      degradation: input.ocrDegradation,
      qualityReport: input.ocrQualityReport,
    });
  } else {
    diagnostics.push("pilot_ocr_confidence_unattested");
    ocrEvaluation = evaluateOcrUncertainty({
      degradation: input.ocrDegradation,
      baseConfidenceScore: input.baseOcrConfidenceScore ?? 0,
    });
  }

  // ── Session telemetry resolution (8.2F-15F) ───────────────────────────────
  // Prefer structured PilotSessionReport over raw PilotSessionTelemetry.
  // Resolved up-front; invalid reports are caught at Gate 3.
  const sessionResolution = resolveSessionTelemetry(input, diagnostics, earlyNotes);

  // ── Gate 1: Invite check ──────────────────────────────────────────────────
  if (!input.subject.isInvited) {
    diagnostics.push("pilot_unauthorized_subject");
    return buildResult(
      false,
      "blocked",
      diagnostics,
      ocrEvaluation,
      false,
      [...earlyNotes, "Subject is not invited to the pilot. Access denied."],
    );
  }

  // ── Gate 2: Consent check ─────────────────────────────────────────────────
  if (!input.subject.consentSigned) {
    diagnostics.push("pilot_missing_consent");
    return buildResult(
      false,
      "blocked",
      diagnostics,
      ocrEvaluation,
      false,
      [...earlyNotes, "Pilot consent has not been signed. Access denied."],
    );
  }

  // ── Gate 3: Session telemetry validity and limit ──────────────────────────
  if (sessionResolution === "missing" || sessionResolution === "invalid") {
    // Diagnostics already pushed by resolveSessionTelemetry.
    return buildResult(
      false,
      "blocked",
      diagnostics,
      ocrEvaluation,
      false,
      earlyNotes,
    );
  }

  const effectiveTelemetry = sessionResolution;

  if (
    effectiveTelemetry.totalTransactionsThisSession >=
    effectiveTelemetry.maxSessionLimit
  ) {
    diagnostics.push("pilot_session_limit_reached");
    return buildResult(
      false,
      "blocked",
      diagnostics,
      ocrEvaluation,
      false,
      [
        ...earlyNotes,
        `Session limit of ${String(effectiveTelemetry.maxSessionLimit)} reached ` +
          `(current: ${String(effectiveTelemetry.totalTransactionsThisSession)}). Access denied.`,
      ],
    );
  }

  // ── Gate 4: Scope constraints ─────────────────────────────────────────────
  const scopeViolation = detectScopeViolation(input.scopeRequest);
  if (scopeViolation !== null) {
    diagnostics.push("pilot_scope_not_allowed");
    const governanceCompromised =
      input.scopeRequest.containsRealUserDocument === true;
    return buildResult(
      false,
      "out_of_scope",
      diagnostics,
      ocrEvaluation,
      governanceCompromised,
      [
        ...earlyNotes,
        `Scope constraint violated: ${scopeViolation}`,
        ...(governanceCompromised
          ? [
              "GOVERNANCE BREACH: real user document presented to pilot scaffold. " +
                "governanceCompromised=true.",
            ]
          : []),
      ],
    );
  }

  // ── Gate 5: OCR hard fail ─────────────────────────────────────────────────
  if (!ocrEvaluation.proceedAllowed) {
    diagnostics.push("pilot_blocked_by_ocr_degradation");
    return buildResult(
      false,
      "blocked",
      diagnostics,
      ocrEvaluation,
      false,
      [
        ...earlyNotes,
        `OCR evaluation returned disposition="${ocrEvaluation.disposition}" ` +
          `(confidence="${ocrEvaluation.confidence}"). Pipeline must not proceed.`,
      ],
    );
  }

  // ── Gate 6: OCR requires human review ────────────────────────────────────
  if (ocrEvaluation.triggersHumanReview) {
    diagnostics.push("pilot_human_review_required_by_ocr");
    return buildResult(
      true,
      "human_review_required",
      diagnostics,
      ocrEvaluation,
      false,
      [
        ...earlyNotes,
        `OCR evaluation requires human review before output ` +
          `(disposition="${ocrEvaluation.disposition}"). ` +
          "Transaction allowed with mandatory human review.",
      ],
    );
  }

  // ── Gate 7: All clear ─────────────────────────────────────────────────────
  diagnostics.push("pilot_gate_passed");
  return buildResult(
    true,
    "allowed",
    diagnostics,
    ocrEvaluation,
    false,
    [
      ...earlyNotes,
      `All pilot gate checks passed for subject "${input.subject.pilotSubjectRef}". ` +
        `Session: ${String(effectiveTelemetry.totalTransactionsThisSession + 1)}/` +
        `${String(effectiveTelemetry.maxSessionLimit)}. Transaction allowed.`,
    ],
  );
}
