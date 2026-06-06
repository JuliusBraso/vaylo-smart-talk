/**
 * Real Text Redaction Boundary (Phase 8.2H-2).
 *
 * Implements `runRealTextRedactionBoundary` — a pure, deterministic redaction
 * function that takes a `RealTextInputContractAccepted` object and applies
 * conservative pattern-based PII redaction before the text may proceed to the
 * 8.2H-3 controlled live text adapter.
 *
 * Patterns applied (in order):
 *  1. email_address       — [REDACTED_EMAIL]
 *  2. iban                — [REDACTED_IBAN]
 *  3. phone_number        — [REDACTED_PHONE]
 *  4. tax_id_like         — [REDACTED_TAX_ID]
 *  5. case_reference_like — [REDACTED_REFERENCE]
 *  6. postal_address_like — [REDACTED_ADDRESS]
 *  7. date_like           — [REDACTED_DATE]
 *  8. money_amount_like   — [REDACTED_AMOUNT]
 *  9. personal_name_like  — [REDACTED_NAME]
 *
 * Match audit records store only kind, risk level, placeholder, and an
 * incrementing index — never the raw matched string.
 *
 * A post-redaction invariant check re-runs the high-confidence email and IBAN
 * patterns to confirm they are absent from the redacted output.
 *
 * Safety guarantees:
 * - No raw matched values stored in match records
 * - acceptedForLLM: false, acceptedForRuntimePipeline: false (literal)
 * - No external calls, no persistence, pure synchronous function
 */

import type {
  RealTextRedactionBoundaryAccepted,
  RealTextRedactionBoundaryInput,
  RealTextRedactionBoundaryResult,
  RealTextRedactionBoundaryVerdict,
  RealTextRedactionDiagnosticCode,
  RealTextRedactionMatch,
  RealTextRedactionPatternKind,
  RealTextRedactionRiskLevel,
} from "./real-text-redaction-boundary-types";

export const REAL_TEXT_REDACTION_BOUNDARY_VERSION =
  "8.2h-2-real-text-redaction-boundary-v1";

// ── Pattern definitions ───────────────────────────────────────────────────────

interface RedactionRule {
  readonly kind: RealTextRedactionPatternKind;
  readonly riskLevel: RealTextRedactionRiskLevel;
  readonly pattern: RegExp;
  readonly placeholder: string;
}

