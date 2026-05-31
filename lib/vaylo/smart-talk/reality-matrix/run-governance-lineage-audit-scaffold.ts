/**
 * Governance Lineage Integration Audit scaffold (Phase 8.2F-15 / updated 8.2F-15L).
 *
 * Implements `runGovernanceLineageAuditScaffold` — a pure static inventory
 * function that returns a `GovernanceLineageAuditResult` covering the entire
 * Vaylo Document Reasoning Constitution V1 stack (8.2A → 8.2F-14).
 *
 * This is NOT a runtime scanner. It is a governance inventory.
 * No files are read. No APIs are called. No schemas are inspected.
 * All findings are pre-authored based on the known architecture.
 *
 * Finding categories:
 *
 *  A — Connected lineage (informational)
 *      Documents verified structural connections between adjacent layers.
 *
 *  B — Partial connections and technical debts (warning)
 *      Documents gaps, missing wiring, and structural debts that must be
 *      resolved before production deployment.
 *
 *  C — Production blockers and disconnected safeguards (critical)
 *      Documents unresolved risks that block any real-user deployment.
 *
 * 8.2F-15A changes:
 *  - Technical Debt: calculated_amount → RESOLVED. Dedicated ForbiddenExplanationMove
 *    no_calculated_amount_extraction added to KNOWN_FORBIDDEN_EXPLANATION_MOVES.
 *  - Technical Debt: false_reassurance → RESOLVED. Dedicated ForbiddenExplanationMove
 *    no_false_reassurance_framing added to KNOWN_FORBIDDEN_EXPLANATION_MOVES.
 *    Both resolved findings moved from WARNING to INFORMATIONAL with historical note.
 *  - Added 4 new WARNING findings: caller-supplied OCR confidence, caller-supplied
 *    pilot telemetry, caller-supplied wording scores, audit trace structurallyValid
 *    consistency.
 *
 * 8.2F-15B changes:
 *  - Technical Debt 1: TrapActivation.trapKind typed as string → RESOLVED.
 *    TrapActivation.trapKind is now HallucinationTrapKind in evidence-gates-types.ts.
 *    ENFORCEMENT_CLUSTER_TRAP_KINDS narrowed to Set<HallucinationTrapKind>.
 *    Resolved finding moved from WARNING_FINDINGS to CONNECTED_LINEAGE_FINDINGS.
 *
 * 8.2F-15C changes:
 *  - Technical Debt 5 (overloaded mapper diagnostic taxonomy) → PARTIALLY REDUCED.
 *
 * 8.2F-15D changes:
 *  - Technical Debt 4: next_steps_safe dead restriction-state → RESOLVED.
 *    A post-filter added to run-paid-explanation-mapper.ts removes any entries from
 *    sectionBlockedReasonCodes for sections that are already in excludedSectionTypes.
 *    Dead state was: no_autonomous_form_submission + no_deadline_calculation_when_forbidden
 *    both active → effect loop added next_steps_safe to both maps; section assembly
 *    exclusion check fired first, making the restriction entry unreachable.
 *    Resolved finding moved from WARNING_FINDINGS to CONNECTED_LINEAGE_FINDINGS.
 *  - No section visibility, blockedReasonCodes, diagnostics, or mapper output changed.
 *
 * 8.2F-15E changes:
 *  - Technical Debt 7: caller-supplied OCR confidence unvalidated at ingress → PARTIALLY RESOLVED.
 *    OcrQualityReport type introduced in ocr-uncertainty-types.ts with OcrQualityReportSourceKind,
 *    OcrQualityAttestationStatus, and OcrQualityReportValidationResult.
 *    evaluateOcrUncertaintyFromQualityReport added to evaluate-ocr-uncertainty.ts.
 *    validateOcrQualityReport helper added.
 *    LimitedPilotGateInput.baseOcrConfidenceScore made optional; ocrQualityReport added as
 *    preferred path. pilot_ocr_confidence_unattested diagnostic emitted on raw-score path.
 *    Raw baseOcrConfidenceScore fallback retained for backward compatibility.
 *    Partially resolved: OcrQualityReport contract exists but no real OCR engine is wired.
 *    Free-preview mapper: dedicated code per ForbiddenExplanationMove (13 specific codes).
 *    free_preview_paid_field_blocked is now the structural invariant only.
 *    Paid mapper: dedicated code per ForbiddenExplanationMove; paid_legal_verdict_blocked
 *    narrowed to no_definitive_legal_verdicts; paid_autonomous_action_blocked narrowed to
 *    no_autonomous_form_submission; paid_section_excluded_by_forbidden_move added.
 *    Cross-phase namespace isolation remains a future consolidation phase.
 *  - Technical Debt 6 (broad blocking diagnostic buckets) → PARTIALLY REDUCED.
 *    Mapper-level overloads resolved (see Debt 5). Bridge-level BridgeBlockingReason
 *    typed field remains a future phase.
 *    Finding text updated and split into mapper-resolved + bridge-remaining.
 *
 * 8.2F-15F changes:
 *  - Technical Debt 8: caller-supplied pilot telemetry is unauthenticated → PARTIALLY RESOLVED.
 *    PilotSessionReport type introduced in limited-pilot-gate-types.ts carrying reportId,
 *    sourceKind (PilotSessionReportSourceKind), attestationStatus (PilotSessionAttestationStatus),
 *    totalTransactionsThisSession, maxSessionLimit, sequenceId, generatedBy, and neverUserVisible:true.
 *    PilotSessionReportValidationResult added for structural ingress validation.
 *    validatePilotSessionReport added to run-limited-pilot-gate-scaffold.ts.
 *    LimitedPilotGateInput.telemetry made optional; sessionReport added as preferred path.
 *    pilot_session_telemetry_unattested emitted on raw-telemetry path and on unattested reports.
 *    pilot_session_report_invalid emitted when structural validation fails (blocks gate).
 *    Raw telemetry fallback retained for backward compatibility; emits unattested diagnostic.
 *    Partially resolved: PilotSessionReport contract exists but no session store is wired;
 *    report is still caller-constructed metadata.
 *
 * 8.2F-15G changes:
 *  - Technical Debt 9: caller-supplied wording tone scores are unvalidated → PARTIALLY RESOLVED.
 *    WordingToneScoreReport type introduced in wording-evaluation-types.ts carrying reportId,
 *    sourceKind (WordingToneScoreReportSourceKind), attestationStatus (WordingToneScoreAttestationStatus),
 *    toneMatrix, evaluatorId, evaluatorVersion, generatedBy, and neverUserVisible:true.
 *    WordingToneScoreReportValidationResult added for structural ingress validation.
 *    validateWordingToneScoreReport added to run-wording-evaluation-scaffold.ts.
 *    evaluateExplanationWordingFromScoreReport added as preferred provenance-backed entry point.
 *    Non-finite matrix values make scoreUsable=false → human_review_required returned.
 *    Unattested reports: evaluation proceeds + provenance note appended to result.
 *    Raw WordingEvaluationInput (toneMatrix) path retained for backward compatibility.
 *    Partially resolved: WordingToneScoreReport contract exists but no LLM judge is wired;
 *    report is still caller-constructed metadata.
 *
 * 8.2F-15H changes:
 *  - Technical Debt 10: AuditTraceChain.structurallyValid caller-supplied flag → RESOLVED.
 *    structurallyValid removed from AuditTraceChain in provenance-audit-types.ts.
 *    AuditTraceValidationResult.valid is now the sole authoritative source of structural truth.
 *    validateAuditTraceChain is unchanged — it never read chain.structurallyValid.
 *    chain() fixture helper in provenance-audit-regression-scaffold.ts updated (parameter removed).
 *    All 8 regression cases pass with the same assertions; validator behavior is unchanged.
 *    RUNTIME_PROVENANCE_AUDIT_TRACE.md spec updated.
 *
 * 8.2F-15J changes:
 *  - Technical Debt 5: cross-phase diagnostic namespace isolation → PARTIALLY RESOLVED.
 *    DiagnosticNamespaceLayer union (13 layers) defined in diagnostic-namespace-types.ts.
 *    DiagnosticNormalizedEnvelope wraps any raw diagnostic code with layer, severity,
 *    visibility (never_user_visible / internal_audit_only), phase, and sourceVersion.
 *    DiagnosticNamespaceValidationResult models structural checks on envelope collections.
 *    diagnostic-namespace-registry.ts provides KNOWN_DIAGNOSTIC_NAMESPACE_LAYERS,
 *    makeDiagnosticEnvelope() factory, validateDiagnosticNamespaceEnvelopes() validator,
 *    and DIAGNOSTIC_NAMESPACE_SAMPLE_REGISTRY (26 representative envelopes across 8 layers).
 *    diagnostic-namespace-regression-scaffold.ts provides 8 regression cases.
 *    Source modules retain their own typed diagnostic unions; no codes renamed/removed.
 *    Full migration to normalized envelopes at emission sites is future work.
 *
 * 8.2F-15L changes:
 *  - Technical Debt 8: pilot session telemetry attestation store contract → PARTIALLY RESOLVED (upgraded).
 *    PilotSessionAttestationRecord defined in pilot-session-attestation-types.ts with:
 *    PilotSessionReportIssuerKind (6 values), PilotSessionReportStoreKind (5 values),
 *    PilotSessionAttestationMethod (5 values), PilotSessionReportLifecycleStatus (5 values),
 *    PilotSessionAttestationVerificationStatus (4 values),
 *    PilotSessionAttestationValidationDiagnostic (11 codes).
 *    validatePilotSessionAttestation implements 12 pure rules producing:
 *    valid (structural integrity), trustedForPilot (lifecycle validated + acceptable verification),
 *    trustedForProduction (trusted pilot + verified + real store + known issuer).
 *    PilotSessionAttestationValidationResult carries valid, trustedForPilot, trustedForProduction,
 *    diagnostics, neverUserVisible, notes.
 *    10-case regression scaffold covers all trust paths.
 *    No real auth wired. No DB or persistence added. No runtime coupling created.
 *    No pilot access activated. Raw telemetry fallback and PilotSessionReport from 8.2F-15F unchanged.
 *
 * 8.2F-15K changes:
 *  - Technical Debt 7: OCR confidence attestation store contract → PARTIALLY RESOLVED (upgraded).
 *    OcrQualityAttestationRecord defined in ocr-quality-attestation-types.ts with:
 *    OcrQualityReportIssuerKind (5 values), OcrQualityReportStoreKind (5 values),
 *    OcrQualityAttestationMethod (5 values), OcrQualityReportLifecycleStatus (5 values),
 *    OcrQualityAttestationVerificationStatus (4 values), OcrQualityAttestationValidationDiagnostic (10 codes).
 *    validateOcrQualityAttestation implements 12 pure rules producing:
 *    valid (structural integrity), trustedForPilot (lifecycle validated + acceptable verification),
 *    trustedForProduction (trusted pilot + verified + real store + known issuer).
 *    OcrQualityAttestationValidationResult carries valid, trustedForPilot, trustedForProduction,
 *    diagnostics, neverUserVisible, notes.
 *    10-case regression scaffold covers all trust paths.
 *    No real OCR engine wired. No DB or persistence added. No runtime coupling created.
 *    Raw baseOcrConfidenceScore fallback and OcrQualityReport from 8.2F-15E unchanged.
 *
 * 8.2F-15I changes:
 *  - Technical Debt 6: bridge-level BridgeBlockingReason typed field → RESOLVED.
 *    BridgeBlockingReason union type added to explanation-mapper-types.ts with 8 variants:
 *    section_invariant_violation, diagnostic_visibility_violation,
 *    free_preview_paid_section_leakage, paid_free_only_section_leakage,
 *    forbidden_move_not_preserved, required_constraint_not_preserved,
 *    invalid_access_tier, missing_governance_metadata.
 *    SmartTalkBridgeDryRunResult gains blockingReasons: readonly BridgeBlockingReason[].
 *    runSmartTalkBridgeDryRun populates blockingReasons in parallel with diagnostics using a
 *    Set<BridgeBlockingReason> for deduplication. Each of the 7 structural/governance checks
 *    contributes the appropriate typed reason. bridge_contract_tier_mismatch is intentionally
 *    excluded — it is observability-only (Phase 8.2F-6A) and does not produce a blocking reason.
 *    governancePreserved semantics unchanged. diagnostics unchanged. No routing behavior changed.
 *    All 8 regression cases updated to assert blockingReasons.length === 0 for healthy invocations.
 *    Case 8 additionally confirms blockingReasons is empty when only bridge_contract_tier_mismatch fires.
 *
 * Safety guarantees:
 * - no runtime modification
 * - no telemetry
 * - no persistence
 * - no logging
 * - no Smart Talk connection
 * - no OCR SDK or LLM calls
 * - all results carry neverUserVisible: true
 */

