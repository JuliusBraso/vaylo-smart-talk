/**
 * Pilot Session Attestation regression scaffold (Phase 8.2F-15L).
 *
 * Ten structural cases exercising validatePilotSessionAttestation:
 *
 *  Case  1 — valid synthetic fixture attestation
 *             → valid=true, trustedForPilot=true, trustedForProduction=false
 *  Case  2 — future session store verified + database/session store reference
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
 * No logging. No telemetry. No Smart Talk wiring. No auth SDK.
 * No DB. No session store. No LLM. No pilot activation.
 */

import type {
  PilotSessionAttestationRecord,
  PilotSessionAttestationValidationDiagnostic,
  PilotSessionAttestationValidationResult,
} from "./pilot-session-attestation-types";
import {
  PILOT_SESSION_ATTESTATION_VALIDATOR_VERSION,
  validatePilotSessionAttestation,
} from "./validate-pilot-session-attestation";

export const PILOT_SESSION_ATTESTATION_REGRESSION_VERSION =
  "8.2f-15l-pilot-session-attestation-regression-scaffold-v1";

// ── Result types ───────────────────────────────────────────────────────────────

export interface PilotSessionAttestationRegressionCaseResult {
  readonly caseName: string;
  readonly passed: boolean;
  readonly validationResult: PilotSessionAttestationValidationResult;
  readonly failures: readonly string[];
  readonly notes: readonly string[];
}

export interface PilotSessionAttestationRegressionScaffoldResult {
  readonly scaffoldVersion: string;
  readonly validatorVersion: string;
  readonly allPassed: boolean;
  readonly caseResults: readonly PilotSessionAttestationRegressionCaseResult[];
  readonly notes: readonly string[];
}

// ── Base fixture ───────────────────────────────────────────────────────────────

const BASE_RECORD: PilotSessionAttestationRecord = {
  attestationId: "pilot-attest-regression-base-001",
  reportId: "pilot-report-regression-base-001",
  issuerKind: "synthetic_fixture",
  storeKind: "in_memory_test_fixture",
  attestationMethod: "fixture_declared",
  verificationStatus: "not_applicable",
  lifecycleStatus: "validated",
  generatedBy: "pilot-session-attestation-regression-scaffold-v1",
  neverUserVisible: true,
  notes: ["Base synthetic fixture for pilot session attestation regression testing."],
};

// ── Assertion helper ───────────────────────────────────────────────────────────

function assertAttestation(
  caseName: string,
  record: PilotSessionAttestationRecord,
  opts: {
    expectValid: boolean;
    expectTrustedForPilot: boolean;
    expectTrustedForProduction: boolean;
    expectDiagnostics?: readonly PilotSessionAttestationValidationDiagnostic[];
    expectNoDiagnostics?: readonly PilotSessionAttestationValidationDiagnostic[];
  },
): PilotSessionAttestationRegressionCaseResult {
  const result = validatePilotSessionAttestation(record);
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

function runCase1(): PilotSessionAttestationRegressionCaseResult {
  // Synthetic fixture with fixture_declared method and not_applicable verification.
  // Trusted for pilot (acceptable verification for synthetic), but NOT for production
  // (no verified session store or auth gateway; in_memory store only).
  return assertAttestation(
    "valid_synthetic_fixture",
    BASE_RECORD,
    {
      expectValid: true,
      expectTrustedForPilot: true,
      expectTrustedForProduction: false,
      expectNoDiagnostics: [
        "pilot_session_attestation_missing_id",
        "pilot_session_attestation_missing_report_id",
        "pilot_session_attestation_missing_generated_by",
        "pilot_session_attestation_failed",
        "pilot_session_attestation_rejected",
        "pilot_session_attestation_unknown_issuer",
      ],
    },
  );
}

// ── Case 2 — future session store verified + real store reference ──────────────

function runCase2(): PilotSessionAttestationRegressionCaseResult {
  // Represents the desired future production state:
  // - future_session_store as issuer
  // - future_database_record as store
  // - future_store_verified attestation method
  // - verified verification status
  // Trusted for both pilot AND production.
  const record: PilotSessionAttestationRecord = {
    ...BASE_RECORD,
    attestationId: "pilot-attest-future-store-001",
    reportId: "pilot-report-future-store-001",
    issuerKind: "future_session_store",
    storeKind: "future_database_record",
    attestationMethod: "future_store_verified",
    verificationStatus: "verified",
    lifecycleStatus: "validated",
    generatedBy: "future-session-store-stub-v1",
    notes: [
      "Structural stub: represents future verified session store attestation.",
      "No real session store is connected in this phase.",
    ],
  };

  return assertAttestation(
    "future_session_store_verified_production_trust",
    record,
    {
      expectValid: true,
      expectTrustedForPilot: true,
      expectTrustedForProduction: true,
      expectNoDiagnostics: [
        "pilot_session_attestation_missing_id",
        "pilot_session_attestation_missing_report_id",
        "pilot_session_attestation_failed",
        "pilot_session_attestation_rejected",
        "pilot_session_attestation_unknown_issuer",
        "pilot_session_attestation_no_store",
        "pilot_session_attestation_unverified",
      ],
    },
  );
}

// ── Case 3 — missing attestationId ────────────────────────────────────────────

function runCase3(): PilotSessionAttestationRegressionCaseResult {
  const record: PilotSessionAttestationRecord = {
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
      expectDiagnostics: ["pilot_session_attestation_missing_id"],
      expectNoDiagnostics: ["pilot_session_attestation_missing_report_id"],
    },
  );
}

