/**
 * Governance Lineage Integration Audit scaffold (Phase 8.2F-15 / updated 8.2F-15B).
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
  "8.2f-15b-governance-lineage-audit-v3";

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
  // Technical debts (Debt 1 resolved in 8.2F-15B — moved to CONNECTED_LINEAGE_FINDINGS below)
  finding(
    "simulation",
    "warning",
    "Technical Debt: next_steps_safe restriction-state appears unused",
    "The next_steps_safe restriction-state in the simulation boundary policy " +
      "exists in the type model but has no documented activation condition in " +
      "any current scenario or regression corpus entry. It is a dead code path " +
      "in the governance scaffold. A future phase should either define activation " +
      "conditions or remove it from the boundary policy table.",
  ),
  finding(
    "incident_governance",
    "warning",
    "Technical Debt: overloaded diagnostic taxonomy across phases",
    "Each phase (8.2F-8 through 8.2F-14) introduced its own diagnostic code " +
      "union type (WordingReviewDiagnosticCode, OcrDiagnosticCode, " +
      "PilotGateDiagnosticCode, WordingViolationCode, IncidentDiagnosticCode, " +
      "AuditTraceDiagnosticCode). These are structurally isolated — no shared " +
      "diagnostic taxonomy exists. A future consolidation phase should consider " +
      "a unified GovernanceDiagnosticCode namespace or cross-type adapter.",
  ),
  finding(
    "smart_talk_bridge",
    "warning",
    "Technical Debt: broad blocking diagnostic buckets in bridge layer",
    "SmartTalkBridgeDryRunResult.governanceValid is a single boolean that " +
      "aggregates all structural validity checks. When governance is invalid, " +
      "the diagnostics array must be inspected manually to identify which " +
      "specific check failed. A future phase should introduce typed blocking " +
      "reasons that directly classify the failure type without requiring " +
      "diagnostic array inspection.",
  ),
  // Technical debts identified in 8.2F-15A audit review
  finding(
    "ocr_uncertainty",
    "warning",
    "Technical Debt: caller-supplied OCR confidence score is unvalidated at ingress",
    "evaluateOcrUncertainty accepts baseConfidenceScore as a caller-supplied " +
      "number and clamps it internally. No OCR provider integration validates " +
      "this score against a real pipeline. A caller could supply any value, " +
      "bypassing the intent of OCR governance. Future phases must bind the " +
      "confidence score to a verified OCR provider output rather than trusting " +
      "caller-supplied metadata.",
  ),
  finding(
    "pilot_gate",
    "warning",
    "Technical Debt: caller-supplied pilot telemetry is unvalidated at ingress",
    "LimitedPilotGateInput.telemetry (totalTransactionsThisSession, " +
      "maxSessionLimit) is caller-supplied. No session store or database backs " +
      "these values. A caller could supply any telemetry, allowing session-limit " +
      "rules to be bypassed. Future phases must bind pilot telemetry to a " +
      "verified session state rather than trusting caller-supplied metadata.",
  ),
  finding(
    "wording_evaluation",
    "warning",
    "Technical Debt: caller-supplied wording tone scores are unvalidated at ingress",
    "WordingEvaluationInput.toneMatrix is entirely caller-supplied. Scores are " +
      "clamped internally but their origin is not verified. The intended future " +
      "workflow (LLM judge or human reviewer supplies scores) is not enforced " +
      "at the type layer. A caller could supply any scores, making tone " +
      "evaluation bypassable. Future phases must validate score provenance.",
  ),
  finding(
    "provenance_audit",
    "warning",
    "Technical Debt: AuditTraceChain.structurallyValid set by caller, not enforced",
    "AuditTraceChain.structurallyValid is a field that callers set when " +
      "constructing a chain, but validateAuditTraceChain does not use this " +
      "field — it re-derives validity from the node structure. There is a " +
      "potential consistency risk if a chain is constructed with " +
      "structurallyValid: true but then fails validation. Future phases should " +
      "either remove the field from the input type or enforce that it matches " +
      "validateAuditTraceChain output.",
  ),
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
 * the entire 8.2A → 8.2F-14 governance stack.
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
