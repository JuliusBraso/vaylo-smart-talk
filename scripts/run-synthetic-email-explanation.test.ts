import assert from "node:assert/strict";
import { describe, test } from "node:test";
// @ts-expect-error TS5097 Node's type-stripping loader requires the .ts specifier.
import { FIXED_EMAIL_SAMPLES, executeSyntheticEmailExplanation, type SyntheticEmailRunner } from "./run-synthetic-email-explanation.ts";

function countingRunner(): { calls: Parameters<SyntheticEmailRunner>[0][]; run: SyntheticEmailRunner } {
  const calls: Parameters<SyntheticEmailRunner>[0][] = [];
  const run: SyntheticEmailRunner = async (params) => {
    calls.push(params);
    return {
      ok: true,
      result: {
        summary: "Fiktívna výzva žiada úhradu.",
        meaning: "Text opisuje vymyslenú platbu.",
        urgency: "low",
        nextSteps: ["Skontrolujte, že ide o fiktívny text."],
        warnings: ["Neposielajte skutočné údaje."],
      },
    };
  };
  return { calls, run };
}

describe("synthetic email explanation launcher", () => {
  test("the default run and unknown arguments make no external call", async () => {
    const dry = countingRunner();
    const dryReport = await executeSyntheticEmailExplanation([], dry.run);
    assert.equal(dry.calls.length, 0);
    assert.deepEqual(dryReport, { exitCode: 0, lines: ["status: dry_run"] });

    for (const argv of [
      ["--live"],
      ["hello"],
      ["--live-synthetic", "custom text"],
      ["--live-synthetic", "de", "extra"],
      ["--sample", FIXED_EMAIL_SAMPLES.de],
    ]) {
      const blocked = countingRunner();
      const report = await executeSyntheticEmailExplanation(argv, blocked.run);
      assert.equal(blocked.calls.length, 0, argv.join(" "));
      assert.deepEqual(report, { exitCode: 2, lines: ["status: unknown_argument"] });
    }
  });

  test("the model path sends exactly one fixed sample in Slovak text mode", async () => {
    const previous = process.env.SYNTHETIC_EMAIL_TEXT;
    process.env.SYNTHETIC_EMAIL_TEXT = "Tento text z prostredia sa nesmie použiť.";
    try {
      for (const sampleId of ["de", "sk"] as const) {
        const tracked = countingRunner();
        const argv = sampleId === "de" ? ["--live-synthetic"] : ["--live-synthetic", "sk"];
        const report = await executeSyntheticEmailExplanation(argv, tracked.run);
        assert.equal(tracked.calls.length, 1);
        assert.equal(tracked.calls[0].text, FIXED_EMAIL_SAMPLES[sampleId]);
        assert.equal(tracked.calls[0].text === process.env.SYNTHETIC_EMAIL_TEXT, false);
        assert.deepEqual(
          { locale: tracked.calls[0].locale, inputType: tracked.calls[0].inputType },
          { locale: "sk", inputType: "text" },
        );
        assert.equal(report.exitCode, 0);
        assert.equal(report.lines[0], "status: explained");
        assert.equal(report.lines.includes("summary:"), true);
        assert.equal(report.lines.includes("meaning:"), true);
        assert.equal(report.lines.includes("urgency: low"), true);
        assert.equal(report.lines.includes("nextSteps:"), true);
        assert.equal(report.lines.includes("warnings:"), true);
        assert.equal(report.lines.join("\n").includes("SYNTHETIC_EMAIL_TEXT"), false);
        assert.equal(report.lines.join("\n").includes("Authorization"), false);
      }
    } finally {
      if (previous === undefined) delete process.env.SYNTHETIC_EMAIL_TEXT;
      else process.env.SYNTHETIC_EMAIL_TEXT = previous;
    }
  });

  test("a failed or substitute result stays a fixed status", async () => {
    const failed = await executeSyntheticEmailExplanation(["--live-synthetic", "de"], async () => ({
      ok: false,
      error: { kind: "openai_empty" },
    }));
    assert.deepEqual(failed, { exitCode: 1, lines: ["status: model_failed"] });

    const invalid = await executeSyntheticEmailExplanation(["--live-synthetic", "sk"], async () => ({
      ok: true,
      result: {
        summary: "Nepodarilo sa spoľahlivo spracovať odpoveď AI.",
        meaning: "Skúste text odoslať znova alebo vložte kratšiu, jasnejšiu časť dokumentu.",
        urgency: "unknown",
        nextSteps: ["Náhradný krok."],
        warnings: ["Náhradné upozornenie."],
      },
    }));
    assert.deepEqual(invalid, { exitCode: 1, lines: ["status: invalid_result"] });
    assert.equal(invalid.lines.join("\n").includes("Náhradný krok"), false);
  });

  test("a thrown runner and a null result stay fixed statuses without the secret", async () => {
    const secret = "synthetic-runner-secret-7f3a";
    const thrown = await executeSyntheticEmailExplanation(["--live-synthetic"], async () => {
      throw new Error(secret);
    });
    assert.deepEqual(thrown, { exitCode: 1, lines: ["status: model_failed"] });
    assert.equal(thrown.lines.join("\n").includes(secret), false);

    const missing = await executeSyntheticEmailExplanation(["--live-synthetic", "sk"], async () => ({
      ok: true,
      result: null,
    }));
    assert.deepEqual(missing, { exitCode: 1, lines: ["status: invalid_result"] });
    assert.equal(missing.lines.join("\n").includes(secret), false);
  });
});
