# Phase 8.3K — Live LLM Synthetic Authorization Planning

## 1. Purpose

Phase 8.3K defines the authorization policy for a future, separate phase (Phase 8.3L) that may perform **one controlled live LLM call with synthetic input only**. This phase is planning only — it does not call a live LLM, read env values, import any LLM SDK, or make HTTP requests.

This phase depends on Phase 8.3J (`runSyntheticHarnessPostRunAudit()`) having passed with `readyForLiveLlmSyntheticAuthorizationPlanning: true`.

---

## 2. What Live LLM Synthetic Authorization Planning Means

"Authorization planning" in this phase means:

- A typed policy is defined for one future synthetic live LLM call (scoped to exactly one call, synthetic input only).
- The policy specifies provider allowlist, model allowlist, call constraints, allowed synthetic cases, blocked payload classes, and post-call requirements.
- No live LLM call is made. No LLM SDK is imported. No env values are read. No HTTP calls are made.
- The next phase (8.3L) is the Live LLM Synthetic Single-Call Contract — it will define the contract for executing the one permitted call.
- General live LLM runtime is NOT authorized by this planning phase.

---

## 3. What This Phase Does Not Authorize

- Does NOT authorize general live LLM runtime (`generalLiveLlmRuntimeAuthorizationAllowed: false` — literal)
- Does NOT authorize multiple live LLM calls (`multipleLiveLlmCallsAllowed: false` — literal)
- Does NOT call a live LLM (`liveLLMCallPerformed: false` — literal)
- Does NOT read `process.env` (`envReadPerformed: false` — literal)
- Does NOT import any LLM SDK (`sdkImported: false` — literal)
- Does NOT make HTTP requests (`httpCallMade: false` — literal)
- Does NOT call `app/api/smart-talk/route.ts` Branch C
- Does NOT call or import `run-smart-talk.ts` or `extract-text-from-image.ts`
- Does NOT process real user input, OCR text, photo, file, or public request
- Does NOT forward raw or redacted input to a live model
- Does NOT generate real AI output or store model output
- Does NOT emit user-visible output
- Does NOT persist data (no DB writes, no DNA save, no offline save)
- Does NOT enable public runtime
- Does NOT authorize public launch

---

## 4. Authorization Scope

All 15 scopes must be present in `authorizationScopes`:

| Scope | Description |
|---|---|
| `one_synthetic_call_only` | Exactly one live LLM call is permitted in the future execution phase |
| `synthetic_input_only` | Only synthetic case payloads are permitted |
| `no_real_user_input` | Real user input is blocked |
| `no_raw_input` | Raw input text is blocked |
| `no_real_redacted_input` | Real redacted input text is blocked |
| `no_photo_or_ocr_input` | Photo/OCR input is blocked |
| `no_file_upload_input` | File upload input is blocked |
| `no_public_request_input` | Public request input is blocked |
| `no_branch_c_runtime` | Branch C runtime dependency is blocked |
| `no_run_smart_talk_runtime` | run-smart-talk.ts dependency is blocked |
| `no_ocr_runtime` | OCR runtime dependency is blocked |
| `no_persistence` | All persistence is blocked |
| `no_user_visible_output` | User-visible output is blocked |
| `no_public_runtime` | Public runtime is blocked |
| `post_call_governance_recheck_required` | Post-call governance recheck is mandatory |

---

## 5. Provider Policy

All 9 provider policies must be present in `providerPolicies`:

- `provider_allowlist_required` — only allowlisted providers may be used
- `openai_provider_allowed_for_future_synthetic_only` — OpenAI is permitted for one synthetic call only
- `model_allowlist_required` — only allowlisted models may be used
- `model_must_be_env_configured_later` — model selection deferred to execution phase
- `api_key_presence_check_deferred_to_execution_phase` — API key check deferred
- `api_key_value_must_never_be_logged` — API key value must never appear in logs
- `no_env_read_in_planning_phase` — planning phase does not read env
- `no_sdk_import_in_planning_phase` — planning phase does not import SDK
- `no_http_call_in_planning_phase` — planning phase does not make HTTP calls

---

## 6. Model Policy

All 7 model policies must be present in `modelPolicies`:

- `gpt_4o_mini_allowed_for_future_synthetic_single_call_only`
- `no_model_hardcoding_in_runtime_adapter_without_contract`
- `model_metadata_only_in_planning_phase`
- `model_output_must_be_untrusted`
- `model_output_must_not_be_user_visible`
- `model_output_must_not_be_persisted`
- `model_output_must_be_governance_rechecked`

---

## 7. Call Constraints

All 16 call constraints must be present in `callConstraints`:

- `one_call_maximum` — only one live LLM call is permitted
- `synthetic_case_id_required` — a synthetic case ID must be provided
- `synthetic_prompt_marker_required` — a synthetic prompt marker must be present
- `no_raw_document_text_allowed` — raw document text is blocked
- `no_real_redacted_text_allowed` — real redacted text is blocked
- `no_file_or_ocr_payload_allowed` — file/OCR payload is blocked
- `no_public_request_payload_allowed` — public request payload is blocked
- `no_direct_user_visible_return` — model output must not be returned directly to user
- `no_storage` — no model output storage
- `no_branch_c` — Branch C is blocked
- `no_run_smart_talk` — run-smart-talk.ts is blocked
- `no_ocr_runtime` — OCR runtime is blocked
- `kill_switch_required` — a kill switch must be present
- `operator_ack_required` — operator acknowledgment required
- `reviewer_ack_required` — reviewer acknowledgment required
- `post_call_audit_required` — post-call audit is mandatory

---

## 8. Allowed Synthetic Cases

All 8 synthetic cases from the 8.3H/8.3I catalog are permitted:

- `synthetic_safe_low_risk_payment_notice`
- `synthetic_deadline_explicit_date`
- `synthetic_deadline_relative_missing_delivery_date`
- `synthetic_high_risk_widerspruch_deadline`
- `synthetic_high_risk_immigration_uncertainty`
- `synthetic_missing_context_partial_document`
- `synthetic_unsupported_legal_certainty_trap`
- `synthetic_unsafe_next_step_trap`

---

## 9. Blocked Payload Classes

All 12 blocked payload classes must be present in `blockedPayloadClasses`:

- `real_user_document`, `real_user_photo`, `real_ocr_text`, `real_raw_text`
- `real_redacted_text`, `uploaded_file_content`, `public_request_content`
- `private_user_pii`, `secrets_or_api_keys`, `full_document_text`
- `model_output_from_previous_run`, `production_runtime_payload`

---

## 10. Post-Call Requirements

All 10 post-call requirements must be present in `postCallRequirements`:

- `capture_metadata_only` — only metadata is captured after the call
- `no_raw_prompt_logging` — raw prompt must not be logged
- `no_model_output_persistence` — model output must not be persisted
- `mark_model_output_untrusted` — output is marked untrusted immediately
- `run_ai_output_governance_recheck` — governance recheck is mandatory
- `run_manual_review_gate` — manual review gate is mandatory
- `keep_user_visible_output_blocked` — user-visible output remains blocked post-call
- `keep_public_runtime_blocked` — public runtime remains blocked post-call
- `keep_persistence_blocked` — persistence remains blocked post-call
- `run_post_call_audit` — post-call audit is mandatory

---

## 11. Checklist

All 19 checklist items must be confirmed in `checklistConfirmed`:

- `post_run_audit_reviewed`
- `scope_reviewed`
- `provider_policy_reviewed`
- `model_policy_reviewed`
- `call_constraints_reviewed`
- `allowed_synthetic_cases_reviewed`
- `blocked_payload_classes_reviewed`
- `post_call_requirements_reviewed`
- `one_call_limit_reviewed`
- `kill_switch_requirement_reviewed`
- `no_env_read_in_planning_confirmed`
- `no_http_call_in_planning_confirmed`
- `no_sdk_import_in_planning_confirmed`
- `existing_runtime_isolation_reviewed`
- `no_real_input_confirmed`
- `no_persistence_confirmed`
- `no_user_visible_output_confirmed`
- `no_public_runtime_confirmed`
- `next_phase_single_call_contract_required`

---

## 12. Forbidden Content in All Fields

All string fields are scanned for the full 8.3J forbidden list plus 3 new planning-specific phrases:

- `"live llm call performed"` — planning must not claim a call was made
- `"multiple live llm calls authorized"` — only one call is authorized
- `"general live llm runtime authorized"` — general runtime is not authorized

For the full list of 48 forbidden strings, see `FORBIDDEN_LIVE_LLM_SYNTHETIC_AUTHORIZATION_STRINGS` in `live-llm-synthetic-authorization-planning-types.ts`.

---

## 13. Tamper Rejection Cases

The check runs 84 tamper cases. All must be rejected. Key categories:

