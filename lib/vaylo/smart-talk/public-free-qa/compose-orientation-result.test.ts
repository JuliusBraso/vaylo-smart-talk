import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import * as nodeModule from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

type ResolveContext = { parentURL?: string };
type NextResolve = (specifier: string, context: ResolveContext) => { url: string };
const registerHooks = (nodeModule as unknown as {
  registerHooks: (hooks: {
    resolve: (
      specifier: string,
      context: ResolveContext,
      nextResolve: NextResolve,
    ) => { url: string; shortCircuit?: boolean };
  }) => void;
}).registerHooks;

registerHooks({
  resolve(specifier: string, context: ResolveContext, nextResolve: NextResolve) {
    let unresolvedPath: string | null = null;
    if (
      (specifier.startsWith("./") || specifier.startsWith("../")) &&
      context.parentURL?.startsWith("file:")
    ) {
      unresolvedPath = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
    }
    if (unresolvedPath && path.extname(unresolvedPath) === "") {
      for (const candidate of [`${unresolvedPath}.ts`, `${unresolvedPath}.tsx`]) {
        if (existsSync(candidate)) return nextResolve(pathToFileURL(candidate).href, context);
      }
    }
    return nextResolve(specifier, context);
  },
});

import type { ComposeOrientationResult, PublicAnswerLocale } from "./compose-orientation-result";
import type { SmartTalkResult } from "../run-smart-talk";

const { composeOrientationResult, verifyOrientationCoverage } = await import(
  "./compose-orientation-result",
);

const ENUM_PROFILE = {
  urgency: "unknown" as const,
  confidenceLevel: "low" as const,
  consequencePhase: "none" as const,
  documentQuality: "clear" as const,
  documentKind: "unknown" as const,
  domain: "unknown" as const,
  paymentChannel: "not_applicable" as const,
  proceduralState: "informational" as const,
  legalSeverity: "none" as const,
};

const EXPECTED_SK: SmartTalkResult = {
  summary: "Vaylo Smart Talk v tejto verzii poskytuje len všeobecnú orientáciu.",
  meaning:
    "Vaylo Smart Talk v tejto verzii poskytuje len všeobecnú orientáciu. Na záväzné lehoty, formuláre, zoznam dokumentov, nároky alebo kontakty na úrad overte oficiálny zdroj v príslušnej krajine (Nemecko alebo Rakúsko) alebo upresnite svoju situáciu.",
  ...ENUM_PROFILE,
  documentTypeLabel: "",
  nextSteps: [],
  warnings: [],
  stabilizers: [],
  deadlines: [],
  rights: [],
  obligations: [],
  consequences: [],
};

const EXPECTED_DE: SmartTalkResult = {
  summary: "Vaylo Smart Talk kann in dieser Version nur allgemeine Orientierung geben.",
  meaning:
    "Vaylo Smart Talk kann in dieser Version nur allgemeine Orientierung geben. Für verbindliche Fristen, Formulare, Dokumentenlisten, Ansprüche oder Behördenkontakte prüfen Sie bitte die zuständige offizielle Stelle in Deutschland oder Österreich oder konkretisieren Sie Ihre Situation.",
  ...ENUM_PROFILE,
  documentTypeLabel: "",
  nextSteps: [],
  warnings: [],
  stabilizers: [],
  deadlines: [],
  rights: [],
  obligations: [],
  consequences: [],
};

const EXPECTED_EN: SmartTalkResult = {
  summary: "Vaylo Smart Talk can only provide general orientation in this version.",
  meaning:
    "Vaylo Smart Talk can only provide general orientation in this version. For binding deadlines, forms, document lists, entitlements, or authority contacts, verify the competent official source in Germany or Austria or clarify your situation.",
  ...ENUM_PROFILE,
  documentTypeLabel: "",
  nextSteps: [],
  warnings: [],
  stabilizers: [],
  deadlines: [],
  rights: [],
  obligations: [],
  consequences: [],
};

type MutableComposeOutput = {
  result: SmartTalkResult & Record<string, unknown>;
  proof: {
    planId: "general_v1";
    locale: PublicAnswerLocale;
    segments: [
      {
        kind: "orientation_field_template";
        internalSegmentId: string;
        fieldTemplateId: string;
        locale: PublicAnswerLocale;
        destinationField: string;
      },
      {
        kind: "orientation_field_template";
        internalSegmentId: string;
        fieldTemplateId: string;
        locale: PublicAnswerLocale;
        destinationField: string;
      },
    ];
    releasedTextFields: ["summary", "meaning"];
    emptyTextFields: ["documentTypeLabel"];
    emptyArrayFields: [
      "nextSteps",
      "warnings",
      "stabilizers",
      "deadlines",
      "rights",
      "obligations",
      "consequences",
    ];
  } & Record<string, unknown>;
};

