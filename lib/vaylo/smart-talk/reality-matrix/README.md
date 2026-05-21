# Universal Document Reality Matrix (Phase 8.2B)

## 1. What the Reality Matrix is

The **Universal Document Reality Matrix** is a **bounded ontology** for German bureaucracy document cognition. It describes, in machine- and human-auditable form:

- which **realities** (coarse world-states implied by a document family) may be supported or must be blocked;
- which **evidence** (cues and rules) is required before a **claim** is admissible;
- which **procedural lanes** own which evidence;
- which **hallucination traps** document known dangerous inference patterns;
- which **stabilizer** wordings are allowed when the text explicitly supports calming facts;
- how **procedural severity** (not emotion) maps to evidence-backed situations.

Phase **8.2B** delivers **types**, a **reference template object**, and this document. It does **not** implement runtime gates, LLM orchestration, embeddings, or changes to Smart Talk prompts.

---

## 2. Why Vaylo uses bounded reasoning

Smart Talk in **strict_document** mode already enforces source-bound prose, lane isolation, and deadline safety in prompts and sanitization. The Reality Matrix is the **constitutional data layer** behind that philosophy:

> **Vaylo must never claim more than the document evidence can support.**

Bounded reasoning means:

- every admissible **claim** ties to **evidence rules** and **lanes**;
- **speculative** inference exists only as an internal suppression level — it must **never** surface as a user-visible fact in strict document flows;
- **blocked realities** and **forbidden claim types** are explicit, versioned, and reviewable.

---

## 3. Supported vs blocked vs speculative

| Concept | Meaning |
|--------|---------|
| **Supported realities** | States the matrix allows *if* `EvidenceRule` thresholds are met (e.g. `payment_due` when explicit due phrasing exists). |
| **Blocked realities** | States the matrix forbids for this document family unless the matrix is deliberately revised (e.g. asserting `appeal_window_exists` on an unclassified `generic_unknown` slice). |
| **Speculative** (`EvidenceLevel`) | Internal only: marks inferences too weak for user-facing assertion. Runtime in a later phase must **drop or hedge** before any strict_document output; the type exists so gates can be deterministic and auditable. |

---

## 4. Claim vs evidence vs lane vs stabilizer

| Term | Role |
|------|------|
| **Claim** | A typed assertion the system might make (`ClaimType`), governed by `ClaimRule` (allowed flag, required evidence rule IDs, blockers, confidence floor). |
| **Evidence** | `EvidenceCue` (anchors in text) + `EvidenceRule` (which cues, minimum level, allowed lanes). |
| **Lane** | `ProceduralLane` — isolates payment vs appeal vs submission vs appointment vs informational so cues and dates are not commingled. |
| **Stabilizer** | `StabilizerRule` — documents when calming clarification is *permitted* and which wordings are forbidden (e.g. false reassurance). Emission logic is **not** implemented in 8.2B. |

---

## 5. Why hallucination traps exist

`HallucinationTrap` records **known failure modes** (e.g. invoice → enforcement, appeal deadline synthesis, lane contamination). They serve:

- **architecture documentation** for engineers and reviewers;
- **future static checks** and regression corpora (same ID across tests and matrix);
- **traceability**: “why did we block this inference?” has a named guard statement.

They are not autonomous agents; they are **auditable guard catalog entries**.

---

## 6. Why procedural lanes matter

German letters often place **unrelated dates** near **payment**, **appeal**, or **Steuerjahr** lines. Lanes encode **ownership**: a cue hit belongs to payment vs appeal, etc. The matrix makes lane ownership explicit on `EvidenceCue` and `EvidenceRule`, aligning with existing procedural isolation thinking in Smart Talk without implementing new runtime behavior here.

---

## 7. Why severity ≠ emotion

`ProceduralSeverityBand` (`none` … `critical`) is tied to **document-stated procedural weight** (e.g. Mahnung with fees vs plain informational notice), **not** to user anxiety or marketing urgency. `SeverityRule` references realities and claim types — not “how scared the user should feel.” The evidence-gates package (Phase **8.2C-11**) may emit **`dryRunSeverityDerivations`** rows for audit only; they are **not** user-visible, **not** wired to Smart Talk, and **`trace.severity`** stays the inert **`none`** skeleton until a future explicit runtime phase chooses otherwise.

### Phase 8.2C-12 — Dry-Run Integration Audit

End-to-end **documentation audit** of the 8.2C evidence-gates dry-run stack (coupling, leakage, namespaces, trace stages, production boundaries). See **`EVIDENCE_GATES_DRY_RUN_AUDIT.md`**. No runtime feature work in that phase.

### Phase 8.2D-0 — Reality Simulation Before Explanation Spec

