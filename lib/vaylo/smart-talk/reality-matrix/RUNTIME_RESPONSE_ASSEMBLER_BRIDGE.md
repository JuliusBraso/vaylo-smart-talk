# Runtime Response Assembler Bridge (Phase 8.2G-6)

## 1. Why This Phase Exists

Phases 8.2G-1 through 8.2G-5A established a full governance pipeline for LLM draft generation and validation. By the end of Phase 8.2G-5A, a valid draft could:
- Pass the output contract validator (8.2G-2) with proper proof on the live path
- Be checked by the wording governance gate (8.2G-3)
- Be traced through audit and diagnostic infrastructure (8.2G-4)

But there was no layer that consumed these validated results and produced a structured internal candidate. Phase 8.2G-6 introduces that bridge.

## 2. What Response Assembly Bridge Means

The bridge takes a fully validated draft and transforms it into an internal `RuntimeResponseAssemblerBridgeResult` containing:
- `RuntimeResponseAssemblerSectionCandidate[]` — section candidates with internal prefixes stripped
- `eligibleForFutureUserVisibleAssembly: boolean` — true only when all gates pass and no leaks
- Safety invariant fields: `userVisibleOutputEmitted: false`, `userVisibleOutputAllowed: false`, `persistenceUsed: false`, `dnaSavePerformed: false`, `offlineSavePerformed: false`

## 3. What It Does NOT Mean

The bridge does NOT:
- Produce user-visible text
- Connect to Smart Talk API routes or UI
- Call any LLM
- Persist anything
- Save to DNA, database, or cloud
- Generate new prose or translate existing text
- Perform semantic or legal analysis
- Grant authorisation for display — that is Phase 8.2G-7+

Even when `eligibleForFutureUserVisibleAssembly: true`, the output is still governance-internal.

## 4. Why Output Is Still Never-User-Visible

The `eligibleForFutureUserVisibleAssembly` flag is an internal governance signal only. It means the pipeline produced a candidate that _could_ be shown to users if a future Phase 8.2G-7+ user-visible assembly gate approves it. No such gate exists yet. Until it does, `userVisibleOutputEmitted: false` and `userVisibleOutputAllowed: false` remain literal type invariants.

## 5. Required Upstream Gates

All four upstream conditions must be satisfied for `assembled_internal_candidate`:

| Gate | Required value | Source |
|------|---------------|--------|
| Output contract validator | `accepted_for_next_gate` | Phase 8.2G-2 |
| Wording governance gate | `accepted_for_audit_dry_run` | Phase 8.2G-3 |
| Audit trace validity | `true` | Phase 8.2G-4 |
| Diagnostic envelope validity | `true` | Phase 8.2G-4 |

## 6. Mock Path Behavior

For mock adapter results (`adapterMode: "mock"`, `liveLLMCalled: false`):
- All gates apply as above
- Section texts start with `[MOCK_DRAFT_NEVER_USER_VISIBLE]`; the bridge strips this prefix
- `liveLLMCalled: false` on the bridge result

## 7. Live Sandbox Path Behavior

For live sandbox results (`adapterMode: "future_live_llm"`, `liveLLMCalled: true`, valid `RuntimeLiveSandboxGuardProof`):
- Output contract validator (8.2G-2/8.2G-5A) must have accepted with `liveLLMCalled: true`
- Section texts start with `[LIVE_SANDBOX_DRAFT_NEVER_USER_VISIBLE]`; the bridge strips this prefix
- `liveLLMCalled: true` is preserved on the bridge result
- The bridge does not re-validate the proof; it trusts the upstream output contract validation

## 8. Human Review Packet Behavior

When `wordingGateResult.verdict === "human_review_required"`:
- Verdict: `assembled_human_review_packet`
- Only `review_recommendation` and `uncertainty_notice` sections are assembled
- `eligibleForFutureUserVisibleAssembly: false` — a human reviewer must act first
- The packet is still never-user-visible

## 9. Prefix Stripping Behavior

`stripKnownInternalDraftPrefix(text)` checks for exactly two prefixes:
- `[MOCK_DRAFT_NEVER_USER_VISIBLE]`
- `[LIVE_SANDBOX_DRAFT_NEVER_USER_VISIBLE]`

