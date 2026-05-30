# Governance Lineage Integration Audit — Phase 8.2F-15 (updated 8.2F-15A)

**Version:** `8.2f-15a-governance-lineage-audit-v2`
**Scope:** Vaylo Document Reasoning Constitution V1 — Phases 8.2A → 8.2F-15A
**Mode:** Audit only / no runtime wiring / no behavior modified
**Overall Status:** `partially_connected`

> **8.2F-15A Update:** Debt 2 (`calculated_amount`) and Debt 3 (`false_reassurance`) have been
> resolved. Both dedicated `ForbiddenExplanationMove` tokens have been added to
> `KNOWN_FORBIDDEN_EXPLANATION_MOVES`. Contract validators, corpus expectations, and
> scenario alignment tables updated. Four new technical debts documented (Debt 7–10).

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

### Debt 1 — `TrapActivation.trapKind` typed as `string`

**Severity:** Warning
**Layer:** `reality_matrix`

`TrapActivation.trapKind` accepts any string value. The known trap kinds are all encoded in `TRAP_METADATA_REGISTRY_V1` but there is no typed union enforcing that only known trap kinds are emitted. This allows governance bypasses via incorrect trap IDs at runtime.

**Resolution:** Introduce a `TrapKind` union type derived from `TRAP_METADATA_REGISTRY_V1` keys.

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

### Debt 4 — `next_steps_safe` restriction-state appears unused

**Severity:** Warning
**Layer:** `simulation`

The `next_steps_safe` restriction-state exists in the boundary policy type model but has no documented activation condition in any current scenario corpus entry or regression case. It is a dead governance path that may cause confusion in future development.

**Resolution:** Define an explicit activation condition or remove from the boundary policy table with documentation of the decision.

---

### Debt 5 — Overloaded diagnostic taxonomy across phases

**Severity:** Warning
**Layer:** `incident_governance`

Eight separate diagnostic code union types exist across phases 8.2F-8 through 8.2F-14: `WordingReviewDiagnosticCode`, `OcrDiagnosticCode`, `PilotGateDiagnosticCode`, `WordingViolationCode`, `IncidentDiagnosticCode`, `AuditTraceDiagnosticCode`, `BridgeDiagnosticCode`, `ExplanationMapperDiagnosticCode`. These are structurally isolated with no shared taxonomy. Cross-phase diagnostic correlation requires manual inspection.

**Resolution:** Introduce a unified `GovernanceDiagnosticCode` namespace or adapter layer in a future consolidation phase.

---

### Debt 6 — Broad blocking diagnostic buckets in bridge layer

**Severity:** Warning
**Layer:** `smart_talk_bridge`

`SmartTalkBridgeDryRunResult.governanceValid` is a single boolean. When `false`, the caller must inspect the `diagnostics` array to determine which structural check failed. No structured blocking reason type exists at the bridge level.

**Resolution:** Introduce a typed `BridgeBlockingReason` that classifies failures (no boundary emitted, null draft, section mismatch, tier mismatch) as a first-class result field.

---

### Debt 7 — Caller-supplied OCR confidence score is unvalidated at ingress *(Added 8.2F-15A)*

**Severity:** Warning
**Layer:** `ocr_uncertainty`

`evaluateOcrUncertainty` accepts `baseConfidenceScore` as a caller-supplied number and clamps it internally. No OCR provider integration validates this score against a real pipeline output. A caller could supply any value (e.g. `100` for a degraded document), bypassing the intent of the OCR governance gate. The clamping prevents crashes but not trust violations.

**Resolution:** Future phases must bind the confidence score to a verified OCR provider output rather than trusting caller-supplied metadata. The score should carry a provenance tag.

---

### Debt 8 — Caller-supplied pilot telemetry is unvalidated at ingress *(Added 8.2F-15A)*

**Severity:** Warning
**Layer:** `pilot_gate`

`LimitedPilotGateInput.telemetry` fields (`totalTransactionsThisSession`, `maxSessionLimit`) are caller-supplied. No session store or database backs these values. A caller could supply `totalTransactionsThisSession: 0` regardless of actual session state, bypassing the session-limit gate entirely.

**Resolution:** Future phases must bind pilot telemetry to a verified session state (database-backed or signed JWT) rather than trusting caller-supplied metadata.

---

### Debt 9 — Caller-supplied wording tone scores are unvalidated at ingress *(Added 8.2F-15A)*

**Severity:** Warning
**Layer:** `wording_evaluation`

`WordingEvaluationInput.toneMatrix` scores are entirely caller-supplied. The intended future workflow — an LLM judge or human reviewer supplies scores — is not enforced at the type layer. A caller could supply `{ authoritativeLegalAdvice: 0, falseReassurance: 0 }` for any draft, bypassing tone governance.

**Resolution:** Future phases must validate score provenance. The `sourceKind` field partially addresses intent but is not enforced. A signed or attested score envelope is needed.

---

### Debt 10 — `AuditTraceChain.structurallyValid` set by caller, not enforced *(Added 8.2F-15A)*

**Severity:** Warning
**Layer:** `provenance_audit`

`AuditTraceChain.structurallyValid` is a field that callers set when constructing a chain. `validateAuditTraceChain` does not use this field — it re-derives validity from the node structure. A chain could be constructed with `structurallyValid: true` but then fail validation, creating inconsistency between the stored chain and its actual validity status.

**Resolution:** Either remove `structurallyValid` from the input type (making it a validator-only output) or enforce that stored chains always reflect the result of `validateAuditTraceChain`.

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
| Audit trace vocabulary | Yes | Phase 8.2F-14 (vocabulary only, not populated) |
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