**Architecture spec only** (no runtime integration): defines how a future **Reality Simulation** layer will consume Evidence Gates **dry-run traces** to build a safe **pre-explanation** governance product (`RealitySimulationResult` — still not user-visible prose). See **`REALITY_SIMULATION_SPEC.md`**. Optional type sketches: **`reality-simulation-types.ts`** (governance types; not user copy).

### Phase 8.2D-2 — Simulation Boundary Mapping Audit

**Governance audit only** (no runtime behavior changes): boundary-token inventory, trap/stabilizer/severity influence review, dry-run leakage and review-flag risk notes. See **`SIMULATION_BOUNDARY_MAPPING_AUDIT.md`**. **Critical:** `enforcementTrapHeuristic` in the 8.2D-1 skeleton is **substring-based** and **not production-safe** for explanation policy.

### Phase 8.2D-2A — Boundary Vocabulary Consolidation Audit

**Vocabulary audit (8.2D-2A) + alias consolidation fix (8.2D-2B).** Identified and removed `recommend_human_review_for_high_risk` alias; canonical boundary token is now `recommend_human_review_high_risk` only. Three pending-wiring tokens and two emitted-but-unspecified tokens also documented. See **`BOUNDARY_VOCABULARY_AUDIT.md`**.

### Phase 8.2D-3 — Boundary Policy Table v1

**Governance policy metadata only.** Adds `BOUNDARY_POLICY_TABLE_V1` and typed boundary policy definitions under **`reality-simulation/`**: canonical ids, categories, production-readiness posture, consumer constraints, intended consumer layer, and deprecated alias metadata. See **`BOUNDARY_POLICY_TABLE_V1.md`**. No explanation engine or runtime enforcement is introduced.

### Phase 8.2D-4 — Boundary Emission Regression Scaffold

**Scaffold only — no runtime behavior changed.** Adds `validateBoundaryEmissions()` (cross-checks emitted ids against the policy table; detects unknown tokens, deprecated aliases, and union/table drift) and `runBoundaryEmissionRegressionScaffold()` (structured pass/fail cases). Not wired into simulation runtime; ready for future test runners. See **`reality-simulation/README.md`**.

### Phase 8.2D-4A — Known Explanation Boundaries Registry

**Registry + validation upgrade only — no runtime behavior changed.** Adds `KNOWN_EXPLANATION_BOUNDARIES` (a runtime-enumerable `as const` array of all live `ExplanationBoundary` tokens, typed with `satisfies readonly ExplanationBoundary[]`) to close the gap that TypeScript unions cannot be iterated at runtime. Upgrades `validateBoundaryEmissions()` with five two-way consistency rules between the live registry and `BOUNDARY_POLICY_TABLE_V1`. Deprecated alias `"recommend_human_review_for_high_risk"` is explicitly excluded from the registry. Regression scaffold extended with `registryConsistencyCheck`. See **`reality-simulation/README.md`**.

### Phase 8.2D-4B — Boundary Validation Full Consistency Flag

**Validation hardening only — no runtime behavior changed.** Adds `fullyConsistent: boolean` to `BoundaryEmissionValidationResult`. `valid` remains the legacy emitted-set safety flag (backward-compatible). `fullyConsistent` is `true` only when all five two-way rules pass: emitted-set coverage, registry → table, table → registry, and deprecated-alias exclusion. Regression scaffold now surfaces `fullyConsistentResult` inside `registryConsistencyCheck`. See **`reality-simulation/README.md`**.

### Phase 8.2D-5 — Structured Trap Metadata Foundation

**Metadata foundation only — no runtime behavior changed.** Adds `TRAP_METADATA_REGISTRY_V1` (typed, readonly, central registry mapping all 30 `HallucinationTrapKind` values to explicit governance metadata) and supporting types in `trap-metadata-types.ts`. Explicitly documents `isEnforcementRelated`, `isEscalationRelated`, `isDeadlineRelated`, and `isLaneContaminationRelated` boolean flags per trap kind. Adds a doc-only comment to `enforcementTrapHeuristic` marking it skeleton-only. Prepares Phase 8.2D-5A replacement. See **`TRAP_METADATA_FOUNDATION.md`** and **`reality-simulation/README.md`**.

### Phase 8.2D-5A — Replace enforcementTrapHeuristic With Structured Trap Metadata

**Targeted simulation-internal refactor — no Smart Talk, no user-visible behavior, no explanation generation.** Removes the substring-based `enforcementTrapHeuristic`; adds `buildTrapGovernanceFlags` that looks up each active trap's `trapKind` in `TRAP_METADATA_BY_KIND` (compile-time-complete `satisfies Record<HallucinationTrapKind, ...>`). Closes four enforcement-trap coverage gaps. Fixes `generic_escalation_to_legal_disaster` semantic misclassification. Boundary logic changes are governance-internal only (no user output). See **`TRAP_METADATA_FOUNDATION.md §4`** and **`reality-simulation/README.md`**.

