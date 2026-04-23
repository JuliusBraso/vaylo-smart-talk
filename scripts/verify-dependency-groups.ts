import { evaluateGroupedDependencies } from "@/lib/vaylo/steps/dependency-groups";
import type { ResolvedUserStepState } from "@/lib/vaylo/steps/types";

function mkResolved(
  stepId: string,
  status: ResolvedUserStepState["status"],
  opts?: Partial<ResolvedUserStepState>,
): ResolvedUserStepState {
  return {
    stepId,
    topicId: "t",
    slug: stepId,
    actionId: null,
    isApplicable: true,
    status,
    source: "system",
    evidence: {
      hasConfirmedProof: false,
      hasLegacyCompletedAction: false,
      dependencyStepIds: [],
      blockedByStepIds: [],
    },
    ...(opts ?? {}),
  };
}

function assertEqual(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    throw new Error(`[verify-dependency-groups] ${name} failed\nactual:   ${a}\nexpected: ${e}`);
  }
}

// ---------------------------------------------------------------------------
// Case A — legacy linear dependency (no groups): unchanged AND semantics
// ---------------------------------------------------------------------------
{
  const resolvedByStepId: Record<string, ResolvedUserStepState> = {
    A: mkResolved("A", "completed"),
  };
  const r = evaluateGroupedDependencies({
    deps: [{ stepId: "C", dependsOnStepId: "A", dependencyGroup: null }],
    resolvedByStepId,
  });
  assertEqual("A (legacy satisfied)", r.blockedByStepIds, []);
}

// ---------------------------------------------------------------------------
// Case B — OR group satisfied by first branch
// ---------------------------------------------------------------------------
{
  const resolvedByStepId: Record<string, ResolvedUserStepState> = {
    A: mkResolved("A", "completed"),
    B: mkResolved("B", "blocked"),
  };
  const r = evaluateGroupedDependencies({
    deps: [
      { stepId: "C", dependsOnStepId: "A", dependencyGroup: "g1" },
      { stepId: "C", dependsOnStepId: "B", dependencyGroup: "g1" },
    ],
    resolvedByStepId,
  });
  assertEqual("B (or satisfied by A)", r.blockedByStepIds, []);
}

// ---------------------------------------------------------------------------
// Case C — OR group satisfied by second branch
// ---------------------------------------------------------------------------
{
  const resolvedByStepId: Record<string, ResolvedUserStepState> = {
    A: mkResolved("A", "blocked"),
    B: mkResolved("B", "verified"),
  };
  const r = evaluateGroupedDependencies({
    deps: [
      { stepId: "C", dependsOnStepId: "A", dependencyGroup: "g1" },
      { stepId: "C", dependsOnStepId: "B", dependencyGroup: "g1" },
    ],
    resolvedByStepId,
  });
  assertEqual("C (or satisfied by B)", r.blockedByStepIds, []);
}

// ---------------------------------------------------------------------------
// Case D — no branch satisfied → blocked
// ---------------------------------------------------------------------------
{
  const resolvedByStepId: Record<string, ResolvedUserStepState> = {
    A: mkResolved("A", "eligible"),
    B: mkResolved("B", "blocked"),
  };
  const r = evaluateGroupedDependencies({
    deps: [
      { stepId: "C", dependsOnStepId: "A", dependencyGroup: "g1" },
      { stepId: "C", dependsOnStepId: "B", dependencyGroup: "g1" },
    ],
    resolvedByStepId,
  });
  assertEqual("D (or unsatisfied)", r.blockedDependencyGroups, { g1: ["A", "B"] });
  assertEqual("D (blockedBy includes members)", r.blockedByStepIds, ["A", "B"]);
}

// ---------------------------------------------------------------------------
// Case E — branch is not_applicable (criteria_not_met) → counts as satisfied
// ---------------------------------------------------------------------------
{
  const resolvedByStepId: Record<string, ResolvedUserStepState> = {
    A: mkResolved("A", "not_applicable", { isApplicable: false, applicabilityReason: "criteria_not_met" }),
    B: mkResolved("B", "blocked"),
  };
  const r = evaluateGroupedDependencies({
    deps: [
      { stepId: "C", dependsOnStepId: "A", dependencyGroup: "g1" },
      { stepId: "C", dependsOnStepId: "B", dependencyGroup: "g1" },
    ],
    resolvedByStepId,
  });
  assertEqual("E (not_applicable criteria_not_met satisfies)", r.blockedByStepIds, []);
}

// ---------------------------------------------------------------------------
// Case F — branch not_applicable due to missing_data → MUST NOT satisfy
// ---------------------------------------------------------------------------
{
  const resolvedByStepId: Record<string, ResolvedUserStepState> = {
    A: mkResolved("A", "not_applicable", { isApplicable: false, applicabilityReason: "missing_data" }),
    B: mkResolved("B", "blocked"),
  };
  const r = evaluateGroupedDependencies({
    deps: [
      { stepId: "C", dependsOnStepId: "A", dependencyGroup: "g1" },
      { stepId: "C", dependsOnStepId: "B", dependencyGroup: "g1" },
    ],
    resolvedByStepId,
  });
  assertEqual("F (missing_data must not satisfy)", r.blockedDependencyGroups, { g1: ["A", "B"] });
}

console.log("[verify-dependency-groups] ok");

