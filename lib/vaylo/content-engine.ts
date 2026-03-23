import type { DNAInputs, Goal } from "@/lib/dna/types";

export type ContentCategory = "family" | "job" | "freelancer" | "bureaucracy";

export type VayloPhrase = {
  id: string;
  de: string;
  sk: string;
  tag: string;
};

export type ContentByCategory = Record<ContentCategory, VayloPhrase[]>;

const PHRASES: ContentByCategory = {
  family: [
    {
      id: "kita_registration",
      tag: "kita_registration",
      de: "Ich möchte mein Kind für den Kindergarten anmelden.",
      sk: "Chcem prihlásiť dieťa do škôlky.",
    },
    {
      id: "kindergeld_apply",
      tag: "kindergeld_apply",
      de: "Ich möchte Kindergeld beantragen.",
      sk: "Chcem požiadať o Kindergeld (prídavok na dieťa).",
    },
    {
      id: "school_registration",
      tag: "school_registration",
      de: "Wo kann ich mein Kind für die Schule anmelden?",
      sk: "Kde môžem prihlásiť dieťa do školy?",
    },
  ],
  job: [
    {
      id: "cv_review",
      tag: "cv_review",
      de: "Können Sie meinen Lebenslauf prüfen?",
      sk: "Môžete mi skontrolovať životopis?",
    },
    {
      id: "job_application_status",
      tag: "job_application_status",
      de: "Ich möchte den Status meiner Bewerbung nachfragen.",
      sk: "Chcem sa informovať o stave mojej žiadosti.",
    },
    {
      id: "job_interview_availability",
      tag: "job_interview_availability",
      de: "Ich bin verfügbar für ein Vorstellungsgespräch.",
      sk: "Som dostupný/á na pracovný pohovor.",
    },
  ],
  freelancer: [
    {
      id: "tax_number_request",
      tag: "tax_number_request",
      de: "Ich möchte eine Steuernummer beantragen.",
      sk: "Chcem požiadať o daňové číslo (Steuernummer).",
    },
    {
      id: "invoice_create",
      tag: "invoice_create",
      de: "Ich möchte eine Rechnung erstellen.",
      sk: "Chcem vystaviť faktúru.",
    },
    {
      id: "finanzamt_question",
      tag: "finanzamt_question",
      de: "Ich habe eine Frage zu meiner Selbstständigkeit beim Finanzamt.",
      sk: "Mám otázku ohľadom mojej živnosti na Finanzamte.",
    },
  ],
  bureaucracy: [
    {
      id: "anmeldung_buergeramt",
      tag: "anmeldung_buergeramt",
      de: "Ich möchte mich beim Bürgeramt anmelden.",
      sk: "Chcem sa prihlásiť na úrade (Anmeldung).",
    },
    {
      id: "residence_permit_extend",
      tag: "residence_permit_extend",
      de: "Ich möchte meinen Aufenthaltstitel verlängern.",
      sk: "Chcem predĺžiť povolenie na pobyt.",
    },
    {
      id: "appointment_request",
      tag: "appointment_request",
      de: "Ich brauche einen Termin, bitte.",
      sk: "Potrebujem termín, prosím.",
    },
  ],
};

function wantsGoal(goals: Goal[], g: Goal): boolean {
  return goals.includes(g);
}

function uniqById(items: VayloPhrase[]): VayloPhrase[] {
  const seen = new Set<string>();
  const out: VayloPhrase[] = [];
  for (const p of items) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
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

  selected.family = uniqById(selected.family);
  selected.job = uniqById(selected.job);
  selected.freelancer = uniqById(selected.freelancer);
  selected.bureaucracy = uniqById(selected.bureaucracy);

  return selected;
}

