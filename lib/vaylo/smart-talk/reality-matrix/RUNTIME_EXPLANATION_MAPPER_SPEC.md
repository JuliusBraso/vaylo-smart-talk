# Runtime Explanation Mapper Spec (Phase 8.2F-1)

## Status

Specification only. No runtime implementation.

This phase defines the future boundary for converting:

- `RealitySimulationResult`
- `SimulationExplanationContract`

into safe, structured explanation drafts. It does not create a mapper function, explanation builder, Smart Talk bridge, OCR parser, LLM prompt, deadline calculator, legal inference layer, or user-visible copy.

## 1. Purpose

The Runtime Explanation Mapper is the future layer that will transform structured governance inputs into structured explanation sections.

It may use:

- simulation candidates
- explanation boundaries
- forbidden moves
- required constraints
- uncertainty requirements
- access tier
- audit references
- review flags
- trap warnings
- severity posture candidates

It must not decide legal truth. It must not calculate deadlines. It must not override governance. It must not bypass payment tier restrictions. It must not convert dry-run candidates into facts.

The mapper is a constrained translator from governance product to draft section structure. It is not a cognition engine.

## 2. Inputs

The future mapper may read only:

- `RealitySimulationResult`
- `SimulationExplanationContract`
- `ExplanationBoundary` ids
- `forbiddenExplanationMoves`
- `requiredExplanationConstraints`
- `uncertaintyRequirements`
- `accessTier`
- `auditTraceRef`
- `reviewFlags`
- `trapWarnings`
- `severityPostureCandidate`
- `paidExplanationFields` only when `accessTier === "paid_explanation"`
- `freePreviewFields` only when `accessTier === "free_preview"` or as the safe base fields present on both contract variants

The future mapper must not read:

- raw document text
- OCR spans directly
- OpenAI/Gemini responses directly
- user profile DNA
- unrelated previous documents
- payment state except pre-validated `accessTier`
- raw Evidence Gate internals unless they are explicitly included in the contract
- hidden trace fields not surfaced by `RealitySimulationResult` or `SimulationExplanationContract`

### Input Boundary Rule

If a value is not present in `RealitySimulationResult` or `SimulationExplanationContract`, the mapper must treat it as unavailable. It must not recover the value from raw text, OCR, user history, payment records, prompts, or prior documents.

## 3. Outputs

The conceptual future output is `RuntimeExplanationDraft`.

This is still a draft structure, not final UI copy.

Conceptual fields:

- `draftVersion`
- `accessTier`
- `sectionDrafts`
- `appliedBoundaries`
- `appliedForbiddenMoves`
- `appliedRequiredConstraints`
- `uncertaintyPosture`
- `reviewPosture`
- `auditRefs`
- `neverUserVisibleDiagnostics`

Conceptual section types:

- `document_overview`
- `what_this_means`
- `attention_points`
- `next_steps_safe`
- `uncertainty_and_limits`
- `review_recommendation`
- `payment_preview_limited`
- `paid_deep_explanation`

The draft must remain structured and auditable. It must not contain final user-facing prose in this phase.

## 4. Free Preview Mapping

Free preview is a teaser tier only.

Free preview may output only:

- document type candidate
- document type label if safe
- sender category if safe
- financial signal presence
- deadline signal presence
- bounded attention preview
- human review suggested
- confidence posture

Free preview must not output:

- amounts
- exact dates
- calculated or inferred deadlines
- legal conclusions
- action steps
- enforcement claims
- immigration certainty
- tax certainty
- extracted personal data
- full explanation
- raw document snippets
- trap names as user-visible events
- dry-run candidates as facts

Free preview must not become a loophole for monetization bypass. A short user question containing dense pasted document fragments is still not authorization to emit full analysis in the preview tier.

## 5. Paid Explanation Mapping

Paid explanation may output deeper structured sections, but paid does not mean unrestricted.

Paid explanation may use `paidExplanationFields` when `accessTier === "paid_explanation"`.

Paid explanation may include deeper structured references to:

- explicit financial signals
- explicit deadline mentions
- institution signals
- authorized claim candidates
- supported reality candidates
- uncertainty reasons
- boundary ids
- review flags
- trap warning ids

Paid explanation must still obey:

- no deadline calculation
- no legal verdicts
- no guaranteed outcomes
- no autonomous official action
- no enforcement certainty unless explicitly authorized by a future production policy
- no unsupported tax certainty
- no unsupported immigration certainty
- no dry-run-as-fact
- no speculation-as-fact
- no raw document extraction unless a future contract explicitly allows a safe field

Paid explanation must be more useful than free preview, but still bounded by governance.

## 6. Boundary Enforcement Policy

The future mapper must treat boundaries as structural constraints, not as style hints.

