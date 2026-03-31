import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { getUser } from "@/lib/auth/get-user";
import { getProfileDNA } from "@/lib/dna/get-profile-dna";
import { DEFAULT_LOCALE, getDict, LOCALES, type Locale } from "@/lib/i18n";
import { getLiveSituationFromProfile } from "@/lib/vaylo/live-situation";
import { getCompletedActionIds } from "@/lib/vaylo/user-progress";
import DashboardClientWrapper from "./_components/DashboardClientWrapper";
import FreelancerModule from "./_components/modules/FreelancerModule";
import FamilyModule from "./_components/modules/FamilyModule";
import JobSeekerModule from "./_components/modules/JobSeekerModule";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("wk_uiLang")?.value;
  const locale: Locale =
    cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)
      ? (cookieLocale as Locale)
      : DEFAULT_LOCALE;

  const { supabase, user } = await getUser();

  if (!user) {
    redirect("/login");
  }

  const dna = await getProfileDNA(supabase, user.id);

  if (!dna) {
    redirect("/");
  }

  const { data: profileRow } = await supabase
    .from("profiles")
    .select(
      "has_steuer_id, has_health_insurance, has_bank_account, registered_arbeitsagentur, has_children, children_school_age, has_cv, job_search_urgency, employment_type"
    )
    .eq("id", user.id)
    .maybeSingle();
  const liveSituation = getLiveSituationFromProfile(profileRow);

  const completedIds = await getCompletedActionIds(supabase, user.id);
  const completedActionIds = [...completedIds];

  const t = getDict(locale);

  const modules: ReactNode[] = [];

  const inputs = dna.inputs;

  if (inputs.employment_type === "freelancer") {
    modules.push(<FreelancerModule key="freelancer" dna={dna} t={t} />);
  }

  if (inputs.family_status === "family" || inputs.family_status === "children") {
    modules.push(<FamilyModule key="family" dna={dna} t={t} />);
  }

  if (inputs.employment_type === "job_seeker") {
    modules.push(<JobSeekerModule key="job" dna={dna} t={t} />);
  }

  return (
    <DashboardClientWrapper
      dna={dna}
      locale={locale}
      liveSituation={liveSituation}
      completedActionIds={completedActionIds}
      userId={user.id}
      t={t}
    >
      {modules}
    </DashboardClientWrapper>
  );
}


