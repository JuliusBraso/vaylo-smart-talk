# REDACTED INPUT FORWARDING CONTRACT — Phase 8.3C

## 1. Purpose

Define the conditions under which a **future governance-controlled AI adapter** may receive redacted input.  
This contract builds on the Live LLM Boundary Contract (8.3B), which explicitly isolated the existing public Smart Talk runtime from the governance chain.

This contract does **not** forward any input.  
This contract does **not** call a live LLM.  
This contract does **not** authorize `run-smart-talk.ts` for the governance chain.  
This contract does **not** call public Branch C.  
This contract does **not** call the OCR runtime.  
This contract does **not** generate AI output.  
This contract does **not** authorize persistence, public launch, or user-visible output.

---

## 2. What this forwarding contract means

- The 8.3B Live LLM Boundary Contract has been verified.
- A forwarding target policy is now defined: only a dedicated governance AI adapter may ever receive forwarded input.
- The allowed and blocked input categories are established.
- Redaction proof requirements and forwarding preconditions are locked.
- The only positive readiness gate set here is `readyForAiOutputGovernanceRecheckContract`.

---

## 3. What this contract does NOT authorize

| Action | Status |
|---|---|
| Forward raw input | **BLOCKED** |
| Forward redacted input to a live model | **BLOCKED by this contract** |
| Call live LLM | **BLOCKED** |
| Call run-smart-talk.ts | **NOT AUTHORIZED** |
| Call public Branch C | **NOT AUTHORIZED** |
| Call OCR runtime | **NOT AUTHORIZED** |
| Generate AI output | **BLOCKED** |
| User-visible output | **BLOCKED** |
| Authorize pilot run | **BLOCKED** |
| Authorize public launch | **BLOCKED** |
| Persist records | **BLOCKED** |
| Process real user input | **BLOCKED** |
| DNA save or offline save | **BLOCKED** |

---

## 4. Forwarding target policy

All five policies must be present in a valid forwarding input:

- `dedicated_governance_ai_adapter_required`
- `existing_run_smart_talk_not_authorized_yet`
- `public_branch_c_not_authorized`
- `ocr_runtime_not_authorized_for_text_forwarding`
- `adapter_selection_requires_future_contract`

---

## 5. Allowed and blocked input categories

### Allowed (synthetic / redacted only)

- `synthetic_control_text`
- `redacted_bureaucratic_excerpt`
- `redacted_operator_test_question`

### Blocked (all real / sensitive categories)

- `raw_user_input`
- `unredacted_bureaucratic_letter`
- `photo_ocr_input`
- `file_upload_input`
- `full_document_text`
- `multi_document_bundle`
- `public_anonymous_input`
- `unattended_input`
- `third_party_sensitive_data`
- `raw_pii_input`
- `raw_bank_or_tax_identifier_input`
- `raw_children_data_input`
- `medical_emergency_input`
- `deportation_deadline_uncertain_input`
- `legal_appeal_deadline_uncertain_input`
- `secrets_or_api_keys_input`

---

## 6. Redaction proof requirements

All 20 requirements must be present:

- `names_redacted`
- `addresses_redacted`
- `phone_numbers_redacted`
- `emails_redacted`
- `iban_redacted`
- `steuer_id_redacted`
- `aktenzeichen_redacted`
- `bg_nr_redacted`
- `insurance_numbers_redacted`
- `children_data_redacted`
- `secret_or_api_key_redacted`
- `raw_identifiers_removed`
- `partial_input_marked`
- `authority_name_preserved_only_when_relevant`
- `document_type_preserved_only_when_relevant`
- `deadline_preserved_only_with_uncertainty_label`
- `amount_preserved_only_when_needed_for_explanation`
- `manual_reviewer_clearance_required`
- `redaction_uncertainty_blocks_forwarding`
- `high_risk_legal_uncertainty_blocks_forwarding`

---

## 7. Forwarding preconditions

All 12 preconditions must be present:

- `live_llm_boundary_contract_ready`
- `existing_runtime_isolation_preserved`
- `target_adapter_not_selected_yet`
- `raw_input_forwarding_blocked`
- `redacted_input_requires_proof`
- `redacted_input_requires_manual_review_clearance`
- `redacted_input_requires_partial_input_marker_if_excerpt`
- `ai_output_governance_recheck_required_next`
- `ai_output_user_visible_blocked`
- `persistence_blocked`
- `public_runtime_blocked`
- `live_llm_runtime_still_blocked_by_this_contract`

