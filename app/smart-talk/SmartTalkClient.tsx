"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type {
  SmartTalkResult,
  SmartTalkConfidenceLevel,
  SmartTalkConsequencePhase,
  SmartTalkDocumentQuality,
} from "@/lib/vaylo/smart-talk/run-smart-talk";

const MAX_TEXT_LENGTH = 12000;
const RECOMMENDED_TEXT_LENGTH = 4000;

type SmartTalkUiMode = "question" | "text" | "photo";

const PLACEHOLDER: Record<SmartTalkUiMode, string> = {
  question: "Opýtajte sa napríklad: Ako požiadam o Kindergeld v Nemecku?",
  text: "Sem vložte text z listu, úradu alebo formulára…",
  photo: "Foto režim pripravujeme.",
};

const GUIDANCE_PRIMARY: Record<SmartTalkUiMode, string> = {
  question:
    "Pýtajte sa na dane, Kindergeld, Anmeldung, zdravotnú poisťovňu, úrady alebo iné nemecké byrokratické kroky.",
  text: "Najlepšie funguje, keď vložíte najdôležitejšiu časť listu alebo formulára.",
  photo: "Čoskoro budete môcť dokument odfotiť priamo v mobile.",
};

const SUBMIT_LABEL: Record<SmartTalkUiMode, string> = {
  question: "Opýtať sa Vayla",
  text: "Vysvetliť text",
  photo: "Už čoskoro",
};

const CONFIDENCE = new Set(["low", "medium", "high"]);
const CONSEQUENCE = new Set(["none", "possible", "conditional", "active"]);
const DOC_QUALITY = new Set(["clear", "noisy", "ocr_damaged", "unknown"]);
const URGENCY = new Set(["low", "medium", "high", "unknown"]);