import type {
  GovernanceAuditFinding,
  GovernanceAuditFindingSeverity,
  GovernanceLayerId,
  GovernanceLineageAuditResult,
} from "./governance-lineage-audit-types";

export const GOVERNANCE_LINEAGE_AUDIT_VERSION =
  "8.2f-15l-governance-lineage-audit-v13";

// ── Finding factory ───────────────────────────────────────────────────────────

function finding(
  layerId: GovernanceLayerId,
  severity: GovernanceAuditFindingSeverity,
  title: string,
  description: string,
): GovernanceAuditFinding {
  return { layerId, severity, title, description, neverUserVisible: true };
}

// ── A — Connected lineage (informational) ────────────────────────────────────

const CONNECTED_LINEAGE_FINDINGS: readonly GovernanceAuditFinding[] = [
  finding(
    "constitution",
    "informational",
    "Constitution → Reality Matrix: boundary policy wired",
    "BOUNDARY_POLICY_TABLE_V1 and TRAP_METADATA_REGISTRY_V1 encode the " +
      "Vaylo Document Reasoning Constitution V1 rules as structural governance " +
      "metadata. validateBoundaryEmissions enforces boundary constraints at the " +
      "simulation layer, providing a direct constitution-to-reality-matrix link.",
  ),
  finding(
    "reality_matrix",
    "informational",
    "Reality Matrix → Simulation: runRealitySimulation orchestrates matrix",
    "runRealitySimulation applies the reality matrix boundary rules and trap " +
      "metadata to a simulation input, returning a SimulationResult that carries " +
      "boundary emissions, trap activations, uncertainty reasons, and review flags. " +
      "The matrix is the authoritative source of governance constraint for all " +
      "downstream layers.",
  ),
  finding(
    "simulation",
    "informational",
    "Simulation → Explanation Contract: contract governs mapper input",
    "SimulationExplanationContract (free-preview and paid variants) is derived " +
      "from simulation output and governs what mappers may produce. Contract " +
      "boundary mappings are validated by validateContractBoundaryMapping, " +
      "ensuring simulation governance constraints propagate into the mapper layer.",
  ),
  finding(
    "explanation_contract",
    "informational",
    "Explanation Contract → Free Preview Mapper: contract enforced",
    "runFreePreviewMapper accepts a RuntimeExplanationMapperInput that includes " +
      "the explanation contract. It applies forbidden-move checks and boundary " +
      "constraints from the contract, returning a RuntimeExplanationDraft with " +
      "FreePreviewMapperDiagnosticCode emissions. Contract governance is enforced " +
      "structurally before any draft reaches the bridge.",
  ),
  finding(
    "explanation_contract",
    "informational",
    "Explanation Contract → Paid Mapper: contract enforced",
    "runPaidExplanationMapper mirrors the free-preview mapper contract enforcement " +
      "for paid-tier access. PaidExplanationMapperDiagnosticCode emissions track " +
      "governance decisions including uncertainty escalations, forbidden moves, and " +
      "boundary applications. Both mappers share the same contract type system.",
  ),
  finding(
    "free_preview_mapper",
    "informational",
    "Mapper Layer → Smart Talk Bridge: bridge routes via mapper",
    "runSmartTalkBridgeDryRun orchestrates both mappers, routes by accessTier, " +
      "validates structural integrity (non-null draft, at least one boundary " +
      "emitted, at least one section draft), and aggregates BridgeDiagnostic " +
      "emissions. Bridge contract-tier mismatch detection (Phase 8.2F-6A) adds " +
      "observability for tier inconsistencies.",
  ),
  finding(
    "smart_talk_bridge",
    "informational",
    "Smart Talk Bridge → Wording Review: bridge draft feeds review scaffold",
    "The RuntimeExplanationDraft produced by the bridge is the primary input " +
      "to verifyHumanReviewCompliance. The wording review scaffold checks that " +
      "a WordingReviewSnapshot covers all forbidden moves, required constraints, " +
      "and blocked reason codes present in the draft. Governance lineage from " +
      "bridge to review is structurally established.",
  ),
  finding(
    "ocr_uncertainty",
    "informational",
    "OCR Uncertainty → Pilot Gate: evaluateOcrUncertainty called in gate",
    "runLimitedPilotGateScaffold calls evaluateOcrUncertainty and uses its " +
      "result to gate pilot transactions. OCR hard-fail blocks the transaction " +
      "(pilot_blocked_by_ocr_degradation); OCR human-review triggers " +
      "human_review_required disposition. The pilot gate is the primary consumer " +
      "of OCR uncertainty metadata in Phase 8.2F-14.",
  ),
  finding(
    "ocr_uncertainty",
    "informational",
    "OCR Uncertainty → Redacted Corpus: corpus carries degradation metadata",
    "RedactedDocument includes expectedOcrDegradation?: Partial<OcrDegradationVector>, " +
      "enabling future regression pipelines to route corpus entries through " +
      "evaluateOcrUncertainty for end-to-end structural testing. Cross-phase " +
      "type reuse is verified.",
  ),
  finding(
    "incident_governance",
    "informational",
    "Incident Governance: sourceLayer vocabulary covers all phases",
    "IncidentGovernanceInput.sourceLayer covers all prior pipeline layers " +
      "(OCR, mapper, bridge, wording_review, pilot_gate, manual_report). Any " +
      "layer can structurally report an incident. KillSwitchDisposition " +
      "escalation rules cover severity and governance-compromise flags from " +
      "every prior phase.",
  ),
  finding(
    "provenance_audit",
    "informational",
    "Provenance Audit: ProvenanceSourceKind maps all pipeline layers",
    "ProvenanceSourceKind covers all 14 governance layers including OCR, " +
      "reality_matrix, simulation, explanation_contract, mapper, wording_review, " +
      "wording_evaluation, pilot_gate, incident_governance, and manual_review. " +
      "AuditDecisionKind covers all governance decision types (boundary_applied, " +
      "forbidden_move_applied, required_constraint_applied, incident_escalation, " +
      "etc.). Structural vocabulary for end-to-end traceability is complete.",
  ),
  finding(
    "wording_evaluation",
    "informational",
    "Wording Evaluation complements Wording Review: dual coverage",
    "Wording Review (Phase 8.2F-8) validates whether a human reviewer has " +
      "adequately assessed an explanation draft post-generation. Wording " +
      "Evaluation (Phase 8.2F-12) validates caller-supplied tone metadata " +
      "pre-generation. Together they form a two-layer wording safety model " +
      "covering both pre- and post-generation governance.",
  ),
  // ── Resolved technical debts (8.2F-15A) ──────────────────────────────────────
  finding(
    "explanation_contract",
    "informational",
    "RESOLVED (8.2F-15A): calculated_amount now has a dedicated ForbiddenExplanationMove",
    "Previously reported as a WARNING in Phase 8.2F-15: calculated_amount lacked a " +
      "dedicated ForbiddenExplanationMove in KNOWN_FORBIDDEN_EXPLANATION_MOVES. " +
      "Resolved in Phase 8.2F-15A by adding no_calculated_amount_extraction — " +
      "blocking the explanation layer from calculating, deriving, inferring, totalling, " +
      "splitting, converting, estimating, or reconstructing monetary amounts from " +
      "uncertain text, OCR fragments, partial documents, or unsupported cues. " +
      "Contract validators and corpus expectations updated accordingly.",
  ),
  finding(
    "explanation_contract",
    "informational",
    "RESOLVED (8.2F-15A): false_reassurance now has a dedicated ForbiddenExplanationMove",
    "Previously reported as a WARNING in Phase 8.2F-15: false_reassurance lacked a " +
      "dedicated ForbiddenExplanationMove in KNOWN_FORBIDDEN_EXPLANATION_MOVES. " +
      "Resolved in Phase 8.2F-15A by adding no_false_reassurance_framing — " +
      "blocking the explanation layer from reassuring users that a risk is absent, " +
      "harmless, resolved, forgiven, stopped, unenforceable, or safe unless explicitly " +
      "supported by validated evidence and permitted by future policy. Contract " +
      "validators, scenario expectations, and corpus entries updated accordingly.",
  ),
  finding(
    "reality_matrix",
    "informational",
    "RESOLVED (8.2F-15B): TrapActivation.trapKind now typed as HallucinationTrapKind",
    "Previously reported as a WARNING (Debt 1) in Phase 8.2F-15: " +
      "TrapActivation.trapKind was typed as string rather than a typed union of " +
      "known trap kind values, allowing arbitrary strings to pass as trap IDs at " +
      "runtime. Resolved in Phase 8.2F-15B by changing trapKind: string to " +
      "trapKind: HallucinationTrapKind in evidence-gates-types.ts. The canonical " +
      "registry (TRAP_METADATA_BY_KIND / HALLUCINATION_TRAP_KINDS in types.ts) " +
      "remains the single source of truth. ENFORCEMENT_CLUSTER_TRAP_KINDS in " +
      "resolve-trap-activations.ts narrowed from Set<string> to Set<HallucinationTrapKind>. " +
      "Defensive runtime lookup guard retained in run-reality-simulation.ts. " +
      "No trap semantics or simulation behavior changed.",
  ),
  finding(
    "free_preview_mapper",
    "informational",
    "RESOLVED (8.2F-15D): next_steps_safe dead restriction-state removed",
    "Previously reported as a WARNING (Debt 4) in Phase 8.2F-15: " +
      "when no_autonomous_form_submission and no_deadline_calculation_when_forbidden " +
      "were both active in the paid mapper, the effect loop added next_steps_safe to both " +
      "excludedSectionTypes (from the autonomous submission guard) and " +
      "sectionBlockedReasonCodes (from the deadline forbidden move). The section assembly " +
      "exclusion check fired first, making the accumulated restriction entry permanently " +
      "unreachable. Resolved in Phase 8.2F-15D by adding a post-filter loop after the " +
      "effect loop in runPaidExplanationMapper: for each section in excludedSectionTypes, " +
      "the corresponding entry (if any) is deleted from sectionBlockedReasonCodes before " +
      "the assembly loop runs. No section visibility, blockedReasonCodes on produced sections, " +
      "diagnostics, mapper output structure, or access-tier behavior changed. The single-move " +
      "case (only no_deadline_calculation_when_forbidden active) is unaffected: next_steps_safe " +
      "is still produced with its blocked reason codes when it is not excluded.",
  ),
  finding(
    "ocr_uncertainty",
    "informational",
    "PARTIALLY RESOLVED (8.2F-15E + 8.2F-15K): OCR confidence now has a typed provenance " +
      "contract and a full attestation store contract",
    "Previously reported as a WARNING (Debt 7) in Phase 8.2F-15: evaluateOcrUncertainty " +
      "accepted baseConfidenceScore as a raw caller-supplied number with no provenance. " +
      "Phase 8.2F-15E introduced OcrQualityReport — a typed provenance contract carrying " +
      "confidenceScore, OcrQualityReportSourceKind, OcrQualityAttestationStatus, qualityFlags, " +
      "generatedBy, and neverUserVisible:true. evaluateOcrUncertaintyFromQualityReport and " +
      "validateOcrQualityReport added. LimitedPilotGateInput accepts ocrQualityReport (preferred) " +
      "or baseOcrConfidenceScore (backward-compat); raw-score path emits pilot_ocr_confidence_unattested. " +
      "Phase 8.2F-15K upgraded Debt 7 by adding the full attestation store contract: " +
      "OcrQualityAttestationRecord with issuerKind (5 values), storeKind (5 values), " +
      "attestationMethod (5 values), verificationStatus (4 values), lifecycleStatus (5 values). " +
      "validateOcrQualityAttestation produces OcrQualityAttestationValidationResult with " +
      "valid, trustedForPilot (accepts synthetic fixtures via not_applicable verification), " +
      "and trustedForProduction (requires verified + real store + known issuer). " +
      "10-case regression scaffold covers all trust and failure paths. " +
      "Remaining gap: no real OCR engine is wired; both OcrQualityReport and " +
      "OcrQualityAttestationRecord are still caller-constructed metadata. " +
      "Full resolution requires binding to a verified OCR provider output and a real " +
      "attestation store in a future production phase.",
  ),
  finding(
    "pilot_gate",
    "informational",
    "PARTIALLY RESOLVED (8.2F-15F + 8.2F-15L): pilot telemetry now has a typed provenance " +
      "contract and a full attestation store contract",
    "Previously reported as a WARNING (Debt 8) in Phase 8.2F-15: " +
      "LimitedPilotGateInput.telemetry was a bare PilotSessionTelemetry with no provenance. " +
      "Phase 8.2F-15F introduced PilotSessionReport — a typed provenance contract carrying " +
      "reportId, PilotSessionReportSourceKind, PilotSessionAttestationStatus, " +
      "totalTransactionsThisSession, maxSessionLimit, sequenceId, generatedBy, and " +
      "neverUserVisible:true. validatePilotSessionReport provides structural integrity checks. " +
      "LimitedPilotGateInput accepts sessionReport (preferred) or telemetry (backward-compat); " +
      "raw-telemetry path and unattested reports emit pilot_session_telemetry_unattested; " +
      "structurally invalid reports emit pilot_session_report_invalid and block the gate. " +
      "Phase 8.2F-15L upgraded Debt 8 by adding the full attestation store contract: " +
      "PilotSessionAttestationRecord with issuerKind (6 values including future_auth_gateway), " +
      "storeKind (5 values including future_session_store_record), attestationMethod (5 values), " +
      "verificationStatus (4 values), lifecycleStatus (5 values). " +
      "validatePilotSessionAttestation produces PilotSessionAttestationValidationResult with " +
      "valid, trustedForPilot (accepts synthetic fixtures via not_applicable verification), " +
      "and trustedForProduction (requires verified + real store + known issuer). " +
      "11 diagnostic codes. 10-case regression scaffold covers all trust and failure paths. " +
      "Remaining gap: no real auth or session store is wired; both PilotSessionReport and " +
      "PilotSessionAttestationRecord are still caller-constructed metadata. " +
      "Full resolution requires binding to a verified session store or auth gateway and a " +
      "real attestation store in a future production phase.",
  ),
  // ── Partially resolved debts (8.2F-15C) ───────────────────────────────────────
  finding(
    "free_preview_mapper",
    "informational",
    "REDUCED (8.2F-15C, Debt 5): free-preview mapper diagnostic taxonomy hardened",
    "Previously free_preview_paid_field_blocked was overloaded to cover 8 semantically " +
      "distinct cases (legal verdicts, tax certainty, immigration certainty, guaranteed " +
      "outcomes, truthfulness, cross-lane, panic phrasing) in addition to its role as " +
      "the structural invariant for paid-section absence. Resolved by introducing dedicated " +
      "per-move codes: free_preview_legal_verdict_blocked, free_preview_guaranteed_outcome_blocked, " +
      "free_preview_truthfulness_blocked, free_preview_cross_lane_blocked, " +
      "free_preview_tax_certainty_blocked, free_preview_immigration_certainty_blocked, " +
      "free_preview_panic_phrasing_blocked, free_preview_false_reassurance_blocked, " +
      "free_preview_calculated_amount_blocked. free_preview_paid_field_blocked is now the " +
      "structural invariant only. No section presence/absence behavior changed.",
  ),
  finding(
    "paid_mapper",
    "informational",
    "REDUCED (8.2F-15C, Debt 5/6): paid mapper diagnostic taxonomy hardened",
    "Previously paid_legal_verdict_blocked was overloaded for 5 semantically distinct " +
      "cases (legal verdicts, guaranteed outcomes, tax certainty, immigration certainty, " +
      "dry-run/speculation truthfulness). paid_autonomous_action_blocked was overloaded as " +
      "both a forbidden-move notification and a generic section-exclusion notification. " +
      "Resolved by introducing: paid_guaranteed_outcome_blocked, paid_tax_certainty_blocked, " +
      "paid_immigration_certainty_blocked, paid_truthfulness_blocked, paid_panic_phrasing_blocked, " +
      "paid_false_reassurance_blocked, paid_calculated_amount_blocked, " +
      "paid_section_excluded_by_forbidden_move. paid_legal_verdict_blocked is now narrowed to " +
      "no_definitive_legal_verdicts only. paid_autonomous_action_blocked is narrowed to " +
      "no_autonomous_form_submission only. No section behavior or access-tier routing changed.",
  ),
];

