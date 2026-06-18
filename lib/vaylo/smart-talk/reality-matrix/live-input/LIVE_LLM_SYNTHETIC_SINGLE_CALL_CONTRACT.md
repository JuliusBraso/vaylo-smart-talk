# Phase 8.3L — Live LLM Synthetic Single-Call Contract

## 1. Purpose

Phase 8.3L defines the exact typed contract governing a future, separate phase (Phase 8.3M) that may perform **exactly one controlled live LLM call with one synthetic case**. This phase is contract only — it does not execute the call, read env values, import any LLM SDK, or make HTTP requests.

This phase depends on Phase 8.3K (`runLiveLlmSyntheticAuthorizationPlanning()`) having passed with `readyForLiveLlmSyntheticSingleCallContract: true`.

---

## 2. What Single-Call Contract Means

"Single-call contract" in this phase means:

- A typed, validated contract specifies all requirements for one future live LLM call.
- The contract selects: **provider = openai**, **model = gpt_4o_mini**, **synthetic case = `synthetic_deadline_relative_missing_delivery_date`**.
- All prompt policies, execution guards, blocked payloads, post-call metadata fields, and governance recheck requirements are locked into the contract.
- No live LLM call is made. No SDK is imported. No env values are read. No HTTP calls are made.
- The next phase (8.3M) is the Live LLM Synthetic Single-Call Execution Plan — it will define the pre-flight plan for executing the one permitted call.

---

## 3. What This Contract Does Not Execute

- Does NOT call a live LLM (`liveLLMCallPerformed: false` — literal)
- Does NOT authorize general live LLM runtime (`generalLiveLlmRuntimeAuthorizationAllowed: false` — literal)
- Does NOT authorize multiple live LLM calls (`multipleLiveLlmCallsAllowed: false` — literal)
- Does NOT read `process.env` (`envReadPerformed: false` — literal)
- Does NOT import any LLM SDK (`sdkImported: false` — literal)
- Does NOT make HTTP requests (`httpCallMade: false` — literal)
- Does NOT call `app/api/smart-talk/route.ts` Branch C
- Does NOT call or import `run-smart-talk.ts` or `extract-text-from-image.ts`
- Does NOT process real user input, OCR, photo, file, or public request
- Does NOT forward raw or redacted input to a live model
- Does NOT generate real AI output or store model output
- Does NOT log or persist prompt text or model output
- Does NOT emit user-visible output
- Does NOT persist data
- Does NOT enable public runtime
- Does NOT authorize public launch

---

## 4. Selected Provider and Model

| Field | Value |
|---|---|
| `provider` | `"openai"` (only allowlisted provider) |
| `model` | `"gpt_4o_mini"` (only allowlisted model) |

- `providerAllowlisted: true` — literal
- `modelAllowlisted: true` — literal
- Any other provider or model value causes `invalid_provider` / `invalid_model` rejection.

---

## 5. Selected Synthetic Case

| Field | Value |
|---|---|
| `selectedSyntheticCase` | `"synthetic_deadline_relative_missing_delivery_date"` |

This is the single case from the 8.3I/8.3H catalog approved for the first live LLM synthetic call. Any other value causes `invalid_selected_synthetic_case` rejection.

---

## 6. Scope

All 19 scopes must be present in `scopes`:

| Scope | Description |
|---|---|
| `one_call_only` | Exactly one live LLM call permitted |
| `one_synthetic_case_only` | Exactly one synthetic case |
| `synthetic_input_only` | Only synthetic input is permitted |
| `no_real_user_input` | Real user input is blocked |
| `no_raw_input` | Raw text is blocked |
| `no_real_redacted_input` | Real redacted text is blocked |
| `no_photo_or_ocr_input` | Photo/OCR input is blocked |
| `no_file_upload_input` | File upload is blocked |
| `no_public_request_input` | Public request input is blocked |
| `no_branch_c_runtime` | Branch C is blocked |
| `no_run_smart_talk_runtime` | run-smart-talk.ts is blocked |
| `no_ocr_runtime` | OCR runtime is blocked |
| `no_general_live_llm_runtime` | General LLM runtime is blocked |
| `no_persistence` | Persistence is blocked |
| `no_user_visible_output` | User-visible output is blocked |
| `metadata_only_capture` | Only metadata may be captured post-call |
| `model_output_untrusted` | Model output is treated as untrusted |
| `post_call_governance_recheck_required` | Post-call governance recheck is mandatory |
| `post_call_audit_required` | Post-call audit is mandatory |

---

## 7. Prompt Policy

All 15 prompt policies must be present in `promptPolicies`:

