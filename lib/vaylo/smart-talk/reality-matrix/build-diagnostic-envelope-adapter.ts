/**
 * Diagnostic Envelope Adapter functions (Phase 8.2F-15O).
 *
 * Exports two pure adapter functions:
 *
 * `buildDiagnosticEnvelopeFromNativeDiagnostic`   — converts a single
 *     `DiagnosticEnvelopeAdapterInput` into a `DiagnosticNormalizedEnvelope`.
 *
 * `buildDiagnosticEnvelopesFromNativeDiagnostics` — batch variant; processes
 *     a readonly array of inputs and aggregates results.
 *
 * Source kind → DiagnosticNamespaceLayer mapping (explicit, no string inference):
 *
 *  DiagnosticEnvelopeSourceKind            DiagnosticNamespaceLayer
 *  ─────────────────────────               ─────────────────────────
 *  native_mapper_free_preview    →          mapper_free_preview
 *  native_mapper_paid_explanation→          mapper_paid_explanation
 *  native_bridge                 →          bridge
 *  native_wording_review         →          wording_review
 *  native_wording_evaluation     →          wording_evaluation
 *  native_ocr_uncertainty        →          ocr_uncertainty
 *  native_pilot_gate             →          pilot_gate
 *  native_incident_governance    →          incident_governance
 *  native_provenance_audit       →          provenance_audit
 *  native_corpus_validation      →          corpus_validation
 *  native_contract_validation    →          contract_validation
 *  native_governance_lineage_audit→         governance_lineage_audit
 *  unknown                       →          unknown
 *
 * Adapter diagnostic codes emitted:
 *  diagnostic_adapter_unknown_source       — sourceKind is "unknown"
 *  diagnostic_adapter_empty_code           — code is blank (hard failure)
 *  diagnostic_adapter_user_visible_violation— neverUserVisible !== true (hard failure)
 *  diagnostic_adapter_default_severity_used— severity not provided; defaulted to informational
 *  diagnostic_adapter_layer_mapping_fallback— sourceKind not in explicit table (exhaustiveness guard)
 *
 * Safety guarantees:
 * - no runtime coupling to any source emission site
 * - no diagnostic codes renamed or removed
 * - no source modules modified
 * - no persistence (no DB writes, no log writes, no file writes)
 * - no telemetry SDK imported
 * - no runtime execution hooks
 * - no Smart Talk production connection
 * - no OCR SDK or LLM calls
 * - no user-visible output
 * - all results carry neverUserVisible: true
 */

import type {
  DiagnosticEnvelopeAdapterInput,
  DiagnosticEnvelopeAdapterDiagnostic,
  DiagnosticEnvelopeAdapterResult,
  DiagnosticEnvelopeSourceKind,
} from "./diagnostic-envelope-adapter-types";
import type {
  DiagnosticNamespaceLayer,
  DiagnosticNormalizedEnvelope,
  DiagnosticSeverity,
} from "./diagnostic-namespace-types";
import { makeDiagnosticEnvelope } from "./diagnostic-namespace-registry";

export const DIAGNOSTIC_ENVELOPE_ADAPTER_VERSION =
  "8.2f-15o-diagnostic-envelope-adapter-v1";

// ── Helper ─────────────────────────────────────────────────────────────────────

