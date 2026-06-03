# Vaylo Smart Talk — Runtime LLM Integration Architecture

**Phase:** 8.2G-0  
**Epoch:** 8.2G — Runtime LLM Integration (Opened)  
**Version:** `8.2g-0-runtime-llm-integration-architecture-v1`  
**Status:** Architecture defined / no live LLM wired  
**Classification:** Internal governance / never user-visible

---

## 1. Executive Summary

Epoch 8.2F (Governance Kernel) has been formally closed as `complete_for_runtime_integration`. All governance contracts, safety validators, forbidden move enforcement, wording governance gates, audit trace vocabulary, attestation contracts, and diagnostic namespace infrastructure are in place.

Epoch 8.2G opens with this document.

**This phase defines the architecture.** No LLM is called. No runtime behavior changes. No user-visible output is produced.

The core architectural question for Epoch 8.2G is:

> *How does an LLM-generated explanation draft enter the governance pipeline, traverse all mandatory gates, and produce a user-visible response — without bypassing any governance constraint defined in Epoch 8.2F?*

This document answers that question as a design contract for the phases of Epoch 8.2G.

---

## 2. Why Epoch 8.2G Exists

The Epoch 8.2F governance kernel defines **what is safe to say** (explanation contracts), **what must never be said** (forbidden moves), **what uncertainty means** (posture), and **how to audit it** (provenance). But the kernel does not produce any explanation text.

To serve real users, the system must:
1. Accept a real document (OCR or structured metadata).
2. Derive a governance posture from the document content.
3. Derive an explanation boundary from the posture.
4. Call an LLM — **constrained by that boundary** — to generate an explanation draft.
5. Validate the LLM draft against the boundary.
6. Apply all mapper and bridge governance layers.
7. Evaluate wording compliance.
8. Gate on human review where required.
9. Record the governance decisions in an audit trail.
10. Assemble and surface a user-visible response **only when all gates pass**.

Epoch 8.2G builds this pipeline step by step.

---

## 3. What Was Completed in Epoch 8.2F

| Component | Status |
|---|---|
| Constitution and Reality Matrix vocabulary | Complete |
| Evidence gate evaluation | Complete |
| Reality simulation orchestrator | Complete |
| Explanation contract boundary derivation | Complete |
| Free preview and paid explanation mapper scaffolds | Complete |
| Smart Talk bridge dry-run with typed BridgeBlockingReason | Complete |
| Wording review and wording evaluation scaffolds | Complete |
| OCR uncertainty governance harness | Complete |
| Pilot gate scaffold with session report and attestation | Complete |
| Incident governance scaffold | Complete |
| Provenance audit trace vocabulary + emission contract | Complete |
| Diagnostic namespace envelope + native adapter | Complete |
| Attestation contracts (OCR, session, wording) | Complete |
| Governance lineage integration audit | Complete |
| Governance kernel closure audit | Complete |

**Nothing in this list changes in Epoch 8.2G.** These are the governance rails. The LLM must run on these rails — not around them.

---

## 4. What "Runtime LLM Integration" Means

Runtime LLM integration means wiring a real LLM call into the governance pipeline such that:

- The LLM **receives only** what the explanation contract permits it to see.
- The LLM **produces only** output that can be validated by the output contract validator.
- **No LLM output reaches a user** until it has passed: the output validator, the mapper, the bridge, the wording evaluation gate, and (where required) the human review gate.
- Every governance decision made during pipeline traversal produces an `AuditTraceEmissionRecord`.
- Every diagnostic emitted during traversal is wrapped in a `DiagnosticNormalizedEnvelope`.
- Any governance breach detected triggers incident governance, not silent failure.

---

## 5. What It Does NOT Mean

- **NOT** giving the LLM freedom to generate any explanation it wants.
- **NOT** bypassing the forbidden move layer because "the LLM is probably safe."
- **NOT** treating LLM output as a trusted governance fact.
- **NOT** surfacing LLM output to users before validation.
- **NOT** removing the bridge dry-run step because it adds latency.
- **NOT** skipping the wording evaluation gate for "low-risk" document types.
- **NOT** exposing audit metadata, trace IDs, or attestation records to users.
- **NOT** calling the LLM with raw OCR text that has not been normalized and quality-gated.

---

