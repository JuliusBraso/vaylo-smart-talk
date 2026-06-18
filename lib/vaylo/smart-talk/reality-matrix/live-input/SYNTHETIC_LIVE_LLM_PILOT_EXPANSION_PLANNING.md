# Phase 8.3R — Synthetic Live LLM Pilot Expansion Planning

## 1. Purpose

Phase 8.3R is a **metadata-only planning phase** that expands the synthetic live LLM pilot from one synthetic case (8.3O) to a controlled 10-case synthetic catalog. It builds directly on Phase 8.3Q (Post-Call Audit) and produces two positive gates: `readyForAdditionalSyntheticLiveLlmCaseContract: true` and `readyForSyntheticPilotCaseSetDesign: true`.

**This phase does not call a live LLM.** Each additional synthetic case requires a separate contract before execution.

---

## 2. Synthetic-Only Expansion Boundary

`syntheticOnlyExpansion: true` and `additionalCaseContractRequired: true` are literal `true` invariants. The expansion boundary is enforced at every level:

- `liveLLMCalledAgain: false` (literal)
- `additionalLiveLLMCallsExecuted: false` (literal)
- `readyForRealDocumentInput: false` (literal — new gate in 8.3R)
- `readyForUserVisibleOutput: false` (literal — new gate in 8.3R)
- `readyForPublicLaunch: false` (literal)
- `readyForPersistence: false` (literal)

---

## 3. What This Phase Plans

This phase defines a typed, metadata-only expansion plan for the synthetic live LLM pilot. It does NOT execute any case.

Planned outputs:
- 18 required scopes
- 10-case synthetic catalog
- 7 risk classes
- 12 expected behaviors per case
- 19 requirements
- 20 blockers
- 19 checklist items
- 5 acknowledgment statements
- 70 forbidden strings

---

## 4. What This Phase Does Not Authorize

| Unauthorized action | Enforced by |
|---|---|
| Live LLM call | `liveLLMCalledAgain: false` (literal) |
| Additional live calls | `additionalLiveLLMCallsExecuted: false` (literal) |
| Real document input | `readyForRealDocumentInput: false` (literal) |
| User-visible output | `readyForUserVisibleOutput: false` (literal) |
| Public runtime | `readyForPublicLaunch: false` (literal) |
| Persistence | `readyForPersistence: false` (literal) |
| Real operator pilot | `readyForRealOperatorPilotRun: false` (literal) |
| Branch C / runSmartTalk / OCR | All call/import flags `false` (literal) |

---

## 5. Proposed Synthetic Case Catalog

| # | Case ID | Risk Class |
|---|---|---|
| 1 | `synthetic_deadline_relative_missing_delivery_date` | medium_risk_deadline |
| 2 | `synthetic_explicit_payment_deadline` | medium_risk_deadline |
| 3 | `synthetic_high_risk_widerspruch_deadline` | high_risk_legal_or_immigration |
| 4 | `synthetic_immigration_uncertainty` | high_risk_legal_or_immigration |
| 5 | `synthetic_missing_pages_incomplete_document` | incomplete_input_trap |
| 6 | `synthetic_legal_certainty_trap` | hallucination_trap |
| 7 | `synthetic_unsafe_next_step_trap` | hallucination_trap |
| 8 | `synthetic_noisy_ocr_letter` | ocr_noise_trap |
| 9 | `synthetic_multi_authority_letter` | multi_authority_confusion |
| 10 | `synthetic_overpayment_notice` | low_risk_explanation |

Case 1 was executed in 8.3O. Cases 2–10 each require a separate contract per the `additionalCaseContractRequired: true` invariant.

---

## 6. Risk Classes

All 7 classes are required:

| Class | Examples |
|---|---|
| `low_risk_explanation` | Benefit/insurance overpayment notice |
| `medium_risk_deadline` | Payment deadlines, relative deadlines |
| `high_risk_legal_or_immigration` | Widerspruch deadlines, immigration risk |
| `hallucination_trap` | Legal certainty, unsafe next-step traps |
| `incomplete_input_trap` | Missing pages, no delivery date |
| `ocr_noise_trap` | Noisy OCR / scanned letter artefacts |
| `multi_authority_confusion` | Letters referencing multiple authorities |

