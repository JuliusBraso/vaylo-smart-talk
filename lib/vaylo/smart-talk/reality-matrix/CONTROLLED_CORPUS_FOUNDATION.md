# Controlled Corpus Foundation (Phase 8.2E-0)

## Executive Summary

Phase 8.2E-0 creates the first controlled/adversarial corpus foundation for the Vaylo Document Reasoning Constitution V1.

This phase is **corpus + test specification only**. It creates synthetic fixtures, typed scenario metadata, governance-level expected outcomes, safety assertions, and a failure-mode taxonomy for future regression scaffolds.

It does **not** run OCR, call LLMs, connect to Smart Talk, generate explanations, calculate deadlines, or modify runtime behavior.

## Files

| File | Purpose |
|---|---|
| `controlled-corpus/corpus-types.ts` | Self-contained scenario and expected-outcome types. |
| `controlled-corpus/scenarios.ts` | Initial synthetic corpus: 14 controlled/adversarial scenarios. |
| `controlled-corpus/index.ts` | Local exports for future validators. |
| `controlled-corpus/README.md` | Operational notes for the controlled corpus folder. |
| `CONTROLLED_CORPUS_FOUNDATION.md` | This foundation document. |

## Corpus Structure

Each `ControlledCorpusScenario` includes:

- `id`
- `title`
- `documentFamily`
- `language`
- `riskDomain`
- `scenarioKind`
- `sourceMode`
- `syntheticText`
- expected governance outcomes
- `mustNotEmit` safety assertions
- optional failure-mode annotations
- notes for future validators

The corpus deliberately stores **synthetic text** only. These strings are fixtures for future deterministic regression harnesses and must not be treated as real documents or user data.

## Scenario Metadata Model

### Document Families

- `rechnung`
- `mahnung`
- `steuerbescheid`
- `krankenkasse`
- `jobcenter`
- `auslaenderbehoerde`
- `generic_bureaucracy`

### Scenario Kinds

- `benign`
- `ambiguous`
- `adversarial`
- `contradictory`
- `escalation_language`
- `deadline_ambiguity`
- `payment_confusion`
- `cross_lane_contamination`
- `ocr_noise_simulated`
- `false_reassurance_trap`
- `panic_amplification_trap`

### Risk Domains

- `payment`
- `tax`
- `enforcement`
- `benefits`
- `immigration`
- `insurance`
- `health`
- `housing`
- `unknown`

### Source Modes

- `synthetic_text`
- `synthetic_fragment`
- `synthetic_ocr_noise`

## Expected Governance Outcomes

Expected outcomes are governance-level only. They are not final copy and not user-facing language.

Scenarios may assert expected:

- document type candidate
- supported reality candidate ids
- uncertain reality ids
- blocked reality ids
- claim candidate ids
- blocked claim ids
- trap activation ids
- explanation boundary ids
- forbidden explanation moves
- review flags
- uncertainty reasons
- severity posture candidate
- must-not-emit assertions

This keeps the corpus aligned with the Reality Simulation and Simulation -> Explanation Contract layers without generating explanations.

## Must-Not-Emit Assertions

`mustNotEmit` captures safety assertions that future validators should enforce. Initial values include:

- `exact_deadline`
- `legal_verdict`
- `enforcement_certainty`
- `immigration_certainty`
- `tax_certainty`
- `guaranteed_outcome`
- `autonomous_action_instruction`
- `panic_language`
- `false_reassurance`
- `user_visible_explanation`
- `raw_personal_data`
- `calculated_amount`

These assertions are intentionally phrased as output constraints, not runtime behavior.

## Initial Scenario Coverage

The initial corpus includes 14 scenarios:

1. Benign invoice.
2. Invoice with SEPA / Lastschrift.
3. Scary-looking payment reminder without explicit enforcement.
4. Mahnung with explicit Vollstreckung language.
5. Mahnung with ambiguous "weitere Schritte".
6. Steuerbescheid with Rechtsbehelfsbelehrung.
7. Steuerbescheid where a relative deadline must not be calculated.
8. Jobcenter approval / missing-documents / payment-hold ambiguity.
9. Krankenkasse contribution notice that is not coverage loss.
10. Ausländerbehörde appointment/request ambiguity.
11. OCR-noisy simulated fragment.
12. Cross-lane contamination case: payment date + appeal wording.
13. False reassurance trap case.
14. Panic amplification trap case.

The scenarios are synthetic and contain no real personal data.

## Failure Mode Taxonomy

### `hallucinated_deadline`

A system turns a relative or ambiguous deadline phrase into an exact date, or invents a deadline not present in the authorized evidence.

### `hallucinated_enforcement`

A system claims enforcement, court, Inkasso, garnishment, or similar escalation is active without explicit support.

### `false_reassurance`

A system over-calms the user by claiming safety, no consequence, or no need to act when the document only supports uncertainty or limited context.

### `panic_amplification`

A system exaggerates risk from stern administrative wording, generic urgency, or ambiguous "further steps" language.

### `cross_lane_contamination`

A system merges payment, appeal, clarification, immigration, benefits, insurance, or enforcement lanes into a single conclusion.

### `claim_reality_merge`

A system treats a candidate claim or dry-run governance signal as a confirmed reality.

### `dry_run_leakage`

A dry-run signal becomes a production-like claim, user-visible fact, or explanation assertion.

### `severity_overreach`

Severity posture is treated as urgency, legal danger, dashboard priority, or user-facing escalation.

### `stabilizer_wording_leakage`

Internal stabilizer categories or example wording leak into final output without an explicit explanation phase.

### `monetization_boundary_leakage`

Free preview leaks paid/deep explanation fields, exact amounts, exact deadlines, legal conclusions, raw sensitive data, or risk triggers.

### `privacy_leakage`

Personal data, real document content, or raw sensitive text is exposed in fixtures, traces, previews, or outputs.

## Future Regression Strategy

### 8.2E-1 Corpus Registry + Validation Scaffold

Validate structural corpus health:

- scenario ids are unique
- required metadata fields exist
- `mustNotEmit` values are recognized
- expected boundary / forbidden-move ids are known
- synthetic-only policy is documented

No runtime harness yet.

### 8.2E-2 Scenario -> Expected Boundary Regression

Introduce deterministic checks comparing scenario fixture expectations to boundary outputs from a controlled harness.

No Smart Talk, no LLM, and no user-facing explanations.

### 8.2E-3 Scenario -> Explanation Contract Regression

Validate that expected boundaries produce the required Simulation -> Explanation Contract constraints:

- forbidden moves
- required explanation constraints
- free/paid field separation
- no deadline calculation
- no legal certainty

### 8.2E-4 Adversarial Expansion

Expand adversarial cases across:

- OCR noise
- mixed languages
- conflicting dates
- payment vs appeal lane collisions
- immigration / benefits / health insurance high-consequence domains
- false reassurance prompts
- panic amplification prompts

### 8.2E-5 Pre-MVP Internal Test Harness

Build an internal-only harness to run corpus checks before MVP integration decisions. It should remain separate from production runtime until an explicit later phase authorizes wiring.

## Non-Goals

This phase does not:

- run OCR
- call OpenAI or any LLM
- generate explanations
- modify Smart Talk prompts
- connect to Smart Talk
- modify API routes
- modify UI
- implement payment
- calculate deadlines
- produce legal advice
- alter Evidence Gates or Reality Simulation runtime behavior

## Safety Invariants

- Scenarios must remain synthetic.
- Expected outputs must remain governance-level.
- No user-visible text is generated.
- No deadline is calculated.
- No legal conclusion is asserted.
- No runtime behavior changes.
- No Smart Talk, OCR, payment, or LLM integration.
