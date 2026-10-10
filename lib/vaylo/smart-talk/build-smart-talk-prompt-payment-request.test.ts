import assert from "node:assert/strict";
import { describe, test } from "node:test";

// Node's type-stripping loader requires this .ts specifier. The repository tsconfig does not enable allowImportingTsExtensions.
// @ts-expect-error TS5097
const { STRICT_DOCUMENT_PAYMENT_REQUEST_MARKER, buildSmartTalkMessages, deriveSmartTalkReasoningProtocol } = await import("./build-smart-talk-prompt.ts");

const GERMAN_PAYMENT_REQUEST = [
  "Absender: Beispielstelle Nord",
  "Betreff: Offene Bearbeitungsgebühr",
  "Die Bearbeitungsgebühr von 120,00 EUR ist noch nicht eingegangen. Bitte überweisen Sie den Betrag bis zum 15.11.2026.",
  "Wenn die Zahlung bis zu diesem Termin nicht eingeht, kommt ein zusätzlicher Betrag von 5,00 EUR hinzu.",
].join("\n");

const SLOVAK_PAYMENT_REQUEST = [
  "Odosielateľ: Beispielstelle Nord",
  "Predmet: Neuhradený spracovateľský poplatok",
  "Spracovateľský poplatok 120,00 EUR ešte nie je uhradený. Uhradu prosíme do 15.11.2026.",
  "Ak platba do tohto termínu nepríde, pripočíta sa dodatočný poplatok 5,00 EUR.",
].join("\n");

const PAYMENT_RULE_PHRASES = [
  STRICT_DOCUMENT_PAYMENT_REQUEST_MARKER,
  "whether that text is German or Slovak",
  "claims of the message, not as a verified debt",
  "official contact obtained independently of the message",
  "check whether the amount was already paid",
  "Do not unconditionally recommend paying",
  "Do not use a payment link, account identifier, or contact taken from the message",
  "Keep a deadline and a conditional fee only when the message states them literally",
  "Do not invent payment details, legal consequences, or further deadlines",
  "priority of safely verifying the matter",
  "does not confirm that the email is authentic or that the debt is valid",
  "keep the uncertainty",
];

describe("strict document payment-request prompt", () => {
  test("selects strict_document for German and Slovak payment text and keeps the rule out of public questions", () => {
    for (const text of [GERMAN_PAYMENT_REQUEST, SLOVAK_PAYMENT_REQUEST]) {
      assert.equal(
        deriveSmartTalkReasoningProtocol({ inputType: "text", text }),
        "strict_document",
      );
      const document = buildSmartTalkMessages({ text, locale: "sk", inputType: "text" });
      assert.equal(document.system.includes("You explain German bureaucracy documents"), true);
      assert.equal(document.user.includes("in Slovak"), true);
      assert.equal(document.user.includes(text), true);
      for (const phrase of PAYMENT_RULE_PHRASES) {
        assert.equal(document.system.includes(phrase), true, phrase);
      }
    }

    const publicQuestion = "Ako mám postupovať pri platobnej výzve v Nemecku?";
    assert.equal(
      deriveSmartTalkReasoningProtocol({ inputType: "question", text: publicQuestion }),
      "bureaucratic_guide",
    );
    const question = buildSmartTalkMessages({
      text: publicQuestion,
      locale: "sk",
      inputType: "question",
      publicJurisdictionScope: "de_at_sk_cross_border",
    });
    assert.equal(question.system.includes("PUBLIC_JURISDICTION_SCOPE:de_at_sk_cross_border"), true);
    assert.equal(question.system.includes("You explain German bureaucracy documents"), false);
    assert.equal(question.user.includes("User question:"), true);
    for (const phrase of PAYMENT_RULE_PHRASES) {
      assert.equal(question.system.includes(phrase), false, phrase);
    }
  });
});
