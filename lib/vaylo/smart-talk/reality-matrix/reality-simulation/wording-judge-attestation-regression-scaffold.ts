/**
 * Wording Judge Attestation regression scaffold (Phase 8.2F-15M).
 *
 * Eleven structural cases exercising validateWordingJudgeAttestation:
 *
 *  Case  1 — valid synthetic fixture attestation
 *             → valid=true, trustedForPilot=true, trustedForProduction=false
 *  Case  2 — future LLM judge verified + database/review store reference
 *             → valid=true, trustedForPilot=true, trustedForProduction=true
 *  Case  3 — manual reviewer verified + review store reference
 *             → valid=true, trustedForPilot=true, trustedForProduction=true
 *  Case  4 — missing attestationId
 *             → valid=false, trustedForPilot=false
 *  Case  5 — missing reportId
 *             → valid=false, trustedForPilot=false
 *  Case  6 — unknown issuer
 *             → valid=true, trustedForPilot=true, trustedForProduction=false
 *  Case  7 — no store reference
 *             → valid=true, trustedForPilot=true, trustedForProduction=false
 *  Case  8 — failed verification
 *             → valid=false, trustedForPilot=false, trustedForProduction=false
 *  Case  9 — rejected lifecycle
 *             → valid=false, trustedForPilot=false, trustedForProduction=false
 *  Case 10 — expired lifecycle
 *             → valid=true, trustedForPilot=false, trustedForProduction=false
 *  Case 11 — superseded lifecycle
 *             → valid=true, trustedForPilot=false, trustedForProduction=false
 *
 * No Jest/Vitest. No CI hook. No runtime integration. No persistence.
 * No logging. No telemetry. No Smart Talk wiring. No LLM SDK.
 * No NLP. No real text evaluation. No user-visible output generation.
 */

import type {
  WordingJudgeAttestationRecord,
  WordingJudgeAttestationValidationDiagnostic,
  WordingJudgeAttestationValidationResult,
} from "./wording-judge-attestation-types";
import {
  WORDING_JUDGE_ATTESTATION_VALIDATOR_VERSION,
  validateWordingJudgeAttestation,
} from "./validate-wording-judge-attestation";

export const WORDING_JUDGE_ATTESTATION_REGRESSION_VERSION =
  "8.2f-15m-wording-judge-attestation-regression-scaffold-v1";

// ── Result types ───────────────────────────────────────────────────────────────

export interface WordingJudgeAttestationRegressionCaseResult {
  readonly caseName: string;
  readonly passed: boolean;
  readonly validationResult: WordingJudgeAttestationValidationResult;
  readonly failures: readonly string[];
  readonly notes: readonly string[];
}

export interface WordingJudgeAttestationRegressionScaffoldResult {
  readonly scaffoldVersion: string;
  readonly validatorVersion: string;
  readonly allPassed: boolean;
  readonly caseResults: readonly WordingJudgeAttestationRegressionCaseResult[];
  readonly notes: readonly string[];
}

// ── Base fixture ───────────────────────────────────────────────────────────────

const BASE_RECORD: WordingJudgeAttestationRecord = {
  attestationId: "wording-attest-regression-base-001",
  reportId: "wording-report-regression-base-001",
  issuerKind: "synthetic_fixture",
  storeKind: "in_memory_test_fixture",
  attestationMethod: "fixture_declared",
  verificationStatus: "not_applicable",
  lifecycleStatus: "validated",
  generatedBy: "wording-judge-attestation-regression-scaffold-v1",
  neverUserVisible: true,
  notes: ["Base synthetic fixture for wording judge attestation regression testing."],
};

// ── Assertion helper ───────────────────────────────────────────────────────────

