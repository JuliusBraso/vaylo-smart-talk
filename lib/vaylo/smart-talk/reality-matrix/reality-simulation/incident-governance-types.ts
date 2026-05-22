/**
 * Incident Governance & Kill Switch Scaffold types (Phase 8.2F-13).
 *
 * Metadata-only governance type model for future incident handling and
 * emergency kill-switch control. No real kill switch exists. No runtime
 * shutdown capability is implemented here.
 *
 * Safety guarantees:
 * - no real kill switch implemented
 * - no runtime shutdown capability
 * - no production Smart Talk connection
 * - no OCR SDK or LLM calls
 * - no database writes
 * - no deployment configuration changes
 * - no environment variable modification
 * - all results carry neverUserVisible: true
 */

// ── Incident classification ───────────────────────────────────────────────────

/**
 * Structural severity level of a governance incident.
 *
 * - `low`: anomaly observed; no immediate action required beyond monitoring.
 * - `medium`: pattern requires human review before next cognition step.
 * - `high`: governance boundary breach; restricted operating mode recommended.
 * - `critical`: possible user harm or systemic safety failure; emergency stop
 *   recommended and pilot should pause.
 */
export type IncidentSeverity = "low" | "medium" | "high" | "critical";

/**
 * The governance domain in which the incident was observed.
 */
export type IncidentCategory =
  | "governance_breach"
  | "wording_safety_violation"
  | "OCR_uncertainty_failure"
  | "false_reassurance_risk"
  | "hallucinated_deadline_risk"
  | "hallucinated_enforcement_risk"
  | "privacy_risk"
  | "pilot_operational_risk"
  | "unknown_runtime_condition";

/**
 * The source layer in the cognition pipeline where the incident was detected.
 */
export type IncidentSourceLayer =
  | "OCR"
  | "mapper"
  | "bridge"
  | "wording_review"
  | "pilot_gate"
  | "manual_report";

// ── Disposition ───────────────────────────────────────────────────────────────

/**
 * The structural governance posture recommended in response to this incident.
 *
 * - `monitoring_only`: low-severity anomaly; log and monitor, no action required.
 * - `human_review_required`: a human must review before cognition continues.
 * - `restricted_mode`: cognition pipeline should enter restricted operating mode;
 *   no new pilot transactions until reviewed.
 * - `emergency_stop_recommended`: possible user harm detected; full pilot pause
 *   and emergency escalation recommended.
 *
 * IMPORTANT: These dispositions are governance recommendations only. No real
 * kill switch, runtime flag, or shutdown mechanism exists in Phase 8.2F-13.
 */
export type KillSwitchDisposition =
  | "monitoring_only"
  | "human_review_required"
  | "restricted_mode"
  | "emergency_stop_recommended";

// ── Diagnostic codes ──────────────────────────────────────────────────────────

/**
 * Never-user-visible governance diagnostic codes emitted by
 * `runIncidentGovernanceScaffold`.
 */
export type IncidentDiagnosticCode =
  | "incident_governance_breach_detected"
  | "incident_false_reassurance_detected"
  | "incident_panic_amplification_detected"
  | "incident_deadline_hallucination_risk"
  | "incident_enforcement_hallucination_risk"
  | "incident_privacy_risk_detected"
  | "incident_ocr_failure_detected"
  | "incident_kill_switch_recommended"
  | "incident_requires_human_escalation"
  | "incident_restricted_mode_required";

// ── Input ─────────────────────────────────────────────────────────────────────

/**
 * Structural metadata describing a governance incident.
 *
 * `incidentId`: opaque stable identifier for audit tracing.
 * `category`: the domain in which the incident was observed.
 * `severity`: structural severity classification.
 * `sourceLayer`: the pipeline layer that detected or reported the incident.
 * `governanceCompromised`: `true` if the cognition pipeline's governance
 *   constraints were breached or bypassed.
 * `affectsPilotSafety`: `true` if the incident directly threatens pilot
 *   operational safety.
 * `affectsUserTrust`: `true` if the incident could undermine user trust in
 *   the explanation output.
 * `possibleUserHarm`: `true` if the incident carries a risk of direct user harm
 *   (e.g. acting on false legal advice, missing a real deadline).
 */
export interface IncidentGovernanceInput {
  readonly incidentId: string;
  readonly category: IncidentCategory;
  readonly severity: IncidentSeverity;
  readonly sourceLayer: IncidentSourceLayer;
  readonly governanceCompromised: boolean;
  readonly affectsPilotSafety: boolean;
  readonly affectsUserTrust: boolean;
  readonly possibleUserHarm: boolean;
}

// ── Result ────────────────────────────────────────────────────────────────────

/**
 * The never-user-visible output of `runIncidentGovernanceScaffold`.
 *
 * `disposition`: the governance posture recommended for this incident.
 * `diagnostics`: ordered list of never-user-visible diagnostic codes.
 * `escalationRequired`: `true` when disposition is `human_review_required` or
 *   higher severity.
 * `pilotShouldPause`: `true` when an emergency stop is recommended or when
 *   pilot safety is affected at `restricted_mode` level or above.
 * `governanceCompromised`: reflects input, with `true` also forced for
 *   `governance_breach` category incidents.
 * `neverUserVisible`: compile-time invariant.
 * `notes`: internal governance notes — never user-visible.
 */
export interface IncidentGovernanceResult {
  readonly disposition: KillSwitchDisposition;
  readonly diagnostics: readonly IncidentDiagnosticCode[];
  readonly escalationRequired: boolean;
  readonly pilotShouldPause: boolean;
  readonly governanceCompromised: boolean;
  readonly neverUserVisible: true;
  readonly notes: readonly string[];
}