// ── B — Partial connections and technical debts (warning) ────────────────────

const WARNING_FINDINGS: readonly GovernanceAuditFinding[] = [
  // Partial connections
  finding(
    "evidence_gates",
    "warning",
    "Evidence Gates layer: no dedicated scaffold implemented",
    "The governance lineage specification includes 'evidence gates' between " +
      "the reality matrix and simulation layers. No dedicated evidence gate " +
      "scaffold or type model has been built. The Trusted User Pilot Readiness " +
      "scaffold (Phase 8.2F-7) partially covers this concept at the pilot level " +
      "but does not serve as a general-purpose pre-simulation evidence gate. " +
      "Future phase required.",
  ),
  finding(
    "pilot_gate",
    "warning",
    "Pilot Gate → Incident Governance: blocked transactions not auto-escalated",
    "When runLimitedPilotGateScaffold returns disposition=blocked or " +
      "governanceCompromised=true, no automatic escalation path to " +
      "runIncidentGovernanceScaffold exists. A future orchestrator must route " +
      "pilot gate outcomes into the incident governance layer. Currently the " +
      "caller must manually propagate results.",
  ),
  finding(
    "wording_evaluation",
    "warning",
    "Wording Evaluation → Incident Governance: hard-fails not auto-escalated",
    "When evaluateExplanationWordingScaffold returns " +
      "disposition=hard_fail_tone_violation, no automatic escalation path to " +
      "runIncidentGovernanceScaffold exists. False reassurance, authoritative " +
      "legal advice, and manipulative tone violations are structurally detected " +
      "but must be manually routed to incident governance by a future orchestrator.",
  ),
  finding(
    "provenance_audit",
    "warning",
    "Provenance Audit: trace vocabulary not attached to any live runtime event",
    "AuditTraceNode, AuditTraceChain, and validateAuditTraceChain define the " +
      "structural vocabulary for governance lineage but are not populated by any " +
      "existing scaffold. No governance decision in phases 8.2F-1 through 8.2F-14 " +
      "emits an AuditTraceNode. Future phases must attach provenance recording to " +
      "all governance decision points.",
  ),
  finding(
    "wording_review",
    "warning",
    "Wording Review → Pilot Gate: human review compliance not gated before transaction",
    "runLimitedPilotGateScaffold does not call verifyHumanReviewCompliance before " +
      "allowing a transaction. A pilot transaction could be marked 'allowed' even " +
      "if the explanation draft for that document type has not passed human wording " +
      "review. Future integration must gate pilot approval on wording compliance.",
  ),
  finding(
    "redacted_corpus",
    "warning",
    "Redacted Corpus → Mapper Layer: corpus not used for mapper validation",
    "The five synthetic redacted exemplars in REDACTED_DOCUMENT_CORPUS provide " +
      "realistic document metadata but are not consumed by any mapper, bridge, or " +
      "regression scaffold. Future regression pipelines should route corpus entries " +
      "through evaluateOcrUncertainty, then runFreePreviewMapper or " +
      "runPaidExplanationMapper, for end-to-end structural validation.",
  ),
  // Technical debts (Debt 1 resolved in 8.2F-15B; Debt 4 resolved in 8.2F-15D —
  //   both moved to CONNECTED_LINEAGE_FINDINGS below)
  finding(
    "provenance_audit",
    "informational",
    "PARTIALLY RESOLVED (8.2F-15J): DiagnosticNormalizedEnvelope namespace model established",
    "Previously reported as a WARNING (Debt 5, partially reduced in 8.2F-15C): " +
      "8.2F-15C resolved mapper-level overloads (one dedicated diagnostic per ForbiddenExplanationMove; " +
      "free_preview_paid_field_blocked narrowed to structural invariant; " +
      "paid_legal_verdict_blocked narrowed to no_definitive_legal_verdicts; " +
      "paid_autonomous_action_blocked narrowed to no_autonomous_form_submission). " +
      "Each governance layer still emits its own isolated diagnostic code union type " +
      "(BridgeDiagnosticCode, OcrDiagnosticCode, PilotGateDiagnosticCode, " +
      "AuditTraceDiagnosticCode, etc.) with no shared cross-phase namespace. " +
      "Partially resolved in Phase 8.2F-15J by introducing: " +
      "DiagnosticNamespaceLayer (13-value union), DiagnosticNormalizedEnvelope (typed audit wrapper), " +
      "DiagnosticNamespaceValidationResult, KNOWN_DIAGNOSTIC_NAMESPACE_LAYERS, " +
      "makeDiagnosticEnvelope() factory, validateDiagnosticNamespaceEnvelopes() validator, " +
      "DIAGNOSTIC_NAMESPACE_SAMPLE_REGISTRY (26 representative envelopes across 8 layers), " +
      "and a full 8-case regression scaffold. " +
      "Source modules retain their own typed unions and emit diagnostics exactly as before — " +
      "no codes renamed, removed, or merged. " +
      "Remaining future work: source emission sites adopt envelopes directly so normalized " +
      "envelopes are produced at runtime rather than authored in a sample registry.",
  ),
  finding(
    "smart_talk_bridge",
    "informational",
    "RESOLVED (8.2F-15I): BridgeBlockingReason typed field added to SmartTalkBridgeDryRunResult",
    "Previously reported as a WARNING (Debt 6, partially reduced in 8.2F-15C): " +
      "SmartTalkBridgeDryRunResult carried only a boolean governancePreserved and an untyped " +
      "diagnostics array, requiring callers to inspect individual diagnostic codes to understand " +
      "why the bridge failed. Fully resolved in Phase 8.2F-15I: " +
      "BridgeBlockingReason union type added to explanation-mapper-types.ts with 8 variants: " +
      "section_invariant_violation, diagnostic_visibility_violation, " +
      "free_preview_paid_section_leakage, paid_free_only_section_leakage, " +
      "forbidden_move_not_preserved, required_constraint_not_preserved, " +
      "invalid_access_tier, missing_governance_metadata. " +
      "SmartTalkBridgeDryRunResult.blockingReasons: readonly BridgeBlockingReason[] added. " +
      "runSmartTalkBridgeDryRun populates blockingReasons in parallel with diagnostics using a " +
      "Set<BridgeBlockingReason> for deduplication across all 7 structural/governance checks. " +
      "bridge_contract_tier_mismatch (Phase 8.2F-6A) is intentionally excluded from blockingReasons " +
      "— it remains observability-only and does not affect governancePreserved or structurallyValid. " +
      "governancePreserved semantics and all diagnostic emissions are unchanged. " +
      "No routing behavior changed. Bridge version bumped to v2.",
  ),
  finding(
    "wording_evaluation",
    "informational",
    "PARTIALLY RESOLVED (8.2F-15G): wording tone scores now have a typed provenance contract",
    "Previously reported as a WARNING (Debt 9) in Phase 8.2F-15: " +
      "WordingEvaluationInput.toneMatrix was a bare caller-supplied struct with no provenance. " +
      "Partially resolved in Phase 8.2F-15G by introducing WordingToneScoreReport — a typed " +
      "provenance contract carrying reportId, WordingToneScoreReportSourceKind, " +
      "WordingToneScoreAttestationStatus, toneMatrix, evaluatorId, evaluatorVersion, " +
      "generatedBy, and neverUserVisible:true. " +
      "validateWordingToneScoreReport provides structural integrity checks (non-empty IDs, " +
      "finite numeric values; out-of-range values noted as wording_score_clamped). " +
      "evaluateExplanationWordingFromScoreReport is the preferred provenance-backed entry point: " +
      "non-finite scores → human_review_required; unattested reports → evaluation proceeds + " +
      "provenance note appended; all existing evaluation rules and dispositions unchanged. " +
      "Raw WordingEvaluationInput (toneMatrix) path retained for backward compatibility. " +
      "Remaining gap: no LLM judge is wired; WordingToneScoreReport is still caller-constructed " +
      "metadata. Full resolution requires binding to a verified score evaluator in a future phase.",
  ),
  // Technical debts identified in 8.2F-15A audit review
  // Debt 7 partially resolved in 8.2F-15E, upgraded in 8.2F-15K — moved to CONNECTED_LINEAGE_FINDINGS above
  // Debt 8 partially resolved in 8.2F-15F, upgraded in 8.2F-15L — moved to CONNECTED_LINEAGE_FINDINGS above
  // Debt 9 partially resolved in 8.2F-15G — moved to CONNECTED_LINEAGE_FINDINGS above
  finding(
    "provenance_audit",
    "informational",
    "RESOLVED (8.2F-15H): AuditTraceChain.structurallyValid removed — validator is sole authority",
    "Previously reported as a WARNING (Debt 10) in Phase 8.2F-15: " +
      "AuditTraceChain.structurallyValid was a caller-supplied boolean that could " +
      "diverge from the structural truth computed by validateAuditTraceChain, creating " +
      "a dual-source-of-truth risk (chain.structurallyValid=true while validator.valid=false, " +
      "or vice versa). Resolved in Phase 8.2F-15H by removing structurallyValid from " +
      "AuditTraceChain entirely. AuditTraceValidationResult.valid is now the sole " +
      "authoritative source of structural truth. validateAuditTraceChain was not modified — " +
      "it never read chain.structurallyValid. The chain() fixture helper in the regression " +
      "scaffold was updated to remove the parameter. All 8 existing regression cases pass " +
      "with identical outcomes. No validator semantics changed.",
  ),
  // Debt 10 resolved in 8.2F-15H — moved to CONNECTED_LINEAGE_FINDINGS above
];

