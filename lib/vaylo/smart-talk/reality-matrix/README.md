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

### Phase 8.2F-0 — MVP Safety Readiness Audit

**Governance readiness audit only — no runtime behavior changed.** Adds **`MVP_SAFETY_READINESS_AUDIT.md`** as the first complete MVP safety classification for the Vaylo Document Reasoning Constitution V1 stack.

The audit classifies readiness across the Constitution layer, Reality Matrix, Evidence Gates, boundary governance, structured trap metadata, Simulation -> Explanation Contract, controlled/adversarial corpus, internal harness, Smart Talk runtime, OCR, monetization boundary, DNA integration readiness, and B2B readiness.

Verdicts:

- **Internal trusted-user MVP:** `READY FOR CONTROLLED USE`
- **Public MVP cognition:** `NOT READY`
- **Production cognition:** `NOT READY`

The audit explicitly separates what is safe for synthetic governance testing, controlled internal pilots, narrow real-world pilots, public MVP launch, and production-grade cognition. It also documents prohibited MVP claims: no legal advisor positioning, no deadline authority, no immigration/tax/enforcement certainty, and no autonomous bureaucracy-agent claims.

Critical public-MVP blockers identified: missing runtime explanation mapper, unproven simulation/explanation coupling, OCR uncertainty realism, fragment authenticity handling, no real execution harness, and no real-world privacy-safe corpus.

See **`MVP_SAFETY_READINESS_AUDIT.md`**.

---

### Phase 8.2F-7 — Trusted User Pilot Gate

**Pre-pilot governance readiness only — no public release, no runtime activation, no Smart Talk/OCR/LLM wiring.** Adds `TRUSTED_USER_PILOT_GATE.md`, `trusted-user-pilot-gate-types.ts`, and `trusted-user-pilot-readiness-scaffold.ts`.

The gate classifies readiness into `READY` (internal governance dry-run testing, synthetic corpus regression, structural cognition testing), `LIMITED READY` (narrow trusted-user pilot, supervised manual review, non-authoritative framing only), and `NOT READY` (public launch, autonomous execution, DNA integration, production OCR cognition, B2B deployment, legal authority positioning). It defines mandatory pilot constraints, allowed/disallowed scope, stop conditions, escalation rules, trust-signal requirements, and the future pilot roadmap from 8.2F-8 through 8.2F-13.

`evaluateTrustedUserPilotReadiness()` is a pure static scaffold returning `TrustedUserPilotReadiness` with blocking issues, warnings, operational constraints, allowed scope, stop conditions, escalation rules, and internal notes. It performs no live checks and does not launch or wire any pilot path.

See **`TRUSTED_USER_PILOT_GATE.md`**.

---

### Phase 8.2F-6A — Bridge Contract Tier Mismatch Diagnostic

**Surgical diagnostic hardening — no routing behavior changed, no prose, no Smart Talk wiring.** Adds `bridge_contract_tier_mismatch` to `BridgeDiagnosticCode`. In `runSmartTalkBridgeDryRun`, a post-routing check compares `input.accessTier` with `explanationContract.accessTier`; if they differ, a `neverUserVisible` diagnostic is emitted. Routing, `structurallyValid`, and `governancePreserved` are not affected. Adds Case 8 (`contract_tier_mismatch_detection`) to the bridge regression scaffold. Fixes the modeling gap noted in Phase 8.2F-6.

See **`reality-simulation/README.md §PHASE 8.2F-6A`**.

---

### Phase 8.2F-6 — Smart Talk Bridge Dry Run

**First end-to-end dry-run cognition pipeline bridge — no prose, no Smart Talk production wiring, no LLM/OCR.** Adds `run-smart-talk-bridge-dry-run.ts` (`runSmartTalkBridgeDryRun`), `smart-talk-bridge-dry-run-regression.ts` (7-case regression), and `SMART_TALK_BRIDGE_DRY_RUN.md` (architectural documentation). Adds `BridgeDiagnosticCode`, `BridgeDiagnostic`, `SmartTalkBridgeDryRunInput`, and `SmartTalkBridgeDryRunResult` to `explanation-mapper-types.ts`.

`runSmartTalkBridgeDryRun(input): SmartTalkBridgeDryRunResult` is a pure function routing on `accessTier` to `runFreePreviewMapper` (free_preview) or `runPaidExplanationMapper` (paid_explanation). After routing, the bridge runs 7 structural-validity and governance-preservation checks: `sourceBound` and `neverContainsUserVisibleCopy` invariants on all sections, `neverUserVisible` on all diagnostics, contract forbidden-move and required-constraint preservation in the draft, and cross-tier leakage detection for both directions. Violations emit typed `BridgeDiagnosticCode` diagnostics (all `neverUserVisible: true`). Result carries `structurallyValid`, `governancePreserved`, `mapperKind`, `diagnostics`, and `neverUserVisible: true`.

The 7-case regression scaffold validates: free-preview basic, paid basic, paid uncertainty-required, paid human-review flag, paid deadline suppression, free-preview enforcement-forbidden, and paid all-major-forbidden-moves. All cases assert `governancePreserved === true`, `structurallyValid === true`, `neverUserVisible === true`, no cross-tier leakage, and no prose.

See **`SMART_TALK_BRIDGE_DRY_RUN.md`** and **`reality-simulation/README.md §PHASE 8.2F-6`**.

---

### Phase 8.2F-5 — Explanation Output Regression Corpus

**Structural cognition output regression only — no prose, no runtime wiring, no LLM/OCR.** Adds `explanation-output-regression-corpus.ts` (15-case corpus data), `validate-explanation-output-regressions.ts` (pure validator), and `explanation-output-regression-scaffold.ts` (cross-mapper runner).

The corpus validates mapper outputs under 15 distinct structural scenarios: 6 free-preview cases (basic, uncertainty, deadline suppression, enforcement suppression, human review, invalid tier) and 9 paid cases (basic, uncertainty, deadline, enforcement, legal verdict, autonomous action, cross-lane, all forbidden moves, invalid tier). `validateExplanationOutputRegression` applies 11 structural checks with a 9-category failure taxonomy. `runExplanationOutputRegressionScaffold` routes each case to the appropriate mapper, validates, and aggregates with per-category failure breakdown. Expected baseline: `allPassed: true`, 15/15.

See **`reality-simulation/README.md §PHASE 8.2F-5`**.

---

### Phase 8.2F-4 — Paid Explanation Mapper Scaffold

**Paid-tier structural cognition scaffold only — no prose, no unrestricted extraction, no Smart Talk/OCR/LLM wiring.** Adds `run-paid-explanation-mapper.ts` (`runPaidExplanationMapper`), `paid-explanation-mapper-regression-scaffold.ts` (9 cases), and `PaidExplanationMapperDiagnosticCode` type.

`runPaidExplanationMapper(input): RuntimeExplanationDraft` enforces `accessTier === "paid_explanation"` structurally. Invalid tier returns a diagnostic-only draft without throwing. Produces deeper sections (`document_overview`, `what_this_means`, `attention_points`, `next_steps_safe`, `uncertainty_and_limits`, `paid_deep_explanation`, conditional `review_recommendation`) using `PaidExplanationFields` key allowlists as structural tags — no raw extraction. `payment_preview_limited` is structurally absent. `next_steps_safe` is fully excluded when `no_autonomous_form_submission` is active. Five typed `PaidExplanationMapperDiagnosticCode` values: `paid_deadline_output_blocked`, `paid_enforcement_claim_blocked`, `paid_legal_verdict_blocked`, `paid_autonomous_action_blocked`, `paid_cross_lane_merge_blocked`.

The 9-case scaffold validates: basic paid, uncertainty requirement, deadline forbidden, enforcement forbidden, legal verdict forbidden, human review flag, cross-lane suppression, invalid free-preview tier, and all major forbidden moves.

See **`reality-simulation/README.md §PHASE 8.2F-4`**.

---

### Phase 8.2F-3 — Free Preview Mapper Scaffold

**Structural free-tier specialization only — no prose, no paid leakage, no Smart Talk/OCR/LLM wiring.** Adds `run-free-preview-mapper.ts` (`runFreePreviewMapper`), `free-preview-mapper-regression-scaffold.ts` (7 cases), and `FreePreviewMapperDiagnosticCode` type.

`runFreePreviewMapper(input): RuntimeExplanationDraft` enforces `accessTier === "free_preview"` structurally. Invalid tier input returns a zero-section diagnostic-only draft without throwing. Valid free-preview input produces only the four allowed sections (`document_overview`, `payment_preview_limited`, `uncertainty_and_limits`, conditional `review_recommendation`), each referencing `FreePreviewFields` keys only. All paid-only sections are structurally absent. Forbidden move suppression emits strongly-typed `FreePreviewMapperDiagnosticCode` diagnostics. `free_preview_paid_field_blocked` is always emitted unconditionally.

The 7-case scaffold validates: basic preview, uncertainty requirement, deadline forbidden, enforcement forbidden, invalid paid-tier input, human review flag, and all major forbidden moves.

See **`reality-simulation/README.md §PHASE 8.2F-3`**.

---

### Phase 8.2F-2 — Explanation Mapper Skeleton

**Typed governance skeleton only — no runtime behavior changed, no user-visible prose, no Smart Talk/OCR/LLM wiring.** Adds `run-explanation-mapper.ts` (`runExplanationMapper`), `explanation-mapper-regression-scaffold.ts` (5 regression cases), and promotes `explanation-mapper-types.ts` from spec sketch to active types.

`runExplanationMapper(input): RuntimeExplanationDraft` is a pure function that reads only structured governance inputs (simulation candidates, boundaries, forbidden moves, required constraints, access tier, review flags) and produces structural draft metadata with section type lists, allowed contract field tags, blocked reason codes, uncertainty/review posture, and never-user-visible diagnostics. No prose is generated. Access tier isolation and all governance constraints are enforced structurally.

`runExplanationMapperRegressionScaffold()` validates five cases: free-preview basic, free-preview with deadline forbidden, paid with uncertainty required, paid with human review flag, and paid with all major forbidden moves. No test runner dependency.

See **`reality-simulation/README.md §PHASE 8.2F-2`**.

---

### Phase 8.2F-1 — Runtime Explanation Mapper Spec

**Specification only — no runtime behavior changed.** Adds **`RUNTIME_EXPLANATION_MAPPER_SPEC.md`** and optional type sketches in **`reality-simulation/explanation-mapper-types.ts`**.

The spec defines the future boundary for converting `RealitySimulationResult` plus `SimulationExplanationContract` into structured explanation drafts. It is explicitly not a mapper implementation, Smart Talk bridge, LLM prompt, OCR integration, deadline calculator, legal interpretation layer, or user-visible copy generator.

The spec documents:

- allowed mapper inputs and forbidden raw inputs
- conceptual `RuntimeExplanationDraft` structure
- free preview teaser limits
- paid explanation limits
- boundary enforcement policy
- forbidden move and required constraint policy
- tone policy
- failure modes
- future phases from mapper skeleton through trusted-user pilot gate

Key rule: paid explanation may be deeper, but it remains bounded. Payment must not unlock legal verdicts, deadline calculation, enforcement certainty, immigration/tax certainty, autonomous action, dry-run-as-fact, or speculation-as-fact.

See **`RUNTIME_EXPLANATION_MAPPER_SPEC.md`** and **`reality-simulation/README.md §PHASE 8.2F-1`**.

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
| **8.2F MVP readiness / mapper / pilot gate** | **8.2F-0** MVP Safety Readiness Audit. **8.2F-1** Runtime Explanation Mapper Spec (governance spec, type sketches, no runtime). **8.2F-2** Explanation Mapper Skeleton: `runExplanationMapper` pure function, 5-case regression scaffold, access-tier isolation, forbidden-move exclusion/restriction, no prose generated. **8.2F-3** Free Preview Mapper Scaffold: `runFreePreviewMapper` specialisation, 7-case regression scaffold, invalid-tier diagnostic-only draft, paid-field structural block, per-section free-field allowlists, suppression diagnostics. **8.2F-4** Paid Explanation Mapper Scaffold: `runPaidExplanationMapper` specialisation, 9-case regression scaffold, deeper section policy with `what_this_means`/`attention_points`/`next_steps_safe`/`paid_deep_explanation`, `PaidExplanationFields` allowlists, five typed suppression diagnostic codes, `next_steps_safe` excluded on autonomous-form forbidden move. **8.2F-5** Explanation Output Regression Corpus: 15-case structural corpus, `validateExplanationOutputRegression` pure validator, `runExplanationOutputRegressionScaffold` cross-mapper aggregator, 9-category failure taxonomy, free-preview leakage detection, forbidden-move suppression regression. **8.2F-6** Smart Talk Bridge Dry Run: `runSmartTalkBridgeDryRun` pure function, access-tier routing to `runFreePreviewMapper`/`runPaidExplanationMapper`, 7 structural-validity and governance-preservation checks, typed `BridgeDiagnosticCode`, 7-case bridge regression, `SmartTalkBridgeDryRunInput`/`SmartTalkBridgeDryRunResult` types, `neverUserVisible: true` on all outputs, no prose/LLM/OCR/Smart Talk production wiring. **8.2F-6A** Bridge Contract Tier Mismatch Diagnostic: `bridge_contract_tier_mismatch` added to `BridgeDiagnosticCode`; post-routing mismatch check in bridge emits diagnostic when `input.accessTier !== contract.accessTier`; observability-only; Case 8 added. **8.2F-7** Trusted User Pilot Gate: governance readiness spec, typed pilot gate model, pure `evaluateTrustedUserPilotReadiness` scaffold, readiness classification, pilot constraints, stop conditions, escalation rules, trust signals, future roadmap; no public release or runtime activation. |
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
| `MVP_SAFETY_READINESS_AUDIT.md` | **Phase 8.2F-0** — MVP readiness classification, public-release blockers, and rollout guidance. |
| `RUNTIME_EXPLANATION_MAPPER_SPEC.md` | **Phase 8.2F-1** — future Runtime Explanation Mapper specification and safety boundary. |
| `SMART_TALK_BRIDGE_DRY_RUN.md` | **Phase 8.2F-6** — Smart Talk Bridge Dry Run architecture, type model, routing behavior, structural validity checks, and regression summary. |
| `TRUSTED_USER_PILOT_GATE.md` | **Phase 8.2F-7** — trusted-user pilot governance gate, readiness classification, scope, stop conditions, escalation, and rollout roadmap. |
| `trusted-user-pilot-gate-types.ts` | **Phase 8.2F-7** — typed pilot readiness model only; no runtime execution. |
| `trusted-user-pilot-readiness-scaffold.ts` | **Phase 8.2F-7** — pure static readiness scaffold; no live checks or Smart Talk wiring. |
| `reality-simulation/wording-review-types.ts` | **Phase 8.2F-8** — `WordingReviewVerdict`, `SectionWordingAssessment`, `WordingReviewSnapshot`, `WordingReviewComplianceResult`, diagnostic types. |
| `reality-simulation/run-wording-review-scaffold.ts` | **Phase 8.2F-8** — `verifyHumanReviewCompliance` pure function; metadata only, no prose, no LLM. |
| `reality-simulation/wording-review-regression-scaffold.ts` | **Phase 8.2F-8** — 8-case regression scaffold for human review compliance rules. |
| `reality-simulation/ocr-uncertainty-types.ts` | **Phase 8.2F-9** — `OcrConfidenceLevel`, `OcrPipelineDisposition`, `OcrDegradationVector`, `OcrDiagnosticCode`, `OcrEvaluationResult`. |
| `reality-simulation/evaluate-ocr-uncertainty.ts` | **Phase 8.2F-9** — `evaluateOcrUncertainty` pure evaluator; no OCR SDK, no image processing, no LLM. |
| `reality-simulation/ocr-uncertainty-regression-scaffold.ts` | **Phase 8.2F-9** — 8-case regression scaffold for OCR degradation evaluation rules. |
| `reality-simulation/redacted-corpus-types.ts` | **Phase 8.2F-10** — `RedactedDocument`, placeholder model, `RedactedCorpusValidationResult`. |
| `reality-simulation/redacted-corpus-registry.ts` | **Phase 8.2F-10** — `REDACTED_DOCUMENT_CORPUS` with 5 synthetic exemplars; no real PII. |
| `reality-simulation/redacted-corpus-regression.ts` | **Phase 8.2F-10** — `runRedactedCorpusRegression`; static PII-hygiene and structural validation. |
| `REDACTED_CORPUS_FOUNDATION.md` | **Phase 8.2F-10** — redaction protocol, placeholder standard, admission rules, future roadmap. |
| `reality-simulation/limited-pilot-gate-types.ts` | **Phase 8.2F-11** — `PilotAccessDisposition`, `PilotGateDiagnosticCode`, `LimitedPilotGateInput/Result`, subject/telemetry/scope types. |
| `reality-simulation/run-limited-pilot-gate-scaffold.ts` | **Phase 8.2F-11** — `runLimitedPilotGateScaffold` pure gate function; no pilot activation, no DB, no auth. |
| `reality-simulation/limited-pilot-gate-regression-scaffold.ts` | **Phase 8.2F-11** — 8-case regression scaffold for all gate rules. |
| `reality-simulation/wording-evaluation-types.ts` | **Phase 8.2F-12** — `WordingToneMatrix`, `WordingEvaluationDisposition`, `WordingViolationCode`, `WordingEvaluationInput/Result`. |
| `reality-simulation/run-wording-evaluation-scaffold.ts` | **Phase 8.2F-12** — `evaluateExplanationWordingScaffold` pure evaluator; no NLP, no LLM, no real text. |
| `reality-simulation/wording-evaluation-regression-scaffold.ts` | **Phase 8.2F-12** — 8-case regression scaffold for all wording-risk evaluation rules. |
| `README.md` | Architecture and safety rationale (this file). |

**Phase 8.2C-7 (Evidence Gates):** audit-only hardening of `GateAuditTrace` — stable trace stage labels, explicit `sourceKind` / `evidenceRuleId` vs `proximityConstraintId` vs `terminalKey`, dry-run claim metadata, and static `traceMetadata` flags that **do not** enable production authorization or Smart Talk wiring. See `evidence-gates/README.md`.

**Phase 8.2C-8 (Evidence Gates):** `resolveRealityAuthorizations` adds **`trace.dryRunRealityAuthorizations`** (`candidate_*` + `dryRun: true` only) — bounded procedural hypotheses, not production supported realities or legal truth; matrix `blockedRealities` stay authoritative. See `evidence-gates/README.md`.

**Phase 8.2C-9 (Evidence Gates):** `resolveTrapActivations` adds **`trace.dryRunTrapActivations`** — hallucination trap **`candidate_*`** signals only (governance observability); **no** runtime suppression, **no** explanation rewrite, **no** Smart Talk enforcement. See `evidence-gates/README.md`.

**Phase 8.2C-10 (Evidence Gates):** `resolveStabilizerCandidates` adds **`trace.dryRunStabilizerCandidates`** — stabilizer **catalog-id** governance candidates only; **no** matrix example wording in the trace, **no** user-visible copy, **no** Smart Talk emission. See `evidence-gates/README.md`.

---

### Phase 8.2F-8 — Internal Human Wording Review Scaffold

**Metadata-only human review governance layer — no prose generation, no real user content reviewed, no pilot activation, no database writes, no LLM, no OCR, no Smart Talk production wiring.**

