import assert from "node:assert/strict";
import { describe, test } from "node:test";
// @ts-expect-error TS5097 Node's type-stripping loader requires the .ts specifier.
import { redactPreModelPii } from "./pre-model-pii-redaction.ts";

function assertNoKnownLeak(text: string, privateSpans: readonly string[]): void {
  const result = redactPreModelPii({
    text,
    lane: "controlled_document_text",
    sourceKind: "synthetic_governance_test",
  });
  assert.equal(result.status, "passed");
  assert.equal(result.safeForUserVisibleOutput, false);
  for (const span of privateSpans) {
    assert.equal(result.redactedText.includes(span), false, `unredacted synthetic span: ${span}`);
  }
}

describe("synthetic document redaction regressions", () => {
  test("German greeting covers the person's name, not just the salutation", () => {
    assertNoKnownLeak(
      "Sehr geehrte Frau Nada Vzorova,\nMusterstraße 12\n12345 Musterstadt\nAktenzeichen: AB-2024/4711\nBitte antworten Sie bis 31.12.2026.",
      ["Nada Vzorova", "Musterstraße 12", "AB-2024/4711"],
    );
  });

  test("Slovak labeled name and address cover their values", () => {
    assertNoKnownLeak(
      "Meno: Jana Testova\nAdresa: Ulica Skusobna 12, 12345 Mesto\nČíslo spisu: 2024/00001\nProsím vysvetlite list.",
      ["Jana Testova", "Skusobna 12", "2024/00001"],
    );
  });
});