function verifyMutable(output: MutableComposeOutput): boolean {
  return verifyOrientationCoverage(output as unknown as ComposeOrientationResult);
}

function cloneOutput(output: ComposeOrientationResult): MutableComposeOutput {
  return {
    result: {
      ...output.result,
      nextSteps: [...output.result.nextSteps],
      warnings: [...output.result.warnings],
      stabilizers: [...output.result.stabilizers],
      deadlines: [...output.result.deadlines],
      rights: [...output.result.rights],
      obligations: [...output.result.obligations],
      consequences: [...output.result.consequences],
    },
    proof: {
      ...output.proof,
      segments: [
        { ...output.proof.segments[0] },
        { ...output.proof.segments[1] },
      ],
      releasedTextFields: [...output.proof.releasedTextFields],
      emptyTextFields: [...output.proof.emptyTextFields],
      emptyArrayFields: [...output.proof.emptyArrayFields],
    },
  };
}

function assertFrozenTree(output: ComposeOrientationResult): void {
  assert.equal(Object.isFrozen(output), true);
  assert.equal(Object.isFrozen(output.result), true);
  assert.equal(Object.isFrozen(output.proof), true);
  assert.equal(Object.isFrozen(output.proof.segments), true);
  assert.equal(Object.isFrozen(output.proof.segments[0]), true);
  assert.equal(Object.isFrozen(output.proof.segments[1]), true);
  assert.equal(Object.isFrozen(output.proof.releasedTextFields), true);
  assert.equal(Object.isFrozen(output.proof.emptyTextFields), true);
  assert.equal(Object.isFrozen(output.proof.emptyArrayFields), true);
  for (const key of [
    "nextSteps",
    "warnings",
    "stabilizers",
    "deadlines",
    "rights",
    "obligations",
    "consequences",
  ] as const) {
    assert.equal(Object.isFrozen(output.result[key]), true);
  }
}

