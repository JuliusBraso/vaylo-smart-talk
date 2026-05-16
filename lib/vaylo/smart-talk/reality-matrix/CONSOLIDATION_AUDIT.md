# Phase 8.2B-4 — Matrix Consolidation Audit

**Scope:** `lib/vaylo/smart-talk/reality-matrix/` only (types, template, README, three matrices, index).  
**Date role:** architecture snapshot before Evidence Gates (8.2C).  
**Policy:** no runtime execution, no prompt/API/OCR changes.

---

## 1. Executive verdict

**Verdict: YES — the ontology is stable enough to begin Phase 8.2C (Evidence Gates), under strict guards.**

The three matrices compile, share one schema (`UniversalDocumentRealityMatrix`), and encode anti-hallucination intent in **traps**, **blocked realities**, and **forbidden claims**. Nothing in 8.2B forces incorrect runtime behavior yet because **no evaluator exists**.

**Guards that 8.2C MUST implement before any user-facing wiring:**

1. **Disambiguate `ClaimRule.requiredEvidenceRuleIds`** as AND vs OR vs `any-of` (matrices already use duplicate `ClaimRule` rows as a paper convention for OR).
2. **Treat `ClaimType` and `RealityType` homonyms** as distinct namespaces at compile time and in logs (see §3); gates must never concatenate them in one string bucket.
3. **Proximity / lane binding** for calendar tokens and “Inkasso” disambiguation — absent today; without it, `enforcement_risk` and payment deadlines become unsafe.
4. **Precedence** when `informational_only` vs `payment_required` both partially match.
5. **`emotional_language_amplification`** and similar traps are **policy**, not measurable predicates — do not implement as hard boolean gates without human/corpus criteria.

If 8.2C ships a naive “keyword contains” evaluator **without** the above, the answer flips to **NO**. The gap is evaluator design, not the declarative matrices alone.

---

## 2. Current matrix inventory

| Matrix | File | `documentType` | `schemaVersion` | Primary risk surface |
|--------|------|----------------|-----------------|----------------------|
| Rechnung | `matrices/rechnung.ts` | `rechnung_payment_notice` | `8.2b-1-rechnung-v1` | Billing / SEPA vs manual; invoice → enforcement |
| Steuerbescheid | `matrices/steuerbescheid.ts` | `steuerbescheid` | `8.2b-2-steuerbescheid-v1` | Payment vs appeal lanes; relative Frist; Finanzamt ≠ Jobcenter |
| Mahnung | `matrices/mahnung.ts` | `mahnung` | `8.2b-3-mahnung-v1` | Dunning → Vollstreckung panic; `weitere Schritte`; explicit enforcement only |
| Reference skeleton | `template.ts` | `generic_unknown` | `8.2b-template-v1` | Shape demo; not production selection |

`matrices/index.ts` re-exports the three real matrices only (no registry).

---

## 3. ClaimType vs RealityType namespace audit

### Separation in TypeScript

Types are **distinct**: `ClaimType` vs `RealityType` are different unions. **At compile time they are separated.**

### Homonyms (same string token, different meaning)

| Token | As `ClaimType` | As `RealityType` |
|-------|----------------|------------------|
| `insurance_risk` | Assertable claim (forbidden on Rechnung / Steuerbescheid / Mahnung matrices) | World-state token (e.g. blocked on Steuerbescheid) |
| `immigration_risk` | Claim (forbidden Mahnung) | Reality (blocked on multiple matrices) |
| `account_seizure` | Claim (forbidden Mahnung) | Reality (blocked Mahnung) |
| `eviction_risk` | Claim (forbidden Mahnung) | Reality (blocked Mahnung) |

**Risk:** engineers, logs, or JSON serializers that flatten to **string keys only** will confuse domains. **Mitigation in 8.2B-4:** JSDoc on `types.ts` documents this; **no rename** (would churn three matrices + mental model) unless product wants prefixed names (e.g. `reality:insurance_risk`).

### Asymmetric pairs (related concept, different names)

- `benefit_risk` (**claim**) vs `benefit_suspension` (**reality**) — similar semantic field; increases cognitive load for gate authors.

**Recommendation:** Keep as-is for 8.2C; add gate-internal naming convention (`claim:benefit_risk` / `reality:benefit_suspension`). Consider aligning names in a future **8.2B-5** only if regression cost is acceptable.

---

## 4. ProceduralLane audit

**Current union:** `payment` | `appeal` | `submission` | `appointment` | `informational` | `escalation` | `clarification`

