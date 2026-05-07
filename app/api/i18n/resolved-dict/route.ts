import { NextResponse } from "next/server";
import {
  createRequestId,
  internalErrorResponse,
  logRouteError,
} from "@/lib/api/safe-error-response";
import { LOCALES, type Locale } from "@/lib/i18n";
import { getResolvedDict } from "@/lib/i18n/resolved-dict";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("locale")?.trim() ?? "";
  if (!raw || !(LOCALES as readonly string[]).includes(raw)) {
    return NextResponse.json({ error: "Invalid or missing locale" }, { status: 400 });
  }
  const locale = raw as Locale;
  try {
    const t = await getResolvedDict(locale);
    return NextResponse.json(t);
  } catch (e) {
    const requestId = createRequestId();
    logRouteError("[i18n resolved-dict GET]", requestId, e);
    return internalErrorResponse({ requestId, status: 500, debugError: e });
  }
}
