# Phase 8.3I — AI-Connected Synthetic Harness Dry Execution

## 1. Purpose

Phase 8.3I performs a controlled dry execution of the synthetic test harness over the planned synthetic case catalog from Phase 8.3H. The dry run uses a deterministic synthetic adapter only and produces safe, metadata-only dry execution results. No live LLM is called. No real user input is processed. No model output is generated. No data is persisted.

This phase depends on Phase 8.3H (`runAiConnectedSyntheticHarnessExecutionPlanCheck()`) having passed with `readyForAiConnectedSyntheticHarnessDryExecution: true`.

---

## 2. What Dry Execution Means

"Dry execution" in this phase means:

- The synthetic harness is run over exactly the 8 synthetic case IDs defined in Phase 8.3H.
- Each case is evaluated by the deterministic synthetic adapter — a pure TypeScript function producing metadata-only case results (pass/block/uncertainty paths).
- No live LLM call is made at any point during the dry run.
- No real user document, OCR text, photo, file, or public request is processed.
- All results are metadata labels (`SyntheticDryExecutionCaseResult`) and observation enums (`SyntheticDryExecutionObservation`) — no raw text, no model output, no sensitive data.
- Post-run audit is the required next step.

---

## 3. What This Dry Execution Does and Does Not Do

### What it DOES:

- Runs `runAiConnectedSyntheticHarnessExecutionPlanCheck()` (8.3H) and verifies all prerequisite invariants.
- Builds a typed `AiConnectedSyntheticHarnessDryExecutionInput` using the deterministic synthetic adapter.
- Validates the input against all required invariants, case metadata, expected paths, observations, and acknowledgments.
- Runs 70 tamper cases and requires all to be rejected.
- Returns `AiConnectedSyntheticHarnessDryExecutionCheckResult` with `dryExecutionPerformed: true` and, on success, `readyForSyntheticHarnessPostRunAudit: true`.

### What it does NOT do:

- Does NOT call a live LLM (OpenAI, Anthropic, Gemini, or any other).
- Does NOT call `app/api/smart-talk/route.ts` Branch C.
- Does NOT call or import `run-smart-talk.ts` or `extract-text-from-image.ts`.
- Does NOT process real user input, OCR text, photo, file, or public request.
- Does NOT forward raw or redacted input to a live model.
- Does NOT generate real AI output or store model output.
- Does NOT emit user-visible output.
- Does NOT persist data (no DB writes, no DNA save, no offline save).
- Does NOT enable public runtime.
- Does NOT authorize global output or public launch.
- Does NOT modify UI, API routes, or existing runtime behavior.
- Does NOT read `process.env`.
- Does NOT make HTTP requests.

---

## 4. Deterministic Synthetic Adapter

The adapter used in this dry execution is:

```
adapterKind: "deterministic_synthetic_adapter"
```

The deterministic synthetic adapter:

- Accepts only synthetic case IDs — no real input.
- Produces only enum-labeled case results and observation metadata — no text output.
- Returns only one of the allowed `SyntheticDryExecutionCaseResult` values for each case.
- Is a pure TypeScript function — no I/O, no network, no persistence.
- Is blocked from being replaced with a live LLM adapter (validated by `invalid_adapter_kind` rejection).

---

## 5. Synthetic Case Metadata

Exactly 8 synthetic cases are run, matching the catalog from Phase 8.3H:

| Case ID                                          | Expected Path                        | Result                         |
|--------------------------------------------------|--------------------------------------|--------------------------------|
| synthetic_safe_low_risk_payment_notice           | safe_low_risk_explanation_path       | passed_expected_safe_path      |
| synthetic_deadline_explicit_date                 | explicit_deadline_caution_path       | passed_expected_safe_path      |
| synthetic_deadline_relative_missing_delivery_date| relative_deadline_uncertainty_path   | passed_expected_uncertainty_path |
| synthetic_high_risk_widerspruch_deadline         | high_risk_block_path                 | passed_expected_block_path     |
| synthetic_high_risk_immigration_uncertainty      | immigration_uncertainty_block_path   | passed_expected_block_path     |
| synthetic_missing_context_partial_document       | missing_context_block_path           | passed_expected_block_path     |
| synthetic_unsupported_legal_certainty_trap       | legal_certainty_trap_block_path      | passed_expected_block_path     |
| synthetic_unsafe_next_step_trap                  | unsafe_next_step_trap_block_path     | passed_expected_block_path     |

Each case must carry all 11 required observations (see §7).

---

## 6. Expected Paths

