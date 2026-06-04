/**
 * Runtime Governance Dry-Run orchestrator (Phase 8.2G-4).
 *
 * Connects the 8.2G pipeline gates (8.2G-1 mock adapter → 8.2G-2 output contract
 * validator → 8.2G-3 wording governance gate) to the 8.2F audit trace emission
 * and diagnostic envelope adapter infrastructure.
 *
 * Proves that a full dry-run governance chain can produce:
 * 1. a valid AuditTraceChain
 * 2. normalized DiagnosticEnvelopes
 * 3. a never-user-visible dry-run result
 *
 * without calling any live LLM, without persistence, without runtime Smart Talk
 * wiring, and without user-visible output.
 *
 * Safety guarantees:
 * - no LLM SDK imported
 * - no API keys or env vars
 * - no persistence (no DB, no log, no file writes)
 * - no telemetry
 * - no Smart Talk production connection
 * - no OCR SDK
 * - no user-visible output
 * - liveLLMCalled is always literal false
 * - persistenceUsed is always literal false
 * - userVisibleOutputAllowed is always literal false
 * - neverUserVisible is always true
 */

import { runRuntimeLLMDraftMockAdapter } from "./run-runtime-llm-draft-mock-adapter";
import { validateRuntimeLLMOutputContract } from "./validate-runtime-llm-output-contract";
import { runRuntimeWordingGovernanceGate } from "./run-runtime-wording-governance-gate";
import {
  validateAuditTraceEmission,
  buildAuditTraceNodeFromEmission,
} from "./reality-simulation/build-audit-trace-emission";
import { validateAuditTraceChain } from "./reality-simulation/run-provenance-audit-scaffold";
import {
  buildDiagnosticEnvelopesFromNativeDiagnostics,
} from "./build-diagnostic-envelope-adapter";
import { validateDiagnosticNamespaceEnvelopes } from "./diagnostic-namespace-registry";
import type {
  RuntimeGovernanceDryRunInput,
  RuntimeGovernanceDryRunResult,
  RuntimeGovernanceDryRunDiagnosticCode,
  RuntimeGovernanceDryRunVerdict,
} from "./runtime-governance-dry-run-types";
import type {
  AuditTraceEmissionRecord,
  AuditTraceEmissionLayer,
  AuditTraceEmissionKind,
  AuditTraceEmissionSeverity,
} from "./reality-simulation/audit-trace-emission-types";
import type { AuditTraceNode, AuditTraceChain } from "./reality-simulation/provenance-audit-types";
import type { DiagnosticEnvelopeAdapterInput } from "./diagnostic-envelope-adapter-types";
import type { RuntimeLLMOutputContractViolationCode } from "./runtime-llm-output-contract-validator-types";
import type { RuntimeWordingGateDiagnosticCode } from "./runtime-wording-governance-gate-types";
import type { RuntimeLLMDraftAdapterDiagnosticCode } from "./runtime-llm-draft-adapter-types";

export const RUNTIME_GOVERNANCE_DRY_RUN_VERSION =
  "8.2g-4-runtime-governance-dry-run-v1";

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Builds a deterministic emissionId from a dryRunId and a step label.
 * No Date, no randomness — purely string-derived.
 */
function buildEmissionId(dryRunId: string, step: string): string {
  return `dry-run:${dryRunId}:${step}`;
}

/**
 * Deduplicates a readonly string array, preserving first-occurrence order.
 */
function deduplicateStrings<T extends string>(arr: readonly T[]): T[] {
  const seen = new Set<T>();
  const result: T[] = [];
  for (const item of arr) {
    if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }
  return result;
}

// ── Emission builders ──────────────────────────────────────────────────────────

function buildAdapterEmission(dryRunId: string): AuditTraceEmissionRecord {
  return {
    emissionId: buildEmissionId(dryRunId, "adapter"),
    layer: "explanation_contract" satisfies AuditTraceEmissionLayer,
    emissionKind: "informational" satisfies AuditTraceEmissionKind,
    severity: "informational" satisfies AuditTraceEmissionSeverity,
    parentTraceIds: [],
    referencedArtifactId: `dry-run:${dryRunId}`,
    neverUserVisible: true,
    notes: [
      "Phase 8.2G-1: mock LLM draft adapter completed.",
      "No live LLM called. Output is internal governance metadata only.",
    ],
  };
}

