# PHASE 8.2M-0 — Real Operator Pilot Authorization Plan

**Epoch:** 8.2M — Real Operator Pilot Authorization
**Plan ID:** 8.2M-0
**Version:** real-operator-pilot-authorization-plan-v1
**Mode:** AUTHORIZATION PLAN ONLY / NO REAL PILOT RUN

---

## 1. Purpose

Begin the 8.2M planning epoch immediately following the successful closure of
the 8.2L Guarded Internal Controlled Pilot Execution epoch.

This plan defines what must exist before the first real operator pilot run can
be authorized. It verifies the 8.2L closure (`runControlledPilotExecutionClosure()`)
and produces a `RealOperatorPilotAuthorizationPlanCheckResult` with
`status: "ready_for_phase_8_2m_1"` on success.

---

## 2. Previous Epoch Dependency

8.2M-0 requires:
- `runControlledPilotExecutionClosure()` returns `verdict: "closed_with_warnings"`
- `blockers: []`
- `readyForNextEpochPlanning: true`
- All safety/content-storage invariants verified as required (`false`/`true`)

If the 8.2L closure is not clean, this plan returns `status: "blocked"`.

---

## 3. What This Plan Authorizes

On success (`status: "ready_for_phase_8_2m_1"`), this plan authorizes:

- `readyForOperatorIdentityContract: true` — 8.2M-1 may define the operator identity contract
- `readyForRealEnvironmentAttestationContract: true` — 8.2M-1+ may define real env attestation
- `readyForAbortProtocol: true` — abort protocol definition may begin
- `readyForRealInputPolicy: true` — real input handling policy definition may begin
- `readyForEvidencePolicy: true` — evidence policy definition may begin
- `readyForPostRunAuditPlanning: true` — post-run audit planning may begin

These flags indicate only that **planning** for those contracts may begin.
They do NOT authorize executing them.

---

## 4. What This Plan Does NOT Authorize

- Does **not** authorize a real operator pilot run.
  `readyForRealOperatorPilotRun` is literal `false`.
- Does **not** mean public launch.
  `readyForPublicLaunch` is literal `false`.
- Does **not** enable live LLM runtime.
  `readyForLiveLLMRuntime` is literal `false`.
- Does **not** enable persistence.
  `readyForPersistence` is literal `false`.
- Does **not** enable OCR, file upload, or payment.
- Does **not** process real user input.
  `realUserInputProcessed` is literal `false`.
- Does **not** make HTTP requests or call `/api/smart-talk`.
- Does **not** call any live LLM.
- Does **not** modify the API route.

A real pilot run remains blocked until operator identity, reviewer identity,
environment attestation, abort protocol, real input policy, legal disclaimer
policy, completeness warning policy, evidence policy, production monitoring,
and post-run audit are all defined and accepted in 8.2M-1 and later phases.

---

## 5. Required Prerequisites (20)

All of the following must be satisfied before the first real operator pilot run
can be authorized (to be resolved in 8.2M-1+):

| # | Prerequisite |
|---|--------------|
| 1 | `phase_8_2l_closed_with_warnings` |
| 2 | `named_human_operator_required` |
| 3 | `named_human_reviewer_required` |
| 4 | `real_environment_attestation_required` |
| 5 | `internal_runtime_secret_attestation_required` |
| 6 | `allowlist_attestation_required` |
| 7 | `scenario_allowlist_attestation_required` |
| 8 | `kill_switch_attestation_required` |
| 9 | `abort_monitoring_required` |
| 10 | `real_input_policy_required` |
| 11 | `legal_disclaimer_policy_required` |
| 12 | `completeness_warning_policy_required` |
| 13 | `evidence_policy_required` |
| 14 | `no_persistence_variant_or_persistence_policy_required` |
| 15 | `pii_handling_policy_required` |
| 16 | `manual_review_policy_required` |
| 17 | `incident_response_policy_required` |
| 18 | `production_monitoring_policy_required` |
| 19 | `abuse_control_policy_required` |
| 20 | `post_run_audit_required` |

---

## 6. Blocked Capabilities (15)

The following capabilities remain blocked until explicitly authorized in future
phases:

| Capability | Reason |
|------------|--------|
| `public_runtime` | Not authorized — no public launch |
| `anonymous_public_access` | Not authorized — operator identity required |
| `production_user_visible_output` | Not authorized — output contract must be finalized |
| `live_llm_without_operator_authorization` | Blocked — operator authorization required |
| `persistence_without_policy` | Blocked — evidence persistence policy required |
| `dna_save` | Blocked — not authorized |
| `offline_save` | Blocked — not authorized |
| `photo_ocr_runtime` | Blocked — not in scope |
| `file_upload_runtime` | Blocked — not in scope |
| `payment_runtime` | Blocked — not in scope |
| `multilingual_public_runtime` | Blocked — not in scope |
| `automatic_deadline_claims` | Blocked — legal policy required |
| `legal_certainty_claims` | Blocked — legal disclaimer required |
| `unattended_execution` | Blocked — human operator monitoring required |
| `unrestricted_real_user_input` | Blocked — real input policy required |

