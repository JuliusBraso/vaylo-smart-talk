/**
 * Read a leaf value from a nested plain object using dot-separated `path`.
 */
export function getValueAtPath(root: unknown, path: string): unknown {
  const parts = path.split(".").filter(Boolean);
  let cur: unknown = root;
  for (const p of parts) {
    if (cur === null || typeof cur !== "object" || Array.isArray(cur)) return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}

/**
 * Immutable set of a leaf value (clones along the path).
 */
export function setValueAtPath<T extends Record<string, unknown>>(
  root: T,
  path: string,
  value: string,
): T {
  const parts = path.split(".").filter(Boolean);
  if (parts.length === 0) return root;

  const clone = structuredClone(root) as Record<string, unknown>;
  let cur: Record<string, unknown> = clone;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i]!;
    const next = cur[p];
    if (next === null || typeof next !== "object" || Array.isArray(next)) {
      cur[p] = {};
    } else {
      cur[p] = structuredClone(next) as Record<string, unknown>;
    }
    cur = cur[p] as Record<string, unknown>;
  }
  cur[parts[parts.length - 1]!] = value;
  return clone as T;
}

/**
 * Deep-clones `root` once, then applies dot-path string updates (mutating the clone).
 */
export function applyFlatStringValues(root: Record<string, unknown>, flat: Record<string, string>): void {
  for (const [path, value] of Object.entries(flat)) {
    const parts = path.split(".").filter(Boolean);
    if (parts.length === 0) continue;
    let cur: Record<string, unknown> = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i]!;
      let next = cur[p];
      if (next === null || typeof next !== "object" || Array.isArray(next)) {
        const o: Record<string, unknown> = {};
        cur[p] = o;
        cur = o;
      } else {
        cur = next as Record<string, unknown>;
      }
    }
    cur[parts[parts.length - 1]!] = value;
  }
}