function isNonBlank(value: string | undefined | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

// ── Source kind mapping ────────────────────────────────────────────────────────

/**
 * Maps `DiagnosticEnvelopeSourceKind` to `DiagnosticNamespaceLayer`.
 *
 * Returns the fallback-detected layer and a flag indicating whether the
 * default exhaustiveness fallback was used (to emit `diagnostic_adapter_layer_mapping_fallback`).
 *
 * All 13 source kind values have explicit cases. The `default` branch only
 * fires if TypeScript's exhaustiveness invariant is somehow bypassed at runtime.
 */
function mapSourceKindToLayer(kind: DiagnosticEnvelopeSourceKind): {
  layer: DiagnosticNamespaceLayer;
  usedFallback: boolean;
} {
  switch (kind) {
    case "native_mapper_free_preview":
      return { layer: "mapper_free_preview", usedFallback: false };
    case "native_mapper_paid_explanation":
      return { layer: "mapper_paid_explanation", usedFallback: false };
    case "native_bridge":
      return { layer: "bridge", usedFallback: false };
    case "native_wording_review":
      return { layer: "wording_review", usedFallback: false };
    case "native_wording_evaluation":
      return { layer: "wording_evaluation", usedFallback: false };
    case "native_ocr_uncertainty":
      return { layer: "ocr_uncertainty", usedFallback: false };
    case "native_pilot_gate":
      return { layer: "pilot_gate", usedFallback: false };
    case "native_incident_governance":
      return { layer: "incident_governance", usedFallback: false };
    case "native_provenance_audit":
      return { layer: "provenance_audit", usedFallback: false };
    case "native_corpus_validation":
      return { layer: "corpus_validation", usedFallback: false };
    case "native_contract_validation":
      return { layer: "contract_validation", usedFallback: false };
    case "native_governance_lineage_audit":
      return { layer: "governance_lineage_audit", usedFallback: false };
    case "unknown":
      return { layer: "unknown", usedFallback: false };
    default: {
      // Exhaustiveness guard — TypeScript ensures all cases are handled.
      // If this branch runs at runtime, the sourceKind was not in the mapping table.
      const _exhaustive: never = kind;
      void _exhaustive;
      return { layer: "unknown", usedFallback: true };
    }
  }
}

// ── Single adapter ─────────────────────────────────────────────────────────────

/**
 * Converts a single `DiagnosticEnvelopeAdapterInput` into a
 * `DiagnosticNormalizedEnvelope` wrapped in a `DiagnosticEnvelopeAdapterResult`.
 *
 * Hard failures (set `adapted = false`):
 *   - blank `code` → `diagnostic_adapter_empty_code`
 *   - `neverUserVisible !== true` at runtime → `diagnostic_adapter_user_visible_violation`
 *
 * Soft diagnostics (`adapted` unaffected):
 *   - `sourceKind === "unknown"` → `diagnostic_adapter_unknown_source`
 *   - no `severity` provided → `diagnostic_adapter_default_severity_used`
 *   - exhaustiveness fallback fired → `diagnostic_adapter_layer_mapping_fallback`
 *
 * The result always contains an `envelope` — even on hard failure, a best-effort
 * envelope is returned with `neverUserVisible: true` forced and `visibility:
 * "never_user_visible"` hardcoded. Callers should inspect `adapted` before
 * trusting the envelope semantically.
 *
 * Pure function — no side effects, no persistence, no logging, no telemetry,
 * no runtime hooks, no source module modification.
 */
export function buildDiagnosticEnvelopeFromNativeDiagnostic(
  input: DiagnosticEnvelopeAdapterInput,
): DiagnosticEnvelopeAdapterResult {
  const adapterDiagnostics: DiagnosticEnvelopeAdapterDiagnostic[] = [];
  let hardFailure = false;

  // ── Rule 1 — neverUserVisible must be true at runtime (hard failure) ───────

  if ((input.neverUserVisible as unknown) !== true) {
    adapterDiagnostics.push("diagnostic_adapter_user_visible_violation");
    hardFailure = true;
  }

  // ── Rule 2 — code must be non-blank (hard failure) ─────────────────────────

  if (!isNonBlank(input.code)) {
    adapterDiagnostics.push("diagnostic_adapter_empty_code");
    hardFailure = true;
  }

  // ── Rule 3 — source kind mapping ───────────────────────────────────────────

  const { layer, usedFallback } = mapSourceKindToLayer(input.sourceKind);

  if (usedFallback) {
    adapterDiagnostics.push("diagnostic_adapter_layer_mapping_fallback");
  }

  if (input.sourceKind === "unknown") {
    adapterDiagnostics.push("diagnostic_adapter_unknown_source");
  }

  // ── Rule 4 — severity default ──────────────────────────────────────────────

  let severity: DiagnosticSeverity;
  if (input.severity !== undefined) {
    severity = input.severity;
  } else {
    severity = "informational";
    adapterDiagnostics.push("diagnostic_adapter_default_severity_used");
  }

  // ── Build envelope ─────────────────────────────────────────────────────────

  // Use best-effort code even on failure (blank → use placeholder for structural validity).
  const envelopeCode = isNonBlank(input.code) ? input.code : "__adapter_empty_code__";

  // Envelope notes: combine adapter provenance with caller notes.
  const envelopeNotes: string[] = [
    `Adapted from native diagnostic: sourceKind=${input.sourceKind} → layer=${layer}`,
    `Adapter version: ${DIAGNOSTIC_ENVELOPE_ADAPTER_VERSION}`,
  ];
  if (!isNonBlank(input.code)) {
    envelopeNotes.push("Warning: original code was blank; placeholder used.");
  }
  if (input.sourceKind === "unknown") {
    envelopeNotes.push(
      "Note: sourceKind was unknown; layer defaulted to unknown conservatively.",
    );
  }
  if (usedFallback) {
    envelopeNotes.push(
      "Note: sourceKind was not in the explicit mapping table; exhaustiveness fallback fired.",
    );
  }
  for (const note of input.notes ?? []) {
    envelopeNotes.push(note);
  }

  const envelope = makeDiagnosticEnvelope(layer, envelopeCode, severity, {
    visibility: "never_user_visible",
    phase: input.phase,
    sourceVersion: input.sourceVersion,
    notes: envelopeNotes,
  });

  return {
    envelope,
    adapted: !hardFailure,
    diagnostics: adapterDiagnostics,
    neverUserVisible: true,
  };
}

// ── Batch adapter ──────────────────────────────────────────────────────────────

/**
 * Converts a readonly array of `DiagnosticEnvelopeAdapterInput` instances into
 * a collection of `DiagnosticNormalizedEnvelope` objects.
 *
 * `envelopes`  — all produced envelopes (one per input, always present).
 * `results`    — all individual `DiagnosticEnvelopeAdapterResult` records.
 * `allAdapted` — `true` only if every individual result has `adapted = true`.
 * `neverUserVisible` — compile-time invariant.
 *
 * Pure function — no side effects, no persistence, no logging, no telemetry.
 */
export function buildDiagnosticEnvelopesFromNativeDiagnostics(
  inputs: readonly DiagnosticEnvelopeAdapterInput[],
): {
  readonly envelopes: readonly DiagnosticNormalizedEnvelope[];
  readonly results: readonly DiagnosticEnvelopeAdapterResult[];
  readonly allAdapted: boolean;
  readonly neverUserVisible: true;
} {
  const results = inputs.map((input) =>
    buildDiagnosticEnvelopeFromNativeDiagnostic(input),
  );

  const envelopes = results.map((r) => r.envelope);
  const allAdapted = results.every((r) => r.adapted);

  return {
    envelopes,
    results,
    allAdapted,
    neverUserVisible: true,
  };
}
