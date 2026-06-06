/**
 * Controlled Live Text Draft Result types (Phase 8.2I-1).
 *
 * Defines the formal type model for the third source kind in the 8.2G output
 * contract validator pipeline:
 *
 *   adapterMode: "controlled_live_text"
 *   prefix:      [CONTROLLED_LIVE_TEXT_DRAFT_NEVER_USER_VISIBLE]
 *   proof:       ControlledLiveTextRedactionProof
 *
 * This module also exports:
 *   - `validateControlledLiveTextRedactionProof()` — pure proof validator
 *   - `buildControlledLiveTextRedactionProof()`    — proof builder from 8.2H-2/3 results
 *   - `buildControlledLiveTextDraftResult()`       — draft result builder from adapter + proof
 *
 * IMPORTANT — Phase 8.2I-1 constraints:
 * - The output contract validator (`validate-runtime-llm-output-contract.ts`)
 *   is NOT modified in this phase. It will be extended in Phase 8.2I-2.
 * - The temporary mock bridge in `run-guarded-live-text-runtime-pipeline.ts`
 *   is NOT removed in this phase. It will be removed in Phase 8.2I-3.
 * - Real redacted text is NOT forwarded into the 8.2G chain in this phase.
 *   `readyForControlledRealTextForwardingTo8_2G` remains `false`.
 *
 * Key safety properties of `ControlledLiveTextRedactionProof`:
 * - Stores only match metadata (count, redactionApplied) — never raw or redacted text.
 * - `liveLLMCalled: false`, `neverUserVisible: true` — literal types.
 * - `neverContainsRawDetectedValues: true` — literal type.
 *
 * Key safety properties of `ControlledLiveTextDraftResult`:
 * - `adapterMode: "controlled_live_text"` — distinct from "mock" and "future_live_llm".
 * - `liveLLMCalled: false`, `userVisibleOutputAllowed: false` — literal types.
 * - `redactionProof` is required — not optional.
 * - All section `draftText` values must start with `CONTROLLED_LIVE_TEXT_DRAFT_PREFIX`.
 */

import type {
  RuntimeLLMDraftSectionType,
  RuntimeLLMDraftSafetyFlag,
} from "../runtime-llm-draft-adapter-types";
import type { RealTextRedactionBoundaryAccepted } from "./real-text-redaction-boundary-types";
import type { ControlledLiveTextAdapterResult } from "./controlled-live-text-adapter-types";

// ── Prefix constant ───────────────────────────────────────────────────────────

/**
 * The required prefix for all section `draftText` values on the controlled
 * live text path. Analogous to `[MOCK_DRAFT_NEVER_USER_VISIBLE]` (mock) and
 * `[LIVE_SANDBOX_DRAFT_NEVER_USER_VISIBLE]` (live sandbox).
 *
 * Phase 8.2I-2 will add this constant to the 8.2G output contract validator.
 */
export const CONTROLLED_LIVE_TEXT_DRAFT_PREFIX =
  "[CONTROLLED_LIVE_TEXT_DRAFT_NEVER_USER_VISIBLE]";

// ── Source and adapter mode ───────────────────────────────────────────────────

/** The source kind for the controlled live text path. */
export type ControlledLiveTextDraftSourceKind = "controlled_live_text";

/** The adapter mode for the controlled live text path. */
export type ControlledLiveTextDraftAdapterMode = "controlled_live_text";

// ── Proof types ───────────────────────────────────────────────────────────────

export type ControlledLiveTextDraftProofKind = "controlled_live_text_redaction_proof";

export type ControlledLiveTextDraftProofStatus = "proven" | "missing" | "invalid";

