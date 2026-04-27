"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import type { ProfileDNA } from "@/lib/dna/types";
import type { Dict, Locale } from "@/lib/i18n";
import type { DashboardAction } from "@/lib/dashboard/get-dashboard-actions";
import type { RegionConfig } from "@/lib/vaylo/region/types";
import type { UserState } from "@/lib/vaylo/state/types";

const DashboardShell = dynamic(() => import("./DashboardShell"), { ssr: false });

type Props = {
  dna: ProfileDNA;
  locale: Locale;
  userId: string;
  actions: DashboardAction[];
  historyActions: DashboardAction[];
  userState: UserState;
  regionConfig?: RegionConfig | null;
  /** Server-resolved header copy (no client-side DNA branching for priority / summary). */
  activePriorityLabel: string;
  situationSummaryLine: string;
  /** Server-resolved dictionary (see `getDict(locale)` on the dashboard page). Not loaded here. */
  t: Dict;
  children: ReactNode;
};

/**
 * Client boundary: forwards server-resolved actions and display props to the shell.
 * Dashboard decisions live in `get-dashboard-actions` + `UserState` only.
 */
export default function DashboardClientWrapper({
  dna,
  locale,
  userId,
  actions,
  historyActions,
  userState,
  regionConfig,
  activePriorityLabel,
  situationSummaryLine,
  t,
  children,
}: Props) {
  return (
    <DashboardShell
      dna={dna}
      locale={locale}
      userId={userId}
      actions={actions}
      historyActions={historyActions}
      userState={userState}
      regionConfig={regionConfig}
      activePriorityLabel={activePriorityLabel}
      situationSummaryLine={situationSummaryLine}
      t={t}
    >
      {children}
    </DashboardShell>
  );
}
