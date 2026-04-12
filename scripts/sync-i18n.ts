/**
 * Locale drift guard: compare non-English locale dicts to English (runtime DICTS).
 *
 * Usage:
 *   npm run i18n:sync
 *   npm run i18n:check        # CI: --ci --scope full (explicit; see package.json)
 *   npm run i18n:check:strict # CI: all Dict top-level scopes vs baseline
 *   npm run i18n:baseline
 *   npm run i18n:baseline:all # snapshot all dict scopes (keeps e.g. scopes.full)
 *
 * See --help for full flags.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  type DriftResult,
  compareFlattens,
  getFlattenForScope,
  isKnowledgeOnlyPaths,
  knowledgePathToFlatKey,
} from "../lib/i18n/sync-i18n-core";
import { DICTS, I18N_BASE_LOCALE, LOCALES, type Locale } from "../lib/i18n/index";

const ANCHOR_BEFORE_PREMIUM = "\n  },\n\n  premium: {";
const BASELINE_PATH = join(process.cwd(), "i18n-baseline.json");
/** Current on-disk baseline schema (v2: scopes + metadata). */
const BASELINE_FORMAT_VERSION = 2;

/** Synthetic baseline section for the whole dictionary (not a `Dict` top-level key). */
const SCOPE_FULL = "full";

/** Map CLI / baseline section name → subtree passed to `getFlattenForScope`. */
function dictCompareScope(cliScope: string | undefined): string | undefined {
  if (cliScope === undefined || cliScope === SCOPE_FULL) return undefined;
  return cliScope;
}

/** Normalized in-memory baseline: always `scopes[scopeName][locale]`. */
export type NormalizedBaseline = {
  formatVersion: number;
  generatedAt?: string;
  baseLocale: string;
  scopes: Record<string, Record<string, string[]>>;
};

type CliOptions = {
  scope?: string;
  json: boolean;
  fix: boolean;
  empty: boolean;
  ci: boolean;
  ciStrict: boolean;
  generateBaseline: boolean;
  generateBaselineAll: boolean;
};

function parseArgs(argv: string[]): CliOptions | "help" {
  const opts: CliOptions = {
    json: false,
    fix: false,
    empty: false,
    ci: false,
    ciStrict: false,
    generateBaseline: false,
    generateBaselineAll: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") return "help";
    if (a === "--json") {
      opts.json = true;
      continue;
    }
    if (a === "--fix") {
      opts.fix = true;
      continue;
    }
    if (a === "--empty") {
      opts.empty = true;
      continue;
    }
    if (a === "--ci") {
      opts.ci = true;
      continue;
    }
    if (a === "--ci-strict") {
      opts.ciStrict = true;
      continue;
    }
    if (a === "--generate-baseline") {
      opts.generateBaseline = true;
      continue;
    }
    if (a === "--generate-baseline-all") {
      opts.generateBaselineAll = true;
      continue;
    }
    if (a === "--scope") {
      const v = argv[++i];
      if (!v || v.startsWith("-")) return "help";
      opts.scope = v;
      continue;
    }
    console.error(`Unknown argument: ${a}`);
    return "help";
  }
  return opts;
}

function targetLocales(): Locale[] {
  return LOCALES.filter((l) => l !== I18N_BASE_LOCALE) as Locale[];
}

function expectedLocaleList(): string[] {
  return [...targetLocales()].sort();
}

function compareScopeForSectionKey(sectionKey: string): string | undefined {
  return sectionKey === SCOPE_FULL ? undefined : sectionKey;
}

function baselineSectionKey(scope: string | undefined): string {
  return scope === undefined ? SCOPE_FULL : scope;
}

function topLevelKeys(): string[] {
  return Object.keys(DICTS[I18N_BASE_LOCALE] as object).sort();
}

function localeFilePath(locale: Locale): string {
  return join(process.cwd(), "lib", "i18n", "locales", `${locale}.ts`);
}

function runCompare(scope: string | undefined): {
  baseFlat: Map<string, string>;
  byLocale: Record<string, DriftResult>;
} {
  const base = DICTS[I18N_BASE_LOCALE] as unknown as Record<string, unknown>;
  const baseFlat = getFlattenForScope(base, scope);

  const byLocale: Record<string, DriftResult> = {};
  for (const loc of LOCALES) {
    if (loc === I18N_BASE_LOCALE) continue;
    const patch = DICTS[loc] as unknown as Record<string, unknown>;
    const targetFlat = getFlattenForScope(patch, scope);
    byLocale[loc] = compareFlattens(baseFlat, targetFlat);
  }
  return { baseFlat, byLocale };
}

