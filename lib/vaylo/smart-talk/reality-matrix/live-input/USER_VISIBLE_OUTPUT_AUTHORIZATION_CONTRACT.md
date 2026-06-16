# USER-VISIBLE OUTPUT AUTHORIZATION CONTRACT — Phase 8.3F

## 1. Purpose

Define the typed authorization policy for when one specific governance-rechecked and manually-reviewed output may be authorized for future user-visible display.  
This contract builds on Phase 8.3E (Manual Review Before User-Visible Output Contract).

This contract does **not** emit user-visible output.  
This contract does **not** authorize public runtime.  
This contract does **not** authorize live LLM runtime.  
This contract does **not** authorize persistence.  
This contract does **not** authorize existing Branch C or `run-smart-talk.ts`.  
This contract does **not** generate or store AI output.  
This contract does **not** grant global or broad output authorization.  
This contract only permits the next phase: **AI-Connected Synthetic Test Harness Contract**.

---

## 2. What user-visible authorization means

- Manual review (8.3E) must have passed before this contract is valid.
- Authorization is strictly scoped: one reviewed output, one controlled session.
- Even the "authorized" disposition (`authorized_for_future_controlled_user_visible_contract_path`) does **not** directly emit output — it only enables the next contract path.
- `selectedDispositionAllowsActualEmissionNow` is always literal `false`.
- `userVisibleOutputAuthorizedByContract` is always literal `false`.
- Global authorization, public runtime, live LLM, persistence, and Branch C authorization are all explicitly blocked as literal `false` invariants.
- The only positive readiness gate: `readyForAiConnectedSyntheticTestHarnessContract`.

---

## 3. What this contract does NOT authorize

| Action | Status |
|---|---|
| Emit user-visible output | **BLOCKED** |
| Authorize public runtime | **BLOCKED** |
| Authorize live LLM runtime | **BLOCKED** |
| Authorize persistence | **BLOCKED** |
| Authorize Branch C | **BLOCKED** |
| Authorize run-smart-talk.ts | **NOT AUTHORIZED** |
| Authorize OCR runtime | **NOT AUTHORIZED** |
| Global/broad authorization | **BLOCKED** |
| Legal certainty claims without evidence | **BLOCKED** |
| Deadline claims without evidence | **BLOCKED** |
| Autonomous action instructions | **BLOCKED** |
| Raw/redacted input echo | **BLOCKED** |
| Model output dump | **BLOCKED** |
| Internal audit dump | **BLOCKED** |
| Persistence, DNA save, offline save | **BLOCKED** |
| AI output generation | **BLOCKED** |

---

## 4. Authorization scope

All 7 scopes must be present:

- `one_reviewed_output_only`
- `one_controlled_session_only`
- `no_global_authorization`
- `no_public_runtime_authorization`
- `no_persistence_authorization`
- `no_branch_c_authorization`
- `no_live_llm_runtime_authorization`

---

## 5. Authorization conditions

All 16 conditions must be present:

- `manual_review_contract_ready`
- `governance_recheck_completed`
- `manual_review_completed`
- `selected_manual_review_disposition_candidate_safe`
- `evidence_metadata_present`
- `scope_limits_present`
- `user_visible_copy_has_safety_language`
- `uncertainty_preserved`
- `partial_input_limitation_preserved`
- `legal_certainty_claims_blocked_without_evidence`
- `deadline_claims_blocked_without_evidence`
- `unsafe_next_steps_blocked`
- `autonomous_actions_blocked`
- `no_content_storage_confirmed`
- `no_persistence_confirmed`
- `no_public_runtime_confirmed`

---

## 6. Allowed output classes

All 4 classes must be present:

- `explanation_only`
- `summary_only`
- `cautionary_next_steps_only`
- `uncertainty_preserving_guidance_only`

---

## 7. Blocked output classes

All 13 classes must be present:

- `legal_advice_certainty`
- `deadline_certainty_without_evidence`
- `authority_instruction_without_evidence`
- `autonomous_action_instruction`
- `guaranteed_outcome`
- `immigration_consequence_certainty`
- `payment_obligation_certainty_without_evidence`
- `appeal_window_certainty_without_evidence`
- `unsafe_must_language`
- `raw_or_redacted_input_echo`
- `model_output_dump`
- `internal_audit_dump`
- `secret_or_env_value_echo`

---

## 8. Dispositions

All 9 dispositions must be present. The positive disposition (`authorized_for_future_controlled_user_visible_contract_path`) opens the next contract path only — it does not authorize emission:

- `authorized_for_future_controlled_user_visible_contract_path`
- `blocked_due_to_scope_violation`
- `blocked_due_to_missing_manual_review`
- `blocked_due_to_missing_governance_recheck`
- `blocked_due_to_unsafe_claims`
- `blocked_due_to_missing_evidence_metadata`
- `blocked_due_to_output_class_violation`
- `blocked_due_to_persistence_or_public_runtime_attempt`
- `blocked_due_to_existing_runtime_overlap`

---

## 9. Checklist

All 18 checklist items must be confirmed:

