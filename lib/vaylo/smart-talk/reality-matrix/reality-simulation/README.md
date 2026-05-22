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

**Canonical doc:** [`../TRAP_METADATA_FOUNDATION.md`](../TRAP_METADATA_FOUNDATION.md).

## PHASE 8.2D-5A — Replace enforcementTrapHeuristic With Structured Trap Metadata

**Targeted governance refactor — no Smart Talk, no user-visible behavior, no explanation generation.**

### What changed

- **`trap-metadata-registry.ts` refactored** — cluster arrays replaced by `TRAP_METADATA_BY_KIND`,
  a record typed with `satisfies Record<HallucinationTrapKind, TrapMetadataDefinition>`.
  Missing any registered trap kind is now a **compile-time error**. `TRAP_METADATA_REGISTRY_V1`
  is derived from `Object.values(TRAP_METADATA_BY_KIND)` for backward-compatible iteration.

- **`run-reality-simulation.ts` updated:**
  - `enforcementTrapHeuristic` (substring-based) **removed**.
  - `buildTrapGovernanceFlags(traps)` **added** — looks up each active trap's `trapKind` in
    `TRAP_METADATA_BY_KIND`; ORs `isEnforcementRelated`, `isEscalationRelated`,
    `isDeadlineRelated`, `isLaneContaminationRelated` across all triggered/uncertain traps.
  - `buildExplanationBoundaries` now accepts `trapFlags: TrapGovernanceFlags`.

### Boundary logic improvements (simulation-internal only)

| Boundary | Old trigger | New trigger |
|----------|-------------|-------------|
| `do_not_claim_enforcement` | Any active trap + substring match | Only traps with `isEnforcementRelated: true` |
| `do_not_merge_lanes` | Any active trap | Only traps with `isLaneContaminationRelated: true` |
| `require_uncertainty_wording` | Uncertainty/speculative signals | Same + `isEscalationRelated: true` traps |

**Gap closures:** Four enforcement traps previously missed — `payment_reminder_to_account_seizure`,
`weitere_schritte_to_forced_collection`, `overdue_payment_to_salary_garnishment`,
`overdue_payment_to_eviction` — now correctly trigger `do_not_claim_enforcement`.

**Semantic fix:** `generic_escalation_to_legal_disaster` no longer triggers the enforcement
boundary; it correctly triggers `require_uncertainty_wording` only.

**Missing metadata fallback:** An unregistered `trapKind` at runtime applies a conservative
enforcement + escalation fallback and appends `{ code: "unregistered_trap_metadata", detail: trapKind }`
to `uncertaintyReasons`.

**Canonical doc:** [`../TRAP_METADATA_FOUNDATION.md`](../TRAP_METADATA_FOUNDATION.md).

## PHASE 8.2D-6 — Simulation -> Explanation Contract v1

**Contract / type specification only — no runtime behavior changed, no Smart Talk wiring, no payment logic.**

### What was added

- **`explanation-contract-types.ts`** — defines `SimulationExplanationContract`, access tiers, free-preview fields, paid-explanation fields, forbidden explanation moves, required explanation constraints, and uncertainty requirements.
- **`SIMULATION_EXPLANATION_CONTRACT.md`** — documents the free-vs-paid handoff boundary, monetization constraints, boundary mapping policy, and non-goals.

### Access tier separation

`SimulationExplanationContract` is a discriminated union:

- `free_preview` contracts may carry only `freePreviewFields`; `paidExplanationFields?: never`.
- `paid_explanation` contracts may carry `paidExplanationFields`, but still cannot carry calculated deadlines, legal certainty, generated prose, raw document text, or unrestricted extraction.

### Free preview restrictions

Free preview is limited to safe teaser metadata:

- document type candidate / label
- safe sender category
- whether financial or deadline signals exist
- bounded attention preview
- human review suggestion
- bounded confidence posture

It must not include exact amounts, exact dates, legal conclusions, action steps, risk triggers, personal data, or raw text.

### Paid explanation restrictions

Paid explanation may carry deeper structured signals such as explicit financial/deadline mentions, institution signals, authorized claim candidates, supported reality candidates, uncertainty reasons, boundary ids, review flags, and trap warning ids.

Paid still does **not** allow calculated deadlines, legal certainty, guaranteed outcomes, autonomous form submission, unrestricted extraction, or boundary bypass.

### Boundary mapping policy

The contract documents future mapping only:

| Boundary id | Contract implication |
|-------------|----------------------|
| `do_not_calculate_deadline` | `no_deadline_calculation_when_forbidden` |
| `do_not_claim_enforcement` | `no_enforcement_claim_when_forbidden` |
| `require_uncertainty_wording` | `required_uncertainty_wording` |

No runtime mapper or explanation builder is introduced in this phase.

**Canonical doc:** [`../SIMULATION_EXPLANATION_CONTRACT.md`](../SIMULATION_EXPLANATION_CONTRACT.md).

## PHASE 8.2D-6A — Contract Boundary Mapping Regression Scaffold

**Governance regression scaffold only — no runtime wiring, no explanation generation, no payment logic.**

### What was added

- **`validate-contract-boundary-mapping.ts`** — pure `validateContractBoundaryMapping()` helper that checks supplied `ExplanationBoundary` ids against explicit contract requirements.
- **`contract-boundary-regression.ts`** — controlled scaffold cases via `runContractBoundaryRegressionScaffold()`.

### Explicit mapping rules

The validator uses only a fixed rule table:

| Boundary id | Required contract id |
|-------------|----------------------|
| `do_not_calculate_deadline` | `no_deadline_calculation_when_forbidden` |
| `do_not_claim_enforcement` | `no_enforcement_claim_when_forbidden` |
| `require_uncertainty_wording` | `required_uncertainty_wording` |
| `do_not_present_dry_run_as_fact` | `no_dry_run_as_fact` |
| `do_not_present_speculation_as_fact` | `no_speculation_as_fact` |
| `do_not_merge_lanes` | `no_cross_lane_merging` |

No legal meaning is inferred from boundary names. No deadlines are calculated. No text is generated.

### Regression cases

The scaffold includes:

- valid canonical case
- missing forbidden move case
- missing required constraint case
- multiple boundary case
- empty safe case
- unknown forbidden move protection
- unknown required constraint protection

Unknown forbidden moves or required constraints make both `valid` and `fullyConsistent` false and are reported explicitly.

This scaffold is not called by `runRealitySimulation`, Smart Talk, payment, or any explanation layer.

---

## PHASE 8.2D-6B — Known Explanation Contract Registries

**Files:** `explanation-contract-types.ts`, `validate-contract-boundary-mapping.ts`, `contract-boundary-regression.ts`, `index.ts`.

**No runtime behavior changed.**

### Why the registries exist

`ForbiddenExplanationMove` and `RequiredExplanationConstraint` are TypeScript **string unions**. Union members cannot be iterated at runtime, which means a validator that needs to check "is this token in the live set?" must maintain its own copy of the token list — creating a drift surface every time the union changes.

Two canonical `as const satisfies readonly <Union>[]` registries close that gap:

- **`KNOWN_FORBIDDEN_EXPLANATION_MOVES`** — every live `ForbiddenExplanationMove` token (11 entries).
- **`KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS`** — every live `RequiredExplanationConstraint` token (6 entries).

The `satisfies` constraint is compile-time enforced: adding or removing a union member without updating the registry is a TypeScript error.

### Validator update

