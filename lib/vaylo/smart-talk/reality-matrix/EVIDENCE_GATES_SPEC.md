# Phase 8.2C-0 — Evidence Gates Specification

**Status:** architecture / runtime design specification only. **No evaluator implementation** in this phase.  
**Audience:** implementers of 8.2C+ and reviewers of trust-grade claim authorization.  
**Constitutional answer:** Evidence Gates **authorize** structured claims and realities against matrix evidence; they **must not** collapse to “substring present ⇒ claim true.”

---

## 1. Purpose of Evidence Gates

**Evidence Gates** are a **deterministic authorization layer** between:

1. **OCR / extracted document text** (noisy, partial, lane-ambiguous)  
2. **`UniversalDocumentRealityMatrix` definitions** (cues, rules, traps, forbidden lists)  
3. **`allowedClaims` / `forbiddenClaims` / realities** as **candidates** for downstream consumers  
4. **Future explanation generation** (must consume gate output, not bypass it)

**Gates do:**

- Decide, per matrix and per document slice, whether each **candidate claim** is **allowed**, **blocked**, or **uncertain**  
- Decide which **realities** may be treated as **supported** or must remain **blocked** / **unsupported**  
- Surface **triggered traps**, **stabilizer candidates**, and a **severity candidate** as **advisory** structured outputs  
- Emit an **audit trace** that binds cues → rules → claims → lanes (mandatory for trust-grade debugging)

**Gates do not:**

- **Generate** user-facing explanations or paraphrases (that remains LLM or template logic, constrained by gate output)  
- **Interpret user intent** (user questions are out of scope for document gates)  
- **Replace** the LLM for semantic summarization  
- **Compute** synthetic legal deadlines (e.g. “one month from Bekanntgabe” → calendar day)  
- **Execute** autonomous actions (payment, filing, appeals)

**Core anti-pattern to prevent:** `keyword hit = claim`. A hit is only a **hypothesis** until it passes **lane scope**, **proximity**, **evidence level**, **confidence composition**, **forbidden / conditional-forbidden** checks, and optional **negative cue** handling.

---

## 2. Gate Input Model (conceptual)

Future gates consume a **closed-world package** per evaluation tick (document or segment):

| Input | Description |
|-------|-------------|
| **documentText** | Normalized transcript string (from OCR or paste); may include page markers. |
| **ocrQuality** | Signal from pipeline: e.g. `clear` \| `noisy` \| `ocr_damaged` (aligns with Smart Talk `documentQuality` conceptually; binding is an integration detail). |
| **candidateMatrix** | Selected `UniversalDocumentRealityMatrix` (by router or user choice); may be **wrong** — see §14. |
| **matrixMetadata** | `documentType`, `schemaVersion` for trace and mismatch detection. |
| **cueCatalog** | `evidenceCues` from matrix (ids, keywords, regex **patterns** as data, lane ownership, ocrSensitive). |
| **evidenceRules** | `evidenceRules` from matrix. |
| **claimRules** | `allowedClaims` from matrix. |
| **forbiddenClaims** | `forbiddenClaims` from matrix. |
| **supportedRealities / blockedRealities** | From matrix lists. |
| **hallucinationTraps / stabilizers / severityRules** | From matrix. |
| **detectedCueHits** | Output of **cue detection stage** (see §15): spans with `cueId`, `start`, `end`, optional `confidence`, **assignedLane** (after lane stage). |
| **laneContexts** | Segmentation or tagging: which character spans belong to which `ProceduralLane` (or “unassigned”). |
| **candidateClaims** | Optional: pre-expanded list of `ClaimType` to evaluate (default: union of claim types appearing in `allowedClaims` + matrix-relevant negatives). |

**Important:** This list is **conceptual**. Serialization shape (JSON vs in-memory structs) is an implementation decision. **No OpenAI** in the input model.

---

## 3. Gate Output Model (conceptual)

Each field below is **authoritative for its category** but **does not** imply final user copy until a consumer merges it with policy (e.g. strict_document).

