import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getUser } from "@/lib/auth/get-user";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n";
import { getResolvedDict } from "@/lib/i18n/resolved-dict";
import { loadUserStateContext } from "@/lib/vaylo/state/load-user-state-context";
import VayloChat from "./_components/VayloChat";

export default async function ChatPage() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("wk_uiLang")?.value;
  const locale: Locale =
    cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)
      ? (cookieLocale as Locale)
      : DEFAULT_LOCALE;

  const { supabase, user } = await getUser();
  if (!user) redirect("/login");

  const t = await getResolvedDict(locale);
  const { userState, dashboardActions } = await loadUserStateContext({
    supabase,
    userId: user.id,
    t,
  });

  if (!userState.identity.dna) {
    redirect("/");
  }

  return <VayloChat t={t} actions={dashboardActions} />;
}