`validateContractBoundaryMapping` now **imports** both registries from `explanation-contract-types.ts` rather than duplicating the lists locally. Optional override parameters (`knownForbiddenMoves?`, `knownRequiredConstraints?`) allow callers to supply custom sets for isolated testing while defaulting to the canonical registries.

The result shape gains two new fields — `knownForbiddenMoveIds` and `knownRequiredConstraintIds` — making the active registry explicit in every validation result for auditing and debugging.

### Regression scaffold

`runContractBoundaryRegressionScaffold` (version `8.2d-6b-contract-boundary-regression-v2`) adds a `registryConsistencyCheck` block that verifies:

- All `KNOWN_FORBIDDEN_EXPLANATION_MOVES` are accepted without triggering unknown-token failures.
- All `KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS` are accepted without triggering unknown-token failures.
- A force-cast unknown forbidden move is still correctly rejected.
- A force-cast unknown required constraint is still correctly rejected.

`allPassed` now incorporates registry consistency in addition to the per-case results.

---

## PHASE 8.2D-6C — Contract Boundary Rule Coverage Scaffold

**Files:** `validate-contract-boundary-mapping.ts`, `contract-boundary-regression.ts`, `index.ts`.

**No runtime behavior changed.**

### The problem this closes

The `CONTRACT_BOUNDARY_MAPPING_RULES` rule table is explicit, but there was no coverage guard to detect when a new `ExplanationBoundary` token that requires contract implications is added without a corresponding rule entry. That gap would be silent: the validator would simply never fire for that boundary.

### CONTRACT_RELEVANT_EXPLANATION_BOUNDARIES (exported)

Not every `ExplanationBoundary` needs a contract mapping. Some boundaries are informational-only governance markers (`do_not_claim_finality`, `mention_uncertainty_if_ocr_noisy`, `use_relative_deadline_wording_only`, `do_not_merge_payment_and_appeal`, `recommend_human_review_high_risk`) — they govern explanation style but do not obligate a specific `ForbiddenExplanationMove` or `RequiredExplanationConstraint`.

The six boundaries that **must** each have a rule are declared explicitly in `CONTRACT_RELEVANT_EXPLANATION_BOUNDARIES`:

- `do_not_calculate_deadline`
- `do_not_claim_enforcement`
- `require_uncertainty_wording`
- `do_not_present_dry_run_as_fact`
- `do_not_present_speculation_as_fact`
- `do_not_merge_lanes`

Relevance is declared; never inferred from token names.

### New result fields (all calls)

`ContractBoundaryMappingValidationResult` gains four fields that are **always computed** from the rule table regardless of the call's input boundary set:

| Field | What it detects |
|---|---|
| `contractRelevantBoundaryIds` | The active `CONTRACT_RELEVANT_EXPLANATION_BOUNDARIES` registry used |
| `mappedBoundaryIds` | Boundaries that have at least one rule entry |
| `contractRelevantBoundariesMissingRules` | Contract-relevant boundaries with no rule (coverage drift) |
| `mappingRulesForUnknownBoundaries` | Rule-table entries referencing unknown/deprecated boundaries |

### fullyConsistent semantics (8.2D-6C update)

| Flag | Condition |
|---|---|
| `valid` | Emitted-set safety only: no missing moves/constraints, no unknown tokens (backward-compatible) |
| `fullyConsistent` | `valid` AND `contractRelevantBoundariesMissingRules` empty AND `mappingRulesForUnknownBoundaries` empty |

This means `fullyConsistent` can be `false` even for a "clean" emitted-set call if the rule table itself has coverage drift — which is the intended behavior.

### Regression scaffold (v3)

`runContractBoundaryRegressionScaffold` (version `8.2d-6c-contract-boundary-regression-v3`) adds:

- A `mappingCoverageCheck` block: `allContractRelevantBoundariesMapped`, `noMappingRulesForUnknownBoundaries`, and the two drift arrays.
- A new regression case: `informational_boundary_no_mapping_required` — confirms that boundaries outside `CONTRACT_RELEVANT_EXPLANATION_BOUNDARIES` are valid without a contract rule.
- `allPassed` now gates on `mappingCoverageCheck` in addition to per-case results and registry consistency.

---

## PHASE 8.2F-5 — Explanation Output Regression Corpus

**Structural cognition output regression only — no prose generation, no runtime wiring, no LLM, no OCR.**

### What was added

- **`explanation-output-regression-corpus.ts`** — defines `ExplanationOutputRegressionCase` interface, `ExplanationOutputRegressionFailureCategory` type union, `BlockedReasonExpectation` interface, and `EXPLANATION_OUTPUT_REGRESSION_CORPUS` (15 structural cases). Data only.
- **`validate-explanation-output-regressions.ts`** — exports `validateExplanationOutputRegression(draft, corpusCase): ExplanationOutputRegressionValidationResult`. Pure validator. No prose inspection, no NLP, no OCR.
- **`explanation-output-regression-scaffold.ts`** — exports `runExplanationOutputRegressionScaffold(): ExplanationOutputRegressionScaffoldResult`. Routes each corpus case to the correct mapper, validates outputs, aggregates pass/fail with failure taxonomy breakdown.

### Corpus structure

Each corpus case defines:

| Field | Purpose |
|---|---|
| `id` | Stable identifier (e.g. `eo-8-2f-5-0001-*`) |
| `title` | Human-readable description |
| `mapperKind` | Which mapper to call (`free_preview` \| `paid_explanation`) |
| `simulationResultFixture` | Minimal `RealitySimulationResult` |
| `contractFixture` | `SimulationExplanationContract` with test-specific moves/constraints |
| `accessTierOverride?` | Overrides `input.accessTier` for invalid-tier cases |
| `expectedSectionsPresent` | Section types that must appear in the draft |
| `expectedSectionsAbsent` | Section types that must be absent |
| `expectedDiagnosticCodes` | Governance diagnostic codes that must be present |
| `expectedUncertaintyPosture` | Required `ExplanationUncertaintyPosture` value |
| `expectedReviewPosture` | Required `ExplanationReviewPosture` value |
| `expectedBlockedReasonCodes` | Per-section `blockedReasonCode` fragments that must be present |
| `expectsZeroSections?` | When true, asserts `sectionDrafts.length === 0` |

### Corpus coverage (15 cases)

| Case | Kind | Scenario |
|---|---|---|
| 0001 | free_preview | Basic safe preview — 3 base sections, no forbidden moves |
| 0002 | free_preview | Uncertainty-preserved posture from required constraints |
| 0003 | free_preview | Deadline suppression — `free_preview_deadline_detail_blocked` diagnostic |
| 0004 | free_preview | Enforcement suppression — `free_preview_enforcement_claim_blocked` diagnostic |
| 0005 | free_preview | Human review flag — `review_recommendation` section present |
| 0006 | free_preview | Invalid tier — `paid_explanation` passed in, zero sections, diagnostic only |
| 0007 | paid_explanation | Basic safe — all 6 base sections, no restrictions |
| 0008 | paid_explanation | Uncertainty-preserved posture |
| 0009 | paid_explanation | Deadline suppression — `paid_deadline_output_blocked`, restricted sections |
| 0010 | paid_explanation | Enforcement suppression — `paid_enforcement_claim_blocked`, restricted sections |
| 0011 | paid_explanation | Legal verdict suppression — `paid_legal_verdict_blocked`, restricted sections |
| 0012 | paid_explanation | Autonomous action — `next_steps_safe` fully excluded |
| 0013 | paid_explanation | Cross-lane suppression — `paid_cross_lane_merge_blocked`, restricted sections |
| 0014 | paid_explanation | All major forbidden moves — all 5 diagnostic codes, `next_steps_safe` excluded |
| 0015 | paid_explanation | Invalid tier — `free_preview` passed in, zero sections, diagnostic only |

