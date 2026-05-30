/**
 * Runtime Provenance & Audit Trace regression scaffold (Phase 8.2F-14).
 *
 * Eight structural cases exercising validateAuditTraceChain:
 *
 *  Case 1 — single valid root                → valid, fullyConsistent
 *  Case 2 — valid multi-node chain           → valid, fullyConsistent
 *  Case 3 — duplicate traceId               → invalid, trace_duplicate_id
 *  Case 4 — missing root                    → invalid, trace_missing_root
 *  Case 5 — orphan node                     → invalid, trace_orphan_node
 *  Case 6 — invalid parent reference        → invalid, trace_invalid_parent_reference
 *  Case 7 — cycle detection                 → invalid, trace_cycle_detected
 *  Case 8 — unknown source kind warning     → valid, fullyConsistent, trace_unknown_source
 *
 * No Jest/Vitest. No CI hook. No runtime integration. No persistence. No logging.
 * No telemetry. No Smart Talk wiring. No OCR SDK. No LLM.
 */

import type {
  AuditTraceDiagnosticCode,
  AuditTraceChain,
  AuditTraceNode,
  AuditTraceValidationResult,
} from "./provenance-audit-types";
import {
  PROVENANCE_AUDIT_SCAFFOLD_VERSION,
  validateAuditTraceChain,
} from "./run-provenance-audit-scaffold";

export const PROVENANCE_AUDIT_REGRESSION_VERSION =
  "8.2f-14-provenance-audit-regression-scaffold-v1";

// ── Result types ──────────────────────────────────────────────────────────────

export interface ProvenanceAuditRegressionCaseResult {
  readonly caseName: string;
  readonly passed: boolean;
  readonly validationResult: AuditTraceValidationResult;
  readonly failures: readonly string[];
  readonly notes: readonly string[];
}

export interface ProvenanceAuditRegressionScaffoldResult {
  readonly scaffoldVersion: string;
  readonly validatorVersion: string;
  readonly allPassed: boolean;
  readonly caseResults: readonly ProvenanceAuditRegressionCaseResult[];
  readonly notes: readonly string[];
}

// ── Node factory ──────────────────────────────────────────────────────────────

function node(
  traceId: string,
  overrides: Partial<Omit<AuditTraceNode, "traceId">> = {},
): AuditTraceNode {
  return {
    traceId,
    sourceKind: overrides.sourceKind ?? "reality_matrix",
    decisionKind: overrides.decisionKind ?? "informational",
    parentTraceIds: overrides.parentTraceIds ?? [],
    neverUserVisible: true,
    notes: overrides.notes,
  };
}

function chain(
  rootTraceId: string,
  nodes: readonly AuditTraceNode[],
  structurallyValid = true,
): AuditTraceChain {
  return { rootTraceId, nodes, structurallyValid, neverUserVisible: true };
}

// ── Assertion helper ──────────────────────────────────────────────────────────

