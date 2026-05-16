# Evidence Gates — Dry-Run Integration Audit (Phase 8.2C-12)

**Mode:** governance consolidation / safety audit — **not** a feature phase.  
**Scope:** architectural integrity, coupling, leakage risk, namespaces, trace consistency, production boundaries.  
**Date context:** written against evaluator version `EVIDENCE_GATE_EVALUATOR_VERSION` in `evidence-gates/constants.ts` (8.2c-11+ lineage).

---

## 1. Full pipeline audit (layer by layer)

### 1.1 Cue hits (`normalize-cue-hits.ts`)

| Aspect | Status |
|--------|--------|
| **Purpose** | Sanitize externally supplied `CueHit[]`; structural defaults (`source`, evidence level normalization, lane dropping). |
| **Safety posture** | Hits are **observations**, not claims. No inference from `documentText` inside the normalizer. |
| **Production readiness** | **safe_for_dry_run_only** as an ingestion primitive; production cue detection lives outside this package. |
| **Coupling / leakage** | `EvidenceGateInput` still carries `documentText`; the evaluator **must not** scan it for gates (see §4). Risk: future callers pass hits derived from text without documenting provenance — **process** risk, not code leakage in 8.2C. |

### 1.2 Evidence rules (`resolve-evidence-rules.ts`)

| Aspect | Status |
|--------|--------|
| **Purpose** | AND required cues per `EvidenceRule`; lane / confidence / `minimumEvidenceLevel` gates vs normalized hits. |
| **Safety posture** | Observational pass/fail only; does not authorize claims. |
| **Production readiness** | **partial_foundation** — AND-only per rule; OR remains duplicate matrix rows per spec. |
| **Coupling / leakage** | Output is `RuleEvaluationResult[]` shared across claim, reality, trap, severity dry-runs — **high reuse surface** (see §3). |

### 1.3 Rule expression (`evaluate-rule-expression.ts`)

| Aspect | Status |
|--------|--------|
| **Purpose** | Structural walk of `RuleExpression`; terminals resolved only via `RuleExpressionEvaluationContext` (no OCR). |
| **Safety posture** | Unresolved terminals fail conservatively (`allOf` / `noneOf` / `not` propagation). |
| **Production readiness** | **partial_foundation** — algebra subset; not wired as sole authority for production claims in 8.2C. |
| **Coupling / leakage** | Same `RuleEvaluationResult` type as evidence rules increases consumer confusion risk (see §3). |

### 1.4 Claim authorization dry-run (`resolve-claim-rules.ts`)

| Aspect | Status |
|--------|--------|
| **Purpose** | `candidate_*` dispositions from `ClaimRule` + evidence resolution + `forbiddenClaims` / `blockedBy` fixpoint. |
| **Safety posture** | Rows intended with `dryRun: true`, `authorizationMode: "dry_run"`, `neverUserVisible: true`. |
| **Production readiness** | **not_ready_for_production** — `trace.claimDecisions` remains `uncertain` only; dry-run is audit lane. |
| **Coupling / leakage** | **`ClaimDisposition`** mixes production-shaped (`allowed`, `blocked`, `uncertain`) with **`candidate_*`** — **dangerous shared union** if a consumer branches on `disposition` without checking `dryRun` / namespace slice. |

### 1.5 Reality authorization dry-run (`resolve-reality-authorizations.ts`)

| Aspect | Status |
|--------|--------|
| **Purpose** | `candidate_*` rows for `supportedRealities` / `blockedRealities` + severity-bridge logic. |
| **Safety posture** | Reuses `ClaimDisposition` + `RealityAuthorization`; dry-run flags mirror claims. |
| **Production readiness** | **not_ready_for_production** — `realityDecisions` still only matrix-blocked `blocked` + dry-run list separate. |
| **Coupling / leakage** | Same union risk as claims; reality vs claim homonyms on matrix vocabulary remain a **documentation** discipline (see `CONSOLIDATION_AUDIT.md`). |

### 1.6 Trap activation dry-run (`resolve-trap-activations.ts`)

| Aspect | Status |
|--------|--------|
| **Purpose** | `candidate_*` trap rows from matrix catalog + dry-run claims/realities + non-speculative evidence. |
| **Safety posture** | Explicit `sourceKind: "hallucination_trap"`; not runtime suppression. |
| **Production readiness** | **not_ready_for_production** — `trace.traps` empty on skeleton path; dry-run only on `dryRunTrapActivations`. |
| **Coupling / leakage** | **`TrapDisposition`** mixes hypothetical future values (`triggered`, `advisory`, `skipped`) with **`candidate_*`** — **split recommended** before any production trap engine (see §6). |

