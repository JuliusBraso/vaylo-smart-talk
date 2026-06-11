# Guarded Internal Pilot Runtime Implementation Plan — Phase 8.2K-0

**Status:** Planning only. No runtime is implemented. No API/UI/LLM/persistence is touched.  
**Plan ID:** `8.2K-0`  
**Constant:** `GUARDED_INTERNAL_PILOT_RUNTIME_IMPLEMENTATION_PLAN_V1`  
**Previous epoch:** 8.2J — Controlled Text Pilot Readiness (closed with warnings)

---

## 1. Purpose

This plan defines what the 8.2K epoch must implement, what contracts it must define first, what guards must be wired before any request is processed, and what the ordered implementation phases are. It does not implement anything.

8.2K is the epoch where guarded internal pilot runtime becomes real code — but only after each phase's contract, guard layer, and harness have been planned and proven in sequence.

---

## 2. What 8.2J Closed

- **8.2J-0** — Controlled Text Pilot Readiness Plan (`CONTROLLED_TEXT_PILOT_READINESS_PLAN_V1`).
- **8.2J-1** — Pilot Scenario Set (12 synthetic scenarios, pass/warning/human_review/block categories).
- **8.2J-2** — Guarded Internal Pilot Runtime Switch Plan (16 activation rules, guard phrase, kill switch).
- **8.2J-3** — Manual Safety Test Protocol (24-item checklist, prohibited evidence fields).
- **8.2J-4** — Pilot Evidence Record Model (`PilotEvidenceRecord`, `validatePilotEvidenceRecord`).
- **8.2J-5** — Controlled Text Pilot Readiness Closure Audit (`closed_with_warnings`; `readyForControlledTextPilotPlanningClosure: true`).

What 8.2J did NOT do:
- Wire any runtime.
- Modify the API route.
- Process actual user input.
- Persist anything.

---

## 3. What 8.2K Is Allowed to Implement Later

Across 8.2K-1 through 8.2K-5:

- **Typed runtime contracts** for pilot requests, responses, guard results, and failure results (8.2K-1).
- **A guarded internal-only branch** in the existing API route handler, firing only when all 16 guards pass (8.2K-2).
- **An end-to-end proof harness** that verifies the full guard → redaction → adapter → output contract → wording gate → assembler → authorisation → evidence validation chain with synthetic fixtures (8.2K-3).
- **Evidence validation integration** wiring `validatePilotEvidenceRecord` into the branch output path (8.2K-4).
- **Runtime closure audit** verifying all contracts, guards, harness results, and evidence validation before the runtime is considered safe (8.2K-5).

Each phase must be explicitly planned and have its own guard proof before the next begins.

---

## 4. What 8.2K-0 Does NOT Implement

- No API route change.
- No UI change.
- No live LLM call.
- No persistence.
- No DNA save, offline save.
- No real user input processed.
- No pilot runtime wired.
- Public launch remains blocked.
- `readyForRuntimeImplementation: false`.
- `readyForApiRouteModification: false`.

---

## 5. Implementation Scope

The guarded internal pilot runtime is bounded by these scope items — all must be in place before 8.2K-5 closure:

| Scope Item | Description |
|---|---|
| `guarded_internal_api_branch` | A new conditional branch in the route handler, behind all 16 guards |
| `controlled_text_pilot_mode_only` | Branch activates only for `internalRuntimeMode: "controlled_text_pilot_guarded"` |
| `pilot_scenario_allowlist_runtime_check` | `pilotScenarioId` must be in the 12-scenario set at runtime |
| `internal_secret_header_check` | `x-vaylo-internal-runtime-secret` header matched against env var |
| `internal_guard_phrase_check` | `internalRuntimeGuard` field matched against required phrase |
| `kill_switch_runtime_check` | `VAYLO_CONTROLLED_TEXT_PILOT_KILL_SWITCH` checked before any processing |
| `no_public_runtime` | Guard actively rejects any non-pilot mode request |
| `no_persistence_runtime` | No DB write initiated by the branch under any condition |
| `no_dna_save_runtime` | DNA save path remains unreachable from the branch |
| `no_offline_save_runtime` | Offline save path remains unreachable from the branch |
| `no_live_llm_until_future_guarded_phase` | Live LLM calls are not wired in 8.2K |
| `manual_evidence_record_validation_boundary` | Branch output passes through `validatePilotEvidenceRecord` before being returned |

