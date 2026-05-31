/**
 * Diagnostic Envelope Adapter Regression Scaffold (Phase 8.2F-15O).
 *
 * Pure regression harness for `buildDiagnosticEnvelopeFromNativeDiagnostic`
 * and `buildDiagnosticEnvelopesFromNativeDiagnostics`. Covers 12 cases
 * including namespace validation integration (Case 12).
 *
 * No Jest, no Vitest, no CI hooks, no runtime coupling.
 *
 * Run by importing and calling `runDiagnosticEnvelopeAdapterRegressionScaffold()`.
 *
 * Safety guarantees:
 * - no persistence
 * - no logging
 * - no telemetry
 * - no Smart Talk runtime connection
 * - no source module modifications
 * - no diagnostic code changes
 * - no user-visible output
 */

import type { DiagnosticEnvelopeAdapterInput } from "./diagnostic-envelope-adapter-types";

import {
  buildDiagnosticEnvelopeFromNativeDiagnostic,
  buildDiagnosticEnvelopesFromNativeDiagnostics,
  DIAGNOSTIC_ENVELOPE_ADAPTER_VERSION,
} from "./build-diagnostic-envelope-adapter";
import { validateDiagnosticNamespaceEnvelopes } from "./diagnostic-namespace-registry";

export const DIAGNOSTIC_ENVELOPE_ADAPTER_REGRESSION_VERSION =
  "8.2f-15o-diagnostic-envelope-adapter-regression-v1";

// ── Assertion helpers ──────────────────────────────────────────────────────────

interface AdapterAssertionResult {
  readonly case: string;
  readonly passed: boolean;
  readonly failures: readonly string[];
  readonly neverUserVisible: true;
}

function assertAdapter(
  caseName: string,
  input: DiagnosticEnvelopeAdapterInput,
  expectations: {
    adapted?: boolean;
    layer?: string;
    diagnostics?: readonly string[];
    noDiagnostics?: readonly string[];
    envelopeCode?: string;
  },
): AdapterAssertionResult {
  const result = buildDiagnosticEnvelopeFromNativeDiagnostic(input);
  const failures: string[] = [];

  if (
    expectations.adapted !== undefined &&
    result.adapted !== expectations.adapted
  ) {
    failures.push(`Expected adapted=${expectations.adapted}, got ${result.adapted}`);
  }
  if (
    expectations.layer !== undefined &&
    result.envelope.layer !== expectations.layer
  ) {
    failures.push(
      `Expected layer="${expectations.layer}", got "${result.envelope.layer}"`,
    );
  }
  if (expectations.envelopeCode !== undefined) {
    if (result.envelope.code !== expectations.envelopeCode) {
      failures.push(
        `Expected envelope.code="${expectations.envelopeCode}", got "${result.envelope.code}"`,
      );
    }
  }
  if (expectations.diagnostics) {
    for (const diag of expectations.diagnostics) {
      if (!(result.diagnostics as readonly string[]).includes(diag)) {
        failures.push(`Expected adapter diagnostic "${diag}" to be present.`);
      }
    }
  }
  if (expectations.noDiagnostics) {
    for (const diag of expectations.noDiagnostics) {
      if ((result.diagnostics as readonly string[]).includes(diag)) {
        failures.push(`Expected adapter diagnostic "${diag}" to be absent.`);
      }
    }
  }

  return {
    case: caseName,
    passed: failures.length === 0,
    failures,
    neverUserVisible: true,
  };
}

// ── Synthetic fixtures ─────────────────────────────────────────────────────────

const FREE_PREVIEW_INPUT: DiagnosticEnvelopeAdapterInput = {
  sourceKind: "native_mapper_free_preview",
  code: "free_preview_paid_field_blocked",
  severity: "blocking",
  phase: "8.2F-15O",
  sourceVersion: "8.2f-15o-regression-v1",
  neverUserVisible: true,
  notes: ["Free preview mapper blocked a paid field access."],
};