### 1.7 Stabilizer candidate dry-run (`resolve-stabilizer-candidates.ts`)

| Aspect | Status |
|--------|--------|
| **Purpose** | Catalog ids + audit-safe rationale when structural “pressure” gates pass. |
| **Safety posture** | No matrix example wording copied into trace; `sourceKind: "stabilizer"`. |
| **Production readiness** | **not_ready_for_production** — `trace.stabilizerCandidates` empty on skeleton path. |
| **Coupling / leakage** | **`StabilizerCandidate`** is dry-run-shaped; if reused for production emission later, **rename or fork** the type to avoid “candidate” semantics in user-visible paths. |

### 1.8 Severity derivation dry-run (`resolve-severity-derivations.ts`)

| Aspect | Status |
|--------|--------|
| **Purpose** | One `SeverityDerivation` per `SeverityRule` when matrix declares severity rules; governance-only. |
| **Safety posture** | Does not assign `trace.severity`; evaluator keeps `{ band: "none", derivedFromRuleIds: [] }`. |
| **Production readiness** | **safe_for_dry_run_only** — explicit separate type from `SeverityCandidate`. |
| **Coupling / leakage** | Low **type** coupling; medium **semantic** coupling if UI reads `derivedSeverityBand` from trace without respecting `neverUserVisible` — **consumer discipline** required. |

### 1.9 Proximity skeleton (`evaluate-proximity-constraints.ts`)

| Aspect | Status |
|--------|--------|
| **Purpose** | Equality-only constraint vs manual observations; optional on `buildGateAuditTrace`. |
| **Safety posture** | No distance engine, no text scan in gates. |
| **Production readiness** | **safe_for_dry_run_only** / **partial_foundation** — manual pipeline only in 8.2C. |
| **Coupling / leakage** | `ProximityEvaluationResult.constraintId` vs `RuleEvaluationResult.evidenceRuleId` — **disambiguation fields** on rule rows (8.2C-7); still a training issue for new engineers. |

### 1.10 Audit trace (`build-audit-trace.ts` + `evaluate-evidence-gates.ts`)

| Aspect | Status |
|--------|--------|
| **Purpose** | Single assembled `GateAuditTrace` + `traceMetadata` (stages, flags, counts, deduped notes). |
| **Safety posture** | `productionAuthorizationActive: false`, `productionWiringActive: false`, `textScanningActive: false`, `regexExecutionActive: false` documented on trace. |
| **Production readiness** | **partial_foundation** — excellent for offline audit; not a production authorization API response without redesign. |
| **Coupling / leakage** | Large trace object may tempt dashboards to surface dry-run fields — **policy** boundary (see §4). |

---

## 2. Dry-run vs production boundaries

### 2.1 Fields: `dryRun`, `authorizationMode`, `neverUserVisible`, `sourceKind`

| Structure | `dryRun` | `authorizationMode` | `neverUserVisible` | `sourceKind` | Classification |
|-----------|----------|----------------------|--------------------|----------------|----------------|
| `ClaimAuthorization` (dry-run rows from `resolveClaimRules`) | ✅ literal / common | `"dry_run"` when dry | ✅ when dry | — | **dry-run only** |
| `RealityAuthorization` (dry-run rows) | ✅ | `"dry_run"` | ✅ | — | **dry-run only** |
| `TrapActivation` (from `resolveTrapActivations`) | ✅ | `"dry_run"` | ✅ | `hallucination_trap` | **dry-run only** (8.2C path) |
| `StabilizerCandidate` | ✅ | `"dry_run"` | ✅ | `stabilizer` | **dry-run only** |
| `SeverityDerivation` | ✅ required literal | `"dry_run"` required | ✅ required | `severity_derivation` optional | **dry-run only** |
| `ClaimAuthorization` in `trace.claimDecisions` | ❌ | production-shaped `uncertain` | — | — | **future production candidate** (post-gates) |
| `RealityAuthorization` in `trace.realityDecisions` (blocked matrix surface) | ❌ | — | — | — | **declarative constitutional slice** (not “dry-run”, not supported reality) |
| `TrapActivation` in `trace.traps` | skeleton empty | — | — | — | **production_candidate_after_split** (empty placeholder) |
| `SeverityCandidate` in `trace.severity` | — | — | — | — | **future production candidate** — currently **inert** (`none`) |

### 2.2 Dangerous shared surfaces

