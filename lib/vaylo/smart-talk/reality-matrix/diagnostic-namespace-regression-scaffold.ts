/**
 * Cross-Phase Diagnostic Namespace regression scaffold (Phase 8.2F-15J).
 *
 * Eight structural cases exercising the DiagnosticNormalizedEnvelope model
 * and validateDiagnosticNamespaceEnvelopes:
 *
 *  Case 1 — valid free preview mapper diagnostic envelope
 *  Case 2 — valid bridge diagnostic envelope
 *  Case 3 — valid OCR uncertainty envelope
 *  Case 4 — empty diagnostic code → valid=false
 *  Case 5 — duplicate envelope key → valid=true, fullyConsistent=false
 *  Case 6 — unknown layer → valid=true, fullyConsistent=false
 *  Case 7 — neverUserVisible=false (forced via cast) → valid=false
 *  Case 8 — sample registry validation → all valid, fullyConsistent
 *
 * No Jest/Vitest. No CI hook. No runtime integration. No persistence.
 * No logging. No telemetry. No Smart Talk wiring. No OCR SDK. No LLM.
 */

import type {
  DiagnosticNamespaceValidationResult,
  DiagnosticNormalizedEnvelope,
} from "./diagnostic-namespace-types";
import {
  DIAGNOSTIC_NAMESPACE_REGISTRY_VERSION,
  DIAGNOSTIC_NAMESPACE_SAMPLE_REGISTRY,
  makeDiagnosticEnvelope,
  validateDiagnosticNamespaceEnvelopes,
} from "./diagnostic-namespace-registry";

export const DIAGNOSTIC_NAMESPACE_REGRESSION_VERSION =
  "8.2f-15j-diagnostic-namespace-regression-scaffold-v1";

// ── Result types ───────────────────────────────────────────────────────────────

export interface DiagnosticNamespaceRegressionCaseResult {
  readonly caseName: string;
  readonly passed: boolean;
  readonly validationResult: DiagnosticNamespaceValidationResult;
  readonly failures: readonly string[];
  readonly notes: readonly string[];
}

export interface DiagnosticNamespaceRegressionScaffoldResult {
  readonly scaffoldVersion: string;
  readonly registryVersion: string;
  readonly allPassed: boolean;
  readonly caseResults: readonly DiagnosticNamespaceRegressionCaseResult[];
  readonly notes: readonly string[];
}

// ── Assertion helper ───────────────────────────────────────────────────────────

