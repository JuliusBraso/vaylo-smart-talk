import type { Dict } from "@/lib/i18n";
import { applyStepStateToDashboardActions } from "@/lib/dashboard/apply-step-state-to-dashboard-actions";
import type { BehaviorSignals } from "@/lib/dashboard/get-user-behavior-signals";
import { enrichActionsWithKnowledge } from "@/lib/dashboard/enrich-actions-with-knowledge";
import { getDashboardActions } from "@/lib/dashboard/get-dashboard-actions";
import type { UserState } from "@/lib/vaylo/state/types";
import type { GetUserStepStateResult } from "@/lib/vaylo/steps/types";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Bridge `UserState` into the existing dashboard engine without rewriting scoring/priority logic.
 * When `stepState` is provided, mapped actions get process-state metadata and a safe reorder of non-critical cards.
 */
export async function getDashboardActionsFromState(params: {
  supabase: SupabaseClient;
  userId: string;
  userState: UserState;
  t: Dict;
  stepState?: GetUserStepStateResult;
}) {
  const { supabase, userId, userState, t, stepState } = params;
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

  const actions = await getDashboardActions({
    supabase,
    userId,
    dna,
    liveSituation: userState.reality.liveSituation,
    t,
    behaviorSignals,
  });

  const enriched = await enrichActionsWithKnowledge({ supabase, actions, t });
  return applyStepStateToDashboardActions(enriched, stepState, t);
}
