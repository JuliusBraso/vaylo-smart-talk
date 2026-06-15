# AI OUTPUT GOVERNANCE RECHECK CONTRACT — Phase 8.3D

## 1. Purpose

Define how future AI output must be treated as **untrusted** and rechecked by governance before any user-visible output can be authorized.  
This contract builds on Phase 8.3C (Redacted Input Forwarding Contract) and establishes the authority boundary for all AI-generated content.

This contract does **not** generate AI output.  
This contract does **not** call a live LLM.  
This contract does **not** store model output.  
This contract does **not** authorize user-visible output.  
This contract does **not** authorize `run-smart-talk.ts` for the governance chain.  
This contract does **not** call public Branch C.  
This contract does **not** call the OCR runtime.  
This contract does **not** authorize persistence, public launch, or pilot execution.  
This contract only permits the next contract: Manual Review Before User-Visible Output Contract.

---

## 2. What AI output governance recheck means

- All AI output is untrusted by default and not authoritative.
- AI output cannot become user-visible directly — it must pass governance recheck first.
- AI output cannot be stored directly — only safe metadata is permitted.
- Governance recheck must run before any manual review step.
- Legal certainty and deadline claims require independent evidence before they can proceed.
- Uncertainty and partial-input limitations must be preserved in any downstream handling.
- The only positive readiness gate set here is `readyForManualReviewBeforeUserVisibleOutputContract`.

---

## 3. What this contract does NOT authorize

| Action | Status |
|---|---|
| Generate AI output | **BLOCKED** |
| Call live LLM | **BLOCKED** |
| Store model output | **BLOCKED** |
| User-visible output | **BLOCKED** |
| Call run-smart-talk.ts | **NOT AUTHORIZED** |
| Call public Branch C | **NOT AUTHORIZED** |
| Call OCR runtime | **NOT AUTHORIZED** |
| Legal certainty claim without evidence | **BLOCKED** |
| Deadline claim without evidence | **BLOCKED** |
| Authorize pilot run | **BLOCKED** |
| Authorize public launch | **BLOCKED** |
| Persist records | **BLOCKED** |
| DNA save or offline save | **BLOCKED** |
| Process real user input | **BLOCKED** |

---

## 4. AI output trust boundary

All 6 boundaries must be present in a valid input:

- `ai_output_untrusted_by_default`
- `ai_output_not_authoritative`
- `ai_output_not_user_visible_directly`
- `ai_output_not_persistable_directly`
- `ai_output_requires_governance_recheck`
- `ai_output_requires_manual_review_before_display`

---

## 5. Governance recheck requirements

All 16 requirements must be present:

- `reality_matrix_recheck_required`
- `evidence_gate_recheck_required`
- `hallucination_trap_recheck_required`
- `wording_governance_recheck_required`
- `urgency_recheck_required`
- `next_step_safety_recheck_required`
- `legal_certainty_claims_blocked`
- `deadline_claims_require_evidence`
- `authority_claims_require_evidence`
- `amount_claims_require_evidence`
- `document_type_claims_require_evidence`
- `missing_context_must_be_preserved`
- `uncertainty_must_be_preserved`
- `partial_input_limit_must_be_preserved`
- `manual_review_required_before_user_visible_output`
- `audit_metadata_required_without_content_storage`

---

## 6. Blocked claim categories without evidence

All 12 categories must be present:

- `legal_certainty_claim`
- `deadline_or_frist_claim`
- `appeal_or_objection_window_claim`
- `immigration_consequence_claim`
- `payment_obligation_claim`
- `refund_or_benefit_entitlement_claim`
- `authority_instruction_claim`
- `document_type_classification_claim`
- `amount_due_claim`
- `penalty_or_sanction_claim`
- `guaranteed_outcome_claim`
- `autonomous_action_instruction_claim`

---

## 7. Allowed post-recheck dispositions

All 7 dispositions must be present:

- `candidate_safe_for_manual_review`
- `blocked_needs_human_review`
- `blocked_due_to_unsupported_claims`
- `blocked_due_to_unsafe_certainty`
- `blocked_due_to_deadline_uncertainty`
- `blocked_due_to_missing_context`
- `blocked_due_to_policy_violation`

---

## 8. Checklist

All 16 checklist items must be confirmed:

