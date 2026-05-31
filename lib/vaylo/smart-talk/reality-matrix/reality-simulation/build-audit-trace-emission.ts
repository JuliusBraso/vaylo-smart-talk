/**
 * Audit Trace Emission Validator and AuditTraceNode Adapter (Phase 8.2F-15N).
 *
 * Exports two pure functions:
 *
 * `validateAuditTraceEmission`    — structural validator for `AuditTraceEmissionRecord`.
 * `buildAuditTraceNodeFromEmission` — converts an emission record into an
 *                                     `AuditTraceNode` for use in `AuditTraceChain`.
 *
 * Layer → ProvenanceSourceKind mapping (explicit, no string inference):
 *
 *  AuditTraceEmissionLayer     ProvenanceSourceKind
 *  ───────────────────────     ────────────────────
 *  OCR                    →    "OCR"
 *  reality_matrix         →    "reality_matrix"
 *  evidence_gate          →    "evidence_gate"
 *  simulation             →    "simulation"
 *  explanation_contract   →    "explanation_contract"
 *  mapper                 →    "mapper"
 *  bridge                 →    "mapper"           (no dedicated bridge ProvenanceSourceKind;
 *                                                  conservative mapping — documented)
 *  wording_review         →    "wording_review"
 *  wording_evaluation     →    "wording_evaluation"
 *  pilot_gate             →    "pilot_gate"
 *  incident_governance    →    "incident_governance"
 *  manual_review          →    "manual_review"
 *  diagnostic_namespace   →    "unknown"          (no dedicated ProvenanceSourceKind;
 *                                                  conservative mapping — documented)
 *  unknown                →    "unknown"
 *
 * EmissionKind → AuditDecisionKind mapping (explicit, no string inference):
 *
 *  AuditTraceEmissionKind              AuditDecisionKind
 *  ──────────────────────              ─────────────────
 *  boundary_emitted               →    "boundary_applied"
 *  forbidden_move_applied         →    "forbidden_move_applied"
 *  required_constraint_applied    →    "required_constraint_applied"
 *  uncertainty_escalated          →    "uncertainty_escalation"
 *  human_review_requested         →    "human_review_required"
 *  section_suppressed             →    "informational"
 *  bridge_blocking_reason_observed→    "informational"
 *  pilot_gate_blocked             →    "pilot_block"
 *  incident_escalated             →    "incident_escalation"
 *  diagnostic_enveloped           →    "informational"
 *  attestation_validated          →    "informational"
 *  informational                  →    "informational"
 *
 * Safety guarantees:
 * - no runtime emission wired
 * - no persistence (no DB writes, no log writes, no file writes)
 * - no telemetry SDK imported
 * - no runtime execution hooks
 * - no Smart Talk production connection
 * - no OCR SDK or LLM calls
 * - no user-visible output
 * - all results carry neverUserVisible: true
 */

import type {
  AuditTraceEmissionRecord,
  AuditTraceEmissionValidationDiagnostic,
  AuditTraceEmissionValidationResult,
  AuditTraceEmissionLayer,
  AuditTraceEmissionKind,
} from "./audit-trace-emission-types";
import type {
  AuditTraceNode,
  ProvenanceSourceKind,
  AuditDecisionKind,
} from "./provenance-audit-types";

export const AUDIT_TRACE_EMISSION_BUILDER_VERSION =
  "8.2f-15n-audit-trace-emission-builder-v1";

// ── Helpers ───────────────────────────────────────────────────────────────────

