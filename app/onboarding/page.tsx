import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/get-user";
import { getProfileDNA } from "@/lib/dna/get-profile-dna";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n";
import { getResolvedDict } from "@/lib/i18n/resolved-dict";
import OnboardingFlow from "./_components/OnboardingFlow";

export default async function OnboardingPage() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("wk_uiLang")?.value;
  const locale: Locale =
    cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)
      ? (cookieLocale as Locale)
      : DEFAULT_LOCALE;
  const t = await getResolvedDict(locale);

  const { supabase, user } = await getUser();

  if (!user) {
    redirect("/login");
  }

  const dna = await getProfileDNA(supabase, user.id);
  if (dna) {
    redirect("/dashboard");
  }

  return <OnboardingFlow t={t} />;
}

