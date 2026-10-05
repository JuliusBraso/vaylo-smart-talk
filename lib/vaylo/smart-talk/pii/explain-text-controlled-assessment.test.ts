import assert from "node:assert/strict";
import { describe, mock, test } from "node:test";

const realModule = await import(new URL("./pre-model-pii-redaction.ts", import.meta.url).href);

let redactionCalls = 0;
let redactionThrows = false;

mock.module("./pre-model-pii-redaction.ts", {
  namedExports: {
    redactPreModelPii(input: { text: string; lane: "controlled_document_text"; sourceKind: string }) {
      redactionCalls += 1;
      if (redactionThrows) throw new Error("synthetic-redaction-failure");
      return realModule.redactPreModelPii(input);
    },
  },
});

// Node's type-stripping loader requires this .ts specifier. The repository tsconfig does not enable allowImportingTsExtensions.
// @ts-expect-error TS5097
const { assessExplainTextCandidate } = await import("./explain-text-controlled-assessment.ts");

const RESULT_KEYS = [
  "code",
  "modelCallPermitted",
  "paymentAuthorized",
  "publicProcessingPermitted",
  "readyForModel",
  "redactionFindings",
  "textTreatedAsAnonymous",
];

const SYNTHETIC_SECRETS = [
  "ada.vzor@example.test",
  "DE89370400440532013000",
  "Nada Vzorova",
  "synthetic-redaction-failure",
  "safeForModel",
];

function assertSealed(result: ReturnType<typeof assessExplainTextCandidate>, secrets: readonly string[] = SYNTHETIC_SECRETS): void {
  assert.equal(result.modelCallPermitted, false);
  assert.equal(result.readyForModel, false);
  assert.equal(result.textTreatedAsAnonymous, false);
  assert.equal(result.paymentAuthorized, false);
  assert.equal(result.publicProcessingPermitted, false);
  assert.deepEqual(Object.keys(result).sort(), RESULT_KEYS);
  const visible = JSON.stringify(result);
  for (const secret of secrets) {
    assert.equal(visible.includes(secret), false);
  }
}

describe("explain-text controlled assessment", () => {
  test("blocked input does not run redaction", () => {
    redactionCalls = 0;
    const result = assessExplainTextCandidate("");
    assert.equal(result.code, "precheck_blocked");
    assert.equal(result.redactionFindings, "not_run");
    assert.equal(redactionCalls, 0);
    assertSealed(result);
  });

  test("input that needs revision stays closed to further processing", () => {
    const result = assessExplainTextCandidate("Kontakt ada.vzor@example.test kvoli oznamu.");
    assert.equal(result.code, "needs_user_revision");
    assert.equal(result.redactionFindings === "present" || result.redactionFindings === "none", true);
    assertSealed(result);
  });

  test("text without a supported signal does not permit a model call", () => {
    const result = assessExplainTextCandidate("Prosím vysvetlite tento oznam.");
    assert.equal(result.code, "no_supported_signal");
    assert.equal(result.modelCallPermitted, false);
    assert.equal(result.readyForModel, false);
    assertSealed(result, [...SYNTHETIC_SECRETS, "Prosím", "vysvetlite", "oznam"]);
  });

  test("an IBAN without spaces does not authorize processing or leak the value", () => {
    const result = assessExplainTextCandidate("Ucet DE89370400440532013000 nie je na uhradu.");
    assert.equal(result.code, "needs_user_revision");
    assert.equal(result.redactionFindings, "present");
    assertSealed(result);
  });

  test("a zero-finding redaction does not return the input text", () => {
    const input = "Prosím vysvetlite tento oznam.";
    const result = assessExplainTextCandidate(input);
    assert.equal(result.code, "no_supported_signal");
    assert.equal(result.redactionFindings, "none");
    assert.equal(JSON.stringify(result).includes(input), false);
    assertSealed(result, [...SYNTHETIC_SECRETS, input]);
  });

  test("a redaction failure closes without the exception text", () => {
    redactionThrows = true;
    try {
      const result = assessExplainTextCandidate("Prosím vysvetlite tento oznam.");
      assert.equal(result.code, "closed");
      assert.equal(result.redactionFindings, "unavailable");
      assertSealed(result, [...SYNTHETIC_SECRETS, "Prosím", "Error"]);
    } finally {
      redactionThrows = false;
    }
  });
});
