/**
 * Runtime LLM Integration Architecture Plan Scaffold (Phase 8.2G-0).
 *
 * Implements `runRuntimeLLMIntegrationPlanScaffold` — a pure static architecture
 * inventory function that returns a `RuntimeLLMIntegrationPlanResult` describing
 * the planned runtime pipeline for Epoch 8.2G.
 *
 * This is NOT a runtime scaffold. It does not inspect runtime state.
 * It does not call any LLM. It does not read files. It does not call external
 * services. All findings are pre-authored based on the known governance
 * architecture from Epoch 8.2F and the planned Epoch 8.2G pipeline.
 *
 * Key invariants returned by this scaffold:
 *   liveLLMAllowed: false
 *   userVisibleOutputAllowed: false
 *   nextRecommendedPhase: "8.2G-1"
 *   readiness: "architecture_defined"
 *
 * The pipeline sequence (14 layers in order):
 *   1.  input_normalization
 *   2.  document_reality_simulation
 *   3.  explanation_contract_builder
 *   4.  llm_draft_adapter
 *   5.  llm_output_contract_validator
 *   6.  free_preview_mapper  (or paid_explanation_mapper — tier-dependent)
 *   7.  paid_explanation_mapper
 *   8.  smart_talk_bridge
 *   9.  wording_evaluation_gate
 *   10. wording_review_gate
 *   11. diagnostic_envelope_adapter
 *   12. audit_trace_emission
 *   13. incident_governance
 *   14. pilot_gate
 *   15. user_visible_response_assembler
 *
 * Safety guarantees:
 * - no LLM called
 * - no OCR called
 * - no API routes modified
 * - no runtime state inspected
 * - no files read
 * - no external services called
 * - no persistence, telemetry, or logging
 * - no user-visible output
 * - all results carry neverUserVisible: true
 */

import type {
  RuntimeLLMIntegrationFinding,
  RuntimeLLMIntegrationLayerId,
  RuntimeLLMIntegrationPlanResult,
  RuntimeLLMIntegrationRiskLevel,
} from "./runtime-llm-integration-plan-types";

export const RUNTIME_LLM_INTEGRATION_PLAN_VERSION =
  "8.2g-0-runtime-llm-integration-plan-v1";

// ── Factory helper ─────────────────────────────────────────────────────────────

function finding(
  layerId: RuntimeLLMIntegrationLayerId,
  riskLevel: RuntimeLLMIntegrationRiskLevel,
  requiredBeforeLiveLLM: boolean,
  requiredBeforeUserVisibleOutput: boolean,
  title: string,
  description: string,
): RuntimeLLMIntegrationFinding {
  return {
    layerId,
    riskLevel,
    title,
    description,
    requiredBeforeLiveLLM,
    requiredBeforeUserVisibleOutput,
    neverUserVisible: true,
  };
}

// ── Ordered layer sequence ─────────────────────────────────────────────────────

const LAYER_SEQUENCE: readonly RuntimeLLMIntegrationLayerId[] = [
  "input_normalization",
  "document_reality_simulation",
  "explanation_contract_builder",
  "llm_draft_adapter",
  "llm_output_contract_validator",
  "free_preview_mapper",
  "paid_explanation_mapper",
  "smart_talk_bridge",
  "wording_evaluation_gate",
  "wording_review_gate",
  "diagnostic_envelope_adapter",
  "audit_trace_emission",
  "incident_governance",
  "pilot_gate",
  "user_visible_response_assembler",
];

// ── Per-layer findings ─────────────────────────────────────────────────────────

