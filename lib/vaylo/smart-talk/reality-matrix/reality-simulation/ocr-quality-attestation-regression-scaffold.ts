/**
 * OCR Quality Attestation regression scaffold (Phase 8.2F-15K).
 *
 * Ten structural cases exercising validateOcrQualityAttestation:
 *
 *  Case  1 — valid synthetic fixture attestation
 *             → valid=true, trustedForPilot=true, trustedForProduction=false
 *  Case  2 — future OCR engine + future store, verified
 *             → valid=true, trustedForPilot=true, trustedForProduction=true
 *  Case  3 — missing attestationId
 *             → valid=false, trustedForPilot=false
 *  Case  4 — missing reportId
 *             → valid=false, trustedForPilot=false
 *  Case  5 — unknown issuer
 *             → valid=true, trustedForPilot=true, trustedForProduction=false
 *  Case  6 — no store reference
 *             → valid=true, trustedForPilot=true, trustedForProduction=false
 *  Case  7 — failed verification
 *             → valid=false, trustedForPilot=false, trustedForProduction=false
 *  Case  8 — rejected lifecycle
 *             → valid=false, trustedForPilot=false, trustedForProduction=false
 *  Case  9 — expired lifecycle
 *             → valid=true, trustedForPilot=false, trustedForProduction=false
 *  Case 10 — superseded lifecycle
 *             → valid=true, trustedForPilot=false, trustedForProduction=false
 *
 * No Jest/Vitest. No CI hook. No runtime integration. No persistence.
 * No logging. No telemetry. No Smart Talk wiring. No OCR SDK. No LLM.
 */

import type {
  OcrQualityAttestationRecord,
  OcrQualityAttestationValidationDiagnostic,
  OcrQualityAttestationValidationResult,
} from "./ocr-quality-attestation-types";
import {
  OCR_QUALITY_ATTESTATION_VALIDATOR_VERSION,
  validateOcrQualityAttestation,
} from "./validate-ocr-quality-attestation";

export const OCR_QUALITY_ATTESTATION_REGRESSION_VERSION =
  "8.2f-15k-ocr-quality-attestation-regression-scaffold-v1";

// ── Result types ───────────────────────────────────────────────────────────────

export interface OcrAttestationRegressionCaseResult {
  readonly caseName: string;
  readonly passed: boolean;
  readonly validationResult: OcrQualityAttestationValidationResult;
  readonly failures: readonly string[];
  readonly notes: readonly string[];
}

export interface OcrAttestationRegressionScaffoldResult {
  readonly scaffoldVersion: string;
  readonly validatorVersion: string;
  readonly allPassed: boolean;
  readonly caseResults: readonly OcrAttestationRegressionCaseResult[];
  readonly notes: readonly string[];
}

// ── Base fixture ───────────────────────────────────────────────────────────────

const BASE_RECORD: OcrQualityAttestationRecord = {
  attestationId: "attest-regression-base-001",
  reportId: "report-regression-base-001",
  issuerKind: "synthetic_fixture",
  storeKind: "in_memory_test_fixture",
  attestationMethod: "fixture_declared",
  verificationStatus: "not_applicable",
  lifecycleStatus: "validated",
  generatedBy: "ocr-quality-attestation-regression-scaffold-v1",
  neverUserVisible: true,
  notes: ["Base synthetic fixture for regression testing."],
};

// ── Assertion helper ───────────────────────────────────────────────────────────

