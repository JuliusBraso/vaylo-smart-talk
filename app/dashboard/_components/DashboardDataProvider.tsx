import type { ReactNode } from "react";
import type { Dict, Locale } from "@/lib/i18n";
import { getDashboardActionsFromState } from "@/lib/dashboard/get-dashboard-actions-from-state";
import type { UserState } from "@/lib/vaylo/state/types";
import DashboardClientWrapper from "./DashboardClientWrapper";
import type { SupabaseClient } from "@supabase/supabase-js";

type Props = {
  supabase: SupabaseClient;
  userId: string;
  userState: UserState;
  locale: Locale;
  /** Server-resolved dictionary (see `getDict(locale)` on the dashboard page). */
  t: Dict;
  children: ReactNode;
};

export default async function DashboardDataProvider({
  supabase,
  userId,
  userState,
  locale,
  t,
  children,
}: Props) {
  const dna = userState.identity.dna;
  const liveSituation = userState.reality.liveSituation;

  if (!dna) {
    throw new Error("DashboardDataProvider: missing DNA after dashboard gate");
  }

  const actions = await getDashboardActionsFromState({
    supabase,
    userId,
    userState,
    t,
  });

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