function summarize(byLocale: Record<string, DriftResult>): {
  hasDrift: boolean;
  totalMissing: number;
  totalStale: number;
} {
  let hasDrift = false;
  let totalMissing = 0;
  let totalStale = 0;
  for (const loc of LOCALES) {
    if (loc === I18N_BASE_LOCALE) continue;
    const d = byLocale[loc]!;
    if (d.missing.length || d.stale.length) hasDrift = true;
    totalMissing += d.missing.length;
    totalStale += d.stale.length;
  }
  return { hasDrift, totalMissing, totalStale };
}

function writeJsonPatches(
  baseFlat: Map<string, string>,
  byLocale: Record<string, DriftResult>,
  opts: { empty: boolean; scope: string | undefined },
): void {
  const outDir = join(process.cwd(), "lib", "i18n", "generated", "sync-missing");
  mkdirSync(outDir, { recursive: true });

  for (const [loc, drift] of Object.entries(byLocale)) {
    if (drift.missing.length === 0) continue;
    const entries: Record<string, string> = {};
    for (const path of drift.missing) {
      entries[path] = opts.empty ? "" : (baseFlat.get(path) ?? "");
    }
    const payload = {
      version: 1,
      base: I18N_BASE_LOCALE,
      locale: loc,
      scope: opts.scope ?? null,
      placeholder: opts.empty ? "empty" : "en",
      entries,
    };
    writeFileSync(join(outDir, `${loc}.json`), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  }
}

function applyKnowledgeKeysToTs(
  locale: Locale,
  missingPaths: string[],
  baseFlat: Map<string, string>,
  empty: boolean,
): void {
  const filePath = localeFilePath(locale);
  let content = readFileSync(filePath, "utf8");
  const anchorIdx = content.indexOf(ANCHOR_BEFORE_PREMIUM);
  if (anchorIdx === -1) {
    throw new Error(`Anchor not found in ${filePath}`);
  }
  const knowledgeIdx = content.indexOf("knowledge: {");
  if (knowledgeIdx === -1 || knowledgeIdx > anchorIdx) {
    throw new Error(
      `Refusing to edit ${filePath}: no knowledge: { block before premium anchor (add knowledge manually or use JSON patch only).`,
    );
  }

  const lines: string[] = [];
  const sorted = [...missingPaths].filter((p) => p.startsWith("knowledge.")).sort();
  for (const path of sorted) {
    const flatKey = knowledgePathToFlatKey(path);
    if (flatKey === null || flatKey === "") continue;
    const val = empty ? "" : (baseFlat.get(path) ?? "");
    const keyLit = JSON.stringify(flatKey);
    const valLit = JSON.stringify(val);
    lines.push(`    ${keyLit}: ${valLit},`);
  }
  if (lines.length === 0) return;

  const insertion = `\n${lines.join("\n")}`;
  content = content.slice(0, anchorIdx) + insertion + content.slice(anchorIdx);
  writeFileSync(filePath, content, "utf8");
}

function printReport(
  scope: string | undefined,
  byLocale: Record<string, DriftResult>,
  summary: { hasDrift: boolean; totalMissing: number; totalStale: number },
): void {
  console.log(
    `i18n sync guard (base=${I18N_BASE_LOCALE}${scope ? `, scope=${scope}` : ", full dict"})\n`,
  );

  for (const loc of LOCALES) {
    if (loc === I18N_BASE_LOCALE) continue;
    const drift = byLocale[loc]!;
    if (drift.missing.length === 0 && drift.stale.length === 0) {
      console.log(`[${loc}] OK`);
      continue;
    }
    console.log(`[${loc}] missing: ${drift.missing.length}, stale: ${drift.stale.length}`);
    if (drift.missing.length > 0) {
      console.log("  missing:");
      for (const k of drift.missing) console.log(`    - ${k}`);
    }
    if (drift.stale.length > 0) {
      console.log("  stale (not in en; not removed):");
      for (const k of drift.stale) console.log(`    - ${k}`);
    }
  }

  console.log("\n--- summary ---");
  console.log(`locales with drift: ${summary.hasDrift ? "yes" : "no"}`);
  console.log(`total missing key paths: ${summary.totalMissing}`);
  console.log(`total stale key paths: ${summary.totalStale}`);
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

function isLocaleMissingMap(v: unknown): v is Record<string, string[]> {
  if (v === null || typeof v !== "object" || Array.isArray(v)) return false;
  for (const arr of Object.values(v as Record<string, unknown>)) {
    if (!isStringArray(arr)) return false;
  }
  return true;
}

/** Sort every string[] in a locale map; ensure all expected locales exist. */
function normalizeScopeSection(m: Record<string, string[]>): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const loc of targetLocales()) {
    const arr = m[loc];
    out[loc] = arr && isStringArray(arr) ? [...arr].sort() : [];
  }
  return out;
}