function assertAttestation(
  caseName: string,
  record: OcrQualityAttestationRecord,
  opts: {
    expectValid: boolean;
    expectTrustedForPilot: boolean;
    expectTrustedForProduction: boolean;
    expectDiagnostics?: readonly OcrQualityAttestationValidationDiagnostic[];
    expectNoDiagnostics?: readonly OcrQualityAttestationValidationDiagnostic[];
  },
): OcrAttestationRegressionCaseResult {
  const result = validateOcrQualityAttestation(record);
  const failures: string[] = [];

  if (result.valid !== opts.expectValid) {
    failures.push(
      `valid: expected=${String(opts.expectValid)}, got=${String(result.valid)}`,
    );
  }
  if (result.trustedForPilot !== opts.expectTrustedForPilot) {
    failures.push(
      `trustedForPilot: expected=${String(opts.expectTrustedForPilot)}, got=${String(result.trustedForPilot)}`,
    );
  }
  if (result.trustedForProduction !== opts.expectTrustedForProduction) {
    failures.push(
      `trustedForProduction: expected=${String(opts.expectTrustedForProduction)}, got=${String(result.trustedForProduction)}`,
    );
  }
  for (const code of opts.expectDiagnostics ?? []) {
    if (!result.diagnostics.includes(code)) {
      failures.push(`Expected diagnostic "${code}" not in result.diagnostics`);
    }
  }
  for (const code of opts.expectNoDiagnostics ?? []) {
    if (result.diagnostics.includes(code)) {
      failures.push(`Diagnostic "${code}" must NOT be in result.diagnostics`);
    }
  }
  if (!result.neverUserVisible) {
    failures.push("neverUserVisible must be true on validation result");
  }

  const passed = failures.length === 0;
  return {
    caseName,
    passed,
    validationResult: result,
    failures,
    notes: [
      passed
        ? `Case "${caseName}" passed.`
        : `Case "${caseName}" failed with ${String(failures.length)} failure(s).`,
    ],
  };
}

// ── Case 1 — valid synthetic fixture attestation ──────────────────────────────

function runCase1(): OcrAttestationRegressionCaseResult {
  // Synthetic fixture with fixture_declared method and not_applicable verification.
  // Trusted for pilot (acceptable verification for synthetic), but NOT for production
  // (no verified engine, in_memory store only).
  return assertAttestation(
    "valid_synthetic_fixture",
    BASE_RECORD,
    {
      expectValid: true,
      expectTrustedForPilot: true,
      expectTrustedForProduction: false,
      expectNoDiagnostics: [
        "ocr_attestation_missing_id",
        "ocr_attestation_missing_report_id",
        "ocr_attestation_missing_generated_by",
        "ocr_attestation_failed",
        "ocr_attestation_rejected",
        "ocr_attestation_unknown_issuer",
      ],
    },
  );
}

// ── Case 2 — future engine + future store, verified ───────────────────────────

function runCase2(): OcrAttestationRegressionCaseResult {
  // This represents the desired future production state:
  // - future OCR engine as issuer
  // - future_database_record as store
  // - future_store_verified attestation method
  // - verified verification status
  // Trusted for both pilot AND production.
  const record: OcrQualityAttestationRecord = {
    ...BASE_RECORD,
    attestationId: "attest-future-engine-001",
    reportId: "report-future-engine-001",
    issuerKind: "future_ocr_engine",
    storeKind: "future_database_record",
    attestationMethod: "future_store_verified",
    verificationStatus: "verified",
    lifecycleStatus: "validated",
    generatedBy: "future-ocr-engine-stub-v1",
    notes: [
      "Structural stub: represents future verified OCR engine attestation.",
      "No real OCR engine is connected in this phase.",
    ],
  };

  return assertAttestation(
    "future_engine_verified_production_trust",
    record,
    {
      expectValid: true,
      expectTrustedForPilot: true,
      expectTrustedForProduction: true,
      expectNoDiagnostics: [
        "ocr_attestation_missing_id",
        "ocr_attestation_missing_report_id",
        "ocr_attestation_failed",
        "ocr_attestation_rejected",
        "ocr_attestation_unknown_issuer",
        "ocr_attestation_no_store",
        "ocr_attestation_unverified",
      ],
    },
  );
}

// ── Case 3 — missing attestationId ────────────────────────────────────────────

function runCase3(): OcrAttestationRegressionCaseResult {
  const record: OcrQualityAttestationRecord = {
    ...BASE_RECORD,
    attestationId: "",
  };

  return assertAttestation(
    "missing_attestation_id",
    record,
    {
      expectValid: false,
      expectTrustedForPilot: false,
      expectTrustedForProduction: false,
      expectDiagnostics: ["ocr_attestation_missing_id"],
      expectNoDiagnostics: ["ocr_attestation_missing_report_id"],
    },
  );
}

