/**
 * OCR Quality Attestation Store Contract types (Phase 8.2F-15K).
 *
 * Defines a pure metadata contract for future OCR quality attestation and
 * report-store provenance. Extends the Phase 8.2F-15E OcrQualityReport
 * provenance contract with an attestation-record model that describes how
 * a report would be trusted, issued, versioned, and verified in a future
 * production deployment.
 *
 * This is a CONTRACT AND SCAFFOLD ONLY:
 * - No real OCR is imported or executed.
 * - No images are processed.
 * - No database or persistence is added.
 * - No runtime wiring is created.
 * - No cryptographic signing is implemented.
 *
 * Trust levels:
 * - `trustedForPilot` — usable in the limited trusted pilot gate; includes
 *   synthetic fixtures and manual review attestations.
 * - `trustedForProduction` — requires a real verified engine + a real store
 *   reference; structural contract only in this phase.
 *
 * Safety guarantees:
 * - no OCR SDK or library imported
 * - no image processing
 * - no LLM calls
 * - no Smart Talk wiring
 * - no deadline calculation
 * - no legal conclusions
 * - no user-visible output
 * - all result types carry neverUserVisible: true
 */

// ── Issuer identity ───────────────────────────────────────────────────────────

/**
 * The identity class of the entity that issued an OCR quality report.
 *
 * - `synthetic_fixture`       — the report was programmatically generated as a
 *                               governance/regression fixture; no real OCR output.
 * - `manual_reviewer`         — the report was authored or confirmed by a human
 *                               reviewer as part of a governance audit.
 * - `future_ocr_engine`       — reserved for reports produced by a verified OCR
 *                               engine integration (not yet connected in this phase).
 * - `imported_external_report`— the report was imported from an external quality-
 *                               reporting system outside the Vaylo pipeline.
 * - `unknown`                 — issuer identity is unclassified; always non-trusted.
 */
export type OcrQualityReportIssuerKind =
  | "synthetic_fixture"
  | "manual_reviewer"
  | "future_ocr_engine"
  | "imported_external_report"
  | "unknown";

// ── Store kind ────────────────────────────────────────────────────────────────

/**
 * The type of report store associated with an attestation record.
 *
 * - `in_memory_test_fixture`       — report lives only in process memory; no
 *                                   durable store; suitable for regression scaffolds.
 * - `future_database_record`       — reserved for a future database row (Supabase or
 *                                   equivalent); not yet connected.
 * - `future_object_storage_metadata`— reserved for a future object-storage metadata
 *                                   record; not yet connected.
 * - `imported_static_fixture`      — report was imported from a static fixture file;
 *                                   no live store connection.
 * - `none`                         — no store reference at all; prevents
 *                                   `trustedForProduction`.
 */
export type OcrQualityReportStoreKind =
  | "in_memory_test_fixture"
  | "future_database_record"
  | "future_object_storage_metadata"
  | "imported_static_fixture"
  | "none";

// ── Attestation method ─────────────────────────────────────────────────────────

/**
 * The attestation method used to validate or declare an OCR quality report.
 *
 * - `none`                    — no attestation method; report is unattested.
 * - `fixture_declared`        — report is declared as a governance fixture;
 *                               no external verification.
 * - `manual_review_declared`  — a human reviewer declared the report valid.
 * - `future_engine_signed`    — reserved for a future OCR engine that will
 *                               sign reports cryptographically.
 * - `future_store_verified`   — reserved for a future store-side verification
 *                               step (e.g. hash check against a stored digest).
 */
export type OcrQualityAttestationMethod =
  | "none"
  | "fixture_declared"
  | "manual_review_declared"
  | "future_engine_signed"
  | "future_store_verified";

// ── Lifecycle status ───────────────────────────────────────────────────────────

/**
 * The lifecycle status of an OCR quality attestation record.
 *
 * - `draft`      — record is incomplete or not yet submitted for validation.
 * - `validated`  — record passed structural validation; eligible for trust checks.
 * - `rejected`   — record failed validation or was explicitly rejected.
 * - `expired`    — record was valid but has passed its validity window.
 * - `superseded` — a newer attestation record has replaced this one.
 */
export type OcrQualityReportLifecycleStatus =
  | "draft"
  | "validated"
  | "rejected"
  | "expired"
  | "superseded";

// ── Verification status ────────────────────────────────────────────────────────