function parseScopesContainer(raw: unknown): Record<string, Record<string, string[]>> | null {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) return null;
  const scopes: Record<string, Record<string, string[]>> = {};
  for (const [sk, sectionVal] of Object.entries(raw as Record<string, unknown>)) {
    if (!isLocaleMissingMap(sectionVal)) return null;
    scopes[sk] = normalizeScopeSection(sectionVal as Record<string, string[]>);
  }
  return scopes;
}

/**
 * Load baseline from disk: v2 (`scopes` + metadata) or legacy v1 (top-level `full`, …).
 */
function loadNormalizedBaseline(data: unknown): NormalizedBaseline | null {
  if (data === null || typeof data !== "object" || Array.isArray(data)) return null;
  const o = data as Record<string, unknown>;
  const version = o.version;
  if (typeof version !== "number" || version < 1) return null;

  if (o.scopes !== undefined) {
    if (version < BASELINE_FORMAT_VERSION) return null;
    if (typeof o.scopes !== "object" || o.scopes === null || Array.isArray(o.scopes)) return null;
    const scopes = parseScopesContainer(o.scopes);
    if (!scopes || Object.keys(scopes).length === 0) return null;
    const baseLocale = o.baseLocale;
    if (typeof baseLocale !== "string" || !baseLocale.trim()) return null;
    const generatedAt = o.generatedAt;
    return {
      formatVersion: version,
      generatedAt: typeof generatedAt === "string" ? generatedAt : undefined,
      baseLocale,
      scopes,
    };
  }

  // Legacy v1: version + full / knowledge / … at top level
  const scopes: Record<string, Record<string, string[]>> = {};
  for (const [k, v] of Object.entries(o)) {
    if (k === "version") continue;
    if (!isLocaleMissingMap(v)) continue;
    scopes[k] = normalizeScopeSection(v as Record<string, string[]>);
  }
  if (Object.keys(scopes).length === 0) return null;
  return {
    formatVersion: version,
    baseLocale: I18N_BASE_LOCALE,
    scopes,
  };
}

function emptyScopeSection(): Record<string, string[]> {
  const m: Record<string, string[]> = {};
  for (const loc of targetLocales()) {
    m[loc] = [];
  }
  return m;
}

function stableBaselineFilePayload(baseline: NormalizedBaseline): string {
  const sortedScopeNames = Object.keys(baseline.scopes).sort();
  const scopesOut: Record<string, Record<string, string[]>> = {};
  for (const name of sortedScopeNames) {
    const section = baseline.scopes[name] ?? {};
    const locKeys = [...targetLocales()].sort();
    const locOut: Record<string, string[]> = {};
    for (const loc of locKeys) {
      locOut[loc] = [...(section[loc] ?? [])].sort();
    }
    scopesOut[name] = locOut;
  }
  const payload = {
    version: BASELINE_FORMAT_VERSION,
    generatedAt: baseline.generatedAt ?? new Date().toISOString(),
    baseLocale: baseline.baseLocale,
    scopes: scopesOut,
  };
  return `${JSON.stringify(payload, null, 2)}\n`;
}

function readBaselineFromDisk(): NormalizedBaseline | null {
  try {
    const raw = JSON.parse(readFileSync(BASELINE_PATH, "utf8")) as unknown;
    return loadNormalizedBaseline(raw);
  } catch {
    return null;
  }
}

/** Every `Dict` top-level key (used for per-scope baseline + `--ci-strict`). */
function dictTopLevelScopeKeys(): string[] {
  return topLevelKeys();
}

/** Regenerate missing-key snapshot for all `DICTS.en` top-level sections (preserves e.g. `scopes.full`). */
function writeBaselineAllDictScopes(): void {
  let existing = readBaselineFromDisk();
  if (!existing) {
    existing = {
      formatVersion: BASELINE_FORMAT_VERSION,
      baseLocale: I18N_BASE_LOCALE,
      scopes: {},
    };
  }
  const mergedScopes = { ...existing.scopes };
  for (const sk of dictTopLevelScopeKeys()) {
    const { byLocale } = runCompare(sk);
    const section: Record<string, string[]> = emptyScopeSection();
    for (const loc of targetLocales()) {
      section[loc] = [...byLocale[loc]!.missing].sort();
    }
    mergedScopes[sk] = section;
  }
  const out: NormalizedBaseline = {
    formatVersion: BASELINE_FORMAT_VERSION,
    generatedAt: new Date().toISOString(),
    baseLocale: I18N_BASE_LOCALE,
    scopes: mergedScopes,
  };
  writeFileSync(BASELINE_PATH, stableBaselineFilePayload(out), "utf8");
}

