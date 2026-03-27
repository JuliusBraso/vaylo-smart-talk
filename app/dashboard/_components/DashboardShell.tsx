"use client";

import Link from "next/link";
import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { ProfileDNA } from "@/lib/dna/types";
import type { Dict, Locale } from "@/lib/i18n";
import { formatMessage } from "@/lib/i18n/format";
import {
  getEmploymentLabel,
  getFamilyLabel,
  getGoalLabel,
  getLanguageLabel,
} from "@/lib/i18n/labels";
import type { LiveSituation } from "@/lib/vaylo/live-situation";
import { getActionExplanations } from "@/lib/dashboard/get-action-explanations";

type Props = {
  dna: ProfileDNA;
  locale: Locale;
  liveSituation: LiveSituation;
  /** Dashboard action_ids marked completed in `user_progress` (excluded from next actions). */
  completedActionIds: string[];
  /** Server-resolved dictionary (passed from dashboard page; do not use client-only context here). */
  t: Dict;
  children: ReactNode;
};

/**
 * Re-applies `t` to each dashboard module child so the dict is always present after the
 * dynamic client boundary (avoids undefined `t` on FreelancerModule / FamilyModule / JobSeekerModule).
 */
function injectModuleDict(children: ReactNode, dict: Dict): ReactNode {
  return Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    return cloneElement(child as ReactElement<{ t: Dict }>, { t: dict });
  });
}

