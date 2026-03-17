import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/get-user";
import { getProfileDNA } from "@/lib/dna/get-profile-dna";
import { getContentByDNA } from "@/lib/vaylo/content-engine";
import PhraseChips from "@/app/dashboard/_components/PhraseChips";

const CATEGORY_LABELS: Record<string, string> = {
  family: "Family",
  job: "Job",
  freelancer: "Freelancer",
  bureaucracy: "Bureaucracy",
};

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

  return (
    <main className="container">
      <div className="card w-full">
        <div className="cardHeader">
          <div className="cardTitle">Quick phrases</div>
          <div className="cardSub muted">
            Click a chip to copy the German phrase (DE). Slovak (SK) is included
            for context.
          </div>
        </div>

        <div className="list flex flex-col gap-3">
          {(
            Object.entries(content) as Array<
              [keyof typeof content, (typeof content)[keyof typeof content]]
            >
          )
            .filter(([, phrases]) => phrases.length > 0)
            .map(([category, phrases]) => (
              <section
                key={category}
                className="card flex w-full flex-col gap-3"
              >
                <div className="cardHeader">
                  <div className="cardTitle">
                    {CATEGORY_LABELS[String(category)] ?? String(category)}
                  </div>
                  <div className="cardSub muted">
                    {phrases.length} phrase{phrases.length === 1 ? "" : "s"}
                  </div>
                </div>
                <PhraseChips phrases={phrases} />
              </section>
            ))}
        </div>
      </div>
    </main>
  );
}