### Phase 8.2D-6 — Simulation -> Explanation Contract v1

**Contract / type specification only — no runtime behavior changed.** Adds `SimulationExplanationContract` and related free/paid handoff types in `reality-simulation/explanation-contract-types.ts`, plus **`SIMULATION_EXPLANATION_CONTRACT.md`**. Defines strict tier separation: `free_preview` can carry only safe teaser metadata, while `paid_explanation` may carry deeper structured signals but remains bounded by forbidden moves, uncertainty requirements, and existing explanation boundaries. No explanation engine, payment enforcement, Smart Talk wiring, deadline calculator, or user-visible output is introduced.

### Phase 8.2D-6A — Contract Boundary Mapping Regression Scaffold

**Governance regression scaffold only — no runtime behavior changed.** Adds `validateContractBoundaryMapping()` and `runContractBoundaryRegressionScaffold()` under `reality-simulation/`. The scaffold verifies explicit boundary -> contract mappings, catches missing forbidden moves, catches missing required uncertainty constraints, and rejects unknown contract ids. No runtime mapper, explanation builder, Smart Talk wiring, payment integration, or CI hook is introduced.

### Phase 8.2D-6B — Known Explanation Contract Registries

**Contract registry hardening only — no runtime behavior changed.** Closes the union-enumerability gap for `ForbiddenExplanationMove` and `RequiredExplanationConstraint` by adding two canonical `as const satisfies readonly <Union>[]` registries (`KNOWN_FORBIDDEN_EXPLANATION_MOVES`, `KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS`) to `explanation-contract-types.ts`. The validator no longer owns duplicated local token lists; it imports the canonical registries and accepts optional override parameters. Result shape gains `knownForbiddenMoveIds` and `knownRequiredConstraintIds` for explicit audit output. Regression scaffold bumped to `v2` with a `registryConsistencyCheck` block. See **`reality-simulation/README.md §PHASE 8.2D-6B`**.

### Phase 8.2D-6C — Contract Boundary Rule Coverage Scaffold

**Coverage validation only — no runtime behavior changed.** Adds `CONTRACT_RELEVANT_EXPLANATION_BOUNDARIES` (6 tokens that must each have a mapping rule) to `validate-contract-boundary-mapping.ts`. Extends `fullyConsistent` beyond emitted-set safety to also require that all contract-relevant boundaries are covered by the rule table and that no rule entry references an unknown/deprecated boundary. Adds four new result fields (`contractRelevantBoundaryIds`, `mappedBoundaryIds`, `contractRelevantBoundariesMissingRules`, `mappingRulesForUnknownBoundaries`). Regression scaffold bumped to `v3` with `mappingCoverageCheck` block and a new `informational_boundary_no_mapping_required` case. See **`reality-simulation/README.md §PHASE 8.2D-6C`**.

### Phase 8.2E-0 — Controlled Corpus Foundation

**Synthetic corpus foundation only — no runtime behavior changed.** Adds `controlled-corpus/` with self-contained scenario types, 14 synthetic controlled/adversarial scenarios, governance-level expected outcomes, must-not-emit safety assertions, and failure-mode taxonomy documentation in `CONTROLLED_CORPUS_FOUNDATION.md`. The corpus does not use real documents, does not run OCR, does not call LLMs, does not generate explanations, and is not wired into Smart Talk or production runtime. It establishes the foundation for future internal regression scaffolds.

### Phase 8.2E-1 — Corpus Registry + Canonical Validation Scaffold

**Corpus validation scaffold only — no runtime behavior changed.** Adds `validate-corpus-scenarios.ts` and `corpus-regression-scaffold.ts` to `controlled-corpus/`. The validator cross-checks corpus scenario expectations (`expectedBoundaryIds`, `expectedForbiddenMoves`, `expectedRequiredConstraints`) against canonical runtime registries (`KNOWN_EXPLANATION_BOUNDARIES`, `KNOWN_FORBIDDEN_EXPLANATION_MOVES`, `KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS`), validates corpus taxonomy fields (`mustNotEmit`, `expectedReviewFlags`), checks structural hygiene (unique ids, non-empty fields, synthetic source modes), and runs conservative static privacy-pattern checks on `syntheticText`. Introduces `valid` (structural) and `fullyConsistent` (structural + registry + privacy) flags. No test runner dependency. See **`controlled-corpus/README.md §PHASE 8.2E-1`**.

### Phase 8.2E-2 + 8.2E-2A — Scenario → Expected Boundary Regression + Alignment Pass