## 6. Required Runtime Pipeline

The following 15-layer sequence is mandatory. Layers may not be skipped or reordered.

```
INPUT
  │
  ▼
[1]  input_normalization
     — normalize document metadata
     — populate OcrQualityReport from real OCR provider
     — bind session context to PilotSessionReport
  │
  ▼
[2]  document_reality_simulation
     — run runRealitySimulation
     — derive traps, gates, posture
  │
  ▼
[3]  explanation_contract_builder
     — derive ExplanationBoundary from simulation output
     — encode forbidden moves and required constraints
  │
  ▼
[4]  llm_draft_adapter
     — construct governance-constrained prompt from ExplanationBoundary
     — call LLM
     — return typed LLMDraftOutput
  │
  ▼
[5]  llm_output_contract_validator
     — validate LLMDraftOutput against ExplanationBoundary
     — block forbidden move violations
     — block missing required constraint coverage
     — detect false reassurance / legal verdict posture
     — return LLMOutputContractValidationResult
     — BLOCK: route failing drafts to incident_governance
  │
  ▼
[6]  free_preview_mapper  OR  paid_explanation_mapper
     — receive validated draft
     — apply mapper governance
     — emit per-move diagnostics
  │
  ▼
[7]  smart_talk_bridge
     — dry-run bridge validation
     — check all governance invariants
     — block on any BridgeBlockingReason
  │
  ▼
[8]  wording_evaluation_gate
     — evaluate draft wording via runWordingEvaluationScaffold
     — block non-compliant wording
     — route human_review_required to wording_review_gate
  │
  ▼
[9]  wording_review_gate
     — gate high-risk document types on human review compliance
     — call verifyHumanReviewCompliance
     — block if compliance not established
  │
  ▼
[10] diagnostic_envelope_adapter
     — wrap all emitted diagnostics into DiagnosticNormalizedEnvelope
     — build cross-phase diagnostic correlation record
  │
  ▼
[11] audit_trace_emission
     — emit AuditTraceEmissionRecord at every decision point
     — convert to AuditTraceNode[]
     — build and persist AuditTraceChain
  │
  ▼
[12] incident_governance
     — route any governance breach detected by any upstream layer
     — runIncidentGovernanceScaffold
     — do not proceed to output assembly on unresolved incidents
  │
  ▼
[13] pilot_gate
     — runLimitedPilotGateScaffold
     — verify session attestation
     — block if session limit exceeded
  │
  ▼
[14] user_visible_response_assembler
     — assemble UserVisibleResponseDraft ONLY if all gates passed
     — must not surface any governance metadata
     — must not surface any audit trace or diagnostic data
     — return typed response for API
  │
  ▼
OUTPUT
```

---

## 7. LLM Adapter Boundary

The `llm_draft_adapter` is the **only point** in the pipeline where the LLM is called. It is bounded on both sides:

**Upstream boundary (what enters the LLM):**

| Permitted input | Not permitted |
|---|---|
| Explanation boundary (forbidden moves, required constraints) | Raw OCR text from unvalidated source |
| Uncertainty posture from reality simulation | User PII |
| Document type and section structure | Confidence scores below acceptable threshold |
| Governance-safe section prompts derived from mapper contract | Legal file contents that could trigger hallucination |
| Allowed explanation space from boundary | The phrase "you must" or deadline statements |

**Downstream boundary (what exits the LLM):**

| Permitted output | Not permitted |
|---|---|
| Typed `LLMDraftOutput` with section-by-section text | Raw strings passed directly to API |
| Explanation text constrained to approved sections | Legal verdict statements |
| Wording that supports uncertainty acknowledgment | Deadline calculations or specific amounts |
| Output that will be immediately validated | Output that bypasses `llm_output_contract_validator` |

---

## 8. LLM Input Restrictions

The prompt sent to the LLM must enforce the following restrictions at construction time:

