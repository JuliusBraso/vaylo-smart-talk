/**
 * Runtime Live LLM Sandbox adapter (Phase 8.2G-5).
 *
 * Implements the first strictly sandboxed live LLM call path using the same
 * `fetch`-based OpenAI integration pattern as `run-smart-talk.ts`. No external
 * SDK is imported. The `OPENAI_API_KEY` and `OPENAI_SMART_TALK_MODEL` env vars
 * are read at runtime only, inside the function body.
 *
 * Guard chain (all must pass before any live call):
 *  1. `input.allowLiveCall === true`
 *  2. `fixture.syntheticOnly === true`
 *  3. `fixture.neverContainsRealPii === true` (runtime defensive check)
 *  4. `fixture.neverUserVisible === true` (runtime defensive check)
 *  5. `provider !== "unavailable"` and `provider !== "mock_fallback"`
 *  6. `process.env.OPENAI_API_KEY` is non-blank
 *
 * Modeling gap (Phase 8.2G-5A):
 *   `RuntimeLLMDraftAdapterResult.liveLLMCalled: false` is a literal type.
 *   When `liveLLMCalled === true`, `convertLiveSandboxResultToDraftAdapterResult`
 *   cannot produce a `RuntimeLLMDraftAdapterResult` without lying about the
 *   literal. Instead it returns a `RuntimeLiveLLMSandboxDraftCandidateResult`
 *   and `convertLiveSandboxResultToDraftAdapterResult` returns `null`.
 *   Phase 8.2G-5A will resolve this by extending the 8.2G-2 validator boundary.
 *
 * Safety guarantees:
 * - no API key committed to source
 * - no env file created or modified
 * - no LLM called unless all 6 guards pass
 * - no persistence (no DB, no log, no file writes)
 * - no Smart Talk route touched
 * - no UI touched
 * - userVisibleOutputAllowed always literal false
 * - persistenceUsed always literal false
 * - realUserInputUsed always literal false
 * - neverUserVisible always true
 */

import type {
  RuntimeLiveLLMSandboxInput,
  RuntimeLiveLLMSandboxResult,
  RuntimeLiveLLMSandboxFixture,
  RuntimeLiveLLMSandboxSectionCandidate,
  RuntimeLiveLLMSandboxDiagnosticCode,
  RuntimeLiveLLMSandboxDisposition,
  RuntimeLiveLLMSandboxDraftCandidateResult,
} from "./runtime-live-llm-sandbox-types";
import type {
  RuntimeLLMDraftAdapterResult,
  RuntimeLLMDraftAdapterDiagnosticCode,
  RuntimeLLMDraftSectionCandidate,
  RuntimeLLMDraftSectionType,
} from "./runtime-llm-draft-adapter-types";

export const RUNTIME_LIVE_LLM_SANDBOX_VERSION =
  "8.2g-5-runtime-live-llm-sandbox-v1";

/**
 * The default model for the sandbox adapter.
 * Mirrors `DEFAULT_MODEL` in `run-smart-talk.ts`.
 * Overridden at runtime by `OPENAI_SMART_TALK_MODEL` env var if present.
 */
export const SANDBOX_DEFAULT_MODEL = "gpt-4o-mini";

/**
 * Required prefix on every `draftText` field in live sandbox section candidates.
 * Validated by `validateLiveLLMOutputShape` before any result is accepted.
 */
export const LIVE_SANDBOX_DRAFT_PREFIX = "[LIVE_SANDBOX_DRAFT_NEVER_USER_VISIBLE]";

// ── Output shape validation ────────────────────────────────────────────────────

/**
 * Result of `validateLiveLLMOutputShape`.
 * Discriminated by `valid`.
 */
export type LiveLLMOutputShapeValidationResult =
  | { readonly valid: true; readonly candidates: readonly RuntimeLiveLLMSandboxSectionCandidate[] }
  | { readonly valid: false; readonly reason: string };

