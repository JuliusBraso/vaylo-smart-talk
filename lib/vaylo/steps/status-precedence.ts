import type { UserStepStatus } from "./types";

/** Canonical: verified > completed > in_progress > eligible > blocked > not_applicable */
export function statusRank(s: UserStepStatus): number {
  switch (s) {
    case "verified":
      return 5;
    case "completed":
      return 4;
    case "in_progress":
      return 3;
    case "eligible":
      return 2;
    case "blocked":
      return 1;
    case "not_applicable":
      return 0;
  }
}

/** Positive if `a` is strictly stronger than `b`. */
export function compareStatus(a: UserStepStatus, b: UserStepStatus): number {
  return statusRank(a) - statusRank(b);
}

/** Returns the stronger of two statuses (never downgrades). */
export function chooseStrongerStatus(a: UserStepStatus, b: UserStepStatus): UserStepStatus {
  return statusRank(a) >= statusRank(b) ? a : b;
}

/**
 * Merge a proposed transition with an existing stored status.
 * Idempotent: if proposed is weaker, existing wins.
 */
export function mergeWithExistingStatus(
  existing: UserStepStatus | null | undefined,
  proposed: UserStepStatus,
): UserStepStatus {
  if (existing == null) return proposed;
  return chooseStrongerStatus(existing, proposed);
}
