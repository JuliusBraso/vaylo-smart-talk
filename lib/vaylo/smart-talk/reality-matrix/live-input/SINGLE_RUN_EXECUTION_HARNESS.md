# PHASE 8.2L-2 — Single-Run Execution Harness

**Epoch:** 8.2L — Guarded Internal Controlled Pilot Execution
**Phase:** 8.2L-2
**Harness ID:** 8.2L-2
**Mode:** PURE HARNESS ONLY / NO REAL API CALL

---

## 1. Purpose

Simulate one guarded internal controlled pilot run in memory using synthetic
data only. The harness chains operator verification, synthetic request
construction, guarded runtime evaluation, and evidence validation — without
calling the API, reading env vars, or executing a real pilot.

---

## 2. What This Harness Simulates

One complete controlled execution packet lifecycle:

1. Operator environment verification (8.2L-1) passes
2. A synthetic request packet is constructed (metadata only)
3. Guarded runtime behavior is verified via the 8.2K-3 E2E harness
4. Evidence validation integration (8.2K-4) passes
5. Aggregate leak checks confirm no forbidden strings in safe result JSON
6. Safety invariants are verified across all sub-results
7. A single-run result is assembled in memory

---

## 3. What This Harness Does NOT Do

- Does **not** call `/api/smart-talk`
- Does **not** import or execute `app/api/smart-talk/route.ts`
- Does **not** make HTTP requests
- Does **not** read `process.env`
- Does **not** use real user input
- Does **not** call live LLM
- Does **not** persist anything
- Does **not** run a real pilot

---

## 4. Required Prerequisites

- `runGuardedPilotRuntimeClosureAudit()` — 8.2K-5 passed
- `runGuardedInternalControlledPilotExecutionPlanCheck()` — 8.2L-0 passed
- `runOperatorEnvironmentVerificationContractCheck()` — 8.2L-1 passed with
  `readyForSingleRunExecutionHarness: true`

---

## 5. Synthetic Request Policy

`SingleRunExecutionHarnessSyntheticRequest` contains:

- `pilotRunId`, `pilotScenarioId`, `pilotReviewerId` — identifiers only
- `syntheticInputLabel: "SYNTHETIC_SINGLE_RUN_INPUT_LABEL_ONLY"` — label only, not body text
- All `contains*` and `requested*` flags set to `false`
- `neverUserVisible: true`

No raw text, no redacted text, no document content, no secrets.

---

## 6. Step Sequence

| Step | ID | Source |
|------|-----|--------|
| 1 | `operator_environment_verification` | `runOperatorEnvironmentVerificationContractCheck()` |
| 2 | `synthetic_request_construction` | `buildSyntheticSingleRunExecutionRequest()` |
| 3 | `guarded_runtime_evaluation` | `runPilotRuntimeE2EHarness()` |
| 4 | `evidence_validation_integration` | `runPilotEvidenceValidationIntegration()` |
| 5 | `leak_check` | Aggregate JSON.stringify on safe result objects |
| 6 | `safety_invariant_check` | Cross-result safety flag verification |
| 7 | `single_run_result_assembly` | Final blocker aggregation |

---

## 7. Blockers (15)

`operator_environment_verification_failed` · `e2e_harness_failed` ·
`evidence_validation_integration_failed` · `synthetic_request_invalid` ·
`guarded_runtime_evaluation_failed` · `raw_text_leak_detected` ·
`secret_leak_detected` · `user_visible_output_detected` · `live_llm_detected` ·
`persistence_detected` · `dna_save_detected` · `offline_save_detected` ·
`public_runtime_detected` · `api_route_call_detected` · `http_call_detected`

---

## 8. Leak Checks

Safe result objects are serialised and checked for absence of:

**Raw text / PII / draft fields:**
`SYNTHETIC_TEXT_NEVER_REAL_USER_DATA` · `john@example.com` ·
`+49 170 1234567` · `rawInputText` · `redactedText` · `fullDraftText` ·
`modelOutput`

**Secrets:**
`synthetic-secret-never-real` · `apiKey` · `internalSecret`

---

## 9. Safety Invariants

All literal types on `SingleRunExecutionHarnessResult`:

| Invariant | Value |
|-----------|-------|
| `readyForPilotRunNow` | false |
| `readyForPublicLaunch` | false |
| `readyForLiveLLMRuntime` | false |
| `readyForPersistence` | false |
| `realEnvValuesRead` | false |
| `envValuesStored` | false |
| `secretValuesStored` | false |
| `secretValuesPrinted` | false |
| `httpCallMade` | false |
| `apiRouteCalled` | false |
| `liveLLMCalled` | false |
| `persistenceUsed` | false |
| `emittedToUserNow` | false |
| `neverUserVisible` | true |

---

## 10. Readiness Decision

```
status: completed_synthetic_single_run  (when blockers.length === 0)
readyForManualReviewCaptureModel: true    (when blockers.length === 0)
readyForPilotRunNow:               false  (literal — permanent)
readyForPublicLaunch:              false  (literal — permanent)
readyForLiveLLMRuntime:            false  (literal)
readyForPersistence:               false  (literal)
```

---

## 11. Next Phase

**8.2L-3 — Manual Review Capture Model**

Define the in-memory structure for capturing manual reviewer verdicts after
a synthetic single-run execution. Requires
`runSingleRunExecutionHarness().readyForManualReviewCaptureModel === true`.
