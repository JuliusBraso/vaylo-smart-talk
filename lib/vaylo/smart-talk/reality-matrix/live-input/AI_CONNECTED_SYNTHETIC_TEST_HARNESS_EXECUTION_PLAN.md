# AI-CONNECTED SYNTHETIC TEST HARNESS EXECUTION PLAN — Phase 8.3H

## 1. Purpose

Define the typed execution plan for a future synthetic-only test harness that will exercise the governance-controlled AI adapter path.  
This plan specifies the synthetic case catalog, risk classes, adapter interface policy, governance steps, metadata-only observations, and execution blockers.  
This plan builds on Phase 8.3G (AI-Connected Synthetic Test Harness Contract).

This plan does **not** execute the harness.  
This plan does **not** call a live LLM.  
This plan only permits the next dry-execution phase.  
Real input, OCR/photo/file input, public requests, Branch C, `run-smart-talk.ts`, persistence, public runtime, and user-visible output remain blocked.

---

## 2. What this execution plan means

- The 8.3G synthetic harness contract must have passed before this plan is valid.
- Only synthetic case identifiers and synthetic markers are permitted — no real text, no OCR, no uploaded files, no public requests.
- A dedicated synthetic adapter interface (separate from all existing public routes) is required.
- Dry execution of the plan requires a separate future phase contract.
- `harnessExecutionPerformedNow: false` is a literal invariant — this plan does not act.
- `dryExecutionDeferredToNextPhase: true` is a literal invariant on both input and result.
- The only positive readiness gate: `readyForAiConnectedSyntheticHarnessDryExecution`.

---

## 3. What this plan does NOT execute

| Action | Status |
|---|---|
| Execute synthetic harness | **BLOCKED (deferred to next phase)** |
| Call live LLM | **BLOCKED** |
| Process real user input | **BLOCKED** |
| Process OCR / photo / file input | **BLOCKED** |
| Forward raw or real redacted input | **BLOCKED** |
| Authorize Branch C | **NOT AUTHORIZED** |
| Authorize run-smart-talk.ts | **NOT AUTHORIZED** |
| Authorize OCR runtime | **NOT AUTHORIZED** |
| Authorize public runtime | **BLOCKED** |
| Authorize persistence | **BLOCKED** |
| Generate AI output | **BLOCKED** |
| Store model output | **BLOCKED** |
| Emit user-visible output | **BLOCKED** |
| Execute real operator pilot | **BLOCKED** |

---

## 4. Synthetic execution mode

Two valid modes exist; this phase always starts with `planned_only`:

- `planned_only` — this phase; no harness execution
- `dry_execution_allowed_next_phase` — unlocked only by a future phase contract

---

## 5. Synthetic case catalog

All 8 cases must be present:

| Case ID | Risk Class |
|---|---|
| `synthetic_safe_low_risk_payment_notice` | low_risk |
| `synthetic_deadline_explicit_date` | medium_risk |
| `synthetic_deadline_relative_missing_delivery_date` | medium_risk |
| `synthetic_high_risk_widerspruch_deadline` | high_risk |
| `synthetic_high_risk_immigration_uncertainty` | high_risk |
| `synthetic_missing_context_partial_document` | medium_risk |
| `synthetic_unsupported_legal_certainty_trap` | trap_case |
| `synthetic_unsafe_next_step_trap` | trap_case |

---

## 6. Risk classes

All 4 risk classes must be present:

- `low_risk`
- `medium_risk`
- `high_risk`
- `trap_case`

---

## 7. Adapter interface policy

All 10 adapter policies must be present:

- `dedicated_synthetic_adapter_interface_required`
- `adapter_accepts_synthetic_case_id_only`
- `adapter_accepts_synthetic_payload_marker_only`
- `adapter_must_not_accept_real_text`
- `adapter_must_not_accept_raw_text`
- `adapter_must_not_accept_redacted_real_text`
- `adapter_must_not_call_branch_c`
- `adapter_must_not_call_run_smart_talk`
- `adapter_must_not_call_ocr_runtime`
- `adapter_dry_execution_requires_next_phase`

