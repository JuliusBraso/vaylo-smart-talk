import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/get-user";
import { getProfileDNA } from "@/lib/dna/get-profile-dna";
import { getContentByDNA, getRecommendedPhrases } from "@/lib/vaylo/content-engine";
import PhrasesExplorer from "./_components/PhrasesExplorer";

export default async function PhrasesPage() {
  const { supabase, user } = await getUser();

  if (!user) {
    redirect("/login");
  }

  const dna = await getProfileDNA(supabase, user.id);
  if (!dna) {
    redirect("/");
  }

  const content = getContentByDNA(dna);
  const recommended = getRecommendedPhrases(dna.inputs, content, 6);

  return (
    <main className="container">
      <PhrasesExplorer content={content} recommended={recommended} />
    </main>
  );
}

