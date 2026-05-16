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

`ProceduralSeverityBand` (`none` … `critical`) is tied to **document-stated procedural weight** (e.g. Mahnung with fees vs plain informational notice), **not** to user anxiety or marketing urgency. `SeverityRule` references realities and claim types — not “how scared the user should feel.”

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
| **8.2D Reality simulation** | Offline simulation: given OCR text + matrix, assert expected supported/blocked realities for tests. |
| **Regression corpus** | Frozen snippets per document family with expected matrix outcomes. |
| **Document cognition engine** | Compose matrices per `RealityMatrixDocumentType`, versioned releases, optional overlap with existing `SmartTalkResult` fields via explicit mappers (future). |

---

## File map

| File | Purpose |
|------|---------|
| `types.ts` | Ontology: `EvidenceLevel`, lanes, claims, realities, cues, rules, traps, stabilizers, severity, `UniversalDocumentRealityMatrix`. |
| `template.ts` | `UNIVERSAL_REALITY_MATRIX_TEMPLATE` + small example lane exports. |
| `README.md` | Architecture and safety rationale (this file). |

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
- No **i18n** of guard statements — English/Slovak surface strings remain in Smart Talk layers until explicitly bridged.
