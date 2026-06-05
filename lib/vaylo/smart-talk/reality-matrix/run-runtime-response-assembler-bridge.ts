/**
 * Runtime Response Assembler Bridge (Phase 8.2G-6).
 *
 * Implements `runRuntimeResponseAssemblerBridge` — the bridge that transforms
 * a fully-validated draft from the 8.2G pipeline into an internal structured
 * response assembly candidate.
 *
 * This is the first layer that creates a structured internal candidate with
 * internal draft prefixes stripped. The output is still NEVER user-visible.
 * Only a future Phase 8.2G-7+ user-visible assembly gate may authorise display.
 *
 * Accepted upstream inputs:
 *  - Phase 8.2G-2 output contract validation: `accepted_for_next_gate`
 *  - Phase 8.2G-3 wording gate: `accepted_for_audit_dry_run` (or `human_review_required`
 *    for a restricted human-review packet)
 *  - Phase 8.2G-4 audit trace: valid
 *  - Phase 8.2G-4 diagnostic envelopes: valid
 *
 * Verdict order:
 *  1. Output contract not accepted → rejected_output_contract_not_accepted
 *  2. Wording gate human_review_required → assembled_human_review_packet
 *  3. Wording gate not accepted_for_audit_dry_run → rejected_wording_gate_not_accepted
 *  4. Audit trace invalid → rejected_audit_trace_invalid
 *  5. Diagnostic envelopes invalid → rejected_diagnostic_envelope_invalid
 *  6. No sections → rejected_missing_sections
 *  7. Internal metadata leak → rejected_internal_metadata_leak
 *  8. All pass → assembled_internal_candidate
 *
 * Safety guarantees:
 * - no LLM call
 * - no API keys or environment variables
 * - no UI or API route access
 * - no external calls
 * - no persistence
 * - no console output
 * - no logging
 * - pure function
 * - userVisibleOutputEmitted always false
 * - userVisibleOutputAllowed always false
 * - persistenceUsed always false
 * - dnaSavePerformed always false
 * - offlineSavePerformed always false
 * - neverUserVisible always true
 */

import { LIVE_SANDBOX_DRAFT_TEXT_PREFIX } from "./runtime-live-path-type-extension-types";
import type {
  RuntimeResponseAssemblerBridgeDiagnosticCode,
  RuntimeResponseAssemblerBridgeInput,
  RuntimeResponseAssemblerBridgeResult,
  RuntimeResponseAssemblerBridgeVerdict,
  RuntimeResponseAssemblerSectionCandidate,
  RuntimeResponseAssemblerSectionKind,
} from "./runtime-response-assembler-bridge-types";
import type { RuntimeLLMDraftSectionType } from "./runtime-llm-draft-adapter-types";

export const RUNTIME_RESPONSE_ASSEMBLER_BRIDGE_VERSION =
  "8.2g-6-runtime-response-assembler-bridge-v1";

// ── Internal constants ────────────────────────────────────────────────────────

const MOCK_DRAFT_PREFIX = "[MOCK_DRAFT_NEVER_USER_VISIBLE]";

const KNOWN_INTERNAL_PREFIXES: readonly string[] = [
  MOCK_DRAFT_PREFIX,
  LIVE_SANDBOX_DRAFT_TEXT_PREFIX,
];

const INTERNAL_METADATA_MARKERS: readonly string[] = [
  "neverUserVisible",
  "Diagnostic",
  "diagnostic",
  "AuditTrace",
  "auditTrace",
  "llm_output_",
  "runtime_dry_run_",
  "wording_gate_",
  "live_path_proof_",
  "[MOCK_DRAFT_NEVER_USER_VISIBLE]",
  "[LIVE_SANDBOX_DRAFT_NEVER_USER_VISIBLE]",
];

const HUMAN_REVIEW_SECTION_KINDS: readonly RuntimeResponseAssemblerSectionKind[] = [
  "review_recommendation",
  "uncertainty_notice",
];

// ── Helper: read field bypassing literal-type narrowing ───────────────────────

function unsafeReadField<T>(obj: unknown, field: string): T | undefined {
  return (obj as Record<string, unknown>)[field] as T | undefined;
}

// ── Step 2: Prefix stripping ──────────────────────────────────────────────────

/**
 * Strips one known internal draft prefix from the beginning of `text`.
 *
 * Checks `[MOCK_DRAFT_NEVER_USER_VISIBLE]` and
 * `[LIVE_SANDBOX_DRAFT_NEVER_USER_VISIBLE]`. If a known prefix is found,
 * removes it and trims any leading whitespace from the remainder.
 *
 * Rules:
 * - Only strips the first matching known prefix, not arbitrary text.
 * - Does not rewrite, translate, or extend the text.
 * - The resulting `textCandidate` is still never-user-visible in this phase.
 *
 * Pure function — no side effects.
 */
