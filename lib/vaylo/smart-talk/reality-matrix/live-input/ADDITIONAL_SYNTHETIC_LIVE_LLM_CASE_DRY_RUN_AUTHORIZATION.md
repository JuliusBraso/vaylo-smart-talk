# Phase 8.3U — Additional Synthetic Live LLM Case Dry-Run Authorization

## 1. Purpose

This phase creates a pure TypeScript dry-run authorization layer that verifies the 8.3T execution plan and issues a single positive gate (`readyForAdditionalSyntheticLiveLlmCaseLiveExecution: true`) permitting exactly one future synthetic live LLM call in the next phase for `synthetic_explicit_payment_deadline`.

**This phase does not call a live LLM.**
**This phase authorizes only the next phase to execute exactly one synthetic live LLM call.**
**This phase does not authorize real payment notices, invoices, Mahnungen, or real documents.**
**Public runtime and user-visible output remain blocked.**

## 2. Selected Synthetic Case

| Field            | Value                              |
|------------------|------------------------------------|
| Case ID          | `synthetic_explicit_payment_deadline` |
| Provider         | `openai`                           |
| Model            | `gpt_4o_mini`                      |
| Previous phase   | 8.3T (Additional Synthetic Live LLM Case Execution Plan) |

## 3. Dry-Run Authorization-Only Boundary

| Invariant                                              | Value   |
|--------------------------------------------------------|---------|
| `dryRunAuthorizationOnly`                              | `true`  |
| `liveLLMCalledInDryRunAuthorization`                   | `false` |
| `additionalLiveLLMCallsExecuted`                       | `false` |
| `promptTextConstructedNow`                             | `false` |
| `promptTextAvailableInDryRunAuthorization`             | `false` |
| `modelOutputAvailableInDryRunAuthorization`            | `false` |
| `promptTextLogged`                                     | `false` |
| `modelOutputLogged`                                    | `false` |
| `readyForRealDocumentInput`                            | `false` |
| `readyForPublicLaunch`                                 | `false` |
| `persistenceUsed`                                      | `false` |
| `userVisibleOutputEmitted`                             | `false` |
| `neverUserVisible`                                     | `true`  |

## 4. What This Phase Authorizes

When all checks pass (`allPassed: true`), this phase sets:

| Flag                                                     | Value  |
|----------------------------------------------------------|--------|
| `readyForAdditionalSyntheticLiveLlmCaseLiveExecution`   | `true` |
| `additionalSyntheticCaseDryRunAuthorizationAccepted`    | `true` |
| `authorizeExactlyOneSyntheticCaseCallNextPhase`          | `true` |
| `futureLiveExecutionRequired`                            | `true` |
| `metadataOnlyCaptureRequired`                            | `true` |
| `postCallGovernanceRecheckRequired`                      | `true` |
| `postCallAuditRequired`                                  | `true` |

This grants the next phase permission to perform **exactly one** synthetic live LLM call for `synthetic_explicit_payment_deadline` under the following conditions:
- Kill switch must be armed.
- Single-call counter must be at zero before the call.
- Prompt text is constructed only in the next phase (not here).
- Metadata only is captured; no prompt or model output is logged or returned.
- Post-call governance recheck is required after execution.
- Post-call audit is required after the recheck.

## 5. What This Phase Does Not Authorize

- Any real document input.
- Any public runtime access.
- Any general live LLM runtime activation.
- Any real operator pilot run.
- Any persistence of data.
- Any user-visible output.
- More than one live LLM call total for this case.
- Any call via Branch C, `runSmartTalk()`, or `extractTextFromImage()`.

## 6. Execution Plan Dependency

This phase calls `runAdditionalSyntheticLiveLlmCaseExecutionPlan()` (8.3T) and verifies:

- `allPassed: true`
- `readyForAdditionalSyntheticLiveLlmCaseDryRunAuthorization: true`
- `additionalSyntheticCaseExecutionPlanAccepted: true`
- `executionPlanOnly: true`
- `futureDryRunAuthorizationRequired: true`
- `liveLLMCalledInExecutionPlan: false`
- `promptTextConstructedNow: false`
- `promptTextAvailableInExecutionPlan: false`
- `modelOutputAvailableInExecutionPlan: false`
- All dangerous readiness and isolation flags confirmed `false`.

