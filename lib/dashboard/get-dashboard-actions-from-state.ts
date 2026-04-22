import type { Dict } from "@/lib/i18n";
import { applyStepStateToDashboardActions } from "@/lib/dashboard/apply-step-state-to-dashboard-actions";
import type { BehaviorSignals } from "@/lib/dashboard/get-user-behavior-signals";
import { enrichActionsWithKnowledge } from "@/lib/dashboard/enrich-actions-with-knowledge";
import { getDashboardActions } from "@/lib/dashboard/get-dashboard-actions";
import type { DashboardAction } from "@/lib/dashboard/get-dashboard-actions";
import type { UserState } from "@/lib/vaylo/state/types";
import type { GetUserStepStateResult } from "@/lib/vaylo/steps/types";
import type { SupabaseClient } from "@supabase/supabase-js";

const dashboardCompatWarned = new Set<string>();

function warnDocJobHintsUnavailableOnce(reason: string) {
  if (process.env.NODE_ENV !== "development") return;
  const key = `doc_job_hints:${reason}`;
  if (dashboardCompatWarned.has(key)) return;
  dashboardCompatWarned.add(key);
  console.warn(`[dashboard] document job hints unavailable: ${reason}`);
}

function isCompatUnavailableErrorMessage(msg: string): boolean {
  const m = msg.toLowerCase();
  return (
    m.includes("does not exist") ||
    m.includes("missing relation") ||
    m.includes("unknown column") ||
    m.includes("column") && m.includes("does not exist")
  );
}

async function attachDocumentJobProcessingHints(params: {
  supabase: SupabaseClient;
  userId: string;
  actions: DashboardAction[];
  t: Dict;
}) {
  try {
    const { supabase, userId, actions, t } = params;
    const eligibleStepIds = actions
      .map((a) => (a.stepStatus === "eligible" ? a.knowledgeStepId : null))
      .filter((id): id is string => typeof id === "string" && id.length > 0);
    if (eligibleStepIds.length === 0) return actions;

    // Minimal job lookup: any queued/running doc job for this user.
    const { data: jobs, error: jobsErr } = await supabase
      .from("document_intelligence_jobs")
      .select("document_id, status")
      .eq("user_id", userId)
      .in("status", ["queued", "running"])
      .limit(50);
    if (jobsErr) {
      const msg = String((jobsErr as { message?: unknown })?.message ?? "");
      if (isCompatUnavailableErrorMessage(msg)) {
        warnDocJobHintsUnavailableOnce("missing document_intelligence_jobs table");
        return actions;
      }
      if (process.env.NODE_ENV === "development") {
        console.warn("[dashboard] doc job hints unavailable", {
          message: (jobsErr as { message?: unknown })?.message,
          details: (jobsErr as { details?: unknown })?.details,
          hint: (jobsErr as { hint?: unknown })?.hint,
        });
      }
      return actions;
    }
    const docIds = [
      ...new Set(
        (jobs ?? [])
          .map((j) => String((j as { document_id?: unknown }).document_id ?? ""))
          .filter((id) => id.length > 0),
      ),
    ];
    if (docIds.length === 0) return actions;

    const { data: docs, error: docsErr } = await supabase
      .from("user_documents")
      .select("id, document_type_id")
      .in("id", docIds)
      .eq("user_id", userId);
    if (docsErr) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[dashboard] doc job hints unavailable", {
          message: (docsErr as { message?: unknown })?.message,
          details: (docsErr as { details?: unknown })?.details,
          hint: (docsErr as { hint?: unknown })?.hint,
        });
      }
      return actions;
    }
    const typeIds = [
      ...new Set(
        (docs ?? [])
          .map((d) => String((d as { document_type_id?: unknown }).document_type_id ?? ""))
          .filter((id) => id.length > 0),
      ),
    ];
    if (typeIds.length === 0) return actions;

    const { data: links, error: linkErr } = await supabase
      .from("document_type_step_links")
      .select("step_id")
      .in("document_type_id", typeIds);
    if (linkErr) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[dashboard] doc job hints unavailable", {
          message: (linkErr as { message?: unknown })?.message,
          details: (linkErr as { details?: unknown })?.details,
          hint: (linkErr as { hint?: unknown })?.hint,
        });
      }
      return actions;
    }
    const stepIdsWithRunningDocs = new Set(
      (links ?? [])
        .map((l) => String((l as { step_id?: unknown }).step_id ?? ""))
        .filter((id) => id.length > 0),
    );

    const hint = t.dashboard.documentAnalyzingHint;
    return actions.map((a) => {
      if (a.stepStatus === "eligible" && a.knowledgeStepId && stepIdsWithRunningDocs.has(a.knowledgeStepId)) {
        return { ...a, processingHint: hint };
      }
      return a;
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes("document_intelligence_jobs") && isCompatUnavailableErrorMessage(msg)) {
      warnDocJobHintsUnavailableOnce("missing document_intelligence_jobs table");
      return params.actions;
    }
    console.error("[dashboard] doc job hints ERROR", err);
    return params.actions;
  }
}

/**
 * Bridge `UserState` into the existing dashboard engine.
 * When `stepState` is provided, non-critical Top 3 selection is step-first (see `step-first-non-critical-selection`),
 * then mapped actions receive process-state metadata for display (badges/hints).
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
    stepState,
  });

  const enriched = await enrichActionsWithKnowledge({ supabase, actions, t });
  const withStep = applyStepStateToDashboardActions(enriched, stepState, t);
  return attachDocumentJobProcessingHints({ supabase, userId, actions: withStep, t });
}
