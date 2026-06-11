/**
 * Pilot Runtime Guard Contract Types (Phase 8.2K-1).
 *
 * Defines the typed contracts for the guarded internal pilot runtime:
 * - PilotRuntimeRequest — inbound request shape with literal-false safety flags
 * - PilotRuntimeGuardInput — inputs to the guard chain
 * - PilotRuntimeGuardSuccess / PilotRuntimeFailureResult / PilotRuntimeGuardResult
 * - PilotRuntimeResponse — outbound response (no user-visible content)
 * - PilotNoPersistenceResult — no-persistence attestation
 * - PilotRuntimeClosureAuditResult — contract-level closure assertion
 *
 * These contracts are prerequisites for 8.2K-2 (guarded API branch).
 * No API route is modified in this phase. No runtime is wired.
 *
 * Safety invariants (literal false/true on all result types):
 * - liveLLMCalled: false
 * - apiRouteModified: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - emittedToUserNow: false
 * - neverUserVisible: true
 *
 * PilotRuntimeRequest literal-false request flags prevent accidental wiring:
 * - requestedOcr: false
 * - requestedFileUpload: false
 * - requestedPayment: false
 * - requestedPersistence: false
 * - requestedDnaSave: false
 * - requestedOfflineSave: false
 * - requestedPublicRuntime: false
 * - requestedLiveLLM: false
 */

// ── Constants ─────────────────────────────────────────────────────────────────

export const PILOT_RUNTIME_ALLOWED_MODE =
  "controlled_text_pilot_guarded" as const;

export const PILOT_RUNTIME_REQUIRED_GUARD_PHRASE =
  "I_UNDERSTAND_THIS_IS_CONTROLLED_TEXT_PILOT_INTERNAL_ONLY" as const;

// ── Input mode ────────────────────────────────────────────────────────────────

export type PilotRuntimeInputMode =
  | "real_text_guarded"
  | "real_question_guarded";

// ── Allowed mode ──────────────────────────────────────────────────────────────

export type PilotRuntimeAllowedMode = "controlled_text_pilot_guarded";

// ── Blocked capabilities ──────────────────────────────────────────────────────

export type PilotRuntimeBlockedCapability =
  | "public_anonymous_runtime"
  | "ocr_photo_runtime"
  | "file_upload_runtime"
  | "payment_runtime"
  | "dna_save_runtime"
  | "offline_save_runtime"
  | "b2b_visibility_runtime"
  | "multilingual_public_runtime"
  | "direct_user_visible_delivery"
  | "evidence_persistence"
  | "live_llm_runtime";

export const PILOT_RUNTIME_BLOCKED_CAPABILITIES: ReadonlyArray<PilotRuntimeBlockedCapability> = [
  "public_anonymous_runtime",
  "ocr_photo_runtime",
  "file_upload_runtime",
  "payment_runtime",
  "dna_save_runtime",
  "offline_save_runtime",
  "b2b_visibility_runtime",
  "multilingual_public_runtime",
  "direct_user_visible_delivery",
  "evidence_persistence",
  "live_llm_runtime",
];

// ── Guard names ───────────────────────────────────────────────────────────────

export type PilotRuntimeGuardName =
  | "feature_flag_enabled"
  | "controlled_text_pilot_flag_enabled"
  | "kill_switch_disabled"
  | "internal_runtime_secret_valid"
  | "internal_guard_phrase_valid"
  | "internal_account_allowlisted"
  | "pilot_scenario_allowed"
  | "pilot_input_mode_supported"
  | "no_ocr_or_upload_requested"
  | "no_payment_requested"
  | "no_persistence_requested"
  | "no_dna_save_requested"
  | "no_offline_save_requested"
  | "public_runtime_not_requested"
  | "live_llm_not_allowed"
  | "manual_review_required_for_warning_or_high_risk";

export const PILOT_RUNTIME_REQUIRED_GUARDS: ReadonlyArray<PilotRuntimeGuardName> = [
  "feature_flag_enabled",
  "controlled_text_pilot_flag_enabled",
  "kill_switch_disabled",
  "internal_runtime_secret_valid",
  "internal_guard_phrase_valid",
  "internal_account_allowlisted",
  "pilot_scenario_allowed",
  "pilot_input_mode_supported",
  "no_ocr_or_upload_requested",
  "no_payment_requested",
  "no_persistence_requested",
  "no_dna_save_requested",
  "no_offline_save_requested",
  "public_runtime_not_requested",
  "live_llm_not_allowed",
  "manual_review_required_for_warning_or_high_risk",
];

// ── Failure verdicts ──────────────────────────────────────────────────────────

export type PilotRuntimeFailureVerdict =
  | "rejected_feature_flag_disabled"
  | "rejected_controlled_text_pilot_flag_disabled"
  | "rejected_kill_switch_enabled"
  | "rejected_missing_internal_secret"
  | "rejected_invalid_internal_secret"
  | "rejected_missing_guard_phrase"
  | "rejected_invalid_guard_phrase"
  | "rejected_not_allowlisted"
  | "rejected_unknown_pilot_scenario"
  | "rejected_unsupported_input_mode"
  | "rejected_ocr_or_upload_attempt"
  | "rejected_payment_attempt"
  | "rejected_persistence_attempt"
  | "rejected_dna_save_attempt"
  | "rejected_offline_save_attempt"
  | "rejected_public_runtime_attempt"
  | "rejected_live_llm_not_allowed"
  | "rejected_manual_review_required"
  | "rejected_contract_violation";