Adds a typed scaffold that records whether a human reviewer properly inspected a `RuntimeExplanationDraft` against all active governance constraints before any future pilot output could be trusted. This phase is a prerequisite governance layer for any future trusted-user pilot; it does not activate the pilot.

**Key types:**
- `WordingReviewVerdict` — `approved | needs_revision | rejected_with_escalation | hard_fail_governance_breach`
- `SectionWordingAssessment` — per-section reviewer record: `humanReviewed`, `humanApproved`, acknowledged blocked codes, detected leakage / unsafe certainty / panic tone
- `WordingReviewSnapshot` — full reviewer submission, `neverUserVisible: true`
- `WordingReviewComplianceResult` — compliance verdict with `compliant`, `governanceCompromised`, `effectiveVerdict`, `diagnostics`, and gap arrays, `neverUserVisible: true`

**Eight compliance rules enforced by `verifyHumanReviewCompliance`:**
1. Every section draft has a corresponding assessment
2. Every applied forbidden move is reviewed (forbidden moves are normal governance constraints — unreviewed moves are the failure, not their existence)
3. Every applied required constraint is reviewed
4. Every `blockedReasonCode` on a section is acknowledged by the reviewer
5. Reviewer-detected move leakage → compliance gap
6. Reviewer-detected unsafe certainty → `governanceCompromised = true`, `effectiveVerdict = "hard_fail_governance_breach"`
7. Reviewer-detected panic tone → same governance compromise
8. `review.verdict === "approved"` with any compliance gap → `review_integrity_failure`, `governanceCompromised = true`, `hard_fail_governance_breach` — humans may not silently override governance

**Regression scaffold:** 8 cases covering clean approval, acknowledged restrictions, force-approve detection, missing assessments, unreviewed moves, unsafe certainty, empty draft vacuous validity, and panic tone detection.

**Safety boundary:** This phase does not generate wording, review real user text, connect to Smart Talk, call OCR or LLMs, write to a database, calculate deadlines, infer legal conclusions, or approve public output.

---

### Phase 8.2F-9 — OCR Uncertainty Metadata Harness

**Metadata-only OCR degradation risk evaluation — no OCR SDK, no image processing, no LLM, no Smart Talk runtime, no mapper or bridge files touched.**

Adds a pure metadata harness that classifies OCR degradation risk and determines whether OCR-derived input is safe to proceed structurally, requires uncertainty escalation, requires human review, or must hard-fail before any cognition step runs. This phase is a prerequisite governance layer for any future document photo / scan upload mode.

**Evaluation outcomes:**
- `hard_fail` — score < 40 or sender obscured: pipeline must not proceed
- `human_review_required` — missing dates, unreadable amounts, or partial document: human must inspect before output
- `proceed_with_uncertainty` — mixed lanes or possible injection text: pipeline proceeds with mandatory uncertainty boundaries
- `proceed` — clean high-confidence scan: pipeline proceeds normally

**Key `ExplanationBoundary` tokens recommended:** `do_not_calculate_deadline`, `do_not_merge_lanes`, `do_not_present_dry_run_as_fact`, `require_uncertainty_wording`, `mention_uncertainty_if_ocr_noisy`, `recommend_human_review_high_risk`.

**Regression scaffold:** 8 cases covering perfect scan, missing dates, unreadable amounts, obscured sender, score-20 hard fail, mixed lanes, prompt injection text, and partial document.

**Safety boundary:** No OCR SDK imported, no Tesseract / AWS Textract / any OCR library, no image processing, no LLM calls, no Smart Talk wiring, no deadline calculation, no legal inference. All `OcrEvaluationResult` objects carry `neverUserVisible: true`.

---

### Phase 8.2F-10 — Redacted Corpus Foundation

**Synthetic redacted exemplars only — no real PII, no real user documents, no OCR, no LLM, no Smart Talk runtime, no mapper or bridge files touched.**

Establishes the data governance foundation for a future real-world redacted corpus. Defines the redaction protocol, typed document model, 5 synthetic exemplars, and a static privacy-hygiene validation scaffold.

**Redaction protocol highlights:**
- No real PII ever in repo
- All PII fields use standardised `[PLACEHOLDER]` tokens
- No unredacted originals stored (no PDF, image, or raw OCR dump)
- Human review gate required for all future real-world entries
- `runRedactedCorpusRegression` must pass before any entry is committed

**Synthetic corpus — 5 exemplars:** `finanzamt_bescheid` (high, OCR 88), `rundfunkbeitrag` (low, OCR 92), `inkasso_mahnung` (high, OCR 74), `krankenkasse_notice` (medium, OCR 95), `auslaenderbehoerde_letter` (high, OCR 68). All `neverContainsRealPii: true`.

**Validation scaffold (`runRedactedCorpusRegression`):** 12 static hygiene checks including unique IDs, text length, confidence range, `neverContainsRealPii` invariant, email / phone / raw IBAN pattern detection, placeholder coverage, and banned name fragment check. No NLP. No LLM. Pattern matching only.

**Cross-phase integration:** `expectedOcrDegradation` on `RedactedDocument` uses `Partial<OcrDegradationVector>` from Phase 8.2F-9, enabling future regression pipelines to route corpus entries through `evaluateOcrUncertainty` for end-to-end structural testing.

**Safety boundary:** No file system access (`fs` not imported), no database writes, no OCR SDK calls, no LLM calls, no Smart Talk wiring, no deadline calculation, no legal inference.

---

### Phase 8.2F-11 — Limited Trusted Pilot Gate Scaffold

**Metadata-only pilot gate orchestration — no pilot activated, no real users, no DB, no auth, no OCR SDK, no LLM, no Smart Talk runtime, no mapper or bridge files touched.**

Models whether a hypothetical trusted-pilot transaction would be allowed, blocked, routed to human review, or rejected as out of scope, based on invite/consent/session/scope/OCR metadata only.

**Gate rules (7, evaluated in order):**
1. Subject invite check (`pilot_unauthorized_subject`)
2. Subject consent check (`pilot_missing_consent`)
3. Session transaction limit (`pilot_session_limit_reached`)
4. Scope constraints — `containsRealUserDocument=true` triggers `governanceCompromised=true` (`pilot_scope_not_allowed`)
5. OCR hard-fail blocks pipeline (`pilot_blocked_by_ocr_degradation`)
6. OCR human-review triggers `human_review_required` disposition (`pilot_human_review_required_by_ocr`)
7. All clear → `allowed`, `pilot_gate_passed`

**Cross-phase integration:** calls `evaluateOcrUncertainty` (Phase 8.2F-9); uses `RedactedDocumentCategory` (Phase 8.2F-10); models the transaction-level gate envisioned in Phase 8.2F-7.

**Regression scaffold:** 8 cases — clean pass, not invited, missing consent, session limit, OCR score-20 hard fail, missing-dates human review, obscured sender, real document governance breach.

**Safety boundary:** No pilot activation, no real user access, no DB reads, no auth implementation, no consent capture, no OCR SDK, no LLM, no Smart Talk wiring.

---

### Phase 8.2F-12 — Runtime Explanation Wording Evaluation Scaffold

**Metadata-only wording risk evaluation — no real text analysed, no NLP, no LLM, no prose generated, no Smart Talk runtime, no mapper or bridge files touched.**

Adds a deterministic evaluator that classifies caller-supplied tone-matrix scores against governance thresholds. Zero-tolerance hard fails cover authoritative legal advice, false reassurance, and manipulative framing. Panic guard hard-fails above threshold 30. Ambiguity guard triggers human review above threshold 40. Insufficient empathetic clarity triggers human review. `isSafeForUser: true` only on `approved` disposition.

**`evaluateExplanationWordingScaffold(input)`** — pure function. No NLP, no LLM, no real text. Clamps all scores to [0, 100]. Returns `WordingEvaluationResult` with `neverUserVisible: true`.

**Regression scaffold:** 8 cases — perfect approval, authoritative advice, false reassurance, panic, confusing ambiguity, manipulative, low clarity, out-of-range clamping.

**Safety boundary:** No real text evaluated, no NLP, no LLM calls, no prose generated, no Smart Talk wiring. Pure metadata threshold evaluation.

---

### Phase 8.2F-13 — Incident Governance & Kill Switch Scaffold

**Metadata-only incident governance — no kill switch activated, no runtime shutdown, no production incident automation, no Smart Talk runtime, no mapper or bridge files touched.**

> **No real kill switch exists. No runtime shutdown capability is implemented.** All `KillSwitchDisposition` values are structural governance recommendations only.

Adds a deterministic incident evaluator that classifies governance incidents by severity, category, and safety flags, and recommends the appropriate escalation posture. Severity rules are evaluated in priority order: `emergency_stop_recommended` (critical or user harm) → `restricted_mode` (high + governance breach) → `human_review_required` (medium, trust impact, pilot safety) → `monitoring_only` (low, no compromise).

Category-specific diagnostics are emitted for `false_reassurance_risk`, `hallucinated_deadline_risk`, `hallucinated_enforcement_risk`, `OCR_uncertainty_failure`, and `privacy_risk`. `incident_governance_breach_detected` is always emitted when governance is compromised. `pilotShouldPause = true` on `emergency_stop_recommended`.

**`runIncidentGovernanceScaffold(input)`** — pure function. No kill switch, no runtime shutdown, no DB, no OCR SDK, no LLM. Returns `IncidentGovernanceResult` with `neverUserVisible: true`.

**Key types:** `IncidentSeverity`, `IncidentCategory`, `IncidentSourceLayer`, `KillSwitchDisposition`, `IncidentDiagnosticCode`, `IncidentGovernanceInput`, `IncidentGovernanceResult`.

**Regression scaffold:** 8 cases — low monitoring-only, medium trust-impact, high governance breach (restricted mode), OCR failure, false reassurance escalation, deadline hallucination risk, privacy-risk critical, critical user-harm emergency stop.

**Documentation:** `INCIDENT_GOVERNANCE_SCAFFOLD.md` documents the absence of a real kill switch, scaffold-only governance posture, future operational phases (incident pipeline, human escalation chain, pilot stop wiring, kill-switch integration, retrospective system).

**Cross-phase integration:** `sourceLayer` values map to prior phases — `OCR` (8.2F-9), `pilot_gate` (8.2F-11), `wording_review` (8.2F-8/12), `mapper`/`bridge` (8.2F-3/4/6). Future phases can route hard-fail results from those layers directly into `runIncidentGovernanceScaffold`.

**Safety boundary:** No kill switch, no runtime shutdown, no DB writes, no feature toggles, no environment variable changes, no OCR SDK, no LLM calls, no Smart Talk wiring. Pure governance metadata only.

---

### Phase 8.2F-15 — Governance Lineage Integration Audit

**Audit only / no runtime wiring / no existing behavior modified.**

> **Overall Status: `partially_connected`** — The governance architecture has verified structural connections across most layers but critical production blockers and disconnected safeguards prevent any real-user deployment.

Performs a complete cross-layer governance lineage audit spanning phases 8.2A → 8.2F-14. This is a static governance inventory, not a runtime scanner. No files are read, no APIs are called, and no schemas are inspected.

**New files (at `reality-matrix/` level, not in `reality-simulation/`):**

| File | Role |
|---|---|
| `governance-lineage-audit-types.ts` | `GovernanceLayerId`, `GovernanceLineageStatus`, `GovernanceAuditFindingSeverity`, `GovernanceAuditFinding`, `GovernanceLineageAuditResult` |
| `run-governance-lineage-audit-scaffold.ts` | `runGovernanceLineageAuditScaffold()` — static inventory returning pre-authored findings |
| `GOVERNANCE_LINEAGE_INTEGRATION_AUDIT.md` | Full audit document: layer inventory, lineage flow, connected safeguards, technical debts, production blockers, pilot/production readiness, and recommended milestones |

**Finding summary:**

| Category | Count | Severity |
|---|---|---|
| Connected lineage connections | 12 | `informational` |
| Partial connections & technical debts | 12 | `warning` |
| Production blockers & disconnected safeguards | 6 | `critical` |

**Connected layers (informational):** Constitution → Reality Matrix (boundary policy table), Reality Matrix → Simulation (runRealitySimulation), Simulation → Explanation Contract (SimulationExplanationContract), Contract → both mappers (contract enforcement), Mappers → Bridge (tier routing), Bridge → Wording Review (draft handoff), OCR Uncertainty → Pilot Gate (evaluateOcrUncertainty), OCR Uncertainty → Redacted Corpus (OcrDegradationVector field), Incident Governance (sourceLayer covers all layers), Provenance Audit (ProvenanceSourceKind covers all layers), dual wording safety model (pre + post generation).

**Technical debts (warning):** `TrapActivation.trapKind` typed as `string`; `calculated_amount` missing dedicated `ForbiddenExplanationMove`; `false_reassurance` missing dedicated `ForbiddenExplanationMove`; `next_steps_safe` restriction-state unused; overloaded diagnostic taxonomy across 8 separate code union types; broad blocking diagnostic buckets in bridge layer.

**Critical production blockers:**
1. Runtime explanation mapper not implemented — mappers return metadata only, no prose
2. Simulation-to-explanation coupling not proven in production
3. No real-world evaluation corpus (synthetic exemplars only)
4. No production OCR cognition path (caller-supplied metadata only)
5. No operational telemetry or audit persistence
6. OCR uncertainty disconnected from mapper and bridge pipeline

**Safety classification:**
- SAFE FOR: synthetic governance testing, internal audit, trusted pilot preparation
- NOT YET SAFE FOR: public deployment, autonomous action, legal authority positioning, production cognition

**Recommended next milestones:** Real OCR integration (8.2G-1) → Real corpus admission (8.2G-2) → Explanation text generation (8.2G-3) → Governance integration wiring (8.2G-4) → Audit persistence and telemetry (8.2G-5) → Trusted pilot activation (8.2G-6).

---

### Phase 8.2F-14 — Runtime Provenance & Audit Trace Scaffold

**Metadata-only audit trace vocabulary — no persistence, no logging, no telemetry, no runtime hooks, no Smart Talk wiring, no mapper or bridge files touched.**

Defines the structural vocabulary for recording governance decision lineage before any runtime coupling exists. Establishes `AuditTraceNode` (a single governance event with provenance source, decision kind, and parent references), `AuditTraceChain` (a complete lineage sequence), and `validateAuditTraceChain` — a pure structural validator.

**`validateAuditTraceChain(chain)`** — pure function. Validates root existence, duplicate traceIds, parent-reference integrity, orphan nodes (BFS from root), and cycles (DFS with recursion-stack over parent edges). Returns `AuditTraceValidationResult` with `neverUserVisible: true`. `fullyConsistent = true` only when valid AND the only diagnostic is the soft `trace_unknown_source` warning.

**Key types:** `ProvenanceSourceKind` (12 pipeline layers from OCR through incident governance), `AuditDecisionKind` (10 decision types), `AuditTraceDiagnosticCode` (6 codes including the soft `trace_unknown_source` warning).

**Regression scaffold:** 8 cases — single root, multi-node chain, duplicate ID, missing root, orphan node, invalid parent reference, cycle detection (4-node A→C→B→A loop), unknown source kind warning.

**Documentation:** `RUNTIME_PROVENANCE_AUDIT_TRACE.md` explains provenance, trace lineage, governance ancestry, decision traceability, and the future phases needed to build a real audit system (runtime attachment, persistent records, incident investigation support, governance review tooling, trace signing).

**Cross-phase vocabulary coverage:** `sourceKind` values map every prior governance layer (Phases 8.2F-3 through 8.2F-13) to a traceable provenance kind. Future runtime coupling can propagate `traceId`s across OCR → mapper → bridge → wording review → pilot gate → incident governance for end-to-end lineage.

**Safety boundary:** No database writes, no log writes, no telemetry SDK, no file system access, no runtime execution hooks, no feature flags, no Smart Talk connection, no OCR SDK, no LLM calls. All types carry `neverUserVisible: true`.

---

### Phase 8.2F-15A — Dedicated Forbidden Moves for False Reassurance and Calculated Amount

**Contract hardening / technical debt resolution — no runtime behavior changed, no new scenarios, no prose generated, no Smart Talk/OCR/LLM wiring.**

Resolves two high-risk contract debts identified in the Phase 8.2F-15 Governance Lineage Integration Audit:

| Debt (8.2F-15) | Status | Resolution |
|---|---|---|
| `calculated_amount` missing dedicated `ForbiddenExplanationMove` | **RESOLVED** | `no_calculated_amount_extraction` added |
| `false_reassurance` missing dedicated `ForbiddenExplanationMove` | **RESOLVED** | `no_false_reassurance_framing` added |

**New `ForbiddenExplanationMove` tokens:**

- **`no_false_reassurance_framing`** — the explanation layer must not reassure the user that a risk is absent, harmless, resolved, forgiven, stopped, unenforceable, or safe unless explicitly supported by validated evidence and permitted by future policy.
- **`no_calculated_amount_extraction`** — the explanation layer must not calculate, derive, infer, total, split, convert, estimate, or reconstruct monetary amounts from uncertain text, OCR fragments, partial documents, or unsupported cues.

**Files modified:**
- `reality-simulation/explanation-contract-types.ts` — 2 new union members and `KNOWN_FORBIDDEN_EXPLANATION_MOVES` entries
- `reality-simulation/contract-boundary-regression.ts` — scaffoldVersion bumped to v4
- `reality-simulation/explanation-output-regression-corpus.ts` — 2 new preservation validation cases (0016, 0017)
- `controlled-corpus/corpus-types.ts` — `ControlledCorpusExpectedForbiddenMove` extended
- `controlled-corpus/scenarios.ts` — 6 scenario `expectedForbiddenMoves` updated (corpus version bumped)
- `controlled-corpus/validate-scenario-boundary-expectations.ts` — 2 new `MUST_NOT_EMIT_POLICY_RULES` entries
- `controlled-corpus/validate-scenario-contract-expectations.ts` — hard rule and soft rule updated
- `run-governance-lineage-audit-scaffold.ts` — 2 debts resolved (informational), 4 new warnings added (v2)
- `GOVERNANCE_LINEAGE_INTEGRATION_AUDIT.md` — Debt 2 and 3 marked RESOLVED; Debts 7–10 added

**Governance lineage audit after 8.2F-15A:** audit version `8.2f-15a-governance-lineage-audit-v2`. 4 new technical debts documented (Debts 7–10: caller-supplied OCR confidence, caller-supplied pilot telemetry, caller-supplied wording scores, `AuditTraceChain.structurallyValid` consistency). All 20 corpus scenarios continue to satisfy `valid = true`, `fullyConsistent = true`.

**Safety boundary:** No mapper implementation files modified. No runtime coupling. No prose generation. No Smart Talk/OCR/LLM/DB changes. No user-visible output. All types carry `neverUserVisible: true`. Dedicated mapper diagnostic handling for the new moves is future **8.2F-15C** work.

---

### Phase 8.2F-15B — TrapActivation.trapKind Typing Hardening

**Type safety hardening / technical debt resolution — no trap semantics changed, no simulation behavior changed, no runtime coupling added.**

Resolves **Debt 1** from the Phase 8.2F-15 Governance Lineage Integration Audit:

> `TrapActivation.trapKind` was typed as `string`, creating a type-safety gap between registered hallucination traps, trap metadata, trap activation records, and trap validation logic.

**Changes made:**

