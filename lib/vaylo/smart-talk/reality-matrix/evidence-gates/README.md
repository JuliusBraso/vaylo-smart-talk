# Evidence Gate evaluator skeleton (Phase 8.2C-1)

## 1. What this is

A **pure-function** package under `reality-matrix/evidence-gates/` that introduces:

- `evaluateEvidenceGates` — entry point returning `EvidenceGateDecision` + **mandatory** `GateAuditTrace`
- `evaluateRuleExpression` — partial **rule algebra** only (no document access)
- `resolveEvidenceRules` — matrix `EvidenceRule[]` vs normalized `CueHit[]` (8.2C-4, observational only)
- `resolveClaimRules` — matrix `ClaimRule[]` vs resolved evidence rules (8.2C-5 **dry-run** only)
- `evaluateProximityConstraints` — manual observations vs constraints, equality-only (8.2C-6 **skeleton**)
- `resolveRealityAuthorizations` — matrix realities vs evidence + claim dry-run (8.2C-8 **dry-run only**)
- `resolveTrapActivations` — matrix `HallucinationTrap[]` vs dry-run claims/realities + evidence (8.2C-9 **dry-run only**)

This is **not** full Evidence Gates. It is a **conservative runtime skeleton** so later stages can grow inside a stable module boundary.

## 2. What it intentionally does not do

- No **keyword ⇒ allowed claim**
- No **regex execution** on `documentText`
- No **cue resolution** from raw text (hits must be supplied on input; they are **not** used to allow claims)
- No **proximity**, **lane assignment**, or **deadline synthesis**
- No **Smart Talk**, **OpenAI**, **routes**, or **OCR** integration

## 3. Why the default output is conservative

`evaluateEvidenceGates`:

- Never sets a claim to **`allowed`**
- Emits matrix **`allowedClaims`** claim types only as **`uncertain`** (for traceability when `input.matrix` is provided)
- Records **`blockedRealities`** from the matrix as **`blocked`** reality rows (declarative surface only)
- Sets severity to **`none`** until a real severity engine exists

**Default posture:** *uncertain / blocked, not allowed.*

## 4. Why keyword matching is forbidden here

Per `EVIDENCE_GATES_SPEC.md`, substring hits are **hypotheses** until lane scope, proximity, and rule algebra pass. This skeleton **does not implement** those layers; therefore it **must not** upgrade hits to authorizations.

## 5. Why audit traces are mandatory

Every call returns a `GateAuditTrace` with `traceMetadata` (evaluator version, stages, safety posture, unsupported feature list, notes). Without this, future debugging of false positives would be **non-auditable**.

## 6. Future stages (then Smart Talk integration)

1. Cue detection (regex/keyword, OCR-tolerant)  
2. Lane binding  
3. Proximity windows  
4. Full rule algebra + `noneOf` semantics  
5. Claim authorization + conditional forbidden  
6. Trap triggering + severity precedence  
7. Stabilizer candidate policy  
8. **Optional** consumption by Smart Talk / strict_document (explicit wiring phase — **not** 8.2C-1)

See `../EVIDENCE_GATES_SPEC.md` and `../CONSOLIDATION_AUDIT.md`.

---

## Phase 8.2C-2 — Rule Expression Walker v1

`evaluateRuleExpression` now **recursively walks** `RuleExpression` trees for **structural boolean logic only**: `allOf`, `anyOf`, `noneOf`, and `not`.

**Terminal nodes** (`cue`, `ruleRef`, `proximity`, `laneScope`, `minEvidence`, `conditionalForbidden`) are **never** evaluated from OCR or document text. They resolve **only** from an optional `RuleExpressionEvaluationContext`: `terminalResults[terminalKey(expr)]` and/or `resolveTerminal(expr)`. Import **`terminalKey`** from `./evaluate-rule-expression` for stable map keys. If neither source supplies a result, the terminal returns `matched: false`, `reason: "unresolved_terminal_expression"`, `unresolved: true`, and `unsupportedFeatures` including the terminal op — **not** legal safety from absence.

**Conservative composition:** `allOf` and `noneOf` fail if any child is unresolved. `anyOf` can match only when at least one **resolved** child matches positively. `not` fails if the child is unresolved (`unresolved_not_child`). Negative logic must not treat unknown branches as proof of negation.

This phase **does not** wire the walker into production, Smart Talk, or claim authorization; it is a **pure, auditable** building block (`expressionKind`, `childResults`, `terminalKey` on `RuleEvaluationResult` where applicable).

---

## Phase 8.2C-3 — Cue Hit Model + Manual Cue Injection

**Cue hits are externally supplied observations** — not automatic cue detection. There is **no** scanning of `documentText`, **no** regex execution, and **no** Smart Talk wiring in this phase.

