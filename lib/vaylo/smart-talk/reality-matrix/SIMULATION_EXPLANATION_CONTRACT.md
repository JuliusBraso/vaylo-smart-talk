# Simulation -> Explanation Contract v1

## Phase 8.2D-6 — Contract / Type Specification Only

**Status:** Type specification and documentation only.  
**Runtime behavior:** Unchanged.  
**Canonical types:** `reality-simulation/explanation-contract-types.ts`

This phase defines the first strict contract between `RealitySimulationResult` and a future
Explanation Layer. It does not generate explanations, connect to Smart Talk, implement payment,
calculate deadlines, or expose user-visible text.

---

## 1. Purpose

`SimulationExplanationContract` is a typed handoff boundary. It defines which structured governance
signals may be passed forward for:

- safe free preview
- paid deep explanation

The contract is intentionally narrow. It carries identifiers, booleans, and bounded structured
signals. It does not carry final prose, legal advice, calculated dates, or unrestricted extraction.

---

## 2. Access Tiers

```typescript
type ExplanationAccessTier = "free_preview" | "paid_explanation";
```

There is no payment validation logic here. The tier is a type-level separation only.

| Tier | Meaning |
|------|---------|
| `free_preview` | Safe teaser metadata only. Cannot include `paidExplanationFields`. |
| `paid_explanation` | May include deeper structured fields, but still under governance constraints. |

The discriminated union prevents a free-preview contract from carrying paid fields:

```typescript
type SimulationExplanationContract =
  | FreePreviewSimulationExplanationContract
  | PaidSimulationExplanationContract;
```

---

## 3. Top-Level Contract

`SimulationExplanationContract` contains:

- `contractVersion`
- `sourceSimulationVersion?`
- `accessTier`
- `freePreviewFields`
- `paidExplanationFields?` (only for `paid_explanation`)
- `forbiddenExplanationMoves`
- `requiredExplanationConstraints`
- `uncertaintyRequirements`
- `auditTraceRef?`

This is a data contract only. No builder function is introduced in this phase.

---

## 4. Free Preview Fields

`FreePreviewFields` may include only safe metadata:

- `documentTypeCandidate?`
- `documentTypeLabel?`
- `senderCategory?`
- `hasFinancialSignal: boolean`
- `hasDeadlineSignal: boolean`
- `attentionLevelPreview: "low" | "needs_review" | "unknown"`
- `humanReviewSuggested: boolean`
- `confidencePosture: "unknown" | "limited" | "moderate"`

### Free Preview Must Not Include

- exact financial amounts
- exact dates or deadlines
- calculated deadlines
- legal conclusions
- action steps
- trap/risk trigger names
- immigration, tax, benefits, or insurance certainty
- extracted personal data
- raw document text
- OCR spans
- final user-facing explanations

Free preview exists only as a safe teaser: what kind of document this may be, whether money or
deadline signals exist, and whether review may be suggested.

---

## 5. Paid Explanation Fields

`PaidExplanationFields` may include deeper structured data, but still bounded:

- `explicitFinancialSignalsOnly`
- `explicitDeadlineMentionsOnly`
- `institutionSignals`
- `authorizedClaimCandidates`
- `supportedRealityCandidates`
- `uncertaintyReasons`
- `boundaryIds`
- `reviewFlags`
- `trapWarningIds`

### Paid Explanation Restrictions

Paid explanation still must not include:

- calculated deadlines
- legal certainty
- guaranteed outcomes
- autonomous action instructions
- unrestricted extraction
- raw document text
- generated explanation prose from this contract layer

### Deadline Policy

The contract does not allow calculated deadlines. It uses:

- `deadlineMentioned`
- `explicitDeadlineTextPresent`
- `relativeDeadlinePhrasePresent`
- `deadlineCalculationForbidden`
- `calculatedDeadline?: never`

If `do_not_calculate_deadline` is present in `RealitySimulationResult.explanationBoundaries`, a future
mapper must include `no_deadline_calculation_when_forbidden` in `forbiddenExplanationMoves`.

### Amount Policy

Amounts are represented only as explicit signals:

- `explicitAmountSignalsOnly: true`
- `computedAmountForbidden: true`
- `sourceBound: true`

No computed totals, inferred balances, currency normalization, or payment advice may be introduced
without a future explicit policy phase.

---

## 6. Forbidden Explanation Moves

The contract defines structural prohibitions:

- `no_definitive_legal_verdicts`
- `no_deadline_calculation_when_forbidden`
- `no_enforcement_claim_when_forbidden`
- `no_high_panic_phrasing`
- `no_dry_run_as_fact`
- `no_speculation_as_fact`
- `no_cross_lane_merging`
- `no_tax_certainty`
- `no_immigration_certainty`
- `no_guaranteed_outcomes`
- `no_autonomous_form_submission`

These are machine constraints, not user-facing text.

---

## 7. Boundary Mapping Policy

This phase documents the mapping policy only. It does not implement a mapper.

| `RealitySimulationResult.explanationBoundaries` contains | Contract implication |
|----------------------------------------------------------|----------------------|
| `do_not_calculate_deadline` | Include `no_deadline_calculation_when_forbidden` |
| `do_not_claim_enforcement` | Include `no_enforcement_claim_when_forbidden` |
| `require_uncertainty_wording` | Include `required_uncertainty_wording` |
| `do_not_present_dry_run_as_fact` | Include `no_dry_run_as_fact` |
| `do_not_present_speculation_as_fact` | Include `no_speculation_as_fact` |
| `do_not_merge_lanes` | Include `no_cross_lane_merging` |

The future Explanation Layer must treat boundary ids as constraints, never as text to render.

---

## 8. Required Explanation Constraints

The contract defines required constraints:

- `must_preserve_uncertainty`
- `must_use_source_bound_language`
- `must_distinguish_possible_vs_confirmed`
- `must_recommend_human_review_when_flagged`
- `must_not_hide_high_consequence_uncertainty`
- `required_uncertainty_wording`

These constraints apply to both free and paid tiers. Paid access does not relax them.

---

## 9. Uncertainty Requirements

The future Explanation Layer must preserve:

- `preserve_simulation_uncertainty_reasons`
- `surface_unknown_or_limited_confidence`
- `do_not_convert_review_flags_to_certainty`
- `do_not_resolve_conflicts_without_source_authority`
- `do_not_treat_trap_warnings_as_confirmed_events`

Trap warnings are governance signals, not confirmed external events.

---

## 10. Monetization Boundary

Free preview may show only:

- what kind of document this may be
- whether money or deadline signals exist
- whether review is suggested
- a bounded attention level
- a bounded confidence posture

Paid explanation may unlock deeper structured explanation, but remains Constitution-bound.

Paid does NOT mean:

- legal certainty
- deadline calculation
- guaranteed answer
- unrestricted extraction
- more panic
- autonomous form submission
- bypassing boundary ids

---

## 11. Non-Goals

This phase explicitly does not introduce:

- explanation engine
- LLM prompt integration
- Smart Talk wiring
- payment enforcement
- Stripe logic
- deadline calculator
- legal advice
- production user-visible output
- OCR/text parsing
- regex execution
- API or UI changes

The contract is a static type and documentation layer only.
