/**
 * Controlled Live Text Adapter (Phase 8.2H-3).
 *
 * Implements `runControlledLiveTextAdapter` — a pure function that converts a
 * `RealTextRedactionBoundaryAccepted` object into a `ControlledLiveTextAdapterResult`
 * containing governance draft section candidates eligible for future output
 * contract validation (Phase 8.2H-4+).
 *
 * The adapter wraps already-redacted text only. It does NOT:
 * - answer the user's input
 * - summarise, translate, or paraphrase the text
 * - generate any new prose
 * - call any external service or model
 * - persist anything
 * - emit user-visible output
 *
 * All section `draftText` values carry the required internal prefix
 * `[CONTROLLED_LIVE_TEXT_DRAFT_NEVER_USER_VISIBLE]` and a post-build
 * invariant check enforces this before the result is returned.
 *
 * Safety invariants (all literal types on the result):
 * - acceptedForLLM: false
 * - acceptedForRuntimePipeline: false
 * - acceptedForUserVisibleOutput: false
 * - liveLLMCalled: false
 * - apiRouteTouched: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - userVisibleOutputEmitted: false
 * - neverUserVisible: true
 */

import type {
  ControlledLiveTextAdapterDiagnosticCode,
  ControlledLiveTextAdapterInput,
  ControlledLiveTextAdapterMode,
  ControlledLiveTextAdapterResult,
  ControlledLiveTextAdapterSectionCandidate,
  ControlledLiveTextAdapterVerdict,
} from "./controlled-live-text-adapter-types";

export const CONTROLLED_LIVE_TEXT_ADAPTER_VERSION =
  "8.2h-3-controlled-live-text-adapter-v1";

/** Prefix required on every section draftText produced by this adapter. */
export const CONTROLLED_LIVE_DRAFT_PREFIX =
  "[CONTROLLED_LIVE_TEXT_DRAFT_NEVER_USER_VISIBLE]";

// ── Rejected result builder ───────────────────────────────────────────────────

function makeRejected(
  adapterRunId: string,
  verdict: ControlledLiveTextAdapterVerdict,
  diagnostics: ControlledLiveTextAdapterDiagnosticCode[],
  notes?: string[],
): ControlledLiveTextAdapterResult {
  return {
    adapterRunId,
    verdict,
    adapterMode: null,
    sectionCandidates: [],
    diagnostics,
    adaptedForOutputContractValidation: false,
    acceptedForLLM: false,
    acceptedForRuntimePipeline: false,
    acceptedForUserVisibleOutput: false,
    liveLLMCalled: false,
    apiRouteTouched: false,
    uiTouched: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    userVisibleOutputEmitted: false,
    neverUserVisible: true,
    notes,
  };
}

// ── Main adapter function ─────────────────────────────────────────────────────

/**
 * Converts a validated, redacted real text input into a controlled governance
 * draft candidate for future output contract validation.
 *
 * Only `redactedText` from the accepted redaction boundary is used.
 * Raw user input is not accessible at this layer.
 *
 * Pure function — no external calls, no logging, no persistence.
 */