---

## 6. Required Runtime Contracts

These typed contracts must be defined in 8.2K-1 before the API branch is written in 8.2K-2:

| Contract | Purpose |
|---|---|
| `pilot_request_contract` | Typed shape for inbound pilot requests (all required fields, literal-type safety flags) |
| `pilot_response_contract` | Typed shape for pilot responses (no user-visible content; governance metadata only) |
| `pilot_runtime_guard_result` | Typed result from the guard chain (which guards passed/failed, failure verdict) |
| `pilot_failure_result` | Typed result for any rejected request (verdict, diagnostic, no raw content) |
| `pilot_evidence_validation_result` | Typed wrapper connecting pipeline output to `validatePilotEvidenceRecord` |
| `pilot_no_persistence_result` | Typed assertion that no persistence was attempted during the run |
| `pilot_runtime_closure_audit_result` | Typed result for the 8.2K-5 runtime closure audit |

---

## 7. Required Runtime Guards (16)

Guards are evaluated in strict order. The first failure stops processing immediately.

| # | Guard | Requirement |
|---|---|---|
| 1 | `feature_flag_enabled` | `VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME === "true"` |
| 2 | `controlled_text_pilot_flag_enabled` | `VAYLO_ENABLE_CONTROLLED_TEXT_PILOT === "true"` |
| 3 | `kill_switch_disabled` | `VAYLO_CONTROLLED_TEXT_PILOT_KILL_SWITCH !== "true"` |
| 4 | `internal_runtime_secret_valid` | `x-vaylo-internal-runtime-secret` header matches env var |
| 5 | `internal_guard_phrase_valid` | `internalRuntimeGuard === "I_UNDERSTAND_THIS_IS_CONTROLLED_TEXT_PILOT_INTERNAL_ONLY"` |
| 6 | `internal_account_allowlisted` | `pilotReviewerId` in `VAYLO_CONTROLLED_TEXT_PILOT_ALLOWLIST` |
| 7 | `pilot_scenario_allowed` | `pilotScenarioId` in `CONTROLLED_TEXT_PILOT_SCENARIO_SET_V1` |
| 8 | `pilot_input_mode_supported` | `pilotInputMode` is text-only mode |
| 9 | `no_ocr_or_upload_requested` | No binary/file payload detected |
| 10 | `no_payment_requested` | No payment fields present |
| 11 | `no_persistence_requested` | `requestedPersistence` not true |
| 12 | `no_dna_save_requested` | `requestedDnaSave` not true |
| 13 | `no_offline_save_requested` | `requestedOfflineSave` not true |
| 14 | `public_runtime_not_requested` | `internalRuntimeMode === "controlled_text_pilot_guarded"` |
| 15 | `live_llm_not_allowed` | Live LLM is not called; `liveLLMCalled` remains false |
| 16 | `manual_review_required_for_warning_or_high_risk` | Reviewer protocol enforced for warning/human_review scenarios |

---

## 8. Blocked Capabilities

These capabilities are hard-blocked in the guarded pilot branch and must remain unreachable:

| Capability | Reason |
|---|---|
| `public_anonymous_runtime` | No public access permitted |
| `ocr_photo_runtime` | Text-only epoch |
| `file_upload_runtime` | Text-only epoch |
| `payment_runtime` | Future epoch |
| `dna_save_runtime` | No consent model |
| `offline_save_runtime` | Not implemented |
| `b2b_visibility_runtime` | Out of scope |
| `multilingual_public_runtime` | Slovak-first; not yet governed |
| `direct_user_visible_delivery` | No user-facing output from pilot branch |
| `evidence_persistence` | Records are validated in-memory only |
| `live_llm_runtime` | Not permitted in 8.2K; future 8.2L+ |

