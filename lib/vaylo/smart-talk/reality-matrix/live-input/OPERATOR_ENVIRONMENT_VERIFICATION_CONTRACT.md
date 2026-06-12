# PHASE 8.2L-1 — Operator Environment Verification Contract

**Epoch:** 8.2L — Guarded Internal Controlled Pilot Execution
**Phase:** 8.2L-1
**Mode:** CONTRACT TYPES ONLY / NO ENV READS / NO PILOT RUN

---

## 1. Purpose

Before any guarded internal controlled pilot run may be attempted, an
operator must formally verify that all required environment variables are
correctly configured. This phase defines the typed contract for that
verification process.

The contract accepts only boolean attestations and env var names —
**never actual values, never secrets**.

---

## 2. What Operator Verification Means

Operator verification is the process by which a named, allowlisted internal
operator confirms (via booleans) that:

- Each required environment variable is present and in its expected state.
- The operator has checked this manually in the deployment environment.
- No secrets have been printed or stored during the check.
- The operator checklist has been reviewed and confirmed.

Verification produces an `OperatorEnvironmentVerificationResult` with
`readyForSingleRunExecutionHarness: true` when all checks pass.

---

## 3. What Operator Verification Does NOT Mean

- Operator verification does **not** read real environment variable values.
  The code stores names only.
- Operator verification does **not** print or expose secrets.
- Operator verification does **not** run the pilot.
- Operator verification does **not** call `/api/smart-talk`.
- Operator verification does **not** enable public launch.
- Operator verification does **not** enable live LLM runtime.
- Operator verification does **not** enable persistence.
- Passing this phase only allows **8.2L-2 single-run execution harness**
  planning to begin.

---

## 4. Required Environment Variable Names

These 6 names must be attested by the operator. Values are never stored:

| Name | Expected state |
|------|---------------|
| `VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME` | `"true"` |
| `VAYLO_ENABLE_CONTROLLED_TEXT_PILOT` | `"true"` |
| `VAYLO_CONTROLLED_TEXT_PILOT_KILL_SWITCH` | `"not_true"` (absent or `"false"`) |
| `VAYLO_INTERNAL_RUNTIME_SECRET` | `"configured_non_empty"` |
| `VAYLO_CONTROLLED_TEXT_PILOT_ALLOWLIST` | `"configured_csv_allowlist"` |
| `VAYLO_CONTROLLED_TEXT_PILOT_SCENARIO_ALLOWLIST` | `"configured_csv_allowlist"` |

The `operatorConfirmedExpectedState` field in each attestation records what
the operator observed. No actual values are recorded.

---

## 5. Attestation-Only Rule

Each `OperatorEnvironmentVerificationEnvVarAttestation` carries:

- `operatorConfirmedPresent: boolean` — did the operator see this variable?
- `operatorConfirmedExpectedState` — what state did the operator observe?

And the following literal-false invariants that **cannot** be set to any
other value:

- `valueStored: false`
- `valuePrinted: false`
- `secretValueStored: false`
- `secretValuePrinted: false`

These are enforced by TypeScript's literal type system. Any attempt to set
them to `true` is a compile error.

---

## 6. No Secret Values Rule

The entire operator verification contract handles **names and booleans only**:

- The `OperatorEnvironmentVerificationInput` has `noSecretValuesProvided: true`
  and `noRealEnvValuesProvided: true` as literal types.
- The `OperatorEnvironmentVerificationResult` has `secretValuesStored: false`,
  `secretValuesPrinted: false`, `realEnvValuesRead: false`, and
  `envValuesStored: false` as literal types.
- No code in this module reads `process.env`.
- No string containing an actual secret value should ever appear in any
  object conforming to this contract.

---

## 7. Operator Checklist Items (18 required)

The operator must confirm all 18 of the following items in
`checklistConfirmed` before a passing verification:

| # | Item | Coverage |
|---|------|----------|
| 1 | `internal_runtime_feature_flag_confirmed_true` | Feature flag confirmed |
| 2 | `controlled_text_pilot_flag_confirmed_true` | Pilot flag confirmed |
| 3 | `kill_switch_confirmed_not_true` | Kill switch confirmed off |
| 4 | `internal_runtime_secret_confirmed_configured` | Secret confirmed set |
| 5 | `internal_runtime_secret_not_printed` | Secret not printed |
| 6 | `internal_runtime_secret_not_stored` | Secret not stored |
| 7 | `allowlist_confirmed_configured` | Allowlist is set |
| 8 | `allowlist_contains_operator_id` | Operator is allowlisted |
| 9 | `scenario_allowlist_confirmed_configured` | Scenario allowlist is set |
| 10 | `scenario_allowlist_contains_declared_scenario_id` | Scenario is allowlisted |
| 11 | `guard_phrase_confirmed_available` | Guard phrase is known |
| 12 | `no_public_tester_confirmed` | No public tester access |
| 13 | `no_real_sensitive_document_confirmed` | No real sensitive doc used |
| 14 | `no_live_llm_confirmed` | No live LLM will be called |
| 15 | `no_persistence_confirmed` | No persistence will occur |
| 16 | `no_dna_save_confirmed` | No DNA save will occur |
| 17 | `no_offline_save_confirmed` | No offline save will occur |
| 18 | `abort_criteria_confirmed_understood` | Abort criteria understood |

---

## 8. Failure Reasons (20 possible)

| Reason | Triggered by |
|--------|-------------|
| `missing_required_env_var_attestation` | Env var not attested or not confirmed present |
| `internal_runtime_feature_flag_not_confirmed_true` | Wrong expected state for feature flag |
| `controlled_text_pilot_flag_not_confirmed_true` | Wrong expected state for pilot flag |
| `kill_switch_not_confirmed_disabled` | Kill switch not confirmed off |
| `internal_runtime_secret_not_confirmed_configured` | Secret not confirmed configured |
| `internal_runtime_secret_printed_or_stored` | Value/secret stored or printed in attestation |
| `allowlist_not_confirmed_configured` | Allowlist attestation wrong state |
| `operator_id_not_confirmed_allowlisted` | Missing `allowlist_contains_operator_id` checklist item |
| `scenario_allowlist_not_confirmed_configured` | Scenario allowlist attestation wrong state |
| `scenario_id_not_confirmed_allowlisted` | Missing scenario checklist item |
| `guard_phrase_not_confirmed_available` | Missing guard phrase checklist item |
| `public_tester_risk_not_cleared` | Missing no public tester checklist item |
| `real_sensitive_document_risk_not_cleared` | Missing no sensitive doc checklist item |
| `live_llm_risk_not_cleared` | Missing no LLM checklist item or `noLiveLLMCalled !== true` |
| `persistence_risk_not_cleared` | Missing no persistence checklist item or `noPersistenceUsed !== true` |
| `dna_save_risk_not_cleared` | Missing no DNA save checklist item |
| `offline_save_risk_not_cleared` | Missing no offline save checklist item |
| `abort_criteria_not_confirmed` | Missing abort criteria checklist item |
| `closure_audit_not_confirmed_ready` | `closureAuditReady !== true` |
| `execution_plan_not_confirmed_ready` | `executionPlanReadyForOperatorEnvVerification !== true` |

---

## 9. Readiness Decision

```
readyForSingleRunExecutionHarness: true   (when failureReasons.length === 0)
readyForPilotRunNow:               false  (literal — this phase never runs the pilot)
readyForPublicLaunch:              false  (literal — permanent)
readyForLiveLLMRuntime:            false  (literal — until future phase)
readyForPersistence:               false  (literal — until future phase)
```

`readyForSingleRunExecutionHarness: true` only permits 8.2L-2 to be planned.
It does not execute anything.

---

## 10. Non-Goals

This phase does NOT:

- Read real `process.env` values
- Store or print real env var values or secrets
- Verify that the env vars are actually set (this is an operator manual check)
- Execute the pilot
- Call `/api/smart-talk`
- Call any live LLM
- Persist anything
- Modify `app/api/smart-talk/route.ts`
- Touch UI
- Enable public launch

---

## 11. Next Phase

**8.2L-2 — Single-Run Execution Harness**

Defines the pure TypeScript harness that simulates the full guarded API
request/response sequence for a single controlled run, without making live
HTTP calls. Requires `readyForSingleRunExecutionHarness: true` from 8.2L-1.
