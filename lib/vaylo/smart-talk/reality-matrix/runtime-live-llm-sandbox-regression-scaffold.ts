/**
 * Runtime Live LLM Sandbox regression scaffold (Phase 8.2G-5).
 *
 * Validates `runRuntimeLiveLLMSandboxAdapter` and `validateLiveLLMOutputShape`
 * across 10 governance scenarios. Cases 1–9 are always runnable without an API
 * key. Case 10 is skipped unless `VAYLO_ALLOW_LIVE_LLM_SANDBOX === "true"` AND
 * `OPENAI_API_KEY` is present.
 *
 * Cases:
 *  1. provider unavailable — no call, blocked_prompt_contract_violation
 *  2. non-synthetic fixture blocked — blocked_non_synthetic_input
 *  3. missing API key — blocked_missing_api_key (skipped if key is present)
 *  4. mock_fallback — deterministic candidates, liveLLMCalled false
 *  5. shape validator accepts valid well-formed JSON
 *  6. shape validator rejects wrong section type
 *  7. shape validator rejects missing live sandbox prefix
 *  8. shape validator rejects non-array safetyFlags
 *  9. never-user-visible invariant across all returned structures
 * 10. optional live call — skipped unless explicit env flag + API key present
 *
 * No Jest. No Vitest. No CI hook. No real user input.
 * Returns Promise because cases 1–9 still call the async adapter.
 */

import {
  runRuntimeLiveLLMSandboxAdapter,
  validateLiveLLMOutputShape,
  convertLiveSandboxResultToDraftAdapterResult,
  LIVE_SANDBOX_DRAFT_PREFIX,
  SANDBOX_DEFAULT_MODEL,
} from "./run-runtime-live-llm-sandbox-adapter";
import type {
  RuntimeLiveLLMSandboxFixture,
  RuntimeLiveLLMSandboxInput,
  RuntimeLiveLLMSandboxResult,
} from "./runtime-live-llm-sandbox-types";

export const LIVE_SANDBOX_REGRESSION_SCAFFOLD_VERSION =
  "8.2g-5-live-sandbox-regression-scaffold-v1";

// ── Minimal synthetic fixture ──────────────────────────────────────────────────

/**
 * Minimal inline synthetic fixture for Phase 8.2G-5 regression scaffold.
 *
 * This fixture is purely synthetic. It contains no real PII, no real user
 * documents, and no real OCR output. It is admitted solely for regression
 * testing of the sandbox adapter guards and output shape validator.
 */
