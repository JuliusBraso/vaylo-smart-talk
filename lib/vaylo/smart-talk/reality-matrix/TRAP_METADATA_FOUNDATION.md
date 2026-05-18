# TRAP_METADATA_FOUNDATION.md

## Phase 8.2D-5 — Structured Trap Metadata Foundation

**Status (8.2D-5):** Metadata foundation only — no runtime behavior changed.  
**Status (8.2D-5A):** `enforcementTrapHeuristic` **replaced** — structured metadata now drives simulation boundary mapping.  
**Files:** `reality-simulation/trap-metadata-types.ts`, `reality-simulation/trap-metadata-registry.ts`, `reality-simulation/run-reality-simulation.ts`  
**Relates to:** `SIMULATION_BOUNDARY_MAPPING_AUDIT.md §3.3`, `EVIDENCE_GATES_DRY_RUN_AUDIT.md`

---

## 1. Purpose

This document explains the structured trap metadata layer introduced in Phase 8.2D-5 and the
planned path to replace the coarse `enforcementTrapHeuristic` substring checks in
`run-reality-simulation.ts`.

The `TRAP_METADATA_REGISTRY_V1` is a central, typed, readonly governance table mapping every
registered `HallucinationTrapKind` to explicit governance semantics:

- **governance domains** (enforcement, deadline, payment, appeal, …)
- **risk classes** (over_escalation, deadline_fabrication, legal_conclusion, …)
- **boolean governance flags** (`isEnforcementRelated`, `isEscalationRelated`, `isDeadlineRelated`, `isLaneContaminationRelated`)
- **consumer constraints** (what downstream logic must respect)
- **production readiness** posture

---

## 2. Current Problem — `enforcementTrapHeuristic` is Skeleton-Only

### Current Implementation

```typescript
// run-reality-simulation.ts (skeleton-only — DO NOT PROMOTE TO PRODUCTION)
function enforcementTrapHeuristic(traps: readonly TrapActivation[] | undefined): boolean {
  if (!traps) return false;
  return traps.some(
    (t) =>
      (t.disposition === "candidate_triggered" || t.disposition === "candidate_uncertain") &&
      (t.trapKind.includes("enforcement") ||
        t.trapKind.includes("vollstreckung") ||
        t.trapKind.includes("mahnung") ||
        t.trapKind.includes("escalation")),
  );
}
```

### Why This Is Unsafe for Production

| Problem | Detail |
|---------|--------|
| **Coarse substring matching** | `"mahnung"` matches `mahnung_to_vollstreckung` (correct) but also any future trap kind containing that substring, whether enforcement-related or not. |
| **Silent coverage gaps** | `payment_reminder_to_account_seizure`, `weitere_schritte_to_forced_collection`, `overdue_payment_to_salary_garnishment`, `overdue_payment_to_eviction` are enforcement actions but contain NONE of the four substrings. The heuristic silently misses them. |
| **Semantic conflation** | `generic_escalation_to_legal_disaster` is caught by `"escalation"` but is an **escalation/panic** trap, not an **enforcement** trap. Treating it as enforcement conflates two distinct governance risk classes. |
| **No structural link** | There is no typed connection between `trapKind` strings and `relatedClaimTypes`, enforcement cluster flags, or matrix catalog tags. Policy cannot be validated at compile time. |
| **Naming fragility** | Refactoring or extending `HallucinationTrapKind` values could silently break the policy without any type error or test failure. |

### Traps Currently Caught by Heuristic

| `trapKind` | Substring matched | Is actually enforcement? |
|------------|------------------|--------------------------|
| `invoice_to_enforcement` | `"enforcement"` | ✅ Yes |
| `steuerbescheid_to_enforcement` | `"enforcement"` | ✅ Yes |
| `letzte_mahnung_to_active_enforcement` | `"mahnung"`, `"enforcement"` | ✅ Yes |
| `mahnung_to_vollstreckung` | `"mahnung"`, `"vollstreckung"` | ✅ Yes |
| `mahnung_to_gerichtsvollzieher` | `"mahnung"` | ✅ Yes |
| `generic_escalation_to_legal_disaster` | `"escalation"` | ⚠️ **No — escalation/panic, not enforcement** |

