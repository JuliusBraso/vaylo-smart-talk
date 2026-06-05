/**
 * Runtime User-Visible Response Authorisation Gate (Phase 8.2G-7).
 *
 * Implements `runRuntimeUserVisibleAuthorisationGate` — the first gate in the
 * pipeline that can produce a `UserVisibleResponsePacket` with
 * `authorisedForFutureDelivery: true`.
 *
 * Accepts only `assembled_internal_candidate` results from Phase 8.2G-6.
 * Verifies all upstream safety invariants before producing the packet.
 * The packet is still never emitted to a user in this phase.
 *
 * Gate check order:
 *  1. Emit invariant diagnostics unconditionally.
 *  2. Reject `assembled_human_review_packet` explicitly.
 *  3. Reject any assembler verdict other than `assembled_internal_candidate`.
 *  4. Reject if `eligibleForFutureUserVisibleAssembly !== true`.
 *  5. Reject if upstream emission invariants are violated.
 *  6. Reject if upstream persistence invariants are violated.
 *  7. Reject if upstream save invariants are violated.
 *  8. Reject if no section candidates.
 *  9. Reject if any section candidate contains internal metadata.
 * 10. On all-clear: produce `UserVisibleResponsePacket` with `authorisedForFutureDelivery: true`.
 *
 * Safety guarantees:
 * - emittedToUserNow always literal false
 * - persistenceUsed always literal false
 * - dnaSavePerformed always literal false
 * - offlineSavePerformed always literal false
 * - neverUserVisible always true
 * - no LLM SDK imported
 * - no external calls
 * - no side effects
 * - pure function
 */

import type {
  RuntimeUserVisibleAuthorisationDiagnosticCode,
  RuntimeUserVisibleAuthorisationInput,
  RuntimeUserVisibleAuthorisationResult,
  RuntimeUserVisibleAuthorisationVerdict,
  UserVisibleResponsePacket,
  UserVisibleResponsePacketSection,
} from "./runtime-user-visible-authorisation-gate-types";

export const RUNTIME_USER_VISIBLE_AUTHORISATION_GATE_VERSION =
  "8.2g-7-runtime-user-visible-authorisation-gate-v1";

// ── Defensive field reader ────────────────────────────────────────────────────

function unsafeReadField<T>(obj: unknown, field: string): T | undefined {
  return (obj as unknown as Record<string, unknown>)[field] as T | undefined;
}

// ── Early-return helper ───────────────────────────────────────────────────────

function makeRejectedResult(params: {
  authorisationRunId: string;
  verdict: RuntimeUserVisibleAuthorisationVerdict;
  diagnostics: readonly RuntimeUserVisibleAuthorisationDiagnosticCode[];
  notes: readonly string[];
}): RuntimeUserVisibleAuthorisationResult {
  return {
    authorisationRunId: params.authorisationRunId,
    verdict: params.verdict,
    packet: null,
    diagnostics: params.diagnostics,
    acceptedForUserVisibleAssembly: false,
    emittedToUserNow: false,
    userVisibleOutputAllowedForFuture: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    neverUserVisible: true,
    notes: params.notes,
  };
}

// ── Main gate function ────────────────────────────────────────────────────────

/**
 * Authorises an assembled internal candidate for future user-visible delivery.
 *
 * Checks upstream invariants from Phase 8.2G-6 and produces a
 * `UserVisibleResponsePacket` with `authorisedForFutureDelivery: true` if all
 * checks pass.
 *
 * The packet is NEVER emitted to a user in this phase (`emittedToUserNow: false`).
 * Phase 8.2G-8+ runtime wiring is required for actual delivery.
 *
 * Pure function — no side effects, no external calls, no persistence.
 */
