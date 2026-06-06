/**
 * Runtime Closure Audit types (Phase 8.2G-12).
 *
 * Defines the type model for the formal closure audit of the Vaylo Smart Talk
 * 8.2G Runtime Integration epoch.
 *
 * The audit answers:
 *  - What did 8.2G build?
 *  - Which runtime path is proven?
 *  - Which safety invariants hold?
 *  - Which guarded delivery path exists?
 *  - Which corpus-guided scenarios are covered?
 *  - What remains blocked before public/user live traffic?
 *  - What should the next epoch address?
 *
 * The audit consumes existing pure functions (runRuntimeSyntheticE2EHarness,
 * runRuntimeCorpusGuidedScenarioCoverage) as live evidence and represents all
 * other layers via a static compile-time inventory.
 *
 * Safety guarantees:
 * - readyForPublicLaunch always literal false
 * - liveLLMCalled always literal false
 * - apiRouteModifiedByAudit always literal false
 * - uiTouched always literal false
 * - persistenceUsed always literal false
 * - dnaSavePerformed always literal false
 * - offlineSavePerformed always literal false
 * - neverUserVisible always true
 */

// ── Verdict ───────────────────────────────────────────────────────────────────

/**
 * The top-level verdict of `runRuntimeClosureAudit`.
 *
 * - `closed_runtime_epoch`          — all required layers present; E2E and corpus pass;
 *                                     guards confirmed; no blocking open items.
 * - `closed_with_warnings`          — required gates pass but non-blocking warnings exist.
 * - `blocked_invariant_failure`     — synthetic E2E harness failed an invariant check.
 * - `blocked_coverage_failure`      — corpus-guided coverage failed.
 * - `blocked_guard_failure`         — guarded delivery or internal auth layer is absent.
 * - `blocked_missing_required_layer`— at least one required 8.2G layer is missing.
 */
export type RuntimeClosureAuditVerdict =
  | "closed_runtime_epoch"
  | "closed_with_warnings"
  | "blocked_invariant_failure"
  | "blocked_coverage_failure"
  | "blocked_guard_failure"
  | "blocked_missing_required_layer";

// ── Diagnostic codes ──────────────────────────────────────────────────────────

export type RuntimeClosureAuditDiagnosticCode =
  | "runtime_closure_started"
  | "runtime_closure_phase_inventory_completed"
  | "runtime_closure_required_layers_present"
  | "runtime_closure_synthetic_e2e_passed"
  | "runtime_closure_corpus_coverage_passed"
  | "runtime_closure_guarded_delivery_present"
  | "runtime_closure_internal_auth_present"
  | "runtime_closure_no_live_llm_in_audit"
  | "runtime_closure_no_api_ui_changes"
  | "runtime_closure_no_persistence"
  | "runtime_closure_no_dna_save"
  | "runtime_closure_no_offline_save"
  | "runtime_closure_public_runtime_still_blocked"
  | "runtime_closure_live_user_input_still_blocked"
  | "runtime_closure_ocr_still_blocked"
  | "runtime_closure_payment_still_blocked"
  | "runtime_closure_multilingual_runtime_still_future"
  | "runtime_closure_warning_open_future_work"
  | "runtime_closure_blocked_invariant_failure"
  | "runtime_closure_blocked_coverage_failure"
  | "runtime_closure_blocked_guard_failure"
  | "runtime_closure_blocked_missing_required_layer"
  | "runtime_closure_epoch_closed";

// ── Required layer inventory ──────────────────────────────────────────────────

/**
 * The canonical set of required 8.2G layer identifiers.
 * All must be present for epoch closure.
 */
export type RuntimeClosureAuditRequiredLayerId =
  | "mock_draft_adapter"
  | "output_contract_validator"
  | "wording_governance_gate"
  | "audit_trace_diagnostic_dry_run"
  | "live_llm_sandbox_adapter"
  | "live_path_type_extension"
  | "response_assembler_bridge"
  | "wording_gate_live_path_extension"
  | "user_visible_authorisation_gate"
  | "synthetic_e2e_harness"
  | "guarded_delivery"
  | "authenticated_internal_mode"
  | "corpus_guided_coverage";

/** Status of a layer in the closure audit inventory. */
export type RuntimeClosureAuditLayerStatus = "present" | "missing" | "warning";

/**
 * A layer check entry in the required layer inventory.
 *
 * `layerId`          — canonical layer identifier.
 * `status`           — present | missing | warning.
 * `phase`            — the 8.2G phase that implemented this layer.
 * `notes`            — brief evidence notes (file names, function names).
 * `neverUserVisible` — always true; internal governance chain only.
 */
export interface RuntimeClosureAuditLayerCheck {
  readonly layerId: RuntimeClosureAuditRequiredLayerId;
  readonly status: RuntimeClosureAuditLayerStatus;
  readonly phase: string;
  readonly notes: readonly string[];
  readonly neverUserVisible: true;
}

// ── Open items ────────────────────────────────────────────────────────────────

/** Severity of an open audit item. */
export type RuntimeClosureAuditOpenItemSeverity =
  | "blocker"
  | "warning"
  | "future_epoch";

/**
 * An open audit item representing future work or a current limitation.
 *
 * Items with `blocksRuntimeClosure: false` do not prevent epoch closure but
 * are recorded for the next epoch planner.
 */
export interface RuntimeClosureAuditOpenItem {
  readonly itemId: string;
  readonly severity: RuntimeClosureAuditOpenItemSeverity;
  readonly title: string;
  readonly recommendation: string;
  readonly blocksRuntimeClosure: boolean;
  readonly neverUserVisible: true;
}

// ── Input / Result ────────────────────────────────────────────────────────────

/**
 * Input to `runRuntimeClosureAudit`.
 *
 * `auditRunId`                    — opaque run ID for this audit.
 * `includeOptionalCorpusScenarios`— if true, the corpus coverage pass also
 *                                   runs the 6 optional extended scenarios.
 * `neverUserVisible`              — compile-time invariant; must be true.
 */
export interface RuntimeClosureAuditInput {
  readonly auditRunId: string;
  readonly includeOptionalCorpusScenarios?: boolean;
  readonly neverUserVisible: true;
}

/**
 * The result of `runRuntimeClosureAudit`.
 *
 * `readyForPublicLaunch` is always literal `false` — this audit proves the
 * internal pipeline is ready for controlled live-input wiring, not public launch.
 *
 * `readyForControlledLiveInputWiring` is `true` only when the verdict is
 * `closed_runtime_epoch` or `closed_with_warnings`.
 *
 * All persistence and emission invariants are literal types.
 */
export interface RuntimeClosureAuditResult {
  readonly auditRunId: string;
  readonly verdict: RuntimeClosureAuditVerdict;
  readonly diagnostics: readonly RuntimeClosureAuditDiagnosticCode[];
  readonly layerChecks: readonly RuntimeClosureAuditLayerCheck[];
  readonly openItems: readonly RuntimeClosureAuditOpenItem[];

  readonly syntheticE2EPassed: boolean;
  readonly corpusCoveragePassed: boolean;
  readonly guardedDeliveryPresent: boolean;
  readonly internalAuthPresent: boolean;

  readonly readyForControlledLiveInputWiring: boolean;
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
