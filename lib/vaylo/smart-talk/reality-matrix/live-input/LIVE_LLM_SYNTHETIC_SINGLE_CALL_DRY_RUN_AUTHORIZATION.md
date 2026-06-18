# Phase 8.3N — Live LLM Synthetic Single-Call Dry-Run Authorization

## 1. Purpose

Phase 8.3N is the final authorization gate before Phase 8.3O may execute exactly one controlled live LLM call with one synthetic case. It verifies that every pre-flight condition from Phase 8.3M is satisfied and produces a single positive gate: `readyForLiveLlmSyntheticSingleCallExecution`.

This phase is DRY-RUN AUTHORIZATION ONLY — it does not call a live LLM, read env values, import any LLM SDK, make HTTP requests, or construct prompt text.

---

## 2. What Dry-Run Authorization Means

"Dry-run authorization" in this phase means:

- All pre-flight conditions from Phase 8.3M are verified to be met.
- The kill switch is confirmed armed.
- The single-call counter is confirmed at zero before the call.
- The provider, model, and selected synthetic case are re-verified.
- All prompt blockers, metadata-only capture plan, post-call governance recheck, and post-call audit are confirmed ready.
- A single positive gate (`readyForLiveLlmSyntheticSingleCallExecution`) is produced for Phase 8.3O.
- No live LLM call is made. No prompt is constructed. No env values are read. No SDK is imported.

---

## 3. What This Phase Authorizes

This phase authorizes **only the next phase (8.3O)** to execute **exactly one synthetic live LLM call** subject to all of the following conditions being met in 8.3O:

- Kill switch is armed and will be disarmed after the call.
- Single-call counter is at zero before the call and at one after the call.
- Provider is `openai`, model is `gpt_4o_mini`, case is `synthetic_deadline_relative_missing_delivery_date`.
- Prompt is built from synthetic markers only — no real document text, raw user text, redacted text, OCR text, files, public requests, PII, secrets, or env values.
- Prompt text is not logged.
- Model output is not logged and not stored.
- Only metadata is captured.
- Post-call governance recheck and post-call audit are required.
- No Branch C, no run-smart-talk.ts, no OCR runtime, no persistence, no user-visible output, no public runtime.

---

## 4. What This Phase Does Not Execute

- Does NOT call a live LLM (`liveLLMCallPerformed: false` — literal)
- Does NOT authorize general live LLM runtime (`generalLiveLlmRuntimeAuthorizationAllowed: false` — literal)
- Does NOT authorize multiple live LLM calls (`multipleLiveLlmCallsAllowed: false` — literal)
- Does NOT read `process.env` (`envReadPerformed: false` — literal)
- Does NOT import any LLM SDK (`sdkImported: false` — literal)
- Does NOT make HTTP requests (`httpCallMade: false` — literal)
- Does NOT construct prompt text now (`promptTextConstructedNow: false` — literal)
- Does NOT log prompt text (`promptTextLogged: false` — literal)
- Does NOT log model output (`modelOutputLogged: false` — literal)
- Does NOT call `app/api/smart-talk/route.ts` Branch C
- Does NOT call or import `run-smart-talk.ts` or `extract-text-from-image.ts`
- Does NOT process real user input, OCR, photo, file, or public request
- Does NOT forward raw or redacted input to a live model
- Does NOT generate real AI output or store model output
- Does NOT emit user-visible output
- Does NOT persist data
- Does NOT enable public runtime
- Does NOT authorize public launch

---

## 5. Provider / Model / Case

| Field | Value |
|---|---|
| `provider` | `"openai"` (literal) |
| `model` | `"gpt_4o_mini"` (literal) |
| `selectedSyntheticCase` | `"synthetic_deadline_relative_missing_delivery_date"` (literal) |
| `providerVerified` | `true` (literal) |
| `modelVerified` | `true` (literal) |
| `selectedCaseVerified` | `true` (literal) |

---

## 6. Kill Switch State

| Field | Value |
|---|---|
| `killSwitchState` | `"armed"` (literal enum) |
| `killSwitchArmed` | `true` (literal) |

The kill switch must be armed before any future live LLM call proceeds. It must be disarmed after the call in Phase 8.3O.

---

## 7. Single-Call Counter State

| Field | Value |
|---|---|
| `singleCallCounterState` | `"zero_before_call"` (literal enum) |
| `singleCallCounterZero` | `true` (literal) |

The counter must be zero before the call. Phase 8.3O must verify it equals one after the call.

---

## 8. Authorization Gates

All 19 gates must be present in `authorizationGates`:

- `execution_plan_gate`, `provider_gate`, `model_gate`, `selected_case_gate`
- `kill_switch_gate`, `single_call_counter_gate`, `prompt_policy_gate`
- `prompt_logging_block_gate`, `model_output_logging_block_gate`
- `metadata_capture_gate`, `post_call_governance_recheck_gate`, `post_call_audit_gate`
- `no_real_input_gate`, `no_branch_c_gate`, `no_run_smart_talk_gate`, `no_ocr_runtime_gate`
- `no_user_visible_output_gate`, `no_persistence_gate`, `no_public_runtime_gate`

---

## 9. Checklist

All 19 checklist items must be confirmed in `checklistConfirmed`:

