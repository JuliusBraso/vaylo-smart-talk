# Boundary Policy Table v1 (Phase 8.2D-3)

**Mode:** governance policy foundation.  
**Runtime posture:** metadata only — **no explanation generation**, **no Smart Talk wiring**, **no runtime enforcement**, **no UI urgency**.

The canonical table lives in:

- `reality-simulation/boundary-policy-types.ts`
- `reality-simulation/boundary-policy-table.ts`

Exported symbols:

- `BOUNDARY_POLICY_TABLE_VERSION`
- `BOUNDARY_POLICY_TABLE_V1`

---

## Purpose

Boundary tokens previously existed as a string union plus scattered documentation. Phase **8.2D-3** creates the first structured, typed registry for those tokens:

- canonical boundary ids;
- governance categories;
- production-readiness posture;
- consumer safety constraints;
- deprecated alias governance;
- ownership / intended consumer layer hints.

This table is a **policy metadata registry**, not an explanation engine.

---

## Consumer obligations

Consumers of `BOUNDARY_POLICY_TABLE_V1` and `RealitySimulationResult.explanationBoundaries` must:

- treat boundary ids as **machine constraints**, never as user-facing text;
- never render boundary ids directly;
- never infer legal conclusions from a boundary;
- never treat review recommendations as legal advice;
- never convert dry-run simulation output into user-visible output without a separate production integration phase;
- respect `consumerConstraints` as a contract even though this phase does not enforce them at runtime.

---

## Dry-run vs production semantics

Most entries are marked either:

- `dry_run_only` — usable for governance observation and tests, not production explanation decisions;
- `governance_foundation` — stable enough as a policy invariant, but still metadata only in 8.2D-3.

`candidate_for_production` is intentionally unused in v1. No token should be treated as production-ready until a later phase defines:

- policy-table consumers;
- regression tests;
- trace fixtures;
- product ownership;
- explicit explanation-governance behavior.

---

## Boundary categories

`BoundaryCategory` currently includes:

- `prohibition`
- `required_wording_constraint`
- `conditional_advisory`
- `escalation_recommendation`
- `escalation_safety`
- `uncertainty_preservation`
- `lane_safety`
- `simulation_safety`

Categories are descriptive metadata. They do not cause runtime branching in this phase.

---

## Consumer constraints

Each policy entry includes `consumerConstraints`.

All entries include at least:

- `never_render_directly`
- `dry_run_not_truth`

Riskier entries also include constraints such as:

- `not_legal_advice`
- `not_deadline_authority`
- `requires_uncertainty_layer`
- `requires_human_review_context`

These are **metadata contracts**, not enforced behavior.

---

## Deprecated token governance

The removed alias:

```text
recommend_human_review_for_high_risk
```

is **not** part of the live `ExplanationBoundary` union. It exists only in `BOUNDARY_POLICY_TABLE_V1` as historical governance metadata:

- `deprecated: true`
- `replacementBoundaryId: "recommend_human_review_high_risk"`
- `productionReadiness: "not_safe_for_production"`
- `intendedConsumerLayer: "audit_only"`

The canonical live token is:

```text
recommend_human_review_high_risk
```

---

## Non-goals

Phase **8.2D-3** does **not**:

- generate explanations;
- enforce runtime behavior;
- calculate deadlines;
- create legal interpretations;
- authorize claims or realities;
- rewrite text;
- connect to Smart Talk;
- expose UI urgency;
- add LLM logic.

---

## Relationship to prior audits

This phase implements the registry recommended by:

- `SIMULATION_BOUNDARY_MAPPING_AUDIT.md`
- `BOUNDARY_VOCABULARY_AUDIT.md`

It does not resolve all modeling weaknesses. In particular, future phases still need:

- emitted-token regression tests;
- structured trap metadata;
- severity policy graph;
- review-flag threshold policy;
- production/dry-run type split at consumer boundaries.
