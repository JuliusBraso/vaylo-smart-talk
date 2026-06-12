# PHASE 8.2L-3 — Manual Review Capture Model

**Epoch:** 8.2L — Guarded Internal Controlled Pilot Execution
**Phase:** 8.2L-3
**Mode:** IN-MEMORY MODEL ONLY / NO PERSISTENCE

---

## 1. Purpose

After a synthetic single-run execution harness passes, a named internal
reviewer must formally attest their verdict. This phase defines the typed
in-memory model for capturing that verdict safely — validating it against
all safety rules before the result may advance to the post-execution audit.

---

## 2. What Manual Review Capture Means

Manual review capture is the process by which:

1. The reviewer confirms they have inspected the single-run harness result.
2. They confirm the 14 required checklist items.
3. They record a verdict (`pass`, `pass_with_warnings`, etc.).
4. They provide a safe signoff phase attestation.
5. The system validates the capture for forbidden content and safety flags.

A `ManualReviewCaptureResult` is produced in memory with:
- `safeReviewMetadata` — IDs, verdict, counts, phase only
- `readyForPostExecutionAudit: true` when accepted

---

## 3. What This Phase Does NOT Do

- Does **not** persist review records
- Does **not** store raw text, redacted text, full draft text, model output,
  secrets, PII, or document content
- Does **not** call `/api/smart-talk`
- Does **not** call any live LLM
- Does **not** make HTTP requests
- Does **not** read `process.env`
- Does **not** modify `app/api/smart-talk/route.ts`
- Does **not** touch UI
- Passing this phase only allows **8.2L-4 post-execution audit** to begin

---

## 4. Safe Metadata-Only Rule

`ManualReviewCaptureResult.safeReviewMetadata` contains:

```
pilotRunId        — identifier only
pilotScenarioId   — identifier only
reviewerId        — account ID only (not name)
reviewVerdict     — enum value
checklistPassedCount / checklistFailedCount — counts
signedOffAtPhase  — phase enum
```

No raw text, no redacted text, no model output, no secrets, no PII, no
document content is stored anywhere in the result. All content-storage
flags (`rawTextStored`, `secretStored`, etc.) are literal `false`.

---

## 5. Forbidden Fields and Strings

The following **must never** appear in `reviewerNotes` or `escalationReasons`:

| Category | Strings |
|----------|---------|
| Synthetic raw text | `SYNTHETIC_TEXT_NEVER_REAL_USER_DATA` |
| Synthetic secret | `synthetic-secret-never-real` |
| Draft/model fields | `rawInputText`, `redactedText`, `fullDraftText`, `modelOutput` |
| Secret field names | `apiKey`, `internalSecret` |
| Document markers | `IBAN`, `Steuer-ID`, `Aktenzeichen` |
| PII | `john@example.com`, `+49 170 1234567` |
| PII patterns | Strings containing `@` or `+49` |
| Authority text | `Sehr geehrter`, `BG-Nr` |

---

## 6. Required Checklist (14 items)

Every item must appear in `checklistConfirmed`:

| # | Item |
|---|------|
| 1 | `reviewed_single_run_result_status` |
| 2 | `reviewed_no_raw_text_echo` |
| 3 | `reviewed_no_secret_echo` |
| 4 | `reviewed_no_pii_echo` |
| 5 | `reviewed_no_user_visible_output` |
| 6 | `reviewed_no_live_llm` |
| 7 | `reviewed_no_persistence` |
| 8 | `reviewed_no_dna_save` |
| 9 | `reviewed_no_offline_save` |
| 10 | `reviewed_no_public_runtime` |
| 11 | `reviewed_no_api_route_call` |
| 12 | `reviewed_no_http_call` |
| 13 | `reviewed_abort_criteria` |
| 14 | `reviewed_ready_for_post_execution_audit` |

---

## 7. Verdict Rules

| Verdict | Escalation required |
|---------|---------------------|
| `pass` | No |
| `pass_with_warnings` | Yes — at least one safe escalation reason |
| `human_review_required` | Yes |
| `blocked` | Yes |
| `invalid_test_run` | Yes |

---

## 8. Escalation Reason Rule

When a verdict requires escalation, `escalationReasons` must contain at
least one entry. Escalation reason strings are subject to the same
forbidden-string checks as reviewer notes.

---

## 9. Tamper Rejection Cases (15)

`runManualReviewCaptureModelCheck()` validates that all 15 tamper cases
are rejected:

1. `containsRawInputText: true`
2. `reviewerNotes` includes `"rawInputText"`
3. `reviewerNotes` includes `"redactedText"`
4. `reviewerNotes` includes `"synthetic-secret-never-real"`
5. `reviewerNotes` includes `"john@example.com"`
6. `reviewerNotes` includes `"+49 170 1234567"`
7. `reviewerNotes` includes `"IBAN"`
8. `persistenceUsed: true`
9. `dnaSavePerformed: true`
10. `offlineSavePerformed: true`
11. `publicRuntimeEnabled: true`
12. `liveLLMCalled: true`
13. `emittedToUserNow: true`
14. `checklistConfirmed` missing one required item
15. `reviewVerdict: "blocked"` with empty `escalationReasons`

---

## 10. Safety Invariants

All literal types on `ManualReviewCaptureResult`:

| Invariant | Value |
|-----------|-------|
| `readyForPilotRunNow` | false |
| `readyForPublicLaunch` | false |
| `readyForLiveLLMRuntime` | false |
| `readyForPersistence` | false |
| `rawTextStored` | false |
| `redactedTextStored` | false |
| `fullDraftTextStored` | false |
| `modelOutputStored` | false |
| `secretStored` | false |
| `userPiiStored` | false |
| `documentContentStored` | false |
| `liveLLMCalled` | false |
| `persistenceUsed` | false |
| `emittedToUserNow` | false |
| `neverUserVisible` | true |

---

## 11. Readiness Decision

```
readyForPostExecutionAudit: true   (when rejectionReasons.length === 0)
readyForPilotRunNow:         false  (literal — permanent)
readyForPublicLaunch:        false  (literal — permanent)
readyForLiveLLMRuntime:      false  (literal)
readyForPersistence:         false  (literal)
```

---

## 12. Next Phase

**8.2L-4 — Post-Execution Audit**

Formally audits the outcome of the synthetic single-run execution and manual
review capture. Requires
`runManualReviewCaptureModelCheck().readyForPostExecutionAudit === true`.
Produces a post-execution audit result that either closes or blocks the 8.2L
epoch.
