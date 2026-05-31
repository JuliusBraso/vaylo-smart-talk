/**
 * Cross-Phase Diagnostic Namespace Registry (Phase 8.2F-15J).
 *
 * Provides:
 * - KNOWN_DIAGNOSTIC_NAMESPACE_LAYERS — authoritative list of all valid layer IDs.
 * - makeDiagnosticEnvelope()           — factory for constructing typed envelopes.
 * - validateDiagnosticNamespaceEnvelopes() — structural integrity validator.
 * - DIAGNOSTIC_NAMESPACE_SAMPLE_REGISTRY — representative envelopes from each layer.
 *
 * Safety guarantees:
 * - no persistence
 * - no logging
 * - no telemetry
 * - no runtime hooks
 * - no Smart Talk connection
 * - no OCR SDK or LLM calls
 * - no existing diagnostic codes renamed, removed, or merged
 * - all envelopes carry neverUserVisible: true
 *
 * Source modules (mappers, bridge, pilot gate, etc.) retain their own typed
 * diagnostic unions and emit diagnostics exactly as before. This registry is
 * audit/correlation infrastructure only.
 */

import type {
  DiagnosticNamespaceLayer,
  DiagnosticNamespaceValidationResult,
  DiagnosticNormalizedEnvelope,
  DiagnosticSeverity,
  DiagnosticVisibility,
} from "./diagnostic-namespace-types";

export const DIAGNOSTIC_NAMESPACE_REGISTRY_VERSION =
  "8.2f-15j-diagnostic-namespace-registry-v1";

// ── Known layers ───────────────────────────────────────────────────────────────

/**
 * Authoritative ordered list of all valid diagnostic namespace layers.
 * `"unknown"` is included so that unknown-layer envelopes are not structurally
 * rejected, but they do prevent `fullyConsistent` from being true.
 */
export const KNOWN_DIAGNOSTIC_NAMESPACE_LAYERS = [
  "mapper_free_preview",
  "mapper_paid_explanation",
  "bridge",
  "wording_review",
  "wording_evaluation",
  "ocr_uncertainty",
  "pilot_gate",
  "incident_governance",
  "provenance_audit",
  "corpus_validation",
  "contract_validation",
  "governance_lineage_audit",
  "unknown",
] as const satisfies readonly DiagnosticNamespaceLayer[];

// ── Envelope factory ───────────────────────────────────────────────────────────

/**
 * Constructs a `DiagnosticNormalizedEnvelope` with the `neverUserVisible: true`
 * compile-time invariant enforced.
 *
 * Does not validate the code against any layer-specific union — callers are
 * responsible for providing a code that matches the source module's diagnostic
 * union. This factory is for cross-phase audit correlation, not runtime gating.
 */
export function makeDiagnosticEnvelope(
  layer: DiagnosticNamespaceLayer,
  code: string,
  severity: DiagnosticSeverity,
  opts: {
    readonly visibility?: DiagnosticVisibility;
    readonly phase?: string;
    readonly sourceVersion?: string;
    readonly notes?: readonly string[];
  } = {},
): DiagnosticNormalizedEnvelope {
  return {
    layer,
    code,
    severity,
    visibility: opts.visibility ?? "never_user_visible",
    phase: opts.phase,
    sourceVersion: opts.sourceVersion,
    neverUserVisible: true,
    notes: opts.notes,
  };
}

// ── Envelope validator ─────────────────────────────────────────────────────────

/**
 * Validates a collection of `DiagnosticNormalizedEnvelope` instances for
 * structural integrity across the namespace.
 *
 * Rules:
 *  1. `code` must be non-empty (hard failure → valid = false).
 *  2. `neverUserVisible` must be `true` (hard failure → valid = false).
 *  3. `layer === "unknown"` is a soft warning → fullyConsistent = false.
 *  4. Duplicate key `${layer}:${code}:${phase ?? ""}` → fullyConsistent = false.
 *  5. `valid = true` iff no hard failures (rules 1–2).
 *  6. `fullyConsistent = true` iff valid AND no soft warnings (rules 3–4).
 *
 * Pure function — no side effects, no persistence, no logging, no telemetry.
 */
