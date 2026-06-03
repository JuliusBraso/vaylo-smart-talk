/**
 * Runtime LLM Draft Adapter types (Phase 8.2G-1).
 *
 * Defines the typed boundary between the governance kernel's explanation
 * contract layer and a future LLM draft generation call.
 *
 * This phase is mock-only. No live LLM is called. No user-visible output
 * is produced. All types model the shape of future LLM interaction while
 * preserving every non-negotiable governance invariant from Epoch 8.2F.
 *
 * Intended future flow (Epoch 8.2G):
 *   1. The explanation contract builder produces an ExplanationBoundary with
 *      active forbidden moves, required constraints, and uncertainty posture.
 *   2. The LLM adapter (Phase 8.2G-1: mock; Phase 8.2G-5: live) receives a
 *      RuntimeLLMDraftAdapterInput derived from that boundary.
 *   3. The adapter returns RuntimeLLMDraftAdapterResult containing typed
 *      RuntimeLLMDraftSectionCandidate instances — not final user text.
 *   4. The LLM output contract validator (Phase 8.2G-2) validates the result.
 *   5. The wording evaluation gate (Phase 8.2G-3) inspects section wording.
 *   6. Only if all gates pass may the response assembler (Phase 8.2G-6) produce
 *      user-visible output.
 *
 * Safety guarantees:
 * - no LLM SDK imported
 * - no API keys
 * - no environment variables
 * - no user-visible output
 * - no final explanation text
 * - no legal conclusions
 * - no deadline calculation
 * - no amount extraction
 * - all types carry neverUserVisible: true where applicable
 * - liveLLMCalled is always literal false in this phase
 * - userVisibleOutputAllowed is always literal false in this phase
 */

// ── Adapter mode ───────────────────────────────────────────────────────────────

/**
 * The operational mode of the LLM draft adapter.
 *
 * - `mock`            — the adapter returns deterministic fixture candidates.
 *                       No LLM is called. Used in Phases 8.2G-1 through 8.2G-4.
 * - `future_live_llm` — signals intent to call a real LLM. BLOCKED in Phase 8.2G-1.
 *                       The mock adapter will refuse to proceed and will emit
 *                       `llm_adapter_live_llm_forbidden`.
 */
export type RuntimeLLMAdapterMode = "mock" | "future_live_llm";

// ── Access tier ────────────────────────────────────────────────────────────────

/**
 * The explanation access tier governing which sections the adapter may produce.
 *
 * - `free_preview`       — only free-tier sections are permitted.
 * - `paid_explanation`   — full paid-tier sections are permitted.
 */
export type RuntimeLLMAdapterAccessTier = "free_preview" | "paid_explanation";

// ── Draft section type ─────────────────────────────────────────────────────────

/**
 * The structural type of a draft explanation section candidate.
 *
 * These correspond to the explanation section categories in the governance
 * constitution. The adapter may only produce sections that appear in the
 * `allowedSectionTypes` list of the input.
 *
 * - `document_type_signal`  — what kind of document this is.
 * - `what_this_means`       — what the document content means for the user.
 * - `attention_points`      — key items the user should pay attention to.
 * - `next_steps_safe`       — safe (non-legal-advice) actions the user may take.
 * - `uncertainty_notice`    — explicit acknowledgment of what the system cannot know.
 * - `review_recommendation` — recommendation to seek professional or human review.
 * - `blocked_content_notice`— informs the user that certain content has been
 *                             withheld for governance reasons (no detail exposed).
 */
export type RuntimeLLMDraftSectionType =
  | "document_type_signal"
  | "what_this_means"
  | "attention_points"
  | "next_steps_safe"
  | "uncertainty_notice"
  | "review_recommendation"
  | "blocked_content_notice";

// ── Draft safety flag ──────────────────────────────────────────────────────────

