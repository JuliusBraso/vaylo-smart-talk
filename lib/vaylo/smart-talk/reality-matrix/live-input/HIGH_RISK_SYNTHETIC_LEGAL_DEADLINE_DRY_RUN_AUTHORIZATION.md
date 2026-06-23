# HIGH-RISK SYNTHETIC LEGAL DEADLINE DRY-RUN AUTHORIZATION — Phase 8.3AB

## 1. Purpose

Phase 8.3AB creates the dry-run authorization gate for one future high-risk synthetic live LLM call targeting the `synthetic_high_risk_widerspruch_deadline` case. It builds on the 8.3AA execution plan and formally authorizes the next live-execution phase — without executing any live LLM call, reading `process.env`, importing any SDK, finalizing an API prompt, or processing any real input.

This phase does not calculate a legal deadline. This phase does not authorize legal certainty. This phase does not call a live LLM. This phase does not finalize or send an API prompt. This phase authorizes only the next live-execution phase, not public runtime.

---

## 2. Selected High-Risk Synthetic Case

| Field | Value |
|---|---|
| Case ID | `synthetic_high_risk_widerspruch_deadline` |
| Provider | `openai` |
| Model | `gpt_4o_mini` |
| Future API model string | `gpt-4o-mini` |
| Source kind | `synthetic_high_risk_legal_deadline_never_user_visible` |

---

## 3. Dry-Run Authorization-Only Boundary

This phase is **DRY-RUN AUTHORIZATION ONLY**. It does not:

- Call OpenAI or use `fetch()`
- Read `process.env`
- Import any LLM SDK
- Finalize or send the API prompt
- Inspect model output
- Process real user input (OCR / photo / file)
- Call Branch C, `runSmartTalk()`, or `extractTextFromImage()`
- Persist anything
- Emit user-visible output
- Authorize public or general live LLM runtime
- Authorize real Bescheid, real Widerspruch, real legal documents, or real document input

---

## 4. What Dry-Run Authorization Permits

The dry-run authorization gate authorizes **only**:

- One future synthetic live call for `synthetic_high_risk_widerspruch_deadline`
- Provider `openai`, model `gpt_4o_mini`, API model `gpt-4o-mini` only
- Source kind `synthetic_high_risk_legal_deadline_never_user_visible` only
- Metadata-only future capture
- Untrusted model output (must be marked untrusted)
- Post-call governance recheck
- Post-call audit

---

## 5. What Dry-Run Authorization Blocks

The dry-run authorization gate must NOT authorize:

- Real documents or public runtime
- User-visible output or persistence (DNA, offline, database)
- OCR/photo/file input
- Branch C or `runSmartTalk()`
- Exact deadline calculation
- Delivery date invention or final date invention
- Legal certainty or coercive legal instructions
- Repeated live calls (more than one)
- A live call without an active kill switch
- A live call without a single-call counter
- A live call without post-call governance recheck
- A live call without post-call audit

---

## 6. Why Widerspruch Deadline Is High Risk

1. **Relative deadline phrase** — "innerhalb eines Monats nach Bekanntgabe" requires a known Bekanntgabedatum.
2. **Missing delivery date** — The synthetic case deliberately omits this, making exact calculation impossible.
3. **Legal certainty trap** — Stating a specific date with confidence could cause real harm if wrong.
4. **Incomplete legal instruction** — Increases model uncertainty and hallucination risk.
5. **User harm if wrong** — Missed Widerspruch deadline results in irreversible rejection.

---

## 7. Delivery/Bekanntgabe Date Dependency

- `deliveryDateRequiredForExactDeadline: true`
- `exactDeadlineCalculationAuthorized: false`
- `deliveryDateInventionAuthorized: false`
- `finalDateInventionAuthorized: false`

These constraints are carried forward from 8.3Y through 8.3AB and must be verified at every gate.

---

## 8. Future One-Call Limit

`oneFutureLiveLlmCallOnly: true` — exactly one live call is authorized. A second call requires a new full governance chain from the beginning.

---

## 9. Future Kill Switch

`killSwitchRequiredForFutureCall: true` — the kill switch must be active before any live call begins. If the kill switch triggers, the call is aborted immediately and no output is stored.

---

## 10. Future Single-Call Counter

`singleCallCounterRequiredForFutureCall: true` — the counter must be active and must enforce the one-call limit. The counter increments atomically before the call is made; a counter value greater than one blocks the call.

---

## 11. Future Metadata-Only Capture

`metadataOnlyFutureCaptureRequired: true` — after any live call, only metadata (provider, model, call ID, timestamp, token counts, raw output availability flag) may be captured. No prompt text, no model output content, no user-visible data is stored.

---

## 12. Future Untrusted Model Output

`futureModelOutputMustBeMarkedUntrusted: true` — any output from the future live call must be marked `untrusted` immediately and must remain so until the post-call governance recheck explicitly clears it.

