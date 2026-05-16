# Simulation Boundary Mapping Audit (Phase 8.2D-2)

**Mode:** governance audit — **no new runtime behavior**, **no changes** to `run-reality-simulation.ts`, `reality-simulation-types.ts`, or Evidence Gates resolvers in this phase.

**Scope:** read-only review of **8.2D-1** skeleton mapping from `EvidenceGateDecision.trace` → `RealitySimulationResult`, plus type unions and `REALITY_SIMULATION_SPEC.md` alignment.

**Artifacts reviewed:** `reality-simulation/run-reality-simulation.ts`, `reality-simulation-types.ts`, `REALITY_SIMULATION_SPEC.md` (and trace shapes **as consumed** by simulation).

---

## 1. Executive verdict

**Verdict:** **Yes — safe enough to remain a pre-explanation governance layer for dry-run governance only**, provided all consumers treat output as **non-authoritative**, **never user-visible by default**, and **not** a substitute for production authorization or legal truth.

**Caveats (must be honored):**

1. **`enforcementTrapHeuristic`** is **skeleton-only**: substring checks on `trapKind` are **not** production-safe for explanation boundaries and **must** be replaced by **structured trap metadata** before any production explanation policy depends on it.  
2. **Severity** uses **max band** across `candidate_derived` rows — a deliberate simplification with **over-escalation** risk in multi-rule matrices until a **severity policy graph** exists.  
3. **`human_review_recommended`** fires on **critical** severity posture *or* matrix mismatch *or* speculative `unsupportedFeatures` substring match — **false-positive** risk for “review” fatigue.  
4. Several **`ExplanationBoundary`** literals are **defined in types** but **not emitted** by the skeleton — inconsistency is documentation debt, not a runtime bug.

**Overall production readiness:** **`safe_for_dry_run_only` / `partial_foundation`** — **not** production-ready for automated user-facing decisions.

---

## 2. Boundary token inventory

### 2.1 Emitted by `buildExplanationBoundaries` (skeleton v1)

| Token | Purpose | Source trigger (category) | Overuse risk | Underuse risk | Production readiness |
|-------|---------|----------------------------|---------------|---------------|------------------------|
| `do_not_present_dry_run_as_fact` | Forbid treating dry-run rows as user truth | **Always** | Low (always on) | N/A | **Dry-run only** — appropriate |
| `do_not_present_speculation_as_fact` | Block speculative factual assertion | **Always** | Low | N/A | **Dry-run only** |
| `require_uncertainty_wording` | Force hedging policy downstream | Uncertain realities **or** uncertain traps **or** speculative `unsupportedFeatures` | **Medium** — broad “uncertain trap” | Missed hedge if traps omitted | **Skeleton** — tune with trap metadata |
| `do_not_claim_enforcement` | Block enforcement-as-fact | Any trap triggered/uncertain **or** `enforcementTrapHeuristic` | **High** if heuristic false positive | User text asserts enforcement | **Not production** until heuristic removed |
| `do_not_merge_lanes` | Lane isolation | Any trap triggered/uncertain | **Medium** — any trap toggles | Lane bleed in copy | **Skeleton** |
| `do_not_calculate_deadline` | No calendar synthesis | **Always** | Low | Deadline invention | **Good invariant** |
| `do_not_merge_payment_and_appeal` | Lane separation | **Always** | Low | Payment/appeal merge | **Good invariant** |
| `recommend_human_review_high_risk` | Human review hint (boundary, not prose) | Matrix mismatch **or** speculative feature flag | **Medium** — substring on `unsupportedFeatures` | Under-alert | **Skeleton** |

### 2.2 Defined on `ExplanationBoundary` but **not** emitted by skeleton v1

| Token | Notes |
|-------|--------|
| `do_not_claim_finality` | Policy placeholder — **gap**: skeleton never adds it. |
| `use_relative_deadline_wording_only` | Not wired to trace signals in v1. |
| `mention_uncertainty_if_ocr_noisy` | No OCR noise field consumed in v1. |
| `recommend_human_review_for_high_risk` | Cousin token to `recommend_human_review_high_risk` — **naming duplication risk** for downstream parsers. |

**Consistency note:** Skeleton always adds `recommend_human_review_high_risk` (not `…_for_high_risk`). Consumers must not assume the union is exhaustively produced.

---

## 3. Trap influence audit

### 3.1 `trapWarnings` mapping

- **`candidate_triggered`** → `TrapWarning` with `influence: "boundary_candidate"`.  
- **`candidate_uncertain`** → `influence: "uncertainty"`.  
- **`candidate_not_triggered`** → **no** warning row.

