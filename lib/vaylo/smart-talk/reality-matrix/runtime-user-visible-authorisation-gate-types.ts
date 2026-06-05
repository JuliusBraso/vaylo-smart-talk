/**
 * Runtime User-Visible Response Authorisation Gate types (Phase 8.2G-7).
 *
 * Defines the type model for the first gate in the pipeline that can set
 * `acceptedForUserVisibleAssembly: true` and produce a `UserVisibleResponsePacket`.
 *
 * Position in the 15-layer runtime pipeline (Phase 8.2G-0):
 *   response_assembler_bridge (8.2G-6)
 *     → [THIS GATE] user_visible_authorisation_gate (8.2G-7)
 *     → ... (future Smart Talk runtime wiring, Phase 8.2G-8+)
 *
 * What this gate does:
 *  - Accepts only `assembled_internal_candidate` results from Phase 8.2G-6.
 *  - Verifies all upstream invariants (no emission, no persistence, no saves).
 *  - Checks that no section candidate contains internal metadata.
 *  - Produces a `UserVisibleResponsePacket` with `authorisedForFutureDelivery: true`.
 *
 * What this gate does NOT do:
 *  - Does NOT emit to UI or any API route.
 *  - Does NOT call any LLM.
 *  - Does NOT persist anything.
 *  - Does NOT save to DNA, database, or cloud.
 *  - Does NOT rewrite or translate section text.
 *  - Does NOT perform semantic or legal analysis.
 *  - Does NOT set `emittedToUserNow: true` — ever.
 *
 * Safety guarantees:
 * - emittedToUserNow is always literal false
 * - persistenceUsed is always literal false
 * - dnaSavePerformed is always literal false
 * - offlineSavePerformed is always literal false
 * - neverUserVisible remains true for this phase
 * - no LLM SDK imported
 * - no API keys or environment variables
 * - no external calls
 * - no side effects
 */

import type {
  RuntimeResponseAssemblerBridgeResult,
} from "./runtime-response-assembler-bridge-types";

export type { RuntimeResponseAssemblerBridgeResult };

// ── Verdict ───────────────────────────────────────────────────────────────────

/**
 * The top-level verdict from `runRuntimeUserVisibleAuthorisationGate`.
 *
 * - `authorised_internal_packet`             — all checks passed; a `UserVisibleResponsePacket`
 *                                              was produced with `authorisedForFutureDelivery: true`.
 *                                              `acceptedForUserVisibleAssembly: true`.
 * - `rejected_assembler_not_eligible`        — `assemblerResult.eligibleForFutureUserVisibleAssembly !== true`.
 * - `rejected_user_visible_emission_detected`— upstream invariant violated: `userVisibleOutputEmitted`
 *                                              or `userVisibleOutputAllowed` is not false.
 * - `rejected_persistence_detected`          — `assemblerResult.persistenceUsed !== false`.
 * - `rejected_save_detected`                 — `dnaSavePerformed` or `offlineSavePerformed` is not false.
 * - `rejected_internal_metadata_leak`        — one or more section candidates contain internal metadata.
 * - `rejected_missing_sections`              — `sectionCandidates` is empty.
 * - `rejected_human_review_packet`           — assembler verdict was `assembled_human_review_packet`;
 *                                              human review must be completed before authorisation.
 * - `rejected_unsupported_verdict`           — assembler verdict is not recognised or not authorisable.
 */
export type RuntimeUserVisibleAuthorisationVerdict =
  | "authorised_internal_packet"
  | "rejected_assembler_not_eligible"
  | "rejected_user_visible_emission_detected"
  | "rejected_persistence_detected"
  | "rejected_save_detected"
  | "rejected_internal_metadata_leak"
  | "rejected_missing_sections"
  | "rejected_human_review_packet"
  | "rejected_unsupported_verdict";

// ── Diagnostic codes ──────────────────────────────────────────────────────────

/**
 * Never-user-visible diagnostic codes emitted by the authorisation gate.
 *
 * Process markers:
 * - `user_visible_auth_started`                       — gate invoked.
 * - `user_visible_auth_assembler_candidate_confirmed` — assembler candidate accepted.
 * - `user_visible_auth_packet_created`                — packet produced successfully.
 *
 * Rejection markers:
 * - `user_visible_auth_rejected_assembler_not_eligible`        — eligibility check failed.
 * - `user_visible_auth_rejected_user_visible_emission_detected`— emission invariant violated.
 * - `user_visible_auth_rejected_persistence_detected`          — persistence invariant violated.
 * - `user_visible_auth_rejected_save_detected`                 — save invariant violated.
 * - `user_visible_auth_rejected_internal_metadata_leak`        — metadata leak detected.
 * - `user_visible_auth_rejected_missing_sections`              — no sections to authorise.
 * - `user_visible_auth_rejected_human_review_packet`           — human review required first.
 *
 * Invariant markers (always emitted):
 * - `user_visible_auth_future_delivery_only`    — packet is for future delivery only; not emitted now.
 * - `user_visible_auth_no_api_route_confirmed`  — no API route was called.
 * - `user_visible_auth_no_ui_emission_confirmed`— no UI emission occurred.
 * - `user_visible_auth_no_persistence_confirmed`— no persistence occurred.
 */
