/**
 * Runtime Explanation Mapper skeleton (Phase 8.2F-2).
 *
 * Pure function. No side effects.
 *
 * Safety guarantees:
 * - no user-visible prose generated
 * - no Smart Talk wiring
 * - no LLM calls
 * - no OCR access
 * - no raw document text access
 * - no deadline calculation
 * - no legal conclusions inferred
 * - output is structural draft metadata only
 */

import type { ExplanationBoundary } from "../reality-simulation-types";
import type {
  ExplanationAccessTier,
  ForbiddenExplanationMove,
  FreePreviewFields,
  PaidExplanationFields,
  RequiredExplanationConstraint,
} from "./explanation-contract-types";
import type {
  ExplanationMapperDiagnostic,
  ExplanationReviewPosture,
  ExplanationUncertaintyPosture,
  RuntimeExplanationDraft,
  RuntimeExplanationMapperInput,
  RuntimeExplanationSectionDraft,
  RuntimeExplanationSectionType,
} from "./explanation-mapper-types";

export const EXPLANATION_MAPPER_VERSION =
  "8.2f-2-explanation-mapper-skeleton-v1";

// ── Contract-field reference type ────────────────────────────────────────────
// Used only to annotate which contract fields each section draft is allowed to
// reference. Not used for extraction or prose generation.

type ContractFieldRef = keyof FreePreviewFields | keyof PaidExplanationFields;

// ── Allowed contract fields per section type and tier ─────────────────────────
// Explicit table only. Do not infer from field names.