test("composeOrientationResult deterministic public orientation", async (t) => {
  await t.test("SK result exact equality", () => {
    const output = composeOrientationResult({ planId: "general_v1", locale: "sk" });
    assert.deepEqual(output.result, EXPECTED_SK);
    assert.equal(verifyOrientationCoverage(output), true);
  });

  await t.test("DE result exact equality", () => {
    const output = composeOrientationResult({ planId: "general_v1", locale: "de" });
    assert.deepEqual(output.result, EXPECTED_DE);
    assert.equal(verifyOrientationCoverage(output), true);
  });

  await t.test("EN result exact equality", () => {
    const output = composeOrientationResult({ planId: "general_v1", locale: "en" });
    assert.deepEqual(output.result, EXPECTED_EN);
    assert.equal(verifyOrientationCoverage(output), true);
  });

  await t.test("segment order and count per locale", () => {
    for (const locale of ["sk", "de", "en"] as const) {
      const output = composeOrientationResult({ planId: "general_v1", locale });
      assert.equal(output.proof.segments.length, 2);
      assert.equal(output.proof.segments[0].destinationField, "summary");
      assert.equal(output.proof.segments[1].destinationField, "meaning");
      assert.equal(output.proof.segments[0].fieldTemplateId, "orientation_general_summary_v1");
      assert.equal(output.proof.segments[1].fieldTemplateId, "orientation_general_meaning_v1");
      assert.equal(output.proof.segments[0].locale, locale);
      assert.equal(output.proof.segments[1].locale, locale);
    }
  });

  await t.test("deterministic internal segment IDs", () => {
    const skA = composeOrientationResult({ planId: "general_v1", locale: "sk" });
    const skB = composeOrientationResult({ planId: "general_v1", locale: "sk" });
    const de = composeOrientationResult({ planId: "general_v1", locale: "de" });
    assert.equal(skA.proof.segments[0].internalSegmentId, skB.proof.segments[0].internalSegmentId);
    assert.equal(skA.proof.segments[1].internalSegmentId, skB.proof.segments[1].internalSegmentId);
    assert.notEqual(skA.proof.segments[0].internalSegmentId, de.proof.segments[0].internalSegmentId);
    assert.notEqual(skA.proof.segments[1].internalSegmentId, de.proof.segments[1].internalSegmentId);
  });

  await t.test("immutability", () => {
    const output = composeOrientationResult({ planId: "general_v1", locale: "en" });
    assertFrozenTree(output);
  });

  await t.test("invalid planId throws fixed error", () => {
    assert.throws(
      () => composeOrientationResult({
        planId: "clarify_jurisdiction_v1" as "general_v1",
        locale: "sk",
      }),
      (err: unknown) => err instanceof Error && err.message === "invalid_public_orientation_input",
    );
  });

  await t.test("invalid locale throws fixed error", () => {
    assert.throws(
      () => composeOrientationResult({
        planId: "general_v1",
        locale: "fr" as PublicAnswerLocale,
      }),
      (err: unknown) => err instanceof Error && err.message === "invalid_public_orientation_input",
    );
  });

  await t.test("no arbitrary prose input path", () => {
    const sk = composeOrientationResult({ planId: "general_v1", locale: "sk" });
    const de = composeOrientationResult({ planId: "general_v1", locale: "de" });
    assert.notEqual(sk.result.summary, de.result.summary);
    assert.equal(sk.result.summary, EXPECTED_SK.summary);
    assert.equal(sk.result.meaning, EXPECTED_SK.meaning);
    assert.equal(composeOrientationResult.length, 1);
  });

  await t.test("verifyOrientationCoverage tamper and malformed cases", () => {
    const canonical = composeOrientationResult({ planId: "general_v1", locale: "sk" });

    const tamperedSummary = cloneOutput(canonical);
    tamperedSummary.result.summary = "tampered";
    assert.equal(verifyMutable(tamperedSummary), false);

    const tamperedMeaning = cloneOutput(canonical);
    tamperedMeaning.result.meaning = "tampered";
    assert.equal(verifyMutable(tamperedMeaning), false);

    const tamperedEnum = cloneOutput(canonical);
    tamperedEnum.result.urgency = "high";
    assert.equal(verifyMutable(tamperedEnum), false);

    const arrayFields = [
      "nextSteps",
      "warnings",
      "stabilizers",
      "deadlines",
      "rights",
      "obligations",
      "consequences",
    ] as const;
    for (const field of arrayFields) {
      const tampered = cloneOutput(canonical);
      tampered.result[field] = ["x"];
      assert.equal(verifyMutable(tampered), false);
    }

    const tamperedLabel = cloneOutput(canonical);
    tamperedLabel.result.documentTypeLabel = "x";
    assert.equal(verifyMutable(tamperedLabel), false);

    const missingField = cloneOutput(canonical);
    delete (missingField.result as { summary?: string }).summary;
    assert.equal(verifyMutable(missingField), false);

    const extraField = cloneOutput(canonical);
    (extraField.result as SmartTalkResult & { extra?: string }).extra = "x";
    assert.equal(verifyMutable(extraField), false);

    const reordered = cloneOutput(canonical);
    reordered.proof.segments = [
      reordered.proof.segments[1],
      reordered.proof.segments[0],
    ];
    assert.equal(verifyMutable(reordered), false);

    const wrongPairing = cloneOutput(canonical);
    wrongPairing.proof.segments[0].fieldTemplateId = "orientation_general_meaning_v1";
    assert.equal(verifyMutable(wrongPairing), false);

    const wrongLocale = cloneOutput(canonical);
    wrongLocale.proof.segments[0].locale = "de";
    assert.equal(verifyMutable(wrongLocale), false);

    const forgedId = cloneOutput(canonical);
    forgedId.proof.segments[0].internalSegmentId = "forged";
    assert.equal(verifyMutable(forgedId), false);

    const missingProofField = cloneOutput(canonical);
    delete (missingProofField.proof as { planId?: string }).planId;
    assert.equal(verifyMutable(missingProofField), false);

    const extraProofField = cloneOutput(canonical);
    (extraProofField.proof as { extra?: string }).extra = "x";
    assert.equal(verifyMutable(extraProofField), false);

    assert.equal(verifyOrientationCoverage(null as unknown as ComposeOrientationResult), false);
    assert.equal(verifyOrientationCoverage({} as ComposeOrientationResult), false);
    assert.equal(verifyOrientationCoverage([] as unknown as ComposeOrientationResult), false);
  });
});

const INVALID_INPUT_MESSAGE = "invalid_public_orientation_input";

function assertInvalidComposeInput(input: unknown): void {
  assert.throws(
    () => composeOrientationResult(input as { planId: "general_v1"; locale: PublicAnswerLocale }),
    (err: unknown) => err instanceof Error && err.message === INVALID_INPUT_MESSAGE,
  );
}

function assertVerifierReturnsFalse(value: unknown): void {
  assert.doesNotThrow(() => {
    assert.equal(
      verifyOrientationCoverage(value as ComposeOrientationResult),
      false,
    );
  });
}