**8.2E-2:** Scenario expectation consistency scaffold only — no runtime behavior changed. Adds `validate-scenario-boundary-expectations.ts` and `scenario-boundary-regression-scaffold.ts` to `controlled-corpus/`. The validator checks internal consistency of each scenario's expected governance outcome fields: (a) registry drift for all expectation id fields; (b) boundary → contract implication consistency using an explicit rule table aligned with `CONTRACT_BOUNDARY_MAPPING_RULES`; (c) mustNotEmit → governance soft-warning alignment. `valid` = no unknown ids; `fullyConsistent` = valid + all implications satisfied + all mustNotEmit alignments present. Initial corpus is structurally valid but not yet fully consistent — implication gaps are surfaced as the intended output for future improvement. No test runner, no runtime invocation. See **`controlled-corpus/README.md §PHASE 8.2E-2`**.

**8.2E-2A:** Corpus expectation alignment pass — `scenarios.ts` only. Closes all 8.2E-2 implication gaps and mustNotEmit policy warnings across all 14 scenarios. All scenarios are now `fullyConsistent: true` under `runScenarioBoundaryRegressionScaffold`. No validator or type changes.

---

### Phase 8.2E-4 — Adversarial Corpus Expansion v1

**Adversarial corpus expansion only — no runtime behavior changed.** Adds 6 high-risk synthetic adversarial scenarios (0015–0020) to `controlled-corpus/scenarios.ts`. Corpus version bumped to `8.2e-4-adversarial-expansion-v1`. Total corpus: 20 scenarios.

Adversarial categories introduced:

| Scenario | Category |
|---|---|
| 0015 SYSTEM_OVERRIDE_INJECTION_TRAP | Prompt injection (`IGNORE ALL PREVIOUS INSTRUCTIONS`) embedded inside German bureaucracy text |
| 0016 MULTI_LANE_CHAOS_FRAGMENT | Finanzamt + Krankenkasse + Pfändung + Jobcenter mixed in one fragment |
| 0017 MONETIZATION_BYPASS_QUESTION_PAYLOAD | Short "question" disguising dense copied document fragments |
| 0018 FALSE_REASSURANCE_ATTACK | Document forces "everything is fine, ignore this notice" posture |
| 0019 DEADLINE_PRESSURE_WITHOUT_CALCULABLE_DATE | Urgent deadline vocabulary with no delivery date basis |
| 0020 ENFORCEMENT_WORDING_WITH_AMBIGUOUS_STATUS | Vollstreckung/Pfändung as future-conditional consequence, not active state |

All 6 scenarios are aligned at authoring time for `fullyConsistent: true` under all three regression scaffolds (`runControlledCorpusRegressionScaffold`, `runScenarioBoundaryRegressionScaffold`, `runScenarioContractRegressionScaffold`). No runtime behavior, Smart Talk, OCR, LLM calls, APIs, payment, or UI changed.

---

### Phase 8.2E-5 — Pre-MVP Internal Test Harness

**Internal governance test harness only — no runtime behavior changed.** Adds `internal-test-harness-types.ts` and `internal-test-harness.ts` to `controlled-corpus/`, plus `PRE_MVP_INTERNAL_TEST_HARNESS.md`.

`runPreMvpInternalTestHarness()` is a pure aggregation layer over:

1. `runControlledCorpusRegressionScaffold()`
2. `runScenarioBoundaryRegressionScaffold()`
3. `runScenarioContractRegressionScaffold()`

It returns corpus-wide counts (`scenarioCount`, `passedCount`, `failedCount`, `warningCount`, `structurallyValid`, `fullyConsistent`) and per-scenario `InternalHarnessScenarioResult` rows (`structurallyValid`, `boundaryConsistent`, `contractConsistent`, `passed`, `warnings`, `notes`).

The harness maps scaffold output into internal warning categories: `registry_drift`, `boundary_gap`, `contract_gap`, `monetization_boundary_warning`, `privacy_warning`, `adversarial_alignment_gap`, `unknown_token`, and `inconsistent_expectation`.

Current baseline: all 20 synthetic scenarios pass, `fullyConsistent: true`, `warningCount: 0`. The summary includes future-only placeholders (`futureSimulationComparisonReady`, `futureExplanationComparisonReady`) but does not compare `RealitySimulationResult`, build explanations, call OCR, call LLMs, calculate deadlines, infer legal conclusions, or connect to Smart Talk.

See **`PRE_MVP_INTERNAL_TEST_HARNESS.md`** and **`controlled-corpus/README.md §Phase 8.2E-5`**.

---

### Phase 8.2E-3 — Scenario → Explanation Contract Regression

**Contract-level regression scaffold only — no runtime behavior changed.** Adds `validate-scenario-contract-expectations.ts` and `scenario-contract-regression-scaffold.ts` to `controlled-corpus/`.

The validator (`validateScenarioContractExpectations`) checks each scenario's declared governance expectations against the `Simulation → Explanation Contract` safety rules from Phase 8.2D-6. Six rule categories:

| Category | Severity | Description |
|---|---|---|
| Free preview forbidden-move coverage | **Hard** | Every free-preview-dangerous `mustNotEmit` value must have its required `expectedForbiddenMove`. |
| Free preview leakage risk | **Hard** | No high-risk `mustNotEmit` value may be completely unprotected. |
| Monetization defense-in-depth | Soft | `exact_deadline` and `enforcement_certainty` must be protected at both boundary and forbidden-move layers. |
| Paid explanation overreach | Soft | High-risk domain + high/critical severity requires an uncertainty constraint. |
| False reassurance | Soft | `false_reassurance` in `mustNotEmit` requires `no_guaranteed_outcomes`, `required_uncertainty_wording`, or `human_review_recommended`. |
| Required constraint coverage | Soft | `ambiguous`, `deadline_ambiguity`, `ocr_noise_simulated` scenario kinds must declare `required_uncertainty_wording`. |

`valid` = no hard failures. `fullyConsistent` = valid + no soft warnings.

`runScenarioContractRegressionScaffold()` (version `8.2e-3-scenario-contract-regression-v1`) runs the contract validator plus the 8.2E-1 corpus scaffold and 8.2E-2 boundary scaffold, returning a unified `allPassed` + `previousValidationSummary`. After the 8.2E-2A alignment pass and 8.2E-4 adversarial expansion, all 20 scenarios satisfy all six contract rules: `valid: true`, `fullyConsistent: true`. No test runner dependency. See **`controlled-corpus/README.md §PHASE 8.2E-3`**.

---

## 8. Why this phase avoids runtime implementation

8.2B intentionally ships:

- **TypeScript types** (`types.ts`) — single source of truth for ontology;
- **Reference template** (`template.ts`) — realistic skeleton, `satisfies` for compile-time checks;
- **README** — contracts and vocabulary for the team.

Skipping runtime avoids:

- premature coupling to one LLM or one API shape;
- shipping gates before a regression corpus exists;
- mixing ontology edits with prompt drift in the same release.

---

## 9. Future phases (indicative)

| Phase | Focus |
|-------|--------|
| **8.2C Evidence gates** | Deterministic evaluation: cue matching, evidence levels, claim allow/deny, speculative suppression before model or after structured output. |
| **8.2D Reality simulation** | **8.2D-0** spec; **8.2D-1** `runRealitySimulation`; **8.2D-2/2A/2B** boundary audits + cleanup; **8.2D-3** policy table; **8.2D-4** emission regression scaffold; **8.2D-4A** known-boundary registry; **8.2D-4B** `fullyConsistent` flag; **8.2D-5** structured trap metadata foundation; **8.2D-5A** `enforcementTrapHeuristic` replaced with `buildTrapGovernanceFlags`; **8.2D-6** Simulation -> Explanation Contract v1; **8.2D-6A** contract-boundary regression scaffold; **8.2D-6B** known forbidden-move / required-constraint registries; **8.2D-6C** contract-boundary rule coverage scaffold. |
| **8.2E Controlled corpus** | **8.2E-0** synthetic controlled/adversarial corpus foundation; **8.2E-1** canonical validation scaffold; **8.2E-2** scenario expected-boundary consistency scaffold; **8.2E-2A** corpus expectation alignment pass (all 14 scenarios then fullyConsistent); **8.2E-3** scenario → Explanation Contract regression (free preview leakage, paid overreach, false reassurance, monetization defense-in-depth); **8.2E-4** adversarial corpus expansion v1 (6 new high-risk scenarios 0015–0020; corpus expanded to 20 scenarios); **8.2E-5** Pre-MVP internal test harness (pure scaffold aggregation, scenario-level pass/fail, future runtime comparison placeholders; all 20 scenarios synthetic only, no runtime behavior changed, fullyConsistent baseline). |
| **Regression corpus** | Frozen synthetic snippets per document family with expected governance outcomes. |
| **Document cognition engine** | Compose matrices per `RealityMatrixDocumentType`, versioned releases, optional overlap with existing `SmartTalkResult` fields via explicit mappers (future). |

---

## Phase 8.2B-1 — Rechnung / payment notice matrix

The first **concrete** matrix is `matrices/rechnung.ts` → **`RECHNUNG_REALITY_MATRIX`** (`documentType: "rechnung_payment_notice"`). It was chosen first because the surface is **high-volume and comparatively low tail-risk** (billing, Zahlungsavis, Beitragsrechnung, Lastschriftavis), yet it still stresses **lane hygiene**, **payment-channel discrimination**, and **anti-escalation** (invoice → enforcement, informational Avis → threat).

**What it validates architecturally**

