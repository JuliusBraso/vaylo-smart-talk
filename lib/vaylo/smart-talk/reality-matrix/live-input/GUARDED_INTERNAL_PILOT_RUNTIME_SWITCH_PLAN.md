# Guarded Internal Pilot Runtime Switch Plan — Phase 8.2J-2

**Status:** Planning only. No switch is implemented. No API/UI/LLM/persistence is touched.  
**Plan ID:** `8.2J-2`  
**Constant:** `GUARDED_INTERNAL_PILOT_RUNTIME_SWITCH_PLAN_V1`  
**Previous phase:** 8.2J-1 — Pilot Scenario Set and Acceptance Criteria

---

## 1. Purpose

This plan defines the exact guard contract for the controlled internal text pilot runtime switch. It specifies what feature flags, request fields, header values, guard phrases, allowlist checks, and kill switch behaviour must be in place before any implementation of the switch is permitted.

This plan does not implement the switch. It prepares Phase 8.2J-3 (Manual Safety Test Protocol).

---

## 2. What 8.2J-2 Plans

- The exact set of required runtime guards (16 activation rules).
- Required environment variables (feature flags).
- Required request fields that a pilot request must carry.
- The exact guard phrase string for intentional activation.
- Kill switch behaviour.
- Failure verdicts for each guard violation.
- The manual review escalation rule for warning/high-risk scenarios.

---

## 3. What 8.2J-2 Does NOT Implement

- No API route change.
- No UI change.
- No live LLM call.
- No persistence.
- No DNA save, offline save.
- No real user input processed.
- No pilot runtime is wired.
- Smart Talk is NOT made public by this plan.

---

## 4. Allowed Internal Pilot Mode

Only one runtime mode is permitted during the internal pilot:

```
internalRuntimeMode: "controlled_text_pilot_guarded"
```

All other modes are blocked at the switch level (see §5).

---

## 5. Blocked Modes

| Mode | Reason |
|---|---|
| `public_anonymous_live_runtime` | Not safe; no safety audit complete |
| `ocr_photo_runtime` | Text-only epoch |
| `file_upload_runtime` | Text-only epoch |
| `payment_runtime` | Future epoch |
| `dna_save_runtime` | No consent model |
| `offline_save_runtime` | Not implemented |
| `b2b_visibility_runtime` | Out of scope |
| `multilingual_public_runtime` | Slovak-first; not yet governed |

---

## 6. Required Feature Flags

All flags are **server-side environment variables only**. None are browser-exposed.

| Flag | Purpose |
|---|---|
| `VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME` | Master switch; must be `"true"` |
| `VAYLO_ENABLE_CONTROLLED_TEXT_PILOT` | Pilot-specific flag; must be `"true"` |
| `VAYLO_CONTROLLED_TEXT_PILOT_KILL_SWITCH` | Emergency stop; must NOT be `"true"` |
| `VAYLO_INTERNAL_RUNTIME_SECRET` | Shared secret; matched against request header |
| `VAYLO_CONTROLLED_TEXT_PILOT_ALLOWLIST` | Comma-separated internal reviewer IDs |

**Kill switch takes precedence over all other flags.** If `VAYLO_CONTROLLED_TEXT_PILOT_KILL_SWITCH=true`, all pilot requests are rejected immediately without further evaluation.

---

## 7. Required Request Fields

Each pilot request must carry all of the following:

| Field | Value Contract |
|---|---|
| `internalRuntimeMode` | Must be `"controlled_text_pilot_guarded"` |
| `internalRuntimeGuard` | Must be the exact guard phrase (see §8) |
| `pilotScenarioId` | Must be one of the 12 IDs from `CONTROLLED_TEXT_PILOT_SCENARIO_SET_V1` |
| `pilotInputMode` | Must be `"real_text_guarded"` or `"real_question_guarded"` |
| `pilotReviewerId` | Must appear in `VAYLO_CONTROLLED_TEXT_PILOT_ALLOWLIST` |
| `pilotRunId` | Opaque run ID for session tracing (not persisted) |

---

## 8. Required Guard Order

Guards are evaluated in this order. The first failure stops evaluation immediately.

| # | Rule ID | Guard | Failure Verdict |
|---|---|---|---|
| 1 | R01 | `internal_feature_flag` | `rejected_feature_flag_disabled` |
| 2 | R02 | `global_kill_switch` | `rejected_kill_switch_enabled` |
| 3 | R03 | `internal_runtime_secret_header` | `rejected_missing_internal_secret` / `rejected_invalid_internal_secret` |
| 4 | R04 | `internal_runtime_guard_phrase` | `rejected_missing_guard_phrase` / `rejected_invalid_guard_phrase` |
| 5 | R05 | `internal_account_allowlist` | `rejected_not_allowlisted` |
| 6 | R06 | `pilot_scenario_allowlist` | `rejected_unknown_pilot_scenario` |
| 7 | R07 | `text_only_mode_guard` | `rejected_unsupported_input_mode` |
| 8 | R08 | `no_ocr_guard` | `rejected_ocr_or_upload_attempt` |
| 9 | R09 | `no_file_upload_guard` | `rejected_ocr_or_upload_attempt` |
| 10 | R10 | `no_payment_guard` | `rejected_persistence_or_save_attempt` |
| 11 | R11 | `no_persistence_guard` | `rejected_persistence_or_save_attempt` |
| 12 | R12 | `no_dna_save_guard` | `rejected_persistence_or_save_attempt` |
| 13 | R13 | `no_offline_save_guard` | `rejected_persistence_or_save_attempt` |
| 14 | R14 | `no_public_runtime_guard` | `rejected_public_runtime_attempt` |
| 15 | R15 | `no_live_llm_guard_until_future_phase` | `rejected_live_llm_not_allowed` |
| 16 | R16 | `manual_review_required_for_warning_or_high_risk` | `rejected_manual_review_required` |

