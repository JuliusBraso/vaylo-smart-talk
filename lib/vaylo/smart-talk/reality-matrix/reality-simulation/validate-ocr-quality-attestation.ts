/**
 * OCR Quality Attestation Validator (Phase 8.2F-15K).
 *
 * Implements `validateOcrQualityAttestation` — a pure function that evaluates
 * an `OcrQualityAttestationRecord` and returns a never-user-visible
 * `OcrQualityAttestationValidationResult` indicating structural validity and
 * two trust tiers: pilot trust and production trust.
 *
 * Validation rules (all applied; diagnostics accumulated, not short-circuited):
 *
 *  Rule 1 — attestationId must be non-blank:
 *    Failure: `ocr_attestation_missing_id` → valid = false.
 *
 *  Rule 2 — reportId must be non-blank:
 *    Failure: `ocr_attestation_missing_report_id` → valid = false.
 *
 *  Rule 3 — generatedBy must be non-blank:
 *    Failure: `ocr_attestation_missing_generated_by` → valid = false.
 *
 *  Rule 4 — issuerKind === "unknown":
 *    Diagnostic: `ocr_attestation_unknown_issuer` (soft; does not fail valid).
 *    Prevents trustedForProduction.
 *
 *  Rule 5 — storeKind === "none":
 *    Diagnostic: `ocr_attestation_no_store` (soft; does not fail valid).
 *    Prevents trustedForProduction.
 *
 *  Rule 6 — verificationStatus === "failed":
 *    Failure: `ocr_attestation_failed` → valid = false.
 *
 *  Rule 7 — verificationStatus === "unverifiable":
 *    Diagnostic: `ocr_attestation_unverified` (soft; does not fail valid).
 *    Prevents trustedForProduction.
 *
 *  Rule 8 — lifecycleStatus === "rejected":
 *    Failure: `ocr_attestation_rejected` → valid = false.
 *
 *  Rule 9 — lifecycleStatus === "expired":
 *    Diagnostic: `ocr_attestation_expired` (soft; does not fail valid).
 *    Prevents trustedForPilot and trustedForProduction.
 *
 *  Rule 10 — lifecycleStatus === "superseded":
 *    Diagnostic: `ocr_attestation_superseded` (soft; does not fail valid).
 *    Prevents trustedForPilot and trustedForProduction.
 *
 *  Rule 11 — trustedForPilot:
 *    true iff valid AND lifecycleStatus === "validated"
 *    AND verificationStatus is "verified" or "not_applicable".
 *
 *  Rule 12 — trustedForProduction:
 *    true iff trustedForPilot AND verificationStatus === "verified"
 *    AND storeKind !== "none" AND issuerKind !== "unknown".
 *
 * Safety guarantees:
 * - no OCR SDK imported
 * - no image processing
 * - no LLM calls
 * - no persistence
 * - no logging
 * - no telemetry
 * - no runtime hooks
 * - no Smart Talk connection
 * - all results carry neverUserVisible: true
 */

import type {
  OcrQualityAttestationRecord,
  OcrQualityAttestationValidationDiagnostic,
  OcrQualityAttestationValidationResult,
} from "./ocr-quality-attestation-types";

export const OCR_QUALITY_ATTESTATION_VALIDATOR_VERSION =
  "8.2f-15k-ocr-quality-attestation-validator-v1";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns true if the string is non-null, non-undefined, and non-blank. */