| Lane | Introduced | Used by |
|------|------------|---------|
| `payment` | 8.2B | All three matrices |
| `appeal` | 8.2B | Steuerbescheid, template |
| `submission` | 8.2B | Steuerbescheid |
| `appointment` | 8.2B | Template only (not in three production matrices’ `proceduralLanes` lists) |
| `informational` | 8.2B | All |
| `escalation` | 8.2B-3 | Mahnung |
| `clarification` | 8.2B-3 | Mahnung |

**Coherence:** Globally valid. Rechnung / Steuerbescheid use **subsets**; they do not assert `escalation` / `clarification` lanes exist for their document — **acceptable**: unused lane values in the global union are not a type error.

**Weakness:** `appointment` is effectively **orphaned** in production matrices (only template / type). Either document as **reserved** or use on a future matrix (e.g. Termin letters).

**Mahnung split:** `escalation` vs `payment` is the critical dunning innovation; **8.2C** must enforce that cues in `escalation` do not satisfy `payment_required` without payment-lane grounding.

---

## 5. EvidenceRule audit

**Naming:** Consistent prefixes — `ev_rgn_*`, `ev_stb_*`, `ev_mah_*`. Cue IDs align (`cue_*`).

**`requiredCueIds`:** Typed as `string[]` of cue ids — **no FK** to `EvidenceCue.id` at compile time (acceptable for Phase 8.2B).

**Semantics gap:** Arrays imply **AND** in naive implementations; matrices document **OR** in `label` prose or via **duplicate** `ClaimRule` / alternate `EvidenceRule` ids. **Unsafe for 8.2C** if not addressed in the evaluator spec.

**`minimumEvidenceLevel`:** Used consistently; `contextual` used where ambiguity is expected (`weitere Schritte`, relative appeal).

**`regexPatterns`:** Declarative only — good. Risk: duplicate regex intent across matrices (calendar) — consolidate in 8.2C shared library, not in ontology.

**OCR:** `ocrSensitive` flags present where needed; no normalization spec (deferred).

---

## 6. ClaimRule audit

**`allowed: boolean`:** Always `true` in production matrices (no explicit deny rows). Negation is via `forbiddenClaims` + absence of rules.

**`blockedBy`:** Used sparingly (e.g. `informational_only` vs `payment_required`). **No global conflict resolver** — two claims could both “win” in a naive engine.

**`minimumConfidence` (`MatrixConfidenceFloor`):** Orthogonal to `EvidenceLevel` on rules — **two knobs** without documented composition (e.g. does claim need `high` confidence AND `explicit` evidence?). **8.2C** must define conjunction.

**Duplicate `claimType` rows:** Intentional OR for `payment_required`, `deadline_present`, `enforcement_risk` (Mahnung), etc. **Documented pattern**, not schema-encoded.

---

## 7. HallucinationTrap audit

**Shape:** Uniform — `id`, `kind`, `description`, `dangerousInference`, `blockedInterpretationBehavior`, optional `relatedClaimTypes` / `relatedLanes`. Template updated in 8.2B-1 to match.

**Specificity:** Mahnung and Steuerbescheid traps are **concrete** (good). `emotional_language_amplification` is **not machine-checkable** without NLP policy — flag as **manual review / post-filter** only.

**`HallucinationTrapKind`:** Central enum in `types.ts`; matrix traps must use registered kinds — **good for grep and corpus**.

**Gap:** No `matrixId` or `schemaVersion` on traps — cross-matrix deduplication is by `id` string discipline only (`trap_mah_*` vs `trap_stb_*`).

---

## 8. StabilizerRule audit

**Shape:** `triggerConditions[]`, `allowedWordingExamples[]`, `forbiddenWordingExamples[]` — consistent.

**Risk:** Triggers are **natural language**, not predicate AST — 8.2C cannot “evaluate” them mechanically without LLM or hand-mapping.

**Legal safety:** Examples forbid false reassurance (good). **8.2C** must not auto-emit stabilizers without the same cue discipline as claims.

---

## 9. SeverityRule audit

**Bands:** `none` … `critical` used; Mahnung assigns **`critical`** only to explicit enforcement path — aligned with mission.

**Risk:** `SeverityRule.when` is prose; overlap between `sev_mah_medium_dunning` and `sev_mah_high_final_and_escalation` possible without priority list.

**Steuerbescheid `high` rule:** Rare serious language — still depends on future token proof.

**Recommendation for 8.2C:** Ordered rule list with **first match wins** or explicit priority integer (deferred schema change).

---

