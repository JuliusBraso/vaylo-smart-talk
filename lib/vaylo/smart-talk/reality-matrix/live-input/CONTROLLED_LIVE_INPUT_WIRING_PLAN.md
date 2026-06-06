# Controlled Live Input Wiring Plan — Phase 8.2H-0

**Status:** Planning only. No implementation. No API/UI changes. No live LLM call. No persistence.

---

## 1. Purpose

Phase 8.2H-0 opens the epoch after the formally closed 8.2G Runtime Integration Epoch. It defines the boundary model, allowed paths, required guards, and implementation sequence for introducing controlled real text input into the 8.2G governance pipeline — without weakening any existing guardrails or creating public exposure.

---

## 2. What 8.2G Closed

The 8.2G epoch delivered:
- Internal runtime pipeline (mock adapter → output contract → wording gate → assembler → authorisation gate)
- Synthetic E2E harness with 6 fixture modes and 12 regression cases
- Corpus-guided scenario coverage (6 base + 6 optional scenarios across 5 governance outcome paths)
- Guarded synthetic API delivery branch (`internalRuntimeMode: "synthetic_e2e_guarded"`)
- Authenticated internal mode (`x-vaylo-internal-runtime-secret` + `VAYLO_INTERNAL_RUNTIME_SECRET`)
- Runtime closure audit (`runRuntimeClosureAudit`) confirming epoch closure

**8.2G proved: the governance pipeline works on synthetic input. It did not process real user text.**

---

## 3. What 8.2H Is Allowed to Introduce

8.2H may introduce, **phase by phase and behind explicit guards only**:

- Real plain-text user input (`real_text_guarded`) through the governance pipeline
- Real user question text (`real_question_guarded`) through the governance pipeline
- A hardened live-text API mode (not public, not default, not anonymous)

All of the above require all 12 required guards to be in place first.

---

## 4. What 8.2H-0 Does NOT Implement

This planning phase implements nothing. Specifically:

- No real user input is processed in 8.2H-0
- No live LLM is called
- No API route is modified
- No UI component is changed
- No persistence is added
- No DNA or offline save is added
- No payment gating is added
- No OCR pipeline is touched
- No public launch preparation is made
- No Smart Talk behaviour changes for existing users

---

## 5. Allowed Initial Input Modes

| Mode | Status in 8.2H | Notes |
|------|---------------|-------|
| `real_text_guarded` | `allowed_later` (8.2H-3+) | Plain text behind all 12 guards |
| `real_question_guarded` | `allowed_later` (8.2H-3+) | Question text behind same guards |
| `real_document_text_guarded` | `blocked_this_phase` | Requires document boundary types and source-binding contracts — future epoch |

---

## 6. Blocked Capabilities

The following capabilities are **explicitly blocked** throughout 8.2H and must not be added without a dedicated governance phase:

| Capability | Reason |
|------------|--------|
| OCR / photo input | No governance path defined; separate epoch required |
| File upload processing | No document boundary types or source-binding contracts |
| Payment processing | Pricing governance out of scope for 8.2H |
| Public anonymous live runtime | Requires pilot evidence, audit persistence, and security review |
| Automatic DNA save | Explicitly blocked; no user consent model in scope |
| Automatic offline save | Explicitly blocked; no storage governance in scope |
| Audit persistence | In-memory only; append-only log is a future phase |
| Multilingual live runtime | German-only corpus; sk/en localization not in scope |
| B2B visibility | Separate commercial access layer out of scope |
| Deadline calculation | Forbidden by governance constitution |
| Legal conclusion generation | Forbidden by governance constitution |

---

## 7. Required Guards Before Any Real Text Reaches Runtime

All 12 guards must be implemented and verified **before** real text flows through the governance pipeline:

1. `explicit_internal_feature_flag` — environment variable gate (already in 8.2G)
2. `authenticated_internal_access` — secret header guard (already in 8.2G)
3. `input_contract_validation` — new in 8.2H-1: validate, sanitise, and length-bound input before pipeline entry
4. `redaction_boundary` — new in 8.2H-2: strip or flag PII patterns before governance stages
5. `no_persistence_boundary` — compile-time and runtime enforced; no DB writes
6. `no_dna_save_boundary` — compile-time enforced literal `false`
7. `no_offline_save_boundary` — compile-time enforced literal `false`
8. `output_contract_validation` — existing 8.2G-2/5A layer; validates every draft before wording gate
9. `wording_governance_gate` — existing 8.2G-3/6A layer; blocks unsafe wording
10. `response_assembler_gate` — existing 8.2G-6 layer; rejects leaked metadata and empty sections
11. `user_visible_authorisation_gate` — existing 8.2G-7 layer; final authorisation before packet delivery
12. `failure_fallback_policy` — new in 8.2H-3: explicit safe-failure response when any gate rejects

---

## 8. Required Governance Path for Live Text

