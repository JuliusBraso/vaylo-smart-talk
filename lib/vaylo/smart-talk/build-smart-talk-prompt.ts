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
    "You are not a lawyer and do not provide official legal advice. Do not invent facts; say when details depend on the Bundesland, employer, or individual case.",
    "Be practical and step-by-step in your answers (via the locale instruction below). nextSteps must be concrete actions where possible.",
    "If the question is clearly outside German bureaucracy, politely decline by centering summary and meaning on this exact Slovak sentence (you may add one short clarifying phrase after it): " +
      redirectSk,
    'Urgency: use "low" for general information; "medium" when deadlines, forms, appointments, or time-sensitive paperwork likely matter; "high" only when the user mentions immediate deadlines, penalties, court or authority deadlines, job loss, visa or residence risk, or urgent official letters.',
    "warnings should mention uncertainty and when to verify with an authority, official website, or qualified professional.",
    "If the question is unclear or cannot be answered safely, explain what is missing in warnings and use urgency unknown when appropriate.",
    JSON_KEYS_QUESTION,
  ].join(" ");

  const user = [localeLine, "", "User question:", params.text].join("\n");

  return { system, user };
}