| Boundary | Required mapper behavior |
|---|---|
| `do_not_calculate_deadline` | Must not output a calculated deadline, final calendar date, or inferred expiry date. |
| `do_not_claim_enforcement` | Must not claim enforcement is active. |
| `require_uncertainty_wording` | Must mark the draft as uncertainty-preserving and require uncertainty-safe sections. |
| `do_not_present_dry_run_as_fact` | Must not phrase candidate states, dry-run authorizations, or simulation candidates as established facts. |
| `do_not_present_speculation_as_fact` | Must distinguish possible, uncertain, blocked, and confirmed states. |
| `do_not_merge_lanes` | Must keep payment, appeal, enforcement, submission, appointment, and informational lanes separate. |
| `do_not_merge_payment_and_appeal` | Must not use payment dates as appeal dates or appeal windows as payment extensions. |
| `do_not_claim_finality` | Must not claim a matter is final, unappealable, or legally settled. |
| `use_relative_deadline_wording_only` | Must preserve relative deadline posture and avoid calendar synthesis. |
| `mention_uncertainty_if_ocr_noisy` | Must preserve OCR/noise uncertainty where contractually surfaced. |
| `recommend_human_review_high_risk` | Must carry review posture; must not convert review flags into certainty. |

Boundary conflicts must resolve conservatively. If a section cannot satisfy all applicable boundaries, the mapper must omit or downgrade that section and record a never-user-visible diagnostic.

## 7. Forbidden Moves

The future mapper must structurally prevent:

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

Forbidden moves are hard output constraints. If a proposed section would require violating a forbidden move, that section is not eligible for user-visible generation.

## 8. Required Constraints

The future mapper must structurally respect:

- `required_uncertainty_wording`
- `must_preserve_uncertainty`
- `must_use_source_bound_language`
- `must_distinguish_possible_vs_confirmed`
- `must_recommend_human_review_when_flagged`
- `must_not_hide_high_consequence_uncertainty`

Required constraints are positive obligations. They require the draft to preserve uncertainty, source boundaries, and review posture where applicable.

## 9. Tone Policy

The future mapper must enforce a tone that is:

- calm
- competent
- non-panic
- non-authoritative
- useful, not silent
- careful but not useless
- uncertainty-preserving
- source-bound

Safe does not mean mute.

The mapper should avoid panic amplification and false reassurance at the same time. If a document has high-consequence uncertainty, the draft should preserve the uncertainty and recommend review without inventing catastrophe or safety.

## 10. Access Tier Policy

### `free_preview`

Free preview is teaser-only. It may expose safe metadata and attention posture, but not substantive analysis, exact values, legal interpretation, action steps, or sensitive extracted content.

### `paid_explanation`

Paid explanation may expose deeper structured explanation sections, but remains bounded by:

- explanation boundaries
- forbidden moves
- required constraints
- uncertainty requirements
- review flags
- safe field availability in `paidExplanationFields`

No payment implementation is defined here. The mapper receives only a pre-validated `accessTier`.

## 11. Failure Modes

The future mapper must be tested against:

- boundary ignored
- paid/free leakage
- false reassurance
- panic amplification
- dry-run leakage
- hallucinated deadline
- unsupported enforcement claim
- legal verdict drift
- cross-lane merge
- monetization bypass
- over-cautious useless output
- raw text leakage
- unsupported tax certainty
- unsupported immigration certainty
- review flag converted to fact

Over-cautious useless output is a real failure mode. The mapper must be safe, but it should still provide bounded orientation when the contract permits it.

## 12. Future Implementation Phases

Recommended sequence:

1. **8.2F-2 Explanation Mapper Types + Skeleton** - add compile-time types and a no-output skeleton with diagnostics only.
2. **8.2F-3 Free Preview Mapper Scaffold** - map only safe preview fields and enforce no paid leakage.
3. **8.2F-4 Paid Explanation Mapper Scaffold** - map paid structured sections while preserving all boundaries.
4. **8.2F-5 Explanation Output Regression Corpus** - add expected draft-shape tests for free and paid tiers.
5. **8.2F-6 Smart Talk Bridge Dry Run** - compare draft structures to candidate Smart Talk bridge behavior without production wiring.
6. **8.2F-7 Trusted User Pilot Gate** - define launch criteria, monitoring, disclaimers, and rollback boundaries.

No phase should connect user-visible Smart Talk output until draft-shape regression passes and public-MVP blockers from `MVP_SAFETY_READINESS_AUDIT.md` are addressed.

## 13. Non-Goals

This spec does not define:

- a legal advice engine
- final legal truth
- deadline calculation
- amount calculation
- automatic form submission
- autonomous authority communication
- Smart Talk production wiring
- LLM prompt implementation
- OCR parsing
- raw document extraction
- payment verification
- UI rendering
- final user-facing copy

## 14. Type Sketches

Phase 8.2F-1 includes optional type sketches in:

`reality-simulation/explanation-mapper-types.ts`

These are interfaces and type aliases only. They intentionally define no mapper function and no explanation generation behavior.

## 15. Readiness Gate

The future mapper must not be implemented as prompt drift. It must be implemented as an auditable governance bridge:

1. read only approved structured inputs
2. apply access-tier limits
3. apply boundaries
4. apply forbidden moves
5. apply required constraints
6. produce section drafts, not raw final prose
7. carry diagnostics that are never user-visible
8. prove behavior against corpus and adversarial tests

Until this exists, user-visible cognition remains blocked for public MVP.
