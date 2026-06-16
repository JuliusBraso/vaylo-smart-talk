# AI-CONNECTED SYNTHETIC TEST HARNESS CONTRACT — Phase 8.3G

## 1. Purpose

Define the typed contract for the conditions under which a future synthetic-only test harness may exercise the governance-controlled AI adapter path.  
This contract builds on Phase 8.3F (User-Visible Output Authorization Contract).

This contract does **not** execute the harness.  
This contract does **not** call a live LLM.  
This contract allows only future synthetic-input execution planning.  
Real user input, OCR input, file input, public requests, persistence, public runtime, Branch C, and `run-smart-talk.ts` remain blocked.  
This contract does **not** generate or store AI output.  
This contract does **not** emit user-visible output.  
This contract only permits the next phase: **AI-Connected Synthetic Test Harness Execution Plan**.

---

## 2. What AI-connected synthetic test harness contract means

- User-visible output authorization (8.3F) must have passed before this contract is valid.
- Only synthetic input classes are permitted — no real user documents, photos, OCR, files, or public requests.
- A dedicated synthetic adapter (separate from any existing public route) is required for any future execution.
- Harness execution itself requires a separate future execution plan contract.
- `adapterExecutionPerformedNow: false` is a literal invariant — this contract plans, it does not act.
- `branchCAuthorized: false`, `runSmartTalkAuthorized: false`, `ocrRuntimeAuthorized: false` maintain full existing runtime isolation.
- The only positive readiness gate: `readyForAiConnectedSyntheticTestHarnessExecutionPlan`.

---

## 3. What this contract does NOT authorize

| Action | Status |
|---|---|
| Execute AI-connected harness | **BLOCKED** |
| Call live LLM | **BLOCKED** |
| Process real user input | **BLOCKED** |
| Process OCR / photo / file input | **BLOCKED** |
| Forward raw or real redacted input | **BLOCKED** |
| Authorize Branch C | **NOT AUTHORIZED** |
| Authorize run-smart-talk.ts | **NOT AUTHORIZED** |
| Authorize OCR runtime | **NOT AUTHORIZED** |
| Authorize public runtime | **BLOCKED** |
| Authorize live LLM runtime | **BLOCKED** |
| Authorize persistence | **BLOCKED** |
| Generate AI output | **BLOCKED** |
| Store model output | **BLOCKED** |
| Emit user-visible output | **BLOCKED** |
| Allow public anonymous requests | **BLOCKED** |
| Execute real operator pilot | **BLOCKED** |

---

## 4. Synthetic harness scope

All 13 scopes must be present:

- `synthetic_input_only`
- `no_real_user_input`
- `no_raw_input`
- `no_real_redacted_input`
- `no_photo_or_ocr_input`
- `no_file_upload_input`
- `no_public_anonymous_input`
- `no_user_visible_output`
- `no_persistence`
- `no_public_runtime`
- `no_branch_c_runtime`
- `no_existing_run_smart_talk_runtime`
- `no_ocr_runtime`

---

## 5. Synthetic input classes

All 6 allowed synthetic classes must be present:

- `synthetic_bureaucratic_notice`
- `synthetic_payment_notice`
- `synthetic_deadline_question`
- `synthetic_uncertainty_case`
- `synthetic_high_risk_block_case`
- `synthetic_safe_low_risk_case`

---

## 6. Blocked input classes

All 13 blocked input classes must be present:

- `real_user_document`
- `real_user_photo`
- `real_ocr_text`
- `real_raw_text`
- `real_redacted_text`
- `uploaded_file_content`
- `public_request_content`
- `private_user_pii`
- `secrets_or_api_keys`
- `real_immigration_case`
- `real_financial_sanction_case`
- `real_appeal_deadline_case`
- `real_medical_or_child_data_case`

---

## 7. Preconditions

All 15 preconditions must be present:

- `user_visible_authorization_contract_ready`
- `synthetic_input_catalog_required`
- `synthetic_input_must_be_marked_synthetic`
- `no_real_input_allowed`
- `no_content_storage_allowed`
- `existing_runtime_isolation_preserved`
- `branch_c_not_called`
- `run_smart_talk_not_called`
- `ocr_runtime_not_called`
- `live_llm_call_still_blocked_by_this_contract`
- `future_execution_plan_required`
- `governance_recheck_chain_required`
- `manual_review_chain_required`
- `user_visible_authorization_chain_required`
- `post_run_audit_required_later`

---

## 8. Adapter policy

All 7 adapter policies must be present:

- `dedicated_synthetic_adapter_required`
- `existing_public_route_not_authorized`
- `existing_run_smart_talk_not_authorized`
- `ocr_adapter_not_authorized`
- `adapter_must_accept_synthetic_input_only`
- `adapter_must_return_metadata_only_until_execution_phase`
- `adapter_execution_requires_future_plan`

---

## 9. Expected outcomes

All 9 expected outcomes must be present:

- `ready_for_future_synthetic_execution_plan`
- `blocked_if_real_input_detected`
- `blocked_if_branch_c_called`
- `blocked_if_run_smart_talk_called`
- `blocked_if_ocr_called`
- `blocked_if_live_llm_called_in_contract`
- `blocked_if_user_visible_output_attempted`
- `blocked_if_persistence_attempted`
- `blocked_if_public_runtime_attempted`

---

## 10. Checklist

All 18 checklist items must be confirmed:

