/**
 * Controlled Live Input Closure Audit types (Phase 8.2H-6).
 *
 * Defines the type model for the formal closure audit of the 8.2H Controlled
 * Live Input epoch. The audit verifies that:
 *
 *   - All 8.2H required layers are present (static inventory).
 *   - The E2E harness (8.2H-4) produces `completed_adapter_candidate`.
 *   - The guarded runtime pipeline (8.2H-5) produces
 *     `completed_authorised_internal_packet`.
 *   - No safety invariants have been violated.
 *   - Technical debt items are formally recorded.
 *
 * The audit intentionally records the 8.2H-5 temporary mock-bridge as an
 * open item. This means the epoch closes with warnings:
 * `closed_with_warnings`, not `closed_controlled_live_input_epoch`.
 *
 * Remaining debt that blocks future work:
 * - Temporary mock-shaped bridge to 8.2G output contract validator.
 * - Real redacted text is NOT yet forwarded into 8.2G.
 * - `CONTROLLED_LIVE_TEXT_DRAFT_NEVER_USER_VISIBLE` prefix not yet
 *   recognised by the 8.2G output contract validator.
 * - Public launch remains blocked.
 *
 * Safety invariants (all literal types on the result):
 * - readyForPublicLaunch: false
 * - liveLLMCalled: false
 * - apiRouteModifiedByAudit: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - neverUserVisible: true
 */

import type { ControlledLiveTextE2EHarnessVerdict } from "./controlled-live-text-e2e-harness-types";
import type { GuardedLiveTextRuntimePipelineVerdict } from "./guarded-live-text-runtime-pipeline-types";

export type { ControlledLiveTextE2EHarnessVerdict, GuardedLiveTextRuntimePipelineVerdict };

// ── Closure verdict ───────────────────────────────────────────────────────────

/**
 * The top-level verdict of `runControlledLiveInputClosureAudit`.
 *
 * - `closed_controlled_live_input_epoch` — all layers present, all live checks
 *   passed, no open items that block epoch closure.
 * - `closed_with_warnings`               — all layers present and all live checks
 *   passed, but non-blocking open items (e.g. temp mock bridge) remain.
 *   This is the expected verdict for 8.2H-6.
 * - `blocked_missing_required_layer`     — a required layer is absent.
 * - `blocked_e2e_harness_failure`        — the 8.2H-4 harness check failed.
 * - `blocked_runtime_pipeline_failure`   — the 8.2H-5 pipeline check failed.
 * - `blocked_invariant_failure`          — a nested layer returned an unsafe
 *   invariant field value.
 */
export type ControlledLiveInputClosureAuditVerdict =
  | "closed_controlled_live_input_epoch"
  | "closed_with_warnings"
  | "blocked_missing_required_layer"
  | "blocked_e2e_harness_failure"
  | "blocked_runtime_pipeline_failure"
  | "blocked_invariant_failure";

// ── Diagnostic codes ──────────────────────────────────────────────────────────

export type ControlledLiveInputClosureAuditDiagnosticCode =
  | "controlled_live_input_closure_started"
  | "controlled_live_input_closure_layer_inventory_completed"
  | "controlled_live_input_closure_required_layers_present"
  | "controlled_live_input_closure_e2e_harness_passed"
  | "controlled_live_input_closure_runtime_pipeline_passed"
  | "controlled_live_input_closure_guarded_api_branch_recorded"
  | "controlled_live_input_closure_internal_auth_required"
  | "controlled_live_input_closure_temporary_mock_bridge_recorded"
  | "controlled_live_input_closure_real_text_forwarding_still_blocked"
  | "controlled_live_input_closure_public_runtime_still_blocked"
  | "controlled_live_input_closure_ocr_still_blocked"
  | "controlled_live_input_closure_persistence_still_blocked"
  | "controlled_live_input_closure_dna_save_still_blocked"
  | "controlled_live_input_closure_offline_save_still_blocked"
  | "controlled_live_input_closure_no_live_llm_in_audit"
  | "controlled_live_input_closure_no_api_ui_changes"
  | "controlled_live_input_closure_no_persistence"
  | "controlled_live_input_closure_no_dna_save"
  | "controlled_live_input_closure_no_offline_save"
  | "controlled_live_input_closure_blocked_missing_required_layer"
  | "controlled_live_input_closure_blocked_e2e_harness_failure"
  | "controlled_live_input_closure_blocked_runtime_pipeline_failure"
  | "controlled_live_input_closure_blocked_invariant_failure"
  | "controlled_live_input_closure_epoch_closed";

