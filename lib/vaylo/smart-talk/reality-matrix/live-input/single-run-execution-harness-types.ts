/**
 * Single-Run Execution Harness Types (Phase 8.2L-2).
 *
 * Defines the typed contracts for the pure synthetic single-run execution
 * harness that simulates one guarded internal controlled pilot run in memory.
 *
 * This module does NOT:
 * - call /api/smart-talk or make HTTP requests
 * - import or execute app/api/smart-talk/route.ts
 * - read real environment values
 * - call any live LLM
 * - persist anything
 * - process real user input
 * - store or print secrets
 *
 * Safety invariants on SingleRunExecutionHarnessResult (all literal types):
 * - readyForPilotRunNow: false
 * - readyForPublicLaunch: false
 * - readyForLiveLLMRuntime: false
 * - readyForPersistence: false
 * - realEnvValuesRead: false
 * - envValuesStored: false
 * - secretValuesStored: false
 * - secretValuesPrinted: false
 * - httpCallMade: false
 * - apiRouteCalled: false
 * - liveLLMCalled: false
 * - apiRouteModifiedByHarness: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - emittedToUserNow: false
 * - neverUserVisible: true
 */

// ── Harness status ────────────────────────────────────────────────────────────

export type SingleRunExecutionHarnessStatus =
  | "blocked"
  | "completed_synthetic_single_run";

// ── Input kind ─────────────────────────────────────────────────────────────────

export type SingleRunExecutionHarnessInputKind =
  | "synthetic_text_controlled"
  | "synthetic_question_controlled";

// ── Step IDs ───────────────────────────────────────────────────────────────────

export type SingleRunExecutionHarnessStepId =
  | "operator_environment_verification"
  | "synthetic_request_construction"
  | "guarded_runtime_evaluation"
  | "evidence_validation_integration"
  | "leak_check"
  | "safety_invariant_check"
  | "single_run_result_assembly";

// ── Blockers ───────────────────────────────────────────────────────────────────

export type SingleRunExecutionHarnessBlocker =
  | "operator_environment_verification_failed"
  | "e2e_harness_failed"
  | "evidence_validation_integration_failed"
  | "synthetic_request_invalid"
  | "guarded_runtime_evaluation_failed"
  | "raw_text_leak_detected"
  | "secret_leak_detected"
  | "user_visible_output_detected"
  | "live_llm_detected"
  | "persistence_detected"
  | "dna_save_detected"
  | "offline_save_detected"
  | "public_runtime_detected"
  | "api_route_call_detected"
  | "http_call_detected";

// ── Synthetic request ───────────────────────────────────────────────────────────

/**
 * A synthetic single-run request packet.
 *
 * Contains metadata and safety flags only — no raw text, no redacted text,
 * no document content, and no secret values.
 *
 * `syntheticInputLabel` is a label identifier only, not body text.
 */
export interface SingleRunExecutionHarnessSyntheticRequest {
  readonly pilotRunId: string;
  readonly pilotScenarioId: string;
  readonly pilotReviewerId: string;
  readonly inputKind: SingleRunExecutionHarnessInputKind;
  readonly syntheticInputLabel: "SYNTHETIC_SINGLE_RUN_INPUT_LABEL_ONLY";
  readonly containsRealUserInput: false;
  readonly containsSensitiveDocument: false;
  readonly containsSecret: false;
  readonly requestedOcr: false;
  readonly requestedFileUpload: false;
  readonly requestedPayment: false;
  readonly requestedPersistence: false;
  readonly requestedDnaSave: false;
  readonly requestedOfflineSave: false;
  readonly requestedPublicRuntime: false;
  readonly requestedLiveLLM: false;
  readonly neverUserVisible: true;
}

// ── Step result ─────────────────────────────────────────────────────────────────

export interface SingleRunExecutionHarnessStepResult {
  readonly stepId: SingleRunExecutionHarnessStepId;
  readonly passed: boolean;
  readonly notes: readonly string[];
}

// ── Harness result ──────────────────────────────────────────────────────────────

/**
 * Aggregate result for one synthetic single-run execution harness run.
 *
 * `readyForManualReviewCaptureModel` is the only readiness flag that may be
 * true. It signals that 8.2L-3 manual review capture model planning may begin.
 * It does NOT mean the pilot runs now — `readyForPilotRunNow` remains `false`.
 */
export interface SingleRunExecutionHarnessResult {
  readonly harnessId: "8.2L-2";
  readonly harnessVersion: "single-run-execution-harness-v1";
  readonly status: SingleRunExecutionHarnessStatus;

  readonly pilotRunId: string;
  readonly pilotScenarioId: string;
  readonly pilotReviewerId: string;

  readonly syntheticRequest: SingleRunExecutionHarnessSyntheticRequest;
  readonly stepResults: readonly SingleRunExecutionHarnessStepResult[];
  readonly blockers: readonly SingleRunExecutionHarnessBlocker[];

  readonly operatorEnvironmentVerificationPassed: boolean;
  readonly e2eHarnessPassed: boolean;
  readonly evidenceValidationIntegrationPassed: boolean;

  readonly rawTextLeakCheckPassed: boolean;
  readonly secretLeakCheckPassed: boolean;
  readonly userVisibleOutputCheckPassed: boolean;
  readonly noLiveLLMCheckPassed: boolean;
  readonly noPersistenceCheckPassed: boolean;
  readonly noDnaSaveCheckPassed: boolean;
  readonly noOfflineSaveCheckPassed: boolean;
  readonly noPublicRuntimeCheckPassed: boolean;
  readonly noApiRouteCallCheckPassed: boolean;
  readonly noHttpCallCheckPassed: boolean;

  readonly readyForManualReviewCaptureModel: boolean;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForLiveLLMRuntime: false;
  readonly readyForPersistence: false;

  readonly realEnvValuesRead: false;
  readonly envValuesStored: false;
  readonly secretValuesStored: false;
  readonly secretValuesPrinted: false;

  readonly httpCallMade: false;
  readonly apiRouteCalled: false;
  readonly liveLLMCalled: false;
  readonly apiRouteModifiedByHarness: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;
}
