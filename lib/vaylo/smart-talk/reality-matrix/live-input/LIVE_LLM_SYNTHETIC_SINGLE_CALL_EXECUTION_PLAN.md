# Phase 8.3M — Live LLM Synthetic Single-Call Execution Plan

## 1. Purpose

Phase 8.3M defines the pre-flight execution plan for a future, separate phase (Phase 8.3N) that may perform **exactly one controlled live LLM call with one synthetic case**. This phase is execution plan only — it does not execute the call, read env values, import any LLM SDK, make HTTP requests, or construct prompt text.

This phase depends on Phase 8.3L (`runLiveLlmSyntheticSingleCallContract()`) having passed with `readyForLiveLlmSyntheticSingleCallExecutionPlan: true`.

---

## 2. What This Execution Plan Means

"Execution plan" in this phase means:

- All pre-flight requirements for the one future live LLM call are formally specified.
- The kill-switch arm/disarm procedure is defined.
- The single-call counter initialize/verify procedure is defined.
- The env presence check policy (no value logging) is defined.
- All prompt component requirements and blockers are enumerated.
- The metadata-only capture plan is specified.
- All execution gates and blockers are enumerated.
- No live LLM call is made. No prompt is constructed. No env values are read. No SDK is imported.
- Phase 8.3N is the Live LLM Synthetic Single-Call Dry-Run Authorization — it will explicitly authorize one dry-run call before execution.

---

## 3. What This Phase Does Not Execute

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

## 4. Provider / Model / Case

| Field | Value |
|---|---|
| `provider` | `"openai"` (literal) |
| `model` | `"gpt_4o_mini"` (literal) |
| `selectedSyntheticCase` | `"synthetic_deadline_relative_missing_delivery_date"` (literal) |
| `providerAllowlisted` | `true` (literal) |
| `modelAllowlisted` | `true` (literal) |

---

## 5. Preflight Steps

All 18 preflight steps must be present in `preflightSteps`:

| Step | Description |
|---|---|
| `single_call_contract_reviewed` | 8.3L contract reviewed |
| `provider_model_selection_reviewed` | openai / gpt_4o_mini reviewed |
| `selected_synthetic_case_reviewed` | Synthetic case reviewed |
| `kill_switch_arm_required` | Kill switch must be armed before call |
| `kill_switch_disarm_required_after_call` | Kill switch must be disarmed after call |
| `single_call_counter_initialize_required` | Counter must be initialized to 0 |
| `single_call_counter_must_equal_zero_before_call` | Counter verified = 0 before call |
| `single_call_counter_must_equal_one_after_call` | Counter verified = 1 after call |
| `env_presence_check_required_next_phase` | API key presence checked in execution phase |
| `env_values_must_not_be_logged` | Env values must never appear in logs |
| `sdk_or_http_client_must_be_isolated_next_phase` | SDK/HTTP client isolated in execution phase |
| `prompt_policy_enforced` | All prompt policies enforced |
| `prompt_text_must_not_be_logged` | Prompt text must not be logged |
| `model_output_must_not_be_logged` | Model output must not be logged |
| `model_output_must_not_be_persisted` | Model output must not be persisted |
| `metadata_only_capture_required` | Only metadata is captured |
| `post_call_governance_recheck_required` | Governance recheck mandatory post-call |
| `post_call_audit_required` | Post-call audit mandatory |

---

## 6. Prompt Components

All 9 prompt components must be present in `promptComponents`:

- `synthetic_case_id` — case identifier
- `synthetic_case_marker` — synthetic marker string
- `synthetic_task_instruction` — task description
- `uncertainty_preservation_instruction` — uncertainty must be preserved
- `deadline_uncertainty_instruction` — deadline uncertainty acknowledged
- `no_legal_certainty_instruction` — legal certainty must not be asserted
- `output_schema_marker` — structured output schema marker
- `governance_recheck_marker` — governance recheck required marker
- `untrusted_model_output_marker` — output is marked untrusted

---

## 7. Prompt Blockers

All 16 prompt blockers must be present in `promptBlockers`:

- `real_document_text`, `raw_user_text`, `real_redacted_text`, `ocr_text`
- `uploaded_file_content`, `public_request_text`, `pii`, `secret`, `env_value`
- `legal_certainty_instruction`, `deadline_certainty_instruction`
- `user_visible_return_instruction`, `persistence_instruction`
- `branch_c_payload`, `run_smart_talk_payload`, `ocr_runtime_payload`

---

## 8. Metadata Capture Plan

All 17 metadata capture fields must be present in `metadataCapture`:

- `provider_id`, `model_id`, `synthetic_case_id`, `call_authorization_id`
- `single_call_counter_before`, `single_call_counter_after`
- `kill_switch_state_before`, `kill_switch_state_after`
- `prompt_policy_version`
- `prompt_text_logged_false` — records that prompt text was NOT logged
- `model_output_logged_false` — records that model output was NOT logged
- `model_output_stored_false` — records that model output was NOT stored
- `user_visible_output_blocked`, `persistence_blocked`, `public_runtime_blocked`
- `governance_recheck_required`, `post_call_audit_required`

---

## 9. Execution Gates

All 17 execution gates must be present in `executionGates`:

- `authorization_contract_gate`, `kill_switch_gate`, `provider_allowlist_gate`
- `model_allowlist_gate`, `single_call_counter_gate`, `synthetic_case_gate`
- `prompt_policy_gate`, `blocked_payload_gate`
- `no_branch_c_gate`, `no_run_smart_talk_gate`, `no_ocr_runtime_gate`
- `metadata_only_capture_gate`, `post_call_governance_recheck_gate`
- `post_call_audit_gate`, `no_user_visible_output_gate`
- `no_persistence_gate`, `no_public_runtime_gate`

