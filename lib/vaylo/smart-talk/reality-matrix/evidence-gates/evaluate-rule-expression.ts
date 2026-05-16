import type {
  RuleExpression,
  RuleExpressionEvaluationContext,
  RuleEvaluationResult,
} from "../evidence-gates-types";
import type { EvidenceLevel } from "../types";

import { DEFAULT_SKELETON_CONFIDENCE } from "./constants";

const UNRESOLVED_TERMINAL = "unresolved_terminal_expression";

const EVIDENCE_RANK: Record<EvidenceLevel, number> = {
  speculative: 1,
  contextual: 2,
  strongly_supported: 3,
  explicit: 4,
};

function mergeFeatures(...groups: (readonly string[] | undefined)[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const g of groups) {
    if (!g) continue;
    for (const x of g) {
      if (!seen.has(x)) {
        seen.add(x);
        out.push(x);
      }
    }
  }
  return out;
}

function isUnresolved(r: RuleEvaluationResult): boolean {
  return r.unresolved === true;
}

function weakestEvidence(levels: readonly (EvidenceLevel | undefined)[]): EvidenceLevel | undefined {
  let best: EvidenceLevel | undefined;
  let bestRank = 99;
  for (const l of levels) {
    if (!l) continue;
    const rk = EVIDENCE_RANK[l];
    if (rk < bestRank) {
      bestRank = rk;
      best = l;
    }
  }
  return best;
}

function strongestEvidence(levels: readonly (EvidenceLevel | undefined)[]): EvidenceLevel | undefined {
  let best: EvidenceLevel | undefined;
  let bestRank = 0;
  for (const l of levels) {
    if (!l) continue;
    const rk = EVIDENCE_RANK[l];
    if (rk > bestRank) {
      bestRank = rk;
      best = l;
    }
  }
  return best;
}

/**
 * Deterministic stable key for terminal `RuleExpression` nodes (no hashing).
 * Composite ops recurse into children for stable composition.
 */
export function terminalKey(expr: RuleExpression): string {
  switch (expr.op) {
    case "cue":
      return `cue:${expr.cueId}`;
    case "ruleRef":
      return `ruleRef:${expr.evidenceRuleId}`;
    case "proximity":
      return `proximity:w${expr.windowChars}:a(${terminalKey(expr.anchor)}):i(${terminalKey(expr.inner)})`;
    case "laneScope":
      return `laneScope:${expr.lanes.join(",")}:(${terminalKey(expr.inner)})`;
    case "minEvidence":
      return `minEvidence:${expr.minimum}:(${terminalKey(expr.inner)})`;
    case "conditionalForbidden":
      return `conditionalForbidden:${expr.claim}:(${terminalKey(expr.unless)})`;
    case "allOf":
      return `allOf(${expr.children.map((c) => terminalKey(c)).join("|")})`;
    case "anyOf":
      return `anyOf(${expr.children.map((c) => terminalKey(c)).join("|")})`;
    case "noneOf":
      return `noneOf(${expr.children.map((c) => terminalKey(c)).join("|")})`;
    case "not":
      return `not(${terminalKey(expr.child)})`;
  }
}

function resolveTerminalNode(
  expr: RuleExpression,
  context: RuleExpressionEvaluationContext | undefined,
): RuleEvaluationResult {
  const key = terminalKey(expr);
  const base = {
    expressionKind: expr.op,
    terminalKey: key,
  } as const;

  if (context?.resolveTerminal) {
    const r = context.resolveTerminal(expr);
    if (r) {
      return {
        ...r,
        ...base,
        unresolved: r.unresolved ?? false,
        childResults: undefined,
      };
    }
  }

  const fromMap = context?.terminalResults?.[key];
  if (fromMap) {
    return {
      ...fromMap,
      ...base,
      unresolved: fromMap.unresolved ?? false,
      childResults: undefined,
    };
  }

  return {
    matched: false,
    confidence: DEFAULT_SKELETON_CONFIDENCE,
    reason: UNRESOLVED_TERMINAL,
    unresolved: true,
    unsupportedFeatures: [`terminal:${expr.op}`],
    ...base,
  };
}