const PAID_MAPPER_INPUT: DiagnosticEnvelopeAdapterInput = {
  sourceKind: "native_mapper_paid_explanation",
  code: "paid_legal_verdict_blocked",
  severity: "blocking",
  phase: "8.2F-15O",
  sourceVersion: "8.2f-15o-regression-v1",
  neverUserVisible: true,
  notes: ["Paid mapper blocked a legal verdict explanation."],
};

const BRIDGE_INPUT: DiagnosticEnvelopeAdapterInput = {
  sourceKind: "native_bridge",
  code: "bridge_section_invariant_violated",
  severity: "blocking",
  phase: "8.2F-15O",
  neverUserVisible: true,
};

const OCR_INPUT: DiagnosticEnvelopeAdapterInput = {
  sourceKind: "native_ocr_uncertainty",
  code: "ocr_confidence_unacceptably_low",
  severity: "critical",
  phase: "8.2F-15O",
  neverUserVisible: true,
};

const PILOT_GATE_INPUT: DiagnosticEnvelopeAdapterInput = {
  sourceKind: "native_pilot_gate",
  code: "pilot_gate_transaction_blocked",
  severity: "blocking",
  phase: "8.2F-15O",
  neverUserVisible: true,
};

const INCIDENT_INPUT: DiagnosticEnvelopeAdapterInput = {
  sourceKind: "native_incident_governance",
  code: "incident_false_reassurance_detected",
  severity: "critical",
  phase: "8.2F-15O",
  neverUserVisible: true,
};

// ── Regression cases ───────────────────────────────────────────────────────────

/**
 * Runs the full 12-case regression scaffold for Phase 8.2F-15O.
 *
 * Returns a never-user-visible summary record. No persistence, no logging,
 * no telemetry, no source module modification.
 */