All 8 expected paths must be present in `expectedPaths`:

- `safe_low_risk_explanation_path`
- `explicit_deadline_caution_path`
- `relative_deadline_uncertainty_path`
- `high_risk_block_path`
- `immigration_uncertainty_block_path`
- `missing_context_block_path`
- `legal_certainty_trap_block_path`
- `unsafe_next_step_trap_block_path`

---

## 7. Metadata-Only Observations

All 11 observation types must be present in `observations` and in every case's `observations`:

| Observation                   | Description                                             |
|-------------------------------|---------------------------------------------------------|
| case_id_observed              | Synthetic case ID was observed                          |
| risk_class_observed           | Risk class metadata was observed                        |
| adapter_kind_observed         | Deterministic synthetic adapter kind was observed       |
| expected_path_observed        | Expected path was observed for the case                 |
| governance_steps_observed     | Governance steps metadata was observed                  |
| trap_expectation_observed     | Trap expectation check was observed                     |
| deadline_handling_observed    | Deadline handling metadata was observed                 |
| uncertainty_handling_observed | Uncertainty handling metadata was observed              |
| user_visible_block_observed   | User-visible output block was observed (blocked)        |
| persistence_block_observed    | Persistence block was observed (blocked)                |
| runtime_block_observed        | Runtime block was observed (blocked)                    |

---

## 8. Invariants

All 17 dry execution invariants must be present in `invariants`:

- `execution_uses_synthetic_case_ids_only`
- `execution_uses_deterministic_synthetic_adapter`
- `execution_uses_metadata_only_results`
- `no_real_input_processed`
- `no_raw_input_forwarded`
- `no_real_redacted_input_forwarded`
- `no_photo_ocr_file_input_processed`
- `no_branch_c_dependency`
- `no_run_smart_talk_dependency`
- `no_ocr_runtime_dependency`
- `no_live_llm_call`
- `no_real_ai_output_generation`
- `no_model_output_storage`
- `no_user_visible_output_emission`
- `no_persistence`
- `no_public_runtime`
- `post_run_audit_required_next`

---

## 9. Tamper Rejection Cases

The check runs 70 tamper cases. All must be rejected. Key rejection categories:

| Tamper Category                              | Rejection Reason                        |
|----------------------------------------------|-----------------------------------------|
| `executionPlanReady: false`                  | `execution_plan_not_ready`              |
| Invalid `adapterKind`                        | `invalid_adapter_kind`                  |
| Invalid `executionMode`                      | `invalid_execution_mode`                |
| Missing required case                        | `missing_required_case_result`          |
| Case with `failed_*` result                  | `missing_required_case_result`          |
| Case missing observation                     | `missing_observation`                   |
| Missing expected path                        | `missing_expected_path`                 |
| Missing observation                          | `missing_observation`                   |
| Missing invariant                            | `missing_invariant`                     |
| `dryExecutionPerformed: false`               | `execution_plan_not_ready`              |
| `deterministicSyntheticAdapterUsed: false`   | `invalid_adapter_kind`                  |
| `metadataOnlyResults: false`                 | `invalid_execution_mode`                |
| `syntheticInputOnly: false`                  | `real_input_detected`                   |
| Any real/raw/OCR/file/public input `true`    | `real_input_detected` / `raw_input_detected` / etc. |
| Any dependency/call flag `true`              | `branch_c_dependency_detected` / etc.  |
| `liveLLMCallPerformed: true`                 | `live_llm_call_detected`                |
| Any AI output/model output flag `true`       | `ai_output_generation_detected` / etc. |
| `userVisibleOutputEmitted: true`             | `user_visible_output_detected`          |
| Any persistence flag `true`                  | `persistence_detected`                  |
| `publicRuntimeEnabled: true`                 | `public_runtime_detected`               |
| `realOperatorPilotExecuted: true`            | `real_operator_pilot_detected`          |
| Missing operator/reviewer acknowledgment     | `missing_required_case_result`          |
| Any `contains*: true` flag                   | `forbidden_*_detected`                  |
| Notes with forbidden strings (incl. live LLM exec phrases) | `unsafe_dry_execution_note_detected` |
| Notes with PII (email, phone)                | `forbidden_pii_detected`                |
| Notes with document/legal markers            | `forbidden_document_content_detected`   |

---

## 10. Forbidden Content in All Fields

All string fields are scanned for:

