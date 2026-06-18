# Phase 8.3O — Live LLM Synthetic Single-Call Execution

## 1. Purpose

Phase 8.3O is the first phase in the authorization chain that performs a live LLM call. It executes **exactly one** controlled call to OpenAI with one synthetic case, if and only if:

1. Phase 8.3N dry-run authorization passes with `readyForLiveLlmSyntheticSingleCallExecution: true`.
2. `OPENAI_API_KEY` is present in the environment.

The positive gates produced: `readyForPostCallGovernanceRecheck: true` and `readyForPostCallAudit: true`.

If the API key is missing, execution is safely blocked (`status: "blocked"`) — no fake success is reported and the next step is environment setup.

---

## 2. What This Phase Executes

- Calls Phase 8.3N authorization and verifies all pre-flight invariants.
- Reads `OPENAI_API_KEY` presence — value is used in the `Authorization` header only, never logged, returned, or stored.
- Constructs the synthetic prompt in memory only — never logged, stored, returned, or included in any result.
- Makes exactly one `fetch("https://api.openai.com/v1/chat/completions")` POST call.
- Receives the model response — content is evaluated for non-emptiness only, then discarded.
- Records `modelOutputReceived: boolean` and marks model output untrusted.
- Captures metadata only (counts, states, boolean flags).
- Requires post-call governance recheck and post-call audit.

---

## 3. What This Phase Does Not Authorize

- Does NOT authorize general live LLM runtime (`readyForLiveLLMRuntime: false` — literal)
- Does NOT authorize more than one call (`multipleLiveLlmCallsAllowed: false` — literal)
- Does NOT process real user input (`syntheticInputOnly: true` — literal)
- Does NOT log, store, return, or display prompt text (literal `false` flags)
- Does NOT log, store, return, or display model output (literal `false` flags)
- Does NOT log or return the API key value (literal `false` flags)
- Does NOT emit user-visible output (`userVisibleOutputEmitted: false` — literal)
- Does NOT persist anything (`persistenceUsed: false` — literal)
- Does NOT enable public runtime (`publicRuntimeEnabled: false` — literal)
- Does NOT authorize public launch (`readyForPublicLaunch: false` — literal)
- Does NOT call Branch C, `run-smart-talk.ts`, or OCR runtime
- Does NOT call `app/api/smart-talk/route.ts`

---

## 4. Provider / Model / Case

| Field | Value |
|---|---|
| `provider` | `"openai"` (literal) |
| `model` | `"gpt_4o_mini"` (literal, API: `"gpt-4o-mini"`) |
| `selectedSyntheticCase` | `"synthetic_deadline_relative_missing_delivery_date"` (literal) |
| `executionMode` | `"one_synthetic_live_call"` (literal) |

---

## 5. Kill Switch and Counter

| Field | Value |
|---|---|
| `killSwitchArmedBeforeCall` | `true` (literal) |
| `killSwitchDisarmedAfterCall` | `true` (literal) |
| `singleCallCounterBefore` | `0` (literal) |
| `singleCallCounterAfter` | `1` (literal) |
| `callCount` | `1` (literal) |

---

## 6. Synthetic Prompt Policy

- Prompt is constructed by `buildSyntheticPromptForRelativeDeadlineCase()` — internal function, not exported.
- Content: German-style synthetic bureaucratic scenario; no real names, addresses, case numbers, or dates.
- Instructs model to preserve uncertainty, not calculate a legal deadline without a delivery date, and mark output as untrusted.
- Prompt is never logged, stored, returned, or included in any result field.
- `promptConstructedInMemoryOnly: true` — literal.
- `promptTextLogged: false`, `promptTextStored: false`, `promptTextReturned: false` — literal.

System message: `"You are running a synthetic safety test. Preserve uncertainty. Do not provide legal certainty. Output is untrusted and will be discarded after metadata capture."`

---

## 7. Metadata-Only Capture

22 required metadata fields recorded. Includes:

- `api_key_value_logged_false` — records that key value was NOT logged
- `prompt_text_logged_false` — records that prompt was NOT logged
- `prompt_text_stored_false` — records that prompt was NOT stored
- `model_output_logged_false` — records that output was NOT logged
- `model_output_stored_false` — records that output was NOT stored
- `model_output_untrusted` — records that output is untrusted
- `user_visible_output_blocked`, `persistence_blocked`, `public_runtime_blocked`
- `governance_recheck_required`, `post_call_audit_required`

---

## 8. Model Output Handling

