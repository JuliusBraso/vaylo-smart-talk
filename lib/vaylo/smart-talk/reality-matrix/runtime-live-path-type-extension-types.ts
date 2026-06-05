/**
 * Runtime Live Path Type Extension types (Phase 8.2G-5A).
 *
 * Resolves the modeling gap discovered in Phase 8.2G-5 by introducing a
 * `RuntimeLiveSandboxGuardProof` that carries cryptographic-style evidence
 * that all six sandbox guards passed during a live LLM call.
 *
 * The proof is validated by `validateRuntimeLiveSandboxGuardProof` before
 * the output contract validator (Phase 8.2G-2) accepts any live-sandbox draft.
 *
 * Architecture:
 *   Live sandbox adapter (8.2G-5)
 *     → attaches RuntimeLiveSandboxGuardProof to result
 *   Output contract validator (8.2G-2)
 *     → calls validateRuntimeLiveSandboxGuardProof
 *     → only proceeds if proof.valid === true
 *
 * This file is intentionally self-contained (no imports from other sandbox
 * or validator files) to avoid circular import chains.
 *
 * Safety guarantees:
 * - no LLM call
 * - no API keys or environment variables
 * - no side effects
 * - no persistence
 * - no user-visible output
 * - pure functions only
 */

// ── Draft prefix shared constant ──────────────────────────────────────────────

/**
 * Required prefix on every `draftText` in live sandbox section candidates.
 * Defined here (the bridge file) so both the sandbox adapter and the output
 * contract validator import from a single canonical source.
 */
export const LIVE_SANDBOX_DRAFT_TEXT_PREFIX =
  "[LIVE_SANDBOX_DRAFT_NEVER_USER_VISIBLE]";

// ── Proof kind ────────────────────────────────────────────────────────────────

export type RuntimeLiveSandboxGuardProofKind = "live_llm_sandbox_guard_proof";

// ── Proof status ──────────────────────────────────────────────────────────────

/**
 * - `proven`  — all 12 guard rules passed; the proof is valid.
 * - `missing` — no proof was supplied.
 * - `invalid` — one or more guard rules failed.
 */
export type RuntimeLiveSandboxGuardProofStatus = "proven" | "missing" | "invalid";

// ── Proof diagnostic codes ────────────────────────────────────────────────────

/**
 * Never-user-visible diagnostic codes emitted by `validateRuntimeLiveSandboxGuardProof`.
 *
 * Positive marker:
 * - `live_path_proof_present` — proof is valid; all guards proven.
 *
 * Failure markers:
 * - `live_path_proof_missing`                  — no proof provided.
 * - `live_path_proof_invalid`                  — proof failed one or more rules.
 * - `live_path_proof_non_synthetic_fixture`    — `syntheticOnly` not true.
 * - `live_path_proof_real_pii_risk`            — `neverContainsRealPii` not true.
 * - `live_path_proof_output_shape_not_validated`— `outputShapeValidated` not true.
 * - `live_path_proof_user_visible_output_violation`— `userVisibleOutputAllowed` not false.
 * - `live_path_proof_persistence_violation`    — `persistenceUsed` not false.
 * - `live_path_proof_real_user_input_violation`— `realUserInputUsed` not false.
 * - `live_path_proof_prompt_contract_missing`  — `promptContractBuilt` not true.
 */
export type RuntimeLiveSandboxGuardProofDiagnosticCode =
  | "live_path_proof_present"
  | "live_path_proof_missing"
  | "live_path_proof_invalid"
  | "live_path_proof_non_synthetic_fixture"
  | "live_path_proof_real_pii_risk"
  | "live_path_proof_output_shape_not_validated"
  | "live_path_proof_user_visible_output_violation"
  | "live_path_proof_persistence_violation"
  | "live_path_proof_real_user_input_violation"
  | "live_path_proof_prompt_contract_missing";

// ── Proof ─────────────────────────────────────────────────────────────────────

/**
 * Evidence that all six sandbox guards passed during a live LLM sandbox call.
 *
 * Built by `runRuntimeLiveLLMSandboxAdapter` only when:
 *  1. `allowLiveCall === true`
 *  2. `fixture.syntheticOnly === true`
 *  3. `fixture.neverContainsRealPii === true`
 *  4. `fixture.neverUserVisible === true`
 *  5. `provider === "openai"` and `OPENAI_API_KEY` is present
 *  6. `validateLiveLLMOutputShape()` returned `valid: true`
 *
 * Every field is a literal type. `validateRuntimeLiveSandboxGuardProof` checks
 * each field defensively at runtime to catch any bypass attempts via casts.
 *
 * `proofKind`             — always `"live_llm_sandbox_guard_proof"`.
 * `status`                — always `"proven"` when attached to a valid result.
 * `sandboxRunId`          — echoes the `sandboxRunId` of the sandbox run.
 * `fixtureId`             — echoes the `fixtureId` of the fixture used.
 * `provider`              — always `"openai"` for live calls.
 * `disposition`           — always `"completed_live_sandbox_call"`.
 * `allowLiveCall`         — always `true`; confirms explicit opt-in.
 * `syntheticOnly`         — always `true`; confirms synthetic fixture guard.
 * `neverContainsRealPii`  — always `true`; confirms PII guard.
 * `outputShapeValidated`  — always `true`; confirms shape was checked.
 * `promptContractBuilt`   — always `true`; confirms prompt was built.
 * `userVisibleOutputAllowed`— always `false`; literal safety invariant.
 * `persistenceUsed`       — always `false`; literal safety invariant.
 * `realUserInputUsed`     — always `false`; literal safety invariant.
 * `neverUserVisible`      — always `true`; compile-time invariant.
 * `notes`                 — optional governance notes.
 */
