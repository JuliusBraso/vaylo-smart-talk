import type { SupabaseClient } from "@supabase/supabase-js";
import { normalizeDashboardActionId } from "@/lib/dashboard/action-id-normalization";

export type BehaviorSignals = {
  completedActionIds: Set<string>;
  repeatedClickActionIds: Set<string>;
  timeDecayBoost: Map<string, number>;
};

export async function getUserBehaviorSignals(
  supabase: SupabaseClient,
  userId: string
): Promise<BehaviorSignals> {
  const completedActionIds = new Set<string>();
  const repeatedClickActionIds = new Set<string>();
  const timeDecayBoost = new Map<string, number>();

  // 1) Completed actions
  {
    const { data, error } = await supabase
      .from("user_progress")
      .select("action_id")
      .eq("user_id", userId)
      .eq("status", "completed");

    if (!error && data) {
      for (const r of data as Array<{ action_id?: unknown }>) {
        const raw = typeof r.action_id === "string" ? r.action_id : "";
        if (!raw) continue;
        completedActionIds.add(normalizeDashboardActionId(raw));
      }
    }
  }

  // 2) Repeated clicks (>=2 clicks, 0 completes) per action_id
  // 3) Time-decay boost for ignored actions (based on last click timestamp)
  {
    const { data, error } = await supabase
      .from("user_action_events")
      .select("action_id,event_type,created_at")
      .eq("user_id", userId);

    if (!error && data) {
      const nowMs = Date.now();
      const counts = new Map<
        string,
        { clicks: number; completes: number; lastClickMs: number | null }
      >();
      for (const r of data as Array<{
        action_id?: unknown;
        event_type?: unknown;
        created_at?: unknown;
      }>) {
        const rawActionId = typeof r.action_id === "string" ? r.action_id : "";
        const rawEventType = typeof r.event_type === "string" ? r.event_type : "";
        if (!rawActionId) continue;
        const actionId = normalizeDashboardActionId(rawActionId);
        const cur =
          counts.get(actionId) ?? { clicks: 0, completes: 0, lastClickMs: null };
        if (rawEventType === "click") cur.clicks += 1;
        if (rawEventType === "complete") cur.completes += 1;
        if (rawEventType === "click" && typeof r.created_at === "string") {
          const ms = Date.parse(r.created_at);
          if (Number.isFinite(ms)) {
            cur.lastClickMs = cur.lastClickMs == null ? ms : Math.max(cur.lastClickMs, ms);
          }
        }
        counts.set(actionId, cur);
      }

      for (const [actionId, c] of counts) {
        if (c.clicks >= 2 && c.completes === 0) {
          repeatedClickActionIds.add(actionId);
        }
      }

      // Time-based prioritization for ignored actions.
      for (const [actionId, c] of counts) {
        if (c.completes > 0) continue;
        if (c.lastClickMs == null) continue;

        const ageMs = nowMs - c.lastClickMs;
        const ageHours = ageMs / (1000 * 60 * 60);

        let boost = 0;
        if (ageHours < 2) {
          boost = 0;
        } else if (ageHours >= 72 && c.clicks >= 2) {
          boost = 30;
        } else if (ageHours >= 24 && c.clicks >= 1) {
          boost = 15;
        }

        if (boost > 0) {
          timeDecayBoost.set(actionId, Math.min(30, boost));
        }
      }
    }
  }

  return { completedActionIds, repeatedClickActionIds, timeDecayBoost };
}

