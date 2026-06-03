/**
 * Runtime LLM Integration Architecture Plan types (Phase 8.2G-0).
 *
 * Defines the structural vocabulary for the Epoch 8.2G architecture plan —
 * the static design contract for connecting a future LLM-generated draft
 * path to the Epoch 8.2F governance kernel without bypassing any governance
 * constraint, forbidden move, wording gate, or audit path.
 *
 * This phase opens Epoch 8.2G (Runtime LLM Integration). No LLM is called.
 * No runtime behavior is changed. No user-visible output is generated.
 *
 * The types defined here model:
 * - The readiness of the integration architecture (not the live runtime).
 * - The ordered sequence of layers the LLM output must traverse.
 * - The risk and governance requirements for each layer.
 * - Hard invariants that must never be violated during integration.
 *
 * Safety guarantees:
 * - no LLM called
 * - no OCR called
 * - no API routes modified
 * - no runtime coupling
 * - no persistence
 * - no telemetry
 * - no user-visible output
 * - all results carry neverUserVisible: true
 */

// ── Integration readiness ──────────────────────────────────────────────────────

/**
 * The readiness classification for the runtime LLM integration architecture.
 *
 * - `architecture_defined`              — the integration architecture is fully
 *   designed; all governance contracts exist; no live LLM wiring has occurred
 *   yet. Ready to begin Phase 8.2G-1.
 *
 * - `blocked_by_missing_contract`       — one or more governance contracts
 *   required for safe LLM integration do not yet exist. Cannot proceed until
 *   the missing contract is defined.
 *
 * - `blocked_by_missing_governance_gate`— a required governance gate (wording,
 *   forbidden move, required constraint) is not yet structurally complete.
 *
 * - `blocked_by_missing_audit_path`     — the audit trace emission or diagnostic
 *   envelope path is not yet defined for the integration sequence.
 *
 * - `not_ready`                         — fundamental architecture gaps exist.
 */
export type RuntimeLLMIntegrationReadiness =
  | "architecture_defined"
  | "blocked_by_missing_contract"
  | "blocked_by_missing_governance_gate"
  | "blocked_by_missing_audit_path"
  | "not_ready";

// ── Integration layer identity ─────────────────────────────────────────────────

/**
 * The ordered layers that LLM-generated output must traverse in the Epoch 8.2G
 * runtime integration pipeline.
 *
 * The sequence is: normalization → simulation → contract → LLM draft →
 * validator → mapper → bridge → wording gate → review gate →
 * diagnostics → audit → incident → pilot → output assembly.
 *
 * - `input_normalization`            — normalize document metadata, OCR quality,
 *   and session context before entering the simulation pipeline.
 * - `document_reality_simulation`    — run the existing reality simulation
 *   orchestrator to derive governance posture and contracts.
 * - `explanation_contract_builder`   — derive the ExplanationBoundary from the
 *   simulation output.
 * - `llm_draft_adapter`              — the new adapter that calls the LLM with a
 *   governance-constrained prompt derived from the explanation contract.
 * - `llm_output_contract_validator`  — validates the LLM draft output against
 *   the explanation contract; blocks forbidden moves; enforces required constraints.
 * - `free_preview_mapper`            — applies free-preview governance to the
 *   validated draft.
 * - `paid_explanation_mapper`        — applies paid-explanation governance to the
 *   validated draft.
 * - `smart_talk_bridge`              — dry-run bridge check against all governance
 *   invariants before output is assembled.
 * - `wording_evaluation_gate`        — routes the draft through the wording
 *   evaluation scaffold; blocks non-compliant wording.
 * - `wording_review_gate`            — gates output on human review compliance
 *   before surfacing for high-risk document types.
 * - `diagnostic_envelope_adapter`    — wraps all diagnostics emitted during
 *   pipeline traversal into normalized envelopes for cross-phase correlation.
 * - `audit_trace_emission`           — emits AuditTraceEmissionRecord at each
 *   governance decision point and builds AuditTraceChain.
 * - `incident_governance`            — routes any governance breach or unresolvable
 *   condition to the incident governance scaffold.
 * - `pilot_gate`                     — gates final output through the limited
 *   trusted pilot gate during the pilot epoch.
 * - `user_visible_response_assembler`— assembles the final user-visible response
 *   only after all upstream governance gates have passed.
 */
