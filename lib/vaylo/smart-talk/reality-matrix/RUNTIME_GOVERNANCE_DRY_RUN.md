# RUNTIME_GOVERNANCE_DRY_RUN.md — Phase 8.2G-4

## 1. Purpose

Phase 8.2G-4 creates a runtime dry-run harness (`runRuntimeGovernanceDryRun`) that
connects the three 8.2G pipeline gates to the existing 8.2F audit trace emission and
diagnostic envelope adapter infrastructure. It proves the full governance chain can
run deterministically without calling any live LLM, without persistence, and without
producing user-visible output.

---

## 2. Why the dry run exists

The 8.2G pipeline introduces LLM draft generation into the governance stack. Before
any live LLM call is ever made (in a future phase), the governance infrastructure
must prove it can:

- Produce a valid, parent-linked `AuditTraceChain` from pipeline gate outputs.
- Normalize all native diagnostic codes from every gate into `DiagnosticNormalizedEnvelope`
  instances that pass namespace validation.
- Return a never-user-visible structured result in all scenarios (success, human review,
  contract block, wording gate block).

The dry run is the compile-time and runtime proof of this capability.

---

## 3. Pipeline covered

```
runRuntimeGovernanceDryRun (8.2G-4)
  ├── runRuntimeLLMDraftMockAdapter (8.2G-1)
  ├── validateRuntimeLLMOutputContract (8.2G-2)
  ├── runRuntimeWordingGovernanceGate (8.2G-3)
  ├── validateAuditTraceEmission × 3 (8.2F-15N)
  ├── buildAuditTraceNodeFromEmission × 3 (8.2F-15N)
  ├── validateAuditTraceChain (8.2F-15H)
  ├── buildDiagnosticEnvelopesFromNativeDiagnostics (8.2F-15O)
  └── validateDiagnosticNamespaceEnvelopes (8.2F-15J)
```

---

## 4. What it proves

- A full governance chain can run end-to-end without side effects.
- `AuditTraceChain` with 3 nodes (adapter root → output contract → wording gate)
  is structurally valid per `validateAuditTraceChain`.
- All native diagnostic codes from every gate (draft adapter, output contract
  validator, wording gate) can be adapted into `DiagnosticNormalizedEnvelope`
  instances that pass `validateDiagnosticNamespaceEnvelopes`.
- `liveLLMCalled: false`, `persistenceUsed: false`, `userVisibleOutputAllowed: false`,
  and `neverUserVisible: true` hold on the result type at compile time and remain
  `true` at runtime in all scenarios.

---

## 5. What it does not prove

- That a live LLM will produce safe output (no live LLM is called).
- That the draft text is correct English (no semantic evaluation is performed).
- That real OCR data has been processed (no OCR is involved).
- That the output is ready for user-visible assembly (the response assembler is
  Phase 8.2G-6, a future phase).

---

## 6. Audit trace emission behavior

Three `AuditTraceEmissionRecord` instances are created:

| Step                       | Layer               | Kind                    | Severity               | Parent     |
|---------------------------|---------------------|-------------------------|------------------------|------------|
| Mock adapter              | explanation_contract| informational           | informational          | (none/root)|
| Output contract validator | explanation_contract| boundary_emitted / section_suppressed | informational / blocking | adapter |
| Wording governance gate   | wording_evaluation  | informational / human_review_requested / section_suppressed | informational / warning / blocking | output_contract |

- If blocked by output contract: output contract emission uses `section_suppressed` / `blocking` with `referencedDiagnosticCode`.
- If human review required: wording gate emission uses `human_review_requested` / `warning` with `referencedDiagnosticCode`.
- If blocked by wording gate: wording gate emission uses `section_suppressed` / `blocking` with `referencedDiagnosticCode`.
- EmissionIds are deterministic: `dry-run:{dryRunId}:{step}` — no `Date`, no randomness.

Every emission carries `neverUserVisible: true`.

---

## 7. Diagnostic envelope behavior

Diagnostic envelopes are built from four sources:

| Source                         | DiagnosticEnvelopeSourceKind      | DiagnosticNamespaceLayer    | Phase  |
|-------------------------------|-----------------------------------|-----------------------------|--------|
| Draft adapter diagnostics      | `unknown`                         | unknown                     | 8.2G-1 |
| Output contract violations     | `native_contract_validation`      | contract_validation         | 8.2G-2 |
| Wording gate diagnostics       | `native_wording_evaluation`       | wording_evaluation          | 8.2G-3 |
| Runtime dry-run diagnostics    | `native_governance_lineage_audit` | governance_lineage_audit    | 8.2G-4 |

- Draft adapter diagnostics map to `unknown` because Phase 8.2G-1 has no dedicated
  `DiagnosticEnvelopeSourceKind`. This is a conservative mapping per the 8.2F-15O
  adapter contract and is documented in the envelope notes.
- Codes are deduplicated per source before wrapping to prevent duplicate envelope keys.

---

## 8. Verdict mapping

| Condition                                                    | Verdict                                  |
|-------------------------------------------------------------|------------------------------------------|
| Output contract not accepted                                | `blocked_by_output_contract`             |
| Wording gate: `human_review_required`                       | `completed_with_human_review_required`   |
| Wording gate: not accepted and not human review             | `blocked_by_wording_gate`                |
| All gates pass                                              | `completed_successfully`                 |
| Any audit trace emission invalid / chain invalid            | `failed_audit_trace_validation`          |
| Diagnostic envelope namespace validation failed             | `failed_diagnostic_envelope_validation`  |

