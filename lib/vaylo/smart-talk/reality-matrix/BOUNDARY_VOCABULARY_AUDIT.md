# Boundary Vocabulary Consolidation Audit (Phase 8.2D-2A)

**Mode:** governance vocabulary audit — **no runtime behavior changes**, **no TS file changes** in this phase.  
**Scope:** every `ExplanationBoundary` token in the type union, the emitter function, the spec table, and prior audit references.  
**Artifacts:** `reality-simulation-types.ts`, `run-reality-simulation.ts`, `REALITY_SIMULATION_SPEC.md`, `SIMULATION_BOUNDARY_MAPPING_AUDIT.md`.

---

## 1. Executive verdict

**Verdict: conditionally safe for dry-run simulation only**, with **one high-priority vocabulary defect** requiring consolidation before any production explanation pipeline consumes boundary tokens.

**Primary defect:** the `ExplanationBoundary` union contains **two near-identical tokens** that diverged between the spec and the runtime:

| Token in union | Defined in spec §7 | Emitted by `buildExplanationBoundaries` |
|---|---|---|
| `"recommend_human_review_for_high_risk"` | ✅ yes | ❌ **never** |
| `"recommend_human_review_high_risk"` | ❌ no | ✅ **always** (on mismatch/speculative) |

A downstream parser checking for the spec-defined token will **never find a match** from the current runtime. A parser checking for the runtime token will **not match** the spec wording. Both strings are valid TypeScript members of the union — the compiler cannot catch this.

**Secondary defects:** four additional tokens are defined in the union and/or the spec but are **never emitted** by the skeleton runtime. These are not bugs today but represent vocabulary debt.

---

## 2. Complete boundary token inventory

### 2.1 Token status matrix

| Token | In type union | In spec §7 table | Emitted by skeleton | Production readiness | Notes |
|-------|--------------|------------------|---------------------|----------------------|-------|
| `do_not_calculate_deadline` | ✅ | ✅ | ✅ always | **Dry-run OK** | Strong invariant; good candidate for permanent policy |
| `do_not_claim_enforcement` | ✅ | ✅ | ✅ conditional | **Skeleton** | Triggered by broad heuristic — see §3 |
| `do_not_claim_finality` | ✅ | ✅ | ❌ never | **Gap** | Defined in spec; not yet wired to any gate signal |
| `do_not_merge_payment_and_appeal` | ✅ | ❌ | ✅ always | **Dry-run OK** | Invariant; spec lists similar concept under lane safety |
| `do_not_merge_lanes` | ✅ | ❌ | ✅ conditional | **Skeleton** | Emitted on any trap; spec omits; names overlap with `do_not_merge_payment_and_appeal` |
| `do_not_present_dry_run_as_fact` | ✅ | ✅ | ✅ always | **Dry-run OK** | Core invariant |
| `do_not_present_speculation_as_fact` | ✅ | ❌ | ✅ always | **Dry-run OK** | Runtime adds this; spec omits; strong invariant |
| `require_uncertainty_wording` | ✅ | ❌ | ✅ conditional | **Skeleton** | Broad trigger: any uncertain reality or trap or speculative flag |
| `use_relative_deadline_wording_only` | ✅ | ✅ | ❌ never | **Gap** | Defined; not wired to any trace signal in v1 |
| `mention_uncertainty_if_ocr_noisy` | ✅ | ✅ | ❌ never | **Gap** | Requires OCR quality field on input; not consumed in 8.2D-1 |
| `recommend_human_review_for_high_risk` | ✅ | ✅ | ❌ **never** | ⚠️ **Alias defect** | Spec name; runtime uses different string |
| `recommend_human_review_high_risk` | ✅ | ❌ | ✅ conditional | ⚠️ **Alias defect** | Runtime name; spec uses different string |

### 2.2 Per-token analysis

#### `do_not_calculate_deadline`
- **Purpose:** prevent calendar-date synthesis from relative legal boilerplate  
- **Source trigger:** unconditional (always emitted)  
- **Overuse risk:** low — deadline synthesis is always forbidden in this architecture  
- **Underuse risk:** n/a  
- **Alias risk:** none  
- **Production readiness:** **strong permanent invariant candidate**

