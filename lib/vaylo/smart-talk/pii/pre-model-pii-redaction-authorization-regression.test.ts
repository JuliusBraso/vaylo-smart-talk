import assert from "node:assert/strict";
import { describe, test } from "node:test";
// @ts-expect-error TS5097 Node's type-stripping loader requires the .ts specifier.
import { redactPreModelPii } from "./pre-model-pii-redaction.ts";

function assertDocumentLaneStaysClosed(
  text: string,
  sourceKind: string,
): ReturnType<typeof redactPreModelPii> {
  const result = redactPreModelPii({
    text,
    lane: "controlled_document_text",
    sourceKind,
  });
  assert.equal(result.safeForModel, false);
  assert.equal(result.safeForEvidenceGates, false);
  assert.equal(result.safeForUserVisibleOutput, false);
  assert.equal(result.rawMapReturned, false);
  return result;
}

describe("document lane redaction does not authorize model use", () => {
  test("an unmarked name remains after the address is redacted", () => {
    const result = assertDocumentLaneStaysClosed(
      "Jana Testova\nTeststrasse 8\n12345 Musterstadt",
      "synthetic_unmarked_name",
    );
    assert.equal(result.status, "passed");
    assert.equal(result.redactedText.includes("Jana Testova"), true);
    assert.equal(result.redactedText.includes("Teststrasse 8"), false);
    assert.equal(result.detectorHits.some((hit) => hit.category === "postal_address"), true);
  });

  test("a removed recipient name and case number do not authorize model use", () => {
    const result = assertDocumentLaneStaysClosed(
      "An: Petra Prikladova\nAktenzeichen: SP-2024/00077",
      "paid_document",
    );
    assert.equal(result.status, "passed");
    assert.equal(result.redactedText.includes("Petra Prikladova"), false);
    assert.equal(result.redactedText.includes("Petra"), false);
    assert.equal(result.redactedText.includes("Prikladova"), false);
    assert.equal(result.redactedText.includes("SP-2024/00077"), false);
    assert.equal(result.detectorHits.length > 1, true);
  });

  test("a recognized IBAN does not authorize model or evidence-gate use", () => {
    const spaced = assertDocumentLaneStaysClosed(
      "Bankverbindung: DE89 3704 0044 0532 0130 00",
      "synthetic_governance_test",
    );
    assert.equal(spaced.status, "passed");
    assert.equal(spaced.redactedText.includes("DE89 3704 0044 0532 0130 00"), false);
    assert.equal(spaced.detectorHits.some((hit) => hit.category === "iban"), true);

    const compact = assertDocumentLaneStaysClosed(
      "Ucet DE89370400440532013000 [PII:IBAN:1]",
      "placeholder_text_must_not_authorize",
    );
    assert.equal(compact.status, "passed");
    assert.equal(compact.redactedText.includes("DE89370400440532013000"), false);
    assert.equal(compact.safeForModel, false);
    assert.equal(compact.safeForEvidenceGates, false);
  });
});
