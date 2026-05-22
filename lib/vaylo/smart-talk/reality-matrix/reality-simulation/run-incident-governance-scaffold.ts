/**
 * Incident Governance & Kill Switch evaluator (Phase 8.2F-13).
 *
 * Implements `runIncidentGovernanceScaffold` — a pure function that classifies
 * governance incidents and recommends escalation posture based on structural
 * metadata only.
 *
 * Disposition rules (evaluated in severity order, highest wins):
 *  1. `severity === "critical"` OR `possibleUserHarm === true`
 *       → `emergency_stop_recommended`; pilotShouldPause = true
 *  2. `severity === "high"` AND `governanceCompromised === true`
 *       → `restricted_mode`
 *  3. `severity === "medium"` OR `affectsUserTrust` OR `affectsPilotSafety`
 *       OR (`severity === "high"` without governance compromise)
 *       OR (`severity === "low"` with governance compromise)
 *       → `human_review_required`
 *  4. Default → `monitoring_only`
 *
 * Category-specific diagnostics (emitted alongside disposition diagnostics):
 *  - `false_reassurance_risk`         → incident_false_reassurance_detected
 *  - `hallucinated_deadline_risk`     → incident_deadline_hallucination_risk
 *  - `hallucinated_enforcement_risk`  → incident_enforcement_hallucination_risk
 *  - `OCR_uncertainty_failure`        → incident_ocr_failure_detected
 *  - `privacy_risk`                   → incident_privacy_risk_detected
 *  - `wording_safety_violation` (≥ medium severity)
 *                                     → incident_panic_amplification_detected
 *
 * Governance breach rule:
 *  - `governanceCompromised === true` OR `category === "governance_breach"`
 *       → always emit `incident_governance_breach_detected`
 *
 * IMPORTANT: No real kill switch exists. No runtime shutdown is implemented.
 * All dispositions are governance recommendations modeled in metadata only.
 *
 * Safety guarantees:
 * - no real kill switch
 * - no runtime shutdown
 * - no production Smart Talk connection
 * - no OCR SDK or LLM calls
 * - no database writes
 * - no deployment or environment configuration changes
 * - all results carry neverUserVisible: true
 */

import type {
  IncidentDiagnosticCode,
  IncidentGovernanceInput,
  IncidentGovernanceResult,
  KillSwitchDisposition,
} from "./incident-governance-types";

export const INCIDENT_GOVERNANCE_SCAFFOLD_VERSION =
  "8.2f-13-incident-governance-scaffold-v1";

const SAFETY_NOTE =
  "Governance scaffold only: no kill switch implemented, no runtime shutdown, " +
  "no production Smart Talk wiring, no OCR SDK, no LLM.";

// ── Disposition logic ─────────────────────────────────────────────────────────

function determineDisposition(
  input: IncidentGovernanceInput,
): KillSwitchDisposition {
  // Rule 1: Emergency stop — highest priority.
  if (input.severity === "critical" || input.possibleUserHarm) {
    return "emergency_stop_recommended";
  }
  // Rule 2: Restricted mode — high severity with governance breach.
  if (input.severity === "high" && input.governanceCompromised) {
    return "restricted_mode";
  }
  // Rule 3: Human review — medium severity, trust/safety impact, high without
  // governance compromise, or low severity but governance already compromised.
  if (
    input.severity === "medium" ||
    input.affectsUserTrust ||
    input.affectsPilotSafety ||
    input.severity === "high" ||
    input.governanceCompromised
  ) {
    return "human_review_required";
  }
  // Rule 4: Monitoring only — low severity, no governance compromise.
  return "monitoring_only";
}

// ── Main function ─────────────────────────────────────────────────────────────

/**
 * Evaluates a governance incident and returns a never-user-visible
 * `IncidentGovernanceResult` with disposition, diagnostics, and escalation flags.
 *
 * Pure function — no side effects, no DB, no auth, no OCR SDK, no LLM.
 */