// ── C — Production blockers and disconnected safeguards (critical) ────────────

const CRITICAL_FINDINGS: readonly GovernanceAuditFinding[] = [
  finding(
    "simulation",
    "critical",
    "BLOCKER: Runtime explanation mapper not implemented",
    "Phase 8.2F-2 created the RuntimeExplanationMapperInput/Draft type skeleton " +
      "and Phase 8.2F-3/4 created the free-preview and paid mappers, but no " +
      "mapper produces real explanation prose. All mappers return structural " +
      "governance metadata (posture, diagnostics, draft metadata) with empty or " +
      "placeholder section content. The actual text generation path — from " +
      "reality simulation output to user-visible explanation — is unimplemented. " +
      "This is the primary production blocker for the entire 8.2F stack.",
  ),
  finding(
    "explanation_contract",
    "critical",
    "BLOCKER: Simulation-to-explanation coupling not proven in production",
    "runRealitySimulation and runSmartTalkBridgeDryRun are structurally defined " +
      "but neither has been exercised in production. No end-to-end integration " +
      "test exists that runs a real document through the full chain: OCR input → " +
      "reality simulation → contract derivation → mapper → bridge → explanation " +
      "draft. All validation is against synthetic scaffolds only.",
  ),
  finding(
    "redacted_corpus",
    "critical",
    "BLOCKER: No real-world evaluation corpus",
    "The redacted corpus (Phase 8.2F-10) contains five synthetic exemplars only. " +
      "No real user documents have been redacted and admitted to the corpus under " +
      "the Phase 8.2F-10 protocol. Without a real-world corpus, the governance " +
      "scaffolds cannot be validated against authentic German bureaucratic document " +
      "complexity (variable OCR quality, mixed-lane documents, sender obscuration, " +
      "etc.). Synthetic coverage does not substitute for real-world corpus coverage.",
  ),
  finding(
    "ocr_uncertainty",
    "critical",
    "BLOCKER: No production OCR cognition path",
    "evaluateOcrUncertainty accepts caller-supplied OcrDegradationVector metadata " +
      "but does not connect to any OCR SDK, image processing pipeline, or document " +
      "scanner. In production, a real OCR pipeline (Tesseract, AWS Textract, " +
      "Google Document AI, or equivalent) must supply the degradation vector and " +
      "base confidence score. No integration with any OCR provider exists. All " +
      "OCR metadata is synthetic or caller-supplied.",
  ),
  finding(
    "provenance_audit",
    "critical",
    "BLOCKER: No operational telemetry or audit persistence",
    "No operational telemetry exists for any governance decision across " +
      "phases 8.2A through 8.2F-14. Governance decisions (boundary applications, " +
      "forbidden move blocks, pilot gate outcomes, incident escalations) produce " +
      "never-user-visible diagnostic metadata but this metadata is not persisted, " +
      "logged, transmitted, or correlated across requests. In production, an audit " +
      "trail is required for governance review, incident investigation, and " +
      "regulatory compliance.",
  ),
  finding(
    "ocr_uncertainty",
    "critical",
    "DISCONNECTED: OCR uncertainty not integrated into mapper or bridge pipeline",
    "evaluateOcrUncertainty is called by the pilot gate (Phase 8.2F-11) but is " +
      "not called by the explanation mapper or bridge. A real document could pass " +
      "through runFreePreviewMapper or runSmartTalkBridgeDryRun with a low OCR " +
      "confidence score and no structural gate would block it. The OCR uncertainty " +
      "harness is a disconnected safeguard from the mapper and bridge perspective.",
  ),
];

