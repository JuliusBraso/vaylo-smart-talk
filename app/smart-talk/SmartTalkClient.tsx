"use client";

import { useCallback, useRef, useState, type CSSProperties } from "react";

const MAX_TEXT_LENGTH = 12000;
const RECOMMENDED_TEXT_LENGTH = 4000;

type SmartTalkResult = {
  summary: string;
  meaning: string;
  urgency: string;
  nextSteps: string[];
  warnings: string[];
};

type SmartTalkOkResponse = {
  ok: true;
  mode: string;
  context: string;
  result: SmartTalkResult;
};

function isRecord(x: unknown): x is Record<string, unknown> {
  return x !== null && typeof x === "object";
}

function parseSmartTalkResponse(data: unknown): SmartTalkOkResponse | null {
  if (!isRecord(data) || data.ok !== true) return null;
  if (typeof data.mode !== "string" || typeof data.context !== "string") return null;
  const result = data.result;
  if (!isRecord(result)) return null;

  const summary = typeof result.summary === "string" ? result.summary : "";
  const meaning = typeof result.meaning === "string" ? result.meaning : "";
  const urgency = typeof result.urgency === "string" ? result.urgency : "unknown";

  const nextSteps: string[] = [];
  if (Array.isArray(result.nextSteps)) {
    for (const item of result.nextSteps) {
      if (typeof item === "string" && item.trim()) nextSteps.push(item);
    }
  }

  const warnings: string[] = [];
  if (Array.isArray(result.warnings)) {
    for (const item of result.warnings) {
      if (typeof item === "string" && item.trim()) warnings.push(item);
    }
  }

  return {
    ok: true,
    mode: data.mode,
    context: data.context,
    result: { summary, meaning, urgency, nextSteps, warnings },
  };
}

const MSG = {
  badInput:
    "Text je príliš krátky alebo neplatný. Skúste vložiť časť listu alebo formulára.",
  rateLimited: "Príliš veľa pokusov. Skúste to znova neskôr.",
  unavailable: "Služba Smart Talk momentálne nie je dostupná.",
  timeout: "Vysvetlenie trvalo príliš dlho. Skúste kratší text alebo to skúste znova.",
  fallback: "Nepodarilo sa vysvetliť text. Skúste to znova.",
} as const;

const URGENCY_SK: Record<string, string> = {
  low: "nízka",
  medium: "stredná",
  high: "vysoká",
  unknown: "neznáma",
};

function messageForStatus(status: number): string {
  if (status === 400) return MSG.badInput;
  if (status === 429) return MSG.rateLimited;
  if (status === 503) return MSG.unavailable;
  if (status === 504) return MSG.timeout;
  return MSG.fallback;
}

function sectionTitleStyle(): CSSProperties {
  return {
    margin: "0 0 6px",
    fontSize: 12,
    fontWeight: 800,
    color: "var(--muted2)",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  };
}