---

## 9. Internal Allowlist Model

- The allowlist is a server-side environment variable: `VAYLO_CONTROLLED_TEXT_PILOT_ALLOWLIST`.
- Format: comma-separated internal reviewer IDs (e.g. `reviewer-001,reviewer-002`).
- Each pilot request must supply a `pilotReviewerId` that appears in the allowlist.
- Allowlist changes require a server environment update — no dynamic runtime modification.
- The allowlist is not exposed to the browser, not logged with raw request data, and not stored in the application database.

---

## 10. Kill Switch Behaviour

- `VAYLO_CONTROLLED_TEXT_PILOT_KILL_SWITCH=true` immediately rejects all pilot requests.
- Kill switch evaluation (R02) fires before any other guard except the feature flag check (R01).
- Changing the kill switch to `true` requires only an environment variable update — no code deployment.
- The kill switch is the emergency stop for the entire pilot runtime. It can be engaged at any time.

---

## 11. Failure Verdicts

| Verdict | Trigger |
|---|---|
| `rejected_feature_flag_disabled` | Either pilot feature flag missing/false |
| `rejected_kill_switch_enabled` | Kill switch is `true` |
| `rejected_missing_internal_secret` | `x-vaylo-internal-runtime-secret` header absent |
| `rejected_invalid_internal_secret` | Header value does not match `VAYLO_INTERNAL_RUNTIME_SECRET` |
| `rejected_missing_guard_phrase` | `internalRuntimeGuard` field absent |
| `rejected_invalid_guard_phrase` | Guard phrase does not match required value exactly |
| `rejected_not_allowlisted` | `pilotReviewerId` not in allowlist |
| `rejected_unknown_pilot_scenario` | `pilotScenarioId` not in scenario set |
| `rejected_unsupported_input_mode` | `pilotInputMode` not text/question guarded |
| `rejected_ocr_or_upload_attempt` | OCR, file, or binary payload detected |
| `rejected_persistence_or_save_attempt` | Persistence, DNA, or offline save flag set |
| `rejected_public_runtime_attempt` | Non-pilot `internalRuntimeMode` supplied |
| `rejected_live_llm_not_allowed` | Live LLM call attempted |
| `rejected_manual_review_required` | Warning/high-risk scenario without reviewer protocol |

---

## 12. Manual Review Escalation (R16)

For any scenario with `acceptanceStatus: "warning"` or `"human_review"` in `CONTROLLED_TEXT_PILOT_SCENARIO_SET_V1`:

- A designated internal reviewer must inspect the governance pipeline result before it is considered valid.
- This is a **protocol gate**, not an automated code gate.
- The `pilotReviewerId` field identifies who is performing the review.
- The reviewer must confirm: no certainty claims, no legal conclusions, appropriate uncertainty language, no raw PII in output.
- Reviewer observations are recorded in a separate review log — not in the application.

---

## 13. No Persistence / No DNA / No Offline Save Rule

During the entire 8.2J pilot:

- No user text, redacted text, or adapter draft is written to any database.
- `persistenceUsed: false`, `dnaSavePerformed: false`, `offlineSavePerformed: false` must hold on all pipeline results.
- Guards R11–R13 enforce this at the switch level before any pipeline stage runs.
- The input contract (8.2H-1) enforces this again inside the pipeline.

---

## 14. No Public Runtime Rule

- `internalRuntimeMode: "controlled_text_pilot_guarded"` is the only permitted mode.
- Requests without this exact value are rejected at R14.
- The existing public Smart Talk feature flag (if any) must remain disabled.
- No anonymous user may reach the pilot runtime.

---

## 15. No Live LLM Rule

- Live LLM calls are not permitted during the 8.2J epoch.
- All pipeline results must carry `liveLLMCalled: false`.
- Guard R15 rejects any request that would trigger a live LLM call.
- A future guarded phase (8.2K+) must introduce live LLM with a dedicated proof harness and governance closure audit.

---

## 16. Exit Criteria for 8.2J-2

This phase is complete when:

- `GUARDED_INTERNAL_PILOT_RUNTIME_SWITCH_PLAN_V1` is defined and type-safe.
- All 16 activation rules are represented.
- `readyForPilotRuntimeImplementation: false`.
- `readyForManualSafetyProtocol: true`.
- `readyForPublicLaunch: false`.
- No runtime has been wired.
- TypeScript compiles without errors.
- The plan document is committed to the repository.

---

## 17. Next Phase

**8.2J-3 — Manual Safety Test Protocol**

Define the reviewer checklist and sign-off protocol that must be followed for each pilot scenario. This includes:

- What the reviewer checks before running a scenario.
- What counts as a pass, warning, human-review, or block result.
- How the reviewer records observations without capturing raw text.
- Sign-off requirements before any result is considered pilot-valid.

---

*This plan is a governance planning artefact only. It does not enable, authorise, or implement any runtime feature.*
