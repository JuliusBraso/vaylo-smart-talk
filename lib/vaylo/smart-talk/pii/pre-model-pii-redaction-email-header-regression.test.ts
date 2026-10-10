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

function assertBoundaryClosed(text: string, quoted: readonly string[]): void {
  const result = redactDocument(text);
  assert.equal(result.status, "blocked");
  assert.equal(result.redactedText, "");
  assert.equal(result.safeForModel, false);
  assert.equal(result.safeForEvidenceGates, false);
  assert.equal(result.safeForUserVisibleOutput, false);
  assert.equal(result.rawMapReturned, false);
  assert.deepEqual(result.blockingReasons, ["EMAIL_HEADER_PARTY_BOUNDARY_UNCLEAR"]);
  const serialized = JSON.stringify(result);
  assert.equal(serialized.includes(text), false);
  for (const token of quoted) {
    assert.equal(serialized.includes(token), false, `input quoted in closed result: ${token}`);
  }
}

describe("line-start email header parties", () => {
  test("a clear Von, From, and To line replaces the name and address and keeps the subject and facts", () => {
    const result = redactDocument(
      [
        "Von: Jana Novotna <jana.vzor@example.test>",
        "From: Petra Prikladova <petra.vzor@example.test>",
        "To: Adam Vzor <adam.vzor@example.test>",
        "Betreff: Poplatok",
        "Subject: Poplatok",
        "Frist bis 15.03.2026, Betrag 120,00 EUR.",
      ].join("\n"),
    );
    assert.equal(result.status, "passed");
    assert.equal(result.safeForModel, false);
    assert.equal(result.safeForEvidenceGates, false);
    assert.equal(result.safeForUserVisibleOutput, false);
    assert.equal(result.rawMapReturned, false);
    const lines = result.redactedText.split("\n");
    assert.equal(lines.length, 6);
    for (const line of lines.slice(0, 3)) {
      assert.equal(line.includes("Jana") || line.includes("Petra") || line.includes("Adam"), false);
      assert.equal(line.includes("@"), false);
      assert.equal(line.startsWith("[PII:EMAIL_ADDRESS:"), true);
    }
    assert.equal(lines[3], "Betreff: Poplatok");
    assert.equal(lines[4], "Subject: Poplatok");
    assert.equal(lines[5], "Frist bis 15.03.2026, Betrag 120,00 EUR.");
    for (const token of [
      "Jana Novotna",
      "Petra Prikladova",
      "Adam Vzor",
      "jana.vzor@example.test",
      "petra.vzor@example.test",
      "adam.vzor@example.test",
    ]) {
      assert.equal(result.redactedText.includes(token), false, token);
    }
  });

  test("an incomplete Von line closes instead of keeping the name", () => {
    assertBoundaryClosed(
      "Von: Jana Novotna\nBetreff: Poplatok\nFrist bis 15.03.2026, Betrag 120,00 EUR.",
      ["Jana", "Novotna", "15.03.2026", "120,00 EUR"],
    );
  });

  test("several recipients on one To line close the result", () => {
    assertBoundaryClosed(
      "To: Jana Novotna <jana.vzor@example.test>, Petra Prikladova <petra.vzor@example.test>\nSubject: Poplatok",
      ["Jana", "Novotna", "Petra", "Prikladova", "jana.vzor@example.test", "petra.vzor@example.test"],
    );
  });

  test("a wrapped header continuation closes instead of joining the next line", () => {
    assertBoundaryClosed(
      "Von: Jana Novotna\n<jana.vzor@example.test>\nFrist bis 15.03.2026, Betrag 120,00 EUR.",
      ["Jana", "Novotna", "jana.vzor@example.test", "15.03.2026"],
    );
  });

  test("a clear header followed by an indented LF line closes", () => {
    assertBoundaryClosed(
      "Von: Jana Novotna <jana.vzor@example.test>\n  Betreff: Poplatok\n15.03.2026",
      ["Jana", "Novotna", "jana.vzor@example.test", "Betreff", "Poplatok", "15.03.2026"],
    );
  });

  test("a spaces-only LF line after a clear header keeps the subject and facts", () => {
    const result = redactDocument(
      "Von: Jana Novotna <jana.vzor@example.test>\n   \nSubject: Poplatok\nFrist bis 15.03.2026, Betrag 120,00 EUR.",
    );
    assert.equal(result.status, "passed");
    assert.equal(result.blockingReasons.includes("EMAIL_HEADER_PARTY_BOUNDARY_UNCLEAR"), false);
    assert.equal(result.safeForModel, false);
    assert.equal(result.safeForEvidenceGates, false);
    assert.equal(result.safeForUserVisibleOutput, false);
    assert.equal(result.rawMapReturned, false);
    assert.equal(result.redactedText.includes("Jana Novotna"), false);
    assert.equal(result.redactedText.includes("jana.vzor@example.test"), false);
    assert.equal(result.redactedText.includes("[PII:EMAIL_ADDRESS:"), true);
    assert.equal(result.redactedText.includes("Subject: Poplatok"), true);
    assert.equal(result.redactedText.includes("15.03.2026"), true);
    assert.equal(result.redactedText.includes("120,00 EUR"), true);
  });

  test("a tab-only CRLF line after a clear header keeps the subject and facts", () => {
    const result = redactDocument(
      "From: Petra Prikladova <petra.vzor@example.test>\r\n\t\r\nBetreff: Poplatok\r\nFrist bis 15.03.2026, Betrag 120,00 EUR.",
    );
    assert.equal(result.status, "passed");
    assert.equal(result.blockingReasons.includes("EMAIL_HEADER_PARTY_BOUNDARY_UNCLEAR"), false);
    assert.equal(result.safeForModel, false);
    assert.equal(result.safeForEvidenceGates, false);
    assert.equal(result.safeForUserVisibleOutput, false);
    assert.equal(result.rawMapReturned, false);
    assert.equal(result.redactedText.includes("Petra Prikladova"), false);
    assert.equal(result.redactedText.includes("petra.vzor@example.test"), false);
    assert.equal(result.redactedText.includes("[PII:EMAIL_ADDRESS:"), true);
    assert.equal(result.redactedText.includes("Betreff: Poplatok"), true);
    assert.equal(result.redactedText.includes("15.03.2026"), true);
    assert.equal(result.redactedText.includes("120,00 EUR"), true);
  });

  test("a clear header followed by a tabbed CRLF line closes", () => {
    assertBoundaryClosed(
      "From: Petra Prikladova <petra.vzor@example.test>\r\n\tSubject: Termin\r\n15.03.2026",
      ["Petra", "Prikladova", "petra.vzor@example.test", "Subject", "Termin", "15.03.2026"],
    );
  });

  test("an email header line over the fixed limit closes", () => {
    const line = `From: Jana Novotna <longheader${"a".repeat(180)}@example.test>`;
    assert.equal(line.length > 200, true);
    assertBoundaryClosed(line, ["Jana", "Novotna", "longheader"]);
  });

  test("a header label inside a sentence does not use the email header rule", () => {
    const result = redactDocument(
      "Poznamka v texte From: Jana Novotna <jana.vzor@example.test> ostava mimo pravidla. Frist bis 15.03.2026, Betrag 120,00 EUR.",
    );
    assert.equal(result.blockingReasons.includes("EMAIL_HEADER_PARTY_BOUNDARY_UNCLEAR"), false);
    assert.equal(result.safeForModel, false);
    assert.equal(result.safeForEvidenceGates, false);
    assert.equal(result.safeForUserVisibleOutput, false);
    assert.equal(result.rawMapReturned, false);
  });
});