Use `normalizeCueHits` from `./normalize-cue-hits` to sanitize arrays before tests or controlled evaluation. Defaults: empty `cueHits` is allowed; missing `source` becomes `"manual"`.

**Cue hit ≠ claim** and **cue hit ≠ legal reality**. Even a high-confidence manual hit must **not** authorize a claim until future gate phases wire rule algebra, proximity, and matrix policy.

`evaluateEvidenceGates` still never emits `disposition: "allowed"` for claims. Matrix `allowedClaims` rows continue to appear only as **`uncertain`**. **`allowedClaims` as an authorization list remains empty** in the sense that nothing is promoted to allowed — the skeleton does not populate supported realities or severity from hits.

Example (Mahnung-style cue id only — still **does not** authorize `enforcement_risk`):

```typescript
cueHits: [
  {
    cueId: "cue_mah_vollstreckung_explicit",
    lane: "escalation",
    confidence: 0.95,
    source: "manual",
  },
],
```

The audit trace lists **structural** cue fields (`cueId`, `lane`, `confidence`, offsets, `source`, `notes`); `matchedText` / `matchedKeyword` are **not** echoed on `trace.cueHits` (see `matchedTextObservationCount` in `traceMetadata`). Canonical audit notes include `cue_hits_are_observations_not_claims` (8.2C-7).

---

## Phase 8.2C-4 — Evidence Rule Resolution v1

`resolveEvidenceRules({ rules, cueHits })` compares **normalized** `CueHit[]` to matrix **`EvidenceRule[]`** and returns `RuleEvaluationResult[]` — **evidence-rule resolution only**, not claim authorization.

**Semantics (v1):** each rule’s `requiredCueIds` are **AND**-conjoined (every id must have at least one qualifying hit). **OR** within a single rule is **not** implemented — disjunction stays **separate matrix rows**, per consolidation notes. `optionalCueIds` are **observed** in `matchedOptionalCueIds` only; they never force a match.

**Gates:** `minimumEvidenceLevel` on the rule applies to each required hit’s `evidenceLevel`; hits **without** `evidenceLevel` cannot satisfy a rule. Optional matrix field `minConfidence` (`MatrixConfidenceFloor`) requires every required hit to declare numeric `confidence` meeting that floor. If `allowedLanes` is non-empty, each required hit must declare `lane` ∈ `allowedLanes` — **no lane inference** from text or `cueId`.

**Not in this phase:** a **full** proximity engine, regex, `documentText` scanning, traps, stabilizers, severity from matches, `supportedRealities`, or changing claim rows from **`uncertain`** to **`allowed`**. When rules match, `evaluateEvidenceGates` still returns the same conservative claim posture; the trace adds `evidenceRuleResolutionResults`, `ruleEvaluations` pass/fail rows, and metadata (`evidenceRuleEvaluationCount`, `matchedEvidenceRuleIds`, `unmatchedEvidenceRuleIds`, `missingCueSummary`) keyed by `evidenceRuleId ?? ruleId` (8.2C-7).

---

## Phase 8.2C-5 — Claim Authorization Dry Run v1

`resolveClaimRules({ claimRules, evidenceRuleResults, forbiddenClaimTypes? })` returns **`{ authorizations, unsupportedFeatures }`** — each authorization uses `disposition` **`candidate_allowed` | `candidate_blocked` | `candidate_uncertain`**, always with **`dryRun: true`**. This is **audit / simulation only**: no Smart Talk wiring, no user-visible explanations, no production `allowed` in `trace.claimDecisions`.

**Semantics:** `requiredEvidenceRuleIds` on an allowed `ClaimRule` are **AND**-only; **OR** remains **duplicate `ClaimRule` rows** on the matrix. `ClaimRule.allowed === false` → `candidate_blocked` + `dryRunReason: "claim_rule_forbidden_by_matrix"`. Missing / unmatched required evidence → `candidate_uncertain` + `required_evidence_rules_not_satisfied`. Satisfied path still requires non-speculative evidence levels on matched rules and `ClaimRule.minimumConfidence` vs the **minimum** confidence among those rules — otherwise `candidate_uncertain`. **`blockedBy`:** conservative fixpoint over `candidate_allowed` peers; `forbiddenClaims` entries block peers; unresolved `blockedBy` targets (no `ClaimRule` row) → `candidate_uncertain` + `unsupportedFeatures` entries.

**Trace:** `dryRunClaimAuthorizations` plus `traceMetadata` (`claimAuthorizationDryRunCount`, `candidateAllowedClaimIds`, …) and canonical note `claim_candidates_are_dry_run_only` when dry-run rows exist (8.2C-7). **`trace.claimDecisions`** stays **`uncertain`** for matrix-allowed claim types only — **never** `allowed`. A **structural proximity skeleton** exists from **8.2C-6** (manual observations only — not a distance engine).

