# Governance Lineage Integration Audit — Phase 8.2F-15 (updated 8.2F-15O)

**Version:** `8.2f-15o-governance-lineage-audit-v16`
**Scope:** Vaylo Document Reasoning Constitution V1 — Phases 8.2A → 8.2F-15O
**Mode:** Audit only / no runtime wiring / no behavior modified
**Overall Status:** `partially_connected`

> **8.2F-15A Update:** Debt 2 (`calculated_amount`) and Debt 3 (`false_reassurance`) have been
> resolved. Both dedicated `ForbiddenExplanationMove` tokens have been added to
> `KNOWN_FORBIDDEN_EXPLANATION_MOVES`. Contract validators, corpus expectations, and
> scenario alignment tables updated. Four new technical debts documented (Debt 7–10).
>
> **8.2F-15B Update:** Debt 1 (`TrapActivation.trapKind` typed as `string`) has been resolved.
> `TrapActivation.trapKind` is now typed as `HallucinationTrapKind` in `evidence-gates-types.ts`.
> The canonical registry (`TRAP_METADATA_BY_KIND`) remains the single source of truth.
> `ENFORCEMENT_CLUSTER_TRAP_KINDS` in `resolve-trap-activations.ts` narrowed from `Set<string>`
> to `Set<HallucinationTrapKind>`. Defensive runtime lookup guard retained in
> `run-reality-simulation.ts`. No trap semantics or simulation behavior changed.
>
> **8.2F-15C Update:** Debts 5 and 6 are partially reduced (see detail below).
>
> **8.2F-15D Update:** Debt 4 (`next_steps_safe` dead restriction-state) is resolved.
>
> **8.2F-15E Update:** Debt 7 (caller-supplied OCR confidence) is **partially resolved**.
> `OcrQualityReport` typed provenance contract introduced. `evaluateOcrUncertaintyFromQualityReport`
> consumes it. `LimitedPilotGateInput.baseOcrConfidenceScore` made optional; `ocrQualityReport`
> added as preferred path. Raw-score path emits `pilot_ocr_confidence_unattested` diagnostic.
> Raw fallback retained for backward compatibility. Full resolution requires real OCR engine binding.
> A post-filter added to `run-paid-explanation-mapper.ts` eliminates restriction bookkeeping
> accumulated for sections that are already excluded by a higher-priority forbidden move.
> The canonical dead state was: when `no_autonomous_form_submission` and
> `no_deadline_calculation_when_forbidden` are both active, the effect loop added
> `next_steps_safe` to both `excludedSectionTypes` and `sectionBlockedReasonCodes`;
> the section assembly's exclusion check fired first, making the restriction entry
> permanently unreachable. No section visibility, `blockedReasonCodes`, diagnostics, or
> mapper output structure changed.
> Free-preview mapper: `free_preview_paid_field_blocked` is now the structural invariant only —
> each forbidden move emits its own specific code. Paid mapper: `paid_legal_verdict_blocked`
> narrowed to `no_definitive_legal_verdicts` only; `paid_autonomous_action_blocked` narrowed to
> `no_autonomous_form_submission` only; `paid_section_excluded_by_forbidden_move` handles generic
> section-exclusion notifications. New moves `no_false_reassurance_framing` and
> `no_calculated_amount_extraction` now have dedicated diagnostic codes in both mappers.
> No section presence/absence behavior changed. No user-visible output.
>
> **8.2F-15F Update:** Debt 8 (caller-supplied pilot telemetry unauthenticated) is **partially resolved**.
> See detail in Debt 8 section below.
>
> **8.2F-15G Update:** Debt 9 (caller-supplied wording tone scores unvalidated) is **partially resolved**.
> See detail in Debt 9 section below.
>
> **8.2F-15H Update:** Debt 10 (`AuditTraceChain.structurallyValid` consistency) is **resolved**.
> `structurallyValid` removed from `AuditTraceChain`. `AuditTraceValidationResult.valid` is now
> the sole authoritative source of structural truth. `validateAuditTraceChain` is unchanged.
> All 8 regression cases pass with identical outcomes.
>
> **8.2F-15I Update:** Debt 6 (bridge-level `BridgeBlockingReason` typed field) is **resolved**.
> See detail in Debt 6 section below.
>
> **8.2F-15J Update:** Debt 5 (cross-phase diagnostic namespace isolation) is **partially resolved**.
> `DiagnosticNormalizedEnvelope` and `DiagnosticNamespaceLayer` established. Source modules retain
> their own typed unions; envelope model is additive audit infrastructure. See Debt 5 section below.
> `BridgeBlockingReason` union type added. `SmartTalkBridgeDryRunResult` gains `blockingReasons:
> readonly BridgeBlockingReason[]`. All 7 bridge checks populate typed reasons in parallel with
> diagnostics. `bridge_contract_tier_mismatch` remains observability-only (no blocking reason).
> All 8 regression cases assert `blockingReasons.length === 0` for healthy invocations.
> `WordingToneScoreReport` typed provenance contract introduced in `wording-evaluation-types.ts`.
> `validateWordingToneScoreReport` added. `evaluateExplanationWordingFromScoreReport` is the new
> preferred provenance-backed evaluation entry point. Raw `WordingEvaluationInput` path retained
> for backward compatibility. Non-finite scores → `human_review_required`; unattested → evaluation
> proceeds with provenance note. No LLM judge wired. Full resolution requires a future verified
> evaluator binding.
> `PilotSessionReport` typed provenance contract introduced in `limited-pilot-gate-types.ts`.
> Carries `reportId`, `sourceKind` (`PilotSessionReportSourceKind`), `attestationStatus`
> (`PilotSessionAttestationStatus`), `totalTransactionsThisSession`, `maxSessionLimit`,
> `sequenceId`, `generatedBy`, and `neverUserVisible: true`.
> `PilotSessionReportValidationResult` added for structural ingress validation.
> `validatePilotSessionReport` added to `run-limited-pilot-gate-scaffold.ts`.
> `LimitedPilotGateInput.telemetry` made optional; `sessionReport` added as preferred path.
> `pilot_session_telemetry_unattested` emitted on raw-telemetry path and on unattested reports.
> `pilot_session_report_invalid` emitted and gate blocked when structural validation fails.
> Raw telemetry fallback retained for backward compatibility.
> 4 new regression cases (Cases 10–13) cover the full provenance-backed session path.
> Remaining gap: `PilotSessionReport` is still caller-constructed metadata; no session store wired.
>
> **8.2F-15K Update:** Debt 7 (OCR confidence attestation store contract) is **upgraded — still
> partially resolved**. `OcrQualityAttestationRecord` defined with 5 enum types
> (`OcrQualityReportIssuerKind`, `OcrQualityReportStoreKind`, `OcrQualityAttestationMethod`,
> `OcrQualityReportLifecycleStatus`, `OcrQualityAttestationVerificationStatus`) and 11 diagnostic
> codes (`OcrQualityAttestationValidationDiagnostic`). `validateOcrQualityAttestation` implements
> 12 pure rules producing `valid`, `trustedForPilot`, and `trustedForProduction` tiers.
> Synthetic fixtures with `fixture_declared` method and `not_applicable` verification are
> `trustedForPilot` but not `trustedForProduction`. Production trust requires `verified`
> verification + real store reference + known issuer. 10-case regression scaffold covers all
> paths. No real OCR engine wired. No DB or persistence added. No runtime coupling created.
>
> **8.2F-15L Update:** Debt 8 (pilot session telemetry attestation store contract) is **upgraded
> — still partially resolved**. `PilotSessionAttestationRecord` defined with 6-value issuer kind
> (including `future_auth_gateway`), 5-value store kind (including `future_session_store_record`),
> 5-value attestation method, 5-value lifecycle status, 4-value verification status, and 11
> diagnostic codes. `validatePilotSessionAttestation` implements 12 pure rules producing `valid`,
> `trustedForPilot`, and `trustedForProduction` tiers. 10-case regression scaffold covers all
> trust and failure paths. No real auth wired. No DB or session store added. No pilot activation.
>
> **8.2F-15M Update:** Debt 9 (wording score attestation store contract) is **upgraded — still
> partially resolved**. `WordingJudgeAttestationRecord` defined with 6-value issuer kind
> (including `future_llm_judge` and `future_human_review_system`), 5-value store kind (including
> `future_review_store_record`), 5-value attestation method (including `future_judge_signed`),
> 5-value lifecycle status, 4-value verification status, and 11 diagnostic codes.
> `validateWordingJudgeAttestation` implements 12 pure rules. 11-case regression scaffold includes
> manual reviewer production trust case (Case 3). No real LLM judge wired. No NLP. No real text
> evaluation. No DB or persistence added. `run-wording-evaluation-scaffold.ts` unchanged.
> Debt 9 remains explicitly tracked in `WARNING_FINDINGS` as partially resolved.
>
> **8.2F-15O Update:** Debt 5 (cross-phase diagnostic namespace isolation) is **upgraded —
> still partially resolved**. `DiagnosticEnvelopeAdapterInput` typed adapter input introduced in
> `diagnostic-envelope-adapter-types.ts`. `DiagnosticEnvelopeSourceKind` (13 values with `native_`
> prefix), `DiagnosticEnvelopeAdapterDiagnostic` (5 codes), and `DiagnosticEnvelopeAdapterResult`
> (with `envelope`, `adapted`, `diagnostics`) defined.
> `buildDiagnosticEnvelopeFromNativeDiagnostic`: explicit 13-case `sourceKind` → `DiagnosticNamespaceLayer`
> mapping; hard failures for blank `code` and `neverUserVisible !== true`; soft diagnostics for unknown
> source, default severity, and exhaustiveness fallback; envelope always returned (best-effort even on failure).
> `buildDiagnosticEnvelopesFromNativeDiagnostics`: batch adapter with `allAdapted` aggregation.
> 12-case regression scaffold: Cases 1–6 verify all named source kinds; Case 12 confirms adapted
> envelopes pass `validateDiagnosticNamespaceEnvelopes` with `valid = true`.
> No source modules modified. No diagnostic codes renamed or removed. No runtime coupling added.
> No persistence, telemetry, or logging. Remaining gap: source emission sites do not yet adopt
> envelopes at runtime; no cross-phase diagnostic correlation store exists.
>
> **8.2F-15N Update:** The provenance recording gap (trace vocabulary not wired to any live
> governance event) is **partially resolved**. `AuditTraceEmissionRecord` typed emission contract
> introduced in `audit-trace-emission-types.ts`. `AuditTraceEmissionLayer` (14 values),
> `AuditTraceEmissionKind` (12 values), `AuditTraceEmissionSeverity` (4 values), and
> `AuditTraceEmissionValidationDiagnostic` (6 codes) defined.
> `validateAuditTraceEmission` implements 8 structural rules: 3 hard failures (blank `emissionId`,
> blank `parentTraceId`, `neverUserVisible !== true` at runtime) and 3 soft diagnostics (unknown
> layer, duplicate parent IDs, missing reference for `blocking`/`critical` severity).
> `buildAuditTraceNodeFromEmission` provides explicit layer → `ProvenanceSourceKind` and
> `emissionKind` → `AuditDecisionKind` mapping for all 14 + 12 values with no string inference.
> Conservative mappings: `bridge` → `"mapper"` sourceKind, `diagnostic_namespace` → `"unknown"`.
> 10-case regression scaffold: Cases 1–3 prove valid emissions convert to `AuditTraceNode` with
> correct `traceId`, `sourceKind`, and `decisionKind`; Cases 4–9 cover all error paths; Case 10
> converts 3 emissions to `AuditTraceNode[]`, builds an `AuditTraceChain`, and confirms
> `validateAuditTraceChain` returns `valid = true`. No runtime emission wired. No persistence
> or store added. No governance layer (mapper, bridge, pilot, incident) behavior changed.
> Remaining gap: no production governance layer emits `AuditTraceEmissionRecord` at runtime.

