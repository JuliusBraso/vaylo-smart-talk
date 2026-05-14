/**
 * Anonymous Smart Talk photo OCR: transcribe document image → plain text in memory only.
 * Image bytes are sent to the configured model provider for extraction only (no local persistence).
 * Do not log raw image/base64 from callers.
 */

const DEFAULT_OCR_MODEL = "gpt-4o-mini";
const MAX_EXTRACTED_CHARS = 14_000;
const OCR_FETCH_TIMEOUT_MS = 45_000;

const TRANSCRIBE_USER_PROMPT =
  "Extract the visible text from this German bureaucratic document image. Preserve dates, amounts, reference numbers, legal citations, headings, and paragraph order as much as possible. If a part is unreadable, mark it as [unreadable]. Do not explain. Do not summarize.";

export type ExtractTextFromImageErrorKind =
  | "openai_http"
  | "openai_empty"
  | "bad_content"
  | "missing_api_key";

export type ExtractTextFromImageResult =
  | { ok: true; text: string }
  | { ok: false; error: ExtractTextFromImageErrorKind; status?: number };

/**
 * @param imageDataUrl data URL only (e.g. data:image/jpeg;base64,...) — processed in memory, not stored.
 */
export async function extractTextFromImage(params: {
  imageDataUrl: string;
}): Promise<ExtractTextFromImageResult> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) {
    return { ok: false, error: "missing_api_key" };
  }

  const model =
    process.env.OPENAI_SMART_TALK_OCR_MODEL?.trim() || DEFAULT_OCR_MODEL;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), OCR_FETCH_TIMEOUT_MS);

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        max_tokens: 4096,
        messages: [
          {
            role: "system",
            content:
              "You output only the extracted document text as plain UTF-8. No markdown fences. No labels. No commentary before or after the transcription.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: TRANSCRIBE_USER_PROMPT },
              {
                type: "image_url",
                image_url: { url: params.imageDataUrl, detail: "high" },
              },
            ],
          },
        ],
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      return { ok: false, error: "openai_http", status: res.status };
    }

    const body = (await res.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };
    const rawContent = body.choices?.[0]?.message?.content;
    if (typeof rawContent !== "string" || !rawContent.trim()) {
      return { ok: false, error: "openai_empty" };
    }

    let text = rawContent.trim();
    if (text.length > MAX_EXTRACTED_CHARS) {
      text = `${text.slice(0, MAX_EXTRACTED_CHARS)}\n[… truncated]`;
    }

    if (!text) {
      return { ok: false, error: "bad_content" };
    }

    return { ok: true, text };
  } catch {
    return { ok: false, error: "openai_http", status: 0 };
  } finally {
    clearTimeout(timer);
  }
}