const LAYER_FINDINGS: readonly RuntimeLLMIntegrationFinding[] = [
  finding(
    "input_normalization",
    "medium",
    true,
    true,
    "PLAN: Input normalization layer must be defined before any live document processing",
    "The input normalization layer is responsible for normalizing raw document metadata, " +
      "populating OcrQualityReport from a real OCR provider output, and binding caller session " +
      "context to PilotSessionReport. In Phase 8.2G-0 this layer is not yet implemented. " +
      "Required before: live LLM calls on real documents, any user-visible response. " +
      "Phase 8.2G-1 should define the InputNormalizationRequest contract types. " +
      "OCR engine binding belongs to Phase 8.2G-3.",
  ),
  finding(
    "document_reality_simulation",
    "low",
    true,
    true,
    "READY: Reality simulation scaffold complete; runtime wiring is the next step",
    "runRealitySimulation is fully scaffolded and regression-tested. The governance kernel " +
      "contract (traps, gates, posture, explanation contract derivation) is complete. " +
      "Integration work: bind real InputNormalizationRequest to RealitySimulationInput. " +
      "Risk is low because the simulation scaffold's behavior is governed and tested. " +
      "Required before any live LLM call.",
  ),
  finding(
    "explanation_contract_builder",
    "low",
    true,
    true,
    "READY: Explanation contract derivation complete; must gate the LLM prompt",
    "ExplanationBoundary derivation from simulation output is fully defined. " +
      "Integration work: the LLM prompt must be derived from ExplanationBoundary — " +
      "the LLM must never receive a prompt that does not encode the active forbidden moves, " +
      "required constraints, and posture. Required before any live LLM call.",
  ),
  finding(
    "llm_draft_adapter",
    "critical",
    true,
    true,
    "NOT YET BUILT: LLM draft adapter is the primary Epoch 8.2G deliverable",
    "The llm_draft_adapter is the new layer that calls the LLM with a governance-constrained " +
      "prompt derived from the ExplanationBoundary. It does not yet exist. " +
      "Requirements: (a) prompt must encode all active ForbiddenExplanationMoves; " +
      "(b) prompt must encode all RequiredExplanationConstraints; " +
      "(c) prompt must communicate uncertainty posture; " +
      "(d) prompt must not include user PII or OCR-degraded content that could cause hallucination; " +
      "(e) the adapter must return a typed LLMDraftOutput (not a raw string). " +
      "Phase 8.2G-1 defines the adapter contract types. Phase 8.2G-5 makes the first " +
      "sandboxed live LLM call.",
  ),
  finding(
    "llm_output_contract_validator",
    "critical",
    true,
    true,
    "NOT YET BUILT: LLM output contract validator is required before any output proceeds",
    "The llm_output_contract_validator checks the LLM draft output against the " +
      "ExplanationBoundary before it can proceed to the mapper layer. " +
      "It must: (a) detect forbidden-move violations in the draft; " +
      "(b) detect missing required-constraint coverage; " +
      "(c) detect false reassurance framing; " +
      "(d) detect legal verdict posture; " +
      "(e) detect calculated amount extraction from uncertain source; " +
      "(f) return a typed LLMOutputContractValidationResult. " +
      "Any failing draft must be blocked and routed to incident governance, not silently passed. " +
      "Phase 8.2G-2 implements this validator. " +
      "Required before any live LLM output can proceed downstream.",
  ),
  finding(
    "free_preview_mapper",
    "low",
    false,
    true,
    "READY: Free preview mapper scaffold complete; needs validated draft as input",
    "runFreePreviewMapper is fully scaffolded and governance-tested. " +
      "Integration work: receive validated LLMDraftOutput (from llm_output_contract_validator) " +
      "instead of the current synthetic MapperInput. The mapper's governance logic is unchanged. " +
      "Risk is low because the mapper's forbidden-move and required-constraint enforcement " +
      "is already tested. Required before user-visible free-preview output.",
  ),
  finding(
    "paid_explanation_mapper",
    "low",
    false,
    true,
    "READY: Paid explanation mapper scaffold complete; needs validated draft as input",
    "runPaidExplanationMapper is fully scaffolded and governance-tested. " +
      "Integration work: receive validated LLMDraftOutput as input. " +
      "The mapper's governance logic (section exclusion, per-move diagnostics, " +
      "paid_section_excluded_by_forbidden_move, etc.) is unchanged. " +
      "Required before user-visible paid-explanation output.",
  ),
  finding(
    "smart_talk_bridge",
    "low",
    false,
    true,
    "READY: Bridge dry-run scaffold complete; must run before output assembly",
    "runSmartTalkBridgeDryRun is fully scaffolded with typed BridgeBlockingReason field. " +
      "Integration work: bind the mapper output to the bridge input. " +
      "The bridge must still be run as a dry-run validation gate before output assembly — " +
      "it must not be bypassed even if the mapper passed all governance checks. " +
      "Required before user-visible response assembly.",
  ),
  finding(
    "wording_evaluation_gate",
    "critical",
    false,
    true,
    "NOT YET WIRED: Wording evaluation gate must run on every LLM draft before output",
    "runWordingEvaluationScaffold exists but is not yet called in the live pipeline. " +
      "In Epoch 8.2G this gate must be wired after the mapper produces its draft. " +
      "Requirements: (a) every user-visible wording string must pass wording evaluation; " +
      "(b) non-compliant wording must be blocked, not passed through with a warning; " +
      "(c) the WordingToneScoreReport must be populated from a real or mock LLM judge; " +
      "(d) human_review_required disposition must route to the review gate. " +
      "Phase 8.2G-3 implements this gate. " +
      "Required before any user-visible output.",
  ),
  finding(
    "wording_review_gate",
    "medium",
    false,
    true,
    "NOT YET WIRED: Human review gate must be triggered for high-risk document types",
    "verifyHumanReviewCompliance exists but is not called in the live pipeline or pilot gate. " +
      "In Epoch 8.2G this gate must be wired for high-risk document types (eviction notices, " +
      "legal threats, multi-party disputes). " +
      "Requirements: (a) a human review workflow must exist (tooling, assignment, SLA); " +
      "(b) output for high-risk types must not be assembled until compliance is confirmed. " +
      "Phase 8.2G-8 (Trusted Internal Pilot) is the earliest this becomes a hard gate. " +
      "Required before user-visible output for high-risk document types.",
  ),
  finding(
    "diagnostic_envelope_adapter",
    "low",
    false,
    false,
    "READY: Diagnostic envelope adapter contract complete; wire at emission sites in 8.2G",
    "buildDiagnosticEnvelopeFromNativeDiagnostic and batch adapter exist (Phase 8.2F-15O). " +
      "Integration work: call the adapter at every native diagnostic emission site in the " +
      "mapper, bridge, pilot gate, and incident governance layers. " +
      "Phase 8.2G-4 implements diagnostic envelope runtime dry run. " +
      "Not required before live LLM or user-visible output, but required before " +
      "any cross-phase audit correlation can occur in production.",
  ),
  finding(
    "audit_trace_emission",
    "medium",
    false,
    false,
    "CONTRACT READY: Audit trace emission contract complete; wire at decision points in 8.2G",
    "AuditTraceEmissionRecord, validateAuditTraceEmission, and buildAuditTraceNodeFromEmission " +
      "exist (Phase 8.2F-15N). Integration work: call buildAuditTraceNodeFromEmission at every " +
      "governance decision point in the mapper, bridge, pilot gate, and incident governance layers. " +
      "Build AuditTraceChain and persist to audit store. " +
      "Phase 8.2G-4 implements the runtime dry run. Phase 8.2G-6 implements persistence. " +
      "Required before production audit trail can be maintained.",
  ),
  finding(
    "incident_governance",
    "medium",
    false,
    false,
    "READY: Incident governance scaffold complete; must be automatically routed to in 8.2G",
    "runIncidentGovernanceScaffold exists. Currently requires manual routing. " +
      "Integration work: the llm_output_contract_validator and wording_evaluation_gate " +
      "must automatically route governance breaches to incident governance rather than " +
      "requiring manual orchestration. " +
      "Required before any live pipeline can handle governance failures safely.",
  ),
  finding(
    "pilot_gate",
    "high",
    false,
    true,
    "READY: Pilot gate scaffold complete; must be wired with human review compliance gate",
    "runLimitedPilotGateScaffold exists with typed PilotSessionReport and attestation contract. " +
      "Gap: verifyHumanReviewCompliance is not yet called before allowing a pilot transaction. " +
      "Integration work: (a) wire real auth/session store to populate PilotSessionReport; " +
      "(b) call verifyHumanReviewCompliance before allowing any transaction; " +
      "(c) wire the pilot gate as the final governance gate before output assembly. " +
      "Required before user-visible output in the trusted pilot phase (Phase 8.2G-8).",
  ),
  finding(
    "user_visible_response_assembler",
    "critical",
    false,
    true,
    "NOT YET BUILT: Response assembler must only run after all upstream gates pass",
    "No user_visible_response_assembler exists yet. This is the final output assembly layer. " +
      "Requirements: (a) may only run if ALL upstream gates have passed; " +
      "(b) must never assemble output from a draft that failed llm_output_contract_validator; " +
      "(c) must never assemble output that failed wording_evaluation_gate; " +
      "(d) must never surface any governance metadata (AuditTraceNode, DiagnosticEnvelope, " +
      "attestation records) to the user; " +
      "(e) must not produce prose if the pilot gate blocked the transaction; " +
      "(f) output must be typed (UserVisibleResponseDraft) before being returned to any API. " +
      "Phase 8.2G-6 scaffolds this layer. Phase 8.2G-7 proves it in end-to-end harness.",
  ),
];

// ── Scaffold export ────────────────────────────────────────────────────────────

/**
 * Returns the never-user-visible runtime LLM integration plan result.
 *
 * Static pre-authored architecture inventory. Does not inspect runtime state,
 * call any LLM, read files, or contact external services.
 *
 * Key assertions:
 *   readiness: "architecture_defined"  — all governance contracts exist
 *   liveLLMAllowed: false              — no live LLM permitted in Phase 8.2G-0
 *   userVisibleOutputAllowed: false    — no user output in Phase 8.2G-0
 *   nextRecommendedPhase: "8.2G-1"    — next phase is LLM adapter contract types
 *
 * Pure function — no side effects, no persistence, no logging, no telemetry.
 */
export function runRuntimeLLMIntegrationPlanScaffold(): RuntimeLLMIntegrationPlanResult {
  return {
    readiness: "architecture_defined",
    layerSequence: LAYER_SEQUENCE,
    findings: LAYER_FINDINGS,
    liveLLMAllowed: false,
    userVisibleOutputAllowed: false,
    nextRecommendedPhase: "8.2G-1",
    neverUserVisible: true,
  };
}
