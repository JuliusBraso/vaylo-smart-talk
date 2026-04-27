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
import type { RegionConfig } from "@/lib/vaylo/region/types";
import type { GetUserStepStateResult } from "@/lib/vaylo/steps/types";
import DashboardClientWrapper from "./DashboardClientWrapper";
import type { SupabaseClient } from "@supabase/supabase-js";

type Props = {
  supabase: SupabaseClient;
  userId: string;
  userState: UserState;
  /** From `loadUserStateContext` to avoid resolving actions twice. */
  dashboardActions?: DashboardAction[];
  /** Presentation-only: completed/auto-resolved step timeline (does not affect Top 3). */
  historyActions?: DashboardAction[];
  /** When refetching actions inside the provider, keeps step-state alignment. */
  stepState?: GetUserStepStateResult;
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
  historyActions: historyActionsProp,
  stepState,
  locale,
  t,
  children,
}: Props) {
  const dna = userState.identity.dna;
  const regionConfig: RegionConfig | null | undefined = userState.regionConfig;

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
      stepState,
    }));

  if (process.env.NODE_ENV === "development") {
    const primaryAction = actions[0];
    console.info("[dashboard:data]", {
      dashboardActionsLength: actions.length,
      primaryAction: primaryAction
        ? { id: primaryAction.id, title: primaryAction.title }
        : null,
      dnaVersion: userState.identity.dna?.version ?? null,
    });
  }

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
      historyActions={historyActionsProp ?? []}
      userState={userState}
      regionConfig={regionConfig ?? null}
      activePriorityLabel={activePriorityLabel}
      situationSummaryLine={situationSummaryLine}
      t={t}
    >
      {children}
    </DashboardClientWrapper>
  );
}

