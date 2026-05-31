/**
 * Wording Judge Attestation Store Contract types (Phase 8.2F-15M).
 *
 * Defines a pure metadata contract for future wording judge / human reviewer
 * attestation and wording-score-report-store provenance. Extends the Phase
 * 8.2F-15G WordingToneScoreReport provenance contract with an attestation-record
 * model that describes how a wording score report would be trusted, issued,
 * versioned, and verified in a future production deployment.
 *
 * This is a CONTRACT AND SCAFFOLD ONLY:
 * - No LLM judge is imported or called.
 * - No NLP is executed.
 * - No real prose is evaluated.
 * - No database or persistence is added.
 * - No runtime wiring is created.
 * - No cryptographic signing is implemented.
 * - No user-visible wording is generated.
 *
 * Trust levels:
 * - `trustedForPilot` — usable in the limited trusted pilot gate; includes
 *   synthetic fixtures and manual review attestations with not_applicable
 *   verification.
 * - `trustedForProduction` — requires a real verified LLM judge or human review
 *   system + a real score store reference; structural contract only in this phase.
 *
 * Safety guarantees:
 * - no LLM SDK imported
 * - no NLP library imported
 * - no real text evaluation
 * - no user-visible output generation
 * - no database read or write
 * - no review store access
 * - no Smart Talk wiring
 * - no deadline calculation
 * - no legal conclusions
 * - all result types carry neverUserVisible: true
 */

// ── Issuer identity ───────────────────────────────────────────────────────────

/**
 * The identity class of the entity that issued a wording score report.
 *
 * - `synthetic_fixture`           — the report was programmatically generated as a
 *                                   governance/regression fixture; no real prose evaluated.
 * - `manual_reviewer`             — the report was authored or confirmed by a human
 *                                   reviewer as part of a governance audit.
 * - `future_llm_judge`            — reserved for reports produced by a verified LLM
 *                                   judge integration (e.g. OpenAI / Gemini evaluator);
 *                                   not yet connected in this phase.
 * - `future_human_review_system`  — reserved for reports produced by a verified human
 *                                   review management system.
 * - `imported_external_report`    — the report was imported from an external wording-
 *                                   quality-reporting system outside the Vaylo pipeline.
 * - `unknown`                     — issuer identity is unclassified; always non-trusted.
 */
export type WordingJudgeIssuerKind =
  | "synthetic_fixture"
  | "manual_reviewer"
  | "future_llm_judge"
  | "future_human_review_system"
  | "imported_external_report"
  | "unknown";

// ── Store kind ────────────────────────────────────────────────────────────────

/**
 * The type of report store associated with a wording judge attestation record.
 *
 * - `in_memory_test_fixture`    — report lives only in process memory; no
 *                                durable store; suitable for regression scaffolds.
 * - `future_database_record`    — reserved for a future database row (Supabase or
 *                                equivalent); not yet connected.
 * - `future_review_store_record`— reserved for a future wording review store record
 *                                (e.g. human review management database or LLM eval
 *                                results store); not yet connected.
 * - `imported_static_fixture`   — report was imported from a static fixture file;
 *                                no live store connection.
 * - `none`                      — no store reference at all; prevents
 *                                `trustedForProduction`.
 */
export type WordingScoreReportStoreKind =
  | "in_memory_test_fixture"
  | "future_database_record"
  | "future_review_store_record"
  | "imported_static_fixture"
  | "none";

// ── Attestation method ─────────────────────────────────────────────────────────

/**
 * The attestation method used to validate or declare a wording score report.
 *
 * - `none`                    — no attestation method; report is unattested.
 * - `fixture_declared`        — report is declared as a governance fixture;
 *                               no external verification.
 * - `manual_review_declared`  — a human reviewer declared the report valid.
 * - `future_judge_signed`     — reserved for a future LLM judge or automated
 *                               evaluator that will sign reports cryptographically.
 * - `future_store_verified`   — reserved for a future review store that will
 *                               verify report integrity (e.g. hash check against
 *                               a stored digest).
 */
export type WordingJudgeAttestationMethod =
  | "none"
  | "fixture_declared"
  | "manual_review_declared"
  | "future_judge_signed"
  | "future_store_verified";

// ── Lifecycle status ───────────────────────────────────────────────────────────

/**
 * The lifecycle status of a wording judge attestation record.
 *
 * - `draft`      — record is incomplete or not yet submitted for validation.
 * - `validated`  — record passed structural validation; eligible for trust checks.
 * - `rejected`   — record failed validation or was explicitly rejected.
 * - `expired`    — record was valid but has passed its validity window.
 * - `superseded` — a newer attestation record has replaced this one.
 */
export type WordingScoreReportLifecycleStatus =
  | "draft"
  | "validated"
  | "rejected"
  | "expired"
  | "superseded";

// ── Verification status ────────────────────────────────────────────────────────

/**
 * The verification outcome of an attestation method applied to the wording score
 * report.
 *
 * - `verified`        — attestation method completed successfully; report is trusted.
 * - `unverifiable`    — attestation method is defined but could not be executed
 *                       (e.g. future LLM judge not yet connected); prevents
 *                       production trust.
 * - `failed`          — attestation method ran and found the report invalid.
 * - `not_applicable`  — no verification is expected for this attestation method
 *                       (e.g. synthetic fixtures with `fixture_declared`).
 */
