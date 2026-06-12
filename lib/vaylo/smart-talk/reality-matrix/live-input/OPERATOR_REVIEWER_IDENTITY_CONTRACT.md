# PHASE 8.2M-1 — Operator and Reviewer Identity Contract

**Epoch:** 8.2M — Real Operator Pilot Authorization
**Check ID:** 8.2M-1
**Mode:** IDENTITY ATTESTATION CONTRACT ONLY / NO REAL PILOT RUN

---

## 1. Purpose

Define the typed safety contract that a named human operator and a named human
reviewer must satisfy before any real operator pilot run can be authorized.

This phase verifies the 8.2M-0 authorization plan (`runRealOperatorPilotAuthorizationPlanCheck()`),
validates a synthetic safe identity input, and runs 23 tamper rejection cases.

---

## 2. What Identity Attestation Means

A **named human operator** is a specific, known internal person who:
- Accepts responsibility for the run session.
- Holds a distinct `humanId` that identifies them in the pilot session.
- Provides an attestation statement confirming they are named, understand
  the constraints, and accept the operator responsibilities.

A **named human reviewer** is a different, known internal person who:
- Is distinct from the operator (different `humanId`).
- Reviews and signs off on the run results.
- Provides their own attestation statement.

The `pilotSessionId` ties both attestations to a specific planned run session.

---

## 3. What This Contract Does NOT Do

- Does **not** implement authentication. No tokens, no sessions, no Supabase Auth.
- Does **not** persist identity records. No DB writes, no storage writes.
- Does **not** authorize a real pilot run.
  `readyForRealOperatorPilotRun` is literal `false`.
- Does **not** process real user input.
  `realUserInputProcessed` is literal `false`.
- Does **not** call any live LLM or make HTTP requests.
- Does **not** modify the API route or UI.
- This contract only defines the typed requirement shape and validates it.

---

## 4. Operator Identity Requirements

| Requirement | Rule |
|-------------|------|
| `humanId` | Non-empty, no forbidden strings, no PII patterns, no document markers |
| `displayLabel` | Non-empty string |
| `role` | Must be `"operator"` |
| `attestedAtIso` | Must be a valid ISO-8601 date string |
| `attestationStatement` | Must include the required operator responsibility statement |
| `operatorIsNamedHuman` | Must be `true` |
| `operatorAcceptedResponsibilities` | Must be `true` |

---

## 5. Reviewer Identity Requirements

| Requirement | Rule |
|-------------|------|
| `humanId` | Non-empty, distinct from operator `humanId`, no forbidden strings |
| `displayLabel` | Non-empty string |
| `role` | Must be `"reviewer"` |
| `attestedAtIso` | Must be a valid ISO-8601 date string |
| `attestationStatement` | Must include the required reviewer responsibility statement |
| `reviewerIsNamedHuman` | Must be `true` |
| `reviewerAcceptedResponsibilities` | Must be `true` |

---

## 6. Distinct-Person Rule

The operator and reviewer must be different people:
- `operatorAndReviewerAreDistinct` must be `true`.
- `operator.humanId !== reviewer.humanId`.

If either condition fails, the reason `same_operator_and_reviewer` is added.

---

## 7. Responsibility Statements

Both operator and reviewer must include the following in their attestation
statements:

**Operator attestation statement must include:**
> "I confirm I am a named human operator for this internal pilot planning step."

**Reviewer attestation statement must include:**
> "I confirm I am a named human reviewer for this internal pilot planning step."

**Both must acknowledge:**
> "I understand this does not authorize real pilot execution."
> "I understand public launch, live LLM runtime, and persistence remain blocked."

---

## 8. Forbidden Identity Content

The following must never appear in any identity field, attestation statement,
or notes. Detection triggers the appropriate rejection reason:

| Category | Forbidden patterns |
|----------|--------------------|
| API keys / secrets | `"sk-"`, `"OPENAI_API_KEY"`, `"VAYLO_INTERNAL_RUNTIME_SECRET"`, `"apiKey"`, `"internalSecret"` |
| Env references | `"process.env"` |
| Raw/draft text markers | `"rawInputText"`, `"redactedText"`, `"fullDraftText"`, `"modelOutput"`, `"SYNTHETIC_TEXT_NEVER_REAL_USER_DATA"` |
| PII | `"john@example.com"`, `"+49 170 1234567"`, email patterns, phone patterns |
| Document content | `"IBAN"`, `"Steuer-ID"`, `"Aktenzeichen"`, `"Sehr geehrter"`, `"BG-Nr"` |

