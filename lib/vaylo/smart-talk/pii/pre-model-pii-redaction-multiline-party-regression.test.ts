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
): void {
  const result = redactDocument(text);
  assert.equal(result.status, "passed");
  assert.equal(result.blockingReasons.includes("MULTILINE_PARTY_BOUNDARY_UNCLEAR"), false);
  assert.equal(result.safeForModel, false);
  assert.equal(result.safeForEvidenceGates, false);
  assert.equal(result.safeForUserVisibleOutput, false);
  assert.equal(result.rawMapReturned, false);
  for (const name of names) {
    assert.equal(result.redactedText.includes(name), false, `name still present: ${name}`);
  }
  for (const fact of facts) {
    assert.equal(result.redactedText.includes(fact), true, `factual span missing: ${fact}`);
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
  assert.deepEqual(result.blockingReasons, ["MULTILINE_PARTY_BOUNDARY_UNCLEAR"]);
  const serialized = JSON.stringify(result);
  assert.equal(serialized.includes(text), false);
  for (const token of quoted) {
    assert.equal(serialized.includes(token), false, `input quoted in closed result: ${token}`);
  }
}

describe("line-start party labels without a same-line value", () => {
  test("An on its own line closes instead of reading the next line", () => {
    assertBoundaryClosed(
      "An:\nJana Novotna\nFrist bis 15.03.2026, Betrag 120,00 EUR.",
      ["Jana", "Novotna", "15.03.2026", "120,00 EUR"],
    );
  });

  test("Absender on its own line closes instead of reading the next line", () => {
    assertBoundaryClosed(
      "Absender:\nJana Novotna\nFrist bis 15.03.2026.",
      ["Jana", "Novotna", "15.03.2026"],
    );
  });

  test("Empfänger on its own line closes instead of reading the next line", () => {
    assertBoundaryClosed(
      "Empfänger:\nJana Novotna\nFrist bis 15.03.2026.",
      ["Jana", "Novotna", "15.03.2026"],
    );
  });

  test("Empfaenger on its own line closes instead of reading the next line", () => {
    assertBoundaryClosed(
      "Empfaenger:\nJana Novotna\nFrist bis 15.03.2026.",
      ["Jana", "Novotna", "15.03.2026"],
    );
  });

  test("an empty party label at the end of the input closes", () => {
    assertBoundaryClosed("An:", ["An:"]);
    assertBoundaryClosed("Empfänger:   ", ["Empfänger"]);
  });

  test("a party label inside a sentence does not use the multiline party reason", () => {
    const text = "Hinweis steht hier An:\nJana Novotna\nFrist bis 15.03.2026, Betrag 120,00 EUR.";
    const result = redactDocument(text);
    assert.equal(result.blockingReasons.includes("MULTILINE_PARTY_BOUNDARY_UNCLEAR"), false);
    assert.equal(result.safeForModel, false);
    assert.equal(result.safeForEvidenceGates, false);
    assert.equal(result.safeForUserVisibleOutput, false);
    assert.equal(result.rawMapReturned, false);
  });

  test("a same-line An name stays removed and the deadline and amount stay readable", () => {
    assertNamesGoneAndFactsKept(
      "An: Jana Novotna\nFrist bis 15.03.2026, Betrag 120,00 EUR.",
      ["Jana Novotna", "Jana", "Novotna"],
      ["15.03.2026", "120,00 EUR"],
    );
  });

  test("a same-line Absender name stays removed and the deadline stays readable", () => {
    assertNamesGoneAndFactsKept(
      "Absender: Jana Novotna\nFrist bis 15.03.2026, Betrag 85,50 EUR.",
      ["Jana Novotna", "Jana", "Novotna"],
      ["15.03.2026", "85,50 EUR"],
    );
  });

  test("a same-line Empfänger name stays removed and the deadline and amount stay readable", () => {
    assertNamesGoneAndFactsKept(
      "Empfänger: Jana Novotna. Frist bis 15.03.2026, Betrag 120,00 EUR.",
      ["Jana Novotna", "Jana", "Novotna"],
      ["15.03.2026", "120,00 EUR"],
    );
  });

  test("a same-line Empfaenger name stays removed and the deadline stays readable", () => {
    assertNamesGoneAndFactsKept(
      "Empfaenger: Novotna\nFrist bis 15.03.2026, Betrag 85,50 EUR.",
      ["Novotna"],
      ["15.03.2026", "85,50 EUR"],
    );
  });
});
