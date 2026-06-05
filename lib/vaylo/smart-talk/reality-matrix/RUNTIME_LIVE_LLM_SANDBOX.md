# RUNTIME_LIVE_LLM_SANDBOX.md — Phase 8.2G-5

## 1. Purpose

Phase 8.2G-5 introduces the first strictly sandboxed live LLM call path for the
Vaylo Smart Talk Runtime LLM Integration. It establishes a controlled boundary
through which a real LLM can be invoked — only under explicit guard conditions,
only against synthetic redacted corpus fixtures, and never in a way that produces
user-visible output or touches the production Smart Talk pipeline.

---

## 2. Why this is not production Smart Talk

The production `runSmartTalk` function processes real user documents through a
Smart Talk API route and returns user-visible explanation text. This sandbox:

- Has no API route or HTTP endpoint.
- Processes only synthetic/redacted corpus fixtures.
- Produces draft candidates that are never assembled into user-visible output.
- Is invoked by calling `runRuntimeLiveLLMSandboxAdapter()` directly with
  `allowLiveCall: true` — there is no automatic invocation.
- All output remains internal governance metadata with `neverUserVisible: true`.

---

## 3. Sandbox-only restrictions

| Restriction | Enforced by |
|-------------|-------------|
| No real user input | Guard 1: `input.allowLiveCall` must be explicitly `true` |
| No non-synthetic fixtures | Guard 2: `fixture.syntheticOnly === true` |
| No real PII | Guard 3: `fixture.neverContainsRealPii === true` (runtime check) |
| No leaked fixture invariants | Guard 4: `fixture.neverUserVisible === true` (runtime check) |
| No unavailable provider call | Guard 5/6: `provider === "unavailable"` or `"mock_fallback"` returns early |
| No missing API key call | Guard 7: `OPENAI_API_KEY` must be present in env |

If any guard fails, the adapter returns a blocked/skipped result with
`liveLLMCalled: false` and no provider call is made.

---

## 4. Allowed fixture types

| `RuntimeLiveLLMSandboxCorpusKind` | Description |
|---|---|
| `synthetic_redacted_corpus` | From `redacted-corpus-registry.ts` or `controlled-corpus/scenarios.ts` |
| `controlled_governance_fixture` | Inline in governance scaffold files |
| `imported_static_fixture` | From approved static fixture files |

All fixtures must have `syntheticOnly: true` and `neverContainsRealPii: true`.
Real user documents may never be used as sandbox fixtures.

---

## 5. Live call guard requirements

A live LLM call only proceeds when **all** of the following hold simultaneously:

1. `input.allowLiveCall === true` — explicit opt-in
2. `fixture.syntheticOnly === true` — synthetic fixture confirmed
3. `fixture.neverContainsRealPii === true` — runtime defensive check
4. `fixture.neverUserVisible === true` — runtime defensive check
5. `provider === "openai"` — not `"unavailable"`, not `"mock_fallback"`
6. `process.env.OPENAI_API_KEY` is present and non-blank

---

## 6. API key handling

- The `OPENAI_API_KEY` env var is read at runtime inside the adapter function body.
- It is never committed to source, never printed, never logged.
- If absent, the adapter returns `blocked_missing_api_key` immediately.
- The `OPENAI_SMART_TALK_MODEL` env var overrides the default model if set.
- Default model: `"gpt-4o-mini"` (matches `run-smart-talk.ts`).
- No new env files are created. No existing env files are modified.

---

## 7. Provider dependency behavior

The adapter uses `fetch` directly (the same pattern as `run-smart-talk.ts`) — no
external SDK is imported. This means:
- No npm package is required beyond what is already in the project.
- `blocked_missing_provider_dependency` is reserved for future SDK-based providers
  that might require a separate package install.
- If `fetch` itself fails (network error, timeout), the adapter returns
  `failed_provider_error` with `liveLLMCalled` reflecting whether the call was
  sent before the error.

---

## 8. Prompt contract

The sandbox prompt is built by `buildSandboxPrompt()` (internal). It enforces:

- JSON-only output with the exact `sectionCandidates` shape.
- Every `draftText` must be prefixed with `[LIVE_SANDBOX_DRAFT_NEVER_USER_VISIBLE]`.
- No legal advice, no legal verdicts, no deadline calculations.
- No enforcement certainty, no false reassurance, no panic language.
- No monetary calculations or specific amounts.
- Only allowed section types from the fixture.
- Active forbidden moves from the fixture listed explicitly.

The prompt does NOT ask the LLM to produce final explanation text, translate
documents, or provide any user-facing content.

---

## 9. Output shape validation

Before any live result is accepted, `validateLiveLLMOutputShape()` checks:

1. JSON parses successfully.
2. Root is an object with a `sectionCandidates` array.
3. Array is non-empty.
4. Each candidate has `sectionType` in `fixture.allowedSectionTypes`.
5. Each candidate `draftText` starts with `[LIVE_SANDBOX_DRAFT_NEVER_USER_VISIBLE]`.
6. Each candidate `safetyFlags` is an array.

