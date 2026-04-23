import type { ResolvedUserStepState } from "./types";

export type KnowledgeStepDependencyEdge = {
  stepId: string;
  dependsOnStepId: string;
  dependencyGroup: string | null;
};

export type GroupedDependencyEvaluation = {
  /** Step ids that are blocking due to standalone requirements or unsatisfied groups. */
  blockedByStepIds: string[];
  /** Which OR-groups were unsatisfied (groupId -> member dep step ids). */
  blockedDependencyGroups: Record<string, string[]>;
};

export function dependencySatisfied(dep: ResolvedUserStepState): boolean {
  return (
    dep.status === "completed" ||
    dep.status === "verified" ||
    (dep.status === "not_applicable" && dep.applicabilityReason === "criteria_not_met")
  );
}

/**
 * Evaluate dependencies with semantics:
 * - ungrouped edges are required individually (AND)
 * - grouped edges are OR within the same group
 * - groups combine as AND across groups
 */
export function evaluateGroupedDependencies(params: {
  deps: KnowledgeStepDependencyEdge[];
  resolvedByStepId: Record<string, ResolvedUserStepState | undefined>;
}): GroupedDependencyEvaluation {
  const { deps, resolvedByStepId } = params;

  const standalone: string[] = [];
  const groups = new Map<string, string[]>();

  for (const e of deps) {
    if (!e.dependsOnStepId) continue;
    if (!e.dependencyGroup) {
      standalone.push(e.dependsOnStepId);
      continue;
    }
    const prev = groups.get(e.dependencyGroup) ?? [];
    prev.push(e.dependsOnStepId);
    groups.set(e.dependencyGroup, prev);
  }

  const blockedBy: string[] = [];
  const blockedGroups: Record<string, string[]> = {};

  // Standalone required deps (legacy semantics)
  for (const depId of [...new Set(standalone)].sort()) {
    const dep = resolvedByStepId[depId];
    if (!dep) {
      blockedBy.push(depId);
      continue;
    }
    if (!dependencySatisfied(dep)) blockedBy.push(depId);
  }

  // OR groups
  const groupIds = [...groups.keys()].sort();
  for (const groupId of groupIds) {
    const memberIds = [...new Set(groups.get(groupId) ?? [])].filter(Boolean).sort();
    if (memberIds.length === 0) continue;

    let satisfied = false;
    for (const depId of memberIds) {
      const dep = resolvedByStepId[depId];
      if (dep && dependencySatisfied(dep)) {
        satisfied = true;
        break;
      }
    }

    if (!satisfied) {
      blockedGroups[groupId] = memberIds;
      // Keep blockedBy explainable without changing API: include members as blockers.
      blockedBy.push(...memberIds);
    }
  }

  return {
    blockedByStepIds: [...new Set(blockedBy)].sort(),
    blockedDependencyGroups: blockedGroups,
  };
}

