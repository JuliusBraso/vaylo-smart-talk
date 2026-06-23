# HIGH-RISK SYNTHETIC LEGAL DEADLINE LIVE EXECUTION — Phase 8.3AC

## 1. Purpose

Phase 8.3AC performs the first and only controlled live LLM call for the `synthetic_high_risk_widerspruch_deadline` case. It verifies the 8.3AB dry-run authorization, activates the kill switch and single-call counter, constructs a synthetic prompt in memory, makes exactly one call to `gpt-4o-mini`, captures metadata only, marks output untrusted immediately, and sets the post-call governance recheck flag.

This phase may execute exactly one synthetic live LLM call. This phase does not calculate a legal deadline. This phase does not authorize legal certainty. This phase does not authorize real Bescheid, real Widerspruch, real legal documents, or real document input.

---

## 2. Selected High-Risk Synthetic Case

| Field | Value |
|---|---|
| Case ID | `synthetic_high_risk_widerspruch_deadline` |
| Provider | `openai` |
| Model | `gpt_4o_mini` |
| API model string | `gpt-4o-mini` |
| Source kind | `synthetic_high_risk_legal_deadline_never_user_visible` |

---

## 3. Controlled Live-Execution Boundary

This phase may call OpenAI **exactly once**, inside `runHighRiskSyntheticLegalDeadlineLiveExecution()`, and only when all gates pass. It does NOT:

- Auto-execute on import
- Call public API routes, runSmartTalk(), or OCR runtime
- Log, store, or return prompt text or model output
- Log or return the API key
- Persist anything
- Emit user-visible output
- Retry or loop on any failure
- Authorize real document input, public runtime, or repeated live calls

---

## 4. Kill Switch

The live call is permitted **only** when the environment variable:

```
HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_LIVE_EXECUTION_ENABLED=true
```

is set to exactly `"true"`. If missing, undefined, or any other value, the function returns a blocked result immediately with `liveLLMCallPerformed: false` and `callCount` unchanged.

The kill switch value is never exposed in output. Only `killSwitchPresent: boolean` and `killSwitchEnabled: boolean` are reported.

---

## 5. Single-Call Counter

A module-level counter `highRiskSyntheticLegalDeadlineLiveCallCount` enforces the one-call limit:

- `callCountBefore` is captured before the call attempt.
- The counter is incremented **immediately before** the fetch call.
- `callCountAfter` is captured after the call attempt.
- If `callCountBefore !== 0`, the call is blocked regardless of other conditions.
- Any value `callCountAfter !== 1` is a validation failure.

---

## 6. Synthetic Prompt Rules

The prompt is built in memory inside `buildHighRiskSyntheticLegalDeadlinePrompt()`. It is **not exported, not logged, not stored, not returned**.

Required synthetic content:
- `[SYNTHETIC_HIGH_RISK_LEGAL_DEADLINE_NEVER_USER_VISIBLE]`
- `[SYNTHETIC_AUTHORITY_FOR_TEST_ONLY]`
- Bescheid-like notice
- "Widerspruch kann innerhalb eines Monats nach Bekanntgabe eingelegt werden"
- Bekanntgabedatum / delivery date intentionally absent
- complete Rechtsbehelfsbelehrung intentionally absent
- "Was bedeutet das und bis wann muss ich reagieren?"

The prompt instructs the model to: preserve uncertainty, not calculate an exact deadline, not invent a delivery/Bekanntgabe date, not invent a final deadline date, not claim legal certainty, not issue coercive legal instructions, and recommend qualified legal help if deadline risk is high.

---

## 7. Forbidden Real-Data Components

The prompt must NOT contain:
- Real authority name, person name, or address
- Real Aktenzeichen, Steuer-ID, phone, or email
- Real document scan or OCR text
- Real Bescheid or Widerspruch
- Real delivery date or inferred delivery date
- Final calculated deadline date
- Production legal advice or user-visible output

---

## 8. API Key Handling

- `OPENAI_API_KEY` is read only inside `executeSingleHighRiskSyntheticLegalDeadlineCall()`.
- The value is never logged, never returned, never included in notes or errors.
- Only `apiKeyPresent: boolean` is reported in the result.

---

## 9. Prompt Handling

| Flag | Value |
|---|---|
| `promptConstructedInMemoryOnly` | `true` only when call was performed |
| `promptTextLogged` | `false` always (literal type) |
| `promptTextStored` | `false` always (literal type) |
| `promptTextReturned` | `false` always (literal type) |

---

## 10. Model Output Handling

After the call, the response JSON is inspected only for structural shape (`choices` array present). The message content is **never read, never stored, never returned**.

| Flag | Value |
|---|---|
| `modelOutputReceived` | `true` if `choices` array present in response |
| `modelOutputMarkedUntrusted` | `true` if `modelOutputReceived` is true |
| `modelOutputContentInspected` | `false` always (literal type) |
| `modelOutputLogged` | `false` always (literal type) |
| `modelOutputStored` | `false` always (literal type) |
| `modelOutputReturned` | `false` always (literal type) |
| `modelOutputAvailableInResult` | `false` always (literal type) |

---

## 11. Metadata-Only Capture