- `scope_reviewed`
- `synthetic_input_classes_reviewed`
- `blocked_input_classes_reviewed`
- `preconditions_reviewed`
- `adapter_policy_reviewed`
- `expected_outcomes_reviewed`
- `existing_runtime_isolation_reviewed`
- `no_real_input_confirmed`
- `no_raw_input_confirmed`
- `no_real_redacted_input_confirmed`
- `no_photo_ocr_file_input_confirmed`
- `no_live_llm_call_confirmed`
- `no_ai_output_generation_confirmed`
- `no_model_output_storage_confirmed`
- `no_user_visible_output_confirmed`
- `no_persistence_confirmed`
- `no_public_runtime_confirmed`
- `future_execution_plan_required_confirmed`

---

## 11. Forbidden values / content

The following strings and patterns are forbidden in all harness contract fields and notes:

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
- Email-like patterns
- Phone-like patterns

---

## 12. Tamper rejection cases

The check function runs 65 tamper cases. Every case must be rejected.

Selected highlights:

| # | Tamper | Expected rejection reason |
|---|---|---|
| 1 | `userVisibleOutputAuthorizationReady=false` | `user_visible_authorization_contract_not_ready` |
| 2–8 | Missing scopes/classes/preconditions/policies/outcomes/checklist | `missing_*` |
| 9 | `syntheticInputOnly=false` | `missing_scope` |
| 10–15 | Real/raw/OCR/file/public input allowed true | `*_allowed_detected` |
| 16–17 | `dedicatedSyntheticAdapterRequired=false`, `futureExecutionPlanRequired=false` | `unsafe_adapter_*` / `missing_future_*` |
| 18 | `adapterExecutionPerformedNow=true` | `unsafe_adapter_authorization_detected` |
| 19–21 | Branch C/runSmartTalk/OCR authorized true | `unsafe_adapter_authorization_detected` |
| 22–24 | Branch C/runSmartTalk/OCR called true | `*_call_claim_detected` |
| 25–30 | LLM/AI-output/model/user-visible output flags true | `*_claim_detected` |
| 31–35 | Persistence/public/pilot flags true | `*_claim_detected` |
| 36–37 | Missing acknowledgments | `missing_required_checklist_item` |
| 38–46 | All `contains*` flags true | `forbidden_*_detected` |
| 47–65 | Forbidden string injection (incl. 3 new real-input markers) | `*_detected` |

---

## 13. Safety invariants

### On `AiConnectedSyntheticTestHarnessContractInput` (all literal)
- `syntheticInputOnly: true`
- `realUserInputAllowed: false`, `rawInputAllowed: false`, `realRedactedInputAllowed: false`
- `photoOrOcrInputAllowed: false`, `fileUploadInputAllowed: false`, `publicAnonymousInputAllowed: false`
- `dedicatedSyntheticAdapterRequired: true`, `futureExecutionPlanRequired: true`
- `adapterExecutionPerformedNow: false`
- `branchCAuthorized: false`, `runSmartTalkAuthorized: false`, `ocrRuntimeAuthorized: false`
- `branchCCalled: false`, `runSmartTalkCalledOrImported: false`, `extractTextFromImageCalledOrImported: false`
- `liveLLMCallPerformed: false`, `aiOutputGenerationPerformed: false`, `aiOutputGenerated: false`
- `modelOutputStored: false`, `userVisibleOutputEmitted: false`, `userVisibleOutputAuthorizedByContract: false`
- `persistenceUsed: false`, `dnaSavePerformed: false`, `offlineSavePerformed: false`
- `publicRuntimeEnabled: false`, `realOperatorPilotExecuted: false`
- All `contains*` flags: `false`
- `neverUserVisible: true`

### On `AiConnectedSyntheticTestHarnessContractResult` (all literal)
- `readyForLiveLLMRuntime: false` through `readyForPersistence: false`
- `syntheticInputOnly: true`; all real/raw/OCR/file/public input allowed: `false`
- All adapter/call/authorization flags: `false`
- All LLM/AI-output/model/user-visible/persistence/public/pilot flags: `false`
- `httpCallMade: false`, `apiRouteCalled: false`
- `apiRouteModifiedBySyntheticHarnessContract: false`
- `existingRuntimeModifiedBySyntheticHarnessContract: false`
- `uiTouched: false`, `databaseOrStorageModifiedBySyntheticHarnessContract: false`
- `neverUserVisible: true`

---

## 14. Readiness decision

| Flag | Value |
|---|---|
| `readyForAiConnectedSyntheticTestHarnessExecutionPlan` | `true` (if `allPassed`) |
| `readyForLiveLLMRuntime` | **false** |
| `readyForConnectedAiRuntimeExecution` | **false** |
| `readyForRealOperatorPilotRun` | **false** |
| `readyForPilotRunNow` | **false** |
| `readyForPublicLaunch` | **false** |
| `readyForPersistence` | **false** |

---

## 15. Next phase

**Phase 8.3H — AI-Connected Synthetic Test Harness Execution Plan**

This contract only permits proceeding to Phase 8.3H when `allPassed === true`.  
Phase 8.3H defines the typed execution plan for the synthetic test harness: which synthetic input cases to run, which adapter interface to exercise, which governance-recheck steps to apply, and how to capture safe metadata-only output for review — without processing real user data or emitting user-visible output.  
No live LLM call is authorized in Phase 8.3H. No real user input is processed.