// ── Required layer IDs ────────────────────────────────────────────────────────

/**
 * All required layers that must be present for the 8.2H epoch to close.
 *
 * - `wiring_plan`                      — 8.2H-0
 * - `real_text_input_contract`         — 8.2H-1
 * - `redaction_boundary`               — 8.2H-2
 * - `controlled_live_text_adapter`     — 8.2H-3
 * - `controlled_live_text_e2e_harness` — 8.2H-4
 * - `guarded_live_text_runtime_pipeline`— 8.2H-5
 * - `guarded_internal_api_branch`      — 8.2H-5 (route branch)
 * - `authenticated_internal_access`    — 8.2G-10 reused by 8.2H-5 branch
 */
export type ControlledLiveInputRequiredLayerId =
  | "wiring_plan"
  | "real_text_input_contract"
  | "redaction_boundary"
  | "controlled_live_text_adapter"
  | "controlled_live_text_e2e_harness"
  | "guarded_live_text_runtime_pipeline"
  | "guarded_internal_api_branch"
  | "authenticated_internal_access";

export type ControlledLiveInputLayerStatus = "present" | "missing" | "warning";

/**
 * A single layer check entry in the static inventory.
 */
export interface ControlledLiveInputLayerCheck {
  readonly layerId: ControlledLiveInputRequiredLayerId;
  readonly status: ControlledLiveInputLayerStatus;
  readonly phase: string;
  readonly notes: readonly string[];
  readonly neverUserVisible: true;
}

// ── Open items ────────────────────────────────────────────────────────────────

export type ControlledLiveInputOpenItemSeverity =
  | "blocker"
  | "warning"
  | "future_epoch";

/**
 * A recorded technical debt or future work item.
 *
 * `blocksEpochClosure: false` — none of the 8.2H open items block epoch closure.
 * `blocksPublicLaunch: true`  — all 8.2H open items block public launch.
 */
export interface ControlledLiveInputOpenItem {
  readonly itemId: string;
  readonly severity: ControlledLiveInputOpenItemSeverity;
  readonly title: string;
  readonly recommendation: string;
  readonly blocksEpochClosure: boolean;
  readonly blocksPublicLaunch: boolean;
  readonly neverUserVisible: true;
}

// ── Audit input ───────────────────────────────────────────────────────────────

export interface ControlledLiveInputClosureAuditInput {
  readonly auditRunId: string;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Audit result ──────────────────────────────────────────────────────────────

/**
 * The result of `runControlledLiveInputClosureAudit`.
 *
 * `readyForControlledRealTextForwardingTo8_2G` — `false` while the temporary
 *   mock-bridge debt is unresolved. Phase 8.2I-0 must produce a plan before
 *   this can become `true`.
 *
 * `readyForPublicLaunch` — always literal `false`.
 *
 * `nextRecommendedPhase` — the first recommended action after this audit.
 */
export interface ControlledLiveInputClosureAuditResult {
  readonly auditRunId: string;
  readonly verdict: ControlledLiveInputClosureAuditVerdict;
  readonly diagnostics: readonly ControlledLiveInputClosureAuditDiagnosticCode[];
  readonly layerChecks: readonly ControlledLiveInputLayerCheck[];
  readonly openItems: readonly ControlledLiveInputOpenItem[];

  readonly e2eHarnessPassed: boolean;
  readonly runtimePipelinePassed: boolean;
  readonly guardedApiBranchPresent: boolean;
  readonly authenticatedInternalAccessPresent: boolean;

  readonly readyForControlledRealTextForwardingTo8_2G: boolean;
  readonly readyForPublicLaunch: false;

  readonly liveLLMCalled: false;
  readonly apiRouteModifiedByAudit: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly neverUserVisible: true;

  readonly nextRecommendedPhase: string;
  readonly notes?: readonly string[];
}
