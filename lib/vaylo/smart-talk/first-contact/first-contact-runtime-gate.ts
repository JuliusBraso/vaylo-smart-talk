/**
 * PHASE 8.12C — Smart Talk First Contact Runtime Gate
 *
 * Pure, deterministic, synchronous authorization gate for the First
 * Contact ("Prvý kontakt") mode. Converts raw, already-parsed route
 * inputs into a single allow/deny decision plus normalized, server-owned
 * context — WITHOUT ever calling a model, calling OCR, touching
 * DB/Storage/DNA, mutating global/environment state, inferring market
 * from locale, or authorizing anything beyond a single request.
 *
 * This module intentionally does NOT read `process.env` itself — the
 * caller (the route) resolves the exact `SMART_TALK_FIRST_CONTACT_MODE_ENABLED
 * === "true"` flag and passes the boolean result in as `enabled`. This
 * keeps the gate a pure function of its inputs, fully unit-testable
 * without any environment mutation.
 *
 * Deny-by-default: every branch below defaults to `allowed: false`. The
 * single `allowed: true` branch is reached only after every other check
 * has passed.
 */

export type FirstContactScenario =
  | "first_job"
  | "first_housing"
  | "first_official_letter"
  | "health_insurance"
  | "taxes_or_tax_id"
  | "education_or_training"
  | "moving_or_registration"
  | "family_administration"
  | "residence_or_work"
  | "other";

export const FIRST_CONTACT_SCENARIOS: readonly FirstContactScenario[] = [
  "first_job",
  "first_housing",
  "first_official_letter",
  "health_insurance",
  "taxes_or_tax_id",
  "education_or_training",
  "moving_or_registration",
  "family_administration",
  "residence_or_work",
  "other",
];

const FIRST_CONTACT_SCENARIO_SET = new Set<string>(FIRST_CONTACT_SCENARIOS);

/** Germany-first only (Phase 8.12B market plan, Option B). Austria remains future-only. */
export type FirstContactMarket = "DE";

export const FIRST_CONTACT_SUPPORTED_MARKETS: readonly FirstContactMarket[] = ["DE"];

const FIRST_CONTACT_SUPPORTED_MARKET_SET = new Set<string>(FIRST_CONTACT_SUPPORTED_MARKETS);

export type FirstContactTrustLevel = "untrusted";

export type FirstContactRecommendedMode =
  | "text_document_controlled_runtime"
  | "photo_ocr_controlled_runtime"
  | null;

export type FirstContactRuntimeGateCode =
  | "first_contact_allowed"
  | "first_contact_mode_disabled"
  | "first_contact_not_explicitly_selected"
  | "first_contact_input_too_short"
  | "first_contact_input_too_long"
  | "first_contact_locale_unsupported"
  | "first_contact_market_unsupported"
  | "first_contact_scenario_unsupported"
  | "first_contact_document_mode_required"
  | "first_contact_photo_ocr_mode_required"
  | "first_contact_paid_document_boundary"
  | "first_contact_persistence_forbidden";

/**
 * Every field the gate needs to reach a decision. All values are already
 * extracted/parsed by the caller (the route) — this module performs no
 * JSON parsing, no header/query inspection, and no environment reads.
 */
export type FirstContactRuntimeGateInput = {
  /** Exact `process.env.SMART_TALK_FIRST_CONTACT_MODE_ENABLED === "true"`, resolved by the caller. */
  enabled: boolean;
  /** True only when the caller's request body explicitly selected the First Contact route mode. */
  explicitlySelected: boolean;
  text: string;
  locale: string;
  /** The route's current locale allowlist (reused verbatim — no new locales are added here). */
  allowedLocales: readonly string[];
  /** The route's current MIN_TEXT, reused verbatim — no new hard limit is invented. */
  minTextLength: number;
  /** The route's current MAX_TEXT, reused verbatim — no new hard limit is invented. */
  maxTextLength: number;
  market: string;
  scenario?: string | null;
  /** Computed by the caller via the existing `detectTextDocumentBypassRequired` heuristic. */
  documentInterpretationRequested: boolean;
  /** Computed by the caller from existing OCR/photo/scanner/file-upload request-body signals. */
  photoOrFilePresent: boolean;
  /** Computed by the caller via the existing `detectClientPaidDocumentModeActivation` guard. */
  paidDocumentBoundaryTriggered: boolean;
  /** Computed by the caller from existing persistence/DNA/storage request-body signals. */
  persistenceRequested: boolean;
};

