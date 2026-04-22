import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n";
import { getResolvedDict } from "@/lib/i18n/resolved-dict";
import { loadUserStateContext } from "@/lib/vaylo/state/load-user-state-context";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("wk_uiLang")?.value;
  const locale: Locale =
    cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)
      ? (cookieLocale as Locale)
      : DEFAULT_LOCALE;
  const t = await getResolvedDict(locale);

  const { dashboardActions } = await loadUserStateContext({
    supabase,
    userId: user.id,
    t,
  });

  const url = new URL(request.url);
  const trigger = url.searchParams.get("trigger") ?? "";
  if (process.env.NODE_ENV === "development" && trigger === "realtime") {
    console.info("[dashboard] refreshed from realtime trigger", { userId: user.id });
  }

  return NextResponse.json({ actions: dashboardActions, serverTime: new Date().toISOString() });
}

