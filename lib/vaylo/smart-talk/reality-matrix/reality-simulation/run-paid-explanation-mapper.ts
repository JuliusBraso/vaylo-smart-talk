/**
 * Paid Explanation Mapper scaffold (Phase 8.2F-4 / 8.2F-15C diagnostic hardening /
 * 8.2F-15D next_steps_safe dead restriction-state cleanup).
 *
 * Specialises the generic Runtime Explanation Mapper for paid-tier cognition.
 * Allows deeper structured section drafts while preserving all Constitution
 * governance boundaries, forbidden moves, and required constraints.
 *
 * Safety guarantees:
 * - accessTier === "paid_explanation" enforced structurally; invalid tier returns
 *   a diagnostic-only draft with no sections (no throw)
 * - deeper sections (what_this_means, attention_points, next_steps_safe,
 *   paid_deep_explanation) are produced only within governance bounds
 * - payment_preview_limited is structurally absent (free-only section)
 * - PaidExplanationFields keys are used as structural tags only, no extraction
 * - no raw document text, OCR spans, LLM responses, or personal data accessed
 * - no prose generated
 * - no deadline calculated
 * - no legal conclusions inferred
 * - no LLM calls
 * - no OCR access
 * - no Smart Talk wiring
 */

import type { ExplanationBoundary } from "../reality-simulation-types";
import type {
  ForbiddenExplanationMove,
  FreePreviewFields,
  PaidExplanationFields,
  RequiredExplanationConstraint,
} from "./explanation-contract-types";
import type {
  ExplanationMapperDiagnostic,
  ExplanationReviewPosture,
  ExplanationUncertaintyPosture,
  PaidExplanationMapperDiagnosticCode,
  RuntimeExplanationDraft,
  RuntimeExplanationMapperInput,
  RuntimeExplanationSectionDraft,
  RuntimeExplanationSectionType,
} from "./explanation-mapper-types";

export const PAID_EXPLANATION_MAPPER_VERSION =
  "8.2f-15d-paid-explanation-mapper-v3";

// ── Structural constants ──────────────────────────────────────────────────────

/** Sections the paid mapper considers for inclusion (conditional sections excluded). */
const PAID_BASE_SECTIONS: readonly RuntimeExplanationSectionType[] = [
  "document_overview",
  "what_this_means",
  "attention_points",
  "next_steps_safe",
  "uncertainty_and_limits",
  "paid_deep_explanation",
];

/** Sections that are structurally blocked in paid tier (free-tier only). */
const PAID_BLOCKED_SECTIONS: readonly RuntimeExplanationSectionType[] = [
  "payment_preview_limited",
];

// ── Allowed contract fields per paid section ──────────────────────────────────
// PaidExplanationFields keys are structural reference tags only.
// No extraction occurs. No raw document text, OCR spans, or LLM responses.

type ContractFieldRef = keyof FreePreviewFields | keyof PaidExplanationFields;

function getPaidAllowedFields(
  sectionType: RuntimeExplanationSectionType,
): readonly ContractFieldRef[] {
  switch (sectionType) {
    case "document_overview":
      return [
        "documentTypeCandidate",
        "documentTypeLabel",
        "senderCategory",
        "confidencePosture",
        "institutionSignals",
      ];
    case "what_this_means":
      return [
        "institutionSignals",
        "authorizedClaimCandidates",
        "supportedRealityCandidates",
        "uncertaintyReasons",
      ];
    case "attention_points":
      return ["authorizedClaimCandidates", "trapWarningIds", "reviewFlags"];
    case "next_steps_safe":
      // Safe procedural category references only.
      // No deadline calculation, no autonomous submission, no enforcement certainty.
      return ["authorizedClaimCandidates", "uncertaintyReasons", "reviewFlags"];
    case "uncertainty_and_limits":
      return ["uncertaintyReasons", "confidencePosture"];
    case "review_recommendation":
      return ["humanReviewSuggested", "reviewFlags"];
    case "paid_deep_explanation":
      return [
        "explicitFinancialSignalsOnly",
        "explicitDeadlineMentionsOnly",
        "institutionSignals",
        "authorizedClaimCandidates",
        "supportedRealityCandidates",
        "boundaryIds",
        "trapWarningIds",
      ];
    default:
      return [];
  }
}

