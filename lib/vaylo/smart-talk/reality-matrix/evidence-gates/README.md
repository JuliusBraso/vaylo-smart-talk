# Evidence Gate evaluator skeleton (Phase 8.2C-1)

## 1. What this is

A **pure-function** package under `reality-matrix/evidence-gates/` that introduces:

- `evaluateEvidenceGates` — entry point returning `EvidenceGateDecision` + **mandatory** `GateAuditTrace`
- `evaluateRuleExpression` — partial **rule algebra** only (no document access)
- `buildGateAuditTrace` — assembles trace metadata for debugging

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

The audit trace lists **structural** cue fields (`cueId`, `lane`, `confidence`, offsets, `source`, `notes`); `matchedText` / `matchedKeyword` are **not** echoed on `trace.cueHits` (see `matchedTextObservationCount` in `traceMetadata`). A fixed note is always appended: `cue_hits_observed_but_not_authorized_in_8_2c_3`.