#### `do_not_claim_enforcement`
- **Purpose:** block enforcement-as-established-fact in downstream copy  
- **Source trigger:** any triggered/uncertain trap **OR** `enforcementTrapHeuristic` substring match  
- **Overuse risk:** **high** — fires on any trap class + coarse substring heuristic (see §3)  
- **Underuse risk:** medium — if trap list is incomplete  
- **Alias risk:** none  
- **Production readiness:** **not production** until heuristic replaced with structured metadata

#### `do_not_claim_finality`
- **Purpose:** forbid stating a decision is "final and unappealable" without support  
- **Source trigger:** none currently wired  
- **Overuse risk:** n/a (not emitted)  
- **Underuse risk:** **high** — finality mis-assertion is a known hallucination mode for Bescheid documents; should be wired to `blockedRealities` containing `legal_remedy_information_present` or similar  
- **Alias risk:** none  
- **Production readiness:** **gap** — needs gate-signal wiring

#### `do_not_merge_payment_and_appeal`
- **Purpose:** explicit lane isolation between payment and appeal surfaces  
- **Source trigger:** unconditional  
- **Overuse risk:** low — always-on is appropriate for legal document context  
- **Underuse risk:** n/a  
- **Alias risk:** **medium** — semantic overlap with `do_not_merge_lanes`; consumers may check one but not the other  
- **Production readiness:** **strong invariant candidate** (rename or unify with `do_not_merge_lanes` in future)

#### `do_not_merge_lanes`
- **Purpose:** general lane-isolation constraint  
- **Source trigger:** any trap triggered or uncertain  
- **Overuse risk:** medium — fires for all traps regardless of lane relevance  
- **Underuse risk:** if no traps present  
- **Alias risk:** **medium** — partially redundant with `do_not_merge_payment_and_appeal`; one is always-on, one is conditional  
- **Production readiness:** **skeleton** — needs trap-to-lane-class mapping to scope correctly

#### `do_not_present_dry_run_as_fact`
- **Purpose:** foundational constraint — dry-run rows must never be user truth  
- **Source trigger:** unconditional  
- **Overuse risk:** none  
- **Underuse risk:** n/a  
- **Alias risk:** none  
- **Production readiness:** **permanent invariant**

#### `do_not_present_speculation_as_fact`
- **Purpose:** speculative evidence paths must not generate factual copy  
- **Source trigger:** unconditional  
- **Overuse risk:** none  
- **Underuse risk:** n/a  
- **Alias risk:** none — but **absent from spec §7** (spec omits; runtime emits)  
- **Production readiness:** **permanent invariant** — should be added to spec §7

#### `require_uncertainty_wording`
- **Purpose:** downstream must hedge rather than assert  
- **Source trigger:** any uncertain reality **or** any uncertain trap **or** speculative `unsupportedFeatures` substring  
- **Overuse risk:** **medium** — broad trigger pool  
- **Underuse risk:** under-trigger if signals not in trace  
- **Alias risk:** none  
- **Production readiness:** **skeleton** — trigger conditions need calibration

#### `use_relative_deadline_wording_only`
- **Purpose:** force relative Frist language where trace supports deadlines  
- **Source trigger:** none currently wired  
- **Overuse risk:** n/a  
- **Underuse risk:** **medium** — deadline language policy gap  
- **Alias risk:** overlaps with `do_not_calculate_deadline` (both concern deadlines; different constraints)  
- **Production readiness:** **gap** — needs wiring to deadline-related reality candidates

#### `mention_uncertainty_if_ocr_noisy`
- **Purpose:** hedging policy when OCR quality is low  
- **Source trigger:** none — `documentQualityHints` not consumed in 8.2D-1  
- **Overuse risk:** n/a  
- **Underuse risk:** **high** — OCR noise is an important production signal  
- **Alias risk:** none  
- **Production readiness:** **gap** — needs OCR quality input wiring in 8.2D-2+ or later

