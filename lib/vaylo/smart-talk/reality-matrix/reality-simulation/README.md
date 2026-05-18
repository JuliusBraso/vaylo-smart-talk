# Reality Simulation (8.2D-1 skeleton · 8.2D-2 audit)

## What this is

**Reality Simulation** is a **pre-explanation governance layer**: it consumes Evidence Gates **`EvidenceGateDecision.trace`** (including **dry-run** slices and metadata) and returns a **`RealitySimulationResult`** — structured **candidates**, **boundaries**, and **flags** only.

Canonical architecture: **`../REALITY_SIMULATION_SPEC.md`**.

## What this is not

- **Not** user-visible text, Slovak/German copy, or marketing language.  
- **Not** Smart Talk, OpenAI, API routes, or UI wiring.  
- **Not** legal advice, final legal truth, or deadline calculation.  
- **Not** production claim/reality authorization (dry-run rows are **never** promoted here).  
- **Not** OCR, regex on document text, or inspection of `cueHits` / matched text in the **8.2D-1** skeleton (`runRealitySimulation`).

## Entry point

- **`runRealitySimulation({ evidenceGateDecision })`** — pure function; see `run-reality-simulation.ts`.  
- Version stamp: **`REALITY_SIMULATION_SKELETON_VERSION`**.

## Safe input boundary (8.2D-1)

The skeleton reads **only** structured trace fields (and matrix identity on the trace): e.g. `claimDecisions`, `realityDecisions`, `dryRunClaimAuthorizations`, `dryRunRealityAuthorizations`, `dryRunTrapActivations`, `dryRunStabilizerCandidates`, `dryRunSeverityDerivations`, `traceMetadata`, `matrixDocumentType` / `matrixSchemaVersion`, `matrixMismatchFlag`. It does **not** read `input.documentText` and does **not** walk `cueHits` or evidence-rule prose.

## Uncertainty preservation

If dry-run realities are uncertain, traps are ambiguous, metadata suggests speculative paths, or the matrix snapshot mismatches flat fields, the simulation adds **`uncertaintyReasons`**, **`explanationBoundaries`** (e.g. `require_uncertainty_wording`), and **`reviewFlags`** — it does **not** collapse uncertainty into factual certainty.

## Trap / stabilizer / severity

- **Traps** → `trapWarnings`, boundaries, uncertainty — **not** output suppression.  
- **Stabilizers** → `stabilizerNeeds` with **catalog ids / categories** — **not** matrix example wording.  
- **Severity derivations** → `severityPostureCandidate` with **`neverUserVisible: true`** — **not** UI urgency.

## PHASE 8.2D-2 — Simulation Boundary Mapping Audit

**Audit-only phase:** no changes to `run-reality-simulation.ts`, gate resolvers, or simulation types. Documents how boundary tokens, trap/stabilizer/severity influence, review flags, and dry-run leakage risks behave in the **8.2D-1** skeleton.

**Key caveat:** **`enforcementTrapHeuristic`** (`trapKind` substring checks) is **skeleton-only** and **must not** drive production explanation boundaries — replace with **structured trap metadata** before production coupling.

**Canonical audit:** [`../SIMULATION_BOUNDARY_MAPPING_AUDIT.md`](../SIMULATION_BOUNDARY_MAPPING_AUDIT.md).

## PHASE 8.2D-2A — Boundary Vocabulary Consolidation Audit

**Vocabulary audit only — no runtime behavior changed.**

Key findings (8.2D-2A) and fix (8.2D-2B):
- **`recommend_human_review_for_high_risk`** (former spec §7 name, never emitted by runtime) has been **removed from the `ExplanationBoundary` union in 8.2D-2B**. Canonical token is **`recommend_human_review_high_risk`** only.
- **Three tokens never emitted** by skeleton v1 (wiring pending): `do_not_claim_finality`, `use_relative_deadline_wording_only`, `mention_uncertainty_if_ocr_noisy`.
- **Two tokens emitted but absent from spec §7**: `do_not_present_speculation_as_fact`, `do_not_merge_lanes`.
- Consumers must treat boundary tokens as **machine constraints**, never as user text.

