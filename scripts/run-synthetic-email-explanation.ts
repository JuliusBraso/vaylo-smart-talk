/**
 * Local launcher for one model explanation of a hardcoded fictional email.
 *
 * The default run does not call the network or a model. `--live-synthetic`
 * may call runSmartTalk once, and only with one of the two fixed samples.
 * This is not permission to send a real email to the model.
 *
 * The sample text cannot come from arguments, a file, stdin, or the environment.
 */

import { pathToFileURL } from "node:url";

export const FIXED_EMAIL_SAMPLES = {
  de: [
    "Fiktive Nachricht der Beispielkasse Nord.",
    "Bitte zahlen Sie den ausdrücklich fiktiven Betrag 120,00 EUR bis zum ebenfalls fiktiven Datum 15.03.2026.",
    "Es gibt kein echtes Konto, kein Aktenzeichen und keine echte Adresse.",
  ].join("\n"),
  sk: [
    "Fiktívna správa Beispielkasse Nord.",
    "Prosím zaplaťte výslovne fiktívnu sumu 120,00 EUR do taktiež fiktívneho dátumu 15.03.2026.",
    "Nie je žiadny skutočný účet, žiadne číslo spisu a žiadna skutočná adresa.",
  ].join("\n"),
} as const;

export type FixedEmailSampleId = keyof typeof FIXED_EMAIL_SAMPLES;

const URGENCY = new Set(["low", "medium", "high", "unknown"]);
const SUBSTITUTE_SUMMARIES = new Set([
  "Nepodarilo sa spoľahlivo spracovať odpoveď AI.",
  "Nepodarilo sa získať zhrnutie z výstupu modelu.",
]);
const SUBSTITUTE_MEANINGS = new Set([
  "Skúste text odoslať znova alebo vložte kratšiu, jasnejšiu časť dokumentu.",
  "Ďalšie informácie nájdete v zhrnutí a upozorneniach.",
]);

export type SyntheticEmailRunner = (params: {
  text: string;
  locale: "sk";
  inputType: "text";
}) => Promise<{ ok: true; result: unknown } | { ok: false; error: { kind: string } }>;

export type SyntheticEmailReport = {
  exitCode: number;
  lines: readonly string[];
};

export function parseSyntheticEmailArgs(
  argv: readonly string[],
): { kind: "dry" } | { kind: "unknown" } | { kind: "live"; sampleId: FixedEmailSampleId } {
  if (argv.length === 0) return { kind: "dry" };
  if (argv.length === 1 && argv[0] === "--live-synthetic") return { kind: "live", sampleId: "de" };
  if (
    argv.length === 2 &&
    argv[0] === "--live-synthetic" &&
    (argv[1] === "de" || argv[1] === "sk")
  ) {
    return { kind: "live", sampleId: argv[1] };
  }
  return { kind: "unknown" };
}

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string" && item.trim().length > 0);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function explanationLines(sampleId: FixedEmailSampleId, result: Record<string, unknown>): string[] | null {
  if (typeof result.summary !== "string" || result.summary.trim().length === 0) return null;
  if (typeof result.meaning !== "string" || result.meaning.trim().length === 0) return null;
  if (typeof result.urgency !== "string" || !URGENCY.has(result.urgency)) return null;
  if (!isStringList(result.nextSteps) || !isStringList(result.warnings)) return null;
  if (SUBSTITUTE_SUMMARIES.has(result.summary) || SUBSTITUTE_MEANINGS.has(result.meaning)) return null;
  return [
    "status: explained",
    `sample: ${sampleId}`,
    "summary:",
    result.summary,
    "meaning:",
    result.meaning,
    `urgency: ${result.urgency as string}`,
    "nextSteps:",
    ...result.nextSteps.map((step) => `- ${step}`),
    "warnings:",
    ...result.warnings.map((warning) => `- ${warning}`),
  ];
}

export async function executeSyntheticEmailExplanation(
  argv: readonly string[],
  runSmartTalk: SyntheticEmailRunner,
): Promise<SyntheticEmailReport> {
  const parsed = parseSyntheticEmailArgs(argv);
  if (parsed.kind === "dry") return { exitCode: 0, lines: ["status: dry_run"] };
  if (parsed.kind === "unknown") return { exitCode: 2, lines: ["status: unknown_argument"] };

  const text = FIXED_EMAIL_SAMPLES[parsed.sampleId];
  let outcome: unknown;
  try {
    outcome = await runSmartTalk({ text, locale: "sk", inputType: "text" });
  } catch {
    return { exitCode: 1, lines: ["status: model_failed"] };
  }
  if (!isRecord(outcome) || outcome.ok === false) {
    return { exitCode: 1, lines: ["status: model_failed"] };
  }
  if (outcome.ok !== true || !isRecord(outcome.result)) {
    return { exitCode: 1, lines: ["status: invalid_result"] };
  }
  const lines = explanationLines(parsed.sampleId, outcome.result);
  if (!lines) return { exitCode: 1, lines: ["status: invalid_result"] };
  return { exitCode: 0, lines };
}

function isDirectRun(): boolean {
  const entry = process.argv[1];
  if (!entry) return false;
  return import.meta.url === pathToFileURL(entry).href;
}

async function main(): Promise<void> {
  const report = await executeSyntheticEmailExplanation(process.argv.slice(2), async (params) => {
    // @ts-expect-error TS5097 Node's type-stripping loader requires the .ts specifier.
    const mod = await import("../lib/vaylo/smart-talk/run-smart-talk.ts");
    return mod.runSmartTalk(params);
  });
  for (const line of report.lines) console.log(line);
  process.exit(report.exitCode);
}

if (isDirectRun()) {
  void main();
}
