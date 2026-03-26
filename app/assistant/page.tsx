"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getIntentBoostsFromProfile } from "@/lib/assistant/dna-intent-boost";
import { getUserContextFromProfile } from "@/lib/assistant/user-context";
import { buildBlockFromMessage } from "@/lib/assistant/match-intent";
import { getIntentTopics } from "@/lib/assistant/intent-topics";
import type { AssistantBlock } from "@/lib/assistant/types";
import { useT } from "@/lib/i18n/useT";
import { getMyProfile } from "@/lib/profile";
import { supabase } from "@/lib/supabase";

export default function Page() {
  const { t } = useT();
  const intentTopics = useMemo(() => getIntentTopics(t), [t]);
  const [intentBoosts, setIntentBoosts] = useState<Record<string, number> | null>(null);
  const [userContext, setUserContext] = useState<ReturnType<typeof getUserContextFromProfile> | null>(null);
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    Array<
      | { role: "user"; text: string }
      | { role: "assistant"; block: AssistantBlock }
    >
  >([]);

  const runMatch = useCallback((raw: string) => {
    const text = raw.trim();
    if (!text) return;

    const block = buildBlockFromMessage(
      text,
      t,
      intentTopics,
      intentBoosts,
      userContext,
    );

    setMessages((prev) => [
      ...prev,
      { role: "user", text },
      { role: "assistant", block },
    ]);
    setInput("");
  }, [intentBoosts, intentTopics, t, userContext]);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadIntentBoosts() {
      const { profile } = await getMyProfile(supabase);
      if (cancelled) return;
      setIntentBoosts(getIntentBoostsFromProfile(profile));
      const ctx = getUserContextFromProfile(profile);
      setUserContext(Object.keys(ctx).length > 0 ? ctx : null);
    }

    void loadIntentBoosts();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!mounted) return null;

  return (
    <main className="container">
      <div className="card" style={{ display: "grid", gap: 14 }}>
        <div className="cardHeader">
          <div className="cardTitle">{t.assistant.title}</div>
          <div className="cardSub muted">
            {t.assistant.subtitle}
          </div>
        </div>

        <div
          style={{
            minHeight: 320,
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.02)",
            padding: 12,
            display: "grid",
            gap: 12,
            alignContent: "start",
          }}
        >
          {messages.length === 0 ? (
            <div
              className="muted"
              style={{ fontSize: 13, textAlign: "center", padding: 24 }}
            >
              {t.assistant.emptyHint}
            </div>
          ) : (
            messages.map((m, i) =>
              m.role === "user" ? (
                <div
                  key={`u-${i}`}
                  style={{
                    justifySelf: "end",
                    maxWidth: "min(100%, 520px)",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(79,156,255,0.12)",
                    padding: "10px 12px",
                    fontSize: 14,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {m.text}
                </div>
              ) : (
                <div
                  key={`a-${i}`}
                  style={{
                    justifySelf: "stretch",
                    display: "grid",
                    gap: 12,
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.03)",
                    padding: 12,
                  }}
                >
                  <div style={{ fontSize: 13, lineHeight: 1.45 }}>
                    {m.block.summary}
                  </div>
                  {m.block.isFallback ? (
                    <div className="badgeSmall" style={{ width: "fit-content" }}>
                      {t.assistant.noKeywordMatch}
                    </div>
                  ) : null}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    {m.block.actions.map((a) => (
                      <Link
                        key={a.label + a.href}
                        href={a.href}
                        className="pill"
                        style={{
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        {a.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ),
            )
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 10,
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder={t.assistant.inputPlaceholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                runMatch(input);
              }
            }}
            style={{
              height: 42,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.92)",
              padding: "0 12px",
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={() => runMatch(input)}
            style={{
              height: 42,
              padding: "0 16px",
              borderRadius: 12,
              border: "1px solid rgba(79,156,255,0.45)",
              background: "rgba(79,156,255,0.16)",
              color: "rgba(255,255,255,0.92)",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {t.assistant.send}
          </button>
        </div>
      </div>
    </main>
  );
}