export const SCAFFOLD_BENIGN_INVOICE_FIXTURE: RuntimeLiveLLMSandboxFixture = {
  fixtureId: "8.2g-5-scaffold-benign-invoice-001",
  corpusKind: "controlled_governance_fixture",
  syntheticOnly: true,
  sourceTextRedacted:
    "[AUTHORITY] Synthetic notice. [DATE]. [NAME] received a payment request " +
    "for [AMOUNT]. Reference: [AKTENZEICHEN]. " +
    "This fixture is synthetic and contains no real PII.",
  expectedAccessTier: "free_preview",
  allowedSectionTypes: [
    "document_type_signal",
    "what_this_means",
    "uncertainty_notice",
  ],
  activeForbiddenMoves: [
    "no_enforcement_claim_when_forbidden",
    "no_deadline_calculation_when_forbidden",
  ],
  activeRequiredConstraints: [],
  uncertaintyRequired: true,
  humanReviewRequired: false,
  neverContainsRealPii: true,
  neverUserVisible: true,
  notes: [
    "Minimal synthetic fixture for Phase 8.2G-5 regression scaffold.",
    "No real PII. No real documents. No OCR. Sandbox testing only.",
  ],
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function makeSandboxInput(
  overrides: Partial<RuntimeLiveLLMSandboxInput> = {},
): RuntimeLiveLLMSandboxInput {
  return {
    fixture: SCAFFOLD_BENIGN_INVOICE_FIXTURE,
    provider: "unavailable",
    model: SANDBOX_DEFAULT_MODEL,
    sandboxRunId: "8.2g-5-scaffold-default",
    allowLiveCall: false,
    neverUserVisible: true,
    ...overrides,
  };
}

function assert(
  condition: boolean,
  message: string,
): { passed: boolean; message: string } {
  return { passed: condition, message };
}

// ── Case result types ─────────────────────────────────────────────────────────

export interface LiveSandboxRegressionCaseResult {
  readonly caseNumber: number;
  readonly caseName: string;
  readonly passed: boolean;
  readonly skipped: boolean;
  readonly skipReason?: string;
  readonly assertions: readonly { passed: boolean; message: string }[];
  readonly result?: RuntimeLiveLLMSandboxResult;
}

export interface LiveSandboxRegressionScaffoldResult {
  readonly scaffoldVersion: string;
  readonly allPassed: boolean;
  readonly caseResults: readonly LiveSandboxRegressionCaseResult[];
  readonly notes: readonly string[];
}

// ── Case runner ───────────────────────────────────────────────────────────────

async function runCase(
  caseNumber: number,
  caseName: string,
  input: RuntimeLiveLLMSandboxInput,
  assertions: (result: RuntimeLiveLLMSandboxResult) => { passed: boolean; message: string }[],
): Promise<LiveSandboxRegressionCaseResult> {
  const result = await runRuntimeLiveLLMSandboxAdapter(input);
  const assertionResults = assertions(result);
  const passed = assertionResults.every((a) => a.passed);
  return { caseNumber, caseName, passed, skipped: false, assertions: assertionResults, result };
}

function skipCase(
  caseNumber: number,
  caseName: string,
  skipReason: string,
): LiveSandboxRegressionCaseResult {
  return {
    caseNumber,
    caseName,
    passed: true,
    skipped: true,
    skipReason,
    assertions: [],
  };
}

// ── Scaffold ──────────────────────────────────────────────────────────────────

/**
 * Runs all 10 regression cases for the runtime live LLM sandbox adapter.
 *
 * Cases 1–9 are always executed without an API key.
 * Case 10 is skipped unless `VAYLO_ALLOW_LIVE_LLM_SANDBOX === "true"` AND
 * `OPENAI_API_KEY` is present in the environment.
 *
 * No persistence. No logging. No real user input. No Smart Talk wiring.
 */
export async function runRuntimeLiveLLMSandboxRegressionScaffold(): Promise<LiveSandboxRegressionScaffoldResult> {
  const cases: LiveSandboxRegressionCaseResult[] = [];

  // ── Case 1: provider unavailable (allowLiveCall false) ───────────────────

  cases.push(
    await runCase(
      1,
      "provider unavailable — allowLiveCall false",
      makeSandboxInput({ provider: "unavailable", allowLiveCall: false }),
      (r) => [
        assert(
          r.disposition === "blocked_prompt_contract_violation",
          `disposition should be blocked_prompt_contract_violation; got ${r.disposition}`,
        ),
        assert(r.liveLLMCalled === false, `liveLLMCalled must be false`),
        assert(r.userVisibleOutputAllowed === false, `userVisibleOutputAllowed must be false`),
        assert(r.persistenceUsed === false, `persistenceUsed must be false`),
        assert(r.realUserInputUsed === false, `realUserInputUsed must be false`),
        assert(r.sectionCandidates.length === 0, `no candidates should be returned`),
        assert(
          r.diagnostics.includes("live_sandbox_provider_unavailable"),
          `diagnostics should include live_sandbox_provider_unavailable`,
        ),
      ],
    ),
  );

  // ── Case 2: non-synthetic fixture blocked ─────────────────────────────────

  const nonSyntheticFixture: RuntimeLiveLLMSandboxFixture = {
    ...SCAFFOLD_BENIGN_INVOICE_FIXTURE,
    fixtureId: "8.2g-5-scaffold-non-synthetic-001",
    syntheticOnly: false,
  };

  cases.push(
    await runCase(
      2,
      "non-synthetic fixture blocked",
      makeSandboxInput({
        fixture: nonSyntheticFixture,
        provider: "openai",
        allowLiveCall: true,
      }),
      (r) => [
        assert(
          r.disposition === "blocked_non_synthetic_input",
          `disposition should be blocked_non_synthetic_input; got ${r.disposition}`,
        ),
        assert(r.liveLLMCalled === false, `liveLLMCalled must be false`),
        assert(
          r.diagnostics.includes("live_sandbox_non_synthetic_input_blocked"),
          `diagnostics should include live_sandbox_non_synthetic_input_blocked`,
        ),
      ],
    ),
  );

  // ── Case 3: missing API key ───────────────────────────────────────────────

  const hasApiKey = Boolean(process.env["OPENAI_API_KEY"]?.trim());
  if (hasApiKey) {
    // Cannot test missing-key case when key is present in this environment.
    cases.push(
      skipCase(
        3,
        "missing API key (skipped — OPENAI_API_KEY is present in environment)",
        "OPENAI_API_KEY is present; cannot test blocked_missing_api_key without removing it. " +
          "Verify guard by clearing OPENAI_API_KEY in a clean environment.",
      ),
    );
  } else {
    cases.push(
      await runCase(
        3,
        "missing API key",
        makeSandboxInput({ provider: "openai", allowLiveCall: true }),
        (r) => [
          assert(
            r.disposition === "blocked_missing_api_key",
            `disposition should be blocked_missing_api_key; got ${r.disposition}`,
          ),
          assert(r.liveLLMCalled === false, `liveLLMCalled must be false`),
          assert(
            r.diagnostics.includes("live_sandbox_api_key_missing"),
            `diagnostics should include live_sandbox_api_key_missing`,
          ),
        ],
      ),
    );
  }

  // ── Case 4: mock_fallback — deterministic candidates ─────────────────────

  cases.push(
    await runCase(
      4,
      "mock_fallback — deterministic candidates, no live LLM",
      makeSandboxInput({
        provider: "mock_fallback",
        allowLiveCall: true,
        sandboxRunId: "8.2g-5-c4-mock-fallback",
      }),
      (r) => [
        assert(
          r.disposition === "skipped_provider_unavailable",
          `disposition should be skipped_provider_unavailable; got ${r.disposition}`,
        ),
        assert(r.liveLLMCalled === false, `liveLLMCalled must be false`),
        assert(
          r.sectionCandidates.length > 0,
          `mock_fallback should return at least one candidate`,
        ),
        assert(
          r.sectionCandidates.every((c) =>
            c.draftText.startsWith(LIVE_SANDBOX_DRAFT_PREFIX),
          ),
          `all candidate draftTexts must start with LIVE_SANDBOX_DRAFT_PREFIX`,
        ),
        assert(
          r.sectionCandidates.every((c) => c.neverUserVisible === true),
          `all candidates must have neverUserVisible === true`,
        ),
        assert(r.userVisibleOutputAllowed === false, `userVisibleOutputAllowed must be false`),
      ],
    ),
  );

  // ── Case 5: shape validator accepts valid well-formed JSON ────────────────

  const validJson = JSON.stringify({
    sectionCandidates: [
      {
        sectionType: "document_type_signal",
        draftText: `${LIVE_SANDBOX_DRAFT_PREFIX} This appears to be a payment notice.`,
        safetyFlags: [],
      },
      {
        sectionType: "uncertainty_notice",
        draftText: `${LIVE_SANDBOX_DRAFT_PREFIX} The document contains redacted fields.`,
        safetyFlags: [],
      },
    ],
  });

  const case5Result = validateLiveLLMOutputShape(validJson, SCAFFOLD_BENIGN_INVOICE_FIXTURE);
  cases.push({
    caseNumber: 5,
    caseName: "shape validator accepts valid well-formed JSON",
    passed: [
      assert(case5Result.valid === true, `valid should be true`),
      assert(
        case5Result.valid && case5Result.candidates.length === 2,
        `should have 2 candidates`,
      ),
      assert(
        case5Result.valid &&
          case5Result.candidates.every((c) =>
            c.draftText.startsWith(LIVE_SANDBOX_DRAFT_PREFIX),
          ),
        `all candidates should have the prefix`,
      ),
    ].every((a) => a.passed),
    skipped: false,
    assertions: [
      assert(case5Result.valid === true, `valid should be true`),
      assert(
        case5Result.valid ? case5Result.candidates.length === 2 : false,
        `should have 2 candidates`,
      ),
    ],
  });

  // ── Case 6: shape validator rejects wrong section type ────────────────────

  const wrongSectionTypeJson = JSON.stringify({
    sectionCandidates: [
      {
        sectionType: "blocked_content_notice",
        draftText: `${LIVE_SANDBOX_DRAFT_PREFIX} Content.`,
        safetyFlags: [],
      },
    ],
  });

  const case6Result = validateLiveLLMOutputShape(
    wrongSectionTypeJson,
    SCAFFOLD_BENIGN_INVOICE_FIXTURE,
  );
  cases.push({
    caseNumber: 6,
    caseName: "shape validator rejects wrong section type",
    passed: [
      assert(case6Result.valid === false, `valid should be false for wrong section type`),
      assert(
        !case6Result.valid && case6Result.reason.includes("invalid_section_type"),
        `reason should mention invalid_section_type`,
      ),
    ].every((a) => a.passed),
    skipped: false,
    assertions: [
      assert(case6Result.valid === false, `valid should be false for wrong section type`),
      assert(
        !case6Result.valid && case6Result.reason.includes("invalid_section_type"),
        `reason should mention invalid_section_type; got: ${!case6Result.valid ? case6Result.reason : "n/a"}`,
      ),
    ],
  });

  // ── Case 7: shape validator rejects missing live sandbox prefix ───────────

  const missingPrefixJson = JSON.stringify({
    sectionCandidates: [
      {
        sectionType: "document_type_signal",
        draftText: "This is a payment notice without the required prefix.",
        safetyFlags: [],
      },
    ],
  });

  const case7Result = validateLiveLLMOutputShape(
    missingPrefixJson,
    SCAFFOLD_BENIGN_INVOICE_FIXTURE,
  );
  cases.push({
    caseNumber: 7,
    caseName: "shape validator rejects missing live sandbox prefix",
    passed: [
      assert(case7Result.valid === false, `valid should be false for missing prefix`),
      assert(
        !case7Result.valid && case7Result.reason.includes("missing_live_sandbox_prefix"),
        `reason should mention missing_live_sandbox_prefix`,
      ),
    ].every((a) => a.passed),
    skipped: false,
    assertions: [
      assert(case7Result.valid === false, `valid should be false for missing prefix`),
      assert(
        !case7Result.valid && case7Result.reason.includes("missing_live_sandbox_prefix"),
        `reason should mention missing_live_sandbox_prefix; got: ${!case7Result.valid ? case7Result.reason : "n/a"}`,
      ),
    ],
  });

  // ── Case 8: shape validator rejects non-array safetyFlags ────────────────

  const nonArraySafetyFlagsJson = JSON.stringify({
    sectionCandidates: [
      {
        sectionType: "document_type_signal",
        draftText: `${LIVE_SANDBOX_DRAFT_PREFIX} Content.`,
        safetyFlags: "not_an_array",
      },
    ],
  });

  const case8Result = validateLiveLLMOutputShape(
    nonArraySafetyFlagsJson,
    SCAFFOLD_BENIGN_INVOICE_FIXTURE,
  );
  cases.push({
    caseNumber: 8,
    caseName: "shape validator rejects non-array safetyFlags",
    passed: [
      assert(case8Result.valid === false, `valid should be false for non-array safetyFlags`),
      assert(
        !case8Result.valid && case8Result.reason.includes("safety_flags_not_array"),
        `reason should mention safety_flags_not_array`,
      ),
    ].every((a) => a.passed),
    skipped: false,
    assertions: [
      assert(case8Result.valid === false, `valid should be false for non-array safetyFlags`),
      assert(
        !case8Result.valid && case8Result.reason.includes("safety_flags_not_array"),
        `reason should mention safety_flags_not_array; got: ${!case8Result.valid ? case8Result.reason : "n/a"}`,
      ),
    ],
  });

  // ── Case 9: never-user-visible invariant ─────────────────────────────────

  const case9Input = makeSandboxInput({
    provider: "mock_fallback",
    allowLiveCall: true,
    sandboxRunId: "8.2g-5-c9-invariants",
  });
  const case9AdapterResult = await runRuntimeLiveLLMSandboxAdapter(case9Input);
  const case9Converter = convertLiveSandboxResultToDraftAdapterResult({
    sandboxResult: case9AdapterResult,
    fixture: SCAFFOLD_BENIGN_INVOICE_FIXTURE,
  });

  cases.push({
    caseNumber: 9,
    caseName: "never-user-visible invariant across all structures",
    passed: [
      assert(
        case9AdapterResult.neverUserVisible === true,
        `sandboxResult.neverUserVisible must be true`,
      ),
      assert(
        case9AdapterResult.userVisibleOutputAllowed === false,
        `sandboxResult.userVisibleOutputAllowed must be false`,
      ),
      assert(
        case9AdapterResult.persistenceUsed === false,
        `sandboxResult.persistenceUsed must be false`,
      ),
      assert(
        case9AdapterResult.realUserInputUsed === false,
        `sandboxResult.realUserInputUsed must be false`,
      ),
      assert(
        case9AdapterResult.sectionCandidates.every((c) => c.neverUserVisible === true),
        `all sectionCandidates must have neverUserVisible === true`,
      ),
      assert(
        case9Converter !== null && case9Converter.neverUserVisible === true,
        `converted draft result must have neverUserVisible === true`,
      ),
      assert(
        case9Converter !== null && case9Converter.userVisibleOutputAllowed === false,
        `converted draft result must have userVisibleOutputAllowed === false`,
      ),
      assert(
        case9Converter !== null && case9Converter.liveLLMCalled === false,
        `converted draft result must have liveLLMCalled === false`,
      ),
    ].every((a) => a.passed),
    skipped: false,
    assertions: [
      assert(
        case9AdapterResult.neverUserVisible === true,
        `sandboxResult.neverUserVisible must be true`,
      ),
      assert(
        case9AdapterResult.userVisibleOutputAllowed === false,
        `sandboxResult.userVisibleOutputAllowed must be false`,
      ),
      assert(
        case9AdapterResult.persistenceUsed === false,
        `sandboxResult.persistenceUsed must be false`,
      ),
      assert(
        case9AdapterResult.realUserInputUsed === false,
        `sandboxResult.realUserInputUsed must be false`,
      ),
      assert(
        case9AdapterResult.sectionCandidates.every((c) => c.neverUserVisible === true),
        `all sectionCandidates must have neverUserVisible === true`,
      ),
      assert(
        case9Converter !== null,
        `convertLiveSandboxResultToDraftAdapterResult must succeed for non-live result`,
      ),
      assert(
        case9Converter !== null && case9Converter.neverUserVisible === true,
        `converted draft result neverUserVisible`,
      ),
    ],
    result: case9AdapterResult,
  });

  // ── Case 10: optional live call ───────────────────────────────────────────

  const allowLive =
    process.env["VAYLO_ALLOW_LIVE_LLM_SANDBOX"] === "true" &&
    Boolean(process.env["OPENAI_API_KEY"]?.trim());

  if (!allowLive) {
    cases.push(
      skipCase(
        10,
        "optional live call",
        "Skipped: VAYLO_ALLOW_LIVE_LLM_SANDBOX !== 'true' or OPENAI_API_KEY absent. " +
          "Set both env vars to run this case manually.",
      ),
    );
  } else {
    cases.push(
      await runCase(
        10,
        "optional live call (VAYLO_ALLOW_LIVE_LLM_SANDBOX enabled)",
        makeSandboxInput({
          provider: "openai",
          allowLiveCall: true,
          sandboxRunId: "8.2g-5-c10-live",
        }),
        (r) => [
          assert(
            r.disposition === "completed_live_sandbox_call" ||
              r.disposition === "failed_provider_error" ||
              r.disposition === "failed_output_shape_violation",
            `disposition should be a live-call outcome; got ${r.disposition}`,
          ),
          assert(
            r.userVisibleOutputAllowed === false,
            `userVisibleOutputAllowed must be false even on live call`,
          ),
          assert(r.persistenceUsed === false, `persistenceUsed must be false`),
          assert(r.realUserInputUsed === false, `realUserInputUsed must be false`),
          assert(r.neverUserVisible === true, `neverUserVisible must be true`),
          assert(
            r.disposition !== "completed_live_sandbox_call" ||
              r.sectionCandidates.every((c) =>
                c.draftText.startsWith(LIVE_SANDBOX_DRAFT_PREFIX),
              ),
            `if live call succeeded, all candidates must have the prefix`,
          ),
        ],
      ),
    );
  }

  // ── Aggregate ─────────────────────────────────────────────────────────────

  const allPassed = cases.every((c) => c.passed);

  return {
    scaffoldVersion: LIVE_SANDBOX_REGRESSION_SCAFFOLD_VERSION,
    allPassed,
    caseResults: cases,
    notes: [
      "Phase 8.2G-5 — Runtime Live LLM Sandbox regression scaffold.",
      "10 cases: guard chain, shape validator, invariants, optional live call.",
      "Cases 1–9 always run without API key. Case 10 skipped unless explicit env flags set.",
      "No Jest, no Vitest, no CI hook. No real user input. No persistence.",
      "No Smart Talk wiring. No user-visible output.",
      `All cases passed: ${String(allPassed)}.`,
    ],
  };
}
