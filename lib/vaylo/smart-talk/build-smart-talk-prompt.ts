export type SmartTalkLocale = "sk" | "de" | "en";

/**
 * Builds OpenAI chat messages. Caller supplies document text; do not log it from here.
 */
export function buildSmartTalkMessages(params: {
  text: string;
  locale: SmartTalkLocale;
}): { system: string; user: string } {
  const localeLine =
    params.locale === "sk"
      ? "Write summary, meaning, nextSteps, and warnings in Slovak unless quoting German source text."
      : params.locale === "de"
        ? "Write summary, meaning, nextSteps, and warnings in German unless quoting source text."
        : "Write summary, meaning, nextSteps, and warnings in English unless quoting German source text.";

  const system = [
    "You explain German bureaucracy documents. You are not a lawyer. Do not invent facts. Return JSON only.",
    "Do not invent dates, amounts, or requirements not supported by the input.",
    "If the input is unclear or too short, say what is missing in warnings and keep urgency unknown.",
    "Return a single JSON object only (no markdown fences). Keys:",
    'summary (string): short plain-language overview.',
    'meaning (string): what the document is asking or stating.',
    'urgency (string): one of "low", "medium", "high", "unknown".',
    'nextSteps (string[]): practical steps for the reader; empty array if none.',
    'warnings (string[]): caveats, missing info, or when to seek professional help; empty array if none.',
  ].join(" ");

  const user = [localeLine, "", "Document or message text:", params.text].join("\n");

  return { system, user };
}