test("composeOrientationResult rejects invalid runtime inputs", () => {
  assertInvalidComposeInput(null);
  assertInvalidComposeInput(undefined);
  assertInvalidComposeInput("general_v1");
  assertInvalidComposeInput([]);
  assertInvalidComposeInput({});
  assertInvalidComposeInput({ locale: "sk" });
  assertInvalidComposeInput({ planId: "general_v1" });
  assertInvalidComposeInput({ planId: "general_v1", locale: "sk", extra: true });

  assertInvalidComposeInput(
    Object.defineProperty({ planId: "general_v1", locale: "sk" }, "planId", {
      get() {
        return "general_v1";
      },
      enumerable: true,
      configurable: true,
    }),
  );

  assertInvalidComposeInput(
    Object.defineProperty({ planId: "general_v1", locale: "sk" }, "locale", {
      get() {
        return "sk";
      },
      enumerable: true,
      configurable: true,
    }),
  );

  assertInvalidComposeInput(
    Object.defineProperty({ planId: "general_v1", locale: "sk" }, "planId", {
      get() {
        throw new Error("getter");
      },
      enumerable: true,
      configurable: true,
    }),
  );

  assertInvalidComposeInput(
    Object.create({
      planId: "general_v1",
      locale: "sk",
    }),
  );

  const nullProto = Object.assign(Object.create(null), {
    planId: "general_v1",
    locale: "sk",
  });
  const fromNullProto = composeOrientationResult(
    nullProto as { planId: "general_v1"; locale: PublicAnswerLocale },
  );
  assert.equal(verifyOrientationCoverage(fromNullProto), true);

  assertInvalidComposeInput(
    new Proxy(
      { planId: "general_v1", locale: "sk" },
      {
        get(_target, prop) {
          if (prop === "planId" || prop === "locale") throw new Error("proxy");
          return undefined;
        },
      },
    ),
  );

  const revokedTarget: { planId: string; locale: string } = {
    planId: "general_v1",
    locale: "sk",
  };
  const revokedProxy = Proxy.revocable(revokedTarget, {});
  revokedProxy.revoke();
  assertInvalidComposeInput(revokedProxy.proxy);
});