- `ai_output_trust_boundary_reviewed`
- `governance_recheck_requirements_reviewed`
- `unsupported_claim_blocks_reviewed`
- `manual_review_requirement_confirmed`
- `user_visible_output_blocked`
- `persistence_blocked`
- `live_llm_runtime_still_blocked_by_this_contract`
- `ai_output_generation_not_performed`
- `model_output_not_stored`
- `legal_certainty_block_confirmed`
- `deadline_evidence_requirement_confirmed`
- `uncertainty_preservation_confirmed`
- `partial_input_limitation_confirmed`
- `audit_metadata_only_confirmed`
- `public_runtime_blocked`
- `existing_runtime_isolation_preserved`

---

## 9. Forbidden values / content

The following strings and patterns are forbidden in all recheck fields and notes:

- `sk-`, `OPENAI_API_KEY=`, `VAYLO_INTERNAL_RUNTIME_SECRET=`, `process.env`
- `apiKey`, `internalSecret`
- `rawInputText`, `redactedText`, `fullDraftText`, `modelOutput`
- `stored user input`, `stored redacted text`, `stored model output`
- `IBAN`, `Steuer-ID`, `Aktenzeichen`, `Sehr geehrter`, `BG-Nr`
- `john@example.com`, `+49 170 1234567`
- `Name:`, `Adresse:`, `Geburtsdatum:`, `Kind:`
- `Mietvertrag`, `Kündigung`, `Abschiebung`
- `Sie müssen`, `garantiert`, `fristlos sicher`, `rechtlich sicher`
- Email-like patterns
- Phone-like patterns

---

## 10. Tamper rejection cases

The check function runs 55 tamper cases. Every case must be rejected.

| # | Tamper | Expected rejection reason |
|---|---|---|
| 1 | `redactedInputForwardingReady=false` | `redacted_input_forwarding_not_ready` |
| 2 | Missing trust boundary | `missing_trust_boundary` |
| 3 | Missing recheck requirement | `missing_recheck_requirement` |
| 4 | Missing blocked claim category | `missing_blocked_claim_category` |
| 5 | Missing allowed disposition | `missing_allowed_disposition` |
| 6 | Missing checklist item | `missing_required_checklist_item` |
| 7 | `governanceRecheckRequired=false` | `governance_recheck_missing` |
| 8 | `manualReviewRequiredBeforeUserVisibleOutput=false` | `manual_review_missing` |
| 9 | `uncertaintyPreservationRequired=false` | `uncertainty_preservation_missing` |
| 10 | `partialInputLimitationRequired=false` | `partial_input_limitation_missing` |
| 11 | `legalCertaintyWithoutEvidenceAllowed=true` | `legal_certainty_allowed_without_evidence` |
| 12 | `deadlineClaimWithoutEvidenceAllowed=true` | `deadline_claim_allowed_without_evidence` |
| 13 | `aiOutputGenerationPerformed=true` | `ai_output_generation_claim_detected` |
| 14 | `aiOutputGenerated=true` | `ai_output_generation_claim_detected` |
| 15 | `modelOutputStored=true` | `model_output_storage_claim_detected` |
| 16 | `userVisibleOutputAllowed=true` | `user_visible_output_claim_detected` |
| 17 | `persistenceUsed=true` | `persistence_claim_detected` |
| 18 | `liveLLMCallPerformed=true` | `live_llm_call_claim_detected` |
| 19 | `realInputProcessedByContract=true` | `real_input_processed_claim_detected` |
| 20 | `rawInputForwarded=true` | `raw_input_forwarding_claim_detected` |
| 21 | `redactedInputForwardingExecuted=true` | `redacted_input_forwarding_claim_detected` |
| 22 | `runSmartTalkCalledOrImported=true` | `run_smart_talk_call_claim_detected` |
| 23 | `publicBranchCCalled=true` | `public_branch_c_call_claim_detected` |
| 24 | `extractTextFromImageCalledOrImported=true` | `ocr_runtime_call_claim_detected` |
| 25 | Missing operator acknowledgment | `missing_required_checklist_item` |
| 26 | Missing reviewer acknowledgment | `missing_required_checklist_item` |
| 27 | `containsSecret=true` | `forbidden_secret_detected` |
| 28 | `containsEnvValue=true` | `forbidden_env_value_detected` |
| 29 | `containsApiKey=true` | `forbidden_api_key_detected` |
| 30 | `containsRawInputText=true` | `forbidden_raw_text_detected` |
| 31 | `containsRedactedText=true` | `forbidden_redacted_text_detected` |
| 32 | `containsModelOutput=true` | `forbidden_model_output_detected` |
| 33 | `containsDocumentContent=true` | `forbidden_document_content_detected` |
| 34 | `containsUserPii=true` | `forbidden_pii_detected` |
| 35 | Notes: `"process.env"` | `forbidden_env_value_detected` |
| 36 | Notes: `"OPENAI_API_KEY="` | `forbidden_env_value_detected` |
| 37 | Notes: `"sk-"` | `forbidden_secret_detected` |
| 38 | Notes: `"stored user input"` | `unsafe_recheck_note_detected` |
| 39 | Notes: `"stored redacted text"` | `unsafe_recheck_note_detected` |
| 40 | Notes: `"stored model output"` | `forbidden_model_output_detected` |
| 41 | Notes: email | `forbidden_pii_detected` |
| 42 | Notes: phone | `forbidden_pii_detected` |
| 43 | Notes: `"Aktenzeichen"` | `forbidden_document_content_detected` |
| 44 | Notes: `"Name:"` | `forbidden_document_content_detected` |
| 45 | Notes: `"Geburtsdatum:"` | `forbidden_document_content_detected` |
| 46 | Notes: `"Abschiebung"` | `forbidden_document_content_detected` |
| 47 | Notes: `"Sie müssen"` | `unsafe_recheck_note_detected` |
| 48 | Notes: `"garantiert"` | `unsafe_recheck_note_detected` |
| 49 | Notes: `"fristlos sicher"` | `unsafe_recheck_note_detected` |
| 50 | Notes: `"rechtlich sicher"` | `unsafe_recheck_note_detected` |
| 51 | `containsRealUserInput=true` | `real_input_processed_claim_detected` |
| 52 | `dnaSavePerformed=true` | `persistence_claim_detected` |
| 53 | `offlineSavePerformed=true` | `persistence_claim_detected` |
| 54 | `publicRuntimeEnabled=true` | `user_visible_output_claim_detected` |
| 55 | `emittedToUserNow=true` | `user_visible_output_claim_detected` |