// ── Case 4 — missing reportId ─────────────────────────────────────────────────

function runCase4(): OcrAttestationRegressionCaseResult {
  const record: OcrQualityAttestationRecord = {
    ...BASE_RECORD,
    reportId: "   ",
  };

  return assertAttestation(
    "missing_report_id",
    record,
    {
      expectValid: false,
      expectTrustedForPilot: false,
      expectTrustedForProduction: false,
      expectDiagnostics: ["ocr_attestation_missing_report_id"],
      expectNoDiagnostics: ["ocr_attestation_missing_id"],
    },
  );
}

// ── Case 5 — unknown issuer ───────────────────────────────────────────────────

function runCase5(): OcrAttestationRegressionCaseResult {
  // Unknown issuer: valid but not trusted for production.
  // trustedForPilot still true (lifecycle validated, verification not_applicable).
  const record: OcrQualityAttestationRecord = {
    ...BASE_RECORD,
    attestationId: "attest-unknown-issuer-001",
    reportId: "report-unknown-issuer-001",
    issuerKind: "unknown",
  };

  return assertAttestation(
    "unknown_issuer_not_production_trusted",
    record,
    {
      expectValid: true,
      expectTrustedForPilot: true,
      expectTrustedForProduction: false,
      expectDiagnostics: ["ocr_attestation_unknown_issuer"],
      expectNoDiagnostics: [
        "ocr_attestation_failed",
        "ocr_attestation_rejected",
        "ocr_attestation_missing_id",
      ],
    },
  );
}

// ── Case 6 — no store reference ───────────────────────────────────────────────

function runCase6(): OcrAttestationRegressionCaseResult {
  // No store: valid and pilot-trusted, but NOT production-trusted.
  const record: OcrQualityAttestationRecord = {
    ...BASE_RECORD,
    attestationId: "attest-no-store-001",
    reportId: "report-no-store-001",
    storeKind: "none",
  };

  return assertAttestation(
    "no_store_not_production_trusted",
    record,
    {
      expectValid: true,
      expectTrustedForPilot: true,
      expectTrustedForProduction: false,
      expectDiagnostics: ["ocr_attestation_no_store"],
      expectNoDiagnostics: [
        "ocr_attestation_failed",
        "ocr_attestation_rejected",
        "ocr_attestation_unknown_issuer",
      ],
    },
  );
}

// ── Case 7 — failed verification ──────────────────────────────────────────────

function runCase7(): OcrAttestationRegressionCaseResult {
  const record: OcrQualityAttestationRecord = {
    ...BASE_RECORD,
    attestationId: "attest-failed-verify-001",
    reportId: "report-failed-verify-001",
    verificationStatus: "failed",
  };

  return assertAttestation(
    "failed_verification_invalid",
    record,
    {
      expectValid: false,
      expectTrustedForPilot: false,
      expectTrustedForProduction: false,
      expectDiagnostics: ["ocr_attestation_failed"],
      expectNoDiagnostics: ["ocr_attestation_missing_id", "ocr_attestation_rejected"],
    },
  );
}

// ── Case 8 — rejected lifecycle ───────────────────────────────────────────────

function runCase8(): OcrAttestationRegressionCaseResult {
  const record: OcrQualityAttestationRecord = {
    ...BASE_RECORD,
    attestationId: "attest-rejected-001",
    reportId: "report-rejected-001",
    lifecycleStatus: "rejected",
  };

  return assertAttestation(
    "rejected_lifecycle_invalid",
    record,
    {
      expectValid: false,
      expectTrustedForPilot: false,
      expectTrustedForProduction: false,
      expectDiagnostics: ["ocr_attestation_rejected"],
      expectNoDiagnostics: [
        "ocr_attestation_failed",
        "ocr_attestation_missing_id",
        "ocr_attestation_expired",
      ],
    },
  );
}