function assertAttestation(
  caseName: string,
  record: WordingJudgeAttestationRecord,
  opts: {
    expectValid: boolean;
    expectTrustedForPilot: boolean;
    expectTrustedForProduction: boolean;
    expectDiagnostics?: readonly WordingJudgeAttestationValidationDiagnostic[];
    expectNoDiagnostics?: readonly WordingJudgeAttestationValidationDiagnostic[];
  },
): WordingJudgeAttestationRegressionCaseResult {
  const result = validateWordingJudgeAttestation(record);
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

function runCase1(): WordingJudgeAttestationRegressionCaseResult {
  // Synthetic fixture with fixture_declared method and not_applicable verification.
  // Trusted for pilot (acceptable verification for synthetic fixtures), but NOT for
  // production (no verified LLM judge or human review system; in_memory store only).
  return assertAttestation(
    "valid_synthetic_fixture",
    BASE_RECORD,
    {
      expectValid: true,
      expectTrustedForPilot: true,
      expectTrustedForProduction: false,
      expectNoDiagnostics: [
        "wording_judge_attestation_missing_id",
        "wording_judge_attestation_missing_report_id",
        "wording_judge_attestation_missing_generated_by",
        "wording_judge_attestation_failed",
        "wording_judge_attestation_rejected",
        "wording_judge_attestation_unknown_issuer",
      ],
    },
  );
}

// ── Case 2 — future LLM judge verified + review store reference ───────────────

function runCase2(): WordingJudgeAttestationRegressionCaseResult {
  // Represents the desired future production state with LLM judge:
  // - future_llm_judge as issuer
  // - future_review_store_record as store
  // - future_judge_signed attestation method
  // - verified verification status
  // Trusted for both pilot AND production.
  const record: WordingJudgeAttestationRecord = {
    ...BASE_RECORD,
    attestationId: "wording-attest-llm-judge-001",
    reportId: "wording-report-llm-judge-001",
    issuerKind: "future_llm_judge",
    storeKind: "future_review_store_record",
    attestationMethod: "future_judge_signed",
    verificationStatus: "verified",
    lifecycleStatus: "validated",
    generatedBy: "future-llm-judge-stub-v1",
    notes: [
      "Structural stub: represents future verified LLM judge attestation.",
      "No real LLM judge is connected in this phase. No NLP. No real text evaluation.",
    ],
  };

  return assertAttestation(
    "future_llm_judge_verified_production_trust",
    record,
    {
      expectValid: true,
      expectTrustedForPilot: true,
      expectTrustedForProduction: true,
      expectNoDiagnostics: [
        "wording_judge_attestation_missing_id",
        "wording_judge_attestation_missing_report_id",
        "wording_judge_attestation_failed",
        "wording_judge_attestation_rejected",
        "wording_judge_attestation_unknown_issuer",
        "wording_judge_attestation_no_store",
        "wording_judge_attestation_unverified",
      ],
    },
  );
}

// ── Case 3 — manual reviewer verified + review store reference ────────────────

function runCase3(): WordingJudgeAttestationRegressionCaseResult {
  // Manual reviewer with verified status and a real store reference.
  // Trusted for both pilot AND production.
  // Demonstrates that human review can also achieve production trust.
  const record: WordingJudgeAttestationRecord = {
    ...BASE_RECORD,
    attestationId: "wording-attest-manual-review-001",
    reportId: "wording-report-manual-review-001",
    issuerKind: "manual_reviewer",
    storeKind: "future_database_record",
    attestationMethod: "manual_review_declared",
    verificationStatus: "verified",
    lifecycleStatus: "validated",
    generatedBy: "manual-reviewer-governance-audit-v1",
    notes: [
      "Structural stub: represents future verified manual reviewer attestation.",
      "No real review management system is connected in this phase.",
    ],
  };

  return assertAttestation(
    "manual_reviewer_verified_production_trust",
    record,
    {
      expectValid: true,
      expectTrustedForPilot: true,
      expectTrustedForProduction: true,
      expectNoDiagnostics: [
        "wording_judge_attestation_missing_id",
        "wording_judge_attestation_missing_report_id",
        "wording_judge_attestation_failed",
        "wording_judge_attestation_rejected",
        "wording_judge_attestation_unknown_issuer",
        "wording_judge_attestation_no_store",
        "wording_judge_attestation_unverified",
      ],
    },
  );
}

// ── Case 4 — missing attestationId ────────────────────────────────────────────

function runCase4(): WordingJudgeAttestationRegressionCaseResult {
  const record: WordingJudgeAttestationRecord = {
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
      expectDiagnostics: ["wording_judge_attestation_missing_id"],
      expectNoDiagnostics: ["wording_judge_attestation_missing_report_id"],
    },
  );
}