---

## 11. Safety invariants

### On `AiOutputGovernanceRecheckContractInput` (all literal)
- `governanceRecheckRequired: true`
- `manualReviewRequiredBeforeUserVisibleOutput: true`
- `uncertaintyPreservationRequired: true`
- `partialInputLimitationRequired: true`
- `legalCertaintyWithoutEvidenceAllowed: false`
- `deadlineClaimWithoutEvidenceAllowed: false`
- `aiOutputGenerationPerformed: false`, `aiOutputGenerated: false`
- `modelOutputStored: false`, `userVisibleOutputAllowed: false`
- `persistenceUsed: false`, `liveLLMCallPerformed: false`
- `realInputProcessedByContract: false`, `rawInputForwarded: false`
- `redactedInputForwardingExecuted: false`
- `runSmartTalkCalledOrImported: false`
- `publicBranchCCalled: false`
- `extractTextFromImageCalledOrImported: false`
- All `contains*` flags: `false`
- `dnaSavePerformed: false`, `offlineSavePerformed: false`
- `publicRuntimeEnabled: false`, `emittedToUserNow: false`
- `neverUserVisible: true`

### On `AiOutputGovernanceRecheckContractResult` (all literal)
- `readyForLiveLLMRuntime: false`
- `readyForConnectedAiRuntimeExecution: false`
- `readyForRealOperatorPilotRun: false`
- `readyForPilotRunNow: false`
- `readyForPublicLaunch: false`
- `readyForPersistence: false`
- All execution/AI-output/forwarding/runtime/persistence flags: `false`
- `httpCallMade: false`, `apiRouteCalled: false`
- `apiRouteModifiedByRecheckContract: false`
- `existingRuntimeModifiedByRecheckContract: false`
- `uiTouched: false`
- `databaseOrStorageModifiedByRecheckContract: false`
- `neverUserVisible: true`

---

## 12. Readiness decision

| Flag | Value |
|---|---|
| `readyForManualReviewBeforeUserVisibleOutputContract` | `true` (if `allPassed`) |
| `readyForLiveLLMRuntime` | **false** |
| `readyForConnectedAiRuntimeExecution` | **false** |
| `readyForRealOperatorPilotRun` | **false** |
| `readyForPilotRunNow` | **false** |
| `readyForPublicLaunch` | **false** |
| `readyForPersistence` | **false** |

---

## 13. Next phase

**Phase 8.3E — Manual Review Before User-Visible Output Contract**

This contract only permits proceeding to Phase 8.3E when `allPassed === true`.  
In Phase 8.3E, the typed contract for the mandatory manual review step before any user-visible output is authorized will be defined.  
No live LLM is called in Phase 8.3E either.
