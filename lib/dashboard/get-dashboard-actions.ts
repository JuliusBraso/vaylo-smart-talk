import type { ProfileDNA } from "@/lib/dna/types";
import type { Dict } from "@/lib/i18n";
import { formatMessage } from "@/lib/i18n/format";
import {
  getEmploymentLabel,
  getFamilyLabel,
  getGoalLabel,
  getLanguageLabel,
} from "@/lib/i18n/labels";
import type { LiveSituation } from "@/lib/vaylo/live-situation";
import { getActionExplanations } from "@/lib/dashboard/get-action-explanations";
import {
  isBankAccountCriticalGap,
  isHealthInsuranceMissing,
} from "@/lib/dashboard/reality-gates";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  type BehaviorSignals,
  getUserBehaviorSignals,
} from "@/lib/dashboard/get-user-behavior-signals";
import { fetchKnowledgeCatalogActionToStepIdMap } from "@/lib/dashboard/fetch-knowledge-catalog-action-to-step-id-map";
import { mapDashboardActionToKnowledgeCatalogActionId } from "@/lib/dashboard/map-dashboard-action-to-knowledge-catalog-action-id";
import type { DocumentTypeStepLinkType } from "@/lib/vaylo/knowledge/types";
import type { UserStepSource, UserStepStatus } from "@/lib/vaylo/steps/types";

export type DashboardRelatedDocument = {
  documentTypeId: string;
  title: string;
  linkType: DocumentTypeStepLinkType;
};

export type DashboardAction = {
  id: string;
  title: string;
  description: string;
  reasons: string[];
  href: string;
  priority: "critical" | "high" | "medium";
  nudges?: string[];
  /**
   * CTA label for the action button.
   * Not part of the original minimal type request, but required to keep existing dashboard behavior.
   */
  cta: string;
  /**
   * Bridge to `knowledge_steps.id` — resolved from `knowledge_steps.action_id` via
   * `mapDashboardActionToKnowledgeCatalogActionId` + DB lookup (no topic/document mappings here).
   */
  knowledgeStepId?: string;
  /** Server-resolved step copy for presentation (from knowledge layer keys). */
  stepDetails?: { title: string; hint: string | null };
  /** Document types linked to this step (`document_type_step_links` + `document_types`). */
  relatedDocuments?: DashboardRelatedDocument[];
  /** When set, deep-link to a guide that matches this bureaucratic step. */
  guideHref?: string;
  /** When the step expects uploads, link to Documents (existing upload + classification flow). */
  uploadDocumentHref?: string;
  /** Process state for mapped knowledge steps (server-resolved; optional). */
  stepStatus?: UserStepStatus;
  stepSource?: UserStepSource;
  /** True when resolver marks the step blocked by DAG prerequisites. */
  isBlockedByStepState?: boolean;
  blockedByStepIds?: string[];
  /** Server-resolved i18n label for a compact process badge. */
  stepProcessBadge?: string;
  /** Secondary line (e.g. blocked hint or proof-backed note). */
  stepProcessSubtle?: string;
};

type NextAction = {
  id: string;
  title: string;
  desc: string;
  cta: string;
  /** Resolved CTA destination; when set, overrides primaryRoute / getActionRoute in the shell. */
  href?: string;
};

/** Emergency priority order: P1 → P5. Only evaluated when refine flags are explicitly false. */
type CriticalBlockerKind =
  | "health"
  | "steuer"
  | "bank"
  | "arbeitsagentur"
  | "cv";

function employmentTypeForScoring(
  liveSituation: LiveSituation,
  dna: ProfileDNA
): "employee" | "freelancer" | "job_seeker" {
  return (
    liveSituation.employmentType ?? dna.inputs.employment_type
  ) as "employee" | "freelancer" | "job_seeker";
}

function normalizeBehaviorActionId(actionId: string): string {
  switch (actionId) {
    case "critical-health":
      return "health-insurance";
    case "critical-arbeitsagentur":
      return "arbeitsagentur";
    case "critical-cv":
      return "cv";
    default:
      return actionId;
  }
}