---

## 9. Planned Guarded API Branch Boundary

The API branch introduced in 8.2K-2 must:

1. Be a **new `if`-guarded block** inside the existing route handler — not a new route.
2. Fire **only** when `internalRuntimeMode === "controlled_text_pilot_guarded"` is present in the request.
3. Evaluate **all 16 guards** before touching any pipeline function.
4. Return a **typed failure result** (no raw content) on any guard failure.
5. Pass through the full existing governance chain (8.2H redaction → 8.2I output contract → 8.2G wording gate → assembler → authorisation gate) unchanged.
6. Produce a **pilot response** containing governance metadata only — no raw text, no redacted text, no draft text.
7. Call `validatePilotEvidenceRecord` on the resulting metadata before returning.
8. Never touch the existing public-facing response path.
9. Be fully removable by setting `VAYLO_CONTROLLED_TEXT_PILOT_KILL_SWITCH=true`.

---

## 10. Request Contract Expectations

The `pilot_request_contract` type (defined in 8.2K-1) must include:

- `internalRuntimeMode: "controlled_text_pilot_guarded"` (literal type)
- `internalRuntimeGuard: string` (validated at runtime against required phrase)
- `pilotScenarioId: string` (validated against scenario set)
- `pilotInputMode: string` (validated against text-only modes)
- `pilotReviewerId: string` (validated against allowlist)
- `pilotRunId: string` (opaque run ID)
- `inputText: string` (controlled synthetic text; validated by 8.2H input contract)
- All safety invariant flags: `requestedPersistence: false`, `requestedDnaSave: false`, `requestedOfflineSave: false`, `requestedLiveLLM: false`

---

## 11. Response Contract Expectations

The `pilot_response_contract` type must include:

- `pilotRunId: string`
- `scenarioId: string`
- `governanceVerdict: string` (from output contract validator)
- `wordingGatePassed: boolean`
- `assemblerBridgePassed: boolean`
- `authorisationGatePassed: boolean`
- `evidenceValidationVerdict: string` (from `validatePilotEvidenceRecord`)
- Safety invariants: `containsRawInputText: false`, `containsRedactedText: false`, `containsFullDraftText: false`, `emittedToUserNow: false`, `persistenceUsed: false`, `neverUserVisible: true`

---

## 12. Failure Behavior Expectations

Any guard failure must:

- Return a `pilot_failure_result` immediately with the appropriate `failureVerdict` from `GuardedInternalPilotRuntimeSwitchFailureVerdict`.
- Not expose the reason for failure in any user-visible field.
- Set `emittedToUserNow: false`, `neverUserVisible: true` on the failure result.
- Not log raw request content.
- Not attempt any pipeline call after a guard failure.

---

## 13. Manual Evidence Validation Boundary

After the governance chain completes:

- The branch must construct a candidate `PilotEvidenceRecord` from the governance metadata.
- The record must be validated by `validatePilotEvidenceRecord` before the response is built.
- If validation fails, the run verdict is `invalid_test_run`.
- The validated `safeEvidenceRecord` is included in the pilot response as metadata only.
- No `safeEvidenceRecord` is written to any database.

---

## 14. No Persistence / No DNA / No Offline Save Rule

During the entire 8.2K epoch:

- No user text, redacted text, adapter draft, governance metadata, or evidence record is written to any database.
- `persistenceUsed: false`, `dnaSavePerformed: false`, `offlineSavePerformed: false` must hold on all pipeline and branch results.
- Guard 11–13 enforce this before the pipeline runs.
- The input contract (8.2H-1) enforces this again inside the pipeline.
- This rule cannot be overridden without a new guarded epoch (8.2L+) with its own persistence safety proof.

---

## 15. No Public Runtime Rule

