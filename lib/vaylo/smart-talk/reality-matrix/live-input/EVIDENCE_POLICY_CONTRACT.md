# PHASE 8.2M-5 — Evidence Policy Contract

**Epoch:** 8.2M — Real Operator Pilot Authorization
**Check ID:** 8.2M-5
**Mode:** POLICY CONTRACT ONLY / NO EVIDENCE PERSISTENCE / NO USER CONTENT STORAGE / NO REAL PILOT RUN

---

## 1. Purpose

Define the typed evidence policy contract that specifies what evidence metadata
categories may be collected, what content must remain blocked from evidence
storage, what retention constraints apply, and what audit trail requirements
must exist before any real operator pilot run can be considered complete.

This phase verifies the 8.2M-4 real input policy contract
(`runRealInputPolicyContractCheck()`), validates a synthetic safe evidence
policy input, and runs 54 tamper rejection cases.

---

## 2. What Evidence Policy Means

The evidence policy specifies:
- Which metadata categories may be collected as evidence in a future pilot.
- Which content categories must be permanently blocked from evidence storage.
- What retention constraints (metadata-only, no-PII, no-user-content, etc.)
  apply to any future evidence collection.
- What audit trail records must reference without storing user content.
- That persistence requires separate authorization beyond this contract.
- That post-run audit is required before any future pilot is considered complete.

---

## 3. What This Contract Does NOT Do

- Does **not** persist evidence. `evidencePersistencePerformed` is literal `false`.
- Does **not** store actual user content. `userContentEvidenceStored` is literal `false`.
- Does **not** implement database or storage behavior. `databaseOrStorageModifiedByPolicy` is literal `false`.
- Does **not** modify evidence persistence runtime. `evidencePersistenceRuntimeModifiedByPolicy` is literal `false`.
- Does **not** authorize a real pilot run. `readyForRealOperatorPilotRun` is literal `false`.
- Does **not** process real input. `realUserInputProcessed` is literal `false`.
- Does **not** call any live LLM or make HTTP requests.
- Does **not** save to DNA or offline storage. `dnaSavePerformed` is literal `false`.
- Does **not** read `process.env`. No env values are accessed by code.

---

## 4. Allowed Evidence Metadata Categories (16)

The following metadata categories may be collected as evidence:

| # | Category |
|---|----------|
| 1 | `pilot_session_id` |
| 2 | `operator_human_id` |
| 3 | `reviewer_human_id` |
| 4 | `scenario_id` |
| 5 | `run_timestamp` |
| 6 | `phase_id` |
| 7 | `contract_check_status` |
| 8 | `guard_result_status` |
| 9 | `manual_review_verdict` |
| 10 | `abort_protocol_status` |
| 11 | `input_policy_clearance_level` |
| 12 | `evidence_policy_status` |
| 13 | `post_run_audit_status` |
| 14 | `safety_invariant_snapshot` |
| 15 | `blocker_code` |
| 16 | `open_item_code` |

If any metadata category is missing from `allowedEvidenceMetadataCategories`,
the reason `missing_allowed_metadata_category` is added.

---

## 5. Blocked Evidence Content Categories (21)

The following content categories must be permanently blocked from evidence storage:

| # | Category |
|---|----------|
| 1 | `raw_user_input_text` |
| 2 | `redacted_user_input_text` |
| 3 | `full_document_text` |
| 4 | `document_image` |
| 5 | `ocr_output_text` |
| 6 | `model_raw_output` |
| 7 | `full_draft_response` |
| 8 | `user_name` |
| 9 | `user_address` |
| 10 | `user_email` |
| 11 | `user_phone` |
| 12 | `iban` |
| 13 | `steuer_id` |
| 14 | `aktenzeichen` |
| 15 | `bg_nr` |
| 16 | `insurance_number` |
| 17 | `child_personal_data` |
| 18 | `medical_data` |
| 19 | `immigration_sensitive_story` |
| 20 | `secrets_or_api_keys` |
| 21 | `env_values` |

---

## 6. Retention Constraints (17)

All 17 constraints must appear in `retentionConstraints`:

| # | Constraint |
|---|------------|
| 1 | `metadata_only_evidence` |
| 2 | `no_user_content_storage` |
| 3 | `no_raw_text_storage` |
| 4 | `no_redacted_text_storage` |
| 5 | `no_model_output_storage` |
| 6 | `no_secret_storage` |
| 7 | `no_env_value_storage` |
| 8 | `no_pii_storage` |
| 9 | `no_document_image_storage` |
| 10 | `no_ocr_output_storage` |
| 11 | `no_dna_save` |
| 12 | `no_offline_save` |
| 13 | `no_public_log_exposure` |
| 14 | `manual_reviewer_access_only` |
| 15 | `post_run_audit_required` |
| 16 | `deletion_policy_required_before_persistence` |
| 17 | `persistence_requires_separate_authorization` |

---

## 7. Audit Trail Requirements (12)

All 12 requirements must appear in `auditTrailRequirements`:

| # | Requirement |
|---|-------------|
| 1 | `record_phase_ids` |
| 2 | `record_contract_statuses` |
| 3 | `record_safe_metadata_only` |
| 4 | `record_blockers_without_content` |
| 5 | `record_open_items_without_content` |
| 6 | `record_manual_review_verdict_without_content` |
| 7 | `record_abort_status_without_content` |
| 8 | `record_safety_invariant_snapshot_without_content` |
| 9 | `record_operator_reviewer_ids_without_pii_expansion` |
| 10 | `require_post_run_audit_linkage` |
| 11 | `require_no_user_content_evidence_assertion` |
| 12 | `require_no_secret_or_env_value_assertion` |