| File | Change |
|---|---|
| `evidence-gates-types.ts` | `trapKind: string` → `trapKind: HallucinationTrapKind` in `TrapActivation`; `HallucinationTrapKind` added to imports |
| `evidence-gates/resolve-trap-activations.ts` | `ENFORCEMENT_CLUSTER_TRAP_KINDS` narrowed from `Set<string>` to `Set<HallucinationTrapKind>`; import updated |
| `reality-simulation/run-reality-simulation.ts` | Stale comment updated to reflect typed `trapKind`; defensive `in` check and conservative fallback retained |
| `run-governance-lineage-audit-scaffold.ts` | Debt 1 moved from `WARNING_FINDINGS` to `CONNECTED_LINEAGE_FINDINGS` as an `informational` resolved finding; version bumped to `v3` |
| `GOVERNANCE_LINEAGE_INTEGRATION_AUDIT.md` | Debt 1 marked `✅ RESOLVED`; `8.2F-15B Update` summary added at top |

**Registry consistency:** `HallucinationTrapKind` is derived from `HALLUCINATION_TRAP_KINDS` in `types.ts` — the canonical single source of truth. No duplicate type definitions introduced. `TRAP_METADATA_BY_KIND` remains the complete `Record<HallucinationTrapKind, TrapMetadataDefinition>` registry.

**Lookup hardening:** The defensive `t.trapKind in TRAP_METADATA_BY_KIND` check and conservative fallback in `run-reality-simulation.ts` are retained. Typed `trapKind` + defensive unknown lookup handling is the accepted pattern per the audit spec.

**Governance lineage audit after 8.2F-15B:** audit version `8.2f-15b-governance-lineage-audit-v3`. Remaining open debts: Debts 4–10 (overloaded diagnostic taxonomy, `next_steps_safe` dead state, broad blocking diagnostics, caller-supplied metadata, `AuditTraceChain.structurallyValid` consistency).

**Safety boundary:** No new traps added. No trap semantics changed. No simulation behavior changed. No runtime coupling added. No Smart Talk/OCR/LLM/DB changes. No user-visible output. TypeScript passes cleanly.

---

### Phase 8.2F-15C — Mapper Diagnostic Taxonomy Hardening

**Mode:** Diagnostic taxonomy refinement / technical debt resolution
**Risk:** Structural diagnostic refinement only — no user-visible behavior change

**Debt resolved:** Debts 5 and 6 from the Governance Lineage Integration Audit (partially reduced at mapper level).

**Problem statement (pre-8.2F-15C):**
- `free_preview_paid_field_blocked` was overloaded — emitted both as the structural invariant (paid sections absent) AND as the per-move diagnostic for 8 distinct forbidden moves (legal verdict, tax certainty, immigration certainty, guaranteed outcomes, truthfulness, cross-lane, panic phrasing, plus the new 8.2F-15A moves without dedicated codes).
- `paid_legal_verdict_blocked` was overloaded — used for `no_definitive_legal_verdicts`, `no_guaranteed_outcomes`, `no_tax_certainty`, `no_immigration_certainty`, `no_dry_run_as_fact`, and `no_speculation_as_fact`.
- `paid_autonomous_action_blocked` was overloaded — used both as the forbidden-move notification for `no_autonomous_form_submission` AND as the generic section-exclusion notification.

**Changes made:**

| File | Change |
|---|---|
| `reality-simulation/explanation-mapper-types.ts` | `FreePreviewMapperDiagnosticCode` extended with 9 move-specific codes; `PaidExplanationMapperDiagnosticCode` extended with 8 move-specific codes + `paid_section_excluded_by_forbidden_move`; doc comments updated |
| `reality-simulation/run-free-preview-mapper.ts` | `FREE_PREVIEW_FORBIDDEN_MOVE_EFFECTS` updated — each move now maps to its dedicated code; `no_false_reassurance_framing` and `no_calculated_amount_extraction` entries added; version bumped |
| `reality-simulation/run-paid-explanation-mapper.ts` | `PAID_FORBIDDEN_MOVE_EFFECTS` updated — each move maps to its dedicated code; section-exclusion notification changed from `paid_autonomous_action_blocked` to `paid_section_excluded_by_forbidden_move`; version bumped |
| `reality-simulation/free-preview-mapper-regression-scaffold.ts` | Case 7 expanded with new moves and assertions for all 9 new specific codes; version bumped |
| `reality-simulation/paid-explanation-mapper-regression-scaffold.ts` | Case 9 expanded with new moves and assertions for all 8 new specific codes; version bumped |
| `reality-simulation/explanation-output-regression-corpus.ts` | Cases 0016/0017 updated to assert specific codes; corpus case 0014 updated to assert new 8.2F-15C codes; new cases 0018/0019 added for paid-tier coverage of new moves; version bumped |
| `run-governance-lineage-audit-scaffold.ts` | Debts 5 and 6 text updated (partial reduction); 2 new `CONNECTED_LINEAGE_FINDINGS` added; version bumped to `v4` |
| `GOVERNANCE_LINEAGE_INTEGRATION_AUDIT.md` | Debts 5/6 marked partially reduced; 8.2F-15C update note added |

**Semantic narrowing of retained codes:**
- `free_preview_paid_field_blocked` → invariant only: records that paid sections are structurally absent in this tier
- `paid_legal_verdict_blocked` → `no_definitive_legal_verdicts` only
- `paid_autonomous_action_blocked` → `no_autonomous_form_submission` only

**Remaining open debts:** Debt 4 (`next_steps_safe` dead state), Debt 5 (cross-phase namespace isolation, not mapper-level), Debt 6 (bridge-level `BridgeBlockingReason` typed field), Debts 7–10 (caller-supplied metadata, `AuditTraceChain.structurallyValid`).

**Safety boundary:** No section presence/absence behavior changed. No access-tier routing changed. No user-visible output introduced. No runtime coupling, telemetry, or persistence added. No Smart Talk/OCR/LLM changes. TypeScript and ESLint pass cleanly.

---

### Phase 8.2F-15D — `next_steps_safe` Dead Restriction-State Cleanup

**Governance model cleanup / technical debt resolution — no user-visible behavior change, no section visibility change, no access-tier change.**

Resolves **Debt 4** from the Phase 8.2F-15 Governance Lineage Integration Audit.

#### Dead path identified

In `run-paid-explanation-mapper.ts`, the `PAID_FORBIDDEN_MOVE_EFFECTS` table has two entries that affect `next_steps_safe`:

| Forbidden move | Effect on `next_steps_safe` |
|---|---|
| `no_autonomous_form_submission` | **Excluded** — section fully removed from draft |
| `no_deadline_calculation_when_forbidden` | **Restricted** — section receives blocked reason codes |

When **both** moves are active simultaneously, the effect loop accumulates:
- `excludedSectionTypes ← {"next_steps_safe"}` (from `no_autonomous_form_submission`)
- `sectionBlockedReasonCodes["next_steps_safe"] ← ["forbidden_move:no_deadline_calculation_when_forbidden"]` (from `no_deadline_calculation_when_forbidden`)

The section assembly exclusion check (`excludedSectionTypes.has(sectionType)` → `true` → `continue`) fires **before** `sectionBlockedReasonCodes` is read. The accumulated restriction entry is permanently unreachable — dead internal bookkeeping.

**When only `no_deadline_calculation_when_forbidden` is active** (without `no_autonomous_form_submission`), `next_steps_safe` is not excluded and the restriction IS reachable. This path is tested by regression Case 3 and corpus case `eo-8-2f-5-0009` and is fully unchanged.

#### Cleanup approach

A post-filter loop added to `runPaidExplanationMapper` after the effect loop:

```typescript
// 8.2F-15D: Remove restriction bookkeeping for sections that are already excluded.
for (const excluded of excludedSectionTypes) {
  sectionBlockedReasonCodes.delete(excluded);
}
```

This is the minimal change. No section visibility, `blockedReasonCodes`, diagnostics, mapper output structure, section order, or access-tier behavior changed.

#### Files modified

| File | Change |
|---|---|
| `reality-simulation/run-paid-explanation-mapper.ts` | Post-filter loop; version bump to `v3` |
| `reality-simulation/paid-explanation-mapper-regression-scaffold.ts` | Version bump to `v3` |
| `reality-simulation/explanation-output-regression-corpus.ts` | Version bump to `v4` |
| `run-governance-lineage-audit-scaffold.ts` | Debt 4 resolved, moved to `CONNECTED_LINEAGE_FINDINGS`; audit version `v5` |
| `GOVERNANCE_LINEAGE_INTEGRATION_AUDIT.md` | Debt 4 marked ✅ RESOLVED |

**Remaining open debts:** Debt 5 (cross-phase diagnostic namespace isolation), Debt 6 (bridge-level `BridgeBlockingReason` typed field), Debts 7–10 (caller-supplied metadata, `AuditTraceChain.structurallyValid`).

**Safety boundary:** No section visibility changed. No `blockedReasonCodes` on produced sections changed. No diagnostics changed. No runtime coupling, telemetry, or persistence added. No Smart Talk/OCR/LLM changes. TypeScript and ESLint pass cleanly.

---

### Phase 8.2F-15E — OCR Confidence Provenance Contract

**Input provenance hardening / technical debt resolution — no live OCR, no OCR SDK, no runtime wiring.**

Partially resolves **Debt 7** from the Phase 8.2F-15 Governance Lineage Integration Audit.

#### Problem

`evaluateOcrUncertainty` accepted `baseConfidenceScore` as a raw caller-supplied number with no provenance or attestation contract. A caller could supply any value, bypassing the intent of OCR governance.

#### Solution

A typed `OcrQualityReport` provenance contract was introduced:

| New type | Purpose |
|---|---|
| `OcrQualityReportSourceKind` | Origin classification: `synthetic_metadata`, `manual_test_fixture`, `future_ocr_engine`, `imported_quality_report` |
| `OcrQualityAttestationStatus` | Trust posture: `unattested`, `test_fixture_attested`, `future_engine_attested` |
| `OcrQualityReport` | Structured report: `reportId`, `sourceKind`, `attestationStatus`, `confidenceScore`, `qualityFlags`, `generatedBy`, `neverUserVisible: true` |
| `OcrQualityReportValidationResult` | Structural integrity check result |

| New function | Purpose |
|---|---|
| `evaluateOcrUncertaintyFromQualityReport` | Preferred entrypoint; consumes `OcrQualityReport`, appends attestation warning note when `unattested` |
| `validateOcrQualityReport` | Structural integrity checker for reports at governance ingress |

`LimitedPilotGateInput` changes:
- `baseOcrConfidenceScore` made `optional` — backward compat retained
- `ocrQualityReport?: OcrQualityReport` added — preferred provenance path
- `pilot_ocr_confidence_unattested` added to `PilotGateDiagnosticCode` — emitted as informational diagnostic on raw-score path

#### Files modified

| File | Change |
|---|---|
| `reality-simulation/ocr-uncertainty-types.ts` | Added 4 new types: `OcrQualityReportSourceKind`, `OcrQualityAttestationStatus`, `OcrQualityReport`, `OcrQualityReportValidationResult` |
| `reality-simulation/evaluate-ocr-uncertainty.ts` | Added `evaluateOcrUncertaintyFromQualityReport`, `validateOcrQualityReport`; version `v2` |
| `reality-simulation/limited-pilot-gate-types.ts` | `baseOcrConfidenceScore` optional; `ocrQualityReport` added; `pilot_ocr_confidence_unattested` diagnostic code added |
| `reality-simulation/run-limited-pilot-gate-scaffold.ts` | OCR evaluation branches on `ocrQualityReport` vs. `baseOcrConfidenceScore`; version `v2` |
| `reality-simulation/ocr-uncertainty-regression-scaffold.ts` | Cases 9–11 added (attested report, unattested warning, clamped score); version `v2` |
| `reality-simulation/limited-pilot-gate-regression-scaffold.ts` | Case 9 added (OcrQualityReport path); Case 1 updated to assert `pilot_ocr_confidence_unattested`; version `v2` |
| `run-governance-lineage-audit-scaffold.ts` | Debt 7 → partially resolved; audit version `v6` |
| `GOVERNANCE_LINEAGE_INTEGRATION_AUDIT.md` | Debt 7 marked ⚠ PARTIALLY RESOLVED |

#### Remaining gap

`OcrQualityReport` is still caller-constructed metadata. Full resolution requires a future production phase that binds the report to a verified OCR engine output.

**Remaining open debts:** Debt 5 (cross-phase namespace isolation), Debt 6 (bridge-level typing), Debt 8 (pilot telemetry — partially resolved in 8.2F-15F), Debt 9 (wording scores), Debt 10 (`AuditTraceChain.structurallyValid`). Debt 7 partially resolved.

**Safety boundary:** No live OCR added. No OCR SDK imported. No image processing. No Smart Talk/LLM/DB/runtime wiring. No user-visible output. TypeScript and ESLint pass cleanly.

---

### Phase 8.2F-15F — Pilot Telemetry Provenance Contract

**Input provenance hardening / technical debt resolution — no session store, no auth, no DB, no runtime wiring.**

Partially resolves **Debt 8** from the Phase 8.2F-15 Governance Lineage Integration Audit.

#### Problem

`LimitedPilotGateInput.telemetry` (`PilotSessionTelemetry`) carried `totalTransactionsThisSession`, `maxSessionLimit`, and `sequenceId` as raw caller-supplied fields with no provenance contract. A caller could under-report transactions or alter session limits to bypass pilot constraints.

#### Solution

A typed `PilotSessionReport` provenance contract was introduced:

| New type | Purpose |
|---|---|
| `PilotSessionReportSourceKind` | Origin classification: `synthetic_metadata`, `manual_test_fixture`, `future_session_store`, `imported_session_report` |
| `PilotSessionAttestationStatus` | Trust posture: `unattested`, `test_fixture_attested`, `future_store_attested` |
| `PilotSessionReport` | Structured report: `reportId`, `sourceKind`, `attestationStatus`, `totalTransactionsThisSession`, `maxSessionLimit`, `sequenceId`, `generatedBy`, `neverUserVisible: true` |
| `PilotSessionReportValidationResult` | Structural integrity check result: `{ valid, telemetryUsable, diagnostics, neverUserVisible }` |

| New function | Purpose |
|---|---|
| `validatePilotSessionReport` | Structural integrity checker: non-empty IDs, finite counts, cap at 10,000 transactions, attestation note |

`LimitedPilotGateInput` changes:
- `telemetry` made `optional` — backward compat retained; emits `pilot_session_telemetry_unattested` when used
- `sessionReport?: PilotSessionReport` added — preferred provenance path
- `pilot_session_telemetry_unattested` added to `PilotGateDiagnosticCode` — informational, emitted on raw-telemetry path or unattested reports
- `pilot_session_report_invalid` added to `PilotGateDiagnosticCode` — blocking, emitted when structural validation fails

#### Gate Logic Changes

Before the session limit gate, effective session telemetry is resolved:
1. If `sessionReport` present and valid → use its counts; if `"unattested"` → emit `pilot_session_telemetry_unattested`
2. If `sessionReport` present but structurally invalid → emit `pilot_session_report_invalid`, block
3. If only `telemetry` present → use it, emit `pilot_session_telemetry_unattested` (non-blocking)
4. If neither → emit `pilot_metadata_incomplete`, block

Session overflow rule unchanged: `totalTransactions >= maxLimit → pilot_session_limit_reached`.

#### Files modified

| File | Change |
|---|---|
| `reality-simulation/limited-pilot-gate-types.ts` | 4 new types; `telemetry` optional; `sessionReport` added; 2 new diagnostic codes |
| `reality-simulation/run-limited-pilot-gate-scaffold.ts` | `validatePilotSessionReport` added; `resolveSessionTelemetry` helper; gate logic updated; version `v3` |
| `reality-simulation/limited-pilot-gate-regression-scaffold.ts` | Cases 10–13 added; Case 1 updated; `makeInputWithSessionReport` helper; `BASE_SESSION_REPORT` fixture; version `v3` |
| `run-governance-lineage-audit-scaffold.ts` | Debt 8 → partially resolved; audit version `v7` |
| `GOVERNANCE_LINEAGE_INTEGRATION_AUDIT.md` | Debt 8 marked ⚠ PARTIALLY RESOLVED |

#### Remaining gap

`PilotSessionReport` is still caller-constructed metadata. Full resolution requires a future production phase that binds the report to a verified session store (database-backed or signed token). No auth, no DB, no real session tracking added.

**Remaining open debts:** Debt 5 (cross-phase namespace isolation), Debt 6 (bridge-level typing), Debt 9 (wording scores — partially resolved in 8.2F-15G), Debt 10 (`AuditTraceChain.structurallyValid`). Debts 7–8 partially resolved.

---

### Phase 8.2F-15H — AuditTraceChain.structurallyValid Consistency Fix

**Governance audit version:** `8.2f-15h-governance-lineage-audit-v9`
**Provenance audit scaffold version:** `8.2f-15h-provenance-audit-scaffold-v2`

**Technical Debt 10 — RESOLVED.** `AuditTraceChain.structurallyValid` was a caller-supplied boolean not consumed by `validateAuditTraceChain`, creating a potential dual-source-of-truth inconsistency (e.g. `chain.structurallyValid === true` while `validateAuditTraceChain` returns `valid === false`).

**Strategy chosen:** Full removal. `structurallyValid` is no longer a field on `AuditTraceChain`. `AuditTraceValidationResult.valid` (from `validateAuditTraceChain`) is the sole authoritative source of structural truth.

**Changes:**
- `provenance-audit-types.ts` — `structurallyValid` removed from `AuditTraceChain`; JSDoc updated.
- `run-provenance-audit-scaffold.ts` — header and version bumped to `v2`; no logic changed.
- `provenance-audit-regression-scaffold.ts` — `chain()` helper updated (parameter dropped); version bumped to `v2`; all 8 cases pass unchanged.
- `RUNTIME_PROVENANCE_AUDIT_TRACE.md` — spec updated.
- `run-governance-lineage-audit-scaffold.ts` — version `v9`; Debt 10 moved to `CONNECTED_LINEAGE_FINDINGS` as RESOLVED.
- `GOVERNANCE_LINEAGE_INTEGRATION_AUDIT.md` — Debt 10 marked RESOLVED.

**Safety:** No persistence, logging, telemetry, or runtime coupling. Smart Talk runtime not modified. Validator behavior semantically unchanged. TypeScript and ESLint pass.

**Remaining open debts:** Debt 5 (cross-phase namespace isolation), Debt 6 (bridge-level `BridgeBlockingReason` typed field). Debts 7–9 partially resolved.

---

### Phase 8.2F-15J — Cross-Phase Diagnostic Namespace Isolation

**Governance audit version:** `8.2f-15j-governance-lineage-audit-v11`

**Technical Debt 5 — PARTIALLY RESOLVED.** A typed namespace envelope foundation has been established to enable cross-phase audit correlation of diagnostic codes without merging source unions or changing any diagnostic generation behavior.

**New files (all in `lib/vaylo/smart-talk/reality-matrix/`):**

| File | Purpose |
|---|---|
| `diagnostic-namespace-types.ts` | Core types: `DiagnosticNamespaceLayer`, `DiagnosticSeverity`, `DiagnosticVisibility`, `DiagnosticNormalizedEnvelope`, `DiagnosticNamespaceValidationResult` |
| `diagnostic-namespace-registry.ts` | `KNOWN_DIAGNOSTIC_NAMESPACE_LAYERS`, `makeDiagnosticEnvelope()` factory, `validateDiagnosticNamespaceEnvelopes()` validator, `DIAGNOSTIC_NAMESPACE_SAMPLE_REGISTRY` (26 representative envelopes) |
| `diagnostic-namespace-regression-scaffold.ts` | 8-case regression scaffold (`runDiagnosticNamespaceRegressionScaffold`) |