/**
 * Validates the raw JSON string returned by a live LLM provider.
 *
 * Checks:
 *  1. JSON parses to an object.
 *  2. Has a `sectionCandidates` array.
 *  3. Array is non-empty.
 *  4. Each candidate has `sectionType` in `fixture.allowedSectionTypes`.
 *  5. Each candidate `draftText` starts with `LIVE_SANDBOX_DRAFT_PREFIX`.
 *  6. Each candidate `safetyFlags` is an array.
 *
 * Pure function — no side effects, no persistence, no external calls.
 * Exported for direct testing in the regression scaffold.
 */
export function validateLiveLLMOutputShape(
  rawJson: string,
  fixture: RuntimeLiveLLMSandboxFixture,
): LiveLLMOutputShapeValidationResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson) as unknown;
  } catch {
    return { valid: false, reason: "json_parse_failed" };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return { valid: false, reason: "root_not_object" };
  }

  const obj = parsed as Record<string, unknown>;

  if (!Array.isArray(obj["sectionCandidates"])) {
    return { valid: false, reason: "missing_section_candidates_array" };
  }

  const rawCandidates = obj["sectionCandidates"] as unknown[];

  if (rawCandidates.length === 0) {
    return { valid: false, reason: "empty_section_candidates" };
  }

  const candidates: RuntimeLiveLLMSandboxSectionCandidate[] = [];

  for (let i = 0; i < rawCandidates.length; i++) {
    const raw = rawCandidates[i];

    if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
      return { valid: false, reason: `candidate_${String(i)}_not_object` };
    }

    const c = raw as Record<string, unknown>;

    if (typeof c["sectionType"] !== "string" || c["sectionType"].trim() === "") {
      return { valid: false, reason: `candidate_${String(i)}_missing_section_type` };
    }

    const sectionType = c["sectionType"] as string;
    if (!(fixture.allowedSectionTypes as readonly string[]).includes(sectionType)) {
      return {
        valid: false,
        reason: `candidate_${String(i)}_invalid_section_type:${sectionType}`,
      };
    }

    if (typeof c["draftText"] !== "string") {
      return { valid: false, reason: `candidate_${String(i)}_missing_draft_text` };
    }

    if (!c["draftText"].startsWith(LIVE_SANDBOX_DRAFT_PREFIX)) {
      return { valid: false, reason: `candidate_${String(i)}_missing_live_sandbox_prefix` };
    }

    if (!Array.isArray(c["safetyFlags"])) {
      return { valid: false, reason: `candidate_${String(i)}_safety_flags_not_array` };
    }

    candidates.push({
      sectionType: sectionType as RuntimeLLMDraftSectionType,
      draftText: c["draftText"],
      // Only carry known safety flags; unknown strings are dropped (no user output).
      safetyFlags: [],
      sourceBound: true,
      neverUserVisible: true,
      notes: [
        "Produced by live LLM sandbox adapter. Never user-visible.",
        `Source fixture: ${fixture.fixtureId}`,
      ],
    });
  }

  return { valid: true, candidates };
}

// ── Prompt builder ─────────────────────────────────────────────────────────────

/**
 * Builds the sandbox system + user prompt pair.
 *
 * Constraints enforced in the prompt:
 * - JSON-only output with the exact `sectionCandidates` shape.
 * - Every `draftText` must be prefixed with `LIVE_SANDBOX_DRAFT_PREFIX`.
 * - No legal advice, no deadlines, no enforcement certainty, no amounts.
 * - No false reassurance, no panic language.
 * - Only allowed section types used.
 *
 * Pure function — no side effects.
 */
