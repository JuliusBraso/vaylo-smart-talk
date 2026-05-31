/**
 * Smart Talk Bridge Dry Run (Phase 8.2F-6 / 8.2F-15I blocking reasons).
 *
 * Connects the existing governance cognition pipeline into a complete dry-run
 * flow — routing a paired (simulationResult, explanationContract) through the
 * appropriate tier-specific mapper and performing bridge-level structural
 * validity and governance preservation checks on the resulting draft.
 *
 * End-to-end dry-run flow:
 *   SmartTalkBridgeDryRunInput
 *     → route on accessTier
 *       → runFreePreviewMapper  (free_preview)
 *       → runPaidExplanationMapper (paid_explanation)
 *     → structural validity checks (section invariants, diagnostic invariants)
 *     → governance preservation checks (no leakage, contract arrays preserved)
 *     → SmartTalkBridgeDryRunResult
 *
 * Safety guarantees:
 * - no prose generation
 * - no LLM calls
 * - no OCR access
 * - no Smart Talk production wiring
 * - no UI rendering
 * - no deadline calculation
 * - no legal conclusions inferred
 * - output is structural cognition metadata only
 * - neverUserVisible: true on all bridge results and diagnostics
 */

import type {
  BridgeBlockingReason,
  BridgeDiagnostic,
  BridgeDiagnosticCode,
  RuntimeExplanationDraft,
  RuntimeExplanationMapperInput,
  RuntimeExplanationSectionType,
  SmartTalkBridgeDryRunInput,
  SmartTalkBridgeDryRunResult,
} from "./explanation-mapper-types";
import { runFreePreviewMapper } from "./run-free-preview-mapper";
import { runPaidExplanationMapper } from "./run-paid-explanation-mapper";

export const SMART_TALK_BRIDGE_DRY_RUN_VERSION =
  "8.2f-15i-smart-talk-bridge-dry-run-v2";

// ── Structural constants ──────────────────────────────────────────────────────

/**
 * Sections that are exclusively paid-tier. Their presence in a free_preview
 * draft constitutes a leakage violation.
 */
const PAID_ONLY_SECTIONS: readonly RuntimeExplanationSectionType[] = [
  "what_this_means",
  "attention_points",
  "next_steps_safe",
  "paid_deep_explanation",
];

/**
 * Sections that are exclusively free-tier. Their presence in a paid_explanation
 * draft constitutes a leakage violation.
 */
const FREE_ONLY_SECTIONS: readonly RuntimeExplanationSectionType[] = [
  "payment_preview_limited",
];

// ── Diagnostic factory ────────────────────────────────────────────────────────

function makeBridgeDiag(
  code: BridgeDiagnosticCode,
  detail: string,
): BridgeDiagnostic {
  return { code, detail, neverUserVisible: true };
}

// ── Main function ─────────────────────────────────────────────────────────────

/**
 * Routes a governance cognition pipeline input through the appropriate
 * tier-specific mapper and validates the resulting draft for structural
 * integrity and governance preservation.
 *
 * Does not throw. All violations are recorded as bridge-level diagnostics.
 * Produces structural cognition metadata only — no prose, no LLM, no OCR.
 */
