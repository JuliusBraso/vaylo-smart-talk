/**
 * Pilot Session Attestation Validator (Phase 8.2F-15L).
 *
 * Implements `validatePilotSessionAttestation` — a pure function that evaluates
 * a `PilotSessionAttestationRecord` and returns a never-user-visible
 * `PilotSessionAttestationValidationResult` indicating structural validity and
 * two trust tiers: pilot trust and production trust.
 *
 * Validation rules (all applied; diagnostics accumulated, not short-circuited):
 *
 *  Rule 1 — attestationId must be non-blank:
 *    Failure: `pilot_session_attestation_missing_id` → valid = false.
 *
 *  Rule 2 — reportId must be non-blank:
 *    Failure: `pilot_session_attestation_missing_report_id` → valid = false.
 *
 *  Rule 3 — generatedBy must be non-blank:
 *    Failure: `pilot_session_attestation_missing_generated_by` → valid = false.
 *
 *  Rule 4 — issuerKind === "unknown":
 *    Diagnostic: `pilot_session_attestation_unknown_issuer` (soft; does not fail valid).
 *    Prevents trustedForProduction.
 *
 *  Rule 5 — storeKind === "none":
 *    Diagnostic: `pilot_session_attestation_no_store` (soft; does not fail valid).
 *    Prevents trustedForProduction.
 *
 *  Rule 6 — verificationStatus === "failed":
 *    Failure: `pilot_session_attestation_failed` → valid = false.
 *
 *  Rule 7 — verificationStatus === "unverifiable":
 *    Diagnostic: `pilot_session_attestation_unverified` (soft; does not fail valid).
 *    Prevents trustedForProduction.
 *
 *  Rule 8 — lifecycleStatus === "rejected":
 *    Failure: `pilot_session_attestation_rejected` → valid = false.
 *
 *  Rule 9 — lifecycleStatus === "expired":
 *    Diagnostic: `pilot_session_attestation_expired` (soft; does not fail valid).
 *    Prevents trustedForPilot and trustedForProduction.
 *
 *  Rule 10 — lifecycleStatus === "superseded":
 *    Diagnostic: `pilot_session_attestation_superseded` (soft; does not fail valid).
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
 * - no auth SDK imported
 * - no database read or write
 * - no session store access
 * - no LLM calls
 * - no persistence
 * - no logging
 * - no telemetry
 * - no runtime hooks
 * - no Smart Talk connection
 * - no pilot activation
 * - all results carry neverUserVisible: true
 */

import type {
  PilotSessionAttestationRecord,
  PilotSessionAttestationValidationDiagnostic,
  PilotSessionAttestationValidationResult,
} from "./pilot-session-attestation-types";

export const PILOT_SESSION_ATTESTATION_VALIDATOR_VERSION =
  "8.2f-15l-pilot-session-attestation-validator-v1";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns true if the string is non-null, non-undefined, and non-blank. */
function isNonBlank(value: string | undefined | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

// ── Main validator ─────────────────────────────────────────────────────────────

/**
 * Validates a `PilotSessionAttestationRecord` and returns a never-user-visible
 * `PilotSessionAttestationValidationResult` with `valid`, `trustedForPilot`,
 * `trustedForProduction`, and accumulated `diagnostics`.
 *
 * Pure function — no side effects, no persistence, no logging, no telemetry,
 * no auth SDK, no DB, no session store, no LLM, no runtime hooks, no pilot activation.
 */
export function validatePilotSessionAttestation(
  record: PilotSessionAttestationRecord,
): PilotSessionAttestationValidationResult {
  const diagnostics: PilotSessionAttestationValidationDiagnostic[] = [];
  let hardFailure = false;

  // ── Rule 1 — attestationId must be non-blank ──────────────────────────────

  if (!isNonBlank(record.attestationId)) {
    diagnostics.push("pilot_session_attestation_missing_id");
    hardFailure = true;
  }

  // ── Rule 2 — reportId must be non-blank ───────────────────────────────────

  if (!isNonBlank(record.reportId)) {
    diagnostics.push("pilot_session_attestation_missing_report_id");
    hardFailure = true;
  }

  // ── Rule 3 — generatedBy must be non-blank ────────────────────────────────

  if (!isNonBlank(record.generatedBy)) {
    diagnostics.push("pilot_session_attestation_missing_generated_by");
    hardFailure = true;
  }

  // ── Rule 4 — unknown issuer (soft warning) ────────────────────────────────

  const hasUnknownIssuer = record.issuerKind === "unknown";
  if (hasUnknownIssuer) {
    diagnostics.push("pilot_session_attestation_unknown_issuer");
  }

  // ── Rule 5 — no store reference (soft warning) ────────────────────────────

  const hasNoStore = record.storeKind === "none";
  if (hasNoStore) {
    diagnostics.push("pilot_session_attestation_no_store");
  }

  // ── Rule 6 — verification failed (hard failure) ───────────────────────────

  const verificationFailed = record.verificationStatus === "failed";
  if (verificationFailed) {
    diagnostics.push("pilot_session_attestation_failed");
    hardFailure = true;
  }

  // ── Rule 7 — verification unverifiable (soft warning) ────────────────────

  const verificationUnverifiable = record.verificationStatus === "unverifiable";
  if (verificationUnverifiable) {
    diagnostics.push("pilot_session_attestation_unverified");
  }

  // ── Rule 8 — lifecycle rejected (hard failure) ────────────────────────────

  const lifecycleRejected = record.lifecycleStatus === "rejected";
  if (lifecycleRejected) {
    diagnostics.push("pilot_session_attestation_rejected");
    hardFailure = true;
  }

  // ── Rule 9 — lifecycle expired (soft; blocks trust) ──────────────────────

  const lifecycleExpired = record.lifecycleStatus === "expired";
  if (lifecycleExpired) {
    diagnostics.push("pilot_session_attestation_expired");
  }

  // ── Rule 10 — lifecycle superseded (soft; blocks trust) ──────────────────

  const lifecycleSuperseded = record.lifecycleStatus === "superseded";
  if (lifecycleSuperseded) {
    diagnostics.push("pilot_session_attestation_superseded");
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
        "(requires verified session store or auth gateway + real store reference " +
        "+ known issuer).",
    );
  } else if (valid) {
    notes.push(
      "Record is structurally valid but not trusted for pilot or production use.",
    );
  } else {
    const hardFailureCount =
      (diagnostics.includes("pilot_session_attestation_missing_id") ? 1 : 0) +
      (diagnostics.includes("pilot_session_attestation_missing_report_id") ? 1 : 0) +
      (diagnostics.includes("pilot_session_attestation_missing_generated_by") ? 1 : 0) +
      (diagnostics.includes("pilot_session_attestation_failed") ? 1 : 0) +
      (diagnostics.includes("pilot_session_attestation_rejected") ? 1 : 0);
    notes.push(
      `Record is invalid: ${String(hardFailureCount)} hard failure(s) detected.`,
    );
  }
  notes.push(
    "Validator is metadata-only: no auth, no DB access, no session store, " +
      "no persistence, no logging, no pilot activation.",
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