---

## Phase 8.2C-6 — Proximity Constraint Skeleton v1

Types live in **`proximity-types.ts`** (`ProximityObservation`, `ProximityConstraint`, `ProximityEvaluationResult`, `ProximityAnchorType`, `ProximityRelationship`). Observations are **injected manually or by an external system** — there is **no** OCR, token distance, layout parsing, regex proximity, or automatic IBAN / deadline / Vollstreckung association in this repo phase.

**`evaluateProximityConstraints({ constraints, observations })`** returns one `ProximityEvaluationResult` per constraint: a row **matches** only when an observation has the **same** `sourceCueId`, `targetCueId`, and `relationship` (and, if the constraint sets `anchorType`, the observation must declare the **same** `anchorType`). Confidence on a match is the **max** of matching observation confidences (0 if none declared). This exists so future engines cannot silently treat unrelated cue co-occurrence as legal proximity.

> **Proximity observations are not proof of legal meaning.**

**Rule algebra:** for `RuleExpression` nodes with `op: "proximity"`, `evaluateRuleExpression` may read **`context.proximityEvaluationByTerminalKey[terminalKey(expr)]`** after `resolveTerminal` / `terminalResults` — still **no** `documentText`.

**Audit:** when `buildGateAuditTrace` receives optional `proximityObservations` / `proximityConstraints`, it runs the skeleton evaluator when **both** lists are non-empty, sets `trace.proximityConstraintEvaluationResults`, and adds `traceMetadata` (`proximityObservationCount`, `matchedProximityConstraintIds`, `unresolvedProximityConstraintIds`) plus the canonical audit token `manual_proximity_only_no_text_scanning` when proximity parameters are present (8.2C-7). Later phases (e.g. **8.2C-8**, **8.2C-9**) extend the trace with additional dry-run surfaces without changing proximity matching semantics here.

---

## PHASE 8.2C-7 — Gate Audit Trace Hardening v1

This phase adds **no new reasoning behavior**, **no production claim authorization**, and **no Smart Talk wiring**. It only sharpens audit artifacts so future production authorization work cannot misread traces.

- **Stable stages:** `traceMetadata.stages` uses frozen labels from `trace-constants.ts` (e.g. `input_received`, `cue_hits_normalized`, …, `audit_trace_built`, `skeleton_no_production_authorization`). The legacy export `TRACE_STAGE_SKELETON_NO_RUNTIME` is an alias for `skeleton_no_production_authorization`.
- **Identifier hygiene:** `RuleEvaluationResult` carries optional `evidenceRuleId`, `proximityConstraintId`, `terminalKey`, and `sourceKind` (`evidence_rule` \| `rule_expression` \| `proximity_constraint` \| `skeleton`). The legacy `ruleId` field remains for backward compatibility but may mirror either an evidence rule id or a proximity constraint id depending on the producer — **consumers should prefer the explicit fields.**
- **Why keep `terminalKey`, `constraintId`, and `evidenceRuleId` separate:** `terminalKey` is a deterministic AST path key for `RuleExpression` map lookups; `proximityConstraintId` refers to rows from the manual proximity skeleton (`ProximityEvaluationResult.constraintId`); `evidenceRuleId` refers to matrix `EvidenceRule.id`. Conflating them in one field has caused trace ambiguity; 8.2C-7 makes the separation explicit without changing matching semantics.
- **Dry-run claims:** `resolveClaimRules` rows always include `dryRun: true`, `authorizationMode: "dry_run"`, and `neverUserVisible: true`. Canonical notes include `claim_candidates_are_dry_run_only` alongside caller-supplied prose.
- **Namespaces:** `candidate*ClaimIds` and `blockedRealityIds` in `traceMetadata` use `claim:*` and `reality:*` namespace ids (same as `namespaceId` on authorization rows) — raw `ClaimType` / `RealityType` labels are not flattened into separate parallel arrays.
- **Static metadata flags:** `productionAuthorizationActive`, `productionWiringActive`, `textScanningActive`, `regexExecutionActive`, `cueDetectionMode`, `claimAuthorizationMode`, and `proximityMode` are **documentation-only** fields on the trace; they do not alter evaluation outcomes.

---

## PHASE 8.2C-8 — Reality Authorization Dry Run v1