export default function DashboardShell({
  dna,
  locale,
  liveSituation,
  completedActionIds,
  t,
  children,
}: Props) {
  const completedIds = new Set(completedActionIds);
  const primaryGoal = dna.priority?.[0] ?? "orientation";
  const primaryRoute = getPrimaryRoute(dna);
  const secondaryRoute = getSecondaryRoute(dna);
  const nextActions = buildNextActions(
    dna,
    liveSituation,
    completedIds,
    t,
    primaryRoute,
    secondaryRoute
  );

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 text-slate-100"
      data-locale={locale}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400/80">
              {t.dashboard.controlCenter}
            </p>
            <h1 className="mt-2 bg-gradient-to-r from-emerald-300 via-cyan-300 to-indigo-400 bg-clip-text text-3xl font-semibold text-transparent md:text-4xl">
              {t.dashboard.operationsCockpit}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-400">
              {t.dashboard.intro}
            </p>
            <Link
              href="/profile/edit"
              className="mt-4 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/10"
            >
              {t.dashboard.editProfile}
            </Link>
            <Link
              href="/profile/refine"
              className="ml-2 mt-4 inline-flex rounded-full border border-cyan-400/35 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-100 transition hover:border-cyan-400/50 hover:bg-cyan-500/15"
            >
              {t.dashboard.refineProfile}
            </Link>
          </div>
          <div className="rounded-2xl border border-emerald-400/30 bg-slate-950/60 px-4 py-3 text-right shadow-[0_0_40px_rgba(16,185,129,0.35)] backdrop-blur-2xl">
            <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
              {t.dashboard.activePriority}
            </div>
            <div className="mt-1 text-sm font-semibold text-emerald-300">
              {primaryGoal === "job"
                ? t.dashboard.priorityJob
                : primaryGoal === "bureaucracy"
                  ? t.dashboard.priorityBureaucracy
                  : primaryGoal === "family_admin"
                    ? t.dashboard.priorityFamilyAdmin
                    : t.dashboard.priorityOrientation}
            </div>
            <div className="mt-1 text-[10px] text-slate-500">
              {t.dashboard.level}{" "}
              {getLanguageLabel(dna.inputs.language_level, t)}
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-[0_0_55px_rgba(56,189,248,0.28)] backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-100">
                {t.dashboard.nextActionsTitle}
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                {t.dashboard.nextActionsDesc}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                {formatMessage(t.dashboard.actionSituationSummary, {
                  employment: getEmploymentLabel(
                    dna.inputs.employment_type,
                    t
                  ),
                  goal: getGoalLabel(
                    dna.inputs.goals[0] ?? "orientation",
                    t
                  ),
                  language: getLanguageLabel(
                    dna.inputs.language_level,
                    t
                  ),
                })}
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {nextActions.map((action, idx) => {
              const whyLines = getActionExplanations(
                action.id,
                dna,
                liveSituation,
                t
              );
              return (
              <article
                key={action.id}
                className={
                  idx === 0
                    ? "rounded-2xl border border-cyan-400/45 bg-cyan-900/20 p-4 shadow-[0_0_38px_rgba(34,211,238,0.3)] md:col-span-2"
                    : "rounded-2xl border border-white/15 bg-white/5 p-4"
                }
              >
                <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
                  {idx === 0
                    ? t.dashboard.highestPriorityLabel
                    : t.dashboard.nextLabel}
                </div>
                <h3 className="mt-2 text-sm font-semibold text-slate-100">
                  {action.title}
                </h3>
                <p className="mt-1 text-xs text-slate-300">{action.desc}</p>
                {whyLines.length > 0 ? (
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] leading-snug text-slate-500">
                    {whyLines.map((line, li) => (
                      <li key={`${action.id}-why-${li}`}>{line}</li>
                    ))}
                  </ul>
                ) : null}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Link
                    href={
                      action.href ??
                      (idx === 0
                        ? primaryRoute
                        : getActionRoute(action.id, dna, secondaryRoute))
                    }
                    className="inline-flex rounded-lg border border-cyan-400/45 bg-cyan-500/20 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-500/30"
                  >
                    {action.cta}
                  </Link>
                  <MarkTaskDoneButton actionId={action.id} markDoneLabel={t.dashboard.actionMarkDone} />
                </div>
              </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-[0_0_40px_rgba(56,189,248,0.25)] backdrop-blur-2xl md:col-span-2">
            <div className="pointer-events-none absolute inset-px rounded-[22px] bg-gradient-to-br from-emerald-500/15 via-transparent to-indigo-500/20" />
            <div className="relative flex flex-col gap-2">
              <h2 className="text-sm font-semibold tracking-wide text-slate-100">
                {t.dashboard.dnaSnapshotTitle}
              </h2>
              <p className="text-xs text-slate-400">
                {t.dashboard.dnaSnapshotDesc}
              </p>
              <div className="mt-4 grid gap-3 text-xs text-slate-300 sm:grid-cols-4">
                <div className="rounded-2xl border border-emerald-400/30 bg-emerald-900/20 px-3 py-2">
                  <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-300/80">
                    {t.dashboard.familyLabel}
                  </div>
                  <div className="mt-1 text-xs font-semibold">
                    {getFamilyLabel(dna.inputs.family_status, t)}
                  </div>
                </div>
                <div className="rounded-2xl border border-cyan-400/30 bg-cyan-900/20 px-3 py-2">
                  <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-cyan-300/80">
                    {t.dashboard.workModeLabel}
                  </div>
                  <div className="mt-1 text-xs font-semibold">
                    {getEmploymentLabel(dna.inputs.employment_type, t)}
                  </div>
                </div>
                <div className="rounded-2xl border border-indigo-400/30 bg-indigo-900/30 px-3 py-2">
                  <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-indigo-300/80">
                    {t.dashboard.languageLabel}
                  </div>
                  <div className="mt-1 text-xs font-semibold">
                    {formatMessage(t.dashboard.dnaLanguageCourseLine, {
                      level: getLanguageLabel(dna.inputs.language_level, t),
                    })}
                  </div>
                </div>
                <div className="rounded-2xl border border-fuchsia-400/30 bg-fuchsia-900/20 px-3 py-2">
                  <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-fuchsia-300/80">
                    {t.dashboard.focusLabel}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1 text-[11px]">
                    {dna.inputs.goals.map((g) => (
                      <span
                        key={g}
                        className="rounded-full bg-fuchsia-500/15 px-2 py-0.5 text-fuchsia-100/90 ring-1 ring-fuchsia-400/40"
                      >
                        {getGoalLabel(g, t)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-3">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 shadow-[0_0_30px_rgba(129,140,248,0.35)] backdrop-blur-2xl">
              <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                {t.dashboard.statusLabel}
              </div>
              <div className="mt-1 text-xs font-semibold text-indigo-200">
                {t.dashboard.statusLocked}
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                {t.dashboard.statusDesc}
              </div>
            </div>
          </aside>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {injectModuleDict(children, t)}
        </section>
      </div>
    </main>
  );
}

function MarkTaskDoneButton({
  actionId,
  markDoneLabel,
}: {
  actionId: string;
  markDoneLabel: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const onDone = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionId }),
      });
      if (res.ok) {
        if (process.env.NEXT_PUBLIC_VAYLO_DEBUG === "1") {
          console.log("[Vaylo][progress]", { event: "action_completed", actionId });
        }
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }, [actionId, router]);

  return (
    <button
      type="button"
      onClick={onDone}
      disabled={loading}
      className="inline-flex rounded-lg border border-white/20 bg-white/5 px-2.5 py-1.5 text-[11px] font-semibold text-slate-300 transition hover:border-white/35 hover:bg-white/10 disabled:opacity-50"
    >
      {loading ? "…" : markDoneLabel}
    </button>
  );
}

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

function collectCriticalBlockers(
  liveSituation: LiveSituation,
  dna: ProfileDNA
): CriticalBlockerKind[] {
  const emp = employmentTypeForScoring(liveSituation, dna);
  const out: CriticalBlockerKind[] = [];

  if (liveSituation.hasHealthInsurance === false) {
    out.push("health");
  }
  if (emp === "freelancer" && liveSituation.hasSteuerId === false) {
    out.push("steuer");
  }
  if (liveSituation.hasBankAccount === false) {
    out.push("bank");
  }
  if (emp === "job_seeker" && liveSituation.registeredArbeitsagentur === false) {
    out.push("arbeitsagentur");
  }
  const missingCv =
    liveSituation.hasCv === false || liveSituation.hasCV === false;
  if (emp === "job_seeker" && missingCv) {
    out.push("cv");
  }

  return out;
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

function criticalReasonForKind(kind: CriticalBlockerKind): string {
  switch (kind) {
    case "health":
      return "CRITICAL_missing_health_insurance";
    case "steuer":
      return "CRITICAL_missing_steuer_id";
    case "bank":
      return "CRITICAL_missing_bank_account";
    case "arbeitsagentur":
      return "CRITICAL_missing_arbeitsagentur";
    case "cv":
      return "CRITICAL_missing_cv";
  }
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
  const skipped: string[] = [];
  const kept: CriticalBlockerKind[] = [];
  for (const k of kinds) {
    const aid = blockerKindToCriticalActionId(k);
    if (completedIds.has(aid)) {
      skipped.push(aid);
    } else {
      kept.push(k);
    }
  }
  if (process.env.NEXT_PUBLIC_VAYLO_DEBUG === "1" && skipped.length > 0) {
    console.log("[Vaylo][progress]", {
      event: "skipped_because_completed",
      actionIds: skipped,
    });
  }
  return kept;
}

function filterCompletedCandidates(
  actions: NextAction[],
  completedIds: Set<string>
): NextAction[] {
  const skipped: string[] = [];
  const kept = actions.filter((a) => {
    if (completedIds.has(a.id)) {
      skipped.push(a.id);
      return false;
    }
    return true;
  });
  if (process.env.NEXT_PUBLIC_VAYLO_DEBUG === "1" && skipped.length > 0) {
    console.log("[Vaylo][progress]", {
      event: "skipped_because_completed",
      actionIds: skipped,
    });
  }
  return kept;
}

function dnaActionConflictsWithBlockers(
  actionId: string,
  active: CriticalBlockerKind[]
): boolean {
  const set = new Set(active);
  if (set.has("health") && actionId === "health-insurance") return true;
  if (
    (set.has("steuer") || set.has("bank")) &&
    actionId === "bureaucracy-priority"
  ) {
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

function buildNextActions(
  dna: ProfileDNA,
  liveSituation: LiveSituation,
  completedIds: Set<string>,
  t: Dict,
  primaryRoute: string,
  secondaryRoute: string
): NextAction[] {
  const rawBlockers = collectCriticalBlockers(liveSituation, dna);
  const blockers = filterCompletedCriticalBlockers(rawBlockers, completedIds);
  const activeBlockers = blockers.slice(0, 3);

  if (blockers.length > 0) {
    const criticalCards: NextAction[] = activeBlockers.map((kind) =>
      criticalBlockerToAction(kind, t, dna, liveSituation)
    );

    if (process.env.NEXT_PUBLIC_VAYLO_DEBUG === "1") {
      activeBlockers.forEach((kind, idx) => {
        const a = criticalCards[idx]!;
        console.log("[Vaylo][dashboard_scoring_row]", {
          mode: "critical_blocker_layer",
          slot: idx,
          actionId: a.id,
          href: a.href,
          baseScore: 0,
          dnaBoost: 0,
          liveBoost: 0,
          finalScore: 10000 - idx,
          reasons: [criticalReasonForKind(kind)],
        });
      });
    }

    if (criticalCards.length >= 3) {
      return criticalCards;
    }

    const dnaPool = filterCompletedCandidates(
      buildDnaCandidateActions(dna, liveSituation, t),
      completedIds
    );
    const filtered = dnaPool.filter(
      (a) => !dnaActionConflictsWithBlockers(a.id, activeBlockers)
    );
    const deduped = dedupeById(filtered);
    const need = 3 - criticalCards.length;
    const filler = pickOrderedActions(
      deduped,
      dna,
      liveSituation,
      primaryRoute,
      secondaryRoute
    ).slice(0, need);

    const combined = [...criticalCards, ...filler];
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
  const ordered = pickOrderedActions(
    deduped,
    dna,
    liveSituation,
    primaryRoute,
    secondaryRoute
  ).slice(0, 3);

  if (process.env.NEXT_PUBLIC_VAYLO_DEBUG === "1") {
    deduped.forEach((a) => {
      for (let idx = 0; idx < 3; idx++) {
        const href = idx === 0 ? primaryRoute : getActionRoute(a.id, dna, secondaryRoute);
        const breakdown = scoreNextAction(a.id, href, dna, liveSituation, idx);
        console.log("[Vaylo][dashboard_scoring_row]", {
          mode: "dna_fallback",
          slot: idx,
          actionId: a.id,
          href,
          baseScore: breakdown.baseScore,
          dnaBoost: breakdown.dnaBoost,
          liveBoost: breakdown.liveBoost,
          finalScore: breakdown.finalScore,
          reasons: breakdown.reasons,
        });
      }
    });
  }

  return ordered.map((a, idx) => {
    const href =
      idx === 0 ? primaryRoute : getActionRoute(a.id, dna, secondaryRoute);
    const copy = getActionCopy(a.id, href, t, liveSituation, dna);
    return { ...a, ...copy, href };
  });
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

  actions.push({
    id: "health-insurance",
    title: t.dashboard.actionHealthStatusTitle,
    desc: t.dashboard.actionHealthStatusDesc,
    cta: t.dashboard.actionCtaCheck,
  });

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
  if (
    liveSituation.hasCv === false &&
    !actions.some((a) => a.id === "cv")
  ) {
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
  secondaryRoute: string
): NextAction[] {
  // Greedy, position-aware ordering:
  // - card 0 always uses primaryRoute
  // - cards 1..N use action-specific route (fallbacks to secondaryRoute)
  // This keeps ordering consistent with actual CTA destinations.
  const remaining = [...actions];
  const result: NextAction[] = [];

  for (let idx = 0; idx < 3 && remaining.length > 0; idx++) {
    const best = pickBestForPosition(
      remaining,
      dna,
      liveSituation,
      idx,
      primaryRoute,
      secondaryRoute
    );
    result.push(best);
    const rmIdx = remaining.findIndex((x) => x.id === best.id);
    if (rmIdx >= 0) remaining.splice(rmIdx, 1);
  }

  return result;
}

function pickBestForPosition(
  candidates: NextAction[],
  dna: ProfileDNA,
  liveSituation: LiveSituation,
  idx: number,
  primaryRoute: string,
  secondaryRoute: string
): NextAction {
  let best = candidates[0]!;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const c of candidates) {
    const href = idx === 0 ? primaryRoute : getActionRoute(c.id, dna, secondaryRoute);
    const breakdown = scoreNextAction(c.id, href, dna, liveSituation, idx);
    const score = breakdown.finalScore;

    if (score > bestScore || (score === bestScore && c.id < best.id)) {
      best = c;
      bestScore = score;
    }
  }

  return best;
}

type ScoreBreakdown = {
  baseScore: number;
  dnaBoost: number;
  liveBoost: number;
  finalScore: number;
  reasons: string[];
};

function employmentTypeForScoring(
  liveSituation: LiveSituation,
  dna: ProfileDNA
): "employee" | "freelancer" | "job_seeker" {
  return (
    liveSituation.employmentType ?? dna.inputs.employment_type
  ) as "employee" | "freelancer" | "job_seeker";
}

function scoreNextAction(
  actionId: string,
  href: string,
  dna: ProfileDNA,
  liveSituation: LiveSituation,
  idx: number
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
  if (liveSituation.hasHealthInsurance === false && actionId === "health-insurance") {
    liveBoost += 80;
    reasons.push("CRITICAL_missing_health_insurance");
  }
  if (liveSituation.hasBankAccount === false && actionId === "bureaucracy-priority") {
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
  if (
    liveSituation.registeredArbeitsagentur === false &&
    actionId === "arbeitsagentur"
  ) {
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

  return {
    baseScore,
    dnaBoost,
    liveBoost,
    finalScore: baseScore + dnaBoost + liveBoost,
    reasons,
  };
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

/**
 * Interpolate any dashboard action title/desc template with label resolvers.
 * Strings without `{…}` pass through unchanged. Missing profile fields → empty segments, never raw enums.
 */
function formatActionCopy(
  template: string,
  t: Dict,
  dna: ProfileDNA,
  liveSituation: LiveSituation
): string {
  return formatMessage(template, buildActionCopyPlaceholders(t, dna, liveSituation));
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


function getActionCopy(
  actionId: string,
  href: string,
  t: Dict,
  liveSituation: LiveSituation,
  dna: ProfileDNA
): Pick<NextAction, "title" | "desc"> {
  const fmt = (s: string) => formatActionCopy(s, t, dna, liveSituation);
  const emp = employmentTypeForScoring(liveSituation, dna);

  if (
    actionId === "bureaucracy-priority" &&
    href.startsWith("/taxes") &&
    emp === "freelancer" &&
    liveSituation.hasSteuerId === false
  ) {
    return {
      title: fmt(t.dashboard.criticalSteuerTitle),
      desc: fmt(t.dashboard.criticalSteuerDesc),
    };
  }

  if (actionId === "bureaucracy-priority") {
    if (href === "/taxes") {
      return {
        title: fmt(t.dashboard.actionTaxesPriorityTitle),
        desc: fmt(t.dashboard.actionTaxesPriorityDesc),
      };
    }
    if (href === "/forms/kindergeld-main-application") {
      return {
        title: fmt(t.dashboard.actionKindergeldPriorityTitle),
        desc: fmt(t.dashboard.actionKindergeldPriorityDesc),
      };
    }
    return {
      title: fmt(t.dashboard.actionAdminPriorityTitle),
      desc: fmt(t.dashboard.actionAdminPriorityDesc),
    };
  }

  if (actionId === "health-insurance") {
    if (href === "/forms/health-insurance-membership") {
      return {
        title: fmt(t.dashboard.actionHealthMembershipTitle),
        desc: fmt(t.dashboard.actionHealthMembershipDesc),
      };
    }
    return {
      title: fmt(t.dashboard.actionHealthStatusTitle),
      desc: fmt(t.dashboard.actionHealthStatusDesc),
    };
  }

  if (actionId === "family-benefits") {
    return {
      title: fmt(t.dashboard.actionFamilyChecklistTitle),
      desc: fmt(t.dashboard.actionFamilyChecklistDesc),
    };
  }

  if (actionId === "cv") {
    return {
      title: fmt(t.dashboard.actionCvTitle),
      desc: fmt(t.dashboard.actionCvDesc),
    };
  }

  if (actionId === "arbeitsagentur") {
    return {
      title: fmt(t.dashboard.actionArbeitsagenturTitle),
      desc: fmt(t.dashboard.actionArbeitsagenturDesc),
    };
  }

  return {
    title: fmt(t.dashboard.nextActionsTitle),
    desc: fmt(t.dashboard.nextActionsDesc),
  };
}