// ── Case 9 — expired lifecycle ────────────────────────────────────────────────

function runCase9(): OcrAttestationRegressionCaseResult {
  // Expired: structurally valid (IDs present, verification not failed/rejected)
  // but not trusted for pilot or production.
  const record: OcrQualityAttestationRecord = {
    ...BASE_RECORD,
    attestationId: "attest-expired-001",
    reportId: "report-expired-001",
    lifecycleStatus: "expired",
  };

  return assertAttestation(
    "expired_lifecycle_valid_but_untrusted",
    record,
    {
      expectValid: true,
      expectTrustedForPilot: false,
      expectTrustedForProduction: false,
      expectDiagnostics: ["ocr_attestation_expired"],
      expectNoDiagnostics: [
        "ocr_attestation_rejected",
        "ocr_attestation_failed",
        "ocr_attestation_superseded",
      ],
    },
  );
}

// ── Case 10 — superseded lifecycle ────────────────────────────────────────────

function runCase10(): OcrAttestationRegressionCaseResult {
  // Superseded: structurally valid but not trusted for pilot or production.
  const record: OcrQualityAttestationRecord = {
    ...BASE_RECORD,
    attestationId: "attest-superseded-001",
    reportId: "report-superseded-001",
    lifecycleStatus: "superseded",
    notes: ["Superseded by attest-regression-base-002."],
  };

  return assertAttestation(
    "superseded_lifecycle_valid_but_untrusted",
    record,
    {
      expectValid: true,
      expectTrustedForPilot: false,
      expectTrustedForProduction: false,
      expectDiagnostics: ["ocr_attestation_superseded"],
      expectNoDiagnostics: [
        "ocr_attestation_rejected",
        "ocr_attestation_failed",
        "ocr_attestation_expired",
      ],
    },
  );
}

// ── Scaffold runner ────────────────────────────────────────────────────────────

/**
 * Runs all 10 OCR quality attestation regression cases and aggregates results.
 *
 * Does not throw. All assertions are collected as failure strings.
 * No OCR processing. No DB access. No persistence. No logging. No telemetry.
 * No Smart Talk runtime. No LLM.
 */
export function runOcrQualityAttestationRegressionScaffold(): OcrAttestationRegressionScaffoldResult {
  const caseResults: OcrAttestationRegressionCaseResult[] = [
    runCase1(),
    runCase2(),
    runCase3(),
    runCase4(),
    runCase5(),
    runCase6(),
    runCase7(),
    runCase8(),
    runCase9(),
    runCase10(),
  ];

  const allPassed = caseResults.every((r) => r.passed);
  const passCount = caseResults.filter((r) => r.passed).length;
  const failCount = caseResults.length - passCount;

  const notes: string[] = [
    `OCR quality attestation regression scaffold complete. ${String(passCount)}/${String(caseResults.length)} cases passed.`,
  ];

  if (allPassed) {
    notes.push(
      "All attestation rules validated: synthetic fixture pilot trust, future engine " +
        "production trust, missing-ID hard failures, unknown issuer/no-store soft warnings, " +
        "failed/rejected hard failures, expired/superseded lifecycle soft blocks.",
    );
    notes.push(
      "8.2F-15K: OcrQualityAttestationRecord and validateOcrQualityAttestation are " +
        "contract/scaffold only — no real OCR, no DB, no persistence, no runtime wiring.",
    );
  } else {
    notes.push(
      `${String(failCount)} case(s) failed — review validationResult.diagnostics for details.`,
    );
  }

  notes.push(
    "Scaffold is metadata-only: no OCR SDK, no image processing, no persistence, " +
      "no logging, no telemetry, no Smart Talk runtime, no LLM called.",
  );

  return {
    scaffoldVersion: OCR_QUALITY_ATTESTATION_REGRESSION_VERSION,
    validatorVersion: OCR_QUALITY_ATTESTATION_VALIDATOR_VERSION,
    allPassed,
    caseResults,
    notes,
  };
}