**`DiagnosticNamespaceLayer` values (13):** `mapper_free_preview`, `mapper_paid_explanation`, `bridge`, `wording_review`, `wording_evaluation`, `ocr_uncertainty`, `pilot_gate`, `incident_governance`, `provenance_audit`, `corpus_validation`, `contract_validation`, `governance_lineage_audit`, `unknown`.

**`DiagnosticNormalizedEnvelope`** wraps any raw diagnostic code with: `layer`, `code`, `severity` (informational/warning/blocking/critical), `visibility` (never_user_visible/internal_audit_only), optional `phase`/`sourceVersion`, and `neverUserVisible: true`.

**Validation rules:** non-empty `code` (hard failure → `valid=false`), `neverUserVisible === true` (hard failure), `layer === "unknown"` (soft warning → `fullyConsistent=false`), duplicate `${layer}:${code}:${phase}` keys (soft warning → `fullyConsistent=false`).

**What did NOT change:** Source modules (mappers, bridge, pilot gate, incident governance, provenance audit) retain their own typed diagnostic unions and emit diagnostics exactly as before. No diagnostic codes were renamed, removed, or merged. No runtime behavior was changed. No persistence, telemetry, or logging was added.

**Remaining future work:** Source emission sites adopting `makeDiagnosticEnvelope()` directly so normalized envelopes are produced at runtime (rather than authored in a static sample registry). This is a separate future consolidation phase.

**Remaining open debts:** Debt 5 partially resolved (namespace envelope foundation established; source emission migration is future work). Debts 7–9 partially resolved.

---

### Phase 8.2F-15I — Bridge Blocking Reason Typed Field

**Governance audit version:** `8.2f-15i-governance-lineage-audit-v10`
**Bridge version:** `8.2f-15i-smart-talk-bridge-dry-run-v2`

**Technical Debt 6 — RESOLVED.** `SmartTalkBridgeDryRunResult` now includes `blockingReasons: readonly BridgeBlockingReason[]` — a typed, deduplicated list of structured failure codes that classifies exactly which bridge-level check failed, without requiring `diagnostics` array inspection.

**`BridgeBlockingReason` variants:** `section_invariant_violation`, `diagnostic_visibility_violation`, `free_preview_paid_section_leakage`, `paid_free_only_section_leakage`, `forbidden_move_not_preserved`, `required_constraint_not_preserved`, `invalid_access_tier`, `missing_governance_metadata`.

**Changes:**
- `explanation-mapper-types.ts` — `BridgeBlockingReason` type added; `SmartTalkBridgeDryRunResult.blockingReasons` added; header updated.
- `run-smart-talk-bridge-dry-run.ts` — All 7 structural/governance checks emit typed blocking reasons via `Set<BridgeBlockingReason>`; `bridge_contract_tier_mismatch` explicitly excluded (observability-only); version bumped to `v2`.
- `smart-talk-bridge-dry-run-regression.ts` — All 8 cases assert `blockingReasons.length === 0`; Case 8 asserts `blockingReasons` empty when only tier-mismatch fires; version bumped to `v3`.
- `run-governance-lineage-audit-scaffold.ts` — version `v10`; Debt 6 changed from WARNING to RESOLVED.
- `GOVERNANCE_LINEAGE_INTEGRATION_AUDIT.md` — Debt 6 marked RESOLVED.

**`governancePreserved` semantics:** Unchanged. `blockingReasons` is additive audit metadata only.

**`bridge_contract_tier_mismatch` (Phase 8.2F-6A):** Intentionally not a `BridgeBlockingReason`. It remains observability-only — does not affect `governancePreserved`, `structurallyValid`, or `blockingReasons`.

**Safety:** No persistence, logging, telemetry, or runtime coupling. Smart Talk runtime not modified. No routing behavior changed. TypeScript and ESLint pass.

**Remaining open debts:** Debt 5 (cross-phase diagnostic namespace isolation). Debts 7–9 partially resolved.

**Safety boundary:** No session store added. No database reads. No auth SDK imported. No real pilot activation. No real session tracking. No LLM. No Smart Talk runtime wiring. No user-visible output. TypeScript and ESLint pass cleanly.

---

### Phase 8.2F-15G — Wording Score Provenance Contract

**Input provenance hardening / technical debt resolution — no LLM judge, no NLP, no real text evaluation, no runtime wiring.**

Partially resolves **Debt 9** from the Phase 8.2F-15 Governance Lineage Integration Audit.

#### Problem

`WordingEvaluationInput.toneMatrix` was a bare caller-supplied struct with no provenance contract. A caller could suppress any risk score or inflate `empatheticClarity` to bypass the wording safety gate.

#### Solution

A typed `WordingToneScoreReport` provenance contract was introduced:

| New type | Purpose |
|---|---|
| `WordingToneScoreReportSourceKind` | Origin classification: `synthetic_metadata`, `manual_review_metadata`, `future_llm_judge_metadata`, `imported_score_report` |
| `WordingToneScoreAttestationStatus` | Trust posture: `unattested`, `test_fixture_attested`, `manual_review_attested`, `future_judge_attested` |
| `WordingToneScoreReport` | Structured report: `reportId`, `sourceKind`, `attestationStatus`, `toneMatrix`, `evaluatorId`, `evaluatorVersion`, `generatedBy`, `neverUserVisible: true` |
| `WordingToneScoreReportValidationResult` | `{ valid, scoreUsable, diagnostics, neverUserVisible }` |

| New function | Purpose |
|---|---|
| `validateWordingToneScoreReport` | Structural integrity checker: non-empty IDs, finite scores, clamp/unattested notes |
| `evaluateExplanationWordingFromScoreReport` | Preferred provenance-backed entry point; validates report, delegates to existing evaluator |

`evaluateExplanationWordingFromScoreReport` behavior:
- Non-finite scores → `human_review_required` (core evaluator not called)
- `"unattested"` → evaluate normally + provenance note appended
- Otherwise → delegate to `evaluateExplanationWordingScaffold`; all rules unchanged

Raw `WordingEvaluationInput` (toneMatrix) path **retained unchanged** for backward compatibility; documented as unauthenticated.

#### Files modified

| File | Change |
|---|---|
| `reality-simulation/wording-evaluation-types.ts` | 4 new types; `WordingEvaluationInput` doc note added |
| `reality-simulation/run-wording-evaluation-scaffold.ts` | `validateWordingToneScoreReport` added; `evaluateExplanationWordingFromScoreReport` added; version `v2` |
| `reality-simulation/wording-evaluation-regression-scaffold.ts` | Cases 9–13 added; `BASE_SCORE_REPORT` fixture; version `v2` |
| `run-governance-lineage-audit-scaffold.ts` | Debt 9 → partially resolved; audit version `v8` |
| `GOVERNANCE_LINEAGE_INTEGRATION_AUDIT.md` | Debt 9 marked ⚠ PARTIALLY RESOLVED |

#### Remaining gap

`WordingToneScoreReport` is still caller-constructed metadata. Full resolution requires a future production phase that binds the report to a verified evaluator (LLM judge or attested human reviewer system).

**Remaining open debts:** Debt 5 (cross-phase namespace isolation), Debt 6 (bridge-level typing), Debt 10 (`AuditTraceChain.structurallyValid`). Debts 7–9 partially resolved.

**Safety boundary:** No LLM judge added. No NLP. No real text evaluated. No prose generated. No OpenAI/Gemini calls. No Smart Talk runtime wiring. No DB writes. No user-visible output. TypeScript and ESLint pass cleanly.

---

### Phase 8.2F-15K — OCR Confidence Full Attestation Store Contract

**Debt addressed:** Debt 7 (upgraded from 8.2F-15E partial resolution)
**Audit version:** `v12`

Defines the full OCR quality attestation store contract as a metadata-only scaffold. Phase 8.2F-15E introduced `OcrQualityReport`; 8.2F-15K adds the trust-tier model that governs how a report would be verified, stored, and trusted in a future production deployment.

#### New types (`ocr-quality-attestation-types.ts`)

- `OcrQualityReportIssuerKind` — 5 values: `synthetic_fixture`, `manual_reviewer`, `future_ocr_engine`, `imported_external_report`, `unknown`
- `OcrQualityReportStoreKind` — 5 values: `in_memory_test_fixture`, `future_database_record`, `future_object_storage_metadata`, `imported_static_fixture`, `none`
- `OcrQualityAttestationMethod` — 5 values: `none`, `fixture_declared`, `manual_review_declared`, `future_engine_signed`, `future_store_verified`
- `OcrQualityReportLifecycleStatus` — 5 values: `draft`, `validated`, `rejected`, `expired`, `superseded`
- `OcrQualityAttestationVerificationStatus` — 4 values: `verified`, `unverifiable`, `failed`, `not_applicable`
- `OcrQualityAttestationRecord` — structured attestation record binding a report to its trust provenance
- `OcrQualityAttestationValidationDiagnostic` — 10 typed diagnostic codes
- `OcrQualityAttestationValidationResult` — contains `valid`, `trustedForPilot`, `trustedForProduction`, `diagnostics`, `neverUserVisible`

#### Trust tiers

| Tier | Condition |
|---|---|
| `trustedForPilot` | `valid` + `lifecycleStatus === "validated"` + verification is `"verified"` or `"not_applicable"` |
| `trustedForProduction` | Pilot trust + `verificationStatus === "verified"` + `storeKind !== "none"` + `issuerKind !== "unknown"` |

Synthetic fixtures (`fixture_declared` + `not_applicable`) are pilot-trusted but never production-trusted. Future engine attestations with real store references can be production-trusted structurally.

#### Files created

| File | Description |
|---|---|
| `reality-simulation/ocr-quality-attestation-types.ts` | All 8 types and enums |
| `reality-simulation/validate-ocr-quality-attestation.ts` | 12-rule pure validator |
| `reality-simulation/ocr-quality-attestation-regression-scaffold.ts` | 10-case regression scaffold |

#### Files modified

| File | Change |
|---|---|
| `reality-simulation/index.ts` | New exports added |
| `run-governance-lineage-audit-scaffold.ts` | Debt 7 upgraded; audit version `v12` |
| `GOVERNANCE_LINEAGE_INTEGRATION_AUDIT.md` | Debt 7 section expanded |

**Remaining gap:** No real OCR engine connected. No DB or store writes. No persistence. No runtime coupling. Full production trust requires a future phase binding attestation to a verified OCR provider and real attestation store.

**Safety boundary:** No OCR SDK imported. No images processed. No DB writes. No persistence. No telemetry. No logging. No Smart Talk wiring. No LLM called. `evaluate-ocr-uncertainty.ts` and `run-limited-pilot-gate-scaffold.ts` unchanged.

**Remaining open debts:** Debt 5 (cross-phase namespace isolation), Debt 10 (`AuditTraceChain` provenance recording at emission sites). Debts 6–9 resolved or partially resolved.

---

### Phase 8.2F-15L — Pilot Session Attestation Store Contract

**Debt addressed:** Debt 8 (upgraded from 8.2F-15F partial resolution)
**Audit version:** `v13`

Defines the full pilot session attestation store contract as a metadata-only scaffold. Phase 8.2F-15F introduced `PilotSessionReport`; 8.2F-15L adds the trust-tier model that governs how a session report would be verified, stored, and trusted in a future production deployment.

#### New types (`pilot-session-attestation-types.ts`)

- `PilotSessionReportIssuerKind` — 6 values including `future_session_store` and `future_auth_gateway`
- `PilotSessionReportStoreKind` — 5 values including `future_database_record` and `future_session_store_record`
- `PilotSessionAttestationMethod` — 5 values including `future_store_verified` and `future_auth_signed`
- `PilotSessionReportLifecycleStatus` — 5 values: `draft`, `validated`, `rejected`, `expired`, `superseded`
- `PilotSessionAttestationVerificationStatus` — 4 values: `verified`, `unverifiable`, `failed`, `not_applicable`
- `PilotSessionAttestationRecord` — structured attestation record binding a session report to its trust provenance
- `PilotSessionAttestationValidationDiagnostic` — 11 typed diagnostic codes
- `PilotSessionAttestationValidationResult` — contains `valid`, `trustedForPilot`, `trustedForProduction`, `diagnostics`, `neverUserVisible`

#### Trust tiers

| Tier | Condition |
|---|---|
| `trustedForPilot` | `valid` + `lifecycleStatus === "validated"` + verification is `"verified"` or `"not_applicable"` |
| `trustedForProduction` | Pilot trust + `verificationStatus === "verified"` + `storeKind !== "none"` + `issuerKind !== "unknown"` |

Synthetic fixtures are pilot-trusted but never production-trusted. Future session store / auth gateway attestations with real store references can be production-trusted structurally.

#### Files created

| File | Description |
|---|---|
| `reality-simulation/pilot-session-attestation-types.ts` | All 8 types and enums |
| `reality-simulation/validate-pilot-session-attestation.ts` | 12-rule pure validator |
| `reality-simulation/pilot-session-attestation-regression-scaffold.ts` | 10-case regression scaffold |

#### Files modified

| File | Change |
|---|---|
| `reality-simulation/index.ts` | New exports added |
| `run-governance-lineage-audit-scaffold.ts` | Debt 8 upgraded; audit version `v13` |
| `GOVERNANCE_LINEAGE_INTEGRATION_AUDIT.md` | Debt 8 section expanded |

**Remaining gap:** No real auth or session store connected. No DB or store writes. No persistence. No runtime coupling. No pilot activation. Full production trust requires a future phase binding attestation to a verified session store or auth gateway.

**Safety boundary:** No auth SDK imported. No session state accessed. No DB writes. No persistence. No telemetry. No logging. No Smart Talk wiring. No LLM called. No pilot access activated. `run-limited-pilot-gate-scaffold.ts` unchanged.

**Remaining open debts:** Debt 5 (cross-phase namespace isolation), Debt 10 (`AuditTraceChain` provenance recording at emission sites). Debts 6–9 resolved or partially resolved (upgraded).

---

### Phase 8.2F-15M — Wording Judge Attestation Contract

**Debt addressed:** Debt 9 (upgraded from 8.2F-15G partial resolution)
**Audit version:** `v14`

Defines the full wording judge attestation store contract as a metadata-only scaffold. Phase 8.2F-15G introduced `WordingToneScoreReport`; 8.2F-15M adds the trust-tier model that governs how a wording score report would be verified, stored, and trusted in a future production deployment.

#### New types (`wording-judge-attestation-types.ts`)

- `WordingJudgeIssuerKind` — 6 values including `future_llm_judge` and `future_human_review_system`
- `WordingScoreReportStoreKind` — 5 values including `future_review_store_record`
- `WordingJudgeAttestationMethod` — 5 values including `future_judge_signed` and `future_store_verified`
- `WordingScoreReportLifecycleStatus` — 5 values: `draft`, `validated`, `rejected`, `expired`, `superseded`
- `WordingJudgeVerificationStatus` — 4 values: `verified`, `unverifiable`, `failed`, `not_applicable`
- `WordingJudgeAttestationRecord` — structured attestation record binding a wording score report to its trust provenance
- `WordingJudgeAttestationValidationDiagnostic` — 11 typed diagnostic codes
- `WordingJudgeAttestationValidationResult` — contains `valid`, `trustedForPilot`, `trustedForProduction`, `diagnostics`, `neverUserVisible`

#### Trust tiers

| Tier | Condition |
|---|---|
| `trustedForPilot` | `valid` + `lifecycleStatus === "validated"` + verification is `"verified"` or `"not_applicable"` |
| `trustedForProduction` | Pilot trust + `verificationStatus === "verified"` + `storeKind !== "none"` + `issuerKind !== "unknown"` |

Both `manual_reviewer` and `future_llm_judge` can achieve production trust when paired with a real store. Synthetic fixtures are pilot-trusted but never production-trusted.

#### Files created

| File | Description |
|---|---|
| `reality-simulation/wording-judge-attestation-types.ts` | All 8 types and enums |
| `reality-simulation/validate-wording-judge-attestation.ts` | 12-rule pure validator |
| `reality-simulation/wording-judge-attestation-regression-scaffold.ts` | 11-case regression scaffold |

#### Files modified

| File | Change |
|---|---|
| `reality-simulation/index.ts` | New exports added |
| `run-governance-lineage-audit-scaffold.ts` | Debt 9 upgraded; audit version `v14` |
| `GOVERNANCE_LINEAGE_INTEGRATION_AUDIT.md` | Debt 9 section expanded |

**Debt 9 tracking:** Debt 9 is explicitly retained in `WARNING_FINDINGS` (severity `informational`, partially resolved). The misleading "moved to CONNECTED_LINEAGE_FINDINGS" comment in prior phases has been corrected to accurately reflect that Debt 9 remains partially open.

**Remaining gap:** No real LLM judge or human review system connected. No DB or store writes. No real text evaluated. No user-visible wording generated. Full production trust requires a future phase binding attestation to a verified evaluator and a real score store.

**Safety boundary:** No LLM SDK imported. No NLP executed. No real text evaluated. No user-visible output generated. No DB writes. No persistence. No telemetry. No Smart Talk wiring. `run-wording-evaluation-scaffold.ts` unchanged.

**Remaining open debts:** Debt 5 (cross-phase namespace isolation). Provenance recording gap partially resolved in 8.2F-15N (emission contract exists; runtime wiring is future work). Debts 6–9 resolved or partially resolved (all upgraded through 8.2F-15M).

---

### Phase 8.2F-15N — Audit Trace Emission Contract

**Mission:** Introduce a typed emission contract for audit trace records, bridging governance layer decisions to `AuditTraceNode` in an `AuditTraceChain`. This addresses the provenance recording gap where `AuditTraceNode` vocabulary existed but no governance layer had a typed contract for producing emission records.

#### New types (`AuditTraceEmissionLayer`, `AuditTraceEmissionKind`, `AuditTraceEmissionSeverity`, `AuditTraceEmissionRecord`, `AuditTraceEmissionValidationDiagnostic`, `AuditTraceEmissionValidationResult`)

- `AuditTraceEmissionLayer` — 14 values covering all governance layers (OCR through diagnostic_namespace)
- `AuditTraceEmissionKind` — 12 values covering all structural governance decision types
- `AuditTraceEmissionSeverity` — 4 values: `informational`, `warning`, `blocking`, `critical`
- `AuditTraceEmissionRecord` — the typed emission record with 11 fields including `neverUserVisible: true` and optional reference fields
- `AuditTraceEmissionValidationDiagnostic` — 6 codes (3 hard failures, 3 soft)
- `AuditTraceEmissionValidationResult` — contains `valid`, `fullyConsistent`, `diagnostics`, `neverUserVisible`

#### Validator (`validateAuditTraceEmission`)

8 structural rules: 3 hard failures (blank `emissionId`, blank `parentTraceId`, `neverUserVisible !== true`) and 3 soft diagnostics (unknown layer, duplicate parent IDs, missing reference for blocking/critical). Pure function; no side effects.

#### AuditTraceNode adapter (`buildAuditTraceNodeFromEmission`)