- `synthetic_prompt_template_required` — a synthetic prompt template must be used
- `synthetic_case_marker_required` — a synthetic case marker must be present in the prompt
- `no_real_document_text` — real document text must not appear
- `no_raw_text` — raw text must not appear
- `no_real_redacted_text` — real redacted text must not appear
- `no_ocr_text` — OCR text must not appear
- `no_file_content` — file content must not appear
- `no_public_request_text` — public request text must not appear
- `no_pii` — PII must not appear
- `no_secret` — secrets must not appear
- `no_deadline_certainty_instruction` — deadline certainty instructions are blocked
- `no_legal_certainty_instruction` — legal certainty instructions are blocked
- `uncertainty_preservation_instruction_required` — uncertainty must be preserved
- `model_must_be_told_output_is_untrusted` — the prompt must include an untrusted-output instruction
- `output_must_be_structured_for_governance_recheck` — output must be structured for governance recheck

---

## 8. Execution Guards

All 13 execution guards must be present in `executionGuards`:

- `kill_switch_required` — a kill switch must be active at execution time
- `provider_allowlist_required` — provider must be validated against allowlist
- `model_allowlist_required` — model must be validated against allowlist
- `single_call_counter_required` — a single-call counter must be incremented and enforced
- `operator_ack_required` — operator acknowledgment is required
- `reviewer_ack_required` — reviewer acknowledgment is required
- `execution_phase_must_validate_env_presence_without_logging_value` — env key presence must be checked but its value must never be logged
- `execution_phase_must_not_log_prompt_text` — prompt text must not appear in logs
- `execution_phase_must_not_log_model_output` — model output must not appear in logs
- `execution_phase_must_not_store_model_output` — model output must not be stored
- `execution_phase_must_capture_metadata_only` — only metadata may be captured
- `execution_phase_must_run_post_call_governance_recheck` — governance recheck is mandatory post-call
- `execution_phase_must_run_post_call_audit` — post-call audit is mandatory

---

## 9. Blocked Payloads

All 14 blocked payload classes must be present in `blockedPayloads`:

- `real_user_document`, `real_user_photo`, `real_ocr_text`, `real_raw_text`
- `real_redacted_text`, `uploaded_file_content`, `public_request_content`
- `private_user_pii`, `secrets_or_api_keys`, `full_document_text`
- `production_runtime_payload`, `existing_branch_c_payload`
- `run_smart_talk_payload`, `ocr_runtime_payload`

---

## 10. Post-Call Metadata

All 15 post-call metadata fields must be present in `postCallMetadata`:

- `provider_id`, `model_id`, `synthetic_case_id`, `single_call_counter`
- `kill_switch_state`, `call_authorization_id`, `prompt_policy_version`
- `governance_recheck_required`, `post_call_audit_required`
- `no_prompt_text_logged`, `no_model_output_logged`, `no_model_output_stored`
- `user_visible_output_blocked`, `persistence_blocked`, `public_runtime_blocked`

---

## 11. Governance Recheck Requirements

All 10 recheck requirements must be present in `recheckRequirements`:

- `mark_model_output_untrusted`
- `run_reality_matrix_recheck`
- `run_evidence_gate_recheck`
- `run_hallucination_trap_recheck`
- `run_deadline_claim_recheck`
- `run_uncertainty_preservation_recheck`
- `run_manual_review_before_user_visible_policy`
- `keep_user_visible_output_blocked`
- `keep_persistence_blocked`
- `keep_public_runtime_blocked`

---

## 12. Checklist

All 18 checklist items must be confirmed in `checklistConfirmed`:

- `authorization_planning_reviewed`, `scope_reviewed`, `provider_reviewed`, `model_reviewed`
- `selected_synthetic_case_reviewed`, `prompt_policy_reviewed`, `execution_guards_reviewed`
- `blocked_payloads_reviewed`, `post_call_metadata_reviewed`, `recheck_requirements_reviewed`
- `one_call_limit_reviewed`, `kill_switch_reviewed`, `no_real_input_reviewed`
- `existing_runtime_isolation_reviewed`, `no_persistence_reviewed`
- `no_user_visible_output_reviewed`, `no_public_runtime_reviewed`
- `next_phase_execution_plan_required`

---

## 13. Forbidden Content

All string fields are scanned for a 52-item forbidden list, including the full 8.3K set plus 4 new single-call-specific phrases:

- `"single live llm call executed"` — contract must not claim the call was made
- `"model output returned to user"` — model output must never be user-visible
- `"stored prompt"` — prompt text must never be stored
- `"stored completion"` — completion/model output must never be stored

