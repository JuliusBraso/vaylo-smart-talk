/**
 * Audit Trace Emission Regression Scaffold (Phase 8.2F-15N).
 *
 * Pure regression harness for `validateAuditTraceEmission` and
 * `buildAuditTraceNodeFromEmission`. Covers 10 cases including an
 * AuditTraceChain integration test (Case 10).
 *
 * No Jest, no Vitest, no CI hooks, no runtime coupling.
 *
 * Run by importing and calling `runAuditTraceEmissionRegressionScaffold()`.
 *
 * Safety guarantees:
 * - no persistence
 * - no logging
 * - no telemetry
 * - no Smart Talk runtime connection
 * - no OCR SDK or LLM calls
 * - no user-visible output
 */

import type { AuditTraceEmissionRecord } from "./audit-trace-emission-types";
import type {
  AuditTraceChain,
  AuditTraceNode,
} from "./provenance-audit-types";

import {
  validateAuditTraceEmission,
  buildAuditTraceNodeFromEmission,
  AUDIT_TRACE_EMISSION_BUILDER_VERSION,
} from "./build-audit-trace-emission";
import { validateAuditTraceChain } from "./run-provenance-audit-scaffold";

export const AUDIT_TRACE_EMISSION_REGRESSION_VERSION =
  "8.2f-15n-audit-trace-emission-regression-v1";

// ── Assertion helpers ──────────────────────────────────────────────────────────

interface EmissionAssertionResult {
  readonly case: string;
  readonly passed: boolean;
  readonly failures: readonly string[];
  readonly neverUserVisible: true;
}

