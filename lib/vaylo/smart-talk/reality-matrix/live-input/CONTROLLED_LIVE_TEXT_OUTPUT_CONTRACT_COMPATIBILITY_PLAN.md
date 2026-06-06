# Controlled Live Text Output Contract Compatibility Plan — Phase 8.2I-0

**Status:** Planning only. No validator changes. No mock bridge removal. No real text forwarding. No API/UI changes. No live LLM call. No persistence.

---

## 1. Purpose

Phase 8.2I-0 defines how the temporary mock-shaped bridge introduced in Phase 8.2H-5 will be removed and replaced with a formally recognised controlled live text path through the 8.2G output contract validator.

---

## 2. Why 8.2I Exists

The 8.2H epoch was closed with warnings because the controlled live text draft output (prefixed `[CONTROLLED_LIVE_TEXT_DRAFT_NEVER_USER_VISIBLE]`) was not recognised by the 8.2G output contract validator. To work around this, Phase 8.2H-5 wrapped the adapter candidate in a temporary mock-shaped `RuntimeLLMOutputContractDraftResult` before passing it to the validator. This bridge is safe for internal guarded testing but is not acceptable for forwarding real redacted user text.

Phase 8.2I removes this debt in five ordered implementation phases.

---

## 3. 8.2H Closure Debt Being Addressed

| Debt ID | Title | Blocks |
|---|---|---|
| 8.2H-DEBT-001 | Temporary mock-shaped bridge | Public launch |
| 8.2H-DEBT-002 | Real redacted text not forwarded into 8.2G | Public launch |

Both items have `blocksEpochClosure: false` and `blocksPublicLaunch: true`. They are the primary targets of 8.2I.

---

## 4. Current Temporary Mock-Shaped Bridge

**Location:** `live-input/run-guarded-live-text-runtime-pipeline.ts`

**What it does:** After the 8.2H E2E harness completes, the pipeline constructs a `RuntimeLLMOutputContractDraftResult` with `adapterMode: "mock"` and a section using the `[MOCK_DRAFT_NEVER_USER_VISIBLE]` prefix. This satisfies the mock path in the validator without the validator needing to know about controlled live text.

**Why it is acceptable now:** The pipeline is synthetic and guarded. No real user text reaches the validator. The bridge is documented and tagged for removal.

**Why it must be removed:** It prevents real redacted text from ever reaching the 8.2G governance chain under its own formal source kind. It also makes the pipeline's behaviour opaque — the validator cannot distinguish a mock fixture from a controlled live text input.

---

## 5. Why Real Redacted Text Forwarding Remains Blocked

The 8.2G output contract validator has three checks that would reject a real controlled live text section:

1. `adapterMode` must be `"mock"` or `"future_live_llm"` — any other value triggers `llm_output_unrecognized_draft_source`.
2. Section `draftText` must start with `[MOCK_DRAFT_NEVER_USER_VISIBLE]` (mock path) or `[LIVE_SANDBOX_DRAFT_NEVER_USER_VISIBLE]` (live sandbox path) — any other prefix triggers `llm_output_missing_mock_prefix`.
3. The live sandbox path requires a valid `RuntimeLiveSandboxGuardProof` — no equivalent proof type exists for controlled live text yet.

Until all three are resolved, `readyForControlledRealTextForwardingTo8_2G: false`.

---

## 6. Target Compatibility Model

The controlled live text path should be modelled analogously to the live sandbox path:

```
adapterMode:     "controlled_live_text"           (new)
prefix:          [CONTROLLED_LIVE_TEXT_DRAFT_NEVER_USER_VISIBLE]   (existing)
guard proof:     ControlledLiveTextRedactionProof   (new, analogous to RuntimeLiveSandboxGuardProof)
liveLLMCalled:   false                             (literal; no LLM involved)
neverUserVisible: true                             (literal; always)
```

The validator adds a third dispatch branch:

```
isMockPath          → adapterMode === "mock"
isLiveSandboxPath   → adapterMode === "future_live_llm" && liveLLMCalled === true
isControlledLiveTextPath → adapterMode === "controlled_live_text" && liveLLMCalled === false
```

The controlled live text branch enforces:
- Proof present and valid (`ControlledLiveTextRedactionProof`).
- Proof attests `redactionBoundaryPassed: true`.
- All sections use `[CONTROLLED_LIVE_TEXT_DRAFT_NEVER_USER_VISIBLE]` prefix.
- `liveLLMCalled: false` (defensive runtime check).

---

## 7. Required Validator Changes

| Change | File | Notes |
|---|---|---|
| Add `"controlled_live_text"` to `RuntimeLLMAdapterMode` | `runtime-llm-draft-adapter-types.ts` | Third recognised mode |
| Add `ControlledLiveTextRedactionProof` type | new file in `live-input/` | Attests `redactionBoundaryPassed: true` |
| Add `controlled_live_text_adapter_result` to `RuntimeLLMOutputContractDraftSourceKind` | `runtime-llm-output-contract-validator-types.ts` | Third source kind |
| Widen `RuntimeLLMOutputContractDraftResult.adapterMode` union | `runtime-llm-output-contract-validator-types.ts` | Accept `"controlled_live_text"` |
| Add `CONTROLLED_LIVE_TEXT_DRAFT_PREFIX` constant | `validate-runtime-llm-output-contract.ts` | Already exists as string in adapter; formalise |
| Add controlled live text dispatch branch | `validate-runtime-llm-output-contract.ts` | New `isControlledLiveTextPath` branch |
| Add `llm_output_controlled_live_text_proof_missing` violation code | `runtime-llm-output-contract-validator-types.ts` | Analogous to `llm_output_live_sandbox_proof_missing` |
| Add `llm_output_controlled_live_text_prefix_missing` violation code | `runtime-llm-output-contract-validator-types.ts` | Analogous to `llm_output_live_sandbox_prefix_missing` |

