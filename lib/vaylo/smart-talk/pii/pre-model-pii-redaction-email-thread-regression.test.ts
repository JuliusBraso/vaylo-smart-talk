import assert from "node:assert/strict";
import { describe, test } from "node:test";
// @ts-expect-error TS5097 Node's type-stripping loader requires the .ts specifier.
import { redactPreModelPii } from "./pre-model-pii-redaction.ts";

const QUOTED = ["Jana", "Novotna", "jana.vzor@example.test", "10.03.2026", "15.03.2026", "120,00 EUR"];

function redactDocument(text: string) {
  return redactPreModelPii({
    text,
    lane: "controlled_document_text",
    sourceKind: "synthetic_governance_test",
  });
}

function assertThreadClosed(text: string): void {
  const result = redactDocument(text);
  assert.equal(result.status, "blocked");
  assert.equal(result.redactedText, "");
  assert.equal(result.safeForModel, false);
  assert.equal(result.safeForEvidenceGates, false);
  assert.equal(result.safeForUserVisibleOutput, false);
  assert.equal(result.rawMapReturned, false);
  assert.deepEqual(result.blockingReasons, ["EMAIL_QUOTED_THREAD_BOUNDARY_UNCLEAR"]);
  const serialized = JSON.stringify(result);
  assert.equal(serialized.includes(text), false);
  for (const token of QUOTED) {
    if (!text.includes(token)) continue;
    assert.equal(serialized.includes(token), false, `input quoted in closed result: ${token}`);
  }
}

describe("quoted and forwarded email threads", () => {
  test("a forwarded-message line closes the whole input", () => {
    assertThreadClosed(
      [
        "lehota 15.03.2026, suma 120,00 EUR.",
        "---------- Forwarded message ---------",
        "Von: Jana Novotna <jana.vzor@example.test>",
      ].join("\n"),
    );
  });

  test("a Slovak reply header closes the whole input", () => {
    assertThreadClosed(
      [
        "Dňa 10.03.2026 Jana Novotna napísala:",
        "jana.vzor@example.test",
        "lehota 15.03.2026, suma 120,00 EUR.",
      ].join("\n"),
    );
  });

  test("a German reply header closes the whole input", () => {
    assertThreadClosed(
      ["Am 10.03.2026 schrieb Jana Novotna:", "jana.vzor@example.test"].join("\r\n"),
    );
  });

  test("a quoted line closes the whole input instead of keeping the newest part", () => {
    assertThreadClosed(
      ["lehota 15.03.2026, suma 120,00 EUR.", "> Jana Novotna <jana.vzor@example.test>"].join("\n"),
    );
  });

  test("a standalone email without a thread marker keeps the signature result", () => {
    const result = redactDocument(
      ["lehota 15.03.2026, suma 120,00 EUR.", "S pozdravom", "Jana Novotna"].join("\n"),
    );
    assert.equal(result.status, "passed");
    assert.equal(result.redactedText.includes("Jana"), false);
    assert.equal(result.redactedText.includes("Novotna"), false);
    assert.equal(result.redactedText.includes("15.03.2026"), true);
    assert.equal(result.redactedText.includes("120,00 EUR"), true);
    assert.equal(result.safeForModel, false);
    assert.equal(result.safeForEvidenceGates, false);
    assert.equal(result.blockingReasons.includes("EMAIL_QUOTED_THREAD_BOUNDARY_UNCLEAR"), false);
  });
});
