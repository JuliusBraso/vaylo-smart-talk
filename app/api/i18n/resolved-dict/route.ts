import { NextResponse } from "next/server";
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
    const message = e instanceof Error ? e.message : "Failed to resolve dictionary";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
