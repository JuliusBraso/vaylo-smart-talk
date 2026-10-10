import assert from "node:assert/strict";
import { describe, test } from "node:test";
// @ts-expect-error TS5097 Node's type-stripping loader requires the .ts specifier.
import { redactPreModelPii } from "./pre-model-pii-redaction.ts";

function redactDocument(text: string) {
  return redactPreModelPii({
    text,
    lane: "controlled_document_text",
    sourceKind: "synthetic_governance_test",
  });
}

function assertClosed(text: string, quoted: readonly string[]): void {
  const result = redactDocument(text);
  assert.equal(result.status, "blocked");
  assert.equal(result.redactedText, "");
  assert.equal(result.safeForModel, false);
  assert.equal(result.safeForEvidenceGates, false);
  assert.equal(result.safeForUserVisibleOutput, false);
  assert.equal(result.rawMapReturned, false);
  assert.deepEqual(result.blockingReasons, ["EMAIL_SIGNATURE_NAME_BOUNDARY_UNCLEAR"]);
  const serialized = JSON.stringify(result);
  assert.equal(serialized.includes(text), false);
  for (const token of quoted) {
    assert.equal(serialized.includes(token), false, `input quoted in closed result: ${token}`);
  }
}

describe("email signature names", () => {
  test("a Slovak closing removes the next-line name and keeps the date and amount", () => {
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
    assert.deepEqual(result.blockingReasons, []);
  });

  test("a German closing removes the next-line name and keeps the date and amount", () => {
    const result = redactDocument(
      ["Frist bis 15.03.2026, Betrag 120,00 EUR.", "Mit freundlichen Grüßen", "Jana Novotna"].join("\n"),
    );
    assert.equal(result.status, "passed");
    assert.equal(result.redactedText.includes("Jana"), false);
    assert.equal(result.redactedText.includes("Novotna"), false);
    assert.equal(result.redactedText.includes("15.03.2026"), true);
    assert.equal(result.redactedText.includes("120,00 EUR"), true);
    assert.equal(result.safeForModel, false);
    assert.equal(result.safeForEvidenceGates, false);
    assert.deepEqual(result.blockingReasons, []);
  });

  test("a job title on the line after the signature name stays readable", () => {
    const result = redactDocument(
      [
        "lehota 15.03.2026, suma 120,00 EUR.",
        "S pozdravom",
        "Jana Novotna",
        "Referentka",
      ].join("\n"),
    );
    assert.equal(result.status, "passed");
    assert.equal(result.redactedText.includes("Jana"), false);
    assert.equal(result.redactedText.includes("Novotna"), false);
    assert.equal(result.redactedText.includes("Referentka"), true);
    assert.equal(result.redactedText.includes("15.03.2026"), true);
    assert.equal(result.redactedText.includes("120,00 EUR"), true);
    assert.equal(result.safeForModel, false);
    assert.equal(result.safeForEvidenceGates, false);
  });

  test("a signature name split across lines closes without quoting the name", () => {
    assertClosed(["S pozdravom", "Jana", "Novotna"].join("\n"), ["Jana", "Novotna"]);
    assertClosed("Mit freundlichen Grüßen\r\nJana Maria Novotna", ["Jana", "Maria", "Novotna"]);
  });
});