// ── Forbidden-move suppression rules for paid tier ────────────────────────────
// Each rule records: the forbidden move, the diagnostic code to emit, sections
// to fully exclude, and sections that stay but receive a blockedReasonCode.

interface PaidForbiddenMoveEffect {
  readonly move: ForbiddenExplanationMove;
  readonly diagnosticCode: PaidExplanationMapperDiagnosticCode;
  readonly excludedSections: readonly RuntimeExplanationSectionType[];
  readonly restrictedSections: readonly RuntimeExplanationSectionType[];
}

// 8.2F-15C: each forbidden move maps to its own specific diagnostic code.
// paid_legal_verdict_blocked is now used only for no_definitive_legal_verdicts.
// paid_autonomous_action_blocked is now used only for no_autonomous_form_submission.
// Section-exclusion notifications use paid_section_excluded_by_forbidden_move.
const PAID_FORBIDDEN_MOVE_EFFECTS: readonly PaidForbiddenMoveEffect[] = [
  // ── Move-specific codes (8.2F-4, retained with narrowed semantics) ─────────
  {
    move: "no_autonomous_form_submission",
    diagnosticCode: "paid_autonomous_action_blocked",
    // next_steps_safe is fully excluded — its sole purpose is action guidance,
    // which is structurally unsafe without autonomous submission guard.
    excludedSections: ["next_steps_safe"],
    restrictedSections: [],
  },
  {
    move: "no_deadline_calculation_when_forbidden",
    diagnosticCode: "paid_deadline_output_blocked",
    excludedSections: [],
    restrictedSections: ["paid_deep_explanation", "next_steps_safe"],
  },
  {
    move: "no_enforcement_claim_when_forbidden",
    diagnosticCode: "paid_enforcement_claim_blocked",
    excludedSections: [],
    restrictedSections: ["paid_deep_explanation", "attention_points"],
  },
  {
    move: "no_definitive_legal_verdicts",
    diagnosticCode: "paid_legal_verdict_blocked",          // narrowed to this move only (8.2F-15C)
    excludedSections: [],
    restrictedSections: ["what_this_means", "paid_deep_explanation"],
  },
  {
    move: "no_cross_lane_merging",
    diagnosticCode: "paid_cross_lane_merge_blocked",
    excludedSections: [],
    restrictedSections: ["what_this_means", "paid_deep_explanation"],
  },
  // ── Move-specific codes (8.2F-15C: replaces paid_legal_verdict_blocked overload) ──
  {
    move: "no_high_panic_phrasing",
    diagnosticCode: "paid_panic_phrasing_blocked",         // was paid_enforcement_claim_blocked
    excludedSections: [],
    restrictedSections: ["attention_points", "what_this_means"],
  },
  {
    move: "no_dry_run_as_fact",
    diagnosticCode: "paid_truthfulness_blocked",           // was paid_legal_verdict_blocked
    excludedSections: [],
    restrictedSections: ["what_this_means", "paid_deep_explanation", "attention_points"],
  },
  {
    move: "no_speculation_as_fact",
    diagnosticCode: "paid_truthfulness_blocked",           // was paid_legal_verdict_blocked
    excludedSections: [],
    restrictedSections: ["what_this_means", "paid_deep_explanation"],
  },
  {
    move: "no_guaranteed_outcomes",
    diagnosticCode: "paid_guaranteed_outcome_blocked",     // was paid_legal_verdict_blocked
    excludedSections: [],
    restrictedSections: ["what_this_means", "paid_deep_explanation"],
  },
  {
    move: "no_tax_certainty",
    diagnosticCode: "paid_tax_certainty_blocked",          // was paid_legal_verdict_blocked
    excludedSections: [],
    restrictedSections: ["what_this_means", "paid_deep_explanation"],
  },
  {
    move: "no_immigration_certainty",
    diagnosticCode: "paid_immigration_certainty_blocked",  // was paid_legal_verdict_blocked
    excludedSections: [],
    restrictedSections: ["what_this_means", "paid_deep_explanation"],
  },
  // ── 8.2F-15A moves with dedicated diagnostics (8.2F-15C) ──────────────────
  {
    move: "no_false_reassurance_framing",
    diagnosticCode: "paid_false_reassurance_blocked",
    excludedSections: [],
    restrictedSections: ["what_this_means", "paid_deep_explanation"],
  },
  {
    move: "no_calculated_amount_extraction",
    diagnosticCode: "paid_calculated_amount_blocked",
    excludedSections: [],
    restrictedSections: ["what_this_means", "paid_deep_explanation"],
  },
];

