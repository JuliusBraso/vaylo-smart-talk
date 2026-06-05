/**
 * Runtime Live LLM Sandbox types (Phase 8.2G-5).
 *
 * Defines the type boundary for the first strictly sandboxed live LLM call path.
 * A live LLM call is only possible when ALL of the following hold simultaneously:
 *
 *   1. `input.allowLiveCall === true`
 *   2. `fixture.syntheticOnly === true`
 *   3. `fixture.neverContainsRealPii === true`
 *   4. `fixture.neverUserVisible === true`
 *   5. `provider !== "unavailable"` and `provider !== "mock_fallback"`
 *   6. `OPENAI_API_KEY` env var is present at runtime
 *
 * This is NOT a production integration.
 * This is NOT wired to Smart Talk API routes.
 * This is NOT wired to user documents or OCR.
 * This is NOT allowed to persist or log any LLM output.
 * This is NOT allowed to expose any draft text to users.
 *
 * Modeling gap (Phase 8.2G-5A):
 *   `RuntimeLLMDraftAdapterResult` (Phase 8.2G-1) carries `liveLLMCalled: false`
 *   as a literal type, and `validateRuntimeLLMOutputContract` (Phase 8.2G-2) rejects
 *   `adapterMode: "future_live_llm"`. When the sandbox makes a live call
 *   (`liveLLMCalled: true`), the result cannot be directly fed into the 8.2G-2
 *   validator without a type extension. Phase 8.2G-5A will resolve this by extending
 *   the adapter result type or introducing a new validator branch.
 *   Until then, only non-live results (mock_fallback, unavailable) can be converted
 *   through `convertLiveSandboxResultToDraftAdapterResult`.
 *
 * Safety guarantees:
 * - userVisibleOutputAllowed is always literal false
 * - persistenceUsed is always literal false
 * - realUserInputUsed is always literal false
 * - neverUserVisible is always true
 * - no API keys committed
 * - no new environment files created
 * - no Smart Talk routes touched
 * - no UI touched
 */

import type {
  RuntimeLLMDraftSectionType,
  RuntimeLLMDraftSafetyFlag,
  RuntimeLLMAdapterAccessTier,
  RuntimeLLMDraftSectionCandidate,
} from "./runtime-llm-draft-adapter-types";

export type {
  RuntimeLLMDraftSectionType,
  RuntimeLLMDraftSafetyFlag,
  RuntimeLLMAdapterAccessTier,
  RuntimeLLMDraftSectionCandidate,
};

// ── Provider ───────────────────────────────────────────────────────────────────

/**
 * The live LLM provider for the sandbox adapter.
 *
 * - `openai`           — uses the existing `OPENAI_API_KEY` env var and the
 *                        same `fetch`-based call pattern as `run-smart-talk.ts`.
 *                        Only proceeds if all sandbox guards pass.
 * - `unavailable`      — explicitly marks the provider as not available;
 *                        always returns `skipped_provider_unavailable`.
 * - `mock_fallback`    — returns deterministic mock section candidates without
 *                        any live LLM call; `liveLLMCalled: false`.
 */
export type RuntimeLiveLLMSandboxProvider = "openai" | "unavailable" | "mock_fallback";

// ── Corpus kind ────────────────────────────────────────────────────────────────

/**
 * The kind of corpus fixture used in this sandbox call.
 *
 * - `synthetic_redacted_corpus`     — fixture drawn from `redacted-corpus-registry.ts`
 *                                     or `controlled-corpus/scenarios.ts`.
 * - `controlled_governance_fixture` — fixture defined inline in a governance scaffold.
 * - `imported_static_fixture`       — fixture imported from an approved static fixture file.
 */
export type RuntimeLiveLLMSandboxCorpusKind =
  | "synthetic_redacted_corpus"
  | "controlled_governance_fixture"
  | "imported_static_fixture";

// ── Disposition ────────────────────────────────────────────────────────────────

/**
 * The outcome of a sandbox adapter invocation.
 *
 * - `completed_live_sandbox_call`        — live provider was called and output
 *                                          passed shape validation.
 * - `skipped_provider_unavailable`       — provider is `unavailable` or
 *                                          `mock_fallback`; no live call made.
 * - `blocked_non_synthetic_input`        — `syntheticOnly !== true` or
 *                                          `neverContainsRealPii !== true`.
 * - `blocked_missing_api_key`            — `OPENAI_API_KEY` env var absent.
 * - `blocked_missing_provider_dependency`— provider SDK or runtime dependency
 *                                          unavailable (reserved for future SDK-based providers).
 * - `blocked_prompt_contract_violation`  — `allowLiveCall !== true` or
 *                                          `fixture.neverUserVisible !== true`.
 * - `failed_provider_error`             — provider returned an HTTP error or
 *                                          threw during the call.
 * - `failed_output_shape_violation`     — provider returned output that failed
 *                                          shape validation.
 */
