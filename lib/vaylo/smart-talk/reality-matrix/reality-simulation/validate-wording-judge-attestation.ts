/**
 * Wording Judge Attestation Validator (Phase 8.2F-15M).
 *
 * Implements `validateWordingJudgeAttestation` — a pure function that evaluates
 * a `WordingJudgeAttestationRecord` and returns a never-user-visible
 * `WordingJudgeAttestationValidationResult` indicating structural validity and
 * two trust tiers: pilot trust and production trust.
 *
 * Validation rules (all applied; diagnostics accumulated, not short-circuited):
 *
 *  Rule 1 — attestationId must be non-blank:
 *    Failure: `wording_judge_attestation_missing_id` → valid = false.
 *
 *  Rule 2 — reportId must be non-blank:
 *    Failure: `wording_judge_attestation_missing_report_id` → valid = false.
 *
 *  Rule 3 — generatedBy must be non-blank:
 *    Failure: `wording_judge_attestation_missing_generated_by` → valid = false.
 *
 *  Rule 4 — issuerKind === "unknown":
 *    Diagnostic: `wording_judge_attestation_unknown_issuer` (soft; does not fail valid).
 *    Prevents trustedForProduction.
 *
 *  Rule 5 — storeKind === "none":
 *    Diagnostic: `wording_judge_attestation_no_store` (soft; does not fail valid).
 *    Prevents trustedForProduction.
 *
 *  Rule 6 — verificationStatus === "failed":
 *    Failure: `wording_judge_attestation_failed` → valid = false.
 *
 *  Rule 7 — verificationStatus === "unverifiable":
 *    Diagnostic: `wording_judge_attestation_unverified` (soft; does not fail valid).
 *    Prevents trustedForProduction.
 *
 *  Rule 8 — lifecycleStatus === "rejected":
 *    Failure: `wording_judge_attestation_rejected` → valid = false.
 *
 *  Rule 9 — lifecycleStatus === "expired":
 *    Diagnostic: `wording_judge_attestation_expired` (soft; does not fail valid).
 *    Prevents trustedForPilot and trustedForProduction.
 *
 *  Rule 10 — lifecycleStatus === "superseded":
 *    Diagnostic: `wording_judge_attestation_superseded` (soft; does not fail valid).
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
 * - no LLM SDK imported
 * - no NLP library imported
 * - no real text evaluation
 * - no user-visible output generation
 * - no database read or write
 * - no review store access
 * - no persistence
 * - no logging
 * - no telemetry
 * - no runtime hooks
 * - no Smart Talk connection
 * - all results carry neverUserVisible: true
 */

import type {
  WordingJudgeAttestationRecord,
  WordingJudgeAttestationValidationDiagnostic,
  WordingJudgeAttestationValidationResult,
} from "./wording-judge-attestation-types";

export const WORDING_JUDGE_ATTESTATION_VALIDATOR_VERSION =
  "8.2f-15m-wording-judge-attestation-validator-v1";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns true if the string is non-null, non-undefined, and non-blank. */
