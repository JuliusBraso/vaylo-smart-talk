/**
 * Pilot Session Attestation Store Contract types (Phase 8.2F-15L).
 *
 * Defines a pure metadata contract for future pilot session attestation and
 * session-report-store provenance. Extends the Phase 8.2F-15F PilotSessionReport
 * provenance contract with an attestation-record model that describes how
 * a session report would be trusted, issued, versioned, and verified in a future
 * production deployment.
 *
 * This is a CONTRACT AND SCAFFOLD ONLY:
 * - No real auth is imported or executed.
 * - No real session state is read or written.
 * - No database or persistence is added.
 * - No runtime wiring is created.
 * - No cryptographic signing is implemented.
 * - No pilot access is activated.
 *
 * Trust levels:
 * - `trustedForPilot` — usable in the limited trusted pilot gate; includes
 *   synthetic fixtures and manual review attestations with not_applicable
 *   verification.
 * - `trustedForProduction` — requires a real verified session store or auth
 *   gateway + a real store reference; structural contract only in this phase.
 *
 * Safety guarantees:
 * - no auth SDK imported
 * - no database read or write
 * - no session store access
 * - no LLM calls
 * - no Smart Talk wiring
 * - no deadline calculation
 * - no legal conclusions
 * - no user-visible output
 * - all result types carry neverUserVisible: true
 */

// ── Issuer identity ───────────────────────────────────────────────────────────

/**
 * The identity class of the entity that issued a pilot session report.
 *
 * - `synthetic_fixture`       — the report was programmatically generated as a
 *                               governance/regression fixture; no real session state.
 * - `manual_reviewer`         — the report was authored or confirmed by a human
 *                               reviewer as part of a governance audit.
 * - `future_session_store`    — reserved for reports produced by a verified session
 *                               store integration (not yet connected in this phase).
 * - `future_auth_gateway`     — reserved for reports produced by a verified auth
 *                               gateway (e.g. Supabase Auth or equivalent).
 * - `imported_external_report`— the report was imported from an external session-
 *                               management system outside the Vaylo pipeline.
 * - `unknown`                 — issuer identity is unclassified; always non-trusted.
 */
export type PilotSessionReportIssuerKind =
  | "synthetic_fixture"
  | "manual_reviewer"
  | "future_session_store"
  | "future_auth_gateway"
  | "imported_external_report"
  | "unknown";

// ── Store kind ────────────────────────────────────────────────────────────────

/**
 * The type of report store associated with a pilot session attestation record.
 *
 * - `in_memory_test_fixture`      — report lives only in process memory; no
 *                                  durable store; suitable for regression scaffolds.
 * - `future_database_record`      — reserved for a future database row (Supabase or
 *                                  equivalent); not yet connected.
 * - `future_session_store_record` — reserved for a future session store record
 *                                  (e.g. Redis, Supabase Realtime, or equivalent);
 *                                  not yet connected.
 * - `imported_static_fixture`     — report was imported from a static fixture file;
 *                                  no live store connection.
 * - `none`                        — no store reference at all; prevents
 *                                  `trustedForProduction`.
 */
export type PilotSessionReportStoreKind =
  | "in_memory_test_fixture"
  | "future_database_record"
  | "future_session_store_record"
  | "imported_static_fixture"
  | "none";

// ── Attestation method ─────────────────────────────────────────────────────────

/**
 * The attestation method used to validate or declare a pilot session report.
 *
 * - `none`                   — no attestation method; report is unattested.
 * - `fixture_declared`       — report is declared as a governance fixture;
 *                              no external verification.
 * - `manual_review_declared` — a human reviewer declared the report valid.
 * - `future_store_verified`  — reserved for a future session store that will
 *                              verify report integrity (e.g. hash check against
 *                              a stored digest).
 * - `future_auth_signed`     — reserved for a future auth gateway that will
 *                              sign session reports cryptographically.
 */
export type PilotSessionAttestationMethod =
  | "none"
  | "fixture_declared"
  | "manual_review_declared"
  | "future_store_verified"
  | "future_auth_signed";

// ── Lifecycle status ───────────────────────────────────────────────────────────

/**
 * The lifecycle status of a pilot session attestation record.
 *
 * - `draft`      — record is incomplete or not yet submitted for validation.
 * - `validated`  — record passed structural validation; eligible for trust checks.
 * - `rejected`   — record failed validation or was explicitly rejected.
 * - `expired`    — record was valid but has passed its validity window.
 * - `superseded` — a newer attestation record has replaced this one.
 */
export type PilotSessionReportLifecycleStatus =
  | "draft"
  | "validated"
  | "rejected"
  | "expired"
  | "superseded";

// ── Verification status ────────────────────────────────────────────────────────

/**
 * The verification outcome of an attestation method applied to the session report.
 *
 * - `verified`        — attestation method completed successfully; report is trusted.
 * - `unverifiable`    — attestation method is defined but could not be executed
 *                       (e.g. future store not yet connected); prevents production
 *                       trust.
 * - `failed`          — attestation method ran and found the report invalid.
 * - `not_applicable`  — no verification is expected for this attestation method
 *                       (e.g. synthetic fixtures with `fixture_declared`).
 */