/**
 * Safety flags that can be detected on a draft section candidate.
 *
 * The LLM output contract validator (Phase 8.2G-2) will use these flags to
 * determine whether a section may proceed downstream. In Phase 8.2G-1 (mock),
 * these flags are populated only on controlled unsafe fixture sections.
 *
 * Any non-empty `safetyFlags` array on a real section means that section
 * must be blocked by the output contract validator.
 *
 * - `contains_deadline_claim`        — section claims a specific legal deadline.
 * - `contains_enforcement_claim`     — section states enforcement will/will not occur.
 * - `contains_legal_verdict`         — section takes a definitive legal verdict posture.
 * - `contains_false_reassurance`     — section minimizes documented legal risk.
 * - `contains_calculated_amount`     — section contains a calculated monetary amount.
 * - `contains_cross_lane_merge`      — section blends free/paid or domain-specific lanes.
 * - `contains_panic_language`        — section uses excessively alarming language.
 * - `contains_speculation_as_fact`   — section presents uncertain inference as fact.
 * - `contains_dry_run_as_fact`       — section exposes internal governance metadata.
 * - `contains_user_visible_diagnostic`— section exposes diagnostic codes or trace IDs.
 */
export type RuntimeLLMDraftSafetyFlag =
  | "contains_deadline_claim"
  | "contains_enforcement_claim"
  | "contains_legal_verdict"
  | "contains_false_reassurance"
  | "contains_calculated_amount"
  | "contains_cross_lane_merge"
  | "contains_panic_language"
  | "contains_speculation_as_fact"
  | "contains_dry_run_as_fact"
  | "contains_user_visible_diagnostic";

// ── Adapter diagnostic codes ───────────────────────────────────────────────────

/**
 * Never-user-visible diagnostic codes emitted by the draft adapter.
 *
 * - `llm_adapter_mock_used`                  — the mock adapter was used (normal in 8.2G-1).
 * - `llm_adapter_live_llm_forbidden`         — `future_live_llm` mode was requested but
 *                                              blocked; live LLM is not permitted in this phase.
 * - `llm_adapter_missing_contract`           — `contractRef` is blank; no governance
 *                                              boundary can be associated.
 * - `llm_adapter_missing_access_tier`        — `accessTier` could not be determined.
 * - `llm_adapter_output_never_user_visible`  — confirms the output carries the invariant.
 * - `llm_adapter_unsafe_fixture_flagged`     — a controlled unsafe mock fixture path was
 *                                              triggered; safety flags were set on a section.
 * - `llm_adapter_forbidden_move_referenced`  — active forbidden moves were present and
 *                                              have been propagated to the result.
 * - `llm_adapter_required_constraint_referenced`— active required constraints were present
 *                                              and have been propagated to the result.
 */
export type RuntimeLLMDraftAdapterDiagnosticCode =
  | "llm_adapter_mock_used"
  | "llm_adapter_live_llm_forbidden"
  | "llm_adapter_missing_contract"
  | "llm_adapter_missing_access_tier"
  | "llm_adapter_output_never_user_visible"
  | "llm_adapter_unsafe_fixture_flagged"
  | "llm_adapter_forbidden_move_referenced"
  | "llm_adapter_required_constraint_referenced";

// ── Adapter input ──────────────────────────────────────────────────────────────

/**
 * Input to `runRuntimeLLMDraftMockAdapter`.
 *
 * Derived from the governance kernel's ExplanationBoundary and simulation
 * output. The adapter uses this to select which mock section candidates to
 * return and to propagate governance metadata to the result.
 *
 * `adapterMode`              — `mock` (permitted) or `future_live_llm` (blocked).
 * `accessTier`               — determines which sections may be produced.
 * `contractRef`              — opaque reference to the governing explanation contract.
 * `allowedSectionTypes`      — section types the adapter may produce.
 * `activeForbiddenMoves`     — forbidden move names active in the explanation contract.
 * `activeRequiredConstraints`— required constraint names active in the explanation contract.
 * `uncertaintyRequired`      — whether an `uncertainty_notice` section is mandatory.
 * `humanReviewRequired`      — whether a `review_recommendation` section is mandatory.
 * `auditTraceParentIds`      — parent trace IDs to propagate to the result.
 * `diagnosticEnvelopeRefs`   — optional diagnostic envelope references for correlation.
 * `neverUserVisible`         — compile-time invariant.
 * `notes`                    — optional governance notes.
 */