| Output | Must contain | Must NOT imply |
|--------|----------------|----------------|
| **allowedClaims** | `ClaimType` entries **authorized** with satisfying rule ids + evidence level + lane proof pointers into trace. | That the LLM “must” assert them in prose; that they are legally true. |
| **blockedClaims** | Claims **explicitly forbidden** or **failed** rule checks, with **reason codes** (forbidden list, failed allOf, failed proximity, etc.). | That the document proves the negation of the claim (absence ≠ proof). |
| **uncertainClaims** | Claims that **almost** matched or conflicted (e.g. partial cues, lane mismatch, OCR fragile). | User should panic; automatic downgrade without review policy. |
| **supportedRealities** | `RealityType` subset **authorized** by evidence (same discipline as claims). | Complete world model; immigration/tax outcomes not in matrix. |
| **blockedRealities** | Realities matrix says must never be asserted **plus** realities that failed authorization. | That those realities are impossible in life — only “not licensed from this document.” |
| **triggeredTraps** | Trap ids + kinds + **why** (trace-linked). | Every trap is a hard error; subjective traps may be “advisory only” (§12). |
| **stabilizerCandidates** | Stabilizer rule ids **eligible** under triggers (§13). | Safety invented; user is “fine”; legal outcome guaranteed. |
| **severityCandidate** | One band + **derivation trace** (rules, claims, caps). | Emotional urgency; “sounds legal” ⇒ high. |

**uncertainClaims** exists so the pipeline can **hedge** or **withhold** instead of flipping to allowed on noise.

---

## 4. Rule Algebra

**Why flat arrays are insufficient:** `EvidenceRule.requiredCueIds: string[]` suggests **conjunction** to naïve readers; matrices use **duplicate `ClaimRule` rows** for OR. **Forbidden** logic needs **exceptions** (conditional allow). **Proximity** is not expressible as a flat list. **Negation** and **absence** need explicit operators to avoid silent bugs.

**Required algebraic constructs (conceptual):**

| Construct | Meaning |
|-----------|---------|
| **allOf(expr…)** | Every sub-expression must hold (e.g. multiple cue groups, proximity + cue). |
| **anyOf(expr…)** | At least one branch holds (replaces duplicate claim rows when implemented). |
| **noneOf(expr…)** | None of the forbidden patterns / cue groups may hold in **forbiddenCueGroup** context. |
| **not(expr)** | Negation of a match; **dangerous** if applied to “absence of text” without corpus — see §7. |
| **minEvidenceLevel(rule, hitAggregate)** | Compares satisfied evidence to `EvidenceLevel` ordering: explicit > strongly_supported > contextual > speculative. |
| **minConfidence(claimRule, aggregate)** | Composes `MatrixConfidenceFloor` with evidence outcome (§8). |
| **laneScope(expr, lane)** | Expression only evaluated on hits **assigned** to that lane (or explicitly cross-lane if matrix allows). |
| **proximityWindow(anchor, window, predicate)** | See §6; binds dates / Inkasso / IBAN to anchors. |
| **requiredCueGroup** | Named bundle of cues (OR inside group, AND between groups) — optional sugar over anyOf/allOf. |
| **forbiddenCueGroup** | If matched **without** compensating strong evidence → block or cap severity. |
| **conditionalForbidden(claim, unless: expr)** | Models “`enforcement_risk` forbidden unless explicit enforcement expr” without duplicating entire matrices in code. |
| **matrixOverride** | Lower-priority default rules when `candidateMatrix` is `generic_unknown` or mismatch flag set (§14). |

**Implementation note:** `RuleExpression` can be a **discriminated union** in TypeScript later; evaluators walk it **without** string eval.

---

## 5. Lane Binding

**Rule:** A cue hit **authorizes only** claim paths and realities whose **evidence rules** declare `allowedLanes` intersecting the hit’s **assigned lane**, unless the matrix documents an explicit **cross-lane** exception (rare; should be trace-logged).

**Examples (must hold in evaluators):**