On any failure: disposition `failed_output_shape_violation`, diagnostic
`live_sandbox_output_shape_invalid`, and `liveLLMCalled` reflects whether the
provider was actually called before the shape check.

---

## 10. Why `userVisibleOutputAllowed` remains `false`

`userVisibleOutputAllowed: false` is a literal type on `RuntimeLiveLLMSandboxResult`.
The sandbox adapter produces draft candidates only. These candidates must still
pass through:
- `validateRuntimeLLMOutputContract` (Phase 8.2G-2)
- `runRuntimeWordingGovernanceGate` (Phase 8.2G-3)
- `runRuntimeGovernanceDryRun` (Phase 8.2G-4)

before any user-visible assembly is permitted. The response assembler (Phase 8.2G-6)
is the only component permitted to produce user-facing output.

---

## 11. Why `persistenceUsed` remains `false`

`persistenceUsed: false` is a literal type. The sandbox adapter writes nothing to
any database, file, or log. Audit traces are produced only through the governance
dry-run harness (Phase 8.2G-4), not directly by the sandbox adapter.

---

## 12. Why `realUserInputUsed` remains `false`

`realUserInputUsed: false` is a literal type. The sandbox adapter only accepts
`RuntimeLiveLLMSandboxFixture` inputs that carry `syntheticOnly: true` and
`neverContainsRealPii: true`. Real user documents, real OCR output, and real
uploaded files may never enter this pipeline.

---

## 13. How this connects to 8.2G-6/8.2G-7

Phase 8.2G-5 ends with a `RuntimeLiveLLMSandboxResult`. To move further:

**For non-live results** (mock_fallback/unavailable):
- `convertLiveSandboxResultToDraftAdapterResult()` converts to `RuntimeLLMDraftAdapterResult`
- This can be passed to `validateRuntimeLLMOutputContract` (8.2G-2) → `runRuntimeWordingGovernanceGate` (8.2G-3) → `runRuntimeGovernanceDryRun` (8.2G-4)

**For live results** (`liveLLMCalled: true`):
- `buildLiveSandboxDraftCandidateResult()` wraps in `RuntimeLiveLLMSandboxDraftCandidateResult`
- This type has `adapterMode: "future_live_llm"` and `liveLLMCalled: true`
- Phase 8.2G-5A must extend the 8.2G-2 validator to accept this before the live path can proceed to 8.2G-6

**Modeling gap (Phase 8.2G-5A):**
`RuntimeLLMDraftAdapterResult.liveLLMCalled: false` is a literal type. The output
contract validator (8.2G-2) also rejects `adapterMode: "future_live_llm"`. These
constraints must be resolved before live-called results can enter the full pipeline.

---

## 14. Regression cases (10 cases)

| Case | Name | Expected Outcome |
|------|------|-----------------|
| 1 | provider unavailable / allowLiveCall false | `blocked_prompt_contract_violation`, `liveLLMCalled: false` |
| 2 | non-synthetic fixture blocked | `blocked_non_synthetic_input`, `liveLLMCalled: false` |
| 3 | missing API key (skipped if key present) | `blocked_missing_api_key`, `liveLLMCalled: false` |
| 4 | mock_fallback — deterministic candidates | `skipped_provider_unavailable`, `liveLLMCalled: false`, candidates returned |
| 5 | shape validator accepts valid JSON | `valid: true`, 2 candidates |
| 6 | shape validator rejects wrong section type | `valid: false`, reason contains `invalid_section_type` |
| 7 | shape validator rejects missing prefix | `valid: false`, reason contains `missing_live_sandbox_prefix` |
| 8 | shape validator rejects non-array safetyFlags | `valid: false`, reason contains `safety_flags_not_array` |
| 9 | never-user-visible invariant | all structures `neverUserVisible: true`, literal false invariants hold |
| 10 | optional live call | skipped unless `VAYLO_ALLOW_LIVE_LLM_SANDBOX=true` + API key present |

---

## 15. Manual live sandbox run instructions

To run a live call against the OpenAI API:

1. Ensure `OPENAI_API_KEY` is set in your environment (never committed to source).
2. Set `VAYLO_ALLOW_LIVE_LLM_SANDBOX=true` in your environment.
3. Call `runRuntimeLiveLLMSandboxRegressionScaffold()` and await the result.
4. Inspect the Case 10 result to verify the live call behavior.
5. The live result will carry `liveLLMCalled: true` and `disposition: completed_live_sandbox_call`
   if all guards passed and the shape was valid.
6. To proceed through the full governance pipeline, use `buildLiveSandboxDraftCandidateResult()`
   to wrap the result — but note that Phase 8.2G-2 validation will reject
   `adapterMode: "future_live_llm"` until Phase 8.2G-5A resolves the type gap.

**Never run the live sandbox with real user documents or real PII.**
