# PHASE 8.2L-0 — Guarded Internal Controlled Pilot Execution Plan

**Epoch:** 8.2L — Guarded Internal Controlled Pilot Execution
**Plan ID:** 8.2L-0
**Version:** guarded-internal-controlled-pilot-execution-plan-v1
**Mode:** PLANNING ONLY / NO PILOT RUN

---

## 1. Purpose

This phase creates the formal execution plan for the first guarded internal
controlled pilot run of the Smart Talk reality matrix pipeline.

It defines the operator checklist, required environment variable names,
allowed run boundary, single-run execution sequence, manual review protocol,
abort criteria, evidence capture rules, and the ordered next phases.

**It does not execute the pilot.**

---

## 2. Why 8.2L Can Begin

8.2L begins because 8.2K-5 (`runGuardedPilotRuntimeClosureAudit`) produced:

```
verdict:                         "closed_with_warnings"
blockers:                        []
readyForControlledPilotExecution: true
readyForPublicLaunch:             false
readyForLiveLLMRuntime:           false
readyForPersistence:              false
```

`readyForControlledPilotExecution: true` is the gate that unlocks planning
for the first controlled pilot run. It does not unlock execution by itself.

---

## 3. What 8.2L-0 Does

- Creates `GuardedInternalControlledPilotExecutionPlan` type and
  `GUARDED_INTERNAL_CONTROLLED_PILOT_EXECUTION_PLAN_V1` constant.
- Documents the operator checklist, env var names, abort criteria, and
  next phases as type-safe literals.
- Creates an optional pure TypeScript plan check function
  (`runGuardedInternalControlledPilotExecutionPlanCheck`) that verifies
  the plan and 8.2K-5 closure audit are consistent, without running
  the pilot.

---

## 4. What 8.2L-0 Does NOT Do

- Does **not** execute the pilot.
- Does **not** call `/api/smart-talk`.
- Does **not** call any live LLM.
- Does **not** verify real environment variable values (names only).
- Does **not** print or store secrets.
- Does **not** enable public launch.
- Does **not** enable live LLM runtime.
- Does **not** enable persistence.
- Does **not** modify `app/api/smart-talk/route.ts`.
- Does **not** touch UI.

Operator environment verification belongs to **8.2L-1**.
Actual pilot execution belongs to **8.2L-2**.

---

## 5. Execution Scope

The 8.2L epoch is bounded to:

| Scope item | Meaning |
|---|---|
| `operator_only_execution` | Only designated internal operators may trigger a run |
| `single_controlled_run` | One run per operator session; no batch or loop |
| `controlled_text_pilot_guarded_mode_only` | Only `controlled_text_pilot_guarded` mode is permitted |
| `synthetic_or_operator_supplied_test_text_only` | No real user documents or real sensitive data |
| `no_public_runtime` | Not reachable by public or anonymous users |
| `no_live_llm_runtime` | No live OpenAI / Gemini / Anthropic call |
| `no_persistence` | Evidence records are not persisted |
| `no_dna_save` | No DNA writes |
| `no_offline_save` | No offline writes |
| `no_photo_ocr` | No OCR or image processing |
| `no_file_upload` | No document upload processing |
| `no_payment` | No payment logic triggered |
| `manual_review_required` | Every run requires a named human reviewer |
| `post_execution_audit_required` | Every run must produce a post-execution audit record |

---

## 6. Required Closure Audit Condition

Before any 8.2L phase may proceed:

```
runGuardedPilotRuntimeClosureAudit().verdict        === "closed_with_warnings"
runGuardedPilotRuntimeClosureAudit().blockers.length === 0
runGuardedPilotRuntimeClosureAudit().readyForControlledPilotExecution === true
```

This is verified by `runGuardedInternalControlledPilotExecutionPlanCheck()`.

---

## 7. Required Environment Variables

The following environment variable **names** must be operator-verified before
execution. This plan records their names only. Actual values are never
printed, stored, or evaluated by this module.

| Variable name | Purpose |
|---|---|
| `VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME` | Master feature flag — must be `"true"` |
| `VAYLO_ENABLE_CONTROLLED_TEXT_PILOT` | Controlled text pilot flag — must be `"true"` |
| `VAYLO_CONTROLLED_TEXT_PILOT_KILL_SWITCH` | Kill switch — must be absent or `"false"` |
| `VAYLO_INTERNAL_RUNTIME_SECRET` | Internal secret header value — must be set |
| `VAYLO_CONTROLLED_TEXT_PILOT_ALLOWLIST` | Comma-separated account ID allowlist |
| `VAYLO_CONTROLLED_TEXT_PILOT_SCENARIO_ALLOWLIST` | Comma-separated scenario ID allowlist |

