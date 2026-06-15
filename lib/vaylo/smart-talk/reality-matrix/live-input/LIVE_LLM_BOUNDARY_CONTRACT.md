# PHASE 8.3B — Live LLM Boundary Contract

**Epoch:** 8.3 — Connected AI Runtime Authorization
**Check ID:** 8.3B
**Mode:** BOUNDARY CONTRACT ONLY / NO LIVE LLM / NO AI OUTPUT / NO PERSISTENCE / NO PUBLIC RUNTIME

---

## 1. Purpose

Define the typed live LLM boundary for the future governance-controlled AI
runtime. This contract explicitly isolates the existing public Smart Talk live
runtime from the governance chain, establishes the allowed provider and model
policy, defines preconditions and output-handling requirements, and sets the
only positive readiness gate: `readyForRedactedInputForwardingContract`.

---

## 2. Existing Smart Talk Live Runtime Isolation

The existing public Smart Talk live runtime was identified in a read-only audit:

| Component | Path | Status |
|-----------|------|--------|
| Route entry point | `app/api/smart-talk/route.ts` — Branch C | **Legacy/current. NOT authorized for governance chain.** |
| Live LLM call | `lib/vaylo/smart-talk/run-smart-talk.ts` → `https://api.openai.com/v1/chat/completions` | **Legacy/current. NOT authorized for governance chain.** |
| OCR live call | `lib/vaylo/smart-talk/extract-text-from-image.ts` → OpenAI | **NOT authorized for text pilot boundary.** |

The literal flags `publicBranchCAuthorizedForGovernanceChain: false`,
`runSmartTalkAuthorizedForGovernanceChain: false`, and
`extractTextFromImageAuthorizedForGovernanceChain: false` are enforced on both
the `LiveLlmBoundaryContractInput` and `LiveLlmBoundaryContractResult`. Neither
this contract nor any governance-chain test may call, wrap, or import those
paths until a future contract explicitly authorizes the integration.

---

## 3. What This Boundary Does NOT Authorize

- Does **not** call a live LLM. `liveLLMCalled` is literal `false`.
- Does **not** authorize live LLM runtime. `readyForLiveLLMRuntime` is literal `false`.
- Does **not** call, wrap, or import `run-smart-talk.ts`. `runSmartTalkAuthorizedForGovernanceChain: false`.
- Does **not** call, wrap, or import `extract-text-from-image.ts`. `extractTextFromImageAuthorizedForGovernanceChain: false`.
- Does **not** call Branch C of `app/api/smart-talk/route.ts`. `publicBranchCAuthorizedForGovernanceChain: false`.
- Does **not** authorize AI output generation. `aiOutputGenerated` is literal `false`.
- Does **not** authorize real input forwarding. `rawInputForwarded` is literal `false`.
- Does **not** authorize user-visible output. `emittedToUserNow` is literal `false`.
- Does **not** authorize `pilotRunNow`. `readyForPilotRunNow` is literal `false`.
- Does **not** authorize public launch. `readyForPublicLaunch` is literal `false`.
- Does **not** authorize persistence. `readyForPersistence` is literal `false`.
- Does **not** read `process.env`. `envValuesReadByContract: false`.
- Does **not** print or store env values or secrets. `envValuesPrinted: false`, `envValuesStored: false`.
- Does **not** modify DB/storage. `databaseOrStorageModifiedByBoundary: false`.
- Does **not** modify API routes. `apiRouteModifiedByLiveLlmBoundary: false`.
- Does **not** modify the existing runtime. `existingRuntimeModifiedByBoundary: false`.
- Does **not** modify UI. `uiTouched: false`.

---

## 4. Allowed Provider

Only `"openai"` is in `ALLOWED_LIVE_LLM_PROVIDERS`. Other providers may be
added in future contracts as separate boundary amendments.

---

## 5. Model Policies (4)

All 4 must be present in `modelPolicies`:

| Policy |
|--------|
| `gpt_4o_mini_allowed_for_controlled_internal_test_only` |
| `model_must_come_from_allowlisted_env_name` |
| `model_must_not_be_hardcoded_by_governance_runtime` |
| `ocr_model_not_allowed_for_text_pilot_boundary` |