// ── Audit scaffold ────────────────────────────────────────────────────────────

/**
 * Returns a static never-user-visible `GovernanceLineageAuditResult` covering
 * the entire 8.2A → 8.2F-15L governance stack.
 *
 * Pure function — no file reads, no API calls, no schema inspection, no runtime
 * scanning. All findings are pre-authored based on the known architecture.
 */
export function runGovernanceLineageAuditScaffold(): GovernanceLineageAuditResult {
  const findings: readonly GovernanceAuditFinding[] = [
    ...CONNECTED_LINEAGE_FINDINGS,
    ...WARNING_FINDINGS,
    ...CRITICAL_FINDINGS,
  ];

  const criticalFindingCount = findings.filter(
    (f) => f.severity === "critical",
  ).length;
  const warningFindingCount = findings.filter(
    (f) => f.severity === "warning",
  ).length;

  // Overall status: the architecture has verified structural connections across
  // most layers but critical production blockers and disconnected safeguards
  // prevent any real-user deployment. Partially connected is the accurate
  // characterisation: the governance vocabulary is complete but operational
  // coupling is absent.
  const overallStatus = "partially_connected" as const;

  return {
    overallStatus,
    findings,
    criticalFindingCount,
    warningFindingCount,
    neverUserVisible: true,
  };
}