function collectCriticalBlockers(
  liveSituation: LiveSituation,
  dna: ProfileDNA
): CriticalBlockerKind[] {
  const emp = employmentTypeForScoring(liveSituation, dna);
  const out: CriticalBlockerKind[] = [];

  if (isHealthInsuranceMissing(liveSituation)) {
    out.push("health");
  }
  if (emp === "freelancer" && liveSituation.hasSteuerId === false) {
    out.push("steuer");
  }
  if (isBankAccountCriticalGap(liveSituation)) {
    out.push("bank");
  }
  if (emp === "job_seeker" && liveSituation.registeredArbeitsagentur === false) {
    out.push("arbeitsagentur");
  }
  const missingCv = liveSituation.hasCv === false || liveSituation.hasCV === false;
  if (emp === "job_seeker" && missingCv) {
    out.push("cv");
  }

  return out;
}

function blockerKindToCriticalActionId(kind: CriticalBlockerKind): string {
  switch (kind) {
    case "health":
      return "critical-health";
    case "steuer":
      return "critical-steuer";
    case "bank":
      return "critical-bank";
    case "arbeitsagentur":
      return "critical-arbeitsagentur";
    case "cv":
      return "critical-cv";
  }
}

/** Remove critical blocker steps the user already marked completed in `user_progress`. */
function filterCompletedCriticalBlockers(
  kinds: CriticalBlockerKind[],
  completedIds: Set<string>
): CriticalBlockerKind[] {
  return kinds.filter((k) => !completedIds.has(normalizeBehaviorActionId(blockerKindToCriticalActionId(k))));
}

function filterCompletedCandidates(
  actions: NextAction[],
  completedIds: Set<string>
): NextAction[] {
  return actions.filter((a) => !completedIds.has(normalizeBehaviorActionId(a.id)));
}

function dnaActionConflictsWithBlockers(
  actionId: string,
  active: CriticalBlockerKind[]
): boolean {
  const set = new Set(active);
  if (set.has("health") && actionId === "health-insurance") return true;
  if ((set.has("steuer") || set.has("bank")) && actionId === "bureaucracy-priority") {
    return true;
  }
  if (set.has("arbeitsagentur") && actionId === "arbeitsagentur") return true;
  if (set.has("cv") && actionId === "cv") return true;
  return false;
}

function getHealthInsuranceHref(dna: ProfileDNA): string {
  const inputs = dna.inputs;
  return inputs.goals?.includes("bureaucracy")
    ? "/forms/health-insurance-membership"
    : "/guides";
}

function getPrimaryRoute(dna: ProfileDNA): string {
  const inputs = dna?.inputs;
  if (!inputs) return "/dashboard";
  if (inputs.goals?.includes("bureaucracy")) return "/forms";
  if (inputs.employment_type === "job_seeker") return "/jobs";
  if (inputs.employment_type === "freelancer") return "/taxes";
  if (inputs.family_status === "children") return "/guides/kindergeld";
  return "/dashboard";
}

function getSecondaryRoute(dna: ProfileDNA): string {
  const inputs = dna?.inputs;
  if (!inputs) return "/assistant";
  // No dedicated /documents/cv route exists; fall back safely to documents list.
  if (inputs.employment_type === "job_seeker") return "/jobs/cv";
  if (inputs.goals?.includes("bureaucracy")) return "/forms";
  return "/assistant";
}

function getActionRoute(actionId: string, dna: ProfileDNA, fallback: string): string {
  const inputs = dna?.inputs;
  if (!inputs) return fallback;

  if (actionId === "critical-health") return getHealthInsuranceHref(dna);
  if (actionId === "critical-steuer") return "/taxes";
  if (actionId === "critical-bank") return "/forms";
  if (actionId === "critical-arbeitsagentur") return "/jobs";
  if (actionId === "critical-cv") return "/jobs/cv";

  if (actionId === "cv") return "/jobs/cv";
  if (actionId === "arbeitsagentur") return "/jobs";
  if (actionId === "health-insurance") {
    return inputs.goals?.includes("bureaucracy")
      ? "/forms/health-insurance-membership"
      : "/guides";
  }
  if (actionId === "family-benefits") return "/forms/kindergeld-main-application";

  return fallback;
}

/** Values for `{employment}`, `{family}`, `{language}`, `{goal}` in dashboard action copy. */
type ActionCopyPlaceholders = {
  employment: string;
  family: string;
  language: string;
  goal: string;
};