function getAllowedContractFields(
  sectionType: RuntimeExplanationSectionType,
  accessTier: ExplanationAccessTier,
): readonly ContractFieldRef[] {
  if (accessTier === "free_preview") {
    switch (sectionType) {
      case "document_overview":
        return [
          "documentTypeCandidate",
          "documentTypeLabel",
          "senderCategory",
          "confidencePosture",
        ];
      case "payment_preview_limited":
        return [
          "hasFinancialSignal",
          "hasDeadlineSignal",
          "attentionLevelPreview",
          "confidencePosture",
        ];
      case "uncertainty_and_limits":
        return ["confidencePosture", "attentionLevelPreview"];
      case "review_recommendation":
        return ["humanReviewSuggested"];
      default:
        return [];
    }
  } else {
    switch (sectionType) {
      case "document_overview":
        return [
          "documentTypeCandidate",
          "documentTypeLabel",
          "senderCategory",
          "institutionSignals",
          "confidencePosture",
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
}

// ── Section-tier membership ───────────────────────────────────────────────────

const PAID_ONLY_SECTIONS: ReadonlySet<RuntimeExplanationSectionType> = new Set([
  "paid_deep_explanation",
  "what_this_means",
  "attention_points",
  "next_steps_safe",
]);

const FREE_ONLY_SECTIONS: ReadonlySet<RuntimeExplanationSectionType> = new Set([
  "payment_preview_limited",
]);

// ── Forbidden-move effects ────────────────────────────────────────────────────
// Explicit rule table: which forbidden moves fully exclude a section type, and
// which only add a content restriction tag.

interface ForbiddenMoveRule {
  readonly move: ForbiddenExplanationMove;
  /** Sections fully excluded from the draft when this move is active. */
  readonly excludedSections: readonly RuntimeExplanationSectionType[];
  /** Sections that remain but receive a blockedReasonCode. */
  readonly restrictedSections: readonly RuntimeExplanationSectionType[];
}

const FORBIDDEN_MOVE_RULES: readonly ForbiddenMoveRule[] = [
  {
    move: "no_autonomous_form_submission",
    excludedSections: ["next_steps_safe"],
    restrictedSections: [],
  },
  {
    move: "no_deadline_calculation_when_forbidden",
    excludedSections: [],
    restrictedSections: ["paid_deep_explanation"],
  },
  {
    move: "no_enforcement_claim_when_forbidden",
    excludedSections: [],
    restrictedSections: ["paid_deep_explanation", "attention_points"],
  },
  {
    move: "no_high_panic_phrasing",
    excludedSections: [],
    restrictedSections: ["attention_points", "what_this_means"],
  },
  {
    move: "no_cross_lane_merging",
    excludedSections: [],
    restrictedSections: ["what_this_means", "paid_deep_explanation"],
  },
  {
    move: "no_definitive_legal_verdicts",
    excludedSections: [],
    restrictedSections: ["paid_deep_explanation", "what_this_means"],
  },
  {
    move: "no_dry_run_as_fact",
    excludedSections: [],
    restrictedSections: ["what_this_means", "paid_deep_explanation", "attention_points"],
  },
  {
    move: "no_speculation_as_fact",
    excludedSections: [],
    restrictedSections: ["what_this_means", "paid_deep_explanation"],
  },
];

// ── Posture derivation ────────────────────────────────────────────────────────

function deriveUncertaintyPosture(
  forbiddenMoves: readonly ForbiddenExplanationMove[],
  requiredConstraints: readonly RequiredExplanationConstraint[],
  hasHighConsequenceFlag: boolean,
  hasUncertaintyReasons: boolean,
): ExplanationUncertaintyPosture {
  if (hasHighConsequenceFlag) return "high_consequence_uncertainty";
  const needsUncertainty =
    requiredConstraints.includes("required_uncertainty_wording") ||
    requiredConstraints.includes("must_preserve_uncertainty") ||
    forbiddenMoves.includes("no_dry_run_as_fact") ||
    forbiddenMoves.includes("no_speculation_as_fact");
  if (needsUncertainty) return "uncertainty_preserved";
  if (hasUncertaintyReasons) return "limited";
  return "unknown";
}

function deriveReviewPosture(
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

// ── Section candidate lists ───────────────────────────────────────────────────

function getCandidateSections(
  accessTier: ExplanationAccessTier,
  includeReviewSection: boolean,
): RuntimeExplanationSectionType[] {
  if (accessTier === "free_preview") {
    return [
      "document_overview",
      "payment_preview_limited",
      "uncertainty_and_limits",
      ...(includeReviewSection
        ? (["review_recommendation"] as RuntimeExplanationSectionType[])
        : []),
    ];
  }
  return [
    "document_overview",
    "what_this_means",
    "attention_points",
    "next_steps_safe",
    "uncertainty_and_limits",
    ...(includeReviewSection
      ? (["review_recommendation"] as RuntimeExplanationSectionType[])
      : []),
    "paid_deep_explanation",
  ];
}

// ── Main skeleton function ────────────────────────────────────────────────────

/**
 * Transforms a RuntimeExplanationMapperInput into a structured RuntimeExplanationDraft.
 *
 * Output is structural draft metadata only. No prose is generated.
 * Access tier boundaries and all governance constraints are preserved.
 */
export function runExplanationMapper(
  input: RuntimeExplanationMapperInput,
): RuntimeExplanationDraft {
  const { simulationResult, explanationContract, accessTier } = input;

  // -- Collect governance from contract --
  const forbiddenMoves = explanationContract.forbiddenExplanationMoves;
  const requiredConstraints = explanationContract.requiredExplanationConstraints;

  // -- Applied boundaries from simulation result --
  const appliedBoundaries: readonly ExplanationBoundary[] =
    simulationResult.explanationBoundaries ?? [];

  // -- Review flag analysis (governance ids only, never prose) --
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

  const uncertaintyPosture = deriveUncertaintyPosture(
    forbiddenMoves,
    requiredConstraints,
    hasHighConsequenceFlag,
    hasUncertaintyReasons,
  );

  const reviewPosture = deriveReviewPosture(
    hasHumanReviewFlag,
    hasProfessionalFlag,
    hasAnyReviewFlag,
    contractSuggestsReview,
  );

  const uncertaintyPreserved =
    uncertaintyPosture === "uncertainty_preserved" ||
    uncertaintyPosture === "high_consequence_uncertainty";

  // -- Pre-compute forbidden-move exclusion sets for this call --
  const excludedSectionTypes = new Set<RuntimeExplanationSectionType>();
  const restrictedSectionTypes = new Map<RuntimeExplanationSectionType, string[]>();

  for (const rule of FORBIDDEN_MOVE_RULES) {
    if (!forbiddenMoves.includes(rule.move)) continue;
    for (const s of rule.excludedSections) {
      excludedSectionTypes.add(s);
    }
    for (const s of rule.restrictedSections) {
      const existing = restrictedSectionTypes.get(s) ?? [];
      existing.push(`forbidden_move:${rule.move}`);
      restrictedSectionTypes.set(s, existing);
    }
  }

  // -- Build section drafts --
  const candidateSections = getCandidateSections(
    accessTier,
    reviewPosture !== "none",
  );

  const sectionDrafts: RuntimeExplanationSectionDraft[] = [];
  const diagnostics: ExplanationMapperDiagnostic[] = [];

  // Governance consistency: warn if input accessTier differs from contract tier.
  if (accessTier !== explanationContract.accessTier) {
    diagnostics.push({
      code: "access_tier_mismatch",
      detail: `input.accessTier "${accessTier}" differs from contract.accessTier "${explanationContract.accessTier}"; using input.accessTier.`,
      neverUserVisible: true,
    });
  }

  for (const sectionType of candidateSections) {
    // -- Tier isolation --
    if (accessTier === "free_preview" && PAID_ONLY_SECTIONS.has(sectionType)) {
      diagnostics.push({
        code: "section_excluded_tier_mismatch",
        detail: `Section "${sectionType}" is not available in free_preview tier.`,
        neverUserVisible: true,
      });
      continue;
    }
    if (accessTier === "paid_explanation" && FREE_ONLY_SECTIONS.has(sectionType)) {
      diagnostics.push({
        code: "section_excluded_tier_mismatch",
        detail: `Section "${sectionType}" is not available in paid_explanation tier.`,
        neverUserVisible: true,
      });
      continue;
    }

    // -- Forbidden-move exclusions --
    if (excludedSectionTypes.has(sectionType)) {
      diagnostics.push({
        code: "section_excluded_forbidden_move",
        detail: `Section "${sectionType}" excluded by active forbidden move(s).`,
        neverUserVisible: true,
      });
      continue;
    }

    // -- Forbidden-move content restrictions --
    const blockedReasonCodes: readonly string[] =
      restrictedSectionTypes.get(sectionType) ?? [];

    if (blockedReasonCodes.length > 0) {
      diagnostics.push({
        code: "section_content_restricted_by_forbidden_move",
        detail: `Section "${sectionType}" has restricted content: ${blockedReasonCodes.join(", ")}.`,
        neverUserVisible: true,
      });
    }

    sectionDrafts.push({
      sectionType,
      accessTier,
      sourceBound: true,
      uncertaintyPreserved,
      allowedContractFields: getAllowedContractFields(sectionType, accessTier),
      blockedReasonCodes: blockedReasonCodes.length > 0 ? blockedReasonCodes : undefined,
      neverContainsUserVisibleCopy: true,
    });
  }

  // -- Audit refs --
  const auditRefs: string[] = [];
  if (input.auditTraceRef) auditRefs.push(input.auditTraceRef);
  if (explanationContract.auditTraceRef) auditRefs.push(explanationContract.auditTraceRef);
  if (simulationResult.auditTraceRef) auditRefs.push(simulationResult.auditTraceRef);
  // De-duplicate while preserving order.
  const seenRefs = new Set<string>();
  const dedupedAuditRefs = auditRefs.filter((r) => {
    if (seenRefs.has(r)) return false;
    seenRefs.add(r);
    return true;
  });

  return {
    draftVersion: "8.2f-2-runtime-explanation-draft-v1",
    accessTier,
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
