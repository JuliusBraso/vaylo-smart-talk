import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { getUser } from "@/lib/auth/get-user";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n";
import { getResolvedDict } from "@/lib/i18n/resolved-dict";
import { toClientPhrases } from "@/lib/vaylo/client-phrase";
import { getSmartPhrases } from "@/lib/vaylo/get-smart-phrases";
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

  const t = await getResolvedDict(locale);
  const { userState, dashboardActions, historyActions, stepState } = await loadUserStateContext({
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
  /** Top dashboard actions: [0] primary (+50), [1–2] secondary (+22) in `getSmartPhrases`. */
  const dashboardActionIds = dashboardActions
    .slice(0, 3)
    .map((a) => a.id)
    .filter((id): id is string => Boolean(id && id.trim()));

  if (inputs.employment_type === "freelancer") {
    modules.push(
      <FreelancerModule
        key="freelancer"
        dna={dna}
        t={t}
        smartPhrases={toClientPhrases(
          getSmartPhrases({
            userState,
            actionIds: dashboardActionIds,
            limit: 3,
            categories: ["freelancer", "bureaucracy"],
          }),
        )}
      />,
    );
  }

  if (inputs.family_status === "family" || inputs.family_status === "children") {
    modules.push(
      <FamilyModule
        key="family"
        dna={dna}
        t={t}
        smartPhrases={toClientPhrases(
          getSmartPhrases({
            userState,
            actionIds: dashboardActionIds,
            limit: 3,
            categories: ["family", "bureaucracy"],
          }),
        )}
      />,
    );
  }

  if (inputs.employment_type === "job_seeker") {
    modules.push(
      <JobSeekerModule
        key="job"
        dna={dna}
        t={t}
        smartPhrases={toClientPhrases(
          getSmartPhrases({
            userState,
            actionIds: dashboardActionIds,
            limit: 3,
            categories: ["job", "bureaucracy"],
          }),
        )}
      />,
    );
  }

  return (
    <DashboardDataProvider
      supabase={supabase}
      userId={user.id}
      userState={userState}
      dashboardActions={dashboardActions}
      historyActions={historyActions}
      stepState={stepState}
      locale={locale}
      t={t}
    >
      {modules}
    </DashboardDataProvider>
  );
}