---

## 7. Expected Behaviors

All 12 required expected behaviors apply to every case:

- `preserve_uncertainty`
- `do_not_invent_deadline`
- `require_delivery_date_when_relative`
- `cite_document_limitation`
- `avoid_legal_certainty`
- `block_unsafe_next_step`
- `mark_output_untrusted`
- `require_governance_recheck`
- `require_post_call_audit`
- `keep_user_visible_output_blocked`
- `keep_persistence_blocked`
- `keep_public_runtime_blocked`

---

## 8. Required Future Contract

Before executing any case from 2–10, a dedicated contract must be created covering:

- Case ID and risk class
- Expected behaviors
- Kill switch state (armed)
- Single-call counter (0 → 1)
- Prompt non-logging policy
- Model output untrusted marker
- Metadata-only capture
- Post-call governance recheck
- Post-call audit

The `additionalCaseContractRequired: true` literal invariant enforces this gate.

---

## 9. Runtime Isolation

18 required scopes including `no_branch_c`, `no_run_smart_talk`, `no_ocr_runtime`, `no_real_document_input`, and `no_general_live_llm_runtime`. All dependency and call flags remain literal `false`. The 8.3Q post-call audit chain is verified before planning proceeds (39 invariants).

---

## 10. Public / Runtime / Persistence Blocks

| Flag | Value |
|---|---|
| `readyForLiveLLMRuntime` | `false` (literal) |
| `readyForPublicLaunch` | `false` (literal) |
| `readyForPersistence` | `false` (literal) |
| `readyForRealDocumentInput` | `false` (literal) |
| `readyForUserVisibleOutput` | `false` (literal) |
| `userVisibleOutputEmitted` | `false` (literal) |
| `persistenceUsed` | `false` (literal) |
| `publicRuntimeEnabled` | `false` (literal) |

---

## 11. Tamper Rejection

90 tamper cases. Key categories:

| Tamper | Rejection Reason |
|---|---|
| `auditReady: false` | `post_call_audit_not_ready` |
| Missing scope/case/risk class/behavior/req/blocker/checklist (7) | `missing_*` |
| `metadataOnlyPlanning: false` | `unsafe_planning_note_detected` |
| `additionalCaseContractRequired: false` | `unsafe_planning_note_detected` |
| `liveLLMCalledAgain: true` | `live_call_attempted_in_planning` |
| `additionalLiveLLMCallsExecuted: true` | `live_call_attempted_in_planning` |
| `readyForRealDocumentInput: true` | `real_document_input_authorized` |
| `readyForUserVisibleOutput: true` | `user_visible_output_detected` |
| `readyForLiveLLMRuntime: true` | `general_live_llm_runtime_authorized` |
| `readyForPublicLaunch: true` | `public_runtime_detected` |
| Notes: new 8.3R forbidden phrases | `unsafe_planning_note_detected` |

New 8.3R-specific forbidden phrases: `"real document input ready"`, `"additional live calls executed"`, `"synthetic outputs approved for users"`, `"production live runtime ready"`.

---

## 12. Readiness Decision

On success (`allPassed: true`):

```
readyForAdditionalSyntheticLiveLlmCaseContract: true
readyForSyntheticPilotCaseSetDesign: true
liveLLMCalledAgain: false
additionalLiveLLMCallsExecuted: false
readyForRealDocumentInput: false
readyForUserVisibleOutput: false
readyForPublicLaunch: false
readyForPersistence: false
metadataOnlyPlanning: true
syntheticOnlyExpansion: true
additionalCaseContractRequired: true
```

---

## 13. Next Phase

**Phase 8.3S — Additional Synthetic Live LLM Case Contract**

This phase will call `runSyntheticLiveLlmPilotExpansionPlanning()`, verify `readyForAdditionalSyntheticLiveLlmCaseContract: true`, and define a typed contract for one additional synthetic case from the 8.3R catalog. It will remain metadata-only, synthetic-only, and will require a separate execution plan, dry-run authorization, and post-call audit chain per case.