Explicit layer → `ProvenanceSourceKind` mapping (14 cases) and emissionKind → `AuditDecisionKind` mapping (12 cases). No string inference. Conservative mappings: `bridge` → `"mapper"`, `diagnostic_namespace` → `"unknown"` (documented in both function and converted node notes).

#### AuditTraceChain integration

Case 10 of the regression scaffold proves the full pipeline: 3 emissions built → converted to `AuditTraceNode[]` → assembled into `AuditTraceChain` → validated with `validateAuditTraceChain` → `valid = true` confirmed.

#### Files created

| File | Description |
|---|---|
| `reality-simulation/audit-trace-emission-types.ts` | All 6 types/unions |
| `reality-simulation/build-audit-trace-emission.ts` | Validator + AuditTraceNode adapter |
| `reality-simulation/audit-trace-emission-regression-scaffold.ts` | 10-case regression (incl. chain integration) |

#### Files modified

| File | Change |
|---|---|
| `reality-simulation/index.ts` | New exports added |
| `run-governance-lineage-audit-scaffold.ts` | Provenance recording gap upgraded; audit version `v15` |
| `GOVERNANCE_LINEAGE_INTEGRATION_AUDIT.md` | Provenance recording section updated |

**Provenance recording tracking:** The `WARNING` finding for "trace vocabulary not attached to any live runtime event" has been upgraded to `informational` / partially resolved. Remaining gap: no production governance layer emits `AuditTraceEmissionRecord` at runtime; no audit trace store or persistence layer exists.

**Safety boundary:** No runtime emission wired. No persistence added. No telemetry SDK imported. No runtime hooks. No Smart Talk production connection. No OCR SDK or LLM calls. No mapper, bridge, pilot gate, or incident governance behavior changed. All result types carry `neverUserVisible: true`.

---

### Phase 8.2F-15O — Diagnostic Envelope Adapter / Emission Contract

**Mission:** Continue Debt 5 hardening from Phase 8.2F-15J. Phase 8.2F-15J introduced the `DiagnosticNormalizedEnvelope` namespace model. This phase introduces the native diagnostic **adapter contract** — so any caller can convert a native governance diagnostic into a normalized envelope without touching the source emission sites.

#### New types (`DiagnosticEnvelopeSourceKind`, `DiagnosticEnvelopeAdapterInput`, `DiagnosticEnvelopeAdapterDiagnostic`, `DiagnosticEnvelopeAdapterResult`)

- `DiagnosticEnvelopeSourceKind` — 13 values with `native_` prefix (one per source module) plus `"unknown"`. Maps 1-to-1 with `DiagnosticNamespaceLayer` via explicit switch.
- `DiagnosticEnvelopeAdapterInput` — 7 fields: `sourceKind`, `code`, `severity?`, `phase?`, `sourceVersion?`, `notes?`, `neverUserVisible: true`
- `DiagnosticEnvelopeAdapterDiagnostic` — 5 codes: `diagnostic_adapter_empty_code` (hard), `diagnostic_adapter_user_visible_violation` (hard), `diagnostic_adapter_unknown_source` (soft), `diagnostic_adapter_default_severity_used` (soft), `diagnostic_adapter_layer_mapping_fallback` (soft)
- `DiagnosticEnvelopeAdapterResult` — `envelope`, `adapted`, `diagnostics`, `neverUserVisible`

#### Adapter functions (`build-diagnostic-envelope-adapter.ts`)

**Single adapter:** `buildDiagnosticEnvelopeFromNativeDiagnostic(input)` — maps `sourceKind` → layer via explicit 13-case switch; applies hard/soft rules; always returns an envelope (best-effort even on failure).

**Batch adapter:** `buildDiagnosticEnvelopesFromNativeDiagnostics(inputs)` — processes all inputs, aggregates envelopes, computes `allAdapted`.

#### Source kind → DiagnosticNamespaceLayer mapping (all 13 cases, no string inference)

| `DiagnosticEnvelopeSourceKind` | `DiagnosticNamespaceLayer` |
|---|---|
| `native_mapper_free_preview` | `mapper_free_preview` |
| `native_mapper_paid_explanation` | `mapper_paid_explanation` |
| `native_bridge` | `bridge` |
| `native_wording_review` | `wording_review` |
| `native_wording_evaluation` | `wording_evaluation` |
| `native_ocr_uncertainty` | `ocr_uncertainty` |
| `native_pilot_gate` | `pilot_gate` |
| `native_incident_governance` | `incident_governance` |
| `native_provenance_audit` | `provenance_audit` |
| `native_corpus_validation` | `corpus_validation` |
| `native_contract_validation` | `contract_validation` |
| `native_governance_lineage_audit` | `governance_lineage_audit` |
| `unknown` | `unknown` |

#### Regression scaffold (12 cases, `diagnostic-envelope-adapter-regression-scaffold.ts`)

| Case | Scenario | `adapted` |
|---|---|---|
| 1 | Free preview mapper diagnostic → `mapper_free_preview` | `true` |
| 2 | Paid mapper diagnostic → `mapper_paid_explanation` | `true` |
| 3 | Bridge diagnostic → `bridge` (+ default severity diagnostic) | `true` |
| 4 | OCR diagnostic → `ocr_uncertainty` | `true` |
| 5 | Pilot gate diagnostic → `pilot_gate` | `true` |
| 6 | Incident governance diagnostic → `incident_governance` | `true` |
| 7 | Unknown source → `unknown` + `diagnostic_adapter_unknown_source` | `true` |
| 8 | Blank code → `adapted = false` + `diagnostic_adapter_empty_code` | `false` |
| 9 | `neverUserVisible = false` via cast → `adapted = false` | `false` |
| 10 | Batch with all valid inputs → `allAdapted = true` | — |
| 11 | Batch with one invalid input → `allAdapted = false` | — |
| 12 | Adapted envelopes pass `validateDiagnosticNamespaceEnvelopes` | `valid = true` |

#### Files created

| File | Description |
|---|---|
| `diagnostic-envelope-adapter-types.ts` | All 4 types/unions |
| `build-diagnostic-envelope-adapter.ts` | Single + batch adapter functions |
| `diagnostic-envelope-adapter-regression-scaffold.ts` | 12-case regression scaffold |

#### Files modified

| File | Change |
|---|---|
| `run-governance-lineage-audit-scaffold.ts` | Debt 5 finding upgraded; audit version `v16` |
| `GOVERNANCE_LINEAGE_INTEGRATION_AUDIT.md` | Debt 5 section expanded; version `v16` |

**Backward compatibility:** All native diagnostic unions (`FreePreviewMapperDiagnosticCode`, `BridgeDiagnosticCode`, etc.) are unchanged. No codes renamed or removed. Source modules emit diagnostics exactly as before. The adapter is additive audit infrastructure only.

**Migration status:** Source emission sites do not yet call the adapter at runtime. This is future work. The adapter is available but not wired.

**Safety boundary:** No source modules modified. No diagnostic codes renamed or removed. No runtime coupling added. No persistence, telemetry, or logging. No mapper, bridge, pilot gate, or incident governance behavior changed. All result types carry `neverUserVisible: true`.

---

### Phase 8.2F-16 — Governance Kernel Closure Audit

**Mission:** Perform the final closure audit for the Vaylo Smart Talk Governance Kernel (phases 8.2A → 8.2F-15O) and formally end Epoch 8.2F.

#### Closure verdict

> **`complete_for_runtime_integration`**

The governance kernel defines, validates, and documents the complete set of safety constraints, forbidden moves, required constraints, uncertainty handling, wording governance, audit provenance, attestation contracts, and cross-phase diagnostic infrastructure required to safely integrate a real LLM into the Smart Talk explanation pipeline.

**Epoch 8.2F (Governance Kernel) is closed.**  
**Next epoch: Epoch 8.2G — Runtime LLM Integration.**

#### What this means

All 20 governance layers have typed contracts, pure validators, regression scaffolds, and classified technical debts. All 10 tracked debts are resolved, partially resolved, or formally accepted as runtime debts belonging to Epoch 8.2G.

#### What this does NOT mean

- Not production-ready (no prose generation, no end-to-end pipeline, no real documents)
- Not pilot-ready for real users (no wording certification gate, no auth, no real corpus)
- Not audit-persisted (no AuditTraceNode storage, no compliance trail)
- Not LLM-integrated (no real LLM calls)
- Not OCR-integrated (no photo/PDF ingestion)

#### Files created

| File | Description |
|---|---|
| `governance-kernel-closure-types.ts` | `GovernanceKernelClosureStatus`, `GovernanceKernelLayerReadiness`, `GovernanceKernelClosureFinding`, `GovernanceKernelClosureAuditResult` |
| `run-governance-kernel-closure-audit-scaffold.ts` | `runGovernanceKernelClosureAuditScaffold()` — static pre-authored inventory for all 20 layers |
| `GOVERNANCE_KERNEL_CLOSURE_AUDIT.md` | Full closure document: executive verdict, layer inventory, resolved debts, accepted runtime debts, production blockers, pilot blockers, next epoch scope, non-negotiable invariants |

#### Layer readiness summary (all 20 layers)

| Status | Count | Layers |
|---|---|---|
| Complete | 19 | All except redacted_corpus |
| Partially complete | 1 | `redacted_corpus` (synthetic only; not yet consumed end-to-end) |
| Blocked | 0 | — |

#### Non-negotiable invariants preserved into Epoch 8.2G

No unsupported deadline calculation · No unsupported enforcement claim · No false reassurance · No calculated amount extraction from uncertain input · No dry-run-as-fact · No speculation-as-fact · No cross-lane merging · No panic amplification · No legal verdict posture · All user-visible wording must pass wording governance · High-risk output must support human review path · Audit metadata remains `neverUserVisible`

#### Safety boundary

No runtime behavior changed. No new governance machinery wired. No persistence, telemetry, or logging. No user-visible output. All result types carry `neverUserVisible: true`. This phase is documentation and static type model only.

---

### Phase 8.2G-0 — Runtime LLM Integration Architecture Plan

**Epoch 8.2G opened.** Epoch 8.2F (Governance Kernel) was formally closed as `complete_for_runtime_integration` in Phase 8.2F-16. This phase opens Epoch 8.2G by defining the architecture for connecting a future LLM to the governance kernel.

**No LLM is called. No runtime behavior is changed. No user-visible output is created.**

#### Verdict

> Architecture is `defined`. `liveLLMAllowed: false`. `userVisibleOutputAllowed: false`. `nextRecommendedPhase: "8.2G-1"`.

#### What was defined

- **15-layer runtime pipeline** — the ordered sequence every LLM-generated draft must traverse: `input_normalization` → `document_reality_simulation` → `explanation_contract_builder` → `llm_draft_adapter` → `llm_output_contract_validator` → mapper → bridge → `wording_evaluation_gate` → `wording_review_gate` → `diagnostic_envelope_adapter` → `audit_trace_emission` → `incident_governance` → `pilot_gate` → `user_visible_response_assembler`
- **LLM adapter boundary** — what may enter the LLM (governance-constrained prompts) and what may not (raw OCR text, PII, deadline extraction instructions)
- **LLM output restrictions** — 10 explicit rules the output contract validator will enforce
- **Non-negotiable invariants** — 13 constitutional invariants the LLM must never violate
- **Recommended 8.2G phase sequence** — 8.2G-1 through 8.2G-8

#### Files created

| File | Description |
|---|---|
| `runtime-llm-integration-plan-types.ts` | `RuntimeLLMIntegrationReadiness`, `RuntimeLLMIntegrationLayerId`, `RuntimeLLMIntegrationRiskLevel`, `RuntimeLLMIntegrationFinding`, `RuntimeLLMIntegrationPlanResult` |
| `run-runtime-llm-integration-plan-scaffold.ts` | `runRuntimeLLMIntegrationPlanScaffold()` — static plan with 15-layer sequence and per-layer findings |
| `RUNTIME_LLM_INTEGRATION_ARCHITECTURE.md` | Full architecture document (20 sections) |

#### Recommended 8.2G phase sequence

| Phase | Name |
|---|---|
| **8.2G-1** | Runtime LLM Draft Adapter Types + Mock Scaffold |
| **8.2G-2** | LLM Output Contract Validator |
| **8.2G-3** | Wording Governance Runtime Gate |
| **8.2G-4** | Audit Trace + Diagnostic Envelope Runtime Dry Run |
| **8.2G-5** | First Live LLM Sandboxed Corpus Call |
| **8.2G-6** | User-Visible Response Assembler Scaffold |
| **8.2G-7** | End-to-End Synthetic Runtime Harness |
| **8.2G-8** | Trusted Internal Text-Only Pilot Gate |

**Next phase: 8.2G-1** ✓ completed — see below.

**Safety boundary:** No LLM called. No OCR called. No API routes modified. No runtime state changed. No user-visible output. All result types carry `neverUserVisible: true`.

---

### Phase 8.2G-1 — Runtime LLM Draft Adapter Types + Mock Scaffold

**First typed LLM draft adapter boundary.** Defines the governance-constrained typed interface between the explanation contract layer and a future LLM, as a mock-only scaffold. No live LLM is called. No user-visible output is produced.

**No LLM is called. No API keys. No environment variables. No runtime wiring.**

#### Verdict

> Adapter is `mock_only`. `liveLLMCalled: false`. `userVisibleOutputAllowed: false`. `nextRecommendedPhase: "8.2G-2"`.

#### What was defined

- **`RuntimeLLMDraftAdapterInput`** — governance-constrained adapter input: adapter mode, access tier, contract ref, allowed section types, active forbidden moves, required constraints, uncertainty/review flags, audit trace parent IDs.
- **`RuntimeLLMDraftSectionCandidate`** — a single typed draft section candidate. Never user-visible. Carries `safetyFlags`, `sourceBound`, and `neverUserVisible: true`.
- **`RuntimeLLMDraftAdapterResult`** — full adapter result. `liveLLMCalled: false` and `userVisibleOutputAllowed: false` are compile-time literal types.
- **`RuntimeLLMDraftAdapterDiagnosticCode`** — 8 governance diagnostic codes emitted by the adapter.
- **`runRuntimeLLMDraftMockAdapter(input)`** — pure deterministic mock returning fixture candidates for `allowedSectionTypes` only. Blocks `future_live_llm` mode with `llm_adapter_live_llm_forbidden`. Propagates all governance metadata.
- **10-case regression scaffold** — validates all invariants: live LLM blocking, section filtering, forbidden move propagation, constraint propagation, `neverUserVisible` enforcement, blank contract ref, audit trace ID preservation, and unsafe fixture flag behavior.

#### Files created

| File | Description |
|---|---|
| `runtime-llm-draft-adapter-types.ts` | All types for Phase 8.2G-1 |
| `run-runtime-llm-draft-mock-adapter.ts` | Mock adapter: `runRuntimeLLMDraftMockAdapter()` |
| `runtime-llm-draft-adapter-regression-scaffold.ts` | 10-case regression scaffold |
| `RUNTIME_LLM_DRAFT_ADAPTER.md` | Full adapter governance document |

#### Key invariants enforced

- `liveLLMCalled: false` — literal type, cannot be set to `true` in this phase.
- `userVisibleOutputAllowed: false` — literal type, cannot be set to `true` in this phase.
- All `RuntimeLLMDraftSectionCandidate` instances carry `neverUserVisible: true`.
- All `draftText` values are prefixed with `[MOCK_DRAFT_NEVER_USER_VISIBLE]`.
- `future_live_llm` mode is explicitly blocked — returns empty candidates with `llm_adapter_live_llm_forbidden`.
- No LLM SDK imported. No API keys. No env vars. No external calls. No randomness.

**Next phase: 8.2G-2 — LLM Output Contract Validator** ✓ completed — see below.

**Safety boundary:** No LLM called. No API keys. No env vars. No Smart Talk runtime touched. No user-visible output. No final explanation text generated.

---

### Phase 8.2G-2 — LLM Output Contract Validator

**First safety gate after the LLM draft adapter.** Validates that a `RuntimeLLMDraftAdapterResult` (Phase 8.2G-1) respects all governance boundaries before it can proceed to the wording governance gate (Phase 8.2G-3).

**No LLM is called. No user-visible output. No runtime wiring.**

#### Verdict

> Validator is `defined`. `liveLLMCalled: false`. `userVisibleOutputAllowed: false`. `acceptedForUserVisibleAssembly: false`. `nextRecommendedPhase: "8.2G-3"`.

#### What was defined

- **`RuntimeLLMOutputContractVerdict`** — 4 verdicts: `accepted_for_next_gate`, `rejected_contract_violation`, `rejected_unsafe_draft`, `rejected_visibility_violation`.
- **`RuntimeLLMOutputContractViolationCode`** — 14 violation codes covering visibility, safety flags, contract gaps, adapter mode, and mock prefix rules.
- **`RuntimeLLMOutputSectionValidationResult`** — per-section validation result with `accepted`, `violations`, and `neverUserVisible: true`.
- **`RuntimeLLMOutputContractValidationResult`** — full result. `acceptedForUserVisibleAssembly: false`, `liveLLMCalled: false`, and `userVisibleOutputAllowed: false` are compile-time literal types.
- **`validateRuntimeLLMOutputContract({ input, result })`** — pure validator enforcing 12+ rules with clear verdict precedence: visibility > unsafe > contract > accepted.
- **14-case regression scaffold** — covers happy paths, all violation types, tampered invariants, unsafe fixture path, forbidden adapter mode, coverage gaps, prefix checks.

#### Verdict precedence

```
rejected_visibility_violation  (neverUserVisible / liveLLMCalled / userVisibleOutputAllowed)
  ↓ rejected_unsafe_draft       (safety flags on sections)
  ↓ rejected_contract_violation  (adapter mode, section types, coverage, prefix, empty text)
  ↓ accepted_for_next_gate
```

#### Files created

| File | Description |
|---|---|
| `runtime-llm-output-contract-validator-types.ts` | All types for Phase 8.2G-2 |
| `validate-runtime-llm-output-contract.ts` | `validateRuntimeLLMOutputContract()` |
| `runtime-llm-output-contract-validator-regression-scaffold.ts` | 14-case regression scaffold |
| `RUNTIME_LLM_OUTPUT_CONTRACT_VALIDATOR.md` | Full validator governance document |

#### Key invariants enforced

- `acceptedForUserVisibleAssembly: false` — literal type, always false in Phase 8.2G-2.
- Defensive runtime checks on `liveLLMCalled`, `userVisibleOutputAllowed`, `neverUserVisible` — catches tampered/cast values.
- `future_live_llm` adapter mode explicitly rejected via `llm_output_forbidden_adapter_mode`.
- All sections validated for type membership, safety flags, and mock prefix.
- Forbidden move and required constraint coverage verified by intersection.

**Next phase: 8.2G-3 — Wording Governance Runtime Gate** ✓ completed — see below.

**Safety boundary:** No LLM called. No API keys. No env vars. No mock adapter modified. No user-visible output. `acceptedForUserVisibleAssembly` always false.

---

### Phase 8.2G-3 — Wording Governance Runtime Gate

**Third gate in the 8.2G pipeline.** Consumes only drafts accepted by Phase 8.2G-2, then evaluates wording safety using the existing `evaluateExplanationWordingFromScoreReport` scaffold — without any live LLM judge, NLP library, or semantic prose analysis.

**No LLM judge. No NLP. No semantic text evaluation. No user-visible output.**

#### Verdict

