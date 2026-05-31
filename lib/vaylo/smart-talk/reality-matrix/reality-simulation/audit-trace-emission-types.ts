/**
 * Audit Trace Emission Contract types (Phase 8.2F-15N).
 *
 * Defines the structural contract for how governance layers would describe the
 * audit trace nodes they intend to emit. This is a pure metadata model — no
 * runtime emission, no persistence, no logging, no telemetry.
 *
 * The intended future flow:
 *  1. A governance layer (mapper, bridge, pilot gate, etc.) produces an
 *     `AuditTraceEmissionRecord` describing a governance decision.
 *  2. `validateAuditTraceEmission` checks structural integrity.
 *  3. `buildAuditTraceNodeFromEmission` converts the emission record into
 *     an `AuditTraceNode` that can join an `AuditTraceChain`.
 *  4. A future persistence layer stores the chain.
 *
 * This phase defines steps 1–3 as contract/scaffold only. Step 4 is future work.
 *
 * Naming follows the same style as `ProvenanceSourceKind` and `AuditDecisionKind`
 * in `provenance-audit-types.ts` for consistency.
 *
 * Safety guarantees:
 * - no runtime emission wired
 * - no persistence (no DB writes, no log writes, no file writes)
 * - no telemetry SDK imported
 * - no runtime execution hooks
 * - no Smart Talk production connection
 * - no OCR SDK or LLM calls
 * - no user-visible output
 * - all result types carry neverUserVisible: true
 */

// ── Emission layer ─────────────────────────────────────────────────────────────

/**
 * The governance pipeline layer that would produce an audit trace emission.
 *
 * Follows the same naming style as `ProvenanceSourceKind` in
 * `provenance-audit-types.ts`. The additional layers (`bridge`,
 * `diagnostic_namespace`) have no direct `ProvenanceSourceKind` equivalent
 * and map conservatively via `buildAuditTraceNodeFromEmission`.
 *
 * - `OCR`                  — OCR confidence/degradation evaluation layer.
 * - `reality_matrix`       — Boundary/trap/rule application layer.
 * - `evidence_gate`        — Structural evidence gate layer.
 * - `simulation`           — run-reality-simulation orchestrator layer.
 * - `explanation_contract` — Contract boundary/forbidden-move validation layer.
 * - `mapper`               — Free-preview or paid explanation mapper layer.
 * - `bridge`               — Smart Talk bridge dry-run layer.
 * - `wording_review`       — Human wording review compliance layer.
 * - `wording_evaluation`   — Runtime wording evaluation scaffold layer.
 * - `pilot_gate`           — Limited trusted pilot gate layer.
 * - `incident_governance`  — Incident governance scaffold layer.
 * - `manual_review`        — Human reviewer decision layer.
 * - `diagnostic_namespace` — Cross-phase diagnostic namespace envelope layer.
 * - `unknown`              — Unclassified layer (conservatively always mapped to "unknown").
 */
export type AuditTraceEmissionLayer =
  | "OCR"
  | "reality_matrix"
  | "evidence_gate"
  | "simulation"
  | "explanation_contract"
  | "mapper"
  | "bridge"
  | "wording_review"
  | "wording_evaluation"
  | "pilot_gate"
  | "incident_governance"
  | "manual_review"
  | "diagnostic_namespace"
  | "unknown";

// ── Emission kind ──────────────────────────────────────────────────────────────

/**
 * The structural type of governance decision described in an emission record.
 *
 * Maps to `AuditDecisionKind` in `provenance-audit-types.ts` via
 * `buildAuditTraceNodeFromEmission`.
 *
 * - `boundary_emitted`                 — an explanation boundary constraint was emitted.
 * - `forbidden_move_applied`           — a forbidden explanation move was blocked.
 * - `required_constraint_applied`      — a required explanation constraint was enforced.
 * - `uncertainty_escalated`            — uncertainty posture was escalated.
 * - `human_review_requested`           — a human review was requested.
 * - `section_suppressed`               — an explanation section was suppressed.
 * - `bridge_blocking_reason_observed`  — a bridge blocking reason was observed.
 * - `pilot_gate_blocked`               — a pilot transaction was blocked by the gate.
 * - `incident_escalated`               — a governance incident was escalated.
 * - `diagnostic_enveloped`             — a diagnostic was wrapped in a namespace envelope.
 * - `attestation_validated`            — an attestation record was validated.
 * - `informational`                    — informational trace only; no blocking decision.
 */
