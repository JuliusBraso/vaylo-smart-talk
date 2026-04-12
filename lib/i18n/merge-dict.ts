/** Deep-merge plain object trees (locale patches over English). */
export function deepMergeDict<T extends Record<string, unknown>>(base: T, patch: T): T {
  const out = { ...base };
  for (const k of Object.keys(patch) as (keyof T)[]) {
    const bv = base[k];
    const pv = patch[k];
    if (
      bv !== null &&
      typeof bv === "object" &&
      !Array.isArray(bv) &&
      pv !== null &&
      typeof pv === "object" &&
      !Array.isArray(pv)
    ) {
      out[k] = deepMergeDict(bv as Record<string, unknown>, pv as Record<string, unknown>) as T[keyof T];
    } else if (pv !== undefined) {
      out[k] = pv;
    }
  }
  return out;
}
