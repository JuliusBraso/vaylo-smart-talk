import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { getUser } from "@/lib/auth/get-user";
import { DEFAULT_LOCALE, getDict, LOCALES, type Locale } from "@/lib/i18n";
import { loadUserStateContext } from "@/lib/vaylo/state/load-user-state-context";
import DashboardDataProvider from "./_components/DashboardDataProvider";
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

  const t = getDict(locale);
  const { userState, dashboardActions } = await loadUserStateContext({
    supabase,
    userId: user.id,
    t,
  });

  if (!userState.identity.dna) {
    redirect("/");
  }

  const dna = userState.identity.dna;

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
    <DashboardDataProvider
      supabase={supabase}
      userId={user.id}
      userState={userState}
      dashboardActions={dashboardActions}
      locale={locale}
      t={t}
    >
      {modules}
    </DashboardDataProvider>
  );
}


