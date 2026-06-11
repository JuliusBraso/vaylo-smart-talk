# PILOT EVIDENCE VALIDATION INTEGRATION — Phase 8.2K-4

## 1. Purpose

Proves that a guarded pilot runtime response can be safely transformed into a
`PilotEvidenceRecord` validation input and validated by the existing 8.2J-4
evidence model.  No live infrastructure is involved.

This integration does not persist evidence.
This integration does not call the API route.
This integration does not call live LLM.
This integration does not store raw text.
This integration does not emit user-visible output.

## 2. What Is Integrated

| Source | Target |
|---|---|
| Synthetic `SyntheticPilotRuntimeResponse` (from 8.2K-2 response shape) | `Record<string, unknown>` evidence record object |
| Evidence record object | `PilotEvidenceValidationInput` (8.2J-4) |
| `PilotEvidenceValidationInput` | `validatePilotEvidenceRecord()` (8.2J-4) |
| `PilotEvidenceValidationResult` | Integration case result + leak checks |

Also: `runPilotRuntimeE2EHarness()` (8.2K-3) is called inside
`runPilotEvidenceValidationIntegration()` to confirm the upstream harness
still passes before reporting `allPassed: true`.

## 3. What Is Validated

| Case Kind | Response Kind | Expected Outcome |
|---|---|---|
| authorised_runtime_response_to_valid_evidence | authorised_internal_packet | valid |
| blocked_runtime_response_to_valid_evidence | blocked | valid |
| human_review_runtime_response_to_valid_evidence | human_review_required | valid |
| invalid_request_runtime_response_to_valid_evidence | invalid_request | valid |
| raw_text_tamper_rejected | authorised_internal_packet | rejected |
| redacted_text_tamper_rejected | authorised_internal_packet | rejected |
| secret_tamper_rejected | authorised_internal_packet | rejected |
| user_pii_tamper_rejected | authorised_internal_packet | rejected |
| persistence_flag_tamper_rejected | authorised_internal_packet | rejected |
| public_runtime_flag_tamper_rejected | authorised_internal_packet | rejected |
| emitted_to_user_tamper_rejected | authorised_internal_packet | rejected |
| missing_signoff_tamper_rejected | authorised_internal_packet | rejected |
| missing_escalation_reason_tamper_rejected | blocked | rejected |

## 4. Synthetic-Only Policy

| Item | Value |
|---|---|
| `pilotRunId` | `"pilot-run-8-2k-4"` |
| `scenarioId` | `"pilot_invoice_basic"` |
| `reviewerId` / `signedOffBy` | `"internal-reviewer-1"` |
| Reviewer notes | `"synthetic internal validation note without personal data"` |
| Escalation reason | `"internal_metadata_leak_detected"` |
| Real user text | never used |
| Real PII | never used |
| Real secrets | never used |
| `process.env` | never read |
| HTTP requests | never made |

## 5. Safe Mapping Rules

The mapper (`mapRuntimeResponseToPilotEvidenceValidationInput`) follows these
rules to produce a valid `PilotEvidenceRecord` shape:

| Runtime `responseKind` | `reviewVerdict` | `escalationReasons` | `signedOffAtPhase` | `checklistFailedCount` |
|---|---|---|---|---|
| authorised_internal_packet | pass | [] | final_signoff | 0 |
| blocked | blocked | [internal_metadata_leak_detected] | final_signoff | 1 |
| human_review_required | human_review_required | [internal_metadata_leak_detected] | final_signoff | 1 |
| invalid_request | invalid_test_run | [internal_metadata_leak_detected] | escalation_review | 1 |

All safety flags (`containsRawInputText`, `persistenceUsed`, etc.) are
explicitly set to `false` in the mapped record.

## 6. Forbidden Fields / Strings

Fields that must never appear in a record or validation result:

| Field name | Why |
|---|---|
| `rawInputText` | prohibited by 8.2J-4 validator (step 2) |
| `redactedText` | prohibited by 8.2J-4 validator (step 2) |
| `fullDraftText` | prohibited by 8.2J-4 validator (step 2) |
| `userPii` | prohibited by 8.2J-4 validator (step 2) |
| `internalSecret` | prohibited by 8.2J-4 validator (step 2) |
| `rawModelOutput` | prohibited by 8.2J-4 validator (step 2) |

Strings that must never appear in stringified validation result:

- `SYNTHETIC_TEXT_NEVER_REAL_USER_DATA`
- `synthetic-secret-never-real`
- `john@example.com`
- `+49 170 1234567`
- `injected-raw-text-must-be-rejected`
- `injected-redacted-text-must-be-rejected`

The validator never echoes field values — it only records field KEY names in
`prohibitedFieldsDetected`. So injected tamper values never appear in results.

## 7. Tamper Cases and Rejection Mechanisms

| Tamper | Injected change | Validator rejection step |
|---|---|---|
| raw_text_tamper_rejected | `rawInputText: "..."` | Step 2 — prohibited field |
| redacted_text_tamper_rejected | `redactedText: "..."` | Step 2 — prohibited field |
| secret_tamper_rejected | `internalSecret: SYNTHETIC_SECRET` | Step 2 — prohibited field |
| user_pii_tamper_rejected | email in reviewer notes | Step 9 — raw-text-like pattern |
| persistence_flag_tamper_rejected | `persistenceUsed: true` | Step 8 — persistence claim |
| public_runtime_flag_tamper_rejected | `readyForPublicLaunch: true` | Step 8 — public launch claim |
| emitted_to_user_tamper_rejected | `emittedToUserNow: true` | Step 8 — runtime claim |
| missing_signoff_tamper_rejected | `signedOffAtPhase: "pre_run"` | Step 7 — sign-off phase |
| missing_escalation_reason_tamper_rejected | `escalationReasons: []` for "blocked" | Step 6 — escalation reason |

## 8. Safety Invariants

The `PilotEvidenceValidationIntegrationSummary` carries literal-type safety
invariants:

```
liveLLMCalled: false                  (literal false — compile-time enforced)
apiRouteModifiedByIntegration: false
uiTouched: false
persistenceUsed: false
dnaSavePerformed: false
offlineSavePerformed: false
emittedToUserNow: false
neverUserVisible: true                (literal true)
```

Per-case checks (all 13 cases) verify:
- `persistenceUsed`, `dnaSavePerformed`, `offlineSavePerformed` not true
- `emittedToUserNow` not true
- `liveLLMCalled` not true
- `publicRuntimeEnabled` not true

## 9. Non-Goals

- This integration is **not** evidence persistence — no records are stored.
- This integration is **not** a performance test.
- This integration does **not** wire the governance chain (8.2G).
- This integration does **not** call live LLM or process real user text.
- This integration does **not** replace the 8.2K-5 runtime closure audit.

## 10. Next Phase

**8.2K-5 — Guarded Pilot Runtime Closure Audit**

Formally close the 8.2K epoch by running a closure audit that verifies all
8.2K layers (plan, guard contracts, API branch, E2E harness, evidence
validation integration) and confirms readiness criteria for the controlled
internal pilot execution phase.