- **Payment deadline** cues and dates → **payment** lane; must not satisfy **appeal** `deadline_present` or Einspruch-relative rules.  
- **Appeal / Rechtsbehelfsbelehrung** relative windows → **appeal** lane; must not set **payment** “pay by” narrative.  
- **Escalation** wording (Mahnung fees, weitere Schritte) → **escalation** lane on Mahnung matrix; must not alone authorize **payment amount** claims without payment-lane cues.  
- **Informational** boilerplate → must not satisfy **payment_required** without payment-lane anchors.

**Lane assignment** is a **first-class stage** (§15): wrong lane ⇒ hit is **discarded** for that rule or demoted to **uncertain**.

---

## 6. Proximity Model (conceptual)

**Purpose:** Prevent **stray tokens** (dates, IBAN, “Inkasso”) from **wrong paragraphs** authorizing claims.

**Conceptual rules:**

1. **Calendar token → payment deadline:** Token must appear within a **window** of payment obligation cues (`zahlbar`, `Zahlungsfrist`, `Restbetrag`, `fällig` in **payment** lane). **Discussion default:** ±N characters or same table row / line block after segmentation — **not fixed here**; must be tuned per corpus.  
2. **“innerhalb eines Monats” → appeal:** Phrase must be **near** `Einspruch` / `Rechtsbehelfsbelehrung` / `Rechtsbehelf` in **appeal** lane; never near-only **Steuerjahr** or **Ausstellungsdatum**.  
3. **“Inkasso” → enforcement path:** Match must be in **escalation** context (Mahnung) and satisfy **explicit** process wording per matrix; generic marketing “Inkasso” elsewhere → **uncertain** or **blocked**.  
4. **IBAN + manual payment:** IBAN hit should be **near** Überweisung / Zahlbetrag instructions in **payment** lane.

**Non-goals here:** Picking final `N` or line-detection algorithm — **segmentation strategy** is 8.2C implementation work, but **proximity is mandatory** in the spec sense.

---

## 7. Negative Evidence

**Definitions:**

- **Negative cue:** Explicit text that **denies** a class of inference (e.g. “dies ist **keine** Mahnung”, “**keine** Zahlungsaufforderung”).  
- **Denial / caution cue:** “falls Sie bereits gezahlt haben”, “bei Zahlung nach Ausstellung” — **reduces** panic claims, may **boost** clarification paths.  
- **Absence-based caution:** “We did not see Vollstreckung” — **not** the same as “Vollstreckung cannot happen.”

**Strict caution:** **Absence of evidence ≠ evidence of absence.** Gates may use absence to **withhold** or **uncertain** a claim, not to assert **negative realities** unless the document **states** a negative (rare).

**Use cases:** Downgrade **enforcement_risk** when “keine Vollstreckung” is **printed**; suggest **stabilizer** when “already paid” line exists; **never** invent “Sie sind sicher” from silence.

---

## 8. Confidence and Evidence Levels

**EvidenceLevel** (from ontology): `explicit` | `strongly_supported` | `contextual` | `speculative`.

**Authorization rule (strict_document alignment):**

| Level | Gate behavior for user-bound outputs |
|-------|--------------------------------------|
| **explicit** | May authorize **if** lane + proximity + algebra pass. |
| **strongly_supported** | May authorize **if** matrix allows; prefer extra consistency checks for dates. |
| **contextual** | Prefer **uncertain** or **hedged downstream**; do not authorize high-stakes claims as fact. |
| **speculative** | **Must not** authorize surfacing as strict_document **fact**; may appear only in internal debug / suppression. |

**minConfidence (`MatrixConfidenceFloor`):** Composed with evidence: e.g. `enforcement_risk` with `minimumConfidence: "high"` requires **both** high-confidence hit aggregation **and** explicit-level evidence per matrix intent.

---

## 9. Conditional Forbidden Claims

**Problem:** `forbiddenClaims` is a **flat list** in matrices; reality needs “forbidden **unless** strong exception.”

**Conceptual model:**