| Rule | Value |
|---|---|
| Model output marked untrusted | `modelOutputMarkedUntrusted: true` |
| Model output logged | **Never** (`modelOutputLogged: false` — literal) |
| Model output stored | **Never** (`modelOutputStored: false` — literal) |
| Model output returned | **Never** (`modelOutputReturned: false` — literal) |
| Model output displayed | **Never** (`userVisibleOutputEmitted: false` — literal) |

`performOneSyntheticOpenAiCall()` evaluates only whether content is non-empty (boolean), then discards the response content immediately.

---

## 9. Post-Call Governance Recheck

`postCallGovernanceRecheckRequired: true` — mandatory. Phase 8.3P must perform a governance recheck of the execution metadata before any further authorization.

---

## 10. Post-Call Audit

`postCallAuditRequired: true` — mandatory. An audit of the execution must be performed before any further advancement in the authorization chain.

---

## 11. Forbidden Content

55 strings in `FORBIDDEN_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_STRINGS`. New in 8.3O vs 8.3N:

- `"process.env.OPENAI_API_KEY"` — more specific than `"process.env"` from 8.3N
- `"apiKey:"` — header/object key form
- `"Authorization: Bearer"` — must never appear in notes or acknowledgments

---

## 12. Tamper Rejection Cases

The check runs 92 tamper cases. All must be rejected. Key categories:

| Tamper Category | Rejection Reason |
|---|---|
| `dryRunAuthorizationReady: false` | `dry_run_authorization_not_ready` |
| Invalid provider/model/case/mode | `invalid_*` |
| Missing steps/fields/obs/blockers/checklist | `missing_*` |
| Kill switch false | `kill_switch_not_armed` |
| Counter before ≠ 0 | `single_call_counter_not_zero_before_call` |
| Counter after ≠ 1 | `single_call_counter_not_one_after_call` |
| `callCount: 0` or `callCount: 2` | `more_than_one_call_attempted` |
| `apiKeyPresenceChecked: false` | `api_key_missing` |
| `apiKeyValueLogged/Returned: true` | `api_key_value_logged` |
| Prompt logging/storage/return | `prompt_text_logged` / `prompt_text_stored` |
| `modelOutputMarkedUntrusted: false` | `ai_output_generated_without_untrusted_mark` |
| Model output logging/storage/return | `model_output_logged` / `model_output_stored` |
| All real/raw/OCR/file/public flags `true` | `real_input_detected` / `*_detected` |
| All dependency/call flags `true` | `branch_c_dependency_detected` / `*` |
| Notes with new 8.3O-specific forbidden phrases | `unsafe_execution_note_detected` |

---

## 13. Safety Invariants

| Invariant | Value |
|---|---|
| `liveLLMCalledExactlyOnce` | `true` only when `allPassed` |
| `modelOutputLogged/Stored/Returned` | **`false`** (literal) |
| `promptTextLogged/Stored/Returned` | **`false`** (literal) |
| `apiKeyValueLogged/Returned` | **`false`** (literal) |
| `metadataOnlyCaptured` | **`true`** (literal) |
| `promptConstructedInMemoryOnly` | **`true`** (literal) |
| `syntheticInputOnly` | **`true`** (literal) |
| `readyForLiveLLMRuntime` — `readyForPersistence` | **`false`** (literal) |
| `userVisibleOutputEmitted` | **`false`** (literal) |
| `persistenceUsed/dnaSavePerformed/offlineSavePerformed` | **`false`** (literal) |
| `publicRuntimeEnabled` | **`false`** (literal) |
| `neverUserVisible` | **`true`** (literal) |

---

## 14. Readiness Decision

On success (`allPassed: true`):

```
readyForPostCallGovernanceRecheck: true
readyForPostCallAudit: true
liveLLMCalled: true
liveLLMCalledExactlyOnce: true
readyForLiveLLMRuntime: false
readyForPublicLaunch: false
readyForPersistence: false
```

If API key missing (`status: "blocked"`):
```
allPassed: false
readyForPostCallGovernanceRecheck: false
readyForPostCallAudit: false
liveLLMCalled: false
```
Next step when blocked: configure `OPENAI_API_KEY` in the environment.

---

## 15. Next Phase

**Phase 8.3P — Post-Call Governance Recheck**

This phase will call `runLiveLlmSyntheticSingleCallExecution()`, verify `readyForPostCallGovernanceRecheck: true`, and perform a governance recheck of the execution metadata. It will NOT access model output, which has already been discarded.
