import { DICTS } from "@/lib/i18n";
import { getIntentBoostsFromProfile } from "@/lib/assistant/dna-intent-boost";
import { pickIntentTopic } from "@/lib/assistant/match-intent";
import { getIntentTopics } from "@/lib/assistant/intent-topics";
import type { Profile } from "@/lib/profile";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

export function runAssistantIntentRoutingVerification(): void {
  // Use Slovak dictionary so we closely mirror real user expectations.
  const topics = getIntentTopics(DICTS.sk);

  const profileFamilyChildren = {
    dna: {
      inputs: {
        family_status: "children",
        employment_type: "employee",
        language_level: "A2",
        goals: ["bureaucracy"],
      },
    },
  } as unknown as Profile;

  const familyBoosts = getIntentBoostsFromProfile(profileFamilyChildren);

  const t1 = pickIntentTopic("potrebujem pomoc", topics, familyBoosts);
  assert(
    t1?.id === "kindergeld",
    `Expected "potrebujem pomoc" to prefer kindergeld, got "${t1?.id ?? "null"}"`,
  );

  const t2 = pickIntentTopic(
    "potrebujem pomoc s daňami",
    topics,
    familyBoosts,
  );
  assert(
    t2?.id === "steuer-id" || t2?.id === "tax-return",
    `Expected tax topic to win for Slovak tax phrasing, got "${t2?.id ?? "null"}"`,
  );

  const t3 = pickIntentTopic("dane", topics, familyBoosts);
  assert(
    t3?.id === "steuer-id" || t3?.id === "tax-return",
    `Expected tax topic to win for "dane", got "${t3?.id ?? "null"}"`,
  );

  const profileFreelancer = {
    dna: {
      inputs: {
        family_status: "single",
        employment_type: "freelancer",
        language_level: "A2",
        goals: ["bureaucracy"],
      },
    },
  } as unknown as Profile;

  const freelancerBoosts = getIntentBoostsFromProfile(profileFreelancer);
  const t4 = pickIntentTopic("kindergeld", topics, freelancerBoosts);
  assert(
    t4?.id === "kindergeld",
    `Expected explicit "kindergeld" to match kindergeld, got "${t4?.id ?? "null"}"`,
  );
}