**Assessment:** Coarse but readable. **Influence** field values are **not** consumed further inside the skeleton (no second-order mapping) — downstream-only.

### 3.2 Trap activation → explanation boundaries

Any **triggered or uncertain** trap adds **`do_not_claim_enforcement`** and **`do_not_merge_lanes`**, plus contributes to **`require_uncertainty_wording`** (uncertain traps) and review **`escalation_ambiguity`**.

**Broadness risk:** **Any** non-`not_triggered` trap widens enforcement + lane boundaries — may be **too broad** for benign trap kinds until trap metadata classifies **severity of communicative impact**.

### 3.3 `enforcementTrapHeuristic` — **skeleton-only / unsafe for production boundaries**

**Implementation (read-only audit):** `trapKind.includes("enforcement" | "vollstreckung" | "mahnung" | "escalation")` for triggered/uncertain traps.

**Why unsafe for production:**

- **False positives:** e.g. kinds containing `"mahnung"` or `"escalation"` may fire **informational** or **clarification** traps unrelated to enforcement-as-fact.  
- **Locale / naming drift:** matrix authors renaming kinds can accidentally flip boundaries.  
- **No structural link** to `relatedClaimTypes`, enforcement cluster flags, or matrix catalog tags.

**Mandatory future fix:** Replace with **structured trap metadata** (e.g. `communicativeImpact: "enforcement_assertion_risk"`, `boundaryProfileId`, frozen enum from matrix schema). **Do not** use substring `trapKind` for production explanation policy.

---

## 4. Stabilizer influence audit

### 4.1 `stabilizerNeeds` mapping

Each dry-run stabilizer row → `StabilizerNeed` with fixed **`category: "stabilizer_governance_candidate"`**, `reasonCode` from stabilizer `reason` or default, optional linked trap/reality/claim ids.

**Non-user-visible:** No matrix `allowedWordingExamples` / prose copied — **good**.

### 4.2 False reassurance risk

**Low in v1** — category is generic string, not calming copy. **Future risk:** if UI maps `stabilizer_governance_candidate` → “user is safe” without evidence checks → **false reassurance**. Needs **stabilizer category schema** + policy table.

### 4.3 Future structured metadata

- Stabilizer **intent class** (calming vs informational vs defer-to-authority).  
- **Eligibility preconditions** (which trap ids, which reality types).  
- **Explicit “never auto-emit wording”** flags at matrix level.

---

## 5. Severity influence audit

### 5.1 `severityPostureCandidate`

- Built **only** from `trace.dryRunSeverityDerivations`.  
- **`neverUserVisible: true`** on type — **good** signal.  
- **Max `derivedSeverityBand`** among rows with `disposition === "candidate_derived"`; if none, `band: "none"` with `reviewNeeded` when any uncertain derivation exists.

### 5.2 Risks

- **Over-escalation:** max band ignores **which** rule fired or **precedence** — multi-rule matrices can surface a **high** posture when another rule would counsel **low** for the same trace.  
- **Under-escalation:** if all derivations uncertain/blocked, posture collapses to **none** even when traps imply high communicative risk — mitigated partly by trap review flags, not symmetric.

### 5.3 `trace.severity` vs `SeverityDerivation`

**Audit requirement:** **`SeverityDerivation`** (dry-run rows) and **`SeverityCandidate`** (`trace.severity`, still inert in evaluator) **must not be merged** without an explicit production integration phase and policy graph. Skeleton correctly reads **derivations only** for posture; it does **not** write `trace.severity`.

---

## 6. Human review flag audit

| Flag | Trigger source | False-positive risk | False-negative risk | Production readiness |
|------|------------------|---------------------|---------------------|------------------------|
| `matrix_mismatch_detected` | `trace.matrixMismatchFlag` | Low | Low if flag reliable | **Dry-run OK** |
| `speculative_support_present` | `unsupportedFeatures` substring `speculative` / `speculation` | **Medium** — string match | Miss if feature string changes | **Skeleton only** |
| `escalation_ambiguity` | Any trap triggered **or** uncertain | **Medium** — broad | Low | **Skeleton** |
| `contradictory_world_state` | Trap triggered **and** severity band ≥ medium | **Medium** — heuristic tension, not logical contradiction | Real contradictions unflagged | **Skeleton** |
| `human_review_recommended` | critical band **or** mismatch **or** speculative feature | **High** — frequent alerts | Lower if thresholds tuned | **Not production** without policy |
| `high_consequence_domain` | Trap triggered **and** (high or critical posture) | Medium | Under-tagged low-band serious cases | **Skeleton** |
| `professional_advice_recommended` | — | — | **Never emitted** in v1 | **Gap** |
| `authority_contact_recommended` | — | — | **Never emitted** in v1 | **Gap** |