function isNonBlank(value: string | undefined | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

// ── Main validator ─────────────────────────────────────────────────────────────

/**
 * Validates a `WordingJudgeAttestationRecord` and returns a never-user-visible
 * `WordingJudgeAttestationValidationResult` with `valid`, `trustedForPilot`,
 * `trustedForProduction`, and accumulated `diagnostics`.
 *
 * Pure function — no side effects, no persistence, no logging, no telemetry,
 * no LLM SDK, no NLP, no real text evaluation, no DB, no review store access,
 * no user-visible output generation.
 */
export function validateWordingJudgeAttestation(
  record: WordingJudgeAttestationRecord,
): WordingJudgeAttestationValidationResult {
  const diagnostics: WordingJudgeAttestationValidationDiagnostic[] = [];
  let hardFailure = false;

  // ── Rule 1 — attestationId must be non-blank ──────────────────────────────

  if (!isNonBlank(record.attestationId)) {
    diagnostics.push("wording_judge_attestation_missing_id");
    hardFailure = true;
  }

  // ── Rule 2 — reportId must be non-blank ───────────────────────────────────

  if (!isNonBlank(record.reportId)) {
    diagnostics.push("wording_judge_attestation_missing_report_id");
    hardFailure = true;
  }

  // ── Rule 3 — generatedBy must be non-blank ────────────────────────────────

  if (!isNonBlank(record.generatedBy)) {
    diagnostics.push("wording_judge_attestation_missing_generated_by");
    hardFailure = true;
  }

  // ── Rule 4 — unknown issuer (soft warning) ────────────────────────────────

  const hasUnknownIssuer = record.issuerKind === "unknown";
  if (hasUnknownIssuer) {
    diagnostics.push("wording_judge_attestation_unknown_issuer");
  }

  // ── Rule 5 — no store reference (soft warning) ────────────────────────────

  const hasNoStore = record.storeKind === "none";
  if (hasNoStore) {
    diagnostics.push("wording_judge_attestation_no_store");
  }

  // ── Rule 6 — verification failed (hard failure) ───────────────────────────

  const verificationFailed = record.verificationStatus === "failed";
  if (verificationFailed) {
    diagnostics.push("wording_judge_attestation_failed");
    hardFailure = true;
  }

  // ── Rule 7 — verification unverifiable (soft warning) ────────────────────

  const verificationUnverifiable = record.verificationStatus === "unverifiable";
  if (verificationUnverifiable) {
    diagnostics.push("wording_judge_attestation_unverified");
  }

  // ── Rule 8 — lifecycle rejected (hard failure) ────────────────────────────

  const lifecycleRejected = record.lifecycleStatus === "rejected";
  if (lifecycleRejected) {
    diagnostics.push("wording_judge_attestation_rejected");
    hardFailure = true;
  }

  // ── Rule 9 — lifecycle expired (soft; blocks trust) ──────────────────────

  const lifecycleExpired = record.lifecycleStatus === "expired";
  if (lifecycleExpired) {
    diagnostics.push("wording_judge_attestation_expired");
  }

  // ── Rule 10 — lifecycle superseded (soft; blocks trust) ──────────────────

  const lifecycleSuperseded = record.lifecycleStatus === "superseded";
  if (lifecycleSuperseded) {
    diagnostics.push("wording_judge_attestation_superseded");
  }

  // ── Rules 11–12 — trust tiers ─────────────────────────────────────────────

  const valid = !hardFailure;

  // trustedForPilot: valid + lifecycle validated + verification acceptable.
  // Acceptable verification for pilot: "verified" OR "not_applicable"
  // (synthetic fixtures with `fixture_declared`, and manual reviewers with
  // `manual_review_declared`, legitimately use not_applicable verification).
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
        "(requires verified LLM judge or human review system + real score store " +
        "reference + known issuer).",
    );
  } else if (valid) {
    notes.push(
      "Record is structurally valid but not trusted for pilot or production use.",
    );
  } else {
    const hardFailureCount =
      (diagnostics.includes("wording_judge_attestation_missing_id") ? 1 : 0) +
      (diagnostics.includes("wording_judge_attestation_missing_report_id") ? 1 : 0) +
      (diagnostics.includes("wording_judge_attestation_missing_generated_by") ? 1 : 0) +
      (diagnostics.includes("wording_judge_attestation_failed") ? 1 : 0) +
      (diagnostics.includes("wording_judge_attestation_rejected") ? 1 : 0);
    notes.push(
      `Record is invalid: ${String(hardFailureCount)} hard failure(s) detected.`,
    );
  }
  notes.push(
    "Validator is metadata-only: no LLM calls, no NLP, no real text evaluation, " +
      "no DB access, no review store, no persistence, no logging.",
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
