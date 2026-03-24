"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

type IntentTopic = {
  id: string;
  keywords: string[];
  /** Short explanation shown after a match */
  explanation: string;
  /** Guide, form, and letter — 3 actions */
  actions: { label: string; href: string }[];
};

function lettersHref(p: {
  type: "email" | "letter";
  authority: string;
  context: string;
}): string {
  const q = new URLSearchParams({
    type: p.type,
    authority: p.authority,
    context: p.context,
  });
  return `/letters?${q.toString()}`;
}

const INTENT_TOPICS: IntentTopic[] = [
  {
    id: "anmeldung",
    keywords: [
      "anmeldung",
      "address",
      "register address",
      "register my address",
    ],
    explanation:
      "That sounds like address registration (Anmeldung). Start with the guide, then the form; use Letters to contact the Bürgeramt if you need an appointment.",
    actions: [
      { label: "Guide: Anmeldung", href: "/guides/anmeldung" },
      { label: "Form: Anmeldung", href: "/forms/anmeldung-form" },
      {
        label: "Letter: Bürgeramt (appointment)",
        href: lettersHref({
          type: "email",
          authority: "Bürgeramt",
          context: "I need an appointment for Anmeldung",
        }),
      },
    ],
  },
  {
    id: "steuer-id",
    keywords: ["steuer", "tax id", "steuernummer", "steuer-id", "steuer id"],
    explanation:
      "That points to tax ID (Steuer-ID) topics. Follow the guide, check the Finanzamt form help, or draft a letter to the Finanzamt.",
    actions: [
      { label: "Guide: Steuer-ID", href: "/guides/steuer-id" },
      { label: "Form: Steuer number", href: "/forms/steuer-number-registration" },
      {
        label: "Letter: Finanzamt (Steuer-ID)",
        href: lettersHref({
          type: "email",
          authority: "Finanzamt",
          context: "I need help regarding my Steuer-ID",
        }),
      },
    ],
  },
  {
    id: "kindergeld",
    keywords: ["kindergeld", "child benefit"],
    explanation:
      "That matches Kindergeld (child benefit). Open the guide and main application form, or write to the Familienkasse.",
    actions: [
      { label: "Guide: Kindergeld", href: "/guides/kindergeld" },
      { label: "Form: Kindergeld application", href: "/forms/kindergeld-main-application" },
      {
        label: "Letter: Familienkasse (status)",
        href: lettersHref({
          type: "email",
          authority: "Familienkasse",
          context: "I want to ask about my Kindergeld application status",
        }),
      },
    ],
  },
  {
    id: "health-insurance",
    keywords: ["insurance", "krankenkasse", "health insurance"],
    explanation:
      "That sounds like statutory health insurance (Krankenkasse). Use the guide and membership form, or contact your insurer by letter.",
    actions: [
      { label: "Guide: Health insurance", href: "/guides/health-insurance" },
      { label: "Form: Health insurance", href: "/forms/health-insurance-membership" },
      {
        label: "Letter: Health insurance",
        href: lettersHref({
          type: "email",
          authority: "Health Insurance",
          context: "I want to request health insurance membership information",
        }),
      },
    ],
  },
  {
    id: "residence-permit",
    keywords: [
      "residence permit",
      "permit extension",
      "ausländerbehörde",
      "auslaenderbehoerde",
    ],
    explanation:
      "That fits residence permit or Ausländerbehörde tasks. See the extension guide, the application form, or draft a letter to the immigration office.",
    actions: [
      { label: "Guide: Residence permit", href: "/guides/residence-permit" },
      { label: "Form: Extension application", href: "/forms/residence-extension-application" },
      {
        label: "Letter: Ausländerbehörde (extension)",
        href: lettersHref({
          type: "email",
          authority: "Ausländerbehörde",
          context: "I want to request a residence permit extension",
        }),
      },
    ],
  },
];

function pickIntentTopic(message: string): IntentTopic | null {
  const n = message.toLowerCase().trim();
  if (!n) return null;

  let best: IntentTopic | null = null;
  let bestScore = 0;

  for (const topic of INTENT_TOPICS) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (n.includes(kw.toLowerCase())) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = topic;
    }
  }

  return bestScore > 0 ? best : null;
}

const FALLBACK_EXPLANATION =
  "The Assistant does not use an AI API yet. It matches a few core bureaucracy topics (Anmeldung, tax ID, Kindergeld, health insurance, residence permit). For anything else, browse step-by-step help in Guides.";

const FALLBACK_ACTIONS: { label: string; href: string }[] = [
  { label: "Open Guides", href: "/guides" },
  { label: "Browse Forms", href: "/forms" },
  { label: "Letters tool", href: "/letters" },
];

type AssistantBlock = {
  summary: string;
  isFallback: boolean;
  actions: { label: string; href: string }[];
};

function buildBlockFromMessage(text: string): AssistantBlock {
  const topic = pickIntentTopic(text);
  if (topic) {
    return {
      summary: topic.explanation,
      isFallback: false,
      actions: topic.actions,
    };
  }
  return {
    summary: FALLBACK_EXPLANATION,
    isFallback: true,
    actions: FALLBACK_ACTIONS,
  };
}

export default function Page() {
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

    const block = buildBlockFromMessage(text);

    setMessages((prev) => [
      ...prev,
      { role: "user", text },
      { role: "assistant", block },
    ]);
    setInput("");
  }, []);

  return (
    <main className="container">
      <div className="card" style={{ display: "grid", gap: 14 }}>
        <div className="cardHeader">
          <div className="cardTitle">Assistant</div>
          <div className="cardSub muted">
            Describe your bureaucracy question. We match keywords and suggest
            Guides, Forms, and Letters — no AI API yet.
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
              Try: “I need to register my address” (Anmeldung) or “Kindergeld
              status”.
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
                      No keyword match
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
            placeholder="Type your message…"
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
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