export function runSmartTalkBridgeDryRun(
  input: SmartTalkBridgeDryRunInput,
): SmartTalkBridgeDryRunResult {
  const bridgeDiagnostics: BridgeDiagnostic[] = [];
  // 8.2F-15I: typed blocking reasons accumulated in parallel with diagnostics.
  // Use a Set to deduplicate — multiple sections can violate the same invariant.
  const blockingReasonsSet = new Set<BridgeBlockingReason>();

  // ── Build mapper input ────────────────────────────────────────────────────

  const mapperInput: RuntimeExplanationMapperInput = {
    simulationResult: input.simulationResult,
    explanationContract: input.explanationContract,
    accessTier: input.accessTier,
    auditTraceRef: input.auditTraceRef,
    mapperVersion: SMART_TALK_BRIDGE_DRY_RUN_VERSION,
  };

  // ── Route to tier-specific mapper ─────────────────────────────────────────

  let mapperKind: "free_preview" | "paid_explanation";
  let draft: RuntimeExplanationDraft;

  if (input.accessTier === "free_preview") {
    mapperKind = "free_preview";
    draft = runFreePreviewMapper(mapperInput);
  } else if (input.accessTier === "paid_explanation") {
    mapperKind = "paid_explanation";
    draft = runPaidExplanationMapper(mapperInput);
  } else {
    // TypeScript exhaustion guard — unreachable in well-typed contexts.
    bridgeDiagnostics.push(
      makeBridgeDiag(
        "bridge_invalid_access_tier",
        `Unrecognized accessTier: "${String(input.accessTier)}". Defaulting to free_preview mapper.`,
      ),
    );
    blockingReasonsSet.add("invalid_access_tier");
    mapperKind = "free_preview";
    draft = runFreePreviewMapper(mapperInput);
  }

  // ── CONTRACT TIER MISMATCH CHECK (Phase 8.2F-6A) ─────────────────────────
  // Observability-only diagnostic. Emitted when input.accessTier differs from
  // explanationContract.accessTier, signalling that the bridge was invoked with
  // a contract whose declared tier does not align with the routing tier.
  //
  // IMPORTANT: this check does NOT change routing behavior. Routing always uses
  // input.accessTier (above). The diagnostic improves audit observability only.
  // It does NOT set structurallyValid or governancePreserved to false on its own.
  if (input.accessTier !== input.explanationContract.accessTier) {
    bridgeDiagnostics.push(
      makeBridgeDiag(
        "bridge_contract_tier_mismatch",
        `input.accessTier="${input.accessTier}" does not match explanationContract.accessTier="${input.explanationContract.accessTier}". Routing was performed on input.accessTier. Contract governance arrays remain applied.`,
      ),
    );
  }

  // ── STRUCTURAL VALIDITY CHECKS ────────────────────────────────────────────
  // These verify that the mapper output respects section-level invariants
  // mandated by the Vaylo Document Reasoning Constitution V1.

  let structurallyValid = true;

  // Check 1: All section drafts must have sourceBound: true.
  for (const section of draft.sectionDrafts) {
    if (!section.sourceBound) {
      structurallyValid = false;
      bridgeDiagnostics.push(
        makeBridgeDiag(
          "bridge_invalid_section_invariant",
          `Section "${section.sectionType}" violates sourceBound invariant (expected true).`,
        ),
      );
      blockingReasonsSet.add("section_invariant_violation");
    }
  }

  // Check 2: All section drafts must have neverContainsUserVisibleCopy: true.
  for (const section of draft.sectionDrafts) {
    if (!section.neverContainsUserVisibleCopy) {
      structurallyValid = false;
      bridgeDiagnostics.push(
        makeBridgeDiag(
          "bridge_invalid_section_invariant",
          `Section "${section.sectionType}" violates neverContainsUserVisibleCopy invariant (expected true).`,
        ),
      );
      blockingReasonsSet.add("section_invariant_violation");
    }
  }

  // Check 3: All mapper diagnostics must have neverUserVisible: true.
  for (const diag of draft.neverUserVisibleDiagnostics) {
    if (!diag.neverUserVisible) {
      structurallyValid = false;
      bridgeDiagnostics.push(
        makeBridgeDiag(
          "bridge_invalid_section_invariant",
          `Mapper diagnostic code="${diag.code}" violates neverUserVisible invariant (expected true).`,
        ),
      );
      blockingReasonsSet.add("diagnostic_visibility_violation");
    }
  }

  // ── GOVERNANCE PRESERVATION CHECKS ───────────────────────────────────────
  // These verify that the mapper faithfully preserved contract governance
  // arrays and did not produce cross-tier leakage.

  const { explanationContract } = input;

  // Check 4: Contract forbidden moves must appear in draft.appliedForbiddenMoves.
  for (const move of explanationContract.forbiddenExplanationMoves) {
    if (!draft.appliedForbiddenMoves.includes(move)) {
      bridgeDiagnostics.push(
        makeBridgeDiag(
          "bridge_governance_preservation_failure",
          `Contract forbiddenMove "${move}" is absent from draft.appliedForbiddenMoves — governance contract not preserved.`,
        ),
      );
      blockingReasonsSet.add("forbidden_move_not_preserved");
    }
  }

  // Check 5: Contract required constraints must appear in draft.appliedRequiredConstraints.
  for (const constraint of explanationContract.requiredExplanationConstraints) {
    if (!draft.appliedRequiredConstraints.includes(constraint)) {
      bridgeDiagnostics.push(
        makeBridgeDiag(
          "bridge_governance_preservation_failure",
          `Contract requiredConstraint "${constraint}" is absent from draft.appliedRequiredConstraints — governance contract not preserved.`,
        ),
      );
      blockingReasonsSet.add("required_constraint_not_preserved");
    }
  }

  // Check 6: Free preview must not leak paid-only sections.
  if (mapperKind === "free_preview") {
    for (const sectionType of PAID_ONLY_SECTIONS) {
      if (draft.sectionDrafts.some((s) => s.sectionType === sectionType)) {
        structurallyValid = false;
        bridgeDiagnostics.push(
          makeBridgeDiag(
            "bridge_free_preview_leakage",
            `Free preview draft contains paid-only section "${sectionType}" — tier boundary violated.`,
          ),
        );
        blockingReasonsSet.add("free_preview_paid_section_leakage");
      }
    }
  }

  // Check 7: Paid explanation must not leak free-only sections.
  if (mapperKind === "paid_explanation") {
    for (const sectionType of FREE_ONLY_SECTIONS) {
      if (draft.sectionDrafts.some((s) => s.sectionType === sectionType)) {
        structurallyValid = false;
        bridgeDiagnostics.push(
          makeBridgeDiag(
            "bridge_free_preview_leakage",
            `Paid explanation draft contains free-only section "${sectionType}" — tier boundary violated.`,
          ),
        );
        blockingReasonsSet.add("paid_free_only_section_leakage");
      }
    }
  }

  // ── GOVERNANCE PRESERVATION FLAG ──────────────────────────────────────────
  // governancePreserved is true only when no governance-class bridge
  // diagnostics were emitted AND all section invariants passed.

  const governanceViolationCodes = new Set<BridgeDiagnosticCode>([
    "bridge_governance_preservation_failure",
    "bridge_free_preview_leakage",
    "bridge_missing_governance_metadata",
    "bridge_invalid_access_tier",
  ]);

  const hasGovernanceViolation = bridgeDiagnostics.some((d) =>
    governanceViolationCodes.has(d.code),
  );

  const governancePreserved = !hasGovernanceViolation && structurallyValid;

  // 8.2F-15I: Convert deduplicated blocking reason set to a stable readonly array.
  // bridge_contract_tier_mismatch is observability-only and intentionally excluded —
  // it does not affect governancePreserved or structurallyValid.
  const blockingReasons: readonly BridgeBlockingReason[] = [
    ...blockingReasonsSet,
  ];

  // ── NOTES ─────────────────────────────────────────────────────────────────

  const notes: string[] = [];
  const ctx = input.dryRunContext ? ` [context: ${input.dryRunContext}]` : "";

  if (governancePreserved && structurallyValid) {
    notes.push(
      `Bridge dry run complete${ctx}. mapperKind=${mapperKind}. All structural invariants and governance constraints preserved.`,
    );
  } else {
    notes.push(
      `Bridge dry run complete with violations${ctx}. mapperKind=${mapperKind}. structurallyValid=${String(structurallyValid)}. governancePreserved=${String(governancePreserved)}. bridgeDiagnostics=${String(bridgeDiagnostics.length)}.`,
    );
  }

  notes.push(
    "Dry-run only: no prose generated, no LLM called, no OCR accessed, no Smart Talk runtime integration.",
  );

  if (input.auditTraceRef) {
    notes.push(`auditTraceRef: ${input.auditTraceRef}`);
  }

  // ── RESULT ────────────────────────────────────────────────────────────────

  return {
    bridgeVersion: SMART_TALK_BRIDGE_DRY_RUN_VERSION,
    mapperKind,
    draft,
    structurallyValid,
    governancePreserved,
    blockingReasons,
    diagnostics: bridgeDiagnostics,
    notes,
    neverUserVisible: true,
  };
}