1. **`ClaimDisposition`** — single union for skeleton `uncertain` / `blocked` and dry-run `candidate_*` and dry-run `candidate_supported` on realities. **Risk:** one switch statement treats `candidate_allowed` as production-allowed.  
2. **`TrapDisposition`** — mixes never-used-in-8.2c-skeleton values (`triggered`, …) with dry-run values. **Risk:** production trap engine reuses union without renaming.  
3. **`RuleEvaluationResult`** — used for evidence rules, rule-expression nodes, proximity skeleton rows. **Risk:** consumers use `ruleId` instead of `evidenceRuleId` / `proximityConstraintId` / `terminalKey`.  
4. **`SeverityCandidate` vs `SeverityDerivation`** — **intentional split** in 8.2C-11; **risk:** new code writes bands into `SeverityCandidate` from derivations without an explicit integration phase.

---

## 3. Type and namespace collision audit

### 3.1 Claim vs reality

| Protection | Detail |
|------------|--------|
| **Type-level** | `NamespacedClaimId` = `` `claim:${ClaimType}` ``; `NamespacedRealityId` = `` `reality:${RealityType}` ``. |
| **Risk** | Raw `ClaimType` / `RealityType` strings in maps keyed without prefix — matrix authors must keep taxonomy discipline (`CONSOLIDATION_AUDIT.md`). |

### 3.2 Severity candidate vs derivation

| Protection | Detail |
|------------|--------|
| **Type-level** | Separate interfaces; derivations only on `dryRunSeverityDerivations`. |
| **Risk** | Dashboard reads wrong field; duplicate band vocabulary in two shapes. |

### 3.3 Rule ids vs terminal keys vs proximity ids

| Protection | Detail |
|------------|--------|
| **8.2C-7 fields** | `evidenceRuleId`, `proximityConstraintId`, `terminalKey`, `sourceKind` on `RuleEvaluationResult`. |
| **Risk** | Legacy `ruleId` still mirrored; external tools grep wrong field. |

### 3.4 Stabilizer ids vs evidence rule ids

| Protection | `stabilizerRuleId` / optional `stabilizerId` prefix pattern; not aligned with evidence rule id namespace. |
| **Risk** | Low if ids remain human-readable catalog strings; collisions only if naming convention slips. |

### 3.5 Trap ids vs evidence rule ids

| Protection | `trapId` is `HallucinationTrap.id`; separate from `EvidenceRule.id`. |
| **Risk** | Copy-paste id strings in tests — use matrix constants. |

### 3.6 Recommended future split points (no refactor now)

- Split **`ClaimDisposition`** → `ProductionClaimDisposition` | `DryRunClaimDisposition` (or wrap dry-run rows in `DryRunClaimAuthorization`).  
- Split **`TrapDisposition`** → production vs dry-run enums or branded strings.  
- Narrow **`RuleEvaluationResult`** per `sourceKind` via discriminated unions when consumers exist.  
- Keep **`trace.dryRun*`** prefix convention for all non-production rows indefinitely.

---

## 4. Governance safety audit (non-goals and where enforced)

| Non-goal | Where enforced / documented |
|----------|----------------------------|
| No production **claim** authorization | `evaluateEvidenceGates`: `claimDecisions` only `uncertain` for matrix-allowed types; `resolveClaimRules` produces `candidate_*` only on separate trace list. |
| No production **supported realities** | Dry-run realities only on `dryRunRealityAuthorizations`; production list not populated here. |
| No runtime **trap suppression** | `trace.traps` empty; trap signals on `dryRunTrapActivations` only. |
| No **severity** escalation in product | `trace.severity` fixed `none`; bands only on `dryRunSeverityDerivations`. |
| No **Smart Talk** / API / UI wiring | Package under `reality-matrix/evidence-gates`; no imports from Smart Talk result builders in this audit scope (verify on integration PRs). |
| No **OCR / regex** inside gates | `traceMetadata.textScanningActive: false`, `regexExecutionActive: false`; resolvers do not accept raw text for matching. |
| No **explanation** rewriting | No string fields aimed at end-user copy in dry-run resolvers; stabilizer matrix prose not copied to trace. |

**Residual risk:** Nothing prevents a **different package** from importing `evaluateEvidenceGates` and misusing the trace. Boundaries are **code + review**; not cryptographic.

---

## 5. Trace consistency audit

### 5.1 Stage naming (`trace-constants.ts`)

Ordered pipeline reflected in `traceMetadata.stages` (when corresponding inputs exist):

