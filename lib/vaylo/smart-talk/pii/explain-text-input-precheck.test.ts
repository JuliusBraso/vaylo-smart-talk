import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  EXPLAIN_TEXT_PRECHECK_MAX_LENGTH,
  precheckExplainTextInput,
  type ExplainTextPrecheckResult,
// Node's type-stripping loader requires this .ts specifier. The repository tsconfig does not enable allowImportingTsExtensions.
// @ts-expect-error TS5097
} from "./explain-text-input-precheck.ts";

const RESULT_KEYS = [
  "disposition",
  "languageHints",
  "modelCallPermitted",
  "paymentAuthorized",
  "publicProcessingPermitted",
  "readyForModel",
  "reasonCodes",
  "textTreatedAsAnonymous",
];

function assertClosed(result: ExplainTextPrecheckResult, forbidden: readonly string[]): void {
  assert.equal(result.modelCallPermitted, false);
  assert.equal(result.textTreatedAsAnonymous, false);
  assert.equal(result.readyForModel, false);
  assert.equal(result.paymentAuthorized, false);
  assert.equal(result.publicProcessingPermitted, false);
  assert.deepEqual(Object.keys(result).sort(), RESULT_KEYS);
  const visible = JSON.stringify(result);
  for (const token of forbidden) {
    assert.equal(visible.includes(token), false);
  }
}

describe("explain-text input precheck", () => {
  test("empty and whitespace-only input is blocked", () => {
    for (const input of ["", "   ", "\n\t"]) {
      const result = precheckExplainTextInput(input);
      assert.equal(result.disposition, "blocked");
      assert.deepEqual(result.reasonCodes, ["empty_input"]);
      assertClosed(result, []);
    }
  });

  test("input beyond the fixed limit is blocked without echoing it", () => {
    const input = "a".repeat(EXPLAIN_TEXT_PRECHECK_MAX_LENGTH + 1);
    const result = precheckExplainTextInput(input);
    assert.equal(result.disposition, "blocked");
    assert.deepEqual(result.reasonCodes, ["input_too_long"]);
    assert.equal(JSON.stringify(result).includes(input), false);
    assertClosed(result, []);
  });

  test("a lone surrogate is blocked", () => {
    const result = precheckExplainTextInput(`oznam ${String.fromCharCode(0xd800)}`);
    assert.equal(result.disposition, "blocked");
    assert.deepEqual(result.reasonCodes, ["malformed_unicode"]);
    assertClosed(result, ["oznam"]);
  });

  test("a synthetic letter header with a name and address needs revision", () => {
    const input = [
      "Odosielateľ",
      "Nada Vzorová",
      "Vzorová ulica 4",
      "811 01 Bratislava",
      "",
      "Vážená pani,",
      "prosím o vysvetlenie oznamu.",
    ].join("\n");
    const result = precheckExplainTextInput(input);
    assert.equal(result.disposition, "needs_user_revision");
    assert.equal(result.reasonCodes.includes("letter_header_name_and_address"), true);
    assertClosed(result, ["Nada", "Vzorová", "ulica", "Bratislava", "811"]);
  });

  test("a synthetic email needs revision", () => {
    const input = "Kontaktujte ada.vzor@example.test kvoli oznamu.";
    const result = precheckExplainTextInput(input);
    assert.equal(result.disposition, "needs_user_revision");
    assert.deepEqual(result.reasonCodes, ["email_address"]);
    assertClosed(result, ["ada.vzor", "example.test"]);
  });

  test("a synthetic phone number needs revision", () => {
    const input = "Telefon: +421900000000";
    const result = precheckExplainTextInput(input);
    assert.equal(result.disposition, "needs_user_revision");
    assert.deepEqual(result.reasonCodes, ["phone_number"]);
    assertClosed(result, ["+421900000000", "421"]);
  });

  test("a synthetic IBAN needs revision", () => {
    const input = "Ucet SK0000000000000000000000 nie je na uhradu.";
    const result = precheckExplainTextInput(input);
    assert.equal(result.disposition, "needs_user_revision");
    assert.deepEqual(result.reasonCodes, ["iban"]);
    assertClosed(result, ["SK0000000000000000000000", "SK00"]);
  });

  test("a compact German IBAN needs revision", () => {
    const input = "IBAN DE89370400440532013000";
    const result = precheckExplainTextInput(input);
    assert.equal(result.disposition, "needs_user_revision");
    assert.deepEqual(result.reasonCodes, ["iban"]);
    assertClosed(result, ["DE89370400440532013000"]);
  });

  test("synthetic case and customer numbers need revision", () => {
    const caseFile = precheckExplainTextInput("Číslo spisu: 2024/00001");
    assert.equal(caseFile.disposition, "needs_user_revision");
    assert.deepEqual(caseFile.reasonCodes, ["case_or_customer_number"]);
    assertClosed(caseFile, ["2024/00001", "2024"]);

    const customer = precheckExplainTextInput("Kundennummer: 100200300");
    assert.equal(customer.disposition, "needs_user_revision");
    assert.deepEqual(customer.reasonCodes, ["case_or_customer_number"]);
    assertClosed(customer, ["100200300"]);
  });

  test("mixed Slovak and German text without a supported identifier stays closed", () => {
    const input = "Prosím vysvetlite tento oznam. Bitte erklären Sie den Hinweis.";
    const result = precheckExplainTextInput(input);
    assert.equal(result.disposition, "eligible_for_controlled_review");
    assert.deepEqual(result.reasonCodes, ["no_supported_personal_data_signal"]);
    assert.deepEqual(result.languageHints, ["de", "sk"]);
    assertClosed(result, ["Prosím", "vysvetlite", "Bitte", "Hinweis"]);
  });

  test("an unrecognized identifier format needs revision and does not authorize a model call", () => {
    const input = "Značka: QX-77-ZZ";
    const result = precheckExplainTextInput(input);
    assert.equal(result.disposition, "needs_user_revision");
    assert.deepEqual(result.reasonCodes, ["unknown_identifier_format"]);
    assert.equal(result.modelCallPermitted, false);
    assertClosed(result, ["QX-77-ZZ", "Značka"]);
  });

  test("no supported personal-data signal does not permit a model call", () => {
    const result = precheckExplainTextInput("Ako postupovat pri oznámení zmeny adresy úradu?");
    assert.equal(result.disposition, "eligible_for_controlled_review");
    assert.equal(result.modelCallPermitted, false);
    assert.equal(result.readyForModel, false);
    assert.equal(result.textTreatedAsAnonymous, false);
    assert.equal(result.publicProcessingPermitted, false);
    assertClosed(result, ["oznámení", "adresy"]);
  });
});