export type FirstContactRuntimeGateOutput = {
  allowed: boolean;
  code: FirstContactRuntimeGateCode;
  reason: string;
  normalizedText: string | null;
  normalizedLocale: string | null;
  normalizedMarket: FirstContactMarket | null;
  normalizedScenario: FirstContactScenario | null;
  recommendedMode: FirstContactRecommendedMode;
  trustLevel: FirstContactTrustLevel;
  requiredWarnings: readonly string[];
  evidenceLimitations: readonly string[];
};

const FIRST_CONTACT_REQUIRED_WARNINGS: readonly string[] = [
  "This is general first-time orientation only, not legal advice and not a verified official decision.",
];

const FIRST_CONTACT_EVIDENCE_LIMITATIONS: readonly string[] = [
  "No document, photo, or file was interpreted for this request.",
  "Market context is server-bounded to Germany (DE) only; no other jurisdiction is verified.",
  "Model output remains untrusted and has not been reviewed by an authority or a human.",
];

function denied(
  code: FirstContactRuntimeGateCode,
  reason: string,
  recommendedMode: FirstContactRecommendedMode = null,
): FirstContactRuntimeGateOutput {
  return {
    allowed: false,
    code,
    reason,
    normalizedText: null,
    normalizedLocale: null,
    normalizedMarket: null,
    normalizedScenario: null,
    recommendedMode,
    trustLevel: "untrusted",
    requiredWarnings: FIRST_CONTACT_REQUIRED_WARNINGS,
    evidenceLimitations: FIRST_CONTACT_EVIDENCE_LIMITATIONS,
  };
}

/**
 * Pure decision function. Same input always produces the same output.
 * No I/O, no environment reads, no model/OCR/DB/Storage/DNA access.
 */
export function runFirstContactRuntimeGate(
  input: FirstContactRuntimeGateInput,
): FirstContactRuntimeGateOutput {
  if (!input.enabled) {
    return denied("first_contact_mode_disabled", "First Contact mode is disabled server-side.");
  }

  if (!input.explicitlySelected) {
    return denied(
      "first_contact_not_explicitly_selected",
      "First Contact requires explicit mode selection; no implicit selection or fallback is permitted.",
    );
  }

  const trimmedText = typeof input.text === "string" ? input.text.trim() : "";

  if (trimmedText.length === 0 || trimmedText.length < input.minTextLength) {
    return denied("first_contact_input_too_short", "Input text is shorter than the minimum required length.");
  }
  if (trimmedText.length > input.maxTextLength) {
    return denied("first_contact_input_too_long", "Input text exceeds the maximum allowed length.");
  }

  if (!input.allowedLocales.includes(input.locale)) {
    return denied("first_contact_locale_unsupported", "The requested locale is not currently supported.");
  }

  if (!FIRST_CONTACT_SUPPORTED_MARKET_SET.has(input.market)) {
    return denied(
      "first_contact_market_unsupported",
      "Only the Germany (DE) market is supported by First Contact in this phase.",
    );
  }

  let normalizedScenario: FirstContactScenario | null = null;
  if (input.scenario !== undefined && input.scenario !== null) {
    if (!FIRST_CONTACT_SCENARIO_SET.has(input.scenario)) {
      return denied(
        "first_contact_scenario_unsupported",
        "The requested scenario identifier is not on the supported allowlist.",
      );
    }
    normalizedScenario = input.scenario as FirstContactScenario;
  }

  if (input.documentInterpretationRequested) {
    return denied(
      "first_contact_document_mode_required",
      "This request requires interpreting pasted document text; First Contact does not interpret documents.",
      "text_document_controlled_runtime",
    );
  }

  if (input.photoOrFilePresent) {
    return denied(
      "first_contact_photo_ocr_mode_required",
      "This request includes a photo or file; First Contact does not process images or files.",
      "photo_ocr_controlled_runtime",
    );
  }

  if (input.paidDocumentBoundaryTriggered) {
    return denied(
      "first_contact_paid_document_boundary",
      "This request attempts to activate paid document-mode behavior, which First Contact never provides for free.",
    );
  }

  if (input.persistenceRequested) {
    return denied(
      "first_contact_persistence_forbidden",
      "First Contact is anonymous and ephemeral; persistence, storage, or DNA requests are never honored.",
    );
  }

  return {
    allowed: true,
    code: "first_contact_allowed",
    reason: "Request satisfies all First Contact gate requirements.",
    normalizedText: trimmedText,
    normalizedLocale: input.locale,
    normalizedMarket: "DE",
    normalizedScenario,
    recommendedMode: null,
    trustLevel: "untrusted",
    requiredWarnings: FIRST_CONTACT_REQUIRED_WARNINGS,
    evidenceLimitations: FIRST_CONTACT_EVIDENCE_LIMITATIONS,
  };
}
