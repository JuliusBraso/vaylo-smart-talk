import type { Dict } from "@/lib/i18n";
import type { BehaviorSignals } from "@/lib/dashboard/get-user-behavior-signals";
import { getDashboardActions } from "@/lib/dashboard/get-dashboard-actions";
import type { UserState } from "@/lib/vaylo/state/types";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Bridge `UserState` into the existing dashboard engine without rewriting scoring/priority logic.
 */
export async function getDashboardActionsFromState(params: {
  supabase: SupabaseClient;
  userId: string;
  userState: UserState;
  t: Dict;
}) {
  const { supabase, userId, userState, t } = params;
  const dna = userState.identity.dna;
  if (!dna) {
    return [];
  }

  const behaviorSignals: BehaviorSignals = {
    completedActionIds: new Set(userState.progress.completedActionIds),
    repeatedClickActionIds: new Set(userState.behavior.repeatedClickActionIds),
    timeDecayBoost: new Map(
      Object.entries(userState.behavior.timeDecayBoost),
    ),
  };

  return getDashboardActions({
    supabase,
    userId,
    dna,
    liveSituation: userState.reality.liveSituation,
    t,
    behaviorSignals,
  });
}
