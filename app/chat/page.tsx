import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getUser } from "@/lib/auth/get-user";
import { getProfileDNA } from "@/lib/dna/get-profile-dna";
import { DEFAULT_LOCALE, getDict, LOCALES, type Locale } from "@/lib/i18n";
import { getDashboardActions } from "@/lib/dashboard/get-dashboard-actions";
import { getLiveSituationFromProfile } from "@/lib/vaylo/live-situation";
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

  const dna = await getProfileDNA(supabase, user.id);
  if (!dna) redirect("/");

  const { data: profileRow } = await supabase
    .from("profiles")
    .select(
      "has_steuer_id, has_health_insurance, has_bank_account, registered_arbeitsagentur, has_children, children_school_age, has_cv, job_search_urgency, employment_type"
    )
    .eq("id", user.id)
    .maybeSingle();
  const liveSituation = getLiveSituationFromProfile(profileRow);

  const t = getDict(locale);
  const actions = await getDashboardActions({
    supabase,
    userId: user.id,
    dna,
    liveSituation,
    t,
  });

  return <VayloChat t={t} actions={actions} />;
}