const REDACTION_RULES: readonly RedactionRule[] = [
  {
    kind: "email_address",
    riskLevel: "medium",
    pattern: /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g,
    placeholder: "[REDACTED_EMAIL]",
  },
  {
    kind: "iban",
    riskLevel: "high",
    // Two uppercase letters + 2 digits + 8–30 alphanumeric/space chars (conservative)
    pattern: /\b[A-Z]{2}\d{2}(?:\s?[A-Z0-9]{4}){2,7}\b/g,
    placeholder: "[REDACTED_IBAN]",
  },
  {
    kind: "phone_number",
    riskLevel: "medium",
    // Optional + or 00, then digit groups separated by space/dash/dot, at least 7 digits total
    pattern: /(?:\+|00)\d{1,3}[\s\-./]?\(?\d{1,5}\)?[\s\-./]?\d{3,5}[\s\-./]?\d{3,8}|\b0\d{2,5}[\s\-./]\d{3,8}(?:[\s\-./]\d{2,6})?\b/g,
    placeholder: "[REDACTED_PHONE]",
  },
  {
    kind: "tax_id_like",
    riskLevel: "high",
    // German Steuer-ID (11 digits) or Steuernummer label + digits/slashes
    pattern: /(?:Steuer(?:nummer|[-\s]?ID|[-\s]?Identifikationsnummer)?|Steuernummer)[\s:]*[\d\s/]{8,18}|\b\d{11}\b/gi,
    placeholder: "[REDACTED_TAX_ID]",
  },
  {
    kind: "case_reference_like",
    riskLevel: "medium",
    pattern: /(?:Aktenzeichen|AZ\.?|BG[-\s]?Nr\.?|Kundennummer|Vorgangsnummer|Gesch[äa]ftszeichen|Bescheid[-\s]?Nr\.?|Vorgang)[\s.:]*[A-Z0-9/_\-]{3,30}/gi,
    placeholder: "[REDACTED_REFERENCE]",
  },
  {
    kind: "postal_address_like",
    riskLevel: "medium",
    // Word + street suffix + house number (conservative)
    pattern: /\b\w+(?:stra[ß|ss]e|str\.|weg|platz|gasse|allee|ring|garten|damm)\s+\d+[a-z]?\b/gi,
    placeholder: "[REDACTED_ADDRESS]",
  },
  {
    kind: "date_like",
    riskLevel: "low",
    // dd.mm.yyyy or yyyy-mm-dd
    pattern: /\b(?:\d{2}\.\d{2}\.\d{4}|\d{4}-\d{2}-\d{2})\b/g,
    placeholder: "[REDACTED_DATE]",
  },
  {
    kind: "money_amount_like",
    riskLevel: "low",
    // Amounts with EUR/€ symbol — e.g. 1.234,56 € or EUR 1234.56
    pattern: /\b\d{1,3}(?:[.\s]\d{3})*(?:,\d{2})?\s*(?:€|EUR)\b|(?:€|EUR)\s*\d{1,3}(?:[.\s]\d{3})*(?:,\d{2})?\b/gi,
    placeholder: "[REDACTED_AMOUNT]",
  },
  {
    kind: "personal_name_like",
    riskLevel: "high",
    // Conservative: titles + two capitalised words (first name + surname)
    pattern: /(?:Herr|Frau|Sehr geehrter Herr|Sehr geehrte Frau|An Herrn?|An Frau)\s+[A-ZÄÖÜ][a-zäöüß]+\s+[A-ZÄÖÜ][a-zäöüß]+/g,
    placeholder: "[REDACTED_NAME]",
  },
];

/** Patterns used in the post-redaction invariant check (high-confidence only). */
const INVARIANT_CHECK_PATTERNS: readonly RegExp[] = [
  /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/,
  /\b[A-Z]{2}\d{2}(?:\s?[A-Z0-9]{4}){2,7}\b/,
];

// ── Rejected result builder ───────────────────────────────────────────────────

