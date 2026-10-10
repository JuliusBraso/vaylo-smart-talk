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
    "Betreff: Testzahlung der Beispielstelle Nord",
    "",
    "Dies ist nur ein Test. Die Beispielstelle Nord und die Forderung sind nicht wirklich. Zahlen Sie nichts.",
    "Die Testsumme beträgt 120,00 EUR. Der Zahlungstermin ist der 15.11.2026.",
    "Bei Versäumnis gilt ein ausdrücklich fiktives Entgelt von 5,00 EUR.",
  ].join("\n"),
  sk: [
    "Predmet: Testovacia platba Beispielstelle Nord",
    "",
    "Toto je len test. Beispielstelle Nord a pohľadávka nie sú skutočné. Nič neplaťte.",
    "Testovacia suma je 120,00 EUR. Platobný termín je 15.11.2026.",
    "Pri zmeškaní platí výslovne fiktívny poplatok 5,00 EUR.",
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

const DIAGNOSTIC_CODES = {
  substitute_explanation: "diagnostic: substitute_explanation",
  missing_summary_or_meaning: "diagnostic: missing_summary_or_meaning",
  invalid_urgency: "diagnostic: invalid_urgency",
  empty_next_steps: "diagnostic: empty_next_steps",
  empty_warnings: "diagnostic: empty_warnings",
  invalid_result_shape: "diagnostic: invalid_result_shape",
} as const;

type DiagnosticCode = keyof typeof DIAGNOSTIC_CODES;

export function parseSyntheticEmailArgs(
  argv: readonly string[],
): { kind: "dry" } | { kind: "unknown" } | { kind: "live"; sampleId: FixedEmailSampleId; diagnose: boolean } {
  if (argv.length === 0) return { kind: "dry" };
  if (argv.length === 1 && argv[0] === "--live-synthetic") {
    return { kind: "live", sampleId: "de", diagnose: false };
  }
  if (argv.length === 2 && argv[0] === "--live-synthetic" && (argv[1] === "de" || argv[1] === "sk")) {
    return { kind: "live", sampleId: argv[1], diagnose: false };
  }
  if (
    (argv.length === 3 &&
      argv[0] === "--live-synthetic" &&
      (argv[1] === "de" || argv[1] === "sk") &&
      argv[2] === "--diagnose")
  ) {
    return { kind: "live", sampleId: argv[1], diagnose: true };
  }
  return { kind: "unknown" };
}

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string" && item.trim().length > 0);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function diagnosticCode(result: unknown): DiagnosticCode | null {
  if (!isRecord(result)) return "invalid_result_shape";
  if (
    typeof result.summary !== "string" ||
    result.summary.trim().length === 0 ||
    typeof result.meaning !== "string" ||
    result.meaning.trim().length === 0
  ) {
    return "missing_summary_or_meaning";
  }
  if (SUBSTITUTE_SUMMARIES.has(result.summary) || SUBSTITUTE_MEANINGS.has(result.meaning)) {
    return "substitute_explanation";
  }
  if (typeof result.urgency !== "string" || !URGENCY.has(result.urgency)) return "invalid_urgency";
  if (!Array.isArray(result.nextSteps)) return "invalid_result_shape";
  if (result.nextSteps.length === 0) return "empty_next_steps";
  if (!isStringList(result.nextSteps)) return "invalid_result_shape";
  if (!Array.isArray(result.warnings)) return "invalid_result_shape";
  if (result.warnings.length === 0) return "empty_warnings";
  if (!isStringList(result.warnings)) return "invalid_result_shape";
  return null;
}

function explanationLines(sampleId: FixedEmailSampleId, result: Record<string, unknown>): string[] {
  const nextSteps = result.nextSteps as string[];
  const warnings = result.warnings as string[];
  return [
    "status: explained",
    `sample: ${sampleId}`,
    "summary:",
    result.summary as string,
    "meaning:",
    result.meaning as string,
    `urgency: ${result.urgency as string}`,
    "nextSteps:",
    ...nextSteps.map((step) => `- ${step}`),
    "warnings:",
    ...warnings.map((warning) => `- ${warning}`),
  ];
}

function invalidResult(diagnose: boolean, code: DiagnosticCode): SyntheticEmailReport {
  const lines = ["status: invalid_result"];
  if (diagnose) lines.push(DIAGNOSTIC_CODES[code]);
  return { exitCode: 1, lines };
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
  if (outcome.ok !== true) return invalidResult(parsed.diagnose, "invalid_result_shape");
  const code = diagnosticCode(outcome.result);
  if (code) return invalidResult(parsed.diagnose, code);
  return { exitCode: 0, lines: explanationLines(parsed.sampleId, outcome.result as Record<string, unknown>) };
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
  process.exitCode = report.exitCode;
}

if (isDirectRun()) {
  void main();
}