`failed_audit_trace_validation` and `failed_diagnostic_envelope_validation` override
the base verdict if encountered after initial gate evaluation.

---

## 9. Human review handling

When `wordingGateResult.verdict === "human_review_required"`:
- Final verdict is `completed_with_human_review_required`.
- The wording gate audit trace emission uses `human_review_requested` kind with
  `warning` severity and `referencedDiagnosticCode = "wording_gate_human_review_required"`.
- Diagnostic code `runtime_dry_run_human_review_required` is included.
- `auditTraceValid` remains true — human review does not invalidate the trace chain.
- `diagnosticEnvelopeValid` remains true — envelopes are built for all cases.

---

## 10. Blocking behavior

When the output contract validator rejects:
- Verdict is `blocked_by_output_contract`.
- Output contract emission uses `section_suppressed` / `blocking` with the first
  violation code as `referencedDiagnosticCode`.
- Wording gate still ran (the gate checks the upstream result itself) and its
  result is preserved in `wordingGateResult`, but an informational audit emission
  is used (the wording gate was not the blocking actor).

When the wording gate rejects (hard fail, missing/invalid score report):
- Verdict is `blocked_by_wording_gate`.
- Wording gate emission uses `section_suppressed` / `blocking` with the first
  relevant wording gate diagnostic code as `referencedDiagnosticCode`.

---

## 11. Persistence remains forbidden

`persistenceUsed: false` is a literal type in `RuntimeGovernanceDryRunResult`.

No database writes, no file writes, no log writes, and no telemetry calls are made
anywhere in the dry-run pipeline. Future phases that require persistence must introduce
their own persistence layer and must not modify this file.

---

## 12. Live LLM remains forbidden

`liveLLMCalled: false` is a literal type in `RuntimeGovernanceDryRunResult`.

The 8.2G-1 mock adapter is the only adapter used. The `future_live_llm` mode is
blocked by the mock adapter itself. No LLM SDK is imported. No API key is accessed.
No environment variable is read. Phase 8.2G-5 (first live LLM sandboxed corpus call)
is the planned future phase for controlled live LLM access.

---

## 13. User-visible output remains forbidden

`userVisibleOutputAllowed: false` is a literal type in `RuntimeGovernanceDryRunResult`.

All `draftText` fields in `RuntimeLLMDraftSectionCandidate` carry the prefix
`[MOCK_DRAFT_NEVER_USER_VISIBLE]` and must never reach the UI layer. All result
types carry `neverUserVisible: true`. The response assembler (Phase 8.2G-6) is
the only component permitted to produce user-facing output, and it requires the
full pipeline to have completed with `completed_successfully` verdict.

---

## 14. Regression cases (10 cases)

| Case | Name                                                             | Expected Verdict                          |
|------|------------------------------------------------------------------|-------------------------------------------|
| 1    | Successful safe dry run                                          | `completed_successfully`                  |
| 2    | Human review dry run                                             | `completed_with_human_review_required`    |
| 3    | Wording hard fail dry run                                        | `blocked_by_wording_gate`                 |
| 4    | Output contract blocked (unsafe fixture)                         | `blocked_by_output_contract`              |
| 5    | Missing score report                                             | `blocked_by_wording_gate`                 |
| 6    | Audit trace chain shape (≥3 nodes, root has no parent)          | `completed_successfully`                  |
| 7    | Diagnostic envelopes include output contract violations          | `blocked_by_output_contract` + envelopes  |
| 8    | Diagnostic envelopes include wording gate diagnostic (human rev) | `completed_with_human_review_required`    |
| 9    | Never-user-visible invariant on all structures                   | `completed_successfully`                  |
| 10   | No live LLM / no persistence confirmed                           | `completed_successfully`                  |

---

## 15. Next phase: 8.2G-5 First Live LLM Sandboxed Corpus Call

Phase 8.2G-5 will introduce the first controlled live LLM call against a sandboxed
governance corpus. It will consume the infrastructure proven by 8.2G-4:
- Same `AuditTraceEmissionRecord` emission pattern.
- Same `DiagnosticNormalizedEnvelope` normalization.
- `RuntimeLLMAdapterMode = "future_live_llm"` unblocked only under strict sandboxed conditions.
- A new LLM corpus fixture (see `lib/vaylo/smart-talk/reality-matrix/controlled-corpus/scenarios.ts`)
  is the planned entry point.

Phase 8.2G-4 dry-run infrastructure remains unchanged when 8.2G-5 is introduced.

> **Phase 8.2G-5 pointer:** Phase 8.2G-5 introduces sandboxed live LLM draft generation
> via `runRuntimeLiveLLMSandboxAdapter`. Non-live results (mock_fallback / unavailable) can
> be converted through `convertLiveSandboxResultToDraftAdapterResult` and then routed through
> the 8.2G-4 dry-run. Live-called results require Phase 8.2G-5A type extensions before they
> can enter the full dry-run pipeline. The 8.2G-4 mock adapter path is not replaced.

> **Phase 8.2G-6 pointer:** Phase 8.2G-6 (Response Assembler Bridge) consumes the
> `auditTraceValid` and `diagnosticEnvelopeValid` booleans that Phase 8.2G-4 produces.
> Only when both are `true` (alongside accepted output contract and wording gate verdicts)
> does the assembler bridge produce an `assembled_internal_candidate`. The dry-run
> infrastructure itself is not modified by Phase 8.2G-6.