---

## 8. Checklist

All 18 checklist items must be confirmed:

- `forwarding_target_policy_reviewed`
- `allowed_categories_reviewed`
- `blocked_categories_reviewed`
- `redaction_proof_requirements_reviewed`
- `forwarding_preconditions_reviewed`
- `raw_input_forwarding_blocked`
- `redacted_input_forwarding_not_executed`
- `existing_run_smart_talk_not_called`
- `public_branch_c_not_called`
- `ocr_runtime_not_called`
- `live_llm_not_called`
- `ai_output_not_generated`
- `user_visible_output_blocked`
- `persistence_blocked`
- `public_runtime_blocked`
- `manual_review_required`
- `governance_recheck_required_next`
- `no_real_input_processed_by_this_contract`

---

## 9. Forbidden values / content

The following strings and patterns are forbidden in all forwarding fields and notes:

- `sk-`, `OPENAI_API_KEY=`, `VAYLO_INTERNAL_RUNTIME_SECRET=`, `process.env`
- `apiKey`, `internalSecret`
- `rawInputText`, `redactedText`, `fullDraftText`, `modelOutput`
- `stored user input`, `stored redacted text`, `stored model output`
- `IBAN`, `Steuer-ID`, `Aktenzeichen`, `Sehr geehrter`, `BG-Nr`
- `john@example.com`, `+49 170 1234567`
- `Name:`, `Adresse:`, `Geburtsdatum:`, `Kind:`
- `Mietvertrag`, `Kündigung`, `Abschiebung`
- Email-like patterns
- Phone-like patterns

---

## 10. Tamper rejection cases

The check function runs 51 tamper cases. Every case must be rejected.

| # | Tamper | Expected rejection reason |
|---|---|---|
| 1 | `liveLlmBoundaryReady=false` | `live_llm_boundary_not_ready` |
| 2 | Missing forwarding target policy | `forwarding_target_policy_missing` |
| 3 | `clearanceLevel="no_forwarding"` | `invalid_clearance_level` |
| 4 | Missing allowed input category | `missing_allowed_input_category` |
| 5 | Missing blocked input category | `missing_blocked_input_category` |
| 6 | Missing redaction proof requirement | `missing_redaction_proof_requirement` |
| 7 | Missing forwarding precondition | `missing_forwarding_precondition` |
| 8 | Missing checklist item | `missing_required_checklist_item` |
| 9 | `redactionProofComplete=false` | `redaction_proof_incomplete` |
| 10 | `manualReviewClearanceRequired=false` | `missing_manual_review_clearance` |
| 11 | `manualReviewClearanceGrantedByContract=true` | `missing_manual_review_clearance` |
| 12 | `redactionUncertaintyBlocksForwarding=false` | `redaction_uncertainty_not_blocked` |
| 13 | `highRiskUncertaintyBlocksForwarding=false` | `high_risk_uncertainty_not_blocked` |
| 14 | `rawInputForwardingAllowed=true` | `raw_input_forwarding_claim_detected` |
| 15 | `redactedInputForwardingExecuted=true` | `redacted_input_forwarding_execution_claim_detected` |
| 16 | `realInputProcessedByContract=true` | `real_input_processed_claim_detected` |
| 17 | `liveLLMCallPerformed=true` | `live_llm_call_claim_detected` |
| 18 | `aiOutputGenerated=true` | `ai_output_generation_claim_detected` |
| 19 | `modelOutputStored=true` | `model_output_storage_claim_detected` |
| 20 | `userVisibleOutputAllowed=true` | `user_visible_output_claim_detected` |
| 21 | `runSmartTalkCalledOrImported=true` | `run_smart_talk_call_claim_detected` |
| 22 | `publicBranchCCalled=true` | `public_branch_c_call_claim_detected` |
| 23 | `extractTextFromImageCalledOrImported=true` | `ocr_runtime_call_claim_detected` |
| 24 | Missing operator acknowledgment | `missing_required_checklist_item` |
| 25 | Missing reviewer acknowledgment | `missing_required_checklist_item` |
| 26 | `containsSecret=true` | `forbidden_secret_detected` |
| 27 | `containsEnvValue=true` | `forbidden_env_value_detected` |
| 28 | `containsApiKey=true` | `forbidden_api_key_detected` |
| 29 | `containsRawInputText=true` | `forbidden_raw_text_detected` |
| 30 | `containsRedactedText=true` | `forbidden_redacted_text_detected` |
| 31 | `containsModelOutput=true` | `forbidden_model_output_detected` |
| 32 | `containsDocumentContent=true` | `forbidden_document_content_detected` |
| 33 | `containsUserPii=true` | `forbidden_pii_detected` |
| 34 | Notes: `"process.env"` | `forbidden_env_value_detected` |
| 35 | Notes: `"OPENAI_API_KEY="` | `forbidden_env_value_detected` |
| 36 | Notes: `"sk-"` | `forbidden_secret_detected` |
| 37 | Notes: `"stored user input"` | `unsafe_forwarding_note_detected` |
| 38 | Notes: `"stored redacted text"` | `unsafe_forwarding_note_detected` |
| 39 | Notes: `"stored model output"` | `forbidden_model_output_detected` |
| 40 | Notes: email | `forbidden_pii_detected` |
| 41 | Notes: phone | `forbidden_pii_detected` |
| 42 | Notes: `"Aktenzeichen"` | `forbidden_document_content_detected` |
| 43 | Notes: `"Name:"` | `forbidden_document_content_detected` |
| 44 | Notes: `"Geburtsdatum:"` | `forbidden_document_content_detected` |
| 45 | Notes: `"Abschiebung"` | `forbidden_document_content_detected` |
| 46 | `containsRealUserInput=true` | `real_input_processed_claim_detected` |
| 47 | `persistenceUsed=true` | `persistence_claim_detected` |
| 48 | `dnaSavePerformed=true` | `persistence_claim_detected` |
| 49 | `offlineSavePerformed=true` | `persistence_claim_detected` |
| 50 | `publicRuntimeEnabled=true` | `public_runtime_claim_detected` |
| 51 | `emittedToUserNow=true` | `user_visible_output_claim_detected` |

