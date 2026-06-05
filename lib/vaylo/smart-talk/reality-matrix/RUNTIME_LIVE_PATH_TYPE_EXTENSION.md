# Runtime Live Path Type Extension (Phase 8.2G-5A)

## 1. Why This Phase Exists

Phase 8.2G-5 introduced a strictly sandboxed live LLM adapter capable of calling OpenAI under explicit opt-in conditions. The adapter produced safe output — output shape validated, PII guards confirmed, visibility invariants preserved — but could not feed that output into the Phase 8.2G-2 output contract validator.

Phase 8.2G-5A resolves that gap by introducing a formal `RuntimeLiveSandboxGuardProof` type and extending the output contract validator to accept live sandbox results only when they carry a valid, runtime-verified proof.

## 2. The Modeling Gap from Phase 8.2G-5

`RuntimeLLMDraftAdapterResult` (Phase 8.2G-1) carries:
```
liveLLMCalled: false   ← literal type false
```

`RuntimeLiveLLMSandboxDraftCandidateResult` (Phase 8.2G-5) carries:
```
liveLLMCalled: true    ← literal type true
adapterMode: "future_live_llm"
```

The Phase 8.2G-2 validator previously:
- Rejected any result with `liveLLMCalled !== false`
- Rejected any result with `adapterMode === "future_live_llm"`

These were correct rules for a mock-only world. Phase 8.2G-5A makes a controlled exception: the live sandbox path is accepted **only** when a valid `RuntimeLiveSandboxGuardProof` is present and passes all 12 validation rules.

## 3. Why `RuntimeLLMDraftAdapterResult` Was Not Weakened

`RuntimeLLMDraftAdapterResult.liveLLMCalled: false` is a compile-time invariant. Changing it to `boolean` in the mock adapter result would:
- Remove a compile-time guarantee that no live LLM was called in the mock path
- Allow future code to accidentally treat mock results as live-called

Instead, Phase 8.2G-5A introduces `RuntimeLLMOutputContractDraftResult` — a narrow interface union that:
- Requires only `liveLLMCalled: boolean` (accepting both `false` and `true`)
- Is satisfied structurally by both `RuntimeLLMDraftAdapterResult` and `RuntimeLiveLLMSandboxDraftCandidateResult`
- Does NOT modify `RuntimeLLMDraftAdapterResult` itself

Only `RuntimeLLMOutputContractValidationResult.liveLLMCalled` changes from `false` to `boolean`, reflecting the validator's output, not its input constraints.

## 4. Live Sandbox Guard Proof

`RuntimeLiveSandboxGuardProof` carries evidence that all six sandbox guards passed:

| Field                   | Required value | Guard meaning                          |
|-------------------------|----------------|----------------------------------------|
| `allowLiveCall`         | `true`         | Explicit opt-in to live call           |
| `syntheticOnly`         | `true`         | Synthetic fixture used, not real data  |
| `neverContainsRealPii`  | `true`         | PII guard confirmed                    |
| `outputShapeValidated`  | `true`         | LLM output structure verified          |
| `promptContractBuilt`   | `true`         | Prompt was built from contract         |
| `userVisibleOutputAllowed` | `false`     | Output must never reach users          |
| `persistenceUsed`       | `false`        | No DB writes                           |
| `realUserInputUsed`     | `false`        | No real user data                      |

The proof is built by `runRuntimeLiveLLMSandboxAdapter` only when the live call completes successfully **and** `validateLiveLLMOutputShape()` returns valid. It is never fabricated for non-live paths.

## 5. Validator Live Path Acceptance Rules

`validateRuntimeLLMOutputContract` accepts a live sandbox result only when **all** of:

1. `result.adapterMode === "future_live_llm"`
2. `result.liveLLMCalled === true` (runtime check via `unsafeReadField`)
3. `result.sandboxGuardProof` is present
4. `validateRuntimeLiveSandboxGuardProof(result.sandboxGuardProof).valid === true`
5. `proof.outputShapeValidated === true`
6. Every section's `draftText` starts with `[LIVE_SANDBOX_DRAFT_NEVER_USER_VISIBLE]`
7. All existing shared checks pass (forbidden moves, required constraints, section types, safety flags, `neverUserVisible`, `userVisibleOutputAllowed`)

If any condition fails, the result is rejected with a specific violation code:
- `llm_output_live_sandbox_proof_missing` — no proof
- `llm_output_live_sandbox_proof_invalid` — proof failed validation
- `llm_output_live_sandbox_shape_not_attested` — `outputShapeValidated !== true`
- `llm_output_live_sandbox_prefix_missing` — draftText missing live prefix
- `llm_output_forbidden_adapter_mode` — `future_live_llm` + `liveLLMCalled !== true`

## 6. Mock Path Remains Unchanged

