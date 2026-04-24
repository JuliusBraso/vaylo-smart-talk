"use client";

import type { ProfileDNA } from "@/lib/dna/types";
import type { Dict } from "@/lib/i18n";
import type { ClientPhrase } from "@/lib/vaylo/client-phrase";
import { toClientPhrases } from "@/lib/vaylo/client-phrase";
import { getContentByDNA } from "@/lib/vaylo/content-engine";
import DashboardPhrasesCollapsible from "@/app/dashboard/_components/DashboardPhrasesCollapsible";

export type FamilyModuleProps = {
  dna: ProfileDNA;
  /** Server-resolved dictionary from `DashboardPage` / `DashboardShell` — never created on the client. */
  t: Dict;
  /** State-aware top phrases (server, `ClientPhrase`). */
  smartPhrases?: ClientPhrase[];
};

export default function FamilyModule({ dna, t, smartPhrases }: FamilyModuleProps) {
  const hasChildren = dna.inputs.family_status === "children";
  const content = getContentByDNA(dna);
  const phrases: ClientPhrase[] =
    smartPhrases ??
    toClientPhrases([...content.family, ...content.bureaucracy]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-800 shadow-sm">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
            {t.dashboard.familyModuleTitle}
          </h2>
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700 ring-1 ring-indigo-200">
            {t.dashboard.familyModuleBadge}
          </span>
        </div>

        <p className="text-[11px] text-slate-600">
          {t.dashboard.familyModuleIntro}
        </p>

        <div className="mt-1 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
          <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-600">
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

        <div className="mt-1 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
          <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-600">
            {t.dashboard.familyComingNext}
          </div>
          <p className="mt-1">
            {t.dashboard.familyComingNextDesc}
          </p>
        </div>

        {phrases.length > 0 && (
          <DashboardPhrasesCollapsible phrases={phrases} tone="indigo" t={t} />
        )}
      </div>
    </div>
  );
}