function buildActionCopyPlaceholders(
  t: Dict,
  dna: ProfileDNA,
  liveSituation: LiveSituation
): ActionCopyPlaceholders {
  const emp = employmentTypeForScoring(liveSituation, dna);
  const inputs = dna.inputs;
  return {
    employment: getEmploymentLabel(emp, t),
    family: getFamilyLabel(inputs.family_status, t),
    language: getLanguageLabel(inputs.language_level, t),
    goal: getGoalLabel(inputs.goals[0] ?? "orientation", t),
  };
}

function formatActionCopy(
  template: string,
  t: Dict,
  dna: ProfileDNA,
  liveSituation: LiveSituation
): string {
  return formatMessage(template, buildActionCopyPlaceholders(t, dna, liveSituation));
}

function getActionCopy(
  actionId: string,
  href: string,
  t: Dict,
  liveSituation: LiveSituation,
  dna: ProfileDNA
): { title: string; desc: string; cta: string } {
  // Mirrors existing DashboardShell behavior: allow per-action/per-route templates.
  if (actionId === "bureaucracy-priority") {
    return {
      title: formatActionCopy(t.dashboard.actionAdminPriorityTitle, t, dna, liveSituation),
      desc: formatActionCopy(t.dashboard.actionAdminPriorityDesc, t, dna, liveSituation),
      cta: t.dashboard.actionCtaStart,
    };
  }
  if (actionId === "health-insurance") {
    if (href === "/forms/health-insurance-membership") {
      return {
        title: formatActionCopy(t.dashboard.actionHealthMembershipTitle, t, dna, liveSituation),
        desc: formatActionCopy(t.dashboard.actionHealthMembershipDesc, t, dna, liveSituation),
        cta: t.dashboard.actionCtaStart,
      };
    }
    return {
      title: formatActionCopy(t.dashboard.actionHealthStatusTitle, t, dna, liveSituation),
      desc: formatActionCopy(t.dashboard.actionHealthStatusDesc, t, dna, liveSituation),
      cta: t.dashboard.actionCtaCheck,
    };
  }
  if (actionId === "family-benefits") {
    return {
      title: formatActionCopy(t.dashboard.actionFamilyChecklistTitle, t, dna, liveSituation),
      desc: formatActionCopy(t.dashboard.actionFamilyChecklistDesc, t, dna, liveSituation),
      cta: t.dashboard.actionCtaOpen,
    };
  }
  if (actionId === "cv") {
    return {
      title: formatActionCopy(t.dashboard.actionCvTitle, t, dna, liveSituation),
      desc: formatActionCopy(t.dashboard.actionCvDesc, t, dna, liveSituation),
      cta: t.dashboard.actionCtaOpen,
    };
  }
  if (actionId === "arbeitsagentur") {
    return {
      title: formatActionCopy(t.dashboard.actionArbeitsagenturTitle, t, dna, liveSituation),
      desc: formatActionCopy(t.dashboard.actionArbeitsagenturDesc, t, dna, liveSituation),
      cta: t.dashboard.actionCtaStart,
    };
  }

  // Critical cards come with their own copy already in the dictionary.
  if (actionId === "critical-health") {
    return {
      title: formatActionCopy(t.dashboard.criticalHealthTitle, t, dna, liveSituation),
      desc: formatActionCopy(t.dashboard.criticalHealthDesc, t, dna, liveSituation),
      cta: t.dashboard.actionCtaCheck,
    };
  }
  if (actionId === "critical-steuer") {
    return {
      title: formatActionCopy(t.dashboard.criticalSteuerTitle, t, dna, liveSituation),
      desc: formatActionCopy(t.dashboard.criticalSteuerDesc, t, dna, liveSituation),
      cta: t.dashboard.actionCtaStart,
    };
  }
  if (actionId === "critical-bank") {
    return {
      title: formatActionCopy(t.dashboard.criticalBankTitle, t, dna, liveSituation),
      desc: formatActionCopy(t.dashboard.criticalBankDesc, t, dna, liveSituation),
      cta: t.dashboard.actionCtaStart,
    };
  }
  if (actionId === "critical-arbeitsagentur") {
    return {
      title: formatActionCopy(t.dashboard.criticalArbeitsagenturTitle, t, dna, liveSituation),
      desc: formatActionCopy(t.dashboard.criticalArbeitsagenturDesc, t, dna, liveSituation),
      cta: t.dashboard.actionCtaStart,
    };
  }
  if (actionId === "critical-cv") {
    return {
      title: formatActionCopy(t.dashboard.criticalCvTitle, t, dna, liveSituation),
      desc: formatActionCopy(t.dashboard.criticalCvDesc, t, dna, liveSituation),
      cta: t.dashboard.actionCtaOpen,
    };
  }

  // Fallback (should not happen in normal flows).
  return {
    title: "",
    desc: "",
    cta: t.dashboard.actionCtaOpen,
  };
}