- Each `ClaimType` has a **default authorization** per matrix: **open** (if listed in `allowedClaims`), **closed** (if only in forbidden), or **conditional**.  
- **conditionalForbidden(claim, unless: RuleExpression)** — if `unless` passes, **remove** from blocked set for this evaluation.  
- **Examples:**  
  - **Rechnung / Steuerbescheid:** `enforcement_risk` → **always blocked** (no `unless` in current matrices).  
  - **Mahnung:** `enforcement_risk` → **blocked by default**, **unless** `anyOf(ev_mah_enforcement_vollstreckung, ev_mah_enforcement_gerichtsvollzieher, ev_mah_enforcement_inkasso_explicit)` passes with full lane + proximity + explicit level.

Evaluators must **never** treat “not in forbidden list” as “allowed” without passing **allowedClaims** paths.

---

## 10. Namespace Safety

**Problem:** `ClaimType` and `RealityType` share string labels (`insurance_risk`, `immigration_risk`, `account_seizure`, `eviction_risk`).

**Mandatory convention for all gate outputs and telemetry:**

- Prefix: `claim:` vs `reality:` (or parallel JSON fields `claimKind` / `realityKind`).  
- **Never** flatten to a single `Set<string>` without namespace.  
- Audit traces must store **kind** + **id** + matrix `schemaVersion`.

---

## 11. Severity Precedence

**Principle:** **SeverityCandidate** is derived from **authorized** realities and claims + **matrix severityRules**, **not** from “sounds scary” or typography.

**Rules:**

1. Start from **lowest** applicable baseline for document class (e.g. reminder → low).  
2. **Raise** only when **authorized** high-stakes claims/realities and **explicit** evidence align with a `SeverityRule`.  
3. **`critical`** requires **explicit severe** procedural evidence (per Mahnung spec: explicit enforcement path); **legal-looking** headers alone are insufficient.  
4. **Traps may cap severity downward** when evidence is weak, ambiguous, or OCR-damaged (e.g. trigger `lane_contamination` ⇒ cap at `medium` until human/corpus review policy).  
5. **Ordered application:** `severityRules` should be processed with **explicit priority** (first match wins, or numeric priority) — **document in implementation**; matrices currently use prose `when` fields.

---

## 12. Trap Triggering

**Traps are not one kind.** Classification:

| Type | Detection | Example |
|------|-------------|---------|
| **Cue trap** | Cue hit + absence of required partner cue / wrong lane | `weitere_schritte_to_forced_collection` |
| **Lane trap** | Same token valid in wrong lane | `payment_deadline_to_appeal_deadline` |
| **Claim trap** | Authorized claim set contradicts safe bundle | Near-authorized `enforcement_risk` without proximity |
| **Output wording trap** | Post-LLM check (future) | Forbidden stabilizer phrases |
| **Subjective / style trap** | Policy or corpus / human review | `emotional_language_amplification` — **not** a pure boolean gate |

**Gate role:** cue/lane/claim traps integrate **deterministically** where predicates exist; subjective traps produce **advisory** flags or **review queues**, not silent auto-block without policy.

---

## 13. Stabilizer Candidate Logic

**Candidates** (not auto-inserted copy): suggested when:

1. **High-risk trap** fired or nearly fired (near-miss in trace),  
2. **Dangerous reality** correctly **blocked** and document is informational-heavy,  
3. **Document type** known for over-interpretation (Mahnung, Steuerbescheid),  
4. **Clarification cues** present (“already paid”, contact).

**Hard rule:** Stabilizers **must not invent safety** (“Sie sind aus dem Schneider”) or **deny** explicit risks printed on the page. Candidates are **optional** inputs to the LLM layer with **forbiddenWordingExamples** from matrix as constraints.

---

## 14. Misclassification Safety

**Wrong matrix** is inevitable (router error, user paste mix).

**Required behaviors:**

1. **matrixMismatchFlag** — heuristic: e.g. strong **Steuerbescheid** cues with **rechnung** matrix → flag **mismatch**, lower global confidence, prefer **uncertain** claims.  
2. **Cross-domain realities** remain **blocked** per matrix; do not “force” `invoice_issued` on tax text.  
3. **No forced high confidence** — output may set “classification uncertain” for routing.  
4. Optionally evaluate **second matrix** in shadow mode **only** for mismatch diagnostics (implementation detail) — **not** in 8.2C-0.

