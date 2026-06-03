# Runtime LLM Draft Adapter — Phase 8.2G-1

**Epoch**: 8.2G — Runtime LLM Integration  
**Phase**: 8.2G-1  
**Status**: `mock_only` — liveLLMCalled: false — userVisibleOutputAllowed: false  
**Author**: Vaylo Document Reasoning Constitution V1 Governance Kernel

---

## 1. Purpose

The Runtime LLM Draft Adapter is the typed governance boundary between the
Vaylo Document Reasoning Kernel and any future LLM call.

Its role is to:

- Receive governance-constrained input from the explanation contract builder.
- Produce structured **draft section candidates** — typed, never-user-visible, pre-validation data.
- Propagate all active governance metadata (forbidden moves, required constraints, audit trace IDs) to the result.
- Emit governance diagnostic codes that the downstream contract validator (Phase 8.2G-2) will inspect.

In Phase 8.2G-1, the adapter is **mock-only**. No live LLM is called.

---

## 2. Why It Is Mock-Only

Phase 8.2G-1 exists to:

1. Define and stabilize the typed adapter contract before introducing a real LLM.
2. Prove that the downstream validation pipeline (Phase 8.2G-2) and wording evaluation gate (Phase 8.2G-3) can be built and tested independently of any live model.
3. Establish `liveLLMCalled: false` and `userVisibleOutputAllowed: false` as compile-time literals — they cannot be accidentally toggled.
4. Allow regression testing of governance metadata propagation (forbidden moves, constraints, trace IDs) without any external dependency.

The live LLM integration is reserved for Phase 8.2G-5, after:
- Phase 8.2G-2: LLM Output Contract Validator is built and tested.
- Phase 8.2G-3: Wording Evaluation Gate is built and tested.
- Phase 8.2G-4: Wording Review Gate is built and tested.

---

## 3. What the Adapter Is Allowed to Receive

The adapter input (`RuntimeLLMDraftAdapterInput`) contains only:

| Field | Description |
|---|---|
| `adapterMode` | `"mock"` or `"future_live_llm"` (latter is blocked). |
| `accessTier` | `"free_preview"` or `"paid_explanation"`. |
| `contractRef` | Opaque reference to the governing explanation contract. |
| `allowedSectionTypes` | Section types the adapter may produce. |
| `activeForbiddenMoves` | Forbidden move names from the active explanation contract. |
| `activeRequiredConstraints` | Required constraint names from the active explanation contract. |
| `uncertaintyRequired` | Whether an `uncertainty_notice` section is mandatory. |
| `humanReviewRequired` | Whether a `review_recommendation` section is mandatory. |
| `auditTraceParentIds` | Parent audit trace IDs for governance lineage. |
| `diagnosticEnvelopeRefs` | Optional diagnostic envelope references for correlation. |
| `neverUserVisible` | Compile-time invariant — always `true`. |
| `notes` | Optional governance notes. |

The adapter does **not** receive:
- Document text or OCR output.
- User personal data.
- Session tokens or auth credentials.
- API keys or environment variables.
- Legal deadline data.
- Monetary amount data.

---

## 4. What the Adapter Must Never Do

The adapter must never:

- Call OpenAI, Gemini, or any live LLM.
- Import any LLM SDK.
- Add or read API keys or environment variables.
- Write to any database, Supabase table, or cache.
- Emit telemetry or structured logging.
- Add runtime coupling to Smart Talk.
- Process OCR data or document images.
- Produce final user-facing explanation text.
- Calculate legal deadlines or monetary amounts.
- Infer legal conclusions or enforcement outcomes.
- Return any value with `liveLLMCalled: true`.
- Return any value with `userVisibleOutputAllowed: true`.
- Expose diagnostic codes or governance trace IDs in `draftText`.

---

## 5. Meaning of `draftText`

`draftText` on a `RuntimeLLMDraftSectionCandidate` is **not** final explanation text.

It is:
- A placeholder value. In Phase 8.2G-1, it is a mock fixture string.
- Always prefixed with `[MOCK_DRAFT_NEVER_USER_VISIBLE]`.
- Not legal advice, not final wording, not polished prose.
- Not bound to any real document source (`sourceBound: false` in mock mode).

When a live LLM adapter is introduced in Phase 8.2G-5, `draftText` will hold
the raw LLM output for a given section type — before any governance validation.
It remains never-user-visible until Phase 8.2G-2 (contract validation),
Phase 8.2G-3 (wording evaluation), and Phase 8.2G-4 (wording review) all pass.

---

## 6. Why `draftText` Is Never User-Visible

The governance architecture imposes a multi-gate pipeline before any draft
can reach a user:

```
runRuntimeLLMDraftMockAdapter (8.2G-1)
  → validateLLMOutputContract (8.2G-2) — blocks unsafe/forbidden output
  → wordingEvaluationGate (8.2G-3)     — checks wording score constraints
  → wordingReviewGate (8.2G-4)         — applies forbidden move review
  → responseAssembler (8.2G-6)         — constructs user-visible output
```