export function stripKnownInternalDraftPrefix(text: string): {
  readonly textCandidate: string;
  readonly prefixRemoved: boolean;
  readonly hadKnownPrefix: boolean;
} {
  for (const prefix of KNOWN_INTERNAL_PREFIXES) {
    if (text.startsWith(prefix)) {
      return {
        textCandidate: text.slice(prefix.length).replace(/^\s+/, ""),
        prefixRemoved: true,
        hadKnownPrefix: true,
      };
    }
  }
  return {
    textCandidate: text,
    prefixRemoved: false,
    hadKnownPrefix: false,
  };
}

// ── Step 3: Internal metadata leak detection ──────────────────────────────────

/**
 * Returns `true` if `text` contains any known internal governance metadata
 * markers that must never appear in an assembled candidate heading toward
 * user-visible output.
 *
 * Only checks for specific string markers — does NOT perform semantic or legal
 * prose analysis.
 *
 * Pure function — no side effects.
 */
export function detectInternalMetadataLeak(text: string): boolean {
  for (const marker of INTERNAL_METADATA_MARKERS) {
    if (text.includes(marker)) {
      return true;
    }
  }
  return false;
}

// ── Section kind mapping ──────────────────────────────────────────────────────

function sectionTypeToKind(
  sectionType: RuntimeLLMDraftSectionType,
): RuntimeResponseAssemblerSectionKind {
  return sectionType;
}

// ── Section candidate builder ─────────────────────────────────────────────────

function buildSectionCandidate(params: {
  sectionType: RuntimeLLMDraftSectionType;
  draftText: string;
  derivedFromDraftId: string;
}): RuntimeResponseAssemblerSectionCandidate {
  const { sectionType, draftText, derivedFromDraftId } = params;
  const stripped = stripKnownInternalDraftPrefix(draftText);
  const containsInternalMetadata = detectInternalMetadataLeak(stripped.textCandidate);

  return {
    sectionKind: sectionTypeToKind(sectionType),
    textCandidate: stripped.textCandidate,
    sourceSectionType: sectionType,
    derivedFromDraftId,
    internalDraftPrefixRemoved: stripped.prefixRemoved,
    containsInternalMetadata,
    neverUserVisible: true,
    notes: containsInternalMetadata
      ? ["Internal metadata marker detected. This section triggers rejected_internal_metadata_leak."]
      : stripped.prefixRemoved
      ? ["Internal draft prefix stripped. Text is still never-user-visible in this phase."]
      : undefined,
  };
}

// ── Early-return helper ───────────────────────────────────────────────────────

function makeRejectedResult(params: {
  assemblyRunId: string;
  verdict: RuntimeResponseAssemblerBridgeVerdict;
  diagnostics: readonly RuntimeResponseAssemblerBridgeDiagnosticCode[];
  upstreamDraftId: string;
  liveLLMCalled: boolean;
  notes: readonly string[];
}): RuntimeResponseAssemblerBridgeResult {
  return {
    assemblyRunId: params.assemblyRunId,
    verdict: params.verdict,
    eligibleForFutureUserVisibleAssembly: false,
    userVisibleOutputEmitted: false,
    userVisibleOutputAllowed: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    sectionCandidates: [],
    diagnostics: params.diagnostics,
    upstreamDraftId: params.upstreamDraftId,
    liveLLMCalled: params.liveLLMCalled,
    neverUserVisible: true,
    notes: params.notes,
  };
}

// ── Main bridge function ──────────────────────────────────────────────────────

/**
 * Transforms a fully-validated draft path into an internal response assembly
 * candidate.
 *
 * Checks upstream gate verdicts in order (output contract → wording gate →
 * audit trace → diagnostic envelopes), then builds section candidates with
 * internal prefix stripping and metadata leak detection.
 *
 * Returns a `RuntimeResponseAssemblerBridgeResult` with:
 * - `userVisibleOutputEmitted: false` — always
 * - `userVisibleOutputAllowed: false` — always
 * - `persistenceUsed: false` — always
 * - `dnaSavePerformed: false` — always
 * - `offlineSavePerformed: false` — always
 * - `neverUserVisible: true` — always
 * - `eligibleForFutureUserVisibleAssembly: true` only on `assembled_internal_candidate`
 *
 * Pure function — no side effects, no external calls, no persistence.
 */