function makeRejected(
  redactionRunId: string,
  verdict: RealTextRedactionBoundaryVerdict,
  diagnostics: RealTextRedactionDiagnosticCode[],
  notes?: string[],
): RealTextRedactionBoundaryResult {
  return {
    redactionRunId,
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

// ── Main redaction function ───────────────────────────────────────────────────

/**
 * Applies conservative deterministic PII redaction to validated real text.
 *
 * Input must carry `acceptedForRedactionBoundary: true` from the 8.2H-1
 * input contract validation. Produces a `RealTextRedactionBoundaryAccepted`
 * with `acceptedForControlledLiveAdapter: true` on success.
 *
 * Match audit records contain kind, risk level, and placeholder only —
 * never the raw matched string.
 *
 * Pure function — no external calls, no logging, no persistence.
 */
export function runRealTextRedactionBoundary(
  input: RealTextRedactionBoundaryInput,
): RealTextRedactionBoundaryResult {
  const { redactionRunId } = input;

  const diagnostics: RealTextRedactionDiagnosticCode[] = [
    "redaction_boundary_started",
    "redaction_boundary_no_live_llm_confirmed",
    "redaction_boundary_no_persistence_confirmed",
    "redaction_boundary_no_dna_save_confirmed",
    "redaction_boundary_no_offline_save_confirmed",
  ];

  // Guard — input contract check
  if (
    input.acceptedInput === null ||
    input.acceptedInput.acceptedForRedactionBoundary !== true
  ) {
    diagnostics.push("redaction_boundary_rejected_input_not_accepted");
    return makeRejected(
      redactionRunId,
      "rejected_input_not_accepted_for_redaction",
      diagnostics,
      ["acceptedInput must be a non-null RealTextInputContractAccepted with acceptedForRedactionBoundary: true."],
    );
  }
  diagnostics.push("redaction_boundary_input_contract_confirmed");

  const originalLength = input.acceptedInput.normalizedText.length;
  const sourceText = input.acceptedInput.normalizedText;

  // Apply redaction patterns sequentially
  let workingText = sourceText;
  const matches: RealTextRedactionMatch[] = [];
  let matchIndex = 0;

  for (const rule of REDACTION_RULES) {
    // Reset lastIndex for global patterns on each call
    rule.pattern.lastIndex = 0;
    const replacedText = workingText.replace(rule.pattern, () => {
      // Capture kind/risk/placeholder only — never the raw match
      matches.push({
        kind: rule.kind,
        riskLevel: rule.riskLevel,
        placeholder: rule.placeholder,
        matchIndex,
        neverContainsRawValue: true,
        neverUserVisible: true,
      });
      matchIndex += 1;
      return rule.placeholder;
    });
    workingText = replacedText;
  }

  const redactedText = workingText;
  const redactionApplied = matches.length > 0;

  // High-risk rejection (optional — caller-controlled)
  if (input.rejectHighRiskPatterns === true) {
    const hasHighRisk = matches.some((m) => m.riskLevel === "high");
    if (hasHighRisk) {
      diagnostics.push("redaction_boundary_pattern_detected");
      diagnostics.push("redaction_boundary_rejected_high_risk_pattern");
      return makeRejected(
        redactionRunId,
        "rejected_high_risk_pattern_detected",
        diagnostics,
        [
          "High-risk pattern(s) detected and rejectHighRiskPatterns is true.",
          `High-risk match count: ${String(matches.filter((m) => m.riskLevel === "high").length)}.`,
          "Raw values not stored.",
        ],
      );
    }
  }

  // Empty after redaction
  if (redactedText.trim().length === 0) {
    diagnostics.push("redaction_boundary_rejected_empty_after_redaction");
    return makeRejected(
      redactionRunId,
      "rejected_empty_after_redaction",
      diagnostics,
      ["Redacted text is empty — all content was replaced by placeholders."],
    );
  }

  // Post-redaction invariant check: confirm high-confidence patterns are absent
  for (const checkPattern of INVARIANT_CHECK_PATTERNS) {
    if (checkPattern.test(redactedText)) {
      diagnostics.push("redaction_boundary_rejected_invariant_violation");
      return makeRejected(
        redactionRunId,
        "rejected_redaction_invariant_violation",
        diagnostics,
        [
          "Post-redaction invariant check failed: a high-confidence pattern (email or IBAN) is still present in the redacted output.",
          "This indicates a redaction gap. Input rejected.",
        ],
      );
    }
  }

  // Build diagnostics for success path
  if (redactionApplied) {
    diagnostics.push("redaction_boundary_pattern_detected");
    diagnostics.push("redaction_boundary_redaction_applied");
  } else {
    diagnostics.push("redaction_boundary_no_pattern_detected");
  }
  diagnostics.push("redaction_boundary_accepted_for_controlled_live_adapter");

  const accepted: RealTextRedactionBoundaryAccepted = {
    redactedText,
    originalLength,
    redactedLength: redactedText.length,
    redactionApplied,
    matches,
    acceptedForControlledLiveAdapter: true,
    acceptedForLLM: false,
    acceptedForRuntimePipeline: false,
    acceptedForUserVisibleOutput: false,
    persistenceAllowed: false,
    dnaSaveAllowed: false,
    offlineSaveAllowed: false,
    neverContainsRawDetectedValues: true,
    neverUserVisible: true,
  };

  return {
    redactionRunId,
    verdict: "accepted_for_controlled_live_adapter",
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
      `Redaction version: ${REAL_TEXT_REDACTION_BOUNDARY_VERSION}.`,
      `Redaction run ID: ${redactionRunId}.`,
      `Patterns matched: ${String(matches.length)}. Redaction applied: ${String(redactionApplied)}.`,
      "Accepted for controlled live adapter only. Not yet accepted for LLM or runtime pipeline.",
    ],
  };
}