---

## 9. Tamper Rejection Cases (23)

All 23 tamper cases must be rejected:

| # | Tamper | Expected rejection reason |
|---|--------|--------------------------|
| 1 | `authorizationPlanReady: false` | `authorization_plan_not_ready` |
| 2 | Empty `pilotSessionId` | `missing_pilot_session_id` |
| 3 | Empty `operator.humanId` | `missing_operator_identity` |
| 4 | Empty `reviewer.humanId` | `missing_reviewer_identity` |
| 5 | `operator.role = "reviewer"` | `missing_operator_role` |
| 6 | `reviewer.role = "operator"` | `missing_reviewer_role` |
| 7 | Same `humanId` for both | `same_operator_and_reviewer` |
| 8 | `operatorAndReviewerAreDistinct: false` | `same_operator_and_reviewer` |
| 9 | Invalid `operator.attestedAtIso` | `invalid_attestation_timestamp` |
| 10 | Missing operator attestation statement | `missing_operator_attestation` |
| 11 | Missing reviewer attestation statement | `missing_reviewer_attestation` |
| 12 | `containsSecret: true` | `forbidden_secret_detected` |
| 13 | `containsEnvValue: true` | `forbidden_env_value_detected` |
| 14 | Notes includes `"process.env"` | `forbidden_secret_detected` / `unsafe_notes_detected` |
| 15 | Notes includes `"OPENAI_API_KEY"` | `forbidden_secret_detected` |
| 16 | Notes includes `"john@example.com"` | `forbidden_pii_detected` |
| 17 | Notes includes `"+49 170 1234567"` | `forbidden_pii_detected` |
| 18 | Notes includes `"Aktenzeichen"` | `forbidden_document_content_detected` |
| 19 | `containsRealUserInput: true` | `real_user_input_detected` |
| 20 | `persistenceUsed: true` | `persistence_claim_detected` |
| 21 | `liveLLMCalled: true` | `live_llm_claim_detected` |
| 22 | `publicRuntimeEnabled: true` | `public_runtime_claim_detected` |
| 23 | `emittedToUserNow: true` | `user_visible_output_claim_detected` |

---

## 10. Safety Invariants

All literal types on `OperatorReviewerIdentityContractResult` and
`OperatorReviewerIdentityContractCheckResult`:

| Invariant | Value |
|-----------|-------|
| `readyForRealOperatorPilotRun` | false |
| `readyForPilotRunNow` | false |
| `readyForPublicLaunch` | false |
| `readyForLiveLLMRuntime` | false |
| `readyForPersistence` | false |
| `realPilotRunExecuted` | false |
| `realUserInputProcessed` | false |
| `httpCallMade` | false |
| `apiRouteCalled` | false |
| `liveLLMCalled` | false |
| `apiRouteModifiedByIdentityContract` | false |
| `uiTouched` | false |
| `persistenceUsed` | false |
| `emittedToUserNow` | false |
| `neverUserVisible` | true |

---

## 11. Readiness Decision

```
checkId:                                "8.2M-1"
allPassed:                              true  (on clean plan + synthetic + tamper pass)
syntheticIdentityAccepted:              true
tamperCasesRejected:                    true
readyForRealEnvironmentAttestationContract: true
readyForAbortProtocol:                  true
readyForRealInputPolicy:                true
readyForEvidencePolicy:                 true
readyForPostRunAuditPlanning:           true
readyForRealOperatorPilotRun:           false  (literal)
readyForPilotRunNow:                    false  (literal)
readyForPublicLaunch:                   false  (literal)
```

---

## 12. Next Phase

**8.2M-2 — Real Environment Attestation Contract**

The real environment attestation contract will define the typed requirements
for an operator to attest (without reading values) that all required
environment variables are correctly configured for a real operator pilot run.

This builds on `readyForRealEnvironmentAttestationContract: true` set by
Phase 8.2M-1.
