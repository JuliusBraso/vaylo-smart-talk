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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-800 shadow-sm">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
            {t.dashboard.jobSeekerTitle}
          </h2>
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700 ring-1 ring-indigo-200">
            {t.dashboard.jobSeekerBadge}
          </span>
        </div>

        <p className="text-[11px] text-slate-600">
          {t.dashboard.jobSeekerIntro}
        </p>

        <div className="mt-1 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-600">
              {t.dashboard.jobFocusSignal}
            </span>
            <span className="text-xs font-semibold">{Math.round(score)}%</span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-slate-200">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-sky-400"
              style={{ width: `${Math.max(10, Math.min(100, score))}%` }}
            />
          </div>
          <p className="mt-2 text-[10px] text-slate-600">
            {t.dashboard.jobFocusHint}
          </p>
        </div>

        <ul className="mt-1 space-y-1.5 text-[11px] text-slate-700">
          <li className="flex items-start gap-1.5">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400" />
            {t.dashboard.jobSeekerPoint1}
          </li>
          <li className="flex items-start gap-1.5">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
            {t.dashboard.jobSeekerPoint2}
          </li>
          <li className="flex items-start gap-1.5">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-300" />
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

