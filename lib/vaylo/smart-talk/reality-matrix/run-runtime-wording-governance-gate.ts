/**
 * Runtime Wording Governance Gate (Phase 8.2G-3).
 *
 * Implements `runRuntimeWordingGovernanceGate` — the third gate in the 8.2G
 * LLM integration pipeline. It consumes only drafts that passed the LLM output
 * contract validator (Phase 8.2G-2), then evaluates wording safety using the
 * existing wording evaluation scaffold (Phase 8.2F-12/8.2F-15G).
 *
 * No live LLM judge is called. No NLP library is used. No real prose text is
 * semantically evaluated. The gate operates entirely on caller-supplied
 * `WordingToneScoreReport` metadata.
 *
 * Position in pipeline:
 *   llm_output_contract_validator (8.2G-2)
 *     → [THIS GATE] wording_evaluation_gate (8.2G-3)
 *     → audit_trace_emission (8.2G-4)
 *
 * Evaluation rules (in order):
 *  1. Preserve all never-user-visible invariants unconditionally.
 *  2. Reject if the upstream contract validator did not return
 *     `accepted_for_next_gate` → `rejected_previous_gate_failed`.
 *  3. Reject if `scoreReport` is `null` → `rejected_missing_score_report`.
 *  4. Validate the score report structurally; reject if `!valid` →
 *     `rejected_invalid_score_report`.
 *  5. Record `unattested` attestation status as a governance diagnostic
 *     without hard-failing.
 *  6. Run `evaluateExplanationWordingFromScoreReport` with the draft ID.
 *  7. Map the wording evaluation disposition to the gate verdict.
 *  8. Build per-section results mirroring the global disposition.
 *  9. Always emit the three invariant diagnostic codes.
 *
 * The gate never inspects `draftText` content semantically — it delegates all
 * prose analysis to the future LLM judge (Phase 8.2G-5) and trusts Phase
 * 8.2G-2 for structural output contract validation.
 *
 * Safety guarantees:
 * - no live LLM judge called
 * - no NLP library imported
 * - no real prose semantically evaluated
 * - no external calls or side effects
 * - no persistence or logging
 * - pure function
 * - acceptedForUserVisibleAssembly always false
 * - liveLLMJudgeCalled always false
 * - realTextSemanticallyEvaluated always false
 * - userVisibleOutputAllowed always false
 * - neverUserVisible always true
 */

import {
  evaluateExplanationWordingFromScoreReport,
  validateWordingToneScoreReport,
} from "./reality-simulation/run-wording-evaluation-scaffold";
import type { WordingEvaluationDisposition } from "./reality-simulation/wording-evaluation-types";
import type {
  RuntimeWordingGateDiagnosticCode,
  RuntimeWordingGateInput,
  RuntimeWordingGateResult,
  RuntimeWordingGateSectionResult,
  RuntimeWordingGateVerdict,
} from "./runtime-wording-governance-gate-types";

export const RUNTIME_WORDING_GOVERNANCE_GATE_VERSION =
  "8.2g-3-runtime-wording-governance-gate-v1";

// ── Invariant diagnostic codes emitted on every result ────────────────────────

