/**
 * Controlled Text Pilot Readiness Closure Audit types (Phase 8.2J-5).
 *
 * Defines the type system for the 8.2J epoch closure audit. The audit verifies
 * that all planning/model/protocol layers from 8.2J-0 through 8.2J-4 are present
 * and internally consistent, without enabling any runtime execution.
 *
 * This module does NOT:
 * - implement pilot runtime
 * - modify API routes or UI
 * - call any LLM
 * - persist anything
 *
 * Safety invariants on ControlledTextPilotReadinessClosureAuditResult (literal types):
 * - readyForPilotRuntimeImplementation: false
 * - readyForRuntimeExecution: false
 * - readyForPublicLaunch: false
 * - liveLLMCalled: false
 * - apiRouteModifiedByAudit: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - emittedToUserNow: false
 * - neverUserVisible: true
 *
 * readyForControlledTextPilotPlanningClosure may be true only if every layer
 * check passes and no invariant failures are found.
 */

// ── Verdict ───────────────────────────────────────────────────────────────────

export type ControlledTextPilotReadinessClosureAuditVerdict =
  | "closed_controlled_text_pilot_readiness_epoch"
  | "closed_with_warnings"
  | "blocked_missing_required_layer"
  | "blocked_scenario_set_failure"
  | "blocked_switch_plan_failure"
  | "blocked_manual_protocol_failure"
  | "blocked_evidence_model_failure"
  | "blocked_evidence_regression_failure"
  | "blocked_invariant_failure";

// ── Diagnostic codes ──────────────────────────────────────────────────────────

export type ControlledTextPilotReadinessClosureAuditDiagnosticCode =
  | "controlled_text_pilot_closure_started"
  | "controlled_text_pilot_closure_layer_inventory_completed"
  | "controlled_text_pilot_closure_required_layers_present"
  | "controlled_text_pilot_closure_readiness_plan_verified"
  | "controlled_text_pilot_closure_scenario_set_verified"
  | "controlled_text_pilot_closure_switch_plan_verified"
  | "controlled_text_pilot_closure_manual_protocol_verified"
  | "controlled_text_pilot_closure_evidence_model_verified"
  | "controlled_text_pilot_closure_evidence_regression_passed"
  | "controlled_text_pilot_closure_runtime_execution_still_disabled"
  | "controlled_text_pilot_closure_public_runtime_still_blocked"
  | "controlled_text_pilot_closure_persistence_still_blocked"
  | "controlled_text_pilot_closure_no_live_llm_in_audit"
  | "controlled_text_pilot_closure_no_api_ui_changes"
  | "controlled_text_pilot_closure_no_dna_save"
  | "controlled_text_pilot_closure_no_offline_save"
  | "controlled_text_pilot_closure_blocked_missing_required_layer"
  | "controlled_text_pilot_closure_blocked_scenario_set_failure"
  | "controlled_text_pilot_closure_blocked_switch_plan_failure"
  | "controlled_text_pilot_closure_blocked_manual_protocol_failure"
  | "controlled_text_pilot_closure_blocked_evidence_model_failure"
  | "controlled_text_pilot_closure_blocked_evidence_regression_failure"
  | "controlled_text_pilot_closure_blocked_invariant_failure"
  | "controlled_text_pilot_closure_epoch_closed";

// ── Required layers ───────────────────────────────────────────────────────────

export type ControlledTextPilotReadinessRequiredLayerId =
  | "controlled_text_pilot_readiness_plan"
  | "pilot_scenario_set"
  | "guarded_internal_pilot_runtime_switch_plan"
  | "manual_safety_test_protocol"
  | "pilot_evidence_record_model"
  | "pilot_evidence_record_regression_scaffold";

export type ControlledTextPilotReadinessLayerStatus =
  | "present"
  | "missing"
  | "warning";

export interface ControlledTextPilotReadinessLayerCheck {
  readonly layerId: ControlledTextPilotReadinessRequiredLayerId;
  readonly status: ControlledTextPilotReadinessLayerStatus;
  readonly phase: string;
  readonly notes: readonly string[];
  readonly neverUserVisible: true;
}

// ── Open items ────────────────────────────────────────────────────────────────

export type ControlledTextPilotReadinessOpenItemSeverity =
  | "blocker"
  | "warning"
  | "future_epoch";

export interface ControlledTextPilotReadinessOpenItem {
  readonly itemId: string;
  readonly severity: ControlledTextPilotReadinessOpenItemSeverity;
  readonly title: string;
  readonly recommendation: string;
  readonly blocksEpochClosure: boolean;
  readonly blocksPublicLaunch: boolean;
  readonly neverUserVisible: true;
}

// ── Input / Result ────────────────────────────────────────────────────────────

export interface ControlledTextPilotReadinessClosureAuditInput {
  readonly auditRunId: string;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

/**
 * The result of the 8.2J closure audit.
 *
 * `readyForControlledTextPilotPlanningClosure` becomes true only when all six
 * layer checks pass and no invariant violations are found.
 *
 * All runtime-enabling and persistence-enabling flags are literal `false`.
 * `nextRecommendedPhase` points to 8.2K-0 (guarded internal pilot runtime
 * implementation planning — not public launch).
 */
export interface ControlledTextPilotReadinessClosureAuditResult {
  readonly auditRunId: string;
  readonly verdict: ControlledTextPilotReadinessClosureAuditVerdict;
  readonly diagnostics: readonly ControlledTextPilotReadinessClosureAuditDiagnosticCode[];
  readonly layerChecks: readonly ControlledTextPilotReadinessLayerCheck[];
  readonly openItems: readonly ControlledTextPilotReadinessOpenItem[];

  readonly readinessPlanVerified: boolean;
  readonly scenarioSetVerified: boolean;
  readonly switchPlanVerified: boolean;
  readonly manualProtocolVerified: boolean;
  readonly evidenceModelVerified: boolean;
  readonly evidenceRegressionPassed: boolean;

  readonly readyForControlledTextPilotPlanningClosure: boolean;
  readonly readyForPilotRuntimeImplementation: false;
  readonly readyForRuntimeExecution: false;
  readonly readyForPublicLaunch: false;

  readonly liveLLMCalled: false;
  readonly apiRouteModifiedByAudit: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;

  readonly nextRecommendedPhase: string;
  readonly notes?: readonly string[];
}