---

## 7. Dry-run leakage audit

| Signal | Leakage risk if mis-consumed | Mitigation in artifact |
|--------|------------------------------|-------------------------|
| `supportedRealityCandidates` | Mistaken for “true supported reality” | Disposition `supported_candidate`; boundaries say do not present dry-run as fact |
| `consideredClaimCandidates` | Mistaken for `allowed` claims | `considered_candidate` + forbidden moves assert_dry_run_claim_as_user_fact |
| `severityPostureCandidate` | Mistaken for UI urgency / runtime severity | `neverUserVisible: true`; forbidden move `use_severity_posture_for_ui_urgency` |
| `stabilizerNeeds` | Mistaken for copy deck | Catalog ids + machine `reasonCode` only |
| `trapWarnings` | Mistaken for “enforcement happening” | Dry-run governance only; boundaries block enforcement claims |

**Residual risk:** **Consumer discipline** — nothing cryptographically prevents a downstream service from ignoring boundaries.

---

## 8. Uncertainty preservation audit

**Preserved (not collapsed to factual certainty):**

- Uncertain dry-run realities → `uncertainRealities` + per-row `uncertaintyReasons`.  
- Uncertain traps → `dry_run_trap_ambiguity` + boundaries + `escalation_ambiguity`.  
- Speculative substring in metadata → reason + flags + boundaries.  
- Matrix mismatch → reason + flags + boundaries.  
- Uncertain dry-run claims → `hidden_candidate` in `blockedClaimCandidates` path (naming: “blocked” slice includes hidden — **semantic quirk** for auditors: still **not** promoted to allowed).

**Gap:** No explicit **uncertainty reason** for “only `candidate_not_triggered` traps” ambiguous world — intentional silence.

---

## 9. Namespace / ID audit

| ID space | Collision / ambiguity | Notes |
|----------|----------------------|--------|
| `claim:*` / `reality:*` | Homonym taxonomy | Simulation strips prefixes to `ClaimType` / `RealityType` — same as gates |
| `trapId` | Catalog string | Distinct from evidence rule ids if naming discipline holds |
| `stabilizerRuleId` | Matrix stabilizer | Not evidence-rule id |
| `severityRuleId` | Only inside trace derivations | Not re-surfaced in simulation result as list in v1 |
| `ExplanationBoundary` / `SimulationGovernanceFlagId` | `recommend_human_review_*` duplicate | Parser ambiguity risk |
| `forbiddenExplanationMoves` | Free string array | Namespace weaker than unions — future enum recommended |

---

## 10. Non-user-visible guarantee audit

- **No** Slovak/German or templated user sentences in simulation output structures.  
- **No** Smart Talk / API / UI references in module.  
- **`notes` / `reasonCode`** may echo gate **machine** strings — still not product copy; risk is **telemetry leakage of internal notes**, not “explanation generation.”

---

## 11. Future required fixes before production

1. **Replace `enforcementTrapHeuristic`** with structured trap metadata and explicit boundary profiles.  
2. **Severity policy graph** (precedence, caps by trap class, lane-aware posture).  
3. **Stabilizer category schema** + anti-false-reassurance rules.  
4. **Explanation boundary policy table** (versioned, testable) — align type union with emitted set.  
5. **Review flag threshold policy** (rates, dedupe across sessions, product ownership).  
6. **Regression corpus** (trace fixtures → expected `RealitySimulationResult`).  
7. **Adversarial tests** (misleading trap kinds, conflicting rules, empty dry-run slices).  
8. **Production vs dry-run type splits** at consumer boundaries (see `EVIDENCE_GATES_DRY_RUN_AUDIT.md` themes).

---

## 12. Final recommendation

**Classification:** **`safe_for_dry_run_only`** with **`partial_foundation`** qualities (good invariants on deadlines / dry-run-as-fact / no UI wiring; weak on trap substring, severity max, review frequency).

**Not `not_ready_for_production`** for the narrow purpose of **offline governance scaffolding**, but **not** **`production_candidate`** without the fixes in §11.

---

## Sign-off (8.2D-2)

- [x] Boundary mapping audited against implementation.  
- [x] Skeleton-only heuristics explicitly flagged (**`enforcementTrapHeuristic`**).  
- [x] No code changes in this phase.  
- [x] No Smart Talk wiring or explanation generation introduced.
