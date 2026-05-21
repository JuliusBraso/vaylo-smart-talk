/**
 * Free Preview Mapper scaffold (Phase 8.2F-3).
 *
 * Specialises the generic Runtime Explanation Mapper for strictly bounded
 * free-preview cognition only. Structurally enforces that no paid-tier data,
 * deadline detail, enforcement claims, or action instructions are present.
 *
 * Safety guarantees:
 * - accessTier === "free_preview" enforced structurally; invalid tier returns
 *   a diagnostic-only draft with no sections (no throw)
 * - only document_overview, payment_preview_limited, uncertainty_and_limits,
 *   and conditionally review_recommendation are produced
 * - all FreePreviewFields references are safe boolean/category signals only
 * - no PaidExplanationFields accessed
 * - no user-visible prose generated
 * - no LLM calls
 * - no OCR access
 * - no Smart Talk wiring
 * - no deadline calculation
 * - no legal conclusions inferred
 */

import type { ExplanationBoundary } from "../reality-simulation-types";
import type {
  ForbiddenExplanationMove,
  FreePreviewFields,
  RequiredExplanationConstraint,
} from "./explanation-contract-types";
import type {
  ExplanationMapperDiagnostic,
  ExplanationReviewPosture,
  ExplanationUncertaintyPosture,
  FreePreviewMapperDiagnosticCode,
  RuntimeExplanationDraft,
  RuntimeExplanationMapperInput,
  RuntimeExplanationSectionDraft,
  RuntimeExplanationSectionType,
} from "./explanation-mapper-types";

export const FREE_PREVIEW_MAPPER_VERSION =
  "8.2f-3-free-preview-mapper-v1";

// ── Structural constants ──────────────────────────────────────────────────────

/** Sections always produced in a valid free preview draft (conditional section excluded). */
const FREE_PREVIEW_BASE_SECTIONS: readonly RuntimeExplanationSectionType[] = [
  "document_overview",
  "payment_preview_limited",
  "uncertainty_and_limits",
];

/** Sections that are structurally blocked in free preview. */
const FREE_PREVIEW_BLOCKED_SECTIONS: readonly RuntimeExplanationSectionType[] = [
  "what_this_means",
  "attention_points",
  "next_steps_safe",
  "paid_deep_explanation",
];

// ── Allowed contract fields per free-preview section ────────────────────────
// Explicit table. Do not infer from field names.
// All references are keyof FreePreviewFields only — no paid data accessed.

function getFreePreviewAllowedFields(
  sectionType: RuntimeExplanationSectionType,
): readonly (keyof FreePreviewFields)[] {
  switch (sectionType) {
    case "document_overview":
      return ["documentTypeCandidate", "documentTypeLabel", "senderCategory", "confidencePosture"];
    case "payment_preview_limited":
      return ["hasFinancialSignal", "hasDeadlineSignal", "attentionLevelPreview", "confidencePosture"];
    case "uncertainty_and_limits":
      return ["confidencePosture", "attentionLevelPreview"];
    case "review_recommendation":
      return ["humanReviewSuggested"];
    default:
      return [];
  }
}

// ── Forbidden-move suppression rules for free preview ─────────────────────────
// Each rule records: which forbidden move, which diagnostic code to emit, and
// which free-preview sections (if any) receive a blockedReasonCode entry.

interface FreePreviewForbiddenMoveEffect {
  readonly move: ForbiddenExplanationMove;
  readonly diagnosticCode: FreePreviewMapperDiagnosticCode;
  /** Free-preview sections that get a blockedReasonCode when this move is active. */
  readonly restrictedFreeSections: readonly RuntimeExplanationSectionType[];
}

const FREE_PREVIEW_FORBIDDEN_MOVE_EFFECTS: readonly FreePreviewForbiddenMoveEffect[] = [
  {
    move: "no_deadline_calculation_when_forbidden",
    diagnosticCode: "free_preview_deadline_detail_blocked",
    // payment_preview_limited shows hasDeadlineSignal; deadline detail is suppressed.
    restrictedFreeSections: ["payment_preview_limited"],
  },
  {
    move: "no_enforcement_claim_when_forbidden",
    diagnosticCode: "free_preview_enforcement_claim_blocked",
    restrictedFreeSections: [],
  },
  {
    move: "no_autonomous_form_submission",
    diagnosticCode: "free_preview_action_instruction_blocked",
    restrictedFreeSections: [],
  },
  {
    move: "no_definitive_legal_verdicts",
    diagnosticCode: "free_preview_paid_field_blocked",
    restrictedFreeSections: [],
  },
  {
    move: "no_guaranteed_outcomes",
    diagnosticCode: "free_preview_paid_field_blocked",
    restrictedFreeSections: [],
  },
  {
    move: "no_dry_run_as_fact",
    diagnosticCode: "free_preview_paid_field_blocked",
    restrictedFreeSections: [],
  },
  {
    move: "no_speculation_as_fact",
    diagnosticCode: "free_preview_paid_field_blocked",
    restrictedFreeSections: [],
  },
  {
    move: "no_cross_lane_merging",
    diagnosticCode: "free_preview_paid_field_blocked",
    restrictedFreeSections: [],
  },
  {
    move: "no_tax_certainty",
    diagnosticCode: "free_preview_paid_field_blocked",
    restrictedFreeSections: [],
  },
  {
    move: "no_immigration_certainty",
    diagnosticCode: "free_preview_paid_field_blocked",
    restrictedFreeSections: [],
  },
  {
    move: "no_high_panic_phrasing",
    diagnosticCode: "free_preview_paid_field_blocked",
    restrictedFreeSections: [],
  },
];

