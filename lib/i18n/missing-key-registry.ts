const REGISTRY_KEY = "__vayloMissingI18nKeys";

type MissingKeyRegistryGlobal = typeof globalThis & {
  [REGISTRY_KEY]?: Set<string>;
};

function registry(): Set<string> {
  const g = globalThis as MissingKeyRegistryGlobal;
  g[REGISTRY_KEY] ??= new Set<string>();
  return g[REGISTRY_KEY];
}

function formatEntry(key: string, context?: string): string {
  return context ? `${context}:${key}` : key;
}

export function reportMissingI18nKey(key: string, context?: string): void {
  if (process.env.NODE_ENV !== "development") return;
  const normalizedKey = key.trim();
  if (!normalizedKey) return;

  const entry = formatEntry(normalizedKey, context);
  const missing = registry();
  if (missing.has(entry)) return;

  missing.add(entry);
  console.warn("[i18n] Missing key:", normalizedKey, context ? { context } : undefined);
}

export function getMissingI18nKeys(): string[] {
  if (process.env.NODE_ENV !== "development") return [];
  return [...registry()].sort();
}
