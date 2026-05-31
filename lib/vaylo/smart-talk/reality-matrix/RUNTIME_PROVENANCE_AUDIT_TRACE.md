# Runtime Provenance & Audit Trace Scaffold — Phase 8.2F-14

**Version:** `8.2f-14-provenance-audit-scaffold-v1`
**Mode:** Governance metadata scaffold / no runtime persistence
**Status:** Structural vocabulary only — no live audit system exists

---

## Critical Disclaimer

**This phase does NOT persist traces.**
**This phase does NOT log traces.**
**This phase does NOT transmit traces.**
**This phase does NOT expose traces to users.**

Phase 8.2F-14 defines the structural vocabulary for recording governance decision lineage in pure TypeScript metadata. The `validateAuditTraceChain` function validates the structural integrity of a trace chain but does not write to any storage, emit to any telemetry system, or connect to any runtime.

---

## Purpose

Before any runtime coupling, every governance decision in the Smart Talk cognition pipeline should be structurally traceable. This means:

- **Provenance** — knowing which pipeline layer produced a governance decision.
- **Trace lineage** — knowing which earlier decision caused or preceded a later one.
- **Governance ancestry** — being able to reconstruct the chain of reasoning that led to a block, escalation, or boundary application.
- **Decision traceability** — being able to answer "why was this output blocked?" from a structural metadata record, without requiring runtime logs.
- **Audit reconstruction** — being able to replay the decision chain in a future investigation without needing access to runtime state.

---

## Structural Model

### ProvenanceSourceKind

The pipeline layer from which a governance decision originates:

| Value | Layer |
|---|---|
| `OCR` | OCR confidence or degradation evaluation (Phase 8.2F-9) |
| `reality_matrix` | Boundary/trap/rule application |
| `evidence_gate` | Structural evidence gate |
| `simulation` | run-reality-simulation orchestrator |
| `explanation_contract` | Contract boundary or forbidden-move validation |
| `mapper` | Free-preview or paid explanation mapper (Phases 8.2F-3/4) |
| `wording_review` | Human wording review compliance (Phase 8.2F-8) |
| `wording_evaluation` | Runtime wording evaluation scaffold (Phase 8.2F-12) |
| `pilot_gate` | Limited trusted pilot gate (Phase 8.2F-11) |
| `incident_governance` | Incident governance scaffold (Phase 8.2F-13) |
| `manual_review` | Decision supplied by a human reviewer |
| `unknown` | Unclassified source (soft warning only) |

### AuditDecisionKind

The structural type of governance decision at a trace node:

| Value | Meaning |
|---|---|
| `boundary_applied` | An explanation boundary constraint was applied |
| `forbidden_move_applied` | A forbidden explanation move was blocked |
| `required_constraint_applied` | A required constraint was enforced |
| `uncertainty_escalation` | Uncertainty posture was escalated |
| `human_review_required` | The decision requires human review |
| `pilot_block` | A pilot transaction was blocked |
| `incident_escalation` | A governance incident was escalated |
| `wording_rejection` | Explanation wording was rejected |
| `governance_breach` | A governance constraint was breached |
| `informational` | No blocking decision; lineage record only |

### AuditTraceNode

A single event in a governance sequence:

```typescript
{
  traceId: string            // opaque stable ID, unique within a chain
  sourceKind: ProvenanceSourceKind
  decisionKind: AuditDecisionKind
  parentTraceIds: string[]   // empty for root node only
  neverUserVisible: true
  notes?: string[]           // internal only
}
```

### AuditTraceChain

A complete governance lineage for one decision sequence:

```typescript
{
  rootTraceId: string     // must match the root node's traceId
  nodes: AuditTraceNode[] // all nodes in the sequence
  neverUserVisible: true
}
```

> **8.2F-15H:** `structurallyValid` has been removed from `AuditTraceChain`. Structural validity is now derived exclusively by `validateAuditTraceChain` — `AuditTraceValidationResult.valid` is the sole authoritative source of truth. Callers must not supply or cache a validity flag on the chain itself.

