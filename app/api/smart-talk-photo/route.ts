import { Buffer } from "node:buffer";
import { NextResponse } from "next/server";
import {
  createRequestId,
  internalErrorResponse,
  logRouteError,
} from "@/lib/api/safe-error-response";
import type { SmartTalkLocale } from "@/lib/vaylo/smart-talk/build-smart-talk-prompt";
import { extractTextFromImage } from "@/lib/vaylo/smart-talk/extract-text-from-image";
import { runSmartTalk } from "@/lib/vaylo/smart-talk/run-smart-talk";

/**
 * Anonymous Smart Talk photo pipeline: multipart image → in-memory base64 data URL →
 * provider OCR (extract text only) → same `runSmartTalk` as text mode.
 *
 * Privacy: image is held in memory only for the request; not written to disk or Supabase;
 * bytes are sent to the model provider for OCR; Smart Talk analysis is ephemeral (no storage here).
 * Do not log raw image/base64.
 */

export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024;
const MAX_TEXT = 12_000;
const MIN_TEXT = 8;
const ALLOWED_LOCALES = new Set<SmartTalkLocale>(["sk", "de", "en"]);
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_PHOTO = 3;
const SMART_TALK_PHOTO_ROUTE_TIMEOUT_MS = 90_000;

/** In-memory sliding window for photo route (separate from /api/smart-talk). */
const photoIpHits = new Map<string, number[]>();

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return "unknown";
}

function takePhotoRateSlot(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_WINDOW_MS;
  let hits = photoIpHits.get(ip) ?? [];
  hits = hits.filter((t) => t > cutoff);
  if (hits.length >= RATE_MAX_PHOTO) {
    photoIpHits.set(ip, hits);
    return false;
  }
  hits.push(now);
  photoIpHits.set(ip, hits);
  return true;
}

function hasLetter(s: string): boolean {
  return /[\p{L}\p{M}]/u.test(s);
}

function isOnlyUrls(s: string): boolean {
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return true;
  const urlLike = /^https?:\/\/.+/i;
  return parts.every((p) => urlLike.test(p));
}

function magicMatchesMime(buf: Uint8Array, mime: string): boolean {
  if (buf.length < 12) return false;
  if (mime === "image/jpeg") {
    return buf[0] === 0xff && buf[1] === 0xd8;
  }
  if (mime === "image/png") {
    return (
      buf[0] === 0x89 &&
      buf[1] === 0x50 &&
      buf[2] === 0x4e &&
      buf[3] === 0x47 &&
      buf[4] === 0x0d &&
      buf[5] === 0x0a &&
      buf[6] === 0x1a &&
      buf[7] === 0x0a
    );
  }
  if (mime === "image/webp") {
    const riff = buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46;
    const webp =
      buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50;
    return riff && webp;
  }
  return false;
}

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!takePhotoRateSlot(ip)) {
    return NextResponse.json(
      { ok: false, error: "smart_talk_photo_rate_limited" },
      { status: 429 },
    );
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "smart_talk_unavailable" },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return badRequest("invalid_form_data");
  }

  if (formData.get("context") !== "anonymous") {
    return badRequest("invalid_context");
  }

  const localeRaw = formData.get("locale");
  let locale: SmartTalkLocale = "sk";
  if (localeRaw != null && String(localeRaw).trim() !== "") {
    if (typeof localeRaw !== "string" || !ALLOWED_LOCALES.has(localeRaw as SmartTalkLocale)) {
      return badRequest("invalid_locale");
    }
    locale = localeRaw as SmartTalkLocale;
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return badRequest("missing_file");
  }
  if (file.size > MAX_BYTES) {
    return badRequest("file_too_large");
  }

  const mime = (file.type || "").toLowerCase().split(";")[0]?.trim() ?? "";
  if (!ALLOWED_MIME.has(mime)) {
    return badRequest("invalid_file_type");
  }

  const ab = await file.arrayBuffer();
  const buf = new Uint8Array(ab);
  if (!magicMatchesMime(buf, mime)) {
    return badRequest("invalid_file_type");
  }

  const base64 = Buffer.from(buf).toString("base64");
  const imageDataUrl = `data:${mime};base64,${base64}`;

  let extracted: Awaited<ReturnType<typeof extractTextFromImage>>;
  try {
    extracted = await Promise.race([
      extractTextFromImage({ imageDataUrl }),
      new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error("smart_talk_photo_ocr_timeout")),
          SMART_TALK_PHOTO_ROUTE_TIMEOUT_MS,
        );
      }),
    ]);
  } catch {
    return NextResponse.json(
      { ok: false, error: "smart_talk_photo_timeout" },
      { status: 504 },
    );
  }

  if (!extracted.ok) {
    if (extracted.error === "missing_api_key") {
      return NextResponse.json(
        { ok: false, error: "smart_talk_unavailable" },
        { status: 503 },
      );
    }
    if (extracted.error === "bad_content" || extracted.error === "openai_empty") {
      return NextResponse.json(
        { ok: false, error: "smart_talk_photo_extraction_failed" },
        { status: 422 },
      );
    }
    const requestId = createRequestId();
    logRouteError("[smart-talk-photo] OCR request failed", requestId, {
      kind: extracted.error,
      status: extracted.status,
    });
    return internalErrorResponse({ requestId, status: 500 });
  }

  let text = extracted.text.trim();
  if (text.length > MAX_TEXT) {
    text = text.slice(0, MAX_TEXT);
  }
  if (text.length < MIN_TEXT || !hasLetter(text) || isOnlyUrls(text)) {
    return NextResponse.json(
      { ok: false, error: "smart_talk_photo_extraction_failed" },
      { status: 422 },
    );
  }

  let out: Awaited<ReturnType<typeof runSmartTalk>>;
  try {
    out = await Promise.race([
      runSmartTalk({ text, locale, inputType: "text", source: "photo_ocr" }),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("smart_talk_timeout")), 60_000);
      }),
    ]);
  } catch {
    return NextResponse.json({ ok: false, error: "smart_talk_timeout" }, { status: 504 });
  }

  if (!out.ok) {
    const requestId = createRequestId();
    logRouteError("[smart-talk-photo] Smart Talk failed", requestId, {
      kind: out.error.kind,
      status: out.error.kind === "openai_http" ? out.error.status : undefined,
    });
    return internalErrorResponse({ requestId, status: 500 });
  }

  return NextResponse.json({
    ok: true,
    mode: "smart_talk",
    context: "anonymous",
    result: out.result,
  });
}