Verification that these are correctly configured belongs to **8.2L-1**.

---

## 8. Operator Verification Checklist

The operator must confirm each item before any execution attempt:

| # | Item | Description |
|---|---|---|
| 1 | `confirm_current_git_commit` | Record the exact git commit SHA before the run |
| 2 | `confirm_vercel_or_local_target` | Confirm target is a controlled internal environment |
| 3 | `confirm_no_public_testers` | Confirm no public or external users have access |
| 4 | `confirm_internal_operator_identity` | Operator is an identified, named internal team member |
| 5 | `confirm_internal_reviewer_allowlisted` | The reviewer's account ID is in the allowlist |
| 6 | `confirm_pilot_scenario_allowlisted` | The target scenario is in the scenario allowlist |
| 7 | `confirm_guard_phrase_available` | The exact guard phrase is available and correct |
| 8 | `confirm_no_real_sensitive_document` | Input is synthetic or non-sensitive operator text only |
| 9 | `confirm_no_secret_printing` | No secrets will be logged or printed |
| 10 | `confirm_no_persistence` | No evidence records will be written to storage |
| 11 | `confirm_no_live_llm` | Live LLM will not be called in this phase |
| 12 | `confirm_no_dna_save` | No DNA save will occur |
| 13 | `confirm_no_offline_save` | No offline save will occur |
| 14 | `confirm_abort_on_unexpected_user_visible_output` | Abort immediately if any UI output is observed |
| 15 | `confirm_abort_on_any_raw_text_echo` | Abort if input text appears in any response payload |
| 16 | `confirm_abort_on_any_secret_echo` | Abort if any secret value appears in any response payload |
| 17 | `confirm_post_execution_audit_required` | A post-execution audit record must be produced |

---

## 9. Single Controlled Run Boundary

Each pilot execution attempt is bounded to:

- **One request** per operator session
- **One scenario** from the approved scenario allowlist
- **One operator** who is named and allowlisted
- **One named reviewer** assigned before the run
- **One pre-declared pilot run ID** (`pilotRunId`) unique per attempt
- **Fail-closed** on any guard failure — no retry without a new operator session
- **Immediate abort** if any abort criterion is triggered (see section 13)

---

## 10. Allowed Input Policy

During a controlled pilot run, allowed inputs are:

- Synthetic test text created by the operator specifically for the pilot
- Short, non-sensitive operator-composed questions about non-sensitive topics
- Text matching an approved pilot scenario from the scenario allowlist
- Text that would not constitute real personal data, real legal documents,
  or real sensitive information

---

## 11. Forbidden Input Policy

The following inputs are **absolutely forbidden** in any pilot run:

- Real user documents (Schufa, employment contracts, tax notices, leases, etc.)
- Real personal data (names, addresses, dates of birth, IBAN, insurance numbers)
- Real sensitive questions from actual users
- Photos or scanned images of any kind
- File uploads of any kind
- Inputs containing real secrets, API keys, or credentials
- Inputs from external or public users

---

## 12. Manual Review Requirement

Every pilot run requires:

1. A **named reviewer** assigned before the run begins.
2. The reviewer's account ID must be in the operator allowlist.
3. The reviewer must inspect the raw API response (not user-visible output).
4. The reviewer must confirm:
   - No raw input text was echoed in the response
   - No secret values appeared in the response
   - No user-visible content was produced
   - All safety flags (`liveLLMCalled`, `persistenceUsed`, etc.) are `false`
5. The reviewer must produce a review verdict for the post-execution audit.

---

## 13. Abort Criteria

Any of the following conditions triggers an **immediate abort** of the pilot
run. The run must not be retried until the cause is identified and resolved:

| Abort criterion | Trigger condition |
|---|---|
| `closure_audit_not_ready` | `runGuardedPilotRuntimeClosureAudit().readyForControlledPilotExecution !== true` |
| `missing_required_env` | Any required env var is absent or misconfigured |
| `kill_switch_enabled` | `VAYLO_CONTROLLED_TEXT_PILOT_KILL_SWITCH` is `"true"` |
| `internal_secret_missing_or_unverified` | `VAYLO_INTERNAL_RUNTIME_SECRET` not set or invalid |
| `operator_not_allowlisted` | Operator account ID not in the allowlist |
| `scenario_not_allowlisted` | Scenario ID not in the scenario allowlist |
| `unexpected_live_llm_call` | Any live LLM API is invoked during the run |
| `unexpected_persistence` | Any database or storage write occurs |
| `unexpected_dna_save` | Any DNA save is triggered |
| `unexpected_offline_save` | Any offline save is triggered |
| `unexpected_user_visible_output` | Any user-facing content is rendered |
| `raw_text_echo_detected` | Input text appears in the API response payload |
| `secret_echo_detected` | Any secret value appears in the API response payload |
| `public_runtime_path_used` | The request reaches the non-guarded public API path |
| `non_internal_request_used` | Request originates from a non-internal origin |
| `manual_reviewer_unavailable` | No named reviewer is available before the run |

---

## 14. No Persistence / No DNA / No Offline Save Rule

Evidence records produced during a pilot run are **in-memory only**:

- They are not written to Supabase or any other database.
- They are not saved to DNA.
- They are not saved offline.
- They may be inspected by the reviewer in memory only.
- Persistence requires a dedicated future phase audit.

---

## 15. No Public Runtime Rule

The guarded pilot runtime branch is only reachable when all of the following
are true simultaneously:

- `VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME === "true"`
- `VAYLO_ENABLE_CONTROLLED_TEXT_PILOT === "true"`
- Kill switch is absent or `"false"`
- Internal secret header matches `VAYLO_INTERNAL_RUNTIME_SECRET`
- Guard phrase matches exactly
- Requester is in the allowlist

The standard public Smart Talk API path is unaffected. No code path change
allows a public user to reach the guarded branch.

---

## 16. No Live LLM Rule

Live LLM calls are **blocked** in the current guarded pilot runtime branch.
The 8.2K-2 API branch explicitly blocks `requestedLiveLLM` and the
`live_llm_not_allowed` guard fails the request. Any unexpected LLM call
is an immediate abort criterion.

Live LLM integration requires a dedicated future epoch with its own plan,
contracts, harness, and closure audit.

---

## 17. Post-Execution Audit Requirement

After every pilot run attempt (successful or aborted), the operator must
produce a post-execution audit record containing:

- `pilotRunId` (pre-declared before the run)
- `scenarioId`
- Git commit SHA at time of run
- Operator identity (account ID, not name)
- Reviewer identity (account ID, not name)
- Response kind received
- All safety flag values from the API response
- Reviewer verdict
- Any abort criterion triggered
- Timestamp of attempt

This record is in-memory only and reviewed manually. It is not persisted
until a persistence phase is audited and closed.

Formal post-execution audit capture belongs to **8.2L-3** and **8.2L-4**.

---

## 18. Ordered Next Phases

| Phase | Description |
|---|---|
| **8.2L-1** | Operator environment verification contract — defines the formal verification checklist and produces a typed operator verification result |
| **8.2L-2** | Single-run execution harness — pure TypeScript harness that simulates the guarded API request/response sequence without making live HTTP calls |
| **8.2L-3** | Manual review capture model — defines the structure of the in-memory post-execution review record |
| **8.2L-4** | Post-execution audit — formal audit of the pilot run result against all 8.2L invariants |
| **8.2L-5** | Controlled pilot execution closure — closes the 8.2L epoch if all phases pass |

---

## 19. Exit Criteria for 8.2L-0

Phase 8.2L-0 is complete when:

- `GUARDED_INTERNAL_CONTROLLED_PILOT_EXECUTION_PLAN_V1` exists with `planId === "8.2L-0"`
- `status === "ready_for_phase_8_2l_1"`
- All 14 execution scope items are listed
- All 12 prerequisites are listed
- All 6 required env var names are listed
- All 17 operator checklist items are listed
- All 16 abort criteria are listed
- All 5 next phases are listed in order
- `readyForPilotRunNow === false`
- `readyForOperatorEnvVerification === true`
- `readyForPublicLaunch === false`
- `readyForLiveLLMRuntime === false`
- `readyForPersistence === false`
- TypeScript and ESLint pass (or manual audit confirms no issues)
- No pilot was executed
- No API route was modified
- No HTTP calls were made
- No live LLM was called
- No persistence was added

---

## Update — Phase 8.2L-1

Phase 8.2L-1 defines the operator environment verification contract.
It uses attestations and boolean operator confirmations only — it does not
read real environment variable values, print secrets, or execute the pilot.
Passing the synthetic verification sets `readyForSingleRunExecutionHarness: true`.
