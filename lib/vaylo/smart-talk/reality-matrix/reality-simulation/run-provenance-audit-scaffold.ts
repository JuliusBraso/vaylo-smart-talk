/**
 * Runtime Provenance & Audit Trace validator (Phase 8.2F-14 / 8.2F-15H consistency fix).
 *
 * Implements `validateAuditTraceChain` — a pure function that checks the
 * structural integrity of an `AuditTraceChain` and returns a never-user-visible
 * `AuditTraceValidationResult`.
 *
 * Validation rules (all applied; errors are accumulated, not short-circuited):
 *
 *  Rule 1 — Root must exist:
 *    The node whose traceId matches `chain.rootTraceId` must be present.
 *    Failure: `trace_missing_root`.
 *
 *  Rule 2 — No duplicate traceIds:
 *    All traceId values in `chain.nodes` must be unique.
 *    Failure: `trace_duplicate_id`.
 *
 *  Rule 3 — All parent references must exist:
 *    Every string in any node's `parentTraceIds` must match a traceId in the chain.
 *    Failure: `trace_invalid_parent_reference`.
 *
 *  Rule 4 — No orphan nodes:
 *    Every node must be reachable from the root following the parent→child
 *    direction (i.e. forward BFS from root through the children adjacency map).
 *    Only evaluated when root exists.
 *    Failure: `trace_orphan_node`.
 *
 *  Rule 5 — No cycles:
 *    Following parent references must not form a loop. Evaluated by DFS with
 *    a recursion-stack set over parent edges.
 *    Failure: `trace_cycle_detected`.
 *
 *  Rule 6 — Unknown source kind (soft warning only):
 *    Nodes with `sourceKind === "unknown"` emit `trace_unknown_source`.
 *    This does NOT affect `valid`.
 *
 *  Rule 7 — valid:
 *    `true` iff no structural failures (rules 1–5) fired.
 *
 *  Rule 8 — fullyConsistent:
 *    `true` iff `valid === true` AND every diagnostic in the result is
 *    `trace_unknown_source` (i.e. the only permitted soft warning).
 *
 * Safety guarantees:
 * - no persistence
 * - no logging
 * - no telemetry
 * - no runtime hooks
 * - no Smart Talk connection
 * - no OCR SDK or LLM calls
 * - all results carry neverUserVisible: true
 */

import type {
  AuditTraceDiagnosticCode,
  AuditTraceChain,
  AuditTraceNode,
  AuditTraceValidationResult,
} from "./provenance-audit-types";

export const PROVENANCE_AUDIT_SCAFFOLD_VERSION =
  "8.2f-15h-provenance-audit-scaffold-v2";

// ── Internal helpers ──────────────────────────────────────────────────────────

/** Builds a map from nodeId → list of child nodeIds. */
function buildChildrenMap(
  nodeMap: ReadonlyMap<string, AuditTraceNode>,
): Map<string, string[]> {
  const childrenMap = new Map<string, string[]>();

  for (const node of nodeMap.values()) {
    if (!childrenMap.has(node.traceId)) {
      childrenMap.set(node.traceId, []);
    }
    for (const parentId of node.parentTraceIds) {
      if (nodeMap.has(parentId)) {
        const siblings = childrenMap.get(parentId);
        if (siblings !== undefined) {
          siblings.push(node.traceId);
        } else {
          childrenMap.set(parentId, [node.traceId]);
        }
      }
    }
  }

  return childrenMap;
}

/**
 * BFS from rootId through the children map; returns the set of all reachable
 * nodeIds.
 */
function collectReachable(
  rootId: string,
  childrenMap: ReadonlyMap<string, readonly string[]>,
): Set<string> {
  const reachable = new Set<string>();
  const queue: string[] = [rootId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (reachable.has(current)) continue;
    reachable.add(current);
    for (const childId of childrenMap.get(current) ?? []) {
      if (!reachable.has(childId)) queue.push(childId);
    }
  }

  return reachable;
}

/**
 * DFS cycle detection over parent edges.
 * Returns `true` if a cycle is found, `false` otherwise.
 *
 * Uses two sets:
 * - `visited`:  permanently completed nodes (no cycle found from them).
 * - `onPath`:   nodes currently in the active DFS recursion path.
 *
 * A cycle exists when DFS revisits a node already on the current path.
 */
