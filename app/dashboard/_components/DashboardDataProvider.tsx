import type { ReactNode } from "react";
import type { ProfileDNA } from "@/lib/dna/types";
import type { Dict, Locale } from "@/lib/i18n";
import type { LiveSituation } from "@/lib/vaylo/live-situation";
import { getDashboardActions } from "@/lib/dashboard/get-dashboard-actions";
import DashboardClientWrapper from "./DashboardClientWrapper";
import type { SupabaseClient } from "@supabase/supabase-js";

type Props = {
  supabase: SupabaseClient;
  userId: string;
  dna: ProfileDNA;
  locale: Locale;
  liveSituation: LiveSituation;
  /** Server-resolved dictionary (see `getDict(locale)` on the dashboard page). */
  t: Dict;
  children: ReactNode;
};

export default async function DashboardDataProvider({
  supabase,
  userId,
  dna,
  locale,
  liveSituation,
  t,
  children,
}: Props) {
  const actions = await getDashboardActions({
    supabase,
    userId,
    dna,
    liveSituation,
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

