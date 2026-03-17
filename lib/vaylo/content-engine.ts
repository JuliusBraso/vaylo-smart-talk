import type { DNAInputs, Goal } from "@/lib/dna/types";

export type ContentCategory = "family" | "job" | "freelancer" | "bureaucracy";

export type VayloPhrase = {
  de: string;
  sk: string;
  tag: string;
};

export type ContentByCategory = Record<ContentCategory, VayloPhrase[]>;

const PHRASES: ContentByCategory = {
  family: [
    {
      tag: "kita_registration",
      de: "Ich möchte mein Kind für den Kindergarten anmelden.",
      sk: "Chcem prihlásiť dieťa do škôlky.",
    },
    {
      tag: "kindergeld_apply",
      de: "Ich möchte Kindergeld beantragen.",
      sk: "Chcem požiadať o Kindergeld (prídavok na dieťa).",
    },
    {
      tag: "school_registration",
      de: "Wo kann ich mein Kind für die Schule anmelden?",
      sk: "Kde môžem prihlásiť dieťa do školy?",
    },
  ],
  job: [
    {
      tag: "cv_review",
      de: "Können Sie meinen Lebenslauf prüfen?",
      sk: "Môžete mi skontrolovať životopis?",
    },
    {
      tag: "job_application_status",
      de: "Ich möchte den Status meiner Bewerbung nachfragen.",
      sk: "Chcem sa informovať o stave mojej žiadosti.",
    },
    {
      tag: "job_interview_availability",
      de: "Ich bin verfügbar für ein Vorstellungsgespräch.",
      sk: "Som dostupný/á na pracovný pohovor.",
    },
  ],
  freelancer: [
    {
      tag: "tax_number_request",
      de: "Ich möchte eine Steuernummer beantragen.",
      sk: "Chcem požiadať o daňové číslo (Steuernummer).",
    },
    {
      tag: "invoice_create",
      de: "Ich möchte eine Rechnung erstellen.",
      sk: "Chcem vystaviť faktúru.",
    },
    {
      tag: "finanzamt_question",
      de: "Ich habe eine Frage zu meiner Selbstständigkeit beim Finanzamt.",
      sk: "Mám otázku ohľadom mojej živnosti na Finanzamte.",
    },
  ],
  bureaucracy: [
    {
      tag: "anmeldung_buergeramt",
      de: "Ich möchte mich beim Bürgeramt anmelden.",
      sk: "Chcem sa prihlásiť na úrade (Anmeldung).",
    },
    {
      tag: "residence_permit_extend",
      de: "Ich möchte meinen Aufenthaltstitel verlängern.",
      sk: "Chcem predĺžiť povolenie na pobyt.",
    },
    {
      tag: "appointment_request",
      de: "Ich brauche einen Termin, bitte.",
      sk: "Potrebujem termín, prosím.",
    },
  ],
};

function wantsGoal(goals: Goal[], g: Goal): boolean {
  return goals.includes(g);
}

function uniqByTag(items: VayloPhrase[]): VayloPhrase[] {
  const seen = new Set<string>();
  const out: VayloPhrase[] = [];
  for (const p of items) {
    if (seen.has(p.tag)) continue;
    seen.add(p.tag);
    out.push(p);
  }
  return out;
}

export function getContentByDNA(dna: { inputs: DNAInputs }): ContentByCategory {
  const { family_status, employment_type, goals } = dna.inputs;

  const selected: ContentByCategory = {
    family: [],
    job: [],
    freelancer: [],
    bureaucracy: [],
  };

  if (family_status === "children") {
    selected.family.push(...PHRASES.family);
  } else if (family_status === "family") {
    selected.family.push(PHRASES.family[1], PHRASES.family[2]);
  }

  if (employment_type === "job_seeker" || wantsGoal(goals, "job")) {
    selected.job.push(...PHRASES.job);
  }

  if (employment_type === "freelancer") {
    selected.freelancer.push(...PHRASES.freelancer);
  }

  if (wantsGoal(goals, "bureaucracy")) {
    selected.bureaucracy.push(...PHRASES.bureaucracy);
  }

  selected.family = uniqByTag(selected.family);
  selected.job = uniqByTag(selected.job);
  selected.freelancer = uniqByTag(selected.freelancer);
  selected.bureaucracy = uniqByTag(selected.bureaucracy);

  return selected;
}

