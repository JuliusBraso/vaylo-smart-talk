# Reality Simulation (Phase 8.2D-1)

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

---

> **Reality simulation models safe explanation space, not legal truth.**
