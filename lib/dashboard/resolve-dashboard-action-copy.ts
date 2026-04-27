import type { DashboardAction } from "@/lib/dashboard/get-dashboard-actions";
import { resolveKnowledgeDictString } from "@/lib/dashboard/resolve-knowledge-dict-string";
import type { Dict } from "@/lib/i18n";
import { reportMissingI18nKey } from "@/lib/i18n/missing-key-registry";

/**
 * Source-of-truth boundary:
 * dashboard actions carry knowledge keys; render/response layers resolve those keys
 * against the active locale. Generic UI labels stay in the dashboard/chat dictionaries.
 */
function withNonEmptyFallback(value: string | null | undefined, fallback: string): string {
  if (typeof value !== "string") return fallback;
  return value.trim().length > 0 ? value : fallback;
}

export function safeT(
  t: Dict,
  key: string | null | undefined,
  fallback: string,
  context?: string,
): string {
  if (!key || key.trim().length === 0) {
    if (context?.startsWith("critical:")) {
      reportMissingI18nKey("<missing>", context);
    }
    return fallback;
  }
  const value = resolveKnowledgeDictString(t, key);
  if (!value || value === key || value.trim().length === 0) {
    reportMissingI18nKey(key, context ?? "dashboard-action-copy");
    return fallback;
  }
  return value;
}

export function resolveDashboardActionTitle(
  t: Dict,
  action: DashboardAction,
): string {
  const fallbackTitle = withNonEmptyFallback(action.title, "…");
  return safeT(t, action.stepDetails?.titleKey, fallbackTitle, "critical:title");
}

export function resolveDashboardActionDescription(
  t: Dict,
  action: DashboardAction,
): string {
  const fallbackDescription = withNonEmptyFallback(action.description, "");
  return safeT(
    t,
    action.stepDetails?.descriptionKey,
    fallbackDescription,
    "critical:description",
  );
}

export function resolveDashboardActionHint(
  t: Dict,
  action: DashboardAction,
): string {
  return safeT(t, action.stepDetails?.hintKey, "", "optional:hint");
}