export type RuntimeLLMIntegrationLayerId =
  | "input_normalization"
  | "document_reality_simulation"
  | "explanation_contract_builder"
  | "llm_draft_adapter"
  | "llm_output_contract_validator"
  | "free_preview_mapper"
  | "paid_explanation_mapper"
  | "smart_talk_bridge"
  | "wording_evaluation_gate"
  | "wording_review_gate"
  | "diagnostic_envelope_adapter"
  | "audit_trace_emission"
  | "incident_governance"
  | "pilot_gate"
  | "user_visible_response_assembler";

// ── Risk level ────────────────────────────────────────────────────────────────

/**
 * The governance risk level associated with a runtime integration layer.
 *
 * - `low`      — the layer's governance contract is fully defined and tested;
 *   low risk of governance regression during integration.
 * - `medium`   — the layer requires careful integration work; some contract
 *   gaps may emerge during live wiring.
 * - `high`     — the layer introduces new runtime behavior or touches
 *   user-visible output; must be carefully validated.
 * - `critical` — the layer is the primary safety gate; any breach here
 *   constitutes a governance kernel violation.
 */
export type RuntimeLLMIntegrationRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

// ── Finding ───────────────────────────────────────────────────────────────────

/**
 * A single never-user-visible finding about a runtime LLM integration layer.
 *
 * `layerId`                     — the pipeline layer this finding concerns.
 * `riskLevel`                   — governance risk of this layer during integration.
 * `title`                       — short never-user-visible label.
 * `description`                 — internal governance detail; never user-visible.
 * `requiredBeforeLiveLLM`       — must this layer be ready before any live LLM
 *                                 call is permitted?
 * `requiredBeforeUserVisibleOutput`— must this layer be ready before any
 *                                 user-visible output is assembled?
 * `neverUserVisible`            — compile-time invariant.
 */
export interface RuntimeLLMIntegrationFinding {
  readonly layerId: RuntimeLLMIntegrationLayerId;
  readonly riskLevel: RuntimeLLMIntegrationRiskLevel;
  readonly title: string;
  readonly description: string;
  readonly requiredBeforeLiveLLM: boolean;
  readonly requiredBeforeUserVisibleOutput: boolean;
  readonly neverUserVisible: true;
}

// ── Plan result ───────────────────────────────────────────────────────────────

/**
 * The never-user-visible result of `runRuntimeLLMIntegrationPlanScaffold`.
 *
 * `readiness`                   — overall architecture readiness.
 * `layerSequence`               — the ordered runtime pipeline layer sequence.
 * `findings`                    — never-user-visible findings for each layer.
 * `liveLLMAllowed`              — always `false` in Phase 8.2G-0; no live LLM
 *                                 is permitted until 8.2G-5 at the earliest.
 * `userVisibleOutputAllowed`    — always `false` in Phase 8.2G-0; no user-visible
 *                                 output may be assembled until all gates are wired.
 * `nextRecommendedPhase`        — the recommended next integration phase.
 * `neverUserVisible`            — compile-time invariant.
 */
export interface RuntimeLLMIntegrationPlanResult {
  readonly readiness: RuntimeLLMIntegrationReadiness;
  readonly layerSequence: readonly RuntimeLLMIntegrationLayerId[];
  readonly findings: readonly RuntimeLLMIntegrationFinding[];
  readonly liveLLMAllowed: false;
  readonly userVisibleOutputAllowed: false;
  readonly nextRecommendedPhase: "8.2G-1";
  readonly neverUserVisible: true;
}
