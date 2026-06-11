# PILOT RUNTIME E2E HARNESS — Phase 8.2K-3

## 1. Purpose

Proves the guarded internal pilot API branch (8.2K-2) behavior using pure
synthetic fixtures and static local checks.  No live infrastructure is
involved.  The harness establishes a reproducible, auditable baseline before
the 8.2K-4 evidence validation integration.

## 2. What Is Tested

| Category | Count | Description |
|---|---|---|
| Success path | 1 | All 16 guards pass → `authorised_internal_packet` |
| Guard failure paths | 16 | Each guard violated exactly once (guards 1–16) |
| Contract violation paths | 2 | Missing `text`, missing `pilotRunId` |
| Tamper / leak paths | 2 | Raw text echo check, secret echo check |
| **Total fixtures** | **21** | |

Per-case checks:
- HTTP status code matches expected (200 / 400 / 403)
- `authorised` flag matches expected
- `responseKind` matches expected
- `failureVerdict` matches expected string (or null)
- `failedGuard` matches expected string (or null)
- Response JSON does not contain `SYNTHETIC_TEXT_NEVER_REAL_USER_DATA`
- Response JSON does not contain `synthetic-secret-never-real`
- `userVisibleOutputAllowed` and `emittedToUserNow` are false
- `persistenceUsed`, `dnaSavePerformed`, `offlineSavePerformed` are false
- `liveLLMCalled` is false
- `publicRuntimeEnabled` is false

## 3. What Is Not Tested

- Actual HTTP transport (no fetch / axios / NextRequest)
- Live LLM output quality
- Governance chain (8.2G) wiring — covered in 8.2K-4
- Persistence layer correctness — no DB involved
- OCR pipeline — not wired in pilot branch
- Public Smart Talk runtime behavior
- Real user input processing

## 4. Synthetic-Only Policy

| Item | Value |
|---|---|
| Request text | `"SYNTHETIC_TEXT_NEVER_REAL_USER_DATA"` (literal constant) |
| Secret | `"synthetic-secret-never-real"` (literal constant) |
| Real user text | never used |
| Real secrets | never used |
| `process.env` | never read |
| HTTP requests | never made |
| API route imported | never — harness uses a local pure evaluator |

## 5. Fixture Coverage

### Guard failure fixtures (one guard violated per fixture)

| Guard | Fixture Kind | Expected HTTP | Expected Verdict |
|---|---|---|---|
| 1 feature_flag_enabled | failure_feature_flag_disabled | 403 | rejected_feature_flag_disabled |
| 2 controlled_text_pilot_flag_enabled | failure_controlled_text_pilot_flag_disabled | 403 | rejected_controlled_text_pilot_flag_disabled |
| 3 kill_switch_disabled | failure_kill_switch_enabled | 403 | rejected_kill_switch_enabled |
| 4 internal_runtime_secret_valid (missing) | failure_missing_internal_secret | 403 | rejected_missing_internal_secret |
| 4 internal_runtime_secret_valid (wrong) | failure_invalid_internal_secret | 403 | rejected_invalid_internal_secret |
| 5 internal_guard_phrase_valid (missing) | failure_missing_guard_phrase | 403 | rejected_missing_guard_phrase |
| 5 internal_guard_phrase_valid (wrong) | failure_invalid_guard_phrase | 403 | rejected_invalid_guard_phrase |
| 6 internal_account_allowlisted | failure_not_allowlisted | 403 | rejected_not_allowlisted |
| 7 pilot_scenario_allowed | failure_unknown_pilot_scenario | 403 | rejected_unknown_pilot_scenario |
| 8 pilot_input_mode_supported | failure_unsupported_input_mode | 400 | rejected_unsupported_input_mode |
| 9 no_ocr_or_upload_requested | failure_ocr_or_upload_attempt | 400 | rejected_ocr_or_upload_attempt |
| 10 no_payment_requested | failure_payment_attempt | 400 | rejected_payment_attempt |
| 11 no_persistence_requested | failure_persistence_attempt | 400 | rejected_persistence_attempt |
| 12 no_dna_save_requested | failure_dna_save_attempt | 400 | rejected_dna_save_attempt |
| 13 no_offline_save_requested | failure_offline_save_attempt | 400 | rejected_offline_save_attempt |
| 14 public_runtime_not_requested | failure_public_runtime_attempt | 400 | rejected_public_runtime_attempt |
| 15 live_llm_not_allowed | failure_live_llm_not_allowed | 400 | rejected_live_llm_not_allowed |
| 16 manual_review_required_for_warning_or_high_risk | failure_manual_review_required | 403 | rejected_manual_review_required |

### Contract violation fixtures

| Fixture Kind | Expected HTTP | Expected Verdict |
|---|---|---|
| failure_contract_violation_missing_text | 400 | rejected_contract_violation |
| failure_contract_violation_missing_pilot_run_id | 400 | rejected_contract_violation |

### Tamper fixtures

| Fixture Kind | Check |
|---|---|
| tamper_raw_text_echo_attempt | `rawTextLeakCheckPassed: true` — response JSON excludes synthetic text |
| tamper_secret_echo_attempt | `secretLeakCheckPassed: true` — response JSON excludes synthetic secret |

## 6. Leak Checks

Every fixture (including success and all failure paths) runs two leak checks:

1. **Raw text leak check**: `JSON.stringify(responsePayload)` must not contain
   `"SYNTHETIC_TEXT_NEVER_REAL_USER_DATA"`.
2. **Secret leak check**: `JSON.stringify(responsePayload)` must not contain
   `"synthetic-secret-never-real"`.

The evaluator never writes `req.text` or any secret value into the response
payload, so both checks pass for all fixtures.

## 7. Safety Invariants

The `PilotRuntimeE2EHarnessSummary` carries literal-type safety invariants:

```
liveLLMCalled: false          (literal false — compile-time enforced)
apiRouteModifiedByHarness: false
uiTouched: false
persistenceUsed: false
dnaSavePerformed: false
offlineSavePerformed: false
emittedToUserNow: false
neverUserVisible: true        (literal true)
```

These fields cannot be set to any other value without a compile error.

## 8. Non-Goals

- This harness is **not** an integration test against the real HTTP API.
- This harness is **not** a performance benchmark.
- This harness does **not** replace 8.2K-4 evidence validation integration.
- This harness does **not** exercise governance chain (8.2G wording gate,
  response assembler, authorisation gate).
- This harness does **not** prove correct LLM output — no LLM is called.

## 9. Next Phase

**8.2K-4 — Pilot Evidence Validation Integration**

Connect the guarded pilot API branch response to the evidence record model
from 8.2J-4, prove that a `PilotRuntimeResponse` can be safely validated and
stored as a `PilotEvidenceRecord` (internal metadata only, no persistence
to external storage).