function buildDnaCandidateActions(
  dna: ProfileDNA,
  liveSituation: LiveSituation,
  t: Dict
): NextAction[] {
  const actions: NextAction[] = [];
  const goals = dna.inputs.goals ?? [];

  if (dna.inputs.employment_type === "job_seeker") {
    actions.push(
      {
        id: "arbeitsagentur",
        title: t.dashboard.actionArbeitsagenturTitle,
        desc: t.dashboard.actionArbeitsagenturDesc,
        cta: t.dashboard.actionCtaStart,
      },
      {
        id: "cv",
        title: t.dashboard.actionCvTitle,
        desc: t.dashboard.actionCvDesc,
        cta: t.dashboard.actionCtaOpen,
      }
    );
  }

  if (dna.inputs.family_status === "children") {
    actions.push({
      id: "family-benefits",
      title: t.dashboard.actionFamilyChecklistTitle,
      desc: t.dashboard.actionFamilyChecklistDesc,
      cta: t.dashboard.actionCtaOpen,
    });
  }
  if (liveSituation.hasChildren === true) {
    actions.push({
      id: "family-benefits",
      title: t.dashboard.actionFamilyChecklistTitle,
      desc: t.dashboard.actionFamilyChecklistDesc,
      cta: t.dashboard.actionCtaOpen,
    });
  }

  if (isHealthInsuranceMissing(liveSituation)) {
    actions.push({
      id: "health-insurance",
      title: t.dashboard.actionHealthStatusTitle,
      desc: t.dashboard.actionHealthStatusDesc,
      cta: t.dashboard.actionCtaCheck,
    });
  }

  if (goals.includes("bureaucracy")) {
    actions.unshift({
      id: "bureaucracy-priority",
      title: t.dashboard.actionAdminPriorityTitle,
      desc: t.dashboard.actionAdminPriorityDesc,
      cta: t.dashboard.actionCtaStart,
    });
  }
  if (
    dna.inputs.employment_type === "freelancer" &&
    liveSituation.hasSteuerId === false &&
    !actions.some((a) => a.id === "bureaucracy-priority")
  ) {
    actions.unshift({
      id: "bureaucracy-priority",
      title: t.dashboard.actionAdminPriorityTitle,
      desc: t.dashboard.actionAdminPriorityDesc,
      cta: t.dashboard.actionCtaStart,
    });
  }
  if (liveSituation.hasCv === false && !actions.some((a) => a.id === "cv")) {
    actions.push({
      id: "cv",
      title: t.dashboard.actionCvTitle,
      desc: t.dashboard.actionCvDesc,
      cta: t.dashboard.actionCtaOpen,
    });
  }
  if (
    liveSituation.registeredArbeitsagentur === false &&
    !actions.some((a) => a.id === "arbeitsagentur")
  ) {
    actions.push({
      id: "arbeitsagentur",
      title: t.dashboard.actionArbeitsagenturTitle,
      desc: t.dashboard.actionArbeitsagenturDesc,
      cta: t.dashboard.actionCtaStart,
    });
  }

  return actions;
}

type ScoreBreakdown = {
  baseScore: number;
  dnaBoost: number;
  liveBoost: number;
  finalScore: number;
  reasons: string[];
};