---

## Critical Disclaimer

This audit document is an internal governance inventory.
It is never user-visible. It does not change any runtime behavior.
It documents the structural state of governance as of Phase 8.2F-14.

---

## 1. Layer Inventory

| Layer ID | Phase(s) | Key File(s) | Status |
|---|---|---|---|
| `constitution` | 8.2A/B | `boundary-policy-table.ts`, `trap-metadata-registry.ts` | Connected |
| `reality_matrix` | 8.2B | `reality-simulation-types.ts`, document-specific matrices | Connected |
| `evidence_gates` | — | *(not implemented)* | Future Phase Required |
| `simulation` | 8.2D | `run-reality-simulation.ts`, `boundary-emission-regression.ts` | Connected |
| `explanation_contract` | 8.2F-1/2 | `explanation-contract-types.ts`, `validate-contract-boundary-mapping.ts` | Connected |
| `free_preview_mapper` | 8.2F-3 | `run-free-preview-mapper.ts`, `free-preview-mapper-regression-scaffold.ts` | Partially Connected |
| `paid_mapper` | 8.2F-4 | `run-paid-explanation-mapper.ts`, `paid-explanation-mapper-regression-scaffold.ts` | Partially Connected |
| `smart_talk_bridge` | 8.2F-6 | `run-smart-talk-bridge-dry-run.ts`, `smart-talk-bridge-dry-run-regression.ts` | Partially Connected |
| `wording_review` | 8.2F-8 | `wording-review-types.ts`, `run-wording-review-scaffold.ts` | Partially Connected |
| `wording_evaluation` | 8.2F-12 | `wording-evaluation-types.ts`, `run-wording-evaluation-scaffold.ts` | Partially Connected |
| `ocr_uncertainty` | 8.2F-9 | `ocr-uncertainty-types.ts`, `evaluate-ocr-uncertainty.ts` | Partially Connected |
| `redacted_corpus` | 8.2F-10 | `redacted-corpus-registry.ts`, `redacted-corpus-regression.ts` | Partially Connected |
| `pilot_gate` | 8.2F-7/11 | `limited-pilot-gate-types.ts`, `run-limited-pilot-gate-scaffold.ts` | Partially Connected |
| `incident_governance` | 8.2F-13 | `incident-governance-types.ts`, `run-incident-governance-scaffold.ts` | Partially Connected |
| `provenance_audit` | 8.2F-14 | `provenance-audit-types.ts`, `run-provenance-audit-scaffold.ts` | Disconnected (vocabulary only) |