export type WordingJudgeVerificationStatus =
  | "verified"
  | "unverifiable"
  | "failed"
  | "not_applicable";

// ── Attestation record ─────────────────────────────────────────────────────────

/**
 * A structured attestation record for a wording score report.
 *
 * This record models the trust provenance of a `WordingToneScoreReport` —
 * describing who issued it, where it is stored, how it was attested,
 * whether it was verified, and what lifecycle stage it is in.
 *
 * `attestationId`      — opaque, unique identifier for this attestation record.
 * `reportId`           — the `WordingToneScoreReport.reportId` this record attests.
 * `issuerKind`         — the identity class of the report's issuer.
 * `storeKind`          — the type of store holding the associated report.
 * `attestationMethod`  — how the report was attested or declared.
 * `verificationStatus` — outcome of the attestation method.
 * `lifecycleStatus`    — current lifecycle stage of this attestation record.
 * `generatedBy`        — opaque string identifying the system or fixture.
 * `neverUserVisible`   — compile-time invariant; this record is internal only.
 * `notes`              — optional never-user-visible governance notes.
 */
export interface WordingJudgeAttestationRecord {
  readonly attestationId: string;
  readonly reportId: string;
  readonly issuerKind: WordingJudgeIssuerKind;
  readonly storeKind: WordingScoreReportStoreKind;
  readonly attestationMethod: WordingJudgeAttestationMethod;
  readonly verificationStatus: WordingJudgeVerificationStatus;
  readonly lifecycleStatus: WordingScoreReportLifecycleStatus;
  readonly generatedBy: string;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Validation diagnostic codes ────────────────────────────────────────────────

/**
 * Never-user-visible diagnostic codes emitted by `validateWordingJudgeAttestation`.
 *
 * - `wording_judge_attestation_missing_id`          — `attestationId` is blank or empty.
 * - `wording_judge_attestation_missing_report_id`   — `reportId` is blank or empty.
 * - `wording_judge_attestation_missing_issuer`      — reserved for future runtime use
 *                                                     when `issuerKind` is absent during
 *                                                     deserialization; TypeScript-compiled
 *                                                     records always have issuerKind.
 * - `wording_judge_attestation_missing_generated_by`— `generatedBy` is blank or empty.
 * - `wording_judge_attestation_unverified`          — `verificationStatus` is `"unverifiable"`.
 * - `wording_judge_attestation_failed`              — `verificationStatus` is `"failed"`.
 * - `wording_judge_attestation_rejected`            — `lifecycleStatus` is `"rejected"`.
 * - `wording_judge_attestation_expired`             — `lifecycleStatus` is `"expired"`.
 * - `wording_judge_attestation_superseded`          — `lifecycleStatus` is `"superseded"`.
 * - `wording_judge_attestation_unknown_issuer`      — `issuerKind` is `"unknown"`.
 * - `wording_judge_attestation_no_store`            — `storeKind` is `"none"`.
 */
export type WordingJudgeAttestationValidationDiagnostic =
  | "wording_judge_attestation_missing_id"
  | "wording_judge_attestation_missing_report_id"
  | "wording_judge_attestation_missing_issuer"
  | "wording_judge_attestation_missing_generated_by"
  | "wording_judge_attestation_unverified"
  | "wording_judge_attestation_failed"
  | "wording_judge_attestation_rejected"
  | "wording_judge_attestation_expired"
  | "wording_judge_attestation_superseded"
  | "wording_judge_attestation_unknown_issuer"
  | "wording_judge_attestation_no_store";

// ── Validation result ──────────────────────────────────────────────────────────

/**
 * The never-user-visible result of `validateWordingJudgeAttestation`.
 *
 * `valid`                — `true` if no hard structural violations exist
 *                          (non-empty IDs, non-failed/non-rejected lifecycle and
 *                          verification status).
 * `trustedForPilot`      — `true` only if `valid` AND `lifecycleStatus === "validated"` AND
 *                          `verificationStatus` is `"verified"` or `"not_applicable"`.
 *                          Synthetic fixtures with `fixture_declared` method satisfy this,
 *                          as do manual reviewer records with `manual_review_declared`.
 * `trustedForProduction` — `true` only if all pilot trust conditions hold AND
 *                          `verificationStatus === "verified"` AND
 *                          `storeKind !== "none"` AND `issuerKind !== "unknown"`.
 *                          Requires a real verified LLM judge or human review system
 *                          with a real score store reference.
 * `diagnostics`          — ordered list of never-user-visible diagnostic codes;
 *                          includes both hard failure codes and soft warning codes.
 * `neverUserVisible`     — compile-time invariant.
 * `notes`                — optional never-user-visible governance notes.
 */
export interface WordingJudgeAttestationValidationResult {
  readonly valid: boolean;
  readonly trustedForPilot: boolean;
  readonly trustedForProduction: boolean;
  readonly diagnostics: readonly WordingJudgeAttestationValidationDiagnostic[];
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}
