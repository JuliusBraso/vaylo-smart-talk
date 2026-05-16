# Reality Simulation Before Explanation — Architecture Spec (Phase 8.2D-0)

**Status:** specification only — **no production runtime**, **no Smart Talk wiring**, **no explanation generation**, **no OCR/text scanning**, **no regex execution** in this phase.

**Related:** `EVIDENCE_GATES_SPEC.md`, `EVIDENCE_GATES_DRY_RUN_AUDIT.md`, `evidence-gates/` (8.2C dry-run pipeline).

**Optional type sketches:** `reality-simulation-types.ts` — governance types; **`reality-simulation/run-reality-simulation.ts`** (8.2D-1) adds the pure **`runRealitySimulation`** skeleton — still not user-visible output.

---

## 1. Purpose

**Reality Simulation** is a **pre-explanation governance layer** that sits **after** Evidence Gates (dry-run + trace) and **before** any user-facing explanation is composed.

It answers **structural** questions about what “world” of document-backed meaning is safe to consider when planning communication — without producing the final answer:

| Question | Simulation scope |
|----------|------------------|
| What realities are **supported**? | From **governed** interpretations of gate outputs + matrix policy (not raw text inference in v1). |
| What realities are **blocked**? | Matrix-declared blocks + policy-derived impossible worlds. |
| What realities are **uncertain**? | Hypotheses that must not be stated as fact. |
| What claims **may be considered**? | **Candidates** only — never promoted to production authorization here. |
| What claims **must remain hidden**? | Forbidden / blocked / under-supported surfaces. |
| What traps are **near**? | Governance proximity — **not** automatic suppression. |
| What stabilizers **may be needed**? | **Need flags** and categories — **no** stabilizer wording emission. |
| What **severity posture** is possible? | **Posture candidate** from dry-run derivations — **not** UI urgency. |
| What **explanation boundaries** must apply? | Machine-oriented boundary tokens for downstream explanation governance. |

**Explicit non-goal:** Reality Simulation does **not** generate the final explanation, rewrite model output, or call Smart Talk.

---

## 2. Inputs

A future **Reality Simulation** implementation may **read** (v1 contract):

| Input | Role |
|-------|------|
| `EvidenceGateDecision` (including **`trace`**) | Canonical bundle from `evaluateEvidenceGates`. |
| `trace.claimDecisions` | Skeleton claim slice (e.g. `uncertain`) — **8.2D-1** uses when dry-run claim rows absent. |
| `trace.realityDecisions` | Constitutional `blocked` surface — available for future phases; **8.2D-1** skeleton focuses on dry-run reality rows. |
| `trace.dryRunClaimAuthorizations` | Claim **candidates** — audit / simulation only; primary source for claim candidate mapping in **8.2D-1**. |
| `trace.dryRunRealityAuthorizations` | Reality **candidates** — not production truth. |
| `trace.dryRunTrapActivations` | Trap governance signals — not runtime suppression. |
| `trace.dryRunStabilizerCandidates` | Stabilizer **need** candidates — not wording. |
| `trace.dryRunSeverityDerivations` | Severity **dry-run** rows — not `trace.severity` escalation. |
| `trace.traceMetadata` | Stages, flags, counts, evaluator version, audit notes. |
| **Matrix identity** | `matrixDocumentType`, `matrixSchemaVersion`, optional matrix snapshot handle — for policy selection and audit. |
| **OCR / document quality metadata** | Structured hints only (e.g. quality enum, confidence aggregates) — **not** raw `documentText`. |

**v1 constraint — no direct raw document text:**  
Simulation **must not** read **`documentText`** (or equivalent full OCR buffers) **directly** in v1. Any textual grounding flows **only** through pre-digested gate outputs, matrix policy, and explicitly allowed structured metadata. A later phase may define **controlled** text windows with separate spec — **out of scope for 8.2D-0**.

---

## 3. Outputs — `RealitySimulationResult` (conceptual)

Simulation output is **still not user-visible prose**. It is an intermediate **governance product** for a later explanation layer.

