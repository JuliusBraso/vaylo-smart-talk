/**
 * Pilot Runtime E2E Harness Types (Phase 8.2K-3).
 *
 * Defines the typed contracts for the pure synthetic E2E harness that
 * proves the guarded internal pilot API branch (8.2K-2) behavior:
 *
 * - PilotRuntimeE2EHarnessFixtureKind — the full fixture catalogue
 * - PilotRuntimeE2EHarnessExpectedVerdict — pass / fail
 * - PilotRuntimeE2EHarnessCaseResult — per-fixture result with leak checks
 * - PilotRuntimeE2EHarnessSummary — aggregate harness result
 *
 * Harness safety invariants (all literal false/true):
 * - liveLLMCalled: false
 * - apiRouteModifiedByHarness: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - emittedToUserNow: false
 * - neverUserVisible: true
 *
 * This harness does NOT call app/api/smart-talk/route.ts.
 * This harness does NOT make HTTP requests.
 * This harness does NOT call live LLM.
 * This harness does NOT persist anything.
 * This harness uses synthetic text and synthetic secret only.
 */

// ── Fixture kinds ─────────────────────────────────────────────────────────────

/**
 * Enumerates every fixture scenario exercised by the harness.
 *
 * - success_authorised_internal_packet: all 16 guards pass
 * - failure_<guard>: exactly one guard condition violated
 * - failure_contract_violation_*: malformed contract shape beyond guard checks
 * - tamper_raw_text_echo_attempt: proves response does not echo synthetic text
 * - tamper_secret_echo_attempt: proves response does not echo synthetic secret
 */
export type PilotRuntimeE2EHarnessFixtureKind =
  | "success_authorised_internal_packet"
  | "failure_feature_flag_disabled"
  | "failure_controlled_text_pilot_flag_disabled"
  | "failure_kill_switch_enabled"
  | "failure_missing_internal_secret"
  | "failure_invalid_internal_secret"
  | "failure_missing_guard_phrase"
  | "failure_invalid_guard_phrase"
  | "failure_not_allowlisted"
  | "failure_unknown_pilot_scenario"
  | "failure_unsupported_input_mode"
  | "failure_ocr_or_upload_attempt"
  | "failure_payment_attempt"
  | "failure_persistence_attempt"
  | "failure_dna_save_attempt"
  | "failure_offline_save_attempt"
  | "failure_public_runtime_attempt"
  | "failure_live_llm_not_allowed"
  | "failure_manual_review_required"
  | "failure_contract_violation_missing_text"
  | "failure_contract_violation_missing_pilot_run_id"
  | "tamper_raw_text_echo_attempt"
  | "tamper_secret_echo_attempt";

// ── Expected verdict ──────────────────────────────────────────────────────────

/** Whether a harness case is expected to pass or fail. */
export type PilotRuntimeE2EHarnessExpectedVerdict = "pass" | "fail";

// ── Per-case result ───────────────────────────────────────────────────────────

/**
 * Detailed result for a single harness fixture.
 *
 * Fields:
 * - fixtureKind: which scenario was exercised
 * - passed: all checks matched
 * - expectedHttpStatus / actualHttpStatus: HTTP status comparison
 * - expectedAuthorised / actualAuthorised: authorisation flag comparison
 * - expectedResponseKind / actualResponseKind: response kind comparison
 * - expectedFailureVerdict / actualFailureVerdict: rejection verdict comparison
 * - expectedFailedGuard / actualFailedGuard: first failed guard comparison
 * - rawTextLeakCheckPassed: response JSON does not contain synthetic text
 * - secretLeakCheckPassed: response JSON does not contain synthetic secret
 * - userVisibleOutputCheckPassed: userVisibleOutputAllowed/emittedToUserNow false
 * - noPersistenceCheckPassed: all persistence flags false
 * - noLiveLLMCheckPassed: liveLLMCalled false
 * - noPublicRuntimeCheckPassed: publicRuntimeEnabled false
 * - notes: diagnostic messages on mismatch
 */
export interface PilotRuntimeE2EHarnessCaseResult {
  readonly fixtureKind: PilotRuntimeE2EHarnessFixtureKind;
  readonly passed: boolean;

  readonly expectedHttpStatus: 200 | 400 | 403;
  readonly actualHttpStatus: 200 | 400 | 403;

  readonly expectedAuthorised: boolean;
  readonly actualAuthorised: boolean;

  readonly expectedResponseKind:
    | "authorised_internal_packet"
    | "blocked"
    | "human_review_required"
    | "invalid_request";
  readonly actualResponseKind:
    | "authorised_internal_packet"
    | "blocked"
    | "human_review_required"
    | "invalid_request";

  readonly expectedFailureVerdict: string | null;
  readonly actualFailureVerdict: string | null;

  readonly expectedFailedGuard: string | null;
  readonly actualFailedGuard: string | null;

  readonly rawTextLeakCheckPassed: boolean;
  readonly secretLeakCheckPassed: boolean;
  readonly userVisibleOutputCheckPassed: boolean;
  readonly noPersistenceCheckPassed: boolean;
  readonly noLiveLLMCheckPassed: boolean;
  readonly noPublicRuntimeCheckPassed: boolean;

  readonly notes: readonly string[];
}

// ── Harness summary ───────────────────────────────────────────────────────────

/**
 * Aggregate result for the full pilot runtime E2E harness run.
 *
 * Coverage flags:
 * - successPathCovered: success_authorised_internal_packet passed
 * - allGuardFailurePathsCovered: all 16 guard failure fixtures passed
 * - contractViolationPathsCovered: both contract violation fixtures passed
 * - tamperPathsCovered: both tamper fixtures passed (leak checks confirmed)
 *
 * Safety invariants are literal types — the harness never touches live
 * infrastructure regardless of test outcome.
 */
export interface PilotRuntimeE2EHarnessSummary {
  readonly harnessId: "8.2K-3";
  readonly harnessVersion: "pilot-runtime-e2e-harness-v1";
  readonly totalCases: number;
  readonly passedCases: number;
  readonly failedCases: number;
  readonly allPassed: boolean;

  readonly successPathCovered: boolean;
  readonly allGuardFailurePathsCovered: boolean;
  readonly contractViolationPathsCovered: boolean;
  readonly tamperPathsCovered: boolean;

  readonly rawTextLeakCheckPassed: boolean;
  readonly secretLeakCheckPassed: boolean;
  readonly userVisibleOutputCheckPassed: boolean;
  readonly noPersistenceCheckPassed: boolean;
  readonly noLiveLLMCheckPassed: boolean;
  readonly noPublicRuntimeCheckPassed: boolean;

  readonly liveLLMCalled: false;
  readonly apiRouteModifiedByHarness: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;

  readonly caseResults: readonly PilotRuntimeE2EHarnessCaseResult[];
}
