import assert from "node:assert/strict";
import { describe, test } from "node:test";
// @ts-expect-error TS5097 Node's type-stripping loader requires the .ts specifier.
import { precheckExplainTextInput } from "./explain-text-input-precheck.ts";
// @ts-expect-error TS5097 Node's type-stripping loader requires the .ts specifier.
import { redactPreModelPii } from "./pre-model-pii-redaction.ts";

const CLEAR_MIXED_EMAIL = [
  "Von: Jana Novotna <jana.vzor@example.test>",
  "Vážený pán Vzor,",
  "lehota 15.03.2026, suma 120,00 EUR.",
].join("\n");

const UNCLEAR_MIXED_EMAIL = [
  "Von: Jana Novotna <jana.vzor@example.test>",
  "Vážený pán Vzor platba",
  "lehota 15.03.2026, suma 120,00 EUR.",
].join("\n");

function redactDocument(text: string) {
  return redactPreModelPii({
    text,
    lane: "controlled_document_text",
    sourceKind: "synthetic_governance_test",
  });
}

describe("mixed-language email greeting", () => {
  test("a clear Slovak salutation under a German header removes the surname and keeps the facts", () => {
    const result = redactDocument(CLEAR_MIXED_EMAIL);
    const again = redactDocument(CLEAR_MIXED_EMAIL);
    assert.deepEqual(result, again);
    assert.equal(result.status, "passed");
    assert.equal(result.redactedText.includes("Vzor"), false);
    assert.equal(result.redactedText.includes("Jana"), false);
    assert.equal(result.redactedText.includes("Novotna"), false);
    assert.equal(result.redactedText.includes("jana.vzor@example.test"), false);
    assert.equal(result.redactedText.includes("15.03.2026"), true);
    assert.equal(result.redactedText.includes("120,00 EUR"), true);
    assert.equal(result.safeForModel, false);
    assert.equal(result.safeForEvidenceGates, false);
    assert.equal(result.safeForUserVisibleOutput, false);
    assert.equal(result.rawMapReturned, false);
    assert.deepEqual(result.blockingReasons, []);

    const precheck = precheckExplainTextInput(CLEAR_MIXED_EMAIL);
    assert.equal(precheck.modelCallPermitted, false);
    assert.equal(precheck.readyForModel, false);
    assert.equal(precheck.publicProcessingPermitted, false);
    assert.equal(precheck.paymentAuthorized, false);
    assert.deepEqual(precheck.languageHints, []);
  });

  test("a surname on the next line does not count as the same-line greeting", () => {
    for (const text of ["Vážený pán\nVzor,", "Vážený pán\r\nVzor,", "Vážený pán   \nVzor,"]) {
      const result = redactDocument(text);
      assert.equal(result.status, "blocked");
      assert.equal(result.redactedText, "");
      assert.equal(result.safeForModel, false);
      assert.equal(result.safeForEvidenceGates, false);
      assert.equal(result.safeForUserVisibleOutput, false);
      assert.equal(result.rawMapReturned, false);
      assert.deepEqual(result.blockingReasons, ["SLOVAK_GREETING_NAME_BOUNDARY_UNCLEAR"]);
      const serialized = JSON.stringify(result);
      assert.equal(serialized.includes(text), false);
      assert.equal(serialized.includes("Vzor"), false);
    }
  });

  test("an unclear Slovak salutation closes the result without a readable name", () => {
    const result = redactDocument(UNCLEAR_MIXED_EMAIL);
    assert.equal(result.status, "blocked");
    assert.equal(result.redactedText, "");
    assert.equal(result.safeForModel, false);
    assert.equal(result.safeForEvidenceGates, false);
    assert.equal(result.safeForUserVisibleOutput, false);
    assert.equal(result.rawMapReturned, false);
    assert.deepEqual(result.blockingReasons, ["SLOVAK_GREETING_NAME_BOUNDARY_UNCLEAR"]);
    const serialized = JSON.stringify(result);
    assert.equal(serialized.includes(UNCLEAR_MIXED_EMAIL), false);
    for (const token of ["Vzor", "Jana", "Novotna", "jana.vzor@example.test", "15.03.2026", "120,00 EUR"]) {
      assert.equal(serialized.includes(token), false, `input quoted in closed result: ${token}`);
    }
  });
});