| Field (conceptual) | Meaning |
|--------------------|---------|
| `supportedRealityCandidates` | Worlds that may be **considered** as supported **candidates** (not asserted user truth). |
| `blockedRealities` | Worlds that must **not** be presented as established. |
| `uncertainRealities` | Worlds that remain hypotheses; may drive hedging boundaries. |
| `consideredClaimCandidates` | Claim types or namespaced ids that may enter **consideration** for downstream policy — **not** `allowed`. |
| `blockedClaimCandidates` | Claims that must **not** be stated or implied as facts. |
| `uncertaintyReasons` | Structured reasons (codes + optional parameters) — not user copy. |
| `trapWarnings` | Trap-adjacent governance signals → boundaries / review — **not** auto-suppression. |
| `stabilizerNeeds` | Need flags + category + linkage to traps/realities/claims — **no** matrix example strings. |
| `severityPostureCandidate` | Procedural posture candidate from dry-run severity — **not** dashboard priority. |
| `explanationBoundaries` | Tokens such as “do not calculate deadline” (see §7). |
| `forbiddenExplanationMoves` | Hard bans on classes of communicative moves (e.g. assert enforcement). |
| `auditTraceRef` | Opaque reference or echo of `traceMetadata.evaluatorVersion` + stable hash/summary pointer for audit replay. |
| `reviewFlags` | Governance identifiers only (8.2D-1+) — not user wording. |

**Naming discipline:** Prefer **`*Candidates`**, **`PostureCandidate`**, **`Needs`** over language that sounds user-final.

---

## 4. Simulation principles (must enforce)

1. **No dry-run direct promotion** — `candidate_*` rows and dry-run severities never become production **`allowed`** / supported-reality truth without a **separate**, explicitly versioned promotion phase.  
2. **No unsupported reality** — supported worlds must align with matrix + gate-backed structure; absence of support does not authorize invention.  
3. **No speculative reality as fact** — speculative evidence paths cannot justify factual user statements.  
4. **No synthetic deadline** — no calendar date synthesis from relative legal boilerplate in simulation output.  
5. **No cross-lane contamination** — payment, appeal, escalation, and other lanes must not be merged in boundary logic.  
6. **No explanation beyond authorized world** — boundaries cap what a later explanation may claim.  
7. **No legal conclusion from governance signal** — trap/stabilizer/severity signals are **risk governance**, not legal outcomes.  
8. **No panic amplification** — severity posture and traps cannot drive marketing-style urgency in UI from this layer.

---

## 5. Boundary: Gates vs Simulation vs Explanation

| Layer | Question it answers |
|-------|---------------------|
| **Evidence Gates (8.2C)** | “What **evidence-aligned candidates** and **audit signals** exist in the trace?” — deterministic, matrix-bound, largely dry-run today. |
| **Reality Simulation (8.2D+)** | “What **possible explanation world** is **safe to consider** before we phrase anything?” — consolidates trace + matrix policy into **candidates**, **boundaries**, and **flags**. |
| **Explanation layer (later)** | “**How** do we communicate within those boundaries safely?” — natural language, templates, model prompts — **separate spec** (`8.2D-5` indicative). |

**Data flow (conceptual):**  
`EvidenceGateDecision` → **Reality Simulation** → `RealitySimulationResult` → **Explanation governance** → user-visible text (only after future controlled phases).

---

## 6. Supported / blocked / uncertain worlds

**Definitions:**

- **Supported world (simulation sense):** A `RealityType` (or namespaced id) that the simulation marks as a **supported candidate** — still **not** end-user legal truth; means “this world-state may be discussed **within** declared evidence and matrix constraints.”  
- **Blocked world:** A reality the matrix or simulation policy marks as **not assertable** for this document class or this trace posture — must not appear as established fact in downstream copy.  
- **Uncertain world:** A reality that cannot be confirmed or denied from **allowed** inputs — downstream must hedge or omit factual assertion.

**Steuerbescheid-style examples (illustrative, not exhaustive):**

| Class | Examples |
|-------|----------|
| **Supported (candidates)** | `tax_assessment_issued`; appeal-related **informational** surfaces **if** matrix + gates authorize that consideration path. |
| **Blocked** | `enforcement_active`, criminal, immigration consequence, etc., **unless** explicit authorized path exists on matrix + trace (per matrix design). |
| **Uncertain** | Exact appeal **calendar** deadline from relative boilerplate; finality when “vorläufig” / ambiguity dominates; lane conflicts unresolved by gates. |

---

## 7. Explanation boundaries

Simulation emits **machine-oriented boundary tokens** (examples — final enum in a later phase):

