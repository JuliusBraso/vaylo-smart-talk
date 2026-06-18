# Phase 8.3V — Additional Synthetic Live LLM Case Live Execution

## 1. Purpose

This phase performs exactly one synthetic live LLM call for `synthetic_explicit_payment_deadline` if `OPENAI_API_KEY` is present. If the key is absent, execution is blocked safely without fake success. The phase captures metadata only, marks model output as untrusted, and discards the output after receipt confirmation.

**This phase performs exactly one synthetic live LLM call if OPENAI_API_KEY is present.**
**If OPENAI_API_KEY is missing, execution is blocked safely.**
**This phase does not authorize real payment notices, invoices, Mahnungen, or real documents.**
**Prompt text and model output are not logged, stored, returned, displayed, or persisted.**
**Public runtime and user-visible output remain blocked.**

## 2. Selected Synthetic Case

| Field            | Value                                      |
|------------------|--------------------------------------------|
| Case ID          | `synthetic_explicit_payment_deadline`      |
| Provider         | `openai`                                   |
| Model            | `gpt_4o_mini` (API: `gpt-4o-mini`)         |
| Execution mode   | `one_synthetic_payment_deadline_live_call` |
| Previous phase   | 8.3U (Additional Synthetic Live LLM Case Dry-Run Authorization) |

## 3. One-Call Execution Boundary

| Invariant                                 | Value   |
|-------------------------------------------|---------|
| `killSwitchArmedBeforeCall`               | `true`  |
| `killSwitchDisarmedAfterCall`             | `true`  |
| `singleCallCounterBefore`                 | `0`     |
| `singleCallCounterAfter`                  | `1`     |
| `callCount`                               | `1`     |
| `liveLLMCallPerformed`                    | `true`  |
| `modelOutputMarkedUntrusted`              | `true`  |
| `metadataOnlyCaptured`                    | `true`  |
| `postCallGovernanceRecheckRequired`       | `true`  |
| `postCallAuditRequired`                   | `true`  |
| `apiKeyValueLogged`                       | `false` |
| `apiKeyValueReturned`                     | `false` |
| `promptTextLogged`                        | `false` |
| `promptTextStored`                        | `false` |
| `promptTextReturned`                      | `false` |
| `modelOutputLogged`                       | `false` |
| `modelOutputStored`                       | `false` |
| `modelOutputReturned`                     | `false` |
| `userVisibleOutputEmitted`                | `false` |
| `persistenceUsed`                         | `false` |
| `neverUserVisible`                        | `true`  |

## 4. What This Phase Executes

When `OPENAI_API_KEY` is present and all prerequisites pass:

1. `performOneAdditionalSyntheticPaymentOpenAiCall()` is called exactly once.
2. The synthetic prompt is built in memory from `buildSyntheticPromptForExplicitPaymentDeadlineCase()` — a fully synthetic German-style payment notice with no real data.
3. `fetch("https://api.openai.com/v1/chat/completions")` is called exactly once with `model: "gpt-4o-mini"`, `temperature: 0`, `max_tokens: 300`.
4. If the response is OK and contains a non-empty assistant message, `modelOutputReceived: true` is set.
5. Response content is immediately discarded — only the boolean receipt fact is retained.
6. Metadata only is captured (no prompt text, no model output content).
7. Model output is marked untrusted.
8. Post-call governance recheck (next phase) and post-call audit (following phase) are required.

If `OPENAI_API_KEY` is absent:
- `performOneAdditionalSyntheticPaymentOpenAiCall()` returns `{ apiKeyPresent: false, callPerformed: false, modelOutputReceived: false }`.
- The execution input is built with `callPerformed: false`, triggering `status: "blocked"`.
- No fake success is reported.

## 5. What This Phase Does Not Authorize

- Any real document input.
- Any public runtime access.
- Any general live LLM runtime activation.
- Any additional live LLM calls (beyond exactly one).
- Any real operator pilot run.
- Any persistence of data.
- Any user-visible output.
- Any call via Branch C, `runSmartTalk()`, or `extractTextFromImage()`.
- Any real payment notice, invoice, Mahnung, or real document processing.

## 6. Prompt Policy

The synthetic prompt (`buildSyntheticPromptForExplicitPaymentDeadlineCase()`) is:

- Entirely synthetic — no real persons, authorities, IBANs, Steuer-IDs, or Aktenzeichen.
- Marks the document as a governance test only.
- Specifies a synthetic authority: `SYNTHETISCHE STELLE TESTBEHOERDE`.
- Uses a synthetic amount (`123,45 EUR`) and a far-future deadline (`31.12.2099`).
- Instructs the model to:
  1. Report amount and deadline only as document-stated information.
  2. Not claim legal certainty.
  3. Not invent additional deadlines.
  4. Avoid coercive "you must pay" wording.
  5. Preserve uncertainty around consequences.
  6. Recommend checking the complete document context.
  7. Treat output as untrusted — to be discarded after metadata capture.

