import { NextResponse } from "next/server";
import {
  createRequestId,
  internalErrorResponse,
  logRouteError,
} from "@/lib/api/safe-error-response";
import { runSmartTalk } from "@/lib/vaylo/smart-talk/run-smart-talk";
import type {
  SmartTalkInputType,
  SmartTalkLocale,
} from "@/lib/vaylo/smart-talk/build-smart-talk-prompt";

function isSmartTalkInputType(v: unknown): v is SmartTalkInputType {
  return v === "text" || v === "question";
}

export const runtime = "nodejs";

const MAX_TEXT = 12_000;
const MIN_TEXT = 8;
const ALLOWED_LOCALES = new Set<SmartTalkLocale>(["sk", "de", "en"]);

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const SMART_TALK_ROUTE_TIMEOUT_MS = 20_000;

/** In-memory sliding window: IP → request timestamps (no persistence). */
const ipHits = new Map<string, number[]>();

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

function takeRateSlot(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_WINDOW_MS;
  let hits = ipHits.get(ip) ?? [];
  hits = hits.filter((t) => t > cutoff);
  if (hits.length >= RATE_MAX) {
    ipHits.set(ip, hits);
    return false;
  }
  hits.push(now);
  ipHits.set(ip, hits);
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

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!takeRateSlot(ip)) {
    return NextResponse.json({ ok: false, error: "smart_talk_rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest("invalid_json");
  }

  if (!body || typeof body !== "object") {
    return badRequest("invalid_body");
  }

  const o = body as Record<string, unknown>;

  if (o.context !== "anonymous") {
    return badRequest("invalid_context");
  }
  if (!isSmartTalkInputType(o.inputType)) {
    return badRequest("invalid_input_type");
  }
  const inputType = o.inputType;
  if (typeof o.text !== "string") {
    return badRequest("invalid_text");
  }

  const text = o.text.trim();
  if (text.length < MIN_TEXT) {
    return badRequest("text_too_short");
  }
  if (text.length > MAX_TEXT) {
    return badRequest("text_too_long");
  }
  if (!hasLetter(text) || isOnlyUrls(text)) {
    return badRequest("invalid_text");
  }

  let locale: SmartTalkLocale = "sk";
  if (o.locale !== undefined && o.locale !== null) {
    if (typeof o.locale !== "string" || !ALLOWED_LOCALES.has(o.locale as SmartTalkLocale)) {
      return badRequest("invalid_locale");
    }
    locale = o.locale as SmartTalkLocale;
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "smart_talk_unavailable" },
      { status: 503 },
    );
  }

  let out: Awaited<ReturnType<typeof runSmartTalk>>;
  try {
    out = await Promise.race([
      runSmartTalk({ text, locale, inputType }),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("smart_talk_timeout")), SMART_TALK_ROUTE_TIMEOUT_MS);
      }),
    ]);
  } catch {
    return NextResponse.json({ ok: false, error: "smart_talk_timeout" }, { status: 504 });
  }

  if (!out.ok) {
    const requestId = createRequestId();
    logRouteError("[smart-talk] openai failed", requestId, {
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