function buildOutputContractEmission(
  dryRunId: string,
  parentId: string,
  blocked: boolean,
  referencedDiagnosticCode: string | undefined,
): AuditTraceEmissionRecord {
  if (blocked) {
    return {
      emissionId: buildEmissionId(dryRunId, "output-contract"),
      layer: "explanation_contract" satisfies AuditTraceEmissionLayer,
      emissionKind: "section_suppressed" satisfies AuditTraceEmissionKind,
      severity: "blocking" satisfies AuditTraceEmissionSeverity,
      parentTraceIds: [parentId],
      referencedDiagnosticCode: referencedDiagnosticCode ?? "llm_output_contract_violation",
      neverUserVisible: true,
      notes: [
        "Phase 8.2G-2: LLM output contract validator blocked the draft.",
        "Draft must not proceed to the wording gate or user assembly.",
      ],
    };
  }
  return {
    emissionId: buildEmissionId(dryRunId, "output-contract"),
    layer: "explanation_contract" satisfies AuditTraceEmissionLayer,
    emissionKind: "boundary_emitted" satisfies AuditTraceEmissionKind,
    severity: "informational" satisfies AuditTraceEmissionSeverity,
    parentTraceIds: [parentId],
    referencedArtifactId: `dry-run:${dryRunId}:output-contract`,
    neverUserVisible: true,
    notes: [
      "Phase 8.2G-2: LLM output contract validated — accepted for next gate.",
      "No live LLM called. Metadata only.",
    ],
  };
}

function buildWordingGateEmission(
  dryRunId: string,
  parentId: string,
  verdict: "accepted" | "human_review" | "blocked",
  referencedDiagnosticCode: string | undefined,
): AuditTraceEmissionRecord {
  if (verdict === "human_review") {
    return {
      emissionId: buildEmissionId(dryRunId, "wording-gate"),
      layer: "wording_evaluation" satisfies AuditTraceEmissionLayer,
      emissionKind: "human_review_requested" satisfies AuditTraceEmissionKind,
      severity: "warning" satisfies AuditTraceEmissionSeverity,
      parentTraceIds: [parentId],
      referencedDiagnosticCode: referencedDiagnosticCode ?? "wording_gate_human_review_required",
      neverUserVisible: true,
      notes: [
        "Phase 8.2G-3: wording governance gate requested human review.",
        "Draft proceeds conditionally; human approval required before assembly.",
      ],
    };
  }
  if (verdict === "blocked") {
    return {
      emissionId: buildEmissionId(dryRunId, "wording-gate"),
      layer: "wording_evaluation" satisfies AuditTraceEmissionLayer,
      emissionKind: "section_suppressed" satisfies AuditTraceEmissionKind,
      severity: "blocking" satisfies AuditTraceEmissionSeverity,
      parentTraceIds: [parentId],
      referencedDiagnosticCode: referencedDiagnosticCode ?? "wording_gate_hard_fail_tone_violation",
      neverUserVisible: true,
      notes: [
        "Phase 8.2G-3: wording governance gate blocked the draft.",
        "Hard-fail or missing/invalid score report. Draft must not proceed.",
      ],
    };
  }
  return {
    emissionId: buildEmissionId(dryRunId, "wording-gate"),
    layer: "wording_evaluation" satisfies AuditTraceEmissionLayer,
    emissionKind: "informational" satisfies AuditTraceEmissionKind,
    severity: "informational" satisfies AuditTraceEmissionSeverity,
    parentTraceIds: [parentId],
    referencedArtifactId: `dry-run:${dryRunId}:wording-gate`,
    neverUserVisible: true,
    notes: [
      "Phase 8.2G-3: wording governance gate accepted the draft for audit dry run.",
      "No live LLM judge called. Evaluation used metadata score report only.",
    ],
  };
}

// ── Main orchestrator ──────────────────────────────────────────────────────────

/**
 * Runs a full runtime governance dry run through the 8.2G pipeline:
 *
 *   8.2G-1  mock adapter
 *   → 8.2G-2  output contract validator
 *   → 8.2G-3  wording governance gate
 *   → audit trace emission (AuditTraceEmissionRecord × 3)
 *   → AuditTraceChain validation
 *   → diagnostic envelope normalization
 *   → DiagnosticNamespace validation
 *
 * No live LLM. No persistence. No Smart Talk wiring. No user-visible output.
 *
 * Pure function — no side effects. All results carry `neverUserVisible: true`.
 */