function scoreNextAction(
  actionId: string,
  href: string,
  dna: ProfileDNA,
  liveSituation: LiveSituation,
  idx: number,
  behavior: {
    repeatedClickActionIds: Set<string>;
    timeDecayBoost: Map<string, number>;
  }
): ScoreBreakdown {
  const inputs = dna.inputs;
  const emp = employmentTypeForScoring(liveSituation, dna);
  const goals = inputs.goals ?? [];
  let baseScore = 0;
  let dnaBoost = 0;
  let liveBoost = 0;
  const reasons: string[] = [];

  // Position bias: strongest action should naturally win slot 0.
  baseScore += idx === 0 ? 2 : 0;

  // Global boosts based on goal focus and destination.
  if (goals.includes("bureaucracy")) {
    if (href.startsWith("/forms")) dnaBoost += 20;
    if (href.startsWith("/taxes")) dnaBoost += 20;
  }

  // DNA segment preferences.
  if (emp === "job_seeker") {
    if (actionId === "arbeitsagentur") dnaBoost += 60;
    if (actionId === "cv") dnaBoost += 50;
    if (actionId === "bureaucracy-priority") dnaBoost += 10;
    if (actionId === "health-insurance") dnaBoost += 5;
  }

  if (inputs.family_status === "children") {
    if (actionId === "family-benefits") dnaBoost += 65;
    if (actionId === "health-insurance") dnaBoost += 25;
    if (actionId === "bureaucracy-priority") dnaBoost += 15;
  }

  if (emp === "freelancer") {
    if (href.startsWith("/taxes")) dnaBoost += 60;
    if (actionId === "health-insurance") dnaBoost += 25;
    if (actionId === "bureaucracy-priority") dnaBoost += 20;
  }

  // Live situation boosts (DNA fallback path only — explicit false blockers use critical_blocker_layer).
  if (isHealthInsuranceMissing(liveSituation) && actionId === "health-insurance") {
    liveBoost += 80;
    reasons.push("CRITICAL_missing_health_insurance");
  }
  if (isBankAccountCriticalGap(liveSituation) && actionId === "bureaucracy-priority") {
    liveBoost += 45;
    reasons.push("CRITICAL_missing_bank_account");
  }
  if (
    emp === "freelancer" &&
    liveSituation.hasSteuerId === false &&
    actionId === "bureaucracy-priority" &&
    href.startsWith("/taxes")
  ) {
    liveBoost += 70;
    reasons.push("CRITICAL_missing_steuer_id");
  }
  if (liveSituation.hasCv === false && actionId === "cv") {
    liveBoost += 100;
    reasons.push("CRITICAL_missing_cv");
  }
  if (liveSituation.registeredArbeitsagentur === false && actionId === "arbeitsagentur") {
    liveBoost += 95;
    reasons.push("CRITICAL_missing_arbeitsagentur");
  }
  if (
    liveSituation.jobSearchUrgency === "urgent" &&
    (actionId === "cv" || actionId === "arbeitsagentur")
  ) {
    liveBoost += 60;
    reasons.push("urgent_job_search");
  }
  if (liveSituation.hasChildren === true && actionId === "family-benefits") {
    liveBoost += 90;
    reasons.push("has_children");
  }
  if (liveSituation.childrenSchoolAge === true && actionId === "family-benefits") {
    liveBoost += 70;
    reasons.push("school_age_children");
  }

  // Small, deterministic tie-break nudges.
  baseScore += actionId === "health-insurance" ? 1 : 0;

  const norm = normalizeBehaviorActionId(actionId);
  const clickBoost = behavior.repeatedClickActionIds.has(norm) ? 20 : 0;
  const decayBoost = behavior.timeDecayBoost.get(norm) ?? 0;

  return {
    baseScore,
    dnaBoost,
    liveBoost,
    finalScore: baseScore + dnaBoost + liveBoost + clickBoost + decayBoost,
    reasons,
  };
}

function pickBestForPosition(
  candidates: NextAction[],
  dna: ProfileDNA,
  liveSituation: LiveSituation,
  primaryRoute: string,
  secondaryRoute: string,
  idx: number,
  behavior: {
    repeatedClickActionIds: Set<string>;
    timeDecayBoost: Map<string, number>;
  }
): NextAction {
  let best = candidates[0]!;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const c of candidates) {
    const href = idx === 0 ? primaryRoute : getActionRoute(c.id, dna, secondaryRoute);
    const breakdown = scoreNextAction(c.id, href, dna, liveSituation, idx, behavior);
    const score = breakdown.finalScore;

    if (score > bestScore || (score === bestScore && c.id < best.id)) {
      best = c;
      bestScore = score;
    }
  }

  return best;
}

