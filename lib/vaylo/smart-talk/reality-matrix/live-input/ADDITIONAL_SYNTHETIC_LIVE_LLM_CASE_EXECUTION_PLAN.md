# Phase 8.3T — Additional Synthetic Live LLM Case Execution Plan

## 1. Purpose

This phase creates a pure TypeScript execution plan for one future synthetic live LLM call for the additional case `synthetic_explicit_payment_deadline`. The execution plan defines all preflight steps, prompt component policy, prompt blockers, metadata capture fields, execution gates, execution blockers, kill switch requirements, single-call counter requirements, and post-call governance requirements — without making any live LLM call.

**This phase does not call a live LLM.**
**This phase does not construct final prompt text.**
**This phase does not authorize real payment notices, invoices, Mahnungen, or real documents.**
**Future execution requires dry-run authorization (Phase 8.3U).**
**Public runtime and user-visible output remain blocked.**

## 2. Selected Synthetic Case

| Field            | Value                              |
|------------------|------------------------------------|
| Case ID          | `synthetic_explicit_payment_deadline` |
| Provider         | `openai`                           |
| Model            | `gpt_4o_mini`                      |
| Previous phase   | 8.3S (Additional Synthetic Live LLM Case Contract) |

The synthetic case represents a German-style payment notice with:
- Synthetic payment amount (no real value)
- Explicit payment deadline stated in the document
- Synthetic payment context (no real authority or company)
- No real authority/company name
- No real personal name
- No address, IBAN, Steuer-ID, Aktenzeichen
- No real phone or email
- No real document text

## 3. Execution-Plan-Only Boundary

| Invariant                                          | Value   |
|----------------------------------------------------|---------|
| `executionPlanOnly`                                | `true`  |
| `liveLLMCalledInExecutionPlan`                     | `false` |
| `additionalLiveLLMCallsExecuted`                   | `false` |
| `promptTextConstructedNow`                         | `false` |
| `promptTextAvailableInExecutionPlan`               | `false` |
| `modelOutputAvailableInExecutionPlan`              | `false` |
| `promptTextLogged`                                 | `false` |
| `modelOutputLogged`                                | `false` |
| `readyForRealDocumentInput`                        | `false` |
| `readyForPublicLaunch`                             | `false` |
| `persistenceUsed`                                  | `false` |
| `userVisibleOutputEmitted`                         | `false` |
| `neverUserVisible`                                 | `true`  |

## 4. Future Execution Requirements

Before any live LLM call for this case may be attempted, the following must occur:

1. **Phase 8.3U — Dry-Run Authorization**: Verifies this execution plan and issues a single positive gate.
2. **Kill switch must be armed** before any call attempt.
3. **Single-call counter must be at zero** before the call and verified at one after.
4. **No more than one live LLM call** is permitted for this case.
5. **Post-call governance recheck** (metadata-only) must occur after execution.
6. **Post-call audit** must occur after the recheck.

| Requirement                                             | Value  |
|---------------------------------------------------------|--------|
| `futureDryRunAuthorizationRequired`                     | `true` |
| `oneFutureLiveLlmCallOnly`                              | `true` |
| `killSwitchRequiredForFutureCall`                       | `true` |
| `singleCallCounterRequiredForFutureCall`                | `true` |

## 5. Preflight Steps

All 22 preflight steps must be confirmed before any future execution phase:

1. `contract_verified` — 8.3S contract dependency confirmed.
2. `selected_case_verified` — `synthetic_explicit_payment_deadline` confirmed.
3. `provider_verified` — Provider `openai` confirmed.
4. `model_verified` — Model `gpt_4o_mini` confirmed.
5. `synthetic_prompt_policy_reviewed` — All prompt component policies reviewed.
6. `prompt_blockers_reviewed` — All prompt blockers reviewed.
7. `no_real_input_verified` — No real user input path exists.
8. `no_branch_c_verified` — Branch C not involved.
9. `no_run_smart_talk_verified` — `runSmartTalk()` not called.
10. `no_ocr_runtime_verified` — OCR runtime not called.
11. `kill_switch_required_before_future_call` — Kill switch arming is required.
12. `single_call_counter_required_before_future_call` — Counter requirement confirmed.
13. `api_key_presence_check_deferred_to_execution` — Key presence check deferred.
14. `prompt_text_construction_deferred_to_execution` — Final prompt construction deferred.
15. `prompt_text_logging_blocked` — Prompt text must not be logged.
16. `model_output_logging_blocked` — Model output must not be logged.
17. `metadata_only_capture_planned` — Only metadata will be captured.
18. `post_call_governance_recheck_planned` — Recheck is planned for post-execution.
19. `post_call_audit_planned` — Audit is planned for post-execution.
20. `user_visible_output_blocked` — User-visible output is blocked.
21. `persistence_blocked` — Persistence is blocked.
22. `public_runtime_blocked` — Public runtime is blocked.