test("verifyOrientationCoverage is total and fail-closed", () => {
  const canonical = composeOrientationResult({ planId: "general_v1", locale: "sk" });
  const mutable = cloneOutput(canonical);

  assertVerifierReturnsFalse(null);

  const noResult = { proof: mutable.proof };
  assertVerifierReturnsFalse(noResult);

  const nullReleased = cloneOutput(canonical);
  (nullReleased.proof as { releasedTextFields: unknown }).releasedTextFields = null;
  assertVerifierReturnsFalse(nullReleased);

  const emptyTextAsObject = cloneOutput(canonical);
  (emptyTextAsObject.proof as { emptyTextFields: unknown }).emptyTextFields = {};
  assertVerifierReturnsFalse(emptyTextAsObject);

  const emptyArrayAsString = cloneOutput(canonical);
  (emptyArrayAsString.proof as { emptyArrayFields: unknown }).emptyArrayFields = "not-an-array";
  assertVerifierReturnsFalse(emptyArrayAsString);

  const nullSegments = cloneOutput(canonical);
  (nullSegments.proof as { segments: unknown }).segments = null;
  assertVerifierReturnsFalse(nullSegments);

  const sparseSegments = cloneOutput(canonical);
  const sparseSegArr: unknown[] = [];
  sparseSegArr[1] = mutable.proof.segments[1];
  (sparseSegments.proof as { segments: unknown }).segments = sparseSegArr;
  assertVerifierReturnsFalse(sparseSegments);

  const sparseMeta = cloneOutput(canonical);
  const sparseReleased: unknown[] = [];
  sparseReleased[1] = "meaning";
  (sparseMeta.proof as { releasedTextFields: unknown }).releasedTextFields = sparseReleased;
  assertVerifierReturnsFalse(sparseMeta);

  const extraMetaKey = cloneOutput(canonical);
  const releasedWithExtra = ["summary", "meaning"] as string[];
  (releasedWithExtra as string[] & { extra?: string }).extra = "x";
  (extraMetaKey.proof as { releasedTextFields: unknown }).releasedTextFields = releasedWithExtra;
  assertVerifierReturnsFalse(extraMetaKey);

  const symbolMeta = cloneOutput(canonical);
  const releasedWithSymbol = ["summary", "meaning"];
  Object.defineProperty(releasedWithSymbol, Symbol("x"), { value: 1, enumerable: true });
  (symbolMeta.proof as { releasedTextFields: unknown }).releasedTextFields = releasedWithSymbol;
  assertVerifierReturnsFalse(symbolMeta);

  const accessorIndex = cloneOutput(canonical);
  const accessorArr = ["summary", "meaning"];
  Object.defineProperty(accessorArr, "0", {
    get() {
      return "summary";
    },
    enumerable: true,
    configurable: true,
  });
  (accessorIndex.proof as { releasedTextFields: unknown }).releasedTextFields = accessorArr;
  assertVerifierReturnsFalse(accessorIndex);

  const throwingResult = cloneOutput(canonical);
  Object.defineProperty(throwingResult, "result", {
    get() {
      throw new Error("result getter");
    },
    enumerable: true,
    configurable: true,
  });
  assertVerifierReturnsFalse(throwingResult);

  const throwingProofLocale = cloneOutput(canonical);
  Object.defineProperty(throwingProofLocale.proof, "locale", {
    get() {
      throw new Error("locale getter");
    },
    enumerable: true,
    configurable: true,
  });
  assertVerifierReturnsFalse(throwingProofLocale);

  const throwingSummary = cloneOutput(canonical);
  Object.defineProperty(throwingSummary.result, "summary", {
    get() {
      throw new Error("summary getter");
    },
    enumerable: true,
    configurable: true,
  });
  assertVerifierReturnsFalse(throwingSummary);

  const throwingSegmentField = cloneOutput(canonical);
  Object.defineProperty(throwingSegmentField.proof.segments[0], "kind", {
    get() {
      throw new Error("segment getter");
    },
    enumerable: true,
    configurable: true,
  });
  assertVerifierReturnsFalse(throwingSegmentField);

  const extraSegmentKey = cloneOutput(canonical);
  (extraSegmentKey.proof.segments[0] as Record<string, unknown>).extra = "x";
  assertVerifierReturnsFalse(extraSegmentKey);

  const missingSegmentKey = cloneOutput(canonical);
  delete (missingSegmentKey.proof.segments[0] as { kind?: string }).kind;
  assertVerifierReturnsFalse(missingSegmentKey);

  const symbolSegmentKey = cloneOutput(canonical);
  Object.defineProperty(symbolSegmentKey.proof.segments[0], Symbol("k"), {
    value: "x",
    enumerable: true,
  });
  assertVerifierReturnsFalse(symbolSegmentKey);

  const nonPlainSegment = cloneOutput(canonical);
  nonPlainSegment.proof.segments[0] = Object.assign(
    Object.create({ kind: "orientation_field_template" }),
    { ...mutable.proof.segments[0] },
  );
  assertVerifierReturnsFalse(nonPlainSegment);

  assertVerifierReturnsFalse(
    new Proxy(canonical, {
      get() {
        throw new Error("root proxy");
      },
    }),
  );

  const proofProxyOutput = cloneOutput(canonical);
  proofProxyOutput.proof = new Proxy(mutable.proof, {
    get(_t, prop) {
      if (prop === "planId") throw new Error("proof proxy");
      return (_t as Record<string, unknown>)[prop as string];
    },
  }) as MutableComposeOutput["proof"];
  assertVerifierReturnsFalse(proofProxyOutput);

  const resultProxyOutput = cloneOutput(canonical);
  resultProxyOutput.result = new Proxy(mutable.result, {
    get(_t, prop) {
      if (prop === "summary") throw new Error("result proxy");
      return (_t as Record<string, unknown>)[prop as string];
    },
  }) as MutableComposeOutput["result"];
  assertVerifierReturnsFalse(resultProxyOutput);

  const wrongNested = cloneOutput(canonical);
  (wrongNested.proof as { planId: unknown }).planId = 42;
  assertVerifierReturnsFalse(wrongNested);

  const resultNull = cloneOutput(canonical);
  (resultNull as { result: unknown }).result = null;
  assertVerifierReturnsFalse(resultNull);

  const proofNull = cloneOutput(canonical);
  (proofNull as { proof: unknown }).proof = null;
  assertVerifierReturnsFalse(proofNull);

  const revoked = Proxy.revocable(canonical, {});
  revoked.revoke();
  assertVerifierReturnsFalse(revoked.proxy);
});

test("verifyOrientationCoverage accepts canonical outputs", () => {
  for (const locale of ["sk", "de", "en"] as const) {
    const output = composeOrientationResult({ planId: "general_v1", locale });
    assert.doesNotThrow(() => {
      assert.equal(verifyOrientationCoverage(output), true);
    });
  }
});