---

## 2. Lineage Flow

The intended governance lineage for a production Smart Talk request:

```
[User Document]
      │
      ▼
[OCR Pipeline]                       ← not yet integrated
      │ OcrDegradationVector
      │ baseConfidenceScore
      ▼
evaluateOcrUncertainty()             ← Phase 8.2F-9
      │ OcrEvaluationResult
      ▼
[Reality Matrix]                     ← Phase 8.2A/B
      │ UniversalDocumentRealityMatrix
      ▼
runRealitySimulation()               ← Phase 8.2D
      │ SimulationResult
      │ (boundary emissions, trap activations, uncertainty reasons)
      ▼
[Explanation Contract]               ← Phase 8.2F-1/2
      │ SimulationExplanationContract
      ▼
runFreePreviewMapper()               ← Phase 8.2F-3
  OR runPaidExplanationMapper()      ← Phase 8.2F-4
      │ RuntimeExplanationDraft
      ▼
runSmartTalkBridgeDryRun()           ← Phase 8.2F-6
      │ SmartTalkBridgeDryRunResult
      ▼
verifyHumanReviewCompliance()        ← Phase 8.2F-8
      │ WordingReviewComplianceResult
      ▼
evaluateExplanationWordingScaffold() ← Phase 8.2F-12
      │ WordingEvaluationResult
      ▼
runLimitedPilotGateScaffold()        ← Phase 8.2F-11
      │ LimitedPilotGateResult
      ▼
runIncidentGovernanceScaffold()      ← Phase 8.2F-13 (on block/breach)
      │ IncidentGovernanceResult
      ▼
[AuditTraceChain populated]          ← Phase 8.2F-14 (future)
      │ validateAuditTraceChain()
      ▼
[Explanation output / Block]
```

### Verified structural connections (as of 8.2F-14)

| From | To | Connection mechanism |
|---|---|---|
| Constitution | Reality Matrix | `BOUNDARY_POLICY_TABLE_V1`, `validateBoundaryEmissions` |
| Reality Matrix | Simulation | `runRealitySimulation` applies boundary and trap metadata |
| Simulation | Explanation Contract | `SimulationExplanationContract` derived from simulation output |
| Explanation Contract | Free Preview Mapper | Contract enforced in `runFreePreviewMapper` |
| Explanation Contract | Paid Mapper | Contract enforced in `runPaidExplanationMapper` |
| Both Mappers | Smart Talk Bridge | Bridge routes by `accessTier`, aggregates both mapper results |
| Bridge | Wording Review | Bridge `RuntimeExplanationDraft` is input to wording review |
| OCR Uncertainty | Pilot Gate | `runLimitedPilotGateScaffold` calls `evaluateOcrUncertainty` |
| OCR Uncertainty | Redacted Corpus | `expectedOcrDegradation: Partial<OcrDegradationVector>` on corpus entries |
| All Phases | Incident Governance | `sourceLayer` union covers all pipeline layers |
| All Phases | Provenance Audit | `ProvenanceSourceKind` vocabulary covers all pipeline layers |

---

## 3. Connected Safeguards

The following safeguards are structurally connected and functioning at the governance metadata level:

| Safeguard | Layer | Connected To | Mechanism |
|---|---|---|---|
| Boundary policy enforcement | `constitution` → `reality_matrix` → `simulation` | All downstream layers | `BOUNDARY_POLICY_TABLE_V1`, `validateBoundaryEmissions` |
| Trap activation metadata | `reality_matrix` → `simulation` | Explanation contract | `TRAP_METADATA_REGISTRY_V1`, `SimulationResult.trapActivations` |
| Contract boundary mapping | `explanation_contract` | Mapper, bridge | `validateContractBoundaryMapping` |
| Forbidden move enforcement | `free_preview_mapper`, `paid_mapper` | Bridge, wording review | `ForbiddenExplanationMove` in contract and mapper types |
| OCR hard-fail gating | `ocr_uncertainty` | Pilot gate | `evaluateOcrUncertainty` called in `runLimitedPilotGateScaffold` |
| Bridge tier mismatch detection | `smart_talk_bridge` | Observability | `bridge_contract_tier_mismatch` diagnostic |
| Wording review compliance | `wording_review` | Human governance | `verifyHumanReviewCompliance` |
| Tone safety evaluation | `wording_evaluation` | Pre-generation | `evaluateExplanationWordingScaffold` |
| Incident escalation model | `incident_governance` | All layers | `runIncidentGovernanceScaffold` |
| Audit trace vocabulary | `provenance_audit` | All layers (structural) | `AuditTraceNode`, `validateAuditTraceChain` |

---

## 4. Known Technical Debts

These debts do not block the synthetic governance scaffold from functioning, but must be resolved before production deployment.

### Debt 1 — `TrapActivation.trapKind` typed as `string` ✅ RESOLVED

**Severity:** ~~Warning~~ → **RESOLVED in Phase 8.2F-15B**
**Layer:** `reality_matrix`

`TrapActivation.trapKind` accepted any string value. The known trap kinds were encoded in `TRAP_METADATA_REGISTRY_V1` but there was no typed union enforcing that only known trap kinds could be emitted. This allowed governance bypasses via incorrect trap IDs at runtime.

**Resolution applied:** `TrapActivation.trapKind` changed from `string` to `HallucinationTrapKind` in `evidence-gates-types.ts`. `HallucinationTrapKind` is the canonical union type derived from `HALLUCINATION_TRAP_KINDS` in `types.ts` — the single source of truth for all registered trap identifiers.

