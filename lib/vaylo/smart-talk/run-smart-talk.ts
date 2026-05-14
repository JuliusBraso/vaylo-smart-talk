import {
  buildSmartTalkMessages,
  type SmartTalkInputType,
  type SmartTalkLocale,
} from "./build-smart-talk-prompt";

export type SmartTalkUrgency = "low" | "medium" | "high" | "unknown";

export type SmartTalkConfidenceLevel = "low" | "medium" | "high";

export type SmartTalkConsequencePhase = "none" | "possible" | "conditional" | "active";

export type SmartTalkDocumentQuality = "clear" | "noisy" | "ocr_damaged" | "unknown";

export type SmartTalkResult = {
  summary: string;
  meaning: string;
  urgency: SmartTalkUrgency;
  nextSteps: string[];
  warnings: string[];
  stabilizers: string[];
  confidenceLevel: SmartTalkConfidenceLevel;
  consequencePhase: SmartTalkConsequencePhase;
  documentQuality: SmartTalkDocumentQuality;
};

const DEFAULT_MODEL = "gpt-4o-mini";
const URGENCY_SET = new Set<string>(["low", "medium", "high", "unknown"]);
const CONFIDENCE_SET = new Set<string>(["low", "medium", "high"]);
const CONSEQUENCE_SET = new Set<string>(["none", "possible", "conditional", "active"]);
const DOCUMENT_QUALITY_SET = new Set<string>(["clear", "noisy", "ocr_damaged", "unknown"]);

const DEFAULT_STABILIZERS: string[] = [];
const DEFAULT_CONFIDENCE: SmartTalkConfidenceLevel = "medium";
const DEFAULT_CONSEQUENCE: SmartTalkConsequencePhase = "possible";
const DEFAULT_DOCUMENT_QUALITY: SmartTalkDocumentQuality = "unknown";

function stripJsonFence(s: string): string {
  const t = s.trim();
  if (!t.startsWith("```")) return t;
  return t
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
}

function parseStringArray(raw: unknown, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const x of raw) {
    if (typeof x !== "string") continue;
    const s = x.trim().slice(0, maxLen);
    if (s) out.push(s);
    if (out.length >= maxItems) break;
  }
  return out;
}

function normalizeParsedObject(obj: Record<string, unknown>): SmartTalkResult {
  const warnings: string[] = parseStringArray(obj.warnings, 12, 400);
  const stabilizers: string[] = parseStringArray(obj.stabilizers, 2, 400);

  let summary = typeof obj.summary === "string" ? obj.summary.trim() : "";
  let meaning = typeof obj.meaning === "string" ? obj.meaning.trim() : "";

  if (!summary) summary = "Nepodarilo sa získať zhrnutie z výstupu modelu.";
  if (!meaning) meaning = "Ďalšie informácie nájdete v zhrnutí a upozorneniach.";

  let urgency: SmartTalkUrgency = "unknown";
  if (typeof obj.urgency === "string" && URGENCY_SET.has(obj.urgency)) {
    urgency = obj.urgency as SmartTalkUrgency;
  }

  let confidenceLevel: SmartTalkConfidenceLevel = DEFAULT_CONFIDENCE;
  if (
    typeof obj.confidenceLevel === "string" &&
    CONFIDENCE_SET.has(obj.confidenceLevel)
  ) {
    confidenceLevel = obj.confidenceLevel as SmartTalkConfidenceLevel;
  }

  let consequencePhase: SmartTalkConsequencePhase = DEFAULT_CONSEQUENCE;
  if (
    typeof obj.consequencePhase === "string" &&
    CONSEQUENCE_SET.has(obj.consequencePhase)
  ) {
    consequencePhase = obj.consequencePhase as SmartTalkConsequencePhase;
  }

  let documentQuality: SmartTalkDocumentQuality = DEFAULT_DOCUMENT_QUALITY;
  if (
    typeof obj.documentQuality === "string" &&
    DOCUMENT_QUALITY_SET.has(obj.documentQuality)
  ) {
    documentQuality = obj.documentQuality as SmartTalkDocumentQuality;
  }

  const nextSteps = parseStringArray(obj.nextSteps, 16, 500);

  return {
    summary: summary.slice(0, 8000),
    meaning: meaning.slice(0, 12000),
    urgency,
    nextSteps,
    warnings,
    stabilizers,
    confidenceLevel,
    consequencePhase,
    documentQuality,
  };
}

function fallbackInvalidJson(): SmartTalkResult {
  return {
    summary: "Nepodarilo sa spoľahlivo spracovať odpoveď AI.",
    meaning: "Skúste text odoslať znova alebo vložte kratšiu, jasnejšiu časť dokumentu.",
    urgency: "unknown",
    nextSteps: [
      "Skontrolujte, či ste vložili čitateľný úradný text.",
      "Ak problém pretrváva, skúste vložiť kratší úsek dokumentu.",
    ],
    warnings: [
      "Výsledok môže byť neúplný, pretože odpoveď AI nebola v očakávanom formáte.",
    ],
    stabilizers: DEFAULT_STABILIZERS,
    confidenceLevel: DEFAULT_CONFIDENCE,
    consequencePhase: DEFAULT_CONSEQUENCE,
    documentQuality: DEFAULT_DOCUMENT_QUALITY,
  };
}

export type RunSmartTalkError = { kind: "openai_http"; status: number } | { kind: "openai_empty" };

/**
 * Calls OpenAI with JSON object mode. Requires OPENAI_API_KEY in env.
 * On successful HTTP but unparseable JSON, returns a safe fallback result (no throw).
 * On HTTP failure or empty content, returns { ok: false, error }.
 */
export async function runSmartTalk(params: {
  text: string;
  locale: SmartTalkLocale;
  inputType: SmartTalkInputType;
}): Promise<{ ok: true; result: SmartTalkResult } | { ok: false; error: RunSmartTalkError }> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) {
    return { ok: false, error: { kind: "openai_empty" } };
  }

  const model = process.env.OPENAI_SMART_TALK_MODEL?.trim() || DEFAULT_MODEL;
  const { system, user } = buildSmartTalkMessages(params);

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 55_000);

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 2000,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      return { ok: false, error: { kind: "openai_http", status: res.status } };
    }

    const body = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const rawContent = body.choices?.[0]?.message?.content;
    if (typeof rawContent !== "string" || !rawContent.trim()) {
      return { ok: false, error: { kind: "openai_empty" } };
    }

    const content = stripJsonFence(rawContent);
    let parsed: unknown;
    try {
      parsed = JSON.parse(content) as unknown;
    } catch {
      return { ok: true, result: fallbackInvalidJson() };
    }

    if (!parsed || typeof parsed !== "object") {
      return { ok: true, result: fallbackInvalidJson() };
    }

    return { ok: true, result: normalizeParsedObject(parsed as Record<string, unknown>) };
  } catch {
    return { ok: false, error: { kind: "openai_http", status: 0 } };
  } finally {
    clearTimeout(t);
  }
}