> Gate is `defined`. `liveLLMJudgeCalled: false`. `realTextSemanticallyEvaluated: false`. `acceptedForUserVisibleAssembly: false`. `nextRecommendedPhase: "8.2G-4"`.

#### What was defined

- **`RuntimeWordingGateInput`** — gate input: mock draft result, Phase 8.2G-2 validation result, `WordingToneScoreReport | null`, `neverUserVisible: true`.
- **`RuntimeWordingGateResult`** — gate result. `acceptedForUserVisibleAssembly: false`, `liveLLMJudgeCalled: false`, `realTextSemanticallyEvaluated: false` are compile-time literal types.
- **`RuntimeWordingGateVerdict`** — 6 verdicts: `accepted_for_audit_dry_run`, `rejected_previous_gate_failed`, `human_review_required`, `hard_fail_wording_violation`, `rejected_missing_score_report`, `rejected_invalid_score_report`.
- **`RuntimeWordingGateDiagnosticCode`** — 10 diagnostic codes.
- **`RuntimeWordingGateSectionResult`** — per-section gate result with `wordingEvaluationDisposition` and `neverUserVisible: true`.
- **`runRuntimeWordingGovernanceGate(input)`** — pure gate function: validates previous gate, validates score report, runs `evaluateExplanationWordingFromScoreReport`, maps disposition to verdict, builds section results.
- **12-case regression scaffold** — covers all verdict paths, invariant preservation, score report handling.

#### Verdict mapping

| Score Report Outcome | Gate Verdict |
|---|---|
| `approved` | `accepted_for_audit_dry_run` |
| `human_review_required` | `human_review_required` |
| `hard_fail_tone_violation` | `hard_fail_wording_violation` |
| Previous gate not accepted | `rejected_previous_gate_failed` |
| Score report null | `rejected_missing_score_report` |
| Score report invalid | `rejected_invalid_score_report` |

#### Files created

| File | Description |
|---|---|
| `runtime-wording-governance-gate-types.ts` | All types for Phase 8.2G-3 |
| `run-runtime-wording-governance-gate.ts` | `runRuntimeWordingGovernanceGate()` |
| `runtime-wording-governance-gate-regression-scaffold.ts` | 12-case regression scaffold |
| `RUNTIME_WORDING_GOVERNANCE_GATE.md` | Full gate governance document |

#### Key invariants enforced

- `acceptedForUserVisibleAssembly: false` — literal type, always false.
- `liveLLMJudgeCalled: false` — literal type, no LLM judge called.
- `realTextSemanticallyEvaluated: false` — literal type, no prose analysis.
- Previous gate failure (`rejected_*`) blocks wording evaluation completely.
- Hard fail tone violations cannot be overridden.
- Unattested score reports proceed with provenance gap recorded, not hard-failed.

**Next phase: 8.2G-4 — Audit Trace + Diagnostic Envelope Runtime Dry Run** ✓ completed — see below.

**Safety boundary:** No LLM judge called. No NLP imported. No prose evaluated. No wording evaluation thresholds modified. No user-visible output.

---

### Phase 8.2G-4 — Audit Trace + Diagnostic Envelope Runtime Dry Run

**Runtime governance dry-run harness.** Connects the 8.2G-1/2/3 pipeline gates into a single orchestrated dry run that emits audit trace records, validates the assembled `AuditTraceChain`, normalizes diagnostics into `DiagnosticNormalizedEnvelope` instances, and validates the envelope namespace. No live LLM. No persistence. No user-visible output.

> Dry run is `complete`. `liveLLMCalled: false`. `persistenceUsed: false`. `userVisibleOutputAllowed: false`. `neverUserVisible: true`. `nextRecommendedPhase: "8.2G-5"`.

#### What was defined

- **`RuntimeGovernanceDryRunInput`** — input: `RuntimeLLMDraftAdapterInput`, `WordingToneScoreReport | null`, deterministic `dryRunId`, `neverUserVisible: true`.
- **`RuntimeGovernanceDryRunResult`** — full pipeline result. `liveLLMCalled: false`, `persistenceUsed: false`, `userVisibleOutputAllowed: false`, `neverUserVisible: true` are compile-time literal types.
- **`RuntimeGovernanceDryRunVerdict`** — 6 verdicts: `completed_successfully`, `completed_with_human_review_required`, `blocked_by_output_contract`, `blocked_by_wording_gate`, `failed_audit_trace_validation`, `failed_diagnostic_envelope_validation`.
- **`RuntimeGovernanceDryRunDiagnosticCode`** — 16 diagnostic codes covering progress markers, blocking markers, and invariant confirmations.
- **`runRuntimeGovernanceDryRun(input)`** — orchestrator: runs 8.2G-1 → 8.2G-2 → 8.2G-3, creates 3 audit trace emissions, validates them, converts to `AuditTraceNode`, assembles and validates `AuditTraceChain`, builds and validates diagnostic envelopes.
- **10-case regression scaffold** — covers all verdict paths, chain shape, envelope content, invariant preservation.

#### Audit trace chain structure

3 nodes in a linear parent chain:

```
adapter (root, explanation_contract) → output_contract (explanation_contract) → wording_gate (wording_evaluation)
```

EmissionIds are deterministic: `dry-run:{dryRunId}:{step}`. No `Date`. No randomness.

#### Diagnostic envelope source mapping

| Source | DiagnosticEnvelopeSourceKind | Layer |
|---|---|---|
| Draft adapter diagnostics | `unknown` (no dedicated source kind) | unknown |
| Output contract violations | `native_contract_validation` | contract_validation |
| Wording gate diagnostics | `native_wording_evaluation` | wording_evaluation |
| Runtime dry-run diagnostics | `native_governance_lineage_audit` | governance_lineage_audit |

#### Files created

| File | Description |
|---|---|
| `runtime-governance-dry-run-types.ts` | All types for Phase 8.2G-4 |
| `run-runtime-governance-dry-run.ts` | `runRuntimeGovernanceDryRun()` |
| `runtime-governance-dry-run-regression-scaffold.ts` | 10-case regression scaffold |
| `RUNTIME_GOVERNANCE_DRY_RUN.md` | Full dry-run governance document |

#### Key invariants enforced

- `liveLLMCalled: false` — literal type, no live LLM called in any scenario.
- `persistenceUsed: false` — literal type, no DB/log/file writes.
- `userVisibleOutputAllowed: false` — literal type, no output reaches users.
- `auditTraceValid: true` in all non-infrastructure-failure scenarios.
- `diagnosticEnvelopeValid: true` in all non-infrastructure-failure scenarios.
- All `auditTraceEmissions`, `AuditTraceNode`, and `DiagnosticNormalizedEnvelope` instances carry `neverUserVisible: true`.

**Phase 8.2G-5 — First Live LLM Sandboxed Corpus Call** ✓ completed

**Verdict:** First strictly sandboxed live LLM call path established.

**Defined:**
- `RuntimeLiveLLMSandboxProvider` — `openai | unavailable | mock_fallback`
- `RuntimeLiveLLMSandboxCorpusKind` — `synthetic_redacted_corpus | controlled_governance_fixture | imported_static_fixture`
- `RuntimeLiveLLMSandboxDisposition` — 8 outcome values
- `RuntimeLiveLLMSandboxDiagnosticCode` — 15 diagnostic codes
- `RuntimeLiveLLMSandboxFixture` — controlled synthetic corpus fixture
- `RuntimeLiveLLMSandboxInput` / `RuntimeLiveLLMSandboxResult`
- `RuntimeLiveLLMSandboxDraftCandidateResult` — live-call result holding type (modeling gap)
- `runRuntimeLiveLLMSandboxAdapter()` — 6-guard live LLM adapter using `fetch`
- `validateLiveLLMOutputShape()` — standalone JSON shape validator
- `buildSandboxPrompt()` — prompt contract builder
- `convertLiveSandboxResultToDraftAdapterResult()` — compatibility bridge (non-live only)
- `buildLiveSandboxDraftCandidateResult()` — wraps live-call results (pending 8.2G-5A)
- `runRuntimeLiveLLMSandboxRegressionScaffold()` — 10 cases, always runnable without API key

**Modeling gap discovered:**
`RuntimeLLMDraftAdapterResult.liveLLMCalled: false` is a literal type. Live-called results
cannot flow through `validateRuntimeLLMOutputContract` (8.2G-2) without Phase 8.2G-5A
type extensions. Non-live results are fully 8.2G-2 compatible via the converter.

**Key invariants:**
- `userVisibleOutputAllowed: false` — literal type on all returned structures
- `persistenceUsed: false` — literal type; no DB, no log, no file writes
- `realUserInputUsed: false` — literal type; only synthetic fixtures admitted
- `neverUserVisible: true` — enforced on all results and candidates
- Live LLM call impossible unless all 6 guards pass simultaneously
- No API key committed; no env files created or modified
- No Smart Talk route touched; no UI touched
- Optional live call skipped unless `VAYLO_ALLOW_LIVE_LLM_SANDBOX=true` + API key

**Safety boundary:** Live LLM only under 6-guard chain. No persistence. No user-visible output. No Smart Talk wiring. No env files modified. No API key committed.

---

**PHASE 8.2G-5A — Live Path Type Extension** ✓ completed

**Verdict:** Modeling gap from Phase 8.2G-5 resolved. Live sandbox results can now be accepted by the output contract validator (8.2G-2) only when they carry a valid `RuntimeLiveSandboxGuardProof`.

**State:**
- Live sandbox results accepted by `validateRuntimeLLMOutputContract` only with valid guard proof
- Mock path remains unchanged; all Phase 8.2G-2 guarantees preserved
- `acceptedForUserVisibleAssembly: false` — permanent invariant, both paths
- `userVisibleOutputAllowed: false` — permanent invariant, both paths
- No Smart Talk runtime wiring
- No user-visible output produced
- No live LLM call in this phase (type/validator extension only)
- No env files modified; no API keys added

**New types and functions:**
- `RuntimeLiveSandboxGuardProof` — formal proof that all 6 sandbox guards passed
- `RuntimeLiveSandboxGuardProofStatus` — `proven | missing | invalid`
- `RuntimeLiveSandboxGuardProofDiagnosticCode` — 10 diagnostic codes
- `validateRuntimeLiveSandboxGuardProof()` — pure 13-rule proof validator
- `RuntimeLLMOutputContractDraftResult` — union interface accepted by output contract validator
- `RuntimeLLMOutputContractDraftSourceKind` — `mock_adapter_result | live_sandbox_result`
- 5 new violation codes: `llm_output_live_sandbox_proof_missing`, `llm_output_live_sandbox_proof_invalid`, `llm_output_live_sandbox_prefix_missing`, `llm_output_live_sandbox_shape_not_attested`, `llm_output_unrecognized_draft_source`
- `runLivePathExtensionRegressionScaffold()` — 14 regression cases

**`liveLLMCalled` in `RuntimeLLMOutputContractValidationResult`:**
Changed from literal `false` to `boolean`. It is `true` only when the live sandbox path is accepted with a valid proof. The mock adapter's own `liveLLMCalled: false` literal is unchanged.

---

**PHASE 8.2G-6 — Response Assembler Bridge** ✓ completed

**Verdict:** First internal response assembly candidate created from a fully-validated 8.2G pipeline. Internal draft prefixes stripped; internal metadata leaks detected and rejected.

**State:**
- Creates internal response assembly candidate from accepted output contract + wording gate + audit/diagnostic validity
- Strips `[MOCK_DRAFT_NEVER_USER_VISIBLE]` and `[LIVE_SANDBOX_DRAFT_NEVER_USER_VISIBLE]` prefixes
- Rejects any candidate containing internal governance metadata markers
- `userVisibleOutputEmitted: false` — literal type invariant; never relaxed in this phase
- `userVisibleOutputAllowed: false` — literal type invariant
- `persistenceUsed: false`, `dnaSavePerformed: false`, `offlineSavePerformed: false` — literal invariants
- `eligibleForFutureUserVisibleAssembly: true` only on `assembled_internal_candidate` verdict
- No Smart Talk runtime wiring; no UI/API route; no LLM call
- Mock and live sandbox paths both supported

**New types and functions:**
- `RuntimeResponseAssemblerBridgeVerdict` — 9 possible outcomes
- `RuntimeResponseAssemblerBridgeDiagnosticCode` — 18 diagnostic codes
- `RuntimeResponseAssemblerSectionKind` — 7 section kinds (mirrors `RuntimeLLMDraftSectionType`)
- `RuntimeResponseAssemblerSectionCandidate` — internal section with stripped text
- `RuntimeResponseAssemblerBridgeInput` / `RuntimeResponseAssemblerBridgeResult`
- `runRuntimeResponseAssemblerBridge()` — main bridge function
- `stripKnownInternalDraftPrefix()` — pure prefix-stripping helper
- `detectInternalMetadataLeak()` — pure metadata leak detector
- `runResponseAssemblerBridgeRegressionScaffold()` — 14 regression cases

---

**PHASE 8.2G-6A — Wording Gate Live Path Extension** ✓ completed

**Verdict:** `RuntimeWordingGateInput.draftResult` now accepts `RuntimeLLMOutputContractDraftResult`. Both mock and live sandbox paths flow through the wording gate natively. The workaround of synthesizing `RuntimeWordingGateResult` for live path tests is eliminated.

**State:**
- `RuntimeWordingGateInput.draftResult` updated from `RuntimeLLMDraftAdapterResult` → `RuntimeLLMOutputContractDraftResult`
- Mock path remains unchanged (structural subtype compatibility)
- Live sandbox path can pass through wording gate after output contract validation
- No live judge — wording gate still operates on caller-supplied `WordingToneScoreReport` only
- No semantic prose analysis of `draftText`
- `acceptedForUserVisibleAssembly: false`, `userVisibleOutputAllowed: false` on all paths
- No Smart Talk runtime wiring; no UI/API route; no LLM call
- Response assembler bridge regression cases 8 and 13 now use native wording gate path

**Modified files:**
- `runtime-wording-governance-gate-types.ts` — `draftResult` type extended to `RuntimeLLMOutputContractDraftResult`
- `run-runtime-wording-governance-gate.ts` — `deriveDraftId` helper added for safe field access
- `runtime-wording-governance-gate-regression-scaffold.ts` — header updated; mock cases unchanged
- `runtime-response-assembler-bridge-regression-scaffold.ts` — cases 8 and 13 use native gate

**New files:**
- `runtime-wording-gate-live-path-extension-regression-scaffold.ts` — 10 live path regression cases
- `RUNTIME_WORDING_GATE_LIVE_PATH_EXTENSION.md` — phase documentation

---

**PHASE 8.2G-7 — User-Visible Response Authorisation Gate** ✓ completed

**State:**
- Creates internal `UserVisibleResponsePacket` candidate from `assembled_internal_candidate` (8.2G-6)
- Does not emit to UI or API; `emittedToUserNow: false` always
- Does not persist; `persistenceUsed: false`, `dnaSavePerformed: false`, `offlineSavePerformed: false` always
- `acceptedForUserVisibleAssembly: true` and `userVisibleOutputAllowedForFuture: true` on success only
- Human review packets remain blocked from user-visible delivery
- First phase where `acceptedForUserVisibleAssembly: true` is possible

---

**PHASE 8.2G-8 — End-to-End Synthetic Runtime Harness** ✓ completed

**State:**
- Runs full internal synthetic pipeline: 8.2G-1 → 8.2G-2 → 8.2G-3 → 8.2G-6 → 8.2G-7
- Proves readiness for future delivery wiring without touching API/UI
- Does not call live LLM; does not persist; `emittedToUserNow: false` always
- 6 fixture modes; 12 regression cases

---

**PHASE 8.2G-9 — Smart Talk Runtime Delivery Wiring, Guarded Internal Mode** ✓ completed

**State:**
- Adds guarded internal branch to `app/api/smart-talk/route.ts`
- Requires `VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME=true` + `internalRuntimeMode` + `internalRuntimeGuard`
- Returns synthetic governed response only; no live LLM, no persistence, no DNA/offline save
- Normal Smart Talk behavior entirely unchanged when guard fields absent
- Wrong/missing guard → HTTP 403

---

**PHASE 8.2G-10 — Authenticated Internal Mode** ✓ completed

**State:**
- Hardens guarded branch: requires `VAYLO_INTERNAL_RUNTIME_SECRET` env var
- Caller must supply `x-vaylo-internal-runtime-secret` header matching the env secret
- Missing/empty env secret disables guarded runtime entirely (HTTP 403)
- Missing/wrong header → HTTP 403; normal Smart Talk unchanged
- No live LLM, no persistence, no DNA/offline save

---

**PHASE 8.2G-11 — Corpus-Guided Scenario Coverage** ✓ completed

**State:**
- Runs 6 base scenarios (+ 6 optional) through the internal E2E harness
- Covers: authorised packet, output contract block, wording block, human review block, metadata leak, missing sections
- Traces scenarios back to controlled corpus IDs (cc-8-2e-0001 … 0020) for audit
- No API/UI, no live LLM, no persistence
- Regression scaffold extended to 13 cases

---

**PHASE 8.2G-12 — Runtime Closure Audit** ✓ completed

**State:**
- Closes 8.2G runtime integration epoch via `runRuntimeClosureAudit()`
- Verifies all 13 required layers, synthetic E2E harness, corpus-guided coverage
- Confirms guarded delivery (8.2G-9) and authenticated internal mode (8.2G-10) present
- No live LLM, no API/UI touch, no persistence during audit
- `readyForPublicLaunch: false` (literal); 8 open future items recorded
- `readyForControlledLiveInputWiring: true` when verdict is `closed_runtime_epoch`

---

**PHASE 8.2H-0 — Controlled Live Input Wiring Plan** ✓ completed

**State:**
- Planning only; zero runtime implementation
- Defines 12 required guards, 11 blocked capabilities, 3 input modes, 6 next phases
- `real_text_guarded` and `real_question_guarded` allowed later; OCR/public runtime blocked
- No API/UI changes, no live LLM, no persistence
- `readyForPublicLaunch: false` (literal); `readyForImplementationPhase: phase_8_2h_1`

---

**PHASE 8.2H-1 — Real Text Input Contract Types** ✓ completed

**State:**
- Defines `RealTextInputContractInput` and `runRealTextInputContractValidation()`
- Validates mode, length [8–12 000], OCR/file exclusion, persistence/save/deadline/legal-conclusion requests
- Valid text accepted only for future redaction boundary; `acceptedForLLM: false`, `acceptedForRuntimePipeline: false`
- No API/UI, no live LLM, no persistence

---

**PHASE 8.2H-2 — Redaction and Input Guard Boundary** ✓ completed

**State:**
- Adds pure deterministic redaction to accepted real text (email, phone, IBAN, tax ID, reference, address, date, amount, name)
- Match audit records store kind/risk/placeholder only — never raw PII values
- Post-redaction invariant check verifies email/IBAN patterns absent
- Accepted only for controlled live adapter; `acceptedForLLM: false`, `acceptedForRuntimePipeline: false`
- No API/UI, no live LLM, no persistence

---

**PHASE 8.2H-3 — Controlled Live Text Adapter** ✓ completed

**State:**
- Adds pure adapter from redacted real text to controlled governance draft candidate
- Uses only redacted text — never raw input; no answer, summary, translation, or generation
- Section candidates prefixed `[CONTROLLED_LIVE_TEXT_DRAFT_NEVER_USER_VISIBLE]`; post-build invariant enforced
- `real_text_guarded` → `guarded_real_text`; `real_question_guarded` → `guarded_real_question`
- `adaptedForOutputContractValidation: true` on success; `acceptedForLLM: false`, `acceptedForRuntimePipeline: false`
- No API/UI, no live LLM, no persistence