function isNonBlank(value: string | undefined | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

// ── Main validator ─────────────────────────────────────────────────────────────

/**
 * Validates an `OcrQualityAttestationRecord` and returns a never-user-visible
 * `OcrQualityAttestationValidationResult` with `valid`, `trustedForPilot`,
 * `trustedForProduction`, and accumulated `diagnostics`.
 *
 * Pure function — no side effects, no persistence, no logging, no telemetry,
 * no OCR SDK, no LLM, no runtime hooks.
 */
export function validateOcrQualityAttestation(
  record: OcrQualityAttestationRecord,
): OcrQualityAttestationValidationResult {
  const diagnostics: OcrQualityAttestationValidationDiagnostic[] = [];
  let hardFailure = false;

  // ── Rule 1 — attestationId must be non-blank ──────────────────────────────

  if (!isNonBlank(record.attestationId)) {
    diagnostics.push("ocr_attestation_missing_id");
    hardFailure = true;
  }

  // ── Rule 2 — reportId must be non-blank ───────────────────────────────────

  if (!isNonBlank(record.reportId)) {
    diagnostics.push("ocr_attestation_missing_report_id");
    hardFailure = true;
  }

  // ── Rule 3 — generatedBy must be non-blank ────────────────────────────────

  if (!isNonBlank(record.generatedBy)) {
    diagnostics.push("ocr_attestation_missing_generated_by");
    hardFailure = true;
  }

  // ── Rule 4 — unknown issuer (soft warning) ────────────────────────────────

  const hasUnknownIssuer = record.issuerKind === "unknown";
  if (hasUnknownIssuer) {
    diagnostics.push("ocr_attestation_unknown_issuer");
  }

  // ── Rule 5 — no store reference (soft warning) ────────────────────────────

  const hasNoStore = record.storeKind === "none";
  if (hasNoStore) {
    diagnostics.push("ocr_attestation_no_store");
  }

  // ── Rule 6 — verification failed (hard failure) ───────────────────────────

  const verificationFailed = record.verificationStatus === "failed";
  if (verificationFailed) {
    diagnostics.push("ocr_attestation_failed");
    hardFailure = true;
  }

  // ── Rule 7 — verification unverifiable (soft warning) ────────────────────

  const verificationUnverifiable = record.verificationStatus === "unverifiable";
  if (verificationUnverifiable) {
    diagnostics.push("ocr_attestation_unverified");
  }

  // ── Rule 8 — lifecycle rejected (hard failure) ────────────────────────────

  const lifecycleRejected = record.lifecycleStatus === "rejected";
  if (lifecycleRejected) {
    diagnostics.push("ocr_attestation_rejected");
    hardFailure = true;
  }

  // ── Rule 9 — lifecycle expired (soft; blocks trust) ──────────────────────

  const lifecycleExpired = record.lifecycleStatus === "expired";
  if (lifecycleExpired) {
    diagnostics.push("ocr_attestation_expired");
  }

  // ── Rule 10 — lifecycle superseded (soft; blocks trust) ──────────────────

  const lifecycleSuperseded = record.lifecycleStatus === "superseded";
  if (lifecycleSuperseded) {
    diagnostics.push("ocr_attestation_superseded");
  }

  // ── Rules 11–12 — trust tiers ─────────────────────────────────────────────

  const valid = !hardFailure;

  // trustedForPilot: valid + lifecycle validated + verification acceptable.
  // Acceptable verification for pilot: "verified" OR "not_applicable"
  // (synthetic fixtures with `fixture_declared` method legitimately use not_applicable).
  const verificationAcceptableForPilot =
    record.verificationStatus === "verified" ||
    record.verificationStatus === "not_applicable";

  const trustedForPilot =
    valid &&
    record.lifecycleStatus === "validated" &&
    verificationAcceptableForPilot &&
    !lifecycleExpired &&
    !lifecycleSuperseded;

  // trustedForProduction: stricter — verified (not just not_applicable) +
  // real store reference + known issuer.
  const trustedForProduction =
    trustedForPilot &&
    record.verificationStatus === "verified" &&
    !hasNoStore &&
    !hasUnknownIssuer;

  // ── Notes ─────────────────────────────────────────────────────────────────

  const notes: string[] = [];
  if (valid && trustedForProduction) {
    notes.push(
      "Record is valid and fully trusted for both pilot and production use.",
    );
  } else if (valid && trustedForPilot) {
    notes.push(
      "Record is valid and trusted for pilot use. Not trusted for production " +
        "(requires verified engine + real store reference + known issuer).",
    );
  } else if (valid) {
    notes.push(
      "Record is structurally valid but not trusted for pilot or production use.",
    );
  } else {
    // Count hard failures that were accumulated
    const hardFailureCount =
      (diagnostics.includes("ocr_attestation_missing_id") ? 1 : 0) +
      (diagnostics.includes("ocr_attestation_missing_report_id") ? 1 : 0) +
      (diagnostics.includes("ocr_attestation_missing_generated_by") ? 1 : 0) +
      (diagnostics.includes("ocr_attestation_failed") ? 1 : 0) +
      (diagnostics.includes("ocr_attestation_rejected") ? 1 : 0);
    notes.push(
      `Record is invalid: ${String(hardFailureCount)} hard failure(s) detected.`,
    );
  }
  notes.push(
    "Validator is metadata-only: no OCR processing, no DB access, no persistence, no logging.",
  );

  return {
    valid,
    trustedForPilot,
    trustedForProduction,
    diagnostics,
    neverUserVisible: true,
    notes,
  };
}
