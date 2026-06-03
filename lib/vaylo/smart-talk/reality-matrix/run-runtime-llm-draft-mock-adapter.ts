/**
 * Runtime LLM Draft Mock Adapter (Phase 8.2G-1).
 *
 * Implements `runRuntimeLLMDraftMockAdapter` — a pure deterministic mock
 * that returns typed `RuntimeLLMDraftSectionCandidate` fixtures without
 * calling any live LLM, importing any LLM SDK, or producing any user-visible
 * explanation text.
 *
 * This adapter is the typed boundary between the governance kernel's
 * explanation contract and a future real LLM call. It exists to:
 *  1. Establish the typed contract that Phase 8.2G-2 (output contract validator)
 *     and Phase 8.2G-3 (wording evaluation gate) will consume.
 *  2. Allow regression testing of the downstream validation pipeline before
 *     any live LLM is introduced.
 *  3. Prove that `liveLLMCalled: false` and `userVisibleOutputAllowed: false`
 *     are hardcoded invariants in Phase 8.2G-1.
 *
 * Live LLM blocking:
 *   If `input.adapterMode === "future_live_llm"`, the adapter returns an empty
 *   result with `llm_adapter_live_llm_forbidden` diagnostic. No LLM call is made.
 *   This mode is reserved for Phase 8.2G-5.
 *
 * Unsafe fixture path:
 *   If `input.contractRef === "__mock_unsafe_fixture_test__"`, the adapter
 *   returns a controlled section with `safetyFlags` populated, emits
 *   `llm_adapter_unsafe_fixture_flagged`, and keeps `neverUserVisible: true`.
 *   This path is used only in regression testing (Case 10).
 *
 * Mock text discipline:
 *   All `draftText` values are prefixed with `[MOCK_DRAFT_NEVER_USER_VISIBLE]`.
 *   They are test fixtures — not final wording, not legal text, not user-facing.
 *   They must never be exposed via UI or API.
 *
 * Safety guarantees:
 * - no LLM SDK imported
 * - no OpenAI / Gemini / any API call
 * - no API keys or environment variables
 * - no randomness
 * - no Date/time calls
 * - no file reads
 * - no user data
 * - no user-visible output
 * - liveLLMCalled always false
 * - userVisibleOutputAllowed always false
 * - all output carries neverUserVisible: true
 */

import type {
  RuntimeLLMDraftAdapterDiagnosticCode,
  RuntimeLLMDraftAdapterInput,
  RuntimeLLMDraftAdapterResult,
  RuntimeLLMDraftSectionCandidate,
  RuntimeLLMDraftSectionType,
} from "./runtime-llm-draft-adapter-types";

export const RUNTIME_LLM_DRAFT_MOCK_ADAPTER_VERSION =
  "8.2g-1-runtime-llm-draft-mock-adapter-v1";

/** contractRef value that triggers the controlled unsafe fixture path in regression Case 10. */
export const MOCK_UNSAFE_FIXTURE_CONTRACT_REF = "__mock_unsafe_fixture_test__";

// ── Helpers ───────────────────────────────────────────────────────────────────

