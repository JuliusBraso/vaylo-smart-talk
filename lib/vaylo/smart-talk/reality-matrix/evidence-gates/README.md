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
