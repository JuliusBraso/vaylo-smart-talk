import { supabase } from "@/lib/supabase/client";

export type ActionEventType = "click" | "complete";

export async function trackActionEvent(params: {
  userId: string;
  actionId: string;
  eventType: ActionEventType;
}): Promise<void> {
  try {
    const { error } = await supabase.from("user_action_events").insert({
      user_id: params.userId,
      action_id: params.actionId,
      event_type: params.eventType,
    });
    if (error) {
      console.warn("[Vaylo][action_tracking] insert failed", error);
    }
  } catch (e) {
    console.warn("[Vaylo][action_tracking] insert threw", e);
  }
}

