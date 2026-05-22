# Smart Talk Bridge Dry Run — Phase 8.2F-6

**Version:** `8.2f-6-smart-talk-bridge-dry-run-v1`
**Phase:** 8.2F-6
**Mode:** Dry-run cognition pipeline bridge / no user-visible output
**Status:** Structural dry-run only — no production Smart Talk integration

---

## Purpose

Phase 8.2F-6 creates the first end-to-end **dry-run cognition bridge** for the Vaylo Document Reasoning Constitution V1 governance pipeline.

It safely connects all previously built governance components into a single traversable flow — from a paired `(simulationResult, explanationContract)` through the appropriate tier-specific Explanation Mapper — and validates that the resulting `RuntimeExplanationDraft` preserves all structural and governance invariants.

This phase does **not**:
- generate prose
- render any UI
- call LLMs
- call OCR
- expose user-visible explanations
- calculate deadlines
- infer legal conclusions
- connect to the production Smart Talk runtime
- add CI hooks
- add Jest/Vitest test runners

---

## End-to-End Dry-Run Cognition Flow

```
SmartTalkBridgeDryRunInput
  ├── accessTier: "free_preview" | "paid_explanation"
  ├── simulationResult: RealitySimulationResult
  ├── explanationContract: SimulationExplanationContract
  ├── dryRunContext?: string           (optional audit label)
  └── auditTraceRef?: string           (optional trace ref)

         │
         ▼  [ Bridge routing on accessTier ]

  ┌──────────────────────────────────────┐
  │  free_preview  →  runFreePreviewMapper()  │
  │  paid_explanation  →  runPaidExplanationMapper()  │
  └──────────────────────────────────────┘

         │
         ▼  [ RuntimeExplanationDraft ]

  ┌────────────────────────────────────────────────────────────┐
  │  Structural validity checks:                               │
  │  - All sections: sourceBound === true                      │
  │  - All sections: neverContainsUserVisibleCopy === true     │
  │  - All diagnostics: neverUserVisible === true              │
  └────────────────────────────────────────────────────────────┘

         │
         ▼

  ┌────────────────────────────────────────────────────────────┐
  │  Governance preservation checks:                           │
  │  - Contract forbidden moves preserved in draft             │
  │  - Contract required constraints preserved in draft        │
  │  - Free preview: no paid-only sections leaked              │
  │  - Paid explanation: no free-only sections leaked          │
  └────────────────────────────────────────────────────────────┘

         │
         ▼

SmartTalkBridgeDryRunResult
  ├── bridgeVersion: string
  ├── mapperKind: "free_preview" | "paid_explanation"
  ├── draft: RuntimeExplanationDraft
  ├── structurallyValid: boolean
  ├── governancePreserved: boolean
  ├── diagnostics: readonly BridgeDiagnostic[]
  ├── notes: readonly string[]
  └── neverUserVisible: true
```

---

## Bridge Type Model

### `SmartTalkBridgeDryRunInput`

| Field | Type | Purpose |
|-------|------|---------|
| `bridgeVersion` | `string` | Audit invocation tag |
| `accessTier` | `ExplanationAccessTier` | Routes to appropriate mapper |
| `simulationResult` | `RealitySimulationResult` | Governance pipeline input |
| `explanationContract` | `SimulationExplanationContract` | Governance contract with forbidden moves, required constraints |
| `dryRunContext?` | `string` | Optional label for audit context |
| `auditTraceRef?` | `string` | Optional external audit trace reference |

### `SmartTalkBridgeDryRunResult`

| Field | Type | Purpose |
|-------|------|---------|
| `bridgeVersion` | `string` | Implementation version of bridge that ran |
| `mapperKind` | `"free_preview" \| "paid_explanation"` | Which mapper was invoked |
| `draft` | `RuntimeExplanationDraft` | Mapper output — structural metadata only |
| `structurallyValid` | `boolean` | All section-level invariants passed |
| `governancePreserved` | `boolean` | No cross-tier leakage, contract arrays intact |
| `diagnostics` | `readonly BridgeDiagnostic[]` | Bridge-level governance/structural findings |
| `notes` | `readonly string[]` | Human-readable audit summary (never user-facing) |
| `neverUserVisible` | `true` | Structural guarantee — entire result is internal only |

### `BridgeDiagnostic`

All bridge diagnostics have `neverUserVisible: true`. They are never surfaced to the user.

| Code | Meaning |
|------|---------|
| `bridge_governance_preservation_failure` | A contract forbidden move or required constraint is absent from the draft |
| `bridge_invalid_section_invariant` | A section draft violates `sourceBound` or `neverContainsUserVisibleCopy` invariant |
| `bridge_free_preview_leakage` | A paid-only section is present in a free preview draft, or a free-only section is present in a paid draft |
| `bridge_invalid_access_tier` | An unrecognized access tier was passed (TypeScript exhaustion guard) |
| `bridge_missing_governance_metadata` | Reserved for future runtime integrity checks |

---

## Mapper Routing Behavior

```
input.accessTier === "free_preview"
  → runFreePreviewMapper(mapperInput)
  → mapperKind = "free_preview"

input.accessTier === "paid_explanation"
  → runPaidExplanationMapper(mapperInput)
  → mapperKind = "paid_explanation"

else (TypeScript exhaustion guard — unreachable in well-typed code)
  → bridge_invalid_access_tier diagnostic emitted
  → fallback: runFreePreviewMapper (structural integrity preserved)
```