export interface RuntimeLiveSandboxGuardProof {
  readonly proofKind: "live_llm_sandbox_guard_proof";
  readonly status: RuntimeLiveSandboxGuardProofStatus;
  readonly sandboxRunId: string;
  readonly fixtureId: string;
  readonly provider: "openai";
  readonly disposition: "completed_live_sandbox_call";
  readonly allowLiveCall: true;
  readonly syntheticOnly: true;
  readonly neverContainsRealPii: true;
  readonly outputShapeValidated: true;
  readonly promptContractBuilt: true;
  readonly userVisibleOutputAllowed: false;
  readonly persistenceUsed: false;
  readonly realUserInputUsed: false;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Proof validation result ───────────────────────────────────────────────────

/**
 * The result of `validateRuntimeLiveSandboxGuardProof`.
 *
 * `valid`           — `true` if all 12 guard rules passed.
 * `status`          — the proof status (`proven`, `missing`, or `invalid`).
 * `diagnostics`     — ordered diagnostic codes explaining the outcome.
 * `neverUserVisible`— compile-time invariant.
 * `notes`           — optional governance notes.
 */
export interface RuntimeLiveSandboxGuardProofValidationResult {
  readonly valid: boolean;
  readonly status: RuntimeLiveSandboxGuardProofStatus;
  readonly diagnostics: readonly RuntimeLiveSandboxGuardProofDiagnosticCode[];
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Proof validator ───────────────────────────────────────────────────────────

/**
 * Reads a field from an object bypassing TypeScript's literal-type narrowing.
 * Used for defensive runtime checks against fields that the type system says
 * are always literal values but may have been bypassed via cast at runtime.
 */
function readProofField<T>(proof: RuntimeLiveSandboxGuardProof, field: string): T {
  return (proof as unknown as Record<string, unknown>)[field] as T;
}

/**
 * Validates a `RuntimeLiveSandboxGuardProof` against 13 rules.
 *
 * Rules 1–12 each check a specific literal-type field defensively at runtime.
 * Rule 13 (all pass) → `valid: true`, `status: "proven"`, `live_path_proof_present`.
 *
 * Returns a `RuntimeLiveSandboxGuardProofValidationResult`.
 *
 * Pure function — no side effects, no LLM calls, no external dependencies.
 */
export function validateRuntimeLiveSandboxGuardProof(
  proof: RuntimeLiveSandboxGuardProof | null | undefined,
): RuntimeLiveSandboxGuardProofValidationResult {
  // Rule 1 — missing proof
  if (proof === null || proof === undefined) {
    return {
      valid: false,
      status: "missing",
      diagnostics: ["live_path_proof_missing"],
      neverUserVisible: true,
      notes: ["No guard proof provided. A RuntimeLiveSandboxGuardProof is required."],
    };
  }

  const failureDiagnostics: RuntimeLiveSandboxGuardProofDiagnosticCode[] = [];
  let isInvalid = false;

  // Rule 2 — proofKind
  if (readProofField<unknown>(proof, "proofKind") !== "live_llm_sandbox_guard_proof") {
    isInvalid = true;
  }

  // Rule 3 — disposition
  if (readProofField<unknown>(proof, "disposition") !== "completed_live_sandbox_call") {
    isInvalid = true;
  }

  // Rule 4 — allowLiveCall
  if (readProofField<unknown>(proof, "allowLiveCall") !== true) {
    isInvalid = true;
  }

  // Rule 5 — syntheticOnly
  if (readProofField<unknown>(proof, "syntheticOnly") !== true) {
    isInvalid = true;
    failureDiagnostics.push("live_path_proof_non_synthetic_fixture");
  }

  // Rule 6 — neverContainsRealPii
  if (readProofField<unknown>(proof, "neverContainsRealPii") !== true) {
    isInvalid = true;
    failureDiagnostics.push("live_path_proof_real_pii_risk");
  }

  // Rule 7 — outputShapeValidated
  if (readProofField<unknown>(proof, "outputShapeValidated") !== true) {
    isInvalid = true;
    failureDiagnostics.push("live_path_proof_output_shape_not_validated");
  }

  // Rule 8 — promptContractBuilt
  if (readProofField<unknown>(proof, "promptContractBuilt") !== true) {
    isInvalid = true;
    failureDiagnostics.push("live_path_proof_prompt_contract_missing");
  }

  // Rule 9 — userVisibleOutputAllowed must be false
  if (readProofField<unknown>(proof, "userVisibleOutputAllowed") !== false) {
    isInvalid = true;
    failureDiagnostics.push("live_path_proof_user_visible_output_violation");
  }

  // Rule 10 — persistenceUsed must be false
  if (readProofField<unknown>(proof, "persistenceUsed") !== false) {
    isInvalid = true;
    failureDiagnostics.push("live_path_proof_persistence_violation");
  }

  // Rule 11 — realUserInputUsed must be false
  if (readProofField<unknown>(proof, "realUserInputUsed") !== false) {
    isInvalid = true;
    failureDiagnostics.push("live_path_proof_real_user_input_violation");
  }

  // Rule 12 — neverUserVisible
  if (readProofField<unknown>(proof, "neverUserVisible") !== true) {
    isInvalid = true;
  }

  if (isInvalid) {
    return {
      valid: false,
      status: "invalid",
      diagnostics: ["live_path_proof_invalid", ...failureDiagnostics],
      neverUserVisible: true,
      notes: [
        `Guard proof failed ${String(failureDiagnostics.length + 1)} rule(s). ` +
          "Live LLM sandbox path rejected.",
      ],
    };
  }

  // Rule 13 — all rules passed
  return {
    valid: true,
    status: "proven",
    diagnostics: ["live_path_proof_present"],
    neverUserVisible: true,
  };
}
