# PHASE 8.2M-4 — Real Input Policy Contract

**Epoch:** 8.2M — Real Operator Pilot Authorization
**Check ID:** 8.2M-4
**Mode:** POLICY CONTRACT ONLY / NO REAL INPUT PROCESSING / NO RAW INPUT FORWARDING / NO REAL PILOT RUN

---

## 1. Purpose

Define the typed real input policy contract that specifies what input categories
may be allowed, what must remain disallowed, what redaction requirements apply,
and what clearance gates must exist before any real operator pilot run can
consider processing real input.

This phase verifies the 8.2M-3 abort protocol contract
(`runAbortProtocolContractCheck()`), validates a synthetic safe input policy
input, and runs 39 tamper rejection cases.

---

## 2. What Real Input Policy Means

The real input policy specifies:
- Which input categories are permitted in a future operator-controlled pilot.
- Which input categories must remain blocked under all circumstances.
- What redaction steps must be applied before any input could be forwarded.
- What clearance gates (manual review, completeness warning, legal disclaimer)
  must be in place before any future user-facing flow.
- That high-risk input (deportation deadlines, legal appeal deadlines, medical
  emergencies, children data, raw bank/tax identifiers) remains blocked.

---

## 3. What This Contract Does NOT Do

- Does **not** process real user input. `realInputProcessedByContract` is literal `false`.
- Does **not** forward raw input. `rawInputForwardingAllowed` is literal `false`.
- Does **not** implement redaction. `redactionRuntimeModifiedByPolicy` is literal `false`.
- Does **not** modify input routing. `inputRouterModifiedByPolicy` is literal `false`.
- Does **not** authorize a real pilot run. `readyForRealOperatorPilotRun` is literal `false`.
- Does **not** persist policy records. `persistenceUsed` is literal `false`.
- Does **not** call any live LLM or make HTTP requests.
- Does **not** modify the API route or UI.
- Does **not** read `process.env`. No env values are accessed by code.
- Does **not** support OCR/photo input, file upload, or document upload.

---

## 4. Allowed Input Categories (5)

| # | Category |
|---|----------|
| 1 | `typed_bureaucratic_text` |
| 2 | `pasted_bureaucratic_letter_excerpt` |
| 3 | `synthetic_control_text` |
| 4 | `operator_test_question` |
| 5 | `redacted_real_text_excerpt` |

If any allowed category is missing from `allowedInputCategories`, the reason
`missing_allowed_input_category` is added.

---

## 5. Disallowed Input Categories (14)

The following must remain blocked in any future pilot:

| # | Category |
|---|----------|
| 1 | `photo_ocr_input` |
| 2 | `file_upload_input` |
| 3 | `full_document_upload` |
| 4 | `multi_document_bundle` |
| 5 | `payment_triggered_input` |
| 6 | `public_anonymous_user_input` |
| 7 | `unattended_user_input` |
| 8 | `third_party_sensitive_data` |
| 9 | `medical_emergency_input` |
| 10 | `deportation_deadline_uncertain_input` |
| 11 | `legal_appeal_deadline_uncertain_input` |
| 12 | `raw_secret_or_api_key_input` |
| 13 | `raw_bank_or_tax_identifier_input` |
| 14 | `raw_children_data_input` |

If any disallowed category is missing from `disallowedInputCategories`, the
reason `missing_disallowed_input_category` is added.

---

## 6. Redaction Requirements (18)

All 18 requirements must appear in `redactionRequirements`:

| # | Requirement |
|---|-------------|
| 1 | `redact_names_before_forwarding` |
| 2 | `redact_addresses_before_forwarding` |
| 3 | `redact_phone_numbers_before_forwarding` |
| 4 | `redact_emails_before_forwarding` |
| 5 | `redact_iban_before_forwarding` |
| 6 | `redact_steuer_id_before_forwarding` |
| 7 | `redact_aktenzeichen_before_forwarding` |
| 8 | `redact_bg_nr_before_forwarding` |
| 9 | `redact_insurance_numbers_before_forwarding` |
| 10 | `redact_dates_only_when_not_decision_relevant` |
| 11 | `preserve_authority_name_when_relevant` |
| 12 | `preserve_document_type_when_relevant` |
| 13 | `preserve_deadline_only_with_uncertainty_label` |
| 14 | `preserve_amounts_only_when_needed_for_explanation` |
| 15 | `mark_partial_input_if_excerpt` |
| 16 | `require_manual_reviewer_clearance_before_forwarding` |
| 17 | `block_if_redaction_uncertain` |
| 18 | `block_if_deadline_or_legal_consequence_uncertain` |

