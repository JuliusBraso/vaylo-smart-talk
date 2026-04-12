import type { Dict } from "@/lib/i18n";
import { getValueAtPath } from "@/lib/i18n/path-value";

/**
 * Resolves DB `title_key` / `description_key` values (e.g. `knowledge.steps....`)
 * against `t.knowledge`.
 *
 * English uses **flat** keys on the record (`"steps.foo.title"`). DB overlays from
 * `applyFlatStringValues` use **dot paths** and nest as `knowledge.steps.foo.title`.
 * Prefer nested (translated) values, then the flat-key fallback (often still English).
 */
export function resolveKnowledgeDictString(
  t: Dict,
  key: string | null | undefined,
): string | null {
  if (key == null || key === "") return null;
  const flat = t.knowledge;
  if (!flat) return null;
  const shortKey = key.startsWith("knowledge.") ? key.slice("knowledge.".length) : key;

  const nested = getValueAtPath(flat, shortKey);
  if (typeof nested === "string" && nested.trim().length > 0) {
    return nested;
  }

  const direct = (flat as Record<string, unknown>)[shortKey];
  return typeof direct === "string" && direct.length > 0 ? direct : null;
}
