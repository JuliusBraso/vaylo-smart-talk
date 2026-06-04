# Runtime Wording Governance Gate — Phase 8.2G-3

**Epoch**: 8.2G — Runtime LLM Integration  
**Phase**: 8.2G-3  
**Status**: `gate_defined` — liveLLMJudgeCalled: false — realTextSemanticallyEvaluated: false — acceptedForUserVisibleAssembly: false  
**Author**: Vaylo Document Reasoning Constitution V1 Governance Kernel

---

## 1. Purpose

The Runtime Wording Governance Gate is the third gate in the 8.2G LLM integration
pipeline. It sits between the LLM output contract validator (Phase 8.2G-2) and the
audit trace dry-run layer (Phase 8.2G-4).

Position in the 15-layer pipeline:

```
llm_draft_adapter (8.2G-1)
  → llm_output_contract_validator (8.2G-2)
  → wording_evaluation_gate (8.2G-3)  [THIS GATE]
  → audit_trace_emission (8.2G-4)
  → ...
  → user_visible_response_assembler (8.2G-6)
```

Its job: consume only drafts whose Phase 8.2G-2 verdict is `accepted_for_next_gate`,
then evaluate wording safety metadata using the existing `evaluateExplanationWordingFromScoreReport`
scaffold — without calling any live LLM judge, importing any NLP library, or semantically
analyzing any prose text.

---

## 2. Why This Wording Gate Exists Before User-Visible Assembly

User-visible assembly (Phase 8.2G-6) may only receive drafts that have passed:

1. Phase 8.2G-2 — LLM output contract validation (visibility invariants, safety flags)
2. **Phase 8.2G-3 — Wording governance gate** (this gate — tone score evaluation)
3. Phase 8.2G-4 — Audit trace dry run
4. Phase 8.2G-5 — First live LLM sandboxed corpus call (when live LLM is introduced)

Even if Phase 8.2G-2 accepts a draft, the draft must also pass wording tone evaluation
before it can proceed. A draft with `authoritativeLegalAdvice > 0` or `falseReassurance > 0`
must be hard-failed at this gate regardless of what Phase 8.2G-2 decided.

---

## 3. Relationship to Phase 8.2G-2 Output Contract Validator

This gate is downstream of Phase 8.2G-2. If `outputContractValidation.verdict` is not
`accepted_for_next_gate`, this gate returns `rejected_previous_gate_failed` immediately
and does **not** run wording evaluation. The wording score report is not consulted.

This means both gates must agree:
- Phase 8.2G-2 must accept the output contract.
- Phase 8.2G-3 must pass wording tone evaluation.
- Only then is a draft `accepted_for_audit_dry_run`.

---

## 4. Relationship to the Existing Wording Evaluation Scaffold

This gate directly reuses (without modification):

| Function | Source |
|---|---|
| `validateWordingToneScoreReport` | `reality-simulation/run-wording-evaluation-scaffold.ts` |
| `evaluateExplanationWordingFromScoreReport` | `reality-simulation/run-wording-evaluation-scaffold.ts` |
| `WordingToneScoreReport` | `reality-simulation/wording-evaluation-types.ts` |
| `WordingEvaluationDisposition` | `reality-simulation/wording-evaluation-types.ts` |
| `WordingEvaluationResult` | `reality-simulation/wording-evaluation-types.ts` |

The existing evaluation thresholds, rules, and disposition mapping are **unchanged**:
- `authoritativeLegalAdvice > 0` → hard fail
- `falseReassurance > 0` → hard fail
- `manipulative > 0` → hard fail
- `panicInducing > 30` → hard fail
- `confusingAmbiguity > 40` → human review
- `empatheticClarity < 50` → human review
- No violations + `empatheticClarity >= 50` → approved

---

## 5. Why No Live LLM Judge Is Called

The existing wording evaluation scaffold operates on **caller-supplied metadata scores**
(`WordingToneScoreReport`), not on real prose. This is by design: the governance kernel
was built to be evaluable from structured score metadata before any live LLM judge exists.

In Phase 8.2G-3, the gate consumes these metadata scores directly. No LLM judge is
needed and none is called.

A live LLM judge (Phase 8.2G-5) will eventually produce scores automatically from
actual draft text. Until then, scores must be supplied as `WordingToneScoreReport`
fixtures (for testing) or as human-reviewed metadata.

`liveLLMJudgeCalled: false` is a literal type on `RuntimeWordingGateResult` — it
cannot accidentally become `true` in this phase.

---

## 6. Why No Real Prose Is Semantically Evaluated

In Phase 8.2G-3, the gate evaluates the **score metadata** in the `WordingToneScoreReport`,
not the `draftText` content. The gate does not:

- Read or inspect `draftText` beyond what Phase 8.2G-2 already validated.
- Run regex patterns over `draftText` for semantic content.
- Import any NLP library.
- Apply machine learning or string similarity.

`realTextSemanticallyEvaluated: false` is a literal type on `RuntimeWordingGateResult`.

Per-section semantic wording evaluation requires a live LLM judge (Phase 8.2G-5), which
will score each draft section individually against forbidden move and required constraint
rules. Until then, the gate applies a single global score report to all sections.

---

## 7. Score Report Requirements

A `WordingToneScoreReport` must be supplied with:

| Field | Requirement |
|---|---|
| `reportId` | Non-blank string |
| `evaluatorId` | Non-blank string |
| `evaluatorVersion` | Non-blank string |
| `generatedBy` | Non-blank string |
| `toneMatrix` | All 6 values must be finite numbers |
| `attestationStatus` | Any valid value (see §8) |
| `neverUserVisible` | Must be `true` |