function buildSandboxPrompt(fixture: RuntimeLiveLLMSandboxFixture): {
  system: string;
  user: string;
} {
  const allowedStr = fixture.allowedSectionTypes.join(", ");
  const forbiddenStr =
    fixture.activeForbiddenMoves.length > 0
      ? fixture.activeForbiddenMoves.join(", ")
      : "(none specified)";

  const exampleShape = JSON.stringify(
    {
      sectionCandidates: [
        {
          sectionType: fixture.allowedSectionTypes[0] ?? "document_type_signal",
          draftText: `${LIVE_SANDBOX_DRAFT_PREFIX} <candidate text here>`,
          safetyFlags: [],
        },
      ],
    },
    null,
    2,
  );

  const system = [
    "You are an internal governance sandbox validator for testing purposes only.",
    "This call is NEVER shown to users. Output is consumed by an automated pipeline only.",
    "",
    "ABSOLUTE CONSTRAINTS — MUST FOLLOW:",
    "- Return ONLY valid JSON. No markdown code fences. No prose outside the JSON.",
    `- Prefix EVERY draftText value with exactly: \"${LIVE_SANDBOX_DRAFT_PREFIX}\"`,
    "- Do NOT provide legal advice, legal interpretations, or verdicts.",
    "- Do NOT calculate, mention, or imply specific deadlines or dates.",
    "- Do NOT claim enforcement actions will or will not occur.",
    "- Do NOT provide specific monetary calculations or amounts.",
    "- Do NOT minimize or dismiss risks (no false reassurance).",
    "- Do NOT use alarming or panic-inducing language.",
    "- Do NOT reference this being a test or sandbox call in the output text.",
    "",
    `ALLOWED SECTION TYPES (use ONLY these): ${allowedStr}`,
    `FORBIDDEN MOVES (never produce content matching these): ${forbiddenStr}`,
    "",
    "Return this exact JSON structure only:",
    exampleShape,
  ].join("\n");

  const user = [
    "SYNTHETIC REDACTED FIXTURE TEXT (no real PII, no real user documents):",
    "---",
    fixture.sourceTextRedacted,
    "---",
    "",
    "Produce section candidates for the allowed section types only.",
    "Return valid JSON only. No prose outside the JSON.",
  ].join("\n");

  return { system, user };
}

// ── Result builders ────────────────────────────────────────────────────────────

function buildBlockedResult(
  input: RuntimeLiveLLMSandboxInput,
  disposition: RuntimeLiveLLMSandboxDisposition,
  diagnostics: readonly RuntimeLiveLLMSandboxDiagnosticCode[],
  liveLLMCalled: boolean,
  notes?: readonly string[],
): RuntimeLiveLLMSandboxResult {
  return {
    sandboxRunId: input.sandboxRunId,
    provider: input.provider,
    model: input.model,
    disposition,
    fixtureId: input.fixture.fixtureId,
    sectionCandidates: [],
    diagnostics,
    liveLLMCalled,
    userVisibleOutputAllowed: false,
    persistenceUsed: false,
    realUserInputUsed: false,
    neverUserVisible: true,
    notes: notes ?? input.notes,
  };
}

function buildMockFallbackResult(
  input: RuntimeLiveLLMSandboxInput,
  diagnostics: readonly RuntimeLiveLLMSandboxDiagnosticCode[],
): RuntimeLiveLLMSandboxResult {
  const candidates: RuntimeLiveLLMSandboxSectionCandidate[] = input.fixture.allowedSectionTypes
    .slice(0, 2)
    .map((sectionType) => ({
      sectionType,
      draftText: `${LIVE_SANDBOX_DRAFT_PREFIX} [MOCK_FALLBACK] Deterministic mock section for ${sectionType}. Synthetic fixture. Never user-visible.`,
      safetyFlags: [] as const,
      sourceBound: true,
      neverUserVisible: true as const,
      notes: ["Mock fallback candidate. No live LLM called."],
    }));

  return {
    sandboxRunId: input.sandboxRunId,
    provider: input.provider,
    model: input.model,
    disposition: "skipped_provider_unavailable",
    fixtureId: input.fixture.fixtureId,
    sectionCandidates: candidates,
    diagnostics,
    liveLLMCalled: false,
    userVisibleOutputAllowed: false,
    persistenceUsed: false,
    realUserInputUsed: false,
    neverUserVisible: true,
    notes: ["mock_fallback provider used; no live LLM called; deterministic candidates returned."],
  };
}

// ── Main adapter ───────────────────────────────────────────────────────────────

/**
 * Runs the runtime live LLM sandbox adapter.
 *
 * No live LLM call is made unless ALL of the following hold:
 *  1. `input.allowLiveCall === true`
 *  2. `fixture.syntheticOnly === true`
 *  3. `fixture.neverContainsRealPii === true` (runtime defensive check)
 *  4. `fixture.neverUserVisible === true` (runtime defensive check)
 *  5. `provider === "openai"` (not unavailable, not mock_fallback)
 *  6. `process.env.OPENAI_API_KEY` is present and non-blank
 *
 * If all guards pass, the adapter calls the OpenAI API using `fetch` (the same
 * pattern as `run-smart-talk.ts`) and validates the output shape before returning.
 *
 * No persistence. No logging of raw LLM output. No user-visible output.
 */
