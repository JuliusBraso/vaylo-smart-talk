import type { Locale } from "./index";

/** English display names for LLM prompts (UI language targets). */
export const LOCALE_TARGET_LANGUAGE_EN: Record<Locale, string> = {
  en: "English",
  de: "German",
  sk: "Slovak",
  hu: "Hungarian",
  pl: "Polish",
  cs: "Czech",
  ro: "Romanian",
  bg: "Bulgarian",
  uk: "Ukrainian",
  tr: "Turkish",
  ru: "Russian",
};

const BATCH_SIZE = 32;

export type TranslateMissingKeysParams = {
  locale: Locale;
  /** Dot-paths missing from the raw locale file (vs English). */
  missingKeyPaths: string[];
  /** Resolve English source string for a path from the base dictionary. */
  getEnglishText: (path: string) => string | undefined;
};

/**
 * Batch-translates UI strings via OpenAI. Returns path → translated string.
 * Never throws: on failure returns `{}` so callers can fall back to merged English.
 */
export async function translateMissingKeys(
  params: TranslateMissingKeysParams,
): Promise<Record<string, string>> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || params.missingKeyPaths.length === 0 || params.locale === "en") {
    return {};
  }

  const targetLang = LOCALE_TARGET_LANGUAGE_EN[params.locale] ?? params.locale;
  const items: { path: string; en: string }[] = [];
  for (const path of params.missingKeyPaths) {
    const en = params.getEnglishText(path);
    if (typeof en === "string" && en.length > 0) {
      items.push({ path, en });
    }
  }
  if (items.length === 0) return {};

  const out: Record<string, string> = {};

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const chunk = items.slice(i, i + BATCH_SIZE);
    try {
      const batch = await translateChunk(apiKey, targetLang, chunk);
      Object.assign(out, batch);
    } catch {
      // Silent failure per spec — caller keeps English from merge
    }
  }

  return out;
}

async function translateChunk(
  apiKey: string,
  targetLanguageEnglishName: string,
  chunk: { path: string; en: string }[],
): Promise<Record<string, string>> {
  const payload = chunk.map((c) => ({ id: c.path, text: c.en }));
  const system = `You translate UI strings for a web app about living in Germany.
Return ONLY valid JSON: an object whose keys are the exact "id" strings from the input and values are the translations.
Rules:
- Short, natural ${targetLanguageEnglishName} for mobile/web UI.
- Preserve placeholders like {name}, {level}, {size}, {step}, {total}, {employment}, {goal}, {language}, {family} exactly — do not translate placeholder names inside braces.
- Do not add quotes inside values unless they were in the source.
- Do not include explanations or markdown.`;

  const user = JSON.stringify({ strings: payload });

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.I18N_OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: `Translate each "text" into ${targetLanguageEnglishName}. Use "id" as the JSON key in your output object.\n\n${user}`,
        },
      ],
    }),
  });

  if (!res.ok) return {};

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  let raw = data.choices?.[0]?.message?.content?.trim() ?? "";
  if (!raw) return {};
  if (raw.startsWith("```")) {
    raw = raw.replace(/^```[a-z]*\n?/i, "").replace(/\n?```\s*$/i, "");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return {};
  }

  return flattenTranslationObject(parsed);
}

/** Accepts flat `{ "a.b": "x" }` or nested `{ a: { b: "x" } }` or `{ strings: [...] }` from the model. */
function flattenTranslationObject(parsed: unknown): Record<string, string> {
  const out: Record<string, string> = {};

  function walk(obj: unknown, prefix: string): void {
    if (obj === null || typeof obj !== "object" || Array.isArray(obj)) return;
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      const key = prefix ? `${prefix}.${k}` : k;
      if (typeof v === "string" && v.length > 0) {
        out[key] = v;
      } else if (v !== null && typeof v === "object" && !Array.isArray(v)) {
        walk(v, key);
      }
    }
  }

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {};
  }
  const root = parsed as Record<string, unknown>;
  if (root.strings && typeof root.strings === "object") {
    walk(root.strings, "");
  } else {
    walk(parsed, "");
  }
  return out;
}