### Traps MISSED by Heuristic (Silent Gaps)

| `trapKind` | Missed because | Is enforcement? |
|------------|---------------|----------------|
| `payment_reminder_to_account_seizure` | No matching substring | ✅ Yes — account seizure is enforcement |
| `weitere_schritte_to_forced_collection` | No matching substring | ✅ Yes — forced collection is enforcement |
| `overdue_payment_to_salary_garnishment` | No matching substring | ✅ Yes — wage garnishment is enforcement |
| `overdue_payment_to_eviction` | No matching substring | ✅ Yes — eviction is enforcement |

---

## 3. Structured Metadata as the Replacement

### Governance Flags in `TrapMetadataDefinition`

Instead of parsing `trapKind` strings, future policy logic should look up the registry:

```typescript
// Future pattern (8.2D-5A+) — NOT implemented yet
import { TRAP_METADATA_REGISTRY_V1 } from "./trap-metadata-registry";

function isEnforcementRelatedTrap(trapKind: string): boolean {
  const meta = TRAP_METADATA_REGISTRY_V1.find((e) => e.trapKind === trapKind);
  return meta?.isEnforcementRelated ?? false;
}
```

This gives:
- **Compile-time safety** — `trapKind` is `HallucinationTrapKind`, not a raw string.
- **Gap closure** — `payment_reminder_to_account_seizure` etc. are now correctly included.
- **Semantic separation** — `generic_escalation_to_legal_disaster` correctly excluded from enforcement.
- **Extensibility** — adding a new trap kind only requires a registry entry; policy logic auto-inherits.

### Which Flags Drive Which Boundaries

| Flag | Boundary implication |
|------|---------------------|
| `isEnforcementRelated: true` | `do_not_claim_enforcement` |
| `isEscalationRelated: true` | `require_uncertainty_wording` |
| `isDeadlineRelated: true` | `do_not_calculate_deadline` |
| `isLaneContaminationRelated: true` | `do_not_merge_lanes` |
| `riskClasses includes "legal_conclusion"` | `do_not_claim_finality` (scoped) |
| `riskClasses includes "panic_amplification"` | `recommend_human_review_high_risk` |

These mappings are **documented here as intent only**. They are NOT yet wired into `runRealitySimulation`.

---

## 4. Future Replacement Phase — 8.2D-5A

When Phase 8.2D-5A is implemented:

1. Replace `enforcementTrapHeuristic(traps)` with a registry lookup over `TrapMetadataDefinition.isEnforcementRelated`.
2. Build separate helpers for escalation, deadline, lane-contamination, and legal-conclusion flags.
3. Pass structured flags into `buildExplanationBoundaries` instead of coarse booleans.
4. Add regression cases verifying that all four previously-missed enforcement traps now trigger `do_not_claim_enforcement`.
5. Verify that `generic_escalation_to_legal_disaster` no longer triggers the enforcement boundary (only the escalation boundary).
6. Keep `run-reality-simulation.ts` output semantically equivalent during migration (no boundary set shrinkage for currently-covered traps).

### Phase 8.2D-5A — Implemented

Phase 8.2D-5A has been completed. `enforcementTrapHeuristic` has been **removed** and replaced
by `buildTrapGovernanceFlags` in `run-reality-simulation.ts`.

#### What changed in 8.2D-5A

**Registry structure (`trap-metadata-registry.ts`):**
- Converted from cluster arrays → `TRAP_METADATA_BY_KIND` record typed with
  `satisfies Record<HallucinationTrapKind, TrapMetadataDefinition>`.
- Compile-time exhaustiveness: missing a `HallucinationTrapKind` entry is now a TypeScript error.
- `TRAP_METADATA_REGISTRY_V1` is derived as `Object.values(TRAP_METADATA_BY_KIND)` for backward-compatible iteration.

**`run-reality-simulation.ts`:**
- `enforcementTrapHeuristic` removed entirely (was: substring checks on `trapKind`).
- `buildTrapGovernanceFlags(traps)` added: looks up each active trap's `trapKind` in
  `TRAP_METADATA_BY_KIND` and ORs the boolean flags across all triggered/uncertain traps.