If found, it removes the prefix and trims leading whitespace. The result (`textCandidate`) is still internal — the bridge does NOT rewrite, translate, extend, or improve the text.

If no known prefix is found, `hadKnownPrefix: false` and text is returned unchanged.

## 10. Internal Metadata Leak Detection

`detectInternalMetadataLeak(text)` returns `true` if any of these markers appear in the text:
- `neverUserVisible`, `Diagnostic`, `diagnostic`, `AuditTrace`, `auditTrace`
- `llm_output_`, `runtime_dry_run_`, `wording_gate_`, `live_path_proof_`
- `[MOCK_DRAFT_NEVER_USER_VISIBLE]`, `[LIVE_SANDBOX_DRAFT_NEVER_USER_VISIBLE]`

If any section candidate contains such markers after prefix stripping:
- Verdict: `rejected_internal_metadata_leak`
- `eligibleForFutureUserVisibleAssembly: false`

This is a defensive check only — it does not perform semantic or legal prose analysis.

## 11. No Persistence / No DNA Save / No Offline Save

By design:
- `persistenceUsed: false` — literal type; no DB writes, no file writes
- `dnaSavePerformed: false` — literal type; no Vaylo DNA layer touched
- `offlineSavePerformed: false` — literal type; no local storage, no device storage

These are compile-time invariants that match `persistenceUsed: false` in the upstream pipeline invariants from Phase 8.2G-4.

## 12. No UI / No API Route

- No Smart Talk API route is modified
- No UI component receives output
- No HTTP endpoint is created
- No Next.js page or component is changed
- The bridge is internal-only governance infrastructure

## 13. Regression Cases

| # | Case | Expected |
|---|------|----------|
| 1 | Safe mock path | `assembled_internal_candidate`, `liveLLMCalled:false` |
| 2 | Output contract rejected | `rejected_output_contract_not_accepted`, no sections |
| 3 | Wording hard fail | `rejected_wording_gate_not_accepted` |
| 4 | Human review required | `assembled_human_review_packet`, `eligibleForFuture:false` |
| 5 | auditTraceValid:false | `rejected_audit_trace_invalid` |
| 6 | diagnosticEnvelopeValid:false | `rejected_diagnostic_envelope_invalid` |
| 7 | Mock prefix stripped | `internalDraftPrefixRemoved:true`, no prefix in textCandidate |
| 8 | Live sandbox prefix stripped | `internalDraftPrefixRemoved:true`, `liveLLMCalled:true` |
| 9 | Internal metadata leak | `rejected_internal_metadata_leak` |
| 10 | No sections | `rejected_missing_sections` |
| 11 | No persistence / saves | All false invariants confirmed |
| 12 | No user-visible emission | `userVisibleOutputEmitted/Allowed:false` both paths |
| 13 | Live sandbox path assembles | `assembled_internal_candidate`, `liveLLMCalled:true` |
| 14 | No internal objects in candidates | Only allowed fields in `RuntimeResponseAssemblerSectionCandidate` |

## 14. Phase 8.2G-6A Update

**Phase 8.2G-6A** resolved the modeling weakness noted in section 16 of the Phase 8.2G-6 output report. `RuntimeWordingGateInput.draftResult` was changed to accept `RuntimeLLMOutputContractDraftResult`, so live sandbox results can now flow through the wording gate natively. Cases 8 and 13 of this scaffold were updated to use `runRuntimeWordingGovernanceGate()` directly instead of the synthetic `ACCEPTED_WORDING_GATE` fixture. See `RUNTIME_WORDING_GATE_LIVE_PATH_EXTENSION.md`.

## 15. Next Phase Recommendation

**Phase 8.2G-7 — User-Visible Response Authorisation Gate**: The first gate that can set `acceptedForUserVisibleAssembly: true`. This gate would:
- Accept only `assembled_internal_candidate` results from Phase 8.2G-6
- Apply a final content policy check on `textCandidate` fields
- Optionally invoke a wording transform (non-LLM, rule-based)
- Return a final `UserVisibleResponsePacket` with `acceptedForUserVisibleAssembly: true`
- This packet would be the only thing allowed into the Smart Talk response assembler

Until Phase 8.2G-7 exists, `acceptedForUserVisibleAssembly` remains permanently `false` throughout the entire pipeline.
