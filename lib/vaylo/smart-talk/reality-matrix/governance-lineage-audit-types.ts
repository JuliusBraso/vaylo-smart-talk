/**
 * Governance Lineage Integration Audit types (Phase 8.2F-15).
 *
 * Metadata-only audit vocabulary for cross-layer governance lineage review
 * spanning the entire 8.2A → 8.2F-14 stack.
 *
 * Safety guarantees:
 * - no runtime coupling
 * - no telemetry
 * - no persistence
 * - no logging
 * - all results carry neverUserVisible: true
 */

// ── Layer identity ────────────────────────────────────────────────────────────

/**
 * Identifiers for every discrete governance layer in the
 * Vaylo Document Reasoning Constitution V1 stack.
 *
 * Ordered roughly from upstream (constitution) to downstream (provenance).
 */
export type GovernanceLayerId =
  | "constitution"
  | "reality_matrix"
  | "evidence_gates"
  | "simulation"
  | "explanation_contract"
  | "free_preview_mapper"
  | "paid_mapper"
  | "smart_talk_bridge"
  | "wording_review"
  | "wording_evaluation"
  | "ocr_uncertainty"
  | "redacted_corpus"
  | "pilot_gate"
  | "incident_governance"
  | "provenance_audit";

// ── Lineage status ────────────────────────────────────────────────────────────

/**
 * The governance lineage connectivity status for a layer or the overall stack.
 *
 * - `connected`              — layer is structurally connected to adjacent layers
 *                              with documented data flow in both directions.
 * - `partially_connected`    — layer has some structural connections but critical
 *                              gaps, missing wiring, or future-phase dependencies
 *                              exist.
 * - `disconnected`           — layer has no verified structural connection to the
 *                              rest of the governance pipeline.
 * - `future_phase_required`  — layer concept exists but no concrete scaffold or
 *                              implementation has been built yet.
 */
export type GovernanceLineageStatus =
  | "connected"
  | "partially_connected"
  | "disconnected"
  | "future_phase_required";

// ── Finding severity ──────────────────────────────────────────────────────────

/**
 * The operational significance of a governance audit finding.
 *
 * - `informational` — documents a verified connection or architectural fact;
 *                     no action required.
 * - `warning`       — identifies a technical debt, partial connection, or
 *                     architectural gap that should be addressed before production.
 * - `critical`      — identifies a production blocker, a disconnected safeguard,
 *                     or an unresolved risk that must be resolved before any
 *                     real-user deployment.
 */
export type GovernanceAuditFindingSeverity =
  | "informational"
  | "warning"
  | "critical";

// ── Finding ───────────────────────────────────────────────────────────────────

/**
 * A single never-user-visible governance audit finding.
 *
 * `layerId`     — the primary governance layer this finding concerns.
 * `severity`    — operational significance.
 * `title`       — short never-user-visible label for the finding.
 * `description` — internal governance detail; never user-visible.
 * `neverUserVisible` — compile-time invariant.
 */
export interface GovernanceAuditFinding {
  readonly layerId: GovernanceLayerId;
  readonly severity: GovernanceAuditFindingSeverity;
  readonly title: string;
  readonly description: string;
  readonly neverUserVisible: true;
}

// ── Audit result ──────────────────────────────────────────────────────────────

/**
 * The never-user-visible result of `runGovernanceLineageAuditScaffold`.
 *
 * `overallStatus`       — the aggregate lineage connectivity status of the
 *                         entire 8.2A → 8.2F-14 stack.
 * `findings`            — ordered list of never-user-visible audit findings.
 * `criticalFindingCount`— count of findings with severity "critical".
 * `warningFindingCount` — count of findings with severity "warning".
 * `neverUserVisible`    — compile-time invariant.
 */
export interface GovernanceLineageAuditResult {
  readonly overallStatus: GovernanceLineageStatus;
  readonly findings: readonly GovernanceAuditFinding[];
  readonly criticalFindingCount: number;
  readonly warningFindingCount: number;
  readonly neverUserVisible: true;
}