export type RuntimeLiveLLMSandboxDisposition =
  | "completed_live_sandbox_call"
  | "skipped_provider_unavailable"
  | "blocked_non_synthetic_input"
  | "blocked_missing_api_key"
  | "blocked_missing_provider_dependency"
  | "blocked_prompt_contract_violation"
  | "failed_provider_error"
  | "failed_output_shape_violation";

// ── Diagnostic codes ───────────────────────────────────────────────────────────

/**
 * Never-user-visible diagnostic codes emitted by the sandbox adapter.
 *
 * Progress markers:
 * - `live_sandbox_started`                    — adapter entry confirmed.
 * - `live_sandbox_provider_openai_selected`   — OpenAI provider selected.
 * - `live_sandbox_prompt_contract_built`      — prompt structure built.
 * - `live_sandbox_call_completed`             — provider call returned.
 * - `live_sandbox_output_shape_validated`     — output passed shape check.
 * - `live_sandbox_ready_for_output_contract_validation` — ready for 8.2G-2.
 *
 * Blocking / failure markers:
 * - `live_sandbox_provider_unavailable`       — provider is unavailable/mock_fallback.
 * - `live_sandbox_api_key_missing`            — no OPENAI_API_KEY found.
 * - `live_sandbox_dependency_missing`         — provider SDK unavailable (future).
 * - `live_sandbox_non_synthetic_input_blocked`— non-synthetic fixture blocked.
 * - `live_sandbox_output_shape_invalid`       — output failed shape validation.
 * - `live_sandbox_provider_error`             — provider returned an error.
 *
 * Invariant confirmations:
 * - `live_sandbox_no_user_visible_output`     — no user-visible output produced.
 * - `live_sandbox_no_persistence`             — no persistence used.
 * - `live_sandbox_no_real_user_input`         — no real user input processed.
 */
export type RuntimeLiveLLMSandboxDiagnosticCode =
  | "live_sandbox_started"
  | "live_sandbox_provider_openai_selected"
  | "live_sandbox_provider_unavailable"
  | "live_sandbox_api_key_missing"
  | "live_sandbox_dependency_missing"
  | "live_sandbox_non_synthetic_input_blocked"
  | "live_sandbox_prompt_contract_built"
  | "live_sandbox_call_completed"
  | "live_sandbox_output_shape_validated"
  | "live_sandbox_output_shape_invalid"
  | "live_sandbox_provider_error"
  | "live_sandbox_no_user_visible_output"
  | "live_sandbox_no_persistence"
  | "live_sandbox_no_real_user_input"
  | "live_sandbox_ready_for_output_contract_validation";

// ── Fixture ────────────────────────────────────────────────────────────────────

/**
 * A controlled synthetic fixture for a live LLM sandbox call.
 *
 * `fixtureId`               — opaque identifier for this fixture.
 * `corpusKind`              — the kind of corpus this fixture belongs to.
 * `syntheticOnly`           — must be `true`; non-synthetic fixtures are blocked.
 * `sourceTextRedacted`      — the synthetic/redacted text sent as fixture input.
 *                             Must not contain real PII or real user documents.
 * `expectedAccessTier`      — determines which sections the adapter may produce.
 * `allowedSectionTypes`     — section types allowed in the response.
 * `activeForbiddenMoves`    — moves that must not appear in any draft candidate.
 * `activeRequiredConstraints`— constraints that must be observed in the draft.
 * `uncertaintyRequired`     — whether an `uncertainty_notice` section is required.
 * `humanReviewRequired`     — whether a `review_recommendation` section is required.
 * `neverContainsRealPii`    — must be `true`; compile-time invariant.
 * `neverUserVisible`        — must be `true`; compile-time invariant.
 * `notes`                   — optional never-user-visible governance notes.
 */