No section candidate may bypass these gates. The `neverUserVisible: true`
literal on every `RuntimeLLMDraftSectionCandidate` is a compile-time marker
that documents this invariant throughout the type system.

---

## 7. Future Live LLM Phase Boundary

`adapterMode: "future_live_llm"` is the intent signal for Phase 8.2G-5.

In Phase 8.2G-1, if this mode is submitted to the mock adapter:
- The adapter **does not call any LLM**.
- It returns `sectionCandidates: []`.
- It emits `llm_adapter_live_llm_forbidden`.
- `liveLLMCalled` remains `false`.

This is intentional. It documents the blocking behavior that will be replaced
in Phase 8.2G-5 by a real LLM call, after all governance gates are established
and passing.

---

## 8. How Phase 8.2G-2 Will Validate Output

Phase 8.2G-2 (LLM Output Contract Validator) will:

1. Receive `RuntimeLLMDraftAdapterResult` from the adapter.
2. Verify `liveLLMCalled === false` (must be `false` in Phase 8.2G-1).
3. Verify `userVisibleOutputAllowed === false`.
4. Inspect each `RuntimeLLMDraftSectionCandidate`:
   - Check `neverUserVisible === true`.
   - Check `safetyFlags` array. Any non-empty safety flags = blocked section.
   - Verify `sectionType` is in `allowedSectionTypes` from the original input.
5. Check that `appliedForbiddenMoves` and `appliedRequiredConstraints` are consistent with the governing contract.
6. Produce a `LLMOutputContractValidationResult` with per-section verdicts.

No section may proceed to the wording evaluation gate unless it passes all
contract validation checks.

---

## 9. How Wording Governance Will Inspect Drafts

Phase 8.2G-3 (Wording Evaluation Gate) will:
- Receive sections that passed Phase 8.2G-2 contract validation.
- Apply the wording score evaluation scaffold from the governance kernel.
- Verify that forbidden moves are not present in the candidate text.
- Verify that required constraints are reflected in the candidate text.
- Produce per-section wording scores and gate decisions.

Phase 8.2G-4 (Wording Review Gate) will:
- Receive sections that passed Phase 8.2G-3.
- Apply the wording review scaffold to produce final disposition per section.
- Block any section whose wording score is below the production threshold.

Only sections that pass Phase 8.2G-4 may be passed to Phase 8.2G-6
(Response Assembler) for user-visible output construction.

---

## 10. Invariants

The following invariants are non-negotiable in Phase 8.2G-1 and must be
preserved in all future phases:

| Invariant | Status |
|---|---|
| No live LLM called | HARDCODED in Phase 8.2G-1 |
| No user-visible output | HARDCODED in Phase 8.2G-1 |
| No final explanation text | Mock fixture only |
| No legal conclusions | Prohibited by type contract |
| No deadline calculation | Prohibited by type contract |
| No amount calculation | Prohibited by type contract |
| No false reassurance | `contains_false_reassurance` safety flag |
| `neverUserVisible: true` on all candidates | Literal type constraint |
| `liveLLMCalled: false` on all results | Literal type constraint |
| `userVisibleOutputAllowed: false` on all results | Literal type constraint |
| `future_live_llm` mode explicitly blocked | Enforced by mock adapter |
| Governance metadata propagated unchanged | Enforced by mock adapter |

---

## Regression Scaffold

`runRuntimeLLMDraftAdapterRegressionScaffold()` runs 10 cases:

| Case | Description |
|---|---|
| 1 | Mock free_preview basic — base invariants |
| 2 | Mock paid_explanation — three sections returned |
| 3 | Forbidden moves propagated |
| 4 | Required constraints propagated |
| 5 | `future_live_llm` mode blocked |
| 6 | Blank `contractRef` emits missing_contract |
| 7 | `neverUserVisible` invariant — all sections and result |
| 8 | Allowed section filtering — excluded sections absent |
| 9 | Audit trace parent IDs preserved exactly |
| 10 | Unsafe fixture flag behavior — controlled path |

---

## Files

| File | Purpose |
|---|---|
| `runtime-llm-draft-adapter-types.ts` | All types for Phase 8.2G-1 |
| `run-runtime-llm-draft-mock-adapter.ts` | Mock adapter implementation |
| `runtime-llm-draft-adapter-regression-scaffold.ts` | 10-case regression scaffold |

---

## Safety Boundary

This phase:
- Does **not** call any LLM or external API.
- Does **not** import any LLM SDK.
- Does **not** add API keys, env vars, or configuration.
- Does **not** modify Smart Talk prompts, API routes, UI, OCR, payments, or production rendering.
- Does **not** produce user-visible text.
- Does **not** couple to any runtime process or database.

Next phase: **8.2G-2 — LLM Output Contract Validator**
