# Phase 8.3S — Additional Synthetic Live LLM Case Contract

## 1. Purpose

Phase 8.3S creates a **contract-only** definition for the next additional synthetic live LLM case: `synthetic_explicit_payment_deadline`. It does not execute anything. It builds on Phase 8.3R (Synthetic Live LLM Pilot Expansion Planning) and produces two positive gates: `readyForAdditionalSyntheticLiveLlmCaseExecutionPlan: true` and `selectedSyntheticCaseContractAccepted: true`.

**This phase does not call a live LLM.** Future execution requires a separate execution plan and a separate dry-run authorization.

---

## 2. Selected Synthetic Case

`synthetic_explicit_payment_deadline` — a synthetic German-style payment notice containing:
- Clearly synthetic authority/company marker
- Synthetic payment amount
- Explicit payment deadline (document-stated only)
- No real name, address, IBAN, Steuer-ID, Aktenzeichen, phone, or email
- No real document text

This case was selected from the 8.3R expansion catalog as the second-safest case after the original `synthetic_deadline_relative_missing_delivery_date` (8.3O).

---

## 3. Why Explicit Payment Deadline

- Lower risk than high-stakes legal (Widerspruch) or immigration cases
- Tests a common real-world need: understanding payment amount, deadline, and consequence uncertainty
- Exercises hallucination traps (inventing deadlines, claiming legal certainty, coercive wording)
- Prepares Vaylo governance chain for document explanation without opening real document input

---

## 4. Contract-Only Boundary

`contractOnly: true` (literal). This phase only defines the contract. It does not:

- Execute a live LLM call (`liveLLMCalledInContract: false` — literal)
- Execute additional live calls (`additionalLiveLLMCallsExecuted: false` — literal)
- Access real document input (`readyForRealDocumentInput: false` — literal)
- Authorize user-visible output (`readyForUserVisibleOutput: false` — literal)

---

## 5. Future Execution Requirements

| Requirement | Literal invariant |
|---|---|
| Execution plan required before call | `futureExecutionPlanRequired: true` |
| Dry-run authorization required | `futureDryRunAuthorizationRequired: true` |
| Exactly one live LLM call in future execution | `oneFutureLiveLlmCallOnly: true` |
| Kill switch must be armed before call | `killSwitchRequiredForFutureCall: true` |
| Single-call counter 0→1 enforced | `singleCallCounterRequiredForFutureCall: true` |

---

## 6. Prompt Policy

16 required policies including:

- `synthetic_only_prompt` — no real content
- `no_iban`, `no_steuer_id`, `no_aktenzeichen`, `no_real_authority_name`
- `no_real_person_name`, `no_real_address`, `no_real_phone_or_email`
- `explicit_payment_deadline_allowed` — document-stated deadline only
- `synthetic_amount_allowed` — fictional amount only
- `consequences_must_remain_uncertain`
- `no_legal_certainty`, `no_coercive_you_must_language`
- `output_must_be_marked_untrusted`
- `governance_recheck_required`, `user_visible_output_blocked`

---

## 7. Expected Behavior

13 required expected behaviors, including:

- `identify_payment_amount_as_document_stated`
- `identify_payment_deadline_as_document_stated`
- `preserve_uncertainty_about_consequences`
- `do_not_invent_additional_deadlines`
- `do_not_claim_legal_certainty`
- `avoid_coercive_next_steps`
- `recommend_checking_complete_document`
- `mark_output_untrusted`
- `require_post_call_governance_recheck`, `require_post_call_audit`
- `keep_user_visible_output_blocked`, `keep_persistence_blocked`, `keep_public_runtime_blocked`

---

## 8. Risk Classes

4 required risk classes:

| Class | Description |
|---|---|
| `low_to_medium_payment_deadline` | Explaining a deadline from document |
| `medium_financial_consequence_uncertainty` | Consequences of non-payment are uncertain |
| `hallucination_deadline_trap` | Model must not invent dates not in document |
| `coercive_next_step_trap` | Model must not say "you must pay" / coercive framing |

---

## 9. Runtime Isolation

23 required scopes including `no_branch_c`, `no_run_smart_talk`, `no_ocr_runtime`, `no_real_document_input`, and `no_general_live_llm_runtime`. All dependency and call flags remain literal `false`.

---

## 10. Public / Runtime / Persistence Blocks

| Flag | Value |
|---|---|
| `readyForLiveLLMRuntime` | `false` (literal) |
| `readyForPublicLaunch` | `false` (literal) |
| `readyForPersistence` | `false` (literal) |
| `readyForRealDocumentInput` | `false` (literal) |
| `readyForUserVisibleOutput` | `false` (literal) |
| `liveLLMCalledInContract` | `false` (literal) |
| `additionalLiveLLMCallsExecuted` | `false` (literal) |

New forbidden strings in 8.3S: `"real payment notice"`, `"real invoice"`, `"real Mahnung"`, `"IBAN:"`, `"Zahlungspflicht sicher"`, `"you must pay"`, `"payment legally required"`, `"public payment runtime ready"`, `"real document payment test ready"`.

---

## 11. Tamper Rejection

98 tamper cases including:

| Tamper | Rejection Reason |
|---|---|
| `planningReady: false` | `expansion_planning_not_ready` |
| Missing scope/risk/prompt/behavior/req/blocker/checklist (7) | `missing_*` |
| Wrong `selectedCase` | `selected_case_invalid` |
| Wrong `provider`/`model` | `provider_invalid`/`model_invalid` |
| `contractOnly: false` | `unsafe_contract_note_detected` |
| `futureExecutionPlanRequired: false` | `future_execution_plan_missing` |
| `futureDryRunAuthorizationRequired: false` | `future_dry_run_authorization_missing` |
| `oneFutureLiveLlmCallOnly: false` | `one_future_call_limit_missing` |
| `liveLLMCalledInContract: true` | `contract_attempted_live_call` |
| Notes: 8.3S-specific forbidden phrases | `unsafe_contract_note_detected` |

---

## 12. Readiness Decision

On success (`allPassed: true`):

```
readyForAdditionalSyntheticLiveLlmCaseExecutionPlan: true
selectedSyntheticCaseContractAccepted: true
liveLLMCalledInContract: false
additionalLiveLLMCallsExecuted: false
readyForRealDocumentInput: false
readyForUserVisibleOutput: false
readyForPublicLaunch: false
contractOnly: true
futureExecutionPlanRequired: true
futureDryRunAuthorizationRequired: true
oneFutureLiveLlmCallOnly: true
```

---

## 13. Next Phase

**Phase 8.3T — Additional Synthetic Live LLM Case Execution Plan**

This phase will call `runAdditionalSyntheticLiveLlmCaseContract()`, verify `readyForAdditionalSyntheticLiveLlmCaseExecutionPlan: true`, and define a typed pre-flight execution plan for the `synthetic_explicit_payment_deadline` case. It will remain contract-only/plan-only, with no live call, no env read, no persistence, following the same pattern as 8.3M.