- `execution_plan_reviewed`, `provider_verified`, `model_verified`, `selected_case_verified`
- `kill_switch_armed_reviewed`, `single_call_counter_zero_reviewed`
- `prompt_policy_reviewed`, `prompt_text_not_constructed_now_reviewed`
- `prompt_text_not_logged_reviewed`, `model_output_not_logged_reviewed`
- `metadata_only_capture_reviewed`, `post_call_governance_recheck_reviewed`
- `post_call_audit_reviewed`, `no_real_input_reviewed`
- `existing_runtime_isolation_reviewed`, `no_persistence_reviewed`
- `no_user_visible_output_reviewed`, `no_public_runtime_reviewed`
- `next_phase_single_call_execution_required`

---

## 10. Forbidden Content

57 forbidden strings in `FORBIDDEN_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_STRINGS` — the full 8.3M set of 55 plus 2 new authorization-specific phrases:

- `"authorized general live llm"` — must not appear in notes or acknowledgments
- `"authorized public runtime"` — must not appear in notes or acknowledgments

---

## 11. Tamper Rejection Cases

The check runs 98 tamper cases. All must be rejected. Key categories:

| Tamper Category | Rejection Reason |
|---|---|
| `executionPlanReady: false` | `execution_plan_not_ready` |
| Missing scope/gate/checklist | respective `missing_*` reason |
| Invalid kill switch state | `invalid_kill_switch_state` |
| Invalid single-call counter state | `invalid_single_call_counter_state` |
| `authorizationDecision: "reject"` | `invalid_authorization_decision` |
| `dryRunAuthorizationOnly: false` | `authorization_attempted_live_llm_call` |
| `promptTextConstructedNow: true` | `authorization_attempted_prompt_construction` |
| `promptTextLogged: true` | `authorization_attempted_prompt_logging` |
| `modelOutputLogged: true` | `authorization_attempted_model_output_logging` |
| All real/raw/OCR/file/public input `true` | `authorization_attempted_*` |
| All dependency/call flags `true` | `authorization_attempted_*_dependency` |
| All AI-output/model/user-visible/persistence/public `true` | `authorization_attempted_*` |
| Notes with new 8.3N-specific forbidden phrases | `unsafe_authorization_note_detected` |

---

## 12. Safety Invariants

| Invariant | Value |
|---|---|
| `dryRunAuthorizationOnly` | **`true`** (literal) |
| `nextPhaseExecutionRequired` | **`true`** (literal) |
| `authorizeExactlyOneSyntheticCallNextPhase` | **`true`** (literal) |
| `generalLiveLlmRuntimeAuthorizationAllowed` | **`false`** (literal) |
| `multipleLiveLlmCallsAllowed` | **`false`** (literal) |
| `providerVerified`, `modelVerified`, `selectedCaseVerified` | **`true`** (literal) |
| `killSwitchArmed` | **`true`** (literal) |
| `singleCallCounterZero` | **`true`** (literal) |
| `promptPolicyReady` | **`true`** (literal) |
| `metadataOnlyCaptureReady` | **`true`** (literal) |
| `postCallGovernanceRecheckReady` | **`true`** (literal) |
| `postCallAuditReady` | **`true`** (literal) |
| `liveLLMCallPerformed` / `liveLLMCalled` | **`false`** (literal) |
| `envReadPerformed` | **`false`** (literal) |
| `sdkImported` | **`false`** (literal) |
| `httpCallMade` | **`false`** (literal) |
| `promptTextConstructedNow` | **`false`** (literal) |
| `promptTextLogged` | **`false`** (literal) |
| `modelOutputLogged` | **`false`** (literal) |
| `syntheticInputOnly` | **`true`** (literal) |
| All real/raw/OCR/file/public input allowed | **`false`** (literal) |
| All dependency/call flags | **`false`** (literal) |
| All AI-output/model/user-visible/persistence/public/pilot flags | **`false`** (literal) |
| `readyForLiveLLMRuntime` — `readyForPersistence` | **`false`** (literal) |
| `apiRouteModifiedByAuthorization` | **`false`** (literal) |
| `existingRuntimeModifiedByAuthorization` | **`false`** (literal) |
| `uiTouched` | **`false`** (literal) |
| `databaseOrStorageModifiedByAuthorization` | **`false`** (literal) |
| `neverUserVisible` | **`true`** (literal) |

---

## 13. Readiness Decision

On success (`allPassed: true`):

```
readyForLiveLlmSyntheticSingleCallExecution: true
readyForLiveLLMRuntime: false
readyForConnectedAiRuntimeExecution: false
readyForRealOperatorPilotRun: false
readyForPilotRunNow: false
readyForPublicLaunch: false
readyForPersistence: false
generalLiveLlmRuntimeAuthorizationAllowed: false
multipleLiveLlmCallsAllowed: false
```

**This dry-run authorization permits only the next phase: Live LLM Synthetic Single-Call Execution (Phase 8.3O).**

General live LLM runtime is NOT authorized. Public runtime is NOT authorized.

---

## 14. Next Phase

**Phase 8.3O — Live LLM Synthetic Single-Call Execution**

Phase 8.3O will:
1. Call `runLiveLlmSyntheticSingleCallDryRunAuthorization()` and verify `readyForLiveLlmSyntheticSingleCallExecution: true`.
2. Arm the kill switch.
3. Verify the single-call counter equals zero.
4. Build the prompt from synthetic markers only (no real input, no logging).
5. Execute exactly one call to `openai` / `gpt_4o_mini` with the `synthetic_deadline_relative_missing_delivery_date` case.
6. Capture metadata only (no model output stored, no prompt logged, no model output logged).
7. Disarm the kill switch.
8. Verify the single-call counter equals one.
9. Require post-call governance recheck and post-call audit.