**Canonical audit:** [`../BOUNDARY_VOCABULARY_AUDIT.md`](../BOUNDARY_VOCABULARY_AUDIT.md).

## PHASE 8.2D-3 — Boundary Policy Table v1

**Policy metadata only — no runtime behavior changed.**

Adds a typed, versioned registry:

- `boundary-policy-types.ts`
- `boundary-policy-table.ts`
- `BOUNDARY_POLICY_TABLE_V1`
- `BOUNDARY_POLICY_TABLE_VERSION`

The table records canonical boundary ids, categories, production-readiness posture, consumer constraints, and historical deprecated-token metadata. It does **not** evaluate traces, enforce boundaries, generate wording, or connect to Smart Talk.

**Canonical doc:** [`../BOUNDARY_POLICY_TABLE_V1.md`](../BOUNDARY_POLICY_TABLE_V1.md).

## PHASE 8.2D-4 — Boundary Emission Regression Scaffold

**Scaffold only — no runtime behavior changed, no simulation output changed.**

Adds two new modules:

- **`validate-boundary-emissions.ts`** — pure `validateBoundaryEmissions()` helper that cross-checks any set of `ExplanationBoundary` ids against `BOUNDARY_POLICY_TABLE_V1`. Detects unknown tokens, deprecated alias emissions, and union/table drift.
- **`boundary-emission-regression.ts`** — controlled sample cases and `runBoundaryEmissionRegressionScaffold()` returning structured pass/fail results for use by any future test runner.

**What the scaffold checks:**
- Every emitted id exists in the policy table as a non-deprecated entry.
- Deprecated alias (`recommend_human_review_for_high_risk`) is rejected if force-cast into an emission set.
- Canonical token (`recommend_human_review_high_risk`) is accepted.
- Union/policy-table drift: non-deprecated entries are all accounted for.
- Empty boundary array is valid.

**Not wired into `runRealitySimulation`** — scaffold only, ready for future test runners or CI.

## PHASE 8.2D-4A — Known Explanation Boundaries Registry

**Registry + validation upgrade only — runtime simulation behavior unchanged.**

### Problem this phase solves

TypeScript unions (`ExplanationBoundary`) cannot be iterated at runtime. Without a concrete list of live tokens, it is impossible to perform two-way consistency checks at runtime — e.g., detecting that a policy-table entry has drifted away from the union, or verifying that no deprecated alias has crept back in.

### What was added

- **`KNOWN_EXPLANATION_BOUNDARIES`** (`reality-simulation-types.ts`) — a `readonly` `as const` array listing every live `ExplanationBoundary` token, typed with `satisfies readonly ExplanationBoundary[]` to ensure compile-time correctness.
- **`validateBoundaryEmissions` upgraded** (`validate-boundary-emissions.ts`) — now accepts an optional `knownBoundaries` parameter (defaults to `KNOWN_EXPLANATION_BOUNDARIES`) and returns four new result fields:
  - `knownBoundaryIds` — the registry used for two-way checks.
  - `missingPolicyForKnownBoundaryIds` — live boundaries with no non-deprecated policy entry.
  - `policyBoundaryIdsMissingFromKnownRegistry` — non-deprecated policy entries absent from the registry.
  - `deprecatedPolicyIdsPresentInKnownRegistry` — critical: deprecated ids incorrectly in the registry.
- **Regression scaffold extended** (`boundary-emission-regression.ts`) — adds a `registryConsistencyCheck` block to `runBoundaryEmissionRegressionScaffold` verifying all four two-way conditions.
- **`KNOWN_EXPLANATION_BOUNDARIES` exported** from `index.ts`.

### Invariant

`KNOWN_EXPLANATION_BOUNDARIES` must always contain exactly the same members as `ExplanationBoundary`. The `satisfies` constraint enforces this at compile time. The deprecated alias `"recommend_human_review_for_high_risk"` (removed in 8.2D-2B) must **never** appear in this array — it exists solely as historical metadata in `BOUNDARY_POLICY_TABLE_V1`.

### Five two-way validation rules