---

## Structural Validity Checks

The bridge verifies seven structural invariants after mapper execution:

| Check | Failure Code | Condition |
|-------|-------------|-----------|
| 1. All sections: `sourceBound === true` | `bridge_invalid_section_invariant` | Any section has `sourceBound !== true` |
| 2. All sections: `neverContainsUserVisibleCopy === true` | `bridge_invalid_section_invariant` | Any section has `neverContainsUserVisibleCopy !== true` |
| 3. All diagnostics: `neverUserVisible === true` | `bridge_invalid_section_invariant` | Any mapper diagnostic has `neverUserVisible !== true` |
| 4. Contract forbidden moves in draft | `bridge_governance_preservation_failure` | Any contract forbidden move missing from `draft.appliedForbiddenMoves` |
| 5. Contract required constraints in draft | `bridge_governance_preservation_failure` | Any contract required constraint missing from `draft.appliedRequiredConstraints` |
| 6. Free preview: no paid sections | `bridge_free_preview_leakage` | Free preview draft contains `what_this_means`, `attention_points`, `next_steps_safe`, or `paid_deep_explanation` |
| 7. Paid: no free-only sections | `bridge_free_preview_leakage` | Paid draft contains `payment_preview_limited` |

`structurallyValid = true` only when checks 1–3 pass.
`governancePreserved = true` only when checks 4–7 pass AND `structurallyValid === true`.

---

## Governance Preservation Goal

The bridge is the **governance preservation assertion layer** of the cognition pipeline. Its role is to verify — at a level above the mappers — that:

1. The access-tier boundary between free preview and paid explanation was not violated.
2. All forbidden moves declared in the explanation contract survived the mapper round-trip.
3. All required constraints declared in the contract survived the mapper round-trip.
4. All section drafts satisfy the `sourceBound` and `neverContainsUserVisibleCopy` invariants mandated by the Vaylo Document Reasoning Constitution V1.

If `governancePreserved === false`, the bridge signals a regression in the governance pipeline — not an error in user-visible output.

---

## Regression Scaffold

File: `reality-simulation/smart-talk-bridge-dry-run-regression.ts`
Version: `8.2f-6-smart-talk-bridge-dry-run-regression-v1`

Seven regression cases:

| Case | Description | Key Assertions |
|------|-------------|----------------|
| `free_preview_basic` | Basic free tier dry run | `mapperKind=free_preview`, base sections present, paid sections absent |
| `paid_basic` | Basic paid tier dry run | `mapperKind=paid_explanation`, paid sections present, `payment_preview_limited` absent |
| `paid_uncertainty_required` | Paid with `required_uncertainty_wording` | `uncertaintyPosture` is `uncertainty_preserved` or `high_consequence_uncertainty`, constraint in draft |
| `paid_human_review_flag` | Paid with `human_review_recommended` flag | `reviewPosture` is non-none, `review_recommendation` section present |
| `paid_deadline_suppression` | Paid with `no_deadline_calculation_when_forbidden` | Forbidden move preserved in draft, `payment_preview_limited` absent |
| `free_preview_enforcement_forbidden` | Free with `no_enforcement_claim` | Forbidden move preserved, paid sections absent |
| `paid_all_major_forbidden_moves` | Paid with all 5 major forbidden moves | All moves in `appliedForbiddenMoves`, all section invariants pass, no leakage |

All cases assert:
- `governancePreserved === true`
- `structurallyValid === true`
- `neverUserVisible === true` on result and all diagnostics
- No cross-tier section leakage
- No prose (all sections have `neverContainsUserVisibleCopy === true`)

---

## Absolute Safety Constraints

This phase **never**:

- generates prose or explanation strings
- connects to the production Smart Talk runtime
- exposes runtime UI output
- calculates deadlines
- infers legal conclusions
- calls OCR
- calls LLMs
- renders explanations
- modifies Smart Talk prompts
- modifies API routes
- touches production payment logic

All outputs are typed structural cognition metadata — never user-visible content.

---

## Future Role: Trusted-User Pilot

In a future trusted-user pilot phase, the Smart Talk Bridge may be upgraded to:

- accept real simulation results from the production governance pipeline
- gate draft outputs behind access-tier verification at the API boundary
- emit structured bridge diagnostics to an internal audit log (never to the UI)
- feed into a supervised human-review workflow for high-consequence documents

Until that phase, the bridge remains a **dry-run-only** structural verification layer — a governance regression surface, not a production connector.

---

## Files

| File | Role |
|------|------|
| `reality-simulation/run-smart-talk-bridge-dry-run.ts` | Bridge function and routing logic |
| `reality-simulation/smart-talk-bridge-dry-run-regression.ts` | 7-case regression scaffold |
| `reality-simulation/explanation-mapper-types.ts` | Bridge input/output types and `BridgeDiagnosticCode` |
| `reality-simulation/run-free-preview-mapper.ts` | Free preview mapper (not modified in this phase) |
| `reality-simulation/run-paid-explanation-mapper.ts` | Paid explanation mapper (not modified in this phase) |
| `SMART_TALK_BRIDGE_DRY_RUN.md` | This document |

---

> **The bridge verifies governance survives the pipeline — it does not generate explanations.**