function dedupeById(actions: NextAction[]): NextAction[] {
  const seen = new Set<string>();
  const out: NextAction[] = [];
  for (const action of actions) {
    if (seen.has(action.id)) continue;
    seen.add(action.id);
    out.push(action);
  }
  return out;
}

function pickOrderedActions(
  actions: NextAction[],
  dna: ProfileDNA,
  liveSituation: LiveSituation,
  primaryRoute: string,
  secondaryRoute: string,
  behavior: {
    repeatedClickActionIds: Set<string>;
    timeDecayBoost: Map<string, number>;
  }
): NextAction[] {
  // Greedy, position-aware ordering:
  // - card 0 always uses primaryRoute
  // - cards 1..N use action-specific route (fallbacks to secondaryRoute)
  const remaining = [...actions];
  const result: NextAction[] = [];

  for (let idx = 0; idx < 3 && remaining.length > 0; idx++) {
    const best = pickBestForPosition(
      remaining,
      dna,
      liveSituation,
      primaryRoute,
      secondaryRoute,
      idx,
      behavior
    );
    result.push(best);
    const removeIdx = remaining.findIndex((x) => x.id === best.id);
    if (removeIdx >= 0) remaining.splice(removeIdx, 1);
  }

  return result;
}

function criticalBlockerToAction(
  kind: CriticalBlockerKind,
  t: Dict,
  dna: ProfileDNA,
  liveSituation: LiveSituation
): NextAction {
  switch (kind) {
    case "health":
      return {
        id: "critical-health",
        title: formatActionCopy(t.dashboard.criticalHealthTitle, t, dna, liveSituation),
        desc: formatActionCopy(t.dashboard.criticalHealthDesc, t, dna, liveSituation),
        cta: t.dashboard.actionCtaCheck,
        href: getHealthInsuranceHref(dna),
      };
    case "steuer":
      return {
        id: "critical-steuer",
        title: formatActionCopy(t.dashboard.criticalSteuerTitle, t, dna, liveSituation),
        desc: formatActionCopy(t.dashboard.criticalSteuerDesc, t, dna, liveSituation),
        cta: t.dashboard.actionCtaStart,
        href: "/taxes",
      };
    case "bank":
      return {
        id: "critical-bank",
        title: formatActionCopy(t.dashboard.criticalBankTitle, t, dna, liveSituation),
        desc: formatActionCopy(t.dashboard.criticalBankDesc, t, dna, liveSituation),
        cta: t.dashboard.actionCtaStart,
        href: "/forms",
      };
    case "arbeitsagentur":
      return {
        id: "critical-arbeitsagentur",
        title: formatActionCopy(t.dashboard.criticalArbeitsagenturTitle, t, dna, liveSituation),
        desc: formatActionCopy(t.dashboard.criticalArbeitsagenturDesc, t, dna, liveSituation),
        cta: t.dashboard.actionCtaStart,
        href: "/jobs",
      };
    case "cv":
      return {
        id: "critical-cv",
        title: formatActionCopy(t.dashboard.criticalCvTitle, t, dna, liveSituation),
        desc: formatActionCopy(t.dashboard.criticalCvDesc, t, dna, liveSituation),
        cta: t.dashboard.actionCtaOpen,
        href: "/jobs/cv",
      };
  }
}