function detectCycleInParentGraph(
  nodeMap: ReadonlyMap<string, AuditTraceNode>,
): boolean {
  const visited = new Set<string>();
  const onPath = new Set<string>();

  const dfs = (nodeId: string): boolean => {
    if (onPath.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;
    if (!nodeMap.has(nodeId)) return false;

    onPath.add(nodeId);
    visited.add(nodeId);

    const node = nodeMap.get(nodeId)!;
    for (const parentId of node.parentTraceIds) {
      if (dfs(parentId)) return true;
    }

    onPath.delete(nodeId);
    return false;
  };

  for (const nodeId of nodeMap.keys()) {
    if (!visited.has(nodeId)) {
      if (dfs(nodeId)) return true;
    }
  }

  return false;
}

// ── Main validator ────────────────────────────────────────────────────────────

/**
 * Validates the structural integrity of an `AuditTraceChain`.
 *
 * Pure function — no side effects, no persistence, no logging, no telemetry,
 * no DB, no runtime hooks, no OCR SDK, no LLM.
 */
export function validateAuditTraceChain(
  chain: AuditTraceChain,
): AuditTraceValidationResult {
  const diagnostics: AuditTraceDiagnosticCode[] = [];

  // ── Rule 2 — Duplicate traceId detection ─────────────────────────────────

  const nodeMap = new Map<string, AuditTraceNode>();
  const seenIds = new Set<string>();
  let hasDuplicates = false;

  for (const node of chain.nodes) {
    if (seenIds.has(node.traceId)) {
      hasDuplicates = true;
    } else {
      seenIds.add(node.traceId);
      nodeMap.set(node.traceId, node);
    }
  }
  if (hasDuplicates) {
    diagnostics.push("trace_duplicate_id");
  }

  // ── Rule 1 — Root must exist ──────────────────────────────────────────────

  const rootExists = nodeMap.has(chain.rootTraceId);
  if (!rootExists) {
    diagnostics.push("trace_missing_root");
  }

  // ── Rule 3 — All parent references must exist ─────────────────────────────

  let hasInvalidParentRef = false;
  for (const node of nodeMap.values()) {
    for (const parentId of node.parentTraceIds) {
      if (!seenIds.has(parentId)) {
        hasInvalidParentRef = true;
      }
    }
  }
  if (hasInvalidParentRef) {
    diagnostics.push("trace_invalid_parent_reference");
  }

  // ── Rule 4 — No orphan nodes ──────────────────────────────────────────────
  // Skipped when root is missing (no traversal start point).

  let hasOrphans = false;
  if (rootExists) {
    const childrenMap = buildChildrenMap(nodeMap);
    const reachable = collectReachable(chain.rootTraceId, childrenMap);

    for (const nodeId of nodeMap.keys()) {
      if (!reachable.has(nodeId)) {
        hasOrphans = true;
        break;
      }
    }
  }
  if (hasOrphans) {
    diagnostics.push("trace_orphan_node");
  }

  // ── Rule 5 — No cycles ────────────────────────────────────────────────────

  const hasCycle = detectCycleInParentGraph(nodeMap);
  if (hasCycle) {
    diagnostics.push("trace_cycle_detected");
  }

  // ── Rule 6 — Unknown source kind (soft warning) ───────────────────────────

  let hasUnknownSource = false;
  for (const node of nodeMap.values()) {
    if (node.sourceKind === "unknown") {
      hasUnknownSource = true;
      break;
    }
  }
  if (hasUnknownSource) {
    diagnostics.push("trace_unknown_source");
  }

  // ── Rules 7–8 — valid and fullyConsistent ─────────────────────────────────

  const structuralErrorExists =
    hasDuplicates ||
    !rootExists ||
    hasInvalidParentRef ||
    hasOrphans ||
    hasCycle;

  const valid = !structuralErrorExists;

  // fullyConsistent: valid AND every diagnostic is the soft warning only.
  const fullyConsistent =
    valid && diagnostics.every((d) => d === "trace_unknown_source");

  return {
    valid,
    fullyConsistent,
    diagnostics,
    neverUserVisible: true,
  };
}
