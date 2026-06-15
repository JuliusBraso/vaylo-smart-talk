# PHASE 8.2M-6 — Post-Run Audit Planning Contract

**Epoch:** 8.2M — Real Operator Pilot Authorization
**Check ID:** 8.2M-6
**Mode:** AUDIT PLANNING ONLY / NO AUDIT EXECUTION / NO AUDIT PERSISTENCE / NO REAL PILOT RUN

---

## 1. Purpose

Define the typed post-run audit planning contract that specifies how a future
real operator pilot run must be audited after completion — including audit
scope, verdict model, linkage requirements, signoff requirements, and the
metadata-only audit record rule.

This phase verifies the 8.2M-5 evidence policy contract
(`runEvidencePolicyContractCheck()`), validates a synthetic safe audit planning
input, and runs 55 tamper rejection cases.

---

## 2. What Post-Run Audit Planning Means

The post-run audit planning policy specifies:
- Which aspects of a future pilot run must be verified in a post-run audit.
- What verdict outcomes are possible (pass with warnings, blocked, invalid,
  requires followup).
- Which prior contracts and metadata the audit record must link to.
- That both operator and reviewer must sign off on the final audit verdict.
- That audit records must be metadata-only — no user content enters the record.
- That persistence of audit records requires separate authorization.
- That post-run audit is required before any future pilot is considered complete.

---

## 3. What This Contract Does NOT Do

- Does **not** execute a post-run audit. `auditExecutionPerformed` is literal `false`.
- Does **not** persist audit records. `auditPersistencePerformed` is literal `false`.
- Does **not** store actual user content. `userContentAuditStored` is literal `false`.
- Does **not** implement database or storage behavior. `databaseOrStorageModifiedByPlanning` is literal `false`.
- Does **not** modify audit runtime. `auditRuntimeModifiedByPlanning` is literal `false`.
- Does **not** authorize a real pilot run. `readyForRealOperatorPilotRun` is literal `false`.
- Does **not** call any live LLM or make HTTP requests.
- Does **not** save to DNA or offline storage. `dnaSavePerformed` is literal `false`.
- Does **not** read `process.env`. No env values are accessed by code.

---

## 4. Audit Scope (18 items)

All 18 scope items must appear in `auditScopeItems`:

| # | Scope Item |
|---|-----------|
| 1 | `verify_operator_identity_attestation` |
| 2 | `verify_reviewer_identity_attestation` |
| 3 | `verify_environment_attestation` |
| 4 | `verify_abort_protocol_availability` |
| 5 | `verify_real_input_policy_clearance` |
| 6 | `verify_evidence_policy_compliance` |
| 7 | `verify_no_raw_input_forwarding` |
| 8 | `verify_no_user_content_evidence` |
| 9 | `verify_no_public_output` |
| 10 | `verify_no_persistence_without_authorization` |
| 11 | `verify_no_dna_save` |
| 12 | `verify_no_offline_save` |
| 13 | `verify_no_live_llm_without_authorization` |
| 14 | `verify_manual_review_completion` |
| 15 | `verify_abort_if_triggered` |
| 16 | `verify_blockers_and_open_items` |
| 17 | `verify_safety_invariant_snapshot` |
| 18 | `verify_incident_notes_without_content` |

---

## 5. Verdict Model (4 outcomes)

All 4 verdict models must appear in `verdictModels`:

| Verdict | Meaning |
|---------|---------|
| `pass_with_warnings` | Run completed with open items; further review required |
| `blocked` | Run was blocked; audit documents the block |
| `invalid_run` | Run was invalid; full review required |
| `requires_manual_followup` | Run requires explicit human followup before closure |

---

## 6. Linkage Requirements (12)

All 12 requirements must appear in `linkageRequirements`:

| # | Linkage |
|---|---------|
| 1 | `link_to_pilot_session_id` |
| 2 | `link_to_operator_identity_contract` |
| 3 | `link_to_reviewer_identity_contract` |
| 4 | `link_to_environment_attestation` |
| 5 | `link_to_abort_protocol_contract` |
| 6 | `link_to_real_input_policy_contract` |
| 7 | `link_to_evidence_policy_contract` |
| 8 | `link_to_manual_review_result` |
| 9 | `link_to_safety_invariant_snapshot` |
| 10 | `link_to_blocker_codes_without_content` |
| 11 | `link_to_open_item_codes_without_content` |
| 12 | `link_to_incident_notes_without_content` |