export interface RuntimeLiveLLMSandboxFixture {
  readonly fixtureId: string;
  readonly corpusKind: RuntimeLiveLLMSandboxCorpusKind;
  readonly syntheticOnly: boolean;
  readonly sourceTextRedacted: string;
  readonly expectedAccessTier: "free_preview" | "paid_explanation";
  readonly allowedSectionTypes: readonly RuntimeLLMDraftSectionType[];
  readonly activeForbiddenMoves: readonly string[];
  readonly activeRequiredConstraints: readonly string[];
  readonly uncertaintyRequired: boolean;
  readonly humanReviewRequired: boolean;
  readonly neverContainsRealPii: true;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Input ──────────────────────────────────────────────────────────────────────

/**
 * Input to `runRuntimeLiveLLMSandboxAdapter`.
 *
 * `fixture`        — the controlled synthetic corpus fixture to use.
 * `provider`       — the live LLM provider to use.
 * `model`          — the model identifier (e.g. `"gpt-4o-mini"`). Overridden
 *                    by `OPENAI_SMART_TALK_MODEL` env var if present.
 * `sandboxRunId`   — opaque deterministic identifier for this sandbox run.
 * `allowLiveCall`  — must be `true` to permit any live provider call.
 *                    Set to `false` to force a guard-blocked path.
 * `neverUserVisible`— compile-time invariant.
 * `notes`          — optional governance notes.
 */
export interface RuntimeLiveLLMSandboxInput {
  readonly fixture: RuntimeLiveLLMSandboxFixture;
  readonly provider: RuntimeLiveLLMSandboxProvider;
  readonly model: string;
  readonly sandboxRunId: string;
  readonly allowLiveCall: boolean;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Section candidate ──────────────────────────────────────────────────────────

/**
 * A single draft section candidate returned by the live LLM sandbox adapter.
 *
 * `sectionType`   — the section type from `fixture.allowedSectionTypes`.
 * `draftText`     — draft text produced by the provider. NEVER user-visible.
 *                   Always prefixed with `[LIVE_SANDBOX_DRAFT_NEVER_USER_VISIBLE]`.
 * `safetyFlags`   — any safety flags detected on this candidate.
 * `sourceBound`   — `true` for sandbox calls; the fixture text is the source.
 * `neverUserVisible`— compile-time invariant. Draft text must never reach a user.
 * `notes`         — optional governance notes.
 */
export interface RuntimeLiveLLMSandboxSectionCandidate {
  readonly sectionType: RuntimeLLMDraftSectionType;
  readonly draftText: string;
  readonly safetyFlags: readonly RuntimeLLMDraftSafetyFlag[];
  readonly sourceBound: boolean;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Sandbox result ─────────────────────────────────────────────────────────────

/**
 * The never-user-visible result of `runRuntimeLiveLLMSandboxAdapter`.
 *
 * `sandboxRunId`          — echoes the input `sandboxRunId`.
 * `provider`              — the provider used.
 * `model`                 — the model used (may differ from input if overridden by env).
 * `disposition`           — the outcome of this sandbox invocation.
 * `fixtureId`             — the fixture ID from the input.
 * `sectionCandidates`     — draft section candidates. Empty unless disposition
 *                           is `completed_live_sandbox_call` or `skipped_provider_unavailable`
 *                           with mock_fallback.
 * `diagnostics`           — ordered never-user-visible diagnostic codes.
 * `liveLLMCalled`         — `true` only when all sandbox guards passed AND the
 *                           provider was actually called successfully.
 * `userVisibleOutputAllowed`— always literal `false`.
 * `persistenceUsed`       — always literal `false`.
 * `realUserInputUsed`     — always literal `false`.
 * `neverUserVisible`      — compile-time invariant.
 * `notes`                 — optional never-user-visible governance notes.
 */
export interface RuntimeLiveLLMSandboxResult {
  readonly sandboxRunId: string;
  readonly provider: RuntimeLiveLLMSandboxProvider;
  readonly model: string;
  readonly disposition: RuntimeLiveLLMSandboxDisposition;
  readonly fixtureId: string;
  readonly sectionCandidates: readonly RuntimeLiveLLMSandboxSectionCandidate[];
  readonly diagnostics: readonly RuntimeLiveLLMSandboxDiagnosticCode[];
  readonly liveLLMCalled: boolean;
  readonly userVisibleOutputAllowed: false;
  readonly persistenceUsed: false;
  readonly realUserInputUsed: false;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Sandbox draft candidate result (live-call modeling gap) ────────────────────

/**
 * Draft candidate result for when a live LLM was actually called.
 *
 * This type exists because `RuntimeLLMDraftAdapterResult` (Phase 8.2G-1) carries
 * `liveLLMCalled: false` as a literal type, making it impossible to represent a
 * live-called result in that shape. Additionally, `validateRuntimeLLMOutputContract`
 * (Phase 8.2G-2) currently rejects `adapterMode: "future_live_llm"`.
 *
 * Modeling gap resolution plan (Phase 8.2G-5A):
 * - Extend `RuntimeLLMDraftAdapterResult` to support `liveLLMCalled: true` OR
 * - Introduce a parallel `RuntimeLiveLLMDraftAdapterResult` accepted by 8.2G-2.
 * Until then, this type holds the live draft candidates but cannot be directly
 * fed into the 8.2G-2 validator without a type extension.
 *
 * `liveLLMCalled: true`         — literal true; confirms provider was called.
 * `adapterMode: "future_live_llm"` — literal; marks this as a live-path result.
 * `userVisibleOutputAllowed: false`— literal false; output must not reach users.
 * `neverUserVisible: true`      — invariant; always internal.
 * `modelingGapNote`             — documents the 8.2G-5A resolution requirement.
 */
export interface RuntimeLiveLLMSandboxDraftCandidateResult {
  readonly sandboxRunId: string;
  readonly adapterMode: "future_live_llm";
  readonly accessTier: RuntimeLLMAdapterAccessTier;
  readonly fixtureId: string;
  readonly sectionCandidates: readonly RuntimeLiveLLMSandboxSectionCandidate[];
  readonly appliedForbiddenMoves: readonly string[];
  readonly appliedRequiredConstraints: readonly string[];
  readonly liveLLMCalled: true;
  readonly userVisibleOutputAllowed: false;
  readonly neverUserVisible: true;
  readonly modelingGapNote: string;
  readonly notes?: readonly string[];
}