## 10. Cross-matrix consistency findings

| Topic | Finding |
|-------|---------|
| `reminder_notice` | **Supported** on Mahnung; **blocked** on Steuerbescheid (tax vs dunning). **Coherent** — matrix-specific. |
| `appeal_window_exists` | **Supported** Steuerbescheid; **blocked** Rechnung / Mahnung. **Coherent** — do not use Mahnung matrix for Einspruch letters. |
| `insurance_risk` | Reality + claim homonym — **document only** unless renamed later. |
| `enforcement_risk` | **Forbidden** claim on Rechnung / Steuerbescheid; **conditionally allowed** Mahnung. **Intentional** — highest behavioral variance; **must** be first class in 8.2C tests. |
| `payment_due` vs `tax_payment_due` | Parallel tax-specific reality — OK; gate must not merge. |
| `jobcenter_sanction` | Reality exists; not all matrices list in `blockedRealities` (Rechnung omits). **Low risk** — Rechnung unlikely to assert it; optional hardening: add to Rechnung blocked list for symmetry. **Deferred** (minimal-change audit). |

---

## 11. Known ontology risks before 8.2C

1. **Rule algebra undefined** — AND/OR/NOT, negated cues, conditional forbid.  
2. **Homonym strings** — `insurance_risk`, `immigration_risk`, `account_seizure`, `eviction_risk`.  
3. **`active_inkasso_case` (reality) vs explicit Inkasso wording (`enforcement_risk` claim)** — semantic tension documented in README.  
4. **No compile-time link** evidence rule → cue ids → lanes.  
5. **`appointment` lane** unused in three matrices.  
6. **Subjective traps** — emotional amplification.  
7. **Severity rule precedence** unspecified.  
8. **`forbiddenClaims` absolute** — cannot express “forbid `enforcement_risk` unless ev_X” (Steuerbescheid uses blanket forbid + trap prose for edge cases).

---

## 12. Required Evidence Gates algebra for 8.2C (design-only)

Primitives likely required (not implemented here):

| Primitive | Purpose |
|-----------|---------|
| **`anyOf(ruleIds[])`** | Disjunctive evidence for one claim (replaces duplicate `ClaimRule` rows optionally). |
| **`allOf(ruleIds[])`** | Conjunctive evidence when multiple cues must co-occur. |
| **`not(cueId)` / negated cue** | “Mahnung without explicit Vollstreckung line” style guards. |
| **Proximity window** | Token N chars from anchor cue; calendar binding (already in Smart Talk prose sanitizers — align parameters). |
| **Lane binding** | Match cue only if occurrence in lane-scoped segment (future segmentation). |
| **Evidence level threshold** | Map `EvidenceLevel` to emit / hedge / suppress. |
| **Confidence × evidence** | Define conjunction of `MatrixConfidenceFloor` with rule outcomes. |
| **Conditional forbidden** | e.g. `forbiddenClaims` override when `ev_explicit_X` fires — or split matrix version. |
| **Matrix priority** | When OCR suggests two `documentType` candidates — out of scope for single-matrix eval but needed for routing. |
| **Negative evidence** | Explicit “absence of line X” for stabilizers (dangerous if done wrong — needs corpus). |

---

## 13. Explicitly deferred work

- Matrix **registry / router** from OCR or classifier.  
- **SmartTalkResult** field mapping.  
- **Automated regression corpus** and expected outputs.  
- **Rename** homonyms or align `benefit_risk` / `benefit_suspension`.  
- **EvidenceCue id** compile-time validation ( branded types or const object graph).  
- **Internationalization** of trap/stabilizer strings in matrix vs Smart Talk layers.

---

## 14. Final recommendation

1. **Proceed to 8.2C** with a **written evaluator spec** that locks AND/OR, proximity, and lane binding **before** code.  
2. Implement **namespaced logging** for claim vs reality (`kind: "claim"|"reality"`).  
3. Add **corpus tests** first for: Steuerbescheid relative Frist, Mahnung `weitere Schritte` vs explicit Vollstreckung, Rechnung SEPA vs Überweisung.  
4. Treat **`emotional_language_amplification`** as policy guidance for human review or LLM post-check, not a deterministic gate.  
5. Optionally add **`appointment` lane** to a future matrix or mark deprecated in docs — low priority.

**Bottom line:** The ontology is **good enough to start 8.2C** because it is **explicitly incomplete** by design; safety moves to **evaluator discipline** next. Failing to specify rule algebra would make 8.2C **unsafe** regardless of matrix quality.
