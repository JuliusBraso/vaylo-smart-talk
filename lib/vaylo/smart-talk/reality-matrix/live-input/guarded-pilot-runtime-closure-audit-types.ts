/**
 * Guarded Pilot Runtime Closure Audit Types (Phase 8.2K-5).
 *
 * Defines the type system for the formal closure audit of the 8.2K
 * Guarded Internal Pilot Runtime epoch.
 *
 * This module does NOT:
 * - implement the runtime
 * - modify API routes
 * - touch UI
 * - call any LLM
 * - persist anything
 * - enable public runtime
 * - process actual user input
 *
 * Safety invariants (literal types on result):
 * - readyForPublicLaunch: false
 * - readyForLiveLLMRuntime: false
 * - readyForPersistence: false
 * - readyForPhotoOcrRuntime: false
 * - readyForPaymentRuntime: false
 * - liveLLMCalled: false
 * - apiRouteModifiedByClosureAudit: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - emittedToUserNow: false
 * - neverUserVisible: true
 */

// ── Verdict ───────────────────────────────────────────────────────────────────

/**
 * The top-level verdict of the closure audit.
 *
 * - closed_with_warnings: all required layers present and passed; open items
 *   acknowledged; readyForControlledPilotExecution may be true.
 * - blocked: one or more required layers missing or failed; the epoch may not
 *   advance.
 */
export type GuardedPilotRuntimeClosureVerdict =
  | "closed_with_warnings"
  | "blocked";

// ── Layer IDs ─────────────────────────────────────────────────────────────────

/**
 * Identifies each audited layer within the 8.2K epoch.
 */
export type GuardedPilotRuntimeClosureLayerId =
  | "phase_8_2k_0_implementation_plan"
  | "phase_8_2k_1_guard_contracts"
  | "phase_8_2k_2_api_branch"
  | "phase_8_2k_3_e2e_harness"
  | "phase_8_2k_4_evidence_validation_integration";

// ── Open items ────────────────────────────────────────────────────────────────

/**
 * Acknowledged open items that must be resolved in future epochs.
 * These items do NOT block the closure verdict but are required to be
 * listed explicitly so no capability is silently assumed ready.
 */
export type GuardedPilotRuntimeClosureOpenItem =
  | "live_llm_runtime_still_blocked"
  | "public_runtime_still_blocked"
  | "persistence_still_blocked"
  | "photo_ocr_runtime_still_blocked"
  | "payment_runtime_still_blocked"
  | "multilingual_runtime_still_blocked"
  | "production_monitoring_still_missing"
  | "real_pilot_environment_variables_not_verified_by_static_audit"
  | "manual_pilot_execution_not_yet_started"
  | "production_abuse_controls_not_yet_finalized";

// ── Blockers ──────────────────────────────────────────────────────────────────

/**
 * Hard blockers that prevent the epoch from being closed.
 * Any blocker sets verdict to "blocked" and
 * readyForControlledPilotExecution to false.
 */
export type GuardedPilotRuntimeClosureBlocker =
  | "missing_implementation_plan"
  | "missing_guard_contracts"
  | "missing_api_branch"
  | "missing_e2e_harness"
  | "missing_evidence_validation_integration"
  | "e2e_harness_failed"
  | "evidence_validation_integration_failed"
  | "public_runtime_enabled"
  | "live_llm_enabled"
  | "persistence_enabled"
  | "user_visible_output_enabled"
  | "raw_text_leak_detected"
  | "secret_leak_detected"
  | "api_route_modified_by_closure_audit"
  | "closure_audit_side_effect_detected";

// ── Layer result ──────────────────────────────────────────────────────────────

/**
 * Result for a single audited 8.2K layer.
 */
export interface GuardedPilotRuntimeClosureLayerResult {
  readonly layerId: GuardedPilotRuntimeClosureLayerId;
  readonly present: boolean;
  readonly passed: boolean;
  readonly notes: readonly string[];
}

// ── Audit result ──────────────────────────────────────────────────────────────

/**
 * The complete closure audit result for the 8.2K epoch.
 *
 * `readyForControlledPilotExecution` is the only readiness flag that may be
 * true. It signals that a guarded internal controlled pilot execution phase
 * may be attempted in a subsequent epoch — with operator-configured
 * environment variables, manual review, and explicit guards only.
 *
 * All other readiness flags are literal false and cannot be changed here.
 *
 * All safety invariant flags are literal false/true and cannot be changed.
 */
export interface GuardedPilotRuntimeClosureAuditResult {
  readonly auditId: "8.2K-5";
  readonly auditVersion: "guarded-pilot-runtime-closure-audit-v1";
  readonly verdict: GuardedPilotRuntimeClosureVerdict;

  readonly layerResults: readonly GuardedPilotRuntimeClosureLayerResult[];
  readonly blockers: readonly GuardedPilotRuntimeClosureBlocker[];
  readonly openItems: readonly GuardedPilotRuntimeClosureOpenItem[];

  readonly implementationPlanPresent: boolean;
  readonly guardContractsPresent: boolean;
  readonly apiBranchPresent: boolean;
  readonly e2eHarnessPresent: boolean;
  readonly evidenceValidationIntegrationPresent: boolean;

  readonly e2eHarnessPassed: boolean;
  readonly evidenceValidationIntegrationPassed: boolean;

  /**
   * True only when all 5 layers pass and blockers is empty.
   * This does NOT enable public launch, live LLM, or persistence.
   * It only permits planning/attempting the next guarded internal
   * controlled pilot execution phase with operator configuration.
   */
  readonly readyForControlledPilotExecution: boolean;

  readonly readyForPublicLaunch: false;
  readonly readyForLiveLLMRuntime: false;
  readonly readyForPersistence: false;
  readonly readyForPhotoOcrRuntime: false;
  readonly readyForPaymentRuntime: false;

  readonly liveLLMCalled: false;
  readonly apiRouteModifiedByClosureAudit: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;
}