### Validator behavior

`validateExplanationOutputRegression` checks:

1. Zero-sections expectation (invalid-tier cases)
2. Required sections present → `missing_required_section`
3. Forbidden sections absent → `forbidden_section_present` or `free_preview_leakage`
4. Diagnostic codes present → `diagnostic_mismatch`
5. Uncertainty posture match → `uncertainty_posture_drift`
6. Review posture match → `review_posture_drift`
7. Blocked reason codes per section → `blocked_reason_missing`
8. Structural free-preview leakage (always enforced) → `free_preview_leakage`
9. Paid-tier free-section isolation → `access_tier_violation`
10. Section governance invariants (`sourceBound`, `neverContainsUserVisibleCopy`) → `forbidden_move_suppression_failure`
11. Diagnostic invariant (`neverUserVisible: true`) → `access_tier_violation`

### Failure taxonomy

| Category | Meaning |
|---|---|
| `missing_required_section` | A section that should be in the draft is absent |
| `forbidden_section_present` | A section that should be absent is present |
| `diagnostic_mismatch` | An expected governance diagnostic code is missing |
| `uncertainty_posture_drift` | The uncertainty posture doesn't match the expected value |
| `review_posture_drift` | The review posture doesn't match the expected value |
| `blocked_reason_missing` | A section that should have a blocked reason code lacks it |
| `free_preview_leakage` | A paid-only section appeared in a free preview draft |
| `forbidden_move_suppression_failure` | A section governance invariant was violated |
| `access_tier_violation` | Tier isolation was breached or a non-visible diagnostic was leaked |

### Expected baseline

All 15 corpus cases pass with the current mapper implementations. `allPassed: true`, `passedCount: 15`, `failedCount: 0`.

---

## PHASE 8.2F-4 — Paid Explanation Mapper Scaffold

**Paid-tier structural cognition scaffold only — no prose, no unrestricted extraction, no Smart Talk wiring, no LLM calls.**

### What was added

- **`run-paid-explanation-mapper.ts`** — exports `PAID_EXPLANATION_MAPPER_VERSION` and `runPaidExplanationMapper(input): RuntimeExplanationDraft`. Specialises the generic mapper for `accessTier === "paid_explanation"` exclusively. Invalid tier input returns a diagnostic-only draft (no sections, no throw).
- **`paid-explanation-mapper-regression-scaffold.ts`** — exports `runPaidExplanationMapperRegressionScaffold()` with nine structural regression cases. No Jest/Vitest. No CI hook.
- **`explanation-mapper-types.ts`** — adds `PaidExplanationMapperDiagnosticCode` union type for strongly-typed paid diagnostic codes.

### Paid section policy

| Section | Produced? | Condition |
|---|---|---|
| `document_overview` | Always | — |
| `what_this_means` | Always | — |
| `attention_points` | Always | — |
| `next_steps_safe` | Default yes, excludable | Excluded when `no_autonomous_form_submission` is active |
| `uncertainty_and_limits` | Always | — |
| `paid_deep_explanation` | Always | May be restricted by forbidden moves |
| `review_recommendation` | Conditional | Only when review flags are active |
| `payment_preview_limited` | **Never** | Free-only section |

Conceptual outputs that are forbidden even in paid mode: `autonomous_action_execution`, `official_submission`, `legal_verdict`, `enforcement_confirmation`, `calculated_deadline_output`.

### Paid allowed contract fields (per section)

| Section | Allowed fields |
|---|---|
| `document_overview` | `documentTypeCandidate`, `documentTypeLabel`, `senderCategory`, `confidencePosture`, `institutionSignals` |
| `what_this_means` | `institutionSignals`, `authorizedClaimCandidates`, `supportedRealityCandidates`, `uncertaintyReasons` |
| `attention_points` | `authorizedClaimCandidates`, `trapWarningIds`, `reviewFlags` |
| `next_steps_safe` | `authorizedClaimCandidates`, `uncertaintyReasons`, `reviewFlags` (safe procedural only) |
| `uncertainty_and_limits` | `uncertaintyReasons`, `confidencePosture` |
| `review_recommendation` | `humanReviewSuggested`, `reviewFlags` |
| `paid_deep_explanation` | `explicitFinancialSignalsOnly`, `explicitDeadlineMentionsOnly`, `institutionSignals`, `authorizedClaimCandidates`, `supportedRealityCandidates`, `boundaryIds`, `trapWarningIds` |

Not accessible at any point: raw document text, OCR spans, LLM responses, personal data dumps, unsupported claims, hidden Evidence Gate traces.

### Forbidden move suppression

| Forbidden move | Diagnostic code | Effect |
|---|---|---|
| `no_autonomous_form_submission` | `paid_autonomous_action_blocked` | `next_steps_safe` **excluded** |
| `no_deadline_calculation_when_forbidden` | `paid_deadline_output_blocked` | `paid_deep_explanation`, `next_steps_safe` restricted |
| `no_enforcement_claim_when_forbidden` | `paid_enforcement_claim_blocked` | `paid_deep_explanation`, `attention_points` restricted |
| `no_definitive_legal_verdicts` | `paid_legal_verdict_blocked` | `what_this_means`, `paid_deep_explanation` restricted |
| `no_cross_lane_merging` | `paid_cross_lane_merge_blocked` | `what_this_means`, `paid_deep_explanation` restricted |
| `no_high_panic_phrasing` | `paid_enforcement_claim_blocked` | `attention_points`, `what_this_means` restricted |
| `no_dry_run_as_fact` / `no_speculation_as_fact` / `no_guaranteed_outcomes` / `no_tax_certainty` / `no_immigration_certainty` | `paid_legal_verdict_blocked` | `what_this_means`, `paid_deep_explanation` restricted |

### Invalid tier behavior

If `input.accessTier !== "paid_explanation"`, `runPaidExplanationMapper` returns a diagnostic-only draft with `sectionDrafts: []` and `invalid_access_tier_for_paid_explanation_mapper` diagnostic. No throw.

### Regression scaffold cases

| Case | Description |
|---|---|
| `basic_paid_explanation` | All 6 base sections present, no restrictions, correct tier and posture |
| `paid_uncertainty_required` | `uncertainty_preserved` posture, all sections `uncertaintyPreserved: true` |
| `paid_deadline_forbidden` | `paid_deadline_output_blocked` diagnostic, `paid_deep_explanation` and `next_steps_safe` restricted |
| `paid_enforcement_forbidden` | `paid_enforcement_claim_blocked` diagnostic, `paid_deep_explanation` and `attention_points` restricted |
| `paid_legal_verdict_forbidden` | `paid_legal_verdict_blocked` diagnostic, `what_this_means` and `paid_deep_explanation` restricted |
| `paid_human_review_flag` | `review_recommendation` section, `human_review_recommended` posture |
| `paid_cross_lane_suppression` | `paid_cross_lane_merge_blocked` diagnostic, `what_this_means` and `paid_deep_explanation` restricted |
| `invalid_free_preview_tier_input` | Diagnostic-only draft, zero sections, no throw |
| `paid_all_major_forbidden_moves` | `next_steps_safe` excluded, all 5 diagnostic codes, restricted sections have blocked reasons |

