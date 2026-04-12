import type { LiveSituation } from "@/lib/vaylo/live-situation";

/**
 * Strict "missing insurance" for critical blockers / scoring: only explicit false.
 * Unknown (undefined) is NOT treated as uninsured — avoids conflating "not refined" with "missing".
 */
export function isHealthInsuranceMissing(live: LiveSituation): boolean {
  return live.hasHealthInsurance === false;
}

/**
 * Bank is a critical gap when:
 * - explicitly no account (`has_bank_account === false` in DB), or
 * - user declared health insurance (`true`) but bank is not explicitly confirmed (`true`).
 *
 * The second case fixes profile drift where `has_bank_account` is still null while
 * `has_health_insurance` is true: the UI often shows "bank missing" but the engine
 * previously treated null as "no blocker", letting insurance-themed DNA cards win.
 */
export function isBankAccountCriticalGap(live: LiveSituation): boolean {
  if (live.hasBankAccount === false) return true;
  if (live.hasHealthInsurance === true && live.hasBankAccount !== true) {
    return true;
  }
  return false;
}