---

**PHASE 8.2H-4 — Controlled Live Text E2E Harness** ✓ completed

**State:**
- Runs input contract → redaction boundary → controlled live text adapter using 12 synthetic fixtures
- Covers: success (text + question + PII), input rejection (too short, too long, bad mode, OCR, persistence, legal), redaction rejection (high-risk, empty), adapter rejection (null redaction)
- Does not connect to 8.2G output contract validator or Smart Talk API
- `acceptedForLLM: false`, `acceptedForRuntimePipeline: false` remain locked; nested layer invariants verified
- No API/UI, no live LLM, no persistence

---

**PHASE 8.2H-5 — Guarded Internal Live Text Runtime Pipeline** ✓ completed

**State:**
- Connects 8.2H adapter candidate to full 8.2G governance chain (output contract → wording gate → assembler → authorisation)
- Temporary mock-bridge maps controlled live text candidate to mock-shaped draft for validator compatibility (no redacted text forwarded)
- `completed_authorised_internal_packet` on success; `emittedToUserNow: false` always; no live LLM, no persistence
- Optional guarded API branch added: `internalRuntimeMode: "controlled_live_text_guarded"` + secret + guard phrase; uses `safe_real_text` fixture only

---

**PHASE 8.2H-6 — Controlled Live Input Closure Audit** ✓ completed

**State — 8.2H epoch: CLOSED WITH WARNINGS**
- Verifies all 8 required layers present; E2E harness + guarded runtime pipeline both pass live checks
- `readyForControlledRealTextForwardingTo8_2G: false` — temporary mock-bridge debt unresolved
- `readyForPublicLaunch: false` — public launch blocked until full 8.2I path proven
- 7 open items recorded (none block epoch closure; all block public launch)
- No live LLM, no persistence, no API/UI changes in audit

---

**PHASE 8.2I-0 — Controlled Live Text Output Contract Compatibility Plan** ✓ completed

**State:**
- Planning only; starts post-8.2H compatibility epoch
- Defines how to remove temporary mock-shaped bridge and add `[CONTROLLED_LIVE_TEXT_DRAFT_NEVER_USER_VISIBLE]` as a recognised source kind/prefix in the 8.2G output contract validator
- `readyForControlledRealTextForwardingTo8_2G: false` — blocked until 8.2I-1 through 8.2I-4 complete
- 5 ordered implementation phases defined (8.2I-1 through 8.2I-5); no validator code changed here
- No API/UI, no live LLM, no persistence

**Next phase: 8.2I-1 — Controlled Live Text Draft Result Types**

---

**PHASE 8.2I-1 — Controlled Live Text Draft Result Types** ✓ completed

**State:**
- Adds `ControlledLiveTextDraftResult` and `ControlledLiveTextRedactionProof`
- Defines `controlled_live_text` source kind and `CONTROLLED_LIVE_TEXT_DRAFT_PREFIX` constant
- Proof stores only match metadata — never raw or redacted text
- Output contract validator not modified yet; temporary mock bridge remains
- Real redacted text forwarding remains blocked (`readyForControlledRealTextForwardingTo8_2G: false`)
- No API/UI, no live LLM, no persistence

**Next phase: 8.2I-2 — Output Contract Validator Extension**

---

**PHASE 8.2I-2 — Output Contract Validator Extension** ✓ completed

**State:**
- Adds `controlled_live_text` dispatch branch to `validateRuntimeLLMOutputContract`
- Recognises `CONTROLLED_LIVE_TEXT_DRAFT_PREFIX`; requires `ControlledLiveTextRedactionProof`
- Rejects missing/invalid proof, missing prefix, `liveLLMCalled: true`, persistence flags
- Preserves mock and live sandbox paths unchanged; `acceptedForUserVisibleAssembly` always `false`
- Temporary mock bridge in `run-guarded-live-text-runtime-pipeline.ts` NOT removed yet
- No API/UI, no live LLM, no persistence

**Next phase: 8.2I-3 — Remove Temporary Mock Bridge**

---

**PHASE 8.2I-3 — Remove Temporary Mock Bridge** ✓ completed

**State:**
- Removes mock-shaped bridge from `run-guarded-live-text-runtime-pipeline.ts`
- Builds `ControlledLiveTextDraftResult` from 8.2H chain; passes directly to output contract validator
- `temporaryMockBridgeUsed: false`, `realRedactedTextForwardedToOutputContract: true` on success
- Closure audit: `readyForControlledRealTextForwardingTo8_2G: true`; `readyForPublicLaunch: false`
- No API/UI, no live LLM, no persistence; `emittedToUserNow: false` always

**Next phase: 8.2I-4 — Real Redacted Text Forwarding Harness**

---

**PHASE 8.2I-4 — Real Redacted Text Forwarding Harness** ✓ completed

**State:**
- proves synthetic real-text fixtures with PII flow through redaction and `controlled_live_text` output contract path
- verifies raw-value leak checks (no raw email/IBAN/phone in section draft texts)
- confirms `ControlledLiveTextDraftResult` reaches 8.2G gates without mock bridge
- covers: 4 success paths, redaction block, 2 input contract blocks, 2 tamper blocks, human review, wording hard fail
- no API/UI, no live LLM, no persistence; public launch remains blocked

**Next phase: 8.2I-5 — Guarded Real Text Pipeline Closure Audit**

---

**PHASE 8.2I-5 — Guarded Real Text Pipeline Closure Audit** ✓ completed

**State:**
- closes 8.2I epoch; verifies mock bridge removal, sourceKind alignment, `controlled_live_text` output contract path
- runs `runRealRedactedTextForwardingHarness` across all 11 fixtures; confirms success/blocking outcomes
- confirms `readyForControlledRealTextForwardingTo8_2G: true`; raw value leak checks pass
- `readyForPublicLaunch: false` — public launch blocked until 8.2J pilot readiness
- no API/UI, no live LLM, no persistence; 7 open future items recorded (none block epoch closure)

**Next phase: 8.2J-0 — Controlled Text Pilot Readiness Plan**

---

**PHASE 8.2J-0 — Controlled Text Pilot Readiness Plan** ✓ completed

**State:**
- starts controlled text pilot readiness epoch (planning only — no runtime implementation)
- defines pilot scope (internal/text-only/guarded), 12 blocked capabilities, 12 readiness areas, 12 acceptance criteria, 10 failure policies
- `readyForGuardedManualPilotPlanning: true`; `readyForInternalPilotImplementation: false`; `readyForPublicLaunch: false`
- no API/UI, no live LLM, no persistence; public launch remains blocked

**Next phase: 8.2J-1 — Pilot Scenario Set and Acceptance Criteria**

---

**PHASE 8.2J-1 — Pilot Scenario Set and Acceptance Criteria** ✓ completed

**State:**
- defines 12 synthetic controlled pilot scenarios: invoice, payment reminder, Jobcenter, health insurance, tax, immigration, bureaucracy question, noisy fragment, deadline request, legal conclusion, persistence request, PII-heavy
- pass: 2 · warning: 4 · human_review: 3 · block: 3 — failure categories and required checks per scenario
- `readyForRuntimeExecution: false`; `readyForManualReviewProtocol: true`; `readyForPublicLaunch: false`
- no API/UI, no live LLM, no persistence

**Next phase: 8.2J-2 — Guarded Internal Pilot Runtime Switch Plan**

---

**PHASE 8.2J-2 — Guarded Internal Pilot Runtime Switch Plan** ✓ completed

**State:**
- defines internal pilot runtime switch model (16 activation rules, guard phrase, allowlist, kill switch, failure verdicts)
- planning only — no switch wired, no API/UI/LLM/persistence touched
- `readyForPilotRuntimeImplementation: false`; `readyForManualSafetyProtocol: true`; `readyForPublicLaunch: false`
- next phase: 8.2J-3 Manual Safety Test Protocol

---

**PHASE 8.2J-3 — Manual Safety Test Protocol** ✓ completed

**State:**
- defines reviewer checklist (24 items) and sign-off protocol across 5 test phases
- covers pre-run, scenario execution, output review, escalation review, and final sign-off
- prohibits raw text / PII / secrets in all evidence records
- `readyForPilotEvidenceRecordModel: true`; `readyForRuntimeExecution: false`; `readyForPublicLaunch: false`
- no runtime implementation, no API/UI, no live LLM, no persistence
- next phase: 8.2J-4 Pilot Evidence Record Model

---

**PHASE 8.2J-4 — Pilot Evidence Record Model** ✓ completed

**State:**
- defines safe `PilotEvidenceRecord` type + pure `validatePilotEvidenceRecord` validator
- prohibits rawInputText, redactedText, fullDraftText, userPii, screenshotWithPii, apiKey, internalSecret, rawModelOutput
- 18-case regression scaffold: all safety invariants confirmed
- `readyForPersistence: false`; `readyForPublicLaunch: false`; no API/UI, no live LLM, no persistence
- next phase: 8.2J-5 Controlled Text Pilot Readiness Closure Audit

---

**PHASE 8.2J-5 — Controlled Text Pilot Readiness Closure Audit** ✓ completed

**State:**
- closes 8.2J epoch: verifies readiness plan, scenario set, switch plan, manual protocol, evidence model, and regression scaffold (18 cases)
- verdict: `closed_with_warnings` — 7 open items recorded; none block epoch closure
- `readyForControlledTextPilotPlanningClosure: true`; `readyForRuntimeExecution: false`; `readyForPublicLaunch: false`
- no API/UI, no live LLM, no persistence; next epoch: 8.2K-0 Guarded Internal Pilot Runtime Implementation Plan

---

**PHASE 8.2K-0 — Guarded Internal Pilot Runtime Implementation Plan** ✓ completed

**State:**
- starts 8.2K epoch; planning only — no runtime wired, no API/UI/LLM/persistence touched
- defines 12 implementation scope items, 7 required contracts, 16 required guards, 11 blocked capabilities
- `readyForRuntimeImplementation: false`; `readyForApiRouteModification: false`; `readyForPublicLaunch: false`
- ordered 5-phase roadmap: 8.2K-1 contract types → 8.2K-2 API branch → 8.2K-3 E2E harness → 8.2K-4 evidence integration → 8.2K-5 closure
- next phase: 8.2K-1 Pilot Runtime Guard Contract Types

---

**PHASE 8.2K-1 — Pilot Runtime Guard Contract Types** ✓ completed

**State:**
- defines `PilotRuntimeRequest`, `PilotRuntimeGuardInput/Success/FailureResult/GuardResult`, `PilotRuntimeResponse`, `PilotNoPersistenceResult`, `PilotRuntimeClosureAuditResult`
- request contract blocks OCR/upload/payment/persistence/DNA/offline/public/live-LLM via literal-false flags
- 10-case static regression scaffold: all shape and invariant checks confirmed
- types only — no API/UI/LLM/persistence; runtime execution remains disabled
- next phase: 8.2K-2 Guarded Internal Pilot API Branch

---

**PHASE 8.2K-2 — Guarded Internal Pilot API Branch** ✓ completed

**State:**
- first guarded internal-only pilot branch wired in `app/api/smart-talk/route.ts`
- fail-closed behind all 16 guards: feature flag, pilot flag, kill switch, secret, guard phrase, allowlist, scenario allowlist, input mode, no-OCR/upload/payment/persistence/DNA/offline/public/live-LLM, neverUserVisible
- success response: `responseKind: "authorised_internal_packet"` with full guard summary — no input text, no model output
- no live LLM, no persistence, no user-visible output; existing public Smart Talk behavior unchanged
- next phase: 8.2K-3 Pilot Runtime E2E Harness

---

**PHASE 8.2K-3 — Pilot Runtime E2E Harness** ✓ completed

**State:**
- adds pure synthetic harness for guarded pilot API branch behavior (`run-pilot-runtime-e2e-harness.ts`)
- covers success path, all 16 guard failure paths, 2 contract violation paths, 2 tamper/leak paths (23 fixtures total)
- per-case checks: HTTP status, authorised flag, responseKind, failureVerdict, failedGuard, raw text leak, secret leak, userVisibleOutputAllowed, persistence flags, liveLLMCalled, publicRuntimeEnabled
- no API route modification, no HTTP calls, no live LLM, no persistence, no user-visible output
- next phase: 8.2K-4 Pilot Evidence Validation Integration

---

**PHASE 8.2K-4 — Pilot Evidence Validation Integration** ✓ completed

**State:**
- proves guarded pilot runtime response can be mapped into `PilotEvidenceRecord` validation input and validated by `validatePilotEvidenceRecord()` (8.2J-4)
- 4 valid response-kind paths (authorised, blocked, human-review, invalid-request) → accepted by validator
- 9 tamper rejection paths (raw text, redacted text, secret, PII, persistence, public runtime, emitted-to-user, missing signoff, missing escalation reason) → each rejected by correct validator step
- per-case leak checks: no injected raw/redacted text, no secret, no PII in validation result JSON
- 8.2K-3 harness re-verified; `allPassed` requires both 8.2K-3 and 8.2K-4 cases to pass
- no API route modification, no live LLM, no persistence, no user-visible output
- next phase: 8.2K-5 Guarded Pilot Runtime Closure Audit

---

**PHASE 8.2K-5 — Guarded Pilot Runtime Closure Audit** ✓ completed

**State:**
- closes 8.2K epoch with `closed_with_warnings` verdict if all 5 layers pass
- audits 8.2K-0 plan, 8.2K-1 guard contracts, 8.2K-2 API branch (static metadata), 8.2K-3 harness, 8.2K-4 evidence integration
- sets `readyForControlledPilotExecution: true` on success
- keeps `readyForPublicLaunch: false`, `readyForLiveLLMRuntime: false`, `readyForPersistence: false`
- no API route modification; no live LLM; no persistence; no user-visible output
- prepares next guarded internal controlled pilot execution epoch

---

**PHASE 8.2L-0 — Guarded Internal Controlled Pilot Execution Plan** ✓ completed

**State:**
- starts guarded internal controlled pilot execution epoch; planning only
- depends on 8.2K-5 `readyForControlledPilotExecution: true`
- defines operator checklist (17 items), env verification (6 vars), abort criteria (16), and post-execution audit requirements
- 5 ordered next phases: 8.2L-1 operator env verification → 8.2L-2 single-run harness → 8.2L-3 manual review capture → 8.2L-4 post-execution audit → 8.2L-5 closure
- `readyForPilotRunNow: false`; no public runtime; no live LLM; no persistence
- next phase: 8.2L-1 Operator Environment Verification Contract

---

**PHASE 8.2L-1 — Operator Environment Verification Contract** ✓ completed

**State:**
- defines typed operator env verification contract: `OperatorEnvironmentVerificationInput`, `OperatorEnvironmentVerificationResult`, `OperatorEnvironmentVerificationEnvVarAttestation`
- uses env var names and operator boolean attestations only — no env values, no secrets
- 14 validation rules; 20 failure reasons; `validateOperatorEnvironmentVerificationInput()` implemented
- synthetic check (`runOperatorEnvironmentVerificationContractCheck()`) chains 8.2L-0 plan check
- `readyForSingleRunExecutionHarness: true` on passing synthetic verification
- `readyForPilotRunNow: false`; no public runtime; no live LLM; no persistence
- next phase: 8.2L-2 Single-Run Execution Harness

---

**PHASE 8.2L-2 — Single-Run Execution Harness** ✓ completed

**State:**
- adds pure synthetic single-run harness for guarded internal controlled pilot flow
- requires operator env verification contract check; chains 8.2K-3 E2E harness and 8.2K-4 evidence integration
- synthetic request uses metadata/label only — no raw text, no secrets, no real user input
- 7 step sequence with 15 blockers; aggregate leak checks on safe result JSON
- no HTTP/API call, no route import, no live LLM, no persistence, no user-visible output
- `readyForManualReviewCaptureModel: true` on success; prepares 8.2L-3 manual review capture model

---

**PHASE 8.2L-3 — Manual Review Capture Model** ✓ completed

**State:**
- adds in-memory manual review capture model after synthetic single-run harness
- validates reviewer ID, verdict, 14-item checklist, escalation reasons, and safe metadata only
- rejects raw/redacted text, secrets, PII, model output, document content, persistence, live LLM, and public/user-visible output via 15 tamper cases
- `safeReviewMetadata` stores IDs, verdict, counts, and phase only — no content stored
- no persistence; no API route modification; no HTTP/API call; no live LLM
- `readyForPostExecutionAudit: true` on success; prepares 8.2L-4 post-execution audit

---

**PHASE 8.2L-4 — Post-Execution Audit** ✓ completed

**State:**
- audits all 4 layers: 8.2L-0 execution plan, 8.2L-1 operator env verification, 8.2L-2 single-run harness, 8.2L-3 manual review capture
- returns `closed_with_warnings` if all layers pass; `blocked` otherwise (20 blocker variants)
- 10 open items always acknowledged; no real pilot run, no API route modification, no HTTP/API call, no live LLM, no persistence
- `readyForControlledPilotExecutionClosure: true` on success; prepares 8.2L-5 controlled pilot execution closure

---

**PHASE 8.2L-5 — Controlled Pilot Execution Closure** ✓ completed

**State:**
- formally closes the synthetic 8.2L guarded controlled pilot execution epoch
- verifies execution plan, operator env verification, single-run harness, manual review capture, and post-execution audit
- may set `readyForNextEpochPlanning: true` on success
- keeps `readyForRealOperatorPilotRun: false` and `readyForPilotRunNow: false` always
- keeps `readyForPublicLaunch`, `readyForLiveLLMRuntime`, and `readyForPersistence` false always
- no API route modification, no HTTP/API call, no live LLM, no persistence

---

**PHASE 8.2M-0 — Real Operator Pilot Authorization Plan** ✓ completed

**State:**
- begins the next planning epoch after 8.2L closure; verifies `runControlledPilotExecutionClosure()`
- defines 20 prerequisites, 15 blocked capabilities, and 14 open items for future real operator pilot authorization
- blocks real pilot execution now — `readyForRealOperatorPilotRun: false` always
- blocks public launch, live LLM, persistence, OCR, file upload, and payment always
- may set `readyForOperatorIdentityContract` and related planning flags `true` on clean 8.2L closure
- no API route modification, no HTTP/API call, no live LLM, no persistence

---

**PHASE 8.2M-1 — Operator and Reviewer Identity Contract** ✓ completed

**State:**
- adds typed operator/reviewer identity attestation contract; requires named human operator and named human reviewer
- enforces distinct-person rule (`operator.humanId !== reviewer.humanId`, `operatorAndReviewerAreDistinct: true`)
- stores safe identity metadata only; rejects secrets, env values, PII, raw/document content, persistence, live LLM, public/user-visible tamper (23 tamper cases)
- no authentication implementation, no persistence, no real pilot execution
- may set `readyForRealEnvironmentAttestationContract` and related planning flags `true` on success

---

**PHASE 8.2M-2 — Real Environment Attestation Contract** ✓ completed

**State:**
- adds attestation-only real environment readiness contract; requires all 8 env variable names to be attested without exposing values
- enforces 18-item checklist and operator/reviewer attestation statements
- rejects env value reads/prints/storage, secrets, API keys, PII, raw/document content, persistence, live LLM, public/user-visible tamper (26 tamper cases)
- no `process.env` reads, no secret storage, no persistence, no real pilot execution
- may set `readyForAbortProtocol` and related planning flags `true` on success