---

## PHASE 8.2F-3 — Free Preview Mapper Scaffold

**Structural free-tier specialization only — no prose, no paid leakage, no Smart Talk wiring, no LLM calls.**

### What was added

- **`run-free-preview-mapper.ts`** — exports `FREE_PREVIEW_MAPPER_VERSION` and `runFreePreviewMapper(input): RuntimeExplanationDraft`. Specialises the generic mapper for `accessTier === "free_preview"` exclusively. Invalid tier input returns a diagnostic-only draft (no sections, no throw).
- **`free-preview-mapper-regression-scaffold.ts`** — exports `runFreePreviewMapperRegressionScaffold()` with seven structural regression cases. No Jest/Vitest. No CI hook.
- **`explanation-mapper-types.ts`** — adds `FreePreviewMapperDiagnosticCode` union type for strongly-typed free-preview diagnostic codes.

### Free preview section policy

| Section | Produced? | Condition |
|---|---|---|
| `document_overview` | Always | — |
| `payment_preview_limited` | Always | — |
| `uncertainty_and_limits` | Always | — |
| `review_recommendation` | Conditional | Only when review flags are active |
| `what_this_means` | **Never** | Paid-only |
| `attention_points` | **Never** | Paid-only |
| `next_steps_safe` | **Never** | Paid-only |
| `paid_deep_explanation` | **Never** | Paid-only |

### Free preview allowed contract fields (per section)

| Section | Allowed fields |
|---|---|
| `document_overview` | `documentTypeCandidate`, `documentTypeLabel`, `senderCategory`, `confidencePosture` |
| `payment_preview_limited` | `hasFinancialSignal`, `hasDeadlineSignal`, `attentionLevelPreview`, `confidencePosture` |
| `uncertainty_and_limits` | `confidencePosture`, `attentionLevelPreview` |
| `review_recommendation` | `humanReviewSuggested` |

No `PaidExplanationFields` keys are referenced. No exact amounts, dates, deadlines, action steps, legal conclusions, enforcement certainty, or raw text.

### Forbidden move suppression diagnostics

| Forbidden move | Diagnostic code emitted | Section-level effect |
|---|---|---|
| `no_deadline_calculation_when_forbidden` | `free_preview_deadline_detail_blocked` | `payment_preview_limited` gets `blockedReasonCode` |
| `no_enforcement_claim_when_forbidden` | `free_preview_enforcement_claim_blocked` | — (section already absent) |
| `no_autonomous_form_submission` | `free_preview_action_instruction_blocked` | — (next_steps_safe already absent) |
| `no_definitive_legal_verdicts` / `no_guaranteed_outcomes` / `no_dry_run_as_fact` / `no_speculation_as_fact` / `no_cross_lane_merging` / `no_tax_certainty` / `no_immigration_certainty` / `no_high_panic_phrasing` | `free_preview_paid_field_blocked` | — |

`free_preview_paid_field_blocked` is also always emitted unconditionally to document that paid sections are structurally blocked regardless of forbidden moves.

### Invalid tier behavior

If `input.accessTier !== "free_preview"`, `runFreePreviewMapper` returns a diagnostic-only `RuntimeExplanationDraft` with:
- `sectionDrafts: []`
- `neverUserVisibleDiagnostics: [{ code: "invalid_access_tier_for_free_preview_mapper", ... }]`
- forbidden moves and required constraints passed through from contract
- no throw

### Regression scaffold cases

| Case | Description |
|---|---|
| `basic_safe_preview` | Section presence, postures, paid-block diagnostic invariant |
| `preview_uncertainty_required` | `uncertainty_preserved` posture, constraint propagation |
| `preview_deadline_forbidden` | `free_preview_deadline_detail_blocked` diagnostic, `payment_preview_limited` restriction |
| `preview_enforcement_forbidden` | `free_preview_enforcement_claim_blocked` diagnostic, `attention_points` absent |
| `invalid_paid_tier_input` | Diagnostic-only draft, zero sections, no throw |
| `preview_human_review_flag` | `review_recommendation` section, `human_review_recommended` posture |
| `preview_all_major_forbidden_moves` | All suppression diagnostics, no paid leakage, base sections preserved |

---

## PHASE 8.2F-2 — Explanation Mapper Skeleton

**Typed governance skeleton only — no user-visible prose generated, no Smart Talk wiring, no LLM calls, no OCR access.**

### What was added

- **`run-explanation-mapper.ts`** — exports `EXPLANATION_MAPPER_VERSION` and `runExplanationMapper(input): RuntimeExplanationDraft`. Pure function. No side effects.
- **`explanation-mapper-regression-scaffold.ts`** — exports `runExplanationMapperRegressionScaffold()` with five structural regression cases. No Jest/Vitest. No CI hook.
- **`explanation-mapper-types.ts`** — promoted from spec-only sketch to active types: `draftVersion` literal updated to `"8.2f-2-runtime-explanation-draft-v1"`, `mapperVersion?: string` added to `RuntimeExplanationMapperInput`.

### Mapper behavior

`runExplanationMapper` reads only structured governance inputs from `RuntimeExplanationMapperInput`:

| Reads | Does not read |
|---|---|
| `simulationResult` governance fields | raw document text |
| `explanationContract` boundaries / moves / constraints | OCR spans |
| `accessTier` | LLM response text |
| `auditTraceRef` | DNA / user profile |
| `simulationResult.reviewFlags` flagIds | unrelated documents |
| `simulationResult.explanationBoundaries` | payment state beyond `accessTier` |

### Access tier isolation

| Tier | Sections produced | Sections blocked |
|---|---|---|
| `free_preview` | `document_overview`, `payment_preview_limited`, `uncertainty_and_limits`, `review_recommendation` if flagged | All paid-only sections |
| `paid_explanation` | All above except `payment_preview_limited`, plus `what_this_means`, `attention_points`, `next_steps_safe`, `paid_deep_explanation` | `payment_preview_limited` |

### Forbidden move handling

| Forbidden move | Effect |
|---|---|
| `no_autonomous_form_submission` | `next_steps_safe` **excluded** from draft |
| `no_deadline_calculation_when_forbidden` | `paid_deep_explanation` gets `blockedReasonCode` |
| `no_enforcement_claim_when_forbidden` | `paid_deep_explanation`, `attention_points` get `blockedReasonCode` |
| `no_high_panic_phrasing` | `attention_points`, `what_this_means` get `blockedReasonCode` |
| `no_cross_lane_merging` | `what_this_means`, `paid_deep_explanation` get `blockedReasonCode` |
| `no_definitive_legal_verdicts` | `paid_deep_explanation`, `what_this_means` get `blockedReasonCode` |
| `no_dry_run_as_fact` | `what_this_means`, `paid_deep_explanation`, `attention_points` get `blockedReasonCode` |
| `no_speculation_as_fact` | `what_this_means`, `paid_deep_explanation` get `blockedReasonCode` |

### Governance preservation

All sections have `sourceBound: true` and `neverContainsUserVisibleCopy: true`. Diagnostics are collected in `neverUserVisibleDiagnostics`. Applied boundaries, forbidden moves, and required constraints are preserved unchanged from the contract. Uncertainty posture and review posture are derived from simulation flags and contract constraints.

### Regression scaffold cases