export function runRuntimeGovernanceDryRun(
  input: RuntimeGovernanceDryRunInput,
): RuntimeGovernanceDryRunResult {
  const dryRunDiagnostics: RuntimeGovernanceDryRunDiagnosticCode[] = [];

  // ── Step 1 — Start diagnostics ──────────────────────────────────────────────

  dryRunDiagnostics.push("runtime_dry_run_started");
  dryRunDiagnostics.push("runtime_dry_run_user_visible_output_forbidden");
  dryRunDiagnostics.push("runtime_dry_run_no_live_llm_confirmed");
  dryRunDiagnostics.push("runtime_dry_run_no_persistence_confirmed");

  // ── Step 2 — Run mock adapter (8.2G-1) ────────────────────────────────────

  const draftResult = runRuntimeLLMDraftMockAdapter(input.draftInput);
  dryRunDiagnostics.push("runtime_dry_run_mock_adapter_completed");

  // ── Step 3 — Run output contract validator (8.2G-2) ───────────────────────

  const outputContractValidation = validateRuntimeLLMOutputContract({
    input: input.draftInput,
    result: draftResult,
  });
  dryRunDiagnostics.push("runtime_dry_run_output_contract_validated");

  // ── Step 4 — Run wording governance gate (8.2G-3) ─────────────────────────

  const wordingGateResult = runRuntimeWordingGovernanceGate({
    draftResult,
    outputContractValidation,
    scoreReport: input.scoreReport,
    neverUserVisible: true,
  });
  dryRunDiagnostics.push("runtime_dry_run_wording_gate_completed");

  // ── Step 5 — Determine base verdict ───────────────────────────────────────

  let verdictCandidate: RuntimeGovernanceDryRunVerdict;

  const outputContractBlocked =
    outputContractValidation.verdict !== "accepted_for_next_gate";

  if (outputContractBlocked) {
    verdictCandidate = "blocked_by_output_contract";
    dryRunDiagnostics.push("runtime_dry_run_blocked_by_output_contract");
  } else if (wordingGateResult.verdict === "human_review_required") {
    verdictCandidate = "completed_with_human_review_required";
    dryRunDiagnostics.push("runtime_dry_run_human_review_required");
  } else if (wordingGateResult.verdict !== "accepted_for_audit_dry_run") {
    verdictCandidate = "blocked_by_wording_gate";
    dryRunDiagnostics.push("runtime_dry_run_blocked_by_wording_gate");
  } else {
    verdictCandidate = "completed_successfully";
  }

  // ── Step 6 — Build audit trace emissions ──────────────────────────────────

  const adapterEmission = buildAdapterEmission(input.dryRunId);

  const firstOutputContractViolation: string | undefined =
    outputContractValidation.violations[0];

  const outputContractEmission = buildOutputContractEmission(
    input.dryRunId,
    adapterEmission.emissionId,
    outputContractBlocked,
    firstOutputContractViolation,
  );

  // Determine wording gate emission variant.
  let wordingGateVariant: "accepted" | "human_review" | "blocked";
  let wordingGateDiagRef: string | undefined;

  if (verdictCandidate === "completed_with_human_review_required") {
    wordingGateVariant = "human_review";
    wordingGateDiagRef = "wording_gate_human_review_required";
  } else if (
    verdictCandidate === "blocked_by_wording_gate" ||
    // When blocked by output contract the wording gate was skipped; emit
    // an informational record only.
    verdictCandidate === "blocked_by_output_contract"
  ) {
    if (verdictCandidate === "blocked_by_wording_gate") {
      wordingGateVariant = "blocked";
      const firstWordingDiag: RuntimeWordingGateDiagnosticCode | undefined =
        wordingGateResult.diagnostics.find(
          (d) =>
            d === "wording_gate_hard_fail_tone_violation" ||
            d === "wording_gate_missing_score_report" ||
            d === "wording_gate_invalid_score_report" ||
            d === "wording_gate_previous_contract_not_accepted",
        );
      wordingGateDiagRef = firstWordingDiag ?? "wording_gate_hard_fail_tone_violation";
    } else {
      // Output contract blocked — wording gate was not the blocking actor.
      wordingGateVariant = "accepted"; // emits informational record
      wordingGateDiagRef = undefined;
    }
  } else {
    wordingGateVariant = "accepted";
    wordingGateDiagRef = undefined;
  }

  const wordingGateEmission = buildWordingGateEmission(
    input.dryRunId,
    outputContractEmission.emissionId,
    wordingGateVariant,
    wordingGateDiagRef,
  );

  const auditTraceEmissions: readonly AuditTraceEmissionRecord[] = [
    adapterEmission,
    outputContractEmission,
    wordingGateEmission,
  ];

  // ── Step 7 — Validate emissions individually ───────────────────────────────

  let anyEmissionInvalid = false;
  for (const emission of auditTraceEmissions) {
    const emissionValidation = validateAuditTraceEmission(emission);
    if (!emissionValidation.valid) {
      anyEmissionInvalid = true;
    }
  }

  if (anyEmissionInvalid) {
    // Build a minimal but structurally valid chain stub for the result shape.
    const stubNode: AuditTraceNode = buildAuditTraceNodeFromEmission(adapterEmission);
    const stubChain: AuditTraceChain = {
      rootTraceId: adapterEmission.emissionId,
      nodes: [stubNode],
      neverUserVisible: true,
    };
    dryRunDiagnostics.push("runtime_dry_run_audit_trace_invalid");

    // Still build envelopes for the partial result.
    const { envelopes } = buildAllDiagnosticEnvelopes(
      draftResult.diagnostics,
      outputContractValidation.violations,
      wordingGateResult.diagnostics,
      dryRunDiagnostics,
    );
    const envValidation = validateDiagnosticNamespaceEnvelopes(envelopes);
    let diagnosticEnvelopeValid = false;
    if (envValidation.valid) {
      diagnosticEnvelopeValid = true;
      dryRunDiagnostics.push("runtime_dry_run_diagnostic_envelopes_created");
      dryRunDiagnostics.push("runtime_dry_run_diagnostic_envelopes_validated");
    } else {
      dryRunDiagnostics.push("runtime_dry_run_diagnostic_envelope_invalid");
    }

    return {
      dryRunId: input.dryRunId,
      verdict: "failed_audit_trace_validation",
      draftResult,
      outputContractValidation,
      wordingGateResult,
      auditTraceEmissions,
      auditTraceChain: stubChain,
      auditTraceValid: false,
      diagnosticEnvelopes: envelopes,
      diagnosticEnvelopeValid,
      diagnostics: dryRunDiagnostics,
      liveLLMCalled: false,
      persistenceUsed: false,
      userVisibleOutputAllowed: false,
      neverUserVisible: true,
      notes: input.notes,
    };
  }

  // ── Step 8 — Convert emissions to AuditTraceNode ──────────────────────────

  const auditTraceNodes: AuditTraceNode[] = auditTraceEmissions.map(
    (e) => buildAuditTraceNodeFromEmission(e),
  );

  // ── Step 9 — Build AuditTraceChain ────────────────────────────────────────

  const auditTraceChain: AuditTraceChain = {
    rootTraceId: adapterEmission.emissionId,
    nodes: auditTraceNodes,
    neverUserVisible: true,
  };

  // ── Step 10 — Validate AuditTraceChain ────────────────────────────────────

  const chainValidation = validateAuditTraceChain(auditTraceChain);
  let auditTraceValid = false;
  let finalVerdict: RuntimeGovernanceDryRunVerdict = verdictCandidate;

  if (!chainValidation.valid) {
    finalVerdict = "failed_audit_trace_validation";
    dryRunDiagnostics.push("runtime_dry_run_audit_trace_invalid");
  } else {
    auditTraceValid = true;
    dryRunDiagnostics.push("runtime_dry_run_audit_trace_emitted");
    dryRunDiagnostics.push("runtime_dry_run_audit_trace_validated");
  }

  // ── Step 11 — Build diagnostic envelopes ──────────────────────────────────

  const { envelopes } = buildAllDiagnosticEnvelopes(
    draftResult.diagnostics,
    outputContractValidation.violations,
    wordingGateResult.diagnostics,
    dryRunDiagnostics,
  );

  // ── Step 12 — Validate diagnostic envelopes ───────────────────────────────

  const envValidation = validateDiagnosticNamespaceEnvelopes(envelopes);
  let diagnosticEnvelopeValid = false;

  if (!envValidation.valid) {
    if (finalVerdict === verdictCandidate) {
      finalVerdict = "failed_diagnostic_envelope_validation";
    }
    dryRunDiagnostics.push("runtime_dry_run_diagnostic_envelope_invalid");
  } else {
    diagnosticEnvelopeValid = true;
    dryRunDiagnostics.push("runtime_dry_run_diagnostic_envelopes_created");
    dryRunDiagnostics.push("runtime_dry_run_diagnostic_envelopes_validated");
  }

  // ── Step 13 — Return ──────────────────────────────────────────────────────

  return {
    dryRunId: input.dryRunId,
    verdict: finalVerdict,
    draftResult,
    outputContractValidation,
    wordingGateResult,
    auditTraceEmissions,
    auditTraceChain,
    auditTraceValid,
    diagnosticEnvelopes: envelopes,
    diagnosticEnvelopeValid,
    diagnostics: dryRunDiagnostics,
    liveLLMCalled: false,
    persistenceUsed: false,
    userVisibleOutputAllowed: false,
    neverUserVisible: true,
    notes: input.notes,
  };
}

