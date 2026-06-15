# MANUAL REVIEW BEFORE USER-VISIBLE OUTPUT CONTRACT — Phase 8.3E

## 1. Purpose

Define the mandatory human-in-the-loop manual review gate that must be passed before any future user-visible output authorization contract can proceed.  
This contract builds on Phase 8.3D (AI Output Governance Recheck Contract).

This contract does **not** authorize user-visible output.  
This contract does **not** execute manual review.  
This contract does **not** generate or store AI output.  
This contract does **not** call a live LLM.  
This contract does **not** authorize `run-smart-talk.ts` for the governance chain.  
This contract does **not** call public Branch C or the OCR runtime.  
This contract does **not** authorize persistence, public launch, or pilot execution.  
This contract only permits the next contract: **User-Visible Output Authorization Contract**.

---

## 2. What manual review before user-visible output means

- AI output governance recheck (8.3D) must have passed before this contract is valid.
- Manual review by a named operator and reviewer with explicit roles is required.
- Reviewer responsibility must be explicitly acknowledged.
- Automatic system approval and anonymous review are absolutely blocked.
- The selected disposition cannot authorize user-visible output now — a separate contract is always required.
- Evidence metadata must be present but content storage is blocked.
- Legal certainty and deadline claims without evidence remain blocked.
- Unsupported claims, unsafe certainty, and missing context remain blocked.
- The only positive readiness gate set here is `readyForUserVisibleOutputAuthorizationContract`.

---

## 3. What this contract does NOT authorize

| Action | Status |
|---|---|
| User-visible output | **BLOCKED** |
| Execute manual review | **NOT PERFORMED** |
| Generate AI output | **BLOCKED** |
| Call live LLM | **BLOCKED** |
| Store model output | **BLOCKED** |
| Automatic system approval | **BLOCKED** |
| Anonymous review | **BLOCKED** |
| Call run-smart-talk.ts | **NOT AUTHORIZED** |
| Call public Branch C | **NOT AUTHORIZED** |
| Call OCR runtime | **NOT AUTHORIZED** |
| Persist records | **BLOCKED** |
| DNA save or offline save | **BLOCKED** |
| Authorize pilot run | **BLOCKED** |
| Authorize public launch | **BLOCKED** |

---

## 4. Identity requirements

All 8 requirements must be present:

- `operator_identity_required`
- `reviewer_identity_required`
- `reviewer_role_required`
- `operator_and_reviewer_must_be_distinct_for_high_risk`
- `reviewer_must_acknowledge_responsibility`
- `automatic_system_approval_blocked`
- `anonymous_review_blocked`
- `missing_reviewer_identity_blocks_progress`

---

## 5. Reviewer roles

All 3 roles must be present:

- `operator`
- `reviewer`
- `safety_reviewer`

---

## 6. Review dispositions

All 9 dispositions must be present:

- `candidate_safe_for_user_visible_authorization_contract`
- `blocked_due_to_unsupported_claims`
- `blocked_due_to_unsafe_certainty`
- `blocked_due_to_deadline_uncertainty`
- `blocked_due_to_missing_context`
- `blocked_due_to_policy_violation`
- `blocked_due_to_high_risk_domain`
- `requires_rework`
- `requires_expert_referral`

Note: `candidate_safe_for_user_visible_authorization_contract` does NOT authorize user-visible output directly. It only allows the next contract to begin.

---

## 7. Required evidence metadata

All 14 items must be present:

- `governance_recheck_result_present`
- `trust_boundary_result_present`
- `blocked_claim_category_result_present`
- `uncertainty_preservation_result_present`
- `partial_input_limitation_result_present`
- `legal_certainty_check_result_present`
- `deadline_evidence_check_result_present`
- `next_step_safety_check_result_present`
- `wording_governance_check_result_present`
- `manual_reviewer_identity_present`
- `manual_reviewer_disposition_present`
- `manual_reviewer_acknowledgment_present`
- `no_content_storage_confirmed`
- `user_visible_output_still_blocked`

---

## 8. Block conditions

All 14 block conditions must be present:

- `unsupported_legal_certainty_claim`
- `unsupported_deadline_claim`
- `unsupported_authority_instruction_claim`
- `unsafe_must_language`
- `guaranteed_outcome_claim`
- `missing_context_not_preserved`
- `partial_input_limitation_missing`
- `high_risk_immigration_consequence`
- `high_risk_financial_sanction`
- `high_risk_appeal_or_objection_window`
- `autonomous_action_instruction`
- `direct_user_visible_output_attempt`
- `persistence_or_storage_attempt`
- `public_runtime_attempt`

---

## 9. Checklist

All 18 checklist items must be confirmed:

- `identity_requirements_reviewed`
- `reviewer_responsibility_acknowledged`
- `governance_recheck_result_reviewed`
- `evidence_metadata_reviewed`
- `disposition_reviewed`
- `block_conditions_reviewed`
- `legal_certainty_block_reviewed`
- `deadline_uncertainty_block_reviewed`
- `missing_context_preservation_reviewed`
- `partial_input_limitation_reviewed`
- `next_step_safety_reviewed`
- `direct_user_visible_output_blocked`
- `persistence_blocked`
- `public_runtime_blocked`
- `live_llm_runtime_still_blocked_by_this_contract`
- `existing_runtime_isolation_preserved`
- `no_ai_output_generated_by_this_contract`
- `no_model_output_stored_by_this_contract`

---

## 10. Forbidden values / content

The following strings and patterns are forbidden in all manual review fields and notes:

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
- Email-like patterns
- Phone-like patterns

---

## 11. Tamper rejection cases

The check function runs 70 tamper cases. Every case must be rejected.

| # | Tamper | Expected rejection reason |
|---|---|---|
| 1 | `aiOutputGovernanceRecheckReady=false` | `ai_output_governance_recheck_not_ready` |
| 2 | Missing identity requirement | `missing_identity_requirement` |
| 3 | Missing reviewer role | `missing_identity_requirement` |
| 4 | Missing disposition option | `missing_disposition` |
| 5 | Missing evidence metadata | `missing_required_evidence_metadata` |
| 6 | Missing block condition | `missing_block_condition` |
| 7 | Missing checklist item | `missing_required_checklist_item` |
| 8 | `operatorIdentityPresent=false` | `missing_identity_requirement` |
| 9 | `reviewerIdentityPresent=false` | `missing_identity_requirement` |
| 10 | `reviewerRolePresent=false` | `missing_identity_requirement` |
| 11 | `reviewerResponsibilityAcknowledged=false` | `reviewer_responsibility_missing` |
| 12 | `automaticSystemApprovalAllowed=true` | `automatic_system_approval_detected` |
| 13 | `anonymousReviewAllowed=true` | `anonymous_review_detected` |
| 14 | `selectedDispositionAllowsUserVisibleOutputNow=true` | `unsafe_disposition_detected` |
| 15 | `userVisibleOutputAuthorizationRequiredNext=false` | `unsafe_disposition_detected` |
| 16 | `governanceRecheckResultPresent=false` | `missing_required_evidence_metadata` |
| 17 | `evidenceMetadataOnly=false` | `missing_required_evidence_metadata` |
| 18 | `contentStorageAllowed=true` | `persistence_claim_detected` |
| 19 | `legalCertaintyWithoutEvidenceAllowed=true` | `legal_certainty_allowed_without_evidence` |
| 20 | `deadlineClaimWithoutEvidenceAllowed=true` | `deadline_claim_allowed_without_evidence` |
| 21 | `unsupportedClaimAllowed=true` | `unsupported_claim_allowed` |
| 22 | `unsafeCertaintyAllowed=true` | `unsafe_certainty_allowed` |
| 23 | `missingContextAllowed=true` | `missing_context_allowed` |
| 24 | `partialInputLimitationRequired=false` | `partial_input_limitation_missing` |
| 25 | `userVisibleOutputAuthorized=true` | `user_visible_output_authorized_too_early` |
| 26 | `emittedToUserNow=true` | `emitted_to_user_claim_detected` |
| 27 | `aiOutputGenerationPerformed=true` | `ai_output_generation_claim_detected` |
| 28 | `aiOutputGenerated=true` | `ai_output_generation_claim_detected` |
| 29 | `modelOutputStored=true` | `model_output_storage_claim_detected` |
| 30 | `persistenceUsed=true` | `persistence_claim_detected` |
| 31 | `liveLLMCallPerformed=true` | `live_llm_call_claim_detected` |
| 32 | `realInputProcessedByContract=true` | `real_input_processed_claim_detected` |
| 33 | `rawInputForwarded=true` | `raw_input_forwarding_claim_detected` |
| 34 | `redactedInputForwardingExecuted=true` | `redacted_input_forwarding_claim_detected` |
| 35 | `runSmartTalkCalledOrImported=true` | `run_smart_talk_call_claim_detected` |
| 36 | `publicBranchCCalled=true` | `public_branch_c_call_claim_detected` |
| 37 | `extractTextFromImageCalledOrImported=true` | `ocr_runtime_call_claim_detected` |
| 38 | Missing operator acknowledgment | `reviewer_acknowledgment_missing` |
| 39 | Missing reviewer acknowledgment | `reviewer_acknowledgment_missing` |
| 40 | `containsSecret=true` | `forbidden_secret_detected` |
| 41 | `containsEnvValue=true` | `forbidden_env_value_detected` |
| 42 | `containsApiKey=true` | `forbidden_api_key_detected` |
| 43 | `containsRawInputText=true` | `forbidden_raw_text_detected` |
| 44 | `containsRedactedText=true` | `forbidden_redacted_text_detected` |
| 45 | `containsModelOutput=true` | `forbidden_model_output_detected` |
| 46 | `containsDocumentContent=true` | `forbidden_document_content_detected` |
| 47 | `containsUserPii=true` | `forbidden_pii_detected` |
| 48 | Notes: `"process.env"` | `forbidden_env_value_detected` |
| 49 | Notes: `"OPENAI_API_KEY="` | `forbidden_env_value_detected` |
| 50 | Notes: `"sk-"` | `forbidden_secret_detected` |
| 51 | Notes: `"stored user input"` | `unsafe_manual_review_note_detected` |
| 52 | Notes: `"stored redacted text"` | `unsafe_manual_review_note_detected` |
| 53 | Notes: `"stored model output"` | `forbidden_model_output_detected` |
| 54 | Notes: email | `forbidden_pii_detected` |
| 55 | Notes: phone | `forbidden_pii_detected` |
| 56 | Notes: `"Aktenzeichen"` | `forbidden_document_content_detected` |
| 57 | Notes: `"Name:"` | `forbidden_document_content_detected` |
| 58 | Notes: `"Geburtsdatum:"` | `forbidden_document_content_detected` |
| 59 | Notes: `"Abschiebung"` | `forbidden_document_content_detected` |
| 60 | Notes: `"Sie müssen"` | `unsafe_manual_review_note_detected` |
| 61 | Notes: `"garantiert"` | `unsafe_manual_review_note_detected` |
| 62 | Notes: `"fristlos sicher"` | `unsafe_manual_review_note_detected` |
| 63 | Notes: `"rechtlich sicher"` | `unsafe_manual_review_note_detected` |
| 64 | Notes: `"approved for user display"` | `unsafe_manual_review_note_detected` |
| 65 | Notes: `"auto-approved"` | `unsafe_manual_review_note_detected` |
| 66 | Notes: `"show to user now"` | `unsafe_manual_review_note_detected` |
| 67 | `containsRealUserInput=true` | `real_input_processed_claim_detected` |
| 68 | `dnaSavePerformed=true` | `persistence_claim_detected` |
| 69 | `offlineSavePerformed=true` | `persistence_claim_detected` |
| 70 | `publicRuntimeEnabled=true` | `emitted_to_user_claim_detected` |