export async function runRuntimeLiveLLMSandboxAdapter(
  input: RuntimeLiveLLMSandboxInput,
): Promise<RuntimeLiveLLMSandboxResult> {
  const diagnostics: RuntimeLiveLLMSandboxDiagnosticCode[] = [];

  // ── Invariant diagnostics ─────────────────────────────────────────────────
  diagnostics.push("live_sandbox_started");
  diagnostics.push("live_sandbox_no_user_visible_output");
  diagnostics.push("live_sandbox_no_persistence");
  diagnostics.push("live_sandbox_no_real_user_input");

  // ── Guard 1 — allowLiveCall ───────────────────────────────────────────────
  if (input.allowLiveCall !== true) {
    diagnostics.push("live_sandbox_provider_unavailable");
    return buildBlockedResult(
      input,
      "blocked_prompt_contract_violation",
      diagnostics,
      false,
      ["allowLiveCall is not true; live LLM call blocked."],
    );
  }

  // ── Guard 2 — fixture.syntheticOnly ──────────────────────────────────────
  if (input.fixture.syntheticOnly !== true) {
    diagnostics.push("live_sandbox_non_synthetic_input_blocked");
    return buildBlockedResult(
      input,
      "blocked_non_synthetic_input",
      diagnostics,
      false,
      ["fixture.syntheticOnly is not true; non-synthetic input blocked."],
    );
  }

  // ── Guard 3 — fixture.neverContainsRealPii (runtime defensive) ───────────
  if ((input.fixture.neverContainsRealPii as unknown) !== true) {
    diagnostics.push("live_sandbox_non_synthetic_input_blocked");
    return buildBlockedResult(
      input,
      "blocked_non_synthetic_input",
      diagnostics,
      false,
      ["fixture.neverContainsRealPii is not true at runtime; blocked."],
    );
  }

  // ── Guard 4 — fixture.neverUserVisible (runtime defensive) ───────────────
  if ((input.fixture.neverUserVisible as unknown) !== true) {
    return buildBlockedResult(
      input,
      "blocked_prompt_contract_violation",
      diagnostics,
      false,
      ["fixture.neverUserVisible is not true at runtime; blocked."],
    );
  }

  // ── Guard 5 — provider unavailable ───────────────────────────────────────
  if (input.provider === "unavailable") {
    diagnostics.push("live_sandbox_provider_unavailable");
    return buildBlockedResult(
      input,
      "skipped_provider_unavailable",
      diagnostics,
      false,
      ["provider is unavailable."],
    );
  }

  // ── Guard 6 — mock_fallback ───────────────────────────────────────────────
  if (input.provider === "mock_fallback") {
    diagnostics.push("live_sandbox_provider_unavailable");
    return buildMockFallbackResult(input, diagnostics);
  }

  // ── Guard 7 — openai provider: check API key ──────────────────────────────
  if (input.provider === "openai") {
    diagnostics.push("live_sandbox_provider_openai_selected");

    const apiKey = process.env["OPENAI_API_KEY"]?.trim();
    if (!apiKey) {
      diagnostics.push("live_sandbox_api_key_missing");
      return buildBlockedResult(
        input,
        "blocked_missing_api_key",
        diagnostics,
        false,
        ["OPENAI_API_KEY env var is absent or blank; live call blocked."],
      );
    }

    // Build prompt
    const { system, user } = buildSandboxPrompt(input.fixture);
    diagnostics.push("live_sandbox_prompt_contract_built");

    const model =
      process.env["OPENAI_SMART_TALK_MODEL"]?.trim() ||
      input.model ||
      SANDBOX_DEFAULT_MODEL;

    // Live call via fetch (same pattern as run-smart-talk.ts)
    const controller = new AbortController();
    const timeout = setTimeout(() => { controller.abort(); }, 30_000);
    let liveLLMCalled = false;

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.1,
          max_tokens: 800,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
        signal: controller.signal,
      });

      liveLLMCalled = true;
      clearTimeout(timeout);

      if (!res.ok) {
        diagnostics.push("live_sandbox_provider_error");
        return buildBlockedResult(
          input,
          "failed_provider_error",
          diagnostics,
          liveLLMCalled,
          [`OpenAI HTTP error: ${String(res.status)}`],
        );
      }

      const body = (await res.json()) as {
        choices?: Array<{ message?: { content?: string | null } }>;
      };
      const rawContent = body.choices?.[0]?.message?.content ?? null;

      if (!rawContent || rawContent.trim() === "") {
        diagnostics.push("live_sandbox_provider_error");
        return buildBlockedResult(
          input,
          "failed_provider_error",
          diagnostics,
          liveLLMCalled,
          ["OpenAI returned empty content."],
        );
      }

      diagnostics.push("live_sandbox_call_completed");

      // Validate output shape before accepting
      const shapeResult = validateLiveLLMOutputShape(rawContent, input.fixture);

      if (!shapeResult.valid) {
        diagnostics.push("live_sandbox_output_shape_invalid");
        return buildBlockedResult(
          input,
          "failed_output_shape_violation",
          diagnostics,
          liveLLMCalled,
          [`Output shape validation failed: ${shapeResult.reason}`],
        );
      }

      diagnostics.push("live_sandbox_output_shape_validated");
      diagnostics.push("live_sandbox_ready_for_output_contract_validation");

      return {
        sandboxRunId: input.sandboxRunId,
        provider: input.provider,
        model,
        disposition: "completed_live_sandbox_call",
        fixtureId: input.fixture.fixtureId,
        sectionCandidates: shapeResult.candidates,
        diagnostics,
        liveLLMCalled: true,
        userVisibleOutputAllowed: false,
        persistenceUsed: false,
        realUserInputUsed: false,
        neverUserVisible: true,
        notes: [
          "Live sandbox call completed successfully. Output shape validated.",
          "Candidates must pass validateRuntimeLLMOutputContract before any further use.",
          "Modeling gap: liveLLMCalled:true cannot be fed into Phase 8.2G-2 validator without Phase 8.2G-5A type extension.",
        ],
      };
    } catch (err: unknown) {
      clearTimeout(timeout);
      diagnostics.push("live_sandbox_provider_error");
      return buildBlockedResult(
        input,
        "failed_provider_error",
        diagnostics,
        liveLLMCalled,
        [
          `Provider call failed: ${err instanceof Error ? err.message : "unknown error"}`,
        ],
      );
    }
  }

  // ── Exhaustiveness guard (unknown provider) ───────────────────────────────
  const _exhaustive: never = input.provider;
  void _exhaustive;
  diagnostics.push("live_sandbox_provider_unavailable");
  return buildBlockedResult(
    input,
    "skipped_provider_unavailable",
    diagnostics,
    false,
    ["Unrecognised provider; treated as unavailable."],
  );
}