For the full list of 52 forbidden strings, see `FORBIDDEN_LIVE_LLM_SYNTHETIC_SINGLE_CALL_STRINGS` in `live-llm-synthetic-single-call-contract-types.ts`.

---

## 14. Tamper Rejection Cases

The check runs 91 tamper cases. All must be rejected. Key categories:

| Tamper Category | Rejection Reason |
|---|---|
| `authorizationPlanningReady: false` | `authorization_planning_not_ready` |
| Missing scope | `missing_scope` |
| Invalid provider (not openai) | `invalid_provider` |
| Invalid model (not gpt_4o_mini) | `invalid_model` |
| Invalid selectedSyntheticCase | `invalid_selected_synthetic_case` |
| Missing prompt policy/guard/payload/metadata/recheck/checklist | respective `missing_*` reason |
| `contractOnly: false` | `planning_attempted_live_llm_call` |
| `futureExecutionPlanRequired: false` | `missing_checklist_item` |
| `futureSingleLiveLlmSyntheticCallOnly: false` | `planning_attempted_multiple_call_authorization` |
| `generalLiveLlmRuntimeAuthorizationAllowed: true` | `planning_attempted_general_runtime_authorization` |
| `multipleLiveLlmCallsAllowed: true` | `planning_attempted_multiple_call_authorization` |
| `providerAllowlisted: false` | `invalid_provider` |
| `modelAllowlisted: false` | `invalid_model` |
| `killSwitchRequired: false` | `missing_kill_switch_guard` |
| `singleCallCounterRequired: false` | `missing_single_call_counter_guard` |
| `postCallGovernanceRecheckRequired: false` | `missing_post_call_governance_recheck` |
| `postCallAuditRequired: false` | `missing_post_call_audit` |
| `liveLLMCallPerformed: true` | `planning_attempted_live_llm_call` |
| All real/raw/OCR/file/public input `true` | `planning_attempted_*_input_*` |
| All dependency/call `true` | `planning_attempted_*_dependency` |
| All AI-output/model/user-visible/persistence/public `true` | `planning_attempted_*` |
| Notes with new forbidden contract phrases | `unsafe_contract_note_detected` |

---

## 15. Safety Invariants

| Invariant | Value |
|---|---|
| `contractOnly` | **`true`** (literal) |
| `futureExecutionPlanRequired` | **`true`** (literal) |
| `futureSingleLiveLlmSyntheticCallOnly` | **`true`** (literal) |
| `generalLiveLlmRuntimeAuthorizationAllowed` | **`false`** (literal) |
| `multipleLiveLlmCallsAllowed` | **`false`** (literal) |
| `providerAllowlisted` | **`true`** (literal) |
| `modelAllowlisted` | **`true`** (literal) |
| `killSwitchRequired` | **`true`** (literal) |
| `singleCallCounterRequired` | **`true`** (literal) |
| `postCallGovernanceRecheckRequired` | **`true`** (literal) |
| `postCallAuditRequired` | **`true`** (literal) |
| `liveLLMCallPerformed` / `liveLLMCalled` | **`false`** (literal) |
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
| `userVisibleOutputAuthorizedByContract` | **`false`** (literal) |
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
| `apiRouteModifiedByContract` | **`false`** (literal) |
| `existingRuntimeModifiedByContract` | **`false`** (literal) |
| `uiTouched` | **`false`** (literal) |
| `databaseOrStorageModifiedByContract` | **`false`** (literal) |
| `neverUserVisible` | **`true`** (literal) |

---

## 16. Readiness Decision

On success (`allPassed: true`):

```
readyForLiveLlmSyntheticSingleCallExecutionPlan: true
readyForLiveLLMRuntime: false
readyForConnectedAiRuntimeExecution: false
readyForRealOperatorPilotRun: false
readyForPilotRunNow: false
readyForPublicLaunch: false
readyForPersistence: false
generalLiveLlmRuntimeAuthorizationAllowed: false
multipleLiveLlmCallsAllowed: false
```

**This contract permits only the next phase: Live LLM Synthetic Single-Call Execution Plan (Phase 8.3M).**

Live LLM runtime is NOT authorized by this contract.

---

## 17. Next Phase

**Phase 8.3M — Live LLM Synthetic Single-Call Execution Plan**

The Live LLM Synthetic Single-Call Execution Plan will define the pre-flight checklist and typed execution plan for the one permitted call, including prompt construction policy enforcement, kill-switch arm/disarm procedure, single-call counter initialization, post-call metadata capture specification, and post-call governance recheck gate definition — without executing the call.