/**
 * The verification outcome of an attestation method applied to the report.
 *
 * - `verified`        — attestation method completed successfully; report is trusted.
 * - `unverifiable`    — attestation method is defined but could not be executed
 *                       (e.g. future engine not yet connected); prevents production trust.
 * - `failed`          — attestation method ran and found the report invalid.
 * - `not_applicable`  — no verification is expected for this attestation method
 *                       (e.g. synthetic fixtures with `fixture_declared`).
 */
export type OcrQualityAttestationVerificationStatus =
  | "verified"
  | "unverifiable"
  | "failed"
  | "not_applicable";

// ── Attestation record ─────────────────────────────────────────────────────────

/**
 * A structured attestation record for an OCR quality report.
 *
 * This record models the trust provenance of an `OcrQualityReport` —
 * describing who issued it, where it is stored, how it was attested,
 * whether it was verified, and what lifecycle stage it is in.
 *
 * `attestationId`      — opaque, unique identifier for this attestation record.
 * `reportId`           — the `OcrQualityReport.reportId` this record attests.
 * `issuerKind`         — the identity class of the report's issuer.
 * `storeKind`          — the type of store holding the associated report.
 * `attestationMethod`  — how the report was attested or declared.
 * `verificationStatus` — outcome of the attestation method.
 * `lifecycleStatus`    — current lifecycle stage of this attestation record.
 * `generatedBy`        — opaque string identifying the system or fixture.
 * `neverUserVisible`   — compile-time invariant; this record is internal only.
 * `notes`              — optional never-user-visible governance notes.
 */
export interface OcrQualityAttestationRecord {
  readonly attestationId: string;
  readonly reportId: string;
  readonly issuerKind: OcrQualityReportIssuerKind;
  readonly storeKind: OcrQualityReportStoreKind;
  readonly attestationMethod: OcrQualityAttestationMethod;
  readonly verificationStatus: OcrQualityAttestationVerificationStatus;
  readonly lifecycleStatus: OcrQualityReportLifecycleStatus;
  readonly generatedBy: string;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Validation diagnostic codes ────────────────────────────────────────────────

/**
 * Never-user-visible diagnostic codes emitted by `validateOcrQualityAttestation`.
 *
 * - `ocr_attestation_missing_id`          — `attestationId` is blank or empty.
 * - `ocr_attestation_missing_report_id`   — `reportId` is blank or empty.
 * - `ocr_attestation_missing_issuer`      — reserved for future runtime use when
 *                                          `issuerKind` is absent during deserialization
 *                                          (TypeScript-compiled records always have issuerKind;
 *                                          this code is a contract stub for future store reads).
 * - `ocr_attestation_missing_generated_by`— `generatedBy` is blank or empty.
 * - `ocr_attestation_unverified`          — `verificationStatus` is `"unverifiable"`.
 * - `ocr_attestation_failed`              — `verificationStatus` is `"failed"`.
 * - `ocr_attestation_rejected`            — `lifecycleStatus` is `"rejected"`.
 * - `ocr_attestation_expired`             — `lifecycleStatus` is `"expired"`.
 * - `ocr_attestation_unknown_issuer`      — `issuerKind` is `"unknown"`.
 * - `ocr_attestation_no_store`            — `storeKind` is `"none"`.
 * - `ocr_attestation_superseded`          — `lifecycleStatus` is `"superseded"`.
 */
export type OcrQualityAttestationValidationDiagnostic =
  | "ocr_attestation_missing_id"
  | "ocr_attestation_missing_report_id"
  | "ocr_attestation_missing_issuer"
  | "ocr_attestation_missing_generated_by"
  | "ocr_attestation_unverified"
  | "ocr_attestation_failed"
  | "ocr_attestation_rejected"
  | "ocr_attestation_expired"
  | "ocr_attestation_unknown_issuer"
  | "ocr_attestation_no_store"
  | "ocr_attestation_superseded";

// ── Validation result ──────────────────────────────────────────────────────────

/**
 * The never-user-visible result of `validateOcrQualityAttestation`.
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
 *                          Requires a real verified engine with a real store reference.
 * `diagnostics`          — ordered list of never-user-visible diagnostic codes;
 *                          includes both hard failure codes and soft warning codes.
 * `neverUserVisible`     — compile-time invariant.
 * `notes`                — optional never-user-visible governance notes.
 */
export interface OcrQualityAttestationValidationResult {
  readonly valid: boolean;
  readonly trustedForPilot: boolean;
  readonly trustedForProduction: boolean;
  readonly diagnostics: readonly OcrQualityAttestationValidationDiagnostic[];
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}