- `buildExplanationBoundaries` updated to accept `trapFlags: TrapGovernanceFlags` instead of
  `enforcementTrapHeuristic: boolean`.

**Boundary logic changes (simulation-internal only):**

| Boundary | Old trigger | New trigger |
|----------|-------------|-------------|
| `do_not_claim_enforcement` | Any active trap OR heuristic substring match | Only traps with `isEnforcementRelated: true` |
| `do_not_merge_lanes` | Any active trap | Only traps with `isLaneContaminationRelated: true` |
| `require_uncertainty_wording` | `hasUncertainRealities \|\| trapUncertain \|\| speculativeFeature` | Same + traps with `isEscalationRelated: true` |
| `do_not_calculate_deadline` | Unconditional | Unconditional (unchanged) |

**Gap closures (8.2D-5A):** Four enforcement traps previously missed by the substring heuristic
now correctly trigger `do_not_claim_enforcement`:
- `payment_reminder_to_account_seizure`
- `weitere_schritte_to_forced_collection`
- `overdue_payment_to_salary_garnishment`
- `overdue_payment_to_eviction`

**Semantic fix (8.2D-5A):** `generic_escalation_to_legal_disaster` no longer triggers
`do_not_claim_enforcement`. It now (correctly) triggers `require_uncertainty_wording` only,
via `isEscalationRelated: true`.

**Missing metadata handling:** If a `trapKind` string is not in the registry at runtime, a
conservative fallback applies (`isEnforcementRelated=true`, `isEscalationRelated=true`) and an
uncertainty reason `{ code: "unregistered_trap_metadata", detail: trapKind }` is appended to
`RealitySimulationResult.uncertaintyReasons`.

No Smart Talk wiring. No user-visible behavior. No explanation generation. No production
runtime integration.

---

## 5. Consumer Obligations

All consumers of `TRAP_METADATA_REGISTRY_V1` must respect:

| Constraint | Meaning |
|-----------|---------|
| `never_render_directly` | Trap kinds and metadata strings are machine tokens, not user-facing copy. |
| `not_legal_advice` | Trap governance signals are not legal opinions. |
| `not_runtime_suppression` | Trap metadata must not suppress or rewrite output without an explicit production policy phase. |
| `dry_run_not_truth` | All trap activations remain dry-run candidates — not production truth. |
| `requires_structured_policy_before_runtime` | No metadata entry in this registry may drive boundary decisions until promoted through an explicit phase (8.2D-5A+). |
| `requires_human_review_context` | Traps carrying this constraint must always surface a human-review flag when promoted to production. |

---

## 6. Registry Summary

| Cluster | Count | Key governance flag(s) |
|---------|-------|------------------------|
| Enforcement | 9 | `isEnforcementRelated: true` |
| Escalation | 3 | `isEscalationRelated: true` |
| Deadline fabrication | 7 | `isDeadlineRelated: true` |
| Legal conclusion | 2 | `riskClasses: ["legal_conclusion"]` |
| Lane contamination | 2 | `isLaneContaminationRelated: true` |
| Insurance | 2 | `domains: ["insurance"]` |
| Speculative inference | 4 | `riskClasses: ["speculative_inference"]` |
| Style / tone | 1 | `productionReadiness: "dry_run_only"` |
| **Total** | **30** | |

> **Note on count:** `HALLUCINATION_TRAP_KINDS` registers 31 values in `types.ts`. The registry
> covers all 31 — `lane_contamination` appears in two matrix documents but is one trap kind entry.
> The cluster count above sums to 30 unique entries because `lane_contamination` is a single entry
> in the registry, not duplicated per matrix. The registry entry count in `TRAP_METADATA_REGISTRY_V1`
> is 30 (one per unique `HallucinationTrapKind`); `types.ts` has 31 values because
> `overdue_payment_to_salary_garnishment` and `emotional_language_amplification` are the last two
> added in Phase 8.2B-3.

---

## 7. Non-Goals

This phase explicitly does NOT:

- Replace `enforcementTrapHeuristic` at runtime.
- Change any boundary emission or review flag behavior in `runRealitySimulation`.
- Generate explanations or user-visible text.
- Connect to Smart Talk, OCR, APIs, or UI.
- Authorize any claims or realities.
- Add deadline calculation or legal interpretation.