---

## 7. Clearance Levels

Valid levels for `clearanceLevel` (only two are accepted):

| Level | Meaning |
|-------|---------|
| `policy_defined_only` | Policy is defined; no real input has been cleared |
| `redacted_excerpt_ready_for_future_operator_review` | A redacted excerpt is ready for future operator review only |

`no_clearance` is **always rejected** (`invalid_clearance_level`).

---

## 8. Completeness Warning and Legal Disclaimer Requirements

These fields are literal `true` on the input type and validated defensively:

| Gate | Rejection reason if false |
|------|---------------------------|
| `manualReviewClearanceRequired: true` | `manual_review_clearance_missing` |
| `completenessWarningRequired: true` | `completeness_warning_missing` |
| `legalDisclaimerRequired: true` | `legal_disclaimer_missing` |
| `highRiskInputsBlocked: true` | `high_risk_input_allowed_without_block` |

Both operator and reviewer policy acknowledgments must include all four required
statements:

> "I acknowledge that raw input forwarding remains blocked."

> "I acknowledge that future real input requires operator control and manual review clearance."

> "I acknowledge that completeness warning and legal disclaimer are required before any future user-facing flow."

> "I acknowledge that public launch, live LLM runtime, and persistence remain blocked."

---

## 9. High-Risk Input Blocking

The following input types are blocked via `DISALLOWED_REAL_INPUT_CATEGORIES`
and must never appear in an accepted policy:

- `deportation_deadline_uncertain_input`
- `legal_appeal_deadline_uncertain_input`
- `medical_emergency_input`
- `raw_children_data_input`
- `raw_bank_or_tax_identifier_input`
- `raw_secret_or_api_key_input`
- `public_anonymous_user_input`
- `unattended_user_input`

Additionally `highRiskInputsBlocked: true` is a required literal gate.

---

## 10. Forbidden Values and Strings (25)

The following must never appear in any field, acknowledgment, or notes:

| Category | Forbidden |
|----------|-----------|
| API keys | `"sk-"` |
| Env assignments | `"OPENAI_API_KEY="`, `"VAYLO_INTERNAL_RUNTIME_SECRET="` |
| Env/code references | `"process.env"`, `"apiKey"`, `"internalSecret"` |
| Raw/draft markers | `"rawInputText"`, `"redactedText"`, `"fullDraftText"`, `"modelOutput"`, `"SYNTHETIC_TEXT_NEVER_REAL_USER_DATA"` |
| PII | `"john@example.com"`, `"+49 170 1234567"`, email patterns, phone patterns |
| Document content | `"IBAN"`, `"Steuer-ID"`, `"Aktenzeichen"`, `"Sehr geehrter"`, `"BG-Nr"` |
| Sensitive personal | `"Name:"`, `"Adresse:"`, `"Geburtsdatum:"`, `"Kind:"` |
| High-risk legal | `"Mietvertrag"`, `"Kündigung"`, `"Abschiebung"` |

Secret-like strings (`secret`, `token`, `password`) are also detected.

---

## 11. Tamper Rejection Cases (39)

All 39 tamper cases must be rejected:

| # | Tamper | Expected reason |
|---|--------|-----------------|
| 1 | `abortProtocolReady: false` | `abort_protocol_not_ready` |
| 2 | Empty `pilotSessionId` | `missing_pilot_session_id` |
| 3 | Empty `operatorHumanId` | `missing_operator_identity_reference` |
| 4 | Empty `reviewerHumanId` | `missing_reviewer_identity_reference` |
| 5 | Missing allowed input category | `missing_allowed_input_category` |
| 6 | Missing disallowed input category | `missing_disallowed_input_category` |
| 7 | Missing redaction requirement | `missing_redaction_requirement` |
| 8 | Missing checklist item | `missing_required_checklist_item` |
| 9 | `clearanceLevel: "no_clearance"` | `invalid_clearance_level` |
| 10 | `rawInputForwardingAllowed: true` | `raw_input_forwarding_claim_detected` |
| 11 | `realInputProcessedByContract: true` | `real_input_processed_claim_detected` |
| 12 | `redactionPolicyDefined: false` | `redaction_policy_uncertain` |
| 13 | `manualReviewClearanceRequired: false` | `manual_review_clearance_missing` |
| 14 | `completenessWarningRequired: false` | `completeness_warning_missing` |
| 15 | `legalDisclaimerRequired: false` | `legal_disclaimer_missing` |
| 16 | `highRiskInputsBlocked: false` | `high_risk_input_allowed_without_block` |
| 17 | Incomplete operator acknowledgment | `missing_operator_identity_reference` |
| 18 | Incomplete reviewer acknowledgment | `missing_reviewer_identity_reference` |
| 19 | `containsSecret: true` | `forbidden_secret_detected` |
| 20 | `containsEnvValue: true` | `forbidden_env_value_detected` |
| 21 | `containsApiKey: true` | `forbidden_api_key_detected` |
| 22 | `containsRawInputText: true` | `forbidden_raw_text_detected` |
| 23 | `containsRedactedText: true` | `forbidden_redacted_text_detected` |
| 24 | `containsModelOutput: true` | `forbidden_model_output_detected` |
| 25 | `containsDocumentContent: true` | `forbidden_document_content_detected` |
| 26 | Notes: `"process.env"` | `forbidden_env_value_detected` |
| 27 | Notes: `"OPENAI_API_KEY="` | `forbidden_env_value_detected` |
| 28 | Notes: `"sk-"` | `forbidden_secret_detected` |
| 29 | Notes: `"john@example.com"` | `forbidden_pii_detected` |
| 30 | Notes: `"+49 170 1234567"` | `forbidden_pii_detected` |
| 31 | Notes: `"Aktenzeichen"` | `forbidden_document_content_detected` |
| 32 | Notes: `"Name:"` | `forbidden_pii_detected` |
| 33 | Notes: `"Geburtsdatum:"` | `forbidden_pii_detected` |
| 34 | Notes: `"Abschiebung"` | `forbidden_document_content_detected` |
| 35 | `containsRealUserInput: true` | `real_input_processed_claim_detected` |
| 36 | `persistenceUsed: true` | `persistence_claim_detected` |
| 37 | `liveLLMCalled: true` | `live_llm_claim_detected` |
| 38 | `publicRuntimeEnabled: true` | `public_runtime_claim_detected` |
| 39 | `emittedToUserNow: true` | `user_visible_output_claim_detected` |

---

## 12. Safety Invariants

All literal types on `RealInputPolicyContractCheckResult`:

| Invariant | Value |
|-----------|-------|
| `readyForRealOperatorPilotRun` | false |
| `readyForPilotRunNow` | false |
| `readyForPublicLaunch` | false |
| `readyForLiveLLMRuntime` | false |
| `readyForPersistence` | false |
| `realPilotRunExecuted` | false |
| `realUserInputProcessed` | false |
| `rawInputForwarded` | false |
| `redactionRuntimeModifiedByPolicy` | false |
| `inputRouterModifiedByPolicy` | false |
| `liveLLMCalled` | false |
| `persistenceUsed` | false |
| `emittedToUserNow` | false |
| `neverUserVisible` | true |

---

## 13. Readiness Decision

```
checkId:                       "8.2M-4"
allPassed:                     true  (abort protocol + synthetic + 39 tamper cases)
abortProtocolReady:            true
syntheticInputPolicyAccepted:  true
tamperCasesRejected:           true  (39/39)
readyForEvidencePolicy:        true
readyForPostRunAuditPlanning:  true
readyForRealOperatorPilotRun:  false  (literal)
readyForPilotRunNow:           false  (literal)
readyForPublicLaunch:          false  (literal)
realUserInputProcessed:        false  (literal)
rawInputForwarded:             false  (literal)
```

---

## 14. Next Phase

**8.2M-5 — Evidence Policy Contract**

The evidence policy contract will define the typed requirements for what
evidence must be collected, retained, and made available for audit during a
future real operator pilot run — without persisting actual user content.

This builds on `readyForEvidencePolicy: true` set by Phase 8.2M-4.
