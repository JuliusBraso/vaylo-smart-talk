import { buildSmartTalkMessages, type SmartTalkLocale } from "./build-smart-talk-prompt";

export type SmartTalkUrgency = "low" | "medium" | "high" | "unknown";

export type SmartTalkResult = {
  summary: string;
  meaning: string;
  urgency: SmartTalkUrgency;
  nextSteps: string[];
  warnings: string[];
};

const DEFAULT_MODEL = "gpt-4o-mini";
const URGENCY_SET = new Set<string>(["low", "medium", "high", "unknown"]);

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

  let summary = typeof obj.summary === "string" ? obj.summary.trim() : "";
  let meaning = typeof obj.meaning === "string" ? obj.meaning.trim() : "";

  if (!summary) summary = "Nepodarilo sa získať zhrnutie z výstupu modelu.";
  if (!meaning) meaning = "Ďalšie informácie nájdete v zhrnutí a upozorneniach.";

  let urgency: SmartTalkUrgency = "unknown";
  if (typeof obj.urgency === "string" && URGENCY_SET.has(obj.urgency)) {
    urgency = obj.urgency as SmartTalkUrgency;
  }

  const nextSteps = parseStringArray(obj.nextSteps, 16, 500);

  return {
    summary: summary.slice(0, 8000),
    meaning: meaning.slice(0, 12000),
    urgency,
    nextSteps,
    warnings,
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