// ── Case 4 — missing reportId ─────────────────────────────────────────────────

function runCase4(): PilotSessionAttestationRegressionCaseResult {
  const record: PilotSessionAttestationRecord = {
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
      expectDiagnostics: ["pilot_session_attestation_missing_report_id"],
      expectNoDiagnostics: ["pilot_session_attestation_missing_id"],
    },
  );
}

// ── Case 5 — unknown issuer ───────────────────────────────────────────────────

function runCase5(): PilotSessionAttestationRegressionCaseResult {
  // Unknown issuer: valid but not trusted for production.
  // trustedForPilot still true (lifecycle validated, verification not_applicable).
  const record: PilotSessionAttestationRecord = {
    ...BASE_RECORD,
    attestationId: "pilot-attest-unknown-issuer-001",
    reportId: "pilot-report-unknown-issuer-001",
    issuerKind: "unknown",
  };

  return assertAttestation(
    "unknown_issuer_not_production_trusted",
    record,
    {
      expectValid: true,
      expectTrustedForPilot: true,
      expectTrustedForProduction: false,
      expectDiagnostics: ["pilot_session_attestation_unknown_issuer"],
      expectNoDiagnostics: [
        "pilot_session_attestation_failed",
        "pilot_session_attestation_rejected",
        "pilot_session_attestation_missing_id",
      ],
    },
  );
}

// ── Case 6 — no store reference ───────────────────────────────────────────────

function runCase6(): PilotSessionAttestationRegressionCaseResult {
  // No store: valid and pilot-trusted, but NOT production-trusted.
  const record: PilotSessionAttestationRecord = {
    ...BASE_RECORD,
    attestationId: "pilot-attest-no-store-001",
    reportId: "pilot-report-no-store-001",
    storeKind: "none",
  };

  return assertAttestation(
    "no_store_not_production_trusted",
    record,
    {
      expectValid: true,
      expectTrustedForPilot: true,
      expectTrustedForProduction: false,
      expectDiagnostics: ["pilot_session_attestation_no_store"],
      expectNoDiagnostics: [
        "pilot_session_attestation_failed",
        "pilot_session_attestation_rejected",
        "pilot_session_attestation_unknown_issuer",
      ],
    },
  );
}

// ── Case 7 — failed verification ──────────────────────────────────────────────

function runCase7(): PilotSessionAttestationRegressionCaseResult {
  const record: PilotSessionAttestationRecord = {
    ...BASE_RECORD,
    attestationId: "pilot-attest-failed-verify-001",
    reportId: "pilot-report-failed-verify-001",
    verificationStatus: "failed",
  };

  return assertAttestation(
    "failed_verification_invalid",
    record,
    {
      expectValid: false,
      expectTrustedForPilot: false,
      expectTrustedForProduction: false,
      expectDiagnostics: ["pilot_session_attestation_failed"],
      expectNoDiagnostics: [
        "pilot_session_attestation_missing_id",
        "pilot_session_attestation_rejected",
      ],
    },
  );
}

// ── Case 8 — rejected lifecycle ───────────────────────────────────────────────

