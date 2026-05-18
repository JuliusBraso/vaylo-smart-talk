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
| **8.2D Reality simulation** | **8.2D-0** spec; **8.2D-1** `runRealitySimulation`; **8.2D-2/2A/2B** boundary audits + token cleanup; **8.2D-3** boundary policy table (`BOUNDARY_POLICY_TABLE_V1.md`) — metadata only. |
| **Regression corpus** | Frozen snippets per document family with expected matrix outcomes. |
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
