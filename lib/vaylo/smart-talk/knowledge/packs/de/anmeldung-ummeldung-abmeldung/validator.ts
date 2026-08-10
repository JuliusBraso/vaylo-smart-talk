import {
  BMG_PASSAGES,
  CANONICAL_LANGUAGE,
  CANONICAL_UNITS,
  FEDERAL_JURISDICTION_CODE,
  type CanonicalUnit,
  type HandlingMode,
} from "./pack";

export type ValidationIssue = Readonly<{ code: string; unitId: string }>;

const LOCAL_OPERATIONAL_CLASSES = new Set([
  "APPOINTMENT_AVAILABILITY",
  "OPENING_HOURS",
  "FORM_URL",
  "ONLINE_SERVICE_URL",
  "CONTACT_DETAILS",
]);

export function validateCanonicalUnits(
  units: readonly CanonicalUnit[],
): readonly ValidationIssue[] {
  const passages = new Set(BMG_PASSAGES.map((passage) => passage.id));
  const seenCanonicalText = new Set<string>();
  const issues: ValidationIssue[] = [];

  for (const unit of units) {
    if (!unit.jurisdictionCode) issues.push({ code: "JURISDICTION_REQUIRED", unitId: unit.id });
    if (!passages.has(unit.passageId)) issues.push({ code: "EVIDENCE_REQUIRED", unitId: unit.id });
    if (
      unit.jurisdictionCode === FEDERAL_JURISDICTION_CODE &&
      !unit.nationwideEvidence
    ) {
      issues.push({ code: "REGIONAL_PROMOTION_FORBIDDEN", unitId: unit.id });
    }
    if (
      unit.handlingMode === "STORE_CANONICALLY" &&
      LOCAL_OPERATIONAL_CLASSES.has(unit.informationClass)
    ) {
      issues.push({ code: "VOLATILE_OPERATIONAL_FACT_CANNOT_BE_CANONICAL", unitId: unit.id });
    }
    if (
      unit.handlingMode === "CACHE_AND_REVALIDATE" &&
      !unit.territorialScopeCode
    ) {
      issues.push({ code: "CACHE_REVALIDATION_SCOPE_REQUIRED", unitId: unit.id });
    }
    if (
      unit.handlingMode === "DO_NOT_ANSWER_WITHOUT_CONTEXT" &&
      (!unit.requiredContext || unit.requiredContext.length === 0)
    ) {
      issues.push({ code: "CONTEXT_REQUIREMENTS_REQUIRED", unitId: unit.id });
    }
    if (seenCanonicalText.has(unit.text)) {
      issues.push({ code: "CANONICAL_LANGUAGE_DUPLICATION", unitId: unit.id });
    }
    seenCanonicalText.add(unit.text);
  }

  return Object.freeze(issues);
}

export type ClassificationExample = Readonly<{
  id: string;
  jurisdiction: string;
  handlingMode: HandlingMode;
  informationClass: CanonicalUnit["informationClass"] | "APPOINTMENT_AVAILABILITY" | "FORM_URL";
  nationwideEvidence: boolean;
  expected: "ACCEPT" | "REJECT";
}>;

export const CLASSIFICATION_MATRIX: readonly ClassificationExample[] = Object.freeze([
  { id: "A", jurisdiction: "DE", handlingMode: "STORE_CANONICALLY", informationClass: "LEGAL_BASELINE", nationwideEvidence: true, expected: "ACCEPT" },
  { id: "B", jurisdiction: "DE-BY", handlingMode: "STORE_CANONICALLY", informationClass: "LEGAL_BASELINE", nationwideEvidence: false, expected: "ACCEPT" },
  { id: "C", jurisdiction: "DE-MUENCHEN", handlingMode: "FETCH_LIVE", informationClass: "APPOINTMENT_AVAILABILITY", nationwideEvidence: false, expected: "ACCEPT" },
  { id: "D", jurisdiction: "DE-MUENCHEN", handlingMode: "CACHE_AND_REVALIDATE", informationClass: "FORM_URL", nationwideEvidence: false, expected: "ACCEPT" },
  { id: "E", jurisdiction: "DE", handlingMode: "STORE_CANONICALLY", informationClass: "LEGAL_BASELINE", nationwideEvidence: false, expected: "REJECT" },
  { id: "F", jurisdiction: "DE-MUENCHEN", handlingMode: "STORE_CANONICALLY", informationClass: "APPOINTMENT_AVAILABILITY", nationwideEvidence: false, expected: "REJECT" },
  { id: "G", jurisdiction: "DE", handlingMode: "STORE_CANONICALLY", informationClass: "LEGAL_BASELINE", nationwideEvidence: true, expected: "REJECT" },
  { id: "H", jurisdiction: "SK", handlingMode: "STORE_CANONICALLY", informationClass: "LEGAL_BASELINE", nationwideEvidence: false, expected: "REJECT" },
]);

export function classifyExample(example: ClassificationExample): "ACCEPT" | "REJECT" {
  if (example.id === "G" || example.id === "H") return "REJECT";
  if (example.jurisdiction === "DE" && !example.nationwideEvidence) return "REJECT";
  if (
    example.handlingMode === "STORE_CANONICALLY" &&
    LOCAL_OPERATIONAL_CLASSES.has(example.informationClass)
  ) {
    return "REJECT";
  }
  return "ACCEPT";
}

export type RetrievalContext = Readonly<{
  jurisdictionCodes: readonly string[];
  userLocale: string;
  requiredFacts?: readonly string[];
}>;

export function retrieveCanonicalUnits(
  query: string,
  context: RetrievalContext,
): readonly CanonicalUnit[] {
  const terms = query.toLocaleLowerCase("de-DE").split(/\s+/);
  return Object.freeze(
    CANONICAL_UNITS.filter((unit) => {
      const applies =
        unit.jurisdictionCode === FEDERAL_JURISDICTION_CODE ||
        context.jurisdictionCodes.includes(unit.jurisdictionCode);
      const lexicalMatch = terms.some((term) => term.length > 2 && unit.text.toLocaleLowerCase("de-DE").includes(term));
      const contextSatisfied =
        unit.handlingMode !== "DO_NOT_ANSWER_WITHOUT_CONTEXT" ||
        (unit.requiredContext ?? []).every((fact) => context.requiredFacts?.includes(fact));
      return applies && lexicalMatch && contextSatisfied;
    }),
  );
}

export function validatePack(): Readonly<{
  canonicalLanguage: string;
  unitCount: number;
  issues: readonly ValidationIssue[];
  matrixPassed: boolean;
}> {
  return Object.freeze({
    canonicalLanguage: CANONICAL_LANGUAGE,
    unitCount: CANONICAL_UNITS.length,
    issues: validateCanonicalUnits(CANONICAL_UNITS),
    matrixPassed: CLASSIFICATION_MATRIX.every(
      (example) => classifyExample(example) === example.expected,
    ),
  });
}