The prompt is constructed in memory only — it is never logged, stored, returned, or persisted.

## 7. API Key Handling

- `process.env.OPENAI_API_KEY` is read into a local const for presence check and `Authorization` header use only.
- The value is never logged, returned, or included in metadata.
- If absent: execution is blocked safely.

## 8. Metadata-Only Capture

The following boolean metadata fields are captured:

`apiKeyPresenceConfirmed`, `modelOutputMarkedUntrusted`, `metadataOnlyCaptured`, `callCount`, `singleCallCounterBefore`, `singleCallCounterAfter`, `killSwitchArmedBeforeCall`, `killSwitchDisarmedAfterCall`, and all `false` confirmations for prompt/output logging/storage/return.

No prompt text content and no model output content is captured, returned, or stored.

## 9. Model Output Handling

- Model output is received as a raw response.
- `modelOutputReceived: boolean` — only the boolean fact of receipt.
- `modelOutputMarkedUntrusted: true` — all output is treated as untrusted.
- Response content is immediately discarded.
- Output is never logged, stored, returned, displayed, or persisted.

## 10. Runtime Isolation

| Component                                | Status       |
|------------------------------------------|--------------|
| `app/api/smart-talk/route.ts` (Branch C) | Blocked (`branchCCalled: false`) |
| `lib/vaylo/smart-talk/run-smart-talk.ts` | Blocked (`runSmartTalkCalledOrImported: false`) |
| `lib/vaylo/smart-talk/extract-text-from-image.ts` | Blocked (`extractTextFromImageCalledOrImported: false`) |

No LLM SDK is imported. `fetch` is used directly once.

## 11. Public / Runtime / Persistence Blocks

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
| `userVisibleOutputAuthorizedByExecution` | `false` |

## 12. Tamper Rejection

The implementation runs 90+ tamper cases covering:

- `dryRunAuthorizationReadyForLiveExecution: false` → "blocked"
- Wrong selectedCase, provider, model, executionMode → "rejected"
- Missing any required list (steps, metadata fields, observations, blockers, checklist) → "rejected"
- `killSwitchArmedBeforeCall: false`, `killSwitchDisarmedAfterCall: false` → "rejected"
- `singleCallCounterBefore: 1`, `singleCallCounterAfter: 2` → "rejected"
- `callCount: 0` (with live call performed), `callCount: 2` → "rejected"
- `apiKeyPresenceChecked: false` → "blocked"
- `apiKeyValueLogged: true`, `apiKeyValueReturned: true` → "rejected"
- `promptTextLogged: true`, `promptTextStored: true`, `promptTextReturned: true` → "rejected"
- `liveLLMCallPerformed: false` → "blocked"
- `modelOutputReceived: false` → "blocked"
- `modelOutputMarkedUntrusted: false`, `modelOutputLogged: true`, `modelOutputStored: true`, `modelOutputReturned: true` → "rejected"
- `metadataOnlyCaptured: false`, `postCallGovernanceRecheckRequired: false`, `postCallAuditRequired: false` → "rejected"
- `syntheticInputOnly: false`, all real/raw/redacted/OCR/file/public/real-document flags `true` → "rejected"
- All Branch C / runSmartTalk / OCR dependency and call flags `true` → "rejected"
- `userVisibleOutputEmitted: true`, `userVisibleOutputAuthorizedByExecution: true` → "rejected"
- All persistence / public / pilot flags `true` → "rejected"
- Missing acknowledgments → "rejected"
- All `contains*` flags `true` → "rejected"
- Notes with forbidden strings (106 total), PII patterns, secrets, unsafe markers → "rejected"
- `neverUserVisible: false` → "rejected"

All tamper cases must be rejected (`accepted: false`) for `allPassed: true`.

## 13. Readiness Decision

| Flag | Value when mainPassed |
|------|-----------------------|
| `readyForAdditionalSyntheticLiveLlmCasePostCallGovernanceRecheck` | `true` |
| `readyForAdditionalSyntheticLiveLlmCasePostCallAudit` | `true` |
| `liveLLMCalled` | `true` |
| `liveLLMCalledExactlyOnce` | `true` |
| All dangerous readiness | `false` |

When `OPENAI_API_KEY` is missing: `allPassed: true` still if prerequisites and tamper cases pass, but `readyForAdditionalSyntheticLiveLlmCasePostCallGovernanceRecheck` and `readyForAdditionalSyntheticLiveLlmCasePostCallAudit` will be `false` since `mainPassed: false` (blocked).

## 14. Next Phase

**Phase 8.3W — Additional Synthetic Live LLM Case Post-Call Governance Recheck**

Calls `runAdditionalSyntheticLiveLlmCaseLiveExecution()`, verifies `readyForAdditionalSyntheticLiveLlmCasePostCallGovernanceRecheck: true`, and performs a metadata-only recheck of the live execution result. Follows the same pattern as Phase 8.3P.
