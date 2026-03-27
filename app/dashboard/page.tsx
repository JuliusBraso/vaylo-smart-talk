import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { getUser } from "@/lib/auth/get-user";
import { getProfileDNA } from "@/lib/dna/get-profile-dna";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n";
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

  const modules: ReactNode[] = [];

  const inputs = dna.inputs;

  if (inputs.employment_type === "freelancer") {
    modules.push(<FreelancerModule key="freelancer" dna={dna} />);
  }

  if (inputs.family_status === "family" || inputs.family_status === "children") {
    modules.push(<FamilyModule key="family" dna={dna} />);
  }

  if (inputs.employment_type === "job_seeker") {
    modules.push(<JobSeekerModule key="job" dna={dna} />);
  }

  return (
    <DashboardClientWrapper dna={dna} locale={locale}>
      {modules}
    </DashboardClientWrapper>
  );
}