1. **No deadline extraction instruction** — the prompt must not instruct the LLM to calculate, estimate, or state any legal deadline.
2. **No enforcement certainty instruction** — the prompt must not instruct the LLM to state whether enforcement will or will not occur.
3. **No amount extraction instruction** — the prompt must not instruct the LLM to calculate, extract, or confirm specific monetary amounts from uncertain source data.
4. **No legal verdict instruction** — the prompt must not instruct the LLM to conclude whether an action is legal, illegal, enforceable, or unenforceable.
5. **No reassurance instruction** — the prompt must not instruct the LLM to minimize or downplay legal risk.
6. **Forbidden moves encoded** — the prompt must communicate all active `ForbiddenExplanationMove` tokens from the explanation contract.
7. **Required constraints encoded** — the prompt must communicate all active `RequiredExplanationConstraint` tokens.
8. **Posture encoded** — the uncertainty posture (low / medium / high) must be encoded in the prompt framing so the LLM calibrates its language accordingly.
9. **OCR quality communicated** — if OCR confidence is below threshold, the prompt must explicitly instruct the LLM that source fidelity is limited.
10. **Document type communicated** — the prompt must specify the document type so the LLM applies the correct constitutional framing.

---

## 9. LLM Output Restrictions

The `llm_output_contract_validator` must enforce the following on every LLM draft before it may proceed downstream:

1. **No unsupported deadline** — any draft section containing a specific deadline or date claim must be blocked unless the simulation contract explicitly permits it.
2. **No enforcement certainty** — any draft section claiming enforcement will or will not occur must be blocked.
3. **No calculated amount** — any draft section containing a specific monetary amount derived from OCR-uncertain input must be blocked.
4. **No legal verdict** — any draft section taking a definitive legal verdict posture must be blocked.
5. **No false reassurance** — any draft section using language that minimizes documented legal risk must be blocked.
6. **No cross-lane contamination** — free-preview draft sections must not contain paid-tier content; paid sections must not contain free-only framing.
7. **No speculation-as-fact** — any draft section presenting uncertain inferences as established facts must be blocked.
8. **No panic amplification** — any draft section using excessively alarming or urgent language beyond what the governance facts support must be flagged.
9. **Required constraint coverage** — every active `RequiredExplanationConstraint` must be addressed in the draft; any gap must be flagged.
10. **Forbidden move absence** — no active `ForbiddenExplanationMove` may appear in any form in the draft.

Any violation of rules 1–10 must route to `incident_governance` rather than being silently filtered.

---

## 10. Output Contract Validator Role

The `llm_output_contract_validator` (Phase 8.2G-2) is a pure function that:

- Accepts `LLMDraftOutput` and `ExplanationBoundary`.
- Returns `LLMOutputContractValidationResult` with `valid`, `blockingViolations[]`, `warnings[]`, and `neverUserVisible: true`.
- Does **not** modify the draft — it only classifies it.
- Does **not** silently fix violations — violations block or warn; they do not self-heal.
- Does **not** produce user-visible output.

If `valid = false`, the draft must not proceed to any downstream mapper layer.

---

## 11. Wording Governance Gate Role

The `wording_evaluation_gate` (Phase 8.2G-3) wires `runWordingEvaluationScaffold` into the live pipeline:

- Called **after** mapper output is produced.
- Evaluates every user-visible wording string in the draft.
- Returns a `WordingEvaluationResult` with `disposition` (pass / human_review_required / block).
- `block` disposition prevents output assembly entirely.
- `human_review_required` disposition routes to `wording_review_gate`.
- `pass` allows downstream to proceed.

**This gate may not be bypassed.** Every user-visible string must be evaluated.

---

## 12. Human Review Gate Role

The `wording_review_gate` enforces human review compliance for high-risk document types:

- Calls `verifyHumanReviewCompliance` with the document type and evaluation result.
- Returns `WordingReviewComplianceResult`.
- Blocks output assembly if compliance is not established.
- Required for: eviction notices, legal enforcement threats, multi-party disputes, high-uncertainty posture.
- Must be wired in the pilot gate before any pilot transaction is allowed.

---

## 13. Diagnostic Envelope Role

The `diagnostic_envelope_adapter` layer (Phase 8.2G-4) wires `buildDiagnosticEnvelopeFromNativeDiagnostic` at every native diagnostic emission site:

- After each governance layer emits its native diagnostic code, the adapter wraps it.
- All envelopes are collected and passed to `validateDiagnosticNamespaceEnvelopes`.
- Envelopes are stored with the `AuditTraceChain` for post-hoc audit correlation.
- No envelope data is surfaced to users.

---

## 14. Audit Trace Emission Role