export function runRuntimeUserVisibleAuthorisationGate(
  input: RuntimeUserVisibleAuthorisationInput,
): RuntimeUserVisibleAuthorisationResult {
  const { assemblerResult, authorisationRunId } = input;

  // Invariant diagnostics — always emitted
  const invariantDiagnostics: RuntimeUserVisibleAuthorisationDiagnosticCode[] = [
    "user_visible_auth_started",
    "user_visible_auth_future_delivery_only",
    "user_visible_auth_no_api_route_confirmed",
    "user_visible_auth_no_ui_emission_confirmed",
    "user_visible_auth_no_persistence_confirmed",
  ];

  const baseNotes = [
    `Gate version: ${RUNTIME_USER_VISIBLE_AUTHORISATION_GATE_VERSION}.`,
    `Authorisation run ID: ${authorisationRunId}.`,
    `Upstream assembler run ID: ${assemblerResult.assemblyRunId}.`,
    `Upstream assembler verdict: ${assemblerResult.verdict}.`,
    "emittedToUserNow: false — packet is never emitted in Phase 8.2G-7.",
  ];

  // ── Check 2: human review packet ─────────────────────────────────────────

  if (assemblerResult.verdict === "assembled_human_review_packet") {
    return makeRejectedResult({
      authorisationRunId,
      verdict: "rejected_human_review_packet",
      diagnostics: [...invariantDiagnostics, "user_visible_auth_rejected_human_review_packet"],
      notes: [
        ...baseNotes,
        "Assembler returned assembled_human_review_packet. Human review must be completed before authorisation.",
      ],
    });
  }

  // ── Check 3: assembled_internal_candidate required ────────────────────────

  if (assemblerResult.verdict !== "assembled_internal_candidate") {
    return makeRejectedResult({
      authorisationRunId,
      verdict: "rejected_unsupported_verdict",
      diagnostics: [...invariantDiagnostics],
      notes: [
        ...baseNotes,
        `Assembler verdict '${assemblerResult.verdict}' is not authorisable. Only 'assembled_internal_candidate' is accepted.`,
      ],
    });
  }

  // ── Check 4: eligibility flag ─────────────────────────────────────────────

  if (assemblerResult.eligibleForFutureUserVisibleAssembly !== true) {
    return makeRejectedResult({
      authorisationRunId,
      verdict: "rejected_assembler_not_eligible",
      diagnostics: [...invariantDiagnostics, "user_visible_auth_rejected_assembler_not_eligible"],
      notes: [
        ...baseNotes,
        "assemblerResult.eligibleForFutureUserVisibleAssembly is not true.",
      ],
    });
  }

  // ── Check 5: upstream emission invariants ────────────────────────────────

  // Use unsafeReadField to guard against any runtime tampering of literal types.
  const upstreamEmitted = unsafeReadField<unknown>(assemblerResult, "userVisibleOutputEmitted");
  const upstreamAllowed = unsafeReadField<unknown>(assemblerResult, "userVisibleOutputAllowed");

  if (upstreamEmitted !== false || upstreamAllowed !== false) {
    return makeRejectedResult({
      authorisationRunId,
      verdict: "rejected_user_visible_emission_detected",
      diagnostics: [
        ...invariantDiagnostics,
        "user_visible_auth_rejected_user_visible_emission_detected",
      ],
      notes: [
        ...baseNotes,
        `Upstream emission invariant violated: userVisibleOutputEmitted=${String(upstreamEmitted)}, userVisibleOutputAllowed=${String(upstreamAllowed)}.`,
      ],
    });
  }

  // ── Check 6: upstream persistence invariant ──────────────────────────────

  const upstreamPersistence = unsafeReadField<unknown>(assemblerResult, "persistenceUsed");
  if (upstreamPersistence !== false) {
    return makeRejectedResult({
      authorisationRunId,
      verdict: "rejected_persistence_detected",
      diagnostics: [...invariantDiagnostics, "user_visible_auth_rejected_persistence_detected"],
      notes: [
        ...baseNotes,
        `Upstream persistence invariant violated: persistenceUsed=${String(upstreamPersistence)}.`,
      ],
    });
  }

  // ── Check 7: upstream save invariants ────────────────────────────────────

  const upstreamDnaSave = unsafeReadField<unknown>(assemblerResult, "dnaSavePerformed");
  const upstreamOfflineSave = unsafeReadField<unknown>(assemblerResult, "offlineSavePerformed");

  if (upstreamDnaSave !== false || upstreamOfflineSave !== false) {
    return makeRejectedResult({
      authorisationRunId,
      verdict: "rejected_save_detected",
      diagnostics: [...invariantDiagnostics, "user_visible_auth_rejected_save_detected"],
      notes: [
        ...baseNotes,
        `Upstream save invariant violated: dnaSavePerformed=${String(upstreamDnaSave)}, offlineSavePerformed=${String(upstreamOfflineSave)}.`,
      ],
    });
  }

  // ── Check 8: sections present ────────────────────────────────────────────

  if (assemblerResult.sectionCandidates.length === 0) {
    return makeRejectedResult({
      authorisationRunId,
      verdict: "rejected_missing_sections",
      diagnostics: [...invariantDiagnostics, "user_visible_auth_rejected_missing_sections"],
      notes: [...baseNotes, "No section candidates available for authorisation."],
    });
  }

  // ── Check 9: metadata leak ────────────────────────────────────────────────

  const hasMetadataLeak = assemblerResult.sectionCandidates.some(
    (sc) => sc.containsInternalMetadata,
  );
  if (hasMetadataLeak) {
    return makeRejectedResult({
      authorisationRunId,
      verdict: "rejected_internal_metadata_leak",
      diagnostics: [
        ...invariantDiagnostics,
        "user_visible_auth_rejected_internal_metadata_leak",
      ],
      notes: [
        ...baseNotes,
        "One or more section candidates contain internal metadata markers. Authorisation blocked.",
      ],
    });
  }

  // ── Check 10: build packet ────────────────────────────────────────────────

  const packetSections: UserVisibleResponsePacketSection[] =
    assemblerResult.sectionCandidates.map((sc, index) => ({
      sectionKind: sc.sectionKind,
      text: sc.textCandidate,
      sourceIndex: index,
      neverContainsInternalMetadata: true as const,
    }));

  const packet: UserVisibleResponsePacket = {
    packetId: `${authorisationRunId}-packet`,
    sections: packetSections,
    sourceAssemblyRunId: assemblerResult.assemblyRunId,
    authorisedForFutureDelivery: true,
    emittedToUserNow: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    notes: [
      `Produced by Phase 8.2G-7 authorisation gate.`,
      `Source assembly run: ${assemblerResult.assemblyRunId}.`,
      "authorisedForFutureDelivery: true — Phase 8.2G-8+ may deliver this to the Smart Talk API.",
      "emittedToUserNow: false — not emitted in this phase.",
    ],
  };

  return {
    authorisationRunId,
    verdict: "authorised_internal_packet",
    packet,
    diagnostics: [
      ...invariantDiagnostics,
      "user_visible_auth_assembler_candidate_confirmed",
      "user_visible_auth_packet_created",
    ],
    acceptedForUserVisibleAssembly: true,
    emittedToUserNow: false,
    userVisibleOutputAllowedForFuture: true,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    neverUserVisible: true,
    notes: [
      ...baseNotes,
      `Packet ID: ${authorisationRunId}-packet.`,
      `Sections authorised: ${String(packetSections.length)}.`,
      "acceptedForUserVisibleAssembly: true. userVisibleOutputAllowedForFuture: true.",
      "Phase 8.2G-8+ required for actual Smart Talk runtime delivery.",
    ],
  };
}