function parseStabilizersClient(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const x of raw) {
    if (typeof x !== "string") continue;
    const s = x.trim().slice(0, 400);
    if (s) out.push(s);
    if (out.length >= 2) break;
  }
  return out;
}

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
  const urgencyRaw = typeof result.urgency === "string" ? result.urgency : "unknown";
  const urgency = URGENCY.has(urgencyRaw) ? urgencyRaw : "unknown";

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

  const stabilizers = parseStabilizersClient(result.stabilizers);

  const confidenceRaw =
    typeof result.confidenceLevel === "string" ? result.confidenceLevel : "medium";
  const confidenceLevel: SmartTalkConfidenceLevel = CONFIDENCE.has(confidenceRaw)
    ? (confidenceRaw as SmartTalkConfidenceLevel)
    : "medium";

  const consequenceRaw =
    typeof result.consequencePhase === "string" ? result.consequencePhase : "possible";
  const consequencePhase: SmartTalkConsequencePhase = CONSEQUENCE.has(consequenceRaw)
    ? (consequenceRaw as SmartTalkConsequencePhase)
    : "possible";

  const docQualityRaw =
    typeof result.documentQuality === "string" ? result.documentQuality : "unknown";
  const documentQuality: SmartTalkDocumentQuality = DOC_QUALITY.has(docQualityRaw)
    ? (docQualityRaw as SmartTalkDocumentQuality)
    : "unknown";

  const parsedResult: SmartTalkResult = {
    summary,
    meaning,
    urgency: urgency as SmartTalkResult["urgency"],
    nextSteps,
    warnings,
    stabilizers,
    confidenceLevel,
    consequencePhase,
    documentQuality,
  };

  return {
    ok: true,
    mode: data.mode,
    context: data.context,
    result: parsedResult,
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

function messageForStatus(status: number): string {
  if (status === 400) return MSG.badInput;
  if (status === 429) return MSG.rateLimited;
  if (status === 503) return MSG.unavailable;
  if (status === 504) return MSG.timeout;
  return MSG.fallback;
}

const BADGE_BASE: CSSProperties = {
  display: "inline-block",
  padding: "6px 14px",
  borderRadius: "var(--r999)",
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: "0.02em",
};

const URGENCY_BADGE_STYLE: Record<string, CSSProperties> = {
  low: {
    border: "1px solid rgba(167, 243, 208, 1)",
    background: "rgba(236, 253, 245, 1)",
    color: "rgba(6, 95, 70, 0.92)",
  },
  medium: {
    border: "1px solid rgba(253, 224, 71, 0.95)",
    background: "rgba(254, 252, 232, 1)",
    color: "rgba(113, 63, 18, 0.94)",
  },
  high: {
    border: "1px solid rgba(251, 191, 36, 0.95)",
    background: "rgba(255, 247, 237, 1)",
    color: "rgba(124, 45, 18, 0.94)",
  },
  unknown: {
    border: "1px solid var(--border)",
    background: "rgba(248, 250, 252, 1)",
    color: "var(--muted2)",
  },
};

const URGENCY_BADGE_LABEL: Record<string, string> = {
  low: "Nízka",
  medium: "Stredná",
  high: "Vysoká",
  unknown: "Neznáma",
};

function urgencyBadgeFor(raw: string): { label: string; pillStyle: CSSProperties } {
  const tier =
    raw === "low" || raw === "medium" || raw === "high" || raw === "unknown" ? raw : "unknown";
  const label = URGENCY_BADGE_LABEL[raw] ?? raw;
  return {
    label,
    pillStyle: { ...BADGE_BASE, ...URGENCY_BADGE_STYLE[tier] },
  };
}

const RESULT_CARD: CSSProperties = {
  padding: "14px 16px",
  borderRadius: "var(--r16)",
  border: "1px solid var(--border)",
  background: "var(--card)",
  boxShadow: "0 6px 16px rgba(15, 23, 42, 0.04)",
};

/** Dev-only display string; avoids crashes if API/client parsing omits fields. */
function devMetaString(value: unknown): string {
  if (typeof value === "string" && value.trim()) return value;
  return "—";
}

function sectionTitleStyle(): CSSProperties {
  return {
    margin: "0 0 10px",
    fontSize: 12,
    fontWeight: 800,
    color: "var(--muted2)",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  };
}

export default function SmartTalkClient() {
  const [mode, setMode] = useState<SmartTalkUiMode>("question");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SmartTalkResult | null>(null);
  const busyRef = useRef(false);
  const generationRef = useRef(0);

  useEffect(() => {
    generationRef.current += 1;
    setError(null);
    setResult(null);
    setLoading(false);
    busyRef.current = false;
  }, [mode]);

  const trimmedLen = text.trim().length;
  const lengthGuardActive = mode === "question" || mode === "text";
  const overMaxLength = lengthGuardActive && trimmedLen > MAX_TEXT_LENGTH;
  const showLengthRecommendation =
    lengthGuardActive &&
    trimmedLen > RECOMMENDED_TEXT_LENGTH &&
    trimmedLen <= MAX_TEXT_LENGTH;
  const submitDisabled =
    loading ||
    mode === "photo" ||
    trimmedLen < 8 ||
    trimmedLen > MAX_TEXT_LENGTH;

  const onSubmit = useCallback(async () => {
    if (mode === "photo") return;
    const trimmed = text.trim();
    if (trimmed.length < 8 || trimmed.length > MAX_TEXT_LENGTH || busyRef.current) return;
    const genAtStart = generationRef.current;
    busyRef.current = true;

    setLoading(true);
    setError(null);
    setResult(null);

    const inputType = mode === "question" ? "question" : "text";

    try {
      const res = await fetch("/api/smart-talk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: "anonymous",
          inputType,
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

      if (genAtStart !== generationRef.current) return;

      const okParsed = parseSmartTalkResponse(data);
      if (res.ok && okParsed) {
        setResult(okParsed.result);
        return;
      }

      setError(messageForStatus(res.status));
    } catch {
      if (genAtStart !== generationRef.current) return;
      setError(MSG.fallback);
    } finally {
      busyRef.current = false;
      setLoading(false);
    }
  }, [text, mode]);

  const urgencyUi = result ? urgencyBadgeFor(result.urgency) : null;

  const modeChip = (m: SmartTalkUiMode, label: string) => {
    const selected = mode === m;
    return (
      <button
        key={m}
        type="button"
        role="tab"
        aria-selected={selected}
        onClick={() => setMode(m)}
        style={{
          flex: "1 1 104px",
          minHeight: 44,
          padding: "10px 12px",
          borderRadius: "var(--r12)",
          border:
            m === "photo" && !selected
              ? "1px dashed rgba(203, 213, 225, 1)"
              : selected
                ? "1px solid var(--accentBorder)"
                : "1px solid var(--border)",
          background: selected ? "rgba(238, 242, 255, 1)" : "rgba(255, 255, 255, 0.96)",
          color: "var(--text)",
          fontWeight: 800,
          fontSize: 13,
          lineHeight: 1.25,
          cursor: "pointer",
          boxShadow: selected ? "0 0 0 3px rgba(199, 210, 254, 0.35)" : "none",
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div
        role="tablist"
        aria-label="Spôsob vstupu"
        style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
      >
        {modeChip("question", "Mám otázku")}
        {modeChip("text", "Mám text listu")}
        {modeChip("photo", "Odfotiť dokument")}
      </div>

      {mode === "photo" ? (
        <p
          style={{
            margin: 0,
            fontSize: 13,
            lineHeight: 1.55,
            color: "var(--muted)",
            padding: "12px 14px",
            borderRadius: "var(--r12)",
            border: "1px dashed rgba(203, 213, 225, 1)",
            background: "rgba(248, 250, 252, 1)",
          }}
        >
          Na mobilnom skeneri dokumentov intenzívne pracujeme. Už čoskoro.
        </p>
      ) : null}

      <div style={{ display: "grid", gap: 6 }}>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--muted)" }}>
          {GUIDANCE_PRIMARY[mode]}
        </p>
        {lengthGuardActive ? (
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.45, color: "var(--muted2)" }}>
            Limit: maximálne 12 000 znakov.
          </p>
        ) : null}
      </div>

      <label htmlFor="smart-talk-input" className="sr-only">
        {mode === "question" ? "Otázka pre Vayla" : mode === "text" ? "Text dokumentu" : "Foto dokumentu"}
      </label>
      <textarea
        id="smart-talk-input"
        name="smart-talk-text"
        rows={8}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={PLACEHOLDER[mode]}
        className="w-full resize-y rounded-[var(--r12)] border border-[var(--border)] bg-[var(--bg0)] px-3 py-3 text-[15px] leading-relaxed text-[var(--text)] outline-none placeholder:text-[var(--muted2)] focus:border-[color:rgba(199,210,254,1)] focus:shadow-[0_0_0_3px_rgba(199,210,254,0.45)] min-h-[168px]"
        disabled={loading || mode === "photo"}
      />

      {lengthGuardActive ? (
        <>
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
              {mode === "question"
                ? "Pre najlepší výsledok skúste otázku formulovať stručne a konkrétne."
                : "Pre najlepší výsledok odporúčame vložiť iba najdôležitejšiu časť listu alebo formulára."}
            </p>
          ) : null}
        </>
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
          border:
            mode === "photo" ? "1px solid rgba(203, 213, 225, 1)" : "1px solid var(--accentBorder)",
          background:
            mode === "photo" ? "rgba(241, 245, 249, 1)" : "var(--accent)",
          color:
            mode === "photo" ? "var(--muted2)" : "rgba(255,255,255,0.98)",
          fontWeight: 800,
          fontSize: 15,
          cursor: submitDisabled ? "not-allowed" : "pointer",
          opacity: submitDisabled ? 0.55 : 1,
        }}
      >
        {SUBMIT_LABEL[mode]}
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
          <p style={{ margin: 0 }}>
            {mode === "question" ? "Vaylo odpovedá na vašu otázku…" : "Vaylo vysvetľuje text…"}
          </p>
        ) : error ? (
          <p style={{ margin: 0, color: "rgba(127, 29, 29, 0.92)" }}>{error}</p>
        ) : result ? (
          <div style={{ display: "grid", gap: 14 }}>
            <p
              style={{
                margin: 0,
                fontSize: 15,
                lineHeight: 1.55,
                color: "var(--text)",
                fontWeight: 700,
              }}
            >
              Tu je vaša analýza. Takto situáciu vyhodnotilo Vaylo:
            </p>

            <div style={{ display: "grid", gap: 12 }}>
              <section style={RESULT_CARD}>
                <h2 style={sectionTitleStyle()}>Zhrnutie</h2>
                <p
                  style={{
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    fontSize: 14,
                    lineHeight: 1.65,
                    color: "var(--text)",
                  }}
                >
                  {result.summary}
                </p>
              </section>

              <section style={RESULT_CARD}>
                <h2 style={sectionTitleStyle()}>Čo to znamená</h2>
                <p
                  style={{
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    fontSize: 14,
                    lineHeight: 1.65,
                    color: "var(--text)",
                  }}
                >
                  {result.meaning}
                </p>
              </section>

              <section style={RESULT_CARD}>
                <h2 style={sectionTitleStyle()}>Naliehavosť</h2>
                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  {urgencyUi ? (
                    <span style={urgencyUi.pillStyle}>{urgencyUi.label}</span>
                  ) : null}
                </div>
              </section>

              <section style={RESULT_CARD}>
                <h2 style={sectionTitleStyle()}>Čo urobiť ďalej</h2>
                {result.nextSteps.length === 0 ? (
                  <p style={{ margin: 0, fontStyle: "italic", fontSize: 14, color: "var(--muted)" }}>
                    Žiadne konkrétne kroky.
                  </p>
                ) : (
                  <ol
                    style={{
                      margin: 0,
                      paddingLeft: 22,
                      fontSize: 14,
                      lineHeight: 1.65,
                      color: "var(--text)",
                      display: "grid",
                      gap: 10,
                    }}
                  >
                    {result.nextSteps.map((step, i) => (
                      <li key={i} style={{ paddingLeft: 4 }}>
                        {step}
                      </li>
                    ))}
                  </ol>
                )}
              </section>

              <section style={RESULT_CARD}>
                <h2 style={sectionTitleStyle()}>Na čo si dať pozor</h2>
                {result.warnings.length === 0 ? (
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--muted)" }}>
                    Žiadne upozornenia.
                  </p>
                ) : (
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 22,
                      fontSize: 14,
                      lineHeight: 1.65,
                      color: "var(--text)",
                      display: "grid",
                      gap: 10,
                      listStyleType: "disc",
                    }}
                  >
                    {result.warnings.map((w, i) => (
                      <li key={i} style={{ paddingLeft: 4, color: "var(--muted)" }}>
                        {w}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            {process.env.NODE_ENV === "development" ? (
              <details
                style={{
                  marginTop: 2,
                  border: "1px dashed rgba(100, 116, 139, 0.55)",
                  borderRadius: "var(--r12)",
                  padding: "10px 12px",
                  background: "rgba(241, 245, 249, 0.65)",
                  fontSize: 11,
                  lineHeight: 1.45,
                  color: "rgba(71, 85, 105, 0.95)",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    userSelect: "none",
                  }}
                >
                  DEV: Smart Talk reasoning metadata
                </summary>
                <div
                  style={{
                    marginTop: 10,
                    display: "grid",
                    gap: 8,
                    paddingTop: 4,
                    borderTop: "1px dashed rgba(148, 163, 184, 0.45)",
                  }}
                >
                  <div>
                    <span style={{ opacity: 0.85 }}>confidenceLevel: </span>
                    {devMetaString(
                      (result as unknown as Record<string, unknown>).confidenceLevel,
                    )}
                  </div>
                  <div>
                    <span style={{ opacity: 0.85 }}>consequencePhase: </span>
                    {devMetaString(
                      (result as unknown as Record<string, unknown>).consequencePhase,
                    )}
                  </div>
                  <div>
                    <span style={{ opacity: 0.85 }}>documentQuality: </span>
                    {devMetaString(
                      (result as unknown as Record<string, unknown>).documentQuality,
                    )}
                  </div>
                  <div>
                    <div style={{ opacity: 0.85, marginBottom: 4 }}>stabilizers:</div>
                    {(() => {
                      const raw = (result as unknown as Record<string, unknown>).stabilizers;
                      const list = Array.isArray(raw)
                        ? raw.filter((x): x is string => typeof x === "string" && x.trim() !== "")
                        : [];
                      if (list.length === 0) {
                        return (
                          <span style={{ fontStyle: "italic", opacity: 0.9 }}>
                            Žiadne stabilizujúce informácie neboli extrahované.
                          </span>
                        );
                      }
                      return (
                        <ul
                          style={{
                            margin: 0,
                            paddingLeft: 18,
                            display: "grid",
                            gap: 4,
                          }}
                        >
                          {list.map((s, i) => (
                            <li key={i} style={{ paddingLeft: 2 }}>
                              {s}
                            </li>
                          ))}
                        </ul>
                      );
                    })()}
                  </div>
                </div>
              </details>
            ) : null}
          </div>
        ) : (
          <p style={{ margin: 0 }}>Výsledok vysvetlenia sa zobrazí tu.</p>
        )}
      </div>
    </div>
  );
}
