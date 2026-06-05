/**
 * Runtime Synthetic End-to-End Harness types (Phase 8.2G-8).
 *
 * Defines the type model for the internal synthetic E2E harness that runs the
 * complete 8.2G governance pipeline from a synthetic fixture to an authorised
 * internal `UserVisibleResponsePacket` candidate — without touching Smart Talk
 * API routes, UI, live LLMs, persistence, or real user input.
 *
 * Pipeline exercised:
 *   synthetic fixture
 *     → runRuntimeLLMDraftMockAdapter()              (8.2G-1)
 *     → validateRuntimeLLMOutputContract()           (8.2G-2/8.2G-5A)
 *     → runRuntimeWordingGovernanceGate()             (8.2G-3/8.2G-6A)
 *     → runRuntimeResponseAssemblerBridge()           (8.2G-6)
 *     → runRuntimeUserVisibleAuthorisationGate()      (8.2G-7)
 *     → UserVisibleResponsePacket (internal, never delivered here)
 *
 * Safety guarantees:
 * - emittedToUserNow always literal false
 * - liveLLMCalled always literal false
 * - apiRouteTouched always literal false
 * - uiTouched always literal false
 * - persistenceUsed always literal false
 * - dnaSavePerformed always literal false
 * - offlineSavePerformed always literal false
 * - neverUserVisible always true
 * - no LLM SDK imported
 * - no external calls
 * - no side effects
 */

// ── Verdict ───────────────────────────────────────────────────────────────────

/**
 * The top-level verdict of `runRuntimeSyntheticE2EHarness`.
 *
 * - `completed_authorised_packet`        — full pipeline succeeded; a `UserVisibleResponsePacket`
 *                                          with `authorisedForFutureDelivery: true` was produced.
 * - `blocked_output_contract`            — output contract validator rejected the draft.
 * - `blocked_wording_gate`               — wording governance gate hard-failed or rejected.
 * - `blocked_response_assembler`         — response assembler bridge rejected the candidate.
 * - `blocked_user_visible_authorisation` — user-visible authorisation gate rejected the packet.
 * - `failed_missing_packet`              — authorisation verdict was `authorised_internal_packet`
 *                                          but the packet field was unexpectedly null.
 * - `failed_invariant_violation`         — a runtime invariant was violated.
 */
export type RuntimeSyntheticE2EHarnessVerdict =
  | "completed_authorised_packet"
  | "blocked_output_contract"
  | "blocked_wording_gate"
  | "blocked_response_assembler"
  | "blocked_user_visible_authorisation"
  | "failed_missing_packet"
  | "failed_invariant_violation";

// ── Diagnostic codes ──────────────────────────────────────────────────────────

/**
 * Never-user-visible diagnostic codes emitted by the synthetic E2E harness.
 */
export type RuntimeSyntheticE2EHarnessDiagnosticCode =
  | "synthetic_e2e_started"
  | "synthetic_e2e_draft_created"
  | "synthetic_e2e_output_contract_completed"
  | "synthetic_e2e_wording_gate_completed"
  | "synthetic_e2e_response_assembler_completed"
  | "synthetic_e2e_user_visible_authorisation_completed"
  | "synthetic_e2e_packet_authorised"
  | "synthetic_e2e_blocked_output_contract"
  | "synthetic_e2e_blocked_wording_gate"
  | "synthetic_e2e_blocked_response_assembler"
  | "synthetic_e2e_blocked_user_visible_authorisation"
  | "synthetic_e2e_missing_packet"
  | "synthetic_e2e_invariant_violation"
  | "synthetic_e2e_no_api_route_confirmed"
  | "synthetic_e2e_no_ui_confirmed"
  | "synthetic_e2e_no_live_llm_confirmed"
  | "synthetic_e2e_no_persistence_confirmed";

// ── Fixture mode ──────────────────────────────────────────────────────────────