function assertTrace(
  caseName: string,
  result: AuditTraceValidationResult,
  opts: {
    expectValid: boolean;
    expectFullyConsistent: boolean;
    expectDiagnostics?: readonly AuditTraceDiagnosticCode[];
    expectNoDiagnostics?: readonly AuditTraceDiagnosticCode[];
  },
): ProvenanceAuditRegressionCaseResult {
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

// ── Case 1 — Single valid root ────────────────────────────────────────────────

function runCase1(): ProvenanceAuditRegressionCaseResult {
  return assertTrace(
    "single_valid_root",
    validateAuditTraceChain(
      chain("root-1", [
        node("root-1", { sourceKind: "simulation", decisionKind: "informational" }),
      ]),
    ),
    {
      expectValid: true,
      expectFullyConsistent: true,
      expectNoDiagnostics: [
        "trace_missing_root",
        "trace_duplicate_id",
        "trace_orphan_node",
        "trace_cycle_detected",
        "trace_invalid_parent_reference",
        "trace_unknown_source",
      ],
    },
  );
}

// ── Case 2 — Valid multi-node chain ───────────────────────────────────────────

function runCase2(): ProvenanceAuditRegressionCaseResult {
  // Topology: root → child-a, root → child-b, child-a → grandchild
  return assertTrace(
    "valid_multi_node_chain",
    validateAuditTraceChain(
      chain("root-2", [
        node("root-2", { sourceKind: "reality_matrix", decisionKind: "boundary_applied" }),
        node("child-a", { sourceKind: "mapper", decisionKind: "forbidden_move_applied", parentTraceIds: ["root-2"] }),
        node("child-b", { sourceKind: "mapper", decisionKind: "required_constraint_applied", parentTraceIds: ["root-2"] }),
        node("grandchild", { sourceKind: "wording_evaluation", decisionKind: "wording_rejection", parentTraceIds: ["child-a"] }),
      ]),
    ),
    {
      expectValid: true,
      expectFullyConsistent: true,
      expectNoDiagnostics: [
        "trace_missing_root",
        "trace_duplicate_id",
        "trace_orphan_node",
        "trace_cycle_detected",
        "trace_invalid_parent_reference",
        "trace_unknown_source",
      ],
    },
  );
}

// ── Case 3 — Duplicate traceId ────────────────────────────────────────────────

function runCase3(): ProvenanceAuditRegressionCaseResult {
  return assertTrace(
    "duplicate_trace_id",
    validateAuditTraceChain(
      chain("dup-root", [
        node("dup-root", { sourceKind: "simulation" }),
        // Second node reuses the same traceId as the root.
        node("dup-root", { sourceKind: "mapper", parentTraceIds: [] }),
      ]),
    ),
    {
      expectValid: false,
      expectFullyConsistent: false,
      expectDiagnostics: ["trace_duplicate_id"],
      expectNoDiagnostics: ["trace_missing_root"],
    },
  );
}

// ── Case 4 — Missing root ─────────────────────────────────────────────────────

function runCase4(): ProvenanceAuditRegressionCaseResult {
  // rootTraceId references a non-existent node.
  return assertTrace(
    "missing_root",
    validateAuditTraceChain(
      chain("nonexistent-root", [
        node("node-4a", { sourceKind: "OCR", parentTraceIds: [] }),
      ]),
    ),
    {
      expectValid: false,
      expectFullyConsistent: false,
      expectDiagnostics: ["trace_missing_root"],
      expectNoDiagnostics: ["trace_duplicate_id", "trace_cycle_detected"],
    },
  );
}

// ── Case 5 — Orphan node ──────────────────────────────────────────────────────

function runCase5(): ProvenanceAuditRegressionCaseResult {
  // root-5 is the root; child-5 is connected; orphan-5 has no parents and is
  // not the root — unreachable from root-5 via the children graph.
  return assertTrace(
    "orphan_node",
    validateAuditTraceChain(
      chain("root-5", [
        node("root-5", { sourceKind: "simulation", decisionKind: "informational" }),
        node("child-5", { sourceKind: "mapper", parentTraceIds: ["root-5"] }),
        node("orphan-5", { sourceKind: "wording_review", parentTraceIds: [] }),
      ]),
    ),
    {
      expectValid: false,
      expectFullyConsistent: false,
      expectDiagnostics: ["trace_orphan_node"],
      expectNoDiagnostics: [
        "trace_missing_root",
        "trace_duplicate_id",
        "trace_cycle_detected",
        "trace_invalid_parent_reference",
      ],
    },
  );
}

// ── Case 6 — Invalid parent reference ────────────────────────────────────────

function runCase6(): ProvenanceAuditRegressionCaseResult {
  // child-6b references a real parent (child-6a) AND a phantom parent that
  // does not exist in the chain. child-6b is still reachable via child-6a,
  // so only the invalid-parent-reference diagnostic fires (not orphan).
  return assertTrace(
    "invalid_parent_reference",
    validateAuditTraceChain(
      chain("root-6", [
        node("root-6", { sourceKind: "reality_matrix" }),
        node("child-6a", { sourceKind: "explanation_contract", parentTraceIds: ["root-6"] }),
        node("child-6b", {
          sourceKind: "pilot_gate",
          decisionKind: "pilot_block",
          parentTraceIds: ["child-6a", "phantom-id-does-not-exist"],
        }),
      ]),
    ),
    {
      expectValid: false,
      expectFullyConsistent: false,
      expectDiagnostics: ["trace_invalid_parent_reference"],
      expectNoDiagnostics: [
        "trace_missing_root",
        "trace_duplicate_id",
        "trace_orphan_node",
        "trace_cycle_detected",
      ],
    },
  );
}

// ── Case 7 — Cycle detection ──────────────────────────────────────────────────

function runCase7(): ProvenanceAuditRegressionCaseResult {
  // Topology: root-7 → node-7a (parent: root-7, node-7c)
  //           node-7b (parent: node-7a)
  //           node-7c (parent: node-7b)
  // Cycle: node-7a → node-7c → node-7b → node-7a
  return assertTrace(
    "cycle_detected",
    validateAuditTraceChain(
      chain("root-7", [
        node("root-7", { sourceKind: "simulation" }),
        node("node-7a", {
          sourceKind: "incident_governance",
          decisionKind: "incident_escalation",
          parentTraceIds: ["root-7", "node-7c"],
        }),
        node("node-7b", {
          sourceKind: "wording_review",
          decisionKind: "governance_breach",
          parentTraceIds: ["node-7a"],
        }),
        node("node-7c", {
          sourceKind: "mapper",
          decisionKind: "wording_rejection",
          parentTraceIds: ["node-7b"],
        }),
      ]),
    ),
    {
      expectValid: false,
      expectFullyConsistent: false,
      expectDiagnostics: ["trace_cycle_detected"],
      expectNoDiagnostics: [
        "trace_missing_root",
        "trace_duplicate_id",
        "trace_invalid_parent_reference",
      ],
    },
  );
}

// ── Case 8 — Unknown source kind (soft warning) ───────────────────────────────

function runCase8(): ProvenanceAuditRegressionCaseResult {
  // Structurally valid chain, but one node has sourceKind "unknown".
  // Expected: valid=true, fullyConsistent=true, trace_unknown_source emitted.
  // fullyConsistent is true because the only diagnostic is the soft warning.
  return assertTrace(
    "unknown_source_kind_warning",
    validateAuditTraceChain(
      chain("root-8", [
        node("root-8", { sourceKind: "manual_review", decisionKind: "informational" }),
        node("child-8a", { sourceKind: "unknown", decisionKind: "informational", parentTraceIds: ["root-8"] }),
        node("child-8b", { sourceKind: "OCR", decisionKind: "uncertainty_escalation", parentTraceIds: ["root-8"] }),
      ]),
    ),
    {
      expectValid: true,
      expectFullyConsistent: true,
      expectDiagnostics: ["trace_unknown_source"],
      expectNoDiagnostics: [
        "trace_missing_root",
        "trace_duplicate_id",
        "trace_orphan_node",
        "trace_cycle_detected",
        "trace_invalid_parent_reference",
      ],
    },
  );
}

// ── Scaffold runner ───────────────────────────────────────────────────────────

/**
 * Runs all 8 provenance audit regression cases and aggregates results.
 *
 * Does not throw. All assertions are collected as failure strings.
 * No persistence. No logging. No telemetry. No Smart Talk runtime. No LLM.
 */
export function runProvenanceAuditRegressionScaffold(): ProvenanceAuditRegressionScaffoldResult {
  const caseResults: ProvenanceAuditRegressionCaseResult[] = [
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
    `Provenance audit regression scaffold complete. ${String(passCount)}/${String(caseResults.length)} cases passed.`,
  ];

  if (allPassed) {
    notes.push(
      "All structural rules validated: root existence, duplicate detection, parent-reference " +
        "integrity, orphan detection, cycle detection, and soft unknown-source warning.",
    );
  } else {
    notes.push(
      `${String(failCount)} case(s) failed — review validationResult.diagnostics for details.`,
    );
  }

  notes.push(
    "Scaffold is metadata-only: no persistence, no logging, no telemetry, " +
      "no Smart Talk runtime, no OCR SDK, no LLM called.",
  );

  return {
    scaffoldVersion: PROVENANCE_AUDIT_REGRESSION_VERSION,
    validatorVersion: PROVENANCE_AUDIT_SCAFFOLD_VERSION,
    allPassed,
    caseResults,
    notes,
  };
}