// ── Case 5 — missing reportId ─────────────────────────────────────────────────

function runCase5(): WordingJudgeAttestationRegressionCaseResult {
  const record: WordingJudgeAttestationRecord = {
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
      expectDiagnostics: ["wording_judge_attestation_missing_report_id"],
      expectNoDiagnostics: ["wording_judge_attestation_missing_id"],
    },
  );
}

// ── Case 6 — unknown issuer ───────────────────────────────────────────────────

function runCase6(): WordingJudgeAttestationRegressionCaseResult {
  // Unknown issuer: valid but not trusted for production.
  // trustedForPilot still true (lifecycle validated, verification not_applicable).
  const record: WordingJudgeAttestationRecord = {
    ...BASE_RECORD,
    attestationId: "wording-attest-unknown-issuer-001",
    reportId: "wording-report-unknown-issuer-001",
    issuerKind: "unknown",
  };

  return assertAttestation(
    "unknown_issuer_not_production_trusted",
    record,
    {
      expectValid: true,
      expectTrustedForPilot: true,
      expectTrustedForProduction: false,
      expectDiagnostics: ["wording_judge_attestation_unknown_issuer"],
      expectNoDiagnostics: [
        "wording_judge_attestation_failed",
        "wording_judge_attestation_rejected",
        "wording_judge_attestation_missing_id",
      ],
    },
  );
}

// ── Case 7 — no store reference ───────────────────────────────────────────────

function runCase7(): WordingJudgeAttestationRegressionCaseResult {
  // No store: valid and pilot-trusted, but NOT production-trusted.
  const record: WordingJudgeAttestationRecord = {
    ...BASE_RECORD,
    attestationId: "wording-attest-no-store-001",
    reportId: "wording-report-no-store-001",
    storeKind: "none",
  };

  return assertAttestation(
    "no_store_not_production_trusted",
    record,
    {
      expectValid: true,
      expectTrustedForPilot: true,
      expectTrustedForProduction: false,
      expectDiagnostics: ["wording_judge_attestation_no_store"],
      expectNoDiagnostics: [
        "wording_judge_attestation_failed",
        "wording_judge_attestation_rejected",
        "wording_judge_attestation_unknown_issuer",
      ],
    },
  );
}

// ── Case 8 — failed verification ──────────────────────────────────────────────

function runCase8(): WordingJudgeAttestationRegressionCaseResult {
  const record: WordingJudgeAttestationRecord = {
    ...BASE_RECORD,
    attestationId: "wording-attest-failed-verify-001",
    reportId: "wording-report-failed-verify-001",
    verificationStatus: "failed",
  };

  return assertAttestation(
    "failed_verification_invalid",
    record,
    {
      expectValid: false,
      expectTrustedForPilot: false,
      expectTrustedForProduction: false,
      expectDiagnostics: ["wording_judge_attestation_failed"],
      expectNoDiagnostics: [
        "wording_judge_attestation_missing_id",
        "wording_judge_attestation_rejected",
      ],
    },
  );
}

// ── Case 9 — rejected lifecycle ───────────────────────────────────────────────

function runCase9(): WordingJudgeAttestationRegressionCaseResult {
  const record: WordingJudgeAttestationRecord = {
    ...BASE_RECORD,
    attestationId: "wording-attest-rejected-001",
    reportId: "wording-report-rejected-001",
    lifecycleStatus: "rejected",
  };

  return assertAttestation(
    "rejected_lifecycle_invalid",
    record,
    {
      expectValid: false,
      expectTrustedForPilot: false,
      expectTrustedForProduction: false,
      expectDiagnostics: ["wording_judge_attestation_rejected"],
      expectNoDiagnostics: [
        "wording_judge_attestation_failed",
        "wording_judge_attestation_missing_id",
        "wording_judge_attestation_expired",
      ],
    },
  );
}