---

## 8. Governance step plan

All 11 governance steps must be planned:

- `live_llm_boundary_check`
- `redacted_input_forwarding_policy_check`
- `ai_output_governance_recheck_policy_check`
- `manual_review_policy_check`
- `user_visible_authorization_policy_check`
- `hallucination_trap_expectation_check`
- `deadline_claim_expectation_check`
- `uncertainty_preservation_expectation_check`
- `user_visible_output_block_check`
- `persistence_block_check`
- `public_runtime_block_check`

---

## 9. Metadata-only observation plan

All 10 metadata-only observation types must be planned:

- `case_id`
- `risk_class`
- `expected_block_or_allow_path`
- `expected_governance_steps`
- `expected_trap_labels`
- `expected_deadline_handling`
- `expected_uncertainty_handling`
- `expected_user_visible_block_status`
- `expected_persistence_block_status`
- `expected_runtime_block_status`

No raw text, model output, user content, secrets, or PII may appear in observations.

---

## 10. Execution blockers

All 19 execution blockers must be declared. Any blocker detected halts execution:

- `real_input_detected`, `raw_input_detected`, `real_redacted_input_detected`
- `ocr_or_photo_input_detected`, `file_input_detected`, `public_request_detected`
- `branch_c_dependency_detected`, `run_smart_talk_dependency_detected`, `ocr_runtime_dependency_detected`
- `live_llm_call_detected`, `ai_output_generation_detected`, `model_output_storage_detected`
- `user_visible_output_detected`, `persistence_detected`, `public_runtime_detected`
- `missing_synthetic_case_catalog`, `missing_adapter_interface_policy`
- `missing_governance_step_plan`, `missing_metadata_only_observation_plan`

---

## 11. Checklist

All 21 checklist items must be confirmed:

- `execution_mode_reviewed`, `synthetic_case_catalog_reviewed`, `risk_classes_reviewed`
- `adapter_interface_policy_reviewed`, `governance_step_plan_reviewed`
- `metadata_only_observation_plan_reviewed`, `blockers_reviewed`
- `no_real_input_confirmed`, `no_raw_input_confirmed`, `no_real_redacted_input_confirmed`
- `no_ocr_photo_file_input_confirmed`
- `no_branch_c_dependency_confirmed`, `no_run_smart_talk_dependency_confirmed`, `no_ocr_runtime_dependency_confirmed`
- `no_live_llm_call_confirmed`, `no_ai_output_generation_confirmed`, `no_model_output_storage_confirmed`
- `no_user_visible_output_confirmed`, `no_persistence_confirmed`, `no_public_runtime_confirmed`
- `dry_execution_requires_next_phase_confirmed`

---

## 12. Forbidden values / content

The following strings and patterns are forbidden in all plan fields and notes:

- `sk-`, `OPENAI_API_KEY=`, `VAYLO_INTERNAL_RUNTIME_SECRET=`, `process.env`
- `apiKey`, `internalSecret`
- `rawInputText`, `redactedText`, `fullDraftText`, `modelOutput`
- `stored user input`, `stored redacted text`, `stored model output`
- `IBAN`, `Steuer-ID`, `Aktenzeichen`, `Sehr geehrter`, `BG-Nr`
- `john@example.com`, `+49 170 1234567`
- `Name:`, `Adresse:`, `Geburtsdatum:`, `Kind:`
- `Mietvertrag`, `Kündigung`, `Abschiebung`
- `Sie müssen`, `garantiert`, `fristlos sicher`, `rechtlich sicher`
- `approved for user display`, `auto-approved`, `show to user now`
- `public launch enabled`, `all outputs authorized`, `global approval`, `branch c authorized`
- `real user document`, `real OCR text`, `production runtime enabled`
- **New in 8.3H**: `harness executed`, `live llm executed`, `real operator pilot executed`
- Email-like and phone-like patterns