export type ControlledLiveTextDraftProofDiagnosticCode =
  | "controlled_live_text_proof_present"
  | "controlled_live_text_proof_missing"
  | "controlled_live_text_proof_invalid"
  | "controlled_live_text_proof_redaction_not_accepted"
  | "controlled_live_text_proof_raw_value_risk"
  | "controlled_live_text_proof_not_never_user_visible"
  | "controlled_live_text_proof_persistence_violation"
  | "controlled_live_text_proof_dna_save_violation"
  | "controlled_live_text_proof_offline_save_violation"
  | "controlled_live_text_proof_llm_call_violation"
  | "controlled_live_text_proof_runtime_pipeline_violation"
  | "controlled_live_text_proof_user_visible_violation";

/**
 * Attestation that the controlled live text draft result was produced from text
 * that passed the 8.2H-2 redaction boundary and the 8.2H-3 adapter.
 *
 * Stores only match metadata — never raw matched values or redacted text.
 *
 * Analogous to `RuntimeLiveSandboxGuardProof` but for the controlled live text path.
 *
 * `redactionApplied`              — mirrors `RealTextRedactionBoundaryAccepted.redactionApplied`.
 * `matchCount`                    — mirrors `matches.length` from the redaction result.
 * `neverContainsRawDetectedValues`— compile-time literal; always `true`.
 * `acceptedForLLM`                — always literal `false`.
 * `liveLLMCalled`                 — always literal `false`.
 * `neverUserVisible`              — always literal `true`.
 */
