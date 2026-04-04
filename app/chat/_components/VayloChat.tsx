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
    <main className="container">
      <div className="card" style={{ display: "grid", gap: 12 }}>
        <div className="cardHeader">
          <div className="cardTitle">{t.chat.title}</div>
          <div className="cardSub muted">{t.chat.subtitle}</div>
        </div>

        <div
          style={{
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.02)",
            padding: 12,
            minHeight: 220,
            whiteSpace: "pre-wrap",
            fontSize: 14,
          }}
        >
          {response ? response : t.chat.emptyHint}
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
          style={{ display: "grid", gap: 10 }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="input"
          />
          <button type="submit" className="button">
            {t.chat.send}
          </button>
        </form>
      </div>
    </main>
  );
}