---

## 8. Required Controlled Live Text Draft Result Model

A new `ControlledLiveTextDraftResult` type (or interface extension) must carry:

```typescript
{
  adapterMode: "controlled_live_text";
  liveLLMCalled: false;                    // literal
  userVisibleOutputAllowed: false;         // literal
  neverUserVisible: true;                  // literal
  redactionProof: ControlledLiveTextRedactionProof;
  sectionCandidates: readonly RuntimeLLMDraftSectionCandidate[];
  appliedForbiddenMoves: readonly string[];
  appliedRequiredConstraints: readonly string[];
  accessTier: RuntimeLLMAdapterAccessTier;
}
```

Sections must use `[CONTROLLED_LIVE_TEXT_DRAFT_NEVER_USER_VISIBLE]` prefix exclusively.

---

## 9. Required Prefix Support

- `CONTROLLED_LIVE_TEXT_DRAFT_PREFIX = "[CONTROLLED_LIVE_TEXT_DRAFT_NEVER_USER_VISIBLE]"` must be added as a named constant in `validate-runtime-llm-output-contract.ts`.
- The per-section validator must enforce this prefix on the controlled live text path, identical to how `MOCK_DRAFT_PREFIX` and `LIVE_SANDBOX_DRAFT_PREFIX` are enforced.
- No cross-path prefix use: mock sections must not use the controlled prefix and vice versa.

---

## 10. Guard / Proof Requirements

A `ControlledLiveTextRedactionProof` must attest:

```typescript
{
  redactionBoundaryPassed: true;            // literal
  redactionRunId: string;
  redactionPatternCount: number;
  acceptedForControlledLiveAdapter: true;   // mirrors 8.2H-2 accepted field
  neverContainsRawDetectedValues: true;
  neverUserVisible: true;
}
```

This proof is created by `run-real-text-redaction-boundary.ts` after a successful redaction and carried into the `ControlledLiveTextDraftResult`. The validator verifies `redactionBoundaryPassed === true` before accepting the path — mirroring the `outputShapeValidated` check on the live sandbox proof.

---

## 11. Regression Requirements

Phase 8.2I-2 (validator extension) must add regression cases:
- Controlled live text path with valid proof → `accepted_for_next_gate`.
- Controlled live text path with missing proof → `rejected_visibility_violation`.
- Controlled live text path with wrong prefix on section → `rejected_visibility_violation`.
- Mock path behaviour unchanged (regression must still pass).
- Live sandbox path behaviour unchanged (regression must still pass).

---

## 12. What Must Remain Unchanged

- Mock path: `adapterMode === "mock"`, `[MOCK_DRAFT_NEVER_USER_VISIBLE]` prefix, `liveLLMCalled: false`. No invariant weakened.
- Live sandbox path: `adapterMode === "future_live_llm"`, `liveLLMCalled === true`, `RuntimeLiveSandboxGuardProof`. No invariant weakened.
- All existing regression scaffold cases must continue to pass after the validator extension.
- The 8.2H E2E harness and guarded runtime pipeline must continue to function throughout 8.2I (the mock bridge may be removed only after the new path is regression-proven).

---

## 13. Explicit Non-Goals of 8.2I-0

- Does NOT modify the output contract validator.
- Does NOT remove the temporary mock bridge.
- Does NOT forward real redacted text.
- Does NOT add `ControlledLiveTextRedactionProof` type.
- Does NOT call any live LLM.
- Does NOT modify API routes.
- Does NOT touch UI.
- Does NOT enable public anonymous live runtime.
- Does NOT set `readyForPublicLaunch: true`.
- Does NOT set `readyForControlledRealTextForwardingTo8_2G: true`.

---

## 14. Ordered Next Phases

| Phase | Title | Output |
|---|---|---|
| 8.2I-1 | Controlled Live Text Draft Result Types | `ControlledLiveTextDraftResult`, `ControlledLiveTextRedactionProof` |
| 8.2I-2 | Output Contract Validator Extension | New dispatch branch, prefix constant, violation codes, regression cases |
| 8.2I-3 | Remove Temporary Mock Bridge | Delete bridge from `run-guarded-live-text-runtime-pipeline.ts` |
| 8.2I-4 | Real Redacted Text Forwarding Harness | E2E harness with real redacted text flowing into 8.2G chain |
| 8.2I-5 | Guarded Real Text Pipeline Closure Audit | Formally sets `readyForControlledRealTextForwardingTo8_2G: true` |

---

## 15. Exit Criteria for 8.2I-0

Phase 8.2I-0 is complete when:

- `CONTROLLED_LIVE_TEXT_OUTPUT_CONTRACT_COMPATIBILITY_PLAN_V1` is defined and exported.
- `temporaryMockBridgeStillPresent: true` (bridge not yet removed).
- `realRedactedTextForwardingTo8_2GAllowed: false`.
- `readyForControlledRealTextForwardingTo8_2G: false`.
- `readyForPublicLaunch: false`.
- `status: "ready_for_phase_8_2i_1"`.
- TypeScript and ESLint pass.
- No runtime changes made.