## 6. Prompt Components

All 19 prompt components must be present in any future execution's prompt policy:

1. `synthetic_payment_notice_marker` — Document marked as synthetic.
2. `synthetic_amount_marker` — Amount is clearly synthetic.
3. `explicit_payment_deadline_marker` — Deadline is explicitly stated in the synthetic document.
4. `synthetic_payment_context_marker` — Context is synthetic, not a real authority.
5. `no_real_authority_marker` — No real authority name present.
6. `no_real_person_marker` — No real person name present.
7. `no_address_marker` — No real address present.
8. `no_iban_marker` — No IBAN present.
9. `no_steuer_id_marker` — No Steuer-ID present.
10. `no_aktenzeichen_marker` — No Aktenzeichen present.
11. `no_real_phone_email_marker` — No real contact data present.
12. `document_stated_deadline_only_instruction` — Model must treat deadline as document-stated only; must not infer beyond that.
13. `no_legal_certainty_instruction` — Model must not claim legal certainty.
14. `no_additional_deadline_invention_instruction` — Model must not invent additional deadlines.
15. `no_coercive_payment_instruction` — Model must not use "you must pay" or similar coercive wording.
16. `consequence_uncertainty_instruction` — Model must preserve uncertainty around consequences.
17. `untrusted_output_instruction` — Model output is untrusted until governance recheck.
18. `governance_recheck_instruction` — Output must be rechecked before any use.
19. `user_visible_output_block_instruction` — Output must not be shown to users.

## 7. Prompt Blockers

All 20 prompt blockers must be enforced by the future execution phase:

1. `real_authority_name_blocked`
2. `real_person_name_blocked`
3. `real_address_blocked`
4. `iban_blocked`
5. `steuer_id_blocked`
6. `aktenzeichen_blocked`
7. `real_phone_or_email_blocked`
8. `real_invoice_blocked`
9. `real_mahnung_blocked`
10. `real_payment_notice_blocked`
11. `real_document_content_blocked`
12. `legal_certainty_instruction_blocked`
13. `coercive_you_must_pay_blocked`
14. `public_runtime_payload_blocked`
15. `branch_c_payload_blocked`
16. `run_smart_talk_payload_blocked`
17. `ocr_runtime_payload_blocked`
18. `raw_input_payload_blocked`
19. `redacted_real_input_payload_blocked`
20. `model_output_payload_blocked`

## 8. Metadata Capture Fields

All 20 metadata capture fields are planned for future execution (metadata-only, no prompt or output):

`execution_plan_id`, `selected_case_id`, `provider_id`, `model_id`, `execution_mode`, `contract_dependency_verified`, `one_future_call_only`, `kill_switch_required`, `single_call_counter_required`, `prompt_text_logged_false`, `prompt_text_stored_false`, `model_output_logged_false`, `model_output_stored_false`, `metadata_only_capture_required`, `post_call_governance_recheck_required`, `post_call_audit_required`, `user_visible_output_blocked`, `persistence_blocked`, `public_runtime_blocked`, `real_document_input_blocked`.

## 9. Execution Gates

All 21 execution gates must pass before any future call:

`contract_gate`, `selected_case_gate`, `provider_gate`, `model_gate`, `one_future_call_gate`, `dry_run_authorization_gate`, `kill_switch_gate`, `single_call_counter_gate`, `synthetic_prompt_policy_gate`, `prompt_blocker_gate`, `prompt_non_logging_gate`, `model_output_non_logging_gate`, `metadata_capture_gate`, `post_call_governance_recheck_gate`, `post_call_audit_gate`, `no_real_input_gate`, `runtime_isolation_gate`, `no_user_visible_output_gate`, `no_persistence_gate`, `no_public_runtime_gate`, `no_real_document_input_gate`.

## 10. Execution Blockers

All 26 execution blockers will cause a future execution to be rejected:

`contract_not_ready`, `selected_case_invalid`, `provider_invalid`, `model_invalid`, `execution_plan_attempted_live_call`, `dry_run_authorization_missing`, `future_call_limit_missing`, `kill_switch_missing`, `single_call_counter_missing`, `prompt_policy_missing`, `prompt_blockers_missing`, `prompt_or_model_output_available`, `prompt_or_model_output_logged`, `real_input_detected`, `raw_input_detected`, `redacted_real_input_detected`, `ocr_photo_file_input_detected`, `public_request_detected`, `branch_c_dependency_detected`, `run_smart_talk_dependency_detected`, `ocr_runtime_dependency_detected`, `persistence_detected`, `user_visible_output_detected`, `public_runtime_detected`, `general_live_llm_runtime_authorized`, `real_document_input_authorized`.

## 11. Runtime Isolation

The following existing components are explicitly isolated and must not be called by this phase or any future phase in this chain:

| Component                           | Status       |
|-------------------------------------|--------------|
| `app/api/smart-talk/route.ts` (Branch C) | Blocked (`branchCCalled: false`) |
| `lib/vaylo/smart-talk/run-smart-talk.ts` | Blocked (`runSmartTalkCalledOrImported: false`) |
| `lib/vaylo/smart-talk/extract-text-from-image.ts` | Blocked (`extractTextFromImageCalledOrImported: false`) |

## 12. Public / Runtime / Persistence Blocks

All of the following are permanently blocked in this phase:

| Flag                                  | Value   |
|---------------------------------------|---------|
| `readyForLiveLLMRuntime`              | `false` |
| `readyForConnectedAiRuntimeExecution` | `false` |
| `readyForRealOperatorPilotRun`        | `false` |
| `readyForPilotRunNow`                 | `false` |
| `readyForPublicLaunch`                | `false` |
| `readyForPersistence`                 | `false` |
| `readyForRealDocumentInput`           | `false` |
| `readyForUserVisibleOutput`           | `false` |
| `publicRuntimeEnabled`                | `false` |
| `persistenceUsed`                     | `false` |
| `dnaSavePerformed`                    | `false` |
| `offlineSavePerformed`                | `false` |
| `realOperatorPilotExecuted`           | `false` |

## 13. Tamper Rejection

The implementation runs 100+ tamper cases covering:

- `contractReady: false` → "blocked"
- Missing any required scope, preflight step, prompt component, prompt blocker, metadata capture field, execution gate, execution blocker, or checklist item → "rejected"
- Wrong provider, model, or selectedCase → "rejected"
- Invalid executionMode → "rejected"
- `executionPlanOnly: false`, `futureDryRunAuthorizationRequired: false`, `oneFutureLiveLlmCallOnly: false`, `killSwitchRequiredForFutureCall: false`, `singleCallCounterRequiredForFutureCall: false` → "rejected"
- `liveLLMCalledInExecutionPlan: true`, `additionalLiveLLMCallsExecuted: true` → "rejected"
- Either positive gate set to `false` → "rejected"
- Any dangerous readiness flag set to `true` → "rejected"
- `promptTextConstructedNow: true`, prompt/output available or logged → "rejected"
- `syntheticInputOnly: false`, any real/raw/redacted/OCR/file/public input flag `true` → "rejected"
- Any Branch C / runSmartTalk / OCR dependency or call flag `true` → "rejected"
- Any persistence / public / pilot flag `true` → "rejected"
- Missing required acknowledgment statements → "rejected"
- Any `contains*` flag `true` → "rejected"
- Notes containing forbidden strings (88 total), PII patterns, secrets, or unsafe markers → "rejected"
- `neverUserVisible: false` → "rejected"

All tamper cases must be rejected for `allPassed: true`.

## 14. Readiness Decision

| Flag                                                        | Value when allPassed |
|-------------------------------------------------------------|----------------------|
| `readyForAdditionalSyntheticLiveLlmCaseDryRunAuthorization` | `true`               |
| `additionalSyntheticCaseExecutionPlanAccepted`              | `true`               |
| All dangerous readiness flags                               | `false`              |

## 15. Next Phase

**Phase 8.3U — Additional Synthetic Live LLM Case Dry-Run Authorization**

Calls `runAdditionalSyntheticLiveLlmCaseExecutionPlan()`, verifies `readyForAdditionalSyntheticLiveLlmCaseDryRunAuthorization: true`, and produces a single positive gate (`readyForAdditionalSyntheticLiveLlmCaseLiveExecution: true`) only when all dry-run authorization checks pass. This phase must follow the same pattern as Phase 8.3N.