1. Every emitted boundary exists in a non-deprecated policy-table entry.
2. No emitted boundary is deprecated.
3. Every known live boundary has a non-deprecated policy entry (registry → table).
4. Every non-deprecated policy entry has a corresponding known boundary (table → registry).
5. Deprecated policy entries must NOT appear in the known registry.

## PHASE 8.2D-4B — Boundary Validation Full Consistency Flag

**Validation hardening only — no runtime behavior changed, no simulation output changed.**

### What was added

A single new boolean field on `BoundaryEmissionValidationResult`:

```
fullyConsistent: boolean
```

### `valid` vs `fullyConsistent`

| Flag | Rules covered | Use case |
|------|--------------|----------|
| `valid` | Rules 1–2 + legacy rule 3: emitted ids are known, non-deprecated, and have a policy entry | Emitted-set safety — safe to use wherever only the current emission is being checked |
| `fullyConsistent` | All five two-way rules | Full governance integrity — registry ↔ policy-table parity, deprecated-alias exclusion, plus all `valid` conditions |

`valid` is **unchanged** for backward compatibility. It will continue to return `true` for any set of clean, canonical emitted tokens, regardless of whether the live registry or policy table have drifted from each other.

`fullyConsistent` is `true` only when **all six violation arrays are empty**:

- `unknownBoundaryIds`
- `deprecatedBoundaryIds`
- `missingPolicyBoundaryIds` *(emitted-set coverage)*
- `missingPolicyForKnownBoundaryIds` *(registry → table)*
- `policyBoundaryIdsMissingFromKnownRegistry` *(table → registry)*
- `deprecatedPolicyIdsPresentInKnownRegistry` *(deprecated exclusion)*

### Regression scaffold update

`runBoundaryEmissionRegressionScaffold` now surfaces `fullyConsistentResult` inside `registryConsistencyCheck`. A note in the `notes` array explains the distinction between the two flags. The `allPassed` gate now requires `fullyConsistentResult` to be `true` in addition to all prior conditions.

## PHASE 8.2D-5 — Structured Trap Metadata Foundation

**Metadata foundation only — no runtime behavior changed, no simulation output changed.**

### Problem this phase addresses

The `enforcementTrapHeuristic` in `run-reality-simulation.ts` identifies enforcement-related
traps using coarse `trapKind` substring checks (`"enforcement"`, `"vollstreckung"`, `"mahnung"`,
`"escalation"`). This approach has two documented problems:

1. **Silent gaps** — four enforcement traps are missed: `payment_reminder_to_account_seizure`,
   `weitere_schritte_to_forced_collection`, `overdue_payment_to_salary_garnishment`,
   `overdue_payment_to_eviction`.
2. **Semantic conflation** — `generic_escalation_to_legal_disaster` is incorrectly matched as
   an enforcement trap; it is an escalation/panic trap.

### What was added

- **`trap-metadata-types.ts`** — defines `TrapGovernanceDomain`, `TrapRiskClass`,
  `TrapProductionReadiness`, `TrapConsumerConstraint`, and `TrapMetadataDefinition`.
- **`trap-metadata-registry.ts`** — `TRAP_METADATA_REGISTRY_V1`, a readonly, typed, central
  registry mapping all 31 registered `HallucinationTrapKind` values to explicit governance
  metadata, including `isEnforcementRelated`, `isEscalationRelated`, `isDeadlineRelated`,
  and `isLaneContaminationRelated` boolean flags.
- **`TRAP_METADATA_FOUNDATION.md`** — explains the current heuristic's problems, the
  structured replacement strategy, and the Phase 8.2D-5A implementation plan.
- A doc-only comment was added to `enforcementTrapHeuristic` marking it as skeleton-only
  with an explicit replacement pointer. **No behavior changed.**

### What was NOT done (intentionally)

- `enforcementTrapHeuristic` was **not replaced** — that is Phase 8.2D-5A.
- `runRealitySimulation` was **not modified** — behavior is strictly unchanged.
- No boundary emission, review flag, or severity behavior changed.

**Canonical doc:** [`../TRAP_METADATA_FOUNDATION.md`](../TRAP_METADATA_FOUNDATION.md).

---

> **Reality simulation models safe explanation space, not legal truth.**