export interface RuntimeLLMDraftAdapterInput {
  readonly adapterMode: RuntimeLLMAdapterMode;
  readonly accessTier: RuntimeLLMAdapterAccessTier;
  readonly contractRef: string;
  readonly allowedSectionTypes: readonly RuntimeLLMDraftSectionType[];
  readonly activeForbiddenMoves: readonly string[];
  readonly activeRequiredConstraints: readonly string[];
  readonly uncertaintyRequired: boolean;
  readonly humanReviewRequired: boolean;
  readonly auditTraceParentIds: readonly string[];
  readonly diagnosticEnvelopeRefs?: readonly string[];
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Section candidate ──────────────────────────────────────────────────────────

/**
 * A single draft section candidate returned by the adapter.
 *
 * `sectionType`   — the section type from `allowedSectionTypes`.
 * `draftText`     — mock fixture text. NEVER user-visible. NEVER final explanation.
 *                   Always prefixed with `[MOCK_DRAFT_NEVER_USER_VISIBLE]`.
 *                   To be validated by Phase 8.2G-2 before any downstream use.
 * `safetyFlags`   — safety flags detected on this section. Non-empty = must be blocked.
 * `sourceBound`   — `true` if the section text is bound to a real source document.
 *                   Always `false` in mock mode.
 * `neverUserVisible` — compile-time invariant. Mock text must never reach a user.
 * `notes`         — optional governance notes.
 */
export interface RuntimeLLMDraftSectionCandidate {
  readonly sectionType: RuntimeLLMDraftSectionType;
  readonly draftText: string;
  readonly safetyFlags: readonly RuntimeLLMDraftSafetyFlag[];
  readonly sourceBound: boolean;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Adapter result ─────────────────────────────────────────────────────────────

/**
 * The never-user-visible result of `runRuntimeLLMDraftMockAdapter`.
 *
 * `adapterMode`           — the mode used; always `mock` when `liveLLMCalled` is false.
 * `accessTier`            — the access tier from the input.
 * `draftId`               — opaque deterministic ID for this draft candidate set.
 * `sectionCandidates`     — the draft section candidates. Never user-visible.
 *                           Empty if `adapterMode === "future_live_llm"` (blocked).
 * `appliedForbiddenMoves` — forbidden moves propagated from the input.
 * `appliedRequiredConstraints`— required constraints propagated from the input.
 * `diagnostics`           — never-user-visible adapter diagnostic codes.
 * `auditTraceParentIds`   — parent trace IDs propagated from the input.
 * `liveLLMCalled`         — always literal `false` in Phase 8.2G-1.
 * `userVisibleOutputAllowed`— always literal `false` in Phase 8.2G-1.
 * `neverUserVisible`      — compile-time invariant.
 * `notes`                 — optional governance notes.
 */
export interface RuntimeLLMDraftAdapterResult {
  readonly adapterMode: RuntimeLLMAdapterMode;
  readonly accessTier: RuntimeLLMAdapterAccessTier;
  readonly draftId: string;
  readonly sectionCandidates: readonly RuntimeLLMDraftSectionCandidate[];
  readonly appliedForbiddenMoves: readonly string[];
  readonly appliedRequiredConstraints: readonly string[];
  readonly diagnostics: readonly RuntimeLLMDraftAdapterDiagnosticCode[];
  readonly auditTraceParentIds: readonly string[];
  readonly liveLLMCalled: false;
  readonly userVisibleOutputAllowed: false;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}