// ── Posture helpers ───────────────────────────────────────────────────────────

function deriveFreePreviewUncertaintyPosture(
  forbiddenMoves: readonly ForbiddenExplanationMove[],
  requiredConstraints: readonly RequiredExplanationConstraint[],
  hasHighConsequenceFlag: boolean,
  hasUncertaintyReasons: boolean,
): ExplanationUncertaintyPosture {
  if (hasHighConsequenceFlag) return "high_consequence_uncertainty";
  const needsPreservation =
    requiredConstraints.includes("required_uncertainty_wording") ||
    requiredConstraints.includes("must_preserve_uncertainty") ||
    forbiddenMoves.includes("no_dry_run_as_fact") ||
    forbiddenMoves.includes("no_speculation_as_fact");
  if (needsPreservation) return "uncertainty_preserved";
  if (hasUncertaintyReasons) return "limited";
  return "unknown";
}

function deriveFreePreviewReviewPosture(
  hasHumanReviewFlag: boolean,
  hasProfessionalFlag: boolean,
  hasAnyReviewFlag: boolean,
  contractSuggestsReview: boolean,
): ExplanationReviewPosture {
  if (hasProfessionalFlag) return "professional_review_recommended";
  if (hasHumanReviewFlag || contractSuggestsReview) return "human_review_recommended";
  if (hasAnyReviewFlag) return "review_suggested";
  return "none";
}

// ── Invalid tier response ─────────────────────────────────────────────────────

function buildInvalidTierDraft(
  input: RuntimeExplanationMapperInput,
): RuntimeExplanationDraft {
  const diagnostic: ExplanationMapperDiagnostic = {
    code: "invalid_access_tier_for_free_preview_mapper" satisfies FreePreviewMapperDiagnosticCode,
    detail: `Free preview mapper requires accessTier "free_preview"; received "${input.accessTier}". No draft sections produced.`,
    neverUserVisible: true,
  };
  return {
    draftVersion: "8.2f-2-runtime-explanation-draft-v1",
    accessTier: input.accessTier,
    sectionDrafts: [],
    appliedBoundaries: [],
    appliedForbiddenMoves: input.explanationContract.forbiddenExplanationMoves,
    appliedRequiredConstraints: input.explanationContract.requiredExplanationConstraints,
    uncertaintyPosture: "unknown",
    reviewPosture: "none",
    auditRefs: [],
    neverUserVisibleDiagnostics: [diagnostic],
  };
}

// ── Main function ─────────────────────────────────────────────────────────────

/**
 * Projects a teaser-safe free-preview draft from a RuntimeExplanationMapperInput.
 *
 * Enforces accessTier === "free_preview" structurally. If the input tier is not
 * free_preview, returns a diagnostic-only draft with no sections (does not throw).
 *
 * Output is structural draft metadata only. No prose is generated. No paid fields
 * are accessed or referenced. All governance constraints are preserved.
 */
