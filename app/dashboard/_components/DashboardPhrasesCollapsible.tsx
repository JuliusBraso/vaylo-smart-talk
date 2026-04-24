"use client";

import { useId, useState } from "react";
import type { ClientPhrase } from "@/lib/vaylo/client-phrase";
import type { Dict } from "@/lib/i18n";
import PhraseChips from "@/app/dashboard/_components/PhraseChips";

type Tone = "indigo" | "emerald" | "cyan";

const TONE_STYLES: Record<
  Tone,
  {
    border: string;
    bg: string;
    title: string;
    subtitle: string;
    trigger: string;
    iconWrap: string;
  }
> = {
  indigo: {
    border: "border-slate-100",
    bg: "bg-slate-50",
    title: "text-slate-800",
    subtitle: "text-slate-600",
    trigger:
      "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    iconWrap: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  },
  emerald: {
    border: "border-slate-100",
    bg: "bg-slate-50",
    title: "text-slate-800",
    subtitle: "text-slate-600",
    trigger:
      "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    iconWrap: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  },
  cyan: {
    border: "border-slate-100",
    bg: "bg-slate-50",
    title: "text-slate-800",
    subtitle: "text-slate-600",
    trigger:
      "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    iconWrap: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  },
};

export type DashboardPhrasesCollapsibleProps = {
  phrases: ClientPhrase[];
  tone: Tone;
  t: Dict;
  defaultOpen?: boolean;
};

export default function DashboardPhrasesCollapsible({
  phrases,
  tone,
  t,
  defaultOpen = false,
}: DashboardPhrasesCollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const titleId = useId();
  const d = t.dashboard;
  const s = TONE_STYLES[tone];

  if (phrases.length === 0) return null;

  return (
    <div
      className={`mt-3 rounded-2xl border px-3 py-2.5 ${s.border} ${s.bg}`}
    >
      <div className="flex items-start gap-2.5">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base ring-1 ${s.iconWrap}`}
          aria-hidden
        >
          💬
        </div>
        <div className="min-w-0 flex-1">
          <div
            id={titleId}
            className={`text-[11px] font-semibold leading-tight ${s.title}`}
          >
            {d.phrasesModuleTitle}
          </div>
          <p
            className={`mt-0.5 text-[10px] leading-snug ${s.subtitle}`}
          >
            {d.phrasesModuleSubtitle}
          </p>
        </div>
        <button
          type="button"
          className={`shrink-0 rounded-xl border px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition-colors ${s.trigger}`}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? d.phrasesModuleCollapse : d.phrasesModuleExpand}
        </button>
      </div>

      <div
        id={panelId}
        role="region"
        aria-labelledby={titleId}
        hidden={!open}
        className={open ? "mt-3" : undefined}
      >
        {open ? (
          /* Phrases may be state-aware (server-ranked via UserState) or DNA-only fallback. */
          <PhraseChips phrases={phrases} tone={tone} />
        ) : null}
      </div>
    </div>
  );
}