---

**PHASE 8.2M-3 — Abort Protocol Contract** ✓ completed

**State:**
- adds typed abort protocol contract for future real operator pilot; requires 18 abort triggers, 10 stop actions, 18-item checklist, operator/reviewer acknowledgments, rollback/stop confirmation
- rejects real abort execution, kill switch modification, runtime hook modification, secrets/env/API keys/PII/raw/document/model content, persistence, live LLM, public/user-visible tamper (29 tamper cases)
- depends on real environment attestation contract (`readyForAbortProtocol: true` from 8.2M-2)
- no kill switch modification, no runtime abort hook modification, no persistence, no real pilot execution
- may set `readyForRealInputPolicy`, `readyForEvidencePolicy`, `readyForPostRunAuditPlanning` `true` on success

---

**PHASE 8.2M-4 — Real Input Policy Contract** ✓ completed

**State:**
- adds typed real input policy contract for future operator-controlled pilot; defines 5 allowed categories, 14 disallowed categories, 18 redaction requirements, 18-item checklist, clearance levels, completeness warning, and legal disclaimer requirements
- rejects raw input forwarding, real input processing, missing redaction/manual review/completeness/legal gates, high-risk input allowance, secrets/env/API keys/PII/raw/redacted/document/model content, persistence, live LLM, public/user-visible tamper (39 tamper cases)
- depends on abort protocol contract (`readyForRealInputPolicy: true` from 8.2M-3)
- no redaction runtime modification, no real input processing, no persistence, no real pilot execution
- may set `readyForEvidencePolicy`, `readyForPostRunAuditPlanning` `true` on success

---

**PHASE 8.2M-5 — Evidence Policy Contract** ✓ completed

**State:**
- adds typed metadata-only evidence policy contract for future operator-controlled pilot; defines 16 allowed metadata categories, 21 blocked content categories, 17 retention constraints, 12 audit trail requirements, 17-item checklist, and clearance levels
- rejects user content evidence, raw/redacted/model/document/OCR/PII/secret/env evidence, persistence, DNA/offline save, live LLM, public/user-visible tamper (54 tamper cases)
- depends on real input policy contract (`readyForEvidencePolicy: true` from 8.2M-4)
- no evidence persistence, no DB/storage modification, no user content storage, no real pilot execution
- may set `readyForPostRunAuditPlanning` `true` on success

---

**PHASE 8.2M-6 — Post-Run Audit Planning Contract** ✓ completed

**State:**
- adds typed post-run audit planning contract for future operator-controlled pilot; defines 18-item audit scope, 4 verdict models, 12 linkage requirements, 19-item checklist, 6 signoff requirements, clearance levels, and metadata-only audit rule
- rejects audit execution/persistence, user content/raw/redacted/model/document/PII/secret/env audit content, evidence persistence, real input processing, persistence, DNA/offline save, live LLM, public/user-visible tamper (55 tamper cases)
- depends on evidence policy contract (`readyForPostRunAuditPlanning: true` from 8.2M-5)
- no audit execution, no audit persistence, no DB/storage modification, no real pilot execution
- may set `readyForRealOperatorPilotAuthorizationClosure` `true` on success

---

**PHASE 8.2M-7 — Real Operator Pilot Authorization Closure** ✓ completed

**State:**
- closes 8.2M authorization prerequisites with warnings; verifies operator/reviewer identity, environment attestation, abort protocol, real input policy, evidence policy, and post-run audit planning
- verdict: `closed_with_warnings` / 0 blockers / 9 open items for future epochs
- allows next epoch planning for Connected AI Runtime Authorization and real operator pilot runtime execution planning
- does not execute pilot, does not authorize pilotRunNow, does not authorize live LLM runtime, does not authorize persistence, does not authorize public launch
- all runtime execution, AI connection, and launch remain in future separate epochs

---

**PHASE 8.3A — Connected AI Runtime Authorization Plan** ✓ completed

**State:**
- starts the 8.3 Connected AI Runtime Authorization epoch after 8.2M closure; verifies 8.2M-7 dependency (23 invariant flags) and defines 11 prerequisites, 12 open items, and 6 sequential next phases
- plan status: `ready_for_live_llm_boundary_contract` / 0 blockers
- only allows planning for the Live LLM Boundary Contract (next phase); all downstream contracts remain blocked
- does not call live LLM, does not authorize live LLM runtime, does not generate AI output, does not process or forward real input, does not authorize public launch or persistence

---

**PHASE 8.3B — Live LLM Boundary Contract** ✓ completed

**State:**
- defines live LLM boundary for the future governance-controlled AI runtime; explicitly isolates existing public Smart Talk Branch C / run-smart-talk.ts / OCR live runtime from governance tests
- allows OpenAI only; enforces 4 model policies, 16 preconditions, 10 output-handling requirements, 18-item checklist; 53 tamper cases rejected
- `publicBranchCAuthorizedForGovernanceChain`, `runSmartTalkAuthorizedForGovernanceChain`, `extractTextFromImageAuthorizedForGovernanceChain` all literal `false`
- does not call live LLM, does not authorize live LLM runtime, does not generate AI output, does not process or forward real input, does not authorize public launch or persistence
- sets `readyForRedactedInputForwardingContract: true` on success

---

**PHASE 8.3C — Redacted Input Forwarding Contract** ✓ completed

**State:**
- defines redacted-input forwarding policy for future governance-controlled AI adapter
- requires redaction proof, manual review requirement, blocked raw input, blocked high-risk uncertainty, and existing runtime isolation
- does not forward input, does not call live LLM, does not authorize run-smart-talk.ts
- does not call public Branch C or OCR runtime, does not generate AI output
- does not authorize public launch or persistence; sets `readyForAiOutputGovernanceRecheckContract: true` on success

---

**PHASE 8.3D — AI Output Governance Recheck Contract** ✓ completed

**State:**
- defines governance recheck policy for future AI output; treats AI output as untrusted by default
- requires reality/evidence/hallucination/wording/urgency/next-step rechecks; blocks legal certainty and deadline claims without evidence
- requires uncertainty and partial-input limitation preservation; requires manual review before user-visible output
- does not generate AI output or call live LLM; does not authorize public launch or persistence
- sets `readyForManualReviewBeforeUserVisibleOutputContract: true` on success

---

**PHASE 8.3E — Manual Review Before User-Visible Output Contract** ✓ completed

**State:**
- defines mandatory manual review gate before future user-visible authorization; requires operator/reviewer identity, reviewer responsibility, disposition, evidence metadata, and block conditions
- blocks automatic approval, anonymous review, direct display, unsafe certainty, unsupported deadlines, and unsupported legal claims
- does not execute review, does not authorize user-visible output, does not generate AI output or call live LLM
- does not authorize public launch or persistence
- sets `readyForUserVisibleOutputAuthorizationContract: true` on success

---

**PHASE 8.3F — User-Visible Output Authorization Contract** ✓ completed

**State:**
- defines scoped authorization policy for one reviewed output in one controlled session
- requires governance recheck, manual review, evidence metadata, safety language, uncertainty preservation, and scope limits
- blocks global approval, public runtime, persistence, live LLM runtime, Branch C authorization, unsafe certainty, deadline certainty, input echo, model output dumps, and internal audit dumps
- does not emit user-visible output
- does not call live LLM or generate AI output
- does not authorize public launch or persistence
- permits next phase: AI-connected synthetic test harness contract

---

**PHASE 8.3G — AI-Connected Synthetic Test Harness Contract** ✓ completed

**State:**
- defines contract for future synthetic-only AI-connected test harness planning
- allows only synthetic input classes and blocks real user input, OCR/photo/file input, raw/redacted real text, and public requests
- requires dedicated synthetic adapter and future execution plan
- keeps Branch C, run-smart-talk.ts, and OCR runtime isolated
- does not execute harness, call live LLM, generate AI output, persist data, or emit user-visible output
- does not authorize public launch or live runtime

---

**PHASE 8.3H — AI-Connected Synthetic Test Harness Execution Plan** ✓ completed

**State:**
- defines execution plan for future synthetic-only AI-connected harness dry run
- specifies synthetic case catalog, risk classes, adapter interface policy, governance steps, metadata-only observations, blockers, and checklist
- defers dry execution to next phase; keeps Branch C, run-smart-talk.ts, and OCR runtime isolated
- does not execute harness, call live LLM, process real/OCR/photo/file input, generate AI output, persist data, or emit user-visible output
- does not authorize public launch or live runtime

---

**PHASE 8.3I — AI-Connected Synthetic Harness Dry Execution** ✓ completed

**State:**
- executes synthetic harness dry run using deterministic synthetic adapter only
- uses exactly the planned 8 synthetic case IDs and metadata-only observations
- does not call live LLM, Branch C, run-smart-talk.ts, or OCR runtime
- does not process real/OCR/photo/file/public input
- does not generate or store real AI output
- does not persist data or emit user-visible output
- permits next phase: Synthetic Harness Post-Run Audit

---

**PHASE 8.3J — Synthetic Harness Post-Run Audit** ✓ completed

**State:**
- audits the 8.3I deterministic synthetic dry execution using metadata only
- verifies 8 cases, expected paths, observations, invariants, deterministic adapter, and no failed cases
- confirms no live LLM, no Branch C, no run-smart-talk.ts, no OCR runtime, no real input, no AI output, no persistence, and no user-visible output
- does not execute the harness again
- does not authorize live LLM runtime or public launch
- permits next phase: Live LLM Synthetic Authorization Planning

---

**PHASE 8.3K — Live LLM Synthetic Authorization Planning** ✓ completed

**State:**
- plans authorization for one future synthetic-only live LLM call
- does not call live LLM, read env, import SDKs, make HTTP calls, or generate AI output
- requires provider/model allowlist, one-call limit, kill switch, synthetic case only, post-call governance recheck, and post-call audit
- blocks real input, OCR/photo/file input, public requests, Branch C, run-smart-talk.ts, OCR runtime, persistence, public runtime, and user-visible output
- does not authorize general live LLM runtime or public launch
- permits next phase: Live LLM Synthetic Single-Call Contract

---

**PHASE 8.3L — Live LLM Synthetic Single-Call Contract** ✓ completed

**State:**
- defines contract for one future synthetic-only live LLM call (provider openai, model gpt_4o_mini, case synthetic_deadline_relative_missing_delivery_date)
- does not call live LLM, read env, import SDKs, make HTTP calls, or generate AI output
- requires kill switch, single-call counter, prompt policy, metadata-only capture, post-call governance recheck, and post-call audit
- blocks real input, OCR/photo/file input, public requests, Branch C, run-smart-talk.ts, OCR runtime, persistence, public runtime, and user-visible output
- does not authorize general live LLM runtime or public launch
- permits next phase: Live LLM Synthetic Single-Call Execution Plan

---

**PHASE 8.3M — Live LLM Synthetic Single-Call Execution Plan** ✓ completed

**State:**
- defines pre-flight execution plan for one future synthetic live LLM call
- selects provider openai, model gpt_4o_mini, and synthetic case synthetic_deadline_relative_missing_delivery_date
- defines kill-switch, single-call counter, env presence check policy, prompt policy, metadata capture, execution gates, blockers, post-call recheck, and post-call audit
- does not call live LLM, read env, import SDKs, make HTTP calls, construct prompt text, or generate AI output
- blocks real input, OCR/photo/file input, public requests, Branch C, run-smart-talk.ts, OCR runtime, persistence, public runtime, and user-visible output
- permits next phase: Live LLM Synthetic Single-Call Dry-Run Authorization

---

**PHASE 8.3N — Live LLM Synthetic Single-Call Dry-Run Authorization** ✓ completed

**State:**
- authorizes only the next phase to execute one synthetic live LLM call
- verifies provider openai, model gpt_4o_mini, selected case synthetic_deadline_relative_missing_delivery_date, kill switch armed, single-call counter zero, prompt policy ready, metadata-only capture ready, post-call governance recheck ready, and post-call audit ready
- does not call live LLM, read env, import SDKs, make HTTP calls, construct prompt text, log prompt text, or log model output
- blocks real input, OCR/photo/file input, public requests, Branch C, run-smart-talk.ts, OCR runtime, persistence, public runtime, and user-visible output
- does not authorize general live LLM runtime or public launch
- permits next phase: Live LLM Synthetic Single-Call Execution

---

**PHASE 8.3O — Live LLM Synthetic Single-Call Execution** ✓ completed

**State:**
- executes exactly one synthetic live LLM call with provider openai, model gpt_4o_mini, and case synthetic_deadline_relative_missing_delivery_date
- checks API key presence without logging/returning value; constructs prompt in memory only and does not log, store, or return prompt text
- discards model output after untrusted receipt metadata and does not log, store, return, or display it; captures metadata only
- requires post-call governance recheck plus post-call audit
- blocks real input, OCR/photo/file input, public requests, Branch C, run-smart-talk.ts, OCR runtime, persistence, public runtime, and user-visible output
- does not authorize general live LLM runtime or public launch; safely blocked if OPENAI_API_KEY is absent
- permits next phase: Post-Call Governance Recheck

---

**PHASE 8.3P — Post-Call Governance Recheck** ✓ completed

**State:**
- performs metadata-only governance recheck after the synthetic single-call execution; does not inspect model output text (discarded in 8.3O) and does not reconstruct prompt text
- verifies exactly one call, provider openai, model gpt_4o_mini, selected synthetic case, untrusted model-output marker, prompt/model-output non-logging, and metadata-only capture
- enforces promptTextAvailableForReview: false and modelOutputAvailableForReview: false as literal invariants
- does not call live LLM directly, read env, import SDKs, make HTTP calls, or persist anything
- confirms Branch C, run-smart-talk.ts, OCR runtime, real input, user-visible output, persistence, public runtime, and real pilot remain blocked
- all dangerous readiness flags (readyForLiveLLMRuntime through readyForPersistence) remain false
- permits next phase: Post-Call Audit

---

**PHASE 8.3Q — Post-Call Audit** ✓ completed

**State:**
- performs metadata-only full-chain post-call audit (8.3A through 8.3P); does not inspect model output text (discarded in 8.3O) and does not reconstruct prompt text
- verifies exactly one call, no second call, provider openai, model gpt_4o_mini, case, untrusted marker, prompt/model-output non-availability, metadata-only capture, and audit non-persistence (auditPersistenceUsed: false)
- enforces promptTextAvailableForAudit: false and modelOutputAvailableForAudit: false as literal invariants; confirms fullChainAudit: true and readyForSyntheticLiveLlmPilotExpansionPlanning: true
- does not call live LLM directly, read env, import SDKs, make HTTP calls, or persist audit records
- confirms Branch C, run-smart-talk.ts, OCR runtime, real input, user-visible output, persistence, public runtime, and real pilot remain blocked
- all dangerous readiness flags (readyForLiveLLMRuntime through readyForPersistence) remain false
- permits next phase: Synthetic Live LLM Pilot Expansion Planning

---

**PHASE 8.3R — Synthetic Live LLM Pilot Expansion Planning** ✓ completed

**State:**
- metadata-only planning after post-call audit; does not call live LLM, read env, import SDKs, make HTTP calls, or persist anything
- plans synthetic-only expansion from one case to a 10-case controlled catalog: relative deadline, explicit payment deadline, high-risk Widerspruch, immigration uncertainty, incomplete document, legal certainty trap, unsafe next-step trap, noisy OCR, multi-authority, and overpayment synthetic cases
- enforces readyForRealDocumentInput: false and readyForUserVisibleOutput: false as new literal invariants; additionalCaseContractRequired: true guards each future execution
- all dangerous readiness flags remain false; Branch C, run-smart-talk.ts, OCR runtime, user-visible output, public runtime, persistence, and real document input remain blocked
- confirms liveLLMCalledAgain: false, additionalLiveLLMCallsExecuted: false, metadataOnlyPlanning: true, syntheticOnlyExpansion: true
- permits next phase: Additional Synthetic Live LLM Case Contract

---

**PHASE 8.3S — Additional Synthetic Live LLM Case Contract** ✓ completed

**State:**
- creates contract-only definition for the selected additional synthetic case: synthetic_explicit_payment_deadline (provider openai, model gpt_4o_mini)
- verifies expansion planning readiness; enforces contractOnly: true, futureExecutionPlanRequired: true, futureDryRunAuthorizationRequired: true, oneFutureLiveLlmCallOnly: true, killSwitchRequired: true, singleCallCounterRequired: true
- defines 16 prompt policies prohibiting real names, addresses, IBAN, Steuer-ID, Aktenzeichen, phone/email, coercive language, and legal certainty; allows synthetic payment amount and document-stated deadline
- requires model output to remain untrusted after future execution; requires governance recheck and post-call audit
- does not call live LLM (liveLLMCalledInContract: false), read env, import SDKs, make HTTP calls, inspect model output, process real input, or persist anything
- keeps Branch C, run-smart-talk.ts, OCR runtime, user-visible output, public runtime, persistence, and real document input blocked
- permits next phase: Additional Synthetic Live LLM Case Execution Plan

---

**PHASE 8.3T — Additional Synthetic Live LLM Case Execution Plan** ✓ completed

**State:**
- creates preflight execution plan for selected additional synthetic case: synthetic_explicit_payment_deadline
- verifies contract readiness, provider openai, model gpt_4o_mini, one future call limit, kill switch and counter requirements, prompt component policy, prompt blockers, metadata capture plan, execution gates, and execution blockers
- does not call live LLM, read env, import SDKs, make HTTP calls, construct final prompt text, inspect model output, process real input, or persist anything
- keeps Branch C, run-smart-talk.ts, OCR runtime, user-visible output, public runtime, persistence, and real document input blocked
- permits next phase: Additional Synthetic Live LLM Case Dry-Run Authorization

---

**PHASE 8.3U — Additional Synthetic Live LLM Case Dry-Run Authorization** ✓ completed

**State:**
- authorizes only the next phase to execute exactly one synthetic live LLM call for selected case: synthetic_explicit_payment_deadline
- verifies execution plan readiness, provider openai, model gpt_4o_mini, one future call limit, kill switch and counter requirements, prompt construction deferred, prompt/model-output logging blocked, metadata capture, governance recheck, and audit requirements
- does not call live LLM, read env, import SDKs, make HTTP calls, construct final prompt text, inspect model output, process real input, or persist anything
- keeps Branch C, run-smart-talk.ts, OCR runtime, user-visible output, public runtime, persistence, and real document input blocked
- permits next phase: Additional Synthetic Live LLM Case Live Execution

---

**PHASE 8.3V — Additional Synthetic Live LLM Case Live Execution** ✓ completed

**State:**
- executes exactly one synthetic live LLM call for selected case: synthetic_explicit_payment_deadline when OPENAI_API_KEY is present; otherwise blocks safely
- uses provider openai and model gpt_4o_mini, with synthetic payment deadline prompt built in memory only
- captures metadata only, marks model output untrusted, and discards model output after receipt check
- does not log, store, return, display, or persist prompt text or model output
- blocks real input, OCR/photo/file input, real payment documents, public requests, Branch C, run-smart-talk.ts, OCR runtime, persistence, public runtime, and user-visible output
- requires post-call governance recheck and post-call audit
- does not authorize general live LLM runtime or public launch

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