```
real user text (guarded)
  → input contract validation (8.2H-1)
  → redaction boundary (8.2H-2)
  → controlled live text adapter (8.2H-3)
  → validateRuntimeLLMOutputContract()    [8.2G-2/5A]
  → runRuntimeWordingGovernanceGate()      [8.2G-3/6A]
  → runRuntimeResponseAssemblerBridge()    [8.2G-6]
  → runRuntimeUserVisibleAuthorisationGate() [8.2G-7]
  → UserVisibleResponsePacket (internal, never delivered directly)
  → guarded API delivery (8.2H-5, extends 8.2G-9)
```

No stage may be skipped. Every real text request must traverse the full chain.

---

## 9. No Persistence Rule

No stage in the 8.2H live input pipeline may write to any persistent store. This includes:
- Supabase tables
- Local storage
- DNA (Vaylo document storage)
- Offline cache
- Telemetry sinks
- Raw input/output logs

All result objects must carry `persistenceUsed: false` as a literal type throughout 8.2H.

---

## 10. No DNA / Offline Save Rule

`dnaSavePerformed: false` and `offlineSavePerformed: false` must remain literal `false` on every result type in 8.2H. No user input or governance output may be silently saved.

---

## 11. No OCR / Photo Rule

8.2H does not introduce photo or document scan input. All input must be explicit user-provided text only. The OCR runtime is not in scope.

---

## 12. No Public Launch Rule

8.2H introduces controlled internal live-text input only. It does NOT:
- Make Smart Talk available to all anonymous users via live LLM
- Remove the feature flag or secret header requirement
- Enable payment-gated completeness
- Pass a security review
- Launch to production

`readyForPublicLaunch: false` is a literal type that must remain `false` throughout the entire 8.2H epoch.

---

## 13. Proposed Next Phases

| Phase | Title | Scope |
|-------|-------|-------|
| **8.2H-1** | Real Text Input Contract Types | Define `ControlledLiveTextInputContract`, validation types, and length/sanitisation bounds |
| **8.2H-2** | Redaction and Input Guard Boundary | PII redaction layer, forbidden pattern filter, input guard types |
| **8.2H-3** | Controlled Live Text Adapter | Thin adapter accepting governed real text; feeds 8.2G pipeline |
| **8.2H-4** | Controlled Live Text E2E Harness | Extends 8.2G-8 harness with real-text fixture modes |
| **8.2H-5** | Guarded Internal Live Text API Mode | Adds a `real_text_guarded` branch to the Smart Talk API route |
| **8.2H-6** | Controlled Live Input Closure Audit | Formal closure audit for 8.2H; confirms all 12 guards hold under real text |

---

## 14. Exit Criteria for 8.2H-0

8.2H-0 is complete when:
- [x] `CONTROLLED_LIVE_INPUT_WIRING_PLAN_V1` constant exists and TypeScript compiles
- [x] `readyForPublicLaunch: false` literal enforced
- [x] `readyForImplementationPhase: "phase_8_2h_1_real_text_input_contract_types"` set
- [x] All 11 blocked capabilities listed
- [x] All 12 required guards listed
- [x] All 6 next phases listed
- [x] This plan document written
- [x] TypeScript and ESLint pass
- [x] No implementation code added
- [x] No API/UI modified
- [x] No live LLM called
- [x] No persistence added

---

## 8.2H-1 Status (completed)

Phase 8.2H-1 delivered `RealTextInputContractInput`, `RealTextInputContractValidationResult`, and `runRealTextInputContractValidation()`. Valid text exits with `acceptedForRedactionBoundary: true`. It carries `acceptedForLLM: false` and `acceptedForRuntimePipeline: false` — downstream phases (8.2H-2+) unlock those gates when their own guards are in place. No text is logged, persisted, or passed to LLM in 8.2H-1.

---

## 8.2H-2 Status (completed)

Phase 8.2H-2 delivered `RealTextRedactionBoundaryInput`, `RealTextRedactionBoundaryResult`, and `runRealTextRedactionBoundary()`. Redacted text exits with `acceptedForControlledLiveAdapter: true`; `acceptedForLLM: false` and `acceptedForRuntimePipeline: false` remain locked. Match audit records store kind, risk level, and placeholder only — raw matched values are never stored. A post-redaction invariant check confirms email and IBAN patterns are absent from the redacted output before acceptance.

---

## 8.2H-3 Status (completed)

Phase 8.2H-3 delivered `ControlledLiveTextAdapterInput`, `ControlledLiveTextAdapterResult`, and `runControlledLiveTextAdapter()`. The adapter wraps redacted text only — it does not answer, summarise, translate, or generate prose. `adaptedForOutputContractValidation: true` on success; `acceptedForLLM: false` and `acceptedForRuntimePipeline: false` remain locked. A post-build invariant check enforces the `[CONTROLLED_LIVE_TEXT_DRAFT_NEVER_USER_VISIBLE]` prefix on all section candidates. Not yet wired to output contract validation or API.

**Next: Phase 8.2H-4 — Controlled Live Text E2E Harness**
