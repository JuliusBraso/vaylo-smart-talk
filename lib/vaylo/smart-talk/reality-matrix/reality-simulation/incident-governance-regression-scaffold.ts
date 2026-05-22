/**
 * Incident Governance regression scaffold (Phase 8.2F-13).
 *
 * Eight structural cases exercising runIncidentGovernanceScaffold:
 *
 *  Case 1 — low severity, no compromise         → monitoring_only
 *  Case 2 — medium + user trust impact          → human_review_required
 *  Case 3 — high + governance breach            → restricted_mode
 *  Case 4 — OCR uncertainty failure escalation  → human_review_required + ocr diagnostic
 *  Case 5 — false reassurance risk              → human_review_required + false_reassurance diagnostic
 *  Case 6 — hallucinated deadline risk          → human_review_required + deadline diagnostic
 *  Case 7 — privacy risk critical               → emergency_stop_recommended + pilotShouldPause
 *  Case 8 — critical possible user harm         → emergency_stop_recommended + pilotShouldPause + kill switch
 *
 * No Jest/Vitest. No CI hook. No runtime integration.
 * No kill switch activated. No LLM. No OCR SDK. No Smart Talk wiring.
 */

import type {
  IncidentDiagnosticCode,
  IncidentGovernanceInput,
  IncidentGovernanceResult,
  KillSwitchDisposition,
} from "./incident-governance-types";
import {
  INCIDENT_GOVERNANCE_SCAFFOLD_VERSION,
  runIncidentGovernanceScaffold,
} from "./run-incident-governance-scaffold";

export const INCIDENT_GOVERNANCE_REGRESSION_VERSION =
  "8.2f-13-incident-governance-regression-scaffold-v1";

// ── Result types ──────────────────────────────────────────────────────────────

export interface IncidentGovernanceRegressionCaseResult {
  readonly caseName: string;
  readonly passed: boolean;
  readonly governanceResult: IncidentGovernanceResult;
  readonly failures: readonly string[];
  readonly notes: readonly string[];
}

export interface IncidentGovernanceRegressionScaffoldResult {
  readonly scaffoldVersion: string;
  readonly evaluatorVersion: string;
  readonly allPassed: boolean;
  readonly caseResults: readonly IncidentGovernanceRegressionCaseResult[];
  readonly notes: readonly string[];
}

// ── Fixture helper ────────────────────────────────────────────────────────────

function makeInput(
  overrides: Partial<IncidentGovernanceInput> &
    Pick<IncidentGovernanceInput, "incidentId" | "category" | "severity">,
): IncidentGovernanceInput {
  return {
    sourceLayer: "manual_report",
    governanceCompromised: false,
    affectsPilotSafety: false,
    affectsUserTrust: false,
    possibleUserHarm: false,
    ...overrides,
  };
}

// ── Assertion helper ──────────────────────────────────────────────────────────

function assertGovernance(
  caseName: string,
  result: IncidentGovernanceResult,
  opts: {
    expectDisposition: KillSwitchDisposition;
    expectEscalationRequired: boolean;
    expectPilotShouldPause: boolean;
    expectGovernanceCompromised?: boolean;
    expectDiagnostics?: readonly IncidentDiagnosticCode[];
    expectNoDiagnostics?: readonly IncidentDiagnosticCode[];
  },
): IncidentGovernanceRegressionCaseResult {
  const failures: string[] = [];

  if (result.disposition !== opts.expectDisposition) {
    failures.push(
      `disposition: expected="${opts.expectDisposition}", got="${result.disposition}"`,
    );
  }
  if (result.escalationRequired !== opts.expectEscalationRequired) {
    failures.push(
      `escalationRequired: expected=${String(opts.expectEscalationRequired)}, got=${String(result.escalationRequired)}`,
    );
  }
  if (result.pilotShouldPause !== opts.expectPilotShouldPause) {
    failures.push(
      `pilotShouldPause: expected=${String(opts.expectPilotShouldPause)}, got=${String(result.pilotShouldPause)}`,
    );
  }
  if (
    opts.expectGovernanceCompromised !== undefined &&
    result.governanceCompromised !== opts.expectGovernanceCompromised
  ) {
    failures.push(
      `governanceCompromised: expected=${String(opts.expectGovernanceCompromised)}, got=${String(result.governanceCompromised)}`,
    );
  }
  for (const code of opts.expectDiagnostics ?? []) {
    if (!result.diagnostics.includes(code)) {
      failures.push(`Expected diagnostic "${code}" not in result.diagnostics`);
    }
  }
  for (const code of opts.expectNoDiagnostics ?? []) {
    if (result.diagnostics.includes(code)) {
      failures.push(`Diagnostic "${code}" must NOT be in result.diagnostics`);
    }
  }
  if (!result.neverUserVisible) {
    failures.push("neverUserVisible must be true on governance result");
  }

  const passed = failures.length === 0;
  return {
    caseName,
    passed,
    governanceResult: result,
    failures,
    notes: [
      passed
        ? `Case "${caseName}" passed.`
        : `Case "${caseName}" failed with ${String(failures.length)} failure(s).`,
    ],
  };
}