function walk(expr: RuleExpression, context?: RuleExpressionEvaluationContext): RuleEvaluationResult {
  switch (expr.op) {
    case "cue":
    case "ruleRef":
    case "proximity":
    case "laneScope":
    case "minEvidence":
    case "conditionalForbidden":
      return resolveTerminalNode(expr, context);

    case "allOf": {
      if (expr.children.length === 0) {
        return {
          matched: false,
          confidence: DEFAULT_SKELETON_CONFIDENCE,
          reason: "empty_allOf",
          expressionKind: "allOf",
          unsupportedFeatures: ["empty_allOf"],
        };
      }
      const childResults = expr.children.map((c) => walk(c, context));
      const anyUnresolved = childResults.some(isUnresolved);
      if (anyUnresolved) {
        return {
          matched: false,
          confidence: DEFAULT_SKELETON_CONFIDENCE,
          reason: "allOf_child_unresolved",
          expressionKind: "allOf",
          childResults,
          unresolved: true,
          unsupportedFeatures: mergeFeatures(
            ["allOf_unresolved_branch"],
            ...childResults.map((c) => c.unsupportedFeatures),
          ),
        };
      }
      const allMatch = childResults.every((c) => c.matched);
      const confidences = childResults.map((c) => c.confidence);
      const minConf = confidences.length ? Math.min(...confidences) : DEFAULT_SKELETON_CONFIDENCE;
      const ev = weakestEvidence(childResults.map((c) => c.evidenceLevel));
      return {
        matched: allMatch,
        confidence: allMatch ? minConf : DEFAULT_SKELETON_CONFIDENCE,
        evidenceLevel: ev,
        reason: allMatch ? "allOf_satisfied" : "allOf_failed",
        expressionKind: "allOf",
        childResults,
        unsupportedFeatures: mergeFeatures(...childResults.map((c) => c.unsupportedFeatures)),
      };
    }

    case "anyOf": {
      if (expr.children.length === 0) {
        return {
          matched: false,
          confidence: DEFAULT_SKELETON_CONFIDENCE,
          reason: "empty_anyOf",
          expressionKind: "anyOf",
          unsupportedFeatures: ["empty_anyOf"],
        };
      }
      const childResults = expr.children.map((c) => walk(c, context));
      const anyPositive = childResults.some((c) => c.matched && !isUnresolved(c));
      if (anyPositive) {
        const matchedChildren = childResults.filter((c) => c.matched && !isUnresolved(c));
        const maxConf = Math.max(...matchedChildren.map((c) => c.confidence));
        const ev = strongestEvidence(matchedChildren.map((c) => c.evidenceLevel));
        return {
          matched: true,
          confidence: maxConf,
          evidenceLevel: ev,
          reason: "anyOf_satisfied",
          expressionKind: "anyOf",
          childResults,
          unsupportedFeatures: mergeFeatures(...childResults.map((c) => c.unsupportedFeatures)),
        };
      }
      const anyUnresolved = childResults.some(isUnresolved);
      if (anyUnresolved) {
        return {
          matched: false,
          confidence: DEFAULT_SKELETON_CONFIDENCE,
          reason: "anyOf_unresolved_without_positive",
          expressionKind: "anyOf",
          childResults,
          unresolved: true,
          unsupportedFeatures: mergeFeatures(
            ["anyOf_unresolved_branch"],
            ...childResults.map((c) => c.unsupportedFeatures),
          ),
        };
      }
      return {
        matched: false,
        confidence: DEFAULT_SKELETON_CONFIDENCE,
        reason: "anyOf_failed",
        expressionKind: "anyOf",
        childResults,
        unsupportedFeatures: mergeFeatures(...childResults.map((c) => c.unsupportedFeatures)),
      };
    }

    case "noneOf": {
      if (expr.children.length === 0) {
        return {
          matched: false,
          confidence: DEFAULT_SKELETON_CONFIDENCE,
          reason: "empty_noneOf",
          expressionKind: "noneOf",
          unsupportedFeatures: ["empty_noneOf"],
        };
      }
      const childResults = expr.children.map((c) => walk(c, context));
      const anyUnresolved = childResults.some(isUnresolved);
      if (anyUnresolved) {
        return {
          matched: false,
          confidence: DEFAULT_SKELETON_CONFIDENCE,
          reason: "noneOf_child_unresolved",
          expressionKind: "noneOf",
          childResults,
          unresolved: true,
          unsupportedFeatures: mergeFeatures(
            ["noneOf_unresolved_branch"],
            ...childResults.map((c) => c.unsupportedFeatures),
          ),
        };
      }
      const anyMatched = childResults.some((c) => c.matched);
      if (anyMatched) {
        return {
          matched: false,
          confidence: DEFAULT_SKELETON_CONFIDENCE,
          reason: "noneOf_some_matched",
          expressionKind: "noneOf",
          childResults,
          unsupportedFeatures: mergeFeatures(...childResults.map((c) => c.unsupportedFeatures)),
        };
      }
      const minConf =
        childResults.length > 0
          ? Math.min(...childResults.map((c) => c.confidence))
          : DEFAULT_SKELETON_CONFIDENCE;
      const ev = weakestEvidence(childResults.map((c) => c.evidenceLevel));
      return {
        matched: true,
        confidence: minConf,
        evidenceLevel: ev,
        reason: "noneOf_satisfied",
        expressionKind: "noneOf",
        childResults,
        unsupportedFeatures: mergeFeatures(...childResults.map((c) => c.unsupportedFeatures)),
      };
    }

    case "not": {
      const childResults = [walk(expr.child, context)];
      const inner = childResults[0];
      if (isUnresolved(inner)) {
        return {
          matched: false,
          confidence: DEFAULT_SKELETON_CONFIDENCE,
          reason: "unresolved_not_child",
          expressionKind: "not",
          childResults,
          unresolved: true,
          unsupportedFeatures: mergeFeatures(["not_unresolved_child"], inner.unsupportedFeatures),
        };
      }
      const matched = !inner.matched;
      return {
        matched,
        confidence: DEFAULT_SKELETON_CONFIDENCE,
        evidenceLevel: inner.evidenceLevel,
        reason: matched ? "not_inverted_to_true" : "not_inverted_to_false",
        expressionKind: "not",
        childResults,
        unsupportedFeatures: mergeFeatures(...childResults.map((c) => c.unsupportedFeatures)),
      };
    }
  }
}

/**
 * Recursive structural evaluator for `RuleExpression` (8.2C-2).
 *
 * - Boolean ops: `allOf`, `anyOf`, `noneOf`, `not` recurse into children.
 * - Terminals: resolved **only** via `context.terminalResults[terminalKey]` or `context.resolveTerminal`
 *   — never from document text, regex, or OCR.
 *
 * Without `context`, every terminal is **unresolved** (`matched: false`, `unresolved: true`).
 */
export function evaluateRuleExpression(
  expr: RuleExpression,
  context?: RuleExpressionEvaluationContext,
): RuleEvaluationResult {
  return walk(expr, context);
}