| Case | Description |
|---|---|
| `free_preview_basic` | Validates tier isolation, base section presence, governance flags |
| `free_preview_deadline_forbidden` | Validates forbidden move preserved across free tier |
| `paid_uncertainty_required` | Validates `uncertainty_preserved` posture and constraint propagation |
| `paid_human_review_flag` | Validates `human_review_recommended` posture and `high_consequence_uncertainty` |
| `paid_all_major_forbidden_moves` | Validates exclusion, restriction, and diagnostic generation |

---

## PHASE 8.2F-1 — Runtime Explanation Mapper Spec

**Specification only — no runtime behavior changed, no mapper implementation, no Smart Talk wiring.**

Adds:

- **`../RUNTIME_EXPLANATION_MAPPER_SPEC.md`** — formal governance specification for a future Runtime Explanation Mapper.
- **`explanation-mapper-types.ts`** — optional type sketches only: draft/input/section/diagnostic shapes, with no functions.

The future mapper boundary is defined as a constrained transformation from:

- `RealitySimulationResult`
- `SimulationExplanationContract`

into a conceptual `RuntimeExplanationDraft`.

The spec defines:

- allowed structured inputs
- forbidden raw inputs (raw document text, OCR spans, LLM responses, DNA/profile data, unrelated documents)
- free preview vs paid explanation access-tier limits
- section draft types
- boundary enforcement policy
- forbidden move policy
- required constraint policy
- tone policy
- failure modes
- future implementation phases

Important constraints:

- no legal truth
- no deadline calculation
- no dry-run-as-fact
- no speculation-as-fact
- no payment-tier bypass
- no explanation text generation in this phase

The type sketches are compile-time documentation only. They do not export or define any mapper runtime function.

---

## PHASE 8.2F-6 — Smart Talk Bridge Dry Run

**First end-to-end dry-run cognition pipeline bridge. No prose. No LLM. No production Smart Talk wiring.**

Adds:

- **`run-smart-talk-bridge-dry-run.ts`** — Pure `runSmartTalkBridgeDryRun` function. Routes a `SmartTalkBridgeDryRunInput` to `runFreePreviewMapper` or `runPaidExplanationMapper` based on `accessTier`, then performs seven structural-validity and governance-preservation checks on the resulting `RuntimeExplanationDraft`. Returns `SmartTalkBridgeDryRunResult` with `structurallyValid`, `governancePreserved`, `diagnostics`, and `neverUserVisible: true`.

- **`smart-talk-bridge-dry-run-regression.ts`** — Seven regression cases exercising the full bridge pipeline: `free_preview_basic`, `paid_basic`, `paid_uncertainty_required`, `paid_human_review_flag`, `paid_deadline_suppression`, `free_preview_enforcement_forbidden`, `paid_all_major_forbidden_moves`. All assert `governancePreserved === true`, `structurallyValid === true`, no prose, and no cross-tier leakage.

- **`explanation-mapper-types.ts`** (modified) — Adds `BridgeDiagnosticCode`, `BridgeDiagnostic`, `SmartTalkBridgeDryRunInput`, and `SmartTalkBridgeDryRunResult` type definitions. `BridgeDiagnosticCode` enumerates five bridge-level diagnostic codes (`bridge_governance_preservation_failure`, `bridge_invalid_section_invariant`, `bridge_free_preview_leakage`, `bridge_invalid_access_tier`, `bridge_missing_governance_metadata`). All bridge diagnostics carry `neverUserVisible: true`.

### Bridge routing behavior

```
accessTier === "free_preview"       → runFreePreviewMapper()
accessTier === "paid_explanation"   → runPaidExplanationMapper()
else (TypeScript guard)             → bridge_invalid_access_tier diagnostic, fallback to free preview
```

### Structural validity checks (7)

| Check | Failure code |
|-------|-------------|
| All sections: `sourceBound === true` | `bridge_invalid_section_invariant` |
| All sections: `neverContainsUserVisibleCopy === true` | `bridge_invalid_section_invariant` |
| All mapper diagnostics: `neverUserVisible === true` | `bridge_invalid_section_invariant` |
| Contract forbidden moves in `draft.appliedForbiddenMoves` | `bridge_governance_preservation_failure` |
| Contract required constraints in `draft.appliedRequiredConstraints` | `bridge_governance_preservation_failure` |
| Free preview: no paid-only sections | `bridge_free_preview_leakage` |
| Paid: no free-only sections | `bridge_free_preview_leakage` |

`structurallyValid = true` only when section/diagnostic invariants pass.
`governancePreserved = true` only when all governance checks pass AND `structurallyValid === true`.

### Governance preservation

Bridge acts as an **assertion layer above the mappers** — it does not modify the draft. It verifies that contract governance arrays (forbidden moves, required constraints) survived the mapper round-trip unchanged, and that no cross-tier section leakage occurred.

### Regression scaffold cases

| Case | Description |
|---|---|
| `free_preview_basic` | Validates tier routing, base free section presence, paid section absence |
| `paid_basic` | Validates tier routing, paid section presence, free-only section absence |
| `paid_uncertainty_required` | Validates uncertainty posture and constraint propagation through bridge |
| `paid_human_review_flag` | Validates review posture and `review_recommendation` section through bridge |
| `paid_deadline_suppression` | Validates forbidden move survives full bridge pipeline |
| `free_preview_enforcement_forbidden` | Validates enforcement forbidden move through free preview path |
| `paid_all_major_forbidden_moves` | All 5 major forbidden moves + required constraint survive the full pipeline |

---

## PHASE 8.2F-6A — Bridge Contract Tier Mismatch Diagnostic

**Surgical diagnostic hardening. No routing behavior changed. No prose. No Smart Talk wiring.**

Fixes the modeling gap discovered in Phase 8.2F-6 where a bridge invocation with `input.accessTier !== explanationContract.accessTier` was silently handled without explicit observability.

Changes:

- **`explanation-mapper-types.ts`** (modified) — `BridgeDiagnosticCode` extended with `"bridge_contract_tier_mismatch"`.

- **`run-smart-talk-bridge-dry-run.ts`** (modified) — After mapper routing and before structural validity checks, a new check compares `input.accessTier` with `input.explanationContract.accessTier`. If they differ, `bridge_contract_tier_mismatch` is appended to bridge diagnostics with a structural detail string. Routing is **not** changed — it always uses `input.accessTier`.

- **`smart-talk-bridge-dry-run-regression.ts`** (modified) — Case 8 `contract_tier_mismatch_detection` added: bridge invoked with `accessTier: "paid_explanation"` and `contract.accessTier: "free_preview"`. Asserts: `bridge_contract_tier_mismatch` present in diagnostics, `mapperKind === "paid_explanation"` (routing unchanged), `structurallyValid === true`, `governancePreserved === true`, `neverUserVisible === true`.

### Mismatch diagnostic behavior

```
input.accessTier !== explanationContract.accessTier
  → emit bridge_contract_tier_mismatch (neverUserVisible: true)
  → routing NOT changed (still uses input.accessTier)
  → structurallyValid NOT changed
  → governancePreserved NOT changed
  → execution continues normally
```

`bridge_contract_tier_mismatch` is **not** in `governanceViolationCodes` — it is an observability-only diagnostic, not a governance or structural failure.

### Regression case added

| Case | Key Assertions |
|------|----------------|
| `contract_tier_mismatch_detection` | `bridge_contract_tier_mismatch` in diagnostics, `mapperKind="paid_explanation"` (routing unchanged), `structurallyValid=true`, `governancePreserved=true`, `neverUserVisible=true` |

---

## PHASE 8.2F-7 — Trusted User Pilot Gate