function writeBaselineSnapshot(scope: string | undefined, byLocale: Record<string, DriftResult>): void {
  const sectionKey = baselineSectionKey(scope);
  let existing = readBaselineFromDisk();

  if (!existing) {
    existing = {
      formatVersion: BASELINE_FORMAT_VERSION,
      baseLocale: I18N_BASE_LOCALE,
      scopes: {},
    };
  }

  const section: Record<string, string[]> = emptyScopeSection();
  for (const loc of targetLocales()) {
    section[loc] = [...byLocale[loc]!.missing].sort();
  }

  const mergedScopes = { ...existing.scopes, [sectionKey]: section };
  const out: NormalizedBaseline = {
    formatVersion: BASELINE_FORMAT_VERSION,
    generatedAt: new Date().toISOString(),
    baseLocale: I18N_BASE_LOCALE,
    scopes: mergedScopes,
  };

  writeFileSync(BASELINE_PATH, stableBaselineFilePayload(out), "utf8");
}

function scopeKeysSorted(baseline: NormalizedBaseline): string[] {
  return Object.keys(baseline.scopes).sort();
}

/**
 * CI: resolve which baseline section to use.
 * - Multiple sections → require explicit --scope
 * - Single section → default to that section's key (often `full`)
 */
function resolveCiActiveScopeKey(
  baseline: NormalizedBaseline,
  cliScope: string | undefined,
): { ok: true; activeScopeKey: string } | { ok: false; message: string } {
  const keys = scopeKeysSorted(baseline);
  if (keys.length === 0) {
    return { ok: false, message: "[i18n:ci] Baseline has no scopes. Regenerate with: npm run i18n:baseline" };
  }
  if (cliScope !== undefined) {
    if (!keys.includes(cliScope)) {
      return {
        ok: false,
        message: `[i18n:ci] Baseline has no section "${cliScope}". Available: ${keys.join(", ")}`,
      };
    }
    return { ok: true, activeScopeKey: cliScope };
  }
  if (keys.length > 1) {
    return {
      ok: false,
      message: `[i18n:ci] Missing --scope. Baseline contains multiple sections: ${keys.join(", ")}.
Use:
  --scope full
  --scope knowledge
(or run: npm run i18n:baseline -- --scope <name> to reduce sections)`,
    };
  }
  return { ok: true, activeScopeKey: keys[0]! };
}

function validateBaselineHeader(baseline: NormalizedBaseline, prefix: string): string | null {
  if (baseline.baseLocale !== I18N_BASE_LOCALE) {
    return `${prefix} baseline.baseLocale is "${baseline.baseLocale}" but app base is "${I18N_BASE_LOCALE}"`;
  }
  if (typeof baseline.formatVersion !== "number" || baseline.formatVersion < BASELINE_FORMAT_VERSION) {
    return `${prefix} baseline.version must be >= ${BASELINE_FORMAT_VERSION} with top-level "scopes". Upgrade with:
  npm run i18n:baseline -- --scope full
  npm run i18n:baseline:all
(then commit i18n-baseline.json)`;
  }
  return null;
}

function validateBaselineSectionLocales(
  baseline: NormalizedBaseline,
  activeScopeKey: string,
  prefix: string,
): string | null {
  const section = baseline.scopes[activeScopeKey];
  if (!section) {
    return `${prefix} Baseline has no scopes["${activeScopeKey}"]`;
  }

  const expected = expectedLocaleList();
  const actual = Object.keys(section).sort();
  if (expected.length !== actual.length || !expected.every((l, i) => l === actual[i])) {
    return `${prefix} Baseline mismatch for section "${activeScopeKey}":
Expected locales: ${expected.join(", ")}
Found locales:    ${actual.join(", ")}`;
  }

  for (const loc of targetLocales()) {
    if (!isStringArray(section[loc])) {
      return `${prefix} Baseline section "${activeScopeKey}" locale "${loc}" must be a string array`;
    }
  }

  return null;
}

/** Validate baseline for single-scope `--ci`. */
function validateBaselineForCi(baseline: NormalizedBaseline, activeScopeKey: string): string | null {
  const h = validateBaselineHeader(baseline, "[i18n:ci]");
  if (h) return h;
  return validateBaselineSectionLocales(baseline, activeScopeKey, "[i18n:ci]");
}