// ── Case 1 — low severity, no compromise → monitoring_only ───────────────────

function runCase1(): IncidentGovernanceRegressionCaseResult {
  return assertGovernance(
    "low_severity_no_compromise_monitoring_only",
    runIncidentGovernanceScaffold(
      makeInput({
        incidentId: "regression-incident-001",
        category: "unknown_runtime_condition",
        severity: "low",
      }),
    ),
    {
      expectDisposition: "monitoring_only",
      expectEscalationRequired: false,
      expectPilotShouldPause: false,
      expectGovernanceCompromised: false,
      expectNoDiagnostics: [
        "incident_kill_switch_recommended",
        "incident_governance_breach_detected",
        "incident_restricted_mode_required",
      ],
    },
  );
}

// ── Case 2 — medium severity + user trust impact → human_review_required ─────

function runCase2(): IncidentGovernanceRegressionCaseResult {
  return assertGovernance(
    "medium_trust_impact_human_review",
    runIncidentGovernanceScaffold(
      makeInput({
        incidentId: "regression-incident-002",
        category: "pilot_operational_risk",
        severity: "medium",
        affectsUserTrust: true,
      }),
    ),
    {
      expectDisposition: "human_review_required",
      expectEscalationRequired: true,
      expectPilotShouldPause: false,
      expectGovernanceCompromised: false,
      expectDiagnostics: ["incident_requires_human_escalation"],
      expectNoDiagnostics: [
        "incident_kill_switch_recommended",
        "incident_restricted_mode_required",
        "incident_governance_breach_detected",
      ],
    },
  );
}

// ── Case 3 — high severity + governance breach → restricted_mode ──────────────

function runCase3(): IncidentGovernanceRegressionCaseResult {
  return assertGovernance(
    "high_governance_breach_restricted_mode",
    runIncidentGovernanceScaffold(
      makeInput({
        incidentId: "regression-incident-003",
        category: "governance_breach",
        severity: "high",
        governanceCompromised: true,
      }),
    ),
    {
      expectDisposition: "restricted_mode",
      expectEscalationRequired: true,
      expectPilotShouldPause: false,
      expectGovernanceCompromised: true,
      expectDiagnostics: [
        "incident_restricted_mode_required",
        "incident_requires_human_escalation",
        "incident_governance_breach_detected",
      ],
      expectNoDiagnostics: ["incident_kill_switch_recommended"],
    },
  );
}

// ── Case 4 — OCR uncertainty failure → human_review + ocr diagnostic ──────────

function runCase4(): IncidentGovernanceRegressionCaseResult {
  return assertGovernance(
    "ocr_uncertainty_failure_escalation",
    runIncidentGovernanceScaffold(
      makeInput({
        incidentId: "regression-incident-004",
        category: "OCR_uncertainty_failure",
        severity: "medium",
        sourceLayer: "OCR",
      }),
    ),
    {
      expectDisposition: "human_review_required",
      expectEscalationRequired: true,
      expectPilotShouldPause: false,
      expectDiagnostics: [
        "incident_requires_human_escalation",
        "incident_ocr_failure_detected",
      ],
      expectNoDiagnostics: [
        "incident_kill_switch_recommended",
        "incident_governance_breach_detected",
      ],
    },
  );
}

// ── Case 5 — false reassurance risk escalation ────────────────────────────────

function runCase5(): IncidentGovernanceRegressionCaseResult {
  return assertGovernance(
    "false_reassurance_risk_escalation",
    runIncidentGovernanceScaffold(
      makeInput({
        incidentId: "regression-incident-005",
        category: "false_reassurance_risk",
        severity: "high",
        affectsUserTrust: true,
        sourceLayer: "mapper",
      }),
    ),
    {
      expectDisposition: "human_review_required",
      expectEscalationRequired: true,
      expectPilotShouldPause: false,
      expectDiagnostics: [
        "incident_requires_human_escalation",
        "incident_false_reassurance_detected",
      ],
      expectNoDiagnostics: [
        "incident_kill_switch_recommended",
        "incident_restricted_mode_required",
      ],
    },
  );
}

