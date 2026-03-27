"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { ProfileDNA } from "@/lib/dna/types";
import type { Locale } from "@/lib/i18n";
import { useT } from "@/lib/i18n/useT";

type Props = {
  dna: ProfileDNA;
  locale: Locale;
  children: ReactNode;
};

export default function DashboardShell({ dna, locale, children }: Props) {
  const { t } = useT();
  const primaryGoal = dna.priority?.[0] ?? "orientation";
  const primaryRoute = getPrimaryRoute(dna);
  const secondaryRoute = getSecondaryRoute(dna);
  const nextActions = buildNextActions(dna, t, primaryRoute, secondaryRoute);

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
              {t.dashboard.level} {dna.inputs.language_level}
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
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {nextActions.map((action, idx) => (
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
                <Link
                  href={idx === 0 ? primaryRoute : getActionRoute(action.id, dna, secondaryRoute)}
                  className="mt-3 inline-flex rounded-lg border border-cyan-400/45 bg-cyan-500/20 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-500/30"
                >
                  {action.cta}
                </Link>
              </article>
            ))}
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
                    {dna.inputs.family_status === "children"
                      ? t.dashboard.familyChildren
                      : dna.inputs.family_status === "family"
                        ? t.dashboard.familyPartner
                        : t.dashboard.familySingle}
                  </div>
                </div>
                <div className="rounded-2xl border border-cyan-400/30 bg-cyan-900/20 px-3 py-2">
                  <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-cyan-300/80">
                    {t.dashboard.workModeLabel}
                  </div>
                  <div className="mt-1 text-xs font-semibold">
                    {dna.inputs.employment_type === "freelancer"
                      ? t.dashboard.workFreelancer
                      : dna.inputs.employment_type === "job_seeker"
                        ? t.dashboard.workJobSeeker
                        : t.dashboard.workEmployee}
                  </div>
                </div>
                <div className="rounded-2xl border border-indigo-400/30 bg-indigo-900/30 px-3 py-2">
                  <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-indigo-300/80">
                    {t.dashboard.languageLabel}
                  </div>
                  <div className="mt-1 text-xs font-semibold">
                    Deutsch {dna.inputs.language_level}
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
                        {g === "bureaucracy"
                          ? t.dashboard.focusPaperwork
                          : g === "job"
                            ? t.dashboard.focusJob
                            : t.dashboard.focusOrientation}
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

        <section className="grid gap-6 md:grid-cols-3">{children}</section>
      </div>
    </main>
  );
}

type NextAction = {
  id: string;
  title: string;
  desc: string;
  cta: string;
};

function buildNextActions(
  dna: ProfileDNA,
  t: ReturnType<typeof useT>["t"],
  primaryRoute: string,
  secondaryRoute: string
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

  const ordered = pickOrderedActions(actions, dna, primaryRoute, secondaryRoute).slice(
    0,
    3
  );

  // Ensure copy matches the final destination routes for the chosen order.
  return ordered.map((a, idx) => {
    const href =
      idx === 0 ? primaryRoute : getActionRoute(a.id, dna, secondaryRoute);
    const copy = getActionCopy(a.id, href, t);
    return { ...a, ...copy };
  });
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

function pickOrderedActions(
  actions: NextAction[],
  dna: ProfileDNA,
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
    const best = pickBestForPosition(remaining, dna, idx, primaryRoute, secondaryRoute);
    result.push(best);
    const rmIdx = remaining.findIndex((x) => x.id === best.id);
    if (rmIdx >= 0) remaining.splice(rmIdx, 1);
  }

  return result;
}

function pickBestForPosition(
  candidates: NextAction[],
  dna: ProfileDNA,
  idx: number,
  primaryRoute: string,
  secondaryRoute: string
): NextAction {
  let best = candidates[0]!;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const c of candidates) {
    const href = idx === 0 ? primaryRoute : getActionRoute(c.id, dna, secondaryRoute);
    const score = scoreNextAction(c.id, href, dna, idx);

    if (score > bestScore || (score === bestScore && c.id < best.id)) {
      best = c;
      bestScore = score;
    }
  }

  return best;
}

function scoreNextAction(
  actionId: string,
  href: string,
  dna: ProfileDNA,
  idx: number
): number {
  const inputs = dna.inputs;
  const goals = inputs.goals ?? [];
  let score = 0;

  // Position bias: strongest action should naturally win slot 0.
  score += idx === 0 ? 2 : 0;

  // Global boosts based on goal focus and destination.
  if (goals.includes("bureaucracy")) {
    if (href.startsWith("/forms")) score += 20;
    if (href.startsWith("/taxes")) score += 20;
  }

  // DNA segment preferences.
  if (inputs.employment_type === "job_seeker") {
    if (actionId === "arbeitsagentur") score += 60;
    if (actionId === "cv") score += 50;
    if (actionId === "bureaucracy-priority") score += 10;
    if (actionId === "health-insurance") score += 5;
  }

  if (inputs.family_status === "children") {
    if (actionId === "family-benefits") score += 65;
    if (actionId === "health-insurance") score += 25;
    if (actionId === "bureaucracy-priority") score += 15;
  }

  if (inputs.employment_type === "freelancer") {
    if (href.startsWith("/taxes")) score += 60;
    if (actionId === "health-insurance") score += 25;
    if (actionId === "bureaucracy-priority") score += 20;
  }

  // Small, deterministic tie-break nudges.
  if (actionId === "health-insurance") score += 1;

  return score;
}

function getActionCopy(
  actionId: string,
  href: string,
  t: ReturnType<typeof useT>["t"]
): Pick<NextAction, "title" | "desc"> {
  if (actionId === "bureaucracy-priority") {
    if (href === "/taxes") {
      return {
        title: t.dashboard.actionTaxesPriorityTitle,
        desc: t.dashboard.actionTaxesPriorityDesc,
      };
    }
    if (href === "/forms/kindergeld-main-application") {
      return {
        title: t.dashboard.actionKindergeldPriorityTitle,
        desc: t.dashboard.actionKindergeldPriorityDesc,
      };
    }
    return {
      title: t.dashboard.actionAdminPriorityTitle,
      desc: t.dashboard.actionAdminPriorityDesc,
    };
  }

  if (actionId === "health-insurance") {
    if (href === "/forms/health-insurance-membership") {
      return {
        title: t.dashboard.actionHealthMembershipTitle,
        desc: t.dashboard.actionHealthMembershipDesc,
      };
    }
    return {
      title: t.dashboard.actionHealthStatusTitle,
      desc: t.dashboard.actionHealthStatusDesc,
    };
  }

  if (actionId === "family-benefits") {
    return {
      title: t.dashboard.actionFamilyChecklistTitle,
      desc: t.dashboard.actionFamilyChecklistDesc,
    };
  }

  if (actionId === "cv") {
    return {
      title: t.dashboard.actionCvTitle,
      desc: t.dashboard.actionCvDesc,
    };
  }

  if (actionId === "arbeitsagentur") {
    return {
      title: t.dashboard.actionArbeitsagenturTitle,
      desc: t.dashboard.actionArbeitsagenturDesc,
    };
  }

  // Fallback (deterministic).
  return {
    title: t.dashboard.nextActionsTitle,
    desc: t.dashboard.nextActionsDesc,
  };
}