function getBaselineMissingForLocale(
  baseline: NormalizedBaseline,
  sectionKey: string,
  locale: string,
): Set<string> {
  const arr = baseline.scopes[sectionKey]?.[locale];
  if (!isStringArray(arr)) return new Set();
  return new Set(arr);
}

type CiNewMissing = Record<string, string[]>;

function computeNewMissingKeys(
  baseline: NormalizedBaseline,
  sectionKey: string,
  byLocale: Record<string, DriftResult>,
): CiNewMissing {
  const out: CiNewMissing = {};
  for (const loc of targetLocales()) {
    const allowed = getBaselineMissingForLocale(baseline, sectionKey, loc);
    const drift = byLocale[loc]!;
    const fresh = drift.missing.filter((k) => !allowed.has(k)).sort();
    if (fresh.length > 0) out[loc] = fresh;
  }
  return out;
}

function printCiReport(
  activeScopeKey: string,
  newMissing: CiNewMissing,
  baseline: NormalizedBaseline,
  byLocale: Record<string, DriftResult>,
): { totalNew: number } {
  let totalNew = 0;
  for (const arr of Object.values(newMissing)) totalNew += arr.length;

  if (totalNew === 0) {
    console.log("[i18n:ci] No new missing translations detected");
    console.log(`Scope: ${activeScopeKey}`);
    return { totalNew: 0 };
  }

  console.log("[i18n:ci] New missing keys\n");
  console.log(`Scope: ${activeScopeKey}`);

  for (const loc of Object.keys(newMissing).sort()) {
    const keys = newMissing[loc]!;
    const bCount = getBaselineMissingForLocale(baseline, activeScopeKey, loc).size;
    const cCount = byLocale[loc]!.missing.length;
    console.log(`Locale: ${loc}`);
    console.log(`Baseline: ${bCount} keys`);
    console.log(`Current: ${cCount} keys`);
    console.log("New:");
    for (const k of keys) console.log(`- ${k}`);
    console.log("");
  }

  console.log(`[i18n:ci] Summary: ${totalNew} new missing key(s) across ${Object.keys(newMissing).length} locale(s)`);
  console.log("");
  console.log("To accept these as known debt (updates baseline):");
  console.log(`  npm run i18n:baseline -- --scope ${activeScopeKey}`);

  return { totalNew };
}

type CiStrictScopeNewMissing = Record<string, CiNewMissing>;

/** Every target locale, sorted keys only (CI / PR bot JSON contract). */
function deterministicNewMissing(partial: CiNewMissing): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const loc of targetLocales()) {
    const arr = partial[loc];
    out[loc] = arr ? [...arr].sort() : [];
  }
  return out;
}

function summaryFromLocaleMap(nm: Record<string, string[]>): {
  totalNewKeys: number;
  affectedLocales: number;
} {
  let totalNewKeys = 0;
  let affectedLocales = 0;
  for (const keys of Object.values(nm)) {
    totalNewKeys += keys.length;
    if (keys.length > 0) affectedLocales += 1;
  }
  return { totalNewKeys, affectedLocales };
}

function deterministicNewMissingByScope(allNew: CiStrictScopeNewMissing): Record<string, Record<string, string[]>> {
  const out: Record<string, Record<string, string[]>> = {};
  for (const scopeName of Object.keys(allNew).sort()) {
    out[scopeName] = deterministicNewMissing(allNew[scopeName]!);
  }
  return out;
}

function strictSummaryFromByScope(byScope: Record<string, Record<string, string[]>>): {
  totalNewKeys: number;
  affectedLocales: number;
  affectedScopes: number;
} {
  let totalNewKeys = 0;
  const locWithNew = new Set<string>();
  for (const localeMap of Object.values(byScope)) {
    for (const loc of targetLocales()) {
      const keys = localeMap[loc]!;
      totalNewKeys += keys.length;
      if (keys.length > 0) locWithNew.add(loc);
    }
  }
  return {
    totalNewKeys,
    affectedLocales: locWithNew.size,
    affectedScopes: Object.keys(byScope).length,
  };
}

