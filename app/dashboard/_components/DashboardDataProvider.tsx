import type { ReactNode } from "react";
import type { DashboardAction } from "@/lib/dashboard/get-dashboard-actions";
import { getDashboardActionsFromState } from "@/lib/dashboard/get-dashboard-actions-from-state";
import type { Dict, Locale } from "@/lib/i18n";
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
  const liveSituation = userState.reality.liveSituation;

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

  return (
    <DashboardClientWrapper
      dna={dna}
      locale={locale}
      liveSituation={liveSituation}
      userId={userId}
      actions={actions}
      t={t}
    >
      {children}
    </DashboardClientWrapper>
  );
}