---

## 10. Execution Blockers

All 24 execution blockers must be present in `executionBlockers`:

- `contract_not_ready`, `kill_switch_missing`, `kill_switch_not_armed`
- `single_call_counter_missing`, `single_call_counter_not_zero`
- `provider_not_allowlisted`, `model_not_allowlisted`, `invalid_synthetic_case`
- `real_input_detected`, `raw_input_detected`, `real_redacted_input_detected`
- `ocr_photo_file_input_detected`, `public_request_detected`
- `prompt_policy_violation`, `blocked_payload_detected`
- `branch_c_dependency_detected`, `run_smart_talk_dependency_detected`
- `ocr_runtime_dependency_detected`, `user_visible_output_attempted`
- `persistence_attempted`, `public_runtime_attempted`
- `model_output_storage_attempted`, `missing_post_call_governance_recheck`
- `missing_post_call_audit`

---

## 11. Checklist

All 19 checklist items must be confirmed in `checklistConfirmed`:

- `execution_mode_reviewed`, `preflight_steps_reviewed`, `prompt_components_reviewed`
- `prompt_blockers_reviewed`, `metadata_capture_reviewed`, `execution_gates_reviewed`
- `execution_blockers_reviewed`, `provider_model_case_reviewed`
- `kill_switch_procedure_reviewed`, `single_call_counter_procedure_reviewed`
- `no_env_value_logging_reviewed`, `no_prompt_logging_reviewed`
- `no_model_output_logging_reviewed`, `no_model_output_storage_reviewed`
- `no_real_input_reviewed`, `existing_runtime_isolation_reviewed`
- `post_call_recheck_reviewed`, `post_call_audit_reviewed`
- `next_phase_dry_run_authorization_required`

---

## 12. Forbidden Content

55 forbidden strings in `FORBIDDEN_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_PLAN_STRINGS` (full 8.3L set of 52 plus 3 new execution-plan-specific phrases):

- `"prompt text logged"` — prompt must never be logged
- `"model output logged"` — model output must never be logged
- `"live llm dry run executed"` — execution plan does not execute the dry run

---

## 13. Tamper Rejection Cases

The check runs 96 tamper cases. All must be rejected. Key categories:

| Tamper Category | Rejection Reason |
|---|---|
| `contractReady: false` | `single_call_contract_not_ready` |
| Invalid executionMode | `invalid_execution_mode` |
| Invalid provider/model/case | `invalid_provider` / `invalid_model` / `invalid_selected_synthetic_case` |
| Missing preflight/component/blocker/metadata/gate/blocker/checklist | respective `missing_*` reason |
| `executionPlanOnly: false` | `planning_attempted_live_llm_call` |
| `futureDryRunAuthorizationRequired: false` | `missing_checklist_item` |
| `futureSingleLiveLlmSyntheticCallOnly: false` | `planning_attempted_multiple_call_authorization` |
| `promptTextConstructedNow/promptTextLogged/modelOutputLogged: true` | `unsafe_execution_plan_note_detected` |
| All real/raw/OCR/file/public input `true` | `planning_attempted_*` |
| All dependency/call flags `true` | `planning_attempted_*_dependency` |
| All AI-output/model/user-visible/persistence/public `true` | `planning_attempted_*` |
| Notes with new execution-plan-specific forbidden phrases | `unsafe_execution_plan_note_detected` |

---

## 14. Safety Invariants

| Invariant | Value |
|---|---|
| `executionPlanOnly` | **`true`** (literal) |
| `futureDryRunAuthorizationRequired` | **`true`** (literal) |
| `futureSingleLiveLlmSyntheticCallOnly` | **`true`** (literal) |
| `generalLiveLlmRuntimeAuthorizationAllowed` | **`false`** (literal) |
| `multipleLiveLlmCallsAllowed` | **`false`** (literal) |
| `providerAllowlisted` | **`true`** (literal) |
| `modelAllowlisted` | **`true`** (literal) |
| `killSwitchProcedureRequired` | **`true`** (literal) |
| `singleCallCounterProcedureRequired` | **`true`** (literal) |
| `postCallGovernanceRecheckRequired` | **`true`** (literal) |
| `postCallAuditRequired` | **`true`** (literal) |
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
| `apiRouteModifiedByExecutionPlan` | **`false`** (literal) |
| `existingRuntimeModifiedByExecutionPlan` | **`false`** (literal) |
| `uiTouched` | **`false`** (literal) |
| `databaseOrStorageModifiedByExecutionPlan` | **`false`** (literal) |
| `neverUserVisible` | **`true`** (literal) |

---

## 15. Readiness Decision

On success (`allPassed: true`):

```
readyForLiveLlmSyntheticSingleCallDryRunAuthorization: true
readyForLiveLLMRuntime: false
readyForConnectedAiRuntimeExecution: false
readyForRealOperatorPilotRun: false
readyForPilotRunNow: false
readyForPublicLaunch: false
readyForPersistence: false
generalLiveLlmRuntimeAuthorizationAllowed: false
multipleLiveLlmCallsAllowed: false
```

**This execution plan permits only the next phase: Live LLM Synthetic Single-Call Dry-Run Authorization (Phase 8.3N).**

Live LLM runtime is NOT authorized by this execution plan.

---

## 16. Next Phase

**Phase 8.3N — Live LLM Synthetic Single-Call Dry-Run Authorization**

The Dry-Run Authorization phase will explicitly authorize one dry-run synthetic live LLM call, arm the kill switch, verify the single-call counter at zero, and confirm all pre-flight gates pass — before the actual call is permitted to proceed.