| Boundary token | Intent |
|----------------|--------|
| `do_not_calculate_deadline` | No numeric deadline synthesis. |
| `do_not_claim_enforcement` | No enforcement-as-fact without authorized path. |
| `do_not_claim_finality` | No “final and unappealable” without support. |
| `do_not_merge_payment_and_appeal` | Lane isolation for wording and fact selection. |
| `do_not_present_dry_run_as_fact` | Dry-run rows are not user truth. |
| `use_relative_deadline_wording_only` | Relative Frist language only where policy allows. |
| `mention_uncertainty_if_ocr_noisy` | Structured OCR quality drives hedging policy. |
| `recommend_human_review_for_high_risk` | Escalation to human/pro review (see §11). |

Downstream explanation engines **must** consume these as **constraints**, not as suggestions to ignore.

---

## 8. Trap influence

- Trap activations **must not** automatically suppress model output or UI in this architecture.  
- They **may** contribute only: **explanation boundary candidates**, **uncertainty reasons**, **stabilizer need hints**, **review flags**.  
- **Overblocking** (silencing legitimate content because a trap fired heuristically) is a documented failure mode (see §12).

---

## 9. Stabilizer influence

- Stabilizer candidates **must not** emit matrix **wording examples** or user-facing calm text.  
- They **may** mark: **`stabilizerNeeded`**, **category / catalog id**, **linking rationale** (machine-oriented) to traps/realities/claims.  
- Actual stabilizer **copy** selection is a **later** phase with its own safety spec.

---

## 10. Severity influence

- Severity derivations **must not** become UI urgency, dashboard sort order, or Smart Talk “priority.”  
- They **may** populate: **`severityPostureCandidate`** (procedural band + provenance), **`reviewNeeded`**, and **conservative explanation boundaries** (e.g. avoid alarmist phrasing when posture uncertain).  
- **`trace.severity`** in 8.2C remains inert until an explicit integration phase; simulation reads **`dryRunSeverityDerivations`** only as **governance input**.

---

## 11. Human escalation policy (simulation-level)

Simulation should be able to recommend **human / professional / authority review** (as **flags**, not user-facing sentences) when, for example:

- Immigration or cross-border consequence surfaces are near  
- Benefit suspension or existential benefit risk is near  
- Health insurance loss / similar high-harm clusters  
- Court / enforcement cluster without full explicit grounding  
- Short explicit deadlines with high consequence  
- Noisy OCR with high-consequence content  
- Contradiction between lanes or between trap severity and claim posture  

**No user-facing text** is generated in 8.2D-0; only policy placeholders in this spec.

---

## 12. Failure modes (to design against)

| Failure mode | Description |
|--------------|-------------|
| **Dry-run leakage** | UI or prompts treat `candidate_*` as factual authorization. |
| **Severity leakage** | UI urgency or tone driven by `severityPostureCandidate` or dry-run bands. |
| **Stabilizer wording leakage** | Matrix examples copied into traces or user output from simulation. |
| **Trap overblocking** | Trap signals suppress or hide content without explicit product policy. |
| **False reassurance** | Stabilizer paths suggest safety not supported by evidence. |
| **Over-escalation** | Severity or traps push alarmist copy without evidence. |
| **Matrix mismatch** | `matrixDocumentType` / schema drift vs trace — wrong policy bundle. |
| **Claim/reality namespace confusion** | Homonym `ClaimType` vs `RealityType` mishandled in maps. |

---

## 13. Future runtime phases (recommended, not implemented)

| Phase | Deliverable |
|-------|-------------|
| **8.2D-1** | Reality Simulation **types** + **pure skeleton** (no Smart Talk, no text scan). |
| **8.2D-2** | **Simulation from gate trace** — map `EvidenceGateDecision` + metadata → `RealitySimulationResult` (still not user text). |
| **8.2D-3** | **Explanation boundary candidate engine** — normalize boundary tokens + conflict rules. |
| **8.2D-4** | **Simulation audit corpus** — frozen traces + expected simulation outputs for regression. |
| **8.2D-5** | **Controlled explanation governance spec** — how downstream may use simulation output with LLM/templates. |

---

## 14. Non-goals (explicit)

- Not a **legal advice engine** and not **final legal truth**.  
- **No deadline calculation** or calendar Frist synthesis in simulation v1.  
- **No autonomous action** (payments, filings, messages).  
- **No production explanation generation** in 8.2D-0.  
- **No Smart Talk integration** — no prompt edits, no `SmartTalkResult` fields wired here.  
- **No promotion** of dry-run claims or realities to production authorization in this spec phase.

---

## Sign-off (8.2D-0)

- [x] Reality Simulation defined as **pre-explanation governance** only.  
- [x] Inputs/outputs/principles/boundaries/failure modes/future phases documented.  
- [x] No runtime implementation required for success of this phase.