const INVARIANT_DIAGNOSTICS: readonly RuntimeWordingGateDiagnosticCode[] = [
  "wording_gate_user_visible_output_still_forbidden",
  "wording_gate_draft_text_not_evaluated_semantically",
  "wording_gate_never_user_visible_preserved",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRejectedSectionResults(
  input: RuntimeWordingGateInput,
  disposition: WordingEvaluationDisposition,
  note: string,
): readonly RuntimeWordingGateSectionResult[] {
  return input.draftResult.sectionCandidates.map((section) => ({
    sectionType: section.sectionType,
    accepted: false,
    wordingEvaluationDisposition: disposition,
    diagnostics: [...INVARIANT_DIAGNOSTICS],
    neverUserVisible: true as const,
    notes: [note],
  }));
}

// ── Main gate function ────────────────────────────────────────────────────────

/**
 * Runs the wording governance gate over a draft that passed Phase 8.2G-2.
 *
 * Returns a `RuntimeWordingGateResult` with:
 * - a top-level `verdict`
 * - per-section wording gate results
 * - optional full `wordingEvaluationResult`
 * - `acceptedForAuditDryRun: true` only when verdict is
 *   `accepted_for_audit_dry_run`
 * - all literal-type invariants set to their required values
 *
 * Pure function — no side effects, no external calls, no persistence.
 */
export function runRuntimeWordingGovernanceGate(
  input: RuntimeWordingGateInput,
): RuntimeWordingGateResult {
  const diagnostics: RuntimeWordingGateDiagnosticCode[] = [...INVARIANT_DIAGNOSTICS];
  const resultNotes: string[] = [
    `Gate version: ${RUNTIME_WORDING_GOVERNANCE_GATE_VERSION}`,
    "liveLLMJudgeCalled: false — no LLM judge was called.",
    "realTextSemanticallyEvaluated: false — draftText content was not semantically evaluated.",
  ];

  // ── Rule 2 — previous contract gate must pass ─────────────────────────────

  if (input.outputContractValidation.verdict !== "accepted_for_next_gate") {
    diagnostics.push("wording_gate_previous_contract_not_accepted");
    resultNotes.push(
      `Upstream contract validation verdict is '${input.outputContractValidation.verdict}', ` +
        "not 'accepted_for_next_gate'. Wording evaluation skipped.",
    );

    return {
      verdict: "rejected_previous_gate_failed",
      acceptedForAuditDryRun: false,
      acceptedForUserVisibleAssembly: false,
      sectionResults: [],
      diagnostics,
      liveLLMJudgeCalled: false,
      realTextSemanticallyEvaluated: false,
      userVisibleOutputAllowed: false,
      neverUserVisible: true,
      notes: resultNotes,
    };
  }

  // ── Rule 3 — score report required ───────────────────────────────────────

  if (input.scoreReport === null) {
    diagnostics.push("wording_gate_missing_score_report");
    resultNotes.push(
      "scoreReport is null. Wording evaluation cannot proceed without a " +
        "WordingToneScoreReport. Supply a valid score report from a " +
        "future evaluator or governance fixture.",
    );

    return {
      verdict: "rejected_missing_score_report",
      acceptedForAuditDryRun: false,
      acceptedForUserVisibleAssembly: false,
      sectionResults: makeRejectedSectionResults(
        input,
        "hard_fail_tone_violation",
        "Score report missing — section cannot be evaluated.",
      ),
      diagnostics,
      liveLLMJudgeCalled: false,
      realTextSemanticallyEvaluated: false,
      userVisibleOutputAllowed: false,
      neverUserVisible: true,
      notes: resultNotes,
    };
  }

  // ── Rule 4 — validate score report structure ──────────────────────────────

  const scoreValidation = validateWordingToneScoreReport(input.scoreReport);

  if (!scoreValidation.valid || !scoreValidation.scoreUsable) {
    diagnostics.push("wording_gate_invalid_score_report");
    resultNotes.push(
      `WordingToneScoreReport '${input.scoreReport.reportId}' failed structural validation: ` +
        scoreValidation.diagnostics.join("; "),
    );

    return {
      verdict: "rejected_invalid_score_report",
      acceptedForAuditDryRun: false,
      acceptedForUserVisibleAssembly: false,
      sectionResults: makeRejectedSectionResults(
        input,
        "hard_fail_tone_violation",
        "Score report structurally invalid — section cannot be evaluated.",
      ),
      diagnostics,
      liveLLMJudgeCalled: false,
      realTextSemanticallyEvaluated: false,
      userVisibleOutputAllowed: false,
      neverUserVisible: true,
      notes: resultNotes,
    };
  }

  // ── Rule 5 — record unattested provenance gap ─────────────────────────────

  if (input.scoreReport.attestationStatus === "unattested") {
    diagnostics.push("wording_gate_score_report_unattested");
    resultNotes.push(
      `WordingToneScoreReport '${input.scoreReport.reportId}' attestationStatus is ` +
        "'unattested'. Score provenance is unverified. Evaluation proceeds with " +
        "provenance gap recorded for governance audit. This is acceptable in " +
        "Phase 8.2G-3 scaffolding; production requires a verified attestation.",
    );
  }

  // ── Rule 6 — evaluate wording ─────────────────────────────────────────────

  const wordingEvaluationResult = evaluateExplanationWordingFromScoreReport({
    draftId: input.draftResult.draftId,
    scoreReport: input.scoreReport,
  });

  // ── Rule 7 — map disposition to verdict ───────────────────────────────────

  let verdict: RuntimeWordingGateVerdict;
  let acceptedForAuditDryRun: boolean;

  switch (wordingEvaluationResult.disposition) {
    case "approved":
      verdict = "accepted_for_audit_dry_run";
      acceptedForAuditDryRun = true;
      diagnostics.push("wording_gate_accepted_for_audit_dry_run");
      resultNotes.push(
        "Wording evaluation: approved. Draft may proceed to Phase 8.2G-4 (audit dry run). " +
          "User-visible assembly remains forbidden until all gates pass.",
      );
      break;

    case "human_review_required":
      verdict = "human_review_required";
      acceptedForAuditDryRun = false;
      diagnostics.push("wording_gate_human_review_required");
      resultNotes.push(
        "Wording evaluation: human_review_required. " +
          "A human reviewer must inspect the wording score report before any " +
          "draft proceeds further in the pipeline.",
      );
      break;

    case "hard_fail_tone_violation":
      verdict = "hard_fail_wording_violation";
      acceptedForAuditDryRun = false;
      diagnostics.push("wording_gate_hard_fail_tone_violation");
      resultNotes.push(
        "Wording evaluation: hard_fail_tone_violation. " +
          `Violations: [${wordingEvaluationResult.violations.join(", ")}]. ` +
          "This draft must not proceed under any circumstances.",
      );
      break;

    default: {
      // Exhaustive check — TypeScript will warn if WordingEvaluationDisposition gains new members.
      const _exhaustive: never = wordingEvaluationResult.disposition;
      void _exhaustive;
      verdict = "hard_fail_wording_violation";
      acceptedForAuditDryRun = false;
      resultNotes.push("Unexpected wording evaluation disposition. Defaulting to hard fail.");
    }
  }

  // ── Rule 8 — section results ──────────────────────────────────────────────

  // Wording evaluation in Phase 8.2G-3 operates at draft level (using the
  // global score report) rather than per-section. Each section mirrors the
  // global verdict disposition. A future phase may introduce per-section score
  // reports when a live LLM judge is available.
  const sectionResults: RuntimeWordingGateSectionResult[] =
    input.draftResult.sectionCandidates.map((section) => ({
      sectionType: section.sectionType,
      accepted: acceptedForAuditDryRun,
      wordingEvaluationDisposition: wordingEvaluationResult.disposition,
      diagnostics: [...INVARIANT_DIAGNOSTICS],
      neverUserVisible: true as const,
      notes: [
        "Section draftText was NOT semantically evaluated in Phase 8.2G-3. " +
          "The wording score report is applied at draft level only. " +
          "Per-section semantic evaluation requires a live LLM judge (Phase 8.2G-5).",
      ],
    }));

  return {
    verdict,
    acceptedForAuditDryRun,
    acceptedForUserVisibleAssembly: false,
    sectionResults,
    diagnostics,
    wordingEvaluationResult,
    liveLLMJudgeCalled: false,
    realTextSemanticallyEvaluated: false,
    userVisibleOutputAllowed: false,
    neverUserVisible: true,
    notes: resultNotes,
  };
}