---

## 8. Checklist (17 items)

All 17 items must appear in `checklistConfirmed`:

| # | Item |
|---|------|
| 1 | `allowed_metadata_categories_reviewed` |
| 2 | `blocked_content_categories_reviewed` |
| 3 | `retention_constraints_reviewed` |
| 4 | `audit_trail_requirements_reviewed` |
| 5 | `metadata_only_evidence_attested` |
| 6 | `user_content_evidence_blocked` |
| 7 | `pii_evidence_blocked` |
| 8 | `secret_env_evidence_blocked` |
| 9 | `model_output_evidence_blocked` |
| 10 | `document_image_ocr_evidence_blocked` |
| 11 | `dna_offline_save_blocked` |
| 12 | `public_log_exposure_blocked` |
| 13 | `post_run_audit_required` |
| 14 | `persistence_requires_separate_authorization` |
| 15 | `no_evidence_persistence_performed` |
| 16 | `no_real_input_processed_by_this_contract` |
| 17 | `no_user_visible_output_allowed` |

---

## 9. Clearance Levels

Valid levels for `clearanceLevel` (both accepted):

| Level | Meaning |
|-------|---------|
| `policy_defined_only` | Policy is defined; no metadata schema has been reviewed |
| `metadata_schema_ready_for_future_operator_review` | Metadata schema ready for future operator review only |

Any other value → `invalid_clearance_level`.

---

## 10. Metadata-Only Evidence Rule

`metadataOnlyEvidence: true` is a required literal gate on the input type.
If set to `false` (via type coercion): `user_content_evidence_claim_detected`.

All evidence content gates (`userContentEvidenceAllowed`, `rawTextEvidenceAllowed`,
`redactedTextEvidenceAllowed`, `modelOutputEvidenceAllowed`,
`documentImageOrOcrEvidenceAllowed`, `piiEvidenceAllowed`,
`secretOrEnvEvidenceAllowed`, `publicLogExposureAllowed`) must be `false`.

`persistenceRequiresSeparateAuthorization: true` and `postRunAuditRequired: true`
are required literal safety gates.

---

## 11. Forbidden Values and Content

### Forbidden strings (27)

| Category | Forbidden |
|----------|-----------|
| API keys | `"sk-"` |
| Env assignments | `"OPENAI_API_KEY="`, `"VAYLO_INTERNAL_RUNTIME_SECRET="` |
| Env/code references | `"process.env"`, `"apiKey"`, `"internalSecret"` |
| Raw/draft markers | `"rawInputText"`, `"redactedText"`, `"fullDraftText"`, `"modelOutput"`, `"SYNTHETIC_TEXT_NEVER_REAL_USER_DATA"` |
| Evidence content | `"OCR output"`, `"document image"` |
| PII | `"john@example.com"`, `"+49 170 1234567"`, email patterns, phone patterns |
| Document content | `"IBAN"`, `"Steuer-ID"`, `"Aktenzeichen"`, `"Sehr geehrter"`, `"BG-Nr"` |
| Sensitive personal | `"Name:"`, `"Adresse:"`, `"Geburtsdatum:"`, `"Kind:"` |
| High-risk legal | `"Mietvertrag"`, `"Kündigung"`, `"Abschiebung"` |

### Forbidden evidence content phrases (7)

- `"stored user input"`
- `"stored redacted text"`
- `"stored model output"`
- `"stored document image"`
- `"stored OCR output"`
- `"stored PII"`
- `"stored secret"`

---

## 12. Tamper Rejection Cases (54)

All 54 tamper cases must be rejected. Covers: missing/invalid fields, all evidence content gate true cases, all forbidden string/phrase/PII/legal marker notes, all persistence/DNA/offline/live LLM/public/user-visible runtime tampers.

---

## 13. Safety Invariants

All literal types on `EvidencePolicyContractCheckResult`:

| Invariant | Value |
|-----------|-------|
| `readyForRealOperatorPilotRun` | false |
| `readyForPilotRunNow` | false |
| `readyForPublicLaunch` | false |
| `readyForLiveLLMRuntime` | false |
| `readyForPersistence` | false |
| `realPilotRunExecuted` | false |
| `realUserInputProcessed` | false |
| `evidencePersistencePerformed` | false |
| `userContentEvidenceStored` | false |
| `evidencePersistenceRuntimeModifiedByPolicy` | false |
| `databaseOrStorageModifiedByPolicy` | false |
| `liveLLMCalled` | false |
| `persistenceUsed` | false |
| `dnaSavePerformed` | false |
| `offlineSavePerformed` | false |
| `emittedToUserNow` | false |
| `neverUserVisible` | true |

---

## 14. Readiness Decision

```
checkId:                              "8.2M-5"
allPassed:                            true  (input policy + synthetic + 54 tamper cases)
realInputPolicyReady:                 true
syntheticEvidencePolicyAccepted:      true
tamperCasesRejected:                  true  (54/54)
readyForPostRunAuditPlanning:         true
readyForRealOperatorPilotRun:         false  (literal)
readyForPilotRunNow:                  false  (literal)
evidencePersistencePerformed:         false  (literal)
userContentEvidenceStored:            false  (literal)
databaseOrStorageModifiedByPolicy:    false  (literal)
```

---

## 15. Next Phase

**8.2M-6 — Post-Run Audit Planning Contract**

The post-run audit planning contract will define the typed requirements for
how a future real operator pilot run must be audited after it completes —
including audit scope, open item coverage, and evidence linkage requirements.

This builds on `readyForPostRunAuditPlanning: true` set by Phase 8.2M-5.