The `audit_trace_emission` layer (Phase 8.2G-4) wires `buildAuditTraceNodeFromEmission` at every governance decision point:

- Each governance decision produces an `AuditTraceEmissionRecord`.
- Records are validated by `validateAuditTraceEmission`.
- Records are converted to `AuditTraceNode[]` via `buildAuditTraceNodeFromEmission`.
- An `AuditTraceChain` is assembled and validated by `validateAuditTraceChain`.
- The chain is persisted to the audit store (Phase 8.2G-6).
- No trace data is surfaced to users.

---

## 15. Incident Governance Role

The `incident_governance` layer is automatically triggered (not manually routed) in Epoch 8.2G when:

- `llm_output_contract_validator` returns `valid = false`.
- `wording_evaluation_gate` returns `disposition = block`.
- `smart_talk_bridge` returns `governancePreserved = false`.
- Any `BridgeBlockingReason` is present.
- Any critical `PilotGateDiagnosticCode` is emitted.

`runIncidentGovernanceScaffold` is called with the triggering context. Output assembly **must not** proceed while an unresolved incident is active.

---

## 16. Pilot Gate Role

The `pilot_gate` is the final governance gate before output assembly during the trusted pilot phase:

- Receives a `PilotSessionReport` populated from real auth/session context.
- Verifies session limit has not been exceeded.
- Verifies attestation trust tier.
- **Must also call `verifyHumanReviewCompliance`** before allowing any transaction (current gap, to be resolved in Phase 8.2G-8).
- Returns `PilotGateResult` with `allowed` boolean.
- If `allowed = false`, output assembly must not proceed.

---

## 17. User-Visible Response Assembler Role

The `user_visible_response_assembler` is the last layer before the API response:

- Accepts the validated, gated mapper output.
- Assembles a `UserVisibleResponseDraft` typed object.
- Must never include: audit trace IDs, diagnostic codes, attestation records, governance posture labels, forbidden move names, or any internal governance metadata.
- Must never be called if any upstream gate returned a blocking result.
- Returns a typed response that is safe to serialize to the API.

---

## 18. Non-Negotiable Invariants

These invariants must be preserved through every phase of Epoch 8.2G and beyond. They are the constitutional core of the Vaylo Document Reasoning system.

| # | Invariant |
|---|---|
| 1 | **LLM must not bypass explanation contract** — the LLM prompt must always be derived from `ExplanationBoundary`. |
| 2 | **LLM must not bypass forbidden moves** — all active `ForbiddenExplanationMove` tokens must be encoded in the prompt and checked in the output validator. |
| 3 | **LLM must not bypass required constraints** — all active `RequiredExplanationConstraint` tokens must be encoded and coverage verified. |
| 4 | **LLM must not calculate deadlines** — deadline statements are forbidden unless explicitly authorized by a future validated safe policy (none exists yet). |
| 5 | **LLM must not claim enforcement certainty** — enforcement outcome claims require verified factual backing that the system does not yet have. |
| 6 | **LLM must not produce legal verdict posture** — no statement of legality, illegality, enforceability, or unenforceability. |
| 7 | **LLM must not falsely reassure** — minimizing documented legal risk is `no_false_reassurance_framing` and must be blocked. |
| 8 | **LLM must not extract amounts from uncertain input** — `no_calculated_amount_extraction` applies to all OCR-uncertain monetary values. |
| 9 | **LLM must not merge payment/tax/immigration/appeal lanes** — cross-domain lane contamination is a governance breach. |
| 10 | **LLM must not present dry-run metadata as user-visible fact** — simulation output, posture labels, and contract metadata are internal governance signals. |
| 11 | **LLM output must be validated before any user-visible assembly** — `llm_output_contract_validator` is not optional. |
| 12 | **All unsafe output must be blocked or routed to human review** — silent filtering is not permitted; violations must be incident-logged. |
| 13 | **Audit and diagnostics remain `neverUserVisible`** — `AuditTraceNode`, `DiagnosticNormalizedEnvelope`, `AttestationRecord`, and all governance metadata must never appear in API responses or UI. |

---

## 19. Recommended Phase Sequence for Epoch 8.2G

