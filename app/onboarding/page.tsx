import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/get-user";
import { getProfileDNA } from "@/lib/dna/get-profile-dna";
import OnboardingFlow from "./_components/OnboardingFlow";

export default async function OnboardingPage() {
  const { supabase, user } = await getUser();

  if (!user) {
    redirect("/login");
  }

  const dna = await getProfileDNA(supabase, user.id);
  if (dna) {
    redirect("/dashboard");
  }

  return <OnboardingFlow />;
}