---

## 11. Safety invariants

### On `RedactedInputForwardingContractInput` (all literal)
- `manualReviewClearanceRequired: true`
- `manualReviewClearanceGrantedByContract: false`
- `redactionUncertaintyBlocksForwarding: true`
- `highRiskUncertaintyBlocksForwarding: true`
- `rawInputForwardingAllowed: false`
- `redactedInputForwardingExecuted: false`
- `realInputProcessedByContract: false`
- `liveLLMCallPerformed: false`
- `aiOutputGenerated: false`
- `modelOutputStored: false`
- `userVisibleOutputAllowed: false`
- `runSmartTalkCalledOrImported: false`
- `publicBranchCCalled: false`
- `extractTextFromImageCalledOrImported: false`
- All `contains*` flags: `false`
- `persistenceUsed: false`, `dnaSavePerformed: false`, `offlineSavePerformed: false`
- `publicRuntimeEnabled: false`, `emittedToUserNow: false`
- `neverUserVisible: true`

### On `RedactedInputForwardingContractResult` (all literal)
- `readyForLiveLLMRuntime: false`
- `readyForConnectedAiRuntimeExecution: false`
- `readyForRealOperatorPilotRun: false`
- `readyForPilotRunNow: false`
- `readyForPublicLaunch: false`
- `readyForPersistence: false`
- All execution/runtime/persistence flags: `false`
- `httpCallMade: false`, `apiRouteCalled: false`
- `apiRouteModifiedByForwardingContract: false`
- `existingRuntimeModifiedByForwardingContract: false`
- `uiTouched: false`
- `databaseOrStorageModifiedByForwardingContract: false`
- `neverUserVisible: true`

---

## 12. Readiness decision

| Flag | Value |
|---|---|
| `readyForAiOutputGovernanceRecheckContract` | `true` (if `allPassed`) |
| `readyForLiveLLMRuntime` | **false** |
| `readyForConnectedAiRuntimeExecution` | **false** |
| `readyForRealOperatorPilotRun` | **false** |
| `readyForPilotRunNow` | **false** |
| `readyForPublicLaunch` | **false** |
| `readyForPersistence` | **false** |

---

## 13. Next phase

**Phase 8.3D — AI Output Governance Recheck Contract**

This contract only permits proceeding to Phase 8.3D when `allPassed === true`.  
This contract only permits the next contract: AI Output Governance Recheck Contract.  
No live LLM is called in Phase 8.3D either; it only defines governance and recheck policy for future AI output.