// ── Case 10 — expired lifecycle ────────────────────────────────────────────────

function runCase10(): WordingJudgeAttestationRegressionCaseResult {
  // Expired: structurally valid (IDs present, verification not failed/rejected)
  // but not trusted for pilot or production.
  const record: WordingJudgeAttestationRecord = {
    ...BASE_RECORD,
    attestationId: "wording-attest-expired-001",
    reportId: "wording-report-expired-001",
    lifecycleStatus: "expired",
  };

  return assertAttestation(
    "expired_lifecycle_valid_but_untrusted",
    record,
    {
      expectValid: true,
      expectTrustedForPilot: false,
      expectTrustedForProduction: false,
      expectDiagnostics: ["wording_judge_attestation_expired"],
      expectNoDiagnostics: [
        "wording_judge_attestation_rejected",
        "wording_judge_attestation_failed",
        "wording_judge_attestation_superseded",
      ],
    },
  );
}

// ── Case 11 — superseded lifecycle ────────────────────────────────────────────

function runCase11(): WordingJudgeAttestationRegressionCaseResult {
  // Superseded: structurally valid but not trusted for pilot or production.
  const record: WordingJudgeAttestationRecord = {
    ...BASE_RECORD,
    attestationId: "wording-attest-superseded-001",
    reportId: "wording-report-superseded-001",
    lifecycleStatus: "superseded",
    notes: ["Superseded by wording-attest-regression-base-002."],
  };

  return assertAttestation(
    "superseded_lifecycle_valid_but_untrusted",
    record,
    {
      expectValid: true,
      expectTrustedForPilot: false,
      expectTrustedForProduction: false,
      expectDiagnostics: ["wording_judge_attestation_superseded"],
      expectNoDiagnostics: [
        "wording_judge_attestation_rejected",
        "wording_judge_attestation_failed",
        "wording_judge_attestation_expired",
      ],
    },
  );
}

// ── Scaffold runner ────────────────────────────────────────────────────────────

/**
 * Runs all 11 wording judge attestation regression cases and aggregates results.
 *
 * Does not throw. All assertions are collected as failure strings.
 * No LLM calls. No NLP. No real text evaluation. No user-visible output generation.
 * No DB access. No review store. No persistence. No logging. No telemetry.
 * No Smart Talk runtime.
 */
export function runWordingJudgeAttestationRegressionScaffold(): WordingJudgeAttestationRegressionScaffoldResult {
  const caseResults: WordingJudgeAttestationRegressionCaseResult[] = [
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
    runCase11(),
  ];

  const allPassed = caseResults.every((r) => r.passed);
  const passCount = caseResults.filter((r) => r.passed).length;
  const failCount = caseResults.length - passCount;

  const notes: string[] = [
    `Wording judge attestation regression scaffold complete. ${String(passCount)}/${String(caseResults.length)} cases passed.`,
  ];

  if (allPassed) {
    notes.push(
      "All attestation rules validated: synthetic fixture pilot trust, future LLM judge " +
        "production trust, manual reviewer production trust, missing-ID hard failures, " +
        "unknown issuer/no-store soft warnings, failed/rejected hard failures, " +
        "expired/superseded lifecycle soft blocks.",
    );
    notes.push(
      "8.2F-15M: WordingJudgeAttestationRecord and validateWordingJudgeAttestation are " +
        "contract/scaffold only — no real LLM judge, no NLP, no real text evaluation, " +
        "no DB, no persistence, no runtime wiring.",
    );
  } else {
    notes.push(
      `${String(failCount)} case(s) failed — review validationResult.diagnostics for details.`,
    );
  }

  notes.push(
    "Scaffold is metadata-only: no LLM SDK, no NLP library, no real text evaluation, " +
      "no user-visible output, no database access, no review store, no persistence, " +
      "no logging, no telemetry, no Smart Talk runtime.",
  );

  return {
    scaffoldVersion: WORDING_JUDGE_ATTESTATION_REGRESSION_VERSION,
    validatorVersion: WORDING_JUDGE_ATTESTATION_VALIDATOR_VERSION,
    allPassed,
    caseResults,
    notes,
  };
}