---

## 12. Safety invariants

### On `ManualReviewBeforeUserVisibleOutputContractInput` (all literal)
- `operatorIdentityPresent: true`, `reviewerIdentityPresent: true`, `reviewerRolePresent: true`
- `reviewerResponsibilityAcknowledged: true`
- `automaticSystemApprovalAllowed: false`, `anonymousReviewAllowed: false`
- `selectedDispositionAllowsUserVisibleOutputNow: false`
- `userVisibleOutputAuthorizationRequiredNext: true`
- `governanceRecheckResultPresent: true`, `evidenceMetadataOnly: true`
- `contentStorageAllowed: false`
- `legalCertaintyWithoutEvidenceAllowed: false`, `deadlineClaimWithoutEvidenceAllowed: false`
- `unsupportedClaimAllowed: false`, `unsafeCertaintyAllowed: false`, `missingContextAllowed: false`
- `partialInputLimitationRequired: true`
- `userVisibleOutputAuthorized: false`, `emittedToUserNow: false`
- All AI-output, persistence, forwarding, and existing-runtime flags: `false`
- All `contains*` flags: `false`
- `neverUserVisible: true`

### On `ManualReviewBeforeUserVisibleOutputContractResult` (all literal)
- `readyForLiveLLMRuntime: false` through `readyForPersistence: false`
- `userVisibleOutputAuthorized: false`, `emittedToUserNow: false`
- All AI-output, persistence, forwarding, and existing-runtime flags: `false`
- `httpCallMade: false`, `apiRouteCalled: false`
- `apiRouteModifiedByManualReviewContract: false`
- `existingRuntimeModifiedByManualReviewContract: false`
- `uiTouched: false`, `databaseOrStorageModifiedByManualReviewContract: false`
- `neverUserVisible: true`

---

## 13. Readiness decision

| Flag | Value |
|---|---|
| `readyForUserVisibleOutputAuthorizationContract` | `true` (if `allPassed`) |
| `readyForLiveLLMRuntime` | **false** |
| `readyForConnectedAiRuntimeExecution` | **false** |
| `readyForRealOperatorPilotRun` | **false** |
| `readyForPilotRunNow` | **false** |
| `readyForPublicLaunch` | **false** |
| `readyForPersistence` | **false** |
| `userVisibleOutputAuthorized` | **false** |

---

## 14. Next phase

**Phase 8.3F — User-Visible Output Authorization Contract**

This contract only permits proceeding to Phase 8.3F when `allPassed === true`.  
In Phase 8.3F, the typed contract for authorizing a specific, governance-approved output to become user-visible will be defined.  
No live LLM is called in Phase 8.3F either. User-visible output authorization in 8.3F still does not mean live execution — it only defines the authorization policy.