function buildNextActions(
  dna: ProfileDNA,
  liveSituation: LiveSituation,
  completedIds: Set<string>,
  t: Dict,
  primaryRoute: string,
  secondaryRoute: string,
  behavior: {
    repeatedClickActionIds: Set<string>;
    timeDecayBoost: Map<string, number>;
  }
): NextAction[] {
  const rawBlockers = collectCriticalBlockers(liveSituation, dna);
  const blockers = filterCompletedCriticalBlockers(rawBlockers, completedIds);
  const activeBlockers = blockers.slice(0, 3);

  if (blockers.length > 0) {
    const criticalCards: NextAction[] = activeBlockers.map((kind) =>
      criticalBlockerToAction(kind, t, dna, liveSituation)
    );

    if (criticalCards.length >= 3) {
      return criticalCards;
    }

    const dnaPool = filterCompletedCandidates(
      buildDnaCandidateActions(dna, liveSituation, t),
      completedIds
    );
    const filtered = dnaPool.filter((a) => !dnaActionConflictsWithBlockers(a.id, activeBlockers));
    const deduped = dedupeById(filtered);
    const need = 3 - criticalCards.length;
    const fillerWithBoost = pickOrderedActions(
      deduped,
      dna,
      liveSituation,
      primaryRoute,
      secondaryRoute,
      behavior
    ).slice(0, need);

    const combined = [...criticalCards, ...fillerWithBoost];
    return combined.map((a, idx) => {
      const href =
        a.href ??
        (idx === 0 ? primaryRoute : getActionRoute(a.id, dna, secondaryRoute));
      if (a.id.startsWith("critical-")) {
        return { ...a, href };
      }
      const copy = getActionCopy(a.id, href, t, liveSituation, dna);
      return { ...a, ...copy, href };
    });
  }

  const dnaPool = filterCompletedCandidates(
    buildDnaCandidateActions(dna, liveSituation, t),
    completedIds
  );
  const deduped = dedupeById(dnaPool);
  const orderedWithBoost = pickOrderedActions(
    deduped,
    dna,
    liveSituation,
    primaryRoute,
    secondaryRoute,
    behavior
  ).slice(0, 3);

  return orderedWithBoost.map((a, idx) => {
    const href = idx === 0 ? primaryRoute : getActionRoute(a.id, dna, secondaryRoute);
    const copy = getActionCopy(a.id, href, t, liveSituation, dna);
    return { ...a, ...copy, href };
  });
}

export async function getDashboardActions(params: {
  supabase: SupabaseClient;
  userId: string;
  dna: ProfileDNA;
  liveSituation: LiveSituation;
  t: Dict;
  /** When set (e.g. from `getUserState`), avoids a second progress/events query. */
  behaviorSignals?: BehaviorSignals;
}): Promise<DashboardAction[]> {
  const { supabase, userId, dna, liveSituation, t } = params;
  const catalogActionToStepId = await fetchKnowledgeCatalogActionToStepIdMap(
    supabase,
  );
  const behavior =
    params.behaviorSignals ??
    (await getUserBehaviorSignals(supabase, userId));
  const completedIds = new Set(Array.from(behavior.completedActionIds));

  const primaryRoute = getPrimaryRoute(dna);
  const secondaryRoute = getSecondaryRoute(dna);
  const nextActions = buildNextActions(
    dna,
    liveSituation,
    completedIds,
    t,
    primaryRoute,
    secondaryRoute,
    behavior
  );

  // Keep deterministic ordering from the existing picker/critical layer.
  return nextActions
    .filter((a) => !completedIds.has(normalizeBehaviorActionId(a.id)))
    .map((a, idx) => {
    const href =
      a.href ?? (idx === 0 ? primaryRoute : getActionRoute(a.id, dna, secondaryRoute));
    const copy = getActionCopy(a.id, href, t, liveSituation, dna);
    const reasons = getActionExplanations(a.id, dna, liveSituation, t);
    const priority: DashboardAction["priority"] =
      a.id.startsWith("critical-") ? "critical" : idx === 0 ? "high" : "medium";

      const nudges: string[] = [];
      const norm = normalizeBehaviorActionId(a.id);

      // 1) Long ignore (>=72h) — represented by the max decay boost (30).
      if ((behavior.timeDecayBoost.get(norm) ?? 0) >= 30) {
        nudges.push(t.nudges.longIgnore);
      }
      // 2) Critical + not completed (critical cards are only shown when not completed).
      if (priority === "critical") {
        nudges.push(t.nudges.criticalSoon);
      }
      // 3) Repeated clicks (proxy from existing behavior signal).
      if (behavior.repeatedClickActionIds.has(norm)) {
        nudges.push(t.nudges.repeatedClicks);
      }

      const nudgesLimited = nudges.slice(0, 2);

    const catalogActionId = mapDashboardActionToKnowledgeCatalogActionId(a.id);
    const knowledgeStepId = catalogActionToStepId.get(catalogActionId);

    return {
      id: a.id,
      title: copy.title,
      description: copy.desc,
      reasons,
      href,
      priority,
        nudges: nudgesLimited.length > 0 ? nudgesLimited : undefined,
      cta: copy.cta,
      ...(knowledgeStepId ? { knowledgeStepId } : {}),
    };
  });
}

