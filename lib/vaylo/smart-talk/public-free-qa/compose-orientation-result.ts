import { createHash } from "node:crypto";

import type { SmartTalkResult } from "../run-smart-talk";

export type PublicAnswerLocale = "sk" | "de" | "en";

export type OrientationPlanId = "general_v1";

export type OrientationDestinationField = "summary" | "meaning";

export type OrientationFieldTemplateId =
  | "orientation_general_summary_v1"
  | "orientation_general_meaning_v1";

export type InternalOrientationSegment = Readonly<{
  kind: "orientation_field_template";
  internalSegmentId: string;
  fieldTemplateId: OrientationFieldTemplateId;
  locale: PublicAnswerLocale;
  destinationField: OrientationDestinationField;
}>;

export type OrientationCoverageProof = Readonly<{
  planId: "general_v1";
  locale: PublicAnswerLocale;
  segments: readonly [
    InternalOrientationSegment,
    InternalOrientationSegment,
  ];
  releasedTextFields: readonly ["summary", "meaning"];
  emptyTextFields: readonly ["documentTypeLabel"];
  emptyArrayFields: readonly [
    "nextSteps",
    "warnings",
    "stabilizers",
    "deadlines",
    "rights",
    "obligations",
    "consequences",
  ];
}>;

export type ComposeOrientationResult = Readonly<{
  result: Readonly<SmartTalkResult>;
  proof: OrientationCoverageProof;
}>;

const ORIENTATION_PLAN_IDS = new Set<OrientationPlanId>(["general_v1"]);
const PUBLIC_ANSWER_LOCALES = new Set<PublicAnswerLocale>(["sk", "de", "en"]);

const COMPOSE_INPUT_KEYS = ["planId", "locale"] as const;

const RELEASED_TEXT_FIELDS: OrientationCoverageProof["releasedTextFields"] = ["summary", "meaning"];
const EMPTY_TEXT_FIELDS: OrientationCoverageProof["emptyTextFields"] = ["documentTypeLabel"];
const EMPTY_ARRAY_FIELDS: OrientationCoverageProof["emptyArrayFields"] = [
  "nextSteps",
  "warnings",
  "stabilizers",
  "deadlines",
  "rights",
  "obligations",
  "consequences",
];

/** Only summary and meaning carry non-zero UTF-16 text; empty label/arrays need no segments. */
const SMART_TALK_RESULT_KEYS: readonly (keyof SmartTalkResult)[] = [
  "summary",
  "meaning",
  "urgency",
  "nextSteps",
  "warnings",
  "stabilizers",
  "confidenceLevel",
  "consequencePhase",
  "documentQuality",
  "documentKind",
  "domain",
  "documentTypeLabel",
  "paymentChannel",
  "proceduralState",
  "legalSeverity",
  "deadlines",
  "rights",
  "obligations",
  "consequences",
];

const PROOF_KEYS: readonly (keyof OrientationCoverageProof)[] = [
  "planId",
  "locale",
  "segments",
  "releasedTextFields",
  "emptyTextFields",
  "emptyArrayFields",
];

const SEGMENT_KEYS = [
  "kind",
  "internalSegmentId",
  "fieldTemplateId",
  "locale",
  "destinationField",
] as const;

const ORIENTATION_ENUM_PROFILE: Readonly<{
  urgency: SmartTalkResult["urgency"];
  confidenceLevel: SmartTalkResult["confidenceLevel"];
  consequencePhase: SmartTalkResult["consequencePhase"];
  documentQuality: SmartTalkResult["documentQuality"];
  documentKind: SmartTalkResult["documentKind"];
  domain: SmartTalkResult["domain"];
  paymentChannel: SmartTalkResult["paymentChannel"];
  proceduralState: SmartTalkResult["proceduralState"];
  legalSeverity: SmartTalkResult["legalSeverity"];
}> = Object.freeze({
  urgency: "unknown",
  confidenceLevel: "low",
  consequencePhase: "none",
  documentQuality: "clear",
  documentKind: "unknown",
  domain: "unknown",
  paymentChannel: "not_applicable",
  proceduralState: "informational",
  legalSeverity: "none",
});

const LOCALIZED_COPY: Readonly<
  Record<
    PublicAnswerLocale,
    Readonly<{ summary: string; meaning: string }>
  >