- `manual_review_readiness_reviewed`
- `governance_recheck_readiness_reviewed`
- `scope_limits_reviewed`
- `allowed_output_classes_reviewed`
- `blocked_output_classes_reviewed`
- `legal_certainty_block_reviewed`
- `deadline_evidence_block_reviewed`
- `uncertainty_preservation_reviewed`
- `partial_input_limitation_reviewed`
- `no_raw_or_redacted_input_echo_reviewed`
- `no_model_output_dump_reviewed`
- `no_internal_audit_dump_reviewed`
- `no_user_visible_output_emitted_by_this_contract`
- `no_persistence_confirmed`
- `no_public_runtime_confirmed`
- `no_live_llm_runtime_confirmed`
- `existing_runtime_isolation_preserved`
- `next_phase_synthetic_test_harness_only`

---

## 10. Forbidden values / content

The following strings and patterns are forbidden in all authorization fields and notes:

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
- Email-like patterns
- Phone-like patterns

---

## 11. Tamper rejection cases

The check function runs 82 tamper cases — the most comprehensive in the chain. Every case must be rejected.

Selected highlights:

| # | Tamper | Expected rejection reason |
|---|---|---|
| 1 | `manualReviewBeforeUserVisibleOutputReady=false` | `manual_review_contract_not_ready` |
| 2–7 | Missing scopes/conditions/classes/dispositions/checklist | `missing_*` |
| 8 | `selectedDispositionAllowsActualEmissionNow=true` | `user_visible_output_authorized_too_broadly` |
| 9–10 | `oneReviewedOutputOnly=false`, `oneControlledSessionOnly=false` | `missing_authorization_scope` |
| 11–15 | Global/public/LLM/persistence/BranchC authorization true | `*_attempt_detected` |
| 16–22 | Governance/review/evidence/scope/safety flags false | `missing_authorization_condition` |
| 23–32 | Unsafe claim/output/context flags true | `*_allowed` |
| 33–34 | `userVisibleOutputAuthorizedByContract=true`, `emittedToUserNow=true` | `user_visible_output_*` |
| 35–45 | All execution/AI/forwarding/existing-runtime flags true | `*_claim_detected` |
| 46–47 | Missing acknowledgments | `missing_required_checklist_item` |
| 48–55 | All `contains*` content flags true | `forbidden_*_detected` |
| 56–78 | Forbidden string injection into notes (including 4 new global-auth phrases) | `*_detected` |
| 79–82 | Real-input/persistence/public flags true | `*_detected` |

---

## 12. Safety invariants

### On `UserVisibleOutputAuthorizationContractInput` (all literal)
- `selectedDispositionAllowsActualEmissionNow: false`
- `oneReviewedOutputOnly: true`, `oneControlledSessionOnly: true`
- `globalAuthorizationAllowed: false`, `publicRuntimeAuthorizationAllowed: false`
- `liveLlmRuntimeAuthorizationAllowed: false`, `persistenceAuthorizationAllowed: false`
- `branchCAuthorizationAllowed: false`
- All governance/review/scope/safety flags: `true`
- All unsafe-claim/output flags: `false`
- `userVisibleOutputAuthorizedByContract: false`, `emittedToUserNow: false`
- All AI-output, persistence, forwarding, and existing-runtime flags: `false`
- All `contains*` flags: `false`
- `neverUserVisible: true`

### On `UserVisibleOutputAuthorizationContractResult` (all literal)
- `readyForLiveLLMRuntime: false` through `readyForPersistence: false`
- `userVisibleOutputAuthorizedByContract: false`, `emittedToUserNow: false`
- `globalAuthorizationAllowed: false` through `branchCAuthorizationAllowed: false`
- All AI-output, persistence, forwarding, and existing-runtime flags: `false`
- `httpCallMade: false`, `apiRouteCalled: false`
- `apiRouteModifiedByAuthorizationContract: false`
- `existingRuntimeModifiedByAuthorizationContract: false`
- `uiTouched: false`, `databaseOrStorageModifiedByAuthorizationContract: false`
- `neverUserVisible: true`

---

## 13. Readiness decision

| Flag | Value |
|---|---|
| `readyForAiConnectedSyntheticTestHarnessContract` | `true` (if `allPassed`) |
| `userVisibleOutputAuthorizedByContract` | **false** (literal always) |
| `readyForLiveLLMRuntime` | **false** |
| `readyForConnectedAiRuntimeExecution` | **false** |
| `readyForRealOperatorPilotRun` | **false** |
| `readyForPilotRunNow` | **false** |
| `readyForPublicLaunch` | **false** |
| `readyForPersistence` | **false** |

---

## 14. Next phase

**Phase 8.3G — AI-Connected Synthetic Test Harness Contract**

This contract only permits proceeding to Phase 8.3G when `allPassed === true`.  
Phase 8.3G defines the typed contract for a controlled, synthetic (non-real-input) test harness that can safely exercise the governance-controlled AI adapter path without processing real user data or emitting user-visible output.  
No real user input is processed in Phase 8.3G. No live production runtime is authorized.
