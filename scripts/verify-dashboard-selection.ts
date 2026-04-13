/**
 * Deterministic checks for Phase 3.5 step-first dashboard selection (no test runner dependency).
 * Run: npm run verify:dashboard-selection
 */
import assert from "node:assert/strict";
import {
  dashboardNextStepSlotRank,
  selectStepFirstNonCriticalFromWide,
} from "@/lib/dashboard/step-first-non-critical-selection";
import { criticalBlockersLeadWhenPresent } from "@/lib/dashboard/selection-invariants";
import type { GetUserStepStateResult, ResolvedUserStepState } from "@/lib/vaylo/steps/types";

function stepStateWith(
  steps: Record<string, Partial<ResolvedUserStepState> & { status: ResolvedUserStepState["status"] }>,
): GetUserStepStateResult {
  const full: GetUserStepStateResult["steps"] = {};
  for (const [id, partial] of Object.entries(steps)) {
    full[id] = {
      stepId: id,
      topicId: "t",
      slug: id,
      actionId: null,
      source: "system",
      evidence: {
        hasConfirmedProof: false,
        hasLegacyCompletedAction: false,
        dependencyStepIds: [],
        blockedByStepIds: [],
      },
      ...partial,
    } as ResolvedUserStepState;
  }
  return {
    steps: full,
    summary: { totalSteps: 0, blocked: 0, eligible: 0, in_progress: 0, completed: 0, verified: 0 },
  };
}

// --- Case A: critical ordering invariant helper ---
assert.equal(criticalBlockersLeadWhenPresent([{ id: "critical-health" }, { id: "cv" }]), true);
assert.equal(criticalBlockersLeadWhenPresent([{ id: "cv" }, { id: "critical-health" }]), false);

// --- Case B: eligible deep in wide list enters Top 3 after step-first ---
const catalogB = new Map<string, string>([
  ["a", "s-a"],
  ["b", "s-b"],
  ["c", "s-c"],
  ["d", "s-d"],
  ["e", "s-e"],
]);
const stB = stepStateWith({
  "s-a": { status: "completed" },
  "s-b": { status: "completed" },
  "s-c": { status: "completed" },
  "s-d": { status: "eligible" },
  "s-e": { status: "blocked" },
});
const wideB = [
  { id: "a" },
  { id: "b" },
  { id: "c" },
  { id: "d" },
  { id: "e" },
];
const outB = selectStepFirstNonCriticalFromWide(wideB, 3, catalogB, stB);
assert.deepEqual(
  outB.result.map((x) => x.id),
  ["d", "e", "a"],
  "eligible (d) should lead though scorer order had it fourth",
);

// --- Case C: no eligible — unmapped wins over completed mapped (rank 35 vs 80) ---
const catalogC = new Map<string, string>([
  ["u", "s-u"],
  ["x", "s-x"],
]);
const stC = stepStateWith({
  "s-u": { status: "completed" },
  "s-x": { status: "completed" },
});
const wideC = [{ id: "plain-unmapped" }, { id: "u" }, { id: "x" }];
const outC = selectStepFirstNonCriticalFromWide(wideC, 2, catalogC, stC);
assert.deepEqual(outC.result.map((x) => x.id), ["plain-unmapped", "u"]);

// --- Case D: verified should not sort before eligible / unmapped ---
const catalogD = new Map<string, string>([
  ["v", "s-v"],
  ["e", "s-e"],
  ["n", "s-n"],
]);
const stD = stepStateWith({
  "s-v": { status: "verified" },
  "s-e": { status: "eligible" },
  "s-n": { status: "completed" },
});
assert.ok(dashboardNextStepSlotRank({ id: "e" }, catalogD, stD) < dashboardNextStepSlotRank({ id: "v" }, catalogD, stD));
const wideD = [{ id: "v" }, { id: "e" }, { id: "n" }];
const outD = selectStepFirstNonCriticalFromWide(wideD, 2, catalogD, stD);
assert.deepEqual(outD.result.map((x) => x.id), ["e", "v"]);

// --- Case E: blocked ranks after eligible ---
const catalogE = new Map<string, string>([
  ["blk", "s-blk"],
  ["elig", "s-elig"],
]);
const stE = stepStateWith({
  "s-blk": { status: "blocked" },
  "s-elig": { status: "eligible" },
});
assert.ok(
  dashboardNextStepSlotRank({ id: "elig" }, catalogE, stE) < dashboardNextStepSlotRank({ id: "blk" }, catalogE, stE),
);
const wideE = [{ id: "blk" }, { id: "elig" }];
const outE = selectStepFirstNonCriticalFromWide(wideE, 2, catalogE, stE);
assert.deepEqual(outE.result.map((x) => x.id), ["elig", "blk"]);

console.log("verify-dashboard-selection: all checks passed.");
