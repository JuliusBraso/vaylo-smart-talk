"use client";

import type { ProfileDNA } from "@/lib/dna/types";
import type { Dict } from "@/lib/i18n";
import type { ClientPhrase } from "@/lib/vaylo/client-phrase";
import { toClientPhrases } from "@/lib/vaylo/client-phrase";
import { getContentByDNA } from "@/lib/vaylo/content-engine";
import DashboardPhrasesCollapsible from "@/app/dashboard/_components/DashboardPhrasesCollapsible";

export type JobSeekerModuleProps = {
  dna: ProfileDNA;
  /** Server-resolved dictionary from `DashboardPage` / `DashboardShell` — never created on the client. */
  t: Dict;
  /** State-aware top phrases (server, `ClientPhrase` — no internal `context`). */
  smartPhrases?: ClientPhrase[];
};

export default function JobSeekerModule({ dna, t, smartPhrases }: JobSeekerModuleProps) {
  const score = dna.scores?.job_focus ?? dna.scores?.JP ?? 0;
  const content = getContentByDNA(dna);
  const phrases: ClientPhrase[] =
    smartPhrases ??
    toClientPhrases([...content.job, ...content.bureaucracy]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-cyan-400/40 bg-slate-950/80 p-4 text-sm text-slate-100 shadow-[0_0_36px_rgba(34,211,238,0.55)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0_0,rgba(34,211,238,0.28),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(59,130,246,0.25),transparent_55%)]" />
      <div className="relative flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
            {t.dashboard.jobSeekerTitle}
          </h2>
          <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-medium text-cyan-50 ring-1 ring-cyan-400/60">
            {t.dashboard.jobSeekerBadge}
          </span>
        </div>

        <p className="text-[11px] text-cyan-50/85">
          {t.dashboard.jobSeekerIntro}
        </p>

        <div className="mt-1 rounded-2xl border border-cyan-400/50 bg-cyan-900/40 px-3 py-2 text-[11px] text-cyan-50">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-cyan-200/80">
              {t.dashboard.jobFocusSignal}
            </span>
            <span className="text-xs font-semibold">{Math.round(score)}%</span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-cyan-950/70">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 shadow-[0_0_18px_rgba(56,189,248,0.9)]"
              style={{ width: `${Math.max(10, Math.min(100, score))}%` }}
            />
          </div>
          <p className="mt-2 text-[10px] text-cyan-50/85">
            {t.dashboard.jobFocusHint}
          </p>
        </div>

        <ul className="mt-1 space-y-1.5 text-[11px] text-cyan-50/90">
          <li className="flex items-start gap-1.5">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(56,189,248,0.9)]" />
            {t.dashboard.jobSeekerPoint1}
          </li>
          <li className="flex items-start gap-1.5">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-300 shadow-[0_0_10px_rgba(125,211,252,0.9)]" />
            {t.dashboard.jobSeekerPoint2}
          </li>
          <li className="flex items-start gap-1.5">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-300 shadow-[0_0_10px_rgba(129,140,248,0.9)]" />
            {t.dashboard.jobSeekerPoint3}
          </li>
        </ul>

        {phrases.length > 0 && (
          <DashboardPhrasesCollapsible phrases={phrases} tone="cyan" t={t} />
        )}
      </div>
    </div>
  );
}