// ── Case 6 — hallucinated deadline risk ──────────────────────────────────────

function runCase6(): IncidentGovernanceRegressionCaseResult {
  return assertGovernance(
    "hallucinated_deadline_risk_escalation",
    runIncidentGovernanceScaffold(
      makeInput({
        incidentId: "regression-incident-006",
        category: "hallucinated_deadline_risk",
        severity: "medium",
        sourceLayer: "bridge",
      }),
    ),
    {
      expectDisposition: "human_review_required",
      expectEscalationRequired: true,
      expectPilotShouldPause: false,
      expectDiagnostics: [
        "incident_requires_human_escalation",
        "incident_deadline_hallucination_risk",
      ],
      expectNoDiagnostics: ["incident_kill_switch_recommended"],
    },
  );
}

// ── Case 7 — privacy risk critical → emergency stop ──────────────────────────

function runCase7(): IncidentGovernanceRegressionCaseResult {
  return assertGovernance(
    "privacy_risk_critical_emergency_stop",
    runIncidentGovernanceScaffold(
      makeInput({
        incidentId: "regression-incident-007",
        category: "privacy_risk",
        severity: "critical",
        affectsPilotSafety: true,
        sourceLayer: "pilot_gate",
      }),
    ),
    {
      expectDisposition: "emergency_stop_recommended",
      expectEscalationRequired: true,
      expectPilotShouldPause: true,
      expectDiagnostics: [
        "incident_kill_switch_recommended",
        "incident_requires_human_escalation",
        "incident_privacy_risk_detected",
      ],
      expectNoDiagnostics: ["incident_restricted_mode_required"],
    },
  );
}

// ── Case 8 — critical possible user harm → emergency stop + kill switch ────────

function runCase8(): IncidentGovernanceRegressionCaseResult {
  return assertGovernance(
    "critical_possible_user_harm_emergency_stop",
    runIncidentGovernanceScaffold(
      makeInput({
        incidentId: "regression-incident-008",
        category: "hallucinated_enforcement_risk",
        severity: "critical",
        possibleUserHarm: true,
        governanceCompromised: true,
        affectsUserTrust: true,
        affectsPilotSafety: true,
        sourceLayer: "wording_review",
      }),
    ),
    {
      expectDisposition: "emergency_stop_recommended",
      expectEscalationRequired: true,
      expectPilotShouldPause: true,
      expectGovernanceCompromised: true,
      expectDiagnostics: [
        "incident_kill_switch_recommended",
        "incident_requires_human_escalation",
        "incident_governance_breach_detected",
        "incident_enforcement_hallucination_risk",
      ],
    },
  );
}

// ── Scaffold runner ───────────────────────────────────────────────────────────

/**
 * Runs all 8 incident governance regression cases and aggregates results.
 *
 * Does not throw. All assertions collected as failure strings.
 * No kill switch activated. No LLM. No OCR SDK. No Smart Talk runtime.
 */
export function runIncidentGovernanceRegressionScaffold(): IncidentGovernanceRegressionScaffoldResult {
  const caseResults: IncidentGovernanceRegressionCaseResult[] = [
    runCase1(),
    runCase2(),
    runCase3(),
    runCase4(),
    runCase5(),
    runCase6(),
    runCase7(),
    runCase8(),
  ];

  const allPassed = caseResults.every((r) => r.passed);
  const passCount = caseResults.filter((r) => r.passed).length;
  const failCount = caseResults.length - passCount;

  const notes: string[] = [
    `Incident governance regression scaffold complete. ${String(passCount)}/${String(caseResults.length)} cases passed.`,
  ];

  if (allPassed) {
    notes.push(
      "All severity escalation rules, category-specific diagnostics, governance breach detection, " +
        "kill-switch recommendations, and neverUserVisible invariants validated.",
    );
  } else {
    notes.push(
      `${String(failCount)} case(s) failed — review governanceResult diagnostics for details.`,
    );
  }

  notes.push(
    "Scaffold is metadata-only: no kill switch activated, no runtime shutdown, " +
      "no LLM called, no OCR SDK, no Smart Talk production wiring.",
  );

  return {
    scaffoldVersion: INCIDENT_GOVERNANCE_REGRESSION_VERSION,
    evaluatorVersion: INCIDENT_GOVERNANCE_SCAFFOLD_VERSION,
    allPassed,
    caseResults,
    notes,
  };
}
