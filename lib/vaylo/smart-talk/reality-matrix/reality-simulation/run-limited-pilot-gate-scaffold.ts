/**
 * Limited Trusted Pilot Gate scaffold (Phase 8.2F-11).
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
} from "./limited-pilot-gate-types";
import type { OcrEvaluationResult } from "./ocr-uncertainty-types";
import { evaluateOcrUncertainty } from "./evaluate-ocr-uncertainty";

export const LIMITED_PILOT_GATE_SCAFFOLD_VERSION =
  "8.2f-11-limited-pilot-gate-scaffold-v1";

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
  // Always evaluate OCR up-front so the result is always present in the
  // output regardless of which gate check fires first.
  const ocrEvaluation = evaluateOcrUncertainty({
    degradation: input.ocrDegradation,
    baseConfidenceScore: input.baseOcrConfidenceScore,
  });

  const diagnostics: PilotGateDiagnosticCode[] = [];

  // ── Gate 1: Invite check ──────────────────────────────────────────────────
  if (!input.subject.isInvited) {
    diagnostics.push("pilot_unauthorized_subject");
    return buildResult(
      false,
      "blocked",
      diagnostics,
      ocrEvaluation,
      false,
      ["Subject is not invited to the pilot. Access denied."],
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
      ["Pilot consent has not been signed. Access denied."],
    );
  }

  // ── Gate 3: Session limit ─────────────────────────────────────────────────
  if (
    input.telemetry.totalTransactionsThisSession >=
    input.telemetry.maxSessionLimit
  ) {
    diagnostics.push("pilot_session_limit_reached");
    return buildResult(
      false,
      "blocked",
      diagnostics,
      ocrEvaluation,
      false,
      [
        `Session limit of ${String(input.telemetry.maxSessionLimit)} reached ` +
          `(current: ${String(input.telemetry.totalTransactionsThisSession)}). Access denied.`,
      ],
    );
  }

  // ── Gate 4: Scope constraints ─────────────────────────────────────────────
  const scopeViolation = detectScopeViolation(input.scopeRequest);
  if (scopeViolation !== null) {
    diagnostics.push("pilot_scope_not_allowed");
    // Real user document presented to pilot scaffold is a governance boundary
    // violation — not just an out-of-scope request.
    const governanceCompromised =
      input.scopeRequest.containsRealUserDocument === true;
    return buildResult(
      false,
      "out_of_scope",
      diagnostics,
      ocrEvaluation,
      governanceCompromised,
      [
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
      `All pilot gate checks passed for subject "${input.subject.pilotSubjectRef}". ` +
        `Session: ${String(input.telemetry.totalTransactionsThisSession + 1)}/` +
        `${String(input.telemetry.maxSessionLimit)}. Transaction allowed.`,
    ],
  );
}
