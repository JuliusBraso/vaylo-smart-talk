# Controlled Corpus (Phase 8.2E-0 / extended 8.2E-3)

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
| `validate-scenario-boundary-expectations.ts` | Pure validator: checks internal scenario boundary/forbidden-move/constraint consistency. |
| `scenario-boundary-regression-scaffold.ts` | Regression scaffold: runs boundary validator against `CONTROLLED_CORPUS_SCENARIOS`. |
| `validate-scenario-contract-expectations.ts` | Pure validator: checks scenario expectations against Simulation → Explanation Contract safety rules. |
| `scenario-contract-regression-scaffold.ts` | Regression scaffold: runs contract validator + prior scaffolds for unified governance picture. |
| `index.ts` | Public exports for all corpus scaffolds. |

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

## PHASE 8.2E-2 — Scenario → Expected Boundary Regression

**Files:** `validate-scenario-boundary-expectations.ts`, `scenario-boundary-regression-scaffold.ts`, `index.ts`.

**No runtime behavior changed.**

### What the validator checks

`validateScenarioBoundaryExpectations()` validates the **internal consistency** of each scenario's expected governance outcome fields. It does NOT compare against actual `RealitySimulationResult` output — that is planned for a future phase once a runtime harness exists.

**Registry drift checks (hard errors → affect `valid`):**
- `expectedBoundaryIds` against `KNOWN_EXPLANATION_BOUNDARIES`
- `expectedForbiddenMoves` against `KNOWN_FORBIDDEN_EXPLANATION_MOVES`
- `expectedRequiredConstraints` against `KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS`
- `expectedReviewFlags` against the corpus-local review-flag taxonomy
- `mustNotEmit` against the corpus-local must-not-emit taxonomy

**Boundary → contract implication checks (→ affect `fullyConsistent`):**

Uses the same explicit rule table as `CONTRACT_BOUNDARY_MAPPING_RULES`:

| Boundary | Required implication |
|---|---|
| `do_not_calculate_deadline` | `no_deadline_calculation_when_forbidden` in `expectedForbiddenMoves` |
| `do_not_claim_enforcement` | `no_enforcement_claim_when_forbidden` in `expectedForbiddenMoves` |
| `require_uncertainty_wording` | `required_uncertainty_wording` in `expectedRequiredConstraints` |
| `do_not_present_dry_run_as_fact` | `no_dry_run_as_fact` in `expectedForbiddenMoves` |
| `do_not_present_speculation_as_fact` | `no_speculation_as_fact` in `expectedForbiddenMoves` |
| `do_not_merge_lanes` | `no_cross_lane_merging` in `expectedForbiddenMoves` |

**mustNotEmit → policy alignment (soft warnings → affect `fullyConsistent`):**

| mustNotEmit value | Implied governance |
|---|---|
| `exact_deadline` | `do_not_calculate_deadline` + `no_deadline_calculation_when_forbidden` |
| `enforcement_certainty` | `do_not_claim_enforcement` + `no_enforcement_claim_when_forbidden` |
| `legal_verdict` | `no_definitive_legal_verdicts` |
| `panic_language` | `no_high_panic_phrasing` |
| `tax_certainty` | `no_tax_certainty` |
| `immigration_certainty` | `no_immigration_certainty` |
| `guaranteed_outcome` | `no_guaranteed_outcomes` |
| `autonomous_action_instruction` | `no_autonomous_form_submission` |

### Validation result flags

| Flag | Meaning |
|---|---|
| `valid` | No unknown ids in any expectation field across all scenarios |
| `fullyConsistent` | `valid` + all boundary implications satisfied + all mustNotEmit policy alignments present |

### Current corpus baseline

The initial 14 scenarios are **structurally valid** (`valid = true`) — no unknown ids. They are **not yet fully consistent** because:
- Most scenarios that emit `require_uncertainty_wording` do not yet include `expectedRequiredConstraints: ["required_uncertainty_wording"]` (the field was added in 8.2E-1 as optional).
- Some scenarios have `mustNotEmit: ["panic_language"]` without `no_high_panic_phrasing` in `expectedForbiddenMoves`.

These implication gaps are the intended output of this scaffold — they identify concrete corpus improvements for future phases.

### Regression scaffold

`runScenarioBoundaryRegressionScaffold()` (version `8.2e-2-scenario-boundary-regression-v1`) runs the validator against `CONTROLLED_CORPUS_SCENARIOS` and returns `allPassed`, `implicationGapCount`, `mustNotEmitWarningCount`, and full notes. No test runner dependency. No CI wiring.

## PHASE 8.2E-2A — Controlled Corpus Expectation Alignment Pass

**Files:** `scenarios.ts` only. No validators or types changed.

**No runtime behavior changed.**

This phase applied the implication and policy rules surfaced by 8.2E-2 to make all 14 scenarios `fullyConsistent: true` in `runScenarioBoundaryRegressionScaffold`.

### Changes applied

**Boundary → contract implication gaps closed (hard rules):**

Scenarios with `require_uncertainty_wording` in `expectedBoundaryIds` — `expectedRequiredConstraints: ["required_uncertainty_wording"]` added to 12 scenarios (0002–0011, 0013, 0014). No `expectedRequiredConstraints` field was present in any scenario before this pass.

**mustNotEmit → governance alignment warnings closed (soft rules):**