The mock path behavior is identical to Phase 8.2G-2:
- `result.adapterMode === "mock"` is the trigger
- `liveLLMCalled` must be `false` (defensive runtime check)
- `draftText` must start with `[MOCK_DRAFT_NEVER_USER_VISIBLE]`
- All other rules apply as before

Phase 8.2G-5A does not modify `RuntimeLLMDraftAdapterResult`, `runRuntimeLLMDraftMockAdapter`, or any mock path logic.

## 7. Why `acceptedForUserVisibleAssembly` Remains False

This validator is not the final gating step. Even when a live sandbox result is accepted (`verdict === "accepted_for_next_gate"`), it still proceeds to:
- Phase 8.2G-3 (wording governance gate)
- Phase 8.2G-4 (governance dry-run, audit, diagnostics)
- Phase 8.2G-6 (response assembler — not yet built)

Only Phase 8.2G-6 may set `acceptedForUserVisibleAssembly: true`. Until that gate exists and is wired, all output remains strictly internal.

## 8. Why This Is Not Production Runtime

- No Smart Talk API route is modified
- No OCR or document processing occurs
- No real user input is processed
- No UI components receive output
- No DB writes
- Synthetic fixtures only
- The live path is guarded by `VAYLO_ALLOW_LIVE_LLM_SANDBOX` env flag (optional, Phase 8.2G-5)

This phase is a pure type and validation infrastructure extension for the governance pipeline.

## 9. Why No Live LLM Call Occurs in This Phase

Phase 8.2G-5A is a **type extension and validator bridge** phase. It introduces:
- `RuntimeLiveSandboxGuardProof` — proof type
- `validateRuntimeLiveSandboxGuardProof` — pure proof validator
- `RuntimeLLMOutputContractDraftResult` — validator input union
- Updated `validateRuntimeLLMOutputContract` — accepts live sandbox path with proof

No LLM call is made. The live call infrastructure (from Phase 8.2G-5) is unchanged. Phase 8.2G-5A merely ensures that if Phase 8.2G-5 does produce a live result, that result can now flow through the output contract validator safely.

## 10. Regression Cases

| # | Case | Expected Result |
|---|------|----------------|
| 1 | Mock valid path | `accepted_for_next_gate`, `liveLLMCalled:false` |
| 2 | Mock unsafe path | `rejected_unsafe_draft` |
| 3 | Live path, missing proof | `rejected_contract_violation`, `llm_output_live_sandbox_proof_missing` |
| 4 | Live path, invalid proof | `rejected_contract_violation`, `llm_output_live_sandbox_proof_invalid` |
| 5 | Live path, valid proof + prefix | `accepted_for_next_gate`, `liveLLMCalled:true` |
| 6 | Live path, missing prefix | `rejected_visibility_violation`, `llm_output_live_sandbox_prefix_missing` |
| 7 | Live path, safety flag | `rejected_unsafe_draft` |
| 8 | Live path, missing forbidden move coverage | `rejected_contract_violation` |
| 9 | Live path, missing required constraint | `rejected_contract_violation` |
| 10 | Proof validator: null proof | `valid:false, status:missing` |
| 11 | Proof validator: syntheticOnly:false | `valid:false, live_path_proof_non_synthetic_fixture` |
| 12 | Proof validator: all valid | `valid:true, status:proven` |
| 13 | Both paths: `acceptedForUserVisibleAssembly` | Always `false` |
| 14 | Both paths: `userVisibleOutputAllowed` | Always `false` |

## 11. Phase 8.2G-6 — Response Assembler Bridge (completed)

The live sandbox path accepted by the output contract validator (8.2G-5A) can now flow
into the Phase 8.2G-6 Response Assembler Bridge. The bridge consumes
`RuntimeLLMOutputContractDraftResult` and produces internal section candidates with
prefixes stripped. See `RUNTIME_RESPONSE_ASSEMBLER_BRIDGE.md` for details.

## 13. Phase 8.2G-6A — Wording Gate Extension (completed)

`RuntimeWordingGateInput.draftResult` was extended to accept `RuntimeLLMOutputContractDraftResult`
(the union interface introduced in this phase). Live sandbox draft candidates validated here can now
flow into the wording gate natively without synthesized fixtures. See
`RUNTIME_WORDING_GATE_LIVE_PATH_EXTENSION.md`.

## 12. Original Next Phase Recommendation

**Phase 8.2G-6 — Response Assembler Bridge (now completed)**: The first phase that reads accepted output from the wording gate and prepares a validated, structured payload for user-visible assembly. The assembler must:
- Only accept verdicts from Phase 8.2G-3 with `acceptedForWordingGate: true`
- Only set `acceptedForUserVisibleAssembly: true` after its own safety pass
- Not expose `draftText` directly; transform to final explanation format
- Remain strictly non-user-visible until the final authorisation step