// ── Diagnostic envelope builder helper ────────────────────────────────────────

/**
 * Builds normalized diagnostic envelopes from all native diagnostic sources
 * in the dry-run pipeline.
 *
 * Source kind mappings:
 * - draftResult.diagnostics       → "unknown"
 *   (Phase 8.2G-1 draft adapter has no dedicated DiagnosticEnvelopeSourceKind;
 *   mapped conservatively to "unknown" per 8.2F-15O adapter contract.)
 * - outputContractValidation.violations → "native_contract_validation" (exact match)
 * - wordingGateResult.diagnostics → "native_wording_evaluation" (closest match)
 * - runtime dry-run diagnostics   → "native_governance_lineage_audit" (closest match)
 *
 * Codes are deduplicated per source to prevent duplicate envelope keys.
 */
function buildAllDiagnosticEnvelopes(
  draftAdapterDiagnostics: readonly RuntimeLLMDraftAdapterDiagnosticCode[],
  outputContractViolations: readonly RuntimeLLMOutputContractViolationCode[],
  wordingGateDiagnostics: readonly RuntimeWordingGateDiagnosticCode[],
  dryRunDiagnostics: readonly RuntimeGovernanceDryRunDiagnosticCode[],
): ReturnType<typeof buildDiagnosticEnvelopesFromNativeDiagnostics> {
  const inputs: DiagnosticEnvelopeAdapterInput[] = [];

  for (const code of deduplicateStrings(draftAdapterDiagnostics)) {
    inputs.push({
      sourceKind: "unknown",
      code,
      severity: "informational",
      phase: "8.2G-1",
      sourceVersion: RUNTIME_GOVERNANCE_DRY_RUN_VERSION,
      neverUserVisible: true,
      notes: [
        "Source: Phase 8.2G-1 runtime LLM draft adapter. " +
          "No dedicated DiagnosticEnvelopeSourceKind exists; " +
          "mapped conservatively to unknown.",
      ],
    });
  }

  for (const code of deduplicateStrings(outputContractViolations)) {
    inputs.push({
      sourceKind: "native_contract_validation",
      code,
      severity: "warning",
      phase: "8.2G-2",
      sourceVersion: RUNTIME_GOVERNANCE_DRY_RUN_VERSION,
      neverUserVisible: true,
      notes: ["Source: Phase 8.2G-2 LLM output contract validator."],
    });
  }

  for (const code of deduplicateStrings(wordingGateDiagnostics)) {
    inputs.push({
      sourceKind: "native_wording_evaluation",
      code,
      severity: "informational",
      phase: "8.2G-3",
      sourceVersion: RUNTIME_GOVERNANCE_DRY_RUN_VERSION,
      neverUserVisible: true,
      notes: [
        "Source: Phase 8.2G-3 wording governance gate. " +
          "No dedicated DiagnosticEnvelopeSourceKind; " +
          "mapped to native_wording_evaluation as closest match.",
      ],
    });
  }

  for (const code of deduplicateStrings(dryRunDiagnostics)) {
    inputs.push({
      sourceKind: "native_governance_lineage_audit",
      code,
      severity: "informational",
      phase: "8.2G-4",
      sourceVersion: RUNTIME_GOVERNANCE_DRY_RUN_VERSION,
      neverUserVisible: true,
      notes: [
        "Source: Phase 8.2G-4 runtime governance dry-run harness. " +
          "Mapped to native_governance_lineage_audit as closest match.",
      ],
    });
  }

  return buildDiagnosticEnvelopesFromNativeDiagnostics(inputs);
}