function assertNamespace(
  caseName: string,
  envelopes: readonly DiagnosticNormalizedEnvelope[],
  opts: {
    expectValid: boolean;
    expectFullyConsistent: boolean;
    expectEmptyCodes?: boolean;
    expectUnknownLayers?: boolean;
    expectDuplicates?: boolean;
    expectUserVisibleViolations?: boolean;
  },
): DiagnosticNamespaceRegressionCaseResult {
  const result = validateDiagnosticNamespaceEnvelopes(envelopes);
  const failures: string[] = [];

  if (result.valid !== opts.expectValid) {
    failures.push(
      `valid: expected=${String(opts.expectValid)}, got=${String(result.valid)}`,
    );
  }
  if (result.fullyConsistent !== opts.expectFullyConsistent) {
    failures.push(
      `fullyConsistent: expected=${String(opts.expectFullyConsistent)}, got=${String(result.fullyConsistent)}`,
    );
  }
  if (opts.expectEmptyCodes === true && result.emptyCodes.length === 0) {
    failures.push("emptyCodes expected to be non-empty but was empty");
  }
  if (opts.expectEmptyCodes === false && result.emptyCodes.length > 0) {
    failures.push(`emptyCodes expected empty but got: ${result.emptyCodes.join(", ")}`);
  }
  if (opts.expectUnknownLayers === true && result.unknownLayers.length === 0) {
    failures.push("unknownLayers expected to be non-empty but was empty");
  }
  if (opts.expectUnknownLayers === false && result.unknownLayers.length > 0) {
    failures.push(`unknownLayers expected empty but got: ${result.unknownLayers.join(", ")}`);
  }
  if (opts.expectDuplicates === true && result.duplicateEnvelopeKeys.length === 0) {
    failures.push("duplicateEnvelopeKeys expected to be non-empty but was empty");
  }
  if (opts.expectDuplicates === false && result.duplicateEnvelopeKeys.length > 0) {
    failures.push(`duplicateEnvelopeKeys expected empty but got: ${result.duplicateEnvelopeKeys.join(", ")}`);
  }
  if (opts.expectUserVisibleViolations === true && result.userVisibleViolations.length === 0) {
    failures.push("userVisibleViolations expected to be non-empty but was empty");
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

// ── Case 1 — valid free preview mapper diagnostic envelope ────────────────────

function runCase1(): DiagnosticNamespaceRegressionCaseResult {
  const envelopes: DiagnosticNormalizedEnvelope[] = [
    makeDiagnosticEnvelope(
      "mapper_free_preview",
      "free_preview_paid_field_blocked",
      "informational",
      { phase: "8.2F-3/15C" },
    ),
    makeDiagnosticEnvelope(
      "mapper_free_preview",
      "free_preview_legal_verdict_blocked",
      "blocking",
      { phase: "8.2F-15C" },
    ),
  ];

  return assertNamespace("valid_free_preview_mapper_envelopes", envelopes, {
    expectValid: true,
    expectFullyConsistent: true,
    expectEmptyCodes: false,
    expectUnknownLayers: false,
    expectDuplicates: false,
  });
}

// ── Case 2 — valid bridge diagnostic envelope ─────────────────────────────────

function runCase2(): DiagnosticNamespaceRegressionCaseResult {
  const envelopes: DiagnosticNormalizedEnvelope[] = [
    makeDiagnosticEnvelope(
      "bridge",
      "bridge_governance_preservation_failure",
      "blocking",
      { phase: "8.2F-6" },
    ),
    makeDiagnosticEnvelope(
      "bridge",
      "bridge_contract_tier_mismatch",
      "informational",
      { phase: "8.2F-6A", notes: ["Observability-only; non-blocking."] },
    ),
    makeDiagnosticEnvelope(
      "bridge",
      "bridge_invalid_section_invariant",
      "blocking",
      { phase: "8.2F-6" },
    ),
  ];

  return assertNamespace("valid_bridge_envelopes", envelopes, {
    expectValid: true,
    expectFullyConsistent: true,
    expectEmptyCodes: false,
    expectUnknownLayers: false,
    expectDuplicates: false,
  });
}

// ── Case 3 — valid OCR uncertainty envelope ───────────────────────────────────

function runCase3(): DiagnosticNamespaceRegressionCaseResult {
  const envelopes: DiagnosticNormalizedEnvelope[] = [
    makeDiagnosticEnvelope(
      "ocr_uncertainty",
      "ocr_low_confidence",
      "warning",
      { phase: "8.2F-14/15E" },
    ),
    makeDiagnosticEnvelope(
      "ocr_uncertainty",
      "pilot_ocr_confidence_unattested",
      "informational",
      { phase: "8.2F-15E" },
    ),
    makeDiagnosticEnvelope(
      "provenance_audit",
      "trace_missing_root",
      "blocking",
      { phase: "8.2F-14" },
    ),
  ];

  return assertNamespace("valid_ocr_and_provenance_envelopes", envelopes, {
    expectValid: true,
    expectFullyConsistent: true,
    expectEmptyCodes: false,
    expectUnknownLayers: false,
    expectDuplicates: false,
  });
}

// ── Case 4 — empty diagnostic code → valid=false ──────────────────────────────

function runCase4(): DiagnosticNamespaceRegressionCaseResult {
  const envelopes: DiagnosticNormalizedEnvelope[] = [
    makeDiagnosticEnvelope(
      "bridge",
      // intentionally empty code — structural violation
      "",
      "blocking",
      { phase: "8.2F-6" },
    ),
    makeDiagnosticEnvelope(
      "pilot_gate",
      "pilot_session_limit_exceeded",
      "blocking",
      { phase: "8.2F-14" },
    ),
  ];

  return assertNamespace("empty_code_hard_failure", envelopes, {
    expectValid: false,
    expectFullyConsistent: false,
    expectEmptyCodes: true,
  });
}

// ── Case 5 — duplicate envelope key → valid=true, fullyConsistent=false ───────

function runCase5(): DiagnosticNamespaceRegressionCaseResult {
  // Same layer + code + phase combination twice → duplicate key.
  const envelopes: DiagnosticNormalizedEnvelope[] = [
    makeDiagnosticEnvelope(
      "mapper_paid_explanation",
      "paid_legal_verdict_blocked",
      "blocking",
      { phase: "8.2F-15C" },
    ),
    makeDiagnosticEnvelope(
      "mapper_paid_explanation",
      "paid_legal_verdict_blocked",
      "blocking",
      { phase: "8.2F-15C" },
    ),
    makeDiagnosticEnvelope(
      "mapper_paid_explanation",
      "paid_deadline_output_blocked",
      "blocking",
      { phase: "8.2F-4" },
    ),
  ];

  return assertNamespace("duplicate_key_soft_warning", envelopes, {
    expectValid: true,
    expectFullyConsistent: false,
    expectDuplicates: true,
    expectUnknownLayers: false,
  });
}

// ── Case 6 — unknown layer → valid=true, fullyConsistent=false ────────────────

function runCase6(): DiagnosticNamespaceRegressionCaseResult {
  const envelopes: DiagnosticNormalizedEnvelope[] = [
    makeDiagnosticEnvelope(
      "unknown",
      "some_unclassified_diagnostic",
      "warning",
      { notes: ["Layer is unknown; diagnostic origin unresolved."] },
    ),
    makeDiagnosticEnvelope(
      "bridge",
      "bridge_free_preview_leakage",
      "blocking",
      { phase: "8.2F-6" },
    ),
  ];

  return assertNamespace("unknown_layer_soft_warning", envelopes, {
    expectValid: true,
    expectFullyConsistent: false,
    expectUnknownLayers: true,
    expectDuplicates: false,
    expectEmptyCodes: false,
  });
}

// ── Case 7 — neverUserVisible=false forced via cast → valid=false ─────────────

function runCase7(): DiagnosticNamespaceRegressionCaseResult {
  // Force neverUserVisible: false via a type cast to simulate a corrupted envelope.
  const corruptEnvelope = {
    layer: "bridge",
    code: "bridge_governance_preservation_failure",
    severity: "blocking",
    visibility: "never_user_visible",
    // Intentionally violating the neverUserVisible invariant.
    neverUserVisible: false,
  } as unknown as DiagnosticNormalizedEnvelope;

  const envelopes: DiagnosticNormalizedEnvelope[] = [
    corruptEnvelope,
    makeDiagnosticEnvelope(
      "pilot_gate",
      "pilot_session_telemetry_unattested",
      "informational",
      { phase: "8.2F-15F" },
    ),
  ];

  return assertNamespace("user_visible_violation_hard_failure", envelopes, {
    expectValid: false,
    expectFullyConsistent: false,
    expectUserVisibleViolations: true,
    expectEmptyCodes: false,
  });
}

// ── Case 8 — sample registry validation ──────────────────────────────────────

function runCase8(): DiagnosticNamespaceRegressionCaseResult {
  // Validates the full DIAGNOSTIC_NAMESPACE_SAMPLE_REGISTRY.
  // All entries should be structurally valid, have known layers, non-empty codes,
  // and no duplicate keys.
  const result = validateDiagnosticNamespaceEnvelopes(DIAGNOSTIC_NAMESPACE_SAMPLE_REGISTRY);
  const failures: string[] = [];

  if (!result.valid) {
    failures.push(
      `Sample registry must be fully valid. Violations: ` +
        `emptyCodes=[${result.emptyCodes.join(", ")}], ` +
        `userVisibleViolations=[${result.userVisibleViolations.join(", ")}]`,
    );
  }
  if (!result.fullyConsistent) {
    failures.push(
      `Sample registry must be fullyConsistent. Issues: ` +
        `unknownLayers=[${result.unknownLayers.join(", ")}], ` +
        `duplicateKeys=[${result.duplicateEnvelopeKeys.join(", ")}]`,
    );
  }
  if (!result.neverUserVisible) {
    failures.push("neverUserVisible must be true on sample registry validation result");
  }

  const passed = failures.length === 0;
  return {
    caseName: "sample_registry_fully_consistent",
    passed,
    validationResult: result,
    failures,
    notes: [
      passed
        ? `Case "sample_registry_fully_consistent" passed — all ${String(DIAGNOSTIC_NAMESPACE_SAMPLE_REGISTRY.length)} sample envelopes are valid and consistent.`
        : `Case "sample_registry_fully_consistent" failed with ${String(failures.length)} failure(s).`,
      "Sample registry covers: mapper_free_preview, mapper_paid_explanation, bridge, ocr_uncertainty, pilot_gate, incident_governance, provenance_audit, wording_evaluation layers.",
    ],
  };
}

// ── Scaffold runner ────────────────────────────────────────────────────────────

/**
 * Runs all 8 diagnostic namespace regression cases and aggregates results.
 *
 * Does not throw. All assertions are collected as failure strings.
 * No persistence. No logging. No telemetry. No Smart Talk runtime. No LLM.
 */
export function runDiagnosticNamespaceRegressionScaffold(): DiagnosticNamespaceRegressionScaffoldResult {
  const caseResults: DiagnosticNamespaceRegressionCaseResult[] = [
    runCase1(),
    runCase2(),
    runCase3(),
    runCase4(),
    runCase5(),
    runCase6(),
    runCase7(),
    runCase8(),
  ];

  const allPassed = caseResults.every((r) => r.passed);
  const passCount = caseResults.filter((r) => r.passed).length;
  const failCount = caseResults.length - passCount;

  const notes: string[] = [
    `Diagnostic namespace regression scaffold complete. ${String(passCount)}/${String(caseResults.length)} cases passed.`,
  ];

  if (allPassed) {
    notes.push(
      "All envelope model rules validated: valid envelope construction, empty-code hard failure, " +
        "user-visible-violation hard failure, unknown-layer soft warning, duplicate-key soft warning, " +
        "and full sample registry consistency.",
    );
    notes.push(
      "8.2F-15J: DiagnosticNormalizedEnvelope provides cross-phase namespace identity. " +
        "Source modules retain their own typed unions; no diagnostic codes renamed or removed.",
    );
  } else {
    notes.push(
      `${String(failCount)} case(s) failed — review validationResult fields for details.`,
    );
  }

  notes.push(
    "Scaffold is metadata-only: no persistence, no logging, no telemetry, " +
      "no Smart Talk runtime, no OCR SDK, no LLM called.",
  );

  return {
    scaffoldVersion: DIAGNOSTIC_NAMESPACE_REGRESSION_VERSION,
    registryVersion: DIAGNOSTIC_NAMESPACE_REGISTRY_VERSION,
    allPassed,
    caseResults,
    notes,
  };
}
