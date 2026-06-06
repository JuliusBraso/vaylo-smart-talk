/**
 * Guarded Real Text Pipeline Closure Audit types (Phase 8.2I-5).
 *
 * Defines the type model for the formal closure audit of the 8.2I epoch —
 * Controlled Live Text Output Contract Compatibility.
 *
 * The audit formally certifies:
 *   - compatibility_plan                    (8.2I-0) present
 *   - controlled_live_text_draft_result_types (8.2I-1) present
 *   - output_contract_validator_extension   (8.2I-2) present
 *   - temporary_mock_bridge_removal         (8.2I-3) present
 *   - source_kind_alignment                 (8.2I-3A) present
 *   - real_redacted_text_forwarding_harness (8.2I-4) present
 *
 * Key closure invariants:
 *   - adapterMode === "controlled_live_text"
 *   - sourceKind === "controlled_live_text"  (aligned in 8.2I-3A)
 *   - temporary mock bridge removed (8.2I-3)
 *   - ControlledLiveTextDraftResult accepted by validateRuntimeLLMOutputContract()
 *   - raw value leak checks pass on synthetic PII fixtures
 *   - readyForPublicLaunch remains false
 *
 * Safety invariants (literal types on the result):
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
 * Pure function — no external calls, no logging, no persistence.
 * Does NOT inspect the filesystem dynamically.
 * Does NOT modify any API route.
 */

// ── Audit verdict ─────────────────────────────────────────────────────────────

/**
 * The top-level verdict of `runGuardedRealTextPipelineClosureAudit`.
 *
 * - `closed_guarded_real_text_pipeline_epoch` — all layers present, all checks pass,
 *   no open items block closure.
 * - `closed_with_warnings`                    — all checks pass but future/public work remains;
 *   expected verdict for this audit.
 * - `blocked_missing_required_layer`          — a required 8.2I layer is absent.
 * - `blocked_forwarding_harness_failure`      — forwarding harness check failed.
 * - `blocked_source_kind_misalignment`        — sourceKind mismatch detected.
 * - `blocked_mock_bridge_detected`            — temporary mock bridge not confirmed removed.
 * - `blocked_invariant_failure`               — a nested result violated a safety invariant.
 */
export type GuardedRealTextPipelineClosureAuditVerdict =
  | "closed_guarded_real_text_pipeline_epoch"
  | "closed_with_warnings"
  | "blocked_missing_required_layer"
  | "blocked_forwarding_harness_failure"
  | "blocked_source_kind_misalignment"
  | "blocked_mock_bridge_detected"
  | "blocked_invariant_failure";

// ── Diagnostic codes ──────────────────────────────────────────────────────────

export type GuardedRealTextPipelineClosureAuditDiagnosticCode =
  | "guarded_real_text_closure_started"
  | "guarded_real_text_closure_layer_inventory_completed"
  | "guarded_real_text_closure_required_layers_present"
  | "guarded_real_text_closure_source_kind_aligned"
  | "guarded_real_text_closure_mock_bridge_removed"
  | "guarded_real_text_closure_forwarding_harness_passed"
  | "guarded_real_text_closure_raw_leak_check_passed"
  | "guarded_real_text_closure_output_contract_path_verified"
  | "guarded_real_text_closure_public_runtime_still_blocked"
  | "guarded_real_text_closure_ocr_still_blocked"
  | "guarded_real_text_closure_payment_still_blocked"
  | "guarded_real_text_closure_multilingual_runtime_still_future"
  | "guarded_real_text_closure_audit_persistence_still_future"
  | "guarded_real_text_closure_no_live_llm_in_audit"
  | "guarded_real_text_closure_no_api_ui_changes"
  | "guarded_real_text_closure_no_persistence"
  | "guarded_real_text_closure_no_dna_save"
  | "guarded_real_text_closure_no_offline_save"
  | "guarded_real_text_closure_blocked_missing_required_layer"
  | "guarded_real_text_closure_blocked_forwarding_harness_failure"
  | "guarded_real_text_closure_blocked_source_kind_misalignment"
  | "guarded_real_text_closure_blocked_mock_bridge_detected"
  | "guarded_real_text_closure_blocked_invariant_failure"
  | "guarded_real_text_closure_epoch_closed";

// ── Layer types ───────────────────────────────────────────────────────────────

/** Required layer IDs representing each 8.2I phase. */
export type GuardedRealTextRequiredLayerId =
  | "compatibility_plan"
  | "controlled_live_text_draft_result_types"
  | "output_contract_validator_extension"
  | "temporary_mock_bridge_removal"
  | "source_kind_alignment"
  | "real_redacted_text_forwarding_harness";

export type GuardedRealTextLayerStatus = "present" | "missing" | "warning";

export interface GuardedRealTextLayerCheck {
  readonly layerId: GuardedRealTextRequiredLayerId;
  readonly status: GuardedRealTextLayerStatus;
  readonly phase: string;
  readonly notes: readonly string[];
  readonly neverUserVisible: true;
}

// ── Open items ────────────────────────────────────────────────────────────────

export type GuardedRealTextOpenItemSeverity = "blocker" | "warning" | "future_epoch";

export interface GuardedRealTextOpenItem {
  readonly itemId: string;
  readonly severity: GuardedRealTextOpenItemSeverity;
  readonly title: string;
  readonly recommendation: string;
  readonly blocksEpochClosure: boolean;
  readonly blocksPublicLaunch: boolean;
  readonly neverUserVisible: true;
}

// ── Input ─────────────────────────────────────────────────────────────────────

/**
 * Input to `runGuardedRealTextPipelineClosureAudit`.
 *
 * `auditRunId`     — opaque run ID; propagated to all nested harness calls.
 * `neverUserVisible` — compile-time invariant; must be `true`.
 */
export interface GuardedRealTextPipelineClosureAuditInput {
  readonly auditRunId: string;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Result ────────────────────────────────────────────────────────────────────

/**
 * The result of `runGuardedRealTextPipelineClosureAudit`.
 *
 * `readyForControlledRealTextForwardingTo8_2G` is `true` only when all closure
 * checks pass (harness, source kind, bridge removal, output contract, leak check).
 * `readyForPublicLaunch` is always literal `false`.
 * `emittedToUserNow` is always literal `false`.
 */
export interface GuardedRealTextPipelineClosureAuditResult {
  readonly auditRunId: string;
  readonly verdict: GuardedRealTextPipelineClosureAuditVerdict;
  readonly diagnostics: readonly GuardedRealTextPipelineClosureAuditDiagnosticCode[];
  readonly layerChecks: readonly GuardedRealTextLayerCheck[];
  readonly openItems: readonly GuardedRealTextOpenItem[];

  readonly forwardingHarnessPassed: boolean;
  readonly sourceKindAligned: boolean;
  readonly temporaryMockBridgeRemoved: boolean;
  readonly controlledLiveTextDraftAcceptedByOutputContract: boolean;
  readonly rawValueLeakCheckPassed: boolean;

  readonly readyForControlledRealTextForwardingTo8_2G: boolean;
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
