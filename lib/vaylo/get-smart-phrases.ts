import type { DNAInputs } from "@/lib/dna/types";
import type { UserState } from "@/lib/vaylo/state/types";
import {
  type ContentCategory,
  type VayloPhrase,
  dnaPhraseAlignmentScore,
  getContentByDNA,
  getRecommendedPhrases,
} from "@/lib/vaylo/content-engine";

const CATEGORY_ORDER: ContentCategory[] = [
  "family",
  "job",
  "freelancer",
  "bureaucracy",
];

/** Primary dashboard action — must dominate secondary matches. */
const ACTION_MATCH_SCORE_PRIMARY = 50;
/** Secondary dashboard actions (slots 2–3), clearly weaker than primary. */
const ACTION_MATCH_SCORE_SECONDARY = 22;
const SITUATION_MATCH_SCORE = 20;
const SITUATION_SCORE_CAP = 40;
const PRIORITY_SCORE: Record<"low" | "medium" | "high", number> = {
  low: 0,
  medium: 5,
  high: 10,
};
const WEAK_DNA_SCORE_CAP = 8;
const WEAK_EMPLOYMENT_MATCH = 3;

/** Min total score to keep smart picks when reality/situation is strong but primary did not win rank-1. */
const SITUATION_SURVIVAL_MIN_TOTAL = 38;
/** Min total score when a secondary action (not primary) is the best action-tier match on rank-1. */
const SECONDARY_PATH_MIN_TOTAL = 28;

/** Maps dashboard action ids to stable phrase routing ids (subset overlaps `critical-*` ids). */
export function normalizeDashboardActionForPhrases(actionId: string): string {
  switch (actionId) {
    case "critical-health":
      return "health-insurance";
    case "critical-bank":
      return "bank-account";
    case "critical-steuer":
      return "steuer-id";
    case "critical-arbeitsagentur":
      return "arbeitsagentur";
    case "critical-cv":
      return "cv";
    default:
      return actionId;
  }
}

/**
 * Situation flags for phrase scoring — mirrors `UserState.derived.blockers`
 * (already computed from live situation + DNA in `get-user-state.ts`).
 */
export function derivePhraseSelectionFlags(userState: UserState): Set<string> {
  return new Set(userState.derived.blockers);
}

function phraseMatchesAction(phrase: VayloPhrase, rawActionId: string): boolean {
  const ids = phrase.context?.actionIds;
  if (!ids?.length) return false;
  if (ids.includes(rawActionId)) return true;
  const norm = normalizeDashboardActionForPhrases(rawActionId);
  return ids.includes(norm);
}

function poolHasAnnotatedActionMatch(
  pool: VayloPhrase[],
  rawActionId: string,
): boolean {
  return pool.some((p) => phraseMatchesAction(p, rawActionId));
}

function poolHasAnnotatedActionMatchForAny(
  pool: VayloPhrase[],
  actionIds: string[],
): boolean {
  return actionIds.some((id) => poolHasAnnotatedActionMatch(pool, id));
}

/** Best single-tier action boost: primary +50 beats secondary +22; no stacking. */
function actionTierScore(phrase: VayloPhrase, actionIds: string[]): number {
  if (!actionIds.length) return 0;
  let best = 0;
  const [a0, a1, a2] = [
    actionIds[0]?.trim(),
    actionIds[1]?.trim(),
    actionIds[2]?.trim(),
  ];
  if (a0 && phraseMatchesAction(phrase, a0)) {
    best = Math.max(best, ACTION_MATCH_SCORE_PRIMARY);
  }
  if (a1 && phraseMatchesAction(phrase, a1)) {
    best = Math.max(best, ACTION_MATCH_SCORE_SECONDARY);
  }
  if (a2 && phraseMatchesAction(phrase, a2)) {
    best = Math.max(best, ACTION_MATCH_SCORE_SECONDARY);
  }
  return best;
}

