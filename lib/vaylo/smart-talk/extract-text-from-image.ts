/**
 * Anonymous Smart Talk photo OCR: transcribe document image → plain text in memory only.
 * Image bytes are sent to the configured model provider for extraction only (no local persistence).
 * Do not log raw image/base64 from callers.
 */

const DEFAULT_OCR_MODEL = "gpt-4o-mini";
const MAX_EXTRACTED_CHARS = 14_000;
const OCR_FETCH_TIMEOUT_MS = 45_000;

const ENV_DETAIL = process.env.OPENAI_SMART_TALK_OCR_DETAIL?.trim();
const OCR_IMAGE_DETAIL: "low" | "high" | "auto" =
  ENV_DETAIL === "low" || ENV_DETAIL === "high" || ENV_DETAIL === "auto"
    ? ENV_DETAIL
    : "auto";

const TRANSCRIBE_USER_PROMPT =
  "Extract all visible text from this German-language bureaucracy or insurance/commercial document image. Output plain UTF-8 text only: same language as printed on the page (German), no translation, no commentary, no summary, no JSON, no markdown fences, no labels before or after the transcription. " +
  "Preserve document structure as plain text: keep headings and their order; preserve section order top-to-bottom; use line breaks to separate blocks; for tables or aligned columns, keep rows on separate lines and align columns where possible with spaces — do not collapse tables into a single sentence. " +
  "Preserve payment-related fields when visible: payment method (e.g. Überweisung, Lastschrift, SEPA), SEPA / direct-debit cues, IBAN, BIC if shown, Gläubiger-ID / Creditor Identifier, mandate reference (Mandatsreferenz), reference numbers (Aktenzeichen, Rechnungsnummer, Kundennummer, Vertragsnummer), amounts and currencies, due dates (Fälligkeit), bank details. " +
  "Preserve insurance items when visible: product/package names, components (Bausteine), tariffs, coverage lines, and warning or Hinweis boxes. " +
  "Preserve wording that signals document type (e.g. Rechnung, Mahnung, Zahlungsavis, Lastschriftavis, Abbuchung, Rücklastschrift, Kündigung, Einstellung, Mahngebühr, Rückzahlung, Nutzungsentgelt) — transcribe titles and lead phrases faithfully. " +
  "Preserve cancellation, repayment (Rückzahlung, Rückforderung), status/procedure (bearbeitet, offen, unter Vorbehalt), and payment instructions (e.g. only ensure account coverage, do not transfer separately) when printed. " +
  "Where a digit or amount is visually ambiguous, do not guess: prefer [unclear], [ambiguous: X or Y], or two lines with a question mark — never invent a confident amount. For unreadable regions use [unreadable].";

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
              "You output only the extracted document text as plain UTF-8. No markdown fences. No interpretation or summary. No JSON. No commentary before or after the transcription. Follow the user instructions for ambiguity markers.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: TRANSCRIBE_USER_PROMPT },
              {
                type: "image_url",
                image_url: {
                  url: params.imageDataUrl,
                  detail: OCR_IMAGE_DETAIL,
                },
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