**Cascading updates applied:**
- `evidence-gates-types.ts`: `HallucinationTrapKind` added to imports; `trapKind: string` → `trapKind: HallucinationTrapKind` in `TrapActivation`.
- `resolve-trap-activations.ts`: `ENFORCEMENT_CLUSTER_TRAP_KINDS` narrowed from `Set<string>` to `Set<HallucinationTrapKind>`; import updated.
- `run-reality-simulation.ts`: stale comment updated; defensive `in` check and conservative fallback retained for runtime safety (guards against incomplete registry states in future phases).

**Constraint preserved:** No new trap kinds added. No trap semantics changed. No simulation behavior changed. No runtime coupling added.

---

### Debt 2 — `calculated_amount` missing dedicated `ForbiddenExplanationMove` ✅ RESOLVED

**Severity:** ~~Warning~~ → **RESOLVED in Phase 8.2F-15A**
**Layer:** `explanation_contract`

No forbidden move existed for presenting a specific calculated monetary amount as authoritative. The wording evaluation scaffold could detect this via the `authoritativeLegalAdvice` tone metric, but no upstream contract-level signal existed.

**Resolution applied:** `no_calculated_amount_extraction` added to `KNOWN_FORBIDDEN_EXPLANATION_MOVES` and `ForbiddenExplanationMove` union in Phase 8.2F-15A.

**What the move enforces:** The explanation layer must not calculate, derive, infer, total, split, convert, estimate, or reconstruct monetary amounts from uncertain text, OCR fragments, partial documents, or unsupported cues.

**Cascading updates applied:** `ControlledCorpusExpectedForbiddenMove` extended; `validate-scenario-contract-expectations.ts` updated to use dedicated move as hard rule (replacing the proxy `no_deadline_calculation_when_forbidden`); `validate-scenario-boundary-expectations.ts` updated with `mustNotEmit: calculated_amount → no_calculated_amount_extraction` policy rule; `EXPLANATION_OUTPUT_REGRESSION_CORPUS` case 0017 added.

**Note:** No current corpus scenarios have `calculated_amount` in `mustNotEmit`. The registry, validator, and taxonomy are complete. Dedicated mapper diagnostic handling for this move is future 8.2F-15C work.

---

### Debt 3 — `false_reassurance` missing dedicated `ForbiddenExplanationMove` ✅ RESOLVED

**Severity:** ~~Warning~~ → **RESOLVED in Phase 8.2F-15A**
**Layer:** `explanation_contract`

False reassurance was modelled in the wording evaluation scaffold (Phase 8.2F-12) and incident governance (Phase 8.2F-13) but not as a `ForbiddenExplanationMove` in the contract layer. Mappers and bridge had no structural contract-level signal to block false reassurance — they relied entirely on downstream wording evaluation.

**Resolution applied:** `no_false_reassurance_framing` added to `KNOWN_FORBIDDEN_EXPLANATION_MOVES` and `ForbiddenExplanationMove` union in Phase 8.2F-15A.

**What the move enforces:** The explanation layer must not reassure the user that a risk is absent, harmless, resolved, forgiven, stopped, unenforceable, or safe unless explicitly supported by validated evidence and permitted by future policy.

**Cascading updates applied:** `ControlledCorpusExpectedForbiddenMove` extended; `validate-scenario-contract-expectations.ts` updated — `false_reassurance → no_false_reassurance_framing` is now a hard coverage rule (rule a) replacing the prior soft proxy check; `validate-scenario-boundary-expectations.ts` updated with `mustNotEmit: false_reassurance → no_false_reassurance_framing` policy rule; scenarios 0001, 0005, 0008, 0009, 0013, 0018 updated to include `no_false_reassurance_framing` in `expectedForbiddenMoves`; `EXPLANATION_OUTPUT_REGRESSION_CORPUS` case 0016 added.

---

### Debt 4 — `next_steps_safe` restriction-state appears unused ✅ RESOLVED (8.2F-15D)

**Severity:** Warning → **RESOLVED in Phase 8.2F-15D**
**Layer:** `paid_explanation_mapper`

**Dead path identified:** In `run-paid-explanation-mapper.ts`, the `PAID_FORBIDDEN_MOVE_EFFECTS` table has two entries that affect `next_steps_safe`:
1. `no_autonomous_form_submission` → `excludedSections: ["next_steps_safe"]` (section fully removed)
2. `no_deadline_calculation_when_forbidden` → `restrictedSections: ["paid_deep_explanation", "next_steps_safe"]` (section receives blocked reason codes)

When both moves are simultaneously active, the effect loop adds `next_steps_safe` to both `excludedSectionTypes` and `sectionBlockedReasonCodes`. In the section assembly loop, the exclusion check fires first (`excludedSectionTypes.has(sectionType)` → `true` → `continue`), making the accumulated restriction entry in `sectionBlockedReasonCodes` permanently unreachable.

**Resolution applied (8.2F-15D):** A post-filter loop added after the effect loop removes any `sectionBlockedReasonCodes` entries for sections already present in `excludedSectionTypes`. This makes the discarding of unreachable restriction-state explicit at the point of accumulation rather than implicitly at the assembly loop.

**Behavior preservation:** No section visibility changed. No `blockedReasonCodes` on any produced section changed. No diagnostics changed. When only `no_deadline_calculation_when_forbidden` is active (without `no_autonomous_form_submission`), `next_steps_safe` is still produced with its blocked reason code exactly as before — the post-filter is a no-op in that case since the section is not excluded.

---

### Debt 5 — Overloaded diagnostic taxonomy across phases ⚠ PARTIALLY RESOLVED (8.2F-15J + 8.2F-15O)

**Severity:** Warning → Reduced at mapper level (8.2F-15C) → **PARTIALLY RESOLVED in Phase 8.2F-15J** → **Upgraded in Phase 8.2F-15O**
**Layer:** cross-phase / `governance_lineage_audit`

**Original debt:** Multiple isolated diagnostic code union types exist across governance layers (e.g. `FreePreviewMapperDiagnosticCode`, `PaidExplanationMapperDiagnosticCode`, `BridgeDiagnosticCode`, `OcrDiagnosticCode`, `PilotGateDiagnosticCode`, `AuditTraceDiagnosticCode`). No shared taxonomy or namespace model exists for cross-phase audit correlation.

**Mapper-level debt reduced (8.2F-15C):**
- `FreePreviewMapperDiagnosticCode` now has a dedicated code per `ForbiddenExplanationMove`.
- `PaidExplanationMapperDiagnosticCode` now has a dedicated code per `ForbiddenExplanationMove`.
- `paid_legal_verdict_blocked` narrowed to `no_definitive_legal_verdicts` only.
- No section behavior or runtime routing changed.

**8.2F-15J Partial Resolution — Namespace Envelope Foundation:**

New files added to `lib/vaylo/smart-talk/reality-matrix/`:

| File | Contents |
|---|---|
| `diagnostic-namespace-types.ts` | `DiagnosticNamespaceLayer` (13 values), `DiagnosticSeverity`, `DiagnosticVisibility`, `DiagnosticNormalizedEnvelope`, `DiagnosticNamespaceValidationResult` |
| `diagnostic-namespace-registry.ts` | `KNOWN_DIAGNOSTIC_NAMESPACE_LAYERS`, `makeDiagnosticEnvelope()`, `validateDiagnosticNamespaceEnvelopes()`, `DIAGNOSTIC_NAMESPACE_SAMPLE_REGISTRY` (26 representative envelopes) |
| `diagnostic-namespace-regression-scaffold.ts` | 8-case regression scaffold (`runDiagnosticNamespaceRegressionScaffold`) |

`DiagnosticNormalizedEnvelope` wraps any raw diagnostic code from any layer with:
- `layer: DiagnosticNamespaceLayer` — which pipeline layer owns it
- `severity: DiagnosticSeverity` — informational / warning / blocking / critical
- `visibility: DiagnosticVisibility` — never_user_visible / internal_audit_only
- `phase?: string`, `sourceVersion?: string` — optional provenance tags
- `neverUserVisible: true` — compile-time invariant

`validateDiagnosticNamespaceEnvelopes()` checks: non-empty codes (hard failure), `neverUserVisible === true` (hard failure), unknown layers (soft warning → `fullyConsistent = false`), duplicate keys (soft warning → `fullyConsistent = false`).

**8.2F-15O Upgrade — Native Diagnostic Adapter Contract:**

New files added to `lib/vaylo/smart-talk/reality-matrix/`:

| File | Contents |
|---|---|
| `diagnostic-envelope-adapter-types.ts` | `DiagnosticEnvelopeSourceKind` (13 values), `DiagnosticEnvelopeAdapterInput`, `DiagnosticEnvelopeAdapterDiagnostic` (5 codes), `DiagnosticEnvelopeAdapterResult` |
| `build-diagnostic-envelope-adapter.ts` | `buildDiagnosticEnvelopeFromNativeDiagnostic()`, `buildDiagnosticEnvelopesFromNativeDiagnostics()` |
| `diagnostic-envelope-adapter-regression-scaffold.ts` | 12-case regression scaffold |

`DiagnosticEnvelopeAdapterInput` describes a native diagnostic code with its `sourceKind` (which source module emitted it), optional `severity`, `phase`, `sourceVersion`, `notes`, and `neverUserVisible: true`.

`buildDiagnosticEnvelopeFromNativeDiagnostic` maps `DiagnosticEnvelopeSourceKind` → `DiagnosticNamespaceLayer` via explicit 13-case switch (no string inference). Hard failures: blank `code`, `neverUserVisible !== true`. Soft diagnostics: `unknown` source, default severity used, exhaustiveness fallback. Envelope always returned even on failure (best-effort with forced invariant).

Regression Case 12 confirms that envelopes produced by the adapter pass `validateDiagnosticNamespaceEnvelopes` with `valid = true` and `neverUserVisible = true`.

**Remaining future work:** Source modules still emit their own typed diagnostic unions at runtime. Normalized envelopes are produced by the adapter only on demand — not at native emission sites. Full migration requires each source module to call `buildDiagnosticEnvelopeFromNativeDiagnostic` at the point of diagnostic emission, which is a separate future consolidation phase. No diagnostic codes renamed or removed. No source module behavior changed.

---

### Debt 6 — Broad blocking diagnostic buckets in bridge layer ✓ RESOLVED (8.2F-15I)

**Severity:** Warning → Partially reduced (8.2F-15C) → **RESOLVED in Phase 8.2F-15I**
**Layer:** `smart_talk_bridge`

**Original debt:** `SmartTalkBridgeDryRunResult` carried only a boolean `governancePreserved` and an untyped `diagnostics` array. When governance was not preserved, callers had to inspect individual diagnostic codes to understand which structural check had failed. No structured blocking reason type existed. Additionally, mapper codes were overloaded (resolved in 8.2F-15C).

**8.2F-15I Resolution:**
`BridgeBlockingReason` union type added to `explanation-mapper-types.ts`:

```typescript
type BridgeBlockingReason =
  | "section_invariant_violation"       // Check 1+2: sourceBound / neverContainsUserVisibleCopy
  | "diagnostic_visibility_violation"   // Check 3: neverUserVisible on mapper diagnostics
  | "free_preview_paid_section_leakage" // Check 6: free-preview draft has paid-only sections
  | "paid_free_only_section_leakage"    // Check 7: paid draft has free-only sections
  | "forbidden_move_not_preserved"      // Check 4: contract forbidden move absent from draft
  | "required_constraint_not_preserved" // Check 5: contract required constraint absent from draft
  | "invalid_access_tier"               // exhaustion guard: unrecognized tier
  | "missing_governance_metadata"       // reserved: governance metadata absent
```

`SmartTalkBridgeDryRunResult` gains `blockingReasons: readonly BridgeBlockingReason[]`:
- Always present; empty array when no blocking condition exists.
- Populated in parallel with `diagnostics` using a `Set<BridgeBlockingReason>` (deduplicated).
- Does not replace `diagnostics` — both are emitted.
- `governancePreserved` semantics unchanged.
- `bridge_contract_tier_mismatch` is intentionally **not** a `BridgeBlockingReason` — it is observability-only (Phase 8.2F-6A) and does not affect `governancePreserved` or `structurallyValid`.
- All 8 regression cases assert `blockingReasons.length === 0` for healthy invocations. Case 8 confirms `blockingReasons` remains empty when only `bridge_contract_tier_mismatch` fires.

---

### Debt 7 — Caller-supplied OCR confidence score is unvalidated at ingress ⚠ PARTIALLY RESOLVED (8.2F-15E + 8.2F-15K upgraded)

**Severity:** Warning → **PARTIALLY RESOLVED in Phase 8.2F-15E, Upgraded in Phase 8.2F-15K**
**Layer:** `ocr_uncertainty`

**Original debt:** `evaluateOcrUncertainty` accepted `baseConfidenceScore` as a raw caller-supplied number with no provenance or attestation contract. A caller could supply any value, bypassing the intent of OCR governance.

**Resolution applied (8.2F-15E):**

A typed provenance contract `OcrQualityReport` was introduced in `ocr-uncertainty-types.ts`:
- `OcrQualityReportSourceKind` — origin classification (`synthetic_metadata`, `manual_test_fixture`, `future_ocr_engine`, `imported_quality_report`)
- `OcrQualityAttestationStatus` — trust posture (`unattested`, `test_fixture_attested`, `future_engine_attested`)
- `OcrQualityReport` — structured report carrying `confidenceScore`, `qualityFlags`, `generatedBy`, `neverUserVisible: true`
- `OcrQualityReportValidationResult` — structural validation result