function runCiStrict(json: boolean): number {
  const baseline = readBaselineFromDisk();
  if (!baseline) {
    if (json) {
      console.log(
        JSON.stringify(
          {
            mode: "ci-strict",
            error: "baseline_missing",
            message: `Missing or unreadable baseline: ${BASELINE_PATH}`,
            exitIntent: 2,
          },
          null,
          2,
        ),
      );
    } else {
      console.error(
        `[i18n:ci-strict] Missing or unreadable baseline: ${BASELINE_PATH}\nCreate with: npm run i18n:baseline:all`,
      );
    }
    return 2;
  }

  const headerErr = validateBaselineHeader(baseline, "[i18n:ci-strict]");
  if (headerErr) {
    if (json) {
      console.log(
        JSON.stringify(
          {
            mode: "ci-strict",
            error: "invalid_baseline_header",
            message: headerErr,
            exitIntent: 2,
          },
          null,
          2,
        ),
      );
    } else {
      console.error(headerErr);
    }
    return 2;
  }

  const dictScopes = dictTopLevelScopeKeys().sort();
  const missingBaseline = dictScopes.filter((s) => baseline.scopes[s] === undefined);
  if (missingBaseline.length > 0) {
    if (json) {
      console.log(
        JSON.stringify(
          {
            mode: "ci-strict",
            error: "missing_baseline_sections",
            missingBaselineSections: missingBaseline,
            exitIntent: 2,
          },
          null,
          2,
        ),
      );
    } else {
      console.error("[i18n:ci-strict] Missing baseline coverage\n");
      for (const s of missingBaseline) {
        console.error(`Scope: ${s}`);
        console.error("→ not present in baseline\n");
        console.error("Fix:");
        console.error(`  npm run i18n:baseline -- --scope ${s}\n`);
      }
      console.error("Or refresh all dict scopes at once:");
      console.error("  npm run i18n:baseline:all\n");
    }
    return 2;
  }

  for (const scopeName of dictScopes) {
    const se = validateBaselineSectionLocales(baseline, scopeName, "[i18n:ci-strict]");
    if (se) {
      if (json) {
        console.log(
          JSON.stringify(
            {
              mode: "ci-strict",
              error: "invalid_baseline_section",
              scope: scopeName,
              message: se,
              exitIntent: 2,
            },
            null,
            2,
          ),
        );
      } else {
        console.error(se);
      }
      return 2;
    }
  }

  const allNew: CiStrictScopeNewMissing = {};
  const details: Record<string, { byLocale: Record<string, DriftResult> }> = {};
  let totalNew = 0;

  for (const scopeName of dictScopes) {
    const { byLocale } = runCompare(scopeName);
    const nm = computeNewMissingKeys(baseline, scopeName, byLocale);
    const c = Object.values(nm).reduce((a, arr) => a + arr.length, 0);
    if (c > 0) {
      allNew[scopeName] = nm;
      details[scopeName] = { byLocale };
      totalNew += c;
    }
  }

  if (totalNew === 0) {
    if (json) {
      const emptySummary = { totalNewKeys: 0, affectedLocales: 0, affectedScopes: 0 };
      console.log(
        JSON.stringify(
          {
            mode: "ci-strict",
            ok: true,
            scopesChecked: dictScopes,
            newMissingByScope: {},
            summary: emptySummary,
            exitIntent: 0,
          },
          null,
          2,
        ),
      );
    } else {
      console.log("[i18n:ci-strict] All scopes validated successfully");
      console.log(`Scopes checked (${dictScopes.length}): ${dictScopes.join(", ")}`);
    }
    return 0;
  }

  if (json) {
    const newMissingByScope = deterministicNewMissingByScope(allNew);
    console.log(
      JSON.stringify(
        {
          mode: "ci-strict",
          ok: false,
          scopesChecked: dictScopes,
          newMissingByScope,
          summary: strictSummaryFromByScope(newMissingByScope),
          exitIntent: 1,
        },
        null,
        2,
      ),
    );
  } else {
    console.error("[i18n:ci-strict] New missing keys\n");
    for (const scopeName of Object.keys(allNew).sort()) {
      const nm = allNew[scopeName]!;
      const byLocale = details[scopeName]!.byLocale;
      console.error(`Scope: ${scopeName}`);
      for (const loc of Object.keys(nm).sort()) {
        const keys = nm[loc]!;
        const bCount = getBaselineMissingForLocale(baseline, scopeName, loc).size;
        const cCount = byLocale[loc]!.missing.length;
        console.error(`  Locale: ${loc}`);
        console.error(`  Baseline: ${bCount} keys`);
        console.error(`  Current: ${cCount} keys`);
        console.error("  New:");
        for (const k of keys) console.error(`  - ${k}`);
      }
      console.error("");
    }
    console.error(
      `[i18n:ci-strict] Summary: ${totalNew} new missing key(s) across ${Object.keys(allNew).length} scope(s)`,
    );
    console.error("");
    console.error("To record as known debt:");
    console.error("  npm run i18n:baseline:all");
    console.error("Or per scope:");
    for (const s of Object.keys(allNew).sort()) {
      console.error(`  npm run i18n:baseline -- --scope ${s}`);
    }
  }

  return 1;
}