| Tamper Category | Rejection Reason |
|---|---|
| `postRunAuditReady: false` | `post_run_audit_not_ready` |
| Missing scope/provider/model/constraint/case/blocked/post-call/checklist | respective `missing_*` reason |
| `planningOnly: false` | `planning_attempted_live_llm_call` |
| `futureSingleSyntheticCallOnly: false` | `planning_attempted_multiple_call_authorization` |
| `generalLiveLlmRuntimeAuthorizationAllowed: true` | `planning_attempted_general_runtime_authorization` |
| `multipleLiveLlmCallsAllowed: true` | `planning_attempted_multiple_call_authorization` |
| `providerAllowlistRequired: false` | `missing_provider_policy` |
| `modelAllowlistRequired: false` | `missing_model_policy` |
| `killSwitchRequired: false` | `missing_kill_switch_requirement` |
| `postCallGovernanceRecheckRequired: false` | `missing_post_call_governance_recheck` |
| `postCallAuditRequired: false` | `missing_post_call_requirement` |
| `liveLLMCallPerformed: true` | `planning_attempted_live_llm_call` |
| `envReadPerformed: true` | `planning_attempted_env_read` |
| `sdkImported: true` | `planning_attempted_sdk_import` |
| `httpCallMade: true` | `planning_attempted_http_call` |
| All real/raw/OCR/file/public input `true` | `planning_attempted_*_input_*` |
| All dependency/call `true` | `planning_attempted_*_dependency` |
| All AI-output/model/user-visible/persistence/public `true` | `planning_attempted_*` |
| Notes with new forbidden planning phrases | `unsafe_authorization_note_detected` |

---

## 14. Safety Invariants

| Invariant | Value |
|---|---|
| `planningOnly` | **`true`** (literal) |
| `futureSingleSyntheticCallOnly` | **`true`** (literal) |
| `generalLiveLlmRuntimeAuthorizationAllowed` | **`false`** (literal) |
| `multipleLiveLlmCallsAllowed` | **`false`** (literal) |
| `providerAllowlistRequired` | **`true`** (literal) |
| `modelAllowlistRequired` | **`true`** (literal) |
| `killSwitchRequired` | **`true`** (literal) |
| `postCallGovernanceRecheckRequired` | **`true`** (literal) |
| `postCallAuditRequired` | **`true`** (literal) |
| `liveLLMCallPerformed` | **`false`** (literal) |
| `envReadPerformed` | **`false`** (literal) |
| `sdkImported` | **`false`** (literal) |
| `httpCallMade` | **`false`** (literal) |
| `syntheticInputOnly` | **`true`** (literal) |
| All real/raw/OCR/file/public input allowed | **`false`** (literal) |
| All dependency/call flags | **`false`** (literal) |
| `aiOutputGenerationPerformed` | **`false`** (literal) |
| `aiOutputGenerated` | **`false`** (literal) |
| `modelOutputStored` | **`false`** (literal) |
| `userVisibleOutputEmitted` | **`false`** (literal) |
| `userVisibleOutputAuthorizedByPlanning` | **`false`** (literal) |
| `persistenceUsed` | **`false`** (literal) |
| `dnaSavePerformed` | **`false`** (literal) |
| `offlineSavePerformed` | **`false`** (literal) |
| `publicRuntimeEnabled` | **`false`** (literal) |
| `realOperatorPilotExecuted` | **`false`** (literal) |
| `readyForLiveLLMRuntime` | **`false`** (literal) |
| `readyForConnectedAiRuntimeExecution` | **`false`** (literal) |
| `readyForRealOperatorPilotRun` | **`false`** (literal) |
| `readyForPilotRunNow` | **`false`** (literal) |
| `readyForPublicLaunch` | **`false`** (literal) |
| `readyForPersistence` | **`false`** (literal) |
| `apiRouteModifiedByPlanning` | **`false`** (literal) |
| `existingRuntimeModifiedByPlanning` | **`false`** (literal) |
| `uiTouched` | **`false`** (literal) |
| `databaseOrStorageModifiedByPlanning` | **`false`** (literal) |
| `neverUserVisible` | **`true`** (literal) |

---

## 15. Readiness Decision

On success (`allPassed: true`):

```
readyForLiveLlmSyntheticSingleCallContract: true
readyForLiveLLMRuntime: false
readyForConnectedAiRuntimeExecution: false
readyForRealOperatorPilotRun: false
readyForPilotRunNow: false
readyForPublicLaunch: false
readyForPersistence: false
generalLiveLlmRuntimeAuthorizationAllowed: false
multipleLiveLlmCallsAllowed: false
```

**This planning phase permits only the next phase: Live LLM Synthetic Single-Call Contract (Phase 8.3L).**

Live LLM runtime is NOT authorized by this planning phase.

---

## 16. Next Phase

**Phase 8.3L — Live LLM Synthetic Single-Call Contract**

The Live LLM Synthetic Single-Call Contract will define the exact typed contract governing the execution of one controlled synthetic live LLM call, including the kill-switch mechanism, provider/model validation at execution time, prompt construction policy, post-call metadata capture, and post-call governance recheck gate.