`resolveRealityAuthorizations({ matrix, evidenceRuleResults, claimAuthorizations })` returns **`RealityAuthorization[]`** with `disposition` in **`candidate_supported` \| `candidate_blocked` \| `candidate_uncertain`**, always with **`dryRun: true`**, **`authorizationMode: "dry_run"`**, and **`neverUserVisible: true`**. Rows are written only to **`trace.dryRunRealityAuthorizations`** (and related `traceMetadata` id lists) — **not** production supported realities, **not** Smart Talk, **not** user-visible truth.

- **Matrix blocked:** every `matrix.blockedRealities` entry yields **`candidate_blocked`**, **`dryRunReason: "reality_blocked_by_matrix"`**, **`confidence: 1`**, **`namespaceId: reality:<type>`**. The constitutional surface **`trace.realityDecisions`** still carries matrix-blocked rows as **`blocked`** (non–dry-run trace slice) for backward compatibility.
- **Supported list:** each `matrix.supportedRealities` entry not already covered by blocked logic is evaluated conservatively from **matched non-speculative** `EvidenceRule` resolution rows, **`SeverityRule`** bridges (`realitiesThatMayTrigger` / `blockedWhenRealities` vs `claimTypesThatMayTrigger`), and **`candidate_allowed`** claim dry-run rows. There is **no** OCR, **no** `documentText` scan, **no** regex execution, **no** cue inference, **no** trap/stabilizer engine, and **no** explanation generator.
- **Speculative evidence:** if only speculative (or evidence-level–missing) matches exist, **`candidate_supported` is never emitted**; rows use **`candidate_uncertain`** with **`dryRunReason: "speculative_evidence_not_authorizing_reality"`** (mandatory).
- **Contradictions:** `blockedWhenRealities` on a `SeverityRule` with overlapping `claimTypesThatMayTrigger` vs `candidate_allowed` forces **`candidate_uncertain`** for that reality (not supported). When `candidate_allowed` claims exist but no severity rule declares a bridge for a supported reality, the resolver stays **`candidate_uncertain`** (`dry_run_claims_present_reality_bridge_not_declared`).
- **Confidence:** `candidate_supported` uses the **minimum** confidence among supporting non-speculative matched rules (or **0** if none numeric); `candidate_uncertain` uses **0**; matrix-blocked dry-run rows use **1** as specified.

> **Reality authorization candidates are bounded procedural hypotheses, not legal truth.**

The evaluator still does **not** populate any production **`supportedRealities`** field on `EvidenceGateDecision` (that concept remains outside this trace-only dry-run list).

---

## PHASE 8.2C-9 — Trap Activation Dry Run v1

`resolveTrapActivations({ matrix, evidenceRuleResults, claimAuthorizations, realityAuthorizations })` returns **`TrapActivation[]`** with **`disposition`** in **`candidate_triggered` \| `candidate_not_triggered` \| `candidate_uncertain`**, always **`dryRun: true`**, **`neverUserVisible: true`**, **`authorizationMode: "dry_run"`**, and **`sourceKind: "hallucination_trap"`**. Rows are stored only in **`trace.dryRunTrapActivations`** — **`trace.traps`** remains the non–dry-run slice (still empty in the skeleton entry path).

- **Inputs only:** matrix **`HallucinationTrap`** catalog, **`candidate_allowed`** claim dry-run rows, **`candidate_supported`** reality dry-run rows where relevant, and **matched non-speculative** evidence rule resolution rows. **No** `documentText`, **no** regex, **no** OCR inference, **no** NLP on `dangerousInference` prose, **no** Smart Talk wiring, **no** runtime suppression of claims/realities/explanations.
- **Enforcement-cluster traps:** a conservative allow-list of trap **`kind`** values plus `relatedClaimTypes` containing **`enforcement_risk`** requires a **payment/escalation reality anchor** (`candidate_supported` reality type in a fixed anchor set aligned with matrix vocabulary) before **`candidate_triggered`**; otherwise **`candidate_uncertain`** (`dry_run_trap_enforcement_cluster_without_reality_anchor`).
- **Other traps with `relatedClaimTypes` overlap:** **`candidate_triggered`** with **`dry_run_related_claim_with_evidence_signal`** when non-speculative matched evidence exists.
- **Speculative-only (or missing evidence level) matches:** **`candidate_triggered` is never emitted**; use **`candidate_uncertain`** with **`reason: "speculative_evidence_not_triggering_trap"`** when claim overlap exists but no non-speculative matched evidence path.
- **Audit:** `traceMetadata` adds `trapActivationDryRunCount`, `candidateTriggeredTrapIds`, `candidateUncertainTrapIds`, `candidateNonTriggeredTrapIds`, `trapAuthorizationMode`, stage **`trap_activation_dry_run`**, and note **`trap_activation_dry_run_only_not_runtime_enforced_in_8_2c_9`**.

> **Trap activation candidates are governance observations, not legal conclusions.**