function main(): number {
  const parsed = parseArgs(process.argv);
  if (parsed === "help") {
    console.log(`Usage: npx -y tsx@4.19.2 scripts/sync-i18n.ts [options]

Modes:
  (default)        Full drift report; exit 1 if any missing or stale keys
  --ci             Compare NEW missing keys vs i18n-baseline.json (stale ignored).
                   If baseline has multiple scope sections, you MUST pass --scope.
  --ci-strict      Validate EVERY top-level key of DICTS.en: each must exist in baseline.scopes
                   and have no NEW missing keys (do not combine with --scope or --ci).
  --generate-baseline       Update one scopes.* section (use --scope or defaults to full)
  --generate-baseline-all Update ALL dict top-level scopes in baseline (preserves extra keys like "full")

Options:
  --scope <name>   Dict subtree for compare / baseline section (e.g. full, knowledge)
  --json           Machine-readable output (CI: scope, newMissing per locale, summary, exitIntent)
  --fix            Developer only (ignored with --ci / --ci-strict)
  --empty          With --fix, empty placeholders

Baseline file (v2):
  {
    "version": 2,
    "generatedAt": "<ISO8601>",
    "baseLocale": "en",
    "scopes": { "full": { "de": [], "hu": ["key.path"] }, "knowledge": { ... } }
  }

Exit codes (default / --generate-baseline):
  0 success
  1 drift (sync mode)
  2 bad args

Exit codes (--ci):
  0 no new missing keys
  1 new missing keys
  2 invalid args, baseline missing/malformed, scope mismatch, locale mismatch

Exit codes (--ci-strict):
  0 all dict scopes OK vs baseline
  1 new missing keys in any scope
  2 baseline/section missing, locale mismatch, or bad args`);
    return 2;
  }

  let { scope, json, fix, empty, ci, ciStrict, generateBaseline, generateBaselineAll } = parsed;

  if (ci && ciStrict) {
    console.error("[i18n:ci] Cannot combine --ci with --ci-strict");
    return 2;
  }
  if (ciStrict && (generateBaseline || generateBaselineAll)) {
    console.error("[i18n:ci-strict] Cannot combine with --generate-baseline / --generate-baseline-all");
    return 2;
  }
  if (generateBaseline && generateBaselineAll) {
    console.error("Cannot combine --generate-baseline with --generate-baseline-all");
    return 2;
  }
  if (generateBaselineAll && scope !== undefined) {
    console.error("Do not pass --scope with --generate-baseline-all (updates every dict top-level scope)");
    return 2;
  }
  if (ci && generateBaseline) {
    console.error("[i18n:ci] Cannot combine --ci with --generate-baseline");
    return 2;
  }
  if (ci && generateBaselineAll) {
    console.error("[i18n:ci] Cannot combine --ci with --generate-baseline-all");
    return 2;
  }
  if (ciStrict && scope !== undefined) {
    console.error("[i18n:ci-strict] Do not pass --scope (strict mode always checks all dict top-level keys)");
    return 2;
  }

  if (scope && scope !== SCOPE_FULL && !topLevelKeys().includes(scope)) {
    console.error(
      `Unknown scope "${scope}". Use "${SCOPE_FULL}" for whole dictionary, or: ${topLevelKeys().join(", ")}`,
    );
    return 2;
  }

  if (ci && fix) {
    if (!json) console.warn("[i18n:ci] --fix is disabled in CI mode");
    fix = false;
  }
  if (ciStrict && fix) {
    if (!json) console.warn("[i18n:ci-strict] --fix is disabled in CI mode");
    fix = false;
  }

  const sectionKeyForBaseline = baselineSectionKey(scope);

  if (generateBaselineAll) {
    writeBaselineAllDictScopes();
    if (!json) {
      console.log(`[i18n:baseline] Wrote ${BASELINE_PATH} (all dict scopes, format v${BASELINE_FORMAT_VERSION})`);
      console.log(`[i18n:baseline] Updated: ${dictTopLevelScopeKeys().sort().join(", ")}`);
    } else {
      console.log(
        JSON.stringify(
          {
            mode: "generate-baseline-all",
            path: BASELINE_PATH,
            formatVersion: BASELINE_FORMAT_VERSION,
            scopesUpdated: dictTopLevelScopeKeys().sort(),
          },
          null,
          2,
        ),
      );
    }
    return 0;
  }

  if (generateBaseline) {
    const { byLocale } = runCompare(dictCompareScope(scope));
    writeBaselineSnapshot(scope, byLocale);
    if (!json) {
      console.log(`[i18n:baseline] Wrote ${BASELINE_PATH} (format v${BASELINE_FORMAT_VERSION})`);
      console.log(`[i18n:baseline] scopes["${sectionKeyForBaseline}"] updated (${targetLocales().length} locales)`);
    } else {
      console.log(
        JSON.stringify(
          {
            mode: "generate-baseline",
            path: BASELINE_PATH,
            formatVersion: BASELINE_FORMAT_VERSION,
            sectionKey: sectionKeyForBaseline,
            locales: targetLocales(),
            missingCounts: Object.fromEntries(
              targetLocales().map((loc) => [loc, byLocale[loc]!.missing.length]),
            ),
          },
          null,
          2,
        ),
      );
    }
    return 0;
  }

  if (ciStrict) {
    return runCiStrict(json);
  }

  if (ci) {
    const baseline = readBaselineFromDisk();
    if (!baseline) {
      const msg = `[i18n:ci] Missing or unreadable baseline: ${BASELINE_PATH}\nCreate one with: npm run i18n:baseline`;
      if (json) {
        console.log(
          JSON.stringify(
            {
              mode: "ci",
              error: "baseline_missing",
              message: msg.replace(/^\[i18n:ci\] /, ""),
              exitIntent: 2,
            },
            null,
            2,
          ),
        );
      } else {
        console.error(msg);
      }
      return 2;
    }

    const resolved = resolveCiActiveScopeKey(baseline, scope);
    if (!resolved.ok) {
      if (json) {
        console.log(
          JSON.stringify(
            {
              mode: "ci",
              error: "scope_resolution",
              message: resolved.message,
              exitIntent: 2,
            },
            null,
            2,
          ),
        );
      } else {
        console.error(resolved.message);
      }
      return 2;
    }
    const activeScopeKey = resolved.activeScopeKey;

    const vErr = validateBaselineForCi(baseline, activeScopeKey);
    if (vErr) {
      if (json) {
        console.log(
          JSON.stringify(
            {
              mode: "ci",
              error: "baseline_validation",
              message: vErr,
              exitIntent: 2,
            },
            null,
            2,
          ),
        );
      } else {
        console.error(vErr);
      }
      return 2;
    }

    const compareScope = compareScopeForSectionKey(activeScopeKey);
    const { byLocale } = runCompare(compareScope);

    const newMissing = computeNewMissingKeys(baseline, activeScopeKey, byLocale);
    const totalNew = Object.values(newMissing).reduce((a, b) => a + b.length, 0);
    const newMissingDeterministic = deterministicNewMissing(newMissing);
    const summary = summaryFromLocaleMap(newMissingDeterministic);

    if (json) {
      console.log(
        JSON.stringify(
          {
            mode: "ci",
            scope: activeScopeKey,
            newMissing: newMissingDeterministic,
            summary,
            staleIgnored: true,
            baseLocale: baseline.baseLocale,
            exitIntent: totalNew > 0 ? 1 : 0,
          },
          null,
          2,
        ),
      );
    } else {
      printCiReport(activeScopeKey, newMissing, baseline, byLocale);
    }

    return totalNew > 0 ? 1 : 0;
  }

  const { baseFlat, byLocale } = runCompare(dictCompareScope(scope));
  const summary = summarize(byLocale);

  if (json) {
    console.log(
      JSON.stringify(
        {
          base: I18N_BASE_LOCALE,
          scope: scope ?? null,
          summary: {
            drift: summary.hasDrift,
            totalMissing: summary.totalMissing,
            totalStale: summary.totalStale,
          },
          locales: byLocale,
        },
        null,
        2,
      ),
    );
  } else {
    printReport(scope, byLocale, summary);
  }

  if (fix && summary.totalMissing > 0) {
    writeJsonPatches(baseFlat, byLocale, { empty, scope });
    const outDir = join("lib", "i18n", "generated", "sync-missing");
    if (!json) {
      console.log(`\n[fix] Wrote JSON patch(es) under ${outDir}/`);
    }

    for (const loc of LOCALES) {
      if (loc === I18N_BASE_LOCALE) continue;
      const drift = byLocale[loc]!;
      if (drift.missing.length === 0) continue;
      if (!isKnowledgeOnlyPaths(drift.missing)) {
        if (!json) {
          console.log(
            `[fix] Skipping in-place .ts edit for [${loc}]: missing keys outside knowledge.* (see JSON patch).`,
          );
        }
        continue;
      }
      try {
        applyKnowledgeKeysToTs(loc, drift.missing, baseFlat, empty);
        if (!json) console.log(`[fix] Inserted knowledge keys in locales/${loc}.ts`);
      } catch (e) {
        console.error(`[fix] In-place edit failed for ${loc}:`, e);
      }
    }
  }

  return summary.hasDrift ? 1 : 0;
}

process.exit(main());
