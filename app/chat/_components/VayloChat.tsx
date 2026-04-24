"use client";

import { useMemo, useState } from "react";
import type { Dict } from "@/lib/i18n";
import type { DashboardAction } from "@/lib/dashboard/get-dashboard-actions";
import { getAssistantResponse } from "@/lib/vaylo/assistant/get-assistant-response";

export default function VayloChat(props: { t: Dict; actions: DashboardAction[] }) {
  const { t, actions } = props;
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<string>("");
  const [lastSuggestedActionId, setLastSuggestedActionId] = useState<string | null>(
    null
  );

  const placeholder = useMemo(
    () => t.chat.inputPlaceholder,
    [t]
  );

  return (
    <main className="min-h-[calc(100vh-64px)] bg-white">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <div className="text-base font-semibold text-slate-900">{t.chat.title}</div>
            <div className="mt-1 text-sm text-slate-600">{t.chat.subtitle}</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm">
            <div className="min-h-[220px] whitespace-pre-wrap">
              {response ? response : t.chat.emptyHint}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const text = input.trim();
              if (!text) return;
              const res = getAssistantResponse({
                message: text,
                actions,
                t,
                lastSuggestedActionId,
              });
              setResponse(res.text);
              if (res.actionId) setLastSuggestedActionId(res.actionId);
            }}
            className="mt-4 grid gap-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-200 focus:ring-4 focus:ring-indigo-200/60"
            />
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-200/70"
            >
              {t.chat.send}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