| mustNotEmit value | Missing governance | Scenarios fixed |
|---|---|---|
| `panic_language` | `no_high_panic_phrasing` | 0001, 0002, 0004, 0006, 0008, 0009, 0010, 0012 |
| `legal_verdict` | `no_definitive_legal_verdicts` | 0003, 0004, 0005, 0007, 0012 |
| `guaranteed_outcome` | `no_guaranteed_outcomes` | 0003, 0007, 0010, 0014 |
| `autonomous_action_instruction` | `no_autonomous_form_submission` | 0002 |
| `immigration_certainty` | `no_immigration_certainty` | 0014 |
| `enforcement_certainty` (missing boundary) | `do_not_claim_enforcement` boundary + `no_enforcement_claim_when_forbidden` | 0011 |

**Total: 14 scenarios aligned. Corpus version bumped to `8.2e-2a-controlled-corpus-alignment-v1`.**

No scenario meaning was changed. All additions are metadata alignment with declared policy rules.

## PHASE 8.2E-3 — Scenario → Explanation Contract Regression

**Files created:** `validate-scenario-contract-expectations.ts`, `scenario-contract-regression-scaffold.ts`. `index.ts` extended.

**No runtime behavior changed.**

This phase adds contract-level regression checks that validate scenario expectations against the `Simulation → Explanation Contract` safety rules from Phase 8.2D-6.

### What is validated

The validator (`validateScenarioContractExpectations`) checks each corpus scenario's declared governance expectations across six rule categories:

| Category | Severity | Rule |
|---|---|---|
| Free preview forbidden-move coverage | **Hard** | Every free-preview-dangerous `mustNotEmit` value must have its corresponding `expectedForbiddenMove` present. |
| Free preview leakage risk | **Hard** | No high-risk `mustNotEmit` value may be completely unprotected (no forbidden move, no boundary, no review flag). |
| Monetization defense-in-depth | Soft | `exact_deadline` and `enforcement_certainty` must be protected at **both** boundary and forbidden-move layers. |
| Paid explanation overreach | Soft | High-risk domain + high/critical severity scenarios must declare an uncertainty constraint. |
| False reassurance | Soft | `false_reassurance` in `mustNotEmit` requires at least one of: `no_guaranteed_outcomes`, `required_uncertainty_wording`, or `human_review_recommended`. |
| Required constraint coverage | Soft | Scenarios of kind `ambiguous`, `deadline_ambiguity`, or `ocr_noise_simulated` must declare `required_uncertainty_wording` in `expectedRequiredConstraints`. |

### Free preview leakage protection map

| `mustNotEmit` value | Required `expectedForbiddenMove` |
|---|---|
| `exact_deadline` | `no_deadline_calculation_when_forbidden` |
| `legal_verdict` | `no_definitive_legal_verdicts` |
| `enforcement_certainty` | `no_enforcement_claim_when_forbidden` |
| `immigration_certainty` | `no_immigration_certainty` |
| `tax_certainty` | `no_tax_certainty` |
| `guaranteed_outcome` | `no_guaranteed_outcomes` |
| `autonomous_action_instruction` | `no_autonomous_form_submission` |
| `panic_language` | `no_high_panic_phrasing` |
| `calculated_amount` | `no_deadline_calculation_when_forbidden` |

### Monetization defense-in-depth pairs

| `mustNotEmit` value | Required boundary token |
|---|---|
| `exact_deadline` | `do_not_calculate_deadline` |
| `enforcement_certainty` | `do_not_claim_enforcement` |

### Result shape

```typescript
ScenarioContractExpectationValidationResult {
  valid: boolean
  fullyConsistent: boolean
  scenarioCount: number
  scenariosMissingForbiddenMoveCoverage: readonly string[]
  scenariosWithFreePreviewLeakageRisk: readonly string[]
  scenariosMissingRequiredConstraintCoverage: readonly string[]
  scenariosWithMonetizationBoundaryWarnings: readonly string[]
  scenariosWithPaidContractOverreachRisk: readonly string[]
  scenariosWithFalseReassuranceWarnings: readonly string[]
  forbiddenMoveCoverageDetails: readonly ScenarioContractForbiddenMoveMissing[]
  monetizationBoundaryDetails: readonly ScenarioContractMonetizationGap[]
  notes: readonly string[]
}
```

`valid` = no hard failures.
`fullyConsistent` = valid + no soft warnings.

### Regression scaffold

`runScenarioContractRegressionScaffold()` (version `8.2e-3-scenario-contract-regression-v1`) runs:
1. `validateScenarioContractExpectations` on `CONTROLLED_CORPUS_SCENARIOS`
2. `runControlledCorpusRegressionScaffold()` (8.2E-1)
3. `runScenarioBoundaryRegressionScaffold()` (8.2E-2)

and returns `allPassed`, `contractValid`, `contractFullyConsistent`, `contractValidationResult`, `previousValidationSummary`, and `notes`.

No test runner dependency. No CI wiring.

### Current corpus baseline after 8.2E-2A

After the 8.2E-2A alignment pass all 14 scenarios satisfy every 8.2E-3 rule:
`valid = true`, `fullyConsistent = true`.

## Future Path

- 8.2E-1 Corpus Registry + Validation Scaffold (**done**)
- 8.2E-2 Scenario → Expected Boundary Regression (**done**)
- 8.2E-2A Controlled Corpus Expectation Alignment Pass (**done**)
- 8.2E-3 Scenario → Explanation Contract Regression (**done**)
- 8.2E-4 Adversarial Expansion
- 8.2E-5 Pre-MVP Internal Test Harness