---

## 7. Open Items (14 — to be resolved in 8.2M-1+)

| Open Item | Phase |
|-----------|-------|
| `operator_identity_contract_not_yet_defined` | 8.2M-1 |
| `reviewer_identity_contract_not_yet_defined` | 8.2M-1 |
| `real_environment_attestation_contract_not_yet_defined` | 8.2M-1 |
| `abort_protocol_not_yet_defined` | 8.2M-2 |
| `real_input_handling_policy_not_yet_defined` | 8.2M-2 |
| `legal_disclaimer_runtime_not_yet_finalized` | TBD |
| `completeness_warning_runtime_not_yet_finalized` | TBD |
| `evidence_persistence_decision_not_yet_finalized` | TBD |
| `pii_handling_policy_not_yet_finalized` | TBD |
| `manual_review_policy_not_yet_finalized` | TBD |
| `incident_response_policy_not_yet_finalized` | TBD |
| `monitoring_policy_not_yet_finalized` | TBD |
| `abuse_controls_not_yet_finalized` | TBD |
| `post_run_audit_not_yet_defined` | TBD |

---

## 8. Safety Invariants

All literal types on `RealOperatorPilotAuthorizationPlanCheckResult`:

| Invariant | Value |
|-----------|-------|
| `readyForRealOperatorPilotRun` | false |
| `readyForPilotRunNow` | false |
| `readyForPublicLaunch` | false |
| `readyForLiveLLMRuntime` | false |
| `readyForPersistence` | false |
| `readyForPhotoOcrRuntime` | false |
| `readyForFileUploadRuntime` | false |
| `readyForPaymentRuntime` | false |
| `realPilotRunExecuted` | false |
| `realUserInputProcessed` | false |
| `httpCallMade` | false |
| `apiRouteCalled` | false |
| `liveLLMCalled` | false |
| `apiRouteModifiedByPlan` | false |
| `uiTouched` | false |
| `persistenceUsed` | false |
| `dnaSavePerformed` | false |
| `offlineSavePerformed` | false |
| `emittedToUserNow` | false |
| `neverUserVisible` | true |

---

## 9. Content Storage Invariants

All literal `false` — no content stored anywhere:

| Invariant | Value |
|-----------|-------|
| `rawTextStored` | false |
| `redactedTextStored` | false |
| `fullDraftTextStored` | false |
| `modelOutputStored` | false |
| `secretStored` | false |
| `userPiiStored` | false |
| `documentContentStored` | false |

---

## 10. Readiness Decision

```
status:                               "ready_for_phase_8_2m_1"  (on clean 8.2L closure)
previousEpochClosureVerified:         true
readyForOperatorIdentityContract:     true
readyForRealEnvironmentAttestationContract: true
readyForAbortProtocol:                true
readyForRealInputPolicy:              true
readyForEvidencePolicy:               true
readyForPostRunAuditPlanning:         true
readyForRealOperatorPilotRun:         false  (literal — blocked)
readyForPilotRunNow:                  false  (literal — permanent)
readyForPublicLaunch:                 false  (literal — permanent)
readyForLiveLLMRuntime:               false  (literal)
readyForPersistence:                  false  (literal)
```

---

## 11. Next Phase Recommendation

**8.2M-1 — Operator and Reviewer Identity Contract**

Define typed contracts for:
- Named human operator identity and attestation
- Named human reviewer identity and attestation
- Real environment variable attestation (attestation-only, no secret values)
- Session identifier and run ID for the real pilot run

After 8.2M-1 passes, subsequent phases (8.2M-2+) may define:
- Abort protocol and kill-switch contract
- Real input handling policy and allowlist contract
- Evidence policy and (optionally) persistence plan
- Legal disclaimer and completeness warning runtime contract
- Production monitoring and incident response policy
- Post-run audit contract

None of these authorize a public launch or expose live LLM to real users.

---

## Update — Phase 8.2M-1

Phase 8.2M-1 defines typed operator/reviewer identity attestation
(`runOperatorReviewerIdentityContractCheck()`). It enforces the distinct-person
rule, rejects forbidden content (secrets, env values, PII, raw text, document
markers), and validates 23 tamper cases. It does not authenticate or persist
identities. Passing sets `readyForRealEnvironmentAttestationContract: true`
and prepares the real environment attestation and abort protocol phases.

---

## Update — Phase 8.2M-2

Phase 8.2M-2 defines attestation-only real environment readiness
(`runRealEnvironmentAttestationContractCheck()`). It does not read `process.env`
or expose values. It requires all 8 env var names to be attested and an
18-item checklist to be confirmed, and validates 26 tamper cases. Passing
sets `readyForAbortProtocol: true` and prepares the abort protocol phase.