New functions in `evaluate-ocr-uncertainty.ts`:
- `evaluateOcrUncertaintyFromQualityReport` — preferred entrypoint; consumes `OcrQualityReport`, appends attestation warning note when `attestationStatus === "unattested"`
- `validateOcrQualityReport` — structural integrity checker

`LimitedPilotGateInput` updated:
- `baseOcrConfidenceScore` made optional (backward-compat fallback)
- `ocrQualityReport` added as preferred path
- Raw-score path emits `pilot_ocr_confidence_unattested` informational diagnostic

**Upgrade applied (8.2F-15K) — Full Attestation Store Contract:**

`OcrQualityAttestationRecord` defined in `ocr-quality-attestation-types.ts`:

| Enum | Values |
|------|--------|
| `OcrQualityReportIssuerKind` | `synthetic_fixture`, `manual_reviewer`, `future_ocr_engine`, `imported_external_report`, `unknown` |
| `OcrQualityReportStoreKind` | `in_memory_test_fixture`, `future_database_record`, `future_object_storage_metadata`, `imported_static_fixture`, `none` |
| `OcrQualityAttestationMethod` | `none`, `fixture_declared`, `manual_review_declared`, `future_engine_signed`, `future_store_verified` |
| `OcrQualityReportLifecycleStatus` | `draft`, `validated`, `rejected`, `expired`, `superseded` |
| `OcrQualityAttestationVerificationStatus` | `verified`, `unverifiable`, `failed`, `not_applicable` |

`validateOcrQualityAttestation` — 12-rule pure validator producing `OcrQualityAttestationValidationResult`:
- `valid` — no hard structural violations (non-blank IDs, non-failed/non-rejected status)
- `trustedForPilot` — valid + `lifecycleStatus === "validated"` + verification is `"verified"` or `"not_applicable"` (accepts synthetic fixtures)
- `trustedForProduction` — pilot-trusted + `verificationStatus === "verified"` + `storeKind !== "none"` + `issuerKind !== "unknown"`
- `diagnostics` — 10 typed codes including soft warnings (`unknown_issuer`, `no_store`, `unverified`) and hard failures (`missing_id`, `failed`, `rejected`)

10-case regression scaffold covers all trust tiers and failure paths.

**Trust tier semantics:**
- Synthetic fixture with `fixture_declared` + `not_applicable` verification → `trustedForPilot=true`, `trustedForProduction=false`
- Future OCR engine with `future_store_verified` + `verified` + real store → `trustedForPilot=true`, `trustedForProduction=true`

**Remaining gap:** No real OCR engine is wired. Both `OcrQualityReport` and `OcrQualityAttestationRecord` are still caller-constructed metadata. No real DB or store is connected. Full resolution requires a future production phase that binds the attestation record to a verified OCR engine output and a real attestation store.

---

### Debt 8 — Caller-supplied pilot telemetry is unvalidated at ingress *(Added 8.2F-15A)* ⚠ PARTIALLY RESOLVED (8.2F-15F + 8.2F-15L upgraded)

**Severity:** Warning → Informational (partially resolved)
**Layer:** `pilot_gate`

`LimitedPilotGateInput.telemetry` fields (`totalTransactionsThisSession`, `maxSessionLimit`) are caller-supplied. No session store or database backs these values. A caller could supply `totalTransactionsThisSession: 0` regardless of actual session state, bypassing the session-limit gate entirely.

**8.2F-15F Resolution:**
`PilotSessionReport` typed provenance contract introduced in `limited-pilot-gate-types.ts`. Carries:
- `reportId`: opaque identifier for audit tracing.
- `sourceKind` (`PilotSessionReportSourceKind`): `synthetic_metadata | manual_test_fixture | future_session_store | imported_session_report`.
- `attestationStatus` (`PilotSessionAttestationStatus`): `unattested | test_fixture_attested | future_store_attested`.
- `totalTransactionsThisSession`, `maxSessionLimit`, `sequenceId`, `generatedBy`, `neverUserVisible: true`.

`validatePilotSessionReport` checks structural integrity (non-empty IDs, finite numeric values, cap at 10,000 transactions).
`LimitedPilotGateInput.telemetry` made optional; `sessionReport` is the preferred path.
`pilot_session_telemetry_unattested` emitted as informational diagnostic on raw-telemetry path and for `attestationStatus === "unattested"` reports.
`pilot_session_report_invalid` emitted and gate blocked when structural validation fails.
Raw telemetry fallback retained for backward compatibility.

**8.2F-15L Upgrade — Full Attestation Store Contract:**

`PilotSessionAttestationRecord` defined in `pilot-session-attestation-types.ts`:

| Enum | Values |
|------|--------|
| `PilotSessionReportIssuerKind` | `synthetic_fixture`, `manual_reviewer`, `future_session_store`, `future_auth_gateway`, `imported_external_report`, `unknown` |
| `PilotSessionReportStoreKind` | `in_memory_test_fixture`, `future_database_record`, `future_session_store_record`, `imported_static_fixture`, `none` |
| `PilotSessionAttestationMethod` | `none`, `fixture_declared`, `manual_review_declared`, `future_store_verified`, `future_auth_signed` |
| `PilotSessionReportLifecycleStatus` | `draft`, `validated`, `rejected`, `expired`, `superseded` |
| `PilotSessionAttestationVerificationStatus` | `verified`, `unverifiable`, `failed`, `not_applicable` |

`validatePilotSessionAttestation` — 12-rule pure validator producing `PilotSessionAttestationValidationResult`:
- `valid` — no hard structural violations (non-blank IDs, non-failed/non-rejected status)
- `trustedForPilot` — valid + `lifecycleStatus === "validated"` + verification is `"verified"` or `"not_applicable"` (accepts synthetic fixtures)
- `trustedForProduction` — pilot-trusted + `verificationStatus === "verified"` + `storeKind !== "none"` + `issuerKind !== "unknown"`
- `diagnostics` — 11 typed codes including soft warnings (`unknown_issuer`, `no_store`, `unverified`) and hard failures (`missing_id`, `failed`, `rejected`)

10-case regression scaffold covers all trust tiers and failure paths.

**Trust tier semantics:**
- Synthetic fixture with `fixture_declared` + `not_applicable` verification → `trustedForPilot=true`, `trustedForProduction=false`
- Future session store or auth gateway with `future_store_verified`/`future_auth_signed` + `verified` + real store → `trustedForPilot=true`, `trustedForProduction=true`

**Remaining gap:** No real auth or session store is wired. Both `PilotSessionReport` and `PilotSessionAttestationRecord` are still caller-constructed metadata. No DB or real session tracking added. Full resolution requires binding to a verified session store or auth gateway and a real attestation store in a future production phase.

