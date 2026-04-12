/**
 * Drift detection helpers: flatten locale dicts to dot-path string leaves and compare to English.
 * Used by `scripts/sync-i18n.ts` (CI / local guard).
 */

export function isPlainObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

/**
 * Collects dot-paths for every string leaf under `obj`.
 * Keys that contain dots (e.g. `knowledge["steps.foo"]`) become `prefix.steps.foo`.
 */
export function flattenStringLeaves(
  obj: unknown,
  prefixParts: string[],
  out: Map<string, string>,
): void {
  if (!isPlainObject(obj)) return;
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string") {
      out.set([...prefixParts, k].join("."), v);
    } else if (isPlainObject(v)) {
      flattenStringLeaves(v, [...prefixParts, k], out);
    }
  }
}

export function getFlattenForScope(
  dict: Record<string, unknown>,
  scope: string | undefined,
): Map<string, string> {
  const out = new Map<string, string>();
  if (!scope) {
    flattenStringLeaves(dict, [], out);
    return out;
  }
  const root = dict[scope];
  flattenStringLeaves(root ?? {}, [scope], out);
  return out;
}

export type DriftResult = {
  missing: string[];
  stale: string[];
};

export function compareFlattens(
  base: Map<string, string>,
  target: Map<string, string>,
): DriftResult {
  const missing: string[] = [];
  const stale: string[] = [];
  for (const k of base.keys()) {
    if (!target.has(k)) missing.push(k);
  }
  for (const k of target.keys()) {
    if (!base.has(k)) stale.push(k);
  }
  missing.sort();
  stale.sort();
  return { missing, stale };
}

export function isKnowledgeOnlyPaths(paths: string[]): boolean {
  return paths.length > 0 && paths.every((p) => p === "knowledge" || p.startsWith("knowledge."));
}

/** Dot path under `knowledge.` → flat key inside `knowledge` record. */
export function knowledgePathToFlatKey(path: string): string | null {
  if (path === "knowledge") return "";
  if (!path.startsWith("knowledge.")) return null;
  return path.slice("knowledge.".length);
}