export function validateDiagnosticNamespaceEnvelopes(
  envelopes: readonly DiagnosticNormalizedEnvelope[],
): DiagnosticNamespaceValidationResult {
  const emptyCodes: string[] = [];
  const userVisibleViolations: string[] = [];
  const unknownLayers: string[] = [];
  const duplicateEnvelopeKeys: string[] = [];

  // Collect keys for duplicate detection.
  const seenKeys = new Map<string, number>();

  envelopes.forEach((env, idx) => {
    const label = `[${String(idx)}] layer=${env.layer} code="${env.code}"`;

    // Rule 1: non-empty code.
    if (!env.code || env.code.trim() === "") {
      emptyCodes.push(label);
    }

    // Rule 2: neverUserVisible must be true.
    if (env.neverUserVisible !== true) {
      userVisibleViolations.push(label);
    }

    // Rule 3: unknown layer (soft warning).
    if (env.layer === "unknown") {
      unknownLayers.push(label);
    }

    // Rule 4: duplicate key tracking.
    const key = `${env.layer}:${env.code}:${env.phase ?? ""}`;
    seenKeys.set(key, (seenKeys.get(key) ?? 0) + 1);
  });

  // Identify keys seen more than once.
  for (const [key, count] of seenKeys.entries()) {
    if (count > 1) {
      duplicateEnvelopeKeys.push(`"${key}" (×${String(count)})`);
    }
  }

  const valid = emptyCodes.length === 0 && userVisibleViolations.length === 0;

  const fullyConsistent =
    valid &&
    unknownLayers.length === 0 &&
    duplicateEnvelopeKeys.length === 0;

  const notes: string[] = [];
  if (valid && fullyConsistent) {
    notes.push(
      `All ${String(envelopes.length)} envelope(s) are structurally valid, ` +
        "have known layers, have non-empty codes, and contain no duplicates.",
    );
  } else {
    if (!valid) {
      notes.push(
        `Validation failed: ${String(emptyCodes.length)} empty code(s), ` +
          `${String(userVisibleViolations.length)} user-visible violation(s).`,
      );
    }
    if (!fullyConsistent) {
      notes.push(
        `Consistency issues: ${String(unknownLayers.length)} unknown layer(s), ` +
          `${String(duplicateEnvelopeKeys.length)} duplicate key(s).`,
      );
    }
  }

  notes.push(
    "Validator is metadata-only: no persistence, no logging, no telemetry, no runtime hooks.",
  );

  return {
    valid,
    fullyConsistent,
    unknownLayers,
    emptyCodes,
    userVisibleViolations,
    duplicateEnvelopeKeys,
    neverUserVisible: true,
    notes,
  };
}

// ── Sample registry ────────────────────────────────────────────────────────────

/**
 * Representative sample of normalized diagnostic envelopes covering each
 * governance layer. This is NOT an exhaustive catalog — it is a foundation
 * demonstrating the envelope model across all known layers.
 *
 * Source modules continue to emit their own typed diagnostics; this registry
 * is audit/correlation infrastructure for cross-phase analysis only.
 */