Note: `gpt-4o-mini` is the existing default in `run-smart-talk.ts`. For the
governance-controlled chain, the model must come from an allowlisted env var
name (not hardcoded), and the OCR model path is not authorized for the text
pilot boundary.

---

## 6. Preconditions (16)

All 16 must be present in `preconditions`. Includes explicit isolation of
Branch C, `run-smart-talk`, and `extract-text-from-image`, and explicit
blocking of env value reads, raw input forwarding, AI output storage,
user-visible output, persistence, and public runtime. Rate limit and cost limit
policies are deferred to later contracts.

---

## 7. Output Handling Requirements (10)

All 10 must be present in `outputHandlingRequirements`:

| Requirement |
|-------------|
| `ai_output_must_be_treated_as_untrusted` |
| `ai_output_must_enter_governance_recheck` |
| `ai_output_must_not_be_user_visible_directly` |
| `ai_output_must_not_be_persisted` |
| `ai_output_must_not_update_dna` |
| `ai_output_must_not_be_saved_offline` |
| `ai_output_must_not_claim_legal_certainty` |
| `ai_output_must_not_calculate_deadline_without_evidence` |
| `ai_output_must_preserve_uncertainty` |
| `ai_output_requires_manual_review_before_display` |

---

## 8. Checklist (18 items)

All 18 must be confirmed in `checklistConfirmed`. Covers existing runtime
isolation review, provider/model/precondition/output-handling review, the
three downstream contract requirements (redacted input, governance recheck,
manual review), and the 8 "no-X" safety confirmations.

---

## 9. Forbidden Values / Content

27 forbidden strings (API keys, env assignments, raw/draft text markers,
stored-content phrases, PII, document markers, sensitive personal markers,
high-risk legal markers). Scanned across `contractId`, operator/reviewer
acknowledgments, and all notes.

---

## 10. Tamper Rejection Cases (53)

All 53 tamper cases must be rejected. Covers:
- 8 existing runtime isolation flags
- 5 list-completeness tampers (provider/model/precondition/output/checklist)
- 6 env/secret flag tampers
- 6 live-LLM/AI-output/input execution flags
- 2 acknowledgment completeness tampers
- 8 `contains*` flags
- 12 note string/phrase/PII/legal-marker tampers
- 6 runtime tampers (persistence/DNA/offline/public/emitted)

---

## 11. Safety Invariants

All literal types on `LiveLlmBoundaryContractCheckResult`:

| Invariant | Value |
|-----------|-------|
| `readyForLiveLLMRuntime` | false |
| `readyForConnectedAiRuntimeExecution` | false |
| `readyForRealOperatorPilotRun` | false |
| `readyForPilotRunNow` | false |
| `readyForPublicLaunch` | false |
| `readyForPersistence` | false |
| `publicBranchCAuthorizedForGovernanceChain` | false |
| `runSmartTalkAuthorizedForGovernanceChain` | false |
| `extractTextFromImageAuthorizedForGovernanceChain` | false |
| `liveLLMCalled` | false |
| `aiOutputGenerated` | false |
| `modelOutputStored` | false |
| `realInputProcessed` | false |
| `rawInputForwarded` | false |
| `persistenceUsed` | false |
| `publicRuntimeEnabled` | false |
| `emittedToUserNow` | false |
| `neverUserVisible` | true |

---

## 12. Readiness Decision

```
checkId:                                    "8.3B"
allPassed:                                  true
connectedAiAuthorizationPlanReady:          true
syntheticLiveLlmBoundaryAccepted:           true
tamperCasesRejected:                        true  (53/53)
readyForRedactedInputForwardingContract:    true
readyForLiveLLMRuntime:                     false  (literal)
readyForConnectedAiRuntimeExecution:        false  (literal)
publicBranchCAuthorizedForGovernanceChain:  false  (literal)
runSmartTalkAuthorizedForGovernanceChain:   false  (literal)
liveLLMCalled:                              false  (literal)
aiOutputGenerated:                          false  (literal)
```

---

## 13. Next Phase

**8.3C (or equivalent) — Redacted Input Forwarding Contract**

Defines the typed constraints for how redacted user input may be forwarded
into the governance-controlled AI runtime. Must address how `run-smart-talk.ts`
(or a new governance-controlled adapter) safely receives redacted text without
exposing raw input. Depends on `readyForRedactedInputForwardingContract: true`
set by Phase 8.3B.