export interface ControlledLiveTextRedactionProof {
  readonly proofKind: "controlled_live_text_redaction_proof";
  readonly status: "proven";
  readonly sourceKind: "controlled_live_text";
  readonly redactionRunId: string;
  readonly adapterRunId: string;
  readonly acceptedForControlledLiveAdapter: true;
  readonly redactionApplied: boolean;
  readonly matchCount: number;
  readonly neverContainsRawDetectedValues: true;
  readonly acceptedForLLM: false;
  readonly acceptedForRuntimePipeline: false;
  readonly acceptedForUserVisibleOutput: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly liveLLMCalled: false;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

/**
 * Result of `validateControlledLiveTextRedactionProof`.
 */
export interface ControlledLiveTextRedactionProofValidationResult {
  readonly valid: boolean;
  readonly status: ControlledLiveTextDraftProofStatus;
  readonly diagnostics: readonly ControlledLiveTextDraftProofDiagnosticCode[];
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Draft section candidate ───────────────────────────────────────────────────

/**
 * A controlled live text draft section candidate.
 *
 * `draftText` must start with `CONTROLLED_LIVE_TEXT_DRAFT_PREFIX`.
 * `sourceBound: true` — content is bound to the redacted source text.
 * `neverUserVisible: true` — compile-time invariant.
 */
export interface ControlledLiveTextDraftSectionCandidate {
  readonly sectionType: RuntimeLLMDraftSectionType;
  readonly draftText: string;
  readonly sourceBound: true;
  readonly safetyFlags: readonly RuntimeLLMDraftSafetyFlag[];
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Draft result ──────────────────────────────────────────────────────────────

/**
 * The controlled live text draft result — the formal type that Phase 8.2I-2
 * will add to the `RuntimeLLMOutputContractDraftResult` union.
 *
 * `adapterMode: "controlled_live_text"` — the new third source kind.
 * `redactionProof`                      — required; attests the 8.2H-2/3 chain passed.
 * `liveLLMCalled: false`                — literal; no LLM involved.
 * `userVisibleOutputAllowed: false`     — literal; always.
 * `neverUserVisible: true`              — literal; always.
 *
 * This type is NOT yet accepted by the output contract validator in Phase 8.2I-1.
 */
export interface ControlledLiveTextDraftResult {
  readonly adapterMode: "controlled_live_text";
  readonly sourceKind: "controlled_live_text";
  readonly draftId: string;
  readonly sectionCandidates: readonly ControlledLiveTextDraftSectionCandidate[];
  readonly appliedForbiddenMoves: readonly string[];
  readonly appliedRequiredConstraints: readonly string[];
  readonly diagnostics: readonly string[];
  readonly auditTraceParentIds: readonly string[];
  readonly redactionProof: ControlledLiveTextRedactionProof;
  readonly liveLLMCalled: false;
  readonly userVisibleOutputAllowed: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Defensive field reader ────────────────────────────────────────────────────

function readField<T>(obj: unknown, field: string): T {
  return (obj as unknown as Record<string, unknown>)[field] as T;
}

// ── Proof validator ───────────────────────────────────────────────────────────

/**
 * Validates a `ControlledLiveTextRedactionProof` defensively at runtime.
 *
 * Checks every safety-critical field via `unknown` cast to guard against
 * runtime tampering. Does not log the proof or expose any raw values.
 *
 * Pure function — no external calls, no logging, no persistence.
 */
export function validateControlledLiveTextRedactionProof(
  proof: ControlledLiveTextRedactionProof | null | undefined,
): ControlledLiveTextRedactionProofValidationResult {
  if (proof === null || proof === undefined) {
    return {
      valid: false,
      status: "missing",
      diagnostics: ["controlled_live_text_proof_missing"],
      neverUserVisible: true,
    };
  }

  const diagnostics: ControlledLiveTextDraftProofDiagnosticCode[] = [];
  let valid = true;

  const check = (
    condition: boolean,
    code: ControlledLiveTextDraftProofDiagnosticCode,
  ) => {
    if (!condition) {
      diagnostics.push(code);
      valid = false;
    }
  };

  check(
    readField<unknown>(proof, "proofKind") === "controlled_live_text_redaction_proof",
    "controlled_live_text_proof_invalid",
  );
  check(
    readField<unknown>(proof, "status") === "proven",
    "controlled_live_text_proof_invalid",
  );
  check(
    readField<unknown>(proof, "sourceKind") === "controlled_live_text",
    "controlled_live_text_proof_invalid",
  );
  check(
    readField<unknown>(proof, "acceptedForControlledLiveAdapter") === true,
    "controlled_live_text_proof_redaction_not_accepted",
  );
  check(
    readField<unknown>(proof, "neverContainsRawDetectedValues") === true,
    "controlled_live_text_proof_raw_value_risk",
  );
  check(
    readField<unknown>(proof, "acceptedForLLM") === false,
    "controlled_live_text_proof_llm_call_violation",
  );
  check(
    readField<unknown>(proof, "acceptedForRuntimePipeline") === false,
    "controlled_live_text_proof_runtime_pipeline_violation",
  );
  check(
    readField<unknown>(proof, "acceptedForUserVisibleOutput") === false,
    "controlled_live_text_proof_user_visible_violation",
  );
  check(
    readField<unknown>(proof, "persistenceUsed") === false,
    "controlled_live_text_proof_persistence_violation",
  );
  check(
    readField<unknown>(proof, "dnaSavePerformed") === false,
    "controlled_live_text_proof_dna_save_violation",
  );
  check(
    readField<unknown>(proof, "offlineSavePerformed") === false,
    "controlled_live_text_proof_offline_save_violation",
  );
  check(
    readField<unknown>(proof, "liveLLMCalled") === false,
    "controlled_live_text_proof_llm_call_violation",
  );
  check(
    readField<unknown>(proof, "neverUserVisible") === true,
    "controlled_live_text_proof_not_never_user_visible",
  );

  if (valid) {
    diagnostics.push("controlled_live_text_proof_present");
  }

  return {
    valid,
    status: valid ? "proven" : "invalid",
    diagnostics,
    neverUserVisible: true,
  };
}

// ── Proof builder ─────────────────────────────────────────────────────────────

/**
 * Builds a `ControlledLiveTextRedactionProof` from 8.2H-2 redaction boundary
 * and 8.2H-3 adapter result metadata.
 *
 * Stores only match metadata (count, flag) — never the redacted text itself
 * and never the raw detected values.
 *
 * Pure function — no external calls, no logging, no persistence.
 */
export function buildControlledLiveTextRedactionProof(input: {
  readonly redactionAccepted: RealTextRedactionBoundaryAccepted;
  readonly adapterResult: ControlledLiveTextAdapterResult;
  readonly redactionRunId: string;
  readonly adapterRunId: string;
  readonly notes?: readonly string[];
}): ControlledLiveTextRedactionProof {
  return {
    proofKind: "controlled_live_text_redaction_proof",
    status: "proven",
    sourceKind: "controlled_live_text",
    redactionRunId: input.redactionRunId,
    adapterRunId: input.adapterRunId,
    acceptedForControlledLiveAdapter: input.redactionAccepted.acceptedForControlledLiveAdapter,
    redactionApplied: input.redactionAccepted.redactionApplied,
    matchCount: input.redactionAccepted.matches.length,
    neverContainsRawDetectedValues: input.redactionAccepted.neverContainsRawDetectedValues,
    acceptedForLLM: false,
    acceptedForRuntimePipeline: false,
    acceptedForUserVisibleOutput: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    liveLLMCalled: false,
    neverUserVisible: true,
    notes: input.notes,
  };
}

// ── Draft result builder ──────────────────────────────────────────────────────

/**
 * Builds a `ControlledLiveTextDraftResult` from a validated adapter result
 * and a proven redaction proof.
 *
 * Returns `null` if:
 * - `adapterResult.verdict !== "adapted_for_output_contract_validation"`
 * - `adapterResult.adaptedForOutputContractValidation !== true`
 * - Proof validation fails
 * - Any section `draftText` is missing the required prefix
 * - Any section `neverUserVisible !== true`
 *
 * Section text is copied verbatim from the adapter — no rewriting, no
 * summarisation, no translation, no prose generation.
 *
 * Pure function — no external calls, no logging, no persistence.
 */
export function buildControlledLiveTextDraftResult(input: {
  readonly draftId: string;
  readonly adapterResult: ControlledLiveTextAdapterResult;
  readonly redactionProof: ControlledLiveTextRedactionProof;
  readonly appliedForbiddenMoves?: readonly string[];
  readonly appliedRequiredConstraints?: readonly string[];
  readonly diagnostics?: readonly string[];
  readonly auditTraceParentIds?: readonly string[];
  readonly notes?: readonly string[];
}): ControlledLiveTextDraftResult | null {
  // Guard — adapter must have succeeded
  if (
    input.adapterResult.verdict !== "adapted_for_output_contract_validation" ||
    input.adapterResult.adaptedForOutputContractValidation !== true
  ) {
    return null;
  }

  // Guard — proof must be valid
  const proofValidation = validateControlledLiveTextRedactionProof(input.redactionProof);
  if (!proofValidation.valid) {
    return null;
  }

  // Guard — validate and copy section candidates
  const sectionCandidates: ControlledLiveTextDraftSectionCandidate[] = [];
  for (const sc of input.adapterResult.sectionCandidates) {
    // Each section from the adapter already carries the controlled live text prefix
    if (!sc.draftText.startsWith(CONTROLLED_LIVE_TEXT_DRAFT_PREFIX)) {
      return null;
    }
    if (readField<unknown>(sc, "neverUserVisible") !== true) {
      return null;
    }
    sectionCandidates.push({
      sectionType: sc.sectionType,
      draftText: sc.draftText,
      sourceBound: true,
      safetyFlags: [...sc.safetyFlags],
      neverUserVisible: true,
      notes: sc.notes,
    });
  }

  if (sectionCandidates.length === 0) {
    return null;
  }

  return {
    adapterMode: "controlled_live_text",
    sourceKind: "controlled_live_text",
    draftId: input.draftId,
    sectionCandidates,
    appliedForbiddenMoves: input.appliedForbiddenMoves ?? [],
    appliedRequiredConstraints: input.appliedRequiredConstraints ?? [],
    diagnostics: input.diagnostics ?? [],
    auditTraceParentIds: input.auditTraceParentIds ?? [],
    redactionProof: input.redactionProof,
    liveLLMCalled: false,
    userVisibleOutputAllowed: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    neverUserVisible: true,
    notes: input.notes,
  };
}