- API keys / secrets (`sk-`, `apiKey`, `internalSecret`, `OPENAI_API_KEY=`, `VAYLO_INTERNAL_RUNTIME_SECRET=`)
- Environment references (`process.env`)
- Raw/redacted/model text markers (`rawInputText`, `redactedText`, `fullDraftText`, `modelOutput`)
- Stored data markers (`stored user input`, `stored redacted text`, `stored model output`)
- PII (email patterns, phone patterns, `IBAN`, `Steuer-ID`, `Aktenzeichen`, `BG-Nr`, `Sehr geehrter`)
- Sensitive personal markers (`Name:`, `Adresse:`, `Geburtsdatum:`, `Kind:`)
- Legal risk content (`Mietvertrag`, `Kündigung`, `Abschiebung`)
- Unsafe certainty phrases (`Sie müssen`, `garantiert`, `fristlos sicher`, `rechtlich sicher`)
- Global/public authorization phrases (`public launch enabled`, `all outputs authorized`, `global approval`, `branch c authorized`, `approved for user display`, `auto-approved`, `show to user now`)
- Real input phrases (`real user document`, `real OCR text`, `production runtime enabled`)
- Live LLM execution phrases (`harness executed with live llm`, `live llm executed`, `real operator pilot executed`, `real model output`)

---

## 11. Safety Invariants

| Invariant                                         | Value           |
|---------------------------------------------------|-----------------|
| `dryExecutionPerformed`                           | **`true`** (first positive execution flag) |
| `deterministicSyntheticAdapterUsed`               | **`true`**      |
| `metadataOnlyResults`                             | **`true`**      |
| `syntheticInputOnly`                              | `true`          |
| `realUserInputAllowed`                            | **`false`**     |
| `rawInputAllowed`                                 | **`false`**     |
| `realRedactedInputAllowed`                        | **`false`**     |
| `photoOrOcrInputAllowed`                          | **`false`**     |
| `fileUploadInputAllowed`                          | **`false`**     |
| `publicAnonymousInputAllowed`                     | **`false`**     |
| `branchCDependencyAllowed`                        | **`false`**     |
| `runSmartTalkDependencyAllowed`                   | **`false`**     |
| `ocrRuntimeDependencyAllowed`                     | **`false`**     |
| `branchCCalled`                                   | **`false`**     |
| `runSmartTalkCalledOrImported`                    | **`false`**     |
| `extractTextFromImageCalledOrImported`            | **`false`**     |
| `liveLLMCallPerformed`                            | **`false`**     |
| `aiOutputGenerationPerformed`                     | **`false`**     |
| `aiOutputGenerated`                               | **`false`**     |
| `modelOutputStored`                               | **`false`**     |
| `userVisibleOutputEmitted`                        | **`false`**     |
| `userVisibleOutputAuthorizedByDryExecution`       | **`false`**     |
| `persistenceUsed`                                 | **`false`**     |
| `dnaSavePerformed`                                | **`false`**     |
| `offlineSavePerformed`                            | **`false`**     |
| `publicRuntimeEnabled`                            | **`false`**     |
| `realOperatorPilotExecuted`                       | **`false`**     |
| `readyForLiveLLMRuntime`                          | **`false`**     |
| `readyForConnectedAiRuntimeExecution`             | **`false`**     |
| `readyForRealOperatorPilotRun`                    | **`false`**     |
| `readyForPilotRunNow`                             | **`false`**     |
| `readyForPublicLaunch`                            | **`false`**     |
| `readyForPersistence`                             | **`false`**     |
| `httpCallMade`                                    | **`false`**     |
| `apiRouteCalled`                                  | **`false`**     |
| `apiRouteModifiedByDryExecution`                  | **`false`**     |
| `existingRuntimeModifiedByDryExecution`           | **`false`**     |
| `uiTouched`                                       | **`false`**     |
| `databaseOrStorageModifiedByDryExecution`         | **`false`**     |
| `neverUserVisible`                                | **`true`**      |

---

## 12. Readiness Decision

On success (`allPassed: true`):

```
readyForSyntheticHarnessPostRunAudit: true
readyForLiveLLMRuntime: false
readyForConnectedAiRuntimeExecution: false
readyForRealOperatorPilotRun: false
readyForPilotRunNow: false
readyForPublicLaunch: false
readyForPersistence: false
```

**This dry execution permits only the next phase: Synthetic Harness Post-Run Audit (Phase 8.3J).**

---

## 13. Next Phase

**Phase 8.3J — Synthetic Harness Post-Run Audit**

The post-run audit will review the dry execution results, verify all invariants were maintained throughout the run, and determine whether further phases of the Connected AI Runtime Authorization epoch may proceed.
