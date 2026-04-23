import type { SupabaseClient } from "@supabase/supabase-js";
import type { DashboardAction } from "@/lib/dashboard/get-dashboard-actions";
import { getDashboardActionsFromState } from "@/lib/dashboard/get-dashboard-actions-from-state";
import { getDashboardHistoryActions } from "@/lib/dashboard/get-dashboard-history-actions";
import type { Dict } from "@/lib/i18n";
import { getUserState } from "./get-user-state";
import type { UserState } from "./types";
import { getUserStepState } from "@/lib/vaylo/steps/get-user-step-state";
import type { GetUserStepStateResult } from "@/lib/vaylo/steps/types";

/**
 * Shared server bundle: one `getUserState` + dashboard actions from that state.
 * Use from authenticated routes (dashboard, chat) to avoid divergent loading paths.
 */
export type LoadedUserStateContext = {
  userState: UserState;
  /** Empty when `userState.identity.dna` is null (caller should redirect to onboarding). */
  dashboardActions: DashboardAction[];
  /** Presentation-only: completed/auto-resolved step timeline (does not affect Top 3). */
  historyActions: DashboardAction[];
  /**
   * Resolved per-step state (foundation for future step-driven dashboard/workflows).
   * Always computed from the knowledge graph + progress + proof + persisted rows.
   */
  stepState: GetUserStepStateResult;
};

export async function loadUserStateContext(params: {
  supabase: SupabaseClient;
  userId: string;
  t: Dict;
}): Promise<LoadedUserStateContext> {
  const { supabase, userId, t } = params;
  const userState = await getUserState({ supabase, userId });

  const stepState = await getUserStepState({ supabase, userId, userState });

  const dashboardActions =
    userState.identity.dna != null
      ? await getDashboardActionsFromState({
          supabase,
          userId,
          userState,
          t,
          stepState,
        })
      : [];

  const historyActions = await getDashboardHistoryActions({
    supabase,
    stepState,
    t,
    limit: 8,
  });

  return { userState, dashboardActions, historyActions, stepState };
}