**Pre-pilot governance readiness only. No simulation runtime change. No mapper change. No bridge runtime change.**

Adds root-level pilot gate artifacts:

- **`../TRUSTED_USER_PILOT_GATE.md`** — Trusted-user pilot governance gate specification: readiness classifications, mandatory pilot rules, allowed/disallowed scope, stop conditions, escalation path, trust-signal requirements, and future pilot roadmap.

- **`../trusted-user-pilot-gate-types.ts`** — Typed pilot readiness model: `TrustedUserPilotReadiness`, `TrustedUserPilotBlockingIssue`, `TrustedUserPilotWarning`, `TrustedUserPilotConstraint`, `TrustedUserPilotScope`, `TrustedUserPilotStopCondition`, `TrustedUserPilotEscalationRule`, `TrustedUserPilotAllowedDocumentFamily`, and `TrustedUserPilotForbiddenScenario`.

- **`../trusted-user-pilot-readiness-scaffold.ts`** — Pure static `evaluateTrustedUserPilotReadiness()` scaffold returning readiness level, blocking issues, warnings, operational constraints, allowed scope, stop conditions, escalation rules, and notes.

### Readiness classification

| Classification | Scope |
|---|---|
| `READY` | Internal governance dry-run testing, synthetic corpus regression, structural cognition testing |
| `LIMITED READY` | Narrow trusted-user pilot, supervised manual review, non-authoritative framing only |
| `NOT READY` | Public launch, autonomous execution, DNA integration, production OCR cognition, B2B deployment, legal authority positioning |

### Pilot gate boundary

This phase sits **above** the simulation and mapper stack. It does not alter `runRealitySimulation`, Evidence Gates, Simulation -> Explanation Contract behavior, free/paid mappers, bridge routing, diagnostics, API routes, UI, OCR, LLM calls, payment logic, or production rendering.

The readiness scaffold performs no live checks and does not launch any pilot path.

---

## PHASE 8.2F-8 — Internal Human Wording Review Scaffold

**Metadata-only human review governance layer. No prose generation. No real user content reviewed. No pilot activation. No database. No LLM. No OCR. No Smart Talk wiring.**

Adds a typed scaffold that records whether a human reviewer properly inspected a `RuntimeExplanationDraft` against all active governance constraints before any future pilot output could be trusted.

### Files added

| File | Role |
|---|---|
| `wording-review-types.ts` | `WordingReviewVerdict`, `SectionWordingAssessment`, `WordingReviewSnapshot`, `WordingReviewComplianceResult`, `WordingReviewDiagnostic`, `WordingReviewDiagnosticCode` |
| `run-wording-review-scaffold.ts` | `verifyHumanReviewCompliance({ draft, review })` — pure compliance function |
| `wording-review-regression-scaffold.ts` | 8-case regression scaffold exercising all compliance rules |

### Type model

**`WordingReviewVerdict`** — four values:
- `approved` — reviewer attests all sections inspected and pass
- `needs_revision` — structural or wording changes required
- `rejected_with_escalation` — escalation needed before proceeding
- `hard_fail_governance_breach` — reviewer attempted to force-approve with compliance gaps, or unsafe certainty / panic tone detected

**`WordingReviewDiagnosticCode`** — eight structural codes:
- `review_integrity_failure` — force-approve detected
- `review_missing_section_assessment` — section has no reviewer coverage
- `review_unacknowledged_blocked_reason` — blocked reason code not acknowledged
- `review_unreviewed_forbidden_move` — applied forbidden move not reviewed
- `review_unreviewed_required_constraint` — applied required constraint not reviewed
- `review_detected_move_leakage` — reviewer observed forbidden-move content despite suppression
- `review_detected_unsafe_certainty` — reviewer observed false certainty in output
- `review_detected_panic_tone` — reviewer observed panic amplification

**`SectionWordingAssessment`** — per-section: `humanReviewed`, `humanApproved`, `acknowledgedBlockedReasonCodes`, `detectedMoveLeakage`, `detectedUnsafeCertainty`, `detectedPanicTone`, `notes`.

**`WordingReviewSnapshot`** — complete reviewer submission: sections assessed, forbidden moves reviewed, required constraints reviewed. `neverUserVisible: true` enforced.

**`WordingReviewComplianceResult`** — compliance verdict: `compliant`, `governanceCompromised`, `effectiveVerdict`, `diagnostics`, gap arrays, `notes`. `neverUserVisible: true` enforced.

### Compliance rules

1. Every `sectionDraft` must have a corresponding `SectionWordingAssessment`.
2. Every `appliedForbiddenMove` must be listed in `reviewedForbiddenMoves`. Forbidden moves are normal governance constraints — failure is when they are unreviewed, not their existence.
3. Every `appliedRequiredConstraint` must be listed in `reviewedRequiredConstraints`.
4. Every `blockedReasonCode` on any section must be acknowledged in `acknowledgedBlockedReasonCodes`.
5. Any section where `detectedMoveLeakage` is non-empty → compliance gap.
6. Any section where `detectedUnsafeCertainty` is `true` → `governanceCompromised = true`, `effectiveVerdict = "hard_fail_governance_breach"` (regardless of reviewer verdict).
7. Any section where `detectedPanicTone` is `true` → same governance compromise as above.

### Human override protection

Humans may not force-approve structural governance gaps silently.

If `review.verdict === "approved"` but any compliance gap exists:
- `compliant = false`
- `governanceCompromised = true`
- `effectiveVerdict = "hard_fail_governance_breach"`
- `review_integrity_failure` diagnostic emitted

Honest verdicts (`needs_revision`, `rejected_with_escalation`) that detect safety issues (unsafe certainty, panic tone) trigger governance compromise without emitting `review_integrity_failure` — the reviewer was honest, but the content cannot proceed.

### Regression scaffold — 8 cases

| # | Case | Expected outcome |
|---|---|---|
| 1 | Clean draft + complete approved review | `compliant=true`, no diagnostics |
| 2 | Restricted draft + acknowledged blocked + `needs_revision` | `compliant=true`, `governanceCompromised=false` |
| 3 | Restricted draft + force-approved without acknowledgement | `governanceCompromised=true`, `hard_fail_governance_breach` |
| 4 | Missing section assessment | `compliant=false`, `review_integrity_failure` emitted |
| 5 | Unreviewed forbidden move + `approved` verdict | `governanceCompromised=true`, `hard_fail_governance_breach` |
| 6 | Reviewer detects unsafe certainty (`rejected_with_escalation`) | `governanceCompromised=true`, no `review_integrity_failure` |
| 7 | Empty draft + approved review | `compliant=true`, vacuously valid |
| 8 | Reviewer detects panic tone + `approved` verdict | `governanceCompromised=true`, `review_integrity_failure` emitted |

### Safety boundary

This phase does not generate prose, review real user content, connect to Smart Talk, call OCR or LLMs, write database records, calculate deadlines, infer legal conclusions, or approve public output.

All outputs carry `neverUserVisible: true`. The scaffold is purely structural and its results are never surfaced to users.

---

## PHASE 8.2F-9 — OCR Uncertainty Metadata Harness

**Metadata-only OCR degradation risk evaluation. No OCR SDK. No image processing. No LLM. No Smart Talk runtime. No mapper or bridge behavior changed.**

Adds a pure metadata harness that classifies OCR degradation risk and determines whether OCR-derived input may be trusted by the cognition pipeline — or must be escalated to human review or hard-failed before any cognition step proceeds.

### Files added