function isNonBlank(value: string | undefined | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasAnyReference(emission: AuditTraceEmissionRecord): boolean {
  return (
    isNonBlank(emission.referencedArtifactId) ||
    isNonBlank(emission.referencedDiagnosticCode) ||
    isNonBlank(emission.referencedBoundaryId) ||
    isNonBlank(emission.referencedForbiddenMove) ||
    isNonBlank(emission.referencedRequiredConstraint)
  );
}

// ── Layer mapping ──────────────────────────────────────────────────────────────

/**
 * Maps `AuditTraceEmissionLayer` to `ProvenanceSourceKind`.
 *
 * Conservative: `bridge` maps to `"mapper"` (closest structural equivalent;
 * no dedicated bridge ProvenanceSourceKind exists). `diagnostic_namespace`
 * maps to `"unknown"` (no equivalent in ProvenanceSourceKind).
 */
function mapLayerToProvenanceSourceKind(
  layer: AuditTraceEmissionLayer,
): ProvenanceSourceKind {
  switch (layer) {
    case "OCR":
      return "OCR";
    case "reality_matrix":
      return "reality_matrix";
    case "evidence_gate":
      return "evidence_gate";
    case "simulation":
      return "simulation";
    case "explanation_contract":
      return "explanation_contract";
    case "mapper":
      return "mapper";
    case "bridge":
      // Conservative mapping: bridge layer has no dedicated ProvenanceSourceKind.
      // Maps to "mapper" as the closest upstream equivalent.
      return "mapper";
    case "wording_review":
      return "wording_review";
    case "wording_evaluation":
      return "wording_evaluation";
    case "pilot_gate":
      return "pilot_gate";
    case "incident_governance":
      return "incident_governance";
    case "manual_review":
      return "manual_review";
    case "diagnostic_namespace":
      // Conservative mapping: no dedicated ProvenanceSourceKind for diagnostic namespace.
      return "unknown";
    case "unknown":
      return "unknown";
    default: {
      // Exhaustiveness guard — TypeScript ensures all cases are handled.
      const _exhaustive: never = layer;
      void _exhaustive;
      return "unknown";
    }
  }
}

// ── Emission kind mapping ──────────────────────────────────────────────────────

/**
 * Maps `AuditTraceEmissionKind` to `AuditDecisionKind`.
 *
 * Conservative: emission kinds with no direct AuditDecisionKind equivalent
 * (`section_suppressed`, `bridge_blocking_reason_observed`, `diagnostic_enveloped`,
 * `attestation_validated`) map to `"informational"`.
 */
function mapEmissionKindToDecisionKind(
  kind: AuditTraceEmissionKind,
): AuditDecisionKind {
  switch (kind) {
    case "boundary_emitted":
      return "boundary_applied";
    case "forbidden_move_applied":
      return "forbidden_move_applied";
    case "required_constraint_applied":
      return "required_constraint_applied";
    case "uncertainty_escalated":
      return "uncertainty_escalation";
    case "human_review_requested":
      return "human_review_required";
    case "section_suppressed":
      // No direct AuditDecisionKind equivalent; maps to informational.
      return "informational";
    case "bridge_blocking_reason_observed":
      // No direct AuditDecisionKind equivalent; maps to informational.
      return "informational";
    case "pilot_gate_blocked":
      return "pilot_block";
    case "incident_escalated":
      return "incident_escalation";
    case "diagnostic_enveloped":
      // No direct AuditDecisionKind equivalent; maps to informational.
      return "informational";
    case "attestation_validated":
      // No direct AuditDecisionKind equivalent; maps to informational.
      return "informational";
    case "informational":
      return "informational";
    default: {
      const _exhaustive: never = kind;
      void _exhaustive;
      return "informational";
    }
  }
}

// ── Validator ─────────────────────────────────────────────────────────────────

/**
 * Validates an `AuditTraceEmissionRecord` and returns a never-user-visible
 * `AuditTraceEmissionValidationResult` with `valid`, `fullyConsistent`,
 * and accumulated `diagnostics`.
 *
 * Hard failures (set `valid = false`):
 *   Rule 1 — blank `emissionId`
 *   Rule 3 — blank/whitespace entry in `parentTraceIds`
 *   Rule 5 — `neverUserVisible !== true` at runtime
 *
 * Soft diagnostics (don't affect `valid`; set `fullyConsistent = false`):
 *   Rule 2 — `layer === "unknown"`
 *   Rule 4 — duplicate entries in `parentTraceIds`
 *   Rule 6 — blocking/critical severity with no reference field populated
 *
 * Pure function — no side effects, no persistence, no logging, no telemetry,
 * no runtime hooks, no Smart Talk connection.
 */
export function validateAuditTraceEmission(
  emission: AuditTraceEmissionRecord,
): AuditTraceEmissionValidationResult {
  const diagnostics: AuditTraceEmissionValidationDiagnostic[] = [];
  let hardFailure = false;
  let softDiagnostic = false;

  // ── Rule 1 — emissionId must be non-blank (hard failure) ─────────────────

  if (!isNonBlank(emission.emissionId)) {
    diagnostics.push("audit_emission_missing_id");
    hardFailure = true;
  }

  // ── Rule 2 — layer "unknown" (soft) ──────────────────────────────────────

  if (emission.layer === "unknown") {
    diagnostics.push("audit_emission_unknown_layer");
    softDiagnostic = true;
  }

  // ── Rule 3 — parentTraceIds must not contain blank entries (hard failure) ─

  for (const pid of emission.parentTraceIds) {
    if (!isNonBlank(pid)) {
      if (!diagnostics.includes("audit_emission_empty_parent_id")) {
        diagnostics.push("audit_emission_empty_parent_id");
      }
      hardFailure = true;
      break;
    }
  }

  // ── Rule 4 — no duplicate parentTraceIds (soft) ───────────────────────────

  const seen = new Set<string>();
  let hasDuplicate = false;
  for (const pid of emission.parentTraceIds) {
    if (seen.has(pid)) {
      hasDuplicate = true;
      break;
    }
    seen.add(pid);
  }
  if (hasDuplicate) {
    diagnostics.push("audit_emission_duplicate_parent_id");
    softDiagnostic = true;
  }

  // ── Rule 5 — neverUserVisible must be true at runtime (hard failure) ──────

  // Defensive runtime check: the TypeScript type enforces literal true,
  // but a cast (as unknown as true) could bypass this at runtime.
  if ((emission.neverUserVisible as unknown) !== true) {
    diagnostics.push("audit_emission_user_visible_violation");
    hardFailure = true;
  }

  // ── Rule 6 — blocking/critical severity must have at least one reference ──

  if (
    (emission.severity === "blocking" || emission.severity === "critical") &&
    !hasAnyReference(emission)
  ) {
    diagnostics.push("audit_emission_missing_reference_for_blocking");
    softDiagnostic = true;
  }

  // ── Rules 7–8 — compute trust flags ──────────────────────────────────────

  const valid = !hardFailure;
  const fullyConsistent = valid && !softDiagnostic;

  // ── Notes ─────────────────────────────────────────────────────────────────

  const notes: string[] = [];
  if (fullyConsistent) {
    notes.push("Emission record is valid and fully consistent.");
  } else if (valid) {
    notes.push(
      "Emission record is structurally valid but not fully consistent " +
        "(soft diagnostics present: unknown layer, duplicate parents, or " +
        "missing reference for blocking/critical severity).",
    );
  } else {
    notes.push(
      "Emission record is invalid — hard structural violation(s) detected.",
    );
  }
  notes.push(
    "Validator is metadata-only: no persistence, no logging, no telemetry, " +
      "no runtime hooks, no Smart Talk wiring.",
  );

  return {
    valid,
    fullyConsistent,
    diagnostics,
    neverUserVisible: true,
    notes,
  };
}

// ── AuditTraceNode adapter ────────────────────────────────────────────────────

/**
 * Converts an `AuditTraceEmissionRecord` into an `AuditTraceNode` suitable
 * for inclusion in an `AuditTraceChain`.
 *
 * Mapping is explicit and conservative — no string inference. See file header
 * for the full layer → ProvenanceSourceKind and emissionKind → AuditDecisionKind
 * mapping tables.
 *
 * The caller is responsible for validating the emission record before conversion.
 * This function does not re-validate; it always produces a node.
 *
 * Pure function — no side effects, no persistence, no logging, no telemetry.
 */
export function buildAuditTraceNodeFromEmission(
  emission: AuditTraceEmissionRecord,
): AuditTraceNode {
  const sourceKind = mapLayerToProvenanceSourceKind(emission.layer);
  const decisionKind = mapEmissionKindToDecisionKind(emission.emissionKind);

  // Build structured notes from emission reference fields and original notes.
  const builtNotes: string[] = [
    `Converted from emission record: emissionId=${emission.emissionId}`,
    `Layer: ${emission.layer} → sourceKind: ${sourceKind}`,
    `EmissionKind: ${emission.emissionKind} → decisionKind: ${decisionKind}`,
    `Severity: ${emission.severity}`,
  ];

  if (isNonBlank(emission.referencedArtifactId)) {
    builtNotes.push(`Referenced artifact: ${emission.referencedArtifactId}`);
  }
  if (isNonBlank(emission.referencedDiagnosticCode)) {
    builtNotes.push(
      `Referenced diagnostic: ${emission.referencedDiagnosticCode}`,
    );
  }
  if (isNonBlank(emission.referencedBoundaryId)) {
    builtNotes.push(`Referenced boundary: ${emission.referencedBoundaryId}`);
  }
  if (isNonBlank(emission.referencedForbiddenMove)) {
    builtNotes.push(
      `Referenced forbidden move: ${emission.referencedForbiddenMove}`,
    );
  }
  if (isNonBlank(emission.referencedRequiredConstraint)) {
    builtNotes.push(
      `Referenced required constraint: ${emission.referencedRequiredConstraint}`,
    );
  }

  // Append original emission notes.
  for (const note of emission.notes ?? []) {
    builtNotes.push(note);
  }

  // Conservative note for layer mappings that lose fidelity.
  if (emission.layer === "bridge") {
    builtNotes.push(
      "Note: bridge layer mapped to mapper sourceKind (no dedicated ProvenanceSourceKind " +
        "for bridge exists; conservative mapping applied).",
    );
  }
  if (emission.layer === "diagnostic_namespace") {
    builtNotes.push(
      "Note: diagnostic_namespace layer mapped to unknown sourceKind (no dedicated " +
        "ProvenanceSourceKind for diagnostic_namespace exists; conservative mapping applied).",
    );
  }

  return {
    traceId: emission.emissionId,
    sourceKind,
    decisionKind,
    parentTraceIds: emission.parentTraceIds,
    neverUserVisible: true,
    notes: builtNotes,
  };
}