---

## 7. Checklist (19 items)

All 19 items must appear in `checklistConfirmed`.

---

## 8. Signoff Requirements (6)

All 6 signoff requirements must appear in `signoffRequirements`:

| # | Requirement |
|---|-------------|
| 1 | `operator_signoff_required` |
| 2 | `reviewer_signoff_required` |
| 3 | `manual_review_signoff_required` |
| 4 | `abort_status_signoff_required` |
| 5 | `evidence_policy_signoff_required` |
| 6 | `final_audit_verdict_signoff_required` |

---

## 9. Clearance Levels

Valid levels for `clearanceLevel`:

| Level | Meaning |
|-------|---------|
| `policy_defined_only` | Audit planning policy is defined only |
| `audit_schema_ready_for_future_operator_review` | Audit schema ready for future operator review |

Any other value → `invalid_clearance_level`.

---

## 10. Metadata-Only Audit Rule

`auditRecordMetadataOnly: true` is a required literal gate. All seven audit
record content gates (`auditRecordUserContentAllowed`, `auditRecordRawTextAllowed`,
`auditRecordRedactedTextAllowed`, `auditRecordModelOutputAllowed`,
`auditRecordDocumentContentAllowed`, `auditRecordPiiAllowed`,
`auditRecordSecretOrEnvAllowed`) must be `false`.

`persistenceRequiresSeparateAuthorization: true` and
`postRunAuditRequiredBeforeCompletion: true` are required literal safety gates.

---

## 11. Forbidden Values and Content

### Forbidden strings (29)

Covers API keys, env assignments, env/code references, raw/draft markers,
audit-content phrases, PII, document content, sensitive personal markers,
and high-risk legal markers.

### Forbidden audit content phrases (7)

- `"stored user input"`
- `"stored redacted text"`
- `"stored model output"`
- `"stored audit record"`
- `"stored document content"`
- `"stored PII"`
- `"stored secret"`

---

## 12. Tamper Rejection Cases (55)

All 55 tamper cases must be rejected. Covers all identity/session fields,
all list types (scope/verdict/linkage/checklist/signoff), clearance level,
all 7 audit content gates, mandatory safety gates, audit/evidence execution
and persistence flags, acknowledgment completeness, all 8 contains* flags,
all string/phrase/PII/legal-marker note tampers, and all 6 runtime tampers.

---

## 13. Safety Invariants

All literal types on `PostRunAuditPlanningContractCheckResult`:

| Invariant | Value |
|-----------|-------|
| `readyForRealOperatorPilotRun` | false |
| `readyForPilotRunNow` | false |
| `readyForPublicLaunch` | false |
| `readyForLiveLLMRuntime` | false |
| `readyForPersistence` | false |
| `realPilotRunExecuted` | false |
| `realUserInputProcessed` | false |
| `auditExecutionPerformed` | false |
| `auditPersistencePerformed` | false |
| `evidencePersistencePerformed` | false |
| `userContentAuditStored` | false |
| `auditRuntimeModifiedByPlanning` | false |
| `databaseOrStorageModifiedByPlanning` | false |
| `liveLLMCalled` | false |
| `persistenceUsed` | false |
| `dnaSavePerformed` | false |
| `offlineSavePerformed` | false |
| `emittedToUserNow` | false |
| `neverUserVisible` | true |

---

## 14. Readiness Decision

```
checkId:                                      "8.2M-6"
allPassed:                                    true  (evidence policy + synthetic + 55 tamper cases)
evidencePolicyReady:                          true
syntheticPostRunAuditPlanningAccepted:        true
tamperCasesRejected:                          true  (55/55)
readyForRealOperatorPilotAuthorizationClosure: true
readyForRealOperatorPilotRun:                 false  (literal)
readyForPilotRunNow:                          false  (literal)
auditExecutionPerformed:                      false  (literal)
auditPersistencePerformed:                    false  (literal)
userContentAuditStored:                       false  (literal)
```

---

## 15. Next Phase

**8.2M-7 — Real Operator Pilot Authorization Closure**

The real operator pilot authorization closure phase will formally close the
8.2M epoch by verifying all six sub-contracts (8.2M-1 through 8.2M-6) have
passed, and will produce the final authorization closure result that determines
whether a future real operator pilot run can proceed to a separate execution
authorization phase.

This builds on `readyForRealOperatorPilotAuthorizationClosure: true` set by
Phase 8.2M-6.