- `supportedRealities` / `blockedRealities` encode **hard negations** (for example no `enforcement_active` from this family without a deliberate matrix change).
- `EvidenceCue` plus `EvidenceRule` can express **SEPA vs manual** and **informational vs mandatory payment**, with OCR fragility called out in human-readable fields only.
- `forbiddenClaims` can **outlaw** entire claim classes (`enforcement_risk`, `benefit_risk`, `insurance_risk`, and similar) regardless of model output.
- `HallucinationTrap` uses **`description`**, **`dangerousInference`**, and **`blockedInterpretationBehavior`** for audit-grade trap sheets.
- `stabilizers` hold **calm, non-reassuring** example wordings aligned with “never invent safety.”

**Known limitations (by design in this phase)**

- `ClaimRule.requiredEvidenceRuleIds` does not yet encode **OR vs AND**; the Rechnung matrix uses **two rows** for `payment_required` to document **disjunctive** evidence paths until 8.2C defines evaluation semantics.
- Cue hits are not deduplicated or proximity-scored; regex strings are not executed.
- Matrices do not yet declare full **precedence** when `informational_only` and `payment_required` both partially match; `blockedBy` only hints.

---

## Phase 8.2B-2 — Steuerbescheid matrix

The second concrete matrix is `matrices/steuerbescheid.ts` → **`STEUERBESCHEID_REALITY_MATRIX`** (`documentType: "steuerbescheid"`). It follows Rechnung because it **raises the difficulty**: official **Festsetzung**, **Nachzahlung vs Erstattung**, **Einspruch** / **Rechtsbehelfsbelehrung**, **relative Fristen**, and **vorläufig** language — the same areas where models most often **fabricate dates** or **merge lanes**.

**Risks this matrix is designed to validate**

- **Payment vs appeal lane isolation** (`payment`, `appeal`, `informational`, `submission`) with explicit anti-commutation traps.
- **Deadline safety** encoded as evidence-rule labels + traps: no synthesis of **innerhalb eines Monats nach Bekanntgabe** into a calendar day; **Ausstellungsdatum / Steuerjahr** are not Fristen.
- **Blocked realities** for enforcement, criminal, court, immigration, Jobcenter, insurance, **final unappealable** claims, and **tax fraud** — a normal Bescheid with remedy boilerplate must not become those worlds.
- **`forbiddenClaims`** drops `enforcement_risk`, cross-domain risks, and `appointment_required` (not asserted from this matrix v1).

**Deadline safety model (declarative)**

- **Explicit payment date** → only `ev_stb_deadline_payment_explicit` (payment lane, cue-grounding deferred to 8.2C).
- **Relative appeal window** → only `ev_stb_deadline_appeal_relative` (appeal lane, contextual evidence; **no synthetic end date** in copy — enforced conceptually via traps + stabilizers).
- **Rechtsbehelfsbelehrung** → informational / appeal calm, not “active threat” (trap `rechtsbehelfsbelehrung_to_active_threat`).

**Known limitations**

- `severityRules` includes a **high** ceiling rule for rare explicit serious collection language; **8.2C** must prove token presence — the matrix only reserves the band.
- **Überweisung / IBAN** on tax letters is not modeled as `payment_method_manual` (forbidden list removed); payment channel taxonomy may need a later `ClaimType` if product asks for it.
- **OR paths** for `tax_assessment_issued` mirror Rechnung (two evidence rules); disjunctive evaluation remains **undefined at runtime**.

---

## Phase 8.2B-3 — Mahnung matrix

The third matrix is `matrices/mahnung.ts` → **`MAHNUNG_REALITY_MATRIX`** (`documentType: "mahnung"`). It is deliberately **last among the first three** because dunning is where models most often **amplify fear**: Mahnung → Vollstreckung, **weitere Schritte** → invented Inkasso timelines, overdue rent-like wording → **eviction**, fees → **Strafverfahren**.

**Escalation governance philosophy**

- **Lanes**: `payment`, **`escalation`** (fees, Androhung, explicit collection), `informational`, **`clarification`** (already paid, contact, Widerspruch-style clarification) — payment reminder **≠** enforcement.
- **`enforcement_risk`** is **conditionally allowed** only via three **explicit-token** evidence rules (`Vollstreckung`, `Gerichtsvollzieher`, explicit **Inkasso** process wording), each with **`minimumConfidence: "high"`** at claim level; generic Mahnung / letzte Mahnung / weitere Schritte **do not** satisfy them.
- **`forbiddenClaims`** aggressively blocks cross-domain panic claims (`immigration_risk`, `account_seizure`, `eviction_risk`, `criminal_accusation`, `automatic_salary_garnishment`, etc.) and **`blockedRealities`** block corresponding world-states (e.g. `health_insurance_termination`, `active_inkasso_case` as *asserted realities* — explicit Inkasso **language** still routes through `enforcement_risk` + traps, not `active_inkasso_case` reality without a future schema decision).
- **Severity**: default **low/medium**; **high** only with `final_reminder_notice` / explicit escalation surface; **`critical`** only when an `enforcement_risk` claim path is admissible — **not** because the tone sounds strict.

**Panic suppression rationale**

