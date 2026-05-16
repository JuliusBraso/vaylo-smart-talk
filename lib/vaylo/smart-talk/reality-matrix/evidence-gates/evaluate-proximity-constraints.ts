import type {
  ProximityConstraint,
  ProximityEvaluationResult,
  ProximityObservation,
} from "./proximity-types";

import { DEFAULT_SKELETON_CONFIDENCE } from "./constants";

const SKELETON_UNSUPPORTED = ["proximity_skeleton_v1_manual_only"] as const;

function clamp01(n: number): number {
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

function trimId(s: string): string {
  return typeof s === "string" ? s.trim() : "";
}

export interface EvaluateProximityConstraintsParams {
  readonly constraints: readonly ProximityConstraint[];
  readonly observations: readonly ProximityObservation[];
}

/**
 * **Skeleton** proximity check (8.2C-6): exact equality on `sourceCueId`, `targetCueId`, and
 * `relationship`. When `ProximityConstraint.anchorType` is set, the observation must declare the
 * same anchor type. No `documentText`, distances, OCR, tokenization, or layout inference.
 */
export function evaluateProximityConstraints(
  params: EvaluateProximityConstraintsParams,
): ProximityEvaluationResult[] {
  const obs = params.observations
    .map((o) => ({
      sourceCueId: trimId(o.sourceCueId),
      targetCueId: trimId(o.targetCueId),
      relationship: o.relationship,
      anchorType: o.anchorType,
      confidence:
        typeof o.confidence === "number" && Number.isFinite(o.confidence) ? clamp01(o.confidence) : undefined,
    }))
    .filter((o) => o.sourceCueId.length > 0 && o.targetCueId.length > 0);

  const out: ProximityEvaluationResult[] = [];

  for (const raw of params.constraints) {
    const id = trimId(raw.id);
    if (!id) {
      out.push({
        constraintId: "",
        matched: false,
        confidence: DEFAULT_SKELETON_CONFIDENCE,
        reason: "empty_constraint_id",
        unsupportedFeatures: [...SKELETON_UNSUPPORTED, "empty_constraint_id"],
      });
      continue;
    }

    const sourceCueId = trimId(raw.sourceCueId);
    const targetCueId = trimId(raw.targetCueId);
    if (!sourceCueId || !targetCueId) {
      out.push({
        constraintId: id,
        matched: false,
        confidence: DEFAULT_SKELETON_CONFIDENCE,
        reason: "empty_constraint_cue_reference",
        unsupportedFeatures: [...SKELETON_UNSUPPORTED, "empty_constraint_cue_reference"],
      });
      continue;
    }

    const candidates = obs.filter((o) => {
      if (o.sourceCueId !== sourceCueId || o.targetCueId !== targetCueId || o.relationship !== raw.relationship) {
        return false;
      }
      if (raw.anchorType !== undefined) {
        return o.anchorType === raw.anchorType;
      }
      return true;
    });

    if (candidates.length === 0) {
      out.push({
        constraintId: id,
        matched: false,
        confidence: DEFAULT_SKELETON_CONFIDENCE,
        reason: "no_matching_manual_observation",
        unsupportedFeatures: [...SKELETON_UNSUPPORTED],
      });
      continue;
    }

    const confidences = candidates
      .map((o) => o.confidence)
      .filter((c): c is number => typeof c === "number" && Number.isFinite(c));
    const confidence = confidences.length > 0 ? Math.max(...confidences) : DEFAULT_SKELETON_CONFIDENCE;

    out.push({
      constraintId: id,
      matched: true,
      confidence,
      reason: "manual_relationship_match",
      unsupportedFeatures: [...SKELETON_UNSUPPORTED],
    });
  }

  return out;
}
