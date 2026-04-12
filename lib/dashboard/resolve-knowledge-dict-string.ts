import type { Dict } from "@/lib/i18n";

/**
 * Resolves DB `title_key` / `description_key` values (e.g. `knowledge.steps....`)
 * against optional flat `t.knowledge` entries (keys without `knowledge.` prefix).
 */
export function resolveKnowledgeDictString(
  t: Dict,
  key: string | null | undefined,
): string | null {
  if (key == null || key === "") return null;
  const flat = t.knowledge;
  if (!flat) return null;
  const shortKey = key.startsWith("knowledge.") ? key.slice("knowledge.".length) : key;
  const resolved = flat[shortKey];
  return typeof resolved === "string" && resolved.length > 0 ? resolved : null;
}