---

## 13. Tamper rejection cases

The check function runs 68 tamper cases. Every case must be rejected.

Selected highlights:

| # | Tamper | Expected rejection reason |
|---|---|---|
| 1 | `syntheticHarnessContractReady=false` | `synthetic_harness_contract_not_ready` |
| 2 | `executionMode` invalid | `invalid_execution_mode` |
| 3–9 | Missing cases/classes/policies/steps/observations/blockers/checklist | `missing_*` |
| 10 | `harnessExecutionPerformedNow=true` | `harness_execution_claim_detected` |
| 11 | `dryExecutionDeferredToNextPhase=false` | `dry_execution_not_deferred` |
| 12 | `syntheticInputOnly=false` | `real_input_allowed_or_detected` |
| 13–18 | Real/raw/OCR/file/public input allowed true | `*_allowed_or_detected` |
| 19–21 | Runtime dependency flags true | `*_dependency_claim_detected` |
| 22–24 | Call flags true | `*_call_claim_detected` |
| 25–30 | LLM/AI/model/user-visible output flags true | `*_claim_detected` |
| 31–35 | Persistence/public/pilot flags true | `*_claim_detected` |
| 36–37 | Missing acknowledgments | `missing_required_checklist_item` |
| 38–46 | All `contains*` flags true | `forbidden_*_detected` |
| 47–65 | Forbidden string injection (prior phases) | `*_detected` |
| 66–68 | New execution phrases: `"harness executed"`, `"live llm executed"`, `"real operator pilot executed"` | `unsafe_execution_plan_note_detected` |

---

## 14. Safety invariants

### On `AiConnectedSyntheticHarnessExecutionPlanInput` (all literal)
- `harnessExecutionPerformedNow: false`, `dryExecutionDeferredToNextPhase: true`
- `syntheticInputOnly: true`
- All real/raw/OCR/file/public input allowed: `false`
- All runtime dependency flags: `false`
- All call flags: `false`
- All LLM/AI/model/user-visible/persistence/public/pilot flags: `false`
- All `contains*` flags: `false`
- `neverUserVisible: true`

### On `AiConnectedSyntheticHarnessExecutionPlanResult` (all literal)
- `readyForLiveLLMRuntime: false` through `readyForPersistence: false`
- `harnessExecutionPerformedNow: false`, `dryExecutionDeferredToNextPhase: true`
- `syntheticInputOnly: true`; all real/raw/OCR/file/public input allowed: `false`
- All dependency/call flags: `false`
- All LLM/AI/model/user-visible/persistence/public/pilot flags: `false`
- `httpCallMade: false`, `apiRouteCalled: false`
- `apiRouteModifiedByExecutionPlan: false`
- `existingRuntimeModifiedByExecutionPlan: false`
- `uiTouched: false`, `databaseOrStorageModifiedByExecutionPlan: false`
- `neverUserVisible: true`

---

## 15. Readiness decision

| Flag | Value |
|---|---|
| `readyForAiConnectedSyntheticHarnessDryExecution` | `true` (if `allPassed`) |
| `readyForLiveLLMRuntime` | **false** |
| `readyForConnectedAiRuntimeExecution` | **false** |
| `readyForRealOperatorPilotRun` | **false** |
| `readyForPilotRunNow` | **false** |
| `readyForPublicLaunch` | **false** |
| `readyForPersistence` | **false** |

---

## 16. Next phase

**Phase 8.3I — AI-Connected Synthetic Harness Dry Execution**

This plan only permits proceeding to Phase 8.3I when `allPassed === true`.  
Phase 8.3I defines the typed contract for executing the dry run of the synthetic test harness against a dedicated governance adapter — using only the planned synthetic case IDs, producing only safe metadata output, and without processing real user input, calling live LLM runtime, or emitting user-visible output.  
Live LLM calls are still blocked in Phase 8.3I unless a separate live LLM authorization contract is completed.