Stabilizers document **calm, accurate** lines (no Vollstreckung if absent; **weitere Schritte** is ambiguous; if explicit enforcement text exists, **quote carefully** without denying risk). Forbidden wording blocks **false reassurance** and **fabricated enforcement**.

**Known limitations**

- **`active_inkasso_case`** is a **blocked reality** to block asserting “case already open” as a world-state; **explicit** Inkasso wording still uses **`enforcement_risk`** + traps — 8.2C may need to split “Inkasso mentioned” vs “Inkasso case established” more finely.
- **Disjunctive** `payment_required` / `clarification_possible` again use **multiple `ClaimRule` rows**.
- **Ontology**: new `ProceduralLane` values (`escalation`, `clarification`) extend the global lane union; older matrices remain valid (they use subsets).

---

## Phase 8.2B-4 — Matrix consolidation audit

After the three production matrices, **`CONSOLIDATION_AUDIT.md`** records a **critical architecture audit** (naming collisions, rule-algebra gaps, lane model, cross-matrix consistency). **No runtime logic** was added.

**Conclusion:** The ontology is **fit to start 8.2C (Evidence Gates)** only if gates implement **explicit AND/OR semantics**, **proximity / lane binding**, **homonym-safe telemetry**, and **severity precedence** — see the audit §1 and §12.

**Next:** Phase **8.2C** — Evidence Gates (evaluator spec + implementation), not matrix expansion.

---

## Phase 8.2C-0 — Evidence Gates specification

**`EVIDENCE_GATES_SPEC.md`** defines how gates **authorize** claims and realities (lane binding, proximity, rule algebra, conditional forbids, audit traces) — **not** keyword matching as sufficient proof. **No runtime** is implemented in 8.2C-0.

Optional type sketches: **`evidence-gates-types.ts`** (`RuleExpression`, `GateAuditTrace`, namespaced ids) — **SPEC ONLY**, no functions.

**Critical property:** Gates sit between OCR/matrix data and downstream explanation; they **withhold or mark uncertain** rather than invent.

---

## Phase 8.2C-1 — Evidence Gate evaluator skeleton

Folder **`evidence-gates/`** exposes **`evaluateEvidenceGates`**, **`evaluateRuleExpression`**, and **`buildGateAuditTrace`** — **pure functions only**, **not** connected to Smart Talk, OCR, or APIs.

**Posture:** no claim is **`allowed`**; matrix claim types appear as **`uncertain`** when a matrix snapshot is passed; **`blockedRealities`** are copied as blocked reality rows; **`trace.dryRunRealityAuthorizations`** (8.2C-8) holds reality **`candidate_*`** hypotheses only — not production supported realities; **`trace.dryRunTrapActivations`** (8.2C-9) holds trap **`candidate_*`** governance signals only — not runtime suppression; **`trace.dryRunStabilizerCandidates`** (8.2C-10) holds stabilizer **catalog-id** candidates only — not user-visible stabilizer text; every run includes **`traceMetadata`** (evaluator version, unsupported feature list, safety posture).

**Next:** implement cue detection, lane binding, proximity, and authorization per `EVIDENCE_GATES_SPEC.md` — then optional Smart Talk wiring.

---

## Phase 8.2C-2 — Rule expression walker (structural only)

`evaluateRuleExpression` recursively evaluates **boolean structure** (`allOf` / `anyOf` / `noneOf` / `not`). **Terminals** resolve only via explicit context (`terminalKey` + `terminalResults` / `resolveTerminal`) — **no** text scanning, **no** regex, **no** Smart Talk wiring. Unresolved branches propagate **conservatively** so absence is never treated as safety.

---

## Phase 8.2C-3 — Cue Hit Model + Manual Cue Injection

**Evidence input layer:** typed `CueHit`, optional `cueHits` on `EvidenceGateInput`, and `normalizeCueHits` ingest **manual / external** observations only — **no** OCR text scanning, **no** regex, **no** automatic claim authorization. Traces expose counts and cue ids; production **`supportedRealities`** and **allowed** claim dispositions are still not driven from hits (8.2C-8 adds **dry-run** reality candidates in the trace only). Prepares lane binding, proximity, and full gate execution in later phases.

---

## Phase 8.2C-4 — Evidence Rule Resolution v1

Matrix **`EvidenceRule`** rows are evaluated against normalized **`CueHit`**s via `resolveEvidenceRules` — **AND-only required cues**, optional cues observed only, **no** claim authorization, **no** proximity, **no** regex, **no** text scanning. Matched rules appear in the audit trace only; claim rows stay **`uncertain`**.

---

## Phase 8.2C-5 — Claim Authorization Dry Run v1