| File | Role |
|---|---|
| `ocr-uncertainty-types.ts` | `OcrConfidenceLevel`, `OcrPipelineDisposition`, `OcrDegradationVector`, `OcrDiagnosticCode`, `OcrEvaluationResult` |
| `evaluate-ocr-uncertainty.ts` | `evaluateOcrUncertainty({ degradation, baseConfidenceScore })` — pure evaluator |
| `ocr-uncertainty-regression-scaffold.ts` | 8-case regression scaffold for all evaluation rules |

### Type model

**`OcrConfidenceLevel`**: `optimal | degraded_but_readable | critical_ambiguity | unreadable`

**`OcrPipelineDisposition`**: `proceed | proceed_with_uncertainty | human_review_required | hard_fail`

**`OcrDegradationVector`** — eight boolean structural flags:
- `missingDates`, `obscuredSender`, `unreadableAmounts`, `lowResolution`, `truncatedText`, `mixedLanesDetected`, `possiblePromptInjectionText`, `partialDocumentOnly`

**`OcrDiagnosticCode`** — eleven never-user-visible governance codes:
`ocr_optimal`, `ocr_graceful_degradation`, `ocr_critical_ambiguity`, `ocr_human_review_required`, `ocr_hard_fail_unreadable`, `ocr_sender_obscured`, `ocr_missing_dates`, `ocr_unreadable_amounts`, `ocr_partial_document`, `ocr_mixed_lanes`, `ocr_prompt_injection_like_text`

**`OcrEvaluationResult`** — `{ proceedAllowed, disposition, confidence, diagnostics, triggersHumanReview, recommendedBoundaries?, recommendedReviewFlags?, neverUserVisible: true, notes? }`

### Evaluation rules

Rules applied in severity order. Hard-fail rules short-circuit.

| Priority | Trigger | Disposition | Confidence | Key boundaries |
|---|---|---|---|---|
| 1 (hard) | `baseConfidenceScore < 40` | `hard_fail` | `unreadable` | — |
| 2 (hard) | `obscuredSender` | `hard_fail` | `critical_ambiguity` | — |
| 3 | `missingDates` | `human_review_required` | `critical_ambiguity` | `do_not_calculate_deadline`, `require_uncertainty_wording` |
| 3 | `unreadableAmounts` | `human_review_required` | `critical_ambiguity` | `require_uncertainty_wording` |
| 3 | `partialDocumentOnly` | `human_review_required` | `critical_ambiguity` | `require_uncertainty_wording` |
| 4 | `mixedLanesDetected` | ≥ `proceed_with_uncertainty` | ≥ `degraded_but_readable` | `do_not_merge_lanes`, `require_uncertainty_wording` |
| 5 | `possiblePromptInjectionText` | ≥ `proceed_with_uncertainty` | ≥ `degraded_but_readable` | `do_not_present_dry_run_as_fact`, `require_uncertainty_wording` |
| 6 | `lowResolution` or `truncatedText` | no change | demotes `optimal` → `degraded_but_readable` | `mention_uncertainty_if_ocr_noisy` |
| 7 (clean) | none / score ≥ 80 | `proceed` | `optimal` | — |

Higher-severity dispositions are never downgraded by lower-priority rules. Recommended boundaries use existing `ExplanationBoundary` tokens from `reality-simulation-types.ts`.

### Regression scaffold — 8 cases

| # | Case | Expected |
|---|---|---|
| 1 | Perfect scan, score 95 | `proceed`, `optimal`, `ocr_optimal` |
| 2 | Missing dates, score 70 | `human_review_required`, `critical_ambiguity`, `do_not_calculate_deadline` |
| 3 | Unreadable amounts, score 60 | `human_review_required`, `critical_ambiguity` |
| 4 | Obscured sender, score 75 | `hard_fail`, `critical_ambiguity`, `ocr_sender_obscured` |
| 5 | Score 20 | `hard_fail`, `unreadable`, `ocr_hard_fail_unreadable` |
| 6 | Mixed lanes, score 80 | `proceed_with_uncertainty`, `degraded_but_readable`, `do_not_merge_lanes` |
| 7 | Possible prompt injection, score 85 | `proceed_with_uncertainty`, `do_not_present_dry_run_as_fact` |
| 8 | Partial document only, score 65 | `human_review_required`, `critical_ambiguity`, `recommend_human_review_high_risk` |

### Safety boundary

This phase does not call any OCR SDK, process images, import Tesseract / AWS Textract / any OCR library, call LLMs, connect to Smart Talk runtime, generate explanation text, calculate deadlines, or infer legal conclusions. No mapper or bridge files touched.

All `OcrEvaluationResult` objects carry `neverUserVisible: true`. This harness is purely structural — its output drives governance routing, never user-visible copy.

---

## PHASE 8.2F-10 — Redacted Corpus Foundation

**Synthetic redacted exemplars only. No real PII. No real user documents. No OCR. No LLM. No Smart Talk runtime. No mapper or bridge files touched.**

Establishes the data governance foundation for a future real-world redacted corpus: a typed document model, a redaction protocol, a synthetic exemplar registry, and a static privacy-hygiene validation scaffold.

### Files added

| File | Role |
|---|---|
| `redacted-corpus-types.ts` | `RedactedDocument`, `RedactionLevel`, `RedactedPlaceholder`, `RedactedCorpusValidationResult`, placeholder constant |
| `redacted-corpus-registry.ts` | 5 synthetic exemplars — `REDACTED_DOCUMENT_CORPUS` |
| `redacted-corpus-regression.ts` | `runRedactedCorpusRegression` — static PII-hygiene and structural validation |
| `../REDACTED_CORPUS_FOUNDATION.md` | Full redaction protocol and future admission rules |

### Type model

**`RedactedDocumentCategory`**: `finanzamt_bescheid | rundfunkbeitrag | inkasso_mahnung | jobcenter_bescheid | krankenkasse_notice | auslaenderbehoerde_letter | generic_bureaucracy`

**`RedactionLevel`**: `synthetic_redacted_exemplar | fully_anonymized | rejected_contains_possible_pii`

**`RedactedCorpusSourceKind`**: `synthetic_exemplar | future_real_redacted | imported_test_fixture`

**`RedactedPlaceholder`** — 11 standard tokens:
`[NAME]`, `[ADDRESS]`, `[DATE]`, `[AMOUNT]`, `[AKTENZEICHEN]`, `[CUSTOMER_ID]`, `[IBAN]`, `[PHONE]`, `[EMAIL]`, `[AUTHORITY]`, `[CITY]`

**`RedactedDocument`** — corpus entry: `documentId`, `category`, `sourceKind`, `redactionLevel`, `simulatedOcrConfidence`, `redactedText`, `expectedComplexity`, `expectedRiskDomains`, `expectedOcrDegradation?` (uses `Partial<OcrDegradationVector>` from Phase 8.2F-9), `notes`, `neverContainsRealPii: true`.

### Synthetic corpus — 5 exemplars

| documentId | Category | Complexity | OcrConfidence |
|---|---|---|---|
| `synthetic-finanzamt-bescheid-001` | `finanzamt_bescheid` | high | 88 |
| `synthetic-rundfunkbeitrag-mahnung-001` | `rundfunkbeitrag` | low | 92 |
| `synthetic-inkasso-mahnung-001` | `inkasso_mahnung` | high | 74 |
| `synthetic-krankenkasse-notice-001` | `krankenkasse_notice` | medium | 95 |
| `synthetic-auslaenderbehoerde-letter-001` | `auslaenderbehoerde_letter` | high | 68 |

