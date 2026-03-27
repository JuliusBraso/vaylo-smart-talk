"use client";

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
  const nextActions = buildNextActions(dna);

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
              DNA v{dna.version} • {dna.inputs.language_level}
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
                <a
                  href={action.href}
                  className="mt-3 inline-flex rounded-lg border border-cyan-400/45 bg-cyan-500/20 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-500/30"
                >
                  {action.cta}
                </a>
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
  href: string;
};

function buildNextActions(dna: ProfileDNA): NextAction[] {
  const actions: NextAction[] = [];
  const goals = dna.inputs.goals ?? [];

  if (dna.inputs.employment_type === "job_seeker") {
    actions.push(
      {
        id: "arbeitsagentur",
        title: "Register at Arbeitsagentur",
        desc: "Complete your registration so job search support and benefits can start.",
        cta: "Start",
        href: "/jobs",
      },
      {
        id: "cv",
        title: "Prepare German CV (Lebenslauf)",
        desc: "Adjust format, keywords, and role fit before your next applications.",
        cta: "Open",
        href: "/jobs",
      }
    );
  }

  if (dna.inputs.family_status === "children") {
    actions.push({
      id: "family-benefits",
      title: "Review family benefit checklist",
      desc: "Prioritize Kindergeld and school-related paperwork for this month.",
      cta: "Open",
      href: "/guides",
    });
  }

  actions.push({
    id: "health-insurance",
    title: "Check health insurance status",
    desc: "Verify coverage and missing paperwork to avoid delays.",
    cta: "Check",
    href: "/guides",
  });

  if (goals.includes("bureaucracy")) {
    actions.unshift({
      id: "bureaucracy-priority",
      title: "Handle your highest-impact admin task",
      desc: "Finish one government form today to unlock faster progress in other modules.",
      cta: "Start",
      href: "/forms",
    });
  }

  return actions.slice(0, 3);
}

