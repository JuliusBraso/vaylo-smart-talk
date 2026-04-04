import type { CatalogCardCopy, Dict, GuideStepCopy } from "@/lib/i18n";

export type GuideCategory =
  | "residence"
  | "family"
  | "work"
  | "tax"
  | "health"
  | "documents"
  | "school"
  | "benefits"
  | "other";

export type GuideStep = {
  id: string;
  title: string;
  text: string;
};

/** Structural catalog entry; list/header titles come from `t.guidesCatalog[id]`. */
export type Guide = {
  id: string;
  slug: string;
  category: GuideCategory;
  audience?: string[];
  relatedLetters?: string[];
  relatedForms?: string[];
  steps: GuideStep[];
};

const GUIDES: Guide[] = [
  {
    id: "guide_anmeldung",
    slug: "anmeldung",
    category: "documents",
    audience: ["new_arrivals", "workers", "families"],
    relatedLetters: ["anmeldung_appointment_request"],
    relatedForms: ["anmeldung_form"],
    steps: [
      {
        id: "anmeldung_1",
        title: "Book a Bürgeramt appointment",
        text: "Search your city’s Bürgeramt website and book the earliest available Anmeldung appointment.",
      },
      {
        id: "anmeldung_2",
        title: "Collect required documents",
        text: "Prepare passport/ID, rental contract, and Wohnungsgeberbestätigung from your landlord.",
      },
      {
        id: "anmeldung_3",
        title: "Fill the registration form",
        text: "Complete the Anmeldung form before the appointment to avoid delays at the office.",
      },
      {
        id: "anmeldung_4",
        title: "Attend appointment and submit documents",
        text: "Arrive early, submit your documents, and verify your address details are correct.",
      },
      {
        id: "anmeldung_5",
        title: "Keep your Meldebescheinigung safe",
        text: "Store the confirmation document securely; banks, employers, and other offices may request it.",
      },
    ],
  },
  {
    id: "guide_steuer_id",
    slug: "steuer-id",
    category: "tax",
    audience: ["employees", "freelancers", "job_seekers"],
    relatedLetters: ["tax_id_followup_request"],
    relatedForms: ["tax_number_registration"],
    steps: [
      {
        id: "steuer_1",
        title: "Complete Anmeldung first",
        text: "Your Steuer-ID is generated after address registration, so finalize Anmeldung as your first step.",
      },
      {
        id: "steuer_2",
        title: "Wait for the official letter",
        text: "The Bundeszentralamt usually sends your Steuer-ID by post within a few weeks.",
      },
      {
        id: "steuer_3",
        title: "Check your mailbox name label",
        text: "Ensure your surname is visible on the mailbox so official letters can be delivered correctly.",
      },
      {
        id: "steuer_4",
        title: "Request it again if missing",
        text: "If it does not arrive, request a re-send through the official tax office process.",
      },
      {
        id: "steuer_5",
        title: "Share with employer or tax advisor",
        text: "Provide your Steuer-ID to your employer or advisor to avoid emergency tax class deductions.",
      },
    ],
  },
  {
    id: "guide_kindergeld",
    slug: "kindergeld",
    category: "benefits",
    audience: ["families_with_children"],
    relatedLetters: ["kindergeld_status_request"],
    relatedForms: ["kg1_main_form", "anlage_kind"],
    steps: [
      {
        id: "kindergeld_1",
        title: "Check eligibility basics",
        text: "Confirm residence status, child age, and household details meet Kindergeld requirements.",
      },
      {
        id: "kindergeld_2",
        title: "Prepare personal and child documents",
        text: "Collect IDs, birth certificate, Anmeldung proof, and tax IDs for parent and child.",
      },
      {
        id: "kindergeld_3",
        title: "Complete KG1 and child annex forms",
        text: "Fill the main application and child annex carefully; signatures and correct IBAN are important.",
      },
      {
        id: "kindergeld_4",
        title: "Submit to Familienkasse",
        text: "Send forms online or by post to the correct Familienkasse office for your region.",
      },
      {
        id: "kindergeld_5",
        title: "Track status and reply quickly",
        text: "Respond fast to additional document requests to avoid delays in first payment.",
      },
    ],
  },
  {
    id: "guide_health_insurance",
    slug: "health-insurance",
    category: "health",
    audience: ["employees", "freelancers", "students", "families"],
    relatedLetters: ["insurance_membership_request"],
    relatedForms: ["insurance_membership_application"],
    steps: [
      {
        id: "health_1",
        title: "Decide public vs private route",
        text: "Most newcomers start with public insurance; check your employment type and salary threshold.",
      },
      {
        id: "health_2",
        title: "Compare providers and service language",
        text: "Review contribution rates, digital tools, and whether customer support is available in your language.",
      },
      {
        id: "health_3",
        title: "Submit membership application",
        text: "Apply with your personal details, address, and employment information.",
      },
      {
        id: "health_4",
        title: "Send confirmation to employer/office",
        text: "Share your insurance confirmation with employer, immigration office, or university when required.",
      },
      {
        id: "health_5",
        title: "Register family members if needed",
        text: "If eligible, add spouse/children to family insurance and keep records of all confirmations.",
      },
    ],
  },
  {
    id: "guide_residence_permit",
    slug: "residence-permit",
    category: "residence",
    audience: ["non_eu_workers", "students", "families"],
    relatedLetters: ["residence_extension_request"],
    relatedForms: ["residence_extension_form"],
    steps: [
      {
        id: "residence_1",
        title: "Check permit expiry early",
        text: "Start 8-12 weeks before expiry; many cities have long waiting times for appointments.",
      },
      {
        id: "residence_2",
        title: "Collect mandatory documents",
        text: "Prepare passport, current permit, biometric photo, proof of income, insurance, and housing.",
      },
      {
        id: "residence_3",
        title: "Book appointment or submit online",
        text: "Use your city’s online portal where available, and keep confirmation emails/screenshots.",
      },
      {
        id: "residence_4",
        title: "Submit complete application",
        text: "Double-check all files before submission; incomplete applications are commonly delayed.",
      },
      {
        id: "residence_5",
        title: "Request Fiktionsbescheinigung if needed",
        text: "If your permit expires before decision, ask for temporary legal stay confirmation.",
      },
      {
        id: "residence_6",
        title: "Track processing and collect card",
        text: "Follow office instructions, then collect the new residence card once notified.",
      },
    ],
  },
];

export function getGuideCatalogCopy(guideId: string, t: Dict): CatalogCardCopy {
  const c = t.guidesCatalog[guideId];
  if (c?.title) return c;
  return { title: guideId, shortDescription: "" };
}

/** Prefer `t.guidesDetail`; fall back to engine `title` / `text` when locale title is missing. */
export function getGuideStepCopy(
  guideId: string,
  stepId: string,
  t: Dict,
  fallbackStep?: Pick<GuideStep, "title" | "text">
): GuideStepCopy {
  const d = t.guidesDetail[guideId]?.[stepId];
  if (d?.title?.trim()) {
    return { title: d.title, text: d.text ?? "" };
  }
  return {
    title: fallbackStep?.title ?? stepId,
    text: fallbackStep?.text ?? "",
  };
}

export function getGuides(): Guide[] {
  return GUIDES;
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