1. `input_received`  
2. `cue_hits_normalized`  
3. `evidence_rules_resolved` (if evidence resolution ran)  
4. `claim_authorization_dry_run` (if dry-run claim rows)  
5. `reality_authorization_dry_run` (if dry-run reality rows)  
6. `trap_activation_dry_run` (if dry-run trap rows)  
7. `stabilizer_candidate_dry_run` (if stabilizer dry-run rows)  
8. `severity_derivation_dry_run` (if matrix has `severityRules`)  
9. `proximity_skeleton` (if proximity params active)  
10. `audit_trace_built`  
11. `skeleton_no_production_authorization`

**Consistency:** Major dry-run layers each have a stage string when their slice is present (severity gated on matrix having rules, not on row count — derivations are per-rule).

### 5.2 Metadata and notes

- Count / id list metadata parallels each dry-run slice (`claimAuthorizationDryRunCount`, … `severityDerivationCount`, …).  
- Deduped notes include canonical tokens: `claim_candidates_are_dry_run_only`, `trap_activation_dry_run_only_not_runtime_enforced_in_8_2c_9`, `stabilizer_candidates_dry_run_only_not_user_visible_in_8_2c_10`, `severity_derivation_dry_run_only_not_runtime_enforced_in_8_2c_11`, etc.  
- `unsupportedFeatures` lists explicit non-implemented or non-production items (evaluator version string encodes phase lineage).

### 5.3 Namespace hygiene

- Metadata `candidate*ClaimIds` / `candidate*RealityIds` use namespaced ids aligned with row `namespaceId`.  
- Severity bands in metadata are `ProceduralSeverityBand[]` (typed), not free strings.

---

## 6. Architectural debt — future refactor / split boundaries

| Item | Why split later |
|------|-----------------|
| **TrapDisposition** | Production engine needs lifecycle states unrelated to `candidate_*` audit vocabulary. |
| **SeverityCandidate** | Should absorb only **production-enforced** bands + provenance; keep `SeverityDerivation` for audit-only OR merge behind explicit mapper. |
| **RuleEvaluationResult specialization** | Discriminated unions by producer (`evidence_rule` vs `proximity_constraint` vs `rule_expression`) reduce accidental field reuse. |
| **Production runtime separation** | Separate package or boundary module: “authorization decision” vs “governance dry-run trace builder”. |
| **Production trace separation** | Option: strip `dryRun*` slices from production telemetry; keep full trace only in debug / compliance mode. |
| **Runtime governance engine** | Future service that reads matrix + hits + policy version; 8.2C stays pure library. |
| **Explanation governance layer** | Must sit **above** gates and **never** infer from `dryRun*` rows without explicit product policy. |
| **Production stabilizer engine** | Emission policy + copy deck + A/B — orthogonal to `StabilizerCandidate` id lists. |

---

## 7. Production readiness assessment (conservative)

| Subsystem | Rating |
|-----------|--------|
| Cue normalization | **safe_for_dry_run_only** |
| Evidence rule resolution | **partial_foundation** |
| Rule expression walker | **partial_foundation** |
| Claim dry-run | **not_ready_for_production** (union + semantics) |
| Reality dry-run | **not_ready_for_production** |
| Trap dry-run | **not_ready_for_production** (`TrapDisposition` mix) |
| Stabilizer dry-run | **not_ready_for_production** |
| Severity derivation dry-run | **safe_for_dry_run_only** (isolated type; no runtime wiring) |
| Proximity skeleton | **safe_for_dry_run_only** |
| Gate audit trace | **partial_foundation** |
| End-to-end `evaluateEvidenceGates` as production API | **not_ready_for_production** |

**Overall:** 8.2C is **governance + observability + test harness** — appropriate **dry-run only** until explicit split + integration phase with regression corpus and consumer contracts.

---

## 8. Sign-off checklist (8.2C-12)

- [x] Full dry-run pipeline inventoried.  
- [x] Leakage and coupling risks documented.  
- [x] Namespace / type collision risks documented.  
- [x] Governance boundaries tied to concrete trace / evaluator behavior.  
- [x] No code behavior changes in this phase (audit + docs only).  

---

## 9. References (in-repo)

- `EVIDENCE_GATES_SPEC.md` — behavioral contract.  
- `evidence-gates/README.md` — phase history.  
- `CONSOLIDATION_AUDIT.md` — ontology / homonym notes.  
- `evidence-gates/evaluate-evidence-gates.ts` — pipeline order and production posture.  
- `evidence-gates/build-audit-trace.ts` — trace assembly.  
- `evidence-gates-types.ts` — shared types and unions.
