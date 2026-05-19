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

## Future Path

- 8.2E-1 Corpus Registry + Validation Scaffold
- 8.2E-2 Scenario -> Expected Boundary Regression
- 8.2E-3 Scenario -> Explanation Contract Regression
- 8.2E-4 Adversarial Expansion
- 8.2E-5 Pre-MVP Internal Test Harness