#### `recommend_human_review_for_high_risk` ⚠️ ALIAS DEFECT
- **Purpose (spec intent):** human/professional review escalation hint  
- **Source trigger:** **never emitted** by skeleton  
- **Alias risk:** **CRITICAL** — runtime emits `recommend_human_review_high_risk` (no `_for`) instead  
- **Production readiness:** **confusing** — spec name that the runtime doesn't produce

#### `recommend_human_review_high_risk` ⚠️ ALIAS DEFECT
- **Purpose (runtime):** same as above  
- **Source trigger:** `critical` severity band **or** matrix mismatch **or** speculative `unsupportedFeatures` substring  
- **Alias risk:** **CRITICAL** — consumers following the spec name find no match from runtime  
- **Production readiness:** **skeleton** — trigger conditions need tuning regardless of name fix

---

## 3. Naming consistency audit

### 3.1 Prefix pattern inventory

| Pattern | Tokens | Consistency |
|---------|--------|-------------|
| `do_not_*` | 6 tokens | ✅ Consistent verb-object prohibition form |
| `require_*` | 1 token (`require_uncertainty_wording`) | ✅ Clear imperative |
| `use_*` | 1 token (`use_relative_deadline_wording_only`) | ⚠️ Mixes with `require_*` semantics; both mean "constraint on wording" |
| `mention_*` | 1 token (`mention_uncertainty_if_ocr_noisy`) | ⚠️ Softer verb than `require_*`; could be mistaken as advisory rather than constraint |
| `recommend_*` | 2 tokens (the alias pair) | ❌ **Inconsistent** — same intent, two different strings |

### 3.2 Problems found

1. **`recommend_human_review_for_high_risk`** vs **`recommend_human_review_high_risk`**: same semantic intent, different forms in the same string union. One is never emitted.  
2. **`use_*` vs `require_*`**: both constrain downstream wording choice. `use_relative_deadline_wording_only` reads like a prescriptive policy, not a prohibition — yet it lives alongside `do_not_*` prohibitions with no distinguishing category.  
3. **`mention_*` implies softer advisory** — a consumer might treat `mention_uncertainty_if_ocr_noisy` as optional, whereas the intent is a **required** hedge when applicable.  
4. **`do_not_merge_payment_and_appeal`** and **`do_not_merge_lanes`** are partially redundant — the former is an always-on subset of the latter's intent, but the conditional/unconditional split is invisible in the type.

---

## 4. Alias / typo risk detail

### 4.1 The `recommend_human_review_*` pair — priority finding

```
"recommend_human_review_for_high_risk"   ← in union; in spec §7; NEVER emitted by runtime
"recommend_human_review_high_risk"        ← in union; NOT in spec §7; ALWAYS emitted by runtime
                                                                       (on critical/mismatch/speculative)
```

**Risk:** a consumer written to the spec will check for `recommend_human_review_for_high_risk` and find it **never present** in a real simulation result, silently skipping human-review escalation. This is a **silent contract break** at the consumer boundary.

**Recommended consolidation path** (for a future TS-safe phase):
- Deprecate `"recommend_human_review_for_high_risk"` in the union (JSDoc `@deprecated` + note pointing to canonical form).
- Canonical form: **`"recommend_human_review_high_risk"`** (matches runtime; shorter; consistent with `high_consequence_domain` review flag naming).
- Update spec §7 table to use the canonical form.
- Do **not** rename in this phase without a dedicated TS migration plan to avoid breaking consumers already checking the spec name.

### 4.2 Deadline-related pair overlap

```
"do_not_calculate_deadline"           ← prohibition: no calendar synthesis; unconditional
"use_relative_deadline_wording_only"  ← constraint: if deadline discussed, relative only; never emitted
```

These are **complementary, not duplicate** — but never being emitted together makes the complementary intent invisible. Consumer should treat both as active when deadline realities are present.

---

## 5. Token category model (canonical)

Proposed categories for future typed discriminated union or boundary registry:

