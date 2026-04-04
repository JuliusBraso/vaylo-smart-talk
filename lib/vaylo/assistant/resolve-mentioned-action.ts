import type { DashboardAction } from "@/lib/dashboard/get-dashboard-actions";
import {
  ASSISTANT_INPUT_ACTION_ORDER,
  getSortedPhrasesForAction,
} from "@/lib/vaylo/assistant/assistant-input-lexicon";

/** Canonical ids aligned with dashboard + guides (not necessarily the critical-* id string). */
const CRITICAL_ID: Record<string, string> = {
  "health-insurance": "critical-health",
  cv: "critical-cv",
  arbeitsagentur: "critical-arbeitsagentur",
  "bank-account": "critical-bank",
  "steuer-id": "critical-steuer",
};

function normalizeMessage(raw: string): string {
  return raw.toLowerCase().normalize("NFC");
}

/**
 * Returns a canonical action id if the message explicitly mentions a known topic; otherwise null.
 * Scans sk/de/en phrase buckets in fixed action order; within each action, longer phrases first.
 */
export function tryResolveMentionedCanonicalActionId(message: string): string | null {
  const m = normalizeMessage(message.trim());
  if (!m) return null;

  for (const canonicalId of ASSISTANT_INPUT_ACTION_ORDER) {
    for (const phrase of getSortedPhrasesForAction(canonicalId)) {
      if (m.includes(phrase)) {
        return canonicalId;
      }
    }
  }

  if (m === "cv" || m.startsWith("cv ") || m.endsWith(" cv") || m.includes(" cv ")) {
    return "cv";
  }

  return null;
}

/**
 * Resolves a canonical id to an action present in the current list (base or critical-* id).
 */
export function findActionByCanonicalId(
  actions: DashboardAction[],
  canonicalId: string
): DashboardAction | undefined {
  const direct = actions.find((a) => a.id === canonicalId);
  if (direct) return direct;

  const critical =
    canonicalId in CRITICAL_ID
      ? CRITICAL_ID[canonicalId as keyof typeof CRITICAL_ID]
      : undefined;
  if (critical) {
    return actions.find((a) => a.id === critical);
  }

  return undefined;
}