// ── Adapter compatibility bridge ───────────────────────────────────────────────

/**
 * Converts a `RuntimeLiveLLMSandboxResult` with `liveLLMCalled === false` into
 * a `RuntimeLLMDraftAdapterResult` compatible with `validateRuntimeLLMOutputContract`
 * (Phase 8.2G-2).
 *
 * **Only valid for non-live results** (`mock_fallback`, `unavailable`, or
 * any guard-blocked path where `liveLLMCalled === false`).
 *
 * Returns `null` if `sandboxResult.liveLLMCalled === true` — see
 * `buildLiveSandboxDraftCandidateResult` for the live-call path and the
 * Phase 8.2G-5A modeling gap note.
 *
 * `adapterMode` is set to `"mock"` (not `"future_live_llm"`) because the output
 * contract validator currently rejects `future_live_llm` mode. Phase 8.2G-5A
 * will resolve this by extending the validator boundary.
 *
 * Pure function — no side effects.
 */
export function convertLiveSandboxResultToDraftAdapterResult(params: {
  sandboxResult: RuntimeLiveLLMSandboxResult;
  fixture: RuntimeLiveLLMSandboxFixture;
}): RuntimeLLMDraftAdapterResult | null {
  const { sandboxResult, fixture } = params;

  if (sandboxResult.liveLLMCalled === true) {
    // Cannot produce RuntimeLLMDraftAdapterResult for live-called results.
    // liveLLMCalled: false is a literal type in RuntimeLLMDraftAdapterResult.
    // Use buildLiveSandboxDraftCandidateResult for this path.
    return null;
  }

  const sectionCandidates: RuntimeLLMDraftSectionCandidate[] =
    sandboxResult.sectionCandidates.map((c) => ({
      sectionType: c.sectionType,
      draftText: c.draftText,
      safetyFlags: c.safetyFlags,
      sourceBound: c.sourceBound,
      neverUserVisible: true,
      notes: c.notes,
    }));

  const adapterDiagnostics: RuntimeLLMDraftAdapterDiagnosticCode[] = [
    "llm_adapter_output_never_user_visible",
    "llm_adapter_live_llm_forbidden",
  ];

  if (fixture.activeForbiddenMoves.length > 0) {
    adapterDiagnostics.push("llm_adapter_forbidden_move_referenced");
  }
  if (fixture.activeRequiredConstraints.length > 0) {
    adapterDiagnostics.push("llm_adapter_required_constraint_referenced");
  }

  return {
    adapterMode: "mock",
    accessTier: fixture.expectedAccessTier,
    draftId: sandboxResult.sandboxRunId,
    sectionCandidates,
    appliedForbiddenMoves: fixture.activeForbiddenMoves,
    appliedRequiredConstraints: fixture.activeRequiredConstraints,
    diagnostics: adapterDiagnostics,
    auditTraceParentIds: [],
    liveLLMCalled: false,
    userVisibleOutputAllowed: false,
    neverUserVisible: true,
    notes: [
      "Converted from RuntimeLiveLLMSandboxResult (liveLLMCalled: false path).",
      "adapterMode set to 'mock' — 'future_live_llm' is rejected by Phase 8.2G-2 validator.",
      "This result is compatible with validateRuntimeLLMOutputContract (Phase 8.2G-2).",
      "Phase 8.2G-5A: type extension required for liveLLMCalled:true path.",
    ],
  };
}