export default function SmartTalkClient() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SmartTalkResult | null>(null);
  const busyRef = useRef(false);

  const trimmedLen = text.trim().length;
  const overMaxLength = trimmedLen > MAX_TEXT_LENGTH;
  const showLengthRecommendation =
    trimmedLen > RECOMMENDED_TEXT_LENGTH && trimmedLen <= MAX_TEXT_LENGTH;
  const submitDisabled =
    loading || trimmedLen < 8 || trimmedLen > MAX_TEXT_LENGTH;

  const onSubmit = useCallback(async () => {
    const trimmed = text.trim();
    if (trimmed.length < 8 || trimmed.length > MAX_TEXT_LENGTH || busyRef.current) return;
    busyRef.current = true;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/smart-talk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: "anonymous",
          inputType: "text",
          locale: "sk",
          text: trimmed,
        }),
      });

      let data: unknown = null;
      try {
        data = (await res.json()) as unknown;
      } catch {
        data = null;
      }

      const okParsed = parseSmartTalkResponse(data);
      if (res.ok && okParsed) {
        setResult(okParsed.result);
        return;
      }

      setError(messageForStatus(res.status));
    } catch {
      setError(MSG.fallback);
    } finally {
      busyRef.current = false;
      setLoading(false);
    }
  }, [text]);

  const urgencyLabel = result ? URGENCY_SK[result.urgency] ?? result.urgency : "";

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--muted)" }}>
          Najlepšie funguje, keď vložíte najdôležitejšiu časť listu alebo formulára.
        </p>
        <p style={{ margin: 0, fontSize: 12, lineHeight: 1.45, color: "var(--muted2)" }}>
          Limit: maximálne 12 000 znakov.
        </p>
      </div>

      <label htmlFor="smart-talk-input" className="sr-only">
        Text dokumentu
      </label>
      <textarea
        id="smart-talk-input"
        name="smart-talk-text"
        rows={8}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Sem vložte text z listu, úradu alebo formulára…"
        className="w-full resize-y rounded-[var(--r12)] border border-[var(--border)] bg-[var(--bg0)] px-3 py-3 text-[15px] leading-relaxed text-[var(--text)] outline-none placeholder:text-[var(--muted2)] focus:border-[color:rgba(199,210,254,1)] focus:shadow-[0_0_0_3px_rgba(199,210,254,0.45)] min-h-[168px]"
        disabled={loading}
      />

      <div
        style={{
          marginTop: -6,
          textAlign: "right",
          fontSize: 12,
          lineHeight: 1.4,
          color: "var(--muted2)",
          letterSpacing: "0.02em",
        }}
      >
        {`${trimmedLen.toLocaleString("sk-SK")} / 12 000`}
      </div>

      {overMaxLength ? (
        <p style={{ margin: "-4px 0 0", fontSize: 13, lineHeight: 1.5, color: "rgba(127, 29, 29, 0.88)" }}>
          Text je príliš dlhý. Skráťte ho na maximálne 12 000 znakov.
        </p>
      ) : showLengthRecommendation ? (
        <p style={{ margin: "-4px 0 0", fontSize: 13, lineHeight: 1.5, color: "var(--muted2)" }}>
          Pre najlepší výsledok odporúčame vložiť iba najdôležitejšiu časť listu alebo formulára.
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => void onSubmit()}
        disabled={submitDisabled}
        aria-busy={loading}
        style={{
          width: "100%",
          height: 44,
          borderRadius: "var(--r999)",
          border: "1px solid var(--accentBorder)",
          background: "var(--accent)",
          color: "rgba(255,255,255,0.98)",
          fontWeight: 800,
          fontSize: 15,
          cursor: submitDisabled ? "not-allowed" : "pointer",
          opacity: submitDisabled ? 0.55 : 1,
        }}
      >
        Vysvetliť text
      </button>

      <div
        aria-live="polite"
        style={{
          marginTop: 4,
          padding: "14px 16px",
          borderRadius: "var(--r16)",
          border: error
            ? "1px solid rgba(248, 113, 113, 0.45)"
            : result || loading
              ? "1px solid rgba(226, 232, 240, 1)"
              : "1px dashed rgba(203, 213, 225, 1)",
          background: error ? "rgba(254, 242, 242, 1)" : "rgba(248, 250, 252, 1)",
          minHeight: 88,
          fontSize: 14,
          lineHeight: 1.55,
          color: "var(--muted)",
        }}
      >
        {loading ? (
          <p style={{ margin: 0 }}>Vaylo vysvetľuje text…</p>
        ) : error ? (
          <p style={{ margin: 0, color: "rgba(127, 29, 29, 0.92)" }}>{error}</p>
        ) : result ? (
          <div style={{ display: "grid", gap: 18 }}>
            <section>
              <h2 style={sectionTitleStyle()}>Zhrnutie</h2>
              <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{result.summary}</p>
            </section>
            <section>
              <h2 style={sectionTitleStyle()}>Čo to znamená</h2>
              <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{result.meaning}</p>
            </section>
            <section>
              <h2 style={sectionTitleStyle()}>Naliehavosť</h2>
              <p style={{ margin: 0 }}>{urgencyLabel}</p>
            </section>
            <section>
              <h2 style={sectionTitleStyle()}>Čo urobiť ďalej</h2>
              {result.nextSteps.length === 0 ? (
                <p style={{ margin: 0, fontStyle: "italic" }}>Žiadne konkrétne kroky.</p>
              ) : (
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {result.nextSteps.map((step, i) => (
                    <li key={i} style={{ marginBottom: 6 }}>
                      {step}
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section>
              <h2 style={sectionTitleStyle()}>Na čo si dať pozor</h2>
              {result.warnings.length === 0 ? (
                <p style={{ margin: 0, fontStyle: "italic" }}>Žiadne upozornenia.</p>
              ) : (
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {result.warnings.map((w, i) => (
                    <li key={i} style={{ marginBottom: 6 }}>
                      {w}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        ) : (
          <p style={{ margin: 0 }}>Výsledok vysvetlenia sa zobrazí tu.</p>
        )}
      </div>
    </div>
  );
}