function assertEmission(
  caseName: string,
  emission: AuditTraceEmissionRecord,
  expectations: {
    valid?: boolean;
    fullyConsistent?: boolean;
    diagnostics?: readonly string[];
    noDiagnostics?: readonly string[];
  },
): EmissionAssertionResult {
  const result = validateAuditTraceEmission(emission);
  const failures: string[] = [];

  if (
    expectations.valid !== undefined &&
    result.valid !== expectations.valid
  ) {
    failures.push(
      `Expected valid=${expectations.valid}, got valid=${result.valid}`,
    );
  }
  if (
    expectations.fullyConsistent !== undefined &&
    result.fullyConsistent !== expectations.fullyConsistent
  ) {
    failures.push(
      `Expected fullyConsistent=${expectations.fullyConsistent}, ` +
        `got fullyConsistent=${result.fullyConsistent}`,
    );
  }
  if (expectations.diagnostics) {
    for (const diag of expectations.diagnostics) {
      if (!(result.diagnostics as readonly string[]).includes(diag)) {
        failures.push(`Expected diagnostic "${diag}" to be present.`);
      }
    }
  }
  if (expectations.noDiagnostics) {
    for (const diag of expectations.noDiagnostics) {
      if ((result.diagnostics as readonly string[]).includes(diag)) {
        failures.push(`Expected diagnostic "${diag}" to be absent.`);
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

interface ChainAssertionResult {
  readonly case: string;
  readonly passed: boolean;
  readonly failures: readonly string[];
  readonly chainValid?: boolean;
  readonly neverUserVisible: true;
}

// ── Synthetic emission fixtures ────────────────────────────────────────────────

const ROOT_SIMULATION_EMISSION: AuditTraceEmissionRecord = {
  emissionId: "em-sim-root-001",
  layer: "simulation",
  emissionKind: "boundary_emitted",
  severity: "blocking",
  parentTraceIds: [],
  referencedBoundaryId: "boundary-real-estate-section-1",
  neverUserVisible: true,
  notes: ["Root emission from simulation layer; boundary applied."],
};

const MAPPER_CHILD_EMISSION: AuditTraceEmissionRecord = {
  emissionId: "em-mapper-child-002",
  layer: "mapper",
  emissionKind: "forbidden_move_applied",
  severity: "blocking",
  parentTraceIds: ["em-sim-root-001"],
  referencedForbiddenMove: "FMV-008",
  neverUserVisible: true,
  notes: ["Mapper layer emission; forbidden move applied after simulation."],
};

const PILOT_CHILD_EMISSION: AuditTraceEmissionRecord = {
  emissionId: "em-pilot-child-003",
  layer: "pilot_gate",
  emissionKind: "pilot_gate_blocked",
  severity: "critical",
  parentTraceIds: ["em-mapper-child-002"],
  referencedArtifactId: "pilot-artifact-44a",
  neverUserVisible: true,
  notes: ["Pilot gate blocked after mapper layer application."],
};

// ── Regression cases ───────────────────────────────────────────────────────────

/**
 * Runs the full 10-case regression scaffold for Phase 8.2F-15N.
 *
 * Returns a never-user-visible summary record for each case, plus an overall
 * pass/fail count. No persistence, no logging, no telemetry.
 */
export function runAuditTraceEmissionRegressionScaffold(): {
  readonly scaffoldVersion: string;
  readonly builderVersion: string;
  readonly totalCases: number;
  readonly passed: number;
  readonly failed: number;
  readonly caseResults: readonly (EmissionAssertionResult | ChainAssertionResult)[];
  readonly neverUserVisible: true;
} {
  const results: (EmissionAssertionResult | ChainAssertionResult)[] = [];

  // ── Case 1: Valid simulation boundary emission → valid and converts ──────

  const case1 = assertEmission(
    "Case 1 — valid simulation boundary emission",
    ROOT_SIMULATION_EMISSION,
    { valid: true, fullyConsistent: true },
  );
  results.push(case1);

  // Verify conversion to AuditTraceNode
  if (case1.passed) {
    const node = buildAuditTraceNodeFromEmission(ROOT_SIMULATION_EMISSION);
    const case1Conversion: EmissionAssertionResult = {
      case: "Case 1 (conversion) — simulation emission → AuditTraceNode",
      passed:
        node.traceId === "em-sim-root-001" &&
        node.sourceKind === "simulation" &&
        node.decisionKind === "boundary_applied" &&
        node.neverUserVisible === true,
      failures:
        node.traceId !== "em-sim-root-001"
          ? ["traceId mismatch"]
          : node.sourceKind !== "simulation"
            ? ["sourceKind mismatch; expected simulation"]
            : node.decisionKind !== "boundary_applied"
              ? ["decisionKind mismatch; expected boundary_applied"]
              : [],
      neverUserVisible: true,
    };
    results.push(case1Conversion);
  }

  // ── Case 2: Valid mapper forbidden move emission → valid and converts ────

  const case2 = assertEmission(
    "Case 2 — valid mapper forbidden move emission",
    MAPPER_CHILD_EMISSION,
    { valid: true, fullyConsistent: true },
  );
  results.push(case2);

  if (case2.passed) {
    const node = buildAuditTraceNodeFromEmission(MAPPER_CHILD_EMISSION);
    const case2Conversion: EmissionAssertionResult = {
      case: "Case 2 (conversion) — mapper emission → AuditTraceNode",
      passed:
        node.traceId === "em-mapper-child-002" &&
        node.sourceKind === "mapper" &&
        node.decisionKind === "forbidden_move_applied" &&
        node.parentTraceIds.includes("em-sim-root-001"),
      failures:
        node.traceId !== "em-mapper-child-002"
          ? ["traceId mismatch"]
          : node.sourceKind !== "mapper"
            ? ["sourceKind mismatch; expected mapper"]
            : node.decisionKind !== "forbidden_move_applied"
              ? ["decisionKind mismatch; expected forbidden_move_applied"]
              : !node.parentTraceIds.includes("em-sim-root-001")
                ? ["parentTraceIds missing em-sim-root-001"]
                : [],
      neverUserVisible: true,
    };
    results.push(case2Conversion);
  }

  // ── Case 3: Valid pilot gate block emission with parent IDs ───────────────

  const case3 = assertEmission(
    "Case 3 — valid pilot gate block emission with parent IDs",
    PILOT_CHILD_EMISSION,
    { valid: true, fullyConsistent: true },
  );
  results.push(case3);

  if (case3.passed) {
    const node = buildAuditTraceNodeFromEmission(PILOT_CHILD_EMISSION);
    const case3Conversion: EmissionAssertionResult = {
      case: "Case 3 (conversion) — pilot gate emission → AuditTraceNode",
      passed:
        node.sourceKind === "pilot_gate" &&
        node.decisionKind === "pilot_block" &&
        node.parentTraceIds.includes("em-mapper-child-002"),
      failures:
        node.sourceKind !== "pilot_gate"
          ? ["sourceKind mismatch; expected pilot_gate"]
          : node.decisionKind !== "pilot_block"
            ? ["decisionKind mismatch; expected pilot_block"]
            : !node.parentTraceIds.includes("em-mapper-child-002")
              ? ["parentTraceIds missing em-mapper-child-002"]
              : [],
      neverUserVisible: true,
    };
    results.push(case3Conversion);
  }

  // ── Case 4: Missing emissionId → invalid ─────────────────────────────────

  const missingIdEmission: AuditTraceEmissionRecord = {
    emissionId: "   ",
    layer: "mapper",
    emissionKind: "informational",
    severity: "informational",
    parentTraceIds: [],
    neverUserVisible: true,
  };
  results.push(
    assertEmission(
      "Case 4 — blank emissionId → invalid",
      missingIdEmission,
      {
        valid: false,
        diagnostics: ["audit_emission_missing_id"],
      },
    ),
  );

  // ── Case 5: Unknown layer → valid but not fullyConsistent ────────────────

  const unknownLayerEmission: AuditTraceEmissionRecord = {
    emissionId: "em-unknown-layer-005",
    layer: "unknown",
    emissionKind: "informational",
    severity: "informational",
    parentTraceIds: [],
    neverUserVisible: true,
  };
  results.push(
    assertEmission(
      "Case 5 — unknown layer → valid but not fullyConsistent",
      unknownLayerEmission,
      {
        valid: true,
        fullyConsistent: false,
        diagnostics: ["audit_emission_unknown_layer"],
        noDiagnostics: ["audit_emission_missing_id"],
      },
    ),
  );

  // ── Case 6: Blank parent ID → invalid ────────────────────────────────────

  const blankParentIdEmission: AuditTraceEmissionRecord = {
    emissionId: "em-blank-parent-006",
    layer: "simulation",
    emissionKind: "informational",
    severity: "informational",
    parentTraceIds: ["em-sim-root-001", "   "],
    neverUserVisible: true,
  };
  results.push(
    assertEmission(
      "Case 6 — blank parent ID → invalid",
      blankParentIdEmission,
      {
        valid: false,
        diagnostics: ["audit_emission_empty_parent_id"],
      },
    ),
  );

  // ── Case 7: Duplicate parent IDs → valid but not fullyConsistent ─────────

  const duplicateParentEmission: AuditTraceEmissionRecord = {
    emissionId: "em-dup-parent-007",
    layer: "mapper",
    emissionKind: "informational",
    severity: "informational",
    parentTraceIds: ["em-sim-root-001", "em-sim-root-001"],
    neverUserVisible: true,
  };
  results.push(
    assertEmission(
      "Case 7 — duplicate parentTraceIds → valid but not fullyConsistent",
      duplicateParentEmission,
      {
        valid: true,
        fullyConsistent: false,
        diagnostics: ["audit_emission_duplicate_parent_id"],
      },
    ),
  );

  // ── Case 8: Blocking severity with no reference → valid not fullyConsistent

  const blockingNoRefEmission: AuditTraceEmissionRecord = {
    emissionId: "em-blocking-noref-008",
    layer: "evidence_gate",
    emissionKind: "boundary_emitted",
    severity: "blocking",
    parentTraceIds: [],
    neverUserVisible: true,
  };
  results.push(
    assertEmission(
      "Case 8 — blocking severity with no reference → valid but not fullyConsistent",
      blockingNoRefEmission,
      {
        valid: true,
        fullyConsistent: false,
        diagnostics: ["audit_emission_missing_reference_for_blocking"],
      },
    ),
  );

  // ── Case 9: neverUserVisible false forced via cast → invalid ─────────────

  const badNeverVisible = {
    emissionId: "em-bad-visible-009",
    layer: "mapper",
    emissionKind: "informational",
    severity: "informational",
    parentTraceIds: [],
    neverUserVisible: false as unknown as true,
  } satisfies AuditTraceEmissionRecord;

  results.push(
    assertEmission(
      "Case 9 — neverUserVisible false forced via cast → invalid",
      badNeverVisible,
      {
        valid: false,
        diagnostics: ["audit_emission_user_visible_violation"],
      },
    ),
  );

  // ── Case 10: Chain integration — emissions form a valid AuditTraceChain ──

  const rootNode: AuditTraceNode =
    buildAuditTraceNodeFromEmission(ROOT_SIMULATION_EMISSION);
  const mapperNode: AuditTraceNode =
    buildAuditTraceNodeFromEmission(MAPPER_CHILD_EMISSION);
  const pilotNode: AuditTraceNode =
    buildAuditTraceNodeFromEmission(PILOT_CHILD_EMISSION);

  const chain: AuditTraceChain = {
    rootTraceId: rootNode.traceId,
    nodes: [rootNode, mapperNode, pilotNode],
    neverUserVisible: true,
  };

  const chainResult = validateAuditTraceChain(chain);

  const case10Failures: string[] = [];
  if (!chainResult.valid) {
    case10Failures.push(
      `Chain validation failed; diagnostics: ${chainResult.diagnostics.join(", ")}`,
    );
  }
  if (!chainResult.neverUserVisible) {
    case10Failures.push("Chain validation result missing neverUserVisible.");
  }

  const case10: ChainAssertionResult = {
    case: "Case 10 — converted AuditTraceNodes form a valid AuditTraceChain",
    passed: case10Failures.length === 0,
    failures: case10Failures,
    chainValid: chainResult.valid,
    neverUserVisible: true,
  };
  results.push(case10);

  // ── Summary ────────────────────────────────────────────────────────────────

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  return {
    scaffoldVersion: AUDIT_TRACE_EMISSION_REGRESSION_VERSION,
    builderVersion: AUDIT_TRACE_EMISSION_BUILDER_VERSION,
    totalCases: results.length,
    passed,
    failed,
    caseResults: results,
    neverUserVisible: true,
  };
}