---

## Validation Rules

`validateAuditTraceChain(chain)` applies these rules:

| Rule | Check | Failure Diagnostic |
|---|---|---|
| 1 | `rootTraceId` must match a node in the chain | `trace_missing_root` |
| 2 | All `traceId` values must be unique | `trace_duplicate_id` |
| 3 | All `parentTraceIds` must reference existing nodes | `trace_invalid_parent_reference` |
| 4 | All nodes must be reachable from the root | `trace_orphan_node` |
| 5 | No cycles in the parent-reference graph | `trace_cycle_detected` |
| 6 | `sourceKind === "unknown"` is allowed but emits a soft warning | `trace_unknown_source` |

**`valid`** = true iff rules 1–5 all pass.

**`fullyConsistent`** = true iff `valid` AND the only diagnostic present is `trace_unknown_source` (the soft warning). This distinguishes a clean chain from one that has only informational notes.

---

## What Does NOT Exist Yet

| Capability | Status |
|---|---|
| Persistent audit log storage | **Does not exist** |
| Real-time telemetry emission | **Does not exist** |
| Audit record query API | **Does not exist** |
| User-facing audit trail | **Does not exist** |
| Incident-linked trace retrieval | **Does not exist** |
| Cross-session trace correlation | **Does not exist** |
| Trace signing / tamper detection | **Does not exist** |

---

## Future Phases

When real audit infrastructure is built, the following phases will be needed:

### Phase A — Runtime Trace Attachment
- Attach `AuditTraceNode` records to real runtime governance events
- Propagate `traceId` across pipeline boundaries (OCR → mapper → bridge → review → pilot gate)
- Ensure `parentTraceIds` are populated from the actual execution context

### Phase B — Persistent Audit Records
- Define audit record storage format (append-only log)
- Implement validated persistence (separate from the scaffold layer)
- Ensure audit records are immutable once written

### Phase C — Incident Investigation Support
- Link audit trace chains to incident governance records (Phase 8.2F-13)
- Enable "trace replay" for governance reviews
- Support forensic reconstruction of decision chains

### Phase D — Governance Review Tooling
- Build internal (never-user-facing) tooling for reviewing audit traces
- Support filtering by `sourceKind`, `decisionKind`, severity, date range
- Support validation of trace chain integrity at review time

### Phase E — Trace Signing & Tamper Detection
- Cryptographically sign trace chains at rest
- Verify chain integrity before using traces in governance reviews
- Alert on tampered or incomplete traces

---

## Cross-Phase Lineage Map

| Source Phase | sourceKind value | Typical decisionKind values |
|---|---|---|
| 8.2F-3/4 (Mapper) | `mapper` | `forbidden_move_applied`, `required_constraint_applied`, `boundary_applied` |
| 8.2F-6 (Bridge) | `explanation_contract` | `boundary_applied`, `governance_breach` |
| 8.2F-8 (Wording Review) | `wording_review` | `governance_breach`, `human_review_required` |
| 8.2F-9 (OCR Uncertainty) | `OCR` | `uncertainty_escalation`, `human_review_required` |
| 8.2F-11 (Pilot Gate) | `pilot_gate` | `pilot_block`, `human_review_required` |
| 8.2F-12 (Wording Evaluation) | `wording_evaluation` | `wording_rejection` |
| 8.2F-13 (Incident Governance) | `incident_governance` | `incident_escalation`, `governance_breach` |

---

## Safety Constraints

This scaffold must NEVER:
- Write to any database or file system
- Emit to any logging provider or telemetry SDK
- Transmit trace data to any external system
- Connect to production Smart Talk
- Expose trace data to users
- Call OCR SDKs or LLMs
- Add runtime execution hooks or feature flags

All `AuditTraceNode`, `AuditTraceChain`, and `AuditTraceValidationResult` objects carry `neverUserVisible: true`. This scaffold is pure governance vocabulary modeling.

---

> **This scaffold defines traceability vocabulary. It does not provide a running audit system. Real audit infrastructure requires operational implementation in future phases.**
