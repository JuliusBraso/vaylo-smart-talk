import type { DNAInputs } from "@/lib/dna/types";

export function getContextualPhrases(dna: { inputs: DNAInputs }): string[] {
  const phrases = new Set<string>();

  const { family_status, employment_type, goals } = dna.inputs;

  if (family_status === "children") {
    phrases.add("Ich möchte mein Kind für den Kindergarten anmelden.");
    phrases.add("Kindergeld beantragen");
  }

  if (employment_type === "freelancer") {
    phrases.add("Steuernummer beantragen");
    phrases.add("Rechnung erstellen");
  }

  if (goals.includes("bureaucracy")) {
    phrases.add("Anmeldung beim Bürgeramt");
    phrases.add("Aufenthaltstitel verlängern");
  }

  return Array.from(phrases);
}

