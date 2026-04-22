"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/client";

export function useStepStateRealtime(params: {
  userId: string | null;
  onRefreshRequested: () => void;
  debounceMs?: number;
}) {
  const { userId, onRefreshRequested } = params;
  const debounceMs = params.debounceMs ?? 750;

  const lastUpdatedAtRef = useRef<number>(0);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`user_step_state:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_step_state",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const row = (payload.new ?? payload.old ?? {}) as { updated_at?: unknown };
          const updatedAtIso = typeof row.updated_at === "string" ? row.updated_at : "";
          const updatedAtMs = updatedAtIso ? Date.parse(updatedAtIso) : 0;
          if (updatedAtMs && updatedAtMs <= lastUpdatedAtRef.current) {
            return;
          }
          if (updatedAtMs) {
            lastUpdatedAtRef.current = updatedAtMs;
          }

          if (process.env.NODE_ENV === "development") {
            // eslint-disable-next-line no-console
            console.info("[realtime] step update received", payload.eventType);
          }

          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
          }
          debounceTimerRef.current = setTimeout(() => {
            onRefreshRequested();
          }, debounceMs);
        },
      )
      .subscribe();

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      void supabase.removeChannel(channel);
    };
  }, [userId, debounceMs, onRefreshRequested]);
}