export function runRuntimeResponseAssemblerBridge(
  input: RuntimeResponseAssemblerBridgeInput,
): RuntimeResponseAssemblerBridgeResult {
  // Invariant diagnostics — always emitted
  const invariantDiagnostics: RuntimeResponseAssemblerBridgeDiagnosticCode[] = [
    "response_assembler_started",
    "response_assembler_user_visible_emission_forbidden",
    "response_assembler_no_persistence_confirmed",
    "response_assembler_no_dna_save_confirmed",
    "response_assembler_no_offline_save_confirmed",
  ];

  // Derive upstream draft ID (mock path: draftId; live sandbox: sandboxRunId)
  const upstreamDraftId: string =
    unsafeReadField<string>(input.draftResult, "draftId") ??
    unsafeReadField<string>(input.draftResult, "sandboxRunId") ??
    input.assemblyRunId;

  const liveLLMCalled: boolean = input.outputContractValidation.liveLLMCalled;

  const resultNotes: string[] = [
    `Assembler version: ${RUNTIME_RESPONSE_ASSEMBLER_BRIDGE_VERSION}.`,
    `Assembly run ID: ${input.assemblyRunId}.`,
    `Upstream draft ID: ${upstreamDraftId}.`,
    `Live LLM called: ${String(liveLLMCalled)}.`,
  ];

  // ── Gate 1: Output contract ────────────────────────────────────────────────

  if (input.outputContractValidation.verdict !== "accepted_for_next_gate") {
    return makeRejectedResult({
      assemblyRunId: input.assemblyRunId,
      verdict: "rejected_output_contract_not_accepted",
      diagnostics: [
        ...invariantDiagnostics,
        "response_assembler_output_contract_rejected",
      ],
      upstreamDraftId,
      liveLLMCalled,
      notes: [
        ...resultNotes,
        `Output contract verdict was '${input.outputContractValidation.verdict}'; expected 'accepted_for_next_gate'.`,
      ],
    });
  }

  // ── Gate 2a: Human review packet ───────────────────────────────────────────

  if (input.wordingGateResult.verdict === "human_review_required") {
    // Assemble only review_recommendation and uncertainty_notice sections
    const reviewSections: RuntimeResponseAssemblerSectionCandidate[] =
      input.draftResult.sectionCandidates
        .filter((s) =>
          HUMAN_REVIEW_SECTION_KINDS.includes(
            s.sectionType as RuntimeResponseAssemblerSectionKind,
          ),
        )
        .map((s) =>
          buildSectionCandidate({
            sectionType: s.sectionType,
            draftText: s.draftText,
            derivedFromDraftId: upstreamDraftId,
          }),
        );

    return {
      assemblyRunId: input.assemblyRunId,
      verdict: "assembled_human_review_packet",
      eligibleForFutureUserVisibleAssembly: false,
      userVisibleOutputEmitted: false,
      userVisibleOutputAllowed: false,
      persistenceUsed: false,
      dnaSavePerformed: false,
      offlineSavePerformed: false,
      sectionCandidates: reviewSections,
      diagnostics: [
        ...invariantDiagnostics,
        "response_assembler_output_contract_confirmed",
        "response_assembler_human_review_packet_created",
      ],
      upstreamDraftId,
      liveLLMCalled,
      neverUserVisible: true,
      notes: [
        ...resultNotes,
        "Wording gate returned human_review_required. Human review packet assembled.",
        "Only review_recommendation and uncertainty_notice sections included.",
        "eligibleForFutureUserVisibleAssembly: false — human review required before any display.",
      ],
    };
  }

  // ── Gate 2b: Wording gate rejection ────────────────────────────────────────

  if (input.wordingGateResult.verdict !== "accepted_for_audit_dry_run") {
    return makeRejectedResult({
      assemblyRunId: input.assemblyRunId,
      verdict: "rejected_wording_gate_not_accepted",
      diagnostics: [
        ...invariantDiagnostics,
        "response_assembler_output_contract_confirmed",
        "response_assembler_wording_gate_rejected",
      ],
      upstreamDraftId,
      liveLLMCalled,
      notes: [
        ...resultNotes,
        `Wording gate verdict was '${input.wordingGateResult.verdict}'; expected 'accepted_for_audit_dry_run'.`,
      ],
    });
  }

  // ── Gate 3: Audit trace ────────────────────────────────────────────────────

  if (input.auditTraceValid !== true) {
    return makeRejectedResult({
      assemblyRunId: input.assemblyRunId,
      verdict: "rejected_audit_trace_invalid",
      diagnostics: [
        ...invariantDiagnostics,
        "response_assembler_output_contract_confirmed",
        "response_assembler_wording_gate_confirmed",
        "response_assembler_audit_trace_invalid",
      ],
      upstreamDraftId,
      liveLLMCalled,
      notes: [
        ...resultNotes,
        "auditTraceValid is not true. Assembly blocked pending valid audit trace.",
      ],
    });
  }

  // ── Gate 4: Diagnostic envelopes ───────────────────────────────────────────

  if (input.diagnosticEnvelopeValid !== true) {
    return makeRejectedResult({
      assemblyRunId: input.assemblyRunId,
      verdict: "rejected_diagnostic_envelope_invalid",
      diagnostics: [
        ...invariantDiagnostics,
        "response_assembler_output_contract_confirmed",
        "response_assembler_wording_gate_confirmed",
        "response_assembler_audit_trace_confirmed",
        "response_assembler_diagnostic_envelope_invalid",
      ],
      upstreamDraftId,
      liveLLMCalled,
      notes: [
        ...resultNotes,
        "diagnosticEnvelopeValid is not true. Assembly blocked pending valid diagnostic envelopes.",
      ],
    });
  }

  // ── All gates passed — build section candidates ────────────────────────────

  const sectionCandidates: RuntimeResponseAssemblerSectionCandidate[] =
    input.draftResult.sectionCandidates.map((s) =>
      buildSectionCandidate({
        sectionType: s.sectionType,
        draftText: s.draftText,
        derivedFromDraftId: upstreamDraftId,
      }),
    );

  // ── Gate 5: Missing sections ───────────────────────────────────────────────

  if (sectionCandidates.length === 0) {
    return makeRejectedResult({
      assemblyRunId: input.assemblyRunId,
      verdict: "rejected_missing_sections",
      diagnostics: [
        ...invariantDiagnostics,
        "response_assembler_output_contract_confirmed",
        "response_assembler_wording_gate_confirmed",
        "response_assembler_audit_trace_confirmed",
        "response_assembler_diagnostic_envelope_confirmed",
        "response_assembler_missing_sections",
      ],
      upstreamDraftId,
      liveLLMCalled,
      notes: [
        ...resultNotes,
        "No section candidates available after all gates passed.",
      ],
    });
  }

  // ── Gate 6: Internal metadata leak ────────────────────────────────────────

  const hasMetadataLeak = sectionCandidates.some((s) => s.containsInternalMetadata);
  if (hasMetadataLeak) {
    return makeRejectedResult({
      assemblyRunId: input.assemblyRunId,
      verdict: "rejected_internal_metadata_leak",
      diagnostics: [
        ...invariantDiagnostics,
        "response_assembler_output_contract_confirmed",
        "response_assembler_wording_gate_confirmed",
        "response_assembler_audit_trace_confirmed",
        "response_assembler_diagnostic_envelope_confirmed",
        "response_assembler_internal_metadata_leak_detected",
      ],
      upstreamDraftId,
      liveLLMCalled,
      notes: [
        ...resultNotes,
        "Internal metadata markers detected in assembled candidates. Assembly rejected.",
        "Sections with internal metadata must not proceed toward user-visible output.",
      ],
    });
  }

  // ── Success ────────────────────────────────────────────────────────────────

  const anyPrefixStripped = sectionCandidates.some((s) => s.internalDraftPrefixRemoved);

  const successDiagnostics: RuntimeResponseAssemblerBridgeDiagnosticCode[] = [
    ...invariantDiagnostics,
    "response_assembler_output_contract_confirmed",
    "response_assembler_wording_gate_confirmed",
    "response_assembler_audit_trace_confirmed",
    "response_assembler_diagnostic_envelope_confirmed",
    "response_assembler_internal_candidate_created",
  ];

  if (anyPrefixStripped) {
    successDiagnostics.push("response_assembler_internal_prefix_stripped");
  }

  return {
    assemblyRunId: input.assemblyRunId,
    verdict: "assembled_internal_candidate",
    eligibleForFutureUserVisibleAssembly: true,
    userVisibleOutputEmitted: false,
    userVisibleOutputAllowed: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    sectionCandidates,
    diagnostics: successDiagnostics,
    upstreamDraftId,
    liveLLMCalled,
    neverUserVisible: true,
    notes: [
      ...resultNotes,
      `Assembled ${String(sectionCandidates.length)} internal section candidate(s).`,
      anyPrefixStripped
        ? "Internal draft prefixes stripped from one or more sections."
        : "No internal prefixes found in section candidates.",
      "eligibleForFutureUserVisibleAssembly: true — but output is still never-user-visible.",
      "Phase 8.2G-7+ required to authorise actual user-visible display.",
      "userVisibleOutputEmitted: false. userVisibleOutputAllowed: false.",
      "persistenceUsed: false. dnaSavePerformed: false. offlineSavePerformed: false.",
    ],
  };
}