export function runControlledLiveTextAdapter(
  input: ControlledLiveTextAdapterInput,
): ControlledLiveTextAdapterResult {
  const { adapterRunId } = input;

  const diagnostics: ControlledLiveTextAdapterDiagnosticCode[] = [
    "controlled_live_text_adapter_started",
    "controlled_live_text_adapter_no_live_llm_confirmed",
    "controlled_live_text_adapter_no_persistence_confirmed",
    "controlled_live_text_adapter_no_dna_save_confirmed",
    "controlled_live_text_adapter_no_offline_save_confirmed",
    "controlled_live_text_adapter_no_user_visible_output_confirmed",
  ];

  // Guard — redaction acceptance check
  if (
    input.redactionAccepted === null ||
    input.redactionAccepted.acceptedForControlledLiveAdapter !== true
  ) {
    diagnostics.push("controlled_live_text_adapter_rejected_redaction_not_accepted");
    return makeRejected(
      adapterRunId,
      "rejected_redaction_not_accepted",
      diagnostics,
      ["redactionAccepted must be non-null with acceptedForControlledLiveAdapter: true."],
    );
  }
  diagnostics.push("controlled_live_text_adapter_redaction_confirmed");

  // Use only redacted text — never raw input
  const redactedText = input.redactionAccepted.redactedText;

  // Guard — empty redacted text
  if (redactedText.trim().length === 0) {
    diagnostics.push("controlled_live_text_adapter_rejected_empty_redacted_text");
    return makeRejected(
      adapterRunId,
      "rejected_empty_redacted_text",
      diagnostics,
      ["Redacted text is empty after trimming."],
    );
  }

  // Mode mapping
  let adapterMode: ControlledLiveTextAdapterMode;
  if (input.sourceInputMode === "real_text_guarded") {
    adapterMode = "guarded_real_text";
  } else if (input.sourceInputMode === "real_question_guarded") {
    adapterMode = "guarded_real_question";
  } else {
    diagnostics.push("controlled_live_text_adapter_rejected_unmapped_input_mode");
    return makeRejected(
      adapterRunId,
      "rejected_unmapped_input_mode",
      diagnostics,
      [`sourceInputMode "${String(input.sourceInputMode)}" does not map to a known ControlledLiveTextAdapterMode.`],
    );
  }
  diagnostics.push("controlled_live_text_adapter_mode_mapped");

  // Section candidate creation — wrap redacted text only, no generation
  const draftText = `${CONTROLLED_LIVE_DRAFT_PREFIX} ${redactedText}`;

  const candidate: ControlledLiveTextAdapterSectionCandidate = {
    sectionType: "what_this_means",
    draftText,
    sourceBound: true,
    safetyFlags: [],
    neverUserVisible: true,
    notes: [
      "Adapter wraps redacted text only. No answer, summary, or generated prose.",
      `Adapter mode: ${adapterMode}.`,
    ],
  };
  diagnostics.push("controlled_live_text_adapter_draft_created");

  const sectionCandidates: ControlledLiveTextAdapterSectionCandidate[] = [candidate];

  // Post-build invariant check: every section must carry the required prefix and neverUserVisible
  for (const sc of sectionCandidates) {
    if (
      !sc.draftText.startsWith(CONTROLLED_LIVE_DRAFT_PREFIX) ||
      sc.neverUserVisible !== true
    ) {
      diagnostics.push("controlled_live_text_adapter_rejected_invariant_violation");
      return makeRejected(
        adapterRunId,
        "rejected_adapter_invariant_violation",
        diagnostics,
        [
          "Post-build invariant check failed: a section candidate is missing the required prefix or neverUserVisible flag.",
          "Adapter result rejected.",
        ],
      );
    }
  }

  diagnostics.push("controlled_live_text_adapter_adapted_for_output_contract_validation");

  return {
    adapterRunId,
    verdict: "adapted_for_output_contract_validation",
    adapterMode,
    sectionCandidates,
    diagnostics,
    adaptedForOutputContractValidation: true,
    acceptedForLLM: false,
    acceptedForRuntimePipeline: false,
    acceptedForUserVisibleOutput: false,
    liveLLMCalled: false,
    apiRouteTouched: false,
    uiTouched: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    userVisibleOutputEmitted: false,
    neverUserVisible: true,
    notes: [
      `Adapter version: ${CONTROLLED_LIVE_TEXT_ADAPTER_VERSION}.`,
      `Adapter run ID: ${adapterRunId}.`,
      `Adapter mode: ${adapterMode}.`,
      `Section candidates: ${String(sectionCandidates.length)}.`,
      "Adapted for output contract validation only. Not yet accepted for LLM or runtime pipeline.",
    ],
  };
}
