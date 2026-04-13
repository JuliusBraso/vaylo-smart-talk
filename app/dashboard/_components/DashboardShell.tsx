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
import type { DashboardAction } from "@/lib/dashboard/get-dashboard-actions";
import { trackActionEvent } from "@/lib/vaylo/action-tracking";

type Props = {
  dna: ProfileDNA;
  locale: Locale;
  userId: string;
  /** Fully resolved on the server (`get-dashboard-actions` + `UserState`). */
  actions: DashboardAction[];
  /** Server-resolved copy for the priority badge (no client DNA branching). */
  activePriorityLabel: string;
  /** Server-resolved `actionSituationSummary` line. */
  situationSummaryLine: string;
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
  userId,
  actions,
  activePriorityLabel,
  situationSummaryLine,
  t,
  children,
}: Props) {
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
              {activePriorityLabel}
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
              <p className="mt-1 text-[11px] text-slate-500">{situationSummaryLine}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {actions.map((action, idx) => {
              const whyLines = action.reasons;
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
                  {action.stepProcessBadge ? (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={
                          action.stepSource === "proof" && action.stepStatus === "verified"
                            ? "rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-200/95"
                            : "rounded-full border border-white/20 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300"
                        }
                      >
                        {action.stepProcessBadge}
                      </span>
                    </div>
                  ) : null}
                  {action.stepProcessSubtle ? (
                    <p className="mt-1 text-[10px] leading-snug text-slate-500">
                      {action.stepProcessSubtle}
                    </p>
                  ) : null}
                  {action.recommendedNextHint ? (
                    <p className="mt-1 text-[10px] font-medium text-emerald-400/90">
                      {action.recommendedNextHint}
                    </p>
                  ) : null}
                  <p className="mt-1 text-xs text-slate-300">{action.description}</p>
                  {action.stepDetails ? (
                    <div className="mt-2 rounded-lg border border-white/10 bg-slate-900/40 px-3 py-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-300/90">
                        {action.stepDetails.title}
                      </p>
                      {action.stepDetails.hint ? (
                        <p className="mt-1 text-[11px] leading-snug text-slate-400">
                          {action.stepDetails.hint}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                  {whyLines.length > 0 ? (
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] leading-snug text-slate-500">
                      {whyLines.map((line, li) => (
                        <li key={`${action.id}-why-${li}`}>{line}</li>
                      ))}
                    </ul>
                  ) : null}
                  {action.nudges?.length ? (
                    <div className="mt-2 grid gap-1 text-[11px] leading-snug text-slate-400/90">
                      {action.nudges.slice(0, 2).map((n, ni) => (
                        <div key={`${action.id}-nudge-${ni}`}>{n}</div>
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Link
                      href={action.href}
                      onClick={() => {
                        void trackActionEvent({
                          userId,
                          actionId: action.id,
                          eventType: "click",
                        });
                      }}
                      className="inline-flex rounded-lg border border-cyan-400/45 bg-cyan-500/20 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-500/30"
                    >
                      {action.cta}
                    </Link>
                    {action.uploadDocumentHref ? (
                      <Link
                        href={action.uploadDocumentHref}
                        onClick={() => {
                          void trackActionEvent({
                            userId,
                            actionId: action.id,
                            eventType: "click",
                          });
                        }}
                        className="inline-flex rounded-lg border border-amber-400/40 bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-100 transition hover:bg-amber-500/25"
                      >
                        {t.dashboard.actionUploadDocumentCta}
                      </Link>
                    ) : null}
                    {action.guideHref ? (
                      <Link
                        href={action.guideHref}
                        onClick={() => {
                          void trackActionEvent({
                            userId,
                            actionId: action.id,
                            eventType: "click",
                          });
                        }}
                        className="inline-flex rounded-lg border border-indigo-400/40 bg-indigo-500/15 px-3 py-1.5 text-xs font-semibold text-indigo-100 transition hover:bg-indigo-500/25"
                      >
                        {t.dashboard.actionViewGuideCta}
                      </Link>
                    ) : null}
                    <MarkTaskDoneButton
                      userId={userId}
                      actionId={action.id}
                      markDoneLabel={t.dashboard.actionMarkDone}
                    />
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

        <section className="grid grid-cols-1 gap-6">
          {injectModuleDict(children, t)}
        </section>
      </div>
    </main>
  );
}

function MarkTaskDoneButton({
  userId,
  actionId,
  markDoneLabel,
}: {
  userId: string;
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
        await trackActionEvent({ userId, actionId, eventType: "complete" });
        if (process.env.NEXT_PUBLIC_VAYLO_DEBUG === "1") {
          console.log("[Vaylo][progress]", { event: "action_completed", actionId });
        }
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }, [actionId, router, userId]);

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