function runCase8(): PilotSessionAttestationRegressionCaseResult {
  const record: PilotSessionAttestationRecord = {
    ...BASE_RECORD,
    attestationId: "pilot-attest-rejected-001",
    reportId: "pilot-report-rejected-001",
    lifecycleStatus: "rejected",
  };

  return assertAttestation(
    "rejected_lifecycle_invalid",
    record,
    {
      expectValid: false,
      expectTrustedForPilot: false,
      expectTrustedForProduction: false,
      expectDiagnostics: ["pilot_session_attestation_rejected"],
      expectNoDiagnostics: [
        "pilot_session_attestation_failed",
        "pilot_session_attestation_missing_id",
        "pilot_session_attestation_expired",
      ],
    },
  );
}

// ── Case 9 — expired lifecycle ────────────────────────────────────────────────

function runCase9(): PilotSessionAttestationRegressionCaseResult {
  // Expired: structurally valid (IDs present, verification not failed/rejected)
  // but not trusted for pilot or production.
  const record: PilotSessionAttestationRecord = {
    ...BASE_RECORD,
    attestationId: "pilot-attest-expired-001",
    reportId: "pilot-report-expired-001",
    lifecycleStatus: "expired",
  };

  return assertAttestation(
    "expired_lifecycle_valid_but_untrusted",
    record,
    {
      expectValid: true,
      expectTrustedForPilot: false,
      expectTrustedForProduction: false,
      expectDiagnostics: ["pilot_session_attestation_expired"],
      expectNoDiagnostics: [
        "pilot_session_attestation_rejected",
        "pilot_session_attestation_failed",
        "pilot_session_attestation_superseded",
      ],
    },
  );
}

// ── Case 10 — superseded lifecycle ────────────────────────────────────────────

function runCase10(): PilotSessionAttestationRegressionCaseResult {
  // Superseded: structurally valid but not trusted for pilot or production.
  const record: PilotSessionAttestationRecord = {
    ...BASE_RECORD,
    attestationId: "pilot-attest-superseded-001",
    reportId: "pilot-report-superseded-001",
    lifecycleStatus: "superseded",
    notes: ["Superseded by pilot-attest-regression-base-002."],
  };

  return assertAttestation(
    "superseded_lifecycle_valid_but_untrusted",
    record,
    {
      expectValid: true,
      expectTrustedForPilot: false,
      expectTrustedForProduction: false,
      expectDiagnostics: ["pilot_session_attestation_superseded"],
      expectNoDiagnostics: [
        "pilot_session_attestation_rejected",
        "pilot_session_attestation_failed",
        "pilot_session_attestation_expired",
      ],
    },
  );
}

// ── Scaffold runner ────────────────────────────────────────────────────────────

/**
 * Runs all 10 pilot session attestation regression cases and aggregates results.
 *
 * Does not throw. All assertions are collected as failure strings.
 * No auth. No DB. No session store. No persistence. No logging. No telemetry.
 * No Smart Talk runtime. No LLM. No pilot activation.
 */
export function runPilotSessionAttestationRegressionScaffold(): PilotSessionAttestationRegressionScaffoldResult {
  const caseResults: PilotSessionAttestationRegressionCaseResult[] = [
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
    `Pilot session attestation regression scaffold complete. ${String(passCount)}/${String(caseResults.length)} cases passed.`,
  ];

  if (allPassed) {
    notes.push(
      "All attestation rules validated: synthetic fixture pilot trust, future session " +
        "store production trust, missing-ID hard failures, unknown issuer/no-store soft " +
        "warnings, failed/rejected hard failures, expired/superseded lifecycle soft blocks.",
    );
    notes.push(
      "8.2F-15L: PilotSessionAttestationRecord and validatePilotSessionAttestation are " +
        "contract/scaffold only — no real auth, no DB, no session store, no persistence, " +
        "no runtime wiring, no pilot activation.",
    );
  } else {
    notes.push(
      `${String(failCount)} case(s) failed — review validationResult.diagnostics for details.`,
    );
  }

  notes.push(
    "Scaffold is metadata-only: no auth SDK, no database access, no session store, " +
      "no persistence, no logging, no telemetry, no Smart Talk runtime, no LLM called, " +
      "no pilot activation.",
  );

  return {
    scaffoldVersion: PILOT_SESSION_ATTESTATION_REGRESSION_VERSION,
    validatorVersion: PILOT_SESSION_ATTESTATION_VALIDATOR_VERSION,
    allPassed,
    caseResults,
    notes,
  };
}
