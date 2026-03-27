"use client";

import type { ProfileDNA } from "@/lib/dna/types";
import type { Dict } from "@/lib/i18n";
import { getContentByDNA } from "@/lib/vaylo/content-engine";
import PhraseChips from "@/app/dashboard/_components/PhraseChips";

export type FamilyModuleProps = {
  dna: ProfileDNA;
  /** Server-resolved dictionary from `DashboardPage` / `DashboardShell` — never created on the client. */
  t: Dict;
};

export default function FamilyModule({ dna, t }: FamilyModuleProps) {
  const hasChildren = dna.inputs.family_status === "children";
  const content = getContentByDNA(dna);
  const phrases = [...content.family, ...content.bureaucracy];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-indigo-400/40 bg-slate-950/80 p-4 text-sm text-slate-100 shadow-[0_0_36px_rgba(79,70,229,0.55)] backdrop-blur-2xl md:col-span-1">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0_100%,rgba(129,140,248,0.28),transparent_55%),radial-gradient(circle_at_100%_0,rgba(236,72,153,0.25),transparent_55%)]" />
      <div className="relative flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200">
            {t.dashboard.familyModuleTitle}
          </h2>
          <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-medium text-indigo-100 ring-1 ring-indigo-400/60">
            {t.dashboard.familyModuleBadge}
          </span>
        </div>

        <p className="text-[11px] text-indigo-100/85">
          {t.dashboard.familyModuleIntro}
        </p>

        <div className="mt-1 rounded-2xl border border-indigo-400/50 bg-indigo-900/40 px-3 py-2 text-[11px] text-indigo-50">
          <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-indigo-200/80">
            {t.dashboard.familyImmediateFocus}
          </div>
          <ul className="mt-1 space-y-1.5">
            {hasChildren ? (
              <>
                <li>{t.dashboard.familyWithChildrenPoint1}</li>
                <li>{t.dashboard.familyWithChildrenPoint2}</li>
                <li>{t.dashboard.familyWithChildrenPoint3}</li>
              </>
            ) : (
              <>
                <li>{t.dashboard.familyWithoutChildrenPoint1}</li>
                <li>{t.dashboard.familyWithoutChildrenPoint2}</li>
                <li>{t.dashboard.familyWithoutChildrenPoint3}</li>
              </>
            )}
          </ul>
        </div>

        <div className="mt-1 rounded-2xl border border-fuchsia-400/40 bg-fuchsia-900/30 px-3 py-2 text-[11px] text-fuchsia-50">
          <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-fuchsia-200/85">
            {t.dashboard.familyComingNext}
          </div>
          <p className="mt-1">
            {t.dashboard.familyComingNextDesc}
          </p>
        </div>

        {phrases.length > 0 && (
          <div className="mt-3 rounded-2xl border border-indigo-400/40 bg-slate-950/70 px-3 py-2">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-200/85">
              {t.dashboard.quickPhrases}
            </div>
            <PhraseChips phrases={phrases} tone="indigo" />
          </div>
        )}
      </div>
    </div>
  );
}

