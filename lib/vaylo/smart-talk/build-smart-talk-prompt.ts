export type SmartTalkLocale = "sk" | "de" | "en";

export type SmartTalkInputType = "text" | "question";

const JSON_KEYS_TEXT = [
  "Return a single JSON object only (no markdown fences). Keys:",
  'summary (string): short plain-language overview.',
  'meaning (string): what the document is asking or stating.',
  'urgency (string): one of "low", "medium", "high", "unknown".',
  'nextSteps (string[]): practical steps for the reader; empty array if none.',
  'warnings (string[]): caveats, missing info, or when to seek professional help; empty array if none.',
].join(" ");

const JSON_KEYS_QUESTION = [
  "Return a single JSON object only (no markdown fences). Keys:",
  'summary (string): short plain-language overview.',
  'meaning (string): practical explanation and context answering the user question.',
  'urgency (string): one of "low", "medium", "high", "unknown".',
  'nextSteps (string[]): practical steps for the reader; empty array if none.',
  'warnings (string[]): caveats, missing info, or when to seek professional help; empty array if none.',
].join(" ");

/**
 * Builds OpenAI chat messages. Caller supplies user content; do not log it from here.
 */
export function buildSmartTalkMessages(params: {
  text: string;
  locale: SmartTalkLocale;
  inputType: SmartTalkInputType;
}): { system: string; user: string } {
  const localeLine =
    params.locale === "sk"
      ? "Write summary, meaning, nextSteps, and warnings in Slovak unless quoting German source text."
      : params.locale === "de"
        ? "Write summary, meaning, nextSteps, and warnings in German unless quoting source text."
        : "Write summary, meaning, nextSteps, and warnings in English unless quoting German source text.";

  if (params.inputType === "text") {
    const system = [
      "You explain German bureaucracy documents. You are not a lawyer. Do not invent facts. Return JSON only.",
      "Do not invent dates, amounts, or requirements not supported by the input.",
      "If the input is unclear or too short, say what is missing in warnings and keep urgency unknown.",
      JSON_KEYS_TEXT,
    ].join(" ");

    const user = [localeLine, "", "Document or message text:", params.text].join("\n");

    return { system, user };
  }

  const redirectSk =
    "Vaylo Smart Talk je určený na otázky o nemeckej byrokracii. Skúste otázku preformulovať v tomto kontexte.";

  const system = [
    "You answer practical questions about German bureaucracy for everyday life in Germany (forms, offices, taxes, residence, benefits, letters from authorities, etc.).",
    "You are not a lawyer and do not provide official legal advice. Give practical orientation only; avoid authoritative legal wording. Do not invent facts; say when details depend on the Bundesland, employer, or individual case.",
    "Prefer typical German workflows as commonly described by authorities and official portals; do not overclaim certainty.",
    'In Slovak prose, use calibrated wording such as "zvyčajne", "často", "môže sa líšiť podľa mesta alebo situácie", or noting dependence on Bundesland or individual case when processes vary.',
    "Where helpful once per answer, include standard German terms in parentheses (examples: Familienkasse, Bürgeramt, Einwohnermeldeamt, Wohnungsgeberbestätigung, Steuer-ID, Bundeszentralamt für Steuern (BZSt), Finanzamt, Krankenkasse, Agentur für Arbeit).",
    "Steuer-ID: After Anmeldung, Steuer-ID is usually sent automatically by post (timing varies). If it does not arrive, the user can contact Bundeszentralamt für Steuern (BZSt) or the relevant Finanzamt — do NOT present visiting a local office as the main or default way to obtain Steuer-ID. Employers or tax steps may need the number; the user can often tell the employer they are waiting for it.",
    "Anmeldung: Usually requires an appointment or visit at Bürgeramt or Einwohnermeldeamt (booking rules vary by city). Name Wohnungsgeberbestätigung from the landlord as a key document, plus ID/passport and the completed Anmeldung form; note deadlines and fees can differ by municipality or Bundesland.",
    "Kindergeld: Mention Familienkasse; typical documents may include birth certificates, proof of residence or registration, tax IDs where relevant, and details of family situation—but do not claim one universal checklist for every household. Encourage checking official Familienkasse guidance for the user case.",
    "Be practical and step-by-step (via the locale instruction below). nextSteps must be concrete actions where possible; prefer them over generic explanations.",
    "If the question is clearly outside German bureaucracy, politely decline by centering summary and meaning on this exact Slovak sentence (you may add one short clarifying phrase after it): " +
      redirectSk,
    'Urgency: prefer "low" for general informational questions; use "medium" when deadlines, forms, appointments, or time-sensitive paperwork likely matter; "high" only when the user mentions immediate deadlines, penalties, court or authority deadlines, job loss, visa or residence risk, or urgent official letters.',
    "warnings should mention uncertainty and when to verify with an authority, official website, or qualified professional.",
    "If the question is unclear or cannot be answered safely, explain what is missing in warnings and use urgency unknown when appropriate.",
    JSON_KEYS_QUESTION,
  ].join(" ");

  const user = [localeLine, "", "User question:", params.text].join("\n");

  return { system, user };
}
