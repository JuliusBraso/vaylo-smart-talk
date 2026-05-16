import type { RuleExpression, RuleEvaluationResult } from "../evidence-gates-types";

import { DEFAULT_SKELETON_CONFIDENCE } from "./constants";

const UNSUPPORTED = "unsupported_in_skeleton";

function unsupported(feature: string, extra?: readonly string[]): RuleEvaluationResult {
  return {
    matched: false,
    confidence: DEFAULT_SKELETON_CONFIDENCE,
    reason: UNSUPPORTED,
    unsupportedFeatures: extra ? [feature, ...extra] : [feature],
  };
}

/**
 * Skeleton evaluator for `RuleExpression` trees.
 *
 * - Implements: `allOf`, `anyOf`, `not` when `childResults` align with `children` order.
 * - `noneOf`: conservative — not semantically finalized; returns unmatched with pending flag.
 * - Leaf / document-dependent ops: always `matched: false`, reason `unsupported_in_skeleton`.
 *
 * Does NOT scan document text, execute regex, or assign lanes.
 */
export function evaluateRuleExpression(
  expr: RuleExpression,
  childResults?: readonly RuleEvaluationResult[],
): RuleEvaluationResult {
  switch (expr.op) {
    case "allOf": {
      if (!childResults || childResults.length !== expr.children.length) {
        return {
          matched: false,
          confidence: DEFAULT_SKELETON_CONFIDENCE,
          reason: "allOf_child_count_mismatch",
          unsupportedFeatures: ["allOf_requires_ordered_childResults"],
        };
      }
      const matched = childResults.every((c) => c.matched);
      return {
        matched,
        confidence: matched ? 1 : DEFAULT_SKELETON_CONFIDENCE,
        reason: matched ? "allOf_satisfied" : "allOf_failed",
      };
    }
    case "anyOf": {
      if (!childResults || childResults.length !== expr.children.length) {
        return {
          matched: false,
          confidence: DEFAULT_SKELETON_CONFIDENCE,
          reason: "anyOf_child_count_mismatch",
          unsupportedFeatures: ["anyOf_requires_ordered_childResults"],
        };
      }
      const matched = childResults.some((c) => c.matched);
      return {
        matched,
        confidence: matched ? 1 : DEFAULT_SKELETON_CONFIDENCE,
        reason: matched ? "anyOf_satisfied" : "anyOf_failed",
      };
    }
    case "noneOf":
      return {
        matched: false,
        confidence: DEFAULT_SKELETON_CONFIDENCE,
        reason: UNSUPPORTED,
        unsupportedFeatures: ["noneOf_semantics_pending_in_skeleton"],
      };
    case "not": {
      if (!childResults || childResults.length !== 1) {
        return {
          matched: false,
          confidence: DEFAULT_SKELETON_CONFIDENCE,
          reason: "not_requires_single_childResult",
        };
      }
      const inner = childResults[0];
      return {
        matched: !inner.matched,
        confidence: DEFAULT_SKELETON_CONFIDENCE,
        reason: inner.matched ? "not_inverted_to_false" : "not_inverted_to_true",
      };
    }
    case "cue":
      return unsupported("cue_scan");
    case "ruleRef":
      return unsupported("ruleRef_resolution");
    case "proximity":
      return unsupported("proximity_window");
    case "laneScope":
      return unsupported("lane_scope");
    case "minEvidence":
      return unsupported("minEvidence_gate");
    case "conditionalForbidden":
      return unsupported("conditional_forbidden");
  }
}
