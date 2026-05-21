# Pre-MVP Internal Test Harness (Phase 8.2E-5)

## Purpose

Phase 8.2E-5 creates the first internal governance test harness for the Vaylo Document Reasoning Constitution V1 corpus stack.

The harness aggregates the existing controlled-corpus scaffold layers into one corpus-wide pass/fail summary:

- corpus registry and privacy hygiene validation
- scenario boundary expectation consistency
- scenario to explanation-contract expectation consistency
- scenario-level pass/fail reporting
- corpus-wide warning and consistency counts

This is internal governance regression infrastructure only. It prepares the corpus for future pre-beta checks without connecting to production runtime behavior.

## What It Runs

`runPreMvpInternalTestHarness()` runs these existing pure scaffolds:

1. `runControlledCorpusRegressionScaffold()`
2. `runScenarioBoundaryRegressionScaffold()`
3. `runScenarioContractRegressionScaffold()`

It then aggregates their outputs into `InternalHarnessExecutionSummary`.

## Scenario Result Model

Each scenario receives an `InternalHarnessScenarioResult`:

- `scenarioId`
- `title`
- `structurallyValid`
- `boundaryConsistent`
- `contractConsistent`
- `passed`
- `warnings`
- `notes`

The result is computed from scaffold outputs only. No runtime document cognition is performed.

## Failure Taxonomy

Harness warnings use a small internal taxonomy:

| Category | Meaning |
|---|---|
| `registry_drift` | Scenario expectation metadata drifted from a canonical registry or corpus taxonomy. |
| `boundary_gap` | Boundary implication requirements are incomplete. |
| `contract_gap` | Scenario expectation metadata violates or warns under explanation-contract scaffold checks. |
| `monetization_boundary_warning` | Defense-in-depth boundary coverage is missing for monetization-sensitive expectations. |
| `privacy_warning` | Synthetic text matched a conservative personal-data pattern. |
| `adversarial_alignment_gap` | `mustNotEmit` policy alignment is incomplete. |
| `unknown_token` | A boundary, forbidden move, constraint, review flag, or must-not-emit token is unknown. |
| `inconsistent_expectation` | Scenario fixture structure is incomplete or internally inconsistent. |

## Current Baseline

Expected baseline for the current 20-scenario corpus:

- `scenarioCount: 20`
- `passedCount: 20`
- `failedCount: 0`
- `warningCount: 0`
- `structurallyValid: true`
- `fullyConsistent: true`

If this changes, the harness surfaces scenario-level warning categories and notes so the corpus can be corrected before any beta-facing runtime work.

## Future Runtime Placeholders

The harness summary includes optional placeholders:

- `futureSimulationComparisonReady?: boolean`
- `futureExplanationComparisonReady?: boolean`

These flags are architecture preparation only. Phase 8.2E-5 does not compare against `RealitySimulationResult`, does not build explanation contracts, and does not execute runtime cognition.

## Safety Boundaries

This harness must never:

- use real user documents
- call OCR
- call LLMs
- connect to Smart Talk runtime
- execute Evidence Gates runtime semantics
- run Reality Simulation runtime behavior
- generate explanations
- modify API, UI, or payment behavior
- compute deadlines
- infer legal conclusions

## Files

| File | Purpose |
|---|---|
| `controlled-corpus/internal-test-harness-types.ts` | Harness result and failure taxonomy types. |
| `controlled-corpus/internal-test-harness.ts` | Pure aggregation function over existing corpus scaffolds. |
| `controlled-corpus/index.ts` | Public exports for the harness. |
| `PRE_MVP_INTERNAL_TEST_HARNESS.md` | Phase documentation and safety boundary. |

## Non-Goals

The harness is not a test runner, not a CI hook, not production cognition, not Smart Talk execution, and not a user-visible explanation path.