/**
 * Wraps a live-called sandbox result into a `RuntimeLiveLLMSandboxDraftCandidateResult`.
 *
 * This type cannot be fed into `validateRuntimeLLMOutputContract` (Phase 8.2G-2)
 * until Phase 8.2G-5A resolves the `liveLLMCalled: false` literal type conflict.
 *
 * Returns `null` if `sandboxResult.liveLLMCalled !== true`.
 *
 * Pure function — no side effects.
 */
export function buildLiveSandboxDraftCandidateResult(params: {
  sandboxResult: RuntimeLiveLLMSandboxResult;
  fixture: RuntimeLiveLLMSandboxFixture;
}): RuntimeLiveLLMSandboxDraftCandidateResult | null {
  const { sandboxResult, fixture } = params;

  if (sandboxResult.liveLLMCalled !== true) {
    return null;
  }

  return {
    sandboxRunId: sandboxResult.sandboxRunId,
    adapterMode: "future_live_llm",
    accessTier: fixture.expectedAccessTier,
    fixtureId: sandboxResult.fixtureId,
    sectionCandidates: sandboxResult.sectionCandidates,
    appliedForbiddenMoves: fixture.activeForbiddenMoves,
    appliedRequiredConstraints: fixture.activeRequiredConstraints,
    liveLLMCalled: true,
    userVisibleOutputAllowed: false,
    neverUserVisible: true,
    modelingGapNote:
      "Phase 8.2G-5A required: RuntimeLLMDraftAdapterResult.liveLLMCalled:false literal " +
      "prevents this result from being fed into validateRuntimeLLMOutputContract (8.2G-2) " +
      "without a type extension. adapterMode 'future_live_llm' is also currently rejected " +
      "by the validator. Resolve in Phase 8.2G-5A.",
    notes: [
      "Live sandbox draft candidate. liveLLMCalled:true. Not compatible with 8.2G-2 yet.",
      `Fixture: ${fixture.fixtureId}. Provider: ${sandboxResult.provider}.`,
    ],
  };
}