`metadataOnlyCaptured: true` — only the following is captured post-call:
- Provider, model, API model, source kind
- `callCountBefore`, `callCountAfter`
- `liveLLMCallPerformed`, `liveLLMCalledExactlyOnce`
- `modelOutputReceived`, `modelOutputMarkedUntrusted`

No prompt text, no model output content, no token-level analysis.

---

## 12. Untrusted Model Output

`modelOutputMarkedUntrusted: true` is set immediately if `modelOutputReceived: true`. The output remains untrusted until the post-call governance recheck explicitly clears it.

---

## 13. Delivery/Bekanntgabe Date Dependency

`deliveryDateRequiredForExactDeadline: true` and `exactDeadlineCalculationAuthorized: false` are carried forward from 8.3Y through 8.3AC. The synthetic prompt deliberately omits the delivery/Bekanntgabe date to test the model's uncertainty-preservation behavior.

---

## 14. Legal-Deadline Safety Blocks

| Flag | Value |
|---|---|
| `exactDeadlineCalculationAuthorized` | `false` literal |
| `deliveryDateInventionAuthorized` | `false` literal |
| `finalDateInventionAuthorized` | `false` literal |
| `legalCertaintyAuthorized` | `false` literal |
| `coerciveLegalInstructionAuthorized` | `false` literal |

Exact deadline calculation remains blocked without delivery or Bekanntgabe date. Delivery date invention and final date invention remain blocked.

---

## 15. Runtime Isolation

The existing Vaylo Smart Talk live LLM runtime (Branch C, `run-smart-talk.ts`, OCR path) remains **explicitly isolated**:

- Does not depend on Branch C at runtime
- Does not call `runSmartTalk()` or `extractTextFromImage()`
- Does not modify `app/api/smart-talk/route.ts`
- Sets `branchCDependencyAllowed: false`, `runSmartTalkDependencyAllowed: false`, `ocrRuntimeDependencyAllowed: false`

---

## 16. What This Phase Does Not Authorize

- Real document input or public runtime
- User-visible output of any kind
- Persistence of any kind (DNA, offline, database)
- Real operator pilot execution
- Connected AI runtime execution
- Repeated live LLM calls (more than one)
- A call without kill switch or single-call counter
- A call without subsequent governance recheck and audit

---

## 17. Technical Debt Notes

1. **Broad ESLint pre-existing issues** — `scripts/sync-i18n.ts`, `scripts/verify-db-schema.ts`, and `run-manual-review-capture-model-check.ts` have known, pre-existing ESLint errors. Not blockers for 8.3AC. Tracked via `broadEslintDebtTracked: true`.

2. **Post-call cached metadata pattern** — Post-call phases (recheck, audit) should move to a supplied or cached metadata result pattern before stronger batch/runtime integration. Tracked via `postCallCachedMetadataDebtTracked: true`.

---

## 18. Tamper Rejection

The implementation defines **108 tamper cases** rejected by the local validator. Categories include:

- Dry-run authorization prerequisite state (2)
- Identity fields (5)
- Array emptiness (4)
- Kill switch and API key (3)
- Call counter (3: callCountBefore 1, callCountAfter 0, callCountAfter 2)
- Live call execution flags (3)
- Prompt exposure flags set to `true` (3)
- Model output flags (7 individually)
- Core literals set to `false` (4)
- Future gate literals set to `false` (7)
- Legal safety literals set to `true` (5)
- Readiness flags incorrect (3 including PostCallAudit: true)
- Dangerous readiness flags set to `true` (8 individually)
- Input isolation flags set to `true` (8 individually)
- Runtime isolation flags set to `true` (6 individually)
- Persistence/output flags set to `true` (6 individually)
- Debt tracking disabled (4)
- Acknowledgments missing (2)
- `contains*` flags set to `true` (10 individually)
- Forbidden string injection in notes (14 test strings)

---

## 19. Readiness Decision

| Flag | Value |
|---|---|
| `highRiskSyntheticLegalDeadlineLiveExecutionAccepted` | `true` only on `allPassed` |
| `readyForHighRiskSyntheticLegalDeadlinePostCallGovernanceRecheck` | `true` only on `allPassed` |
| `readyForHighRiskSyntheticLegalDeadlinePostCallAudit` | `false` always |
| `readyForLiveLLMRuntime` | `false` |
| `readyForPublicLaunch` | `false` |
| All other dangerous readiness | `false` |

`allPassed` requires: prerequisite passed AND live call executed AND validation accepted AND all tamper cases rejected.

If the kill switch is not enabled, `allPassed: false` and `readyForHighRiskSyntheticLegalDeadlinePostCallGovernanceRecheck: false`.

---

## 20. Next Phase

**Phase 8.3AD — High-Risk Synthetic Legal Deadline Post-Call Governance Recheck**

This phase must:
- Verify the 8.3AC live execution metadata
- Confirm exactly one call was made
- Confirm kill switch was enabled and API key was present
- Confirm model output was received and marked untrusted
- Confirm metadata-only capture
- Confirm no prompt text or model output content was exposed
- Confirm all legal safety blocks remain in force
- Set `readyForHighRiskSyntheticLegalDeadlinePostCallAudit: true` on pass