/**
 * The fixture mode controls which synthetic scenario is exercised.
 *
 * - `mock_safe`                   — all gates pass; produces an authorised packet.
 * - `mock_unsafe_output_contract` — output contract validator rejects; pipeline stops.
 * - `mock_wording_hard_fail`      — wording gate hard-fails; pipeline stops.
 * - `mock_human_review`           — wording gate requests human review; assembler produces
 *                                   human-review packet; authorisation gate rejects it.
 * - `mock_metadata_leak`          — assembler detects internal metadata leak; rejects.
 * - `mock_empty_sections`         — assembler detects no section candidates; rejects.
 */
export type RuntimeSyntheticE2EHarnessFixtureMode =
  | "mock_safe"
  | "mock_unsafe_output_contract"
  | "mock_wording_hard_fail"
  | "mock_human_review"
  | "mock_metadata_leak"
  | "mock_empty_sections";

// ── Harness input ─────────────────────────────────────────────────────────────

/**
 * Input to `runRuntimeSyntheticE2EHarness`.
 *
 * `harnessRunId`   — opaque ID for this harness run.
 * `fixtureMode`    — the synthetic scenario to exercise.
 * `neverUserVisible`— compile-time invariant.
 * `notes`          — optional governance notes.
 */
export interface RuntimeSyntheticE2EHarnessInput {
  readonly harnessRunId: string;
  readonly fixtureMode: RuntimeSyntheticE2EHarnessFixtureMode;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Harness result ────────────────────────────────────────────────────────────

/**
 * The result of `runRuntimeSyntheticE2EHarness`.
 *
 * Contains the top-level verdict, per-gate verdict strings (for diagnostics),
 * and all safety invariant fields.
 *
 * The `packet` (if created) is referenced internally but never emitted to users
 * or persisted in this phase.
 *
 * `harnessRunId`                    — echoes the harness run ID from input.
 * `verdict`                         — top-level harness decision.
 * `diagnostics`                     — harness-level diagnostic codes.
 * `outputContractVerdict`           — the verdict string from Phase 8.2G-2.
 * `wordingGateVerdict`              — the verdict string from Phase 8.2G-3.
 * `assemblerVerdict`                — the verdict string from Phase 8.2G-6.
 * `authorisationVerdict`            — the verdict string from Phase 8.2G-7.
 * `packetCreated`                   — whether a `UserVisibleResponsePacket` was produced.
 * `acceptedForUserVisibleAssembly`  — `true` only on `completed_authorised_packet`.
 * `emittedToUserNow`                — always literal `false`.
 * `userVisibleOutputAllowedForFuture`— `true` only on `completed_authorised_packet`.
 * `liveLLMCalled`                   — always literal `false`.
 * `apiRouteTouched`                 — always literal `false`.
 * `uiTouched`                       — always literal `false`.
 * `persistenceUsed`                 — always literal `false`.
 * `dnaSavePerformed`                — always literal `false`.
 * `offlineSavePerformed`            — always literal `false`.
 * `neverUserVisible`                — always literal `true`.
 * `notes`                           — optional governance notes.
 */
export interface RuntimeSyntheticE2EHarnessResult {
  readonly harnessRunId: string;
  readonly verdict: RuntimeSyntheticE2EHarnessVerdict;
  readonly diagnostics: readonly RuntimeSyntheticE2EHarnessDiagnosticCode[];

  readonly outputContractVerdict: string;
  readonly wordingGateVerdict: string;
  readonly assemblerVerdict: string;
  readonly authorisationVerdict: string;

  readonly packetCreated: boolean;
  readonly acceptedForUserVisibleAssembly: boolean;
  readonly emittedToUserNow: false;
  readonly userVisibleOutputAllowedForFuture: boolean;

  readonly liveLLMCalled: false;
  readonly apiRouteTouched: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly neverUserVisible: true;

  readonly notes?: readonly string[];
}