export type PilotSessionAttestationVerificationStatus =
  | "verified"
  | "unverifiable"
  | "failed"
  | "not_applicable";

// ── Attestation record ─────────────────────────────────────────────────────────

/**
 * A structured attestation record for a pilot session report.
 *
 * This record models the trust provenance of a `PilotSessionReport` —
 * describing who issued it, where it is stored, how it was attested,
 * whether it was verified, and what lifecycle stage it is in.
 *
 * `attestationId`      — opaque, unique identifier for this attestation record.
 * `reportId`           — the `PilotSessionReport.reportId` this record attests.
 * `issuerKind`         — the identity class of the report's issuer.
 * `storeKind`          — the type of store holding the associated report.
 * `attestationMethod`  — how the report was attested or declared.
 * `verificationStatus` — outcome of the attestation method.
 * `lifecycleStatus`    — current lifecycle stage of this attestation record.
 * `generatedBy`        — opaque string identifying the system or fixture.
 * `neverUserVisible`   — compile-time invariant; this record is internal only.
 * `notes`              — optional never-user-visible governance notes.
 */
export interface PilotSessionAttestationRecord {
  readonly attestationId: string;
  readonly reportId: string;
  readonly issuerKind: PilotSessionReportIssuerKind;
  readonly storeKind: PilotSessionReportStoreKind;
  readonly attestationMethod: PilotSessionAttestationMethod;
  readonly verificationStatus: PilotSessionAttestationVerificationStatus;
  readonly lifecycleStatus: PilotSessionReportLifecycleStatus;
  readonly generatedBy: string;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Validation diagnostic codes ────────────────────────────────────────────────

/**
 * Never-user-visible diagnostic codes emitted by `validatePilotSessionAttestation`.
 *
 * - `pilot_session_attestation_missing_id`          — `attestationId` is blank or empty.
 * - `pilot_session_attestation_missing_report_id`   — `reportId` is blank or empty.
 * - `pilot_session_attestation_missing_issuer`      — reserved for future runtime use
 *                                                     when `issuerKind` is absent during
 *                                                     deserialization (TypeScript-compiled
 *                                                     records always have issuerKind; this
 *                                                     is a contract stub for future store reads).
 * - `pilot_session_attestation_missing_generated_by`— `generatedBy` is blank or empty.
 * - `pilot_session_attestation_unverified`          — `verificationStatus` is `"unverifiable"`.
 * - `pilot_session_attestation_failed`              — `verificationStatus` is `"failed"`.
 * - `pilot_session_attestation_rejected`            — `lifecycleStatus` is `"rejected"`.
 * - `pilot_session_attestation_expired`             — `lifecycleStatus` is `"expired"`.
 * - `pilot_session_attestation_superseded`          — `lifecycleStatus` is `"superseded"`.
 * - `pilot_session_attestation_unknown_issuer`      — `issuerKind` is `"unknown"`.
 * - `pilot_session_attestation_no_store`            — `storeKind` is `"none"`.
 */
export type PilotSessionAttestationValidationDiagnostic =
  | "pilot_session_attestation_missing_id"
  | "pilot_session_attestation_missing_report_id"
  | "pilot_session_attestation_missing_issuer"
  | "pilot_session_attestation_missing_generated_by"
  | "pilot_session_attestation_unverified"
  | "pilot_session_attestation_failed"
  | "pilot_session_attestation_rejected"
  | "pilot_session_attestation_expired"
  | "pilot_session_attestation_superseded"
  | "pilot_session_attestation_unknown_issuer"
  | "pilot_session_attestation_no_store";

// ── Validation result ──────────────────────────────────────────────────────────

/**
 * The never-user-visible result of `validatePilotSessionAttestation`.
 *
 * `valid`                — `true` if no hard structural violations exist
 *                          (non-empty IDs, non-failed/non-rejected lifecycle and
 *                          verification status).
 * `trustedForPilot`      — `true` only if `valid` AND `lifecycleStatus === "validated"` AND
 *                          `verificationStatus` is `"verified"` or `"not_applicable"`.
 *                          Synthetic fixtures with `fixture_declared` method satisfy this.
 * `trustedForProduction` — `true` only if all pilot trust conditions hold AND
 *                          `verificationStatus === "verified"` AND
 *                          `storeKind !== "none"` AND `issuerKind !== "unknown"`.
 *                          Requires a real verified session store or auth gateway with
 *                          a real store reference.
 * `diagnostics`          — ordered list of never-user-visible diagnostic codes;
 *                          includes both hard failure codes and soft warning codes.
 * `neverUserVisible`     — compile-time invariant.
 * `notes`                — optional never-user-visible governance notes.
 */
export interface PilotSessionAttestationValidationResult {
  readonly valid: boolean;
  readonly trustedForPilot: boolean;
  readonly trustedForProduction: boolean;
  readonly diagnostics: readonly PilotSessionAttestationValidationDiagnostic[];
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}