// ── Diagnostic codes ──────────────────────────────────────────────────────────

export type PilotRuntimeDiagnosticCode =
  | "pilot_runtime_contract_started"
  | "pilot_runtime_feature_flag_confirmed"
  | "pilot_runtime_controlled_text_pilot_flag_confirmed"
  | "pilot_runtime_kill_switch_confirmed_disabled"
  | "pilot_runtime_internal_secret_present"
  | "pilot_runtime_internal_secret_valid"
  | "pilot_runtime_guard_phrase_present"
  | "pilot_runtime_guard_phrase_valid"
  | "pilot_runtime_account_allowlisted"
  | "pilot_runtime_scenario_allowed"
  | "pilot_runtime_input_mode_supported"
  | "pilot_runtime_no_ocr_or_upload_confirmed"
  | "pilot_runtime_no_payment_confirmed"
  | "pilot_runtime_no_persistence_confirmed"
  | "pilot_runtime_no_dna_save_confirmed"
  | "pilot_runtime_no_offline_save_confirmed"
  | "pilot_runtime_no_public_runtime_confirmed"
  | "pilot_runtime_no_live_llm_confirmed"
  | "pilot_runtime_manual_review_boundary_confirmed"
  | "pilot_runtime_all_guards_passed"
  | "pilot_runtime_rejected_feature_flag_disabled"
  | "pilot_runtime_rejected_controlled_text_pilot_flag_disabled"
  | "pilot_runtime_rejected_kill_switch_enabled"
  | "pilot_runtime_rejected_missing_internal_secret"
  | "pilot_runtime_rejected_invalid_internal_secret"
  | "pilot_runtime_rejected_missing_guard_phrase"
  | "pilot_runtime_rejected_invalid_guard_phrase"
  | "pilot_runtime_rejected_not_allowlisted"
  | "pilot_runtime_rejected_unknown_pilot_scenario"
  | "pilot_runtime_rejected_unsupported_input_mode"
  | "pilot_runtime_rejected_ocr_or_upload_attempt"
  | "pilot_runtime_rejected_payment_attempt"
  | "pilot_runtime_rejected_persistence_attempt"
  | "pilot_runtime_rejected_dna_save_attempt"
  | "pilot_runtime_rejected_offline_save_attempt"
  | "pilot_runtime_rejected_public_runtime_attempt"
  | "pilot_runtime_rejected_live_llm_not_allowed"
  | "pilot_runtime_rejected_manual_review_required"
  | "pilot_runtime_rejected_contract_violation";

// ── Request contract ──────────────────────────────────────────────────────────

/**
 * The typed inbound request shape for the guarded internal pilot runtime.
 *
 * Literal-false flags (`requestedOcr: false`, `requestedFileUpload: false`,
 * etc.) enforce at the type level that these capabilities cannot be requested.
 * Any runtime implementation must validate these fields defensively at runtime
 * using `unsafeReadField` patterns consistent with prior phases.
 *
 * `internalRuntimeGuard` is typed as `typeof PILOT_RUNTIME_REQUIRED_GUARD_PHRASE`
 * to enforce the exact string at the type level.
 */
export interface PilotRuntimeRequest {
  readonly internalRuntimeMode: PilotRuntimeAllowedMode;
  readonly internalRuntimeGuard: typeof PILOT_RUNTIME_REQUIRED_GUARD_PHRASE;
  readonly pilotScenarioId: string;
  readonly pilotInputMode: PilotRuntimeInputMode;
  readonly pilotReviewerId: string;
  readonly pilotRunId: string;

  readonly text: string;

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

// ── Guard input ───────────────────────────────────────────────────────────────

/**
 * Inputs supplied to the guard chain evaluator.
 *
 * `request: unknown` — the raw inbound body; the guard chain must not
 * trust caller types and must use defensive reads.
 * Secret-matching booleans are pre-computed by the caller (e.g. route
 * handler) before entering the guard chain — raw secret values are
 * never passed into the guard evaluation logic.
 */
export interface PilotRuntimeGuardInput {
  readonly request: unknown;
  readonly expectedInternalSecretConfigured: boolean;
  readonly providedInternalSecretPresent: boolean;
  readonly providedInternalSecretMatches: boolean;
  readonly featureFlagEnabled: boolean;
  readonly controlledTextPilotFlagEnabled: boolean;
  readonly killSwitchEnabled: boolean;
  readonly allowedAccountIds: readonly string[];
  readonly requesterAccountId: string | null;
  readonly allowedScenarioIds: readonly string[];
  readonly neverUserVisible: true;
}

// ── Guard success ─────────────────────────────────────────────────────────────

/**
 * Returned by the guard chain when all 16 guards pass.
 *
 * `authorised: true` is a discriminant field that narrows the union.
 * `mode` is locked to the only permitted pilot mode.
 * All safety invariants are literal false.
 */
export interface PilotRuntimeGuardSuccess {
  readonly authorised: true;
  readonly mode: "controlled_text_pilot_guarded";
  readonly pilotScenarioId: string;
  readonly pilotInputMode: PilotRuntimeInputMode;
  readonly pilotReviewerId: string;
  readonly pilotRunId: string;
  readonly guardsPassed: readonly PilotRuntimeGuardName[];
  readonly diagnostics: readonly PilotRuntimeDiagnosticCode[];

