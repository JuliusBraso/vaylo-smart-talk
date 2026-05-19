# Controlled Corpus (Phase 8.2E-0)

This folder defines the first controlled/adversarial corpus foundation for the Vaylo Document Reasoning Constitution V1.

It is **test data and type structure only**. It is not a runtime engine.

## What This Is

- Synthetic-only scenario fixtures.
- Governance-level expected outcomes.
- Safety assertions for future regression scaffolds.
- A foundation for later corpus validators and internal test harnesses.

## What This Is Not

- Not OCR.
- Not Smart Talk.
- Not an LLM prompt or LLM call.
- Not explanation generation.
- Not legal advice.
- Not deadline calculation.
- Not production behavior.
- Not user-visible wording.

## Files

| File | Purpose |
|---|---|
| `corpus-types.ts` | Self-contained types for controlled corpus scenarios and expected governance outcomes. |
| `scenarios.ts` | 14 synthetic controlled/adversarial scenarios. |
| `validate-corpus-scenarios.ts` | Pure validator: cross-checks scenario expectations against canonical registries. |
| `corpus-regression-scaffold.ts` | Regression scaffold: runs the validator against `CONTROLLED_CORPUS_SCENARIOS`. |
| `index.ts` | Local exports for future scaffolds. |

## Scenario Design

Every scenario is synthetic and includes:

- document family
- language
- risk domain
- scenario kind
- synthetic source mode
- synthetic text
- expected governance outcomes
- must-not-emit safety assertions
- failure-mode categories

Expected outcomes are intentionally governance-level:

- supported / uncertain / blocked reality candidate ids
- claim candidate ids
- trap ids
- boundary ids
- forbidden explanation moves
- review flags
- uncertainty reasons
- severity posture candidate
- must-not-emit assertions

No scenario requires final user text.

## Initial Coverage

The initial corpus includes:

- benign invoice
- invoice with SEPA / Lastschrift
- scary-looking payment reminder without explicit enforcement
- Mahnung with explicit Vollstreckung language
- Mahnung with ambiguous "weitere Schritte"
- Steuerbescheid with Rechtsbehelfsbelehrung
- Steuerbescheid relative deadline that must not be calculated
- Jobcenter approval / missing-documents / payment-hold ambiguity
- Krankenkasse contribution notice that is not coverage loss
- Ausländerbehörde appointment/request ambiguity
- OCR-noisy simulated fragment
- cross-lane payment date + appeal wording contamination case
- false reassurance trap
- panic amplification trap

## Safety Posture

The corpus must never use real personal documents, real addresses, real names, or real case data. Synthetic examples may contain generic administrative words, but they must not encode real user history.

The corpus must never connect to OCR, Smart Talk, API routes, UI, payment, OpenAI, or production runtime. Future scaffolds may validate the corpus against deterministic governance outputs, but only through explicit test harnesses introduced in later phases.

## PHASE 8.2E-1 — Corpus Registry + Canonical Validation Scaffold

**Files:** `validate-corpus-scenarios.ts`, `corpus-regression-scaffold.ts`, `corpus-types.ts` (minor extension), `index.ts`.

**No runtime behavior changed.**

### What the validator checks

`validateControlledCorpusScenarios()` accepts a list of `ControlledCorpusScenario` objects and validates them against:

**Structural checks:**
- Scenario ids are unique and non-empty.
- `syntheticText` is non-empty.
- `sourceMode` is one of the known synthetic-only values (`synthetic_text`, `synthetic_fragment`, `synthetic_ocr_noise`).

**Canonical registry drift checks:**
- `expectedBoundaryIds` values cross-checked against `KNOWN_EXPLANATION_BOUNDARIES`.
- `expectedForbiddenMoves` values cross-checked against `KNOWN_FORBIDDEN_EXPLANATION_MOVES`.
- `expectedRequiredConstraints` values cross-checked against `KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS`.

**Corpus taxonomy drift checks:**
- `mustNotEmit` values cross-checked against the `ControlledCorpusMustNotEmit` corpus union.
- `expectedReviewFlags` values cross-checked against the `ControlledCorpusExpectedReviewFlag` corpus union.

**Privacy hygiene (static, conservative):**
- `syntheticText` scanned for obvious email addresses, E.164-format phone numbers, and IBAN-like strings.
- This is not OCR and not NLP — it is a static pattern check to catch accidental personal-data leakage in fixtures.

### Validation result flags

| Flag | Meaning |
|---|---|
| `valid` | Structurally sound: unique ids, non-empty fields, synthetic source modes only |
| `fullyConsistent` | `valid` + all expected ids align with canonical registries + no privacy patterns |

### Regression scaffold

`runControlledCorpusRegressionScaffold()` runs the validator against the canonical `CONTROLLED_CORPUS_SCENARIOS` constant and returns a `CorpusRegressionScaffoldResult` with `allPassed`, per-category drift arrays, and notes. No test runner dependency. No CI wiring.

## Future Path

- 8.2E-1 Corpus Registry + Validation Scaffold (**done**)
- 8.2E-2 Scenario -> Expected Boundary Regression
- 8.2E-3 Scenario -> Explanation Contract Regression
- 8.2E-4 Adversarial Expansion
- 8.2E-5 Pre-MVP Internal Test Harness