| Category | Tokens | Description |
|----------|--------|-------------|
| **prohibition** | `do_not_calculate_deadline`, `do_not_claim_enforcement`, `do_not_claim_finality`, `do_not_merge_payment_and_appeal`, `do_not_merge_lanes`, `do_not_present_dry_run_as_fact`, `do_not_present_speculation_as_fact` | Hard bans — downstream must not perform the named action |
| **required_wording_constraint** | `require_uncertainty_wording`, `use_relative_deadline_wording_only` | Downstream must use hedged / constrained wording when this boundary is present |
| **conditional_advisory** | `mention_uncertainty_if_ocr_noisy` | Advisory wording requirement conditional on a runtime quality signal |
| **escalation_recommendation** | `recommend_human_review_high_risk`, `recommend_human_review_for_high_risk` | Non-binding review hint — **never legal advice** |

**Naming policy consequence:**
- `required_wording_constraint` tokens should use `require_*` prefix consistently; `use_*` should be renamed `require_relative_deadline_wording` in a future migration.
- `conditional_advisory` tokens should use `mention_*` or a new `if_*` form (e.g. `mention_uncertainty_if_ocr_noisy` → `require_uncertainty_wording_if_ocr_noisy`) to signal they are conditional but not weaker.

---

## 6. Consumer safety policy

Downstream consumers of `RealitySimulationResult.explanationBoundaries` **must**:

1. **Treat tokens as machine constraints**, not user-facing text — never display token names to users.  
2. **Never infer legal conclusions** from boundary tokens — `do_not_claim_enforcement` is not evidence that enforcement is happening; it is a prohibition on claiming it.  
3. **Never treat `recommend_human_review_*` as legal advice** — it is a governance flag for routing, not a professional opinion.  
4. **Never convert simulation output into user-visible explanation** without an explicit production phase that consumes boundaries as policy inputs, not direct copy.  
5. **Check for the full set of emitted tokens** — the union contains tokens that are never emitted today; consumers must not assume presence implies active constraint or absence implies anything about the gate state.  
6. **Version-pin boundary expectations** to `REALITY_SIMULATION_SKELETON_VERSION` — vocabulary may change across phases.

---

## 7. Future refactor recommendations

| Recommendation | Priority | Notes |
|----------------|----------|-------|
| Deprecate `recommend_human_review_for_high_risk` in type union JSDoc, point to `recommend_human_review_high_risk` | **High** | Safe minimal change; no runtime effect |
| Update spec §7 table to use `recommend_human_review_high_risk` as canonical | **High** | Alignment with emitter |
| Add missing tokens to spec §7: `do_not_present_speculation_as_fact`, `do_not_merge_lanes`, `do_not_merge_payment_and_appeal` | **Medium** | Spec completeness |
| Wire `do_not_claim_finality` to blocked-reality / matrix signals | **Medium** | Currently a gap |
| Wire `use_relative_deadline_wording_only` to deadline-related reality candidates | **Medium** | Gap |
| Wire `mention_uncertainty_if_ocr_noisy` to `documentQualityHints` input | **Low** | Blocked on OCR quality input wiring |
| Split `ExplanationBoundary` string union into typed discriminated union by category | **Low / future** | Enables compile-time category checking; breaking change |
| Add boundary policy table (canonical registry with version, category, trigger source, consumer contract) | **Medium** | Replaces informal documentation |
| Add regression tests asserting which tokens are emitted given a trace fixture | **High** | Prevent future token drift silently |
| Rename `use_relative_deadline_wording_only` → `require_relative_deadline_wording_only` | **Low** | Consistency; safe TS rename with find-replace |

---

## 8. Non-goals

- **No explanation generation** — tokens are identifiers, not prose.  
- **No Smart Talk wiring** — this audit has no effect on Smart Talk prompts or output.  
- **No runtime behavior change** — vocabulary audit only; emitter function not modified.  
- **No token-driven UI behavior** — boundaries must not drive UI urgency or visual elements until an explicit production integration phase.

---

## Sign-off (8.2D-2A)

- [x] All 12 `ExplanationBoundary` union members inventoried.  
- [x] Alias/typo defect (`recommend_human_review_*` pair) identified and documented.  
- [x] Tokens never emitted (4) identified.  
- [x] Canonical category model proposed.  
- [x] Consumer safety policy documented.  
- [x] No runtime or TS changes in this phase.