  readonly liveLLMCalled: false;
  readonly apiRouteModified: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;
}

// ── Failure result ────────────────────────────────────────────────────────────

/**
 * Returned by the guard chain when any guard fails.
 *
 * `authorised: false` is the discriminant.
 * `publicMessage` is a literal string — never exposes the internal reason.
 * `httpStatus` is a union of exactly 403 | 400.
 * `internalReason` is for logging infrastructure only; must never reach
 * a user-visible response field.
 */
export interface PilotRuntimeFailureResult {
  readonly authorised: false;
  readonly verdict: PilotRuntimeFailureVerdict;
  readonly diagnostics: readonly PilotRuntimeDiagnosticCode[];
  readonly failedGuard: PilotRuntimeGuardName | null;
  readonly httpStatus: 403 | 400;
  readonly publicMessage: "Internal pilot runtime request rejected.";
  readonly internalReason: string;

  readonly liveLLMCalled: false;
  readonly apiRouteModified: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;
}

// ── Guard result (discriminated union) ────────────────────────────────────────

/**
 * The discriminated union result of the guard chain.
 * Narrow by `result.authorised` before accessing success fields.
 */
export type PilotRuntimeGuardResult =
  | PilotRuntimeGuardSuccess
  | PilotRuntimeFailureResult;

// ── No-persistence attestation ────────────────────────────────────────────────

/**
 * A typed attestation that no persistence occurred during a pilot run.
 *
 * The implementation must construct this with all flags literally false.
 * It is included in `PilotRuntimeResponse.noPersistence` to make the
 * no-persistence invariant machine-checkable at the type level.
 */
export interface PilotNoPersistenceResult {
  readonly persistenceAllowed: false;
  readonly persistenceUsed: false;
  readonly dnaSaveAllowed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSaveAllowed: false;
  readonly offlineSavePerformed: false;
  readonly evidencePersistenceAllowed: false;
  readonly evidencePersistencePerformed: false;
  readonly neverUserVisible: true;
}

// ── Response contract ─────────────────────────────────────────────────────────

/**
 * The typed outbound response for a guarded pilot runtime run.
 *
 * `emittedToUserNow: false` — this response is internal governance metadata;
 *   it is not forwarded to any user-facing endpoint.
 * `userVisibleOutputAllowed: false` — no user-visible prose is produced.
 * `publicRuntimeEnabled: false` — the public Smart Talk runtime is not enabled.
 * `readyForPublicLaunch: false` — always false.
 * `noPersistence` — the embedded no-persistence attestation.
 *
 * `responseKind` distinguishes the governance outcome:
 * - `authorised_internal_packet` — all guards + governance chain passed.
 * - `blocked` — wording gate or authorisation gate blocked the result.
 * - `human_review_required` — scenario requires human reviewer sign-off.
 * - `invalid_request` — guard chain rejected the request.
 */
export interface PilotRuntimeResponse {
  readonly mode: "controlled_text_pilot_guarded";
  readonly pilotRunId: string;
  readonly pilotScenarioId: string;
  readonly pilotInputMode: PilotRuntimeInputMode;
  readonly responseKind:
    | "authorised_internal_packet"
    | "blocked"
    | "human_review_required"
    | "invalid_request";

  readonly emittedToUserNow: false;
  readonly userVisibleOutputAllowed: false;
  readonly publicRuntimeEnabled: false;
  readonly readyForPublicLaunch: false;

  readonly noPersistence: PilotNoPersistenceResult;

  readonly liveLLMCalled: false;
  readonly apiRouteModified: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly neverUserVisible: true;
}

// ── Closure audit result ──────────────────────────────────────────────────────

/**
 * The contract-level closure assertion for 8.2K-1.
 *
 * `guardContractsPresent: true` through `noPersistenceContractPresent: true`
 * are literal true — they attest that each required contract type exists in
 * this module. The 8.2K-5 runtime closure audit will instantiate and verify
 * these at the value level.
 *
 * `readyForApiBranchImplementation: boolean` — becomes true when 8.2K-1 is
 * fully validated by the regression scaffold and can advance to 8.2K-2.
 * `readyForRuntimeExecution: false` — literal; remains false until 8.2K-5.
 * `readyForPublicLaunch: false` — always false.
 */
export interface PilotRuntimeClosureAuditResult {
  readonly auditId: string;
  readonly guardContractsPresent: true;
  readonly requestContractPresent: true;
  readonly responseContractPresent: true;
  readonly failureContractPresent: true;
  readonly noPersistenceContractPresent: true;

  readonly readyForApiBranchImplementation: boolean;
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
}