export type AuditTraceEmissionKind =
  | "boundary_emitted"
  | "forbidden_move_applied"
  | "required_constraint_applied"
  | "uncertainty_escalated"
  | "human_review_requested"
  | "section_suppressed"
  | "bridge_blocking_reason_observed"
  | "pilot_gate_blocked"
  | "incident_escalated"
  | "diagnostic_enveloped"
  | "attestation_validated"
  | "informational";

// ── Emission severity ──────────────────────────────────────────────────────────

/**
 * The severity of an audit trace emission record.
 *
 * - `informational` — trace-only; no governance blocking.
 * - `warning`       — governance concern observed; may escalate.
 * - `blocking`      — governance decision blocked or suppressed content.
 * - `critical`      — governance breach or incident escalation.
 */
export type AuditTraceEmissionSeverity =
  | "informational"
  | "warning"
  | "blocking"
  | "critical";

// ── Emission record ────────────────────────────────────────────────────────────

/**
 * A structured record describing an audit trace emission from a governance layer.
 *
 * This is the emission-side counterpart to `AuditTraceNode`. It captures the
 * governance context (which layer, what decision, what references) in a richer
 * form before being converted to a leaner `AuditTraceNode` for chain storage.
 *
 * `emissionId`                 — opaque, unique identifier for this emission record.
 *                                Becomes `AuditTraceNode.traceId` on conversion.
 * `layer`                      — the governance layer producing this emission.
 * `emissionKind`               — the structural type of governance decision.
 * `severity`                   — informational, warning, blocking, or critical.
 * `parentTraceIds`             — trace IDs of upstream nodes that caused this decision.
 *                                Empty array for root emissions only.
 * `referencedArtifactId`       — optional: opaque ID of the governance artifact referenced.
 * `referencedDiagnosticCode`   — optional: the diagnostic code associated with this decision.
 * `referencedBoundaryId`       — optional: the explanation boundary ID enforced.
 * `referencedForbiddenMove`    — optional: the forbidden move name applied.
 * `referencedRequiredConstraint`— optional: the required constraint name enforced.
 * `neverUserVisible`           — compile-time invariant; emission records are internal only.
 * `notes`                      — optional never-user-visible governance notes.
 */
export interface AuditTraceEmissionRecord {
  readonly emissionId: string;
  readonly layer: AuditTraceEmissionLayer;
  readonly emissionKind: AuditTraceEmissionKind;
  readonly severity: AuditTraceEmissionSeverity;
  readonly parentTraceIds: readonly string[];
  readonly referencedArtifactId?: string;
  readonly referencedDiagnosticCode?: string;
  readonly referencedBoundaryId?: string;
  readonly referencedForbiddenMove?: string;
  readonly referencedRequiredConstraint?: string;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Validation diagnostic codes ────────────────────────────────────────────────

/**
 * Never-user-visible diagnostic codes emitted by `validateAuditTraceEmission`.
 *
 * - `audit_emission_missing_id`                  — `emissionId` is blank or empty.
 * - `audit_emission_unknown_layer`               — `layer` is `"unknown"`.
 * - `audit_emission_empty_parent_id`             — `parentTraceIds` contains a blank/whitespace ID.
 * - `audit_emission_user_visible_violation`      — `neverUserVisible` is not `true` at runtime.
 * - `audit_emission_missing_reference_for_blocking`— severity is `"blocking"` or `"critical"`
 *                                                    but no reference field is populated.
 * - `audit_emission_duplicate_parent_id`         — `parentTraceIds` contains duplicate IDs.
 */
export type AuditTraceEmissionValidationDiagnostic =
  | "audit_emission_missing_id"
  | "audit_emission_unknown_layer"
  | "audit_emission_empty_parent_id"
  | "audit_emission_user_visible_violation"
  | "audit_emission_missing_reference_for_blocking"
  | "audit_emission_duplicate_parent_id";

// ── Validation result ──────────────────────────────────────────────────────────

/**
 * The never-user-visible result of `validateAuditTraceEmission`.
 *
 * `valid`           — `true` if no hard structural violations exist. Hard failures:
 *                     blank `emissionId`, blank entry in `parentTraceIds`,
 *                     or `neverUserVisible !== true` at runtime.
 * `fullyConsistent` — `true` only if `valid` AND no soft diagnostics are present.
 *                     Soft diagnostics: unknown layer, duplicate parent IDs,
 *                     missing reference for blocking/critical severity.
 * `diagnostics`     — ordered list of never-user-visible diagnostic codes.
 * `neverUserVisible`— compile-time invariant.
 * `notes`           — optional never-user-visible governance notes.
 */
export interface AuditTraceEmissionValidationResult {
  readonly valid: boolean;
  readonly fullyConsistent: boolean;
  readonly diagnostics: readonly AuditTraceEmissionValidationDiagnostic[];
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}