| Phase | Name | Description |
|---|---|---|
| **8.2G-1** | Runtime LLM Draft Adapter Types + Mock Scaffold | Define `LLMDraftOutput`, `LLMDraftAdapterInput`, `LLMDraftAdapterConfig` types. Build a mock adapter that returns synthetic drafts. No live LLM. |
| **8.2G-2** | LLM Output Contract Validator | Build `validateLLMOutputContract(draft, boundary)` implementing all 10 output restriction rules. Regression scaffold. No live LLM. |
| **8.2G-3** | Wording Governance Runtime Gate | Wire `runWordingEvaluationScaffold` as a live gate in the pipeline. Integrate with mapper output. Regression scaffold proves gate blocks violations. |
| **8.2G-4** | Audit Trace + Diagnostic Envelope Runtime Dry Run | Wire `buildAuditTraceNodeFromEmission` and `buildDiagnosticEnvelopeFromNativeDiagnostic` at all emission sites. Prove end-to-end chain produces `valid=true` AuditTraceChain. |
| **8.2G-5** | First Live LLM Sandboxed Corpus Call | Call a real LLM (sandboxed; no user data; synthetic corpus only) via the mock adapter. Route output through contract validator. Assert no governance violations. |
| **8.2G-6** | User-Visible Response Assembler Scaffold | Define `UserVisibleResponseDraft` type and assembler. Prove assembler only fires when all gates pass. Regression proves no governance metadata leaks. |
| **8.2G-7** | End-to-End Synthetic Runtime Harness | Route synthetic corpus through the full 15-layer pipeline. Assert all gates fire. Assert audit chain is valid. Assert no user-visible governance metadata. |
| **8.2G-8** | Trusted Internal Text-Only Pilot Gate | Wire `verifyHumanReviewCompliance` into pilot gate. Route first real (internal, text-only) documents through the full pipeline. Verify all non-negotiable invariants hold. |

---

## 20. Explicit Production Blockers

None of these are resolved by this phase. All remain as production requirements outside the governance kernel:

1. **No user-facing prose generation** — all mappers return governance metadata. LLM adapter not yet built.
2. **No end-to-end runtime pipeline** — the 15-layer pipeline exists as a plan, not as wired code.
3. **No real-world document corpus** — synthetic exemplars only.
4. **No OCR/photo ingestion path** — no real OCR provider integrated.
5. **No audit persistence** — `AuditTraceChain` not stored anywhere.
6. **No operational human review process** — no tooling, assignment, or SLA.
7. **No multilingual safety layer** — German-language documents only.
8. **No user-visible response assembler** — `UserVisibleResponseDraft` type does not yet exist.
9. **No LLM output contract validator** — `validateLLMOutputContract` does not yet exist.
10. **No real wording evaluation gate wired** — `runWordingEvaluationScaffold` not in the live pipeline.

---

## Phase 8.2G-1 Status

Draft adapter boundary established as mock-only; live LLM remains forbidden.

`RuntimeLLMDraftAdapterInput`, `RuntimeLLMDraftSectionCandidate`, and `RuntimeLLMDraftAdapterResult` are defined. `runRuntimeLLMDraftMockAdapter` implements the mock boundary. `liveLLMCalled: false` and `userVisibleOutputAllowed: false` are compile-time literal types. See `RUNTIME_LLM_DRAFT_ADAPTER.md` for full documentation.

**Next phase: 8.2G-2 — LLM Output Contract Validator.** ✓ completed — see Phase 8.2G-2 Status below.

## Phase 8.2G-2 Status

Output contract validator established. `validateRuntimeLLMOutputContract({ input, result })` is a pure function enforcing 12+ rules across visibility invariants, unsafe safety flags, section type membership, forbidden move / required constraint coverage, and mock prefix discipline. Verdict precedence: `rejected_visibility_violation` > `rejected_unsafe_draft` > `rejected_contract_violation` > `accepted_for_next_gate`. `acceptedForUserVisibleAssembly: false` is a compile-time literal type. 14-case regression scaffold passes. See `RUNTIME_LLM_OUTPUT_CONTRACT_VALIDATOR.md`.

**Next phase: 8.2G-3 — Wording Governance Runtime Gate.**

---

> **This document is an internal governance architecture plan. It is never user-visible. It does not constitute a product specification, legal determination, or compliance certification. No LLM has been called. No user-visible output has been produced. No runtime behavior has changed.**