function effectiveActionIds(params: {
  actionIds?: string[];
  actionId?: string;
}): string[] {
  const raw = params.actionIds?.length
    ? params.actionIds
    : params.actionId
      ? [params.actionId]
      : [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of raw) {
    const t = typeof id === "string" ? id.trim() : "";
    if (!t || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
    if (out.length >= 3) break;
  }
  return out;
}

function findPhraseCategory(
  phrase: VayloPhrase,
  content: ReturnType<typeof getContentByDNA>,
): ContentCategory {
  for (const cat of CATEGORY_ORDER) {
    if ((content[cat] ?? []).some((p) => p.id === phrase.id)) return cat;
  }
  return "bureaucracy";
}

/** Round-robin caps so large categories (e.g. `job`) do not starve `bureaucracy` in the pool. */
function buildCandidatePool(
  content: ReturnType<typeof getContentByDNA>,
  categories: ContentCategory[] | undefined,
  maxTotal: number,
  perCategoryCap = 18,
): VayloPhrase[] {
  const allow = new Set(categories ?? CATEGORY_ORDER);
  const out: VayloPhrase[] = [];
  const seen = new Set<string>();
  const perCat = new Map<ContentCategory, number>();

  for (const cat of CATEGORY_ORDER) {
    if (!allow.has(cat)) continue;
    for (const phrase of content[cat] ?? []) {
      if (out.length >= maxTotal) return out;
      if (seen.has(phrase.id)) continue;
      const n = perCat.get(cat) ?? 0;
      if (n >= perCategoryCap) break;
      perCat.set(cat, n + 1);
      seen.add(phrase.id);
      out.push(phrase);
    }
  }
  return out;
}

function situationScore(phrase: VayloPhrase, flags: Set<string>): number {
  const wanted = phrase.context?.situationFlags;
  if (!wanted?.length) return 0;
  let s = 0;
  for (const f of wanted) {
    if (flags.has(f)) s += SITUATION_MATCH_SCORE;
  }
  return Math.min(SITUATION_SCORE_CAP, s);
}

function priorityScore(phrase: VayloPhrase): number {
  const p = phrase.context?.priority;
  if (!p) return 0;
  return PRIORITY_SCORE[p] ?? 0;
}

function scorePhrase(
  phrase: VayloPhrase,
  params: {
    actionIds: string[];
    flags: Set<string>;
    inputs: DNAInputs;
    content: ReturnType<typeof getContentByDNA>;
  },
): number {
  const { actionIds, flags, inputs, content } = params;
  let s = actionTierScore(phrase, actionIds);

  s += situationScore(phrase, flags);
  s += priorityScore(phrase);

  const cat = findPhraseCategory(phrase, content);
  s += Math.min(
    WEAK_DNA_SCORE_CAP,
    Math.floor(dnaPhraseAlignmentScore(inputs, phrase, cat) / 5),
  );

  const emp = params.inputs.employment_type;
  if (emp === "job_seeker" && cat === "job") s += WEAK_EMPLOYMENT_MATCH;
  if (emp === "freelancer" && cat === "freelancer") s += WEAK_EMPLOYMENT_MATCH;

  return s;
}

/**
 * When actions are in play, reject smart ranking unless rank-1 is clearly trustworthy:
 * primary-aligned winner, strong situation signal, or meaningful secondary-action match.
 */
function shouldFallbackToRecommended(
  scored: { phrase: VayloPhrase; score: number }[],
  actionIds: string[],
  flags: Set<string>,
): boolean {
  if (actionIds.length === 0) return false;
  const top = scored[0];
  if (!top) return true;

  const primary = actionIds[0];
  const tierTop = actionTierScore(top.phrase, actionIds);
  const sitTop = situationScore(top.phrase, flags);

  if (phraseMatchesAction(top.phrase, primary)) return false;
  if (tierTop >= ACTION_MATCH_SCORE_PRIMARY) return false;
  if (sitTop >= SITUATION_MATCH_SCORE && top.score >= SITUATION_SURVIVAL_MIN_TOTAL) {
    return false;
  }
  if (
    tierTop >= ACTION_MATCH_SCORE_SECONDARY &&
    top.score >= SECONDARY_PATH_MIN_TOTAL
  ) {
    return false;
  }
  return true;
}

/**
 * State-aware phrase selection: DNA visibility first, reduced pool, deterministic scoring.
 * Falls back to `getRecommendedPhrases` when contextual annotations cannot apply.
 */
export function getSmartPhrases(params: {
  userState: UserState;
  /** Prefer up to 3 ids: index 0 = primary (+50), 1–2 = secondary (+22). */
  actionIds?: string[];
  /** @deprecated Use `actionIds: [id]` instead. */
  actionId?: string;
  limit?: number;
  categories?: ContentCategory[];
}): VayloPhrase[] {
  const limit = params.limit ?? 3;
  const dna = params.userState.identity.dna;
  if (!dna) return [];

  const content = getContentByDNA(dna);
  const flags = derivePhraseSelectionFlags(params.userState);
  const pool = buildCandidatePool(content, params.categories, 50);
  const actionIds = effectiveActionIds(params);

  if (
    actionIds.length > 0 &&
    !poolHasAnnotatedActionMatchForAny(pool, actionIds)
  ) {
    return getRecommendedPhrases(dna.inputs, content, limit);
  }

  const scored = pool.map((phrase) => ({
    phrase,
    score: scorePhrase(phrase, {
      actionIds,
      flags,
      inputs: dna.inputs,
      content,
    }),
  }));

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.phrase.id.localeCompare(b.phrase.id);
  });

  if (actionIds.length > 0 && shouldFallbackToRecommended(scored, actionIds, flags)) {
    return getRecommendedPhrases(dna.inputs, content, limit);
  }

  const picked: VayloPhrase[] = [];
  const seen = new Set<string>();
  for (const row of scored) {
    if (picked.length >= limit) break;
    if (seen.has(row.phrase.id)) continue;
    seen.add(row.phrase.id);
    picked.push(row.phrase);
  }

  if (picked.length < limit) {
    const filler = getRecommendedPhrases(dna.inputs, content, limit);
    for (const p of filler) {
      if (picked.length >= limit) break;
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      picked.push(p);
    }
  }

  return picked;
}
