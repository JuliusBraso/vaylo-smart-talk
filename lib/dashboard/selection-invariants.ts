/**
 * When any critical dashboard cards are present, they must occupy the leading indices
 * with no interleaving of non-critical actions (critical blocker contract).
 */
export function criticalBlockersLeadWhenPresent(actions: { id: string }[]): boolean {
  let seenNonCritical = false;
  for (const a of actions) {
    const isCrit = a.id.startsWith("critical-");
    if (isCrit && seenNonCritical) return false;
    if (!isCrit) seenNonCritical = true;
  }
  return true;
}