> = Object.freeze({
  sk: Object.freeze({
    summary: "Vaylo Smart Talk v tejto verzii poskytuje len všeobecnú orientáciu.",
    meaning:
      "Vaylo Smart Talk v tejto verzii poskytuje len všeobecnú orientáciu. Na záväzné lehoty, formuláre, zoznam dokumentov, nároky alebo kontakty na úrad overte oficiálny zdroj v príslušnej krajine (Nemecko alebo Rakúsko) alebo upresnite svoju situáciu.",
  }),
  de: Object.freeze({
    summary: "Vaylo Smart Talk kann in dieser Version nur allgemeine Orientierung geben.",
    meaning:
      "Vaylo Smart Talk kann in dieser Version nur allgemeine Orientierung geben. Für verbindliche Fristen, Formulare, Dokumentenlisten, Ansprüche oder Behördenkontakte prüfen Sie bitte die zuständige offizielle Stelle in Deutschland oder Österreich oder konkretisieren Sie Ihre Situation.",
  }),
  en: Object.freeze({
    summary: "Vaylo Smart Talk can only provide general orientation in this version.",
    meaning:
      "Vaylo Smart Talk can only provide general orientation in this version. For binding deadlines, forms, document lists, entitlements, or authority contacts, verify the competent official source in Germany or Austria or clarify your situation.",
  }),
});

function throwInvalidOrientationInput(): never {
  throw new Error("invalid_public_orientation_input");
}

function isAllowedPlainPrototype(value: object): boolean {
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}

function isPlainDataObjectWithExactKeys(
  value: unknown,
  requiredKeys: readonly string[],
): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  if (!isAllowedPlainPrototype(value)) return false;
  if (Object.getOwnPropertySymbols(value).length > 0) return false;

  const ownNames = Object.getOwnPropertyNames(value);
  if (ownNames.length !== requiredKeys.length) return false;

  for (const key of requiredKeys) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) return false;
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor || descriptor.get || descriptor.set) return false;
    if (!Object.prototype.hasOwnProperty.call(descriptor, "value")) return false;
    if (descriptor.enumerable === false) return false;
  }

  for (const key of ownNames) {
    if (!requiredKeys.includes(key)) return false;
  }

  return true;
}

function readDataProperty(
  value: Record<string, unknown>,
  key: string,
): unknown {
  const descriptor = Object.getOwnPropertyDescriptor(value, key);
  if (!descriptor || descriptor.get || descriptor.set) return undefined;
  if (!Object.prototype.hasOwnProperty.call(descriptor, "value")) return undefined;
  try {
    const reflected = Reflect.get(value, key);
    if (!Object.is(reflected, descriptor.value)) return undefined;
    return reflected;
  } catch {
    return undefined;
  }
}

function isDenseDataArray(
  value: unknown,
  requiredLength: number,
): value is unknown[] {
  if (!Array.isArray(value)) return false;
  if (value.length !== requiredLength) return false;
  if (Object.getOwnPropertySymbols(value).length > 0) return false;

  const ownNames = Object.getOwnPropertyNames(value);
  const allowed = new Set<string>(["length"]);
  for (let index = 0; index < requiredLength; index += 1) {
    allowed.add(String(index));
  }
  for (const name of ownNames) {
    if (!allowed.has(name)) return false;
  }

  for (let index = 0; index < requiredLength; index += 1) {
    if (!Object.prototype.hasOwnProperty.call(value, index)) return false;
    const descriptor = Object.getOwnPropertyDescriptor(value, index);
    if (!descriptor || descriptor.get || descriptor.set) return false;
    if (!Object.prototype.hasOwnProperty.call(descriptor, "value")) return false;
  }

  return true;
}

