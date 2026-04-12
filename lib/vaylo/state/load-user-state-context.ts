import type { SupabaseClient } from "@supabase/supabase-js";
import type { DashboardAction } from "@/lib/dashboard/get-dashboard-actions";
import { getDashboardActionsFromState } from "@/lib/dashboard/get-dashboard-actions-from-state";
import type { Dict } from "@/lib/i18n";
import { getUserState } from "./get-user-state";
import type { UserState } from "./types";

/**
 * Shared server bundle: one `getUserState` + dashboard actions from that state.
 * Use from authenticated routes (dashboard, chat) to avoid divergent loading paths.
 */
export type LoadedUserStateContext = {
  userState: UserState;
  /** Empty when `userState.identity.dna` is null (caller should redirect to onboarding). */
  dashboardActions: DashboardAction[];
};

export async function loadUserStateContext(params: {
  supabase: SupabaseClient;
  userId: string;
  t: Dict;
}): Promise<LoadedUserStateContext> {
  const { supabase, userId, t } = params;
  const userState = await getUserState({ supabase, userId });

  const dashboardActions =
    userState.identity.dna != null
      ? await getDashboardActionsFromState({
          supabase,
          userId,
          userState,
          t,
        })
      : [];

  return { userState, dashboardActions };
}
