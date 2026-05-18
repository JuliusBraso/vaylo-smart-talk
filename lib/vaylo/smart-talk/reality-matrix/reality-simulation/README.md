# Reality Simulation (8.2D-1 skeleton · 8.2D-2 audit)

## What this is

**Reality Simulation** is a **pre-explanation governance layer**: it consumes Evidence Gates **`EvidenceGateDecision.trace`** (including **dry-run** slices and metadata) and returns a **`RealitySimulationResult`** — structured **candidates**, **boundaries**, and **flags** only.

Canonical architecture: **`../REALITY_SIMULATION_SPEC.md`**.

## What this is not

- **Not** user-visible text, Slovak/German copy, or marketing language.  
- **Not** Smart Talk, OpenAI, API routes, or UI wiring.  
- **Not** legal advice, final legal truth, or deadline calculation.  
- **Not** production claim/reality authorization (dry-run rows are **never** promoted here).  
- **Not** OCR, regex on document text, or inspection of `cueHits` / matched text in the **8.2D-1** skeleton (`runRealitySimulation`).

## Entry point

- **`runRealitySimulation({ evidenceGateDecision })`** — pure function; see `run-reality-simulation.ts`.  
- Version stamp: **`REALITY_SIMULATION_SKELETON_VERSION`**.

## Safe input boundary (8.2D-1)

The skeleton reads **only** structured trace fields (and matrix identity on the trace): e.g. `claimDecisions`, `realityDecisions`, `dryRunClaimAuthorizations`, `dryRunRealityAuthorizations`, `dryRunTrapActivations`, `dryRunStabilizerCandidates`, `dryRunSeverityDerivations`, `traceMetadata`, `matrixDocumentType` / `matrixSchemaVersion`, `matrixMismatchFlag`. It does **not** read `input.documentText` and does **not** walk `cueHits` or evidence-rule prose.

## Uncertainty preservation

If dry-run realities are uncertain, traps are ambiguous, metadata suggests speculative paths, or the matrix snapshot mismatches flat fields, the simulation adds **`uncertaintyReasons`**, **`explanationBoundaries`** (e.g. `require_uncertainty_wording`), and **`reviewFlags`** — it does **not** collapse uncertainty into factual certainty.

## Trap / stabilizer / severity

- **Traps** → `trapWarnings`, boundaries, uncertainty — **not** output suppression.  
- **Stabilizers** → `stabilizerNeeds` with **catalog ids / categories** — **not** matrix example wording.  
- **Severity derivations** → `severityPostureCandidate` with **`neverUserVisible: true`** — **not** UI urgency.

## PHASE 8.2D-2 — Simulation Boundary Mapping Audit

**Audit-only phase:** no changes to `run-reality-simulation.ts`, gate resolvers, or simulation types. Documents how boundary tokens, trap/stabilizer/severity influence, review flags, and dry-run leakage risks behave in the **8.2D-1** skeleton.

**Key caveat:** **`enforcementTrapHeuristic`** (`trapKind` substring checks) is **skeleton-only** and **must not** drive production explanation boundaries — replace with **structured trap metadata** before production coupling.

**Canonical audit:** [`../SIMULATION_BOUNDARY_MAPPING_AUDIT.md`](../SIMULATION_BOUNDARY_MAPPING_AUDIT.md).

## PHASE 8.2D-2A — Boundary Vocabulary Consolidation Audit

**Vocabulary audit only — no runtime behavior changed.**

Key findings:
- **`recommend_human_review_for_high_risk`** (spec §7 name) vs **`recommend_human_review_high_risk`** (runtime-emitted): **alias defect** — these are two distinct union members; the spec name is never emitted; the runtime token is not in the spec table. Canonical form going forward: **`recommend_human_review_high_risk`**. The spec-name variant is marked `@deprecated` in the type JSDoc.
- **Four tokens never emitted** by skeleton v1: `do_not_claim_finality`, `use_relative_deadline_wording_only`, `mention_uncertainty_if_ocr_noisy`, `recommend_human_review_for_high_risk` — defined in union / spec; wiring pending.
- **Two tokens emitted but absent from spec §7**: `do_not_present_speculation_as_fact`, `do_not_merge_lanes`.
- Consumers must treat boundary tokens as **machine constraints**, never as user text.

**Canonical audit:** [`../BOUNDARY_VOCABULARY_AUDIT.md`](../BOUNDARY_VOCABULARY_AUDIT.md).

---

> **Reality simulation models safe explanation space, not legal truth.**
