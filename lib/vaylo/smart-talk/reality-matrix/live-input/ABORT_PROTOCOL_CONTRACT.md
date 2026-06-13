# PHASE 8.2M-3 — Abort Protocol Contract

**Epoch:** 8.2M — Real Operator Pilot Authorization
**Check ID:** 8.2M-3
**Mode:** CONTRACT ONLY / NO REAL ABORT EXECUTION / NO KILL SWITCH MODIFICATION / NO REAL PILOT RUN

---

## 1. Purpose

Define the typed abort protocol contract that a named human operator and
reviewer must satisfy to confirm an abort path exists before any real operator
pilot run can be authorized.

This phase verifies the 8.2M-2 real environment attestation contract
(`runRealEnvironmentAttestationContractCheck()`), validates a synthetic safe
abort protocol input, and runs 29 tamper rejection cases.

---

## 2. What Abort Protocol Means

The abort protocol specifies:
- Which conditions (triggers) can cause a future real pilot run to be stopped.
- What actions (stop actions) must be taken when a trigger fires.
- That both the operator and reviewer have acknowledged they can manually abort
  at any point.
- That rollback or stop confirmation is required before any future pilot can
  continue after an abort.
- That user-visible output, persistence, live LLM continuation, and public
  runtime remain blocked after an abort.

---

## 3. What This Contract Does NOT Do

- Does **not** execute a real abort. No production abort is triggered.
- Does **not** modify a kill switch. `killSwitchModifiedByContract` is literal `false`.
- Does **not** modify runtime abort hooks. `runtimeAbortHookModifiedByContract` is literal `false`.
- Does **not** authorize a real pilot run. `readyForRealOperatorPilotRun` is literal `false`.
- Does **not** persist abort records. `persistenceUsed` is literal `false`.
- Does **not** call any live LLM or make HTTP requests.
- Does **not** modify the API route or UI.
- Does **not** read `process.env`. No env values are accessed by code.
- Does **not** store secrets, API keys, PII, raw text, or document content.

---

## 4. Required Abort Triggers (18)

All 18 triggers must appear in `requiredAbortTriggers`:

| # | Trigger |
|---|---------|
| 1 | `operator_manual_abort` |
| 2 | `reviewer_manual_abort` |
| 3 | `kill_switch_enabled` |
| 4 | `unexpected_runtime_output` |
| 5 | `user_visible_output_attempted` |
| 6 | `live_llm_unexpectedly_called` |
| 7 | `persistence_attempt_detected` |
| 8 | `public_runtime_attempt_detected` |
| 9 | `raw_text_leak_detected` |
| 10 | `secret_or_env_value_leak_detected` |
| 11 | `pii_leak_detected` |
| 12 | `document_content_leak_detected` |
| 13 | `unsafe_legal_certainty_detected` |
| 14 | `automatic_deadline_claim_detected` |
| 15 | `missing_manual_review_detected` |
| 16 | `monitoring_uncertain` |
| 17 | `operator_uncertain` |
| 18 | `reviewer_uncertain` |

If any trigger is missing, the reason `missing_abort_trigger` is added.

---

## 5. Required Stop Actions (10)

All 10 stop actions must appear in `requiredStopActions`:

| # | Stop Action |
|---|-------------|
| 1 | `stop_current_run` |
| 2 | `block_user_visible_output` |
| 3 | `block_persistence` |
| 4 | `block_live_llm_continuation` |
| 5 | `block_public_runtime` |
| 6 | `mark_run_invalid` |
| 7 | `require_manual_review` |
| 8 | `require_post_run_audit` |
| 9 | `require_incident_note` |
| 10 | `require_next_phase_blocked_until_review` |

If any stop action is missing, the reason `missing_stop_action` is added.

---

## 6. Required Checklist (18 items)

All 18 items must appear in `checklistConfirmed`:

| # | Checklist Item |
|---|----------------|
| 1 | `kill_switch_path_attested` |
| 2 | `operator_manual_abort_path_attested` |
| 3 | `reviewer_manual_abort_path_attested` |
| 4 | `abort_triggers_reviewed` |
| 5 | `stop_actions_reviewed` |
| 6 | `user_visible_output_block_on_abort_attested` |
| 7 | `persistence_block_on_abort_attested` |
| 8 | `live_llm_continuation_block_on_abort_attested` |
| 9 | `public_runtime_block_on_abort_attested` |
| 10 | `manual_review_required_after_abort_attested` |
| 11 | `post_run_audit_required_after_abort_attested` |
| 12 | `incident_note_required_after_abort_attested` |
| 13 | `operator_abort_acknowledged` |
| 14 | `reviewer_abort_acknowledged` |
| 15 | `rollback_or_stop_confirmation_required` |
| 16 | `no_runtime_abort_execution_performed` |
| 17 | `no_persistence_performed` |
| 18 | `no_public_runtime_enabled` |

---

## 7. Operator/Reviewer Acknowledgments

Both `operatorAbortAcknowledgment` and `reviewerAbortAcknowledgment` must
include all four required acknowledgment statements:

> "I acknowledge that I can manually abort the future pilot run at any point."

> "I acknowledge that user-visible output remains blocked on abort."

> "I acknowledge that persistence remains blocked on abort."

> "I acknowledge that post-run audit is required after abort."

If any statement is missing:
- Operator: `missing_operator_acknowledgment`
- Reviewer: `missing_reviewer_acknowledgment`

---

## 8. Rollback/Stop Confirmation