---

### Debt 9 — Caller-supplied wording tone scores are unvalidated at ingress *(Added 8.2F-15A)* ⚠ PARTIALLY RESOLVED (8.2F-15G + 8.2F-15M upgraded)

**Severity:** Warning → Informational (partially resolved — upgraded in 8.2F-15M)
**Layer:** `wording_evaluation`

`WordingEvaluationInput.toneMatrix` scores are entirely caller-supplied. The intended future workflow — an LLM judge or human reviewer supplies scores — is not enforced at the type layer. A caller could supply `{ authoritativeLegalAdvice: 0, falseReassurance: 0 }` for any draft, bypassing tone governance.

**8.2F-15G Resolution:**
`WordingToneScoreReport` typed provenance contract introduced in `wording-evaluation-types.ts`. Carries:
- `reportId`: opaque identifier for audit tracing.
- `sourceKind` (`WordingToneScoreReportSourceKind`): `synthetic_metadata | manual_review_metadata | future_llm_judge_metadata | imported_score_report`.
- `attestationStatus` (`WordingToneScoreAttestationStatus`): `unattested | test_fixture_attested | manual_review_attested | future_judge_attested`.
- `toneMatrix`: the risk scores, now bound to the provenance contract.
- `evaluatorId`, `evaluatorVersion`, `generatedBy`, `neverUserVisible: true`.

`validateWordingToneScoreReport` checks structural integrity (non-empty IDs, finite numeric values; out-of-range values noted as `wording_score_clamped`).
`evaluateExplanationWordingFromScoreReport` is the preferred provenance-backed entry point:
- Non-finite matrix values → `human_review_required` without calling core evaluator.
- `attestationStatus === "unattested"` → evaluation proceeds normally + `wording_score_report_unattested` note appended.
- Otherwise → delegates to existing `evaluateExplanationWordingScaffold`; all rules unchanged.
Raw `WordingEvaluationInput` (toneMatrix) path retained for backward compatibility.

**8.2F-15M Upgrade — Full Attestation Store Contract:**

`WordingJudgeAttestationRecord` defined in `wording-judge-attestation-types.ts`:

| Enum | Values |
|------|--------|
| `WordingJudgeIssuerKind` | `synthetic_fixture`, `manual_reviewer`, `future_llm_judge`, `future_human_review_system`, `imported_external_report`, `unknown` |
| `WordingScoreReportStoreKind` | `in_memory_test_fixture`, `future_database_record`, `future_review_store_record`, `imported_static_fixture`, `none` |
| `WordingJudgeAttestationMethod` | `none`, `fixture_declared`, `manual_review_declared`, `future_judge_signed`, `future_store_verified` |
| `WordingScoreReportLifecycleStatus` | `draft`, `validated`, `rejected`, `expired`, `superseded` |
| `WordingJudgeVerificationStatus` | `verified`, `unverifiable`, `failed`, `not_applicable` |

`validateWordingJudgeAttestation` — 12-rule pure validator producing `WordingJudgeAttestationValidationResult`:
- `valid` — no hard structural violations (non-blank IDs, non-failed/non-rejected status)
- `trustedForPilot` — valid + `lifecycleStatus === "validated"` + verification is `"verified"` or `"not_applicable"`
- `trustedForProduction` — pilot-trusted + `verificationStatus === "verified"` + `storeKind !== "none"` + `issuerKind !== "unknown"`
- `diagnostics` — 11 typed codes

**Trust tier semantics:**
- Synthetic fixture with `fixture_declared` + `not_applicable` → `trustedForPilot=true`, `trustedForProduction=false`
- Manual reviewer with `manual_review_declared` + `verified` + real store → `trustedForPilot=true`, `trustedForProduction=true`
- Future LLM judge with `future_judge_signed` + `verified` + real store → `trustedForPilot=true`, `trustedForProduction=true`

11-case regression scaffold covers all trust tiers (Cases 1–3) and all failure paths (Cases 4–11).

**Debt 9 tracking confirmed:** Debt 9 is explicitly retained in `WARNING_FINDINGS` with severity `informational` (partially resolved). It will remain there until a real LLM judge or human review system is wired and the raw `WordingToneMatrix` fallback is removed.

**Remaining gap:** No real LLM judge or human review system is wired. Both `WordingToneScoreReport` and `WordingJudgeAttestationRecord` are still caller-constructed metadata. No real text is evaluated. Full resolution requires a future production phase binding to a verified score evaluator and a real attestation store.

---

### Debt 10 — `AuditTraceChain.structurallyValid` set by caller, not enforced *(Added 8.2F-15A)* ✓ RESOLVED (8.2F-15H)

**Severity:** Warning → Resolved
**Layer:** `provenance_audit`

`AuditTraceChain.structurallyValid` was a caller-supplied boolean that could diverge from the structural truth computed by `validateAuditTraceChain`, creating a dual-source-of-truth risk.

**8.2F-15H Resolution:**
`structurallyValid` removed from `AuditTraceChain` in `provenance-audit-types.ts`. The type now carries only `rootTraceId`, `nodes`, and `neverUserVisible: true`.

`AuditTraceValidationResult.valid` (returned by `validateAuditTraceChain`) is the sole authoritative source of structural truth. No caller can supply a conflicting validity flag.

`validateAuditTraceChain` was not modified — it never read `chain.structurallyValid`.

The `chain()` fixture helper in the regression scaffold was updated to remove the parameter. All 8 existing regression cases pass with identical outcomes. No validator semantics changed.

---

## 5. Known Production Blockers

These issues block any real-user deployment. All must be resolved before production.

### Blocker 1 — Runtime explanation mapper not implemented

**Severity:** Critical
**Layer:** `simulation`, `free_preview_mapper`, `paid_mapper`

All mappers return structural governance metadata (posture, diagnostics, draft metadata) but produce no actual explanation text. The path from reality simulation output to user-visible explanation prose is entirely unimplemented. No LLM prompt, no template engine, no text synthesis exists anywhere in the codebase for this purpose.

**Impact:** Zero user-facing output is possible from the current stack.

---

### Blocker 2 — Simulation-to-explanation coupling not proven in production

**Severity:** Critical
**Layer:** `explanation_contract`

No end-to-end integration path exists from: real document → OCR → reality simulation → contract derivation → mapper → bridge → explanation draft. All validation runs against synthetic scaffolds only. The governance chain has never been exercised with real input.

**Impact:** Unknown failure modes exist in the production governance coupling.

---

### Blocker 3 — No real-world evaluation corpus

**Severity:** Critical
**Layer:** `redacted_corpus`