If `scoreReport` is `null`, the gate returns `rejected_missing_score_report`.  
If structural validation fails (`!valid || !scoreUsable`), the gate returns `rejected_invalid_score_report`.

---

## 8. Attestation Behavior

| `attestationStatus` | Behavior |
|---|---|
| `test_fixture_attested` | Accepted without provenance note. Evaluation runs normally. |
| `manual_review_attested` | Accepted. Evaluation runs normally. |
| `future_judge_attested` | Accepted. Evaluation runs normally. |
| `unattested` | Accepted with `wording_gate_score_report_unattested` diagnostic. Evaluation runs. Does **not** hard-fail in Phase 8.2G-3. |

An unattested report is acceptable in Phase 8.2G-3 scaffolding. Production requires
a verified attestation status (`manual_review_attested` or `future_judge_attested`).

---

## 9. Verdict Mapping

| Wording Evaluation Disposition | Gate Verdict | `acceptedForAuditDryRun` |
|---|---|---|
| `approved` | `accepted_for_audit_dry_run` | `true` |
| `human_review_required` | `human_review_required` | `false` |
| `hard_fail_tone_violation` | `hard_fail_wording_violation` | `false` |
| (previous gate failed) | `rejected_previous_gate_failed` | `false` |
| (null score report) | `rejected_missing_score_report` | `false` |
| (invalid score report) | `rejected_invalid_score_report` | `false` |

`acceptedForUserVisibleAssembly` is always `false` regardless of verdict.

---

## 10. Human Review Behavior

When `verdict === "human_review_required"`:
- The draft is not hard-failed — it may be resubmitted with an improved score report.
- `acceptedForAuditDryRun: false` — draft does not proceed to Phase 8.2G-4.
- `wording_gate_human_review_required` diagnostic is emitted.
- All section results have `accepted: false`.
- The full `wordingEvaluationResult` is present for inspection.

A human reviewer must inspect the wording score report, address the ambiguity or
clarity issue, and supply a new `WordingToneScoreReport` for re-evaluation.

---

## 11. Hard Fail Behavior

When `verdict === "hard_fail_wording_violation"`:
- The draft must not proceed under any circumstances.
- `acceptedForAuditDryRun: false`.
- `wording_gate_hard_fail_tone_violation` diagnostic is emitted.
- All section results have `accepted: false`.
- `wordingEvaluationResult.violations` lists the specific tone violations.

Hard fail triggers:
- `authoritativeLegalAdvice > 0` — zero tolerance
- `falseReassurance > 0` — zero tolerance
- `manipulative > 0` — zero tolerance
- `panicInducing > 30` — panic guard

---

## 12. User-Visible Output Remains Forbidden

`acceptedForUserVisibleAssembly: false` is a **literal type** on
`RuntimeWordingGateResult`. Even when `verdict === "accepted_for_audit_dry_run"`,
user-visible assembly is not permitted. The draft must also pass:

- Phase 8.2G-4 (audit trace dry run)
- Phase 8.2G-5 (first live LLM sandboxed corpus call — when introduced)
- Phase 8.2G-6 (response assembler authorisation)

---

## 13. Regression Cases

`runRuntimeWordingGovernanceGateRegressionScaffold()` runs 12 cases:

| Case | Description | Expected Verdict |
|---|---|---|
| 1 | Safe approved flow | `accepted_for_audit_dry_run` |
| 2 | Previous contract gate failed | `rejected_previous_gate_failed` |
| 3 | Missing score report (null) | `rejected_missing_score_report` |
| 4 | Invalid score report (NaN) | `rejected_invalid_score_report` |
| 5 | Unattested safe score report | `accepted_for_audit_dry_run` + unattested diagnostic |
| 6 | Human review score report | `human_review_required` |
| 7 | Hard fail — authoritativeLegalAdvice > 0 | `hard_fail_wording_violation` |
| 8 | Hard fail — falseReassurance > 0 | `hard_fail_wording_violation` |
| 9 | Hard fail — panicInducing > 30 | `hard_fail_wording_violation` |
| 10 | Section results preserve neverUserVisible | All sections neverUserVisible: true |
| 11 | User-visible assembly always false | All verdict paths: acceptedForUserVisibleAssembly: false |
| 12 | No live judge — all paths | liveLLMJudgeCalled: false, realTextSemanticallyEvaluated: false |

---

## 14. Next Phase: 8.2G-4 — Audit Trace + Diagnostic Envelope Runtime Dry Run

Phase 8.2G-4 will:
- Consume drafts with `acceptedForAuditDryRun: true` from Phase 8.2G-3.
- Wire `buildAuditTraceNodeFromEmission` (Phase 8.2F-15N) at all emission sites.
- Wire `buildDiagnosticEnvelopeFromNativeDiagnostic` (Phase 8.2F-15O) for all diagnostics.
- Prove that an end-to-end governance chain produces a `valid: true` `AuditTraceChain`.
- No live LLM. No user-visible output.

---

## Files

| File | Purpose |
|---|---|
| `runtime-wording-governance-gate-types.ts` | All types for Phase 8.2G-3 |
| `run-runtime-wording-governance-gate.ts` | `runRuntimeWordingGovernanceGate()` |
| `runtime-wording-governance-gate-regression-scaffold.ts` | 12-case regression scaffold |

---

## Safety Boundary

This phase:
- Does **not** call any live LLM judge.
- Does **not** import any NLP library.
- Does **not** evaluate real prose text semantically.
- Does **not** call any external API or service.
- Does **not** add API keys, env vars, or configuration.
- Does **not** modify the wording evaluation scaffold, mock adapter, or contract validator.
- Does **not** produce user-visible text.

`acceptedForUserVisibleAssembly: false` — always.  
`liveLLMJudgeCalled: false` — always.  
`realTextSemanticallyEvaluated: false` — always.