export const DIAGNOSTIC_NAMESPACE_SAMPLE_REGISTRY: readonly DiagnosticNormalizedEnvelope[] =
  [
    // ── Mapper — free preview ─────────────────────────────────────────────────
    makeDiagnosticEnvelope(
      "mapper_free_preview",
      "free_preview_paid_field_blocked",
      "informational",
      { phase: "8.2F-3/15C", notes: ["Structural invariant: paid sections absent in free preview tier."] },
    ),
    makeDiagnosticEnvelope(
      "mapper_free_preview",
      "free_preview_legal_verdict_blocked",
      "blocking",
      { phase: "8.2F-15C", notes: ["no_definitive_legal_verdicts forbidden move active."] },
    ),
    makeDiagnosticEnvelope(
      "mapper_free_preview",
      "free_preview_enforcement_claim_blocked",
      "blocking",
      { phase: "8.2F-3", notes: ["no_enforcement_claim_when_forbidden active."] },
    ),
    makeDiagnosticEnvelope(
      "mapper_free_preview",
      "invalid_access_tier_for_free_preview_mapper",
      "critical",
      { phase: "8.2F-3", notes: ["Wrong tier routed to free preview mapper."] },
    ),

    // ── Mapper — paid explanation ─────────────────────────────────────────────
    makeDiagnosticEnvelope(
      "mapper_paid_explanation",
      "paid_legal_verdict_blocked",
      "blocking",
      { phase: "8.2F-4/15C", notes: ["no_definitive_legal_verdicts forbidden move active."] },
    ),
    makeDiagnosticEnvelope(
      "mapper_paid_explanation",
      "paid_section_excluded_by_forbidden_move",
      "informational",
      { phase: "8.2F-15C", notes: ["Generic section exclusion via forbidden move."] },
    ),
    makeDiagnosticEnvelope(
      "mapper_paid_explanation",
      "paid_deadline_output_blocked",
      "blocking",
      { phase: "8.2F-4", notes: ["no_deadline_calculation_when_forbidden active."] },
    ),
    makeDiagnosticEnvelope(
      "mapper_paid_explanation",
      "invalid_access_tier_for_paid_explanation_mapper",
      "critical",
      { phase: "8.2F-4", notes: ["Wrong tier routed to paid mapper."] },
    ),

    // ── Bridge ────────────────────────────────────────────────────────────────
    makeDiagnosticEnvelope(
      "bridge",
      "bridge_governance_preservation_failure",
      "blocking",
      { phase: "8.2F-6", notes: ["Contract forbidden move or required constraint absent from draft."] },
    ),
    makeDiagnosticEnvelope(
      "bridge",
      "bridge_invalid_section_invariant",
      "blocking",
      { phase: "8.2F-6", notes: ["Section draft violates sourceBound or neverContainsUserVisibleCopy."] },
    ),
    makeDiagnosticEnvelope(
      "bridge",
      "bridge_free_preview_leakage",
      "blocking",
      { phase: "8.2F-6", notes: ["Tier boundary violated: paid section in free draft or vice versa."] },
    ),
    makeDiagnosticEnvelope(
      "bridge",
      "bridge_contract_tier_mismatch",
      "informational",
      { phase: "8.2F-6A", notes: ["Observability-only: input.accessTier differs from contract.accessTier. Non-blocking."] },
    ),
    makeDiagnosticEnvelope(
      "bridge",
      "bridge_invalid_access_tier",
      "critical",
      { phase: "8.2F-6", notes: ["Unrecognized accessTier; defaulted to free_preview."] },
    ),

    // ── OCR uncertainty ───────────────────────────────────────────────────────
    makeDiagnosticEnvelope(
      "ocr_uncertainty",
      "ocr_low_confidence",
      "warning",
      { phase: "8.2F-14/15E", notes: ["OCR confidence below threshold; uncertainty escalated."] },
    ),
    makeDiagnosticEnvelope(
      "ocr_uncertainty",
      "pilot_ocr_confidence_unattested",
      "informational",
      { phase: "8.2F-15E", notes: ["Raw OCR confidence used without provenance attestation."] },
    ),

    // ── Pilot gate ────────────────────────────────────────────────────────────
    makeDiagnosticEnvelope(
      "pilot_gate",
      "pilot_session_limit_exceeded",
      "blocking",
      { phase: "8.2F-14", notes: ["Session transaction count exceeds pilot gate limit."] },
    ),
    makeDiagnosticEnvelope(
      "pilot_gate",
      "pilot_session_telemetry_unattested",
      "informational",
      { phase: "8.2F-15F", notes: ["Pilot session telemetry lacks provenance attestation."] },
    ),
    makeDiagnosticEnvelope(
      "pilot_gate",
      "pilot_session_report_invalid",
      "blocking",
      { phase: "8.2F-15F", notes: ["PilotSessionReport failed structural validation; gate blocked."] },
    ),

    // ── Incident governance ───────────────────────────────────────────────────
    makeDiagnosticEnvelope(
      "incident_governance",
      "incident_escalation_threshold_exceeded",
      "critical",
      { phase: "8.2F-14", notes: ["Incident severity requires escalation."] },
    ),
    makeDiagnosticEnvelope(
      "incident_governance",
      "incident_ocr_confidence_critical",
      "critical",
      { phase: "8.2F-14", notes: ["OCR confidence at critical level in incident context."] },
    ),

    // ── Provenance audit ──────────────────────────────────────────────────────
    makeDiagnosticEnvelope(
      "provenance_audit",
      "trace_missing_root",
      "blocking",
      { phase: "8.2F-14", notes: ["rootTraceId does not match any node in the chain."] },
    ),
    makeDiagnosticEnvelope(
      "provenance_audit",
      "trace_duplicate_id",
      "blocking",
      { phase: "8.2F-14", notes: ["Two or more nodes share the same traceId."] },
    ),
    makeDiagnosticEnvelope(
      "provenance_audit",
      "trace_orphan_node",
      "blocking",
      { phase: "8.2F-14", notes: ["One or more nodes unreachable from the root."] },
    ),
    makeDiagnosticEnvelope(
      "provenance_audit",
      "trace_cycle_detected",
      "blocking",
      { phase: "8.2F-14", notes: ["Parent reference graph contains a cycle."] },
    ),
    makeDiagnosticEnvelope(
      "provenance_audit",
      "trace_invalid_parent_reference",
      "blocking",
      { phase: "8.2F-14", notes: ["A parentTraceId references a traceId not in the chain."] },
    ),
    makeDiagnosticEnvelope(
      "provenance_audit",
      "trace_unknown_source",
      "informational",
      { phase: "8.2F-14", notes: ["Soft warning: one or more nodes have sourceKind 'unknown'."] },
    ),

    // ── Wording evaluation ────────────────────────────────────────────────────
    makeDiagnosticEnvelope(
      "wording_evaluation",
      "wording_score_clamped",
      "informational",
      { phase: "8.2F-15G", notes: ["Tone matrix score is finite but outside [0,1] range; clamped."] },
    ),
  ] as const;