export function runDiagnosticEnvelopeAdapterRegressionScaffold(): {
  readonly scaffoldVersion: string;
  readonly adapterVersion: string;
  readonly totalCases: number;
  readonly passed: number;
  readonly failed: number;
  readonly caseResults: readonly AdapterAssertionResult[];
  readonly neverUserVisible: true;
} {
  const results: AdapterAssertionResult[] = [];

  // ── Case 1: Free preview mapper diagnostic → mapper_free_preview layer ────

  results.push(
    assertAdapter(
      "Case 1 — free preview mapper diagnostic → mapper_free_preview envelope",
      FREE_PREVIEW_INPUT,
      {
        adapted: true,
        layer: "mapper_free_preview",
        envelopeCode: "free_preview_paid_field_blocked",
        noDiagnostics: [
          "diagnostic_adapter_empty_code",
          "diagnostic_adapter_user_visible_violation",
          "diagnostic_adapter_unknown_source",
        ],
      },
    ),
  );

  // ── Case 2: Paid mapper diagnostic → mapper_paid_explanation layer ─────────

  results.push(
    assertAdapter(
      "Case 2 — paid mapper diagnostic → mapper_paid_explanation envelope",
      PAID_MAPPER_INPUT,
      {
        adapted: true,
        layer: "mapper_paid_explanation",
        envelopeCode: "paid_legal_verdict_blocked",
      },
    ),
  );

  // ── Case 3: Bridge diagnostic → bridge layer ──────────────────────────────

  results.push(
    assertAdapter(
      "Case 3 — bridge diagnostic → bridge envelope",
      BRIDGE_INPUT,
      {
        adapted: true,
        layer: "bridge",
        envelopeCode: "bridge_section_invariant_violated",
        // No severity provided → default used
        diagnostics: ["diagnostic_adapter_default_severity_used"],
      },
    ),
  );

  // ── Case 4: OCR diagnostic → ocr_uncertainty layer ───────────────────────

  results.push(
    assertAdapter(
      "Case 4 — OCR diagnostic → ocr_uncertainty envelope",
      OCR_INPUT,
      {
        adapted: true,
        layer: "ocr_uncertainty",
        envelopeCode: "ocr_confidence_unacceptably_low",
        noDiagnostics: ["diagnostic_adapter_default_severity_used"],
      },
    ),
  );

  // ── Case 5: Pilot gate diagnostic → pilot_gate layer ─────────────────────

  results.push(
    assertAdapter(
      "Case 5 — pilot gate diagnostic → pilot_gate envelope",
      PILOT_GATE_INPUT,
      {
        adapted: true,
        layer: "pilot_gate",
        envelopeCode: "pilot_gate_transaction_blocked",
      },
    ),
  );

  // ── Case 6: Incident governance diagnostic → incident_governance layer ────

  results.push(
    assertAdapter(
      "Case 6 — incident governance diagnostic → incident_governance envelope",
      INCIDENT_INPUT,
      {
        adapted: true,
        layer: "incident_governance",
        envelopeCode: "incident_false_reassurance_detected",
      },
    ),
  );

  // ── Case 7: Unknown source → unknown layer + diagnostic_adapter_unknown_source

  const unknownSourceInput: DiagnosticEnvelopeAdapterInput = {
    sourceKind: "unknown",
    code: "some_unclassified_diagnostic",
    severity: "warning",
    neverUserVisible: true,
  };
  results.push(
    assertAdapter(
      "Case 7 — unknown source → unknown layer + diagnostic_adapter_unknown_source",
      unknownSourceInput,
      {
        adapted: true,
        layer: "unknown",
        diagnostics: ["diagnostic_adapter_unknown_source"],
        noDiagnostics: [
          "diagnostic_adapter_empty_code",
          "diagnostic_adapter_user_visible_violation",
        ],
      },
    ),
  );

  // ── Case 8: Empty code → adapted false + diagnostic_adapter_empty_code ────

  const emptyCodeInput: DiagnosticEnvelopeAdapterInput = {
    sourceKind: "native_bridge",
    code: "   ",
    severity: "warning",
    neverUserVisible: true,
  };
  results.push(
    assertAdapter(
      "Case 8 — empty code → adapted false + diagnostic_adapter_empty_code",
      emptyCodeInput,
      {
        adapted: false,
        diagnostics: ["diagnostic_adapter_empty_code"],
        noDiagnostics: ["diagnostic_adapter_user_visible_violation"],
      },
    ),
  );

  // ── Case 9: neverUserVisible false forced via cast → adapted false ─────────

  const badVisibilityInput = {
    sourceKind: "native_pilot_gate",
    code: "pilot_gate_transaction_blocked",
    severity: "blocking",
    neverUserVisible: false as unknown as true,
  } satisfies DiagnosticEnvelopeAdapterInput;

  results.push(
    assertAdapter(
      "Case 9 — neverUserVisible false forced via cast → adapted false + user_visible_violation",
      badVisibilityInput,
      {
        adapted: false,
        diagnostics: ["diagnostic_adapter_user_visible_violation"],
        noDiagnostics: ["diagnostic_adapter_empty_code"],
      },
    ),
  );

  // ── Case 10: Batch adapter with all-valid inputs → allAdapted true ─────────

  const batchValidInputs: readonly DiagnosticEnvelopeAdapterInput[] = [
    FREE_PREVIEW_INPUT,
    PAID_MAPPER_INPUT,
    PILOT_GATE_INPUT,
    INCIDENT_INPUT,
  ];

  const batchValidResult = buildDiagnosticEnvelopesFromNativeDiagnostics(batchValidInputs);

  const case10Failures: string[] = [];
  if (!batchValidResult.allAdapted) {
    case10Failures.push(
      "Expected allAdapted=true for all-valid batch; got false.",
    );
  }
  if (batchValidResult.envelopes.length !== batchValidInputs.length) {
    case10Failures.push(
      `Expected ${batchValidInputs.length} envelopes, got ${batchValidResult.envelopes.length}.`,
    );
  }
  if (!batchValidResult.neverUserVisible) {
    case10Failures.push("Batch result missing neverUserVisible.");
  }

  results.push({
    case: "Case 10 — batch adapter with mixed valid inputs → allAdapted true",
    passed: case10Failures.length === 0,
    failures: case10Failures,
    neverUserVisible: true,
  });

  // ── Case 11: Batch adapter with one invalid input → allAdapted false ───────

  const batchMixedInputs: readonly DiagnosticEnvelopeAdapterInput[] = [
    FREE_PREVIEW_INPUT,
    emptyCodeInput, // invalid
    PILOT_GATE_INPUT,
  ];

  const batchMixedResult =
    buildDiagnosticEnvelopesFromNativeDiagnostics(batchMixedInputs);

  const case11Failures: string[] = [];
  if (batchMixedResult.allAdapted) {
    case11Failures.push(
      "Expected allAdapted=false when one input has blank code; got true.",
    );
  }
  if (batchMixedResult.envelopes.length !== batchMixedInputs.length) {
    case11Failures.push(
      `Expected ${batchMixedInputs.length} envelopes, got ${batchMixedResult.envelopes.length}.`,
    );
  }
  // The valid inputs should still have adapted=true in their individual results.
  const firstResult = batchMixedResult.results[0];
  const emptyResult = batchMixedResult.results[1];
  if (firstResult && !firstResult.adapted) {
    case11Failures.push("Expected results[0] (valid input) to have adapted=true.");
  }
  if (emptyResult && emptyResult.adapted) {
    case11Failures.push("Expected results[1] (empty code) to have adapted=false.");
  }

  results.push({
    case: "Case 11 — batch adapter with one invalid input → allAdapted false",
    passed: case11Failures.length === 0,
    failures: case11Failures,
    neverUserVisible: true,
  });

  // ── Case 12: Adapted envelopes pass validateDiagnosticNamespaceEnvelopes ──

  // Build a set of clean, fully-adapted envelopes.
  const validBatch: readonly DiagnosticEnvelopeAdapterInput[] = [
    FREE_PREVIEW_INPUT,
    PAID_MAPPER_INPUT,
    BRIDGE_INPUT,
    OCR_INPUT,
    PILOT_GATE_INPUT,
    INCIDENT_INPUT,
  ];
  const { envelopes: validEnvelopes, allAdapted: case12AllAdapted } =
    buildDiagnosticEnvelopesFromNativeDiagnostics(validBatch);

  const namespaceValidation =
    validateDiagnosticNamespaceEnvelopes(validEnvelopes);

  const case12Failures: string[] = [];
  if (!case12AllAdapted) {
    case12Failures.push(
      "Expected allAdapted=true for Case 12 input batch; got false.",
    );
  }
  if (!namespaceValidation.valid) {
    case12Failures.push(
      `Expected namespace validation valid=true; got false. ` +
        `Empty codes: [${namespaceValidation.emptyCodes.join(", ")}]; ` +
        `user-visible violations: [${namespaceValidation.userVisibleViolations.join(", ")}]`,
    );
  }
  if (!namespaceValidation.neverUserVisible) {
    case12Failures.push("Namespace validation result missing neverUserVisible.");
  }

  results.push({
    case: "Case 12 — adapted envelopes pass validateDiagnosticNamespaceEnvelopes",
    passed: case12Failures.length === 0,
    failures: case12Failures,
    neverUserVisible: true,
  });

  // ── Summary ────────────────────────────────────────────────────────────────

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  return {
    scaffoldVersion: DIAGNOSTIC_ENVELOPE_ADAPTER_REGRESSION_VERSION,
    adapterVersion: DIAGNOSTIC_ENVELOPE_ADAPTER_VERSION,
    totalCases: results.length,
    passed,
    failed,
    caseResults: results,
    neverUserVisible: true,
  };
}
