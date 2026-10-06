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

function assertNamesGoneAndFactsKept(
  text: string,
  names: readonly string[],
  facts: readonly string[],
  removedIdentifiers: readonly string[],
): void {
  const result = redactDocument(text);
  assert.equal(result.status, "passed");
  assert.equal(result.safeForModel, false);
  assert.equal(result.safeForEvidenceGates, false);
  assert.equal(result.safeForUserVisibleOutput, false);
  assert.equal(result.rawMapReturned, false);
  for (const name of names) {
    assert.equal(
      result.redactedText.includes(name),
      false,
      `fictional name still in redactedText: ${name}\n${result.redactedText}`,
    );
  }
  for (const fact of facts) {
    assert.equal(result.redactedText.includes(fact), true, `factual span missing: ${fact}`);
  }
  for (const identifier of removedIdentifiers) {
    assert.equal(result.redactedText.includes(identifier), false, `identifier still present: ${identifier}`);
  }
}

function assertBoundaryClosed(text: string, quoted: readonly string[]): void {
  const result = redactDocument(text);
  assert.equal(result.status, "blocked");
  assert.equal(result.redactedText, "");
  assert.equal(result.safeForModel, false);
  assert.equal(result.safeForEvidenceGates, false);
  assert.equal(result.safeForUserVisibleOutput, false);
  assert.equal(result.rawMapReturned, false);
  assert.deepEqual(result.blockingReasons, ["LINE_LABEL_NAME_BOUNDARY_UNCLEAR"]);
  const serialized = JSON.stringify(result);
  assert.equal(serialized.includes(text), false);
  for (const token of quoted) {
    assert.equal(serialized.includes(token), false, `input quoted in closed result: ${token}`);
  }
}

describe("line-start An and Absender names", () => {
  test("a one-word An line removes the fictional name and keeps the deadline and amount", () => {
    assertNamesGoneAndFactsKept(
      "An: Novotna\nBitte zahlen Sie 120,00 EUR bis zum 15.03.2026. Kundennummer: KD-55020",
      ["Novotna"],
      ["120,00 EUR", "15.03.2026"],
      ["KD-55020"],
    );
  });

  test("An: Jana Novotna removes the fictional name and keeps the deadline and amount", () => {
    assertNamesGoneAndFactsKept(
      "An: Jana Novotna\nBitte zahlen Sie 120,00 EUR bis zum 15.03.2026. Kundennummer: KD-55021",
      ["Jana Novotna", "Jana", "Novotna"],
      ["120,00 EUR", "15.03.2026"],
      ["KD-55021"],
    );
  });

  test("a one-word Absender line removes the fictional name and keeps the deadline and amount", () => {
    assertNamesGoneAndFactsKept(
      "Absender: Novotna\nBitte zahlen Sie 85,50 EUR bis zum 15.03.2026. Kundennummer: KD-55022",
      ["Novotna"],
      ["85,50 EUR", "15.03.2026"],
      ["KD-55022"],
    );
  });

  test("Absender: Jana Novotna removes the fictional name and keeps the deadline and amount", () => {
    assertNamesGoneAndFactsKept(
      "Absender: Jana Novotna\nBitte zahlen Sie 85,50 EUR bis zum 15.03.2026. Kundennummer: KD-55023",
      ["Jana Novotna", "Jana", "Novotna"],
      ["85,50 EUR", "15.03.2026"],
      ["KD-55023"],
    );
  });

  test("leading spaces still count as a line-start Absender name", () => {
    assertNamesGoneAndFactsKept(
      "  Absender: Jana Novotna\nBitte zahlen Sie 85,50 EUR bis zum 15.03.2026. Kundennummer: KD-55024",
      ["Jana Novotna", "Jana", "Novotna"],
      ["85,50 EUR", "15.03.2026"],
      ["KD-55024"],
    );
  });

  test("An: Jana Novotna Widerspruch closes instead of removing Widerspruch", () => {
    assertBoundaryClosed(
      "An: Jana Novotna Widerspruch",
      ["Jana", "Novotna", "Widerspruch"],
    );
  });

  test("Absender: Jana Novotna Kündigung. closes instead of removing Kündigung", () => {
    assertBoundaryClosed(
      "Absender: Jana Novotna Kündigung.",
      ["Jana", "Novotna", "Kündigung"],
    );
  });
});