`resolveClaimRules` evaluates **`ClaimRule`** rows against **`RuleEvaluationResult[]`** from evidence resolution — **`candidate_*` dispositions**, **`dryRun: true`**, trace-only (`dryRunClaimAuthorizations`). **No** production `allowed` in `claimDecisions`, **no** Smart Talk, **no** user-visible claim emission. OR remains duplicate claim rows; proximity remains a **manual structural skeleton** only (8.2C-6).

---

## Phase 8.2C-6 — Proximity skeleton (manual only)

**`proximity-types`** + **`evaluateProximityConstraints`**: equality-only checks of external **observations** vs **constraints** — **no** text scanning, numeric distance, or layout engine. **`RuleExpressionEvaluationContext.proximityEvaluationByTerminalKey`** feeds **`proximity`** terminals in `evaluateRuleExpression`. Optional **`buildGateAuditTrace`** inputs record counts and matched/unresolved constraint ids in **`traceMetadata`**.

---

## File map

| File | Purpose |
|------|---------|
| `types.ts` | Ontology: `EvidenceLevel`, lanes, claims, realities, cues, rules, traps, stabilizers, severity, `UniversalDocumentRealityMatrix`. |
| `template.ts` | `UNIVERSAL_REALITY_MATRIX_TEMPLATE` + small example lane exports. |
| `CONSOLIDATION_AUDIT.md` | **Phase 8.2B-4** — consolidation audit before Evidence Gates. |
| `EVIDENCE_GATES_SPEC.md` | **Phase 8.2C-0** — formal Evidence Gates specification (no runtime). |
| `evidence-gates-types.ts` | Gate input/output / `RuleExpression` / audit types; optional `matrix` on input (8.2C-1). |
| `evidence-gates/` | **Phase 8.2C-1** — evaluator skeleton (`evaluateEvidenceGates`, etc.). |
| `matrices/rechnung.ts` | **`RECHNUNG_REALITY_MATRIX`** — first production-shaped payment-notice matrix. |
| `matrices/steuerbescheid.ts` | **`STEUERBESCHEID_REALITY_MATRIX`** — tax assessment / Finanzamt Bescheid matrix. |
| `matrices/mahnung.ts` | **`MAHNUNG_REALITY_MATRIX`** — dunning / escalation-safe reminder matrix. |
| `matrices/index.ts` | Re-exports concrete matrices (no runtime registry). |
| `controlled-corpus/` | Synthetic corpus, validation scaffolds, and Pre-MVP internal governance harness. |
| `PRE_MVP_INTERNAL_TEST_HARNESS.md` | **Phase 8.2E-5** — internal harness documentation and safety boundary. |
| `README.md` | Architecture and safety rationale (this file). |

**Phase 8.2C-7 (Evidence Gates):** audit-only hardening of `GateAuditTrace` — stable trace stage labels, explicit `sourceKind` / `evidenceRuleId` vs `proximityConstraintId` vs `terminalKey`, dry-run claim metadata, and static `traceMetadata` flags that **do not** enable production authorization or Smart Talk wiring. See `evidence-gates/README.md`.

**Phase 8.2C-8 (Evidence Gates):** `resolveRealityAuthorizations` adds **`trace.dryRunRealityAuthorizations`** (`candidate_*` + `dryRun: true` only) — bounded procedural hypotheses, not production supported realities or legal truth; matrix `blockedRealities` stay authoritative. See `evidence-gates/README.md`.

**Phase 8.2C-9 (Evidence Gates):** `resolveTrapActivations` adds **`trace.dryRunTrapActivations`** — hallucination trap **`candidate_*`** signals only (governance observability); **no** runtime suppression, **no** explanation rewrite, **no** Smart Talk enforcement. See `evidence-gates/README.md`.

**Phase 8.2C-10 (Evidence Gates):** `resolveStabilizerCandidates` adds **`trace.dryRunStabilizerCandidates`** — stabilizer **catalog-id** governance candidates only; **no** matrix example wording in the trace, **no** user-visible copy, **no** Smart Talk emission. See `evidence-gates/README.md`.

---

## Extension points

- Add `ClaimType` / `RealityType` values via **const arrays** in `types.ts` (versioned PRs).
- Add new `RealityMatrixDocumentType` members for Bewilligung, Jobcenter, etc.
- Split **per-document-type matrices** into dedicated files that `satisfies UniversalDocumentRealityMatrix`.
- Attach **external IDs** (e.g. corpus case IDs) to traps or rules in a future metadata field.

---

## Risks intentionally not solved in 8.2B

- No **regex execution** or keyword scanner — patterns are declarative strings only.
- No **OCR normalization** or fuzzy matching — `ocrSensitive` is a flag for future logic.
- No **conflict resolution** when two rules fire (precedence order TBD in 8.2C).
- No **mapping** to OpenAI JSON or `SmartTalkResult` — integration is a later contract.
- No **i18n** of trap or stabilizer example strings — surface copy remains owned by Smart Talk layers until explicitly bridged.