- The pilot branch is gated behind `internalRuntimeMode === "controlled_text_pilot_guarded"`.
- Guard 14 rejects any non-pilot mode.
- No public feature flag enables this path.
- The branch must be entirely absent from production builds unless both `VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME` and `VAYLO_ENABLE_CONTROLLED_TEXT_PILOT` are explicitly `"true"`.

---

## 16. No Live LLM Rule

- Live LLM calls are not permitted anywhere in the 8.2K epoch.
- `liveLLMCalled: false` must hold on all pipeline, branch, and audit results.
- Guard 15 rejects any request that would trigger a live LLM call.
- Live LLM wiring is a future epoch (8.2L+) requiring its own governance proof.

---

## 17. Ordered Next Phases

| Phase | Description |
|---|---|
| **8.2K-1** | Pilot Runtime Guard Contract Types — define the typed contracts for pilot requests, responses, guard results, failure results, and no-persistence results. |
| **8.2K-2** | Guarded Internal Pilot API Branch — implement the guarded `if`-block in the API route handler; wire all 16 guards; connect to the existing 8.2H/8.2I/8.2G governance chain. |
| **8.2K-3** | Pilot Runtime E2E Harness — prove the full guard → governance chain → evidence validation path with synthetic fixtures covering pass, block, and tamper scenarios. |
| **8.2K-4** | Pilot Evidence Validation Integration — wire `validatePilotEvidenceRecord` into the branch output; prove evidence records are built and validated correctly. |
| **8.2K-5** — | Guarded Internal Pilot Runtime Closure Audit — formally close 8.2K by verifying all contracts, guards, harness results, evidence validation, and invariants. |

Each phase must be completed in order. 8.2K-2 may not begin before 8.2K-1 contract types are complete.

---

## 18. Exit Criteria for 8.2K-0

This phase is complete when:

- `GUARDED_INTERNAL_PILOT_RUNTIME_IMPLEMENTATION_PLAN_V1` is defined and type-safe.
- All 12 implementation scope items are represented.
- All 7 required contracts are listed.
- All 16 required guards are listed.
- All 11 blocked capabilities are listed.
- All 5 next phases are listed in order.
- `readyForRuntimeImplementation: false`.
- `readyForApiRouteModification: false`.
- `readyForRuntimeExecution: false`.
- `readyForPublicLaunch: false`.
- No runtime has been wired.
- TypeScript compiles without errors.
- The plan document is committed to the repository.

---

---

## Update — Phase 8.2K-1

Phase 8.2K-1 defines the typed runtime guard contracts: `PilotRuntimeRequest`, `PilotRuntimeGuardInput`, `PilotRuntimeGuardResult`, `PilotRuntimeFailureResult`, `PilotRuntimeResponse`, `PilotNoPersistenceResult`, and `PilotRuntimeClosureAuditResult`.  
API route implementation remains blocked until 8.2K-2: `readyForApiRouteModification: false`.  
Runtime execution remains disabled: `readyForRuntimeExecution: false`.

---

## Update — Phase 8.2K-2

Phase 8.2K-2 wires the first guarded internal-only pilot branch in `app/api/smart-talk/route.ts` behind all 16 guards.  
Success returns `responseKind: "authorised_internal_packet"` with guard summary — no input text, no model output.  
No live LLM, no persistence, no user-visible output; existing public Smart Talk behavior unchanged.

---

## Update — Phase 8.2K-3

Phase 8.2K-3 adds a synthetic E2E harness (`run-pilot-runtime-e2e-harness.ts`) covering 23 fixtures: success path, all 16 guard failure paths, 2 contract violation paths, 2 tamper/leak checks.  
API route logic is not modified in this phase; `app/api/smart-talk/route.ts` is unchanged.  
Runtime execution remains internal-only and non-user-visible; `readyForPublicLaunch: false`.

---

*This plan is a governance planning artefact only. It does not enable, authorise, or implement any runtime feature.*