export type RuntimeUserVisibleAuthorisationDiagnosticCode =
  | "user_visible_auth_started"
  | "user_visible_auth_assembler_candidate_confirmed"
  | "user_visible_auth_packet_created"
  | "user_visible_auth_rejected_assembler_not_eligible"
  | "user_visible_auth_rejected_user_visible_emission_detected"
  | "user_visible_auth_rejected_persistence_detected"
  | "user_visible_auth_rejected_save_detected"
  | "user_visible_auth_rejected_internal_metadata_leak"
  | "user_visible_auth_rejected_missing_sections"
  | "user_visible_auth_rejected_human_review_packet"
  | "user_visible_auth_future_delivery_only"
  | "user_visible_auth_no_api_route_confirmed"
  | "user_visible_auth_no_ui_emission_confirmed"
  | "user_visible_auth_no_persistence_confirmed";

// ── Packet section ────────────────────────────────────────────────────────────

/**
 * A single section within a `UserVisibleResponsePacket`.
 *
 * `sectionKind`                — the kind of this section (from assembler).
 * `text`                       — the section text (stripped of internal prefixes by Phase 8.2G-6).
 * `sourceIndex`                — the 0-based index in `assemblerResult.sectionCandidates`.
 * `neverContainsInternalMetadata`— `true` only if the source candidate had `containsInternalMetadata: false`.
 */
export interface UserVisibleResponsePacketSection {
  readonly sectionKind: string;
  readonly text: string;
  readonly sourceIndex: number;
  readonly neverContainsInternalMetadata: true;
}

// ── Packet ────────────────────────────────────────────────────────────────────

/**
 * The internal authorised response packet produced by Phase 8.2G-7.
 *
 * `authorisedForFutureDelivery: true` signals that a future Phase 8.2G-8+ runtime
 * wiring layer may deliver this packet to the Smart Talk API response. Until that
 * phase exists, the packet is never displayed to users.
 *
 * `emittedToUserNow: false` — always. The packet is an internal governance artifact.
 *
 * `packetId`                  — opaque ID for this packet.
 * `sections`                  — the authorised section list.
 * `sourceAssemblyRunId`       — the assembly run ID from Phase 8.2G-6.
 * `authorisedForFutureDelivery`— literal `true`; Phase 8.2G-8+ may deliver this.
 * `emittedToUserNow`          — always literal `false`.
 * `persistenceUsed`           — always literal `false`.
 * `dnaSavePerformed`          — always literal `false`.
 * `offlineSavePerformed`      — always literal `false`.
 * `notes`                     — optional governance notes.
 */
export interface UserVisibleResponsePacket {
  readonly packetId: string;
  readonly sections: readonly UserVisibleResponsePacketSection[];
  readonly sourceAssemblyRunId: string;
  readonly authorisedForFutureDelivery: true;
  readonly emittedToUserNow: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly notes?: readonly string[];
}

// ── Gate input ────────────────────────────────────────────────────────────────

/**
 * Input to `runRuntimeUserVisibleAuthorisationGate`.
 *
 * `assemblerResult`    — the result of `runRuntimeResponseAssemblerBridge` (Phase 8.2G-6).
 * `authorisationRunId` — opaque ID for this authorisation run.
 * `neverUserVisible`   — compile-time invariant.
 * `notes`              — optional governance notes.
 */
export interface RuntimeUserVisibleAuthorisationInput {
  readonly assemblerResult: RuntimeResponseAssemblerBridgeResult;
  readonly authorisationRunId: string;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Gate result ───────────────────────────────────────────────────────────────

/**
 * The result of `runRuntimeUserVisibleAuthorisationGate`.
 *
 * `authorisationRunId`           — echoes the authorisation run ID from input.
 * `verdict`                      — top-level gate decision.
 * `packet`                       — the `UserVisibleResponsePacket` if authorised; `null` otherwise.
 * `diagnostics`                  — gate-level diagnostic codes.
 * `acceptedForUserVisibleAssembly`— `true` only on `authorised_internal_packet` verdict.
 * `emittedToUserNow`             — always literal `false`. Packet is never emitted in this phase.
 * `userVisibleOutputAllowedForFuture`— `true` only on `authorised_internal_packet` verdict.
 *                                    A future Phase 8.2G-8+ may act on this flag.
 * `persistenceUsed`              — always literal `false`.
 * `dnaSavePerformed`             — always literal `false`.
 * `offlineSavePerformed`         — always literal `false`.
 * `neverUserVisible`             — always literal `true` in Phase 8.2G-7.
 * `notes`                        — optional governance notes.
 */
export interface RuntimeUserVisibleAuthorisationResult {
  readonly authorisationRunId: string;
  readonly verdict: RuntimeUserVisibleAuthorisationVerdict;
  readonly packet: UserVisibleResponsePacket | null;
  readonly diagnostics: readonly RuntimeUserVisibleAuthorisationDiagnosticCode[];
  readonly acceptedForUserVisibleAssembly: boolean;
  readonly emittedToUserNow: false;
  readonly userVisibleOutputAllowedForFuture: boolean;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}
