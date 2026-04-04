/**
 * Deterministic mention phrases for assistant topic resolution (v1).
 * Output remains canonical action ids only; matching scans sk + de + en buckets (no UI locale yet).
 */

export type AssistantInputLang = "sk" | "de" | "en";

export type AssistantMentionCanonicalId =
  | "arbeitsagentur"
  | "health-insurance"
  | "cv"
  | "steuer-id"
  | "anmeldung"
  | "bank-account";

/** Global precedence: first matching action wins (after per-action phrase ordering). */
export const ASSISTANT_INPUT_ACTION_ORDER: readonly AssistantMentionCanonicalId[] = [
  "arbeitsagentur",
  "health-insurance",
  "cv",
  "steuer-id",
  "anmeldung",
  "bank-account",
];

export type AssistantInputLexiconEntry = Record<AssistantInputLang, readonly string[]>;

export const ASSISTANT_INPUT_LEXICON: Record<
  AssistantMentionCanonicalId,
  AssistantInputLexiconEntry
> = {
  arbeitsagentur: {
    sk: ["pracák", "pracak"],
    de: ["arbeitsagentur", "jobcenter"],
    en: ["arbeitsagentur", "jobcenter"],
  },
  "health-insurance": {
    sk: [
      "zdravotné poistenie",
      "zdravotne poistenie",
      "zdravotné",
      "zdravotne",
      "poistenie",
    ],
    de: [
      "gesetzliche krankenversicherung",
      "krankenversicherung",
      "krankenkasse",
    ],
    en: ["health insurance"],
  },
  cv: {
    sk: ["životopis"],
    de: ["lebenslauf"],
    en: [
      "curriculum vitae",
      " cv",
      "cv ",
      "cv,",
      "cv.",
      "cv?",
      "cv:",
      " cv.",
    ],
  },
  "steuer-id": {
    sk: ["daňové číslo", "daňové cislo"],
    de: ["steuer-id", "steuer id"],
    en: ["tax id", "steuer-id", "steuer id"],
  },
  anmeldung: {
    sk: ["prihlásenie adresy", "prihlasenie adresy", "registrácia", "registracia"],
    de: ["anmeldung"],
    en: ["anmeldung"],
  },
  "bank-account": {
    sk: ["účet", "ucet"],
    de: ["bank account", "konto", "bank"],
    en: ["bank account", "konto", "bank"],
  },
};

/**
 * Normalized, deduped phrases for one action, longest first (then stable string order).
 */
export function getSortedPhrasesForAction(
  canonicalId: AssistantMentionCanonicalId
): string[] {
  const { sk, de, en } = ASSISTANT_INPUT_LEXICON[canonicalId];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of [...sk, ...de, ...en]) {
    const n = p.toLowerCase().normalize("NFC");
    if (!seen.has(n)) {
      seen.add(n);
      out.push(n);
    }
  }
  out.sort((a, b) => b.length - a.length || a.localeCompare(b));
  return out;
}