// ── Posture helpers ───────────────────────────────────────────────────────────

function derivePaidUncertaintyPosture(
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

function derivePaidReviewPosture(
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
    code: "invalid_access_tier_for_paid_explanation_mapper" satisfies PaidExplanationMapperDiagnosticCode,
    detail: `Paid explanation mapper requires accessTier "paid_explanation"; received "${input.accessTier}". No draft sections produced.`,
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
 * Projects a governance-bounded paid-tier explanation draft from a
 * RuntimeExplanationMapperInput.
 *
 * Enforces accessTier === "paid_explanation" structurally. If the input tier is
 * not paid_explanation, returns a diagnostic-only draft with no sections (no throw).
 *
 * Deeper sections (what_this_means, attention_points, next_steps_safe,
 * paid_deep_explanation) are produced with explicit PaidExplanationFields field
 * allowlists. All governance constraints, forbidden moves, and required constraints
 * are preserved. No prose is generated. No extraction occurs.
 */
export function runPaidExplanationMapper(
  input: RuntimeExplanationMapperInput,
): RuntimeExplanationDraft {
  // -- Tier enforcement --
  if (input.accessTier !== "paid_explanation") {
    return buildInvalidTierDraft(input);
  }

  const { simulationResult, explanationContract } = input;
  const forbiddenMoves = explanationContract.forbiddenExplanationMoves;
  const requiredConstraints = explanationContract.requiredExplanationConstraints;

  // -- Applied boundaries from simulation result --
  const appliedBoundaries: readonly ExplanationBoundary[] =
    simulationResult.explanationBoundaries ?? [];

  // -- Governance consistency: note if input tier differs from contract tier --
  const diagnostics: ExplanationMapperDiagnostic[] = [];
  if (explanationContract.accessTier !== "paid_explanation") {
    diagnostics.push({
      code: "invalid_access_tier_for_paid_explanation_mapper" satisfies PaidExplanationMapperDiagnosticCode,
      detail: `input.accessTier is "paid_explanation" but contract.accessTier is "${explanationContract.accessTier}". Proceeding with input.accessTier.`,
      neverUserVisible: true,
    });
  }

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

  const uncertaintyPosture = derivePaidUncertaintyPosture(
    forbiddenMoves,
    requiredConstraints,
    hasHighConsequenceFlag,
    hasUncertaintyReasons,
  );

  const reviewPosture = derivePaidReviewPosture(
    hasHumanReviewFlag,
    hasProfessionalFlag,
    hasAnyReviewFlag,
    contractSuggestsReview,
  );

  const uncertaintyPreserved =
    uncertaintyPosture === "uncertainty_preserved" ||
    uncertaintyPosture === "high_consequence_uncertainty";

  // -- Pre-compute forbidden-move exclusions and restrictions --
  const excludedSectionTypes = new Set<RuntimeExplanationSectionType>();
  const sectionBlockedReasonCodes = new Map<RuntimeExplanationSectionType, string[]>();

  for (const effect of PAID_FORBIDDEN_MOVE_EFFECTS) {
    if (!forbiddenMoves.includes(effect.move)) continue;

    diagnostics.push({
      code: effect.diagnosticCode,
      detail: `Forbidden move "${effect.move}" suppressed in paid explanation draft.`,
      neverUserVisible: true,
    });

    for (const s of effect.excludedSections) {
      excludedSectionTypes.add(s);
    }
    for (const s of effect.restrictedSections) {
      const existing = sectionBlockedReasonCodes.get(s) ?? [];
      existing.push(`forbidden_move:${effect.move}`);
      sectionBlockedReasonCodes.set(s, existing);
    }
  }

  // 8.2F-15D: Remove any restriction bookkeeping accumulated for sections that are
  // already excluded. The section assembly skips excluded sections before reading
  // sectionBlockedReasonCodes, making those entries permanently unreachable.
  //
  // The canonical dead state: when no_autonomous_form_submission and
  // no_deadline_calculation_when_forbidden are both active, the effect loop adds
  // next_steps_safe to both excludedSectionTypes (from no_autonomous_form_submission)
  // and sectionBlockedReasonCodes (from no_deadline_calculation_when_forbidden).
  // The assembly loop's exclusion check fires first, discarding the restriction entry.
  // This post-filter makes that discarding explicit and eliminates the dead state.
  //
  // No visible behavior change: excluded sections produce no section draft entries
  // and therefore no blockedReasonCodes in the output regardless.
  for (const excluded of excludedSectionTypes) {
    sectionBlockedReasonCodes.delete(excluded);
  }

  // -- Build section candidates --
  const candidateSections: RuntimeExplanationSectionType[] = [
    ...PAID_BASE_SECTIONS,
    ...(reviewPosture !== "none"
      ? (["review_recommendation"] as RuntimeExplanationSectionType[])
      : []),
  ];

  // -- Assemble section drafts --
  const sectionDrafts: RuntimeExplanationSectionDraft[] = [];

  for (const sectionType of candidateSections) {
    // Structural tier isolation: block free-only sections.
    if (PAID_BLOCKED_SECTIONS.includes(sectionType)) {
      diagnostics.push({
        code: "invalid_access_tier_for_paid_explanation_mapper" satisfies PaidExplanationMapperDiagnosticCode,
        detail: `Section "${sectionType}" is not available in paid_explanation tier.`,
        neverUserVisible: true,
      });
      continue;
    }

    // Forbidden-move exclusions.
    // 8.2F-15C: generic section-exclusion now uses paid_section_excluded_by_forbidden_move
    // instead of the semantically specific paid_autonomous_action_blocked.
    if (excludedSectionTypes.has(sectionType)) {
      diagnostics.push({
        code: "paid_section_excluded_by_forbidden_move" satisfies PaidExplanationMapperDiagnosticCode,
        detail: `Section "${sectionType}" excluded by active forbidden move(s).`,
        neverUserVisible: true,
      });
      continue;
    }

    const blockedReasonCodes = sectionBlockedReasonCodes.get(sectionType) ?? [];

    if (blockedReasonCodes.length > 0) {
      // 8.2F-15C: section restriction notification uses the generic section-exclusion code
      // rather than the semantically specific paid_deadline_output_blocked.
      diagnostics.push({
        code: "paid_section_excluded_by_forbidden_move" satisfies PaidExplanationMapperDiagnosticCode,
        detail: `Section "${sectionType}" has content restrictions: ${blockedReasonCodes.join(", ")}.`,
        neverUserVisible: true,
      });
    }

    sectionDrafts.push({
      sectionType,
      accessTier: "paid_explanation",
      sourceBound: true,
      uncertaintyPreserved,
      allowedContractFields: getPaidAllowedFields(sectionType),
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
    accessTier: "paid_explanation",
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