---

## 13. Future Governance Recheck

`futureGovernanceRecheckRequired: true` — a dedicated post-call governance recheck must verify metadata compliance before any downstream action is taken.

---

## 14. Future Post-Call Audit

`futurePostCallAuditRequired: true` — a dedicated post-call audit must independently verify the entire execution chain after the governance recheck.

---

## 15. Forbidden Behavior

In this phase and any future execution, the following are forbidden:

- Calculating or stating an exact Widerspruch deadline date
- Inventing a delivery or Bekanntgabe date
- Inventing a final Widerspruch deadline date
- Claiming legal certainty about the deadline
- Saying "you must file Widerspruch by [date]"
- Providing user-visible legal advice
- Logging or persisting prompt text or model output

---

## 16. What This Phase Does Not Authorize

- Real document input or public runtime
- User-visible output of any kind
- Persistence of any kind
- Real operator pilot execution
- Connected AI runtime execution
- Exact deadline calculation, delivery/final date invention, legal certainty, coercive instructions
- Branch C / `runSmartTalk()` / OCR runtime access
- Any live LLM call in this phase
- Final API prompt text in this phase

---

## 17. Runtime Isolation

The existing Vaylo Smart Talk live LLM runtime (Branch C, `run-smart-talk.ts`, OCR path) remains **explicitly isolated** from this dry-run authorization. This phase:

- Does not depend on Branch C at runtime
- Does not call `runSmartTalk()` or `extractTextFromImage()`
- Does not modify `app/api/smart-talk/route.ts`
- Does not modify `lib/vaylo/smart-talk/run-smart-talk.ts`
- Does not modify `lib/vaylo/smart-talk/extract-text-from-image.ts`
- Sets `branchCDependencyAllowed: false`, `runSmartTalkDependencyAllowed: false`, `ocrRuntimeDependencyAllowed: false`

---

## 18. Technical Debt Notes

1. **Broad ESLint pre-existing issues** — `scripts/sync-i18n.ts`, `scripts/verify-db-schema.ts`, and `run-manual-review-capture-model-check.ts` have known, pre-existing ESLint errors. Not blockers for 8.3AB. Tracked via `broadEslintDebtTracked: true`.

2. **Post-call cached metadata pattern** — Post-call phases (recheck, audit) should move to a supplied or cached metadata result pattern before stronger batch/runtime integration. Tracked via `postCallCachedMetadataDebtTracked: true`.

---

## 19. Tamper Rejection

The implementation defines **90 tamper cases** rejected by the local validator. Categories include:

- Execution plan prerequisite state (2)
- Identity fields (5: case, provider, model, apiModel, sourceKind)
- Array emptiness (4: scopes, requirements, blockers, checklist)
- Core dry-run literals (4)
- Future gate literals (7)
- Legal safety literals set to `true` (5)
- No-live-call literals set to `true` (4)
- Readiness flags incorrect (2)
- Dangerous readiness flags set to `true` (8 individually)
- Input isolation flags set to `true` (8 individually)
- Runtime isolation flags set to `true` (6 individually)
- Persistence/output flags set to `true` (6 individually)
- Debt tracking disabled (4)
- Acknowledgments missing (2)
- `contains*` flags set to `true` (10 individually)
- Forbidden string injection in notes (13 test strings)

---

## 20. Readiness Decision

| Flag | Value |
|---|---|
| `highRiskSyntheticLegalDeadlineDryRunAuthorizationAccepted` | `true` only on `allPassed` |
| `readyForHighRiskSyntheticLegalDeadlineLiveExecution` | `true` only on `allPassed` |
| `readyForLiveLLMRuntime` | `false` |
| `readyForConnectedAiRuntimeExecution` | `false` |
| `readyForRealOperatorPilotRun` | `false` |
| `readyForPilotRunNow` | `false` |
| `readyForPublicLaunch` | `false` |
| `readyForPersistence` | `false` |
| `readyForRealDocumentInput` | `false` |
| `readyForUserVisibleOutput` | `false` |

---

## 21. Next Phase

**Phase 8.3AC — High-Risk Synthetic Legal Deadline Live Execution**

This is the first phase in this governance chain that actually performs a live LLM call. It must:

- Verify 8.3AB dry-run authorization passed
- Activate the kill switch and single-call counter before calling
- Build the synthetic prompt (no real data, `[SYNTHETIC_AUTHORITY_FOR_TEST_ONLY]` marker, Widerspruch phrase present, Bekanntgabe date absent)
- Make exactly one call to `gpt-4o-mini` via OpenAI API
- Capture metadata only (no prompt text, no raw model output stored)
- Mark model output as untrusted immediately
- Enforce the kill switch and single-call counter
- Proceed to post-call governance recheck