export function runIncidentGovernanceScaffold(
  input: IncidentGovernanceInput,
): IncidentGovernanceResult {
  const diagnostics: IncidentDiagnosticCode[] = [];
  const notes: string[] = [];

  const disposition = determineDisposition(input);

  // ── Disposition-level diagnostics ────────────────────────────────────────

  if (disposition === "emergency_stop_recommended") {
    diagnostics.push("incident_kill_switch_recommended");
    notes.push(
      `Emergency stop recommended for incident "${input.incidentId}". ` +
        `severity="${input.severity}", possibleUserHarm=${String(input.possibleUserHarm)}.`,
    );
  }
  if (disposition === "restricted_mode") {
    diagnostics.push("incident_restricted_mode_required");
    notes.push(
      `Restricted mode recommended for incident "${input.incidentId}". ` +
        `severity="high", governanceCompromised=true.`,
    );
  }
  if (
    disposition === "human_review_required" ||
    disposition === "restricted_mode" ||
    disposition === "emergency_stop_recommended"
  ) {
    diagnostics.push("incident_requires_human_escalation");
  }

  // ── Governance breach rule ────────────────────────────────────────────────
  // Always emitted when governance is compromised or category is breach.

  const effectiveGovernanceCompromised =
    input.governanceCompromised || input.category === "governance_breach";

  if (effectiveGovernanceCompromised) {
    if (!diagnostics.includes("incident_governance_breach_detected")) {
      diagnostics.push("incident_governance_breach_detected");
    }
    notes.push(
      `Governance breach detected for incident "${input.incidentId}".`,
    );
  }

  // ── Category-specific diagnostics ────────────────────────────────────────

  switch (input.category) {
    case "false_reassurance_risk":
      diagnostics.push("incident_false_reassurance_detected");
      notes.push("Category: false_reassurance_risk — false reassurance diagnostic emitted.");
      break;

    case "hallucinated_deadline_risk":
      diagnostics.push("incident_deadline_hallucination_risk");
      notes.push("Category: hallucinated_deadline_risk — deadline hallucination diagnostic emitted.");
      break;

    case "hallucinated_enforcement_risk":
      diagnostics.push("incident_enforcement_hallucination_risk");
      notes.push("Category: hallucinated_enforcement_risk — enforcement hallucination diagnostic emitted.");
      break;

    case "OCR_uncertainty_failure":
      diagnostics.push("incident_ocr_failure_detected");
      notes.push("Category: OCR_uncertainty_failure — OCR failure diagnostic emitted.");
      break;

    case "privacy_risk":
      diagnostics.push("incident_privacy_risk_detected");
      notes.push("Category: privacy_risk — privacy risk diagnostic emitted.");
      break;

    case "wording_safety_violation":
      // Panic amplification is a key sub-concern of wording safety violations
      // at medium severity or above.
      if (input.severity === "medium" || input.severity === "high" || input.severity === "critical") {
        diagnostics.push("incident_panic_amplification_detected");
        notes.push(
          "Category: wording_safety_violation — panic amplification diagnostic emitted " +
            `(severity="${input.severity}").`,
        );
      }
      break;

    default:
      // governance_breach, pilot_operational_risk, unknown_runtime_condition:
      // covered by governance breach rule and disposition diagnostics above.
      break;
  }

  // ── Derived flags ─────────────────────────────────────────────────────────

  const escalationRequired = disposition !== "monitoring_only";

  const pilotShouldPause =
    disposition === "emergency_stop_recommended" ||
    (input.affectsPilotSafety && disposition === "restricted_mode");

  // ── Summary note ──────────────────────────────────────────────────────────

  notes.push(
    `Incident "${input.incidentId}": disposition="${disposition}", ` +
      `escalationRequired=${String(escalationRequired)}, ` +
      `pilotShouldPause=${String(pilotShouldPause)}, ` +
      `diagnostics=[${diagnostics.join(", ")}].`,
  );
  notes.push(SAFETY_NOTE);

  return {
    disposition,
    diagnostics,
    escalationRequired,
    pilotShouldPause,
    governanceCompromised: effectiveGovernanceCompromised,
    neverUserVisible: true,
    notes,
  };
}