function arraysEqualOrdered(a: readonly unknown[], b: readonly unknown[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function parseComposeInput(input: unknown): {
  planId: OrientationPlanId;
  locale: PublicAnswerLocale;
} {
  if (!isPlainDataObjectWithExactKeys(input, COMPOSE_INPUT_KEYS)) {
    throwInvalidOrientationInput();
  }
  const planId = readDataProperty(input, "planId");
  const locale = readDataProperty(input, "locale");
  if (!ORIENTATION_PLAN_IDS.has(planId as OrientationPlanId)) {
    throwInvalidOrientationInput();
  }
  if (!PUBLIC_ANSWER_LOCALES.has(locale as PublicAnswerLocale)) {
    throwInvalidOrientationInput();
  }
  try {
    if (!Object.is(Reflect.get(input, "planId"), planId)) throwInvalidOrientationInput();
    if (!Object.is(Reflect.get(input, "locale"), locale)) throwInvalidOrientationInput();
  } catch {
    throwInvalidOrientationInput();
  }
  return { planId: planId as OrientationPlanId, locale: locale as PublicAnswerLocale };
}

function computeInternalSegmentId(
  planId: OrientationPlanId,
  fieldTemplateId: OrientationFieldTemplateId,
  locale: PublicAnswerLocale,
  destinationField: OrientationDestinationField,
): string {
  const payload = `${planId}|${fieldTemplateId}|${locale}|${destinationField}`;
  return createHash("sha256").update(payload, "utf8").digest("hex");
}

function deepFreeze<T extends object>(value: T): T {
  for (const key of Object.getOwnPropertyNames(value)) {
    const child = (value as Record<string, unknown>)[key];
    if (child && typeof child === "object") {
      deepFreeze(child as object);
    }
  }
  return Object.freeze(value);
}

function buildInternalSegment(
  planId: OrientationPlanId,
  fieldTemplateId: OrientationFieldTemplateId,
  locale: PublicAnswerLocale,
  destinationField: OrientationDestinationField,
): InternalOrientationSegment {
  const segment = {
    kind: "orientation_field_template" as const,
    internalSegmentId: computeInternalSegmentId(planId, fieldTemplateId, locale, destinationField),
    fieldTemplateId,
    locale,
    destinationField,
  };
  return deepFreeze(segment);
}

function buildSmartTalkResult(locale: PublicAnswerLocale): SmartTalkResult {
  const copy = LOCALIZED_COPY[locale];
  const result: SmartTalkResult = {
    summary: copy.summary,
    meaning: copy.meaning,
    ...ORIENTATION_ENUM_PROFILE,
    documentTypeLabel: "",
    nextSteps: [],
    warnings: [],
    stabilizers: [],
    deadlines: [],
    rights: [],
    obligations: [],
    consequences: [],
  };
  for (const key of EMPTY_ARRAY_FIELDS) {
    Object.freeze(result[key]);
  }
  return deepFreeze(result);
}

export function composeOrientationResult(input: Readonly<{
  planId: OrientationPlanId;
  locale: PublicAnswerLocale;
}>): ComposeOrientationResult {
  let planId: OrientationPlanId;
  let locale: PublicAnswerLocale;
  try {
    ({ planId, locale } = parseComposeInput(input));
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "invalid_public_orientation_input") {
      throw error;
    }
    throwInvalidOrientationInput();
  }

  const summarySegment = buildInternalSegment(
    planId,
    "orientation_general_summary_v1",
    locale,
    "summary",
  );
  const meaningSegment = buildInternalSegment(
    planId,
    "orientation_general_meaning_v1",
    locale,
    "meaning",
  );

  const segments = deepFreeze([summarySegment, meaningSegment] as [
    InternalOrientationSegment,
    InternalOrientationSegment,
  ]);

  const proof: OrientationCoverageProof = deepFreeze({
    planId: "general_v1",
    locale,
    segments,
    releasedTextFields: RELEASED_TEXT_FIELDS,
    emptyTextFields: EMPTY_TEXT_FIELDS,
    emptyArrayFields: EMPTY_ARRAY_FIELDS,
  });

  Object.freeze(proof.releasedTextFields);
  Object.freeze(proof.emptyTextFields);
  Object.freeze(proof.emptyArrayFields);

  const output: ComposeOrientationResult = deepFreeze({
    result: buildSmartTalkResult(locale),
    proof,
  });

  return output;
}

function validateInternalSegment(value: unknown): InternalOrientationSegment | null {
  if (!isPlainDataObjectWithExactKeys(value, SEGMENT_KEYS)) return null;
  const record = value as Record<string, unknown>;
  const kind = readDataProperty(record, "kind");
  const internalSegmentId = readDataProperty(record, "internalSegmentId");
  const fieldTemplateId = readDataProperty(record, "fieldTemplateId");
  const locale = readDataProperty(record, "locale");
  const destinationField = readDataProperty(record, "destinationField");

  if (kind !== "orientation_field_template") return null;
  if (typeof internalSegmentId !== "string") return null;
  if (
    fieldTemplateId !== "orientation_general_summary_v1"
    && fieldTemplateId !== "orientation_general_meaning_v1"
  ) {
    return null;
  }
  if (!PUBLIC_ANSWER_LOCALES.has(locale as PublicAnswerLocale)) return null;
  if (destinationField !== "summary" && destinationField !== "meaning") return null;

  return {
    kind: "orientation_field_template",
    internalSegmentId,
    fieldTemplateId: fieldTemplateId as OrientationFieldTemplateId,
    locale: locale as PublicAnswerLocale,
    destinationField: destinationField as OrientationDestinationField,
  };
}

function verifyOrientationCoverageInternal(output: unknown): boolean {
  if (!isPlainDataObjectWithExactKeys(output, ["result", "proof"])) return false;

  const resultValue = readDataProperty(output, "result");
  const proofValue = readDataProperty(output, "proof");
  if (!isPlainDataObjectWithExactKeys(resultValue, SMART_TALK_RESULT_KEYS)) return false;
  if (!isPlainDataObjectWithExactKeys(proofValue, PROOF_KEYS)) return false;

  const result = resultValue as Record<string, unknown>;
  const proof = proofValue as Record<string, unknown>;

  const planId = readDataProperty(proof, "planId");
  const locale = readDataProperty(proof, "locale");
  if (planId !== "general_v1") return false;
  if (!PUBLIC_ANSWER_LOCALES.has(locale as PublicAnswerLocale)) return false;
  const proofLocale = locale as PublicAnswerLocale;

  const releasedTextFields = readDataProperty(proof, "releasedTextFields");
  const emptyTextFields = readDataProperty(proof, "emptyTextFields");
  const emptyArrayFields = readDataProperty(proof, "emptyArrayFields");
  if (!isDenseDataArray(releasedTextFields, RELEASED_TEXT_FIELDS.length)) return false;
  if (!isDenseDataArray(emptyTextFields, EMPTY_TEXT_FIELDS.length)) return false;
  if (!isDenseDataArray(emptyArrayFields, EMPTY_ARRAY_FIELDS.length)) return false;
  if (!arraysEqualOrdered(releasedTextFields, RELEASED_TEXT_FIELDS)) return false;
  if (!arraysEqualOrdered(emptyTextFields, EMPTY_TEXT_FIELDS)) return false;
  if (!arraysEqualOrdered(emptyArrayFields, EMPTY_ARRAY_FIELDS)) return false;

  const segments = readDataProperty(proof, "segments");
  if (!isDenseDataArray(segments, 2)) return false;
  const summarySegment = validateInternalSegment(segments[0]);
  const meaningSegment = validateInternalSegment(segments[1]);
  if (!summarySegment || !meaningSegment) return false;

  if (summarySegment.destinationField !== "summary") return false;
  if (meaningSegment.destinationField !== "meaning") return false;
  if (summarySegment.fieldTemplateId !== "orientation_general_summary_v1") return false;
  if (meaningSegment.fieldTemplateId !== "orientation_general_meaning_v1") return false;
  if (summarySegment.locale !== proofLocale) return false;
  if (meaningSegment.locale !== proofLocale) return false;

  const expectedSummaryId = computeInternalSegmentId(
    "general_v1",
    "orientation_general_summary_v1",
    proofLocale,
    "summary",
  );
  const expectedMeaningId = computeInternalSegmentId(
    "general_v1",
    "orientation_general_meaning_v1",
    proofLocale,
    "meaning",
  );
  if (summarySegment.internalSegmentId !== expectedSummaryId) return false;
  if (meaningSegment.internalSegmentId !== expectedMeaningId) return false;

  const summary = readDataProperty(result, "summary");
  const meaning = readDataProperty(result, "meaning");
  const documentTypeLabel = readDataProperty(result, "documentTypeLabel");
  if (typeof summary !== "string" || typeof meaning !== "string") return false;
  if (typeof documentTypeLabel !== "string") return false;

  const localized = LOCALIZED_COPY[proofLocale];
  if (summary !== localized.summary) return false;
  if (meaning !== localized.meaning) return false;
  if (documentTypeLabel !== "") return false;

  for (const field of EMPTY_ARRAY_FIELDS) {
    const arr = readDataProperty(result, field);
    if (!isDenseDataArray(arr, 0)) return false;
  }

  const enumChecks: Array<[keyof SmartTalkResult, string]> = [
    ["urgency", ORIENTATION_ENUM_PROFILE.urgency],
    ["confidenceLevel", ORIENTATION_ENUM_PROFILE.confidenceLevel],
    ["consequencePhase", ORIENTATION_ENUM_PROFILE.consequencePhase],
    ["documentQuality", ORIENTATION_ENUM_PROFILE.documentQuality],
    ["documentKind", ORIENTATION_ENUM_PROFILE.documentKind],
    ["domain", ORIENTATION_ENUM_PROFILE.domain],
    ["paymentChannel", ORIENTATION_ENUM_PROFILE.paymentChannel],
    ["proceduralState", ORIENTATION_ENUM_PROFILE.proceduralState],
    ["legalSeverity", ORIENTATION_ENUM_PROFILE.legalSeverity],
  ];
  for (const [key, expected] of enumChecks) {
    if (readDataProperty(result, key) !== expected) return false;
  }

  return true;
}

export function verifyOrientationCoverage(output: ComposeOrientationResult): boolean {
  try {
    return verifyOrientationCoverageInternal(output);
  } catch {
    return false;
  }
}