export function runFreePreviewMapper(
  input: RuntimeExplanationMapperInput,
): RuntimeExplanationDraft {
  // -- Tier enforcement --
  if (input.accessTier !== "free_preview") {
    return buildInvalidTierDraft(input);
  }

  const { simulationResult, explanationContract } = input;
  const forbiddenMoves = explanationContract.forbiddenExplanationMoves;
  const requiredConstraints = explanationContract.requiredExplanationConstraints;

  // -- Applied boundaries from simulation result (no paid data) --
  const appliedBoundaries: readonly ExplanationBoundary[] =
    simulationResult.explanationBoundaries ?? [];

  // -- Review flag analysis (flagId only, never prose) --
  const reviewFlags = simulationResult.reviewFlags ?? [];
  const hasHighConsequenceFlag = reviewFlags.some(
    (f) => f.flagId === "high_consequence_domain",
  );
  const hasHumanReviewFlag = reviewFlags.some(
    (f) => f.flagId === "human_review_recommended",
  );
  const hasProfessionalFlag = reviewFlags.some(
    (f) => f.flagId === "professional_advice_recommended",
  );
  const hasAnyReviewFlag = reviewFlags.length > 0;
  const contractSuggestsReview =
    explanationContract.freePreviewFields.humanReviewSuggested;

  // -- Posture derivation --
  const hasUncertaintyReasons =
    (simulationResult.uncertaintyReasons?.length ?? 0) > 0;

  const uncertaintyPosture = deriveFreePreviewUncertaintyPosture(
    forbiddenMoves,
    requiredConstraints,
    hasHighConsequenceFlag,
    hasUncertaintyReasons,
  );

  const reviewPosture = deriveFreePreviewReviewPosture(
    hasHumanReviewFlag,
    hasProfessionalFlag,
    hasAnyReviewFlag,
    contractSuggestsReview,
  );

  const uncertaintyPreserved =
    uncertaintyPosture === "uncertainty_preserved" ||
    uncertaintyPosture === "high_consequence_uncertainty";

  // -- Pre-compute forbidden-move section-level restrictions --
  const sectionBlockedReasonCodes = new Map<RuntimeExplanationSectionType, string[]>();
  const diagnostics: ExplanationMapperDiagnostic[] = [];

  for (const effect of FREE_PREVIEW_FORBIDDEN_MOVE_EFFECTS) {
    if (!forbiddenMoves.includes(effect.move)) continue;

    diagnostics.push({
      code: effect.diagnosticCode,
      detail: `Forbidden move "${effect.move}" structurally suppressed in free preview.`,
      neverUserVisible: true,
    });

    for (const section of effect.restrictedFreeSections) {
      const existing = sectionBlockedReasonCodes.get(section) ?? [];
      existing.push(`forbidden_move:${effect.move}`);
      sectionBlockedReasonCodes.set(section, existing);
    }
  }

  // -- Always emit paid-field structural block diagnostic --
  // Explicitly records that paid data is structurally unavailable in this layer,
  // regardless of forbidden moves.
  diagnostics.push({
    code: "free_preview_paid_field_blocked" satisfies FreePreviewMapperDiagnosticCode,
    detail: `Paid explanation fields are structurally blocked in the free preview mapper. Sections: ${FREE_PREVIEW_BLOCKED_SECTIONS.join(", ")}.`,
    neverUserVisible: true,
  });

  // -- Build section candidates --
  const candidateSections: RuntimeExplanationSectionType[] = [
    ...FREE_PREVIEW_BASE_SECTIONS,
    ...(reviewPosture !== "none"
      ? (["review_recommendation"] as RuntimeExplanationSectionType[])
      : []),
  ];

  // -- Assemble section drafts --
  const sectionDrafts: RuntimeExplanationSectionDraft[] = [];

  for (const sectionType of candidateSections) {
    const blockedReasonCodes = sectionBlockedReasonCodes.get(sectionType) ?? [];

    if (blockedReasonCodes.length > 0) {
      diagnostics.push({
        code: "free_preview_deadline_detail_blocked" satisfies FreePreviewMapperDiagnosticCode,
        detail: `Section "${sectionType}" content restricted in free preview: ${blockedReasonCodes.join(", ")}.`,
        neverUserVisible: true,
      });
    }

    sectionDrafts.push({
      sectionType,
      accessTier: "free_preview",
      sourceBound: true,
      uncertaintyPreserved,
      allowedContractFields: getFreePreviewAllowedFields(sectionType),
      blockedReasonCodes: blockedReasonCodes.length > 0 ? blockedReasonCodes : undefined,
      neverContainsUserVisibleCopy: true,
    });
  }

  // -- Audit refs --
  const auditRefs: string[] = [];
  if (input.auditTraceRef) auditRefs.push(input.auditTraceRef);
  if (explanationContract.auditTraceRef)
    auditRefs.push(explanationContract.auditTraceRef);
  if (simulationResult.auditTraceRef)
    auditRefs.push(simulationResult.auditTraceRef);
  const seenRefs = new Set<string>();
  const dedupedAuditRefs = auditRefs.filter((r) => {
    if (seenRefs.has(r)) return false;
    seenRefs.add(r);
    return true;
  });

  return {
    draftVersion: "8.2f-2-runtime-explanation-draft-v1",
    accessTier: "free_preview",
    sectionDrafts,
    appliedBoundaries,
    appliedForbiddenMoves: forbiddenMoves,
    appliedRequiredConstraints: requiredConstraints,
    uncertaintyPosture,
    reviewPosture,
    auditRefs: dedupedAuditRefs,
    neverUserVisibleDiagnostics: diagnostics,
  };
}