### Validation scaffold — `runRedactedCorpusRegression`

Twelve static hygiene checks. No NLP. No LLM. Pattern matching only.

| # | Check | Failure bucket |
|---|---|---|
| 1 | At least 5 documents | `notes` warning |
| 2 | Unique `documentId` | `duplicateDocumentIds` |
| 3 | Non-empty `redactedText` | `emptyTextDocumentIds` |
| 4 | `redactedText.length > 80` | `tooShortTextDocumentIds` |
| 5 | `simulatedOcrConfidence` in [0, 100] | `invalidConfidenceDocumentIds` |
| 6 | `neverContainsRealPii === true` (runtime guard) | `possiblePiiDocumentIds` |
| 7 | No email pattern outside `[EMAIL]` | `possiblePiiDocumentIds` |
| 8 | No German phone pattern outside `[PHONE]` | `possiblePiiDocumentIds` |
| 9 | No raw IBAN pattern (DE...) outside `[IBAN]` | `possiblePiiDocumentIds` |
| 10 | At least one standard placeholder present | `missingPlaceholderCoverageDocumentIds` |
| 11 | `sourceKind === "synthetic_exemplar"` for current corpus | `notes` warning |
| 12 | No banned name fragments (small static list) | `possiblePiiDocumentIds` |

`valid = true` when no critical errors (duplicate IDs, empty text, PII detected).
`fullyConsistent = true` when `valid` AND no structural warnings.

### Redaction protocol summary

1. No real PII in repo — ever
2. All PII fields use `RedactedPlaceholder` tokens only
3. No unredacted originals stored (no PDF, image, raw OCR output)
4. Human review gate required before any real-world entry is admitted
5. Validation scaffold must pass before commit
6. Only `synthetic_exemplar` entries in Phase 8.2F-10; future real entries require separate review gate

### Cross-phase integration

`expectedOcrDegradation` on each `RedactedDocument` uses `Partial<OcrDegradationVector>` from Phase 8.2F-9, enabling future regression pipelines to feed corpus entries directly into `evaluateOcrUncertainty` for end-to-end structural testing.

### Safety boundary

This phase does not read files, import `fs`, connect to a database, call OCR SDKs, call LLMs, generate explanation text, connect to Smart Talk, calculate deadlines, or infer legal conclusions. No mapper or bridge files were modified.

---

## PHASE 8.2F-11 — Limited Trusted Pilot Gate Scaffold

**Metadata-only pilot gate orchestration. No pilot activated. No real users. No DB. No auth. No OCR SDK. No LLM. No Smart Talk runtime. No mapper or bridge files touched.**

Models whether a hypothetical trusted-pilot transaction would be allowed, blocked, routed to human review, or rejected as out of scope — based on invite status, consent status, session limits, scope constraints, and OCR uncertainty metadata.

### Files added

| File | Role |
|---|---|
| `limited-pilot-gate-types.ts` | `PilotAccessDisposition`, `PilotGateDiagnosticCode`, `PilotSubjectProfile`, `PilotSessionTelemetry`, `PilotScopeRequest`, `LimitedPilotGateInput`, `LimitedPilotGateResult` |
| `run-limited-pilot-gate-scaffold.ts` | `runLimitedPilotGateScaffold(input)` — pure gate function |
| `limited-pilot-gate-regression-scaffold.ts` | 8-case regression scaffold for all gate rules |

### Type model

**`PilotAccessDisposition`**: `allowed | blocked | human_review_required | out_of_scope`

**`PilotGateDiagnosticCode`** — 8 never-user-visible diagnostic codes:
`pilot_gate_passed`, `pilot_unauthorized_subject`, `pilot_missing_consent`, `pilot_session_limit_reached`, `pilot_blocked_by_ocr_degradation`, `pilot_human_review_required_by_ocr`, `pilot_scope_not_allowed`, `pilot_metadata_incomplete`

**`PilotSubjectProfile`** — opaque structural metadata: `pilotSubjectRef`, `isInvited`, `consentSigned`, `pilotRole`. No real user identity.

**`PilotSessionTelemetry`** — `totalTransactionsThisSession`, `maxSessionLimit`, `sequenceId`. Caller-supplied; no live DB state read.

**`PilotScopeRequest`** — uses `RedactedDocumentCategory` (Phase 8.2F-10) and `ExplanationAccessTier`. `containsRealUserDocument: true` triggers `governanceCompromised = true`.

**`LimitedPilotGateResult`** — `{ transactionAllowed, disposition, diagnostics, ocrEvaluation, governanceCompromised, neverUserVisible: true, notes }`. `ocrEvaluation` (`OcrEvaluationResult` from Phase 8.2F-9) always present for audit.

### Gate rules (evaluated in order)

| Priority | Gate | Trigger | Disposition |
|---|---|---|---|
| 1 | Invite | `subject.isInvited === false` | `blocked` |
| 2 | Consent | `subject.consentSigned === false` | `blocked` |
| 3 | Session limit | `totalTransactions >= maxSessionLimit` | `blocked` |
| 4 | Scope — real document | `containsRealUserDocument === true` | `out_of_scope` + `governanceCompromised=true` |
| 4 | Scope — source mode | `sourceMode === "real_document_upload"` | `out_of_scope` |
| 5 | OCR hard fail | `ocrEvaluation.proceedAllowed === false` | `blocked` |
| 6 | OCR human review | `ocrEvaluation.triggersHumanReview === true` | `human_review_required` |
| 7 | All clear | — | `allowed` |

OCR is always evaluated (via `evaluateOcrUncertainty` from Phase 8.2F-9) regardless of which earlier gate fires, so `ocrEvaluation` is always present in the result for audit.

### Cross-phase integration

- **Phase 8.2F-9** (`evaluateOcrUncertainty`): called by the gate function; OCR hard-fail blocks, OCR human-review triggers disposition escalation.
- **Phase 8.2F-10** (`RedactedDocumentCategory`): used in `PilotScopeRequest.documentFamily`.
- **Phase 8.2F-7** (Trusted User Pilot Gate): this scaffold implements the transaction-level gate envisioned in the broader pilot gate governance.

### Regression scaffold — 8 cases

| # | Case | Expected |
|---|---|---|
| 1 | Invited + consent + clean OCR | `allowed`, `pilot_gate_passed` |
| 2 | Not invited | `blocked`, `pilot_unauthorized_subject` |
| 3 | Missing consent | `blocked`, `pilot_missing_consent` |
| 4 | Session limit 10/10 | `blocked`, `pilot_session_limit_reached` |
| 5 | OCR score 20 | `blocked`, `pilot_blocked_by_ocr_degradation` |
| 6 | Missing dates OCR, score 72 | `human_review_required`, `pilot_human_review_required_by_ocr` |
| 7 | Obscured sender OCR | `blocked`, `pilot_blocked_by_ocr_degradation` |
| 8 | `containsRealUserDocument=true` | `out_of_scope`, `governanceCompromised=true` |

### Safety boundary

This phase does not activate any pilot path, connect to real users, read DB state, implement real auth or consent capture, call OCR SDKs, call LLMs, connect to Smart Talk runtime, generate explanation text, calculate deadlines, or infer legal conclusions.

All `LimitedPilotGateResult` objects carry `neverUserVisible: true`. This scaffold is purely structural governance modeling.

---

> **Reality simulation models safe explanation space, not legal truth.**