The redacted corpus contains five synthetic exemplars. No real user documents have been redacted and admitted under the Phase 8.2F-10 protocol. The governance scaffolds cannot be validated against authentic German bureaucratic document complexity.

**Impact:** Production OCR quality, mapper accuracy, and boundary rule coverage cannot be assessed without a real corpus.

---

### Blocker 4 — No production OCR cognition path

**Severity:** Critical
**Layer:** `ocr_uncertainty`

No OCR SDK is integrated. All OCR metadata (`OcrDegradationVector`, `baseConfidenceScore`) is caller-supplied or synthetic. A real image-to-text pipeline does not exist. Without OCR integration, no real document can enter the cognition pipeline.

**Impact:** The entire pipeline is blocked at the document ingestion step.

---

### Blocker 5 — No operational telemetry or audit persistence

**Severity:** Critical
**Layer:** `provenance_audit`

No governance decision across phases 8.2A through 8.2F-14 is persisted, logged, or transmitted to any monitoring system. Audit traces (`AuditTraceNode`) are not populated from any real governance event. Incident governance (`IncidentGovernanceResult`) produces metadata-only recommendations with no operational effect.

**8.2F-15N partial resolution:** `AuditTraceEmissionRecord` typed contract now exists with `validateAuditTraceEmission` and `buildAuditTraceNodeFromEmission`. Emission records can be converted to `AuditTraceNode[]` and form a structurally valid `AuditTraceChain` (proven in regression Case 10). No runtime emission site is wired; no persistence layer exists. This contract defines the interface that future phases must implement at each governance layer.

**Impact:** Production operation is ungovernable without an audit trail. Incident investigation, regulatory compliance review, and pilot governance review cannot be performed.

---

### Blocker 6 — OCR uncertainty not integrated into mapper or bridge

**Severity:** Critical
**Layer:** `ocr_uncertainty`

The OCR uncertainty harness is called by the pilot gate but not by the mapper or bridge. A document with a confidence score of 20 (unreadable) could pass through `runFreePreviewMapper` and `runSmartTalkBridgeDryRun` with no OCR safety gate applied.

**Impact:** Core safety guarantee (low-quality OCR should not proceed to explanation generation) is not enforced in the mapper/bridge path.

---

## 6. Pilot Readiness Impact

| Requirement | Status | Notes |
|---|---|---|
| Governance scaffold structurally complete | Yes | All phases 8.2F-1 → 8.2F-14 are built |
| Trusted user pilot gate modelled | Yes | Phase 8.2F-7 and 8.2F-11 |
| OCR gating in pilot gate | Yes | `evaluateOcrUncertainty` called in `runLimitedPilotGateScaffold` |
| Wording safety gated before pilot | No | `verifyHumanReviewCompliance` not called in pilot gate |
| Real-world document corpus | No | Synthetic exemplars only |
| Incident escalation modelled | Yes | Phase 8.2F-13 |
| Audit trace vocabulary | Yes | Phase 8.2F-14 vocabulary + 8.2F-15N emission contract; not yet wired at runtime |
| Pilot → incident auto-escalation | No | Manual routing required |
| Real OCR path | No | Caller-supplied metadata only |
| Operational telemetry | No | Not implemented |

**Assessment:** Synthetic governance testing is feasible. A trusted pilot with real documents is blocked by the absence of real-world corpus, real OCR integration, wording review integration in pilot gate, and operational telemetry.

---

## 7. Production Readiness Impact

| Requirement | Status | Notes |
|---|---|---|
| Explanation text generation | No | Mappers return metadata only |
| End-to-end integration tested | No | Synthetic scaffolds only |
| Real document corpus | No | Synthetic exemplars only |
| OCR SDK integrated | No | Caller-supplied metadata |
| Audit persistence | No | Not implemented |
| Operational telemetry | No | Not implemented |
| Kill switch operational | No | Metadata recommendation only |
| Legal review of output | No | Not performed |
| Regulatory compliance audit | No | Not performed |
| Human escalation chain | No | Modelled but not operational |

**Assessment:** The stack is NOT production-ready. Zero user-facing output is possible. All six critical blockers must be resolved before any real-user deployment.

---

## 8. Recommended Next Milestones

Listed in order of prerequisite dependency:

### Milestone 1 — Real OCR Integration (Phase 8.2G-1)
Integrate a real OCR SDK (Tesseract, AWS Textract, or similar). Wire `OcrDegradationVector` and `baseConfidenceScore` from real OCR output. Add OCR gating to the mapper and bridge pipeline. Connect OCR results to `evaluateOcrUncertainty` before any explanation draft is produced.

### Milestone 2 — Real-World Redacted Corpus Admission (Phase 8.2G-2)
Admit at least 20 real redacted documents under the Phase 8.2F-10 redaction protocol. Cover all seven `RedactedDocumentCategory` types. Run `runRedactedCorpusRegression` against the expanded corpus. Route corpus entries through OCR uncertainty and mapper scaffolds for end-to-end structural validation.

### Milestone 3 — Explanation Text Generation (Phase 8.2G-3)
Implement the actual text synthesis path in `runFreePreviewMapper` and `runPaidExplanationMapper`. This may use LLM prompting, template engines, or a structured composition approach. The output must satisfy all `ForbiddenExplanationMove`, `RequiredExplanationConstraint`, and `ExplanationBoundary` constraints structurally before returning.

### Milestone 4 — Governance Integration Wiring (Phase 8.2G-4)
Wire all partial connections: pilot gate → wording review compliance, wording evaluation → incident governance auto-escalation, pilot gate → incident governance auto-escalation. Populate `AuditTraceNode` records from real governance decisions. Build the end-to-end governance trace chain for each request.

### Milestone 5 — Audit Persistence and Telemetry (Phase 8.2G-5)
Implement audit log persistence (append-only, outside the sandbox). Emit governance decision records to an internal telemetry system. Build the audit record query infrastructure for governance review and incident investigation.

### Milestone 6 — Trusted Pilot Activation (Phase 8.2G-6)
Activate the limited trusted pilot with real (consented, invited) internal users. Require real-world corpus coverage, OCR integration, wording review gate in pilot gate, incident escalation wiring, and audit persistence before activation. Gate pilot expansion on governance review sign-off.

---

## Safety Classification

### SAFE FOR:
- Synthetic governance testing with the existing scaffold infrastructure
- Internal audit and architecture review
- Trusted pilot **preparation** (governance vocabulary, type modelling, readiness assessment)
- Development of future implementation phases

### NOT YET SAFE FOR:
- Public deployment to real users
- Autonomous explanation generation without human review
- Legal authority positioning ("this is what the law requires")
- Production cognition with real documents
- Pilot activation with real user documents

---

> **Governance vocabulary models safety posture. It does not provide operational safety. Real safety requires the implementation milestones above.**
