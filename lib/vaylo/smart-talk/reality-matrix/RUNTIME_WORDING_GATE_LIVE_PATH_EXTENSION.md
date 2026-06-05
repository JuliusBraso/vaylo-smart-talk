# Runtime Wording Gate Live Path Extension (Phase 8.2G-6A)

## 1. Why This Phase Exists

Phase 8.2G-6 (Response Assembler Bridge) completed the first full internal candidate assembly from a validated 8.2G pipeline. However, its output report documented a remaining modeling weakness:

> `RuntimeWordingGateInput.draftResult` was bound to `RuntimeLLMDraftAdapterResult`, meaning the live sandbox path (`RuntimeLiveLLMSandboxDraftCandidateResult`) could not flow through the wording gate natively. Regression scaffolds in Phase 8.2G-6 worked around this by synthesising `RuntimeWordingGateResult` directly.

Phase 8.2G-6A resolves this by updating `RuntimeWordingGateInput.draftResult` to accept the wider `RuntimeLLMOutputContractDraftResult` interface (introduced in Phase 8.2G-5A).

## 2. Modeling Weakness Discovered in Phase 8.2G-6

The wording gate accepted only `RuntimeLLMDraftAdapterResult` (the Phase 8.2G-1 mock result), even though Phase 8.2G-5A introduced a union interface `RuntimeLLMOutputContractDraftResult` that both mock and live sandbox results satisfy.

As a result, any pipeline that received a live sandbox result had to bypass the wording gate entirely by injecting a synthetic `RuntimeWordingGateResult` object. This was safe but architecturally inconsistent — the gate should be able to operate on any validated draft source.

## 3. What Changed in RuntimeWordingGateInput

**Before (Phase 8.2G-3):**
```typescript
export interface RuntimeWordingGateInput {
  readonly draftResult: RuntimeLLMDraftAdapterResult;
  // ...
}
```

**After (Phase 8.2G-6A):**
```typescript
export interface RuntimeWordingGateInput {
  readonly draftResult: RuntimeLLMOutputContractDraftResult;
  // ...
}
```

`RuntimeLLMDraftAdapterResult` is a structural subtype of `RuntimeLLMOutputContractDraftResult`, so **all existing mock adapter call sites compile unchanged** — no other modifications to existing code are required.

## 4. Why Mock Path Remains Unchanged

`RuntimeLLMDraftAdapterResult` satisfies every field of `RuntimeLLMOutputContractDraftResult`:
- `adapterMode` ✓, `accessTier` ✓, `sectionCandidates` ✓
- `appliedForbiddenMoves` ✓, `appliedRequiredConstraints` ✓
- `liveLLMCalled: false` is assignable to `boolean` ✓
- `userVisibleOutputAllowed: false` ✓, `neverUserVisible: true` ✓
- `sandboxGuardProof?: ...` — optional; mock result doesn't provide it ✓

TypeScript's structural type system accepts the narrower type wherever the wider type is required. No mock path code changes.

## 5. Why Sandbox Proof Is Not Revalidated in the Wording Gate

The wording gate's responsibility is **tone and wording evaluation only** (Phase 8.2G-3). Proof validation is the responsibility of the upstream output contract validator (Phase 8.2G-5A). Re-validating `sandboxGuardProof` inside the wording gate would:
- violate the single-responsibility principle for each gate
- create duplicate validation logic that could diverge
- add unnecessary coupling between the wording gate and sandbox infrastructure

The wording gate trusts `input.outputContractValidation.verdict === "accepted_for_next_gate"` as its upstream safety guarantee. The proof that produced that verdict was already validated by Phase 8.2G-5A.

## 6. Relationship to Phase 8.2G-5A Output Contract Validator

Phase 8.2G-5A established:
- `RuntimeLLMOutputContractDraftResult` as the union interface
- `validateRuntimeLiveSandboxGuardProof` for proof validation
- Live sandbox path acceptance requires a valid proof with `outputShapeValidated: true`

Phase 8.2G-6A builds on this: now that the output contract validator can accept live sandbox results, the wording gate can also accept them, because it uses the same `RuntimeLLMOutputContractDraftResult` input type.

## 7. Relationship to Phase 8.2G-6 Response Assembler Bridge

Phase 8.2G-6 (Response Assembler Bridge) already consumed `RuntimeLLMOutputContractDraftResult`. After this phase, the full native pipeline for both mock and live sandbox paths is:

```
runRuntimeLLMDraftMockAdapter() or RuntimeLiveLLMSandboxDraftCandidateResult
  → validateRuntimeLLMOutputContract()         (8.2G-2 / 8.2G-5A)
  → runRuntimeWordingGovernanceGate()           (8.2G-3, now 8.2G-6A extended)
  → runRuntimeResponseAssemblerBridge()         (8.2G-6)
```

No synthetic gate result injection is needed anywhere in this pipeline.

## 8. Why No Live LLM Judge Is Called

The wording gate operates on caller-supplied `WordingToneScoreReport` metadata only. It uses `evaluateExplanationWordingFromScoreReport` which is a pure deterministic function based on tone matrix values. No LLM judge, no NLP library, no prose semantic analysis — regardless of whether the draft result came from a mock or live sandbox path.

## 9. Why No Semantic Prose Analysis Occurs

`RuntimeLLMOutputContractDraftResult.sectionCandidates[].draftText` is never inspected for content in this gate. The gate only:
1. Checks `outputContractValidation.verdict`
2. Validates the `WordingToneScoreReport` structurally
3. Runs `evaluateExplanationWordingFromScoreReport` against the score report numbers

The `draftText` is read only to derive a draft ID for the wording evaluation call (via `deriveDraftId` which reads `draftId` or `sandboxRunId` through unsafe field access).

## 10. Why User-Visible Output Remains Forbidden

The wording gate always sets:
- `acceptedForUserVisibleAssembly: false` — literal type invariant
- `userVisibleOutputAllowed: false` — literal type invariant
- `neverUserVisible: true` — compile-time invariant

These invariants apply to both mock and live sandbox paths. Phase 8.2G-7+ is required to authorise actual user display.

## 11. Regression Cases

| # | Case | Expected |
|---|------|----------|
| 1 | Live sandbox + valid proof + safe score | `accepted_for_audit_dry_run` |
| 2 | Live sandbox + human review score | `human_review_required` |
| 3 | Live sandbox + hard fail score | `hard_fail_wording_violation` |
| 4 | Live sandbox without valid proof (contract rejected) | `rejected_previous_gate_failed` |
| 5 | Live sandbox + null score report | `rejected_missing_score_report` |
| 6 | Live sandbox + invalid score report | `rejected_invalid_score_report` |
| 7 | Section results all `neverUserVisible: true` | 2 sections, invariants hold |
| 8 | `realTextSemanticallyEvaluated: false` | Diagnostic present |
| 9 | `liveLLMJudgeCalled: false` | Always false |
| 10 | `acceptedForUserVisibleAssembly: false` on all paths | Invariant holds |

## 12. Next Phase Recommendation

**Phase 8.2G-7 — User-Visible Response Authorisation Gate**: The first gate that can set `acceptedForUserVisibleAssembly: true`. It would accept only `assembled_internal_candidate` results from Phase 8.2G-6 and apply a final content policy check before producing a `UserVisibleResponsePacket`.

The full native pipeline (8.2G-1 → 8.2G-5A → 8.2G-3/6A → 8.2G-6) is now established for both mock and live sandbox paths. Phase 8.2G-7 is the natural next step.