If the 8.3T prerequisite fails, this phase returns `status: "blocked"`.

## 7. Future Live Execution Requirements

The next phase (8.3V) must satisfy all of the following before calling the live LLM:

1. This dry-run authorization gate: `readyForAdditionalSyntheticLiveLlmCaseLiveExecution: true`.
2. Kill switch armed (`killSwitchRequiredForFutureCall: true`).
3. Single-call counter verified at zero before the call (`singleCallCounterRequiredForFutureCall: true`).
4. Exactly one call only (`oneFutureLiveLlmCallOnly: true`).
5. Prompt construction occurs inside the next phase only.
6. Metadata-only capture — no prompt or model output logged or stored.
7. Post-call governance recheck (metadata-only) must occur after execution.
8. Post-call audit must occur after the recheck.

## 8. Runtime Isolation

The following existing components are explicitly isolated and must not be called:

| Component                                | Status       |
|------------------------------------------|--------------|
| `app/api/smart-talk/route.ts` (Branch C) | Blocked (`branchCCalled: false`) |
| `lib/vaylo/smart-talk/run-smart-talk.ts` | Blocked (`runSmartTalkCalledOrImported: false`) |
| `lib/vaylo/smart-talk/extract-text-from-image.ts` | Blocked (`extractTextFromImageCalledOrImported: false`) |

## 9. Public / Runtime / Persistence Blocks

All of the following remain permanently blocked:

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

## 10. Tamper Rejection

The implementation runs 100+ tamper cases covering:

- `executionPlanReady: false` → "blocked"
- Missing any required scope, gate, or checklist item → "rejected"
- Wrong selectedCase, provider, model, or invalid authorizationDecision (`"reject"`) → "rejected"
- `dryRunAuthorizationOnly: false`, `authorizeExactlyOneSyntheticCaseCallNextPhase: false`, `futureLiveExecutionRequired: false`, `oneFutureLiveLlmCallOnly: false`, `killSwitchRequiredForFutureCall: false`, `singleCallCounterRequiredForFutureCall: false` → "rejected"
- `liveLLMCalledInDryRunAuthorization: true`, `additionalLiveLLMCallsExecuted: true` → "rejected"
- Either positive gate set to `false` → "rejected"
- Any dangerous readiness flag set to `true` → "rejected"
- `promptTextConstructedNow: true`, prompt/output available or logged → "rejected"
- `metadataOnlyCaptureRequired: false`, `postCallGovernanceRecheckRequired: false`, `postCallAuditRequired: false` → "rejected"
- `syntheticInputOnly: false`, any real/raw/redacted/OCR/file/public input flag `true` → "rejected"
- Any Branch C / runSmartTalk / OCR dependency or call flag `true` → "rejected"
- Any persistence / public / pilot flag `true` → "rejected"
- Missing required acknowledgment statements → "rejected"
- Any `contains*` flag `true` → "rejected"
- Notes containing forbidden strings (97 total), PII patterns, secrets, or unsafe markers → "rejected"
- `neverUserVisible: false` → "rejected"

All tamper cases must be rejected for `allPassed: true`.

## 11. Readiness Decision

| Flag                                                     | Value when allPassed |
|----------------------------------------------------------|----------------------|
| `readyForAdditionalSyntheticLiveLlmCaseLiveExecution`   | `true`               |
| `additionalSyntheticCaseDryRunAuthorizationAccepted`    | `true`               |
| All dangerous readiness flags                            | `false`              |

## 12. Next Phase

**Phase 8.3V — Additional Synthetic Live LLM Case Live Execution**

Calls `runAdditionalSyntheticLiveLlmCaseDryRunAuthorization()`, verifies `readyForAdditionalSyntheticLiveLlmCaseLiveExecution: true`, and performs exactly one live LLM call for `synthetic_explicit_payment_deadline` via a dedicated synthetic single-call execution function. Follows the same pattern as Phase 8.3O.
