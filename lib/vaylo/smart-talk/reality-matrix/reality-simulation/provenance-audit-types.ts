/**
 * Runtime Provenance & Audit Trace types (Phase 8.2F-14 / 8.2F-15H consistency fix).
 *
 * Metadata-only governance lineage model. Defines the structural vocabulary
 * for recording where governance decisions originate and how they propagate
 * through the future Smart Talk cognition pipeline.
 *
 * Safety guarantees:
 * - no persistence (no DB writes, no log writes, no file writes)
 * - no telemetry SDK imported
 * - no runtime execution hooks
 * - no Smart Talk production connection
 * - no OCR SDK or LLM calls
 * - all results carry neverUserVisible: true
 *
 * Future phases may attach traces to runtime events, persist audit records,
 * support incident investigation, or power governance review tooling. This
 * phase only defines the structural vocabulary.
 */

// ── Provenance source ─────────────────────────────────────────────────────────

/**
 * The pipeline layer from which a governance decision originates.
 *
 * - `OCR`                 — decision came from OCR confidence or degradation evaluation
 * - `reality_matrix`      — decision came from boundary/trap/rule application in the reality matrix
 * - `evidence_gate`       — decision came from a structural evidence gate
 * - `simulation`          — decision came from the run-reality-simulation orchestrator
 * - `explanation_contract`— decision came from contract boundary or forbidden-move validation
 * - `mapper`              — decision came from the free-preview or paid explanation mapper
 * - `wording_review`      — decision came from the human wording review compliance check
 * - `wording_evaluation`  — decision came from the runtime wording evaluation scaffold
 * - `pilot_gate`          — decision came from the limited trusted pilot gate
 * - `incident_governance` — decision came from the incident governance scaffold
 * - `manual_review`       — decision was supplied by a human reviewer
 * - `unknown`             — source layer is unclassified (emits trace_unknown_source diagnostic)
 */
export type ProvenanceSourceKind =
  | "OCR"
  | "reality_matrix"
  | "evidence_gate"
  | "simulation"
  | "explanation_contract"
  | "mapper"
  | "wording_review"
  | "wording_evaluation"
  | "pilot_gate"
  | "incident_governance"
  | "manual_review"
  | "unknown";

// ── Decision kind ─────────────────────────────────────────────────────────────

/**
 * The structural type of governance decision recorded in a trace node.
 *
 * - `boundary_applied`           — an explanation boundary constraint was applied
 * - `forbidden_move_applied`     — a forbidden explanation move was blocked
 * - `required_constraint_applied`— a required explanation constraint was enforced
 * - `uncertainty_escalation`     — uncertainty posture was escalated
 * - `human_review_required`      — the decision requires human review
 * - `pilot_block`                — a pilot transaction was blocked by the gate
 * - `incident_escalation`        — a governance incident was escalated
 * - `wording_rejection`          — explanation wording was rejected by the evaluator
 * - `governance_breach`          — a governance constraint was breached
 * - `informational`              — no blocking decision; trace is for lineage only
 */
export type AuditDecisionKind =
  | "boundary_applied"
  | "forbidden_move_applied"
  | "required_constraint_applied"
  | "uncertainty_escalation"
  | "human_review_required"
  | "pilot_block"
  | "incident_escalation"
  | "wording_rejection"
  | "governance_breach"
  | "informational";

// ── Trace node ────────────────────────────────────────────────────────────────

/**
 * A single node in an audit trace chain. Records one governance decision
 * event, its source layer, decision type, and the parent trace node(s) that
 * caused or preceded it.
 *
 * `traceId`        — opaque, stable, unique identifier for this decision event.
 * `sourceKind`     — the pipeline layer that produced this decision.
 * `decisionKind`   — the structural type of governance decision.
 * `parentTraceIds` — the trace IDs of upstream nodes that directly led to this
 *                    decision. Empty array for the root node only.
 * `neverUserVisible` — compile-time invariant; audit traces are internal only.
 * `notes`          — optional internal governance notes, never user-visible.
 */
export interface AuditTraceNode {
  readonly traceId: string;
  readonly sourceKind: ProvenanceSourceKind;
  readonly decisionKind: AuditDecisionKind;
  readonly parentTraceIds: readonly string[];
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Trace chain ───────────────────────────────────────────────────────────────

/**
 * A complete audit trace chain for a governance sequence.
 *
 * `rootTraceId`      — the traceId of the root node (no parents, starting point).
 * `nodes`            — all nodes in the chain, including root and descendants.
 * `neverUserVisible` — compile-time invariant.
 *
 * **Structural validity is derived by `validateAuditTraceChain`, not supplied by
 * the caller.** (8.2F-15H: `structurallyValid` removed — `AuditTraceValidationResult.valid`
 * is the sole authoritative source of truth for chain integrity.)
 */
export interface AuditTraceChain {
  readonly rootTraceId: string;
  readonly nodes: readonly AuditTraceNode[];
  readonly neverUserVisible: true;
}

// ── Diagnostic codes ──────────────────────────────────────────────────────────

/**
 * Never-user-visible diagnostic codes emitted by `validateAuditTraceChain`.
 *
 * - `trace_missing_root`             — rootTraceId does not match any node in the chain.
 * - `trace_orphan_node`              — one or more nodes are unreachable from the root.
 * - `trace_duplicate_id`             — two or more nodes share the same traceId.
 * - `trace_cycle_detected`           — following parent references forms a cycle.
 * - `trace_unknown_source`           — one or more nodes have sourceKind "unknown"
 *                                      (soft warning; does not fail validity).
 * - `trace_invalid_parent_reference` — a parentTraceId references a traceId that
 *                                      does not exist in the chain.
 */
export type AuditTraceDiagnosticCode =
  | "trace_missing_root"
  | "trace_orphan_node"
  | "trace_duplicate_id"
  | "trace_cycle_detected"
  | "trace_unknown_source"
  | "trace_invalid_parent_reference";

// ── Validation result ─────────────────────────────────────────────────────────

/**
 * The never-user-visible result of `validateAuditTraceChain`.
 *
 * `valid`           — `true` if all structural requirements pass (root exists,
 *                     no duplicates, no invalid parent refs, no orphans, no cycles).
 * `fullyConsistent` — `true` if `valid` AND the only diagnostic present is the
 *                     soft warning `trace_unknown_source`. This distinguishes a
 *                     structurally clean chain from one with only informational notes.
 * `diagnostics`     — ordered list of never-user-visible diagnostic codes.
 * `neverUserVisible`— compile-time invariant.
 */
export interface AuditTraceValidationResult {
  readonly valid: boolean;
  readonly fullyConsistent: boolean;
  readonly diagnostics: readonly AuditTraceDiagnosticCode[];
  readonly neverUserVisible: true;
}
