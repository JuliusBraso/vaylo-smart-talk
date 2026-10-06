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
  assert.deepEqual(result.blockingReasons, ["RECIPIENT_NAME_BOUNDARY_UNCLEAR"]);
  const serialized = JSON.stringify(result);
  assert.equal(serialized.includes(text), false);
  for (const token of quoted) {
    assert.equal(serialized.includes(token), false, `input quoted in closed result: ${token}`);
  }
}

describe("document lane name spans in redacted text", () => {
  test("a one-word recipient name keeps the deadline and amount", () => {
    assertNamesGoneAndFactsKept(
      "Empfänger: Novotna. Bitte zahlen Sie 120,00 EUR bis zum 15.03.2026. Kundennummer: KD-44020",
      ["Novotna"],
      ["120,00 EUR", "15.03.2026"],
      ["KD-44020"],
    );
  });

  test("Empfänger line removes the fictional name and keeps the deadline and amount", () => {
    assertNamesGoneAndFactsKept(
      "Empfänger: Jana Novotna. Bitte zahlen Sie 120,00 EUR bis zum 15.03.2026. Kundennummer: KD-44021",
      ["Jana Novotna", "Jana", "Novotna"],
      ["120,00 EUR", "15.03.2026"],
      ["KD-44021"],
    );
  });

  test("a two-word recipient line removes the whole fictional name", () => {
    assertNamesGoneAndFactsKept(
      "Empfänger: Jana Novotna\nBitte zahlen Sie 120,00 EUR bis zum 15.03.2026. Kundennummer: KD-44022",
      ["Jana Novotna", "Jana", "Novotna"],
      ["120,00 EUR", "15.03.2026"],
      ["KD-44022"],
    );
  });

  test("a three-word recipient line is an unclear name boundary", () => {
    assertBoundaryClosed(
      "Empfänger: Jana Maria Novotna\nFrist bis 15.03.2026, Betrag 85,50 EUR. Kundennummer: KD-44023",
      ["Jana", "Maria", "Novotna", "15.03.2026", "85,50 EUR", "KD-44023"],
    );
  });

  test("three name-like words closed by a period stay blocked", () => {
    assertBoundaryClosed(
      "Empfänger: Jana Novotna Kündigung.",
      ["Jana", "Novotna", "Kündigung"],
    );
  });

  test("three name-like words at the line end stay blocked", () => {
    assertBoundaryClosed(
      "Empfänger: Jana Novotna Widerspruch",
      ["Jana", "Novotna", "Widerspruch"],
    );
  });

  test("extra text after the recipient name closes the result instead of removing Widerspruch", () => {
    assertBoundaryClosed(
      "Empfänger: Jana Novotna Widerspruch einlegen bis 15.03.2026.",
      ["Jana", "Novotna", "Widerspruch", "einlegen", "15.03.2026"],
    );
  });

  test("extra text after the recipient name closes the result instead of removing Kündigung", () => {
    assertBoundaryClosed(
      "Empfänger: Jana Novotna Kündigung bis 15.03.2026.",
      ["Jana", "Novotna", "Kündigung", "15.03.2026"],
    );
  });

  test("German greeting removes the fictional surname and keeps the deadline and amount", () => {
    assertNamesGoneAndFactsKept(
      "Sehr geehrte Frau Novotna, die Frist endet am 15.03.2026 und der Betrag beträgt 85,50 EUR. E-Mail: jana.vzor@example.test",
      ["Novotna"],
      ["15.03.2026", "85,50 EUR"],
      ["jana.vzor@example.test"],
    );
  });

  test("Slovak greeting removes the fictional surname and keeps the deadline and amount", () => {
    assertNamesGoneAndFactsKept(
      "Vážená pani Nováková, lehota je 15.03.2026 a suma je 85,50 EUR. Kontakt: ada.vzor@example.test",
      ["Nováková"],
      ["15.03.2026", "85,50 EUR", "lehota"],
      ["ada.vzor@example.test"],
    );
  });
});