function isNonBlank(value: string | undefined | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

// ── Mock section fixture text ─────────────────────────────────────────────────

/**
 * Returns deterministic mock fixture text for a given section type.
 * All text is prefixed with `[MOCK_DRAFT_NEVER_USER_VISIBLE]`.
 * This is not final wording. It is not legal advice. It is not user-facing.
 */
function mockFixtureText(sectionType: RuntimeLLMDraftSectionType): string {
  switch (sectionType) {
    case "document_type_signal":
      return "[MOCK_DRAFT_NEVER_USER_VISIBLE] Document type signal candidate.";
    case "what_this_means":
      return "[MOCK_DRAFT_NEVER_USER_VISIBLE] Meaning candidate placeholder.";
    case "attention_points":
      return "[MOCK_DRAFT_NEVER_USER_VISIBLE] Attention point placeholder.";
    case "next_steps_safe":
      return "[MOCK_DRAFT_NEVER_USER_VISIBLE] Safe next-step placeholder.";
    case "uncertainty_notice":
      return "[MOCK_DRAFT_NEVER_USER_VISIBLE] Uncertainty notice placeholder.";
    case "review_recommendation":
      return "[MOCK_DRAFT_NEVER_USER_VISIBLE] Human review recommendation placeholder.";
    case "blocked_content_notice":
      return "[MOCK_DRAFT_NEVER_USER_VISIBLE] Blocked content placeholder.";
    default: {
      const _exhaustive: never = sectionType;
      void _exhaustive;
      return "[MOCK_DRAFT_NEVER_USER_VISIBLE] Unknown section type placeholder.";
    }
  }
}

// ── Mock section candidate factory ───────────────────────────────────────────

function makeMockSectionCandidate(
  sectionType: RuntimeLLMDraftSectionType,
): RuntimeLLMDraftSectionCandidate {
  return {
    sectionType,
    draftText: mockFixtureText(sectionType),
    safetyFlags: [],
    sourceBound: false,
    neverUserVisible: true,
    notes: [
      "Mock fixture candidate — not final wording, not user-visible.",
      `Adapter version: ${RUNTIME_LLM_DRAFT_MOCK_ADAPTER_VERSION}`,
    ],
  };
}

// ── Unsafe fixture candidate (regression Case 10 only) ───────────────────────

function makeUnsafeFixtureSectionCandidate(): RuntimeLLMDraftSectionCandidate {
  return {
    sectionType: "what_this_means",
    draftText:
      "[MOCK_DRAFT_NEVER_USER_VISIBLE] Controlled unsafe fixture: " +
      "contains_deadline_claim and contains_legal_verdict flags intentionally set.",
    safetyFlags: ["contains_deadline_claim", "contains_legal_verdict"],
    sourceBound: false,
    neverUserVisible: true,
    notes: [
      "Controlled unsafe fixture for regression testing only.",
      "These safety flags must cause the LLM output contract validator " +
        "(Phase 8.2G-2) to block this section.",
      "This candidate is never user-visible.",
    ],
  };
}

// ── Mock adapter ──────────────────────────────────────────────────────────────

/**
 * Returns a `RuntimeLLMDraftAdapterResult` with deterministic mock section
 * candidates for the given input's `allowedSectionTypes`.
 *
 * No live LLM is called. No external services contacted. No user data used.
 * No randomness. No date/time. No file reads.
 *
 * Behavior rules:
 *  1. If `adapterMode === "future_live_llm"`: return blocked result with
 *     empty `sectionCandidates` and `llm_adapter_live_llm_forbidden`.
 *  2. If `adapterMode === "mock"`: return one candidate per allowed section type.
 *  3. If `contractRef` is blank: emit `llm_adapter_missing_contract`.
 *  4. If `contractRef === MOCK_UNSAFE_FIXTURE_CONTRACT_REF`: emit
 *     `llm_adapter_unsafe_fixture_flagged` and include one unsafe section.
 *  5. Always emit `llm_adapter_mock_used` and `llm_adapter_output_never_user_visible`.
 *  6. If `activeForbiddenMoves.length > 0`: emit `llm_adapter_forbidden_move_referenced`.
 *  7. If `activeRequiredConstraints.length > 0`: emit `llm_adapter_required_constraint_referenced`.
 *
 * Pure function — no side effects, no persistence, no logging, no telemetry.
 */
export function runRuntimeLLMDraftMockAdapter(
  input: RuntimeLLMDraftAdapterInput,
): RuntimeLLMDraftAdapterResult {
  const diagnostics: RuntimeLLMDraftAdapterDiagnosticCode[] = [];
  const resultNotes: string[] = [];

  // ── Rule 1 — block future_live_llm mode ───────────────────────────────────

  if (input.adapterMode === "future_live_llm") {
    diagnostics.push("llm_adapter_live_llm_forbidden");
    diagnostics.push("llm_adapter_output_never_user_visible");
    resultNotes.push(
      "Live LLM mode requested but blocked in Phase 8.2G-1. " +
        "Live LLM is not permitted until Phase 8.2G-5.",
    );
    return {
      adapterMode: input.adapterMode,
      accessTier: input.accessTier,
      draftId: `mock-blocked-${input.contractRef || "no-contract"}-${input.accessTier}`,
      sectionCandidates: [],
      appliedForbiddenMoves: input.activeForbiddenMoves,
      appliedRequiredConstraints: input.activeRequiredConstraints,
      diagnostics,
      auditTraceParentIds: input.auditTraceParentIds,
      liveLLMCalled: false,
      userVisibleOutputAllowed: false,
      neverUserVisible: true,
      notes: resultNotes,
    };
  }

  // ── Rule 2 — mock mode: build candidates ──────────────────────────────────

  // Rule 3 — blank contractRef
  if (!isNonBlank(input.contractRef)) {
    diagnostics.push("llm_adapter_missing_contract");
    resultNotes.push(
      "contractRef is blank. No governance boundary contract is associated " +
        "with this draft. The output contract validator (Phase 8.2G-2) will " +
        "treat this as an unverifiable draft.",
    );
  }

  // Rule 4 — unsafe fixture path
  let useUnsafeFixture = false;
  if (input.contractRef === MOCK_UNSAFE_FIXTURE_CONTRACT_REF) {
    diagnostics.push("llm_adapter_unsafe_fixture_flagged");
    useUnsafeFixture = true;
    resultNotes.push(
      "Controlled unsafe fixture path triggered. A section with safety flags " +
        "has been included for regression testing purposes only.",
    );
  }

  // Rule 5 — always emit base diagnostics
  diagnostics.push("llm_adapter_mock_used");
  diagnostics.push("llm_adapter_output_never_user_visible");

  // Rule 6 — forbidden moves
  if (input.activeForbiddenMoves.length > 0) {
    diagnostics.push("llm_adapter_forbidden_move_referenced");
    resultNotes.push(
      `Active forbidden moves propagated: [${input.activeForbiddenMoves.join(", ")}]. ` +
        "The LLM output contract validator must check these.",
    );
  }

  // Rule 7 — required constraints
  if (input.activeRequiredConstraints.length > 0) {
    diagnostics.push("llm_adapter_required_constraint_referenced");
    resultNotes.push(
      `Active required constraints propagated: [${input.activeRequiredConstraints.join(", ")}]. ` +
        "The LLM output contract validator must verify coverage.",
    );
  }

  // Build section candidates: one per allowedSectionType
  const sectionCandidates: RuntimeLLMDraftSectionCandidate[] = [];

  for (const sectionType of input.allowedSectionTypes) {
    sectionCandidates.push(makeMockSectionCandidate(sectionType));
  }

  // Unsafe fixture: replace what_this_means candidate if present, or append
  if (useUnsafeFixture) {
    const unsafeCandidate = makeUnsafeFixtureSectionCandidate();
    const existingIdx = sectionCandidates.findIndex(
      (c) => c.sectionType === "what_this_means",
    );
    if (existingIdx >= 0) {
      sectionCandidates[existingIdx] = unsafeCandidate;
    } else {
      sectionCandidates.push(unsafeCandidate);
    }
  }

  // Build deterministic draftId (no randomness, no date)
  const draftId = `mock-${input.adapterMode}-${input.accessTier}-${input.contractRef || "no-contract"}-${input.allowedSectionTypes.length}s`;

  resultNotes.push(
    `Mock adapter produced ${sectionCandidates.length} section candidate(s). ` +
      "All output is never-user-visible. Adapter version: " +
      RUNTIME_LLM_DRAFT_MOCK_ADAPTER_VERSION,
  );
  resultNotes.push(
    "liveLLMCalled: false — no LLM was called. " +
      "userVisibleOutputAllowed: false — output must not reach any UI or API response.",
  );

  return {
    adapterMode: input.adapterMode,
    accessTier: input.accessTier,
    draftId,
    sectionCandidates,
    appliedForbiddenMoves: input.activeForbiddenMoves,
    appliedRequiredConstraints: input.activeRequiredConstraints,
    diagnostics,
    auditTraceParentIds: input.auditTraceParentIds,
    liveLLMCalled: false,
    userVisibleOutputAllowed: false,
    neverUserVisible: true,
    notes: resultNotes,
  };
}