---

## 15. Required Future Runtime Stages (ordered pipeline)

**Do not implement in 8.2C-0.** Suggested **mandatory order:**

1. **Cue detection** — keyword + compiled regex from patterns, OCR-tolerant normalization, span extraction.  
2. **Lane assignment** — assign each hit to `ProceduralLane` (segmentation / rules / heuristics).  
3. **Proximity binding** — attach hits to anchors; drop unbound calendar tokens for claim purposes.  
4. **Evidence rule evaluation** — apply **rule algebra** (§4) per rule id.  
5. **Claim authorization** — evaluate `allowedClaims` with composition + conditional forbidden (§9).  
6. **Forbidden claim evaluation** — apply unconditional forbids + residual blocks.  
7. **Reality authorization** — parallel track for `supportedRealities` / `blockedRealities`.  
8. **Trap triggering** — run trap catalog with classifications (§12).  
9. **Severity candidate derivation** — §11.  
10. **Stabilizer candidate derivation** — §13.  
11. **Audit trace generation** — §16; **must** run every time.

---

## 16. Audit Trace Requirements (mandatory)

Every gate run must produce a **structured trace** (JSON-serializable recommended):

- **cueHits:** id, span, lane, ocrSensitive flag, matcher used  
- **ruleEvaluations:** rule id → pass/fail/uncertain → **which hits** satisfied each sub-expression  
- **claimDecisions:** claim type → allowed/blocked/uncertain → **rule ids** + reason codes  
- **realityDecisions:** same  
- **traps:** trap id → triggered/advisory/skipped + reason  
- **severity:** final candidate + **rule id chain** + any **cap** from traps  
- **stabilizers:** candidate ids + trigger matched  
- **matrix:** `documentType`, `schemaVersion`, optional **mismatchFlag**

**Without this trace, the system is not trust-grade.**

---

## 17. Explicit Non-Goals

Evidence Gates **must not** become:

- A **legal advice engine** or source of “final legal truth”  
- An **autonomous actor** (pay, file, appeal, contact authorities)  
- A **synthetic deadline calculator** (relative Frist → calendar date)  
- A **hidden escalation inferencer** (“probably Inkasso soon”)  
- A **replacement** for Steuerberater, lawyer, or Schuldnerberatung  
- A **keyword-only** classifier (hits are necessary but **never sufficient**)

---

## Compatibility

This spec is **compatible** with existing matrices (`rechnung`, `steuerbescheid`, `mahnung`) and `CONSOLIDATION_AUDIT.md`. Implementations may introduce `RuleExpression` data **alongside** existing string arrays initially (adapter layer) until matrices are migrated.

**Optional type sketches:** `evidence-gates-types.ts` (same folder) — discriminated union for `RuleExpression`, audit trace shapes; **no functions**.

**Evaluator skeleton (8.2C-1):** `evidence-gates/` — `evaluateEvidenceGates`, `evaluateRuleExpression`, `buildGateAuditTrace` (pure functions, **not** wired to Smart Talk). See `evidence-gates/README.md`.

---

## Critical success condition (answer)

**What exactly must Evidence Gates do so Vaylo can authorize claims safely without reducing cognition to keyword matching?**

They must:

1. Treat hits as **hypotheses** bounded by **laneScope**, **proximityWindow**, and **rule algebra** (allOf / anyOf / noneOf / conditionalForbidden).  
2. **Compose** `EvidenceLevel` and `MatrixConfidenceFloor` with **explicit** thresholds for high-stakes claims.  
3. **Never** surface **speculative** inferences as strict_document facts.  
4. **Namespace** claim vs reality results and **emit audit traces** for every decision.  
5. **Derive severity** from authorized evidence + matrix rules, **capped** by traps when evidence is weak.  
6. **Handle wrong-matrix** inputs with mismatch flags and confidence collapse, not silent wrong authorization.

If an implementation skips any of the above, it **failed** this specification — not because keywords were wrong, but because **authorization without structure is hallucination by default.**
