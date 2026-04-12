import type { ReactNode } from "react";
import type { DashboardAction } from "@/lib/dashboard/get-dashboard-actions";
import { getDashboardActionsFromState } from "@/lib/dashboard/get-dashboard-actions-from-state";
import type { Dict, Locale } from "@/lib/i18n";
import { formatMessage } from "@/lib/i18n/format";
import {
  getEmploymentLabel,
  getGoalLabel,
  getLanguageLabel,
} from "@/lib/i18n/labels";
import type { UserState } from "@/lib/vaylo/state/types";
import DashboardClientWrapper from "./DashboardClientWrapper";
import type { SupabaseClient } from "@supabase/supabase-js";

type Props = {
  supabase: SupabaseClient;
  userId: string;
  userState: UserState;
  /** From `loadUserStateContext` to avoid resolving actions twice. */
  dashboardActions?: DashboardAction[];
  locale: Locale;
  /** Server-resolved dictionary (see `getDict(locale)` on the dashboard page). */
  t: Dict;
  children: ReactNode;
};

export default async function DashboardDataProvider({
  supabase,
  userId,
  userState,
  dashboardActions: dashboardActionsProp,
  locale,
  t,
  children,
}: Props) {
  const dna = userState.identity.dna;

  if (!dna) {
    throw new Error("DashboardDataProvider: missing DNA after dashboard gate");
  }

  const actions =
    dashboardActionsProp ??
    (await getDashboardActionsFromState({
      supabase,
      userId,
      userState,
      t,
    }));

  const primaryGoal = dna.priority?.[0] ?? "orientation";
  const activePriorityLabel =
    primaryGoal === "job"
      ? t.dashboard.priorityJob
      : primaryGoal === "bureaucracy"
        ? t.dashboard.priorityBureaucracy
        : primaryGoal === "family_admin"
          ? t.dashboard.priorityFamilyAdmin
          : t.dashboard.priorityOrientation;

  const situationSummaryLine = formatMessage(t.dashboard.actionSituationSummary, {
    employment: getEmploymentLabel(dna.inputs.employment_type, t),
    goal: getGoalLabel(dna.inputs.goals[0] ?? "orientation", t),
    language: getLanguageLabel(dna.inputs.language_level, t),
  });

  return (
    <DashboardClientWrapper
      dna={dna}
      locale={locale}
      userId={userId}
      actions={actions}
      activePriorityLabel={activePriorityLabel}
      situationSummaryLine={situationSummaryLine}
      t={t}
    >
      {children}
    </DashboardClientWrapper>
  );
}