`rollbackOrStopConfirmation` must be non-empty and must mention "rollback" or
"stop" (case-insensitive). If missing or invalid:
`missing_rollback_or_stop_confirmation`

---

## 9. Forbidden Values and Strings (18)

The following must never appear in any field, acknowledgment, confirmation, or notes:

| Category | Forbidden |
|----------|-----------|
| API keys | `"sk-"` |
| Env assignments | `"OPENAI_API_KEY="`, `"VAYLO_INTERNAL_RUNTIME_SECRET="` |
| Env/code references | `"process.env"`, `"apiKey"`, `"internalSecret"` |
| Raw/draft markers | `"rawInputText"`, `"redactedText"`, `"fullDraftText"`, `"modelOutput"`, `"SYNTHETIC_TEXT_NEVER_REAL_USER_DATA"` |
| PII | `"john@example.com"`, `"+49 170 1234567"`, email patterns, phone patterns |
| Document content | `"IBAN"`, `"Steuer-ID"`, `"Aktenzeichen"`, `"Sehr geehrter"`, `"BG-Nr"` |

Secret-like strings (`secret`, `token`, `password`) are also detected.

---

## 10. Tamper Rejection Cases (29)

All 29 tamper cases must be rejected:

| # | Tamper | Expected reason |
|---|--------|-----------------|
| 1 | `environmentAttestationReady: false` | `environment_attestation_not_ready` |
| 2 | Empty `pilotSessionId` | `missing_pilot_session_id` |
| 3 | Empty `operatorHumanId` | `missing_operator_identity_reference` |
| 4 | Empty `reviewerHumanId` | `missing_reviewer_identity_reference` |
| 5 | Missing one abort trigger | `missing_abort_trigger` |
| 6 | Missing one stop action | `missing_stop_action` |
| 7 | Missing one checklist item | `missing_required_checklist_item` |
| 8 | Incomplete operator acknowledgment | `missing_operator_acknowledgment` |
| 9 | Incomplete reviewer acknowledgment | `missing_reviewer_acknowledgment` |
| 10 | Empty `rollbackOrStopConfirmation` | `missing_rollback_or_stop_confirmation` |
| 11 | Invalid `abortMonitoringMode` | `invalid_abort_monitoring_mode` |
| 12 | `realAbortExecuted: true` | `real_abort_execution_detected` |
| 13 | `killSwitchModifiedByContract: true` | `real_abort_execution_detected` |
| 14 | `runtimeAbortHookModifiedByContract: true` | `real_abort_execution_detected` |
| 15 | `containsSecret: true` | `forbidden_secret_detected` |
| 16 | `containsEnvValue: true` | `forbidden_env_value_detected` |
| 17 | `containsApiKey: true` | `forbidden_api_key_detected` |
| 18 | `containsModelOutput: true` | `forbidden_model_output_detected` |
| 19 | Notes includes `"process.env"` | `forbidden_env_value_detected` |
| 20 | Notes includes `"OPENAI_API_KEY="` | `forbidden_env_value_detected` |
| 21 | Notes includes `"sk-"` | `forbidden_secret_detected` |
| 22 | Notes includes `"john@example.com"` | `forbidden_pii_detected` |
| 23 | Notes includes `"+49 170 1234567"` | `forbidden_pii_detected` |
| 24 | Notes includes `"Aktenzeichen"` | `forbidden_document_content_detected` |
| 25 | `containsRealUserInput: true` | `real_user_input_detected` |
| 26 | `persistenceUsed: true` | `persistence_claim_detected` |
| 27 | `liveLLMCalled: true` | `live_llm_claim_detected` |
| 28 | `publicRuntimeEnabled: true` | `public_runtime_claim_detected` |
| 29 | `emittedToUserNow: true` | `user_visible_output_claim_detected` |

---

## 11. Safety Invariants

All literal types on `AbortProtocolContractCheckResult`:

| Invariant | Value |
|-----------|-------|
| `readyForRealOperatorPilotRun` | false |
| `readyForPilotRunNow` | false |
| `readyForPublicLaunch` | false |
| `readyForLiveLLMRuntime` | false |
| `readyForPersistence` | false |
| `realPilotRunExecuted` | false |
| `realAbortExecuted` | false |
| `realUserInputProcessed` | false |
| `killSwitchModifiedByContract` | false |
| `runtimeAbortHookModifiedByContract` | false |
| `liveLLMCalled` | false |
| `persistenceUsed` | false |
| `emittedToUserNow` | false |
| `neverUserVisible` | true |

---

## 12. Readiness Decision

```
checkId:                        "8.2M-3"
allPassed:                      true  (on clean env attestation + synthetic + tamper pass)
environmentAttestationReady:    true
syntheticAbortProtocolAccepted: true
tamperCasesRejected:            true  (29/29)
readyForRealInputPolicy:        true
readyForEvidencePolicy:         true
readyForPostRunAuditPlanning:   true
readyForRealOperatorPilotRun:   false  (literal)
readyForPilotRunNow:            false  (literal)
readyForPublicLaunch:           false  (literal)
realAbortExecuted:              false  (literal)
killSwitchModifiedByContract:   false  (literal)
```

---

## 13. Next Phase

**8.2M-4 — Real Input Policy Contract**

The real input policy contract will define the typed requirements governing
what input may be processed during a future real operator pilot run —
including redaction policy, allowlist enforcement, and content safety gates.

This builds on `readyForRealInputPolicy: true` set by Phase 8.2M-3.
